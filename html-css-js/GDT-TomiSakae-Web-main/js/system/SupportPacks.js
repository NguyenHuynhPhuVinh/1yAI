// Module quản lý các gói hỗ trợ (có thể là DLC hoặc các gói mua trong game)
var SupportPacks = {};
(function () {
    // Gán SupportPacks vào biến cục bộ để dễ truy cập và có thể rút gọn code (nếu cần)
    var supportPacksModule = SupportPacks;
    // Biến lưu trữ thông tin các gói hỗ trợ đã được tải, để tránh tải lại nhiều lần
    var cachedPacksInformation; // Trước đây là 'b'

    // Hàm lấy thông tin các gói hỗ trợ.
    // Sử dụng callback để xử lý bất đồng bộ.
    supportPacksModule.getPacks = function (callback) { // 'a' trong tham số gốc là callback
        // Nếu thông tin gói đã được cache, gọi callback ngay với dữ liệu cache
        if (cachedPacksInformation) {
            callback(cachedPacksInformation);
        } else {
            // Nếu chưa có, gọi API của GameManager (có thể là API của Store) để tải thông tin
            // GameManager.ghg3() có vẻ là một hàm để lấy đối tượng Store (ví dụ: Windows.ApplicationModel.Store.CurrentAppSimulator hoặc CurrentApp)
            GameManager.ghg3().loadListingInformationAsync().done(
                function (packListings) { // 'f' trong tham số gốc là thông tin các gói lấy về
                    // Lưu thông tin gói vào cache
                    cachedPacksInformation = packListings;
                    // Gọi callback với thông tin vừa tải được
                    callback(packListings);
                },
                function (error) { // 'a' trong tham số gốc là lỗi
                    // Xử lý lỗi nếu có (ở đây chỉ là một hàm rỗng, có thể cần log lỗi hoặc thông báo cho người dùng)
                }
            );
        }
    };

    // Hàm kiểm tra xem người dùng đã mua một gói hỗ trợ cụ thể hay chưa
    supportPacksModule.hasBought = function (productId) { // 'a' trong tham số gốc là productId
        // Sử dụng API của GameManager để kiểm tra thông tin bản quyền sản phẩm
        return GameManager.ghg3().licenseInformation.productLicenses.lookup(productId);
    };

    // Hàm thực hiện việc mua một gói hỗ trợ
    supportPacksModule.buy = function (productId, successCallback) { // 'b' trong tham số gốc là productId, 'f' là successCallback
        // Gọi API của GameManager để yêu cầu mua sản phẩm
        GameManager.ghg3().requestProductPurchaseAsync(productId, true).done(
            function (purchaseResult) { // 'd' trong tham số gốc là kết quả mua hàng
                // Nếu việc mua hàng được thực hiện (purchaseResult là true)
                if (purchaseResult) {
                    // Kiểm tra lại xem người dùng thực sự đã sở hữu sản phẩm chưa
                    if (supportPacksModule.hasBought(productId)) {
                        // Nếu đã sở hữu:
                        // Ghi log analytics (nếu có)
                        ghg4.ghg5("feature purchased", {
                            id: productId
                        });
                        // Kích hoạt thành tựu liên quan đến việc hỗ trợ (supporter2)
                        Achievements.activate(Achievements.supporter2);
                        // Kiểm tra và hiển thị các thành tựu mới (nếu có)
                        GameManager.checkAchievements();
                        // Gọi callback thành công nếu được cung cấp
                        if (successCallback) {
                            successCallback();
                        }
                    } else {
                        // Nếu việc mua hàng có vẻ thành công nhưng kiểm tra lại không thấy sở hữu
                        // Ghi log analytics
                        ghg4.ghg5("feature purchase unsuccessful");
                        // Hiển thị thông báo lỗi cho người dùng
                        // Windows.UI.Popups.MessageDialog là API của Windows Store để hiển thị dialog
                        Windows.UI.Popups.MessageDialog(
                            "It seems that something went wrong when purchasing this feature pack.\nPlease close the app and try again later.\n If the issue persists please contact\n\nsupport@greenheartgames.com",
                            "purchase not validated" // Tiêu đề dialog
                        ).showAsync();
                    }
                }
                // Nếu purchaseResult là false (người dùng hủy hoặc có lỗi ban đầu), không làm gì thêm ở đây.
            },
            function (error) { // 'a' trong tham số gốc là lỗi
                // Xử lý lỗi trong quá trình yêu cầu mua hàng (ví dụ: lỗi kết nối Store)
                Windows.UI.Popups.MessageDialog(
                    "It seems that something went wrong when trying to purchase this feature pack.\nPlease close the app and try again later.\n If the issue persists please contact\n\nsupport@greenheartgames.com",
                    "Store Error" // Tiêu đề dialog
                ).showAsync();
            }
        );
    };
})();