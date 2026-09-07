import "server-only";
import { generate } from "@/lib/ai/runtime";
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

/**
 * Previously its own standalone OpenAI-only fetch — a real single point of
 * failure, exactly the "dependent on one provider" problem the AI Runtime
 * exists to avoid. Now a thin caller of the shared runtime, same as Scout
 * and Researcher: same registry, same failover, same telemetry.
 */
class RuntimeMissionProvider implements MissionProvider {
  async generate(request: MissionGenerationRequest): Promise<MissionGenerationResult> {
    const result = await generate(
      {
        task: "mission",
        agentName: "Mission",
        jsonSchema: { name: "daily_mission", schema },
        systemPrompt,
        input: { project: request.project, today: request.input, adjustment: request.adjustment, regenerateField: request.field, currentMission: request.currentMission }
      },
      (raw) => {
        const parsed = missionSchema.safeParse(raw);
        if (!parsed.success) throw new Error("The AI response did not match the mission schema. Please regenerate.");
        return parsed.data;
      }
    );

    return { mission: result.output, model: result.model, latencyMs: result.latencyMs, usage: result.usage };
  }
}

export function getMissionProvider(): MissionProvider {
  return new RuntimeMissionProvider();
}
