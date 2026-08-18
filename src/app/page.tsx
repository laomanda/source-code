import type { Metadata } from "next";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { ResourceShowcase } from "@/components/landing/resource-showcase";
import { Introduction } from "@/components/landing/introduction";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Support } from "@/components/landing/support";
import { Footer } from "@/components/landing/footer";

export const metadata: Metadata = {
  title: "JakDev — Free Source Code Library for Developers",
  description:
    "Discover, preview, and copy free source code for modern web interfaces. Reusable UI components, blocks, and templates built with HTML, Tailwind CSS, React, and TypeScript.",
  openGraph: {
    title: "JakDev — Free Source Code Library for Developers",
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
        <ResourceShowcase />
        <Introduction />
        <HowItWorks />
        <Support />
      </main>
      <Footer />
    </div>
  );
}
