"use client";

import * as React from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { SuggestionType } from "@/types";
import { submitSuggestionAction } from "@/lib/actions/suggestions";
import {
  Puzzle,
  LayoutGrid,
  FileCode2,
  LayoutTemplate,
  Palette,
  Zap,
  TrendingUp,
  HelpCircle,
  Lightbulb,
  Send,
  Loader2,
  CheckCircle2,
} from "lucide-react";

interface SuggestionOption {
  id: SuggestionType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SUGGESTION_OPTIONS: SuggestionOption[] = [
  { id: "component", label: "New Component", icon: Puzzle },
  { id: "block", label: "New Block", icon: LayoutGrid },
  { id: "page", label: "New Page", icon: FileCode2 },
  { id: "template", label: "New Template", icon: LayoutTemplate },
  { id: "ui_design", label: "UI / Design", icon: Palette },
  { id: "feature", label: "Feature", icon: Zap },
  { id: "improvement", label: "Improvement", icon: TrendingUp },
  { id: "other", label: "Other", icon: HelpCircle },
];

export function DeveloperSuggestion() {
  const [selectedType, setSelectedType] = React.useState<SuggestionType | null>(null);
  const [description, setDescription] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [validationError, setValidationError] = React.useState<string | null>(null);

  const charCount = description.length;
  const maxChars = 2000;

  const handleTypeSelect = (typeId: SuggestionType) => {
    setSelectedType(typeId);
    if (validationError) setValidationError(null);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    if (validationError) setValidationError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Client-side validation for instant UX feedback
    if (!selectedType) {
      setValidationError("Please select a suggestion type.");
      toast.error("Please choose what you would like to suggest.");
      return;
    }

    const trimmed = description.trim();
    if (trimmed.length < 5) {
      setValidationError("Description must be at least 5 characters long.");
      toast.error("Please describe your idea (at least 5 characters).");
      return;
    }

    if (trimmed.length > maxChars) {
      setValidationError(`Description cannot exceed ${maxChars} characters.`);
      toast.error(`Description is too long (max ${maxChars} characters).`);
      return;
    }

    setValidationError(null);
    setIsSubmitting(true);

    try {
      const result = await submitSuggestionAction(selectedType, trimmed);

      if (result.error) {
        toast.error(result.error);
        setIsSubmitting(false);
        return;
      }

      // Success
      toast.success(
        "Suggestion submitted successfully. Thanks for helping improve JakDev!",
        {
          duration: 5000,
          icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
        }
      );

      // Reset form state cleanly
      setSelectedType(null);
      setDescription("");
    } catch (err: unknown) {
      console.error("Developer suggestion submission error:", err);
      const errMsg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast.error(errMsg);
      setIsSubmitting(false);
    }
  };

  return (
    <Section id="suggest" spacing="default" className="bg-[#FFFFFF] border-t border-[#BAE8E8]/70">
      <Container size="xl">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Section Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E3F6F5] border border-[#BAE8E8] text-xs font-semibold text-[#272343] shadow-soft-xs">
              <Lightbulb className="h-3.5 w-3.5 text-[#272343]" />
              <span>Community Feedback</span>
            </div>
            <h2 className="text-h2">Have an idea for JakDev?</h2>
            <p className="text-body text-[#2D334A]/80 max-w-xl mx-auto">
              Tell us what you think JakDev should build next. Anonymous, fast, and straight to the team.
            </p>
          </div>

          {/* Suggestion Card Container */}
          <Card className="bg-[#FBFDFD] border-[#BAE8E8] shadow-soft p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Type Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-bold text-[#272343]">
                  What would you like to suggest?{" "}
                  <span className="text-rose-500 font-normal">*</span>
                </label>

                <div
                  className="grid grid-cols-2 sm:grid-cols-4 gap-2.5"
                  role="group"
                  aria-label="Suggestion type options"
                >
                  {SUGGESTION_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    const isSelected = selectedType === option.id;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleTypeSelect(option.id)}
                        aria-pressed={isSelected}
                        disabled={isSubmitting}
                        className={`p-3 rounded-xl border text-left transition-all duration-150 flex flex-col justify-between space-y-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343] focus-visible:ring-offset-2 ${
                          isSelected
                            ? "bg-[#FFD803] text-[#272343] border-[#272343] shadow-soft-sm font-bold translate-y-[-1px]"
                            : "bg-white text-[#2D334A] border-[#BAE8E8] hover:border-[#8CD3D3] hover:bg-[#E3F6F5]/50 shadow-soft-xs"
                        }`}
                      >
                        <div
                          className={`h-7 w-7 rounded-lg flex items-center justify-center ${
                            isSelected
                              ? "bg-[#272343] text-[#FFD803]"
                              : "bg-[#E3F6F5] text-[#272343] border border-[#BAE8E8]/70"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-semibold leading-tight">
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Description Textarea */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="suggestion-description" className="block text-sm font-bold text-[#272343]">
                    Describe your idea{" "}
                    <span className="text-rose-500 font-normal">*</span>
                  </label>
                  <span
                    className={`font-mono text-xs ${
                      charCount > maxChars
                        ? "text-rose-600 font-bold"
                        : "text-[#2D334A]/60"
                    }`}
                  >
                    {charCount} / {maxChars}
                  </span>
                </div>

                <div className="relative">
                  <textarea
                    id="suggestion-description"
                    rows={4}
                    value={description}
                    onChange={handleDescriptionChange}
                    placeholder="Tell us what you would like to see on JakDev..."
                    maxLength={maxChars + 50}
                    disabled={isSubmitting}
                    className={`w-full p-3.5 rounded-xl border bg-white text-sm text-[#272343] placeholder-[#2D334A]/50 shadow-soft-xs resize-y min-h-[120px] max-h-[320px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343] focus-visible:ring-offset-1 ${
                      validationError && description.trim().length < 5
                        ? "border-rose-300 focus-visible:ring-rose-500"
                        : "border-[#BAE8E8] focus-visible:border-[#272343]"
                    }`}
                  />
                </div>

                {validationError && (
                  <p className="text-xs text-rose-600 font-medium animate-in fade-in duration-150">
                    {validationError}
                  </p>
                )}
              </div>

              {/* Step 3: Action Controls */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#BAE8E8]/60">
                <p className="text-xs text-[#2D334A]/70 flex items-center gap-1.5 text-center sm:text-left">
                  <span>🔒 100% Anonymous. No account or email required.</span>
                </p>

                <Button
                  type="submit"
                  variant="primary"
                  size="default"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto font-semibold shadow-soft-sm gap-2 shrink-0"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Suggestion</span>
                      <Send className="h-3.5 w-3.5" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
