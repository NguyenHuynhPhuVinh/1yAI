var SalesEvents = {};
(function () {
    var salesEventsModule = SalesEvents; // Đổi tên 'a' thành 'salesEventsModule' để rõ ràng hơn đây là module SalesEvents

    // Lấy tất cả các đối tượng thông báo sự kiện bán hàng
    salesEventsModule.getAllNotificationsObjects = function () {
        var notificationObjects = [], // Đổi tên 'b' thành 'notificationObjects'
            eventName; // Đổi tên 'g' thành 'eventName'
        for (eventName in salesEventsModule)
            if (salesEventsModule.hasOwnProperty(eventName)) {
                var eventObject = salesEventsModule[eventName]; // Đổi tên 'c' thành 'eventObject'
                if (typeof eventObject.id !== 'undefined') { // Sửa void 0 != c.id thành typeof eventObject.id !== 'undefined' cho dễ đọc
                    notificationObjects.push(eventObject);
                }
            }
        return notificationObjects;
    };

    // Đăng ký module này như một nguồn thông báo với module General
    General.registerAsNotificationSource(salesEventsModule);

    // Hàm này tính toán và tạo thông báo khi một game đạt được các mốc doanh số nhất định
    // Trả về một hệ số điều chỉnh doanh số dựa trên kỷ lục đạt được
    salesEventsModule.getSaleRecord = function (company, game) { // Đổi tên 'a' thành 'company', 'b' thành 'game'
        // Chỉ áp dụng nếu game không có thỏa thuận bản quyền (royaltyRate) và không bị chặn sự kiện bán hàng
        if (!game.flags.royaltyRate && !game.flags.noSalesEvents) {
            // Mốc doanh số ban đầu và hệ số thưởng tương ứng
            var initialSalesMilestones = [1E4, 5E4, 1E5].reverse(); // Đổi tên 'c' thành 'initialSalesMilestones'
            var initialBonusFactors = [0.1, 0.2, 0.3].reverse(); // Đổi tên 'd' thành 'initialBonusFactors'

            // Kiểm tra các mốc doanh số ban đầu (ví dụ: 100K)
            if (!company.flags.game100Ksales) { // Giả sử game100Ksales là một cờ chung cho các mốc ban đầu
                for (var milestoneIndex = 0; milestoneIndex < initialSalesMilestones.length; milestoneIndex++) { // Đổi tên 'f' thành 'milestoneIndex'
                    var currentMilestone = initialSalesMilestones[milestoneIndex]; // Đổi tên 'k' thành 'currentMilestone'
                    if (game.unitsSold > currentMilestone && !company.flags["game" + UI.getShortNumberString(currentMilestone) + "sales"]) {
                        // Đánh dấu tất cả các mốc nhỏ hơn hoặc bằng mốc hiện tại là đã đạt được
                        initialSalesMilestones.slice(milestoneIndex).forEach(function (milestoneToFlag) { // Đổi tên 'b' thành 'milestoneToFlag'
                            company.flags["game" + UI.getShortNumberString(milestoneToFlag) + "sales"] = true;
                        });
                        // Tạo thông báo kỷ lục doanh số
                        company.notifications.push(new Notification({
                            header: "Sales Record".localize("heading"),
                            text: "{0} has achieved a company sales record with over {1} units sold!\nThis is an important milestone in the history of {2}!".localize().format(game.title, UI.getShortNumberString(currentMilestone), company.name),
                            type: NotificationType.CompanyMilestones
                        }));
                        return initialBonusFactors[milestoneIndex]; // Trả về hệ số thưởng
                    }
                }
            }

            // Các mốc doanh số lớn hơn và hệ số thưởng tương ứng
            var majorSalesMilestones = [5E5, 1E6, 5E6, 1E7, 5E7, 1E8].reverse(); // Đổi tên 'm' thành 'majorSalesMilestones'
            var majorBonusFactors = [0.4, 0.5, 0.6, 0.7, 0.8, 0.9].reverse(); // Giữ nguyên 'd' vì nó được tái sử dụng, hoặc đổi tên thành 'majorBonusFactors'
            var baseNewsText = "We just got word that {0} which was recently released by {1} has racked up over {2} in sales.".localize() + "\n"; // Đổi tên 't' thành 'baseNewsText'
            // Các danh hiệu (như đĩa vàng, bạch kim)
            var recordStatusAwards = ["Gold".localize("music record status"), "Platinum".localize("music record status"), undefined, "Diamond".localize("music record status"), undefined, undefined].reverse(); // Đổi tên 'c' thành 'recordStatusAwards'

            // Kiểm tra các mốc doanh số lớn
            for (var majorMilestoneIndex = 0; majorMilestoneIndex < majorSalesMilestones.length; majorMilestoneIndex++) { // Đổi tên 'f' thành 'majorMilestoneIndex'
                var currentMajorMilestone = majorSalesMilestones[majorMilestoneIndex]; // Đổi tên 'k' thành 'currentMajorMilestone'
                if (!(game.unitsSold <= currentMajorMilestone)) { // Nếu đã vượt qua mốc
                    if (game.flags["game" + UI.getShortNumberString(currentMajorMilestone) + "sales"]) break; // Nếu đã có thông báo cho mốc này thì bỏ qua

                    var newsText = baseNewsText.format(game.title, company.name, UI.getShortNumberString(currentMajorMilestone)); // Đổi tên 'm' thành 'newsText'

                    // Thêm thông tin về danh hiệu (nếu có)
                    if (recordStatusAwards.length > majorMilestoneIndex && typeof recordStatusAwards[majorMilestoneIndex] !== 'undefined' && 0.5 < company.getRandom()) {
                        newsText += "If the game were a music record it would have {0} status.{n}".localize("{0} gold, platinum etc.").format(recordStatusAwards[majorMilestoneIndex]);
                    }

                    // Thêm các bình luận ngẫu nhiên tùy theo mốc
                    var randomComments = "";
                    if (majorMilestoneIndex === 2) { // Mốc 5 Triệu
                        randomComments = ["An incredible achievement".localize(),
                        "This is an unbelievably high number.".localize(), "This game truly deserves to be called AAA.".localize()
                        ].pickRandom();
                    } else if (majorMilestoneIndex === 1) { // Mốc 1 Triệu
                        randomComments = "Only a true master of the industry could achieve such a milestone. {0} will forever be remembered in gaming history for this.".localize().format(company.staff[0].name);
                    } else {
                        randomComments = ["The excitement around the game seems to have no end.".localize(), "We wonder how many more it will sell.".localize(), "Competitors have been observed muttering jealous remarks.".localize(), "Go {0}! Well done!".localize().format(company.name)].pickRandom();
                    }
                    newsText += randomComments;

                    company.notifications.push(new Notification({
                        header: "Industry News".localize("heading"),
                        text: newsText,
                        type: NotificationType.CompanyMilestones
                    }));

                    var bonusFactor = majorBonusFactors[majorMilestoneIndex]; // Đổi tên 'd' thành 'bonusFactor'
                    game.flags["game" + UI.getShortNumberString(currentMajorMilestone) + "sales"] = true;
                    // Hệ số thưởng giảm đi nếu game đã có nhiều "salesAnomaly" (sự kiện bán hàng bất thường)
                    return bonusFactor / (game.flags.salesAnomaly + 1);
                }
            }
        }
        return null; // Nếu không có kỷ lục nào được thiết lập hoặc điều kiện không đáp ứng
    };

    // Tạo thông báo khi game đạt điểm cao và có thành tựu liên quan
    salesEventsModule.getTopScoreSalesEvent = function (company, game) { // Đổi tên 'a' thành 'company', 'c' thành 'game'
        if (!game.flags.topScoreAchievementShown) {
            var newsText = ""; // Đổi tên 'd' thành 'newsText'
            var salesBoostFactor; // Đổi tên 'f' thành 'salesBoostFactor'

            switch (company.topScoreAchievements) {
                case 1:
                    newsText = "According to our market research the recently published game '{0}' is a surprise hit with players.".localize().format(game.title);
                    newsText += "\n\n " + "The developer {0} is fairly new to the gaming industry but we cannot wait for what they will develop next!".localize().format(company.name);
                    salesBoostFactor = 0.2;
                    break;
                case 2:
                    var topReview = game.reviews.max(function (review) { return review.score; }); // Đổi tên 'a' thành 'review'
                    var topReviewer = game.reviews.first(function (review) { return review.score == topReview; }); // Đổi tên 'a' thành 'review', 'd' thành 'topReviewer'
                    newsText = "The latest game by {0} has received very positive reviews overall!\n{1} gave it a '{2}' saying '{3}'.".localize().format(company.name, topReviewer.reviewerName, topReviewer.score, topReviewer.message);
                    newsText += ("\n" + "If {0} continues to innovate like this they might become a new fan favorite!".localize().format(company.name));
                    salesBoostFactor = 0.3;
                    break;
                case 3:
                    newsText = "{0}, the newest game by {1} has caused a storm of good reviews and excited customers.".localize().format(game.title, company.name);
                    newsText += "\n\n" + "Industry professionals say that {0} is one of these rare games that will set a new quality standard for future games.{n}".localize().format(game.title);
                    newsText += "It seems that {0} really has made gaming history with {1}!\nWell done!".localize().format(company.name, game.title);
                    salesBoostFactor = 0.5;
                    break;
            }
            // Nếu không có thành tựu cụ thể nào nhưng game đạt điểm cao
            if (!newsText && 9 <= game.score) {
                newsText = generateTopScorePraise(company, game); // Đổi tên 'b' thành 'generateTopScorePraise'
                if (newsText) { // Chỉ gán salesBoostFactor nếu newsText được tạo
                    salesBoostFactor = 0.4 * company.getRandom();
                }
            }

            if (newsText) {
                game.flags.topScoreAchievementShown = true;
                company.notifications.push(new Notification("News".localize("heading"), newsText, "OK".localize(), {
                    type: NotificationType.CompanyMilestones,
                    previewImage: "./images/notificationIcons/icon_notification_reviews.png"
                }));
            }
            return salesBoostFactor;
        }
        return null; // Nếu cờ topScoreAchievementShown đã được bật
    };

    // Hàm này tạo ra một đoạn văn bản ca ngợi game đạt điểm cao, dựa trên các tính năng nổi bật của game
    var generateTopScorePraise = function (company, game) { // Đổi tên 'b' thành 'generateTopScorePraise', 'a' thành 'company', 'b' thành 'game'
        // Lọc ra các nhiệm vụ (mission) trong quá trình phát triển game
        var focusedMissions = game.featureLog.filter(function (feature) { // Đổi tên 'a' thành 'feature'
            return "mission" === feature.missionType;
        }).filter(function (feature) { // Đổi tên 'a' thành 'feature'
            // Tính toán thời gian tương đối dành cho nhiệm vụ này
            var relativeDuration = feature.duration / General.getGameSizeDurationFactor(game.gameSize) / General.getMultiPlatformDurationFactor(game) / (3 * Missions.BASE_DURATION);
            // Chọn các nhiệm vụ có trọng số cao cho thể loại game và có thời gian phát triển đáng kể
            return 0.9 <= Missions.getGenreWeighting(feature, game) && 0.4 <= relativeDuration;
        });

        if (focusedMissions.length !== 0) { // Sửa 0 != d.length thành d.length !== 0
            var randomFocusedMission = focusedMissions.pickRandom(); // Đổi tên 'f' thành 'randomFocusedMission'
            var openingLines = ["If you are not a fan of {0} now then chances are you will be after playing their latest hit {1}.".localize(), "Ladies and gentlemen, the surprise hit of the year is {1} by {0}.".localize(),
            "When I started playing {1} I had no idea what I was in for.".localize(), "There are a lot of good surprises waiting for you in {1}.".localize(), "Another memorable game by {0} has been released.".localize(), "I have been playing {1} and have tremendously enjoyed the experience.".localize(), "{0} surprises us again with a very enjoyable game.".localize()
            ]; // Đổi tên 'd' thành 'openingLines'
            var missionSpecificPraise = getMissionSpecificPraise(randomFocusedMission); // Đổi tên 'c' thành 'getMissionSpecificPraise', 'f' thành 'missionSpecificPraise'
            var closingLines = ["Rarely will a game captivate you as much as {1}.".localize(), "{1} really deserves the top spots in the charts.".localize(), "Simply one of the best games I've played.".localize(),
            "Well, what can I say? Stop reading. Start playing.".localize(), "A stellar effort by {0}.".localize(), "To {0}: Keep the hits coming please :)".localize(), "Only a game with unicorns, rainbows, pirates and ninjas could possibly be better.".localize(), "Summary: best. game. ever.".localize()
            ]; // Đổi tên 'k' thành 'closingLines'
            var randomReviewSource = getRandomReviewSource(company).pickRandom(); // Đổi tên 'm' thành 'getRandomReviewSource', 's' thành 'randomReviewSource'
            return (openingLines.pickRandom() + " " + missionSpecificPraise + " " + closingLines.pickRandom()).format(company.name, game.title) + "\n{0}, {1}".format(randomReviewSource.author, randomReviewSource.name);
        }
        return null; // Nếu không có nhiệm vụ nào nổi bật để ca ngợi
    };

    // Hàm này trả về một đoạn văn bản ca ngợi cụ thể dựa trên ID của nhiệm vụ (mission)
    var getMissionSpecificPraise = function (mission) { // Đổi tên 'c' thành 'getMissionSpecificPraise', 'a' thành 'mission'
        var praiseTexts = { // Đổi tên 'b' thành 'praiseTexts'
            Engine: ["There is a rare technical polish in this game which really comes through in the overall experience.".localize(),
            "The game shines of technical excellence. Clearly the developers know what they are doing.".localize(), "I was positively surprised to see the level of polish that went into the underlying game engine. The effort really paid off.".localize()
            ],
            Gameplay: ["In this type of game the core gameplay mechanics are really important and the developer has nailed it.".localize(), "I have rarely seen such responsive game controls. A true joy to play.".localize(), "The attention to detail to the core gameplay has really paid off.".localize()],
            "Story/Quests": ["This game doesn't just tell a story, no, it manages to draw you in so that you truly feel part of an adventure.".localize(), "A true achievement in interactive story telling, the characters and the captivating scenarios just stick in your mind.".localize(), "Whoever wrote the story of {1} will likely win a prize for it.".localize()], // {1} ở đây có thể là tên game, cần xem xét lại ngữ cảnh
            Dialogs: ["The character dialogues in this game are just oustanding. Rarely will you be so captivated in a conversation.".localize(), "The term dialogue tree really doesn't do {1} justice. This game has a dialogue forest... in a good way.".localize(),
            "A perfect example on how dialogues in a game can be so much more thrilling than in a movie or book. At every stage I felt like I really had choices and was driving the story.".localize()
            ],
            "Level Design": ["The progression in this story is just perfect. Just when you start to think things settle down something surprising will happen.".localize(), "The level design is both sophisticated and surprisingly intuitive. I never felt like I was guided through a level but I never ever got lost either. A true achievement.".localize(),
            "Simply iconic level designs, from start to finish.".localize()
            ],
            AI: ["The computer-controlled entities in this game are so incredibly convincing that I caught myself talking at them at times.".localize(), "Rarely manages a game to blend the A.I. so well into the game world that you just feel completely immersed.".localize(), "The game responds to the player in such a realistic fashion that it makes you sometimes forget that this is just a game.".localize()],
            "World Design": ["A wonderfully imaginative gameworld makes {1} a joy to discover. You will spend hours travelling through this world.".localize(),
            "This is world design at its best. Brave, imaginative and unapologetically following its incredible artistic vision.".localize(), "The attention to detail in the world design really sets this game apart from others in the genre.".localize()
            ],
            Graphic: ["Visually pleasing is an understatement. This game looks incredibly good.".localize(), "The art style in {1} blends so well with the general feeling of the game. A perfect match.".localize(), "Truly oustanding visual design is only one of the many reasons why {1} deserves your attention.".localize()],
            Sound: ["I rarely highlight the sound of a game instead of the many other noteworthy features but in {1} the sound design was truly awe-inspiring.".localize(), "The sound in this game gives you goose bumps. Very well designed.".localize(), "The game doesn't just look good it sounds incredibly good too. A true feast for players who appreciate high quality sound.".localize()]
        };
        return praiseTexts.hasOwnProperty(mission.id) ? praiseTexts[mission.id].pickRandom() : "";
    };

    // Hàm này chưa được triển khai, có thể dùng để tạo các sự kiện bán hàng sớm
    salesEventsModule.getEarlySalesEvents = function (company, game) { }; // Đổi tên 'a' thành 'company', 'b' thành 'game'

    // Lấy các sự kiện có thể xảy ra cho một game cụ thể
    salesEventsModule.getPossibleEvents = function (gameContext) { // Đổi tên 'b' thành 'gameContext'
        return salesEventsModule.getAllNotificationsObjects().filter(function (eventObject) { // Đổi tên 'a' thành 'eventObject'
            return eventObject &&
                eventObject.trigger(GameManager.company, gameContext);
        });
    };

    // Tạo sự kiện khi một game được "hype" (quảng bá rầm rộ) trước đó được phát hành
    salesEventsModule.getHypedGameEvent = function (company, game) { // Đổi tên 'a' thành 'company', 'b' thành 'game'
        var hypeEffectFactor = 0; // Đổi tên 'c' thành 'hypeEffectFactor'
        var wasBoldInInterview = game.flags.interviewHyped.decision; // Đổi tên 'd' thành 'wasBoldInInterview'
        var interviewSource = game.flags.interviewHyped.source; // Đổi tên 'f' thành 'interviewSource'

        var interviewRecap = "In an exclusive interview a while ago, {0} from {1}".localize("followed by sentence fragment (hypgfr1 or hypgfr2)").format(company.staff[0].name, company.name); // Đổi tên 'k' thành 'interviewRecap'
        interviewRecap += wasBoldInInterview ?
            " made very bold remarks about their then-in-development game {0} predicting that it will be \u00fcber successful.".localize("fragment: hypgfr1").format(game.title) :
            " was holding back when discussing their expections for {0}.".localize("fragment: hypgfr2").format(game.title);

        var outcomeDescription; // Đổi tên 'm' thành 'outcomeDescription'
        if (game.score > 8) { // Game rất thành công
            if (wasBoldInInterview) {
                hypeEffectFactor = 0.5;
                outcomeDescription = "was spot on as the game has received very positive reviews.".localize("fragment");
            } else {
                hypeEffectFactor = 0.2;
                outcomeDescription = "was just humble as the game received critical acclaim.".localize("fragment");
            }
        } else if (game.score > 6) { // Game khá thành công
            if (wasBoldInInterview) {
                hypeEffectFactor = -0.2;
                outcomeDescription = "should've been more careful as the final product doesn't match the hyped expectations.".localize("fragment");
            } else {
                hypeEffectFactor = 0.4;
                outcomeDescription = "was right to stay realistic as the game is good but nothing too our of the ordinary.".localize("fragment");
            }
        } else { // Game không thành công
            if (wasBoldInInterview) {
                hypeEffectFactor = -0.5;
                outcomeDescription = "needs a lesson in how to be humble as the game received mediocre reviews.".localize("fragment");
            }
            // Trường hợp "be modest" và game không thành công không được xử lý ở đây, có thể là một thiếu sót hoặc hypeEffectFactor = 0
        }

        if (typeof outcomeDescription !== 'undefined') { // Chỉ thêm nếu outcomeDescription được định nghĩa
            interviewRecap += "{n}" + "Now, that the game is out on the market the consensus is that {0} {1}".localize("{0} is player name, {1} is description").format(company.staff[0].name, outcomeDescription);
            interviewRecap += (hypeEffectFactor > 0) ?
                ("\n\n" + "Overall, this had a positive effect on sales.".localize()) :
                ("\n\n" + "Overall, this had a negative effect on sales.".localize());

            if (hypeEffectFactor !== 0) {
                company.notifications.push(new Notification({
                    header: interviewSource.name,
                    text: interviewRecap,
                    type: NotificationType.SalesReports,
                    previewImage: "./images/notificationIcons/icon_notification_local_news_and_media.png"
                }));
            }
        }
        return hypeEffectFactor;
    };

    // Danh sách các nguồn tin tức - tạp chí
    var magazines = [{ // Đổi tên 'f' thành 'magazines'
        name: "Gaming World",
        author: "Jason Green"
    }, {
        name: "SMASH",
        author: "Roland Kean"
    }, {
        name: "Electric Games",
        author: "Arnie Kunkel"
    }, {
        name: "GamerPro",
        author: "Julian Rickstall"
    }, {
        name: "Game Informant",
        author: "Andrew McNara"
    }, {
        name: "GameNova",
        author: "J\u00f6rg Longer"
    }, {
        name: "Gamers",
        author: "Gary White"
    }, {
        name: "Gamers",
        author: "Kirton Gillen"
    }, {
        name: "Center",
        author: "Tom Mott"
    }, {
        name: "eGaming Check",
        author: "Christopher Rignall"
    }];
    magazines.forEach(function (magazine) { magazine.type = "magazine"; }); // Đổi tên 'a' thành 'magazine'

    // Danh sách các nguồn tin tức - TV show
    var tvShows = [{ // Đổi tên 'd' thành 'tvShows'
        name: "Planet GG",
        author: "Steve O'Connell"
    },
    {
        name: "Planet GG",
        author: "Jason Ray"
    }, {
        name: "Planet GG",
        author: "Steph Benhexen"
    }, {
        name: "Don't Cheat!",
        author: "Nicole Kolt"
    }, {
        name: "Y-Play",
        author: "Adam Hessler"
    }, {
        name: "Y-Play",
        author: "Morgan Net"
    }, {
        name: "Y-Play",
        author: "Jessie Nobot"
    }, {
        name: "Game Red",
        author: "Geoff Keyley"
    }
    ];
    tvShows.forEach(function (tvShow) { tvShow.type = "TV show"; }); // Đổi tên 'a' thành 'tvShow'

    // Danh sách các nguồn tin tức - blog
    var blogs = [{ // Đổi tên 'k' thành 'blogs'
        name: "Rock, Paper, Shogun",
        author: "Alex Seer"
    }, {
        name: "Rock, Paper, Shogun",
        author: "James Rosenol"
    }, {
        name: "Gamedroid",
        author: "Vanier Gonza"
    }, {
        name: "Kottago",
        author: "Stephen Tort"
    },
    {
        name: "GameRye",
        author: "Patrick Toint"
    }
    ];
    blogs.forEach(function (blog) { blog.type = "blog"; }); // Đổi tên 'a' thành 'blog'

    // Lấy danh sách các nguồn tin tức có thể có, tùy thuộc vào năm hiện tại của game
    var getRandomReviewSource = function (company) { // Đổi tên 'm' thành 'getRandomReviewSource', 'a' thành 'company'
        var currentDate = company.getCurrentDate(); // Đổi tên 'a' thành 'currentDate'
        var possibleSources = magazines.slice(); // Tạo bản sao để không thay đổi mảng gốc

        if (currentDate.year >= 10) { // Giả sử năm 10 là mốc
            possibleSources = possibleSources.concat(tvShows);
        }
        if (currentDate.year >= 16) { // Giả sử năm 16 là mốc
            possibleSources = possibleSources.concat(blogs);
        }
        return possibleSources;
    };
    salesEventsModule.getPossibleSources = getRandomReviewSource;
})();