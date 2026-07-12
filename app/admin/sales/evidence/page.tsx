import { AdminPageHeader, EmptyAdminState } from "@/components/admin-sales";

const evidenceTypes = [
  "Deployed product",
  "Customer result",
  "Testimonial",
  "Pilot",
  "Research paper",
  "Technical benchmark",
  "GitHub release",
  "Partner statement",
  "Grant",
  "Public demo",
  "Adoption metric"
];

export default function SalesEvidencePage() {
  return (
    <div className="grid gap-10">
      <AdminPageHeader eyebrow="Evidence library" title="Wins become proof.">
        <p>Only public, verified, permission-approved evidence should flow from this private library onto the public site.</p>
      </AdminPageHeader>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {evidenceTypes.map((type) => (
          <div key={type} className="rounded-lg border border-line bg-white/[0.035] p-4 text-sm font-semibold text-white">
            {type}
          </div>
        ))}
      </div>
      <EmptyAdminState />
    </div>
  );
}
