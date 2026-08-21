import * as React from "react";
import { Button } from "@/components/ui/button";
import { SearchX, RotateCcw } from "lucide-react";

export interface EmptyStateProps {
  searchQuery: string;
  onReset: () => void;
}

export function EmptyState({ searchQuery, onReset }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-[#BAE8E8] bg-white p-12 text-center shadow-soft max-w-lg mx-auto space-y-4 my-8">
      <div className="h-12 w-12 rounded-xl bg-[#E3F6F5] border border-[#BAE8E8] flex items-center justify-center text-[#272343] mx-auto shadow-soft-sm">
        <SearchX className="h-6 w-6 text-[#272343]" />
      </div>

      <div className="space-y-1.5">
        <h3 className="font-heading font-bold text-lg text-[#272343]">
          Tidak ada komponen yang cocok
        </h3>
        <p className="text-sm text-[#2D334A]/80 leading-relaxed">
          {searchQuery ? (
            <>
              Tidak ada hasil yang ditemukan untuk <span className="font-semibold text-[#272343]">&ldquo;{searchQuery}&rdquo;</span>.
            </>
          ) : (
            "Tidak ada komponen yang cocok dengan filter kategori dan teknologi yang dipilih."
          )}
        </p>
      </div>

      <div className="pt-2">
        <Button onClick={onReset} variant="outline" size="sm" className="gap-2 font-semibold">
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Filter</span>
        </Button>
      </div>
    </div>
  );
}
