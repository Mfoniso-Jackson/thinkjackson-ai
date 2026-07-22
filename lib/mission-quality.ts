import type { GeneratedMission } from "@/lib/execution-types";

export type MissionQualityResult = { valid: boolean; warnings: string[] };

const weakOpeners = /^(work on|improve|build the product|do marketing|research competitors)\b/i;
const actionVerb = /^(deploy|interview|publish|send|record|validate|create|measure|test|ship|contact|analyse|analyze|run|write|configure|review|secure|close|schedule|instrument|benchmark|present|document)\b/i;

export function validateMissionQuality(mission: GeneratedMission, availableMinutes: number, recentTitles: string[] = []): MissionQualityResult {
  const warnings: string[] = [];
  const taskMinutes = mission.tasks.reduce((total, task) => total + task.estimatedMinutes, 0);

  if (mission.tasks.length > 3) warnings.push("A mission may contain no more than three tasks.");
  if (taskMinutes > availableMinutes || mission.recommendedTimeMinutes > availableMinutes) warnings.push("The mission exceeds today’s available time.");
  if (weakOpeners.test(mission.missionTitle)) warnings.push("The mission title is too generic.");
  if (mission.tasks.some((task) => weakOpeners.test(task.title) || !actionVerb.test(task.title))) warnings.push("Every task must begin with a concrete action verb.");
  if (!mission.successMetric.name.trim() || !mission.successMetric.target.trim()) warnings.push("The mission needs a measurable success metric.");
  if (mission.expectedEvidence.some((evidence) => /^(evidence|progress|results?|notes?)$/i.test(evidence.description.trim()))) warnings.push("Expected evidence must name an objective artifact or result.");
  if (recentTitles.some((title) => title.toLowerCase() === mission.missionTitle.toLowerCase())) warnings.push("This repeats a recent mission without justification.");
  if (mission.desiredOutcome.split(/\band\b/i).length > 3) warnings.push("The desired outcome may contain multiple unrelated outcomes.");

  return { valid: warnings.length === 0, warnings };
}
