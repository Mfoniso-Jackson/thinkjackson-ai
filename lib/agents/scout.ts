import "server-only";
import { generate } from "@/lib/ai/runtime";
import { fetchSourceText } from "@/lib/agents/fetch-source";
import { assertFieldNotTruncated } from "@/lib/agents/text-guard";
import { scoutOutputSchema, scoutSourceTypes } from "@/lib/kg-types";
import { territories } from "@/data/territories";

/**
 * title/summary maxLength here is deliberately higher than the Zod caps in
 * lib/kg-types.ts (200/800) — see text-guard.ts. The Zod parse is the real
 * business-logic enforcement; this schema only needs to keep the model far
 * enough from a hard wall that a provider's structured-output mode doesn't
 * truncate mid-sentence trying to hit it exactly.
 */
const scoutJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "summary", "sourceType", "entities", "suggestedTerritorySlugs", "importanceScore", "confidenceScore"],
  properties: {
    title: { type: "string", minLength: 5, maxLength: 260 },
    summary: { type: "string", minLength: 20, maxLength: 1000 },
    sourceType: { type: "string", enum: scoutSourceTypes },
    entities: {
      type: "array",
      maxItems: 10,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "kind"],
        properties: {
          name: { type: "string", minLength: 1, maxLength: 120 },
          kind: { type: "string", enum: ["person", "company", "technology", "project"] }
        }
      }
    },
    suggestedTerritorySlugs: { type: "array", maxItems: 3, items: { type: "string" } },
    importanceScore: { type: "integer", minimum: 1, maximum: 10 },
    confidenceScore: { type: "integer", minimum: 1, maximum: 10 }
  }
};

const systemPrompt = `You are the Scout inside ThinkJackson's research pipeline, an intelligence observatory studying the emergence of distributed intelligence across humans, machines, autonomous agents, networks, markets, and institutions. You are given the extracted text of one web page a human flagged as potentially important, plus ThinkJackson's five research territories. Summarize only what the text actually states. Never invent facts, people, companies, statistics, or claims that are not present in the source. If the page is thin, paywalled-looking, or off-topic, say so plainly in the summary and give it a low importanceScore and confidenceScore rather than padding it out. Classify sourceType precisely, since it decides what kind of node this becomes: "paper" for academic or preprint research; "repo" for a code repository or technical tool release; "dataset" only if the page's primary subject is a released dataset itself, not a page that merely mentions using one; "experiment" only if the page describes a specific experiment or study someone ran, not general commentary about experimentation; "interview" or "announcement" for those formats specifically; "article" as the default for general writing; "other" when nothing fits. Suggest which research territories this genuinely connects to — leave the list empty if none fit. Prioritize signal over volume: most pages deserve a low importance score. Keep the summary well under 800 characters (aim for 2-4 sentences) and always finish it as a complete sentence — never let it run up to a length limit.`;

export async function runScout(url: string) {
  const source = await fetchSourceText(url);

  const result = await generate(
    {
      task: "structured-agent",
      agentName: "Scout",
      jsonSchema: { name: "scout_output", schema: scoutJsonSchema },
      systemPrompt,
      input: {
        url,
        extractedText: source.text,
        availableTerritories: territories.map((t) => ({ slug: t.slug, name: t.name, definition: t.definition }))
      }
    },
    (raw) => {
      const output = scoutOutputSchema.parse(raw);
      assertFieldNotTruncated("Scout summary", output.summary, scoutJsonSchema.properties.summary.maxLength);
      assertFieldNotTruncated("Scout title", output.title, scoutJsonSchema.properties.title.maxLength);
      return output;
    }
  );

  return { source, output: result.output, model: result.model, latencyMs: result.latencyMs, usage: result.usage };
}
