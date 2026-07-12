import { terminalStages } from "@/data/sales-config";
import type { LeadIntent, Opportunity, SalesLeadInput } from "@/lib/sales-types";

export type SalesLeadErrors = Partial<Record<keyof SalesLeadInput, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const leadIntents: LeadIntent[] = [
  "investor",
  "customer",
  "pilot-partner",
  "strategic-partner",
  "grant-provider",
  "research-collaborator",
  "media",
  "consulting",
  "general"
];

export function validateSalesLead(input: SalesLeadInput) {
  const errors: SalesLeadErrors = {};

  if (input.website) {
    errors.website = "Spam protection triggered.";
  }

  if (input.fullName.trim().length < 2) {
    errors.fullName = "Enter your full name.";
  }

  if (!emailPattern.test(input.email.trim())) {
    errors.email = "Enter a valid work email.";
  }

  if (input.organisation.trim().length < 2) {
    errors.organisation = "Enter your organisation.";
  }

  if (!leadIntents.includes(input.intent)) {
    errors.intent = "Select an enquiry type.";
  }

  if (input.message.trim().length < 20) {
    errors.message = "Add a concise note with context.";
  }

  if (!input.consent) {
    errors.consent = "Confirm consent to be contacted about this request.";
  }

  if (input.intent === "investor" && !input.investorType?.trim()) {
    errors.investorType = "Select the investor type.";
  }

  if ((input.intent === "customer" || input.intent === "pilot-partner") && !input.primaryPainPoint?.trim()) {
    errors.primaryPainPoint = "Add the primary pain point or workflow gap.";
  }

  if (input.intent === "grant-provider" && !input.ecosystemOrProgramme?.trim()) {
    errors.ecosystemOrProgramme = "Add the grant programme or ecosystem.";
  }

  if (input.intent === "research-collaborator" && !input.researchArea?.trim()) {
    errors.researchArea = "Add the research area.";
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors
  };
}

export function validateOpportunityNextAction(opportunity: Opportunity) {
  if (terminalStages.includes(opportunity.stage)) {
    return { ok: true, error: undefined };
  }

  if (!opportunity.nextAction?.trim() || !opportunity.nextActionDate?.trim()) {
    return {
      ok: false,
      error: "Active opportunities require a next action and next action date."
    };
  }

  return { ok: true, error: undefined };
}
