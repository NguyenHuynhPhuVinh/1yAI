(function () {
    UI.pickTopicFontSize = void 0;
    UI._getMaxFontSizeSimple = function (a, c, f, d) {
        return UI._getMaxFontSize("{0}pt {1}", UI.IS_SEGOE_UI_INSTALLED ? "Segoe UI" : "Open Sans", c, "2pt", f, d, [a]) + "pt"
    };
    UI._getMaxFontSize = function (a, c, f, d, k, m, l) {
        for (var g = a.format(f, c), n = 0; n < l.length && f != d; n++) {
            var r = new createjs.Text(l[n], g, "black");
            if (1.1 * r.getMeasuredWidth() > k || 0 < m && 1.1 * r.getMeasuredHeight() > m) f -= 1, g = a.format(f, c), n--
        }
        return f
    };
    UI.pickTopicClick = function (a) {
        Sound.click();
        var c = "research" === a;
        if (!c) {
            var f =
                GameManager.company.currentGame;
            if (f && f.flags.lockedSettings && f.flags.lockedSettings.topic) {
                $(".simplemodal-data").find(".pickTopicButton").parent(".centeredButtonWrapper").effect("shake", {
                    times: 2,
                    distance: 5
                }, 50);
                return
            }
        } !c && a ? UI._selectTopic($(a).find(".topicButtonText").text()) : PlatformShim.execUnsafeLocalFunction(function () {
            var a = $(".simplemodal-data");
            a.find(".overlayTitle").text("Pick Topic".localize("heading"));
            var b = a.find(".listContainer");
            b.empty();

            // Thêm ô tìm kiếm topic
            var searchContainer = $('<div class="topicSearchContainer" style="margin-bottom: 15px; padding: 0 10px; position: relative; z-index: 999;"></div>');
            var searchInput = $('<input type="text" class="topicSearchInput" placeholder="Tìm kiếm topic..." style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"/>');
            searchContainer.append(searchInput);
            b.append(searchContainer);

            // Thêm container riêng cho danh sách topics
            var topicsListContainer = $('<div class="topicsListContainer" style="position: relative;"></div>');
            b.append(topicsListContainer);

            var f = 0,
                l = 0,
                g = General.getTopicOrder(GameManager.company),
                n = c ? General.getTopicsAvailableForResearch(GameManager.company) : [];
            if (void 0 == UI.pickTopicFontSize) {
                for (var r = [], p = 0; p < g.length; p++) r.push(g[p].name);
                UI.pickTopicFontSize = UI._getMaxFontSize("{0}pt {1}", UI.IS_SEGOE_UI_INSTALLED ? "Segoe UI" : "Open Sans", 16, 10, 175, 50, r)
            }
            for (p = 0; p < g.length; p++) {
                var s = g[p];
                f++;
                3 < f && (l++, f = 1);
                var u = -1 != GameManager.company.topics.indexOf(s),
                    t = 0 < GameManager.currentResearches.filter(function (a) {
                        return a.topicId === s.id
                    }).length,
                    r = c ? !u && !t && -1 != n.indexOf(s) : u;

                // Kiểm tra xem topic có bị khóa không
                var isLocked = c && !r && !u && !t || !c && !r;

                // Tạo HTML cho button topic
                var topicName = isLocked ? "?" : s.name;
                var iconUrl = isLocked ?
                    "./images/topic icons/overlay_locked.png" :
                    (s.iconUrl ? s.iconUrl : "./images/topic icons/icon_topic_{0}.png".format(s.id.toLowerCase()));

                var buttonHTML = '<div class="pickTopicListButton selectorButton whiteButton" data-topic-name="' + topicName + '"><img class="topicIcon" src="' + iconUrl + '"></img><span class="topicButtonText">' + topicName + '</span><div class="hints"></div></div>';
                var topicButton = $(buttonHTML);

                (function (a) {
                    a.find(".topicIcon").on("error", function () {
                        a.find(".topicIcon").attr("src", "./images/topic icons/generic.png")
                    })
                })(topicButton);

                topicButton.disableDrag();

                if (r) {
                    topicButton.clickExclOnce(function () {
                        UI.pickTopicClick(this)
                    });
                } else {
                    topicButton.addClass("disabledButton");
                    topicButton.removeAttr("onClick");
                    topicButton.addClass("no-hover").addClass("no-click");
                }

                if (!isLocked && GameManager.areHintsEnabled() && GameManager.company.canSetTargetAudience() && Knowledge.hasTopicAudienceWeightingKnowledge(GameManager.company, s)) {
                    topicButton.find(".hints").html(Knowledge.getTopicAudienceHtml(GameManager.company, s));
                    topicButton.addClass("hintsEnabled");
                }

                topicButton.css("position", "absolute");
                topicButton.css("top", 140 * l + 10 * l);
                topicButton.css("left", 190 * (f - 1) + 10);
                topicButton.css("font-size", UI.pickTopicFontSize + "pt");

                topicsListContainer.append(topicButton);
            }

            // Xử lý tìm kiếm
            searchInput.on("input", function () {
                var searchText = $(this).val().toLowerCase().trim();

                if (searchText === "") {
                    // Nếu không có từ khóa tìm kiếm, sắp xếp lại theo thứ tự ban đầu
                    topicsListContainer.find(".pickTopicListButton").each(function () {
                        var originalPosition = $(this).data("original-position");
                        if (originalPosition) {
                            $(this).css({
                                "top": originalPosition.top,
                                "left": originalPosition.left
                            });
                        }
                    });
                    return;
                }

                // Mảng để lưu các topic phù hợp và không phù hợp
                var matchingTopics = [];
                var nonMatchingTopics = [];

                // Phân loại các topic
                topicsListContainer.find(".pickTopicListButton").each(function () {
                    var topicElement = $(this);
                    var topicName = topicElement.attr("data-topic-name") || "";

                    // Lưu vị trí ban đầu nếu chưa lưu
                    if (!topicElement.data("original-position")) {
                        topicElement.data("original-position", {
                            top: topicElement.css("top"),
                            left: topicElement.css("left")
                        });
                    }

                    if (topicName.toLowerCase().indexOf(searchText) > -1 || topicName === "?") {
                        matchingTopics.push(topicElement);
                    } else {
                        nonMatchingTopics.push(topicElement);
                    }
                });

                // Sắp xếp lại vị trí của các topic
                var rowCount = 0;
                var colCount = 0;

                // Đặt các topic phù hợp lên đầu
                $.each(matchingTopics, function (index, topic) {
                    colCount++;
                    if (colCount > 3) {
                        rowCount++;
                        colCount = 1;
                    }

                    topic.css({
                        "top": 140 * rowCount + 10 * rowCount,
                        "left": 190 * (colCount - 1) + 10
                    });
                });

                // Đặt các topic không phù hợp phía sau
                $.each(nonMatchingTopics, function (index, topic) {
                    colCount++;
                    if (colCount > 3) {
                        rowCount++;
                        colCount = 1;
                    }

                    topic.css({
                        "top": 140 * rowCount + 10 * rowCount,
                        "left": 190 * (colCount - 1) + 10
                    });
                });
            });

            UI.createDraggable(b);
            a.find(".selectionOverlayContainer").fadeIn("fast")
        })
    };
    UI._selectTopic = function (a) {
        a && (a = a.trim());
        var c = $(".simplemodal-data").find(".pickTopicButton");
        a = a.split("\n");
        c.get(0).innerText = a[0];
        c.removeClass("selectorButtonEmpty");
        UI.maxFont(void 0, c, 18);
        $(".simplemodal-data").find(".selectionOverlayContainer").fadeOut("fast");
        UI._updateGameDefinitionNextButtonEnabled()
    };
    UI.pickPlatformClick = function (a) {
        Sound.click();
        var c = a.hasClass("platform2") ? 1 : a.hasClass("platform3") ? 2 : 0,
            f = GameManager.company.currentGame;
        if (0 === c && f && f.flags.lockedSettings && f.flags.lockedSettings.platform) $(".simplemodal-data").find("#pickPlatformButton").parent(".centeredButtonWrapper").effect("shake", {
            times: 2,
            distance: 5
        }, 50);
        else if (f && f.platforms.length < c) {
            var d = ".pickPlatformButton";
            0 < f.platforms.length && (d += ".platform" + f.platforms.length);
            $($(".simplemodal-data").find(d).get(0)).effect("pulsate", {
                times: 2
            })
        } else PlatformShim.execUnsafeLocalFunction(function () {
            var d = $(".simplemodal-data");
            d.find(".overlayTitle").text("Pick Platform".localize("heading"));
            var f = d.find(".listContainer");
            f.empty();
            var l = Platforms.getPlatformsOnMarket(GameManager.company),
                g = GameManager.company.currentGame,
                l = l.except(g.platforms);
            g.platforms.length > c && l.push(g.platforms[c]);
            l = l.slice().sort(function (a, b) {
                return Platforms.getTotalMarketSizePercent(b, GameManager.company) - Platforms.getTotalMarketSizePercent(a, GameManager.company)
            });
            if (1 < g.platforms.length && g.platforms.length > c) {
                var n = $("<div class='removePlatformButton whiteButton'></div>").text("Remove Platform".localize());
                (function (a) {
                    a.clickExcl(function () {
                        Sound.click();
                        var a = GameManager.company.currentGame.platforms;
                        a.length <= c || a.splice(c, 1);
                        $(".simplemodal-data").find(".selectionOverlayContainer").fadeOut("fast");
                        UI._updatePickPlatformButtonStates(g);
                        UI._updateGameDefinitionNextButtonEnabled();
                        UI._updateGameDefinitionCost()
                    })
                })(n);
                f.append(n)
            }
            for (var r = 0; r < l.length; r++) {
                n = $("#platformButtonTemplate").clone();
                n.removeAttr("id");
                var p = l[r];
                n.platformId = p.id;
                var s = -1 != GameManager.company.licencedPlatforms.indexOf(p);
                n.find(".platformButtonImage").attr("src", Platforms.getPlatformImage(p, GameManager.company.currentWeek));
                n.find(".platformTitle").text(p.name);
                n.find(".cost").text("Dev. cost: ".localize() + UI.getShortNumberString(p.developmentCosts));
                s ? n.find(".licenseCost").hide() : (n.find(".licenseCost").text("License cost: ".localize() + UI.getShortNumberString(p.licencePrize)), GameManager.company.cash < p.licencePrize && n.find(".licenseCost").addClass("red"));
                n.find(".marketShare").text("Marketshare: ".localize() + UI.getPercentNumberString(Platforms.getTotalMarketSizePercent(p, GameManager.company)));
                if (GameManager.areHintsEnabled()) {
                    var u = Knowledge.getPlatformAudienceHintHtml(GameManager.company, p);
                    u && n.find(".audienceHints").html(u);
                    (u = Knowledge.getPlatformGenreHintHtml(GameManager.company,
                        p)) && n.find(".genreHints").html(u)
                } (function (c) {
                    s ? (c.addClass("whiteButton"), c.clickExclOnce(function () {
                        Sound.click();
                        UI._selectPlatform(c.platformId, a)
                    })) : p.licencePrize <= GameManager.company.cash ? (c.addClass("whiteButton"), c.clickExclOnce(function () {
                        Sound.click();
                        UI.buyPlatform($(this).find(".platformTitle").get(0).innerText, function (d) {
                            d && UI._selectPlatform(c.platformId, a)
                        })
                    })) : c.addClass("disabledButton")
                })(n);
                f.append(n)
            }
            UI.createDraggable(f);
            d.find(".selectionOverlayContainer").fadeIn("fast")
        })
    };
    var a = function (a, c) {
        var f = GameManager.company.currentGame.platforms;
        if (f.length == a) f.push(c);
        else if (f.length >= a) f[a] = c;
        else throw "unexpected platform length";
        UI._updatePickPlatformButtonStates(GameManager.company.currentGame)
    };
    UI.getMeasuredWidth = function (a, c) {
        var f = "bold {0}pt {1}".format(c, UI.IS_SEGOE_UI_INSTALLED ? "Segoe UI" : "Open Sans");
        a = new createjs.Text(a, f, "black");
        return 1.1 * a.getMeasuredWidth()
    };
    UI.getMeasuredHeight = function (a, c, f) {
        c = "bold {0}pt {1}".format(c, UI.IS_SEGOE_UI_INSTALLED ? "Segoe UI" :
            "Open Sans");
        a = new createjs.Text(a, c, "black");
        f && (a.lineWidth = f);
        return 1.1 * a.getMeasuredHeight()
    };
    UI._updatePickPlatformButtonStates = function (a) {
        for (var c = $(".simplemodal-data"), f = 0; 3 > f; f++) {
            var d = ".pickPlatformButton";
            0 < f && (d += ".platform" + (f + 1));
            var d = $(c.find(d).get(0)),
                k = "Pick Platform".localize();
            GameManager.company.canDevelopMultiPlatform();
            a.platforms.length >= f ? (d.removeClass("selectorButtonEmpty").removeClass("selectorButtonInactive windowStepActionButtonDisabled").addClass("selectorButton windowStepActionButton"),
                a.platforms[f] && (k = a.platforms[f].name), d.text(k)) : d.addClass("selectorButtonInactive windowStepActionButtonDisabled").removeClass("selectorButton windowStepActionButton").text("Pick Platform".localize());
            UI.maxFont(void 0, d, 18, k)
        }
    };
    UI._selectPlatform = function (b, c) {
        var f = GameManager.company.licencedPlatforms.first(function (a) {
            return a.id === b
        }),
            d = c ? $(c) : $(".simplemodal-data").find("#pickPlatformButton");
        d.get(0).innerText = f.name;
        $(".simplemodal-data").find("#gameDefinition") && a(d.hasClass("platform2") ?
            1 : d.hasClass("platform3") ? 2 : 0, f);
        d.removeClass("selectorButtonEmpty");
        $(".simplemodal-data").find(".selectionOverlayContainer").fadeOut("fast");
        UI._updateGameDefinitionNextButtonEnabled();
        UI._updateGameDefinitionCost()
    };
    UI.buyPlatform = function (a, c) {
        var f = GameManager.company.availablePlatforms.concat(GameManager.company.licencedPlatforms).first(function (c) {
            return c.name == a
        });
        if (f) {
            var d = "You require a developer license to be able to develop for this platform.<br/><br/> Do you want to pay <strong>{0}</strong> to acquire a license for the <strong>{1}</strong>?".localize().format(UI.getLongNumberString(f.licencePrize),
                f.name);
            $("#purchasePlatformDialog").find(".purchasePlatformMessage").html(PlatformShim.toStaticHtml(d));
            $("#purchasePlatformDialog").dialog({
                draggable: !1,
                modal: !0,
                resizable: !1,
                show: "fade",
                zIndex: 6E3,
                open: function () {
                    $(this).siblings(".ui-dialog-titlebar").remove();
                    $(this).find(".cancelActionButton").clickExclOnce(function () {
                        Sound.click();
                        $("#purchasePlatformDialog").dialog("close")
                    });
                    $(this).find(".confirmActionButton").clickExclOnce(function () {
                        Sound.click();
                        $("#purchasePlatformDialog").dialog("close");
                        GameManager.buyPlatform(f);
                        c(!0)
                    });
                    UI.maxFont("bolder", $(this).find(".windowTitle"), 34)
                }
            })
        }
    };
    UI.pickGenreClick = function (a) {
        Sound.click();
        var c = GameManager.company.currentGame;
        c && c.flags.lockedSettings && c.flags.lockedSettings.genre ? $(".simplemodal-data").find("#pickGenreButton").parent(".centeredButtonWrapper").effect("shake", {
            times: 2,
            distance: 5
        }, 50) : a ? UI._selectGenre($(a).find(".topicButtonText").text()) : PlatformShim.execUnsafeLocalFunction(function () {
            var a = $(".simplemodal-data");
            a.find(".overlayTitle").text("Pick Genre".localize("heading"));
            var b = a.find(".listContainer");
            b.empty();
            for (var c = General.getAvailableGenres(GameManager.company), m = a.find("#pickSecondGenreButton").get(0).innerText, l = 0, g = 0, n = 0; n < c.length; n++) {
                l++;
                2 < l && (g++, l = 1);
                var r = c[n],
                    p = r.iconUrl ? r.iconUrl : "./images/genre icons/icon_genre_{0}.png".format(r.id.toLowerCase()),
                    r = '<div class="selectorButton pickTopicListButton"><img class="topicIcon" src="{{iconUrl}}"></img><span class="topicButtonText">{{name}}</span></div>'.replace("{{name}}", r.name).replace("{{iconUrl}}", p),
                    r = $(r);
                (function (a) {
                    a.find(".topicIcon").on("error", function () {
                        a.find(".topicIcon").attr("src", "./images/genre icons/generic.png")
                    })
                })(r);
                r.css("position", "absolute");
                r.css("top", 140 * g + 10 * g);
                r.css("left", 190 * (l - 1) + 110);
                r.addClass("whiteButton");
                p = m != c[n].name;
                r.disableDrag();
                p ? r.clickExclOnce(function () {
                    UI.pickGenreClick(this)
                }) : (r.addClass("disabledButton"), r.removeAttr("onClick"), r.addClass("no-hover").addClass("no-click"));
                b.append(r);
                UI.createDraggable(b)
            }
            a.find(".selectionOverlayContainer").fadeIn("fast")
        })
    };
    UI._selectGenre = function (a, c) {
        var f = 2 == c ? $(".simplemodal-data").find("#pickSecondGenreButton") : $(".simplemodal-data").find("#pickGenreButton"),
            d = f.get(0).innerText;
        d && (d = d.trim());
        a == d ? (f.text("Pick Genre".localize()), f.addClass("selectorButtonEmpty")) : (f.text(a), f.removeClass("selectorButtonEmpty"));
        f = GameGenre.getAll().first(function (c) {
            return c.name == a
        });
        d = GameManager.company.currentGame;
        2 != c ? (d.genre = f, d.genre && $(".simplemodal-data").find("#pickSecondGenreButton").removeClass("selectorButtonInactive windowStepActionInactive").addClass("selectorButton windowStepActionButton")) :
            d.secondGenre = f;
        $(".simplemodal-data").find(".selectionOverlayContainer").fadeOut("fast");
        UI._updateGameDefinitionNextButtonEnabled()
    };
    UI.pickSecondGenreClick = function (a) {
        Sound.click();
        var c = GameManager.company.currentGame;
        c && c.flags.lockedSettings && c.flags.lockedSettings.secondGenre ? $(".simplemodal-data").find("#pickSecondGenreButton").parent(".centeredButtonWrapper").effect("shake", {
            times: 2,
            distance: 5
        }, 50) : c && !c.genre ? $(".simplemodal-data").find("#pickGenreButton").effect("pulsate", {
            times: 2
        }) : a ?
            UI._selectGenre($(a).find(".topicButtonText").text(), 2) : PlatformShim.execUnsafeLocalFunction(function () {
                var a = $(".simplemodal-data");
                a.find(".overlayTitle").text("Pick Genre".localize("heading"));
                var b = a.find(".listContainer");
                b.empty();
                for (var c = General.getAvailableGenres(GameManager.company), m = a.find("#pickGenreButton").get(0).innerText, l = 0, g = 0, n = 0; n < c.length; n++) {
                    l++;
                    2 < l && (g++, l = 1);
                    var r = c[n],
                        p = r.iconUrl ? r.iconUrl : "./images/genre icons/icon_genre_{0}.png".format(r.id.toLowerCase()),
                        r = '<div class="selectorButton pickTopicListButton"><img class="topicIcon" src="{{iconUrl}}"></img><span class="topicButtonText">{{name}}</span></div>'.replace("{{name}}",
                            r.name).replace("{{iconUrl}}", p),
                        r = $(r);
                    (function (a) {
                        a.find(".topicIcon").on("error", function () {
                            a.find(".topicIcon").attr("src", "./images/genre icons/generic.png")
                        })
                    })(r);
                    r.css("position", "absolute");
                    r.css("top", 140 * g + 10 * g);
                    r.css("left", 190 * (l - 1) + 110);
                    r.addClass("whiteButton");
                    r.disableDrag();
                    m == c[n].name ? (r.addClass("disabledButton"), r.removeAttr("onClick"), r.addClass("no-hover").addClass("no-click")) : r.clickExclOnce(function () {
                        UI.pickSecondGenreClick(this)
                    });
                    b.append(r)
                }
                UI.createDraggable(b);
                a.find(".selectionOverlayContainer").fadeIn("fast")
            })
    };
    UI.pickEngineClick = function (a) {
        Sound.click();
        if (a) {
            var c = GameManager.company.engines.first(function (c) {
                return c.id === a.engineId
            }),
                f = c.name,
                d = $(".simplemodal-data").find(".pickEngineButton");
            d.get(0).innerText = f;
            $(".simplemodal-data").find("#gameDefinition") && (GameManager.company.currentGame.engine = c);
            d.removeClass("selectorButtonEmpty");
            $(".simplemodal-data").find(".selectionOverlayContainer").fadeOut("fast");
            UI._updateGameDefinitionNextButtonEnabled()
        } else PlatformShim.execUnsafeLocalFunction(function () {
            var a =
                $(".simplemodal-data");
            a.find(".overlayTitle").text("Pick Engine".localize("heading"));
            var b = a.find(".listContainer");
            b.empty();
            var c = $('<div class="engineButtonContainer"></div>');
            b.append(c);
            for (var d = $("#engineButtonTemplate").get(0).outerHTML, f = GameManager.company.engines.slice().reverse(), r = 0; r < f.length; r++) {
                var p = f[r],
                    s = $(d);
                s.engineId = p.id;
                s.text(p.name);
                s.addClass("whiteButton");
                (function (a) {
                    a.clickExcl(function () {
                        UI.pickEngineClick(a)
                    })
                })(s);
                p = $('<div class="centeredButtonWrapper"></div>');
                p.append(s);
                c.append(p)
            }
            UI.createDraggable(b);
            a.find(".selectionOverlayContainer").fadeIn("fast")
        })
    }
})();