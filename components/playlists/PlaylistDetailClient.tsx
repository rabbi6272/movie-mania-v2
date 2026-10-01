"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { getPlaylist, getPlaylistItems, deletePlaylist, updatePlaylist, removeItemFromPlaylist } from "@/hooks/usePlaylistServices";
import { useAuth } from "@/hooks/useAuth";
import { getPosterURL } from "@/api/tmdb";
import type { Movie } from "@/types/movie";

import { SmallMovieCard } from "@/components/SmallMovieCard";
import { Loader } from "@/components/ui/loader";
import { ModalShell } from "@/components/playlists/ModalShell";
import { PlaylistFormModal } from "@/components/playlists/PlaylistFormModal";
import { SharePlaylistModal } from "@/components/playlists/SharePlaylistModal";

export function PlaylistDetailClient() {
  const { id } = useParams();
  const playlistId = String(id);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { userID } = useAuth();

  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [removingItem, setRemovingItem] = useState<string | null>(null);

  const { data: playlist, isLoading } = useQuery({
    queryKey: ["playlist", playlistId],
    queryFn: () => getPlaylist(playlistId),
  });

  const { data: items = [], refetch } = useQuery({
    queryKey: ["playlistItems", playlistId],
    queryFn: () => getPlaylistItems(playlistId),
    enabled: !!playlist,
  });

  const isOwner = playlist ? playlist.ownerId === userID : false;

  async function handleDelete() {
    try {
      setIsDeleting(true);
      await deletePlaylist(playlistId);
      toast.success("Playlist deleted");
      queryClient.invalidateQueries({ queryKey: ["playlists", userID] });
      queryClient.invalidateQueries({ queryKey: ["playlistPreviews"] });
      router.push("/");
    } catch (error) {
      toast.error(error.message);
      setIsDeleting(false);
    }
  }

  async function handleRemoveItem(itemId: string, title: string) {
    if (removingItem) return;
    try {
      setRemovingItem(itemId);
      await removeItemFromPlaylist(playlistId, itemId);
      toast.success(`Removed "${title}"`);
      await refetch();
      queryClient.invalidateQueries({ queryKey: ["playlists", userID] });
      queryClient.invalidateQueries({ queryKey: ["playlistPreviews"] });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setRemovingItem(null);
    }
  }

  if (isLoading) {
    return (
      <div className="w-full h-[calc(100vh-70px)] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="w-full h-[calc(100vh-70px)] flex flex-col items-center justify-center gap-3">
        <span className="material-symbols-outlined text-6xl text-gray-300">video_library</span>
        <h1 className="text-2xl font-semibold text-gray-600">Playlist not found</h1>
        <p className="text-sm text-gray-400">
          It may have been deleted or the link is invalid.
        </p>
        <Link href="/" className="text-sm font-semibold text-blue-600 hover:underline mt-2">
          Go home
        </Link>
      </div>
    );
  }

  const cover = items.find((item) => item.poster_path)?.poster_path;

  return (
    <div className="w-full min-h-[calc(100vh-70px)]">
      {/* Header */}
      <div className="relative w-full">
        {cover ? (
          <div className="relative w-full h-[28vh] md:h-[36vh] overflow-hidden">
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
          <div className="w-full h-[28vh] md:h-[36vh] bg-gradient-to-br from-gray-200 to-gray-300" />
        )}

        <div className="relative z-10 -mt-24 md:-mt-32 mx-auto max-w-6xl px-4 md:px-8">
          <button
            className="h-10 w-10 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 active:scale-95 transition-all duration-200 grid place-items-center cursor-pointer"
            onClick={() => router.back()}
            aria-label="Go back"
          >
            <span className="material-symbols-outlined text-white text-xl">arrow_back</span>
          </button>

          <div className="relative rounded-xl shadow-xl ring-1 ring-black/10 bg-white mt-4 overflow-hidden">
            <div className="absolute top-0 right-0 left-0 h-1.5 bg-gray-900" />
            <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-gray-500">video_library</span>
                  <h1 className="text-2xl md:text-3xl text-gray-900 font-nunito font-extrabold truncate">
                    {playlist.name}
                  </h1>
                  {playlist.shareToken && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                      <span className="material-symbols-outlined text-xs">link</span>
                      Shared
                    </span>
                  )}
                </div>
                {playlist.description && (
                  <p className="text-sm text-gray-500 mt-1">{playlist.description}</p>
                )}
                <p className="text-xs text-gray-400 font-medium mt-2">
                  {items.length} {items.length === 1 ? "title" : "titles"}
                </p>
              </div>

              {isOwner && (
                <div className="flex items-center gap-2 flex-wrap shrink-0">
                  <button
                    onClick={() => setIsShareOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-gray-900 text-white hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">share</span>
                    Share
                  </button>
                  <button
                    onClick={() => setIsEditOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                    Edit
                  </button>
                  <button
                    onClick={() => setIsDeleteOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="max-w-full mx-auto px-2 md:px-8 pb-12">
        {items.length > 0 ? (
          <div className="w-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-0.5 md:gap-2 mt-6">
            {items.map((item, index) => (
              <div key={item.id} className="relative group">
                <SmallMovieCard movie={item as unknown as Movie} index={index} />
                {isOwner && (
                  <button
                    onClick={() => handleRemoveItem(item.id, item.title)}
                    disabled={removingItem === item.id}
                    aria-label={`Remove ${item.title} from playlist`}
                    className="absolute -top-1.5 -right-1.5 z-10 h-6 w-6 rounded-full bg-red-500 text-white grid place-items-center shadow-md transition-all duration-200 cursor-pointer disabled:opacity-50 sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    {removingItem === item.id ? (
                      <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <span className="material-symbols-outlined text-[15px]">close</span>
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full py-16 flex flex-col items-center justify-center text-center">
            <span className="material-symbols-outlined text-5xl text-gray-300">playlist_play</span>
            <h2 className="text-lg font-semibold text-gray-600 mt-3">This playlist is empty</h2>
            <p className="text-sm text-gray-400 mt-1 max-w-xs">
              Find movies in the search page and use &ldquo;Add to Playlist&rdquo; to fill it up.
            </p>
            <Link
              href="/search"
              className="mt-4 text-sm font-semibold text-white bg-gray-900 rounded-full px-5 py-2 hover:bg-gray-800 transition-colors"
            >
              Browse movies
            </Link>
          </div>
        )}
      </div>

      {isShareOpen && (
        <SharePlaylistModal
          playlistId={playlistId}
          ownerId={playlist.ownerId}
          onClose={() => setIsShareOpen(false)}
        />
      )}
      {isEditOpen && (
        <PlaylistFormModal
          title="Edit Playlist"
          submitLabel="Save"
          initial={{ name: playlist.name, description: playlist.description || "" }}
          onSubmit={async (values) => updatePlaylist(playlistId, values)}
          onClose={() => setIsEditOpen(false)}
        />
      )}
      {isDeleteOpen && (
        <ModalShell title="Delete Playlist" onClose={() => setIsDeleteOpen(false)}>
          <p className="text-sm text-gray-600">
            Are you sure you want to delete <span className="font-semibold text-gray-900">{playlist.name}</span>? This will remove the playlist and all of its titles. This cannot be undone.
          </p>
          <div className="flex justify-end gap-3 mt-5">
            <button
              onClick={() => setIsDeleteOpen(false)}
              className="px-4 py-2 rounded-full text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-5 py-2 rounded-full text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-2"
            >
              {isDeleting && (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              Delete
            </button>
          </div>
        </ModalShell>
      )}
    </div>
  );
}