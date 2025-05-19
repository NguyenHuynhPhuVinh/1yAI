"use strict";

// Định nghĩa các loại thông báo khác nhau trong game.
var NotificationType = {
    Default: "Default", // Loại mặc định, ít dùng trực tiếp
    PlatformNews: "PlatformNews", // Tin tức về nền tảng (console, PC)
    IndustryNews: "IndustryNews", // Tin tức chung của ngành game
    NewResearchAvailable: "NewResearchAvailable", // Có nghiên cứu mới
    CompanyMilestones: "CompanyMilestones", // Các cột mốc của công ty
    SalesReports: "SalesReports", // Báo cáo doanh số
    GameReports: "GameReports", // Báo cáo về game (ví dụ: sau khi phân tích)
    Events: "Events", // Các sự kiện đặc biệt, thường có lựa chọn
    AutoPopup: "AutoPopup", // Thông báo tự động hiện ra, không cần người dùng nhấp vào sidebar
    Others: "Others" // Các loại khác
},
    // Chuỗi hiển thị cho từng loại thông báo (dùng cho UI, ví dụ: bộ lọc tin nhắn)
    NotificationTypeDisplayString = {
        PlatformNews: "Platform News".localize(),
        IndustryNews: "Industry News".localize(),
        NewResearchAvailable: "New Research Available".localize(),
        CompanyMilestones: "Company Milestones".localize(),
        SalesReports: "Sales Reports".localize(),
        GameReports: "Game Reports".localize(),
        Events: "Events".localize(),
        Others: "Others".localize()
    },
    // Constructor cho đối tượng Notification.
    // Có thể được gọi với một object chứa các thuộc tính, hoặc với các tham số riêng lẻ.
    Notification = function (headerOrOptions, textParam, buttonTextOrOptionsParam, weeksOrOptionsParam, optionsOnlyParam) {
        this.id = GameManager.getGUID(); // Mỗi thông báo có một ID duy nhất

        // Trường hợp 1: Chỉ truyền vào một object chứa tất cả thông tin
        if (1 === arguments.length && arguments[0].constructor == {}.constructor) {
            $.extend(this, arguments[0]); // Sao chép tất cả thuộc tính từ object vào 'this'
            // Nếu không có buttonText, đặt mặc định là "OK"
            this.buttonText || (this.buttonText = "OK".localize());
            // Nếu không có weeksUntilFired, đặt mặc định là 0 (hiển thị ngay)
            void 0 === this.weeksUntilFired && (this.weeksUntilFired = 0);
        } else { // Trường hợp 2: Truyền vào các tham số riêng lẻ
            this.header = headerOrOptions;
            this.text = textParam;

            // Xử lý buttonTextOrOptionsParam: có thể là text cho nút, hoặc là một object options
            this.tryApplyOptions(buttonTextOrOptionsParam) ? this.buttonText = "OK".localize() : this.buttonText = buttonTextOrOptionsParam ? buttonTextOrOptionsParam : "OK".localize();

            // Xử lý weeksOrOptionsParam: có thể là số tuần, hoặc là một object options
            this.tryApplyOptions(weeksOrOptionsParam) ? this.weeksUntilFired = 0 : this.weeksUntilFired = weeksOrOptionsParam ? weeksOrOptionsParam : 0;

            // Xử lý optionsOnlyParam: chỉ có thể là một object options
            this.tryApplyOptions(optionsOnlyParam);
        }
    };

(function () {
    // Phương thức tĩnh để tải một Notification từ dữ liệu đã lưu
    Notification.load = function (savedNotificationData) {
        return new Notification(savedNotificationData);
    };

    var notificationPrototype = Notification.prototype; // Lấy prototype của Notification để thêm phương thức

    // Thử áp dụng các tùy chọn từ một object vào instance hiện tại của Notification
    // Trả về true nếu optionsObject là một object hợp lệ và được áp dụng, ngược lại false.
    notificationPrototype.tryApplyOptions = function (optionsObject) {
        return optionsObject && optionsObject.constructor == {}.constructor ? ($.extend(this, optionsObject), !0) : !1;
    };

    // Phương thức để lưu trữ trạng thái của Notification thành một object đơn giản
    notificationPrototype.save = function () {
        var savedData = {};
        $.extend(savedData, this); // Sao chép tất cả thuộc tính của instance vào savedData
        return savedData;
    };

    // Suy ra loại thông báo dựa trên nội dung header hoặc các thuộc tính khác
    notificationPrototype.getInferredType = function () {
        // Nếu đã có type cụ thể (không phải Default), trả về nó luôn
        if (this.type && this.type != NotificationType.Default) return this.type;
        // Nếu header bắt đầu bằng "{", đó là AutoPopup (thường dùng cho các dialog nội bộ)
        if (this.header.startsWith("{")) return NotificationType.AutoPopup;
        // So sánh header với các tiêu đề chuẩn của Media module
        if (this.header == Media.platformNewsHeadline) return NotificationType.PlatformNews;
        if (this.header == Media.industryNewsHeadline ||
            this.header == "News".localize() || this.header == "Local News".localize()) return NotificationType.IndustryNews;
        // Nếu có nhiều lựa chọn (options), đó là một Event
        if (this.options instanceof Array && 1 < this.options.length) return NotificationType.Events;
        // Mặc định là Others
        return NotificationType.Others;
    };

    // Kiểm tra xem thông báo này có nên được hiển thị trong sidebar không
    notificationPrototype.shouldShowInSidebar = function () {
        var inferredType = this.getInferredType();
        return Notification.shouldShowInSideBar(inferredType);
    };

    // Phương thức tĩnh: Kiểm tra xem một loại thông báo có nên hiển thị trong sidebar không
    Notification.shouldShowInSideBar = function (notificationType) {
        // AutoPopup không bao giờ hiển thị trong sidebar
        if (notificationType == NotificationType.AutoPopup) return !1;

        var messageSettings = DataStore.getMessageSettings(); // Lấy cài đặt hiển thị tin nhắn của người dùng
        // Các loại mặc định sẽ hiển thị trong sidebar
        var defaultSidebarSettings = {};
        defaultSidebarSettings[NotificationType.GameReports] = !0;
        defaultSidebarSettings[NotificationType.SalesReports] = !0;
        defaultSidebarSettings[NotificationType.Others] = !0;

        // Kết hợp cài đặt mặc định với cài đặt của người dùng
        var combinedSettings = $.extend({}, defaultSidebarSettings, messageSettings);

        // Trả về cài đặt cho loại thôngSAP_FIX_PARAM (Sửa cho trường hợp "Others" không có trong NotificationTypeDisplayString)
        return combinedSettings.hasOwnProperty(notificationType) ? combinedSettings[notificationType] : (notificationType === NotificationType.Others ? true : false);
    };

    // Phương thức tĩnh: Thiết lập việc một loại thông báo có nên hiển thị trong sidebar không
    Notification.setShouldShowInSideBar = function (notificationType, shouldShow) {
        DataStore.getMessageSettings()[notificationType] = shouldShow;
        DataStore.saveSettings();
    };

    // Lấy hình ảnh preview cho thông báo (hiển thị trong sidebar hoặc tiêu đề dialog)
    notificationPrototype.getNotificationPreviewImage = function () {
        if (this.previewImage) return this.previewImage; // Ưu tiên previewImage
        if (this.image) return this.image; // Tiếp theo là image

        // Các trường hợp đặc biệt dựa trên header
        if (this.header == "News".localize() || this.header == "Local News".localize()) return "./images/notificationIcons/icon_notification_local_news_and_media.png";

        // Dựa trên loại thông báo đã suy ra
        switch (this.getInferredType()) {
            case NotificationType.Events:
                return "./images/notificationIcons/icon_notification_gamers_enquiry.png";
            case NotificationType.NewResearchAvailable:
                return "./images/notificationIcons/icon_notification_research.png";
            case NotificationType.IndustryNews:
                return "./images/notificationIcons/icon_notification_industry_news.png";
            case NotificationType.PlatformNews:
                return "./images/notificationIcons/icon_notification_platform_release.png";
            case NotificationType.GameReports:
                return "./images/notificationIcons/icon_notification_game_report.png";
            case NotificationType.CompanyMilestones:
                return "./images/notificationIcons/icon_notification_award.png";
            default: // Mặc định (hoặc Others)
                return "./images/notificationIcons/icon_notification_info.png";
        }
    };

    // Tách một thông báo có nhiều dòng (phân cách bởi "{n}") thành một mảng các thông báo riêng lẻ
    notificationPrototype.split = function () {
        var splitNotificationsArray = [];
        var originalText = this.text;
        var textParts = originalText ? originalText.split("{n}") : "";

        // Nếu chỉ có một dòng hoặc không có text, trả về chính nó trong một mảng
        if (1 >= textParts.length) return [this];

        if (1 < textParts.length) {
            for (var i = 0; i < textParts.length; i++) {
                var clonedNotificationData = {};
                $.extend(clonedNotificationData, this); // Sao chép thông tin từ thông báo gốc
                clonedNotificationData.text = textParts[i]; // Gán phần text đã tách

                // Nếu buttonText là một mảng, gán buttonText tương ứng cho phần này
                if (this.buttonText instanceof Array) {
                    clonedNotificationData.buttonText = this.buttonText[i];
                }
                // Tương tự cho image
                if (this.image && this.image instanceof Array) {
                    clonedNotificationData.image = this.image.length > i ? this.image[i] : this.image.last();
                }

                // Chỉ thông báo cuối cùng trong chuỗi được tách mới giữ lại sourceId và options (nếu có)
                // để đảm bảo callback chỉ được gọi một lần khi thông báo cuối cùng được xử lý.
                if ((clonedNotificationData.sourceId || clonedNotificationData.options) && i != textParts.length - 1) {
                    clonedNotificationData.sourceId = null;
                    clonedNotificationData.options = null;
                }
                var notificationPart = new Notification(clonedNotificationData);
                splitNotificationsArray.push(notificationPart);
            }
        }
        return splitNotificationsArray;
    };

    // Các phương thức để thêm hành động (action) vào thông báo.
    // Các action này sẽ được thực thi khi thông báo được xử lý (ví dụ: người dùng nhấn nút OK).

    notificationPrototype.adjustCash = function (amount, label) {
        this.actions || (this.actions = []);
        this.actions.push({
            type: "adjustCash",
            data: {
                amount: amount,
                label: label
            }
        });
    };

    notificationPrototype.adjustHype = function (amount) {
        this.actions || (this.actions = []);
        this.actions.push({
            type: "adjustHype",
            data: {
                amount: amount
            }
        });
    };

    notificationPrototype.adjustFans = function (amount) {
        this.actions || (this.actions = []);
        this.actions.push({
            type: "adjustFans",
            data: {
                amount: amount
            }
        });
    };

    notificationPrototype.setFlag = function (flagKey, flagValue) {
        this.actions || (this.actions = []);
        this.actions.push({
            type: "setFlag",
            data: {
                key: flagKey,
                value: flagValue
            }
        });
    };

    notificationPrototype.activateAchievement = function (achievementObject) {
        this.actions || (this.actions = []);
        this.actions.push({
            type: "achivement", // Lỗi chính tả: "achievement"
            data: {
                id: achievementObject.id
            }
        });
    };

    // Áp dụng tất cả các action đã được thêm vào thông báo cho đối tượng công ty
    notificationPrototype.applyActions = function (company) {
        if (this.actions) {
            for (var i = 0; i < this.actions.length; i++) {
                var currentAction = this.actions[i];
                switch (currentAction.type) {
                    case "adjustCash":
                        company.adjustCash(currentAction.data.amount, currentAction.data.label);
                        break;
                    case "adjustFans":
                        company.adjustFans(currentAction.data.amount);
                        break;
                    case "setFlag":
                        company.flags[currentAction.data.key] = currentAction.data.value;
                        break;
                    case "adjustHype":
                        company.adjustHype(currentAction.data.amount);
                        break;
                    case "achivement": // Lỗi chính tả: "achievement"
                        var achievementToActivate = Achievements.getWidthId(currentAction.data.id); // getWidthId có vẻ lạ, có thể là getWithId
                        Achievements.activate(achievementToActivate);
                        break;
                    default:
                        // Nếu đang ở chế độ debug, ném lỗi nếu gặp type không xác định
                        if (GameFlags.ghg6) throw new "unknown type: " + currentAction.type;
                }
            }
        }
    };
})();