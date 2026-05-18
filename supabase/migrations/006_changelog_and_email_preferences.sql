-- Changelog entries: features/updates added by admin
CREATE TABLE IF NOT EXISTS changelog_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'feature', -- feature, fix, improvement
  created_at TIMESTAMPTZ DEFAULT now(),
  sent_at TIMESTAMPTZ -- null means not yet included in a digest
);

-- Email preferences per user
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_notifications BOOLEAN DEFAULT true;

-- Digest send log
CREATE TABLE IF NOT EXISTS email_digest_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sent_at TIMESTAMPTZ DEFAULT now(),
  recipient_count INTEGER NOT NULL DEFAULT 0,
  entries_included UUID[] NOT NULL DEFAULT '{}'
);
