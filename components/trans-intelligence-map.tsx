import { buildGraphStructure } from "@/lib/graph/map-data";
import { TransIntelligenceMapCanvas } from "@/components/trans-intelligence-map-canvas";

/**
 * Server-side: resolve the real graph (static + agent-published) into plain
 * serializable nodes/links. The interactive rendering — physics layout,
 * pan/zoom/drag, click-to-navigate — all happens client-side in
 * TransIntelligenceMapCanvas, since a force simulation needs a canvas
 * element and browser APIs the server doesn't have.
 */
export async function TransIntelligenceMap() {
  const { nodes, links } = await buildGraphStructure();

  if (nodes.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-line bg-white/[0.02] p-8 text-sm leading-6 text-steel">
        The graph doesn&apos;t have enough connected nodes yet to draw a map.
      </div>
    );
  }

  return <TransIntelligenceMapCanvas nodes={nodes} links={links} />;
}
