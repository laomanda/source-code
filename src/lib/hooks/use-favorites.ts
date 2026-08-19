"use client";

import * as React from "react";
import { toast } from "sonner";
import { CategoryType } from "@/types";

export interface FavoriteItem {
  slug: string;
  title: string;
  category?: CategoryType | string;
  technology?: string;
  addedAt?: string;
}

const FAVORITES_STORAGE_KEY = "jakdev_favorites_items";
const OLD_FAVORITES_KEY = "jakdev_favorites";
const FAVORITES_EVENT_NAME = "jakdev:favorites-changed";
const DRAWER_EVENT_NAME = "jakdev:favorites-drawer-toggle";

export function useFavorites() {
  const [favoriteItems, setFavoriteItems] = React.useState<FavoriteItem[]>([]);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  // Load favorites from localStorage
  const loadFavorites = React.useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setFavoriteItems(parsed);
        }
      } else {
        // Fallback / migration from old slug-only array if exists
        const oldStored = localStorage.getItem(OLD_FAVORITES_KEY);
        if (oldStored) {
          const oldParsed = JSON.parse(oldStored);
          if (Array.isArray(oldParsed)) {
            const migrated: FavoriteItem[] = oldParsed.map((slug: string) => ({
              slug,
              title: slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
              category: "Components",
              technology: "React · Tailwind",
            }));
            setFavoriteItems(migrated);
            localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(migrated));
          }
        } else {
          setFavoriteItems([]);
        }
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

    const handleDrawerToggle = (e: Event) => {
      const custom = e as CustomEvent<{ open?: boolean }>;
      if (custom.detail?.open !== undefined) {
        setIsDrawerOpen(custom.detail.open);
      } else {
        setIsDrawerOpen((prev) => !prev);
      }
    };

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === FAVORITES_STORAGE_KEY || e.key === OLD_FAVORITES_KEY) {
        loadFavorites();
      }
    };

    window.addEventListener(FAVORITES_EVENT_NAME, handleCustomEvent);
    window.addEventListener(DRAWER_EVENT_NAME, handleDrawerToggle);
    window.addEventListener("storage", handleStorageEvent);

    return () => {
      window.removeEventListener(FAVORITES_EVENT_NAME, handleCustomEvent);
      window.removeEventListener(DRAWER_EVENT_NAME, handleDrawerToggle);
      window.removeEventListener("storage", handleStorageEvent);
    };
  }, [loadFavorites]);

  const favorites = React.useMemo(() => {
    return favoriteItems.map((item) => item.slug);
  }, [favoriteItems]);

  const isFavorite = React.useCallback(
    (slug: string) => {
      return favoriteItems.some((item) => item.slug === slug);
    },
    [favoriteItems]
  );

  const toggleFavorite = React.useCallback(
    (itemOrSlug: string | FavoriteItem, title?: string) => {
      if (typeof window === "undefined") return;

      const slug = typeof itemOrSlug === "string" ? itemOrSlug : itemOrSlug.slug;
      const itemTitle =
        typeof itemOrSlug === "string"
          ? title || slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
          : itemOrSlug.title;
      const category = typeof itemOrSlug === "string" ? "Components" : itemOrSlug.category || "Components";
      const technology = typeof itemOrSlug === "string" ? "React · Tailwind" : itemOrSlug.technology || "React · Tailwind";

      try {
        let updated: FavoriteItem[];
        const alreadyFav = favoriteItems.some((i) => i.slug === slug);

        if (alreadyFav) {
          updated = favoriteItems.filter((i) => i.slug !== slug);
          toast("Removed from Favorites", {
            description: `"${itemTitle}" was removed.`,
          });
        } else {
          const newItem: FavoriteItem = {
            slug,
            title: itemTitle,
            category,
            technology,
            addedAt: new Date().toISOString(),
          };
          updated = [newItem, ...favoriteItems];
          toast.success("Added to Favorites!", {
            description: `"${itemTitle}" saved to your favorites.`,
          });
        }

        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
        // Keep old key synced for backwards compatibility
        localStorage.setItem(OLD_FAVORITES_KEY, JSON.stringify(updated.map((i) => i.slug)));
        setFavoriteItems(updated);

        // Notify other components
        window.dispatchEvent(new Event(FAVORITES_EVENT_NAME));
      } catch (err) {
        console.error("Failed to update favorites:", err);
      }
    },
    [favoriteItems]
  );

  const removeFavorite = React.useCallback(
    (slug: string) => {
      if (typeof window === "undefined") return;
      const target = favoriteItems.find((i) => i.slug === slug);
      const updated = favoriteItems.filter((i) => i.slug !== slug);
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(updated));
      localStorage.setItem(OLD_FAVORITES_KEY, JSON.stringify(updated.map((i) => i.slug)));
      setFavoriteItems(updated);
      window.dispatchEvent(new Event(FAVORITES_EVENT_NAME));
      if (target) {
        toast("Removed from Favorites", {
          description: `"${target.title}" was removed.`,
        });
      }
    },
    [favoriteItems]
  );

  const clearFavorites = React.useCallback(() => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(FAVORITES_STORAGE_KEY);
    localStorage.removeItem(OLD_FAVORITES_KEY);
    setFavoriteItems([]);
    window.dispatchEvent(new Event(FAVORITES_EVENT_NAME));
    toast.success("All favorites cleared");
  }, []);

  const openDrawer = React.useCallback(() => {
    setIsDrawerOpen(true);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(DRAWER_EVENT_NAME, { detail: { open: true } }));
    }
  }, []);

  const closeDrawer = React.useCallback(() => {
    setIsDrawerOpen(false);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(DRAWER_EVENT_NAME, { detail: { open: false } }));
    }
  }, []);

  return {
    favorites,
    favoriteItems,
    isLoaded,
    isFavorite,
    toggleFavorite,
    removeFavorite,
    clearFavorites,
    favoriteCount: favoriteItems.length,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
  };
}
