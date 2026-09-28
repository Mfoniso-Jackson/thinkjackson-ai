import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { isSupabaseConfigured, supabaseRequest, supabaseUpsert } from "@/lib/supabase";

/** Never store a raw IP — just enough to rate-limit by, not to identify anyone later. */
export function hashIp(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 24);
}

export async function getClientIpHash(): Promise<string> {
  const headerStore = await headers();
  const forwarded = headerStore.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || headerStore.get("x-real-ip") || "unknown";
  return hashIp(ip);
}

/**
 * A soft, day-bucketed limit — read-then-write, not a single atomic
 * increment, since this deters casual abuse rather than guaranteeing an
 * exact ceiling under a race. Good enough for the first public surfaces
 * that can trigger AI cost; revisit only if real abuse shows up.
 */
export async function checkAndIncrementRateLimit(key: string, maxPerDay: number): Promise<boolean> {
  if (!isSupabaseConfigured()) return true;
  const today = new Date().toISOString().slice(0, 10);
  const bucket = `${key}:${today}`;

  try {
    const rows = (await supabaseRequest(`rate_limits?bucket=eq.${bucket}&select=count`)) as Array<{ count: number }>;
    const count = rows[0]?.count ?? 0;
    if (count >= maxPerDay) return false;
    await supabaseUpsert("rate_limits", { bucket, count: count + 1, updated_at: new Date().toISOString() }, "bucket");
    return true;
  } catch {
    return true;
  }
}
