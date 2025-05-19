"use strict";

// Định nghĩa các hằng số cơ bản cho việc tính toán điểm, thời gian của các nhiệm vụ (Missions)
var Missions = {
    BASE_POINTS: 5, // Điểm cơ bản cho một nhiệm vụ phát triển
    BASE_RESEARCH_POINTS: 1.5, // Điểm nghiên cứu cơ bản
    BASE_DURATION: 1800, // Thời gian cơ bản cho một nhiệm vụ phát triển (có thể là ms hoặc đơn vị tick)
    BASE_ENGINE_DURATION: 1500, // Thời gian cơ bản cho việc phát triển engine
    PREP_DURATION: 1E3, // Thời gian cho giai đoạn chuẩn bị (1000)
    FINISH_DURATION: 1E3 // Thời gian cho giai đoạn hoàn thiện (1000)
};

(function () {
    /**
     * Tính toán hệ số chung cho một nhiệm vụ (mission) dựa trên kinh nghiệm và sự phù hợp thể loại.
     * @param {object} companyData - Dữ liệu công ty của người chơi.
     * @param {object} missionFocus - Đối tượng nhiệm vụ đang được tập trung, chứa id của nhiệm vụ.
     * @returns {number} Hệ số tổng hợp.
     */
    Missions.getGeneralFactor = function (companyData, missionFocus) {
        var missionDetails = General.getMission(missionFocus.id); // Lấy thông tin chi tiết của nhiệm vụ
        // Nếu là nhiệm vụ chuẩn bị hoặc sửa lỗi, hệ số là 1 (không bị ảnh hưởng bởi các yếu tố khác)
        if ("preparation" === missionDetails.type || "BugFixing" === missionDetails.type) return 1;

        var levelBonusFactor = LevelCalculator.getLevelBonusFactor(missionDetails.experience); // Hệ số thưởng dựa trên kinh nghiệm của nhiệm vụ
        // Hệ số cuối cùng là tích của sự phù hợp thể loại và thưởng kinh nghiệm
        return Missions.getGenreWeighting(missionDetails, companyData.currentGame, companyData.currentGame) * levelBonusFactor;
    };

    /**
     * Lấy hệ số điều chỉnh nếu một nhiệm vụ được lặp lại nhiều lần trong cùng một game.
     * @param {object} companyData - Dữ liệu công ty.
     * @param {object} mission - Đối tượng nhiệm vụ.
     * @returns {number} Hệ số điều chỉnh (1 nếu chưa làm, 0.7 nếu làm 1 lần, 0.3 nếu làm >= 2 lần).
     */
    Missions.getRepeatMissionModifier = function (companyData, mission) {
        var repeatModifier = 1; // Mặc định không giảm
        var currentGame = companyData.currentGame;
        // Nếu game hiện tại có log các tính năng đã làm
        if (currentGame.featureLog) {
            var timesDone = currentGame.featureLog.count(function (logEntry) {
                return logEntry.id === mission.id; // Đếm số lần nhiệm vụ này đã xuất hiện trong log
            });
            if (1 === timesDone) repeatModifier = 0.7; // Giảm nếu làm lần thứ 2
            else if (2 <= timesDone) repeatModifier = 0.3; // Giảm mạnh nếu làm từ lần thứ 3 trở đi
        }
        return repeatModifier;
    };

    /**
     * Thực thi một nhiệm vụ quảng bá (publishing/marketing).
     * Tính toán hype được tạo ra và trừ chi phí.
     * @param {object} companyData - Dữ liệu công ty.
     * @param {object} marketingMission - Đối tượng nhiệm vụ quảng bá.
     */
    Missions.executePublishingMission = function (companyData, marketingMission) {
        var currentGame = companyData.currentGame;
        var missionDetails = General.getMission(marketingMission.id);

        var baseContributionFactor = 1; // Hệ số đóng góp cơ bản
        var repeatModifier = Missions.getRepeatMissionModifier(companyData, marketingMission);
        baseContributionFactor = baseContributionFactor * repeatModifier; // Áp dụng hệ số lặp lại

        var gameProgress = GameManager.getCurrentGameProgress();
        var progressDifference = Math.abs(gameProgress - 0.7); // Độ chênh lệch so với mốc 70% tiến độ (có thể là mốc tối ưu để quảng bá)
        baseContributionFactor = baseContributionFactor - progressDifference / 2; // Giảm hệ số nếu quảng bá quá sớm hoặc quá muộn

        // Đoạn này có vẻ không làm gì vì kết quả count không được sử dụng
        currentGame.featureLog.count(function (logEntry) {
            return "marketing" === logEntry.type;
        });

        var missionLevel = LevelCalculator.getMissionLevel(missionDetails); // Lấy level hiện tại của nhiệm vụ quảng bá
        baseContributionFactor *= missionDetails.marketingFactor / 5 * missionLevel; // Điều chỉnh hệ số đóng góp dựa trên yếu tố marketing và level nhiệm vụ

        // Tính điểm hype được tạo ra
        var calculatedHypePoints = 100 * baseContributionFactor * GameGenre.getGenreWeighting(currentGame.topic.genreWeightings, currentGame.genre, currentGame.secondGenre);
        var finalHypePoints = Math.floor(0.9 * calculatedHypePoints + 0.1 * calculatedHypePoints * companyData.getRandom()); // Thêm yếu tố ngẫu nhiên

        // Nếu là game sequel, điều chỉnh hype dựa trên các yếu tố của sequel
        if (currentGame.sequelTo) {
            var sequelHypeBonus = 0.2 * finalHypePoints;
            if (currentGame.flags.sequelsTooClose) sequelHypeBonus *= -1; // Phạt nếu ra sequel quá sớm
            if (currentGame.flags.usesSameEngineAsSequel) { // Phạt nếu dùng engine cũ
                sequelHypeBonus = 0 > sequelHypeBonus ? 2 * sequelHypeBonus : sequelHypeBonus / 2;
            } else if (currentGame.flags.hasBetterEngineThanSequel) { // Thưởng nếu dùng engine tốt hơn
                sequelHypeBonus = 0 > sequelHypeBonus ? -1 * sequelHypeBonus : 1.2 * sequelHypeBonus;
            }
            finalHypePoints += sequelHypeBonus;
        }

        currentGame.hypePoints += finalHypePoints; // Cộng hype vào game
        currentGame.costs += missionDetails.cost; // Cộng chi phí vào game
        companyData.adjustCash(-missionDetails.cost, missionDetails.name); // Trừ tiền của công ty

        // Ghi log (nếu debug)
        "game hype: {0}. delta: {1}. factor contribution of mission: {2}".format(currentGame.hypePoints, finalHypePoints, baseContributionFactor).log();
        currentGame.featureLog.push(missionDetails); // Thêm nhiệm vụ quảng bá vào log của game
    };

    /**
     * Lấy các giá trị ghi đè (override) cho trọng số nhiệm vụ dựa trên chủ đề (topic) của game.
     * @param {object} missionInput - Thông tin nhiệm vụ (có thể là id hoặc object đầy đủ).
     * @param {object} gameTopic - Chủ đề của game hiện tại.
     * @returns {Array|undefined} Mảng các giá trị ghi đè, hoặc undefined nếu không có.
     */
    Missions.getTopicMissionOverrides = function (missionInput, gameTopic) {
        if (gameTopic.missionOverrides) {
            var missionDetails = missionInput;
            // Nếu missionInput chỉ là id, tìm đối tượng mission đầy đủ
            if (!missionDetails.genreWeightings) {
                missionDetails = Missions.getAllMissions().first(function (currentMission) {
                    return currentMission.id === missionDetails.id;
                });
            }
            var topicSpecificOverrides = [];
            var devMissionIndex = Missions.DevMissions.indexOf(missionDetails); // Tìm index của mission trong danh sách các dev mission
            if (-1 != devMissionIndex) {
                var topicOverridesArray = gameTopic.missionOverrides; // game là biến global? Nên là gameTopic
                for (var overrideIndex = 0; overrideIndex < topicOverridesArray.length; overrideIndex++) {
                    topicSpecificOverrides.push(topicOverridesArray[overrideIndex][devMissionIndex]);
                }
            }
            return topicSpecificOverrides;
        }
        // Trả về undefined nếu không có overrides (mặc định của hàm)
    };

    /**
     * Tính toán trọng số thể loại (genre weighting) cho một nhiệm vụ cụ thể trong một game cụ thể.
     * Có tính đến các override từ chủ đề (topic).
     * @param {object} missionInput - Nhiệm vụ cần tính trọng số.
     * @param {object} currentGame - Game hiện tại.
     * @returns {number} Trọng số thể loại đã điều chỉnh.
     */
    Missions.getGenreWeighting = function (missionInput, currentGame) {
        var primaryGenre = currentGame.genre;
        var secondaryGenre = currentGame.secondGenre;
        var missionDetails = missionInput;

        // Nếu missionInput chỉ là id hoặc không có genreWeightings, tìm đối tượng mission đầy đủ
        if (!missionDetails.genreWeightings) {
            missionDetails = Missions.getAllMissions().first(function (currentMission) {
                return currentMission.id === missionDetails.id;
            });
        }

        var genreWeightings = missionDetails.genreWeightings.slice(); // Tạo bản sao để không thay đổi mảng gốc

        // Nếu chủ đề của game có định nghĩa override cho trọng số nhiệm vụ
        if (currentGame.topic.missionOverrides) {
            var devMissionIndex = Missions.DevMissions.indexOf(missionDetails); // Tìm index của mission trong danh sách các dev mission
            if (-1 != devMissionIndex) {
                var topicOverridesArray = currentGame.topic.missionOverrides;
                for (var overrideIndex = 0; overrideIndex < topicOverridesArray.length; overrideIndex++) {
                    var overrideValue = topicOverridesArray[overrideIndex][devMissionIndex];
                    if (overrideValue) { // Nếu có giá trị override
                        genreWeightings[overrideIndex] = overrideValue;
                    }
                }
            }
        }
        // Tính trọng số cuối cùng dựa trên thể loại chính, phụ và mảng trọng số đã điều chỉnh
        return GameGenre.getGenreWeighting(genreWeightings, primaryGenre, secondaryGenre);
    };

    /**
     * Lấy thông tin chi tiết của một nhiệm vụ dựa trên ID.
     * @param {string} missionId - ID của nhiệm vụ.
     * @returns {object|null} Đối tượng nhiệm vụ hoặc null nếu không tìm thấy.
     */
    Missions.getMissionWithId = function (missionId) {
        return Missions.getAllMissions().first(function (mission) {
            return mission.id === missionId;
        });
    };

    // Định nghĩa các nhiệm vụ cho từng giai đoạn phát triển
    Missions.Stage1Missions = [{
        id: "Engine",
        name: "Engine".localize(),
        description: "Improves the game engine.",
        technologyFactor: 0.8, // Hệ số đóng góp vào điểm Technology
        designFactor: 0.2,     // Hệ số đóng góp vào điểm Design
        genreWeightings: [1, 0.7, 0.7, 0.9, 0.9, 0.6, 0.6, 1.0, 0.9, 0.9, 1.0], // Trọng số cho từng thể loại [Action, Adventure, RPG, Simulation, Strategy, Casual, Visual Novel, Sandbox, MOBA, Battle Royale, Racing]
        percentage: 100 / 3    // Tỷ lệ phần trăm đóng góp vào giai đoạn (nếu có 3 nhiệm vụ thì mỗi cái 33.33%)
    }, {
        id: "Gameplay",
        name: "Gameplay".localize(),
        description: "Improves the gameplay.",
        technologyFactor: 0.2,
        designFactor: 0.8,
        genreWeightings: [0.9, 0.8, 0.9, 1, 1, 1, 0.7, 0.9, 1.0, 1.0, 0.9],
        percentage: 100 / 3
    }, {
        id: "Story/Quests",
        name: "Story/Quests".localize(),
        description: "Work on the story and quests.",
        technologyFactor: 0.2,
        designFactor: 0.8,
        genreWeightings: [0.8, 1, 1, 0.7, 0.8, 0.8, 1.0, 0.8, 0.7, 0.7, 0.6],
        percentage: 100 / 3
    }];

    Missions.Stage2Missions = [{
        id: "Dialogs",
        name: "Dialogs".localize(),
        description: "Write dialogs and user interface text.",
        technologyFactor: 0.1,
        designFactor: 0.9,
        genreWeightings: [0.8, 1, 1, 0.7, 0.8, 0.8, 1.0, 0.7, 0.7, 0.7, 0.6],
        percentage: 100 / 3
    }, {
        id: "Level Design",
        name: "Level Design".localize(),
        description: "Focus on level design and the structure of the game.",
        technologyFactor: 0.5,
        designFactor: 0.5,
        genreWeightings: [1, 1, 1, 0.8, 1, 0.9, 0.8, 1.0, 0.9, 0.9, 1.0],
        percentage: 100 / 3
    }, {
        id: "AI",
        name: "AI".localize(),
        description: "Improves the artificial intelligence.",
        technologyFactor: 0.8,
        designFactor: 0.2,
        genreWeightings: [1, 0.7, 0.8, 1, 1, 0.7, 0.5, 0.8, 1.0, 1.0, 0.9],
        percentage: 100 / 3
    }];

    Missions.Stage3Missions = [{
        id: "World Design",
        name: "World Design".localize(),
        description: "Focus on the game world and the creation of an atmosphere.",
        technologyFactor: 0.3,
        designFactor: 0.7,
        genreWeightings: [0.9, 1, 1, 0.9, 0.8, 0.9, 1.0, 1.0, 0.8, 0.9, 0.8],
        percentage: 100 / 3
    }, {
        id: "Graphic",
        name: "Graphic".localize(),
        description: "Improves the graphics and the art style.",
        technologyFactor: 0.4,
        designFactor: 0.6,
        genreWeightings: [1, 1, 0.9, 1, 0.9, 1, 1.0, 0.9, 0.9, 0.9, 1.0],
        percentage: 100 / 3
    }, {
        id: "Sound",
        name: "Sound".localize(),
        description: "Improves the sound design (music/voice/sound effects).",
        technologyFactor: 0.5,
        designFactor: 0.5,
        genreWeightings: [1, 1, 0.9, 0.8, 0.8, 1, 1.0, 0.8, 0.8, 0.9, 1.0],
        percentage: 100 / 3
    }];

    // Gộp tất cả các nhiệm vụ phát triển (development missions)
    Missions.DevMissions = Missions.Stage1Missions.concat(Missions.Stage2Missions.concat(Missions.Stage3Missions));

    // Định nghĩa các nhiệm vụ quảng bá
    Missions.MarketingMissions = [{
        id: "MagazineMarketing",
        name: "Advertise in magazines".localize(),
        shortName: "Magazines".localize("short name"),
        description: "Advertise in gaming magazines to get the game well known before it hits the shelves.".localize(),
        marketingFactor: 0.5, // Hệ số hiệu quả quảng bá
        cost: 5E4             // Chi phí
    }, {
        id: "DemosMarketing",
        name: "Magazines & Demos".localize(),
        shortName: "Magazines & Demos".localize("short name"),
        description: "Advertise in gaming magazines and distribute demos of the game to give players an opportunity to try the game.".localize(),
        marketingFactor: 1,
        cost: 15E4
    }, {
        id: "Marketing Campaign",
        name: "Small Marketing Campaign".localize(),
        shortName: "Small Campaign".localize("short name"),
        description: "Start a global marketing campaign including magazine ads, demos and interviews.".localize(),
        marketingFactor: 1.5,
        cost: 5E5
    }, {
        id: "Marketing CampaignXL",
        name: "Large Marketing Campaign".localize(),
        shortName: "Large Campaign".localize("short name"),
        description: "Start a global marketing campaign to promote the game far and wide. Organize exclusive reviews, behind the scenes reports, TV trailers and more.".localize(),
        marketingFactor: 2,
        cost: 2E6
    }];

    // Nhiệm vụ đặc biệt cho giai đoạn chuẩn bị
    Missions.PreparationMission = {
        id: "preparation",
        missionType: "preparation" // Loại nhiệm vụ đặc biệt
    };

    // Nhiệm vụ đặc biệt cho giai đoạn sửa lỗi
    Missions.BugFixingMission = {
        id: "BugFixing",
        missionType: "BugFixing" // Loại nhiệm vụ đặc biệt
    };

    // Khởi tạo các thuộc tính chung cho các nhiệm vụ trong từng giai đoạn
    Missions.Stage1Missions.forEach(function (mission) {
        mission.missionType = "dev"; // Tất cả đều là nhiệm vụ phát triển
        mission.level = 1;           // Level ban đầu
        mission.experience = 0;      // Kinh nghiệm ban đầu
    });
    Missions.Stage2Missions.forEach(function (mission) {
        mission.missionType = "dev";
        mission.level = 1;
        mission.experience = 0;
    });
    Missions.Stage3Missions.forEach(function (mission) {
        mission.missionType = "dev";
        mission.level = 1;
        mission.experience = 0;
    });
    Missions.MarketingMissions.forEach(function (mission) {
        mission.missionType = "marketing"; // Tất cả đều là nhiệm vụ quảng bá
        mission.level = 1;
        mission.experience = 0;
    });

    /**
     * Trả về một mảng chứa tất cả các loại nhiệm vụ có trong game.
     * @returns {Array} Mảng các đối tượng nhiệm vụ.
     */
    Missions.getAllMissions = function () {
        return Missions.Stage1Missions.concat(
            Missions.Stage2Missions.concat(
                Missions.Stage3Missions.concat(
                    Missions.MarketingMissions
                ).concat([
                    Missions.PreparationMission,
                    Missions.BugFixingMission
                ])
            )
        );
    };
})();