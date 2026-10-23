CREATE TABLE IF NOT EXISTS visitors (
  visitor_id TEXT PRIMARY KEY NOT NULL,
  first_seen INTEGER NOT NULL DEFAULT (unixepoch())
);
