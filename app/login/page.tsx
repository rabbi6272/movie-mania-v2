import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/LoginForm";
import { NOINDEX_ROBOTS } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Log in",
  description: "Sign in to MovieMania to build playlists, rate titles and keep a watchlist.",
  alternates: { canonical: "/login" },
  robots: NOINDEX_ROBOTS,
};

export default function LoginPage() {
  return <LoginForm />;
}
