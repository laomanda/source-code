"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { suggestionSchema } from "@/lib/validations/suggestion";
import { SuggestionType } from "@/types";

export interface SuggestionActionState {
  error?: string;
  success?: boolean;
}

/**
 * Anonymous public submission of developer suggestion
 */
export async function submitSuggestionAction(
  type: string,
  description: string
): Promise<SuggestionActionState> {
  // Server-side Zod validation
  const validation = suggestionSchema.safeParse({
    type,
    description: description?.trim() || "",
  });

  if (!validation.success) {
    const firstError = validation.error.issues[0]?.message || "Invalid suggestion input.";
    return { error: firstError };
  }

  const validData = validation.data;

  try {
    const supabase = await createClient();

    const { error } = await supabase.from("developer_suggestions").insert({
      type: validData.type as SuggestionType,
      description: validData.description,
    });

    if (error) {
      console.error("Supabase insert error on developer_suggestions:", error.message);
      return { error: error.message || "Failed to submit suggestion. Please try again." };
    }

    revalidatePath("/admin/suggestions");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    console.error("Unexpected error in submitSuggestionAction:", err);
    return { error: "An unexpected error occurred. Please try again later." };
  }
}

/**
 * Authenticated Admin deletion of a suggestion
 */
export async function deleteSuggestionAction(
  id: string
): Promise<SuggestionActionState> {
  if (!id || typeof id !== "string") {
    return { error: "Invalid suggestion ID." };
  }

  try {
    const supabase = await createClient();

    // Verify admin authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Unauthorized. Please log in as admin." };
    }

    const { error } = await supabase
      .from("developer_suggestions")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Supabase delete error on developer_suggestions:", error.message);
      return { error: error.message };
    }

    revalidatePath("/admin/suggestions");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    console.error("Unexpected error in deleteSuggestionAction:", err);
    return { error: "Failed to delete suggestion." };
  }
}
