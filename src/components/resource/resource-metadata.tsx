import * as React from "react";
import { Resource } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, ShieldCheck, Layers, Monitor, Tablet, Smartphone } from "lucide-react";

export interface ResourceMetadataProps {
  resource: Resource;
}

export function ResourceMetadata({ resource }: ResourceMetadataProps) {
  return (
    <Card className="border-[#BAE8E8] bg-white shadow-soft">
      <CardHeader className="pb-3">
        <CardTitle className="text-base text-[#272343] flex items-center gap-2">
          <Layers className="h-4 w-4 text-[#272343]" />
          <span>Resource Specifications</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-xs text-[#2D334A]">
        {/* Specification rows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          {/* Category */}
          <div className="p-3 rounded-lg bg-[#E3F6F5]/40 border border-[#BAE8E8] space-y-1">
            <span className="text-[11px] text-[#2D334A]/70 uppercase font-mono">Category</span>
            <p className="font-semibold text-sm text-[#272343]">{resource.category}</p>
          </div>

          {/* Technology */}
          <div className="p-3 rounded-lg bg-[#E3F6F5]/40 border border-[#BAE8E8] space-y-1">
            <span className="text-[11px] text-[#2D334A]/70 uppercase font-mono">Technology</span>
            <p className="font-semibold text-sm text-[#272343]">{resource.technology}</p>
          </div>

          {/* Responsive Support */}
          <div className="p-3 rounded-lg bg-[#E3F6F5]/40 border border-[#BAE8E8] space-y-1">
            <span className="text-[11px] text-[#2D334A]/70 uppercase font-mono">Supported Viewports</span>
            <div className="flex items-center gap-1.5 pt-0.5">
              {resource.responsive.desktop && (
                <Badge variant="outline" size="sm" className="gap-1 font-mono">
                  <Monitor className="h-3 w-3" /> Desktop
                </Badge>
              )}
              {resource.responsive.tablet && (
                <Badge variant="outline" size="sm" className="gap-1 font-mono">
                  <Tablet className="h-3 w-3" /> Tablet
                </Badge>
              )}
              {resource.responsive.mobile && (
                <Badge variant="outline" size="sm" className="gap-1 font-mono">
                  <Smartphone className="h-3 w-3" /> Mobile
                </Badge>
              )}
            </div>
          </div>

          {/* License & Status */}
          <div className="p-3 rounded-lg bg-[#E3F6F5]/40 border border-[#BAE8E8] space-y-1">
            <span className="text-[11px] text-[#2D334A]/70 uppercase font-mono">License</span>
            <div className="flex items-center gap-1 text-emerald-700 font-semibold text-xs pt-0.5">
              <ShieldCheck className="h-4 w-4" />
              <span>MIT / 100% Free</span>
            </div>
          </div>
        </div>

        {/* Free Code Pledge */}
        <div className="pt-2 flex items-center gap-2 text-[11px] text-[#2D334A]/70 border-t border-[#BAE8E8]/50">
          <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
          <span>You are free to copy, modify, and distribute this source code in personal and commercial applications.</span>
        </div>
      </CardContent>
    </Card>
  );
}
