"use client";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Button, Spinner } from "@heroui/react";

import { useAuth } from "@/hooks/useAuth";
import {
  getPlaylists,
  getPlaylistItems,
  addItemToPlaylist,
  removeItemFromPlaylist,
} from "@/hooks/usePlaylistServices";
import type { PlaylistItem } from "@/types/playlist";

import { ModalShell } from "./ModalShell";
import { CreatePlaylistModal } from "./CreatePlaylistModal";

export type AddToPlaylistItem = Omit<PlaylistItem, "id" | "addedAt">;

export function AddToPlaylistModal({
  item,
  onClose,
}: {
  item: AddToPlaylistItem;
  onClose: () => void;
}) {
  const { userID } = useAuth();
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: playlists = [], isLoading: playlistsLoading } = useQuery({
    queryKey: ["playlists", userID],
    queryFn: () => getPlaylists(userID),
    enabled: !!userID,
  });

  const membershipKey = `${item.media_type}:${item.tmdbId}`;
  const { data: membership = {}, isLoading: membershipLoading, refetch } = useQuery({
    queryKey: [
      "playlistMembership",
      playlists.map((p) => p.id).join(","),
      membershipKey,
    ],
    queryFn: async () => {
      const result: Record<string, string | null> = {};
      await Promise.all(
        playlists.map(async (playlist) => {
          try {
            const items = await getPlaylistItems(playlist.id);
            const found = items.find(
              (i) =>
                i.tmdbId === item.tmdbId && i.media_type === item.media_type,
            );
            result[playlist.id] = found ? found.id : null;
          } catch {
            result[playlist.id] = null;
          }
        }),
      );
      return result;
    },
    enabled: playlists.length > 0 && item.tmdbId != null,
  });

  async function handleToggle(playlistId: string, playlistName: string) {
    if (!userID) {
      toast.error("Please login to manage playlists");
      return;
    }
    const itemId = membership[playlistId];
    try {
      if (itemId) {
        await removeItemFromPlaylist(playlistId, itemId);
        toast.success(`Removed from ${playlistName}`);
      } else {
        await addItemToPlaylist(playlistId, item);
        toast.success(`Added to ${playlistName}`);
      }
      await refetch();
      queryClient.invalidateQueries({ queryKey: ["playlists", userID] });
      queryClient.invalidateQueries({ queryKey: ["playlistPreviews"] });
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <ModalShell title="Add to Playlist" onClose={onClose}>
      <div className="max-h-[50vh] overflow-y-auto">
        {playlistsLoading ? (
          <div className="py-8 flex justify-center">
            <Spinner color="current" className="text-gray-600" />
          </div>
        ) : !userID ? (
          <p className="text-sm text-gray-500 text-center py-6">
            Please login to save movies to playlists.
          </p>
        ) : playlists.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm text-gray-500">You don&apos;t have any playlists yet.</p>
          </div>
        ) : (
          <ul className="space-y-1.5">
            {playlists.map((playlist) => {
              const isAdded = !!membership[playlist.id];
              const isBusy = membershipLoading && !(playlist.id in membership);
              return (
                <li key={playlist.id}>
                  <Button
                    variant="ghost"
                    fullWidth
                    onPress={() => handleToggle(playlist.id, playlist.name)}
                    isDisabled={isBusy}
                    className="justify-between gap-3 px-3.5 rounded-lg font-normal"
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      <span className="material-symbols-outlined text-gray-400 text-xl">
                        playlist_play
                      </span>
                      <span className="text-gray-900 font-medium truncate">
                        {playlist.name}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {playlist.movieCount}
                      </span>
                    </span>
                    <span
                      className={`flex items-center gap-1 text-xs font-semibold rounded-full px-2.5 py-1 transition-colors ${
                        isAdded
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {isAdded ? "check" : "add"}
                      </span>
                      {isAdded ? "Added" : "Add"}
                    </span>
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <Button
        variant="secondary"
        fullWidth
        onPress={() => setIsCreateOpen(true)}
        className="mt-4"
      >
        <span className="material-symbols-outlined">add</span>
        New playlist
      </Button>

      {isCreateOpen && (
        <CreatePlaylistModal
          onClose={() => setIsCreateOpen(false)}
          onCreated={() =>
            queryClient.invalidateQueries({ queryKey: ["playlists", userID] })
          }
        />
      )}
    </ModalShell>
  );
}