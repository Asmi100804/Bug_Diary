import Link from "next/link";
import { BugCard } from "@/components/bugs/bug-card";
import type { BugSummary } from "@/types/bug";

export function BugList({
  bugs,
  hasActiveFilters,
}: {
  bugs: BugSummary[];
  hasActiveFilters: boolean;
}) {
  if (bugs.length === 0) {
    return hasActiveFilters ? (
      <div className="border border-dashed border-ink/20 px-6 py-16 text-center">
        <p className="font-mono text-sm text-ink-soft">
          No bugs match those filters.
        </p>
      </div>
    ) : (
      <div className="rule-lines border border-dashed border-ink/20 px-6 py-16 text-center">
        <p className="font-display text-xl font-medium">
          No entries yet
        </p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">
          The next time something breaks and you figure out why, write it
          down here — that's the whole point of the diary.
        </p>
        <Link
          href="/bugs/new"
          className="mt-5 inline-block rounded-sm bg-ink px-4 py-2 font-mono text-sm text-paper hover:bg-ink/85"
        >
          Log your first bug
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {bugs.map((bug) => (
        <BugCard key={bug.id} bug={bug} />
      ))}
    </div>
  );
}
