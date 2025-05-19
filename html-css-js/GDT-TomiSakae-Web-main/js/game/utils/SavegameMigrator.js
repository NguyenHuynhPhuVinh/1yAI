var SavegameMigrator = {};
(function () {
    // Hàm này có vẻ là một hàm easing (nội suy) phi tuyến tính, thường được sử dụng trong animation
    // để tạo ra chuyển động mượt mà hơn là tuyến tính đơn giản.
    // inputValue: Giá trị đầu vào, thường từ 0 đến duration.
    // startValue: Giá trị bắt đầu của thuộc tính cần nội suy.
    // changeInValue: Sự thay đổi tổng cộng của thuộc tính (endValue - startValue).
    // duration: Tổng thời gian hoặc khoảng giá trị của inputValue.
    function easeOutQuint(inputValue, startValue, changeInValue, duration) {
        // Chuẩn hóa inputValue về khoảng [0, 1] và trừ đi 1 (để tính toán từ -1 đến 0)
        inputValue = inputValue / duration - 1;
        // Tính toán giá trị dựa trên công thức easing easeOutQuint: t^5 + 1 (với t = inputValue)
        // Hoặc một biến thể phức tạp hơn như trong code gốc:
        // d = (a /= d) * a; // inputValueNormalizedSquared
        // a *= d; // inputValueNormalizedCubed * inputValueNormalizedSquared = inputValueNormalized^5
        // return b + c * (-0.5 * a * d + 3 * d * d + -3.5 * a + 2 * d) // Công thức này phức tạp hơn easeOutQuint tiêu chuẩn, có thể là một hàm easing tùy chỉnh.
        // Dựa trên công thức gốc:
        var tNormalizedSquared = (inputValue /= duration) * inputValue;
        inputValue *= tNormalizedSquared; // inputValue giờ là (inputValue/duration)^3 * (inputValue/duration)^2 = (inputValue/duration)^5
        // Công thức gốc khá lạ, có thể là một hàm easing tùy chỉnh hoặc một lỗi đánh máy.
        // Nếu giả định nó là một hàm nội suy phức tạp, giữ nguyên:
        // return startValue + changeInValue * (-0.5 * inputValue * tNormalizedSquared + 3 * tNormalizedSquared * tNormalizedSquared + -3.5 * inputValue + 2 * tNormalizedSquared);
        // Tuy nhiên, công thức này trông không giống bất kỳ hàm easing tiêu chuẩn nào.
        // Nếu mục tiêu là easeOutQuint (t^5 + 1), nó sẽ là:
        // inputValue = inputValue / duration - 1;
        // return startValue + changeInValue * (inputValue * inputValue * inputValue * inputValue * inputValue + 1);

        // Giữ nguyên công thức gốc vì không thể chắc chắn ý đồ:
        var tempNormalizedSquared = (inputValue /= duration) * inputValue;
        inputValue *= tempNormalizedSquared;
        return startValue + changeInValue * (-0.5 * inputValue * tempNormalizedSquared + 3 * tempNormalizedSquared * tempNormalizedSquared + -3.5 * inputValue + 2 * tempNormalizedSquared);

    }

    // Hàm này áp dụng một hàm easing (được truyền vào qua tham số easingFunction)
    // để nội suy một giá trị giữa startValue và endValue dựa trên progressValue.
    // easingFunction: Hàm easing (ví dụ: easeOutQuint ở trên).
    // startValue: Giá trị bắt đầu.
    // endValue: Giá trị kết thúc.
    // progressValue: Giá trị tiến trình hiện tại (thường từ 0 đến duration của easingFunction).
    function applyEasing(easingFunction, startValue, endValue, progressValue) {
        // Gọi hàm easing với duration là 1 (để chuẩn hóa progressValue về [0,1])
        // và changeInValue là 1 (vì ta chỉ cần giá trị alpha từ 0 đến 1).
        var alpha = easingFunction(progressValue, 0, 1, 1);
        // Nội suy tuyến tính giữa startValue và endValue dựa trên alpha.
        return startValue + (endValue - startValue) * alpha;
    }

    SavegameMigrator.migrate = function (savegameData) {
        // Nếu phiên bản save game đã là phiên bản hiện tại của game, không cần migrate.
        if (GameManager.VERSION == savegameData.version) return savegameData;

        // Migrate từ phiên bản 1 lên 2
        if (1 == savegameData.version) {
            // Tạo một đối tượng Company mới với tên từ save game cũ.
            var newCompany = new Company(savegameData.company.name);
            newCompany.currentLevel = 1; // Mặc định level 1 cho phiên bản cũ.
            // Gộp dữ liệu công ty cũ vào đối tượng công ty mới, ghi đè các thuộc tính chung.
            savegameData.company = $.extend(true, newCompany, savegameData.company);

            // Sửa lỗi logic trong missionLog của các game cũ.
            for (var i = 0; i < savegameData.company.gameLog.length; i++) {
                var gameFromLog = savegameData.company.gameLog[i];
                for (var j = 0; j < gameFromLog.missionLog.length; j++) {
                    if ("finishing" === gameFromLog.missionLog[j]) {
                        gameFromLog.missionLog[j] = "BugFixing";
                    }
                }
            }

            // Thiết lập lại thông tin nhân viên chính.
            var mainStaff = savegameData.company.staff[0];
            mainStaff.id = 0;
            mainStaff.name = PlatformShim.getUserName();

            // Reset số bug của game đang phát triển (nếu có).
            if (savegameData.company.currentGame) {
                savegameData.company.currentGame.bugs = 0;
            }

            // Cập nhật uiSettings với giá trị mặc định.
            $.extend(savegameData.uiSettings, UI.createDefaultUISettings());

            // Khởi tạo các dự án phần cứng và R&D nếu chưa có.
            if (!savegameData.currentHwProject) {
                savegameData.currentHwProject = [];
            }
            if (!savegameData.currentRnDProject) {
                savegameData.currentRnDProject = [];
            }
            // Chuyển đổi cấu trúc currentResearch.
            if (!savegameData.currentResearches) {
                savegameData.currentResearches = [];
                if (savegameData.currentResearch) {
                    savegameData.currentResearch.staffId = savegameData.company.staff[0].id;
                    savegameData.currentResearches.push(savegameData.currentResearch);
                    savegameData.currentResearch = null;
                }
            }
            // Đảm bảo cash của công ty là một số hợp lệ.
            if (isNaN(savegameData.company.cash)) {
                savegameData.company.cash = 0;
            }
            // Thêm thông báo cảnh báo về việc import save game từ phiên bản preview.
            savegameData.company.activeNotifications.insertAt(0, {
                header: "Warning",
                text: "This savegame has been imported from a preview version of Game Dev Tycoon. You can try to continue this game but we *strongly recommend* that you start a new game. We have made many changes to the game since the first preview and you might run into issues if you continue this save game."
            });
            // Ghi lại lịch sử nâng cấp và cập nhật phiên bản.
            logUpgradeHistory(savegameData, 1, 2);
            savegameData.version = 2;
        }

        // Migrate từ phiên bản 2 lên 3
        if (2 == savegameData.version) {
            savegameData = migrateVersion2To3(savegameData); // Gọi hàm xử lý riêng cho v2->v3
        }

        // Migrate từ phiên bản 3 lên 4
        if (3 == savegameData.version) {
            savegameData.flags.gameLengthModifier = 1; // Reset gameLengthModifier
            logUpgradeHistory(savegameData, 3, 4);
            savegameData.version = 4;
        }

        // Migrate từ phiên bản 4 lên 5
        if (4 == savegameData.version) {
            // Xóa thông báo hỗ trợ nếu không phải trên Win8 và có thông báo đó.
            if (!PlatformShim.ISWIN8 && savegameData.company) {
                var activeNotifications = savegameData.company.activeNotifications;
                if (activeNotifications && 0 < activeNotifications.length && "{SupportGreenheartGames}" === activeNotifications[0].header) {
                    activeNotifications.splice(0, 1);
                }
            }
            logUpgradeHistory(savegameData, 4, 5);
            savegameData.version = 5;
        }

        // Migrate từ phiên bản 5 lên 6
        if (5 == savegameData.version) {
            // Đổi tên nền tảng "mBox Next" thành "mBox One".
            renamePlatformInSaveData(savegameData, "mBox Next", "mBox One");
            // Cập nhật tên nền tảng trong scheduledStoriesShown.
            var scheduledStories = savegameData.company.scheduledStoriesShown;
            if (scheduledStories) {
                for (var i = 0; i < scheduledStories.length; i++) {
                    if ("mboxNext" == scheduledStories[i]) {
                        scheduledStories[i] = "mboxOne";
                    }
                }
            }
            // Chuyển đổi cấu trúc platform trong gameLog.
            var gameLogEntries = savegameData.company.gameLog;
            for (var i = 0; i < gameLogEntries.length; i++) {
                convertGamePlatformStructure(gameLogEntries[i]);
            }
            // Chuyển đổi cấu trúc platform trong trashedGames.
            var trashedGamesEntries = savegameData.company.trashedGames;
            for (var i = 0; i < trashedGamesEntries.length; i++) {
                convertGamePlatformStructure(trashedGamesEntries[i]);
            }
            // Chuyển đổi cấu trúc platform cho game hiện tại (nếu có).
            var currentGameData = savegameData.company.currentGame;
            if (currentGameData) {
                convertGamePlatformStructure(currentGameData);
            }
            // Thêm các nghiên cứu cơ bản cho phiên bản cũ.
            addBasicResearchItems(savegameData);
            // Xử lý việc đổi tên topic "Startups" thành "Business".
            migrateStartupsTopic(savegameData);
            // Thêm thông báo về việc cập nhật phiên bản.
            savegameData.company.activeNotifications.insertAt(0, {
                header: "Updated Version",
                text: "This save game has been imported from an older version of Game Dev Tycoon. We have re-balanced the game, added new consoles, increased the story-line (runs for 35 years) and added a couple of new features. You should be able to continue this save game without issues but if you want to get the full re-worked experience, please consider starting a new game."
            });
            logUpgradeHistory(savegameData, 5, 6);
            savegameData.version = 6;
        }

        // Migrate từ phiên bản 6 lên 7
        if (6 == savegameData.version) {
            // Chuyển đổi cấu trúc genreWeightings và audienceWeightings cho các console tự tạo.
            if (savegameData.company && savegameData.company.licencedPlatforms) {
                for (var i = 0; i < savegameData.company.licencedPlatforms.length; i++) {
                    var platform = savegameData.company.licencedPlatforms[i];
                    if (platform.isCustom) {
                        platform.genreWeightings = platform.ghg7; // ghg7 có vẻ là tên cũ của genreWeightings
                        delete platform.ghg7;
                        platform.audienceWeightings = platform.ghg8; // ghg8 có vẻ là tên cũ của audienceWeightings
                        delete platform.ghg8;
                    }
                }
            }
            logUpgradeHistory(savegameData, 6, 7);
            savegameData.version = 7;
        }

        // Migrate từ phiên bản 7 lên 8
        if (7 == savegameData.version) {
            logUpgradeHistory(savegameData, 7, 8);
            savegameData.version = 8;
        }

        // Nếu sau tất cả các bước migrate mà phiên bản vẫn không khớp, báo lỗi.
        if (savegameData.version != GameManager.VERSION) {
            throw "unable to load game - could not upgrade to latest file version";
        }
        return savegameData;
    };

    // Ghi lại thông tin về quá trình nâng cấp save game.
    var logUpgradeHistory = function (savegameData, fromVersion, toVersion) {
        var appVersion = PlatformShim.getVersion();
        if (GameFlags.ghg6) { // Nếu đang ở chế độ debug
            appVersion += ";GameFlags.DEBUG";
        }
        if (!savegameData.upgradeHistory) {
            savegameData.upgradeHistory = [];
        }
        savegameData.upgradeHistory.push({
            from: fromVersion,
            to: toVersion,
            "is-win-8-version": PlatformShim.ISWIN8,
            "app-version": appVersion,
            date: (new Date).toISOString()
        });
    };

    // Xử lý các thay đổi cụ thể khi migrate từ phiên bản 2 lên 3.
    var migrateVersion2To3 = function (savegameData) {
        // Xử lý lỗi dự án phần cứng không tiến triển.
        if (savegameData.currentHwProject && 0 === savegameData.currentHwProject.pointsCost) {
            var refundAmount;
            // Tính toán số tiền hoàn lại dựa trên các feature của dự án.
            refundAmount = 1E7 + savegameData.currentHwProject.features.sum(function (featureId) {
                return 100 * Research.getEngineCost(General.getFeature(featureId));
            });
            // Áp dụng một hàm easing (có vẻ để làm ngẫu nhiên hơn hoặc làm mượt giá trị)
            var qualityFactorBonus = applyEasing(easeOutQuint, 1, 20, savegameData.currentHwProject.qF);
            qualityFactorBonus = Math.floor(qualityFactorBonus);
            refundAmount += 1E6 * qualityFactorBonus;

            // Hoàn tiền và ghi log.
            savegameData.company.cash += refundAmount;
            savegameData.company.cashLog.push({
                amount: refundAmount,
                label: savegameData.currentHwProject.name + " refund"
            });
            // Xóa dự án lỗi và thông báo cho người chơi.
            savegameData.currentHwProject = undefined; // Hoặc null
            savegameData.company.activeNotifications.insertAt(0, {
                header: "Warning",
                text: "We have identified that a console project in this save game was not making any progress. This was caused by a bug in the previous version. We have fixed this bug in the version you are running now but you will need to start a new console project. The costs for the old project have been refunded."
            });
        }

        // Xóa các thông báo training/research cũ không còn phù hợp.
        var activeNotifications = savegameData.company.activeNotifications.filter(function (notification) {
            return "{Training}" === notification.header || "{Research}" === notification.header;
        });
        for (var i = 0; i < activeNotifications.length; i++) {
            savegameData.company.activeNotifications.remove(activeNotifications[i]);
        }

        // Xử lý các thông báo liên quan đến điều hòa không khí (airCon).
        var airConNotification = savegameData.company.activeNotifications.concat(savegameData.company.notifications).first(function (notification) {
            return "airCon1Callback" === notification.sourceId;
        });
        if (airConNotification) {
            // Xóa thông báo cũ và đặt lại cờ liên quan.
            if (savegameData.company.activeNotifications.first(function (notification) { return "airCon1Callback" === notification.sourceId; })) {
                savegameData.company.activeNotifications.remove(airConNotification);
            } else {
                savegameData.company.notifications.remove(airConNotification);
            }
            if (isNaN(airConNotification.weeksUntilFired)) {
                airConNotification.weeksUntilFired = 0;
            }
            savegameData.company.flags.airCon1 = true;
            savegameData.company.flags.airCon1Declined = savegameData.company.currentWeek + airConNotification.weeksUntilFired;
            airConNotification = undefined; // Đánh dấu đã xử lý
        } else {
            airConNotification = savegameData.company.activeNotifications.concat(savegameData.company.notifications).first(function (notification) {
                return "airCon2Callback" === notification.sourceId;
            });
            if (airConNotification) {
                if (savegameData.company.activeNotifications.first(function (notification) { return "airCon2Callback" === notification.sourceId; })) {
                    savegameData.company.activeNotifications.remove(airConNotification);
                } else {
                    savegameData.company.notifications.remove(airConNotification);
                }
                if (isNaN(airConNotification.weeksUntilFired)) {
                    airConNotification.weeksUntilFired = 0;
                }
                savegameData.company.flags.airCon2 = true;
                savegameData.company.flags.airCon2Declined = savegameData.company.currentWeek + airConNotification.weeksUntilFired;
                airConNotification = undefined; // Đánh dấu đã xử lý
            }
        }

        // Ghi lại lịch sử nâng cấp và cập nhật phiên bản.
        logUpgradeHistory(savegameData, 2, 3);
        savegameData.version = 3;
        return savegameData;
    };

    // Đổi tên một nền tảng (platform) trong dữ liệu save game.
    var renamePlatformInSaveData = function (savegameData, oldPlatformName, newPlatformName) {
        var companyData = savegameData.company;
        var companyFlags = companyData.flags;

        // Hàm tiện ích để duyệt và thay thế tên nền tảng trong một mảng.
        var updatePlatformArray = function (platformArray) {
            if (platformArray) {
                for (var i = 0; i < platformArray.length; i++) {
                    if (platformArray[i]) {
                        if (platformArray[i] == oldPlatformName) {
                            platformArray[i] = newPlatformName;
                        } else if (platformArray[i].id == oldPlatformName) { // Trường hợp platform là object
                            platformArray[i].id = newPlatformName;
                        } else if (platformArray[i].platform == oldPlatformName) { // Trường hợp trong hợp đồng
                            platformArray[i].platform = newPlatformName;
                        }
                    }
                }
            }
        };

        // Cập nhật trong cờ contractspublisher (nếu có).
        if (companyFlags && companyFlags.contractspublisher) {
            updatePlatformArray(companyFlags.contractspublisher.platforms);
        }
        // Cập nhật trong danh sách nền tảng đã cấp phép và nền tảng có sẵn.
        updatePlatformArray(companyData.licencedPlatforms);
        updatePlatformArray(companyData.availablePlatforms);
        // Cập nhật trong lịch sử game.
        updatePlatformArray(companyData.gameLog); // gameLog chứa các game object, cần xử lý sâu hơn nếu platform được lưu trong game object
    };

    // Chuyển đổi cấu trúc lưu trữ nền tảng từ một chuỗi đơn thành một mảng chứa object.
    var convertGamePlatformStructure = function (gameObject) {
        gameObject.platforms = []; // Tạo mảng platforms mới
        gameObject.platforms.push({ // Thêm platform cũ vào mảng mới dưới dạng object
            id: gameObject.platform
        });
        gameObject.platform = undefined; // Xóa thuộc tính platform cũ
    };

    // Thêm các mục nghiên cứu cơ bản nếu chưa có.
    var addBasicResearchItems = function (savegameData) {
        // Danh sách các mục nghiên cứu cơ bản
        var basicResearchItems = ["Mouse", "Joystick", "Controller", "Steering Wheel"];
        // Đếm số lượng mục nghiên cứu cơ bản đã có trong save game.
        var existingBasicResearchCount = savegameData.company.researchCompleted.count(function (researchId) {
            return basicResearchItems.first(function (basicItemId) {
                return researchId == basicItemId; // So sánh ID
            });
        });

        // Nếu có ít nhất 1 mục nghiên cứu cơ bản, thêm "GameTutorials".
        if (1 <= existingBasicResearchCount) {
            savegameData.company.researchCompleted.push(Research.GameTutorials.id);
        }
        // Nếu có ít nhất 2 mục nghiên cứu cơ bản, thêm "BetterUI".
        if (2 <= existingBasicResearchCount) {
            savegameData.company.researchCompleted.push(Research.BetterUI.id);
        }
        // Luôn thêm "mono" (âm thanh mono).
        savegameData.company.researchCompleted.push(Research.mono.id);
    };

    // Xử lý việc đổi tên topic "Startups" thành "Business".
    var migrateStartupsTopic = function (savegameData) {
        // Duyệt qua gameLog và trashedGames để đổi tên topic.
        savegameData.company.gameLog.concat(savegameData.company.trashedGames).forEach(function (game) {
            if ("Startups" == game.topic) { // Giả sử topic được lưu là ID hoặc tên
                game.topic = "Business";
            }
        });
        // Đổi tên topic cho game hiện tại (nếu có).
        if (savegameData.company.currentGame && savegameData.company.currentGame.topic && "Startups" == savegameData.company.currentGame.topic) {
            savegameData.company.currentGame.topic = "Business";
        }
        // Xử lý trong danh sách topics của công ty.
        var startupsTopic = savegameData.company.topics.first(function (topic) {
            return "Startups" == topic.id; // Giả sử topic trong mảng là object có id
        });
        if (startupsTopic) {
            savegameData.company.topics.splice(savegameData.company.topics.indexOf(startupsTopic), 1);
            // Nếu "Business" chưa có, thêm vào và cộng điểm research.
            if (!savegameData.company.topics.some(function (topic) { return "Business" == topic.id; })) {
                savegameData.company.topics.push({ id: "Business" }); // Thêm dưới dạng object
            } else {
                savegameData.company.researchPoints += 10;
            }
        }
        // Xử lý trong cờ contractspublisher (nếu có).
        if (savegameData.company.flags.contractspublisher) {
            var updateTopicArray = function (topicArray) {
                if (topicArray) {
                    for (var i = 0; i < topicArray.length; i++) {
                        if ("Startups" == topicArray[i]) {
                            topicArray[i] = "Business";
                        }
                    }
                }
            };
            updateTopicArray(savegameData.company.flags.contractspublisher.topics);
            updateTopicArray(savegameData.company.flags.contractspublisher.researchedTopics);
        }
    };
})();