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
          border: "2px solid #8be9d7",
          boxShadow: "inset 0 0 0 1px rgba(215, 241, 113, 0.45)",
          color: "#ffffff",
          display: "flex",
          fontSize: 15,
          fontWeight: 900,
          height: "100%",
          justifyContent: "center",
          letterSpacing: "-0.03em",
          textShadow: "0 0 10px rgba(139, 233, 215, 0.65)",
          width: "100%"
        }}
      >
        TJ
      </div>
    ),
    size
  );
}
