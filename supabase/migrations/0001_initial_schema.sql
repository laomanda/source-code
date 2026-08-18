-- ==============================================================================
-- JakDev — Initial Database Schema & Security Migration
-- Phase 06: Supabase Integration & Database Foundation
-- ==============================================================================

-- 1. Enable uuid-ossp extension (gen_random_uuid is standard in modern PostgreSQL)
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

-- 4. Create Indexes for Common MVP Query Paths
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

-- 6. Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- 7. Public Read Policies
DROP POLICY IF EXISTS "Allow public read access on categories" ON public.categories;
CREATE POLICY "Allow public read access on categories"
ON public.categories
FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Allow public read access on published resources" ON public.resources;
CREATE POLICY "Allow public read access on published resources"
ON public.resources
FOR SELECT
TO public
USING (status = 'published');

-- Note: Public INSERT, UPDATE, DELETE are blocked by default since no public write policies exist.

-- 8. Storage Bucket for Previews & Assets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('jakdev-previews', 'jakdev-previews', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'])
ON CONFLICT (id) DO NOTHING;

-- Public Storage Read Policy
DROP POLICY IF EXISTS "Public read access for jakdev-previews" ON storage.objects;
CREATE POLICY "Public read access for jakdev-previews"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'jakdev-previews');
