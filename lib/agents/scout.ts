import "server-only";
import { generate } from "@/lib/ai/runtime";
import { fetchSourceText } from "@/lib/agents/fetch-source";
import { scoutOutputSchema, scoutSourceTypes } from "@/lib/kg-types";
import { territories } from "@/data/territories";

/**
 * JSON-schema maxLength here is deliberately looser than the Zod schema's
 * real limits (scoutOutputSchema in lib/kg-types.ts) — real production data
 * showed at least one provider (Gemini) hard-truncates a generated string
 * mid-word when it hits the schema's maxLength exactly, rather than
 * resampling to fit, producing schema-valid but garbled output that still
 * passed Zod because it was cut to precisely fit. Giving the model real
 * headroom means it either finishes its thought within Zod's limit (the
 * common case, reinforced in the prompt below) or, if it doesn't, Zod's
 * parse() throws — which lib/ai/fallback.ts already treats as a normal
 * provider failure and retries the next one. A rejected-and-retried
 * candidate is a far better outcome than a silently corrupted one.
 */
const scoutJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "summary", "sourceType", "entities", "suggestedTerritorySlugs", "importanceScore", "confidenceScore"],
  properties: {
    title: { type: "string", minLength: 5, maxLength: 400 },
    summary: { type: "string", minLength: 20, maxLength: 1600 },
    sourceType: { type: "string", enum: scoutSourceTypes },
    entities: {
      type: "array",
      maxItems: 10,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "kind"],
        properties: {
          name: { type: "string", minLength: 1, maxLength: 240 },
          kind: { type: "string", enum: ["person", "company", "technology", "project"] }
        }
      }
    },
    suggestedTerritorySlugs: { type: "array", maxItems: 3, items: { type: "string" } },
    importanceScore: { type: "integer", minimum: 1, maximum: 10 },
    confidenceScore: { type: "integer", minimum: 1, maximum: 10 }
  }
};

const systemPrompt = `You are the Scout inside ThinkJackson's research pipeline, an intelligence observatory studying the emergence of distributed intelligence across humans, machines, autonomous agents, networks, markets, and institutions. You are given the extracted text of one web page a human flagged as potentially important, plus ThinkJackson's five research territories. Summarize only what the text actually states. Never invent facts, people, companies, statistics, or claims that are not present in the source. If the page is thin, paywalled-looking, or off-topic, say so plainly in the summary and give it a low importanceScore and confidenceScore rather than padding it out. Classify sourceType precisely, since it decides what kind of node this becomes: "paper" for academic or preprint research; "repo" for a code repository or technical tool release; "dataset" only if the page's primary subject is a released dataset itself, not a page that merely mentions using one; "experiment" only if the page describes a specific experiment or study someone ran, not general commentary about experimentation; "interview" or "announcement" for those formats specifically; "article" as the default for general writing; "other" when nothing fits. Suggest which research territories this genuinely connects to — leave the list empty if none fit. Prioritize signal over volume: most pages deserve a low importance score. Keep title under 200 characters and summary under 800 characters — write a complete summary that fits naturally within that budget rather than a longer one that gets cut off.`;

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
    (raw) => scoutOutputSchema.parse(raw)
  );

  return { source, output: result.output, model: result.model, latencyMs: result.latencyMs, usage: result.usage };
}
