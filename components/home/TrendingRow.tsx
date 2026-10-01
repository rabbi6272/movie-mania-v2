import { getTrendingAll, normalizeMovieForCard } from "@/api/tmdb";
import { SmallMovieCard } from "@/components/SmallMovieCard";
import type { Movie } from "@/types/movie";

import { TrendingRowClient } from "./TrendingRowClient";

const FETCH_OPTIONS = { next: { revalidate: 1800 } };

async function getTrendingList(timeWindow: "day" | "week"): Promise<Movie[]> {
  const data = await getTrendingAll(timeWindow, 1, FETCH_OPTIONS);
  return data.results
    .filter((item: { media_type?: string }) => item.media_type === "movie" || item.media_type === "tv")
    .slice(0, 20)
    .map(normalizeMovieForCard) as Movie[];
}

function CardList({ movies }: { movies: Movie[] }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
      {movies.map((movie, index) => (
        <div key={movie.tmdbId} className="shrink-0 w-38.75">
          <SmallMovieCard movie={movie} index={index} />
        </div>
      ))}
    </div>
  );
}

export async function TrendingRow() {
  try {
    const [day, week] = await Promise.all([
      getTrendingList("day"),
      getTrendingList("week"),
    ]);

    if (day.length === 0 && week.length === 0) return null;

    return <TrendingRowClient day={<CardList movies={day} />} week={<CardList movies={week} />} />;
  } catch {
    return null;
  }
}
