import { publicVentures } from "@/data/ventures";
import type { LeadIntent, PipelineStage } from "@/lib/sales-types";

export const leadIntentLabels: Record<LeadIntent, string> = {
  investor: "Investor",
  customer: "Potential customer",
  "pilot-partner": "Pilot partner",
  "strategic-partner": "Strategic partner",
  "grant-provider": "Grant provider",
  "research-collaborator": "Research collaborator",
  media: "Media",
  consulting: "Consulting enquiry",
  general: "General enquiry"
};

export const pipelineStages: { value: PipelineStage; label: string; active: boolean }[] = [
  { value: "identified", label: "Identified", active: true },
  { value: "contacted", label: "Contacted", active: true },
  { value: "responded", label: "Responded", active: true },
  { value: "qualified", label: "Qualified", active: true },
  { value: "discovery-scheduled", label: "Discovery Scheduled", active: true },
  { value: "discovery-complete", label: "Discovery Complete", active: true },
  { value: "demo", label: "Demo or Review", active: true },
  { value: "proposal-drafting", label: "Proposal Drafting", active: true },
  { value: "proposal-sent", label: "Proposal Sent", active: true },
  { value: "negotiation", label: "Negotiation", active: true },
  { value: "verbal-commitment", label: "Verbal Commitment", active: true },
  { value: "won", label: "Won", active: false },
  { value: "lost", label: "Lost", active: false },
  { value: "future", label: "Future", active: false },
  { value: "paused", label: "Paused", active: false },
  { value: "disqualified", label: "Disqualified", active: false }
];

export const terminalStages: PipelineStage[] = ["won", "lost", "future", "paused", "disqualified"];

export const strategicHierarchy = {
  flagshipVenture: "omniquantai",
  activeCommercialVentures: ["omniquantai", "massifx", "gratifi", "domusgraph-homegraph"],
  researchProgrammes: ["computational-superstition-rl"],
  pausedVentures: [] as string[],
  seekingPilots: ["massifx", "gratifi", "domusgraph-homegraph", "sentiniq"],
  seekingInvestment: ["omniquantai", "massifx"],
  seekingGrants: ["omniquantai", "gratifi", "computational-superstition-rl"],
  seekingStrategicPartners: ["omniquantai", "massifx", "gratifi", "domusgraph-homegraph", "sentiniq"]
} as const;

export const ventureCtas: Record<string, { label: string; intent: LeadIntent; campaign: string }[]> = {
  omniquantai: [
    { label: "Request Investor Brief", intent: "investor", campaign: "omniquantai-investor-cta" },
    { label: "Discuss Infrastructure Partnership", intent: "strategic-partner", campaign: "omniquantai-partnership-cta" },
    { label: "Explore a Design Partnership", intent: "pilot-partner", campaign: "omniquantai-design-partner-cta" }
  ],
  massifx: [
    { label: "Request a Quant Infrastructure Demo", intent: "customer", campaign: "massifx-demo-cta" },
    { label: "Discuss a Pilot", intent: "pilot-partner", campaign: "massifx-pilot-cta" },
    { label: "Explore Strategic Integration", intent: "strategic-partner", campaign: "massifx-integration-cta" }
  ],
  gratifi: [
    { label: "Become a Pilot Venue", intent: "pilot-partner", campaign: "gratifi-pilot-venue-cta" },
    { label: "Support Worker Recognition Infrastructure", intent: "grant-provider", campaign: "gratifi-ecosystem-funding-cta" },
    { label: "Explore Ecosystem Funding", intent: "strategic-partner", campaign: "gratifi-partner-cta" }
  ],
  "domusgraph-homegraph": [
    { label: "Join as a Design Partner", intent: "pilot-partner", campaign: "domusgraph-design-partner-cta" },
    { label: "Discuss a Property Management Pilot", intent: "customer", campaign: "domusgraph-pm-pilot-cta" },
    { label: "Explore PropTech Investment", intent: "investor", campaign: "domusgraph-investor-cta" }
  ],
  sentiniq: [
    { label: "Request a Retail Security Pilot", intent: "pilot-partner", campaign: "sentiniq-security-pilot-cta" },
    { label: "Discuss Operational Integration", intent: "customer", campaign: "sentiniq-integration-cta" },
    { label: "Explore Strategic Partnership", intent: "strategic-partner", campaign: "sentiniq-partnership-cta" }
  ],
  liquidationguard: [
    { label: "Request Product Access", intent: "customer", campaign: "liquidationguard-access-cta" },
    { label: "Discuss Distribution", intent: "strategic-partner", campaign: "liquidationguard-distribution-cta" },
    { label: "Explore Risk Infrastructure Partnership", intent: "strategic-partner", campaign: "liquidationguard-risk-partner-cta" }
  ],
  "computational-superstition-rl": [
    { label: "Sponsor the Research", intent: "research-collaborator", campaign: "csrl-sponsor-cta" },
    { label: "Discuss a Grant", intent: "grant-provider", campaign: "csrl-grant-cta" },
    { label: "Collaborate on Experiments", intent: "research-collaborator", campaign: "csrl-collaboration-cta" }
  ]
};

export const defaultPublicCtas = [
  { label: "Start a Conversation", intent: "general", campaign: "site-general-cta" },
  { label: "Discuss a Pilot", intent: "pilot-partner", campaign: "site-pilot-cta" },
  { label: "Sponsor the Research", intent: "research-collaborator", campaign: "site-research-sponsor-cta" }
] as const;

export const leadVentureOptions = publicVentures.map((venture) => ({
  label: venture.name,
  value: venture.slug
}));

export const scoreWeights = {
  investor: {
    thesisFit: 20,
    stageFit: 15,
    chequeSizeFit: 15,
    geographicFit: 8,
    relevantPortfolio: 12,
    warmIntroduction: 10,
    engagement: 10,
    strategicValue: 10
  },
  customer: {
    problemSeverity: 20,
    budget: 15,
    buyingAuthority: 15,
    urgency: 12,
    strategicFit: 12,
    implementationReadiness: 10,
    contractValue: 8,
    caseStudyValue: 8
  },
  partner: {
    distributionReach: 18,
    technicalCompatibility: 16,
    ecosystemRelevance: 14,
    credibility: 12,
    customerAccess: 14,
    capitalAccess: 10,
    implementationEffort: 16
  }
} as const;

export const followUpCadenceDays = [2, 5, 10, 21, 45] as const;
