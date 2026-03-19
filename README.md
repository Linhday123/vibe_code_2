# UniLib System - He thong quan ly thu vien dai hoc

## 1. Tong quan de tai
- Ten de tai: Xay dung he thong quan ly thu vien dai hoc
- Muc tieu: so hoa nghiep vu quan ly doc gia, chuyen nganh, dau sach, ban sao, muon tra sach va bao cao thong ke
- Pham vi MVP:
  - Dang nhap JWT
  - Phan quyen `admin` va `librarian`
  - CRUD doc gia, chuyen nganh, dau sach, ban sao, tai khoan
  - Tao phieu muon, tra sach
  - Dashboard thong ke
  - Bao cao sach muon nhieu va doc gia chua tra

---

## 2. Cau truc du an

```text
library-system/
├── backend/
│   ├── db/
│   │   ├── database.js
│   │   └── seed.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── readers.js
│   │   ├── specializations.js
│   │   ├── bookTitles.js
│   │   ├── bookCopies.js
│   │   ├── borrows.js
│   │   ├── reports.js
│   │   └── dashboard.js
│   ├── app.js
│   └── package.json
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── lib/
│       │   └── api.js
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── hooks/
│       │   ├── useToast.js
│       │   └── usePagination.js
│       ├── components/
│       │   ├── layout/
│       │   │   ├── AppLayout.jsx
│       │   │   ├── Sidebar.jsx
│       │   │   └── Topbar.jsx
│       │   ├── ui/
│       │   │   ├── Modal.jsx
│       │   │   ├── DataTable.jsx
│       │   │   ├── Toast.jsx
│       │   │   ├── ConfirmDialog.jsx
│       │   │   ├── Badge.jsx
│       │   │   ├── StatCard.jsx
│       │   │   ├── EmptyState.jsx
│       │   │   └── LoadingSpinner.jsx
│       │   └── forms/
│       │       ├── ReaderForm.jsx
│       │       ├── BookTitleForm.jsx
│       │       ├── BookCopyForm.jsx
│       │       ├── SpecializationForm.jsx
│       │       ├── BorrowForm.jsx
│       │       └── UserForm.jsx
│       └── pages/
│           ├── Login.jsx
│           ├── Dashboard.jsx
│           ├── Readers.jsx
│           ├── BookTitles.jsx
│           ├── BookCopies.jsx
│           ├── Specializations.jsx
│           ├── Borrows.jsx
│           ├── Reports.jsx
│           └── Users.jsx
└── README.md
```

---

## 3. Huong dan chay du an

### 3.1. Backend
```bash
cd backend
npm install
npm start
```

- Backend mac dinh chay o `http://localhost:3000`

### 3.2. Frontend
```bash
cd frontend
npm install
npm run dev
```

- Frontend mac dinh chay o `http://localhost:5173`

### 3.3. Tai khoan mac dinh
- Admin:
  - Username: `admin`
  - Password: `admin123`
- Librarian:
  - Username: `librarian1`
  - Password: `lib123`

### 3.4. Seed data
- 3 chuyen nganh: CNTT, Kinh te, Ngoai ngu
- 5 dau sach
- Moi dau sach co 2-3 ban sao
- 3 doc gia mau
- 2 phieu muon mau:
  - 1 dang muon
  - 1 da tra

---

## 4. PHAN 1 - PHAN TICH HE THONG

### 4.1. Actor

| Actor | Vai tro |
|---|---|
| Admin | Quan tri he thong, quan ly tai khoan, phan quyen, giam sat tong the |
| Thu thu | Van hanh nghiep vu thu vien: quan ly doc gia, sach, ban sao, muon tra, xem bao cao |
| Sinh vien / Doc gia | Doi tuong su dung thu vien, duoc dang ky the, muon sach, tra sach |

### 4.2. Use case theo actor

#### Admin
- Dang nhap he thong: truy cap vao khu vuc quan tri
- Quan ly tai khoan: them, sua, xoa tai khoan thu thu hoac admin khac
- Phan quyen: quy dinh vai tro `admin` hoac `librarian`
- Xem dashboard: theo doi thong ke tong quan
- Xem bao cao: theo doi sach muon nhieu va doc gia chua tra

#### Thu thu
- Dang nhap he thong: truy cap vao khu vuc nghiep vu
- Quan ly doc gia: them, sua, xoa, in the
- Quan ly chuyen nganh: them, sua, xoa chuyen nganh
- Quan ly dau sach: them, sua, xoa dau sach
- Quan ly ban sao: them, sua, xoa ban sao
- Tao phieu muon: lap phieu muon cho doc gia
- Tra sach: cap nhat phieu muon da tra
- Xem lich su muon tra: loc theo trang thai, ngay muon
- Xem dashboard va bao cao: ho tro van hanh thu vien

#### Sinh vien / Doc gia
- Dang ky the thu vien: thong qua thu thu cap the
- Muon sach: duoc thu thu tao phieu muon
- Tra sach: duoc thu thu xac nhan tra

### 4.3. Use Case Diagram mo ta text

- `Admin` ket noi toi:
  - `Dang nhap`
  - `Quan ly tai khoan`
  - `Xem dashboard`
  - `Xem bao cao`
- `Thu thu` ket noi toi:
  - `Dang nhap`
  - `Quan ly doc gia`
  - `Quan ly chuyen nganh`
  - `Quan ly dau sach`
  - `Quan ly ban sao`
  - `Tao phieu muon`
  - `Tra sach`
  - `Xem lich su muon tra`
  - `Xem dashboard`
  - `Xem bao cao`
- `Sinh vien / Doc gia` ket noi gian tiep thong qua `Thu thu` toi:
  - `Dang ky the`
  - `Muon sach`
  - `Tra sach`

### 4.4. Phan tich du lieu

#### Entity `users`
- `id`: khoa chinh tang tu dong
- `username`: ten dang nhap duy nhat
- `password_hash`: mat khau da ma hoa
- `full_name`: ho ten
- `email`: email
- `role`: `admin` hoac `librarian`
- `created_at`: ngay tao

#### Entity `readers`
- `reader_id`: ma doc gia
- `full_name`: ho ten
- `class_name`: lop hoc
- `birth_date`: ngay sinh
- `gender`: gioi tinh
- `created_at`: ngay tao

#### Entity `specializations`
- `spec_id`: ma chuyen nganh
- `spec_name`: ten chuyen nganh
- `description`: mo ta

#### Entity `book_titles`
- `title_id`: ma dau sach
- `title_name`: ten sach
- `publisher`: nha xuat ban
- `pages`: so trang
- `dimensions`: kich thuoc
- `author`: tac gia
- `quantity`: tong so ban sao
- `spec_id`: ma chuyen nganh

#### Entity `book_copies`
- `copy_id`: ma ban sao
- `title_id`: ma dau sach
- `status`: `available` hoac `borrowed`
- `import_date`: ngay nhap

#### Entity `borrow_records`
- `record_id`: ma phieu muon
- `copy_id`: ma ban sao
- `reader_id`: ma doc gia
- `librarian_id`: ma thu thu lap phieu
- `borrow_date`: ngay muon
- `return_date`: ngay tra
- `status`: `borrowing` hoac `returned`

### 4.5. Business rules

1. Moi doc gia chi duoc co 1 phieu muon dang active (`status = borrowing`)
2. Chi duoc muon ban sao co `status = available`
3. Khi tao phieu muon:
   - Tao `borrow_records`
   - Cap nhat `book_copies.status = borrowed`
4. Khi tra sach:
   - Cap nhat `book_copies.status = available`
   - Cap nhat `borrow_records.status = returned`
   - Cap nhat `borrow_records.return_date = ngay hien tai`
5. Tat ca route deu can JWT, tru `/api/auth/login`
6. Chi `admin` duoc truy cap `/api/users`
7. Khong duoc xoa dau sach neu con ban sao
8. Khong duoc xoa ban sao neu dang duoc muon
9. Khong duoc xoa doc gia neu dang co sach chua tra
10. Khong duoc xoa chuyen nganh neu dang duoc dau sach su dung
11. Khong duoc xoa tai khoan dang dang nhap
12. Khong duoc doi role cua chinh minh khi dang dang nhap bang vai tro admin

### 4.6. UI Pages

| Trang | Chuc nang |
|---|---|
| `Login` | Dang nhap he thong bang JWT |
| `Dashboard` | Hien thi 4 stat cards, bieu do, top sach, phieu muon gan day, doc gia chua tra |
| `Readers` | CRUD doc gia, tim kiem, loc gioi tinh, in the |
| `Specializations` | CRUD chuyen nganh theo layout card |
| `BookTitles` | CRUD dau sach, tim kiem, loc chuyen nganh, dieu huong sang ban sao |
| `BookCopies` | CRUD ban sao, xem theo tung dau sach hoac tat ca |
| `Borrows` | Tab dang muon, tao phieu muon, lich su |
| `Reports` | Bao cao sach muon nhieu va doc gia chua tra, xuat CSV |
| `Users` | CRUD tai khoan, chi admin duoc vao |

### 4.7. Bang mapping nghiep vu -> chuc nang -> API -> Database -> UI

| Nghiep vu | Chuc nang | API | Database | UI |
|---|---|---|---|---|
| Dang nhap | Xac thuc va cap JWT | `POST /api/auth/login` | `users` | `Login.jsx` |
| Quan ly doc gia | Them/sua/xoa/in the | `GET/POST/PUT/DELETE /api/readers` | `readers` | `Readers.jsx`, `ReaderForm.jsx` |
| Quan ly chuyen nganh | Them/sua/xoa | `GET/POST/PUT/DELETE /api/specializations` | `specializations` | `Specializations.jsx`, `SpecializationForm.jsx` |
| Quan ly dau sach | Them/sua/xoa/loc | `GET/POST/PUT/DELETE /api/book-titles` | `book_titles` | `BookTitles.jsx`, `BookTitleForm.jsx` |
| Quan ly ban sao | Them/sua/xoa/loc theo dau sach | `GET/POST/PUT/DELETE /api/book-copies` | `book_copies` | `BookCopies.jsx`, `BookCopyForm.jsx` |
| Muon sach | Tao phieu muon | `POST /api/borrows` | `borrow_records`, `book_copies` | `Borrows.jsx`, `BorrowForm.jsx` |
| Tra sach | Hoan tat phieu muon | `PUT /api/borrows/:id/return` | `borrow_records`, `book_copies` | `Borrows.jsx` |
| Xem thong ke | Tong hop dashboard | `GET /api/dashboard/stats` | Tong hop tu nhieu bang | `Dashboard.jsx` |
| Bao cao sach muon nhieu | Xem va xuat CSV | `GET /api/reports/most-borrowed` | `borrow_records`, `book_titles`, `book_copies` | `Reports.jsx` |
| Bao cao chua tra | Xem va xuat CSV | `GET /api/reports/unreturned` | `borrow_records`, `readers`, `book_copies` | `Reports.jsx` |
| Quan ly tai khoan | CRUD tai khoan | `GET/POST/PUT/DELETE /api/users` | `users` | `Users.jsx`, `UserForm.jsx` |

---

## 5. PHAN 2 - THIET KE HE THONG

### 5.1. Thiet ke database

#### Bang `users`
| Cot | Kieu du lieu | Rang buoc |
|---|---|---|
| `id` | INTEGER | PK, AUTOINCREMENT |
| `username` | TEXT | UNIQUE, NOT NULL |
| `password_hash` | TEXT | NOT NULL |
| `full_name` | TEXT | NOT NULL |
| `email` | TEXT | NULL |
| `role` | TEXT | CHECK(`admin`,`librarian`) |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP |

#### Bang `readers`
| Cot | Kieu du lieu | Rang buoc |
|---|---|---|
| `reader_id` | TEXT | PK |
| `full_name` | TEXT | NOT NULL |
| `class_name` | TEXT | NOT NULL |
| `birth_date` | DATE | NOT NULL |
| `gender` | TEXT | CHECK(`male`,`female`) |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP |

#### Bang `specializations`
| Cot | Kieu du lieu | Rang buoc |
|---|---|---|
| `spec_id` | TEXT | PK |
| `spec_name` | TEXT | NOT NULL |
| `description` | TEXT | NULL |

#### Bang `book_titles`
| Cot | Kieu du lieu | Rang buoc |
|---|---|---|
| `title_id` | TEXT | PK |
| `title_name` | TEXT | NOT NULL |
| `publisher` | TEXT | NULL |
| `pages` | INTEGER | NULL |
| `dimensions` | TEXT | NULL |
| `author` | TEXT | NULL |
| `quantity` | INTEGER | DEFAULT 0 |
| `spec_id` | TEXT | FK -> `specializations.spec_id` |

#### Bang `book_copies`
| Cot | Kieu du lieu | Rang buoc |
|---|---|---|
| `copy_id` | TEXT | PK |
| `title_id` | TEXT | FK -> `book_titles.title_id` |
| `status` | TEXT | CHECK(`available`,`borrowed`) |
| `import_date` | DATE | DEFAULT CURRENT_DATE |

#### Bang `borrow_records`
| Cot | Kieu du lieu | Rang buoc |
|---|---|---|
| `record_id` | TEXT | PK |
| `copy_id` | TEXT | FK -> `book_copies.copy_id` |
| `reader_id` | TEXT | FK -> `readers.reader_id` |
| `librarian_id` | INTEGER | FK -> `users.id` |
| `borrow_date` | DATE | DEFAULT CURRENT_DATE |
| `return_date` | DATE | NULL |
| `status` | TEXT | CHECK(`borrowing`,`returned`) |

### 5.2. ERD mo ta bang text
- `specializations (1)` -> `(n) book_titles`
- `book_titles (1)` -> `(n) book_copies`
- `readers (1)` -> `(n) borrow_records`
- `users (1)` -> `(n) borrow_records` voi vai tro nguoi lap phieu
- `book_copies (1)` -> `(n) borrow_records`

### 5.3. Thiet ke API

#### Auth
- `POST /api/auth/login`
  - Input:
    - `username`
    - `password`
  - Output:
    - `token`
    - `user`

#### Users
- `GET /api/users`
  - Output: danh sach tai khoan
- `POST /api/users`
  - Input: `username`, `password`, `full_name`, `email`, `role`
  - Output: thong bao them thanh cong
- `PUT /api/users/:id`
  - Input: `username`, `password?`, `full_name`, `email`, `role`
  - Output: thong bao cap nhat thanh cong
- `DELETE /api/users/:id`
  - Output: thong bao xoa thanh cong

#### Readers
- `GET /api/readers?search=&gender=`
- `POST /api/readers`
- `PUT /api/readers/:id`
- `DELETE /api/readers/:id`

#### Specializations
- `GET /api/specializations`
- `POST /api/specializations`
- `PUT /api/specializations/:id`
- `DELETE /api/specializations/:id`

#### Book titles
- `GET /api/book-titles?search=&spec_id=`
- `POST /api/book-titles`
- `PUT /api/book-titles/:id`
- `DELETE /api/book-titles/:id`

#### Book copies
- `GET /api/book-copies?title_id=`
- `POST /api/book-copies`
- `PUT /api/book-copies/:id`
- `DELETE /api/book-copies/:id`

#### Borrows
- `GET /api/borrows?status=&start_date=&end_date=`
- `POST /api/borrows`
  - Input: `reader_id`, `copy_id`
- `PUT /api/borrows/:id/return`

#### Reports
- `GET /api/reports/most-borrowed`
- `GET /api/reports/unreturned`
- `GET /api/reports/most-borrowed/csv`
- `GET /api/reports/unreturned/csv`

#### Dashboard
- `GET /api/dashboard/stats`

### 5.4. Workflow dang ky the
1. Thu thu mo trang `Readers`
2. Bam `Them doc gia`
3. Nhap ho ten, lop, ngay sinh, gioi tinh
4. He thong sinh `reader_id` tu dong
5. He thong luu vao bang `readers`
6. Thu thu co the mo modal preview va in the

### 5.5. Workflow muon sach
1. Thu thu mo trang `Borrows`
2. Chon tab `Tao phieu muon`
3. Buoc 1: tim va chon doc gia
4. Buoc 2: tim va chon ban sao `available`
5. He thong kiem tra:
   - doc gia chua co phieu `borrowing`
   - ban sao dang `available`
6. He thong tao `borrow_record`
7. He thong cap nhat `book_copies.status = borrowed`

### 5.6. Workflow tra sach
1. Thu thu vao tab `Dang muon`
2. Chon phieu muon can tra
3. Bam `Tra sach`
4. He thong cap nhat:
   - `borrow_records.status = returned`
   - `borrow_records.return_date = ngay hien tai`
   - `book_copies.status = available`
5. He thong dua phieu vao tab `Lich su`

### 5.7. MVP
- Dang nhap JWT
- CRUD doc gia
- CRUD chuyen nganh
- CRUD dau sach
- CRUD ban sao
- Tao phieu muon
- Tra sach
- Bao cao co ban

### 5.8. Iteration va improvement

#### Sau MVP se cai tien
- Them tim kiem nang cao cho tat ca module
- Them bo loc theo ngay, lop, chuyen nganh, tac gia
- Them in PDF the thu vien
- Them lich su dang nhap
- Them overdue policy va tinh tien phat
- Them upload anh bia sach

#### Toi uu
- Tach service layer cho backend
- Them schema validation voi Zod/Joi
- Them refresh token
- Them unit test va integration test
- Them pagination server-side
- Them export Excel/PDF

---

## 6. PHAN 3 - PHAT TRIEN UNG DUNG

### 6.1. Tech stack
- Frontend entry: `frontend/index.html` duy nhat
- Frontend app: React + React Router v6 + Tailwind CSS + Axios
- UI style: custom theo tinh than shadcn/ui + Lucide React icons
- Charts: Recharts
- Backend: Node.js + Express.js + SQLite + better-sqlite3
- Auth: JWT (`jsonwebtoken`) + `bcryptjs`

### 6.2. Design system ap dung

#### Color palette
- Primary: `#4F46E5`
- Primary Dark: `#3730A3`
- Primary Light: `#EEF2FF`
- Accent: `#7C3AED`
- Success: `#059669`
- Warning: `#D97706`
- Danger: `#DC2626`
- Background: `#F8FAFC`
- Surface: `#FFFFFF`
- Border: `#E2E8F0`
- Text Primary: `#1E293B`
- Text Muted: `#64748B`

#### Sidebar
- Gradient dung mau toi: `#1E1B4B -> #312E81 -> #4C1D95`
- Width 260px
- Fixed ben trai
- Menu active co border-left mau indigo
- User info nam o cuoi sidebar

#### Topbar
- Nen trang, sticky, border duoi
- Ben trai hien title va breadcrumb
- Ben phai hien bell icon va user block

#### Cards
- Border radius 16px
- Border `slate-200`
- Shadow nhe
- Hover transition diu

#### Table
- Header `bg-slate-50`, uppercase, text-xs
- Row hover `bg-slate-50`
- Pagination rong rai, nut active mau indigo

#### Buttons
- Primary: indigo
- Secondary: white + border
- Danger: red nhat
- Success: emerald nhat

#### Modal
- Backdrop blur + nen toi
- Hop modal bo goc lon
- Footer can phai

#### Badge
- Available: xanh la
- Borrowed: vang
- Returned: xanh duong
- Admin: indigo
- Librarian: slate

#### Toast
- Hien bottom-right
- Tu an sau 3 giay
- Mau theo tinh huong

### 6.3. Mo ta tung trang frontend

#### `Login.jsx`
- Split screen
- Ben trai: branding, icon sach, feature bullets
- Ben phai: form dang nhap, toggle show/hide password

#### `Dashboard.jsx`
- 4 stat cards
- 1 bieu do bar
- 1 danh sach top 5 sach muon nhieu
- 1 mini table phieu muon gan day
- 1 list doc gia chua tra

#### `Readers.jsx`
- Search theo ma/ten/lop
- Filter gender
- Modal them/sua
- Modal preview the va print

#### `BookTitles.jsx`
- Search
- Filter chuyen nganh
- Modal them/sua
- Nut xem ban sao

#### `BookCopies.jsx`
- Tieu de dong theo dau sach
- Nut quay lai
- Modal them/sua
- Xoa co rang buoc business rule

#### `Specializations.jsx`
- Hien thi dang cards 3 cot
- Moi card co ten, mo ta, so dau sach
- Edit/Delete tren card

#### `Borrows.jsx`
- 3 tabs
- Tab active co badge so luong
- Borrow form 3 buoc
- Table dang muon va lich su

#### `Reports.jsx`
- Bieu do bar ngang
- Bang top sach
- Bang doc gia chua tra
- Export CSV

#### `Users.jsx`
- Chi admin truy cap
- CRUD tai khoan
- Rang buoc khong xoa tai khoan dang dang nhap
- Rang buoc khong doi role cua chinh minh

---

## 7. PHAN 4 - KIEM THU

### 7.1. Test case dang nhap

| TC | Mo ta | Du lieu vao | Ket qua mong doi |
|---|---|---|---|
| LG01 | Dang nhap admin dung | `admin/admin123` | Dang nhap thanh cong, vao Dashboard |
| LG02 | Dang nhap librarian dung | `librarian1/lib123` | Dang nhap thanh cong, khong thay menu Users |
| LG03 | Sai password | `admin/123456` | Bao loi sai thong tin dang nhap |
| LG04 | Bo trong form | `username=""` | Bao loi bat buoc nhap |
| LG05 | Token het han | JWT het han | Clear storage, redirect login |

### 7.2. Test case CRUD

| TC | Module | Mo ta | Ket qua mong doi |
|---|---|---|---|
| CRUD01 | Readers | Them doc gia moi | Tao reader thanh cong, sinh `reader_id` |
| CRUD02 | Readers | Sua thong tin doc gia | Cap nhat thanh cong |
| CRUD03 | Readers | Xoa doc gia dang muon sach | He thong chan, bao loi |
| CRUD04 | Specializations | Xoa chuyen nganh dang co dau sach | He thong chan |
| CRUD05 | Book titles | Xoa dau sach con ban sao | He thong chan |
| CRUD06 | Book copies | Xoa ban sao dang borrowed | He thong chan |
| CRUD07 | Users | Xoa tai khoan dang dang nhap | He thong chan |
| CRUD08 | Users | Doi role cua chinh minh | He thong chan |

### 7.3. Test case muon sach

| TC | Mo ta | Ket qua mong doi |
|---|---|---|
| BR01 | Chon doc gia chua muon + copy available | Tao phieu muon thanh cong |
| BR02 | Chon doc gia dang co phieu borrowing | Tra loi HTTP 409 |
| BR03 | Chon copy khong available | Bao loi business rule |
| BR04 | Sau khi muon | `book_copies.status = borrowed` |

### 7.4. Test case tra sach

| TC | Mo ta | Ket qua mong doi |
|---|---|---|
| RT01 | Tra sach tu phieu borrowing | Cap nhat thanh cong |
| RT02 | Sau khi tra | `borrow_records.status = returned` |
| RT03 | Sau khi tra | `return_date` = ngay hien tai |
| RT04 | Sau khi tra | `book_copies.status = available` |

### 7.5. Cac loi co the xay ra

#### Loi logic
- Khong kiem tra doc gia da co phieu active
- Quen cap nhat trang thai ban sao sau khi muon/tra
- Cho phep xoa du lieu dang co rang buoc

#### Loi du lieu
- ID bi trung
- Du lieu date sai dinh dang
- quantity khong dong bo voi so ban sao thuc te

#### Loi phan quyen
- Librarian truy cap `Users`
- Request khong co token van duoc vao API
- Token het han nhung UI chua redirect

### 7.6. Cach debug va sua loi code AI sinh ra
- Buoc 1: doi chieu lai yeu cau nghiep vu goc voi code hien tai
- Buoc 2: test tung endpoint bang Postman/Thunder Client
- Buoc 3: log request body, response, SQL query neu can
- Buoc 4: kiem tra map field frontend/backend co cung ten khong
- Buoc 5: kiem tra route co bi sai prefix hay khong
- Buoc 6: kiem tra interceptor co gui `Bearer token` khong
- Buoc 7: doc lai business rules de tim cac case bi bo sot
- Buoc 8: refactor code AI sinh ra thanh cac component va ham ro trach nhiem hon

---

## 8. PHAN 5 - NOI DUNG BAO CAO NOP WORD/PDF

### 8.1. Thong tin sinh vien
- Ho va ten: ........................................
- MSSV: ........................................
- Lop: ........................................
- Mon hoc: ........................................
- Giang vien huong dan: ........................................

### 8.2. Muc do hoan thanh
- Tu danh gia: `9/10`

### 8.3. Tu danh gia

#### Lam duoc
- Hoan thanh phan tich actor, use case, entity, business rules
- Xay dung duoc he thong web tach backend/frontend
- Hoan thanh dang nhap JWT va phan quyen admin/librarian
- Hoan thanh CRUD doc gia, chuyen nganh, dau sach, ban sao, tai khoan
- Hoan thanh muon tra sach dung business rules
- Hoan thanh dashboard va reports

#### Chua lam duoc
- Chua bo sung test tu dong bang Jest/Vitest
- Chua co upload file anh bia sach
- Chua co overdue fine / phi phat

#### Kho khan gap phai
- Dong bo field giua frontend va backend
- Xu ly business rule muon 1 sach/luc
- Sap xep UI nhieu module van giu duoc tinh thong nhat

### 8.4. Cong nghe su dung
- React
- React Router v6
- Tailwind CSS
- Axios
- Recharts
- Node.js
- Express.js
- SQLite
- better-sqlite3
- JWT
- bcryptjs

### 8.5. Link GitHub
- GitHub repository: `https://github.com/your-name/unilib-system`

### 8.6. Quy trinh lam viec nhom
- BA:
  - Phan tich actor, use case, business rules
- Architect:
  - Thiet ke DB, API, workflow
- Backend:
  - Xay dung schema, seed, middleware, routes
- Frontend:
  - Xay dung React app, router, pages, forms, reusable components
- UI/UX:
  - Thiet ke design system, dashboard, reports, modal, table
- Kiem thu:
  - Test nghiep vu login, CRUD, muon, tra

### 8.7. Quy trinh dung AI tools
- Prompt ban dau:
  - Yeu cau tao he thong quan ly thu vien day du ca phan tich, thiet ke va code
- Chinh sua prompt:
  - Dieu chinh sang mo hinh React + Vite + Router + Tailwind + Axios
  - Chot schema SQLite, route names, business rules, UI pages
- Fix bug:
  - Rà soat field names
  - Kiem tra role guard
  - Kiem tra business rule muon/tra
  - Kiem tra route frontend/backend trung nhau

### 8.8. Workflow MVP -> iteration -> improvement
- MVP:
  - Dang nhap
  - CRUD co ban
  - Muon tra sach
  - Dashboard va reports
- Iteration:
  - Toi uu UI
  - Them print card
  - Them filter, pagination, tabs
- Improvement:
  - Test tu dong
  - Export PDF/Excel
  - Fine management
  - Logging va audit trail

---

## 9. Ghi chu quan trong
- Code da duoc sap xep theo cau truc backend/frontend ro rang
- README nay dong vai tro:
  - Tai lieu BA
  - Tai lieu SA
  - Huong dan chay
  - Ke hoach test
  - Noi dung bao cao nop bai
- Trong qua trinh phat trien, cac comment tieng Viet da duoc bo sung o nhung logic nghiep vu quan trong nhu muon sach, tra sach va interceptor auth

