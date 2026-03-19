const express = require("express");
const { db } = require("../db/database");

const router = express.Router();

router.get("/stats", (_req, res) => {
  const totalReaders = db.prepare("SELECT COUNT(*) AS total FROM readers").get().total;
  const totalBookTitles = db.prepare("SELECT COUNT(*) AS total FROM book_titles").get().total;
  const totalCopies = db.prepare("SELECT COUNT(*) AS total FROM book_copies").get().total;
  const totalBorrowing = db.prepare("SELECT COUNT(*) AS total FROM borrow_records WHERE status = 'borrowing'").get().total;

  const monthlyBorrowed = db.prepare(`
    SELECT strftime('%m', borrow_date) AS month, COUNT(*) AS total
    FROM borrow_records
    WHERE strftime('%Y', borrow_date) = strftime('%Y', 'now')
    GROUP BY strftime('%m', borrow_date)
    ORDER BY month ASC
  `).all();

  const topBooks = db.prepare(`
    SELECT
      bt.title_name,
      bt.author,
      COUNT(br.record_id) AS borrow_count
    FROM book_titles bt
    LEFT JOIN book_copies bc ON bc.title_id = bt.title_id
    LEFT JOIN borrow_records br ON br.copy_id = bc.copy_id
    GROUP BY bt.title_id
    ORDER BY borrow_count DESC, bt.title_name ASC
    LIMIT 5
  `).all();

  const recentBorrows = db.prepare(`
    SELECT
      br.record_id,
      r.full_name AS reader_name,
      bt.title_name,
      br.borrow_date,
      br.status
    FROM borrow_records br
    JOIN readers r ON r.reader_id = br.reader_id
    JOIN book_copies bc ON bc.copy_id = br.copy_id
    JOIN book_titles bt ON bt.title_id = bc.title_id
    ORDER BY br.borrow_date DESC, br.record_id DESC
    LIMIT 5
  `).all();

  const unreturnedReaders = db.prepare(`
    SELECT
      r.reader_id,
      r.full_name,
      bt.title_name,
      CAST(julianday(date('now')) - julianday(br.borrow_date) AS INTEGER) AS borrow_days
    FROM borrow_records br
    JOIN readers r ON r.reader_id = br.reader_id
    JOIN book_copies bc ON bc.copy_id = br.copy_id
    JOIN book_titles bt ON bt.title_id = bc.title_id
    WHERE br.status = 'borrowing'
    ORDER BY borrow_days DESC, br.borrow_date ASC
    LIMIT 5
  `).all();

  res.json({
    cards: {
      totalReaders,
      totalBookTitles,
      totalCopies,
      totalBorrowing
    },
    monthlyBorrowed,
    topBooks,
    recentBorrows,
    unreturnedReaders
  });
});

module.exports = router;
