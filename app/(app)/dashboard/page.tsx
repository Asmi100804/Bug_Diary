import Link from "next/link";
import { getDashboardData } from "@/actions/dashboard-actions";
import { StatCard } from "@/components/dashboard/stat-card";
import { TechnologyStats } from "@/components/dashboard/technology-stats";
import { BugRowList } from "@/components/dashboard/bug-row-list";
import { DIFFICULTY_LABELS } from "@/lib/constants";

export default async function DashboardPage() {
  const { stats, recentBugs, toughestBugs, technologyBreakdown } =
    await getDashboardData();

  const avgLabel =
    DIFFICULTY_LABELS[Math.round(stats.avgDifficulty)] ?? "—";

  return (
    <div className="px-6 py-8 md:px-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-medium">Dashboard</h1>
        <Link
          href="/bugs/new"
          className="rounded-sm bg-ink px-4 py-2 font-mono text-sm text-paper hover:bg-ink/85"
        >
          + New bug
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Total entries" value={stats.totalBugs} />
        <StatCard label="Logged this week" value={stats.loggedThisWeek} />
        <StatCard
          label="Avg. difficulty"
          value={stats.avgDifficulty.toFixed(1)}
          suffix={`/5`}
        />
        <StatCard label="Solved" value={stats.solvedCount} />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
        <div className="space-y-10">
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-mono text-xs text-ink-soft font-semibold">Recent entries</h2>
              <Link href="/bugs" className="font-mono text-xs text-slate hover:underline font-semibold">
                view all
              </Link>
            </div>
            <BugRowList bugs={recentBugs} emptyLabel="Nothing logged yet." />
          </section>

          <section>
            <h2 className="mb-3 font-mono text-xs text-ink-soft font-semibold">
              Toughest bugs (4+)
            </h2>
            <BugRowList
              bugs={toughestBugs}
              emptyLabel="No hard-fought bugs yet — good sign, or you haven't logged one."
            />
          </section>
        </div>

        <section>
          <h2 className="mb-3 font-mono text-xs text-ink-soft font-semibold">
            By technology
          </h2>
          <TechnologyStats rows={technologyBreakdown} />
        </section>
      </div>
    </div>
  );
}
