import "server-only";
import { isSupabaseConfigured, supabaseInsert, supabaseRequest, supabaseUpdate } from "@/lib/supabase";
import type { ResearchCandidate, ResearchCandidatePayload, ResearchCandidateStatus } from "@/lib/kg-types";

type SourceRow = {
  id: string;
  url: string;
  source_type: string;
  title: string | null;
  retrieved_at: string;
  human_verified: boolean;
};

type CandidateRow = {
  id: string;
  source_id: string | null;
  status: ResearchCandidateStatus;
  title: string;
  summary: string;
  payload: ResearchCandidatePayload;
  reviewed_by: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
};

function toCandidate(row: CandidateRow): ResearchCandidate {
  return {
    id: row.id,
    sourceId: row.source_id,
    status: row.status,
    title: row.title,
    summary: row.summary,
    payload: row.payload,
    reviewedBy: row.reviewed_by,
    reviewedAt: row.reviewed_at,
    rejectionReason: row.rejection_reason,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export type PublishedNode = {
  id: string;
  type: string;
  slug: string;
  title: string;
  summary: string;
  metadata: Record<string, unknown>;
  createdAt: string;
};

/** Real, agent-published nodes of one type — used by public pages like /questions that list a whole node type rather than resolving one ref at a time, and by the Librarian's duplicate check before proposing a new node of the same type. */
export async function listPublishedNodesByType(type: string): Promise<PublishedNode[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const rows = (await supabaseRequest(
      `kg_nodes?type=eq.${type}&status=eq.published&select=*&order=created_at.desc&limit=100`
    )) as Array<{ id: string; type: string; slug: string; title: string; summary: string; metadata: Record<string, unknown>; created_at: string }>;
    return rows.map((row) => ({
      id: row.id,
      type: row.type,
      slug: row.slug,
      title: row.title,
      summary: row.summary,
      metadata: row.metadata,
      createdAt: row.created_at
    }));
  } catch {
    return [];
  }
}

export async function findSourceByUrl(url: string): Promise<SourceRow | undefined> {
  const rows = (await supabaseRequest(`kg_sources?url=eq.${encodeURIComponent(url)}&select=*&limit=1`)) as SourceRow[];
  return rows[0];
}

/**
 * A source only blocks rediscovery while it has a candidate still in play
 * (anything but "rejected"). A source whose only candidate was rejected —
 * e.g. Scout succeeded but Researcher then hit a transient error — should
 * be retryable, not permanently locked out just because Scout's fetch
 * already happened once.
 */
export async function findActiveCandidateBySourceId(sourceId: string): Promise<ResearchCandidate | undefined> {
  const rows = (await supabaseRequest(
    `research_candidates?source_id=eq.${sourceId}&status=neq.rejected&select=*&limit=1`
  )) as CandidateRow[];
  return rows[0] ? toCandidate(rows[0]) : undefined;
}

export async function createSource(input: { url: string; sourceType: string; title: string; excerpt: string }) {
  return (await supabaseInsert("kg_sources", {
    url: input.url,
    source_type: input.sourceType,
    title: input.title,
    raw_excerpt: input.excerpt.slice(0, 4000)
  })) as SourceRow;
}

export async function createResearchCandidate(input: {
  sourceId: string;
  status: ResearchCandidateStatus;
  title: string;
  summary: string;
  payload: ResearchCandidatePayload;
}) {
  const row = (await supabaseInsert("research_candidates", {
    source_id: input.sourceId,
    status: input.status,
    title: input.title,
    summary: input.summary,
    payload: input.payload
  })) as CandidateRow;
  return toCandidate(row);
}

export async function updateResearchCandidate(
  id: string,
  patch: Partial<{ status: ResearchCandidateStatus; payload: ResearchCandidatePayload; reviewedBy: string; reviewedAt: string; rejectionReason: string }>
) {
  const row = (await supabaseUpdate("research_candidates", `id=eq.${id}`, {
    ...(patch.status ? { status: patch.status } : {}),
    ...(patch.payload ? { payload: patch.payload } : {}),
    ...(patch.reviewedBy ? { reviewed_by: patch.reviewedBy } : {}),
    ...(patch.reviewedAt ? { reviewed_at: patch.reviewedAt } : {}),
    ...(patch.rejectionReason ? { rejection_reason: patch.rejectionReason } : {}),
    updated_at: new Date().toISOString()
  })) as CandidateRow;
  return toCandidate(row);
}

export async function getResearchCandidate(id: string): Promise<ResearchCandidate | undefined> {
  const rows = (await supabaseRequest(`research_candidates?id=eq.${id}&select=*&limit=1`)) as CandidateRow[];
  return rows[0] ? toCandidate(rows[0]) : undefined;
}

/**
 * Returns an empty list both when Supabase isn't configured and when the
 * migration hasn't been run yet (the table doesn't exist) — both are
 * expected pre-setup states for this page, not runtime errors worth a 500.
 */
export async function listResearchCandidates(status?: ResearchCandidateStatus): Promise<ResearchCandidate[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const filter = status ? `&status=eq.${status}` : "";
    const rows = (await supabaseRequest(`research_candidates?select=*${filter}&order=created_at.desc&limit=50`)) as CandidateRow[];
    return rows.map(toCandidate);
  } catch {
    return [];
  }
}

/** Approves a verified candidate: writes the real kg_nodes/kg_relationships rows and marks the source human-verified. This is the only path from a proposal to something live in the graph. */
export async function publishResearchCandidate(id: string, reviewedBy: string) {
  const candidate = await getResearchCandidate(id);
  if (!candidate) throw new Error("Research candidate not found.");
  if (candidate.status !== "verified") throw new Error(`Cannot publish a candidate in status "${candidate.status}".`);
  const librarian = candidate.payload.librarian;
  if (!librarian) throw new Error("This candidate has no Librarian proposal to publish.");

  await supabaseInsert("kg_nodes", {
    type: librarian.proposedNode.type,
    slug: librarian.proposedNode.slug,
    title: librarian.proposedNode.title,
    summary: librarian.proposedNode.summary,
    metadata: librarian.proposedNode.metadata,
    created_by: "agent:librarian"
  });

  for (const relationship of librarian.proposedRelationships) {
    await supabaseInsert("kg_relationships", {
      from_type: librarian.proposedNode.type,
      from_slug: librarian.proposedNode.slug,
      relation_type: relationship.relationType,
      to_type: relationship.toType,
      to_slug: relationship.toSlug,
      confidence: relationship.confidence,
      source_id: candidate.sourceId,
      created_by: "agent:librarian"
    });
  }

  if (librarian.proposedQuestion) {
    await supabaseInsert("kg_nodes", {
      type: librarian.proposedQuestion.type,
      slug: librarian.proposedQuestion.slug,
      title: librarian.proposedQuestion.title,
      summary: librarian.proposedQuestion.title,
      metadata: { raisedByUrl: candidate.payload.url },
      created_by: "agent:librarian"
    });

    for (const target of librarian.proposedQuestion.generatedByTargets) {
      await supabaseInsert("kg_relationships", {
        from_type: librarian.proposedQuestion.type,
        from_slug: librarian.proposedQuestion.slug,
        relation_type: "generated-by",
        to_type: target.toType,
        to_slug: target.toSlug,
        confidence: null,
        source_id: candidate.sourceId,
        created_by: "agent:librarian"
      });
    }
  }

  for (const prediction of librarian.proposedPredictions ?? []) {
    await supabaseInsert("kg_nodes", {
      type: prediction.type,
      slug: prediction.slug,
      title: prediction.title,
      summary: prediction.title,
      metadata: {
        rationale: prediction.rationale ?? null,
        sourceUrl: candidate.payload.url,
        probability: null,
        resolutionDate: null,
        outcome: null,
        resolutionStatus: "unresolved"
      },
      created_by: "agent:librarian"
    });

    for (const target of prediction.generatedByTargets) {
      await supabaseInsert("kg_relationships", {
        from_type: prediction.type,
        from_slug: prediction.slug,
        relation_type: "derived-from",
        to_type: target.toType,
        to_slug: target.toSlug,
        confidence: null,
        source_id: candidate.sourceId,
        created_by: "agent:librarian"
      });
    }
  }

  if (candidate.sourceId) {
    await supabaseUpdate("kg_sources", `id=eq.${candidate.sourceId}`, { human_verified: true });
  }

  return updateResearchCandidate(id, { status: "published", reviewedBy, reviewedAt: new Date().toISOString() });
}

export async function rejectResearchCandidate(id: string, reviewedBy: string, reason: string) {
  return updateResearchCandidate(id, { status: "rejected", reviewedBy, reviewedAt: new Date().toISOString(), rejectionReason: reason });
}

export async function logAgentAction(entry: {
  agent: string;
  researchCandidateId?: string;
  model?: string;
  latencyMs?: number;
  tokenUsage?: Record<string, unknown>;
  requestSuccess: boolean;
  schemaValid?: boolean;
  errorCode?: string;
}) {
  if (!isSupabaseConfigured()) return;
  try {
    await supabaseInsert("agent_logs", {
      agent: entry.agent,
      research_candidate_id: entry.researchCandidateId ?? null,
      model: entry.model ?? null,
      latency_ms: entry.latencyMs ?? null,
      token_usage: entry.tokenUsage ?? {},
      request_success: entry.requestSuccess,
      schema_valid: entry.schemaValid ?? null,
      error_code: entry.errorCode?.slice(0, 200) ?? null
    });
  } catch {
    // Observability must never break the pipeline it's observing.
  }
}

export type AgentLogEntry = {
  id: string;
  agent: string;
  researchCandidateId: string | null;
  model: string | null;
  latencyMs: number | null;
  requestSuccess: boolean;
  schemaValid: boolean | null;
  errorCode: string | null;
  createdAt: string;
};

/** Real rows only — an empty or short list here is a normal, honest state for an admin tool, not something to pad out. */
export async function listAgentLogs(limit = 100): Promise<AgentLogEntry[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const rows = (await supabaseRequest(`agent_logs?select=*&order=created_at.desc&limit=${limit}`)) as Array<{
      id: string;
      agent: string;
      research_candidate_id: string | null;
      model: string | null;
      latency_ms: number | null;
      request_success: boolean;
      schema_valid: boolean | null;
      error_code: string | null;
      created_at: string;
    }>;
    return rows.map((row) => ({
      id: row.id,
      agent: row.agent,
      researchCandidateId: row.research_candidate_id,
      model: row.model,
      latencyMs: row.latency_ms,
      requestSuccess: row.request_success,
      schemaValid: row.schema_valid,
      errorCode: row.error_code,
      createdAt: row.created_at
    }));
  } catch {
    return [];
  }
}
