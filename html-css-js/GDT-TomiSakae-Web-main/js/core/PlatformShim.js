var PlatformShim = {};
(function () {
    // --- Biến thể PlatformShim cơ bản/mặc định (ví dụ: cho web/môi trường không có API đặc biệt) ---
    var defaultPlatformInterface = {}; // Đổi tên 'a' thành 'defaultPlatformInterface'
    (function () {
        defaultPlatformInterface.execUnsafeLocalFunction = function (callback) { // Đổi tên 'a' thành 'callback'
            callback(); // Thực thi callback được truyền vào
        };
        defaultPlatformInterface.toStaticHtml = function (htmlString) { // Đổi tên 'a' thành 'htmlString'
            return htmlString; // Trả về chuỗi HTML không thay đổi (không có xử lý an toàn đặc biệt)
        };
        defaultPlatformInterface.getUserName = function () {
            return "Player".localize(); // Trả về tên người chơi mặc định
        };
        defaultPlatformInterface.goToReviewPage = function () { }; // Hàm rỗng, không làm gì cả
        defaultPlatformInterface.xhr = function (options, successCallback, errorCallback) { // Đổi tên 'a' thành 'options', 'b' thành 'successCallback', 'c' thành 'errorCallback'
            successCallback(); // Mặc định gọi ngay callback thành công (giả lập)
        };
        defaultPlatformInterface.alert = function (message, title) { // Đổi tên 'a' thành 'message', 'b' thành 'title'
            alert(message); // Sử dụng hàm alert gốc của trình duyệt
        };
    })();

    // --- Biến thể PlatformShim cho Windows 8 (WinJS) ---
    var win8PlatformInterface = {}; // Đổi tên 'b' thành 'win8PlatformInterface'
    (function () {
        win8PlatformInterface.execUnsafeLocalFunction = function (callback) { // Đổi tên 'a' thành 'callback'
            MSApp.execUnsafeLocalFunction(callback); // Sử dụng API của Windows Store
        };
        win8PlatformInterface.toStaticHtml = function (htmlString) { // Đổi tên 'a' thành 'htmlString'
            return toStaticHTML(htmlString); // Sử dụng API của Windows Store để tạo HTML an toàn
        };
        win8PlatformInterface.getUserName = function () {
            return WindowsIntegration.getUserName(); // Lấy tên người dùng từ WindowsIntegration
        };
        win8PlatformInterface.goToReviewPage = function () {
            WindowsIntegration.goToReviewPage(); // Chuyển đến trang đánh giá của Windows Store
        };
        win8PlatformInterface.xhr = function (options, successCallback, errorCallback) { // Đổi tên 'a' thành 'options', 'b' thành 'successCallback', 'c' thành 'errorCallback'
            WinJS.xhr(options).done(successCallback, errorCallback); // Sử dụng WinJS.xhr cho yêu cầu mạng
        };
        win8PlatformInterface.alert = function (message, title) { // Đổi tên 'a' thành 'message', 'b' thành 'title'
            (new Windows.UI.Popups.MessageDialog(message, title)).showAsync(); // Hiển thị dialog thông báo của Windows
        };
        win8PlatformInterface.ISWIN8 = !0; // Cờ xác định đây là môi trường Windows 8
        win8PlatformInterface.ISLOWRES = GameFlags.IS_LOW_RES; // Cờ xác định có phải độ phân giải thấp hay không (từ GameFlags)
        win8PlatformInterface.getVersion = function () {
            var packageVersion = Windows.ApplicationModel.Package.current.id.version; // Đổi tên 'a' thành 'packageVersion'
            return [packageVersion.major, packageVersion.minor, packageVersion.build, packageVersion.revision].join("."); // Lấy phiên bản ứng dụng từ package
        };
        win8PlatformInterface.openUrlExternal = function (url) { // Đổi tên 'a' thành 'url'
            url = new Windows.Foundation.Uri(url); // Tạo đối tượng Uri từ chuỗi url
            Windows.System.Launcher.launchUriAsync(url).done(); // Mở URL bằng trình duyệt mặc định
        };
    })();

    // --- Logic lựa chọn PlatformShim phù hợp ---
    var isMSAppAvailable = !1; // Đổi tên 'c' thành 'isMSAppAvailable'
    try {
        isMSAppAvailable = (void 0 != MSApp); // Kiểm tra sự tồn tại của đối tượng MSApp (chỉ có trên Windows Store apps)
    } catch (checkError) { // Đổi tên 'f' thành 'checkError'
        Logger.LogInfo("hasMSapp check failed", checkError); // Ghi log nếu việc kiểm tra thất bại
    }

    if (isMSAppAvailable) { // Nếu MSApp tồn tại (đang chạy trên Windows Store)
        PlatformShim = win8PlatformInterface; // Sử dụng interface cho Win8
        // Đăng ký trình xử lý lỗi toàn cục cho ứng dụng WinJS
        WinJS.Application.onerror = function (errorEvent) { // Đổi tên 'a' thành 'errorEvent'
            if ("error" == errorEvent.type) {
                if (errorEvent.detail.stack) { // Nếu có stack trace
                    ErrorReporting.report(errorEvent.detail); // Báo cáo lỗi
                    PlatformShim.alert("Unexpected error. You might have to restart the game.".localize() + "\n{0}".format(errorEvent.detail.message), "Unexpected error".localize());
                } else { // Nếu không có stack trace, lấy thông tin lỗi cơ bản
                    var errorMessage = errorEvent.detail.errorMessage; // Đổi tên 'b' thành 'errorMessage'
                    var errorLine = errorEvent.detail.errorLine; // Đổi tên 'c' thành 'errorLine'
                    var errorUrl = errorEvent.detail.errorUrl; // Đổi tên 'a' (trong scope này) thành 'errorUrl'
                    ErrorReporting.report("{0}-{1}-{2}".format(errorMessage, errorUrl, errorLine));
                    PlatformShim.alert("Unexpected error. You might have to restart the game.".localize() + "\n{0}-{1}-{2}".format(errorMessage, errorUrl, errorLine), "Unexpected error".localize());
                }
                return !0; // Đã xử lý lỗi
            }
        };
    } else { // Nếu không phải Windows Store (mặc định là desktop/web với NW.js)
        PlatformShim = defaultPlatformInterface; // Sử dụng interface mặc định

        // Chặn hành vi kéo thả mặc định của trình duyệt
        window.ondragover = function (event) { // Đổi tên 'a' thành 'event'
            event.preventDefault();
            return !1;
        };
        window.ondrop = function (event) { // Đổi tên 'a' thành 'event'
            event.preventDefault();
            return !1;
        };

        // Đăng ký trình xử lý lỗi toàn cục của window
        window.onerror = function (message, source, lineno, colno, errorObject) { // Đổi tên 'a' thành 'message', 'b' thành 'source', 'c' thành 'lineno', 'l' thành 'colno', 'g' thành 'errorObject'
            Logger.LogError("Unexpected error. You might have to restart the game.".localize() + "\n{0}".format(message), null, errorObject);
        };

        // --- Các hàm mở rộng PlatformShim cho môi trường NW.js ---
        PlatformShim.openUrlExternal = function (url) { // Đổi tên 'a' thành 'url'
            require("nw.gui").Shell.openExternal(url); // Sử dụng API của NW.js để mở URL
        };
        PlatformShim.toggleFullscreen = function () {
            var nwWindow = require("nw.gui").Window.get(); // Đổi tên 'a' thành 'nwWindow'
            nwWindow.toggleFullscreen();
            return nwWindow.isFullscreen;
        };
        PlatformShim.getVersion = function () {
            // Lấy phiên bản từ UpdateChecker nếu có, nếu không trả về placeholder
            return "undefined" != typeof UpdateChecker ? UpdateChecker.VERSION : "{VERSION}";
        };
        PlatformShim.restartApp = function () {
            require("nw.gui").Window.get().reload(3); // Reload ứng dụng NW.js
        };
        PlatformShim.terminateApp = function () {
            require("nw.gui").App.closeAllWindows(); // Đóng tất cả cửa sổ và thoát ứng dụng NW.js
        };
        PlatformShim.getScriptFile = function (resolvePath) { // Đổi tên 'a' thành 'resolvePath'
            // Lấy đường dẫn của script hiện tại đang thực thi
            var scriptSrc = document.currentScript ? unescape(document.currentScript.src) : ""; // Đổi tên 'b' thành 'scriptSrc'
            if ("" === scriptSrc) return "";

            var pathModule = require("path"); // Đổi tên 'c' thành 'pathModule'
            // Lấy thư mục chứa file thực thi của ứng dụng (trong NW.js)
            (pathModule ? pathModule.dirname(process.execPath) : "").replaceAll("\\", "/");

            // Chuẩn hóa đường dẫn script
            scriptSrc = scriptSrc.replaceAll("../", "").replaceAll("..\\", "");
            if ("file:///" == scriptSrc.substring(0, 8)) {
                scriptSrc = scriptSrc.substring(8);
            }
            // Nếu yêu cầu resolve path, sử dụng path.resolve, ngược lại trả về đường dẫn đã chuẩn hóa
            return !0 === resolvePath ? (pathModule ? pathModule.resolve(scriptSrc) : "") : scriptSrc;
        };
        PlatformShim.getScriptPath = function (resolvePath) { // Đổi tên 'a' thành 'resolvePath'
            var scriptFile = PlatformShim.getScriptFile(resolvePath); // Đổi tên 'a' thành 'scriptFile'
            // Lấy thư mục chứa script
            return (scriptFile && 0 <= scriptFile.lastIndexOf("/")) ? scriptFile.substr(0, scriptFile.lastIndexOf("/")) : scriptFile;
        };
    }

    // --- Hàm lấy chuỗi phiên bản đầy đủ ---
    PlatformShim.getFullVersionString = function () {
        var version = PlatformShim.getVersion(); // Đổi tên 'a' thành 'version'
        var platformSuffix = ""; // Đổi tên 'b' thành 'platformSuffix'

        if (PlatformShim.ISWIN8) {
            platformSuffix += "-winstore";
        }
        if (GameFlags.ARM_VERSION) {
            platformSuffix += "-arm";
        }

        platformSuffix = GameFlags.IS_STEAM ? platformSuffix + "-steam" : platformSuffix + "-standalone";

        return "{0}{1}{2}".format(version, platformSuffix, GameFlags.ghg6 ? "-debug" : "");
    };
})();