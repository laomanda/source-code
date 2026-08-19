import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";

export function Footer() {
  return (
    <footer className="w-full border-t border-[#BAE8E8] bg-white py-12">
      <Container size="xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.svg"
              alt="JakDev"
              width={135}
              height={32}
              className="h-8 w-auto"
            />
            <p className="text-xs text-[#2D334A]/70 sm:self-center">
              Free developer source-code ecosystem.
            </p>
          </div>

          {/* Quick Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#2D334A]/80" aria-label="Footer Navigation">
            <Link href="/library" className="hover:text-[#272343] transition-colors">
              Library
            </Link>
            <a href="#showcase" className="hover:text-[#272343] transition-colors">
              Showcase
            </a>
            <a href="#how-it-works" className="hover:text-[#272343] transition-colors">
              How It Works
            </a>
            <a href="#suggest" className="hover:text-[#272343] transition-colors">
              Suggest
            </a>
            <a href="#support" className="hover:text-[#272343] transition-colors">
              Support
            </a>
          </nav>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-[#BAE8E8]/50 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#2D334A]/60">
          <p>© {new Date().getFullYear()} JakDev. All source code is free and open-source.</p>
          <p className="font-mono text-[11px]">Browse · Preview · Copy · Build</p>
        </div>
      </Container>
    </footer>
  );
}
