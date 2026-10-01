import { ImageResponse } from "next/og";

import { loadOgFonts } from "@/components/seo/ogFonts";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const fonts = await loadOgFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #111827 0%, #1f2937 100%)",
          color: "#ffffff",
          fontFamily: "Nunito",
          fontSize: 300,
          fontWeight: 800,
          letterSpacing: -12,
        }}
      >
        M
      </div>
    ),
    { ...size, fonts },
  );
}
