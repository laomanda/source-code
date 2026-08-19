"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { useFavorites } from "@/lib/hooks/use-favorites";
import { Menu, X, ArrowRight, Sparkles, Bookmark, Search } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { favoriteCount, isLoaded } = useFavorites();

  const handleOpenSearch = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("jakdev:open-search"));
    }
  };

  const navLinks = [
    { label: "Library", href: "/library" },
    { label: "Favorites", href: "/favorites" },
    { label: "Showcase", href: "/#showcase" },
    { label: "How It Works", href: "/#how-it-works" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#BAE8E8] bg-white/95 backdrop-blur-sm shadow-soft-sm">
      <Container size="xl" className="flex h-16 items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343] focus-visible:ring-offset-2 rounded-md"
          aria-label="JakDev Home"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.svg"
            alt="JakDev"
            width={135}
            height={32}
            className="h-8 w-auto group-hover:opacity-90 transition-opacity"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-[#2D334A] hover:text-[#272343] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343] focus-visible:ring-offset-2 rounded px-1.5 py-1 flex items-center gap-1.5"
            >
              {link.label === "Favorites" && (
                <Bookmark
                  className={`h-3.5 w-3.5 ${
                    isLoaded && favoriteCount > 0
                      ? "fill-[#FFD803] text-[#272343]"
                      : "text-[#2D334A]/60"
                  }`}
                />
              )}
              <span>{link.label}</span>
              {link.label === "Favorites" && isLoaded && favoriteCount > 0 && (
                <span className="h-4 min-w-[16px] px-1 rounded-full bg-[#272343] text-[#FFD803] text-[10px] font-mono font-bold flex items-center justify-center">
                  {favoriteCount}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Desktop Search Trigger & CTA */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Global Smart Search Trigger */}
          <button
            type="button"
            onClick={handleOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#BAE8E8] bg-[#FBFDFD] hover:bg-[#E3F6F5] hover:border-[#8CD3D3] text-[#2D334A]/70 hover:text-[#272343] text-xs transition-colors shadow-soft-xs"
            title="Search components (Ctrl + K / ⌘K)"
            aria-label="Open global search"
          >
            <Search className="h-3.5 w-3.5 text-[#272343]" />
            <span className="font-normal text-[#2D334A]/80">Search...</span>
            <kbd className="text-[10px] font-mono font-bold bg-white border border-[#BAE8E8] px-1.5 py-0.5 rounded text-[#2D334A]/60 shadow-soft-xs">
              ⌘K
            </kbd>
          </button>

          <Button asChild variant="primary" size="default" className="shadow-soft-sm">
            <Link href="/library" className="flex items-center gap-1.5 font-semibold">
              <span>Browse Library</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Mobile Action Controls */}
        <div className="flex sm:hidden items-center gap-1.5">
          <button
            type="button"
            onClick={handleOpenSearch}
            className="p-2 rounded-md text-[#272343] hover:bg-[#E3F6F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343]"
            aria-label="Open search dialog"
          >
            <Search className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md text-[#272343] hover:bg-[#E3F6F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343]"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </Container>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#BAE8E8] bg-white px-4 pt-2 pb-6 space-y-4 shadow-soft-md animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-md text-base font-medium text-[#272343] hover:bg-[#E3F6F5] transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  {link.label === "Favorites" && (
                    <Bookmark
                      className={`h-4 w-4 ${
                        isLoaded && favoriteCount > 0
                          ? "fill-[#FFD803] text-[#272343]"
                          : "text-[#2D334A]/70"
                      }`}
                    />
                  )}
                  <span>{link.label}</span>
                </div>
                {link.label === "Favorites" && isLoaded && favoriteCount > 0 && (
                  <span className="h-5 min-w-[20px] px-1.5 rounded-full bg-[#272343] text-[#FFD803] text-xs font-mono font-bold flex items-center justify-center">
                    {favoriteCount}
                  </span>
                )}
              </Link>
            ))}
          </nav>
          <div className="pt-2 border-t border-[#BAE8E8]/60 space-y-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                handleOpenSearch();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md border border-[#BAE8E8] bg-[#FBFDFD] text-sm font-medium text-[#272343] hover:bg-[#E3F6F5]"
            >
              <Search className="h-4 w-4" />
              <span>Search components (⌘K)</span>
            </button>
            <Button asChild variant="primary" className="w-full justify-center">
              <Link href="/library" onClick={() => setMobileMenuOpen(false)}>
                <Sparkles className="h-4 w-4 mr-2" />
                Browse Library
              </Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
