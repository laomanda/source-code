import { createClient } from "@/lib/supabase/server";
import { Category } from "@/types";

interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("id, name, slug, description, created_at")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching categories from Supabase:", error.message);
      return [];
    }

    const rows = (data as unknown as CategoryRow[]) || [];
    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      description: row.description,
      createdAt: row.created_at,
    }));
  } catch (err) {
    console.error("Unexpected error in getCategories:", err);
    return [];
  }
}
