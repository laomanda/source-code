"use client";

import * as React from "react";
import { DeveloperSuggestion, SuggestionType } from "@/types";
import {
  deleteSuggestionAction,
  bulkDeleteSuggestionsAction,
} from "@/lib/actions/suggestions";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import { toast } from "sonner";
import {
  Lightbulb,
  Search,
  Trash2,
  Eye,
  X,
  Copy,
  Check,
  Puzzle,
  LayoutGrid,
  FileCode2,
  LayoutTemplate,
  Palette,
  Zap,
  TrendingUp,
  HelpCircle,
  Calendar,
  MessageSquare,
  CheckSquare,
  Square,
} from "lucide-react";

export interface SuggestionManagerProps {
  initialSuggestions: DeveloperSuggestion[];
}

const TYPE_CONFIG: Record<
  SuggestionType,
  { label: string; icon: React.ComponentType<{ className?: string }>; badgeVariant: "default" | "navy" | "outline" | "success" | "warning" | "secondary" }
> = {
  component: { label: "Komponen", icon: Puzzle, badgeVariant: "default" },
  block: { label: "Block", icon: LayoutGrid, badgeVariant: "navy" },
  page: { label: "Halaman", icon: FileCode2, badgeVariant: "outline" },
  template: { label: "Template", icon: LayoutTemplate, badgeVariant: "warning" },
  ui_design: { label: "UI / Desain", icon: Palette, badgeVariant: "default" },
  feature: { label: "Fitur Baru", icon: Zap, badgeVariant: "navy" },
  improvement: { label: "Peningkatan", icon: TrendingUp, badgeVariant: "success" },
  other: { label: "Lainnya", icon: HelpCircle, badgeVariant: "outline" },
};

export function SuggestionManager({ initialSuggestions }: SuggestionManagerProps) {
  const [suggestions, setSuggestions] = React.useState<DeveloperSuggestion[]>(initialSuggestions);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<"all" | SuggestionType>("all");

  // Selection State
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  // Detail Modal State
  const [selectedSuggestion, setSelectedSuggestion] = React.useState<DeveloperSuggestion | null>(null);
  const [hasCopied, setHasCopied] = React.useState(false);

  // Single Delete Dialog State
  const [suggestionToDelete, setSuggestionToDelete] = React.useState<DeveloperSuggestion | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Bulk Delete Dialog State
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = React.useState(false);
  const [isBulkDeleting, setIsBulkDeleting] = React.useState(false);

  React.useEffect(() => {
    setSuggestions(initialSuggestions);
  }, [initialSuggestions]);

  // Handle escape key to close detail modal
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedSuggestion) {
        setSelectedSuggestion(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedSuggestion]);

  // Filtered & Searched suggestions
  const filteredSuggestions = React.useMemo(() => {
    return suggestions.filter((s) => {
      const matchesType = typeFilter === "all" || s.type === typeFilter;
      const matchesSearch =
        searchQuery.trim() === "" ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.type.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [suggestions, typeFilter, searchQuery]);

  const handleToggleSelectAll = () => {
    if (selectedIds.size === filteredSuggestions.length && filteredSuggestions.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredSuggestions.map((s) => s.id)));
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

  // Copy description to clipboard
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setHasCopied(true);
    toast.success("Deskripsi saran berhasil disalin!");
    setTimeout(() => setHasCopied(false), 2000);
  };

  // Single Delete suggestion
  const handleDeleteConfirm = async () => {
    if (!suggestionToDelete) return;

    setIsDeleting(true);
    try {
      const result = await deleteSuggestionAction(suggestionToDelete.id);

      if (result.error) {
        toast.error(result.error);
        setIsDeleting(false);
        return;
      }

      toast.success("Saran berhasil dihapus.");
      setSuggestions((prev) => prev.filter((s) => s.id !== suggestionToDelete.id));
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(suggestionToDelete.id);
        return next;
      });
      if (selectedSuggestion?.id === suggestionToDelete.id) {
        setSelectedSuggestion(null);
      }
      setSuggestionToDelete(null);
    } catch {
      toast.error("Gagal menghapus saran.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Bulk Delete suggestions
  const handleConfirmBulkDelete = async () => {
    if (selectedIds.size === 0) return;

    const idsToDelete = Array.from(selectedIds);
    setIsBulkDeleting(true);

    try {
      const res = await bulkDeleteSuggestionsAction(idsToDelete);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(`Berhasil menghapus ${idsToDelete.length} saran.`);
        setSuggestions((prev) => prev.filter((s) => !selectedIds.has(s.id)));
        setSelectedIds(new Set());
        if (selectedSuggestion && selectedIds.has(selectedSuggestion.id)) {
          setSelectedSuggestion(null);
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus saran terpilih.";
      toast.error(msg);
    } finally {
      setIsBulkDeleting(false);
      setShowBulkDeleteDialog(false);
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch {
      return isoString;
    }
  };

  const isAllSelected =
    filteredSuggestions.length > 0 && selectedIds.size === filteredSuggestions.length;
  const isPartiallySelected =
    selectedIds.size > 0 && selectedIds.size < filteredSuggestions.length;

  return (
    <div className="space-y-6">
      {/* Controls Bar: Search & Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2D334A]/50" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari saran berdasarkan kata kunci..."
            className="pl-10 h-10 bg-white border-[#BAE8E8] shadow-soft-xs text-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#2D334A]/60 hover:text-[#272343]"
              aria-label="Hapus pencarian"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Type Filter Select */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#2D334A]/70 whitespace-nowrap">Filter Tipe:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as "all" | SuggestionType)}
            className="h-10 rounded-md border border-[#BAE8E8] bg-white px-3 py-1.5 text-xs font-medium text-[#272343] shadow-soft-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343]"
            aria-label="Filter saran berdasarkan tipe"
          >
            <option value="all">Semua Tipe ({suggestions.length})</option>
            <option value="component">Komponen</option>
            <option value="block">Block</option>
            <option value="page">Halaman</option>
            <option value="template">Template</option>
            <option value="ui_design">UI / Desain</option>
            <option value="feature">Fitur Baru</option>
            <option value="improvement">Peningkatan</option>
            <option value="other">Lainnya</option>
          </select>
        </div>
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="p-3 rounded-xl bg-[#272343] text-white shadow-soft-lg flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-2 text-xs">
            <span className="h-5 px-2 rounded bg-[#FFD803] text-[#272343] font-bold font-mono text-[11px] flex items-center justify-center">
              {selectedIds.size}
            </span>
            <span className="font-medium">Saran dipilih</span>
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

      {/* Suggestions Table / List Card */}
      <Card className="border-[#BAE8E8] bg-white shadow-soft overflow-hidden">
        <CardContent className="p-0">
          {filteredSuggestions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#E3F6F5]/50 border-b border-[#BAE8E8] text-[#2D334A] font-semibold">
                  <tr>
                    <th className="py-3.5 px-4 w-10 text-center">
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
                    <th className="py-3.5 px-4 w-[160px]">Tipe</th>
                    <th className="py-3.5 px-4">Deskripsi Saran</th>
                    <th className="py-3.5 px-4 w-[170px]">Tanggal Masuk</th>
                    <th className="py-3.5 px-4 text-right w-[110px]">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#BAE8E8]/40 text-[#2D334A]">
                  {filteredSuggestions.map((item) => {
                    const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.other;
                    const Icon = cfg.icon;
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

                        <td className="py-3.5 px-4">
                          <Badge
                            variant={cfg.badgeVariant}
                            size="sm"
                            className="gap-1.5 font-medium"
                          >
                            <Icon className="h-3 w-3" />
                            <span>{cfg.label}</span>
                          </Badge>
                        </td>

                        <td
                          className="py-3.5 px-4 cursor-pointer group"
                          onClick={() => setSelectedSuggestion(item)}
                        >
                          <p className="line-clamp-2 text-xs text-[#272343] group-hover:text-[#0D6E6E] transition-colors leading-relaxed font-normal">
                            {item.description}
                          </p>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap text-[#2D334A]/60 font-mono text-[11px]">
                          {formatDate(item.createdAt)}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => setSelectedSuggestion(item)}
                              className="h-7 w-7 text-[#272343] hover:bg-[#E3F6F5] hover:text-[#0D6E6E]"
                              title="Lihat detail saran"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => setSuggestionToDelete(item)}
                              className="h-7 w-7 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                              title="Hapus saran"
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
            <div className="flex flex-col items-center justify-center p-12 text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-[#E3F6F5] border border-[#BAE8E8] flex items-center justify-center text-[#272343]">
                <Lightbulb className="h-6 w-6 text-[#272343]" />
              </div>
              <p className="text-sm font-semibold text-[#272343]">Belum ada saran</p>
              <p className="text-xs text-[#2D334A]/70 max-w-sm">
                Saran dari developer dan pengguna akan ditampilkan di sini.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Suggestion Detail Modal */}
      {selectedSuggestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-xl border border-[#BAE8E8] bg-white p-6 shadow-soft-lg space-y-4">
            <div className="flex items-center justify-between border-b border-[#BAE8E8]/60 pb-3">
              <div className="flex items-center gap-2">
                <Badge
                  variant={TYPE_CONFIG[selectedSuggestion.type]?.badgeVariant || "default"}
                  size="sm"
                  className="gap-1.5"
                >
                  {TYPE_CONFIG[selectedSuggestion.type]?.label || selectedSuggestion.type}
                </Badge>
                <span className="text-[11px] font-mono text-[#2D334A]/60 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(selectedSuggestion.createdAt)}</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSuggestion(null)}
                className="p-1 text-[#2D334A]/60 hover:text-[#272343] rounded"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-[#272343]">
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-[#272343]" />
                  <span>Isi Saran Lengkap</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(selectedSuggestion.description)}
                  className="inline-flex items-center gap-1 text-[11px] text-[#0D6E6E] hover:underline font-normal"
                >
                  {hasCopied ? (
                    <>
                      <Check className="h-3 w-3" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Salin Teks</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#BAE8E8]/60 text-xs text-[#272343] leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto font-sans">
                {selectedSuggestion.description}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#BAE8E8]/60">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => {
                  setSuggestionToDelete(selectedSuggestion);
                  setSelectedSuggestion(null);
                }}
                className="gap-1.5 text-xs bg-rose-600 hover:bg-rose-700 text-white"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Hapus Saran</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedSuggestion(null)}
              >
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Single Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={!!suggestionToDelete}
        title="Hapus Saran Developer"
        description="Apakah Anda yakin ingin menghapus saran ini? Tindakan ini tidak dapat dibatalkan."
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setSuggestionToDelete(null)}
      />

      {/* Bulk Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={showBulkDeleteDialog}
        title={`Hapus ${selectedIds.size} Saran Terpilih`}
        description={`Apakah Anda yakin ingin menghapus ${selectedIds.size} saran yang dipilih sekaligus? Tindakan ini tidak dapat dibatalkan.`}
        isDeleting={isBulkDeleting}
        onConfirm={handleConfirmBulkDelete}
        onCancel={() => setShowBulkDeleteDialog(false)}
      />
    </div>
  );
}
