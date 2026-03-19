# UniLib System - Hệ thống quản lý thư viện đại học

## 1. Giới thiệu đề tài

- Tên đề tài: Xây dựng hệ thống quản lý thư viện đại học
- Tên sản phẩm: UniLib System
- Mục tiêu:
  - Số hóa nghiệp vụ quản lý thư viện trong trường đại học
  - Quản lý độc giả, chuyên ngành, đầu sách, bản sao sách
  - Quản lý mượn sách, trả sách theo đúng ràng buộc nghiệp vụ
  - Cung cấp dashboard và báo cáo thống kê phục vụ quản trị

## 2. Công nghệ sử dụng

### Frontend
- React
- React Router v6
- Tailwind CSS
- Axios
- Lucide React
- Recharts
- Vite

### Backend
- Node.js
- Express.js
- SQLite
- JWT
- bcryptjs

## 3. Cấu trúc dự án

```text
vibe_code_2/
├── backend/
│   ├── app.js
│   ├── package.json
│   ├── db/
│   │   ├── database.js
│   │   └── seed.js
│   ├── middleware/
│   │   └── auth.js
│   └── routes/
│       ├── auth.js
│       ├── users.js
│       ├── readers.js
│       ├── specializations.js
│       ├── bookTitles.js
│       ├── bookCopies.js
│       ├── borrows.js
│       ├── reports.js
│       └── dashboard.js
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── lib/
│       ├── context/
│       ├── hooks/
│       ├── components/
│       └── pages/
└── README.md
```

## 4. Hướng dẫn chạy dự án

### Chạy backend

```bash
cd backend
npm install
npm start
```

- Backend mặc định chạy tại: `http://localhost:3000`

### Chạy frontend

```bash
cd frontend
npm install
npm run dev
```

- Frontend mặc định chạy tại: `http://localhost:5173`

## 5. Tài khoản mẫu

- Admin:
  - Username: `admin`
  - Password: `admin123`

- Librarian:
  - Username: `librarian1`
  - Password: `lib123`

## 6. Dữ liệu mẫu

- 3 chuyên ngành:
  - CNTT
  - Kinh tế
  - Ngoại ngữ
- 5 đầu sách mẫu
- Mỗi đầu sách có từ 2 đến 3 bản sao
- 3 độc giả mẫu
- 2 phiếu mượn mẫu:
  - 1 phiếu đang mượn
  - 1 phiếu đã trả

## 7. Phân tích hệ thống

### 7.1. Actor

| Actor | Vai trò |
|---|---|
| Admin | Quản trị hệ thống, quản lý tài khoản, phân quyền, giám sát toàn bộ hệ thống |
| Thủ thư | Quản lý độc giả, sách, bản sao, mượn trả sách, theo dõi báo cáo |
| Sinh viên / Độc giả | Người sử dụng thư viện, được đăng ký thẻ, mượn sách và trả sách |

### 7.2. Use case theo actor

#### Admin
- Đăng nhập hệ thống
- Quản lý tài khoản người dùng
- Xem dashboard
- Xem báo cáo
- Quản lý phân quyền

#### Thủ thư
- Đăng nhập hệ thống
- Quản lý độc giả
- Quản lý chuyên ngành
- Quản lý đầu sách
- Quản lý bản sao sách
- Lập phiếu mượn
- Xác nhận trả sách
- Xem lịch sử mượn trả
- Xem dashboard
- Xem báo cáo

#### Sinh viên / Độc giả
- Đăng ký thẻ thư viện thông qua thủ thư
- Mượn sách thông qua thủ thư
- Trả sách thông qua thủ thư

### 7.3. Use case diagram mô tả bằng text

- `Admin` thực hiện:
  - `Đăng nhập`
  - `Quản lý tài khoản`
  - `Xem dashboard`
  - `Xem báo cáo`

- `Thủ thư` thực hiện:
  - `Đăng nhập`
  - `Quản lý độc giả`
  - `Quản lý chuyên ngành`
  - `Quản lý đầu sách`
  - `Quản lý bản sao`
  - `Tạo phiếu mượn`
  - `Trả sách`
  - `Xem lịch sử mượn trả`
  - `Xem dashboard`
  - `Xem báo cáo`

- `Sinh viên / Độc giả` tham gia gián tiếp:
  - `Đăng ký thẻ`
  - `Mượn sách`
  - `Trả sách`

### 7.4. Các thực thể dữ liệu

#### `users`
- `id`
- `username`
- `password_hash`
- `full_name`
- `email`
- `role`
- `created_at`

#### `readers`
- `reader_id`
- `full_name`
- `class_name`
- `birth_date`
- `gender`
- `created_at`

#### `specializations`
- `spec_id`
- `spec_name`
- `description`

#### `book_titles`
- `title_id`
- `title_name`
- `publisher`
- `pages`
- `dimensions`
- `author`
- `quantity`
- `spec_id`

#### `book_copies`
- `copy_id`
- `title_id`
- `status`
- `import_date`

#### `borrow_records`
- `record_id`
- `copy_id`
- `reader_id`
- `librarian_id`
- `borrow_date`
- `return_date`
- `status`

### 7.5. Business rules

1. Mỗi độc giả chỉ được có 1 phiếu mượn đang hoạt động (`borrowing`)
2. Chỉ được mượn bản sao có trạng thái `available`
3. Khi tạo phiếu mượn:
   - Tạo bản ghi trong `borrow_records`
   - Cập nhật `book_copies.status = borrowed`
4. Khi trả sách:
   - Cập nhật `borrow_records.status = returned`
   - Cập nhật `borrow_records.return_date`
   - Cập nhật `book_copies.status = available`
5. Tất cả API đều cần JWT, trừ `/api/auth/login`
6. Chỉ admin được truy cập module `Users`
7. Không được xóa đầu sách nếu còn bản sao
8. Không được xóa bản sao nếu đang được mượn
9. Không được xóa độc giả nếu đang có phiếu mượn chưa trả
10. Không được xóa tài khoản đang đăng nhập

### 7.6. Các trang giao diện

| Trang | Chức năng |
|---|---|
| Login | Đăng nhập hệ thống |
| Dashboard | Thống kê tổng quan, biểu đồ, danh sách nhanh |
| Readers | CRUD độc giả, tìm kiếm, lọc, in thẻ |
| Specializations | CRUD chuyên ngành theo dạng card |
| Book Titles | CRUD đầu sách, lọc theo chuyên ngành |
| Book Copies | CRUD bản sao sách |
| Borrows | Mượn sách, trả sách, xem lịch sử |
| Reports | Báo cáo sách mượn nhiều và độc giả chưa trả |
| Users | CRUD tài khoản, chỉ admin truy cập |

### 7.7. Bảng mapping nghiệp vụ

| Nghiệp vụ | Chức năng | API | Database | UI |
|---|---|---|---|---|
| Đăng nhập | Xác thực và cấp JWT | `POST /api/auth/login` | `users` | `Login.jsx` |
| Quản lý độc giả | Thêm, sửa, xóa, in thẻ | `GET/POST/PUT/DELETE /api/readers` | `readers` | `Readers.jsx` |
| Quản lý chuyên ngành | CRUD chuyên ngành | `GET/POST/PUT/DELETE /api/specializations` | `specializations` | `Specializations.jsx` |
| Quản lý đầu sách | CRUD đầu sách | `GET/POST/PUT/DELETE /api/book-titles` | `book_titles` | `BookTitles.jsx` |
| Quản lý bản sao | CRUD bản sao | `GET/POST/PUT/DELETE /api/book-copies` | `book_copies` | `BookCopies.jsx` |
| Mượn sách | Tạo phiếu mượn | `POST /api/borrows` | `borrow_records`, `book_copies` | `Borrows.jsx` |
| Trả sách | Hoàn tất phiếu mượn | `PUT /api/borrows/:id/return` | `borrow_records`, `book_copies` | `Borrows.jsx` |
| Dashboard | Xem thống kê tổng quan | `GET /api/dashboard/stats` | Tổng hợp nhiều bảng | `Dashboard.jsx` |
| Báo cáo | Thống kê và xuất CSV | `GET /api/reports/*` | `borrow_records`, `book_titles`, `readers` | `Reports.jsx` |
| Quản lý tài khoản | CRUD tài khoản | `GET/POST/PUT/DELETE /api/users` | `users` | `Users.jsx` |

## 8. Thiết kế hệ thống

### 8.1. Thiết kế cơ sở dữ liệu

- `users`: lưu tài khoản và vai trò
- `readers`: lưu thông tin độc giả
- `specializations`: lưu chuyên ngành
- `book_titles`: lưu thông tin đầu sách
- `book_copies`: lưu từng bản sao cụ thể
- `borrow_records`: lưu giao dịch mượn trả

### 8.2. Quan hệ giữa các bảng

- `specializations (1) -> (n) book_titles`
- `book_titles (1) -> (n) book_copies`
- `readers (1) -> (n) borrow_records`
- `users (1) -> (n) borrow_records`
- `book_copies (1) -> (n) borrow_records`

### 8.3. API chính

- `POST /api/auth/login`
- `GET/POST/PUT/DELETE /api/users`
- `GET/POST/PUT/DELETE /api/readers`
- `GET/POST/PUT/DELETE /api/specializations`
- `GET/POST/PUT/DELETE /api/book-titles`
- `GET/POST/PUT/DELETE /api/book-copies`
- `GET/POST /api/borrows`
- `PUT /api/borrows/:id/return`
- `GET /api/reports/most-borrowed`
- `GET /api/reports/unreturned`
- `GET /api/dashboard/stats`

### 8.4. Workflow chính

#### Đăng ký thẻ
1. Thủ thư mở trang `Readers`
2. Thêm độc giả mới
3. Hệ thống sinh mã độc giả
4. Có thể xem preview và in thẻ

#### Mượn sách
1. Chọn độc giả
2. Chọn bản sao đang available
3. Kiểm tra business rule
4. Tạo phiếu mượn
5. Cập nhật trạng thái bản sao

#### Trả sách
1. Chọn phiếu mượn đang active
2. Bấm trả sách
3. Cập nhật phiếu mượn
4. Cập nhật bản sao về available

### 8.5. MVP

- Đăng nhập và phân quyền
- CRUD dữ liệu chính
- Mượn và trả sách
- Dashboard
- Reports

### 8.6. Hướng cải tiến

- Thêm test tự động
- Thêm phân trang server-side
- Thêm upload ảnh bìa sách
- Thêm quản lý phạt quá hạn
- Triển khai online bằng Vercel + Render/Railway

## 9. Kiểm thử

### 9.1. Đăng nhập
- Đăng nhập đúng tài khoản admin
- Đăng nhập đúng tài khoản librarian
- Đăng nhập sai mật khẩu
- Token hết hạn thì tự quay về trang login

### 9.2. CRUD
- Thêm, sửa, xóa độc giả
- Thêm, sửa, xóa chuyên ngành
- Thêm, sửa, xóa đầu sách
- Thêm, sửa, xóa bản sao
- Thêm, sửa, xóa tài khoản

### 9.3. Mượn sách
- Mượn thành công khi độc giả chưa có phiếu active
- Bị chặn khi độc giả đã có phiếu active
- Bị chặn khi bản sao không ở trạng thái available

### 9.4. Trả sách
- Trả sách thành công
- Phiếu mượn chuyển sang `returned`
- Bản sao chuyển về `available`

### 9.5. Các lỗi có thể phát sinh

- Lỗi logic:
  - Quên cập nhật trạng thái bản sao
  - Không chặn đúng business rule
- Lỗi dữ liệu:
  - Sai định dạng ngày
  - Sai tên field giữa frontend và backend
- Lỗi phân quyền:
  - Librarian truy cập Users
  - Request thiếu token vẫn vào API

## 10. Nội dung nộp bài

- File mô tả hệ thống: `README.md`
- File báo cáo nộp bài: tạo riêng trên máy, không đưa lên git
- Repository GitHub: `https://github.com/Linhday123/vibe_code_2`

## 11. Kết luận

- Hệ thống đã hoàn thành phần lớn chức năng cốt lõi của bài toán quản lý thư viện đại học
- Dự án có thể demo được các luồng chính: đăng nhập, CRUD, mượn sách, trả sách, dashboard và báo cáo
- Đây là nền tảng phù hợp để tiếp tục mở rộng thành đồ án hoàn chỉnh hơn
