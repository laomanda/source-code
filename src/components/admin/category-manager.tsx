"use client";

import * as React from "react";
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

  const handleToggleSelectAll = () => {
    if (selectedIds.size === filteredCategories.length && filteredCategories.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredCategories.map((c) => c.id)));
    }
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
      // Auto-slug for new category
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
        // Update
        const res = await updateCategoryAction(editingCategory.id, formData);
        if (res.error) {
          setErrorMessage(res.error);
        } else {
          toast.success(`Kategori "${name}" berhasil diperbarui.`);
          setCategories((prev) =>
            prev.map((c) =>
              c.id === editingCategory.id
                ? { ...c, name, slug, description: description || null }
                : c
            )
          );
          closeModal();
        }
      } else {
        // Create
        const res = await createCategoryAction(formData);
        if (res.error) {
          setErrorMessage(res.error);
        } else {
          toast.success(`Kategori "${name}" berhasil dibuat.`);
          setCategories((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              name,
              slug,
              description: description || null,
              createdAt: new Date().toISOString(),
              resourceCount: 0,
            },
          ]);
          closeModal();
        }
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDelete = (cat: AdminCategoryWithCount) => {
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

  const isAllSelected =
    filteredCategories.length > 0 && selectedIds.size === filteredCategories.length;
  const isPartiallySelected =
    selectedIds.size > 0 && selectedIds.size < filteredCategories.length;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-h2 text-[#272343]">Kelola Kategori</h1>
          <p className="text-body-small text-[#2D334A]/80">
            Kelola klasifikasi taksonomi untuk komponen pustaka JakDev.
          </p>
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

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#2D334A]/50" />
        <Input
          placeholder="Cari kategori..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-9 text-xs"
        />
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="p-3 rounded-xl bg-[#272343] text-white shadow-soft-lg flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-2 text-xs">
            <span className="h-5 px-2 rounded bg-[#FFD803] text-[#272343] font-bold font-mono text-[11px] flex items-center justify-center">
              {selectedIds.size}
            </span>
            <span className="font-medium">Kategori dipilih</span>
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
          {filteredCategories.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#E3F6F5]/50 border-b border-[#BAE8E8] text-[#2D334A] font-semibold">
                  <tr>
                    <th className="py-3 px-4 w-10 text-center">
                      <button
                        type="button"
                        onClick={handleToggleSelectAll}
                        className="p-1 text-[#272343] hover:text-[#0D6E6E] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343] rounded"
                        title={isAllSelected ? "Batalkan semua pilihan" : "Pilih semua"}
                      >
                        {isAllSelected ? (
                          <CheckSquare className="h-4 w-4 text-[#272343]" />
                        ) : isPartiallySelected ? (
                          <CheckSquare className="h-4 w-4 text-[#272343]/60" />
                        ) : (
                          <Square className="h-4 w-4 text-[#2D334A]/50" />
                        )}
                      </button>
                    </th>
                    <th className="py-3 px-4">Nama</th>
                    <th className="py-3 px-4">Slug</th>
                    <th className="py-3 px-4">Deskripsi</th>
                    <th className="py-3 px-4">Jumlah Komponen</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#BAE8E8]/40 text-[#2D334A]">
                  {filteredCategories.map((item) => {
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

                        <td className="py-3.5 px-4 font-semibold text-[#272343]">
                          {item.name}
                        </td>

                        <td className="py-3.5 px-4 font-mono text-[11px] text-[#2D334A]/80">
                          /{item.slug}
                        </td>

                        <td className="py-3.5 px-4 text-[#2D334A]/80 max-w-xs truncate">
                          {item.description || "-"}
                        </td>

                        <td className="py-3.5 px-4">
                          <Badge variant="secondary" size="sm">
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
                              className="h-7 px-2 text-xs gap-1 border-[#BAE8E8]"
                            >
                              <Edit className="h-3 w-3" />
                              <span>Edit</span>
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleOpenDelete(item)}
                              title="Hapus Kategori"
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
            <div className="p-8 text-center text-xs text-[#2D334A]/60">
              Tidak ada kategori ditemukan.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-xl border border-[#BAE8E8] bg-white p-6 shadow-soft-lg space-y-4">
            <div className="flex items-center justify-between border-b border-[#BAE8E8]/60 pb-3">
              <h2 className="text-base font-bold text-[#272343]">
                {editingCategory ? "Edit Kategori" : "Tambah Kategori Baru"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="p-1 text-[#2D334A]/60 hover:text-[#272343] rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label htmlFor="cat-name" className="font-semibold text-[#272343]">
                  Nama Kategori <span className="text-rose-500">*</span>
                </label>
                <Input
                  id="cat-name"
                  required
                  placeholder="e.g. Navigations, Footers"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  disabled={isLoading}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="cat-slug" className="font-semibold text-[#272343]">
                  Slug URL <span className="text-rose-500">*</span>
                </label>
                <Input
                  id="cat-slug"
                  required
                  placeholder="e.g. navigations"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  disabled={isLoading}
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="cat-desc" className="font-semibold text-[#272343]">
                  Deskripsi (Opsional)
                </label>
                <textarea
                  id="cat-desc"
                  rows={3}
                  placeholder="Deskripsi singkat kategori ini..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isLoading}
                  className="w-full rounded-md border border-[#BAE8E8] bg-white p-2.5 text-xs text-[#272343] shadow-soft-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343]"
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
                  {isLoading ? (
                    <span>Menyimpan...</span>
                  ) : (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>{editingCategory ? "Simpan Perubahan" : "Buat Kategori"}</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Single Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={!!categoryToDelete}
        title="Hapus Kategori"
        description={`Apakah Anda yakin ingin menghapus kategori "${categoryToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setCategoryToDelete(null)}
      />

      {/* Bulk Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={showBulkDeleteDialog}
        title={`Hapus ${selectedIds.size} Kategori Terpilih`}
        description={`Apakah Anda yakin ingin menghapus ${selectedIds.size} kategori yang dipilih? Kategori yang masih digunakan oleh komponen tidak akan dapat dihapus.`}
        isDeleting={isBulkDeleting}
        onConfirm={handleConfirmBulkDelete}
        onCancel={() => setShowBulkDeleteDialog(false)}
      />
    </div>
  );
}
