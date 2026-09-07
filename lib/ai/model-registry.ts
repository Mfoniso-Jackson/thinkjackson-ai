import type { AIModel } from "@/lib/ai/types";

/**
 * The registry is the one place model choices live — nothing else in the
 * runtime hardcodes a model name. Update this file (not scattered call
 * sites) when a provider deprecates a model or changes free-tier terms;
 * that's exactly the failure mode that bit this project once already
 * (gemini-2.5-flash was silently deprecated mid-project).
 *
 * `enabled` and `freeTier` are treated as configuration, not permanent
 * facts, per the architecture assessment: review this file periodically
 * rather than trusting it indefinitely.
 */
export const modelRegistry: AIModel[] = [
  {
    provider: "gemini",
    model: process.env.GEMINI_MODEL ?? "gemini-3.6-flash",
    enabled: true,
    freeTier: true,
    estimatedCostPerCallUsd: 0,
    priority: 1
  },
  {
    // The smaller 8b-instruct-fast model was tested first and rejected: it
    // couldn't reliably follow a multi-field JSON schema (truncated output,
    // wrong field content) even though it's also JSON-mode-capable. 70b
    // handled the same real schema correctly and uses ~13 of the 10,000
    // free daily neurons per call (~750 calls/day of free headroom).
    provider: "cloudflare",
    model: "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
    enabled: true,
    freeTier: true,
    estimatedCostPerCallUsd: 0,
    priority: 2
  },
  {
    // OpenRouter's free model lineup rotates — meta-llama/llama-3.3-70b-instruct:free
    // was pulled from the free tier during this same build session, exactly
    // the "free isn't permanent" risk this registry exists to isolate.
    // dots-studio/dots-3-note-preview:free was verified live: correctly
    // follows a strict json_schema and responds in reasonable time — two
    // other free candidates with structured_outputs support were tried and
    // rejected first (a 120b model was too slow for a synchronous request;
    // see this file's git history for that test).
    provider: "openrouter",
    model: process.env.OPENROUTER_MODEL ?? "dots-studio/dots-3-note-preview:free",
    enabled: true,
    freeTier: true,
    estimatedCostPerCallUsd: 0,
    priority: 3
  },
  {
    provider: "grok",
    model: process.env.XAI_MODEL ?? "grok-4.6",
    enabled: true,
    freeTier: false,
    estimatedCostPerCallUsd: 0.02,
    priority: 4
  },
  {
    provider: "openai",
    model: process.env.AGENT_MODEL ?? "gpt-5.6-luna",
    enabled: true,
    freeTier: false,
    estimatedCostPerCallUsd: 0.02,
    priority: 5
  }
];
