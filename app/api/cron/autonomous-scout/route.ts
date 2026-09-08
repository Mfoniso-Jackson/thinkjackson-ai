import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { territories } from "@/data/territories";
import { searchWeb } from "@/lib/agents/web-search";
import { discoverFromUrl } from "@/lib/agents/discovery-pipeline";
import { findSourceByUrl, logAgentAction } from "@/lib/kg-store";
import { isSupabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";
/**
 * Hobby's real duration cap (with Fluid compute, the current default) is
 * 300s, not the 60s this was originally set to — confirmed against current
 * Vercel docs, not assumed. The old 60s ceiling is the likely cause of two
 * real candidates getting stuck at "investigating" with zero agent_logs
 * rows: a platform-level kill mid-Researcher-call can't be caught by any
 * try/catch, so nothing gets logged and the candidate never resolves.
 * 300s gives Scout+Researcher (each with multi-provider fallback, up to
 * ~45s per attempt) room to fail over fully for several URLs in one run
 * without hitting that wall.
 */
export const maxDuration = 300;

/**
 * Caps how many NEW candidates one run can create, independent of how many
 * search results come back. This is the actual safety valve on an
 * unattended job: even if a search returns a page of results, this keeps
 * one run's cost and the human reviewer's queue bounded, and stays well
 * under what a rate-limited free-tier AI provider can absorb in one call.
 * Hobby's cron frequency is hard-capped at once/day (a platform limit, not
 * configurable), so this — not run frequency — is the real lever for more
 * discovery volume per day.
 */
const MAX_NEW_CANDIDATES_PER_RUN = 4;
const RESULTS_PER_SEARCH = 8;

type RunOutcome = { url: string; ok: boolean; error?: string };

/**
 * The autonomous half of Scout: instead of a human pasting a URL, this
 * scheduled job (see vercel.json) picks one research territory per day,
 * searches the open web for it via Tavily, and runs each new (not
 * already-discovered) result through the exact same Scout -> Researcher ->
 * Librarian pipeline used for human-triggered discovery. Nothing here
 * publishes anything — every candidate still lands as "verified," waiting
 * for the same human Approve action as always. Two independent kill
 * switches: AUTONOMOUS_SCOUT_ENABLED must be explicitly "true" (the
 * feature ships disabled by default so it never silently starts consuming
 * AI-provider quota), and Vercel's CRON_SECRET convention keeps the
 * endpoint from being triggered by anyone but Vercel's own scheduler.
 */
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (process.env.AUTONOMOUS_SCOUT_ENABLED !== "true") {
    return NextResponse.json({ ok: true, skipped: true, reason: "AUTONOMOUS_SCOUT_ENABLED is not set to true." });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: true, skipped: true, reason: "Supabase is not configured." });
  }

  const dayIndex = Math.floor(Date.now() / 86_400_000) % territories.length;
  const territory = territories[dayIndex];
  const query = `${territory.name}: ${territory.signal}`;

  let results;
  try {
    results = await searchWeb(query, RESULTS_PER_SEARCH);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Web search failed.";
    await logAgentAction({ agent: "scout-search", requestSuccess: false, errorCode: message });
    return NextResponse.json({ ok: false, territory: territory.slug, query, error: message }, { status: 502 });
  }

  await logAgentAction({ agent: "scout-search", requestSuccess: true, schemaValid: true });

  const outcomes: RunOutcome[] = [];
  let created = 0;

  for (const result of results) {
    if (created >= MAX_NEW_CANDIDATES_PER_RUN) break;

    try {
      const existing = await findSourceByUrl(new URL(result.url).toString());
      if (existing) continue;
    } catch {
      continue;
    }

    const outcome = await discoverFromUrl(result.url, "autonomous");
    outcomes.push({ url: result.url, ok: outcome.ok, error: outcome.ok ? undefined : outcome.error });
    if (outcome.ok) created += 1;
  }

  return NextResponse.json({
    ok: true,
    territory: territory.slug,
    query,
    searchResultCount: results.length,
    candidatesCreated: created,
    outcomes
  });
}
