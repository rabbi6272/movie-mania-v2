import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/Button";

// Next already emits `noindex` for 404 responses, so no robots override here.
export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <div className="w-full h-[calc(100vh-70px-32px)] flex flex-col items-center justify-center text-center px-4">
      <span className="material-symbols-outlined text-6xl text-gray-300">search_off</span>
      <h1 className="text-3xl font-nunito font-bold text-gray-700 mt-3">
        This page doesn&apos;t exist
      </h1>
      <p className="text-sm text-gray-500 mt-2 max-w-md">
        The link may be broken, or the title you were looking for has moved.
      </p>
      <div className="flex items-center gap-3 mt-6">
        <Button href="/" varient="primary" size="md" icon="home">
          Go home
        </Button>
        <Link
          href="/search"
          className="text-sm font-semibold text-gray-700 hover:text-black transition-colors"
        >
          Search movies
        </Link>
      </div>
    </div>
  );
}
