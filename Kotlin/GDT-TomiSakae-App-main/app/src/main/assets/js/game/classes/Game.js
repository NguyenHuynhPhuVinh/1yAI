"use strict";
// Định nghĩa constructor cho đối tượng Game
var Game = function (company) { // 'company' là đối tượng Company sở hữu game này
    this.id = GameManager.getGUID(); // ID duy nhất cho mỗi game
    this.topic = this.genre = this.title = void 0; // Chủ đề, thể loại, tiêu đề sẽ được định nghĩa sau
    this.platforms = []; // Mảng các nền tảng game được phát hành trên đó
    this.engine = void 0; // Engine sử dụng để phát triển game
    this.state = GameState.notStarted; // Trạng thái ban đầu của game
    this.gameSize = "small"; // Kích thước game (small, medium, large, aaa)
    this.targetAudience = "everyone"; // Đối tượng người chơi mục tiêu
    this.missionLog = []; // Log các nhiệm vụ/giai đoạn phát triển đã hoàn thành
    this.salesCashLog = []; // Log doanh thu tiền mặt từ bán game
    this.featureLog = null; // Log các tính năng đã được phát triển cho game
    this.score = 0; // Điểm đánh giá trung bình của game
    this.reviews = []; // Mảng các bài đánh giá từ các nhà phê bình
    // Các chỉ số liên quan đến bán hàng và hype
    this.topSalesRank = this.currentSalesRank = this.initialSalesRank = this.fansChanged = this.fansChangeTarget = this.releaseWeek = this.amountSold = this.totalSalesCash = this.currentSalesCash = this.designPoints = this.freeBugCount =
        this.bugs = this.technologyPoints = this.hypePoints = this.costs = 0;
    this.researchFactor = 1; // Hệ số ảnh hưởng đến điểm nghiên cứu nhận được
    this.revenue = 0; // Tổng doanh thu (không trừ chi phí)
    this.flags = {}; // Các cờ đặc biệt liên quan đến game
    this.soldOut = !1; // Trạng thái game đã bán hết hay chưa (thường cho MMO)

    // Nếu công ty có hype từ hội nghị, gán cho game này và giảm hype của công ty
    if (company.conferenceHype) {
        this.hypePoints = company.conferenceHype;
        company.conferenceHype = Math.floor(company.conferenceHype / 3);
    }
};

(function () {
    var gamePrototype = Game.prototype; // Lấy prototype của Game để thêm phương thức

    // Kiểm tra xem game có đang được bán hay không (dựa trên doanh thu dự kiến tuần tới)
    gamePrototype.isOnSale = function () {
        return 0 < this.nextSalesCash;
    };

    // Lưu trữ missionLog dưới dạng mảng các ID của mission
    gamePrototype._saveMissionLog = function () {
        return this.missionLog.map(function (mission) { // 'mission' là một đối tượng mission
            return mission.id;
        });
    };

    // Tải missionLog từ mảng các ID, chuyển đổi lại thành các đối tượng mission đầy đủ
    gamePrototype._loadMissionLog = function (missionIds) { // 'missionIds' là mảng các ID mission
        var allMissions = Missions.getAllMissions(); // 'allMissions' là danh sách tất cả các mission
        this.missionLog = missionIds.map(function (id) { // 'id' là ID của một mission
            return allMissions.first(function (mission) { // 'mission' là một đối tượng mission trong allMissions
                return mission.id === id;
            });
        });
    };

    // Lấy các sự kiện bất thường liên quan đến doanh số (ví dụ: đạt kỷ lục, phỏng vấn hype)
    gamePrototype.getSalesAnomaly = function () {
        this.flags.salesAnomaly || (this.flags.salesAnomaly = 0); // Khởi tạo cờ salesAnomaly nếu chưa có
        var salesEvent = SalesEvents.getSaleRecord(GameManager.company, this); // 'salesEvent' là sự kiện bán hàng
        if (salesEvent) {
            this.flags.salesAnomaly++;
            return salesEvent;
        }
        // Kiểm tra sự kiện hype từ phỏng vấn
        if (this.flags.interviewHyped &&
            2 <= this.salesCashLog.length && !this.flags.interviewHyped.done) {
            this.flags.interviewHyped.done = !0;
            return SalesEvents.getHypedGameEvent(GameManager.company, this);
        }
        // Kiểm tra sự kiện không khớp đối tượng người chơi và nền tảng
        if (GameManager.company.canSetTargetAudience() && !this.flags.audienceMismatchShown && 3 <= this.salesCashLog.length && 0.8 > Platforms.getAudienceWeighting(this.platforms, this.targetAudience)) {
            this.flags.audienceMismatchShown = !0;
            Media.generateAudienceMismatchStory(GameManager.company, this);
        }
        // Kiểm tra các sự kiện khác nếu game đã bán được một thời gian
        if (!(3 >= this.salesCashLog.length)) {
            if (this.flags.topScore && (salesEvent = SalesEvents.getTopScoreSalesEvent(GameManager.company, this))) {
                return salesEvent;
            }
            // Kiểm tra sự kiện bán sớm thành công cho game điểm cao
            if (!(7 >= this.salesCashLog.length || this.flags.salesAnomaly > (10 <= this.score ? 3 : 8 <= this.score ? 2 : 1) || 10 != this.score || this.flags.earlySalesEvent) &&
                (salesEvent = SalesEvents.getEarlySalesEvents(GameManager.company, this))) {
                this.flags.salesAnomaly++;
                this.flags.earlySalesEvent = !0;
                return salesEvent;
            }
        }
    };

    // Lấy tên hiển thị của thể loại (có thể là 1 hoặc 2 thể loại kết hợp)
    gamePrototype.getGenreDisplayName = function () {
        return this.secondGenre ? this.genre.name + "-" + this.secondGenre.name : this.genre.name;
    };

    // Lưu trạng thái của đối tượng Game thành một object đơn giản để serialize
    gamePrototype.save = function () {
        var savedGameData = {}; // 'savedGameData' là đối tượng chứa dữ liệu game đã lưu
        savedGameData.title = this.title;
        savedGameData.id = this.id;
        this.genre && (savedGameData.genre = this.genre.id);
        this.secondGenre && (savedGameData.secondGenre = this.secondGenre.id);
        this.topic && (savedGameData.topic = this.topic.id);
        this.platforms && (savedGameData.platforms = this.platforms.map(function (platform) { // 'platform' là một đối tượng platform
            return {
                id: platform.id
            };
        }));
        savedGameData.gameSize = this.gameSize;
        savedGameData.targetAudience = this.targetAudience;
        savedGameData.sequelTo = this.sequelTo; // ID của game gốc nếu đây là phần tiếp theo
        savedGameData.hypePoints = this.hypePoints;
        savedGameData.technologyPoints = this.technologyPoints;
        savedGameData.bugs = this.bugs;
        savedGameData.freeBugCount = this.freeBugCount;
        savedGameData.designPoints = this.designPoints;
        savedGameData.costs = this.costs;
        savedGameData.score = this.score;
        savedGameData.reviews = this.reviews;
        savedGameData.currentSales = this.currentSalesCash;
        savedGameData.totalSales = this.totalSalesCash;
        savedGameData.amountSold = this.unitsSold;
        savedGameData.salesLog = this.salesCashLog;
        savedGameData.maintenanceLog = this.maintenanceLog; // Log chi phí bảo trì (cho MMO)
        savedGameData.nextMaintenance = this.nextMaintenance; // Chi phí bảo trì dự kiến tuần tới
        savedGameData.missionLog = this._saveMissionLog();
        savedGameData.currentSalesRank = this.currentSalesRank;
        savedGameData.fansChangeTarget = this.fansChangeTarget;
        savedGameData.fansChanged = this.fansChanged;
        savedGameData.initialSalesRank = this.initialSalesRank;
        savedGameData.releaseWeek = this.releaseWeek;
        savedGameData.state = this.state;
        savedGameData.topSalesRank = this.topSalesRank;
        savedGameData.packReleaseWeek = this.packReleaseWeek; // Tuần phát hành gói mở rộng
        savedGameData.researchFactor = this.researchFactor;
        this.featureLog && (savedGameData.featureLog = this.featureLog.map(function (feature) { // 'feature' là một đối tượng feature
            return CompanyFeatureSerializer.save(feature);
        }));
        this.engine && (savedGameData.engine_id = this.engine.id);
        this.features && (savedGameData.features = this.features.map(function (feature) { // 'feature' là một đối tượng feature
            return {
                id: feature.id
            };
        }));
        this.reviewMessageDisplayed && (savedGameData.reviewMessageDisplayed = this.reviewMessageDisplayed);
        savedGameData.flags = this.flags;
        savedGameData.nextSR = this.nextSalesRank; // Xếp hạng bán hàng dự kiến tuần tới
        savedGameData.nFC = this.nextfansChange; // Lượng fan thay đổi dự kiến tuần tới
        savedGameData.nS = this.nextSalesCash; // Doanh thu dự kiến tuần tới
        savedGameData.so = this.soldOut; // Đã bán hết
        savedGameData.revenue = this.revenue;
        this.confAmount && (savedGameData.confAmount = this.confAmount); // Lượng hype từ hội nghị
        return savedGameData;
    };

    // Tải trạng thái của đối tượng Game từ dữ liệu đã lưu
    Game.load = function (savedData, companyOwner) { // 'savedData' là object chứa dữ liệu game, 'companyOwner' là công ty sở hữu game
        if (savedData) {
            var newGame = new Game(companyOwner); // 'newGame' là đối tượng game mới được tạo
            newGame.title = savedData.title;
            newGame.id = savedData.id;
            newGame.id || (newGame.id = GameManager.getGUID()); // Đảm bảo có ID nếu file save cũ không có
            void 0 != savedData.genre && (newGame.genre = GameGenre.getAll().first(function (genre) { // 'genre' là một đối tượng genre
                return genre.id === savedData.genre;
            }));
            void 0 != savedData.secondGenre && (newGame.secondGenre = GameGenre.getAll().first(function (genre) { // 'genre' là một đối tượng genre
                return genre.id === savedData.secondGenre;
            }));
            void 0 != savedData.topic && (newGame.topic = Topics.topics.first(function (topic) { // 'topic' là một đối tượng topic
                return topic.id === savedData.topic;
            }));
            void 0 != savedData.platforms && (newGame.platforms = savedData.platforms.map(function (platformData) { // 'platformData' là object chứa id của platform
                var platform = Platforms.allPlatforms.first(function (platformObj) { // 'platformObj' là một đối tượng platform
                    return platformObj.id === platformData.id;
                });
                // Nếu không tìm thấy trong danh sách platform chung, tìm trong danh sách platform đã mua bản quyền của công ty
                platform || (platform = companyOwner.licencedPlatforms.first(function (platformObj) { // 'platformObj' là một đối tượng platform
                    return platformObj.id === platformData.id;
                }));
                return platform;
            }));
            newGame.gameSize = savedData.gameSize;
            newGame.targetAudience = savedData.targetAudience;
            newGame.sequelTo = savedData.sequelTo;
            newGame.hypePoints = savedData.hypePoints;
            newGame.technologyPoints = savedData.technologyPoints;
            newGame.bugs = savedData.bugs;
            newGame.freeBugCount = savedData.freeBugCount;
            newGame.designPoints = savedData.designPoints;
            newGame.score = savedData.score;
            newGame.reviews = savedData.reviews;
            newGame.costs = savedData.costs;
            newGame.currentSalesCash = savedData.currentSales;
            newGame.totalSalesCash = savedData.totalSales;
            newGame.unitsSold = savedData.amountSold;
            void 0 != savedData.salesLog && (newGame.salesCashLog = savedData.salesLog);
            void 0 != savedData.maintenanceLog && (newGame.maintenanceLog = savedData.maintenanceLog);
            savedData.nextMaintenance && (newGame.nextMaintenance = savedData.nextMaintenance);
            savedData.packReleaseWeek && (newGame.packReleaseWeek = savedData.packReleaseWeek);
            newGame._loadMissionLog(savedData.missionLog);
            newGame.currentSalesRank = savedData.currentSalesRank;
            newGame.fansChangeTarget = savedData.fansChangeTarget;
            newGame.fansChanged = savedData.fansChanged;
            newGame.initialSalesRank = savedData.initialSalesRank;
            newGame.releaseWeek = savedData.releaseWeek;
            newGame.state = savedData.state;
            newGame.topSalesRank = savedData.topSalesRank;
            newGame.unitPrice = savedData.unitPrice ? savedData.unitPrice : Sales.getUnitPrice(newGame);
            newGame.researchFactor = savedData.researchFactor;
            newGame.featureLog = null;
            savedData.featureLog && (newGame.featureLog = savedData.featureLog.map(function (featureData) { // 'featureData' là dữ liệu feature đã lưu
                return CompanyFeatureSerializer.load(featureData);
            }).filter(function (feature) { // 'feature' là đối tượng feature đã load
                return feature; // Loại bỏ các feature null nếu có lỗi load
            }));
            savedData.engine_id && (newGame.engine = companyOwner.engines.first(function (engine) { // 'engine' là một đối tượng engine
                return engine.id === savedData.engine_id;
            }));
            savedData.features && (newGame.features = savedData.features.map(function (featureData) { // 'featureData' là dữ liệu feature đã lưu
                return FeatureSerializer.load(featureData);
            }).filter(function (feature) { // 'feature' là đối tượng feature đã load
                return feature;
            }));
            savedData.reviewMessageDisplayed && (newGame.reviewMessageDisplayed = savedData.reviewMessageDisplayed);
            newGame.flags = savedData.flags;
            newGame.flags || (newGame.flags = {}); // Đảm bảo flags luôn là một object
            newGame.nextSalesRank = savedData.nextSR;
            newGame.nextfansChange = savedData.nFC;
            newGame.nextSalesCash = savedData.nS;
            // Nếu game đã bán hết theo cờ 'so', hoặc nếu doanh thu hiện tại bằng tổng doanh thu dự kiến (và không phải là game mới)
            savedData.so ? newGame.soldOut = savedData.so : newGame.currentSalesCash >= newGame.totalSalesCash && 0 != newGame.currentSalesCash && (newGame.soldOut = !0);
            newGame.revenue = savedData.revenue ? savedData.revenue : Math.floor(newGame.unitsSold * newGame.unitPrice);
            savedData.confAmount && (newGame.confAmount = savedData.confAmount);
            return newGame;
        }
    };

    // Lấy tỷ lệ đóng góp của một nhân viên vào game
    gamePrototype.getRatioWorked = function (staffMember) { // 'staffMember' là đối tượng nhân viên
        var staffId = staffMember.id; // 'staffId' là ID của nhân viên
        return this.flags.devTime && this.flags.staffContribution.hasOwnProperty(staffId) ? this.flags.staffContribution[staffId] / this.flags.devTime : 0;
    };

    // Kiểm tra xem có bật tính năng phân công trách nhiệm cho nhân viên không (dựa trên kích thước game)
    gamePrototype.isStaffResponsibilityEnabled = function () {
        return "small" != this.gameSize;
    };

    // Kiểm tra xem có thể tạo báo cáo "post-mortem" cho game này không
    gamePrototype.canDoPostMortem = function () {
        var gameId = this.id; // 'gameId' là ID của game hiện tại
        // Điều kiện: chưa hoàn thành post-mortem, đã phát hành, trong vòng 2 năm kể từ khi phát hành,
        // và không có nhân viên nào đang làm post-mortem cho game này.
        return !this.flags.postMortemCompleted &&
            this.releaseWeek < GameManager.company.currentWeek &&
            GameManager.company.getDate(this.releaseWeek).year > GameManager.company.getCurrentDate().year - 2 &&
            !GameManager.company.staff.some(function (staffMember) { // 'staffMember' là đối tượng nhân viên
                return staffMember.flags.postMortemGameId == gameId;
            });
    };
})();