"use client";
import { Search } from "lucide-react";

import { ttTrailer } from "@/app/ui/fonts";

import { IconNav, type NavItem } from "@/components/GlassNav";
import { UserAvatar } from "@/components/UserAvatar";
import { useScrollShrunk } from "@/hooks/useScrollShrunk";

const ITEMS: NavItem[] = [
  {
    key: "home",
    label: "MovieMania — home",
    href: "/",
    matches: (pathname) => pathname === "/",
    className: "gnav-brand",
    render: () => <span className={ttTrailer.className}>MovieMania</span>,
  },
  {
    key: "search",
    label: "Search for movies and TV shows",
    href: "/search",
    matches: (pathname) => pathname.startsWith("/search"),
    render: () => <Search size={19} strokeWidth={2} />,
  },
];

export default function Navbar() {
  const scrolled = useScrollShrunk();

  return (
    <header
      className="gnav-shell"
      data-surface="glass"
      data-scrolled={scrolled ? "true" : "false"}
    >
      <IconNav
        items={ITEMS}
        className="gnav-bar"
        ariaLabel="Main"
        end={<UserAvatar size="md" />}
      />
    </header>
  );
}
