import { AdminPageHeader, EmptyAdminState } from "@/components/admin-sales";
import { followUpCadenceDays } from "@/data/sales-config";

export default function SalesTasksPage() {
  return (
    <div className="grid gap-10">
      <AdminPageHeader eyebrow="Follow-up engine" title="Cadence without generic automation.">
        <p>Default follow-up suggestions: {followUpCadenceDays.map((day) => `Day ${day}`).join(", ")}. Each touch should add context, evidence, a demo, an insight, or a useful question.</p>
      </AdminPageHeader>
      <EmptyAdminState />
    </div>
  );
}
