import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { AdminNav } from "@/components/admin/admin-nav";
import { getUnreadDeveloperSuggestionsCount } from "@/lib/data/suggestions";

export const metadata: Metadata = {
  title: "Admin Dashboard — JakDev",
  description: "Kelola kategori, komponen, dan katalog source code JakDev.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const [{ data: { user } }, unreadSuggestionCount] = await Promise.all([
    supabase.auth.getUser(),
    getUnreadDeveloperSuggestionsCount(),
  ]);

  return (
    <div className="min-h-screen bg-[#FBFDFD] text-[#272343] selection:bg-[#FFD803] selection:text-[#272343]">
      <AdminNav userEmail={user?.email} suggestionCount={unreadSuggestionCount} />
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
