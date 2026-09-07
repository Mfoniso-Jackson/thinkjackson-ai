import "server-only";
import type { AIModel, AIRequest, AIResponse } from "@/lib/ai/types";

type ChatCompletionsPayload = {
  choices?: Array<{ message?: { content?: string } }>;
  usage?: Record<string, unknown>;
};

/**
 * Gemini, Grok, and OpenRouter all speak the same OpenAI-compatible chat
 * completions shape (verified against each provider's current docs before
 * writing this) — one function serves all three; only base URL, auth
 * header, and rate-limit wording differ per caller.
 */
export async function callOpenAICompatible<T>(
  providerId: string,
  baseUrl: string,
  apiKey: string,
  request: AIRequest,
  model: AIModel,
  parse: (raw: unknown) => T
): Promise<AIResponse<T>> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);
  const started = Date.now();

  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      signal: controller.signal,
      headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: model.model,
        messages: [
          { role: "system", content: request.systemPrompt },
          { role: "user", content: JSON.stringify(request.input) }
        ],
        response_format: {
          type: "json_schema",
          json_schema: { name: request.jsonSchema.name, strict: true, schema: request.jsonSchema.schema }
        }
      })
    });

    if (!response.ok) {
      const retry = response.headers.get("retry-after");
      if (response.status === 429) {
        throw new Error(`${request.agentName} is rate limited on ${providerId}.${retry ? ` Retry after ${retry} seconds.` : " Please retry shortly."}`);
      }
      const body = await response.text().catch(() => "");
      throw new Error(`${request.agentName} request to ${providerId} failed (${response.status}). ${body.slice(0, 200)}`.trim());
    }

    const payload = (await response.json()) as ChatCompletionsPayload;
    const text = payload.choices?.[0]?.message?.content;
    if (!text) {
      throw new Error(`${request.agentName} got an empty response from ${providerId}. Please retry.`);
    }

    const output = parse(JSON.parse(text));
    return {
      output,
      provider: providerId,
      model: model.model,
      latencyMs: Date.now() - started,
      usage: payload.usage,
      estimatedCostUsd: model.freeTier ? 0 : model.estimatedCostPerCallUsd
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(`${request.agentName} timed out on ${providerId}. Please retry.`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
