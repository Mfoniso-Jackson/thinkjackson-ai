import { AdminPageHeader, EmptyAdminState } from "@/components/admin-sales";

const templates = [
  "Investor introduction",
  "Pilot request",
  "Strategic partnership",
  "Research sponsorship",
  "Grant introduction",
  "Warm referral request",
  "Post-meeting follow-up",
  "Proposal follow-up",
  "Dormant-lead reactivation"
];

export default function SalesCampaignsPage() {
  return (
    <div className="grid gap-10">
      <AdminPageHeader eyebrow="Outreach workspace" title="Research, draft, review, track.">
        <p>Outbound support is deliberately review-first. The system does not send automated email blasts.</p>
      </AdminPageHeader>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {templates.map((template) => (
          <div key={template} className="rounded-lg border border-line bg-white/[0.035] p-4 text-sm font-semibold text-white">
            {template}
          </div>
        ))}
      </div>
      <EmptyAdminState />
    </div>
  );
}
