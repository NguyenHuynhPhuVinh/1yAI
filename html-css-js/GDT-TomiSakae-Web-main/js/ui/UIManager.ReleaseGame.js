(function () {
    UI._showReleaseGame = function (a, b) {
        for (var c = GameManager.company.staff.filter(function (a) {
            return !0
        }), f = 0; f < c.length; f++) c[f].state === CharacterState.Working && (c[f].state = CharacterState.Idle, c[f].currentFeature = null), c[f].resetLeftOverPoints();
        VisualsManager.gameStatusBar.endDevelopment();
        GameManager.company.currentGame ? UI.showReleaseGameDialog({
            disableCheckForNotifications: !0,
            onClose: function () {
                Research.checkForNewResearch();
                GameManager.removeFromActiveNotifications(a);
                GameManager.notifyIdleState();
                b && b()
            }
        }) : (GameManager.resume(!0), Research.checkForNewResearch(), GameManager.removeFromActiveNotifications(a), GameManager.notifyIdleState(), b && b())
    };
    UI.showReleaseGameDialog = function (a) {
        var b = $("#releaseGameDialog"),
            c = GameManager.company.currentGame;
        b.find(".releaseGameNameDisplay").text("{0}".localize("{0} game name").format(c.title));
        b.find(".releaseGameNameInput").attr("value", "{0}".localize("{0} game name").format(c.title));
        b.find(".okButton").hide();
        b.find(".trashGameButton").unbind("click").click(UI.trashGameClick).hide();
        b.find(".releaseGameNameEditButton").unbind("click").click(UI.releaseGameNameEditButtonClick);
        b.find(".releaseGameNameEditOKButton").unbind("click").click(UI.releaseGameNameEditOKButtonClick);
        b.find(".pointsContainer").hide();
        b.find(".pointsNewRecord").hide();
        b.find(".xpTitle").hide();
        b.find(".xpBonus").hide();
        UI.showModalContent("#releaseGameDialog", {
            onOpen: function () {
                UI._startReleaseGameDialogAnimations()
            },
            onClose: a.onClose,
            disableCheckForNotifications: a.disableCheckForNotifications
        })
    };
    UI.releaseGameNameEditButtonClick =
        function () {
            var a = $(".simplemodal-data");
            a.find(".gameNameDisplay").transit({
                opacity: 0
            }, 500);
            var b = a.find(".gameNameEdit");
            b.show().css("opacity", 0).transit({
                opacity: 1
            }, 500);
            setTimeout(function () {
                b.focus()
            }, 100)
        };
    UI.releaseGameNameEditOKButtonClick = function () {
        var a = $(".simplemodal-data"),
            b = a.find(".releaseGameNameInput")[0].value;
        b && (a.find(".gameNameDisplay").transit({
            opacity: 1
        }, 500), a.find(".gameNameEdit").transit({
            opacity: 0
        }, 500, null, function () {
            a.find(".gameNameEdit").hide()
        }), a.find(".releaseGameNameDisplay").text(b),
            GameManager.company.currentGame.title != b && (GameManager.company.currentGame.flags.hasCustomName = !0), GameManager.company.currentGame.title = b)
    };
    var a = [],
        b = 1;
    GameManager.addTickListener(function (c) {
        if (a && 0 < a.length) {
            c *= b;
            for (var f = 0; f < a.length; f++) {
                var m = a[f],
                    l = m._target;
                l.klug_progress && l.progressbar({
                    value: l.klug_progress
                });
                l.css_width_percent && l.css({
                    width: l.css_width_percent + "%"
                });
                if (l.klug_int_text) {
                    var g = Math.floor(l.klug_int_text);
                    l.text(g)
                }
                l.klug_number_int_text && (g = Math.floor(l.klug_number_int_text),
                    l.text(0 == g ? g : 0 < g ? "+" + g : "-" + g));
                m.tick(c, !1)
            }
        }
    });
    var c = function () {
        b = 5
    },
        f;
    UI._startReleaseGameDialogAnimations = function () {
        var d = GameManager.gameId,
            k = GameManager.company,
            m = $(".releaseGameFeatureTemplate"),
            l = $(".simplemodal-data"),
            g = l.find(".featuresContainer");
        g.empty();
        a = [];
        b = 1;
        var n = 0,
            r = k.currentGame,
            p = r.featureLog.first().lastUpdate,
            s = new MersenneTwister(p),
            u = 0 < k.gameLog.length && !k.gameLog.some(function (a) {
                return a.technologyPoints > r.technologyPoints
            }),
            t = 0 < k.gameLog.length && !k.gameLog.some(function (a) {
                return a.designPoints >
                    r.designPoints
            }),
            p = l.find(".technologyPoints"),
            q = l.find(".designPoints");
        p.klug_int_text = 0;
        q.klug_int_text = 0;
        a.push(createjs.Tween.get(p).wait(200).call(function () {
            $(window).on("click", c)
        }));
        Sound.playSoundLoop("pointCount", 1);
        var v = createjs.Tween.get(p).to({
            klug_int_text: r.technologyPoints
        }, 1800).call(function () {
            u && d == GameManager.gameId && (Sound.playSoundOnce("newRecord", 0.7), UI.maxFont("bold", l.find(".technologyPointsNewRecord"), 16), l.find(".technologyPointsNewRecord").fadeIn().effect("pulsate", {
                times: 3
            }), l.find(".pointDisplayContainer").transition({
                height: 120
            }), l.find(".featuresContainer").transition({
                height: 250
            }))
        });
        a.push(v);
        v = createjs.Tween.get(q).to({
            klug_int_text: r.designPoints
        }, 1800).call(function () {
            if (t) {
                if (d != GameManager.gameId) return;
                Sound.playSoundOnce("newRecord", 0.7);
                UI.maxFont("bold", l.find(".designPointsNewRecord"), 16);
                l.find(".designPointsNewRecord").fadeIn().effect("pulsate", {
                    times: 3
                });
                l.find(".pointDisplayContainer").transition({
                    height: 120
                });
                l.find(".featuresContainer").transition({
                    height: 250
                })
            }
            Sound.stopSound("pointCount")
        });
        a.push(v);
        n += 1800;
        q = [];
        r.flags.isNewTopic && q.push({
            bonus: 0.2,
            label: "New Topic".localize()
        });
        r.flags.isNewCombination && q.push({
            bonus: 0.3,
            label: "New Combo".localize()
        });
        r.isStaffResponsibilityEnabled() && (k.staff.count(function (a) {
            return r.getRatioWorked(a) && 101 <= General.getEffectiveWorkload(a, r)
        }) || q.push({
            bonus: 0.3,
            label: "Good Management".localize()
        }));
        var A = 1 + q.sum(function (a) {
            return a.bonus
        }),
            z = "",
            B = l.find(".xpBonusModifier").hide();
        if (1 != A) {
            for (var D = 1, v = createjs.Tween.get(B).wait(n), p = 0; p < q.length; p++)(function (a,
                b) {
                v = v.wait(1200 * b).call(function () {
                    d == GameManager.gameId && (D += a.bonus, 0 != b && (z += ", "), z += a.label, B.text("(Bonus: x{0} - {1})".localize("{0} bonusMultiplier, {1} label").format(Math.roundToDecimals(D, 2), z)), B.effect("pulsate", {
                        times: 2
                    }))
                })
            })(q[p], p), n += 1200;
            a.push(v)
        }
        p = General.getGameSizeDurationFactor(r.gameSize);
        1 < p && (p *= 0.7);
        for (var A = A * p, E = [], w = r.features, p = 0; p < r.featureLog.length; p++) {
            var F = r.featureLog[p];
            if ("mission" == F.missionType) {
                var C = General.getMission(F.id),
                    J = C.percentage ? C.percentage /
                        100 : 1,
                    q = (150 + 45 * s.random()) * A,
                    q = 0.3 * q + 0.7 * q * J,
                    q = 0.75 * q,
                    q = {
                        originalItem: C,
                        name: C.name,
                        level: LevelCalculator.getLevel(C.experience),
                        progress: LevelCalculator.getProgressToNextLevel(C.experience),
                        xpGain: q,
                        progressColor: "orange",
                        progressGainColor: "#FFC456",
                        cssClass: "gameFeatureXPBar"
                    };
                q.newLevel = LevelCalculator.getLevel(C.experience + q.xpGain);
                q.progressGain = LevelCalculator.getProgressToLevel(q.level + 1, C.experience + q.xpGain) - q.progress;
                E.push(q);
                for (var K = w.filter(function (a) {
                    return a.showXPGain && a.category ===
                        F.id
                }), L = 0; L < K.length; L++) C = General.getFeature(K[L].id), q = (270 + 81 * s.random()) * A, q = 0.3 * q + 0.7 * q * J, q *= 0.75, q = {
                    originalItem: C,
                    name: C.name,
                    level: LevelCalculator.getLevel(C.experience),
                    progress: LevelCalculator.getProgressToNextLevel(C.experience),
                    xpGain: q,
                    progressColor: "#00BFFF",
                    progressGainColor: "#8CE2FF",
                    cssClass: "relatedGameFeatureXPBar"
                }, q.newLevel = LevelCalculator.getLevel(C.experience + q.xpGain), q.progressGain = LevelCalculator.getProgressToLevel(q.level + 1, C.experience + q.xpGain) - q.progress, E.push(q)
            }
        }
        if (k.flags.pirateMode)
            for (w =
                r.features.filter(function (a) {
                    return "DRM" == a.category
                }), p = 0; p < w.length; p++) C = w[p], q = (270 + 81 * s.random()) * A, q = 0.4 * q + 0.4 * q * s.random(), q *= 0.75, q = {
                    originalItem: C,
                    name: C.name,
                    level: LevelCalculator.getLevel(C.experience),
                    progress: LevelCalculator.getProgressToNextLevel(C.experience),
                    xpGain: q,
                    progressColor: "#404040",
                    progressGainColor: "gray",
                    cssClass: "drmTechXPBar"
                }, q.newLevel = LevelCalculator.getLevel(C.experience + q.xpGain), q.progressGain = LevelCalculator.getProgressToLevel(q.level + 1, C.experience + q.xpGain) -
                q.progress, E.push(q);
        for (var H = [], G = [], p = 0; p < k.staff.length; p++) q = k.staff[p], r.getRatioWorked(q) && function (a) {
            var b = a.experience,
                c = LevelCalculator.getLevel(b),
                d = (80 + 32 * s.random()) * A,
                f = r.getRatioWorked(a),
                d = d * f.clamp(0, 1),
                d = 0.75 * d,
                f = General.getEffectiveWorkload(a, r);
            void 0 != f && (isNaN(f) ? d *= 0.1 : (f = 0.5 * (1 - 1 * (Math.abs(f - 100) / 100)).clamp(0, 1), d += d * f));
            f = {
                originalItem: a,
                name: a.name,
                level: c,
                progress: LevelCalculator.getProgressToNextLevel(b),
                xpGain: d,
                newLevel: LevelCalculator.getLevel(b + d),
                progressColor: "firebrick",
                progressGainColor: "red",
                cssClass: "staffXPBar",
                apply: function () {
                    a.experience += d;
                    var b = LevelCalculator.getLevel(a.experience);
                    if (b != c) {
                        a.qualityFactor = b / 5;
                        if (0 != a.id) {
                            var f = (b - c) * Character.BASE_SALARY_PER_LEVEL,
                                f = f + 0.4 * f * k.getRandom(),
                                f = 1E3 * Math.floor(f / 1E3);
                            a.salary += f;
                            H.push({
                                staff: a,
                                value: f
                            })
                        }
                        5 == b && (Tutorial.staffReachedLvl5(), -1 == G.indexOf(a) && G.push(a))
                    }
                }
            };
            f.progressGain = LevelCalculator.getProgressToLevel(f.level + 1, b + f.xpGain) - f.progress;
            E.push(f)
        }(q);
        C = 14;
        q = "{0}pt {1}";
        w = UI.IS_SEGOE_UI_INSTALLED ?
            "Segoe UI" : "Open Sans";
        1 < E.count(function (a) {
            return a.level < a.newLevel
        }) && (q = "bold {0}pt {1}", C = UI._getMaxFontSize(q, w, C, 8, 130, 20, ["Level Up!".localize()]));
        J = [];
        K = [];
        for (p = 0; p < E.length; p++) {
            J.push(E[p].name);
            var I = "Lvl. ".localize() + E[p].level;
            0 == K.count(function (a) {
                return a == I
            }) && K.push(I)
        }
        C = UI._getMaxFontSize(q, w, C, 8, 195, 20, J);
        C = UI._getMaxFontSize(q, w, C, 8, 53, 20, K);
        14 == C && (C = void 0);
        for (p = 0; p < E.length; p++) w = m.clone(), void 0 != C && w.css("font-size", C + "pt"), q = E[p],
            function (b, c) {
                b.find(".featureName").text(c.name);
                b.find(".featureLevel").text("Lvl. ".localize() + c.level);
                var f = b.find(".featureLevelUp");
                f.hide();
                b.find(".featureProgress").css({
                    width: c.progress - 1 + "%"
                }).css({
                    "background-color": c.progressColor
                });
                var k = b.find(".featureProgressGain").css({
                    "background-color": c.progressGainColor
                });
                k.css_width_percent = 0;
                var l = b.find(".featureGainCaption");
                l.klug_number_int_text = 0;
                c.cssClass && b.addClass(c.cssClass);
                b.hide();
                v = createjs.Tween.get(b).wait(n).call(function () {
                    d == GameManager.gameId && (g.append(b), Sound.playSoundOnce("tack",
                        0.2), b.slideDown("normal"), g.stop().animate({
                            scrollTop: b.offset().top
                        }, 600))
                });
                a.push(v);
                v = createjs.Tween.get(k).wait(n).to({
                    css_width_percent: c.progressGain
                }, 800);
                a.push(v);
                v = createjs.Tween.get(l).wait(n).to({
                    klug_number_int_text: c.xpGain
                }, 800);
                a.push(v);
                c.newLevel != c.level && (v = createjs.Tween.get(f).wait(n + 800).call(function () {
                    d == GameManager.gameId && (f.show("slow"), Sound.playSoundOnce("levelUp", 0.4), b.find(".featureLevel").text("Lvl. ".localize() + c.newLevel), b.css("font-weight", "bold"))
                }), a.push(v));
                n += 1200
            }(w, q);
        f = function () {
            for (var a = 0; a < E.length; a++) {
                var b = E[a];
                b.apply ? b.apply() : E[a].originalItem.experience += E[a].xpGain
            }
        };
        m = createjs.Tween.get(g).wait(n).call(function () {
            UI.createDraggable(g);
            l.find(".okButton").slideDown("fast").click(function () {
                Sound.click();
                f && (f(), f = null);
                if (0 < H.length) {
                    for (var a = "Due to increase in experience the following staff have earned a raise:".localize() + "\n", b = 0; b < H.length; b++) var c = H[b],
                        d = c.staff,
                        a = a + "{0}{1}: {2} + {3} = {4}".format(4 == b ? "{n}" : "\n", d.name, UI.getShortNumberString(d.salary -
                            c.value), UI.getShortNumberString(c.value), UI.getShortNumberString(d.salary));
                    k.notifications.push(new Notification("Salary increase".localize("heading"), a, {
                        type: NotificationType.AutoPopup
                    }))
                }
                if (0 < G.length) {
                    a = "Special training available for:".localize() + "\n";
                    for (b = 0; b < G.length; b++) c = G[b], a += "{0}{1}".format(4 == b ? "{n}" : "\n", c.name);
                    k.notifications.push(new Notification("Special training".localize("heading"), a, {
                        type: NotificationType.AutoPopup
                    }))
                }
                UI.closeModal();
                General.releaseGame(GameManager.company);
                GameManager.autoSave()
            });
            l.find(".trashGameButton").fadeIn();
            $(window).off("click", c);
            a = [];
            b = 1
        });
        a.push(m)
    };
    UI.trashGameClick = function () {
        Sound.click();
        var a = $("#trashGameConfirmationDialog");
        a.find(".cancelActionButton").clickExclOnce(function () {
            Sound.click();
            a.dialog("close")
        });
        a.find(".confirmActionButton").clickExclOnce(function () {
            Sound.click();
            f && (f(), f = null);
            a.dialog("close");
            UI.closeModal(function () {
                General.trashGame(GameManager.company)
            })
        });
        a.gdDialog({
            popout: !0,
            close: !0
        })
    }
})();