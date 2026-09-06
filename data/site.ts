export const navigation = [
  { label: "Ideas", href: "/ideas" },
  { label: "Research", href: "/research" },
  { label: "People", href: "/people" },
  { label: "Podcast", href: "/podcast" },
  { label: "Ventures", href: "/projects" },
  { label: "Writing", href: "/writing" },
  { label: "Investor Brief", href: "/investors" },
  { label: "Contact", href: "/contact" }
] as const;

export const socialLinks = [
  {
    kind: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/mfoniso-jackson/"
  },
  {
    kind: "x",
    label: "X",
    href: "https://x.com/mrjacksonsays"
  },
  {
    kind: "telegram",
    label: "Telegram",
    href: "https://t.me/mfonisojackson",
    handle: "@mfonisojackson"
  },
  {
    kind: "discord",
    label: "Discord",
    handle: "massif_jackson"
  }
] as const;

export const writingTracks = [
  {
    title: "Agent Behavior and Safety",
    summary:
      "Essays on computational superstition, proxy persistence, non-causal stabilization, and the ways adaptive systems preserve old reward histories.",
    cadence: "Research notes and experimental memos"
  },
  {
    title: "Market Intelligence and Portfolio Systems",
    summary:
      "Writing on autonomous financial agents, portfolio memory, risk cognition, and decision infrastructure for capital under uncertainty.",
    cadence: "Builder essays and system design notes"
  },
  {
    title: "Machine Economies and Coordination",
    summary:
      "Founder notes on agent markets, programmable settlement, contribution graphs, and the social grammar needed for human-machine collaboration.",
    cadence: "Product theses and coordination memos"
  }
] as const;

export const writingQueue = [
  {
    title: "Autonomous Trading Agents Need Risk Memory",
    theme: "Markets",
    note: "Why execution intelligence is incomplete without a durable account of assumptions, constraints, and regime change."
  },
  {
    title: "Risk Memory for Autonomous Trading Agents",
    theme: "Research",
    note: "A design note on how market agents should remember assumptions without becoming trapped by old regimes."
  },
  {
    title: "What an Agent Marketplace for Financial Intelligence Needs to Prove",
    theme: "Machine economies",
    note: "A launch thesis for OmniQuantAI: competition, verification, reputation, and settlement as intelligence infrastructure."
  },
  {
    title: "Portfolio Intelligence as an Operating System for Capital",
    theme: "Portfolio systems",
    note: "A deeper argument for replacing static dashboards with memory-bearing decision systems."
  }
] as const;

export const flagshipResearch = {
  slug: "computational-superstition",
  title: "Computational Superstition in Reinforcement Learning",
  summary:
    "A research program for studying proxy persistence, non-causal stabilization, and learned rituals in adaptive agents.",
  sections: [
    {
      heading: "Core claim",
      paragraphs: [
        "Computational superstition describes behavior that remains stable because it was historically adjacent to reward, not because it remains causally useful. In reinforcement learning, this can emerge when an agent learns to preserve proxy actions, contextual rituals, or feature dependencies that once predicted success.",
        "The concept is useful because it gives language to a subtle failure mode: an agent may adapt enough to look competent while still anchoring parts of its policy to non-causal structure."
      ]
    },
    {
      heading: "Why it matters",
      paragraphs: [
        "Safety work often asks whether an agent is optimizing the wrong objective. This research also asks whether an agent is preserving the wrong history. Proxy persistence can survive reward changes, environment shifts, and partial retraining.",
        "In market agents, recommender systems, robotics, and autonomous workflows, these learned rituals can become hidden sources of brittleness. They may not appear as explicit goals, but they can still steer behavior."
      ]
    },
    {
      heading: "Experimental agenda",
      paragraphs: [
        "The research path is to construct environments where causal features and reward-adjacent proxy features can be controlled separately. Agents can then be tested across phases: proxy introduction, reward association, proxy removal, and post-shift adaptation.",
        "The key measurements are persistence, extinction, substitution, and recovery. The goal is not merely to watch performance fall, but to understand which rituals survive and how intervention changes the trajectory."
      ]
    },
    {
      heading: "Product relevance",
      paragraphs: [
        "This research directly informs agent architecture. Systems that operate in markets, workflows, or social environments need mechanisms for memory, causal review, and policy correction.",
        "A useful agent should not only learn what worked. It should learn how to doubt the reasons it thinks something worked."
      ]
    }
  ],
  questions: [
    "When does a learned proxy become behaviorally sticky after reward conditions change?",
    "Can persistence be measured independently from general performance decay?",
    "Which interventions help agents abandon non-causal rituals without destroying useful memory?",
    "How does computational superstition appear in financial agents that confuse regime-specific artifacts with signal?"
  ]
} as const;

export const launchPost = {
  title: "Introducing thinkjackson",
  linkedin:
    "I launched thinkjackson as a home for the work I am doing at the intersection of AI systems, markets, autonomous agents, safety, Web3 coordination, and portfolio intelligence.\n\nThe site is not meant to be a static portfolio. It is a research and builder platform: a place to develop ideas like computational superstition in reinforcement learning, portfolio intelligence as memory-bearing infrastructure, and coordination systems for machine economies.\n\nMy operating thesis is simple: the next important AI systems will not just be more capable. They will need to reason under uncertainty, remember risk, understand incentives, and help humans coordinate around complex economic decisions.\n\nIf you are building in financial engineering, agent architecture, AI safety, market intelligence, or coordination infrastructure, I would be glad to compare notes.\n\nhttps://thinkjackson.com",
  short:
    "Launched thinkjackson: my research and builder platform for AI systems, markets, agents, and human coordination.\n\nWriting soon on computational superstition in RL, portfolio intelligence, autonomous trading agents, and machine economies.\n\nhttps://thinkjackson.com"
} as const;

export const focusItems = [
  "Formalizing computational superstition as a failure mode for adaptive agents.",
  "Designing autonomous market systems with durable risk memory.",
  "Turning research claims into product surfaces that operators can trust.",
  "Building coordination infrastructure for agent-mediated economic networks."
] as const;

export const nowItems = [
  {
    title: "Building OmniQuantAI as a Financial Intelligence Network",
    detail:
      "Developing the architecture for an agent marketplace where specialist financial agents compete to produce research, risk views, and portfolio intelligence."
  },
  {
    title: "Formalizing computational superstition in reinforcement learning",
    detail:
      "Turning the proxy-persistence idea into a research track with clear experiments, vocabulary, and implications for autonomous agent safety."
  },
  {
    title: "Exploring agentic markets and programmable settlement",
    detail:
      "Studying how autonomous agents can request, evaluate, purchase, and settle intelligence through machine-native financial rails."
  },
  {
    title: "Selective consulting",
    detail:
      "Open to focused work with founders, funds, and technical teams building AI systems where markets, agents, and coordination matter."
  }
] as const;

export const ownerTasks = [
  "Confirm Cloudflare Email Routing is receiving mail for hello@thinkjackson.com.",
  "Decide whether /launch should stay public, become private, or turn into a polished public launch note.",
  "Collect live screenshots, diagrams, notebooks, and demo artifacts for MassifX, GratiFi, DomusGraph, and OmniQuantAI.",
  "Write two more flagship essays before adding newsletter or waitlist capture.",
  "Add one research artifact page for the Computational Superstition RL experimental design."
] as const;

export const consultingOffers = [
  "AI strategy for market-facing products and technical teams",
  "Financial engineering systems, portfolio tooling, and quant research workflows",
  "Agent architecture for autonomous research, execution, and operations",
  "Web3 product strategy for coordination, incentives, and machine economies",
  "Research-to-product execution for founders building from technical insight"
] as const;
