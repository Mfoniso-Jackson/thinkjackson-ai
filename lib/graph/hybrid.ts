import "server-only";
import { relatedRefs as staticRelatedRefs, type RelatedNode } from "@/lib/graph/registry";
import { resolveNode as resolveStaticNode, type ResolvedNode } from "@/lib/graph/resolve";
import { isSupabaseConfigured, supabaseRequest } from "@/lib/supabase";
import type { NodeRef } from "@/lib/graph/types";
import { refEquals } from "@/lib/graph/types";

/**
 * The founder-authored graph (data/ideas.ts, data/ventures.ts, etc., wired
 * through lib/graph/registry.ts) stays exactly as it is — static, in git,
 * human-edited. This module adds a second, agent-populated layer on top,
 * resolved through the same NodeRef/ResolvedNode shapes, so every existing
 * consumer (RelatedNodes, RelatedNodesGraph, SessionTrail) can display an
 * agent-published node without being rewritten. If Supabase isn't
 * configured, or a query fails, this fails open to static-only results
 * rather than breaking the page — a published agent node is additive, never
 * load-bearing for the core site.
 */

type KgRelationshipRow = {
  from_type: string;
  from_slug: string;
  relation_type: RelatedNode["relationType"];
  to_type: string;
  to_slug: string;
};

type KgNodeRow = {
  type: string;
  slug: string;
  title: string;
  summary: string;
  metadata: { url?: string };
};

const dynamicNodeEyebrows: Record<string, string> = {
  question: "Open question",
  prediction: "Prediction",
  paper: "Discovered paper",
  technology: "Discovered technology",
  dataset: "Discovered dataset",
  experiment: "Discovered experiment"
};

function dynamicNodeEyebrow(type: string): string {
  return dynamicNodeEyebrows[type] ?? "Discovered resource";
}

function dynamicNodeHref(ref: NodeRef, row: KgNodeRow): string {
  if (ref.type === "question") return `/questions/${ref.slug}`;
  if (ref.type === "prediction") return `/predictions/${ref.slug}`;
  return row.metadata?.url ?? "#";
}

export async function relatedRefsHybrid(ref: NodeRef, nodeType?: NodeRef["type"]): Promise<RelatedNode[]> {
  const staticResults = staticRelatedRefs(ref, nodeType);
  if (!isSupabaseConfigured()) return staticResults;

  try {
    const [outgoing, incoming] = await Promise.all([
      supabaseRequest(`kg_relationships?from_type=eq.${ref.type}&from_slug=eq.${ref.slug}&select=*`) as Promise<KgRelationshipRow[]>,
      supabaseRequest(`kg_relationships?to_type=eq.${ref.type}&to_slug=eq.${ref.slug}&select=*`) as Promise<KgRelationshipRow[]>
    ]);

    const dynamic: RelatedNode[] = [
      ...outgoing.map((row) => ({
        ref: { type: row.to_type, slug: row.to_slug } as NodeRef,
        relationType: row.relation_type,
        direction: "outgoing" as const
      })),
      ...incoming.map((row) => ({
        ref: { type: row.from_type, slug: row.from_slug } as NodeRef,
        relationType: row.relation_type,
        direction: "incoming" as const
      }))
    ];

    const all = [...staticResults, ...dynamic].filter((item, index, list) => {
      const key = `${item.direction}:${item.relationType}:${item.ref.type}:${item.ref.slug}`;
      return list.findIndex((other) => `${other.direction}:${other.relationType}:${other.ref.type}:${other.ref.slug}` === key) === index;
    });

    return nodeType ? all.filter((item) => item.ref.type === nodeType) : all;
  } catch {
    return staticResults;
  }
}

export async function resolveNodeHybrid(ref: NodeRef): Promise<ResolvedNode | undefined> {
  const staticResolved = resolveStaticNode(ref);
  if (staticResolved || !isSupabaseConfigured()) return staticResolved;

  try {
    const rows = (await supabaseRequest(
      `kg_nodes?type=eq.${ref.type}&slug=eq.${ref.slug}&status=eq.published&select=*&limit=1`
    )) as KgNodeRow[];
    const row = rows[0];
    if (!row) return undefined;

    return {
      ref,
      title: row.title,
      eyebrow: dynamicNodeEyebrow(ref.type),
      summary: row.summary,
      href: dynamicNodeHref(ref, row)
    };
  } catch {
    return undefined;
  }
}

export async function resolveRelatedHybrid(ref: NodeRef, nodeType?: NodeRef["type"]) {
  const related = await relatedRefsHybrid(ref, nodeType);
  const resolved = await Promise.all(
    related.map(async (item) => ({ ...item, resolved: await resolveNodeHybrid(item.ref) }))
  );
  return resolved.filter(
    (item): item is typeof item & { resolved: ResolvedNode } => item.resolved !== undefined && !refEquals(item.ref, ref)
  );
}
