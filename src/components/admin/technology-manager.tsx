"use client";

import * as React from "react";
import { AdminTechnologyWithCount } from "@/lib/data/admin";
import {
  createTechnologyAction,
  updateTechnologyAction,
  deleteTechnologyAction,
  bulkDeleteTechnologiesAction,
} from "@/lib/actions/technologies";
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

export interface TechnologyManagerProps {
  initialTechnologies: AdminTechnologyWithCount[];
}

export function TechnologyManager({ initialTechnologies }: TechnologyManagerProps) {
  const [technologies, setTechnologies] = React.useState(initialTechnologies);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingTech, setEditingTech] = React.useState<AdminTechnologyWithCount | null>(null);

  // Form State
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [icon, setIcon] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Selection State
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  // Single Delete Dialog State
  const [techToDelete, setTechToDelete] = React.useState<AdminTechnologyWithCount | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Bulk Delete Dialog State
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = React.useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = React.useState(false);

  React.useEffect(() => {
    setTechnologies(initialTechnologies);
  }, [initialTechnologies]);

  // Handle escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isModalOpen) {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  const filteredTechnologies = React.useMemo(() => {
    if (!searchQuery.trim()) return technologies;
    const q = searchQuery.toLowerCase().trim();
    return technologies.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.slug.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q))
    );
  }, [technologies, searchQuery]);

  const handleToggleSelectAll = () => {
    if (selectedIds.size === filteredTechnologies.length && filteredTechnologies.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredTechnologies.map((t) => t.id)));
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
    setEditingTech(null);
    setName("");
    setSlug("");
    setIcon("");
    setDescription("");
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (tech: AdminTechnologyWithCount) => {
    setEditingTech(tech);
    setName(tech.name);
    setSlug(tech.slug);
    setIcon(tech.icon || "");
    setDescription(tech.description || "");
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTech(null);
    setErrorMessage(null);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingTech) {
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
    if (icon) formData.append("icon", icon);
    if (description) formData.append("description", description);

    try {
      if (editingTech) {
        const res = await updateTechnologyAction(editingTech.id, formData);
        if (res.error) {
          setErrorMessage(res.error);
          toast.error(res.error);
          setIsLoading(false);
          return;
        }

        setTechnologies((prev) =>
          prev.map((t) =>
            t.id === editingTech.id
              ? {
                  ...t,
                  name,
                  slug,
                  icon: icon || null,
                  description: description || null,
                }
              : t
          )
        );
        toast.success(`Teknologi "${name}" berhasil diperbarui!`);
      } else {
        const res = await createTechnologyAction(formData);
        if (res.error) {
          setErrorMessage(res.error);
          toast.error(res.error);
          setIsLoading(false);
          return;
        }

        const newTech: AdminTechnologyWithCount = {
          id: Date.now().toString(),
          name,
          slug,
          icon: icon || null,
          description: description || null,
          resourceCount: 0,
          createdAt: new Date().toISOString(),
        };
        setTechnologies((prev) => [...prev, newTech]);
        toast.success(`Teknologi "${name}" berhasil ditambahkan!`);
      }

      closeModal();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!techToDelete) return;
    setIsDeleting(true);

    try {
      const res = await deleteTechnologyAction(techToDelete.id);
      if (res.error) {
        toast.error(res.error);
        setIsDeleting(false);
        return;
      }

      setTechnologies((prev) => prev.filter((t) => t.id !== techToDelete.id));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(techToDelete.id);
        return next;
      });
      toast.success(`Teknologi "${techToDelete.name}" berhasil dihapus.`);
      setTechToDelete(null);
    } catch {
      toast.error("Gagal menghapus teknologi.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleConfirmBulkDelete = async () => {
    if (selectedIds.size === 0) return;

    const idsToDelete = Array.from(selectedIds);
    setIsBulkDeleting(true);

    try {
      const res = await bulkDeleteTechnologiesAction(idsToDelete);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(`Berhasil menghapus ${idsToDelete.length} teknologi.`);
        setTechnologies((prev) => prev.filter((t) => !selectedIds.has(t.id)));
        setSelectedIds(new Set());
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus teknologi terpilih.";
      toast.error(msg);
    } finally {
      setIsBulkDeleting(false);
      setShowBulkDeleteDialog(false);
    }
  };

  const isAllSelected =
    filteredTechnologies.length > 0 && selectedIds.size === filteredTechnologies.length;
  const isPartiallySelected =
    selectedIds.size > 0 && selectedIds.size < filteredTechnologies.length;

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-bold text-[#272343]">
            Daftar Teknologi & Framework ({technologies.length})
          </h2>
          <p className="text-xs text-[#2D334A]/80">
            Kelola teknologi yang terhubung dengan komponen dan tampil di filter halaman library.
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
          <span>Tambah Teknologi</span>
        </Button>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#2D334A]/50" />
        <Input
          placeholder="Cari teknologi..."
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
            <span className="font-medium">Teknologi dipilih</span>
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

      {/* Table Card */}
      <Card className="border-[#BAE8E8] bg-white shadow-soft overflow-hidden">
        <CardContent className="p-0">
          {filteredTechnologies.length > 0 ? (
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
                  {filteredTechnologies.map((item) => {
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
                          <Badge variant="navy" size="sm">
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
                              onClick={() => setTechToDelete(item)}
                              title="Hapus Teknologi"
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
              Tidak ada teknologi ditemukan.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-xl border border-[#BAE8E8] bg-white p-6 shadow-soft-lg space-y-4">
            <div className="flex items-center justify-between border-b border-[#BAE8E8]/60 pb-3">
              <h2 className="text-base font-bold text-[#272343]">
                {editingTech ? "Edit Teknologi" : "Tambah Teknologi Baru"}
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
                <label htmlFor="tech-name" className="font-semibold text-[#272343]">
                  Nama Teknologi <span className="text-rose-500">*</span>
                </label>
                <Input
                  id="tech-name"
                  required
                  placeholder="e.g. React, Next.js, Tailwind CSS"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  disabled={isLoading}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="tech-slug" className="font-semibold text-[#272343]">
                  Slug URL <span className="text-rose-500">*</span>
                </label>
                <Input
                  id="tech-slug"
                  required
                  placeholder="e.g. react, nextjs, tailwind"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  disabled={isLoading}
                  className="h-9 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="tech-icon" className="font-semibold text-[#272343]">
                  Nama Icon Lucide (Opsional)
                </label>
                <Input
                  id="tech-icon"
                  placeholder="e.g. Atom, Code2, Layers, Cpu"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  disabled={isLoading}
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="tech-desc" className="font-semibold text-[#272343]">
                  Deskripsi Singkat (Opsional)
                </label>
                <textarea
                  id="tech-desc"
                  rows={2}
                  placeholder="Deskripsi framework/teknologi ini..."
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
                      <span>{editingTech ? "Simpan Perubahan" : "Buat Teknologi"}</span>
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
        isOpen={!!techToDelete}
        title="Hapus Teknologi"
        description={`Apakah Anda yakin ingin menghapus teknologi "${techToDelete?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setTechToDelete(null)}
      />

      {/* Bulk Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={showBulkDeleteDialog}
        title={`Hapus ${selectedIds.size} Teknologi Terpilih`}
        description={`Apakah Anda yakin ingin menghapus ${selectedIds.size} teknologi yang dipilih sekaligus? Tindakan ini tidak dapat dibatalkan.`}
        isDeleting={isBulkDeleting}
        onConfirm={handleConfirmBulkDelete}
        onCancel={() => setShowBulkDeleteDialog(false)}
      />
    </div>
  );
}
