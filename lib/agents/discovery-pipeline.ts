import "server-only";
import { runScout } from "@/lib/agents/scout";
import { runResearcher } from "@/lib/agents/researcher";
import { runLibrarian, sourceTypeToNodeType } from "@/lib/agents/librarian";
import {
  createResearchCandidate,
  createSource,
  findActiveCandidateBySourceId,
  findSourceByUrl,
  listEntities,
  listPublishedNodesByType,
  logAgentAction,
  rejectResearchCandidate,
  updateResearchCandidate
} from "@/lib/kg-store";
import type { ResearchCandidate, ResearchCandidatePayload } from "@/lib/kg-types";

export type PipelineResult = { ok: true; data: ResearchCandidate } | { ok: false; error: string };

/**
 * Below this Scout importance score, an autonomously-found candidate is
 * auto-rejected right after Scout instead of proceeding to Researcher and
 * Librarian — skipping two more AI calls and keeping the human review
 * queue free of Scout's own low-confidence noise (product announcements,
 * plugin how-tos, etc.). Only applied to autonomous discovery: a human
 * who manually pastes a URL has already made the relevance judgment, so
 * their submission always gets the full pipeline regardless of score.
 */
const MIN_AUTONOMOUS_IMPORTANCE = Number(process.env.AUTONOMOUS_MIN_IMPORTANCE ?? "4");

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
    // The AI Runtime logs every provider attempt itself (lib/ai/fallback.ts)
    // — no manual logAgentAction call needed here anymore.
    scoutResult = await runScout(parsedUrl);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Scout failed.";
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

  if (discoveryMethod === "autonomous" && scoutResult.output.importanceScore < MIN_AUTONOMOUS_IMPORTANCE) {
    const reason = `Scout gave this a low importance score (${scoutResult.output.importanceScore}/10, below the ${MIN_AUTONOMOUS_IMPORTANCE} threshold for autonomous discoveries) — skipped Researcher and Librarian.`;
    try {
      await rejectResearchCandidate(candidate.id, "agent:scout", reason);
    } catch {
      // Best-effort — the candidate just stays in "investigating" if this also fails.
    }
    return { ok: false, error: reason };
  }

  let researcherResult;
  try {
    researcherResult = await runResearcher({
      url: parsedUrl,
      excerpt: scoutResult.source.text,
      scout: scoutResult.output,
      correlationId: candidate.id
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Researcher failed.";
    try {
      await rejectResearchCandidate(candidate.id, "agent:researcher", message);
    } catch {
      // Best-effort — the candidate just stays in "investigating" if this also fails.
    }
    return { ok: false, error: message };
  }

  try {
    const [existingNodesOfType, existingEntities] = await Promise.all([
      listPublishedNodesByType(sourceTypeToNodeType(scoutResult.output.sourceType)),
      listEntities()
    ]);
    const librarianOutput = runLibrarian({
      url: parsedUrl,
      scout: scoutResult.output,
      researcher: researcherResult.output,
      existingNodesOfType,
      existingEntities
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
