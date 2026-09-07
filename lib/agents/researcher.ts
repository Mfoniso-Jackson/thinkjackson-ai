import "server-only";
import { generate } from "@/lib/ai/runtime";
import { researcherOutputSchema, type ScoutOutput } from "@/lib/kg-types";
import { ideas } from "@/data/ideas";
import { territories } from "@/data/territories";
import { publicVentures } from "@/data/ventures";
import { people } from "@/data/people";
import { writingPosts } from "@/lib/writing";

const researcherJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["claims", "proposedConnections"],
  properties: {
    claims: {
      type: "array",
      minItems: 1,
      maxItems: 8,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["statement", "epistemicStatus"],
        properties: {
          statement: { type: "string", minLength: 10, maxLength: 400 },
          epistemicStatus: { type: "string", enum: ["fact", "interpretation", "hypothesis", "prediction", "speculation"] },
          evidence: { type: "string", maxLength: 300 }
        }
      }
    },
    proposedConnections: {
      type: "array",
      minItems: 1,
      maxItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["targetType", "targetSlug", "relationType", "rationale"],
        properties: {
          targetType: { type: "string", enum: ["idea", "territory", "venture", "person", "essay"] },
          targetSlug: { type: "string", minLength: 1, maxLength: 120 },
          relationType: { type: "string", enum: ["discusses", "supports", "challenges", "related-to", "applies"] },
          rationale: { type: "string", minLength: 10, maxLength: 300 }
        }
      }
    },
    openQuestion: { type: "string", minLength: 10, maxLength: 300 }
  }
};

const systemPrompt = `You are the Researcher inside ThinkJackson's research pipeline. You receive one source's extracted text, a Scout's initial read of it, and a whitelist of ThinkJackson's existing ideas, territories, ventures, people, and essays. Extract the specific claims the source actually makes and label each one honestly: fact (directly stated and verifiable from the text), interpretation (a reasonable synthesis of what's stated), hypothesis (something the source proposes testing), prediction (a claim about a future outcome), or speculation (an interesting possibility the text does not sufficiently support). Never upgrade a claim's confidence beyond what the text itself supports. Then propose 1-3 connections from this source to items in the provided whitelist ONLY — every targetSlug you return must be copied exactly from the whitelist, never invented. If nothing in the whitelist genuinely relates, propose the single closest one honestly labeled as a weak related-to connection rather than fabricating a stronger one. Optionally note one open question this source raises that isn't yet answered.`;

export type ResearchableContext = {
  ideas: Array<{ slug: string; title: string; summary: string }>;
  territories: Array<{ slug: string; name: string }>;
  ventures: Array<{ slug: string; name: string; tagline: string }>;
  people: Array<{ slug: string; name: string; role: string }>;
  essays: Array<{ slug: string; title: string; excerpt: string }>;
};

export function getResearchableContext(): ResearchableContext {
  return {
    ideas: ideas.map((idea) => ({ slug: idea.slug, title: idea.title, summary: idea.summary })),
    territories: territories.map((territory) => ({ slug: territory.slug, name: territory.name })),
    ventures: publicVentures.map((venture) => ({ slug: venture.slug, name: venture.name, tagline: venture.tagline })),
    people: people.map((person) => ({ slug: person.slug, name: person.name, role: person.role })),
    essays: writingPosts.map((post) => ({ slug: post.slug, title: post.title, excerpt: post.excerpt }))
  };
}

export function isKnownTarget(targetType: string, targetSlug: string, context: ResearchableContext): boolean {
  if (targetType === "idea") return context.ideas.some((idea) => idea.slug === targetSlug);
  if (targetType === "territory") return context.territories.some((territory) => territory.slug === targetSlug);
  if (targetType === "venture") return context.ventures.some((venture) => venture.slug === targetSlug);
  if (targetType === "person") return context.people.some((person) => person.slug === targetSlug);
  if (targetType === "essay") return context.essays.some((essay) => essay.slug === targetSlug);
  return false;
}

export async function runResearcher(params: { url: string; excerpt: string; scout: ScoutOutput; correlationId?: string }) {
  const context = getResearchableContext();

  const result = await generate(
    {
      task: "structured-agent",
      agentName: "Researcher",
      jsonSchema: { name: "researcher_output", schema: researcherJsonSchema },
      systemPrompt,
      input: { url: params.url, extractedText: params.excerpt, scoutSummary: params.scout, whitelist: context },
      correlationId: params.correlationId
    },
    (raw) => researcherOutputSchema.parse(raw)
  );

  const verifiedConnections = result.output.proposedConnections.filter((connection) =>
    isKnownTarget(connection.targetType, connection.targetSlug, context)
  );

  if (verifiedConnections.length === 0) {
    throw new Error(
      "The Researcher could not verify any proposed connection against real ThinkJackson nodes. Rejecting rather than publishing a hallucinated link."
    );
  }

  return {
    output: { ...result.output, proposedConnections: verifiedConnections },
    model: result.model,
    latencyMs: result.latencyMs,
    usage: result.usage
  };
}
