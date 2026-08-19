"use client";

import * as React from "react";
import Link from "next/link";
import { useFavorites } from "@/lib/hooks/use-favorites";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bookmark,
  X,
  Trash2,
  ArrowRight,
  Sparkles,
  Layers,
} from "lucide-react";

export function FavoritesDrawer() {
  const {
    favoriteItems,
    favoriteCount,
    isDrawerOpen,
    closeDrawer,
    removeFavorite,
    clearFavorites,
  } = useFavorites();

  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDrawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  // Lock body scroll when drawer is open on mobile
  React.useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="favorites-drawer-title"
    >
      {/* Backdrop overlay with fade */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* Slide-over panel container */}
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-6 sm:pl-10">
        <div className="w-screen max-w-md transform bg-white shadow-soft-xl border-l border-[#BAE8E8] transition-transform duration-300 ease-in-out flex flex-col animate-in slide-in-from-right duration-300">
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#BAE8E8] bg-[#E3F6F5]/50">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-[#FFD803] flex items-center justify-center text-[#272343] shadow-soft-sm">
                <Bookmark className="h-4 w-4 fill-[#272343]" />
              </div>
              <div>
                <h2
                  id="favorites-drawer-title"
                  className="font-heading font-bold text-base text-[#272343] leading-none"
                >
                  Your Favorites
                </h2>
                <span className="text-[11px] font-mono text-[#2D334A]/70 mt-1 inline-block">
                  {favoriteCount} {favoriteCount === 1 ? "component saved" : "components saved"}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={closeDrawer}
              className="p-1.5 rounded-lg text-[#2D334A]/70 hover:text-[#272343] hover:bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343]"
              aria-label="Close favorites panel"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Drawer Body / Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {favoriteItems.length > 0 ? (
              <div className="space-y-2.5">
                {favoriteItems.map((item) => (
                  <div
                    key={item.slug}
                    className="group p-3.5 rounded-xl border border-[#BAE8E8] bg-white hover:border-[#8CD3D3] hover:bg-[#FBFDFD] shadow-soft-sm transition-all flex flex-col justify-between gap-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          {item.category && (
                            <Badge variant="navy" size="sm" className="text-[10px]">
                              {item.category}
                            </Badge>
                          )}
                          {item.technology && (
                            <span className="text-[10px] font-mono text-[#2D334A]/70 bg-[#E3F6F5]/60 px-1.5 py-0.5 rounded border border-[#BAE8E8]/60">
                              {item.technology}
                            </span>
                          )}
                        </div>
                        <Link
                          href={`/resource/${item.slug}`}
                          onClick={closeDrawer}
                          className="font-heading font-semibold text-sm text-[#272343] hover:text-[#0D6E6E] transition-colors block truncate"
                          title={item.title}
                        >
                          {item.title}
                        </Link>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeFavorite(item.slug)}
                        className="p-1.5 rounded text-[#2D334A]/50 hover:text-rose-600 hover:bg-rose-50 transition-colors shrink-0"
                        title="Remove from favorites"
                        aria-label={`Remove ${item.title} from favorites`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#BAE8E8]/40 text-xs">
                      <span className="text-[11px] font-mono text-[#0D6E6E] font-medium">
                        Free Source Code
                      </span>
                      <Button asChild size="sm" variant="primary" className="h-7 text-xs px-2.5 font-semibold">
                        <Link href={`/resource/${item.slug}`} onClick={closeDrawer} className="flex items-center gap-1">
                          <span>Inspect Code</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 px-4 space-y-4">
                <div className="h-12 w-12 rounded-full bg-[#E3F6F5] border border-[#BAE8E8] flex items-center justify-center mx-auto text-[#272343]">
                  <Bookmark className="h-6 w-6 text-[#2D334A]/60" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-sm text-[#272343]">
                    No Bookmarked Items
                  </h3>
                  <p className="text-xs text-[#2D334A]/70 leading-relaxed max-w-xs mx-auto">
                    Click the bookmark icon on any component to save it here for instant access across sessions.
                  </p>
                </div>
                <Button asChild variant="primary" size="sm" className="font-semibold shadow-soft-sm">
                  <Link href="/library" onClick={closeDrawer} className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Browse Component Library</span>
                  </Link>
                </Button>
              </div>
            )}
          </div>

          {/* Drawer Footer */}
          {favoriteItems.length > 0 && (
            <div className="p-4 border-t border-[#BAE8E8] bg-[#FBFDFD] flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearFavorites}
                className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 gap-1 h-8"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear All</span>
              </Button>

              <Button asChild variant="outline" size="sm" className="text-xs bg-white gap-1 h-8">
                <Link href="/favorites" onClick={closeDrawer}>
                  <Layers className="h-3.5 w-3.5" />
                  <span>View Full Page</span>
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
