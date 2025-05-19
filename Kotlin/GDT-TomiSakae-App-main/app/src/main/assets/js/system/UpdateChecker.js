// --- START OF FILE UpdateChecker.js ---

var UpdateChecker = {}; // Khai báo đối tượng UpdateChecker toàn cục
(function () {
    // Hàm nội bộ để phân tích chuỗi phiên bản thành một đối tượng
    // Ví dụ: "1.7.6" -> { major: 1, minor: 7, patch: 6 }
    function parseVersionString(versionString) {
        if ("string" != typeof versionString) return null; // Kiểm tra kiểu dữ liệu đầu vào
        var versionParts = versionString.split("."); // Tách chuỗi thành các phần dựa trên dấu "."
        var major = parseInt(versionParts[0]); // Lấy phần major
        var minor = parseInt(versionParts[1]); // Lấy phần minor
        var patch = parseInt(versionParts[2]); // Lấy phần patch

        // Kiểm tra xem các phần có phải là số hợp lệ không
        return isNaN(major) || isNaN(minor) || isNaN(patch) ? null : {
            major: major,
            minor: minor,
            patch: patch
        };
    }

    var self = UpdateChecker; // Tạo một tham chiếu ngắn gọn đến UpdateChecker
    self.VERSION = "1.7.6"; // Phiên bản hiện tại của ứng dụng

    // Hàm kiểm tra cập nhật
    self.checkForUpdate = function () {
        // Chỉ kiểm tra cập nhật nếu không phải là phiên bản Steam (Steam có cơ chế cập nhật riêng)
        if (!GameFlags.IS_STEAM) {
            var currentVersionObject;
            try {
                // Phân tích phiên bản hiện tại của ứng dụng
                currentVersionObject = parseVersionString(self.VERSION); // Sử dụng parseVersionString thay vì 'a'
            } catch (error) { // Đổi tên biến lỗi cho rõ ràng
                currentVersionObject = null;
            }

            // Nếu phiên bản hiện tại hợp lệ
            if (currentVersionObject) {
                try {
                    // Xóa cache của ứng dụng (chỉ áp dụng cho môi trường NW.js)
                    require("nw.gui").App.clearCache();
                } catch (nwError) { /* Bỏ qua lỗi nếu không phải môi trường NW.js */ }

                var platformIdentifier = navigator.platform; // Lấy thông tin nền tảng
                // Xác định URL kiểm tra cập nhật dựa trên nền tảng
                platformIdentifier = platformIdentifier.startsWith("Win") ? "win" :
                    platformIdentifier.startsWith("Mac") ? "mac" :
                        platformIdentifier.startsWith("linux") ? "linux" : null;

                if (platformIdentifier) {
                    var updateCheckUrl = "http://www.greenheartgames.com/utils/releases/gdt/lite/" + platformIdentifier;
                    // Nếu không phải là bản demo/lite (ghg7 là cờ cho bản demo/lite)
                    if (!GameFlags.ghg7) {
                        updateCheckUrl = "http://www.greenheartgames.com/utils/releases/gdt/" + platformIdentifier;
                    }

                    // Gửi yêu cầu GET để lấy thông tin phiên bản mới nhất
                    $.get(updateCheckUrl, function (responseString) { // Đổi tên 'd' thành 'responseString'
                        // Phản hồi thường có dạng "version;download_url"
                        if (-1 != responseString.indexOf(";")) {
                            var responseParts = responseString.split(";"); // Đổi tên 'd' thành 'responseParts'
                            var latestVersionObject;
                            try {
                                // Phân tích phiên bản mới nhất từ phản hồi
                                latestVersionObject = parseVersionString(responseParts[0]); // Sử dụng parseVersionString thay vì 'a'
                            } catch (parseError) { // Đổi tên 'l' thành 'parseError'
                                latestVersionObject = null;
                            }

                            // So sánh phiên bản mới nhất với phiên bản hiện tại
                            if (latestVersionObject && currentVersionObject &&
                                (latestVersionObject.major > currentVersionObject.major ||
                                    (latestVersionObject.major == currentVersionObject.major &&
                                        (latestVersionObject.minor > currentVersionObject.minor ||
                                            (latestVersionObject.minor == currentVersionObject.minor && latestVersionObject.patch > currentVersionObject.patch))))) {
                                // Nếu có phiên bản mới hơn, hiển thị thông báo
                                showUpdateNotification(responseParts[1]); // Sử dụng showUpdateNotification thay vì 'c'
                            }
                        }
                    });
                } else {
                    // Ghi log nếu không xác định được nền tảng
                    ghg4.ghg5("check-update-error", {
                        msg: "unknown platform"
                    });
                }
            } else {
                // Thông báo nếu phiên bản hiện tại không hợp lệ (ít khi xảy ra)
                PlatformShim.alert("version not valid: " + self.VERSION);
            }
        }
    };

    // Hàm hiển thị thông báo cập nhật
    var showUpdateNotification = function (downloadUrl) { // Đổi tên 'a' thành 'downloadUrl'
        var updateDialog = $("#upateNotificationWindow"); // Đổi tên 'b' thành 'updateDialog'
        updateDialog.find(".updateButton").clickExclOnce(function () {
            Sound.click();
            PlatformShim.openUrlExternal(downloadUrl); // Mở link tải bằng trình duyệt mặc định
            updateDialog.dialog("close");
        });
        // Hiển thị dialog thông báo
        updateDialog.gdDialog({
            zIndex: 15E3, // 15000
            popout: !0,
            close: !0
        });
    };

    // Tự động chạy hàm kiểm tra cập nhật khi file này được tải
    self.checkForUpdate();
})();
// --- END OF FILE UpdateChecker.js ---