"use client";

import * as React from "react";
import Link from "next/link";
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

export function Navbar() {
  const { favoriteCount, isLoaded } = useFavorites();

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
      {/* Minimal Top Brand Bar (Clean, transparent, no bulky navbar strip) */}
      <header className="relative w-full z-30 pt-4 sm:pt-6">
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
              className="h-8 w-auto transition-transform duration-200 group-hover:scale-[1.02]"
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

      {/* Floating Semi-Circle Navigation Menu (Anchored at Middle-Right) */}
      <div className="fixed top-1/2 right-4 sm:right-6 md:right-8 -translate-y-1/2 z-50 flex items-center">
        <CircleMenu
          items={circleMenuItems}
          mode="semi-circle-left"
          className="shadow-soft-2xl"
        />
      </div>
    </>
  );
}
