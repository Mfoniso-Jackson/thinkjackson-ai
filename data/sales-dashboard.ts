import { pipelineStages } from "@/data/sales-config";
import type { FollowUpTask, Lead, Opportunity, Proposal, SalesEvidenceAsset } from "@/lib/sales-types";
import { validateOpportunityNextAction } from "@/lib/sales-validation";

export const leads: Lead[] = [];
export const opportunities: Opportunity[] = [];
export const tasks: FollowUpTask[] = [];
export const proposals: Proposal[] = [];
export const salesEvidenceAssets: SalesEvidenceAsset[] = [];

export const emptyPipelineMessage =
  "No private CRM data is stored in the repository. Connect SALES_LEAD_WEBHOOK_URL or Supabase before using this as the system of record.";

export function getPipelineOverview() {
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

export function getTodayQueue() {
  const today = new Date().toISOString().slice(0, 10);
  const activeOpportunities = opportunities.filter((opportunity) => pipelineStages.find((stage) => stage.value === opportunity.stage)?.active);

  return {
    overdueTasks: tasks.filter((task) => task.status === "open" && task.dueDate < today),
    dueToday: tasks.filter((task) => task.status === "open" && task.dueDate === today),
    proposalsAwaitingAction: proposals.filter((proposal) => proposal.status === "draft" || proposal.status === "review"),
    highPriorityLeadsWithoutActivity: leads.filter((lead) => lead.status === "new"),
    opportunitiesWithNoNextStep: activeOpportunities.filter((opportunity) => !validateOpportunityNextAction(opportunity).ok),
    stalledOpportunities: activeOpportunities.filter((opportunity) => !opportunity.lastInteractionAt)
  };
}
