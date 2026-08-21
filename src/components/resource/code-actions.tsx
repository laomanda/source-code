"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Download } from "lucide-react";
import { toast } from "sonner";

export interface CodeActionsProps {
  sourceCode: string;
  technology: string;
  slug: string;
}

export function CodeActions({ sourceCode, technology, slug }: CodeActionsProps) {
  const [copied, setCopied] = React.useState(false);

  // Determine file extension
  const fileExtension = React.useMemo(() => {
    const tech = technology.toLowerCase();
    if (tech.includes("react") || tech.includes("next") || tech.includes("tsx")) return "tsx";
    if (tech.includes("typescript") || tech.includes("ts")) return "ts";
    if (tech.includes("html")) return "html";
    if (tech.includes("css")) return "css";
    if (tech.includes("javascript") || tech.includes("js")) return "js";
    return "txt";
  }, [technology]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sourceCode);
      setCopied(true);
      toast.success("Source code berhasil disalin ke clipboard!", {
        description: "Siap ditempelkan ke dalam proyek Anda.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin kode:", err);
      toast.error("Gagal menyalin kode ke clipboard.");
    }
  };

  const handleDownload = () => {
    try {
      const blob = new Blob([sourceCode], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${slug}.${fileExtension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success(`Berhasil mengunduh ${slug}.${fileExtension}`);
    } catch (err) {
      console.error("Gagal mengunduh file:", err);
      toast.error("Gagal mengunduh file source code.");
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Copy Code Button */}
      <Button
        type="button"
        onClick={handleCopy}
        variant="primary"
        size="sm"
        className="font-semibold shadow-soft-sm gap-1.5"
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-[#272343]" />
            <span>Tersalin!</span>
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5 text-[#272343]" />
            <span>Salin Kode</span>
          </>
        )}
      </Button>

      {/* Download Button */}
      <Button
        type="button"
        onClick={handleDownload}
        variant="outline"
        size="sm"
        className="gap-1.5 bg-white hover:bg-[#E3F6F5]/60"
        title={`Unduh ${slug}.${fileExtension}`}
      >
        <Download className="h-3.5 w-3.5 text-[#272343]" />
        <span className="hidden sm:inline">Unduh .{fileExtension}</span>
      </Button>
    </div>
  );
}
