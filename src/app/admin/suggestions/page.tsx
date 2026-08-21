import type { Metadata } from "next";
import { getDeveloperSuggestions } from "@/lib/data/suggestions";
import { SuggestionManager } from "@/components/admin/suggestion-manager";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Saran Developer — JakDev Admin",
  description: "Daftar ide dan masukan yang dikirimkan oleh komunitas developer JakDev.",
};

export default async function AdminSuggestionsPage() {
  const suggestions = await getDeveloperSuggestions();

  return <SuggestionManager initialSuggestions={suggestions} />;
}
