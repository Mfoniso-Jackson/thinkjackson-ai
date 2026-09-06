export type Territory = {
  slug: string;
  name: string;
  definition: string;
  signal: string;
};

export const territories = [
  {
    slug: "agentic-intelligence",
    name: "Agentic Intelligence",
    definition:
      "How autonomous systems perceive, decide, act, and adapt without a human in every loop, and what happens to their behavior once a reward or objective shifts under them.",
    signal: "Autonomy, adaptation, emergent behavior"
  },
  {
    slug: "financial-intelligence",
    name: "Financial Intelligence",
    definition:
      "How markets, portfolios, and capital decisions are reasoned about by machines: not dashboards that display data, but systems that hold assumptions, risk, and memory.",
    signal: "Markets, portfolios, decision infrastructure"
  },
  {
    slug: "risk-and-uncertainty",
    name: "Risk & Uncertainty",
    definition:
      "How intelligent systems represent what they do not know, remember why past decisions were made, and avoid mistaking a stable-looking pattern for a causal one.",
    signal: "Regime change, false correlation, risk memory"
  },
  {
    slug: "trust-and-verification",
    name: "Trust & Verification",
    definition:
      "How identity, reputation, and correctness are established between parties that cannot rely on a shared institution or a human handshake, including agent-to-agent and agent-to-human trust.",
    signal: "Identity, reputation, verification"
  },
  {
    slug: "economic-coordination",
    name: "Economic Coordination",
    definition:
      "How independent agents, humans, and institutions coordinate around shared economic intent when no single party has full authority: markets, protocols, incentives, and settlement.",
    signal: "Markets, protocols, incentives, settlement"
  }
] as const satisfies readonly Territory[];

export function getTerritory(slug: string) {
  return territories.find((territory) => territory.slug === slug);
}
