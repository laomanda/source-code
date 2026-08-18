"use client";

import * as React from "react";
import Link from "next/link";
import { Resource } from "@/types";
import { deleteResourceAction } from "@/lib/actions/resources";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

export interface ResourceManagerProps {
  initialResources: Resource[];
  categories: { id: string; name: string }[];
}

export function ResourceManager({
  initialResources,
  categories,
}: ResourceManagerProps) {
  const [resources, setResources] = React.useState(initialResources);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "published" | "draft">("all");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");

  // Custom Delete Dialog State
  const [resourceToDelete, setResourceToDelete] = React.useState<Resource | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    setResources(initialResources);
  }, [initialResources]);

  const filteredResources = React.useMemo(() => {
    return resources.filter((item) => {
      // Search
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.slug.toLowerCase().includes(q) ||
        item.technology.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));

      // Status
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      // Category
      const matchesCategory =
        categoryFilter === "all" || item.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [resources, searchQuery, statusFilter, categoryFilter]);

  const handleOpenDelete = (resource: Resource) => {
    setResourceToDelete(resource);
  };

  const handleConfirmDelete = async () => {
    if (!resourceToDelete) return;

    setIsDeleting(true);
    const res = await deleteResourceAction(resourceToDelete.id);
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success(`Resource "${resourceToDelete.title}" deleted.`);
      setResources((prev) => prev.filter((r) => r.id !== resourceToDelete.id));
    }
    setIsDeleting(false);
    setResourceToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-h2 text-[#272343]">Resource Catalog</h1>
          <p className="text-body-small text-[#2D334A]/80">
            Create, edit, preview, and publish reusable source-code components and templates.
          </p>
        </div>

        <Button asChild variant="primary" size="sm" className="gap-1.5 font-semibold">
          <Link href="/admin/resources/new">
            <Plus className="h-3.5 w-3.5" />
            <span>New Resource</span>
          </Link>
        </Button>
      </div>

      {/* Filter Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Search */}
        <div className="sm:col-span-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#2D334A]/50" />
          <Input
            placeholder="Filter by title, slug, tech, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs"
          />
        </div>

        {/* Status Filter */}
        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | "published" | "draft")}
            className="w-full h-9 rounded-md border border-[#BAE8E8] bg-white px-2.5 text-xs text-[#272343] shadow-soft-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343]"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="sm:col-span-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full h-9 rounded-md border border-[#BAE8E8] bg-white px-2.5 text-xs text-[#272343] shadow-soft-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343]"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Resources Table Card */}
      <Card className="border-[#BAE8E8] bg-white shadow-soft overflow-hidden">
        <CardContent className="p-0">
          {filteredResources.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#E3F6F5]/50 border-b border-[#BAE8E8] text-[#2D334A] font-semibold">
                  <tr>
                    <th className="py-3 px-4">Title & Slug</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Technology</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Viewports</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#BAE8E8]/40 text-[#2D334A]">
                  {filteredResources.map((item) => (
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
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#2D334A]/70">
                        {[
                          item.responsive.desktop && "D",
                          item.responsive.tablet && "T",
                          item.responsive.mobile && "M",
                        ]
                          .filter(Boolean)
                          .join(" · ") || "None"}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.status === "published" && (
                            <Button asChild variant="ghost" size="icon-sm" title="View live on site" className="h-7 w-7">
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
                          <Button
                            onClick={() => handleOpenDelete(item)}
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-xs gap-1 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                          >
                            <Trash2 className="h-3 w-3" />
                            <span>Delete</span>
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
              No resources match your current filter.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Custom Delete Confirmation Modal */}
      <DeleteConfirmDialog
        isOpen={!!resourceToDelete}
        title="Delete Resource"
        itemName={resourceToDelete?.title || ""}
        itemType="resource"
        description="This resource, including its source code and preview configuration, will be permanently removed from the JakDev library."
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setResourceToDelete(null)}
      />
    </div>
  );
}
