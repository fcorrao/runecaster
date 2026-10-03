-- one row per recorded run; `player` is the browser's random id (its memory key)
CREATE TABLE runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  player TEXT NOT NULL,
  name TEXT NOT NULL,
  score INTEGER NOT NULL,
  chapter INTEGER NOT NULL,
  cleared INTEGER NOT NULL,
  max_combo INTEGER NOT NULL,
  perfect INTEGER NOT NULL,
  good INTEGER NOT NULL,
  miss INTEGER NOT NULL,
  at TEXT NOT NULL DEFAULT (datetime('now'))
);
-- the board and rank read only the top of this index, not the table
CREATE INDEX runs_score ON runs (score DESC, id);
-- memory and the per-player rate limit
CREATE INDEX runs_player ON runs (player, id);
