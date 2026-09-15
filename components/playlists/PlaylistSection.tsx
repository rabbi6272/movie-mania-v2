"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getPlaylists, getPlaylistItems } from "@/hooks/usePlaylistServices";
import type { PlaylistItem } from "@/types/playlist";

import { CreatePlaylistModal } from "./CreatePlaylistModal";
import { PlaylistCard } from "./PlaylistCard";
import { Button } from "../ui/Button";

function PlaylistSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-md animate-pulse">
      <div className="w-full aspect-16/10 bg-gray-200" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-3/4" />
        <div className="h-2.5 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
}

export function PlaylistSection({ userID }: { userID: string | null }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: playlists = [], isLoading, refetch } = useQuery({
    queryKey: ["playlists", userID],
    queryFn: () => getPlaylists(userID),
    enabled: !!userID,
    staleTime: 2 * 60 * 1000,
  });

  const { data: previewItems = {} } = useQuery({
    queryKey: ["playlistPreviews", playlists.map((p) => p.id)],
    queryFn: async () => {
      const result: Record<string, PlaylistItem[]> = {};
      await Promise.all(
        playlists.slice(0, 8).map(async (playlist) => {
          try {
            result[playlist.id] = (await getPlaylistItems(playlist.id)).slice(0, 4);
          } catch {
            result[playlist.id] = [];
          }
        }),
      );
      return result;
    },
    enabled: playlists.length > 0,
  });

  if (!userID) return null;

  return (
    <section className="w-full mt-1 px-2 md:px-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-gray-900 font-nunito font-bold text-lg md:text-xl flex items-center gap-2">
          <span className="material-symbols-outlined text-gray-500">video_library</span>
          My Playlists
        </h2>

        <Button onClick={() => setIsCreateOpen(true)} size="md" icon="add">
          <span className="hidden sm:inline">Create Playlist</span>
          <span className="sm:hidden">Create</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <PlaylistSkeleton key={i} />
          ))}
        </div>
      ) : playlists.length === 0 ? (
        <div className="w-full py-8 flex flex-col items-center justify-center text-center rounded-xl border border-dashed border-gray-300 bg-white/60">
          <span className="material-symbols-outlined text-4xl text-gray-300">video_library</span>
          <p className="text-sm text-gray-500 mt-2">No playlists yet</p>
          <Button
            onClick={() => setIsCreateOpen(true)}
            size="md"
            className="mt-3"
          >
            Create your first playlist
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-3">
          {playlists.map((playlist, index) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              items={previewItems[playlist.id] || []}
              index={index}
            />
          ))}
        </div>
      )}

      {isCreateOpen && (
        <CreatePlaylistModal
          onClose={() => setIsCreateOpen(false)}
          onCreated={() => refetch()}
        />
      )}
    </section>
  );
}