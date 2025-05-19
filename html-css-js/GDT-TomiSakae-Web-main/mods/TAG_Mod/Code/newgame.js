$(function () {
    var t, e, a, n, i, o, l, r, m, c, s, d, p, g, f, u, v, h;
    $("#resources .dialogNextButton").addClass("btn-tm-action"), t = $("#gameDefinitionContentTemplate .pickTopicButton"), e = $("#pickGenreButton"), a = $("#pickSecondGenreButton"), n = $("#gameDefinitionContentTemplate .gameGenreMMO"), i = $('<div id="tm-topic-genre" class="tm-header-panel tm-topic-genre"><div class="tm-header-panel-title">{0}:</div><div class="tm-header-panel-body"></div></div>'.format("Chủ đề và Thể loại".localize())), o = i.find(".tm-header-panel-body"), t.addClass("btn-tm-action btn-tm-action-light"), e.addClass("btn-tm-action btn-tm-action-light"), a.addClass("btn-tm-action btn-tm-action-light"), n.addClass("btn-tm-action btn-tm-action-light"), $("#targetRating").after(i), t.appendTo(o), e.appendTo(o), a.appendTo(o), n.appendTo(o), l = $("#gameDefinitionContentTemplate .pickPlatformButton"), r = $('<div class="tm-header-panel"><div class="tm-header-panel-title">{0}:</div><div class="tm-header-panel-body"></div></div>'.format("Nền tảng".localize())), m = r.find(".tm-header-panel-body"), l.addClass("btn-tm-action btn-tm-action-light"), $("#tm-topic-genre").after(r), l.appendTo(m), c = $("#targetRating .rating"), s = $('<div class="tm-header-panel"><div class="tm-header-panel-title">{0}:</div><div class="tm-header-panel-body"></div></div>'.format("Xếp hạng".localize())), d = s.find(".tm-header-panel-body"), c.filter(".ratingY").addClass("tm-icon tm-icon-fullbleed tm-icon-young").text("Trẻ em".localize()), c.filter(".ratingE").addClass("tm-icon tm-icon-fullbleed tm-icon-everyone").text("Mọi người".localize()), c.filter(".ratingM").addClass("tm-icon tm-icon-fullbleed tm-icon-mature").text("Trưởng thành".localize()), c.addClass("btn-tm-action btn-tm-action-light"), $("#targetRating").html(s), c.appendTo(d), p = $(".pickEngineButtonWrapper .pickEngineButton"), g = $('<div class="tm-header-panel"><div class="tm-header-panel-title">{0}:</div><div class="tm-header-panel-body"></div></div>'.format("Chọn Engine".localize())), f = g.find(".tm-header-panel-body"), p.addClass("btn-tm-action btn-tm-action-light"), $(".pickEngineButtonWrapper").html(g), p.appendTo(f), u = $("#gameSizeGroup .gameSizeButton"), v = $('<div class="tm-header-panel"><div class="tm-header-panel-title">{0}:</div><div class="tm-header-panel-body"></div></div>'.format("Kích thước Game".localize())), h = v.find(".tm-header-panel-body"), u.filter(".gameSizeSmall").addClass("tm-icon tm-icon-small"), u.filter(".gameSizeMedium").addClass("tm-icon tm-icon-medium"), u.filter(".gameSizeLarge").addClass("tm-icon tm-icon-large"), u.filter(".gameSizeAAA").addClass("tm-icon tm-icon-star"), u.addClass("btn-tm-action btn-tm-action-light"), $("#gameSizeGroup").html(v), u.appendTo(h);
    var b = UI.pickTopicClick;

    function C() {
        var o = null;
        0 < GameManager.company.gameLog.length && (o = GameManager.company.gameLog[GameManager.company.gameLog.length - 1].genre);

        // Thêm thông tin thể loại đã dùng gần đây vào header panel
        if (o) {
            // Xóa thông tin cũ nếu đã tồn tại
            $(".tm-genre-last-used-header").remove();

            // Thêm thông tin vào các tiêu đề
            $(".overlayTitle, .windowTitle, .smallerWindowTitle").append(' <span class="tm-genre-last-used-header">({0}: {1})</span>'.format("Thể loại đã dùng gần đây".localize(), o.name));
        }

        $(".pickTopicListButton").addClass("tm-btn-genre"), $(".pickTopicListButton").each(function () {
            var t = $(this),
                e = t.find(".topicIcon"),
                a = e.attr("src"),
                n = (a = a.substr(a.lastIndexOf("/") + 1)).substr("icon_genre_".length, a.length - "icon_genre_".length - ".png".length);
            e.attr("src", MOD_DIR + "Img/Genres/genre_icon_" + n.toLowerCase() + ".png"), null != o && n.toLowerCase() == o.id.toLowerCase() && t.addClass("tm-btn-genre-last-used");
            var i = GameManager.company.gameLog.filter(function (t) {
                return t.genre.id.toLowerCase() == n.toLowerCase()
            }).sum(function (t) {
                return 1
            });
            t.append('<div class="tm-topic-uses">' + i + "</div>")
        })
    }
    UI.pickTopicClick = function () {
        b.apply(UI, arguments), $(".pickTopicListButton").addClass("tm-btn-topic"), $(".pickTopicListButton .topicIcon").each(function () {
            var t = $(this),
                e = t.attr("src").substr("./images/topic icons/icon_topic_".length);
            t.attr("src", MOD_DIR + "Img/topics/" + e);
            var a = t.closest(".pickTopicListButton"),
                n = a.find(".topicButtonText").text().trim();
            if ("?" != n) {
                var i = GameManager.company.gameLog.filter(function (t) {
                    return t.topic.name == n
                }).sum(function (t) {
                    return 1
                });
                a.append('<div class="tm-topic-uses">' + i + "</div>")
            } else a.addClass("tm-topic-locked");
            t.on("error", function () {
                t.attr("src", MOD_DIR + "Img/topics/generic.png")
            })
        }), setTimeout(function () { }, 100)
    }, tagMod.patch(UI, "_selectTopic", function (t) {
        var e = $(".simplemodal-data").find(".pickTopicButton");
        e.get(0).innerText = e.get(0).innerText.trim()
    }), tagMod.patch(UI, "pickGenreClick", C), tagMod.patch(UI, "pickSecondGenreClick", C);
    var k = UI.pickPlatformClick;
    UI.pickPlatformClick = function () {
        k.apply(UI, arguments);
        var r = Platforms.getPlatformsOnMarket(GameManager.company);
        $(".platformButton").find(".cost, .licenseCost, .marketShare, .audienceHints, .genreHints").remove(), $(".platformButton").each(function () {
            var l = $(this),
                t = r.find(function (t) {
                    return t.name == l.find(".platformTitle").text().trim()
                });
            if (null != t) {
                var e = l.find(".platformButtonImage").attr("src");
                l.find(".platformTitle, .platformButtonImage").remove(), l.append('<div class="tm-platform-item"><div class="tm-platform-item-left"><img class="tm-platform-img" src="' + e + '" /></div><div class="tm-platform-item-right"><div class="tm-platform-title tm-icon tm-icon-console platformTitle">' + t.name + '</div><div class="tm-platform-stats"><div class="tm-platform-stats-top"></div><div class="tm-platform-stats-bottom"></div></div></div></div>'), o(".tm-platform-stats-top", "dev-cost", "{0}:".format("Chi phí phát triển".localize()), UI.getShortNumberString(t.developmentCosts), "red", "hammer");
                for (var a = Platforms.getTotalMarketSizePercent(t, GameManager.company), n = 1, i = 0; i < r.length; i++) Platforms.getTotalMarketSizePercent(r[i], GameManager.company) > a && n++;
                switch (n) {
                    case 1:
                        n = "1st";
                        break;
                    case 2:
                        n = "2nd";
                        break;
                    case 3:
                        n = "3rd";
                        break;
                    default:
                        n += "th"
                }
                o(".tm-platform-stats-top", "market-share", "{0}:".format("Thị phần".localize()), UI.getPercentNumberString(a) + " " + n, null, "pie-chart"), -1 != GameManager.company.licencedPlatforms.indexOf(t) || o(".tm-platform-item-left", "license-cost", "{0}:".format("Chi phí giấy phép".localize()), UI.getShortNumberString(t.licencePrize), "red", "double-dollars"), o(".tm-platform-stats-bottom", "genre-match", "{0}:".format("Phù hợp thể loại".localize()), Knowledge.getPlatformGenreHintHtml(GameManager.company, t), null, "game-controller"), l.find(".tm-platform-item").append(Knowledge.getPlatformAudienceHintHtml(GameManager.company, t))
            }

            function o(t, e, a, n, i, o) {
                null == i && (i = ""), o = null == o ? "" : "tm-icon tm-icon-" + o, l.find(t).append('<div class="tm-platform-stats-item tm-platform-stats-' + e + " " + o + '"><div class="tm-platform-stats-label">' + a + '</div><div class="tm-platform-stats-value ' + i + '">' + n + "</div></div>")
            }
        }), $(".removePlatformButton").addClass("btn-tm-action btn-tm-action-danger")
    }, tagMod.patch(UI, "_updateGameDefinitionNextButtonEnabled", function () {
        var t = $(".gameDefinitionContent .comboHint"),
            e = t.text().toLowerCase();
        t.removeClass("red green"), -1 != e.indexOf("great".localize()) || -1 != e.indexOf("good".localize()) ? t.addClass("green") : -1 == e.indexOf("bad".localize()) && -1 == e.indexOf("terrible".localize()) || t.addClass("red")
    }), tagMod.patch(UI, "showGameDefinition", function () {
        $("#gameDefinition #gameTitle").after("<hr>"), $("#gameDefinition .dialogNextButton")[0].addEventListener("click", function () {
            setTimeout(function () {
                tagMod.convertSelectList($("#gameDefinition .dialogScreen2 .featureSelectionContainer"))
            }, 0)
        }, !0)
    }), tagMod.patch(UI, "_updateGameDefinitionCost", function () {
        var t = $("#gameDefinition .windowCostLabel"),
            e = t.text().trim().substr("Cost: {0}".localize().format("").length);
        t.html("Chi phí: {0}".localize().format('<span class="tm-cr">' + e + "</span>"))
    }), tagMod.patch(UI, "_updatePickPlatformButtonStates", function () {
        $("#gameDefinitionContentTemplate .pickPlatformButton").each(function () {
            var t = $(this),
                e = t.text().trim(),
                a = GameManager.company.licencedPlatforms.slice().reverse().find(function (t) {
                    return t.name == e
                });
            null != a && t.prepend('<img src="' + Platforms.getPlatformImage(a, GameManager.company.currentWeek) + '" />')
        })
    })
});