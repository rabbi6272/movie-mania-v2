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
  return getPopularDetailParams("tv");
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id: rawId } = await params;
  const id = parseId(rawId);
  const detail = await getDetail("tv", id);
  if (!detail) return {};
  return buildDetailMetadata("tv", detail, id);
}

export default async function TVDetailPage({ params }: PageProps) {
  const { id: rawId } = await params;
  const id = parseId(rawId);
  const detail = await getDetail("tv", id);
  const jsonLd = detail ? buildDetailJsonLd("tv", detail, id) : [];

  return (
    <>
      {jsonLd.map((data, index) => (
        <JsonLd key={index} data={data} />
      ))}
      <SeparateMoviePage contentId={String(id)} mediaType="tv" />
    </>
  );
}
