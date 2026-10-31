"use client";
import { SmallMovieCard } from "./SmallMovieCard";

export default function SimilarMovies({
  movies,
  title,
}) {
  if (!movies || movies.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
        {movies.map((movie, index) => (
          <div key={movie.tmdbId} className="flex-shrink-0 w-[140px]">
            <SmallMovieCard
              movie={movie}
              index={index}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
