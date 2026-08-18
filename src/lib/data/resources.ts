import { createClient } from "@/lib/supabase/server";
import { Resource, CategoryType } from "@/types";

interface ResourceRowWithCategory {
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

function mapRowToResource(row: ResourceRowWithCategory): Resource {
  const categoryName = (row.categories?.name || "Components") as CategoryType;

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description || "",
    categoryId: row.category_id,
    category: categoryName,
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
}

export async function getPublishedResources(): Promise<Resource[]> {
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
      .eq("status", "published")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching published resources from Supabase:", error.message);
      return [];
    }

    return ((data as unknown as ResourceRowWithCategory[]) || []).map(mapRowToResource);
  } catch (err) {
    console.error("Unexpected error in getPublishedResources:", err);
    return [];
  }
}

export async function getResourceBySlug(slug: string): Promise<Resource | null> {
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
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error) {
      console.error(`Error fetching resource "${slug}" from Supabase:`, error.message);
      return null;
    }

    if (!data) {
      return null;
    }

    return mapRowToResource(data as unknown as ResourceRowWithCategory);
  } catch (err) {
    console.error(`Unexpected error in getResourceBySlug for "${slug}":`, err);
    return null;
  }
}
