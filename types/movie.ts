export type Movie = {
  id: string;
  tmdbId: number;
  media_type: "movie" | "tv";
  title: string;
  poster_path: string | null;
  release_date: string | null;
  vote_average: number | null;
  watched: boolean;
};
