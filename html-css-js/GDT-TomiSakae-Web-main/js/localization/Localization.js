var Localization = {};
(function () {
    // Gán Localization cho biến cục bộ để dễ truy cập và có thể để tối ưu kích thước file sau khi minify
    var localizationModule = Localization;
    // Đối tượng lưu trữ các bản dịch, key là index trong mảng keys
    localizationModule.dict = {};
    // Mảng lưu trữ các key gốc và comment (nếu có) để tra cứu bản dịch
    localizationModule.keys = [];

    // Mở rộng String prototype để có thể gọi .localize() trực tiếp trên một chuỗi
    String.prototype.localize = function (comment) { // 'comment' (trước đây là 'b') dùng để phân biệt các key giống nhau nhưng có ngữ cảnh khác nhau
        return localizationModule.localize(this.toString(), comment);
    };

    // Hàm chính để thực hiện việc dịch thuật
    localizationModule.localize = function (originalString, comment) { // 'originalString' (trước đây là 'c'), 'comment' (trước đây là 'f')
        // 'isLanguageSet' (trước đây là 'b') là biến cờ cho biết ngôn ngữ khác 'en' đã được thiết lập hay chưa
        if (isLanguageSet) {
            // Tạo một key duy nhất bằng cách nối chuỗi gốc với một ký tự đặc biệt
            var lookupKey = originalString + "\u00b0\u00b0"; // 'lookupKey' (trước đây là 'd')
            // Nếu có comment, thêm comment vào key để phân biệt
            if (comment) {
                lookupKey += comment;
            }

            // Tìm index của key trong mảng keys
            var keyIndex = localizationModule.keys.weakIndexOf(lookupKey); // 'keyIndex' (trước đây là 'k')

            // Nếu tìm thấy key (có hoặc không có comment)
            if (keyIndex !== -1) {
                return localizationModule.dict[keyIndex];
            } else if (comment) {
                // Thử tìm lại chỉ với chuỗi gốc (không có comment) nếu lần tìm với comment thất bại
                lookupKey = originalString + "\u00b0\u00b0";
                keyIndex = localizationModule.keys.weakIndexOf(lookupKey);
                if (keyIndex !== -1) {
                    return localizationModule.dict[keyIndex];
                }
            }

            // Nếu không tìm thấy key chính xác, thử tìm key gần đúng (bắt đầu bằng chuỗi gốc)
            // Điều này hữu ích nếu trong dictionary có key dài hơn (ví dụ có thêm thông tin)
            var partialMatchKey = localizationModule.keys.first(function (existingKey) { // 'partialMatchKey' (trước đây là 'd')
                return existingKey.startsWith(lookupKey); // 'lookupKey' ở đây có thể có hoặc không có comment
            });

            // Nếu tìm thấy key gần đúng
            if (typeof partialMatchKey !== 'undefined' && partialMatchKey !== null) {
                keyIndex = localizationModule.keys.weakIndexOf(partialMatchKey);
                if (keyIndex !== -1) {
                    return localizationModule.dict[keyIndex];
                }
            }
        }
        // Nếu không tìm thấy bản dịch hoặc ngôn ngữ là 'en', trả về chuỗi gốc
        return originalString;
    };

    // Xử lý các placeholder dịch thuật trong một đoạn HTML
    localizationModule.processHtml = function (elementSelector) { // 'elementSelector' (trước đây là 'a')
        var jQueryElement = $(elementSelector); // 'jQueryElement' (trước đây là 'b')
        var htmlContent = jQueryElement.html(); // 'htmlContent' (trước đây là 'd')

        // Duyệt qua chuỗi HTML để tìm các placeholder dịch thuật
        // Placeholder có dạng ll:{key} hoặc ll:{key},lc:{comment}
        for (var startIndex = 0; (startIndex = htmlContent.indexOf("ll:{", startIndex)) !== -1;) { // 'startIndex' (trước đây là 'a')
            var endIndex = htmlContent.indexOf("}", startIndex + 1); // 'endIndex' (trước đây là 'k')
            var placeholder = htmlContent.slice(startIndex, endIndex + 1); // 'placeholder' (trước đây là 'm')
            var keyToLocalize = placeholder.slice(4, placeholder.length - 1); // 'keyToLocalize' (trước đây là 'l')
            var comment = null; // 'comment' (trước đây là 'g')
            var commentStartIndex = htmlContent.indexOf(",lc:{", endIndex); // 'commentStartIndex' (trước đây là 'n')

            // Kiểm tra xem có comment đi kèm không
            if (commentStartIndex === endIndex + 1) {
                var commentEndIndex = htmlContent.indexOf("}", commentStartIndex);
                comment = htmlContent.slice(commentStartIndex + 5, commentEndIndex);
                placeholder += ",lc:{" + comment + "}"; // Mở rộng placeholder để bao gồm cả comment
            }

            // Thực hiện dịch và thay thế placeholder bằng chuỗi đã dịch
            htmlContent = htmlContent.replaceAll(placeholder, PlatformShim.toStaticHtml(keyToLocalize.localize(comment)));
            startIndex++; // Tăng startIndex để tránh vòng lặp vô hạn nếu replace không thành công
        }

        // Cập nhật nội dung HTML của element bằng chuỗi đã xử lý
        // Sử dụng PlatformShim.execUnsafeLocalFunction để tránh các vấn đề bảo mật tiềm ẩn khi chèn HTML động
        PlatformShim.execUnsafeLocalFunction(function () {
            jQueryElement.html(htmlContent);
        });
    };

    // Biến cờ cho biết ngôn ngữ khác 'en' đã được thiết lập hay chưa
    var isLanguageSet; // (trước đây là 'b')

    // Hàm tải và thiết lập dữ liệu ngôn ngữ
    localizationModule.invalidateLanguage = function (languageCode) { // 'languageCode' (trước đây là 'c')
        try {
            // Chỉ xử lý nếu có languageCode và không phải là 'en' (tiếng Anh là mặc định)
            if (languageCode && languageCode !== "en") {
                isLanguageSet = true; // Đặt cờ là ngôn ngữ đã được thiết lập
                var languageData = Languages[languageCode]; // 'languageData' (trước đây là 'f'), lấy dữ liệu ngôn ngữ từ đối tượng toàn cục Languages
                localizationModule.keys = []; // Reset mảng keys
                localizationModule.dict = {}; // Reset dictionary dịch thuật

                // Nếu có dữ liệu dịch thuật trong languageData
                if (languageData.values) {
                    for (var i = 0; i < languageData.values.length; i++) { // 'i' (trước đây là 'c')
                        var translationEntry = languageData.values[i]; // 'translationEntry' (trước đây là 'd')
                        // Tạo key tra cứu duy nhất
                        var lookupKey = translationEntry.value + "\u00b0\u00b0"; // 'lookupKey' (trước đây là 'k')
                        // Nếu có comment, thêm vào key
                        if (translationEntry.comment) {
                            lookupKey += translationEntry.comment;
                        }
                        // Thêm key và bản dịch vào mảng/dictionary
                        localizationModule.keys.push(lookupKey);
                        localizationModule.dict[localizationModule.keys.length - 1] = translationEntry.translation;
                    }
                }
            } else {
                isLanguageSet = false; // Nếu là 'en' hoặc không có languageCode, reset cờ
            }
        } catch (error) { // 'error' (trước đây là 'm')
            var errorNumber = error ? error.number : null; // 'errorNumber' (trước đây là 'f' trong khối catch)
            isLanguageSet = false; // Reset cờ khi có lỗi
            // Ghi log lỗi (nếu có module ghg4 và Logger)
            if (typeof ghg4 !== 'undefined' && ghg4 && ghg4.ghg5) {
                ghg4.ghg5("invalidateLanguage failed", {
                    "error-nr": errorNumber
                });
            }
            Logger.LogInfo("invalidateLanguage failed", error);
        }
    };

    // Kiểm tra xem ngôn ngữ có phải là ngôn ngữ đọc từ phải sang trái (RTL) không
    localizationModule.isRTLLanguage = function (languageCode) { // 'languageCode' (trước đây là 'a')
        // Nếu không có languageCode, lấy ngôn ngữ ưu tiên từ GameManager
        languageCode = languageCode || (typeof GameManager !== 'undefined' && GameManager.getPreferredLanguage ? GameManager.getPreferredLanguage() : 'en');
        return languageCode === "arsa"; // "arsa" có thể là mã cho tiếng Ả Rập hoặc một ngôn ngữ RTL khác
    };

    // Thiết lập ngôn ngữ cho game
    localizationModule.setLanguage = function (languageCode) { // 'languageCode' (trước đây là 'b')
        localizationModule.invalidateLanguage(languageCode); // Tải dữ liệu ngôn ngữ

        // Nếu có languageCode, thử tải file locale cho thư viện jquery.timeago
        if (languageCode) {
            try {
                // Giả sử requireLoad là một hàm tải module bất đồng bộ
                if (typeof requireLoad === 'function') {
                    //requireLoad(["./libs/locales/jquery.timeago." + languageCode + ".js"], function () { }, function () { });
                }
            } catch (error) { // 'error' (trước đây là 'f' trong khối catch này)
                // Bỏ qua lỗi nếu không tải được file locale
            }
        }

        // Nếu là ngôn ngữ RTL, thêm file CSS đặc biệt cho RTL
        if (localizationModule.isRTLLanguage(languageCode)) {
            var rtlStylesheet = document.createElement("link"); // 'rtlStylesheet' (trước đây là 'b' trong phạm vi này)
            rtlStylesheet.setAttribute("rel", "stylesheet");
            rtlStylesheet.setAttribute("type", "text/css");
            rtlStylesheet.setAttribute("href", "./css/rtl.css");
            document.getElementsByTagName("head")[0].appendChild(rtlStylesheet);
        }
    };
})();