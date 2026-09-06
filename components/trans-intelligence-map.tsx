import Link from "next/link";
import { buildMapData, MAP_NODE_WIDTH } from "@/lib/graph/map-data";
import { refKey } from "@/lib/graph/types";

const LINE_COLOR = "rgba(191, 219, 254, 0.16)";

/**
 * The whole-graph counterpart to RelatedNodesGraph: same plain-SVG,
 * no-canvas, no-client-JS, real-links approach, scaled up to every node in
 * the graph at once via lib/graph/map-data.ts's territory-clustered layout.
 * Wrapped in an overflow-x-auto container rather than a separate mobile
 * layout — the canvas is a fixed size, and scrolling a wide diagram is
 * simpler and more honest than trying to force a graph into a phone width.
 */
export async function TransIntelligenceMap() {
  const { nodes, edges, clusters, canvasSize } = await buildMapData();

  if (nodes.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-line bg-white/[0.02] p-8 text-sm leading-6 text-steel">
        The graph doesn&apos;t have enough connected nodes yet to draw a map.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-line bg-white/[0.02] p-6">
      <div className="relative mx-auto" style={{ width: canvasSize, height: canvasSize }}>
        <svg viewBox={`0 0 ${canvasSize} ${canvasSize}`} width={canvasSize} height={canvasSize} className="absolute inset-0" aria-hidden="true">
          {edges.map((edge, index) => (
            <line key={index} x1={edge.x1} y1={edge.y1} x2={edge.x2} y2={edge.y2} stroke={LINE_COLOR} strokeWidth={1} />
          ))}
        </svg>

        {clusters
          .filter((cluster) => !cluster.isTerritory)
          .map((cluster) => (
            <div
              key={cluster.slug}
              className="absolute -translate-x-1/2 -translate-y-1/2 text-center"
              style={{ left: cluster.x, top: cluster.y, width: MAP_NODE_WIDTH }}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-steel/70">{cluster.label}</span>
            </div>
          ))}

        {nodes.map((node) => {
          const isTerritory = node.ref.type === "territory";
          return (
            <Link
              key={refKey(node.ref)}
              href={node.resolved.href}
              className={
                isTerritory
                  ? "absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-lg border border-signal/50 bg-signal/10 px-4 py-3 text-center transition hover:border-signal active:border-signal"
                  : "absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1 rounded-lg border border-line bg-white/[0.035] px-3 py-2.5 text-center transition hover:border-signal/40 hover:bg-white/[0.06] active:border-signal/50"
              }
              style={{ left: node.x, top: node.y, width: MAP_NODE_WIDTH }}
            >
              <span className={`font-mono text-[9px] uppercase tracking-[0.08em] ${isTerritory ? "text-signal" : "text-steel"}`}>
                {node.resolved.eyebrow}
              </span>
              <span className="text-xs font-semibold leading-snug text-white">{node.resolved.title}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
