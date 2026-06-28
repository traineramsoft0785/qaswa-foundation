-- Add slug and content columns to programs table
ALTER TABLE programs ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE;
ALTER TABLE programs ADD COLUMN IF NOT EXISTS content TEXT;

-- Backfill slugs from existing titles (append first 4 chars of UUID for uniqueness)
UPDATE programs
SET slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(title, '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g')) || '-' || LEFT(id::text, 4)
WHERE slug IS NULL;

-- Make slug NOT NULL after backfill
ALTER TABLE programs ALTER COLUMN slug SET NOT NULL;

-- Index for slug lookups
CREATE INDEX IF NOT EXISTS idx_programs_slug ON programs (slug);
