import "server-only";
import { isSupabaseConfigured, supabaseInsert, supabaseRequest } from "@/lib/supabase";
import { scoreLead } from "@/lib/sales-scoring";
import type { Lead, SalesLeadInput } from "@/lib/sales-types";

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
