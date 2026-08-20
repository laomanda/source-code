"use client";

import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";

export function Footer() {
  return (
    <footer className="relative w-full overflow-hidden bg-transparent pt-12">
      {/* Multi-Layered Responsive SVG Wave Transition (Soft Mint & Cyan Waves) */}
      <div className="w-full overflow-hidden leading-none pointer-events-none select-none">
        <svg
          className="relative block w-full h-14 sm:h-24 md:h-32 transition-all duration-300"
          viewBox="0 0 1440 140"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Wave Layer 1: Soft Cyan Ambient Glow */}
          <path
            d="M0,32 C240,110 480,10 720,65 C960,120 1200,30 1440,75 L1440,140 L0,140 Z"
            fill="#BAE8E8"
            fillOpacity="0.35"
          />
          {/* Wave Layer 2: Vivid Cyan Crest */}
          <path
            d="M0,55 C220,130 460,25 700,85 C940,145 1180,45 1440,95 L1440,140 L0,140 Z"
            fill="#BAE8E8"
            fillOpacity="0.75"
          />
          {/* Wave Layer 3: Soft Mint Solid Base */}
          <path
            d="M0,85 C260,145 520,60 780,110 C1040,155 1260,85 1440,120 L1440,140 L0,140 Z"
            fill="#E3F6F5"
          />
        </svg>
      </div>

      {/* Main Footer Body (Light Mint Clean Style) */}
      <div className="bg-[#E3F6F5] text-[#272343] pb-12 pt-4 sm:pt-6 border-b border-[#BAE8E8]/40">
        <Container size="xl">
          {/* Top Grid Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-10 border-b border-[#BAE8E8]/80">
            {/* Brand Column */}
            <div className="lg:col-span-5 space-y-4 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-3">
                <Link
                  href="/"
                  className="flex items-center gap-2.5 group focus:outline-none"
                  aria-label="JakDev Beranda"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo.svg"
                    alt="JakDev"
                    width={135}
                    height={32}
                    className="h-8 w-auto"
                  />
                </Link>
              </div>

              <p className="text-sm text-[#2D334A]/80 leading-relaxed max-w-sm mx-auto sm:mx-0">
                Komponen UI dan template web modern siap pakai dengan copy-paste instan.
              </p>
            </div>

            {/* Quick Links Column 1: Pustaka */}
            <div className="lg:col-span-3 space-y-3 text-center sm:text-left">
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#272343]">
                Pustaka Komponen
              </p>
              <ul className="space-y-2.5 text-sm text-[#2D334A]/80">
                <li>
                  <Link
                    href="/library"
                    className="hover:text-[#272343] font-medium transition-colors"
                  >
                    Semua Komponen
                  </Link>
                </li>
                <li>
                  <Link
                    href="/favorites"
                    className="hover:text-[#272343] font-medium transition-colors"
                  >
                    Koleksi Favorit
                  </Link>
                </li>
              </ul>
            </div>

            {/* Quick Links Column 2: Navigasi & Fitur */}
            <div className="lg:col-span-4 space-y-3 text-center sm:text-left">
              <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#272343]">
                Fitur & Komunitas
              </p>
              <ul className="space-y-2.5 text-sm text-[#2D334A]/80">
                <li>
                  <a
                    href="#showcase"
                    className="hover:text-[#272343] font-medium transition-colors"
                  >
                    Showcase Komponen Unggulan
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="hover:text-[#272343] font-medium transition-colors"
                  >
                    Cara Kerja & Panduan
                  </a>
                </li>
                <li>
                  <a
                    href="#suggest"
                    className="hover:text-[#272343] font-medium transition-colors"
                  >
                    Kirim Saran & Permintaan Desain
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#2D334A]/70">
            <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
              <p>© {new Date().getFullYear()} JakDev. Bebas digunakan untuk proyek personal & komersial.</p>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
