import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background:
            "radial-gradient(circle at 14% 10%, rgba(139, 233, 215, 0.22), transparent 36%), radial-gradient(circle at 86% 14%, rgba(215, 241, 113, 0.13), transparent 34%), linear-gradient(135deg, #05070b 0%, #07101a 54%, #05070b 100%)",
          color: "#e7eef7",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
          padding: "72px",
          position: "relative",
          width: "100%"
        }}
      >
        <div
          style={{
            border: "1px solid rgba(191, 219, 254, 0.14)",
            display: "flex",
            height: "100%",
            left: 36,
            position: "absolute",
            top: 36,
            width: 1128
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
          <div style={{ color: "#8be9d7", display: "flex", fontSize: 28, fontWeight: 700 }}>
            thinkjackson
          </div>
          <div style={{ color: "#9fb3c8", display: "flex", fontSize: 22 }}>
            markets / agents / coordination
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 920 }}>
          <div
            style={{
              color: "#d7f171",
              display: "flex",
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "0.12em",
              marginBottom: 30,
              textTransform: "uppercase"
            }}
          >
            Mfoniso Jackson
          </div>
          <div
            style={{
              color: "#ffffff",
              display: "flex",
              fontSize: 72,
              fontWeight: 760,
              letterSpacing: "-0.02em",
              lineHeight: 1.02
            }}
          >
            AI systems for markets, agents, and human coordination.
          </div>
        </div>

        <div
          style={{
            color: "#9fb3c8",
            display: "flex",
            fontSize: 24,
            lineHeight: 1.45,
            maxWidth: 920
          }}
        >
          Financial engineering, reinforcement learning, autonomous agents, AI safety,
          Web3 coordination systems, and portfolio intelligence.
        </div>
      </div>
    ),
    size
  );
}
