"use client";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Avatar, Button, Dropdown } from "@heroui/react";

import { useAuth } from "@/hooks/useAuth";

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
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  const initials = useMemo(
    () => getInitials(displayName || user?.displayName, email),
    [displayName, email, user?.displayName],
  );
  const colorKey = email ?? "";
  const bgColor = useMemo(() => getAvatarColor(colorKey), [colorKey]);

  const sizeClass = SIZE_CLASSES[size];
  const avatarAlt = displayName ?? email ?? "User avatar";
  const itemClass = "px-4 py-2 text-md font-semibold text-gray-700 flex items-center gap-2 cursor-pointer";
  return (
    // keyed: logging out swaps the item id while the menu is still mounted, and React Aria throws "Cannot change the id of an item"
    <Dropdown key={isAuthenticated ? "user" : "guest"}>
      {isAuthenticated ? (
        <Dropdown.Trigger aria-label="Account menu" className="grid place-items-center rounded-full cursor-pointer">
          <Avatar className={`${sizeClass} ${className}`}>
            {user?.photoURL && <Avatar.Image src={user.photoURL} alt={avatarAlt} className="object-cover" />}
            <Avatar.Fallback className={`${bgColor} text-white font-semibold`}>{initials}</Avatar.Fallback>
          </Avatar>
        </Dropdown.Trigger>
      ) : (
        <Button variant="ghost" isIconOnly aria-label="Account menu" className="text-gray-900">
          <span className="material-symbols-outlined">person</span>
        </Button>
      )}
      <Dropdown.Popover className="min-w-30 lg:min-w-40">
        <Dropdown.Menu onAction={(key) => (key === "logout" ? logout() : router.push("/login"))}>
          {isAuthenticated ? (
            <Dropdown.Item id="logout" textValue="Logout" className={itemClass}>
              <span className="material-symbols-outlined text-[18px]">logout</span>
              Logout
            </Dropdown.Item>
          ) : (
            <Dropdown.Item id="login" textValue="Login" className={itemClass}>
              <span className="material-symbols-outlined text-[18px]">login</span>
              Login
            </Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  )
}
