import "server-only";
import { modelRegistry } from "@/lib/ai/model-registry";
import { currentMode, modeAllowsModel } from "@/lib/ai/cost-guard";
import { geminiProvider } from "@/lib/ai/providers/gemini";
import { grokProvider } from "@/lib/ai/providers/grok";
import { openaiProvider } from "@/lib/ai/providers/openai";
import { cloudflareProvider } from "@/lib/ai/providers/cloudflare";
import { openrouterProvider } from "@/lib/ai/providers/openrouter";
import type { AIModel, AIProvider } from "@/lib/ai/types";

const providersById: Record<string, AIProvider> = {
  gemini: geminiProvider,
  grok: grokProvider,
  openai: openaiProvider,
  cloudflare: cloudflareProvider,
  openrouter: openrouterProvider
};

export type RoutedCandidate = { model: AIModel; provider: AIProvider };

/**
 * The ordered list of candidates eligible for this call right now:
 * enabled in the registry, allowed by the current MODE, and actually
 * configured (has its API key/credentials). Free candidates always sort
 * before paid ones when both are eligible, independent of registry
 * priority order — priority only breaks ties within the same tier.
 */
export function routeCandidates(): RoutedCandidate[] {
  const mode = currentMode();

  return modelRegistry
    .filter((model) => model.enabled && modeAllowsModel(mode, model))
    .map((model) => ({ model, provider: providersById[model.provider] }))
    .filter((candidate): candidate is RoutedCandidate => Boolean(candidate.provider) && candidate.provider.isConfigured())
    .sort((a, b) => {
      if (a.model.freeTier !== b.model.freeTier) return a.model.freeTier ? -1 : 1;
      return a.model.priority - b.model.priority;
    });
}
