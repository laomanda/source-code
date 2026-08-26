import { createClient } from "@/lib/supabase/server";
import { Resource, CategoryType } from "@/types";

interface ResourceRowWithCategory {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category_id: string | null;
  tech_id?: string | null;
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

const BASE_SELECT_WITH_TECH = `
  id,
  title,
  slug,
  description,
  category_id,
  tech_id,
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
`;

const BASE_SELECT_FALLBACK = `
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
`;

function mapRowToResource(row: ResourceRowWithCategory): Resource {
  const categoryName = (row.categories?.name || "Components") as CategoryType;

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description || "",
    categoryId: row.category_id,
    category: categoryName,
    techId: row.tech_id || null,
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
    const res = await supabase
      .from("resources")
      .select(BASE_SELECT_WITH_TECH)
      .eq("status", "published")
      .order("created_at", { ascending: false });

    let rows: ResourceRowWithCategory[] = [];

    if (res.error && (res.error.message?.includes("tech_id") || res.error.code === "42703")) {
      const fallbackRes = await supabase
        .from("resources")
        .select(BASE_SELECT_FALLBACK)
        .eq("status", "published")
        .order("created_at", { ascending: false });

      if (fallbackRes.error) {
        console.error("Error fetching published resources from Supabase:", fallbackRes.error.message);
        return [];
      }
      rows = (fallbackRes.data as unknown as ResourceRowWithCategory[]) || [];
    } else if (res.error) {
      console.error("Error fetching published resources from Supabase:", res.error.message);
      return [];
    } else {
      rows = (res.data as unknown as ResourceRowWithCategory[]) || [];
    }

    return rows.map(mapRowToResource);
  } catch (err) {
    console.error("Unexpected error in getPublishedResources:", err);
    return [];
  }
}

export async function getResourceBySlug(
  slug: string,
  allowDraft: boolean = false
): Promise<Resource | null> {
  try {
    const supabase = await createClient();

    // 1. Fast path: Attempt fetching published resource directly
    let res = await supabase
      .from("resources")
      .select(BASE_SELECT_WITH_TECH)
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (res.error && (res.error.message?.includes("tech_id") || res.error.code === "42703")) {
      res = await supabase
        .from("resources")
        .select(BASE_SELECT_FALLBACK)
        .eq("slug", slug)
        .eq("status", "published")
        .maybeSingle();
    }

    if (res.data) {
      return mapRowToResource(res.data as unknown as ResourceRowWithCategory);
    }

    // 2. If allowDraft requested or fast query returned nothing, check admin auth
    let isUserAdmin = allowDraft;
    if (!isUserAdmin) {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        isUserAdmin = !!user;
      } catch {
        isUserAdmin = false;
      }
    }

    if (!isUserAdmin) {
      return null;
    }

    // Admin can view draft resources
    let adminRes = await supabase
      .from("resources")
      .select(BASE_SELECT_WITH_TECH)
      .eq("slug", slug)
      .maybeSingle();

    if (
      adminRes.error &&
      (adminRes.error.message?.includes("tech_id") || adminRes.error.code === "42703")
    ) {
      adminRes = await supabase
        .from("resources")
        .select(BASE_SELECT_FALLBACK)
        .eq("slug", slug)
        .maybeSingle();
    }

    if (adminRes.data) {
      return mapRowToResource(adminRes.data as unknown as ResourceRowWithCategory);
    }

    return null;
  } catch (err) {
    console.error(`Unexpected error in getResourceBySlug for "${slug}":`, err);
    return null;
  }
}
