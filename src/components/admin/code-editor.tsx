"use client";

import * as React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { html } from "@codemirror/lang-html";

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
  placeholder = "Enter source code here...",
  minHeight = "280px",
  maxHeight = "500px",
  readOnly = false,
}: CodeEditorProps) {
  const extensions = React.useMemo(() => {
    if (language === "html") {
      return [html()];
    }
    return [javascript({ jsx: true, typescript: true })];
  }, [language]);

  return (
    <div className="rounded-md border border-[#BAE8E8] bg-[#272343] overflow-hidden focus-within:ring-2 focus-within:ring-[#272343] transition-all">
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
        className="font-mono text-xs sm:text-sm [&_.cm-editor]:font-mono [&_.cm-scroller]:font-mono"
      />
    </div>
  );
}
