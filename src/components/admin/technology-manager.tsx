"use client";

import * as React from "react";
import { AdminTechnologyWithCount } from "@/lib/data/admin";
import {
  createTechnologyAction,
  updateTechnologyAction,
  deleteTechnologyAction,
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
  Cpu,
  Layers,
} from "lucide-react";
import { toast } from "sonner";

export interface TechnologyManagerProps {
  initialTechnologies: AdminTechnologyWithCount[];
}

export function TechnologyManager({ initialTechnologies }: TechnologyManagerProps) {
  const [technologies, setTechnologies] = React.useState(initialTechnologies);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingTech, setEditingTech] = React.useState<AdminTechnologyWithCount | null>(null);

  // Form State
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [icon, setIcon] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  // Delete Dialog State
  const [techToDelete, setTechToDelete] = React.useState<AdminTechnologyWithCount | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

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
        const res = await updateTechnologyAction(editingTech.id, null, formData);
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
        const res = await createTechnologyAction(null, formData);
        if (res.error) {
          setErrorMessage(res.error);
          toast.error(res.error);
          setIsLoading(false);
          return;
        }

        const newTech: AdminTechnologyWithCount = {
          id: Math.random().toString(),
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
      toast.success(`Teknologi "${techToDelete.name}" berhasil dihapus.`);
      setTechToDelete(null);
    } catch {
      toast.error("Gagal menghapus teknologi.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-bold text-[#272343]">
            Daftar Teknologi & Framework ({technologies.length})
          </h2>
          <p className="text-xs text-[#2D334A]/80">
            Kelola teknologi yang terhubung dengan komponen resource dan tampil di filter halaman library.
          </p>
        </div>
        <Button onClick={openCreateModal} variant="primary" size="sm" className="gap-2 font-semibold">
          <Plus className="h-4 w-4" />
          <span>Tambah Teknologi</span>
        </Button>
      </div>

      {/* Technologies Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {technologies.map((tech) => (
          <Card key={tech.id} className="border border-[#BAE8E8] shadow-soft-sm bg-white hover:border-[#8CD3D3] transition-all">
            <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-[#E3F6F5] border border-[#BAE8E8] flex items-center justify-center text-[#272343]">
                      <Cpu className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-base text-[#272343]">
                        {tech.name}
                      </h3>
                      <span className="font-mono text-[11px] text-[#2D334A]/60">
                        slug: {tech.slug}
                      </span>
                    </div>
                  </div>

                  <Badge variant="secondary" size="sm" className="gap-1 font-mono text-[11px]">
                    <Layers className="h-3 w-3" />
                    <span>{tech.resourceCount} resource</span>
                  </Badge>
                </div>

                {tech.description ? (
                  <p className="text-xs text-[#2D334A]/80 line-clamp-2 leading-relaxed">
                    {tech.description}
                  </p>
                ) : (
                  <p className="text-xs text-[#2D334A]/40 italic">
                    Belum ada deskripsi untuk teknologi ini.
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#BAE8E8]/50">
                <Button
                  onClick={() => openEditModal(tech)}
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2.5 text-xs text-[#2D334A] hover:text-[#272343] hover:bg-[#E3F6F5] gap-1"
                >
                  <Edit className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </Button>
                <Button
                  onClick={() => setTechToDelete(tech)}
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 gap-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Hapus</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {technologies.length === 0 && (
          <div className="col-span-full text-center py-12 rounded-xl border border-dashed border-[#BAE8E8] bg-[#FBFDFD] space-y-3">
            <Cpu className="h-8 w-8 text-[#2D334A]/40 mx-auto" />
            <p className="text-sm text-[#2D334A]/70">Belum ada teknologi yang ditambahkan.</p>
            <Button onClick={openCreateModal} variant="outline" size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              <span>Tambah Teknologi Pertama</span>
            </Button>
          </div>
        )}
      </div>

      {/* Modal Dialog: Add / Edit Technology */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="w-full max-w-md bg-white rounded-xl shadow-soft-2xl border border-[#BAE8E8] overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#BAE8E8] bg-[#FBFDFD]">
              <h3 className="font-heading font-bold text-base text-[#272343]">
                {editingTech ? `Edit Teknologi "${editingTech.name}"` : "Tambah Teknologi Baru"}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="p-1 rounded-md text-[#2D334A]/60 hover:text-[#272343] hover:bg-[#E3F6F5]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#272343]">
                  Nama Teknologi <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Contoh: React, Next.js, Tailwind CSS"
                  required
                  className="h-10 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#272343]">
                  Slug URL <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="contoh: react, nextjs, tailwind"
                  required
                  className="h-10 font-mono text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#272343]">
                  Icon / Logo (Opsional)
                </label>
                <Input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="Nama ikon atau URL logo"
                  className="h-10 text-xs font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#272343]">
                  Deskripsi Singkat (Opsional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Jelaskan ringkasan teknologi ini..."
                  rows={3}
                  className="w-full rounded-md border border-[#BAE8E8] bg-white px-3 py-2 text-xs text-[#272343] placeholder:text-[#2D334A]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#BAE8E8]/60">
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
                  <Check className="h-4 w-4" />
                  <span>{isLoading ? "Menyimpan..." : editingTech ? "Simpan Perubahan" : "Buat Teknologi"}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={!!techToDelete}
        title="Hapus Teknologi"
        itemName={techToDelete?.name || ""}
        itemType="teknologi"
        description={`Apakah Anda yakin ingin menghapus teknologi "${techToDelete?.name}"? Tindakan ini tidak akan menghapus resource yang terhubung, namun kolom relasi teknologinya akan dikosongkan.`}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onClose={() => setTechToDelete(null)}
      />
    </div>
  );
}
