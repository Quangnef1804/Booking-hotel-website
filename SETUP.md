# Hướng dẫn cài đặt và chạy dự án

## Yêu cầu hệ thống

- Node.js >= 18.x
- PostgreSQL >= 12.x
- npm hoặc yarn

## Bước 1: Cài đặt Backend

```bash
cd backend
npm install
```

Tạo file `.env` trong thư mục `backend/`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/hotel_booking
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3001
```

Tạo database và chạy schema:

```bash
# Tạo database
createdb hotel_booking

# Hoặc sử dụng psql
psql -U postgres
CREATE DATABASE hotel_booking;
\q

# Chạy schema
psql -U postgres -d hotel_booking -f database/schema.sql
```

Khởi động backend:

```bash
npm run dev
```

Backend sẽ chạy tại: http://localhost:3001

## Bước 2: Cài đặt Frontend

```bash
cd frontend
npm install
```

Tạo file `.env.local` trong thư mục `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Khởi động frontend:

```bash
npm run dev
```

Frontend sẽ chạy tại: http://localhost:3000

## Bước 3: Tạo tài khoản Admin

Sau khi chạy schema, bạn cần tạo tài khoản admin. Có 2 cách:

### Cách 1: Đăng ký tài khoản thông thường
1. Truy cập http://localhost:3000/register
2. Đăng ký tài khoản
3. Vào database và cập nhật role:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

### Cách 2: Tạo trực tiếp trong database
Sử dụng script Node.js để hash password:

```javascript
import bcrypt from 'bcryptjs';
const hashedPassword = await bcrypt.hash('admin123', 10);
console.log(hashedPassword);
```

Sau đó insert vào database:

```sql
INSERT INTO users (email, password, full_name, role)
VALUES ('admin@hotel.com', '$2a$10$hashed_password_here', 'Admin User', 'admin');
```

## Kiểm tra hoạt động

1. Truy cập http://localhost:3000 - Trang chủ
2. Đăng ký tài khoản mới
3. Đăng nhập
4. Đặt phòng
5. Xem danh sách đặt phòng
6. Đăng nhập với tài khoản admin để xem trang quản lý

## Troubleshooting

### Lỗi kết nối database
- Kiểm tra PostgreSQL đã chạy chưa
- Kiểm tra DATABASE_URL trong .env
- Kiểm tra quyền truy cập database

### Lỗi CORS
- Đảm bảo backend đã cài đặt cors middleware
- Kiểm tra NEXT_PUBLIC_API_URL trong frontend

### Lỗi module not found
- Xóa node_modules và package-lock.json
- Chạy lại npm install

## Deploy

### Backend (Render/Railway)
1. Kết nối GitHub repository
2. Set environment variables:
   - DATABASE_URL
   - JWT_SECRET
   - PORT
3. Deploy

### Frontend (Vercel)
1. Kết nối GitHub repository
2. Set environment variable:
   - NEXT_PUBLIC_API_URL (URL của backend đã deploy)
3. Deploy

