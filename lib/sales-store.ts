import "server-only";
import { isSupabaseConfigured, supabaseInsert, supabaseRequest, supabaseUpdate } from "@/lib/supabase";
import { scoreLead } from "@/lib/sales-scoring";
import type { FollowUpTask, Interaction, Lead, LeadIntent, Opportunity, Priority, PipelineStage, SalesLeadInput } from "@/lib/sales-types";

type SalesLeadRow = {
  id: string;
  created_at: string;
  updated_at: string;
  full_name: string;
  email: string;
  organisation: string;
  role: string | null;
  location_or_market: string | null;
  intent: Lead["intent"];
  venture_slug: string | null;
  source_page: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  campaign: string | null;
  preferred_next_step: string | null;
  status: Lead["status"];
  notes: string | null;
  raw_payload: Record<string, unknown>;
  qualification: Lead["qualification"];
};

function toLead(row: SalesLeadRow): Lead {
  return {
    id: row.id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    fullName: row.full_name,
    email: row.email,
    organisation: row.organisation,
    role: row.role ?? undefined,
    locationOrMarket: row.location_or_market ?? undefined,
    intent: row.intent,
    ventureSlug: row.venture_slug ?? undefined,
    sourcePage: row.source_page ?? undefined,
    referrer: row.referrer ?? undefined,
    utmSource: row.utm_source ?? undefined,
    utmMedium: row.utm_medium ?? undefined,
    utmCampaign: row.utm_campaign ?? undefined,
    campaign: row.campaign ?? undefined,
    preferredNextStep: row.preferred_next_step ?? undefined,
    status: row.status,
    notes: row.notes ?? undefined,
    message: typeof row.raw_payload?.message === "string" ? row.raw_payload.message : undefined,
    qualification: row.qualification
  };
}

/**
 * The one insert path into public.sales_leads (see
 * supabase/migrations/20260712120000_sales_operating_system.sql). Both the
 * general contact form and the investor form route through this — the
 * table's `intent` column and scoreLead's per-intent branches already exist
 * to support that, so leads capture into one pipeline instead of two.
 */
export async function insertSalesLead(input: SalesLeadInput) {
  const qualification = scoreLead(input);

  await supabaseInsert("sales_leads", {
    full_name: input.fullName,
    email: input.email,
    organisation: input.organisation,
    role: input.role || null,
    location_or_market: input.locationOrMarket || null,
    intent: input.intent,
    venture_slug: input.ventureSlug || null,
    source_page: input.sourcePage || null,
    referrer: input.referrer || null,
    utm_source: input.utmSource || null,
    utm_medium: input.utmMedium || null,
    utm_campaign: input.utmCampaign || null,
    campaign: input.campaign || null,
    preferred_next_step: input.preferredNextStep || null,
    status: "new",
    raw_payload: input,
    qualification
  });

  return qualification;
}

/** Most recent leads, newest first. Returns an empty list if Supabase isn't configured, rather than throwing — the admin page shows its own configured-but-empty vs not-configured messaging. */
export async function listSalesLeads(limit = 100): Promise<Lead[]> {
  if (!isSupabaseConfigured()) return [];
  const rows = (await supabaseRequest(`sales_leads?select=*&order=created_at.desc&limit=${limit}`)) as SalesLeadRow[];
  return rows.map(toLead);
}

export async function updateLeadStatus(id: string, status: Lead["status"]) {
  await supabaseUpdate("sales_leads", `id=eq.${id}`, { status, updated_at: new Date().toISOString() });
}

type SalesOpportunityRow = {
  id: string;
  created_at: string;
  updated_at: string;
  lead_id: string | null;
  venture_slug: string | null;
  stage: PipelineStage;
  priority: Priority;
  opportunity_type: LeadIntent;
  estimated_value: number | null;
  currency: string | null;
  probability: number | null;
  expected_close_date: string | null;
  next_action: string | null;
  next_action_date: string | null;
  owner: string | null;
  last_interaction_at: string | null;
  outcome_reason: string | null;
};

function toOpportunity(row: SalesOpportunityRow): Opportunity {
  return {
    id: row.id,
    leadId: row.lead_id ?? "",
    ventureSlug: row.venture_slug ?? undefined,
    stage: row.stage,
    priority: row.priority,
    opportunityType: row.opportunity_type,
    estimatedValue: row.estimated_value ?? undefined,
    currency: row.currency ?? undefined,
    probability: row.probability ?? undefined,
    expectedCloseDate: row.expected_close_date ?? undefined,
    nextAction: row.next_action ?? undefined,
    nextActionDate: row.next_action_date ?? undefined,
    owner: row.owner ?? undefined,
    lastInteractionAt: row.last_interaction_at ?? undefined,
    outcomeReason: row.outcome_reason ?? undefined
  };
}

/** Most recent opportunities, newest first. See listSalesLeads for the Supabase-not-configured convention. */
export async function listOpportunities(limit = 200): Promise<Opportunity[]> {
  if (!isSupabaseConfigured()) return [];
  const rows = (await supabaseRequest(`sales_opportunities?select=*&order=created_at.desc&limit=${limit}`)) as SalesOpportunityRow[];
  return rows.map(toOpportunity);
}

export type CreateOpportunityInput = {
  leadId?: string;
  ventureSlug?: string;
  opportunityType: LeadIntent;
  priority: Priority;
  stage: PipelineStage;
  nextAction: string;
  nextActionDate: string;
  estimatedValue?: number;
  currency?: string;
  owner?: string;
};

/**
 * The DB's active_opportunities_have_next_action check constraint (see the
 * migration) rejects any insert in a non-terminal stage without both
 * next_action and next_action_date — so this always requires them rather
 * than making them optional and discovering the rejection at the database.
 */
export async function createOpportunity(input: CreateOpportunityInput): Promise<Opportunity> {
  const row = (await supabaseInsert("sales_opportunities", {
    lead_id: input.leadId ?? null,
    venture_slug: input.ventureSlug || null,
    stage: input.stage,
    priority: input.priority,
    opportunity_type: input.opportunityType,
    estimated_value: input.estimatedValue ?? null,
    currency: input.currency || "GBP",
    next_action: input.nextAction,
    next_action_date: input.nextActionDate,
    owner: input.owner || null
  })) as SalesOpportunityRow;
  return toOpportunity(row);
}

export type UpdateOpportunityInput = Partial<{
  stage: PipelineStage;
  priority: Priority;
  estimatedValue: number;
  currency: string;
  probability: number;
  expectedCloseDate: string;
  nextAction: string;
  nextActionDate: string;
  owner: string;
  outcomeReason: string;
}>;

export async function updateOpportunity(id: string, patch: UpdateOpportunityInput): Promise<void> {
  const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.stage !== undefined) row.stage = patch.stage;
  if (patch.priority !== undefined) row.priority = patch.priority;
  if (patch.estimatedValue !== undefined) row.estimated_value = patch.estimatedValue;
  if (patch.currency !== undefined) row.currency = patch.currency;
  if (patch.probability !== undefined) row.probability = patch.probability;
  if (patch.expectedCloseDate !== undefined) row.expected_close_date = patch.expectedCloseDate;
  if (patch.nextAction !== undefined) row.next_action = patch.nextAction;
  if (patch.nextActionDate !== undefined) row.next_action_date = patch.nextActionDate;
  if (patch.owner !== undefined) row.owner = patch.owner;
  if (patch.outcomeReason !== undefined) row.outcome_reason = patch.outcomeReason;
  await supabaseUpdate("sales_opportunities", `id=eq.${id}`, row);
}

type SalesInteractionRow = {
  id: string;
  created_at: string;
  opportunity_id: string;
  type: Interaction["type"];
  occurred_at: string;
  summary: string;
  next_step: string | null;
};

function toInteraction(row: SalesInteractionRow): Interaction {
  return {
    id: row.id,
    opportunityId: row.opportunity_id,
    type: row.type,
    occurredAt: row.occurred_at,
    summary: row.summary,
    nextStep: row.next_step ?? undefined
  };
}

/** Every interaction for one opportunity, most recent first — the conversation history a reviewer scrolls through. */
export async function listInteractions(opportunityId: string): Promise<Interaction[]> {
  if (!isSupabaseConfigured()) return [];
  const rows = (await supabaseRequest(
    `sales_interactions?select=*&opportunity_id=eq.${opportunityId}&order=occurred_at.desc`
  )) as SalesInteractionRow[];
  return rows.map(toInteraction);
}

export type LogInteractionInput = {
  opportunityId: string;
  type: Interaction["type"];
  summary: string;
  nextStep?: string;
  occurredAt?: string;
};

/**
 * Logs the interaction and bumps the opportunity's last_interaction_at in
 * the same call — the "stalled opportunity" signal on the Today/Overview
 * pages is derived from that column, so every logged email/call keeps it
 * true without a separate reconciliation step.
 */
export async function logInteraction(input: LogInteractionInput): Promise<Interaction> {
  const occurredAt = input.occurredAt ?? new Date().toISOString();
  const row = (await supabaseInsert("sales_interactions", {
    opportunity_id: input.opportunityId,
    type: input.type,
    occurred_at: occurredAt,
    summary: input.summary,
    next_step: input.nextStep || null
  })) as SalesInteractionRow;
  await supabaseUpdate("sales_opportunities", `id=eq.${input.opportunityId}`, {
    last_interaction_at: occurredAt,
    updated_at: new Date().toISOString()
  });
  return toInteraction(row);
}

type SalesTaskRow = {
  id: string;
  created_at: string;
  opportunity_id: string | null;
  lead_id: string | null;
  title: string;
  due_date: string;
  priority: Priority;
  status: FollowUpTask["status"];
  context: string | null;
};

function toTask(row: SalesTaskRow): FollowUpTask {
  return {
    id: row.id,
    opportunityId: row.opportunity_id ?? undefined,
    leadId: row.lead_id ?? undefined,
    title: row.title,
    dueDate: row.due_date,
    priority: row.priority,
    status: row.status,
    context: row.context ?? undefined
  };
}

/** Open and recently-closed tasks, soonest due date first. */
export async function listTasks(limit = 200): Promise<FollowUpTask[]> {
  if (!isSupabaseConfigured()) return [];
  const rows = (await supabaseRequest(`sales_tasks?select=*&order=due_date.asc&limit=${limit}`)) as SalesTaskRow[];
  return rows.map(toTask);
}

export type CreateTaskInput = {
  title: string;
  dueDate: string;
  priority: Priority;
  opportunityId?: string;
  leadId?: string;
  context?: string;
};

export async function createTask(input: CreateTaskInput): Promise<FollowUpTask> {
  const row = (await supabaseInsert("sales_tasks", {
    opportunity_id: input.opportunityId || null,
    lead_id: input.leadId || null,
    title: input.title,
    due_date: input.dueDate,
    priority: input.priority,
    status: "open",
    context: input.context || null
  })) as SalesTaskRow;
  return toTask(row);
}

export async function updateTaskStatus(id: string, status: FollowUpTask["status"]): Promise<void> {
  await supabaseUpdate("sales_tasks", `id=eq.${id}`, { status });
}
