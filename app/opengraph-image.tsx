import { ImageResponse } from "next/og";

import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo";
import { loadOgFonts } from "@/components/seo/ogFonts";

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const fonts = await loadOgFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 24,
          padding: "0 96px",
          background: "linear-gradient(135deg, #0b1120 0%, #1f2937 60%, #111827 100%)",
          color: "#ffffff",
          fontFamily: "Nunito",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 34,
            letterSpacing: 8,
            textTransform: "uppercase",
            fontWeight: 800,
            color: "#9ca3af",
          }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 78,
            lineHeight: 1.05,
            fontWeight: 800,
            maxWidth: 940,
          }}
        >
          Search movies &amp; TV shows. Build your watchlist.
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            color: "#9ca3af",
            fontWeight: 400,
            maxWidth: 940,
          }}
        >
          {SITE_DESCRIPTION}
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
