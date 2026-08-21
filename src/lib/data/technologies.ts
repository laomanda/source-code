import { createClient } from "@/lib/supabase/server";
import { Technology } from "@/types";

interface TechnologyRow {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  created_at: string;
}

export async function getTechnologies(): Promise<Technology[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("technologies")
      .select("id, name, slug, icon, description, created_at")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching technologies from Supabase:", error.message);
      // Fallback default list if table not yet seeded or error
      return [
        { id: "1", name: "React", slug: "react", description: "React UI components", createdAt: new Date().toISOString() },
        { id: "2", name: "Next.js", slug: "nextjs", description: "Next.js App Router", createdAt: new Date().toISOString() },
        { id: "3", name: "Tailwind CSS", slug: "tailwind", description: "Tailwind utility styles", createdAt: new Date().toISOString() },
        { id: "4", name: "TypeScript", slug: "typescript", description: "Type-safe code", createdAt: new Date().toISOString() },
        { id: "5", name: "HTML & CSS", slug: "html", description: "Standard HTML5 & CSS3", createdAt: new Date().toISOString() },
      ];
    }

    const rows = (data as unknown as TechnologyRow[]) || [];
    if (rows.length === 0) {
      return [
        { id: "1", name: "React", slug: "react", description: "React UI components", createdAt: new Date().toISOString() },
        { id: "2", name: "Next.js", slug: "nextjs", description: "Next.js App Router", createdAt: new Date().toISOString() },
        { id: "3", name: "Tailwind CSS", slug: "tailwind", description: "Tailwind utility styles", createdAt: new Date().toISOString() },
        { id: "4", name: "TypeScript", slug: "typescript", description: "Type-safe code", createdAt: new Date().toISOString() },
        { id: "5", name: "HTML & CSS", slug: "html", description: "Standard HTML5 & CSS3", createdAt: new Date().toISOString() },
      ];
    }

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      slug: row.slug,
      icon: row.icon,
      description: row.description,
      createdAt: row.created_at,
    }));
  } catch (err) {
    console.error("Unexpected error in getTechnologies:", err);
    return [
      { id: "1", name: "React", slug: "react", description: "React UI components", createdAt: new Date().toISOString() },
      { id: "2", name: "Next.js", slug: "nextjs", description: "Next.js App Router", createdAt: new Date().toISOString() },
      { id: "3", name: "Tailwind CSS", slug: "tailwind", description: "Tailwind utility styles", createdAt: new Date().toISOString() },
      { id: "4", name: "TypeScript", slug: "typescript", description: "Type-safe code", createdAt: new Date().toISOString() },
      { id: "5", name: "HTML & CSS", slug: "html", description: "Standard HTML5 & CSS3", createdAt: new Date().toISOString() },
    ];
  }
}

export async function getTechnologyBySlug(slug: string): Promise<Technology | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("technologies")
      .select("id, name, slug, icon, description, created_at")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      return null;
    }

    const row = data as unknown as TechnologyRow;
    return {
      id: row.id,
      name: row.name,
      slug: row.slug,
      icon: row.icon,
      description: row.description,
      createdAt: row.created_at,
    };
  } catch (err) {
    console.error("Unexpected error in getTechnologyBySlug:", err);
    return null;
  }
}
