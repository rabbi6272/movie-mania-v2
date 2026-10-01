import type { Metadata } from "next";
import { Suspense } from "react";

import { INDEXABLE_ROBOTS } from "@/lib/seo";

import { SearchClient } from "./SearchClient";

export const metadata: Metadata = {
  title: "Search movies & TV shows",
  description:
    "Search for any movie or TV show, filter by title type, and open ratings, trailers and cast details.",
  alternates: { canonical: "/search" },
  robots: INDEXABLE_ROBOTS,
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="w-full pb-8" aria-hidden="true" />}>
      <SearchClient />
    </Suspense>
  );
}
