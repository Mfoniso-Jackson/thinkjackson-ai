import "server-only";

/**
 * Generalizes structured, schema-validated LLM calls into one reusable
 * shape any agent can call — Scout, Researcher, and future agents are thin
 * callers of this, not separate integrations. Swapping or adding a
 * provider means changing this one function, not every agent that calls
 * it. Two providers are wired in: Gemini (via Google's OpenAI-compatible
 * endpoint) and OpenAI directly. If GEMINI_API_KEY is set, Gemini is used;
 * otherwise it falls back to OpenAI. That's a deliberate simple default,
 * not a general multi-provider router — revisit if a third provider or
 * per-call provider choice is ever actually needed.
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

export async function callStructuredAgent<TOutput>(call: StructuredAgentCall<TOutput>): Promise<AgentCallResult<TOutput>> {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    return callChatCompletions(call, {
      baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      apiKey: geminiKey,
      defaultModel: process.env.GEMINI_MODEL ?? "gemini-3.6-flash",
      authHeader: (key) => ({ authorization: `Bearer ${key}` })
    });
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey) {
    return callOpenAIResponses(call, openaiKey);
  }

  throw new Error(`${call.agentName} is not configured. Set GEMINI_API_KEY or OPENAI_API_KEY.`);
}
