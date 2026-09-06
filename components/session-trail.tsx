"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  applyRelatedExpansion,
  getExplicitResearchMode,
  recordSessionVisit,
  setExplicitResearchMode,
  shouldExpandRelated,
  type VisitedNode
} from "@/lib/session-trail";

/**
 * Mounted once on every idea/person/venture detail page. It records the
 * current page as visited this session, shows where else the visitor has
 * been, and decides whether the related-connections panel on this page
 * should start expanded — either because they've gone deep (3+ nodes this
 * session) or because they've explicitly turned research mode on. An
 * explicit choice always overrides the inferred one.
 */
export function SessionTrail({ node }: { node: VisitedNode }) {
  const [trail, setTrail] = useState<VisitedNode[]>([]);
  const [researchMode, setResearchMode] = useState<boolean | null>(null);

  useEffect(() => {
    const updated = recordSessionVisit(node);
    setTrail(updated);
    setResearchMode(getExplicitResearchMode());
    applyRelatedExpansion(shouldExpandRelated(updated.length));
    // node identity only — this should run once per page visit, not on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node.type, node.slug]);

  function toggleResearchMode() {
    const next = !(researchMode ?? false);
    setExplicitResearchMode(next);
    setResearchMode(next);
    applyRelatedExpansion(next);
  }

  const previous = trail.filter((item) => !(item.type === node.type && item.slug === node.slug));

  if (previous.length === 0 && researchMode === null) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
      {previous.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2 text-xs text-steel">
          <span className="font-mono uppercase tracking-[0.16em] text-steel/70">This session</span>
          {previous.map((item) => (
            <Link
              key={`${item.type}-${item.slug}`}
              href={item.href}
              className="rounded-md border border-line bg-white/5 px-2.5 py-1 text-steel transition hover:border-signal/40 hover:text-white active:border-signal/50 active:text-white"
            >
              {item.title}
            </Link>
          ))}
        </div>
      ) : (
        <span />
      )}
      <button
        type="button"
        onClick={toggleResearchMode}
        aria-pressed={researchMode ?? false}
        className="rounded-md border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-steel transition hover:border-signal/40 hover:text-white active:border-signal/50"
      >
        Research mode: {researchMode ? "On" : "Off"}
      </button>
    </div>
  );
}
