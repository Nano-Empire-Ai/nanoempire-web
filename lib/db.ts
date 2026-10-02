import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.DATABASE_URL || 'file:local.db',
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

export async function initDb() {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS recall_scans (
      id TEXT PRIMARY KEY,
      session_id TEXT UNIQUE,
      email TEXT,
      scan_data TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export async function saveScan(id: string, sessionId: string, email: string, data: any) {
  await client.execute({
    sql: 'INSERT INTO recall_scans (id, session_id, email, scan_data) VALUES (?, ?, ?, ?)',
    args: [id, sessionId, email, JSON.stringify(data)],
  });
}

export async function markPaid(sessionId: string) {
  await client.execute({
    sql: "UPDATE recall_scans SET status = 'paid' WHERE session_id = ?",
    args: [sessionId],
  });
}

export async function getScanBySession(sessionId: string) {
  const result = await client.execute({
    sql: 'SELECT * FROM recall_scans WHERE session_id = ?',
    args: [sessionId],
  });
  return result.rows[0];
}

export async function getScanById(id: string) {
  const result = await client.execute({
    sql: 'SELECT * FROM recall_scans WHERE id = ?',
    args: [id],
  });
  return result.rows[0];
}
