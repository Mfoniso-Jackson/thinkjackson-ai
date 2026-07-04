export const navigation = [
  { label: "About", href: "/about" },
  { label: "Research", href: "/research" },
  { label: "Projects", href: "/projects" },
  { label: "Writing", href: "/writing" },
  { label: "Consulting", href: "/consulting" },
  { label: "Contact", href: "/contact" }
] as const;

export const socialLinks = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/mfoniso-jackson/"
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

export const writing = [
  {
    slug: "when-agents-keep-the-ritual",
    title: "When Agents Keep the Ritual After the Reward Disappears",
    excerpt:
      "A note on computational superstition, proxy rituals, and why reinforcement learners can look strangely human under reward uncertainty.",
    date: "2026-06-18",
    readingTime: "7 min",
    tags: ["Reinforcement learning", "AI safety"],
    body: [
      {
        heading: "The ritual is the residue of a once-useful world",
        paragraphs: [
          "A reinforcement learner does not need beliefs in the human sense to behave as if it has acquired a superstition. It only needs a history where an action, context, or proxy feature repeatedly appeared near reward. When the world changes, the agent may continue performing the old action because the behavior has become stabilized inside the policy, even after the causal bridge has collapsed.",
          "That persistence is not just an oddity. It is a window into how adaptive systems can confuse correlation for structure, especially when reward is delayed, sparse, or filtered through proxies."
        ]
      },
      {
        heading: "Why this matters for safety",
        paragraphs: [
          "Many safety conversations focus on what an agent optimizes. Computational superstition asks what an agent preserves. The preserved behavior may not be explicitly represented as a goal, yet it can shape future action because it survived earlier selection pressure.",
          "If an autonomous system learns a proxy ritual in a training environment, it may carry that ritual into deployment. The behavior can look like competence until the deployment context reveals that the agent is stabilizing around the wrong abstraction."
        ]
      },
      {
        heading: "The research direction",
        paragraphs: [
          "The next step is to build environments where reward-relevant and reward-adjacent features can be separated, shifted, and removed. The question is not only whether performance drops. The sharper question is which old behaviors remain, how long they persist, and what interventions help the agent relearn causal structure.",
          "Computational superstition is a small phrase for a large problem: adaptive systems inherit the ghosts of their training histories."
        ]
      }
    ]
  },
  {
    slug: "portfolio-intelligence-is-not-a-dashboard",
    title: "Portfolio Intelligence Is Not a Dashboard",
    excerpt:
      "Why the next frontier of financial software is not prettier analytics, but memory-bearing systems that can reason about capital under constraint.",
    date: "2026-05-27",
    readingTime: "6 min",
    tags: ["Markets", "Decision systems"],
    body: [
      {
        heading: "Dashboards describe. Intelligence remembers.",
        paragraphs: [
          "A dashboard is useful when the problem is visibility. Portfolio intelligence begins when visibility is no longer enough. A serious capital system needs memory: what the portfolio believed, what changed, what risk was accepted, and what evidence would force a revision.",
          "The future of portfolio software is not another surface of charts. It is a reasoning layer that can connect allocation, constraints, scenarios, and human judgment into an operating discipline."
        ]
      },
      {
        heading: "Capital has context",
        paragraphs: [
          "A position is not just a ticker and a weight. It is a claim about a world, a time horizon, a liquidity profile, a drawdown tolerance, and a reason for being held instead of something else.",
          "When software ignores that context, it turns portfolios into static inventories. When software preserves context, it becomes possible to ask better questions: what assumption is this exposure expressing, what would invalidate it, and where is the portfolio repeating the same hidden bet?"
        ]
      },
      {
        heading: "The system to build",
        paragraphs: [
          "Portfolio intelligence should operate like a memory-bearing co-pilot: mapping exposures, tracking thesis drift, testing scenarios, and making trade-offs explicit before capital moves.",
          "This is where financial engineering and agent architecture meet. The goal is not to automate conviction. The goal is to make decision quality harder to fake."
        ]
      }
    ]
  },
  {
    slug: "machine-economies-need-coordination-primitives",
    title: "Machine Economies Need Coordination Primitives",
    excerpt:
      "A founder memo on agentic markets, Web3 funding rails, and the missing social grammar of human-machine collaboration.",
    date: "2026-04-12",
    readingTime: "8 min",
    tags: ["Web3", "Coordination"],
    body: [
      {
        heading: "Agents will not just use markets. They will reshape them.",
        paragraphs: [
          "As software agents become capable of research, negotiation, routing, and execution, the economy around them needs more than payment rails. It needs coordination primitives: ways to express trust, delegate authority, attribute work, split value, and revoke permission.",
          "Without those primitives, machine economies become brittle automation wrapped around old institutions. With them, agents can participate in networks where human intent remains legible."
        ]
      },
      {
        heading: "Coordination is the product surface",
        paragraphs: [
          "The important interface may not be a chat box or trading screen. It may be the coordination layer: who can act, under what constraints, with which budget, on whose behalf, and with what audit trail.",
          "Web3 is interesting here not as spectacle, but as infrastructure for portable state, programmable incentives, and shared records of contribution."
        ]
      },
      {
        heading: "The founder question",
        paragraphs: [
          "The useful question is not whether agents will transact. They will. The question is whether the systems around those transactions make cooperation more trustworthy or more chaotic.",
          "The next generation of machine-economy products should make delegation explicit, attribution durable, and coordination cheaper than confusion."
        ]
      }
    ]
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

export const consultingOffers = [
  "AI strategy for market-facing products and technical teams",
  "Financial engineering systems, portfolio tooling, and quant research workflows",
  "Agent architecture for autonomous research, execution, and operations",
  "Web3 product strategy for coordination, incentives, and machine economies",
  "Research-to-product execution for founders building from technical insight"
] as const;
