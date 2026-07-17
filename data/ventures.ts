import type { CapitalObjective, Venture } from "@/lib/venture-types";
import { validateVentures } from "@/lib/venture-validation";

export const capabilityThesis = [
  "Autonomous agents",
  "Decision systems under uncertainty",
  "Risk and incentive modelling",
  "Structured data graphs",
  "Trust and verification systems",
  "Economic coordination",
  "Human-in-the-loop automation"
] as const;

export const capitalObjectiveLabels: Record<CapitalObjective, string> = {
  "not-raising": "Not currently fundraising",
  angel: "Open to angel conversations",
  "pre-seed": "Pre-seed capital",
  seed: "Seed capital",
  grant: "Open to grants",
  "pilot-partners": "Pilot partners",
  "strategic-partners": "Strategic partners",
  "research-sponsors": "Research sponsors"
};

export const ventures = [
  {
    slug: "omniquantai",
    name: "OmniQuantAI",
    category: "AI agent infrastructure / financial intelligence",
    tagline: "A financial intelligence network where autonomous agents buy, sell, verify, and settle investment research.",
    problem:
      "Financial research is still routed through human-only workflows, disconnected dashboards, and single-model outputs. There is no native market where autonomous agents can request, price, compete on, verify, and settle financial intelligence.",
    solution:
      "A CoralOS-coordinated marketplace where a buyer agent broadcasts a research request, specialist seller agents bid, the buyer selects best value, intelligence is delivered as a structured memo, a verifier checks the report, and Solana devnet escrow releases payment.",
    targetCustomer: "Funds, AI-native research teams, autonomous-agent builders, and market infrastructure partners.",
    currentAlternative:
      "General-purpose AI chat, analyst workflows, terminal dashboards, closed quant tooling, disconnected research notebooks, and marketplace ideas without working settlement proof.",
    investmentThesis:
      "As software agents become economic actors, financial intelligence needs market structure: requests, bids, verification, reputation, settlement, and memory.",
    stage: "mvp",
    statusLabel: "Hackathon MVP / devnet proof",
    businessModel: [
      "Agent marketplace fees",
      "Research workflow subscriptions",
      "Enterprise infrastructure pilots",
      "Verification and reputation services",
      "Developer ecosystem incentives"
    ],
    differentiation: [
      "Working WANT/BID/AWARD flow instead of a static concept deck.",
      "Buyer selects best value rather than the cheapest seller bid.",
      "Deterministic verifier gates release of payment after report delivery.",
      "Solana devnet escrow proves machine-native settlement for useful agent work.",
      "Architecture is marketplace-shaped so specialist agents, reputation, and research memory can compound."
    ],
    marketEntry:
      "Judge-facing demo around a concrete NVDA exposure question, then design-partner pilots with funds, AI-native research teams, and agent infrastructure partners that need controlled financial-intelligence workflows.",
    defensibility: [
      "CoralOS coordination layer for buyer and seller agents.",
      "Marketplace protocol surfaces for research requests, bids, awards, verification, and settlement.",
      "Historical research archive, reputation graph, and future Financial Intelligence Graph.",
      "Founder research around proxy persistence, regime confusion, and adaptive decision systems."
    ],
    milestones: [
      "Built a judge-facing demo for the question: should a fund increase exposure to Nvidia over the next 3-6 months?",
      "Implemented Research Request -> Agent Auction -> Buyer Decision -> Escrow Deposited -> Intelligence Delivered -> Verified -> Payment Released.",
      "Launched four bootstrap seller agents: market analyst, news and earnings, macro risk, and portfolio risk.",
      "Published a public proof release on July 16, 2026.",
      "Documented testnet posture, production plan, token/network coordination strategy, and ecosystem playbooks."
    ],
    evidence: [
      {
        label: "Public proof run release",
        description:
          "GitHub release for the OmniQuantAI public proof run, documenting the current devnet proof posture.",
        url: "https://github.com/Mfoniso-Jackson/omniquantai-coralos/releases/tag/proof-2026-07-16",
        verified: true,
        date: "2026-07-16"
      },
      {
        label: "OmniQuantAI CoralOS repository",
        description:
          "Public TypeScript repository for the CoralOS-coordinated financial intelligence marketplace and Solana devnet settlement demo.",
        url: "https://github.com/Mfoniso-Jackson/omniquantai-coralos",
        verified: true,
        date: "2026-07-17"
      },
      {
        label: "OmniQuantAI trading foundation repository",
        description:
          "Public paper-first trading platform foundation with market data abstraction, paper broker, position manager, risk engine, strategy protocol, regime detector, analytics, and WEEX competition integration.",
        url: "https://github.com/Mfoniso-Jackson/OmniQuantAI",
        verified: true,
        date: "2026-07-09"
      }
    ],
    capitalObjectives: ["strategic-partners", "research-sponsors", "grant"],
    currentAsk: "Aligned investors, ecosystem partners, design partners, and research sponsors for agentic financial-intelligence infrastructure.",
    useOfFunds: ["Product engineering", "Data infrastructure", "Security and compliance", "Pilot delivery", "Research", "Developer ecosystem"],
    nextMilestone:
      "Move from deterministic demo support into a closed design-partner pilot with stronger live-data adapters, richer verification, persisted reputation, and testnet deployment hardening.",
    risks: [
      "Financial-services compliance boundaries require careful scope control.",
      "Demo research support is not trading advice and should not be represented as a live investment recommendation.",
      "Current market/news/macro evidence includes deterministic fallback data for reliability.",
      "Mainnet settlement is not enabled.",
      "Quality evaluation for agent-generated intelligence must be rigorous before any live capital or customer use."
    ],
    founderAdvantage:
      "Connects financial engineering, agent architecture, portfolio intelligence, Web3 settlement, and AI safety research under one working marketplace proof.",
    repositoryUrl: "https://github.com/Mfoniso-Jackson/omniquantai-coralos",
    featured: true,
    flagship: true,
    public: true
  },
  {
    slug: "massifx",
    name: "MassifX",
    category: "Quantitative trading infrastructure",
    tagline: "AI-native infrastructure for strategy research, risk review, backtesting, and paper execution.",
    problem:
      "Crypto trading intelligence often jumps from dashboards and notebooks to unsafe automation without a disciplined boundary between decisioning, risk approval, and execution.",
    solution:
      "A production-oriented monorepo with a Next.js dashboard, strategy interfaces, risk engine, backtester, paper trading simulator, agent decisions, data adapters, and database utilities.",
    targetCustomer: "Crypto traders, quant researchers, funds, and autonomous trading-agent teams.",
    currentAlternative: "Manual dashboards, exchange interfaces, spreadsheets, ad hoc bots, and isolated notebooks.",
    investmentThesis:
      "Operating infrastructure for building, evaluating, and governing adaptive market strategies.",
    stage: "mvp",
    statusLabel: "Production-oriented MVP",
    businessModel: ["SaaS for strategy intelligence", "Research workspace subscriptions", "Pilot infrastructure for funds"],
    differentiation: [
      "Paper trading is the explicit v1 boundary.",
      "Risk engine evaluates agent decisions independently.",
      "Backtesting and strategy evaluation are built into the same operating surface."
    ],
    marketEntry: "Paper-trading intelligence and investor-demo workflows before any live-execution path.",
    defensibility: ["Risk-first architecture", "Agent decision schema", "Market-regime intelligence workflow"],
    milestones: [
      "Public MassifX repository exists.",
      "Architecture documents describe apps/web, packages/core, packages/agents, packages/data, and packages/db.",
      "README states live trading is intentionally disabled in v1."
    ],
    evidence: [
      {
        label: "MassifX repository",
        description: "Public monorepo for AI quant infrastructure.",
        url: "https://github.com/Mfoniso-Jackson/massifx",
        verified: true
      }
    ],
    capitalObjectives: ["angel", "pilot-partners", "strategic-partners"],
    currentAsk: "Pilot partners and aligned angel conversations around market-intelligence infrastructure.",
    useOfFunds: ["Product engineering", "Data infrastructure", "Security", "Pilot delivery"],
    nextMilestone: "Validated paper-trading workflow with clearer risk controls, test coverage, and demo artifacts.",
    risks: [
      "Must avoid implying financial advice or live execution readiness.",
      "Backtests and simulations need transparent methodology before commercial claims.",
      "Any future live adapter requires explicit compliance and security gates."
    ],
    founderAdvantage:
      "Combines market-agent architecture with the computational-superstition research lens around false signal and regime confusion.",
    repositoryUrl: "https://github.com/Mfoniso-Jackson/massifx",
    featured: true,
    flagship: false,
    public: true
  },
  {
    slug: "gratifi",
    name: "GratiFi",
    category: "Recognition infrastructure / future of work",
    tagline: "Walletless recognition infrastructure for hospitality and service workers.",
    problem:
      "Customer appreciation, worker recognition, venue operations, and portable proof of gratitude are fragmented across cash, messages, and opaque platform records.",
    solution:
      "QR-based recognition flow with Stripe verification, Supabase event records, admin exports, retry workflows, and Moonbeam anchoring of deterministic recognition hashes.",
    targetCustomer: "Hospitality venues, service workers, venue operators, and worker-recognition partners.",
    currentAlternative: "Cash tips, informal thank-you notes, platform-specific payout histories, and manual venue records.",
    investmentThesis:
      "A recognition and economic mobility layer connecting customer appreciation to worker goals and measurable outcomes.",
    stage: "mvp",
    statusLabel: "Production-shaped platform",
    businessModel: ["Venue SaaS", "Transaction fees", "Recognition and worker-outcome analytics"],
    differentiation: [
      "Walletless customer experience.",
      "Verifiable recognition records without forcing crypto into the front-end journey.",
      "Admin workflow for monitoring, retrying, exporting, and verifying events."
    ],
    marketEntry: "Hospitality and service venues where worker recognition, retention, and trust are operationally meaningful.",
    defensibility: ["Recognition event graph", "Venue workflow integration", "Hybrid payment and anchoring architecture"],
    milestones: [
      "Public GratiFi repository exists.",
      "README documents Next.js 15, Supabase, Stripe, Solidity, and Moonbeam implementation.",
      "Repository includes setup, architecture, protocol, and launch-checklist documentation."
    ],
    evidence: [
      {
        label: "GratiFi repository",
        description: "Public repository for recognition infrastructure.",
        url: "https://github.com/Mfoniso-Jackson/Gratifi",
        verified: true
      }
    ],
    capitalObjectives: ["pilot-partners", "strategic-partners", "grant"],
    currentAsk: "Venue pilots, hospitality partners, and ecosystem grant conversations.",
    useOfFunds: ["Pilot delivery", "Security and compliance", "Worker and venue discovery", "Product engineering"],
    nextMilestone: "A focused venue pilot with worker profiles, verified recognition events, admin review, and exportable evidence.",
    risks: [
      "Payment, worker data, and venue operations require careful privacy and operational controls.",
      "Web3 anchoring must remain useful infrastructure, not a user-experience burden.",
      "Pilot design needs clear worker and venue success criteria."
    ],
    founderAdvantage:
      "Applies coordination-system thinking to a tangible service-work market where incentives, trust, and records matter.",
    repositoryUrl: "https://github.com/Mfoniso-Jackson/Gratifi",
    featured: true,
    flagship: false,
    public: true
  },
  {
    slug: "domusgraph-homegraph",
    name: "DomusGraph / HomeGraph",
    category: "Proptech / graph intelligence",
    tagline: "A structured intelligence and accountability graph for rental-property operations.",
    problem:
      "Rental-property decisions are made with fragmented memory across listings, reviews, maintenance issues, claims, messages, and subjective renter experience.",
    solution:
      "A production-shaped MVP for property search, reviews, maintenance issue reporting, claims, manager intake, contributor dashboards, admin research, and Verified Housing Events.",
    targetCustomer: "Renters, landlords, property managers, letting agents, and housing researchers.",
    currentAlternative: "Static listings, private spreadsheets, unstructured review sites, ticket systems, and private operational memory.",
    investmentThesis:
      "The intelligence layer for fragmented rental-property operations and tenant experience.",
    stage: "mvp",
    statusLabel: "Production-shaped MVP",
    businessModel: ["Property intelligence SaaS", "Manager workflow tooling", "Research data products"],
    differentiation: [
      "Verified Housing Events as a graph-growth north star.",
      "Structured schema for reviews, issues, claims, referrals, and manager intake.",
      "Admin research dashboard and CSV export paths from the MVP."
    ],
    marketEntry: "Renter contribution loops and property-manager discovery workflows in concentrated local markets.",
    defensibility: ["Housing event graph", "Structured trust signals", "Contributor reputation and property completeness loops"],
    milestones: [
      "Public DomusGraph repository exists.",
      "README documents Supabase Auth, PostgreSQL, RLS, Server Actions, and growth-engine migrations.",
      "Core routes include search, property profiles, reviews, issues, claims, dashboards, and admin exports."
    ],
    evidence: [
      {
        label: "DomusGraph repository",
        description: "Public repository for housing transparency MVP.",
        url: "https://github.com/Mfoniso-Jackson/domusgraph",
        verified: true
      }
    ],
    capitalObjectives: ["pilot-partners", "strategic-partners"],
    currentAsk: "Housing-domain design partners and local pilot partners.",
    useOfFunds: ["Customer discovery", "Data infrastructure", "Moderation tooling", "Pilot delivery"],
    nextMilestone: "Verified local contribution loop with moderation controls, property identity, and actionable manager workflows.",
    risks: [
      "Housing data requires moderation, abuse prevention, and privacy controls before broad public launch.",
      "Property identity needs address normalization and reliable enrichment.",
      "Marketplace trust depends on verified event quality, not volume alone."
    ],
    founderAdvantage:
      "Translates graph-intelligence and adaptive decision systems into an operational domain with fragmented records and high trust costs.",
    repositoryUrl: "https://github.com/Mfoniso-Jackson/domusgraph",
    featured: true,
    flagship: false,
    public: true
  },
  {
    slug: "sentiniq",
    name: "SentinIQ",
    category: "Retail security operations",
    tagline: "AI-assisted incident capture and reporting infrastructure for retail security teams.",
    problem:
      "Retail incident reporting is often slow, inconsistent, and disconnected from the evidence and operational context needed for follow-up.",
    solution:
      "Incident capture, evidence organisation, workflow automation, and reporting infrastructure for operational teams.",
    targetCustomer: "Retail security teams, operations managers, and loss-prevention teams.",
    currentAlternative: "Manual incident forms, scattered CCTV notes, chat threads, and disconnected reporting tools.",
    investmentThesis:
      "A structured incident-intelligence system that reduces reporting friction and turns fragmented security events into operational data.",
    stage: "prototype",
    statusLabel: "In development",
    businessModel: ["Operational SaaS", "Pilot deployments", "Security workflow integrations"],
    differentiation: [
      "Incident data model rather than free-text-only reporting.",
      "AI-assisted evidence organisation.",
      "Workflow lens across capture, escalation, and reporting."
    ],
    marketEntry: "Focused discovery with retail operators and security teams before broad product claims.",
    defensibility: ["Incident intelligence schema", "Operational workflow design", "Domain-specific automation"],
    milestones: ["Founder-supplied concept in current venture portfolio brief."],
    evidence: [],
    capitalObjectives: ["pilot-partners", "strategic-partners"],
    currentAsk: "Retail/security design partners for discovery and pilot shaping.",
    useOfFunds: ["Customer discovery", "Product engineering", "Security review"],
    nextMilestone: "Founder input required: public repo, demo, or architecture artifact.",
    risks: [
      "Needs verified product artifact before stronger public claims.",
      "Security data handling requires careful privacy and access-control design.",
      "AI vision claims should remain scoped until evidence exists."
    ],
    founderAdvantage:
      "Applies structured data, workflow automation, and incident intelligence to a high-friction operational domain.",
    featured: false,
    flagship: false,
    public: true
  },
  {
    slug: "liquidationguard",
    name: "LiquidationGuard",
    category: "Crypto risk intelligence",
    tagline: "Decision-support software for understanding liquidation distance and leverage fragility.",
    problem:
      "Leveraged digital-asset traders often see position entry before they understand liquidation distance, scenario risk, and fragility under volatility.",
    solution:
      "Risk-intelligence tooling for leverage exposure, scenario risk, liquidation distance, and position fragility before or during trade management.",
    targetCustomer: "Leveraged crypto traders, trading educators, and risk-conscious digital-asset communities.",
    currentAlternative: "Exchange margin screens, calculators, chat advice, and post-hoc loss analysis.",
    investmentThesis: "A preventive risk layer for leveraged digital-asset markets.",
    stage: "prototype",
    statusLabel: "In development",
    businessModel: ["Trading-tool SaaS", "Education partnerships", "Risk dashboard subscriptions"],
    differentiation: [
      "Pre-trade risk framing rather than signal selling.",
      "Scenario-based fragility analysis.",
      "Clear boundary as decision support, not financial advice."
    ],
    marketEntry: "Educational and decision-support workflows for crypto traders before any execution integration.",
    defensibility: ["Risk model UX", "Scenario library", "Trader education workflow"],
    milestones: [
      "Public repository exists.",
      "Founder-supplied positioning included in current venture portfolio brief."
    ],
    evidence: [
      {
        label: "LiquidationGuard repository",
        description: "Public repository for crypto risk tooling.",
        url: "https://github.com/Mfoniso-Jackson/liquidationguard",
        verified: true
      }
    ],
    capitalObjectives: ["not-raising", "strategic-partners"],
    currentAsk: "Not currently fundraising; open to strategic feedback from risk-focused traders and educators.",
    useOfFunds: ["Product validation", "Risk model review", "Educational content"],
    nextMilestone: "Founder input required: public demo or validated risk-calculation artifact.",
    risks: [
      "Must avoid financial-advice positioning.",
      "Risk calculations need verification before public reliance.",
      "Market education angle should be tested before commercialization."
    ],
    founderAdvantage:
      "Connects crypto risk, financial engineering, and decision-support UX without overclaiming execution performance.",
    repositoryUrl: "https://github.com/Mfoniso-Jackson/liquidationguard",
    featured: false,
    flagship: false,
    public: true
  },
  {
    slug: "computational-superstition-rl",
    name: "Computational Superstition RL",
    category: "AI safety research / research-to-product",
    tagline: "Research into proxy persistence and non-causal stabilization in adaptive agents.",
    problem:
      "Agents can preserve behaviors that were historically adjacent to reward even after those behaviors stop being causally useful.",
    solution:
      "Experimental environments and vocabulary for measuring persistence, extinction, substitution, and recovery after proxy removal.",
    targetCustomer: "AI safety researchers, agent builders, market-agent teams, and research sponsors.",
    currentAlternative: "General distribution-shift testing and aggregate performance metrics that may miss ritual persistence.",
    investmentThesis:
      "A research moat for building more robust autonomous agents and market systems under regime change.",
    stage: "research",
    statusLabel: "Research track",
    businessModel: ["Research sponsorship", "Grant-funded experiments", "Agent safety consulting"],
    differentiation: [
      "Focus on preserved behavior, not only optimized objective.",
      "Direct bridge from RL safety to market-agent regime confusion.",
      "Experimental agenda with measurable persistence and recovery concepts."
    ],
    marketEntry: "Publish research artifacts, toy environments, and applied notes for agent architectures.",
    defensibility: ["Original vocabulary", "Experiment design", "Connection to venture portfolio agent systems"],
    milestones: [
      "Public flagship essay published.",
      "Public noncausal-stabilization-rl repository exists."
    ],
    evidence: [
      {
        label: "Flagship essay",
        description: "Public essay defining computational superstition in reinforcement learning.",
        url: "https://thinkjackson.com/writing/computational-superstition-in-reinforcement-learning",
        verified: true
      },
      {
        label: "Research repository",
        description: "Public repository for non-causal stabilization experiments.",
        url: "https://github.com/Mfoniso-Jackson/noncausal-stabilization-rl",
        verified: true
      }
    ],
    capitalObjectives: ["grant", "research-sponsors"],
    currentAsk: "Research sponsors and grant conversations for experiment design, implementation, and publication.",
    useOfFunds: ["Research", "Experiment implementation", "Visualization", "Technical writing"],
    nextMilestone: "Research artifact page for experimental design and measurable toy environments.",
    risks: [
      "Research claims must remain experimental until validated.",
      "Terminology needs careful connection to existing AI safety literature.",
      "Product relevance should be shown through specific agent-system examples."
    ],
    founderAdvantage:
      "Creates the technical language that connects AI safety, market agents, and adaptive decision infrastructure.",
    repositoryUrl: "https://github.com/Mfoniso-Jackson/noncausal-stabilization-rl",
    featured: true,
    flagship: false,
    public: true
  }
] as const satisfies readonly Venture[];

validateVentures(ventures);

const configuredFlagshipVenture = ventures.find((venture) => venture.flagship);

if (!configuredFlagshipVenture) {
  throw new Error("No flagship venture configured.");
}

export const flagshipVenture: Venture = configuredFlagshipVenture;

export const publicVentures: readonly Venture[] = ventures.filter((venture) => venture.public);

export const investorOverview = {
  thesis:
    "Mfoniso builds adaptive decision and coordination infrastructure for environments where capital, risk, trust, incentives, and autonomous agents interact.",
  whyNow: [
    "Software is moving from passive workflow support toward autonomous agents that make, evaluate, and route decisions.",
    "Markets and operations increasingly need systems that preserve reasoning, risk memory, and governance rather than only displaying data.",
    "Machine-mediated economic activity creates new demand for verification, settlement, reputation, and human-in-the-loop controls.",
    "Fragmented operational data in finance, property, retail, and work creates openings for structured intelligence layers."
  ],
  capitalLogic:
    "Capital and partnership activity should be milestone-driven and venture-specific. This site does not present a pooled fund, brokered securities offering, or public investment solicitation.",
  useOfFunds: [
    "Product engineering",
    "Data infrastructure",
    "Security and compliance",
    "Customer discovery",
    "Pilot delivery",
    "Distribution",
    "Research",
    "Specialist hiring"
  ]
} as const;

export const founderProfile = {
  name: "Mfoniso Jackson",
  headline: "AI engineer and venture builder working across markets, agents, risk, and economic coordination.",
  bio:
    "Mfoniso Jackson builds AI-native systems that connect financial engineering, autonomous agents, reinforcement-learning research, Web3 coordination, portfolio intelligence, and operational data graphs.",
  domains: [
    "Financial engineering",
    "Reinforcement learning",
    "Autonomous agents",
    "AI safety",
    "Portfolio intelligence",
    "Web3 coordination systems",
    "Adaptive decision systems"
  ],
  verifiedFacts: [
    "Computer Hardware and Software Engineering degree from Coventry University.",
    "Third place at BrumHack 2017.",
    "Experience at web3names.ai requires founder wording confirmation before public detail is expanded.",
    "Public repositories now exist for GratiFi, MassifX, OmniQuantAI, DomusGraph, LiquidationGuard, and Computational Superstition RL."
  ],
  thesis:
    "The founder advantage is the ability to move between research, system architecture, product development, market design, and execution without treating those as separate worlds."
} as const;
