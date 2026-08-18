import { createClient } from "@/lib/supabase/server";
import { Resource, CategoryType, Category } from "@/types";

export interface AdminStats {
  publishedCount: number;
  draftCount: number;
  categoryCount: number;
  totalCount: number;
}

export interface AdminCategoryWithCount extends Category {
  resourceCount: number;
}

interface AdminResourceRow {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category_id: string | null;
  technology: string;
  tags: string[];
  source_code: string;
  preview_html: string | null;
  preview_image_url: string | null;
  responsive_desktop: boolean;
  responsive_tablet: boolean;
  responsive_mobile: boolean;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
  categories: {
    name: string;
  } | null;
}

export async function getAdminStats(): Promise<AdminStats> {
  try {
    const supabase = await createClient();

    const [publishedRes, draftRes, categoriesRes] = await Promise.all([
      supabase.from("resources").select("*", { count: "exact", head: true }).eq("status", "published"),
      supabase.from("resources").select("*", { count: "exact", head: true }).eq("status", "draft"),
      supabase.from("categories").select("*", { count: "exact", head: true }),
    ]);

    const publishedCount = publishedRes.count || 0;
    const draftCount = draftRes.count || 0;
    const categoryCount = categoriesRes.count || 0;

    return {
      publishedCount,
      draftCount,
      categoryCount,
      totalCount: publishedCount + draftCount,
    };
  } catch (err) {
    console.error("Error fetching admin stats:", err);
    return { publishedCount: 0, draftCount: 0, categoryCount: 0, totalCount: 0 };
  }
}

export async function getAllAdminResources(): Promise<Resource[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("resources")
      .select(`
        id,
        title,
        slug,
        description,
        category_id,
        technology,
        tags,
        source_code,
        preview_html,
        preview_image_url,
        responsive_desktop,
        responsive_tablet,
        responsive_mobile,
        status,
        created_at,
        updated_at,
        categories (
          name
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching admin resources:", error.message);
      return [];
    }

    const rows = (data as unknown as AdminResourceRow[]) || [];
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      slug: row.slug,
      description: row.description || "",
      categoryId: row.category_id,
      category: (row.categories?.name || "Components") as CategoryType,
      technology: row.technology,
      tags: row.tags || [],
      sourceCode: row.source_code,
      previewHtml: row.preview_html,
      previewImageUrl: row.preview_image_url,
      responsive: {
        desktop: row.responsive_desktop,
        tablet: row.responsive_tablet,
        mobile: row.responsive_mobile,
      },
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  } catch (err) {
    console.error("Unexpected error in getAllAdminResources:", err);
    return [];
  }
}

export async function getAdminResourceById(id: string): Promise<Resource | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("resources")
      .select(`
        id,
        title,
        slug,
        description,
        category_id,
        technology,
        tags,
        source_code,
        preview_html,
        preview_image_url,
        responsive_desktop,
        responsive_tablet,
        responsive_mobile,
        status,
        created_at,
        updated_at,
        categories (
          name
        )
      `)
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    const row = data as unknown as AdminResourceRow;
    return {
      id: row.id,
      title: row.title,
      slug: row.slug,
      description: row.description || "",
      categoryId: row.category_id,
      category: (row.categories?.name || "Components") as CategoryType,
      technology: row.technology,
      tags: row.tags || [],
      sourceCode: row.source_code,
      previewHtml: row.preview_html,
      previewImageUrl: row.preview_image_url,
      responsive: {
        desktop: row.responsive_desktop,
        tablet: row.responsive_tablet,
        mobile: row.responsive_mobile,
      },
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  } catch (err) {
    console.error(`Error in getAdminResourceById (${id}):`, err);
    return null;
  }
}

export async function getAllAdminCategories(): Promise<AdminCategoryWithCount[]> {
  try {
    const supabase = await createClient();

    const [categoriesRes, resourcesRes] = await Promise.all([
      supabase.from("categories").select("*").order("name", { ascending: true }),
      supabase.from("resources").select("category_id"),
    ]);

    if (categoriesRes.error) {
      console.error("Error fetching categories:", categoriesRes.error.message);
      return [];
    }

    const counts: Record<string, number> = {};
    (resourcesRes.data || []).forEach((r) => {
      if (r.category_id) {
        counts[r.category_id] = (counts[r.category_id] || 0) + 1;
      }
    });

    return (categoriesRes.data || []).map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      createdAt: cat.created_at,
      resourceCount: counts[cat.id] || 0,
    }));
  } catch (err) {
    console.error("Error in getAllAdminCategories:", err);
    return [];
  }
}
