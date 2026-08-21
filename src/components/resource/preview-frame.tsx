"use client";

import * as React from "react";
import { Resource } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Monitor,
  Tablet,
  Smartphone,
  Maximize2,
  Minimize2,
  RefreshCw,
  Sparkles,
  AlertCircle,
} from "lucide-react";

export interface PreviewFrameProps {
  resource: Resource;
}

export type ViewportMode = "desktop" | "tablet" | "mobile";

export function PreviewFrame({ resource }: PreviewFrameProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [reloadKey, setReloadKey] = React.useState(0);

  // Initialize active viewport with the largest supported mode
  const [viewport, setViewport] = React.useState<ViewportMode>(() => {
    if (resource.responsive.desktop) return "desktop";
    if (resource.responsive.tablet) return "tablet";
    if (resource.responsive.mobile) return "mobile";
    return "desktop";
  });

  // Track fullscreen state change
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.warn("Layar penuh tidak tersedia:", err);
    }
  };

  // Construct isolated HTML document with sleek smooth custom scrollbar
  const previewDoc = React.useMemo(() => {
    const content = resource.previewHtml || "";
    return `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    window.onerror = function(msg, url, lineNo, columnNo, error) {
      console.warn("Pesan runtime pratinjau terisolasi:", msg);
      return true;
    };
  </script>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #ffffff;
      color: #2D334A;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: auto;
    }
    
    /* Smooth Modern Thin Scrollbar */
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background-color: rgba(39, 35, 67, 0.18);
      border-radius: 9999px;
      transition: background-color 0.2s ease;
    }
    ::-webkit-scrollbar-thumb:hover {
      background-color: rgba(39, 35, 67, 0.4);
    }
    * {
      scrollbar-width: thin;
      scrollbar-color: rgba(39, 35, 67, 0.18) transparent;
    }
  </style>
</head>
<body>
  ${content}
</body>
</html>`;
  }, [resource.previewHtml]);

  // Width classes based on viewport selection
  const viewportWidthStyle = {
    desktop: "w-full max-w-full",
    tablet: "w-full max-w-[768px]",
    mobile: "w-full max-w-[375px]",
  }[viewport];

  return (
    <div
      ref={containerRef}
      className={`rounded-2xl border border-[#BAE8E8]/90 bg-white shadow-soft-xs overflow-hidden flex flex-col ${
        isFullscreen ? "p-4 bg-[#E3F6F5]/40 h-screen" : ""
      }`}
    >
      {/* Preview Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 bg-[#F8FAFC] border-b border-[#BAE8E8]/70">
        {/* Left: Status Label */}
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-heading font-semibold text-xs text-[#272343] flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#272343]" />
            Pratinjau Langsung
          </span>
          <span className="text-[11px] font-mono text-[#2D334A]/60 hidden sm:inline-block">
            (Iframe Terisolasi)
          </span>
        </div>

        {/* Center/Right: Viewport Switcher & Actions */}
        <div className="flex items-center gap-2">
          {/* Viewport Toggles (Only show supported viewports) */}
          <div className="flex items-center p-0.5 rounded-lg bg-white border border-[#BAE8E8] shadow-xs">
            {resource.responsive.desktop && (
              <button
                type="button"
                onClick={() => setViewport("desktop")}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343] ${
                  viewport === "desktop"
                    ? "bg-[#272343] text-white font-semibold shadow-xs"
                    : "text-[#2D334A] hover:bg-[#E3F6F5]"
                }`}
                aria-label="Tampilan Desktop"
                aria-pressed={viewport === "desktop"}
              >
                <Monitor className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Desktop</span>
              </button>
            )}

            {resource.responsive.tablet && (
              <button
                type="button"
                onClick={() => setViewport("tablet")}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343] ${
                  viewport === "tablet"
                    ? "bg-[#272343] text-white font-semibold shadow-xs"
                    : "text-[#2D334A] hover:bg-[#E3F6F5]"
                }`}
                aria-label="Tampilan Tablet (768px)"
                aria-pressed={viewport === "tablet"}
              >
                <Tablet className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Tablet</span>
              </button>
            )}

            {resource.responsive.mobile && (
              <button
                type="button"
                onClick={() => setViewport("mobile")}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343] ${
                  viewport === "mobile"
                    ? "bg-[#272343] text-white font-semibold shadow-xs"
                    : "text-[#2D334A] hover:bg-[#E3F6F5]"
                }`}
                aria-label="Tampilan Ponsel (375px)"
                aria-pressed={viewport === "mobile"}
              >
                <Smartphone className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Ponsel</span>
              </button>
            )}
          </div>

          {/* Reload Iframe Button */}
          <Button
            type="button"
            onClick={() => setReloadKey((k) => k + 1)}
            variant="outline"
            size="icon-sm"
            aria-label="Muat ulang pratinjau"
            title="Muat ulang pratinjau"
            className="h-7 w-7 bg-white hover:bg-[#E3F6F5]"
          >
            <RefreshCw className="h-3.5 w-3.5 text-[#272343]" />
          </Button>

          {/* Fullscreen Button */}
          <Button
            type="button"
            onClick={toggleFullscreen}
            variant="outline"
            size="icon-sm"
            aria-label={isFullscreen ? "Keluar layar penuh" : "Buka layar penuh"}
            title={isFullscreen ? "Keluar layar penuh" : "Pratinjau Layar Penuh"}
            className="h-7 w-7 bg-white hover:bg-[#E3F6F5]"
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5 text-[#272343]" /> : <Maximize2 className="h-3.5 w-3.5 text-[#272343]" />}
          </Button>
        </div>
      </div>

      {/* Preview Stage Container */}
      <div className="p-4 sm:p-6 bg-[#F8FAFC] flex items-center justify-center min-h-[360px] overflow-x-auto flex-1">
        {resource.previewHtml ? (
          <div
            className={`transition-all duration-300 mx-auto rounded-xl border border-[#BAE8E8] bg-white shadow-soft-xs overflow-hidden ${viewportWidthStyle}`}
          >
            <iframe
              key={reloadKey}
              srcDoc={previewDoc}
              title={`Pratinjau langsung ${resource.title}`}
              sandbox="allow-scripts"
              className="w-full h-[360px] sm:h-[420px] border-0 bg-white"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="text-center p-8 rounded-xl border border-dashed border-[#BAE8E8] bg-white max-w-md space-y-2">
            <AlertCircle className="h-6 w-6 text-[#272343]/60 mx-auto" />
            <h4 className="font-heading font-semibold text-sm text-[#272343]">Pratinjau Tidak Tersedia</h4>
            <p className="text-xs text-[#2D334A]/70">
              Komponen ini tidak menyediakan pratinjau visual mandiri. Anda dapat melihat dan menyalin source code di bawah.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Viewport Indicator Footer */}
      <div className="px-4 py-2.5 bg-white border-t border-[#BAE8E8]/70 flex items-center justify-between text-[11px] font-mono text-[#2D334A]/70">
        <span>Viewport Aktif: <strong className="text-[#272343] uppercase">{viewport}</strong></span>
        <span>Eksekusi Terisolasi (Aman & Mandiri)</span>
      </div>
    </div>
  );
}
