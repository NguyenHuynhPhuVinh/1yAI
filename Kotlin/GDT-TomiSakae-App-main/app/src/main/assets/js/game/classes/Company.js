// --- START OF FILE Company.js ---

"use strict";
/**
 * Hàm khởi tạo (constructor) cho đối tượng Company.
 * Đại diện cho công ty của người chơi trong game.
 * @param {string} initialName Tên ban đầu của công ty.
 */
var Company = function (initialName) {
    this.name = initialName; // Tên của công ty
    this.timePlayed = 0; // Tổng thời gian đã chơi (tính bằng mili giây)
    this.currentGame = void 0; // Game hiện tại đang phát triển (đối tượng Game)
    this.cash = 0; // Số tiền mặt hiện tại
    this.cashLog = []; // Lịch sử giao dịch tiền mặt
    this.fans = 0; // Số lượng người hâm mộ
    this.fansChange = 0; // Thay đổi số lượng người hâm mộ sẽ được áp dụng ở tick tiếp theo
    this.gameLog = []; // Danh sách các game đã phát hành
    this.trashedGames = []; // Danh sách các game đã bị hủy
    this.notifications = []; // Danh sách tất cả các thông báo đang chờ xử lý hoặc đã lên lịch
    this.activeNotifications = []; // Danh sách các thông báo đang hiển thị cho người chơi
    this.sidebarNotifications = []; // Danh sách các thông báo hiển thị ở sidebar
    this.booths = []; // Danh sách các loại gian hàng có thể chọn cho hội chợ G3

    // Khởi tạo các loại gian hàng mặc định
    this.booths.push(new Booth(1, "Small Booth".localize("heading"), 0.3, "This is a small pop up stand where we can show our marketing material. It isn't very impressive but a common setup at the G3.".localize(), 8E4, "./images/superb/boothFloor.png",
        "./images/superb/boothSmallBg.png"));
    this.booths.push(new Booth(2, "Medium Booth".localize("heading"), 0.5, "This is a larger booth in a better location. We should expect more visitors with this booth and have space to give away demos of our games.".localize(), 5E5, "./images/superb/boothFloor.png", "./images/superb/boothMediumBg.png"));
    this.booths.push(new Booth(3, "Large Booth".localize("heading"), 1.3, "With this package we get our own section in the main hall of the G3. We can expect a large number of visitors.".localize(),
        15E5, "./images/superb/boothFloor.png", "./images/superb/boothLargeBg.png", "./images/superb/boothLargeFg.png"));
    this.booths.push(new Booth(4, "Custom".localize("heading, as in Custom Booth"), 2, "", 0, "./images/superb/boothCustomFloor.png", "./images/superb/boothCustom.png"));

    this.topics = []; // Danh sách các chủ đề game công ty đã nghiên cứu/sở hữu
    this.licencedPlatforms = []; // Danh sách các nền tảng đã mua bản quyền
    this.availablePlatforms = []; // Danh sách các nền tảng có sẵn để mua bản quyền
    this.currentWeek = 0; // Tuần hiện tại trong game (tính từ 0)
    this.currentLevel = 1; // Cấp độ văn phòng hiện tại của công ty
    this.conferenceHype = 0; // Điểm hype nhận được từ hội chợ G3 trước đó
    this.staff = []; // Danh sách nhân viên
    this.maxStaff = 1; // Số lượng nhân viên tối đa có thể thuê

    // Khởi tạo nhân viên đầu tiên (người chơi)
    this.staff.push(new Character({
        id: 0, // ID mặc định cho người chơi
        name: PlatformShim.getUserName(), // Lấy tên người dùng từ hệ thống
        dF: 0.6, // Hệ số Design Factor
        tF: 0.6, // Hệ số Technology Factor
        speedF: 0.6, // Hệ số Speed Factor
        qualityF: 0.2, // Hệ số Quality Factor (ảnh hưởng đến điểm kinh nghiệm ban đầu)
        researchF: 0.6, // Hệ số Research Factor
        salary: 0, // Lương (người chơi không có lương)
        slot: 0, // Vị trí (slot) của nhân viên trong văn phòng
        working: false, // Trạng thái đang làm việc
        loopCount: -1 // Số lần lặp animation (có thể là mặc định)
    }));

    this.researchPoints = 0; // Điểm nghiên cứu hiện có
    this.scheduledStoriesShown = []; // ID các câu chuyện/sự kiện đã hiển thị (theo lịch)
    this.triggerNotificationsShown = []; // ID các thông báo đã kích hoạt (dựa trên điều kiện)
    this.tutorialMessagesShown = []; // ID các thông báo hướng dẫn đã hiển thị
    this.conferenceStandFactor = null; // Hệ số của gian hàng đã chọn cho hội chợ G3
    this.trainingEnabled = false; // Cờ cho biết tính năng đào tạo đã mở khóa chưa
    this.researchEnabled = false; // Cờ cho biết tính năng nghiên cứu đã mở khóa chưa
    this.availableResearch = []; // Danh sách các mục nghiên cứu có sẵn
    this.researchCompleted = []; // Danh sách các mục nghiên cứu đã hoàn thành
    this.engines = []; // Danh sách các game engine công ty đã tạo
    this.engineParts = []; // Danh sách các bộ phận engine công ty đã sở hữu/nghiên cứu
    this.specialItems = []; // Danh sách các item đặc biệt (có thể là feature)
    this.features = []; // Danh sách các feature công ty đã sở hữu/nghiên cứu (có thể trùng với engineParts ở một mức độ nào đó)
    this.lastTopScore = 0; // Điểm số cao nhất của game gần nhất
    this.topScoreAchievements = 0; // Số lượng thành tựu liên quan đến điểm cao đã đạt được
    this.flags = { // Các cờ trạng thái của công ty
        secrecy: 0, // Mức độ bí mật
        good: 0, // Điểm "thiện"
        evil: 0, // Điểm "ác"
        nextGameHypeBonus: 0, // Bonus hype cho game tiếp theo
        sharesSold: 0 // Tỷ lệ cổ phần đã bán (nếu có chế độ này)
    };
    this.knowledge = {}; // Dữ liệu về "kiến thức" của người chơi (vd: combo tốt)
    this.eventTriggerCounts = {}; // Đếm số lần một sự kiện đã được kích hoạt
    this.mods = []; // Danh sách các mod đang được sử dụng
};

(function () {
    var companyProto = Company.prototype; // Tạo một alias cho Company.prototype để code ngắn gọn hơn

    /**
     * Tạo một đối tượng game mới cho công ty.
     * @returns {Game} Đối tượng game vừa được tạo.
     */
    companyProto.createNewGame = function () {
        var newGame = new Game(this); // Khởi tạo game mới, truyền vào 'this' (đối tượng Company hiện tại)
        newGame.title = "Game #".localize("followed by number") + (this.gameLog.length + 1); // Đặt tiêu đề mặc định

        // Áp dụng bonus hype từ cờ (nếu có)
        if (this.flags.nextGameHypeBonus) {
            newGame.hypePoints += this.flags.nextGameHypeBonus;
            this.flags.nextGameHypeBonus = 0; // Reset bonus hype
        }
        this.currentGame = newGame; // Gán game mới tạo vào game hiện tại của công ty

        // Reset workload cho tất cả nhân viên
        for (var staffIdx = 0; staffIdx < this.staff.length; staffIdx++) {
            this.staff[staffIdx].flags.workload = 0;
        }
        // Sao chép cài đặt trách nhiệm feature từ công ty sang game (nếu có)
        this.currentGame.flags.featureResponsibility = $.extend({}, this.flags.featureResponsibility);
        return newGame;
    };

    /**
     * Lấy ngày tháng hiện tại của game dựa trên số tuần đã trôi qua.
     * @returns {{year: number, month: number, week: number}} Đối tượng chứa năm, tháng, tuần.
     */
    companyProto.getCurrentDate = function () {
        var weekInMonth = Math.floor(this.currentWeek) % 4 + 1; // Tuần trong tháng (1-4)
        var totalMonthsElapsed = Math.floor(this.currentWeek) / 4; // Tổng số tháng đã trôi qua (tính từ 0)
        var year = Math.floor(totalMonthsElapsed / 12) + 1; // Năm hiện tại
        return {
            year: year,
            month: Math.floor(totalMonthsElapsed % 12 + 1), // Tháng hiện tại (1-12)
            week: weekInMonth
        };
    };

    /**
     * Lấy ngày tháng của game dựa trên một số tuần cụ thể đã trôi qua.
     * @param {number} totalWeeksElapsed Tổng số tuần đã trôi qua.
     * @returns {{year: number, month: number, week: number}} Đối tượng chứa năm, tháng, tuần.
     */
    companyProto.getDate = function (totalWeeksElapsed) {
        var weekInMonth = Math.floor(totalWeeksElapsed) % 4 + 1;
        var monthIndex = Math.floor(totalWeeksElapsed) / 4; // Số tháng (bắt đầu từ 0)
        var year = Math.floor(monthIndex / 12) + 1;
        return {
            year: year,
            month: Math.floor(monthIndex % 12 + 1),
            week: weekInMonth
        };
    };
    Company.getDate = companyProto.getDate; // Gán phương thức getDate vào constructor Company để có thể gọi tĩnh

    /**
     * Tính toán và xử lý các thông báo hiện tại của công ty.
     * Di chuyển các thông báo đủ điều kiện từ `this.notifications` sang `this.activeNotifications` hoặc `this.sidebarNotifications`.
     */
    companyProto.calculateCurrentNofitications = function () {
        var notificationsToActivate = []; // Mảng chứa các thông báo sẽ được kích hoạt và sau đó loại bỏ khỏi danh sách chờ
        // Thêm các thông báo mới từ Media và DecisionNotifications
        this.notifications.addRange(Media.getNewNotifications(this));
        this.notifications.addRange(DecisionNotifications.getNewNotifications(this));

        // Duyệt qua danh sách thông báo chờ
        for (var i = 0; i < this.notifications.length; i++) {
            var notification = this.notifications[i];
            // Nếu đã đến lúc hiển thị thông báo
            if (notification.weeksUntilFired <= 0) {
                // Thử hiển thị qua sidebar, nếu không được thì thêm vào activeNotifications (popup chính)
                if (!UI.showNotificationViaSidebar(notification)) {
                    this.activeNotifications.addRange(notification.split()); // split() có thể chia 1 notification thành nhiều phần nhỏ
                }
                notificationsToActivate.push(notification); // Đánh dấu để xóa sau
            }
        }
        // Xóa các thông báo đã được kích hoạt khỏi danh sách chờ
        for (var j = 0; j < notificationsToActivate.length; j++) {
            var notificationToRemove = notificationsToActivate[j];
            this.notifications.splice(this.notifications.indexOf(notificationToRemove), 1);
        }
    };

    /**
     * Kiểm tra xem công ty có sở hữu một topic với ID cụ thể không.
     * @param {string} topicId ID của topic cần kiểm tra.
     * @returns {boolean} True nếu sở hữu, False nếu không.
     */
    companyProto.hasTopicWithId = function (topicId) {
        return this.topics.some(function (topic) {
            return topic.id === topicId;
        });
    };

    /**
     * Kiểm tra xem công ty có thể phát triển game engine tùy chỉnh không.
     * @returns {boolean} True nếu có thể, False nếu không.
     */
    companyProto.canDevelopEngine = function () {
        return this.researchCompleted.indexOf(Research.CustomEngine) != -1;
    };

    /**
     * Lấy một số ngẫu nhiên sử dụng MersenneTwister của công ty.
     * Mỗi lần gọi sẽ tăng biến đếm `randomCalled`.
     * @returns {number} Số ngẫu nhiên trong khoảng [0, 1).
     */
    companyProto.getRandom = function () {
        this.randomCalled += 1;
        return this._mersenneTwister.random();
    };

    /**
     * Điều chỉnh (thêm/bớt) số lượng người hâm mộ.
     * Giá trị thay đổi sẽ được lưu vào `this.fansChange` và áp dụng sau.
     * @param {number} amount Số lượng fan cần điều chỉnh.
     */
    companyProto.adjustFans = function (amount) {
        var currentChange = this.fansChange ? this.fansChange : 0;
        // Đảm bảo số fan không bị âm
        this.fansChange = (this.fans + currentChange + amount < 0) ? -this.fans : currentChange + amount;
    };

    /**
     * Điều chỉnh (thêm/bớt) số tiền mặt của công ty.
     * @param {number} amount Số tiền cần điều chỉnh.
     * @param {string} [logLabel] Nhãn cho giao dịch này, sẽ được ghi vào cashLog.
     */
    companyProto.adjustCash = function (amount, logLabel) {
        if (isNaN(amount)) {
            if (GameFlags.ghg6) throw "value cannot be NaN"; // Ném lỗi nếu là NaN và đang ở chế độ debug
        } else {
            this.cash += amount;
            if (logLabel) {
                this.cashLog.push({
                    amount: amount,
                    label: logLabel
                });
            }
        }
    };

    /**
     * Điều chỉnh điểm hype cho game hiện tại đang phát triển.
     * @param {number} amount Số điểm hype cần điều chỉnh.
     */
    companyProto.adjustHype = function (amount) {
        if (this.currentGame) {
            this.currentGame.hypePoints += amount;
        }
    };

    // Các hàm kiểm tra khả năng phát triển các loại game/tính năng
    companyProto.canDevelopMediumGames = function () {
        return this.researchCompleted.indexOf(Research.MediumSizeGames) != -1;
    };
    companyProto.canDevelopLargeGames = function () {
        return this.researchCompleted.indexOf(Research.LargeSizeGames) != -1;
    };
    companyProto.canDevelopAAAGames = function () {
        return this.researchCompleted.indexOf(Research.AAA) != -1;
    };
    companyProto.canUseMultiGenre = function () {
        return this.researchCompleted.indexOf(Research.MultiGenre) != -1;
    };
    companyProto.canDevelopMultiPlatform = function () {
        return this.researchCompleted.indexOf(Research.MultiPlatform) != -1;
    };
    companyProto.canDevelopMMOGames = function () {
        return this.researchCompleted.indexOf(Research.MMO) != -1;
    };

    /**
     * Kiểm tra xem có game MMO nào đang được bán không.
     * @returns {boolean} True nếu có, False nếu không.
     */
    companyProto.isMMOInSale = function () {
        var currentWeekSnapshot = this.currentWeek; // Chụp lại tuần hiện tại để tránh thay đổi trong lúc filter
        return this.gameLog.filter(function (game) {
            return currentWeekSnapshot > game.releaseWeek && game.currentSalesCash > 0 &&
                !game.soldOut && game.flags.mmo;
        }).length > 0;
    };

    companyProto.canSetTargetAudience = function () {
        return this.researchCompleted.indexOf(Research.TargetAudience) != -1;
    };

    /**
     * Lấy một đối tượng game từ `gameLog` dựa trên ID.
     * @param {string} gameId ID của game cần tìm.
     * @returns {Game|null} Đối tượng game nếu tìm thấy, null nếu không.
     */
    companyProto.getGameById = function (gameId) {
        return this.gameLog.first(function (game) {
            return game.id === gameId;
        });
    };

    /**
     * Lấy danh sách các game có thể làm phần tiếp theo (sequel).
     * Loại trừ các game đã được làm sequel.
     * @returns {Game[]} Mảng các đối tượng game.
     */
    companyProto.getPossibleGamesForSequel = function () {
        // Lấy ID của các game gốc đã được làm sequel
        var sequelSourceIds = this.gameLog.filter(function (game) {
            return game.sequelTo != null;
        }).map(function (game) {
            return game.sequelTo;
        });
        // Lọc ra các game chưa nằm trong danh sách sequelSourceIds
        return this.gameLog.filter(function (game) {
            return sequelSourceIds.indexOf(game.id) == -1;
        });
    };

    /**
     * Lấy danh sách các game có thể làm gói mở rộng (expansion pack).
     * Chỉ các game MMO và chưa bán hết mới có thể làm pack.
     * @returns {Game[]} Mảng các đối tượng game.
     */
    companyProto.getPossibleGamesForPack = function () {
        return this.gameLog.filter(function (game) {
            return game.flags.mmo === true && !game.soldOut;
        });
    };

    /**
     * Kiểm tra xem công ty có đang phát triển game không.
     * @returns {boolean} True nếu đang phát triển, False nếu không.
     */
    companyProto.isCurrentlyDevelopingGame = function () {
        return this.currentGame != null && this.currentGame.costs != 0 && !this.currentGame.releaseWeek;
    };

    /**
     * Kiểm tra xem tiến độ phát triển game hiện tại có nằm trong khoảng min/max không.
     * @param {number} [minProgress] Tiến độ tối thiểu (0-1).
     * @param {number} [maxProgress] Tiến độ tối đa (0-1).
     * @returns {boolean} True nếu nằm trong khoảng, False nếu không.
     */
    companyProto.isGameProgressBetween = function (minProgress, maxProgress) {
        return this.currentGame != null &&
            (!maxProgress || GameManager.getCurrentGameProgress() < maxProgress) &&
            (!minProgress || GameManager.getCurrentGameProgress() > minProgress);
    };

    /**
     * Kiểm tra xem ngày hiện tại của game có trễ hơn hoặc bằng một ngày cụ thể không.
     * @param {number} yearToCompare Năm cần so sánh.
     * @param {number} monthToCompare Tháng cần so sánh.
     * @param {number} weekToCompare Tuần cần so sánh.
     * @returns {boolean} True nếu trễ hơn hoặc bằng, False nếu sớm hơn.
     */
    companyProto.isLaterOrEqualThan = function (yearToCompare, monthToCompare, weekToCompare) {
        var currentDate = this.getCurrentDate();
        return currentDate.year > yearToCompare ||
            (currentDate.year === yearToCompare && currentDate.month > monthToCompare) ||
            (currentDate.year === yearToCompare && currentDate.month === monthToCompare && currentDate.week >= weekToCompare);
    };

    /**
     * Kiểm tra xem ngày hiện tại của game có sớm hơn hoặc bằng một ngày cụ thể không.
     * @param {number} yearToCompare Năm cần so sánh.
     * @param {number} monthToCompare Tháng cần so sánh.
     * @param {number} weekToCompare Tuần cần so sánh.
     * @returns {boolean} True nếu sớm hơn hoặc bằng, False nếu trễ hơn.
     */
    companyProto.isEarlierOrEqualThan = function (yearToCompare, monthToCompare, weekToCompare) {
        var currentDate = this.getCurrentDate();
        return currentDate.year < yearToCompare ||
            (currentDate.year === yearToCompare && currentDate.month < monthToCompare) ||
            (currentDate.year === yearToCompare && currentDate.month === monthToCompare && currentDate.week <= weekToCompare);
    };

    /**
     * Lấy game bán chạy nhất của công ty.
     * @returns {Game|null} Đối tượng game bán chạy nhất, hoặc null nếu chưa có game nào.
     */
    companyProto.getBestSeller = function () {
        var bestSellingGame = this.gameLog.slice().sort(function (gameA, gameB) {
            return gameB.unitsSold - gameA.unitsSold; // Sắp xếp giảm dần theo unitsSold
        }).first(); // Lấy phần tử đầu tiên (bán chạy nhất)
        return bestSellingGame ? bestSellingGame : null;
    };

    /**
     * Lấy console tùy chỉnh mới nhất mà công ty đã phát hành và chưa hủy bán.
     * @returns {Platform|null} Đối tượng platform là console, hoặc null.
     */
    companyProto.getLatestCustomConsole = function () {
        return this.licencedPlatforms.last(function (platform) {
            return platform.isCustom && !platform.saleCancelled;
        });
    };

    /**
     * Tải dữ liệu công ty từ một đối tượng đã lưu.
     * @param {object} savedData Đối tượng chứa dữ liệu công ty đã lưu.
     * @returns {Company} Một instance mới của Company với dữ liệu đã tải.
     */
    Company.load = function (savedData) {
        var companyInstance = new Company; // Tạo một công ty mới rỗng để nạp dữ liệu
        companyInstance.uid = savedData.uid;
        if (!companyInstance.uid) {
            companyInstance.uid = GameManager.getGUID(); // Nếu không có UID, tạo mới
        }
        companyInstance.name = savedData.name;
        companyInstance.timePlayed = savedData.timePlayed;
        companyInstance.slot = savedData.slot; // Slot lưu game
        companyInstance.cash = savedData.cash;
        companyInstance.cashLog = savedData.cashLog;
        companyInstance.fans = savedData.fans;
        companyInstance.fansChange = savedData.fansChange;
        companyInstance.flags = savedData.flags;
        if (!companyInstance.flags) {
            companyInstance.flags = {}; // Khởi tạo nếu chưa có
        }
        companyInstance.conferenceStandFactor = savedData.conferenceStandFactor;

        // Tải danh sách thông báo
        companyInstance.notifications = savedData.notifications.map(function (savedNotification) {
            return Notification.load(savedNotification);
        });
        companyInstance.activeNotifications = savedData.activeNotifications.map(function (savedNotification) {
            return Notification.load(savedNotification);
        });
        if (savedData.sidebarNotifications) {
            companyInstance.sidebarNotifications = savedData.sidebarNotifications.map(function (savedNotification) {
                return Notification.load(savedNotification);
            });
        }

        // Tải danh sách nền tảng
        companyInstance.licencedPlatforms = savedData.licencedPlatforms.map(function (savedPlatformData) {
            return PlatformsSerializer.load(savedPlatformData);
        });
        companyInstance.availablePlatforms = savedData.availablePlatforms.map(function (savedPlatformData) {
            return PlatformsSerializer.load(savedPlatformData);
        });

        // Tải danh sách nhân viên
        companyInstance.staff = savedData.staff.map(function (savedStaffMember) {
            return Character.load(savedStaffMember);
        });
        companyInstance.maxStaff = savedData.maxStaff;
        if (!companyInstance.maxStaff) {
            companyInstance.maxStaff = 1;
        }

        companyInstance.currentWeek = savedData.currentWeek;
        companyInstance.topics = savedData.topics.map(function (savedTopicData) {
            return TopicsSerializer.load(savedTopicData);
        });

        companyInstance.tutorialMessagesShown = savedData.tutorialMessagesShown;
        if (!companyInstance.tutorialMessagesShown) {
            companyInstance.tutorialMessagesShown = [];
        }
        companyInstance.triggerNotificationsShown = savedData.triggerNotificationsShown ? savedData.triggerNotificationsShown : [];

        companyInstance.researchPoints = savedData.researchPoints;
        companyInstance.researchEnabled = savedData.researchEnabled;
        companyInstance.trainingEnabled = savedData.trainingEnabled;

        var allResearchItems = Research.getAllItems();
        // Tải danh sách nghiên cứu có sẵn
        companyInstance.availableResearch = savedData.availableResearch.map(function (researchId) {
            return allResearchItems.first(function (item) {
                return item.id === researchId;
            });
        }).filter(function (item) { // Loại bỏ các item null nếu không tìm thấy
            return item;
        });
        // Tải danh sách nghiên cứu đã hoàn thành
        companyInstance.researchCompleted = savedData.researchCompleted.map(function (researchId) {
            return allResearchItems.concat(Research.bigProjects).first(function (item) { // Bao gồm cả bigProjects
                return item.id === researchId;
            });
        }).filter(function (item) {
            return item;
        });

        // Tải danh sách game engine
        companyInstance.engines = savedData.engines.map(function (savedEngineData) {
            return EngineSerializer.load(savedEngineData);
        });
        companyInstance.engineParts = savedData.engineParts.map(function (savedEnginePartData) {
            return EnginePartsSerializer.load(savedEnginePartData);
        }).filter(function (item) {
            return item;
        });

        companyInstance.specialItems = [];
        if (savedData.specialItems) {
            companyInstance.specialItems = savedData.specialItems.map(function (savedFeatureData) {
                return FeatureSerializer.load(savedFeatureData);
            }).filter(function (item) {
                return item;
            });
        }
        companyInstance.features = savedData.features.map(function (savedFeatureData) {
            return FeatureSerializer.load(savedFeatureData);
        }).filter(function (item) {
            return item;
        });

        companyInstance.topScoreAchievements = savedData.topScoreAchievements;
        companyInstance.lastTopScore = savedData.lastTopScore;
        if (savedData.previousTopScore) { // Các trường này có thể không tồn tại ở save cũ
            companyInstance.previousTopScore = savedData.previousTopScore;
        }
        if (savedData.lastTopScoreWeek) {
            companyInstance.lastTopScoreWeek = savedData.lastTopScoreWeek;
        }
        if (savedData.lastTopScoreGameSize) {
            companyInstance.lastTopScoreGameSize = savedData.lastTopScoreGameSize;
        }
        companyInstance.lastTopScoreIncrease = savedData.lastTopScoreIncrease;

        companyInstance.scheduledStoriesShown = savedData.scheduledStoriesShown;
        companyInstance.currentLevel = savedData.currentLevel;
        if (!companyInstance.currentLevel) {
            companyInstance.currentLevel = 1;
        }

        companyInstance.currentGame = Game.load(savedData.currentGame, companyInstance); // Tải game hiện tại
        if (savedData.gameLog) {
            companyInstance.gameLog = savedData.gameLog.map(function (savedGameData) {
                return Game.load(savedGameData, companyInstance);
            });
        }
        if (savedData.trashedGames) {
            companyInstance.trashedGames = savedData.trashedGames.map(function (savedGameData) {
                return Game.load(savedGameData, companyInstance);
            });
        }

        // Tải dữ liệu cho R&D crew và Hardware crew (nếu có)
        if (savedData.rndCrew) {
            companyInstance.rndCrew = savedData.rndCrew.map(function (savedWorkerVisual) {
                return new ProjectWorkerVisual(savedWorkerVisual);
            });
        }
        if (savedData.hwCrew) {
            companyInstance.hwCrew = savedData.hwCrew.map(function (savedWorkerVisual) {
                return new ProjectWorkerVisual(savedWorkerVisual);
            });
        }
        if (savedData.levelOverlay) { // Dữ liệu trạng thái của level overlay
            companyInstance.levelOverlay = savedData.levelOverlay;
        }

        companyInstance.conferenceHype = savedData.conferenceHype ? savedData.conferenceHype : 0;
        companyInstance.seed = savedData.seed; // Hạt giống cho bộ sinh số ngẫu nhiên
        if (!companyInstance.seed) {
            companyInstance.seed = Math.floor(Math.random() * 65535);
        }
        companyInstance.randomCalled = savedData.randomCalled; // Số lần hàm random đã được gọi
        companyInstance._mersenneTwister = new MersenneTwister(companyInstance.seed);
        // Tái tạo lại trạng thái của MersenneTwister bằng cách gọi random() số lần đã được lưu
        for (var i = 0; i < companyInstance.randomCalled; i++) {
            companyInstance._mersenneTwister.random();
        }

        companyInstance.knowledge = savedData.knowledge;
        if (!companyInstance.knowledge) {
            companyInstance.knowledge = {};
        }
        companyInstance.eventTriggerCounts = savedData.eventTriggerCounts;
        if (!companyInstance.eventTriggerCounts) {
            companyInstance.eventTriggerCounts = {};
        }
        companyInstance.mods = savedData.mods;
        return companyInstance;
    };

    /**
     * Lưu trạng thái hiện tại của công ty thành một đối tượng để có thể JSON.stringify.
     * @returns {object} Đối tượng chứa dữ liệu công ty.
     */
    companyProto.save = function () {
        var dataToSave = {}; // Đối tượng để lưu dữ liệu
        dataToSave.uid = this.uid;
        dataToSave.name = this.name;
        dataToSave.timePlayed = this.timePlayed;
        dataToSave.slot = this.slot;
        dataToSave.cash = this.cash;
        dataToSave.cashLog = this.cashLog;
        dataToSave.fans = this.fans;
        dataToSave.fansChange = this.fansChange;
        dataToSave.flags = this.flags;
        dataToSave.conferenceStandFactor = this.conferenceStandFactor;

        dataToSave.notifications = this.notifications.map(function (notification) {
            return notification.save();
        });
        dataToSave.activeNotifications = this.activeNotifications.map(function (notification) {
            return notification.save();
        });
        dataToSave.sidebarNotifications = this.sidebarNotifications.map(function (notification) {
            return notification.save();
        });

        dataToSave.licencedPlatforms = this.licencedPlatforms.map(function (platform) {
            return PlatformsSerializer.save(platform);
        });
        dataToSave.availablePlatforms = this.availablePlatforms.map(function (platform) {
            return PlatformsSerializer.save(platform);
        });

        dataToSave.staff = this.staff.map(function (staffMember) {
            return staffMember.save();
        });
        dataToSave.maxStaff = this.maxStaff;

        if (this.currentGame) {
            dataToSave.currentGame = this.currentGame.save();
        }
        dataToSave.currentWeek = this.currentWeek;
        dataToSave.gameLog = this.gameLog.map(function (game) {
            return game.save();
        });
        dataToSave.trashedGames = this.trashedGames.map(function (game) {
            return game.save();
        });

        dataToSave.topics = this.topics.map(function (topic) {
            return TopicsSerializer.save(topic);
        });

        dataToSave.tutorialMessagesShown = this.tutorialMessagesShown;
        dataToSave.scheduledStoriesShown = this.scheduledStoriesShown;
        dataToSave.triggerNotificationsShown = this.triggerNotificationsShown;
        dataToSave.researchPoints = this.researchPoints;
        dataToSave.researchEnabled = this.researchEnabled;
        dataToSave.trainingEnabled = this.trainingEnabled;

        dataToSave.availableResearch = this.availableResearch.map(function (researchItem) {
            return researchItem.id;
        });
        dataToSave.researchCompleted = this.researchCompleted.map(function (researchItem) {
            return researchItem.id;
        });

        dataToSave.engines = this.engines.map(function (engine) {
            return EngineSerializer.save(engine);
        });
        dataToSave.engineParts = this.engineParts.map(function (enginePart) {
            return EnginePartsSerializer.save(enginePart);
        });
        dataToSave.specialItems = this.specialItems.map(function (feature) {
            return FeatureSerializer.save(feature);
        });
        dataToSave.features = this.features.map(function (feature) {
            return FeatureSerializer.save(feature);
        });

        dataToSave.topScoreAchievements = this.topScoreAchievements;
        dataToSave.lastTopScore = this.lastTopScore;
        dataToSave.previousTopScore = this.previousTopScore;
        dataToSave.lastTopScoreWeek = this.lastTopScoreWeek;
        dataToSave.lastTopScoreGameSize = this.lastTopScoreGameSize;
        dataToSave.lastTopScoreIncrease = this.lastTopScoreIncrease;

        if (this.rndCrew) {
            dataToSave.rndCrew = this.rndCrew.map(function (workerVisual) {
                return workerVisual.save();
            });
        }
        if (this.hwCrew) {
            dataToSave.hwCrew = this.hwCrew.map(function (workerVisual) {
                return workerVisual.save();
            });
        }

        dataToSave.currentLevel = this.currentLevel;
        dataToSave.conferenceHype = this.conferenceHype;
        dataToSave.seed = this.seed;
        dataToSave.randomCalled = this.randomCalled;
        if (VisualsManager.levelOverlay) { // Chỉ lưu nếu levelOverlay tồn tại
            dataToSave.levelOverlay = VisualsManager.levelOverlay.saveState();
        }
        dataToSave.knowledge = this.knowledge;
        dataToSave.eventTriggerCounts = this.eventTriggerCounts;
        dataToSave.mods = this.mods;
        return dataToSave;
    };
})();
// --- END OF FILE Company.js ---