"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/lib/actions/auth";
import {
  LayoutDashboard,
  Layers,
  FolderTree,
  Cpu,
  Lightbulb,
  ExternalLink,
  LogOut,
} from "lucide-react";

export interface AdminNavProps {
  userEmail?: string | null;
  suggestionCount?: number;
}

export function AdminNav({ userEmail, suggestionCount = 0 }: AdminNavProps) {
  const pathname = usePathname();

  // If on login page, render minimal header
  if (pathname === "/admin/login") {
    return null;
  }

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard, count: null },
    { label: "Komponen", href: "/admin/resources", icon: Layers, count: null },
    { label: "Kategori", href: "/admin/categories", icon: FolderTree, count: null },
    { label: "Teknologi", href: "/admin/technologies", icon: Cpu, count: null },
    {
      label: "Saran",
      href: "/admin/suggestions",
      icon: Lightbulb,
      count: suggestionCount > 0 ? suggestionCount : null,
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#BAE8E8] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand */}
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-2 group" aria-label="JakDev Admin">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.svg"
              alt="JakDev"
              width={120}
              height={28}
              className="h-7 w-auto group-hover:opacity-90 transition-opacity"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Navigasi Admin">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343] ${
                    isActive
                      ? "bg-[#272343] text-white shadow-soft-sm font-semibold"
                      : "text-[#2D334A] hover:bg-[#E3F6F5] hover:text-[#272343]"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                  {item.count !== null && (
                    <span
                      className="ml-0.5 px-1.5 py-0.5 rounded-full bg-[#FFD803] text-[#272343] text-[10px] font-mono font-bold leading-none shadow-2xs"
                      aria-label={`${item.count} saran baru`}
                    >
                      {item.count}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: User Email + Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          {userEmail && (
            <span className="hidden lg:inline-block text-xs font-mono text-[#2D334A]/70 truncate max-w-[180px]">
              {userEmail}
            </span>
          )}

          <form action={logoutAction}>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs border-[#BAE8E8] text-[#2D334A] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343]"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Keluar</span>
            </Button>
          </form>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-[#BAE8E8]/60 bg-[#E3F6F5]/40 px-2 py-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                isActive
                  ? "bg-[#272343] text-white font-semibold shadow-soft-sm"
                  : "text-[#2D334A] hover:bg-white"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{item.label}</span>
              {item.count !== null && (
                <span className="px-1.5 py-0.5 rounded-full bg-[#FFD803] text-[#272343] text-[9px] font-mono font-bold leading-none">
                  {item.count}
                </span>
              )}
            </Link>
          );
        })}
        <Link
          href="/library"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs text-[#2D334A] hover:bg-white"
        >
          <span>Lihat Web</span>
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
    </header>
  );
}
