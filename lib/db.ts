import { neon } from '@neondatabase/serverless';

export function getDb() {
  return neon(process.env.DATABASE_URL!);
}

export async function initDB() {
  const sql = getDb();

  await sql`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    pw TEXT NOT NULL,
    role TEXT DEFAULT 'member',
    mapped_member TEXT DEFAULT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`;

  await sql`CREATE TABLE IF NOT EXISTS next_match (
    id INTEGER PRIMARY KEY DEFAULT 1,
    date TEXT,
    place TEXT,
    start_time TEXT,
    end_time TEXT,
    method TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )`;

  await sql`CREATE TABLE IF NOT EXISTS votes (
    member_name TEXT PRIMARY KEY,
    vote_type TEXT NOT NULL,
    voted_at TIMESTAMPTZ DEFAULT NOW()
  )`;

  await sql`CREATE TABLE IF NOT EXISTS match_history (
    id SERIAL PRIMARY KEY,
    date TEXT NOT NULL,
    place TEXT,
    start_time TEXT,
    end_time TEXT,
    method TEXT,
    score_us INTEGER DEFAULT 0,
    score_them INTEGER DEFAULT 0,
    attendees TEXT[],
    photos TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
  )`;

  await sql`CREATE TABLE IF NOT EXISTS name_mappings (
    user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    member_name TEXT NOT NULL
  )`;

  await sql`INSERT INTO users (id, name, pw, role)
    VALUES ('admin', '관리자', 'admin1234', 'admin')
    ON CONFLICT (id) DO NOTHING`;
}
