import { ideas, transIntelligence } from "@/data/ideas";
import { territories } from "@/data/territories";
import type { NodeRef, RelationRecord } from "@/lib/graph/types";
import { refEquals, refKey } from "@/lib/graph/types";

function idea(slug: string): NodeRef {
  return { type: "idea", slug };
}
function territory(slug: string): NodeRef {
  return { type: "territory", slug };
}
function venture(slug: string): NodeRef {
  return { type: "venture", slug };
}
function essay(slug: string): NodeRef {
  return { type: "essay", slug };
}
function person(slug: string): NodeRef {
  return { type: "person", slug };
}

const authoredRelations: RelationRecord[] = [
  // Person -> Idea
  { from: person("mfoniso-jackson"), type: "researches", to: idea("computational-superstition") },
  { from: person("mfoniso-jackson"), type: "researches", to: idea("non-causal-stabilization") },
  { from: person("mfoniso-jackson"), type: "researches", to: idea("portfolio-intelligence") },
  { from: person("mfoniso-jackson"), type: "researches", to: idea("agent-economy") },
  { from: person("mfoniso-jackson"), type: "researches", to: idea("machine-economies") },

  // Person -> Venture
  { from: person("mfoniso-jackson"), type: "founded", to: venture("omniquantai") },
  { from: person("mfoniso-jackson"), type: "founded", to: venture("massifx") },
  { from: person("mfoniso-jackson"), type: "founded", to: venture("gratifi") },
  { from: person("mfoniso-jackson"), type: "founded", to: venture("domusgraph-homegraph") },
  { from: person("mfoniso-jackson"), type: "founded", to: venture("computational-superstition-rl") },
  { from: person("mfoniso-jackson"), type: "founded", to: venture("sentiniq") },
  { from: person("mfoniso-jackson"), type: "founded", to: venture("liquidationguard") },

  // Essay -> Idea
  {
    from: essay("computational-superstition-in-reinforcement-learning"),
    type: "supports",
    to: idea("computational-superstition")
  },
  { from: essay("when-agents-keep-the-ritual"), type: "supports", to: idea("computational-superstition") },
  { from: essay("when-agents-keep-the-ritual"), type: "discusses", to: idea("non-causal-stabilization") },
  { from: essay("portfolio-intelligence-is-not-a-dashboard"), type: "discusses", to: idea("portfolio-intelligence") },
  { from: essay("machine-economies-need-coordination-primitives"), type: "discusses", to: idea("machine-economies") },
  { from: essay("machine-economies-need-coordination-primitives"), type: "discusses", to: idea("agent-economy") },

  // Venture -> Idea
  { from: venture("computational-superstition-rl"), type: "emerges-from", to: idea("computational-superstition") },
  { from: venture("computational-superstition-rl"), type: "emerges-from", to: idea("non-causal-stabilization") },
  { from: venture("omniquantai"), type: "emerges-from", to: idea("agent-economy") },
  { from: venture("omniquantai"), type: "emerges-from", to: idea("agentic-web") },
  { from: venture("omniquantai"), type: "applies", to: idea("agent-coordination") },
  { from: venture("omniquantai"), type: "applies", to: idea("portfolio-intelligence") },
  { from: venture("omniquantai"), type: "applies", to: idea("autonomous-trading-agents") },
  { from: venture("massifx"), type: "applies", to: idea("autonomous-trading-agents") },
  { from: venture("massifx"), type: "applies", to: idea("portfolio-intelligence") },
  { from: venture("massifx"), type: "emerges-from", to: idea("computational-superstition") },
  { from: venture("gratifi"), type: "applies", to: idea("machine-economies") },
  { from: venture("gratifi"), type: "applies", to: idea("agent-trust") },
  { from: venture("domusgraph-homegraph"), type: "applies", to: idea("adaptive-decision-systems") },
  { from: venture("liquidationguard"), type: "applies", to: idea("autonomous-trading-agents") },
  { from: venture("sentiniq"), type: "applies", to: idea("adaptive-decision-systems") },

  // Idea -> Idea
  { from: idea("computational-superstition"), type: "related-to", to: idea("non-causal-stabilization") },
  { from: idea("non-causal-stabilization"), type: "related-to", to: idea("agent-economy") },
  { from: idea("agentic-web"), type: "related-to", to: idea("agent-identity") },
  { from: idea("agent-identity"), type: "related-to", to: idea("agent-trust") },
  { from: idea("agent-trust"), type: "related-to", to: idea("agent-coordination") },
  { from: idea("agent-coordination"), type: "related-to", to: idea("agent-economy") },
  { from: idea("machine-economies"), type: "related-to", to: idea("agent-economy") },
  { from: idea("autonomous-trading-agents"), type: "related-to", to: idea("portfolio-intelligence") },
  { from: idea("adaptive-decision-systems"), type: "related-to", to: idea("computational-superstition") },

  // Trans-Intelligence -> territories and anchor ideas
  ...territories.map((t) => ({
    from: { type: "idea", slug: transIntelligence.slug } as NodeRef,
    type: "related-to" as const,
    to: territory(t.slug)
  })),
  { from: { type: "idea", slug: transIntelligence.slug }, type: "related-to", to: idea("computational-superstition") },
  { from: { type: "idea", slug: transIntelligence.slug }, type: "related-to", to: idea("agent-economy") },
  { from: { type: "idea", slug: transIntelligence.slug }, type: "related-to", to: idea("agentic-web") }
];

// Idea -> Territory edges are derived from each idea's territorySlugs so the
// two never drift out of sync.
const territoryRelations: RelationRecord[] = ideas.flatMap((i) =>
  i.territorySlugs.map((territorySlug) => ({
    from: idea(i.slug),
    type: "belongs-to" as const,
    to: territory(territorySlug)
  }))
);

export const relations: readonly RelationRecord[] = [...authoredRelations, ...territoryRelations];

export function relationsFrom(ref: NodeRef) {
  return relations.filter((relation) => refEquals(relation.from, ref));
}

export function relationsTo(ref: NodeRef) {
  return relations.filter((relation) => refEquals(relation.to, ref));
}

export type RelatedNode = {
  ref: NodeRef;
  relationType: RelationRecord["type"];
  direction: "outgoing" | "incoming";
};

export function relatedRefs(ref: NodeRef, nodeType?: NodeRef["type"]): RelatedNode[] {
  const outgoing = relationsFrom(ref).map((relation) => ({
    ref: relation.to,
    relationType: relation.type,
    direction: "outgoing" as const
  }));
  const incoming = relationsTo(ref).map((relation) => ({
    ref: relation.from,
    relationType: relation.type,
    direction: "incoming" as const
  }));

  const all = [...outgoing, ...incoming];
  return nodeType ? all.filter((item) => item.ref.type === nodeType) : all;
}

/**
 * Traverses two hops out (e.g. venture -> idea -> essay) so nodes that share
 * an idea, but have no direct edge to each other, still surface as related.
 * This is what lets "related writing" on a venture page work without every
 * venture needing a hand-authored edge to every essay.
 */
export function secondDegreeRefs(ref: NodeRef, targetType: NodeRef["type"]): NodeRef[] {
  const firstHop = relatedRefs(ref).map((item) => item.ref);
  const seen = new Map<string, NodeRef>();

  for (const hop of firstHop) {
    for (const item of relatedRefs(hop, targetType)) {
      if (refEquals(item.ref, ref)) continue;
      seen.set(refKey(item.ref), item.ref);
    }
  }

  return [...seen.values()];
}
