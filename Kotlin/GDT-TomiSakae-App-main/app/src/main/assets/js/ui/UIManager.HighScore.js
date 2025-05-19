(function () {
    UI.closePanels = function () {
        UI._isHighScorePanelVisible && UI.toggleHighScorePanel();
        UI._isAchievementsPanelVisible && UI.toggleAchievementPanel()
    };
    UI.isPanelOpen = function () {
        return UI._isHighScorePanelVisible || UI._isAchievementsPanelVisible
    };
    UI._isHighScorePanelVisible = !1;
    var a = function (a) {
        if (UI.isPanelOpen()) return UI.closePanels(), !1
    },
        b = function (a) {
            a = a.find(".highScoreContainer");
            a.empty();
            var b = DataStore.getHighScoreList(),
                b = b.slice().sort(function (a, b) {
                    return b.score - a.score
                });
            if (0 == b.length) a.append($("<p>" +
                "No scores yet. Once you finish a game your high score will be listed here.".localize() + "</p>"));
            else {
                for (var d = $('<div class="highScoreItem"><div class="highScoreItemNname"></div><div class="score"></div></div>'), k = 0; k < b.length; k++) {
                    var m = b[k],
                        l = d.clone();
                    l.find(".highScoreItemNname").text(m.name);
                    l.find(".score").text(UI.getLongNumberString(m.score));
                    a.append(l)
                }
                UI.createDraggable(a)
            }
        };
    UI.toggleHighScorePanel = function () {
        UI._isAchievementsPanelVisible && UI.toggleAchievementPanel();
        var c = $("#highScorePanel");
        c.hasClass("hidden") ? (b(c), c.show().removeClass("hidden").addClass("show"), $("#gameContainerWrapper").focus(), c.delay(400).queue(function () {
            UI.overrideClick = a;
            GameManager.pause(!0, !0);
            $(this).dequeue()
        }), UI._isHighScorePanelVisible = !0) : (c.removeClass("show").addClass("hidden"), UI.overrideClick = null, UI._isHighScorePanelVisible = !1, GameManager.resume(!0, !0), c.delay(400).queue(function () {
            $(this).hide();
            $(this).dequeue()
        }))
    }
})();