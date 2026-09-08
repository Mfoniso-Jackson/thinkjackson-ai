import { pipelineStages } from "@/data/sales-config";
import type { FollowUpTask, Lead, Opportunity, Proposal, SalesEvidenceAsset } from "@/lib/sales-types";
import { validateOpportunityNextAction } from "@/lib/sales-validation";

/**
 * Proposals and evidence assets aren't wired to a real store yet — only
 * leads, opportunities, and tasks are (see lib/sales-store.ts). Pages that
 * need proposals pass an empty array here rather than reading a fake
 * module-level list, so it's obvious at the call site what's still a
 * placeholder.
 */
export const proposals: Proposal[] = [];
export const salesEvidenceAssets: SalesEvidenceAsset[] = [];

export const emptyPipelineMessage = "No records yet. Leads, opportunities, and tasks read live from Supabase.";

/**
 * Pure aggregation over already-fetched data rather than reading a module
 * store — pages fetch leads/opportunities/tasks from lib/sales-store.ts
 * (server-only, hits Supabase) and pass the results in here, keeping this
 * function testable without I/O and usable from any page that has the data.
 */
export function getPipelineOverview(input: { leads: Lead[]; opportunities: Opportunity[]; tasks: FollowUpTask[] }) {
  const { leads, opportunities, tasks } = input;
  const activeOpportunities = opportunities.filter((opportunity) => pipelineStages.find((stage) => stage.value === opportunity.stage)?.active);
  const pipelineValue = activeOpportunities.reduce((sum, opportunity) => sum + (opportunity.estimatedValue ?? 0), 0);
  const weightedValue = activeOpportunities.reduce(
    (sum, opportunity) => sum + (opportunity.estimatedValue ?? 0) * ((opportunity.probability ?? 0) / 100),
    0
  );
  const today = new Date().toISOString().slice(0, 10);

  return {
    totalActiveLeads: leads.filter((lead) => lead.status !== "archived").length,
    qualifiedOpportunities: activeOpportunities.filter((opportunity) => opportunity.stage === "qualified").length,
    meetingsScheduled: activeOpportunities.filter((opportunity) => opportunity.stage === "discovery-scheduled").length,
    proposalsSent: activeOpportunities.filter((opportunity) => opportunity.stage === "proposal-sent").length,
    pipelineValue,
    weightedValue,
    overdueFollowUps: tasks.filter((task) => task.status === "open" && task.dueDate < today).length,
    recentlyWon: opportunities.filter((opportunity) => opportunity.stage === "won").length,
    stalledOpportunities: activeOpportunities.filter((opportunity) => !opportunity.lastInteractionAt).length
  };
}

export type PipelineOverview = ReturnType<typeof getPipelineOverview>;
export type TodayQueue = ReturnType<typeof getTodayQueue>;

export function getTodayQueue(input: { leads: Lead[]; opportunities: Opportunity[]; tasks: FollowUpTask[]; proposals: Proposal[] }) {
  const { leads, opportunities, tasks, proposals: proposalList } = input;
  const today = new Date().toISOString().slice(0, 10);
  const activeOpportunities = opportunities.filter((opportunity) => pipelineStages.find((stage) => stage.value === opportunity.stage)?.active);

  return {
    overdueTasks: tasks.filter((task) => task.status === "open" && task.dueDate < today),
    dueToday: tasks.filter((task) => task.status === "open" && task.dueDate === today),
    proposalsAwaitingAction: proposalList.filter((proposal) => proposal.status === "draft" || proposal.status === "review"),
    highPriorityLeadsWithoutActivity: leads.filter((lead) => lead.status === "new"),
    opportunitiesWithNoNextStep: activeOpportunities.filter((opportunity) => !validateOpportunityNextAction(opportunity).ok),
    stalledOpportunities: activeOpportunities.filter((opportunity) => !opportunity.lastInteractionAt)
  };
}
