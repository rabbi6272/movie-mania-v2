import type { Metadata } from "next";

import { SignupForm } from "@/components/auth/SignupForm";
import { NOINDEX_ROBOTS } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Sign up",
  description:
    "Create a free MovieMania account to search titles, track what you have watched and share playlists.",
  alternates: { canonical: "/signup" },
  robots: NOINDEX_ROBOTS,
};

export default function SignupPage() {
  return <SignupForm />;
}
