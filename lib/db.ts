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

  await client.execute(`
    CREATE TABLE IF NOT EXISTS merchant_alerts (
      id TEXT PRIMARY KEY,
      shop TEXT,
      product_id TEXT,
      recall_data TEXT,
      crypto_seal TEXT,
      notified INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export async function createMerchantAlert(id: string, shop: string, productId: string, recallData: any, cryptoSeal: string) {
  await client.execute({
    sql: 'INSERT INTO merchant_alerts (id, shop, product_id, recall_data, crypto_seal) VALUES (?, ?, ?, ?, ?)',
    args: [id, shop, productId, JSON.stringify(recallData), cryptoSeal]
  });
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

export async function initNhtsaDb() {
  await client.execute(` 
    CREATE TABLE IF NOT EXISTS vin_decode_cache (
      vin TEXT PRIMARY KEY,
      make TEXT,
      model TEXT,
      model_year TEXT,
      decoded_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}
