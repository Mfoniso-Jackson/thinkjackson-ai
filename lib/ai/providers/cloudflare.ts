import "server-only";
import type { AIModel, AIProvider, AIRequest, AIResponse } from "@/lib/ai/types";

/**
 * Cloudflare Workers AI is called over its plain REST API from this Vercel
 * backend — confirmed against current docs that this needs no Workers
 * runtime or hosting change. Its JSON-mode shape is genuinely different
 * from the OpenAI-compatible providers: response_format.json_schema is the
 * raw schema object (no {name, strict, schema} wrapper), and the response
 * comes back as { response: <parsed JSON> } rather than a choices array —
 * so this can't reuse the shared chat-completions helper.
 */
export const cloudflareProvider: AIProvider = {
  id: "cloudflare",
  isConfigured() {
    return Boolean(process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_API_TOKEN);
  },
  async call<T>(request: AIRequest, model: AIModel, parse: (raw: unknown) => T): Promise<AIResponse<T>> {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;
    if (!accountId || !apiToken) {
      throw new Error("Cloudflare Workers AI is not configured. Set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN.");
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45_000);
    const started = Date.now();

    try {
      const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model.model}`, {
        method: "POST",
        signal: controller.signal,
        headers: { "content-type": "application/json", authorization: `Bearer ${apiToken}` },
        body: JSON.stringify({
          messages: [
            { role: "system", content: request.systemPrompt },
            { role: "user", content: JSON.stringify(request.input) }
          ],
          response_format: { type: "json_schema", json_schema: request.jsonSchema.schema }
        })
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error(`${request.agentName} is rate limited on cloudflare. Please retry shortly.`);
        }
        const body = await response.text().catch(() => "");
        throw new Error(`${request.agentName} request to cloudflare failed (${response.status}). ${body.slice(0, 200)}`.trim());
      }

      const payload = (await response.json()) as { result?: { response?: unknown }; errors?: Array<{ message?: string }> };
      if (payload.errors?.length) {
        throw new Error(`${request.agentName} got an error from cloudflare: ${payload.errors[0]?.message ?? "unknown error"}.`);
      }
      if (payload.result?.response === undefined || payload.result.response === null) {
        throw new Error(`${request.agentName} got an empty response from cloudflare. Please retry.`);
      }

      // Confirmed empirically against the live API: result.response's type
      // is inconsistent across models — a JSON-formatted string for some
      // (e.g. the 8B model), an already-parsed object for others (e.g. the
      // 70B model). Handle both rather than assuming either.
      let parsedJson: unknown = payload.result.response;
      if (typeof parsedJson === "string") {
        try {
          parsedJson = JSON.parse(parsedJson);
        } catch {
          throw new Error(`${request.agentName} got malformed JSON from cloudflare. Please retry.`);
        }
      }

      const output = parse(parsedJson);
      return {
        output,
        provider: "cloudflare",
        model: model.model,
        latencyMs: Date.now() - started,
        estimatedCostUsd: model.freeTier ? 0 : model.estimatedCostPerCallUsd
      };
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw new Error(`${request.agentName} timed out on cloudflare. Please retry.`);
      }
      throw error;
    } finally {
      clearTimeout(timeout);
    }
  }
};
