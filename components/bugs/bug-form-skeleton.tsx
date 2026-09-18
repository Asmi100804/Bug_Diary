export function BugFormSkeleton() {
  return (
    <div className="max-w-2xl space-y-6">
      {/* Title */}
      <div>
        <div className="h-3 w-10 animate-pulse bg-ink/10" />
        <div className="mt-1.5 h-9 w-full animate-pulse bg-ink/10" />
      </div>

      {/* Error / symptoms */}
      <div>
        <div className="h-3 w-28 animate-pulse bg-ink/10" />
        <div className="mt-1.5 h-24 w-full animate-pulse bg-ink/10" />
      </div>

      {/* Difficulty */}
      <div>
        <div className="h-3 w-16 animate-pulse bg-ink/10" />
        <div className="mt-1.5 flex items-center gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 w-8 animate-pulse rounded-sm bg-ink/10" />
          ))}
        </div>
      </div>

      {/* Technologies + Tags */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i}>
            <div className="h-3 w-20 animate-pulse bg-ink/10" />
            <div className="mt-1.5 h-9 w-full animate-pulse bg-ink/10" />
          </div>
        ))}
      </div>

      {/* What I tried */}
      <div>
        <div className="flex items-center justify-between">
          <div className="h-3 w-20 animate-pulse bg-ink/10" />
          <div className="h-3 w-16 animate-pulse bg-ink/10" />
        </div>
        <div className="mt-2 space-y-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-start gap-2">
              <div className="mt-1.5 h-4 w-4 shrink-0 animate-pulse rounded-sm bg-ink/10" />
              <div className="h-14 flex-1 animate-pulse bg-ink/10" />
              <div className="mt-1.5 h-4 w-4 shrink-0 animate-pulse bg-ink/10" />
            </div>
          ))}
        </div>
      </div>

      {/* Root cause */}
      <div>
        <div className="h-3 w-20 animate-pulse bg-ink/10" />
        <div className="mt-1.5 h-20 w-full animate-pulse bg-ink/10" />
      </div>

      {/* Solution */}
      <div>
        <div className="h-3 w-16 animate-pulse bg-ink/10" />
        <div className="mt-1.5 h-20 w-full animate-pulse bg-ink/10" />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <div className="h-9 w-28 animate-pulse rounded-sm bg-ink/10" />
        <div className="h-9 w-20 animate-pulse rounded-sm bg-ink/10" />
      </div>
    </div>
  );
}