import type { MetadataRoute } from "next";

import { SITE_DESCRIPTION, SITE_NAME, absoluteUrl } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#f9fafb",
    theme_color: "#111827",
    icons: [
      {
        src: absoluteUrl("/icon.png"),
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
