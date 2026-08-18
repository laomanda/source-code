import { Resource } from "@/types";

export const SAMPLE_LIBRARY_RESOURCES: Resource[] = [
  {
    id: "stagger-button",
    title: "Interactive Stagger Button",
    slug: "interactive-stagger-button",
    description:
      "Modern action button with smooth hover translation, subtle scale, and tactile active feedback.",
    category: "Components",
    technology: "React · Tailwind",
    tags: ["button", "interaction", "hover", "ui", "cva"],
    sourceCode: `import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-semibold text-sm transition-all duration-150 active:scale-95 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-[#FFD803] text-[#272343] hover:bg-[#F2CD00] shadow-sm",
        secondary: "bg-[#E3F6F5] text-[#272343] border border-[#BAE8E8] hover:bg-[#D5F0EF]",
        navy: "bg-[#272343] text-white hover:bg-[#1E1B35]",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        default: "h-10 px-4 py-2",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export function StaggerButton({
  children,
  variant,
  size,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>) {
  return (
    <button className={buttonVariants({ variant, size })} {...props}>
      {children}
    </button>
  );
}`,
    previewHtml: `<div class="flex items-center justify-center p-8 bg-white min-h-[220px]">
  <button class="inline-flex items-center justify-center gap-2 rounded-md font-semibold text-sm h-10 px-5 bg-[#FFD803] text-[#272343] hover:bg-[#F2CD00] active:scale-95 transition-all shadow-sm">
    <span>Click Interaction</span>
    <span class="font-bold">→</span>
  </button>
</div>`,
    responsive: { desktop: true, tablet: true, mobile: true },
    status: "published",
    createdAt: "2026-08-15T10:00:00Z",
  },
  {
    id: "floating-navbar",
    title: "Responsive Floating Backdrop Navbar",
    slug: "responsive-floating-navbar",
    description:
      "Sticky floating navigation bar with soft border blur, active link states, and responsive mobile drawer.",
    category: "Components",
    technology: "React · TypeScript",
    tags: ["navigation", "navbar", "header", "responsive", "drawer"],
    sourceCode: `import * as React from "react";
import Link from "next/link";

export function FloatingNavbar() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="sticky top-4 z-50 mx-auto max-w-5xl px-4">
      <div className="flex h-14 items-center justify-between rounded-xl border border-[#BAE8E8] bg-white/90 px-6 backdrop-blur-md shadow-sm">
        <span className="font-bold text-lg text-[#272343]">Brand</span>
        <nav className="hidden md:flex items-center gap-6 text-sm text-[#2D334A]">
          <Link href="#features">Features</Link>
          <Link href="#pricing">Pricing</Link>
        </nav>
      </div>
    </header>
  );
}`,
    previewHtml: `<div class="p-6 bg-slate-50 min-h-[220px] flex items-center justify-center">
  <div class="w-full max-w-md flex h-12 items-center justify-between rounded-xl border border-[#BAE8E8] bg-white px-4 shadow-sm">
    <div class="flex items-center gap-2">
      <div class="h-6 w-6 rounded bg-[#FFD803] flex items-center justify-center text-xs font-black text-[#272343]">J</div>
      <span class="font-bold text-sm text-[#272343]">Navbar</span>
    </div>
    <div class="flex gap-2">
      <span class="text-xs text-[#2D334A] font-medium px-2 py-1 bg-[#E3F6F5] rounded">Active</span>
    </div>
  </div>
</div>`,
    responsive: { desktop: true, tablet: true, mobile: true },
    status: "published",
    createdAt: "2026-08-16T11:00:00Z",
  },
  {
    id: "ambient-hero",
    title: "Ambient Canvas Hero Block",
    slug: "ambient-canvas-hero-block",
    description:
      "High-impact hero block featuring lightweight particle nodes, responsive headline, and dual call-to-actions.",
    category: "Blocks",
    technology: "Next.js · TypeScript",
    tags: ["hero", "canvas", "particles", "landing", "cta"],
    sourceCode: `export function HeroBlock() {
  return (
    <section className="py-20 text-center bg-white border-b border-[#BAE8E8]">
      <div className="max-w-3xl mx-auto px-4 space-y-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#272343] tracking-tight">
          Modern Web Development
        </h1>
        <p className="text-lg text-[#2D334A]">Clean code ready for copy and deployment.</p>
      </div>
    </section>
  );
}`,
    previewHtml: `<div class="p-8 bg-gradient-to-b from-[#E3F6F5]/40 to-white text-center border border-[#BAE8E8] rounded-lg">
  <span class="text-[10px] font-mono font-bold bg-[#FFD803] text-[#272343] px-2 py-0.5 rounded">NEW BLOCK</span>
  <h3 class="text-lg font-bold text-[#272343] mt-2">Ambient Hero Preview</h3>
  <p class="text-xs text-[#2D334A]/80 mt-1">Lightweight canvas particle integration.</p>
</div>`,
    responsive: { desktop: true, tablet: true, mobile: true },
    status: "published",
    createdAt: "2026-08-16T14:30:00Z",
  },
  {
    id: "pricing-matrix",
    title: "Modern SaaS Pricing Matrix",
    slug: "modern-saas-pricing-matrix",
    description:
      "Feature comparison cards with billing frequency toggles, clear pricing tiers, and highlighted primary plan.",
    category: "Blocks",
    technology: "React · Tailwind",
    tags: ["pricing", "cards", "saas", "table", "billing"],
    sourceCode: `export function PricingMatrix() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Pricing Tier Cards */}
    </div>
  );
}`,
    previewHtml: `<div class="p-4 bg-white grid grid-cols-2 gap-3 min-h-[220px] items-center">
  <div class="border border-[#BAE8E8] rounded-lg p-3 text-left space-y-1">
    <span class="text-xs font-bold text-[#272343]">Starter</span>
    <p class="text-base font-black text-[#272343]">$0</p>
    <p class="text-[10px] text-[#2D334A]/70">Free forever</p>
  </div>
  <div class="border-2 border-[#FFD803] bg-[#E3F6F5]/20 rounded-lg p-3 text-left space-y-1 shadow-sm">
    <span class="text-xs font-bold text-[#272343]">Pro Plan</span>
    <p class="text-base font-black text-[#272343]">$19</p>
    <p class="text-[10px] text-[#2D334A]/70">All features included</p>
  </div>
</div>`,
    responsive: { desktop: true, tablet: true, mobile: true },
    status: "published",
    createdAt: "2026-08-17T09:15:00Z",
  },
  {
    id: "faq-accordion",
    title: "Clean Accessible FAQ Accordion",
    slug: "clean-accessible-faq-accordion",
    description:
      "Accessible collapsible accordion with smooth height transitions and subtle chevron rotation.",
    category: "Blocks",
    technology: "Tailwind CSS · HTML",
    tags: ["accordion", "faq", "collapsible", "details", "accessible"],
    sourceCode: `<details class="group rounded-lg border border-[#BAE8E8] bg-white p-4">
  <summary class="flex cursor-pointer list-none items-center justify-between font-semibold text-[#272343]">
    <span>Is JakDev completely free?</span>
    <span class="transition group-open:rotate-180">▼</span>
  </summary>
  <p class="mt-3 text-sm text-[#2D334A]/80 leading-relaxed">
    Yes! All source code is completely free to use in personal and commercial projects.
  </p>
</details>`,
    previewHtml: `<div class="p-4 bg-white space-y-2 min-h-[220px] flex flex-col justify-center">
  <div class="border border-[#BAE8E8] rounded-md p-3 text-left">
    <div class="flex justify-between text-xs font-bold text-[#272343]">
      <span>Can I copy the code directly?</span>
      <span>▼</span>
    </div>
    <p class="text-[11px] text-[#2D334A]/70 mt-1">Yes, one click to clipboard with full license freedom.</p>
  </div>
</div>`,
    responsive: { desktop: true, tablet: true, mobile: true },
    status: "published",
    createdAt: "2026-08-17T12:00:00Z",
  },
  {
    id: "developer-portfolio",
    title: "Developer Portfolio Template",
    slug: "developer-portfolio-template",
    description:
      "Complete modern portfolio page layout designed specifically for software engineers and designers.",
    category: "Pages",
    technology: "Next.js · TypeScript",
    tags: ["portfolio", "resume", "developer", "showcase", "projects"],
    sourceCode: `export function PortfolioPage() {
  return (
    <main className="max-w-5xl mx-auto py-12 px-4 space-y-16">
      {/* About, Projects, Experience, Contact */}
    </main>
  );
}`,
    previewHtml: `<div class="p-4 bg-white border border-[#BAE8E8] rounded-lg text-left space-y-2 min-h-[220px]">
  <div class="h-8 w-8 rounded-full bg-[#FFD803] flex items-center justify-center text-xs font-bold">JD</div>
  <p class="text-xs font-bold text-[#272343]">John Doe · Fullstack Dev</p>
  <p class="text-[11px] text-[#2D334A]/70">Building fast web experiences with React & Next.js.</p>
</div>`,
    responsive: { desktop: true, tablet: true, mobile: true },
    status: "published",
    createdAt: "2026-08-17T16:40:00Z",
  },
  {
    id: "auth-card",
    title: "Split-Screen Authentication Card",
    slug: "split-screen-auth-card",
    description:
      "Minimalist login and signup form card with input validation indicators and social provider buttons.",
    category: "Blocks",
    technology: "React · Tailwind",
    tags: ["auth", "login", "signup", "form", "input"],
    sourceCode: `export function AuthCard() {
  return (
    <div className="max-w-md mx-auto p-6 rounded-xl border border-[#BAE8E8] bg-white shadow-sm space-y-4">
      <h2 className="text-xl font-bold text-[#272343]">Welcome back</h2>
      {/* Form inputs */}
    </div>
  );
}`,
    previewHtml: `<div class="p-4 bg-slate-50 flex items-center justify-center min-h-[220px]">
  <div class="w-full max-w-xs p-4 bg-white border border-[#BAE8E8] rounded-lg space-y-2 text-left shadow-sm">
    <span class="text-xs font-bold text-[#272343]">Sign in to JakDev</span>
    <div class="h-6 bg-[#E3F6F5]/50 rounded border border-[#BAE8E8] flex items-center px-2 text-[10px] text-[#2D334A]/50">email@example.com</div>
    <div class="h-6 bg-[#FFD803] rounded flex items-center justify-center text-[10px] font-bold text-[#272343]">Continue</div>
  </div>
</div>`,
    responsive: { desktop: true, tablet: true, mobile: false },
    status: "published",
    createdAt: "2026-08-18T08:00:00Z",
  },
  {
    id: "metric-dashboard-card",
    title: "Analytics Metric & Sparkline Card",
    slug: "analytics-metric-sparkline-card",
    description:
      "Summary statistic card with percentage change delta badge and mini inline trend visualization.",
    category: "Components",
    technology: "React · Tailwind",
    tags: ["metric", "dashboard", "analytics", "stats", "card"],
    sourceCode: `export function MetricCard({ title, value, change }: { title: string; value: string; change: string }) {
  return (
    <div className="p-5 rounded-lg border border-[#BAE8E8] bg-white shadow-soft">
      <span className="text-xs text-[#2D334A]/70">{title}</span>
      <p className="text-2xl font-bold text-[#272343] mt-1">{value}</p>
      <span className="text-xs text-emerald-600 font-semibold">{change}</span>
    </div>
  );
}`,
    previewHtml: `<div class="p-4 bg-white flex items-center justify-center min-h-[220px]">
  <div class="w-full max-w-xs p-4 rounded-lg border border-[#BAE8E8] bg-white shadow-sm text-left">
    <span class="text-[11px] text-[#2D334A]/70">Monthly Active Users</span>
    <div class="flex items-baseline justify-between mt-1">
      <span class="text-xl font-bold text-[#272343]">24,850</span>
      <span class="text-[11px] text-emerald-600 font-bold bg-[#E3F6F5] px-1.5 py-0.5 rounded">+14.2%</span>
    </div>
  </div>
</div>`,
    responsive: { desktop: true, tablet: true, mobile: true },
    status: "published",
    createdAt: "2026-08-18T09:00:00Z",
  },
  {
    id: "feature-grid",
    title: "Interactive Bento Feature Grid",
    slug: "interactive-bento-feature-grid",
    description:
      "Asymmetrical bento-box feature grid highlighting key product capabilities with soft elevation.",
    category: "Blocks",
    technology: "Next.js · Tailwind",
    tags: ["bento", "features", "grid", "layout", "cards"],
    sourceCode: `export function BentoGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2 p-6 rounded-xl border border-[#BAE8E8] bg-white">Primary Feature</div>
      <div className="p-6 rounded-xl border border-[#BAE8E8] bg-white">Secondary Feature</div>
    </div>
  );
}`,
    previewHtml: `<div class="p-4 bg-slate-50 grid grid-cols-3 gap-2 min-h-[220px] items-center">
  <div class="col-span-2 p-3 bg-white border border-[#BAE8E8] rounded-md text-left text-xs font-bold text-[#272343]">
    Fast Rendering
  </div>
  <div class="p-3 bg-[#E3F6F5] border border-[#BAE8E8] rounded-md text-center text-[10px] font-bold text-[#272343]">
    Zero Deps
  </div>
</div>`,
    responsive: { desktop: true, tablet: true, mobile: true },
    status: "published",
    createdAt: "2026-08-18T09:30:00Z",
  },
  {
    id: "saas-landing-template",
    title: "Modern SaaS Landing Template",
    slug: "modern-saas-landing-template",
    description:
      "Complete end-to-end SaaS marketing page including Hero, Social Proof, Features, Pricing, and Footer.",
    category: "Templates",
    technology: "Next.js · Tailwind",
    tags: ["saas", "landing", "template", "complete", "marketing"],
    sourceCode: `export function SaaSLandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header, Hero, Bento, Pricing, FAQ, Footer */}
    </div>
  );
}`,
    previewHtml: `<div class="p-4 bg-white border border-[#BAE8E8] rounded-lg text-center space-y-2 min-h-[220px] flex flex-col justify-center">
  <span class="text-[10px] font-mono text-[#0D6E6E] font-bold bg-[#E3F6F5] px-2 py-0.5 rounded">FULL TEMPLATE</span>
  <h4 class="text-sm font-bold text-[#272343]">SaaS Marketing Page</h4>
  <p class="text-[11px] text-[#2D334A]/70">Includes all sections ready to ship.</p>
</div>`,
    responsive: { desktop: true, tablet: true, mobile: true },
    status: "published",
    createdAt: "2026-08-18T10:00:00Z",
  },
];
