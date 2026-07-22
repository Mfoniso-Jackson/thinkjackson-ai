import "server-only";
import type { GeneratedMission, ProjectContext } from "@/lib/execution-types";
import { initialProjectContexts } from "@/lib/execution-context";

type DbRow = Record<string, unknown>;

function config() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ""), key };
}

async function db(path: string, init: RequestInit = {}) {
  const configured = config();
  if (!configured) throw new Error("Execution storage is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  const response = await fetch(`${configured.url}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: configured.key, authorization: `Bearer ${configured.key}`, "content-type": "application/json", prefer: "return=representation", ...init.headers },
    cache: "no-store"
  });
  if (!response.ok) throw new Error(`Execution storage failed (${response.status}).`);
  if (response.status === 204) return [];
  return response.json() as Promise<DbRow[]>;
}

function toContext(row: DbRow): ProjectContext {
  return {
    id: String(row.id), name: String(row.name), slug: String(row.slug), description: String(row.description ?? ""), stage: String(row.stage ?? ""),
    targetCustomer: String(row.target_customer ?? ""), customerProblem: String(row.customer_problem ?? ""), valueProposition: String(row.value_proposition ?? ""),
    currentPriority: String(row.current_priority ?? ""), currentBottleneck: String(row.current_bottleneck ?? ""), currentMetrics: (row.current_metrics as string[]) ?? [],
    currentRisks: (row.current_risks as string[]) ?? [], activeMilestones: (row.active_milestones as string[]) ?? [], openAssumptions: (row.open_assumptions as string[]) ?? [],
    productUrls: (row.product_urls as string[]) ?? [], repositoryUrls: (row.repository_urls as string[]) ?? [], contextNotes: String(row.context_notes ?? "")
  };
}

export async function listProjects(ownerId: string) {
  if (!config()) return initialProjectContexts;
  const rows = await db(`execution_projects?owner_id=eq.${encodeURIComponent(ownerId)}&select=*&order=name`);
  return rows.map(toContext);
}

export async function getProject(ownerId: string, projectId: string) {
  const projects = await listProjects(ownerId);
  const project = projects.find((item) => item.id === projectId);
  if (!project) throw new Error("Project not found or not owned by this account.");
  if (!config()) return project;
  const missions = await db(`execution_missions?owner_id=eq.${encodeURIComponent(ownerId)}&project_id=eq.${projectId}&select=title,status,completed_at&order=created_at.desc&limit=8`);
  const evidence = await db(`execution_evidence?owner_id=eq.${encodeURIComponent(ownerId)}&project_id=eq.${projectId}&select=type,title,metric_name,metric_value&order=created_at.desc&limit=8`);
  return { ...project, recentMissions: missions.map((m) => ({ title: String(m.title), status: String(m.status), completedAt: m.completed_at ? String(m.completed_at) : undefined })), recentEvidence: evidence.map((e) => ({ type: String(e.type), title: String(e.title), metric: e.metric_name ? `${e.metric_name}: ${e.metric_value ?? ""}` : undefined })) };
}

export async function saveMission(ownerId: string, projectId: string, energy: string, mission: GeneratedMission, status: "draft" | "active") {
  const [row] = await db("execution_missions", { method: "POST", body: JSON.stringify({ owner_id: ownerId, project_id: projectId, title: mission.missionTitle, desired_outcome: mission.desiredOutcome, why_it_matters: mission.whyItMatters, definition_of_done: mission.definitionOfDone, mission_type: mission.missionType, primary_risk: mission.primaryRisk, assumption_being_tested: mission.assumptionBeingTested, success_metric_name: mission.successMetric.name, success_metric_target: mission.successMetric.target, confidence_before: mission.confidenceBefore, estimated_minutes: mission.recommendedTimeMinutes, energy, status, reasoning_summary: mission.reasoningSummary, public_build_angle: mission.publicBuildAngle, do_not_work_on: mission.doNotWorkOn, end_review_questions: mission.endReviewQuestions, expected_evidence: mission.expectedEvidence, started_at: status === "active" ? new Date().toISOString() : null }) });
  const missionId = String(row.id);
  await db("execution_mission_tasks", { method: "POST", body: JSON.stringify(mission.tasks.map((task, index) => ({ owner_id: ownerId, mission_id: missionId, title: task.title, description: task.description, sort_order: index + 1, estimated_minutes: task.estimatedMinutes }))) });
  return missionId;
}

export async function getActiveMission(ownerId: string) {
  if (!config()) return null;
  const rows = await db(`execution_missions?owner_id=eq.${encodeURIComponent(ownerId)}&status=eq.active&select=*,execution_projects(name),execution_mission_tasks(*)&order=started_at.desc&limit=1`);
  return rows[0] ?? null;
}

export async function completeStoredMission(ownerId: string, input: { missionId: string; outcomeAchieved: boolean; actualMetric: string; confidenceAfter: number; learning: string; assumptionUpdate: string; nextMissionSuggestion: string; evidence: Array<{ type: string; title: string; description: string; url?: string; metricName?: string; metricValue?: string; visibility: string }> }) {
  await db(`execution_missions?id=eq.${input.missionId}&owner_id=eq.${encodeURIComponent(ownerId)}`, { method: "PATCH", body: JSON.stringify({ status: "completed", confidence_after: input.confidenceAfter, completed_at: new Date().toISOString() }) });
  await db("execution_mission_reviews", { method: "POST", body: JSON.stringify({ owner_id: ownerId, mission_id: input.missionId, outcome_achieved: input.outcomeAchieved, actual_metric: input.actualMetric, learning: input.learning, assumption_update: input.assumptionUpdate, next_mission_suggestion: input.nextMissionSuggestion }) });
  if (input.evidence.length) await db("execution_evidence", { method: "POST", body: JSON.stringify(input.evidence.map((item) => ({ ...item, owner_id: ownerId, mission_id: input.missionId, url: item.url || null, metric_name: item.metricName || null, metric_value: item.metricValue || null }))) });
}

export async function logGeneration(ownerId: string, metadata: Record<string, unknown>) {
  if (!config()) return;
  await db("execution_ai_logs", { method: "POST", body: JSON.stringify({ owner_id: ownerId, ...metadata }) });
}

export async function updateProject(ownerId: string, projectId: string, values: Partial<ProjectContext>) {
  await db(`execution_projects?id=eq.${projectId}&owner_id=eq.${encodeURIComponent(ownerId)}`, { method: "PATCH", body: JSON.stringify({ description: values.description, stage: values.stage, target_customer: values.targetCustomer, customer_problem: values.customerProblem, value_proposition: values.valueProposition, current_priority: values.currentPriority, current_bottleneck: values.currentBottleneck, current_metrics: values.currentMetrics, current_risks: values.currentRisks, active_milestones: values.activeMilestones, open_assumptions: values.openAssumptions, product_urls: values.productUrls, repository_urls: values.repositoryUrls, context_notes: values.contextNotes, updated_at: new Date().toISOString() }) });
}
