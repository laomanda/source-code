import { createClient } from "@/lib/supabase/server";
import { Resource, CategoryType, Category } from "@/types";

export interface AdminStats {
  publishedCount: number;
  draftCount: number;
  categoryCount: number;
  totalCount: number;
}

export interface ResourceDistributionItem {
  name: string;
  count: number;
  percentage: number;
}

export interface ResourceTagCount {
  tag: string;
  count: number;
}

export interface ResourceDetailedStats {
  totalCount: number;
  publishedCount: number;
  draftCount: number;
  categoryCount: number;
  publishedRatio: number;
  desktopCount: number;
  tabletCount: number;
  mobileCount: number;
  categories: ResourceDistributionItem[];
  technologies: ResourceDistributionItem[];
  topTags: ResourceTagCount[];
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

export async function getDetailedResourceStats(): Promise<ResourceDetailedStats> {
  const [resources, categories] = await Promise.all([
    getAllAdminResources(),
    getAllAdminCategories(),
  ]);

  const totalCount = resources.length;
  const publishedCount = resources.filter((r) => r.status === "published").length;
  const draftCount = resources.filter((r) => r.status === "draft").length;
  const categoryCount = categories.length;

  const publishedRatio = totalCount > 0 ? Math.round((publishedCount / totalCount) * 100) : 0;

  const desktopCount = resources.filter((r) => r.responsive.desktop).length;
  const tabletCount = resources.filter((r) => r.responsive.tablet).length;
  const mobileCount = resources.filter((r) => r.responsive.mobile).length;

  // Category distribution
  const catMap: Record<string, number> = {};
  resources.forEach((r) => {
    const catName = r.category || "Uncategorized";
    catMap[catName] = (catMap[catName] || 0) + 1;
  });

  const categoryDistribution: ResourceDistributionItem[] = Object.entries(catMap)
    .map(([name, count]) => ({
      name,
      count,
      percentage: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // Tech distribution
  const techMap: Record<string, number> = {};
  resources.forEach((r) => {
    const techName = r.technology || "Other";
    techMap[techName] = (techMap[techName] || 0) + 1;
  });

  const technologyDistribution: ResourceDistributionItem[] = Object.entries(techMap)
    .map(([name, count]) => ({
      name,
      count,
      percentage: totalCount > 0 ? Math.round((count / totalCount) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  // Tag frequency
  const tagMap: Record<string, number> = {};
  resources.forEach((r) => {
    (r.tags || []).forEach((t) => {
      const cleanTag = t.trim().toLowerCase();
      if (cleanTag) {
        tagMap[cleanTag] = (tagMap[cleanTag] || 0) + 1;
      }
    });
  });

  const topTags: ResourceTagCount[] = Object.entries(tagMap)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalCount,
    publishedCount,
    draftCount,
    categoryCount,
    publishedRatio,
    desktopCount,
    tabletCount,
    mobileCount,
    categories: categoryDistribution,
    technologies: technologyDistribution,
    topTags,
  };
}

