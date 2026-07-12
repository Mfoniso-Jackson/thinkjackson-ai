import { AdminPageHeader, EmptyAdminState, PipelineMetricGrid } from "@/components/admin-sales";

export default function SalesAnalyticsPage() {
  return (
    <div className="grid gap-10">
      <AdminPageHeader eyebrow="Analytics" title="No vanity metrics without data.">
        <p>Activity, conversion, commercial, and strategic metrics stay empty until a private store supplies source-backed records.</p>
      </AdminPageHeader>
      <PipelineMetricGrid />
      <EmptyAdminState title="Analytics source not connected." />
    </div>
  );
}
