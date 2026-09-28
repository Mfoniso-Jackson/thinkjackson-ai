"use server";

import { askThinkJackson, type ConciergeAnswer } from "@/lib/agents/concierge";
import { checkAndIncrementRateLimit, getClientIpHash } from "@/lib/rate-limit";

export type AskState = { status: "idle" | "success" | "error"; message?: string; answer?: ConciergeAnswer; question?: string };

/**
 * The second genuinely public-facing AI surface (after Submit to the Map).
 * Rate-limited per IP on top of the AI Runtime's own global daily ceiling
 * (lib/ai/cost-guard.ts, already enforced inside generate() regardless of
 * caller) — this is the extra layer specific to an anonymous, unbounded
 * visitor count hitting one endpoint.
 */
const MAX_QUESTIONS_PER_IP_PER_DAY = 10;

export async function askQuestion(_previousState: AskState, formData: FormData): Promise<AskState> {
  const question = String(formData.get("question") ?? "").trim();
  if (question.length < 5) {
    return { status: "error", message: "Ask a real question — a few words isn't enough to search the graph." };
  }
  if (question.length > 500) {
    return { status: "error", message: "Keep it under 500 characters." };
  }

  const ipHash = await getClientIpHash();
  const allowed = await checkAndIncrementRateLimit(`ask:${ipHash}`, MAX_QUESTIONS_PER_IP_PER_DAY);
  if (!allowed) {
    return { status: "error", message: "You've hit today's question limit. Try again tomorrow." };
  }

  try {
    const answer = await askThinkJackson(question);
    return { status: "success", answer, question };
  } catch (error) {
    return { status: "error", message: error instanceof Error ? error.message : "Could not answer that right now." };
  }
}
