import { AdminPageHeader, EmptyAdminState } from "@/components/admin-sales";

const weeklyRhythm = [
  ["Monday", "Pipeline review, stalled deals, new inbound leads"],
  ["Tuesday", "Investor, customer, partner, and warm-introduction outreach"],
  ["Wednesday", "Discovery calls, demos, meeting notes, qualification updates"],
  ["Thursday", "Proposals, follow-ups, negotiation, stakeholder mapping"],
  ["Friday", "Evidence, referrals, metrics, lessons, next-week priorities"]
];

export default function SalesReviewPage() {
  return (
    <div className="grid gap-10">
      <AdminPageHeader eyebrow="Weekly review" title="A cadence for commercial learning.">
        <p>Review wins, losses, lessons, bottlenecks, pipeline changes, activities, revenue movement, evidence, and next priorities.</p>
      </AdminPageHeader>
      <div className="grid gap-3">
        {weeklyRhythm.map(([day, focus]) => (
          <div key={day} className="rounded-lg border border-line bg-white/[0.035] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-signal">{day}</p>
            <p className="mt-2 text-sm leading-6 text-steel">{focus}</p>
          </div>
        ))}
      </div>
      <EmptyAdminState />
    </div>
  );
}
