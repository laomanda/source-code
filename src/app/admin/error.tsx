"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, LayoutDashboard } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Admin section caught error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-4 rounded-xl border border-rose-200 bg-white p-6 shadow-soft">
        <div className="mx-auto h-10 w-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
          <AlertCircle className="h-5 w-5" />
        </div>

        <div className="space-y-1">
          <h2 className="text-base font-heading font-bold text-[#272343]">
            Admin Operation Failed
          </h2>
          <p className="text-xs text-[#2D334A]/80 leading-relaxed">
            An error occurred while communicating with the database or rendering the admin interface.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => reset()}
            className="text-xs gap-1.5 font-semibold"
          >
            <RefreshCw className="h-3 w-3" />
            <span>Try Again</span>
          </Button>
          <Button asChild variant="outline" size="sm" className="text-xs gap-1.5">
            <Link href="/admin">
              <LayoutDashboard className="h-3 w-3" />
              <span>Dashboard</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
