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
          background: "#8be9d7",
          border: "2px solid #d7f171",
          color: "#05070b",
          display: "flex",
          fontSize: 14,
          fontWeight: 900,
          height: "100%",
          justifyContent: "center",
          letterSpacing: "-0.04em",
          width: "100%"
        }}
      >
        TJ
      </div>
    ),
    size
  );
}
