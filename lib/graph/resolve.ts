import { getIdea, transIntelligence } from "@/data/ideas";
import { getPerson } from "@/data/people";
import { getTerritory } from "@/data/territories";
import { publicVentures } from "@/data/ventures";
import { getWritingPost } from "@/lib/writing";
import { relatedRefs } from "@/lib/graph/registry";
import type { NodeRef } from "@/lib/graph/types";

export type ResolvedNode = {
  ref: NodeRef;
  title: string;
  eyebrow: string;
  summary: string;
  href: string;
};

export function resolveNode(ref: NodeRef): ResolvedNode | undefined {
  switch (ref.type) {
    case "idea": {
      if (ref.slug === transIntelligence.slug) {
        return {
          ref,
          title: transIntelligence.title,
          eyebrow: "Core thesis",
          summary: transIntelligence.summary,
          href: "/ideas/trans-intelligence"
        };
      }
      const found = getIdea(ref.slug);
      if (!found) return undefined;
      return {
        ref,
        title: found.title,
        eyebrow: found.eyebrow,
        summary: found.summary,
        href: `/ideas/${found.slug}`
      };
    }
    case "territory": {
      const found = getTerritory(ref.slug);
      if (!found) return undefined;
      return {
        ref,
        title: found.name,
        eyebrow: "Research territory",
        summary: found.definition,
        href: `/research#${found.slug}`
      };
    }
    case "venture": {
      const found = publicVentures.find((v) => v.slug === ref.slug);
      if (!found) return undefined;
      return {
        ref,
        title: found.name,
        eyebrow: found.category,
        summary: found.tagline,
        href: `/projects/${found.slug}`
      };
    }
    case "essay": {
      const found = getWritingPost(ref.slug);
      if (!found) return undefined;
      return {
        ref,
        title: found.title,
        eyebrow: "Writing",
        summary: found.excerpt,
        href: `/writing/${found.slug}`
      };
    }
    case "person": {
      const found = getPerson(ref.slug);
      if (!found) return undefined;
      return {
        ref,
        title: found.name,
        eyebrow: found.role,
        summary: found.summary,
        href: `/people/${found.slug}`
      };
    }
    default:
      return undefined;
  }
}

/**
 * The shared "look up every edge, resolve it, drop anything unresolved"
 * step used by both the card grid (related-nodes.tsx) and the graph view
 * (related-nodes-graph.tsx) — one place so the two presentations of the
 * same data can never quietly diverge.
 */
export function resolveRelated(ref: NodeRef) {
  return relatedRefs(ref)
    .map((item) => ({ ...item, resolved: resolveNode(item.ref) }))
    .filter((item): item is typeof item & { resolved: ResolvedNode } => item.resolved !== undefined);
}
