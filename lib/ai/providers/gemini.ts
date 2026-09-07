import "server-only";
import { callOpenAICompatible } from "@/lib/ai/providers/chat-completions-shared";
import type { AIModel, AIProvider, AIRequest, AIResponse } from "@/lib/ai/types";

export const geminiProvider: AIProvider = {
  id: "gemini",
  isConfigured() {
    return Boolean(process.env.GEMINI_API_KEY);
  },
  async call<T>(request: AIRequest, model: AIModel, parse: (raw: unknown) => T): Promise<AIResponse<T>> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Gemini is not configured. Set GEMINI_API_KEY.");
    return callOpenAICompatible(
      "gemini",
      "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      apiKey,
      request,
      model,
      parse
    );
  }
};
