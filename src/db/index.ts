import { Pool } from 'pg';
import dotenv from 'dotenv';
import { OrderRecord } from '../types';

dotenv.config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function createOrder(record: Partial<OrderRecord> & { id: string }) {
  const { id, type, tokenIn, tokenOut, amount, status } = record;
  const createdAt = new Date().toISOString();
  await pool.query(
    `INSERT INTO orders(id, type, token_in, token_out, amount, status, created_at) VALUES($1,$2,$3,$4,$5,$6,$7)`,
    [id, type, tokenIn, tokenOut, amount, status, createdAt]
  );
  return { ...(record as any), createdAt } as OrderRecord;
}

export async function updateOrderStatus(id: string, status: string, extras: Partial<OrderRecord> = {}) {
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;
  fields.push(`status = $${idx++}`); values.push(status);
  if (extras.txHash) { fields.push(`tx_hash = $${idx++}`); values.push(extras.txHash); }
  if (extras.error) { fields.push(`error = $${idx++}`); values.push(extras.error); }
  values.push(id);
  const q = `UPDATE orders SET ${fields.join(', ')} WHERE id = $${idx}`;
  await pool.query(q, values);
}

export async function getOrder(id: string) {
  const { rows } = await pool.query(`SELECT * FROM orders WHERE id=$1`, [id]);
  return rows[0];
}

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      type TEXT,
      token_in TEXT,
      token_out TEXT,
      amount NUMERIC,
      status TEXT,
      tx_hash TEXT,
      error TEXT,
      created_at TIMESTAMP
    )
  `);
}
