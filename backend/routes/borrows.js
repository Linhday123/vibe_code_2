const express = require("express");
const { db } = require("../db/database");

const router = express.Router();

function nextRecordId() {
  const last = db.prepare(`
    SELECT record_id
    FROM borrow_records
    ORDER BY CAST(SUBSTR(record_id, 3) AS INTEGER) DESC
    LIMIT 1
  `).get();
  const nextNumber = last ? Number(last.record_id.slice(2)) + 1 : 1;
  return `BR${String(nextNumber).padStart(3, "0")}`;
}

router.get("/", (req, res) => {
  const { status = "", start_date = "", end_date = "" } = req.query;
  let query = `
    SELECT
      br.record_id,
      br.copy_id,
      br.reader_id,
      br.librarian_id,
      br.borrow_date,
      br.return_date,
      br.status,
      r.full_name AS reader_name,
      r.class_name,
      bt.title_name,
      bt.author,
      u.full_name AS librarian_name,
      CAST(julianday(COALESCE(br.return_date, date('now'))) - julianday(br.borrow_date) AS INTEGER) AS borrow_days
    FROM borrow_records br
    JOIN readers r ON r.reader_id = br.reader_id
    JOIN book_copies bc ON bc.copy_id = br.copy_id
    JOIN book_titles bt ON bt.title_id = bc.title_id
    JOIN users u ON u.id = br.librarian_id
    WHERE 1 = 1
  `;
  const params = {};

  if (status) {
    query += " AND br.status = @status";
    params.status = status;
  }
  if (start_date) {
    query += " AND br.borrow_date >= @start_date";
    params.start_date = start_date;
  }
  if (end_date) {
    query += " AND br.borrow_date <= @end_date";
    params.end_date = end_date;
  }

  query += " ORDER BY br.borrow_date DESC, br.record_id DESC";
  const rows = db.prepare(query).all(params);
  return res.json(rows);
});

router.post("/", (req, res) => {
  const { copy_id, reader_id } = req.body;
  if (!copy_id || !reader_id) {
    return res.status(400).json({ message: "Doc gia va ban sao la bat buoc." });
  }

  const reader = db.prepare("SELECT * FROM readers WHERE reader_id = ?").get(reader_id);
  if (!reader) {
    return res.status(404).json({ message: "Khong tim thay doc gia." });
  }

  const copy = db.prepare("SELECT * FROM book_copies WHERE copy_id = ?").get(copy_id);
  if (!copy) {
    return res.status(404).json({ message: "Khong tim thay ban sao." });
  }

  const activeBorrow = db.prepare(`
    SELECT record_id FROM borrow_records WHERE reader_id = ? AND status = 'borrowing'
  `).get(reader_id);
  if (activeBorrow) {
    return res.status(409).json({ message: "Moi doc gia chi duoc co 1 phieu muon dang active." });
  }

  if (copy.status !== "available") {
    return res.status(400).json({ message: "Chi duoc muon ban sao co trang thai available." });
  }

  const recordId = nextRecordId();

  db.transaction(() => {
    // Tao phieu muon va dong thoi chuyen trang thai ban sao sang borrowed de dam bao dong bo nghiep vu.
    db.prepare(`
      INSERT INTO borrow_records (record_id, copy_id, reader_id, librarian_id, borrow_date, status)
      VALUES (?, ?, ?, ?, date('now'), 'borrowing')
    `).run(recordId, copy_id, reader_id, req.user.id);

    db.prepare(`
      UPDATE book_copies
      SET status = 'borrowed'
      WHERE copy_id = ?
    `).run(copy_id);
  })();

  return res.status(201).json({ message: "Tao phieu muon thanh cong.", record_id: recordId });
});

router.put("/:id/return", (req, res) => {
  const record = db.prepare("SELECT * FROM borrow_records WHERE record_id = ?").get(req.params.id);
  if (!record) {
    return res.status(404).json({ message: "Khong tim thay phieu muon." });
  }
  if (record.status === "returned") {
    return res.status(400).json({ message: "Phieu muon nay da duoc tra." });
  }

  db.transaction(() => {
    db.prepare(`
      UPDATE borrow_records
      SET status = 'returned', return_date = date('now')
      WHERE record_id = ?
    `).run(req.params.id);

    db.prepare(`
      UPDATE book_copies
      SET status = 'available'
      WHERE copy_id = ?
    `).run(record.copy_id);
  })();

  return res.json({ message: "Tra sach thanh cong." });
});

module.exports = router;
