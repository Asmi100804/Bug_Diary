import type { bugs, attempts } from "@/db/schema";
import type { InferSelectModel } from "drizzle-orm";

export type Bug = InferSelectModel<typeof bugs>;
export type Attempt = InferSelectModel<typeof attempts>;

export type Difficulty = 1 | 2 | 3 | 4 | 5;

/** A bug plus its related attempts, tags, and technologies — the shape used everywhere in the UI. */
export interface BugWithRelations extends Bug {
  attempts: Attempt[];
  tags: { id: number; name: string; slug: string }[];
  technologies: { id: number; name: string; slug: string }[];
}

/** Lightweight shape used in lists/cards where full attempts aren't needed. */
export type BugSummary = Pick<
  BugWithRelations,
  | "id"
  | "bugNumber"
  | "title"
  | "errorMessage"
  | "difficulty"
  | "createdAt"
  | "updatedAt"
  | "tags"
  | "technologies"
>;

export interface BugFilters {
  query?: string;
  tag?: string;
  technology?: string;
  difficulty?: number;
  sort?: "newest" | "oldest" | "difficulty-asc" | "difficulty-desc";
}
