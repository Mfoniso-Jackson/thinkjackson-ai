"use server";

import { validateInvestorLead, type InvestorLeadInput } from "@/lib/investor-form";

export type InvestorLeadState = {
  status: "idle" | "success" | "error";
  message: string;
  errors?: Record<string, string>;
};

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

  const webhookUrl = process.env.INVESTOR_LEAD_WEBHOOK_URL;

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
      ...(process.env.INVESTOR_LEAD_WEBHOOK_SECRET
        ? { authorization: `Bearer ${process.env.INVESTOR_LEAD_WEBHOOK_SECRET}` }
        : {})
    },
    body: JSON.stringify({
      ...input,
      sourcePage: "/investors",
      submittedAt: new Date().toISOString(),
      status: "new"
    })
  });

  if (!response.ok) {
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
