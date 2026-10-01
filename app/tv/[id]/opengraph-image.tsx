import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  detailImageAlt,
  renderDetailOg,
} from "@/components/seo/DetailOgImage";

export const alt = detailImageAlt("tv");
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const revalidate = 3600;

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return renderDetailOg("tv", id);
}
