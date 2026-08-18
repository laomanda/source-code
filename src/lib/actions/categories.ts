"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface CategoryActionState {
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

export async function createCategoryAction(
  _prevState: CategoryActionState | null,
  formData: FormData
): Promise<CategoryActionState> {
  const name = (formData.get("name") as string)?.trim();
  let slug = (formData.get("slug") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;

  if (!name) {
    return { error: "Category name is required." };
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
      return { error: "Unauthorized. Please log in." };
    }

    const { error } = await supabase.from("categories").insert({
      name,
      slug,
      description,
    });

    if (error) {
      if (error.code === "23505") {
        return { error: `Category with slug "${slug}" already exists.` };
      }
      return { error: error.message };
    }

    revalidatePath("/admin/categories");
    revalidatePath("/admin");
    revalidatePath("/library");
    return { success: true };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to perform category operation." };
  }
}

export async function updateCategoryAction(
  id: string,
  _prevState: CategoryActionState | null,
  formData: FormData
): Promise<CategoryActionState> {
  const name = (formData.get("name") as string)?.trim();
  let slug = (formData.get("slug") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;

  if (!id) {
    return { error: "Category ID is required." };
  }

  if (!name) {
    return { error: "Category name is required." };
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
      return { error: "Unauthorized. Please log in." };
    }

    const { error } = await supabase
      .from("categories")
      .update({
        name,
        slug,
        description,
      })
      .eq("id", id);

    if (error) {
      if (error.code === "23505") {
        return { error: `Category with slug "${slug}" already exists.` };
      }
      return { error: error.message };
    }

    revalidatePath("/admin/categories");
    revalidatePath("/admin");
    revalidatePath("/library");
    return { success: true };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to update category." };
  }
}

export async function deleteCategoryAction(id: string): Promise<CategoryActionState> {
  if (!id) {
    return { error: "Category ID is required." };
  }

  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { error: "Unauthorized. Please log in." };
    }

    // Check if category has associated resources
    const { count, error: countError } = await supabase
      .from("resources")
      .select("*", { count: "exact", head: true })
      .eq("category_id", id);

    if (countError) {
      return { error: countError.message };
    }

    if (count && count > 0) {
      return {
        error: `Cannot delete category: it is currently referenced by ${count} resource(s). Reassign or delete those resources first.`,
      };
    }

    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/admin/categories");
    revalidatePath("/admin");
    revalidatePath("/library");
    return { success: true };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : "Failed to delete category." };
  }
}
