import "server-only";
import { runWithFallback } from "@/lib/ai/fallback";
import { currentMode, checkDailyCeilings } from "@/lib/ai/cost-guard";
import type { AIRequest, AIResponse } from "@/lib/ai/types";

/**
 * The one entrypoint the rest of the product calls: generate({ task,
 * systemPrompt, input, jsonSchema, agentName }, parse) instead of naming a
 * provider. Everything about which provider/model actually runs — mode,
 * budget ceilings, priority order, failover — lives behind this call.
 */
export async function generate<T>(request: AIRequest, parse: (raw: unknown) => T): Promise<AIResponse<T>> {
  const mode = currentMode();
  const ceiling = await checkDailyCeilings(mode);
  if (!ceiling.allowed) {
    throw new Error(`${request.agentName} was blocked by a cost guard: ${ceiling.reason}`);
  }

  return runWithFallback(request, parse);
}
