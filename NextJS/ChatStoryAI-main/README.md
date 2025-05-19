# ChatStoryAI - Nền Tảng Sáng Tạo Truyện với AI

ChatStoryAI là một nền tảng sáng tạo truyện với sự hỗ trợ của AI, cho phép người dùng tạo và chia sẻ những câu chuyện độc đáo. Dự án được phát triển bởi nhóm sinh viên DA22TTC - Trường Đại học Trà Vinh.

## 🌟 Tính Năng Chính

### 1. Sáng Tạo với AI
- Tạo ý tưởng truyện độc đáo
- Phát triển nhân vật đa chiều
- Tạo hội thoại tự nhiên
- Quản lý chương và đại cương
- Tạo prompt cho ảnh bìa và avatar
- Chế độ tạo truyện qua trò chuyện AI (Gói hỗ trợ)
- Truy cập sớm tính năng mới (Gói hỗ trợ)

### 2. Thư Viện Truyện
- Đọc truyện đa dạng thể loại
- Đánh dấu chương đã đọc
- Theo dõi tiến độ đọc
- Tìm kiếm và lọc truyện

### 3. Quản Lý Nội Dung
- Tạo và quản lý truyện
- Phát triển nhân vật
- Quản lý chương và cốt truyện
- Xuất bản và chia sẻ

## 🛠 Công Nghệ Sử Dụng

- **Frontend:** Next.js, TypeScript, TailwindCSS
- **Backend:** Node.js, MySQL
- **AI:** Google Gemini API
- **Storage:** Google Drive API
- **Authentication:** NextAuth.js
- **Container:** Docker

## 🚀 Cài Đặt và Chạy

1. Clone repository:
```bash
git clone https://github.com/NguyenHuynhPhuVinh-TomiSakae/ChatStoryAI.git
cd ChatStoryAI
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file môi trường:
```bash
cp .env.example .env
```

4. Cấu hình các biến môi trường trong `.env`

5. Chạy với Docker:
```bash
docker-compose up -d
```

6. Chạy ứng dụng:
```bash
npm run dev
```

## 📝 Cấu Trúc Dự Án

```
src/
├── app/ # Pages và API routes
│ ├── account/ # Trang tài khoản
│ ├── api/ # API endpoints
│ │ ├── account/ # API liên quan đến tài khoản
│ │ ├── ai/ # API liên quan đến AI
│ │ ├── auth/ # API xác thực
│ │ ├── library/ # API thư viện truyện
│ │ ├── notifications/ # API thông báo
│ │ ├── stories/ # API quản lý truyện
│ │ └── user/ # API người dùng
│ ├── library/ # Trang thư viện
│ └── stories/ # Trang quản lý truyện
├── components/ # React components
│ ├── auth/ # Components xác thực
│ ├── common/ # Components dùng chung
│ ├── library/ # Components thư viện
│ └── stories/ # Components quản lý truyện
├── lib/ # Utilities và helpers
│ ├── auth.ts # Cấu hình xác thực
│ ├── db.ts # Kết nối database
│ └── utils/ # Các utility functions
├── services/ # External services
│ ├── auth.client.ts # Xử lý xác thực phía client
│ ├── auth.service.ts # Xử lý xác thực phía server
│ └── google-drive.service.ts # Quản lý lưu trữ Google Drive
└── types/ # TypeScript type definitions
```

## 🔑 API Endpoints

### Stories
- `GET /api/stories` - Lấy danh sách truyện 🔒
- `POST /api/stories/create` - Tạo truyện mới 🔒
- `GET /api/stories/[id]` - Chi tiết truyện 🔒
- `PUT /api/stories/[id]` - Cập nhật truyện 🔒
- `DELETE /api/stories/[id]` - Xóa truyện 🔒

### Library
- `GET /api/library` - Danh sách truyện công khai
- `GET /api/library/new` - Truyện mới
- `GET /api/library/popular` - Truyện phổ biến
- `GET /api/library/search` - Tìm kiếm truyện
- `POST /api/library/[id]/view` - Tăng lượt xem

### Chapters
- `GET /api/library/[id]/chapters` - Danh sách chương công khai
- `GET /api/library/[id]/chapters/[chapterId]` - Chi tiết chương công khai
- `POST /api/stories/[id]/chapters` - Thêm chương mới 🔒
- `PUT /api/stories/[id]/chapters/[chapterId]` - Cập nhật chương 🔒
- `DELETE /api/stories/[id]/chapters/[chapterId]` - Xóa chương 🔒

### Characters
- `GET /api/stories/[id]/characters` - Danh sách nhân vật 🔒
- `POST /api/stories/[id]/characters` - Thêm nhân vật mới 🔒
- `PUT /api/stories/[id]/characters/[characterId]` - Cập nhật nhân vật 🔒
- `DELETE /api/stories/[id]/characters/[characterId]` - Xóa nhân vật 🔒

### Comments
- `GET /api/stories/[id]/comments` - Danh sách bình luận
- `POST /api/stories/[id]/comments` - Thêm bình luận 🔒
- `DELETE /api/stories/[id]/comments` - Xóa bình luận 🔒

### Categories & Tags
- `GET /api/categories` - Danh sách thể loại
- `GET /api/tags` - Danh sách tag

### User
- `PUT /api/user/update-avatar` - Cập nhật avatar 🔒
- `PATCH /api/user/update-username` - Cập nhật tên 🔒
- `PUT /api/user/update-password` - Đổi mật khẩu 🔒
- `DELETE /api/user/delete-account` - Xóa tài khoản 🔒

### Bookmarks & Favorites
- `GET /api/account/bookmarks` - Danh sách truyện đã lưu 🔒
- `POST /api/stories/[id]/bookmarks` - Lưu/bỏ lưu truyện 🔒
- `POST /api/stories/[id]/favorites` - Thích/bỏ thích truyện 🔒

### Reading Progress
- `POST /api/library/[id]/chapters/[chapterId]/read` - Đánh dấu đã đọc 🔒
- `GET /api/account/view-history` - Lịch sử đọc 🔒

Chú thích:
- 🔒 : Yêu cầu đăng nhập

## 👥 Đóng Góp

Chúng tôi rất hoan nghênh mọi đóng góp! Vui lòng:

1. Fork dự án
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push lên branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 Giấy Phép

Dự án được phân phối dưới giấy phép MIT. Xem `LICENSE` để biết thêm thông tin.

## 📞 Liên Hệ

- Email: chatstoryai@gmail.com
- Phone: 0762605309
- Địa chỉ: Trường Đại Học Trà Vinh - DA22TTC

## ✨ Người Thực Hiện Dự Án

Dự án được thực hiện bởi:
Nhóm sinh viên DA22TTC - Báo cáo môn học Công Nghệ Phần Mềm - Nguyễn Huỳnh Phú Vinh - Nguyễn Phú Vinh - Huỳnh Phước Thọ - Trường Đại học Trà Vinh
