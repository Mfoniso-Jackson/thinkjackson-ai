"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { timelineEvents } from "@/data/evidence";

const STORAGE_KEY = "tj_last_visit";
const MAX_ITEMS = 3;

/**
 * Renders nothing during SSR and on a first-ever visit — the full thesis
 * stays exactly as written for a first-time reader. On a return visit it
 * adds a short "since you were last here" pointer above the fold, built
 * from data/evidence.ts's real timeline, and never invents content: if
 * nothing has shipped since last time, it stays silent.
 */
export function ReturningVisitorNote() {
  const [recent, setRecent] = useState<(typeof timelineEvents)[number][]>([]);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
      window.localStorage.setItem(STORAGE_KEY, new Date().toISOString());
    } catch {
      return;
    }

    if (!stored) return;

    const lastVisit = Date.parse(stored);
    if (Number.isNaN(lastVisit)) return;

    const updates = timelineEvents.filter((event) => Date.parse(event.date) > lastVisit).slice(0, MAX_ITEMS);
    if (updates.length > 0) {
      setRecent(updates);
    }
  }, []);

  if (recent.length === 0) return null;

  return (
    <div className="mb-8 rounded-lg border border-signal/25 bg-signal/[0.06] p-5">
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-signal">Welcome back — new since your last visit</p>
      <ul className="mt-3 space-y-2">
        {recent.map((event) => (
          <li key={event.title}>
            <Link
              href={event.href ?? "/timeline"}
              target={event.href?.startsWith("http") ? "_blank" : undefined}
              rel={event.href?.startsWith("http") ? "noreferrer" : undefined}
              className="text-sm font-medium text-white hover:text-signal active:text-signal"
            >
              {event.title}
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/timeline" className="mt-3 inline-flex text-xs font-semibold text-signal hover:text-white active:text-white">
        View the full timeline
      </Link>
    </div>
  );
}
