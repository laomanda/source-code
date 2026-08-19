"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Resource, CategoryType } from "@/types";
import { ResourceCard } from "@/components/library/resource-card";
import { EmptyState } from "@/components/library/empty-state";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/lib/hooks/use-favorites";
import { smartSearchResources } from "@/lib/search/smart-search";
import {
  Search,
  X,
  Layers,
  ArrowUpDown,
  Bookmark,
  Sparkles,
} from "lucide-react";

export interface LibraryViewProps {
  initialResources?: Resource[];
}

const POPULAR_SEARCH_KEYWORDS = [
  "Button",
  "Navbar",
  "Hero",
  "Canvas",
  "Responsive",
  "Tailwind",
];

export function LibraryView({ initialResources = [] }: LibraryViewProps) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("search") || "";

  const [searchQuery, setSearchQuery] = React.useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = React.useState<"All" | CategoryType>("All");
  const [selectedTechnology, setSelectedTechnology] = React.useState<string>("All");
  const [showFavoritesOnly, setShowFavoritesOnly] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<"newest" | "relevance" | "alpha" | "oldest">(
    initialQuery ? "relevance" : "newest"
  );
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const { favorites, isLoaded } = useFavorites();

  // Sync initial query from URL search params if present
  React.useEffect(() => {
    const q = searchParams.get("search");
    if (q) {
      setSearchQuery(q);
      setSortBy("relevance");
    }
  }, [searchParams]);

  // Focus shortcut listener ('/' key)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Distinct technologies from dataset
  const techOptions = React.useMemo(() => {
    return ["All", "React", "Next.js", "Tailwind", "TypeScript", "HTML"];
  }, []);

  const categories: Array<"All" | CategoryType> = [
    "All",
    "Components",
    "Blocks",
    "Pages",
    "Templates",
  ];

  // Category counts
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = { All: initialResources.length };
    initialResources.forEach((r) => {
      counts[r.category] = (counts[r.category] || 0) + 1;
    });
    return counts;
  }, [initialResources]);

  // Filter and sort resources using Smart Search Engine
  const filteredResources = React.useMemo(() => {
    let baseList = initialResources;

    // Favorites only filter
    if (showFavoritesOnly) {
      baseList = baseList.filter((r) => favorites.includes(r.slug));
    }

    // Category filter
    if (selectedCategory !== "All") {
      baseList = baseList.filter((r) => r.category === selectedCategory);
    }

    // Technology filter
    if (selectedTechnology !== "All") {
      baseList = baseList.filter((r) =>
        r.technology.toLowerCase().includes(selectedTechnology.toLowerCase())
      );
    }

    // Smart Search Query Evaluation
    if (searchQuery.trim()) {
      const searchResults = smartSearchResources(baseList, searchQuery);

      if (sortBy === "relevance") {
        return searchResults.map((res) => res.item);
      }

      // If user selected specific sort order (e.g. newest / alpha / oldest)
      const matchingItems = searchResults.map((res) => res.item);
      return [...matchingItems].sort((a, b) => {
        if (sortBy === "alpha") {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === "oldest") {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    }

    // Standard Sorting when no search query
    return [...baseList].sort((a, b) => {
      if (sortBy === "alpha") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      // default: newest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [
    initialResources,
    showFavoritesOnly,
    favorites,
    searchQuery,
    selectedCategory,
    selectedTechnology,
    sortBy,
  ]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedTechnology("All");
    setShowFavoritesOnly(false);
    setSortBy("newest");
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedCategory !== "All" ||
    selectedTechnology !== "All" ||
    showFavoritesOnly;

  return (
    <div className="py-8 sm:py-12 bg-white min-h-[calc(100vh-4rem)]">
      <Container size="xl" className="space-y-8">
        {/* Header Title Section */}
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E3F6F5] border border-[#BAE8E8] text-xs font-semibold text-[#272343]">
            <Layers className="h-3.5 w-3.5" />
            <span>Developer Source-Code Catalog</span>
          </div>
          <h1 className="text-h1">Explore Source Code Library</h1>
          <p className="text-body text-[#2D334A]/80">
            Browse, search, and copy free ready-to-use components, blocks, and templates. Filter by technology, bookmark your favorites, and verify responsiveness.
          </p>
        </div>

        {/* Controls Bar: Smart Search & Sort */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Smart Search Input with Shortcut and Clear */}
            <div className="md:col-span-8 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2D334A]/50" />
              <Input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (e.target.value && sortBy === "newest") {
                    setSortBy("relevance");
                  }
                }}
                placeholder="Smart Search (e.g. 'button react', 'hero banner', 'navbar mobile')..."
                className="pl-10 pr-20 h-11 bg-white border-[#BAE8E8] shadow-soft-sm text-sm"
                aria-label="Smart search resources"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      searchInputRef.current?.focus();
                    }}
                    className="p-1 text-[#2D334A]/60 hover:text-[#272343] rounded"
                    aria-label="Clear search query"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : (
                  <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-[#2D334A]/60 bg-[#E3F6F5] border border-[#BAE8E8] rounded shadow-soft-xs">
                    /
                  </kbd>
                )}
              </div>
            </div>

            {/* Sort Selector */}
            <div className="md:col-span-4 flex items-center justify-end gap-2">
              <span className="text-xs text-[#2D334A]/70 flex items-center gap-1 whitespace-nowrap">
                <ArrowUpDown className="h-3.5 w-3.5" />
                <span>Sort:</span>
              </span>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as "newest" | "relevance" | "alpha" | "oldest"
                  )
                }
                className="h-11 rounded-md border border-[#BAE8E8] bg-white px-3 py-2 text-xs font-medium text-[#272343] shadow-soft-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343]"
                aria-label="Sort resources"
              >
                {searchQuery && <option value="relevance">Most Relevant</option>}
                <option value="newest">Newest First</option>
                <option value="alpha">Alphabetical (A–Z)</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Popular Suggestions Quick Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#2D334A]/70">
            <span className="inline-flex items-center gap-1 font-semibold text-[#272343] mr-1 text-[11px]">
              <Sparkles className="h-3 w-3 text-[#0D6E6E]" />
              Popular:
            </span>
            {POPULAR_SEARCH_KEYWORDS.map((kw) => (
              <button
                key={kw}
                type="button"
                onClick={() => {
                  setSearchQuery(kw);
                  setSortBy("relevance");
                  searchInputRef.current?.focus();
                }}
                className={`px-2 py-0.5 rounded-md border text-[11px] font-medium transition-colors ${
                  searchQuery.toLowerCase() === kw.toLowerCase()
                    ? "bg-[#FFD803] border-[#F2CD00] text-[#272343] font-bold"
                    : "bg-[#FBFDFD] border-[#BAE8E8] text-[#2D334A] hover:bg-[#E3F6F5] hover:text-[#272343]"
                }`}
              >
                {kw}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Section: Category Tabs & Favorites Toggle & Technology Pills */}
        <div className="space-y-4 pt-2 border-t border-[#BAE8E8]/60">
          {/* Category Tabs + Favorites Tab */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#272343] mr-2 flex items-center gap-1">
              <span>Category:</span>
            </span>

            {/* Standard Category Tabs */}
            {categories.map((category) => {
              const count = categoryCounts[category] || 0;
              const isSelected = !showFavoritesOnly && selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => {
                    setShowFavoritesOnly(false);
                    setSelectedCategory(category);
                  }}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343] ${
                    isSelected
                      ? "bg-[#272343] text-white shadow-soft-sm font-semibold"
                      : "bg-[#E3F6F5]/60 text-[#2D334A] border border-[#BAE8E8]/60 hover:bg-[#E3F6F5] hover:text-[#272343]"
                  }`}
                >
                  <span>{category}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isSelected
                        ? "bg-[#FFD803] text-[#272343] font-bold"
                        : "bg-white/80 text-[#2D334A]/70"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}

            {/* Favorites Tab Button */}
            <button
              type="button"
              onClick={() => setShowFavoritesOnly((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343] ${
                showFavoritesOnly
                  ? "bg-[#FFD803] text-[#272343] border-[#F2CD00] font-bold shadow-soft-sm"
                  : "bg-white text-[#2D334A] border-[#BAE8E8] hover:bg-[#E3F6F5]/60"
              }`}
              title="Show only bookmarked favorites"
            >
              <Bookmark
                className={`h-3.5 w-3.5 ${
                  showFavoritesOnly
                    ? "fill-[#272343] text-[#272343]"
                    : "text-[#2D334A]/70"
                }`}
              />
              <span>Favorites</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  showFavoritesOnly
                    ? "bg-[#272343] text-[#FFD803] font-bold"
                    : "bg-[#E3F6F5] text-[#2D334A]/80"
                }`}
              >
                {isLoaded ? favorites.length : 0}
              </span>
            </button>
          </div>

          {/* Technology Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-semibold text-[#272343] mr-2 flex items-center gap-1">
              <span>Tech:</span>
            </span>
            {techOptions.map((tech) => {
              const isSelected = selectedTechnology === tech;
              return (
                <button
                  key={tech}
                  type="button"
                  onClick={() => setSelectedTechnology(tech)}
                  className={`px-3 py-1 rounded-full text-xs transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343] ${
                    isSelected
                      ? "bg-[#FFD803] text-[#272343] font-bold border border-[#F2CD00] shadow-soft-sm"
                      : "bg-white text-[#2D334A] border border-[#BAE8E8] hover:bg-[#E3F6F5]/50"
                  }`}
                >
                  {tech}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter & Active Filter Dismissals */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-b border-[#BAE8E8]/60 pb-4">
          <div className="flex items-center gap-2 text-xs text-[#2D334A]">
            {showFavoritesOnly && (
              <span className="inline-flex items-center gap-1 font-semibold text-[#0D6E6E] bg-[#E3F6F5] px-2 py-0.5 rounded">
                <Bookmark className="h-3 w-3 fill-[#0D6E6E]" />
                Bookmarked
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#272343] bg-[#E3F6F5] border border-[#BAE8E8] px-2 py-0.5 rounded">
                &ldquo;{searchQuery}&rdquo;
              </span>
            )}
            <span className="font-semibold text-[#272343]">
              {filteredResources.length}
            </span>
            <span>
              {filteredResources.length === 1 ? "resource found" : "resources found"}
            </span>
          </div>

          {hasActiveFilters && (
            <Button
              type="button"
              onClick={handleResetFilters}
              variant="ghost"
              size="sm"
              className="text-xs text-[#2D334A]/70 hover:text-[#272343] gap-1 h-8"
            >
              <X className="h-3.5 w-3.5" />
              <span>Clear all filters</span>
            </Button>
          )}
        </div>

        {/* Resource Grid or Empty State */}
        {filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {filteredResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : showFavoritesOnly ? (
          <div className="text-center py-16 px-4 rounded-xl border border-dashed border-[#BAE8E8] bg-white space-y-4 max-w-md mx-auto shadow-soft-sm">
            <div className="h-12 w-12 rounded-full bg-[#E3F6F5] border border-[#BAE8E8] flex items-center justify-center mx-auto text-[#272343]">
              <Bookmark className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-heading font-bold text-[#272343]">
                No Favorites Saved Yet
              </h3>
              <p className="text-xs text-[#2D334A]/80 leading-relaxed">
                Click the bookmark icon on any component card to save it here for instant access without signing in.
              </p>
            </div>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => setShowFavoritesOnly(false)}
              className="font-semibold"
            >
              Explore All Components
            </Button>
          </div>
        ) : (
          <EmptyState searchQuery={searchQuery} onReset={handleResetFilters} />
        )}
      </Container>
    </div>
  );
}
