(function () {
    UI._gameDetailsColumn1FontSize = void 0;
    UI._getElementForGameDetail = function (a, b) {
        var c = GameManager.company.getDate(a.releaseWeek),
            f = $("#gameDetailsTemplate").clone();
        f.removeAttr("id");
        f.find(".gameDetailsTitle").text(a.title);
        if (a.flags.pirated) {
            f.find(".gameDetailsPiracyImage").show();
            var d = "?";
            a.flags.postMortemCompleted && (d = Math.floor(a.flags.piracyRate) + "%");
            f.find(".gameDetailsPiracyRate").text(d).show()
        }
        if (void 0 == UI._gameDetailsColumn1FontSize) {
            for (var k = f.find(".gameDetailsColumn1"),
                d = [], m = 0; m < k.length; m++) k[m].innerText && d.push(k[m].innerText);
            k = UI.IS_SEGOE_UI_INSTALLED ? "Segoe UI" : "Open Sans";
            UI._gameDetailsColumn1FontSize = 15;
            for (var l = "bolder {0}pt {1}".format(UI._gameDetailsColumn1FontSize, k), m = 0; m < d.length && 10 != UI._gameDetailsColumn1FontSize; m++) 180 < 1.1 * (new createjs.Text(d[m], l, "black")).getMeasuredWidth() && (UI._gameDetailsColumn1FontSize -= 1, l = "{0}pt {1}".format(UI._gameDetailsColumn1FontSize, k), m--)
        }
        f.find(".gameDetailsColumn1").css({
            "font-size": UI._gameDetailsColumn1FontSize +
                "pt"
        });
        UI.IS_SEGOE_UI_INSTALLED || (f.find(".gameDetailsColumn1").css({
            "font-family": "Open Sans"
        }), f.find(".gameDetailsColumn2").css({
            "font-size": "12pt",
            "font-family": "Open Sans"
        }));
        f.find(".gameId").text(a.id);
        a.secondGenre ? f.find(".gameDetailsTopicGenre").text(a.topic.name + "/" + a.genre.name + "-" + a.secondGenre.name) : f.find(".gameDetailsTopicGenre").text(a.topic.name + "/" + a.genre.name);
        d = a.platforms.map(function (a) {
            return a.name
        }).join(", ");
        f.find(".gameDetailsPlatform").text(d); - 1 != GameManager.company.researchCompleted.indexOf(Research.TargetAudience) &&
            f.find(".gameDetailsAudience").text(General.getAudienceLabel(a.targetAudience));
        f.find(".gameDetailsImage").attr("src", Platforms.getPlatformImage(a.platforms[0], a.releaseWeek));
        f.find(".gameDetailsCosts").text(UI.getShortNumberString(a.costs));
        a.releaseWeek > GameManager.company.currentWeek ? f.find(".gameDetailsReleaseWeek").text("coming soon".localize()) : f.find(".gameDetailsReleaseWeek").text("Y{0} M{1} W{2}".localize("date display").format(c.year, c.month, c.week));
        0 < a.revenue ? (f.find(".gameDetailsAmountEarned").text(UI.getShortNumberString(a.revenue)),
            c = f.find(".gameDetailsTotal"), d = a.revenue - a.costs, 0 > d ? (f.find(".gameDetailsTotalLabel").text("Loss:".localize()), c.addClass("red")) : c.addClass("green"), c.text(UI.getShortNumberString(d)), f.find(".gameDetailsFansChange").text(UI.getLongNumberString(Math.max(0, Math.round(a.fansChanged)))), 0 < a.topSalesRank ? f.find(".gameDetailsTopSalesRank").text(a.topSalesRank) : f.find(".gameDetailsTopSalesRank").text("100+"), f.find(".gameDetailsUnitsSold").text(UI.getShortNumberString(a.unitsSold))) : (c = a.flags.isExtensionPack ?
                "-" : "?", f.find(".gameDetailsUnitsSold").text(c), f.find(".gameDetailsAmountEarned").text(c), f.find(".gameDetailsTotal").text(c), f.find(".gameDetailsFansChange").text(c), f.find(".gameDetailsTopSalesRank").text(c), f.find(".gameDetailsAmountEarned").removeClass("green"));
        a.reviewMessageDisplayed ? (f.find(".gameAverageScoreOverview").text(b), f.find(".gameDetailsAvgReview").text(b)) : (f.find(".gameAverageScoreOverview").text("?"), f.find(".gameDetailsAvgReview").text("?"));
        return f
    };
    UI.showGameHistory = function (a,
        b, c) {
        b = b ? !0 === GameManager.flags.createPack ? GameManager.company.getPossibleGamesForPack() : GameManager.company.getPossibleGamesForSequel() : GameManager.company.gameLog;
        c && (b = GameManager.company.gameLog.filter(function (a) {
            return a.canDoPostMortem()
        }));
        if (0 < b.length) {
            GameManager.pause(!0);
            var f = $("#gameHistoryDialog"),
                d = f.find("#gameHistoryContent");
            d.empty();
            var k = $('<div class="gameHistorySliderContainer royalSlider rsDefaultInv"></div>');
            d.append(k);
            b.slice().sort(function (a, b) {
                return a.releaseWeek >
                    b.releaseWeek ? 1 : -1
            });
            for (d = b.length - 1; 0 <= d; d--) {
                var m = b[d];
                if (!m.flags.isExtensionPack || c) {
                    var l = m.reviews.average(function (a) {
                        return a.score
                    }),
                        m = UI._getElementForGameDetail(m, l);
                    k.append(m)
                }
            }
            var g = GameManager.flags.selectGameActive;
            g && (GameManager.flags.selectedGameId = null);
            c = g ? "Select Game".localize("heading") : "Game History".localize();
            f.find(".windowTitle").text(c);
            c = g ? "Select".localize("button") : "OK".localize();
            f.find(".okButton").text(c).clickExcl(function () {
                Sound.click();
                g && (GameManager.flags.selectedGameId =
                    f.find(".rsActiveSlide").find(".gameId").text());
                $("#gameHistoryDialog").dialog("close");
                GameManager.resume(!0)
            });
            PlatformShim.ISWIN8 && k.gdSlider();
            f.dialog({
                draggable: !1,
                width: 660,
                height: 650,
                modal: !0,
                resizable: !1,
                show: "fade",
                zIndex: 6E3,
                open: function () {
                    UI.maxFont("bolder", f.find(".windowTitle"), 34);
                    var a = $(this).parents(".ui-dialog:first").find(".closeDialogButton");
                    0 == a.length && (a = $(UI.closeButtonTemplate), $(this).parents(".ui-dialog:first").append(a));
                    a.zIndex = 4500;
                    a.clickExclOnce(function () {
                        Sound.click();
                        f.dialog("close")
                    });
                    $(this).siblings(".ui-dialog-titlebar").remove();
                    $(this).parents(".ui-dialog:first").addClass("tallWindow");
                    $(this).parents(".ui-dialog:first").addClass("windowBorder");
                    $(this).parents(".ui-dialog:first").removeClass("ui-widget-content");
                    PlatformShim.ISWIN8 || k.gdSlider()
                },
                close: function () {
                    $(this).dialog("destroy");
                    this.style.cssText = "display:none;";
                    a && a();
                    GameManager.resume(!0)
                }
            })
        } else a && a()
    }
})();