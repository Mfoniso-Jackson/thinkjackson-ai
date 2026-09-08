import { AdminPageHeader, EmptyAdminState, PipelineMetricGrid, PipelineStageGrid } from "@/components/admin-sales";
import { getPipelineOverview } from "@/data/sales-dashboard";
import { listOpportunities, listSalesLeads, listTasks } from "@/lib/sales-store";

export const dynamic = "force-dynamic";

export default async function SalesAdminPage() {
  const [leads, opportunities, tasks] = await Promise.all([listSalesLeads(), listOpportunities(), listTasks()]);
  const overview = getPipelineOverview({ leads, opportunities, tasks });

  return (
    <div className="grid gap-10">
      <AdminPageHeader eyebrow="Founder command centre" title="Sales operating system.">
        <p>
          Private dashboard shell for investor conversations, pilots, strategic partnerships, grants, research sponsors,
          consulting, and design partners. Authentication is enforced by middleware before this route renders.
        </p>
      </AdminPageHeader>
      <PipelineMetricGrid overview={overview} />
      <PipelineStageGrid opportunities={opportunities} />
      {opportunities.length === 0 ? <EmptyAdminState /> : null}
    </div>
  );
}
