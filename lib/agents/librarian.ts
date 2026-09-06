import type { LibrarianOutput, ResearcherOutput, ScoutOutput } from "@/lib/kg-types";
import { slugify } from "@/lib/utils";

/**
 * Unlike Scout and Researcher, the Librarian makes no AI call in this
 * slice. Its job here — format Scout+Researcher output into a concrete
 * node and relationship proposal — is a mechanical transformation with a
 * single correct shape, not a judgment call. Reaching for an LLM call
 * where deterministic code is simpler, cheaper, and more trustworthy would
 * be exactly the kind of unnecessary complexity the brief warns against.
 * A future Librarian that does real duplicate-cluster detection across many
 * nodes is a legitimate reason to revisit this.
 */
export function runLibrarian(params: { url: string; scout: ScoutOutput; researcher: ResearcherOutput }): LibrarianOutput {
  const slug = (slugify(params.scout.title).slice(0, 80) || slugify(params.url)).replace(/-+$/, "");

  return {
    proposedNode: {
      type: "resource",
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
    }))
  };
}
