"use client";

import * as React from "react";
import { AdminCategoryWithCount } from "@/lib/data/admin";
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
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
} from "lucide-react";
import { toast } from "sonner";

export interface CategoryManagerProps {
  initialCategories: AdminCategoryWithCount[];
}

export function CategoryManager({ initialCategories }: CategoryManagerProps) {
  const [categories, setCategories] = React.useState(initialCategories);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<AdminCategoryWithCount | null>(null);

  // Form State
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Custom Delete Dialog State
  const [categoryToDelete, setCategoryToDelete] = React.useState<AdminCategoryWithCount | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

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
    formData.append("description", description);

    try {
      if (editingCategory) {
        const res = await updateCategoryAction(editingCategory.id, null, formData);
        if (res.error) {
          setErrorMessage(res.error);
          toast.error(res.error);
        } else {
          toast.success(`Kategori "${name}" berhasil diperbarui!`);
          closeModal();
        }
      } else {
        const res = await createCategoryAction(null, formData);
        if (res.error) {
          setErrorMessage(res.error);
          toast.error(res.error);
        } else {
          toast.success(`Kategori "${name}" berhasil ditambahkan!`);
          closeModal();
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal memproses kategori.";
      if (
        msg.includes("Server Action") ||
        msg.includes("was not found") ||
        msg.includes("UnrecognizedActionError")
      ) {
        toast.error("Server diperbarui. Memuat ulang halaman...", {
          description: "Memuat ulang halaman untuk menyinkronkan tindakan server terbaru.",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setErrorMessage(msg);
        toast.error(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDelete = (cat: AdminCategoryWithCount) => {
    if (cat.resourceCount > 0) {
      toast.error(
        `Tidak dapat menghapus "${cat.name}": ada ${cat.resourceCount} komponen yang terhubung. Pindahkan komponen terlebih dahulu.`
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
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus kategori.";
      if (
        msg.includes("Server Action") ||
        msg.includes("was not found") ||
        msg.includes("UnrecognizedActionError")
      ) {
        toast.error("Server diperbarui. Memuat ulang halaman...", {
          description: "Memuat ulang halaman untuk menyinkronkan tindakan server terbaru.",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(msg);
      }
    } finally {
      setIsDeleting(false);
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-h2 text-[#272343]">Category Management</h1>
          <p className="text-body-small text-[#2D334A]/80">
            Create, update, and manage taxonomy categories for resources.
          </p>
        </div>

        <Button onClick={openCreateModal} variant="primary" size="sm" className="gap-1.5 font-semibold">
          <Plus className="h-3.5 w-3.5" />
          <span>New Category</span>
        </Button>
      </div>

      {/* Categories Table Card */}
      <Card className="border-[#BAE8E8] bg-white shadow-soft overflow-hidden">
        <CardContent className="p-0">
          {categories.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#E3F6F5]/50 border-b border-[#BAE8E8] text-[#2D334A] font-semibold">
                  <tr>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Slug</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Resources</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#BAE8E8]/40 text-[#2D334A]">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-[#F4F9F9] transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-[#272343]">
                        {cat.name}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#2D334A]/70">
                        {cat.slug}
                      </td>
                      <td className="py-3.5 px-4 max-w-xs truncate text-[#2D334A]/80">
                        {cat.description || "—"}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={cat.resourceCount > 0 ? "secondary" : "outline"} size="sm" className="font-mono">
                          {cat.resourceCount} {cat.resourceCount === 1 ? "item" : "items"}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            onClick={() => openEditModal(cat)}
                            variant="outline"
                            size="sm"
                            className="h-7 px-2 text-xs gap-1"
                          >
                            <Edit className="h-3 w-3" />
                            <span>Edit</span>
                          </Button>
                          <Button
                            onClick={() => handleOpenDelete(cat)}
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
              No categories found. Click &ldquo;New Category&rdquo; to add one.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-[#BAE8E8] bg-white p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-[#BAE8E8]/60 pb-3">
              <h3 className="text-base font-heading font-bold text-[#272343]">
                {editingCategory ? "Edit Category" : "New Category"}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="p-1 rounded text-[#2D334A]/60 hover:text-[#272343]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-[#272343]">Category Name *</label>
                <Input
                  required
                  placeholder="e.g. Components"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#272343]">Slug *</label>
                <Input
                  required
                  placeholder="e.g. components"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#272343]">Description</label>
                <textarea
                  rows={3}
                  placeholder="Short description of what goes into this category..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-md border border-[#BAE8E8] bg-white p-2.5 text-xs text-[#272343] shadow-soft-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#BAE8E8]/60">
                <Button
                  type="button"
                  onClick={closeModal}
                  variant="outline"
                  size="sm"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isLoading}
                  className="font-semibold gap-1.5"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>{isLoading ? "Saving..." : editingCategory ? "Save Changes" : "Create"}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      <DeleteConfirmDialog
        isOpen={!!categoryToDelete}
        title="Delete Category"
        itemName={categoryToDelete?.name || ""}
        itemType="category"
        description="This category will be permanently removed from the system. (Categories that currently contain resources cannot be deleted)."
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setCategoryToDelete(null)}
      />
    </div>
  );
}
