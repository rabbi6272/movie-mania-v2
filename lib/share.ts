import { cache } from "react";

import type { Playlist, PlaylistItem, SharedPlaylist } from "@/types/playlist";

const FIRESTORE_REST = "https://firestore.googleapis.com/v1";
const REQUEST_TIMEOUT_MS = 5000;
const MAX_ATTEMPTS = 2;

function env(name: string): string | undefined {
  const value = process.env[name];
  return value && value.length > 0 ? value : undefined;
}

interface FirestoreValue {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  booleanValue?: boolean;
  nullValue?: null;
  timestampValue?: string;
  mapValue?: { fields?: Record<string, FirestoreValue> };
  arrayValue?: { values?: FirestoreValue[] };
  referenceValue?: string;
}

function decodeValue(value?: FirestoreValue): unknown {
  if (!value) return null;
  if ("stringValue" in value) return value.stringValue ?? null;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return value.doubleValue ?? null;
  if ("booleanValue" in value) return value.booleanValue ?? false;
  if ("timestampValue" in value) return value.timestampValue ?? null;
  if ("nullValue" in value) return null;
  if (value.mapValue) return decodeFields(value.mapValue.fields ?? {});
  if (value.arrayValue) {
    return (value.arrayValue.values ?? []).map((item) => decodeValue(item));
  }
  if ("referenceValue" in value) return value.referenceValue ?? null;
  return null;
}

function decodeFields(fields: Record<string, FirestoreValue>) {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(fields)) out[key] = decodeValue(value);
  return out;
}

interface FirestoreDocument {
  name?: string;
  fields?: Record<string, FirestoreValue>;
}

function documentPath(document?: FirestoreDocument): string {
  return document?.name?.split("/").pop() ?? "";
}

function buildUrl(path: string, searchParams?: string): string | null {
  const projectId = env("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
  const apiKey = env("NEXT_PUBLIC_FIREBASE_API_KEY");
  if (!projectId || !apiKey) return null;

  const params = new URLSearchParams({ key: apiKey });
  if (searchParams) {
    for (const [key, value] of new URLSearchParams(searchParams)) {
      params.set(key, value);
    }
  }

  return `${FIRESTORE_REST}/projects/${projectId}/databases/(default)/documents/${path}?${params}`;
}

async function firestoreFetch(path: string, searchParams?: string): Promise<unknown> {
  const url = buildUrl(path, searchParams);
  if (!url) return null;

  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const res = await fetch(url, {
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        next: { revalidate: 60 },
      });
      if (res.ok) return res.json();
      if (res.status === 404) return null;
      throw new Error(`Firestore REST ${res.status} for ${path}`);
    } catch (error) {
      lastError = error;
      if (attempt < MAX_ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, 150));
      }
    }
  }
  throw lastError;
}

async function getDocument(path: string): Promise<Record<string, unknown> | null> {
  const doc = (await firestoreFetch(path)) as FirestoreDocument | null;
  if (!doc || !doc.fields) return null;
  return { id: documentPath(doc), ...decodeFields(doc.fields) };
}

async function getCollection(path: string): Promise<Record<string, unknown>[]> {
  const payload = (await firestoreFetch(path, "pageSize=300")) as {
    documents?: FirestoreDocument[];
  } | null;
  if (!payload?.documents) return [];
  return payload.documents
    .map((doc) => ({ id: documentPath(doc), ...decodeFields(doc.fields ?? {}) }))
    .filter((doc) => doc.id);
}

/**
 * Server-side share lookup used for share-page metadata and JSON-LD.
 * Uses the Firestore REST API instead of the browser-only client SDK so it
 * runs reliably inside a Node.js server component. Returns null on any
 * failure so callers fall back to generic metadata.
 */
export const getSharedPlaylistServer = cache(
  async (token: string): Promise<SharedPlaylist | null> => {
    if (!token || !/^[A-Za-z0-9_-]{4,64}$/.test(token)) return null;

    try {
      const share = (await getDocument(`shares/${token}`)) as
        | { playlistId?: string }
        | null;
      if (!share?.playlistId) return null;

      const playlist = (await getDocument(`playlists/${share.playlistId}`)) as
        | Playlist
        | null;
      if (!playlist?.id) return null;

      const rawItems = await getCollection(`playlists/${share.playlistId}/items`);
      const items = rawItems
        .map((item) => item as unknown as PlaylistItem)
        .filter((item) => item && item.title)
        .sort((a, b) => (b.addedAt ?? "").localeCompare(a.addedAt ?? ""));

      return { playlist, items };
    } catch (error) {
      console.error("[share] metadata lookup failed:", error);
      return null;
    }
  },
);
