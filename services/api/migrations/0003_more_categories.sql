-- Preserve content, versions and editorial history while extending categories.
PRAGMA defer_foreign_keys = ON;
CREATE TABLE content_items_expanded (
  id TEXT PRIMARY KEY,
  dedup_key TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK(category IN ('EAT','BOOK','WATCH','MOVE','GO')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','review','published')),
  data TEXT NOT NULL CHECK(json_valid(data)),
  version INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL,
  approved_by TEXT,
  approved_at TEXT,
  revision_token TEXT NOT NULL DEFAULT ''
);
INSERT INTO content_items_expanded SELECT id,dedup_key,category,status,data,version,updated_at,approved_by,approved_at,revision_token FROM content_items;
DROP TABLE content_items;
ALTER TABLE content_items_expanded RENAME TO content_items;
CREATE INDEX idx_content_public ON content_items(status,category);
PRAGMA defer_foreign_keys = OFF;
