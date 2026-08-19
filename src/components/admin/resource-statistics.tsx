"use client";

import * as React from "react";
import { ResourceDetailedStats } from "@/lib/data/admin";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PieChart,
  Layers,
  FileCheck2,
  FileClock,
  FolderTree,
  Monitor,
  Tablet,
  Smartphone,
  Cpu,
  Hash,
  CheckCircle2,
} from "lucide-react";

export interface ResourceStatisticsProps {
  stats: ResourceDetailedStats;
}

export function ResourceStatistics({ stats }: ResourceStatisticsProps) {
  return (
    <div className="space-y-6">
      {/* 4 Quick Stat KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Resources */}
        <Card className="border-[#BAE8E8] bg-white shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-[#2D334A]/70 uppercase font-mono">
              Total Resources
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-[#272343] text-[#FFD803] flex items-center justify-center">
              <Layers className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#272343]">{stats.totalCount}</div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#2D334A]/70 font-medium">
              <span>{stats.publishedRatio}% Published live</span>
            </div>
          </CardContent>
        </Card>

        {/* Published Ratio */}
        <Card className="border-[#BAE8E8] bg-white shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-[#2D334A]/70 uppercase font-mono">
              Published Status
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileCheck2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#272343]">{stats.publishedCount}</div>
            <p className="text-[11px] text-emerald-700 font-medium mt-1">
              Active in public library
            </p>
          </CardContent>
        </Card>

        {/* Drafts */}
        <Card className="border-[#BAE8E8] bg-white shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-[#2D334A]/70 uppercase font-mono">
              Pending Drafts
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileClock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#272343]">{stats.draftCount}</div>
            <p className="text-[11px] text-amber-700 font-medium mt-1">
              Hidden / Pre-publish preview
            </p>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card className="border-[#BAE8E8] bg-white shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-[#2D334A]/70 uppercase font-mono">
              Categories
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-[#E3F6F5] text-[#272343] flex items-center justify-center">
              <FolderTree className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#272343]">{stats.categoryCount}</div>
            <p className="text-[11px] text-[#2D334A]/70 mt-1">
              Taxonomy groupings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Two-Column Deep Distribution Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown Card */}
        <Card className="border-[#BAE8E8] bg-white shadow-soft">
          <CardHeader className="pb-3 border-b border-[#BAE8E8]/40">
            <CardTitle className="text-sm text-[#272343] flex items-center justify-between">
              <span className="flex items-center gap-2">
                <PieChart className="h-4 w-4 text-[#272343]" />
                <span>Category Distribution</span>
              </span>
              <span className="text-[11px] font-mono text-[#2D334A]/60 font-normal">
                {stats.categories.length} active classifications
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3.5 text-xs">
            {stats.categories.length > 0 ? (
              stats.categories.map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between font-medium">
                    <span className="text-[#272343] font-semibold">{item.name}</span>
                    <span className="font-mono text-[11px] text-[#2D334A]/80">
                      {item.count} items ({item.percentage}%)
                    </span>
                  </div>
                  {/* Visual Bar */}
                  <div className="h-2 w-full rounded-full bg-[#E3F6F5]/80 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#272343] transition-all duration-500"
                      style={{ width: `${Math.max(item.percentage, 5)}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-4 text-[#2D334A]/60">No category data available.</p>
            )}
          </CardContent>
        </Card>

        {/* Viewport & Tech Stack Matrix */}
        <div className="space-y-6">
          {/* Responsive Coverage */}
          <Card className="border-[#BAE8E8] bg-white shadow-soft">
            <CardHeader className="pb-3 border-b border-[#BAE8E8]/40">
              <CardTitle className="text-sm text-[#272343] flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Responsive Viewport Coverage</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                {/* Desktop */}
                <div className="p-3 rounded-lg bg-[#E3F6F5]/40 border border-[#BAE8E8]/70 space-y-1">
                  <div className="flex items-center justify-center text-[#272343]">
                    <Monitor className="h-4 w-4" />
                  </div>
                  <div className="text-lg font-bold text-[#272343]">{stats.desktopCount}</div>
                  <div className="text-[10px] text-[#2D334A]/70 font-medium">Desktop (100%)</div>
                </div>

                {/* Tablet */}
                <div className="p-3 rounded-lg bg-[#E3F6F5]/40 border border-[#BAE8E8]/70 space-y-1">
                  <div className="flex items-center justify-center text-[#272343]">
                    <Tablet className="h-4 w-4" />
                  </div>
                  <div className="text-lg font-bold text-[#272343]">{stats.tabletCount}</div>
                  <div className="text-[10px] text-[#2D334A]/70 font-medium">Tablet (768px)</div>
                </div>

                {/* Mobile */}
                <div className="p-3 rounded-lg bg-[#E3F6F5]/40 border border-[#BAE8E8]/70 space-y-1">
                  <div className="flex items-center justify-center text-[#272343]">
                    <Smartphone className="h-4 w-4" />
                  </div>
                  <div className="text-lg font-bold text-[#272343]">{stats.mobileCount}</div>
                  <div className="text-[10px] text-[#2D334A]/70 font-medium">Mobile (375px)</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technology Stacks */}
          <Card className="border-[#BAE8E8] bg-white shadow-soft">
            <CardHeader className="pb-3 border-b border-[#BAE8E8]/40">
              <CardTitle className="text-sm text-[#272343] flex items-center gap-2">
                <Cpu className="h-4 w-4 text-[#272343]" />
                <span>Technology Frameworks</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-2">
              <div className="flex flex-wrap gap-2">
                {stats.technologies.map((tech) => (
                  <div
                    key={tech.name}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#F4F9F9] border border-[#BAE8E8] text-xs font-mono text-[#272343]"
                  >
                    <span>{tech.name}</span>
                    <span className="h-4 min-w-[16px] px-1 rounded bg-[#272343] text-[#FFD803] text-[10px] font-bold flex items-center justify-center">
                      {tech.count}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Popular Tags Cloud */}
      {stats.topTags.length > 0 && (
        <Card className="border-[#BAE8E8] bg-white shadow-soft">
          <CardHeader className="pb-3 border-b border-[#BAE8E8]/40">
            <CardTitle className="text-sm text-[#272343] flex items-center gap-2">
              <Hash className="h-4 w-4 text-[#272343]" />
              <span>Top Library Tags</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-wrap items-center gap-2">
              {stats.topTags.map((t) => (
                <Badge
                  key={t.tag}
                  variant="secondary"
                  size="default"
                  className="font-mono text-xs gap-1.5 py-1 px-2.5 bg-[#E3F6F5]/60 hover:bg-[#E3F6F5] border-[#BAE8E8] text-[#272343]"
                >
                  <span>#{t.tag}</span>
                  <span className="text-[10px] text-[#2D334A]/60 font-bold">
                    ({t.count})
                  </span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
