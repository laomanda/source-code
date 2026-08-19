import Link from "next/link";
import { getDetailedResourceStats, getAllAdminResources } from "@/lib/data/admin";
import { ResourceStatistics } from "@/components/admin/resource-statistics";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FolderTree,
  Plus,
  ArrowRight,
  Edit,
  Eye,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [stats, resources] = await Promise.all([
    getDetailedResourceStats(),
    getAllAdminResources(),
  ]);

  const recentResources = resources.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#BAE8E8]/60 pb-4">
        <div>
          <h1 className="text-h2 text-[#272343]">Admin Dashboard & Statistics</h1>
          <p className="text-body-small text-[#2D334A]/80">
            Real-time analytics, category distribution, tech stacks, and catalog health.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline" size="sm" className="bg-white gap-1.5 border-[#BAE8E8]">
            <Link href="/admin/categories">
              <FolderTree className="h-3.5 w-3.5 text-[#272343]" />
              <span>Manage Categories</span>
            </Link>
          </Button>

          <Button asChild variant="primary" size="sm" className="gap-1.5 font-semibold shadow-soft-sm">
            <Link href="/admin/resources/new">
              <Plus className="h-3.5 w-3.5" />
              <span>Create Resource</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Resource Statistics Overview */}
      <ResourceStatistics stats={stats} />

      {/* Recent Resources Table Card */}
      <Card className="border-[#BAE8E8] bg-white shadow-soft overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-[#BAE8E8]/60 pb-4">
          <div>
            <CardTitle className="text-base text-[#272343]">Recent Resources</CardTitle>
            <p className="text-xs text-[#2D334A]/70 mt-0.5">Latest additions to the database.</p>
          </div>
          <Button asChild variant="ghost" size="sm" className="text-xs gap-1">
            <Link href="/admin/resources">
              <span>View All ({stats.totalCount})</span>
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
                        <div className="font-semibold">{item.title}</div>
                        <div className="text-[11px] font-mono text-[#2D334A]/60">/{item.slug}</div>
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
                          <Button asChild variant="ghost" size="icon-sm" title="Preview" className="h-7 w-7 text-[#0D6E6E]">
                            <Link href={`/resource/${item.slug}`} target="_blank">
                              <Eye className="h-3.5 w-3.5" />
                            </Link>
                          </Button>
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
              No resources found. Create your first resource with the &ldquo;Create Resource&rdquo; button.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
