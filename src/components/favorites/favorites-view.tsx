"use client";

import * as React from "react";
import Link from "next/link";
import { Resource, CategoryType } from "@/types";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ResourceCard } from "@/components/library/resource-card";
import { useFavorites } from "@/lib/hooks/use-favorites";
import {
  Bookmark,
  Search,
  Trash2,
  Sparkles,
  X,
  ChevronDown,
} from "lucide-react";

export interface FavoritesViewProps {
  allResources: Resource[];
}

const PAGE_SIZE = 12;

export function FavoritesView({ allResources }: FavoritesViewProps) {
  const { favoriteItems, isLoaded, clearFavorites } = useFavorites();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE);

  // Map saved favorite items to complete Resource objects for rendering ResourceCard
  const favoriteResources = React.useMemo<Resource[]>(() => {
    const resourceMap = new Map(allResources.map((r) => [r.slug, r]));

    return favoriteItems.map((item) => {
      const existing = resourceMap.get(item.slug);
      if (existing) return existing;

      // Fallback Resource object if item is not currently in fetched resources list
      return {
        id: item.slug,
        title: item.title,
        slug: item.slug,
        description: "",
        category: (item.category as CategoryType) || "Components",
        technology: item.technology || "React · Tailwind",
        tags: [],
        sourceCode: "",
        previewHtml: null,
        previewImageUrl: null,
        responsive: { desktop: true, tablet: true, mobile: true },
        status: "published" as const,
        createdAt: item.addedAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });
  }, [allResources, favoriteItems]);

  // Filter favorite resources by search term
  const filteredResources = React.useMemo<Resource[]>(() => {
    if (!searchQuery.trim()) return favoriteResources;
    const tokens = searchQuery.toLowerCase().trim().split(/\s+/).filter(Boolean);

    return favoriteResources.filter((res) => {
      const titleLower = res.title.toLowerCase();
      const slugLower = res.slug.toLowerCase();
      const catLower = (res.category || "").toLowerCase();
      const techLower = (res.technology || "").toLowerCase();
      const tagsLower = (res.tags || []).join(" ").toLowerCase();

      return tokens.every(
        (t) =>
          titleLower.includes(t) ||
          slugLower.includes(t) ||
          catLower.includes(t) ||
          techLower.includes(t) ||
          tagsLower.includes(t)
      );
    });
  }, [favoriteResources, searchQuery]);

  // Reset pagination count back to 12 whenever search query changes
  React.useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchQuery]);

  // Slice displayed resources up to visibleCount (12 per batch)
  const displayedResources = React.useMemo(() => {
    return filteredResources.slice(0, visibleCount);
  }, [filteredResources, visibleCount]);

  const hasMore = visibleCount < filteredResources.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  return (
    <div className="py-8 sm:py-12 bg-white min-h-[calc(100vh-12rem)]">
      <Container size="xl" className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#BAE8E8]/60 pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-[#272343] tracking-tight">
              Komponen Favorit Anda
            </h1>
            <p className="text-xs sm:text-sm text-[#2D334A]/80">
              Daftar komponen yang Anda simpan di browser untuk akses cepat.
            </p>
          </div>

          {isLoaded && favoriteItems.length > 0 && (
            <div className="flex items-center gap-2.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearFavorites}
                className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200 gap-1.5 shadow-xs"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Hapus Semua Favorit</span>
              </Button>
              <Button asChild variant="primary" size="sm" className="font-semibold gap-1.5 shadow-xs">
                <Link href="/library">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Jelajahi Pustaka</span>
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Search Bar for Favorites (if multiple items) */}
        {favoriteItems.length > 2 && (
          <div className="max-w-md relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2D334A]/50" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari di daftar favorit (cth. 'button', 'navbar')..."
              className="pl-10 pr-10 h-10 bg-white border-[#BAE8E8] shadow-xs text-xs focus-visible:ring-[#272343]"
              aria-label="Filter favorit tersimpan"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#2D334A]/60 hover:text-[#272343] rounded"
                aria-label="Reset pencarian"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}

        {/* Grid of Resource Cards or Empty State */}
        {filteredResources.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedResources.map((resource) => (
                <ResourceCard key={resource.slug} resource={resource} />
              ))}
            </div>

            {/* Load More Button (12 items per batch) */}
            {hasMore ? (
              <div className="flex flex-col items-center justify-center pt-6 pb-4 space-y-2.5">
                <Button
                  type="button"
                  onClick={handleLoadMore}
                  variant="primary"
                  size="default"
                  className="gap-2 px-8 py-2.5 font-bold shadow-soft-sm hover:shadow-soft hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  <span>Lihat Lebih Banyak</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <p className="text-xs text-[#2D334A]/70 font-mono">
                  Menampilkan {displayedResources.length} dari{" "}
                  {filteredResources.length} komponen (+12 per klik)
                </p>
              </div>
            ) : filteredResources.length > PAGE_SIZE ? (
              <div className="text-center py-6 border-t border-[#BAE8E8]/50">
                <p className="text-xs text-[#2D334A]/60 font-medium font-mono">
                  Semua {filteredResources.length} komponen favorit telah ditampilkan.
                </p>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="text-center py-20 px-4 rounded-2xl border border-dashed border-[#BAE8E8] bg-white space-y-4 max-w-md mx-auto shadow-xs">
            <div className="h-14 w-14 rounded-full bg-[#E3F6F5] border border-[#BAE8E8] flex items-center justify-center mx-auto text-[#272343]">
              <Bookmark className="h-7 w-7 text-[#2D334A]/60" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-heading font-bold text-[#272343]">
                {searchQuery ? "Tidak Ada Favorit yang Cocok" : "Belum Ada Komponen Favorit"}
              </h3>
              <p className="text-xs text-[#2D334A]/80 leading-relaxed max-w-xs mx-auto">
                {searchQuery
                  ? `Tidak ada komponen tersimpan yang cocok dengan "${searchQuery}". Coba reset pencarian.`
                  : "Anda belum menyimpan komponen apa pun ke favorit. Klik ikon bookmark pada komponen mana pun di pustaka untuk menyimpannya di sini."}
              </p>
            </div>
            {searchQuery ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSearchQuery("")}
              >
                Reset Pencarian
              </Button>
            ) : (
              <Button asChild variant="primary" size="default" className="font-semibold shadow-xs">
                <Link href="/library" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Jelajahi Pustaka Komponen</span>
                </Link>
              </Button>
            )}
          </div>
        )}
      </Container>
    </div>
  );
}
