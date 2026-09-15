const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
  "Content-Type": "application/json",
});

const fetchFromTMDB = async (endpoint, params = {}, signal) => {
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.append(key, value);
    }
  });

  const res = await fetch(url.toString(), {
    headers: getAuthHeaders(),
    signal,
  });
  if (!res.ok) {
    throw new Error(`TMDB API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
};

export const getPosterURL = (path, size = "w500") => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
};

export const getBackdropURL = (path, size = "w1280") => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
};

export const getProfileURL = (path, size = "w185") => {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
};

export const searchMovies = async (query, page = 1, signal) => {
  return fetchFromTMDB(
    "/search/movie",
    {
      query,
      page,
    },
    signal,
  );
};

export const searchMulti = async (query, page = 1, signal) => {
  return fetchFromTMDB(
    "/search/multi",
    {
      query,
      page,
    },
    signal,
  );
};

export const getMovieDetails = async (id) => {
  return fetchFromTMDB(`/movie/${id}`, {
    append_to_response: "credits,videos,similar,recommendations,external_ids",
  });
};

export const getTVDetails = async (id) => {
  return fetchFromTMDB(`/tv/${id}`, {
    append_to_response: "credits,videos,similar,recommendations,external_ids",
  });
};

export const getTrendingAll = async (timeWindow = "week", page = 1) => {
  return fetchFromTMDB(`/trending/all/${timeWindow}`, { page });
};

export const getTrendingMovies = async (timeWindow = "week", page = 1) => {
  return fetchFromTMDB(`/trending/movie/${timeWindow}`, { page });
};

export const getPopularMovies = async (page = 1) => {
  return fetchFromTMDB("/movie/popular", { page });
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

export const discoverMovies = async (filters = {}) => {
  const params = {
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

export const getPersonDetails = async (id) => {
  return fetchFromTMDB(`/person/${id}`, {
    append_to_response: "movie_credits,external_ids",
  });
};

export const normalizeMovieForCard = (item) => ({
  tmdbId: item.id,
  media_type: item.media_type || "movie",
  title: item.title || item.name,
  release_date: item.release_date || item.first_air_date,
  poster_path: item.poster_path,
  backdrop_path: item.backdrop_path,
  overview: item.overview,
  vote_average: item.vote_average,
  vote_count: item.vote_count,
  genre_ids: item.genre_ids || item.genres?.map((g) => g.id) || [],
});

export const normalizeMovieForMinimal = (item) => ({
  tmdbId: item.id,
  media_type: item.media_type || "movie",
  title: item.title || item.name,
  poster_path: item.poster_path || null,
  release_date: item.release_date || item.first_air_date || null,
  vote_average: item.vote_average ?? null,
});

export const normalizeMovieForFirestore = (movie) => ({
  tmdbId: movie.id,
  media_type: movie.media_type || "movie",
  title: movie.title || movie.name,
  original_title: movie.original_title || movie.original_name,
  release_date: movie.release_date || movie.first_air_date,
  poster_path: movie.poster_path,
  backdrop_path: movie.backdrop_path,
  overview: movie.overview,
  vote_average: movie.vote_average,
  vote_count: movie.vote_count,
  runtime: movie.runtime || movie.episode_run_time?.[0] || null,
  genres: movie.genres || [],
  tagline: movie.tagline,
  status: movie.status,
  budget: movie.budget || null,
  revenue: movie.revenue || null,
  homepage: movie.homepage,
  imdb_id: movie.imdb_id || null,
  director:
    movie.credits?.crew?.find((c) => c.job === "Director")?.name ||
    movie.created_by?.map((c) => c.name).join(", ") ||
    null,
  cast:
    movie.credits?.cast?.slice(0, 10).map((c) => ({
      id: c.id,
      name: c.name,
      character: c.character,
      profile_path: c.profile_path,
    })) || [],
  trailer: movie.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  ) || null,
  similar:
    movie.similar?.results?.slice(0, 10).map(normalizeMovieForCard) || [],
  recommendations:
    movie.recommendations?.results
      ?.slice(0, 10)
      .map(normalizeMovieForCard) || [],
});
