import { createClient } from "@/lib/supabase/server";
import { DeveloperSuggestion, SuggestionType } from "@/types";

export interface SuggestionRow {
  id: string;
  type: SuggestionType;
  description: string;
  created_at: string;
}

export async function getDeveloperSuggestions(): Promise<DeveloperSuggestion[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("developer_suggestions")
      .select("id, type, description, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching developer suggestions from Supabase:", error.message);
      return [];
    }

    return (data || []).map((row: SuggestionRow) => ({
      id: row.id,
      type: row.type,
      description: row.description,
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
