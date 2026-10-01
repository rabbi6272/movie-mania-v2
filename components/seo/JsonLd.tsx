import { buildJsonLd } from "@/lib/seo";

interface JsonLdProps {
  data: unknown;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: buildJsonLd(data) }}
    />
  );
}
