"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getTrendingAll, normalizeMovieForCard } from "@/api/tmdb";
import { SmallMovieCard } from "@/components/SmallMovieCard";
import { Button } from "../ui/Button";

const TIME_WINDOWS = [
  { value: "day", label: "Today" },
  { value: "week", label: "This Week" },
];

export function TrendingRow() {
  const [timeWindow, setTimeWindow] = useState("week");

  const { data: trending = [], isLoading, isError } = useQuery({
    queryKey: ["trending", "all", timeWindow],
    queryFn: async () => {
      const data = await getTrendingAll(timeWindow);
      return data.results
        .filter((item) => item.media_type === "movie" || item.media_type === "tv")
        .slice(0, 20)
        .map(normalizeMovieForCard);
    },
    staleTime: 30 * 60 * 1000,
  });

  if (!isLoading && (isError || trending.length === 0)) {
    return null;
  }

  return (
    <div className="w-full mx-auto px-2 md:px-4 mt-4 lg:mt-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-gray-900 font-nunito font-bold text-lg md:text-xl flex items-center gap-2">
          <span className="material-symbols-outlined text-gray-500">local_fire_department</span>
          Trending Now
        </h2>
        <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
          {TIME_WINDOWS.map((window) => (
            <Button
              key={window.value}
              onClick={() => setTimeWindow(window.value)}
              varient={timeWindow === window.value ? "primary" : "outline"}
              size="sm"
            >
              {window.label}
            </Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex gap-3 overflow-hidden pb-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="shrink-0 w-38.75 rounded-md overflow-hidden border border-gray-200 bg-white shadow-md animate-pulse"
            >
              <div className="w-full aspect-3/4 bg-gray-200" />
              <div className="p-2 space-y-1.5">
                <div className="h-3 bg-gray-200 rounded w-3/4" />
                <div className="h-2.5 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {trending.map((movie, index) => (
            <div key={movie.tmdbId} className="shrink-0 w-38.75">
              <SmallMovieCard movie={movie} index={index} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}