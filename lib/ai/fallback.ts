import "server-only";
import { routeCandidates } from "@/lib/ai/router";
import { logAgentAction } from "@/lib/kg-store";
import type { AIRequest, AIResponse } from "@/lib/ai/types";

/**
 * Tries each eligible candidate in priority order, logging every attempt
 * (not just the final outcome) — a real improvement over the old
 * per-call-site logging this replaced, since a "Gemini failed, then
 * OpenAI succeeded" run now produces two rows telling that whole story,
 * not one row that only shows the winner.
 */
export async function runWithFallback<T>(request: AIRequest, parse: (raw: unknown) => T): Promise<AIResponse<T>> {
  const candidates = routeCandidates();
  const agent = request.agentName.toLowerCase();

  if (candidates.length === 0) {
    throw new Error(`${request.agentName} has no eligible provider right now — check AI_RUNTIME_MODE and configured provider keys.`);
  }

  let lastError: unknown;
  const attempted: string[] = [];

  for (const candidate of candidates) {
    attempted.push(candidate.provider.id);
    try {
      const result = await candidate.provider.call(request, candidate.model, parse);
      await logAgentAction({
        agent,
        researchCandidateId: request.correlationId,
        model: `${candidate.provider.id}/${result.model}`,
        latencyMs: result.latencyMs,
        tokenUsage: result.usage,
        requestSuccess: true,
        schemaValid: true,
        taskType: request.task,
        estimatedCostUsd: result.estimatedCostUsd
      });
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      await logAgentAction({
        agent,
        researchCandidateId: request.correlationId,
        model: candidate.provider.id,
        requestSuccess: false,
        errorCode: message,
        taskType: request.task
      });
      lastError = error;
    }
  }

  const detail = lastError instanceof Error ? lastError.message : String(lastError);
  throw new Error(`${request.agentName} failed on every eligible provider (${attempted.join(" -> ")}). Last error: ${detail}`);
}
