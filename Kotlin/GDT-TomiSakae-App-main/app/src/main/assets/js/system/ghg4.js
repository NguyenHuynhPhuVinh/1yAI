var ghg4 = {}; // Khởi tạo namespace ghg4 (có thể là viết tắt của Greenheart Games Analytics)
ANALYTICS_ENABLED = !1; // Biến toàn cục để bật/tắt tính năng analytics. Mặc định là tắt.

(function () {
    // Sử dụng IIFE để tạo scope riêng, tránh xung đột biến.
    // Biến 'analyticsModule' tham chiếu đến ghg4, giúp code ngắn gọn hơn.
    var analyticsModule = ghg4;
    // Biến 'localyticsInstance' sẽ lưu trữ đối tượng của Localytics sau khi khởi tạo.
    var localyticsInstance;

    // Hàm khởi tạo module analytics.
    analyticsModule.init = function () {
        // Chỉ thực hiện nếu ANALYTICS_ENABLED là true.
        if (ANALYTICS_ENABLED) {
            // Nếu là phiên bản Windows 8 (WinStore) và có GameManager.ghg3(),
            // lắng nghe sự kiện thay đổi giấy phép.
            // GameManager.ghg3() có thể là hàm trả về đối tượng Store của Windows.
            if (PlatformShim.ISWIN8 && GameManager && typeof GameManager.ghg3 === 'function') {
                var storeApp = GameManager.ghg3();
                if (storeApp && storeApp.licenseInformation && typeof storeApp.licenseInformation.addEventListener === 'function') {
                    storeApp.licenseInformation.addEventListener("licensechanged", function () {
                        // Hiện tại không có hành động nào được thực hiện khi giấy phép thay đổi.
                        // Có thể là một placeholder hoặc logic đã bị loại bỏ.
                    });
                }
            }

            try {
                // Khởi tạo LocalyticsSession với các App Key khác nhau tùy theo nền tảng
                // và các cờ game (GameFlags.ghg7, GameFlags.G782).
                // Điều này cho thấy game có thể có nhiều phiên bản (lite, debug, release).
                var localyticsAppKey = PlatformShim.ISWIN8 ?
                    "a81d66cf7ac434d5db026f5-02cfbbe2-3c4e-11e2-685f-00ef75f32667" :
                    GameFlags.ghg7 ?
                        "41c2fa766702efda9d050cf-4cbeae62-ac6f-11e2-8796-005cf8cbabd8" :
                        GameFlags.G782 ?
                            "9c7a8f4b73c5b371e62dd52-6f5ec11e-ac6f-11e2-8798-005cf8cbabd8" :
                            "81926045ae9a704f220ff42-cadd95fa-d7af-11e2-0f20-004a77f8b47f";

                localyticsInstance = LocalyticsSession(localyticsAppKey, {
                    polling: !1 // Tắt chế độ polling (thăm dò) định kỳ.
                });

                // Mở session và tải lên dữ liệu analytics đã có.
                localyticsInstance.open();
                localyticsInstance.upload();

                // Ghi nhận sự kiện "system-info" với các thông tin hệ thống của người chơi.
                // analyticsModule.ghg5 là hàm để gửi sự kiện (có thể là viết tắt của "Greenheart Games tag event 5").
                analyticsModule.ghg5("system-info", {
                    platform: navigator.platform,
                    cpuClass: navigator.cpuClass,
                    userLanguage: navigator.userLanguage,
                    "is-steam": GameFlags.IS_STEAM // Kiểm tra xem có phải phiên bản Steam không.
                });

                // Lắng nghe sự kiện thay đổi trạng thái hiển thị của trang (visibilitychange).
                // API này hữu ích để biết khi nào người dùng chuyển tab hoặc thu nhỏ cửa sổ.
                document.addEventListener("visibilitychange", function (event) {
                    try {
                        var visibilityState = document.visibilityState;
                        if ("visible" == visibilityState) {
                            // Nếu trang trở nên hiển thị, mở lại session và tải dữ liệu.
                            localyticsInstance.open();
                            localyticsInstance.upload();
                        } else if ("hidden" == visibilityState) {
                            // Nếu trang bị ẩn, đóng session và tải dữ liệu.
                            localyticsInstance.close();
                            localyticsInstance.upload();
                        }
                    } catch (error) {
                        // Bỏ qua lỗi nếu có trong quá trình xử lý visibility change.
                    }
                }, !1);
            } catch (error) {
                // Bỏ qua lỗi nếu không thể khởi tạo Localytics.
                // Điều này đảm bảo game vẫn chạy được ngay cả khi analytics gặp sự cố.
            }

            // Gắn một trình xử lý sự kiện click cho tất cả các thẻ <a> trong tài liệu.
            // Sử dụng jQuery để thực hiện việc này.
            $(document).on("click", "a", function (event) {
                try {
                    // Kiểm tra xem sự kiện và phần tử nguồn có tồn tại không.
                    if (event && event.srcElement) {
                        // Lấy giá trị href của thẻ <a> được click.
                        var linkHref = $(event.srcElement).attr("href");
                        // Nếu href không phải là "#" (thường dùng cho các link placeholder).
                        if ("#" != linkHref) {
                            // Nếu không phải phiên bản Windows 8, mở URL bằng trình duyệt mặc định của hệ thống
                            // và ngăn chặn hành vi mặc định của thẻ <a> (thường là điều hướng trong cùng cửa sổ).
                            if (!PlatformShim.ISWIN8) {
                                PlatformShim.openUrlExternal(linkHref);
                                event.preventDefault();
                            }
                            // Ghi nhận sự kiện "clicked link" với thông tin href.
                            analyticsModule.ghg5("clicked link", {
                                href: linkHref
                            });
                        }
                    }
                } catch (error) {
                    // Bỏ qua lỗi nếu có trong quá trình xử lý click link.
                }
            });
        }
    };

    // Hàm để gửi (tag) một sự kiện analytics.
    // 'eventName' là tên của sự kiện.
    // 'attributes' là một đối tượng chứa các thuộc tính/dữ liệu đi kèm với sự kiện.
    analyticsModule.ghg5 = function (eventName, attributes) {
        // Chỉ thực hiện nếu ANALYTICS_ENABLED là true và localyticsInstance đã được khởi tạo.
        if (ANALYTICS_ENABLED && localyticsInstance) {
            try {
                // Gọi hàm tagEvent của Localytics.
                localyticsInstance.tagEvent(eventName, attributes);
            } catch (error) {
                // Bỏ qua lỗi nếu không thể gửi sự kiện.
            }
        }
    };
})();