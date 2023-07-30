export const CREATE_TABLE = `
CREATE TABLE IF NOT EXISTS characters (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  tag TEXT NOT NULL,
  ideology TEXT,
  positions TEXT,
  leaderTraits TEXT,
  commanderTraits TEXT,
  ministerTraits TEXT,
  officerTraits TEXT,
  roles TEXT,
  cost INTEGER
)
`
