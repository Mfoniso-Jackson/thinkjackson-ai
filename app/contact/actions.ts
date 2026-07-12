"use server";

import { scoreLead } from "@/lib/sales-scoring";
import type { LeadIntent, SalesLeadInput } from "@/lib/sales-types";
import { validateSalesLead } from "@/lib/sales-validation";

export type SalesLeadState = {
  status: "idle" | "success" | "error";
  message: string;
  errors?: Record<string, string>;
};

const rateLimitWindowMs = 60_000;
const maxSubmissionsPerWindow = 5;
const submissionBuckets = new Map<string, { count: number; resetAt: number }>();

function stringValue(formData: FormData, key: keyof SalesLeadInput) {
  return String(formData.get(key) ?? "").trim();
}

function booleanValue(formData: FormData, key: keyof SalesLeadInput) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

function isRateLimited(email: string, sourcePage?: string) {
  const key = `${email.toLowerCase().trim()}:${sourcePage ?? "unknown"}`;
  const now = Date.now();
  const bucket = submissionBuckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    submissionBuckets.set(key, { count: 1, resetAt: now + rateLimitWindowMs });
    return false;
  }

  bucket.count += 1;
  return bucket.count > maxSubmissionsPerWindow;
}

export async function submitSalesLead(_previousState: SalesLeadState, formData: FormData): Promise<SalesLeadState> {
  const input: SalesLeadInput = {
    fullName: stringValue(formData, "fullName"),
    email: stringValue(formData, "email"),
    organisation: stringValue(formData, "organisation"),
    role: stringValue(formData, "role"),
    locationOrMarket: stringValue(formData, "locationOrMarket"),
    intent: stringValue(formData, "intent") as LeadIntent,
    ventureSlug: stringValue(formData, "ventureSlug"),
    message: stringValue(formData, "message"),
    preferredNextStep: stringValue(formData, "preferredNextStep"),
    consent: booleanValue(formData, "consent"),
    website: stringValue(formData, "website"),
    sourcePage: stringValue(formData, "sourcePage"),
    referrer: stringValue(formData, "referrer"),
    utmSource: stringValue(formData, "utmSource"),
    utmMedium: stringValue(formData, "utmMedium"),
    utmCampaign: stringValue(formData, "utmCampaign"),
    campaign: stringValue(formData, "campaign"),
    investorType: stringValue(formData, "investorType"),
    chequeSize: stringValue(formData, "chequeSize"),
    investmentStage: stringValue(formData, "investmentStage"),
    sectorsOfInterest: stringValue(formData, "sectorsOfInterest"),
    preferredInvolvement: stringValue(formData, "preferredInvolvement"),
    requestInvestorMaterials: booleanValue(formData, "requestInvestorMaterials"),
    companyType: stringValue(formData, "companyType"),
    currentWorkflow: stringValue(formData, "currentWorkflow"),
    primaryPainPoint: stringValue(formData, "primaryPainPoint"),
    teamSize: stringValue(formData, "teamSize"),
    urgency: stringValue(formData, "urgency"),
    budgetRange: stringValue(formData, "budgetRange"),
    pilotInterest: stringValue(formData, "pilotInterest"),
    preferredTimeline: stringValue(formData, "preferredTimeline"),
    ecosystemOrProgramme: stringValue(formData, "ecosystemOrProgramme"),
    grantCategory: stringValue(formData, "grantCategory"),
    fundingRange: stringValue(formData, "fundingRange"),
    applicationDeadline: stringValue(formData, "applicationDeadline"),
    institution: stringValue(formData, "institution"),
    researchArea: stringValue(formData, "researchArea"),
    collaborationType: stringValue(formData, "collaborationType"),
    fundingAvailability: stringValue(formData, "fundingAvailability"),
    publicationOrExperimentInterest: stringValue(formData, "publicationOrExperimentInterest")
  };

  const validation = validateSalesLead(input);

  if (!validation.ok) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      errors: Object.fromEntries(Object.entries(validation.errors).map(([key, value]) => [key, value ?? "Invalid value."]))
    };
  }

  if (isRateLimited(input.email, input.sourcePage)) {
    return {
      status: "error",
      message: "Too many submissions in a short window. Please email hello@thinkjackson.com if this is urgent."
    };
  }

  const webhookUrl = process.env.SALES_LEAD_WEBHOOK_URL ?? process.env.INVESTOR_LEAD_WEBHOOK_URL;

  if (!webhookUrl) {
    return {
      status: "error",
      message:
        "Secure lead storage is not configured yet. Please email hello@thinkjackson.com with this request and include the same context."
    };
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(process.env.SALES_LEAD_WEBHOOK_SECRET
        ? { authorization: `Bearer ${process.env.SALES_LEAD_WEBHOOK_SECRET}` }
        : process.env.INVESTOR_LEAD_WEBHOOK_SECRET
          ? { authorization: `Bearer ${process.env.INVESTOR_LEAD_WEBHOOK_SECRET}` }
          : {})
    },
    body: JSON.stringify({
      ...input,
      qualification: scoreLead(input),
      submittedAt: new Date().toISOString(),
      status: "new"
    })
  });

  if (!response.ok) {
    return {
      status: "error",
      message: "The request could not be submitted. Please email hello@thinkjackson.com with the same context."
    };
  }

  return {
    status: "success",
    message: "Request received. The next step is a qualified conversation with the right context preserved."
  };
}
