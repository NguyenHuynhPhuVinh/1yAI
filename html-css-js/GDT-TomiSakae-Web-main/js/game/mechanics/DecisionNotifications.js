var DecisionNotifications = {};
(function () {
    // Gán DecisionNotifications vào biến cục bộ decisionNotificationsModule để dễ sử dụng
    var decisionNotificationsModule = DecisionNotifications;
    // Mảng chứa các thông báo quyết định được thêm bởi mod
    decisionNotificationsModule.modNotifications = [];

    /**
     * Kiểm tra xem một thông báo có nên được kích hoạt hay không.
     * @param {object} notificationConfig - Đối tượng cấu hình của thông báo.
     * @returns {boolean} - True nếu thông báo nên được kích hoạt, ngược lại là false.
     */
    var shouldTriggerNotification = function (notificationConfig) {
        // Nếu thông báo có ngày kích hoạt và ngày hiện tại chưa đến ngày đó, không kích hoạt
        if (notificationConfig.date && Math.floor(GameManager.company.currentWeek) < General.getWeekFromDateString(notificationConfig.date, notificationConfig.ignoreGameLengthModifier)) {
            return !1;
        }
        // Nếu thông báo có số lần kích hoạt tối đa hoặc có ngày kích hoạt
        if (notificationConfig.maxTriggers || notificationConfig.date) {
            var triggerCount = GameManager.company.eventTriggerCounts[notificationConfig.id]; // Lấy số lần đã kích hoạt
            var maxAllowedTriggers = notificationConfig.date ? 1 : notificationConfig.maxTriggers; // Số lần tối đa cho phép
            // Nếu đã kích hoạt đủ số lần, không kích hoạt nữa
            if (triggerCount && triggerCount >= maxAllowedTriggers) {
                return !1;
            }
        }
        // Kích hoạt nếu thông báo có ngày (và đã qua ngày đó) hoặc có hàm trigger và hàm đó trả về true
        return notificationConfig.date || (notificationConfig.trigger && notificationConfig.trigger(GameManager.company));
    };

    /**
     * Tăng số lần kích hoạt của một thông báo.
     * @param {object} notificationConfig - Đối tượng cấu hình của thông báo.
     */
    var incrementTriggerCount = function (notificationConfig) {
        var company = GameManager.company;
        // Nếu đã có đếm số lần kích hoạt, tăng lên 1, ngược lại gán bằng 1
        company.eventTriggerCounts[notificationConfig.id] ? company.eventTriggerCounts[notificationConfig.id]++ : company.eventTriggerCounts[notificationConfig.id] = 1;
    };

    /**
     * Lấy danh sách các thông báo mới cần hiển thị.
     * @param {object} companyData - (Không sử dụng trong hàm này, lấy từ GameManager.company)
     * @returns {Array<Notification>} - Mảng các đối tượng Notification mới.
     */
    decisionNotificationsModule.getNewNotifications = function (companyData_unused) {
        var currentCompany = GameManager.company;
        // Lọc các thông báo không phải ngẫu nhiên và thỏa mãn điều kiện kích hoạt
        var newNotifications = decisionNotificationsModule.getAllNotificationsObjects().filter(function (notificationConfig) {
            return !notificationConfig.isRandomEvent && shouldTriggerNotification(notificationConfig);
        }).map(function (notificationConfig) {
            incrementTriggerCount(notificationConfig); // Tăng số lần kích hoạt
            // Trả về đối tượng Notification đã được định nghĩa sẵn hoặc tạo mới từ getNotification
            return notificationConfig.notification ? notificationConfig.notification : notificationConfig.getNotification(currentCompany);
        });
        // Nếu không có thông báo mới nào, thử lấy các thông báo ngẫu nhiên
        if (newNotifications.length == 0) {
            newNotifications = decisionNotificationsModule.getRandomEvents(currentCompany);
        }
        return newNotifications;
    };

    /**
     * Lấy các thông báo ngẫu nhiên.
     * @param {Company} company - Đối tượng công ty hiện tại.
     * @returns {Array<Notification>} - Mảng các đối tượng Notification ngẫu nhiên.
     */
    decisionNotificationsModule.getRandomEvents = function (company) {
        // Kiểm tra xem đã đến lúc kích hoạt sự kiện ngẫu nhiên tiếp theo chưa
        var shouldTriggerRandomEvent = company.flags.nextRandomEvent && company.flags.nextRandomEvent <= GameManager.gameTime;
        // Nếu chưa có thời gian cho sự kiện ngẫu nhiên tiếp theo, đặt một thời gian mới
        if (!company.flags.nextRandomEvent) {
            company.flags.nextRandomEvent = (48 + 24 * company.getRandom()) * GameManager.SECONDS_PER_WEEK * 1E3;
        }
        // Nếu đã đến lúc kích hoạt
        if (shouldTriggerRandomEvent) {
            // Đặt thời gian cho sự kiện ngẫu nhiên tiếp theo nữa
            var nextEventDelayWeeks = 36 + 48 * company.getRandom();
            company.flags.nextRandomEvent = GameManager.gameTime + nextEventDelayWeeks * GameManager.SECONDS_PER_WEEK * 1E3;
            // Lọc và chọn một sự kiện ngẫu nhiên
            var randomNotificationConfig = decisionNotificationsModule.getAllNotificationsObjects().filter(function (notificationConfig) {
                return notificationConfig.isRandomEvent && company.flags.lastRandomEventId != notificationConfig.id && shouldTriggerNotification(notificationConfig);
            }).pickRandom(); // pickRandom là một phương thức mở rộng của Array

            if (!randomNotificationConfig) return []; // Nếu không có sự kiện nào, trả về mảng rỗng
            company.flags.lastRandomEventId = randomNotificationConfig.id; // Lưu lại ID sự kiện vừa chọn để không lặp lại ngay
            incrementTriggerCount(randomNotificationConfig); // Tăng số lần kích hoạt
            return [randomNotificationConfig.getNotification(company)]; // Trả về thông báo
        }
        return []; // Nếu chưa đến lúc, trả về mảng rỗng
    };

    /**
     * Lấy tất cả các đối tượng cấu hình thông báo quyết định.
     * @returns {Array<object>} - Mảng các đối tượng cấu hình thông báo.
     */
    decisionNotificationsModule.getAllNotificationsObjects = function () {
        var notificationConfigs = [];
        var propertyName;
        // Duyệt qua tất cả các thuộc tính của decisionNotificationsModule
        for (propertyName in decisionNotificationsModule)
            // Nếu thuộc tính đó là của chính đối tượng (không phải kế thừa)
            if (decisionNotificationsModule.hasOwnProperty(propertyName)) {
                var notificationObject = decisionNotificationsModule[propertyName];
                // Nếu đối tượng có thuộc tính 'id' (đánh dấu là một cấu hình thông báo)
                if (typeof notificationObject.id != "undefined") {
                    notificationConfigs.push(notificationObject);
                }
            }
        // Thêm các thông báo từ mod
        notificationConfigs.addRange(decisionNotificationsModule.modNotifications); // addRange là một phương thức mở rộng của Array
        return notificationConfigs;
    };

    // Đăng ký decisionNotificationsModule như một nguồn thông báo với module General
    General.registerAsNotificationSource(decisionNotificationsModule);

    // Định nghĩa các thông báo quyết định cụ thể
    decisionNotificationsModule.hobbyComputerClub = {
        id: "hobbyComputerClub",
        isRandomEvent: !0, // Đánh dấu là sự kiện ngẫu nhiên
        trigger: function (company) { // Hàm kiểm tra điều kiện kích hoạt
            return !company.flags.hobbyComputerClub && company.currentLevel === 1 && company.gameLog.length > 1 && company.isEarlierOrEqualThan(2);
        },
        getNotification: function (company) { // Hàm tạo đối tượng Notification
            company.flags.hobbyComputerClub = !0; // Đặt cờ đã kích hoạt
            return new Notification({
                header: "Invitation".localize("heading"),
                text: "Hi, I'm Gordon Hench the host of the local hobby computer club. I just discovered that your company is close-by. I'm a huge fan of {0} and would love for you to join our meetup this week!\nEagerly awaiting your reply.\nGordon".localize().format(company.gameLog.pickRandom().title),
                sourceId: "hobbyComputerClub", // ID nguồn để callback
                options: ["Sure".localize("decision action button"), "No time".localize("decision action button")] // Các lựa chọn
            });
        },
        complete: function (choiceIndex) { // Hàm xử lý sau khi người chơi chọn
            var company = GameManager.company;
            if (choiceIndex === 0) { // Nếu chọn "Sure"
                company.activeNotifications.addRangeAt(0, new Notification("Invitation".localize("heading"), "Thank you very much! I'm sure our members will love what you have to say.\nGordon".localize()));
                company.notifications.push(new Notification({
                    header: "Computer Club".localize("heading"),
                    text: "Hi I'm Frank More. We met at the Hobby Computer Club a week ago. Just wanted to say thanks for talking about your projects. I love your games and have told all my friends about them.".localize(),
                    weeksUntilFired: 2
                }));
                var hypeBonus = 8 + 5 * company.getRandom();
                company.currentGame ? company.currentGame.hypePoints += hypeBonus : company.flags.nextGameHypeBonus += hypeBonus;
            } else { // Nếu chọn "No time"
                company.flags.secrecy++;
                company.activeNotifications.insertAt(0, new Notification("Invitation".localize("heading"), "Sorry to hear that you are busy.\nGordon".localize()));
            }
        }
    };

    decisionNotificationsModule.localNewsPaper = {
        id: "localNewsPaper",
        isRandomEvent: !0,
        trigger: function (company) {
            return !company.flags.localNewsPaper && company.currentLevel === 1 && company.gameLog.length >= 1 && company.isEarlierOrEqualThan(2, 7) && company.isGameProgressBetween(0.4, 0.9);
        },
        getNotification: function (company) {
            company.flags.localNewsPaper = !0;
            return new Notification({
                header: "Local News".localize("heading"),
                text: "Hi, I'm Caroline Richards from the local news. I've heard rumours that you are already working on your next game and would love to do an interview about this. Do you have some time?".localize(),
                options: ["Sure".localize("decision action button"), "No time".localize("decision action button")],
                sourceId: "localNewsPaper",
                previewImage: "./images/notificationIcons/icon_notification_local_news_and_media.png",
                type: NotificationType.IndustryNews
            });
        },
        complete: function (choiceIndex) {
            var company = GameManager.company;
            if (choiceIndex === 0) {
                company.activeNotifications.addRangeAt(0, (new Notification("Local News".localize("heading"), "Great!\n\n\n ... Thank you for your time.{n}The interview should be published soon.".localize())).split());
                company.flags.interviewHypePointsBonus = 5 + 8 * company.getRandom();
                var companyName = company.name;
                var playerName = company.staff[0].name;
                var newCombinationStatus = company.currentGame.flags.isNewCombination ? "not done".localize("localNewsPaperFragment") : "done".localize("localNewsPaperFragment");
                var interviewText = "{0}, a local start-up, is trying to make it big in the gaming industry. The company has already published {1} games and is working hard on their next.{n}In an interview founder {2} said that the next game is going to be a {3}/{4} game, something the company has {5} before. It's great to see small local companies enter exciting new industries. All the best of luck to {0}.".localize("{0} is company name, {1} nr. of games, {2} player name, {3} topic name, {4} genre name, {5} either not done/done (localNewsPaperFragment)").format(companyName,
                    company.gameLog.length, playerName, company.currentGame.topic.name, company.currentGame.genre.name, newCombinationStatus);
                company.notifications.push(new Notification({
                    header: "Local News".localize("heading"),
                    text: interviewText,
                    weeksUntilFired: 0.5,
                    sourceId: "localNewsActiveCallback", // Callback để áp dụng bonus sau khi tin tức được "đọc"
                    previewImage: "./images/notificationIcons/icon_notification_local_news_and_media.png",
                    type: NotificationType.IndustryNews
                }));
            } else {
                company.flags.secrecy++;
                company.activeNotifications.insertAt(0, new Notification("Local News".localize("heading"), "Sorry to bother you".localize()));
            }
        }
    };

    decisionNotificationsModule.localNewsActiveCallback = {
        id: "localNewsActiveCallback",
        trigger: function () { return !1; }, // Không tự trigger, được gọi bởi sự kiện khác
        complete: function () {
            // Áp dụng bonus hype sau khi thông báo phỏng vấn được hiển thị
            if (GameManager.company.currentGame && GameManager.company.flags.interviewHypePointsBonus) {
                GameManager.company.currentGame.hypePoints += GameManager.company.flags.interviewHypePointsBonus;
            }
            GameManager.company.flags.interviewHypePointsBonus = 0;
        }
    };

    decisionNotificationsModule.firstMatureGame = {
        id: "firstAdultGame", // Có vẻ tên 'firstMatureGame' sẽ nhất quán hơn
        trigger: function (company) {
            // Kích hoạt nếu đang phát triển game cho người lớn lần đầu
            if (company.isGameProgressBetween(0.35, 0.9) && company.currentGame.targetAudience === "mature" && !company.flags.firstMatureGame) {
                company.flags.firstMatureGame = !0;
                return !0;
            }
            return !1;
        },
        getNotification: function () {
            var headerText = "Media Enquiry".localize("heading");
            var bodyText = "Hi, I'm Steve O'Connell, a reporter for Planet GG.\nWe've heard a rumour that your company is developing a game for mature audiences.\nWould you be willing to give an interview about this?".localize();
            return new Notification({
                sourceId: "firstAdultGame", // 'firstMatureGame' sẽ nhất quán hơn
                header: headerText,
                text: bodyText,
                options: ["Give interview".localize("decision action button"), "No comment".localize("decision action button")],
                weeksUntilFired: 2,
                previewImage: "./images/notificationIcons/icon_notification_local_news_and_media.png",
                type: NotificationType.IndustryNews
            });
        },
        complete: function (choiceIndex) {
            var company = GameManager.company;
            var expertQuote = "Many industry experts say that sooner or later games with mature themes will become more common. We are curious to see how the market will react to these games.".localize();
            if (typeof company.flags.secrecy == "undefined") {
                company.flags.secrecy = 0;
            }
            if (choiceIndex === 0) { // Đồng ý phỏng vấn
                company.staff[0].adjustBoostRechargeProgress(0.3);
                company.staff[0].adjustEfficiency(0.3);
                company.flags.interviewHypePointsBonus = 5 + 12 * company.getRandom();
                company.notifications.push(new Notification({
                    header: "Industry News".localize("heading"),
                    text: "Planet GG has recently published an interview with {0}. According to the interview the company is working on its first game targeted at mature players. {1}, owner and CEO of {0} said, 'We think that players are looking for more mature content in games and we are willing to take a risk to give it to them.'{n}".localize("{0} company name, {1} staff name").format(company.name, company.staff[0].name) + expertQuote,
                    weeksUntilFired: 1,
                    sourceId: "firstMatureGameInterviewActiveCallback",
                    previewImage: "./images/notificationIcons/icon_notification_local_news_and_media.png",
                    type: NotificationType.IndustryNews
                }));
                company.activeNotifications.addRangeAt(0, (new Notification("Media Enquiry".localize("heading"), "Great!\n\n\n ... Thank you for your time.{n}We will publish the interview next week.".localize())).split());
            } else { // Từ chối phỏng vấn
                company.flags.secrecy++;
                company.flags.interviewHypePointsBonus = 2 + 4 * company.getRandom();
                company.notifications.push(new Notification({
                    header: "Industry News".localize("heading"),
                    text: "There have been rumours circulating in the industry that {0} might be working on a game for mature audiences.".localize("{0} company name").format(company.name) + expertQuote,
                    weeksUntilFired: 3,
                    sourceId: "firstMatureGameInterviewActiveCallback",
                    previewImage: "./images/notificationIcons/icon_notification_local_news_and_media.png",
                    type: NotificationType.IndustryNews
                }));
                company.activeNotifications.insertAt(0, new Notification("Media Enquiry".localize("heading"), "Okay. Thank you for your time.".localize()));
            }
        }
    };

    decisionNotificationsModule.firstMatureGameInterviewActiveCallback = {
        id: "firstMatureGameInterviewActiveCallback",
        trigger: function () { return !1; },
        complete: function () {
            if (GameManager.company.currentGame && GameManager.company.flags.interviewHypePointsBonus) {
                GameManager.company.currentGame.hypePoints += GameManager.company.flags.interviewHypePointsBonus;
            }
            GameManager.company.flags.interviewHypePointsBonus = 0;
        }
    };

    decisionNotificationsModule.moveToLevel2 = {
        id: "moveToLevel2",
        trigger: function (company) {
            var canMove = GameManager.isIdle() && company.currentLevel === 1 && company.gameLog.length > 0 && company.cash >= 1E6 && (!company.flags.lastMoveUpLevelQ || company.flags.lastMoveUpLevelQ <= GameManager.gameTime - 2E4 * GameManager.SECONDS_PER_WEEK);
            // Nếu là phiên bản lite/trial và đủ điều kiện, hiển thị thông báo giới hạn thay vì cho di chuyển
            if (canMove && GameManager.ghg0()) { // ghg0 có thể là cờ kiểm tra phiên bản lite/trial
                if (!company.flags.shownLvl2Move) {
                    company.notifications.push(new Notification("Lite version",
                        "You have amassed over {0} in cash!\nUsually I would suggest that you should grow your company by moving into a larger office but unfortunately there don't seem to be any larger offices available in the lite version.{n}You can still continue your game until year 4 to see how much cash you will end up with and how many fans you will gain.".localize("{0} cash amount").format(UI.getShortNumberString(company.cash))));
                    company.flags.shownLvl2Move = !0;
                }
                return !1; // Không cho di chuyển ở bản lite/trial
            }
            return canMove;
        },
        getNotification: function (company) {
            company.flags.lastMoveUpLevelQ = GameManager.gameTime; // Đánh dấu thời điểm đề nghị di chuyển
            var text = "Congratulations! You have made quite a name for yourself and have saved up a lot of capital. If you want to grow the company further then moving into a new office is the next step. I've found the perfect office, situated in a technology park. Would you like to move your company to the next level?".localize();
            return new Notification({
                sourceId: "moveToLevel2",
                header: "New Office?".localize("heading"),
                text: text,
                options: ["Move (pay {0})".localize("decision action button; move as in move to new office").format(UI.getShortNumberString(15E4)), // 150K
                "Not yet".localize("decision action button")
                ]
            });
        },
        complete: function (choiceIndex) {
            var company = GameManager.company;
            if (choiceIndex === 0) { // Chọn di chuyển
                company.currentLevel = 2;
                company.adjustCash(-15E4, "New Office".localize());
                VisualsManager.nextLevel(); // Hàm xử lý đồ họa khi lên level
                Media.createLevel2Notifications(); // Tạo các thông báo liên quan đến level 2
                Tutorial.level2(); // Kích hoạt tutorial cho level 2
                GameManager.save(GameManager.company.slot + "L2"); // Lưu game với đánh dấu level 2
            }
            ghg4.ghg5("move to level 2?", { decision: choiceIndex === 0 }); // Ghi log analytics
        }
    };

    // Thông báo về việc ngân hàng cứu trợ khi sắp phá sản
    decisionNotificationsModule.bailout = {
        id: "bailout",
        isRandomEvent: !1, // Không phải sự kiện ngẫu nhiên
        trigger: function (company) { return !1; }, // Được kích hoạt bởi logic kiểm tra phá sản
        canUse: function (company) { // Kiểm tra xem có thể sử dụng cứu trợ này không
            // Nếu đã có khoản cứu trợ đang chờ trả hoặc vừa trả xong gần đây thì không được
            return company.flags.bailoutAmount ? !1 : !company.flags.bailoutPaybackTime || company.flags.bailoutPaybackTime < GameManager.gameTime - 24E3 * GameManager.SECONDS_PER_WEEK;
        },
        getNotification: function (company) {
            var currentDebt = Math.abs(company.cash);
            // Số tiền cứu trợ phụ thuộc vào level hiện tại của công ty
            var bailoutAmount = currentDebt * [1.5, 2, 3.2, 2.5][company.currentLevel - 1];
            bailoutAmount = 1E3 * Math.floor(bailoutAmount / 1E3); // Làm tròn đến hàng nghìn
            company.flags.bailoutAmount = bailoutAmount;
            company.flags.bailoutPaybackAmount = 1.8 * bailoutAmount; // Số tiền phải trả lại (gồm lãi)

            var formattedBailoutAmount = UI.getLongNumberString(bailoutAmount);
            var text = "It seems that you have some serious financial difficulties and your company is about to go bankrupt. After careful consideration we have decided to offer you a deal.".localize();
            text += ("\n" + "We will give you {0} which should move you out of the danger zone but in return you have to commit to pay us {1} in a year's time.".localize());
            return new Notification({
                sourceId: "bailout",
                header: "Bank offer".localize("heading"),
                text: text.format(formattedBailoutAmount, UI.getLongNumberString(company.flags.bailoutPaybackAmount)),
                options: ["Agree (receive {0})".localize("decision action button").format(UI.getShortNumberString(bailoutAmount)), "No (go bankrupt)".localize("decision action button")],
                image: "./images/notificationIcons/icon_notification_bancruptcy.png",
                type: NotificationType.AutoPopup
            });
        },
        complete: function (choiceIndex) {
            var company = GameManager.company;
            if (choiceIndex === 0) { // Nếu đồng ý nhận cứu trợ
                var paybackAmount = 1.8 * company.flags.bailoutAmount;
                company.adjustCash(company.flags.bailoutAmount, "Bailout".localize("heading"));
                company.flags.bailoutPaybackTime = GameManager.gameTime + 48E3 * GameManager.SECONDS_PER_WEEK; // Thời điểm phải trả nợ
                company.flags.bailouts = isNaN(company.flags.bailouts) ? 1 : company.flags.bailouts + 1; // Đếm số lần nhận cứu trợ

                // Tạo thông báo nhắc nhở trả nợ
                var reminderNotification = new Notification("Bank".localize("heading"), "This is a reminder that we require you to pay back the agreed amount of {0} in three months' time.".localize().format(UI.getLongNumberString(paybackAmount)), {
                    weeksUntilFired: 36, // Sau 36 tuần (9 tháng)
                    previewImage: "./images/notificationIcons/icon_notification_bancruptcy.png"
                });
                reminderNotification.weeksUntilFired = 36; // Gán lại để chắc chắn
                company.notifications.push(reminderNotification);

                // Tạo thông báo trừ tiền khi đến hạn trả nợ
                var paybackNotification = new Notification("Bank".localize("heading"), "The amount of {0} has been deducted from your account.".localize().format(UI.getLongNumberString(paybackAmount)), {
                    previewImage: "./images/notificationIcons/icon_notification_new_money_penalty.png"
                });
                paybackNotification.adjustCash(-paybackAmount, "Bailout payback".localize("heading"));
                paybackNotification.setFlag("bailoutAmount", 0); // Reset cờ số tiền cứu trợ
                paybackNotification.setFlag("bailoutOffered", !1); // Reset cờ đã đề nghị cứu trợ
                paybackNotification.weeksUntilFired = 48; // Sau 48 tuần (1 năm)
                paybackNotification.type = NotificationType.AutoPopup;
                company.notifications.push(paybackNotification);
            }
            company.flags.bailoutOffered = !0; // Đánh dấu đã đề nghị cứu trợ (dù đồng ý hay không)
            ghg4.ghg5("bailout?", { decision: choiceIndex === 0, year: company.getCurrentDate().year });
            if (choiceIndex !== 0) {
                GameManager.checkGameOver(); // Nếu từ chối, kiểm tra lại xem có phá sản không
            }
        }
    };

    // Cứu trợ nhỏ khi vừa phát hành game mà bị âm tiền
    decisionNotificationsModule.miniBailout = {
        id: "miniBailout",
        canUse: function (company) {
            return company.gameLog.length > 0 && !company.gameLog.last().flags.miniBailoutUsed;
        },
        getNotification: function (company) {
            company.gameLog.last().flags.miniBailoutUsed = !0; // Đánh dấu đã sử dụng cứu trợ nhỏ cho game này
            var bailoutAmount = Math.abs(company.cash) + 2 * General.getMonthlyCosts(company);
            company.flags.miniBailoutAmount = bailoutAmount;
            var text = "We see that you are in financial difficulties. Since you've just released your latest game {0}, we are willing to offer you a mini-credit to get you over this months' payments.\n\nWe will give you {1} to cover your costs and expect to be paid back the full amount, plus a small adminstration fee of {2} in two months time.".localize().format(company.gameLog.last().title,
                UI.getLongNumberString(bailoutAmount), UI.getShortNumberString(25E3)); // Phí quản lý 25K
            return new Notification({
                header: "Bank".localize("heading"),
                text: text,
                sourceId: "miniBailout",
                options: ["Agree (receive {0})".localize("decision action button").format(UI.getShortNumberString(bailoutAmount)), "No (go bankrupt)".localize("decision action button")],
                image: "./images/notificationIcons/icon_notification_bancruptcy.png",
                type: NotificationType.AutoPopup
            });
        },
        complete: function (choiceIndex) {
            if (choiceIndex === 0) {
                var company = GameManager.company;
                var bailoutAmount = company.flags.miniBailoutAmount;
                company.adjustCash(bailoutAmount, "Bailout".localize("heading"));

                // Thông báo trả nợ sau 2 tháng (8 tuần)
                var paybackNotification = new Notification("Bank".localize("heading"), "The amount of {0} has been deducted from your account.".localize().format(UI.getLongNumberString(-bailoutAmount - 25E3)), { // Trừ cả gốc lẫn phí
                    previewImage: "./images/notificationIcons/icon_notification_new_money_penalty.png"
                });
                paybackNotification.weeksUntilFired = 8;
                paybackNotification.adjustCash(-bailoutAmount - 25E3, "Bailout payback".localize("heading"));
                paybackNotification.type = NotificationType.AutoPopup;
                company.notifications.push(paybackNotification);
            } else {
                GameManager.checkGameOver();
            }
        }
    };

    // Cứu trợ khi đang phát triển game mà sắp phá sản
    decisionNotificationsModule.inDevBailout = {
        id: "inDevBailout",
        canUse: function (company) {
            return !company.currentGame.flags.miniBailoutAmount; // Chưa nhận cứu trợ cho game hiện tại
        },
        getNotification: function (company) {
            // Tính toán số tiền cần để sống sót đến khi game hoàn thành + 6 tuần dự phòng
            var bailoutAmount = Math.abs(company.cash) + General.getMonthlyCosts(company) * (General.getApproxWeeksToCompletion(company.currentGame) + 6);
            company.currentGame.flags.miniBailoutAmount = bailoutAmount; // Lưu số tiền cứu trợ vào cờ của game
            var text = "We see that you are, again, in serious financial difficulties. We are willing to offer you a mini-credit to tie you over until your current game is on the market.\n\nWe will give you {1} to cover your costs and expect to be paid back the full amount, plus a fee of {2}, one month after the game is released.".localize().format(company.currentGame.title,
                UI.getLongNumberString(bailoutAmount), UI.getShortNumberString(0.05 * bailoutAmount)); // Phí là 5%
            return new Notification({
                header: "Bank".localize("heading"),
                text: text,
                sourceId: "inDevBailout",
                options: ["Agree (receive {0})".localize("decision action button").format(UI.getShortNumberString(bailoutAmount)), "No (go bankrupt)".localize("decision action button")],
                image: "./images/notificationIcons/icon_notification_bancruptcy.png",
                type: NotificationType.AutoPopup
            });
        },
        complete: function (choiceIndex) {
            if (choiceIndex === 0) {
                var company = GameManager.company;
                company.adjustCash(company.currentGame.flags.miniBailoutAmount, "Bailout".localize("heading"));
            } else {
                GameManager.checkGameOver();
            }
        },
        triggerPayBack: function (game, delayWeeks) { // Hàm kích hoạt việc trả nợ
            var company = GameManager.company;
            var bailoutAmount = game.flags.miniBailoutAmount;
            var paybackNotification = new Notification("Bank".localize("heading"), "The amount of {0} has been deducted from your account.".localize().format(UI.getLongNumberString(-bailoutAmount - 25E3)), { // Chú ý: ở đây vẫn dùng 25K, có thể là lỗi copy-paste từ miniBailout
                previewImage: "./images/notificationIcons/icon_notification_new_money_penalty.png"
            });
            paybackNotification.adjustCash(-bailoutAmount - 0.05 * bailoutAmount, "Bailout payback".localize("heading")); // Trả đúng 5%
            paybackNotification.weeksUntilFired = delayWeeks + 5; // Sau khi game ra mắt 1 tháng (4 tuần) + 1 tuần
            paybackNotification.type = NotificationType.AutoPopup;
            company.notifications.push(paybackNotification);
        }
    };

    decisionNotificationsModule.gameOver = {
        id: "gameOver",
        trigger: function (company) { return !1; }, // Được kích hoạt bởi logic checkGameOver
        getNotification: function (company) {
            return new Notification({
                sourceId: "gameOver",
                header: "Game Over".localize("heading"),
                text: "This is the end of your journey.\n\nYou can either load a saved game, restart this level or start a new game.".localize(),
                options: ["Restart level".localize("decision action button"), "Start over".localize("decision action button")],
                image: "./images/notificationIcons/icon_notification_bancruptcy.png",
                type: NotificationType.AutoPopup
            });
        },
        complete: function (choiceIndex) {
            var company = GameManager.company;
            if (choiceIndex === 0) { // Restart level
                GameManager.reload(company.slot + "L" + company.currentLevel); // Tải lại save của level hiện tại
            } else { // Start over
                GameManager.startNewGame();
            }
            ghg4.ghg5("Restart level?", { decision: choiceIndex === 0 });
        }
    };

    decisionNotificationsModule.moveToLevel3 = {
        id: "moveToLevel3",
        trigger: function (company) {
            return GameManager.isIdle() && company.currentLevel === 2 && company.staff.length > 1 && company.cash >= 5E5 && company.currentWeek >= General.getWeekFromDateString("11/6/2", !0) && (!company.flags.lastMoveUpLevelQ || company.flags.lastMoveUpLevelQ <= GameManager.gameTime - 2E4 * GameManager.SECONDS_PER_WEEK);
        },
        getNotification: function (company) {
            company.flags.lastMoveUpLevelQ = GameManager.gameTime;
            var staffMember = company.staff.skip(1).pickRandom(); // Chọn một nhân viên ngẫu nhiên (không phải người chơi chính)
            var text = "Boss, our office could really do with some renovation work and our computer systems are also out of date. Investing a little bit in a more modern office and upgraded computers would be a great.\nDo you want to renovate the office?".localize();
            return new Notification({
                sourceId: "moveToLevel3",
                header: staffMember.name,
                text: text,
                options: ["Invest (pay {0})".localize("decision action button").format(UI.getShortNumberString(15E4)), // 150K
                "Not yet".localize("decision action button")
                ]
            });
        },
        complete: function (choiceIndex) {
            var company = GameManager.company;
            if (choiceIndex === 0) {
                company.currentLevel = 3;
                company.adjustCash(-15E4, "New equipment".localize());
                VisualsManager.nextLevel();
                // Thông báo về G3 Training (khóa huấn luyện mới)
                var g3TrainingNotification = new Notification("G3 Training".localize(), "Dear {0}!\nSince G3 has become the biggest meetup of game developers every year we have decided to use our name for the greater good. Starting today we offer different game development challenges throughout the year where game devs from around the world can compete with each other.{n}This will be a great way for game developers to learn something new. You are welcome to join in at any time. There are no prizes but it should be a great way to increase everyone's skills.\nThe G3 committee.".localize("{0} company name").format(company.name), {
                    previewImage: "./images/notificationIcons/icon_notification_convention.png",
                    weeksUntilFired: 2
                });
                g3TrainingNotification.setFlag("trainingV2Enabled", !0); // Mở khóa các khóa training version 2
                company.notifications.push(g3TrainingNotification);
                GameManager.save(GameManager.company.slot + "L3"); // Lưu game với đánh dấu level 3
            }
            ghg4.ghg5("move to level 3?", { decision: choiceIndex === 0 });
        }
    };

    decisionNotificationsModule.moveToLevel4 = {
        id: "moveToLevel4",
        trigger: function (company) {
            return GameManager.isIdle() && company.currentLevel === 3 && company.staff.length > 3 && company.cash >= 16E6 && company.currentWeek >= General.getWeekFromDateString("13/9/2", !0) && (!company.flags.lastMoveUpLevelQ || company.flags.lastMoveUpLevelQ <= GameManager.gameTime - 2E4 * GameManager.SECONDS_PER_WEEK);
        },
        getNotification: function (company) {
            company.flags.lastMoveUpLevelQ = GameManager.gameTime;
            var staffMember = company.staff[1]; // Nhân viên thứ hai (sau người chơi)
            var text = "Boss, {0} has grown well under your management. I think it is time to move the company out of this technology park and into a building worthy of our success.{n}I've seen the perfect building for our new headquarters.\nIt's not cheap but will allow us to grow even further. The new office also has space for additional expansions.\nDo you want to move?".localize("{0} company name").format(company.name);
            return new Notification({
                sourceId: "moveToLevel4",
                header: staffMember.name,
                text: text,
                options: ["Move (pay {0})".localize("decision action button; move as in move to new office").format(UI.getShortNumberString(8E6)), // 8 Triệu
                "Not yet".localize("decision action button")
                ]
            });
        },
        complete: function (choiceIndex) {
            var company = GameManager.company;
            if (choiceIndex === 0) {
                company.currentLevel = 4;
                company.maxStaff = 7; // Số nhân viên tối đa tăng lên
                company.adjustCash(-8E6, "New office".localize());
                VisualsManager.nextLevel();
                Media.createLevel4Notifications(); // Tạo các thông báo liên quan đến level 4
                GameManager.save(GameManager.company.slot + "L4");
            }
            ghg4.ghg5("move to level 4?", { decision: choiceIndex === 0 });
        }
    };

    // Mở khóa phòng lab phần cứng
    decisionNotificationsModule.unlockHwLab = {
        id: "unlockHwLab",
        trigger: function (company) {
            // Điều kiện: level 4, đã nghiên cứu phần cứng tùy chỉnh, chưa mở lab, có chuyên gia công nghệ, và chưa hỏi gần đây
            return company.currentLevel === 4 && company.flags.customHardwareResearched && !company.flags.hwLabUnlocked && company.staff.some(function (staff) {
                return staff.flags.technologySpecialist;
            }) && (!company.flags.lastHwQuestion || company.flags.lastHwQuestion <= GameManager.gameTime - 2E4 * GameManager.SECONDS_PER_WEEK);
        },
        getNotification: function (company) {
            company.flags.lastHwQuestion = GameManager.gameTime;
            var text = "We can open our own hardware lab now.".localize();
            var techSpecialist = company.staff.first(function (staff) { return staff.flags.technologySpecialist; });
            company.flags.selectedStaffName = techSpecialist.name; // Lưu tên nhân viên đề xuất
            return new Notification({
                header: techSpecialist.name,
                text: text,
                sourceId: "unlockHwLab",
                options: ["Let's do it! (pay {0})".localize("decision action button").format(UI.getShortNumberString(5E6)), // 5 Triệu
                "Not yet".localize("decision action button")
                ]
            });
        },
        complete: function (choiceIndex) {
            var company = GameManager.company;
            if (choiceIndex === 0) {
                company.adjustCash(-5E6, "Hardware lab".localize());
                company.flags.hwLabUnlocked = !0;
                GameManager.company.flags.hwBudget = 0; // Ngân sách ban đầu
                GameManager.company.flags.fractionalHwLabCosts = 0; // Chi phí lẻ
                company.notifications.push(new Notification("Hardware lab".localize(), "Our hardware lab is ready.".localize(), { type: NotificationType.AutoPopup }));
                Tutorial.hwLabReady();
                // Xử lý làm mờ và tải lại giao diện
                GameManager.pause(!0);
                UI.fadeInTransitionOverlay(function () {
                    VisualsManager.loadStage(!0);
                    VisualsManager.refreshLabCrew();
                    VisualsManager.updateProjectStatusCards();
                    UI.fadeOutTransitionOverlay(function () { GameManager.resume(!0); });
                });
            }
            ghg4.ghg5("unlocked hardware lab?", { decision: choiceIndex === 0 });
        }
    };

    // Mở khóa phòng lab R&D
    decisionNotificationsModule.unlockRnDLab = {
        id: "unlockRnDLab",
        trigger: function (company) {
            return company.currentLevel === 4 && !company.flags.rndLabUnlocked && company.staff.some(function (staff) {
                return staff.flags.designSpecialist;
            }) && (!company.flags.lastRnDQuestion || company.flags.lastRnDQuestion <= GameManager.gameTime - 2E4 * GameManager.SECONDS_PER_WEEK);
        },
        getNotification: function (company) {
            company.flags.lastRnDQuestion = GameManager.gameTime;
            var text = "We can open our own research and development lab now.".localize();
            var designSpecialist = company.staff.first(function (staff) { return staff.flags.designSpecialist; });
            company.flags.selectedStaffName = designSpecialist.name;
            return new Notification({
                header: designSpecialist.name,
                text: text,
                sourceId: "unlockRnDLab",
                options: ["Let's do it! (pay {0})".localize("decision action button").format(UI.getShortNumberString(25E5)), // 2.5 Triệu
                "Not yet".localize("decision action button")
                ]
            });
        },
        complete: function (choiceIndex) {
            var company = GameManager.company;
            if (choiceIndex === 0) {
                company.adjustCash(-25E5, "R&D lab".localize());
                company.flags.rndLabUnlocked = !0;
                GameManager.company.flags.rndBudget = 0;
                GameManager.company.flags.fractionalRndLabCosts = 0;
                company.notifications.push(new Notification("R&D lab".localize(), "Our R&D  lab is ready.".localize(), { type: NotificationType.AutoPopup }));
                Tutorial.rndLabReady();
                GameManager.pause(!0);
                UI.fadeInTransitionOverlay(function () {
                    VisualsManager.loadStage(!0);
                    VisualsManager.refreshLabCrew();
                    VisualsManager.updateProjectStatusCards();
                    UI.fadeOutTransitionOverlay(function () { GameManager.resume(!0); });
                });
            }
            ghg4.ghg5("unlocked r&d lab?", { decision: choiceIndex === 0 });
        }
    };

    // Sa thải nhân viên
    decisionNotificationsModule.fireEmployee = {
        id: "fireEmployee",
        trigger: function () { return !1; }, // Được kích hoạt từ menu ngữ cảnh
        getNotification: function (company, employeeToFire) {
            if (employeeToFire) {
                company.flags.fireEmployeeId = employeeToFire.id; // Lưu ID nhân viên cần sa thải
                return new Notification({
                    sourceId: "fireEmployee",
                    header: "Fire employee?".localize("heading"),
                    text: "Are you sure you want to fire {0}?".localize("{0} staff name").format(employeeToFire.name),
                    options: ["Yes".localize(), "No".localize()],
                    type: NotificationType.AutoPopup
                });
            }
        },
        complete: function (choiceIndex) {
            if (choiceIndex === 0) {
                var employee = GameManager.company.staff.first(function (emp) { return emp.id === GameManager.company.flags.fireEmployeeId; });
                if (employee) {
                    // Nếu nhân viên đang nghiên cứu, hủy bỏ nghiên cứu đó
                    if (employee.currentResearch) {
                        GameManager.currentResearches.remove(employee.currentResearch);
                    }
                    employee.fire(); // Hàm sa thải nhân viên
                    GDT.fire(GameManager, GDT.eventKeys.gameplay.staffFired, { character: employee });
                    ghg4.ghg5("fired staff");
                }
            }
        }
    };

    // Nâng cấp bảo mật
    decisionNotificationsModule.securityUpgrade = {
        id: "securityUpgrade1",
        isRandomEvent: !0,
        trigger: function (company) {
            return company.staff.length >= 2 && !company.flags.securityUpgrades;
        },
        getNotification: function (company) {
            var staffMember = company.staff.skip(1).pickRandom();
            company.flags.securityUpgradeStaffRef = staffMember.id; // Lưu nhân viên đề xuất
            return new Notification({
                sourceId: "securityUpgrade1",
                header: staffMember.name,
                text: "Hi Boss! I have a knack for security and I think we could really do with some security upgrades in our office.\nI have done some research and I think with an investment of {0} we would be a lot safer than we are now.\nWhat do you say?".localize("{0} amount").format(UI.getShortNumberString(5E4)), // 50K
                options: ["Yes (invest {0})".localize("decision action button").format(UI.getShortNumberString(5E4)), "No".localize()]
            });
        },
        complete: function (choiceIndex) {
            var company = GameManager.company;
            var staffName = "";
            var staffWhoSuggested = company.staff.first(function (staff) { return staff.id === company.flags.securityUpgradeStaffRef; });
            var efficiencyChange = 0.3;

            if (choiceIndex == 1) { // Từ chối
                efficiencyChange *= -1; // Giảm hiệu suất nếu từ chối
            }
            if (staffWhoSuggested) {
                staffWhoSuggested.adjustEfficiency(efficiencyChange);
                staffName = staffWhoSuggested.name;
            }

            var responseText;
            if (choiceIndex === 0) { // Đồng ý
                responseText = "Thanks Boss!\nI will get right to it.".localize();
                company.flags.securityUpgrades = 1;
                company.cash -= 5E4;
                company.cashLog.push({ amount: -5E4, label: "security upgrades" });
            } else {
                responseText = "Okay, sorry that I bothered you.".localize();
            }
            GameManager.company.activeNotifications.insertAt(0, new Notification({ header: staffName, text: responseText }));
        }
    };

    // Hàm tạo tên công ty bị "nhái" một cách hài hước
    var generateScamCompanyName = function () {
        var company = GameManager.company;
        return company.getRandom() > 0.3 ? company.name : typoCompanyName(company.name);
    };
    // Hàm tạo lỗi chính tả cho tên công ty
    var typoCompanyName = function (name) {
        if (name.length > 3) {
            var charToSwap = name[3];
            name = name.replaceAt(3, name[2]); // replaceAt là phương thức mở rộng
            name = name.replaceAt(2, charToSwap);
        }
        if (name.length > 7) {
            charToSwap = name[6];
            name = name.replaceAt(6, name[5]);
            name = name.replaceAt(5, charToSwap);
        }
        return name;
    };

    // Lừa đảo kiểu Nigeria
    decisionNotificationsModule.scam1 = {
        id: "scam1",
        isRandomEvent: !0,
        trigger: function (company) {
            return company.isLaterOrEqualThan(10) && !company.flags.scam1;
        },
        getNotification: function (company) {
            company.flags.scam1 = !0;
            var scamCompanyName = typoCompanyName(company.name); // Tạo tên công ty bị viết sai
            var scamText = "HgqNHQobJHLKypvBXJPe6+Eg1Z0Dccx Ra585nXkuRPR9AWS QZoIqQkcTm+qO7ahqZXq YL1P5qU39WUpJDrUgj 4jsQdncebVlj3oQhkAvC7z0ZH jz4yCn0h/dLlNzspebs6B7 C9QwqCY2KIizX3DRvA4 RIb1D99e6mC1mPLNlQ j9WenbAbWXGw8yK/AQeBO2G==" + // Chuỗi mã hóa giả
                "{n}This is a very special offer. Our agents have recently managed to 'borrow' some research information which might be of interest to you.\nIf you are interested then transfer {0} to the enclosed uplink location.\nWe'll contact you, Agent Blowfish".localize("use writing style of secret agent msg (in game it was decrypted). keep words 'blowfish' and 'uplink' in the message.").format(UI.getShortNumberString(company.flags.industrialSpyTopicAmount));

            // Sửa lại text cho scam1, vì text ở trên có vẻ là của industrialSpyTopic
            var investmentAmount = 25E5;
            var verificationPayment = 12E4;
            company.flags.scam1InvestmentAmount = investmentAmount; // Lưu lại để dùng sau nếu cần
            company.flags.scam1VerificationPayment = verificationPayment;

            scamText = "Dear esteemed sir/madame.\nI'm financial advisor to CEO at WOMOBA OIL LIMITED in Nigeria. I'm writing because I know of your high repute and trustworthiness. Our CEO has authorzied me to invest {0} in {1}.{n}We have deposited the amount at a safe bank and will transfer this money to you but the bank requires confirmation from you. If you wish to receive the funds you must transfer a one-time verification payment of {2}. I trust in you.".localize("Note: this is a scam msg in game. immitate scammers language such as odd choice of words,  typos etc. {0} investAmount, {1} company name, {2} payment amount").format(UI.getShortNumberString(investmentAmount),
                scamCompanyName, UI.getShortNumberString(verificationPayment));

            return new Notification({
                sourceId: "scam1",
                header: "Investment".localize("heading"),
                text: scamText,
                options: ["Pay ({0})".localize("decision action button").format(UI.getShortNumberString(verificationPayment)), "Decline".localize("decision action button")]
            });
        },
        complete: function (choiceIndex) {
            var company = GameManager.company;
            if (choiceIndex === 0) { // Nếu đồng ý trả tiền
                company.adjustCash(-company.flags.scam1VerificationPayment, "Gullibility Tax".localize("name of expense when player falls into the scam trap."));
                company.staff.skip(1).forEach(function (staffMember) { // Nhân viên (trừ người chơi) bị giảm hiệu suất
                    staffMember.adjustEfficiency(-0.3);
                });
            }
            ghg4.ghg5("scam", { decision: choiceIndex === 0 }); // Log analytics
            // Thông báo tin tức về vụ lừa đảo
            company.notifications.push(new Notification("News".localize("heading"), "It appears that recently a few companies have fallen victim to Nigerian scammers.\nThe scammers often claimed to invest large sums of money into companies but required a sizable up-front payment to make the deal.{n}Those who were unwise enough to pay will not see their money again.\nPolice are investigating but seem helpless to stop these international scammers.".localize(),
                "OK".localize(), 5 + 4 * company.getRandom(), {
                type: NotificationType.Others,
                previewImage: "./images/notificationIcons/icon_notification_local_news_and_media.png"
            }));
        }
    };

    // Yêu cầu vá lỗi game
    decisionNotificationsModule.patchRequired = {
        id: "patchRequired",
        isRandomEvent: !0,
        trigger: function (company) {
            // Điều kiện: level > 1, có > 2 game đã phát hành, > 100 fan, game cuối cùng đã ra mắt > 2 tuần và < 30 tuần,
            // đang phát triển game mới (progress > 0.1), và chưa có sự kiện vá lỗi gần đây.
            return company.currentLevel > 1 && company.gameLog.length > 2 && company.fans > 100 && company.gameLog.last().releaseWeek + 2 < company.currentWeek && company.isGameProgressBetween(0.1) && company.gameLog.last().releaseWeek + 30 > company.currentWeek && (!company.flags.patchData || company.flags.patchData.lastPatchEvent + 6E4 * GameManager.SECONDS_PER_WEEK < GameManager.gameTime);
        },
        getNotification: function (company) {
            if (!company.flags.patchData) { company.flags.patchData = {}; }
            company.flags.patchData.lastPatchEvent = GameManager.gameTime; // Đánh dấu thời điểm sự kiện
            var lastGame = company.gameLog.last();
            var patchCostFactor = Math.floor((0.05 * lastGame.costs + 0.15 * lastGame.costs * company.getRandom()) / 1E4);
            company.flags.patchData.gameName = lastGame.title;
            company.flags.patchData.canEarnBonus = lastGame.bugs < 5; // Có thể nhận bonus nếu game ít lỗi
            company.flags.patchData.patchCost = 1E4 * patchCostFactor + 1E4; // Chi phí vá lỗi
            company.flags.patchData.patchAvailableUntil = GameManager.gameTime + 3E3 * GameManager.SECONDS_PER_WEEK; // Thời hạn vá lỗi

            var fansLost = Math.abs(Math.floor(0.1 * lastGame.fansChanged + 0.2 * lastGame.fansChanged * company.getRandom()));
            company.adjustFans(-fansLost); // Giảm fan do lỗi
            company.flags.patchData.fansChange = fansLost;

            // Tạo thông báo tin tức nếu người chơi không vá lỗi kịp
            var newsNotification = new Notification({
                flags: { isPatchNotification: !0 },
                header: "News".localize("heading"),
                text: "The recent pleas for a patch for {0} seem to have been unanswered by {1}.\nMany fans have voiced their disappointment.".localize("{0} game title, {1} company name").format(lastGame.title, company.name),
                weeksUntilFired: 7, // Sau 7 tuần
                type: NotificationType.Others,
                previewImage: "./images/notificationIcons/icon_notification_local_news_and_media.png"
            });
            company.notifications.push(newsNotification);

            // Thông báo chính yêu cầu vá lỗi
            return new Notification({
                header: "Bugs!".localize("heading"),
                text: "Oh no! It seems that {0} had quite a few undiscovered bugs when we released it.\nSome of our customers are having a bad time with this and they demand that we patch the game.{n}We could either spend the money and time to patch it or ignore their pleas. If you want to patch the game then {1} on a character and use the action menu to develop a patch but make sure that you don't wait for too long.".localize("{0} game title, {1} click/touch verb").format(lastGame.title, Tutorial.getClickVerb()),
                type: NotificationType.Events,
                previewImage: "./images/notificationIcons/icon_notification_gamers_enquiry.png"
            });
        }
    };

    var administrativeExpenseLabel = "Administrative Expenses".localize("label of expense for illegal activity");

    // Gián điệp công nghiệp - lấy cắp topic
    decisionNotificationsModule.industrialSpyTopic = {
        id: "industrialSpyTopic",
        isRandomEvent: !0,
        trigger: function (company) {
            return company.cash > 0 && company.isLaterOrEqualThan(4) && company.researchEnabled && Topics.topics.except(company.topics).length > 3 && (!company.flags.industrialSpyTopic || company.flags.industrialSpyTopic < 2);
        },
        getNotification: function (company) {
            var randomUnresearchedTopic = Topics.topics.except(company.topics).pickRandom();
            company.flags.industrialSpyTopicRef = randomUnresearchedTopic.id; // Lưu topic bị nhắm tới
            if (typeof company.flags.industrialSpyTopic == "undefined") {
                company.flags.industrialSpyTopic = 1;
            } else {
                company.flags.industrialSpyTopic++;
            }
            var cost = 5 + 60 * company.getRandom();
            cost = 1E3 * Math.floor(cost); // Chi phí
            company.flags.industrialSpyTopicAmount = cost;
            var spyMessage = "HgqNHQobJHLKypvBXJPe6+Eg1Z0Dccx Ra585nXkuRPR9AWS QZoIqQkcTm+qO7ahqZXq YL1P5qU39WUpJDrUgj 4jsQdncebVlj3oQhkAvC7z0ZH jz4yCn0h/dLlNzspebs6B7 C9QwqCY2KIizX3DRvA4 RIb1D99e6mC1mPLNlQ j9WenbAbWXGw8yK/AQeBO2G==" +
                "{n}This is a very special offer. Our agents have recently managed to 'borrow' some research information which might be of interest to you.\nIf you are interested then transfer {0} to the enclosed uplink location.\nWe'll contact you, Agent Blowfish".localize("use writing style of secret agent msg (in game it was decrypted). keep words 'blowfish' and 'uplink' in the message.").format(UI.getShortNumberString(cost));
            return new Notification({
                sourceId: "industrialSpyTopic",
                header: "Proposition".localize("heading"),
                text: spyMessage,
                buttonText: "Decrypt Message".localize("decision action button"), // Nút ban đầu để "giải mã"
                options: ["Transfer ({0})".localize("decision action button; as in Transfer amount of money").format(UI.getShortNumberString(cost)), "Decline".localize("decision action button")]
            });
        },
        complete: function (choiceIndex) {
            var company = GameManager.company;
            if (choiceIndex === 0) { // Đồng ý trả tiền
                var cost = company.flags.industrialSpyTopicAmount;
                var topicToLearn = Topics.topics.first(function (topic) { return topic.id === company.flags.industrialSpyTopicRef; });
                company.adjustCash(-cost, administrativeExpenseLabel);
                company.topics.push(topicToLearn); // Thêm topic mới
                var confirmationMessage = "OLvsz3uLP6QeZEeL0XuUDw===={n}" + "Thank you for your business.".localize() + "\n\n" + "You have successfully researched {0}.".localize("{0} topic name").format(topicToLearn.name);
                company.activeNotifications.addRangeAt(0, (new Notification({
                    header: "Transaction complete".localize("heading"),
                    text: confirmationMessage,
                    buttonText: ["Decrypt Message".localize("decision action button"), "OK".localize()]
                })).split());
                company.flags.evil++; // Tăng điểm "ác"
                ghg4.ghg5("evil");
            } else { // Từ chối
                if (company.flags.secrecy) { company.flags.secrecy++; }
                company.flags.good++; // Tăng điểm "tốt"
                ghg4.ghg5("good");
            }
            ghg4.ghg5("accepted spy?", { decision: choiceIndex === 0 });
        }
    };

    // Phá hoại công nghiệp
    decisionNotificationsModule.industrialSabotage = {
        id: "industrialSabotage",
        isRandomEvent: !0,
        trigger: function (company) {
            return company.cash > 0 && company.isLaterOrEqualThan(6) && (!company.flags.industrialSabotage || company.flags.industrialSabotage < 2);
        },
        getNotification: function (company) {
            if (typeof company.flags.industrialSabotage == "undefined") {
                company.flags.industrialSabotage = 1;
            } else {
                company.flags.industrialSabotage++;
            }
            var cost = 50 + 120 * company.getRandom();
            cost = 1E3 * Math.floor(cost);
            company.flags.industrialSabotageAmount = cost;
            var spyMessage = "A9zbngUAfnu5aIo7ot2J LouBaOVUlVftN22gJaP2V3gS+N7 7vaRCtIb2TpaVPsh651s3sT6n gp21VgO2KCiFRtKhp/he OixN+XSB00RBXZhMrb1rYNWsZ+xRNBTZCljm/U QrUmzYrArkPNeusa65R+y TNXSWMZmWSSMv+mAokr0==={n}" +
                "This is a very special offer. Our agents have recently managed to gain access to some critical systems of one of your competitors.\nIf you want to play war games then transfer {0} to the enclosed location and we'll initiate sabotage.,\nAgent Blowfish".localize("use writing style of secret agent msg (in game it was decrypted). keep words 'war games' and 'blowfish' in the message.").format(UI.getShortNumberString(cost));
            return new Notification({
                sourceId: "industrialSabotage",
                header: "Proposition".localize("heading"),
                text: spyMessage,
                buttonText: "Decrypt Message".localize("decision action button"),
                options: ["Sabotage ({0})".localize("decision action button").format(UI.getShortNumberString(cost)), "Decline".localize("decision action button")]
            });
        },
        complete: function (choiceIndex) {
            var company = GameManager.company;
            if (choiceIndex === 0) {
                company.adjustCash(-company.flags.industrialSabotageAmount, administrativeExpenseLabel);
                var confirmationMessage = "0DeAZWaEfhmiEuRgn7WWdw===={n}" + "Thank you for your business.".localize();
                company.activeNotifications.addRangeAt(0, (new Notification({
                    header: "Transaction complete".localize("heading"),
                    text: confirmationMessage,
                    buttonText: ["Decrypt Message".localize("decision action button"), "OK".localize()]
                })).split());
                company.flags.evil++;
                ghg4.ghg5("evil");
                company.getRandom(); // Có vẻ để thay đổi seed ngẫu nhiên
                // Thông báo tin tức về vụ phá hoại
                company.notifications.push(new Notification({
                    header: "News".localize("heading"),
                    text: "In a statement the game development company {0} has said that they have been the victim of industrial sabotage. Unfortunately development on their current project has been severely affected.\nPolice are investigating.".localize("{0} is random company name").format(CompanyNames.pickRandom()), // CompanyNames là một mảng tên công ty ngẫu nhiên
                    weeksUntilFired: 3 + 4 * company.getRandom(),
                    type: NotificationType.Others,
                    previewImage: "./images/notificationIcons/icon_notification_local_news_and_media.png"
                }));
            } else {
                company.flags.good++;
                ghg4.ghg5("good");
            }
            ghg4.ghg5("sabotaged?", { decision: choiceIndex === 0 });
        }
    };

    // Sự kiện về phụ nữ trong ngành công nghệ
    decisionNotificationsModule.womenInTech = {
        id: "womenInTech",
        isRandomEvent: !0,
        trigger: function (company) {
            return !company.flags.womenInTech && company.cash > 0 && company.isLaterOrEqualThan(9) && company.staff.length > 1;
        },
        getNotification: function (company) {
            var staffMember = company.staff.skip(1).pickRandom();
            var sponsorshipAmount = 4 + 7 * company.getRandom();
            sponsorshipAmount = 1E4 * Math.floor(sponsorshipAmount); // Làm tròn đến 10K
            company.flags.womenInTechAmount = sponsorshipAmount;
            company.flags.womenInTech = !0;
            var text = "Hi Boss! A friend of mine is greatly involved in an organization which aims to get more women into technology. They are looking for a sponsor and I thought that this would be a perfect opportunity for us.\nWould you like to help out?".localize();
            return new Notification({
                sourceId: "womenInTech",
                header: staffMember.name,
                text: text,
                options: ["Sponsor (pay {0})".localize("decision action button").format(UI.getShortNumberString(sponsorshipAmount)), "Decline".localize("decision action button")]
            });
        },
        complete: function (choiceIndex) {
            var company = GameManager.company;
            if (choiceIndex === 0) { // Đồng ý tài trợ
                company.adjustCash(-company.flags.womenInTechAmount, "Sponsorship".localize("heading"));
                // Tăng hiệu suất cho tất cả nhân viên
                company.staff.forEach(function (staff) {
                    staff.adjustBoostRechargeProgress(0.3);
                    staff.adjustEfficiency(0.3);
                });
                var newsText = "We have got word that {0} has recently sponsored a highly praised move to get more women into technology roles.\n{1}, the CEO at {0} said, 'We would love to see more women in the game industry.'".localize("{0} company name, {1} staff name").format(company.name, company.staff[0].name);
                var newsNotification = new Notification({
                    header: "News".localize("heading"),
                    text: newsText,
                    weeksUntilFired: 2 + 6 * company.getRandom(),
                    type: NotificationType.Others,
                    previewImage: "./images/notificationIcons/icon_notification_local_news_and_media.png"
                });
                company.flags.sponsoredWomenInTech = !0;
                company.notifications.push(newsNotification);
                company.flags.good++;
                ghg4.ghg5("good");
            } else { // Từ chối
                // Giảm hiệu suất của các nhân viên (trừ người chơi)
                company.staff.skip(1).forEach(function (staff) {
                    staff.adjustEfficiency(-0.3);
                });
            }
            ghg4.ghg5("womenInTech?", { decision: choiceIndex === 0 });
        }
    };

    // Sự kiện vi phạm bản quyền game
    decisionNotificationsModule.piracy1 = {
        id: "piracy1",
        isRandomEvent: !0,
        trigger: function (company) {
            return company.staff.length > 1 && company.isLaterOrEqualThan(5) && !company.flags.piracy1;
        },
        getNotification: function (company) {
            var staffMember = company.staff.skip(1).pickRandom();
            var lastGame = company.gameLog.last();
            company.flags.piracy1 = lastGame.title; // Lưu tên game bị vi phạm
            company.flags.selectedStaffName = staffMember.name;
            return new Notification({
                sourceId: "piracy1",
                header: staffMember.name,
                text: "Boss, it seems that quite a few players use illegal copies of {0}.\nI've managed to identify some of them.\nWe could either sue them to defend our copyright or send them warnings to ask them to stop.\nWhat do you want to do?".localize("{0} game title").format(lastGame.title),
                options: ["Sue them".localize("decision action button"), "Warn them".localize("decision action button")]
            });
        },
        complete: function (choiceIndex) {
            var company = GameManager.company;
            company.activeNotifications.insertAt(0, new Notification({ header: company.flags.selectedStaffName, text: "Right away!".localize() }));
            var gameTitle = company.flags.piracy1;
            var piracyProblemText = "{n}" + "Piracy is an increasingly big problem in the industry. Some companies invest a lot of money and effort to fight piracy while others argue that it's better to take a more relaxed approach and invest in better games instead.".localize();
            // Thay đổi fan dựa trên lựa chọn
            var fansChange = choiceIndex === 0 ? Math.floor(-(1E3 + 1300 * company.getRandom())) : Math.floor(100 + 300 * company.getRandom());
            var newsNotification;

            if (choiceIndex === 0) { // Chọn kiện
                company.flags.evil++;
                ghg4.ghg5("evil");
                var legalClaimAmount = 1E4 * Math.floor(2 + 7 * company.getRandom());
                piracyProblemText += ("{n}" + "We have lost {0} fans but won {1} in legal claims.".localize("{0} nr of fans, {1} cash amount").format(UI.getLongNumberString(fansChange), UI.getShortNumberString(legalClaimAmount)));
                newsNotification = new Notification({
                    header: "News".localize("heading"),
                    text: "In what some have called a drastic move, {0} has recently taken legal action against illegal players of their game {1}.".localize("{0} company name, {1} game name").format(company.name, gameTitle) + piracyProblemText,
                    weeksUntilFired: 2 + 3 * company.getRandom(),
                    type: NotificationType.Others,
                    previewImage: "./images/notificationIcons/icon_notification_local_news_and_media.png"
                });
                newsNotification.adjustCash(legalClaimAmount, "legal claims".localize("expense label"));
            } else { // Chọn cảnh cáo
                company.flags.good++;
                ghg4.ghg5("good");
                piracyProblemText += "{n}" + "We have gained {0} fans!".localize().format(UI.getLongNumberString(fansChange));
                newsNotification = new Notification({
                    header: "News".localize("heading"),
                    text: "{0} has recently sent warnings to several players using illegal copies of their game {1}.".localize("{0} company name, {1} game title").format(company.name, gameTitle) + piracyProblemText,
                    weeksUntilFired: 2 + 3 * company.getRandom(),
                    type: NotificationType.Others,
                    previewImage: "./images/notificationIcons/icon_notification_local_news_and_media.png"
                });
            }
            newsNotification.adjustFans(fansChange);
            company.notifications.push(newsNotification);
            ghg4.ghg5("piracy?", { decision: choiceIndex === 0 });
        }
    };

    // Vi phạm bản quyền (fan game)
    decisionNotificationsModule.infringment = {
        id: "infringment",
        isRandomEvent: !0,
        trigger: function (company) {
            return typeof company.flags.infringment === "undefined" && company.gameLog.some(function (game) { return game.score > 6; }) && company.staff.length > 1;
        },
        getNotification: function (company) {
            company.flags.infringment = !0; // Đánh dấu sự kiện đã xảy ra
            var staffMember = company.staff.skip(1).pickRandom();
            var successfulGame = company.gameLog.filter(function (game) { return game.score > 6; }).pickRandom();
            company.flags.selectedStaffName = staffMember.name;
            company.flags.infringmentGameName = successfulGame.title; // Tên game bị làm fan game
            return new Notification({
                sourceId: "infringment",
                header: staffMember.name,
                text: "Boss, I've discovered that some really dedicated fans of {0} have created a fan game using a lot of the material from our game.\nThey don't make any money with it and just seem to do it for fellow fans. Our legal advisors strongly suggest that we shouldn't allow this to go on. What do you want to do?".localize("{0} game title").format(successfulGame.title),
                options: ["Stop them".localize("decision action button"), "Let them be".localize("decision action button")]
            });
        },
        complete: function (choiceIndex) {
            var company = GameManager.company;
            if (choiceIndex === 0) { // Chọn ngăn chặn
                company.flags.infringmentDecision = !0; // Lưu quyết định (để callback xử lý)
                company.activeNotifications.insertAt(0, new Notification({ header: company.flags.selectedStaffName, text: "Right away!".localize() }));
                company.flags.evil++;
                ghg4.ghg5("evil");
                company.notifications.push(new Notification({
                    sourceId: "infringmentCallback", // Callback để xử lý hậu quả
                    header: "Project disbanded".localize("heading"),
                    text: "Hi, I'm Denise Ried the main developer of the {0} fan game. I just want to tell you that upon your recent 'request' from your legal department my project has shut down.{n}I poured a lot of effort into this and have always loved your company but I guarantee you that I shall not 'bother' nor support you ever again.".localize("{0} game name").format(company.flags.infringmentGameName),
                    weeksUntilFired: 2 + 3 * company.getRandom()
                }));
            } else { // Chọn để họ yên
                company.flags.infringmentDecision = !1;
                company.flags.good++;
                ghg4.ghg5("good");
                company.notifications.push(new Notification({
                    sourceId: "infringmentCallback",
                    header: "Thank you".localize("heading"),
                    text: "Hi, I'm Denise Ried the main developer of the {0} fan game. I've recently been informed that your legal department has advised you to stop us and I just wanted to say that I'm very grateful that you didn't.{n}{1} is the best company in the world and I'm glad I can be part of the fan community.".localize("{0} game name, {1} company name").format(company.flags.infringmentGameName, company.name),
                    weeksUntilFired: 2 + 3 * company.getRandom()
                }));
            }
            ghg4.ghg5("infringement?", { decision: choiceIndex === 0 });
        }
    };

    decisionNotificationsModule.infringmentCallback = {
        id: "infringmentCallback",
        complete: function () { // Xử lý hậu quả của quyết định về fan game
            var company = GameManager.company;
            var stopFanGame = company.flags.infringmentDecision;
            var currentFans = company.fans;
            var fansChange = Math.floor(0.05 * currentFans + 0.05 * currentFans * company.getRandom());

            if (stopFanGame) { // Nếu ngăn chặn
                fansChange *= -1; // Mất fan
            }
            company.adjustFans(fansChange);
            if (fansChange > 0) {
                company.activeNotifications.insertAt(0, new Notification("Fans".localize("heading"), "We have gained {0} fans!".localize().format(UI.getLongNumberString(fansChange)), ":-)"));
            } else if (fansChange < 0) {
                company.activeNotifications.insertAt(0, new Notification("Fans".localize("heading"), "We have lost {0} fans!".localize().format(UI.getLongNumberString(Math.abs(fansChange))), ":-(")); // Sử dụng Math.abs để hiển thị số dương
            }
        }
    };

    // Cuộc thi lập trình nội bộ
    decisionNotificationsModule.codingContest = {
        id: "codingContest",
        isRandomEvent: !0,
        trigger: function (company) {
            // Điều kiện: level < 2 HOẶC đã có sự kiện này HOẶC nhân viên < 4 HOẶC tiền < 150K HOẶC đang làm game HOẶC có nhân viên đang nghiên cứu/training/nghỉ
            if (company.currentLevel < 2 || company.flags.codingContest || company.staff.length >= 4 || company.cash >= 15E4 || company.currentGame != null || company.staff.some(function (staff) {
                return staff.state === CharacterState.Researching || staff.state === CharacterState.Training || staff.state === CharacterState.Vacation;
            })) {
                return !1;
            }
            return !0;
        },
        getNotification: function (company) {
            var staffMember = company.staff.skip(1).pickRandom();
            company.flags.selectedStaffName = staffMember.name;
            return new Notification({
                sourceId: "codingContest",
                header: staffMember.name,
                text: "Boss, we would like to stage an internal coding contest! I think we could all learn a lot by doing this. As an incentive we would need a prize for the winner ({0}). We agreed that the prize will go to charity. Should we do it?".localize().format(UI.getShortNumberString(9E4)), // 90K
                options: ["Yes".localize(), "No".localize()]
            });
        },
        complete: function (choiceIndex) {
            var company = GameManager.company;
            if (choiceIndex === 0) { // Đồng ý
                company.flags.codingContest = !0;
                company.activeNotifications.insertAt(0, new Notification({ header: company.flags.selectedStaffName, text: "Great! We will start right away!".localize() }));
                // Tất cả nhân viên tham gia cuộc thi (là một dạng training)
                company.staff.forEach(function (staff) {
                    GameManager.uiSettings.selectedChar = staff.id;
                    GameManager.codingContest(Training.codingContest, "training", staff); // Training.codingContest là một đối tượng training đặc biệt
                });
            } else { // Từ chối
                // Nhân viên đề xuất bị giảm hiệu suất
                for (var i = 0; i < company.staff.length; i++) {
                    if (company.staff[i].name === company.flags.selectedStaffName) {
                        company.staff[i].adjustEfficiency(-0.4);
                    }
                }
                company.activeNotifications.insertAt(0, new Notification({
                    header: company.flags.selectedStaffName,
                    text: "Okay, maybe another time...".localize(),
                    buttonText: "OK".localize()
                }));
            }
        }
    };

    // Hàm được gọi khi một nhân viên hoàn thành phần thi coding contest
    decisionNotificationsModule.codingContestParticipationFinished = function () {
        // Kiểm tra xem còn ai đang thi không
        for (var i = 0; i < GameManager.company.staff.length; i++) {
            if (GameManager.company.staff[i].currentResearch && GameManager.company.staff[i].currentResearch.id === "codingContest") {
                return !1; // Vẫn còn người đang thi
            }
        }
        // Sắp xếp nhân viên theo thời gian hoàn thành và chọn người thắng cuộc
        var winner = GameManager.company.staff.slice().sort(function (staffA, staffB) {
            return staffA.flags.codingContestDone - staffB.flags.codingContestDone;
        }).first();

        GameManager.company.notifications.push(new Notification({
            header: "Coding Contest".localize("heading"),
            text: "Thanks for agreeing to the coding contest. It was a big success! {0} won the contest and is lucky to distribute the prize of {1} to charity. We have also learned a lot in the process.".localize().format(winner.name, UI.getShortNumberString(9E4)),
            weeksUntilFired: 0.6
        }));
    };

    // Sự kiện thẻ tín dụng bị đánh cắp
    decisionNotificationsModule.creditCard = {
        id: "creditCard",
        isRandomEvent: !0,
        trigger: function (company) {
            // Điều kiện: tiền > 50K, chưa bị đánh cắp, có > 1 nhân viên, và điểm "evil" >= 2
            return company.cash > 5E4 && !company.flags.creditCardStolen && company.staff.length > 1 && company.flags.evil >= 2;
        },
        getNotification: function (company) {
            company.flags.creditCardStolen = !0;
            company.flags.creditCardDamages = 0.007 * company.cash; // Thiệt hại là 0.7% số tiền mặt
            var staffMember = company.staff.skip(1).pickRandom();
            return new Notification({
                sourceId: "creditCard", // Không có xử lý complete, có vẻ là thông báo thông tin thôi
                header: staffMember.name,
                text: "Boss, someone seems to have stolen our credit card information and used it to buy a lot of things in the past three months. Unfortunately we have lost {0}!".localize().format(UI.getLongNumberString(company.flags.creditCardDamages)),
                buttonText: ":-(",
                weeksUntilFired: 12, // Thông báo sau 12 tuần
                previewImage: "./images/notificationIcons/icon_notification_new_money_penalty.png",
                type: NotificationType.AutoPopup
            });
        },
        complete: function (choiceIndex_unused) { // Hàm này được gọi khi thông báo được đóng
            GameManager.company.flags.creditCardSwitched = !0; // Đánh dấu đã "đổi" thẻ (ngầm hiểu là đã xử lý xong vụ việc)
        }
    };

    var epaAgencyName = "EPA".localize("heading for 'Environmental Protection Agency' story"); // Tên cơ quan bảo vệ môi trường

    // Đề nghị lắp đặt năng lượng mặt trời
    decisionNotificationsModule.solarPower = {
        id: "solarPower",
        isRandomEvent: !0,
        trigger: function (company) {
            return !company.flags.solarPowerInstalled && company.currentLevel > 2 && company.isLaterOrEqualThan(12) && company.cash > 4E5;
        },
        getNotification: function (company_unused) { // company_unused không được sử dụng
            var costToPlayer = 2E5; // Chi phí người chơi phải trả (50% tổng chi phí)
            var text = "I am an employee of the Environmental Protection Agency and have an offer for you. Your company has a high electrical footprint right now. If you would install solar panels you could decrease your footprint and save money in the long run. We would sponsor 50% of the costs which brings your investment to {0}!\nWould you like to install it?".localize("headings for this story need to use acronym consistent with the Environmental Protection Agency translation. look for 'heading for 'Environmental Protection Agency' story'").format(UI.getShortNumberString(costToPlayer));
            return new Notification({
                sourceId: "solarPower",
                header: epaAgencyName,
                text: text,
                options: ["Install (pay {0})".localize("decision action button").format(UI.getShortNumberString(costToPlayer)), "Ignore offer".localize("decision action button")]
            });
        },
        complete: function (choiceIndex) {
            var company = GameManager.company;
            if (choiceIndex === 0) { // Đồng ý lắp đặt
                company.flags.good++;
                ghg4.ghg5("good");
                company.flags.solarPowerInstalled = !0;
                company.adjustCash(-2E5, "solar panels".localize("heading"));
                company.activeNotifications.insertAt(0, new Notification(epaAgencyName, "Great, it was a wise decision installing a solar collector!".localize(), ":-)"));
                // Tin tức về việc công ty lắp đặt năng lượng mặt trời
                company.notifications.push(new Notification("Industry News".localize("heading"), "{0} has recently installed solar panels in their offices. While the video game and software industries are one of the cleanest industries on earth they do eat up a lot of electricity so installing solar panels can really make an impact.".localize("{0} company name").format(company.name), "OK".localize(), 4, {
                    type: NotificationType.IndustryNews,
                    previewImage: "./images/notificationIcons/icon_notification_local_news_and_media.png"
                }));
            } else { // Từ chối
                company.flags.evil++;
                ghg4.ghg5("evil");
                company.activeNotifications.insertAt(0, new Notification(epaAgencyName, "Sorry to hear that you are declining our offer".localize(), "OK".localize()));
            }
        }
    };

    // Đề nghị lắp điều hòa lần 1
    decisionNotificationsModule.airCon = {
        id: "airCon1",
        isRandomEvent: !0,
        trigger: function (company) {
            return (company.currentLevel === 2 || company.currentLevel === 3) && company.staff.length > 3 && !company.flags.airCon1 && company.cash >= 2E5;
        },
        getNotification: function (company) {
            company.flags.airCon1 = !0; // Đánh dấu đã hỏi lần 1
            var staffMember = company.staff.skip(1).pickRandom();
            var cost = 9E4;
            return new Notification({
                sourceId: "airCon1",
                header: staffMember.name,
                text: "Boss, it's way too hot in our office and the heat is starting to impact on our work. I've researched and found an air conditioner which would be perfect for us. It costs {0}.\nShould we order it?".localize().format(UI.getShortNumberString(cost)),
                options: ["Yes (pay {0})".localize("decision action button").format(UI.getShortNumberString(cost)), "No".localize()]
            });
        },
        complete: function (choiceIndex) {
            var company = GameManager.company;
            if (choiceIndex === 0) {
                company.adjustCash(-9E4, "air conditioner".localize("heading"));
                company.flags.airConInstalled = !0;
                VisualsManager.installAirCon(); // Hàm hiển thị điều hòa
            } else {
                // Nếu từ chối, nhân viên bị giảm hiệu suất và đặt thời gian cho lần hỏi tiếp theo
                company.staff.forEach(function (staff) { staff.adjustEfficiency(-0.3); });
                company.flags.airCon1Declined = 15 + 15 * company.getRandom() + company.currentWeek;
            }
            ghg4.ghg5("aircon1?", { decision: choiceIndex === 0 });
        }
    };

    // Đề nghị lắp điều hòa lần 2 (nếu lần 1 từ chối)
    decisionNotificationsModule.airCon1Callback = {
        id: "airCon1Callback",
        isRandomEvent: !1, // Không phải ngẫu nhiên, được trigger bởi điều kiện khác
        trigger: function (company) {
            return !company.flags.airConInstalled && (company.currentLevel === 2 || company.currentLevel === 3) && company.staff.length > 3 && !company.flags.airCon2 && company.cash >= 2E5 && typeof company.flags.airCon1Declined !== "undefined" && company.flags.airCon1Declined < company.currentWeek;
        },
        getNotification: function (company) {
            var staffMember = company.staff.skip(1).pickRandom();
            var cost = 18E4; // Giá tăng lên
            return new Notification({
                sourceId: "airCon1Callback",
                header: staffMember.name,
                text: "Boss, the heat is becoming a serious problem. Just yesterday my mouse melted and my keyboard is covered in sweat. Not a good environment to work in. We really need an air conditioner.{n}Unfortunately the previous offer has expired and we would need to pay {0}.\nShould we order it?".localize("try to make the reason lightweight and fun").format(UI.getShortNumberString(cost)),
                options: ["Yes (pay {0})".localize("decision action button").format(UI.getShortNumberString(cost)), "No".localize()],
                weeksUntilFired: 0
            });
        },
        complete: function (choiceIndex) {
            var company = GameManager.company;
            if (choiceIndex === 0) {
                company.adjustCash(-18E4, "air conditioner".localize("heading"));
                company.flags.airConInstalled = !0;
                VisualsManager.installAirCon();
            } else {
                company.staff.forEach(function (staff) { staff.adjustEfficiency(-0.4); });
                company.flags.airCon2 = !0; // Đánh dấu đã hỏi lần 2
                company.flags.airCon2Declined = 15 + 15 * company.getRandom() + company.currentWeek;
            }
            ghg4.ghg5("aircon2?", { decision: choiceIndex === 0 });
        }
    };

    // Lần cuối cùng về điều hòa (nhân viên tự mua)
    decisionNotificationsModule.airCon2Callback = {
        id: "airCon2Callback",
        isRandomEvent: !1,
        trigger: function (company) {
            return !company.flags.airConInstalled && (company.currentLevel === 2 || company.currentLevel === 3) && company.staff.length > 3 && company.cash >= 2E5 && typeof company.flags.airCon2Declined !== "undefined" && company.flags.airCon2Declined < company.currentWeek;
        },
        getNotification: function (company) {
            var staffMember = company.staff.skip(1).pickRandom();
            return new Notification({
                sourceId: "airCon2Callback",
                header: staffMember.name,
                text: "Boss, We've had enough and ordered the air conditioner ourselves. Thanks for nothing.".localize(),
                weeksUntilFired: 0
            });
        },
        complete: function (choiceIndex_unused) { // choiceIndex không được dùng vì đây là thông báo, không có lựa chọn
            var company = GameManager.company;
            company.flags.evil -= 2; // Giảm điểm "evil" vì nhân viên tự lo
            ghg4.ghg5("evil");
            company.flags.airConInstalled = !0;
            VisualsManager.installAirCon();
            ghg4.ghg5("aircon3");
        }
    };

    // Đề nghị đặt sản phẩm trong game (Product Placement)
    decisionNotificationsModule.productPlacement = {
        id: "productPlacement1",
        isRandomEvent: !0,
        trigger: function (company) {
            return company.currentLevel > 3 && !company.flags.productPlacement1;
        },
        getNotification: function (company) {
            company.flags.productPlacement1 = !0;
            var paymentAmount = 2E5;
            // Đây là một tham chiếu đến game Portal 2 (Cave Johnson / Aperture Science)
            var text = "Dave Johnson here, CEO of Departure Science. Some of our test subjects were recently exposed to some of your games and, surprisingly, they didn't go totally insane. They seemed to quite enjoy the experience in fact. Anyway, I have some products that need advertising and could do with some product placement.{n}My marketing boys tell me that making you this offer is a bad idea but that's exactly why I want it. I'll pay you {0} to place some of our fine red painted exploding barrels in one of your games. What'd ya say?".localize("see Portal 2 reference hint").format(UI.getShortNumberString(paymentAmount));
            return new Notification({
                sourceId: "productPlacement1",
                header: "Product Placement".localize("heading"),
                text: text,
                options: ["Sure!".localize("decision action button"), "No".localize()]
            });
        },
        complete: function (choiceIndex) {
            var company = GameManager.company;
            if (choiceIndex === 0) { // Đồng ý
                company.adjustCash(2E5, "Departure Science".localize("see Portal 2 reference hint"));
                company.activeNotifications.push(new Notification("Message".localize("heading"), "Excellent! Good to hear you have some spirit in you. One more thing: Don't feel like you have to go and rush those barrels into your next game. I'd rather have you place them in a game where they fit well.\nJohnson out.".localize("see Portal 2 reference hint")));
                company.flags.productPlacement1Active = !0; // Cờ cho biết đã chấp nhận
                company.specialItems.push(Research.ProductPlacement1); // Thêm item đặc biệt để sử dụng
            }
            ghg4.ghg5("productPlacement?", { decision: choiceIndex === 0 });
        }
    };

    // Xử lý sau khi game có product placement được phát hành
    decisionNotificationsModule.productPlacement1Finished = {
        trigger: function (company) {
            // Điều kiện: đã chấp nhận product placement, chưa hoàn thành, có game đã phát hành, và game cuối cùng có chứa item product placement
            return company.flags.productPlacement1Active && !company.flags.productPlacement1Finished && company.gameLog.length > 0 && company.gameLog.last().features.indexOf(Research.ProductPlacement1) != -1;
        },
        id: "productPlacement1Finished",
        getNotification: function (company) {
            company.flags.productPlacement1Finished = !0;
            company.specialItems.remove(Research.ProductPlacement1); // Xóa item sau khi đã sử dụng
            var lastGameGenreIsAction = company.gameLog.last().genre === GameGenre.Action;
            var messageText;
            if (lastGameGenreIsAction) { // Nếu game là thể loại Hành động (phù hợp với thùng nổ)
                company.flags.hadCake = !0; // Cờ để nhận achievement "The Cake is a Lie" (Portal)
                messageText = "Dave Johnson here! Listen! You did well placing our beloved barrels in {0} - my marketing eggheads say profits are increasing which means more science for us. Well done. Here, have this cake.".localize("see Portal 2 reference hint");
            } else {
                messageText = "Dave Johnson here! Listen! Those red exploding barrels I'd asked you to place in your game. Well, seems that folks didn't really enjoy them as much in {0}. Oh well, was worth a try.".localize("see Portal 2 reference hint");
            }
            messageText = messageText.format(company.gameLog.last().title);
            var notification = new Notification("Message".localize("heading"), messageText, "OK".localize(), 4);
            if (lastGameGenreIsAction) {
                notification.image = "./images/misc/cake.png";
                notification.activateAchievement(Achievements.cake); // Kích hoạt achievement
            }
            ghg4.ghg5("product placement finished", { success: lastGameGenreIsAction });
            return notification;
        }
    };

    // Thông báo về việc công bố console tự phát triển
    decisionNotificationsModule.announceConsole = {
        id: "announceConsole",
        trigger: function (company) { return !1; }, // Được kích hoạt khi console đang phát triển đạt tiến độ nhất định
        getNotification: function (company_unused) {
            var currentConsoleProject = GameManager.currentHwProject;
            var text = "Boss, I think it's time to announce the {0} to the world. Should we go ahead and make a press release?".localize("{0} custom console name").format(currentConsoleProject.name);
            return new Notification({
                sourceId: "announceConsole",
                header: "Hardware lab".localize(),
                text: text,
                options: ["Announce".localize("decision action button"), "Don't announce".localize("decision action button")],
                type: NotificationType.AutoPopup
            });
        },
        complete: function (choiceIndex) {
            var company = GameManager.company;
            if (choiceIndex === 0) { // Nếu đồng ý công bố
                var consoleProject = GameManager.currentHwProject;
                var newsText;
                if (GameManager.currentHwProject.version === 1) { // Nếu là console đầu tiên
                    newsText = "In a surprise announcement {0}, a company known for games such as {1} has revealed that they have been working on their very own game console. The console which is called {2} is said to compete with the high end consoles from companies like Mirconoft and Vonny.{n}We are eager to see how much of an impact this new console will have.".localize().format(company.name, company.getBestSeller().title, consoleProject.name);
                } else { // Nếu là console thế hệ sau
                    var previousConsole = company.licencedPlatforms.last(function (platform) { return platform.isCustom; });
                    var successFragment = previousConsole.successFactor < 0.7 ? " which had only limited commercial success.".localize("consoleAnnouncementPastSuccessFragment")
                        : previousConsole.successFactor <= 1 ? "which had moderate commercial success.".localize("consoleAnnouncementPastSuccessFragment")
                            : "which had a sizeable following and really made an impact in the market.".localize("consoleAnnouncementPastSuccessFragment");
                    newsText = "{0} has announced that they are working on a new game console. The console named {1} is planned as a successor to their earlier contender, the {2} ".localize("{2} is consoleAnnouncementPastSuccessFragment").format(company.name, consoleProject.name, previousConsole.name) + successFragment;
                }
                company.activeNotifications.insertAt(0, new Notification("Hardware lab".localize(), "I will get right to it.".localize()));
                var newsNotification = new Notification({
                    header: "Industry News".localize("heading"),
                    text: newsText,
                    image: GameManager.currentHwProject.iconUri,
                    weeksUntilFired: 0.7
                });
                consoleProject.announced = !0; // Đánh dấu console đã được công bố
                company.notifications.push(newsNotification);
            } else {
                company.activeNotifications.insertAt(0, new Notification("Hardware lab".localize(), "Okay, you are the boss.".localize()));
            }
            ghg4.ghg5("announce console?", { decision: choiceIndex === 0 });
        }
    };

    // Thông báo khi kết thúc game (cho bản Windows Store)
    decisionNotificationsModule.endOfGame1 = {
        id: "endOfGame1",
        trigger: function () { return !1; },
        isRandom: !1,
        getNotification: function (company_unused) {
            var supporterPacksEnabled = DataStore.remoteSettings.supporterPacksEnabled;
            var text = "Congratulations on finishing Game Dev Tycoon and thank you for playing! If you enjoyed our little game then please consider rating the game on the Store. You can also send us some feedback".localize("gameFinishMsg, either stops with a . or continues with fragment");
            text = supporterPacksEnabled ? text + " and, if you really loved the game, you can (if you wish) vote with your wallet to support us even further.".localize("fragment of gameFinishMsg") : text + ".";
            return new Notification({
                sourceId: "endOfGame1",
                header: "Thank you".localize("heading"),
                text: text,
                image: "images/greenheart.png",
                options: ["See options...".localize("decision action button"), "No, thanks".localize("decision action button")],
                type: NotificationType.AutoPopup
            });
        },
        complete: function (choiceIndex) {
            var company = GameManager.company;
            var continuePlayingNotification = new Notification("Continue game".localize("heading"), "If you wish you can continue playing but please note that there will be no more platform releases or other story elements.".localize(), { type: NotificationType.AutoPopup });
            if (choiceIndex === 0) { // Nếu chọn "See options..."
                company.notifications.push(new Notification("{SupportGreenheartGames}")); // Hiển thị tùy chọn hỗ trợ
            }
            company.notifications.push(continuePlayingNotification);
            ghg4.ghg5("show support options?", { decision: choiceIndex === 0 });
        }
    };

    // Thông báo khi kết thúc game (cho bản không phải Windows Store)
    decisionNotificationsModule.endOfGameNative = {
        id: "endOfGameNative",
        trigger: function () { return !1; },
        isRandom: !1,
        getNotification: function (company_unused) {
            var text = "Congratulations on finishing Game Dev Tycoon and thank you for playing! If you enjoyed our little game then please consider telling your friends about it.".localize() + "{n}" + "If you wish you can continue playing but please note that there will be no more platform releases or other story elements.".localize();
            return new Notification({
                header: "Thank you".localize("heading"),
                text: text,
                image: "images/greenheart.png",
                type: NotificationType.AutoPopup
            });
        }
        // Không có hàm complete, chỉ là thông báo
    };

    // Phỏng vấn về game đang phát triển
    decisionNotificationsModule.gameinterview = {
        id: "gameinterview",
        trigger: function (company) {
            // Điều kiện: đang phát triển game (0.2 <= progress <= 0.9), có > 10K fan, và chưa có phỏng vấn gần đây
            return company.isGameProgressBetween(0.2, 0.9) && company.fans > 1E4 && (!company.flags.lastInterviewEvent || company.flags.lastInterviewEvent < GameManager.gameTime - 8E4 * GameManager.SECONDS_PER_WEEK);
        },
        isRandom: !0,
        getNotification: function (company) {
            if (company.currentGame) {
                var newsSource = SalesEvents.getPossibleSources(company).pickRandom(); // SalesEvents chứa danh sách các nguồn tin
                company.flags.lastInterviewEvent = GameManager.gameTime;
                company.flags.interviewSource = newsSource; // Lưu nguồn tin
                var text = "Hi, this is {0} from {1}. I got word that {2} is working on a new game.\nWould you be willing to share some information on your current game project and do an interview about it?".localize().format(newsSource.author, newsSource.name, company.name);
                return new Notification({
                    sourceId: "gameinterview",
                    header: "Media Enquiry".localize("heading"),
                    text: text,
                    options: ["Agree".localize("decision action button"), "Decline".localize("decision action button")],
                    previewImage: "./images/notificationIcons/icon_notification_local_news_and_media.png"
                });
            }
        },
        complete: function (choiceIndex) {
            var company = GameManager.company;
            var interviewSource = company.flags.interviewSource;
            var currentGame = company.currentGame;
            if (choiceIndex === 0) { // Đồng ý phỏng vấn
                company.flags.secrecy--;
                // Hiển thị các câu hỏi phỏng vấn (được định nghĩa ở dưới)
                company.activeNotifications.addRangeAt(0, decisionNotificationsModule.gameInterviewQuestions.getNotification(company, currentGame).split());
            } else { // Từ chối phỏng vấn
                company.flags.secrecy++;
                if (company.getRandom() >= 0.5) { // 50% cơ hội có tin tức về việc từ chối
                    var lastReleasedGame = company.gameLog.slice(-1)[0];
                    var newsText = "{0} has declined a request for an interview about their current project.\n".localize().format(company.name);
                    var hypeFromDeclining = 0;
                    if (lastReleasedGame.score >= 7) {
                        newsText += "Given that their most recent game {0} enjoyed universal success we simply cannot wait for them to unveil their new project!".localize().format(lastReleasedGame.title);
                        hypeFromDeclining += 20 + 20 * company.getRandom();
                    } else if (lastReleasedGame.score > 5) {
                        newsText += "With {0} only receiving a lukewarm reception, fans are sure to be expecting better from them and we are curious about their next title.".localize().format(lastReleasedGame.title);
                        hypeFromDeclining += 10 + 10 * company.getRandom();
                    } else {
                        newsText += "Hopefully the company can do better than last time. We don't need another {0}.".localize().format(lastReleasedGame.title);
                        hypeFromDeclining += 5 + 5 * company.getRandom();
                    }
                    hypeFromDeclining *= General.getGameSizePointsFactor(currentGame);
                    if (company.flags.secrecy > 2) { hypeFromDeclining *= 2; } // Càng bí mật, hype càng tăng khi từ chối
                    hypeFromDeclining = Math.round(hypeFromDeclining);

                    var declineNewsNotification = new Notification({
                        header: interviewSource.name,
                        text: newsText,
                        weeksUntilFired: 0.2 + 0.2 * company.getRandom(),
                        previewImage: "./images/notificationIcons/icon_notification_local_news_and_media.png"
                    });
                    declineNewsNotification.adjustHype(hypeFromDeclining);
                    company.notifications.push(declineNewsNotification);
                }
            }
        }
    };

    // Đối tượng chứa các câu hỏi phỏng vấn
    decisionNotificationsModule.gameInterviewQuestions = {
        id: "gameInterviewQuestions",
        getNotification: function (company, currentGame) {
            // Chọn ngẫu nhiên 1 trong 2 câu hỏi
            return [decisionNotificationsModule.gameInterviewQ1, decisionNotificationsModule.gameInterviewQ2].pickRandom().getNotification(company, currentGame);
        }
    };

    // Câu hỏi phỏng vấn 1
    decisionNotificationsModule.gameInterviewQ1 = {
        id: "gameInterviewQ1",
        getNotification: function (company, currentGame) {
            var interviewSource = company.flags.interviewSource;
            return new Notification({
                sourceId: "gameInterviewQ1",
                header: interviewSource.name,
                text: "{0}:\nWhat is your expectation regarding the success of {1}? Do you think that the game will be well received?".localize().format(interviewSource.author, currentGame.title),
                options: ["Hype game!".localize(), "Be modest.".localize()],
                type: NotificationType.AutoPopup
            });
        },
        complete: function (choiceIndex) {
            var company = GameManager.company;
            var currentGame = company.currentGame;
            if (choiceIndex === 0) { // Chọn "Hype game!"
                currentGame.flags.interviewHyped = { decision: !0, source: $.extend({}, company.flags.interviewSource) }; // Đánh dấu đã hype game
                currentGame.hypePoints += Math.round(60 + 40 * company.getRandom());
            } else { // Chọn "Be modest."
                currentGame.hypePoints += Math.round(20 + 20 * company.getRandom());
            }
            company.notifications.push(new Notification(company.flags.interviewSource.name, "Thank you for your time.".localize(), { type: NotificationType.AutoPopup }));
        }
    };

    // Câu hỏi phỏng vấn 2
    decisionNotificationsModule.gameInterviewQ2 = {
        id: "gameInterviewQ2",
        getNotification: function (company, currentGame) {
            var interviewSource = company.flags.interviewSource;
            // Chọn ngẫu nhiên một khía cạnh phát triển quan trọng và một khía cạnh ít quan trọng cho game hiện tại
            var importantMission = Missions.DevMissions.filter(function (mission) { return Missions.getGenreWeighting(mission, currentGame) >= 0.9; }).pickRandom();
            var lessImportantMission = Missions.DevMissions.filter(function (mission) { return Missions.getGenreWeighting(mission, currentGame) < 0.9; }).pickRandom();
            var isOption1Correct = company.getRandom() > 0.5; // Quyết định ngẫu nhiên đáp án nào đúng
            var option1Text, option2Text;

            if (isOption1Correct) {
                option1Text = importantMission.name;
                option2Text = lessImportantMission.name;
            } else {
                option1Text = lessImportantMission.name;
                option2Text = importantMission.name;
            }

            var questionText = "{0}:\nMany of our readers are curious about what decisions go into making a video game and how companies prioritize development areas.\nYour new game is a {1}/{2} game, can you tell us whether such a game would usually receive more focus on {3} or on {4}?".localize().format(interviewSource.author, currentGame.topic.name, currentGame.getGenreDisplayName(), option1Text, option2Text);
            // Lưu thông tin câu hỏi để xử lý sau
            currentGame.flags.gameInterviewQ2 = {
                option1: option1Text,
                option2: option2Text,
                correctOption: isOption1Correct ? 0 : 1,
                gameName: currentGame.title,
                gameDescr: currentGame.topic.name + "/" + currentGame.getGenreDisplayName()
            };
            return new Notification({
                sourceId: "gameInterviewQ2",
                header: interviewSource.name,
                text: questionText,
                options: ["More on {0}".localize().format(option1Text), "More on {0}".localize().format(option2Text), "I don't know".localize()],
                type: NotificationType.AutoPopup
            });
        },
        complete: function (choiceIndex) {
            var company = GameManager.company;
            var currentGame = company.currentGame;
            var interviewSource = company.flags.interviewSource;
            var questionData = currentGame.flags.gameInterviewQ2;
            var chosenFocus = choiceIndex === 2 ? "they are still experimenting what area".localize("sentence fragment") : choiceIndex === 0 ? questionData.option1 : questionData.option2;
            var newsLead = "In a recent interview with {0} we discussed their upcoming {1} game and asked company founder {2} how different development areas are prioritized.\nIn the interview {2} said that {3} is of particular importance for such a game ".localize("continues with fragment").format(generateScamCompanyName(), questionData.gameDescr, company.staff[0].name, chosenFocus); // generateScamCompanyName() có vẻ là lỗi copy-paste, nên là interviewSource.name
            var isCorrectChoice = choiceIndex === questionData.correctOption;
            var newsConclusion = isCorrectChoice ? "and it seems that other industry professionals agree with this. Every game development project has limited resources so it's very important to use the time most effectively.".localize("sentence fragment")
                : "but it seems that other industry professionals disagree with that point of view saying that {0} is usually more important for this type of game.".localize("sentence fragment").format(questionData.correctOption === 0 ? questionData.option1 : questionData.option2);
            var fullNewsText = newsLead + newsConclusion;

            var newsNotification = new Notification({
                header: interviewSource.name,
                text: fullNewsText,
                weeksUntilFired: 0.6 + 0.2 * company.getRandom(),
                previewImage: "./images/notificationIcons/icon_notification_local_news_and_media.png"
            });
            if (choiceIndex !== 2) { // Nếu không chọn "I don't know"
                if (isCorrectChoice) {
                    newsNotification.adjustFans(Math.floor(200 + 1E3 * company.getRandom()));
                }
                newsNotification.adjustHype(Math.round(5 + 20 * company.getRandom() * (isCorrectChoice ? 2 : 0)));
            }
            company.notifications.push(new Notification(interviewSource.name, "Thank you for your time.".localize(), { type: NotificationType.AutoPopup }));
            company.notifications.push(newsNotification);
        }
    };

    // Sự kiện về việc bán hoặc cho đi engine cũ
    decisionNotificationsModule.OldEngine = {
        id: "oldEngine",
        isRandomEvent: !0,
        trigger: function (company) {
            // Điều kiện: có engine cũ (ra mắt > 240 tuần trước), và là sau năm thứ 10, quý 3, tuần 4
            return company.engines && company.engines.some(function (engine) { return !engine.isSold && engine.releaseWeek + 240 < GameManager.company.currentWeek; }) && company.isLaterOrEqualThan(10, 3, 4);
        },
        getNotification: function (company) {
            var oldEngine = company.engines.filter(function (engine) { return !engine.isSold && engine.releaseWeek + 240 < GameManager.company.currentWeek; }).pickRandom();
            company.flags.engineEventId = oldEngine.id; // Lưu ID engine được chọn
            var text = "Boss, a small number of dedicated fans have asked that we release the source code to one of our older game engines '{0}'. Doing so would surely satisfy these fans but given that we worked hard on the engine, we could also sell licenses for it and make some money. Alternatively, we could simply refuse their request completely.\nWhat would you like to do?".localize().format(oldEngine.name);
            return new Notification({
                sourceId: "oldEngine",
                header: "Old Engine".localize(),
                text: text,
                options: ["Give it away".localize(), "Sell it".localize(), "Refuse".localize()]
            });
        },
        complete: function (choiceIndex) {
            var company = GameManager.company;
            var selectedEngine = company.engines.first(function (engine) { return engine.id == company.flags.engineEventId; });
            if (selectedEngine) {
                selectedEngine.isSold = choiceIndex != 2; // Đánh dấu đã xử lý (cho đi hoặc bán)
                var fansChange = (0.02 * company.fans + 0.05 * company.fans * company.getRandom()).clamp(1E3, 2E4);
                var cashChange = -2E3 + -3E3 * company.getRandom();
                var decisionText, fanResponseText;

                switch (choiceIndex) {
                    case 0: // Cho đi
                        decisionText = "give away".localize();
                        fanResponseText = "positive".localize();
                        if (company.getRandom() > 0.5) { fansChange *= 2; fanResponseText = "outstanding".localize(); }
                        break;
                    case 1: // Bán
                        decisionText = "sell".localize();
                        cashChange = 2 * fansChange + 1.5 * fansChange * company.getRandom(); // Tính tiền thu được
                        fansChange /= 5; // Ít fan hơn khi bán
                        fanResponseText = "mixed".localize();
                        if (company.getRandom() > 0.5) { fanResponseText = "negative".localize(); fansChange *= -1; }
                        if (company.getRandom() > 0.5) { cashChange *= 3; }
                        break;
                    case 2: // Từ chối
                        if (company.getRandom() < 0.3) { // 30% cơ hội bị phản ứng tiêu cực
                            fansChange *= -1;
                            var negativeResponseNotification = new Notification({
                                header: "Old Engine".localize(),
                                text: "Boss, it seems the fans who requested that we open source {0} were particularly upset with our decision and have caused quite a negative stirr. We've lost {1} fans.".localize().format(selectedEngine.name, UI.getShortNumberString(Math.abs(fansChange))), // Sử dụng Math.abs
                                weeksUntilFired: 0.2 + 0.3 * company.getRandom()
                            });
                            negativeResponseNotification.adjustFans(Math.round(fansChange));
                            company.notifications.push(negativeResponseNotification);
                        }
                        return; // Kết thúc sớm nếu từ chối và không có phản ứng tiêu cực lớn
                }
                fansChange = Math.round(fansChange);
                cashChange = Math.round(cashChange);
                var messageText = "Boss, our recent decision to {0} our engine {1} was met with {2} responses from fans. Overall we {3} fans and {4}.".localize().format(decisionText, selectedEngine.name, fanResponseText, (fansChange > 0 ? "gained".localize() : "lost".localize()) + " " + UI.getShortNumberString(Math.abs(fansChange)), (cashChange < 0 ? "it cost us {0}".localize() : "we made {0}".localize("{0} is amount of money")).format(UI.getShortNumberString(Math.abs(cashChange))));
                var outcomeNotification = new Notification({
                    header: "Old Engine".localize(),
                    text: messageText,
                    weeksUntilFired: 0.3 + 0.9 * company.getRandom()
                });
                outcomeNotification.adjustCash(cashChange);
                outcomeNotification.adjustFans(fansChange);
                company.notifications.push(outcomeNotification);
            }
        }
    };

    // Sự kiện bị kiện vì bằng sáng chế (patent troll)
    decisionNotificationsModule.patentTroll = {
        id: "patentTroll",
        isRandomEvent: !0,
        trigger: function (company) {
            // Điều kiện: tiền > 2M, sau năm 10, có >= 3 engine, engine cuối cùng ra mắt trong khoảng 1-20 tuần trước, và chưa có sự kiện patent troll gần đây hoặc chưa bị vô hiệu hóa
            return company.cash >= 2E6 && company.isLaterOrEqualThan(10) && company.engines && company.engines.length >= 3 && company.engines.last().releaseWeek > company.currentWeek - 20 && company.engines.last().releaseWeek < company.currentWeek - 1 && (!company.flags.lastPatentTroll || (!company.flags.lastPatentTroll.disabled && company.flags.lastPatentTroll.week + 192 < company.currentWeek));
        },
        getNotification: function (company) {
            company.flags.lastPatentTroll = { week: company.currentWeek, count: 0 }; // Khởi tạo/reset thông tin sự kiện
            var lastEngine = company.engines.last();
            var licenseCost = company.cash / 8;
            var minCost = 1E5 + 2E5 * company.getRandom();
            if (licenseCost < minCost) { licenseCost = minCost; }
            licenseCost = Math.floor(licenseCost);
            company.flags.lastPatentTroll.cost = licenseCost; // Chi phí đòi bồi thường
            var fanRallyChance = 30 + 10 * Math.floor(6 * (company.fans / 15E4).clamp(0, 1)); // Cơ hội thành công khi kêu gọi fan
            company.flags.lastPatentTroll.fanChance = fanRallyChance;

            var text = "We've just received a letter from a company called 'All Your IP Belongs To US' and they say that our engine {0} is infringing on one of their patents.{n}They 'graciously' offer a license to their patent for {1} and are willing to give us a 50% discount if we just pay them without fighting them in court. We could pay this and hope that they won't bother us again or we could refuse and try to resolve this in front of the courts. Alternatively we might be able to rally our fans and publicly fight them.\nHow would you like to proceed?".localize().format(lastEngine.name, UI.getShortNumberString(licenseCost));
            return new Notification({
                sourceId: "patentTroll",
                header: "Legal Department".localize(),
                text: text,
                options: [
                    "Pay for license ({0})".localize().format(UI.getShortNumberString(Math.floor(licenseCost / 2))), // Trả 50%
                    "Go to court. [~{0}% chance]".localize().format(50), // 50% thắng kiện
                    "Rally fans! [~{0}% chance]".localize().format(fanRallyChance) // Cơ hội dựa trên số fan
                ]
            });
        },
        complete: function (choiceIndex) {
            var company = GameManager.company;
            var cashChange = 0;
            var fansChange = 0;
            var disableFutureTrolls = !1;
            var courtCosts = Math.round(company.flags.lastPatentTroll.cost / 20); // Án phí
            var outcomeMessage;

            if (choiceIndex === 0) { // Trả tiền license
                cashChange -= Math.floor(company.flags.lastPatentTroll.cost / 2);
            } else {
                if (choiceIndex === 1) { // Ra tòa
                    var wonCase = company.getRandom() > 0.5;
                    if (wonCase) {
                        outcomeMessage = "The court dismissed the patent infringement claims made against us stating that the claim was ridiculous. All costs were paid by the suing party.".localize();
                    } else {
                        outcomeMessage = "Unfortunately, it seems that the patent infringement case was decided against us. We have to pay the full amount of {0} as well as the court costs of {1}. This is ridiculous.".localize().format(UI.getShortNumberString(company.flags.lastPatentTroll.cost), UI.getShortNumberString(courtCosts));
                        cashChange -= (company.flags.lastPatentTroll.cost + courtCosts);
                    }
                } else { // Kêu gọi fan
                    var fanRallyChance = company.flags.lastPatentTroll.fanChance;
                    outcomeMessage = "We rallied our fans to publicly fight against All Your IP Belongs To US".localize("continues with fragment");
                    if (company.getRandom() < fanRallyChance / 100) { // Thành công
                        fansChange = Math.floor(1E4 + 1E4 * company.getRandom());
                        outcomeMessage += " and fight we did! We not only caused them to retract their claims but we also won {0} fans and the public's admiration. I doubt we will hear from those patent trolls again.".localize("sentence fragment").format(UI.getLongNumberString(fansChange));
                        disableFutureTrolls = !0; // Không bị kiện nữa
                    } else { // Thất bại
                        outcomeMessage += " but it seems that our efforts were fruitless. Seems we still have to pay {0} and the court costs of {1}. Maybe next time we'll have more luck.".localize("sentence fragment").format(UI.getShortNumberString(company.flags.lastPatentTroll.cost), UI.getShortNumberString(courtCosts));
                        cashChange = -(company.flags.lastPatentTroll.cost + courtCosts);
                    }
                }
                var outcomeNotification = new Notification({
                    header: "Legal Department".localize(),
                    text: outcomeMessage,
                    weeksUntilFired: 2 + 2 * company.getRandom()
                });
                if (cashChange) { outcomeNotification.adjustCash(cashChange, "All Your IP Belongs To US".localize()); }
                if (fansChange) { outcomeNotification.adjustFans(fansChange); }
                company.notifications.push(outcomeNotification);
            }

            // Cập nhật số lần bị kiện và vô hiệu hóa nếu cần
            if (company.flags.lastPatentTroll.count) {
                company.flags.lastPatentTroll.count++;
            } else {
                company.flags.lastPatentTroll.count = 1;
            }
            if (company.flags.lastPatentTroll.count == 3 || disableFutureTrolls) {
                company.flags.lastPatentTroll.disabled = !0;
            }
        }
    };

    // Đề nghị mua cổ phần (chỉ ở pirate mode)
    decisionNotificationsModule.buySharesOffer = {
        id: "buySharesOffer",
        isRandomEvent: !1, // Trigger bởi điều kiện cụ thể
        trigger: function (company) {
            // Điều kiện: pirate mode, chưa có đề nghị gần đây, tiền < 100K, cổ phần đã bán < 70%, có > 2 game đã phát hành
            return company.flags.pirateMode && (!company.flags.lastShareOffer || company.flags.lastShareOffer + 24E3 * GameManager.SECONDS_PER_WEEK <= GameManager.gameTime) && company.cash < 1E5 && company.flags.sharesSold < 70 && company.gameLog.length > 2;
        },
        getNotification: function (company, unused_param) { // unused_param không được sử dụng
            company.flags.lastShareOffer = GameManager.gameTime;
            var averageGameCost = company.gameLog.filter(function (game) { return game.costs > 0; }).average(function (game) { return game.costs; });
            company.flags.shareOffer1Amount = 3.5 * averageGameCost; // Số tiền cho 20%
            company.flags.shareOffer2Amount = 5 * averageGameCost;   // Số tiền cho 30%
            var text = "WE believe in your business portfolio and would like to aquire shares in {0}.\nWILL you consider this opportunity?\nOWN {1} in cash immediately, if you sign over 20% of your business.\n\nYOU can also take {2} in cash for 30% of your business.".localize("capitalized words should result in somethign similar to WE OWN YOU").format(company.name, UI.getShortNumberString(company.flags.shareOffer1Amount), UI.getShortNumberString(company.flags.shareOffer2Amount));

            if (company.flags.sharesSold > 0) { // Nếu đã bán cổ phần trước đó
                text = "WE believe in your business portfolio and would like to aquire shares in {0} of which we already own {1}%.\nWILL you consider this opportunity?\nOWN {2} in cash immediately, if you sign over 20% of your business.\n\nYOU can also take {3} in cash for 30% of your business.".localize("capitalized words should result in somethign similar to WE OWN YOU").format(company.name, company.flags.sharesSold, UI.getShortNumberString(company.flags.shareOffer1Amount), UI.getShortNumberString(company.flags.shareOffer2Amount));
            }
            var tutorialDelayWeeks = 2 + 4 * company.getRandom();
            Tutorial.pirateShareOffers(tutorialDelayWeeks); // Hiển thị tutorial về việc bán cổ phần
            return new Notification({
                sourceId: "buySharesOffer",
                header: "Share Offer".localize("heading"),
                text: text,
                options: [
                    "Sell 20% for {0}".localize("keep short").format(UI.getShortNumberString(company.flags.shareOffer1Amount)),
                    "Sell 30% for {0}".localize("keep short").format(UI.getShortNumberString(company.flags.shareOffer2Amount)),
                    "Decline".localize()
                ]
            });
        },
        complete: function (choiceIndex) {
            var company = GameManager.company;
            if (choiceIndex == 0) {
                company.adjustCash(company.flags.shareOffer1Amount, "Share Offer".localize("heading"));
                company.flags.sharesSold += 20;
            } else if (choiceIndex == 1) {
                company.adjustCash(company.flags.shareOffer2Amount, "Share Offer".localize("heading"));
                company.flags.sharesSold += 30;
            }
        }
    };

    // Đề nghị mua lại cổ phần (chỉ ở pirate mode)
    decisionNotificationsModule.buyBackShares = {
        id: "buyBackShares",
        isRandomEvent: !1,
        trigger: function (company) {
            // Điều kiện: pirate mode, đã bán cổ phần, chưa có đề nghị mua lại gần đây (ít nhất 2 năm),
            // và có đủ tiền (gấp 5 lần chi phí trung bình của một game)
            if (!company.flags.pirateMode || !company.flags.sharesSold || !company.isLaterOrEqualThan((typeof company.flags.lastBuyBackOfferYear === "undefined" ? 0 : company.flags.lastBuyBackOfferYear) + 2, 12, 2)) {
                return !1;
            }
            var averageGameCost = company.gameLog.filter(function (game) { return game.costs > 0; }).average(function (game) { return game.costs; });
            return company.cash > 5 * averageGameCost;
        },
        getNotification: function (company, unused_param) {
            company.flags.lastBuyBackOfferYear = company.getCurrentDate().year; // Lưu năm đề nghị mua lại
            var averageGameCost = company.gameLog.filter(function (game) { return game.costs > 0; }).average(function (game) { return game.costs; });
            company.flags.shareOffer1Cost = 3.8 * -averageGameCost; // Chi phí mua lại 20% (âm vì là chi tiền)
            company.flags.shareOffer2Cost = 5.3 * -averageGameCost; // Chi phí mua lại 30%
            var text = "We are currently a {0}% share holder in {1}. We are willing to offer you a chance to buy back some shares.".localize().format(company.flags.sharesSold, company.name);
            text += "\n";
            var sharesToBuyBack1 = 20;
            if (company.flags.sharesSold < 20) { // Nếu số cổ phần đã bán < 20%
                sharesToBuyBack1 = company.flags.sharesSold;
                company.flags.shareOffer1Cost = company.flags.shareOffer1Cost / 20 * sharesToBuyBack1; // Điều chỉnh chi phí
            }
            var options = [
                "Buy {0}% back for {1}".localize("keep short").format(sharesToBuyBack1, UI.getShortNumberString(-1 * company.flags.shareOffer1Cost)), // Hiển thị số tiền dương
                "Buy 30% back for {0}".localize("keep short").format(UI.getShortNumberString(-1 * company.flags.shareOffer2Cost)),
                "Decline".localize()
            ];
            text += ("\n" + "Buy back {0}% for {1}".localize("keep short").format(sharesToBuyBack1, UI.getShortNumberString(-1 * company.flags.shareOffer1Cost)));
            if (company.flags.sharesSold >= 30) { // Nếu có đủ 30% để mua lại
                text += "\n" + "Buy back 30% for {0}".localize("keep short").format(UI.getShortNumberString(-1 * company.flags.shareOffer2Cost));
            } else {
                options.splice(1, 1); // Xóa lựa chọn mua lại 30%
                company.flags.shareOffer2Cost = 0; // Đặt chi phí về 0 để không bị lỗi
            }
            return new Notification({
                sourceId: "buyBackShares",
                header: "Share Offer".localize("heading"),
                text: text,
                options: options
            });
        },
        complete: function (choiceIndex) {
            var company = GameManager.company;
            var noSecondOption = company.flags.shareOffer2Cost == 0;
            if (choiceIndex == 0) {
                company.adjustCash(company.flags.shareOffer1Cost, "Share Offer".localize("heading"));
                company.flags.sharesSold = (company.flags.sharesSold - 20).clamp(0, 100);
            } else if (choiceIndex == 1 && !noSecondOption) { // Kiểm tra lại choiceIndex vì options có thể đã thay đổi
                company.adjustCash(company.flags.shareOffer2Cost, "Share Offer".localize("heading"));
                company.flags.sharesSold -= 30;
            }
        }
    };
})();