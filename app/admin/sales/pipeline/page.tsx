import { AdminPageHeader, EmptyAdminState, PipelineStageGrid } from "@/components/admin-sales";

export default function SalesPipelinePage() {
  return (
    <div className="grid gap-10">
      <AdminPageHeader eyebrow="Pipeline" title="Stage discipline and next actions.">
        <p>Every active opportunity must carry owner, priority, venture, type, next action, and next action date.</p>
      </AdminPageHeader>
      <PipelineStageGrid />
      <EmptyAdminState />
    </div>
  );
}
