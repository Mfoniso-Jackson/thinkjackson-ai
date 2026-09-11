import "server-only";
import { supabaseRequest } from "@/lib/supabase";
import { generateUnsubscribeToken } from "@/lib/newsletter/unsubscribe-token";

const RESEND_BATCH_URL = "https://api.resend.com/emails/batch";
const MAX_PER_BATCH = 100;

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
  return chunks;
}

function htmlToText(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function unsubscribeUrl(email: string): string {
  const base = process.env.SITE_URL ?? "https://thinkjackson.com";
  const token = generateUnsubscribeToken(email);
  return `${base}/newsletter/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;
}

function buildEmailHtml(bodyHtml: string, email: string): string {
  return `${bodyHtml}<hr style="margin-top:2rem;border:none;border-top:1px solid #333"><p style="font-size:12px;color:#888">You're receiving this because you subscribed at thinkjackson.com. <a href="${unsubscribeUrl(email)}" style="color:#888">Unsubscribe</a>.</p>`;
}

export type NewsletterSendResult = { sent: number; failed: number; recipientCount: number };

/**
 * The whole send path in one function, deliberately minimal: fetch current
 * subscribers, batch them through Resend (100 per request, its own limit),
 * with a per-recipient unsubscribe link stamped into each email — no
 * templates, no scheduling, no send history table. Resend's own dashboard
 * is the record of what was sent; this doesn't duplicate it.
 */
export async function sendNewsletterIssue(input: { subject: string; bodyHtml: string }): Promise<NewsletterSendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.NEWSLETTER_FROM_EMAIL;
  if (!apiKey) throw new Error("RESEND_API_KEY is not configured.");
  if (!from) throw new Error("NEWSLETTER_FROM_EMAIL is not configured.");

  const subscribers = (await supabaseRequest("newsletter_subscribers?select=email&status=eq.subscribed")) as Array<{ email: string }>;
  if (subscribers.length === 0) {
    return { sent: 0, failed: 0, recipientCount: 0 };
  }

  let sent = 0;
  let failed = 0;

  for (const batch of chunk(subscribers, MAX_PER_BATCH)) {
    const payload = batch.map(({ email }) => {
      const html = buildEmailHtml(input.bodyHtml, email);
      return { from, to: email, subject: input.subject, html, text: htmlToText(html) };
    });

    try {
      const response = await fetch(RESEND_BATCH_URL, {
        method: "POST",
        headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        failed += batch.length;
        continue;
      }
      sent += batch.length;
    } catch {
      failed += batch.length;
    }
  }

  return { sent, failed, recipientCount: subscribers.length };
}
