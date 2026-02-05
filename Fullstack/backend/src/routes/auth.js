import express from "express";
import bcrypt from "bcryptjs";
import { query } from "../db.js";
import { createToken } from "../utils/auth.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email y contraseña son requeridos" });
  }

  const existing = await query("SELECT id FROM users WHERE email = $1", [
    email,
  ]);
  if (existing.rowCount > 0) {
    return res.status(409).json({ error: "El usuario ya existe" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const result = await query(
    "INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role, created_at",
    [email, passwordHash, "user"],
  );

  const user = result.rows[0];
  const token = createToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });
  return res.status(201).json({ token, user });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email y contraseña son requeridos" });
  }

  const result = await query(
    "SELECT id, email, role, password_hash FROM users WHERE email = $1",
    [email],
  );
  if (result.rowCount === 0) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  const user = result.rows[0];
  const matches = await bcrypt.compare(password, user.password_hash);
  if (!matches) {
    return res.status(401).json({ error: "Credenciales inválidas" });
  }

  const token = createToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });
  return res.json({
    token,
    user: { id: user.id, email: user.email, role: user.role },
  });
});

export default router;
