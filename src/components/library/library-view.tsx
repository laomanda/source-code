"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Resource, CategoryType, Technology, Category } from "@/types";
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
  ArrowUpDown,
  Bookmark,
  Sparkles,
  ChevronDown,
  Layers,
  FolderTree,
} from "lucide-react";

export interface LibraryViewProps {
  initialResources?: Resource[];
  initialTechnologies?: Technology[];
  initialCategories?: Category[];
}

const PAGE_SIZE = 12;

const DEFAULT_POPULAR_KEYWORDS = [
  "Button",
  "Navbar",
  "Hero",
  "Card",
  "Canvas",
  "Modal",
  "Responsive",
  "Tailwind",
  "Dashboard",
];

const POPULARITY_STORAGE_KEY = "jakdev_popularity_v2";

const normalizeSlug = (s: string) =>
  (s || "")
    .toLowerCase()
    .trim()
    .replace(/^\/resource\//, "")
    .replace(/^\//, "");

export function LibraryView({
  initialResources = [],
  initialTechnologies = [],
  initialCategories = [],
}: LibraryViewProps) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("search") || "";

  const [searchQuery, setSearchQuery] = React.useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [selectedTechnology, setSelectedTechnology] = React.useState<string>("All");
  const [showFavoritesOnly, setShowFavoritesOnly] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<
    "newest" | "relevance" | "alpha" | "oldest"
  >(initialQuery ? "relevance" : "newest");
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Popularity Metrics State (user click counts)
  const [popularityMetrics, setPopularityMetrics] = React.useState<{
    categories: Record<string, number>;
    tags: Record<string, number>;
  }>({ categories: {}, tags: {} });

  const { favoriteItems, favorites, isLoaded } = useFavorites();

  // Load popularity metrics from localStorage
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem(POPULARITY_STORAGE_KEY);
      if (saved) {
        setPopularityMetrics(JSON.parse(saved));
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Track click helper
  const trackClick = React.useCallback(
    (type: "category" | "tag" | "resource", item: string | Resource) => {
      try {
        setPopularityMetrics((prev) => {
          const next = {
            categories: { ...prev.categories },
            tags: { ...prev.tags },
          };

          if (type === "category" && typeof item === "string" && item !== "All") {
            next.categories[item] = (next.categories[item] || 0) + 1;
          } else if (type === "tag" && typeof item === "string") {
            next.tags[item] = (next.tags[item] || 0) + 1;
          } else if (type === "resource" && typeof item === "object") {
            if (item.category) {
              next.categories[item.category] =
                (next.categories[item.category] || 0) + 1;
            }
            if (item.tags) {
              item.tags.forEach((t) => {
                next.tags[t] = (next.tags[t] || 0) + 1;
              });
            }
          }

          localStorage.setItem(POPULARITY_STORAGE_KEY, JSON.stringify(next));
          return next;
        });
      } catch {
        // Ignore
      }
    },
    [],
  );

  // Sync initial query from URL search params if present
  React.useEffect(() => {
    const q = searchParams.get("search");
    if (q) {
      setSearchQuery(q);
      setSortBy("relevance");
    }
    const cat = searchParams.get("category");
    if (cat) {
      setSelectedCategory(cat);
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

  // All distinct categories from Database (fallback to distinct categories in resources)
  const dbCategories = React.useMemo(() => {
    if (initialCategories && initialCategories.length > 0) {
      return initialCategories;
    }
    const extracted = Array.from(
      new Set(initialResources.map((r) => r.category).filter(Boolean)),
    );
    return extracted.map((name) => ({
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      description: null,
      createdAt: new Date().toISOString(),
    }));
  }, [initialCategories, initialResources]);

  // Distinct technologies from database or dataset
  const techOptions = React.useMemo(() => {
    if (initialTechnologies && initialTechnologies.length > 0) {
      return ["All", ...initialTechnologies.map((t) => t.name)];
    }
    const extracted = Array.from(
      new Set(
        initialResources.flatMap((r) =>
          r.technology.split(/[·,\/]/).map((t) => t.trim()),
        ),
      ),
    ).filter(Boolean);
    return [
      "All",
      ...(extracted.length > 0
        ? extracted
        : ["React", "Next.js", "Tailwind", "TypeScript", "HTML"]),
    ];
  }, [initialTechnologies, initialResources]);

  // Dynamic Category component counts
  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = { All: initialResources.length };
    dbCategories.forEach((cat) => {
      counts[cat.name] = initialResources.filter((r) => {
        if (r.categoryId && r.categoryId === cat.id) return true;
        if (
          r.category &&
          (r.category.toLowerCase() === cat.name.toLowerCase() ||
            r.category.toLowerCase() === cat.slug.toLowerCase())
        ) {
          return true;
        }
        return false;
      }).length;
    });
    return counts;
  }, [dbCategories, initialResources]);

  // Top Most Popular Categories (sorted by user clicks + resource count)
  const popularCategories = React.useMemo(() => {
    const scored = dbCategories.map((cat) => {
      const clickCount = popularityMetrics.categories[cat.name] || 0;
      const resCount = categoryCounts[cat.name] || 0;
      const score = clickCount * 3 + resCount * 2;
      return { ...cat, score, resCount };
    });

    // Sort descending by popularity score
    scored.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.name.localeCompare(b.name);
    });

    // Top 5 categories
    const top = scored.slice(0, 5);

    // If selected category is not in top 5, ensure it's included so active pill is visible
    if (
      selectedCategory !== "All" &&
      !top.some((c) => c.name.toLowerCase() === selectedCategory.toLowerCase())
    ) {
      const found = dbCategories.find(
        (c) => c.name.toLowerCase() === selectedCategory.toLowerCase(),
      );
      if (found) {
        top.push({
          ...found,
          score: 0,
          resCount: categoryCounts[found.name] || 0,
        });
      }
    }

    return top;
  }, [dbCategories, popularityMetrics.categories, categoryCounts, selectedCategory]);

  // Dynamic Popular Search Keywords (most clicked tags + resources tags)
  const popularKeywords = React.useMemo(() => {
    const tagScores: Record<string, number> = {};

    // 1. Base weights from actual resources tags
    initialResources.forEach((r) => {
      if (r.tags) {
        r.tags.forEach((t) => {
          const formatted = t.trim();
          if (formatted) {
            tagScores[formatted] = (tagScores[formatted] || 0) + 1;
          }
        });
      }
    });

    // 2. Default popular fallback seeds
    DEFAULT_POPULAR_KEYWORDS.forEach((kw) => {
      tagScores[kw] = (tagScores[kw] || 0) + 2;
    });

    // 3. User interaction click weights
    Object.entries(popularityMetrics.tags).forEach(([tag, count]) => {
      tagScores[tag] = (tagScores[tag] || 0) + count * 4;
    });

    // Sort by popularity score descending
    const sorted = Object.entries(tagScores)
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag);

    return sorted.slice(0, 7);
  }, [initialResources, popularityMetrics.tags]);

  // Filter and sort resources using Smart Search Engine
  const filteredResources = React.useMemo(() => {
    let baseList = initialResources;

    // Favorites only filter with robust slug matching & offline localStorage fallback
    if (showFavoritesOnly) {
      const matched = initialResources.filter((r) =>
        favoriteItems.some(
          (f) =>
            normalizeSlug(f.slug) === normalizeSlug(r.slug) ||
            normalizeSlug(f.slug) === normalizeSlug(r.id) ||
            (f.title &&
              r.title &&
              f.title.toLowerCase().trim() === r.title.toLowerCase().trim()),
        ),
      );

      const missing = favoriteItems
        .filter(
          (f) =>
            !matched.some(
              (m) =>
                normalizeSlug(m.slug) === normalizeSlug(f.slug) ||
                (f.title &&
                  m.title &&
                  m.title.toLowerCase().trim() ===
                    f.title.toLowerCase().trim()),
            ),
        )
        .map((f) => ({
          id: f.slug,
          title:
            f.title ||
            f.slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
          slug: f.slug,
          description: "Komponen yang telah disimpan di favorit Anda.",
          categoryId: null,
          category: (f.category as CategoryType) || "Components",
          techId: null,
          technology: f.technology || "React · Tailwind",
          tags: ["favorite", (f.category || "components").toLowerCase()],
          sourceCode: "",
          responsive: { desktop: true, tablet: true, mobile: true },
          status: "published" as const,
          createdAt: f.addedAt || new Date().toISOString(),
        }));

      baseList = [...matched, ...missing];
    }

    // Category filter (relational categoryId or category name)
    if (selectedCategory !== "All") {
      const selectedCatObj = dbCategories.find(
        (c) =>
          c.name.toLowerCase() === selectedCategory.toLowerCase() ||
          c.slug.toLowerCase() === selectedCategory.toLowerCase(),
      );

      baseList = baseList.filter((r) => {
        if (selectedCatObj && r.categoryId && r.categoryId === selectedCatObj.id) {
          return true;
        }
        if (
          r.category &&
          (r.category.toLowerCase() === selectedCategory.toLowerCase() ||
            (selectedCatObj &&
              r.category.toLowerCase() === selectedCatObj.slug.toLowerCase()))
        ) {
          return true;
        }
        return false;
      });
    }

    // Technology filter (supports relational techId and substring text)
    if (selectedTechnology !== "All") {
      const selectedTechObj = initialTechnologies?.find(
        (t) =>
          t.name.toLowerCase() === selectedTechnology.toLowerCase() ||
          t.slug.toLowerCase() === selectedTechnology.toLowerCase(),
      );

      baseList = baseList.filter((r) => {
        if (selectedTechObj && r.techId && r.techId === selectedTechObj.id) {
          return true;
        }
        return r.technology
          .toLowerCase()
          .includes(selectedTechnology.toLowerCase());
      });
    }

    // Smart Search Engine
    let resultList = baseList;
    if (searchQuery.trim()) {
      const searchResults = smartSearchResources(baseList, searchQuery);
      resultList = searchResults.map((res) => res.item);
    }

    // Sorting
    return [...resultList].sort((a, b) => {
      if (sortBy === "alpha") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      if (sortBy === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });
  }, [
    initialResources,
    showFavoritesOnly,
    favoriteItems,
    selectedCategory,
    dbCategories,
    selectedTechnology,
    initialTechnologies,
    searchQuery,
    sortBy,
  ]);

  // Pagination / Infinite Load state
  const [displayCount, setDisplayCount] = React.useState(PAGE_SIZE);

  // Reset pagination when query or filters change
  React.useEffect(() => {
    setDisplayCount(PAGE_SIZE);
  }, [searchQuery, selectedCategory, selectedTechnology, showFavoritesOnly, sortBy]);

  const displayedResources = React.useMemo(() => {
    return filteredResources.slice(0, displayCount);
  }, [filteredResources, displayCount]);

  const hasMore = displayCount < filteredResources.length;

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + PAGE_SIZE);
  };

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
    <div className="py-8 sm:py-12 bg-background min-h-screen">
      <Container size="xl" className="space-y-8">
        {/* Header Title & Catalog Stats */}
        <div className="space-y-3">
          <h1 className="text-h1 text-[#272343] tracking-tight">
            Katalog Source Code
          </h1>
          <p className="text-body text-[#2D334A]/80 max-w-3xl">
            Cari, coba langsung, dan salin komponen, blok, dan template siap
            pakai secara gratis. Filter berdasarkan kategori dan teknologi, simpan ke
            favorit, dan uji responsivitasnya.
          </p>

          {/* Real-time Catalog Statistics Banner */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#2D334A]/70">
            <span className="font-semibold text-[#272343] mr-1">
              Statistik Katalog:
            </span>
            <span className="inline-flex items-center gap-1 bg-[#E3F6F5]/70 px-2.5 py-0.5 rounded-full border border-[#BAE8E8] font-mono text-[11px] text-[#272343]">
              <strong>{initialResources.length}</strong> Komponen
            </span>
            <span className="inline-flex items-center gap-1 bg-[#E3F6F5]/70 px-2.5 py-0.5 rounded-full border border-[#BAE8E8] font-mono text-[11px] text-[#272343]">
              <strong>{dbCategories.length}</strong> Kategori
            </span>
            {initialTechnologies.length > 0 && (
              <span className="inline-flex items-center gap-1 bg-[#E3F6F5]/70 px-2.5 py-0.5 rounded-full border border-[#BAE8E8] font-mono text-[11px] text-[#272343]">
                <strong>{initialTechnologies.length}</strong> Teknologi
              </span>
            )}
          </div>
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
                placeholder="Pencarian Pintar (contoh: 'button react', 'hero banner', 'navbar mobile')..."
                className="pl-10 pr-10 h-11 bg-white border-[#BAE8E8] shadow-soft-sm text-sm"
                aria-label="Cari komponen sumber daya"
              />
              {searchQuery && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      searchInputRef.current?.focus();
                    }}
                    className="p-1 text-[#2D334A]/60 hover:text-[#272343] rounded"
                    aria-label="Hapus kata kunci pencarian"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Sort Selector */}
            <div className="md:col-span-4 flex items-center justify-end gap-2">
              <span className="text-xs text-[#2D334A]/70 flex items-center gap-1 whitespace-nowrap">
                <ArrowUpDown className="h-3.5 w-3.5" />
                <span>Urutkan:</span>
              </span>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as
                      | "newest"
                      | "relevance"
                      | "alpha"
                      | "oldest",
                  )
                }
                className="h-11 rounded-md border border-[#BAE8E8] bg-white px-3 py-2 text-xs font-medium text-[#272343] shadow-soft-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343] cursor-pointer"
                aria-label="Urutkan komponen"
              >
                {searchQuery && (
                  <option value="relevance">Paling Relevan</option>
                )}
                <option value="newest">Terbaru</option>
                <option value="alpha">Abjad (A–Z)</option>
                <option value="oldest">Terlama</option>
              </select>
            </div>
          </div>

          {/* Dynamic Popular Search Keywords Quick Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#2D334A]/70">
            <span className="inline-flex items-center gap-1 font-semibold text-[#272343] mr-1 text-[11px]">
              <Sparkles className="h-3 w-3 text-[#0D6E6E]" />
              Populer:
            </span>
            {popularKeywords.map((kw) => (
              <button
                key={kw}
                type="button"
                onClick={() => {
                  setSearchQuery(kw);
                  setSortBy("relevance");
                  trackClick("tag", kw);
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

        {/* Filter Section: Category Tabs, Database Dropdown & Favorites Toggle */}
        <div className="space-y-4 pt-2 border-t border-[#BAE8E8]/60">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#272343] mr-1 flex items-center gap-1">
              <FolderTree className="h-3.5 w-3.5 text-[#0D6E6E]" />
              <span>Kategori:</span>
            </span>

            {/* "Semua" Pill */}
            <button
              type="button"
              onClick={() => {
                setShowFavoritesOnly(false);
                setSelectedCategory("All");
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343] ${
                !showFavoritesOnly && selectedCategory === "All"
                  ? "bg-[#272343] text-white shadow-soft-sm font-semibold"
                  : "bg-[#E3F6F5]/60 text-[#2D334A] border border-[#BAE8E8]/60 hover:bg-[#E3F6F5] hover:text-[#272343]"
              }`}
            >
              <span>Semua</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  !showFavoritesOnly && selectedCategory === "All"
                    ? "bg-[#FFD803] text-[#272343] font-bold"
                    : "bg-white/80 text-[#2D334A]/70"
                }`}
              >
                {initialResources.length}
              </span>
            </button>

            {/* Most Popular / Most Viewed Categories Quick Pills */}
            {popularCategories.map((cat) => {
              const count = categoryCounts[cat.name] || 0;
              const isSelected =
                !showFavoritesOnly &&
                selectedCategory.toLowerCase() === cat.name.toLowerCase();

              return (
                <button
                  key={cat.id || cat.name}
                  type="button"
                  onClick={() => {
                    setShowFavoritesOnly(false);
                    setSelectedCategory(cat.name);
                    trackClick("category", cat.name);
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343] ${
                    isSelected
                      ? "bg-[#272343] text-white shadow-soft-sm font-semibold"
                      : "bg-[#E3F6F5]/60 text-[#2D334A] border border-[#BAE8E8]/60 hover:bg-[#E3F6F5] hover:text-[#272343]"
                  }`}
                >
                  <span>{cat.name}</span>
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

            {/* Dropdown Select for ALL Database Categories */}
            <div className="relative inline-flex items-center">
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setShowFavoritesOnly(false);
                  setSelectedCategory(e.target.value);
                  trackClick("category", e.target.value);
                }}
                className={`h-8 pl-2.5 pr-7 rounded-lg text-xs font-semibold transition-all shadow-soft-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343] cursor-pointer appearance-none ${
                  selectedCategory !== "All" &&
                  !popularCategories.some(
                    (c) => c.name.toLowerCase() === selectedCategory.toLowerCase(),
                  )
                    ? "bg-[#272343] text-white border border-[#272343]"
                    : "bg-white text-[#272343] border border-[#BAE8E8] hover:border-[#272343]/50"
                }`}
                aria-label="Pilih dari semua kategori"
              >
                <option value="All">
                  Pilih Kategori Lainnya ({dbCategories.length})...
                </option>
                <optgroup label="Semua Kategori Database">
                  {dbCategories.map((c) => (
                    <option key={c.id || c.name} value={c.name}>
                      {c.name} ({categoryCounts[c.name] || 0})
                    </option>
                  ))}
                </optgroup>
              </select>
              <ChevronDown
                className={`absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none ${
                  selectedCategory !== "All" &&
                  !popularCategories.some(
                    (c) => c.name.toLowerCase() === selectedCategory.toLowerCase(),
                  )
                    ? "text-white"
                    : "text-[#2D334A]/60"
                }`}
              />
            </div>

            {/* Favorites Tab Button */}
            <button
              type="button"
              onClick={() => {
                setShowFavoritesOnly((prev) => {
                  const next = !prev;
                  if (next) setSelectedCategory("All");
                  return next;
                });
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343] ${
                showFavoritesOnly
                  ? "bg-[#FFD803] text-[#272343] border-[#F2CD00] font-bold shadow-soft-sm"
                  : "bg-white text-[#2D334A] border-[#BAE8E8] hover:bg-[#E3F6F5]/60"
              }`}
              title="Tampilkan hanya komponen yang disimpan"
            >
              <Bookmark
                className={`h-3.5 w-3.5 ${
                  showFavoritesOnly
                    ? "fill-[#272343] text-[#272343]"
                    : "text-[#2D334A]/70"
                }`}
              />
              <span>Favorit</span>
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
            <span className="text-xs font-semibold text-[#272343] mr-1 flex items-center gap-1">
              <Layers className="h-3.5 w-3.5 text-[#0D6E6E]" />
              <span>Teknologi:</span>
            </span>
            {techOptions.map((tech) => {
              const isSelected = selectedTechnology === tech;
              const label = tech === "All" ? "Semua" : tech;

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
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter & Active Filter Dismissals */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-b border-[#BAE8E8]/60 pb-4">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#2D334A]">
            <span className="text-[#2D334A]/80">
              Menemukan <strong className="text-[#272343]">{filteredResources.length}</strong> komponen
            </span>
            {selectedCategory !== "All" && (
              <span className="inline-flex items-center gap-1 font-semibold text-[#272343] bg-[#E3F6F5] border border-[#BAE8E8] px-2 py-0.5 rounded">
                Kategori: {selectedCategory}
              </span>
            )}
            {selectedTechnology !== "All" && (
              <span className="inline-flex items-center gap-1 font-semibold text-[#272343] bg-[#E3F6F5] border border-[#BAE8E8] px-2 py-0.5 rounded">
                Teknologi: {selectedTechnology}
              </span>
            )}
            {showFavoritesOnly && (
              <span className="inline-flex items-center gap-1 font-semibold text-[#0D6E6E] bg-[#E3F6F5] px-2 py-0.5 rounded">
                <Bookmark className="h-3 w-3 fill-[#0D6E6E]" />
                Disimpan
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 font-mono text-[11px] text-[#272343] bg-[#E3F6F5] border border-[#BAE8E8] px-2 py-0.5 rounded">
                &ldquo;{searchQuery}&rdquo;
              </span>
            )}
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
              <span>Hapus semua filter</span>
            </Button>
          )}
        </div>

        {/* Resource Grid or Empty State */}
        {filteredResources.length > 0 ? (
          <div className="space-y-8 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedResources.map((resource) => (
                <div
                  key={resource.id || resource.slug}
                  onClick={() => trackClick("resource", resource)}
                >
                  <ResourceCard resource={resource} />
                </div>
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
                  Semua {filteredResources.length} komponen telah ditampilkan.
                </p>
              </div>
            ) : null}
          </div>
        ) : showFavoritesOnly && (!isLoaded || favorites.length === 0) ? (
          <div className="text-center py-16 px-4 rounded-xl border border-dashed border-[#BAE8E8] bg-white space-y-4 max-w-md mx-auto shadow-soft-sm">
            <div className="h-12 w-12 rounded-full bg-[#E3F6F5] border border-[#BAE8E8] flex items-center justify-center mx-auto text-[#272343]">
              <Bookmark className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-heading font-bold text-[#272343]">
                Belum Ada Favorit yang Disimpan
              </h3>
              <p className="text-xs text-[#2D334A]/80 leading-relaxed">
                Klik ikon bookmark pada kartu komponen apa pun untuk
                menyimpannya di sini agar mudah diakses kembali tanpa perlu
                login.
              </p>
            </div>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => {
                setShowFavoritesOnly(false);
                setSelectedCategory("All");
              }}
              className="font-semibold"
            >
              Jelajahi Semua Komponen
            </Button>
          </div>
        ) : (
          <EmptyState searchQuery={searchQuery} onReset={handleResetFilters} />
        )}
      </Container>
    </div>
  );
}
