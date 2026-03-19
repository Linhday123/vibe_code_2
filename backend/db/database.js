const fs = require("fs");
const path = require("path");
const { DatabaseSync } = require("node:sqlite");

const dataDir = path.join(__dirname, "..", "data");
const dbPath = path.join(dataDir, "library.sqlite");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const nativeDb = new DatabaseSync(dbPath);
nativeDb.exec("PRAGMA foreign_keys = ON;");

const db = {
  exec(sql) {
    return nativeDb.exec(sql);
  },
  prepare(sql) {
    const statement = nativeDb.prepare(sql);
    return {
      all(params) {
        return params ? statement.all(params) : statement.all();
      },
      get(params) {
        return params ? statement.get(params) : statement.get();
      },
      run(...args) {
        const result = args.length ? statement.run(...args) : statement.run();
        return {
          changes: result.changes,
          lastInsertRowid: result.lastInsertRowid
        };
      }
    };
  },
  transaction(callback) {
    return (...args) => {
      nativeDb.exec("BEGIN");
      try {
        const result = callback(...args);
        nativeDb.exec("COMMIT");
        return result;
      } catch (error) {
        nativeDb.exec("ROLLBACK");
        throw error;
      }
    };
  }
};

function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      full_name TEXT NOT NULL,
      email TEXT,
      role TEXT CHECK(role IN ('admin','librarian')) DEFAULT 'librarian',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS readers (
      reader_id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      class_name TEXT NOT NULL,
      birth_date DATE NOT NULL,
      gender TEXT CHECK(gender IN ('male','female')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS specializations (
      spec_id TEXT PRIMARY KEY,
      spec_name TEXT NOT NULL,
      description TEXT
    );

    CREATE TABLE IF NOT EXISTS book_titles (
      title_id TEXT PRIMARY KEY,
      title_name TEXT NOT NULL,
      publisher TEXT,
      pages INTEGER,
      dimensions TEXT,
      author TEXT,
      quantity INTEGER DEFAULT 0,
      spec_id TEXT REFERENCES specializations(spec_id)
    );

    CREATE TABLE IF NOT EXISTS book_copies (
      copy_id TEXT PRIMARY KEY,
      title_id TEXT REFERENCES book_titles(title_id),
      status TEXT CHECK(status IN ('available','borrowed')) DEFAULT 'available',
      import_date DATE DEFAULT CURRENT_DATE
    );

    CREATE TABLE IF NOT EXISTS borrow_records (
      record_id TEXT PRIMARY KEY,
      copy_id TEXT REFERENCES book_copies(copy_id),
      reader_id TEXT REFERENCES readers(reader_id),
      librarian_id INTEGER REFERENCES users(id),
      borrow_date DATE DEFAULT CURRENT_DATE,
      return_date DATE,
      status TEXT CHECK(status IN ('borrowing','returned')) DEFAULT 'borrowing'
    );

    CREATE INDEX IF NOT EXISTS idx_readers_class_name ON readers(class_name);
    CREATE INDEX IF NOT EXISTS idx_book_titles_spec_id ON book_titles(spec_id);
    CREATE INDEX IF NOT EXISTS idx_book_copies_title_id ON book_copies(title_id);
    CREATE INDEX IF NOT EXISTS idx_borrow_records_reader_id ON borrow_records(reader_id);
    CREATE INDEX IF NOT EXISTS idx_borrow_records_copy_id ON borrow_records(copy_id);
    CREATE INDEX IF NOT EXISTS idx_borrow_records_status ON borrow_records(status);
  `);
}

module.exports = {
  db,
  initDatabase
};
