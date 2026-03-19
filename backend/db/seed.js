const bcrypt = require("bcryptjs");
const { db } = require("./database");

function exists(tableName) {
  return db.prepare(`SELECT COUNT(*) AS total FROM ${tableName}`).get().total > 0;
}

function seedUsers() {
  if (exists("users")) return;

  const insert = db.prepare(`
    INSERT INTO users (username, password_hash, full_name, email, role)
    VALUES (?, ?, ?, ?, ?)
  `);

  insert.run("admin", bcrypt.hashSync("admin123", 10), "Quan tri he thong", "admin@unilib.local", "admin");
  insert.run("librarian1", bcrypt.hashSync("lib123", 10), "Thu thu chinh", "librarian@unilib.local", "librarian");
}

function seedSpecializations() {
  if (exists("specializations")) return;

  const insert = db.prepare(`
    INSERT INTO specializations (spec_id, spec_name, description)
    VALUES (?, ?, ?)
  `);

  insert.run("SPEC001", "CNTT", "Sach phuc vu nganh cong nghe thong tin");
  insert.run("SPEC002", "Kinh te", "Sach phuc vu khoi nganh kinh te va quan tri");
  insert.run("SPEC003", "Ngoai ngu", "Sach phuc vu hoc ngoai ngu va giao tiep");
}

function seedReaders() {
  if (exists("readers")) return;

  const insert = db.prepare(`
    INSERT INTO readers (reader_id, full_name, class_name, birth_date, gender)
    VALUES (?, ?, ?, ?, ?)
  `);

  insert.run("R001", "Nguyen Minh Anh", "CNTT1", "2004-03-10", "female");
  insert.run("R002", "Tran Gia Bao", "QTKD2", "2003-07-21", "male");
  insert.run("R003", "Le Thu Cuc", "NNA3", "2004-11-05", "female");
}

function seedBookTitlesAndCopies() {
  if (exists("book_titles")) return;

  const titleInsert = db.prepare(`
    INSERT INTO book_titles (title_id, title_name, publisher, pages, dimensions, author, quantity, spec_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const copyInsert = db.prepare(`
    INSERT INTO book_copies (copy_id, title_id, status, import_date)
    VALUES (?, ?, ?, ?)
  `);

  const titles = [
    ["T001", "Lap trinh React can ban", "NXB Tre", 320, "16x24", "Nguyen Van Dev", 3, "SPEC001"],
    ["T002", "Co so du lieu thuc hanh", "NXB Giao duc", 280, "16x24", "Tran SQL", 2, "SPEC001"],
    ["T003", "Quan tri hoc hien dai", "NXB Kinh te", 250, "16x24", "Le Business", 2, "SPEC002"],
    ["T004", "Tieng Anh giao tiep hoc duong", "NXB Ngoai ngu", 210, "14x20", "Hoang English", 3, "SPEC003"],
    ["T005", "Ky nang viet hoc thuat", "NXB Dai hoc", 190, "14x20", "Pham Writing", 2, "SPEC003"]
  ];

  const copies = [
    ["C001", "T001", "borrowed", "2025-01-05"],
    ["C002", "T001", "available", "2025-01-05"],
    ["C003", "T001", "available", "2025-01-05"],
    ["C004", "T002", "available", "2025-01-10"],
    ["C005", "T002", "available", "2025-01-10"],
    ["C006", "T003", "available", "2025-01-18"],
    ["C007", "T003", "available", "2025-01-18"],
    ["C008", "T004", "available", "2025-02-01"],
    ["C009", "T004", "available", "2025-02-01"],
    ["C010", "T004", "available", "2025-02-01"],
    ["C011", "T005", "borrowed", "2025-02-10"],
    ["C012", "T005", "available", "2025-02-10"]
  ];

  db.transaction(() => {
    titles.forEach((item) => titleInsert.run(...item));
    copies.forEach((item) => copyInsert.run(...item));
  })();
}

function seedBorrowRecords() {
  if (exists("borrow_records")) return;

  const librarian = db.prepare("SELECT id FROM users WHERE username = ?").get("librarian1");
  const insert = db.prepare(`
    INSERT INTO borrow_records (record_id, copy_id, reader_id, librarian_id, borrow_date, return_date, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insert.run("BR001", "C001", "R001", librarian.id, "2026-03-10", null, "borrowing");
  insert.run("BR002", "C011", "R002", librarian.id, "2026-02-20", "2026-03-01", "returned");
}

function seedAll() {
  seedUsers();
  seedSpecializations();
  seedReaders();
  seedBookTitlesAndCopies();
  seedBorrowRecords();
}

module.exports = {
  seedAll
};
