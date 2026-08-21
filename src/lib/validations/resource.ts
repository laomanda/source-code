import { z } from "zod";

export const resourceFormSchema = z.object({
  title: z.string().min(2, "Judul komponen minimal 2 karakter."),
  slug: z
    .string()
    .min(2, "Slug URL minimal 2 karakter.")
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (-)."),
  description: z.string().min(5, "Deskripsi minimal 5 karakter."),
  category_id: z.string().uuid("Silakan pilih kategori yang valid."),
  tech_id: z.string().uuid().optional().nullable().or(z.literal("")),
  technology: z.string().min(1, "Nama teknologi wajib diisi (contoh: React · Tailwind)."),
  tags: z.string().min(1, "Minimal satu tag wajib diisi (pisahkan dengan koma)."),
  source_code: z.string().min(5, "Source code komponen tidak boleh kosong."),
  preview_html: z.string().optional(),
  preview_image_url: z.string().optional(),
  responsive_desktop: z.boolean(),
  responsive_tablet: z.boolean(),
  responsive_mobile: z.boolean(),
  status: z.enum(["draft", "published"]),
});

export type ResourceFormValues = z.infer<typeof resourceFormSchema>;
