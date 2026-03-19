const express = require("express");
const { db } = require("../db/database");

const router = express.Router();

function nextReaderId() {
  const last = db.prepare(`
    SELECT reader_id
    FROM readers
    ORDER BY CAST(SUBSTR(reader_id, 2) AS INTEGER) DESC
    LIMIT 1
  `).get();
  const nextNumber = last ? Number(last.reader_id.slice(1)) + 1 : 1;
  return `R${String(nextNumber).padStart(3, "0")}`;
}

router.get("/", (req, res) => {
  const { search = "", gender = "" } = req.query;
  let query = `
    SELECT reader_id, full_name, class_name, birth_date, gender, created_at
    FROM readers
    WHERE 1 = 1
  `;
  const params = {};

  if (search) {
    query += " AND (reader_id LIKE @search OR full_name LIKE @search OR class_name LIKE @search)";
    params.search = `%${search}%`;
  }
  if (gender) {
    query += " AND gender = @gender";
    params.gender = gender;
  }

  query += " ORDER BY created_at DESC, reader_id DESC";
  const rows = db.prepare(query).all(params);
  return res.json(rows);
});

router.post("/", (req, res) => {
  const { full_name, class_name, birth_date, gender } = req.body;
  if (!full_name || !class_name || !birth_date || !gender) {
    return res.status(400).json({ message: "Vui long nhap day du thong tin doc gia." });
  }

  const readerId = nextReaderId();
  db.prepare(`
    INSERT INTO readers (reader_id, full_name, class_name, birth_date, gender)
    VALUES (?, ?, ?, ?, ?)
  `).run(readerId, full_name.trim(), class_name.trim(), birth_date, gender);

  return res.status(201).json({ message: "Them doc gia thanh cong.", reader_id: readerId });
});

router.put("/:id", (req, res) => {
  const { full_name, class_name, birth_date, gender } = req.body;
  if (!full_name || !class_name || !birth_date || !gender) {
    return res.status(400).json({ message: "Vui long nhap day du thong tin doc gia." });
  }

  const result = db.prepare(`
    UPDATE readers
    SET full_name = ?, class_name = ?, birth_date = ?, gender = ?
    WHERE reader_id = ?
  `).run(full_name.trim(), class_name.trim(), birth_date, gender, req.params.id);

  if (!result.changes) {
    return res.status(404).json({ message: "Khong tim thay doc gia." });
  }

  return res.json({ message: "Cap nhat doc gia thanh cong." });
});

router.delete("/:id", (req, res) => {
  const active = db.prepare(`
    SELECT COUNT(*) AS total
    FROM borrow_records
    WHERE reader_id = ? AND status = 'borrowing'
  `).get(req.params.id).total;

  if (active > 0) {
    return res.status(400).json({ message: "Doc gia dang muon sach, khong the xoa." });
  }

  const result = db.prepare("DELETE FROM readers WHERE reader_id = ?").run(req.params.id);
  if (!result.changes) {
    return res.status(404).json({ message: "Khong tim thay doc gia." });
  }

  return res.json({ message: "Xoa doc gia thanh cong." });
});

module.exports = router;
