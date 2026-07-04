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
            "radial-gradient(circle at 28% 18%, rgba(215, 241, 113, 0.55), transparent 38%), linear-gradient(135deg, #8be9d7 0%, #5fd8c5 100%)",
          color: "#05070b",
          display: "flex",
          fontSize: 70,
          fontWeight: 900,
          height: "100%",
          justifyContent: "center",
          letterSpacing: "-0.05em",
          width: "100%"
        }}
      >
        TJ
      </div>
    ),
    size
  );
}
