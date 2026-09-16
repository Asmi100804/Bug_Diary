"use client";

import Link from "next/link";
import { DifficultyRating } from "@/components/bugs/difficulty-rating";
import { TechnologyBadge } from "@/components/bugs/technology-badge";
import { formatBugNumber, formatRelativeTime } from "@/lib/utils";
import type { BugSummary } from "@/types/bug";

export function BugCard({ bug }: { bug: BugSummary }) {
  return (
    <article className="border border-ink/15 bg-amber-50 transition-colors hover:border-ink/35 hover:bg-paper">
      <Link
        href={`/bugs/${bug.id}`}
        className="block focus-visible:border-ink/35"
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-4 py-2 bg-paper-dim">
          <span className="font-mono text-xs text-ink-soft">
            {formatBugNumber(bug.bugNumber)} 
          </span>
          <DifficultyRating value={bug.difficulty} />
        </div>

        <div className="px-4 py-4">
          <h3 className="font-display text-lg font-medium leading-snug">
            {bug.title}
          </h3>

          <p className="mt-1.5 line-clamp-2 font-mono text-sm text-ink-soft">
            {bug.errorMessage}
          </p>

          <p className="mt-3 font-mono text-xs text-ink-soft">
            updated {formatRelativeTime(bug.updatedAt)}
          </p>
        </div>
      </Link>

      {(bug.tags.length > 0 || bug.technologies.length > 0) && (
        <div className="px-4 pb-4">
          <div className="flex flex-wrap gap-1.5">
            {bug.technologies.map((t) => (
              <TechnologyBadge
                key={`t-${t.id}`}
                name={t.name}
                slug={t.slug}
                kind="technology"
              />
            ))}

            {bug.tags.map((t) => (
              <TechnologyBadge
                key={`g-${t.id}`}
                name={t.name}
                slug={t.slug}
                kind="tag"
              />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}