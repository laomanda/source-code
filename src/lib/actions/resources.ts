"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { resourceFormSchema, ResourceFormValues } from "@/lib/validations/resource";

export interface ResourceActionState {
  error?: string;
  success?: boolean;
  resourceId?: string;
}

export async function createResourceAction(
  values: ResourceFormValues
): Promise<ResourceActionState> {
  const parseResult = resourceFormSchema.safeParse(values);
  if (!parseResult.success) {
    const errorMsg = parseResult.error.issues.map((e) => e.message).join(", ");
    return { error: errorMsg };
  }

  const data = parseResult.data;
  const tagsArray = data.tags
    .split(",")
    .map((t) => t.trim().toLowerCase().replace(/^#/, ""))
    .filter(Boolean);

  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: "Unauthorized. Please log in." };
    }

    const { data: inserted, error } = await supabase
      .from("resources")
      .insert({
        title: data.title.trim(),
        slug: data.slug.trim(),
        description: data.description.trim(),
        category_id: data.category_id,
        tech_id: data.tech_id || null,
        technology: data.technology.trim(),
        tags: tagsArray,
        source_code: data.source_code,
        preview_html: data.preview_html?.trim() || null,
        preview_image_url: data.preview_image_url?.trim() || null,
        responsive_desktop: data.responsive_desktop,
        responsive_tablet: data.responsive_tablet,
        responsive_mobile: data.responsive_mobile,
        status: data.status,
      })
      .select("id")
      .single();

    if (error) {
      if (error.code === "23505") {
        return { error: `Resource with slug "${data.slug}" already exists.` };
      }
      return { error: error.message };
    }

    revalidatePath("/admin/resources");
    revalidatePath("/admin/technologies");
    revalidatePath("/admin");
    revalidatePath("/library");
    revalidatePath(`/resource/${data.slug}`);
    return { success: true, resourceId: inserted?.id };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to create resource." };
  }
}

export async function updateResourceAction(
  id: string,
  values: ResourceFormValues
): Promise<ResourceActionState> {
  if (!id) {
    return { error: "Resource ID is required." };
  }

  const parseResult = resourceFormSchema.safeParse(values);
  if (!parseResult.success) {
    const errorMsg = parseResult.error.issues.map((e) => e.message).join(", ");
    return { error: errorMsg };
  }

  const data = parseResult.data;
  const tagsArray = data.tags
    .split(",")
    .map((t) => t.trim().toLowerCase().replace(/^#/, ""))
    .filter(Boolean);

  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: "Unauthorized. Please log in." };
    }

    const { error } = await supabase
      .from("resources")
      .update({
        title: data.title.trim(),
        slug: data.slug.trim(),
        description: data.description.trim(),
        category_id: data.category_id,
        tech_id: data.tech_id || null,
        technology: data.technology.trim(),
        tags: tagsArray,
        source_code: data.source_code,
        preview_html: data.preview_html?.trim() || null,
        preview_image_url: data.preview_image_url?.trim() || null,
        responsive_desktop: data.responsive_desktop,
        responsive_tablet: data.responsive_tablet,
        responsive_mobile: data.responsive_mobile,
        status: data.status,
      })
      .eq("id", id);

    if (error) {
      if (error.code === "23505") {
        return { error: `Resource with slug "${data.slug}" already exists.` };
      }
      return { error: error.message };
    }

    revalidatePath("/admin/resources");
    revalidatePath("/admin");
    revalidatePath("/library");
    revalidatePath(`/resource/${data.slug}`);
    return { success: true, resourceId: id };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to update resource." };
  }
}

export async function deleteResourceAction(id: string): Promise<ResourceActionState> {
  if (!id) {
    return { error: "Resource ID is required." };
  }

  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: "Unauthorized. Please log in." };
    }

    const { error } = await supabase.from("resources").delete().eq("id", id);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/admin/resources");
    revalidatePath("/admin");
    revalidatePath("/library");
    return { success: true };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to delete resource." };
  }
}

export async function bulkDeleteResourcesAction(ids: string[]): Promise<ResourceActionState> {
  if (!ids || ids.length === 0) {
    return { error: "Pilih setidaknya satu komponen untuk dihapus." };
  }

  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: "Tidak memiliki izin. Silakan masuk terlebih dahulu." };
    }

    const { error } = await supabase.from("resources").delete().in("id", ids);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/admin/resources");
    revalidatePath("/admin");
    revalidatePath("/library");
    return { success: true };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Gagal menghapus komponen yang dipilih." };
  }
}
