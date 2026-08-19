"use client";

import * as React from "react";
import { DeveloperSuggestion, SuggestionType } from "@/types";
import { deleteSuggestionAction } from "@/lib/actions/suggestions";
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
} from "lucide-react";

export interface SuggestionManagerProps {
  initialSuggestions: DeveloperSuggestion[];
}

const TYPE_CONFIG: Record<
  SuggestionType,
  { label: string; icon: React.ComponentType<{ className?: string }>; badgeVariant: "default" | "navy" | "outline" | "success" | "warning" | "secondary" }
> = {
  component: { label: "Component", icon: Puzzle, badgeVariant: "default" },
  block: { label: "Block", icon: LayoutGrid, badgeVariant: "navy" },
  page: { label: "Page", icon: FileCode2, badgeVariant: "outline" },
  template: { label: "Template", icon: LayoutTemplate, badgeVariant: "warning" },
  ui_design: { label: "UI / Design", icon: Palette, badgeVariant: "default" },
  feature: { label: "Feature", icon: Zap, badgeVariant: "navy" },
  improvement: { label: "Improvement", icon: TrendingUp, badgeVariant: "success" },
  other: { label: "Other", icon: HelpCircle, badgeVariant: "outline" },
};

export function SuggestionManager({ initialSuggestions }: SuggestionManagerProps) {
  const [suggestions, setSuggestions] = React.useState<DeveloperSuggestion[]>(initialSuggestions);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<"all" | SuggestionType>("all");

  // Detail Modal State
  const [selectedSuggestion, setSelectedSuggestion] = React.useState<DeveloperSuggestion | null>(null);
  const [hasCopied, setHasCopied] = React.useState(false);

  // Delete Dialog State
  const [suggestionToDelete, setSuggestionToDelete] = React.useState<DeveloperSuggestion | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

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

  // Copy description to clipboard
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setHasCopied(true);
    toast.success("Description copied to clipboard");
    setTimeout(() => setHasCopied(false), 2000);
  };

  // Delete suggestion
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

      toast.success("Suggestion deleted successfully.");
      setSuggestions((prev) => prev.filter((s) => s.id !== suggestionToDelete.id));
      if (selectedSuggestion?.id === suggestionToDelete.id) {
        setSelectedSuggestion(null);
      }
      setSuggestionToDelete(null);
    } catch {
      toast.error("Failed to delete suggestion.");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch {
      return isoString;
    }
  };

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
            placeholder="Search suggestions by keyword..."
            className="pl-10 h-10 bg-white border-[#BAE8E8] shadow-soft-xs text-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#2D334A]/60 hover:text-[#272343]"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Type Filter Select */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#2D334A]/70 whitespace-nowrap">Filter Type:</span>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as "all" | SuggestionType)}
            className="h-10 rounded-md border border-[#BAE8E8] bg-white px-3 py-1.5 text-xs font-medium text-[#272343] shadow-soft-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343]"
            aria-label="Filter suggestions by type"
          >
            <option value="all">All Types ({suggestions.length})</option>
            <option value="component">Components</option>
            <option value="block">Blocks</option>
            <option value="page">Pages</option>
            <option value="template">Templates</option>
            <option value="ui_design">UI / Design</option>
            <option value="feature">Features</option>
            <option value="improvement">Improvements</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Suggestions Table / List Card */}
      <Card className="border-[#BAE8E8] bg-white shadow-soft overflow-hidden">
        <CardContent className="p-0">
          {filteredSuggestions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#E3F6F5]/50 border-b border-[#BAE8E8] text-[#2D334A] font-semibold">
                  <tr>
                    <th className="py-3.5 px-4 w-[160px]">Type</th>
                    <th className="py-3.5 px-4">Description</th>
                    <th className="py-3.5 px-4 w-[170px]">Date Submitted</th>
                    <th className="py-3.5 px-4 text-right w-[110px]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#BAE8E8]/40 text-[#2D334A]">
                  {filteredSuggestions.map((item) => {
                    const typeInfo = TYPE_CONFIG[item.type] || {
                      label: item.type,
                      icon: Lightbulb,
                      badgeVariant: "outline" as const,
                    };
                    const Icon = typeInfo.icon;

                    return (
                      <tr key={item.id} className="hover:bg-[#F4F9F9] transition-colors">
                        {/* Type Badge */}
                        <td className="py-3.5 px-4 align-top">
                          <Badge
                            variant={typeInfo.badgeVariant}
                            size="sm"
                            className="inline-flex items-center gap-1.5 font-semibold"
                          >
                            <Icon className="h-3 w-3" />
                            <span>{typeInfo.label}</span>
                          </Badge>
                        </td>

                        {/* Description Preview */}
                        <td className="py-3.5 px-4 align-top">
                          <p
                            onClick={() => setSelectedSuggestion(item)}
                            className="text-xs text-[#272343] line-clamp-2 leading-relaxed cursor-pointer hover:text-[#0D6E6E] transition-colors"
                            title="Click to view full description"
                          >
                            {item.description}
                          </p>
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-4 align-top text-[11px] font-mono text-[#2D334A]/70 whitespace-nowrap">
                          {formatDate(item.createdAt)}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 align-top text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedSuggestion(item)}
                              className="h-7 w-7 p-0 text-[#2D334A] hover:bg-[#E3F6F5] hover:text-[#272343]"
                              title="View Details"
                              aria-label="View suggestion details"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>

                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setSuggestionToDelete(item)}
                              className="h-7 w-7 p-0 text-rose-500 hover:bg-rose-50 hover:text-rose-700"
                              title="Delete Suggestion"
                              aria-label="Delete suggestion"
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
            <div className="py-16 text-center space-y-3">
              <div className="mx-auto h-12 w-12 rounded-xl bg-[#E3F6F5] border border-[#BAE8E8] flex items-center justify-center text-[#272343]">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-[#272343]">No suggestions found</h3>
                <p className="text-xs text-[#2D334A]/70 max-w-sm mx-auto">
                  {searchQuery || typeFilter !== "all"
                    ? "Try adjusting your search query or filter."
                    : "No ideas submitted yet from developers."}
                </p>
              </div>
              {(searchQuery || typeFilter !== "all") && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setTypeFilter("all");
                  }}
                  className="text-xs mt-2 border-[#BAE8E8]"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Suggestion Detail Modal */}
      {selectedSuggestion && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-labelledby="suggestion-modal-title"
        >
          <div
            className="w-full max-w-lg rounded-xl border border-[#BAE8E8] bg-white p-6 shadow-soft space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-[#BAE8E8]/60 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={TYPE_CONFIG[selectedSuggestion.type]?.badgeVariant || "default"}
                    size="sm"
                    className="font-bold"
                  >
                    {TYPE_CONFIG[selectedSuggestion.type]?.label || selectedSuggestion.type}
                  </Badge>
                  <span className="text-[11px] font-mono text-[#2D334A]/60 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(selectedSuggestion.createdAt)}
                  </span>
                </div>
                <h3 id="suggestion-modal-title" className="text-base font-bold text-[#272343]">
                  Developer Idea Detail
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSuggestion(null)}
                className="p-1 rounded-md text-[#2D334A]/60 hover:text-[#272343] hover:bg-[#E3F6F5] transition-colors"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Description Body */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#2D334A]/80">Submitted Description:</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(selectedSuggestion.description)}
                  className="h-7 text-xs gap-1.5 text-[#2D334A] hover:bg-[#E3F6F5]"
                >
                  {hasCopied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  <span>{hasCopied ? "Copied" : "Copy Text"}</span>
                </Button>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#BAE8E8] text-xs text-[#272343] leading-relaxed whitespace-pre-wrap font-sans max-h-[300px] overflow-y-auto">
                {selectedSuggestion.description}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-[#BAE8E8]/60">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setSuggestionToDelete(selectedSuggestion);
                }}
                className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 gap-1.5"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
              </Button>

              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => setSelectedSuggestion(null)}
                className="text-xs font-semibold"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        isOpen={Boolean(suggestionToDelete)}
        title="Delete this suggestion?"
        itemName={suggestionToDelete ? `${TYPE_CONFIG[suggestionToDelete.type]?.label || suggestionToDelete.type}: ${suggestionToDelete.description.slice(0, 60)}...` : ""}
        itemType="developer suggestion"
        description="This action cannot be undone and will permanently remove this suggestion from the database."
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onClose={() => setSuggestionToDelete(null)}
      />
    </div>
  );
}
