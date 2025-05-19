(function () {
    var a = [];
    UI.addSalesCard = function (d, l, g, n, r, p, s, u, t, q, v, A) {
        g < n && 0 < g && 0 === s.length && s.push(g);
        1 === s.length ? (d = b(d, l, p, r), l = f(t != Sales.consoleUnitPrice), d.stage.addChild(l), l.y = 51, l.width = 223, d.shapes = [l], a.push(d), g = 1 - (GameManager.company.currentWeek - Math.floor(GameManager.company.currentWeek)), k.push(createjs.Tween.get(l).to({
            y: 0,
            height: 51
        }, 7500 * g)), g = r, u ? (g = A ? r + u / A / t : r + u / t, k.push(createjs.Tween.get(d).wait(500).to({
            unitsSold: g
        }, 7500))) : k.push(createjs.Tween.get(d).wait(500).to({
            unitsSold: r
        },
            7500)), q && (l = f("maintenance"), d.stage.addChild(l), l.y = 51, l.width = 223, d.maintenanceShapes = [l], k.push(createjs.Tween.get(l).to({
                y: 51 - q / t / g * 51,
                height: q / t / g * 51
            }, 7500)))) : 1 < s.length && c(d, l, p, r, s, t, v, A)
    };
    var b = function (a, b, c, f) {
        var k = $("#gameSalesContainer"),
            p = $("#gameSalesCardTemplate").clone();
        p.removeAttr("id");
        p.rankElement = p.find(".gameSalesRankLabel");
        p.unitsElement = p.find(".gameSalesUnitsLabel");
        p.find(".gameNameLabel").text(b);
        d(p, c, f, {
            currentRankText: "",
            currentUnitsText: ""
        });
        k.append(p);
        b = p.find(".gameSalesCardCanvas");
        b = new createjs.Stage(b[0]);
        b.canvas.height = 51;
        b.canvas.width = 223;
        p.on("click", function (b) {
            UI.salesContainerClick(b, a)
        });
        return {
            id: a,
            stage: b,
            card: p,
            currentSalesRank: c,
            unitsSold: f
        }
    },
        c = function (c, d, g, k, r, p, s, u) {
            c = b(c, d, g, k);
            40 <= r.length && (stageObject.stage.removeChild(stageObject.shapes[0]), stageObject.shapes.remove(stageObject.shapes[0]), r.splice(0, 1), s && (stageObject.stage.removeChild(stageObject.maintenanceShapes[0]), stageObject.maintenanceShapes.remove(stageObject.maintenanceShapes[0]), s.splice(0,
                1)));
            d = r.max(function (a) {
                return a
            });
            g = r.length;
            k = [];
            c.maintenanceShapes = [];
            if (s)
                for (u = 0; u < g; u++) {
                    var t = p != Sales.consoleUnitPrice,
                        t = f(t);
                    t.scaleX = 1 / g - 0.01;
                    t.x = 223 / g * u;
                    var q = r[u] / d * 51;
                    t.y = 51 - q;
                    t.scaleY = q / 51;
                    k.push(t);
                    var v = f("maintenance");
                    v.scaleX = 1 / g - 0.01;
                    v.x = 223 / g * u;
                    q = s[u] / p / d * 51;
                    v.y = 51 - q;
                    v.scaleY = q / 51;
                    c.maintenanceShapes.push(v);
                    r[u] > s[u] ? (c.stage.addChild(t), c.stage.addChild(v)) : (c.stage.addChild(v), c.stage.addChild(t))
                } else
                for (u = 0; u < g; u++) t = p != Sales.consoleUnitPrice, t = f(t), c.stage.addChild(t),
                    t.scaleX = 1 / g - 0.01, t.x = 223 / g * u, q = r[u] / d * 51, t.y = 51 - q, t.scaleY = q / 51, k.push(t);
            c.stage.update();
            c.shapes = k;
            a.push(c)
        },
        f = function (a) {
            var b = new createjs.Shape;
            b.alpha = 1;
            b.x = 0;
            var c = b.graphics;
            "maintenance" === a ? c.beginFill(createjs.Graphics.getRGB(255, 0, 0, 1)) : a ? c.beginFill(createjs.Graphics.getRGB(86, 216, 86, 1)) : c.beginFill(createjs.Graphics.getRGB(0, 191, 255, 1));
            c.drawRect(0, 0, 223, 51);
            c.closePath();
            return b
        },
        d = function (a, b, c, d) {
            var f = "",
                k = "";
            0 < b && (f = "Rank: ".localize() + b);
            k = "Units: ".localize() + UI.getShortNumberString(Math.floor(c));
            d.currentRankText != f && (a.rankElement.text(f), d.currentRankText = f);
            d.currentUnitsText != k && (a.unitsElement.text(k), d.currentUnitsText = k)
        };
    UI.updateSalesCard = function (b, c, d, n, r, p, s, u, t) {
        void 0 === d && (d = 0);
        if (s = a.first(function (a) {
            return a.id === b
        })) {
            s.currentSalesRank = p;
            p = s.stage;
            40 <= n.length && (s.stage.removeChild(s.shapes[0]), s.shapes.remove(s.shapes[0]), n.splice(0, 1), u && (s.stage.removeChild(s.maintenanceShapes[0]), s.maintenanceShapes.remove(s.maintenanceShapes[0]), u.splice(0, 1)));
            for (var q = n.max(function (a) {
                return a
            }),
                v = n.length, A = 223 / v, z = r != Sales.consoleUnitPrice, B = s.shapes.length, D = 0; D < B; D++) {
                var E = n[D] / q * 51,
                    w = 1 / v - 0.01;
                k.push(createjs.Tween.get(s.shapes[D]).to({
                    scaleX: w,
                    x: 223 / v * D,
                    y: 51 - E,
                    scaleY: E / 51
                }, 500))
            }
            z = f(z);
            z.y = 51;
            z.x = 223 - A;
            z.scaleX = 1 / v - 0.01;
            s.shapes.push(z);
            E = 51 * (n.last() / q);
            k.push(createjs.Tween.get(z).wait(500).to({
                y: 51 - E,
                scaleY: E / 51
            }, 7500));
            t || (t = 1);
            k.push(createjs.Tween.get(s).wait(500).to({
                unitsSold: c + d / t / r
            }, 7500));
            if (u) {
                for (D = 0; D < s.maintenanceShapes.length; D++) E = u[D] / q * 51, w = 1 / v - 0.01, k.push(createjs.Tween.get(s.maintenanceShapes[D]).to({
                    scaleX: w,
                    x: 223 / v * D,
                    y: 51 - E,
                    scaleY: E / 51
                }, 500));
                c = f("maintenance");
                c.y = 51;
                c.x = 223 - A;
                c.scaleX = 1 / v - 0.01;
                n.last() > u.last() ? (p.addChild(z), p.addChild(c)) : (p.addChild(c), p.addChild(z));
                s.maintenanceShapes.push(c);
                E = 51 * (u.last() / q);
                k.push(createjs.Tween.get(c).wait(500).to({
                    y: 51 - E,
                    scaleY: E / 51
                }, 7500))
            } else p.addChild(z)
        }
    };
    UI.clearSalesCards = function () {
        a.forEach(function (a) {
            UI.removeSalesCard(a.id, !1)
        });
        $("#gameSalesContainer").empty();
        a = []
    };
    UI.removeSalesCard = function (b, c) {
        var d = a.first(function (a) {
            return a.id === b
        });
        d && (d.card.off("click"), d.card.slideUp("slow", function () {
            $(this).remove()
        }), a.remove(d))
    };
    var k = [];
    GameManager.addTickListener(function (b, c) {
        if (k && 0 < k.length && !c) {
            for (var f = 0; f < k.length; f++) k[f].tick(b, !1);
            for (f = 0; f < a.length; f++) a[f].stage.update(), d(a[f].card, a[f].currentSalesRank, a[f].unitsSold, a[f])
        }
    }, !0)
})();