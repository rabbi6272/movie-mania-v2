"use client";
import { useState, useCallback, useMemo, useRef } from "react";
import Link from "next/link";

import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import { Button } from "./ui/Button";

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-green-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-indigo-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-amber-500",
];

function getInitials(
  displayName,
  email
) {
  if (displayName) {
    const parts = displayName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }
  if (email) {
    const clean = email.split("@")[0];
    const parts = clean.split(/[^a-zA-Z]+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return clean.substring(0, 2).toUpperCase();
  }
  return null;
}

function getAvatarColor(value) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}


const SIZE_CLASSES = {
  sm: "w-8 h-8 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-12 h-12 text-base",
};

export function UserAvatar({
  size = "md",
  className = "",
  photoURL = null,
  displayName = null,
  email = null,
}) {
  const [isShowDropdown, setIsShowDropdown] = useState(false);
  const toggleDropdown = useCallback(() => setIsShowDropdown((prev) => !prev), []);
  const closeDropdown = useCallback(() => setIsShowDropdown(false), []);
  const dropdownRef = useRef(null);

  const { user, isAuthenticated, logout } = useAuth();

  const initials = useMemo(
    () => getInitials(displayName || user?.displayName, email),
    [displayName, email, user?.displayName],
  );
  const colorKey = email ?? "";
  const bgColor = useMemo(() => getAvatarColor(colorKey), [colorKey]);

  const sizeClass = SIZE_CLASSES[size];
  const avatarSize = size === "sm" ? 32 : size === "md" ? 36 : 48;
  const avatarAlt = displayName ?? email ?? "User avatar";
  return (
    <>
      {isAuthenticated ? (
        user?.photoURL ? (
          <Image
            onClick={toggleDropdown}
            src={user.photoURL}
            alt={avatarAlt}
            width={avatarSize}
            height={avatarSize}
            className={`relative cursor-pointer rounded-full object-cover ${sizeClass} ${className}`}
          />
        ) : (
          <div
            onClick={toggleDropdown}
            className={`flex items-center justify-center rounded-full cursor-pointer ${bgColor} text-white font-semibold ${sizeClass} ${className}`}
          >
            {initials}
          </div>
        )
      ) : (
        <Button
          onClick={toggleDropdown}
          size="md" icon="person" varient="outline" className="border-none shadow-none"
        />
      )}
      {isShowDropdown && (
        <div
          className="absolute right-4 top-full mt-2 w-30 lg:w-40 backdrop-blur-xl bg-white/90 rounded-full shadow-lg border border-gray-200 py-1 z-50 overflow-hidden"
          ref={dropdownRef}
        >
          {isAuthenticated ? (
            <button
              onClick={() => {
                closeDropdown();
                logout();
              }}
              className="w-full px-4 py-2 text-left text-md font-semibold text-gray-700 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                logout
              </span>
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              onClick={closeDropdown}
              className="w-full px-4 py-2 text-left text-md font-semibold text-gray-700 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                login
              </span>
              Login
            </Link>
          )}
        </div>
      )}
    </>
  )
}

