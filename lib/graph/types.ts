export type NodeType =
  | "territory"
  | "idea"
  | "question"
  | "person"
  | "venture"
  | "paper"
  | "experiment"
  | "technology"
  | "podcast-episode"
  | "prediction"
  | "essay"
  | "dataset"
  | "resource";

export type NodeRef = {
  type: NodeType;
  slug: string;
};

export type RelationType =
  | "researches"
  | "founded"
  | "supports"
  | "challenges"
  | "tests"
  | "applies"
  | "discusses"
  | "interviewed-in"
  | "related-to"
  | "generated-by"
  | "derived-from"
  | "emerges-from"
  | "belongs-to";

export type RelationRecord = {
  from: NodeRef;
  type: RelationType;
  to: NodeRef;
  note?: string;
};

export type EpistemicStatus = "fact" | "interpretation" | "hypothesis" | "prediction" | "speculation";

export function refEquals(a: NodeRef, b: NodeRef) {
  return a.type === b.type && a.slug === b.slug;
}

export function refKey(ref: NodeRef) {
  return `${ref.type}:${ref.slug}`;
}
