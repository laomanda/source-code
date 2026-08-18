import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Separator } from "@/components/ui/separator";
import {
  Copy,
  Code,
  Eye,
  Check,
  Search,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export const metadata = {
  title: "JakDev — Design System Playground",
  description: "Internal visual testing ground for JakDev design tokens, typography, and base components.",
};

export default function DesignSystemPlaygroundPage() {
  return (
    <main className="min-h-screen bg-background pb-24">
      {/* Header Bar */}
      <header className="border-b border-[#BAE8E8] bg-white sticky top-0 z-50 shadow-soft-sm">
        <Container size="xl" className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-[#FFD803] flex items-center justify-center font-heading font-black text-[#272343] text-lg shadow-soft-sm">
              J
            </div>
            <div>
              <span className="font-heading font-bold text-lg text-[#272343] tracking-tight">
                JakDev
              </span>
              <span className="ml-2 text-xs font-medium text-[#2D334A]/60 bg-[#E3F6F5] px-2 py-0.5 rounded border border-[#BAE8E8]">
                Design System v1.0
              </span>
            </div>
          </div>
          <Badge variant="secondary" className="font-mono text-[11px]">
            INTERNAL TESTING ONLY
          </Badge>
        </Container>
      </header>

      <Container size="xl">
        {/* Intro */}
        <Section spacing="sm">
          <div className="max-w-3xl space-y-2">
            <h1 className="text-h1">Design System & Visual Foundation</h1>
            <p className="text-body-large text-[#2D334A]">
              Authoritative design tokens, typography scale, surface semantics, and foundational UI primitives built for JakDev.
            </p>
          </div>
        </Section>

        <Separator />

        {/* 1. Official Colors */}
        <Section spacing="sm" id="colors">
          <div className="space-y-4">
            <div>
              <h2 className="text-h2">1. Color System</h2>
              <p className="text-body-small text-[#2D334A]/80">
                Light-mode only palette curated for calm developer experiences and intentional accent highlights.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* White */}
              <div className="rounded-lg border border-[#BAE8E8] bg-white p-4 shadow-soft">
                <div className="h-16 w-full rounded border border-slate-200 bg-[#FFFFFF] shadow-inner mb-3" />
                <p className="font-heading font-bold text-xs text-[#272343]">Background</p>
                <p className="font-mono text-xs text-[#2D334A]/70">#FFFFFF</p>
                <p className="text-[11px] text-[#2D334A]/60 mt-1">Page background, cards</p>
              </div>

              {/* Deep Navy */}
              <div className="rounded-lg border border-[#BAE8E8] bg-white p-4 shadow-soft">
                <div className="h-16 w-full rounded bg-[#272343] mb-3" />
                <p className="font-heading font-bold text-xs text-[#272343]">Primary / Headline</p>
                <p className="font-mono text-xs text-[#2D334A]/70">#272343</p>
                <p className="text-[11px] text-[#2D334A]/60 mt-1">Headings, anchors, brand</p>
              </div>

              {/* Paragraph Navy */}
              <div className="rounded-lg border border-[#BAE8E8] bg-white p-4 shadow-soft">
                <div className="h-16 w-full rounded bg-[#2D334A] mb-3" />
                <p className="font-heading font-bold text-xs text-[#272343]">Secondary / Body</p>
                <p className="font-mono text-xs text-[#2D334A]/70">#2D334A</p>
                <p className="text-[11px] text-[#2D334A]/60 mt-1">Paragraphs, descriptions</p>
              </div>

              {/* Accent Yellow */}
              <div className="rounded-lg border border-[#BAE8E8] bg-white p-4 shadow-soft">
                <div className="h-16 w-full rounded bg-[#FFD803] mb-3" />
                <p className="font-heading font-bold text-xs text-[#272343]">Primary Accent</p>
                <p className="font-mono text-xs text-[#2D334A]/70">#FFD803</p>
                <p className="text-[11px] text-[#2D334A]/60 mt-1">CTA buttons, highlights</p>
              </div>

              {/* Soft Cyan */}
              <div className="rounded-lg border border-[#BAE8E8] bg-white p-4 shadow-soft">
                <div className="h-16 w-full rounded bg-[#E3F6F5] border border-[#BAE8E8] mb-3" />
                <p className="font-heading font-bold text-xs text-[#272343]">Soft Cyan</p>
                <p className="font-mono text-xs text-[#2D334A]/70">#E3F6F5</p>
                <p className="text-[11px] text-[#2D334A]/60 mt-1">Surfaces, badges, 3D ambient</p>
              </div>

              {/* Light Cyan */}
              <div className="rounded-lg border border-[#BAE8E8] bg-white p-4 shadow-soft">
                <div className="h-16 w-full rounded bg-[#BAE8E8] mb-3" />
                <p className="font-heading font-bold text-xs text-[#272343]">Light Cyan</p>
                <p className="font-mono text-xs text-[#2D334A]/70">#BAE8E8</p>
                <p className="text-[11px] text-[#2D334A]/60 mt-1">Borders, input outlines</p>
              </div>
            </div>
          </div>
        </Section>

        <Separator />

        {/* 2. Typography Scale */}
        <Section spacing="sm" id="typography">
          <div className="space-y-6">
            <div>
              <h2 className="text-h2">2. Typography System</h2>
              <p className="text-body-small text-[#2D334A]/80">
                Strict hierarchy: <strong>Geist</strong> for Headings, <strong>Inter</strong> for Body UI, and <strong>JetBrains Mono</strong> exclusively for Code.
              </p>
            </div>

            <div className="space-y-4 rounded-lg border border-[#BAE8E8] bg-white p-6 shadow-soft">
              <div className="border-b border-[#BAE8E8]/60 pb-4">
                <span className="font-mono text-xs text-[#2D334A]/60 block mb-1">Display · Geist Black</span>
                <p className="text-display">Free source code for modern interfaces.</p>
              </div>

              <div className="border-b border-[#BAE8E8]/60 pb-4">
                <span className="font-mono text-xs text-[#2D334A]/60 block mb-1">H1 · Geist Bold</span>
                <p className="text-h1">Explore Clean, Reusable UI Components</p>
              </div>

              <div className="border-b border-[#BAE8E8]/60 pb-4">
                <span className="font-mono text-xs text-[#2D334A]/60 block mb-1">H2 · Geist Bold</span>
                <p className="text-h2">Curated Category Blocks & Sections</p>
              </div>

              <div className="border-b border-[#BAE8E8]/60 pb-4">
                <span className="font-mono text-xs text-[#2D334A]/60 block mb-1">H3 · Geist SemiBold</span>
                <p className="text-h3">Interactive Animated Hero Component</p>
              </div>

              <div className="border-b border-[#BAE8E8]/60 pb-4">
                <span className="font-mono text-xs text-[#2D334A]/60 block mb-1">H4 · Geist SemiBold</span>
                <p className="text-h4">Responsive Viewport Configuration</p>
              </div>

              <div className="border-b border-[#BAE8E8]/60 pb-4">
                <span className="font-mono text-xs text-[#2D334A]/60 block mb-1">Body Large · Inter Regular</span>
                <p className="text-body-large">
                  JakDev provides free components, sections, pages, and templates that web developers can preview and use directly in their projects.
                </p>
              </div>

              <div className="border-b border-[#BAE8E8]/60 pb-4">
                <span className="font-mono text-xs text-[#2D334A]/60 block mb-1">Body · Inter Regular</span>
                <p className="text-body">
                  The core philosophy is Browse, Preview, Copy, and Build. No complex repository setups or registration required.
                </p>
              </div>

              <div className="border-b border-[#BAE8E8]/60 pb-4">
                <span className="font-mono text-xs text-[#2D334A]/60 block mb-1">Body Small & Caption · Inter</span>
                <p className="text-body-small">
                  Last updated 2 hours ago · Published by Administrator
                </p>
                <p className="text-caption mt-1">
                  * Responsive preview settings are configured manually per resource.
                </p>
              </div>

              <div>
                <span className="font-mono text-xs text-[#2D334A]/60 block mb-1">Code · JetBrains Mono (Technical Only)</span>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-code">const resource = await getResourceBySlug(slug);</span>
                  <span className="text-code">npm install lucide-react</span>
                  <span className="text-code">border-[#BAE8E8]</span>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Separator />

        {/* 3. Button System */}
        <Section spacing="sm" id="buttons">
          <div className="space-y-6">
            <div>
              <h2 className="text-h2">3. Button System</h2>
              <p className="text-body-small text-[#2D334A]/80">
                Primary CTA with Electric Yellow, supporting Navy & Soft Cyan variants, with accessible focus and hover states.
              </p>
            </div>

            <div className="rounded-lg border border-[#BAE8E8] bg-white p-6 shadow-soft space-y-6">
              {/* Variants */}
              <div>
                <h4 className="text-sm font-semibold text-[#272343] mb-3">Variants</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary">
                    <Sparkles className="h-4 w-4" />
                    Primary Action
                  </Button>
                  <Button variant="navy">
                    <Layers className="h-4 w-4" />
                    Navy Action
                  </Button>
                  <Button variant="secondary">
                    <Code className="h-4 w-4" />
                    Secondary Action
                  </Button>
                  <Button variant="outline">
                    <Eye className="h-4 w-4" />
                    Outline Button
                  </Button>
                  <Button variant="ghost">
                    Ghost Button
                  </Button>
                  <Button variant="destructive">
                    Delete Resource
                  </Button>
                </div>
              </div>

              {/* Sizes */}
              <div>
                <h4 className="text-sm font-semibold text-[#272343] mb-3">Sizes</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm" variant="primary">Small (sm)</Button>
                  <Button size="default" variant="primary">Default (h-10)</Button>
                  <Button size="lg" variant="primary">
                    Large Hero CTA (lg)
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline" aria-label="Copy code">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button size="icon-sm" variant="secondary" aria-label="Check">
                    <Check className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* States */}
              <div>
                <h4 className="text-sm font-semibold text-[#272343] mb-3">Interactive States</h4>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="primary">Normal</Button>
                  <Button variant="primary" disabled>Disabled State</Button>
                  <Button variant="outline" disabled>Disabled Outline</Button>
                  <Button variant="secondary" className="ring-2 ring-[#272343] ring-offset-2">Simulated Focus</Button>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Separator />

        {/* 4. Badge System */}
        <Section spacing="sm" id="badges">
          <div className="space-y-6">
            <div>
              <h2 className="text-h2">4. Badge System</h2>
              <p className="text-body-small text-[#2D334A]/80">
                Lightweight tags for technologies, categories, responsive viewport badges, and publishing status.
              </p>
            </div>

            <div className="rounded-lg border border-[#BAE8E8] bg-white p-6 shadow-soft space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-[#272343] mb-2">Technologies & Categories</h4>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">React</Badge>
                  <Badge variant="secondary">TypeScript</Badge>
                  <Badge variant="secondary">Tailwind CSS</Badge>
                  <Badge variant="secondary">Next.js</Badge>
                  <Badge variant="secondary">HTML / CSS</Badge>
                  <Badge variant="navy">Components</Badge>
                  <Badge variant="navy">Blocks</Badge>
                  <Badge variant="navy">Pages</Badge>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-[#272343] mb-2">Status & Accent Badges</h4>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="default">Featured</Badge>
                  <Badge variant="success">Published</Badge>
                  <Badge variant="warning">Draft Mode</Badge>
                  <Badge variant="outline">Desktop Only</Badge>
                  <Badge variant="outline">Responsive (D / T / M)</Badge>
                  <Badge variant="muted">v1.2.0</Badge>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-[#272343] mb-2">Sizes</h4>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge size="sm" variant="secondary">Small Badge</Badge>
                  <Badge size="default" variant="secondary">Default Badge</Badge>
                  <Badge size="lg" variant="default">Large Badge</Badge>
                </div>
              </div>
            </div>
          </div>
        </Section>

        <Separator />

        {/* 5. Card System */}
        <Section spacing="sm" id="cards">
          <div className="space-y-6">
            <div>
              <h2 className="text-h2">5. Card System</h2>
              <p className="text-body-small text-[#2D334A]/80">
                Clean surface, subtle border, gentle shadow, and controlled hover elevation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Standard Base Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">UI Primitive</Badge>
                    <span className="text-caption">Static</span>
                  </div>
                  <CardTitle className="mt-2">Standard Card Primitive</CardTitle>
                  <CardDescription>
                    Base card surface using white background, #BAE8E8 subtle border, and soft elevation shadow.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-body-small">
                    Provides clean spatial separation without aggressive borders or noisy gradients.
                  </p>
                </CardContent>
                <CardFooter className="justify-between border-t border-[#BAE8E8]/50 pt-4">
                  <span className="text-caption">Card Footer</span>
                  <Button size="sm" variant="outline">Learn More</Button>
                </CardFooter>
              </Card>

              {/* Interactive Card */}
              <Card interactive className="cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="default">Interactive</Badge>
                    <span className="text-caption">Hover Elevation</span>
                  </div>
                  <CardTitle className="mt-2">Interactive Card State</CardTitle>
                  <CardDescription>
                    Responds with gentle border highlight and soft elevation shadow upon user interaction.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-body-small">
                    Hover over this card to preview the subtle 200ms transition tailored for resource discovery cards.
                  </p>
                </CardContent>
                <CardFooter className="justify-between border-t border-[#BAE8E8]/50 pt-4">
                  <span className="text-caption text-[#0D6E6E] font-medium">Ready for Library Grid</span>
                  <Button size="sm" variant="primary">
                    View Resource
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </Section>

        <Separator />

        {/* 6. Input System */}
        <Section spacing="sm" id="inputs">
          <div className="space-y-6">
            <div>
              <h2 className="text-h2">6. Input System</h2>
              <p className="text-body-small text-[#2D334A]/80">
                Inputs with explicit focus indicators, clean placeholder text, and error states.
              </p>
            </div>

            <div className="rounded-lg border border-[#BAE8E8] bg-white p-6 shadow-soft grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#272343]">Default Search Input</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2D334A]/50" />
                  <Input placeholder="Search components, blocks, tags..." className="pl-9" />
                </div>
                <p className="text-caption">Used in global library search.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#272343]">Active / Focused Input</label>
                <Input defaultValue="react-navbar-animated" />
                <p className="text-caption">Visible 2px navy focus ring with 1px offset.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#272343]">Error Validation State</label>
                <Input error defaultValue="invalid-slug-format@@" />
                <p className="text-xs text-red-600 font-medium">Slug may only contain letters, numbers, and hyphens.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#272343]">Disabled Input</label>
                <Input disabled defaultValue="System Generated Slug" />
                <p className="text-caption">Disabled state with clear reduced opacity.</p>
              </div>
            </div>
          </div>
        </Section>

        <Separator />

        {/* 7. Surface & Elevation Semantics */}
        <Section spacing="sm" id="surfaces">
          <div className="space-y-6">
            <div>
              <h2 className="text-h2">7. Surfaces & Elevation Hierarchy</h2>
              <p className="text-body-small text-[#2D334A]/80">
                Strict light mode surface rules for background, panels, and elevated containers.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Page Background */}
              <div className="rounded-lg border border-slate-200 bg-[#FFFFFF] p-6 shadow-soft">
                <h4 className="text-base font-bold text-[#272343] mb-1">Base Surface</h4>
                <p className="text-xs font-mono text-[#2D334A]/70 mb-3">bg-background (#FFFFFF)</p>
                <p className="text-body-small">
                  Primary canvas for page layouts, clean cards, and preview frames.
                </p>
              </div>

              {/* Soft Cyan Tinted Surface */}
              <div className="rounded-lg border border-[#BAE8E8] bg-[#E3F6F5]/70 p-6 shadow-soft">
                <h4 className="text-base font-bold text-[#272343] mb-1">Muted / Soft Surface</h4>
                <p className="text-xs font-mono text-[#2D334A]/70 mb-3">bg-[#E3F6F5] (Soft Cyan)</p>
                <p className="text-body-small">
                  Used for subtle section backgrounds, category pills, and code container badges.
                </p>
              </div>

              {/* Elevated Surface */}
              <div className="rounded-lg border border-[#BAE8E8] bg-white p-6 shadow-soft-md">
                <h4 className="text-base font-bold text-[#272343] mb-1">Elevated Surface</h4>
                <p className="text-xs font-mono text-[#2D334A]/70 mb-3">shadow-soft-md</p>
                <p className="text-body-small">
                  Used for dropdowns, tooltips, dialogs, and active interactive cards.
                </p>
              </div>
            </div>
          </div>
        </Section>

        <Separator />

        {/* 8. Accessibility & Responsiveness Checklist */}
        <Section spacing="sm">
          <Card className="bg-[#E3F6F5]/40 border-[#BAE8E8]">
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-[#272343]" />
                <CardTitle className="text-lg">Design System Quality & Accessibility Audit</CardTitle>
              </div>
              <CardDescription>
                Compliance verification with JakDev authoritative design rules.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Light Mode Only:</strong> No dark mode classes or theme toggle.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Typography Isolation:</strong> JetBrains Mono is strictly scoped to code.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Color Integrity:</strong> #FFFFFF, #272343, #2D334A, #FFD803, #E3F6F5, #BAE8E8.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Focus Rings:</strong> 2px solid #272343 focus ring with 1px/2px offset.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Accessible HTML:</strong> Semantic section, header, button, input elements.</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Responsive Scale:</strong> Fluid typography and max-w container breakpoints.</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </Section>
      </Container>
    </main>
  );
}
