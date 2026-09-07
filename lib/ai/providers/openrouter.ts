import "server-only";
import { callOpenAICompatible } from "@/lib/ai/providers/chat-completions-shared";
import type { AIModel, AIProvider, AIRequest, AIResponse } from "@/lib/ai/types";

/**
 * OpenRouter's own docs describe free (":free" suffix) models as "usually
 * not suitable for production use" due to low rate limits — this is
 * wired in as a real fallback option, not a primary dependency, matching
 * that guidance and the user's own instinct not to build the whole
 * architecture around one free tier.
 */
export const openrouterProvider: AIProvider = {
  id: "openrouter",
  isConfigured() {
    return Boolean(process.env.OPENROUTER_API_KEY);
  },
  async call<T>(request: AIRequest, model: AIModel, parse: (raw: unknown) => T): Promise<AIResponse<T>> {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error("OpenRouter is not configured. Set OPENROUTER_API_KEY.");
    return callOpenAICompatible("openrouter", "https://openrouter.ai/api/v1/chat/completions", apiKey, request, model, parse);
  }
};
