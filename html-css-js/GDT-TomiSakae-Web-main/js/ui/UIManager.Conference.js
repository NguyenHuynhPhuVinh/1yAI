(function () {
    var a = ["./images/superb/conf1f.png", "./images/superb/conf2f.png", "./images/superb/conf3f.png"],
        b = "./images/superb/conff1r.png ./images/superb/conff2r.png ./images/superb/conff3r.png ./images/superb/conff4r.png ./images/superb/confm1r.png ./images/superb/confm2r.png ./images/superb/confm3r.png ./images/superb/confm4r.png".split(" "),
        c = "./images/superb/conff1l.png ./images/superb/conff2l.png ./images/superb/conff3l.png ./images/superb/conff4l.png ./images/superb/confm1l.png ./images/superb/confm2l.png ./images/superb/confm3l.png ./images/superb/confm4l.png".split(" ");
    UI.showConferenceBoothList = function (a, b) {
        var c = GameManager.company.booths;
        GameManager.company.conferenceStandFactor = null;
        $(".selectionOverlayContainer").hide();
        var d = $("#conferenceBoothPicker"),
            f = {
                disableCheckForNotifications: !0,
                close: !0,
                onClose: function () {
                    GameManager.removeFromActiveNotifications(a);
                    GameManager.resume(!0);
                    b && b()
                }
            };
        d.find(".conferenceBoothPickerText").text("The big game convention will take place in four weeks time. Do you want to participate?".localize());
        var g = d.find(".conferenceBoothSliderContainer");
        g.empty();
        var k = $('<div class="conferenceBoothVariationContainer royalSlider rsDefaultInv"></div>');
        g.append(k);
        for (var g = $("#genericBoothTemplate"), l = 0; l < c.length; l++) {
            var m = c[l];
            if ("" !== m.description) {
                var p = g.clone();
                p.find(".boothTitle").text(m.name);
                p.find(".boothDescription").text(m.description);
                p.find(".boothCashCost").text("Costs: {0}".localize().format(UI.getShortNumberString(m.cost)));
                k.append(p)
            }
        }
        PlatformShim.ISWIN8 ? k.gdSlider() : f.onOpen = function () {
            k.gdSlider()
        };
        d.find(".okButton").clickExcl(function () {
            Sound.click();
            var a = d.find(".rsActiveSlide").find(".boothTitle").text(),
                b = GameManager.company.booths.first(function (b) {
                    return b.name == a
                });
            GameManager.company.cash >= b.cost ? (GameManager.company.conferenceStandFactor = b.standFactor, GameManager.company.adjustCash(-b.cost, b.name), UI.closeModal()) : d.find(".centeredButtonWrapper").effect("shake", {
                times: 2,
                distance: 5
            }, 50)
        });
        UI.showModalContent("#conferenceBoothPicker", f)
    };
    var f = function (a, b) {
        var c = "",
            c = GameManager.company.currentGame ? b ? GameManager.company.gameLog.last().title :
                GameManager.company.currentGame.title : b ? GameManager.company.gameLog[GameManager.company.gameLog.length - 2].title : GameManager.company.gameLog.last().title,
            d = 150,
            f = 50,
            g = 378,
            l = 369;
        2 === a ? b ? (d = 90, f = 25, g = 385, l = 392) : (d = 140, f = 15, g = 387, l = 274) : 3 === a ? (d = 245, f = 33, g = 372, l = 234) : 4 === a && (b ? (d = 176, f = 40, g = 379, l = 304) : (d = 150, f = 15, g = 378, l = 252));
        return k(c, d, f, g, l)
    },
        d = function (a, b) {
            var c = GameManager.company.name,
                d = 180,
                f = 30,
                g = 381,
                l = 256;
            2 === a ? (d = 255, f = 35, g = 382, l = 237) : 3 === a ? (d = 300, f = 35, g = 373, l = 180, b && (d = 127, f = 15, g = 376, l = 331)) :
                4 === a && (d = 290, f = 29, g = 378, l = 348);
            return k(c, d, f, g, l)
        },
        k = function (a, b, c, d, f) {
            var g = new createjs.Container;
            g.x = d;
            g.y = f;
            d = UI.IS_SEGOE_UI_INSTALLED ? "Segoe UI" : "Open Sans";
            f = 32;
            do {
                var k = "bold {0}pt {1}".format(f, d),
                    k = new createjs.Text(a, k, "black");
                f -= 1
            } while ((k.getMeasuredWidth() > b || k.getMeasuredLineHeight() > c) && 1 < f);
            b = f / 32;
            c = createjs.Graphics.getHSL(0, 0, 24);
            k = new createjs.Text(a, "bold 32pt {0}".format(d), c);
            k.textAlign = "center";
            k.textBaseline = "middle";
            g.scaleX = b;
            g.scaleY = b;
            g.addChild(k);
            return g
        },
        m = function (a,
            b) {
            var c = "",
                d = !1;
            GameManager.currentHwProject && GameManager.currentHwProject.announced ? (c = GameManager.currentHwProject.iconUri, d = !0) : (c = GameManager.company.licencedPlatforms.last(function (a) {
                return a.isCustom
            })) ? (c = c.iconUri, d = !0) : c = GameManager.company.currentGame ? Platforms.getPlatformImage(GameManager.company.currentGame.platforms[0], GameManager.company.currentWeek) : Platforms.getPlatformImage(GameManager.company.gameLog.last().platforms[0], GameManager.company.currentWeek);
            if (b && !d)
                for (d = GameManager.company.gameLog.length -
                    1; 0 < d; d--) {
                    var f = Platforms.getPlatformImage(GameManager.company.gameLog[d].platforms[0], GameManager.company.currentWeek);
                    if (f != c) {
                        c = f;
                        break
                    }
                }
            c = new createjs.Bitmap(c);
            d = new createjs.Container;
            d.scaleX = 0.2;
            d.scaleY = 0.2;
            3 === a ? (d.x = 356, d.y = 350) : 2 === a ? (d.y = 315, d.x = b ? 265 : 460) : 4 === a && (d.scaleX = 0.08, d.scaleY = 0.08, d.y = 300, d.x = b ? 236 : 509);
            d.addChild(c);
            return d
        };
    UI._showGameConferenceAnimation = function (a, b) {
        var c = $("#gameConferenceAnimationDialog"),
            g = GameManager.company.booths.first(function (a) {
                return a.standFactor ==
                    GameManager.company.conferenceStandFactor
            });
        c.find(".windowTitle").text(4 != g.id ? "Game Convention: G3".localize("heading") : "{0} Convention".localize("heading").format(GameManager.company.name));
        if (g) {
            c.find(".conventionImageFloor").attr("src", g.floorImage);
            c.find(".conventionImageBg").attr("src", g.bgImage);
            var k = c.find(".conventionImageFg");
            g.fgImage ? (k.show(), k.attr("src", g.fgImage)) : k.hide()
        }
        c.find(".okButton").unbind("click").click(UI.closeConferenceAnimationDialog).hide();
        var l = this;
        UI.showModalContent("#gameConferenceAnimationDialog", {
            disableCheckForNotifications: !0,
            onOpen: function () {
                var b = c.find("#animationLayer");
                b.empty();
                l.stage = new createjs.Stage(b[0]);
                l.stage.canvas.height = l.stage.canvas.clientHeight;
                l.stage.canvas.width = l.stage.canvas.clientWidth;
                l.flippingBox = new FlippingCounter.FlippingBox(8, 6);
                l.flippingBox.init();
                l.flippingBox.fill("00000000");
                l.flippingBox.container.x = 41;
                l.flippingBox.container.y = 41;
                b = new createjs.Container;
                b.addChild(FlippingCounter.panel);
                b.addChild(l.flippingBox.container);
                b.x = 190;
                b.scaleX = 0.4;
                b.scaleY = 0.4;
                l.stage.addChild(b);
                l.stage.addChild(d(g.id));
                l.stage.addChild(f(g.id));
                if (3 === g.id) l.stage.addChild(d(g.id, !0)), l.stage.addChild(m(g.id));
                else if (2 === g.id || 4 === g.id) l.stage.addChild(f(g.id, !0)), l.stage.addChild(m(g.id)), l.stage.addChild(m(g.id, !0));
                UI._startGameConferenceAnimations(a.buttonText, g.id)
            },
            onClose: function () {
                GameManager.removeFromActiveNotifications(a);
                var c = a.buttonText,
                    d = c / 1E6 * 0.1 + 1,
                    f = GameManager.company;
                f.currentGame && (f.currentGame.hypePoints += Math.min(200, Math.floor(c /
                    1E6 * 200)));
                for (var g = Sales.getGamesToSell(f), k = 0; k < g.length; k++) void 0 === g[k].confAmount ? g[k].totalSalesCash *= d : 0 < g[k].confAmount && (g[k].totalSalesCash += g[k].confAmount * (d - 1)), g[k].confAmount = 0;
                g = Sales.getConsolesToSell(f);
                for (k = 0; k < g.length; k++) g[k].unitsSold += 1.5 / Sales.consoleUnitPrice * (c / 1E6);
                d = Math.floor(f.fans * (d - Math.floor(d)) / 10);
                0 < d && f.adjustFans(d);
                f.conferenceHype = Math.min(200, Math.floor(c / 1E6 * 200));
                b && b()
            },
            close: !1
        })
    };
    UI.closeConferenceAnimationDialog = function () {
        UI.closeModal()
    };
    var l = [],
        g = 0.9;
    GameManager.addTickListener(function (a) {
        if (l && 0 < l.length) {
            a *= g;
            for (var b = 0; b < l.length; b++) l[b].tick(a, !1);
            UI.stage.update()
        }
    });
    var n = function () {
        g = 1.4
    },
        r = [],
        p = [],
        s = [];
    UI._startGameConferenceAnimations = function (d, f) {
        if (0 === r.length) {
            for (var k = 0; k < a.length; k++) r.push(new createjs.Bitmap(a[k]));
            for (k = 0; k < c.length; k++) s.push(new createjs.Bitmap(c[k]));
            for (k = 0; k < b.length; k++) p.push(new createjs.Bitmap(b[k]))
        }
        var m = $(".simplemodal-data"),
            z = m.find(".animationLayer");
        l = [];
        FlippingCounter._activeUITweens =
            l;
        g = 0.9;
        $(window).on("click", n);
        var B = 1200;
        l.push(createjs.Tween.get(z).wait(0).call(function () {
            UI.flippingBox.fill(0)
        }));
        l.push(createjs.Tween.get(z).wait(B).call(function () {
            UI.flippingBox.fill(Math.round(d / 20))
        }));
        l.push(createjs.Tween.get(z).wait(2 * B).call(function () {
            UI.flippingBox.fill(Math.round(d / 15))
        }));
        l.push(createjs.Tween.get(z).wait(3 * B).call(function () {
            UI.flippingBox.fill(Math.round(d / 10))
        }));
        l.push(createjs.Tween.get(z).wait(4 * B).call(function () {
            UI.flippingBox.fill(Math.round(d / 9))
        }));
        l.push(createjs.Tween.get(z).wait(5 * B).call(function () {
            UI.flippingBox.fill(Math.round(d / 6))
        }));
        l.push(createjs.Tween.get(z).wait(6 * B).call(function () {
            UI.flippingBox.fill(Math.round(d / 4))
        }));
        l.push(createjs.Tween.get(z).wait(7 * B).call(function () {
            UI.flippingBox.fill(Math.round(d / 2.2))
        }));
        l.push(createjs.Tween.get(z).wait(8 * B).call(function () {
            UI.flippingBox.fill(Math.round(d / 1.8))
        }));
        l.push(createjs.Tween.get(z).wait(9 * B).call(function () {
            UI.flippingBox.fill(Math.round(d / 1.2))
        }));
        l.push(createjs.Tween.get(z).wait(10 *
            B).call(function () {
                UI.flippingBox.fill(d)
            }));
        var D = UI.stage.canvas.width,
            E = UI.stage.canvas.height,
            w = 5E3,
            F = 6E4 * B / d;
        3 === f ? (w /= 2, F /= 2) : 4 === f && (w /= 2.5, F /= 2.5);
        B = F;
        for (k = 0; k <= d; k += w) {
            var B = B + F,
                C = u(D, E, f);
            UI.stage.addChild(C);
            l.push(createjs.Tween.get(C).wait(B).to({
                alpha: 0.15
            }, 500))
        }
        k = createjs.Tween.get(z).wait(B).call(function () {
            m.find(".okButton").slideDown("fast");
            $(window).off("click", n);
            l = [];
            FlippingCounter._activeUITweens = l;
            g = 0.9
        });
        l.push(k)
    };
    var u = function (a, b, c) {
        var d, f, g, k, l;
        1 === c ? (l = 1, d = 130 +
            Math.random() * (a - 260 - 62 * l), f = 35 * Math.random() + 415 - 176 * l, g = 283, k = 474) : 2 === c ? (l = 0.625, d = 100 + Math.random() * (a - 200 - 62 * l), f = 30 * Math.random() + 420 - 176 * l, g = 233, k = 531) : 3 === c ? (l = 0.075, f = Math.random(), d = 113 + f * (a - 205 - 62 * l), l *= 4 * Math.abs(0.46 - f) + 1, f = 412 - 176 * l, g = 338, k = 413) : 4 === c && (l = 0.15, f = Math.random(), l *= 4 * Math.abs(0 - f) + 1, d = Math.random() * (a - 62 * l), f = 85 * f + 365 - 176 * l, g = 283, k = 476);
        a = void 0;
        a = 3 > c && d < g || 4 === c && d < g || 3 === c && d > k ? s.pickRandom().clone() : 3 > c && d > k || 4 === c && d > k || 3 === c && d > g ? p.pickRandom().clone() : r.pickRandom().clone();
        a.alpha = 0;
        a.x = d;
        a.y = f;
        a.scaleX = l;
        a.scaleY = l;
        return a
    }
})();