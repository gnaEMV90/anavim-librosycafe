CREATE TABLE IF NOT EXISTS consult_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER,
  product_code TEXT,
  product_title TEXT,
  source TEXT NOT NULL DEFAULT 'catalog',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_consult_events_created_at ON consult_events (created_at);
CREATE INDEX IF NOT EXISTS idx_consult_events_product_code ON consult_events (product_code);
