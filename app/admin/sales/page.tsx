import { AdminPageHeader, EmptyAdminState, PipelineMetricGrid, PipelineStageGrid } from "@/components/admin-sales";

export default function SalesAdminPage() {
  return (
    <div className="grid gap-10">
      <AdminPageHeader eyebrow="Founder command centre" title="Sales operating system.">
        <p>
          Private dashboard shell for investor conversations, pilots, strategic partnerships, grants, research sponsors,
          consulting, and design partners. Authentication is enforced by middleware before this route renders.
        </p>
      </AdminPageHeader>
      <PipelineMetricGrid />
      <PipelineStageGrid />
      <EmptyAdminState />
    </div>
  );
}
