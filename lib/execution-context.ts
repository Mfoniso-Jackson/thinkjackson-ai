import type { ProjectContext } from "@/lib/execution-types";

export const initialProjectContexts: ProjectContext[] = [
  {
    id: "8d2bb2d0-79d9-4b99-9be0-f2ed1c083b11",
    name: "OmniQuantAI",
    slug: "omniquantai",
    description: "Flagship AI-native quantitative intelligence and agent orchestration platform.",
    stage: "Validation",
    targetCustomer: "Head of Quantitative Research, Portfolio Manager, or founder of a crypto hedge fund, proprietary trading firm, or digital asset investment firm.",
    customerProblem: "Research teams spend too much time manually monitoring markets, generating hypotheses, validating strategies, and preparing actionable research.",
    valueProposition: "An AI quant research analyst that continuously monitors markets, detects meaningful changes, investigates opportunities, and produces structured, evidence-backed research.",
    currentPriority: "Generate strong external evidence that professional users value the research and decision-support workflow.",
    currentBottleneck: "Limited professional user validation and an unclear first paid use case.",
    currentMetrics: [],
    currentRisks: ["Unclear first paid use case", "Limited professional user validation", "Insufficient distribution", "Potential overengineering", "Weak proof that users will pay", "Unclear separation from MassifX"],
    activeMilestones: [],
    openAssumptions: ["Professional research teams will adopt an autonomous daily research brief", "At least one target segment will pay for decision-support output"],
    productUrls: [], repositoryUrls: [], contextNotes: ""
  },
  {
    id: "44b13f88-ded6-42ed-bc56-d97df53a15ce",
    name: "MassifX",
    slug: "massifx",
    description: "Commercial AI trading intelligence and professional decision-support product powered by OmniQuantAI.",
    stage: "Validation",
    targetCustomer: "Professional crypto trader, portfolio manager, proprietary trader, or small digital asset fund.",
    customerProblem: "TradingView, ChatGPT, notebooks, news tools, and risk tools are disconnected and require substantial manual interpretation.",
    valueProposition: "MassifX detects important market developments, investigates them, scores confidence, supports position sizing, and continuously monitors risk.",
    currentPriority: "Prove measurable improvements in research speed, opportunity detection, risk monitoring, or decision consistency.",
    currentBottleneck: "No measurable professional adoption or repeatable acquisition channel.",
    currentMetrics: [],
    currentRisks: ["Insufficient differentiation from TradingView plus ChatGPT", "No proof of improved decision quality", "Limited professional adoption", "No repeatable acquisition channel", "Feature overbuild before validation"],
    activeMilestones: [],
    openAssumptions: ["Professionals will pay for integrated opportunity detection and risk monitoring"],
    productUrls: [], repositoryUrls: [], contextNotes: ""
  }
];
