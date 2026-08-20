"use client";

import * as React from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { CurvedInput } from "@/components/ui/curved-input";
import { toast } from "sonner";
import { SuggestionType } from "@/types";
import {
  Puzzle,
  LayoutGrid,
  FileCode2,
  LayoutTemplate,
  Palette,
  Zap,
  TrendingUp,
  HelpCircle,
  CheckCircle2,
} from "lucide-react";

interface SuggestionOption {
  id: SuggestionType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SUGGESTION_OPTIONS: SuggestionOption[] = [
  { id: "component", label: "Komponen Baru", icon: Puzzle },
  { id: "block", label: "Blok Halaman", icon: LayoutGrid },
  { id: "page", label: "Halaman Baru", icon: FileCode2 },
  { id: "template", label: "Template Baru", icon: LayoutTemplate },
  { id: "ui_design", label: "Desain UI", icon: Palette },
  { id: "feature", label: "Fitur Baru", icon: Zap },
  { id: "improvement", label: "Peningkatan", icon: TrendingUp },
  { id: "other", label: "Lainnya", icon: HelpCircle },
];

const ROW_1 = SUGGESTION_OPTIONS.slice(0, 4);
const ROW_2 = SUGGESTION_OPTIONS.slice(4, 8);

// Gentle Arc geometry offsets for 4-item curved row
const ARC_TRANSFORMS_4 = [
  "sm:translate-y-[6px] sm:rotate-[-4deg]", // Left edge (curves down-left)
  "sm:translate-y-[-4px] sm:rotate-[-1deg]", // Left center (curves up)
  "sm:translate-y-[-4px] sm:rotate-[1deg]", // Right center (curves up)
  "sm:translate-y-[6px] sm:rotate-[4deg]", // Right edge (curves down-right)
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

  const processSubmission = async (textToSubmit: string) => {
    if (!selectedType) {
      setValidationError("Silakan pilih kategori saran terlebih dahulu di atas.");
      toast.error("Pilih kategori saran yang ingin Anda sampaikan.");
      return;
    }

    const trimmed = textToSubmit.trim();
    if (trimmed.length < 5) {
      setValidationError("Deskripsi ide minimal 5 karakter.");
      toast.error("Tuliskan deskripsi ide Anda minimal 5 karakter.");
      return;
    }

    if (trimmed.length > maxChars) {
      setValidationError(`Deskripsi tidak boleh melebihi ${maxChars} karakter.`);
      toast.error(`Deskripsi terlalu panjang (maksimal ${maxChars} karakter).`);
      return;
    }

    setValidationError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: selectedType,
          description: trimmed,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        toast.error(data.error || "Gagal mengirimkan saran. Silakan coba lagi.");
        setIsSubmitting(false);
        return;
      }

      // Success
      toast.success(
        "Saran Anda berhasil dikirim. Terima kasih telah membantu mengembangkan JakDev!",
        {
          duration: 5000,
          icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
        }
      );

      // Reset form state cleanly
      setSelectedType(null);
      setDescription("");
      setIsSubmitting(false);
    } catch (err: unknown) {
      console.error("Developer suggestion submission error:", err);
      const errMsg = err instanceof Error ? err.message : "Terjadi kesalahan. Silakan coba lagi.";
      toast.error(errMsg);
      setIsSubmitting(false);
    }
  };

  return (
    <Section id="suggest" spacing="default" className="bg-gradient-to-b from-white via-[#E3F6F5]/30 to-white py-16 sm:py-24">
      <Container size="xl">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Section Header */}
          <div className="text-center space-y-3">
            <h2 className="text-h2 text-[#272343]">Punya Ide atau Masukan untuk JakDev?</h2>
          </div>

          {/* Unified Curved Card Envelope Container */}
          <div className="relative rounded-[36px] sm:rounded-[48px] bg-white/95 backdrop-blur-md border-2 border-[#BAE8E8] shadow-soft-lg p-6 sm:p-10 space-y-8 transition-all overflow-hidden">
            {/* Step 1: Arched Curved Category Buttons Following Arc Geometry */}
            <div className="space-y-3">
              {/* Row 1 Curved Arc */}
              <div
                className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 max-w-3xl mx-auto pt-1 pb-1"
                role="group"
                aria-label="Pilihan kategori saran baris 1"
              >
                {ROW_1.map((option, idx) => {
                  const Icon = option.icon;
                  const isSelected = selectedType === option.id;
                  const arcClass = ARC_TRANSFORMS_4[idx];

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleTypeSelect(option.id)}
                      aria-pressed={isSelected}
                      disabled={isSubmitting}
                      className={`h-10 sm:h-11 px-4 sm:px-5 rounded-full border text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2.5 shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343] ${arcClass} ${
                        isSelected
                          ? "bg-[#FFD803] text-[#272343] border-[#272343] shadow-soft-sm font-bold sm:!scale-105 z-10 sm:!-translate-y-2"
                          : "bg-white text-[#2D334A] border-[#BAE8E8] hover:border-[#272343] hover:bg-[#E3F6F5]/80 hover:shadow-soft-sm hover:z-10 hover:!rotate-0 hover:!-translate-y-2 shadow-soft-xs"
                      }`}
                    >
                      <div
                        className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? "bg-[#272343] text-[#FFD803]"
                            : "bg-[#E3F6F5] text-[#272343]"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="leading-none">{option.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Row 2 Curved Arc */}
              <div
                className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 max-w-3xl mx-auto pt-1 pb-2"
                role="group"
                aria-label="Pilihan kategori saran baris 2"
              >
                {ROW_2.map((option, idx) => {
                  const Icon = option.icon;
                  const isSelected = selectedType === option.id;
                  const arcClass = ARC_TRANSFORMS_4[idx];

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleTypeSelect(option.id)}
                      aria-pressed={isSelected}
                      disabled={isSubmitting}
                      className={`h-10 sm:h-11 px-4 sm:px-5 rounded-full border text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2.5 shrink-0 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343] ${arcClass} ${
                        isSelected
                          ? "bg-[#FFD803] text-[#272343] border-[#272343] shadow-soft-sm font-bold sm:!scale-105 z-10 sm:!-translate-y-2"
                          : "bg-white text-[#2D334A] border-[#BAE8E8] hover:border-[#272343] hover:bg-[#E3F6F5]/80 hover:shadow-soft-sm hover:z-10 hover:!rotate-0 hover:!-translate-y-2 shadow-soft-xs"
                      }`}
                    >
                      <div
                        className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? "bg-[#272343] text-[#FFD803]"
                            : "bg-[#E3F6F5] text-[#272343]"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="leading-none">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Arc-Bent Curved Label and Curved Input Component */}
            <div className="space-y-1 pt-2 max-w-2xl mx-auto">
              {/* Arc-Curved Header Label & Counter */}
              <div className="w-full px-1">
                <svg
                  viewBox="0 0 672 26"
                  className="w-full h-6 sm:h-7 overflow-visible select-none pointer-events-none"
                >
                  <path id="label-curved-path" d="M 16 22 Q 336 2 656 22" fill="none" />
                  <text
                    fill="#272343"
                    className="text-[13px] font-bold font-mono"
                    dy="-3"
                  >
                    <textPath href="#label-curved-path" startOffset="1%">
                      Jelaskan Ide Anda <tspan fill="#F43F5E">*</tspan>
                    </textPath>
                  </text>
                  <text
                    fill={charCount > maxChars ? "#E11D48" : "#2D334A"}
                    className={`text-[12px] font-mono ${charCount > maxChars ? "font-bold" : "font-medium opacity-80"}`}
                    textAnchor="end"
                    dy="-3"
                  >
                    <textPath href="#label-curved-path" startOffset="99%">
                      {charCount} / {maxChars}
                    </textPath>
                  </text>
                </svg>
              </div>

              {/* Curved Input Bar */}
              <div className="w-full flex justify-center">
                <CurvedInput
                  value={description}
                  onChange={(val) => {
                    setDescription(val);
                    if (validationError) setValidationError(null);
                  }}
                  onSubmit={(val) => {
                    processSubmission(val);
                  }}
                  placeholder="Tuliskan komponen, template, atau ide Anda"
                  buttonText={isSubmitting ? "Mengirim..." : "Kirim Saran ✈"}
                  bend={26}
                  height={66}
                  cornerRadius={22}
                  fontSize={15}
                  backgroundColor="#272343"
                  textColor="#FFFFFF"
                  placeholderColor="#BAE8E8"
                  borderColor={validationError && description.trim().length < 5 ? "#F43F5E" : "#BAE8E8"}
                  buttonColor="#FFD803"
                  buttonTextColor="#272343"
                  iconColor="#FFD803"
                  shadowSize="md"
                  className="w-full"
                />
              </div>

              {validationError && (
                <p className="text-xs text-rose-600 font-medium animate-in fade-in duration-150 text-center pt-2">
                  {validationError}
                </p>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
