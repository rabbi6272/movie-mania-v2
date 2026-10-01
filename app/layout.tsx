import "./globals.css";

import { Toaster } from "react-hot-toast";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next"

import Navbar from "@/components/navbar";
import Providers from "@/components/Providers";

import { nunito } from "./ui/fonts";

export const metadata = {
  title: "MovieMania || Solution for all your movie needs",
  description: "All your favorite movies in one place",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="All your favorite movies in one place"
        />
        <meta
          name="keywords"
          content="movies, streaming, watch, films, cinema, online"
        />
        <meta name="author" content="MovieMania" />
        <title>MovieMania || Solution for all your movie needs</title>
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://movimania.example.com/" />
        <meta
          property="og:title"
          content="MovieMania || Solution for all your movie needs"
        />
        <meta
          property="og:description"
          content="All your favorite movies in one place"
        />
        <meta property="og:image" content="/icon.png" />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="MovieMania || Solution for all your movie needs" />
        <meta name="twitter:description" content="All your favorite movies in one place" />
        <meta name="twitter:url" content="https://movieshub.example.com/" />
        <meta
          name="twitter:title"
          content="MovieMania || Solution for all your movie needs"
        />
        <meta
          name="twitter:description"
          content="All your favorite movies in one place"
        />
        <meta name="twitter:image" content="/icon.png" />
        <link rel="icon" href="/icon.png" />

        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
        />
      </head>
      <body
        className={`${nunito.className} antialiased bg-gray-50 text-gray-700`}
      >
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
