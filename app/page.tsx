import type { Metadata } from "next";

import { HomeClient } from "@/components/home/HomeClient";
import { TrendingRow } from "@/components/home/TrendingRow";
import { INDEXABLE_ROBOTS } from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    absolute: "MovieMania — Search movies & TV shows, build your watchlist",
  },
  description:
    "Search millions of movies and TV shows, see ratings and trailers, and build playlists to share with friends.",
  alternates: { canonical: "/" },
  robots: INDEXABLE_ROBOTS,
};

export default function HomePage() {
  return <HomeClient trending={<TrendingRow />} />;
}
