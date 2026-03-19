const express = require("express");
const { db } = require("../db/database");

const router = express.Router();

function nextCopyId() {
  const last = db.prepare(`
    SELECT copy_id
    FROM book_copies
    ORDER BY CAST(SUBSTR(copy_id, 2) AS INTEGER) DESC
    LIMIT 1
  `).get();
  const nextNumber = last ? Number(last.copy_id.slice(1)) + 1 : 1;
  return `C${String(nextNumber).padStart(3, "0")}`;
}

function syncQuantity(titleId) {
  const total = db.prepare("SELECT COUNT(*) AS total FROM book_copies WHERE title_id = ?").get(titleId).total;
  db.prepare("UPDATE book_titles SET quantity = ? WHERE title_id = ?").run(total, titleId);
}

router.get("/", (req, res) => {
  const { title_id = "" } = req.query;
  let query = `
    SELECT bc.copy_id, bc.title_id, bc.status, bc.import_date, bt.title_name, bt.author
    FROM book_copies bc
    JOIN book_titles bt ON bt.title_id = bc.title_id
    WHERE 1 = 1
  `;
  const params = {};

  if (title_id) {
    query += " AND bc.title_id = @title_id";
    params.title_id = title_id;
  }

  query += " ORDER BY bc.import_date DESC, bc.copy_id DESC";
  const rows = db.prepare(query).all(params);
  return res.json(rows);
});

router.post("/", (req, res) => {
  const { title_id, status, import_date } = req.body;
  if (!title_id) {
    return res.status(400).json({ message: "Dau sach la bat buoc." });
  }

  const copyId = nextCopyId();
  db.transaction(() => {
    db.prepare(`
      INSERT INTO book_copies (copy_id, title_id, status, import_date)
      VALUES (?, ?, ?, ?)
    `).run(copyId, title_id, status || "available", import_date || new Date().toISOString().slice(0, 10));
    syncQuantity(title_id);
  })();

  return res.status(201).json({ message: "Them ban sao thanh cong.", copy_id: copyId });
});

router.put("/:id", (req, res) => {
  const { title_id, status, import_date } = req.body;
  if (!title_id) {
    return res.status(400).json({ message: "Dau sach la bat buoc." });
  }

  const current = db.prepare("SELECT * FROM book_copies WHERE copy_id = ?").get(req.params.id);
  if (!current) {
    return res.status(404).json({ message: "Khong tim thay ban sao." });
  }

  if (current.status === "borrowed" && status !== "borrowed") {
    const activeRecord = db.prepare(`
      SELECT record_id FROM borrow_records WHERE copy_id = ? AND status = 'borrowing'
    `).get(req.params.id);
    if (activeRecord) {
      return res.status(400).json({ message: "Ban sao dang duoc muon, khong the doi trang thai thu cong." });
    }
  }

  db.transaction(() => {
    db.prepare(`
      UPDATE book_copies
      SET title_id = ?, status = ?, import_date = ?
      WHERE copy_id = ?
    `).run(title_id, status || "available", import_date || current.import_date, req.params.id);
    syncQuantity(current.title_id);
    syncQuantity(title_id);
  })();

  return res.json({ message: "Cap nhat ban sao thanh cong." });
});

router.delete("/:id", (req, res) => {
  const current = db.prepare("SELECT * FROM book_copies WHERE copy_id = ?").get(req.params.id);
  if (!current) {
    return res.status(404).json({ message: "Khong tim thay ban sao." });
  }
  if (current.status === "borrowed") {
    return res.status(400).json({ message: "Khong duoc xoa ban sao dang duoc muon." });
  }

  db.transaction(() => {
    db.prepare("DELETE FROM book_copies WHERE copy_id = ?").run(req.params.id);
    syncQuantity(current.title_id);
  })();

  return res.json({ message: "Xoa ban sao thanh cong." });
});

module.exports = router;
