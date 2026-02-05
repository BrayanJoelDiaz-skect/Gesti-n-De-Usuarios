import express from "express";
import bcrypt from "bcryptjs";
import { query } from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/me", requireAuth, async (req, res) => {
  const result = await query(
    "SELECT id, email, role, created_at FROM users WHERE id = $1",
    [req.user.id],
  );
  if (result.rowCount === 0) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }
  return res.json(result.rows[0]);
});

router.get("/", requireAuth, requireRole("admin"), async (_req, res) => {
  const result = await query(
    "SELECT id, email, role, created_at FROM users ORDER BY id",
  );
  return res.json(result.rows);
});

router.post("/", requireAuth, requireRole("admin"), async (req, res) => {
  const { email, password, role } = req.body;
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
  const normalizedRole = role === "admin" ? "admin" : "user";
  const result = await query(
    "INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role, created_at",
    [email, passwordHash, normalizedRole],
  );
  return res.status(201).json(result.rows[0]);
});

router.put("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const { email, password, role } = req.body;
  const { id } = req.params;

  const existing = await query(
    "SELECT id, email, role FROM users WHERE id = $1",
    [id],
  );
  if (existing.rowCount === 0) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  const updates = [];
  const values = [];
  let index = 1;

  if (email) {
    updates.push(`email = $${index}`);
    values.push(email);
    index += 1;
  }

  if (password) {
    const passwordHash = await bcrypt.hash(password, 10);
    updates.push(`password_hash = $${index}`);
    values.push(passwordHash);
    index += 1;
  }

  if (role) {
    updates.push(`role = $${index}`);
    values.push(role === "admin" ? "admin" : "user");
    index += 1;
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: "No hay cambios para actualizar" });
  }

  values.push(id);

  const result = await query(
    `UPDATE users SET ${updates.join(", ")} WHERE id = $${index} RETURNING id, email, role, created_at`,
    values,
  );

  return res.json(result.rows[0]);
});

router.delete("/:id", requireAuth, requireRole("admin"), async (req, res) => {
  const { id } = req.params;
  const result = await query("DELETE FROM users WHERE id = $1 RETURNING id", [
    id,
  ]);
  if (result.rowCount === 0) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }
  return res.status(204).send();
});

export default router;
