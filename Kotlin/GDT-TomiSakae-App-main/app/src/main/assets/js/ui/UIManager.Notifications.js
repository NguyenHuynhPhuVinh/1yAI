(function () {
    UI.showNotifications = function (a) {
        var b = GameManager.company.activeNotifications;
        0 === b.length && a && a();
        b = b[0];
        UI._supressModalAnimations = !1;
        UI._showNotification(b, a)
    };
    UI._showNotification = function (a, b) {
        GameManager.pause(!0);
        GDT.fire(GameManager, GDT.eventKeys.ui.beforeShowingNotification, {
            notification: a
        });
        switch (a.header) {
            case "{Reviews}":
                GameManager.company.gameLog.last().reviewMessageDisplayed = !0;
                UI.showReviewWindow(a, b);
                break;
            case "{BoothPicker}":
                GameManager.showBoothList(a, b);
                break;
            case "{GameDefinition}":
                UI._showGameDefinition(a,
                    b);
                break;
            case "{FeatureList}":
                UI._showFeatureList(a, b);
                break;
            case "{MarketingList}":
                UI.showMarketingList(a, b);
                break;
            case "{ReleaseGame}":
                UI._showReleaseGame(a, b);
                break;
            case "{GameConferenceAnimation}":
                UI._showGameConferenceAnimation(a, b);
                break;
            case "{Research}":
                UI.showResearchMenu(a, b);
                break;
            case "{Training}":
                UI.showTrainingMenu(a, b);
                break;
            case "{CreateEngine}":
                UI.showCreateEngineMenu(a, b);
                break;
            case "{FindContractWork}":
                UI.showFindContractWorkMenu(a, b);
                break;
            case "{DevelopConsole}":
                UI.showDevelopConsoleMenu(a,
                    b);
                break;
            case "{TrialEnd}":
                UI.showTrialEnd(a, b);
                break;
            case "{GameEnd}":
                UI.showGameEnd(a, b);
                break;
            case "{PlatformReleaseNews}":
                UI.showPlatformReleaseNews(a, b);
                break;
            case "{enterCompanyName}":
                UI.showNewGameView(a, b);
                break;
            case "{HireStaff}":
                UI.showHireStaff(a, b);
                break;
            case "{SupportGreenheartGames}":
                UI.showSupportUsOptionsWindow(a, b);
                break;
            case "{PostMortemComplete}":
                UI.showPostMortemComplete(a, b);
                break;
            default:
                c(a, b)
        }
    };
    var a = function (a, b, c) {
        var m = 34;
        c = c ? "" : "bolder";
        var l = UI.IS_SEGOE_UI_INSTALLED ? "Segoe UI" :
            "Open Sans";
        do {
            var g = "{0} {1}pt {2}".format(c, m, l),
                g = new createjs.Text(b, g, "black");
            m--
        } while (390 < 1.1 * g.getMeasuredWidth() && 10 < m);
        a.css({
            font: "{0} {1}pt {2}".format(c, m, l)
        }).text(b)
    },
        b = function (a) {
            var b = "bold {0}pt {1}".format(22, UI.IS_SEGOE_UI_INSTALLED ? "Segoe UI" : "Open Sans");
            a = new createjs.Text(a, b, "black");
            return 1.1 * a.getMeasuredWidth()
        },
        c = function (c, d) {
            var k = $("#notificationContent");
            k.empty();
            var m = $("#notificationContentTemplate").clone();
            c.options ? 2 == c.options.length ? m.find(".smallWindow").removeClass("smallWindow").addClass("notificationTwoOptions") :
                m.find(".smallWindow").removeClass("smallWindow").addClass("notificationThreeOptions") : m.find(".notificationOption2").hide();
            var l = m.find(".windowTitle");
            a(l, c.header);
            (l = c.text) && (l = l.replace(/\n/g, "<br />"));
            c.image ? (m.find(".notificationImage").attr("src", c.image), m.find(".notificationImageContainer").show()) : m.find(".notificationImageContainer").hide();
            var g = m.find(".notificationButton").css({
                opacity: 0
            }).text(c.buttonText),
                n = [g[0]];
            if (c.options) {
                var r = 290,
                    p = b(c.options[0]),
                    p = Math.min(r / p * 22, 22);
                $(g[0]).css("font-size", p + "pt");
                $(g[0]).text(c.options[0]);
                p = b(c.options[1]);
                p = Math.min(r / p * 22, 22);
                $(g[1]).css("font-size", p + "pt");
                $(g[1]).text(c.options[1]);
                n.push(g[1]);
                2 < c.options.length && (p = b(c.options[2]), p = Math.min(r / p * 22, 22), $(g[2]).css("font-size", p + "pt"), $(g[2]).text(c.options[2]), n.push(g[2]));
                var s = $("#sidebar").width();
                $("#sidebar span").each(function () {
                    var a = $(this).width(),
                        a = s / a * 12;
                    $(this).css({
                        "font-size": a,
                        "line-height": a / 1.2 + "px"
                    })
                })
            } else r = 290, p = b(g[0].innerText), p = Math.min(r / p *
                22, 22), $(g[0]).css("font-size", p + "pt");
            var u = function (a) {
                Sound.click();
                GameManager.removeFromActiveNotifications(c);
                var b;
                c.sourceId && (b = $(a.srcElement).hasClass("notificationOption1") ? 0 : $(a.srcElement).hasClass("notificationOption2") ? 1 : 2);
                General.notificationShown(c, b);
                GameManager.company && (0 < GameManager.company.activeNotifications.length ? UI.closeModal(function () {
                    UI._showNotification(GameManager.company.activeNotifications[0], d)
                }) : d ? UI.closeModal(function () {
                    d && d()
                }) : UI.closeModal())
            };
            m.find(".notificationText").text(l).typewrite({
                delay: 20,
                extra_char: "",
                replace_br: !0,
                speedUpOnClick: !0,
                soundLoop: "notificationTyping",
                volume: 0.12,
                callback: function () {
                    $(n).transition({
                        opacity: 1
                    }, "fast").clickExclOnce(function (a) {
                        u(a)
                    })
                }
            });
            UI.IS_SEGOE_UI_INSTALLED || m.find(".notificationText").addClass("fallback");
            "{noButton}" === c.buttonText && g.hide();
            k.append(m);
            k = {};
            c.sound && $.extend(k, {
                sound: c.sound,
                volume: c.volume
            });
            UI.showModalContent("#notificationContent", k)
        };
    UI.showPlatformReleaseNews = function (a, b) {
        var c = $("#platformReleaseNewsContent");
        c.empty();
        var m = $("#platformReleaseNewsTemplate").clone();
        m.find(".windowTitle").text("News".localize("heading"));
        for (var l, g = 0; g < Platforms.allPlatforms.length; g++)
            if (Platforms.allPlatforms[g].id === a.text) {
                l = Platforms.allPlatforms[g];
                break
            } g = "Today the new game platform {0} by {1} has been released.".localize().format(l.name, l.company);
        m.find(".platformRelaseNewsImage").attr("src", Platforms.getPlatformImage(l, GameManager.company.currentWeek));
        var n = m.find(".platformReleaseOkButton").css({
            opacity: 0
        }).text(a.buttonText),
            r = function () {
                Sound.click();
                GameManager.removeFromActiveNotifications(a);
                0 < GameManager.company.activeNotifications.length ? UI.closeModal(function () {
                    UI._showNotification(GameManager.company.activeNotifications[0], b)
                }) : UI.closeModal(function () {
                    b && b()
                })
            };
        m.find(".notificationText").text(g).typewrite({
            delay: 20,
            extra_char: "",
            replace_br: !0,
            speedUpOnClick: !0,
            soundLoop: "notificationTyping",
            volume: 0.12,
            callback: function () {
                n.transition({
                    opacity: 1
                }, "fast").clickExclOnce(r)
            }
        });
        UI.IS_SEGOE_UI_INSTALLED || m.find(".notificationText").addClass("fallback");
        c.append(m);
        UI.showModalContent("#platformReleaseNewsContent", {
            disableCheckForNotifications: !0,
            close: !1
        })
    }
})();