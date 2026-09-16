export function BugListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border border-ink/10 px-4 py-4">
          <div className="h-3 w-16 animate-pulse bg-ink/10" />
          <div className="mt-4 h-5 w-3/4 animate-pulse bg-ink/10" />
          <div className="mt-2 h-4 w-full animate-pulse bg-ink/10" />
          <div className="mt-1 h-4 w-2/3 animate-pulse bg-ink/10" />
          <div className="mt-4 flex gap-1.5">
            <div className="h-5 w-16 animate-pulse bg-ink/10" />
            <div className="h-5 w-14 animate-pulse bg-ink/10" />
          </div>
        </div>
      ))}
    </div>
  );
}
