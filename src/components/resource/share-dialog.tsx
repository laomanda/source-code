"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Share2,
  Copy,
  Check,
  X,
  FileCode2,
  ExternalLink,
  MessageCircle,
  Send,
} from "lucide-react";
import { toast } from "sonner";

export interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  slug: string;
  title: string;
  description?: string;
  category?: string;
  technology?: string;
}

export function ShareDialog({
  isOpen,
  onClose,
  slug,
  title,
  description = "",
  category = "Components",
  technology = "React · Tailwind",
}: ShareDialogProps) {
  const [copiedLink, setCopiedLink] = React.useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = React.useState(false);
  const [currentUrl, setCurrentUrl] = React.useState("");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const origin = window.location.origin;
      setCurrentUrl(`${origin}/resource/${slug}`);
    }
  }, [slug]);

  // Handle Escape Key to close
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shareText = `Lihat "${title}" di JakDev — Source code gratis developer (${technology})!`;
  const markdownSnippet = `[${title} — Source Code Gratis di JakDev](${currentUrl})`;

  const handleCopyLink = async () => {
    if (!currentUrl) return;
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopiedLink(true);
      toast.success("Tautan berhasil disalin ke clipboard!", {
        description: "Sekarang Anda dapat membagikannya ke mana saja.",
      });
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin tautan:", err);
      toast.error("Gagal menyalin tautan.");
    }
  };

  const handleCopyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(markdownSnippet);
      setCopiedMarkdown(true);
      toast.success("Format Markdown berhasil disalin!", {
        description: "Siap ditempelkan di issue GitHub atau file README.",
      });
      setTimeout(() => setCopiedMarkdown(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin format markdown:", err);
      toast.error("Gagal menyalin format markdown.");
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: `${title} — JakDev`,
          text: description || shareText,
          url: currentUrl,
        });
        toast.success("Berhasil dibagikan!");
        onClose();
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          console.error("Gagal membagikan:", err);
        }
      }
    }
  };

  const hasNativeShare = typeof navigator !== "undefined" && !!navigator.share;

  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedText = encodeURIComponent(shareText);

  const socialLinks = [
    {
      name: "X (Twitter)",
      url: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}&hashtags=JakDev,webdev,react,tailwindcss`,
      color: "hover:bg-black hover:text-white border-[#272343]/20",
      icon: (
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "WhatsApp",
      url: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
      color: "hover:bg-emerald-600 hover:text-white border-emerald-200 text-emerald-700",
      icon: <MessageCircle className="h-4 w-4" />,
    },
    {
      name: "Telegram",
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      color: "hover:bg-sky-500 hover:text-white border-sky-200 text-sky-600",
      icon: <Send className="h-4 w-4" />,
    },
    {
      name: "LinkedIn",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "hover:bg-blue-600 hover:text-white border-blue-200 text-blue-700",
      icon: (
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.46 1.46 0 1 0 0-2.92 1.46 1.46 0 0 0 0 2.92M7.86 18.5v-8.37H5.07v8.37h2.79z" />
        </svg>
      ),
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-dialog-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-[#BAE8E8] bg-white p-5 sm:p-6 shadow-soft-xl space-y-5 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[#BAE8E8]/60 pb-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#E3F6F5] border border-[#BAE8E8] flex items-center justify-center text-[#272343] shrink-0">
              <Share2 className="h-5 w-5" />
            </div>
            <div>
              <h3
                id="share-dialog-title"
                className="text-base font-heading font-bold text-[#272343]"
              >
                Bagikan Komponen
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-[#2D334A]/70 truncate max-w-[260px] sm:max-w-xs mt-0.5">
                <span className="font-semibold text-[#272343] truncate">{title}</span>
                {category && (
                  <span className="font-mono text-[10px] bg-[#E3F6F5] px-1.5 py-0.2 rounded border border-[#BAE8E8] text-[#272343] shrink-0">
                    {category}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-[#2D334A]/60 hover:text-[#272343] hover:bg-[#E3F6F5]/60 transition-colors"
            aria-label="Tutup dialog bagikan"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Direct Link Copy */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#272343]">
            Tautan Langsung
          </label>
          <div className="flex items-center gap-2">
            <Input
              readOnly
              value={currentUrl}
              onClick={(e) => (e.target as HTMLInputElement).select()}
              className="h-9 text-xs font-mono bg-[#FBFDFD] border-[#BAE8E8] text-[#272343]"
            />
            <Button
              type="button"
              variant={copiedLink ? "secondary" : "primary"}
              size="sm"
              onClick={handleCopyLink}
              className="h-9 px-3 text-xs gap-1.5 font-semibold shrink-0"
            >
              {copiedLink ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Salin</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Social Share Shortcuts */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[#272343]">
            Bagikan ke Media Sosial & Pesan
          </label>
          <div className="grid grid-cols-2 gap-2">
            {socialLinks.map((item) => (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg border bg-white text-xs font-medium transition-all shadow-soft-xs ${item.color}`}
              >
                {item.icon}
                <span>{item.name}</span>
                <ExternalLink className="h-2.5 w-2.5 opacity-50 ml-0.5" />
              </a>
            ))}
          </div>
        </div>

        {/* Markdown & Native Share Options */}
        <div className="pt-2 border-t border-[#BAE8E8]/60 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            {/* Copy Markdown snippet */}
            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="inline-flex items-center gap-1.5 text-xs text-[#2D334A] hover:text-[#272343] font-medium py-1 px-2 rounded-md hover:bg-[#E3F6F5]/50 transition-colors"
            >
              {copiedMarkdown ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <FileCode2 className="h-3.5 w-3.5 text-[#0D6E6E]" />
              )}
              <span>{copiedMarkdown ? "Markdown Tersalin!" : "Salin tautan Markdown"}</span>
            </button>

            {/* Native OS Share Sheet */}
            {hasNativeShare && (
              <button
                type="button"
                onClick={handleNativeShare}
                className="inline-flex items-center gap-1.5 text-xs text-[#0D6E6E] hover:underline font-semibold py-1 px-2"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Aplikasi lainnya...</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
