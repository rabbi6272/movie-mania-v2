const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export type TmdbParams = Record<string, string | number | undefined | null>;

export type TmdbFetchOptions = RequestInit & {
  next?: { revalidate?: number | false; tags?: string[] };
};

/** Carries the HTTP status so callers can distinguish a TMDB 404 from a outage. */
export class TmdbError extends Error {
  status?: number;

  constructor(status: number, statusText: string) {
    super(`TMDB API error: ${status} ${statusText}`);
    this.status = status;
  }
}

const getAuthHeaders = () => ({
  Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
  "Content-Type": "application/json",
});

const fetchFromTMDB = async (
  endpoint: string,
  params: TmdbParams = {},
  signal?: AbortSignal | null,
  fetchOptions: TmdbFetchOptions = {},
): Promise<any> => {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.append(key, String(value));
    }
  });

  const res = await fetch(url.toString(), {
    headers: getAuthHeaders(),
    signal: signal ?? undefined,
    ...fetchOptions,
  });
  if (!res.ok) {
    throw new TmdbError(res.status, res.statusText);
  }
  return res.json();
};

export const getPosterURL = (path: string | null | undefined, size = "w500") => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
};

export const getBackdropURL = (path: string | null | undefined, size = "w1280") => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
};

export const getProfileURL = (path: string | null | undefined, size = "w185") => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
};

export const searchMovies = async (query: string, page = 1, signal?: AbortSignal | null) => {
  return fetchFromTMDB(
    "/search/movie",
    {
      query,
      page,
    },
    signal,
  );
};

export const searchMulti = async (query: string, page = 1, signal?: AbortSignal | null) => {
  return fetchFromTMDB(
    "/search/multi",
    {
      query,
      page,
    },
    signal,
  );
};

export const getMovieDetails = async (id: number | string, fetchOptions: TmdbFetchOptions = {}) => {
  return fetchFromTMDB(
    `/movie/${id}`,
    {
      append_to_response: "credits,videos,similar,recommendations,external_ids",
    },
    undefined,
    fetchOptions,
  );
};

export const getTVDetails = async (id: number | string, fetchOptions: TmdbFetchOptions = {}) => {
  return fetchFromTMDB(
    `/tv/${id}`,
    {
      append_to_response: "credits,videos,similar,recommendations,external_ids",
    },
    undefined,
    fetchOptions,
  );
};

const DETAIL_CACHE: TmdbFetchOptions = { next: { revalidate: 3600 } };

export const getMovieDetailsCached = (id: number | string) =>
  getMovieDetails(id, DETAIL_CACHE);

export const getTVDetailsCached = (id: number | string) =>
  getTVDetails(id, DETAIL_CACHE);

export const getTrendingAll = async (
  timeWindow = "week",
  page = 1,
  fetchOptions?: TmdbFetchOptions,
) => {
  return fetchFromTMDB(`/trending/all/${timeWindow}`, { page }, undefined, fetchOptions);
};

export const getTrendingMovies = async (timeWindow = "week", page = 1) => {
  return fetchFromTMDB(`/trending/movie/${timeWindow}`, { page });
};

export const getPopularMovies = async (page = 1) => {
  return fetchFromTMDB("/movie/popular", { page });
};

export const getPopularTV = async (page = 1) => {
  return fetchFromTMDB("/tv/popular", { page });
};

export const getTopRatedMovies = async (page = 1) => {
  return fetchFromTMDB("/movie/top_rated", { page });
};

export const getNowPlayingMovies = async (page = 1) => {
  return fetchFromTMDB("/movie/now_playing", { page });
};

export const getUpcomingMovies = async (page = 1) => {
  return fetchFromTMDB("/movie/upcoming", { page });
};

export const getGenres = async () => {
  return fetchFromTMDB("/genre/movie/list");
};

export const getTVGenres = async () => {
  return fetchFromTMDB("/genre/tv/list");
};

export interface DiscoverFilters {
  sortBy?: string;
  page?: number;
  genreIds?: number[];
  year?: number;
  minRating?: number;
  maxRating?: number;
  releaseDateGte?: string;
  releaseDateLte?: string;
}

export const discoverMovies = async (filters: DiscoverFilters = {}) => {
  const params: TmdbParams = {
    sort_by: filters.sortBy || "popularity.desc",
    page: filters.page || 1,
    "vote_count.gte": 100,
  };

  if (filters.genreIds?.length) {
    params.with_genres = filters.genreIds.join(",");
  }
  if (filters.year) {
    params.primary_release_year = filters.year;
  }
  if (filters.minRating) {
    params["vote_average.gte"] = filters.minRating;
  }
  if (filters.maxRating) {
    params["vote_average.lte"] = filters.maxRating;
  }
  if (filters.releaseDateGte) {
    params["release_date.gte"] = filters.releaseDateGte;
  }
  if (filters.releaseDateLte) {
    params["release_date.lte"] = filters.releaseDateLte;
  }

  return fetchFromTMDB("/discover/movie", params);
};

export const getPersonDetails = async (id: number | string) => {
  return fetchFromTMDB(`/person/${id}`, {
    append_to_response: "movie_credits,external_ids",
  });
};

export const normalizeMovieForCard = (item: any) => ({
  tmdbId: item.id,
  media_type: item.media_type || "movie",
  title: item.title || item.name,
  release_date: item.release_date || item.first_air_date,
  poster_path: item.poster_path,
  backdrop_path: item.backdrop_path,
  overview: item.overview,
  vote_average: item.vote_average,
  vote_count: item.vote_count,
  genre_ids: item.genre_ids || item.genres?.map((g: any) => g.id) || [],
});

export const normalizeMovieForMinimal = (item: any) => ({
  tmdbId: item.id,
  media_type: item.media_type || "movie",
  title: item.title || item.name,
  poster_path: item.poster_path || null,
  release_date: item.release_date || item.first_air_date || null,
  vote_average: item.vote_average ?? null,
});

