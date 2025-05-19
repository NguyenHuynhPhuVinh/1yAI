$(function () {
    function u(t, e) {
        return $('<div class="tm-contract-requirement-item"><div class="tm-contract-requirement-item-label">' + t + ':</div><div class="tm-contract-requirement-item-value">' + e + "</div></div>")
    }

    function y(t) {
        return t.description.substr("Publisher: {0}".localize().format("").length)
    }
    tagMod.patch(UI, "showFindContractWorkMenu", function () {
        var t = $("#findContractWorkWindow").parent();
        t.css("width", "500px").css("left", parseInt(t.css("left")) + 50 + "px");
        var e, a, i, n = ProjectContracts.getAvailable(GameManager.company, GameManager.uiSettings.selectedContractType);
        "generic" == GameManager.uiSettings.selectedContractType ? (i = n, tagMod.setupSingleContainerListDisplay($("#contractSliderContainer"), i, function (t, e) {
            var a = $('<div class="tm-list-content"><div class="tm-contract-title"></div><div class="tm-contract-desc"></div><div class="tm-contract-point-reqs pointDisplayContainer"></div><div class="tm-contract-requirements"></div></div>'),
                i = a.find(".tm-contract-title"),
                n = a.find(".tm-contract-desc"),
                r = a.find(".tm-contract-point-reqs"),
                l = a.find(".tm-contract-requirements");
            return i.text(t.name), n.text(t.description), t.requiredD && r.append('<div class="pointsDisplay designPoints pointsShowLabel">' + t.requiredD + "</div>"), t.requiredT && r.append('<div class="pointsDisplay technologyPoints pointsShowLabel">' + t.requiredT + "</div>"), t.weeksToFinish && l.append(u("Thời gian", "{0} Tuần".format(t.weeksToFinish))), t.payment && l.append(u("Thanh toán", '<div class="green">' + UI.getShortNumberString(t.payment) + "</div>")), t.penalty && l.append(u("Phạt", '<div class="red">' + UI.getShortNumberString(t.penalty) + "</div>")), a.append('<div class="cardId" style="display:none">' + e + "</div>"), a
        })) : (e = n, (a = $("#findContractWorkWindow").parent()).append('<div class="tm-modal-side-panel tm-modal-side-panel-left"><div class="tm-modal-title">{0}</div><div class="tm-contract-game-list tm-modal-side-panel-content"></div></div>'.format("Hợp Đồng Game")), $("#findContractWorkWindow .windowTitle").removeClass("windowTitle").addClass("tm-modal-title has-subtitle").html('<div class="tm-modal-title-main"></div><div class="tm-modal-title-sub"></div>'), tagMod.setupListDisplay(a.find(".tm-contract-game-list"), $("#contractSliderContainer"), e, function (a, t) {
            var e = y(a),
                i = a.gameSize ? General.getGameSizeLabel(a.gameSize) : "Bất kỳ",
                n = a.platform ? a.platform : "Bất kỳ";
            a.disabled = !1, $("#findContractWorkWindow .tm-modal-title-main").text(a.name), $("#findContractWorkWindow .tm-modal-title-sub").text(e);
            var r = $('<div class="tm-list-content"><div class="tm-contract-row"><div class="tm-contract-rating"></div><div class="tm-contract-pitch"></div></div><div class="tm-contract-row"><div class="tm-contract-req-aud"><div class="tm-contract-row-title">{0}</div><div class="tm-contract-requirements"></div><div class="tm-contract-audience"></div></div><div class="tm-contract-platforms-wrapper"><div class="tm-contract-row-title">{1}</div><div class="tm-contract-platforms"></div></div></div></div>'.format("Điều kiện", "Nền tảng")),
                l = r.find(".tm-contract-rating"),
                c = r.find(".tm-contract-pitch"),
                o = r.find(".tm-contract-requirements"),
                s = r.find(".tm-contract-audience"),
                d = r.find(".tm-contract-platforms");
            if (generateReviewCircle(l, 120, a.minScore, !0, ["#408400", "#a5cf00"]), c.html(UI.getHtmlText("Kính gửi {0},\n\nChúng tôi tại {1} có một đề nghị giúp phát triển một game {2} {3} trên nền tảng {4} với {5} tiền bản quyền.\n\nXin cảm ơn.".format(GameManager.company.name, e, i, null != a.genre ? a.genre : "", n, tagMod.toPercent(a.royaltyRate)))), a.topic) {
                var m = Topics.topics.first(function (t) {
                    return t.id === a.topic
                }),
                    p = u("Chủ đề", a.topic);
                o.append(p), -1 == GameManager.company.topics.indexOf(m) && (p.find(".tm-contract-requirement-item-value").append(' <span class="red">(Không có sẵn)</span>'), a.disabled = !0)
            }
            if (a.genre && o.append(u("Thể loại", a.genre)), o.append(u("Kích thước Game", i)), o.append(u("Bản quyền", '<div class="green">' + tagMod.toPercent(a.royaltyRate) + "</div>")), a.payment && o.append(u("Thanh toán trước", '<div class="red">' + UI.getShortNumberString(a.payment) + "</div>")), a.penalty && o.append(u("Phạt", '<div class="red">' + UI.getShortNumberString(a.penalty) + "</div>")), a.gameAudience) {
                var v = MOD_DIR + "Img/Ratings/" + a.gameAudience + ".png";
                s.append('<img class="tm-audience-rating" src="' + v + '" />')
            }
            if (a.platform) {
                if (n = Platforms.allPlatforms.first(function (t) {
                    return t.id === a.platform
                })) {
                    v = Platforms.getPlatformImage(n, GameManager.company.currentWeek);
                    var f = -1 != GameManager.company.licencedPlatforms.indexOf(n),
                        g = n.name;
                    f || (g += " <span class='red'>({0})</span>".format("Không có giấy phép"), a.disabled = !0, a.tryEnable = function (t) {
                        if (a.topic) {
                            var e = Topics.topics.first(function (t) {
                                return t.id === a.topic
                            });
                            if (-1 == GameManager.company.topics.indexOf(e)) return !1
                        }
                        return UI.buyPlatform(n.name, t), !1
                    }), d.append('<div class="tm-platform"><div class="tm-platform-img"><img src="' + v + '" /></div><div class="tm-platform-label">' + g + "</div></div>")
                }
            } else d.append('<div class="tm-platform"><div class="tm-platform-img"><img src="./images/platforms/any.png" /></div><div class="tm-platform-label">{0}</div></div>'.format("Bất kỳ"));
            return r.append('<div class="cardId" style="display:none">' + t + "</div>"), r
        }, function (e, t) {
            var a = $('<div class="btn-tm-action btn-tm-action-light btn-tm-list-select' + (0 == t ? " selected" : "") + ' tm-game-item"><div class="tm-game-item-rating"></div><div class="tm-game-item-title-wrapper"><div class="tm-game-item-title"></div><div class="tm-game-item-subtitle"></div></div><div class="tm-game-item-platform"></div></div>'),
                i = a.find(".tm-game-item-rating"),
                n = a.find(".tm-game-item-title"),
                r = a.find(".tm-game-item-subtitle"),
                l = a.find(".tm-game-item-platform"),
                c = y(e);
            if (generateReviewCircle(i, 50, e.minScore, !0, ["#408400", "#a5cf00"]), n.text(e.name), r.text(c), e.platform) {
                var o = Platforms.allPlatforms.first(function (t) {
                    return t.id === e.platform
                });
                if (o) {
                    var s = Platforms.getPlatformImage(o, GameManager.company.currentWeek);
                    l.html('<img src="' + s + '" />')
                }
            } else l.html('<img src="./images/platforms/any.png" />');
            return a
        }));
        var r = $("#findContractWorkWindow");
        r.find(".okButton").clickExclOnce(function () {
            Sound.click();
            var t = $("#findContractWorkWindow").find(".cardId").text();
            if (null != t) {
                var e = n[parseInt(t)];
                if (e) {
                    if (e.disabled) return e.tryEnable ? void e.tryEnable(function () {
                        r.dialog("close"), GameManager.startContract(e)
                    }) : void r.find(".okButton").parent().effect("shake", {
                        times: 2,
                        distance: 5
                    }, 50);
                    r.dialog("close"), GameManager.startContract(e)
                }
            }
        })
    })
});