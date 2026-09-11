/*
# Renamix: Site tracking, downloads, and versions

## Purpose
Adds database tables to track website views and app downloads, plus a versions table
to display release history (starting with the Beta version). Also adds a stats
function so the website can show aggregate counts without exposing raw row data.

## New Tables

1. `site_views`
   - `id` (uuid, primary key)
   - `page` (text) — which page was viewed (e.g. "index", "guide")
   - `created_at` (timestamptz, defaults to now)

2. `app_downloads`
   - `id` (uuid, primary key)
   - `created_at` (timestamptz, defaults to now)

3. `versions`
   - `id` (uuid, primary key)
   - `version_label` (text, e.g. "Beta")
   - `release_date` (date)
   - `download_url` (text, nullable)
   - `notes` (text, nullable)
   - `is_current` (boolean, default false)

## Functions
- `get_site_stats()` — returns a single row with `total_views` and `total_downloads`
  as aggregate counts. SECURITY DEFINER so it can bypass RLS on the tracking tables.

## Security (RLS)
- `site_views`: anon + authenticated can INSERT (to record views). No SELECT policy —
  the stats function handles reads.
- `app_downloads`: anon + authenticated can INSERT (to record downloads). No SELECT policy.
- `versions`: anon + authenticated can SELECT (public release info). No INSERT/UPDATE/DELETE
  for anon — version management is done via the service role key or dashboard.

## Initial Data
- Inserts the Beta version into `versions`.
*/

-- Site views table
CREATE TABLE IF NOT EXISTS site_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text NOT NULL DEFAULT 'index',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE site_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_site_views" ON site_views;
CREATE POLICY "anon_insert_site_views"
ON site_views FOR INSERT
TO anon, authenticated WITH CHECK (true);

-- App downloads table
CREATE TABLE IF NOT EXISTS app_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE app_downloads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_app_downloads" ON app_downloads;
CREATE POLICY "anon_insert_app_downloads"
ON app_downloads FOR INSERT
TO anon, authenticated WITH CHECK (true);

-- Versions table
CREATE TABLE IF NOT EXISTS versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  version_label text NOT NULL,
  release_date date NOT NULL DEFAULT CURRENT_DATE,
  download_url text,
  notes text,
  is_current boolean NOT NULL DEFAULT false
);

ALTER TABLE versions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_versions" ON versions;
CREATE POLICY "anon_select_versions"
ON versions FOR SELECT
TO anon, authenticated USING (true);

-- Stats function (SECURITY DEFINER so it can read tracking tables despite no SELECT policy)
CREATE OR REPLACE FUNCTION get_site_stats()
RETURNS TABLE (total_views bigint, total_downloads bigint)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    (SELECT count(*) FROM site_views),
    (SELECT count(*) FROM app_downloads);
$$;

-- Insert Beta version
INSERT INTO versions (version_label, release_date, notes, is_current)
SELECT 'Beta', CURRENT_DATE, 'First public release of Renamix. Available for free.', true
WHERE NOT EXISTS (SELECT 1 FROM versions WHERE version_label = 'Beta');
