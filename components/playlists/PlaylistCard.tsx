"use client";
import Image from "next/image";
import Link from "next/link";

import { getPosterURL } from "@/api/tmdb";
import type { Playlist, PlaylistItem } from "@/types/playlist";

export function PlaylistCard({
  playlist,
  items,
  index,
}: {
  playlist: Playlist;
  items: PlaylistItem[];
  index: number;
}) {
  const posters = items
    .filter((item) => item.poster_path)
    .slice(0, 4)
    .map((item) => item.poster_path as string);

  return (
    <Link
      href={`/playlists/${playlist.id}`}
      className="group block w-full mx-auto rounded-xl border border-gray-200 bg-white overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer animate-fadeIn"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="relative w-full aspect-[16/10] overflow-hidden">
        {posters.length > 0 ? (
          <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-0.5">
            {[0, 1, 2, 3].map((i) =>
              posters[i] ? (
                <Image
                  key={i}
                  fill={false}
                  width={320}
                  height={240}
                  src={getPosterURL(posters[i], "w342")}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div key={i} className="w-full h-full bg-gray-900" />
              ),
            )}
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-gray-400">
            <span className="material-symbols-outlined text-4xl">video_library</span>
            <span className="text-xs mt-1">Empty playlist</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <span className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
          {playlist.movieCount || items.length} {playlist.movieCount === 1 ? "title" : "titles"}
        </span>
      </div>

      <div className="p-3">
        <h3 className="text-gray-900 text-sm md:text-base font-bold font-nunito line-clamp-1">
          {playlist.name}
        </h3>
        {playlist.description && (
          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
            {playlist.description}
          </p>
        )}
        {playlist.shareToken && (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-700 mt-1.5">
            <span className="material-symbols-outlined text-xs">link</span>
            Shared
          </span>
        )}
      </div>
    </Link>
  );
}