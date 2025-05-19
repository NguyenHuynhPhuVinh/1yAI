$(function () {
    function r() {
        return GDT.getDataStore("TAGMod").settings["dark-mode"] ? ["#363940", "#474b53"] : ["#f2f2f2", "#e5eef3"]
    }

    function o() {
        return GDT.getDataStore("TAGMod").settings["dark-mode"] ? "#c1cedf" : "#4c5660"
    }
    DESIGN_POINTS_COLOR = "#c22e5e", TECHNOLOGY_POINTS_COLOR = "#1c9aa6", RESEARCH_POINTS_COLOR = "#0080bf", BUGS_COLOR = "#f25721";
    var C = ["#f7941d", "#ed1c24"],
        y = ["#f64646", "#951a74"],
        M = ["#1abc9c", "#1e79b0"],
        T = ["#00b1ff", "#004977"];
    GameStatusBar.prototype.redraw = function () {
        this.width = 300, this.textContainerHeight = 86;
        var e = this.mainShape.graphics;
        e.beginLinearGradientFill(r(), [0, 1], 0, 0, 0, this.textContainerHeight), e.drawRoundRect(0, 0, this.width, this.textContainerHeight, 9), this.mainShape.shadow = this.mainShape.shadow || new createjs.Shadow("rgba(0, 0, 0, 0.30)", 0, 3, 7), e.closePath(), this.progressBar.y = this.textContainerHeight - 30, this.progressBar.x = 35, this.progressBar.height = 24, this.progressBar.width = 225, this.progressBar.color = "#00aeef", this.gameName.font = "18pt 'Roboto', sans-serif", this.gameName.color = o(), this.gameDetailText.font = "8pt 'Roboto', sans-serif", this.gameDetailText.color = "#8a9398", this.gameDetailText.y = this.textContainerHeight - 35, this.stateText.font = "10pt 'Roboto', sans-serif", this.stateText.shadow = null, this.stateText.y = this.textContainerHeight - 13, this.stateText.x = this.width / 2
    }, GameStatusBar.prototype.startDevelopment = function () {
        createjs.Tween.get(this.designPoints).to({
            alpha: 1
        }, 400), createjs.Tween.get(this.technologyPoints).to({
            alpha: 1
        }, 400), createjs.Tween.get(this.bugs).to({
            alpha: 1
        }, 400), createjs.Tween.get(this.gameName).to({
            alpha: 1
        }, 400), this.stateText.shadow = null, this.stateText.color = "DimGray", createjs.Tween.get(this.stateText).to({
            alpha: 1
        }, 400), this.gameName.font = "18pt 'Roboto', sans-serif", this.gameName.color = o(), this.gameDetailText.font = "10pt 'Roboto', sans-serif", this.gameDetailText.color = "#8a9398", this.stateText.font = "10pt 'Roboto', sans-serif", this.stateText.shadow = null
    }, GameStatusBar.prototype.updateGameNameText = function (e) {
        var a = this.children.indexOf(this.gameName);
        this.removeChild(this.gameName);
        var t = 18;
        do {
            var s = "{0}pt {1}".format(t, "Roboto"),
                i = new createjs.Text(e, s, o());
            t -= 2
        } while (1.1 * i.getMeasuredWidth() > this.width && 10 < t);
        i.textAlign = "center", i.textBaseline = "middle", i.lineHeight = i.getMeasuredLineHeight(), i.y = this.textContainerHeight / 4;
        i.x = 30 + (this.width - 60) / 2, i.maxWidth = this.width - 60, this.gameName = i, this.addChildAt(this.gameName, a)
    }, GameStatusBar.prototype.updateProgress = function (e, a, t) {
        t || (t = 400), e && !isNaN(e) ? (a && 0 < e ? createjs.Tween.get(this.progressBar).to({
            progress: e
        }, t) : this.progressBar.progress = e, 0 === this.progressBar.alpha && (createjs.Tween.get(this.progressBar).to({
            alpha: 1
        }, t), this.stateText.color = "white", this.stateText.shadow = new createjs.Shadow("rgba(0, 0, 0, 0.3)", 0, 1, 1))) : 1 === this.progressBar.alpha && (createjs.Tween.get(this.progressBar).to({
            alpha: 0
        }, t), this.stateText.shadow = null, this.stateText.color = "DimGray")
    }, PointsDisplayVisual.prototype.pulse = function (e) {
        createjs.Tween.get(this.mainShape).to({
            scaleX: 1.2,
            scaleY: 1.2
        }, 100).to({
            scaleX: 1,
            scaleY: 1
        }, 100).call(function () {
            e && e()
        })
    }, PointsDisplayVisual.prototype.onTick = function () {
        this.isInvalid && (this.drawMainShape(), this.text.y = 36, this.text.x = 34), this.text.text != Math.floor(this.points) && (this.text.text = Math.floor(this.points), SettingsGameplay.isTextCacheEnabled() && (this.textIsCached || (this.text.cache(-50, -50, 100, 100), this.textIsCached = !0), this.text.updateCache())), this.isInvalid = !1
    }, PointsDisplayVisual.prototype.drawMainShape = function () {
        this.size = 55, this.mainShape.regX = this.size / 2, this.mainShape.regY = this.size / 2;
        var e = this.mainShape.graphics;
        if (e.clear(), this.captionText.text == "Bugs".localize() ? (this.theGradient = C, 10 < "Research".localize().length && (this.x -= 20)) : this.captionText.text == "Design".localize() ? (this.theGradient = y, this.innerContainer.x = -8) : this.captionText.text == "Technology".localize() ? this.theGradient = M : this.captionText.text == "Research".localize() ? (this.theGradient = T, this.innerContainer.x = -18, 10 < "Research".localize().length && (this.x += 20)) : this.captionText.text == "Remaining".localize() && (this.theGradient = M, this.innerContainer.x = -18, this.x += this.size / 4, this.y += this.size / 4), this.removeChild(this.text), this.removeChild(this.mainShape), this.captionBorder.y = 47, this.captionText.color = "white", this.captionText.font = "600 9pt 'Roboto', sans-serif", this.captionText.x = (this.size + 14) / 2 - this.captionText.getMeasuredWidth() / 2, this.captionText.y = 40, this.outerShape) this.outerShape.graphics.clear();
        else {
            this.outerShape = new createjs.Shape;
            var a = this.children.indexOf(this.mainShape);
            this.innerContainer.addChildAt(this.outerShape, a + 1)
        }
        this.outerShape.graphics.beginLinearGradientFill(r(), [0, 1], 0, 0, 0, 90), this.outerShape.graphics.drawEllipse(0, 0, this.size + 13.75, this.size + 13.75), this.outerShape.shadow = this.outerShape.shadow || new createjs.Shadow("rgba(0, 0, 0, 0.30)", 0, 5, 10), e.beginLinearGradientFill(this.theGradient, [0, 1], 0, 0, 0, 90), e.drawEllipse(0, 0, this.size, this.size), this.mainShape.shadow = this.mainShape.shadow || new createjs.Shadow("rgba(0, 0, 0, 0.50)", 0, 1, 2), e.closePath(), this.text.font = "600 14pt 'Roboto', sans-serif", this.text.color = "white", this.mainShape.x = this.size / 2 + 7, this.mainShape.y = this.size / 2 + 7;
        var t = 20 + this.captionText.getMeasuredWidth(),
            s = 12 + this.captionText.getMeasuredHeight();
        (e = this.captionBorder.graphics).clear(), e.beginLinearGradientFill(r(), [0, 1], 0, 0, 0, 90), this.captionText.color = o();
        var i = this.captionText.x - 10,
            n = this.captionText.y - 6;
        e.drawRoundRect(i, n, t, s, 5), e.closePath(), this.captionBorder.shadow = this.captionBorder.shadow || new createjs.Shadow("rgba(0, 0, 0, 0.50)", 0, 1, 2), 0 === this.captionText.cacheID && (this.captionText.y = n + 52 + s / 2, SettingsGameplay.isTextCacheEnabled() && this.captionText.cache(0, -15, 100, 25)), this.innerContainer.addChild(this.text)
    }, HypePointsVisual.prototype._redraw = function () {
        this.width = 220, this.height = 40, this.text.x = this.width / 2, this.text.y = this.height / 2 - 2 + 5, this.text.font = "13px Roboto";
        var e = this.width,
            a = this.height,
            t = this.border.graphics;
        t.clear(), t.beginLinearGradientFill(["#ed1c24", "#f26522"], [0, 1], 0, 0, 0, 90), this.border.shadow = this.border.shadow || new createjs.Shadow("rgba(0, 0, 0, 0.30)", 0, 3, 7), t.drawRoundRect(0, 0, e, a, 5), t.closePath()
    }, ProgressBarVisual.prototype.onTick = function () {
        if (0 != this.alpha) {
            var e = this.width,
                a = this.height,
                t = this.graphics;
            t.clear(), t.beginFill("#8a9398"), t.drawRoundRect(0, 0, e, a, 6), t.beginFill(this.color);
            var s = 0;
            if (this.isHorizontal) e *= this.progress.clamp(0, 1);
            else {
                var i = a * this.progress.clamp(0, 1);
                s = a - i, a = i
            }
            t.drawRoundRect(0, s, e, a, 6), t.closePath()
        }
    }, CharacterOverlay.prototype.spawnBugRemovePoint = function (e, a, t, s) {
        s || (s = 0);
        var i = new MersenneTwister(e),
            n = new createjs.Shape;
        n.alpha = 0;
        var r = this._getSpawnPointOrigin();
        n.x = r.x + 10 * i.random() * i.randomSign(), n.y = r.y - 40 + -20 * i.random(), n.regX = 5, n.regY = 5, n.scaleX = 0, n.scaleY = 0;
        BUGS_COLOR;
        var o = n.graphics;
        o.beginLinearGradientFill(C, [0, 1], 0, 0, 0, 90), o.beginStroke("white"), o.setStrokeStyle(1), o.drawCircle(5, 5, 10), o.closePath(), this.addChild(n);
        var c = this,
            l = t / 8,
            d = t / 2,
            h = GameManager.gameId;
        GameManager.increaseSpawnedPoints();
        var g = [],
            m = this;
        return g.push(createjs.Tween.get(n).wait(s).to({
            y: r.y - 80 - 60 * i.random()
        }, d, createjs.Ease.backIn).call(function () {
            h == GameManager.gameId && (GameManager.decreaseBugs(1), VisualsManager.updatePoints(), 1 == GameManager.company.flags.currentZone && Sound.playSoundOnce("bugDecrease", .2), m.character.removeSpawnedPoint(e), GameManager.decreaseSpawnedPoints(), VisualsManager.pulsePointsDisplay("br"))
        })), g.push(createjs.Tween.get(n).wait(s).to({
            alpha: 1
        }, l).wait(d - 2 * l).to({
            alpha: 0
        }, l).call(function () {
            c.removeChild(n)
        })), g.push(createjs.Tween.get(n).wait(s).to({
            scaleX: 1,
            scaleY: 1
        }, 2 * l, createjs.Ease.backOut)), g
    }, CharacterOverlay.prototype.spawnPoint = function (e, s, a, t) {
        if (t || (t = 0), this.spawnPointVisuals && this.spawnPointVisuals.gameId == GameManager.gameId) {
            if (GameFlags.GROUP_POINTS && s in this.spawnPointVisuals) {
                if (o = this.spawnPointVisuals[s]) {
                    o.weight++;
                    var i = o.targetScaleX,
                        n = o.targetScaleY;
                    o.targetScaleX = Math.min(2, i + .2), o.targetScaleY = Math.min(2, n + .2);
                    var r = createjs.Tween.get(o);
                    if (r.isScaleTween = !0, r.set({
                        scaleX: i,
                        scaleY: n
                    }).to({
                        scaleX: o.targetScaleX,
                        scaleY: o.targetScaleY
                    }, 100), o.ids.push(e), !o.textShape) {
                        o.textShape = new createjs.Text(o.weight, "10pt {0}".format("Roboto"), "white"), o.textShape.textAlign = "center", o.textShape.textBaseline = "middle", o.textShape.x = 5, o.textShape.y = 6, o.addChild(o.textShape)
                    }
                    return o.textShape.text = o.weight, GameManager.increaseSpawnedPoints(), [r]
                }
            }
        } else this.spawnPointVisuals = {
            gameId: GameManager.gameId
        };
        var o, c = new MersenneTwister(e);
        (o = new createjs.Container).alpha = 0;
        var l = this._getSpawnPointOrigin();
        l.x += this.x, l.y += this.y, o.x = l.x + 10 * c.random() * c.randomSign(), o.y = l.y + -20 * c.random(), o.regX = 5, o.regY = 5, o.scaleX = 0, o.scaleY = 0, o.targetScaleX = 1, o.targetScaleY = 1;
        var d = "t" === s || "e" === s ? TECHNOLOGY_POINTS_COLOR : "d" === s ? DESIGN_POINTS_COLOR : "b" === s ? BUGS_COLOR : RESEARCH_POINTS_COLOR;
        1 == GameManager.company.flags.currentZone && Sound.playSpawnSound(s);
        var h = new createjs.Shape;
        o.addChild(h);
        var g = h.graphics,
            m = [];
        switch (d) {
            case DESIGN_POINTS_COLOR:
                m = y;
                break;
            case TECHNOLOGY_POINTS_COLOR:
                m = M;
                break;
            case RESEARCH_POINTS_COLOR:
                m = T;
                break;
            case BUGS_COLOR:
                m = C;
                break;
            default:
                m = M
        }
        g.beginLinearGradientFill(m, [0, 1], 0, 0, 0, 90), g.beginStroke("white"), g.setStrokeStyle(1), g.drawCircle(5, 5, 10), g.closePath(), CanvasManager.characterStage.addChild(o), o.weight = 1, o.ids = [e], this.spawnPointVisuals[s] = o;
        var p = CanvasManager.characterStage,
            u = VisualsManager.getGlobalLocationOfPointsDisplay(s),
            v = a / 8,
            f = a / 2,
            S = GameManager.gameId;
        GameManager.increaseSpawnedPoints();
        var w = [],
            x = this;
        return w.push(createjs.Tween.get(o).wait(t).to({
            y: l.y - 80 - 20 * c.random()
        }, f, createjs.Ease.backOut).call(function () {
            delete x.spawnPointVisuals[s]
        }).to({
            x: u.x,
            y: u.y
        }, a - f, createjs.Ease.quadIn).call(function () {
            if (S == GameManager.gameId) {
                var e = o.weight;
                VisualsManager.pulsePointsDisplay(s), "t" === s ? GameManager.company.currentGame ? GameManager.company.currentGame.technologyPoints += e : GameManager.currentContract && (GameManager.currentContract.visualTRemaining -= e) : "d" === s ? GameManager.company.currentGame ? GameManager.company.currentGame.designPoints += e : GameManager.currentContract && (GameManager.currentContract.visualDRemaining -= e) : "r" === s ? GameManager.company.researchPoints += e : "e" === s ? GameManager.increaseDisplayEnginePoints(x.character, e) : "b" === s && GameManager.company.currentGame && (GameManager.company.currentGame.bugs += e), 1 == GameManager.company.flags.currentZone && Sound.playSpawnSound(s, !0), VisualsManager.updatePoints();
                for (var a = 0; a < o.ids.length; a++) {
                    var t = o.ids[a];
                    x.character.removeSpawnedPoint(t), GameManager.decreaseSpawnedPoints()
                }
                "r" != s && GameManager.currentFeature && "preparation" != GameManager.currentFeature.id && Tutorial.gamePoints()
            }
        })), w.push(createjs.Tween.get(o).wait(t).to({
            alpha: 1
        }, v).wait(a - 2 * v).to({
            alpha: 0
        }, v).call(function () {
            p.removeChild(o)
        })), w.push(createjs.Tween.get(o).wait(t).to({
            scaleX: 1,
            scaleY: 1
        }, 2 * v, createjs.Ease.backOut)), w
    }
}), $(function () {
    var i;
    $("body").append('<div id="tagBottomBar"> <div class="tagStatusBarItem"> <div class="tagTimeFans"><div class="tagTimeAll"><img class="timeIcon" src="' + MOD_DIR + 'Img/SVG/tag-clock.svg" width="28px"/><div id="tagDate">Y1 M1 W1</div><div class="tm-weekly-ticks"></div></div><div class="tagFansAll"><img class="fansIcon" src="' + MOD_DIR + 'Img/SVG/tag-fansIcon.svg" width="28px"/><div id="tagFans"><div class="tm-fans-text">5328</div></div></div></div> </div> <div class="tagStatusBarItem"> <div class="tagMoneyAll"><div class="creditsIcon">Cr.</div><div id="tagMoney"><div class="tm-money-text">800M</div></div></div> <div class="tagIncomeAll"><img src="' + MOD_DIR + 'Img/SVG/tag-moneyGain.svg" class="profitIcon"/><div id="tagIncome">800M</div></div> <div class="tagLossAll"><img src="' + MOD_DIR + 'Img/SVG/tag-moneyLoss.svg" class="profitIcon"/><div id="tagLoss">800M</div></div> </div> <div class="tagStatusBarItem tagInfoStatsButt tm-icon tm-icon-levels tm-icon-lg" onclick="tagMod.showInfoStats()"><span>{0}</span></div> <div class="tagStatusBarItem tagStaffButt tm-icon tm-icon-people tm-icon-lg" onclick="UI.showStaffList()"><span>{1}</span></div></div>'.format("Thông tin và Thống kê".localize(), "Staff".localize())), $("#statusBar").remove();
    var n = function (e) {
        var a = UI.getShortNumberString(e);
        $("#tagFans .tm-fans-text").text(a)
    },
        r = function (e) {
            if (1e6 <= Math.abs(e)) var a = "{0}M".localize().format(UI.getLongNumberString(Math.roundToDecimals(e / 1e6, 1)));
            else {
                var t = "{0}".localize().format(e.toLocaleString());
                a = t.substr(0, t.length - 3)
            }
            $("#tagMoney .tm-money-text").text(a)
        },
        o = function (e) {
            $("#tagIncome").text(UI.getShortNumberString(e))
        },
        c = function (e) {
            $("#tagLoss").text(UI.getShortNumberString(e))
        },
        l = {};

    function d(e, a, t) {
        l[a] != e[a] && (t(e[a]), l[a] = e[a])
    }

    function h(e, a, t) {
        var s = "green";
        a < 0 && (s = "red"), e.append('<div class="tm-hud-delta ' + s + '">' + (0 < a ? "+" : "") + UI.getShortNumberString(a) + "</div>");
        var i = e.find(".tm-hud-delta");
        setTimeout(function () {
            i.addClass("tm-hud-delta-end-pos")
        }, 0), setTimeout(function () {
            i.remove()
        }, 3e3)
    }
    UI.updateStatusBar = function (e) {
        var a, t, s;
        e && (0 != (t = (a = e).cashLog.sum(function (e) {
            return e.amount
        })) && h($("#tagMoney"), t, 0), 5e3 < Math.abs(a.cashLog.sum(function (e) {
            return e.amount
        })) && Sound.playSoundOnce("cash", .2), a.cashLog.length = 0, a.fansChange && (h($("#tagFans"), a.fansChange, 0), a.fans += a.fansChange, a.fansChange = 0), d(e, "cash", r), null == e.tmMonthlyRevenue && (e.tmMonthlyRevenue = tagMod.queryStatMonth("revenue"), e.tmMonthlyCost = tagMod.queryStatMonth("cost")), d(e, "tmMonthlyRevenue", o), d(e, "tmMonthlyCost", c), function (e) {
            if (null == l.date || l.date != tagMod.dateToInt(e)) {
                l.date = tagMod.dateToInt(e);
                var a = "Y{0} M{1} W{2}".localize("date display").format(e.year, e.month, e.week);
                $("#tagDate").text(a)
            }
        }(e.getCurrentDate()), d(e, "fans", n), s = e, i || (i = $("#trendContainer")), s && s.flags.trends ? (i.trend != s.flags.trends.currentTrend && (i.trend = s.flags.trends.currentTrend), i.trend && i.trend.label ? i.text(i.trend.label).addClass("statusBar").show() : i.removeClass("statusBar").hide()) : i.hide())
    }, GameManager.addTickListener(function () {
        if (null != GameManager.company) {
            var e = Math.floor(4 * GameManager.company.currentWeek) % 4 + 1;
            if (l.nTicks !== e) {
                var a = $(".tm-weekly-ticks");
                a.empty();
                for (var t = 0; t < e; t++) a.append('<div class="tm-weekly-ticks-tick"></div>');
                l.nTicks = e
            }
        }
    }, !0)
}), $(function () {
    var C = [],
        y = 207,
        M = 100;
    UI.addSalesCard = function (e, a, t, s, i, n, r, o, c, l, d, h) {
        t < s && 0 < t && 0 === r.length && r.push(t), 1 === r.length ? g(e, a, n, i, o, c, l, h) : 1 < r.length && m(e, a, n, i, r, c, d, h)
    };
    var f = function (a, e, t, s) {
        var i = $("#gameSalesContainer"),
            n = $("#gameSalesCardTemplate").clone();
        n.removeAttr("id"), n.rankElement = n.find(".gameSalesRankLabel"), n.unitsElement = n.find(".gameSalesUnitsLabel"), n.find(".gameNameLabel").text(e), c(n, t, s, {
            currentRankText: "",
            currentUnitsText: ""
        }), i.append(n);
        var r = n.find(".gameSalesCardCanvas"),
            o = new createjs.Stage(r[0]);
        return o.canvas.height = M, o.canvas.width = y, n.on("click", function (e) {
            UI.salesContainerClick(e, a)
        }), {
            id: a,
            stage: o,
            card: n,
            currentSalesRank: t,
            unitsSold: s
        }
    },
        g = function (e, a, t, s, i, n, r, o) {
            var c = f(e, a, t, s),
                l = T(n != Sales.consoleUnitPrice);
            c.stage.addChild(l), l.y = M, l.width = y, c.shapes = [l], C.push(c);
            var d = 1 - (GameManager.company.currentWeek - Math.floor(GameManager.company.currentWeek));
            b.push(createjs.Tween.get(l).to({
                y: 0,
                height: M
            }, 7500 * d));
            var h = s;
            if (i ? (h = o ? s + i / o / n : s + i / n, b.push(createjs.Tween.get(c).wait(500).to({
                unitsSold: h
            }, 7500))) : b.push(createjs.Tween.get(c).wait(500).to({
                unitsSold: s
            }, 7500)), r) {
                l = T("maintenance");
                c.stage.addChild(l), l.y = M, l.width = y, c.maintenanceShapes = [l], b.push(createjs.Tween.get(l).to({
                    y: M - M * (r / n / h),
                    height: M * (r / n / h)
                }, 7500))
            }
        },
        m = function (e, a, t, s, i, n, r, o) {
            var c = f(e, a, t, s);
            40 <= i.length && (stageObject.stage.removeChild(stageObject.shapes[0]), stageObject.shapes.remove(stageObject.shapes[0]), i.splice(0, 1), r && (stageObject.stage.removeChild(stageObject.maintenanceShapes[0]), stageObject.maintenanceShapes.remove(stageObject.maintenanceShapes[0]), r.splice(0, 1)));
            var l = i.max(function (e) {
                return e
            }),
                d = i.length,
                h = [];
            if (c.maintenanceShapes = [], r)
                for (var g = 0; g < d; g++) {
                    var m = n != Sales.consoleUnitPrice;
                    (v = T(m)).scaleX = 1 / d - .01, v.x = y / d * g;
                    var p = M * (i[g] / l);
                    v.y = M - p, v.scaleY = p / M, h.push(v);
                    var u = T("maintenance");
                    u.scaleX = 1 / d - .01, u.x = y / d * g;
                    p = M * (r[g] / n / l);
                    u.y = M - p, u.scaleY = p / M, c.maintenanceShapes.push(u), i[g] > r[g] ? (c.stage.addChild(v), c.stage.addChild(u)) : (c.stage.addChild(u), c.stage.addChild(v))
                } else
                for (g = 0; g < d; g++) {
                    m = n != Sales.consoleUnitPrice;
                    var v = T(m);
                    c.stage.addChild(v), v.scaleX = 1 / d - .01, v.x = y / d * g;
                    p = M * (i[g] / l);
                    v.y = M - p, v.scaleY = p / M, h.push(v)
                }
            c.stage.update(), c.shapes = h, C.push(c)
        },
        T = function (e) {
            var a = new createjs.Shape;
            a.alpha = 1, a.x = 0;
            var t = a.graphics;
            return "maintenance" === e ? t.beginLinearGradientFill(["#e74c3c", "#ab3226"], [0, 1], 0, 0, 0, 90) : e ? t.beginLinearGradientFill(["#57d68d", "#27ae60"], [0, 1], 0, 0, 0, 90) : t.beginLinearGradientFill(["#1abc9c", "#5cace2"], [0, 1], 0, 0, 0, 90), t.drawRect(0, 0, y, M), t.closePath(), a
        },
        c = function (e, a, t, s) {
            var i, n = "";
            0 < a && (n = "Rank: ".localize() + a), i = "Units: ".localize() + UI.getShortNumberString(Math.floor(t)), s.currentRankText != n && (e.rankElement.text(n), s.currentRankText = n), s.currentUnitsText != i && (e.unitsElement.text(i), s.currentUnitsText = i)
        };
    UI.updateSalesCard = function (a, e, t, s, i, n, r, o, c) {
        void 0 === t && (t = 0);
        var l = C.first(function (e) {
            return e.id === a
        });
        if (l) {
            l.currentSalesRank = n;
            var d = l.stage;
            40 <= s.length && (l.stage.removeChild(l.shapes[0]), l.shapes.remove(l.shapes[0]), s.splice(0, 1), o && (l.stage.removeChild(l.maintenanceShapes[0]), l.maintenanceShapes.remove(l.maintenanceShapes[0]), o.splice(0, 1)));
            for (var h = s.max(function (e) {
                return e
            }), g = s.length, m = y / g, p = i != Sales.consoleUnitPrice, u = l.shapes.length, v = 0; v < u; v++) {
                var f = M * (s[v] / h),
                    S = 1 / g - .01;
                b.push(createjs.Tween.get(l.shapes[v]).to({
                    scaleX: S,
                    x: y / g * v,
                    y: M - f,
                    scaleY: f / M
                }, 500))
            }
            var w = T(p);
            w.y = M, w.x = y - m, w.scaleX = 1 / g - .01, l.shapes.push(w);
            f = M * (s.last() / h);
            if (b.push(createjs.Tween.get(w).wait(500).to({
                y: M - f,
                scaleY: f / M
            }, 7500)), c || (c = 1), b.push(createjs.Tween.get(l).wait(500).to({
                unitsSold: e + t / c / i
            }, 7500)), o) {
                for (v = 0; v < l.maintenanceShapes.length; v++) {
                    f = M * (o[v] / h), S = 1 / g - .01;
                    b.push(createjs.Tween.get(l.maintenanceShapes[v]).to({
                        scaleX: S,
                        x: y / g * v,
                        y: M - f,
                        scaleY: f / M
                    }, 500))
                }
                var x = T("maintenance");
                x.y = M, x.x = y - m, x.scaleX = 1 / g - .01, s.last() > o.last() ? (d.addChild(w), d.addChild(x)) : (d.addChild(x), d.addChild(w)), l.maintenanceShapes.push(x);
                f = M * (o.last() / h);
                b.push(createjs.Tween.get(x).wait(500).to({
                    y: M - f,
                    scaleY: f / M
                }, 7500))
            } else d.addChild(w)
        }
    }, UI.clearSalesCards = function () {
        C.forEach(function (e) {
            UI.removeSalesCard(e.id, !1)
        }), $("#gameSalesContainer").empty(), C = []
    }, UI.removeSalesCard = function (a, e) {
        var t = C.first(function (e) {
            return e.id === a
        });
        t && (t.card.off("click"), t.card.slideUp("slow", function () {
            $(this).remove()
        }), C.remove(t))
    };
    var b = [];
    GameManager.addTickListener(function (e, a) {
        if (b && 0 < b.length && !a) {
            for (var t = 0; t < b.length; t++) {
                var s = b[t];
                s._target, s.tick(e, !1)
            }
            for (t = 0; t < C.length; t++) C[t].stage.update(), c(C[t].card, C[t].currentSalesRank, C[t].unitsSold, C[t])
        }
    }, !0);
    var r = [];

    function l(a) {
        return r.find(function (e) {
            return e.id == a
        }).$card
    }

    function d(a) {
        var e = GameManager.company.gameLog.find(function (e) {
            return e.id == a
        });
        return null == e && (e = GameManager.company.licencedPlatforms.find(function (e) {
            return !0 === e.isCustom && e.id == a
        })), e
    }

    function n(e) {
        var a = d(e),
            t = l(e),
            s = a.revenue || a.currentSalesCash,
            i = a.costs || tagMod.getConsoleCost(a),
            n = s - i;
        if (null != a.reviews) {
            var r = a.reviews.average(function (e) {
                return e.score
            });
            t.find(".tm-sales-card-rating .tagReviewRatingNum").text(r), applyReviewCircle(t.find(".tm-sales-card-rating .tagReviewAverageScore"), r, !0)
        } else {
            t.find(".tm-sales-card-rating").html('<img src="' + a.iconUri + '" />')
        }
        if (null != a.topic ? t.find(".tm-sales-card-subtitle").text(tagMod.getGameTopicGenreString(a)) : t.find(".tm-sales-card-subtitle").text(tagMod.getConsoleGenerationString(a)), t.find(".tm-sales-card-item-profit .tm-sales-card-item-value").html(tmPrettyCashHtml(n).replace("$", "") + "₫"), t.find(".tm-sales-card-item-revenue .tm-sales-card-item-value").html(tmPrettyCash(s).replace("$", "") + "₫"), t.find(".tm-sales-card-item-cost .tm-sales-card-item-value").html(tmPrettyCashHtml(i, !0).replace("$", "") + "₫"), null != a.fansChanged) {
            t.find(".tm-sales-card-item-fans").show();
            var o = a.fansChanged;
            t.find(".tm-sales-card-item-fans .tm-sales-card-item-value").html(tmPrettyDeltaHtml(o))
        } else t.find(".tm-sales-card-item-fans").hide();
        if (null != a.hypePoints) {
            t.find(".tm-sales-card-item-hype").show();
            var c = Math.floor(a.hypePoints);
            t.find(".tm-sales-card-item-hype .tm-sales-card-item-value").html('<span class="yellow">' + tmPrettyDelta(c) + "</span>")
        } else t.find(".tm-sales-card-item-hype").hide();
        h(e)
    }

    function h(a) {
        var e = d(a);
        if (null != e) {
            var t = l(a),
                s = null != GameManager.company.staff.find(tagMod.staffAvailableToWork),
                i = t.find(".btn-generate-report");
            null != e.canDoPostMortem && e.canDoPostMortem() ? s ? i.hasClass("disabledButton") && i.removeClass("disabledButton") : i.hasClass("disabledButton") || i.addClass("disabledButton") : i.remove()
        } else {
            var n = r.find(function (e) {
                return e.id == a
            });
            null != n && clearInterval(n.updateInterval)
        }
    }
    var o = UI.addSalesCard,
        e = UI.updateSalesCard,
        t = UI.removeSalesCard;
    UI.addSalesCard = function () {
        if (o.apply(UI, arguments), 0 != arguments[6].length) {
            var e = arguments[0],
                a = $("#gameSalesContainer .gameSalesCard");
            if (0 != a.length) {
                for (var t = a.slice(a.length - 1), s = 0; s < r.length; s++)
                    if (r[s].id == e) {
                        clearInterval(r[s].updateInterval), r.splice(s, 1);
                        break
                    } r.push({
                        id: e,
                        $card: t,
                        updateInterval: setInterval(function () {
                            h(e)
                        }, 1e3)
                    }), t.find(".gameNameLabel").before('<div class="tm-sales-card-rating"><div class="tagReviewAverageScore"><div class="tagReviewCircleOuter"><div class="tagReviewRatingTrack"><div class="tagReviewRatingNum">0</div><div class="tagReviewRating"></div></div></div></div></div>').after('<div class="tm-sales-card-subtitle"></div>'), t.append('<div class="tm-sales-card-item tm-sales-card-item-profit"><div class="tm-sales-card-item-label">{0}:</div><div class="tm-sales-card-item-value"></div></div>'.format("Lợi nhuận".localize())), t.append('<div class="tm-sales-card-item tm-sales-card-item-revenue"><div class="tm-sales-card-item-label">{0}:</div><div class="tm-sales-card-item-value"></div></div>'.format("Doanh thu".localize())), t.append('<div class="tm-sales-card-item tm-sales-card-item-cost"><div class="tm-sales-card-item-label">{0}:</div><div class="tm-sales-card-item-value"></div></div>'.format("Chi phí sản xuất".localize())), t.append('<div class="tm-sales-card-item tm-sales-card-item-fans"><div class="tm-sales-card-item-label">{0}:</div><div class="tm-sales-card-item-value"></div></div>'.format("Người hâm mộ đạt được".localize())), t.append('<div class="tm-sales-card-item tm-sales-card-item-hype"><div class="tm-sales-card-item-label">{0}:</div><div class="tm-sales-card-item-value"></div></div>'.format("Độ hype".localize())), t.append('<div class="tm-sales-card-actions"><button type="button" class="btn-tm-action btn-tm-action-primary btn-generate-report" data-id="' + e + '">{0}</button></div>'.format("Tạo báo cáo".localize()));
                var i = d(e);
                null != i.developmentCosts && (i._tmIsConsole = !0, t.addClass("tm-sales-card-console"), $(".hwCard .projectStatusContainer").after(t)), t.on("click", ".gameNameLabel, .tm-sales-card-rating, .tm-sales-card-subtitle", function (e) {
                    e.stopPropagation(), t.toggleClass("tm-closed")
                }), n(e)
            }
        }
    }, UI.updateSalesCard = function () {
        e.apply(UI, arguments), n(arguments[0])
    }, UI.removeSalesCard = function () {
        var e = arguments[0];
        t.apply(UI, arguments);
        for (var a = 0; a < r.length; a++)
            if (r[a].id == e) {
                clearInterval(r[a].updateInterval), r.splice(a, 1);
                break
            }
    }, $("body").on("click", ".btn-generate-report", function (e) {
        var a = $(e.currentTarget);
        if (null != GameManager.company.staff.find(tagMod.staffAvailableToWork) || a.addClass("disabledButton"), !a.hasClass("disabledButton")) {
            var t = d(a.data("id"));
            $("#gameHistoryDialog").dialog("close"), Sound.click(),
                function (t, s) {
                    function e(e) {
                        GameManager.flags.selectedGameId = t.id, GameManager.uiSettings.selectedChar = e.id, e.flags.postMortemGameId = t.id;
                        var a = Training.postMortem;
                        a.duration = a.baseDuration * General.getGameSizeDurationFactor(t.gameSize), GameManager.research(a, "training"), GameManager.resume(!0), s && s()
                    }
                    1 == GameManager.company.staff.length ? e(GameManager.company.staff[0]) : UI.showStaffList({
                        title: "Select Staff".localize(),
                        acceptCallback: e,
                        acceptLabel: "Select".localize(),
                        staffAvailable: tagMod.staffAvailableToWork
                    })
                }(t, function () {
                    a.remove()
                })
        }
    }), tagMod.patch(UI, "salesContainerClick", function (e, a) {
        e.screenX = e.clientX, e.screenY = e.clientY
    }, function () { })
}), $(function () {
    tagMod.patch(VisualsManager, "updateProjectStatusCards", function () {
        var e = $(".rndCard").find(".projectIcon"),
            a = e.attr("src");
        a = a.substr(a.lastIndexOf("/") + 1), e.attr("src", MOD_DIR + "Img/RnD/" + a)
    });
    var m = [],
        p = 207;
    UI.addMaintenanceCard = function (e) {
        1 <= e.maintenanceLog.length && (1 === e.maintenanceLog.length ? a(e) : t(e)), $(".hwCard").append($("#consoleMaintenanceContainer"))
    };
    var g = function (e) {
        var a = new createjs.Shape;
        a.alpha = 1, a.x = 8;
        var t = a.graphics;
        return 0 == e ? t.beginFill(createjs.Graphics.getRGB(247, 148, 29, 1)) : t.beginFill(createjs.Graphics.getRGB(231, 76, 60, 1)), t.drawRect(0, 0, p, .5), t.closePath(), a
    },
        u = function (e) {
            var a = $("#consoleMaintenanceContainer"),
                t = $("#consoleMainCardTemplate").clone();
            t.clickExcl(function () {
                VisualsManager.scrollToZone(0, !0)
            }), t.removeAttr("id"), t.title = t.find(".title"), t.points = t.find(".points"), t.append('<div class="tm-maintenance-card-status"></div>'), t.status = t.find(".tm-maintenance-card-status"), n(t, e.name), f(t, e.maintenancePoints), a.append(t);
            var s = t.find(".consoleMainCardGroupCanvas"),
                i = new createjs.Stage(s[0]);
            return i.canvas.height = 105, i.canvas.width = 223, {
                id: e.id,
                stage: i,
                card: t,
                console: e
            }
        },
        v = function (e) {
            var a = new createjs.Shape;
            a.alpha = 1, a.x = 8;
            var t = a.graphics;
            return e ? t.beginLinearGradientFill(["#e74c3c", "#ab3226"], [0, 1], 0, 0, 0, 90) : t.beginLinearGradientFill(["#1abc9c", "#5cace2"], [0, 1], 0, 0, 0, 90), t.drawRect(0, 0, p, 95), t.closePath(), a
        },
        a = function (e) {
            var a = u(e),
                t = v(!0);
            a.stage.addChild(t), t.x = 8, t.y = 100, t.width = p, t.scaleY = 0;
            var s = e.maintenanceLog[0] / 99 * 95;
            x.push(createjs.Tween.get(t).to({
                y: 100 - s,
                scaleY: s / 95
            }, 300)), a.shapes = [t], t = v(!1), a.stage.addChild(t), t.x = 8, t.y = 100, t.scaleY = 0, t.width = p, a.repairShapes = [t];
            var i = g(0),
                n = g(1);
            a.lines = [i, n], S(a), a.stage.addChild(i), a.stage.addChild(n);
            var r = new ProgressBarVisual;
            r.alpha = 1, r.progress = .5, r.width = 20, r.height = 65, r.x = 10, r.y = 33, r.isHorizontal = !1, a.progressBar = r, m.push(a), e.repairPointsLog || (e.repairPointsLog = [0])
        },
        n = function (e, a, t) {
            var s = UI.getMeasuredWidth(a, 14),
                i = Math.min(180 / s * 14, 14);
            e.title.css("font-size", i + "pt"), e.title.text(a)
        },
        f = function (e, a) {
            e.points.html("Backlog: {0}".localize().format('<span class="tm-maintenance-card-points-val">' + a + "</span>"))
        },
        S = function (e) {
            e.stage.removeChild(e.lines[0]), e.stage.removeChild(e.lines[1]);
            var a = Math.max(99, e.console.maintenanceLog.max(function (e) {
                return e
            }));
            e.lines[0].y = 100 - 66 / a * 95, e.lines[1].y = 100 - 99 / a * 95, e.stage.addChild(e.lines[0]), e.stage.addChild(e.lines[1])
        },
        w = function (e) {
            var a = e.console.satisFaction.clamp(0, 1),
                t = "Good".localize(),
                s = "green";
            a <= .33 ? (t = "Bad".localize(), s = "red") : a <= .66 && (t = "Okay".localize(), s = "orange"), e.card.status.html("Status: {0}".localize().format('<span class="tm-maintenance-card-status-val ' + s + '">' + t + "</span>"))
        },
        t = function (e) {
            var a = u(e),
                t = new ProgressBarVisual;
            t.alpha = 1, t.progress = e.satisFaction.clamp(0, 1), w(a), t.color = createjs.Graphics.getHSL(80 * e.satisFaction.clamp(0, 1), 100, 50), t.width = 20, t.height = 65, t.x = 10, t.y = 33, t.isHorizontal = !1, a.progressBar = t;
            var s = Math.max(99, e.maintenanceLog.max(function (e) {
                return e
            })),
                i = e.maintenanceLog.length,
                n = [];
            a.maintenanceShapes = [], a.repairShapes = [];
            for (var r = 0; r < i; r++) {
                var o = v(!0);
                o.scaleX = 1 / i, o.x = 8 + p / i * r;
                var c = e.maintenanceLog[r] / s * 95;
                o.y = 100 - c, o.scaleY = c / 95, n.push(o);
                var l = v(!1);
                l.scaleX = 1 / i, l.x = 8 + p / i * r;
                c = e.repairPointsLog[r] / s * 95;
                l.y = 100 - c, l.scaleY = c / 95, a.repairShapes.push(l), a.stage.addChild(o), a.stage.addChild(l)
            }
            var d = g(0),
                h = g(1);
            a.lines = [d, h], S(a), a.stage.update(), a.shapes = n, m.push(a)
        };
    UI.updateMaintenanceCard = function (a) {
        var e = m.first(function (e) {
            return e.id === a.id
        });
        e || (UI.addMaintenanceCard(a), e = m.first(function (e) {
            return e.id === a.id
        }));
        var t = e.card;
        if (f(t, a.maintenancePoints), e && e.shapes.length < a.maintenanceLog.length) {
            var s, i = e.stage,
                n = Math.max(99, a.maintenanceLog.max(function (e) {
                    return e
                })),
                r = a.maintenanceLog.length,
                o = p / r;
            30 <= a.maintenanceLog.length && (e.stage.removeChild(e.shapes[0]), e.shapes.remove(e.shapes[0]), a.maintenanceLog.splice(0, 1), e.stage.removeChild(e.repairShapes[0]), e.repairShapes.remove(e.repairShapes[0]), a.repairPointsLog.splice(0, 1), r--), a.repairPointsLog.length < a.maintenanceLog.length && (a.repairPointsLog.push(0), a.repairPoints = 0, (s = v(!1)).y = 100, s.x = 215 - o, s.scaleX = 1 / r, s.scaleY = 0, e.repairShapes.push(s));
            for (var c = e.shapes.length, l = 0; l < c; l++) {
                var d = a.maintenanceLog[l] / n * 95,
                    h = 1 / r;
                x.push(createjs.Tween.get(e.shapes[l]).to({
                    scaleX: h,
                    x: 8 + p / r * l,
                    y: 100 - d,
                    scaleY: d / 95
                }, 500))
            }
            var g = v(!0);
            g.y = 100, g.x = 215 - o, g.scaleX = 1 / r, g.scaleY = 0, e.shapes.push(g);
            d = a.maintenanceLog.last() / n * 95;
            x.push(createjs.Tween.get(g).wait(500).to({
                y: 100 - d,
                scaleY: d / 95
            }, 300));
            for (l = 0; l < e.repairShapes.length; l++) {
                d = a.repairPointsLog[l] / n * 95, h = 1 / r;
                x.push(createjs.Tween.get(e.repairShapes[l]).to({
                    scaleX: h,
                    x: 8 + p / r * l,
                    y: 100 - d,
                    scaleY: d / 95
                }, 500))
            }
            i.addChild(g), s && i.addChild(s), S(e)
        }
    }, UI.updateRepairPoints = function (a) {
        var e = m.first(function (e) {
            return e.id === a.id
        });
        if (e) {
            var t = Math.max(99, a.maintenanceLog.max(function (e) {
                return e
            }));
            a.repairPointsLog[a.repairPointsLog.length - 1] = a.repairPoints;
            var s = a.repairPointsLog.last() / t * 95,
                i = e.repairShapes.last();
            i.y = 100 - s, i.scaleY = s / 95, f(e.card, a.maintenancePoints)
        }
    }, UI.clearMaintenanceCards = function () {
        m.forEach(function (e) {
            UI.removeMaintenanceCard(e.id, !1)
        }), $("#consoleMaintenanceContainer").empty(), m = []
    }, UI.removeMaintenanceCard = function (a, e) {
        var t = m.first(function (e) {
            return e.id === a.id
        });
        t && (t.card.remove(), m.remove(t))
    };
    var i = function (a, e) {
        var t = m.first(function (e) {
            return e.id === a.id
        });
        a.satisFaction || (a.satisFaction = 1), a.maintenancePoints < 33 ? a.satisFaction += .04 * e / 500 : a.maintenancePoints < 66 ? a.satisFaction += .02 * e / 500 : 99 < a.maintenancePoints ? a.satisFaction -= .02 * e / 350 : 122 < a.maintenancePoints && (a.satisFaction -= .04 * e / 350), a.satisFaction = a.satisFaction.clamp(-.3, 1.3), t.progressBar.progress = a.satisFaction.clamp(0, 1), t.progressBar.color = createjs.Graphics.getHSL(80 * a.satisFaction.clamp(0, 1), 100, 50)
    },
        x = [];
    GameManager.addTickListener(function (e, a) {
        if (!a && x && 0 < x.length && !a) {
            for (var t = 0; t < x.length; t++) {
                var s = x[t];
                s._target, s.tick(e, !1)
            }
            for (t = 0; t < m.length; t++) i(m[t].console, e), m[t].stage.update(), w(m[t])
        }
    }, !0)
});