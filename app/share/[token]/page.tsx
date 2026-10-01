import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/JsonLd";
import { SharedPlaylistClient } from "@/components/share/SharedPlaylistClient";
import { getSharedPlaylistServer } from "@/lib/share";
import {
  INDEXABLE_ROBOTS,
  SITE_DESCRIPTION,
  SITE_NAME,
  absoluteUrl,
} from "@/lib/seo";

interface PageProps {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { token } = await params;
  const shared = await getSharedPlaylistServer(token);

  if (!shared) {
    return {
      title: "Shared playlist",
      description: SITE_DESCRIPTION,
      alternates: { canonical: `/share/${token}` },
      robots: INDEXABLE_ROBOTS,
    };
  }

  const { playlist, items } = shared;
  const title = `${playlist.name} — shared playlist`;
  const description =
    playlist.description?.trim() ||
    `A shared playlist with ${items.length} ${items.length === 1 ? "title" : "titles"} on ${SITE_NAME}.`;
  const poster = items.find((item) => item.poster_path)?.poster_path;
  const url = absoluteUrl(`/share/${token}`);

  return {
    title,
    description,
    alternates: { canonical: `/share/${token}` },
    robots: INDEXABLE_ROBOTS,
    openGraph: {
      type: "website",
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      title,
      description,
      ...(poster
        ? {
            images: [
              {
                url: `https://image.tmdb.org/t/p/w780${poster}`,
                width: 780,
                height: 1170,
                alt: playlist.name,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(poster ? { images: [`https://image.tmdb.org/t/p/w780${poster}`] } : {}),
    },
  };
}

export default async function SharedPlaylistPage({ params }: PageProps) {
  const { token } = await params;
  const shared = await getSharedPlaylistServer(token);

  const jsonLd = shared
    ? {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": absoluteUrl(`/share/${token}`),
        name: shared.playlist.name,
        description:
          shared.playlist.description?.trim() ||
          `A shared playlist with ${shared.items.length} titles on ${SITE_NAME}.`,
        url: absoluteUrl(`/share/${token}`),
        isPartOf: { "@type": "WebSite", name: SITE_NAME, url: absoluteUrl("/") },
        itemList: {
          "@type": "ItemList",
          numberOfItems: shared.items.length,
          itemListElement: shared.items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.title,
            item: absoluteUrl(`/${item.media_type === "tv" ? "tv" : "movie"}/${item.tmdbId}`),
          })),
        },
      }
    : null;

  return (
    <>
      {jsonLd ? <JsonLd data={jsonLd} /> : null}
      <SharedPlaylistClient />
    </>
  );
}
