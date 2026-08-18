import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Resource } from "@/types";

export interface ResourceHeaderProps {
  resource: Resource;
}

export function ResourceHeader({ resource }: ResourceHeaderProps) {
  return (
    <div className="space-y-3 max-w-4xl">
      {/* Category & Technology Badges */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="navy" size="default">
          {resource.category}
        </Badge>
        <Badge variant="secondary" size="default">
          {resource.technology}
        </Badge>
        <Badge variant="success" size="default">
          Free & Open
        </Badge>
      </div>

      {/* Main Title */}
      <h1 className="text-h1 sm:text-4xl text-[#272343]">
        {resource.title}
      </h1>

      {/* Description */}
      <p className="text-body-large text-[#2D334A]/85 max-w-3xl leading-relaxed">
        {resource.description}
      </p>

      {/* Tags */}
      {resource.tags && resource.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {resource.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-mono text-[#2D334A]/70 bg-[#E3F6F5]/50 px-2 py-0.5 rounded border border-[#BAE8E8]/60"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
