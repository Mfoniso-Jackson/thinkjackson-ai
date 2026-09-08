import { AdminPageHeader, EmptyAdminState, PipelineStageGrid } from "@/components/admin-sales";
import { UpdateStageForm } from "@/components/sales-admin-forms";
import { formatDate } from "@/lib/utils";
import { listOpportunities } from "@/lib/sales-store";

export const dynamic = "force-dynamic";

export default async function SalesPipelinePage() {
  const opportunities = await listOpportunities();
  const active = opportunities.filter((opportunity) => !["won", "lost", "future", "paused", "disqualified"].includes(opportunity.stage));

  return (
    <div className="grid gap-10">
      <AdminPageHeader eyebrow="Pipeline" title="Stage discipline and next actions.">
        <p>Every active opportunity must carry owner, priority, venture, type, next action, and next action date.</p>
      </AdminPageHeader>
      <PipelineStageGrid opportunities={opportunities} />
      {active.length === 0 ? (
        <EmptyAdminState title="No active opportunities." detail="Promote a lead from /admin/sales/leads to start one." />
      ) : (
        <div className="grid gap-4">
          {active.map((opportunity) => (
            <div key={opportunity.id} className="rounded-lg border border-line bg-white/[0.035] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-signal">{opportunity.opportunityType}</p>
                  <p className="mt-1 text-sm text-white">{opportunity.ventureSlug ?? "No venture"} · {opportunity.priority} priority</p>
                  {opportunity.nextAction ? (
                    <p className="mt-1 text-xs text-steel">
                      Next: {opportunity.nextAction} {opportunity.nextActionDate ? `(${formatDate(opportunity.nextActionDate)})` : ""}
                    </p>
                  ) : null}
                  {opportunity.lastInteractionAt ? (
                    <p className="mt-1 text-xs text-steel">Last touch: {formatDate(opportunity.lastInteractionAt)}</p>
                  ) : (
                    <p className="mt-1 text-xs text-volt">No interaction logged yet.</p>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <UpdateStageForm opportunity={opportunity} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
