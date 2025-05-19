(function () {
    var a = "Company Name".localize(),
        b = void 0,
        c = void 0,
        f = void 0,
        d = void 0,
        k = void 0;
    UI.showNewGameView = function (c, d) {
        PlatformShim.execUnsafeLocalFunction(function () {
            $.modal.impl.o && ($.modal.impl.o.onClose = null);
            $.modal.close()
        });
        void 0 == b && (g(), l(), m());
        var f = $("#newGameViewContent");
        f.empty();
        var k = $("#newGameViewTemplate").clone();
        k.find("#companyName").attr("value", a);
        var n = PlatformShim.getUserName();
        n || (n = "Player Name".localize());
        k.find("#playerName").attr("value", n);
        k.find(".characterSexSelectionButton").toggleClass("selected",
            !1);
        b ? k.find(".characterSexSelectionButton.maleSex").toggleClass("selected", !0) : k.find(".characterSexSelectionButton.femaleSex").toggleClass("selected", !0);
        f.append(k);
        UI.closeAllLoadSaveViews();
        var f = $("#newGameView"),
            q = f.find(".featureSelectionPanel");
        f.find(".configButton").clickExcl(function () {
            Sound.click();
            q.hasClass("featureSelectionPanelHiddenState") ? q.removeClass("featureSelectionPanelHiddenState").addClass("featureSelectionShowState") : q.removeClass("featureSelectionShowState").addClass("featureSelectionPanelHiddenState")
        });
        UI.showModalContent("#newGameView", {
            disableCheckForNotifications: !0,
            onClose: function () {
                GameManager.company.activeNotifications.remove(c);
                d && d()
            },
            onOpen: function () {
                UI._updatePreview();
                var a = $("#canvasScrollContainer").width(),
                    b = $("#simplemodal-container");
                b.removeClass("smallScreenPopup");
                1024 >= a && b.addClass("smallScreenPopup");
                UI.maxFont(void 0, b.find(".featureSelectionPanel").find(".smallerWindowTitle"), 22)
            }
        })
    };
    UI._updatePreview = function () {
        var a = $(".simplemodal-data").find(".characterPreviewCanvas")[0];
        a.height = 254;
        a.width = 360;
        a = a.getContext("2d");
        a.drawImage(GameDev.ResourceManager.resources[ResourceKeys.PreviewDesk], 0, 0, 360, 254);
        a.drawImage(UI._getChair(), 122, 22, 200, 200);
        a.drawImage(UI._getPants(), 122, 22, 200, 200);
        a.drawImage(UI._getHands(), 122, 22, 200, 200);
        a.drawImage(UI._getBody(), 122, 22, 200, 200);
        a.drawImage(UI._getHead(), 122, 22, 200, 200)
    };
    UI._getChair = function () {
        return GameDev.ResourceManager.resources[ResourceKeys.PreviewChair]
    };
    UI._getPants = function () {
        return b ? GameDev.ResourceManager.resources[ResourceKeys.PreviewPants1] :
            GameDev.ResourceManager.resources[ResourceKeys.PreviewPants9]
    };
    UI._getHands = function () {
        return b ? 4 === f || 7 === f ? GameDev.ResourceManager.resources[ResourceKeys.PreviewHands4] : 5 === f || 8 === f ? GameDev.ResourceManager.resources[ResourceKeys.PreviewHands5] : GameDev.ResourceManager.resources[ResourceKeys.PreviewHands1] : 12 === k ? GameDev.ResourceManager.resources[ResourceKeys.PreviewHands12] : 10 === k ? GameDev.ResourceManager.resources[ResourceKeys.PreviewHands10] : GameDev.ResourceManager.resources[ResourceKeys.PreviewHands9]
    };
    UI._getBody = function () {
        return b ? GameDev.ResourceManager.resources[ResourceKeys["PreviewBody" + c]] : GameDev.ResourceManager.resources[ResourceKeys["PreviewBody" + d]]
    };
    UI._getHead = function () {
        return b ? GameDev.ResourceManager.resources[ResourceKeys["PreviewHead" + f]] : GameDev.ResourceManager.resources[ResourceKeys["PreviewHead" + k]]
    };
    var m = function () {
        (b = 1 == Math.randomSign()) ? l() : g()
    },
        l = function () {
            b = !0;
            c = [1, 2, 3, 4, 5, 6, 7, 8].pickRandom();
            f = [1, 4, 7, 5, 8].pickRandom()
        },
        g = function () {
            b = !1;
            d = [9, 10, 11, 12].pickRandom();
            k = [12, 10, 9].pickRandom()
        };
    UI.selectSexClicked = function (a) {
        Sound.click();
        "random" == a ? m() : b = "male" === a;
        b ? ($(".femaleSex").removeClass("selected"), $(".maleSex").removeClass("selected").addClass("selected")) : ($(".maleSex").removeClass("selected"), $(".femaleSex").removeClass("selected").addClass("selected"));
        UI._updatePreview()
    };
    UI.nextBody = function () {
        Sound.click();
        b ? (c += 1, 9 === c && (c = 1)) : (d += 1, 13 === d && (d = 9));
        UI._updatePreview()
    };
    UI.prevBody = function () {
        Sound.click();
        b ? (c -= 1, 0 === c && (c = 8)) : (d -= 1, 8 === d && (d =
            12));
        UI._updatePreview()
    };
    UI.nextHead = function () {
        Sound.click();
        b ? (f += 1, 9 === f && (f = 1)) : (k += 1, 13 === k && (k = 9));
        UI._updatePreview()
    };
    UI.prevHead = function () {
        Sound.click();
        b ? (f -= 1, 0 === f && (f = 8)) : (k -= 1, 8 === k && (k = 12));
        UI._updatePreview()
    };
    UI.closeNewGameView = function () {
        if (!Knowledge.isPlayerKnowledgeAvailable() || GameManager.useKnowledgeAnswered) {
            GameManager.useKnowledgeAnswered || Sound.click();
            GameManager.state = State.Idle;
            $("#mainBackground").fadeIn();
            $("foregroundCanvas").fadeIn();
            var g = $(".simplemodal-data"),
                l = GameManager.company;
            l.name = g.find("#companyName")[0].value;
            l.flags.hasCustomName = l.name != a;
            l.staff[0].name = g.find("#playerName")[0].value;
            l.staff[0].sex = b ? "male" : "female";
            l.staff[0].flags.body = b ? c : d;
            l.staff[0].flags.head = b ? f : k;
            GameManager.flags.gameLengthModifier = parseFloat(g.find("#gameLengthSelection").val());
            l.flags.pirateMode = "on" === g.find("#pirateModeSelection").val();
            GameManager.openSaveView();
            VisualsManager.resetAllCharacters();
            for (g = 0; g < l.staff.length; g++) l.staff[g].startAnimations();
            UI.closeModal()
        } else Sound.click(),
            UI.showUseKnowledgeFromPrevGameDialog()
    };
    UI.showUseKnowledgeFromPrevGameDialog = function () {
        var a = "Since you have played the game before you can choose to use all previously gained hints in this new game.".localize(),
            a = a + ("<br/><br/>" + "Would you like to import all previously gained hints into this game?".localize());
        $("#useKnowledgeFromPreviousGameDialog").find(".useKnowledgeFromPreviousGameMessage").html(PlatformShim.toStaticHtml(a));
        $("#useKnowledgeFromPreviousGameDialog").dialog({
            draggable: !1,
            modal: !0,
            resizable: !1,
            show: "fade",
            zIndex: 5E3,
            open: function () {
                $(this).siblings(".ui-dialog-titlebar").remove();
                $(this).find(".cancelActionButton").clickExclOnce(function () {
                    Sound.click();
                    $("#useKnowledgeFromPreviousGameDialog").dialog("close");
                    GameManager.useKnowledgeAnswered = !0;
                    UI.closeNewGameView()
                });
                $(this).find(".confirmActionButton").clickExclOnce(function () {
                    Sound.click();
                    $("#useKnowledgeFromPreviousGameDialog").dialog("close");
                    Knowledge.usePlayerKnowledge(GameManager.company);
                    GameManager.useKnowledgeAnswered = !0;
                    UI.closeNewGameView()
                });
                UI.maxFont("bolder", $(this).find(".windowTitle"), 34)
            }
        })
    };
    UI._getElementForSaveGame = function (a, b) {
        var c = $("#loadSaveButtonTemplate").clone();
        c.addClass("load");
        if (!a) return c;
        if (void 0 != a.currentWeek) {
            var d = b.getDate(a.currentWeek);
            if (a.saveTime) {
                var f = $.timeago(a.saveTime);
                c.find(".saveTime").text(f).css("font-size", UI._getMaxFontSizeSimple(f, 12, 182, 33))
            }
        }
        "auto" == a.slot ? c.find(".slot").text("Auto".localize()) : c.find(".slot").text("Slot ".localize() + a.slot);
        c.find(".name").text(a.companyName);
        a.pirateMode && c.find(".pirateModeImage").show();
        f = c.find(".cash").text(UI.getShortNumberString(a.cash));
        0 > a.cash ? f.addClass("red") : f.addClass("green");
        void 0 != a.fans && c.find(".fans").text(UI.getShortNumberString(a.fans) + " fans".localize());
        void 0 != d && c.find(".week").text("Y{0} M{1} W{2}".localize("date display").format(d.year, d.month, d.week));
        return c
    };
    UI.closeAllLoadSaveViews = function () {
        $("#loadView").dialog("close");
        $("#saveView").dialog("close");
        $("#newGameView").dialog("close");
        $("#overwriteGameDialog").dialog("close");
        $("#createShareCodeWindow").dialog("close");
        UI.closeContextMenu()
    };
    UI.showLoadView = function (a) {
        var b = $("#loadViewContent");
        b.empty();
        for (var c = new Company("x"), d = 0; d < a.length; d++) {
            var f = a[d],
                g = UI._getElementForSaveGame(f, c);
            b.append(g);
            var k = g.get(0);
            k.saveGame = f;
            k.onclick = function () {
                Sound.click();
                this.saveGame && GameManager.reload(this.saveGame.slot, function () {
                    Sound.playBackgroundMusic()
                })
            };
            k.saveGame ? f = k.saveGame.slot : (f = d) && "auto" != a[0].slot && f++;
            (function (a, b) {
                g.find(".saveSlotOptions").clickExcl(function (c) {
                    Sound.click();
                    c.stopPropagation();
                    UI.showSaveSlotContextMenu(c, a, b)
                })
            })(f, k.saveGame)
        }
        UI.closeAllLoadSaveViews();
        GameManager.pause(!0);
        GameManager.loadScreenOpened = !0;
        $("#loadView").dialog({
            width: 670,
            draggable: !1,
            modal: !0,
            resizable: !1,
            show: "fade",
            zIndex: 6800,
            open: function () {
                var a = $(UI.closeButtonTemplate);
                a.zIndex = 6900;
                a.clickExclOnce(function () {
                    Sound.click();
                    $("#loadView").dialog("close");
                    UI.closeContextMenu();
                    GameManager.resume(!0)
                });
                $(this).find(".windowTitle").css({
                    margin: "5px 50px 5px 65px"
                });
                $(this).parents(".ui-dialog:first").append(a);
                $(this).siblings(".ui-dialog-titlebar").remove();
                $(this).parents(".ui-dialog:first").addClass("tallWindow");
                $(this).parents(".ui-dialog:first").addClass("windowBorder");
                $(this).parents(".ui-dialog:first").removeClass("ui-widget-content")
            },
            close: function () {
                $(this).dialog("destroy");
                this.style.cssText = "display:none;";
                GameManager.resume(!0)
            }
        })
    };
    UI.deleteSaveSlot = function (a) {
        $("#deleteGameDialog").dialog({
            draggable: !1,
            modal: !0,
            resizable: !1,
            show: "fade",
            zIndex: 7E3,
            title: "Attention",
            open: function () {
                $(this).siblings(".ui-dialog-titlebar").remove();
                $(this).find(".cancelActionButton").clickExclOnce(function () {
                    Sound.click();
                    $("#deleteGameDialog").dialog("close")
                });
                $(this).find(".confirmActionButton").clickExclOnce(function () {
                    Sound.click();
                    $("#deleteGameDialog").dialog("close");
                    DataStore.setValue(a, null);
                    DataStore.saveToSlotAsync(a, "");
                    for (var b = 1; 4 >= b; b++) DataStore.saveToSlotAsync(a + "L" + b.toString(), "");
                    DataStore.commit && DataStore.commit();
                    UI.closeAllLoadSaveViews()
                })
            },
            close: function () {
                $(this).dialog("destroy");
                this.style.cssText = "display:none;"
            }
        })
    };
    var n = 0;
    UI.showSaveView = function (a) {
        var b = $("#saveViewContent");
        b.empty();
        $("#loadSaveButtonTemplate").get(0);
        for (var c = new Company("x"), d = 1; 5 >= d; d++) {
            for (var f = null, g = 0; g < a.length; g++) {
                var k = a[g];
                if (k && k.slot == d) {
                    f = a[g];
                    break
                }
            }
            g = null;
            if (f) g = UI._getElementForSaveGame(f, c), g.find(".saveSlotOptions").hide();
            else {
                GameManager.company.slot = d;
                GameManager.save(GameManager.company.slot);
                GameManager.save(GameManager.company.slot + "L1");
                return
            }
            b.append(g);
            g = g.get(0);
            g.saveGame = f;
            g.onclick = function () {
                Sound.click();
                n = this.saveGame.slot;
                UI.showOverwriteView()
            }
        }
        UI.closeAllLoadSaveViews();
        $("#saveView").dialog({
            width: 630,
            draggable: !1,
            modal: !0,
            resizable: !1,
            show: "fade",
            zIndex: 6E3,
            open: function () {
                var a = $(this).find(".windowTitle");
                UI.maxFont("bolder", a, 35);
                a = $(UI.closeButtonTemplate);
                a.zIndex = 6200;
                a.clickExclOnce(function () {
                    Sound.click();
                    $("#saveView").dialog("close")
                });
                $(this).parents(".ui-dialog").append(a);
                $(this).siblings(".ui-dialog-titlebar").remove();
                $(this).parents(".ui-dialog:first").addClass("tallWindow");
                $(this).parents(".ui-dialog:first").addClass("windowBorder");
                $(this).parents(".ui-dialog:first").removeClass("ui-widget-content")
            },
            close: function () {
                $(this).dialog("destroy");
                this.style.cssText = "display:none;";
                GameManager.company.slot ? GameManager.resume(!0) : GameManager.startNewGame()
            }
        })
    };
    UI.showOverwriteView = function () {
        $("#overwriteGameDialog").dialog({
            draggable: !1,
            modal: !0,
            resizable: !1,
            show: "fade",
            zIndex: 7E3,
            title: "Attention",
            open: function () {
                $(this).siblings(".ui-dialog-titlebar").remove();
                $(this).find(".cancelActionButton").clickExclOnce(function () {
                    Sound.click();
                    $("#overwriteGameDialog").dialog("close")
                });
                $(this).find(".confirmActionButton").clickExclOnce(function () {
                    Sound.click();
                    GameManager.company.slot = n;
                    $("#overwriteGameDialog").dialog("close");
                    $("#saveView").dialog("close");
                    $("#splashProgress").fadeOut();
                    GameManager.save(GameManager.company.slot);
                    GameManager.save(GameManager.company.slot + "L1");
                    GameManager.resume(!0)
                })
            },
            close: function () {
                $(this).dialog("destroy");
                this.style.cssText = "display:none;"
            }
        })
    }
})();