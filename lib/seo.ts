export const SITE_NAME = "MovieMania";
export const SITE_TITLE = "MovieMania — Search movies & TV shows, build your watchlist";
export const SITE_DESCRIPTION =
  "Search millions of movies and TV shows, check ratings and trailers, and build playlists to share with friends.";
export const DEFAULT_TITLE_TEMPLATE = "%s | MovieMania";
export const TWITTER_HANDLE = "@moviemania";

export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.VERCEL_URL ||
    "http://localhost:3000";

  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return withProtocol.replace(/\/+$/, "");
}

export function absoluteUrl(path = "/"): string {
  const base = getSiteUrl();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized === "/" ? "/" : normalized}`;
}

export const DEFAULT_OG_IMAGE = {
  url: absoluteUrl("/opengraph-image"),
  width: 1200,
  height: 630,
};

export const INDEXABLE_ROBOTS = {
  index: true as const,
  follow: true as const,
  googleBot: {
    index: true as const,
    follow: true as const,
    "max-image-preview": "large" as const,
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

export const NOINDEX_ROBOTS = { index: false as const, follow: false as const };

export function buildJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
