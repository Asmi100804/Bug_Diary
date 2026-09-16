import { z } from "zod";

export const attemptSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Describe what you tried.")
    .max(2000, "Keep each attempt under 2000 characters."),
  worked: z.boolean().default(false),
});

export const bugFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title needs at least 3 characters.")
    .max(255, "Title is too long."),
  errorMessage: z
    .string()
    .trim()
    .min(1, "Paste the error or describe the symptoms.")
    .max(5000, "Keep the error/symptoms under 5000 characters."),
  rootCause: z.string().trim().max(3000).optional().or(z.literal("")),
  solution: z.string().trim().max(3000).optional().or(z.literal("")),
  difficulty: z
    .number()
    .int()
    .min(1, "Difficulty must be between 1 and 5.")
    .max(5, "Difficulty must be between 1 and 5."),
  tags: z
    .array(z.string().trim().min(1).max(64))
    .max(10, "Use up to 10 tags."),
  technologies: z
    .array(z.string().trim().min(1).max(64))
    .max(10, "Use up to 10 technologies."),
  attempts: z.array(attemptSchema).max(20, "That's a lot of attempts — trim it to 20."),
});

export type BugFormValues = z.infer<typeof bugFormSchema>;

export const bugFiltersSchema = z.object({
  query: z.string().trim().max(200).optional(),
  tag: z.string().trim().max(64).optional(),
  technology: z.string().trim().max(64).optional(),
  difficulty: z.coerce.number().int().min(1).max(5).optional(),
  sort: z
    .enum(["newest", "oldest", "difficulty-asc", "difficulty-desc"])
    .default("newest"),
});
