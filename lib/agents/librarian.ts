import type { DiscoverableNodeType, LibrarianOutput, ResearcherOutput, ScoutOutput } from "@/lib/kg-types";
import type { PublishedEntity, PublishedNode } from "@/lib/kg-store";
import { slugify } from "@/lib/utils";

/**
 * Unlike Scout and Researcher, the Librarian makes no AI call in this
 * slice. Its job here — format Scout+Researcher output into a concrete
 * node and relationship proposal — is a mechanical transformation with a
 * single correct shape, not a judgment call. Reaching for an LLM call
 * where deterministic code is simpler, cheaper, and more trustworthy would
 * be exactly the kind of unnecessary complexity the brief warns against.
 * The same reasoning extends to duplicate detection below: a title-overlap
 * heuristic is deterministic, free, and transparent enough to show a human
 * reviewer, so there's no need for an embeddings call or an LLM judgment
 * just to flag "this might already exist."
 */

/**
 * "repo" maps to "technology" rather than getting its own node type — a
 * discovered code repository is more usefully modeled as a technology
 * ThinkJackson is tracking than as its own category. "article",
 * "announcement", "interview", and "other" all stay the generic "resource"
 * shape: nothing about those formats implies a more specific kg_nodes type.
 */
export function sourceTypeToNodeType(sourceType: ScoutOutput["sourceType"]): DiscoverableNodeType {
  if (sourceType === "paper") return "paper";
  if (sourceType === "repo") return "technology";
  if (sourceType === "dataset") return "dataset";
  if (sourceType === "experiment") return "experiment";
  return "resource";
}

const TITLE_STOPWORDS = new Set([
  "a", "an", "the", "of", "and", "or", "to", "in", "on", "for", "is", "are", "with", "by", "wikipedia"
]);

function titleTokens(title: string): Set<string> {
  return new Set(
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2 && !TITLE_STOPWORDS.has(word))
  );
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const token of a) if (b.has(token)) intersection++;
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/**
 * 0.4 is a judgment call, not a tuned constant: high enough that unrelated
 * titles ("Mechanism design" vs "Algorithmic trading") never match, low
 * enough to catch two titles for the same real-world topic even when
 * worded differently ("Zero-knowledge proof" vs "Zero-knowledge proofs
 * explained"). False positives are cheap here — the human reviewer just
 * sees an extra warning — so this leans toward flagging more, not fewer.
 */
const DUPLICATE_SIMILARITY_THRESHOLD = 0.4;

export function findPossibleDuplicate(
  candidateTitle: string,
  existingNodes: PublishedNode[]
): LibrarianOutput["possibleDuplicate"] {
  const candidateTokens = titleTokens(candidateTitle);
  let best: { node: PublishedNode; similarity: number } | undefined;

  for (const node of existingNodes) {
    const similarity = jaccardSimilarity(candidateTokens, titleTokens(node.title));
    if (similarity >= DUPLICATE_SIMILARITY_THRESHOLD && (!best || similarity > best.similarity)) {
      best = { node, similarity };
    }
  }

  if (!best) return undefined;
  return { nodeId: best.node.id, type: best.node.type, slug: best.node.slug, title: best.node.title, similarity: best.similarity };
}

/**
 * Exact match on canonical name or any known alias, case/whitespace
 * insensitive, restricted to the same entity_type — deliberately not a
 * fuzzy heuristic like findPossibleDuplicate's title-overlap check, since
 * getting entity resolution wrong silently merges two different people. A
 * miss just means a new entity gets created (cheap, reversible); a false
 * merge would corrupt whose claims are whose. Genuine fuzzy resolution
 * ("Prof. Ramesh Raskar" vs "R. Raskar") is real future work, not this slice.
 */
function normalizeEntityName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

export function findExistingEntity(
  name: string,
  entityType: ScoutOutput["entities"][number]["kind"],
  existingEntities: PublishedEntity[]
): PublishedEntity | undefined {
  const normalized = normalizeEntityName(name);
  return existingEntities.find(
    (entity) =>
      entity.entityType === entityType &&
      (normalizeEntityName(entity.canonicalName) === normalized || entity.aliases.some((alias) => normalizeEntityName(alias) === normalized))
  );
}

export function runLibrarian(params: {
  url: string;
  scout: ScoutOutput;
  researcher: ResearcherOutput;
  existingNodesOfType?: PublishedNode[];
  existingEntities?: PublishedEntity[];
}): LibrarianOutput {
  const slug = (slugify(params.scout.title).slice(0, 80) || slugify(params.url)).replace(/-+$/, "");

  const output: LibrarianOutput = {
    proposedNode: {
      type: sourceTypeToNodeType(params.scout.sourceType),
      slug,
      title: params.scout.title,
      summary: params.scout.summary,
      metadata: { url: params.url, sourceType: params.scout.sourceType, entities: params.scout.entities }
    },
    proposedRelationships: params.researcher.proposedConnections.map((connection) => ({
      toType: connection.targetType,
      toSlug: connection.targetSlug,
      relationType: connection.relationType,
      rationale: connection.rationale,
      confidence: params.scout.confidenceScore / 10
    })),
    possibleDuplicate: findPossibleDuplicate(params.scout.title, params.existingNodesOfType ?? []),
    proposedEntities: params.scout.entities.map((entity) => {
      const existing = findExistingEntity(entity.name, entity.kind, params.existingEntities ?? []);
      return {
        entityType: entity.kind,
        slug: existing?.slug ?? (slugify(entity.name).slice(0, 80) || slugify(entity.kind)).replace(/-+$/, ""),
        canonicalName: existing?.canonicalName ?? entity.name,
        existing: existing !== undefined
      };
    })
  };

  if (params.researcher.openQuestion) {
    const questionSlug = (slugify(params.researcher.openQuestion).slice(0, 80) || `${slug}-question`).replace(/-+$/, "");
    output.proposedQuestion = {
      type: "question",
      slug: questionSlug,
      title: params.researcher.openQuestion,
      hypothesis: params.researcher.openQuestionHypothesis,
      generatedByTargets: params.researcher.proposedConnections.map((connection) => ({
        toType: connection.targetType,
        toSlug: connection.targetSlug
      }))
    };
  }

  const predictionClaims = params.researcher.claims.filter((claim) => claim.epistemicStatus === "prediction");
  if (predictionClaims.length > 0) {
    output.proposedPredictions = predictionClaims.map((claim, index) => ({
      type: "prediction" as const,
      slug: (slugify(claim.statement).slice(0, 80) || `${slug}-prediction-${index}`).replace(/-+$/, ""),
      title: claim.statement,
      rationale: claim.evidence,
      generatedByTargets: params.researcher.proposedConnections.map((connection) => ({
        toType: connection.targetType,
        toSlug: connection.targetSlug
      }))
    }));
  }

  return output;
}
