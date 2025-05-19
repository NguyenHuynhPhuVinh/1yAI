// General.js

// Biến cờ để bật/tắt việc ghi log doanh số hàng tuần cho mục đích debug.
var LOGWEEKSALES = !1,
    // Đối tượng General chứa các hàm tiện ích và logic chung của game.
    General = {};

(function () {
    /**
     * Cập nhật thời gian chờ của các thông báo đang hoạt động.
     * Giảm `weeksUntilFired` của mỗi thông báo đi 0.1.
     * @param {Company} company - Đối tượng công ty của người chơi.
     */
    General.updateNotifications = function (company) {
        for (var i = 0; i < company.notifications.length; i++) {
            company.notifications[i].weeksUntilFired -= 0.1;
        }
    };

    /**
     * Tiến hành xử lý logic cho một tuần trong game.
     * @param {Company} company - Đối tượng công ty của người chơi.
     * @param {number} [currentWeekOverride] - Tuần hiện tại để ghi đè (nếu có, dùng cho tính toán).
     */
    General.proceedOneWeek = function (company, currentWeekOverride) {
        var currentWeek = company.currentWeek;
        if (currentWeekOverride) {
            currentWeek = currentWeekOverride;
        }

        if (currentWeek > 0) {
            var dateInfo = company.getDate(currentWeek);

            // Kiểm tra điều kiện kết thúc game (trial hoặc hết giới hạn năm chơi)
            if (dateInfo.year > 4 && GameManager.ghg2()) { // ghg2() có thể là kiểm tra phiên bản trial/lite
                company.notifications.push(new Notification("{TrialEnd}"));
            } else if (dateInfo.year > 30 * GameManager.flags.gameLengthModifier && !company.flags.endGameShown) {
                Media.createFinishGameStories();
                company.flags.endGameShown = !0;
            }

            var cashBeforeWeeklyProcessing = company.cash;
            Sales.processSales(company); // Xử lý doanh số bán game

            if (dateInfo.week === 1) { // Xử lý các sự kiện đầu tháng (tuần 1)
                General.payMonthlyCosts(company);
                Sales.sellSDKs(company); // Bán bản quyền SDK (nếu có)
                Sales.applyGridSales(company); // Áp dụng doanh thu từ nền tảng Grid (nếu có)
            }

            // Xử lý cổ tức nếu ở chế độ pirate và có bán cổ phần
            if (company.flags.pirateMode && company.flags.sharesSold > 0) {
                var profitThisWeek = company.cash - cashBeforeWeeklyProcessing;
                if (profitThisWeek > 0) {
                    var dividendAmount = profitThisWeek / 100 * 20 * (company.flags.sharesSold / 100);
                    dividendAmount = Math.floor(dividendAmount);
                    company.adjustCash(-dividendAmount, "Dividends".localize("heading"));
                }
            }

            GameTrends.updateTrends(company); // Cập nhật xu hướng thị trường

            // Xử lý sự kiện hội chợ game G3
            if (company.currentLevel > 1 && dateInfo.month === 5 && dateInfo.week === 1 && dateInfo.year > 7) {
                if (!GameFlags.CONFERENCE_DISABLED) {
                    if (company.flags.customConference) {
                        var customBooth = company.booths.first(function (booth) { return booth.id === 4; });
                        company.conferenceStandFactor = customBooth.standFactor;
                        company.flags.customConference = !1;
                        company.notifications.push(new Notification("News".localize("heading"),
                            "Our own game convention is taking place in 4 weeks!".localize(), {
                            type: NotificationType.Others,
                            previewImage: "./images/notificationIcons/icon_notification_new_office.png"
                        }));
                        company.flags.isCustomConference = !0;
                        // company.flags.customConference = !1; // Dòng này có vẻ lặp lại
                    } else {
                        company.notifications.push(new Notification("{BoothPicker}"));
                    }
                }
            } else if (dateInfo.month === 6 && dateInfo.week === 2 && company.conferenceStandFactor && !GameFlags.CONFERENCE_DISABLED) {
                General.runConference(company);
            }

            // Phát sự kiện báo hiệu một tuần đã trôi qua
            GDT.fire(GameManager, GDT.eventKeys.gameplay.weekProceeded, {
                company: company
            });
        }

        // Kiểm tra và phát hành các nền tảng mới theo lịch trình
        for (var platformIndex = 0; platformIndex < Platforms.allPlatforms.length; platformIndex++) {
            var platform = Platforms.allPlatforms[platformIndex];
            if (Platforms.getPublishDate(platform) === Math.floor(currentWeek)) {
                if (platform.licencePrize === 0) {
                    company.licencedPlatforms.push(platform);
                } else {
                    company.availablePlatforms.push(platform);
                }
                if (Math.floor(currentWeek) > 0) {
                    var newPlatformNotification = new Notification({
                        header: "Platform News".localize("heading"),
                        text: "Today the new game platform {0} by {1} has been released.".localize().format(platform.name, platform.company),
                        image: Platforms.getPlatformImage(platform, company.currentWeek),
                        type: NotificationType.PlatformNews
                    });
                    company.notifications.push(newPlatformNotification);
                    // Nếu có hợp đồng với nhà phát hành, có thể làm hết hạn hợp đồng đó
                    if (company.flags.contractspublisher) {
                        company.flags.contractspublisher.expireBy = GameManager.gameTime - 1;
                    }
                }
            }
        }

        // Kiểm tra và loại bỏ các nền tảng đã cũ/hết hạn
        General.checkAndRemoveRetiredPlatforms(company, company.licencedPlatforms, currentWeek);
        General.checkAndRemoveRetiredPlatforms(company, company.availablePlatforms, currentWeek);

        // Ghi log doanh số (nếu bật)
        if (LOGWEEKSALES) {
            General.logMaxSalesForWeek(currentWeek);
        }
    };

    /**
     * Chuyển đổi chuỗi ngày tháng (năm/tháng/tuần) thành số tuần tuyệt đối.
     * @param {string} dateString - Chuỗi ngày tháng theo định dạng "năm/tháng/tuần".
     * @param {boolean} [ignoreGameLengthModifier=false] - Nếu true, bỏ qua hệ số điều chỉnh độ dài game.
     * @returns {number} Số tuần tuyệt đối.
     */
    General.getWeekFromDateString = function (dateString, ignoreGameLengthModifier) {
        var dateParts = dateString.split("/");
        if (dateParts.length !== 3) {
            return 0;
        }
        // 1 năm = 12 tháng, 1 tháng = 4 tuần
        var weekNumber = (parseInt(dateParts[0]) - 1) * 48 + (parseInt(dateParts[1]) - 1) * 4 + (parseInt(dateParts[2]) - 1);

        if (!ignoreGameLengthModifier) {
            var gameLengthModifier = GameManager.flags.gameLengthModifier;
            if (gameLengthModifier && gameLengthModifier !== 1) {
                weekNumber = Math.round(weekNumber * gameLengthModifier);
            }
        }
        return weekNumber;
    };

    /**
     * Ghi log doanh số tối đa có thể đạt được cho một tuần cụ thể (dùng cho debug).
     * @param {number} weekNumber - Số tuần hiện tại.
     */
    General.logMaxSalesForWeek = function (weekNumber) {
        GameManager.pause(!0);
        var tempCompany = new Company("SalesLogCompany");
        tempCompany.currentWeek = weekNumber;
        var tempGame = new Game(tempCompany);
        tempGame.topic = Topics.topics[0];
        tempGame.genre = GameGenre.Action;

        var allPlatforms = GameManager.company.availablePlatforms.concat(GameManager.company.licencedPlatforms);
        for (var i = 0; i < allPlatforms.length; i++) {
            if (Platforms.getMarketSizeForWeek(allPlatforms[i], weekNumber, tempCompany) > 0) {
                tempGame.platforms = [];
                tempGame.platforms.push(allPlatforms[i]);
            }
        }

        "Sales week {0}".format(weekNumber).log();
        for (var score = 1; score < 11; score++) {
            tempGame.score = score;
            Sales.calculateSales(tempCompany, tempGame);
            "score {0}, income {2}".format(tempGame.score, tempGame.unitsSold, tempGame.totalSalesCash).log();
        }
        GameManager.resume(!0);
    };

    /**
     * Kiểm tra và loại bỏ các nền tảng đã cũ/hết hạn khỏi danh sách.
     * Tạo thông báo tương ứng cho người chơi.
     * @param {Company} company - Đối tượng công ty.
     * @param {Array<Platform>} platformsList - Danh sách các nền tảng (ví dụ: đã cấp phép hoặc có sẵn).
     * @param {number} currentWeek - Tuần hiện tại.
     */
    General.checkAndRemoveRetiredPlatforms = function (company, platformsList, currentWeek) {
        for (var i = 0; i < platformsList.length; i++) {
            var platform = platformsList[i];
            // Thông báo 2 tháng trước khi nền tảng hết hạn
            if (Platforms.getRetireDate(platform) === Math.floor(currentWeek) + 8) {
                company.notifications.push(new Notification("News".localize("heading"),
                    "In two months the {0} will be taken off the market!".localize().format(platform.name), {
                    type: NotificationType.PlatformNews
                }));
            }
            // Xử lý khi nền tảng chính thức hết hạn
            if (Platforms.getRetireDate(platform) === Math.floor(currentWeek)) {
                var gamesReleasedOnPlatformCount = 0;
                var totalRevenueOnPlatform = 0;
                for (var j = 0; j < company.gameLog.length; j++) {
                    var game = company.gameLog[j];
                    if (!game.flags.isExtensionPack && game.platforms.filter(function (p) { return p.id === platform.id; }).length > 0) {
                        gamesReleasedOnPlatformCount++;
                        totalRevenueOnPlatform += game.revenue;
                    }
                }

                if (gamesReleasedOnPlatformCount > 0) {
                    var message = gamesReleasedOnPlatformCount === 1 ?
                        "{0} is no longer supported.\nYou've released {1} game for the platform and earned a total of {2}!".localize()
                        : "{0} is no longer supported.\nYou've released {1} games for the platform and earned a total of {2}!".localize();
                    company.notifications.push(new Notification("News".localize("heading"),
                        message.format(platform.name, gamesReleasedOnPlatformCount, UI.getShortNumberString(totalRevenueOnPlatform)), {
                        type: NotificationType.SalesReports
                    }));
                } else {
                    company.notifications.push(new Notification("News".localize("heading"),
                        "{0} is no longer supported.".localize().format(platform.name), {
                        type: NotificationType.PlatformNews
                    }));
                }
            }
        }
    };

    /**
     * Mô phỏng sự kiện hội chợ game (G3).
     * Tính toán lượng khách tham quan gian hàng và hype được tạo ra.
     * @param {Company} company - Đối tượng công ty.
     */
    General.runConference = function (company) {
        var currentFans = company.fans;
        var currentYear = company.getCurrentDate().year;
        var totalAttendees = Math.floor(49876 + (47500 * currentYear)); // Tổng số người tham dự G3
        var minVisitors = Math.floor(0.005 * totalAttendees); // Số khách tối thiểu ghé thăm gian hàng

        var boothVisitors = minVisitors;
        var fanInfluenceFactor = (currentFans / 5E5).clamp(0, 1); // Hệ số ảnh hưởng từ fan
        var fanBasedVisitors = Math.floor(totalAttendees * fanInfluenceFactor * 0.7);
        var standBasedVisitors = Math.floor(totalAttendees * company.conferenceStandFactor * 0.3);

        boothVisitors = boothVisitors + fanBasedVisitors + standBasedVisitors;
        boothVisitors = Math.floor(boothVisitors.clamp(0, totalAttendees));

        var visitorRatio = boothVisitors / totalAttendees;
        // Xếp hạng gian hàng, càng gần 1 càng tốt
        var boothRank = Math.floor(Math.abs((200 * visitorRatio) - 199));

        "conference. attendees: {0}, booth visitors: {1}({2}min+{3}fans+{4}stand), booth-rank: {5}"
            .format(totalAttendees, boothVisitors, minVisitors, fanBasedVisitors, standBasedVisitors, boothRank).log();

        var hypeGenerated = Math.floor((10 + (20 * company.getRandom())) + (100 * visitorRatio));
        if (company.currentGame) {
            company.currentGame.hypePoints += hypeGenerated;
            "hype points generated for current game: {0}".format(hypeGenerated).log();
        }

        var conferenceReportMessage = "We had {0} people visiting our booth this year.".localize().format(UI.getLongNumberString(boothVisitors));
        if (boothRank > 100) {
            conferenceReportMessage += ("\n" + "We didn't make it in the top 100 booths this year. Once we gain more fans I'm sure we will!".localize());
        } else if (boothRank === 1 || boothRank === 0) {
            conferenceReportMessage += ("\n" + "We were voted the number one booth this year! Congratulations!".localize());
        } else {
            conferenceReportMessage += ("\n" + "We made it into the top 100 conference attractions this year at place {0}.".localize().format(boothRank));
        }

        company.notifications.push(new Notification("{GameConferenceAnimation}", "", boothVisitors, 0));

        var iconPath = "./images/notificationIcons/icon_notification_convention.png";
        if (company.flags.isCustomConference) {
            conferenceReportMessage = "Our convention had {0} visitors this year!".localize().format(UI.getLongNumberString(boothVisitors));
            company.flags.isCustomConference = !1; // Đặt lại cờ
            iconPath = undefined; // Không dùng icon mặc định cho hội chợ tùy chỉnh
        }

        company.notifications.push(new Notification("Game Conference".localize("heading"), conferenceReportMessage, "OK".localize(), {
            type: NotificationType.SalesReports,
            previewImage: iconPath
        }));
    };

    /**
     * Tính toán chi phí hoạt động hàng tháng của công ty.
     * @param {Company} company - Đối tượng công ty.
     * @returns {number} Tổng chi phí hàng tháng.
     */
    General.getMonthlyCosts = function (company) {
        var baseOfficeCost = 8E3;
        if (company.currentLevel === 2 || company.currentLevel === 3) {
            baseOfficeCost *= 4;
        } else if (company.currentLevel === 4) {
            baseOfficeCost *= 8;
        }
        if (company.flags.solarPowerInstalled) {
            baseOfficeCost *= 0.8; // Giảm chi phí nếu có pin mặt trời
        }
        for (var i = 0; i < company.staff.length; i++) {
            if (company.staff[i].salary) {
                baseOfficeCost += company.staff[i].salary;
            }
        }
        return baseOfficeCost;
    };

    /**
     * Trừ chi phí hàng tháng khỏi tiền mặt của công ty.
     * @param {Company} company - Đối tượng công ty.
     */
    General.payMonthlyCosts = function (company) {
        var totalMonthlyCosts = General.getMonthlyCosts(company);
        company.cash -= totalMonthlyCosts;
        company.cashLog.push({
            amount: -totalMonthlyCosts,
            label: "monthly costs".localize("heading")
        });

        if (company.currentGame) {
            company.currentGame.costs += totalMonthlyCosts;
        }

        // Xử lý nếu thẻ tín dụng bị đánh cắp
        if (company.flags.creditCardStolen && !company.flags.creditCardSwitched) {
            company.adjustCash(-Math.floor(company.flags.creditCardDamages / 3), "MSCDPN_88");
        }

        // Xử lý chi phí phòng lab nếu ở level 4+
        if (company.currentLevel >= 4) {
            if (company.flags.fractionalHwLabCosts) {
                company.adjustCash(-company.flags.fractionalHwLabCosts, "Hardware lab".localize());
                company.flags.fractionalHwLabCosts = 0;
            }
            if (company.flags.fractionalRndLabCosts) {
                company.adjustCash(-company.flags.fractionalRndLabCosts, "R&D lab".localize());
                company.flags.fractionalRndLabCosts = 0;
            }
        }
    };

    /**
     * Xử lý việc phát hành một tựa game.
     * @param {Company} company - Đối tượng công ty.
     */
    General.releaseGame = function (company) {
        var gameBeingReleased = company.currentGame;
        GDT.fire(GameManager, GDT.eventKeys.gameplay.beforeReleaseGame, {
            company: company,
            game: gameBeingReleased
        });

        gameBeingReleased.state = GameState.released;
        gameBeingReleased.releaseWeek = Math.floor(company.currentWeek) + 1;

        // Tính toán đóng góp của nhân viên vào game
        for (var i = 0; i < company.staff.length; i++) {
            var staffMember = company.staff[i];
            if (gameBeingReleased.flags.staffContribution.hasOwnProperty(staffMember.id)) {
                staffMember.flags.gamesContributed = staffMember.flags.gamesContributed || 0;
                staffMember.flags.gamesContributed += gameBeingReleased.getRatioWorked(staffMember);
            }
        }

        Tutorial.gameReleased();
        Reviews.reviewGame(company); // Đánh giá game
        Sales.calculateSales(company, gameBeingReleased); // Tính toán doanh số

        // Mở khóa nghiên cứu và tutorial nếu đây là game đầu tiên
        if (company.gameLog.length === 0) {
            company.researchEnabled = !0;
            company.availableResearch.addRange(Research.BasicItems);
            Tutorial.firstGameFinished(gameBeingReleased.releaseWeek - company.currentWeek + 0.4);
        }

        company.gameLog.push(gameBeingReleased);

        // Mở khóa hợp đồng nếu đủ điều kiện
        if (!company.flags.contractsEnabled && company.gameLog.length >= 3) {
            GameManager.enableContracts();
        }

        // Lưu lại cài đặt trách nhiệm cho game tiếp theo
        company.flags.featureResponsibility = $.extend({}, gameBeingReleased.flags.featureResponsibility);
        company.currentGame = null; // Xóa game đang phát triển hiện tại

        // Hoàn thành hợp đồng nếu có
        if (GameManager.currentContract && GameManager.currentContract.type === "gameContract") {
            GameManager.finishContract(!(gameBeingReleased.score >= GameManager.currentContract.minScore));
        }

        // Xử lý việc trả nợ nếu có vay bailout
        if (gameBeingReleased.flags.miniBailoutAmount) {
            DecisionNotifications.inDevBailout.triggerPayBack(gameBeingReleased, gameBeingReleased.releaseWeek - company.currentWeek);
        }

        // Easter eggs
        if (gameBeingReleased.title === "ghg141kph") {
            company.flags.ghg141 = !0;
        }
        if (gameBeingReleased.title === "ghgnogfc") {
            company.flags.ghgnogfc = !0;
        }

        GDT.fire(GameManager, GDT.eventKeys.gameplay.afterReleaseGame, {
            company: company,
            game: gameBeingReleased
        });
    };

    /**
     * Hủy bỏ một tựa game đang phát triển.
     * @param {Company} company - Đối tượng công ty.
     */
    General.trashGame = function (company) {
        var gameBeingTrashed = company.currentGame;
        company.trashedGames.push(company.currentGame);
        company.flags.featureResponsibility = $.extend({}, gameBeingTrashed.flags.featureResponsibility);
        company.currentGame = null;

        if (GameManager.currentContract && GameManager.currentContract.type === "gameContract") {
            GameManager.finishContract(!0); // Hủy hợp đồng (mặc định là thất bại)
        }
        // Xử lý trả nợ bailout nếu có
        if (gameBeingTrashed.flags.miniBailoutAmount) {
            DecisionNotifications.inDevBailout.triggerPayBack(gameBeingTrashed, 0);
        }
    };

    /**
     * Lấy danh sách các bộ phận engine có sẵn để công ty sử dụng/nghiên cứu.
     * @param {Company} company - Đối tượng công ty.
     * @returns {Array<Object>} Danh sách các bộ phận engine.
     */
    General.getAvailableEngineParts = function (company) {
        if (!company.canDevelopEngine()) {
            return [];
        }
        var baseParts = [Research.TwoDGraphicsV2, Research.linearStory, Research.saveGame];
        var allResearchItems = Research.getAllItems();
        var researchedAndAvailable = allResearchItems
            .except(Research.StartEngineParts.concat(Research.BasicItems))
            .filter(function (part) {
                return Research.getEnginePoints(part) !== 0 &&
                    Research.getEngineCost(part) !== 0 &&
                    company.researchCompleted.indexOf(part) !== -1;
            });
        return baseParts.concat(researchedAndAvailable);
    };

    /**
     * Kiểm tra xem một engine có chứa một bộ phận cụ thể không.
     * @param {Object} engine - Đối tượng engine.
     * @param {Object} enginePart - Đối tượng bộ phận engine.
     * @returns {boolean} True nếu engine chứa bộ phận, ngược lại false.
     */
    General.hasEnginePart = function (engine, enginePart) {
        return engine.parts.some(function (part) {
            return part.id === enginePart.id;
        });
    };

    /**
     * Tính toán hệ số ảnh hưởng của nhân viên được giao trách nhiệm cho một hạng mục phát triển.
     * @param {Company} company - Đối tượng công ty.
     * @param {Object} mission - Đối tượng hạng mục/mission.
     * @param {string} pointType - Loại điểm ('d' cho design, 't' cho technology).
     * @returns {number} Hệ số ảnh hưởng.
     */
    General.getResponsibleStaffFactor = function (company, mission, pointType) {
        var factor = 1;
        var currentGame = company.currentGame;

        if (currentGame.flags.featureResponsibility && currentGame.flags.featureResponsibility.hasOwnProperty(mission.id)) {
            var staffId = currentGame.flags.featureResponsibility[mission.id];
            var responsibleStaff = company.staff.first(function (staff) {
                return staff.id === staffId;
            });

            if (!responsibleStaff) {
                return 0.7; // Nhân viên không tồn tại, giảm hiệu suất
            }

            var effectiveWorkload = General.getEffectiveWorkload(responsibleStaff, currentGame);
            var skillFactor = (pointType === 'd') ? responsibleStaff.designFactor : responsibleStaff.technologyFactor;

            factor = 0.5 + (0.5 * skillFactor.clamp(0, 1)) + (0.1 * skillFactor);

            if (responsibleStaff.flags.expert === mission.id) {
                factor += 0.15 * skillFactor; // Thưởng thêm nếu là chuyên gia
            }

            var workloadPenaltyFactor = (effectiveWorkload / 100 - 1).clamp(-1, 1);
            if (workloadPenaltyFactor > 0) {
                factor -= 0.75 * factor * workloadPenaltyFactor; // Quá tải
            } else {
                factor -= 0.25 * factor * -workloadPenaltyFactor; // Chưa đủ tải
            }
        }
        return factor;
    };

    /**
     * Tính toán khối lượng công việc hiệu quả của một nhân viên cho một game.
     * @param {Character} staffMember - Đối tượng nhân viên.
     * @param {Game} game - Đối tượng game.
     * @returns {number} Khối lượng công việc hiệu quả (%).
     */
    General.getEffectiveWorkload = function (staffMember, game) {
        var rawWorkload = staffMember.flags.workload; // %
        // Optimal team size workload is 300% for one person, 150% for two, 100% for three etc.
        return (100 / (300 / General.getOptimalTeamSize(game))) * rawWorkload;
    };

    /**
     * Hàm nội bộ tính toán điểm Design/Tech cơ bản cho một hạng mục phát triển.
     * @param {Game} game - Đối tượng game.
     * @param {Object} featureOrMissionFocus - Đối tượng feature hoặc focus của hạng mục.
     * @param {string} pointType - Loại điểm ('d' cho design, 't' cho technology).
     * @returns {number} Số điểm cơ bản.
     */
    var calculateBasePointsForFocus = function (game, featureOrMissionFocus, pointType) {
        var genreTopicFactor = GameGenre.getGenreWeighting(game.topic.genreWeightings, game.genre, game.secondGenre);
        var mission = General.getMission(featureOrMissionFocus.id);
        var basePoints = 0;

        if (featureOrMissionFocus.type !== "focus") {
            if (GameFlags.ghg6) { // Chế độ debug
                throw "separate features in workLog not implemented";
            }
            return 0;
        }

        if (mission.missionType === "preparation" || mission.missionType === "BugFixing") {
            basePoints = Missions.BASE_POINTS / 2;
        } else {
            basePoints = Missions.BASE_POINTS * Missions.getGeneralFactor(GameManager.company, mission);
            basePoints += General.getGameBasePoints(game) / 9; // Thưởng thêm dựa trên tech level của game
            basePoints *= (pointType === "d" ? mission.designFactor : mission.technologyFactor);
            basePoints *= mission.percentage / (100 / 3); // Tỉ lệ với % focus

            var featureBonus = 0;
            var featuresInMissionCategory = game.features.filter(function (f) {
                return f.category === mission.id;
            });

            for (var i = 0; i < featuresInMissionCategory.length; i++) {
                var currentFeatureBonus = calculateFeatureBonus(featuresInMissionCategory[i], game, mission);
                if (currentFeatureBonus && !isNaN(currentFeatureBonus)) {
                    featureBonus += currentFeatureBonus;
                }
            }
            if (isNaN(featureBonus)) {
                throw "invalid featureBonus value";
            }

            featureBonus *= General.getFeatureEfficiencyFromMissionFocus(game, featuresInMissionCategory, mission.percentage) / 100;
            basePoints = (basePoints + featureBonus) * General.getResponsibleStaffFactor(GameManager.company, mission, pointType);
        }
        return basePoints * genreTopicFactor;
    };

    /**
     * Hàm nội bộ tính toán điểm thưởng từ một feature cụ thể.
     * @param {Object} feature - Đối tượng feature.
     * @param {Game} game - Đối tượng game.
     * @param {Object} mission - Đối tượng mission.
     * @returns {number} Điểm thưởng từ feature.
     */
    var calculateFeatureBonus = function (feature, game, mission) {
        var efficiency = 1;
        if (feature.getEfficiency) { // Một số feature có thể có hàm tính hiệu quả riêng
            efficiency = feature.getEfficiency(game);
        }
        // v: giá trị cơ bản của feature, kinh nghiệm của feature, hiệu quả của feature
        return feature.v * LevelCalculator.getLevelBonusFactor(feature.experience) * efficiency * 0.8;
    };

    /**
     * Tính toán hiệu quả của các feature dựa trên mức độ tập trung vào một hạng mục.
     * @param {Game} game - Đối tượng game.
     * @param {Array<Object>} featuresInMissionCategory - Danh sách các feature trong hạng mục.
     * @param {number} focusPercentage - Tỷ lệ % tập trung vào hạng mục.
     * @returns {number} Hiệu quả (0-100).
     */
    General.getFeatureEfficiencyFromMissionFocus = function (game, featuresInMissionCategory, focusPercentage) {
        var efficiency = 100;
        if (featuresInMissionCategory.length > 0) {
            var totalFeatureValue = featuresInMissionCategory.sum(function (f) { return f.v; });
            var gameSizeFactor = (game.gameSize === "aaa" ? 0.4 : game.gameSize === "large" ? 0.7 : 1);
            // Mức độ tập trung càng cao so với tổng giá trị feature thì hiệu quả càng cao
            // 5 là một hệ số điều chỉnh
            efficiency = (100 / (5 * totalFeatureValue * gameSizeFactor) * focusPercentage).clamp(0, 100);
        }
        return efficiency;
    };

    /**
     * Lấy điểm Design cho một hạng mục phát triển.
     * @param {Game} game - Đối tượng game.
     * @param {Object} featureOrMissionFocus - Đối tượng feature hoặc focus của hạng mục.
     * @returns {number} Điểm Design.
     */
    General.getD = function (game, featureOrMissionFocus) {
        return calculateBasePointsForFocus(game, featureOrMissionFocus, "d");
    };

    /**
     * Lấy điểm Technology cho một hạng mục phát triển.
     * @param {Game} game - Đối tượng game.
     * @param {Object} featureOrMissionFocus - Đối tượng feature hoặc focus của hạng mục.
     * @returns {number} Điểm Technology.
     */
    General.getT = function (game, featureOrMissionFocus) {
        return calculateBasePointsForFocus(game, featureOrMissionFocus, "t");
    };

    /**
     * Tính toán điểm Research cho một hạng mục phát triển.
     * @param {Game} game - Đối tượng game.
     * @param {Object} featureOrMissionFocus - Đối tượng feature hoặc focus của hạng mục.
     * @returns {number} Điểm Research.
     */
    General.getR = function (game, featureOrMissionFocus) {
        if (featureOrMissionFocus.type === "focus") {
            var mission = General.getMission(featureOrMissionFocus.id);
            var researchPoints = 0;
            if (mission.missionType === "preparation" || mission.missionType === "BugFixing") {
                return 0;
            }
            researchPoints = Missions.BASE_RESEARCH_POINTS * GameManager.company.currentGame.researchFactor;
            researchPoints += researchPoints * GameManager.company.getRandom() * 0.1; // Biến thiên ngẫu nhiên
            if (mission.percentage) {
                researchPoints *= mission.percentage / (100 / 3); // Tỉ lệ với % focus
            }
            researchPoints *= this.getGameSizePointsFactor(game); // Ảnh hưởng bởi kích thước game

            // Giảm research points nếu có nhiều nhân viên hoặc công ty có nhiều research points sẵn
            for (var staffCount = 1; staffCount < GameManager.company.staff.length; staffCount++) {
                researchPoints *= 0.95;
            }
            for (var rpFactor = 0; rpFactor < GameManager.company.researchPoints / 200; rpFactor++) {
                researchPoints *= 0.95;
            }
            return researchPoints;
        }
        if (featureOrMissionFocus.type === "feature") {
            // Feature riêng lẻ có thể không trực tiếp tạo research points ở đây
            var feature = General.getFeature(featureOrMissionFocus.id);
            return 0;
        }
    };

    /**
     * Tính toán thời gian phát triển cho một hạng mục hoặc feature.
     * @param {Game} game - Đối tượng game.
     * @param {Object} featureOrMissionFocus - Đối tượng feature hoặc focus của hạng mục.
     * @returns {number} Thời gian phát triển (ms).
     */
    General.getDuration = function (game, featureOrMissionFocus) {
        var baseDuration = 0;
        if (featureOrMissionFocus.type === "focus") {
            var mission = General.getMission(featureOrMissionFocus.id);
            if (mission.missionType === "preparation") {
                baseDuration = Missions.PREP_DURATION;
            } else if (mission.missionType === "BugFixing") {
                baseDuration = Missions.FINISH_DURATION;
            } else if (mission.percentage !== undefined) {
                baseDuration = (3 * Missions.BASE_DURATION / 100) * mission.percentage;
            } else {
                baseDuration = Missions.BASE_DURATION;
            }
        } else if (featureOrMissionFocus.type === "feature") {
            var feature = General.getFeature(featureOrMissionFocus.id);
            baseDuration = Research.getDuration(feature);
        }
        return baseDuration * this.getGameSizeDurationFactor(game.gameSize) * General.getMultiPlatformDurationFactor(game);
    };

    /**
     * Lấy hệ số thời gian dựa trên kích thước game.
     * @param {string} gameSize - Kích thước game ("small", "medium", "large", "aaa").
     * @returns {number} Hệ số thời gian.
     */
    General.getGameSizeDurationFactor = function (gameSize) {
        if (gameSize === "small") return GameFlags.SMALL_GAME_DURATION_FACTOR;
        if (gameSize === "medium") return GameFlags.MEDIUM_GAME_DURATION_FACTOR;
        if (gameSize === "large") return GameFlags.LARGE_GAME_DURATION_FACTOR;
        if (gameSize === "aaa") return GameFlags.AAA_GAME_DURATION_FACTOR;
        return 1;
    };

    /**
     * Lấy hệ số thời gian khi phát triển đa nền tảng.
     * @param {Game} game - Đối tượng game.
     * @param {boolean} [ignoreOptimization=false] - Nếu true, bỏ qua tối ưu hóa đa nền tảng.
     * @returns {number} Hệ số thời gian.
     */
    General.getMultiPlatformDurationFactor = function (game, ignoreOptimization) {
        var platforms = game.platforms;
        var factor = 1;
        var optimizationFactor = 1;
        if (game.engine && ignoreOptimization === undefined && game.engine.parts.first(function (part) { return part.id === "MultiPlatformOptimized"; })) {
            optimizationFactor = 0.5; // Tối ưu hóa giảm thời gian
        }
        for (var i = 1; i < platforms.length; i++) {
            factor *= (1 + (GameFlags.MULTIPLATFORM_DURATION_FACTOR - 1) * optimizationFactor);
        }
        return factor;
    };

    /**
     * Lấy hệ số chi phí khi phát triển đa nền tảng.
     * @param {Game} game - Đối tượng game.
     * @returns {number} Hệ số chi phí.
     */
    General.getMultiPlatformCostFactor = function (game) {
        if (game.platforms.length <= 1) {
            return 1;
        }
        var optimizationFactor = 1;
        if (game.engine && game.engine.parts.first(function (part) { return part.id === "MultiPlatformOptimized"; })) {
            optimizationFactor = 0.5;
        }
        // Chi phí tăng theo thời gian, nhưng tối ưu hóa có thể giảm
        return General.getMultiPlatformDurationFactor(game, !0) * optimizationFactor;
    };

    /**
     * Lấy hệ số điểm dựa trên kích thước game.
     * @param {Game} game - Đối tượng game.
     * @returns {number} Hệ số điểm.
     */
    General.getGameSizePointsFactor = function (game) {
        if (game.gameSize === "small") return GameFlags.SMALL_GAME_POINTS_FACTOR;
        if (game.gameSize === "medium") return GameFlags.MEDIUM_GAME_POINTS_FACTOR;
        if (game.gameSize === "large") return GameFlags.LARGE_GAME_POINTS_FACTOR;
        if (game.gameSize === "aaa") return GameFlags.AAA_GAME_POINTS_FACTOR;
        return 1;
    };

    /**
     * Lấy đối tượng feature từ ID của nó.
     * @param {string} featureId - ID của feature.
     * @returns {Object|null} Đối tượng feature hoặc null nếu không tìm thấy.
     */
    General.getFeature = function (featureId) {
        return Research.getAllItems().first(function (feature) {
            return feature.id === featureId;
        });
    };

    /**
     * Lấy đối tượng mission từ ID của nó.
     * @param {string} missionId - ID của mission.
     * @returns {Object|null} Đối tượng mission hoặc null nếu không tìm thấy.
     */
    General.getMission = function (missionId) {
        return Missions.getAllMissions().first(function (mission) {
            return mission.id === missionId;
        });
    };

    /**
     * Xử lý khi một thông báo đã được hiển thị và người dùng tương tác (nhấn nút).
     * @param {Notification} notification - Đối tượng thông báo.
     * @param {number} [selectedOptionIndex] - Index của lựa chọn mà người dùng đã chọn (nếu có).
     */
    General.notificationShown = function (notification, selectedOptionIndex) {
        notification.applyActions(GameManager.company); // Áp dụng các hành động của thông báo
        if (selectedOptionIndex !== undefined) {
            General.broadCastNofificationComplete(notification, selectedOptionIndex);
        }
    };

    // Mảng lưu trữ các nguồn có thể tạo ra thông báo (ví dụ: Media, DecisionNotifications)
    var notificationSources = [];
    /**
     * Đăng ký một đối tượng làm nguồn thông báo.
     * @param {Object} source - Đối tượng nguồn.
     */
    General.registerAsNotificationSource = function (source) {
        notificationSources.push(source);
    };

    /**
     * Thông báo cho các nguồn đã đăng ký rằng một thông báo đã hoàn thành.
     * Điều này cho phép nguồn đó thực hiện các hành động callback tương ứng.
     * @param {Notification} notification - Đối tượng thông báo đã hoàn thành.
     * @param {number} selectedOptionIndex - Index của lựa chọn người dùng.
     */
    General.broadCastNofificationComplete = function (notification, selectedOptionIndex) {
        if (notification.sourceId) {
            for (var i = 0; i < notificationSources.length; i++) {
                var notificationObject = notificationSources[i].getAllNotificationsObjects().first(function (obj) {
                    return obj.id === notification.sourceId;
                });
                if (notificationObject) {
                    if (notificationObject.complete) {
                        notificationObject.complete(selectedOptionIndex);
                    }
                    break;
                }
            }
        }
    };

    /**
     * Lấy danh sách các feature có sẵn để phát triển console.
     * @returns {Array<Object>} Danh sách các feature.
     */
    General.getAvailableFeaturesForConsole = function () {
        return General.getAvailableEngineParts(GameManager.company).filter(function (part) {
            return part.consolePart; // Chỉ lấy các phần dành cho console
        });
    };

    /**
     * Lấy danh sách các dự án lớn (R&D, Hardware) có sẵn để nghiên cứu.
     * @param {Company} company - Đối tượng công ty.
     * @param {number} targetZone - Khu vực (0 cho Hardware, 2 cho R&D).
     * @returns {Array<Object>} Danh sách các dự án.
     */
    General.getAvailableProjects = function (company, targetZone) {
        return Research.bigProjects.filter(function (project) {
            return project.targetZone === targetZone && project.canResearch(company);
        });
    };

    /**
     * Lấy thứ tự (ngẫu nhiên hoặc cố định) của các topic game.
     * @param {Company} company - Đối tượng công ty (dùng seed để ngẫu nhiên hóa).
     * @returns {Array<Topic>} Mảng các topic đã được sắp xếp.
     */
    General.getTopicOrder = function (company) {
        if (!GameFlags.RANDOMIZE_TOPICS) {
            return Topics.topics;
        }
        var allTopics = Topics.topics;
        var orderedTopics = allTopics.slice(0, 0); // Tạo mảng rỗng
        var remainingTopics = allTopics.slice(0); // Sao chép mảng
        var rng = new MersenneTwister(company.seed); // Bộ sinh số ngẫu nhiên với seed

        while (remainingTopics.length > 0) {
            var randomIndex = Math.floor(rng.random() * remainingTopics.length);
            orderedTopics.push(remainingTopics[randomIndex]);
            remainingTopics.splice(randomIndex, 1);
        }
        return orderedTopics;
    };

    /**
     * Lấy danh sách các topic có sẵn để nghiên cứu.
     * @param {Company} company - Đối tượng công ty.
     * @returns {Array<Topic>} Danh sách các topic có thể nghiên cứu.
     */
    General.getTopicsAvailableForResearch = function (company) {
        var availableTopics = [];
        var orderedTopics = General.getTopicOrder(company);

        for (var i = 0; i < orderedTopics.length; i++) {
            var topic = orderedTopics[i];
            var isResearched = company.topics.indexOf(topic) !== -1;
            var isBeingResearched = GameManager.currentResearches.filter(function (research) {
                return research.topicId === topic.id;
            }).length > 0;

            if (!isResearched && !isBeingResearched) {
                if (availableTopics.length < Research.TOPICS_VISIBLE) { // Giới hạn số topic hiển thị
                    availableTopics.push(topic);
                }
            }
        }
        return availableTopics;
    };

    /**
     * Chuyển đổi chuỗi đối tượng người chơi thành index.
     * @param {string} audienceString - Chuỗi đối tượng ("young", "everyone", "mature").
     * @returns {number} Index tương ứng (0, 1, 2) hoặc -1 nếu không hợp lệ.
     */
    General.getAudienceWeightinIndex = function (audienceString) {
        if (audienceString === "young") return 0;
        if (audienceString === "everyone") return 1;
        if (audienceString === "mature") return 2;
        return -1;
    };

    /**
     * Lấy hệ số phù hợp của đối tượng người chơi cho một mảng hệ số.
     * @param {Array<number>} audienceWeightingsArray - Mảng hệ số (ví dụ: [0.8, 1, 0.9]).
     * @param {string} audienceString - Chuỗi đối tượng ("young", "everyone", "mature").
     * @returns {number} Hệ số phù hợp.
     */
    General.getAudienceWeighting = function (audienceWeightingsArray, audienceString) {
        if (audienceString === undefined || audienceWeightingsArray === undefined) {
            return 1; // Mặc định
        }
        if (audienceString === "young") return audienceWeightingsArray[0];
        if (audienceString === "everyone") return audienceWeightingsArray[1];
        if (audienceString === "mature") return audienceWeightingsArray[2];
        throw "unknown audience: " + audienceString; // Sửa lỗi chính tả genre -> audienceString
    };

    /**
     * Lấy danh sách các thể loại game có sẵn (có thể bị giới hạn bởi nghiên cứu).
     * @param {Company} company - Đối tượng công ty.
     * @returns {Array<GameGenre>} Danh sách các thể loại.
     */
    General.getAvailableGenres = function (company) {
        var allGenres = GameGenre.getAll();
        if (company.researchCompleted.indexOf(Research.CasualGames) === -1) {
            allGenres = allGenres.filter(function (genre) {
                return genre.id !== "Casual";
            });
        }
        return allGenres;
    };

    /**
     * Lấy nhãn hiển thị cho kích thước game.
     * @param {string} gameSizeString - Chuỗi kích thước game ("small", "medium", "large", "aaa").
     * @returns {string} Nhãn hiển thị.
     */
    General.getGameSizeLabel = function (gameSizeString) {
        switch (gameSizeString) {
            case "aaa": return "AAA".localize();
            case "large": return "Large".localize().toLowerCase();
            case "medium": return "Medium".localize().toLowerCase();
            default: return "Small".localize().toLowerCase();
        }
    };

    /**
     * Lấy nhãn hiển thị cho đối tượng người chơi.
     * @param {string} audienceString - Chuỗi đối tượng ("young", "everyone", "mature").
     * @returns {string} Nhãn hiển thị.
     */
    General.getAudienceLabel = function (audienceString) {
        switch (audienceString) {
            case "young": return "Young".localize("audience category");
            case "mature": return "Mature".localize("audience category");
            default:
            case "everyone": return "Everyone".localize("audience category");
        }
    };

    /**
     * Lấy nhãn viết tắt cho đối tượng người chơi (dùng cho nút bấm).
     * @param {string} audienceString - Chuỗi đối tượng ("young", "everyone", "mature").
     * @returns {string} Nhãn viết tắt.
     */
    General.getShortAudienceLabel = function (audienceString) {
        switch (audienceString) {
            case "young": return "Y".localize("target audience button content, Y as in young");
            case "mature": return "M".localize("target audience button content, M as in mature");
            default:
            case "everyone": return "E".localize("target audience button content, E as in everyone");
        }
    };

    /**
     * Lấy kích thước đội tối ưu cho một game dựa trên kích thước game.
     * @param {Game} game - Đối tượng game.
     * @returns {number} Kích thước đội tối ưu.
     */
    General.getOptimalTeamSize = function (game) {
        var teamSize;
        switch (game.gameSize) {
            case "aaa": teamSize = 6; break;
            case "large": teamSize = 5; break;
            case "medium": teamSize = 3; break;
            default: teamSize = 1;
        }
        return teamSize;
    };

    // Mảng lưu trữ điểm cơ bản cho mỗi level công nghệ của game
    var basePointsPerTechLevel = [2, 5, 7, 10, 15, 20, 30, 40];
    /**
     * Lấy điểm cơ bản của game dựa trên level công nghệ của nó.
     * @param {Game} game - Đối tượng game.
     * @returns {number} Điểm cơ bản của game.
     */
    General.getGameBasePoints = function (game) {
        var techLevelFractional = game.flags.techLevel;
        if (!techLevelFractional) {
            techLevelFractional = 0;
        }
        var techLevelInteger = Math.floor(techLevelFractional);
        var techLevelDecimalPart = techLevelFractional - Math.floor(techLevelFractional);

        var basePoints = basePointsPerTechLevel[techLevelInteger];
        // Nội suy tuyến tính nếu có phần thập phân
        if (techLevelDecimalPart !== 0 && techLevelInteger + 1 < basePointsPerTechLevel.length) {
            basePoints += (basePointsPerTechLevel[techLevelInteger + 1] - basePoints) * techLevelDecimalPart;
        }
        return basePoints;
    };

    /**
     * Ước tính số tuần còn lại để hoàn thành game.
     * @param {Game} game - Đối tượng game.
     * @returns {number} Số tuần ước tính.
     */
    General.getApproxWeeksToCompletion = function (game) {
        var progressFractional = GameManager.getCurrentGameProgress(); // % (0-1)
        // Tổng thời gian = thời gian cơ bản * số nhiệm vụ * hệ số kích thước * hệ số đa nền tảng
        // Thời gian còn lại = Tổng thời gian * (1 - tiến độ hiện tại)
        // Chuyển sang tuần
        return Missions.BASE_DURATION * GameFlags.MAIN_MISSIONS_PER_GAME *
            General.getGameSizeDurationFactor(game.gameSize) *
            General.getMultiPlatformDurationFactor(game) *
            (1 - progressFractional) / // Sửa lại: phải là (1 - progress) để ra thời gian còn lại
            (1E3 * GameManager.SECONDS_PER_WEEK);
    };
})();