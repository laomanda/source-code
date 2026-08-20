"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/container";
import { useFavorites } from "@/lib/hooks/use-favorites";
import {
  Bookmark,
  Search,
  Sparkles,
  Home,
  Layers,
  Compass,
  Lightbulb,
} from "lucide-react";
import { CircleMenu } from "@/components/ui/circle-menu";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { favoriteCount, isLoaded } = useFavorites();
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleOpenSearch = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("jakdev:open-search"));
    }
  };

  const circleMenuItems = [
    {
      label: "Beranda",
      icon: <Home size={16} className="text-[#272343]" />,
      href: "/",
    },
    {
      label: "Pustaka",
      icon: <Layers size={16} className="text-[#272343]" />,
      href: "/library",
    },
    {
      label: `Favorit ${isLoaded && favoriteCount > 0 ? `(${favoriteCount})` : ""}`.trim(),
      icon: (
        <Bookmark
          size={16}
          className={
            isLoaded && favoriteCount > 0
              ? "fill-[#FFD803] text-[#272343]"
              : "text-[#272343]"
          }
        />
      ),
      href: "/favorites",
    },
    {
      label: "Showcase",
      icon: <Sparkles size={16} className="text-[#272343]" />,
      href: "/#showcase",
    },
    {
      label: "Cara Kerja",
      icon: <Compass size={16} className="text-[#272343]" />,
      href: "/#how-it-works",
    },
    {
      label: "Kirim Saran",
      icon: <Lightbulb size={16} className="text-[#272343]" />,
      href: "/#suggest",
    },
  ];

  return (
    <>
      {/* Sticky Top Brand Bar (Logo + Search, sticks on scroll with glassmorphism) */}
      <header
        className={cn(
          "sticky top-0 w-full z-40 transition-all duration-200",
          isScrolled
            ? "py-3 bg-white/85 backdrop-blur-md border-b border-[#BAE8E8]/70 shadow-soft-xs"
            : "py-4 sm:py-6 bg-transparent"
        )}
      >
        <Container size="xl" className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343] focus-visible:ring-offset-2 rounded-lg"
            aria-label="JakDev Beranda"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.svg"
              alt="JakDev"
              width={132}
              height={32}
              className="h-8 w-auto"
            />
          </Link>

          {/* Quick Search Shortcut Pill */}
          <button
            type="button"
            onClick={handleOpenSearch}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#BAE8E8] bg-white/90 hover:bg-white hover:border-[#272343] text-[#2D334A]/80 hover:text-[#272343] text-xs transition-all duration-150 shadow-soft-xs backdrop-blur-xs group"
            title="Cari komponen (Ctrl + K / ⌘K / Tekan K)"
            aria-label="Buka Pencarian Cepat"
          >
            <Search className="h-3.5 w-3.5 text-[#2D334A]/60 group-hover:text-[#272343] transition-colors" />
            <span className="font-normal text-[#2D334A]/80 pr-1">Cari komponen...</span>
            <kbd className="text-[10px] font-mono font-bold bg-[#E3F6F5] text-[#272343] group-hover:bg-[#FFD803] border border-[#BAE8E8]/70 px-1.5 py-0.5 rounded shadow-soft-xs transition-colors">
              ⌘K
            </kbd>
          </button>
        </Container>
      </header>

      {/* Desktop Floating Semi-Circle Navigation Menu (Visible only on md: and above) */}
      <div className="hidden md:flex fixed top-1/2 right-4 sm:right-6 md:right-8 -translate-y-1/2 z-50 items-center">
        <CircleMenu
          items={circleMenuItems}
          mode="semi-circle-left"
          className="shadow-soft-2xl"
        />
      </div>

      {/* Mobile Floating Bottom Navigation Bar (Visible only on mobile < md) */}
      <div className="md:hidden fixed bottom-3 inset-x-3 z-50 max-w-sm mx-auto pointer-events-auto">
        <nav
          className="bg-white/95 backdrop-blur-xl border border-[#BAE8E8] shadow-soft-2xl rounded-2xl px-2 py-1.5 flex items-center justify-between"
          aria-label="Navigasi Bawah Mobile"
        >
          {/* 1. Beranda */}
          <Link
            href="/"
            className={cn(
              "flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[10px] font-medium transition-all",
              pathname === "/"
                ? "text-[#272343] bg-[#FFD803]/40 font-bold shadow-soft-xs"
                : "text-[#2D334A]/75 hover:text-[#272343] hover:bg-[#E3F6F5]/50"
            )}
          >
            <Home className="h-4 w-4 mb-0.5" />
            <span>Beranda</span>
          </Link>

          {/* 2. Pustaka */}
          <Link
            href="/library"
            className={cn(
              "flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[10px] font-medium transition-all",
              pathname.startsWith("/library")
                ? "text-[#272343] bg-[#FFD803]/40 font-bold shadow-soft-xs"
                : "text-[#2D334A]/75 hover:text-[#272343] hover:bg-[#E3F6F5]/50"
            )}
          >
            <Layers className="h-4 w-4 mb-0.5" />
            <span>Pustaka</span>
          </Link>

          {/* 3. Favorit */}
          <Link
            href="/favorites"
            className={cn(
              "flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[10px] font-medium transition-all relative",
              pathname === "/favorites"
                ? "text-[#272343] bg-[#FFD803]/40 font-bold shadow-soft-xs"
                : "text-[#2D334A]/75 hover:text-[#272343] hover:bg-[#E3F6F5]/50"
            )}
          >
            <div className="relative">
              <Bookmark
                className={cn(
                  "h-4 w-4 mb-0.5",
                  isLoaded && favoriteCount > 0 && "fill-[#FFD803] text-[#272343]"
                )}
              />
              {isLoaded && favoriteCount > 0 && (
                <span className="absolute -top-1 -right-2.5 h-3.5 min-w-[14px] px-0.5 rounded-full bg-[#FFD803] text-[#272343] font-mono font-black text-[9px] flex items-center justify-center border border-[#272343]/30">
                  {favoriteCount}
                </span>
              )}
            </div>
            <span>Favorit</span>
          </Link>

          {/* 4. Kirim Saran */}
          <Link
            href="/#suggest"
            className="flex-1 flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-[10px] font-medium text-[#2D334A]/75 hover:text-[#272343] hover:bg-[#E3F6F5]/50 transition-all"
          >
            <Lightbulb className="h-4 w-4 mb-0.5 text-[#0D6E6E]" />
            <span>Kirim Saran</span>
          </Link>
        </nav>
      </div>
    </>
  );
}
