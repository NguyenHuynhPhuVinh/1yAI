var Logger = {};
(function () {
    // Biến lưu trữ danh sách các log lỗi, được load từ DataStore
    var errorLogsArray = void 0; // Trước đây là 'a'

    // Hàm tải danh sách log lỗi từ DataStore
    Logger.load = function () {
        DataStore.loadSlotAsync("errorLogs", function (loadedData) { // 'b' đổi thành 'loadedData'
            if (loadedData) {
                try {
                    errorLogsArray = JSON.parse(loadedData);
                } catch (parseError) { // 'c' đổi thành 'parseError'
                    errorLogsArray = []; // Nếu parse lỗi, khởi tạo mảng rỗng
                }
            } else {
                errorLogsArray = []; // Nếu không có dữ liệu, khởi tạo mảng rỗng
            }
        }, function (loadError) { // 'b' ở hàm callback lỗi đổi thành 'loadError'
            errorLogsArray = []; // Nếu load lỗi, khởi tạo mảng rỗng
        });
    };

    // Các cờ để quản lý trạng thái lưu bất đồng bộ, tránh ghi đè
    var isSavingInProgress = !1; // Trước đây là 'b'
    var hasPendingSaveRequest = !1; // Trước đây là 'c'

    // Hàm lưu danh sách log lỗi vào DataStore
    Logger.save = function () {
        if (isSavingInProgress) { // Nếu đang có một tiến trình lưu khác
            hasPendingSaveRequest = !0; // Đánh dấu là có yêu cầu lưu đang chờ
        } else {
            var logsStringified = JSON.stringify(errorLogsArray); // 'd' đổi thành 'logsStringified'
            isSavingInProgress = !0;
            DataStore.saveToSlotAsync("errorLogs", logsStringified, function () { // Callback thành công
                isSavingInProgress = !1;
                if (hasPendingSaveRequest) { // Nếu có yêu cầu lưu đang chờ
                    hasPendingSaveRequest = !1;
                    Logger.save(); // Thực hiện lại việc lưu
                }
            }, function (saveError) { // 'a' ở hàm callback lỗi đổi thành 'saveError'
                isSavingInProgress = !1; // Dù lỗi cũng reset cờ
            });
        }
    };

    // Hàm nội bộ để thêm một mục log mới vào danh sách
    // level: Mức độ log (ví dụ: "ERROR", "WARNING")
    // message: Nội dung log
    // errorObject: Đối tượng lỗi (nếu có), chứa stacktrace, number
    var addLogEntry = function (level, message, errorObject) { // 'f' đổi thành 'addLogEntry', 'b' thành 'level', 'c' thành 'message', 'f' thứ hai thành 'errorObject'
        try {
            if (errorLogsArray) { // Chỉ thêm log nếu mảng errorLogsArray đã được khởi tạo
                if (!errorObject) { // Nếu không có đối tượng lỗi được truyền vào, tạo một đối tượng rỗng
                    errorObject = {};
                }
                errorLogsArray.push({
                    date: (new Date()).toISOString(),
                    level: level,
                    msg: message,
                    stacktrace: errorObject.stack, // Lấy stacktrace từ đối tượng lỗi
                    number: errorObject.number    // Lấy mã lỗi từ đối tượng lỗi
                });
                // Giới hạn số lượng log được lưu trữ để tránh tệp log quá lớn
                if (errorLogsArray.length > 100) {
                    errorLogsArray.splice(0, errorLogsArray.length - 100);
                }
                Logger.save(); // Lưu lại danh sách log sau khi thêm
            }
        } catch (exception) { // 'l' đổi thành 'exception'
            // Bỏ qua lỗi nếu việc ghi log tự nó gây ra lỗi (ví dụ: JSON.stringify bị lỗi)
        }
    };

    // Ghi log lỗi từ Mod
    // modMessage: Thông điệp lỗi từ mod
    // modErrorObject: Đối tượng lỗi chi tiết từ mod (tùy chọn)
    // customDisplayMessage: Thông điệp tùy chỉnh để hiển thị cho người dùng (tùy chọn, ghi đè modMessage)
    Logger.LogModError = function (modMessage, modErrorObject, customDisplayMessage) { // 'a' thành 'modMessage', 'b' thành 'modErrorObject', 'c' thành 'customDisplayMessage'
        addLogEntry("MODERROR", modMessage, modErrorObject);
        var displayMessage = customDisplayMessage ? customDisplayMessage : modMessage; // 'a' thành 'displayMessage'
        // Hiển thị thông báo lỗi cho người dùng
        if (modErrorObject) {
            PlatformShim.alert(displayMessage + ": " + modErrorObject, "Error".localize());
        } else {
            PlatformShim.alert(displayMessage, "Error".localize());
        }
    };

    // Ghi log lỗi chung của game
    // errorMessage: Thông điệp lỗi
    // errorDetails: Đối tượng lỗi chi tiết (tùy chọn)
    // customDisplayMessage: Thông điệp tùy chỉnh để hiển thị cho người dùng (tùy chọn)
    Logger.LogError = function (errorMessage, errorDetails, customDisplayMessage) { // 'a' thành 'errorMessage', 'b' thành 'errorDetails', 'c' thành 'customDisplayMessage'
        addLogEntry("ERROR", errorMessage, errorDetails);
        var displayMessage = customDisplayMessage ? customDisplayMessage : errorMessage; // 'a' thành 'displayMessage'
        if (errorDetails) {
            displayMessage += "\n" + errorDetails + "\n";
        }
        // Nếu không có mod nào được bật, thêm thông tin liên hệ support
        if (!GameManager.areModsEnabled()) {
            displayMessage += "\n\n" + "If the issue persists please report this error to {0}".localize().format("support@greenheartgames.com");
        }
        PlatformShim.alert(displayMessage, "Error".localize());
    };

    // Ghi log cảnh báo
    // warningMessage: Nội dung cảnh báo
    // warningDetails: Chi tiết cảnh báo (tùy chọn)
    // customDisplayMessage: Thông điệp tùy chỉnh để hiển thị cho người dùng (tùy chọn)
    Logger.LogWarning = function (warningMessage, warningDetails, customDisplayMessage) { // 'a' thành 'warningMessage', 'b' thành 'warningDetails', 'c' thành 'customDisplayMessage'
        addLogEntry("WARNING", warningMessage, warningDetails);
        var displayMessage = customDisplayMessage ? customDisplayMessage : warningMessage; // 'a' thành 'displayMessage'

        // Hiển thị cảnh báo dưới dạng một overlay tạm thời trong game
        $("#gameErrorOverlay").css("top", CanvasManager.backgroundCanvas.height - 60);
        $("#gameErrorOverlay")[0].innerText = displayMessage;
        $("#gameErrorOverlay").css("opacity", 0).show().transit({
            opacity: 1
        }, 1000, function () { // 1000ms = 1E3
            $("#gameErrorOverlay").transit({
                opacity: 1
            }, 3000, function () { // 3000ms = 3E3
                $("#gameErrorOverlay").transit({
                    opacity: 0
                }, 1000, function () { // 1000ms = 1E3
                    $("#gameErrorOverlay").hide();
                });
            });
        });
    };

    // Ghi log thông tin
    // infoMessage: Nội dung thông tin
    // infoDetails: Chi tiết thông tin (tùy chọn)
    Logger.LogInfo = function (infoMessage, infoDetails) { // 'a' thành 'infoMessage', 'b' thành 'infoDetails'
        addLogEntry("INFO", infoMessage, infoDetails);
    };
})();