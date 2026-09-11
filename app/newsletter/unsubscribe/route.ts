import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyUnsubscribeToken } from "@/lib/newsletter/unsubscribe-token";
import { isSupabaseConfigured, supabaseUpdate } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function page(body: string) {
  return new NextResponse(
    `<!doctype html><html><head><meta charset="utf-8"><title>Newsletter — ThinkJackson</title><style>body{background:#0a0a0a;color:#e5e5e5;font-family:system-ui,sans-serif;max-width:32rem;margin:20vh auto;padding:0 1.5rem;line-height:1.6}</style></head><body>${body}</body></html>`,
    { headers: { "content-type": "text/html; charset=utf-8" } }
  );
}

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");
  const token = request.nextUrl.searchParams.get("token");

  if (!email || !token || !verifyUnsubscribeToken(email, token)) {
    return page("<p>This unsubscribe link is invalid or expired.</p>");
  }

  if (!isSupabaseConfigured()) {
    return page("<p>Could not process this request right now. Please email hello@thinkjackson.com.</p>");
  }

  try {
    await supabaseUpdate("newsletter_subscribers", `email=eq.${encodeURIComponent(email)}`, { status: "unsubscribed" });
  } catch {
    return page("<p>Could not process this request right now. Please email hello@thinkjackson.com.</p>");
  }

  return page(`<p>${email} has been unsubscribed from The Intelligence Brief. You won't receive further issues.</p>`);
}
