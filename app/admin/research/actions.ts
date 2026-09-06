"use server";

import { requireExecutionOwner } from "@/lib/execution-auth";
import { runScout } from "@/lib/agents/scout";
import { runResearcher } from "@/lib/agents/researcher";
import { runLibrarian } from "@/lib/agents/librarian";
import {
  createResearchCandidate,
  createSource,
  findSourceByUrl,
  getResearchCandidate,
  listResearchCandidates,
  logAgentAction,
  publishResearchCandidate,
  rejectResearchCandidate,
  updateResearchCandidate
} from "@/lib/kg-store";
import { isSupabaseConfigured } from "@/lib/supabase";
import type { ResearchCandidate, ResearchCandidatePayload } from "@/lib/kg-types";

export type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

function friendlyStoreError(error: unknown): string {
  const message = error instanceof Error ? error.message : "The knowledge graph tables could not be reached.";
  if (message.includes("PGRST205") || message.includes("schema cache")) {
    return "The knowledge graph tables don't exist yet — run the migration in supabase/migrations/20260906130000_knowledge_graph.sql.";
  }
  return message;
}

/**
 * Runs Scout -> Researcher -> Librarian in sequence against one
 * human-provided URL and leaves the result as a "verified" research
 * candidate, awaiting explicit human approval. Nothing here writes to
 * kg_nodes or kg_relationships — see publishCandidate below, the only path
 * that does, and it requires the same admin auth as this trigger.
 */
export async function runDiscoveryPipeline(url: string): Promise<ActionResult<ResearchCandidate>> {
  await requireExecutionOwner();

  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY." };
  }

  let parsedUrl: string;
  try {
    parsedUrl = new URL(url).toString();
  } catch {
    return { ok: false, error: "Enter a valid http/https URL." };
  }

  try {
    const existing = await findSourceByUrl(parsedUrl);
    if (existing) {
      return { ok: false, error: "This URL has already been discovered. Check the candidates list below." };
    }
  } catch (error) {
    return { ok: false, error: friendlyStoreError(error) };
  }

  let scoutResult;
  try {
    scoutResult = await runScout(parsedUrl);
    await logAgentAction({ agent: "scout", model: scoutResult.model, latencyMs: scoutResult.latencyMs, tokenUsage: scoutResult.usage, requestSuccess: true, schemaValid: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Scout failed.";
    await logAgentAction({ agent: "scout", requestSuccess: false, errorCode: message });
    return { ok: false, error: message };
  }

  let candidate: ResearchCandidate;
  const initialPayload: ResearchCandidatePayload = {
    url: parsedUrl,
    retrievedAt: scoutResult.source.retrievedAt,
    excerpt: scoutResult.source.text,
    scout: scoutResult.output
  };

  try {
    const source = await createSource({
      url: parsedUrl,
      sourceType: scoutResult.output.sourceType,
      title: scoutResult.output.title,
      excerpt: scoutResult.source.text
    });

    candidate = await createResearchCandidate({
      sourceId: source.id,
      status: "discovered",
      title: scoutResult.output.title,
      summary: scoutResult.output.summary,
      payload: initialPayload
    });

    candidate = await updateResearchCandidate(candidate.id, { status: "investigating" });
  } catch (error) {
    return { ok: false, error: friendlyStoreError(error) };
  }

  let researcherResult;
  try {
    researcherResult = await runResearcher({ url: parsedUrl, excerpt: scoutResult.source.text, scout: scoutResult.output });
    await logAgentAction({
      agent: "researcher",
      researchCandidateId: candidate.id,
      model: researcherResult.model,
      latencyMs: researcherResult.latencyMs,
      tokenUsage: researcherResult.usage,
      requestSuccess: true,
      schemaValid: true
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Researcher failed.";
    await logAgentAction({ agent: "researcher", researchCandidateId: candidate.id, requestSuccess: false, errorCode: message });
    try {
      await rejectResearchCandidate(candidate.id, "agent:researcher", message);
    } catch {
      // Best-effort — the candidate just stays in "investigating" if this also fails.
    }
    return { ok: false, error: message };
  }

  try {
    const librarianOutput = runLibrarian({ url: parsedUrl, scout: scoutResult.output, researcher: researcherResult.output });
    await logAgentAction({ agent: "librarian", researchCandidateId: candidate.id, requestSuccess: true, schemaValid: true });

    candidate = await updateResearchCandidate(candidate.id, {
      status: "verified",
      payload: { ...initialPayload, researcher: researcherResult.output, librarian: librarianOutput }
    });

    return { ok: true, data: candidate };
  } catch (error) {
    return { ok: false, error: friendlyStoreError(error) };
  }
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
