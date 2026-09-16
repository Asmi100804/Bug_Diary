import { attempts } from "@/db/schema";
import type { BugWithRelations } from "@/types/bug";

/** Flattens the nested join-table shape from a relational query into BugWithRelations. */
export function flattenBug(row: {
  id: number;
  userId: string;
  bugNumber: number;
  title: string;
  errorMessage: string;
  rootCause: string | null;
  solution: string | null;
  difficulty: number;
  createdAt: Date;
  updatedAt: Date;
  attempts: (typeof attempts.$inferSelect)[];
  bugsToTags: { tag: { id: number; name: string; slug: string } }[];
  bugsToTechnologies: {
    technology: { id: number; name: string; slug: string };
  }[];
}): BugWithRelations {
  return {
    ...row,
    attempts: [...row.attempts].sort((a, b) => a.position - b.position),
    tags: row.bugsToTags.map((r) => r.tag),
    technologies: row.bugsToTechnologies.map((r) => r.technology),
  };
}