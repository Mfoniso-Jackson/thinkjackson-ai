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
 * The whole-graph Map, unlike RelatedNodesGraph's one-node-and-its-neighbors
 * view, has to lay out every node ThinkJackson has (static and
 * agent-published) at once — currently around 40 nodes and 90 edges. A
 * single radial ring at that scale is unreadable, so nodes are clustered by
 * the research territory they're closest to (by hop count through the real
 * relationship graph, not a separate hand-maintained mapping), and each
 * cluster gets its own small radial layout around its territory node. Edges
 * are drawn from the real relationship data, so a connection that crosses
 * two territories is visible as a long line crossing the canvas — which is
 * the point: those crossing lines are what "Trans-Intelligence" is about.
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

export type MapNode = {
  ref: NodeRef;
  resolved: ResolvedNode;
  clusterSlug: string;
  x: number;
  y: number;
};

export type MapEdge = {
  relationType: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

export type MapCluster = {
  slug: string;
  label: string;
  x: number;
  y: number;
  isTerritory: boolean;
};

export type MapData = {
  nodes: MapNode[];
  edges: MapEdge[];
  clusters: MapCluster[];
  canvasSize: number;
};

export const MAP_NODE_WIDTH = 152;
const NODE_WIDTH = MAP_NODE_WIDTH;
const UNCATEGORIZED = "uncategorized";

export async function buildMapData(): Promise<MapData> {
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

  /**
   * Ideas already declare their own territory membership (territorySlugs in
   * data/ideas.ts) — that's real authored data, not something to re-derive.
   * Using it directly (an idea's first listed territory) avoids the failure
   * mode of a BFS tie-break: a multi-territory idea would otherwise always
   * resolve to whichever territory happens to sort first in the territories
   * array, systematically overloading one cluster. Only node types with no
   * declared territory (ventures, essays, resources, questions, etc.) fall
   * back to "nearest territory or idea by real graph distance."
   */
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

  const clusterMembers = new Map<string, string[]>();
  for (const key of resolvedByKey.keys()) {
    const cluster = clusterOf.get(key) ?? UNCATEGORIZED;
    if (!clusterMembers.has(cluster)) clusterMembers.set(cluster, []);
    clusterMembers.get(cluster)!.push(key);
  }

  const orderedClusterSlugs = [
    ...territories.map((t) => t.slug).filter((slug) => clusterMembers.has(slug)),
    ...(clusterMembers.has(UNCATEGORIZED) ? [UNCATEGORIZED] : [])
  ];

  /**
   * A cluster's ring has to be big enough that its own members' boxes don't
   * overlap each other: circumference needed is roughly memberCount * (box
   * width + gap), so radius follows from that directly rather than a fixed
   * cap — a cap here is exactly what produced the overlapping mess in the
   * first real render (one territory absorbed most of the graph and its
   * ring was capped far below what 15+ nodes need).
   */
  const NODE_GAP = 28;
  const clusterLocalRadius = new Map(
    orderedClusterSlugs.map((slug) => {
      const membersExcludingAnchor = clusterMembers.get(slug)!.length - 1;
      const radius = (Math.max(membersExcludingAnchor, 1) * (NODE_WIDTH + NODE_GAP)) / (2 * Math.PI);
      return [slug, Math.max(70, radius)];
    })
  );
  const maxLocalRadius = Math.max(...clusterLocalRadius.values(), 70);

  // Outer ring radius has to keep adjacent clusters' rings from overlapping
  // each other too: the chord between neighboring cluster anchors must clear
  // both their local radii plus a node width of breathing room.
  const clusterCount = orderedClusterSlugs.length;
  const angularGap = clusterCount > 1 ? 2 * Math.sin(Math.PI / clusterCount) : 1;
  const outerRadius = Math.max(340, (maxLocalRadius * 2 + NODE_WIDTH + 100) / angularGap);
  const canvasSize = outerRadius * 2 + maxLocalRadius * 2 + NODE_WIDTH + 80;
  const center = canvasSize / 2;

  const positions = new Map<string, { x: number; y: number }>();
  const clusters: MapCluster[] = [];

  orderedClusterSlugs.forEach((slug, clusterIndex) => {
    const angle = (2 * Math.PI * clusterIndex) / orderedClusterSlugs.length - Math.PI / 2;
    const anchorX = center + outerRadius * Math.cos(angle);
    const anchorY = center + outerRadius * Math.sin(angle);

    const territoryKey = slug === UNCATEGORIZED ? undefined : refKey({ type: "territory", slug });
    const isTerritory = territoryKey !== undefined && resolvedByKey.has(territoryKey);
    clusters.push({
      slug,
      label: isTerritory ? resolvedByKey.get(territoryKey!)!.title : "Other",
      x: anchorX,
      y: anchorY,
      isTerritory
    });

    if (isTerritory) positions.set(territoryKey!, { x: anchorX, y: anchorY });

    const others = clusterMembers.get(slug)!.filter((key) => key !== territoryKey);
    const localRadius = clusterLocalRadius.get(slug)!;
    others.forEach((key, index) => {
      const localAngle = others.length > 0 ? (2 * Math.PI * index) / others.length : 0;
      positions.set(key, {
        x: anchorX + localRadius * Math.cos(localAngle),
        y: anchorY + localRadius * Math.sin(localAngle)
      });
    });
  });

  const nodes: MapNode[] = [...resolvedByKey.entries()].map(([key, resolved]) => {
    const ref = refByKey.get(key)!;
    const pos = positions.get(key) ?? { x: center, y: center };
    return { ref, resolved, clusterSlug: clusterOf.get(key) ?? UNCATEGORIZED, x: pos.x, y: pos.y };
  });

  const seenEdgeKeys = new Set<string>();
  const edges: MapEdge[] = [];
  for (const relation of allRelations) {
    const fromKey = refKey(relation.from);
    const toKey = refKey(relation.to);
    const fromPos = positions.get(fromKey);
    const toPos = positions.get(toKey);
    if (!fromPos || !toPos) continue;
    const edgeKey = [fromKey, toKey].sort().join("|");
    if (seenEdgeKeys.has(edgeKey)) continue;
    seenEdgeKeys.add(edgeKey);
    edges.push({ relationType: relation.type, x1: fromPos.x, y1: fromPos.y, x2: toPos.x, y2: toPos.y });
  }

  return { nodes, edges, clusters, canvasSize };
}
