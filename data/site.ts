export const navigation = [
  { label: "About", href: "/about" },
  { label: "Research", href: "/research" },
  { label: "Projects", href: "/projects" },
  { label: "Writing", href: "/writing" },
  { label: "Now", href: "/now" },
  { label: "Consulting", href: "/consulting" },
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
    slug: "gratifi",
    title: "GratiFi",
    category: "AI/Web3 coordination",
    summary:
      "A platform for dream-linked micro-tipping and worker funding, designed around gratitude as an economic primitive rather than a marketing mechanic.",
    status: "Product architecture",
    href: "/projects/gratifi",
    githubUrl: "https://github.com/Mfoniso-Jackson/Gratifi",
    thesis:
      "GratiFi treats gratitude as a coordination signal: a lightweight way for communities to fund ambition, recognize invisible labor, and route support toward people before institutions know how to value them.",
    problem:
      "Most funding systems are optimized for credentials, scale, and legibility. The early moments of a dream are usually illegible: a worker needs a small bridge, a creator needs momentum, a contributor needs recognition before a formal market exists.",
    architecture: [
      "Dream-linked profiles that connect a person, their current work, and the concrete support they need next.",
      "Micro-tipping flows that make small acts of support feel intentional rather than disposable.",
      "AI-assisted matching between contributors, community context, and funding opportunities.",
      "Web3-native attribution and optional settlement rails for portable reputation and transparent funding trails."
    ],
    roadmap: [
      "Prototype the dream profile and contribution graph.",
      "Design the trust layer for identity, fraud resistance, and social verification.",
      "Pilot with a small community where creative work, service work, and mutual aid already overlap."
    ]
  },
  {
    slug: "massifx",
    title: "MassifX",
    category: "Decentralized quant systems",
    summary:
      "A decentralized AI quant hub for research, strategies, and market intelligence at the edge of collaborative financial engineering.",
    status: "Concept to infrastructure",
    href: "/projects/massifx",
    thesis:
      "MassifX imagines quant research as a networked intelligence layer: researchers, agents, datasets, and strategies coordinating around market discovery without collapsing into a closed black box.",
    problem:
      "Quant work is fragmented between private notebooks, opaque funds, social media speculation, and toolchains that do not preserve reasoning. The result is duplicated effort, weak attribution, and strategy ideas that cannot become durable systems.",
    architecture: [
      "Research workspaces for strategy hypotheses, data lineage, experiments, and peer review.",
      "Agent-assisted research flows that surface regime shifts, anomalies, and model failure modes.",
      "Strategy registries with attribution, risk notes, and lifecycle state.",
      "Coordination mechanisms for contributors, capital allocators, and infrastructure operators."
    ],
    roadmap: [
      "Define the research object model: thesis, dataset, experiment, signal, strategy, risk note.",
      "Build a private alpha around collaborative strategy memos.",
      "Add agentic market-monitoring workflows once the human research loop is disciplined."
    ]
  },
  {
    slug: "omniquantai",
    title: "OmniQuantAI",
    category: "Financial Intelligence Infrastructure",
    summary:
      "A Financial Intelligence Network for autonomous markets, where specialist AI agents compete to produce, verify, purchase, and monetize investment intelligence.",
    status: "Infrastructure thesis",
    href: "/projects/omniquantai",
    githubUrl: "https://github.com/Mfoniso-Jackson/omniquantai-coralos",
    positioning: "Financial Intelligence Network for Autonomous Markets.",
    subtitle:
      "An autonomous marketplace where AI agents compete to produce financial intelligence and earn through programmable settlement.",
    categories: [
      "Autonomous Agent Economy",
      "Machine-native Finance",
      "Decision Intelligence",
      "Research Infrastructure",
      "Web3 Settlement"
    ],
    heroCopy: [
      "OmniQuantAI is building the infrastructure for a new generation of financial markets where autonomous agents are not simply tools used by humans. They become economic participants.",
      "Specialist AI agents compete to deliver market intelligence, portfolio analysis, macro research, valuation work, news interpretation, and risk insights.",
      "A buyer agent evaluates competing proposals, purchases the best-value intelligence, and settles payment through programmable financial infrastructure. The long-term vision is an open Financial Intelligence Network where research itself becomes a machine-native market."
    ],
    thesis:
      "Financial intelligence should not come from one model or one analyst. Markets discover better prices through competition. OmniQuantAI applies the same principle to intelligence: specialist agents compete to produce better investment intelligence, the best-value intelligence wins, and research becomes a market.",
    problem:
      "Financial intelligence is still produced like software from the last generation. Research is fragmented across disconnected tools, analysts repeatedly duplicate work, and general-purpose AI produces one opinion instead of exposing competing hypotheses.",
    problems: [
      "Research is fragmented across disconnected tools.",
      "Analysts repeatedly duplicate work.",
      "General-purpose AI produces one opinion instead of exposing competing hypotheses.",
      "Institutions struggle to compare multiple reasoning paths.",
      "There is no native market where autonomous agents can buy or sell financial intelligence.",
      "Existing financial infrastructure was designed for humans, not autonomous economic actors."
    ],
    solutionTitle: "Financial Intelligence as an Open Market.",
    solution:
      "OmniQuantAI transforms investment research into an agent economy. A portfolio agent broadcasts a research request, specialist seller agents compete, and the buyer evaluates quality rather than simply selecting the cheapest proposal. The winning seller delivers structured investment intelligence, settlement occurs through programmable payment rails, and every transaction expands the Financial Intelligence Network.",
    marketFlow: [
      "A portfolio agent broadcasts a research request.",
      "Specialist seller agents submit price, reasoning, confidence, and expected delivery.",
      "A buyer agent evaluates quality, cost, uncertainty, and relevance.",
      "The winning seller delivers structured investment intelligence.",
      "Programmable settlement routes payment and reputation back into the network."
    ],
    architecture: [
      "Market Intelligence Layer: market data, macro, news, sentiment, on-chain, and alternative data.",
      "Financial Intelligence Layer: market analyst, macro, risk, portfolio, news, valuation, and future specialist agents.",
      "Marketplace Layer: research requests, agent auctions, seller personas, buyer evaluation, agent competition, and the intelligence marketplace.",
      "Decision Intelligence Layer: hypothesis generation, scenario analysis, bull/base/bear cases, confidence scoring, investment committee memos, and human approval.",
      "Coordination Layer: CoralOS, multi-agent workflows, shared memory, task delegation, performance history, and reputation.",
      "Settlement Layer: Solana settlement, escrow, agent payments, machine commerce, and future Sui settlement adapters.",
      "Knowledge Network: historical recommendations, research archive, agent memory, and knowledge graph."
    ],
    architectureLayers: [
      {
        title: "Market Intelligence Layer",
        items: ["Market data", "Macro", "News", "Sentiment", "On-chain", "Alternative data"]
      },
      {
        title: "Financial Intelligence Layer",
        items: ["Market Analyst Agent", "Macro Agent", "Risk Agent", "Portfolio Agent", "News Agent", "Valuation Agent", "Future specialist agents"]
      },
      {
        title: "Marketplace Layer",
        items: ["Research requests", "Agent auctions", "Seller personas", "Buyer evaluation", "Agent competition", "Intelligence marketplace"]
      },
      {
        title: "Decision Intelligence Layer",
        items: ["Hypothesis generation", "Scenario analysis", "Bull/Base/Bear cases", "Confidence scoring", "Investment committee memo generation", "Human approval"]
      },
      {
        title: "Coordination Layer",
        items: ["CoralOS", "Multi-agent workflows", "Shared memory", "Task delegation", "Performance history", "Reputation"]
      },
      {
        title: "Settlement Layer",
        items: ["Solana settlement", "Escrow", "Agent payments", "Machine commerce", "Future Sui settlement adapter"]
      },
      {
        title: "Knowledge Network",
        items: ["Historical recommendations", "Research archive", "Agent memory", "Knowledge graph"]
      }
    ],
    roadmap: [
      "Specify the Financial Intelligence Network protocol: request formats, seller submissions, buyer evaluation criteria, and settlement events.",
      "Prototype a closed agent marketplace where specialist agents compete on macro, risk, portfolio, news, and valuation briefs.",
      "Add reputation, research archives, and knowledge graph memory so intelligence compounds across transactions.",
      "Introduce programmable settlement through Solana rails with future adapter support for Sui."
    ]
  },
  {
    slug: "computational-superstition-rl",
    title: "Computational Superstition RL",
    category: "Original research",
    summary:
      "Research into proxy persistence, non-causal stabilization, and learned rituals in reinforcement learning agents.",
    status: "Research track",
    href: "/projects/computational-superstition-rl",
    githubUrl: "https://github.com/Mfoniso-Jackson/noncausal-stabilization-rl",
    thesis:
      "Computational superstition names a class of agent behaviors where learned proxies persist after their causal usefulness disappears, creating rituals that look adaptive because they once correlated with reward.",
    problem:
      "Reinforcement learning systems can preserve action patterns that were locally rewarded but no longer causally matter. This matters for safety because non-causal stabilization can hide inside apparently competent behavior.",
    architecture: [
      "Experimental environments where proxy signals are introduced, rewarded, shifted, and removed.",
      "Behavioral probes for persistence, extinction, and recovery under reward landscape change.",
      "Interpretability notes that connect agent rituals to credit assignment and causal confusion.",
      "Safety framing for interventions that reduce brittle proxy dependence."
    ],
    roadmap: [
      "Formalize the failure mode and vocabulary.",
      "Design toy environments that separate true causal features from accidental reward proxies.",
      "Publish experimental notes and connect the work to agent safety discussions."
    ]
  },
  {
    slug: "domusgraph-homegraph",
    title: "DomusGraph / HomeGraph",
    category: "Property intelligence",
    summary:
      "A data intelligence layer for renters, landlords, and property managers, turning fragmented housing records into useful decision graphs.",
    status: "Applied intelligence",
    href: "/projects/domusgraph-homegraph",
    thesis:
      "DomusGraph turns housing information into a decision graph: a structured layer where renters, landlords, and property managers can reason about homes, histories, obligations, and risk.",
    problem:
      "Housing data is scattered across listings, messages, maintenance records, contracts, payments, inspections, and subjective memory. Important decisions are made with partial context and weak continuity.",
    architecture: [
      "Entity graph for properties, units, tenants, landlords, managers, issues, documents, and events.",
      "Data ingestion from listings, forms, maintenance tickets, and communication records.",
      "Decision views for affordability, maintenance risk, tenant experience, and operational follow-up.",
      "AI-assisted summarization that keeps human judgment anchored to traceable records."
    ],
    roadmap: [
      "Define the core housing graph schema.",
      "Prototype renter and property-manager views on the same underlying data model.",
      "Explore partnerships where fragmented property workflows create real operational drag."
    ]
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
    title: "The Difference Between Signal, Ritual, and Regime",
    theme: "Research",
    note: "A practical vocabulary for separating causal structure from learned habit in agents and markets."
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
  "Share any real repositories or demos for MassifX or DomusGraph/HomeGraph.",
  "Write one longer flagship essay expanding Computational Superstition in Reinforcement Learning.",
  "Collect any real screenshots, diagrams, notebooks, or architecture artifacts that can make the project pages more concrete."
] as const;

export const consultingOffers = [
  "AI strategy for market-facing products and technical teams",
  "Financial engineering systems, portfolio tooling, and quant research workflows",
  "Agent architecture for autonomous research, execution, and operations",
  "Web3 product strategy for coordination, incentives, and machine economies",
  "Research-to-product execution for founders building from technical insight"
] as const;
