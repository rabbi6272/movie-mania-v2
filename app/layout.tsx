import "./globals.css";

import type { Metadata, Viewport } from "next";
import { Toaster } from "react-hot-toast";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";

import Navbar from "@/components/navbar";
import Providers from "@/components/Providers";
import { JsonLd } from "@/components/seo/JsonLd";
import { nunito } from "./ui/fonts";
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE_TEMPLATE,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  TWITTER_HANDLE,
  absoluteUrl,
} from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl("/")),
  title: {
    default: SITE_TITLE,
    template: DEFAULT_TITLE_TEMPLATE,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "movies",
    "tv shows",
    "streaming",
    "watchlist",
    "film",
    "cinema",
    "search movies",
    "movie ratings",
    "trailers",
    "playlists",
  ],
  authors: [{ name: "MovieMania" }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "entertainment",
  openGraph: {
    type: "website",
    url: absoluteUrl("/"),
    siteName: SITE_NAME,
    locale: "en_US",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    site: TWITTER_HANDLE,
    images: [DEFAULT_OG_IMAGE.url],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: absoluteUrl("/"),
  description: SITE_DESCRIPTION,
  inLanguage: "en",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${absoluteUrl("/search")}?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: absoluteUrl("/"),
  logo: absoluteUrl("/icon.png"),
  sameAs: ["https://github.com/rabbi6272"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
      </head>
      <body
        className={`${nunito.className} antialiased bg-gray-50 text-gray-700`}
      >
        <JsonLd data={websiteJsonLd} />
        <JsonLd data={organizationJsonLd} />
        <Providers>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 2000,
            }}
          />
          <Analytics />
          <Navbar />
          <main className="min-h-[calc(100vh-70px-32px)]">
            {children}
          </main>

          <footer>
            <p className="text-sm text-gray-500 text-center mt-4 pb-3">
              Developed with ❤️ by{" "}
              <Link
                href={"https://github.com/rabbi6272"}
                target="_blank"
                className="hover:underline"
              >
                {" "}
                Rabbi
              </Link>
            </p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
