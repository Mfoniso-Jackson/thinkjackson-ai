import "server-only";
import { relations as staticRelations } from "@/lib/graph/registry";
import { resolveNodeHybrid } from "@/lib/graph/hybrid";
import { territories } from "@/data/territories";
import { ideas } from "@/data/ideas";
import { isSupabaseConfigured, supabaseRequest } from "@/lib/supabase";
import { refKey } from "@/lib/graph/types";
import type { NodeRef, RelationRecord } from "@/lib/graph/types";
import type { ResolvedNode } from "@/lib/graph/resolve";

/**
 * Builds the whole ThinkJackson graph (static + agent-published) as plain,
 * serializable data for a client-side force-directed layout — the physics
 * simulation computes node positions in the browser, so this module only
 * needs to answer "what exists and what connects to what," not "where does
 * it go." The one thing still computed here is clusterSlug (the research
 * territory a node is closest to), kept purely for node coloring: ideas use
 * their own declared territorySlugs directly (real authored data), and
 * everything else falls back to nearest territory/idea by real graph
 * distance (BFS) — a tie-break by array order would otherwise systematically
 * overload whichever territory sorts first.
 */

type DynamicRelationRow = {
  from_type: string;
  from_slug: string;
  relation_type: string;
  to_type: string;
  to_slug: string;
};

async function fetchDynamicRelations(): Promise<RelationRecord[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const rows = (await supabaseRequest(
      "kg_relationships?select=from_type,from_slug,relation_type,to_type,to_slug&limit=1000"
    )) as DynamicRelationRow[];
    return rows.map((row) => ({
      from: { type: row.from_type, slug: row.from_slug } as NodeRef,
      type: row.relation_type as RelationRecord["type"],
      to: { type: row.to_type, slug: row.to_slug } as NodeRef
    }));
  } catch {
    return [];
  }
}

export type GraphNode = {
  id: string;
  type: NodeRef["type"];
  title: string;
  href: string;
  eyebrow: string;
  clusterSlug: string;
};

export type GraphLink = {
  source: string;
  target: string;
  relationType: string;
};

export type GraphStructure = {
  nodes: GraphNode[];
  links: GraphLink[];
};

const UNCATEGORIZED = "uncategorized";

export async function buildGraphStructure(): Promise<GraphStructure> {
  const dynamicRelations = await fetchDynamicRelations();
  const allRelations = [...staticRelations, ...dynamicRelations];

  const refByKey = new Map<string, NodeRef>();
  for (const relation of allRelations) {
    refByKey.set(refKey(relation.from), relation.from);
    refByKey.set(refKey(relation.to), relation.to);
  }

  const resolvedEntries = await Promise.all(
    [...refByKey.entries()].map(async ([key, ref]) => [key, await resolveNodeHybrid(ref)] as const)
  );
  const resolvedByKey = new Map<string, ResolvedNode>();
  for (const [key, resolved] of resolvedEntries) {
    if (resolved) resolvedByKey.set(key, resolved);
  }

  const adjacency = new Map<string, Set<string>>();
  for (const relation of allRelations) {
    const fromKey = refKey(relation.from);
    const toKey = refKey(relation.to);
    if (!resolvedByKey.has(fromKey) || !resolvedByKey.has(toKey)) continue;
    if (!adjacency.has(fromKey)) adjacency.set(fromKey, new Set());
    if (!adjacency.has(toKey)) adjacency.set(toKey, new Set());
    adjacency.get(fromKey)!.add(toKey);
    adjacency.get(toKey)!.add(fromKey);
  }

  const clusterOf = new Map<string, string>();
  const queue: string[] = [];
  for (const t of territories) {
    const key = refKey({ type: "territory", slug: t.slug });
    if (resolvedByKey.has(key)) {
      clusterOf.set(key, t.slug);
      queue.push(key);
    }
  }
  for (const idea of ideas) {
    const key = refKey({ type: "idea", slug: idea.slug });
    const territorySlug = idea.territorySlugs[0];
    if (resolvedByKey.has(key) && territorySlug && !clusterOf.has(key)) {
      clusterOf.set(key, territorySlug);
      queue.push(key);
    }
  }
  let head = 0;
  while (head < queue.length) {
    const current = queue[head++];
    const cluster = clusterOf.get(current)!;
    for (const neighbor of adjacency.get(current) ?? []) {
      if (!clusterOf.has(neighbor)) {
        clusterOf.set(neighbor, cluster);
        queue.push(neighbor);
      }
    }
  }

  const nodes: GraphNode[] = [...resolvedByKey.entries()].map(([key, resolved]) => {
    const ref = refByKey.get(key)!;
    return {
      id: key,
      type: ref.type,
      title: resolved.title,
      href: resolved.href,
      eyebrow: resolved.eyebrow,
      clusterSlug: clusterOf.get(key) ?? UNCATEGORIZED
    };
  });

  const seenLinkKeys = new Set<string>();
  const links: GraphLink[] = [];
  for (const relation of allRelations) {
    const fromKey = refKey(relation.from);
    const toKey = refKey(relation.to);
    if (!resolvedByKey.has(fromKey) || !resolvedByKey.has(toKey)) continue;
    const linkKey = [fromKey, toKey].sort().join("|");
    if (seenLinkKeys.has(linkKey)) continue;
    seenLinkKeys.add(linkKey);
    links.push({ source: fromKey, target: toKey, relationType: relation.type });
  }

  return { nodes, links };
}
