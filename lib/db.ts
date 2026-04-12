import { neon } from '@neondatabase/serverless';

export function getDb() {
  const sql = neon(process.env.DATABASE_URL!);
  return sql;
}

export async function initDB() {
  const sql = getDb();

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      pw TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS next_match (
      id INTEGER PRIMARY KEY DEFAULT 1,
      date TEXT,
      place TEXT,
      time TEXT,
      method TEXT,
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS votes (
      member_name TEXT PRIMARY KEY,
      vote_type TEXT NOT NULL,
      voted_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;

  await sql`
    INSERT INTO users (id, name, pw)
    VALUES ('admin', '관리자', 'admin1234')
    ON CONFLICT (id) DO NOTHING
  `;
}
