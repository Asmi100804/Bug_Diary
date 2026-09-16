import Link from "next/link";
import type { TechnologyBreakdownRow } from "@/actions/dashboard-actions";

export function TechnologyStats({ rows }: { rows: TechnologyBreakdownRow[] }) {
  if (rows.length === 0) {
    return (
      <p className="font-mono text-sm text-ink-soft">
        No technologies logged yet.
      </p>
    );
  }

  const max = Math.max(...rows.map((r) => r.bugCount));

  return (
    <ul className="space-y-2.5">
      {rows.map((row) => (
        <li key={row.id}>
          <Link
            href={`/tags/${row.slug}`}
            className="group flex items-center gap-3 hover:opacity-80"
          >
            <span className="w-28 shrink-0 truncate font-mono text-sm text-slate">
              {row.name}
            </span>
            <span className="h-2 flex-1 bg-ink/8">
              <span
                className="block h-full bg-slate"
                style={{ width: `${(row.bugCount / max) * 100}%` }}
              />
            </span>
            <span className="w-6 shrink-0 text-right font-mono text-xs text-ink-soft">
              {row.bugCount}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
