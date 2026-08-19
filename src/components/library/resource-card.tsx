"use client";

import * as React from "react";
import Link from "next/link";
import { Resource } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { FavoriteButton } from "@/components/library/favorite-button";
import { ShareButton } from "@/components/resource/share-button";
import { ArrowRight, Monitor, Tablet, Smartphone } from "lucide-react";

export interface ResourceCardProps {
  resource: Resource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <Card
      interactive
      className="flex flex-col justify-between group hover:border-[#8CD3D3] transition-all duration-200 bg-white"
    >
      <div>
        {/* Preview Top Area */}
        <div className="h-36 w-full rounded-t-lg bg-gradient-to-b from-[#E3F6F5]/60 to-[#E3F6F5]/20 border-b border-[#BAE8E8]/70 p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2">
            <Badge variant="navy" size="sm">
              {resource.category}
            </Badge>

            <div className="flex items-center gap-1.5">
              {/* Viewport indicators */}
              <div className="hidden sm:flex items-center gap-1 text-[#2D334A]/60 mr-1" title="Responsive viewport support">
                {resource.responsive.desktop && <Monitor className="h-3.5 w-3.5 text-[#272343]" />}
                {resource.responsive.tablet && <Tablet className="h-3.5 w-3.5 text-[#272343]" />}
                {resource.responsive.mobile && <Smartphone className="h-3.5 w-3.5 text-[#272343]" />}
              </div>

              {/* 1-Click Share Button */}
              <ShareButton
                slug={resource.slug}
                title={resource.title}
                description={resource.description}
                category={resource.category}
                technology={resource.technology}
              />

              {/* 1-Click Bookmark / Favorite Button */}
              <FavoriteButton
                slug={resource.slug}
                title={resource.title}
                category={resource.category}
                technology={resource.technology}
              />
            </div>
          </div>

          {/* Inline Code / Tags preview */}
          <div className="p-2 rounded bg-white border border-[#BAE8E8] shadow-soft-sm font-mono text-[11px] text-[#272343] truncate">
            {resource.tags.slice(0, 3).map((t) => `#${t}`).join(" ")}
          </div>
        </div>

        {/* Content Area */}
        <CardHeader className="pb-3 space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" size="sm" className="font-mono">
              {resource.technology}
            </Badge>
          </div>
          <CardTitle className="text-lg group-hover:text-[#272343] transition-colors leading-snug">
            {resource.title}
          </CardTitle>
          <CardDescription className="line-clamp-2 text-xs">
            {resource.description}
          </CardDescription>
        </CardHeader>
      </div>

      {/* Footer & Action */}
      <CardFooter className="pt-3 border-t border-[#BAE8E8]/40 justify-between items-center">
        <span className="text-[11px] font-mono text-[#0D6E6E] font-medium">Free Code</span>
        <Button asChild size="sm" variant="primary">
          <Link href={`/resource/${resource.slug}`} className="flex items-center gap-1.5 font-semibold">
            <span>View Resource</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
