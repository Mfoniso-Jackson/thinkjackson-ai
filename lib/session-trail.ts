const TRAIL_KEY = "tj_session_trail";
const RESEARCH_MODE_KEY = "tj_research_mode";
const MAX_TRAIL_ENTRIES = 8;

/**
 * The depth at which a visitor is treated as a researcher rather than a
 * casual reader, absent an explicit choice — see shouldExpandRelated below.
 */
export const RESEARCH_MODE_DEPTH = 3;

export type VisitedNode = {
  type: string;
  slug: string;
  title: string;
  href: string;
};

export function getSessionTrail(): VisitedNode[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.sessionStorage.getItem(TRAIL_KEY);
    return raw ? (JSON.parse(raw) as VisitedNode[]) : [];
  } catch {
    return [];
  }
}

export function recordSessionVisit(node: VisitedNode): VisitedNode[] {
  if (typeof window === "undefined") return [];
  try {
    const existing = getSessionTrail().filter((item) => !(item.type === node.type && item.slug === node.slug));
    const updated = [...existing, node].slice(-MAX_TRAIL_ENTRIES);
    window.sessionStorage.setItem(TRAIL_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return getSessionTrail();
  }
}

/**
 * null means the visitor has never touched the toggle — callers should fall
 * back to depth-based inference rather than treating null as "off".
 */
export function getExplicitResearchMode(): boolean | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(RESEARCH_MODE_KEY);
    return raw === null ? null : raw === "1";
  } catch {
    return null;
  }
}

export function setExplicitResearchMode(on: boolean) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(RESEARCH_MODE_KEY, on ? "1" : "0");
  } catch {
    // ignore — the toggle just won't persist this session
  }
}

/**
 * An explicit choice always wins over the inferred one, so turning research
 * mode off stays off even after a visitor crosses the depth threshold.
 */
export function shouldExpandRelated(sessionDepth: number): boolean {
  const explicit = getExplicitResearchMode();
  if (explicit !== null) return explicit;
  return sessionDepth >= RESEARCH_MODE_DEPTH;
}

export function applyRelatedExpansion(expand: boolean) {
  if (typeof document === "undefined") return;
  document.querySelectorAll<HTMLDetailsElement>("[data-related-more]").forEach((element) => {
    element.open = expand;
  });
}
