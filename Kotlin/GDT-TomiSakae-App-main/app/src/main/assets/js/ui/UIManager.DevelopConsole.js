(function () {
    var a;
    UI.showDevelopConsoleMenu = function (d, f) {
        $(".selectionOverlayContainer").hide();
        var n = $("#createConsoleMenu");
        n.find(".consoleName")[0].value = "Console Name".localize();
        var r = {
            disableCheckForNotifications: !0,
            close: !0,
            onClose: function () {
                m();
                GameManager.removeFromActiveNotifications(d);
                GameManager.resume(!0);
                f && f()
            }
        };
        n.find(".dialogNextButton").clickExcl(function () {
            $("#createConsoleMenu").find(".dialogNextButton").effect("shake", {
                times: 2,
                distance: 5
            }, 50)
        });
        n.find(".dialogBackButton").clickExcl(function () {
            Sound.click();
            m();
            $("#createConsoleMenu").find(".dialogScreen1").transition({
                "margin-left": 0
            });
            $("#createConsoleMenu").find(".dialogScreen2").transition({
                "margin-left": "100%"
            })
        });
        var p = n.find(".consoleQASlider");
        p.empty();
        var s = $('<div class="budgetSlider"></div>').slider({
            orientation: "horizontal",
            range: "min",
            min: 0,
            max: 100,
            value: 0,
            animate: "fast",
            slide: function (a, b) {
                var c = $(b.handle).closest(".budgetSlider");
                if (!c.hasClass("budgetSlider")) throw "couldn't find target slider";
                c.slider("value", b.value);
                k()
            }
        });
        p.append(s);
        p = n.find(".consoleSliderContainer");
        p.empty();
        s = $('<div class="consoleVariationContainer royalSlider rsDefaultInv"></div>');
        p.append(s);
        for (var u = GameManager.company.licencedPlatforms.count(function (a) {
            return a.isCustom
        }) + 1, p = b(), t = 0; t < p.length; t++) {
            var q = $("<div><img src='images/platforms/superb/{0}' style='width:200px;'/><div class='sliderTabCaption rsTmb'>".format(p[t]) + PlatformShim.toStaticHtml("Variation {0}".localize().format(t + 1)) + "</div></div>");
            s.append(q)
        }
        PlatformShim.ISWIN8 && s.gdSlider();
        r.onOpen = function () {
            PlatformShim.ISWIN8 || s.gdSlider();
            UI.maxFont(n.find("bolder", ".dialogScreen1Title"), 34);
            UI.maxFont(n.find("bolder", ".dialogScreen2Title"), 34);
            UI.maxFont(n.find(void 0, ".windowMainActionButton"), 34);
            c();
            k()
        };
        var v = n.find(".okButton");
        v.clickExcl(function () {
            var b = k();
            Sound.click();
            if (b > GameManager.company.cash) v.parent().effect("shake", {
                times: 2,
                distance: 5
            }, 50), $(".simplemodal-data").find(".windowCostLabel").effect("pulsate", {
                times: 2
            });
            else {
                v.off("click");
                var c = n.find(".consoleName")[0].value,
                    d = n.find(".rsActiveSlide img").attr("src"),
                    f = a.filter(function (a) {
                        return void 0 != a.techLevel
                    }).average(function (a) {
                        return a.techLevel
                    }),
                    g = Math.floor(500 * f),
                    l = n.find(".budgetSlider").slider("value") / 100,
                    d = {
                        id: "custom console",
                        pointsCost: g,
                        name: c,
                        iconUri: d,
                        targetZone: 0,
                        techLevel: f,
                        version: u,
                        variation: parseInt(d.slice(38, 39)),
                        qF: l,
                        features: a.map(function (a) {
                            return a.id
                        })
                    };
                GameManager.company.adjustCash(-b, "{0} costs".localize().format(c));
                GameManager.startProject(d);
                UI.closeModal()
            }
        });
        UI.showModalContent("#createConsoleMenu",
            r)
    };
    var b = function () {
        for (var a = [], c = 1; 5 > c && (GameManager.company.flags["console" + c + "Used"] || (a = 4 === c ? a.concat(["CustomPlatform" + c + "V1.png", "CustomPlatform" + c + "V2.png"]) : a.concat(["CustomPlatform" + c + "V1.png", "CustomPlatform" + c + "V2.png", "CustomPlatform" + c + "V3.png"]), 6 !== a.length)); c++);
        if (0 === a.length) {
            for (c = 1; 5 > c; c++) GameManager.company.flags["console" + c + "Used"] = void 0;
            return b()
        }
        return a
    },
        c = function () {
            var a = $(".simplemodal-data").find(".dialogNextButton");
            a.clickExcl(function () {
                Sound.click();
                PlatformShim.execUnsafeLocalFunction(function () {
                    f();
                    k()
                });
                $("#createConsoleMenu").find(".dialogScreen1").transition({
                    "margin-left": "-200%"
                });
                $("#createConsoleMenu").find(".dialogScreen2").transition({
                    "margin-left": 0
                })
            });
            a.removeClass("baseButton").addClass("selectorButton").addClass("orangeButton")
        },
        f = function () {
            var b = $(".simplemodal-data").find(".featureSelectionContainer"),
                c = General.getAvailableFeaturesForConsole().groupBy(function (a) {
                    return a.category
                }),
                d = c.filter(function (a) {
                    return "Graphic" === a.category
                }),
                c = d.concat(c.except(d));
            b.empty();
            a = [];
            for (var d = null, f = [], m = function (c, d) {
                if (c.hasClass("selectedFeature")) {
                    if ("graphic-type" === d.group) return;
                    c.removeClass("selectedFeature");
                    a.remove(d)
                } else {
                    if (d.group) {
                        var g = ".radioButton" + f.indexOf(d.group);
                        b.find(g).removeClass("selectedFeature");
                        for (var g = a.filter(function (a) {
                            return a.group === d.group
                        }), m = 0; m < g.length; m++) a.remove(g[m])
                    }
                    c.addClass("selectedFeature");
                    a.push(d);
                    UI._updateGameDefinitionCost()
                }
                k()
            }, s = 0; s < c.length; s++) {
                var u = c[s];
                u.category != d && (b.append($('<div class="featureSelectionCategoryHeading">{0}</div>'.format(u.categoryDisplayName ?
                    u.categoryDisplayName : u.category))), d = u.category);
                var t = UI.generateFeatureElement(u);
                t.find(".featureContent").text("{0} ({1})".format(u.name, UI.getShortNumberString(100 * Research.getEngineCost(u))));
                if (u.group) {
                    -1 == f.indexOf(u.group) && f.push(u.group);
                    var q = "radioButton" + f.indexOf(u.group);
                    t.addClass(q)
                } (function (a, b) {
                    a.clickExcl(function () {
                        m(a, b)
                    })
                })(t, u);
                b.append(t);
                GameManager.uiSettings.selectedConsoleFeatures && -1 != GameManager.uiSettings.selectedConsoleFeatures.indexOf(u.id) ? m(t, u) : a.some(function (a) {
                    return "Graphic" ===
                        a.category
                }) || m(t, u)
            }
            UI.createDraggable(b);
            k()
        },
        d = function () {
            return a && 0 != a.length ? a.sum(function (a) {
                return 100 * Research.getEngineCost(a)
            }) : 0
        },
        k = function () {
            var a = $(".simplemodal-data"),
                b;
            b = 1E7 + d();
            var c, f = a.find(".budgetSlider").slider("value") / 100;
            c = (f /= 1) * f;
            f *= c;
            c = Math.floor(1 + 19 * (0 + 1 * (-0.5 * f * c + 3 * c * c + -3.5 * f + 2 * c)));
            c *= 1E6;
            b += c;
            a = a.find(".windowCostLabel");
            UI.maxFont(void 0, a, 20, "Cost: {0}".localize().format(UI.getShortNumberString(b)));
            return b
        },
        m = function () {
            a && (GameManager.uiSettings.selectedConsoleFeatures =
                a.map(function (a) {
                    return a.id
                }))
        };
    UI.createConsoleClick = function () {
        Sound.click()
    }
})();