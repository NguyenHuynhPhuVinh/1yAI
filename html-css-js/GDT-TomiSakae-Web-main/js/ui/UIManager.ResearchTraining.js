(function () {
    UI.showResearchMenu = function (a, c) {
        b(a, !1, c)
    };
    UI.showTrainingMenu = function (a, c) {
        b(a, !0, c)
    };
    var a = !0,
        b = function (b, d, f) {
            a = d;
            var m = GameManager.company.staff.first(function (a) {
                return a.id === GameManager.uiSettings.selectedChar
            });
            PlatformShim.execUnsafeLocalFunction(function () {
                $(".selectionOverlayContainer").hide();
                k(m, a);
                var b = $("#researchMenu");
                b.find(".windowTitle").text(a ? "Training Options".localize("heading") : "What do you want to research?".localize());
                var d = b.find(".staffInfoPanel");
                a &&
                    d.empty().append(c(m));
                var g = a ? "Start Training".localize("button") : "Start Research".localize("button");
                UI.showModalContent("#researchMenu", {
                    close: !0,
                    disableCheckForNotifications: !0,
                    onClose: function () {
                        GameManager.company.activeNotifications.splice(0, 1);
                        f && f()
                    },
                    onOpen: function () {
                        a ? d.delay(200).queue(function () {
                            $(this).removeClass("hidden").addClass("showState");
                            $(this).dequeue()
                        }) : d.removeClass("showState").addClass("hidden");
                        UI.maxFont("bold", $(".simplemodal-data").find(".okButton"), 22, g);
                        UI.maxFont(void 0,
                            $(".simplemodal-data").find(".trainingD .leftColumn"), 22, void 0, !0);
                        UI.maxFont(void 0, $(".simplemodal-data").find(".trainingS .leftColumn"), 22, void 0, !0);
                        UI.maxFont(void 0, $(".simplemodal-data").find(".trainingT .leftColumn"), 22, void 0, !0);
                        UI.maxFont(void 0, $(".simplemodal-data").find(".trainingR .leftColumn"), 22, void 0, !0)
                    }
                })
            })
        },
        c = function (a) {
            var b = $("#trainingStaffInfo").clone(),
                c = b.find(".name"),
                d = 15,
                f = UI.IS_SEGOE_UI_INSTALLED ? "Segoe UI" : "Open Sans";
            do {
                var k = "{0} {1}pt {2}".format("bold", d, f),
                    k = new createjs.Text(a.name, k, "black");
                d--
            } while (195 < 1.1 * k.getMeasuredWidth() && 10 < d);
            c.css({
                font: "{0} {1}pt {2}".format("bold", d, f)
            }).text(a.name);
            a.flags.expert && b.find(".expert").text("({0})".format(Missions.getMissionWithId(a.flags.expert).name));
            b.find(".lvl").text(a.getLevel());
            b.find(".design").text(a.getDesignSkillPoints());
            b.find(".technology").text(a.getTechnologySkillPoints());
            b.find(".speed").text(a.getSpeedSkillPoints());
            b.find(".research").text(a.getResearchSkillPoints());
            return b
        },
        f =
            function () {
                var a = $(".simplemodal-data").find("#startResearchButton");
                d && !a.hasClass("orangeButton") && (a.removeClass("disabledButton").addClass("orangeButton"), a.clickExcl(function () {
                    m()
                }))
            },
        d, k = function (a, b) {
            var c = $("#researchButtonContainer"),
                k;
            k = b ? Training.getAvailableTraining(a) : GameManager.company.availableResearch.filter(function (a) {
                return "New Topic" === a.id || 0 === GameManager.currentResearches.filter(function (b) {
                    return b.id === a.id
                }).length
            }).groupBy(function (a) {
                return a.category
            });
            c.empty();
            var m =
                null;
            $("#selectableGameFeatureItem");
            d = null;
            for (var s = function (a, b) {
                a.hasClass("selectedFeature") ? (a.removeClass("selectedFeature"), d = null) : ($(".simplemodal-data").find(".selectedFeature").removeClass("selectedFeature"), a.addClass("selectedFeature"), d = b);
                f()
            }, u = 0; u < k.length; u++) {
                var t = k[u],
                    q = Research.getPointsCost(t);
                t.category != m && (c.append($('<div class="featureSelectionCategoryHeading">{0}</div>'.format(t.categoryDisplayName ? t.categoryDisplayName : t.category))), m = t.category);
                var v = UI.generateFeatureElement(t);
                v.find(".levelLabel").hide();
                t.style && v.addClass(t.style);
                t.isTraining && t.canUse && !t.canUse(a, GameManager.company) && v.addClass("disabled");
                var A = t.name + ' (<span class="rpCost">{0} {1}</span>'.format(UI.getShortNumberString(q), "RP".localize("RP short for research points")),
                    z = Research.getResearchCost(t);
                z && (A += ', <span class="crCost">{0} {1}</span>'.format(UI.getShortNumberString(z), "cr.".localize("cr. short for credits")));
                A += ")";
                v.find(".featureContent").html(A);
                A = !0;
                q > GameManager.company.researchPoints &&
                    (v.find(".rpCost").addClass("red"), A = !1);
                GameManager.company.cash < z && (v.find(".crCost").addClass("red"), A = !1);
                v.addClass("radioButton");
                A || v.addClass("disabled").addClass("disabledButton").addClass("no-click").addClass("no-hover");
                (function (b, c) {
                    var d = Research.getPointsCost(c);
                    b.clickExcl(function () {
                        if (!(d > GameManager.company.researchPoints || c.isTraining && c.canUse && !c.canUse(a, GameManager.company)))
                            if (s(b, c), c == Research.ResearchTopicItem) UI.pickTopicClick("research"), b.hasClass("selectedFeature") ||
                                s(b, c);
                            else {
                                var f = Research.ResearchTopicItem.name + " ({0} ".format(UI.getShortNumberString(Research.getPointsCost(Research.ResearchTopicItem))) + "RP".localize("RP short for research points"),
                                    g = Research.getResearchCost(Research.ResearchTopicItem);
                                g && (f += ", {0} ".format(UI.getShortNumberString(g)) + "cr.".localize("cr. short for credits"));
                                f += ")";
                                $(".simplemodal-data").find(".pickTopicButton").text(f)
                            }
                    })
                })(v, t);
                t == Research.ResearchTopicItem && v.addClass("pickTopicButton");
                c.append(v)
            }
        },
        m = function () {
            Sound.click();
            if (d) {
                var b = $(".simplemodal-data");
                if (d === Research.ResearchTopicItem) {
                    var c = b.find(".pickTopicButton").get(0).innerText,
                        b = Topics.topics.first(function (a) {
                            return a.name == c
                        });
                    if (!b) return;
                    GameManager.researchTopic(b)
                } else GameManager.research(d, a ? "training" : "research");
                UI.closeModal()
            }
        }
})();