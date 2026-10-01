import type { Metadata } from "next";

import { JsonLd } from "@/components/seo/JsonLd";
import { SeparateMoviePage } from "@/components/SeparateMoviePage";
import {
  buildDetailJsonLd,
  buildDetailMetadata,
  getDetail,
  getPopularDetailParams,
  parseId,
} from "@/lib/detail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 3600;

export function generateStaticParams() {
  return getPopularDetailParams("movie");
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id: rawId } = await params;
  const id = parseId(rawId);
  const detail = await getDetail("movie", id);
  if (!detail) return {};
  return buildDetailMetadata("movie", detail, id);
}

export default async function MovieDetailPage({ params }: PageProps) {
  const { id: rawId } = await params;
  const id = parseId(rawId);
  const detail = await getDetail("movie", id);
  const jsonLd = detail ? buildDetailJsonLd("movie", detail, id) : [];

  return (
    <>
      {jsonLd.map((data, index) => (
        <JsonLd key={index} data={data} />
      ))}
      <SeparateMoviePage contentId={String(id)} mediaType="movie" />
    </>
  );
}
