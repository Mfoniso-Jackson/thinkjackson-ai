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
          background: "#d7f171",
          border: "3px solid #05070b",
          color: "#05070b",
          display: "flex",
          fontSize: 17,
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
