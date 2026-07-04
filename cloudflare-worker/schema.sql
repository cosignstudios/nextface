-- The Single-Row Switchboard table for NextFace Matchmaking
CREATE TABLE IF NOT EXISTS global_queue (
  id INTEGER PRIMARY KEY,
  waiting_user_id TEXT,
  room_id TEXT,
  version INTEGER
);

-- Insert the initial empty row if it doesn't exist
INSERT OR IGNORE INTO global_queue (id, waiting_user_id, room_id, version) VALUES (1, NULL, NULL, 0);
