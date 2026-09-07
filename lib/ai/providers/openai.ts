import "server-only";
import type { AIModel, AIProvider, AIRequest, AIResponse } from "@/lib/ai/types";

/**
 * OpenAI is the one provider on a genuinely different API shape (the
 * Responses API, not OpenAI-compatible chat completions) — kept as its
 * own adapter rather than forced into the shared chat-completions helper.
 */
export const openaiProvider = {
  id: "openai",
  isConfigured() {
    return Boolean(process.env.OPENAI_API_KEY);
  },
  async call<T>(request: AIRequest, model: AIModel, parse: (raw: unknown) => T): Promise<AIResponse<T>> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error("OpenAI is not configured. Set OPENAI_API_KEY.");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45_000);
    const started = Date.now();

    try {
      const response = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        signal: controller.signal,
        headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
        body: JSON.stringify({
          model: model.model,
          store: false,
          instructions: request.systemPrompt,
          input: JSON.stringify(request.input),
          text: { format: { type: "json_schema", name: request.jsonSchema.name, strict: true, schema: request.jsonSchema.schema } }
        })
      });

      if (!response.ok) {
        const retry = response.headers.get("retry-after");
        if (response.status === 429) {
          throw new Error(`${request.agentName} is rate limited on openai.${retry ? ` Retry after ${retry} seconds.` : " Please retry shortly."}`);
        }
        throw new Error(`${request.agentName} request to openai failed (${response.status}). Please retry.`);
      }

      const payload = (await response.json()) as {
        output_text?: string;
        output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
        usage?: Record<string, unknown>;
      };
      const text = payload.output_text ?? payload.output?.flatMap((item) => item.content ?? []).find((item) => item.type === "output_text")?.text;
      if (!text) {
        throw new Error(`${request.agentName} got an empty response from openai. Please retry.`);
      }

      const output = parse(JSON.parse(text));
      return {
        output,
        provider: "openai",
        model: model.model,
        latencyMs: Date.now() - started,
        usage: payload.usage,
        estimatedCostUsd: model.freeTier ? 0 : model.estimatedCostPerCallUsd
      };
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error(`${request.agentName} timed out on openai. Please retry.`);
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }
} satisfies AIProvider;
