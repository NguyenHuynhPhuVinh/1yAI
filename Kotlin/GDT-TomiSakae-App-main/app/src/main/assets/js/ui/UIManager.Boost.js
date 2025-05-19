(function () {
    UI._resetBoostUI = function () {
        b()
    };
    UI._resetCallbacks.push(UI._resetBoostUI);
    var a = [],
        b = function () {
            $(".charBoost").remove();
            a = [];
            for (var b = VisualsManager.characterOverlays, c = 0; c < b.length; c++) {
                var m = b[c];
                if (0 != m.character.maxBoostLevel) {
                    var l = f(m.x, m.y);
                    m.boostButton = l;
                    (function (a, b) {
                        b.clickExcl(function () {
                            if (!a.onFire && 1 === a.boostRechargeProgress || 1 <= a.boostLevel) Sound.playSoundOnce("boost", 0.065), a.activateBoost(), b.find(".boostButton").removeClass("enabled"), b.enabled = !1;
                            window.event.cancelBubble = !0
                        })
                    })(m.character, l)
                }
            }
        },
        c = ["#00698C", "#007CA5", "#008FBF", "#00A2D8", "deepskyBlue"];
    GameManager.addTickListener(function (a) {
        if (a = VisualsManager.characterOverlays)
            for (var b = 0; b < a.length; b++) {
                var f = a[b],
                    l = f.character,
                    g = f.boostButton;
                if (g) {
                    var n = 0,
                        r = l.boostLevel;
                    l.onFire ? n = l.boostRechargeProgress : (n = l.boostRechargeProgress, (1 == n || 1 <= r) && !g.enabled && (g.find(".boostButton").addClass("enabled"), g.enabled = !0));
                    if (g.boostLevel !== r || g.onFire !== l.onFire) {
                        g.onFire = l.onFire;
                        r ? g.levelElement.text("x" + r) : g.levelElement.text("");
                        g.boostLevel = r;
                        var p, s;
                        switch (r) {
                            case 1:
                                p = c[1];
                                s = c[0];
                                break;
                            case 2:
                                p = c[2];
                                s = c[1];
                                break;
                            case 3:
                                p = c[3];
                                s = c[2];
                                break;
                            case 4:
                                p = c[4];
                                s = c[3];
                                break;
                            case 5:
                                c[4];
                                c[4];
                                break;
                            default:
                                p = c[0], s = "transparent"
                        }
                        f.boostVisual.fgColor = p;
                        f.boostVisual.bgColor = s;
                        f.boostVisual.invalidate()
                    }
                    g.boostValue != n && (f.boostVisual.updateValue(360 * n), f.boostVisual.invalidate())
                }
            }
    }, !0);
    var f = function (b, c) {
        var f = $("#boostButtonTemplate").clone();
        f[0].id = void 0;
        var l = GameFlags.IS_LOW_RES ? -3 : 0;
        f.css({
            position: "absolute",
            top: c + VisualsManager.toScreenCoordinates(-3,
                CanvasManager.globalScale) + "px",
            left: b + VisualsManager.toScreenCoordinates(159 + l, CanvasManager.globalScale) + "px"
        });
        f.addClass("charBoost");
        f.levelElement = f.find(".boostMultiplier");
        $("#canvasContainer").append(f);
        a.push(f);
        return f
    }
})();