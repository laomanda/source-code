import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center bg-background">
      <div className="max-w-md space-y-4">
        <span className="font-mono text-xs text-[#2D334A]/60 bg-[#E3F6F5] px-2.5 py-1 rounded border border-[#BAE8E8]">
          404 · Not Found
        </span>
        <h1 className="font-heading text-3xl font-bold tracking-tight text-[#272343]">
          Page Not Found
        </h1>
        <p className="text-sm text-[#2D334A]/80 leading-relaxed">
          The page or resource you are looking for does not exist or has been moved.
        </p>
        <div className="pt-2">
          <Button asChild variant="primary">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
