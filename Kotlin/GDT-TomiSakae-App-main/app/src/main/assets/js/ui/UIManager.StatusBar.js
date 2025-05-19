(function () {
    UI.resetStatusBar = function () {
        for (var a = 0; a < b.length; a++) createjs.Tween.removeTweens(b[a]._target), b[a]._target.remove();
        b = [];
        UI.updateStatusBar(GameManager.company)
    };
    UI.updateStatusBar = function (b) {
        if (b) {
            c(b);
            var m = b.cash,
                l = UI.getShortNumberString(m),
                g = $("#money"),
                n = g.get(0);
            n && (0 > m ? (g.removeClass("green"), g.addClass("red")) : (g.removeClass("red"), g.addClass("green")), n.innerText = l);
            m = b.getCurrentDate();
            m = "Y{0} M{1} W{2}".localize("date display").format(m.year, m.month, m.week);
            f || (f = $("#date"));
            f && f.text(m);
            d || (d = $("#weekProgression"));
            if (d && (m = GameManager.company.currentWeek % 4 + 1, m -= Math.floor(m), m = 0.25 >= m ? 0 : 0.5 >= m ? 1 : 0.75 >= m ? 2 : 3, d.currentProgress != m)) {
                l = [1, 2, 3, 4];
                for (g = 0; g < l.length; g++) d.find(".p" + l[g]).css("opacity", g <= m ? 1 : 0);
                d.currentProgress = m
            }
            m = UI.getShortNumberString(b.fans);
            if (l = $("#fans").get(0)) l.innerText = "{0} Fans".localize().format(m);
            a || (a = $("#trendContainer"));
            b && b.flags.trends ? a.trend != b.flags.trends.currentTrend && (a.trend = b.flags.trends.currentTrend, a.trend && a.trend.label ?
                a.text(a.trend.label).addClass("statusBar").show() : a.removeClass("statusBar").hide()) : a.hide()
        }
    };
    var a, b = [];
    (function () {
        GameManager.addTickListener(function () {
            if (0 != b.length)
                for (var a = 0; a < b.length; a++) {
                    var c = b[a]._target;
                    void 0 != c.opacity && c.css({
                        opacity: c.opacity
                    })
                }
        })
    })();
    var c = function (a) {
        if (a.cashLog.length) {
            var c = $("#cashLogContainer"),
                d = [];
            a.fansChange && d.push({
                amount: a.fansChange,
                label: "fans".localize()
            });
            d.addRange(a.cashLog);
            for (var f = 0; f < d.length; f++) {
                var n = d[f],
                    r = $('<div class="cashLogItem"><div class="cashLogAmount"></div><div class="cashLogLabel"></div></div>');
                r.find(".cashLogAmount").text(UI.getShortNumberString(Math.floor(n.amount))).addClass(0 > n.amount ? "red" : "green");
                r.find(".cashLogLabel").text(n.label);
                r.opacity = 0.5;
                n = createjs.Tween.get(r).to({
                    opacity: 1
                }, 200).wait(1500).to({
                    opacity: 0
                }, 400).call(function (a) {
                    b.remove(a);
                    this.remove()
                });
                c.prepend(r);
                b.push(n)
            }
            5E3 < Math.abs(a.cashLog.sum(function (a) {
                return a.amount
            })) && Sound.playSoundOnce("cash", 0.2);
            a.cashLog.length = 0;
            a.fansChange && (a.fans += a.fansChange, a.fansChange = 0)
        }
    },
        f, d
})();