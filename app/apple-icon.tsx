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
            "radial-gradient(circle at 28% 18%, rgba(139, 233, 215, 0.55), transparent 34%), linear-gradient(135deg, #d7f171 0%, #8be9d7 100%)",
          border: "14px solid #05070b",
          color: "#05070b",
          display: "flex",
          fontSize: 82,
          fontWeight: 900,
          height: "100%",
          justifyContent: "center",
          letterSpacing: "-0.06em",
          width: "100%"
        }}
      >
        TJ
      </div>
    ),
    size
  );
}
