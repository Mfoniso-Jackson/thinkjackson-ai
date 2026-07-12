import { AdminPageHeader, EmptyAdminState } from "@/components/admin-sales";

export default function SalesLeadsPage() {
  return (
    <div className="grid gap-10">
      <AdminPageHeader eyebrow="Leads" title="Segmented inbound demand.">
        <p>Leads captured from the public form include source page, venture, campaign, referrer, UTM context, and qualification score.</p>
      </AdminPageHeader>
      <EmptyAdminState />
    </div>
  );
}
