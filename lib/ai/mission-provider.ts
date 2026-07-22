import "server-only";
import { missionSchema, type GeneratedMission, type GenerationInput, type ProjectContext } from "@/lib/execution-types";

export type MissionGenerationRequest = { input: GenerationInput; project: ProjectContext; adjustment?: string; field?: keyof GeneratedMission; currentMission?: GeneratedMission };
export type MissionGenerationResult = { mission: GeneratedMission; model: string; latencyMs: number; usage?: Record<string, unknown> };
export interface MissionProvider { generate(request: MissionGenerationRequest): Promise<MissionGenerationResult>; }

const schema = {
  type: "object", additionalProperties: false,
  required: ["missionTitle", "desiredOutcome", "whyItMatters", "definitionOfDone", "tasks", "expectedEvidence", "missionType", "primaryRisk", "assumptionBeingTested", "successMetric", "confidenceBefore", "recommendedTimeMinutes", "doNotWorkOn", "publicBuildAngle", "endReviewQuestions", "reasoningSummary"],
  properties: {
    missionTitle: { type: "string" }, desiredOutcome: { type: "string" }, whyItMatters: { type: "string" }, definitionOfDone: { type: "string" },
    tasks: { type: "array", minItems: 1, maxItems: 3, items: { type: "object", additionalProperties: false, required: ["title", "description", "estimatedMinutes"], properties: { title: { type: "string" }, description: { type: "string" }, estimatedMinutes: { type: "integer" } } } },
    expectedEvidence: { type: "array", minItems: 1, items: { type: "object", additionalProperties: false, required: ["type", "description"], properties: { type: { type: "string", enum: ["deployment", "customer_feedback", "revenue", "usage", "research", "content", "partnership", "benchmark", "other"] }, description: { type: "string" } } } },
    missionType: { type: "string", enum: ["Research", "Build", "Product", "Growth", "Sales", "Distribution", "Capital", "Operations", "Systems", "Partnerships"] },
    primaryRisk: { type: "string", enum: ["Market risk", "Distribution risk", "Product risk", "Technical risk", "Competition risk", "Economic risk", "Regulatory risk", "Execution risk", "Capital risk", "Data risk"] },
    assumptionBeingTested: { type: "string" }, successMetric: { type: "object", additionalProperties: false, required: ["name", "target"], properties: { name: { type: "string" }, target: { type: "string" } } },
    confidenceBefore: { type: "integer", minimum: 1, maximum: 10 }, recommendedTimeMinutes: { type: "integer" }, doNotWorkOn: { type: "array", items: { type: "string" } }, publicBuildAngle: { type: "string" }, endReviewQuestions: { type: "array", items: { type: "string" } }, reasoningSummary: { type: "string" }
  }
};

const systemPrompt = `You are the AI Chief of Staff inside a founder execution operating system. Act as a product strategist, execution coach, and venture risk analyst—not a motivational assistant. Convert project context, strategic risks, available time, energy, recent work, and bottlenecks into exactly one high-leverage daily mission. Reduce the largest unresolved business risk and produce visible evidence. Prefer customer, revenue, retention, distribution, product, then technical evidence. Do not default to code. Use one measurable outcome and no more than three tasks. Every task starts with a strong action verb. Fit the mission inside the available time. Explicitly state what to ignore. The reasoningSummary is a short user-facing rationale only; never reveal hidden reasoning.`;

class OpenAIMissionProvider implements MissionProvider {
  async generate(request: MissionGenerationRequest): Promise<MissionGenerationResult> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("AI mission generation is not configured. Set OPENAI_API_KEY.");
    const model = process.env.AI_MISSION_MODEL ?? "gpt-5.6-luna";
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);
    const started = Date.now();
    try {
      const response = await fetch("https://api.openai.com/v1/responses", { method: "POST", signal: controller.signal, headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" }, body: JSON.stringify({ model, store: false, instructions: systemPrompt, input: JSON.stringify({ project: request.project, today: request.input, adjustment: request.adjustment, regenerateField: request.field, currentMission: request.currentMission }), text: { format: { type: "json_schema", name: "daily_mission", strict: true, schema } } }) });
      if (!response.ok) {
        const retry = response.headers.get("retry-after");
        if (response.status === 429) throw new Error(`AI generation is rate limited.${retry ? ` Retry after ${retry} seconds.` : " Please retry shortly."}`);
        throw new Error(`AI provider request failed (${response.status}). Please retry.`);
      }
      const payload = await response.json() as { output_text?: string; output?: Array<{ content?: Array<{ type?: string; text?: string }> }>; usage?: Record<string, unknown> };
      const text = payload.output_text ?? payload.output?.flatMap((item) => item.content ?? []).find((item) => item.type === "output_text")?.text;
      if (!text) throw new Error("The AI provider returned an empty response. Please retry.");
      const parsed = missionSchema.safeParse(JSON.parse(text));
      if (!parsed.success) throw new Error("The AI response did not match the mission schema. Please regenerate.");
      return { mission: parsed.data, model, latencyMs: Date.now() - started, usage: payload.usage };
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") throw new Error("AI generation timed out. Please retry.");
      throw error;
    } finally { clearTimeout(timeout); }
  }
}

export function getMissionProvider(): MissionProvider { return new OpenAIMissionProvider(); }
