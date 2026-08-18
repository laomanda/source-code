"use client";

import * as React from "react";
import { Resource, CategoryType } from "@/types";
import { ResourceCard } from "@/components/library/resource-card";
import { EmptyState } from "@/components/library/empty-state";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  X,
  Layers,
  ArrowUpDown,
} from "lucide-react";

export interface LibraryViewProps {
  initialResources?: Resource[];
}

export function LibraryView({ initialResources = [] }: LibraryViewProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<"All" | CategoryType>("All");
  const [selectedTechnology, setSelectedTechnology] = React.useState<string>("All");
  const [sortBy, setSortBy] = React.useState<"newest" | "alpha" | "oldest">("newest");

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

  // Filter and sort resources
  const filteredResources = React.useMemo(() => {
    let result = initialResources;

    // Category filter
    if (selectedCategory !== "All") {
      result = result.filter((r) => r.category === selectedCategory);
    }

    // Technology filter
    if (selectedTechnology !== "All") {
      result = result.filter((r) =>
        r.technology.toLowerCase().includes(selectedTechnology.toLowerCase())
      );
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.technology.toLowerCase().includes(q) ||
          r.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    // Sorting
    return [...result].sort((a, b) => {
      if (sortBy === "alpha") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      // default: newest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [initialResources, searchQuery, selectedCategory, selectedTechnology, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedTechnology("All");
    setSortBy("newest");
  };

  const hasActiveFilters =
    searchQuery !== "" || selectedCategory !== "All" || selectedTechnology !== "All";

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
            Browse, search, and copy free ready-to-use components, blocks, and templates. Filter by technology and verify responsiveness.
          </p>
        </div>

        {/* Controls Bar: Search & Sort */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Global Search Input */}
          <div className="md:col-span-8 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2D334A]/50" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, description, technology (e.g. React), or tag..."
              className="pl-10 pr-10 h-11 bg-white border-[#BAE8E8] shadow-soft-sm text-sm"
              aria-label="Search resources"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#2D334A]/60 hover:text-[#272343] rounded"
                aria-label="Clear search query"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="md:col-span-4 flex items-center justify-end gap-2">
            <span className="text-xs text-[#2D334A]/70 flex items-center gap-1 whitespace-nowrap">
              <ArrowUpDown className="h-3.5 w-3.5" />
              <span>Sort:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "newest" | "alpha" | "oldest")}
              className="h-11 rounded-md border border-[#BAE8E8] bg-white px-3 py-2 text-xs font-medium text-[#272343] shadow-soft-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343]"
              aria-label="Sort resources"
            >
              <option value="newest">Newest First</option>
              <option value="alpha">Alphabetical (A–Z)</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Filter Section: Category Tabs & Technology Pills */}
        <div className="space-y-4 pt-2 border-t border-[#BAE8E8]/60">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#272343] mr-2 flex items-center gap-1">
              <span>Category:</span>
            </span>
            {categories.map((category) => {
              const count = categoryCounts[category] || 0;
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
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
        ) : (
          <EmptyState searchQuery={searchQuery} onReset={handleResetFilters} />
        )}
      </Container>
    </div>
  );
}
