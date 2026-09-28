export const submissionCategories = ["research", "person", "company", "project", "question", "correction"] as const;
export type SubmissionCategory = (typeof submissionCategories)[number];

export type MapSubmissionInput = {
  category: SubmissionCategory;
  url: string;
  reason: string;
  relationship: string;
  contactEmail?: string;
  website?: string;
};

export type MapSubmissionErrors = Partial<Record<keyof MapSubmissionInput, string>>;

const urlPattern = /^https?:\/\/.+/i;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateMapSubmission(input: MapSubmissionInput) {
  const errors: MapSubmissionErrors = {};

  if (input.website) {
    errors.website = "Spam protection triggered.";
  }

  if (!submissionCategories.includes(input.category)) {
    errors.category = "Select what you're submitting.";
  }

  if (!urlPattern.test(input.url.trim())) {
    errors.url = "Enter a valid http/https URL.";
  }

  if (input.reason.trim().length < 10) {
    errors.reason = "Say a bit more about why this matters.";
  }

  if (input.relationship.trim().length < 2) {
    errors.relationship = "Tell us your relationship to this work.";
  }

  if (input.contactEmail && !emailPattern.test(input.contactEmail.trim())) {
    errors.contactEmail = "Enter a valid email, or leave it blank.";
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors
  };
}
