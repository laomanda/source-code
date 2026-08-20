"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { MoltenMetal } from "@/components/ui/molten-metal";
import {
  ArrowRight,
  Code2,
  Copy,
  Check,
  Layout,
  Smartphone,
  Monitor,
  Tablet,
  Unlock,
  Boxes,
  Cpu,
} from "lucide-react";

export function ResourceShowcase() {
  const [copiedSnippet, setCopiedSnippet] = React.useState(false);
  const [switchActive, setSwitchActive] = React.useState(true);

  const handleCopySnippet = () => {
    navigator.clipboard.writeText("npx jakdev-ui add interactive-button");
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <Section id="showcase" spacing="default" className="bg-[#FFFFFF]">
      <Container size="xl">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <h2 className="text-h2 text-[#272343]">
            Apa Saja yang Ada di Dalam JakDev?
          </h2>
          <p className="text-body text-[#2D334A]/80">
            Koleksi lengkap elemen web modern yang dirancang untuk mempercepat alur kerja pengembangan web Anda dari ide hingga produksi.
          </p>
        </div>

        {/* Bento Grid Architecture */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 sm:gap-6">
          {/* Bento Card 1: Pustaka Komponen UI (Large Feature - 8 Cols) */}
          <div className="lg:col-span-8 group relative rounded-3xl bg-gradient-to-br from-[#E3F6F5]/60 via-white to-white border border-[#BAE8E8] p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-soft-sm hover:shadow-soft-md hover:border-[#272343]/30 transition-all duration-300">
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="navy" size="default" className="gap-1.5 font-mono">
                  <Boxes className="h-3.5 w-3.5 text-[#FFD803]" />
                  <span>50+ Komponen UI</span>
                </Badge>
                <span className="text-xs font-mono text-[#0D6E6E] font-bold">
                  Copy-Paste Instan
                </span>
              </div>

              <div className="max-w-xl">
                <h3 className="text-h3 text-[#272343] mb-2 group-hover:text-[#0D6E6E] transition-colors">
                  Komponen Antarmuka Interaktif Siap Pakai
                </h3>
                <p className="text-body-small text-[#2D334A]/80">
                  Mulai dari tombol *micro-interaction*, bilah navigasi mengambang, efek blur progresif, kartu animasi 3D, hingga modal aksesibel yang responsif.
                </p>
              </div>

              {/* Interactive Mini UI Showcase */}
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Mini Component 1: Interactive Stagger Button */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#BAE8E8] shadow-soft-xs flex flex-col items-center justify-center gap-2 text-center">
                  <span className="text-[11px] font-mono text-[#2D334A]/60 font-semibold">Tombol Aksi</span>
                  <button
                    type="button"
                    className="px-3.5 py-1.5 rounded-xl bg-[#272343] text-white text-xs font-bold shadow-soft-xs hover:bg-[#0D6E6E] hover:scale-105 active:scale-95 transition-all duration-200"
                  >
                    Pratinjau Kode
                  </button>
                </div>

                {/* Mini Component 2: Interactive Toggle Switch */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#BAE8E8] shadow-soft-xs flex flex-col items-center justify-center gap-2 text-center">
                  <span className="text-[11px] font-mono text-[#2D334A]/60 font-semibold">Toggle Interaktif</span>
                  <button
                    type="button"
                    onClick={() => setSwitchActive(!switchActive)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                      switchActive ? "bg-[#0D6E6E]" : "bg-[#BAE8E8]"
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                        switchActive ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* Mini Component 3: Live Badge Pill */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#BAE8E8] shadow-soft-xs flex flex-col items-center justify-center gap-2 text-center">
                  <span className="text-[11px] font-mono text-[#2D334A]/60 font-semibold">Status Pill</span>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E3F6F5] border border-[#BAE8E8] text-[11px] font-bold text-[#272343]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0D6E6E] animate-ping" />
                    Live Preview
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#BAE8E8]/60 flex items-center justify-between relative z-10">
              <Button asChild size="sm" variant="ghost" className="gap-1.5 text-[#272343] hover:text-[#0D6E6E]">
                <Link href="/library?category=Components">
                  <span>Buka Pustaka Komponen</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>

            {/* Subtle Decorative Ambient Background */}
            <div className="pointer-events-none absolute -bottom-10 -right-10 w-64 h-64 rounded-full bg-[#BAE8E8]/40 blur-3xl" />
          </div>

          {/* Bento Card 2: 100% Gratis & Open Source (4 Cols) */}
          <div className="lg:col-span-4 group relative rounded-3xl bg-gradient-to-br from-[#FFD803]/20 via-[#FFD803]/10 to-white border border-[#FFD803]/60 p-6 sm:p-8 flex flex-col justify-between overflow-hidden shadow-soft-sm hover:shadow-soft-md hover:border-[#FFD803] transition-all duration-300">
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-2xl bg-[#FFD803] text-[#272343] flex items-center justify-center shadow-soft-sm">
                  <Unlock className="h-6 w-6" />
                </div>
              </div>

              <div>
                <h3 className="text-h3 text-[#272343] mb-2">
                  Tanpa Biaya Langganan atau Paywall
                </h3>
                <p className="text-body-small text-[#2D334A]/80">
                  Seluruh kode sumber terbuka untuk kebutuhan proyek pribadi maupun komersial tanpa batas kuota ataupun akun berbayar.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/80 border border-[#BAE8E8] shadow-soft-xs space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#272343]">
                  <Check className="h-4 w-4 text-[#0D6E6E]" />
                  <span>Bebas Digunakan Komersial</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#272343]">
                  <Check className="h-4 w-4 text-[#0D6E6E]" />
                  <span>Tanpa Keterikatan Lisensi Ketat</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#FFD803]/40 relative z-10">
              <Button asChild size="sm" variant="primary" className="w-full justify-center gap-2">
                <Link href="/library">
                  <span>Mulai Eksplorasi Gratis</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Bento Card 3: Blok Landing Page (4 Cols) */}
          <div className="md:col-span-1 lg:col-span-4 group relative rounded-3xl bg-white border border-[#BAE8E8] p-6 sm:p-7 flex flex-col justify-between overflow-hidden shadow-soft-sm hover:shadow-soft-md hover:border-[#272343]/30 transition-all duration-300">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-xl bg-[#E3F6F5] text-[#0D6E6E] flex items-center justify-center border border-[#BAE8E8]">
                <Layout className="h-5 w-5" />
              </div>

              <div>
                <h4 className="text-h4 text-[#272343] mb-1.5 group-hover:text-[#0D6E6E] transition-colors">
                  Blok Halaman Siap Rakit
                </h4>
                <p className="text-body-small text-[#2D334A]/80">
                  Section siap pasang seperti Hero 3D, Tabel Harga, FAQ Accordion, Testimoni, dan Footer Multi-Tier.
                </p>
              </div>

              {/* Wireframe Mockup Visual */}
              <div className="p-3 rounded-xl bg-[#E3F6F5]/50 border border-[#BAE8E8]/70 space-y-1.5 font-mono text-[11px] text-[#2D334A]/70">
                <div className="h-4 rounded bg-white border border-[#BAE8E8] flex items-center px-2 text-[10px]">
                  &lt;HeroSection /&gt;
                </div>
                <div className="h-4 rounded bg-white border border-[#BAE8E8] flex items-center px-2 text-[10px]">
                  &lt;PricingMatrix /&gt;
                </div>
                <div className="h-4 rounded bg-white border border-[#BAE8E8] flex items-center px-2 text-[10px]">
                  &lt;FAQAccordion /&gt;
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#BAE8E8]/50">
              <Link href="/library?category=Blocks" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#272343] hover:text-[#0D6E6E] transition-colors">
                <span>Jelajahi Blok Landing</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Bento Card 4: Clean Code & Syntax Terminal (4 Cols) */}
          <div className="md:col-span-1 lg:col-span-4 group relative rounded-3xl bg-white border border-[#BAE8E8] p-6 sm:p-7 flex flex-col justify-between overflow-hidden shadow-soft-sm hover:shadow-soft-md hover:border-[#272343]/30 transition-all duration-300">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-xl bg-[#E3F6F5] text-[#272343] flex items-center justify-center border border-[#BAE8E8]">
                <Code2 className="h-5 w-5" />
              </div>

              <div>
                <h4 className="text-h4 text-[#272343] mb-1.5 group-hover:text-[#0D6E6E] transition-colors">
                  Clean Code & Bebas Dependensi
                </h4>
                <p className="text-body-small text-[#2D334A]/80">
                  Ditulis terstruktur rapi tanpa dependensi runtime tersembunyi. Langsung tempel ke proyek Next.js / Vite Anda.
                </p>
              </div>

              {/* Code Snippet Box with Copy Button */}
              <div className="p-3 rounded-xl bg-[#272343] text-[#E3F6F5] font-mono text-[11px] flex items-center justify-between shadow-soft-xs">
                <span className="truncate pr-2 text-[#FFD803]">
                  npx jakdev-ui add button
                </span>
                <button
                  type="button"
                  onClick={handleCopySnippet}
                  className="p-1 rounded bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Salin Perintah"
                >
                  {copiedSnippet ? (
                    <Check className="h-3.5 w-3.5 text-[#3ECF8E]" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#BAE8E8]/50">
              <Link href="/library" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#272343] hover:text-[#0D6E6E] transition-colors">
                <span>Pelajari Cara Penggunaan</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Bento Card 5: Template Halaman Lengkap (4 Cols) */}
          <div className="md:col-span-2 lg:col-span-4 group relative rounded-3xl bg-white border border-[#BAE8E8] p-6 sm:p-7 flex flex-col justify-between overflow-hidden shadow-soft-sm hover:shadow-soft-md hover:border-[#272343]/30 transition-all duration-300">
            <div className="space-y-4">
              <div className="h-10 w-10 rounded-xl bg-[#E3F6F5] text-[#0D6E6E] flex items-center justify-center border border-[#BAE8E8]">
                <Cpu className="h-5 w-5" />
              </div>

              <div>
                <h4 className="text-h4 text-[#272343] mb-1.5 group-hover:text-[#0D6E6E] transition-colors">
                  Template Halaman Siap Deploy
                </h4>
                <p className="text-body-small text-[#2D334A]/80">
                  Layout website utuh untuk Landing Page SaaS, Portofolio Developer, Dokumentasi, hingga Blog Tech modern.
                </p>
              </div>

              {/* Viewport Support Indicator */}
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#E3F6F5]/50 border border-[#BAE8E8]/70">
                <div className="flex items-center gap-1 text-[11px] font-mono text-[#272343] font-semibold">
                  <Monitor className="h-3.5 w-3.5 text-[#0D6E6E]" />
                  <span>Desktop</span>
                </div>
                <span className="text-[#BAE8E8]">·</span>
                <div className="flex items-center gap-1 text-[11px] font-mono text-[#272343] font-semibold">
                  <Tablet className="h-3.5 w-3.5 text-[#0D6E6E]" />
                  <span>Tablet</span>
                </div>
                <span className="text-[#BAE8E8]">·</span>
                <div className="flex items-center gap-1 text-[11px] font-mono text-[#272343] font-semibold">
                  <Smartphone className="h-3.5 w-3.5 text-[#0D6E6E]" />
                  <span>Mobile</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#BAE8E8]/50">
              <Link href="/library?category=Pages" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#272343] hover:text-[#0D6E6E] transition-colors">
                <span>Lihat Template Halaman</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Explore All CTA Banner with Molten Metal Animated WebGL Canvas */}
        <div className="mt-12 relative rounded-3xl overflow-hidden border border-[#272343]/30 bg-[#272343] p-8 sm:p-14 text-center shadow-soft-md group">
          {/* Molten Metal Animated Canvas Background */}
          <div className="absolute inset-0 pointer-events-none opacity-85 mix-blend-screen">
            <MoltenMetal
              color1="#0D6E6E"
              color2="#E3F6F5"
              color3="#FFFFFF"
              speed={0.4}
              scale={12}
              detail={3}
              glow={1.6}
              coreSize={0.1}
              swirl={1}
              fold={-0.2}
              blackPoint={0.05}
              brightness={1.3}
              colorMode="molten"
              grain={true}
              grainIntensity={0.05}
              mouseInteraction={true}
              mouseStrength={0.3}
              opacity={0.9}
            />
          </div>

          {/* Soft Dark Overlay for Contrast & Readability */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#272343]/90 via-[#272343]/50 to-[#272343]/80" />

          {/* Banner Content */}
          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">

            <h3 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#FFFFFF] tracking-tight leading-snug drop-shadow-md">
              Siap Mempercepat Pembuatan Website Anda?
            </h3>
            <p className="font-sans text-sm sm:text-base text-[#E3F6F5] max-w-xl mx-auto leading-relaxed drop-shadow-sm font-medium">
              Jelajahi seluruh katalog kami sekarang dengan fitur pencarian instan, filter interaktif, pratinjau langsung, dan salin kode dalam hitungan detik.
            </p>
            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
              <Button asChild variant="primary" size="lg" className="shadow-soft-md hover:scale-105 active:scale-95 transition-all text-[#272343] font-bold">
                <Link href="/library" className="flex items-center gap-2">
                  <span>Buka Seluruh Pustaka JakDev</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
