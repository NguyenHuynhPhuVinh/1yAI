"use strict";
var Sales = {};
(function () {
    Sales.smallUnitPrice = 7;
    Sales.mediumUnitPrice = 11;
    Sales.largeUnitPrice = 14;
    Sales.aaaUnitPrice = 18;
    Sales.consoleUnitPrice = 50;

    // Hàm này tính toán một hệ số dựa trên kích thước game.
    // 'a' (tham số đầu tiên) không được sử dụng trong logic gốc, có thể là dư thừa hoặc đã bị loại bỏ.
    // 'b' (tham số thứ hai) là đối tượng game.
    // 'c' (biến cục bộ) là hệ số cần tính.
    var calculateGameSizeMultiplier = function (unusedCompany, game) {
        var multiplier = 0;
        switch (game.gameSize) {
            case "medium":
                multiplier = 1;
                break;
            case "large":
                multiplier = 1.2;
                break;
            case "aaa":
                multiplier = 1.5;
                break;
            default:
                return 1; // Mặc định cho "small" hoặc các trường hợp khác
        }
        return 1 + multiplier;
    };

    Sales.MediumTargetFans = 1E5; // 100,000
    Sales.LargeTargetFans = 25E4; // 250,000
    Sales.AAATargetFans = 1E6;  // 1,000,000

    // Hàm này trả về số lượng fan mục tiêu dựa trên kích thước game.
    // 'a' (tham số đầu tiên) là đối tượng công ty (company)
    // 'b' (tham số thứ hai) là đối tượng game.
    Sales.getTargetFans = function (company, game) {
        switch (game.gameSize) {
            case "medium":
                return Sales.MediumTargetFans;
            case "large":
                return Sales.LargeTargetFans;
            case "aaa":
                return Sales.AAATargetFans;
            default:
                return 1; // Hoặc một giá trị mặc định hợp lý khác
        }
    };

    // 'b' và 'c' là các mảng hệ số được sử dụng trong tính toán hình phạt vi phạm bản quyền.
    // 'f' là một mảng các ngưỡng cấp độ DRM.
    var piracyBaseFactors = [0.95, 0.9, 0.85, 0.8, 0.75, 0.8, 0.85, 0.9, 0.9, 0.92];
    var piracyPenaltyFactors = [0.05, 0.05, 0.05, 0.1, 0.1, 0.15, 0.2, 0.25, 0.25, 0.3];
    var drmLevels = [2, 4, 6, 8, 10, 12];

    // 'a' -> company
    // 'g' -> game
    // 'd' -> gameScore
    // 'k' -> drmFeature
    // 'm' -> hasDrm
    // 's' -> currentYear
    // 'k' (sau khi gán lại) -> piracyFactorCalculation
    Sales.calculatePiracyPenalty = function (company, game, gameScore) {
        if (!company.flags.pirateMode) return null;

        var drmFeature = game.features.first(function (feature) {
            return "DRM" == feature.category;
        });
        var hasDrm = null != drmFeature && drmFeature.v;
        var scoreIndex = Math.round(gameScore).clamp(1, 10) - 1;
        var piracyFactorCalculation;

        if (hasDrm) {
            var currentYear = company.getCurrentDate().year;
            // Tính toán sự chênh lệch giữa DRM hiện tại và DRM "cũ"
            var drmAgeFactor = Math.floor(currentYear / (5 / GameManager.flags.gameLengthModifier)).clamp(0, drmLevels.length - 1) - drmLevels.indexOf(drmFeature.v);

            if (drmAgeFactor == 0) { // DRM phù hợp với thời điểm
                piracyFactorCalculation = piracyPenaltyFactors[scoreIndex];
                game.flags.drmStrength = 1; // DRM hiệu quả
            } else if (drmAgeFactor > 0) { // DRM quá cũ
                piracyFactorCalculation = piracyBaseFactors[scoreIndex] - 0.3;
                game.flags.drmStrength = -1; // DRM yếu
            } else { // DRM quá mới (ít khả năng, nhưng logic gốc có)
                piracyFactorCalculation = piracyPenaltyFactors[scoreIndex] - 0.1;
                game.flags.drmStrength = 2; // DRM rất mạnh
            }
        } else { // Không có DRM
            piracyFactorCalculation = piracyBaseFactors[scoreIndex];
            game.flags.drmStrength = 0; // Không có DRM
        }

        if (game.flags.drmStrength <= 0) { // Nếu DRM yếu hoặc không có
            piracyFactorCalculation -= 0.1 * company.getRandom();
        }
        piracyFactorCalculation += 0.05 * company.getRandom() * Math.randomSign();
        piracyFactorCalculation = piracyFactorCalculation.clamp(0, 0.98);

        return {
            piracyFactor: piracyFactorCalculation,
            hasDrm: hasDrm
        };
    };

    // 'b' -> company
    // 'g' -> game
    // 'c' -> currentYear
    // 'd' -> clampedGameScore
    // 'f' -> baseSalesFactor (từ điểm số)
    // 'k' -> initialFanBaseEffect
    // 'm' -> marketSizePerPlatform
    // 't' -> minTechLevelOnConsole
    // 'q' -> loopCounter
    // 'v' -> platformTechLevel (trong vòng lặp)
    // 'A' -> platformShareFactor
    // 't' (sau khi gán lại) -> unitsSoldPerPlatform
    // 'v' (sau khi gán lại) -> salesPotentialFactor
    // 'q' (sau khi gán lại) -> hypeBoostFactor
    // 'm' (sau khi gán lại) -> totalUnitsSold
    // 'c' (sau khi gán lại) -> fanChange
    // 'd' (sau khi gán lại) -> totalRevenueFromGame
    Sales.calculateSales = function (company, game) {
        game.flags.fansAtLaunch = company.fans;
        var currentYear = company.getCurrentDate().year;
        var clampedGameScore = game.score.clamp(1, 10);

        // Áp dụng hình phạt đặc biệt nếu cờ G782 được bật
        if (GameFlags.G782 && currentYear >= 12 && company.getRandom() >= 0.75) {
            clampedGameScore = 1; // Giảm điểm số xuống 1 nếu vi phạm
            company.notifications.push(new Notification("Sales Report", "Boss, it seems that while many players play our new game, they steal it by downloading a cracked version rather than buying it legally.\nIf players don't buy the games they like, we will sooner or later go bankrupt.",
                ":-(", 3.3 + 2.8 * company.getRandom(), {
                type: NotificationType.AutoPopup
            }));
            game.flags.noSalesEvents = true;
        }

        var baseSalesFactor = clampedGameScore / 10;
        var initialFanBaseEffect = Math.min(15E5, company.fans) + Math.max(0, company.fans - 15E5) / 10;
        var marketSizePerPlatform = [0, 0, 0];
        var minTechLevelOnConsole = 8; // Giả định giá trị khởi tạo cao

        // Tìm tech level tối thiểu của các console (không phải PC) mà game được phát hành
        for (var platformIndex = 0; platformIndex < game.platforms.length; platformIndex++) {
            if ("PC" != game.platforms[platformIndex].id) {
                minTechLevelOnConsole = Math.min(minTechLevelOnConsole, game.platforms[platformIndex].techLevel);
            }
        }

        // Tính toán thị phần cho mỗi nền tảng
        for (var platformIndex = 0; platformIndex < game.platforms.length; platformIndex++) {
            var platformTechLevel = game.platforms[platformIndex].techLevel;
            if ("PC" == game.platforms[platformIndex].id) { // Nếu là PC, sử dụng tech level tối thiểu của console
                platformTechLevel = minTechLevelOnConsole;
            }
            var platformShareFactor = 1;
            if (platformIndex == 0 && game.platforms.length > 1) platformShareFactor = 0.7;
            else if (platformIndex == 1) platformShareFactor = game.platforms.length == 2 ? 0.55 : 0.4;
            else if (platformIndex == 2) platformShareFactor = 0.3;

            marketSizePerPlatform[platformIndex] += Platforms.getMarketSize(game.platforms[platformIndex], company) *
                platformShareFactor * (1 / platformTechLevel) * minTechLevelOnConsole * calculateGameSizeMultiplier(company, game);
        }

        var unitsSoldPerPlatform = [0, 0, 0];
        var salesPotentialFactor = 0;
        var hypeBoostFactor = 1;

        if (clampedGameScore >= 9) { // Game rất hay
            salesPotentialFactor = Math.pow(clampedGameScore, 3) / (100 - 35 * (clampedGameScore - 9));
            hypeBoostFactor = currentYear > 6 ? 0.5 : (company.currentLevel === 4 ? 0.35 : 0.5); // Giảm yếu tố hype cho game hay sau này
        } else { // Game ở mức trung bình hoặc tệ
            salesPotentialFactor = Math.pow(clampedGameScore, 3) / 100 * 0.2;
            if (company.currentLevel === 4) hypeBoostFactor = 1.25;
        }
        salesPotentialFactor = salesPotentialFactor * hypeBoostFactor / 15 * 0.2 + 0.008;
        var salesPotentialFactorArray = [salesPotentialFactor, salesPotentialFactor, salesPotentialFactor]; // Áp dụng như nhau cho các nền tảng ban đầu

        for (var platformIndex = 0; platformIndex < game.platforms.length; platformIndex++) {
            salesPotentialFactorArray[platformIndex] *= Platforms.getAudienceWeighting([game.platforms[platformIndex]], game.targetAudience);
            unitsSoldPerPlatform[platformIndex] += Math.floor(marketSizePerPlatform[platformIndex] * salesPotentialFactorArray[platformIndex]);
        }

        // Ảnh hưởng của Hype
        if (game.hypePoints) {
            var hypeEffectiveness = Math.min(500, game.hypePoints) / 500;
            var scoreThresholdForHype = clampedGameScore >= 5;
            if (game.flags.interviewHyped && game.flags.interviewHyped.decision) {
                scoreThresholdForHype = clampedGameScore >= 8; // Cần điểm cao hơn nếu đã hype mạnh
            }

            if (scoreThresholdForHype) { // Hype có tác động tích cực
                for (var platformIndex = 0; platformIndex < game.platforms.length; platformIndex++) {
                    unitsSoldPerPlatform[platformIndex] += Math.floor((clampedGameScore - 5) / 5 * marketSizePerPlatform[platformIndex] * hypeEffectiveness * 0.05);
                }
            } else { // Hype có tác động tiêu cực (nếu game không đủ tốt)
                for (var platformIndex = 0; platformIndex < game.platforms.length; platformIndex++) {
                    unitsSoldPerPlatform[platformIndex] -= Math.floor(clampedGameScore / 5 * salesPotentialFactorArray[platformIndex] * 0.25 * hypeEffectiveness * marketSizePerPlatform[platformIndex]);
                }
            }
        }

        for (var platformIndex = 0; platformIndex < game.platforms.length; platformIndex++) {
            unitsSoldPerPlatform[platformIndex] = Math.floor(Math.min(unitsSoldPerPlatform[platformIndex], marketSizePerPlatform[platformIndex]));
        }

        // Điều chỉnh cho hợp đồng phát hành (royalty)
        if (game.flags.royaltyRate) {
            unitsSoldPerPlatform[0] += Math.max(0, Sales.getTargetFans(company, game) - initialFanBaseEffect) * baseSalesFactor;
            for (var platformIndex = 0; platformIndex < game.platforms.length; platformIndex++) {
                unitsSoldPerPlatform[platformIndex] *= 10; // Khuếch đại doanh số nếu có hợp đồng?
            }
        } else {
            unitsSoldPerPlatform[0] += initialFanBaseEffect * baseSalesFactor;
        }

        if (!LOGWEEKSALES) {
            console.log("market size {0}. total reach {1}. existing fans {2}".format(marketSizePerPlatform.sum(function (val) {
                return val;
            }), unitsSoldPerPlatform.sum(function (val) {
                return val;
            }), initialFanBaseEffect));
        }

        var totalUnitsSold = Math.floor(0.8 * unitsSoldPerPlatform.sum(function (val) { return val; }) * baseSalesFactor +
            0.2 * unitsSoldPerPlatform.sum(function (val) { return val; }) * company.getRandom());

        game.unitPrice = Sales.getUnitPrice(game);
        if (game.flags.mmo && game.gameSize === "aaa") {
            totalUnitsSold *= 1.45;
        }

        // Tính toán hình phạt vi phạm bản quyền
        if (company.flags.pirateMode) {
            var initialTotalUnitsSold = totalUnitsSold;
            var piracyPenalty = Sales.calculatePiracyPenalty(company, game, clampedGameScore);
            if (piracyPenalty) {
                if (piracyPenalty.piracyFactor > 0) {
                    game.flags.pirated = true;
                }
                if (company.getRandom() >= 0.3) { // 70% cơ hội có thông báo
                    if (piracyPenalty.hasDrm) {
                        if (company.getRandom() > 0.2) Sales.spawnDrmStory(company, game);
                    } else if (piracyPenalty.piracyFactor > 0) {
                        Sales.spawnPirateStory(company, game);
                    }
                }
                totalUnitsSold -= Math.round(totalUnitsSold * piracyPenalty.piracyFactor);
                var piracyRate = Math.roundToDecimals(100 - (100 / initialTotalUnitsSold * totalUnitsSold), 2);
                game.flags.piracyRate = piracyRate;
                if (piracyPenalty.hasDrm) { // Nếu có DRM, doanh số cơ bản có thể bị ảnh hưởng nhẹ tiêu cực
                    baseSalesFactor *= ((clampedGameScore - 1).clamp(1, 10) / 10);
                }
            }
        }

        var fanChange = 0;
        if (clampedGameScore >= 7 && !game.flags.sequelsTooClose) {
            fanChange += 0.05 * initialFanBaseEffect + 0.05 * initialFanBaseEffect * company.getRandom();
        }

        if (clampedGameScore >= 5 && !game.flags.sequelsTooClose) {
            if (game.flags.royaltyRate && Sales.getTargetFans(company, game) - initialFanBaseEffect <= 0) {
                // Nếu có hợp đồng và không vượt mục tiêu fan, lượng fan tăng ít hơn
                fanChange += Math.floor((0.005 * totalUnitsSold * baseSalesFactor + 0.005 * totalUnitsSold * company.getRandom()) / 10);
            } else {
                fanChange += Math.floor(0.005 * totalUnitsSold * baseSalesFactor + 0.005 * totalUnitsSold * company.getRandom());
            }
        } else {
            // Game tệ, mất fan
            fanChange += -company.fans * (1 - baseSalesFactor) * 0.25 * company.getRandom();
        }

        var totalRevenueFromGame = totalUnitsSold * game.unitPrice;

        if (!LOGWEEKSALES) {
            console.log("units sold: {0}, sales: {1}$, fanMod{2}".format(totalUnitsSold, totalRevenueFromGame, fanChange));
        }

        if (!game.totalSalesCash) game.totalSalesCash = 0;
        game.totalSalesCash += totalRevenueFromGame;
        game.fansChangeTarget = fanChange;
        game.initialSalesRank = Sales.getInitialSalesRank(company, game);
        game.topSalesRank = game.initialSalesRank; // Ban đầu top rank là initial rank

        GDT.fire(GameManager, GDT.eventKeys.gameplay.salesCalculated, {
            company: company,
            game: game
        });
    };

    // 'a' -> company
    // 'b' -> game (không được sử dụng trực tiếp trong hàm này, nhưng có thể là ngữ cảnh)
    var getGreeting = function (company, game) {
        return ["Hey {0},".localize("email greeting, where {0} is company name").format(company.name),
        "Hi there,".localize("email greeting"),
        "Greetings,".localize("email greeting"),
        "Dear developers,".localize("email greeting"),
        "Hello {0},".localize("email greeting, where {0} is CEO name").format(company.staff[0].name)
        ].pickRandom();
    };

    // 'a' -> company (không được sử dụng)
    // 'b' -> game
    var getGamePraise = function (company, game) {
        return ["I quite liked {0}".localize("{0} is game name, continues with piracy fragment 2"),
        "I really enjoyed your game {0}".localize("{0} is game name, continues with piracy fragment 2"),
        "{0} is really interesting".localize("{0} is game name, continues with piracy fragment 2"),
        "{0} is awesome".localize("{0} is game name, continues with piracy fragment 2")
        ].pickRandom().format(game.title);
    };

    // 'a' -> company
    // 'b' -> game
    Sales.spawnPirateStory = function (company, game) {
        var greeting = getGreeting(company, game);
        var praise = getGamePraise(company, game);
        var currentYear = company.getCurrentDate().year;

        var complaints = ["but I've played more interesting {0} games before".localize("piracy fragment 2 - continue with piracy fragment 3, {0} is genre name").format(game.genre.name),
        "but other {0} are more innovative".localize("piracy fragment 2 - continue with piracy fragment 3, {0} is genre name").format(game.genre.name),
        "but I've only played {0} hours of it".localize("piracy fragment 2 - continue with piracy fragment 3").format(Math.floor(12 + 300 * company.getRandom())),
        "but I hated the ending".localize("piracy fragment 2 - continue with piracy fragment 3"),
        "but it really needs more features".localize("piracy fragment 2 - continue with piracy fragment 3"),
        "but it needs more depth".localize("piracy fragment 2 - continue with piracy fragment 3"),
        "but it could use more polish".localize("piracy fragment 2 - continue with piracy fragment 3"),
        "but it's not as good as other games".localize("piracy fragment 2 - continue with piracy fragment 3"),
        "but other games are better".localize("piracy fragment 2 - continue with piracy fragment 3"),
        "but I think it's too expensive".localize("piracy fragment 2 - continue with piracy fragment 3"),
        "but I think it needs to be at least 30% cheaper".localize("piracy fragment 2 - continue with piracy fragment 3"),
        "but I don't like you".localize("piracy fragment 2 - continue with piracy fragment 3"),
        "but I think parts of it should work differently".localize("piracy fragment 2 - continue with piracy fragment 3")
        ];
        if (company.staff.length > 1) {
            complaints.push("but I don't like that {0} works for you".localize("piracy fragment 2 - continue with piracy fragment 3").format(company.staff.skip(1).pickRandom().name));
        }
        if (currentYear >= 15) {
            complaints.push("but I'm saving up for this new graphics card".localize("piracy fragment 2 - continue with piracy fragment 3"));
            complaints.push("but I think it's not really AAA quality".localize("piracy fragment 2 - continue with piracy fragment 3"));
            complaints.push("but it isn't AAA quality".localize("piracy fragment 2 - continue with piracy fragment 3"));
        }
        var complaint = complaints.pickRandom();

        var piracyActions = ["so I stole it.".localize("piracy fragment 3"),
        "so I pirated it.".localize("piracy fragment 3"),
        "so I think you don't deserve my money.".localize("piracy fragment 3")
        ];
        if (currentYear >= 14) {
            piracyActions.push("so I downloaded your game from a gamez website.".localize("piracy fragment 3"));
            if (currentYear >= 20) {
                piracyActions.push("so I used a torrent.".localize("piracy fragment 3"));
            }
        }
        var piracyAction = piracyActions.pickRandom();
        var closingRemark = "";
        if (company.getRandom() > 0.5) {
            closingRemark = ["Anyway, just make better games, okay?".localize(),
            "Anyway, you really should release more updates for it.".localize(),
            "Looking forward to the sequel.".localize(),
            "You should give the game away for free.".localize(),
            "But hey, I've told my friends of the game so that's free publicity for you!".localize()
            ].pickRandom();
        }
        var senderName = company.getRandom() > 0.9 ? UI.getRandomFemaleFirstName() : UI.getRandomMaleFirstName();
        var psMessages = ["PS: I want to work in the games industry. Do you have a job for me?".localize()];
        if (company.isLaterOrEqualThan(18, 9, 1)) { // Giả sử 'grPhone' ra mắt vào Y18 M9 W1
            psMessages.push("- Sent from my grPhone.".localize());
        }
        var psMessage = "";
        if (company.getRandom() > 0.2) {
            psMessage = "\n\n" + psMessages.pickRandom();
        }

        var emailText = "{0}\n{1} {2} {3}\n{4}\n{5}{6}".format(greeting, praise, complaint, piracyAction, closingRemark, senderName, psMessage);
        company.notifications.push(new Notification("Mail".localize("header"), emailText, null, 2.5 + 7 * company.getRandom()));
    };

    // 'a' -> company
    // 'b' -> game
    Sales.spawnDrmStory = function (company, game) {
        var drmFeature = game.features.first(function (feature) {
            return "DRM" == feature.category;
        });
        if (drmFeature && drmFeature.v <= 6) { // Chỉ spawn story nếu DRM không quá mạnh
            var greeting = getGreeting(company, game);
            var praise = getGamePraise(company, game);
            var drmComplaints = ["but your use of copy protection makes the game really slow.".localize("piracy fragment"),
            "but the included copy protection software is really inconvenient.".localize("piracy fragment"),
            "but the game stopped working saying that it wasn't a genuine copy! I swear I bought it and I'm very unhappy about this.".localize("piracy fragment"),
            "but the copy protection in that game constantly crashes my system.".localize("piracy fragment"),
            "but I hate how inconvenient the copy protection is.".localize("piracy fragment")
            ].pickRandom();
            var suggestions = ["Can you please not use it in the future?".localize(),
            "A friend of mine pirated the game and he doesn't have any issues! This isn't fair!".localize(),
            "Thanks for your understanding.".localize(),
            "Please don't punish your fans for piracy!".localize(),
            "I will never buy anything from your company again!".localize(),
            "I will make sure to warn all of my friends about this.".localize()
            ].pickRandom();
            var senderName = company.getRandom() > 0.5 ? UI.getRandomMaleFirstName() : UI.getRandomFemaleFirstName();
            var emailText = "{0}\n{1} {2}\n{3}\n{4}".format(greeting, praise, drmComplaints, suggestions, senderName);
            company.notifications.push(new Notification("Mail".localize("header"), emailText, null, 2.5 + 7 * company.getRandom()));
        }
    };

    // 'a' -> company
    // 'b' -> game
    // 'c' -> clampedGameScore
    // 'd' -> initialRankBucket
    // 'f' -> finalSalesRank
    Sales.getInitialSalesRank = function (company, game) {
        var clampedGameScore = Math.floor(game.score);
        // Không cần dòng này: GameGenre.getGenreWeighting(game.topic.genreWeightings, game.genre, game.secondGenre);

        var initialRankBucket = -1;
        if (clampedGameScore === 10) initialRankBucket = 1;
        else if (clampedGameScore === 9) initialRankBucket = 5;
        else if (clampedGameScore === 8) initialRankBucket = 10;
        else if (clampedGameScore === 7) initialRankBucket = 20;
        else if (clampedGameScore === 6) initialRankBucket = 40;
        else if (clampedGameScore === 5) initialRankBucket = 60;
        else return -1; // Không có rank cho điểm thấp hơn

        var rankVariation = initialRankBucket * company.getRandom();
        rankVariation = rankVariation + 0.5 * initialRankBucket * company.getRandom() * Math.randomSign();
        var finalSalesRank = Math.floor(initialRankBucket + rankVariation);

        if (finalSalesRank > 100) return -1;
        if (finalSalesRank <= 0) finalSalesRank = 1;

        if (!LOGWEEKSALES) {
            console.log("rank = {0} ({1}(initial)+{2}(variation))".format(finalSalesRank, initialRankBucket, Math.floor(rankVariation)));
        }
        return finalSalesRank;
    };

    Sales.getSalesLengthInWeek = function (game) {
        if ("small" === game.gameSize) return 10;
        if ("medium" === game.gameSize) return 15;
        if ("large" === game.gameSize) return 20;
        if ("aaa" === game.gameSize) return 25;
        // Mặc định hoặc trường hợp không xác định
        return 10;
    };

    Sales.getUnitPrice = function (game) {
        return "medium" === game.gameSize ? Sales.mediumUnitPrice :
            "large" === game.gameSize ? Sales.largeUnitPrice :
                "aaa" === game.gameSize ? Sales.aaaUnitPrice :
                    Sales.smallUnitPrice;
    };

    // 'a' -> company
    // 'b' -> game
    // 'c' -> remainingSalesPotential
    Sales.getMMOIncome = function (company, game) {
        var remainingSalesPotential = game.totalSalesCash - game.currentSalesCash; // Doanh thu tiềm năng còn lại
        var salesDecayFactor = 1;
        if (game.gameSize === "medium") salesDecayFactor = 0.75;
        else if (game.gameSize === "large") salesDecayFactor = 0.65;
        else if (game.gameSize === "aaa") salesDecayFactor = 0.5;

        // Thu nhập MMO dựa trên phần trăm của doanh thu tiềm năng còn lại, có yếu tố ngẫu nhiên
        var mmoIncome = (game.totalSalesCash - game.currentSalesCash) * (0.05 * company.getRandom() * salesDecayFactor + 0.05 * salesDecayFactor);
        game.totalSalesCash += mmoIncome / 2; // Tăng tổng doanh thu tiềm năng một chút (MMO có thể bán lâu dài)
        if (mmoIncome < 1E4) { // Đảm bảo thu nhập tối thiểu
            mmoIncome = 1E4;
            game.totalSalesCash += mmoIncome;
        }
        return mmoIncome;
    };

    // 'a' -> company
    // 'b' -> game
    // 'c' -> remainingSalesPotential
    // 'd' -> salesDecayFactor
    Sales.getIncome = function (company, game) {
        var remainingSalesPotential = game.totalSalesCash - game.currentSalesCash;
        var salesDecayFactor = 1;
        if (game.gameSize === "medium") salesDecayFactor = 0.75;
        else if (game.gameSize === "large") salesDecayFactor = 0.65;
        else if (game.gameSize === "aaa") salesDecayFactor = 0.5;

        // Nếu game gần bán hết, tốc độ bán chậm lại
        if ((game.totalSalesCash - game.currentSalesCash) / game.totalSalesCash < 0.1 * salesDecayFactor) {
            if ((game.totalSalesCash - game.currentSalesCash) / game.totalSalesCash > 0.01 * salesDecayFactor) {
                remainingSalesPotential = (game.totalSalesCash - game.currentSalesCash) * (0.4 * company.getRandom() * salesDecayFactor + 0.4 * salesDecayFactor);
            }
        } else {
            remainingSalesPotential = (game.totalSalesCash - game.currentSalesCash) * (0.2 * company.getRandom() * salesDecayFactor + 0.2 * salesDecayFactor);
        }
        return remainingSalesPotential;
    };

    Sales.getGamesToSell = function (company) {
        var currentWeek = Math.floor(company.currentWeek);
        return company.gameLog.filter(function (game) {
            return currentWeek > game.releaseWeek && !game.soldOut && !game.flags.isExtensionPack;
        });
    };

    Sales.getConsolesToSell = function (company) {
        var currentWeek = Math.floor(company.currentWeek);
        return company.licencedPlatforms.filter(function (platform) {
            return true === platform.isCustom && currentWeek > General.getWeekFromDateString(platform.published) && !platform.soldOut;
        });
    };

    // 'a' -> company
    Sales.processSales = function (company) {
        var currentWeek = Math.floor(company.currentWeek);
        var extensionPacks = company.gameLog.filter(function (game) {
            return currentWeek > game.releaseWeek && !game.soldOut && true === game.flags.isExtensionPack;
        });

        // Xử lý doanh thu từ bản mở rộng (gộp vào game gốc)
        for (var i = 0, len = extensionPacks.length; i < len; i++) {
            var extensionPack = extensionPacks[i];
            var originalGame = company.getGameById(extensionPack.sequelTo);
            if (originalGame) {
                originalGame.fansChangeTarget += extensionPack.fansChangeTarget;
                originalGame.initialSalesRank = extensionPack.initialSalesRank; // Có vẻ lạ khi gán lại rank
                originalGame.packReleaseWeek = extensionPack.releaseWeek;
                originalGame.totalSalesCash += Math.floor(0.1 * originalGame.totalSalesCash + extensionPack.totalSalesCash);
                originalGame.confAmount = extensionPack.totalSalesCash; // Lưu lại doanh thu từ G3 của pack
                extensionPack.soldOut = true;
            } else {
                extensionPack.flags.isExtensionPack = false; // Nếu không tìm thấy game gốc, coi như game thường
            }
        }

        var gamesToSell = Sales.getGamesToSell(company);
        for (var i = 0, len = gamesToSell.length; i < len; i++) {
            Sales.sellGame(company, gamesToSell[i], currentWeek);
        }

        var consolesToSell = Sales.getConsolesToSell(company);
        for (var i = 0, len = consolesToSell.length; i < len; i++) {
            Sales.sellConsole(company, consolesToSell[i], currentWeek);
        }
    };

    // 'a' -> company
    // 'b' -> game
    // 'c' -> currentWeek
    // 'd' -> salesLength
    // 'f' -> fanChangeThisWeek
    // 'k' -> notification
    // 'm' -> salesAnomalyFactor
    Sales.sellGame = function (company, game, currentWeek) {
        if (!game.unitsSold) game.unitsSold = 0;
        if (!game.revenue) game.revenue = 0;

        if (game.flags.saleCancelled) { // Nếu game bị dừng bán
            game.totalSalesCash = game.currentSalesCash;
        }

        var salesLength = Sales.getSalesLengthInWeek(game);

        if (game.nextSalesCash) { // Nếu có doanh thu/fan dự kiến từ tuần trước
            game.currentSalesRank = game.nextSalesRank;
            game.fansChanged += game.nextfansChange;

            if (game.flags.royaltyRate) {
                game.currentSalesCash += game.nextSalesCash / game.flags.royaltyRate;
                game.unitsSold += Math.floor(game.nextSalesCash / game.flags.royaltyRate / game.unitPrice);
            } else {
                game.currentSalesCash += game.nextSalesCash;
                game.unitsSold += Math.floor(game.nextSalesCash / game.unitPrice);
            }

            if (game.nextSalesCash != 0) {
                company.adjustCash(game.nextSalesCash, "{0} sales".localize().format(game.title));
                game.revenue += Math.floor(game.nextSalesCash);
            }

            if (game.nextMaintenance && game.nextMaintenance != 0) {
                company.adjustCash(-game.nextMaintenance, "{0} maintenance".localize().format(game.title));
                game.costs += Math.floor(game.nextMaintenance);
            }
            if (game.flags.mmo) {
                game.flags.isProfitable = game.nextSalesCash >= game.nextMaintenance;
            }

            if (game.nextfansChange != 0) {
                var fanChangeThisWeek = Math.floor(game.nextfansChange);
                if (company.fans === 0 && fanChangeThisWeek > 0) {
                    var fanNotificationText = "{0} was so successful that we now have {1} fans!".localize().format(game.title, UI.getLongNumberString(fanChangeThisWeek));
                    var fanNotification = new Notification({
                        header: "Fans".localize("heading"),
                        text: fanNotificationText,
                        type: NotificationType.CompanyMilestones,
                        weeksUntilFired: 0.2
                    });
                    company.notifications.push(fanNotification);
                }
                company.adjustFans(fanChangeThisWeek);
            }

            if (game.firstSales) { // Thông báo tuần đầu tiên
                if (company.gameLog.length < 2 || game.rank >= 10) { // Logic này có vẻ lạ, rank >= 10 là tốt?
                    var firstWeekNotificationText = "{0} sold {1} units in its first week on the market.".localize().format(game.title, UI.getLongNumberString(game.unitsSold));
                    var currentSalesRank = game.currentSalesRank;
                    if (currentSalesRank > 0) {
                        firstWeekNotificationText += "\n" + "We made it in the charts at #{0}!".localize().format(currentSalesRank);
                    }
                    var firstWeekNotification = new Notification({
                        header: "First week of sales!".localize(),
                        text: firstWeekNotificationText,
                        type: NotificationType.CompanyMilestones
                    });
                    company.notifications.push(firstWeekNotification);
                    Tutorial.firstSales();
                }
                if (game.flags.mmo) Tutorial.mmoOnSale();
            }
            game.nextfansChange = undefined;
            game.nextSalesCash = undefined;
        }

        // Tính doanh thu cho tuần này
        if (game.totalSalesCash > game.currentSalesCash || (game.flags.mmo && !game.flags.saleCancelled)) {
            var isFirstSalesWeek = (game.currentSalesCash === 0);
            var salesAnomalyFactor = 0;
            if (!game.flags.mmo) {
                var salesAnomalyValue = game.getSalesAnomaly(); // Hàm này có thể thay đổi flags của game
                if (salesAnomalyValue > 0) salesAnomalyFactor = Math.floor(game.totalSalesCash * salesAnomalyValue * 0.3);
                else if (salesAnomalyValue < 0) salesAnomalyFactor = Math.floor(game.totalSalesCash * salesAnomalyValue * 0.3);
            }

            var incomeThisWeek = 0;
            if (game.flags.mmo) {
                incomeThisWeek = Sales.getMMOIncome(company, game);
            } else {
                incomeThisWeek = Sales.getIncome(company, game);
            }

            game.nextfansChange = Math.floor(incomeThisWeek / game.totalSalesCash * game.fansChangeTarget);
            game.nextSalesCash = Math.floor(incomeThisWeek + salesAnomalyFactor / 2);

            if (game.flags.royaltyRate) {
                game.nextSalesCash = Math.floor(game.nextSalesCash * game.flags.royaltyRate);
                salesAnomalyFactor = Math.floor(salesAnomalyFactor * game.flags.royaltyRate);
            }

            if (game.flags.mmo) {
                if (!game.maintenanceLog) game.maintenanceLog = [];
                game.nextMaintenance = Math.floor((game.currentSalesCash + game.nextSalesCash) / 100);
                game.nextMaintenance += Math.floor(game.nextSalesCash / (Math.pow(game.maintenanceLog.length, 3) + 3));
            }

            if (game.nextSalesCash <= 0) { // Nếu doanh thu dự kiến <= 0, dừng bán
                game.nextSalesCash = undefined;
                game.nextMaintenance = undefined;
                game.totalSalesCash = game.currentSalesCash;
            } else {
                if (game.flags.mmo) game.maintenanceLog.push(game.nextMaintenance);
                game.salesCashLog.push(game.nextSalesCash);
                game.totalSalesCash += Math.floor(salesAnomalyFactor); // Tổng doanh thu tiềm năng được điều chỉnh bởi yếu tố bất thường
            }

            // Cập nhật rank
            if (game.initialSalesRank != -1) {
                var progressThroughSalesCycle = (currentWeek - game.releaseWeek) / salesLength;
                if (game.packReleaseWeek) { // Nếu là pack, tính từ ngày pack ra mắt
                    progressThroughSalesCycle = (currentWeek - game.packReleaseWeek) / salesLength;
                }
                var newRank = Math.max(game.initialSalesRank, Math.floor(game.initialSalesRank + 2 * game.initialSalesRank * (progressThroughSalesCycle - 0.1)));
                newRank = GameManager.getUniqueSalesRank(newRank, game); // Đảm bảo rank là duy nhất
                game.nextSalesRank = newRank > 100 ? -1 : newRank;
            }

            if (isFirstSalesWeek) {
                game.firstSales = true;
                UI.addSalesCard(game.id, game.title, game.currentSalesCash, game.totalSalesCash, game.unitsSold, game.currentSalesRank, game.salesCashLog, game.nextSalesCash, game.unitPrice, game.nextMaintenance, game.maintenanceLog, game.flags.royaltyRate);
            } else {
                game.firstSales = false;
                UI.updateSalesCard(game.id, game.unitsSold, game.nextSalesCash, game.salesCashLog, game.unitPrice, game.currentSalesRank, game.nextMaintenance, game.maintenanceLog, game.flags.royaltyRate);
            }

        } else { // Game đã bán hết hoặc bị dừng
            game.soldOut = true;
            game.currentSalesRank = -1;
            UI.removeSalesCard(game.id, true);
            var offMarketNotificationText = "{0} is now off the market. It sold {1} units generating {2} in sales.".localize().format(game.title, UI.getLongNumberString(game.unitsSold), UI.getLongNumberString(game.revenue));
            var offMarketNotification = new Notification({
                header: "Game off the market.".localize("heading"),
                text: offMarketNotificationText,
                type: NotificationType.SalesReports
            });
            company.notifications.push(offMarketNotification);
        }
    };

    // 'a' -> company
    // 'b' -> consolePlatform
    // 'c' -> totalPotentialRevenue
    // 'd' -> salesRateFactor
    Sales.getConsoleIncome = function (company, consolePlatform) {
        var totalPotentialRevenue = 1E6 * consolePlatform.unitsSold * Sales.consoleUnitPrice;
        var remainingRevenue = totalPotentialRevenue - consolePlatform.currentSalesCash;
        var salesRateFactor = 0.1; // Tốc độ bán cơ bản

        // Tốc độ bán cao hơn trong giai đoạn đầu
        if (General.getWeekFromDateString(consolePlatform.published) + 10 > company.currentWeek) {
            salesRateFactor = 0.2;
        } else if (General.getWeekFromDateString(consolePlatform.published) + 20 > company.currentWeek) {
            salesRateFactor = 0.13;
        }

        var incomeThisWeek = (totalPotentialRevenue - consolePlatform.currentSalesCash) * (company.getRandom() * salesRateFactor * 0.15 + 0.15 * salesRateFactor);

        if (incomeThisWeek < 1E4) { // Đảm bảo thu nhập tối thiểu
            incomeThisWeek = 5E3 + 5E3 * company.getRandom();
            // Điều chỉnh lại tổng đơn vị bán tiềm năng nếu thu nhập quá thấp
            consolePlatform.unitsSold = (totalPotentialRevenue + incomeThisWeek) / 1E6 / Sales.consoleUnitPrice;
        }
        return incomeThisWeek;
    };

    // 'a' -> company
    // 'b' -> consolePlatform
    // 'c' -> currentWeek
    // 'd' -> totalFanImpact
    // 'f' -> gamesOnPlatform
    // 'k' -> loopCounter
    // 'm' -> loopLength
    Sales.getSalesAnomalyForConsole = function (company, consolePlatform) {
        var currentWeek = Math.floor(company.currentWeek);
        var totalFanImpact = 0;
        var gamesOnPlatform = company.gameLog.filter(function (game) {
            return currentWeek > game.releaseWeek &&
                !game.soldOut &&
                game.platforms.filter(function (platform) { return platform.id === consolePlatform.id; }).length > 0 &&
                game.currentSalesRank <= 100 && game.currentSalesRank > 0;
        });

        for (var i = 0, len = gamesOnPlatform.length; i < len; i++) {
            totalFanImpact = Math.max(totalFanImpact, (101 - gamesOnPlatform[i].currentSalesRank) / 100);
        }
        // Giảm ảnh hưởng nếu sự hài lòng của console thấp
        if (consolePlatform.satisFaction - 1 < 0) {
            totalFanImpact += (consolePlatform.satisFaction - 1).clamp(-0.5, 0);
        }
        return totalFanImpact;
    };

    // 'a' -> company
    // 'b' -> consolePlatform
    // 'c' -> currentWeek
    // 'd' -> totalPotentialRevenue
    // 'f' -> incomeThisWeek
    // 'k' -> salesAnomalyFactor
    Sales.sellConsole = function (company, consolePlatform, currentWeek) {
        if (consolePlatform.saleCancelled) {
            consolePlatform.unitsSold = consolePlatform.currentSalesCash / Sales.consoleUnitPrice / 1E6;
            consolePlatform.soldOut = true;
        }

        var totalPotentialRevenue = 1E6 * consolePlatform.unitsSold * Sales.consoleUnitPrice;
        if (!consolePlatform.currentSalesCash) consolePlatform.currentSalesCash = 0;
        if (!consolePlatform.currentUnitsSold) consolePlatform.currentUnitsSold = 0;
        if (!consolePlatform.salesCashLog) consolePlatform.salesCashLog = [];

        if (consolePlatform.nextSalesCash) { // Nếu có doanh thu dự kiến từ tuần trước
            consolePlatform.currentSalesCash += consolePlatform.nextSalesCash;
            consolePlatform.currentUnitsSold += Math.floor(consolePlatform.nextSalesCash / Sales.consoleUnitPrice);
            if (consolePlatform.nextSalesCash != 0) {
                company.adjustCash(consolePlatform.nextSalesCash, "{0} sales".localize().format(consolePlatform.name));
            }
            consolePlatform.nextSalesCash = undefined;
        }

        if (Math.floor(totalPotentialRevenue) > consolePlatform.currentSalesCash) {
            if (currentWeek > General.getWeekFromDateString(consolePlatform.published) + 1) {
                Sales.generateMaintenancePoints(company, consolePlatform, currentWeek);
            }
            var isFirstSalesWeek = (consolePlatform.currentSalesCash === 0);
            var incomeThisWeek = Sales.getConsoleIncome(company, consolePlatform);
            var salesAnomalyFactor = Sales.getSalesAnomalyForConsole(company, consolePlatform);
            var anomalyRevenueBoost = 0;
            if (salesAnomalyFactor != 0) {
                anomalyRevenueBoost = Math.floor(incomeThisWeek * salesAnomalyFactor);
                // Điều chỉnh tổng đơn vị bán tiềm năng dựa trên yếu tố bất thường
                consolePlatform.unitsSold += anomalyRevenueBoost / Sales.consoleUnitPrice / 1E6;
            }
            consolePlatform.nextSalesCash = Math.floor(incomeThisWeek + anomalyRevenueBoost);

            if (consolePlatform.nextSalesCash <= 0) {
                consolePlatform.nextSalesCash = undefined;
                consolePlatform.currentUnitsSold = consolePlatform.currentSalesCash / Sales.consoleUnitPrice; // Cập nhật lại nếu không có doanh thu
            } else {
                consolePlatform.salesCashLog.push(consolePlatform.nextSalesCash);
            }

            if (isFirstSalesWeek) {
                consolePlatform.firstSales = true;
                UI.addSalesCard(consolePlatform.id, consolePlatform.name, consolePlatform.currentSalesCash, totalPotentialRevenue, consolePlatform.currentUnitsSold, -1, consolePlatform.salesCashLog, consolePlatform.nextSalesCash, Sales.consoleUnitPrice);
            } else {
                consolePlatform.firstSales = false;
                UI.updateSalesCard(consolePlatform.id, consolePlatform.currentUnitsSold, consolePlatform.nextSalesCash, consolePlatform.salesCashLog, Sales.consoleUnitPrice, -1);
            }
        } else { // Console đã bán hết hoặc bị dừng
            UI.removeSalesCard(consolePlatform.id, true);
            UI.removeMaintenanceCard(consolePlatform, false); // Giả sử hàm này tồn tại
            console.log("{0} is now off the market. It sold {1} units generating {2} in sales.".localize().format(consolePlatform.name, UI.getLongNumberString(consolePlatform.currentUnitsSold), UI.getLongNumberString(consolePlatform.currentSalesCash)));
        }
    };

    // 'a' -> consolePlatform
    // 'b' -> salesLogLength
    // 'c' -> totalUnitsInLast5Weeks
    // 'd' -> loopCounter
    var getConsoleUnitsSoldInRecentWeeks = function (consolePlatform) {
        var salesLogLength = consolePlatform.salesCashLog.length;
        var totalUnitsInRecentWeeks = 0;
        // Tính tổng đơn vị bán trong tối đa 5 tuần gần nhất (hoặc ít hơn nếu log ngắn hơn)
        for (var i = salesLogLength - 1; i > Math.max(salesLogLength - 5, 0); i--) {
            totalUnitsInRecentWeeks += consolePlatform.salesCashLog[i];
        }
        return Math.floor(totalUnitsInRecentWeeks / Sales.consoleUnitPrice);
    };

    // 'a' -> company
    // 'b' -> consolePlatform
    // 'c' -> currentWeek
    // 'c' (trong hàm) -> maintenancePointPotential
    // 'a' (trong hàm) -> actualMaintenancePoints
    Sales.generateMaintenancePoints = function (company, consolePlatform, currentWeek_unused) {
        if (typeof consolePlatform.maintenancePoints === 'undefined') {
            consolePlatform.repairPoints = 0;
            consolePlatform.maintenancePoints = 0;
            consolePlatform.maintenanceLog = [];
        }
        var totalUnitsPotential = 1E6 * consolePlatform.unitsSold;
        // Tính điểm bảo trì tiềm năng dựa trên doanh số gần đây và chất lượng console
        var maintenancePointPotential = Math.min(32.5 * getConsoleUnitsSoldInRecentWeeks(consolePlatform) / totalUnitsPotential * 10, 45);
        var actualMaintenancePoints = Math.max(5, Math.floor(maintenancePointPotential - maintenancePointPotential * (0.4 * company.getRandom() + 0.6 * consolePlatform.qF)));

        consolePlatform.maintenancePoints += actualMaintenancePoints;
        consolePlatform.maintenanceLog.push(consolePlatform.maintenancePoints);
        UI.updateMaintenanceCard(consolePlatform); // Giả sử hàm này tồn tại
    };

    // 'a' -> company
    // 'b' -> licensedEngines
    // 'c' -> loopCounter
    // 'd' -> sdkIncome
    // 'f' -> maxTechLevelOnMarket
    Sales.sellSDKs = function (company) {
        var licensedEngines = company.engines.filter(function (engine) {
            return -1 != engine.parts.indexOf(Research.sdk); // Giả sử Research.sdk là một đối tượng
        });

        if (licensedEngines.length > 0) {
            licensedEngines.sort(function (engineA, engineB) { // Sắp xếp theo techLevel tăng dần
                return engineA.techLevel - engineB.techLevel;
            });

            for (var i = 0; i < licensedEngines.length; i++) {
                if (licensedEngines[i].releaseWeek + 96 > company.currentWeek) { // Chỉ bán SDK cho engine còn "mới"
                    var sdkIncome = licensedEngines[i].costs / 12; // Thu nhập SDK cơ bản
                    var maxTechLevelOnMarket = Platforms.getPlatformsOnMarket(company)
                        .filter(function (platform) { return !platform.isCustom; })
                        .max(function (platform) { return platform.techLevel; });

                    if (maxTechLevelOnMarket) {
                        sdkIncome *= licensedEngines[i].techLevel / maxTechLevelOnMarket; // Điều chỉnh theo sự liên quan của techLevel
                    }
                    company.adjustCash(sdkIncome, licensedEngines[i].name + " SDK".localize("short for Software Development Kit"));
                    break; // Chỉ bán SDK cho engine phù hợp nhất (cũ nhất nhưng còn hạn)
                }
            }
        }
    };

    // 'a' -> company
    // 'b' -> platformsOnMarket
    // 'c' -> pcMarketSize
    // 'd' -> dominantPlatformId
    // 'f' -> customConsoles
    // 'k' -> loopCounter
    // 'm' -> currentConsoleMarketSize
    Sales.applyGridSales = function (company) {
        if (company.flags.grid) { // Nếu công ty có nền tảng Grid
            var platformsOnMarket = Platforms.getPlatformsOnMarket(company);
            var pcMarketSize = Platforms.getMarketSizeForWeek(platformsOnMarket.first(function (platform) {
                return "PC" === platform.id;
            }), company.currentWeek, company, true);

            var dominantPlatformId = "PC";
            var customConsoles = platformsOnMarket.filter(function (platform) { return platform.isCustom; });

            // Tìm console tùy chỉnh có thị phần lớn nhất (nếu có)
            for (var i = 0; i < customConsoles.length; i++) {
                var currentConsoleMarketSize = Platforms.getMarketSizeForWeek(customConsoles[i], company.currentWeek, company, true);
                if (currentConsoleMarketSize > pcMarketSize) {
                    pcMarketSize = currentConsoleMarketSize; // Cập nhật thị phần lớn nhất
                    dominantPlatformId = customConsoles[i].id;
                }
            }
            var dominantPlatform = platformsOnMarket.first(function (platform) { return platform.id === dominantPlatformId; });
            // Thu nhập từ Grid dựa trên thị phần của nền tảng thống trị
            company.adjustCash(Platforms.getTotalMarketSizePercent(dominantPlatform, GameManager.company) / 100 * 2E6, "Grid income".localize("heading"));
        }
    };
})();