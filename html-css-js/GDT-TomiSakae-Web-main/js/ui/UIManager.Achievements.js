(function () {
    var a = [],
        b = [];
    UI.resetAchievementsUI = function () {
        a.forEach(function (a) {
            a.remove()
        });
        a = [];
        b = [];
        UI._achievementsActiveTimeModifier = 1
    };
    UI._resetCallbacks.push(UI.resetAchievementsUI);
    UI._achievementsActiveTimeModifier = 1;
    UI.showAchievements = function (c) {
        var f = GameManager.gameId,
            m = 200,
            l = $("<div></div>");
        l.css("font-size", 1).animate({
            "font-size": 0
        }, {
            duration: 200,
            easeing: "easein",
            step: function (a, b) {
                GameManager.gameId == f && (UI._achievementsActiveTimeModifier = a)
            }
        });
        setTimeout(function () {
            Sound.pauseAllLoopingFx()
        },
            m);
        for (var g = 0; g < c.length; g++) {
            var n = c[g];
            if (-1 == b.indexOf(n.id)) {
                b.push(n.id);
                var r = $(document.body),
                    p = $("#achievementTemplate").clone().hide();
                p.removeAttr("id");
                var s = document.body.clientWidth,
                    u = document.body.clientHeight;
                p.css({
                    position: "absolute",
                    "z-index": 5E4,
                    top: -u
                });
                n.tint && (p.find(".tint").css("color", n.tint), p.find(".backgroundTint").css("background", n.tint));
                r.append(p);
                var r = p.width(),
                    t = p.height();
                p.find(".title").text(n.title).hide().css("margin-left", -s / 2 - r);
                p.find(".descr").text(n.description).hide().css("margin-left",
                    s + r);
                s /= 2;
                u /= 2;
                s -= r / 2;
                u -= t / 2;
                (function (c, d, g) {
                    c.delay(g).queue(function () {
                        Sound.playSoundOnce("achievement1", 0.3);
                        c.show().transition({
                            left: s,
                            top: u
                        }, 200, "out");
                        c.find(".achievement.unlocked").transition({
                            "margin-top": -25,
                            delay: 200
                        }, 200, "out");
                        c.find(".title").show().transition({
                            "margin-left": 0,
                            delay: 500
                        }, 200, "out");
                        c.find(".descr").show().transition({
                            "margin-left": 0,
                            delay: 700
                        }, 200, "out");
                        c.find(".sliceGlow").transition({
                            "margin-left": -230,
                            opacity: 0,
                            delay: 200
                        }, 800).transition({
                            "margin-left": 120,
                            opacity: 0.5
                        },
                            400, "out").transition({
                                "margin-left": 230,
                                opacity: 0
                            }, 800, "out");
                        setTimeout(function () {
                            c.find(".achievement.innerContainer").addClass("hideState");
                            setTimeout(function () {
                                c.remove();
                                GameManager.gameId == f && (a.remove(c), b.remove(d.id), Achievements.complete(d))
                            }, 400)
                        }, 4E3);
                        $(this).dequeue()
                    })
                })(p, n, m);
                a.push(p);
                m += 4200
            }
        }
        l.delay(m).animate({
            "font-size": 1
        }, {
            duration: 200,
            easeing: "easein",
            step: function (a, b) {
                GameManager.gameId == f && (UI._achievementsActiveTimeModifier = a)
            }
        });
        setTimeout(function () {
            Sound.resumeAllLoopingFx()
        },
            m + 200)
    };
    var c = function (a) {
        if (UI.isPanelOpen()) return UI.closePanels(), !1
    };
    UI._isAchievementsPanelVisible = !1;
    UI.toggleAchievementPanel = function () {
        UI._isHighScorePanelVisible && UI.toggleHighScorePanel();
        var a = $("#achievementsPanel");
        a.hasClass("hidden") ? (f(a.find(".achievementsContainer")), a.show().removeClass("hidden").addClass("show"), $("#gameContainerWrapper").focus(), a.delay(400).queue(function () {
            UI.overrideClick = c;
            GameManager.pause(!0, !0);
            $(this).dequeue()
        }), UI._isAchievementsPanelVisible = !0) : (a.removeClass("show").addClass("hidden"),
            UI.overrideClick = null, UI._isAchievementsPanelVisible = !1, GameManager.resume(!0, !0), a.delay(400).queue(function () {
                $(this).hide();
                $(this).dequeue()
            }))
    };
    var f = function (a) {
        a.empty();
        for (var b = Achievements.getAllItems().filter(function (a) {
            return Achievements.hasAchieved(a) || !a.hidden
        }), c = [], f = [], g = 0; g < b.length; g++) {
            var n = b[g];
            Achievements.hasAchieved(n) ? c.push(n) : f.push(n)
        }
        b = c.concat(f);
        f = $("#achievementTemplate");
        f = f.clone();
        f.find(".achievement.unlocked").remove();
        f.find(".achievement.dismiss").remove();
        for (g = 0; g < b.length; g++) {
            var n = b[g],
                r = g < c.length,
                p = f.clone();
            p.removeAttr("id");
            p.find(".title").text(n.title);
            p.find(".descr").text(n.description);
            n.tint && (p.find(".tint").css("color", n.tint), p.find(".backgroundTint").css("background", n.tint));
            r || p.find(".achievement").addClass("disabled");
            a.append(p)
        }
        UI.createDraggable(a)
    }
})();