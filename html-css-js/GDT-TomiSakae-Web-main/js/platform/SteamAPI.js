// Khởi tạo đối tượng Steam như một namespace toàn cục.
var Steam = {};

// Sử dụng IIFE (Immediately Invoked Function Expression) để tạo một scope riêng,
// tránh xung đột biến và giúp đóng gói logic.
(function () {
    // 'greenworksApiInstance' sẽ giữ instance của thư viện Greenworks (nếu có) để tương tác với Steam API.
    // Ban đầu được gán là null.
    var greenworksApiInstance = null;

    // 'isSteamApiInitialized' là một cờ boolean để theo dõi xem Steam API đã được khởi tạo thành công hay chưa.
    // Ban đầu được gán là false.
    var isSteamApiInitialized = false;

    // Kiểm tra xem có đang chạy trên môi trường desktop (không phải Windows Store) và có hàm 'require' (Node.js/NW.js) hay không.
    // Mục đích là để thử tải module Greenworks cho các nền tảng desktop khác nhau.
    if (!PlatformShim.ISWIN8) {
        // Cố gắng tải module Greenworks cho Windows.
        try {
            greenworksApiInstance = require("./steamIntegration/greenworks-win");
        } catch (errorWindows) { // 'errorWindows' chứa lỗi nếu không tải được module cho Windows.
            greenworksApiInstance = null; // Đảm bảo greenworksApiInstance vẫn là null nếu có lỗi.
        }

        // Nếu không tải được cho Windows, thử tải cho macOS 64-bit.
        if (!greenworksApiInstance) try {
            greenworksApiInstance = require("./steamIntegration/greenworks-osx64");
        } catch (errorOsx64) { // 'errorOsx64' chứa lỗi nếu không tải được module cho macOS 64-bit.
            greenworksApiInstance = null;
        }

        // Nếu không tải được, thử tải cho macOS (có thể là 32-bit hoặc kiến trúc khác).
        if (!greenworksApiInstance) try {
            greenworksApiInstance = require("./steamIntegration/greenworks-osx");
        } catch (errorOsx) { // 'errorOsx' chứa lỗi nếu không tải được module cho macOS.
            greenworksApiInstance = null;
        }

        // Nếu không tải được, thử tải cho Linux 64-bit.
        if (!greenworksApiInstance) try {
            greenworksApiInstance = require("./steamIntegration/64/greenworks-linux64");
        } catch (errorLinux64) { // 'errorLinux64' chứa lỗi nếu không tải được module cho Linux 64-bit.
            greenworksApiInstance = null;
        }

        // Nếu không tải được, thử tải cho Linux 32-bit.
        if (!greenworksApiInstance) try {
            greenworksApiInstance = require("./steamIntegration/32/greenworks-linux32");
        } catch (errorLinux32) { // 'errorLinux32' chứa lỗi nếu không tải được module cho Linux 32-bit.
            greenworksApiInstance = null;
        }
    }

    /**
     * Kiểm tra xem Steam API có sẵn và đã được khởi tạo hay chưa.
     * Nếu chưa khởi tạo, hàm này sẽ cố gắng khởi tạo API.
     * @param {function} [errorCallback] - Một hàm callback tùy chọn sẽ được gọi nếu có lỗi xảy ra trong quá trình kiểm tra hoặc khởi tạo.
     *                                       Callback này nhận một tham số là thông báo lỗi.
     * @returns {boolean} - Trả về true nếu Steam API có sẵn và đã khởi tạo, ngược lại trả về false.
     */
    Steam.isAvailable = function (errorCallback) {
        // Nếu không có instance Greenworks, API không có sẵn.
        if (!greenworksApiInstance) {
            // Gọi errorCallback nếu được cung cấp, thông báo rằng không có tích hợp Steam.
            errorCallback && errorCallback("no steam integration available");
            return false;
        }

        // Nếu API chưa được khởi tạo.
        if (!isSteamApiInitialized) {
            var initializationSuccess; // Biến tạm để lưu kết quả khởi tạo.
            // Khối lệnh có nhãn 'initializationBlock' để có thể dùng 'break initializationBlock'.
            initializationBlock: {
                // Kiểm tra lại cờ isSteamApiInitialized (mặc dù đã kiểm tra ở ngoài).
                if (!isSteamApiInitialized) {
                    isSteamApiInitialized = true; // Đánh dấu là đã cố gắng khởi tạo.
                    try {
                        // Gọi hàm initAPI() của Greenworks.
                        if (!greenworksApiInstance.initAPI()) {
                            // Nếu initAPI() trả về false (khởi tạo thất bại).
                            greenworksApiInstance = null; // Vô hiệu hóa instance Greenworks.
                            errorCallback && errorCallback("steam Init failed"); // Gọi errorCallback.
                            initializationSuccess = false; // Đánh dấu khởi tạo thất bại.
                            break initializationBlock; // Thoát khỏi khối lệnh.
                        }
                    } catch (initError) { // 'initError' chứa lỗi nếu có exception xảy ra khi gọi initAPI().
                        // Nếu có lỗi trong quá trình khởi tạo.
                        greenworksApiInstance = null; // Vô hiệu hóa instance Greenworks.
                        // Ghi log cảnh báo.
                        Logger.LogWarning("Steam initialization failed", initError, "Steam initialization failed".localize());
                        errorCallback && errorCallback("steam Init failed"); // Gọi errorCallback.
                        initializationSuccess = false; // Đánh dấu khởi tạo thất bại.
                        break initializationBlock; // Thoát khỏi khối lệnh.
                    }
                }
                initializationSuccess = true; // Nếu không có lỗi, đánh dấu khởi tạo thành công.
            }
            // Nếu khởi tạo không thành công, trả về false.
            if (!initializationSuccess) {
                return false;
            }
        }
        // Nếu mọi thứ ổn, API có sẵn.
        return true;
    };

    /**
     * Lưu một chuỗi văn bản vào một file trên Steam Cloud.
     * @param {string} fileName - Tên của file sẽ được tạo/ghi đè trên Steam Cloud.
     * @param {string} content - Nội dung văn bản cần lưu.
     * @param {function} successCallback - Hàm callback được gọi khi lưu thành công.
     * @param {function} [errorCallback] - Hàm callback tùy chọn được gọi khi có lỗi xảy ra.
     */
    Steam.saveTextToFile = function (fileName, content, successCallback, errorCallback) {
        // Chỉ thực hiện nếu Steam API có sẵn.
        // Truyền errorCallback vào Steam.isAvailable để nó được gọi nếu API không khả dụng hoặc khởi tạo lỗi.
        if (Steam.isAvailable(errorCallback)) {
            greenworksApiInstance.saveTextToFile(fileName, content, successCallback, errorCallback);
        }
    };

    /**
     * Đọc nội dung văn bản từ một file trên Steam Cloud.
     * @param {string} fileName - Tên của file cần đọc từ Steam Cloud.
     * @param {function} successCallback - Hàm callback được gọi khi đọc thành công, nhận nội dung file làm tham số.
     * @param {function} [errorCallback] - Hàm callback tùy chọn được gọi khi có lỗi (ví dụ: file không tồn tại).
     */
    Steam.readTextFromFile = function (fileName, successCallback, errorCallback) {
        // Chỉ thực hiện nếu Steam API có sẵn.
        if (Steam.isAvailable(errorCallback)) {
            greenworksApiInstance.readTextFromFile(fileName, successCallback, errorCallback);
        }
    };

    /**
     * Kích hoạt một thành tựu (achievement) trên Steam.
     * @param {string} achievementNameId - ID của thành tựu trên Steam.
     * @param {function} successCallback - Hàm callback được gọi khi kích hoạt thành công.
     * (Lưu ý: Trong code gốc, tham số thứ hai `g` không được sử dụng và có vẻ là `successCallback`)
     */
    Steam.activateAchievement = function (achievementNameId, successCallback) { // Đổi tên 'g' thành 'successCallback' cho rõ ràng
        // Chỉ thực hiện nếu Steam API có sẵn.
        if (Steam.isAvailable()) { // Không cần errorCallback ở đây vì lỗi kích hoạt thành tựu thường được xử lý riêng.
            greenworksApiInstance.activateAchievement(
                achievementNameId,
                successCallback, // Giả định 'g' trong code gốc là successCallback
                function (error) { // Hàm callback cho trường hợp lỗi từ activateAchievement
                    // Nếu cờ debug GameFlags.ghg6 được bật, hiển thị lỗi.
                    if (GameFlags.ghg6) {
                        PlatformShim.alert(error, "Error".localize());
                    }
                    // Có thể thêm xử lý lỗi khác ở đây nếu cần.
                }
            );
        }
    };

    /**
     * Lấy ngôn ngữ hiện tại của game được cài đặt trên Steam client.
     * @param {function} [errorCallback] - Hàm callback tùy chọn được gọi nếu không thể lấy ngôn ngữ (ví dụ: API không có sẵn).
     * @returns {string} - Trả về mã ngôn ngữ (ví dụ: "en", "de") hoặc "en" làm mặc định nếu không lấy được.
     */
    Steam.getCurrentGameLanguage = function (errorCallback) {
        // Nếu Steam API có sẵn, gọi hàm của Greenworks. Ngược lại, trả về "en".
        return Steam.isAvailable(errorCallback) ? greenworksApiInstance.getCurrentGameLanguage() : "en";
    };

    // Gán instance Greenworks (có thể là null nếu không tải được) vào Steam.api để các module khác có thể truy cập trực tiếp nếu cần.
    Steam.api = greenworksApiInstance;
})();