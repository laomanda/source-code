"use client";

import * as React from "react";
import { toast } from "sonner";

const FAVORITES_STORAGE_KEY = "jakdev_favorites";
const FAVORITES_EVENT_NAME = "jakdev:favorites-changed";

export function useFavorites() {
  const [favorites, setFavorites] = React.useState<string[]>([]);
  const [isLoaded, setIsLoaded] = React.useState(false);

  // Load favorites from localStorage
  const loadFavorites = React.useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        }
      } else {
        setFavorites([]);
      }
    } catch (err) {
      console.warn("Failed to load favorites from localStorage:", err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  React.useEffect(() => {
    loadFavorites();

    const handleCustomEvent = () => {
      loadFavorites();
    };

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === FAVORITES_STORAGE_KEY) {
        loadFavorites();
      }
    };

    window.addEventListener(FAVORITES_EVENT_NAME, handleCustomEvent);
    window.addEventListener("storage", handleStorageEvent);

    return () => {
      window.removeEventListener(FAVORITES_EVENT_NAME, handleCustomEvent);
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, [loadFavorites]);

  const isFavorite = React.useCallback(
    (slug: string) => {
      return favorites.includes(slug);
    },
    [favorites]
  );

  const toggleFavorite = React.useCallback(
    (slug: string, title?: string) => {
      if (typeof window === "undefined") return;

      try {
        let updated: string[];
        const alreadyFav = favorites.includes(slug);

        if (alreadyFav) {
          updated = favorites.filter((s) => s !== slug);
          toast("Removed from Favorites", {
            description: title ? `"${title}" was removed.` : undefined,
          });
        } else {
          updated = [...favorites, slug];
          toast.success("Added to Favorites!", {
            description: title ? `"${title}" saved to your favorites.` : "Saved to your favorites.",
          });
        }

        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
        setFavorites(updated);

        // Notify other components
        window.dispatchEvent(new Event(FAVORITES_EVENT_NAME));
      } catch (err) {
        console.error("Failed to update favorites:", err);
      }
    },
    [favorites]
  );

  return {
    favorites,
    isLoaded,
    isFavorite,
    toggleFavorite,
    favoriteCount: favorites.length,
  };
}
