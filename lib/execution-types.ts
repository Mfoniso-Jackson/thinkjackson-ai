import { z } from "zod";

export const missionTypes = ["Research", "Build", "Product", "Growth", "Sales", "Distribution", "Capital", "Operations", "Systems", "Partnerships"] as const;
export const riskTypes = ["Market risk", "Distribution risk", "Product risk", "Technical risk", "Competition risk", "Economic risk", "Regulatory risk", "Execution risk", "Capital risk", "Data risk"] as const;
export const evidenceTypes = ["deployment", "customer_feedback", "revenue", "usage", "research", "content", "partnership", "benchmark", "other"] as const;

export const missionTaskSchema = z.object({
  title: z.string().min(8).max(140),
  description: z.string().min(10).max(500),
  estimatedMinutes: z.number().int().positive().max(480)
});

export const generatedEvidenceSchema = z.object({
  type: z.enum(evidenceTypes),
  description: z.string().min(8).max(300)
});

export const missionSchema = z.object({
  missionTitle: z.string().min(8).max(120),
  desiredOutcome: z.string().min(12).max(500),
  whyItMatters: z.string().min(12).max(500),
  definitionOfDone: z.string().min(12).max(600),
  tasks: z.array(missionTaskSchema).min(1).max(3),
  expectedEvidence: z.array(generatedEvidenceSchema).min(1).max(6),
  missionType: z.enum(missionTypes),
  primaryRisk: z.enum(riskTypes),
  assumptionBeingTested: z.string().min(10).max(500),
  successMetric: z.object({ name: z.string().min(3).max(100), target: z.string().min(2).max(200) }),
  confidenceBefore: z.number().int().min(1).max(10),
  recommendedTimeMinutes: z.number().int().positive().max(480),
  doNotWorkOn: z.array(z.string().min(3).max(160)).min(1).max(8),
  publicBuildAngle: z.string().min(8).max(500),
  endReviewQuestions: z.array(z.string().min(8).max(240)).min(2).max(6),
  reasoningSummary: z.string().min(12).max(500)
});

export const generationInputSchema = z.object({
  projectId: z.string().uuid(),
  availableTimeMinutes: z.number().int().min(30).max(480),
  energy: z.enum(["1", "2", "3", "4", "5"]),
  currentPriority: z.string().max(500).optional().default(""),
  currentBottleneck: z.string().max(500).optional().default(""),
  notes: z.string().max(2000).optional().default("")
});

export type GeneratedMission = z.infer<typeof missionSchema>;
export type GenerationInput = z.infer<typeof generationInputSchema>;

export type ProjectContext = {
  id: string;
  name: string;
  slug: string;
  description: string;
  stage: string;
  targetCustomer: string;
  customerProblem: string;
  valueProposition: string;
  currentPriority: string;
  currentBottleneck: string;
  currentMetrics: string[];
  currentRisks: string[];
  activeMilestones: string[];
  openAssumptions: string[];
  productUrls: string[];
  repositoryUrls: string[];
  contextNotes: string;
  recentMissions?: Array<{ title: string; status: string; completedAt?: string }>;
  recentEvidence?: Array<{ type: string; title: string; metric?: string }>;
};
