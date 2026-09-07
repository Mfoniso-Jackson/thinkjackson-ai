/**
 * The shape every caller and every provider agrees on. Kept intentionally
 * small: two real task types exist in the product today (structured-agent
 * for Scout/Researcher, mission for the daily execution OS), so the enum
 * only lists those two. Add a new one only when a real page or feature
 * needs it — see the architecture assessment this was built from for why
 * pre-building categories like "vision" or "coding" with no caller was
 * rejected as overengineering.
 */
export type TaskType = "structured-agent" | "mission";

export type AIRequest = {
  task: TaskType;
  systemPrompt: string;
  input: unknown;
  jsonSchema: { name: string; schema: Record<string, unknown> };
  /** Free-form label for telemetry (e.g. "scout", "researcher", "mission") — not used for routing. */
  agentName: string;
  model?: string;
  /**
   * Optional domain-specific correlation id (e.g. a research_candidate_id)
   * that flows through to the telemetry row. Keeps the runtime itself free
   * of domain concepts — callers attach whatever correlation they need.
   */
  correlationId?: string;
};

export type AIUsage = Record<string, unknown>;

export type AIResponse<T = unknown> = {
  output: T;
  provider: string;
  model: string;
  latencyMs: number;
  usage?: AIUsage;
  /** 0 for any free-tier call. Only non-zero once a paid provider is actually used. */
  estimatedCostUsd: number;
};

export type AIModel = {
  provider: string;
  model: string;
  /** Whether this entry can be used at all, independent of mode — a manual kill switch per model. */
  enabled: boolean;
  /** true if this provider/model has no per-call charge (a real free tier, not just "cheap"). */
  freeTier: boolean;
  /** USD per call, only meaningful when freeTier is false — a rough estimate for budget tracking, not exact billing. */
  estimatedCostPerCallUsd: number;
  /** Lower runs first among otherwise-eligible candidates. */
  priority: number;
};

export interface AIProvider {
  id: string;
  isConfigured(): boolean;
  call<T>(request: AIRequest, model: AIModel, parse: (raw: unknown) => T): Promise<AIResponse<T>>;
}

export type RuntimeMode = "FREE_ONLY" | "FREE_PREFERRED" | "PAID_ALLOWED";
