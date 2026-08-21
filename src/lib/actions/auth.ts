"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export interface AuthActionState {
  error?: string;
  success?: boolean;
}

function translateAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("invalid login credentials") || lower.includes("invalid credentials")) {
    return "Email atau kata sandi yang Anda masukkan salah.";
  }
  if (lower.includes("email not confirmed")) {
    return "Alamat email belum dikonfirmasi. Silakan periksa kotak masuk email Anda.";
  }
  if (lower.includes("user not found")) {
    return "Akun dengan email tersebut tidak ditemukan.";
  }
  if (lower.includes("too many requests") || lower.includes("rate limit")) {
    return "Terlalu banyak percobaan masuk. Silakan tunggu beberapa saat lagi.";
  }
  if (lower.includes("invalid email")) {
    return "Format alamat email tidak valid.";
  }
  return message || "Terjadi kesalahan saat masuk. Silakan coba lagi.";
}

export async function loginAction(
  _prevState: AuthActionState | null,
  formData: FormData
): Promise<AuthActionState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Silakan masukkan alamat email dan kata sandi." };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      return { error: translateAuthError(error.message) };
    }

    return { success: true };
  } catch (err: unknown) {
    const rawMsg = err instanceof Error ? err.message : "";
    return { error: translateAuthError(rawMsg) };
  }
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
