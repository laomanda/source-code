"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Resource } from "@/types";
import { FavoriteButton } from "@/components/library/favorite-button";
import { ShareButton } from "@/components/resource/share-button";
import { Layers, Sparkles } from "lucide-react";

export interface ResourceHeaderProps {
  resource: Resource;
}

export function ResourceHeader({ resource }: ResourceHeaderProps) {
  // Check if resource was created within the last 4 days
  const isNew = React.useMemo(() => {
    if (!resource.createdAt) return false;
    const createdTime = new Date(resource.createdAt).getTime();
    if (isNaN(createdTime)) return false;
    const diffDays = (Date.now() - createdTime) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 4;
  }, [resource.createdAt]);

  return (
    <div className="rounded-2xl border border-[#BAE8E8]/90 bg-white p-6 sm:p-8 shadow-soft-xs space-y-6">
      {/* Top Meta Bar: Badges + Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#BAE8E8]/40 pb-5">
        {/* Left: Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {isNew && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFD803] text-[#272343] text-[11px] font-mono font-bold border border-[#F2CD00] shadow-xs">
              <Sparkles className="h-3 w-3 fill-[#272343]" />
              <span>Baru</span>
            </span>
          )}

          <Badge variant="navy" size="default" className="font-heading">
            <Layers className="h-3.5 w-3.5 mr-1 text-[#BAE8E8]" />
            {resource.category}
          </Badge>

          <Badge variant="secondary" size="default" className="font-mono text-xs text-[#0D6E6E] bg-[#E3F6F5] border-[#BAE8E8]">
            {resource.technology}
          </Badge>
        </div>

        {/* Right: Actions (Favorit & Bagikan) */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <FavoriteButton
            slug={resource.slug}
            title={resource.title}
            category={resource.category}
            technology={resource.technology}
            showLabel
            variant="outline"
            className="shadow-xs hover:border-[#43BCCD] transition-all"
          />

          <ShareButton
            slug={resource.slug}
            title={resource.title}
            description={resource.description}
            category={resource.category}
            technology={resource.technology}
            showLabel
            variant="outline"
            className="shadow-xs hover:border-[#43BCCD] transition-all"
          />
        </div>
      </div>

      {/* Title & Description Block */}
      <div className="space-y-3 max-w-4xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-extrabold text-[#272343] tracking-tight leading-tight">
          {resource.title}
        </h1>

        {resource.description && (
          <p className="text-sm sm:text-base text-[#2D334A]/80 leading-relaxed max-w-3xl">
            {resource.description}
          </p>
        )}
      </div>

      {/* Tags Row */}
      {resource.tags && resource.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {resource.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-mono text-[#2D334A]/70 bg-[#F8FAFC] hover:bg-[#E3F6F5] hover:text-[#0D6E6E] px-2.5 py-1 rounded-lg border border-[#BAE8E8]/60 transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
