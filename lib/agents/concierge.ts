import "server-only";
import { generate } from "@/lib/ai/runtime";
import { listAllPublishedNodes, listEntities, listAllClaimsWithContext, type ClaimWithContext, type PublishedEntity } from "@/lib/kg-store";
import type { PublishedNode } from "@/lib/kg-store";

const STOPWORDS = new Set([
  "the", "a", "an", "of", "and", "or", "to", "in", "on", "for", "is", "are", "with", "by", "what", "who", "how",
  "does", "do", "can", "which", "that", "this", "about", "there", "have", "has", "will", "would", "could"
]);

function keywords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOPWORDS.has(word));
}

function scoreText(text: string, kws: string[]): number {
  const lower = text.toLowerCase();
  return kws.reduce((sum, kw) => sum + (lower.includes(kw) ? 1 : 0), 0);
}

const discoverableTypes = new Set(["resource", "paper", "technology", "dataset", "experiment"]);

function hrefFor(type: string, slug: string): string {
  if (type === "question") return `/questions/${slug}`;
  if (type === "prediction") return `/predictions/${slug}`;
  if (type === "entity") return `/entities/${slug}`;
  if (discoverableTypes.has(type)) return `/discoveries/${slug}`;
  if (type === "person") return `/people/${slug}`;
  if (type === "venture") return `/projects/${slug}`;
  return "#";
}

export type ConciergeConcept = { key: string; type: string; slug: string; title: string; href: string };
export type ConciergeSource = { title: string; url: string };

export type ConciergeAnswer = {
  answerable: boolean;
  answer: string;
  concepts: ConciergeConcept[];
  sources: ConciergeSource[];
  relatedQuestions: ConciergeConcept[];
};

const MAX_CONTEXT_CONCEPTS = 10;
const MAX_CONTEXT_CLAIMS = 12;

const conciergeJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["answerable", "answer", "usedConceptKeys", "usedClaimIds"],
  properties: {
    answerable: { type: "boolean" },
    answer: { type: "string", minLength: 10, maxLength: 1600 },
    usedConceptKeys: { type: "array", maxItems: 10, items: { type: "string" } },
    usedClaimIds: { type: "array", maxItems: 15, items: { type: "string" } }
  }
};

const systemPrompt = `You are Ask ThinkJackson — a grounded question-answering interface over ThinkJackson's real, human-reviewed knowledge graph. You are given a question and a fixed list of concepts (nodes/entities) and claims actually published on ThinkJackson, each with a key or id. Answer ONLY using what's in that list. Never invent facts, sources, relationships, or concepts that are not in the provided list — if the list doesn't contain enough to genuinely answer the question, set answerable to false and say so plainly in "answer" rather than guessing or falling back on general knowledge. Do not answer questions unrelated to ThinkJackson's research territory (AI agents, financial intelligence, risk/uncertainty, trust/coordination) even if you know the answer generally — that is out of scope for this interface. When you do answer, list the concept keys and claim ids you actually drew on in usedConceptKeys/usedClaimIds so the reader can verify every part of the answer against its source.`;

function toParse(
  conceptByKey: Map<string, ConciergeConcept>,
  claimById: Map<string, ClaimWithContext>
) {
  return (raw: unknown) => {
    const parsed = raw as { answerable: boolean; answer: string; usedConceptKeys?: string[]; usedClaimIds?: string[] };
    const concepts = (parsed.usedConceptKeys ?? []).map((key) => conceptByKey.get(key)).filter((c): c is ConciergeConcept => c !== undefined);
    const claims = (parsed.usedClaimIds ?? []).map((id) => claimById.get(id)).filter((c): c is ClaimWithContext => c !== undefined);
    const sources: ConciergeSource[] = [];
    const seenUrls = new Set<string>();
    for (const claim of claims) {
      if (claim.sourceUrl && !seenUrls.has(claim.sourceUrl)) {
        seenUrls.add(claim.sourceUrl);
        sources.push({ title: claim.nodeTitle, url: claim.sourceUrl });
      }
    }
    return {
      answerable: parsed.answerable,
      answer: parsed.answer,
      concepts,
      sources,
      relatedQuestions: concepts.filter((c) => c.type === "question")
    } satisfies ConciergeAnswer;
  };
}

/**
 * Retrieval is deliberately simple keyword overlap, not embeddings — the
 * graph is still small enough (tens of nodes) that scoring everything in
 * memory works fine and stays transparent. The AI call only ever sees a
 * fixed, real list of concepts/claims and is told to cite which ones it
 * used; concepts/sources shown to the reader are looked up from that same
 * list afterward, never taken from the model's own text — so it cannot
 * invent a URL or a relationship that doesn't exist.
 */
export async function askThinkJackson(question: string): Promise<ConciergeAnswer> {
  const kws = keywords(question);

  const [nodes, entities, claims] = await Promise.all([
    listAllPublishedNodes(200),
    listEntities(),
    listAllClaimsWithContext()
  ]);

  const conceptCandidates: Array<{ concept: ConciergeConcept; score: number; summary: string }> = [
    ...nodes.map((node: PublishedNode) => ({
      concept: { key: `${node.type}:${node.slug}`, type: node.type, slug: node.slug, title: node.title, href: hrefFor(node.type, node.slug) },
      score: scoreText(`${node.title} ${node.summary}`, kws),
      summary: node.summary
    })),
    ...entities.map((entity: PublishedEntity) => ({
      concept: {
        key: `entity:${entity.slug}`,
        type: "entity",
        slug: entity.slug,
        title: entity.canonicalName,
        href: hrefFor("entity", entity.slug)
      },
      score: scoreText(`${entity.canonicalName} ${entity.aliases.join(" ")} ${entity.description ?? ""}`, kws),
      summary: entity.description ?? ""
    }))
  ];

  const topConcepts = conceptCandidates
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_CONTEXT_CONCEPTS);

  const topClaims = claims
    .map((claim) => ({ claim, score: scoreText(`${claim.statement} ${claim.nodeTitle}`, kws) }))
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_CONTEXT_CLAIMS)
    .map((c) => c.claim);

  if (topConcepts.length === 0 && topClaims.length === 0) {
    return {
      answerable: false,
      answer: "ThinkJackson's graph doesn't have enough connected to this question yet. Try exploring the map, or submit a source that would help answer it.",
      concepts: [],
      sources: [],
      relatedQuestions: []
    };
  }

  const conceptByKey = new Map(topConcepts.map((c) => [c.concept.key, c.concept]));
  const claimById = new Map(topClaims.map((c) => [c.id, c]));

  const result = await generate(
    {
      task: "concierge",
      agentName: "Concierge",
      jsonSchema: { name: "concierge_answer", schema: conciergeJsonSchema },
      systemPrompt,
      input: {
        question,
        concepts: topConcepts.map((c) => ({ key: c.concept.key, type: c.concept.type, title: c.concept.title, summary: c.summary.slice(0, 400) })),
        claims: topClaims.map((c) => ({ id: c.id, statement: c.statement, epistemicStatus: c.epistemicStatus, from: c.nodeTitle }))
      }
    },
    toParse(conceptByKey, claimById)
  );

  return result.output;
}
