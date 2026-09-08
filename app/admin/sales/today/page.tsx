import { AdminPageHeader, EmptyAdminState } from "@/components/admin-sales";
import { TaskStatusButtons } from "@/components/sales-admin-forms";
import { getTodayQueue, proposals } from "@/data/sales-dashboard";
import { listOpportunities, listSalesLeads, listTasks } from "@/lib/sales-store";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function SalesTodayPage() {
  const [leads, opportunities, tasks] = await Promise.all([listSalesLeads(), listOpportunities(), listTasks()]);
  const queue = getTodayQueue({ leads, opportunities, tasks, proposals });
  const sections = [
    ["Overdue tasks", queue.overdueTasks.length],
    ["Follow-ups due today", queue.dueToday.length],
    ["Proposals awaiting action", queue.proposalsAwaitingAction.length],
    ["New inbound leads", queue.highPriorityLeadsWithoutActivity.length],
    ["Opportunities with no next step", queue.opportunitiesWithNoNextStep.length],
    ["Stalled opportunities", queue.stalledOpportunities.length]
  ] as const;
  const totalDue = queue.overdueTasks.length + queue.dueToday.length;

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

      {totalDue === 0 ? (
        <EmptyAdminState title="No actions due." />
      ) : (
        <div className="grid gap-3">
          {[...queue.overdueTasks, ...queue.dueToday].map((task) => (
            <div key={task.id} className="rounded-lg border border-volt/40 bg-volt/5 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{task.title}</p>
                  <p className="mt-1 text-xs text-steel">Due {formatDate(task.dueDate)} · {task.priority} priority</p>
                  {task.context ? <p className="mt-1 text-xs text-steel">{task.context}</p> : null}
                </div>
                <TaskStatusButtons task={task} />
              </div>
            </div>
          ))}
        </div>
      )}

      {queue.opportunitiesWithNoNextStep.length > 0 ? (
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-volt">Opportunities missing a next action</p>
          <div className="mt-3 grid gap-2">
            {queue.opportunitiesWithNoNextStep.map((opportunity) => (
              <div key={opportunity.id} className="rounded-md border border-line bg-white/[0.02] p-3 text-xs text-steel">
                {opportunity.opportunityType} · {opportunity.stage} · {opportunity.ventureSlug ?? "no venture"} —{" "}
                <a href="/admin/sales/opportunities" className="text-signal">
                  set a next action
                </a>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
