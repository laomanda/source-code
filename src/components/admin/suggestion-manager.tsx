"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { DeveloperSuggestion, SuggestionType } from "@/types";
import {
  deleteSuggestionAction,
  bulkDeleteSuggestionsAction,
  markSuggestionAsReadAction,
  markSuggestionAsUnreadAction,
  bulkMarkSuggestionsAsReadAction,
  markAllSuggestionsAsReadAction,
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
  CheckCheck,
  Mail,
  MailOpen,
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
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
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
  const [readStatusFilter, setReadStatusFilter] = React.useState<"all" | "unread" | "read">("all");

  // Pagination State
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const tableContainerRef = React.useRef<HTMLDivElement>(null);

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

  // Bulk Action Loading State
  const [isMarkingAllRead, setIsMarkingAllRead] = React.useState(false);

  // Client Mounted
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when detail modal is open
  React.useEffect(() => {
    if (selectedSuggestion) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedSuggestion]);

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

  // Filter suggestions by search, type, and read status
  const filteredSuggestions = React.useMemo(() => {
    return suggestions.filter((s) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase().trim());

      const matchesType = typeFilter === "all" || s.type === typeFilter;

      const matchesReadStatus =
        readStatusFilter === "all" ||
        (readStatusFilter === "unread" && !s.isRead) ||
        (readStatusFilter === "read" && !!s.isRead);

      return matchesSearch && matchesType && matchesReadStatus;
    });
  }, [suggestions, searchQuery, typeFilter, readStatusFilter]);

  // Reset to page 1 on filter or search change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, typeFilter, readStatusFilter, pageSize]);

  // Pagination Calculations
  const totalItems = filteredSuggestions.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedSuggestions = filteredSuggestions.slice(startIndex, endIndex);

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

  // Open detail and auto-mark as read
  const handleOpenDetail = (item: DeveloperSuggestion) => {
    setSelectedSuggestion(item);

    if (!item.isRead) {
      // Optimistic update
      setSuggestions((prev) =>
        prev.map((s) => (s.id === item.id ? { ...s, isRead: true } : s))
      );
      // Backend update
      markSuggestionAsReadAction(item.id).catch((err) => {
        console.error("Failed to mark as read:", err);
      });
    }
  };

  // Toggle single read / unread status
  const handleToggleReadStatus = async (item: DeveloperSuggestion, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const newStatus = !item.isRead;
    setSuggestions((prev) =>
      prev.map((s) => (s.id === item.id ? { ...s, isRead: newStatus } : s))
    );
    if (selectedSuggestion?.id === item.id) {
      setSelectedSuggestion({ ...selectedSuggestion, isRead: newStatus });
    }

    try {
      if (newStatus) {
        await markSuggestionAsReadAction(item.id);
        toast.success("Saran ditandai sudah dibaca.");
      } else {
        await markSuggestionAsUnreadAction(item.id);
        toast.success("Saran ditandai belum dibaca.");
      }
    } catch {
      toast.error("Gagal memperbarui status baca.");
    }
  };

  // Mark all suggestions as read
  const handleMarkAllRead = async () => {
    setIsMarkingAllRead(true);
    // Optimistic update
    setSuggestions((prev) => prev.map((s) => ({ ...s, isRead: true })));

    try {
      const res = await markAllSuggestionsAsReadAction();
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Semua saran berhasil ditandai sudah dibaca!");
      }
    } catch {
      toast.error("Gagal menandai semua saran.");
    } finally {
      setIsMarkingAllRead(false);
    }
  };

  // Bulk mark selected as read
  const handleBulkMarkRead = async () => {
    if (selectedIds.size === 0) return;
    const ids = Array.from(selectedIds);

    // Optimistic update
    setSuggestions((prev) =>
      prev.map((s) => (selectedIds.has(s.id) ? { ...s, isRead: true } : s))
    );

    try {
      const res = await bulkMarkSuggestionsAsReadAction(ids);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(`${ids.length} saran ditandai sudah dibaca.`);
        setSelectedIds(new Set());
      }
    } catch {
      toast.error("Gagal menandai saran terpilih.");
    }
  };

  // Selection handlers
  const handleToggleSelectAllPage = () => {
    const pageIds = paginatedSuggestions.map((s) => s.id);
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
    setSelectedIds(new Set(filteredSuggestions.map((s) => s.id)));
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

  // Copy details helper
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setHasCopied(true);
    toast.success("Teks saran berhasil disalin!");
    setTimeout(() => setHasCopied(false), 2000);
  };

  // Single Delete suggestion
  const handleConfirmDelete = async () => {
    if (!suggestionToDelete) return;

    setIsDeleting(true);
    try {
      await deleteSuggestionAction(suggestionToDelete.id);
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

  const isPageAllSelected =
    paginatedSuggestions.length > 0 &&
    paginatedSuggestions.every((s) => selectedIds.has(s.id));
  const isPagePartiallySelected =
    paginatedSuggestions.some((s) => selectedIds.has(s.id)) && !isPageAllSelected;

  const unreadCount = suggestions.filter((s) => !s.isRead).length;
  const readCount = suggestions.filter((s) => !!s.isRead).length;

  return (
    <div ref={tableContainerRef} className="space-y-6 scroll-mt-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-h2 text-[#272343]">Saran & Masukan Developer</h1>
        </div>

        {unreadCount > 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleMarkAllRead}
            disabled={isMarkingAllRead}
            className="gap-1.5 font-semibold text-xs border-[#BAE8E8] text-[#272343] hover:bg-[#E3F6F5] self-start sm:self-auto shadow-soft-xs"
          >
            <CheckCheck className="h-4 w-4 text-[#0D6E6E]" />
            <span>Tandai Semua Sudah Dibaca ({unreadCount})</span>
          </Button>
        )}
      </div>

      {/* Quick Stats Chips */}
      <div className="flex flex-wrap items-center gap-2 text-xs border-b border-[#BAE8E8]/60 pb-3">
        <span className="font-semibold text-[#272343] text-xs">Ringkasan:</span>
        <span className="px-2.5 py-0.5 rounded-full bg-[#E3F6F5] border border-[#BAE8E8] text-[#272343] font-mono text-[11px]">
          <strong>{suggestions.length}</strong> Total
        </span>
        <span className={`px-2.5 py-0.5 rounded-full border font-mono text-[11px] ${
          unreadCount > 0
            ? "bg-amber-50 border-amber-300 text-amber-900 font-bold animate-pulse"
            : "bg-slate-50 border-slate-200 text-slate-700"
        }`}>
          <strong>{unreadCount}</strong> Belum Dibaca
        </span>
        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-[11px]">
          <strong>{readCount}</strong> Sudah Dibaca
        </span>
        {filteredSuggestions.length !== suggestions.length && (
          <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 font-mono text-[11px]">
            Menampilkan <strong>{filteredSuggestions.length}</strong> hasil filter
          </span>
        )}
      </div>

      {/* Controls Bar: Search, Status Filter & Type Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#2D334A]/50" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari saran berdasarkan kata kunci..."
            className="pl-9 pr-8 h-9 bg-white border-[#BAE8E8] shadow-soft-xs text-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-[#2D334A]/60 hover:text-[#272343]"
              aria-label="Hapus pencarian"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Baca Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[#2D334A]/70 whitespace-nowrap">Status:</span>
            <select
              value={readStatusFilter}
              onChange={(e) => setReadStatusFilter(e.target.value as "all" | "unread" | "read")}
              className="h-9 rounded-md border border-[#BAE8E8] bg-white px-2.5 py-1 text-xs font-medium text-[#272343] shadow-soft-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343] cursor-pointer"
              aria-label="Filter status baca"
            >
              <option value="all">Semua ({suggestions.length})</option>
              <option value="unread">Belum Dibaca ({unreadCount})</option>
              <option value="read">Sudah Dibaca ({readCount})</option>
            </select>
          </div>

          {/* Type Filter Select */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[#2D334A]/70 whitespace-nowrap">Tipe:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as "all" | SuggestionType)}
              className="h-9 rounded-md border border-[#BAE8E8] bg-white px-2.5 py-1 text-xs font-medium text-[#272343] shadow-soft-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343] cursor-pointer"
              aria-label="Filter tipe saran"
            >
              <option value="all">Semua Tipe</option>
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
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedIds.size > 0 && (
        <div className="p-3 rounded-xl bg-[#272343] text-white shadow-soft-lg flex flex-wrap items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-2 text-xs">
            <span className="h-6 px-2.5 rounded bg-[#FFD803] text-[#272343] font-bold font-mono text-xs flex items-center justify-center shadow-xs">
              {selectedIds.size}
            </span>
            <span className="font-semibold">Saran terpilih</span>

            {selectedIds.size < filteredSuggestions.length && (
              <button
                type="button"
                onClick={handleSelectAllFiltered}
                className="ml-2 text-xs text-[#BAE8E8] hover:text-white underline underline-offset-2"
              >
                Pilih semua ({filteredSuggestions.length})
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleBulkMarkRead}
              className="h-8 text-xs bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white gap-1.5"
            >
              <CheckCheck className="h-3.5 w-3.5 text-[#FFD803]" />
              <span>Tandai Dibaca ({selectedIds.size})</span>
            </Button>
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
          {paginatedSuggestions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#E3F6F5]/50 border-b border-[#BAE8E8] text-[#2D334A] font-semibold">
                  <tr>
                    <th className="py-3.5 px-4 w-10 text-center">
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
                    <th className="py-3.5 px-4 w-[130px]">Status</th>
                    <th className="py-3.5 px-4 w-[150px]">Tipe</th>
                    <th className="py-3.5 px-4">Deskripsi Saran</th>
                    <th className="py-3.5 px-4 w-[160px]">Tanggal Masuk</th>
                    <th className="py-3.5 px-4 text-right w-[140px]">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#BAE8E8]/40 text-[#2D334A]">
                  {paginatedSuggestions.map((item) => {
                    const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.other;
                    const Icon = cfg.icon;
                    const isSelected = selectedIds.has(item.id);
                    const isUnread = !item.isRead;

                    return (
                      <tr
                        key={item.id}
                        onClick={() => handleOpenDetail(item)}
                        className={`hover:bg-[#F4F9F9] transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-[#E3F6F5]/40"
                            : isUnread
                            ? "bg-amber-50/40 font-medium"
                            : ""
                        }`}
                      >
                        <td
                          className="py-3.5 px-4 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
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

                        {/* Status Baca Badge */}
                        <td className="py-3.5 px-4">
                          {isUnread ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-soft-xs">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-600 animate-pulse" />
                              <span>Baru</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                              <Check className="h-3 w-3 text-slate-500" />
                              <span>Dibaca</span>
                            </span>
                          )}
                        </td>

                        {/* Tipe Badge */}
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

                        {/* Deskripsi */}
                        <td className="py-3.5 px-4 group">
                          <p className={`line-clamp-2 text-xs leading-relaxed ${
                            isUnread
                              ? "text-[#272343] font-semibold"
                              : "text-[#2D334A]/90 font-normal"
                          } group-hover:text-[#0D6E6E] transition-colors`}>
                            {item.description}
                          </p>
                        </td>

                        {/* Tanggal */}
                        <td className="py-3.5 px-4 whitespace-nowrap text-[#2D334A]/60 font-mono text-[11px]">
                          {formatDate(item.createdAt)}
                        </td>

                        {/* Aksi Buttons */}
                        <td
                          className="py-3.5 px-4 text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Toggle Read/Unread Quick Button */}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              onClick={(e) => handleToggleReadStatus(item, e)}
                              title={item.isRead ? "Tandai Belum Dibaca" : "Tandai Sudah Dibaca"}
                              className="h-7 w-7 text-[#2D334A] hover:bg-[#E3F6F5] hover:text-[#272343]"
                            >
                              {item.isRead ? (
                                <Mail className="h-3.5 w-3.5 text-[#2D334A]/70" />
                              ) : (
                                <MailOpen className="h-3.5 w-3.5 text-amber-600" />
                              )}
                            </Button>

                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenDetail(item)}
                              className="h-7 px-2 text-xs gap-1 border-[#BAE8E8] text-[#272343] hover:bg-[#E3F6F5]"
                              title="Lihat Detail Pesan"
                            >
                              <Eye className="h-3 w-3" />
                              <span className="hidden sm:inline">Detail</span>
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => setSuggestionToDelete(item)}
                              title="Hapus Saran"
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
            <div className="p-12 text-center text-xs text-[#2D334A]/60 space-y-2">
              <Lightbulb className="h-8 w-8 mx-auto text-[#BAE8E8]" />
              <p className="font-semibold text-sm text-[#272343]">Tidak ada saran ditemukan</p>
              <p className="text-[11px]">
                {searchQuery || typeFilter !== "all" || readStatusFilter !== "all"
                  ? "Tidak ada saran yang cocok dengan kriteria filter saat ini."
                  : "Belum ada masukan atau saran dari developer yang masuk."}
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
                <strong className="text-[#272343] font-semibold">{totalItems}</strong> saran
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

      {/* Detail Modal */}
      {mounted && selectedSuggestion && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150"
          onClick={() => setSelectedSuggestion(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-[#BAE8E8] bg-white p-6 shadow-soft-xl space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-[#BAE8E8]/60 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      (TYPE_CONFIG[selectedSuggestion.type] || TYPE_CONFIG.other)
                        .badgeVariant
                    }
                    size="sm"
                  >
                    {(TYPE_CONFIG[selectedSuggestion.type] || TYPE_CONFIG.other).label}
                  </Badge>
                  {selectedSuggestion.isRead ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      ✓ Sudah Dibaca
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-semibold">
                      ● Belum Dibaca
                    </span>
                  )}
                  <span className="text-xs text-[#2D334A]/60 flex items-center gap-1 ml-auto">
                    <Calendar className="h-3 w-3" />
                    {formatDate(selectedSuggestion.createdAt)}
                  </span>
                </div>
                <h2 className="text-base font-bold text-[#272343]">
                  Detail Masukan & Saran
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSuggestion(null)}
                className="text-[#2D334A]/60 hover:text-[#272343] p-1 rounded-md transition-colors hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-[#272343] flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-[#0D6E6E]" />
                  <span>Isi Masukan Developer:</span>
                </label>
                <div className="p-3.5 rounded-lg bg-[#F8FAFC] border border-[#BAE8E8]/60 text-[#272343] leading-relaxed text-xs max-h-[300px] overflow-y-auto whitespace-pre-wrap">
                  {selectedSuggestion.description}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#BAE8E8]/60">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(selectedSuggestion.description)}
                  className="gap-1.5 text-xs"
                >
                  {hasCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Salin Teks</span>
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleReadStatus(selectedSuggestion)}
                  className="text-xs text-[#2D334A] hover:bg-[#E3F6F5] gap-1"
                >
                  {selectedSuggestion.isRead ? (
                    <>
                      <Mail className="h-3.5 w-3.5" />
                      <span>Tandai Belum Dibaca</span>
                    </>
                  ) : (
                    <>
                      <CheckCheck className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Tandai Sudah Dibaca</span>
                    </>
                  )}
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setSuggestionToDelete(selectedSuggestion);
                  }}
                  className="gap-1.5 text-xs bg-rose-600 hover:bg-rose-700"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Hapus</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedSuggestion(null)}
                  className="text-xs"
                >
                  Tutup
                </Button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Single Delete Confirm Dialog */}
      <DeleteConfirmDialog
        isOpen={!!suggestionToDelete}
        title="Hapus Saran Developer"
        description="Apakah Anda yakin ingin menghapus saran ini? Tindakan ini tidak dapat dibatalkan."
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setSuggestionToDelete(null)}
      />

      {/* Bulk Delete Confirm Dialog */}
      <DeleteConfirmDialog
        isOpen={showBulkDeleteDialog}
        title="Hapus Saran Terpilih"
        description={`Apakah Anda yakin ingin menghapus ${selectedIds.size} saran yang dipilih? Tindakan ini tidak dapat dibatalkan.`}
        isDeleting={isBulkDeleting}
        onConfirm={handleConfirmBulkDelete}
        onCancel={() => setShowBulkDeleteDialog(false)}
      />
    </div>
  );
}
