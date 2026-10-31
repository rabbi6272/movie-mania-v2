"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button, Input, Spinner } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/hooks/useAuth";
import {
  createShareLink,
  revokeShareLink,
  getShareForPlaylist,
  shareUrl,
} from "@/hooks/useShareServices";
import { ModalShell } from "./ModalShell";

export function SharePlaylistModal({
  playlistId,
  ownerId,
  onClose,
}: {
  playlistId: string;
  ownerId: string;
  onClose: () => void;
}) {
  const { userID } = useAuth();
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const isOwner = userID === ownerId;

  useEffect(() => {
    let mounted = true;
    if (isOwner) {
      getShareForPlaylist(playlistId, ownerId)
        .then((share) => {
          if (mounted && share) setToken(share.token);
        })
        .catch(() => {})
        .finally(() => {
          if (mounted) setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
    return () => {
      mounted = false;
    };
  }, [playlistId, ownerId, isOwner]);

  function invalidatePlaylistQueries() {
    queryClient.invalidateQueries({ queryKey: ["playlist", playlistId] });
    queryClient.invalidateQueries({ queryKey: ["playlists"] });
  }

  async function handleGenerate() {
    if (!isOwner) return;
    try {
      setIsGenerating(true);
      const { success, token: newToken } = await createShareLink(playlistId, ownerId);
      if (success) {
        setToken(newToken);
        toast.success("Share link created");
        invalidatePlaylistQueries();
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleRevoke() {
    if (!isOwner) return;
    try {
      const { success } = await revokeShareLink(playlistId, ownerId);
      if (success) {
        setToken(null);
        toast.success("Share link revoked");
        invalidatePlaylistQueries();
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function handleCopy() {
    if (!token) return;
    try {
      await navigator.clipboard.writeText(shareUrl(token));
      setIsCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  }

  return (
    <ModalShell title="Share Playlist" onClose={onClose}>
      {isLoading ? (
        <div className="py-8 flex justify-center">
          <Spinner color="current" className="text-gray-600" />
        </div>
      ) : !isOwner ? (
        <p className="text-sm text-gray-500 text-center py-6">
          Only the owner can manage the share link for this playlist.
        </p>
      ) : token ? (
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Anyone with this link can view your playlist.
          </p>
          <div className="flex items-center gap-2">
            <Input
              readOnly
              aria-label="Share link"
              value={shareUrl(token)}
              onFocus={(e) => e.target.select()}
              className="flex-1 truncate"
            />
            <Button onPress={handleCopy}>
              <span className="material-symbols-outlined">
                {isCopied ? "check" : "content_copy"}
              </span>
              {isCopied ? "Copied" : "Copy"}
            </Button>
          </div>
          <Button onPress={handleRevoke} variant="danger-soft" fullWidth>
            <span className="material-symbols-outlined">link_off</span>
            Revoke link
          </Button>
        </div>
      ) : (
        <div className="space-y-4 py-2 text-center">
          <span className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-gray-100 text-gray-500">
            <span className="material-symbols-outlined text-3xl">share</span>
          </span>
          <p className="text-sm text-gray-600">
            Generate a link to share this playlist with anyone.
          </p>
          <Button onPress={handleGenerate} isPending={isGenerating} fullWidth>
            {isGenerating ? (
              <Spinner size="sm" color="current" />
            ) : (
              <span className="material-symbols-outlined">link</span>
            )}
            Generate share link
          </Button>
        </div>
      )}
    </ModalShell>
  );
}