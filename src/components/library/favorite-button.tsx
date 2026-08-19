"use client";

import * as React from "react";
import { useFavorites } from "@/lib/hooks/use-favorites";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";

export interface FavoriteButtonProps {
  slug: string;
  title?: string;
  showLabel?: boolean;
  size?: "sm" | "default" | "icon-sm";
  variant?: "ghost" | "outline" | "primary" | "secondary";
  className?: string;
}

export function FavoriteButton({
  slug,
  title,
  showLabel = false,
  size = "icon-sm",
  variant = "outline",
  className = "",
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, isLoaded } = useFavorites();
  const active = isLoaded && isFavorite(slug);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(slug, title);
  };

  return (
    <Button
      type="button"
      onClick={handleClick}
      variant={active ? "secondary" : variant}
      size={showLabel ? "sm" : size}
      aria-label={active ? `Remove ${title || slug} from favorites` : `Add ${title || slug} to favorites`}
      aria-pressed={active}
      title={active ? "Remove from Favorites" : "Add to Favorites"}
      className={`transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343] ${
        active
          ? "bg-[#FFD803] text-[#272343] border-[#F2CD00] hover:bg-[#F2CD00] shadow-soft-sm font-semibold"
          : "text-[#2D334A]/80 hover:text-[#272343] hover:bg-[#E3F6F5] border-[#BAE8E8]/70"
      } ${className}`}
    >
      <Bookmark
        className={`h-3.5 w-3.5 transition-transform active:scale-125 ${
          active ? "fill-[#272343] text-[#272343]" : "text-[#2D334A]/70"
        }`}
      />
      {showLabel && (
        <span className="text-xs font-medium ml-1.5">
          {active ? "Favorited" : "Favorite"}
        </span>
      )}
    </Button>
  );
}
