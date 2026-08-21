import { Container } from "@/components/ui/container";

export default function ResourceDetailLoading() {
  return (
    <div className="py-8 sm:py-12 space-y-8 animate-pulse">
      <Container>
        {/* Breadcrumb Skeleton */}
        <div className="h-4 w-40 bg-[#BAE8E8]/40 rounded mb-6" />

        {/* Header Hero Card Skeleton */}
        <div className="p-6 rounded-2xl border border-[#BAE8E8]/60 bg-white shadow-soft mb-8 space-y-4">
          <div className="flex gap-2">
            <div className="h-5 w-20 bg-[#BAE8E8]/50 rounded-full" />
            <div className="h-5 w-24 bg-[#BAE8E8]/40 rounded-full" />
          </div>
          <div className="h-8 w-1/2 bg-[#BAE8E8]/60 rounded-lg" />
          <div className="h-4 w-3/4 bg-[#BAE8E8]/30 rounded" />
        </div>

        {/* Preview Frame Skeleton */}
        <div className="rounded-2xl border border-[#BAE8E8]/60 bg-white shadow-soft overflow-hidden h-[480px] mb-8 flex items-center justify-center bg-[#E3F6F5]/20">
          <div className="h-8 w-8 rounded-full border-2 border-[#272343] border-t-transparent animate-spin" />
        </div>
      </Container>
    </div>
  );
}
