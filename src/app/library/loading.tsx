import { Container } from "@/components/ui/container";

export default function LibraryLoading() {
  return (
    <div className="py-8 sm:py-12 space-y-8 animate-pulse">
      <Container>
        {/* Header Skeleton */}
        <div className="space-y-3 mb-8">
          <div className="h-8 w-48 bg-[#BAE8E8]/40 rounded-lg" />
          <div className="h-4 w-96 max-w-full bg-[#BAE8E8]/30 rounded" />
        </div>

        {/* Filter Bar Skeleton */}
        <div className="h-12 w-full bg-white border border-[#BAE8E8]/60 rounded-xl shadow-soft-xs mb-8" />

        {/* Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-[#BAE8E8]/60 bg-white overflow-hidden shadow-soft-xs flex flex-col"
            >
              <div className="aspect-[16/10] bg-[#E3F6F5]/40" />
              <div className="p-4 space-y-3">
                <div className="h-4 w-3/4 bg-[#BAE8E8]/40 rounded" />
                <div className="h-3 w-1/2 bg-[#BAE8E8]/30 rounded" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
