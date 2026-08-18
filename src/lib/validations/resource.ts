import { z } from "zod";

export const resourceFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters."),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters.")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens."),
  description: z.string().min(5, "Description must be at least 5 characters."),
  category_id: z.string().uuid("Please select a valid category."),
  technology: z.string().min(1, "Technology stack is required (e.g. React · Tailwind)."),
  tags: z.string().min(1, "At least one tag is required (comma-separated)."),
  source_code: z.string().min(5, "Source code cannot be empty."),
  preview_html: z.string().optional(),
  preview_image_url: z.string().optional(),
  responsive_desktop: z.boolean(),
  responsive_tablet: z.boolean(),
  responsive_mobile: z.boolean(),
  status: z.enum(["draft", "published"]),
});

export type ResourceFormValues = z.infer<typeof resourceFormSchema>;
