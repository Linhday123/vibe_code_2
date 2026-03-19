const express = require("express");
const { db } = require("../db/database");

const router = express.Router();

function nextSpecId() {
  const last = db.prepare(`
    SELECT spec_id
    FROM specializations
    ORDER BY CAST(SUBSTR(spec_id, 5) AS INTEGER) DESC
    LIMIT 1
  `).get();
  const nextNumber = last ? Number(last.spec_id.slice(4)) + 1 : 1;
  return `SPEC${String(nextNumber).padStart(3, "0")}`;
}

router.get("/", (_req, res) => {
  const rows = db.prepare(`
    SELECT s.spec_id, s.spec_name, s.description, COUNT(bt.title_id) AS total_titles
    FROM specializations s
    LEFT JOIN book_titles bt ON bt.spec_id = s.spec_id
    GROUP BY s.spec_id
    ORDER BY s.spec_name ASC
  `).all();
  return res.json(rows);
});

router.post("/", (req, res) => {
  const { spec_name, description } = req.body;
  if (!spec_name) {
    return res.status(400).json({ message: "Ten chuyen nganh la bat buoc." });
  }

  db.prepare(`
    INSERT INTO specializations (spec_id, spec_name, description)
    VALUES (?, ?, ?)
  `).run(nextSpecId(), spec_name.trim(), description || "");

  return res.status(201).json({ message: "Them chuyen nganh thanh cong." });
});

router.put("/:id", (req, res) => {
  const { spec_name, description } = req.body;
  if (!spec_name) {
    return res.status(400).json({ message: "Ten chuyen nganh la bat buoc." });
  }

  const result = db.prepare(`
    UPDATE specializations
    SET spec_name = ?, description = ?
    WHERE spec_id = ?
  `).run(spec_name.trim(), description || "", req.params.id);

  if (!result.changes) {
    return res.status(404).json({ message: "Khong tim thay chuyen nganh." });
  }

  return res.json({ message: "Cap nhat chuyen nganh thanh cong." });
});

router.delete("/:id", (req, res) => {
  const totalTitles = db.prepare("SELECT COUNT(*) AS total FROM book_titles WHERE spec_id = ?").get(req.params.id).total;
  if (totalTitles > 0) {
    return res.status(400).json({ message: "Khong the xoa chuyen nganh dang co dau sach." });
  }

  const result = db.prepare("DELETE FROM specializations WHERE spec_id = ?").run(req.params.id);
  if (!result.changes) {
    return res.status(404).json({ message: "Khong tim thay chuyen nganh." });
  }

  return res.json({ message: "Xoa chuyen nganh thanh cong." });
});

module.exports = router;
