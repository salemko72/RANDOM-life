CREATE TABLE IF NOT EXISTS content_items (
  id TEXT PRIMARY KEY,
  dedup_key TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK(category IN ('EAT','BOOK')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','review','published')),
  data TEXT NOT NULL CHECK(json_valid(data)),
  version INTEGER NOT NULL DEFAULT 1,
  updated_at TEXT NOT NULL,
  approved_by TEXT,
  approved_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_content_public ON content_items(status,category);
CREATE TABLE IF NOT EXISTS editorial_events (
  id TEXT PRIMARY KEY,
  content_id TEXT NOT NULL REFERENCES content_items(id),
  action TEXT NOT NULL,
  actor TEXT NOT NULL,
  version INTEGER NOT NULL,
  snapshot TEXT NOT NULL CHECK(json_valid(snapshot)),
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_events_content ON editorial_events(content_id,created_at);
