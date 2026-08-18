import * as React from "react";
import { codeToHtml } from "shiki";
import { CodeActions } from "@/components/resource/code-actions";
import { Terminal } from "lucide-react";

export interface CodeViewerProps {
  sourceCode: string;
  technology: string;
  slug: string;
}

function resolveShikiLanguage(technology: string): string {
  const tech = technology.toLowerCase();
  if (tech.includes("tsx") || tech.includes("react") || tech.includes("next")) return "tsx";
  if (tech.includes("typescript") || tech.includes("ts")) return "typescript";
  if (tech.includes("html")) return "html";
  if (tech.includes("css")) return "css";
  if (tech.includes("javascript") || tech.includes("js")) return "javascript";
  return "text";
}

export async function CodeViewer({ sourceCode, technology, slug }: CodeViewerProps) {
  const lang = resolveShikiLanguage(technology);

  let highlightedHtml = "";
  try {
    highlightedHtml = await codeToHtml(sourceCode, {
      lang,
      theme: "github-dark-default",
    });
  } catch (err) {
    console.warn(`Shiki highlighting failed for ${lang}, falling back to plain text:`, err);
    try {
      highlightedHtml = await codeToHtml(sourceCode, {
        lang: "text",
        theme: "github-dark-default",
      });
    } catch {
      highlightedHtml = `<pre><code>${sourceCode}</code></pre>`;
    }
  }

  // Count lines for information
  const lineCount = sourceCode.split("\n").length;

  return (
    <div className="rounded-xl border border-[#BAE8E8] bg-[#272343] shadow-soft overflow-hidden text-left flex flex-col">
      {/* Code Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#1E1B35] border-b border-slate-700/80">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500/80" />
            <span className="h-3 w-3 rounded-full bg-amber-500/80" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="font-mono text-xs text-slate-300 ml-2 flex items-center gap-1.5 font-medium">
            <Terminal className="h-3.5 w-3.5 text-[#FFD803]" />
            <span>{slug}.{lang === "text" ? "txt" : lang}</span>
          </span>
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline-block">
            ({lineCount} lines)
          </span>
        </div>

        {/* Action Controls */}
        <CodeActions sourceCode={sourceCode} technology={technology} slug={slug} />
      </div>

      {/* Highlighted Code Container */}
      <div
        className="p-4 sm:p-6 overflow-x-auto font-mono text-xs sm:text-sm leading-relaxed text-slate-200 [&_pre]:!bg-transparent [&_code]:!bg-transparent"
        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      />

      {/* Code Viewer Footer */}
      <div className="px-4 py-2 bg-[#1E1B35]/80 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <span>Language: <strong className="text-[#FFD803] uppercase">{lang}</strong></span>
        <span>Ready to copy & build</span>
      </div>
    </div>
  );
}
