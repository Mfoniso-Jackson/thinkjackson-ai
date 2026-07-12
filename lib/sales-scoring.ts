import { scoreWeights } from "@/data/sales-config";
import type { LeadIntent, QualificationBand, SalesLeadInput } from "@/lib/sales-types";

type ScoreResult = {
  total: number;
  band: QualificationBand;
  reasons: string[];
  missingInformation: string[];
  recommendedNextAction: string;
};

function bandForScore(total: number): QualificationBand {
  if (total >= 75) return "A";
  if (total >= 55) return "B";
  if (total >= 35) return "C";
  return "D";
}

function recommendedAction(band: QualificationBand, intent: LeadIntent) {
  if (band === "A") return intent === "investor" ? "Reply within 24 hours and propose a focused diligence call." : "Schedule discovery and define the concrete pilot outcome.";
  if (band === "B") return "Ask for the missing qualification details and keep active follow-up.";
  if (band === "C") return "Nurture with relevant research or product progress before asking for commitment.";
  return "Archive or disqualify unless new strategic context appears.";
}

export function scoreLead(input: SalesLeadInput): ScoreResult {
  const reasons: string[] = [];
  const missingInformation: string[] = [];
  let total = 0;

  if (input.intent === "investor") {
    const weights = scoreWeights.investor;
    if (input.sectorsOfInterest?.toLowerCase().match(/ai|agent|fintech|web3|market|safety/)) {
      total += weights.thesisFit;
      reasons.push("Sector interest overlaps the thinkjackson thesis.");
    } else {
      missingInformation.push("Thesis fit or sectors of interest");
    }
    if (input.investmentStage) total += weights.stageFit;
    else missingInformation.push("Investment stage preference");
    if (input.chequeSize) total += weights.chequeSizeFit;
    else missingInformation.push("Typical cheque size");
    if (input.preferredInvolvement) total += weights.strategicValue;
    else missingInformation.push("Preferred involvement");
  } else if (input.intent === "customer" || input.intent === "pilot-partner" || input.intent === "consulting") {
    const weights = scoreWeights.customer;
    if (input.primaryPainPoint && input.primaryPainPoint.length > 20) {
      total += weights.problemSeverity;
      reasons.push("Problem statement has enough specificity for discovery.");
    } else {
      missingInformation.push("Problem severity");
    }
    if (input.budgetRange) total += weights.budget;
    else missingInformation.push("Budget range");
    if (input.role?.toLowerCase().match(/founder|ceo|cto|head|director|manager|partner/)) total += weights.buyingAuthority;
    else missingInformation.push("Buying authority");
    if (input.urgency || input.preferredTimeline) total += weights.urgency;
    else missingInformation.push("Timeline or urgency");
    if (input.ventureSlug) total += weights.strategicFit;
  } else {
    const weights = scoreWeights.partner;
    if (input.organisation) total += weights.credibility;
    if (input.ventureSlug) total += weights.ecosystemRelevance;
    if (input.message.length > 80) total += weights.technicalCompatibility;
    else missingInformation.push("Specific partnership context");
    if (input.preferredNextStep) total += weights.customerAccess;
    else missingInformation.push("Preferred next step");
  }

  const band = bandForScore(total);

  return {
    total,
    band,
    reasons,
    missingInformation,
    recommendedNextAction: recommendedAction(band, input.intent)
  };
}
