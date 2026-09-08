"use client";

import { useActionState, useState } from "react";
import {
  createTaskAction,
  idleSalesActionState,
  logInteractionAction,
  promoteLeadToOpportunity,
  setLeadStatusAction,
  setTaskStatusAction,
  updateOpportunityStageAction
} from "@/app/admin/sales/actions";
import { leadIntentLabels, pipelineStages } from "@/data/sales-config";
import type { FollowUpTask, Lead, LeadIntent, Opportunity, Priority } from "@/lib/sales-types";

const priorityOptions: Priority[] = ["low", "medium", "high", "critical"];
const interactionTypeOptions = ["email", "call", "meeting", "note", "proposal", "demo", "follow-up", "introduction"] as const;

const inputClass =
  "w-full rounded-md border border-line bg-ink px-3 py-2 text-sm text-white outline-none focus:border-signal";
const labelClass = "font-mono text-[10px] uppercase tracking-[0.14em] text-steel";
const buttonClass =
  "rounded-md bg-signal px-4 py-2 text-sm font-semibold text-ink transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-signal disabled:opacity-60";
const ghostButtonClass =
  "rounded-md border border-line px-3 py-2 text-xs text-steel transition hover:border-signal/40 hover:text-white disabled:opacity-60";

function StatusMessage({ state }: { state: { status: string; message: string } }) {
  if (state.status === "idle") return null;
  return (
    <p role="status" aria-live="polite" className={`text-xs ${state.status === "success" ? "text-signal" : "text-volt"}`}>
      {state.message}
    </p>
  );
}

/** Collapsed by default on the Leads page — promoting a lead requires a next action and next action date, so this is a deliberate step, not a one-click convert. */
export function PromoteLeadForm({ lead }: { lead: Lead }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(promoteLeadToOpportunity, idleSalesActionState);

  if (state.status === "success") {
    return <p className="text-xs text-signal">{state.message}</p>;
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className={ghostButtonClass}>
        Promote to opportunity
      </button>
    );
  }

  return (
    <form action={formAction} className="grid gap-3 rounded-md border border-line bg-white/[0.02] p-4">
      <input type="hidden" name="leadId" value={lead.id} />
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1">
          <span className={labelClass}>Opportunity type</span>
          <select name="opportunityType" defaultValue={lead.intent} className={inputClass}>
            {(Object.keys(leadIntentLabels) as LeadIntent[]).map((intent) => (
              <option key={intent} value={intent}>
                {leadIntentLabels[intent]}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1">
          <span className={labelClass}>Priority</span>
          <select name="priority" defaultValue="medium" className={inputClass}>
            {priorityOptions.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1">
          <span className={labelClass}>Stage</span>
          <select name="stage" defaultValue="identified" className={inputClass}>
            {pipelineStages
              .filter((stage) => stage.active)
              .map((stage) => (
                <option key={stage.value} value={stage.value}>
                  {stage.label}
                </option>
              ))}
          </select>
        </label>
        <label className="grid gap-1">
          <span className={labelClass}>Venture slug</span>
          <input name="ventureSlug" defaultValue={lead.ventureSlug ?? ""} className={inputClass} />
        </label>
        <label className="grid gap-1">
          <span className={labelClass}>Next action</span>
          <input name="nextAction" required placeholder="Send discovery scheduling link" className={inputClass} />
        </label>
        <label className="grid gap-1">
          <span className={labelClass}>Next action date</span>
          <input type="date" name="nextActionDate" required className={inputClass} />
        </label>
        <label className="grid gap-1">
          <span className={labelClass}>Estimated value</span>
          <input type="number" name="estimatedValue" min="0" className={inputClass} />
        </label>
        <label className="grid gap-1">
          <span className={labelClass}>Owner</span>
          <input name="owner" defaultValue="mfoniso" className={inputClass} />
        </label>
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className={buttonClass}>
          {pending ? "Creating..." : "Create opportunity"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className={ghostButtonClass}>
          Cancel
        </button>
      </div>
      <StatusMessage state={state} />
    </form>
  );
}

export function LeadStatusButtons({ lead }: { lead: Lead }) {
  const [state, formAction, pending] = useActionState(setLeadStatusAction, idleSalesActionState);

  if (lead.status === "converted" || lead.status === "archived") {
    return <span className="text-xs text-steel">{lead.status}</span>;
  }

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="leadId" value={lead.id} />
      {lead.status === "new" ? (
        <button type="submit" name="status" value="reviewed" disabled={pending} className={ghostButtonClass}>
          Mark reviewed
        </button>
      ) : null}
      <button type="submit" name="status" value="archived" disabled={pending} className={ghostButtonClass}>
        Archive
      </button>
      <StatusMessage state={state} />
    </form>
  );
}

export function LogInteractionForm({ opportunityId }: { opportunityId: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(logInteractionAction, idleSalesActionState);

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className={ghostButtonClass}>
        Log interaction
      </button>
    );
  }

  return (
    <form action={formAction} className="grid gap-2 rounded-md border border-line bg-white/[0.02] p-3">
      <input type="hidden" name="opportunityId" value={opportunityId} />
      <div className="grid gap-2 sm:grid-cols-[140px_1fr]">
        <select name="type" defaultValue="email" className={inputClass}>
          {interactionTypeOptions.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <input name="summary" required placeholder="What happened?" className={inputClass} />
      </div>
      <input name="nextStep" placeholder="Next step (optional)" className={inputClass} />
      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className={buttonClass}>
          {pending ? "Logging..." : "Log it"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className={ghostButtonClass}>
          Cancel
        </button>
      </div>
      <StatusMessage state={state} />
    </form>
  );
}

export function UpdateStageForm({ opportunity }: { opportunity: Opportunity }) {
  const [state, formAction, pending] = useActionState(updateOpportunityStageAction, idleSalesActionState);

  return (
    <form action={formAction} className="grid gap-2 rounded-md border border-line bg-white/[0.02] p-3">
      <input type="hidden" name="opportunityId" value={opportunity.id} />
      <div className="grid gap-2 sm:grid-cols-3">
        <select name="stage" defaultValue={opportunity.stage} className={inputClass}>
          {pipelineStages.map((stage) => (
            <option key={stage.value} value={stage.value}>
              {stage.label}
            </option>
          ))}
        </select>
        <input name="nextAction" defaultValue={opportunity.nextAction ?? ""} placeholder="Next action" className={inputClass} />
        <input type="date" name="nextActionDate" defaultValue={opportunity.nextActionDate ?? ""} className={inputClass} />
      </div>
      <div>
        <button type="submit" disabled={pending} className={buttonClass}>
          {pending ? "Saving..." : "Update stage"}
        </button>
      </div>
      <StatusMessage state={state} />
    </form>
  );
}

export function CreateTaskForm({ opportunityId, leadId }: { opportunityId?: string; leadId?: string }) {
  const [state, formAction, pending] = useActionState(createTaskAction, idleSalesActionState);

  return (
    <form action={formAction} className="grid gap-2 rounded-md border border-line bg-white/[0.02] p-4">
      {opportunityId ? <input type="hidden" name="opportunityId" value={opportunityId} /> : null}
      {leadId ? <input type="hidden" name="leadId" value={leadId} /> : null}
      <div className="grid gap-2 sm:grid-cols-[1fr_160px_140px]">
        <input name="title" required placeholder="Follow up with a tailored question" className={inputClass} />
        <input type="date" name="dueDate" required className={inputClass} />
        <select name="priority" defaultValue="medium" className={inputClass}>
          {priorityOptions.map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>
      </div>
      <input name="context" placeholder="Context (optional)" className={inputClass} />
      <div>
        <button type="submit" disabled={pending} className={buttonClass}>
          {pending ? "Adding..." : "Add task"}
        </button>
      </div>
      <StatusMessage state={state} />
    </form>
  );
}

export function TaskStatusButtons({ task }: { task: FollowUpTask }) {
  const [state, formAction, pending] = useActionState(setTaskStatusAction, idleSalesActionState);

  if (task.status !== "open") {
    return <span className="text-xs text-steel">{task.status}</span>;
  }

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="taskId" value={task.id} />
      <button type="submit" name="status" value="done" disabled={pending} className={ghostButtonClass}>
        Mark done
      </button>
      <button type="submit" name="status" value="deferred" disabled={pending} className={ghostButtonClass}>
        Defer
      </button>
      <StatusMessage state={state} />
    </form>
  );
}
