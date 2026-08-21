import { z } from "zod";

export const technologyFormSchema = z.object({
  name: z
    .string()
    .min(1, "Nama teknologi wajib diisi.")
    .max(50, "Nama teknologi maksimal 50 karakter."),
  slug: z
    .string()
    .min(1, "Slug wajib diisi.")
    .max(50, "Slug maksimal 50 karakter.")
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (-)."),
  icon: z.string().optional().nullable(),
  description: z
    .string()
    .max(200, "Deskripsi maksimal 200 karakter.")
    .optional()
    .nullable(),
});

export type TechnologyFormValues = z.infer<typeof technologyFormSchema>;
