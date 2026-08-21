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
    previewHtml: `<div class="w-full h-full flex items-center justify-center px-4 py-6 bg-slate-950">
  <div class="flex items-center gap-3">
    <button class="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm shadow-lg shadow-amber-400/20 flex items-center gap-2 transition-all active:scale-95">
      <span>Interactive Stagger</span>
      <span>→</span>
    </button>
  </div>
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
    sourceCode: `export function FloatingNavbar() {
  return (
    <header className="sticky top-4 z-50 mx-auto max-w-5xl px-4">
      <div className="flex h-14 items-center justify-between rounded-xl border border-slate-700 bg-slate-900/90 px-6 backdrop-blur-md shadow-sm">
        <span className="font-bold text-lg text-white">JakDev</span>
      </div>
    </header>
  );
}`,
    previewHtml: `<div class="w-full h-full flex flex-col justify-center px-4 py-6 bg-slate-900">
  <div class="w-full max-w-4xl mx-auto flex items-center justify-between px-5 py-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 shadow-xl backdrop-blur-md">
    <div class="flex items-center gap-3">
      <div class="h-8 w-8 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center font-black text-slate-950 text-sm shadow-md">J</div>
      <span class="font-bold text-white text-base tracking-tight">JakDev<span class="text-amber-400">.ui</span></span>
    </div>
    <div class="hidden sm:flex items-center gap-6 text-xs font-medium text-slate-300">
      <span class="text-amber-400 font-semibold cursor-pointer">Components</span>
      <span class="hover:text-white transition-colors cursor-pointer">Templates</span>
      <span class="hover:text-white transition-colors cursor-pointer">Pricing</span>
      <span class="hover:text-white transition-colors cursor-pointer">Docs</span>
    </div>
    <div class="flex items-center gap-2">
      <span class="hidden md:inline-block text-xs font-medium text-slate-300 px-3 py-1.5 hover:text-white">Login</span>
      <button class="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shadow-md transition-transform active:scale-95">Get Started</button>
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
    <section className="py-20 text-center bg-slate-950 text-white">
      <h1 className="text-4xl font-black">Modern Web Development</h1>
    </section>
  );
}`,
    previewHtml: `<div class="w-full h-full flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-center relative overflow-hidden">
  <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.12),transparent_70%)] pointer-events-none"></div>
  <div class="relative z-10 max-w-xl mx-auto space-y-3">
    <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-[11px] font-mono font-medium">
      <span class="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"></span>
      <span>Next.js 15 Ready Components</span>
    </div>
    <h1 class="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
      Build Modern Web Apps <span class="bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent">10x Faster</span>
    </h1>
    <p class="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
      Curated collection of clean, accessible UI components and full-page templates built with React and Tailwind CSS.
    </p>
    <div class="flex items-center justify-center gap-2.5 pt-1">
      <button class="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs shadow-lg hover:bg-amber-300 transition-all">Explore Library →</button>
      <button class="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 font-medium text-xs hover:bg-slate-700 transition-all">Documentation</button>
    </div>
  </div>
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
    previewHtml: `<div class="w-full h-full flex items-center justify-center px-4 py-6 bg-slate-900">
  <div class="w-full max-w-2xl grid grid-cols-2 sm:grid-cols-3 gap-3 items-stretch">
    <div class="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex flex-col justify-between text-left">
      <div>
        <span class="text-xs font-semibold text-slate-400">Starter</span>
        <div class="text-xl font-black text-white mt-1">$0<span class="text-[10px] text-slate-400 font-normal">/mo</span></div>
        <ul class="mt-2.5 space-y-1.5 text-[10px] text-slate-300">
          <li class="flex items-center gap-1.5 text-emerald-400">✓ <span class="text-slate-300">5 Projects</span></li>
          <li class="flex items-center gap-1.5 text-emerald-400">✓ <span class="text-slate-300">Community Support</span></li>
        </ul>
      </div>
      <button class="mt-3 w-full py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium">Get Started</button>
    </div>
    <div class="p-3.5 rounded-xl bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-amber-400 relative flex flex-col justify-between text-left shadow-lg">
      <span class="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold text-[9px]">POPULAR</span>
      <div>
        <span class="text-xs font-semibold text-amber-300">Pro Plan</span>
        <div class="text-xl font-black text-white mt-1">$19<span class="text-[10px] text-slate-400 font-normal">/mo</span></div>
        <ul class="mt-2.5 space-y-1.5 text-[10px] text-slate-300">
          <li class="flex items-center gap-1.5 text-amber-400">✓ <span class="text-white font-medium">Unlimited Access</span></li>
          <li class="flex items-center gap-1.5 text-amber-400">✓ <span class="text-white font-medium">Source Code Export</span></li>
          <li class="flex items-center gap-1.5 text-amber-400">✓ <span class="text-white font-medium">Priority Updates</span></li>
        </ul>
      </div>
      <button class="mt-3 w-full py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold shadow-md">Upgrade to Pro</button>
    </div>
    <div class="hidden sm:flex p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex-col justify-between text-left">
      <div>
        <span class="text-xs font-semibold text-slate-400">Enterprise</span>
        <div class="text-xl font-black text-white mt-1">$99<span class="text-[10px] text-slate-400 font-normal">/mo</span></div>
        <ul class="mt-2.5 space-y-1.5 text-[10px] text-slate-300">
          <li class="flex items-center gap-1.5 text-emerald-400">✓ <span class="text-slate-300">Custom Contracts</span></li>
          <li class="flex items-center gap-1.5 text-emerald-400">✓ <span class="text-slate-300">Dedicated Support</span></li>
        </ul>
      </div>
      <button class="mt-3 w-full py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium">Contact Team</button>
    </div>
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
    sourceCode: `<details class="group rounded-lg border border-slate-700 bg-slate-900 p-4">
  <summary class="flex cursor-pointer list-none items-center justify-between font-semibold text-white">
    <span>Is JakDev completely free?</span>
    <span class="transition group-open:rotate-180">▼</span>
  </summary>
  <p class="mt-3 text-sm text-slate-300 leading-relaxed">
    Yes! All source code is completely free to use in personal and commercial projects.
  </p>
</details>`,
    previewHtml: `<div class="w-full h-full flex flex-col justify-center px-5 py-6 bg-slate-900">
  <div class="w-full max-w-xl mx-auto space-y-2.5">
    <div class="p-3.5 rounded-xl bg-slate-800/90 border border-amber-400/40 shadow-md">
      <div class="flex items-center justify-between text-xs font-bold text-white">
        <span class="flex items-center gap-2"><span class="h-1.5 w-1.5 rounded-full bg-amber-400"></span> Apakah JakDev sepenuhnya gratis digunakan?</span>
        <span class="text-amber-400 font-black">−</span>
      </div>
      <p class="text-[11px] text-slate-300 mt-2 leading-relaxed pl-3.5 border-l border-amber-400/30">
        Ya! Seluruh source code dan komponen dapat digunakan secara bebas baik untuk proyek personal maupun komersial.
      </p>
    </div>
    <div class="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between text-xs font-medium text-slate-300">
      <span>Bagaimana cara menyalin source code komponen?</span>
      <span class="text-slate-400">+</span>
    </div>
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
    previewHtml: `<div class="w-full h-full flex items-center justify-center px-4 py-6 bg-slate-950">
  <div class="w-full max-w-lg p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
    <div class="flex items-center gap-3.5">
      <div class="h-12 w-12 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 p-0.5 shadow-lg">
        <div class="h-full w-full rounded-full bg-slate-950 flex items-center justify-center text-amber-400 font-bold text-base">JD</div>
      </div>
      <div>
        <div class="flex items-center gap-2">
          <h3 class="font-bold text-white text-sm">John Doe</h3>
          <span class="px-2 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 text-[10px] font-medium">Available</span>
        </div>
        <p class="text-xs text-slate-400">Full-Stack Engineer & UI Designer</p>
      </div>
    </div>
    <div class="flex flex-wrap gap-1.5">
      <span class="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-mono">React</span>
      <span class="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-mono">Next.js</span>
      <span class="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-mono">Tailwind</span>
      <span class="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-mono">TypeScript</span>
    </div>
  </div>
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
    <div className="max-w-md mx-auto p-6 rounded-xl border border-slate-700 bg-slate-900 shadow-sm space-y-4">
      <h2 className="text-xl font-bold text-white">Welcome back</h2>
    </div>
  );
}`,
    previewHtml: `<div class="w-full h-full flex items-center justify-center px-4 py-6 bg-slate-900">
  <div class="w-full max-w-xs p-5 rounded-2xl bg-slate-800/90 border border-slate-700/80 shadow-xl space-y-3.5 text-center">
    <div>
      <h3 class="font-bold text-white text-base">Welcome Back</h3>
      <p class="text-[11px] text-slate-400 mt-0.5">Enter your email to sign in to JakDev</p>
    </div>
    <div class="space-y-2">
      <input type="email" placeholder="name@company.com" class="w-full h-8 px-3 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400" disabled />
      <button class="w-full h-8 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-all">Continue with Email →</button>
    </div>
    <div class="text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
      <span>Protected by 256-bit encryption</span>
    </div>
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
    <div className="p-5 rounded-lg border border-slate-700 bg-slate-900 shadow-soft">
      <span className="text-xs text-slate-400">{title}</span>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
      <span className="text-xs text-emerald-400 font-semibold">{change}</span>
    </div>
  );
}`,
    previewHtml: `<div class="w-full h-full flex items-center justify-center px-4 py-6 bg-slate-950">
  <div class="w-full max-w-sm p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
    <div class="flex items-center justify-between">
      <span class="text-xs font-medium text-slate-400">Total Monthly Active Users</span>
      <span class="px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 font-bold text-[10px]">+18.4%</span>
    </div>
    <div class="flex items-baseline gap-2">
      <span class="text-2xl font-black text-white">48,290</span>
      <span class="text-xs text-slate-500">vs. last month</span>
    </div>
    <div class="h-10 w-full flex items-end gap-1 pt-2">
      <div class="h-3 w-full bg-amber-400/30 rounded-xs"></div>
      <div class="h-5 w-full bg-amber-400/40 rounded-xs"></div>
      <div class="h-4 w-full bg-amber-400/50 rounded-xs"></div>
      <div class="h-7 w-full bg-amber-400/60 rounded-xs"></div>
      <div class="h-6 w-full bg-amber-400/70 rounded-xs"></div>
      <div class="h-9 w-full bg-amber-400/80 rounded-xs"></div>
      <div class="h-10 w-full bg-amber-400 rounded-xs"></div>
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
      <div className="md:col-span-2 p-6 rounded-xl border border-slate-700 bg-slate-900">Primary Feature</div>
      <div className="p-6 rounded-xl border border-slate-700 bg-slate-900">Secondary Feature</div>
    </div>
  );
}`,
    previewHtml: `<div class="w-full h-full flex items-center justify-center px-4 py-6 bg-slate-900">
  <div class="w-full max-w-md grid grid-cols-3 gap-2.5">
    <div class="col-span-2 p-3.5 rounded-xl bg-slate-800 border border-slate-700/80 space-y-1 text-left">
      <div class="h-6 w-6 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center text-xs font-bold">⚡</div>
      <h4 class="font-bold text-white text-xs">Instant Setup</h4>
      <p class="text-[10px] text-slate-400 leading-tight">Copy and paste code directly into your React & Tailwind projects.</p>
    </div>
    <div class="p-3.5 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 text-slate-950 flex flex-col justify-between text-left shadow-md">
      <span class="font-black text-lg">100%</span>
    </div>
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
    <div className="flex flex-col min-h-screen bg-slate-950">
      {/* Header, Hero, Bento, Pricing, FAQ, Footer */}
    </div>
  );
}`,
    previewHtml: `<div class="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-center space-y-2.5">
  <span class="text-[10px] font-mono text-amber-400 font-bold bg-amber-400/10 border border-amber-400/30 px-2.5 py-0.5 rounded-full">FULL TEMPLATE</span>
  <h4 class="text-lg font-black text-white">SaaS Marketing Page</h4>
  <p class="text-xs text-slate-400 max-w-xs">Includes all sections ready to ship with Next.js & Tailwind CSS.</p>
</div>`,
    responsive: { desktop: true, tablet: true, mobile: true },
    status: "published",
    createdAt: "2026-08-18T10:00:00Z",
  },
];
