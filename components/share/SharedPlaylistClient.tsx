"use client";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { getSharedPlaylist } from "@/hooks/useShareServices";
import { getPosterURL } from "@/api/tmdb";
import type { Movie } from "@/types/movie";

import { SmallMovieCard } from "@/components/SmallMovieCard";
import { Loader } from "@/components/ui/loader";

export function SharedPlaylistClient() {
  const { token } = useParams();
  const shareToken = String(token);

  const { data: shared, isLoading, isError } = useQuery({
    queryKey: ["sharedPlaylist", shareToken],
    queryFn: () => getSharedPlaylist(shareToken),
    retry: 1,
  });

  if (isLoading) {
    return (
      <div className="w-full h-[calc(100vh-70px)] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (isError || !shared) {
    return (
      <div className="w-full h-[calc(100vh-70px)] flex flex-col items-center justify-center text-center px-4">
        <span className="material-symbols-outlined text-6xl text-gray-300">link_off</span>
        <h1 className="text-2xl font-semibold text-gray-600 mt-2">Playlist not found</h1>
        <p className="text-sm text-gray-400 mt-1">
          This share link is invalid or has been revoked.
        </p>
        <Link href="/" className="text-sm font-semibold text-blue-600 hover:underline mt-4">
          Go to MovieMania
        </Link>
      </div>
    );
  }

  const { playlist, items } = shared;
  const cover = items.find((item) => item.poster_path)?.poster_path;

  return (
    <div className="w-full min-h-[calc(100vh-70px)]">
      {/* Header */}
      <div className="relative w-full">
        {cover ? (
          <div className="relative w-full h-[26vh] md:h-[34vh] overflow-hidden">
            <Image
              fill
              src={getPosterURL(cover, "w342")}
              alt=""
              className="object-cover object-top blur-sm scale-110"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/45" />
          </div>
        ) : (
          <div className="w-full h-[26vh] md:h-[34vh] bg-gradient-to-br from-gray-200 to-gray-300" />
        )}

        <div className="relative z-10 -mt-20 md:-mt-28 mx-auto max-w-6xl px-4 md:px-8">
          <div className="relative rounded-xl shadow-xl ring-1 ring-black/10 bg-white mt-4 overflow-hidden p-5 md:p-6">
            <div className="absolute top-0 right-0 left-0 h-1.5 bg-gray-900" />
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-gray-500">public</span>
              <h1 className="text-2xl md:text-3xl text-gray-900 font-nunito font-extrabold truncate">
                {playlist.name}
              </h1>
            </div>
            {playlist.description && (
              <p className="text-sm text-gray-500 mt-1">{playlist.description}</p>
            )}
            <p className="text-xs text-gray-400 font-medium mt-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm">share</span>
              Shared playlist · {items.length} {items.length === 1 ? "title" : "titles"}
            </p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="max-w-6xl mx-auto px-2 md:px-8 pb-12">
        {items.length > 0 ? (
          <div className="w-full grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12 gap-0.5 md:gap-2 mt-6">
            {items.map((item, index) => (
              <SmallMovieCard key={item.id} movie={item as unknown as Movie} index={index} />
            ))}
          </div>
        ) : (
          <div className="w-full py-16 flex flex-col items-center justify-center text-center">
            <span className="material-symbols-outlined text-5xl text-gray-300">playlist_play</span>
            <h2 className="text-lg font-semibold text-gray-600 mt-3">This playlist is empty</h2>
          </div>
        )}
      </div>
    </div>
  );
}