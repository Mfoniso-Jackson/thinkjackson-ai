import { AdminPageHeader, EmptyAdminState } from "@/components/admin-sales";
import { CreateTaskForm, LogInteractionForm, UpdateStageForm } from "@/components/sales-admin-forms";
import { leadIntentLabels, pipelineStages } from "@/data/sales-config";
import { listInteractions, listOpportunities, listSalesLeads } from "@/lib/sales-store";
import { formatDate } from "@/lib/utils";
import { isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function SalesOpportunitiesPage() {
  const [opportunities, leads] = await Promise.all([listOpportunities(), listSalesLeads()]);
  const leadsById = new Map(leads.map((lead) => [lead.id, lead]));
  const interactionsByOpportunity = await Promise.all(opportunities.map((opportunity) => listInteractions(opportunity.id)));

  return (
    <div className="grid gap-10">
      <AdminPageHeader eyebrow="Opportunities" title="Qualified commercial motion.">
        <p>Investor, customer, partner, grant, and research opportunities move here after review and next-action assignment.</p>
      </AdminPageHeader>

      {!isSupabaseConfigured() ? (
        <EmptyAdminState title="Supabase is not configured." detail="Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY." />
      ) : opportunities.length === 0 ? (
        <EmptyAdminState title="No opportunities yet." detail="Promote a lead from /admin/sales/leads to start one." />
      ) : (
        <div className="grid gap-6">
          {opportunities.map((opportunity, index) => {
            const lead = leadsById.get(opportunity.leadId);
            const interactions = interactionsByOpportunity[index];
            const stageLabel = pipelineStages.find((stage) => stage.value === opportunity.stage)?.label ?? opportunity.stage;

            return (
              <div key={opportunity.id} className="rounded-lg border border-line bg-white/[0.035] p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-signal">
                      {leadIntentLabels[opportunity.opportunityType] ?? opportunity.opportunityType} · {stageLabel}
                    </p>
                    <p className="mt-1 text-base font-semibold text-white">{lead?.fullName ?? "No linked lead"}</p>
                    {lead ? (
                      <p className="text-xs text-steel">
                        {lead.email} {lead.organisation ? `· ${lead.organisation}` : ""}
                      </p>
                    ) : null}
                    <p className="mt-2 text-xs text-steel">
                      {opportunity.priority} priority
                      {opportunity.ventureSlug ? ` · ${opportunity.ventureSlug}` : ""}
                      {opportunity.owner ? ` · owner ${opportunity.owner}` : ""}
                    </p>
                  </div>
                  <div className="text-right text-xs text-steel">
                    {opportunity.nextAction ? (
                      <p>
                        Next: {opportunity.nextAction}
                        {opportunity.nextActionDate ? ` (${formatDate(opportunity.nextActionDate)})` : ""}
                      </p>
                    ) : (
                      <p className="text-volt">No next action set.</p>
                    )}
                    <p className="mt-1">
                      {opportunity.lastInteractionAt ? `Last touch ${formatDate(opportunity.lastInteractionAt)}` : "No interaction logged yet"}
                    </p>
                  </div>
                </div>

                {interactions.length > 0 ? (
                  <details className="mt-4">
                    <summary className="cursor-pointer text-xs font-semibold text-signal">
                      Conversation history ({interactions.length})
                    </summary>
                    <ul className="mt-3 grid gap-2">
                      {interactions.map((interaction) => (
                        <li key={interaction.id} className="rounded-md border border-line bg-white/[0.02] p-3 text-xs text-steel">
                          <p className="font-mono uppercase tracking-[0.12em] text-white">
                            {interaction.type} · {formatDate(interaction.occurredAt)}
                          </p>
                          <p className="mt-1">{interaction.summary}</p>
                          {interaction.nextStep ? <p className="mt-1 text-steel/80">Next: {interaction.nextStep}</p> : null}
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : null}

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <LogInteractionForm opportunityId={opportunity.id} />
                  <UpdateStageForm opportunity={opportunity} />
                </div>
                <details className="mt-3">
                  <summary className="cursor-pointer text-xs font-semibold text-signal">Add a follow-up task</summary>
                  <div className="mt-2">
                    <CreateTaskForm opportunityId={opportunity.id} />
                  </div>
                </details>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
