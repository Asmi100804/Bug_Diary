import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  timestamp,
  primaryKey,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * Bugs — the core entity. One row per debugging story.
 * `bugNumber` is a per-user sequential display id (BUG-001, BUG-002…),
 * kept separate from the internal `id` so numbering stays stable and
 * user-facing even if rows are deleted.
 */
export const bugs = pgTable(
  "bugs",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 191 }).notNull(),
    bugNumber: integer("bug_number").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    errorMessage: text("error_message").notNull(),
    rootCause: text("root_cause"),
    solution: text("solution"),
    difficulty: integer("difficulty").notNull().default(1), // 1-5
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    userIdx: index("bugs_user_id_idx").on(table.userId),
    userBugNumberUnique: uniqueIndex("bugs_user_bug_number_unique").on(
      table.userId,
      table.bugNumber
    ),
    createdAtIdx: index("bugs_created_at_idx").on(table.createdAt),
  })
);

/**
 * Debugging attempts — the "what I tried" log for a bug. Ordered list,
 * one row per attempt, so the debugging story reads chronologically.
 */
export const attempts = pgTable(
  "attempts",
  {
    id: serial("id").primaryKey(),
    bugId: integer("bug_id")
      .notNull()
      .references(() => bugs.id, { onDelete: "cascade" }),
    description: text("description").notNull(),
    worked: integer("worked").notNull().default(0), // 0 = no, 1 = yes — kept as int for simple filtering
    position: integer("position").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    bugIdx: index("attempts_bug_id_idx").on(table.bugId),
  })
);

/** Tags — free-form labels (e.g. "race-condition", "off-by-one"). */
export const tags = pgTable(
  "tags",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 191 }).notNull(),
    name: varchar("name", { length: 64 }).notNull(),
    slug: varchar("slug", { length: 64 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    userSlugUnique: uniqueIndex("tags_user_slug_unique").on(
      table.userId,
      table.slug
    ),
  })
);

/** Technologies — the stack involved (e.g. "Next.js", "Postgres"). */
export const technologies = pgTable(
  "technologies",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 191 }).notNull(),
    name: varchar("name", { length: 64 }).notNull(),
    slug: varchar("slug", { length: 64 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    userSlugUnique: uniqueIndex("technologies_user_slug_unique").on(
      table.userId,
      table.slug
    ),
  })
);

/** Bug <-> Tag join table. */
export const bugsToTags = pgTable(
  "bugs_to_tags",
  {
    bugId: integer("bug_id")
      .notNull()
      .references(() => bugs.id, { onDelete: "cascade" }),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.bugId, table.tagId] }),
  })
);

/** Bug <-> Technology join table. */
export const bugsToTechnologies = pgTable(
  "bugs_to_technologies",
  {
    bugId: integer("bug_id")
      .notNull()
      .references(() => bugs.id, { onDelete: "cascade" }),
    technologyId: integer("technology_id")
      .notNull()
      .references(() => technologies.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.bugId, table.technologyId] }),
  })
);

// ---------- Relations ----------

export const bugsRelations = relations(bugs, ({ many }) => ({
  attempts: many(attempts),
  bugsToTags: many(bugsToTags),
  bugsToTechnologies: many(bugsToTechnologies),
}));

export const attemptsRelations = relations(attempts, ({ one }) => ({
  bug: one(bugs, { fields: [attempts.bugId], references: [bugs.id] }),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  bugsToTags: many(bugsToTags),
}));

export const technologiesRelations = relations(technologies, ({ many }) => ({
  bugsToTechnologies: many(bugsToTechnologies),
}));

export const bugsToTagsRelations = relations(bugsToTags, ({ one }) => ({
  bug: one(bugs, { fields: [bugsToTags.bugId], references: [bugs.id] }),
  tag: one(tags, { fields: [bugsToTags.tagId], references: [tags.id] }),
}));

export const bugsToTechnologiesRelations = relations(
  bugsToTechnologies,
  ({ one }) => ({
    bug: one(bugs, {
      fields: [bugsToTechnologies.bugId],
      references: [bugs.id],
    }),
    technology: one(technologies, {
      fields: [bugsToTechnologies.technologyId],
      references: [technologies.id],
    }),
  })
);
