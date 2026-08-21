import Link from "next/link";
import { getDetailedResourceStats } from "@/lib/data/admin";
import { ResourceStatistics } from "@/components/admin/resource-statistics";
import { Button } from "@/components/ui/button";
import { FolderTree, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const stats = await getDetailedResourceStats();

  return (
    <div className="space-y-8">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#BAE8E8]/60 pb-4">
        <div>
          <h1 className="text-h2 text-[#272343]">
            Dashboard & Statistik Admin
          </h1>
          <p className="text-body-small text-[#2D334A]/80">
            Analitik real-time, distribusi kategori, teknologi, dan status katalog.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="bg-white gap-1.5 border-[#BAE8E8]"
          >
            <Link href="/admin/categories">
              <FolderTree className="h-3.5 w-3.5 text-[#272343]" />
              <span>Kelola Kategori</span>
            </Link>
          </Button>

          <Button
            asChild
            variant="primary"
            size="sm"
            className="gap-1.5 font-semibold shadow-soft-sm"
          >
            <Link href="/admin/resources/new">
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah Komponen</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Resource Statistics Overview */}
      <ResourceStatistics stats={stats} />
    </div>
  );
}
