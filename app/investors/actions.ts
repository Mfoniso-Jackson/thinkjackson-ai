"use server";

import { validateInvestorLead, type InvestorLeadInput } from "@/lib/investor-form";
import { insertSalesLead } from "@/lib/sales-store";
import type { SalesLeadInput } from "@/lib/sales-types";
import { isSupabaseConfigured } from "@/lib/supabase";

export type InvestorLeadState = {
  status: "idle" | "success" | "error";
  message: string;
  errors?: Record<string, string>;
};

/**
 * The investor form is a specialised entry point into the same sales_leads
 * pipeline the general contact form uses — the table's `intent` column and
 * scoreLead's investor-specific scoring already exist for exactly this.
 */
function toSalesLeadInput(input: InvestorLeadInput): SalesLeadInput {
  return {
    fullName: input.fullName,
    email: input.email,
    organisation: input.organisation,
    role: input.role,
    intent: "investor",
    ventureSlug: input.venturesOfInterest.join(", "),
    message: input.message,
    preferredNextStep: input.involvementType,
    consent: input.consent,
    website: input.website,
    sourcePage: "/investors",
    investorType: input.investorType,
    chequeSize: input.chequeRange,
    sectorsOfInterest: input.areasOfInterest,
    preferredInvolvement: input.involvementType,
    requestInvestorMaterials: true
  };
}

export async function submitInvestorLead(_previousState: InvestorLeadState, formData: FormData): Promise<InvestorLeadState> {
  const venturesOfInterest = formData.getAll("venturesOfInterest").map(String);
  const input: InvestorLeadInput = {
    fullName: String(formData.get("fullName") ?? ""),
    email: String(formData.get("email") ?? ""),
    organisation: String(formData.get("organisation") ?? ""),
    role: String(formData.get("role") ?? ""),
    investorType: String(formData.get("investorType") ?? ""),
    areasOfInterest: String(formData.get("areasOfInterest") ?? ""),
    venturesOfInterest,
    chequeRange: String(formData.get("chequeRange") ?? ""),
    involvementType: String(formData.get("involvementType") ?? ""),
    message: String(formData.get("message") ?? ""),
    consent: formData.get("consent") === "on",
    website: String(formData.get("website") ?? "")
  };

  const validation = validateInvestorLead(input);

  if (!validation.ok) {
    return {
      status: "error",
      message: "Please correct the highlighted fields.",
      errors: Object.fromEntries(Object.entries(validation.errors).map(([key, value]) => [key, value ?? "Invalid value."]))
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      status: "error",
      message:
        "Secure lead storage is not configured yet. Please email hello@thinkjackson.com with this request and include the same context."
    };
  }

  try {
    await insertSalesLead(toSalesLeadInput(input));
  } catch {
    return {
      status: "error",
      message:
        "The request could not be submitted. Please email hello@thinkjackson.com and mention investor materials."
    };
  }

  return {
    status: "success",
    message:
      "Request received. The next step is a qualified conversation before any confidential material is shared."
  };
}
