-- ==============================================================================
-- JAKDEV — COMPLETE DATABASE SETUP (SCHEMA + RLS POLICIES + STORAGE + SEED DATA)
-- Jalankan skrip ini langsung di Supabase SQL Editor:
-- https://supabase.com/dashboard/project/cpxiaxccwhfjtpfqazhd/sql/new
-- ==============================================================================

-- 1. Enable Extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Create Resources Table
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  technology TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  source_code TEXT NOT NULL,
  preview_html TEXT,
  preview_image_url TEXT,
  responsive_desktop BOOLEAN NOT NULL DEFAULT true,
  responsive_tablet BOOLEAN NOT NULL DEFAULT false,
  responsive_mobile BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL CHECK (status IN ('draft', 'published')) DEFAULT 'published',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Create Indexes
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories (slug);
CREATE INDEX IF NOT EXISTS idx_resources_slug ON public.resources (slug);
CREATE INDEX IF NOT EXISTS idx_resources_category_id ON public.resources (category_id);
CREATE INDEX IF NOT EXISTS idx_resources_status ON public.resources (status);
CREATE INDEX IF NOT EXISTS idx_resources_technology ON public.resources (technology);

-- 5. Updated At Trigger Function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON public.resources;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.resources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- 7. RLS POLICIES FOR CATEGORIES

-- Public: Can read all categories
DROP POLICY IF EXISTS "Allow public read access on categories" ON public.categories;
CREATE POLICY "Allow public read access on categories"
ON public.categories
FOR SELECT
TO public
USING (true);

-- Authenticated Admin: Hardened CRUD (Insert, Update, Delete)
DROP POLICY IF EXISTS "Allow authenticated full access on categories" ON public.categories;
DROP POLICY IF EXISTS "Allow authenticated insert on categories" ON public.categories;
DROP POLICY IF EXISTS "Allow authenticated update on categories" ON public.categories;
DROP POLICY IF EXISTS "Allow authenticated delete on categories" ON public.categories;

CREATE POLICY "Allow authenticated insert on categories"
ON public.categories
FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update on categories"
ON public.categories
FOR UPDATE
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete on categories"
ON public.categories
FOR DELETE
TO authenticated
USING (auth.role() = 'authenticated');

-- 8. RLS POLICIES FOR RESOURCES

-- Public: Can ONLY read published resources
DROP POLICY IF EXISTS "Allow public read access on published resources" ON public.resources;
CREATE POLICY "Allow public read access on published resources"
ON public.resources
FOR SELECT
TO anon, public
USING (status = 'published');

-- Authenticated Admin: Can view all resources (including drafts)
DROP POLICY IF EXISTS "Allow authenticated select all resources" ON public.resources;
CREATE POLICY "Allow authenticated select all resources"
ON public.resources
FOR SELECT
TO authenticated
USING (auth.role() = 'authenticated');

-- Authenticated Admin: Hardened CRUD (Insert, Update, Delete)
DROP POLICY IF EXISTS "Allow authenticated full access on resources" ON public.resources;
DROP POLICY IF EXISTS "Allow authenticated insert on resources" ON public.resources;
DROP POLICY IF EXISTS "Allow authenticated update on resources" ON public.resources;
DROP POLICY IF EXISTS "Allow authenticated delete on resources" ON public.resources;

CREATE POLICY "Allow authenticated insert on resources"
ON public.resources
FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update on resources"
ON public.resources
FOR UPDATE
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete on resources"
ON public.resources
FOR DELETE
TO authenticated
USING (auth.role() = 'authenticated');

-- 9. Storage Bucket for Previews
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('jakdev-previews', 'jakdev-previews', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'])
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read access for jakdev-previews" ON storage.objects;
CREATE POLICY "Public read access for jakdev-previews"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'jakdev-previews');

DROP POLICY IF EXISTS "Authenticated upload for jakdev-previews" ON storage.objects;
CREATE POLICY "Authenticated upload for jakdev-previews"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'jakdev-previews');

-- 10. SEED DATA

-- Categories
INSERT INTO public.categories (id, name, slug, description)
VALUES 
  ('a1111111-1111-1111-1111-111111111111', 'Components', 'components', 'Reusable UI components and interactive elements.'),
  ('a2222222-2222-2222-2222-222222222222', 'Blocks', 'blocks', 'Pre-built sections, pricing grids, heroes, and bento cards.'),
  ('a3333333-3333-3333-3333-333333333333', 'Pages', 'pages', 'Full page layouts and structured developer templates.'),
  ('a4444444-4444-4444-4444-444444444444', 'Templates', 'templates', 'End-to-end multi-section website templates.')
ON CONFLICT (slug) DO UPDATE 
SET name = EXCLUDED.name, description = EXCLUDED.description;

-- Resources
INSERT INTO public.resources (
  id,
  title,
  slug,
  description,
  category_id,
  technology,
  tags,
  source_code,
  preview_html,
  responsive_desktop,
  responsive_tablet,
  responsive_mobile,
  status
)
VALUES
(
  'b1111111-1111-1111-1111-111111111111',
  'Interactive Stagger Button',
  'interactive-stagger-button',
  'Modern action button with smooth hover translation, subtle scale, and tactile active feedback.',
  'a1111111-1111-1111-1111-111111111111',
  'React · Tailwind',
  ARRAY['button', 'interaction', 'hover', 'ui', 'cva'],
  'import * as React from "react";
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
}',
  '<div class="flex items-center justify-center p-8 bg-white min-h-[220px]">
  <button class="inline-flex items-center justify-center gap-2 rounded-md font-semibold text-sm h-10 px-5 bg-[#FFD803] text-[#272343] hover:bg-[#F2CD00] active:scale-95 transition-all shadow-sm">
    <span>Click Interaction</span>
    <span class="font-bold">→</span>
  </button>
</div>',
  true,
  true,
  true,
  'published'
),
(
  'b2222222-2222-2222-2222-222222222222',
  'Responsive Floating Backdrop Navbar',
  'responsive-floating-navbar',
  'Sticky floating navigation bar with soft border blur, active link states, and responsive mobile drawer.',
  'a1111111-1111-1111-1111-111111111111',
  'React · TypeScript',
  ARRAY['navigation', 'navbar', 'header', 'responsive', 'drawer'],
  'import * as React from "react";
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
}',
  '<div class="p-6 bg-slate-50 min-h-[220px] flex items-center justify-center">
  <div class="w-full max-w-md flex h-12 items-center justify-between rounded-xl border border-[#BAE8E8] bg-white px-4 shadow-sm">
    <div class="flex items-center gap-2">
      <div class="h-6 w-6 rounded bg-[#FFD803] flex items-center justify-center text-xs font-black text-[#272343]">J</div>
      <span class="font-bold text-sm text-[#272343]">Navbar</span>
    </div>
    <div class="flex gap-2">
      <span class="text-xs text-[#2D334A] font-medium px-2 py-1 bg-[#E3F6F5] rounded">Active</span>
    </div>
  </div>
</div>',
  true,
  true,
  true,
  'published'
),
(
  'b3333333-3333-3333-3333-333333333333',
  'Ambient Canvas Hero Block',
  'ambient-canvas-hero-block',
  'High-impact hero block featuring lightweight particle nodes, responsive headline, and dual call-to-actions.',
  'a2222222-2222-2222-2222-222222222222',
  'Next.js · TypeScript',
  ARRAY['hero', 'canvas', 'particles', 'landing', 'cta'],
  'export function HeroBlock() {
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
}',
  '<div class="p-8 bg-gradient-to-b from-[#E3F6F5]/40 to-white text-center border border-[#BAE8E8] rounded-lg">
  <span class="text-[10px] font-mono font-bold bg-[#FFD803] text-[#272343] px-2 py-0.5 rounded">NEW BLOCK</span>
  <h3 class="text-lg font-bold text-[#272343] mt-2">Ambient Hero Preview</h3>
  <p class="text-xs text-[#2D334A]/80 mt-1">Lightweight canvas particle integration.</p>
</div>',
  true,
  true,
  true,
  'published'
),
(
  'b4444444-4444-4444-4444-444444444444',
  'Modern SaaS Pricing Matrix',
  'modern-saas-pricing-matrix',
  'Feature comparison cards with billing frequency toggles, clear pricing tiers, and highlighted primary plan.',
  'a2222222-2222-2222-2222-222222222222',
  'React · Tailwind',
  ARRAY['pricing', 'cards', 'saas', 'table', 'billing'],
  'export function PricingMatrix() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Pricing Tier Cards */}
    </div>
  );
}',
  '<div class="p-4 bg-white grid grid-cols-2 gap-3 min-h-[220px] items-center">
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
</div>',
  true,
  true,
  true,
  'published'
),
(
  'b5555555-5555-5555-5555-555555555555',
  'Clean Accessible FAQ Accordion',
  'clean-accessible-faq-accordion',
  'Accessible collapsible accordion with smooth height transitions and subtle chevron rotation.',
  'a2222222-2222-2222-2222-222222222222',
  'Tailwind CSS · HTML',
  ARRAY['accordion', 'faq', 'collapsible', 'details', 'accessible'],
  '<details class="group rounded-lg border border-[#BAE8E8] bg-white p-4">
  <summary class="flex cursor-pointer list-none items-center justify-between font-semibold text-[#272343]">
    <span>Is JakDev completely free?</span>
    <span class="transition group-open:rotate-180">▼</span>
  </summary>
  <p class="mt-3 text-sm text-[#2D334A]/80 leading-relaxed">
    Yes! All source code is completely free to use in personal and commercial projects.
  </p>
</details>',
  '<div class="p-4 bg-white space-y-2 min-h-[220px] flex flex-col justify-center">
  <div class="border border-[#BAE8E8] rounded-md p-3 text-left">
    <div class="flex justify-between text-xs font-bold text-[#272343]">
      <span>Can I copy the code directly?</span>
      <span>▼</span>
    </div>
    <p class="text-[11px] text-[#2D334A]/70 mt-1">Yes, one click to clipboard with full license freedom.</p>
  </div>
</div>',
  true,
  true,
  true,
  'published'
),
(
  'b6666666-6666-6666-6666-666666666666',
  'Developer Portfolio Template',
  'developer-portfolio-template',
  'Complete modern portfolio page layout designed specifically for software engineers and designers.',
  'a3333333-3333-3333-3333-333333333333',
  'Next.js · TypeScript',
  ARRAY['portfolio', 'resume', 'developer', 'showcase', 'projects'],
  'export function PortfolioPage() {
  return (
    <main className="max-w-5xl mx-auto py-12 px-4 space-y-16">
      {/* About, Projects, Experience, Contact */}
    </main>
  );
}',
  '<div class="p-4 bg-white border border-[#BAE8E8] rounded-lg text-left space-y-2 min-h-[220px]">
  <div class="h-8 w-8 rounded-full bg-[#FFD803] flex items-center justify-center text-xs font-bold">JD</div>
  <p class="text-xs font-bold text-[#272343]">John Doe · Fullstack Dev</p>
  <p class="text-[11px] text-[#2D334A]/70">Building fast web experiences with React & Next.js.</p>
</div>',
  true,
  true,
  true,
  'published'
),
(
  'b7777777-7777-7777-7777-777777777777',
  'Split-Screen Authentication Card',
  'split-screen-auth-card',
  'Minimalist login and signup form card with input validation indicators and social provider buttons.',
  'a2222222-2222-2222-2222-222222222222',
  'React · Tailwind',
  ARRAY['auth', 'login', 'signup', 'form', 'input'],
  'export function AuthCard() {
  return (
    <div className="max-w-md mx-auto p-6 rounded-xl border border-[#BAE8E8] bg-white shadow-sm space-y-4">
      <h2 className="text-xl font-bold text-[#272343]">Welcome back</h2>
      {/* Form inputs */}
    </div>
  );
}',
  '<div class="p-4 bg-slate-50 flex items-center justify-center min-h-[220px]">
  <div class="w-full max-w-xs p-4 bg-white border border-[#BAE8E8] rounded-lg space-y-2 text-left shadow-sm">
    <span class="text-xs font-bold text-[#272343]">Sign in to JakDev</span>
    <div class="h-6 bg-[#E3F6F5]/50 rounded border border-[#BAE8E8] flex items-center px-2 text-[10px] text-[#2D334A]/50">email@example.com</div>
    <div class="h-6 bg-[#FFD803] rounded flex items-center justify-center text-[10px] font-bold text-[#272343]">Continue</div>
  </div>
</div>',
  true,
  true,
  false,
  'published'
),
(
  'b8888888-8888-8888-8888-888888888888',
  'Analytics Metric & Sparkline Card',
  'analytics-metric-sparkline-card',
  'Summary statistic card with percentage change delta badge and mini inline trend visualization.',
  'a1111111-1111-1111-1111-111111111111',
  'React · Tailwind',
  ARRAY['metric', 'dashboard', 'analytics', 'stats', 'card'],
  'export function MetricCard({ title, value, change }: { title: string; value: string; change: string }) {
  return (
    <div className="p-5 rounded-lg border border-[#BAE8E8] bg-white shadow-soft">
      <span className="text-xs text-[#2D334A]/70">{title}</span>
      <p className="text-2xl font-bold text-[#272343] mt-1">{value}</p>
      <span className="text-xs text-emerald-600 font-semibold">{change}</span>
    </div>
  );
}',
  '<div class="p-4 bg-white flex items-center justify-center min-h-[220px]">
  <div class="w-full max-w-xs p-4 rounded-lg border border-[#BAE8E8] bg-white shadow-sm text-left">
    <span class="text-[11px] text-[#2D334A]/70">Monthly Active Users</span>
    <div class="flex items-baseline justify-between mt-1">
      <span class="text-xl font-bold text-[#272343]">24,850</span>
      <span class="text-[11px] text-emerald-600 font-bold bg-[#E3F6F5] px-1.5 py-0.5 rounded">+14.2%</span>
    </div>
  </div>
</div>',
  true,
  true,
  true,
  'published'
),
(
  'b9999999-9999-9999-9999-999999999999',
  'Interactive Bento Feature Grid',
  'interactive-bento-feature-grid',
  'Asymmetrical bento-box feature grid highlighting key product capabilities with soft elevation.',
  'a2222222-2222-2222-2222-222222222222',
  'Next.js · Tailwind',
  ARRAY['bento', 'features', 'grid', 'layout', 'cards'],
  'export function BentoGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2 p-6 rounded-xl border border-[#BAE8E8] bg-white">Primary Feature</div>
      <div className="p-6 rounded-xl border border-[#BAE8E8] bg-white">Secondary Feature</div>
    </div>
  );
}',
  '<div class="p-4 bg-slate-50 grid grid-cols-3 gap-2 min-h-[220px] items-center">
  <div class="col-span-2 p-3 bg-white border border-[#BAE8E8] rounded-md text-left text-xs font-bold text-[#272343]">
    Fast Rendering
  </div>
  <div class="p-3 bg-[#E3F6F5] border border-[#BAE8E8] rounded-md text-center text-[10px] font-bold text-[#272343]">
    Zero Deps
  </div>
</div>',
  true,
  true,
  true,
  'published'
),
(
  'baaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Modern SaaS Landing Template',
  'modern-saas-landing-template',
  'Complete end-to-end SaaS marketing page including Hero, Social Proof, Features, Pricing, and Footer.',
  'a4444444-4444-4444-4444-444444444444',
  'Next.js · Tailwind',
  ARRAY['saas', 'landing', 'template', 'complete', 'marketing'],
  'export function SaaSLandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header, Hero, Bento, Pricing, FAQ, Footer */}
    </div>
  );
}',
  '<div class="p-4 bg-white border border-[#BAE8E8] rounded-lg text-center space-y-2 min-h-[220px] flex flex-col justify-center">
  <span class="text-[10px] font-mono text-[#0D6E6E] font-bold bg-[#E3F6F5] px-2 py-0.5 rounded">FULL TEMPLATE</span>
  <h4 class="text-sm font-bold text-[#272343]">SaaS Marketing Page</h4>
  <p class="text-[11px] text-[#2D334A]/70">Includes all sections ready to ship.</p>
</div>',
  true,
  true,
  true,
  'published'
)
ON CONFLICT (slug) DO UPDATE
SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category_id = EXCLUDED.category_id,
  technology = EXCLUDED.technology,
  tags = EXCLUDED.tags,
  source_code = EXCLUDED.source_code,
  preview_html = EXCLUDED.preview_html,
  responsive_desktop = EXCLUDED.responsive_desktop,
  responsive_tablet = EXCLUDED.responsive_tablet,
  responsive_mobile = EXCLUDED.responsive_mobile,
  status = EXCLUDED.status,
  updated_at = now();

-- ==============================================================================
-- 7. Developer Suggestions Schema & RLS Policies
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.developer_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (
    type IN (
      'component',
      'block',
      'page',
      'template',
      'ui_design',
      'feature',
      'improvement',
      'other'
    )
  ),
  description TEXT NOT NULL CHECK (
    char_length(trim(description)) >= 5 AND char_length(description) <= 2000
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_developer_suggestions_created_at 
  ON public.developer_suggestions (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_developer_suggestions_type 
  ON public.developer_suggestions (type);

GRANT ALL ON TABLE public.developer_suggestions TO anon, authenticated, service_role;

ALTER TABLE public.developer_suggestions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anonymous insert on developer_suggestions" ON public.developer_suggestions;
DROP POLICY IF EXISTS "Allow public insert on developer_suggestions" ON public.developer_suggestions;
CREATE POLICY "Allow public insert on developer_suggestions"
ON public.developer_suggestions
FOR INSERT
TO anon, authenticated, service_role
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated select on developer_suggestions" ON public.developer_suggestions;
CREATE POLICY "Allow authenticated select on developer_suggestions"
ON public.developer_suggestions
FOR SELECT
TO authenticated, service_role
USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Allow authenticated delete on developer_suggestions" ON public.developer_suggestions;
CREATE POLICY "Allow authenticated delete on developer_suggestions"
ON public.developer_suggestions
FOR DELETE
TO authenticated, service_role
USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');


