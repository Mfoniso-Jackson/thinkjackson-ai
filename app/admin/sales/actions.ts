"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { pipelineStages } from "@/data/sales-config";
import { leadIntents } from "@/lib/sales-validation";
import {
  createOpportunity,
  createTask,
  logInteraction,
  updateLeadStatus,
  updateOpportunity,
  updateTaskStatus
} from "@/lib/sales-store";
import type { InteractionType, LeadIntent, LeadStatus, PipelineStage, Priority } from "@/lib/sales-types";

export type SalesActionState = { status: "idle" | "success" | "error"; message: string };
export const idleSalesActionState: SalesActionState = { status: "idle", message: "" };

const priorities: Priority[] = ["low", "medium", "high", "critical"];
const interactionTypes: InteractionType[] = ["email", "call", "meeting", "note", "proposal", "demo", "follow-up", "introduction"];
const pipelineStageValues = pipelineStages.map((stage) => stage.value);

function revalidateSalesPages() {
  for (const path of ["/admin/sales", "/admin/sales/today", "/admin/sales/leads", "/admin/sales/opportunities", "/admin/sales/pipeline", "/admin/sales/tasks"]) {
    revalidatePath(path);
  }
}

const promoteLeadSchema = z.object({
  leadId: z.string().uuid(),
  ventureSlug: z.string().max(120).optional(),
  opportunityType: z.enum(leadIntents as [string, ...string[]]),
  priority: z.enum(priorities as [string, ...string[]]),
  stage: z.enum(pipelineStageValues as [string, ...string[]]),
  nextAction: z.string().min(3).max(300),
  nextActionDate: z.string().min(1),
  estimatedValue: z.string().optional(),
  currency: z.string().max(10).optional(),
  owner: z.string().max(120).optional()
});

export async function promoteLeadToOpportunity(_prev: SalesActionState, formData: FormData): Promise<SalesActionState> {
  const parsed = promoteLeadSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { status: "error", message: "Check the opportunity fields — a next action and next action date are required." };
  }
  const input = parsed.data;

  try {
    await createOpportunity({
      leadId: input.leadId,
      ventureSlug: input.ventureSlug || undefined,
      opportunityType: input.opportunityType as LeadIntent,
      priority: input.priority as Priority,
      stage: input.stage as PipelineStage,
      nextAction: input.nextAction,
      nextActionDate: input.nextActionDate,
      estimatedValue: input.estimatedValue ? Number(input.estimatedValue) : undefined,
      currency: input.currency || undefined,
      owner: input.owner || undefined
    });
    await updateLeadStatus(input.leadId, "converted");
    revalidateSalesPages();
    return { status: "success", message: "Opportunity created and lead marked converted." };
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "Could not create the opportunity." };
  }
}

const logInteractionSchema = z.object({
  opportunityId: z.string().uuid(),
  type: z.enum(interactionTypes as [string, ...string[]]),
  summary: z.string().min(3).max(1000),
  nextStep: z.string().max(500).optional()
});

export async function logInteractionAction(_prev: SalesActionState, formData: FormData): Promise<SalesActionState> {
  const parsed = logInteractionSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { status: "error", message: "Add a short summary of what happened." };
  }
  const input = parsed.data;

  try {
    await logInteraction({
      opportunityId: input.opportunityId,
      type: input.type as InteractionType,
      summary: input.summary,
      nextStep: input.nextStep || undefined
    });
    revalidateSalesPages();
    return { status: "success", message: "Interaction logged." };
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "Could not log the interaction." };
  }
}

const updateStageSchema = z.object({
  opportunityId: z.string().uuid(),
  stage: z.enum(pipelineStageValues as [string, ...string[]]),
  nextAction: z.string().max(300).optional(),
  nextActionDate: z.string().optional()
});

/**
 * The DB's active_opportunities_have_next_action check constraint rejects
 * a non-terminal stage without both fields set — asking for them here
 * whenever the target stage is active turns that into a clear form error
 * instead of a raw Postgres constraint-violation message.
 */
export async function updateOpportunityStageAction(_prev: SalesActionState, formData: FormData): Promise<SalesActionState> {
  const parsed = updateStageSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { status: "error", message: "Select a valid stage." };
  }
  const input = parsed.data;
  const stageIsActive = pipelineStages.find((stage) => stage.value === input.stage)?.active ?? false;

  if (stageIsActive && (!input.nextAction?.trim() || !input.nextActionDate?.trim())) {
    return { status: "error", message: "Active opportunities require a next action and next action date." };
  }

  try {
    await updateOpportunity(input.opportunityId, {
      stage: input.stage as PipelineStage,
      nextAction: input.nextAction || undefined,
      nextActionDate: input.nextActionDate || undefined
    });
    revalidateSalesPages();
    return { status: "success", message: "Opportunity updated." };
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "Could not update the opportunity." };
  }
}

const createTaskSchema = z.object({
  title: z.string().min(3).max(300),
  dueDate: z.string().min(1),
  priority: z.enum(priorities as [string, ...string[]]),
  opportunityId: z.string().uuid().optional(),
  leadId: z.string().uuid().optional(),
  context: z.string().max(500).optional()
});

export async function createTaskAction(_prev: SalesActionState, formData: FormData): Promise<SalesActionState> {
  const parsed = createTaskSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { status: "error", message: "Add a task title and due date." };
  }
  const input = parsed.data;

  try {
    await createTask({
      title: input.title,
      dueDate: input.dueDate,
      priority: input.priority as Priority,
      opportunityId: input.opportunityId || undefined,
      leadId: input.leadId || undefined,
      context: input.context || undefined
    });
    revalidateSalesPages();
    return { status: "success", message: "Task added." };
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "Could not create the task." };
  }
}

const taskStatusSchema = z.object({
  taskId: z.string().uuid(),
  status: z.enum(["open", "done", "deferred"])
});

export async function setTaskStatusAction(_prev: SalesActionState, formData: FormData): Promise<SalesActionState> {
  const parsed = taskStatusSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { status: "error", message: "Could not update the task." };
  }

  try {
    await updateTaskStatus(parsed.data.taskId, parsed.data.status as "open" | "done" | "deferred");
    revalidateSalesPages();
    return { status: "success", message: "Task updated." };
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "Could not update the task." };
  }
}

const leadStatusSchema = z.object({
  leadId: z.string().uuid(),
  status: z.enum(["new", "reviewed", "converted", "archived"])
});

export async function setLeadStatusAction(_prev: SalesActionState, formData: FormData): Promise<SalesActionState> {
  const parsed = leadStatusSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) {
    return { status: "error", message: "Could not update the lead." };
  }

  try {
    await updateLeadStatus(parsed.data.leadId, parsed.data.status as LeadStatus);
    revalidateSalesPages();
    return { status: "success", message: "Lead updated." };
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "Could not update the lead." };
  }
}
