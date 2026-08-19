"use client";

import * as React from "react";
import Link from "next/link";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useFavorites } from "@/lib/hooks/use-favorites";
import {
  Bookmark,
  Search,
  Trash2,
  ArrowRight,
  Sparkles,
  X,
} from "lucide-react";

export default function FavoritesPage() {
  const { favoriteItems, isLoaded, removeFavorite, clearFavorites } = useFavorites();
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredItems = React.useMemo(() => {
    if (!searchQuery.trim()) return favoriteItems;
    const tokens = searchQuery.toLowerCase().trim().split(/\s+/).filter(Boolean);

    return favoriteItems.filter((item) => {
      const titleLower = item.title.toLowerCase();
      const slugLower = item.slug.toLowerCase();
      const catLower = (item.category || "").toLowerCase();
      const techLower = (item.technology || "").toLowerCase();

      return tokens.every(
        (t) =>
          titleLower.includes(t) ||
          slugLower.includes(t) ||
          catLower.includes(t) ||
          techLower.includes(t)
      );
    });
  }, [favoriteItems, searchQuery]);

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#272343] selection:bg-[#FFD803] selection:text-[#272343]">
      <Navbar />
      <main className="flex-1 py-8 sm:py-12 bg-white">
        <Container size="xl" className="space-y-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#BAE8E8]/60 pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E3F6F5] border border-[#BAE8E8] text-xs font-semibold text-[#272343]">
                <Bookmark className="h-3.5 w-3.5 fill-[#FFD803] text-[#272343]" />
                <span>Saved Components</span>
              </div>
              <h1 className="text-h1">Your Bookmarked Favorites</h1>
              <p className="text-body text-[#2D334A]/80 max-w-2xl">
                Quick access to all your saved components, blocks, and templates stored directly in your browser.
              </p>
            </div>

            {isLoaded && favoriteItems.length > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={clearFavorites}
                  className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 gap-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Clear All Favorites</span>
                </Button>
                <Button asChild variant="primary" size="sm" className="font-semibold gap-1.5">
                  <Link href="/library">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Explore Library</span>
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
                placeholder="Search within saved favorites (e.g. 'button', 'navbar')..."
                className="pl-10 pr-10 h-10 bg-white border-[#BAE8E8] shadow-soft-sm text-xs"
                aria-label="Filter saved favorites"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#2D334A]/60 hover:text-[#272343] rounded"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Grid or Empty State */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <Card
                  key={item.slug}
                  interactive
                  className="flex flex-col justify-between group hover:border-[#8CD3D3] transition-all duration-200 bg-white shadow-soft"
                >
                  <div>
                    {/* Top Tag Area */}
                    <div className="h-28 w-full rounded-t-lg bg-gradient-to-b from-[#E3F6F5]/60 to-[#E3F6F5]/20 border-b border-[#BAE8E8]/70 p-3.5 flex items-start justify-between">
                      <Badge variant="navy" size="sm">
                        {item.category || "Components"}
                      </Badge>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeFavorite(item.slug);
                        }}
                        className="p-1.5 rounded-lg bg-white/90 border border-[#BAE8E8] text-[#2D334A]/70 hover:text-rose-600 hover:bg-rose-50 shadow-soft-sm transition-colors"
                        title="Remove from favorites"
                        aria-label={`Remove ${item.title} from favorites`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Content Area */}
                    <CardHeader className="pb-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" size="sm" className="font-mono text-[11px]">
                          {item.technology || "React · Tailwind"}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg group-hover:text-[#272343] transition-colors leading-snug">
                        {item.title}
                      </CardTitle>
                      <CardDescription className="text-xs font-mono text-[#2D334A]/60">
                        /{item.slug}
                      </CardDescription>
                    </CardHeader>
                  </div>

                  {/* Footer & Action */}
                  <CardFooter className="pt-3 border-t border-[#BAE8E8]/40 justify-between items-center">
                    <span className="text-[11px] font-mono text-[#0D6E6E] font-medium">Free Code</span>
                    <Button asChild size="sm" variant="primary">
                      <Link href={`/resource/${item.slug}`} className="flex items-center gap-1.5 font-semibold text-xs">
                        <span>Inspect Code</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 px-4 rounded-2xl border border-dashed border-[#BAE8E8] bg-white space-y-4 max-w-md mx-auto shadow-soft-sm">
              <div className="h-14 w-14 rounded-full bg-[#E3F6F5] border border-[#BAE8E8] flex items-center justify-center mx-auto text-[#272343]">
                <Bookmark className="h-7 w-7 text-[#2D334A]/60" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-heading font-bold text-[#272343]">
                  {searchQuery ? "No Matching Favorites Found" : "No Bookmarked Favorites"}
                </h3>
                <p className="text-xs text-[#2D334A]/80 leading-relaxed max-w-xs mx-auto">
                  {searchQuery
                    ? `No saved components match "${searchQuery}". Try clearing the search.`
                    : "You haven't saved any components to your favorites yet. Click the bookmark icon on any component in the library to save it here."}
                </p>
              </div>
              {searchQuery ? (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search
                </Button>
              ) : (
                <Button asChild variant="primary" size="default" className="font-semibold shadow-soft-sm">
                  <Link href="/library" className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    <span>Browse Component Library</span>
                  </Link>
                </Button>
              )}
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </div>
  );
}
