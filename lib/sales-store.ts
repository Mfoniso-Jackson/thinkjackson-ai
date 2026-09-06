import "server-only";
import { supabaseInsert } from "@/lib/supabase";
import { scoreLead } from "@/lib/sales-scoring";
import type { SalesLeadInput } from "@/lib/sales-types";

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
