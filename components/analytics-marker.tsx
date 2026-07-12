"use client";

import { useEffect } from "react";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

export function AnalyticsMarker({
  event,
  properties
}: {
  event: AnalyticsEvent;
  properties?: Record<string, string>;
}) {
  useEffect(() => {
    trackEvent(event, properties);
  }, [event, properties]);

  return null;
}
