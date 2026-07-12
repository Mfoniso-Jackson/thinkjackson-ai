export type LeadIntent =
  | "investor"
  | "customer"
  | "pilot-partner"
  | "strategic-partner"
  | "grant-provider"
  | "research-collaborator"
  | "media"
  | "consulting"
  | "general";

export type PipelineStage =
  | "identified"
  | "contacted"
  | "responded"
  | "qualified"
  | "discovery-scheduled"
  | "discovery-complete"
  | "demo"
  | "proposal-drafting"
  | "proposal-sent"
  | "negotiation"
  | "verbal-commitment"
  | "won"
  | "lost"
  | "future"
  | "paused"
  | "disqualified";

export type Priority = "low" | "medium" | "high" | "critical";

export type QualificationBand = "A" | "B" | "C" | "D";

export type LeadStatus = "new" | "reviewed" | "converted" | "archived";

export type Lead = {
  id: string;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  email: string;
  organisation?: string;
  role?: string;
  locationOrMarket?: string;
  intent: LeadIntent;
  ventureSlug?: string;
  sourcePage?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  campaign?: string;
  preferredNextStep?: string;
  status: LeadStatus;
  notes?: string;
};

export type Opportunity = {
  id: string;
  leadId: string;
  ventureSlug?: string;
  stage: PipelineStage;
  priority: Priority;
  opportunityType: LeadIntent;
  estimatedValue?: number;
  currency?: string;
  probability?: number;
  expectedCloseDate?: string;
  nextAction?: string;
  nextActionDate?: string;
  owner?: string;
  lastInteractionAt?: string;
  outcomeReason?: string;
};

export type InteractionType =
  | "email"
  | "call"
  | "meeting"
  | "note"
  | "proposal"
  | "demo"
  | "follow-up"
  | "introduction";

export type Interaction = {
  id: string;
  opportunityId: string;
  type: InteractionType;
  occurredAt: string;
  summary: string;
  nextStep?: string;
};

export type ProposalStatus = "draft" | "review" | "sent" | "accepted" | "rejected" | "expired";

export type Proposal = {
  id: string;
  opportunityId: string;
  title: string;
  status: ProposalStatus;
  problem: string;
  proposedSolution: string;
  deliverables: string[];
  commercialModel?: string;
  value?: number;
  currency?: string;
  validUntil?: string;
};

export type FollowUpTask = {
  id: string;
  opportunityId?: string;
  leadId?: string;
  title: string;
  dueDate: string;
  priority: Priority;
  status: "open" | "done" | "deferred";
  context?: string;
};

export type SalesEvidenceAsset = {
  id: string;
  title: string;
  ventureSlug?: string;
  type:
    | "deployed-product"
    | "customer-result"
    | "testimonial"
    | "pilot"
    | "research-paper"
    | "technical-benchmark"
    | "github-release"
    | "partner-statement"
    | "grant"
    | "public-demo"
    | "adoption-metric";
  date: string;
  visibility: "public" | "private";
  sourceUrl?: string;
  verified: boolean;
  summary: string;
  metrics?: string[];
  permissionStatus: "approved" | "pending" | "internal-only";
};

export type SalesLeadInput = {
  fullName: string;
  email: string;
  organisation: string;
  role?: string;
  locationOrMarket?: string;
  intent: LeadIntent;
  ventureSlug?: string;
  message: string;
  preferredNextStep?: string;
  consent: boolean;
  website?: string;
  sourcePage?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  campaign?: string;
  investorType?: string;
  chequeSize?: string;
  investmentStage?: string;
  sectorsOfInterest?: string;
  preferredInvolvement?: string;
  requestInvestorMaterials?: boolean;
  companyType?: string;
  currentWorkflow?: string;
  primaryPainPoint?: string;
  teamSize?: string;
  urgency?: string;
  budgetRange?: string;
  pilotInterest?: string;
  preferredTimeline?: string;
  ecosystemOrProgramme?: string;
  grantCategory?: string;
  fundingRange?: string;
  applicationDeadline?: string;
  institution?: string;
  researchArea?: string;
  collaborationType?: string;
  fundingAvailability?: string;
  publicationOrExperimentInterest?: string;
};
