"use client";

import * as React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";
import { EditorView } from "@codemirror/view";

export interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: "javascript" | "html" | "typescript" | "tsx" | "css";
  placeholder?: string;
  minHeight?: string;
  maxHeight?: string;
  readOnly?: boolean;
}

export function CodeEditor({
  value,
  onChange,
  language = "typescript",
  placeholder = "Tulis source code di sini...",
  minHeight = "320px",
  maxHeight = "460px",
  readOnly = false,
}: CodeEditorProps) {
  const extensions = React.useMemo(() => {
    const ext = [
      EditorView.lineWrapping,
      EditorView.theme({
        "&": {
          backgroundColor: "#1E1B2E",
          color: "#E2E8F0",
          fontSize: "13px",
          fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace",
        },
        ".cm-content": {
          caretColor: "#FFD803",
          fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace",
          padding: "12px 0",
        },
        ".cm-cursor, .cm-dropCursor": {
          borderLeftColor: "#FFD803",
          borderLeftWidth: "2px",
        },
        "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
          backgroundColor: "#3B3561 !important",
        },
        ".cm-gutters": {
          backgroundColor: "#171424",
          color: "#64748B",
          borderRight: "1px solid rgba(186, 232, 232, 0.15)",
          paddingRight: "8px",
        },
        ".cm-activeLine": {
          backgroundColor: "rgba(255, 216, 3, 0.05)",
        },
        ".cm-activeLineGutter": {
          backgroundColor: "rgba(255, 216, 3, 0.1)",
          color: "#FFD803",
          fontWeight: "600",
        },
        ".cm-scroller": {
          overflow: "auto",
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        },
      }),
    ];

    if (language === "html") {
      ext.push(html());
    } else {
      ext.push(javascript({ jsx: true, typescript: true }));
    }

    return ext;
  }, [language]);

  return (
    <div className="rounded-lg border border-[#BAE8E8]/70 bg-[#1E1B2E] overflow-hidden focus-within:ring-2 focus-within:ring-[#272343] shadow-soft-xs transition-all">
      <CodeMirror
        value={value}
        height="100%"
        minHeight={minHeight}
        maxHeight={maxHeight}
        theme="dark"
        extensions={extensions}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightSpecialChars: true,
          history: true,
          foldGutter: true,
          drawSelection: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          syntaxHighlighting: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          crosshairCursor: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
          closeBracketsKeymap: true,
          defaultKeymap: true,
          searchKeymap: true,
          historyKeymap: true,
          foldKeymap: true,
          completionKeymap: true,
          lintKeymap: true,
        }}
        className="font-mono text-xs sm:text-[13px] [&_.cm-editor]:font-mono [&_.cm-scroller]:font-mono"
      />
    </div>
  );
}
