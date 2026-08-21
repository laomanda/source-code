"use client";

import * as React from "react";
import Link from "next/link";
import { Resource } from "@/types";
import { FavoriteButton } from "@/components/library/favorite-button";
import { Code2, Sparkles } from "lucide-react";

export interface ResourceCardProps {
  resource: Resource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  // Check if resource was created within the last 4 days
  const isNew = React.useMemo(() => {
    if (!resource.createdAt) return false;
    const createdTime = new Date(resource.createdAt).getTime();
    if (isNaN(createdTime)) return false;
    const diffDays = (Date.now() - createdTime) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 4;
  }, [resource.createdAt]);

  // Construct clean sandboxed HTML document for the component preview
  const previewDoc = React.useMemo(() => {
    if (!resource.previewHtml) return null;
    return `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    window.onerror = function() { return true; };
  </script>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      background-color: transparent;
      color: #272343;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    ::-webkit-scrollbar { display: none; }
    body > * {
      width: 100% !important;
      height: 100% !important;
      margin: 0 !important;
      box-sizing: border-box !important;
    }
  </style>
</head>
<body>
  ${resource.previewHtml}
</body>
</html>`;
  }, [resource.previewHtml]);

  return (
    <div className="group rounded-2xl border border-[#BAE8E8]/90 bg-white overflow-hidden shadow-soft-xs hover:shadow-soft hover:border-[#43BCCD] transition-all duration-200 flex flex-col relative">
      {/* Clickable Preview Canvas (16:10 aspect ratio) */}
      <Link
        href={`/resource/${resource.slug}`}
        prefetch={true}
        className="aspect-[16/10] w-full relative bg-[#F8FAFC] border-b border-[#BAE8E8]/50 overflow-hidden flex items-center justify-center cursor-pointer block"
        title={`Buka ${resource.title}`}
      >
        {/* Dynamic "Baru" Badge (Active for resources <= 4 days old) */}
        {isNew && (
          <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFD803] text-[#272343] text-[10px] font-mono font-bold tracking-wide shadow-xs border border-[#F2CD00]">
              <Sparkles className="h-3 w-3 fill-[#272343]" />
              <span>Baru</span>
            </span>
          </div>
        )}

        {previewDoc ? (
          <iframe
            srcDoc={previewDoc}
            title={`Preview ${resource.title}`}
            className="w-full h-full border-0 pointer-events-none select-none bg-transparent"
            sandbox="allow-scripts"
            loading="lazy"
          />
        ) : resource.previewImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={resource.previewImageUrl}
            alt={resource.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-2 text-[#2D334A]/60">
            <div className="h-10 w-10 rounded-xl bg-[#E3F6F5] border border-[#BAE8E8] flex items-center justify-center text-[#272343]">
              <Code2 className="h-5 w-5" />
            </div>
            <div className="font-mono text-xs text-[#272343]/70 truncate max-w-[200px]">
              {resource.tags.slice(0, 3).map((t) => `#${t}`).join(" ")}
            </div>
          </div>
        )}

        {/* Subtle Hover Highlight */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-[#272343]/[0.02] transition-colors pointer-events-none" />
      </Link>

      {/* 21st.dev Style Clean Bottom Bar */}
      <div className="px-4 py-3 flex items-center justify-between gap-3 bg-white">
        {/* Left: Component Title */}
        <Link
          href={`/resource/${resource.slug}`}
          prefetch={true}
          className="min-w-0 flex-1 group/title"
        >
          <span className="font-heading font-semibold text-sm text-[#272343] truncate block group-hover/title:text-[#0D6E6E] transition-colors">
            {resource.title}
          </span>
        </Link>

        {/* Right: Favorite / Bookmark Button */}
        <div className="shrink-0 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <FavoriteButton
            slug={resource.slug}
            title={resource.title}
            category={resource.category}
            technology={resource.technology}
          />
        </div>
      </div>
    </div>
  );
}
