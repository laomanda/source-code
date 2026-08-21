"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface TechnologyActionState {
  error?: string;
  success?: boolean;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createTechnologyAction(
  _prevState: TechnologyActionState | null,
  formData: FormData
): Promise<TechnologyActionState> {
  const name = (formData.get("name") as string)?.trim();
  let slug = (formData.get("slug") as string)?.trim();
  const icon = (formData.get("icon") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() || null;

  if (!name) {
    return { error: "Nama teknologi wajib diisi." };
  }

  if (!slug) {
    slug = slugify(name);
  } else {
    slug = slugify(slug);
  }

  try {
    const supabase = await createClient();

    // Verify authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: "Akses ditolak. Silakan login terlebih dahulu." };
    }

    const { error } = await supabase.from("technologies").insert({
      name,
      slug,
      icon,
      description,
    });

    if (error) {
      if (error.code === "23505") {
        return { error: `Teknologi dengan slug "${slug}" sudah ada.` };
      }
      return { error: error.message };
    }

    revalidatePath("/admin/technologies");
    revalidatePath("/admin/resources");
    revalidatePath("/admin");
    revalidatePath("/library");
    return { success: true };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Gagal menambahkan teknologi." };
  }
}

export async function updateTechnologyAction(
  id: string,
  _prevState: TechnologyActionState | null,
  formData: FormData
): Promise<TechnologyActionState> {
  const name = (formData.get("name") as string)?.trim();
  let slug = (formData.get("slug") as string)?.trim();
  const icon = (formData.get("icon") as string)?.trim() || null;
  const description = (formData.get("description") as string)?.trim() || null;

  if (!id) {
    return { error: "ID teknologi diperlukan." };
  }

  if (!name) {
    return { error: "Nama teknologi wajib diisi." };
  }

  if (!slug) {
    slug = slugify(name);
  } else {
    slug = slugify(slug);
  }

  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: "Akses ditolak. Silakan login terlebih dahulu." };
    }

    const { error } = await supabase
      .from("technologies")
      .update({
        name,
        slug,
        icon,
        description,
      })
      .eq("id", id);

    if (error) {
      if (error.code === "23505") {
        return { error: `Teknologi dengan slug "${slug}" sudah digunakan.` };
      }
      return { error: error.message };
    }

    revalidatePath("/admin/technologies");
    revalidatePath("/admin/resources");
    revalidatePath("/admin");
    revalidatePath("/library");
    return { success: true };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Gagal memperbarui teknologi." };
  }
}

export async function deleteTechnologyAction(id: string): Promise<TechnologyActionState> {
  if (!id) {
    return { error: "ID teknologi diperlukan." };
  }

  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: "Akses ditolak. Silakan login terlebih dahulu." };
    }

    const { error } = await supabase.from("technologies").delete().eq("id", id);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/admin/technologies");
    revalidatePath("/admin/resources");
    revalidatePath("/admin");
    revalidatePath("/library");
    return { success: true };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Gagal menghapus teknologi." };
  }
}
