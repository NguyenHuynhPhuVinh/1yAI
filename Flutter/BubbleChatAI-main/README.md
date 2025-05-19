# BubbleChatAI

BubbleChatAI là một ứng dụng chat AI được xây dựng bằng Flutter, sử dụng Google Generative AI (Gemini) để tạo ra các cuộc trò chuyện thông minh và tương tác.

## Tính năng chính

- 🤖 Tích hợp với Google Gemini AI
- 💬 Hỗ trợ chat với nhiều mô hình AI khác nhau
- 📸 Hỗ trợ phân tích và tương tác với hình ảnh
- 🎨 Giao diện người dùng thân thiện với chế độ sáng/tối
- 📝 Hỗ trợ Markdown trong tin nhắn
- 🔒 Tùy chỉnh cài đặt bảo mật
- 💾 Lưu trữ lịch sử trò chuyện
- ⚙️ Tùy chỉnh hướng dẫn hệ thống (system instruction)

## Cài đặt

### Yêu cầu

- Flutter SDK ≥ 3.6.0
- Dart SDK ≥ 3.6.0
- Google Gemini API Key

### Các bước cài đặt

1. Clone repository:
```bash
git clone https://github.com/yourusername/bubblechatai.git
cd bubblechatai
```

2. Cài đặt các dependencies:
```bash
flutter pub get
```

3. Chạy ứng dụng:
```bash
flutter run
```

## Cấu hình

1. Truy cập [Google AI Studio](https://aistudio.google.com/app/apikey) để lấy API key
2. Trong ứng dụng, vào phần Cài đặt và nhập API key
3. Tùy chỉnh các cài đặt khác như:
   - Chọn mô hình AI
   - Cài đặt ghi chú hệ thống
   - Điều chỉnh mức độ lọc nội dung

## Các mô hình AI hỗ trợ

- gemini-2.0-flash
- gemini-2.0-flash-lite
- gemini-2.0-pro-exp-02-05
- gemini-2.0-flash-thinking-exp-01-21
- gemini-2.0-flash-exp
- gemini-1.5-pro
- gemini-1.5-flash
- gemini-1.5-flash-8b

## Đóng góp

Mọi đóng góp đều được hoan nghênh. Vui lòng:

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit thay đổi (`git commit -m 'Add some AmazingFeature'`)
4. Push lên branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request
