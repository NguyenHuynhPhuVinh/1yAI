# Ứng Dụng WebView Game Android

Ứng dụng Android hiển thị web game trong chế độ toàn màn hình với các tính năng được tối ưu hóa.

## Tính năng

- Hỗ trợ cả chế độ online và offline
- Màn hình lựa chọn cho phép người dùng chọn giữa phiên bản online và phiên bản offline
- Chế độ online: Kết nối đến trang web game trực tuyến
- Chế độ offline: Chơi phiên bản đơn giản của game từ file HTML cục bộ không cần internet
- Hiển thị trang web game trong WebView với giao diện PC
- Thu phóng mặc định ở mức 50% để hiển thị nhiều nội dung hơn
- Khóa màn hình ở chế độ ngang
- Chế độ toàn màn hình hoàn toàn (ẩn thanh trạng thái, thanh điều hướng và tất cả các phần tử hệ thống)
- Hỗ trợ bàn phím ảo khi nhấn vào các trường nhập liệu dù đang ở chế độ toàn màn hình
- Vô hiệu hóa thao tác nhấn đúp để phóng to và kéo tay để thay đổi tỷ lệ
- Vô hiệu hóa nút quay lại để không ảnh hưởng đến trải nghiệm chơi game (chỉ có trong chế độ online)
- Hỗ trợ localStorage để lưu trữ dữ liệu cục bộ
- Hỗ trợ gọi API từ JavaScript
- Hỗ trợ xử lý lỗi và các tính năng nâng cao của WebView
- JavaScriptInterface cho phép JavaScript giao tiếp với mã Android

## Màn hình lựa chọn chế độ

Ứng dụng bắt đầu với màn hình lựa chọn cho phép người dùng chọn giữa hai chế độ:

1. **Chế độ Online**:

   - Kết nối đến trang web game trực tuyến
   - Yêu cầu kết nối internet
   - Vô hiệu hóa nút quay lại để tránh thoát vô tình
   - URL mặc định: https://tomisakae.id.vn/

2. **Chế độ Offline**:
   - Tải trò chơi từ file HTML cục bộ
   - Không yêu cầu kết nối internet
   - Nút quay lại sẽ quay trở về màn hình lựa chọn
   - Game đơn giản bao gồm trong ứng dụng

## Cấu hình URL

Nếu muốn thay đổi URL của chế độ online hoặc tệp HTML của chế độ offline:

1. Chế độ online:

   - Mở file `ModeSelectorActivity.kt` trong thư mục `app/src/main/java/com/tomisakae/gdt_tomisakae/`
   - Thay đổi giá trị URL trong dòng:

   ```kotlin
   intent.putExtra(MainActivity.EXTRA_URL, "https://tomisakae.id.vn/")
   ```

2. Chế độ offline:
   - Thay đổi nội dung file `offline_game.html` trong thư mục `app/src/main/assets/`

## Cách build APK

1. Mở dự án trong Android Studio
2. Đi đến menu: Build > Build Bundle(s) / APK(s) > Build APK(s)
3. Đợi quá trình build hoàn tất
4. Android Studio sẽ hiển thị thông báo khi file APK đã được tạo
5. Nhấp vào "locate" để mở thư mục chứa file APK

## Cài đặt trên thiết bị Android

1. Sao chép file APK vào thiết bị Android
2. Trên thiết bị, mở trình quản lý file và điều hướng đến vị trí file APK
3. Nhấp vào file APK để cài đặt
4. Nếu được yêu cầu, hãy bật "Cài đặt từ nguồn không xác định" trong cài đặt bảo mật
5. Hoàn tất quá trình cài đặt và mở ứng dụng

## Chế độ toàn màn hình và bàn phím

Ứng dụng được thiết kế để chạy trong chế độ toàn màn hình hoàn toàn, phù hợp cho web game:

- Ẩn thanh trạng thái, thanh điều hướng và tất cả các phần tử giao diện hệ thống
- Vô hiệu hóa nút quay lại để ngăn người dùng vô tình thoát khỏi game (trong chế độ online)
- Khóa màn hình ở chế độ ngang giúp tối ưu trải nghiệm chơi game
- Tự động ẩn lại các phần tử hệ thống khi người dùng chạm vào màn hình
- Hỗ trợ đặc biệt để bàn phím ảo tự động hiển thị khi nhấn vào trường nhập liệu (input, textarea)
- Bàn phím sẽ hiển thị bình thường khi cần nhập liệu, và ứng dụng duy trì chế độ toàn màn hình cho các phần khác

## Sử dụng JavaScriptInterface

Ứng dụng cung cấp giao diện JavaScript cho phép mã JavaScript trong trang web giao tiếp với mã Android. Dưới đây là các phương thức có sẵn:

### Hiển thị thông báo từ JavaScript

```javascript
// Hiển thị thông báo Toast từ JavaScript
AndroidApp.showToast("Đây là thông báo từ trang web");
```

### Lấy thông tin thiết bị

```javascript
// Lấy thông tin thiết bị Android
var deviceInfo = AndroidApp.getDeviceInfo();
console.log("Thông tin thiết bị: " + deviceInfo);
```

### Lưu và đọc dữ liệu

```javascript
// Lưu dữ liệu
AndroidApp.saveData("username", "user123");

// Đọc dữ liệu
var username = AndroidApp.getData("username", "default");
console.log("Username: " + username);
```

## Tùy chỉnh thêm

Bạn có thể tùy chỉnh thêm trong code như sau:

- Thay đổi kích thước thu phóng: Chỉnh sửa dòng `webView.setInitialScale(50)` trong file `WebViewHelper.kt`
- Thay đổi User-Agent: Chỉnh sửa giá trị `userAgentString` trong file `WebViewHelper.kt`
- Thêm các phương thức JavaScriptInterface khác trong lớp `AndroidJSInterface` của file `WebViewHelper.kt`
- Tùy chỉnh giao diện màn hình lựa chọn trong file `activity_mode_selector.xml`
- Tùy chỉnh trò chơi offline trong file `offline_game.html`
