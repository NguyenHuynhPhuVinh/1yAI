(function () {
    var a = !1,
        b;
    UI._showGameDefinition = function (b, d, f) {
        if (!f && GameManager.flags.selectGameActive) {
            var g = GameManager.gameId;
            UI.showGameHistory(function () {
                if (g == GameManager.gameId)
                    if (GameManager.flags.selectGameActive = !1, GameManager.flags.selectedGameId) {
                        var a = GameManager.flags.selectedGameId,
                            c = GameManager.company.currentGame,
                            f = GameManager.company.getGameById(a);
                        c.sequelTo = a;
                        c.genre = f.genre;
                        c.secondGenre = f.secondGenre;
                        c.topic = f.topic;
                        c.targetAudience = f.targetAudience;
                        c.gameSize = f.gameSize;
                        GameManager.flags.createPack &&
                            (c.flags.lockedSettings || (c.flags.lockedSettings = {}), c.flags.lockedSettings.topic = !0, c.flags.lockedSettings.genre = !0, c.flags.lockedSettings.platform = !0, c.flags.lockedSettings.targetAudience = !0, c.secondGenre && (c.flags.lockedSettings.secondGenre = !0), c.flags.lockedSettings.mmo = !0, c.flags.mmo = !0, c.platforms = f.platforms.slice());
                        GameManager.flags.selectedGameId = null;
                        UI._showGameDefinition(b, d, !0)
                    } else GameManager.removeFromActiveNotifications(b), GameManager.gameDefinitionCancelled()
            }, !0)
        } else UI.showGameDefinition(GameManager.company, {
            close: !0,
            disableCheckForNotifications: !0,
            onOpen: function () {
                var a = GameManager.company.currentGame;
                a.topic && UI._selectTopic(a.topic.name);
                var b = a.secondGenre;
                a.genre ? UI._selectGenre(a.genre.name) : a.secondGenre || $(".simplemodal-data").find("#pickSecondGenreButton").addClass("selectorButtonInactive windowStepActionButtonDisabled").removeClass("selectorButton windowStepActionButton");
                b && UI._selectGenre(b.name, 2);
                UI._updatePickPlatformButtonStates(a);
                if (a.targetAudience) {
                    var c = a.targetAudience,
                        b = $(".simplemodal-data");
                    b.find(".rating").removeClass("selected");
                    c = b.find("young" === c ? ".ratingY" : "mature" === c ? ".ratingM" : ".ratingE");
                    c.addClass("selected");
                    c.hasClass("rating") && b.find(".ratingLabel").text(p(c))
                }
                a.gameSize && (b = a.gameSize, c = $(".simplemodal-data"), c.find(".gameSizeButton").removeClass("selected"), c.find("small" === b ? ".gameSizeSmall" : "medium" === b ? ".gameSizeMedium" : "large" === b ? ".gameSizeLarge" : ".gameSizeAAA").addClass("selected"));
                a.flags.mmo && (a = a.flags.mmo, b = $(".simplemodal-data").find(".gameGenreMMO"), b.removeClass("selected"),
                    a && b.addClass("selected"));
                UI._updateGameDefinitionCost();
                UI._updateGameDefinitionNextButtonEnabled()
            },
            onClose: function () {
                c && (clearInterval(c), c = void 0);
                a ? GameManager.removeFromActiveNotifications(b) : (GameManager.removeFromActiveNotifications(b), GameManager.gameDefinitionCancelled())
            }
        })
    };
    var c = 0,
        f = function (a) {
            var b;
            a.focus(function () {
                c && clearInterval(c);
                b = Date.now();
                c = setInterval(function () {
                    b && 6E4 <= Date.now() - b && (Achievements.activate(Achievements.writersBlock), GameManager.checkAchievements(), clearInterval(c))
                },
                    1E3)
            });
            a.blur(function () {
                clearInterval(c);
                c = 0
            })
        };
    UI.showGameDefinition = function (c, d) {
        var g = c.currentGame;
        $(".selectionOverlayContainer").hide();
        var k = $(".gameDefinitionContent");
        k.empty();
        var l = $("#gameDefinitionContentTemplate").clone();
        l.find("#gameTitle").attr("value", c.currentGame.title);
        b = c.currentGame.title;
        f(l.find("#gameTitle"));
        l.find(".pickTopicButton").clickExcl(function () {
            UI.pickTopicClick()
        });
        l.find("#pickGenreButton").clickExcl(function () {
            UI.pickGenreClick()
        });
        l.find("#pickSecondGenreButton").clickExcl(function () {
            UI.pickSecondGenreClick()
        });
        l.find(".pickPlatformButton").clickExcl(function () {
            UI.pickPlatformClick($(this))
        });
        l.find(".pickEngineButton").clickExcl(function () {
            UI.pickEngineClick()
        });
        c.canDevelopMediumGames() ? (c.canDevelopLargeGames() || l.find(".gameSizeLarge").hide(), c.canDevelopAAAGames() || l.find(".gameSizeAAA").hide()) : l.find("#gameSizeGroup").hide();
        c.canDevelopMMOGames() || l.find(".gameGenreMMO").hide();
        c.canUseMultiGenre() ? (l.find("#pickSecondGenreButton").css("margin-left", "2.5px").css("margin-right", "2.5px").css("width",
            "145px"), l.find("#pickGenreButton").css("margin-left", "2.5px").css("margin-right", "2.5px").css("width", "145px")) : l.find("#pickSecondGenreButton").hide();
        c.canDevelopMultiPlatform() ? l.find(".pickPlatformButton").css("margin-left", "2.5px").css("margin-right", "2.5px").css("width", "145px") : l.find(".pickPlatformButton").slice(1).hide();
        c.canSetTargetAudience() || l.find("#targetRating").hide();
        l.find(".gameDefSelection").clickExcl(function () {
            Sound.click();
            var a = $(this);
            if (!(a.hasClass("rating") && g.flags.lockedSettings &&
                g.flags.lockedSettings.targetAudience || a.hasClass("gameSizeButton") && g.flags.lockedSettings && g.flags.lockedSettings.gameSize)) {
                if (a.hasClass("gameGenreMMO")) {
                    if (g.flags.lockedSettings && g.flags.lockedSettings.mmo) return;
                    a.hasClass("selected") ? a.removeClass("selected") : a.addClass("selected")
                } else a.parent().find(".gameDefSelection").removeClass("selected"), a.addClass("selected"), a.hasClass("rating") ? l.find(".ratingLabel").text(p(a)) : a.hasClass("gameSizeButton") && (g.gameSize = u(l.find(".gameSizeButton.selected")));
                UI._updateGameDefinitionCost();
                UI._updateGameDefinitionNextButtonEnabled()
            }
        });
        l.find(".windowCostLabel").hide();
        0 === c.engines.length ? l.find(".pickEngineButtonWrapper").hide() : l.find(".pickEngineButtonWrapper").show();
        var m = null != GameManager.company.currentGame.sequelTo,
            n = $("#gameDefinition").find(".dialogScreen1Title");
        m ? (m = GameManager.company.getGameById(GameManager.company.currentGame.sequelTo), null === m ? (GameManager.company.currentGame.sequelTo = null, n.removeClass("smallerWindowTitle").text("Game Concept".localize())) :
            n.addClass("smallerWindowTitle").text("Sequel to {0}".localize().format(m.title))) : n.removeClass("smallerWindowTitle").text("Game Concept".localize());
        $("#gameDefinition").find(".dialogNextButton").clickExcl(function () {
            $("#gameDefinition").find(".dialogNextButton").effect("shake", {
                times: 2,
                distance: 5
            }, 50)
        });
        var r = Research.getAllItems().filter(function (a) {
            return "graphic-type" === a.group
        }).map(function (a) {
            return a.id
        });
        $("#gameDefinition").find(".dialogBackButton").clickExcl(function () {
            Sound.click();
            UI._saveSelectedGameFeatureSettings(function (a) {
                return -1 != r.indexOf(a)
            });
            $("#gameDefinition").find(".dialogScreen1").transition({
                "margin-left": 0
            });
            $("#gameDefinition").find(".dialogScreen2").transition({
                "margin-left": "100%"
            })
        });
        a = !1;
        PlatformShim.execUnsafeLocalFunction(function () {
            k.append(l);
            var a = k.find(".gameSizeSmall");
            UI.maxFont(void 0, a, 18);
            a = k.find(".gameSizeMedium");
            UI.maxFont(void 0, a, 18);
            a = k.find(".gameSizeLarge");
            UI.maxFont(void 0, a, 18);
            a = k.find(".gameSizeAAA");
            UI.maxFont(void 0, a, 18);
            a =
                k.find("#pickSecondGenreButton");
            UI.maxFont(void 0, a, 18);
            a = k.find("#pickGenreButton");
            UI.maxFont(void 0, a, 18);
            a = k.find(".pickEngineButton");
            UI.maxFont(void 0, a, 18);
            a = k.find(".pickTopicButton");
            UI.maxFont(void 0, a, 18);
            UI.showModalContent("#gameDefinition", d)
        })
    };
    var d = function () {
        var a = $(".simplemodal-data").find(".pickTopicButton").text();
        a && (a = a.trim());
        return GameManager.company.topics.first(function (b) {
            return b.name == a
        })
    },
        k = function () {
            var a = $(".simplemodal-data").find("#pickGenreButton").text();
            return GameGenre.getAll().first(function (b) {
                return b.name == a
            })
        },
        m = function () {
            var a = $(".simplemodal-data").find("#pickSecondGenreButton").text();
            return GameGenre.getAll().first(function (b) {
                return b.name == a
            })
        },
        l = function () {
            var a = $(".simplemodal-data").find(".pickEngineButton").get(0).innerText;
            return GameManager.company.engines.first(function (b) {
                return b.name.trim() == a.trim()
            })
        };
    UI._updateGameDefinitionCost = function () {
        var a = $(".simplemodal-data"),
            b = GameManager.company.currentGame,
            c;
        c = 0 + s(u(a.find(".gameSizeButton.selected")));
        b && 0 < b.platforms.length && (c += b.platforms.sum(function (a) {
            return a ? a.developmentCosts : 0
        }), c *= General.getMultiPlatformCostFactor(b), c += UI._getGameFeatureCosts());
        a.find(".gameGenreMMO").hasClass("selected") && (c *= 4);
        a = a.find(".windowCostLabel");
        UI.maxFont(void 0, a, 20, "Cost: {0}".localize().format(UI.getShortNumberString(c)));
        a.fadeIn();
        return c
    };
    var g = function (a) {
        a || (a = $(".simplemodal-data"));
        if (d() && k()) {
            var b = GameManager.company.currentGame;
            b.topic = d();
            b.genre = k();
            b.secondGenre = m();
            GameManager.areHintsEnabled() &&
                Knowledge.hasComboKnowledge(GameManager.company, b) ? (a = a.find(".comboHint"), a.text("{0} combo".localize().format(Knowledge.getComboHintText(b))), UI.maxFont(void 0, a, 14)) : a.find(".comboHint").text("")
        }
    };
    UI._updateGameDefinitionNextButtonEnabled = function () {
        var a = $(".simplemodal-data"),
            b = a.find(".dialogNextButton");
        UI.maxFont(void 0, a.find(".windowMainActionButton"), 22);
        if (0 !== b.length) {
            var c = GameManager.company.currentGame,
                f = d() && 0 < c.platforms.length && k();
            g(a);
            var m = "",
                n = u(a.find(".gameSizeButton.selected"));
            n && "small" != n && (c = c.platforms.filter(function (a) {
                return !Platforms.doesPlatformSupportGameSize(a, n)
            }), 0 < c.length && (m = c.first(), m = "{0} does not support {1} games!".localize("{0} platform, {1} game size").format(m.name, General.getGameSizeLabel(n))));
            a.find(".gameGenreMMO").hasClass("selected") && "large" != n && "aaa" != n && (m = "MMO's cannot be small or medium.".localize());
            0 == m.length && (c = l()) && a.find(".gameGenreMMO").hasClass("selected") && !c.parts.some(function (a) {
                return "mmoSupport" === a.id
            }) && (m = "Engine does not support MMO.".localize());
            a = a.find(".gameDefinitionWarningText");
            0 < m.length ? (f = UI._getMaxFontSize("{0}pt {1}", UI.IS_SEGOE_UI_INSTALLED ? "Segoe UI" : "Open Sans", 16, 8, 380, 40, [m]), a.css("font-size", f + "pt"), a.text(m).fadeIn().effect("pulsate", {
                times: 3
            }), f = !1) : a.fadeOut();
            f ? (b.clickExcl(function () {
                Sound.click();
                PlatformShim.execUnsafeLocalFunction(function () {
                    r()
                });
                $("#gameDefinition").find(".dialogScreen1").transition({
                    "margin-left": "-200%"
                });
                $("#gameDefinition").find(".dialogScreen2").transition({
                    "margin-left": 0
                })
            }), b.removeClass("baseButton").addClass("selectorButton").addClass("orangeButton"),
                PlatformShim.execUnsafeLocalFunction(function () {
                    r()
                })) : b.removeClass("selectorButton").removeClass("orangeButton").addClass("baseButton").addClass("disabledButton").clickExcl(function () {
                    b.effect("shake", {
                        times: 2,
                        distance: 5
                    }, 50)
                })
        }
    };
    var n = [];
    UI._getSelectedFeatures = function () {
        return n
    };
    UI._getGameFeatureCosts = function () {
        if (!n || 0 == n.length) return 0;
        var a = GameManager.company.currentGame.features;
        return (a ? n.except(a) : n).sum(function (a) {
            return Research.getDevCost(a, GameManager.company.currentGame)
        })
    };
    UI.generateFeatureElement = function (a, b) {
        var c = $("#selectableGameFeatureItem").clone();
        c.attr("feature-id", a.id);
        GameManager.areHintsEnabled() && a.isSkillTraining && c.append($('<div style="font-size:12pt;"><span>{0}</span>{1}</div>'.format("Effect: ".localize(), Knowledge.getTrainingKnowledgeHtml(a))));
        c.enableActiveClassOnClick();
        return c
    };
    var r = function () {
        UI._updateFeatureListContainer({
            filter: function (a) {
                return void 0 != a.techLevel || "Special Items" === a.category || "DRM" == a.category
            }
        }, !0);
        UI._updateGameDefinitionCost();
        var a = $(".simplemodal-data").find(".featureSelectionPanel");
        a.hasClass("featureSelectionPanelHiddenState") && (a.removeClass("featureSelectionPanelHiddenState"), a.addClass("featureSelectionShowState"))
    };
    UI.maxFont = function (a, b, c, d, f) {
        void 0 != b && 0 < b.length && (d = d ? d : b[0].innerText, void 0 != d && 0 < d.length && (d = d.trim(), a = UI._getMaxFontSize(a ? a + " {0}pt {1}" : "{0}pt {1}", UI.IS_SEGOE_UI_INSTALLED ? "Segoe UI" : "Open Sans", c, 4, f ? b.width() : b.width() - 11, f ? b.height() : b.height() - 11, [d]), c = $("<span>{0}</span>".format(d)),
            c.css("font-size", a + "pt"), b.empty().append(c)))
    };
    UI._updateFeatureListContainer = function (a, b) {
        var c = a;
        c || (c = {
            readOnly: !1
        });
        var d = c.onChange;
        d || (d = function () {
            UI._updateGameDefinitionCost()
        });
        var f = $(".simplemodal-data");
        UI.maxFont("bolder", f.find(".dialogScreen1Title"), 34);
        UI.maxFont("bolder", f.find(".dialogScreen2Title"), 34);
        var g = f.find(".featureSelectionContainer"),
            k = GameManager.company.currentGame,
            f = GameManager.getAvailableGameFeatures(k.engine).filter(function (a) {
                return !a.canUse || a.canUse(k)
            }).groupBy(function (a) {
                return a.category
            });
        g.empty();
        n = [];
        var l = null,
            m = [],
            p = function (a, b) {
                if (a.hasClass("selectedFeature")) "graphic-type" !== b.group && (a.removeClass("selectedFeature"), n.remove(b), d());
                else {
                    if (b.group) {
                        var c = ".radioButton" + m.indexOf(b.group);
                        g.find(c).removeClass("selectedFeature");
                        for (var c = n.filter(function (a) {
                            return a.group === b.group
                        }), f = 0; f < c.length; f++) n.remove(c[f])
                    }
                    a.addClass("selectedFeature");
                    n.push(b);
                    d()
                }
            };
        c.categories && 0 < c.categories.length && (f = f.filter(function (a) {
            return -1 != c.categories.indexOf(a.category)
        }));
        c.filter &&
            (f = f.filter(c.filter));
        var r = $("#featureCategoryHeading");
        b && (f = f.slice().sort(function (a, b) {
            return a.techLevel - b.techLevel
        }));
        for (var s = 0; s < f.length; s++) {
            var t = f[s];
            if (t.category != l) {
                l = r.clone();
                l.removeAttr("id");
                var u = Missions.getMissionWithId(t.category);
                u && l.attr("mission-id", u.id);
                l.text(u ? u.name : t.categoryDisplayName);
                g.append(l);
                l = t.category
            }
            var u = UI.generateFeatureElement(t, l),
                G = GameManager.company.currentGame.features,
                G = (G = G && -1 != G.indexOf(t) ? 0 : Research.getDevCost(t, GameManager.company.currentGame)) ?
                    "{0} ({1})".format(t.name, UI.getShortNumberString(G)) : t.name;
            u.find(".featureContent").text(G);
            t.group && (-1 == m.indexOf(t.group) && m.push(t.group), G = "radioButton" + m.indexOf(t.group), u.addClass(G));
            c.readOnly || function (a, b) {
                a.clickExcl(function () {
                    Sound.click();
                    p(a, b)
                })
            }(u, t);
            g.append(u); - 1 != GameManager.uiSettings.selectedGameFeatures.indexOf(t.id) ? p(u, t) : "graphic-type" !== t.group || n.some(function (a) {
                return "graphic-type" === a.group
            }) || p(u, t)
        }
        UI.createDraggable(g);
        return f.length
    };
    UI._saveSelectedGameFeatureSettings =
        function (a) {
            if (a) {
                var b = GameManager.uiSettings.selectedGameFeatures.filter(function (b) {
                    return !a(b)
                });
                GameManager.uiSettings.selectedGameFeatures = b.concat(n.map(function (a) {
                    return a.id
                }).filter(function (b) {
                    return a(b)
                }))
            } else if (GameFlags.ghg6) throw "unexpected method call";
        };
    var p = function (a) {
        var b = null;
        a.hasClass("ratingY") ? b = "Young".localize("audience category") : a.hasClass("ratingE") ? b = "Everyone".localize("audience category") : a.hasClass("ratingM") && (b = "Mature".localize("audience category"));
        return b
    },
        s = function (a) {
            switch (a) {
                case "aaa":
                    return 1E7;
                case "large":
                    return 15E5;
                case "medium":
                    return 15E4;
                default:
                    return 0
            }
        },
        u = function (a) {
            var b = null;
            a.hasClass("gameSizeSmall") ? b = "small" : a.hasClass("gameSizeMedium") ? b = "medium" : a.hasClass("gameSizeLarge") ? b = "large" : a.hasClass("gameSizeAAA") && (b = "aaa");
            return b
        },
        t = function () {
            var a = GameManager.company,
                c = a.currentGame,
                d = null;
            c.sequelTo && (d = a.getGameById(c.sequelTo));
            a = a.gameLog.concat(a.trashedGames);
            c.engine && (c.flags.isNewBetterEngine = !a.some(function (a) {
                return a.engine &&
                    a.engine.techLevel >= c.engine.techLevel
            }));
            a.some(function (a) {
                return a.secondGenre === c.secondGenre && a.genre === c.genre && a.topic === c.topic
            }) || (c.researchFactor = Research.FACTOR_FOR_NEW_COMBINATIONS, c.flags.isNewCombination = !0);
            a = !a.some(function (a) {
                return a.topic.id === c.topic.id
            });
            c.flags.isNewTopic = a;
            d && (d.engine && c.engine && d.engine.id === c.engine.id ? c.flags.usesSameEngineAsSequel = !0 : c.engine && (!d.engine || c.engine.techLevel > d.engine.techLevel) && (c.flags.hasBetterEngineThanSequel = !0));
            c.flags.hasCustomName =
                c.title != b;
            !0 === GameManager.flags.createPack && (c.flags.isExtensionPack = !0)
        };
    UI.closeGameDefinition = function () {
        Sound.click();
        var b = GameManager.company.currentGame,
            c = $(".simplemodal-data"),
            f = c.find("#gameTitle")[0].value;
        b.title = f;
        f = c.find(".rating.selected");
        b.targetAudience = f.hasClass("ratingY") ? "young" : !f.hasClass("ratingE") && f.hasClass("ratingM") ? "mature" : "everyone";
        f = u(c.find(".gameSizeButton.selected"));
        b.gameSize = f;
        if (f = d())
            if (b.topic = f, f = k()) {
                b.genre = f;
                if (f = m()) b.secondGenre = f;
                0 != b.platforms.length &&
                    (f = l(), b.engine = f, b.costs = UI._updateGameDefinitionCost(), b.features = n, b.flags.techLevel = b.features.filter(function (a) {
                        return void 0 != a.techLevel
                    }).average(function (a) {
                        return a.techLevel
                    }), c.find(".gameGenreMMO").hasClass("selected") && (b.flags.mmo = !0), t(), a = !0, UI.closeModal(function () {
                        VisualsManager.gameStatusBar.updateGameName();
                        VisualsManager.gameStatusBar.updatePoints();
                        VisualsManager.gameStatusBar.progressBar.alpha = 0;
                        GameManager.notifyIdleState()
                    }))
            }
    }
})();