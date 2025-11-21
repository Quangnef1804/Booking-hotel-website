# Website Đặt Phòng Khách Sạn - Anh Dao Hotel

Hệ thống đặt phòng khách sạn với đầy đủ tính năng quản lý và đặt phòng trực tuyến.

## 🚀 Tính năng

### 1. Trang Home
- Hiển thị thông tin khách sạn
- Giới thiệu các loại phòng và giá
- Thông tin liên hệ
- Liên kết Zalo để chat trực tiếp

### 2. Đăng nhập/Đăng ký
- Người dùng phải tạo tài khoản để đặt phòng
- Xác thực bằng JWT
- Quản lý thông tin cá nhân

### 3. Đặt phòng
- Chọn phòng, ngày check-in/check-out
- Kiểm tra phòng trống
- Thanh toán trực tiếp hoặc online
- Xem lịch sử đặt phòng

### 4. Trang Quản lý (Admin)
- Quản lý đặt phòng
- Quản lý thông tin khách hàng
- Thống kê doanh thu
- Cập nhật trạng thái đặt phòng

## 🛠️ Công nghệ sử dụng

### Backend
- Node.js + Express.js
- PostgreSQL
- JWT Authentication
- bcryptjs (mã hóa mật khẩu)

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- React Hook Form
- Axios
- React Hot Toast

## 📦 Cài đặt

### Backend

1. Di chuyển vào thư mục backend:
```bash
cd backend
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

4. Cập nhật thông tin database trong `.env`:
```
DATABASE_URL=postgresql://user:password@localhost:5432/hotel_booking
JWT_SECRET=your-secret-key
PORT=3001
```

5. Chạy schema SQL để tạo database:
```bash
psql -U postgres -d hotel_booking -f database/schema.sql
```

6. Khởi động server:
```bash
npm run dev
```

Backend sẽ chạy tại `http://localhost:3001`

### Frontend

1. Di chuyển vào thư mục frontend:
```bash
cd frontend
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

4. Khởi động development server:
```bash
npm run dev
```

Frontend sẽ chạy tại `http://localhost:3000`

## 🎨 Theme màu

Hệ thống sử dụng màu xanh blue làm màu chủ đạo:
- Primary Blue: `#2563eb`
- Primary Blue Dark: `#1e40af`
- Primary Blue Light: `#3b82f6`
- Secondary Blue: `#60a5fa`
- Accent Blue: `#93c5fd`

Có thể dễ dàng cập nhật màu sắc trong file `frontend/app/globals.css`

## 📁 Cấu trúc dự án

```
├── backend/
│   ├── database/
│   │   └── schema.sql          # Database schema
│   ├── middleware/
│   │   └── auth.js             # Authentication middleware
│   ├── routes/
│   │   ├── auth.js             # Authentication routes
│   │   ├── rooms.js            # Rooms routes
│   │   ├── bookings.js         # Bookings routes
│   │   ├── hotel.js            # Hotel info routes
│   │   └── customers.js        # Customers routes
│   ├── index.js                # Main server file
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── page.tsx            # Home page
│   │   ├── login/
│   │   ├── register/
│   │   ├── booking/
│   │   ├── bookings/
│   │   └── admin/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── lib/
│   │   ├── api.ts              # API client
│   │   └── auth.ts             # Auth utilities
│   └── package.json
│
└── README.md
```

## 🔐 Tài khoản mặc định

Sau khi chạy schema SQL, bạn cần tạo tài khoản admin thủ công trong database:

```sql
-- Tạo admin user (mật khẩu: admin123)
-- Password hash cho "admin123" (cần hash bằng bcrypt)
INSERT INTO users (email, password, full_name, role)
VALUES ('admin@hotel.com', '$2a$10$...', 'Admin User', 'admin');
```

Hoặc đăng ký tài khoản thông thường và cập nhật role thành 'admin' trong database.

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user hiện tại

### Rooms
- `GET /api/rooms` - Lấy danh sách phòng
- `GET /api/rooms/:id` - Lấy thông tin phòng
- `POST /api/rooms/check-availability` - Kiểm tra phòng trống

### Bookings
- `POST /api/bookings` - Tạo đặt phòng (cần auth)
- `GET /api/bookings/my-bookings` - Lấy đặt phòng của user (cần auth)
- `GET /api/bookings/all` - Lấy tất cả đặt phòng (cần admin)
- `PATCH /api/bookings/:id/status` - Cập nhật trạng thái (cần admin)
- `PATCH /api/bookings/:id/cancel` - Hủy đặt phòng (cần auth)

### Hotel
- `GET /api/hotel/info` - Lấy thông tin khách sạn
- `PUT /api/hotel/info` - Cập nhật thông tin (cần admin)

### Customers
- `GET /api/customers` - Lấy danh sách khách hàng (cần admin)
- `GET /api/customers/:id` - Lấy chi tiết khách hàng (cần admin)

## 🚢 Deploy

### Backend (Render/Railway)
1. Kết nối repository
2. Set environment variables
3. Deploy

### Frontend (Vercel/Netlify)
1. Kết nối repository
2. Set `NEXT_PUBLIC_API_URL` environment variable
3. Deploy

## 📞 Liên hệ

- Email: info@anhdaohotel.com
- Phone: +84 123 456 789
- Zalo: [Liên kết Zalo]

## 📄 License

MIT License

