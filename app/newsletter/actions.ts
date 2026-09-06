"use server";

import { validateNewsletterSignup, type NewsletterSignupInput } from "@/lib/newsletter-form";
import { isSupabaseConfigured, supabaseUpsert } from "@/lib/supabase";

export type NewsletterSignupState = {
  status: "idle" | "success" | "error";
  message: string;
  errors?: Record<string, string>;
};

export async function submitNewsletterSignup(
  _previousState: NewsletterSignupState,
  formData: FormData
): Promise<NewsletterSignupState> {
  const input: NewsletterSignupInput = {
    email: String(formData.get("email") ?? ""),
    website: String(formData.get("website") ?? "")
  };

  const validation = validateNewsletterSignup(input);

  if (!validation.ok) {
    return {
      status: "error",
      message: "Enter a valid email address.",
      errors: Object.fromEntries(Object.entries(validation.errors).map(([key, value]) => [key, value ?? "Invalid value."]))
    };
  }

  if (!isSupabaseConfigured()) {
    return {
      status: "error",
      message: "Signal capture is not configured yet. Please email hello@thinkjackson.com to be added manually."
    };
  }

  const sourcePage = String(formData.get("sourcePage") ?? "/");

  try {
    await supabaseUpsert(
      "newsletter_subscribers",
      { email: input.email, source_page: sourcePage, status: "subscribed" },
      "email"
    );
  } catch {
    return {
      status: "error",
      message: "The signup could not be submitted. Please email hello@thinkjackson.com."
    };
  }

  return {
    status: "success",
    message: "You're on the list. The Intelligence Brief goes out as new research, essays, and questions are ready."
  };
}
