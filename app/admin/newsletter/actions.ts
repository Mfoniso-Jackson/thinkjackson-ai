"use server";

import { requireExecutionOwner } from "@/lib/execution-auth";
import { sendNewsletterIssue, type NewsletterSendResult } from "@/lib/newsletter/send";
import { isSupabaseConfigured, supabaseRequest } from "@/lib/supabase";

export type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

export async function getSubscriberCount(): Promise<number> {
  await requireExecutionOwner();
  if (!isSupabaseConfigured()) return 0;
  try {
    const rows = (await supabaseRequest("newsletter_subscribers?select=id&status=eq.subscribed")) as Array<{ id: string }>;
    return rows.length;
  } catch {
    return 0;
  }
}

/**
 * bodyHtml is trusted input — this action requires the same admin auth as
 * everything else under /admin, and only the founder can reach it. No
 * sanitization is applied beyond what sendNewsletterIssue already does
 * (stamping the unsubscribe footer, deriving a plain-text fallback).
 */
export async function sendNewsletter(subject: string, bodyHtml: string): Promise<ActionResult<NewsletterSendResult>> {
  try {
    await requireExecutionOwner();
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Authentication required." };
  }

  if (!subject.trim() || !bodyHtml.trim()) {
    return { ok: false, error: "Subject and body are both required." };
  }

  try {
    const result = await sendNewsletterIssue({ subject: subject.trim(), bodyHtml });
    return { ok: true, data: result };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : "Could not send the newsletter." };
  }
}
