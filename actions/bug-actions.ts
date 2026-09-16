"use server";

import { auth } from "@clerk/nextjs/server";
import { and, desc, asc, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import {
  bugs,
  attempts,
  tags,
  technologies,
  bugsToTags,
  bugsToTechnologies,
} from "@/db/schema";
import { bugFormSchema, type BugFormValues } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import type { BugFilters, BugWithRelations } from "@/types/bug";
import { flattenBug } from "@/lib/bug-utils";

export interface ActionResult {
  success: boolean;
  error?: string;
  bugId?: number;
}

async function upsertTags(userId: string, names: string[]) {
  const clean = [...new Set(names.map((n) => n.trim()).filter(Boolean))];
  if (clean.length === 0) return [];
  const rows = clean.map((name) => ({ userId, name, slug: slugify(name) }));
  const inserted = await db
    .insert(tags)
    .values(rows)
    .onConflictDoUpdate({
      target: [tags.userId, tags.slug],
      set: { name: sql`excluded.name` },
    })
    .returning({ id: tags.id });
  return inserted.map((r) => r.id);
}

async function upsertTechnologies(userId: string, names: string[]) {
  const clean = [...new Set(names.map((n) => n.trim()).filter(Boolean))];
  if (clean.length === 0) return [];
  const rows = clean.map((name) => ({ userId, name, slug: slugify(name) }));
  const inserted = await db
    .insert(technologies)
    .values(rows)
    .onConflictDoUpdate({
      target: [technologies.userId, technologies.slug],
      set: { name: sql`excluded.name` },
    })
    .returning({ id: technologies.id });
  return inserted.map((r) => r.id);
}

export async function createBug(values: BugFormValues): Promise<ActionResult> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "You need to sign in first." };

  const parsed = bugFormSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Check the form for errors.",
    };
  }
  const data = parsed.data;

  try {
    const [{ max }] = await db
      .select({
        max: sql<number>`coalesce(max(${bugs.bugNumber}), 0)`,
      })
      .from(bugs)
      .where(eq(bugs.userId, userId));

    const nextNumber = Number(max) + 1;

    const [bug] = await db
      .insert(bugs)
      .values({
        userId,
        bugNumber: nextNumber,
        title: data.title,
        errorMessage: data.errorMessage,
        rootCause: data.rootCause || null,
        solution: data.solution || null,
        difficulty: data.difficulty,
      })
      .returning();

    if (data.attempts.length > 0) {
      await db.insert(attempts).values(
        data.attempts.map((a, i) => ({
          bugId: bug.id,
          description: a.description,
          worked: a.worked ? 1 : 0,
          position: i,
        })),
      );
    }

    const tagIds = await upsertTags(userId, data.tags);
    const techIds = await upsertTechnologies(userId, data.technologies);

    if (tagIds.length > 0) {
      await db
        .insert(bugsToTags)
        .values(tagIds.map((tagId) => ({ bugId: bug.id, tagId })));
    }
    if (techIds.length > 0) {
      await db
        .insert(bugsToTechnologies)
        .values(techIds.map((technologyId) => ({ bugId: bug.id, technologyId })));
    }

    revalidatePath("/bugs");
    revalidatePath("/dashboard");
    revalidatePath("/tags");

    return { success: true, bugId: bug.id };
  } catch (error) {
    console.error("Database error while creating bug:", error);
    return {
      success: false,
      error: "Database wake-up delay. Please click submit once again.",
    };
  }
}


export async function updateBug(
  bugId: number,
  values: BugFormValues,
): Promise<ActionResult> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "You need to sign in first." };

  const existing = await db.query.bugs.findFirst({
    where: and(eq(bugs.id, bugId), eq(bugs.userId, userId)),
  });
  if (!existing) return { success: false, error: "Bug not found." };

  const parsed = bugFormSchema.safeParse(values);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Check the form for errors.",
    };
  }
  const data = parsed.data;

  await db
    .update(bugs)
    .set({
      title: data.title,
      errorMessage: data.errorMessage,
      rootCause: data.rootCause || null,
      solution: data.solution || null,
      difficulty: data.difficulty,
      updatedAt: new Date(),
    })
    .where(eq(bugs.id, bugId));

  // Replace attempts and tag/technology relations wholesale — simpler and
  // safe at personal-diary scale than diffing individual rows.
  await db.delete(attempts).where(eq(attempts.bugId, bugId));
  if (data.attempts.length > 0) {
    await db.insert(attempts).values(
      data.attempts.map((a, i) => ({
        bugId,
        description: a.description,
        worked: a.worked ? 1 : 0,
        position: i,
      })),
    );
  }

  await db.delete(bugsToTags).where(eq(bugsToTags.bugId, bugId));
  await db
    .delete(bugsToTechnologies)
    .where(eq(bugsToTechnologies.bugId, bugId));

  const tagIds = await upsertTags(userId, data.tags);
  const techIds = await upsertTechnologies(userId, data.technologies);

  if (tagIds.length > 0) {
    await db
      .insert(bugsToTags)
      .values(tagIds.map((tagId) => ({ bugId, tagId })));
  }
  if (techIds.length > 0) {
    await db
      .insert(bugsToTechnologies)
      .values(techIds.map((technologyId) => ({ bugId, technologyId })));
  }

  revalidatePath("/bugs");
  revalidatePath(`/bugs/${bugId}`);
  revalidatePath("/dashboard");
  revalidatePath("/tags");
  return { success: true, bugId };
}

export async function deleteBug(bugId: number): Promise<ActionResult> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "You need to sign in first." };

  const existing = await db.query.bugs.findFirst({
    where: and(eq(bugs.id, bugId), eq(bugs.userId, userId)),
  });
  if (!existing) return { success: false, error: "Bug not found." };

  await db.delete(bugs).where(eq(bugs.id, bugId));

  revalidatePath("/bugs");
  revalidatePath("/dashboard");
  revalidatePath("/tags");
  return { success: true };
}

export async function getBugs(
  filters: BugFilters,
): Promise<BugWithRelations[]> {
  const { userId } = await auth();
  if (!userId) return [];

  const conditions = [eq(bugs.userId, userId)];

  if (filters.query) {
    conditions.push(
      or(
        ilike(bugs.title, `%${filters.query}%`),
        ilike(bugs.errorMessage, `%${filters.query}%`),
      )!,
    );
  }

  if (filters.difficulty) {
    conditions.push(eq(bugs.difficulty, filters.difficulty));
  }

  if (filters.tag) {
    const matches = await db
      .select({ bugId: bugsToTags.bugId })
      .from(bugsToTags)
      .innerJoin(tags, eq(tags.id, bugsToTags.tagId))
      .where(and(eq(tags.userId, userId), eq(tags.slug, filters.tag)));
    const ids = matches.map((m) => m.bugId);
    conditions.push(ids.length > 0 ? inArray(bugs.id, ids) : sql`false`);
  }

  if (filters.technology) {
    const matches = await db
      .select({ bugId: bugsToTechnologies.bugId })
      .from(bugsToTechnologies)
      .innerJoin(
        technologies,
        eq(technologies.id, bugsToTechnologies.technologyId),
      )
      .where(
        and(
          eq(technologies.userId, userId),
          eq(technologies.slug, filters.technology),
        ),
      );
    const ids = matches.map((m) => m.bugId);
    conditions.push(ids.length > 0 ? inArray(bugs.id, ids) : sql`false`);
  }

  const orderBy =
    filters.sort === "oldest"
      ? asc(bugs.createdAt)
      : filters.sort === "difficulty-asc"
        ? asc(bugs.difficulty)
        : filters.sort === "difficulty-desc"
          ? desc(bugs.difficulty)
          : desc(bugs.createdAt);

  const rows = await db.query.bugs.findMany({
    where: and(...conditions),
    orderBy,
    with: {
      attempts: true,
      bugsToTags: { with: { tag: true } },
      bugsToTechnologies: { with: { technology: true } },
    },
  });

  return rows.map(flattenBug);
}

export async function getBugById(
  bugId: number,
): Promise<BugWithRelations | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const row = await db.query.bugs.findFirst({
    where: and(eq(bugs.id, bugId), eq(bugs.userId, userId)),
    with: {
      attempts: true,
      bugsToTags: { with: { tag: true } },
      bugsToTechnologies: { with: { technology: true } },
    },
  });

  return row ? flattenBug(row) : null;
}
