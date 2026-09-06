"use server";

import { requireExecutionOwner } from "@/lib/execution-auth";
import { discoverFromUrl } from "@/lib/agents/discovery-pipeline";
import { getResearchCandidate, listResearchCandidates, publishResearchCandidate, rejectResearchCandidate } from "@/lib/kg-store";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { ResearchCandidate } from "@/lib/kg-types";

export type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

/**
 * Runs Scout -> Researcher -> Librarian against one human-provided URL.
 * The actual pipeline lives in lib/agents/discovery-pipeline.ts, shared
 * with the autonomous-Scout cron route — this wrapper only adds the admin
 * auth check a human-triggered request needs. Nothing here writes to
 * kg_nodes or kg_relationships — see publishCandidate below, the only path
 * that does, and it requires the same admin auth as this trigger.
 */
export async function runDiscoveryPipeline(url: string): Promise<ActionResult<ResearchCandidate>> {
  await requireExecutionOwner();

  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY." };
  }

  return discoverFromUrl(url, "manual");
}

export async function listCandidates(): Promise<ResearchCandidate[]> {
  await requireExecutionOwner();
  return listResearchCandidates();
}

export async function approveCandidate(candidateId: string): Promise<ActionResult<ResearchCandidate>> {
  try {
    const owner = await requireExecutionOwner();
    const candidate = await publishResearchCandidate(candidateId, owner);
    return { ok: true, data: candidate };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Could not publish this candidate." };
  }
}

export async function rejectCandidate(candidateId: string, reason: string): Promise<ActionResult<null>> {
  try {
    const owner = await requireExecutionOwner();
    await rejectResearchCandidate(candidateId, owner, reason || "No reason given.");
    return { ok: true, data: null };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Could not reject this candidate." };
  }
}

export async function getCandidate(candidateId: string): Promise<ResearchCandidate | undefined> {
  await requireExecutionOwner();
  return getResearchCandidate(candidateId);
}
