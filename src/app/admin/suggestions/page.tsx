import type { Metadata } from "next";
import { getDeveloperSuggestions } from "@/lib/data/suggestions";
import { SuggestionManager } from "@/components/admin/suggestion-manager";
import { Lightbulb } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Developer Suggestions — JakDev Admin",
  description: "Ideas and feedback submitted by the JakDev community.",
};

export default async function AdminSuggestionsPage() {
  const suggestions = await getDeveloperSuggestions();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#BAE8E8]/60 pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#0D6E6E] mb-1">
          <Lightbulb className="h-3.5 w-3.5" />
          <span>Community Feedback</span>
        </div>
        <h1 className="text-h2 text-[#272343]">Developer Suggestions</h1>
        <p className="text-body-small text-[#2D334A]/80 mt-1">
          Ideas and feedback submitted by the JakDev community.
        </p>
      </div>

      {/* Suggestion Manager Table & Filter Controls */}
      <SuggestionManager initialSuggestions={suggestions} />
    </div>
  );
}
