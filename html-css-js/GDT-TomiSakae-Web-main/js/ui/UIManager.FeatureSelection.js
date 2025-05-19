(function () {
    UI.getDevStageSliderValues = function (a) {
        return GameManager.uiSettings["stage{0}SliderValues".format(a)]
    };
    UI.selectedFeatures = [];
    var a = [],
        b = [],
        c = 0,
        f = [],
        d = [];
    UI.showFeatureList = function (g, p) {
        var r = GameManager.company.currentGame.isStaffResponsibilityEnabled();
        UI.selectedFeatures = [];
        a = [];
        b = [];
        f = [];
        d = [];
        for (var q = UI.getDevStageSliderValues(GameManager.getCurrentDevStage()), v = 0; v < g.length; v++) UI.selectedFeatures.push(g[v]);
        PlatformShim.execUnsafeLocalFunction(function () {
            var c = $("#selectFeatureMenu");
            c.empty();
            var d = $("#selectFeatureMenuTemplate").clone();
            d.find(".focusSliderStaffName").css("opacity", 0);
            var f = GameManager.company.currentGame;
            d.find(".featureWindowTitle").text("Development Stage {0}".localize().format(GameManager.getCurrentDevStage()));
            d.find(".gameName").text(f.title);
            f.secondGenre ? d.find(".topicGenre").text(f.topic.name + "/" + f.genre.name + "-" + f.secondGenre.name) : d.find(".topicGenre").text(f.topic.name + "/" + f.genre.name);
            d.find(".featureDurationPreview").each(function (b, c) {
                var d =
                    $(c);
                a.push(d)
            });
            d.find(".focusSliderWrapper").each(function (a, c) {
                var d = $(c);
                r && l(d.find(".focusSliderStaffName"), g[a]);
                b.push(d);
                d.value = q[a];
                d.find(".focusSlider").slider({
                    orientation: "vertical",
                    range: "min",
                    min: 0,
                    max: 100,
                    value: q[a],
                    animate: !1,
                    slide: function (a, b) {
                        d.value = b.value;
                        UI._updateFeatureFocusPreview()
                    }
                });
                d.find(".focusSliderTitle")[0].innerText = "{0} Lvl. {1}".localize("{0} feature name, {1} lvl number").format(g[a].name, LevelCalculator.getMissionLevel(g[a]));
                var p = d.find(".focusSliderHint"),
                    u = "";
                if (GameManager.areHintsEnabled()) {
                    var v = Knowledge.getMissionWeightingHint(Missions.getMissionWithId(g[a].id), f);
                    v && (u = v.hint, v.exactMatch ? p.removeClass("unsure") : (p.addClass("unsure"), u += " ?"))
                }
                p.text(u);
                r && d.droppable({
                    hoverClass: "dragHover",
                    tolerance: "pointer",
                    drop: function (b, c) {
                        var d = $(this).find(".focusSliderStaffName"),
                            f = d.text(),
                            l, p = void 0;
                        c.draggable.hasClass("focusSliderStaffName") ? (l = c.draggable.text(), p = c.draggable) : l = c.draggable.find(".staffName,").text();
                        k(d, l) && (m(g[a], l), p && (k(p,
                            f), d = m, p = p.parent(".focusSliderWrapper"), p = p.hasClass("feature1") ? 0 : p.hasClass("feature2") ? 1 : p.hasClass("feature3") ? 2 : void 0, d(g[p], f)), n())
                    }
                })
            });
            c.append(d)
        });
        UI.showModalContent("#selectFeatureMenu", {
            close: !1,
            onOpen: function () {
                var a = $(".simplemodal-data"),
                    b = $("#canvasScrollContainer").width(),
                    f = $("#simplemodal-container");
                f.removeClass("smallScreenPopup");
                1024 >= b && (f.addClass("smallScreenPopup"), b = f.width(), f = f.height(), b = 0.9 * (0.5 * window.innerWidth - 0.5 * b), f = 0.9 * (0.5 * window.innerHeight - 0.5 * f), $("#simplemodal-container").css({
                    zoom: "90%",
                    left: b,
                    top: f
                }));
                c = a.find(".featureDurationPreviewWrapper").width();
                GameManager.company.currentGame.isStaffResponsibilityEnabled() ? UI._updateStaffListForFeatures() : GameManager.company.currentGame.flags.featureResponsibility = {};
                var k = !1,
                    l = function () {
                        var b = UI.getShortNumberString(UI._getGameFeatureCosts());
                        a.find(".featureSelectionPanel .cost").text("Cost: {0}".localize().format(b))
                    },
                    m = GameManager.company.currentGame.features.map(function (a) {
                        return a.id
                    }),
                    f = UI._updateFeatureListContainer({
                        readOnly: !1,
                        categories: g.map(function (a) {
                            return a.id
                        }),
                        filter: function (a) {
                            return "graphic-type" != a.group || -1 != m.indexOf(a.id)
                        },
                        onChange: function () {
                            l();
                            k && UI._updateFeatureFocusPreview()
                        }
                    });
                l();
                k = !0;
                a.find(".featureSelectionCategoryHeading").each(function (a, b) {
                    var c = $(b);
                    c.missionId = c.attr("mission-id");
                    d.push(c)
                });
                0 < f && a.find(".featureSelectionPanel").delay(200).queue(function () {
                    $(this).removeClass("featureSelectionPanelHiddenState").addClass("featureSelectionShowState");
                    $(this).dequeue()
                });
                r && (a.find(".featureStaffAsignPanel").delay(200).queue(function () {
                    $(this).removeClass("hidden").addClass("showState");
                    $(this).dequeue()
                }), a.find(".focusSliderStaffName").draggable({
                    helper: "clone",
                    zIndex: 7E3,
                    appendTo: a,
                    start: function (a, b) {
                        b.helper.addClass("staffItemBorder")
                    }
                }));
                UI.maxFont(a.find("bolder", ".featureWindowTitle"), 34);
                UI.maxFont(a.find(void 0, ".feature1").find(".focusSliderTitle"), 16);
                UI.maxFont(a.find(void 0, ".feature2").find(".focusSliderTitle"), 16);
                UI.maxFont(a.find(void 0, ".feature3").find(".focusSliderTitle"), 16);
                UI.maxFont(a.find("bolder", ".featureSelectionPanel").find(".windowTitle"), 22);
                UI._updateFeatureFocusPreview()
            },
            onClose: p.onClose,
            disableCheckForNotifications: !0
        })
    };
    var k = function (a, b) {
        if (a.text() != b) return a.transition({
            opacity: 0
        }, null, null, function () {
            a.text(b).transition({
                opacity: 1
            }, 400)
        }), !0;
        a.effect("pulsate", {
            times: 1
        });
        return !1
    },
        m = function (a, b) {
            var c = GameManager.company,
                d = c.currentGame,
                c = c.staff.first(function (a) {
                    return a.name == b
                });
            d.flags.featureResponsibility[a.id] = c ? c.id : null
        },
        l = function (a, b) {
            var c = GameManager.company,
                d = c.currentGame.flags.featureResponsibility,
                f = !1;
            if (d.hasOwnProperty(b.id)) {
                var g =
                    d[b.id];
                if (c = c.staff.first(function (a) {
                    return a.id === g
                })) a.text(c.name).css("opacity", 1), f = !0
            }
            f || a.text("Drag staff here".localize()).css("opacity", 1).delay(800).queue(function () {
                $(this).effect("pulsate", {
                    times: 1
                });
                $(this).dequeue()
            })
        };
    UI._updateStaffListForFeatures = function () {
        var a = GameManager.company,
            b = $(".simplemodal-data"),
            c = b.find(".staffListContainer");
        c.empty();
        for (var a = a.staff, d = 0; d < a.length; d++) {
            var g = a[d],
                k, l = g;
            k = $("#staffListItemTemplate").clone();
            k.removeAttr("id");
            k.find(".staffName").text(l.name);
            if (l.flags.expert) {
                var m = "({0})".format(Missions.getMissionWithId(l.flags.expert).name),
                    n = UI._getMaxFontSize("{0}pt {1}", UI.IS_SEGOE_UI_INSTALLED ? "Segoe UI" : "Open Sans", 11, 7, 75, 50, [m]),
                    p = k.find(".specialization");
                p.text(m);
                11 > n && p.css("font-size", n + "pt")
            }
            m = Math.floor(500 * l.designFactor);
            k.find(".design").html("{0}<span>{1}</span>".format("Design: ".localize(), m));
            l = Math.floor(500 * l.technologyFactor);
            k.find(".technology").html("{0}<span>{1}</span>".format("Tech.: ".localize(), l));
            n = UI._getMaxFontSize("bold {0}pt {1}",
                UI.IS_SEGOE_UI_INSTALLED ? "Segoe UI" : "Open Sans", 11, 7, 75, 50, ["Design: ".localize(), "Tech.: ".localize()]);
            11 > n && k.css("font-size", n + "pt");
            k.draggable({
                helper: "clone",
                zIndex: 7E3,
                appendTo: b
            });
            f.push({
                staffName: g.name,
                element: k,
                workLoadElement: k.find(".workload"),
                captionElement: k.find(".responsibility")
            });
            c.append(k)
        }
    };
    var g = [];
    GameManager.addTickListener(function () {
        if (0 != g.length) {
            for (var a = 0; a < g.length; a++) {
                var b = g[a],
                    c = {};
                b.width && (c.width = b.width);
                b.background && (c.background = b.background);
                b.css(c);
                b.textValue && b.text(b.textValue)
            }
            g = []
        }
    }, !1);
    UI._updateFeatureFocusPreview = function () {
        for (var b = UI._getSelectedFeaturePercentages(), d = 0; d < a.length; d++) {
            var f = a[d];
            f.width && (f.width = b[d] / 100 * c + "px");
            g.push(f)
        }
        GameManager.company.currentGame.isStaffResponsibilityEnabled() && n(b);
        r(b)
    };
    var n = function (a, b) {
        a || (a = UI._getSelectedFeaturePercentages());
        var c = GameManager.company,
            d = c.currentGame;
        if (d.isStaffResponsibilityEnabled()) {
            for (var k = {}, l = 0; l < c.staff.length; l++) {
                var m = c.staff[l];
                m.flags.workload || (m.flags.workload =
                    0);
                for (var n = k[m.id] ? workloads[m.id] : m.flags.workload, p = 0; p < UI.selectedFeatures.length; p++) {
                    var r = d.flags.featureResponsibility[UI.selectedFeatures[p].id];
                    void 0 !== r && r === m.id && (n += a[p])
                }
                k[m.id] = n;
                n *= 100 / (300 / General.getOptimalTeamSize(d));
                p = f.first(function (a) {
                    return a.staffName == m.name
                });
                r = p.workLoadElement;
                r.width = n.clamp(0, 100) + "%";
                var w = ((n - 100) / 50).clamp(0, 1);
                r.background = createjs.Graphics.getHSL(120 - 120 * w, 100, 60, 0.5); - 1 == g.indexOf(r) && g.push(r);
                p.captionElement.textValue = "{0}%".format(Math.round(n)); -
                    1 == g.indexOf(p.captionElement) && g.push(p.captionElement)
            }
            if (b)
                for (l = 0; l < c.staff.length; l++) m = c.staff[l], k.hasOwnProperty(m.id) && (m.flags.workload = k[m.id])
        }
    },
        r = function (a) {
            for (var b = UI._getSelectedFeatures(), c = 0; c < UI.selectedFeatures.length; c++) {
                var f = UI.selectedFeatures[c],
                    k = UI.selectedFeatures[c].id,
                    l = b.filter(function (a) {
                        return a.category === k
                    }),
                    m = General.getFeatureEfficiencyFromMissionFocus(GameManager.company.currentGame, l, a[c]),
                    m = Math.round(m);
                if (l = d.first(function (a) {
                    return a.missionId === f.id
                })) m =
                    100 === m ? f.name : "{0} ({1}%)".format(f.name, Math.round(m)), l.textValue != m && (l.textValue = m, -1 == g.indexOf(l) && g.push(l))
            }
        };
    UI._getSelectedFeaturePercentages = function () {
        var a = UI._getSelectedSliderValues(),
            b = a.sum();
        return 0 == b ? [100 / 3, 100 / 3, 100 / 3] : a.map(function (a) {
            return a / (b / 70) + 10
        })
    };
    UI._getSelectedSliderValues = function () {
        return b.map(function (a) {
            return a.value
        })
    };
    var p = function () {
        var a = $(".simplemodal-data"),
            b = [],
            c = GameManager.company;
        a.find(".focusSliderStaffName").each(function (a, d) {
            var f = $(d),
                g =
                    f.text();
            c.staff.first(function (a) {
                return a.name == g
            }) || b.push(f)
        });
        return 0 < b.length ? b : !1
    };
    UI.featuresSelectedClick = function () {
        Sound.click();
        var a = GameManager.company.currentGame,
            b = $(".simplemodal-data");
        if (a.isStaffResponsibilityEnabled()) {
            var c = p();
            if (c) {
                $(c).each(function (a, b) {
                    b.effect("pulsate", {
                        times: 3
                    })
                });
                b.find(".okButton").parent().effect("shake", {
                    times: 2,
                    distance: 5
                }, 50);
                return
            }
        }
        for (var c = GameManager.getCurrentDevStage(), d = UI.getDevStageSliderValues(c), f = UI._getSelectedSliderValues(), g = 0; g <
            f.length; g++) d[g] = f[g];
        d = UI._getSelectedFeaturePercentages();
        for (g = 0; g < d.length; g++) UI.selectedFeatures[g].percentage = d[g];
        g = UI._getGameFeatureCosts();
        0 != g && GameManager.company.adjustCash(-g, "Dev. stage {0}".localize().format(c));
        var g = UI._getSelectedFeatures(),
            k = a.features.map(function (a) {
                return a.id
            });
        a.features.addRange(g.filter(function (a) {
            return -1 == k.indexOf(a.id)
        }));
        3 === c && (GameManager.uiSettings.selectedGameFeatures = a.features.map(function (a) {
            return a.id
        }));
        b.find(".featureSelectionPanel").removeClass("featureSelectionShowState").addClass("featureSelectionPanelHiddenState");
        b.find(".featureStaffAsignPanel").removeClass("showState").addClass("hidden");
        b.delay(200).queue(function () {
            UI.closeModal(function () {
                n(null, !0);
                GameManager.executeFeatures(UI.selectedFeatures)
            });
            $(this).dequeue()
        })
    }
})();