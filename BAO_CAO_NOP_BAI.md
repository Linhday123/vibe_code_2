# BAO CAO NOP BAI - HE THONG QUAN LY THU VIEN DAI HOC

## 1. Thong tin sinh vien
- Ho va ten: ........................................................
- MSSV: ........................................................
- Lop: ........................................................
- Mon hoc: ........................................................
- Giang vien huong dan: ........................................................

## 2. De tai
- Ten de tai: Xay dung he thong quan ly thu vien dai hoc
- San pham: UniLib System

## 3. Muc do hoan thanh
- Tu danh gia: 9/10

## 4. Mo ta ngan ve he thong
- He thong duoc xay dung de ho tro quan ly thu vien dai hoc tren nen tang web.
- Nguoi dung he thong gom 2 vai tro:
  - Admin
  - Librarian
- Cac chuc nang chinh:
  - Dang nhap bang JWT
  - Quan ly doc gia
  - Quan ly chuyen nganh
  - Quan ly dau sach
  - Quan ly ban sao sach
  - Muon sach, tra sach
  - Dashboard thong ke
  - Bao cao va xuat CSV

## 5. Phan tich actor

### 5.1. Admin
- Dang nhap he thong
- Quan ly tai khoan nguoi dung
- Xem dashboard
- Xem bao cao
- Giam sat toan bo he thong

### 5.2. Librarian
- Dang nhap he thong
- Quan ly doc gia
- Quan ly chuyen nganh
- Quan ly dau sach
- Quan ly ban sao
- Lap phieu muon
- Xac nhan tra sach
- Xem dashboard va bao cao

### 5.3. Sinh vien / Doc gia
- Dang ky the thu vien thong qua thu thu
- Muon sach thong qua thu thu
- Tra sach thong qua thu thu

## 6. Cac chuc nang da thuc hien

### 6.1. Xac thuc va phan quyen
- Dang nhap su dung JWT
- Luu token o localStorage
- Axios interceptor tu dong gan Bearer token
- Tu dong redirect ve login khi token het han
- Phan quyen:
  - Admin thay duoc menu Users
  - Librarian khong thay duoc menu Users

### 6.2. CRUD
- CRUD doc gia
- CRUD chuyen nganh
- CRUD dau sach
- CRUD ban sao sach
- CRUD nguoi dung

### 6.3. Muon - tra sach
- Tao phieu muon
- Kiem tra business rule truoc khi muon
- Tra sach va cap nhat trang thai du lieu lien quan

### 6.4. Bao cao
- Top sach muon nhieu nhat
- Doc gia chua tra sach
- Xuat CSV cho bao cao

### 6.5. Dashboard
- Tong so doc gia
- Tong so dau sach
- Tong so ban sao
- So sach dang muon
- Bieu do sach muon theo thang
- Top sach muon nhieu
- Phieu muon gan day
- Doc gia chua tra

## 7. Business rules da ap dung
- Moi doc gia chi duoc co 1 phieu muon dang active
- Chi duoc muon ban sao co trang thai available
- Khi tao phieu muon:
  - Tao borrow record
  - Cap nhat book copy sang borrowed
- Khi tra sach:
  - Cap nhat borrow record sang returned
  - Ghi return_date
  - Cap nhat book copy ve available
- Tat ca route deu can JWT tru login
- Chi admin duoc truy cap module Users
- Khong duoc xoa dau sach neu con ban sao
- Khong duoc xoa ban sao neu dang duoc muon
- Khong duoc xoa doc gia neu dang muon sach
- Khong duoc xoa tai khoan dang dang nhap

## 8. Cong nghe su dung

### 8.1. Frontend
- React
- React Router v6
- Tailwind CSS
- Axios
- Lucide React
- Recharts
- Vite

### 8.2. Backend
- Node.js
- Express.js
- SQLite
- JWT
- bcryptjs

## 9. Kien truc he thong

### 9.1. Frontend
- To chuc theo component-based architecture
- Tach layout, ui components, forms, pages
- Dung context de quan ly trang thai xac thuc

### 9.2. Backend
- To chuc theo route modules
- Middleware auth tach rieng
- Database va seed tach rieng
- API RESTful

## 10. Co so du lieu
- `users`
- `readers`
- `specializations`
- `book_titles`
- `book_copies`
- `borrow_records`

## 11. Tu danh gia

### 11.1. Lam duoc
- Phan tich he thong va xac dinh use case ro rang
- Thiet ke database va API co cau truc
- Xay dung duoc backend va frontend tach biet
- Hoan thanh chuc nang cốt lõi cua he thong
- UI co tinh thong nhat, de demo

### 11.2. Chua lam duoc
- Chua bo sung test tu dong bang framework rieng
- Chua co tinh nang refresh token
- Chua co quan ly tien phat qua han
- Chua deploy chinh thuc len hosting cong khai

### 11.3. Kho khan gap phai
- Dong bo field giua frontend va backend
- Xu ly business rule muon sach khong bi sai logic
- Can bang giua thoi gian lam bai va do hoan thien giao dien

## 12. Quy trinh lam viec nhom
- Phan tich de bai va tach yeu cau thanh tung module
- Phan chia theo vai tro:
  - BA: phan tich actor, use case, business rules
  - Architect: thiet ke DB, API, workflow
  - Backend: xay dung route, middleware, database
  - Frontend: xay dung pages, forms, reusable components
  - UI/UX: thong nhat design system
- Thuong xuyen doi chieu lai voi de bai de tranh thieu chuc nang

## 13. Quy trinh dung AI tools
- Prompt ban dau:
  - Yeu cau tao he thong thu vien day du ca phan tich, thiet ke va code
- Chinh sua prompt:
  - Dieu chinh lai stack React + Vite + Router + Tailwind + Axios
  - Chot schema SQLite, route names, business rules, design system
- Fix bug:
  - Kiem tra login
  - Kiem tra CRUD
  - Kiem tra muon sach, tra sach
  - Kiem tra phan quyen
  - Kiem tra du lieu dashboard va reports

## 14. Workflow thuc hien

### 14.1. MVP
- Dang nhap
- CRUD co ban
- Muon - tra sach
- Dashboard va reports

### 14.2. Iteration
- Hoan thien UI
- Bo sung in the doc gia
- Bo sung bo loc va tab
- Toi uu trai nghiem demo

### 14.3. Improvement
- Them test tu dong
- Deploy len hosting
- Them export PDF/Excel
- Them logging va audit trail
- Them chuc nang quan ly phat qua han

## 15. Ket qua demo
- Frontend chay tai: `http://127.0.0.1:5173`
- Backend API chay tai: `http://127.0.0.1:3000`
- Tai khoan test:
  - `admin / admin123`
  - `librarian1 / lib123`
- Da test thanh cong:
  - Dang nhap admin
  - Dang nhap librarian
  - Dashboard
  - CRUD Readers
  - Tao phieu muon
  - Chan vi pham business rule
  - Tra sach
  - Reports

## 16. Link GitHub
- Repository: `https://github.com/Linhday123/vibe_code_2`

## 17. Link demo
- Chua deploy len hosting cong khai
- Co the bo sung sau khi deploy frontend len Vercel va backend len Render/Railway

## 18. Ket luan
- De tai da hoan thanh phan lon cac chuc nang chinh cua he thong quan ly thu vien dai hoc.
- He thong dap ung duoc nghiep vu co ban, co giao dien de demo, co phan quyen, co dashboard va bao cao.
- Day la nen tang co the tiep tuc mo rong de dua vao su dung thuc te hoac phat trien thanh do an lon hon.

