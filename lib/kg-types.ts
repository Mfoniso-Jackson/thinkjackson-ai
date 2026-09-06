import { z } from "zod";

/**
 * Node/relationship types an agent is allowed to touch in this first slice.
 * Deliberately a subset of the full NodeType/RelationType unions in
 * lib/graph/types.ts — Scout and Researcher can connect a discovery to an
 * existing idea, territory, venture, person, or essay, but cannot invent
 * new territories, question nodes, or predictions. That stays human work.
 */
export const connectableNodeTypes = ["idea", "territory", "venture", "person", "essay"] as const;
export const proposableRelationTypes = ["discusses", "supports", "challenges", "related-to", "applies"] as const;
export const epistemicStatuses = ["fact", "interpretation", "hypothesis", "prediction", "speculation"] as const;

export const scoutSourceTypes = ["article", "paper", "repo", "announcement", "interview", "dataset", "experiment", "other"] as const;

/**
 * The kg_nodes type a discovery becomes is derived from this classification,
 * not a separate field the Researcher or Librarian has to also get right —
 * one source of truth for "what kind of thing is this" that both Scout's
 * self-report and the eventual published node agree on. See
 * sourceTypeToNodeType in lib/agents/librarian.ts.
 */
export const scoutOutputSchema = z.object({
  title: z.string().min(5).max(200),
  summary: z.string().min(20).max(800),
  sourceType: z.enum(scoutSourceTypes),
  entities: z
    .array(
      z.object({
        name: z.string().min(1).max(120),
        kind: z.enum(["person", "company", "technology", "project"])
      })
    )
    .max(10),
  suggestedTerritorySlugs: z.array(z.string()).max(3),
  importanceScore: z.number().int().min(1).max(10),
  confidenceScore: z.number().int().min(1).max(10)
});
export type ScoutOutput = z.infer<typeof scoutOutputSchema>;

export const researcherOutputSchema = z.object({
  claims: z
    .array(
      z.object({
        statement: z.string().min(10).max(400),
        epistemicStatus: z.enum(epistemicStatuses),
        evidence: z.string().max(300).optional()
      })
    )
    .min(1)
    .max(8),
  proposedConnections: z
    .array(
      z.object({
        targetType: z.enum(connectableNodeTypes),
        targetSlug: z.string().min(1).max(120),
        relationType: z.enum(proposableRelationTypes),
        rationale: z.string().min(10).max(300)
      })
    )
    .min(1)
    .max(3),
  openQuestion: z.string().min(10).max(300).optional()
});
export type ResearcherOutput = z.infer<typeof researcherOutputSchema>;

export const discoverableNodeTypes = ["resource", "paper", "technology", "dataset", "experiment"] as const;
export type DiscoverableNodeType = (typeof discoverableNodeTypes)[number];

export type LibrarianOutput = {
  proposedNode: {
    type: DiscoverableNodeType;
    slug: string;
    title: string;
    summary: string;
    metadata: { url: string; sourceType: ScoutOutput["sourceType"]; entities: ScoutOutput["entities"] };
  };
  proposedRelationships: Array<{
    toType: (typeof connectableNodeTypes)[number];
    toSlug: string;
    relationType: (typeof proposableRelationTypes)[number];
    rationale: string;
    confidence: number;
  }>;
  /**
   * Only present when the Researcher surfaced an open question. It becomes
   * its own kg_nodes row (type: "question"), generated-by the same targets
   * the resource node connects to — not folded into the resource's summary,
   * because questions are meant to accumulate and be browsed on their own,
   * not disappear inside whatever discovered them.
   */
  proposedQuestion?: {
    type: "question";
    slug: string;
    title: string;
    generatedByTargets: Array<{ toType: (typeof connectableNodeTypes)[number]; toSlug: string }>;
  };
  /**
   * One entry per claim the Researcher labeled "prediction" — the brief is
   * explicit that predictions stay human-authority, not agent-authority, so
   * this is a proposal like everything else here: nothing here is a real
   * ledger entry until the same human Approve action that publishes the
   * resource node also publishes these. probability/resolutionDate/outcome
   * are left unset rather than guessed — a human adds those later, if ever.
   */
  proposedPredictions?: Array<{
    type: "prediction";
    slug: string;
    title: string;
    rationale?: string;
    generatedByTargets: Array<{ toType: (typeof connectableNodeTypes)[number]; toSlug: string }>;
  }>;
  /**
   * Set when the proposed node's title looks like a near-duplicate of an
   * already-published node of the same type — a deterministic title-overlap
   * check the Librarian runs itself (see findPossibleDuplicate in
   * lib/agents/librarian.ts), not a judgment call worth an AI call for.
   * Never blocks publishing: the human reviewing this candidate sees the
   * warning and decides, same as every other proposal here.
   */
  possibleDuplicate?: {
    nodeId: string;
    type: string;
    slug: string;
    title: string;
    similarity: number;
  };
};

export type ResearchCandidatePayload = {
  url: string;
  retrievedAt: string;
  excerpt: string;
  scout: ScoutOutput;
  researcher?: ResearcherOutput;
  librarian?: LibrarianOutput;
  /**
   * "autonomous" when the URL came from the scheduled web-search cron
   * rather than a human pasting it in — surfaced in the admin review queue
   * so the reviewer knows whether a person or the system found this,
   * matching the site's general provenance-over-polish stance. Omitted
   * (not defaulted to "manual") for candidates created before this field
   * existed, rather than guessing their origin.
   */
  discoveryMethod?: "manual" | "autonomous";
};

export type ResearchCandidateStatus = "discovered" | "investigating" | "verified" | "rejected" | "published";

export type ResearchCandidate = {
  id: string;
  sourceId: string | null;
  status: ResearchCandidateStatus;
  title: string;
  summary: string;
  payload: ResearchCandidatePayload;
  reviewedBy: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
};
