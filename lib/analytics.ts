"use client";

import { track } from "@vercel/analytics";

export type AnalyticsEvent =
  | "investor_brief_viewed"
  | "flagship_venture_viewed"
  | "venture_page_viewed"
  | "investor_cta_clicked"
  | "investor_form_started"
  | "investor_form_submitted"
  | "scheduling_link_clicked"
  | "deck_request_submitted"
  | "outbound_repository_clicked";

export function trackEvent(event: AnalyticsEvent, properties?: Record<string, string>) {
  track(event, properties);
}
