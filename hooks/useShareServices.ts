import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/utils/firebaseConfig";
import { getSiteUrl } from "@/lib/seo";

import type { Playlist, PlaylistItem, ShareLink } from "@/types/playlist";

import { updatePlaylist } from "@/hooks/usePlaylistServices";

function handleFirebaseError(error: unknown, operation: string): never {
  console.error(error);
  const message = error instanceof Error ? error.message : "Unknown error";
  throw new Error(`${operation} failed: ${message}`);
}

const now = () => new Date().toISOString();

function generateToken() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID().replace(/-/g, "").slice(0, 12);
  }
  return Math.random().toString(36).slice(2, 14);
}

export const shareUrl = (token: string) => {
  const base =
    typeof window !== "undefined" ? window.location.origin : getSiteUrl();
  return `${base}/share/${token}`;
};

// Create a share link for a playlist (idempotent per playlist)
export async function createShareLink(playlistId: string, ownerId: string) {
  if (!playlistId || !ownerId) {
    throw new Error("Playlist ID and owner ID are required");
  }
  try {
    const existing = await getShareForPlaylist(playlistId, ownerId);
    if (existing) {
      return { success: true, token: existing.token };
    }

    const token = generateToken();
    const shareData: Omit<ShareLink, "token"> = {
      playlistId,
      ownerId,
      createdAt: now(),
    };
    await setDoc(doc(db, "shares", token), shareData);
    await updatePlaylist(playlistId, { shareToken: token });
    return { success: true, token };
  } catch (error) {
    handleFirebaseError(error, "creating share link");
  }
}

// Find the active share doc for a playlist (owner-only)
export async function getShareForPlaylist(playlistId: string, ownerId: string) {
  if (!playlistId) {
    return null;
  }
  try {
    const sharesSnapshot = await getDocs(
      query(collection(db, "shares"), where("playlistId", "==", playlistId)),
    );
    const share = sharesSnapshot.docs.find(
      (doc) => doc.data().ownerId === ownerId,
    );
    if (!share) return null;
    return { ...(share.data() as Omit<ShareLink, "token">), token: share.id } as ShareLink;
  } catch (error) {
    handleFirebaseError(error, "getting share link");
  }
}

// Revoke an active share link for a playlist
export async function revokeShareLink(playlistId: string, ownerId: string) {
  if (!playlistId || !ownerId) {
    throw new Error("Playlist ID and owner ID are required");
  }
  try {
    const existing = await getShareForPlaylist(playlistId, ownerId);
    if (existing) {
      await deleteDoc(doc(db, "shares", existing.token));
    }
    await updatePlaylist(playlistId, { shareToken: null });
    return { success: true, message: "Share link revoked" };
  } catch (error) {
    handleFirebaseError(error, "revoking share link");
  }
}

// Resolve a public share token → playlist + items (no auth required)
export async function getSharedPlaylist(token: string) {
  if (!token) {
    throw new Error("Share token is required");
  }
  try {
    const shareRef = doc(db, "shares", token);
    const shareSnapshot = await getDoc(shareRef);
    if (!shareSnapshot.exists()) {
      return null;
    }
    const share = shareSnapshot.data() as Omit<ShareLink, "token">;

    const playlistRef = doc(db, "playlists", share.playlistId);
    const playlistSnapshot = await getDoc(playlistRef);
    if (!playlistSnapshot.exists()) {
      return null;
    }
    const playlist = {
      ...(playlistSnapshot.data() as Omit<Playlist, "id">),
      id: playlistSnapshot.id,
    };

    const itemsSnapshot = await getDocs(
      collection(db, "playlists", share.playlistId, "items"),
    );
    const items: PlaylistItem[] = [];
    itemsSnapshot.forEach((item) => {
      items.push({ ...(item.data() as Omit<PlaylistItem, "id">), id: item.id });
    });
    items.sort((a, b) => b.addedAt.localeCompare(a.addedAt));

    return { playlist, items };
  } catch (error) {
    handleFirebaseError(error, "resolving share link");
  }
}