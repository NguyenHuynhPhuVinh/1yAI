# GDT-TomiSakae-Backend

Backend API cho dự án GDT-TomiSakae.

## Cài đặt

```bash
# Cài đặt các dependency
npm install

# Chạy môi trường development
npm run dev

# Chạy ở môi trường production
npm start
```

## Biến môi trường

Tạo file `.env` trong thư mục gốc và thêm các biến sau:

```
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
```

## Deploy lên Vercel

### Chuẩn bị

1. Đảm bảo đã có tài khoản Vercel
2. Cài đặt Vercel CLI (tùy chọn):
   ```bash
   npm i -g vercel
   ```

### Cách deploy

#### Sử dụng Vercel Dashboard

1. Đăng nhập vào [Vercel Dashboard](https://vercel.com/dashboard)
2. Chọn "Import Project" và kết nối với GitHub repository
3. Cấu hình các biến môi trường (MONGODB_URI)
4. Deploy

#### Sử dụng Vercel CLI

```bash
# Đăng nhập
vercel login

# Deploy
vercel

# Để deploy lên production
vercel --prod
```

## Cấu trúc API

- `GET /api/saves` - Lấy tất cả lưu trữ
- `POST /api/saves` - Tạo lưu trữ mới
- Xem thêm trong các routes
