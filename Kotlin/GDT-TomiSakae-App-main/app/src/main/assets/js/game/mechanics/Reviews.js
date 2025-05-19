"use strict";
var Reviews = {}; // Khởi tạo namespace Reviews
(function () {
    // Hàm tính toán điểm số cao nhất kỳ vọng mà công ty có thể đạt được cho một game mới.
    // Dựa trên điểm số cao nhất trước đó, sự tăng trưởng, và thời gian kể từ game đạt điểm cao nhất đó.
    var calculateExpectedTopScore = function (companyData) {
        if (companyData.lastTopScore) { // Nếu công ty đã từng có game đạt điểm cao nhất
            // Hệ số nhân dựa trên năm hiện tại của game, game ở giai đoạn đầu dễ đạt điểm cao hơn
            var yearMultiplier = 6 >= companyData.getCurrentDate().year ? 1.15 : 23 < companyData.getCurrentDate().year ? 1.1 : 1.2;
            // Điểm số cơ sở: hoặc là điểm cao nhất trước đó, hoặc 20 nếu chưa có
            var previousOrBaseScore = companyData.previousTopScore ? companyData.previousTopScore : 20;
            // Điểm số kỳ vọng mới dựa trên điểm cao nhất lần cuối và mức tăng trưởng dự kiến
            var expectedScore = Math.floor(companyData.lastTopScore + companyData.lastTopScoreIncrease * yearMultiplier);
            // Số tuần cần thiết để "đánh bại" điểm số cao nhất trước đó, phụ thuộc vào kích thước game
            var weeksToBeatScore = 6 + 9 * General.getGameSizeDurationFactor(companyData.lastTopScoreGameSize);

            // Nếu chưa có thông tin về tuần đạt điểm cao nhất, hoặc đã qua khoảng thời gian cần thiết
            if (!companyData.lastTopScoreWeek || companyData.currentWeek >= companyData.lastTopScoreWeek + weeksToBeatScore) {
                return expectedScore; // Trả về điểm kỳ vọng đã tính
            } else {
                // Nếu chưa đủ thời gian, tính điểm kỳ vọng nội suy dựa trên thời gian đã trôi qua
                return Math.floor(previousOrBaseScore + (expectedScore - previousOrBaseScore) * (companyData.currentWeek - companyData.lastTopScoreWeek) / weeksToBeatScore);
            }
        }
        return 20; // Nếu chưa có game nào đạt điểm cao, điểm kỳ vọng cơ sở là 20
    };

    // Hàm cập nhật thông tin điểm số cao nhất của công ty khi một game mới đạt được điểm cao.
    var updateCompanyTopScore = function (companyData, newScoreAchieved) {
        // Chỉ cập nhật nếu chưa có điểm cao nhất, hoặc game mới có điểm cao hơn điểm cao nhất hiện tại
        if (!companyData.lastTopScore || companyData.lastTopScore < newScoreAchieved) {
            var expectedTopScore = calculateExpectedTopScore(companyData); // Tính điểm cao nhất kỳ vọng
            if (companyData.lastTopScore) {
                // Nếu đã có điểm cao nhất, tính mức tăng trưởng mới
                companyData.lastTopScoreIncrease = Math.max(newScoreAchieved - companyData.lastTopScore, 0.1 * expectedTopScore);
                // Giới hạn mức tăng trưởng nếu công ty đã ở level cao
                if (2 <= companyData.currentLevel && companyData.lastTopScoreIncrease > 0.2 * companyData.lastTopScore) {
                    companyData.lastTopScoreIncrease = 0.2 * companyData.lastTopScore;
                }
            } else {
                // Nếu chưa có điểm cao nhất, mức tăng trưởng dựa trên chênh lệch với điểm kỳ vọng
                companyData.lastTopScoreIncrease = Math.max(newScoreAchieved - expectedTopScore, 0.1 * expectedTopScore);
            }

            // Cập nhật điểm cao nhất "trước đó" (dùng để nội suy)
            var baseForPreviousScore = 20 < companyData.lastTopScore ? companyData.lastTopScore : 20;
            companyData.previousTopScore = baseForPreviousScore > expectedTopScore ? expectedTopScore : baseForPreviousScore;
            companyData.previousTopScore += Math.abs((newScoreAchieved - companyData.previousTopScore) / 3); // Điều chỉnh nhẹ
            if (companyData.previousTopScore > newScoreAchieved) {
                companyData.previousTopScore = newScoreAchieved; // Không để vượt quá điểm mới đạt được
            }

            // Cập nhật điểm số cao nhất mới và thông tin liên quan
            companyData.lastTopScore = newScoreAchieved;
            companyData.lastTopScoreWeek = companyData.currentWeek;
            companyData.lastTopScoreGameSize = companyData.currentGame.gameSize;
        }
    };

    // Hàm xử lý khi game đạt thành tựu về điểm số cao.
    var processTopScoreAchievement = function (companyData, achievedScore) {
        companyData.topScoreAchievements++; // Tăng số lần đạt thành tựu điểm cao
        companyData.currentGame.flags.topScore = true; // Đánh dấu game này đạt điểm cao
        updateCompanyTopScore(companyData, achievedScore); // Cập nhật điểm số cao nhất của công ty
    };

    // Hàm chính để bắt đầu quá trình review game.
    Reviews.reviewGame = function (companyData) {
        var currentGame = companyData.currentGame;
        var reviewResults = Reviews.rateGame(companyData); // Gọi hàm tính điểm và lấy kết quả review
        var weeksUntilReviews = currentGame.releaseWeek - companyData.currentWeek; // Thời gian còn lại cho đến khi review xuất hiện

        companyData.currentGame.reviews = reviewResults; // Lưu kết quả review vào game

        // Tạo thông báo về việc review sắp có
        var reviewNotificationText = "The first reviews for our newly released game, {0}, came in!".localize().format(companyData.currentGame.title);
        companyData.notifications.push(new Notification("Game review".localize("heading"), reviewNotificationText, "OK".localize(), weeksUntilReviews + 0.3, {
            type: NotificationType.AutoPopup
        }));
        // Thông báo để UI hiển thị màn hình review chi tiết
        companyData.notifications.push(new Notification("{Reviews}", null, null, weeksUntilReviews + 0.3));

        // Nếu đây là game đầu tiên, tạo thêm thông báo đặc biệt
        if (0 === companyData.gameLog.length) {
            companyData.notifications.push(new Notification("News".localize("heading"),
                Media.createFirstGameStory(companyData), "OK".localize(), weeksUntilReviews + 0.7, {
                type: NotificationType.CompanyMilestones,
                previewImage: "./images/notificationIcons/icon_notification_reviews.png"
            }));
        }
        // Nếu game này là lặp lại topic/genre với game trước đó, tạo thông báo
        if (currentGame.flags.sameGenreTopic) {
            var repeatStoryNotification = Media.createSameGenreTopicStory(companyData, currentGame);
            if (repeatStoryNotification) {
                repeatStoryNotification.weeksUntilFired = weeksUntilReviews + 1;
                companyData.notifications.push(repeatStoryNotification);
            }
        }
    };

    // Hàm tính toán điểm số tối đa có thể đạt được cho một game, dùng để làm mốc so sánh.
    // Điểm này phụ thuộc vào nhiều yếu tố như kích thước game, level công ty, số fan, chuyên môn nhân viên và tech level của game.
    var calculateMaxPossibleScore = function (companyData, gameData) {
        // Đếm số nhân viên có chuyên môn phù hợp với các nhiệm vụ quan trọng của game
        var expertStaffCount = Missions.getAllMissions().filter(function (mission) {
            return "dev" === mission.missionType && 0.9 <= Missions.getGenreWeighting(mission, gameData);
        }).count(function (missionFocus) {
            if (gameData.flags.featureResponsibility.hasOwnProperty(missionFocus.id)) {
                var responsibleStaffId = gameData.flags.featureResponsibility[missionFocus.id];
                var staffMember = companyData.staff.first(function (staff) {
                    return staff.id === responsibleStaffId;
                });
                if (staffMember && staffMember.flags.expert === missionFocus.id) {
                    return true;
                }
            }
            return false;
        });
        if (2 <= expertStaffCount) {
            gameData.flags.psEnabled = true; // "Play System" enabled? (Tên không rõ ràng lắm)
        }

        // Các trường hợp trả về điểm tối đa cố định
        if (("small" === gameData.gameSize && 2 <= companyData.currentLevel) || ("medium" === gameData.gameSize && 1E5 >= companyData.fans)) {
            return 9;
        }

        var techLevelPenalty = gameData.flags.techLevel; // Lấy mức tech level hiện tại của game

        // Tính toán điểm tối đa dựa trên kích thước game và trừ đi penalty do tech level thấp
        if ("large" === gameData.gameSize) {
            techLevelPenalty = (3 - techLevelPenalty).clamp(0, 3); // Penalty tối đa là 3
            return 10 - techLevelPenalty;
        } else if ("aaa" === gameData.gameSize) {
            techLevelPenalty = (5 - techLevelPenalty).clamp(0, 3); // Penalty tech level
            expertStaffCount = (3 - expertStaffCount).clamp(0, 3); // Penalty thiếu chuyên gia
            return 10 - (techLevelPenalty + 0.6 * expertStaffCount);
        }
        return 10; // Mặc định cho các trường hợp khác (ví dụ game "small" ở level 1)
    };

    // Hàm chính để tính điểm cho một game. Rất phức tạp với nhiều yếu tố ảnh hưởng.
    Reviews.rateGame = function (companyData) {
        var negativeReviewSnippets = []; // Các đoạn text tiêu cực cho review
        var positiveReviewSnippets = []; // Các đoạn text tích cực cho review
        var mmoMultiplier = 1; // Hệ số nhân cho game MMO
        var currentGame = companyData.currentGame;

        // Gửi sự kiện trước khi review
        GDT.fire(GameManager, GDT.eventKeys.gameplay.beforeGameReview, {
            company: companyData,
            game: currentGame
        });

        if (currentGame.flags.mmo) {
            mmoMultiplier = 2; // Game MMO có hệ số nhân cao hơn
        }

        var sequelToGame = null;
        // Kiểm tra nếu là sequel và có quá gần game gốc không
        if (currentGame.sequelTo) {
            sequelToGame = companyData.getGameById(currentGame.sequelTo);
            if (sequelToGame.releaseWeek > companyData.currentWeek - 40) { // 40 tuần = 10 tháng
                currentGame.flags.sequelsTooClose = true;
            }
        }

        var techPoints = currentGame.technologyPoints;
        var designPoints = currentGame.designPoints;
        var scoreModifier = 0; // Biến điều chỉnh điểm cuối cùng
        var positiveFactorsCount = 0; // Đếm yếu tố tích cực
        var negativeFactorsCount = 0; // Đếm yếu tố tiêu cực

        // 1. Đánh giá sự cân bằng giữa Design và Technology (Golden Ratio)
        if (30 <= designPoints + techPoints) { // Chỉ đánh giá nếu tổng điểm đủ lớn
            var goldenRatio = GameGenre.getGoldenRatio(currentGame.genre, currentGame.secondGenre);
            var goldenRatioDifference = designPoints * goldenRatio - techPoints; // Chênh lệch so với tỷ lệ vàng
            var goldenRatioPercentageDifference = 0;
            goldenRatioPercentageDifference = techPoints > designPoints ? Math.abs(goldenRatioDifference / techPoints * 100) : Math.abs(goldenRatioDifference / designPoints * 100);

            "goldenRatio percentDifference: {0}".format(goldenRatioPercentageDifference).log();
            if (25 >= Math.abs(goldenRatioPercentageDifference)) { // Cân bằng tốt
                scoreModifier += 0.1;
                positiveFactorsCount += 1;
                positiveReviewSnippets.push("They achieved a great balance between technology and design.".localize());
            } else if (50 < Math.abs(goldenRatioPercentageDifference)) { // Mất cân bằng nhiều
                scoreModifier -= 0.1;
                if (0 > goldenRatioDifference) {
                    negativeReviewSnippets.push("They should focus more on design.".localize());
                } else {
                    negativeReviewSnippets.push("They should focus more on technology.".localize());
                }
            }
        }

        // 2. Đánh giá việc tập trung vào các feature (mission)
        var focusedFeatures = currentGame.featureLog.filter(function (feature) {
            return "mission" === feature.missionType;
        });

        // Feature được tập trung tốt (quan trọng VÀ thời gian đủ)
        var wellFocusedFeatures = focusedFeatures.filter(function (feature) {
            var durationRatio = feature.duration / General.getGameSizeDurationFactor(currentGame.gameSize) / General.getMultiPlatformDurationFactor(currentGame) / (3 * Missions.BASE_DURATION);
            return 0.9 <= Missions.getGenreWeighting(feature, currentGame) && 0.4 <= durationRatio;
        });
        if (2 <= wellFocusedFeatures.length) {
            scoreModifier += 0.2;
            positiveFactorsCount += wellFocusedFeatures.length;
            positiveReviewSnippets.push("Their focus on {0} served this game very well.".localize().format(wellFocusedFeatures.map(function (feature) {
                return Missions.getMissionWithId(feature.id);
            }).pickRandom().name));
        } else if (1 === wellFocusedFeatures.length) {
            scoreModifier += 0.1;
            positiveFactorsCount += 1;
        } else { // Nếu không có feature nào được tập trung tốt
            scoreModifier -= 0.15 * mmoMultiplier;
        }

        // Feature được tập trung nhưng không quan trọng (thời gian đủ)
        var poorlyFocusedFeatures = focusedFeatures.filter(function (feature) {
            var durationRatio = feature.duration / General.getGameSizeDurationFactor(currentGame.gameSize) / General.getMultiPlatformDurationFactor(currentGame) / (3 * Missions.BASE_DURATION);
            return 0.8 > Missions.getGenreWeighting(feature, currentGame) && 0.4 <= durationRatio;
        });
        if (2 === poorlyFocusedFeatures.length) {
            var randomPoorlyFocusedFeature = Missions.getMissionWithId(poorlyFocusedFeatures.pickRandom().id);
            scoreModifier -= 0.2 * mmoMultiplier;
            negativeFactorsCount += poorlyFocusedFeatures.length;
            negativeReviewSnippets.push("Their focus on {0} is a bit odd.".localize().format(randomPoorlyFocusedFeature.name));
        } else if (1 === poorlyFocusedFeatures.length) {
            scoreModifier -= 0.1 * mmoMultiplier;
            negativeFactorsCount += 1;
        }

        // Feature quan trọng nhưng không đủ thời gian
        var underDevelopedImportantFeatures = focusedFeatures.filter(function (feature) {
            var durationRatio = feature.duration / General.getGameSizeDurationFactor(currentGame.gameSize) / General.getMultiPlatformDurationFactor(currentGame) / (3 * Missions.BASE_DURATION);
            return 0.9 <= Missions.getGenreWeighting(feature, currentGame) && 0.2 >= durationRatio;
        });
        for (var i_feature = 0; i_feature < underDevelopedImportantFeatures.length; i_feature++) {
            var featureDetails = Missions.getMissionWithId(underDevelopedImportantFeatures[i_feature].id);
            scoreModifier -= 0.15 * mmoMultiplier;
            negativeFactorsCount += 1;
            negativeReviewSnippets.push("They shouldn't forget about {0}.".localize().format(featureDetails.name));
        }

        // 3. Tính điểm cơ bản dựa trên tổng design/tech points và sự phù hợp topic/genre
        var baseScoreCalculation = (designPoints + techPoints) / 2 / General.getGameSizePointsFactor(currentGame);
        var topicGenreFit = GameGenre.getGenreWeighting(currentGame.topic.genreWeightings, currentGame.genre, currentGame.secondGenre);
        if (0.6 >= topicGenreFit) {
            negativeReviewSnippets.push("{0} and {1} is a terrible combination.".localize().format(currentGame.topic.name, currentGame.getGenreDisplayName()));
        } else if (1 === topicGenreFit) {
            positiveReviewSnippets.push("{0} and {1} is a great combination.".localize().format(currentGame.topic.name, currentGame.getGenreDisplayName()));
        }

        // 4. Phạt nếu lặp lại topic/genre quá sớm
        var genreNameString = currentGame.genre.name;
        if (currentGame.secondGenre) {
            genreNameString += "-" + currentGame.secondGenre.name;
        }
        var lastGame = companyData.gameLog.last();
        if (lastGame && !currentGame.flags.isExtensionPack && lastGame.genre === currentGame.genre && lastGame.secondGenre === currentGame.secondGenre && lastGame.topic === currentGame.topic) {
            negativeFactorsCount += 1;
            var repeatPenaltyMessage = "Another {0}/{1} game?".localize().format(genreNameString, currentGame.topic.name);
            negativeReviewSnippets.push(repeatPenaltyMessage);
            currentGame.flags.sameGenreTopic = true;
            "repeat genre/topic penalty: {0}:".format(-0.4).log();
            scoreModifier += -0.4;
        }

        // 5. Ảnh hưởng của sự phù hợp genre với platform
        var platformGenreFit = Platforms.getGenreWeighting(currentGame.platforms, currentGame.genre, currentGame.secondGenre);
        if (0.6 >= platformGenreFit) {
            var firstPlatformGenreWeight = Platforms.getNormGenreWeighting(currentGame.platforms[0].genreWeightings, currentGame.genre, currentGame.secondGenre);
            var platformIndexWithWorstGenreFit = 0;
            for (var i_platform = 1; i_platform < currentGame.platforms.length; i_platform++) {
                var currentPlatformGenreWeight = Platforms.getNormGenreWeighting(currentGame.platforms[i_platform].genreWeightings, currentGame.genre, currentGame.secondGenre);
                if (currentPlatformGenreWeight < firstPlatformGenreWeight) {
                    platformIndexWithWorstGenreFit = i_platform;
                }
            }
            negativeReviewSnippets.push("{0} games don't work well on {1}.".localize().format(genreNameString, currentGame.platforms[platformIndexWithWorstGenreFit].name));
        } else if (1 < platformGenreFit) {
            var firstPlatformGenreWeight = Platforms.getNormGenreWeighting(currentGame.platforms[0].genreWeightings, currentGame.genre, currentGame.secondGenre);
            var platformIndexWithBestGenreFit = 0;
            for (var i_platform = 1; i_platform < currentGame.platforms.length; i_platform++) {
                var currentPlatformGenreWeight = Platforms.getNormGenreWeighting(currentGame.platforms[i_platform].genreWeightings, currentGame.genre, currentGame.secondGenre);
                if (currentPlatformGenreWeight > firstPlatformGenreWeight) {
                    platformIndexWithBestGenreFit = i_platform;
                }
            }
            positiveReviewSnippets.push("{0} games work well on {1}.".localize().format(genreNameString, currentGame.platforms[platformIndexWithBestGenreFit].name));
        }

        // 6. Ảnh hưởng của sự phù hợp topic với đối tượng khán giả
        var topicAudienceWeight = General.getAudienceWeighting(currentGame.topic.audienceWeightings, currentGame.targetAudience);
        if (0.6 >= topicAudienceWeight) {
            negativeReviewSnippets.push("{0} is a horrible topic for {1} audiences.".localize().format(currentGame.topic.name, General.getAudienceLabel(currentGame.targetAudience)));
        }

        // 7. Phạt nếu sequel/expansion pack ra mắt quá sớm
        if (currentGame.flags.sequelsTooClose) {
            scoreModifier -= 0.4;
            negativeFactorsCount += 1;
            if (currentGame.flags.isExtensionPack) {
                negativeReviewSnippets.push("Already a expansion pack?".localize());
            } else {
                negativeReviewSnippets.push("Didn't we just play {0} recently?".localize().format(sequelToGame.title));
            }
        }

        // 8. Thưởng/phạt dựa trên engine của sequel
        if (currentGame.flags.usesSameEngineAsSequel && !currentGame.flags.isExtensionPack) {
            scoreModifier -= 0.1;
            negativeFactorsCount += 1;
        } else if (currentGame.flags.hasBetterEngineThanSequel) {
            scoreModifier += 0.2;
            positiveFactorsCount += 1;
        }

        // 9. Phạt nhẹ nếu game MMO có topic/genre không phù hợp
        if (currentGame.flags.mmo && 1 > GameGenre.getGenreWeighting(currentGame.topic.genreWeightings, currentGame.genre, currentGame.secondGenre)) {
            scoreModifier -= 0.15;
        }

        // 10. Phạt vì bug
        var bugsPenaltyFactor = 1;
        if (0 < currentGame.bugs) {
            bugsPenaltyFactor = 1 - 0.8 * ((100 / (currentGame.technologyPoints + currentGame.designPoints) * currentGame.bugs).clamp(0, 100) / 100); // Tỷ lệ bug càng cao, penalty càng lớn
            if (0.6 >= bugsPenaltyFactor) {
                negativeReviewSnippets.push("Riddled with bugs.".localize());
            } else if (0.9 > bugsPenaltyFactor) {
                negativeReviewSnippets.push("Too many bugs.".localize());
            }
        }

        // 11. Phạt nếu chênh lệch tech level giữa các platform quá lớn (khi làm game đa nền tảng)
        var platformSpreadPenalty = 1;
        if (1 < currentGame.platforms.length) {
            var techLevelMax = currentGame.platforms[0].techLevel;
            if ("PC" == currentGame.platforms[0].id) { // PC có thể lấy tech level của platform khác
                techLevelMax = currentGame.platforms[1].techLevel;
            }
            var techLevelMin = techLevelMax;
            for (var i_platform_tech = 1; i_platform_tech < currentGame.platforms.length; i_platform_tech++) {
                if ("PC" != currentGame.platforms[i_platform_tech].id) {
                    techLevelMax = Math.max(techLevelMax, currentGame.platforms[i_platform_tech].techLevel);
                    techLevelMin = Math.min(techLevelMin, currentGame.platforms[i_platform_tech].techLevel);
                }
            }
            platformSpreadPenalty -= (techLevelMax - techLevelMin) / 20; // Chênh lệch càng lớn, penalty càng nhiều
        }

        // 12. Tính điểm số cuối cùng trước khi điều chỉnh theo các yếu tố đặc biệt
        baseScoreCalculation = (baseScoreCalculation + baseScoreCalculation * scoreModifier) * platformGenreFit;
        baseScoreCalculation *= topicAudienceWeight;
        baseScoreCalculation *= bugsPenaltyFactor;
        baseScoreCalculation *= platformSpreadPenalty;

        // 13. Ảnh hưởng của xu hướng thị trường
        var trendFactor = GameTrends.getCurrentTrendFactor(currentGame);
        currentGame.flags.trendModifier = trendFactor;
        baseScoreCalculation *= trendFactor;

        // 14. So sánh với điểm số cao nhất kỳ vọng của công ty
        var expectedTopScoreForCompany = calculateExpectedTopScore(companyData);
        var normalizedScore = baseScoreCalculation / expectedTopScoreForCompany; // Chuẩn hóa điểm số

        // Giảm điểm nếu topic hoặc genre không hợp với audience/platform, dù game có điểm chuẩn hóa cao
        if (0.6 <= normalizedScore && (0.7 >= topicAudienceWeight || 0.7 >= topicGenreFit)) {
            normalizedScore = 0.6 + (normalizedScore - 0.6) / 2;
        }
        // Kiểm tra sự phù hợp của audience với từng platform
        if (0.7 < normalizedScore) {
            for (var i_platform_audience = 0; i_platform_audience < currentGame.platforms.length; i_platform_audience++) {
                if (0.8 >= Platforms.getPlatformsAudienceWeighting(currentGame.platforms[i_platform_audience].audienceWeightings, currentGame.targetAudience)) {
                    baseScoreCalculation *= Platforms.getPlatformsAudienceWeighting(currentGame.platforms[i_platform_audience].audienceWeightings, currentGame.targetAudience, true); // true để lấy giá trị gốc, không chuẩn hóa
                    normalizedScore = baseScoreCalculation / expectedTopScoreForCompany;
                    break;
                }
            }
        }

        "achieved {0} / top game {1} = {2}".format(baseScoreCalculation, Reviews.topScore, normalizedScore).log();

        var scoreAdjustedForRookies = false; // Cờ đánh dấu điểm có bị điều chỉnh do nhân viên mới/quản lý kém không
        var finalScore = (10 * normalizedScore).clamp(1, 10); // Chuyển điểm chuẩn hóa về thang 1-10

        // 15. Điều chỉnh điểm dựa trên đóng góp của team và các yếu tố quản lý (chỉ khi không phải game đầu tiên)
        currentGame.flags.teamContribution = 0;
        companyData.staff.forEach(function (staffMember) {
            // Tính tổng đóng góp của team, nếu nhân viên đóng góp ít hơn 1 game thì tính là 1.
            currentGame.flags.teamContribution = (1 > staffMember.flags.gamesContributed ? currentGame.flags.teamContribution + 1 : currentGame.flags.teamContribution + currentGame.getRatioWorked(staffMember));
        });
        currentGame.flags.teamContribution /= companyData.staff.length; // Lấy trung bình đóng góp

        // Nếu không phải game đầu tay và điểm ban đầu thấp, nhưng có nhiều yếu tố tích cực
        // và team làm việc hiệu quả, có thể "cứu vớt" điểm số.
        if (0 < companyData.lastTopScore && finalScore <= 5.2 - 0.2 * currentGame.platforms.length && 0 < positiveFactorsCount && positiveFactorsCount > negativeFactorsCount && 0.8 <= currentGame.flags.teamContribution) {
            var baseStaffAndOptimalTeamScore = 6; // Điểm cơ sở nếu team tốt
            var numStaff = 0;
            // Đếm số nhân viên thực tế tham gia
            for (var staffId_key in currentGame.flags.staffContribution) {
                if (currentGame.flags.staffContribution.hasOwnProperty(staffId_key)) {
                    numStaff++;
                }
            }
            var optimalTeamSize = General.getOptimalTeamSize(currentGame);
            var teamSizeDifference = Math.abs(optimalTeamSize - numStaff);
            if (1 < teamSizeDifference) { // Phạt nếu số lượng team không tối ưu
                baseStaffAndOptimalTeamScore -= (teamSizeDifference - 1);
            }
            var newStaffOnGame = Reviews.getNewStaff(currentGame); // Lấy danh sách nhân viên mới tham gia game này
            if (newStaffOnGame && 0 < newStaffOnGame.length) { // Phạt nếu có nhân viên mới
                baseStaffAndOptimalTeamScore -= newStaffOnGame.length / 2;
            }
            baseStaffAndOptimalTeamScore += positiveFactorsCount / 2 - negativeFactorsCount / 2; // Cộng/trừ dựa trên yếu tố tốt/xấu
            if (0.9 > bugsPenaltyFactor) {
                baseStaffAndOptimalTeamScore -= 0.5;
            } else if (0.6 >= bugsPenaltyFactor) {
                baseStaffAndOptimalTeamScore -= 1;
            }
            if (0.8 >= platformGenreFit) {
                baseStaffAndOptimalTeamScore -= (1 - platformGenreFit);
            }
            if (0.8 >= topicAudienceWeight) {
                baseStaffAndOptimalTeamScore -= (1 - topicAudienceWeight);
            }
            // Phạt nếu chênh lệch tech level platform lớn
            if (1 < currentGame.platforms.length) {
                var techLevelPlatMax = currentGame.platforms[0].techLevel;
                if ("PC" == currentGame.platforms[0].id) {
                    techLevelPlatMax = currentGame.platforms[1].techLevel;
                }
                var techLevelPlatMin = techLevelPlatMax;
                for (var i_plat_tech_adjust = 1; i_plat_tech_adjust < currentGame.platforms.length; i_plat_tech_adjust++) {
                    if ("PC" != currentGame.platforms[i_plat_tech_adjust].id) {
                        techLevelPlatMax = Math.max(techLevelPlatMax, currentGame.platforms[i_plat_tech_adjust].techLevel);
                        techLevelPlatMin = Math.min(techLevelPlatMin, currentGame.platforms[i_plat_tech_adjust].techLevel);
                    }
                }
                baseStaffAndOptimalTeamScore -= (techLevelPlatMax - techLevelPlatMin) / 0.5;
            }

            baseStaffAndOptimalTeamScore -= companyData.getRandom(); // Yếu tố ngẫu nhiên
            baseStaffAndOptimalTeamScore = Math.min(baseStaffAndOptimalTeamScore, 7.7); // Giới hạn điểm tối đa có thể "cứu"
            // Nếu điểm ban đầu thấp hơn điểm "cứu vớt" này thì gán bằng điểm cứu vớt
            if (finalScore < baseStaffAndOptimalTeamScore) {
                currentGame.flags.scoreWithoutBrackets = finalScore; // Lưu lại điểm gốc trước khi cứu
                finalScore = baseStaffAndOptimalTeamScore;
            }

            // Nếu 3 game gần nhất đều có điểm thấp và không được "cứu" theo cách trên,
            // thì có thể điểm cao nhất của công ty bị giảm đi (tránh việc người chơi bị kẹt ở mức điểm thấp mãi)
            if (3 < companyData.gameLog.length) {
                var allRecentGamesAreLowAndNotBracketed = true;
                for (var i_recent_game = 1; 3 >= i_recent_game; i_recent_game++) {
                    var recentGame = companyData.gameLog[companyData.gameLog.length - i_recent_game];
                    if (recentGame.score > 5.2 - 0.2 * recentGame.platforms.length && !recentGame.flags.scoreWithoutBrackets) {
                        allRecentGamesAreLowAndNotBracketed = false;
                        break;
                    }
                }
                if (allRecentGamesAreLowAndNotBracketed) {
                    companyData.lastTopScore = baseScoreCalculation; // Điểm cao nhất bị kéo xuống bằng điểm hiện tại
                    currentGame.flags.topScoreDecreased = true;
                }
            }
        }

        // 16. Ảnh hưởng của tech level game so với tiêu chuẩn
        var techLevelScoreMultiplier = calculateMaxPossibleScore(companyData, currentGame) / 10;
        // Phạt nếu game không phải size nhỏ/vừa mà tech level thấp
        if ("medium" != currentGame.gameSize && "small" != currentGame.gameSize && 1 > techLevelScoreMultiplier) {
            negativeReviewSnippets.push("Technology is not state of the art.".localize());
        }
        finalScore *= techLevelScoreMultiplier;

        // 17. Điều chỉnh điểm nếu có nhân viên mới (tránh việc game đầu tiên của nhân viên mới được điểm quá cao)
        if (9 <= finalScore) {
            if (0.1 > scoreModifier && 0.8 > companyData.getRandom()) { // Nếu ít yếu tố tích cực
                scoreAdjustedForRookies = true;
            } else {
                var newStaffOnThisGame = Reviews.getNewStaff(currentGame);
                if (0 < newStaffOnThisGame.length) {
                    scoreAdjustedForRookies = true;
                    currentGame.flags.newStaffIds = newStaffOnThisGame.map(function (staff) {
                        return staff.id;
                    });
                }
            }
            // Nếu bị điều chỉnh do nhân viên mới, điểm sẽ bị giảm ngẫu nhiên
            if (scoreAdjustedForRookies) {
                finalScore = currentGame.flags.newStaffIds && 0 < currentGame.flags.newStaffIds.length ?
                    8.15 + 0.95 / currentGame.flags.newStaffIds.length * companyData.getRandom() :
                    8.45 + 0.65 * companyData.getRandom();
                if (0.1 > companyData.getRandom()) { // 10% cơ hội điểm vẫn cao
                    finalScore = 9 + 0.25 * companyData.getRandom();
                }
                updateCompanyTopScore(companyData, baseScoreCalculation); // Cập nhật điểm cao nhất dựa trên điểm *trước* khi bị giảm do nhân viên mới
            }
        }

        // 18. "Nâng đỡ" điểm cho những game đầu tiên của người chơi
        if (2 > companyData.topScoreAchievements && 4 > companyData.getCurrentDate().year) {
            if (10 == finalScore) {
                finalScore -= (1.05 + 0.45 * companyData.getRandom());
                processTopScoreAchievement(companyData, baseScoreCalculation);
            } else if (9 <= finalScore) {
                finalScore -= (1.05 + 0.2 * companyData.getRandom());
                processTopScoreAchievement(companyData, baseScoreCalculation);
            } else if (8.5 < finalScore) {
                finalScore -= (0.4 + 0.2 * companyData.getRandom());
            }
        }

        // 19. Ghi nhận thành tựu nếu đạt điểm cao
        if (9 <= finalScore) {
            processTopScoreAchievement(companyData, baseScoreCalculation);
        }
        // Nếu game đạt top score 3 lần, lần này gần 10 thì cho 10 luôn
        if (10 != finalScore && currentGame.flags.topScore && 3 === companyData.topScoreAchievements) {
            finalScore = 10;
        }

        currentGame.score = finalScore; // Gán điểm cuối cùng cho game
        "final score: {0}".format(finalScore).log();

        // Tạo story cho sequel/expansion pack
        if (sequelToGame && (0.5 >= companyData.getRandom() || !companyData.gameLog.some(function (game) { return null != game.sequelTo; }))) {
            if (currentGame.flags.isExtensionPack) {
                Media.createExtensionPackStory(companyData, currentGame);
            } else {
                Media.createSequelStory(companyData, currentGame);
            }
        }

        var finalReviews = Reviews.getReviews(currentGame, finalScore, positiveReviewSnippets, negativeReviewSnippets);

        // Gửi sự kiện sau khi review
        GDT.fire(GameManager, GDT.eventKeys.gameplay.afterGameReview, {
            company: companyData,
            game: currentGame,
            reviews: finalReviews
        });
        return finalReviews;
    };

    // Hàm lấy danh sách nhân viên mới tham gia vào game này (đã đóng góp ít nhất 20% vào 1-2 game trước đó).
    Reviews.getNewStaff = function (gameData) {
        var companyData = GameManager.company;
        var newStaffList = [];
        for (var i_staff = 1; i_staff < companyData.staff.length; i_staff++) { // Bỏ qua người chơi chính (id 0)
            var staffMember = companyData.staff[i_staff];
            if (gameData.flags.staffContribution && gameData.flags.staffContribution.hasOwnProperty(staffMember.id)) {
                var gamesContributedByStaff = staffMember.flags.gamesContributed;
                // Nếu nhân viên đã đóng góp vào 0.2 đến 2 game (tức là còn khá mới)
                if (0.2 <= gamesContributedByStaff && 2 >= gamesContributedByStaff) {
                    newStaffList.push(staffMember);
                }
            }
        }
        return newStaffList;
    };

    // Hàm tạo ra 4 review riêng lẻ từ các nhà báo/tạp chí khác nhau.
    Reviews.getReviews = function (gameData, finalScore, positiveSnippetsPool, negativeSnippetsPool) {
        var roundedScore = Math.floor(finalScore).clamp(1, 10);
        if (9.5 <= finalScore) { // Nếu điểm rất cao, làm tròn lên 10
            roundedScore = 10;
        }

        var reviewerNames = ["Star Games", "Informed Gamer", "Game Hero", "All Games"];
        var reviewsArray = [];
        var usedMessages = []; // Để tránh lặp lại thông điệp review
        var individualScores = []; // Lưu điểm của từng review
        var scoreVarianceFactor = 1; // Hệ số để tạo sự khác biệt nhỏ giữa các review

        for (var i_reviewer = 0; 4 > i_reviewer; i_reviewer++) {
            // Cho điểm 5, 6 có thể có sự chênh lệch lớn hơn chút
            if (5 === roundedScore || 6 === roundedScore) {
                scoreVarianceFactor = 0.05 > GameManager.company.getRandom() ? 2 : 1;
            }
            var scoreOffset = (1 == Math.randomSign()) ? 0 : scoreVarianceFactor * Math.randomSign(); // Tạo chênh lệch ngẫu nhiên
            var individualReviewScore = (roundedScore + scoreOffset).clamp(1, 10); // Điểm của review này

            // Xử lý trường hợp đặc biệt: nếu tất cả 3 review trước đều 10, và game này có thể đạt 11
            if (10 === individualReviewScore && 3 === individualScores.length && 10 === individualScores.average()) {
                if (gameData.flags.psEnabled) { // "Play System" enabled?
                    if (10 == Math.floor(finalScore) && 0.4 > GameManager.company.getRandom()) {
                        individualReviewScore++; // Có cơ hội đạt 11/10
                    }
                } else {
                    if (10 > Math.floor(finalScore) || 0.8 > GameManager.company.getRandom()) {
                        individualReviewScore--; // Giảm xuống 9 nếu không đủ điều kiện 11
                    }
                }
            }

            var reviewMessage = undefined;
            do {
                // Ưu tiên lấy thông điệp từ pool tích cực/tiêu cực nếu có
                if (0.2 >= GameManager.company.getRandom()) { // 20% cơ hội lấy thông điệp cụ thể
                    if (0 <= scoreOffset && 6 <= individualReviewScore && 0 != positiveSnippetsPool.length) {
                        reviewMessage = positiveSnippetsPool.pickRandom();
                    } else if (0 > scoreOffset && 6 > individualReviewScore && 0 != negativeSnippetsPool.length) {
                        reviewMessage = negativeSnippetsPool.pickRandom();
                    }
                }
                if (!reviewMessage) { // Nếu không, lấy thông điệp chung
                    reviewMessage = Reviews.getGenericReviewMessage(gameData, individualReviewScore);
                }
            } while (-1 != usedMessages.weakIndexOf(reviewMessage)); // Đảm bảo thông điệp không lặp lại

            usedMessages.push(reviewMessage);
            individualScores.push(individualReviewScore);
            reviewsArray.push({
                score: individualReviewScore,
                message: reviewMessage,
                reviewerName: reviewerNames[i_reviewer]
            });
        }
        return reviewsArray;
    };

    // Hàm trả về một thông điệp review chung chung dựa trên điểm số.
    Reviews.getGenericReviewMessage = function (gameData, score) {
        score = Math.floor(score);
        // Tin nhắn đặc biệt nếu tên game không được tùy chỉnh và điểm thấp/trung bình
        if (3 < score && 7 > score && !gameData.flags.hasCustomName && 0.1 >= GameManager.company.getRandom()) {
            return ["As {0} as the name.".localize("{0} adjective").format(["boring".localize(), "generic".localize("used as adjective"), "blunt".localize(), "uninspired".localize(), "dull".localize()].pickRandom()),
            "The name says it all.".localize(),
            "They put as much thought into the game as into the game's name.".localize(),
            "Our review inspired by the game's name: bad review #{0}.".localize().format([1, 2, 3, 4, 5, 6].pickRandom())
            ].pickRandom();
        }
        if (7 <= score && !gameData.flags.hasCustomName && 0.1 >= GameManager.company.getRandom()) {
            return ["Good, despite the name.".localize(),
            "It's better than the name.".localize()
            ].pickRandom();
        }

        // Các thông điệp chung dựa trên thang điểm
        if (1 === score) return ["N/A not worth a statement.".localize(), "One of the worst!".localize(), "Makes you cry.".localize(), "Don't buy!".localize(), "Horrible.".localize(), "I still have nightmares!".localize(), "A disaster!".localize(), "Really bad.".localize()].pickRandom();
        if (2 === score) return ["Utterly uninspiring.".localize(), "Not fun.".localize(), "Boring.".localize(), "Disappointing.".localize(), "Bin material.".localize(), "Bad.".localize(), "Abysmal.".localize()].pickRandom();
        if (3 === score) return ["Disappointing.".localize(), "Waste of money.".localize(), "Waste of time.".localize(), "Not much fun.".localize(), "Pretty bad.".localize()].pickRandom();
        if (4 === score) return ["Not bad. Not good.".localize(), "Meh!".localize(), "OK.".localize(), "Uninspiring.".localize()].pickRandom();
        if (5 === score) return ["Falls a bit short.".localize(), "Fun at stages.".localize(), "Has its moments.".localize(), "Have seen better.".localize()].pickRandom();
        if (6 === score) return ["Shows potential.".localize(), "Could have been better.".localize(), "Quirky but good.".localize(), "I like it.".localize()].pickRandom();
        if (7 === score) return ["Good game.".localize(), "Enjoyable.".localize(), "Nice experience.".localize(), "Beautiful.".localize()].pickRandom();
        if (8 === score) return ["Very good.".localize(), "Very enjoyable.".localize(), "Love it!".localize(), "Played it for days.".localize()].pickRandom();
        if (9 === score) return ["Great!".localize(), "Almost perfect.".localize(), "One of the best.".localize(), "More please.".localize(), "Great game.".localize(), "Outstanding game.".localize(), "Can't wait for the sequel.".localize()].pickRandom();
        if (10 === score) return ["A masterpiece.".localize(), "Best of its kind.".localize(), "Truly great.".localize(), "Everyone loves it!".localize(), "Must have!".localize(), "Outstanding achievement.".localize(), "Awesome!".localize(), "My new favorite!".localize()].pickRandom();
        if (11 === score) return ["11 out of 10. Game of the year, any year!".localize(), "11 out of 10. Nuff said.".localize(), "11 out of 10. A exceptional score for an exceptional game.".localize(), "11 out of 10. Rules don't apply to this outstanding game.".localize()].pickRandom();
        throw "score cannot be " + score; // Lỗi nếu điểm không hợp lệ
    }
})();