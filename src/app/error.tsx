"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("App Router caught unhandled error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center bg-white">
      <div className="max-w-md space-y-5">
        <div className="mx-auto h-12 w-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-soft-sm">
          <AlertCircle className="h-6 w-6" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs text-[#2D334A]/60 bg-[#E3F6F5] px-2.5 py-1 rounded border border-[#BAE8E8]">
            Application Error
          </span>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-[#272343]">
            Something went wrong
          </h1>
          <p className="text-xs text-[#2D334A]/80 leading-relaxed">
            An unexpected error occurred while loading this page. Please try refreshing or return to the library.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => reset()}
            className="gap-1.5 font-semibold shadow-soft-sm"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Try Again</span>
          </Button>

          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <Link href="/">
              <Home className="h-3.5 w-3.5" />
              <span>Back Home</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
