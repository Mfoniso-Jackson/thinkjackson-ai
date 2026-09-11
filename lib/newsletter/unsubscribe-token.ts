import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * A stateless, HMAC-signed unsubscribe link — no per-subscriber token
 * needs to be generated and stored ahead of time. Anyone holding a valid
 * (email, token) pair proves they received it in an email actually sent to
 * that address, which is exactly the guarantee an unsubscribe link needs.
 */
function secret(): string {
  const value = process.env.NEWSLETTER_UNSUBSCRIBE_SECRET;
  if (!value) throw new Error("NEWSLETTER_UNSUBSCRIBE_SECRET is not configured.");
  return value;
}

export function generateUnsubscribeToken(email: string): string {
  return createHmac("sha256", secret()).update(email.trim().toLowerCase()).digest("hex");
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  try {
    const expected = Buffer.from(generateUnsubscribeToken(email), "hex");
    const provided = Buffer.from(token, "hex");
    return expected.length === provided.length && timingSafeEqual(expected, provided);
  } catch {
    return false;
  }
}
