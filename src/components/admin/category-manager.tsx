"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AdminCategoryWithCount } from "@/lib/data/admin";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
  bulkDeleteCategoriesAction,
} from "@/lib/actions/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import {
  Plus,
  Edit,
  Trash2,
  X,
  AlertCircle,
  Check,
  CheckSquare,
  Square,
  Search,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { toast } from "sonner";

export interface CategoryManagerProps {
  initialCategories: AdminCategoryWithCount[];
}

export function CategoryManager({ initialCategories }: CategoryManagerProps) {
  const [categories, setCategories] = React.useState(initialCategories);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<AdminCategoryWithCount | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  // Form State
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Selection State
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  // Single Delete Dialog
  const [categoryToDelete, setCategoryToDelete] = React.useState<AdminCategoryWithCount | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Bulk Delete Dialog
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = React.useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = React.useState(false);

  // Client Mounted
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when modal is open
  React.useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  React.useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  // Handle escape key to close modal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  const filteredCategories = React.useMemo(() => {
    if (!searchQuery.trim()) return categories;
    const q = searchQuery.toLowerCase().trim();
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
    );
  }, [categories, searchQuery]);

  // Reset to page 1 on search or page size change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, pageSize]);

  // Pagination Calculations
  const totalItems = filteredCategories.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

  const scrollToTable = () => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== validCurrentPage) {
      setCurrentPage(newPage);
      scrollToTable();
    }
  };

  // Selection handlers
  const handleToggleSelectAllPage = () => {
    const pageIds = paginatedCategories.map((c) => c.id);
    const allPageSelected = pageIds.every((id) => selectedIds.has(id));

    const next = new Set(selectedIds);
    if (allPageSelected) {
      pageIds.forEach((id) => next.delete(id));
    } else {
      pageIds.forEach((id) => next.add(id));
    }
    setSelectedIds(next);
  };

  const handleSelectAllFiltered = () => {
    setSelectedIds(new Set(filteredCategories.map((c) => c.id)));
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

  const openCreateModal = () => {
    setEditingCategory(null);
    setName("");
    setSlug("");
    setDescription("");
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: AdminCategoryWithCount) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setErrorMessage(null);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      const generated = val
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-");
      setSlug(generated);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    if (description) {
      formData.append("description", description);
    }

    try {
      if (editingCategory) {
        const res = await updateCategoryAction(editingCategory.id, formData);
        if (res.error) {
          setErrorMessage(res.error);
          toast.error(res.error);
          setIsLoading(false);
          return;
        }
        toast.success(`Kategori "${name}" berhasil diperbarui.`);
        setCategories((prev) =>
          prev.map((c) =>
            c.id === editingCategory.id
              ? { ...c, name, slug, description: description || null }
              : c
          )
        );
      } else {
        const res = await createCategoryAction(formData);
        if (res.error) {
          setErrorMessage(res.error);
          toast.error(res.error);
          setIsLoading(false);
          return;
        }
        toast.success(`Kategori "${name}" berhasil dibuat.`);
        const newCategory: AdminCategoryWithCount = {
          id: Date.now().toString(),
          name,
          slug,
          description: description || null,
          resourceCount: 0,
        };
        setCategories((prev) => [newCategory, ...prev]);
      }
      closeModal();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDelete = (cat: AdminCategoryWithCount) => {
    if (cat.resourceCount > 0) {
      toast.error(
        `Kategori "${cat.name}" tidak dapat dihapus karena masih digunakan oleh ${cat.resourceCount} komponen.`
      );
      return;
    }
    setCategoryToDelete(cat);
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(true);
    try {
      const res = await deleteCategoryAction(categoryToDelete.id);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(`Kategori "${categoryToDelete.name}" berhasil dihapus.`);
        setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id));
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(categoryToDelete.id);
          return next;
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus kategori.";
      toast.error(msg);
    } finally {
      setIsDeleting(false);
      setCategoryToDelete(null);
    }
  };

  const handleConfirmBulkDelete = async () => {
    if (selectedIds.size === 0) return;

    // Filter out categories that are currently attached to resources
    const inUse = categories.filter((c) => selectedIds.has(c.id) && c.resourceCount > 0);
    if (inUse.length > 0) {
      toast.error(
        `${inUse.length} kategori tidak dapat dihapus karena masih digunakan oleh komponen aktif.`
      );
      setIsBulkDeleting(false);
      setShowBulkDeleteDialog(false);
      return;
    }

    const idsToDelete = Array.from(selectedIds);
    setIsBulkDeleting(true);
    try {
      const res = await bulkDeleteCategoriesAction(idsToDelete);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(`Berhasil menghapus ${idsToDelete.length} kategori.`);
        setCategories((prev) => prev.filter((c) => !selectedIds.has(c.id)));
        setSelectedIds(new Set());
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus kategori terpilih.";
      toast.error(msg);
    } finally {
      setIsBulkDeleting(false);
      setShowBulkDeleteDialog(false);
    }
  };

  const isPageAllSelected =
    paginatedCategories.length > 0 &&
    paginatedCategories.every((c) => selectedIds.has(c.id));
  const isPagePartiallySelected =
    paginatedCategories.some((c) => selectedIds.has(c.id)) && !isPageAllSelected;

  // Generate pagination pills
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (validCurrentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (validCurrentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", validCurrentPage - 1, validCurrentPage, validCurrentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  const totalUsedCount = categories.reduce((sum, c) => sum + (c.resourceCount > 0 ? 1 : 0), 0);

  return (
    <div ref={tableContainerRef} className="space-y-6 scroll-mt-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-h2 text-[#272343]">Kelola Kategori</h1>
        </div>

        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={openCreateModal}
          className="gap-1.5 font-semibold"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Tambah Kategori</span>
        </Button>
      </div>

      {/* Quick Stats Chips */}
      <div className="flex flex-wrap items-center gap-2 text-xs border-b border-[#BAE8E8]/60 pb-3">
        <span className="font-semibold text-[#272343] text-xs">Ringkasan:</span>
        <span className="px-2.5 py-0.5 rounded-full bg-[#E3F6F5] border border-[#BAE8E8] text-[#272343] font-mono text-[11px]">
          <strong>{categories.length}</strong> Total
        </span>
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-[11px]">
          <strong>{totalUsedCount}</strong> Digunakan
        </span>
        <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-mono text-[11px]">
          <strong>{categories.length - totalUsedCount}</strong> Kosong
        </span>
        {filteredCategories.length !== categories.length && (
          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 font-mono text-[11px]">
            Menampilkan <strong>{filteredCategories.length}</strong> hasil filter
          </span>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#2D334A]/50" />
          <Input
            placeholder="Cari kategori berdasarkan nama, slug, atau deskripsi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-8 h-9 text-xs bg-white border-[#BAE8E8]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#2D334A]/50 hover:text-[#272343] p-0.5"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="p-3 rounded-xl bg-[#272343] text-white shadow-soft-lg flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-2 text-xs">
            <span className="h-6 px-2.5 rounded bg-[#FFD803] text-[#272343] font-bold font-mono text-xs flex items-center justify-center shadow-xs">
              {selectedIds.size}
            </span>
            <span className="font-semibold">Kategori terpilih</span>

            {selectedIds.size < filteredCategories.length && (
              <button
                type="button"
                onClick={handleSelectAllFiltered}
                className="ml-2 text-xs text-[#BAE8E8] hover:text-white underline underline-offset-2"
              >
                Pilih semua ({filteredCategories.length})
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClearSelection}
              className="h-8 text-xs bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              <span>Batal</span>
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

      {/* Categories Table Card */}
      <Card className="border-[#BAE8E8] bg-white shadow-soft overflow-hidden">
        <CardContent className="p-0">
          {paginatedCategories.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#E3F6F5]/50 border-b border-[#BAE8E8] text-[#2D334A] font-semibold">
                  <tr>
                    <th className="py-3 px-4 w-10 text-center">
                      <button
                        type="button"
                        onClick={handleToggleSelectAllPage}
                        className="p-1 text-[#272343] hover:text-[#0D6E6E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343] rounded"
                        title={isPageAllSelected ? "Batalkan pilihan halaman ini" : "Pilih semua di halaman ini"}
                      >
                        {isPageAllSelected ? (
                          <CheckSquare className="h-4 w-4 text-[#272343]" />
                        ) : isPagePartiallySelected ? (
                          <CheckSquare className="h-4 w-4 text-[#272343]/60" />
                        ) : (
                          <Square className="h-4 w-4 text-[#2D334A]/50" />
                        )}
                      </button>
                    </th>
                    <th className="py-3 px-4 font-semibold text-[#272343]">Nama Kategori</th>
                    <th className="py-3 px-4 font-semibold text-[#272343]">Slug URL</th>
                    <th className="py-3 px-4 font-semibold text-[#272343]">Deskripsi</th>
                    <th className="py-3 px-4 font-semibold text-[#272343]">Jumlah Komponen</th>
                    <th className="py-3 px-4 text-right font-semibold text-[#272343]">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#BAE8E8]/40 text-[#2D334A]">
                  {paginatedCategories.map((item) => {
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

                        <td className="py-3.5 px-4 font-bold text-[#272343]">
                          <div className="flex items-center gap-2">
                            <FolderOpen className="h-4 w-4 text-[#0D6E6E] shrink-0" />
                            <span>{item.name}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-[11px] text-[#2D334A]/80">
                          /{item.slug}
                        </td>

                        <td className="py-3.5 px-4 text-[#2D334A]/80 max-w-xs truncate">
                          {item.description || "-"}
                        </td>

                        <td className="py-3.5 px-4">
                          <Badge
                            variant={item.resourceCount > 0 ? "secondary" : "outline"}
                            size="sm"
                            className={item.resourceCount > 0 ? "font-semibold" : "text-[#2D334A]/60"}
                          >
                            {item.resourceCount} komponen
                          </Badge>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => openEditModal(item)}
                              className="h-7 px-2 text-xs gap-1 border-[#BAE8E8] text-[#272343] hover:bg-[#E3F6F5]"
                            >
                              <Edit className="h-3 w-3" />
                              <span>Edit</span>
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleOpenDelete(item)}
                              title={
                                item.resourceCount > 0
                                    ? `Tidak dapat dihapus (${item.resourceCount} komponen aktif)`
                                    : "Hapus Kategori"
                              }
                              disabled={item.resourceCount > 0}
                              className="h-7 w-7 text-rose-600 hover:text-rose-700 hover:bg-rose-50 disabled:opacity-30 disabled:cursor-not-allowed"
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
            <div className="p-12 text-center text-xs text-[#2D334A]/60 space-y-2">
              <FolderOpen className="h-8 w-8 mx-auto text-[#BAE8E8]" />
              <p className="font-semibold text-sm text-[#272343]">Tidak ada kategori ditemukan</p>
              <p className="text-[11px]">
                {searchQuery
                  ? `Tidak ada kategori yang cocok dengan kata kunci "${searchQuery}".`
                  : "Belum ada kategori yang terdaftar."}
              </p>
            </div>
          )}
        </CardContent>

        {/* Responsive, Smooth & Elegant Numbered Pagination Bar */}
        {totalItems > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-[#BAE8E8]/60 bg-[#FBFDFD]">
            {/* Left Info & Page Size */}
            <div className="flex flex-wrap items-center gap-3 text-[#2D334A]/80 w-full sm:w-auto justify-between sm:justify-start">
              <span className="text-xs">
                Menampilkan <strong className="text-[#272343] font-semibold">{totalItems === 0 ? 0 : startIndex + 1}</strong>
                –<strong className="text-[#272343] font-semibold">{endIndex}</strong> dari{" "}
                <strong className="text-[#272343] font-semibold">{totalItems}</strong> kategori
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
                  {getPageNumbers().map((page, idx) => {
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
      </Card>

      {/* Create / Edit Category Modal */}
      {mounted && isModalOpen && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-[#BAE8E8] bg-white p-6 shadow-soft-xl space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#BAE8E8]/60 pb-3">
              <div className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-[#272343]" />
                <h2 className="text-base font-bold text-[#272343]">
                  {editingCategory ? "Edit Kategori" : "Tambah Kategori Baru"}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="text-[#2D334A]/60 hover:text-[#272343] p-1 rounded-md transition-colors hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-[#272343]">
                  Nama Kategori <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  placeholder="contoh: Navigasi, Kartu, Form"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#272343]">
                  Slug URL <span className="text-rose-500">*</span>
                </label>
                <Input
                  required
                  placeholder="contoh: navigasi, kartu, form"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#272343]">Deskripsi</label>
                <textarea
                  rows={3}
                  placeholder="Deskripsi singkat mengenai jenis komponen dalam kategori ini..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-md border border-[#BAE8E8] bg-white p-2.5 text-xs text-[#272343] shadow-soft-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#BAE8E8]/60">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={closeModal}
                  disabled={isLoading}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isLoading}
                  className="gap-1.5 font-semibold"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>
                    {isLoading
                      ? "Menyimpan..."
                      : editingCategory
                      ? "Simpan Perubahan"
                      : "Buat Kategori"}
                  </span>
                </Button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Single Delete Confirm Dialog */}
      <DeleteConfirmDialog
        isOpen={!!categoryToDelete}
        title="Hapus Kategori"
        description={`Apakah Anda yakin ingin menghapus kategori "${categoryToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        itemName={categoryToDelete?.name}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setCategoryToDelete(null)}
      />

      {/* Bulk Delete Confirm Dialog */}
      <DeleteConfirmDialog
        isOpen={showBulkDeleteDialog}
        title="Hapus Kategori Terpilih"
        description={`Apakah Anda yakin ingin menghapus ${selectedIds.size} kategori yang dipilih? Tindakan ini tidak dapat dibatalkan.`}
        isDeleting={isBulkDeleting}
        onConfirm={handleConfirmBulkDelete}
        onCancel={() => setShowBulkDeleteDialog(false)}
      />
    </div>
  );
}
