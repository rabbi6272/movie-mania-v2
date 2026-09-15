"use client";
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

import { getPosterURL } from "@/api/tmdb";
import type { Movie } from "@/types/movie";

export const SmallMovieCard = memo(function SmallMovieCard({
  movie,
  index,
}: { movie: Movie; index: number }) {
  const posterURL = getPosterURL(movie.poster_path, "w342");
  const year = movie.release_date?.substring(0, 4) || "N/A";
  const mediaType = movie.media_type || "movie";
  const detailPath = mediaType === "tv" ? `/tv/${movie.tmdbId || movie.id}` : `/movie/${movie.tmdbId || movie.id}`;

  return (
    <Link
      href={detailPath}
      className="h-auto w-full mx-auto rounded-md lg:rounded-lg border border-gray-200 flex flex-col cursor-pointer bg-white transition-colors duration-300 shadow-md hover:shadow-lg overflow-hidden group animate-fadeIn"
      style={{ animationDelay: `${index * 15}ms` }}
    >
      <div className="relative w-full aspect-3/4 overflow-hidden">
        {posterURL ? (
          <Image
            fill
            src={posterURL}
            alt={movie.title}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 16vw, 12vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No Image
          </div>
        )}

        {mediaType === "tv" && (
          <div className="absolute -top-1 lg:top-0.5 left-0.5 lg:left-1">
            <span className="bg-blue-500/80 text-white text-[9px] lg:text-[10px] font-bold px-1 lg:px-1.5 lg:py-0.5 rounded-full leading-none">
              TV
            </span>
          </div>
        )}
        {movie.watched === true && (
          <div className="bg-green-500/80 text-white rounded-full p-0.5 absolute top-0.5 lg:top-1 right-0.5 lg:right-1">
            <svg className="w-2.5 lg:w-3.5 h-2.5 lg:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
      <div className="p-1 lg:p-2">
        <h3 className="text-gray-800 text-sm lg:text-base font-semibold line-clamp-3 leading-5 md:leading-5 xl:leading-6 text-nowrap">
          {movie.title}
        </h3>
        <p className="text-[10px] lg:text-[12px] xl:text-[12.5px] text-gray-600 font-medium mt-0.5 flex items-center justify-between leading-3 md:leading-4 xl:leading-5">
          {year}
          {movie.vote_average > 0 && (
            <span className="flex items-center justify-center gap-0.5 bg-black/10 px-1 py-0.5 md:py-0 rounded-full">
              <span className="text-yellow-500">★</span>
              {movie.vote_average.toFixed(1)}
            </span>
          )}</p>
      </div>
    </Link>
  );
});
