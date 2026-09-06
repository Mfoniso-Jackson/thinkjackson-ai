import type { DiscoverableNodeType, LibrarianOutput, ResearcherOutput, ScoutOutput } from "@/lib/kg-types";
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

/**
 * "repo" maps to "technology" rather than getting its own node type — a
 * discovered code repository is more usefully modeled as a technology
 * ThinkJackson is tracking than as its own category. "article",
 * "announcement", "interview", and "other" all stay the generic "resource"
 * shape: nothing about those formats implies a more specific kg_nodes type.
 */
function sourceTypeToNodeType(sourceType: ScoutOutput["sourceType"]): DiscoverableNodeType {
  if (sourceType === "paper") return "paper";
  if (sourceType === "repo") return "technology";
  if (sourceType === "dataset") return "dataset";
  if (sourceType === "experiment") return "experiment";
  return "resource";
}

export function runLibrarian(params: { url: string; scout: ScoutOutput; researcher: ResearcherOutput }): LibrarianOutput {
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
    }))
  };

  if (params.researcher.openQuestion) {
    const questionSlug = (slugify(params.researcher.openQuestion).slice(0, 80) || `${slug}-question`).replace(/-+$/, "");
    output.proposedQuestion = {
      type: "question",
      slug: questionSlug,
      title: params.researcher.openQuestion,
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
