import type { Metadata } from "next";

import { PlaylistDetailClient } from "@/components/playlists/PlaylistDetailClient";
import { NOINDEX_ROBOTS } from "@/lib/seo";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: "Playlist",
    description: "A private MovieMania playlist.",
    alternates: { canonical: `/playlists/${id}` },
    robots: NOINDEX_ROBOTS,
  };
}

export default function PlaylistDetailPage() {
  return <PlaylistDetailClient />;
}
