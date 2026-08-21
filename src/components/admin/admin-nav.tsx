"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
}

export function AdminNav({ userEmail }: AdminNavProps) {
  const pathname = usePathname();

  // If on login page, render minimal header
  if (pathname === "/admin/login") {
    return null;
  }

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Resources", href: "/admin/resources", icon: Layers },
    { label: "Categories", href: "/admin/categories", icon: FolderTree },
    { label: "Technologies", href: "/admin/technologies", icon: Cpu },
    { label: "Suggestions", href: "/admin/suggestions", icon: Lightbulb },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#BAE8E8] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand + Admin Pill */}
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
            <Badge variant="warning" size="sm" className="font-mono text-[10px]">
              ADMIN
            </Badge>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Admin Navigation">
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
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343] ${
                    isActive
                      ? "bg-[#272343] text-white shadow-soft-sm font-semibold"
                      : "text-[#2D334A] hover:bg-[#E3F6F5] hover:text-[#272343]"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: User Email + Public View + Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          {userEmail && (
            <span className="hidden lg:inline-block text-xs font-mono text-[#2D334A]/70 truncate max-w-[180px]">
              {userEmail}
            </span>
          )}

          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex gap-1.5 text-xs text-[#2D334A] hover:text-[#272343]">
            <Link href="/library" target="_blank" rel="noopener noreferrer">
              <span>View Site</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </Button>

          <form action={logoutAction}>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs border-[#BAE8E8] text-[#2D334A] hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343]"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log Out</span>
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
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all ${
                isActive
                  ? "bg-[#272343] text-white font-semibold shadow-soft-sm"
                  : "text-[#2D334A] hover:bg-white"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
        <Link
          href="/library"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs text-[#2D334A] hover:bg-white"
        >
          <span>Site</span>
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
    </header>
  );
}
