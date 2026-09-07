import "server-only";
import { callOpenAICompatible } from "@/lib/ai/providers/chat-completions-shared";
import type { AIModel, AIProvider, AIRequest, AIResponse } from "@/lib/ai/types";

export const grokProvider: AIProvider = {
  id: "grok",
  isConfigured() {
    return Boolean(process.env.XAI_API_KEY);
  },
  async call<T>(request: AIRequest, model: AIModel, parse: (raw: unknown) => T): Promise<AIResponse<T>> {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) throw new Error("Grok is not configured. Set XAI_API_KEY.");
    return callOpenAICompatible("grok", "https://api.x.ai/v1/chat/completions", apiKey, request, model, parse);
  }
};
