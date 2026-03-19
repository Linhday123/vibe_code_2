const express = require("express");
const { db } = require("../db/database");

const router = express.Router();

function buildCsv(rows, headers) {
  return [
    headers.map((item) => item.label).join(","),
    ...rows.map((row) =>
      headers
        .map((item) => `"${String(row[item.key] ?? "").replace(/"/g, '""')}"`)
        .join(",")
    )
  ].join("\n");
}

router.get("/most-borrowed", (_req, res) => {
  const rows = db.prepare(`
    SELECT
      bt.title_id,
      bt.title_name,
      bt.author,
      COUNT(br.record_id) AS borrow_count
    FROM book_titles bt
    LEFT JOIN book_copies bc ON bc.title_id = bt.title_id
    LEFT JOIN borrow_records br ON br.copy_id = bc.copy_id
    GROUP BY bt.title_id
    ORDER BY borrow_count DESC, bt.title_name ASC
    LIMIT 10
  `).all();
  return res.json(rows);
});

router.get("/unreturned", (_req, res) => {
  const rows = db.prepare(`
    SELECT
      r.reader_id,
      r.full_name,
      r.class_name,
      bt.title_name,
      bc.copy_id,
      br.borrow_date,
      CAST(julianday(date('now')) - julianday(br.borrow_date) AS INTEGER) AS borrow_days
    FROM borrow_records br
    JOIN readers r ON r.reader_id = br.reader_id
    JOIN book_copies bc ON bc.copy_id = br.copy_id
    JOIN book_titles bt ON bt.title_id = bc.title_id
    WHERE br.status = 'borrowing'
    ORDER BY borrow_days DESC, br.borrow_date ASC
  `).all();
  return res.json(rows);
});

router.get("/most-borrowed/csv", (_req, res) => {
  const rows = db.prepare(`
    SELECT
      bt.title_id,
      bt.title_name,
      bt.author,
      COUNT(br.record_id) AS borrow_count
    FROM book_titles bt
    LEFT JOIN book_copies bc ON bc.title_id = bt.title_id
    LEFT JOIN borrow_records br ON br.copy_id = bc.copy_id
    GROUP BY bt.title_id
    ORDER BY borrow_count DESC, bt.title_name ASC
    LIMIT 10
  `).all();

  const csv = buildCsv(rows, [
    { key: "title_id", label: "Ma dau sach" },
    { key: "title_name", label: "Ten sach" },
    { key: "author", label: "Tac gia" },
    { key: "borrow_count", label: "So luot muon" }
  ]);
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.send(`\uFEFF${csv}`);
});

router.get("/unreturned/csv", (_req, res) => {
  const rows = db.prepare(`
    SELECT
      r.reader_id,
      r.full_name,
      r.class_name,
      bt.title_name,
      bc.copy_id,
      br.borrow_date,
      CAST(julianday(date('now')) - julianday(br.borrow_date) AS INTEGER) AS borrow_days
    FROM borrow_records br
    JOIN readers r ON r.reader_id = br.reader_id
    JOIN book_copies bc ON bc.copy_id = br.copy_id
    JOIN book_titles bt ON bt.title_id = bc.title_id
    WHERE br.status = 'borrowing'
    ORDER BY borrow_days DESC, br.borrow_date ASC
  `).all();

  const csv = buildCsv(rows, [
    { key: "reader_id", label: "Ma doc gia" },
    { key: "full_name", label: "Ho ten" },
    { key: "class_name", label: "Lop" },
    { key: "title_name", label: "Ten sach" },
    { key: "copy_id", label: "Ma ban sao" },
    { key: "borrow_date", label: "Ngay muon" },
    { key: "borrow_days", label: "So ngay" }
  ]);
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.send(`\uFEFF${csv}`);
});

module.exports = router;
