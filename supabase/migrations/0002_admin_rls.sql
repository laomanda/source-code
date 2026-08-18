-- ==============================================================================
-- JakDev — Phase 07: Admin Authentication & Row Level Security Policies
-- ==============================================================================

-- 1. Authenticated Full Access for Categories (CRUD)
DROP POLICY IF EXISTS "Allow authenticated full access on categories" ON public.categories;
CREATE POLICY "Allow authenticated full access on categories"
ON public.categories
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 2. Authenticated Full Access for Resources (CRUD & View Drafts)
DROP POLICY IF EXISTS "Allow authenticated full access on resources" ON public.resources;
CREATE POLICY "Allow authenticated full access on resources"
ON public.resources
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
