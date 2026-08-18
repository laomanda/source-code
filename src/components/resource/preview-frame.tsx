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
      console.warn("Fullscreen toggle unavailable:", err);
    }
  };

  // Construct isolated HTML document for srcDoc
  const previewDoc = React.useMemo(() => {
    const content = resource.previewHtml || "";
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 1.5rem;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #ffffff;
      color: #2D334A;
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: 100vh;
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
      className={`rounded-xl border border-[#BAE8E8] bg-white shadow-soft overflow-hidden flex flex-col ${
        isFullscreen ? "p-4 bg-[#E3F6F5]/40 h-screen" : ""
      }`}
    >
      {/* Preview Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#E3F6F5]/60 border-b border-[#BAE8E8]">
        {/* Left: Status Label */}
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-heading font-semibold text-xs text-[#272343] flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-[#272343]" />
            Live Isolated Preview
          </span>
          <span className="text-[11px] font-mono text-[#2D334A]/60 hidden sm:inline-block">
            (Sandboxed Iframe)
          </span>
        </div>

        {/* Center/Right: Viewport Switcher & Actions */}
        <div className="flex items-center gap-2">
          {/* Viewport Toggles (Only show supported viewports) */}
          <div className="flex items-center p-0.5 rounded-lg bg-white border border-[#BAE8E8] shadow-soft-sm">
            {resource.responsive.desktop && (
              <button
                type="button"
                onClick={() => setViewport("desktop")}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343] ${
                  viewport === "desktop"
                    ? "bg-[#272343] text-white font-semibold shadow-soft-sm"
                    : "text-[#2D334A] hover:bg-[#E3F6F5]"
                }`}
                aria-label="Desktop viewport"
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
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343] ${
                  viewport === "tablet"
                    ? "bg-[#272343] text-white font-semibold shadow-soft-sm"
                    : "text-[#2D334A] hover:bg-[#E3F6F5]"
                }`}
                aria-label="Tablet viewport (768px)"
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
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343] ${
                  viewport === "mobile"
                    ? "bg-[#272343] text-white font-semibold shadow-soft-sm"
                    : "text-[#2D334A] hover:bg-[#E3F6F5]"
                }`}
                aria-label="Mobile viewport (375px)"
                aria-pressed={viewport === "mobile"}
              >
                <Smartphone className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Mobile</span>
              </button>
            )}
          </div>

          {/* Reload Iframe Button */}
          <Button
            type="button"
            onClick={() => setReloadKey((k) => k + 1)}
            variant="outline"
            size="icon-sm"
            aria-label="Reload preview"
            title="Reload preview"
            className="h-7 w-7"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>

          {/* Fullscreen Button */}
          <Button
            type="button"
            onClick={toggleFullscreen}
            variant="outline"
            size="icon-sm"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            title={isFullscreen ? "Exit fullscreen" : "Fullscreen Preview"}
            className="h-7 w-7"
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>

      {/* Preview Stage Container */}
      <div className="p-4 sm:p-8 bg-[#F4F9F9]/60 flex items-center justify-center min-h-[360px] overflow-x-auto flex-1">
        {resource.previewHtml ? (
          <div
            className={`transition-all duration-300 mx-auto rounded-lg border border-[#BAE8E8] bg-white shadow-soft overflow-hidden ${viewportWidthStyle}`}
          >
            <iframe
              key={reloadKey}
              srcDoc={previewDoc}
              title={`Live preview of ${resource.title}`}
              sandbox="allow-scripts"
              className="w-full h-[360px] sm:h-[420px] border-0 bg-white"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="text-center p-8 rounded-lg border border-dashed border-[#BAE8E8] bg-white max-w-md space-y-2">
            <AlertCircle className="h-6 w-6 text-[#272343]/60 mx-auto" />
            <h4 className="font-heading font-semibold text-sm text-[#272343]">Preview Unavailable</h4>
            <p className="text-xs text-[#2D334A]/70">
              This resource does not provide a standalone visual preview. You can inspect and copy the source code below.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Viewport Indicator Footer */}
      <div className="px-4 py-2 bg-white border-t border-[#BAE8E8]/70 flex items-center justify-between text-[11px] font-mono text-[#2D334A]/70">
        <span>Active Viewport: <strong className="text-[#272343] uppercase">{viewport}</strong></span>
        <span>Isolated Execution (No DOM Access)</span>
      </div>
    </div>
  );
}
