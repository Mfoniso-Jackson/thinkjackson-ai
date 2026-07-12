export type InvestorLeadInput = {
  fullName: string;
  email: string;
  organisation: string;
  role: string;
  investorType: string;
  areasOfInterest: string;
  venturesOfInterest: string[];
  chequeRange?: string;
  involvementType: string;
  message: string;
  consent: boolean;
  website?: string;
};

export type InvestorLeadErrors = Partial<Record<keyof InvestorLeadInput, string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateInvestorLead(input: InvestorLeadInput) {
  const errors: InvestorLeadErrors = {};

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

  if (input.investorType.trim().length === 0) {
    errors.investorType = "Select an investor or partner type.";
  }

  if (input.venturesOfInterest.length === 0) {
    errors.venturesOfInterest = "Select at least one venture.";
  }

  if (input.message.trim().length < 20) {
    errors.message = "Add a short note with context.";
  }

  if (!input.consent) {
    errors.consent = "Confirm consent to be contacted about this request.";
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors
  };
}
