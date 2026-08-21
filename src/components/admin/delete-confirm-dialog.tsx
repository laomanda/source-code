"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Trash2, X, AlertTriangle, Loader2 } from "lucide-react";

export interface DeleteConfirmDialogProps {
  isOpen: boolean;
  title: string;
  itemName?: string;
  itemType?: string;
  description?: string;
  isLoading?: boolean;
  isDeleting?: boolean;
  onConfirm: () => void | Promise<void>;
  onClose?: () => void;
  onCancel?: () => void;
}

export function DeleteConfirmDialog({
  isOpen,
  title,
  itemName = "",
  itemType = "item",
  description,
  isLoading = false,
  isDeleting = false,
  onConfirm,
  onClose,
  onCancel,
}: DeleteConfirmDialogProps) {
  const loading = isLoading || isDeleting;
  const handleClose = React.useCallback(() => {
    if (onCancel) onCancel();
    else if (onClose) onClose();
  }, [onCancel, onClose]);

  // Handle escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !loading) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, handleClose]);

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
                Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="p-1 rounded-md text-[#2D334A]/60 hover:text-[#272343] hover:bg-slate-100 transition-colors disabled:opacity-50"
            aria-label="Tutup"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="text-xs text-[#2D334A] leading-relaxed space-y-2">
          {description ? (
            <p id="delete-dialog-desc">{description}</p>
          ) : (
            <p id="delete-dialog-desc">
              Apakah Anda yakin ingin menghapus {itemType}{" "}
              <strong className="text-[#272343] font-semibold">{itemName}</strong>? Data
              yang dihapus akan hilang secara permanen dari basis data.
            </p>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#BAE8E8]/60">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClose}
            disabled={loading}
            className="border-[#BAE8E8] text-[#2D334A] hover:bg-[#E3F6F5]/50"
          >
            Batal
          </Button>

          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onConfirm}
            disabled={loading}
            className="bg-rose-600 hover:bg-rose-700 text-white font-semibold gap-1.5 shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Menghapus...</span>
              </>
            ) : (
              <>
                <Trash2 className="h-3.5 w-3.5" />
                <span>Hapus Sekarang</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
