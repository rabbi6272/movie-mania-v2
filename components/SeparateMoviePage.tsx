"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { addMovie, updateMovie, deleteMovie } from "@/hooks/useMoviesServices";
import { useMovieStore } from "@/store/store";
import { useAuth } from "@/hooks/useAuth";
import { getMovieDetails, getTVDetails, getPosterURL, getBackdropURL, normalizeMovieForCard, normalizeMovieForMinimal } from "@/api/tmdb";
import TrailerModal from "./TrailerModal";
import SimilarMovies from "./SimilarMovies";
import { AddToPlaylistModal } from "./playlists/AddToPlaylistModal";
import { Button } from "./ui/Button";

function DetailSkeleton() {
  return (
    <div className="w-full min-h-[calc(100vh-102px)]">
      <div className="relative w-full h-[40vh] md:h-[50vh] bg-gray-200 animate-pulse" />
      <div className="w-full max-w-6xl mx-auto px-4 md:px-8 -mt-24 relative z-10">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          <div className="w-48 md:w-64 lg:w-72 shrink-0 mx-auto md:mx-0">
            <div className="aspect-2/3 bg-gray-200 rounded-xl animate-pulse" />
          </div>
          <div className="flex-1 pt-4 md:pt-16 space-y-4">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
            <div className="flex gap-2 mt-4">
              <div className="h-8 w-16 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-8 w-20 bg-gray-200 rounded-full animate-pulse" />
              <div className="h-8 w-14 bg-gray-200 rounded-full animate-pulse" />
            </div>
            <div className="space-y-2 mt-6">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SeparateMoviePage({ contentId, mediaType = "movie" }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

  const { userID } = useAuth();
  const savedMovies = useMovieStore((state) => state.savedMovies);
  const removeSavedMovie = useMovieStore((state) => state.removeSavedMovie);
  const movieDetailsCache = useMovieStore((state) => state.movieDetailsCache);
  const setMovieDetails = useMovieStore((state) => state.setMovieDetails);
  const router = useRouter();
  const queryClient = useQueryClient();

  const cacheKey = `${mediaType}_${contentId}`;
  const savedMovie = savedMovies.find(
    (m) => m.tmdbId === Number(contentId) && (m.media_type || "movie") === mediaType,
  );
  const cachedMovie = movieDetailsCache[cacheKey];

  const shouldFetch = !!contentId && !cachedMovie;

  const { data: fetchedContent, isLoading: loading } = useQuery({
    queryKey: [mediaType, contentId],
    queryFn: () =>
      mediaType === "tv" ? getTVDetails(contentId) : getMovieDetails(contentId),
    enabled: shouldFetch,
    staleTime: 30 * 60 * 1000,
  });

  useEffect(() => {
    if (fetchedContent && contentId) {
      setMovieDetails(cacheKey, fetchedContent);
    }
  }, [fetchedContent, contentId, cacheKey, setMovieDetails]);

  const content = cachedMovie || fetchedContent || {};
  const posterURL = getPosterURL(content.poster_path, "w500");
  const backdropURL = getBackdropURL(content.backdrop_path, "w1280");
  const title = content.title || content.name || "N/A";
  const year = (content.release_date || content.first_air_date)?.substring(0, 4) || "N/A";
  const genres = content.genres || [];
  const releaseDate = content.release_date || content.first_air_date || "N/A";
  const rating = content.vote_average?.toFixed(1) || "N/A";
  const tagline = content.tagline;

  const videoTrailerKey = content.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  )?.key || content.videos?.results?.[0]?.key || null;

  const similarMovies = content.similar?.results?.slice(0, 15).map(normalizeMovieForCard) || [];
  const recommendedMovies = content.recommendations?.results?.slice(0, 15).map(normalizeMovieForCard) || [];

  const creator = mediaType === "tv"
    ? content.created_by?.map((c) => c.name).join(", ")
    : content.credits?.crew?.find((c) => c.job === "Director")?.name;

  const isWatchlisted = savedMovie && savedMovie.watched === false;
  const isWatched = savedMovie && savedMovie.watched === true;

  const playlistItem = {
    ...normalizeMovieForMinimal(content),
  };

  function handleOpenPlaylistModal() {
    if (!userID) {
      toast.error("Please login to add to playlists");
      router.push("/login");
      return;
    }
    setShowPlaylistModal(true);
  }

  async function handleAddToWatchlist() {
    if (!userID) {
      toast.error("Please login to add to watchlist");
      router.push("/login");
      return;
    }

    if (isWatchlisted) {
      toast.error("Already in your watchlist");
      return;
    }

    try {
      setIsLoading(true);
      if (savedMovie) {
        const { success, message } = await updateMovie(
          savedMovie.id,
          { ...savedMovie, watched: false },
          userID,
        );
        if (success) {
          toast.success(message);
          queryClient.invalidateQueries({ queryKey: ["movies", userID] });
        } else {
          toast.error(message);
        }
      } else {
        const movieData = {
          ...normalizeMovieForMinimal(content),
          watched: false,
        };
        const { success, message } = await addMovie(movieData, userID);
        if (success) {
          toast.success(message);
          queryClient.invalidateQueries({ queryKey: ["movies", userID] });
        } else {
          toast.error(message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
      router.push('/')
    }
  }

  async function handleAddToWatched() {
    if (!userID) {
      toast.error("Please login to add to watched list");
      router.push("/login");
      return;
    }

    if (isWatched) {
      toast.error("Already in your watched list");
      return;
    }

    try {
      setIsLoading2(true);
      if (savedMovie) {
        const { success, message } = await updateMovie(
          savedMovie.id,
          { ...savedMovie, watched: true },
          userID,
        );
        if (success) {
          toast.success(message);
          queryClient.invalidateQueries({ queryKey: ["movies", userID] });
        } else {
          toast.error(message);
        }
      } else {
        const movieData = {
          ...normalizeMovieForMinimal(content),
          watched: true,
        };
        const { success, message } = await addMovie(movieData, userID);
        if (success) {
          toast.success(message);
          queryClient.invalidateQueries({ queryKey: ["movies", userID] });
        } else {
          toast.error(message);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsLoading2(false);
      router.push('/')
    }
  }

  async function handleDelete() {
    if (!userID) {
      toast.error("Please login to delete");
      router.push("/login");
      return;
    }

    if (!savedMovie) return;

    try {
      const { success, message } = await deleteMovie(savedMovie.id, userID);
      if (success) {
        toast.success(message);
        removeSavedMovie(savedMovie.id);
        queryClient.invalidateQueries({ queryKey: ["movies", userID] });
      } else {
        toast.error(message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      router.push('/')
    }
  }

  if (loading && !cachedMovie) {
    return <DetailSkeleton />;
  }

  return (
    <div className="w-full min-h-[calc(100vh-102px)] bg-gray-50">
      {/* Backdrop Hero */}
      <div className="relative w-full h-[40vh] md:h-[50vh] lg:h-[60vh] overflow-hidden">
        {backdropURL ? (
          <Image
            fill
            src={backdropURL}
            alt={title}
            className="object-cover object-top"
            sizes="100vw"
            priority
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-gray-800 to-gray-900" />
        )}
        {/* Gradient overlays */}
        <div className="absolute bottom-0 h-[20%] md:h-[30%] w-full bg-linear-to-t from-white/40 to-transparent" />
        {/* <div className="absolute inset-0 blur-sm" /> */}

        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-3 md:p-5 flex items-center justify-between">
          <Button
            varient="glass"
            icon="arrow_back"
            ariaLabel="Go back"
            onClick={() => router.back()}
          />

          {savedMovie && (
            <Button
              varient="glass"
              icon="delete"
              ariaLabel="Remove from library"
              className="hover:bg-red-500/80"
              onClick={handleDelete}
            />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="w-full max-w-6xl mx-auto px-4 md:px-8 -mt-28 md:-mt-32 relative z-10 pb-12">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-10">
          {/* Poster */}
          <div className="w-54 md:w-60 lg:w-68 shrink-0 mx-auto md:mx-0">
            <div className="relative md:sticky md:top-0 aspect-2/3 rounded-xl overflow-hidden shadow-xl ring-1 ring-black/10">
              {posterURL ? (
                <Image
                  fill
                  src={posterURL}
                  alt={title}
                  className="object-cover "
                  sizes="(max-width: 768px) 176px, (max-width: 1024px) 224px, 256px"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                  <span className="material-symbols-outlined text-5xl">image</span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className=" flex-1 pt-2 sm:pt-8 md:pt-16 ">
            {/* Title + badge */}
            <div className="relative">
              <h1 className="text-center md:text-left text-3xl md:text-4xl lg:text-5xl text-black font-nunito font-bold leading-tight">
                {title}
              </h1>
              {mediaType === "tv" && (
                <span className="absolute -top-6 right-6 bg-black text-white text-xs font-bold px-2.5 py-1 rounded-full mt-1.5 uppercase tracking-wide">
                  TV Series
                </span>
              )}
            </div>

            {/* Tagline */}
            {tagline && (
              <p className="text-gray-600 italic text-sm md:text-base mt-1.5">
                &ldquo;{tagline}&rdquo;
              </p>
            )}

            {/* Meta row */}
            <div className="flex items-center flex-wrap gap-2 md:gap-3 mt-4">
              {/* Rating */}
              {content.vote_average > 0 && (
                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
                  <span className="text-amber-500 text-md">★</span>
                  <span className="text-amber-700 font-bold text-sm">{rating}</span>
                </div>
              )}

              {/* Year */}
              <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full">
                <span className="material-symbols-outlined text-gray-500 text-base">
                  calendar_today
                </span>
                <span className="text-gray-600 font-medium text-sm">{year}</span>
              </div>

              {/* Runtime / Seasons */}
              {mediaType === "movie" ? (
                content.runtime > 0 && (
                  <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full">
                    <span className="material-symbols-outlined text-gray-500 text-base">
                      schedule
                    </span>
                    <span className="text-gray-600 font-medium text-sm">
                      {Math.floor(content.runtime / 60)}h {content.runtime % 60}m
                    </span>
                  </div>
                )
              ) : (
                <>
                  {content.number_of_seasons > 0 && (
                    <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full">
                      <span className="material-symbols-outlined text-gray-500 text-base">
                        tv
                      </span>
                      <span className="text-gray-600 font-medium text-sm">
                        {content.number_of_seasons} Season{content.number_of_seasons !== 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                  {content.number_of_episodes > 0 && (
                    <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full">
                      <span className="material-symbols-outlined text-gray-500 text-base">
                        playlist_play
                      </span>
                      <span className="text-gray-600 font-medium text-sm">
                        {content.number_of_episodes} Episodes
                      </span>
                    </div>
                  )}
                </>
              )}

              {/* Language */}
              {content.original_language && (
                <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full">
                  <span className="material-symbols-outlined text-gray-500 text-base">
                    translate
                  </span>
                  <span className="text-gray-600 font-medium text-sm uppercase">
                    {content.original_language}
                  </span>
                </div>
              )}
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {genres.map((g) => (
                  <span
                    key={g.id}
                    className="bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {/* Director / Creator + Network */}
            <div className="flex flex-wrap gap-x-6 gap-y-1 mt-4 text-sm">
              {creator && (
                <div>
                  <span className="text-gray-400">{mediaType === "tv" ? "Created by" : "Director"}:</span>{" "}
                  <span className="text-gray-700 font-medium">{creator}</span>
                </div>
              )}
              {mediaType === "tv" && content.networks?.length > 0 && (
                <div>
                  <span className="text-gray-400">Network:</span>{" "}
                  <span className="text-gray-700 font-medium">
                    {content.networks.map((n) => n.name).join(", ")}
                  </span>
                </div>
              )}
              {mediaType === "tv" && content.status && (
                <div>
                  <span className="text-gray-400">Status:</span>{" "}
                  <span className={`font-medium ${content.status === "Returning Series"
                    ? "text-green-600"
                    : content.status === "Ended"
                      ? "text-gray-500"
                      : "text-gray-700"
                    }`}>
                    {content.status}
                  </span>
                </div>
              )}
              <div>
                <span className="text-gray-400">Released:</span>{" "}
                <span className="text-gray-700 font-medium">{releaseDate}</span>
              </div>
            </div>

            {/* Overview */}
            {content.overview && (
              <div className="mt-6">
                <h3 className="text-gray-900 font-bold text-base mb-2">Overview</h3>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  {content.overview}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            {/* One primary action, then library state toggles; a saved state reads as a soft filled chip */}
            <div className="mt-8 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3">
              {videoTrailerKey && (
                <Button
                  varient="3d"
                  size="lg"
                  icon="play_arrow"
                  className="w-full sm:w-auto sm:px-7"
                  onClick={() => setShowTrailer(true)}
                >
                  Play Trailer
                </Button>
              )}

              <div className="grid grid-cols-[1fr_1fr_auto] sm:flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <Button
                  size="md"
                  varient={isWatchlisted ? "primary" : "outline"}
                  icon={isWatchlisted ? "bookmark_added" : "bookmark_add"}
                  loading={isLoading}
                  className={`w-full sm:w-auto !px-2.5 sm:!px-6 !text-xs sm:!text-sm min-w-0 ${isWatchlisted ? "button--watchlisted" : ""}`}
                  onClick={handleAddToWatchlist}
                >
                  <span className="truncate">{isWatchlisted ? "In Watchlist" : "Watchlist"}</span>
                </Button>

                <Button
                  size="md"
                  varient={isWatched ? "primary" : "outline"}
                  icon={isWatched ? "check_circle" : "visibility"}
                  loading={isLoading2}
                  className={`w-full sm:w-auto !px-2.5 sm:!px-6 !text-xs sm:!text-sm min-w-0 ${isWatched ? "button--watched" : ""}`}
                  onClick={handleAddToWatched}
                >
                  <span className="truncate">{isWatched ? "Watched" : "Mark Watched"}</span>
                </Button>

                <Button
                  size="md"
                  varient="outline"
                  icon="playlist_add"
                  ariaLabel="Add to playlist"
                  className="shrink-0"
                  onClick={handleOpenPlaylistModal}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar & Recommended */}
      <div className="w-full mx-auto px-4 md:px-8 pb-12">
        <SimilarMovies movies={similarMovies} title="Similar Movies" />
        <SimilarMovies movies={recommendedMovies} title="Recommended" />
      </div>

      {showTrailer && videoTrailerKey && (
        <TrailerModal videoKey={videoTrailerKey} onClose={() => setShowTrailer(false)} />
      )}
      {showPlaylistModal && (
        <AddToPlaylistModal
          item={playlistItem}
          onClose={() => setShowPlaylistModal(false)}
        />
      )}
    </div>
  );
}
