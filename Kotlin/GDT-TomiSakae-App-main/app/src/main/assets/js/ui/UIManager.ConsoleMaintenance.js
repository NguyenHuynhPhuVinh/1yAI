(function () {
    var a = [];
    UI.addMaintenanceCard = function (d) {
        if (1 <= d.maintenanceLog.length)
            if (1 === d.maintenanceLog.length) {
                var g = c(d),
                    k = f(!0);
                g.stage.addChild(k);
                k.x = 60;
                k.y = 105;
                k.width = 115;
                k.scaleY = 0;
                var u = d.maintenanceLog[0] / 99 * 70;
                n.push(createjs.Tween.get(k).to({
                    y: 105 - u,
                    scaleY: u / 70
                }, 300));
                g.shapes = [k];
                k = f(!1);
                g.stage.addChild(k);
                k.x = 60;
                k.y = 105;
                k.scaleY = 0;
                k.width = 115;
                g.repairShapes = [k];
                k = b();
                u = b();
                g.lines = [k, u];
                m(g);
                g.stage.addChild(k);
                g.stage.addChild(u);
                k = new ProgressBarVisual;
                k.alpha = 1;
                k.progress = 0.5;
                k.width = 20;
                k.height = 65;
                k.x = 10;
                k.y = 33;
                k.isHorizontal = !1;
                g.stage.addChild(k);
                g.progressBar = k;
                a.push(g);
                d.repairPointsLog || (d.repairPointsLog = [0])
            } else l(d)
    };
    var b = function () {
        var a = new createjs.Shape;
        a.alpha = 1;
        a.x = 60;
        var b = a.graphics;
        b.beginFill(createjs.Graphics.getRGB(45, 45, 45, 1));
        b.drawRect(0, 0, 115, 0.5);
        b.closePath();
        return a
    },
        c = function (a) {
            var b = $("#consoleMaintenanceContainer"),
                c = $("#consoleMainCardTemplate").clone();
            c.clickExcl(function () {
                VisualsManager.scrollToZone(0, !0)
            });
            c.removeAttr("id");
            c.title = c.find(".title");
            c.points = c.find(".points");
            d(c, a.name);
            k(c, a.maintenancePoints);
            b.append(c);
            b = c.find(".consoleMainCardGroupCanvas");
            b = new createjs.Stage(b[0]);
            b.canvas.height = 105;
            b.canvas.width = 180;
            return {
                id: a.id,
                stage: b,
                card: c,
                console: a
            }
        },
        f = function (a) {
            var b = new createjs.Shape;
            b.alpha = 1;
            b.x = 60;
            var c = b.graphics;
            a ? c.beginFill(createjs.Graphics.getRGB(255, 0, 0, 1)) : c.beginFill(createjs.Graphics.getRGB(86, 216, 86, 1));
            c.drawRect(0, 0, 115, 70);
            c.closePath();
            return b
        },
        d = function (a, b, c) {
            c = UI.getMeasuredWidth(b,
                14);
            c = Math.min(180 / c * 14, 14);
            a.title.css("font-size", c + "pt");
            a.title.text(b)
        },
        k = function (a, b) {
            a.points.text("Backlog: {0}".localize().format(b))
        },
        m = function (a) {
            a.stage.removeChild(a.lines[0]);
            a.stage.removeChild(a.lines[1]);
            var b = Math.max(99, a.console.maintenanceLog.max(function (a) {
                return a
            }));
            a.lines[0].y = 105 - 66 / b * 70;
            a.lines[1].y = 105 - 99 / b * 70;
            a.stage.addChild(a.lines[0]);
            a.stage.addChild(a.lines[1])
        },
        l = function (d) {
            var g = c(d),
                k = new ProgressBarVisual;
            k.alpha = 1;
            k.progress = d.satisFaction.clamp(0, 1);
            k.color =
                createjs.Graphics.getHSL(80 * d.satisFaction.clamp(0, 1), 100, 50);
            k.width = 20;
            k.height = 65;
            k.x = 10;
            k.y = 33;
            k.isHorizontal = !1;
            g.stage.addChild(k);
            g.progressBar = k;
            var l = Math.max(99, d.maintenanceLog.max(function (a) {
                return a
            })),
                n = d.maintenanceLog.length,
                k = [];
            g.maintenanceShapes = [];
            g.repairShapes = [];
            for (var q = 0; q < n; q++) {
                var v = f(!0);
                v.scaleX = 1 / n;
                v.x = 60 + 115 / n * q;
                var A = d.maintenanceLog[q] / l * 70;
                v.y = 105 - A;
                v.scaleY = A / 70;
                k.push(v);
                var z = f(!1);
                z.scaleX = 1 / n;
                z.x = 60 + 115 / n * q;
                A = d.repairPointsLog[q] / l * 70;
                z.y = 105 - A;
                z.scaleY =
                    A / 70;
                g.repairShapes.push(z);
                g.stage.addChild(v);
                g.stage.addChild(z)
            }
            d = b();
            l = b();
            g.lines = [d, l];
            m(g);
            g.stage.update();
            g.shapes = k;
            a.push(g)
        };
    UI.updateMaintenanceCard = function (b) {
        var c = a.first(function (a) {
            return a.id === b.id
        });
        c || (UI.addMaintenanceCard(b), c = a.first(function (a) {
            return a.id === b.id
        }));
        k(c.card, b.maintenancePoints);
        if (c && c.shapes.length < b.maintenanceLog.length) {
            var d = c.stage,
                g, l = Math.max(99, b.maintenanceLog.max(function (a) {
                    return a
                })),
                q = b.maintenanceLog.length,
                v = 115 / q;
            30 <= b.maintenanceLog.length &&
                (c.stage.removeChild(c.shapes[0]), c.shapes.remove(c.shapes[0]), b.maintenanceLog.splice(0, 1), c.stage.removeChild(c.repairShapes[0]), c.repairShapes.remove(c.repairShapes[0]), b.repairPointsLog.splice(0, 1), q--);
            b.repairPointsLog.length < b.maintenanceLog.length && (b.repairPointsLog.push(0), b.repairPoints = 0, g = f(!1), g.y = 105, g.x = 175 - v, g.scaleX = 1 / q, g.scaleY = 0, c.repairShapes.push(g));
            for (var A = c.shapes.length, z = 0; z < A; z++) {
                var B = b.maintenanceLog[z] / l * 70,
                    D = 1 / q;
                n.push(createjs.Tween.get(c.shapes[z]).to({
                    scaleX: D,
                    x: 60 + 115 / q * z,
                    y: 105 - B,
                    scaleY: B / 70
                }, 500))
            }
            A = f(!0);
            A.y = 105;
            A.x = 175 - v;
            A.scaleX = 1 / q;
            A.scaleY = 0;
            c.shapes.push(A);
            B = 70 * (b.maintenanceLog.last() / l);
            n.push(createjs.Tween.get(A).wait(500).to({
                y: 105 - B,
                scaleY: B / 70
            }, 300));
            for (z = 0; z < c.repairShapes.length; z++) B = b.repairPointsLog[z] / l * 70, D = 1 / q, n.push(createjs.Tween.get(c.repairShapes[z]).to({
                scaleX: D,
                x: 60 + 115 / q * z,
                y: 105 - B,
                scaleY: B / 70
            }, 500));
            d.addChild(A);
            g && d.addChild(g);
            m(c)
        }
    };
    UI.updateRepairPoints = function (b) {
        var c = a.first(function (a) {
            return a.id === b.id
        });
        if (c) {
            var d =
                Math.max(99, b.maintenanceLog.max(function (a) {
                    return a
                }));
            b.repairPointsLog[b.repairPointsLog.length - 1] = b.repairPoints;
            var d = 70 * (b.repairPointsLog.last() / d),
                f = c.repairShapes.last();
            f.y = 105 - d;
            f.scaleY = d / 70;
            k(c.card, b.maintenancePoints)
        }
    };
    UI.clearMaintenanceCards = function () {
        a.forEach(function (a) {
            UI.removeMaintenanceCard(a.id, !1)
        });
        $("#consoleMaintenanceContainer").empty();
        a = []
    };
    UI.removeMaintenanceCard = function (b, c) {
        var d = a.first(function (a) {
            return a.id === b.id
        });
        d && (d.card.remove(), a.remove(d))
    };
    var g =
        function (b, c) {
            var d = a.first(function (a) {
                return a.id === b.id
            });
            b.satisFaction || (b.satisFaction = 1);
            33 > b.maintenancePoints ? b.satisFaction += 0.04 * c / 500 : 66 > b.maintenancePoints ? b.satisFaction += 0.02 * c / 500 : 99 < b.maintenancePoints ? b.satisFaction -= 0.02 * c / 350 : 122 < b.maintenancePoints && (b.satisFaction -= 0.04 * c / 350);
            b.satisFaction = b.satisFaction.clamp(-0.3, 1.3);
            d.progressBar.progress = b.satisFaction.clamp(0, 1);
            d.progressBar.color = createjs.Graphics.getHSL(80 * b.satisFaction.clamp(0, 1), 100, 50)
        },
        n = [];
    GameManager.addTickListener(function (b,
        c) {
        if (!c && n && 0 < n.length && !c) {
            for (var d = 0; d < n.length; d++) n[d].tick(b, !1);
            for (d = 0; d < a.length; d++) g(a[d].console, b), a[d].stage.update()
        }
    }, !0)
})();