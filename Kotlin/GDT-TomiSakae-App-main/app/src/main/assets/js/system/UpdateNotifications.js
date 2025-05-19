var UpdateNotifications = {};
(function () {
    // Gán đối tượng UpdateNotifications vào biến local 'moduleScope' để dễ sử dụng trong IIFE
    var moduleScope = UpdateNotifications;

    // Hàm hiển thị thông báo cho người dùng biết phiên bản đầy đủ của game đã có sẵn
    // Thường được gọi khi người dùng đang chơi phiên bản Lite/Demo và có thông tin về bản Full
    moduleScope.showFullGameIsAvailable = function () {
        // Lấy element của dialog thông báo game đầy đủ bằng jQuery
        var fullGameDialog = $("#fullGameAvailable");

        // Gắn sự kiện click cho nút "OK" trong dialog
        fullGameDialog.find(".okButton").clickExcl(function () {
            // Lấy URL của game đầy đủ đã được lưu trữ trước đó (có thể từ server)
            var fullGameUri = DataStore.getValue("full-game-uri");

            // Kiểm tra xem game có đang chạy trên nền tảng Windows 8/Store không
            if (PlatformShim.ISWIN8) {
                // Tạo đối tượng Uri từ chuỗi URL
                var windowsUri = new Windows.Foundation.Uri(fullGameUri);
                // Sử dụng API của Windows để mở Uri (thường là mở Store)
                Windows.System.Launcher.launchUriAsync(windowsUri).then(function (launchSuccess) {
                    // Ghi log analytics về việc điều hướng thành công hay thất bại
                    if (launchSuccess) {
                        ghg4.ghg5("navigate-to-full-game", {
                            url: fullGameUri,
                            success: true
                        });
                    } else {
                        ghg4.ghg5("navigate-to-full-game", {
                            url: fullGameUri,
                            success: false
                        });
                        // Nếu thất bại, hiển thị thông báo lỗi cho người dùng
                        Windows.UI.Popups.MessageDialog("It seems that something went wrong when trying to go to the Store page for the full app.\nPlease try again and if the issue persists please contact support@greenheartgames.com or search for Game Dev Tycoon manually on the Windows Store.",
                            "Store Error").showAsync();
                    }
                });
            } else {
                // Nếu không phải Windows 8/Store (ví dụ: bản NW.js), mở URL bằng trình duyệt mặc định
                PlatformShim.openUrlExternal(fullGameUri);
            }
        });

        // Ghi log analytics rằng thông báo game đầy đủ đang được hiển thị
        ghg4.ghg5("showing full game available message");

        // Hiển thị dialog dưới dạng modal (sử dụng plugin gdDialog đã được định nghĩa ở file chính)
        fullGameDialog.gdDialog({
            zIndex: 7500, // Đảm bảo dialog nổi lên trên các element khác
            popout: true,  // Có thể là hiệu ứng đặc biệt khi mở
            close: true    // Cho phép đóng dialog
        });
    };

    // Hàm kiểm tra và hiển thị các thông báo liên quan đến cập nhật ứng dụng
    // (Ví dụ: thông báo về phiên bản mới, hoặc các thông báo một lần sau khi cập nhật)
    moduleScope.checkAndShowNotifications = function () {
        // Chỉ kiểm tra nếu không có Steam (có thể Steam có cơ chế cập nhật riêng)
        if (!Steam) {
            // Lấy danh sách các save game hiện có
            var saveGamesList = GameManager.getSaveGames();

            // Nếu không có save game nào (người chơi mới hoàn toàn)
            // hoặc danh sách save game rỗng, đánh dấu là đã hiển thị thông báo cập nhật v1
            // để không hiển thị lại nữa.
            if (!saveGamesList || !saveGamesList.length) {
                DataStore.setValue("shown-udate-notification-v1", true);
            }
            // Ngược lại, nếu có save game và thông báo cập nhật v1 chưa từng được hiển thị
            else if (!DataStore.getValue("shown-udate-notification-v1")) {
                // Lấy element của dialog thông báo cập nhật ứng dụng v1
                var appUpdateDialogV1 = $("#appUpdateNotificationV1");

                // Gắn sự kiện click (chỉ một lần) cho nút "OK"
                appUpdateDialogV1.find(".okButton").clickExclOnce(function () {
                    // Đánh dấu là đã hiển thị thông báo để không hiển thị lại
                    DataStore.setValue("shown-udate-notification-v1", true);
                    // Đóng dialog
                    appUpdateDialogV1.dialog("close");
                });

                // Hiển thị dialog thông báo cập nhật
                appUpdateDialogV1.gdDialog({
                    zIndex: 7500
                });
            }
        }
    };
})();