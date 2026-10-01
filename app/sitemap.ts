import type { MetadataRoute } from "next";

import { getPopularList } from "@/lib/popular";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 1800;

function toDate(value?: string, fallback = new Date()): Date {
  if (!value) return fallback;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const [popularMovies, popularTV] = await Promise.all([
    getPopularList("movie"),
    getPopularList("tv"),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl("/search"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  const movieEntries: MetadataRoute.Sitemap = popularMovies.map((item) => ({
    url: absoluteUrl(`/movie/${item.id}`),
    lastModified: toDate(item.release_date, now),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const tvEntries: MetadataRoute.Sitemap = popularTV.map((item) => ({
    url: absoluteUrl(`/tv/${item.id}`),
    lastModified: toDate(item.first_air_date, now),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...movieEntries, ...tvEntries];
}
