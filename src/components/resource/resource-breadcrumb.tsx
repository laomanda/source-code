import * as React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface ResourceBreadcrumbProps {
  title: string;
}

export function ResourceBreadcrumb({ title }: ResourceBreadcrumbProps) {
  return (
    <nav aria-label="Navigasi Halaman" className="flex items-center text-xs text-[#2D334A]/70">
      <ol className="flex items-center space-x-2">
        <li>
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-[#272343] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343] rounded"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="sr-only">Beranda</span>
          </Link>
        </li>
        <li className="flex items-center">
          <ChevronRight className="h-3.5 w-3.5 text-[#BAE8E8]" />
        </li>
        <li>
          <Link
            href="/library"
            className="hover:text-[#272343] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343] rounded px-1"
          >
            Pustaka
          </Link>
        </li>
        <li className="flex items-center">
          <ChevronRight className="h-3.5 w-3.5 text-[#BAE8E8]" />
        </li>
        <li className="font-semibold text-[#272343] truncate max-w-xs sm:max-w-md" aria-current="page">
          {title}
        </li>
      </ol>
    </nav>
  );
}
