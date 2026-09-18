export function BugDetailSkeleton() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center justify-between">
        <div className="h-4 w-16 animate-pulse bg-ink/10" />
        <div className="h-4 w-24 animate-pulse bg-ink/10" />
      </div>

      <div className="mt-3 h-8 w-2/3 animate-pulse bg-ink/10" />
      <div className="mt-2 h-3 w-40 animate-pulse bg-ink/10" />

      <div className="mt-4 flex gap-1.5">
        <div className="h-5 w-16 animate-pulse bg-ink/10" />
        <div className="h-5 w-20 animate-pulse bg-ink/10" />
      </div>

      <div className="mt-8 space-y-8">
        <div>
          <div className="h-3 w-28 animate-pulse bg-ink/10" />
          <div className="mt-2 h-20 w-full animate-pulse bg-ink/10" />
        </div>
        <div>
          <div className="h-3 w-20 animate-pulse bg-ink/10" />
          <div className="mt-2 h-16 w-full animate-pulse bg-ink/10" />
        </div>
      </div>

      <div className="mt-10 flex items-center gap-3 border-t border-ink/10 pt-5">
        <div className="h-9 w-16 animate-pulse rounded-sm bg-ink/10" />
        <div className="h-9 w-16 animate-pulse rounded-sm bg-ink/10" />
      </div>
    </div>
  );
}