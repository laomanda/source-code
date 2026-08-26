"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Resource } from "@/types";
import { smartSearchResources } from "@/lib/search/smart-search";
import {
  Search,
  X,
  ArrowRight,
  Code2,
} from "lucide-react";
import { SAMPLE_LIBRARY_RESOURCES } from "@/lib/mock-data";

export interface CommandPaletteProps {
  resources?: Resource[];
}

export function CommandPalette({ resources = [] }: CommandPaletteProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [allResources, setAllResources] = React.useState<Resource[]>(
    resources.length > 0 ? resources : SAMPLE_LIBRARY_RESOURCES
  );
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (resources && resources.length > 0) {
      setAllResources(resources);
    } else {
      setAllResources(SAMPLE_LIBRARY_RESOURCES);
    }
  }, [resources]);

  // Global Keyboard Listener for Cmd+K / Ctrl+K / '/' / 'k'
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT" ||
        Boolean(target?.isContentEditable);

      const isKKey = e.key?.toLowerCase() === "k" || e.code === "KeyK";
      const isSlash = e.key === "/" || e.code === "Slash";

      // 1. Ctrl + K or Cmd + K
      if ((e.metaKey || e.ctrlKey) && isKKey) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }

      // 2. Escape to close dialog
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
        return;
      }

      // 3. Single key 'k' or '/' when NOT typing in an input
      if (!isInput && !isOpen && !e.metaKey && !e.ctrlKey && !e.altKey) {
        if (isKKey || isSlash) {
          e.preventDefault();
          setIsOpen(true);
        }
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

  // Search Results: Empty initially until user types
  const searchResults = React.useMemo(() => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery || !allResources.length) return [];
    const results = smartSearchResources(allResources, trimmedQuery);
    return results.slice(0, 8);
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
        router.push(`/library?search=${encodeURIComponent(query.trim())}`);
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
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 sm:pt-20 bg-[#272343]/40 backdrop-blur-sm animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="command-palette-title"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="w-full max-w-2xl rounded-2xl border border-[#BAE8E8] bg-white shadow-soft-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Clean Modern Search Input Header */}
        <div className="relative flex items-center px-4 sm:px-5 py-3.5 border-b border-[#BAE8E8]/60 bg-white">
          <Search className="h-5 w-5 text-[#272343]/70 shrink-0 mr-3" />
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
            placeholder="Cari komponen, kategori, atau teknologi..."
            className="w-full bg-transparent text-sm sm:text-base font-normal text-[#272343] placeholder-[#2D334A]/40 focus:outline-none"
            aria-label="Cari Komponen JakDev"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="p-1 rounded-full text-[#2D334A]/50 hover:text-[#272343] hover:bg-[#E3F6F5] transition-colors"
              aria-label="Hapus kata kunci"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <div className="hidden sm:flex items-center text-[10px] font-mono font-bold text-[#2D334A]/60 bg-[#E3F6F5]/80 px-2 py-0.5 rounded border border-[#BAE8E8]/80">
              <kbd>ESC</kbd>
            </div>
          )}
        </div>

        {/* Results List or Clean Initial State */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-1 min-h-[160px]">
          {query.trim() ? (
            searchResults.length > 0 ? (
              <div>
                <div className="px-3 py-1.5 text-[11px] font-semibold text-[#2D334A]/60 flex items-center justify-between">
                  <span>Hasil Pencarian ({searchResults.length})</span>
                  <span className="text-[10px] font-mono text-[#2D334A]/40">Gunakan ↑ ↓ untuk memilih</span>
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
                          ? "bg-[#272343] text-white shadow-soft-md"
                          : "hover:bg-[#E3F6F5]/40 text-[#272343]"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? "bg-[#FFD803] text-[#272343]"
                              : "bg-[#E3F6F5]/80 text-[#272343] border border-[#BAE8E8]/70"
                          }`}
                        >
                          <Code2 className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm truncate">
                              {item.title}
                            </span>
                            <span
                              className={`text-[10px] font-medium px-2 py-0.5 rounded-md shrink-0 transition-colors ${
                                isSelected
                                  ? "bg-white/20 text-white"
                                  : "bg-[#E3F6F5] text-[#272343] border border-[#BAE8E8]/60"
                              }`}
                            >
                              {item.category}
                            </span>
                          </div>
                          <div
                            className={`text-xs truncate font-mono text-[11px] mt-0.5 ${
                              isSelected ? "text-white/75" : "text-[#2D334A]/60"
                            }`}
                          >
                            {item.technology} · <span className="opacity-70">/{item.slug}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isSelected ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FFD803]">
                            <span>Buka</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </span>
                        ) : (
                          <span className="text-xs font-mono text-[#2D334A]/40">↵</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 px-4 space-y-3">
                <div className="h-10 w-10 rounded-full bg-[#E3F6F5] border border-[#BAE8E8] flex items-center justify-center mx-auto text-[#272343]">
                  <Search className="h-5 w-5 text-[#2D334A]/60" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-[#272343]">
                    Tidak ada komponen untuk &ldquo;{query}&rdquo;
                  </p>
                  <p className="text-xs text-[#2D334A]/70">
                    Coba kata kunci lain seperti &ldquo;button&rdquo;, &ldquo;navbar&rdquo;, atau &ldquo;hero&rdquo;.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    router.push(`/library?search=${encodeURIComponent(query)}`);
                    setIsOpen(false);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#272343] hover:underline"
                >
                  <span>Lihat semua di katalog pustaka</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            )
          ) : (
            /* Clean Empty Initial State */
            <div className="py-8 px-4 text-center space-y-2">
              <p className="text-xs font-medium text-[#272343]/80">
                Ketik nama komponen, kategori, atau teknologi untuk mulai mencari.
              </p>
              <p className="text-[11px] text-[#2D334A]/50 font-mono">
                Mendukung pencarian nama komponen, kategori, framework (React, Vue, HTML), dan tags.
              </p>
            </div>
          )}
        </div>

        {/* Clean Minimalist Footer Navigation Hints */}
        <div className="px-4 py-2.5 bg-[#FBFDFD] border-t border-[#BAE8E8]/60 flex flex-wrap items-center justify-between text-[11px] text-[#2D334A]/70">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-[#BAE8E8] rounded shadow-soft-xs font-mono font-bold text-[10px]">↑↓</kbd>
              <span>Pilih</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-[#BAE8E8] rounded shadow-soft-xs font-mono font-bold text-[10px]">↵</kbd>
              <span>Buka</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-[#BAE8E8] rounded shadow-soft-xs font-mono font-bold text-[10px]">esc</kbd>
              <span>Tutup</span>
            </span>
          </div>
          <div className="flex items-center gap-3 text-[#2D334A]/60">
            <button
              type="button"
              onClick={() => {
                router.push("/favorites");
                setIsOpen(false);
              }}
              className="hover:text-[#272343] transition-colors"
            >
              Favorit
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => {
                router.push("/library");
                setIsOpen(false);
              }}
              className="hover:text-[#272343] transition-colors"
            >
              Pustaka Lengkap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
