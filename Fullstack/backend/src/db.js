import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const query = (text, params) => pool.query(text, params);

export const initDb = async () => {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
};

export const ensureAdmin = async () => {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!adminEmail || !adminPasswordHash) {
    return;
  }

  const existing = await query("SELECT id FROM users WHERE email = $1", [
    adminEmail,
  ]);
  if (existing.rowCount === 0) {
    await query(
      "INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3)",
      [adminEmail, adminPasswordHash, "admin"],
    );
  }
};
