"use server";

import { auth } from "@clerk/nextjs/server";
import { and, desc, eq, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import { bugs, bugsToTechnologies, technologies } from "@/db/schema";
import { flattenBug } from "@/lib/bug-utils";
import type { BugWithRelations } from "@/types/bug";

export interface DashboardStats {
  totalBugs: number;
  loggedThisWeek: number;
  avgDifficulty: number;
  solvedCount: number;
}

export interface TechnologyBreakdownRow {
  id: number;
  name: string;
  slug: string;
  bugCount: number;
}

export interface DashboardData {
  stats: DashboardStats;
  recentBugs: BugWithRelations[];
  toughestBugs: BugWithRelations[];
  technologyBreakdown: TechnologyBreakdownRow[];
}

export async function getDashboardData(): Promise<DashboardData> {
  const { userId } = await auth();
  if (!userId) {
    return {
      stats: { totalBugs: 0, loggedThisWeek: 0, avgDifficulty: 0, solvedCount: 0 },
      recentBugs: [],
      toughestBugs: [],
      technologyBreakdown: [],
    };
  }

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [statsRow] = await db
    .select({
      totalBugs: sql<number>`count(*)::int`,
      loggedThisWeek: sql<number>`count(*) filter (where ${bugs.createdAt} >= ${weekAgo})::int`,
      avgDifficulty: sql<number>`coalesce(avg(${bugs.difficulty}), 0)::float`,
      solvedCount: sql<number>`count(*) filter (where ${bugs.solution} is not null and ${bugs.solution} != '')::int`,
    })
    .from(bugs)
    .where(eq(bugs.userId, userId));

  const relationsConfig = {
    attempts: true,
    bugsToTags: { with: { tag: true } },
    bugsToTechnologies: { with: { technology: true } },
  } as const;

  const recentRows = await db.query.bugs.findMany({
    where: eq(bugs.userId, userId),
    orderBy: desc(bugs.createdAt),
    limit: 5,
    with: relationsConfig,
  });

  const toughestRows = await db.query.bugs.findMany({
    where: and(eq(bugs.userId, userId), gte(bugs.difficulty, 4)),
    orderBy: [desc(bugs.difficulty), desc(bugs.createdAt)],
    limit: 5,
    with: relationsConfig,
  });

  const technologyBreakdown = await db
    .select({
      id: technologies.id,
      name: technologies.name,
      slug: technologies.slug,
      bugCount: sql<number>`count(${bugsToTechnologies.bugId})::int`,
    })
    .from(technologies)
    .innerJoin(bugsToTechnologies, eq(bugsToTechnologies.technologyId, technologies.id))
    .where(eq(technologies.userId, userId))
    .groupBy(technologies.id)
    .orderBy(desc(sql`count(${bugsToTechnologies.bugId})`))
    .limit(6);

  return {
    stats: {
      totalBugs: statsRow?.totalBugs ?? 0,
      loggedThisWeek: statsRow?.loggedThisWeek ?? 0,
      avgDifficulty: statsRow?.avgDifficulty ?? 0,
      solvedCount: statsRow?.solvedCount ?? 0,
    },
    recentBugs: recentRows.map(flattenBug),
    toughestBugs: toughestRows.map(flattenBug),
    technologyBreakdown,
  };
}
