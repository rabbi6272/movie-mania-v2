export type PlaylistItem = {
  id: string;
  tmdbId: number;
  media_type: "movie" | "tv";
  title: string;
  poster_path: string | null;
  release_date: string | null;
  vote_average: number | null;
  addedAt: string;
};

export type Playlist = {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  movieCount: number;
  shareToken: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ShareLink = {
  token: string;
  playlistId: string;
  ownerId: string;
  createdAt: string;
};

export type SharedPlaylist = {
  playlist: Playlist;
  items: PlaylistItem[];
};
