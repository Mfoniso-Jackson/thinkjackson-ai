import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background:
            "radial-gradient(circle at 24% 16%, rgba(139, 233, 215, 0.26), transparent 34%), linear-gradient(135deg, #05070b 0%, #111827 100%)",
          border: "10px solid #8be9d7",
          boxShadow: "inset 0 0 0 4px rgba(215, 241, 113, 0.5)",
          color: "#ffffff",
          display: "flex",
          fontSize: 76,
          fontWeight: 900,
          height: "100%",
          justifyContent: "center",
          letterSpacing: "-0.03em",
          textShadow: "0 0 28px rgba(139, 233, 215, 0.85)",
          width: "100%"
        }}
      >
        TJ
      </div>
    ),
    size
  );
}
