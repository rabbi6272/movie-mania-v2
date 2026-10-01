import { cache } from "react";

import { getPopularMovies, getPopularTV } from "@/api/tmdb";
import type { MediaType } from "@/lib/detail";

const PAGE_SIZE = 20;
const DEFAULT_LIMIT = 50;

export const getPopularList = cache(
  async (mediaType: MediaType, limit = DEFAULT_LIMIT) => {
    const fetchPage = mediaType === "tv" ? getPopularTV : getPopularMovies;
    const pageCount = Math.ceil(limit / PAGE_SIZE);

    try {
      const pages = await Promise.all(
        Array.from({ length: pageCount }, (_, index) => fetchPage(index + 1)),
      );
      return pages
        .flatMap((page) => page?.results ?? [])
        .slice(0, limit) as Array<{ id: number; release_date?: string; first_air_date?: string }>;
    } catch (error) {
      console.error(`[popular] ${mediaType} fetch failed:`, error);
      return [];
    }
  },
);
