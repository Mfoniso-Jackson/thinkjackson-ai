import { AdminPageHeader, EmptyAdminState, PipelineMetricGrid } from "@/components/admin-sales";
import { getPipelineOverview } from "@/data/sales-dashboard";
import { listOpportunities, listSalesLeads, listTasks } from "@/lib/sales-store";

export const dynamic = "force-dynamic";

export default async function SalesAnalyticsPage() {
  const [leads, opportunities, tasks] = await Promise.all([listSalesLeads(), listOpportunities(), listTasks()]);
  const overview = getPipelineOverview({ leads, opportunities, tasks });

  return (
    <div className="grid gap-10">
      <AdminPageHeader eyebrow="Analytics" title="No vanity metrics without data.">
        <p>Activity, conversion, commercial, and strategic metrics stay empty until a private store supplies source-backed records.</p>
      </AdminPageHeader>
      <PipelineMetricGrid overview={overview} />
      <EmptyAdminState title="Proposal, evidence, and campaign analytics aren't wired to a store yet." />
    </div>
  );
}
