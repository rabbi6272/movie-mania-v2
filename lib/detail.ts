import { cache } from "react";
import { notFound } from "next/navigation";

import { getMovieDetailsCached, getTVDetailsCached } from "@/api/tmdb";
import { getPopularList } from "@/lib/popular";
import { INDEXABLE_ROBOTS, SITE_NAME, SITE_DESCRIPTION, absoluteUrl } from "@/lib/seo";

export type MediaType = "movie" | "tv";

export const POPULAR_DETAIL_LIMIT = 50;

export function parseId(raw: string | undefined): number {
  const id = Number(raw);
  if (!raw || !Number.isInteger(id) || id <= 0) notFound();
  return id;
}

export const getDetail = cache(async (mediaType: MediaType, id: number) => {
  try {
    const detail =
      mediaType === "tv" ? await getTVDetailsCached(id) : await getMovieDetailsCached(id);
    if (!detail || !detail.id) notFound();
    return detail;
  } catch (error: any) {
    if (error?.status === 404) notFound();
    console.error(`[detail] ${mediaType}/${id} fetch failed:`, error);
    return null;
  }
});

export async function getPopularDetailParams(mediaType: MediaType) {
  const items = await getPopularList(mediaType, POPULAR_DETAIL_LIMIT);
  return items.map((item) => ({ id: String(item.id) }));
}

export function getDetailTitle(mediaType: MediaType, detail: any): string {
  const name = detail?.title || detail?.name;
  if (!name) return mediaType === "tv" ? "TV series" : "Movie";
  const raw = detail?.release_date || detail?.first_air_date;
  const year = typeof raw === "string" && raw.length >= 4 ? raw.slice(0, 4) : null;
  return year ? `${name} (${year})` : name;
}

export function getDetailDescription(detail: any): string {
  const overview = typeof detail?.overview === "string" ? detail.overview.trim() : "";
  if (overview) return overview.slice(0, 300).trimEnd();
  return SITE_DESCRIPTION;
}

export function buildDetailMetadata(mediaType: MediaType, detail: any, id: number) {
  const title = getDetailTitle(mediaType, detail);
  const description = getDetailDescription(detail);
  const path = `/${mediaType}/${id}`;

  const video =
    detail?.videos?.results?.find?.(
      (v: any) => v.type === "Trailer" && v.site === "YouTube",
    ) || null;

  // og:image / twitter:image are injected automatically by the
  // `opengraph-image.tsx` file convention in this route segment.
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(path) },
    robots: INDEXABLE_ROBOTS,
    openGraph: {
      type: (mediaType === "tv" ? "video.tv_show" : "video.movie") as
        | "video.movie"
        | "video.tv_show",
      url: absoluteUrl(path),
      siteName: SITE_NAME,
      locale: "en_US",
      title,
      description,
      releaseDate: detail?.release_date || detail?.first_air_date || undefined,
      ...(video ? { videos: [`https://www.youtube.com/watch?v=${video.key}`] } : {}),
    },
    twitter: {
      card: "summary_large_image" as const,
      title,
      description,
    },
  };
}

export function buildDetailJsonLd(mediaType: MediaType, detail: any, id: number) {
  const name = detail?.title || detail?.name || "";
  const url = absoluteUrl(`/${mediaType}/${id}`);
  const poster = detail?.poster_path
    ? `https://image.tmdb.org/t/p/w500${detail.poster_path}`
    : undefined;
  const genres = Array.isArray(detail?.genres)
    ? detail.genres.map((g: any) => g.name).filter(Boolean)
    : [];

  const shared = {
    "@context": "https://schema.org",
    "@type": mediaType === "tv" ? "TVSeries" : "Movie",
    "@id": url,
    name,
    url,
    description: detail?.overview || SITE_DESCRIPTION,
    ...(poster ? { image: poster, thumbnailUrl: poster } : {}),
    ...(genres.length ? { genre: genres } : {}),
    inLanguage: detail?.original_language || "en",
    datePublished: detail?.release_date || detail?.first_air_date || undefined,
    ...(detail?.tagline ? { slogan: detail.tagline } : {}),
    ...(typeof detail?.vote_average === "number" && detail.vote_count > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: Number(detail.vote_average.toFixed(1)),
            bestRating: 10,
            worstRating: 0,
            ratingCount: detail.vote_count,
          },
        }
      : {}),
    ...(detail?.runtime || detail?.episode_run_time?.length
      ? {
          duration: `PT${detail.runtime || detail.episode_run_time[0]}M`,
        }
      : {}),
    ...(detail?.production_companies?.length
      ? {
          productionCompany: detail.production_companies
            .filter((c: any) => c?.name)
            .map((c: any) => ({ "@type": "Organization", name: c.name })),
        }
      : {}),
    ...(detail?.external_ids?.imdb_id
      ? { sameAs: `https://www.imdb.com/title/${detail.external_ids.imdb_id}/` }
      : {}),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: absoluteUrl("/") },
      {
        "@type": "ListItem",
        position: 2,
        name: mediaType === "tv" ? "TV Shows" : "Movies",
        item: absoluteUrl(`/${mediaType === "tv" ? "tv" : "movie"}`),
      },
      { "@type": "ListItem", position: 3, name, item: url },
    ],
  };

  return [shared, breadcrumb];
}
