"use server";

import { z } from "zod";
import { requireExecutionOwner } from "@/lib/execution-auth";
import { generationInputSchema, missionSchema, type GeneratedMission } from "@/lib/execution-types";
import { getMissionProvider } from "@/lib/ai/mission-provider";
import { completeStoredMission, getProject, logGeneration, saveMission, updateProject } from "@/lib/execution-store";
import { validateMissionQuality } from "@/lib/mission-quality";

export type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };
const buckets = new Map<string, { count: number; resetAt: number }>();

function rateLimit(owner: string) {
  const now = Date.now(); const bucket = buckets.get(owner);
  if (!bucket || bucket.resetAt < now) { buckets.set(owner, { count: 1, resetAt: now + 60_000 }); return false; }
  bucket.count += 1; return bucket.count > 8;
}

export async function generateMission(raw: unknown, options?: { adjustment?: string; field?: keyof GeneratedMission; currentMission?: GeneratedMission }): Promise<ActionResult<{ mission: GeneratedMission; warnings: string[] }>> {
  let owner = "unknown"; const started = Date.now();
  try {
    owner = await requireExecutionOwner();
    if (rateLimit(owner)) return { ok: false, error: "Too many AI requests. Wait one minute, then retry." };
    const input = generationInputSchema.parse(raw);
    const currentMission = options?.currentMission ? missionSchema.parse(options.currentMission) : undefined;
    const project = await getProject(owner, input.projectId);
    const result = await getMissionProvider().generate({ input, project, adjustment: options?.adjustment?.slice(0, 120), field: options?.field, currentMission });
    const mission = options?.field && currentMission ? { ...currentMission, [options.field]: result.mission[options.field] } : result.mission;
    const quality = validateMissionQuality(mission, input.availableTimeMinutes, project.recentMissions?.map((item) => item.title));
    await logGeneration(owner, { model: result.model, latency_ms: result.latencyMs, token_usage: result.usage ?? {}, request_success: true, schema_valid: true, quality_valid: quality.valid });
    if (!quality.valid) return { ok: false, error: `The proposal failed its quality check: ${quality.warnings.join(" ")}` };
    return { ok: true, data: { mission, warnings: quality.warnings } };
  } catch (error) {
    const message = error instanceof z.ZodError ? "Mission input or AI output was invalid." : error instanceof Error ? error.message : "Mission generation failed.";
    try { await logGeneration(owner, { model: process.env.AI_MISSION_MODEL ?? "gpt-5.6-luna", latency_ms: Date.now() - started, request_success: false, schema_valid: !(error instanceof z.ZodError), error_code: message.slice(0, 120) }); } catch {}
    return { ok: false, error: message };
  }
}

export async function persistMission(raw: { projectId: string; energy: string; mission: unknown; status: "draft" | "active" }): Promise<ActionResult<{ id: string }>> {
  try { const owner = await requireExecutionOwner(); const mission = missionSchema.parse(raw.mission); await getProject(owner, raw.projectId); const id = await saveMission(owner, raw.projectId, raw.energy, mission, raw.status); return { ok: true, data: { id } }; }
  catch (error) { return { ok: false, error: error instanceof Error ? error.message : "Could not save the mission." }; }
}

const completionSchema = z.object({ missionId: z.string().uuid(), outcomeAchieved: z.boolean(), actualMetric: z.string().min(1).max(300), confidenceAfter: z.number().int().min(1).max(10), learning: z.string().min(3).max(2000), assumptionUpdate: z.string().min(3).max(1000), nextMissionSuggestion: z.string().max(1000), evidence: z.array(z.object({ type: z.string(), title: z.string().min(3).max(180), description: z.string().min(3).max(1000), url: z.string().url().optional().or(z.literal("")), metricName: z.string().max(120).optional(), metricValue: z.string().max(120).optional(), visibility: z.enum(["private", "portfolio", "public"]) })).max(8) });

export async function completeMission(raw: unknown): Promise<ActionResult<null>> {
  try { const owner = await requireExecutionOwner(); const input = completionSchema.parse(raw); await completeStoredMission(owner, input); return { ok: true, data: null }; }
  catch (error) { return { ok: false, error: error instanceof Error ? error.message : "Could not complete the mission." }; }
}

const projectUpdateSchema = z.object({ id: z.string().uuid(), description: z.string().max(1000), stage: z.string().max(100), targetCustomer: z.string().max(1000), customerProblem: z.string().max(1500), valueProposition: z.string().max(1500), currentPriority: z.string().max(1000), currentBottleneck: z.string().max(1000), currentMetrics: z.array(z.string().max(300)).max(30), currentRisks: z.array(z.string().max(300)).max(30), activeMilestones: z.array(z.string().max(300)).max(30), openAssumptions: z.array(z.string().max(500)).max(30), productUrls: z.array(z.string().url()).max(20), repositoryUrls: z.array(z.string().url()).max(20), contextNotes: z.string().max(4000) });
export async function updateProjectContext(raw: unknown): Promise<ActionResult<null>> {
  try { const owner = await requireExecutionOwner(); const input = projectUpdateSchema.parse(raw); await getProject(owner, input.id); await updateProject(owner, input.id, input); return { ok: true, data: null }; }
  catch (error) { return { ok: false, error: error instanceof Error ? error.message : "Could not update project context." }; }
}
