import Link from "next/link";
import { getAdminStats, getAllAdminResources } from "@/lib/data/admin";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Layers,
  FileCheck2,
  FileClock,
  FolderTree,
  Plus,
  ArrowRight,
  Edit,
  ExternalLink,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [stats, resources] = await Promise.all([
    getAdminStats(),
    getAllAdminResources(),
  ]);

  const recentResources = resources.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-h2 text-[#272343]">Admin Dashboard</h1>
          <p className="text-body-small text-[#2D334A]/80">
            Overview of the JakDev catalog, categories, and published status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" size="sm" className="bg-white gap-1.5">
            <Link href="/admin/categories">
              <FolderTree className="h-3.5 w-3.5" />
              <span>Categories</span>
            </Link>
          </Button>

          <Button asChild variant="primary" size="sm" className="gap-1.5 font-semibold">
            <Link href="/admin/resources/new">
              <Plus className="h-3.5 w-3.5" />
              <span>New Resource</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Published Resources */}
        <Card className="border-[#BAE8E8] bg-white shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-[#2D334A]/70 uppercase font-mono">
              Published
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileCheck2 className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#272343]">{stats.publishedCount}</div>
            <p className="text-[11px] text-[#2D334A]/60 mt-1">Live in public library</p>
          </CardContent>
        </Card>

        {/* Draft Resources */}
        <Card className="border-[#BAE8E8] bg-white shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-[#2D334A]/70 uppercase font-mono">
              Drafts
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileClock className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#272343]">{stats.draftCount}</div>
            <p className="text-[11px] text-[#2D334A]/60 mt-1">Hidden from public</p>
          </CardContent>
        </Card>

        {/* Total Categories */}
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
            <p className="text-[11px] text-[#2D334A]/60 mt-1">Active classifications</p>
          </CardContent>
        </Card>

        {/* Total Catalog Items */}
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
            <p className="text-[11px] text-[#2D334A]/60 mt-1">Combined resources</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Resources Table Card */}
      <Card className="border-[#BAE8E8] bg-white shadow-soft overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-[#BAE8E8]/60 pb-4">
          <div>
            <CardTitle className="text-lg text-[#272343]">Recent Resources</CardTitle>
            <p className="text-xs text-[#2D334A]/70 mt-0.5">Latest additions to the database.</p>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-xs gap-1">
            <Link href="/admin/resources">
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {recentResources.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#E3F6F5]/50 border-b border-[#BAE8E8] text-[#2D334A] font-semibold">
                  <tr>
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Technology</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#BAE8E8]/40 text-[#2D334A]">
                  {recentResources.map((item) => (
                    <tr key={item.id} className="hover:bg-[#F4F9F9] transition-colors">
                      <td className="py-3.5 px-4 font-medium text-[#272343]">
                        <div>{item.title}</div>
                        <div className="text-[11px] font-mono text-[#2D334A]/60">{item.slug}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant="navy" size="sm">{item.category}</Badge>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px]">{item.technology}</td>
                      <td className="py-3.5 px-4">
                        {item.status === "published" ? (
                          <Badge variant="success" size="sm">Published</Badge>
                        ) : (
                          <Badge variant="warning" size="sm">Draft</Badge>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.status === "published" && (
                            <Button asChild variant="ghost" size="icon-sm" title="View live" className="h-7 w-7">
                              <Link href={`/resource/${item.slug}`} target="_blank">
                                <ExternalLink className="h-3.5 w-3.5" />
                              </Link>
                            </Button>
                          )}
                          <Button asChild variant="outline" size="sm" className="h-7 px-2 text-xs gap-1">
                            <Link href={`/admin/resources/${item.id}/edit`}>
                              <Edit className="h-3 w-3" />
                              <span>Edit</span>
                            </Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[#2D334A]/60">
              No resources found. Create your first resource with the &ldquo;New Resource&rdquo; button.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
