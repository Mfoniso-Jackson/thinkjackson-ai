import "server-only";
import { callStructuredAgent } from "@/lib/ai/agent-provider";
import { fetchSourceText } from "@/lib/agents/fetch-source";
import { scoutOutputSchema } from "@/lib/kg-types";
import { territories } from "@/data/territories";

const scoutJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "summary", "sourceType", "entities", "suggestedTerritorySlugs", "importanceScore", "confidenceScore"],
  properties: {
    title: { type: "string" },
    summary: { type: "string" },
    sourceType: { type: "string", enum: ["article", "paper", "repo", "announcement", "interview", "other"] },
    entities: {
      type: "array",
      maxItems: 10,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "kind"],
        properties: {
          name: { type: "string" },
          kind: { type: "string", enum: ["person", "company", "technology", "project"] }
        }
      }
    },
    suggestedTerritorySlugs: { type: "array", maxItems: 3, items: { type: "string" } },
    importanceScore: { type: "integer", minimum: 1, maximum: 10 },
    confidenceScore: { type: "integer", minimum: 1, maximum: 10 }
  }
};

const systemPrompt = `You are the Scout inside ThinkJackson's research pipeline, an intelligence observatory studying the emergence of distributed intelligence across humans, machines, autonomous agents, networks, markets, and institutions. You are given the extracted text of one web page a human flagged as potentially important, plus ThinkJackson's five research territories. Summarize only what the text actually states. Never invent facts, people, companies, statistics, or claims that are not present in the source. If the page is thin, paywalled-looking, or off-topic, say so plainly in the summary and give it a low importanceScore and confidenceScore rather than padding it out. Suggest which research territories this genuinely connects to — leave the list empty if none fit. Prioritize signal over volume: most pages deserve a low importance score.`;

export async function runScout(url: string) {
  const source = await fetchSourceText(url);

  const result = await callStructuredAgent({
    agentName: "Scout",
    schemaName: "scout_output",
    jsonSchema: scoutJsonSchema,
    systemPrompt,
    input: {
      url,
      extractedText: source.text,
      availableTerritories: territories.map((t) => ({ slug: t.slug, name: t.name, definition: t.definition }))
    },
    parse: (raw) => scoutOutputSchema.parse(raw)
  });

  return { source, output: result.output, model: result.model, latencyMs: result.latencyMs, usage: result.usage };
}
