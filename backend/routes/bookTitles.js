const express = require("express");
const { db } = require("../db/database");

const router = express.Router();

function nextTitleId() {
  const last = db.prepare(`
    SELECT title_id
    FROM book_titles
    ORDER BY CAST(SUBSTR(title_id, 2) AS INTEGER) DESC
    LIMIT 1
  `).get();
  const nextNumber = last ? Number(last.title_id.slice(1)) + 1 : 1;
  return `T${String(nextNumber).padStart(3, "0")}`;
}

router.get("/", (req, res) => {
  const { search = "", spec_id = "" } = req.query;
  let query = `
    SELECT
      bt.title_id,
      bt.title_name,
      bt.publisher,
      bt.pages,
      bt.dimensions,
      bt.author,
      bt.quantity,
      bt.spec_id,
      s.spec_name
    FROM book_titles bt
    LEFT JOIN specializations s ON s.spec_id = bt.spec_id
    WHERE 1 = 1
  `;
  const params = {};

  if (search) {
    query += " AND (bt.title_id LIKE @search OR bt.title_name LIKE @search OR bt.author LIKE @search OR bt.publisher LIKE @search)";
    params.search = `%${search}%`;
  }
  if (spec_id) {
    query += " AND bt.spec_id = @spec_id";
    params.spec_id = spec_id;
  }

  query += " ORDER BY bt.title_name ASC";
  const rows = db.prepare(query).all(params);
  return res.json(rows);
});

router.post("/", (req, res) => {
  const { title_name, publisher, pages, dimensions, author, spec_id } = req.body;
  if (!title_name || !author || !spec_id) {
    return res.status(400).json({ message: "Ten sach, tac gia va chuyen nganh la bat buoc." });
  }

  db.prepare(`
    INSERT INTO book_titles (title_id, title_name, publisher, pages, dimensions, author, quantity, spec_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(nextTitleId(), title_name.trim(), publisher || "", Number(pages || 0), dimensions || "", author.trim(), 0, spec_id);

  return res.status(201).json({ message: "Them dau sach thanh cong." });
});

router.put("/:id", (req, res) => {
  const { title_name, publisher, pages, dimensions, author, spec_id } = req.body;
  if (!title_name || !author || !spec_id) {
    return res.status(400).json({ message: "Ten sach, tac gia va chuyen nganh la bat buoc." });
  }

  const result = db.prepare(`
    UPDATE book_titles
    SET title_name = ?, publisher = ?, pages = ?, dimensions = ?, author = ?, spec_id = ?
    WHERE title_id = ?
  `).run(title_name.trim(), publisher || "", Number(pages || 0), dimensions || "", author.trim(), spec_id, req.params.id);

  if (!result.changes) {
    return res.status(404).json({ message: "Khong tim thay dau sach." });
  }

  return res.json({ message: "Cap nhat dau sach thanh cong." });
});

router.delete("/:id", (req, res) => {
  const copies = db.prepare("SELECT COUNT(*) AS total FROM book_copies WHERE title_id = ?").get(req.params.id).total;
  if (copies > 0) {
    return res.status(400).json({ message: "Khong duoc xoa dau sach neu con ban sao." });
  }

  const result = db.prepare("DELETE FROM book_titles WHERE title_id = ?").run(req.params.id);
  if (!result.changes) {
    return res.status(404).json({ message: "Khong tim thay dau sach." });
  }

  return res.json({ message: "Xoa dau sach thanh cong." });
});

module.exports = router;
