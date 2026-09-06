import Link from "next/link";
import { resolveRelated } from "@/lib/graph/resolve";
import { relationTypeLabels } from "@/lib/graph/types";
import type { NodeRef } from "@/lib/graph/types";

const NODE_WIDTH = 152;
const LINE_COLOR = "rgba(191, 219, 254, 0.22)";

/**
 * The large-desktop presentation of the same relation data RelatedNodes
 * renders as a card grid: real nodes at fixed positions, connected by plain
 * SVG lines to a center node — no canvas, no client JS, no physics engine.
 * The node count here is always small (single digits), so a deterministic
 * server-computed layout is simpler and more accessible than anything a
 * canvas/WebGL approach would need for the same result: every node is a
 * real, indexable, keyboard-reachable link, not a pixel a screen reader or
 * crawler can't see. RelatedNodes stays the permanent fallback below the
 * "wide" breakpoint, not because this could fail, but because a radial
 * layout only reads well once there's enough width to breathe.
 */
export function RelatedNodesGraph({ nodeRef, centerLabel }: { nodeRef: NodeRef; centerLabel: string }) {
  const related = resolveRelated(nodeRef);
  if (related.length === 0) return null;

  const count = related.length;
  const radius = Math.min(300, 170 + Math.max(0, count - 4) * 18);
  const size = radius * 2 + NODE_WIDTH + 40;
  const center = size / 2;

  const positioned = related.map((item, index) => {
    const angle = (2 * Math.PI * index) / count - Math.PI / 2;
    return {
      ...item,
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle)
    };
  });

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="absolute inset-0" aria-hidden="true">
        {positioned.map((item, index) => (
          <line
            key={index}
            x1={center}
            y1={center}
            x2={item.x}
            y2={item.y}
            stroke={LINE_COLOR}
            strokeWidth={1}
          />
        ))}
      </svg>

      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-lg border border-signal/50 bg-signal/10 px-4 py-3 text-center"
        style={{ left: center, top: center, width: NODE_WIDTH }}
      >
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.06em] text-signal">{centerLabel}</p>
      </div>

      {positioned.map((item) => (
        <Link
          key={`${item.direction}-${item.relationType}-${item.resolved.href}`}
          href={item.resolved.href}
          className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-lg border border-line bg-white/[0.035] px-3 py-2.5 text-center transition hover:border-signal/40 hover:bg-white/[0.06] active:border-signal/50"
          style={{ left: item.x, top: item.y, width: NODE_WIDTH }}
        >
          <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-steel">
            {relationTypeLabels[item.relationType as keyof typeof relationTypeLabels] ?? item.relationType}
          </span>
          <span className="text-xs font-semibold leading-snug text-white">{item.resolved.title}</span>
        </Link>
      ))}
    </div>
  );
}
