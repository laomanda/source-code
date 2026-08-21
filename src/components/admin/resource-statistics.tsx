"use client";

import * as React from "react";
import { ResourceDetailedStats } from "@/lib/data/admin";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  PieChart as PieChartIcon,
  Layers,
  FileCheck2,
  FileClock,
  FolderTree,
  Monitor,
  Tablet,
  Smartphone,
  Cpu,
  BarChart3,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export interface ResourceStatisticsProps {
  stats: ResourceDetailedStats;
}

const CATEGORY_COLORS = [
  "#272343", // Navy
  "#FFD803", // Electric Yellow
  "#43BCCD", // Cyan
  "#10B981", // Emerald
  "#F43F5E", // Rose
  "#8B5CF6", // Purple
  "#F59E0B", // Amber
  "#06B6D4", // Sky Cyan
];

const TECH_COLORS = [
  "#43BCCD",
  "#272343",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EC4899",
  "#3B82F6",
];

// Custom Tooltip for Recharts
function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { name: string; value: number; count?: number; percentage?: number } }> }) {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="rounded-xl border border-[#BAE8E8] bg-white p-2.5 shadow-soft-md text-xs space-y-1">
        <p className="font-semibold text-[#272343]">{data.name}</p>
        <p className="font-mono text-[#0D6E6E]">
          {data.value} komponen{" "}
          {data.payload.percentage ? `(${data.payload.percentage}%)` : ""}
        </p>
      </div>
    );
  }
  return null;
}

export function ResourceStatistics({ stats }: ResourceStatisticsProps) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prepare Category Chart Data
  const categoryData = React.useMemo(() => {
    return stats.categories.map((c) => ({
      name: c.name,
      value: c.count,
      percentage: c.percentage,
    }));
  }, [stats.categories]);

  // Prepare Technology Chart Data
  const techData = React.useMemo(() => {
    return stats.technologies.slice(0, 8).map((t) => ({
      name: t.name,
      value: t.count,
    }));
  }, [stats.technologies]);

  return (
    <div className="space-y-6">
      {/* 4 Quick Stat KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Resources */}
        <Card className="border-[#BAE8E8] bg-white shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-[#2D334A]/70 uppercase font-mono">
              Total Komponen
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-[#272343] text-[#FFD803] flex items-center justify-center">
              <Layers className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#272343]">{stats.totalCount}</div>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#2D334A]/70 font-medium">
              <span>{stats.publishedRatio}% Tayang Publik</span>
            </div>
          </CardContent>
        </Card>

        {/* Published Status */}
        <Card className="border-[#BAE8E8] bg-white shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-[#2D334A]/70 uppercase font-mono">
              Status Publikasi
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileCheck2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#272343]">{stats.publishedCount}</div>
            <p className="text-[11px] text-emerald-700 font-medium mt-1">
              Aktif di pustaka publik
            </p>
          </CardContent>
        </Card>

        {/* Drafts */}
        <Card className="border-[#BAE8E8] bg-white shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-[#2D334A]/70 uppercase font-mono">
              Draf Belum Tayang
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileClock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#272343]">{stats.draftCount}</div>
            <p className="text-[11px] text-amber-700 font-medium mt-1">
              Tersembunyi dari publik
            </p>
          </CardContent>
        </Card>

        {/* Categories */}
        <Card className="border-[#BAE8E8] bg-white shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-[#2D334A]/70 uppercase font-mono">
              Kategori
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-[#E3F6F5] text-[#272343] flex items-center justify-center">
              <FolderTree className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#272343]">{stats.categoryCount}</div>
            <p className="text-[11px] text-[#2D334A]/70 mt-1">
              Klasifikasi kategori
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Two-Column Visual Charts & Diagrams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Interactive Donut / Pie Chart: Category Distribution */}
        <Card className="border-[#BAE8E8] bg-white shadow-soft flex flex-col justify-between">
          <CardHeader className="pb-3 border-b border-[#BAE8E8]/40">
            <CardTitle className="text-sm text-[#272343] flex items-center justify-between">
              <span className="flex items-center gap-2">
                <PieChartIcon className="h-4 w-4 text-[#272343]" />
                <span>Distribusi Kategori</span>
              </span>
              <span className="text-[11px] font-mono text-[#2D334A]/60 font-normal">
                {stats.categories.length} kategori aktif
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-6">
            {stats.categories.length > 0 && isMounted ? (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                {/* Donut Chart Canvas */}
                <div className="relative h-56 w-56 shrink-0 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Tooltip content={<CustomTooltip />} />
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {categoryData.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                            stroke="#ffffff"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Center Text inside Donut */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-extrabold text-[#272343] font-heading">
                      {stats.totalCount}
                    </span>
                    <span className="text-[10px] uppercase font-mono text-[#2D334A]/70">
                      Komponen
                    </span>
                  </div>
                </div>

                {/* Legend List */}
                <div className="flex-1 space-y-2 w-full max-w-xs">
                  {stats.categories.map((item, index) => {
                    const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
                    return (
                      <div
                        key={item.name}
                        className="flex items-center justify-between p-2 rounded-lg bg-[#F8FAFC] border border-[#BAE8E8]/50 hover:bg-[#E3F6F5]/40 transition-colors"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span
                            className="h-3 w-3 rounded-full shrink-0 shadow-xs"
                            style={{ backgroundColor: color }}
                          />
                          <span className="text-xs font-semibold text-[#272343] truncate">
                            {item.name}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] text-[#2D334A]/80 font-medium shrink-0 ml-2">
                          {item.count} ({item.percentage}%)
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="h-56 flex items-center justify-center text-xs text-[#2D334A]/60">
                Belum ada data kategori.
              </div>
            )}
          </CardContent>
        </Card>

        {/* 2. Visual Bar Chart: Technology Distribution */}
        <Card className="border-[#BAE8E8] bg-white shadow-soft flex flex-col justify-between">
          <CardHeader className="pb-3 border-b border-[#BAE8E8]/40">
            <CardTitle className="text-sm text-[#272343] flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-[#272343]" />
                <span>Distribusi Teknologi & Framework</span>
              </span>
              <span className="text-[11px] font-mono text-[#2D334A]/60 font-normal">
                {stats.technologies.length} teknologi
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-6">
            {stats.technologies.length > 0 && isMounted ? (
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={techData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                  >
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#2D334A", fontSize: 10, fontFamily: "monospace" }}
                      axisLine={{ stroke: "#BAE8E8" }}
                      tickLine={false}
                      interval={0}
                      angle={-20}
                      textAnchor="end"
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: "#2D334A", fontSize: 10, fontFamily: "monospace" }}
                      axisLine={{ stroke: "#BAE8E8" }}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {techData.map((_, index) => (
                        <Cell
                          key={`bar-${index}`}
                          fill={TECH_COLORS[index % TECH_COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-56 flex items-center justify-center text-xs text-[#2D334A]/60">
                Belum ada data teknologi.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Viewport & Tech Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Responsive Desktop */}
        <div className="p-4 rounded-xl bg-white border border-[#BAE8E8] shadow-soft-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#E3F6F5] border border-[#BAE8E8] flex items-center justify-center text-[#272343]">
              <Monitor className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-[#2D334A]/70 font-mono uppercase">Desktop</p>
              <p className="text-lg font-bold text-[#272343]">{stats.desktopCount} Komponen</p>
            </div>
          </div>
        </div>

        {/* Responsive Tablet */}
        <div className="p-4 rounded-xl bg-white border border-[#BAE8E8] shadow-soft-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#E3F6F5] border border-[#BAE8E8] flex items-center justify-center text-[#272343]">
              <Tablet className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-[#2D334A]/70 font-mono uppercase">Tablet (768px)</p>
              <p className="text-lg font-bold text-[#272343]">{stats.tabletCount} Komponen</p>
            </div>
          </div>
        </div>

        {/* Responsive Mobile */}
        <div className="p-4 rounded-xl bg-white border border-[#BAE8E8] shadow-soft-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#E3F6F5] border border-[#BAE8E8] flex items-center justify-center text-[#272343]">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-[#2D334A]/70 font-mono uppercase">Ponsel (375px)</p>
              <p className="text-lg font-bold text-[#272343]">{stats.mobileCount} Komponen</p>
            </div>
          </div>
        </div>

        {/* Technology Frameworks Badge Pool */}
        <div className="p-4 rounded-xl bg-white border border-[#BAE8E8] shadow-soft-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#E3F6F5] border border-[#BAE8E8] flex items-center justify-center text-[#272343]">
              <Cpu className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] text-[#2D334A]/70 font-mono uppercase">Teknologi</p>
              <p className="text-lg font-bold text-[#272343]">{stats.technologies.length} Framework</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
