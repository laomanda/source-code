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
    const firstError = validation.error.issues[0]?.message || "Input saran tidak valid.";
    return { error: firstError };
  }

  const validData = validation.data;

  try {
    const supabase = await createClient();

    const { error } = await supabase.from("developer_suggestions").insert({
      type: validData.type as SuggestionType,
      description: validData.description,
      is_read: false,
    });

    if (error) {
      console.error("Supabase insert error on developer_suggestions:", error.message);
      // Fallback if is_read column is missing
      const fallback = await supabase.from("developer_suggestions").insert({
        type: validData.type as SuggestionType,
        description: validData.description,
      });
      if (fallback.error) {
        return { error: "Gagal mengirimkan saran. Silakan coba lagi." };
      }
    }

    revalidatePath("/admin/suggestions");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    console.error("Unexpected error in submitSuggestionAction:", err);
    return { error: "Terjadi kesalahan sistem. Silakan coba beberapa saat lagi." };
  }
}

/**
 * Mark a single suggestion as read
 */
export async function markSuggestionAsReadAction(
  id: string
): Promise<SuggestionActionState> {
  if (!id || typeof id !== "string") {
    return { error: "ID saran tidak valid." };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("developer_suggestions")
      .update({ is_read: true })
      .eq("id", id);

    if (error) {
      console.error("Error marking suggestion as read:", error.message);
      return { error: error.message };
    }

    revalidatePath("/admin/suggestions");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    console.error("Unexpected error in markSuggestionAsReadAction:", err);
    return { error: "Gagal memperbarui status saran." };
  }
}

/**
 * Mark a single suggestion as unread
 */
export async function markSuggestionAsUnreadAction(
  id: string
): Promise<SuggestionActionState> {
  if (!id || typeof id !== "string") {
    return { error: "ID saran tidak valid." };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("developer_suggestions")
      .update({ is_read: false })
      .eq("id", id);

    if (error) {
      console.error("Error marking suggestion as unread:", error.message);
      return { error: error.message };
    }

    revalidatePath("/admin/suggestions");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    console.error("Unexpected error in markSuggestionAsUnreadAction:", err);
    return { error: "Gagal memperbarui status saran." };
  }
}

/**
 * Bulk mark suggestions as read
 */
export async function bulkMarkSuggestionsAsReadAction(
  ids: string[]
): Promise<SuggestionActionState> {
  if (!Array.isArray(ids) || ids.length === 0) {
    return { error: "Daftar ID saran tidak valid." };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("developer_suggestions")
      .update({ is_read: true })
      .in("id", ids);

    if (error) {
      console.error("Error in bulkMarkSuggestionsAsReadAction:", error.message);
      return { error: error.message };
    }

    revalidatePath("/admin/suggestions");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    console.error("Unexpected error in bulkMarkSuggestionsAsReadAction:", err);
    return { error: "Gagal memperbarui status saran terpilih." };
  }
}

/**
 * Mark ALL suggestions as read
 */
export async function markAllSuggestionsAsReadAction(): Promise<SuggestionActionState> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("developer_suggestions")
      .update({ is_read: true })
      .eq("is_read", false);

    if (error) {
      console.error("Error in markAllSuggestionsAsReadAction:", error.message);
      return { error: error.message };
    }

    revalidatePath("/admin/suggestions");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    console.error("Unexpected error in markAllSuggestionsAsReadAction:", err);
    return { error: "Gagal menandai semua saran." };
  }
}

/**
 * Authenticated Admin deletion of a suggestion
 */
export async function deleteSuggestionAction(
  id: string
): Promise<SuggestionActionState> {
  if (!id || typeof id !== "string") {
    return { error: "ID saran tidak valid." };
  }

  try {
    const supabase = await createClient();

    // Verify admin authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Tidak memiliki izin. Silakan masuk sebagai admin." };
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
    return { error: "Gagal menghapus saran." };
  }
}

/**
 * Authenticated Admin bulk deletion of suggestions
 */
export async function bulkDeleteSuggestionsAction(
  ids: string[]
): Promise<SuggestionActionState> {
  if (!Array.isArray(ids) || ids.length === 0) {
    return { error: "Daftar ID saran tidak valid." };
  }

  try {
    const supabase = await createClient();

    // Verify admin authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Tidak memiliki izin. Silakan masuk sebagai admin." };
    }

    const { error } = await supabase
      .from("developer_suggestions")
      .delete()
      .in("id", ids);

    if (error) {
      console.error("Supabase bulk delete error on developer_suggestions:", error.message);
      return { error: error.message };
    }

    revalidatePath("/admin/suggestions");
    revalidatePath("/admin");
    return { success: true };
  } catch (err: unknown) {
    console.error("Unexpected error in bulkDeleteSuggestionsAction:", err);
    return { error: "Gagal menghapus saran terpilih." };
  }
}
