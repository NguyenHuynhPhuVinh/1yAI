// --- START OF FILE GameTrends.js ---

var GameTrends = {}; // Khởi tạo namespace GameTrends
(function () {
    var gameTrendsModule = GameTrends; // Gán GameTrends vào một biến cục bộ để dễ sử dụng và có thể rút gọn tên nếu cần

    /**
     * Lấy hệ số ảnh hưởng của xu hướng hiện tại lên một game cụ thể.
     * @param {Game} game Đối tượng game cần kiểm tra.
     * @returns {number} Hệ số ảnh hưởng (ví dụ: 1.2 nếu game phù hợp xu hướng, 1 nếu không).
     */
    gameTrendsModule.getCurrentTrendFactor = function (game) {
        var currentTrend = getCompanyTrends(GameManager.company).currentTrend; // Lấy xu hướng hiện tại của công ty

        // Nếu không có xu hướng nào, trả về hệ số 1 (không ảnh hưởng)
        if (!currentTrend) return 1;

        // Kiểm tra loại xu hướng và áp dụng hệ số tương ứng
        if ("genre" === currentTrend.type) {
            // Nếu xu hướng là về thể loại
            if (game.genre.id == currentTrend.genre) return 1.2; // Game cùng thể loại với xu hướng
        } else if ("newTopics" === currentTrend.type) {
            // Nếu xu hướng là về chủ đề mới
            var topicId = game.topic.id;
            // Kiểm tra xem công ty đã từng phát hành game nào với chủ đề này chưa
            if (0 === GameManager.company.gameLog.count(function (loggedGame) {
                return loggedGame.topic.id === topicId;
            })) return 1.2; // Game có chủ đề mới
        } else if ("audience" === currentTrend.type) {
            // Nếu xu hướng là về đối tượng người chơi
            if (game.targetAudience === currentTrend.audience) return 1.2; // Game nhắm đúng đối tượng của xu hướng
        } else if ("strangeCombos" === currentTrend.type) {
            // Nếu xu hướng là về các sự kết hợp "lạ" (topic/genre không hợp nhau theo logic thông thường)
            var genreWeighting = GameGenre.getGenreWeighting(game.topic.genreWeightings, game.genre);
            // Trả về các hệ số khác nhau dựa trên mức độ "lạ" của sự kết hợp
            return 1 === genreWeighting ? 0.85 : // Kết hợp tốt -> giảm điểm vì xu hướng là "lạ"
                0.9 === genreWeighting ? 1.1 : // Kết hợp khá -> tăng điểm
                    0.8 === genreWeighting ? 1.2 : // Kết hợp trung bình -> tăng điểm nhiều hơn
                        1.4; // Mặc định cho các trường hợp còn lại (có thể là kết hợp tệ -> tăng điểm nhiều nhất)
        }
        return 1; // Mặc định không có ảnh hưởng
    };

    /**
     * Hàm nội bộ để lấy hoặc khởi tạo đối tượng trends của công ty.
     * @param {Company} company Đối tượng công ty.
     * @returns {object} Đối tượng trends của công ty.
     */
    var getCompanyTrends = function (company) {
        // Nếu công ty chưa có cờ 'trends', khởi tạo nó và tạo xu hướng mới
        company.flags.trends || (company.flags.trends = {}, createNewTrend(company));
        return company.flags.trends;
    };

    /**
     * Hàm nội bộ để tạo hoặc làm mới một xu hướng cho công ty.
     * @param {Company} company Đối tượng công ty.
     */
    var createNewTrend = function (company) {
        var companyTrends = company.flags.trends;
        // Đặt thời gian hết hạn cho xu hướng hiện tại
        companyTrends.expireBy = GameManager.gameTime + (24 + 12 * company.getRandom()) * GameManager.SECONDS_PER_WEEK * 1E3;

        // Chỉ tạo xu hướng mới nếu công ty không ở level 1 (level đầu tiên thường không có xu hướng phức tạp)
        if (1 != company.currentLevel) {
            var previousTrend = companyTrends.currentTrend;
            companyTrends.currentTrend = null; // Reset xu hướng hiện tại

            // Có 50% cơ hội tạo một xu hướng mới nếu xu hướng trước đó là null
            if (null === previousTrend && 0.5 <= company.getRandom()) {
                var randomFactor = company.getRandom(); // Lấy một số ngẫu nhiên để quyết định loại xu hướng
                if (0.5 >= randomFactor) {
                    // 50% cơ hội: Xu hướng về thể loại
                    var randomGenre = General.getAvailableGenres(company).pickRandom();
                    companyTrends.currentTrend = {
                        type: "genre",
                        genre: randomGenre.id,
                        label: "Popular genre: ".localize() + randomGenre.name
                    };
                } else if (0.7 >= randomFactor) {
                    // 20% cơ hội (0.7-0.5): Xu hướng về chủ đề mới
                    companyTrends.currentTrend = {
                        type: "newTopics",
                        label: "Popular: New topics".localize()
                    };
                } else if (0.95 >= randomFactor) {
                    // 25% cơ hội (0.95-0.7): Xu hướng về đối tượng người chơi (nếu công ty có thể đặt đối tượng)
                    company.canSetTargetAudience() && (randomGenre = ["young", "everyone", "mature"].pickRandom(), companyTrends.currentTrend = {
                        type: "audience",
                        audience: randomGenre,
                        label: "Strong audience: ".localize() + General.getAudienceLabel(randomGenre)
                    });
                } else if (0.96 <= randomFactor) { // Chỗ này có vẻ logic hơi lạ, chỉ 1% cơ hội. Có thể là 0.95 < randomFactor
                    // 1% (hoặc 5% nếu điều kiện trên là >0.95): Xu hướng về các kết hợp lạ
                    companyTrends.currentTrend = {
                        type: "strangeCombos",
                        strength: 1,
                        label: "Trend: Strange combinations".localize()
                    };
                }
            }
            // Tạo thông báo về sự thay đổi xu hướng (nếu có)
            createTrendChangeNotification(company, previousTrend, companyTrends.currentTrend);
        }
    };

    /**
     * Hàm nội bộ để tạo thông báo tin tức khi xu hướng thị trường thay đổi.
     * @param {Company} company Đối tượng công ty.
     * @param {object} previousTrend Xu hướng trước đó.
     * @param {object} newTrend Xu hướng mới.
     */
    var createTrendChangeNotification = function (company, previousTrend, newTrend) {
        var notificationMessage; // Biến chứa nội dung thông báo

        // Nếu có xu hướng cũ và không có xu hướng mới -> thị trường bình thường trở lại
        if (previousTrend && !newTrend) {
            notificationMessage = ["It seems that the market has normalized again with no particular strong trends at the moment.".localize()].pickRandom();
        } else if (newTrend) { // Nếu có xu hướng mới
            switch (newTrend.type) {
                case "genre":
                    var popularGenre = General.getAvailableGenres(company).first(function (genreToCheck) {
                        return genreToCheck.id === newTrend.genre;
                    });
                    notificationMessage = ["It seems that {0} games are especially popular at the moment.".localize(), "There is a clear trend towards {0} games recently.".localize()].pickRandom().format(popularGenre.name);
                    break;
                case "newTopics":
                    notificationMessage = "It seems that the market responds particularly well to games with new topics at the moment.".localize();
                    break;
                case "audience":
                    notificationMessage = ""; // Không có thông báo cụ thể cho xu hướng đối tượng ở đây, có thể xử lý ở nơi khác
                    break;
                case "strangeCombos":
                    notificationMessage = "Analysts have observed a strange trend lately where players around the world seem to have developed a curious taste for unusual games.{n}As one player put it: 'Sometimes you just want to play something unique. A game based on an idea that's not the usual Military/Action game or Fantasy/RPG just to name two examples.\nI really hope companies bring some unique games to market soon. I would definitely prefer them right now.'{n}This new trend promises to bring an interesting challenge to game developers as topic/genre combinations which used to work well will suddenly be less favorable while more outlandish ideas might flourish.".localize();
                    break;
            }
        }

        // Nếu có nội dung thông báo, thêm nó vào danh sách thông báo của công ty
        notificationMessage &&
            company.notifications.push(new Notification("Market Analysis".localize("heading"), notificationMessage, {
                type: NotificationType.IndustryNews
            }));
    };

    /**
     * Cập nhật xu hướng thị trường. Được gọi mỗi khi một tuần trong game trôi qua.
     * @param {Company} company Đối tượng công ty.
     */
    gameTrendsModule.updateTrends = function (company) {
        // Nếu thời gian hết hạn của xu hướng hiện tại đã đến, tạo xu hướng mới
        getCompanyTrends(company).expireBy <= GameManager.gameTime && createNewTrend(company);
    };
})();
// --- END OF FILE GameTrends.js ---