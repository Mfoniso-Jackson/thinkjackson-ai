import { AdminPageHeader, EmptyAdminState } from "@/components/admin-sales";
import { getTodayQueue } from "@/data/sales-dashboard";

export default function SalesTodayPage() {
  const queue = getTodayQueue();
  const sections = [
    ["Overdue tasks", queue.overdueTasks.length],
    ["Follow-ups due today", queue.dueToday.length],
    ["Proposals awaiting action", queue.proposalsAwaitingAction.length],
    ["New inbound leads", queue.highPriorityLeadsWithoutActivity.length],
    ["Opportunities with no next step", queue.opportunitiesWithNoNextStep.length],
    ["Stalled opportunities", queue.stalledOpportunities.length]
  ];

  return (
    <div className="grid gap-10">
      <AdminPageHeader eyebrow="Daily queue" title="Open this first.">
        <p>Who to contact, why, what outcome is required, and what should happen next.</p>
      </AdminPageHeader>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sections.map(([label, count]) => (
          <div key={label} className="rounded-lg border border-line bg-white/[0.035] p-5">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-steel">{label}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{count}</p>
          </div>
        ))}
      </div>
      <EmptyAdminState title="No actions due." />
    </div>
  );
}
