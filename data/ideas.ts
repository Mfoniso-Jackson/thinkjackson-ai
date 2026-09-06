import type { EpistemicStatus } from "@/lib/graph/types";

export type Idea = {
  slug: string;
  title: string;
  eyebrow: string;
  status: EpistemicStatus;
  territorySlugs: readonly string[];
  summary: string;
  signal: string;
  openQuestions?: readonly string[];
};

export const transIntelligence = {
  slug: "trans-intelligence",
  title: "Trans-Intelligence",
  definition:
    "Intelligence is transitioning from being primarily embodied in individual humans to being distributed across humans, machines, autonomous agents, networks, markets, and institutions.",
  chain: ["Human", "Machine", "Agent", "Network", "Market", "Institution", "Ecosystem"] as const,
  summary:
    "Trans-Intelligence is the thesis that connects ThinkJackson's five research territories. It is not a claim that any one of these layers has arrived. It is a claim about direction: capability that once required an embodied human mind is increasingly produced by systems distributed across machines, agents, markets, and institutions. The five territories are where that transition is currently observable, and their overlaps are where it becomes interesting.",
  status: "interpretation" as EpistemicStatus
} as const;

export const ideas = [
  {
    slug: "computational-superstition",
    title: "Computational Superstition in Reinforcement Learning",
    eyebrow: "RL behavior",
    status: "hypothesis",
    territorySlugs: ["agentic-intelligence", "risk-and-uncertainty"],
    summary:
      "A name for behavior that stays stable because it was once adjacent to reward, not because it remains causally useful. An agent can look competent while still anchoring part of its policy to a ritual that no longer means anything.",
    signal: "Proxy persistence, delayed credit, adaptation failure",
    openQuestions: [
      "When does a learned proxy become behaviorally sticky after reward conditions change?",
      "Can persistence be measured independently from general performance decay?"
    ]
  },
  {
    slug: "non-causal-stabilization",
    title: "Non-Causal Stabilization and Agent Safety",
    eyebrow: "Safety",
    status: "hypothesis",
    territorySlugs: ["agentic-intelligence", "risk-and-uncertainty"],
    summary:
      "Systems can stabilize around patterns that are not causally grounded. Safety work usually asks whether an agent optimizes the wrong objective; this line of inquiry asks whether it is preserving the wrong history.",
    signal: "Non-causal loops, interpretability, intervention design"
  },
  {
    slug: "autonomous-trading-agents",
    title: "Autonomous Trading Agents",
    eyebrow: "Markets",
    status: "interpretation",
    territorySlugs: ["financial-intelligence", "agentic-intelligence"],
    summary:
      "Architectures for agents that reason over market state, risk, and execution need a way to tell signal discovery apart from overfit mythology, especially across regime change.",
    signal: "Execution intelligence, risk memory, market adaptation"
  },
  {
    slug: "portfolio-intelligence",
    title: "Portfolio Intelligence",
    eyebrow: "Financial systems",
    status: "interpretation",
    territorySlugs: ["financial-intelligence", "risk-and-uncertainty"],
    summary:
      "Decision infrastructure for portfolios that combines probabilistic views, constraints, capital allocation, and explainable operating discipline, instead of a dashboard that only displays a snapshot.",
    signal: "Allocation engines, scenario logic, capital cognition"
  },
  {
    slug: "agentic-web",
    title: "The Agentic Web",
    eyebrow: "Infrastructure",
    status: "speculation",
    territorySlugs: ["agentic-intelligence", "economic-coordination"],
    summary:
      "An internet layer where autonomous agents, not only humans behind browsers, are first-class participants: discovering each other, negotiating, and transacting without a person driving every step.",
    signal: "Agent discovery, machine-native protocols, autonomy"
  },
  {
    slug: "agent-identity",
    title: "Agent Identity",
    eyebrow: "Trust",
    status: "speculation",
    territorySlugs: ["trust-and-verification"],
    summary:
      "Before agents can be trusted, they need to be identifiable: a durable, verifiable way to say which agent did what, on whose behalf, and under what authority.",
    signal: "Verifiable credentials, provenance, delegation"
  },
  {
    slug: "agent-trust",
    title: "Agent Trust",
    eyebrow: "Trust",
    status: "speculation",
    territorySlugs: ["trust-and-verification"],
    summary:
      "Once agents are identifiable, the harder problem starts: how a reputation is earned, how it decays, and how a counterparty (human or machine) decides whether to rely on it.",
    signal: "Reputation, verification, reliability under adversarial conditions"
  },
  {
    slug: "agent-coordination",
    title: "Agent Coordination",
    eyebrow: "Coordination",
    status: "speculation",
    territorySlugs: ["economic-coordination", "trust-and-verification"],
    summary:
      "How groups of agents divide work, share memory, and resolve conflicting incentives, whether inside one coordination layer or across an open market of unaffiliated agents.",
    signal: "Task delegation, shared memory, incentive alignment"
  },
  {
    slug: "agent-economy",
    title: "The Agent Economy",
    eyebrow: "Markets",
    status: "speculation",
    territorySlugs: ["economic-coordination", "financial-intelligence"],
    summary:
      "What happens once agent identity, trust, and coordination are solved well enough that agents can request, price, compete for, verify, and settle work with each other as economic actors, not just tools.",
    signal: "Agent-native markets, machine-to-machine settlement",
    openQuestions: [
      "When does an AI system become an economic actor rather than a tool used by one?",
      "Can autonomous agents form functioning markets without direct human participation in every transaction?"
    ]
  },
  {
    slug: "machine-economies",
    title: "Machine Economies and Coordination Primitives",
    eyebrow: "Coordination",
    status: "interpretation",
    territorySlugs: ["economic-coordination", "trust-and-verification"],
    summary:
      "Protocols for funding, attribution, trust, and coordination where software agents and human communities transact around shared economic intent, from programmable settlement to contribution graphs.",
    signal: "Agent economies, incentives, decentralized labor"
  },
  {
    slug: "adaptive-decision-systems",
    title: "Identity, Cognition, and Adaptive Decision Systems",
    eyebrow: "Cognition",
    status: "interpretation",
    territorySlugs: ["agentic-intelligence", "risk-and-uncertainty"],
    summary:
      "How identity, context, memory, and feedback shape decisions across both humans and agents operating under uncertainty, and where those two kinds of decision-makers start to resemble each other.",
    signal: "Adaptive cognition, identity models, decision loops"
  }
] as const satisfies readonly Idea[];

export function getIdea(slug: string): Idea | undefined {
  return (ideas as readonly Idea[]).find((idea) => idea.slug === slug);
}

export function ideasByTerritory(territorySlug: string): Idea[] {
  return (ideas as readonly Idea[]).filter((idea) => idea.territorySlugs.includes(territorySlug));
}
