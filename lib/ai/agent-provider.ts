import "server-only";

/**
 * Generalizes structured, schema-validated LLM calls into one reusable
 * shape any agent can call — Scout, Researcher, and future agents are thin
 * callers of this, not separate integrations. Swapping or adding a
 * provider means changing this one function, not every agent that calls
 * it.
 *
 * Three providers are wired in — Gemini, Grok (xAI), and OpenAI — tried in
 * that order, each only if its API key is configured. If one provider's
 * call fails for any reason (rate limit, transient 5xx, etc.), the next
 * configured provider is tried automatically within the same call, rather
 * than requiring a human to notice and retry. Gemini's free tier is the
 * cheapest default; Grok and OpenAI are paid fallbacks for when it's
 * exhausted or down.
 */
export type StructuredAgentCall<TOutput> = {
  agentName: string;
  model?: string;
  systemPrompt: string;
  jsonSchema: Record<string, unknown>;
  schemaName: string;
  input: unknown;
  parse: (raw: unknown) => TOutput;
};

export type AgentCallResult<TOutput> = {
  output: TOutput;
  model: string;
  latencyMs: number;
  usage?: Record<string, unknown>;
};

type ChatCompletionsPayload = {
  choices?: Array<{ message?: { content?: string } }>;
  usage?: Record<string, unknown>;
};

/**
 * Both Gemini's OpenAI-compatible endpoint and OpenAI's own Chat Completions
 * API return the same { choices: [{ message: { content } }], usage } shape,
 * so one function serves both — only the base URL, API key header, default
 * model, and rate-limit-error wording differ.
 */
async function callChatCompletions<TOutput>(
  call: StructuredAgentCall<TOutput>,
  config: { baseUrl: string; apiKey: string; defaultModel: string; authHeader: (key: string) => Record<string, string> }
): Promise<AgentCallResult<TOutput>> {
  const model = call.model ?? config.defaultModel;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);
  const started = Date.now();

  try {
    const response = await fetch(config.baseUrl, {
      method: "POST",
      signal: controller.signal,
      headers: { "content-type": "application/json", ...config.authHeader(config.apiKey) },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: call.systemPrompt },
          { role: "user", content: JSON.stringify(call.input) }
        ],
        response_format: {
          type: "json_schema",
          json_schema: { name: call.schemaName, strict: true, schema: call.jsonSchema }
        }
      })
    });

    if (!response.ok) {
      const retry = response.headers.get("retry-after");
      if (response.status === 429) {
        throw new Error(`${call.agentName} is rate limited.${retry ? ` Retry after ${retry} seconds.` : " Please retry shortly."}`);
      }
      const body = await response.text().catch(() => "");
      throw new Error(`${call.agentName} request failed (${response.status}). ${body.slice(0, 200)}`.trim());
    }

    const payload = (await response.json()) as ChatCompletionsPayload;
    const text = payload.choices?.[0]?.message?.content;
    if (!text) {
      throw new Error(`${call.agentName} returned an empty response. Please retry.`);
    }

    const output = call.parse(JSON.parse(text));
    return { output, model, latencyMs: Date.now() - started, usage: payload.usage };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(`${call.agentName} timed out. Please retry.`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function callOpenAIResponses<TOutput>(call: StructuredAgentCall<TOutput>, apiKey: string): Promise<AgentCallResult<TOutput>> {
  const model = call.model ?? process.env.AGENT_MODEL ?? "gpt-5.6-luna";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45_000);
  const started = Date.now();

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      signal: controller.signal,
      headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({
        model,
        store: false,
        instructions: call.systemPrompt,
        input: JSON.stringify(call.input),
        text: { format: { type: "json_schema", name: call.schemaName, strict: true, schema: call.jsonSchema } }
      })
    });

    if (!response.ok) {
      const retry = response.headers.get("retry-after");
      if (response.status === 429) {
        throw new Error(`${call.agentName} is rate limited.${retry ? ` Retry after ${retry} seconds.` : " Please retry shortly."}`);
      }
      throw new Error(`${call.agentName} request failed (${response.status}). Please retry.`);
    }

    const payload = (await response.json()) as {
      output_text?: string;
      output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
      usage?: Record<string, unknown>;
    };
    const text = payload.output_text ?? payload.output?.flatMap((item) => item.content ?? []).find((item) => item.type === "output_text")?.text;
    if (!text) {
      throw new Error(`${call.agentName} returned an empty response. Please retry.`);
    }

    const output = call.parse(JSON.parse(text));
    return { output, model, latencyMs: Date.now() - started, usage: payload.usage };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(`${call.agentName} timed out. Please retry.`);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

type ProviderAttempt<TOutput> = { name: string; run: () => Promise<AgentCallResult<TOutput>> };

function configuredProviders<TOutput>(call: StructuredAgentCall<TOutput>): ProviderAttempt<TOutput>[] {
  const attempts: ProviderAttempt<TOutput>[] = [];

  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    attempts.push({
      name: "Gemini",
      run: () =>
        callChatCompletions(call, {
          baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
          apiKey: geminiKey,
          defaultModel: process.env.GEMINI_MODEL ?? "gemini-3.6-flash",
          authHeader: (key) => ({ authorization: `Bearer ${key}` })
        })
    });
  }

  const xaiKey = process.env.XAI_API_KEY;
  if (xaiKey) {
    attempts.push({
      name: "Grok",
      run: () =>
        callChatCompletions(call, {
          baseUrl: "https://api.x.ai/v1/chat/completions",
          apiKey: xaiKey,
          defaultModel: process.env.XAI_MODEL ?? "grok-4.6",
          authHeader: (key) => ({ authorization: `Bearer ${key}` })
        })
    });
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    attempts.push({ name: "OpenAI", run: () => callOpenAIResponses(call, openaiKey) });
  }

  return attempts;
}

export async function callStructuredAgent<TOutput>(call: StructuredAgentCall<TOutput>): Promise<AgentCallResult<TOutput>> {
  const attempts = configuredProviders(call);
  if (attempts.length === 0) {
    throw new Error(`${call.agentName} is not configured. Set GEMINI_API_KEY, XAI_API_KEY, or OPENAI_API_KEY.`);
  }

  let lastError: unknown;
  for (const attempt of attempts) {
    try {
      return await attempt.run();
    } catch (error) {
      lastError = error;
    }
  }

  const summary = attempts.map((a) => a.name).join(" -> ");
  const detail = lastError instanceof Error ? lastError.message : String(lastError);
  throw new Error(`${call.agentName} failed on every configured provider (${summary}). Last error: ${detail}`);
}
