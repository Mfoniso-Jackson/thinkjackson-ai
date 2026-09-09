import "server-only";
import { isSupabaseConfigured, supabaseInsert, supabaseRequest, supabaseUpdate, supabaseUpsert } from "@/lib/supabase";
import type { EpistemicStatusValue, PublishedClaim, ResearchCandidate, ResearchCandidatePayload, ResearchCandidateStatus } from "@/lib/kg-types";

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

/** Every published node across all types, most recent first — the public Observatory's activity feed. */
export async function listAllPublishedNodes(limit = 50): Promise<PublishedNode[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const rows = (await supabaseRequest(
      `kg_nodes?status=eq.published&select=*&order=created_at.desc&limit=${limit}`
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

export type PublishedEntity = {
  id: string;
  entityType: string;
  slug: string;
  canonicalName: string;
  aliases: string[];
  description: string | null;
  externalIds: Record<string, unknown>;
  createdAt: string;
};

function toEntity(row: {
  id: string;
  entity_type: string;
  slug: string;
  canonical_name: string;
  aliases: string[];
  description: string | null;
  external_ids: Record<string, unknown>;
  created_at: string;
}): PublishedEntity {
  return {
    id: row.id,
    entityType: row.entity_type,
    slug: row.slug,
    canonicalName: row.canonical_name,
    aliases: row.aliases,
    description: row.description,
    externalIds: row.external_ids,
    createdAt: row.created_at
  };
}

/** Every published entity, most recent first — used by an index/browse view and by the Librarian's entity-resolution check before proposing a new one. */
export async function listEntities(): Promise<PublishedEntity[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const rows = (await supabaseRequest("entities?status=eq.published&select=*&order=created_at.desc&limit=500")) as Parameters<typeof toEntity>[0][];
    return rows.map(toEntity);
  } catch {
    return [];
  }
}

export async function getEntity(slug: string): Promise<PublishedEntity | undefined> {
  if (!isSupabaseConfigured()) return undefined;
  try {
    const rows = (await supabaseRequest(`entities?slug=eq.${slug}&status=eq.published&select=*&limit=1`)) as Parameters<typeof toEntity>[0][];
    return rows[0] ? toEntity(rows[0]) : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Every claim from every node that "mentions" this entity — the whole point
 * of keeping claims and entities as their own tables instead of letting
 * both evaporate at publish time. Two queries (find mentioning nodes, then
 * their claims) rather than a single join, since supabaseRequest is a thin
 * PostgREST wrapper with no query builder for embedded resource joins here.
 */
export async function listClaimsForEntity(entitySlug: string): Promise<Array<PublishedClaim & { nodeTitle: string; nodeSlug: string; nodeType: string; sourceUrl: string | null }>> {
  if (!isSupabaseConfigured()) return [];
  try {
    const mentions = (await supabaseRequest(
      `kg_relationships?to_type=eq.entity&to_slug=eq.${entitySlug}&relation_type=eq.mentions&select=from_type,from_slug`
    )) as Array<{ from_type: string; from_slug: string }>;
    if (mentions.length === 0) return [];

    const nodeRows = (
      await Promise.all(
        mentions.map(
          (mention) =>
            supabaseRequest(
              `kg_nodes?type=eq.${mention.from_type}&slug=eq.${mention.from_slug}&status=eq.published&select=id,type,slug,title&limit=1`
            ) as Promise<Array<{ id: string; type: string; slug: string; title: string }>>
        )
      )
    ).flat();
    if (nodeRows.length === 0) return [];

    const claimsByNode = await Promise.all(
      nodeRows.map(
        (node) =>
          supabaseRequest(`claims?node_id=eq.${node.id}&select=*&order=created_at.asc`) as Promise<
            Array<{
              id: string;
              node_id: string;
              statement: string;
              epistemic_status: EpistemicStatusValue;
              evidence: string | null;
              source_id: string | null;
              created_at: string;
            }>
          >
      )
    );

    const sourceIds = [...new Set(claimsByNode.flat().map((c) => c.source_id).filter((id): id is string => id !== null))];
    const sources = sourceIds.length
      ? ((await supabaseRequest(`kg_sources?id=in.(${sourceIds.join(",")})&select=id,url`)) as Array<{ id: string; url: string }>)
      : [];
    const urlBySourceId = new Map(sources.map((s) => [s.id, s.url]));

    return claimsByNode.flatMap((claims, index) => {
      const node = nodeRows[index];
      return claims.map((claim) => ({
        id: claim.id,
        nodeId: claim.node_id,
        statement: claim.statement,
        epistemicStatus: claim.epistemic_status,
        evidence: claim.evidence,
        sourceId: claim.source_id,
        createdAt: claim.created_at,
        nodeTitle: node.title,
        nodeSlug: node.slug,
        nodeType: node.type,
        sourceUrl: claim.source_id ? (urlBySourceId.get(claim.source_id) ?? null) : null
      }));
    });
  } catch {
    return [];
  }
}

const DISCOVERABLE_TYPES = "resource,paper,technology,dataset,experiment";

/**
 * A discovered resource has no dedicated page per type — /discoveries/[slug]
 * looks it up across all five discoverable types rather than needing the
 * caller to already know which one. Slugs are only unique per (type, slug),
 * not globally, but a real cross-type collision is vanishingly unlikely
 * since slugs are content-derived; if it ever happens this returns whichever
 * row comes back first, which is an acceptable, honest tradeoff for the
 * simplicity of one shared route instead of five near-identical ones.
 */
export async function getDiscoveredNode(slug: string): Promise<PublishedNode | undefined> {
  if (!isSupabaseConfigured()) return undefined;
  try {
    const rows = (await supabaseRequest(
      `kg_nodes?slug=eq.${slug}&type=in.(${DISCOVERABLE_TYPES})&status=eq.published&select=*&limit=1`
    )) as Array<{ id: string; type: string; slug: string; title: string; summary: string; metadata: Record<string, unknown>; created_at: string }>;
    const row = rows[0];
    if (!row) return undefined;
    return { id: row.id, type: row.type, slug: row.slug, title: row.title, summary: row.summary, metadata: row.metadata, createdAt: row.created_at };
  } catch {
    return undefined;
  }
}

/** Every published discovered resource across all five discoverable types, most recent first — the /discoveries index. */
export async function listDiscoveredNodes(limit = 100): Promise<PublishedNode[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const rows = (await supabaseRequest(
      `kg_nodes?type=in.(${DISCOVERABLE_TYPES})&status=eq.published&select=*&order=created_at.desc&limit=${limit}`
    )) as Array<{ id: string; type: string; slug: string; title: string; summary: string; metadata: Record<string, unknown>; created_at: string }>;
    return rows.map((row) => ({ id: row.id, type: row.type, slug: row.slug, title: row.title, summary: row.summary, metadata: row.metadata, createdAt: row.created_at }));
  } catch {
    return [];
  }
}

/** Every kg_relationships row is agent-authored (see the table's own default created_by), so a plain count is a real, honest "connections discovered" figure without needing a filter. */
export async function countPublishedRelationships(): Promise<number> {
  if (!isSupabaseConfigured()) return 0;
  try {
    const rows = (await supabaseRequest("kg_relationships?select=id&limit=1000")) as Array<{ id: string }>;
    return rows.length;
  } catch {
    return 0;
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

  const insertedNode = (await supabaseInsert("kg_nodes", {
    type: librarian.proposedNode.type,
    slug: librarian.proposedNode.slug,
    title: librarian.proposedNode.title,
    summary: librarian.proposedNode.summary,
    metadata: librarian.proposedNode.metadata,
    created_by: "agent:librarian"
  })) as { id: string };

  for (const entity of librarian.proposedEntities ?? []) {
    await supabaseUpsert(
      "entities",
      { entity_type: entity.entityType, slug: entity.slug, canonical_name: entity.canonicalName },
      "entity_type,slug"
    );
    await supabaseInsert("kg_relationships", {
      from_type: librarian.proposedNode.type,
      from_slug: librarian.proposedNode.slug,
      relation_type: "mentions",
      to_type: "entity",
      to_slug: entity.slug,
      confidence: null,
      source_id: candidate.sourceId,
      created_by: "agent:librarian"
    });
  }

  for (const claim of candidate.payload.researcher?.claims ?? []) {
    await supabaseInsert("claims", {
      node_id: insertedNode.id,
      statement: claim.statement,
      epistemic_status: claim.epistemicStatus,
      evidence: claim.evidence ?? null,
      source_id: candidate.sourceId,
      research_candidate_id: candidate.id
    });
  }

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
  taskType?: string;
  estimatedCostUsd?: number;
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
      error_code: entry.errorCode?.slice(0, 200) ?? null,
      task_type: entry.taskType ?? null,
      estimated_cost_usd: entry.estimatedCostUsd ?? 0
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
  taskType: string | null;
  estimatedCostUsd: number;
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
      task_type: string | null;
      estimated_cost_usd: number | null;
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
      taskType: row.task_type,
      estimatedCostUsd: row.estimated_cost_usd ?? 0,
      createdAt: row.created_at
    }));
  } catch {
    return [];
  }
}

/**
 * Today's total agent_logs rows (UTC day) — the cost guard's daily request
 * ceiling reads this instead of maintaining a separate counter table,
 * since traffic today is low enough that a query is cheaper than the
 * bookkeeping a counter would need.
 */
export async function countAgentActionsToday(): Promise<number> {
  if (!isSupabaseConfigured()) return 0;
  try {
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);
    const rows = (await supabaseRequest(`agent_logs?select=id&created_at=gte.${startOfDay.toISOString()}&limit=10000`)) as Array<{ id: string }>;
    return rows.length;
  } catch {
    return 0;
  }
}

/** Sum of estimated_cost_usd across today's (UTC) agent_logs rows — the cost guard's daily budget ceiling. */
export async function totalCostTodayUsd(): Promise<number> {
  if (!isSupabaseConfigured()) return 0;
  try {
    const startOfDay = new Date();
    startOfDay.setUTCHours(0, 0, 0, 0);
    const rows = (await supabaseRequest(
      `agent_logs?select=estimated_cost_usd&created_at=gte.${startOfDay.toISOString()}&limit=10000`
    )) as Array<{ estimated_cost_usd: number | null }>;
    return rows.reduce((sum, row) => sum + (row.estimated_cost_usd ?? 0), 0);
  } catch {
    return 0;
  }
}
