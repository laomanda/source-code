-- ==============================================================================
-- JakDev — Phase 07/08: Admin Authentication & Hardened Row Level Security Policies
-- ==============================================================================

-- 1. Ensure RLS is active
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

-- 2. Hardened Policies for Categories
DROP POLICY IF EXISTS "Allow public read access on categories" ON public.categories;
CREATE POLICY "Allow public read access on categories"
ON public.categories
FOR SELECT
TO public
USING (true);

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

-- 3. Hardened Policies for Resources
DROP POLICY IF EXISTS "Allow public read access on published resources" ON public.resources;
CREATE POLICY "Allow public read access on published resources"
ON public.resources
FOR SELECT
TO anon, public
USING (status = 'published');

DROP POLICY IF EXISTS "Allow authenticated select all resources" ON public.resources;
CREATE POLICY "Allow authenticated select all resources"
ON public.resources
FOR SELECT
TO authenticated
USING (auth.role() = 'authenticated');

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
