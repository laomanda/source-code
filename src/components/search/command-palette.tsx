"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Resource } from "@/types";
import { smartSearchResources } from "@/lib/search/smart-search";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  X,
  ArrowRight,
  Sparkles,
  Monitor,
  FolderTree,
  Bookmark,
} from "lucide-react";

export interface CommandPaletteProps {
  resources?: Resource[];
}

const POPULAR_SEARCHES = [
  "Button",
  "Navbar",
  "Hero",
  "Canvas",
  "Responsive",
  "React",
  "Tailwind",
];

export function CommandPalette({ resources = [] }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [allResources, setAllResources] = React.useState<Resource[]>(resources);
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);

  // If resources not passed or empty, fetch published resources client-side
  React.useEffect(() => {
    if (resources.length > 0) {
      setAllResources(resources);
    }
  }, [resources]);

  // Global Keyboard Listener for Cmd+K / Ctrl+K / '/'
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "/" && !isOpen && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        setIsOpen(true);
      } else if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    const handleCustomOpen = () => {
      setIsOpen(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("jakdev:open-search", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("jakdev:open-search", handleCustomOpen);
    };
  }, [isOpen]);

  // Auto-focus input when opened
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setSelectedIndex(0);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Search Results using Smart Search Engine
  const searchResults = React.useMemo(() => {
    if (!allResources.length) return [];
    const results = smartSearchResources(allResources, query);
    return results.slice(0, 8); // Top 8 results
  }, [allResources, query]);

  // Keyboard navigation through results
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (searchResults.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % searchResults.length);
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (searchResults.length > 0) {
        setSelectedIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (searchResults.length > 0 && searchResults[selectedIndex]) {
        const item = searchResults[selectedIndex].item;
        router.push(`/resource/${item.slug}`);
        setIsOpen(false);
      } else if (query.trim()) {
        router.push(`/library?search=${encodeURIComponent(query)}`);
        setIsOpen(false);
      }
    }
  };

  const handleSelect = (slug: string) => {
    router.push(`/resource/${slug}`);
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 sm:pt-20 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="command-palette-title"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-[#BAE8E8] bg-white shadow-soft-xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-[#BAE8E8] bg-[#E3F6F5]/40">
          <Search className="h-5 w-5 text-[#272343] shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            id="command-palette-title"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleInputKeyDown}
            placeholder="Search components, categories, tags, or tech (e.g. 'button react', 'hero')..."
            className="w-full bg-transparent text-sm sm:text-base font-medium text-[#272343] placeholder-[#2D334A]/50 focus:outline-none"
            aria-label="Smart Search Components"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="p-1 rounded text-[#2D334A]/60 hover:text-[#272343]"
              aria-label="Clear query"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono text-[#2D334A]/60 bg-white px-2 py-0.5 rounded border border-[#BAE8E8]">
              <kbd>ESC</kbd>
            </div>
          )}
        </div>

        {/* Quick Suggestions Pills (when query is empty) */}
        {!query && (
          <div className="px-4 py-3 bg-[#FBFDFD] border-b border-[#BAE8E8]/60 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] font-semibold text-[#272343] mr-1 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-[#0D6E6E]" />
              Popular:
            </span>
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => {
                  setQuery(term);
                  inputRef.current?.focus();
                }}
                className="px-2.5 py-0.5 rounded-md bg-white border border-[#BAE8E8] text-[#2D334A] hover:bg-[#E3F6F5] hover:text-[#272343] hover:border-[#8CD3D3] transition-colors text-[11px] font-medium"
              >
                {term}
              </button>
            ))}
          </div>
        )}

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {searchResults.length > 0 ? (
            <div>
              <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#2D334A]/60">
                Matching Components ({searchResults.length})
              </div>
              {searchResults.map((result, idx) => {
                const item = result.item;
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={item.id || item.slug}
                    onClick={() => handleSelect(item.slug)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`px-3.5 py-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-[#272343] text-white shadow-soft-sm"
                        : "hover:bg-[#E3F6F5]/50 text-[#272343]"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-[#FFD803] text-[#272343] font-bold"
                            : "bg-[#E3F6F5] text-[#272343] border border-[#BAE8E8]"
                        }`}
                      >
                        <Monitor className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-semibold text-sm truncate">
                            {item.title}
                          </span>
                          <Badge
                            variant={isSelected ? "secondary" : "navy"}
                            size="sm"
                            className="text-[10px] shrink-0"
                          >
                            {item.category}
                          </Badge>
                        </div>
                        <div
                          className={`text-xs truncate font-mono text-[11px] ${
                            isSelected ? "text-white/80" : "text-[#2D334A]/70"
                          }`}
                        >
                          {item.technology} · /{item.slug}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#FFD803]">
                          <span>Open</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      ) : (
                        <span className="text-xs text-[#2D334A]/50">↵</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : query ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="h-10 w-10 rounded-full bg-[#E3F6F5] border border-[#BAE8E8] flex items-center justify-center mx-auto text-[#272343]">
                <Search className="h-5 w-5 text-[#2D334A]/60" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-[#272343]">
                  No exact matches for &ldquo;{query}&rdquo;
                </p>
                <p className="text-xs text-[#2D334A]/70">
                  Try searching for keywords like &ldquo;button&rdquo;, &ldquo;navbar&rdquo;, &ldquo;hero&rdquo;, or &ldquo;tailwind&rdquo;.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  router.push(`/library?search=${encodeURIComponent(query)}`);
                  setIsOpen(false);
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#0D6E6E] hover:underline"
              >
                <span>Search in full library catalog</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <div className="px-3 py-6 text-center text-xs text-[#2D334A]/60 space-y-1">
              <p>Type keywords to instantly find components and templates.</p>
              <p className="text-[11px] font-mono">Supports smart synonyms, tags, and typo tolerance.</p>
            </div>
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="px-4 py-2.5 bg-[#FBFDFD] border-t border-[#BAE8E8] flex flex-wrap items-center justify-between text-[11px] text-[#2D334A]/70">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-[#BAE8E8] rounded shadow-soft-xs font-mono font-bold">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white border border-[#BAE8E8] rounded shadow-soft-xs font-mono font-bold">↓</kbd>
              <span>to navigate</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-[#BAE8E8] rounded shadow-soft-xs font-mono font-bold">↵</kbd>
              <span>to open</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-[#BAE8E8] rounded shadow-soft-xs font-mono font-bold">esc</kbd>
              <span>to close</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                router.push("/favorites");
                setIsOpen(false);
              }}
              className="hover:text-[#272343] inline-flex items-center gap-1 font-medium"
            >
              <Bookmark className="h-3 w-3" />
              <span>Favorites</span>
            </button>
            <button
              type="button"
              onClick={() => {
                router.push("/library");
                setIsOpen(false);
              }}
              className="hover:text-[#272343] inline-flex items-center gap-1 font-medium"
            >
              <FolderTree className="h-3 w-3" />
              <span>All Categories</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
