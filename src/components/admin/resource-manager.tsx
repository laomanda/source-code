"use client";

import * as React from "react";
import Link from "next/link";
import { Resource } from "@/types";
import { deleteResourceAction, bulkDeleteResourcesAction } from "@/lib/actions/resources";
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
  Eye,
  CheckSquare,
  Square,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
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
  const tableContainerRef = React.useRef<HTMLDivElement>(null);
  const [resources, setResources] = React.useState(initialResources);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<"all" | "published" | "draft">("all");
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all");

  // Pagination state
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);

  // Selection state
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  // Single delete dialog
  const [resourceToDelete, setResourceToDelete] = React.useState<Resource | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Bulk delete dialog
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = React.useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = React.useState(false);

  React.useEffect(() => {
    setResources(initialResources);
  }, [initialResources]);

  // Reset pagination to page 1 whenever filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, categoryFilter, pageSize]);

  const filteredResources = React.useMemo(() => {
    return resources.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.slug.toLowerCase().includes(q) ||
        item.technology.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      const matchesCategory =
        categoryFilter === "all" || item.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [resources, searchQuery, statusFilter, categoryFilter]);

  // Pagination calculations
  const totalItems = filteredResources.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = (validCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedResources = React.useMemo(() => {
    return filteredResources.slice(startIndex, endIndex);
  }, [filteredResources, startIndex, endIndex]);

  // Page change handler with smooth scroll
  const handlePageChange = (page: number) => {
    const targetPage = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(targetPage);
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Generate smart pagination numbers
  const pageNumbers = React.useMemo(() => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (validCurrentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (validCurrentPage >= totalPages - 3) {
        pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", validCurrentPage - 1, validCurrentPage, validCurrentPage + 1, "...", totalPages);
      }
    }
    return pages;
  }, [totalPages, validCurrentPage]);

  // Selection handlers (Page-level and All-level)
  const isCurrentPageAllSelected =
    paginatedResources.length > 0 &&
    paginatedResources.every((item) => selectedIds.has(item.id));

  const isCurrentPagePartiallySelected =
    paginatedResources.some((item) => selectedIds.has(item.id)) &&
    !isCurrentPageAllSelected;

  const handleToggleSelectCurrentPage = () => {
    const next = new Set(selectedIds);
    if (isCurrentPageAllSelected) {
      paginatedResources.forEach((item) => next.delete(item.id));
    } else {
      paginatedResources.forEach((item) => next.add(item.id));
    }
    setSelectedIds(next);
  };

  const handleSelectAllFiltered = () => {
    setSelectedIds(new Set(filteredResources.map((r) => r.id)));
  };

  const handleToggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  // Single delete
  const handleOpenDelete = (resource: Resource) => {
    setResourceToDelete(resource);
  };

  const handleConfirmDelete = async () => {
    if (!resourceToDelete) return;

    setIsDeleting(true);
    try {
      const res = await deleteResourceAction(resourceToDelete.id);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(`Komponen "${resourceToDelete.title}" berhasil dihapus.`);
        setResources((prev) => prev.filter((r) => r.id !== resourceToDelete.id));
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(resourceToDelete.id);
          return next;
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus komponen.";
      toast.error(msg);
    } finally {
      setIsDeleting(false);
      setResourceToDelete(null);
    }
  };

  // Bulk delete
  const handleConfirmBulkDelete = async () => {
    if (selectedIds.size === 0) return;

    const idsToDelete = Array.from(selectedIds);
    setIsBulkDeleting(true);
    try {
      const res = await bulkDeleteResourcesAction(idsToDelete);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(`Berhasil menghapus ${idsToDelete.length} komponen.`);
        setResources((prev) => prev.filter((r) => !selectedIds.has(r.id)));
        setSelectedIds(new Set());
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus komponen terpilih.";
      toast.error(msg);
    } finally {
      setIsBulkDeleting(false);
      setShowBulkDeleteDialog(false);
    }
  };

  return (
    <div ref={tableContainerRef} className="space-y-6 scroll-mt-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-h2 text-[#272343]">Katalog Komponen</h1>
        </div>

        <Button asChild variant="primary" size="sm" className="gap-1.5 font-semibold">
          <Link href="/admin/resources/new" prefetch={true}>
            <Plus className="h-3.5 w-3.5" />
            <span>Tambah Komponen</span>
          </Link>
        </Button>
      </div>

      {/* Quick Catalog Stats Chips */}
      <div className="flex flex-wrap items-center gap-2 text-xs border-b border-[#BAE8E8]/60 pb-3">
        <span className="font-semibold text-[#272343] text-xs">Ringkasan:</span>
        <span className="px-2.5 py-0.5 rounded-full bg-[#E3F6F5] border border-[#BAE8E8] text-[#272343] font-mono text-[11px]">
          <strong>{resources.length}</strong> Total
        </span>
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-[11px]">
          <strong>{resources.filter((r) => r.status === "published").length}</strong> Tayang
        </span>
        <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-mono text-[11px]">
          <strong>{resources.filter((r) => r.status === "draft").length}</strong> Draf
        </span>
        {filteredResources.length !== resources.length && (
          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 font-mono text-[11px]">
            Menampilkan <strong>{filteredResources.length}</strong> hasil filter
          </span>
        )}
      </div>

      {/* Filter Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Search */}
        <div className="sm:col-span-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#2D334A]/50" />
          <Input
            placeholder="Cari judul, slug, teknologi, atau tag..."
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
            <option value="all">Semua Status</option>
            <option value="published">Tayang (Published)</option>
            <option value="draft">Draf (Draft)</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="sm:col-span-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full h-9 rounded-md border border-[#BAE8E8] bg-white px-2.5 text-xs text-[#272343] shadow-soft-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343]"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="p-3 rounded-xl bg-slate-200 text-white shadow-soft-lg flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-2 text-xs">
            <span className="h-5 px-2 rounded bg-[#FFD803] text-[#272343] font-bold font-mono text-[11px] flex items-center justify-center">
              {selectedIds.size}
            </span>
            <span className="font-medium text-slate-600">Komponen dipilih</span>

            {/* Hint to select all across all pages */}
            {isCurrentPageAllSelected && filteredResources.length > paginatedResources.length && selectedIds.size < filteredResources.length && (
              <button
                type="button"
                onClick={handleSelectAllFiltered}
                className="ml-2 text-xs text-[#0D6E6E] font-semibold hover:underline"
              >
                Pilih semua {filteredResources.length} komponen yang terfilter
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClearSelection}
              className="h-8 text-xs bg-slate-200 text-slate-800 border-slate-800 hover:bg-slate-300"
            >
              <X className="h-3.5 w-3.5 mr-1 text-slate-800" />
              <span className="text-slate-800">Batal</span>
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => setShowBulkDeleteDialog(true)}
              className="h-8 text-xs bg-rose-600 hover:bg-rose-700 text-white font-semibold gap-1.5 shadow-sm"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Hapus Terpilih ({selectedIds.size})</span>
            </Button>
          </div>
        </div>
      )}

      {/* Resources Table Card */}
      <Card className="border-[#BAE8E8] bg-white shadow-soft overflow-hidden">
        <CardContent className="p-0">
          {paginatedResources.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#E3F6F5]/50 border-b border-[#BAE8E8] text-[#2D334A] font-semibold">
                  <tr>
                    <th className="py-3 px-4 w-10 text-center">
                      <button
                        type="button"
                        onClick={handleToggleSelectCurrentPage}
                        className="p-1 text-[#272343] hover:text-[#0D6E6E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343] rounded"
                        title={
                          isCurrentPageAllSelected
                            ? "Batalkan pilihan di halaman ini"
                            : "Pilih semua di halaman ini"
                        }
                      >
                        {isCurrentPageAllSelected ? (
                          <CheckSquare className="h-4 w-4 text-[#272343]" />
                        ) : isCurrentPagePartiallySelected ? (
                          <CheckSquare className="h-4 w-4 text-[#272343]/60" />
                        ) : (
                          <Square className="h-4 w-4 text-[#2D334A]/50" />
                        )}
                      </button>
                    </th>
                    <th className="py-3 px-4">Judul & Slug</th>
                    <th className="py-3 px-4">Kategori</th>
                    <th className="py-3 px-4">Teknologi</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#BAE8E8]/40 text-[#2D334A]">
                  {paginatedResources.map((item) => {
                    const isSelected = selectedIds.has(item.id);

                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-[#F4F9F9] transition-colors ${
                          isSelected ? "bg-[#E3F6F5]/40" : ""
                        }`}
                      >
                        <td className="py-3.5 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleSelect(item.id)}
                            className="p-1 text-[#272343] hover:text-[#0D6E6E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343] rounded"
                          >
                            {isSelected ? (
                              <CheckSquare className="h-4 w-4 text-[#272343]" />
                            ) : (
                              <Square className="h-4 w-4 text-[#2D334A]/40" />
                            )}
                          </button>
                        </td>

                        <td className="py-3.5 px-4 font-medium text-[#272343]">
                          <div className="font-semibold text-sm">{item.title}</div>
                          <div className="text-[11px] font-mono text-[#2D334A]/60">
                            /{item.slug}
                          </div>
                          {item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.tags.slice(0, 3).map((t) => (
                                <span
                                  key={t}
                                  className="text-[10px] font-mono text-[#2D334A]/70 bg-slate-100 px-1.5 py-0.2 rounded"
                                >
                                  #{t}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <Badge variant="navy" size="sm">
                            {item.category}
                          </Badge>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-[11px]">
                          {item.technology}
                        </td>

                        <td className="py-3.5 px-4">
                          {item.status === "published" ? (
                            <Badge variant="success" size="sm">
                              Tayang
                            </Badge>
                          ) : (
                            <Badge variant="warning" size="sm">
                              Draf
                            </Badge>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              asChild
                              variant="ghost"
                              size="icon-sm"
                              title="Pratinjau"
                              className="h-7 w-7 text-[#0D6E6E]"
                            >
                              <Link
                                href={`/resource/${item.slug}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </Link>
                            </Button>

                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="h-7 px-2 text-xs gap-1 border-[#BAE8E8]"
                            >
                              <Link href={`/admin/resources/${item.id}/edit`}>
                                <Edit className="h-3 w-3" />
                                <span>Edit</span>
                              </Link>
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleOpenDelete(item)}
                              title="Hapus"
                              className="h-7 w-7 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[#2D334A]/60">
              Tidak ada komponen ditemukan.
            </div>
          )}

          {/* Responsive, Smooth & Elegant Pagination Bar */}
          {totalItems > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3.5 border-t border-[#BAE8E8]/60 bg-[#FBFDFD] text-xs">
              {/* Left Info & Page Size */}
              <div className="flex flex-wrap items-center gap-3 text-[#2D334A]/80 w-full sm:w-auto justify-between sm:justify-start">
                <span className="text-xs">
                  Menampilkan <strong className="text-[#272343] font-semibold">{totalItems === 0 ? 0 : startIndex + 1}</strong>
                  –<strong className="text-[#272343] font-semibold">{endIndex}</strong> dari{" "}
                  <strong className="text-[#272343] font-semibold">{totalItems}</strong> komponen
                </span>

                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-[11px] text-[#2D334A]/60 hidden md:inline">Baris:</span>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="h-7 rounded-md border border-[#BAE8E8] bg-white px-2 text-[11px] font-medium text-[#272343] shadow-soft-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#272343] cursor-pointer"
                    aria-label="Pilih jumlah baris per halaman"
                  >
                    <option value={5}>5 / hal</option>
                    <option value={10}>10 / hal</option>
                    <option value={20}>20 / hal</option>
                    <option value={50}>50 / hal</option>
                  </select>
                </div>
              </div>

              {/* Right Controls */}
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  {/* First Page Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handlePageChange(1)}
                    disabled={validCurrentPage === 1}
                    title="Halaman Pertama"
                    className="h-8 w-8 text-[#2D334A] hover:bg-[#E3F6F5] hover:text-[#272343] disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>

                  {/* Previous Page Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handlePageChange(validCurrentPage - 1)}
                    disabled={validCurrentPage === 1}
                    title="Halaman Sebelumnya"
                    className="h-8 w-8 text-[#2D334A] hover:bg-[#E3F6F5] hover:text-[#272343] disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1 mx-1">
                    {pageNumbers.map((page, idx) => {
                      if (typeof page === "string") {
                        return (
                          <span
                            key={`ellipsis-${idx}`}
                            className="px-1.5 text-xs text-[#2D334A]/50 select-none font-mono"
                          >
                            ...
                          </span>
                        );
                      }

                      const isActive = page === validCurrentPage;

                      return (
                        <button
                          key={`page-${page}`}
                          type="button"
                          onClick={() => handlePageChange(page)}
                          className={`h-8 min-w-[32px] px-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                            isActive
                              ? "bg-[#272343] text-white shadow-soft-sm scale-105"
                              : "text-[#2D334A] hover:bg-[#E3F6F5] hover:text-[#272343]"
                          }`}
                          aria-label={`Ke halaman ${page}`}
                          aria-current={isActive ? "page" : undefined}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  {/* Next Page Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handlePageChange(validCurrentPage + 1)}
                    disabled={validCurrentPage === totalPages}
                    title="Halaman Berikutnya"
                    className="h-8 w-8 text-[#2D334A] hover:bg-[#E3F6F5] hover:text-[#272343] disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>

                  {/* Last Page Button */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={validCurrentPage === totalPages}
                    title="Halaman Terakhir"
                    className="h-8 w-8 text-[#2D334A] hover:bg-[#E3F6F5] hover:text-[#272343] disabled:opacity-30 disabled:hover:bg-transparent"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Single Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={!!resourceToDelete}
        title="Hapus Komponen"
        description={`Apakah Anda yakin ingin menghapus komponen "${resourceToDelete?.title}"? Tindakan ini tidak dapat dibatalkan.`}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setResourceToDelete(null)}
      />

      {/* Bulk Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={showBulkDeleteDialog}
        title={`Hapus ${selectedIds.size} Komponen Terpilih`}
        description={`Apakah Anda yakin ingin menghapus ${selectedIds.size} komponen yang dipilih sekaligus? Tindakan ini akan menghapus data secara permanen dan tidak dapat dibatalkan.`}
        isDeleting={isBulkDeleting}
        onConfirm={handleConfirmBulkDelete}
        onCancel={() => setShowBulkDeleteDialog(false)}
      />
    </div>
  );
}
