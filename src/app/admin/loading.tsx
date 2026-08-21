export default function AdminLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#BAE8E8]/60 pb-4">
        <div className="space-y-2">
          <div className="h-8 w-64 bg-[#BAE8E8]/50 rounded-lg" />
          <div className="h-4 w-96 max-w-full bg-[#BAE8E8]/30 rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-32 bg-[#BAE8E8]/40 rounded-lg" />
          <div className="h-9 w-36 bg-[#BAE8E8]/60 rounded-lg" />
        </div>
      </div>

      {/* Top 4 KPI Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="p-5 rounded-xl border border-[#BAE8E8]/60 bg-white shadow-soft-xs space-y-3"
          >
            <div className="h-4 w-24 bg-[#BAE8E8]/40 rounded" />
            <div className="h-8 w-16 bg-[#BAE8E8]/60 rounded" />
            <div className="h-3 w-28 bg-[#BAE8E8]/30 rounded" />
          </div>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-72 rounded-xl border border-[#BAE8E8]/60 bg-white shadow-soft-xs" />
        <div className="h-72 rounded-xl border border-[#BAE8E8]/60 bg-white shadow-soft-xs" />
      </div>
    </div>
  );
}
