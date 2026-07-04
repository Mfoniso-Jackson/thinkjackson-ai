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
            "radial-gradient(circle at 30% 20%, rgba(139, 233, 215, 0.28), transparent 42%), linear-gradient(135deg, #05070b 0%, #0f1722 100%)",
          color: "#8be9d7",
          display: "flex",
          fontSize: 58,
          fontWeight: 800,
          height: "100%",
          justifyContent: "center",
          letterSpacing: "0.01em",
          width: "100%"
        }}
      >
        TJ
      </div>
    ),
    size
  );
}
