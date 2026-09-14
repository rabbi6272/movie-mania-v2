"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { useMovieStore } from "@/store/store";
import { useAuth } from "@/hooks/useAuth";
import { getAllMovies } from "@/hooks/useMoviesServices";

import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/loader";
import { SmallMovieCard } from "@/components/SmallMovieCard";
import { PlaylistSection } from "@/components/playlists/PlaylistSection";
import { TrendingRow } from "@/components/home/TrendingRow";
import { GuestHeroSection } from "@/components/home/GuestHeroSection";
import { EmptyLibrary } from "@/components/home/EmptyLibrary";

export default function HomePage() {
  const [categoryFilter, setategoryFilter] = useState<"all" | "wantToWatch" | "watched">("all");
  const [mediaTypeFilter, setMediaTypeFilter] = useState<("movie" | "tv")[]>([]);
  const router = useRouter();
  const { userID } = useAuth();
  const setSavedMovies = useMovieStore((state) => state.setSavedMovies);
  const { data: savedMovies = [], isLoading: moviesLoading } = useQuery({
    queryKey: ["movies", userID],
    queryFn: () => getAllMovies(userID),
    enabled: !!userID,
    staleTime: 2 * 60 * 1000,
  });

  const toggleMediaType = (type: "movie" | "tv") => {
    setMediaTypeFilter((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const filteredMovies = useMemo(() => {
    let result = savedMovies;

    if (categoryFilter === "wantToWatch") {
      result = result?.filter((movie) => movie.watched !== true);
    } else if (categoryFilter === "watched") {
      result = result?.filter((movie) => movie.watched === true);
    }

    if (mediaTypeFilter.length > 0) {
      result = result?.filter((movie) =>
        mediaTypeFilter.includes(movie.media_type || "movie")
      );
    }

    return result ?? [];
  }, [categoryFilter, mediaTypeFilter, savedMovies]);

  useEffect(() => {
    if (savedMovies) {
      setSavedMovies(savedMovies);
    }
  }, [savedMovies, setSavedMovies]);

  if (userID && moviesLoading) {
    return (
      <div className="w-full h-[calc(100vh-70px)] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!userID) {
    return (
      <>
        <GuestHeroSection router={router} />
        <TrendingRow />
      </>
    )
  }

  const watchedCount = savedMovies?.filter((movie) => movie.watched === true).length || 0;
  return (
    <>
      <div className="w-full py-5 px-4 md:pl-6 flex items-center overflow-x-auto gap-2 md:gap-4 scrollbar-hide">
        <Button
          onClick={() => setategoryFilter("all")}
          varient={categoryFilter === "all" ? "primary" : "outline"}
          size="md">
          All
        </Button>
        <Button
          varient={categoryFilter === "wantToWatch" ? "primary" : "outline"}
          size="md"
          onClick={() => setategoryFilter("wantToWatch")}>
          Want to Watch
        </Button>
        <Button
          varient={categoryFilter === "watched" ? "primary" : "outline"}
          size="md"
          onClick={() => setategoryFilter("watched")}>
          Watched
        </Button>
        <Button
          varient={mediaTypeFilter.includes("movie") ? "primary" : "outline"}
          size="md"
          onClick={() => toggleMediaType("movie")}>
          Movie
        </Button>
        <Button
          varient={mediaTypeFilter.includes("tv") ? "primary" : "outline"}
          size="md"
          onClick={() => toggleMediaType("tv")}>
          Tv Series
        </Button>
      </div >

      <PlaylistSection userID={userID} />

      {savedMovies.length > 0 ? (
        <div className="mt-6">
          <div className="px-2 md:px-4 xl:px-6 mb-2">
            <p className="text-xs md:text-sm text-gray-600 font-medium">
              {savedMovies.length} {savedMovies.length === 1 ? "title" : "titles"} saved
              {watchedCount > 0 && ` · ${watchedCount} watched`}
            </p>
          </div>

          {filteredMovies.length > 0 ? (
            <div className="w-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-0.5 md:gap-2 px-2 md:px-4">
              {filteredMovies?.map((movie, index) => (
                <SmallMovieCard
                  key={index || movie.tmdbId || movie.id}
                  movie={movie}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <EmptyLibrary router={router} />
          )}
        </div>
      ) : (
        <EmptyLibrary router={router} />
      )}

      <TrendingRow />
    </>
  );
}