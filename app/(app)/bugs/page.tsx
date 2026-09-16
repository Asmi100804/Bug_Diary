import Link from "next/link";
import { Suspense } from "react";
import { getBugs } from "@/actions/bug-actions";
import { getTagsWithCounts, getTechnologiesWithCounts } from "@/actions/tag-actions";
import { BugFilters } from "@/components/bugs/bug-filters";
import { BugList } from "@/components/bugs/bug-list";
import { BugListSkeleton } from "@/components/bugs/bug-list-skeleton";
import { bugFiltersSchema } from "@/lib/validations";
import type { BugFilters as BugFiltersType } from "@/types/bug";

interface BugsPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function BugsPage({ searchParams }: BugsPageProps) {
  const sp = await searchParams;
  const filters = bugFiltersSchema.parse(sp);
  const tags = await getTagsWithCounts();
  const technologies = await getTechnologiesWithCounts();

  return (
    <div className="px-6 py-8 md:px-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-medium">Bugs</h1>
        <Link
          href="/bugs/new"
          className="rounded-sm bg-ink px-4 py-2 font-mono text-sm text-paper hover:bg-ink/85"
        >
          + New bug
        </Link>
      </div>

      <div className="mb-6">
        <BugFilters tags={tags} technologies={technologies} />
      </div>

      <Suspense key={JSON.stringify(filters)} fallback={<BugListSkeleton />}>
        <BugResults filters={filters} />
      </Suspense>
    </div>
  );
}

async function BugResults({ filters }: { filters: BugFiltersType }) {
  const bugs = await getBugs(filters);
  const hasActiveFilters = Boolean(
    filters.query || filters.tag || filters.technology || filters.difficulty
  );
  return <BugList bugs={bugs} hasActiveFilters={hasActiveFilters} />;
}
