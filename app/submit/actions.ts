"use server";

import { validateMapSubmission, type MapSubmissionInput } from "@/lib/submission-form";
import { discoverFromUrl } from "@/lib/agents/discovery-pipeline";
import { checkAndIncrementRateLimit, getClientIpHash } from "@/lib/rate-limit";
import { isSupabaseConfigured } from "@/lib/supabase";

export type MapSubmissionState = {
  status: "idle" | "success" | "error";
  message: string;
  errors?: Record<string, string>;
};

/**
 * The first public surface that can trigger the real AI pipeline — everything
 * before this was admin- or cron-gated. Rate-limited per IP (5/day) on top of
 * the honeypot check; the pipeline itself still runs Scout -> Researcher ->
 * Librarian and still requires the same human Approve as every other
 * candidate, so nothing here writes to the public graph unreviewed.
 */
const MAX_SUBMISSIONS_PER_IP_PER_DAY = 5;

export async function submitToMap(_previousState: MapSubmissionState, formData: FormData): Promise<MapSubmissionState> {
  const input: MapSubmissionInput = {
    category: String(formData.get("category") ?? "") as MapSubmissionInput["category"],
    url: String(formData.get("url") ?? ""),
    reason: String(formData.get("reason") ?? ""),
    relationship: String(formData.get("relationship") ?? ""),
    contactEmail: String(formData.get("contactEmail") ?? ""),
    website: String(formData.get("website") ?? "")
  };

  const validation = validateMapSubmission(input);
  if (!validation.ok) {
    return {
      status: "error",
      message: "Check the fields below.",
      errors: Object.fromEntries(Object.entries(validation.errors).map(([key, value]) => [key, value ?? "Invalid value."]))
    };
  }

  if (!isSupabaseConfigured()) {
    return { status: "error", message: "Submissions aren't configured yet. Please email hello@thinkjackson.com." };
  }

  const ipHash = await getClientIpHash();
  const allowed = await checkAndIncrementRateLimit(`submission:${ipHash}`, MAX_SUBMISSIONS_PER_IP_PER_DAY);
  if (!allowed) {
    return { status: "error", message: "You've hit today's submission limit. Try again tomorrow." };
  }

  const outcome = await discoverFromUrl(input.url.trim(), "submitted", {
    reason: input.reason.trim(),
    relationship: input.relationship.trim(),
    contactEmail: input.contactEmail?.trim() || undefined
  });

  if (!outcome.ok) {
    // outcome.error can be a raw internal pipeline message (e.g. "Scout gave
    // this a low importance score...") — useful in the admin queue, not to a
    // public submitter. Only the two pre-pipeline validation errors (bad URL,
    // already discovered) are worth surfacing verbatim; anything else gets a
    // friendly, non-revealing message instead.
    const userFacingErrors = ["Enter a valid http/https URL.", "This URL has already been discovered. Check the candidates list below."];
    const message = userFacingErrors.includes(outcome.error)
      ? outcome.error
      : "Thanks for the submission — after review it didn't meet the bar to move forward automatically. If you think that's wrong, email hello@thinkjackson.com.";
    return { status: "error", message };
  }

  return {
    status: "success",
    message: "Thanks — this is now in front of a human for review. If it holds up, it'll join the public map."
  };
}
