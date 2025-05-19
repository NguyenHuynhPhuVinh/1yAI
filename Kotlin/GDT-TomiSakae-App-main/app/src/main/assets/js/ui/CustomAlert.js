// --- START OF FILE CustomAlert.js ---

var CustomAlert = {}; // Khởi tạo namespace CustomAlert
(function (customAlertModule) { // Sử dụng IIFE để tạo scope riêng và truyền vào CustomAlert làm tham số
    // Hàm khởi tạo, ghi đè hàm alert mặc định của trình duyệt
    customAlertModule.init = function () {
        window.alert = function (message, type) { // 'b' -> 'message', 'c' -> 'type'
            // Ghi log thông tin alert ra console
            console.log("-- Alert Log --");
            console.log("Type: " + type);
            console.log("Message: " + message);
            console.log("-- --------- --");
            // Gọi hàm show của CustomAlert để hiển thị alert tùy chỉnh
            customAlertModule.show(message, type);
        }
    };

    // Mảng lưu trữ các alert đang được hiển thị (để có thể xếp chồng)
    customAlertModule.stack = [];

    // Các hàm tiện ích để hiển thị các loại alert cụ thể
    customAlertModule.info = function (message) { // 'b' -> 'message'
        customAlertModule.show(message, "INFO");
    };
    customAlertModule.warn = function (message) { // 'b' -> 'message'
        customAlertModule.show(message, "WARN");
    };
    customAlertModule.error = function (message) { // 'b' -> 'message'
        customAlertModule.show(message, "ERR");
    };
    customAlertModule.response = function (message) { // 'b' -> 'message'
        customAlertModule.show(message, "RESP");
    };
    customAlertModule.success = function (message) { // 'b' -> 'message'
        customAlertModule.show(message, "SUCC");
    };
    customAlertModule.tutorial = function (message) { // 'b' -> 'message'
        customAlertModule.show(message, "TUT");
    };
    customAlertModule.hint = function (message) { // 'b' -> 'message'
        customAlertModule.show(message, "HINT");
    };

    // Hàm chính để hiển thị alert tùy chỉnh
    // message: Nội dung alert
    // type: Loại alert (ERR, SUCC, INFO, etc.)
    // urlTitle: Tiêu đề cho nút URL (nếu có)
    // externalUrl: URL để mở khi click nút URL
    customAlertModule.show = function (message, type, urlTitle, externalUrl) { // 'b' -> 'message', 'c' -> 'type', 'f' -> 'urlTitle', 'd' -> 'externalUrl'
        // Thay thế ký tự xuống dòng bằng thẻ <br/>
        message = ("" + message).replaceAll("\n", "<br/>");
        // Chuẩn hóa loại alert, mặc định là ERROR nếu không có
        type = type ? type.toUpperCase() : "ERROR";

        // Lấy thông tin cửa sổ trình duyệt để tính toán vị trí
        var $window = $(window); // 'k' -> '$window'
        var windowWidth = $window.width(); // 'm' -> 'windowWidth'
        // k.height(); // Dòng này có vẻ không sử dụng kết quả, có thể bỏ
        var alertLeftPosition = 0.5 * windowWidth - 360; // 'l' -> 'alertLeftPosition'

        // Tạo các element HTML cho alert
        var $alertContainer = $(document.createElement("div")); // 'g' -> '$alertContainer'
        var $closeButton = $(document.createElement("div")); // 'k' -> '$closeButton' (mới)
        var $urlButton = $(document.createElement("div")); // 'm' -> '$urlButton' (mới)

        var iconClass = ""; // 'n' -> 'iconClass'
        var targetUrl = externalUrl ? externalUrl : "http://forum.greenheartgames.com"; // 'r' -> 'targetUrl'

        // Thêm class và CSS cho container của alert
        $alertContainer.addClass("errorMessage window");
        $alertContainer.addClass("ul-vt-textbox");
        $alertContainer.css({
            left: alertLeftPosition,
            top: 20
        });

        // Thêm class và thuộc tính cho nút đóng
        $closeButton.addClass("icon-remove-sign");
        $closeButton.addClass("errorMessage button close");
        $closeButton.attr("title", "Close this update notification"); // Nên được localize

        // Thêm class và thuộc tính cho nút URL
        $urlButton.addClass("icon-external-link");
        $urlButton.addClass("errorMessage button url");
        urlTitle ? $urlButton.attr("title", urlTitle) : $urlButton.attr("title", "Click here to head to the Greenheart Games Forums (http://forum.greenheartgames.com/)"); // Nên được localize

        var headerTextValue; // Biến tạm để lưu headerText

        // Xác định header text và icon class dựa trên loại alert
        switch (type) {
            case "ERR":
                headerTextValue = "Error Alert"; // Nên được localize
                $alertContainer.addClass("msg-error");
                iconClass = "icon-warning-sign";
                break;
            case "SUCC":
                headerTextValue = "Success Alert"; // Nên được localize
                $alertContainer.addClass("msg-success");
                iconClass = "icon-ok-circle";
                break;
            case "HINT":
                headerTextValue = "Hint Alert"; // Nên được localize
                $alertContainer.addClass("msg-hint");
                iconClass = "icon-eye-open";
                break;
            case "WARN":
                headerTextValue = "Warning Alert"; // Nên được localize
                $alertContainer.addClass("msg-warning");
                iconClass = "icon-exclamation-sign";
                break;
            case "INFO":
                headerTextValue = "Information Alert"; // Nên được localize
                $alertContainer.addClass("msg-info");
                iconClass = "icon-info-sign";
                break;
            case "RESP":
                headerTextValue = "Information Alert"; // Nên được localize
                $alertContainer.addClass("msg-response");
                iconClass = "icon-envelope";
                break;
            case "TUT":
                headerTextValue = "Tutorial Alert"; // Nên được localize
                $alertContainer.addClass("msg-tutorial");
                iconClass = "icon-comment";
                break;
            default:
                headerTextValue = "Error Alert"; // Nên được localize
                $alertContainer.addClass("msg-default");
                iconClass = "icon-exclamation-sign";
        }

        // Thêm alert vào body của trang
        $("body").append($alertContainer);
        // Thiết lập nội dung HTML cho alert
        $alertContainer.html('<h3><i class="' + iconClass + ' icon-2x">  <span class="errorMessage-header">' + headerTextValue + '</span></i></h3><p class="errorMessage">' + message + "</p>");

        // Nếu là alert lỗi, thêm thông tin gỡ lỗi (phiên bản game, platform, mods)
        if ("ERROR" === type || "ERR" === type) try {
            var modsListHtml = ""; // 'p' -> 'modsListHtml'
            var distributionInfo = ""; // 'c' -> 'distributionInfo' (ban đầu)
            distributionInfo = GameFlags.IS_STEAM ? distributionInfo + "Steam" : PlatformShim.ISWIN8 ? distributionInfo + "Metro" : distributionInfo + "Standalone";
            var platformInfo = ""; // 'f' -> 'platformInfo' (ban đầu)
            switch (process.platform) { // `process` là đối tượng của Node.js, cho thấy game có thể chạy trên NW.js/Electron
                case "darwin":
                    platformInfo += "Mac";
                    break;
                case "freebsd":
                    platformInfo += "FreeBSD";
                    break;
                case "linux":
                    platformInfo += "Linux";
                    break;
                case "sunos":
                    platformInfo += "Sunos";
                    break;
                case "win32":
                    platformInfo += "Windows";
                    PlatformShim.ISWIN8 && (platformInfo += " 8");
                    break;
                default:
                    platformInfo += "unknown";
            }
            // Kiểm tra nếu không phải Win8 (có thể là NW.js/Electron nơi ModSupport tồn tại)
            // Và thêm thông tin về các mod đang kích hoạt
            PlatformShim.ISWIN8 || ($.grep(ModSupport.currentMods, function (modId, index) { // 'a' -> 'modId', 'b' -> 'index'
                ModSupport.availableMods.forEach(function (modDetails) { // 'b' -> 'modDetails'
                    modId == modDetails.id && (modsListHtml += "<li>" + modDetails.name + " by " +
                        modDetails.author + "</li>");
                })
            }), 1 > modsListHtml.length && (modsListHtml = "<li>No mods activated.</li>"), modsListHtml = "<ul style='text-align:left;'>{0}</ul>".format(modsListHtml), $alertContainer.append("{0}Enabled Mods: {1}{2}".format("<p class='errorMessage left'><span>", "</span> </p>", modsListHtml))); // Các chuỗi này nên được localize

            // Thêm thông tin phiên bản game, nền tảng, và kênh phân phối
            $alertContainer.append("{0}Game Version: {1}{2}{3}".format("<p class='errorMessage left'><span>", "</span> ", PlatformShim.getVersion(), "</p>"));
            $alertContainer.append("{0}Platform: {1}{2}{3}".format("<p class='errorMessage left'><span>", "</span> ", platformInfo, "</p>"));
            $alertContainer.append("{0}Distribution: {1}{2}{3}".format("<p class='errorMessage left'><span>", "</span> ", distributionInfo, "</p>"));
        } catch (errorDetails) { // 's' -> 'errorDetails'
            // Nếu có lỗi trong quá trình lấy thông tin gỡ lỗi
            $alertContainer.append("{0}Note: {1}{2}{3}".format("<p class='errorMessage left'><span>", "</span> ", "Error occurred before the game finished intialising.", "</p>")); // Nên được localize
        }

        // Thêm nút đóng và nút URL vào đầu container alert
        $closeButton.prependTo($alertContainer);
        $urlButton.prependTo($alertContainer);

        // Gán sự kiện click cho nút đóng
        $closeButton.clickExcl(function () {
            var stackIndex = customAlertModule.stack.indexOf($alertContainer); // 'b' -> 'stackIndex'
            -1 < stackIndex && customAlertModule.stack.splice(stackIndex, 1);
            $alertContainer.remove();
        });

        // Gán sự kiện click cho nút URL
        $urlButton.clickExcl(function () {
            PlatformShim.openUrlExternal(targetUrl);
            $alertContainer.remove();
        });

        // Thêm alert hiện tại vào stack để quản lý việc xếp chồng
        customAlertModule.stack.push($alertContainer);
        // Nếu có nhiều alert, di chuyển alert mới một chút để tạo hiệu ứng xếp chồng
        customAlertModule.stack && 0 < customAlertModule.stack.length && $alertContainer.css({
            left: "+=" + -(5 * customAlertModule.stack.length),
            top: "+=" + 5 * customAlertModule.stack.length
        });
    };
    return customAlertModule; // Trả về module đã được mở rộng
})(CustomAlert || {}); // Nếu CustomAlert chưa tồn tại, khởi tạo nó là một object rỗng