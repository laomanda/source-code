"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Trash2, X, AlertTriangle, Loader2 } from "lucide-react";

export interface DeleteConfirmDialogProps {
  isOpen: boolean;
  title: string;
  itemName: string;
  itemType?: string;
  description?: string;
  isLoading?: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}

export function DeleteConfirmDialog({
  isOpen,
  title,
  itemName,
  itemType = "item",
  description,
  isLoading = false,
  onConfirm,
  onClose,
}: DeleteConfirmDialogProps) {
  // Handle escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isLoading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-desc"
    >
      <div
        className="w-full max-w-md rounded-xl border border-rose-200 bg-white p-6 shadow-soft space-y-4 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3
                id="delete-dialog-title"
                className="text-base font-heading font-bold text-[#272343]"
              >
                {title}
              </h3>
              <p className="text-xs text-[#2D334A]/70 mt-0.5">
                This action is permanent and cannot be undone.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="p-1 rounded-md text-[#2D334A]/60 hover:text-[#272343] hover:bg-[#E3F6F5]/50 transition-colors disabled:opacity-50"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div id="delete-dialog-desc" className="space-y-2 text-xs text-[#2D334A]">
          <p>
            Are you sure you want to delete this {itemType}:
          </p>
          <div className="p-3 rounded-lg bg-[#F8FAFC] border border-[#BAE8E8]/60 font-medium text-[#272343] break-all">
            &ldquo;{itemName}&rdquo;
          </div>
          {description && (
            <p className="text-[11px] text-[#2D334A]/80 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#BAE8E8]/40">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-rose-600 text-white hover:bg-rose-700 font-semibold text-xs gap-1.5 shadow-soft-sm focus-visible:ring-rose-500"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Permanently</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
