"use server";

import { auth } from "@clerk/nextjs/server";
import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { tags, technologies, bugsToTags, bugsToTechnologies } from "@/db/schema";
import type { TagWithCount, TechnologyWithCount } from "@/types/tag";
import type { BugWithRelations } from "@/types/bug";
import { flattenBug } from "@/lib/bug-utils";

export async function getTagsWithCounts(): Promise<TagWithCount[]> {
  const { userId } = await auth();
  if (!userId) return [];

  return db
    .select({
      id: tags.id,
      userId: tags.userId,
      name: tags.name,
      slug: tags.slug,
      createdAt: tags.createdAt,
      bugCount: sql<number>`count(${bugsToTags.bugId})::int`,
    })
    .from(tags)
    .leftJoin(bugsToTags, eq(bugsToTags.tagId, tags.id))
    .where(eq(tags.userId, userId))
    .groupBy(tags.id)
    .orderBy(desc(sql`count(${bugsToTags.bugId})`));
}

export async function getTechnologiesWithCounts(): Promise<TechnologyWithCount[]> {
  const { userId } = await auth();
  if (!userId) return [];

  return db
    .select({
      id: technologies.id,
      userId: technologies.userId,
      name: technologies.name,
      slug: technologies.slug,
      createdAt: technologies.createdAt,
      bugCount: sql<number>`count(${bugsToTechnologies.bugId})::int`,
    })
    .from(technologies)
    .leftJoin(bugsToTechnologies, eq(bugsToTechnologies.technologyId, technologies.id))
    .where(eq(technologies.userId, userId))
    .groupBy(technologies.id)
    .orderBy(desc(sql`count(${bugsToTechnologies.bugId})`));
}

export interface TagPageResult {
  kind: "tag" | "technology" | null;
  name: string | null;
  bugs: BugWithRelations[];
}

/** A slug on /tags/[tag] may belong to either a tag or a technology — check both. */
export async function getBugsBySlug(slug: string): Promise<TagPageResult> {
  const { userId } = await auth();
  if (!userId) return { kind: null, name: null, bugs: [] };

  const tag = await db.query.tags.findFirst({
    where: and(eq(tags.userId, userId), eq(tags.slug, slug)),
  });

  if (tag) {
    const rows = await db.query.bugsToTags.findMany({
      where: eq(bugsToTags.tagId, tag.id),
      with: {
        bug: {
          with: {
            attempts: true,
            bugsToTags: { with: { tag: true } },
            bugsToTechnologies: { with: { technology: true } },
          },
        },
      },
    });
    return {
      kind: "tag",
      name: tag.name,
      bugs: rows.map((r) => flattenBug(r.bug)),
    };
  }

  const technology = await db.query.technologies.findFirst({
    where: and(eq(technologies.userId, userId), eq(technologies.slug, slug)),
  });

  if (technology) {
    const rows = await db.query.bugsToTechnologies.findMany({
      where: eq(bugsToTechnologies.technologyId, technology.id),
      with: {
        bug: {
          with: {
            attempts: true,
            bugsToTags: { with: { tag: true } },
            bugsToTechnologies: { with: { technology: true } },
          },
        },
      },
    });
    return {
      kind: "technology",
      name: technology.name,
      bugs: rows.map((r) => flattenBug(r.bug)),
    };
  }

  return { kind: null, name: null, bugs: [] };
}
