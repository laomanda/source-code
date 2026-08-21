-- ==============================================================================
-- JakDev — Technologies Table & Relational Integration Migration
-- ==============================================================================

-- 1. Create Technologies Table
CREATE TABLE IF NOT EXISTS public.technologies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Add tech_id Column to Resources Table with Foreign Key
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'resources' 
    AND column_name = 'tech_id'
  ) THEN
    ALTER TABLE public.resources 
    ADD COLUMN tech_id UUID REFERENCES public.technologies(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 3. Create Indexes for Common Query Paths
CREATE INDEX IF NOT EXISTS idx_technologies_slug ON public.technologies (slug);
CREATE INDEX IF NOT EXISTS idx_resources_tech_id ON public.resources (tech_id);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.technologies ENABLE ROW LEVEL SECURITY;

-- 5. Public Read Policy (Anon & Authenticated can view technologies)
DROP POLICY IF EXISTS "Allow public read access on technologies" ON public.technologies;
CREATE POLICY "Allow public read access on technologies"
ON public.technologies
FOR SELECT
TO public
USING (true);

-- 6. Authenticated Write Policies (Admin full access)
DROP POLICY IF EXISTS "Allow authenticated users to insert technologies" ON public.technologies;
CREATE POLICY "Allow authenticated users to insert technologies"
ON public.technologies
FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users to update technologies" ON public.technologies;
CREATE POLICY "Allow authenticated users to update technologies"
ON public.technologies
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users to delete technologies" ON public.technologies;
CREATE POLICY "Allow authenticated users to delete technologies"
ON public.technologies
FOR DELETE
TO authenticated
USING (true);

-- 7. Seed Initial Technologies
INSERT INTO public.technologies (name, slug, description)
VALUES
  ('React', 'react', 'Modern declarative UI components built with React 19 / 18.'),
  ('Next.js', 'nextjs', 'Fullstack SSR and App Router components for Next.js.'),
  ('Tailwind CSS', 'tailwind', 'Utility-first CSS styling with clean atomic classes.'),
  ('TypeScript', 'typescript', 'Type-safe component definitions and robust interfaces.'),
  ('HTML & CSS', 'html', 'Pure semantic HTML5 and modern CSS3 without dependencies.'),
  ('Framer Motion', 'framer-motion', 'Smooth interactive animations and fluid gestures.'),
  ('Vue.js', 'vue', 'Progressive component architecture for Vue 3 ecosystem.'),
  ('Svelte', 'svelte', 'High-performance reactive components for Svelte 5 / 4.')
ON CONFLICT (slug) DO NOTHING;

-- 8. Backfill tech_id on existing resources based on technology name match
UPDATE public.resources r
SET tech_id = t.id
FROM public.technologies t
WHERE r.tech_id IS NULL
  AND LOWER(r.technology) LIKE '%' || LOWER(t.slug) || '%';
