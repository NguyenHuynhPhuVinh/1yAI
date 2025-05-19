(function () {
    UI.showReviewWindow = function (b, c) {
        var d = $("#reviewWindow");
        d.find("#reviewAnimationContainer").empty();
        d.find(".okButton").hide().clickExclOnce(function () {
            k = [];
            m = [];
            UI.closeModal(c)
        });
        UI.showModalContent("#reviewWindow", {
            disableCheckForNotifications: !0,
            onOpen: function () {
                a()
            },
            onClose: function () {
                GameManager.company.activeNotifications.remove(b)
            }
        })
    };
    var a = function () {
        k = [];
        m = [];
        for (var a = $(".simplemodal-data"), c = a.find("#reviewAnimationContainer"), n = GameManager.company.gameLog.last(), r = $("#reviewItemTemplate"),
            p = "Reviews for {0}".localize().format(n.title), s = a.find(".windowTitle").text(p).typewrite({
                type: "return-tween",
                delay: 20,
                soundLoop: "notificationTyping",
                volume: 0.12
            }), p = 20 * p.length, u = 0; u < n.reviews.length; u++) {
            var t = r.clone(),
                q = n.reviews[u];
            t.removeAttr("id");
            t.scoreElement = t.find(".score").css("opacity", 0);
            t.find(".score .stars").css("opacity", 0);
            t.find(".score .award").css("opacity", 0);
            t.scoreContainer = t.find(".scoreContainer");
            t.textElement = t.find(".text").css("opacity", 0);
            t.reviewerElement = t.find(".reviewer").css("opacity",
                0);
            Localization.isRTLLanguage() ? t.css({
                right: 60,
                top: 20 + 120 * u
            }) : t.css({
                left: 60,
                top: 20 + 120 * u
            });
            c.append(t);
            p += b(t, q, p)
        }
        f = 1;
        $(window).on("click", d);
        s.wait(p).call(function () {
            $(window).off("click", d);
            a.find(".okButton").slideDown()
        });
        k.push(s)
    },
        b = function (a, b, d) {
            var f = Localization.isRTLLanguage(),
                p = [],
                s = createjs.Tween.get(a).wait(d);
            a.scoreElement.opacity = 0;
            f ? (a.find(".award").attr("src", "images/misc/icon_starlarge_rtl.png"), a.find(".star.full").attr("src", "images/misc/icon_starfull_rtl.png"), a.find(".star.half").attr("src",
                "images/misc/icon_starhalf_rtl.png"), a.scoreContainer.marginRight = 0) : a.scoreContainer.marginLeft = 0;
            a.find(".starsEmpty").hide();
            var u = createjs.Tween.get(a.scoreElement).wait(d).to({
                opacity: 1
            }),
                t;
            t = f ? createjs.Tween.get(a.scoreContainer).wait(d).to({
                marginRight: Math.floor(80 * Math.random())
            }, 7E3) : createjs.Tween.get(a.scoreContainer).wait(d).to({
                marginLeft: Math.floor(80 * Math.random())
            }, 7E3);
            var q = c(a.scoreElement, b.score, s);
            p.addRange([s, u, t]);
            s.call(function () {
                8 <= b.score && (a.find(".score").css("font-weight",
                    500), a.find(".text").css("font-weight", 600))
            });
            var v = !1,
                A = ["star-m3", "star-m2", "star", "star-p2", "star-p3"];
            a.find(".star").css({
                opacity: 0
            });
            for (var z = a.find(".star.full").css({
                opacity: 0
            }).hide(), B = a.find(".star.half").css({
                opacity: 0
            }).hide(), u = Math.floor(b.score / 2), s = 0; s < u; s++) {
                var D = $(z[s]);
                D.show();
                t = createjs.Tween.get(D).to({
                    opacity: 0,
                    scale: 1
                }).wait(q + d + 150 * s).call(function () {
                    v || (a.find(".starsEmpty").show(), v = !0)
                }).to({
                    opacity: 1
                }).to({
                    scale: 1.5
                }, 150).call(function () {
                    Sound.playSoundOnce(A.pickRandom(),
                        0.2)
                }).to({
                    scale: 1
                }, 150);
                m.push(D);
                p.push(t)
            }
            0 != b.score % 2 && 10 >= b.score && (z = $(B[u]), z.show(), t = createjs.Tween.get(z).to({
                opacity: 0,
                scale: 1
            }).wait(q + d + 150 * s).call(function () {
                v || (a.find(".starsEmpty").show(), v = !0)
            }).to({
                opacity: 1
            }).to({
                scale: 1.5
            }, 150).call(function () {
                Sound.playSoundOnce(A.pickRandom(), 0.18)
            }).to({
                scale: 1
            }, 150), m.push(z), p.push(t));
            s = a.find(".award").css("opacity", 0);
            10 <= b.score && (t = createjs.Tween.get(s).wait(q + d + 150 * u + 20).to({
                opacity: 1
            }), m.push(s), p.push(t));
            q += 150 * u + 20;
            u = a.textElement;
            f ? u.marginRight = 10 : u.marginLeft = 10;
            u.opacity = 0;
            u.text(b.message);
            s = 19;
            t = 40;
            do s -= 1, t = UI.getMeasuredHeight(b.message, s, 500); while (70 < t && 9 < s);
            44 < t && (u.css("transform", "translate(0px,20px)"), a.reviewerElement.css("transform", "translate(0px,10px)"));
            u.css("font-size", s + "pt");
            u.css("opactity", 0);
            t = Math.max(20 * b.message.length, 400);
            z = u.typewrite({
                delay: 20,
                wait: d + q - 400,
                type: "return-tween",
                soundLoop: "notificationTyping",
                volume: 0.12
            });
            s = f ? createjs.Tween.get(u).wait(d + q - 400).to({
                marginRight: 40,
                opacity: 1
            }, 400,
                createjs.Ease.sineOut) : createjs.Tween.get(u).wait(d + q - 400).to({
                    marginLeft: 40,
                    opacity: 1
                }, 400, createjs.Ease.sineOut);
            q += t;
            p.addRange([z, s]);
            m.push(u);
            q += 500;
            u = a.reviewerElement;
            f ? u.marginLeft = 30 : u.marginRight = 30;
            u.opacity = 0;
            s = "... {0}".format(b.reviewerName);
            u.text(s);
            u.css("opactity", 0);
            B = Math.max(20 * s.length, 400);
            z = u.typewrite({
                delay: 20,
                wait: d + q - 400,
                type: "return-tween",
                soundLoop: "notificationTyping",
                volume: 0.12
            });
            s = f ? createjs.Tween.get(u).wait(d + q - 400).to({
                marginLeft: -30,
                opacity: 1
            }, 400, createjs.Ease.sineOut) :
                createjs.Tween.get(u).wait(d + q - 400).to({
                    marginRight: -30,
                    opacity: 1
                }, 400, createjs.Ease.sineOut);
            q += B;
            p.addRange([z, s]);
            m.push(u);
            k.addRange(p);
            m.push(a.scoreElement.show());
            m.push(a.scoreContainer);
            s.wait(t + B).call(function () {
                for (var b = 0; b < p.length; b++) - 1 != k.indexOf(p[b]) && k.remove(p[b]); - 1 != m.indexOf(a.scoreElement) && m.remove(a.scoreElement)
            });
            return q
        },
        c = function (a, b, c) {
            for (var d = 0, f = GameManager.gameId, k = 0; 45 > k; k++)(function (a, k) {
                d += a / 4 * 20;
                c = c.wait(a / 4 * 20).call(function () {
                    if (f == GameManager.gameId) {
                        var c;
                        c = (a + 1) / 45;
                        1 == c ? c = b : (c = b + 9 * Math.random() * (1 - c) * Math.randomSign(), c = Math.floor(c).clamp(1, 10));
                        k.textValue != c && Sound.playSoundOnce("reviewTack", 0.15);
                        k.textValue = c
                    }
                })
            })(k, a);
            return d += 300
        },
        f = 1,
        d = function () {
            f = (f + 0.5).clamp(1, 3)
        },
        k = [],
        m = [];
    GameManager.addTickListener(function (a) {
        if (0 != k.length || 0 != m.length) {
            for (var b = 0; b < m.length; b++) {
                var c = m[b];
                c.textValue != c.currentText && (c.text(c.textValue), c.currentText = c.textValue);
                c.scale != c.currentScale && (c.css("transform", "scale({0})".format(c.scale)), c.currentScale =
                    c.scale);
                c.opacity != c.currentOpacity && (c.css("opacity", c.opacity), c.currentOpacity = c.opacity);
                c.marginLeft != c.currentMarginLeft && (c.css("margin-left", c.marginLeft), c.currentMarginLeft = c.marginLeft);
                c.marginRight != c.currentMarginRight && (c.css("margin-right", c.marginRight), c.currentMarginRight = c.marginRight)
            }
            for (b = 0; b < k.length; b++) k[b].tick(a * f)
        }
    }, !1)
})();