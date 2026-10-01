import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo";

// No Disallow rules on purpose: /login, /signup and /playlists/[id] rely on
// meta robots noindex, which search engines can only honour if they can crawl
// the page. Blocking them here would prevent the noindex signal from being read.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/"),
  };
}
