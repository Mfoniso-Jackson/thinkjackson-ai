import "server-only";

/**
 * Generalizes the fetch-based OpenAI Responses API call already proven in
 * lib/ai/mission-provider.ts into a reusable shape for any agent that needs
 * one structured, schema-validated output from one input. Scout, Researcher,
 * and future agents are thin callers of this — not separate integrations.
 * Swapping providers later means changing this one function, not every
 * agent that calls it.
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

export async function callStructuredAgent<TOutput>(call: StructuredAgentCall<TOutput>): Promise<AgentCallResult<TOutput>> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(`${call.agentName} is not configured. Set OPENAI_API_KEY.`);
  }

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
