"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { ArrowRight, Layers } from "lucide-react";

export type ShowcaseResource = {
  id: string;
  title: string;
  category: "Components" | "Blocks" | "Pages";
  technology: string;
  description: string;
  previewSnippet: string;
  responsive: string;
};

const SAMPLE_RESOURCES: ShowcaseResource[] = [
  {
    id: "stagger-button",
    title: "Interactive Stagger Button",
    category: "Components",
    technology: "React · Tailwind",
    description: "Modern action button with smooth hover translation and tactile click feedback.",
    previewSnippet: "<Button variant='primary'>Discover Code</Button>",
    responsive: "D · T · M",
  },
  {
    id: "ambient-hero",
    title: "Hero with Ambient Canvas",
    category: "Blocks",
    technology: "Next.js · TypeScript",
    description: "High-impact hero block featuring lightweight particle nodes and clean typography.",
    previewSnippet: "<Hero title='Free source code' />",
    responsive: "D · T · M",
  },
  {
    id: "pricing-card-matrix",
    title: "Responsive Pricing Table",
    category: "Blocks",
    technology: "React · Tailwind",
    description: "Feature comparison cards with billing frequency toggles and highlighted primary plan.",
    previewSnippet: "<PricingMatrix tiers={tiers} />",
    responsive: "D · T · M",
  },
  {
    id: "developer-landing-template",
    title: "Developer Portfolio Page",
    category: "Pages",
    technology: "Next.js · TypeScript",
    description: "Complete modern landing layout designed specifically for engineers and designers.",
    previewSnippet: "<PortfolioLayout projects={items} />",
    responsive: "D · T · M",
  },
  {
    id: "floating-navbar",
    title: "Floating Backdrop Navbar",
    category: "Components",
    technology: "React · TypeScript",
    description: "Sticky floating navigation bar with soft border blur and mobile drawer support.",
    previewSnippet: "<FloatingNavbar brand='JakDev' />",
    responsive: "D · T · M",
  },
  {
    id: "faq-accordion",
    title: "Clean FAQ Accordion",
    category: "Blocks",
    technology: "Tailwind CSS · HTML",
    description: "Accessible collapsible accordion with smooth CSS height transitions and chevron feedback.",
    previewSnippet: "<Accordion items={faqs} />",
    responsive: "D · T · M",
  },
];

export function ResourceShowcase() {
  const [activeCategory, setActiveCategory] = React.useState<"All" | "Components" | "Blocks" | "Pages">("All");

  const filteredResources = React.useMemo(() => {
    if (activeCategory === "All") return SAMPLE_RESOURCES;
    return SAMPLE_RESOURCES.filter((r) => r.category === activeCategory);
  }, [activeCategory]);

  return (
    <Section id="showcase" spacing="default" className="bg-[#FFFFFF]">
      <Container size="xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#272343] uppercase tracking-wider">
              <Layers className="h-4 w-4 text-[#FFD803]" />
              <span>Resource Catalog</span>
            </div>
            <h2 className="text-h2">What You Can Find Inside JakDev</h2>
            <p className="text-body text-[#2D334A]/80">
              Ready-to-use snippets crafted with clean HTML, CSS, React, and TypeScript. Fully copyable with no locked tiers.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-lg bg-[#E3F6F5]/70 border border-[#BAE8E8]">
            {(["All", "Components", "Blocks", "Pages"] as const).map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#272343] ${
                  activeCategory === category
                    ? "bg-[#FFD803] text-[#272343] shadow-soft-sm font-bold"
                    : "text-[#2D334A] hover:bg-white/80 hover:text-[#272343]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Resource Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((resource) => (
            <Card
              key={resource.id}
              interactive
              className="flex flex-col justify-between group hover:border-[#8CD3D3]"
            >
              <div>
                {/* Visual Preview Box */}
                <div className="h-36 w-full rounded-t-lg bg-gradient-to-b from-[#E3F6F5]/50 to-[#E3F6F5]/20 border-b border-[#BAE8E8]/70 p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <Badge variant="navy" size="sm">{resource.category}</Badge>
                    <span className="font-mono text-[11px] text-[#2D334A]/60">{resource.responsive}</span>
                  </div>
                  <div className="p-2.5 rounded bg-white border border-[#BAE8E8] shadow-soft-sm font-mono text-[11px] text-[#272343] truncate">
                    {resource.previewSnippet}
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-1">
                    <Badge variant="secondary" size="sm">{resource.technology}</Badge>
                  </div>
                  <CardTitle className="text-lg group-hover:text-[#272343] transition-colors">
                    {resource.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {resource.description}
                  </CardDescription>
                </CardHeader>
              </div>

              <CardFooter className="pt-2 border-t border-[#BAE8E8]/40 justify-between">
                <span className="text-[11px] font-mono text-[#0D6E6E] font-medium">Free Source Code</span>
                <Button asChild size="sm" variant="outline" className="group-hover:border-[#272343]">
                  <Link href="/library" className="flex items-center gap-1.5">
                    <span>View in Library</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Explore All CTA Banner */}
        <div className="mt-12 p-8 rounded-xl border border-[#BAE8E8] bg-[#E3F6F5]/40 text-center space-y-4 shadow-soft-sm">
          <h3 className="text-h3">Looking for more components & templates?</h3>
          <p className="text-body-small text-[#2D334A]/80 max-w-xl mx-auto">
            Browse our complete catalog with search, category filtering, responsive viewports, and one-click code copy.
          </p>
          <div>
            <Button asChild variant="primary" size="default">
              <Link href="/library" className="flex items-center gap-2">
                <span>Explore Full Library</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
