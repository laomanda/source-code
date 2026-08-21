import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { TechMarquee } from "@/components/landing/tech-marquee";
import { ResourceShowcase } from "@/components/landing/resource-showcase";
import { Introduction } from "@/components/landing/introduction";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { DeveloperSuggestion } from "@/components/landing/developer-suggestion";
import { Support } from "@/components/landing/support";
import { Footer } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "JakDev",
  description:
    "Discover, preview, and copy free source code for modern web interfaces. Reusable UI components, blocks, and templates built with HTML, Tailwind CSS, React, and TypeScript.",
  openGraph: {
    title: "JakDev",
    description:
      "Discover, preview, and copy free source code for modern web interfaces.",
    type: "website",
  },
};

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-[#FFD803] selection:text-[#272343]">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TechMarquee />
        <ResourceShowcase />
        <Introduction />
        <TestimonialsSection />
        <DeveloperSuggestion />
        <Support />
      </main>
      <Footer />
    </div>
  );
}
