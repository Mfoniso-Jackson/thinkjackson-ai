export const navigation = [
  { label: "About", href: "/about" },
  { label: "Research", href: "/research" },
  { label: "Projects", href: "/projects" },
  { label: "Writing", href: "/writing" },
  { label: "Consulting", href: "/consulting" },
  { label: "Contact", href: "/contact" }
] as const;

export const researchThemes = [
  {
    title: "Computational Superstition in Reinforcement Learning",
    eyebrow: "RL behavior",
    summary:
      "Studying how agents preserve proxy rituals after reward landscapes shift, and what that reveals about adaptation, credit assignment, and machine belief.",
    signal: "Proxy persistence, delayed credit, adaptation failure"
  },
  {
    title: "AI Safety and Non-Causal Stabilization",
    eyebrow: "Safety",
    summary:
      "Investigating how systems stabilize around patterns that are not causally grounded, then designing interventions that make agent behavior legible and corrigible.",
    signal: "Non-causal loops, interpretability, intervention design"
  },
  {
    title: "Autonomous Trading Agents",
    eyebrow: "Markets",
    summary:
      "Architectures for agents that reason over market state, risk, execution, regime change, and the difference between signal discovery and overfit mythology.",
    signal: "Execution intelligence, risk memory, market adaptation"
  },
  {
    title: "Portfolio Intelligence",
    eyebrow: "Financial systems",
    summary:
      "Decision infrastructure for portfolios that combines probabilistic views, constraints, capital allocation, and explainable operating discipline.",
    signal: "Allocation engines, scenario logic, capital cognition"
  },
  {
    title: "Machine Economies and Web3 Coordination",
    eyebrow: "Coordination",
    summary:
      "Protocols for funding, attribution, trust, and coordination where software agents and human communities transact around shared economic intent.",
    signal: "Agent economies, incentives, decentralized labor"
  },
  {
    title: "Human Identity, Cognition, and Adaptive Decision Systems",
    eyebrow: "Cognition",
    summary:
      "Exploring how identity, context, memory, and feedback shape decisions across humans and agents operating under uncertainty.",
    signal: "Adaptive cognition, identity models, decision loops"
  }
] as const;

export const projects = [
  {
    title: "GratiFi",
    category: "AI/Web3 coordination",
    summary:
      "A platform for dream-linked micro-tipping and worker funding, designed around gratitude as an economic primitive rather than a marketing mechanic.",
    status: "Product architecture",
    href: "/projects#gratifi"
  },
  {
    title: "MassifX",
    category: "Decentralized quant systems",
    summary:
      "A decentralized AI quant hub for research, strategies, and market intelligence at the edge of collaborative financial engineering.",
    status: "Concept to infrastructure",
    href: "/projects#massifx"
  },
  {
    title: "OmniQuantAI",
    category: "Autonomous quant intelligence",
    summary:
      "Infrastructure for autonomous quantitative agents that can reason across data, portfolio context, execution constraints, and model uncertainty.",
    status: "System design",
    href: "/projects#omniquantai"
  },
  {
    title: "Computational Superstition RL",
    category: "Original research",
    summary:
      "Research into proxy persistence, non-causal stabilization, and learned rituals in reinforcement learning agents.",
    status: "Research track",
    href: "/projects#computational-superstition-rl"
  },
  {
    title: "DomusGraph / HomeGraph",
    category: "Property intelligence",
    summary:
      "A data intelligence layer for renters, landlords, and property managers, turning fragmented housing records into useful decision graphs.",
    status: "Applied intelligence",
    href: "/projects#domusgraph-homegraph"
  }
] as const;

export const writing = [
  {
    title: "When Agents Keep the Ritual After the Reward Disappears",
    excerpt:
      "A note on computational superstition, proxy rituals, and why reinforcement learners can look strangely human under reward uncertainty.",
    date: "2026-06-18",
    readingTime: "7 min",
    tags: ["Reinforcement learning", "AI safety"]
  },
  {
    title: "Portfolio Intelligence Is Not a Dashboard",
    excerpt:
      "Why the next frontier of financial software is not prettier analytics, but memory-bearing systems that can reason about capital under constraint.",
    date: "2026-05-27",
    readingTime: "6 min",
    tags: ["Markets", "Decision systems"]
  },
  {
    title: "Machine Economies Need Coordination Primitives",
    excerpt:
      "A founder memo on agentic markets, Web3 funding rails, and the missing social grammar of human-machine collaboration.",
    date: "2026-04-12",
    readingTime: "8 min",
    tags: ["Web3", "Coordination"]
  }
] as const;

export const focusItems = [
  "Formalizing computational superstition as a failure mode for adaptive agents.",
  "Designing autonomous market systems with durable risk memory.",
  "Turning research claims into product surfaces that operators can trust.",
  "Building coordination infrastructure for agent-mediated economic networks."
] as const;

export const consultingOffers = [
  "AI strategy for market-facing products and technical teams",
  "Financial engineering systems, portfolio tooling, and quant research workflows",
  "Agent architecture for autonomous research, execution, and operations",
  "Web3 product strategy for coordination, incentives, and machine economies",
  "Research-to-product execution for founders building from technical insight"
] as const;
