import { AdminPageHeader, EmptyAdminState } from "@/components/admin-sales";

export default function SalesOpportunitiesPage() {
  return (
    <div className="grid gap-10">
      <AdminPageHeader eyebrow="Opportunities" title="Qualified commercial motion.">
        <p>Investor, customer, partner, grant, and research opportunities move here after review and next-action assignment.</p>
      </AdminPageHeader>
      <EmptyAdminState />
    </div>
  );
}
