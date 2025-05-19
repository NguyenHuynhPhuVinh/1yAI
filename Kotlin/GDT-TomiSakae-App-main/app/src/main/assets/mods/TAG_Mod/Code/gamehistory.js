$(function () {
    tagMod.patch(UI, "showGameHistory", function (e, t, a) {
        var i = t ? !0 === GameManager.flags.createPack ? GameManager.company.getPossibleGamesForPack() : GameManager.company.getPossibleGamesForSequel() : GameManager.company.gameLog;
        if (0 != (i = i.slice()).length) {
            i.sort(function (e, t) {
                return e.releaseWeek < t.releaseWeek ? 1 : -1
            });
            var N = $("#gameHistoryDialog").parent();
            N.css("width", "520px").css("left", parseFloat(N.css("left")) + 70 + "px"), N.append('<div class="tm-modal-side-panel tm-modal-side-panel-left"><div class="tm-modal-title tm-icon tm-icon-grey-square tm-icon-game-controller-white">{0}</div><div class="tm-modal-side-panel-content tm-game-list"></div></div><div class="tm-modal-side-panel tm-modal-side-panel-right"><div class="tm-modal-title tm-icon tm-icon-grey-square tm-icon-info">{1}</div><div class="tm-game-info-actions"></div><div class="tm-game-info tm-modal-side-panel-content"><div class="tm-titled-separator tm-icon tm-icon-gear">{2}</div><div class="tm-game-info-engine"></div><div class="tm-titled-separator tm-icon tm-icon-features">{3}</div><div class="tm-game-info-features tm-feature-list"></div><div class="tm-titled-separator tm-icon tm-icon-hammer">{4}</div><div class="tm-game-info-dev-stages"></div><div class="tm-titled-separator tm-icon tm-icon-insights">{5}</div><div class="tm-game-info-post-mortem"></div></div>'.format("Lịch Sử Game", "Thông Tin Game", "Engine", "Tính Năng", "Phát Triển", "Phân Tích")), $("#gameHistoryDialog .windowTitle").removeClass("windowTitle").addClass("tm-modal-title has-subtitle").html('<div class="tm-modal-title-main"></div><div class="tm-modal-title-sub"></div>'), tagMod.setupListDisplay(N.find(".tm-game-list"), $("#gameHistoryContent"), i, function (c, e) {
                $("#gameHistoryDialog .tm-modal-title-main").text(c.title), $("#gameHistoryDialog .tm-modal-title-sub").text(tagMod.getGameTopicGenreString(c));
                var t = $('<div class="tm-list-content rsActiveSlide"><div class="tm-contract-row"><div class="tm-contract-rating"></div><div class="tm-game-history-badges"><img class="backdrop" src="' + MOD_DIR + 'Img/Badges/badgesBackdrop.png"></div></div><div class="tm-contract-row"><div class="tm-contract-req-aud"><div class="tm-contract-row-title">{0}</div><div class="tm-contract-requirements"></div><div class="tm-contract-audience"></div></div><div class="tm-contract-platforms-wrapper"><div class="tm-contract-row-title">{1}</div><div class="tm-contract-platforms"></div></div></div></div>'.format("Thống Kê", "Nền Tảng")),
                    a = t.find(".tm-contract-rating"),
                    i = t.find(".tm-game-history-badges"),
                    s = t.find(".tm-contract-requirements"),
                    n = t.find(".tm-contract-audience"),
                    l = t.find(".tm-contract-platforms"),
                    r = c.revenue;
                (null == r || isNaN(r)) && (r = 0);
                var m = r - c.costs,
                    o = 0 <= m ? "green" : "red",
                    d = tagMod.getAverageGameScore(c);
                if (c.reviewMessageDisplayed ? generateReviewCircle(a, 120, d, !0) : generateReviewCircle(a, 120, null, !0), c.id == GameManager.company.getBestSeller().id && i.append('<img src="' + MOD_DIR + 'Img/Badges/best-seller.png"></img>'), 9 <= d && 1 == c.topSalesRank && i.append('<img src="' + MOD_DIR + 'Img/Badges/game-of-the-year.png"></img>'), c.flags.pirated) {
                    var g = "?";
                    c.flags.postMortemCompleted && (g = Math.floor(c.flags.piracyRate) + "%"), s.append(k("Tỷ Lệ Crack", g))
                }
                if (s.append(k("Kích Thước Game", General.getGameSizeLabel(c.gameSize))), s.append(k("Đã Bán", null != c.unitsSold ? UI.getLongNumberString(c.unitsSold) : "0")), s.append(k("Chi Phí", '<div class="red">' + UI.getShortNumberString(c.costs) + "</div>")), s.append(k("Doanh Thu", '<div class="green">' + UI.getShortNumberString(r) + "</div>")), s.append(k("Lợi Nhuận", '<div class="' + o + '">' + UI.getShortNumberString(m) + "</div>")), s.append(k("Phát Hành", tagMod.dateToString(c.releaseWeek))), s.append(k("Người Hâm Mộ", UI.getLongNumberString(Math.max(0, Math.round(c.fansChanged))))), 0 < c.topSalesRank && s.append(k("Xếp Hạng Bán Chạy", "#" + c.topSalesRank)), c.targetAudience) {
                    var v = MOD_DIR + "Img/Ratings/" + c.targetAudience + ".png";
                    n.append('<img class="tm-audience-rating" src="' + v + '" />')
                }
                for (var p = 0; p < c.platforms.length; p++) {
                    var f = c.platforms[p],
                        u = (v = Platforms.getPlatformImage(f, GameManager.company.currentWeek), f.name);
                    l.append('<div class="tm-platform"><div class="tm-platform-img"><img src="' + v + '" /></div><div class="tm-platform-label">' + u + "</div></div>")
                }
                var S = N.find(".tm-game-info"),
                    b = N.find(".tm-game-info-actions"),
                    y = S.find(".tm-game-info-engine"),
                    h = S.find(".tm-game-info-features"),
                    z = S.find(".tm-game-info-dev-stages"),
                    M = S.find(".tm-game-info-post-mortem");
                if (c.canDoPostMortem()) {
                    b.show();
                    var G = null != GameManager.company.staff.find(tagMod.staffAvailableToWork);
                    b.html('<div class="btn-generate-report btn-tm-action btn-tm-action-primary" data-id="' + c.id + '">{0}</div>'.format("Tạo Báo Cáo")), G || b.find(".btn-generate-report").addClass("disabledButton")
                } else b.hide();
                if (c.engine) {
                    y.html('<div class="tm-engine"><div class="tm-engine-name"></div><div class="tm-engine-details"><div class="tm-engine-current"></div><div class="tm-engine-cost red"></div></div></div>');
                    var D = y.find(".tm-engine-name"),
                        I = y.find(".tm-engine-current"),
                        w = y.find(".tm-engine-cost"),
                        x = GameManager.company.engines.last();
                    D.text(c.engine.name), c.engine.id == x.id ? I.addClass("green").text("Engine Hiện Tại") : I.addClass("red").text("Engine Cũ"), w.text(UI.getShortNumberString(c.engine.costs))
                } else y.text("Không Có Engine");
                h.empty();
                var R = c.features.slice();
                R.sort(function (e, t) {
                    function a(e) {
                        switch (e.categoryDisplayName) {
                            case "Engine".localize():
                                return 0;
                            case "Gameplay".localize():
                                return 1;
                            case "Story/Quests".localize():
                                return 2;
                            case "Dialogues".localize():
                                return 3;
                            case "Level Design".localize():
                                return 4;
                            case "A.I.".localize():
                                return 5;
                            case "World Design".localize():
                                return 6;
                            case "Graphic".localize():
                                return 7;
                            case "Sound".localize():
                                return 8
                        }
                    }
                    return a(e) < a(t) ? -1 : 1
                });
                for (p = 0; p < R.length; p++) {
                    var C = R[p];
                    h.append('<div class="tm-feature tm-icon-sm ' + tagMod.getIconClassFromCategory(C.categoryDisplayName) + '">' + C.name + "</div>")
                }

                function P(e, t) {
                    var a = $('<div class="tm-dev-stage"><div class="tm-dev-stage-name"></div><div class="tm-dev-stage-comps"></div></div>'),
                        i = a.find(".tm-dev-stage-name"),
                        s = a.find(".tm-dev-stage-comps");
                    i.text("{0} {1}".format("Giai Đoạn", e));
                    for (var n = 0; n < t.length; n++) {
                        var l = t[n],
                            r = $('<div class="tm-comp"><div class="tm-comp-rating"></div><div class="tm-comp-label"></div></div>'),
                            m = r.find(".tm-comp-rating");
                        r.find(".tm-comp-label").text(l.localize());
                        var o = null;
                        switch (n) {
                            case 0:
                                o = ["#f64646", "#951a74"];
                                break;
                            case 1:
                                o = ["#b6cb6b", "#16a085"];
                                break;
                            case 2:
                                o = ["#29d6dd", "#1e79ae"]
                        }
                        var d = 0;
                        if (null != c.flags.tmSliderPercentages && null != c.flags.tmSliderPercentages["stage" + e]) d = c.flags.tmSliderPercentages["stage" + e][n];
                        else d = 100 * (c.featureLog.filter(function (e) {
                            return "mission" === e.missionType && e.id == l
                        })[0].duration / General.getGameSizeDurationFactor(c.gameSize) / General.getMultiPlatformDurationFactor(c) / (3 * Missions.BASE_DURATION));
                        generateReviewCircle(m, 60, d, !0, o, 100), s.append(r)
                    }
                    z.append(a)
                }
                return z.empty(), P(1, ["Engine", "Gameplay", "Story/Quests"]), P(2, ["Dialogs", "Level Design", "AI"]), P(3, ["World Design", "Graphic", "Sound"]), c.flags.postMortemCompleted ? (null == c.flags.tmPostMortem && (UI.showPostMortemComplete({
                    text: c.id
                }), GameManager.company.notifications.pop()), M.html(c.flags.tmPostMortem.replace(/\[pause:500\]/g, "").replace(/{n}/g, "<br><br>").replace(/\n/g, "<br>"))) : c.canDoPostMortem() ? M.text("Cần tạo báo cáo trước.") : M.text("Đã hết thời gian để tạo báo cáo."), t.append('<div class="gameId" style="display:none">' + c.id + "</div>"), t
            }, function (e, t) {
                var a = $('<div class="btn-tm-action btn-tm-action-light btn-tm-list-select' + (0 == t ? " selected" : "") + ' tm-game-item"><div class="tm-game-item-rating"></div><div class="tm-game-item-title-wrapper"><div class="tm-game-item-title"></div><div class="tm-game-item-subtitle"></div></div><div class="tm-game-item-extra"><div class="tm-game-item-revenue green"></div><div class="tm-game-item-cost red"></div></div></div>'),
                    i = a.find(".tm-game-item-rating"),
                    s = a.find(".tm-game-item-title"),
                    n = a.find(".tm-game-item-subtitle"),
                    l = a.find(".tm-game-item-revenue"),
                    r = a.find(".tm-game-item-cost");
                e.reviewMessageDisplayed ? generateReviewCircle(i, 50, tagMod.getAverageGameScore(e), !0) : generateReviewCircle(i, 50, null, !0), s.text(e.title), n.text(tagMod.getGameTopicGenreString(e));
                var m = e.revenue;
                return (null == m || isNaN(m)) && (m = 0), l.text(UI.getShortNumberString(m)), r.text(UI.getShortNumberString(e.costs)), a
            })
        }

        function k(e, t) {
            return $('<div class="tm-contract-requirement-item"><div class="tm-contract-requirement-item-label">' + e + ':</div><div class="tm-contract-requirement-item-value">' + t + "</div></div>")
        }
    })
});