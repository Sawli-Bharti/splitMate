export function SkeletonCard() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
      <div className="mt-4 h-8 w-32 animate-pulse rounded bg-slate-200" />
      <div className="mt-2 h-4 w-20 animate-pulse rounded bg-slate-100" />
    </div>
  )
}

export function SkeletonTable() {
  return (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="h-4 flex-1 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
          <div className="h-4 w-20 animate-pulse rounded bg-slate-200" />
        </div>
      ))}
    </div>
  )
}
