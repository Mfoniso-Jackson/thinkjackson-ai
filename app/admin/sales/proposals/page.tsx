import { AdminPageHeader, EmptyAdminState } from "@/components/admin-sales";

const proposalSections = [
  "Context",
  "Problem",
  "Current cost or risk",
  "Proposed solution",
  "Scope",
  "Deliverables",
  "Milestones",
  "Success metrics",
  "Commercial model",
  "Assumptions",
  "Risks",
  "Timeline",
  "Next step"
];

export default function SalesProposalsPage() {
  return (
    <div className="grid gap-10">
      <AdminPageHeader eyebrow="Proposal engine" title="Drafts before commitments.">
        <p>Reusable structure for paid pilots, enterprise implementations, consulting, strategic partnerships, research sponsorships, and grants.</p>
      </AdminPageHeader>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {proposalSections.map((section) => (
          <div key={section} className="rounded-lg border border-line bg-white/[0.035] p-4 text-sm font-semibold text-white">
            {section}
          </div>
        ))}
      </div>
      <EmptyAdminState />
    </div>
  );
}
