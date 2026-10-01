import { ImageResponse } from "next/og";

import { getDetail, type MediaType } from "@/lib/detail";
import { SITE_NAME } from "@/lib/seo";
import { loadOgFonts } from "./ogFonts";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

export function detailImageAlt(mediaType: MediaType, title?: string) {
  return title ? `${title} — ${SITE_NAME}` : SITE_NAME;
}

export async function renderDetailOg(mediaType: MediaType, rawId: string) {
  const fonts = await loadOgFonts();

  const id = Number(rawId);
  const detail = Number.isInteger(id) && id > 0 ? await getDetail(mediaType, id) : null;

  const title = detail?.title || detail?.name || SITE_NAME;
  const date = detail?.release_date || detail?.first_air_date || "";
  const year = date ? date.slice(0, 4) : "";
  const rating =
    typeof detail?.vote_average === "number" && detail.vote_average > 0
      ? detail.vote_average.toFixed(1)
      : null;
  const poster = detail?.poster_path
    ? `https://image.tmdb.org/t/p/w500${detail.poster_path}`
    : null;

  const meta = [year, rating ? `${rating}/10` : null].filter(Boolean).join("   ·   ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          background: "linear-gradient(135deg, #0b1120 0%, #1f2937 55%, #111827 100%)",
          color: "#ffffff",
          fontFamily: "Nunito",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            flexGrow: 1,
            padding: "0 64px",
            gap: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 26,
              letterSpacing: 6,
              color: "#9ca3af",
              textTransform: "uppercase",
              fontWeight: 800,
            }}
          >
            {mediaType === "tv" ? "TV Series" : "Movie"} · {SITE_NAME}
          </div>

          <div
            style={{
              display: "flex",
              fontSize: title.length > 34 ? 62 : 76,
              lineHeight: 1.05,
              fontWeight: 800,
              color: "#ffffff",
            }}
          >
            {title}
          </div>

          {meta ? (
            <div
              style={{
                display: "flex",
                fontSize: 34,
                fontWeight: 800,
                color: "#fbbf24",
              }}
            >
              {meta}
            </div>
          ) : null}

          <div
            style={{
              display: "flex",
              fontSize: 26,
              color: "#9ca3af",
              fontWeight: 400,
            }}
          >
            Search, rate and share — {SITE_NAME}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            paddingRight: 72,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 300,
              height: 450,
              borderRadius: 24,
              overflow: "hidden",
              border: "4px solid rgba(255,255,255,0.15)",
              boxShadow: "0 30px 60px rgba(0,0,0,0.55)",
              background: "#374151",
            }}
          >
            {poster ? (
              <img
                src={poster}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 140,
                  fontWeight: 800,
                  color: "#6b7280",
                }}
              >
                M
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
