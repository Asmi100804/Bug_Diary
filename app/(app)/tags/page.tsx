import Link from "next/link";
import {
  getTagsWithCounts,
  getTechnologiesWithCounts,
} from "@/actions/tag-actions";

export default async function TagsPage() {
  const [tags, technologies] = await Promise.all([
    getTagsWithCounts(),
    getTechnologiesWithCounts(),
  ]);

  return (
    <div className="px-6 py-8 md:px-10">
      <h1 className="mb-6 font-display text-2xl font-medium">Tags</h1>

      <section className="mb-10">
        <h2 className="mb-3 font-mono text-xs font-semibold text-ink-soft">
          Technologies
        </h2>

        {technologies.length === 0 ? (
          <p className="text-sm text-ink-soft">
            No technologies logged yet — add some the next time you write up a
            bug.
          </p>
        ) : (
          <ul className="space-y-2">
  {technologies.map((t) => (
    <li key={t.id}>
      <Link
        href={`/tags/${t.slug}`}
        className="group flex items-center justify-between overflow-hidden border border-ink/15 bg-amber-50 px-4 py-3.5 transition-colors duration-300 hover:border-ink/35 hover:bg-paper"
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-ink/10 bg-paper-dim font-mono text-xs text-slate transition-colors duration-300 group-hover:border-ink/20 group-hover:bg-ink/6">
            #
          </span>

          <span className="truncate font-mono text-sm font-medium text-slate transition-colors duration-300 ">
            {t.name}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full border border-ink/10 bg-paper-dim px-2.5 py-1 font-mono text-[11px] font-medium tabular-nums text-slate transition-colors duration-300 group-hover:border-ink/15 group-hover:bg-ink/6 ">
            {t.bugCount} {t.bugCount === 1 ? "bug" : "bugs"}
          </span>

          <span className="text-slate-400 transition-colors duration-300">
            →
          </span>
        </div>
      </Link>
    </li>
  ))}
</ul>

        )}
      </section>

      <section>
        <h2 className="mb-3 font-mono text-xs font-semibold text-ink-soft">
          Tags
        </h2>

        {tags.length === 0 ? (
          <p className="text-sm text-ink-soft">
            No tags logged yet — add some the next time you write up a bug.
          </p>
        ) : (
          <ul className="space-y-2">
  {tags.map((t) => (
    <li key={t.id}>
      <Link
        href={`/tags/${t.slug}`}
        className="group flex items-center justify-between overflow-hidden border border-ink/15 bg-amber-50 px-4 py-3.5 transition-colors duration-300 hover:border-ink/35 hover:bg-paper"
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-ink/10 bg-paper-dim font-mono text-xs text-lime-700 transition-colors duration-300 group-hover:border-ink/20 group-hover:bg-ink/6 ">
            #
          </span>

          <span className="truncate font-mono text-sm font-medium text-lime-700 transition-colors duration-300 ">
            {t.name}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full border border-ink/10 bg-paper-dim px-2.5 py-1 font-mono text-[11px] font-medium tabular-nums text-lime-700 transition-colors duration-300 group-hover:border-ink/15 group-hover:bg-ink/6 ">
            {t.bugCount} {t.bugCount === 1 ? "bug" : "bugs"}
          </span>

          <span className="text-slate-400 transition-colors duration-300">
            →
          </span>
        </div>
      </Link>
    </li>
  ))}
</ul>

        )}
      </section>
    </div>
  );
}