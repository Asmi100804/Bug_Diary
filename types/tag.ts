import type { tags, technologies } from "@/db/schema";
import type { InferSelectModel } from "drizzle-orm";

export type Tag = InferSelectModel<typeof tags>;
export type Technology = InferSelectModel<typeof technologies>;

export interface TagWithCount extends Tag {
  bugCount: number;
}

export interface TechnologyWithCount extends Technology {
  bugCount: number;
}
