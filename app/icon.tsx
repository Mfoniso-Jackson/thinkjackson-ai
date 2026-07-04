import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#05070b",
          border: "2px solid rgba(139, 233, 215, 0.72)",
          color: "#8be9d7",
          display: "flex",
          fontSize: 11,
          fontWeight: 800,
          height: "100%",
          justifyContent: "center",
          letterSpacing: "0.02em",
          width: "100%"
        }}
      >
        TJ
      </div>
    ),
    size
  );
}
