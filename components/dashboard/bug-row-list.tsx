import Link from "next/link";
import { DifficultyRating } from "@/components/bugs/difficulty-rating";
import { formatBugNumber, formatRelativeTime } from "@/lib/utils";
import type { BugWithRelations } from "@/types/bug";

export function BugRowList({
  bugs,
  emptyLabel,
}: {
  bugs: BugWithRelations[];
  emptyLabel: string;
}) {
  if (bugs.length === 0) {
    return <p className="font-mono text-sm text-ink-soft">{emptyLabel}</p>;
  }

  return (
    <ul className="divide-y divide-ink/10 border-t border-ink/10">
      {bugs.map((bug) => (
        <li key={bug.id}>
          <Link
            href={`/bugs/${bug.id}`}
            className="flex items-center justify-between gap-4 px-1 py-3 hover:bg-ink/5"
          >
            <span className="min-w-0">
              <span className="block truncate text-sm text-ink">{bug.title}</span>
              <span className="font-mono text-xs text-ink-soft">
                {formatBugNumber(bug.bugNumber)} · {formatRelativeTime(bug.createdAt)}
              </span>
            </span>
            <DifficultyRating value={bug.difficulty} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
