const express = require("express");
const bcrypt = require("bcryptjs");
const { db } = require("../db/database");

const router = express.Router();

router.get("/", (req, res) => {
  const rows = db.prepare(`
    SELECT id, username, full_name, email, role, created_at
    FROM users
    ORDER BY created_at DESC, id DESC
  `).all();
  return res.json(rows);
});

router.post("/", (req, res) => {
  const { username, password, full_name, email, role } = req.body;
  if (!username || !password || !full_name || !role) {
    return res.status(400).json({ message: "Vui long nhap day du thong tin tai khoan." });
  }

  try {
    db.prepare(`
      INSERT INTO users (username, password_hash, full_name, email, role)
      VALUES (?, ?, ?, ?, ?)
    `).run(username.trim(), bcrypt.hashSync(password, 10), full_name.trim(), email || "", role);
    return res.status(201).json({ message: "Them tai khoan thanh cong." });
  } catch (error) {
    return res.status(400).json({ message: "Username da ton tai hoac du lieu khong hop le." });
  }
});

router.put("/:id", (req, res) => {
  const { username, password, full_name, email, role } = req.body;
  if (!username || !full_name || !role) {
    return res.status(400).json({ message: "Vui long nhap day du thong tin bat buoc." });
  }

  if (Number(req.params.id) === req.user.id && role !== req.user.role) {
    return res.status(400).json({ message: "Ban khong duoc doi role cua chinh minh." });
  }

  try {
    if (password) {
      db.prepare(`
        UPDATE users
        SET username = ?, password_hash = ?, full_name = ?, email = ?, role = ?
        WHERE id = ?
      `).run(username.trim(), bcrypt.hashSync(password, 10), full_name.trim(), email || "", role, req.params.id);
    } else {
      db.prepare(`
        UPDATE users
        SET username = ?, full_name = ?, email = ?, role = ?
        WHERE id = ?
      `).run(username.trim(), full_name.trim(), email || "", role, req.params.id);
    }

    return res.json({ message: "Cap nhat tai khoan thanh cong." });
  } catch (error) {
    return res.status(400).json({ message: "Khong the cap nhat tai khoan." });
  }
});

router.delete("/:id", (req, res) => {
  if (Number(req.params.id) === req.user.id) {
    return res.status(400).json({ message: "Khong duoc xoa tai khoan dang dang nhap." });
  }

  const result = db.prepare("DELETE FROM users WHERE id = ?").run(req.params.id);
  if (!result.changes) {
    return res.status(404).json({ message: "Khong tim thay tai khoan." });
  }

  return res.json({ message: "Xoa tai khoan thanh cong." });
});

module.exports = router;
