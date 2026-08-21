import { createClient } from "@/lib/supabase/server";
import { DeveloperSuggestion, SuggestionType } from "@/types";

export interface SuggestionRow {
  id: string;
  type: SuggestionType;
  description: string;
  is_read?: boolean | null;
  created_at: string;
}

export async function getDeveloperSuggestions(): Promise<DeveloperSuggestion[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("developer_suggestions")
      .select("id, type, description, is_read, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      // Fallback if is_read column is not yet present in supabase schema cache
      const fallback = await supabase
        .from("developer_suggestions")
        .select("id, type, description, created_at")
        .order("created_at", { ascending: false });

      if (fallback.error) {
        console.error("Error fetching developer suggestions from Supabase:", fallback.error.message);
        return [];
      }

      return (fallback.data || []).map((row: SuggestionRow) => ({
        id: row.id,
        type: row.type,
        description: row.description,
        isRead: false,
        createdAt: row.created_at,
      }));
    }

    return (data || []).map((row: SuggestionRow) => ({
      id: row.id,
      type: row.type,
      description: row.description,
      isRead: Boolean(row.is_read),
      createdAt: row.created_at,
    }));
  } catch (err) {
    console.error("Unexpected error in getDeveloperSuggestions:", err);
    return [];
  }
}

export async function getDeveloperSuggestionsCount(): Promise<number> {
  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("developer_suggestions")
      .select("*", { count: "exact", head: true });

    if (error) {
      console.error("Error fetching suggestions count from Supabase:", error.message);
      return 0;
    }

    return count || 0;
  } catch (err) {
    console.error("Unexpected error in getDeveloperSuggestionsCount:", err);
    return 0;
  }
}

export async function getUnreadDeveloperSuggestionsCount(): Promise<number> {
  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("developer_suggestions")
      .select("*", { count: "exact", head: true })
      .eq("is_read", false);

    if (error) {
      // Fallback to total count if is_read does not exist yet
      const fallback = await supabase
        .from("developer_suggestions")
        .select("*", { count: "exact", head: true });
      return fallback.count || 0;
    }

    return count || 0;
  } catch (err) {
    console.error("Unexpected error in getUnreadDeveloperSuggestionsCount:", err);
    return 0;
  }
}
