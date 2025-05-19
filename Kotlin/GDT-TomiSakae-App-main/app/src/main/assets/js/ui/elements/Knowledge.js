// --- START OF FILE Knowledge.js ---

var Knowledge = {};
(function () {
    /**
     * Kiểm tra xem người chơi đã có kiến thức về sự kết hợp giữa topic và genre (và optional secondGenre) của một game cụ thể chưa.
     * @param {Company} company - Đối tượng công ty của người chơi.
     * @param {Game} game - Đối tượng game cần kiểm tra.
     * @param {Object} [knowledgeSource=company.knowledge] - Nguồn dữ liệu kiến thức để kiểm tra (mặc định là kiến thức của công ty hiện tại).
     * @returns {Object|false} - Trả về đối tượng kiến thức combo nếu tìm thấy, ngược lại trả về false.
     */
    Knowledge.hasComboKnowledge = function (company, game, knowledgeSource) {
        knowledgeSource || (knowledgeSource = company.knowledge); // Nếu không có knowledgeSource, sử dụng kiến thức của công ty
        return knowledgeSource.combos ? knowledgeSource.combos.first(function (comboEntry) {
            return comboEntry.topicId == game.topic.id &&
                comboEntry.genreId == game.genre.id &&
                (!game.secondGenre || game.secondGenre.id == comboEntry.secondGenreId);
        }) : false;
    };

    /**
     * Lưu trữ kiến thức về sự kết hợp topic/genre của một game.
     * Kiến thức này được lưu vào cả kiến thức của công ty hiện tại và kiến thức chung của người chơi (playerKnowledgeData).
     * @param {Company} company - Đối tượng công ty của người chơi.
     * @param {Game} game - Đối tượng game chứa thông tin combo.
     */
    Knowledge.setComboKnowledge = function (company, game) {
        _addComboKnowledge(company, game, company.knowledge);
        _addComboKnowledge(company, game, _playerKnowledgeData); // _playerKnowledgeData là kiến thức chung của người chơi được load từ DataStore
    };

    /**
     * Hàm nội bộ để thêm kiến thức về combo vào một đối tượng kiến thức cụ thể.
     * @param {Company} company - Đối tượng công ty (dùng để gọi hasComboKnowledge).
     * @param {Game} game - Đối tượng game chứa thông tin combo.
     * @param {Object} knowledgeData - Đối tượng kiến thức để thêm combo vào (ví dụ: company.knowledge hoặc _playerKnowledgeData).
     * @private
     */
    var _addComboKnowledge = function (company, game, knowledgeData) {
        knowledgeData.combos || (knowledgeData.combos = []);
        // Nếu chưa có kiến thức về combo này, thì thêm vào
        if (!Knowledge.hasComboKnowledge(company, game, knowledgeData)) {
            var newComboEntry = {
                topicId: game.topic.id,
                genreId: game.genre.id
            };
            if (game.secondGenre) {
                newComboEntry.secondGenreId = game.secondGenre.id;
            }
            knowledgeData.combos.push(newComboEntry);
        }
    };

    /**
     * Lấy gợi ý dạng text về mức độ phù hợp của sự kết hợp topic/genre.
     * @param {Game} game - Đối tượng game để lấy thông tin topic/genre.
     * @returns {string} - Chuỗi mô tả mức độ phù hợp (ví dụ: "great", "good", "okay", "bad", "terrible").
     */
    Knowledge.getComboHintText = function (game) {
        var weightingFactor = GameGenre.getGenreWeighting(game.topic.genreWeightings, game.genre, game.secondGenre);
        return Knowledge.getFactorAdj(weightingFactor, true); // true để trả về dạng text
    };

    /**
     * Chuyển đổi một hệ số weighting thành một chuỗi mô tả (dạng text hoặc dạng ký hiệu).
     * @param {number} weightingFactor - Hệ số weighting (thường từ 0.6 đến 1.0+).
     * @param {boolean} asText - Nếu true, trả về dạng text (great, good,...). Nếu false, trả về dạng ký hiệu (+++, ++,...).
     * @returns {string} - Chuỗi mô tả.
     */
    Knowledge.getFactorAdj = function (weightingFactor, asText) {
        weightingFactor = Math.round(10 * weightingFactor) / 10; // Làm tròn đến 1 chữ số thập phân
        return 1 <= weightingFactor ? (asText ? "great".localize() : "+++") :
            0.9 <= weightingFactor ? (asText ? "good".localize() : "++") :
                0.8 <= weightingFactor ? (asText ? "okay".localize() : "+") :
                    0.7 <= weightingFactor ? (asText ? "bad".localize() : "--") :
                        (asText ? "terrible".localize() : "---");
    };

    /**
     * Lấy gợi ý HTML về mức độ phù hợp của target audience cho một platform cụ thể.
     * @param {Company} company - Đối tượng công ty.
     * @param {Object} platform - Đối tượng platform.
     * @returns {string} - Chuỗi HTML chứa gợi ý.
     */
    Knowledge.getPlatformAudienceHintHtml = function (company, platform) {
        if (!company.canSetTargetAudience()) return "";
        var audienceWeightings = Knowledge.getPlatformAudienceWeightingKnowledge(company, platform);
        return Knowledge.getAudienceHintHtml(audienceWeightings, true); // true để hiển thị label "Audience match:"
    };

    /**
     * Tạo chuỗi HTML hiển thị gợi ý về mức độ phù hợp của các target audience.
     * @param {Array<number>} audienceWeightings - Mảng chứa các hệ số weighting cho 'young', 'everyone', 'mature'.
     * @param {boolean} showLabel - Có hiển thị nhãn "Audience match:" hay không.
     * @returns {string} - Chuỗi HTML.
     */
    Knowledge.getAudienceHintHtml = function (audienceWeightings, showLabel) {
        var htmlString = "";
        if (showLabel) {
            htmlString = '<span style="font-weight:bold">{0}</span>'.format("Audience match:".localize());
        }
        if (!audienceWeightings || 0 === audienceWeightings.sum()) { // Nếu không có dữ liệu hoặc tổng là 0
            return htmlString + ' <span style="font-style:italic">{0}</span>'.format("unknown".localize());
        }

        var _getAudienceSpan = function (audienceType, weighting) {
            if (!weighting || 0 == weighting) { // Nếu weighting không có hoặc bằng 0
                return '<span style="opacity=0.5;font-style:italic">{0}</span>'.format("{0}?").format(General.getShortAudienceLabel(audienceType));
            }
            var factorAdj = Knowledge.getFactorAdj(weighting);
            var colorClass = factorAdj.startsWith("+") ? "green" : "red";
            return '<span class="{0}" style="font-weight:bold">{1}</span>'.format(colorClass,
                "{0}".format(General.getShortAudienceLabel(audienceType) + factorAdj));
        };

        htmlString = htmlString + (" " + _getAudienceSpan("young", audienceWeightings[0]));
        htmlString = htmlString + (" " + _getAudienceSpan("everyone", audienceWeightings[1]));
        return htmlString += " " + _getAudienceSpan("mature", audienceWeightings[2]);
    };

    /**
     * Lấy gợi ý HTML về mức độ phù hợp của các genre cho một platform cụ thể.
     * @param {Company} company - Đối tượng công ty.
     * @param {Object} platform - Đối tượng platform.
     * @returns {string} - Chuỗi HTML chứa gợi ý.
     */
    Knowledge.getPlatformGenreHintHtml = function (company, platform) {
        var htmlString = '<span style="font-weight:bold">{0}</span>'.format("Genre match:".localize());
        var availableGenres = General.getAvailableGenres(company);
        var platformGenreWeightings = Knowledge.getPlatformGenreWeightingKnowledge(company, platform);

        if (!platformGenreWeightings || 0 === platformGenreWeightings.sum()) {
            return htmlString + ' <span style="font-style:italic">{0}</span>'.format("unknown".localize());
        }

        for (var columnCount = 0, i = 0; i < availableGenres.length; i++) {
            columnCount++;
            htmlString += " ";
            if (2 == columnCount) { // Xuống dòng sau mỗi 2 genre để hiển thị đẹp hơn
                htmlString += "<br/>";
            }
            var genreObject = availableGenres[i];
            var weighting = platformGenreWeightings[i];
            var genreHintHtml;

            if (weighting && 0 != weighting) {
                var factorAdj = Knowledge.getFactorAdj(weighting);
                var colorClass = factorAdj.startsWith("+") ? "green" : "red";
                genreHintHtml = '<span class="{0}" style="font-weight:bold">{1}</span>'.format(colorClass, "{0}".format(genreObject.name + factorAdj));
            } else {
                genreHintHtml = '<span style="opacity=0.5;font-style:italic">{0}</span>'.format("{0}?").format(genreObject.name);
            }
            htmlString += genreHintHtml;
        }
        return htmlString;
    };

    /**
     * Kiểm tra xem người chơi đã có kiến thức về mức độ weighting của một mission cụ thể cho một game (topic/genre) cụ thể chưa.
     * @param {Company} company - Đối tượng công ty.
     * @param {Object} mission - Đối tượng mission.
     * @param {Game} game - Đối tượng game.
     * @param {boolean} ignoreTopic - Nếu true, chỉ kiểm tra theo genre, bỏ qua topic.
     * @param {Object} [knowledgeSource=company.knowledge] - Nguồn dữ liệu kiến thức.
     * @returns {boolean} - True nếu đã có kiến thức, false nếu chưa.
     */
    Knowledge.hasMissionWeightingKnowledge = function (company, mission, game, ignoreTopic, knowledgeSource) {
        knowledgeSource || (knowledgeSource = company.knowledge);
        if (knowledgeSource.missionWeightings) {
            return void 0 != knowledgeSource.missionWeightings.first(function (entry) {
                return entry.missionId == mission.id &&
                    (ignoreTopic || entry.topicId == game.topic.id) && // Nếu ignoreTopic là true, thì không cần check topicId
                    entry.genreId == game.genre.id &&
                    (!game.secondGenre || game.secondGenre.id == entry.secondGenreId);
            });
        }
        return false;
    };

    /**
     * Lưu trữ kiến thức về mức độ weighting của một mission cho một game.
     * @param {Company} company - Đối tượng công ty.
     * @param {Object} mission - Đối tượng mission.
     * @param {Game} game - Đối tượng game.
     */
    Knowledge.setMissionWeightingKnowledge = function (company, mission, game) {
        _addMissionWeightingKnowledge(company, mission, game, company.knowledge);
        _addMissionWeightingKnowledge(company, mission, game, _playerKnowledgeData);
    };

    /**
     * Hàm nội bộ để thêm kiến thức về mission weighting vào một đối tượng kiến thức.
     * @param {Company} company - Đối tượng công ty.
     * @param {Object} mission - Đối tượng mission.
     * @param {Game} game - Đối tượng game.
     * @param {Object} knowledgeData - Đối tượng kiến thức.
     * @private
     */
    var _addMissionWeightingKnowledge = function (company, mission, game, knowledgeData) {
        knowledgeData.missionWeightings || (knowledgeData.missionWeightings = []);
        // Nếu chưa có kiến thức (không ignore topic), thì thêm vào
        if (!Knowledge.hasMissionWeightingKnowledge(company, mission, game, false, knowledgeData)) {
            var newWeightingEntry = {
                missionId: mission.id,
                genreId: game.genre.id,
                topicId: game.topic.id
            };
            if (game.secondGenre) {
                newWeightingEntry.secondGenreId = game.secondGenre.id;
            }
            knowledgeData.missionWeightings.push(newWeightingEntry);
        }
    };

    /**
     * Lấy chuỗi mô tả mức độ quan trọng của mission weighting.
     * @param {number} weightingFactor - Hệ số weighting.
     * @param {boolean} asText - Trả về dạng text hay ký hiệu.
     * @returns {string} - Chuỗi mô tả.
     */
    Knowledge.getMissionWeightingDisplayText = function (weightingFactor, asText) {
        weightingFactor = Math.round(10 * weightingFactor) / 10;
        var displayText;
        if (asText) {
            switch (weightingFactor) {
                case 0.6: displayText = "not at all important".localize(); break;
                case 0.7: displayText = "not important".localize(); break;
                case 0.8: displayText = "not very important".localize(); break;
                case 0.9: displayText = "quite important".localize(); break;
                case 1: displayText = "very important".localize(); break;
            }
        } else {
            switch (weightingFactor) {
                case 0.6: displayText = "---"; break;
                case 0.7: displayText = "--"; break;
                case 0.8: displayText = "-"; break;
                case 0.9: displayText = "++"; break;
                case 1: displayText = "+++"; break;
            }
        }
        return displayText;
    };

    /**
     * Lấy gợi ý về mission weighting cho một mission và game cụ thể.
     * @param {Object} mission - Đối tượng mission.
     * @param {Game} game - Đối tượng game.
     * @returns {Object|undefined} - Object chứa {hint, exactMatch} hoặc undefined nếu không có kiến thức.
     */
    Knowledge.getMissionWeightingHint = function (mission, game) {
        var weighting, exactMatch = false;
        // Ưu tiên kiến thức chính xác (cả topic và genre)
        if (Knowledge.hasMissionWeightingKnowledge(GameManager.company, mission, game, false)) {
            exactMatch = true;
            weighting = Missions.getGenreWeighting(mission, game); // Lấy weighting thực tế
        }
        // Nếu không có, thử kiến thức chung hơn (chỉ theo genre, bỏ qua topic)
        else if (Knowledge.hasMissionWeightingKnowledge(GameManager.company, mission, game, true)) {
            weighting = GameGenre.getGenreWeighting(mission.genreWeightings, game.genre, game.secondGenre); // Lấy weighting dựa trên genreWeightings của mission
        }

        if (weighting) {
            return {
                hint: Knowledge.getMissionWeightingDisplayText(weighting),
                exactMatch: exactMatch
            };
        }
        // return undefined; // Mặc định trả về undefined nếu không vào if
    };

    /**
     * Kiểm tra xem có kiến thức về sự phù hợp của một genre cụ thể cho một platform không.
     * @param {Company} company - Đối tượng công ty.
     * @param {Object} platform - Đối tượng platform.
     * @param {Object} genre - Đối tượng genre.
     * @returns {boolean} - True nếu có kiến thức và weighting khác 0.
     */
    Knowledge.hasPlatformGenreWeightingKnowledge = function (company, platform, genre) {
        var platformKnowledge = Knowledge.getPlatformGenreWeightingKnowledge(company, platform);
        return platformKnowledge ? 0 != platformKnowledge[GameGenre.getIndexOf(genre)] : false;
    };

    /**
     * Lấy mảng các hệ số weighting của genre cho một platform từ kiến thức của công ty.
     * @param {Company} company - Đối tượng công ty.
     * @param {Object} platform - Đối tượng platform.
     * @returns {Array<number>|undefined} - Mảng weighting hoặc undefined.
     */
    Knowledge.getPlatformGenreWeightingKnowledge = function (company, platform) {
        var platformKnowledgeArray = company.knowledge.platformKnowledge;
        platformKnowledgeArray || (platformKnowledgeArray = company.knowledge.platformKnowledge = []);
        var platformEntry = platformKnowledgeArray.first(function (entry) {
            return entry.id == platform.id;
        });
        if (platformEntry) {
            return platformEntry.genreWeightings;
        }
        // return undefined; // Mặc định
    };

    /**
     * Lưu trữ kiến thức về sự phù hợp của một genre cho một platform.
     * @param {Company} company - Đối tượng công ty.
     * @param {Object} platform - Đối tượng platform.
     * @param {Object} genre - Đối tượng genre.
     */
    Knowledge.setPlatformGenreWeightingKnowledge = function (company, platform, genre) {
        _setPlatformGenreWeighting(company, platform, genre, company.knowledge);
        _setPlatformGenreWeighting(company, platform, genre, _playerKnowledgeData);
    };

    /**
     * Hàm nội bộ để đặt kiến thức genre của platform.
     * @param {Company} company - (Không dùng trực tiếp, nhưng có thể cần cho các hàm gọi bên trong nếu có)
     * @param {Object} platform - Đối tượng platform.
     * @param {Object} genre - Đối tượng genre.
     * @param {Object} knowledgeData - Nguồn kiến thức để cập nhật.
     * @private
     */
    var _setPlatformGenreWeighting = function (company, platform, genre, knowledgeData) {
        var platformKnowledgeArray = knowledgeData.platformKnowledge;
        platformKnowledgeArray || (platformKnowledgeArray = knowledgeData.platformKnowledge = []);

        var platformEntry = platformKnowledgeArray.first(function (entry) {
            return entry.id == platform.id;
        });
        if (!platformEntry) {
            platformEntry = { id: platform.id };
            platformKnowledgeArray.push(platformEntry);
        }
        platformEntry.genreWeightings || (platformEntry.genreWeightings = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // Khởi tạo nếu chưa có

        var genreIndex = GameGenre.getIndexOf(genre);
        // GameGenre.getGenreWeighting(platform.genreWeightings, genre); // Dòng này có vẻ không cần thiết, chỉ lấy weighting
        platformEntry.genreWeightings[genreIndex] = platform.genreWeightings[genreIndex]; // Gán weighting thực tế
    };

    /**
     * Kiểm tra xem có kiến thức về sự phù hợp của một target audience cho một platform không.
     * @param {Company} company - Đối tượng công ty.
     * @param {Object} platform - Đối tượng platform.
     * @param {string} audienceType - Loại audience ("young", "everyone", "mature").
     * @returns {boolean}
     */
    Knowledge.hasPlatformAudienceWeightingKnowledge = function (company, platform, audienceType) {
        var platformKnowledge = Knowledge.getPlatformAudienceWeightingKnowledge(company, platform);
        return platformKnowledge ? 0 != platformKnowledge[General.getAudienceWeightinIndex(audienceType)] : false;
    };

    /**
     * Lấy mảng các hệ số weighting của audience cho một platform từ kiến thức của công ty.
     * @param {Company} company - Đối tượng công ty.
     * @param {Object} platform - Đối tượng platform.
     * @returns {Array<number>|undefined}
     */
    Knowledge.getPlatformAudienceWeightingKnowledge = function (company, platform) {
        var platformKnowledgeArray = company.knowledge.platformKnowledge;
        platformKnowledgeArray || (platformKnowledgeArray = company.knowledge.platformKnowledge = []);
        var platformEntry = platformKnowledgeArray.first(function (entry) {
            return entry.id == platform.id;
        });
        if (platformEntry) {
            return platformEntry.audienceWeightings;
        }
    };

    /**
     * Lưu trữ kiến thức về sự phù hợp của một target audience cho một platform.
     * @param {Company} company - Đối tượng công ty.
     * @param {Object} platform - Đối tượng platform.
     * @param {string} audienceType - Loại audience.
     */
    Knowledge.setPlatformAudienceWeightingKnowledge = function (company, platform, audienceType) {
        _setPlatformAudienceWeighting(company, platform, audienceType, company.knowledge);
        _setPlatformAudienceWeighting(company, platform, audienceType, _playerKnowledgeData);
    };

    /**
     * Hàm nội bộ để đặt kiến thức audience của platform.
     * @param {Company} company - (Không dùng trực tiếp)
     * @param {Object} platform - Đối tượng platform.
     * @param {string} audienceType - Loại audience.
     * @param {Object} knowledgeData - Nguồn kiến thức để cập nhật.
     * @private
     */
    var _setPlatformAudienceWeighting = function (company, platform, audienceType, knowledgeData) {
        var platformKnowledgeArray = knowledgeData.platformKnowledge;
        platformKnowledgeArray || (platformKnowledgeArray = knowledgeData.platformKnowledge = []);

        var platformEntry = platformKnowledgeArray.first(function (entry) {
            return entry.id == platform.id;
        });
        if (!platformEntry) {
            platformEntry = { id: platform.id };
            platformKnowledgeArray.push(platformEntry);
        }
        platformEntry.audienceWeightings || (platformEntry.audienceWeightings = [0, 0, 0]);

        var actualWeighting = Platforms.getAudienceWeighting([platform], audienceType, true); // true để lấy giá trị gốc, không chuẩn hóa
        platformEntry.audienceWeightings[General.getAudienceWeightinIndex(audienceType)] = actualWeighting;
    };

    /**
     * Kiểm tra xem có kiến thức về sự phù hợp của một target audience cho một topic không.
     * Nếu audienceType được cung cấp, kiểm tra cụ thể cho loại đó.
     * Nếu không, kiểm tra xem có bất kỳ kiến thức nào về audience cho topic đó không.
     * @param {Company} company - Đối tượng công ty.
     * @param {Object} topic - Đối tượng topic.
     * @param {string} [audienceType] - Loại audience.
     * @returns {boolean}
     */
    Knowledge.hasTopicAudienceWeightingKnowledge = function (company, topic, audienceType) {
        var topicKnowledge = Knowledge.getTopicAudienceWeightingKnowledge(company, topic);
        return topicKnowledge ? (audienceType ? 0 != topicKnowledge[General.getAudienceWeightinIndex(audienceType)] : 0 != topicKnowledge.sum()) : false;
    };

    /**
     * Lấy gợi ý HTML về mức độ phù hợp của target audience cho một topic.
     * @param {Company} company - Đối tượng công ty.
     * @param {Object} topic - Đối tượng topic.
     * @returns {string} - Chuỗi HTML.
     */
    Knowledge.getTopicAudienceHtml = function (company, topic) {
        return Knowledge.getAudienceHintHtml(Knowledge.getTopicAudienceWeightingKnowledge(company, topic), false); // false để không hiển thị label "Audience match:"
    };

    /**
     * Lấy mảng các hệ số weighting của audience cho một topic từ kiến thức của công ty.
     * @param {Company} company - Đối tượng công ty.
     * @param {Object} topic - Đối tượng topic.
     * @returns {Array<number>|undefined}
     */
    Knowledge.getTopicAudienceWeightingKnowledge = function (company, topic) {
        var topicKnowledgeArray = company.knowledge.topicKnowledge;
        topicKnowledgeArray || (topicKnowledgeArray = company.knowledge.topicKnowledge = []);
        var topicEntry = topicKnowledgeArray.first(function (entry) {
            return entry.id == topic.id;
        });
        if (topicEntry) {
            return topicEntry.audienceWeightings;
        }
    };

    /**
     * Lưu trữ kiến thức về sự phù hợp của một target audience cho một topic.
     * @param {Company} company - Đối tượng công ty.
     * @param {Object} topic - Đối tượng topic.
     * @param {string} audienceType - Loại audience.
     */
    Knowledge.setTopicAudienceWeightingKnowledge = function (company, topic, audienceType) {
        _setTopicAudienceWeighting(company, topic, audienceType, company.knowledge);
        _setTopicAudienceWeighting(company, topic, audienceType, _playerKnowledgeData);
    };

    /**
     * Hàm nội bộ để đặt kiến thức audience của topic.
     * @param {Company} company - (Không dùng trực tiếp)
     * @param {Object} topic - Đối tượng topic.
     * @param {string} audienceType - Loại audience.
     * @param {Object} knowledgeData - Nguồn kiến thức để cập nhật.
     * @private
     */
    var _setTopicAudienceWeighting = function (company, topic, audienceType, knowledgeData) {
        var topicKnowledgeArray = knowledgeData.topicKnowledge;
        topicKnowledgeArray || (topicKnowledgeArray = knowledgeData.topicKnowledge = []);

        var topicEntry = topicKnowledgeArray.first(function (entry) {
            return entry.id == topic.id;
        });
        if (!topicEntry) {
            topicEntry = { id: topic.id };
            topicKnowledgeArray.push(topicEntry);
        }
        topicEntry.audienceWeightings || (topicEntry.audienceWeightings = [0, 0, 0]);

        var actualWeighting = General.getAudienceWeighting(topic.audienceWeightings, audienceType);
        topicEntry.audienceWeightings[General.getAudienceWeightinIndex(audienceType)] = actualWeighting;
    };

    /**
     * Đánh dấu một khóa đào tạo là đã được "biết đến" (có thể là đã hoàn thành hoặc đã thấy).
     * @param {Object} trainingItem - Đối tượng khóa đào tạo.
     */
    Knowledge.setTrainingKnowledge = function (trainingItem) {
        var currentCompany = GameManager.company;
        var trainingKnowledgeArray = currentCompany.knowledge.trainingKnowledge;
        trainingKnowledgeArray || (trainingKnowledgeArray = currentCompany.knowledge.trainingKnowledge = []);

        var existingEntry = trainingKnowledgeArray.first(function (entry) {
            return entry.id == trainingItem.id;
        });
        if (!existingEntry) {
            existingEntry = { id: trainingItem.id };
            trainingKnowledgeArray.push(existingEntry);
        }
    };

    /**
     * Kiểm tra xem một khóa đào tạo đã được "biết đến" chưa.
     * @param {Object} trainingItem - Đối tượng khóa đào tạo.
     * @returns {Object|undefined} - Đối tượng kiến thức về khóa đào tạo đó nếu có, ngược lại là undefined.
     */
    Knowledge.hasTrainingKnowledge = function (trainingItem) {
        var currentCompany = GameManager.company;
        var trainingKnowledgeArray = currentCompany.knowledge.trainingKnowledge;
        trainingKnowledgeArray || (trainingKnowledgeArray = currentCompany.knowledge.trainingKnowledge = []);
        return trainingKnowledgeArray.first(function (entry) {
            return entry.id == trainingItem.id;
        });
    };

    /**
     * Lấy gợi ý HTML về hiệu quả của một khóa đào tạo đối với các kỹ năng.
     * @param {Object} trainingItem - Đối tượng khóa đào tạo.
     * @returns {string} - Chuỗi HTML.
     */
    Knowledge.getTrainingKnowledgeHtml = function (trainingItem) {
        if (!Knowledge.hasTrainingKnowledge(trainingItem)) {
            return '<span style="font-style:italic;opacity:0.5">{0}</span>'.format("unknown".localize());
        }
        var skillKeys = [
            { key: "tF", name: "Technology".localize() },
            { key: "dF", name: "Design".localize() },
            { key: "rF", name: "Research".localize() },
            { key: "sF", name: "Speed".localize() }
        ];
        var htmlString = "";
        // Sắp xếp các kỹ năng theo mức độ ảnh hưởng của khóa đào tạo (giảm dần)
        skillKeys.sort(function (skillA, skillB) {
            return trainingItem[skillB.key] - trainingItem[skillA.key];
        });

        for (var i = 0; i < skillKeys.length; i++) {
            var skillInfo = skillKeys[i];
            if (0 != trainingItem[skillInfo.key]) { // Chỉ hiển thị nếu có ảnh hưởng
                htmlString += ' <span class="green">{0}{1}</span>'.format(skillInfo.name,
                    trainingItem[skillInfo.key] >= 1 ? "+++" :
                        trainingItem[skillInfo.key] >= 0.5 ? "++" : "+");
            }
        }
        return htmlString;
    };

    // Biến lưu trữ kiến thức chung của người chơi, được load từ DataStore.
    // Đây là kiến thức tích lũy qua nhiều lần chơi (nếu game có cơ chế này).
    var _playerKnowledgeData = {};

    /**
     * Tải kiến thức đã lưu của người chơi từ DataStore.
     */
    Knowledge.loadPlayerKnowledge = function () {
        DataStore.loadSlotAsync("knowledge", function (dataString) {
            if (dataString) {
                try {
                    _playerKnowledgeData = JSON.parse(dataString);
                } catch (error) {
                    Logger.LogInfo("Could not load already gained knowledge", error);
                }
            }
        }, function (error) { /* Lỗi khi load, có thể không làm gì hoặc log lỗi */ });
    };

    /**
     * Lưu kiến thức hiện tại của người chơi vào DataStore.
     */
    Knowledge.savePlayerKnowledge = function () {
        var dataString = JSON.stringify(_playerKnowledgeData);
        DataStore.saveToSlotAsync("knowledge", dataString, function () {
            if (DataStore.commit) { // Một số implement của DataStore có thể cần commit
                DataStore.commit();
            }
        }, function (error) { /* Lỗi khi save */ });
    };

    /**
     * Áp dụng kiến thức chung của người chơi vào công ty hiện tại.
     * @param {Company} company - Đối tượng công ty để gán kiến thức vào.
     */
    Knowledge.usePlayerKnowledge = function (company) {
        company.knowledge = _playerKnowledgeData;
    };

    /**
     * Kiểm tra xem có bất kỳ kiến thức nào của người chơi đã được lưu trữ hay không.
     * @returns {boolean}
     */
    Knowledge.isPlayerKnowledgeAvailable = function () {
        return [_playerKnowledgeData.combos, _playerKnowledgeData.missionWeightings, _playerKnowledgeData.platformKnowledge, _playerKnowledgeData.topicKnowledge].some(function (knowledgeCategory) {
            return knowledgeCategory && 0 < knowledgeCategory.length;
        });
    };

    /**
     * Gộp kiến thức từ hai nguồn (thường là local và cloud) lại với nhau.
     * Ưu tiên giữ lại các entry đã có và chỉ thêm các entry mới từ nguồn thứ hai.
     * @param {string} localDataString - Chuỗi JSON chứa kiến thức local.
     * @param {string} cloudDataString - Chuỗi JSON chứa kiến thức từ cloud.
     * @returns {string} - Chuỗi JSON chứa kiến thức đã được gộp.
     */
    Knowledge.merge = function (localDataString, cloudDataString) {
        if (localDataString == cloudDataString) return localDataString; // Nếu giống hệt, không cần gộp

        var localKnowledge = JSON.parse(localDataString);
        if (null == localKnowledge) return cloudDataString; // Nếu local rỗng, trả về cloud

        var cloudKnowledge = JSON.parse(cloudDataString);
        if (null == cloudKnowledge) return localDataString; // Nếu cloud rỗng, trả về local

        // Gộp combos
        if (localKnowledge.combos) {
            if (cloudKnowledge.combos) {
                cloudKnowledge.combos.forEach(function (cloudCombo) {
                    // Nếu combo từ cloud chưa tồn tại trong local, thì thêm vào
                    if (void 0 == localKnowledge.combos.first(function (localCombo) {
                        return localCombo.topicId == cloudCombo.topicId &&
                            localCombo.genreId == cloudCombo.genreId &&
                            (!localCombo.secondGenreId && !cloudCombo.secondGenreId || localCombo.secondGenreId == cloudCombo.secondGenreId);
                    })) {
                        localKnowledge.combos.push(cloudCombo);
                    }
                });
            }
        } else { // Nếu local không có combos, lấy từ cloud
            localKnowledge.combos = cloudKnowledge.combos;
        }

        // Gộp missionWeightings
        if (localKnowledge.missionWeightings) {
            if (cloudKnowledge.missionWeightings) {
                cloudKnowledge.missionWeightings.forEach(function (cloudWeighting) {
                    if (void 0 == localKnowledge.missionWeightings.first(function (localWeighting) {
                        return localWeighting.missionId == cloudWeighting.missionId &&
                            (!localWeighting.topicId && !cloudWeighting.topicId || localWeighting.topicId == cloudWeighting.topicId) &&
                            localWeighting.genreId == cloudWeighting.genreId &&
                            (!localWeighting.secondGenreId && !cloudWeighting.secondGenreId || localWeighting.secondGenreId == cloudWeighting.secondGenreId);
                    })) {
                        localKnowledge.missionWeightings.push(cloudWeighting);
                    }
                });
            }
        } else {
            localKnowledge.missionWeightings = cloudKnowledge.missionWeightings;
        }

        // Gộp platformKnowledge
        if (localKnowledge.platformKnowledge) {
            if (cloudKnowledge.platformKnowledge) {
                cloudKnowledge.platformKnowledge.forEach(function (cloudPlatform) {
                    var localPlatform = localKnowledge.platformKnowledge.first(function (localEntry) {
                        return cloudPlatform.id == localEntry.id;
                    });
                    if (void 0 == localPlatform) { // Nếu platform chưa có trong local, thêm mới
                        localKnowledge.platformKnowledge.push(cloudPlatform);
                    } else { // Nếu đã có, gộp genreWeightings và audienceWeightings
                        // Gộp genreWeightings
                        if (void 0 == localPlatform.genreWeightings) {
                            localPlatform.genreWeightings = cloudPlatform.genreWeightings;
                        } else if (void 0 != cloudPlatform.genreWeightings) {
                            for (var i = 0; i < 11; i++) { // Giả sử có 11 genre
                                if (0 == localPlatform.genreWeightings[i]) { // Chỉ cập nhật nếu local chưa có (bằng 0)
                                    localPlatform.genreWeightings[i] = cloudPlatform.genreWeightings[i];
                                }
                            }
                        }
                        // Gộp audienceWeightings
                        if (void 0 == localPlatform.audienceWeightings) {
                            localPlatform.audienceWeightings = cloudPlatform.audienceWeightings;
                        } else if (void 0 != cloudPlatform.audienceWeightings) {
                            for (var i = 0; i < 3; i++) { // Giả sử có 3 loại audience
                                if (0 == localPlatform.audienceWeightings[i]) {
                                    localPlatform.audienceWeightings[i] = cloudPlatform.audienceWeightings[i];
                                }
                            }
                        }
                    }
                });
            }
        } else {
            localKnowledge.platformKnowledge = cloudKnowledge.platformKnowledge;
        }

        // Gộp topicKnowledge
        if (localKnowledge.topicKnowledge) {
            if (cloudKnowledge.topicKnowledge) {
                cloudKnowledge.topicKnowledge.forEach(function (cloudTopic) {
                    var localTopic = localKnowledge.topicKnowledge.first(function (localEntry) {
                        return localEntry.id == cloudTopic.id;
                    });
                    if (void 0 == localTopic) {
                        localKnowledge.topicKnowledge.push(cloudTopic);
                    } else {
                        // Gộp audienceWeightings cho topic
                        if (void 0 == localTopic.audienceWeightings) {
                            localTopic.audienceWeightings = cloudTopic.audienceWeightings;
                        } else if (void 0 != cloudTopic.audienceWeightings) {
                            for (var i = 0; i < 3; i++) {
                                if (0 == localTopic.audienceWeightings[i]) {
                                    localTopic.audienceWeightings[i] = cloudTopic.audienceWeightings[i];
                                }
                            }
                        }
                    }
                });
            }
        } else {
            localKnowledge.topicKnowledge = cloudKnowledge.topicKnowledge;
        }

        // Gộp trainingKnowledge
        if (localKnowledge.trainingKnowledge) {
            if (cloudKnowledge.trainingKnowledge) {
                cloudKnowledge.trainingKnowledge.forEach(function (cloudTraining) {
                    if (void 0 == localKnowledge.trainingKnowledge.first(function (localTraining) {
                        return localTraining.id == cloudTraining.id;
                    })) {
                        localKnowledge.trainingKnowledge.push(cloudTraining);
                    }
                });
            }
        } else {
            localKnowledge.trainingKnowledge = cloudKnowledge.trainingKnowledge;
        }

        return JSON.stringify(localKnowledge);
    };
})();
// --- END OF FILE Knowledge.js ---