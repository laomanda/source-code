-- ==============================================================================
-- JakDev — Phase 09: Developer Suggestion System Migration (RLS & Grants Fixed)
-- ==============================================================================

-- 1. Create developer_suggestions table
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

-- 2. Indexes for performance & query filtering
CREATE INDEX IF NOT EXISTS idx_developer_suggestions_created_at 
  ON public.developer_suggestions (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_developer_suggestions_type 
  ON public.developer_suggestions (type);

-- 3. Grants for PostgREST Roles
GRANT ALL ON TABLE public.developer_suggestions TO anon, authenticated, service_role;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.developer_suggestions ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
-- Public / Anonymous can INSERT suggestions
DROP POLICY IF EXISTS "Allow anonymous insert on developer_suggestions" ON public.developer_suggestions;
DROP POLICY IF EXISTS "Allow public insert on developer_suggestions" ON public.developer_suggestions;
CREATE POLICY "Allow public insert on developer_suggestions"
ON public.developer_suggestions
FOR INSERT
TO anon, authenticated, service_role
WITH CHECK (true);

-- Authenticated Admins can SELECT (view all suggestions)
DROP POLICY IF EXISTS "Allow authenticated select on developer_suggestions" ON public.developer_suggestions;
CREATE POLICY "Allow authenticated select on developer_suggestions"
ON public.developer_suggestions
FOR SELECT
TO authenticated, service_role
USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Authenticated Admins can DELETE suggestions
DROP POLICY IF EXISTS "Allow authenticated delete on developer_suggestions" ON public.developer_suggestions;
CREATE POLICY "Allow authenticated delete on developer_suggestions"
ON public.developer_suggestions
FOR DELETE
TO authenticated, service_role
USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');
