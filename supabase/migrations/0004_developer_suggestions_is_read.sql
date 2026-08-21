-- ==============================================================================
-- JakDev — Phase 10: Developer Suggestion is_read & Update Policy
-- ==============================================================================

-- 1. Add is_read column if it does not exist
ALTER TABLE public.developer_suggestions 
ADD COLUMN IF NOT EXISTS is_read BOOLEAN NOT NULL DEFAULT FALSE;

-- 2. Index for filtering unread suggestions
CREATE INDEX IF NOT EXISTS idx_developer_suggestions_is_read 
  ON public.developer_suggestions (is_read);

-- 3. Grants for PostgREST Roles
GRANT ALL ON TABLE public.developer_suggestions TO anon, authenticated, service_role;

-- 4. Enable / Verify RLS Update Policy
DROP POLICY IF EXISTS "Allow authenticated update on developer_suggestions" ON public.developer_suggestions;
CREATE POLICY "Allow authenticated update on developer_suggestions"
ON public.developer_suggestions
FOR UPDATE
TO authenticated, service_role
USING (auth.role() = 'authenticated' OR auth.role() = 'service_role')
WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');
