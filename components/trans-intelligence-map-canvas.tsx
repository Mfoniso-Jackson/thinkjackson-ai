"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { ForceGraphMethods, ForceGraphProps, LinkObject, NodeObject } from "react-force-graph-2d";
import type { GraphLink, GraphNode } from "@/lib/graph/map-data";

type FGNode = NodeObject<GraphNode>;
type FGLink = LinkObject<GraphNode, GraphLink>;
type FGMethods = ForceGraphMethods<FGNode, FGLink>;

/**
 * next/dynamic erases the library's generic type parameters (it infers the
 * component type from the module's default export at a single concrete
 * instantiation), so the dynamically-imported component is recast against
 * the library's own exported prop/ref types rather than losing type safety
 * to `any` — everything downstream (node/link shapes, ref methods) stays
 * checked against the real GraphNode/GraphLink types.
 */
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false }) as unknown as (
  props: ForceGraphProps<FGNode, FGLink> & { ref?: React.MutableRefObject<FGMethods | undefined> }
) => React.ReactElement;

const SIGNAL = "#8be9d7";
const VOLT = "#d7f171";
const STEEL = "#9fb3c8";
const LINE_COLOR = "rgba(191, 219, 254, 0.18)";

function colorForType(type: GraphNode["type"]): string {
  if (type === "territory") return SIGNAL;
  if (type === "question" || type === "prediction") return VOLT;
  return STEEL;
}

function radiusForType(type: GraphNode["type"]): number {
  return type === "territory" ? 8 : 4.5;
}

/**
 * A real physics simulation (force-graph, wrapping d3-force) replaces the
 * deterministic clustered-SVG layout this page shipped with first: natural
 * clustering now emerges from link attraction instead of being computed by
 * hand, and pan/zoom/drag come from the library instead of a hand-rolled
 * overflow-scroll container. Loaded via next/dynamic with ssr:false because
 * the underlying library draws to a canvas element that doesn't exist on
 * the server.
 */
export function TransIntelligenceMapCanvas({ nodes, links }: { nodes: GraphNode[]; links: GraphLink[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<FGMethods | undefined>(undefined);
  const [width, setWidth] = useState(800);

  /**
   * force-graph treats a new `graphData` object reference as new data and
   * restarts the whole physics simulation from scratch. `{ nodes, links }`
   * written inline in JSX is a fresh object literal on every render, so any
   * unrelated re-render (the ResizeObserver's setWidth below, for instance)
   * would otherwise reset the simulation before it settles. Memoizing on
   * the stable nodes/links arrays avoids that.
   */
  const graphData = useMemo(() => ({ nodes, links }), [nodes, links]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    // A single mount-time measurement can race the container's actual
    // layout and read 0 with nothing afterward to correct it — a
    // ResizeObserver re-fires whenever the real size settles, not just on
    // window resize, so it catches that first real layout too.
    const observer = new ResizeObserver(([entry]) => {
      const measuredWidth = entry.contentRect.width;
      if (measuredWidth > 0) setWidth(measuredWidth);
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="overflow-hidden rounded-lg border border-line bg-white/[0.02]" style={{ height: 640 }}>
      <ForceGraph2D
        ref={graphRef}
        width={width}
        height={640}
        graphData={graphData}
        nodeId="id"
        nodeLabel="title"
        linkColor={() => LINE_COLOR}
        linkWidth={1}
        backgroundColor="rgba(0,0,0,0)"
        cooldownTicks={120}
        onEngineStop={() => graphRef.current?.zoomToFit(400, 60)}
        nodeCanvasObject={(node, ctx, globalScale) => {
          if (node.x === undefined || node.y === undefined) return;
          const color = colorForType(node.type);
          const radius = radiusForType(node.type);

          ctx.beginPath();
          ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
          ctx.fillStyle = color;
          ctx.fill();

          // Only the 5 territory nodes get an always-on label. At ~40 nodes,
          // labeling every node produced unreadable overlapping text in the
          // densest clusters — everything else relies on the built-in hover
          // tooltip (nodeLabel) instead, which is what most force-directed
          // graph tools do at this density.
          if (node.type === "territory") {
            const fontSize = Math.max(4, 12 / globalScale);
            ctx.font = `600 ${fontSize}px Inter, sans-serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "top";
            ctx.fillStyle = "#ffffff";
            ctx.fillText(node.title, node.x, node.y + radius + 3, 180);
          }
        }}
        onNodeClick={(node) => {
          if (node.href) window.location.href = node.href;
        }}
      />
    </div>
  );
}
