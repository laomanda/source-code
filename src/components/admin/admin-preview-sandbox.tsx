"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Monitor,
  Tablet,
  Smartphone,
  RefreshCw,
  Maximize2,
  Minimize2,
  AlertCircle,
} from "lucide-react";

export interface AdminPreviewSandboxProps {
  html: string;
  title?: string;
  responsive?: {
    desktop: boolean;
    tablet: boolean;
    mobile: boolean;
  };
}

export type AdminViewportMode = "desktop" | "tablet" | "mobile";

export function AdminPreviewSandbox({
  html,
  title = "Component Preview",
}: AdminPreviewSandboxProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = React.useState<AdminViewportMode>("desktop");
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [reloadKey, setReloadKey] = React.useState(0);

  // Track fullscreen state
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

  const handleRefresh = () => {
    setReloadKey((prev) => prev + 1);
  };

  // Compile sandboxed srcDoc
  const previewDoc = React.useMemo(() => {
    if (!html || !html.trim()) {
      return null;
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: {
              navy: '#272343',
              paragraph: '#2D334A',
              yellow: '#FFD803',
              cyan: '#E3F6F5',
              lightcyan: '#BAE8E8',
            }
          },
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            heading: ['Plus Jakarta Sans', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
          }
        }
      }
    }
  </script>
  <style>
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      background-color: #ffffff;
      color: #272343;
      font-family: 'Inter', sans-serif;
      overflow-x: hidden;
    }
    #error-display {
      display: none;
      padding: 12px;
      margin: 12px;
      background-color: #fee2e2;
      color: #b91c1c;
      border: 1px solid #f87171;
      border-radius: 8px;
      font-size: 12px;
      font-family: monospace;
    }
  </style>
  <script>
    window.onerror = function(message, source, lineno, colno, error) {
      var errBox = document.getElementById('error-display');
      if (errBox) {
        errBox.style.display = 'block';
        errBox.innerText = 'Preview Script Error: ' + message;
      }
      return false;
    };
  </script>
</head>
<body class="bg-white antialiased flex flex-col justify-center min-h-screen">
  <div id="error-display"></div>
  <div class="w-full flex-1 flex flex-col justify-center">
    ${html}
  </div>
</body>
</html>`;
  }, [html]);

  return (
    <div
      ref={containerRef}
      className={`flex flex-col rounded-xl border border-[#BAE8E8] bg-white shadow-soft overflow-hidden transition-all duration-200 ${
        isFullscreen ? "p-4 bg-white" : ""
      }`}
    >
      {/* Sandbox Header Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#BAE8E8] bg-[#FBFDFD] px-4 py-2.5">
        {/* Left Indicator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Admin Live Sandbox</span>
          </div>
          <span className="text-xs font-semibold text-[#272343] hidden sm:inline truncate max-w-[200px]">
            {title}
          </span>
        </div>

        {/* Center: Viewport Switcher Buttons */}
        <div className="flex items-center gap-1 bg-[#E3F6F5]/60 p-1 rounded-lg border border-[#BAE8E8]/60">
          <button
            type="button"
            onClick={() => setViewport("desktop")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              viewport === "desktop"
                ? "bg-[#272343] text-white shadow-soft-sm font-semibold"
                : "text-[#2D334A]/80 hover:text-[#272343]"
            }`}
            title="Desktop 100% Fluid"
          >
            <Monitor className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Desktop</span>
          </button>

          <button
            type="button"
            onClick={() => setViewport("tablet")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              viewport === "tablet"
                ? "bg-[#272343] text-white shadow-soft-sm font-semibold"
                : "text-[#2D334A]/80 hover:text-[#272343]"
            }`}
            title="Tablet 768px"
          >
            <Tablet className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Tablet (768px)</span>
          </button>

          <button
            type="button"
            onClick={() => setViewport("mobile")}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              viewport === "mobile"
                ? "bg-[#272343] text-white shadow-soft-sm font-semibold"
                : "text-[#2D334A]/80 hover:text-[#272343]"
            }`}
            title="Mobile 375px"
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Mobile (375px)</span>
          </button>
        </div>

        {/* Right: Actions (Refresh & Fullscreen) */}
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handleRefresh}
            title="Reload Preview Frame"
            className="text-[#2D334A]/70 hover:text-[#272343] h-8 w-8"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Preview"}
            className="text-[#2D334A]/70 hover:text-[#272343] h-8 w-8"
          >
            {isFullscreen ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>

      {/* Frame Container Stage */}
      <div className="relative flex min-h-[380px] max-h-[600px] flex-1 items-center justify-center overflow-auto bg-[#F8FAFC] p-4">
        {previewDoc ? (
          <div
            className={`relative mx-auto rounded-lg border border-[#BAE8E8] bg-white shadow-soft transition-all duration-300 ${
              viewport === "desktop"
                ? "w-full h-[460px]"
                : viewport === "tablet"
                ? "w-[768px] h-[460px]"
                : "w-[375px] h-[520px]"
            }`}
          >
            <iframe
              key={`admin-preview-${reloadKey}-${viewport}`}
              srcDoc={previewDoc}
              title={`Admin preview of ${title}`}
              sandbox="allow-scripts"
              className="h-full w-full rounded-lg border-0 bg-white"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="text-center p-8 space-y-2 text-[#2D334A]/60">
            <AlertCircle className="h-8 w-8 mx-auto text-amber-500" />
            <p className="text-xs font-medium text-[#272343]">
              No Preview HTML Provided Yet
            </p>
            <p className="text-[11px] max-w-xs mx-auto">
              Write or paste HTML markup in the Preview HTML editor below to see real-time rendering.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
