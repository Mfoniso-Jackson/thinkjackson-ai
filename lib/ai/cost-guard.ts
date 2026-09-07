import "server-only";
import { countAgentActionsToday, totalCostTodayUsd } from "@/lib/kg-store";
import type { AIModel, RuntimeMode } from "@/lib/ai/types";

const DEFAULT_MAX_REQUESTS_PER_DAY = 200;
const DEFAULT_DAILY_BUDGET_USD = 5;

export function currentMode(): RuntimeMode {
  const mode = process.env.AI_RUNTIME_MODE;
  if (mode === "FREE_PREFERRED" || mode === "PAID_ALLOWED") return mode;
  return "FREE_ONLY";
}

/**
 * The one choke point cost safety actually depends on: in FREE_ONLY, a
 * paid model is excluded here regardless of what the registry's priority
 * ordering says or which provider keys happen to be configured. A new
 * provider adapter or a reordered registry can't accidentally bypass this.
 */
export function modeAllowsModel(mode: RuntimeMode, model: AIModel): boolean {
  if (mode === "FREE_ONLY") return model.freeTier;
  return true;
}

/**
 * Reads today's totals from agent_logs directly instead of maintaining a
 * separate counter table — correct and simple at current traffic; revisit
 * only if request volume ever makes the query itself expensive.
 */
export async function checkDailyCeilings(mode: RuntimeMode): Promise<{ allowed: boolean; reason?: string }> {
  const maxRequests = Number(process.env.AI_MAX_REQUESTS_PER_DAY ?? DEFAULT_MAX_REQUESTS_PER_DAY);
  const requestsToday = await countAgentActionsToday();
  if (requestsToday >= maxRequests) {
    return { allowed: false, reason: `Daily request ceiling reached (${requestsToday}/${maxRequests}).` };
  }

  if (mode === "PAID_ALLOWED") {
    const budget = Number(process.env.AI_DAILY_BUDGET_USD ?? DEFAULT_DAILY_BUDGET_USD);
    const spentToday = await totalCostTodayUsd();
    if (spentToday >= budget) {
      return { allowed: false, reason: `Daily budget ceiling reached ($${spentToday.toFixed(2)}/$${budget.toFixed(2)}).` };
    }
  }

  return { allowed: true };
}
