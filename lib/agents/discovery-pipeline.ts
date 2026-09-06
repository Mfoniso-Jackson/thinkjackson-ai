import "server-only";
import { runScout } from "@/lib/agents/scout";
import { runResearcher } from "@/lib/agents/researcher";
import { runLibrarian, sourceTypeToNodeType } from "@/lib/agents/librarian";
import {
  createResearchCandidate,
  createSource,
  findActiveCandidateBySourceId,
  findSourceByUrl,
  listPublishedNodesByType,
  logAgentAction,
  rejectResearchCandidate,
  updateResearchCandidate
} from "@/lib/kg-store";
import type { ResearchCandidate, ResearchCandidatePayload } from "@/lib/kg-types";

export type PipelineResult = { ok: true; data: ResearchCandidate } | { ok: false; error: string };

function friendlyStoreError(error: unknown): string {
  const message = error instanceof Error ? error.message : "The knowledge graph tables could not be reached.";
  if (message.includes("PGRST205") || message.includes("schema cache")) {
    return "The knowledge graph tables don't exist yet — run the migration in supabase/migrations/20260906130000_knowledge_graph.sql.";
  }
  return message;
}

/**
 * Runs Scout -> Researcher -> Librarian against one URL and leaves the
 * result as a "verified" research candidate, awaiting explicit human
 * approval. Factored out of app/admin/research/actions.ts so both the
 * human-triggered admin action and the autonomous-Scout cron route share
 * one implementation instead of drifting apart — auth is the caller's
 * responsibility (admin auth vs. the cron's CRON_SECRET check), not this
 * function's, since it has no session to check either way.
 */
export async function discoverFromUrl(url: string, discoveryMethod: "manual" | "autonomous"): Promise<PipelineResult> {
  let parsedUrl: string;
  try {
    parsedUrl = new URL(url).toString();
  } catch {
    return { ok: false, error: "Enter a valid http/https URL." };
  }

  let existingSource;
  try {
    existingSource = await findSourceByUrl(parsedUrl);
    if (existingSource) {
      const activeCandidate = await findActiveCandidateBySourceId(existingSource.id);
      if (activeCandidate) {
        return { ok: false, error: "This URL has already been discovered. Check the candidates list below." };
      }
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
    scout: scoutResult.output,
    discoveryMethod
  };

  try {
    const source =
      existingSource ??
      (await createSource({
        url: parsedUrl,
        sourceType: scoutResult.output.sourceType,
        title: scoutResult.output.title,
        excerpt: scoutResult.source.text
      }));

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
    const existingNodesOfType = await listPublishedNodesByType(sourceTypeToNodeType(scoutResult.output.sourceType));
    const librarianOutput = runLibrarian({
      url: parsedUrl,
      scout: scoutResult.output,
      researcher: researcherResult.output,
      existingNodesOfType
    });
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
