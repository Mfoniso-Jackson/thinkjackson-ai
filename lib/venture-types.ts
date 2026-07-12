export type VentureStage =
  | "research"
  | "prototype"
  | "mvp"
  | "pilot-ready"
  | "live"
  | "revenue"
  | "paused";

export type CapitalObjective =
  | "not-raising"
  | "angel"
  | "pre-seed"
  | "seed"
  | "grant"
  | "pilot-partners"
  | "strategic-partners"
  | "research-sponsors";

export type EvidenceItem = {
  label: string;
  description: string;
  url?: string;
  verified: boolean;
  date?: string;
};

export type Venture = {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  problem: string;
  solution: string;
  targetCustomer: string;
  currentAlternative: string;
  investmentThesis: string;
  stage: VentureStage;
  statusLabel: string;
  businessModel: readonly string[];
  differentiation: readonly string[];
  marketEntry: string;
  defensibility: readonly string[];
  milestones: readonly string[];
  evidence: readonly EvidenceItem[];
  capitalObjectives: readonly CapitalObjective[];
  currentAsk: string;
  useOfFunds: readonly string[];
  nextMilestone: string;
  risks: readonly string[];
  founderAdvantage: string;
  websiteUrl?: string;
  repositoryUrl?: string;
  demoUrl?: string;
  featured: boolean;
  flagship: boolean;
  public: boolean;
};
