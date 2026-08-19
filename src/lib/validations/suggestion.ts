import { z } from "zod";

export const suggestionTypeEnum = z.enum([
  "component",
  "block",
  "page",
  "template",
  "ui_design",
  "feature",
  "improvement",
  "other",
]);

export const suggestionSchema = z.object({
  type: suggestionTypeEnum,
  description: z
    .string()
    .trim()
    .min(5, "Description must be at least 5 characters.")
    .max(2000, "Description cannot exceed 2000 characters."),
});

export type SuggestionFormValues = z.infer<typeof suggestionSchema>;
