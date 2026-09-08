import { AdminPageHeader, EmptyAdminState } from "@/components/admin-sales";
import { CreateTaskForm, TaskStatusButtons } from "@/components/sales-admin-forms";
import { followUpCadenceDays } from "@/data/sales-config";
import { listTasks } from "@/lib/sales-store";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function SalesTasksPage() {
  const tasks = await listTasks();
  const today = new Date().toISOString().slice(0, 10);
  const openTasks = tasks
    .filter((task) => task.status === "open")
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const closedTasks = tasks.filter((task) => task.status !== "open");

  return (
    <div className="grid gap-10">
      <AdminPageHeader eyebrow="Follow-up engine" title="Cadence without generic automation.">
        <p>Default follow-up suggestions: {followUpCadenceDays.map((day) => `Day ${day}`).join(", ")}. Each touch should add context, evidence, a demo, an insight, or a useful question.</p>
      </AdminPageHeader>

      <CreateTaskForm />

      {openTasks.length === 0 ? (
        <EmptyAdminState title="No open tasks." />
      ) : (
        <div className="grid gap-3">
          {openTasks.map((task) => (
            <div
              key={task.id}
              className={`rounded-lg border p-4 ${task.dueDate < today ? "border-volt/40 bg-volt/5" : "border-line bg-white/[0.035]"}`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{task.title}</p>
                  <p className="mt-1 text-xs text-steel">
                    Due {formatDate(task.dueDate)} · {task.priority} priority
                    {task.dueDate < today ? " · overdue" : ""}
                  </p>
                  {task.context ? <p className="mt-1 text-xs text-steel">{task.context}</p> : null}
                </div>
                <TaskStatusButtons task={task} />
              </div>
            </div>
          ))}
        </div>
      )}

      {closedTasks.length > 0 ? (
        <details>
          <summary className="cursor-pointer text-xs font-semibold text-signal">Closed tasks ({closedTasks.length})</summary>
          <div className="mt-3 grid gap-2">
            {closedTasks.map((task) => (
              <div key={task.id} className="rounded-md border border-line bg-white/[0.02] p-3 text-xs text-steel">
                {task.title} — {task.status}
              </div>
            ))}
          </div>
        </details>
      ) : null}
    </div>
  );
}
