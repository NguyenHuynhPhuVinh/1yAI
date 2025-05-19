var UI = {};
(function () {
    UI.closeButtonTemplate = PlatformShim.ISWIN8 ? '<div class="closeDialogButtonWin8 metroCharacterButton">\ue10a</div>' : '<div class="closeDialogButton fontCharacterButton icon-remove"></div>';
    UI._resetCallbacks = [];
    UI.reset = function () {
        UI.resetStatusBar();
        for (var a = 0; a < UI._resetCallbacks.length; a++) UI._resetCallbacks[a]()
    };
    UI.isTransitionVisible;
    UI.fadeInTransitionOverlay = function (a) {
        UI.closeNewsletterWidget();
        UI.isTransitionVisible = !0;
        $("#transitionOverlay").show().css({
            opacity: 0
        }).transition({
            opacity: 1
        },
            800).delay(800).queue(function () {
                a && a();
                $(this).dequeue()
            })
    };
    UI.fadeOutTransitionOverlay = function (a) {
        UI.isTransitionVisible = !1;
        $("#transitionOverlay").transition({
            opacity: 0
        }, 400).delay(400).queue(function () {
            $(this).hide();
            a && a();
            $(this).dequeue()
        })
    };
    UI.createDefaultUISettings = function () {
        return {
            stage1SliderValues: [50, 50, 50],
            stage2SliderValues: [50, 50, 50],
            stage3SliderValues: [50, 50, 50],
            selectedGameFeatures: ["Text Based", "Basic Sound"],
            selectedConsoleFeatures: []
        }
    };
    UI.getShortNumberString = function (a) {
        var b;
        1E6 <= Math.abs(a) ? b = "{0}M".localize().format(UI.getLongNumberString(Math.roundToDecimals(a / 1E6, 1))) : 1E3 <= Math.abs(a) && (b = "{0}K".localize().format(UI.getLongNumberString(Math.roundToDecimals(a / 1E3, 1))));
        b || (b = Math.roundToDecimals(a, 1));
        return b
    };
    UI.getPercentNumberString = function (a) {
        return "{0} %".localize().format(Math.roundToDecimals(a, 1))
    };
    UI.getLongNumberString = function (a) {
        if (Math.floor(a) == a) return a = Math.floor(a).toLocaleString(), a.substr(0, a.length - 3);
        for (a = a.toLocaleString();
            "0" == a[a.length -
            1];) a = a.substr(0, a.length - 1);
        return a
    };
    UI.getHtmlText = function (a) {
        a = a.replace(/\n/g, "<br />");
        return window.PlatformShim.toStaticHtml(a)
    };
    UI._showFeatureList = function (a, b) {
        PlatformShim.execUnsafeLocalFunction(function () {
            $.modal.close()
        });
        UI.showFeatureList(a.features, {
            onClose: function () {
                GameManager.removeFromActiveNotifications(a);
                b && b()
            }
        })
    };
    UI.getCharUnderCursor = function () {
        var a = CanvasManager.characterStage;
        if (a.mouseInBounds)
            for (var b = a.mouseX, a = a.mouseY, c = 0; c < VisualsManager.characterOverlays.length; c++) {
                var f =
                    VisualsManager.characterOverlays[c],
                    g = f.x + VisualsManager.toScreenCoordinates(47, CanvasManager.globalScale),
                    n = f.y + VisualsManager.toScreenCoordinates(37, CanvasManager.globalScale),
                    r = 187 * CanvasManager.globalScale,
                    p = 271 * CanvasManager.globalScale;
                if (b >= g && b <= g + r && a >= n && a <= n + p) return f.character
            }
        return null
    };
    UI.salesContainerClick = function (b, c) {
        if (a()) {
            var f = b.screenX,
                l = b.screenY,
                g = [],
                n = function (a) {
                    var b = $("#takeOffMarketDialog");
                    b.find(".confirmActionButton").clickExclOnce(function () {
                        Sound.click();
                        a();
                        b.dialog("close")
                    });
                    b.find(".cancelActionButton").clickExclOnce(function () {
                        Sound.click();
                        b.dialog("close")
                    });
                    b.gdDialog({
                        close: !0,
                        popout: !0,
                        onClose: function () {
                            GameManager.resume(!0)
                        }
                    })
                },
                r = GameManager.company.gameLog.first(function (a) {
                    return a.id === c
                });
            if (!r || !r.flags.mmo || GameManager.company.currentGame && !1 !== GameManager.company.currentGame.flags.isExtensionPack && GameManager.company.currentGame.sequelTo == r.id) {
                var p = GameManager.company.licencedPlatforms.first(function (a) {
                    return a.id === c
                });
                p && g.push({
                    label: "Take off market".localize("menu item"),
                    action: function () {
                        Sound.click();
                        n(function () {
                            p.saleCancelled = !0;
                            Media.createConsoleEndStory(p)
                        })
                    }
                })
            } else g.push({
                label: "Take off market".localize("menu item"),
                action: function () {
                    Sound.click();
                    n(function () {
                        r.flags.saleCancelled = !0;
                        Media.createMMOEndStory(r)
                    })
                }
            });
            1 <= g.length && UI._showContextMenu("salesContainer", g, f, l)
        }
    };
    UI._showContextMenu = function (b, c, f, l) {
        a() && (GDT.fire(this, GDT.eventKeys.ui.contextMenuShowing, {
            type: b,
            items: c
        }), 0 < c.length && (GameManager.pause(!0), Sound.click(), UI.showContextMenu(c, {
            x: f,
            y: l
        })))
    };
    var a = function () {
        return UI.isMenuOpen() ? (Sound.click(), GameManager.resume(!0), UI.closeContextMenu(), !1) : VisualsManager.isAnimatingScroll ? !1 : !0
    };
    UI.overrideClick;
    UI.containerClick = function (d) {
        if (UI.overrideClick) UI.overrideClick(d);
        else if (a()) {
            var f = d.x;
            d = d.y;
            var m = GameManager.company,
                l = [],
                g = "primary";
            void 0 === m.flags.currentZone || 1 === m.flags.currentZone ? b(m, l) : (c(m, l), g = "secondary");
            UI._showContextMenu(g, l, f, d)
        }
    };
    var b = function (a, b) {
        var c = 1 < a.currentLevel ? UI.getCharUnderCursor() : a.staff[0];
        c && 1 != a.currentLevel || (GameManager.company.isCurrentlyDevelopingGame() && -1 != GameManager.company.researchCompleted.indexOf(Research.Marketing) && 0 < GameManager.getDevFeatureLogCount() && b.push({
            label: "Marketing...".localize("menu item"),
            icon: "./images/context menu icons/icon_marketing.svg",
            action: function () {
                Sound.click();
                Tutorial.marketing();
                GameManager.company.notifications.push(new Notification("{MarketingList}"));
                GameManager.showPendingNotifications()
            }
        }), GameManager.isIdle() && !GameManager.currentEngineDev &&
        0 < a.staff.filter(function (a) {
            return a.state === CharacterState.Idle
        }).length && (b.push({
            label: "Develop New Game...".localize("menu item"),
            icon: "./images/context menu icons/icon_new_game.svg",
            action: function () {
                Sound.click();
                GameManager.flags.selectGameActive = !1;
                GameManager.flags.createPack = !1;
                GameManager.transitionToState(State.CreateGame)
            }
        }), -1 != a.researchCompleted.indexOf(Research.Sequels) && 0 < a.getPossibleGamesForSequel().length && b.push({
            label: "Develop Sequel...".localize("menu item"),
            icon: "./images/context menu icons/icon_sequel.svg",
            action: function () {
                Sound.click();
                GameManager.flags.selectGameActive = !0;
                GameManager.flags.createPack = !1;
                GameManager.transitionToState(State.CreateGame)
            }
        }), -1 != a.researchCompleted.indexOf(Research.expansionPack) && 0 < a.getPossibleGamesForPack().length && b.push({
            label: "Develop Expansion Pack...".localize("menu item"),
            icon: "./images/context menu icons/icon_expansion_pack.svg",
            action: function () {
                Sound.click();
                GameManager.flags.selectGameActive = !0;
                GameManager.flags.createPack = !0;
                GameManager.transitionToState(State.CreateGame)
            }
        }),
            a.canDevelopEngine() && b.push({
                label: "Create Custom Engine...".localize("menu item"),
                icon: "./images/context menu icons/icon_customengine.svg",
                action: function () {
                    Sound.click();
                    a.notifications.push(new Notification("{CreateEngine}", "", "", 0));
                    GameManager.showPendingNotifications()
                }
            }), a.flags.contractsEnabled && b.push({
                label: "Find Contract Work...".localize("menu item"),
                icon: "./images/context menu icons/icon_contract.svg",
                action: function () {
                    Sound.click();
                    Tutorial.contracts();
                    GameManager.uiSettings.selectedContractType =
                        "generic";
                    a.notifications.push(new Notification("{FindContractWork}"));
                    GameManager.showPendingNotifications()
                }
            }), a.flags.publishersEnabled && b.push({
                label: "Find Publishing Deal...".localize("menu item"),
                icon: "./images/context menu icons/icon_publishingdeal.svg",
                action: function () {
                    Sound.click();
                    GameManager.uiSettings.selectedContractType = "gameContract";
                    Tutorial.publishers();
                    a.notifications.push(new Notification("{FindContractWork}"));
                    GameManager.showPendingNotifications()
                }
            })), 1 < a.currentLevel && b.push({
                label: "Staff List...".localize("menu item"),
                icon: "./images/context menu icons/icon_staff.svg",
                action: function () {
                    Sound.click();
                    UI.showStaffList()
                }
            }), a && a.gameLog && 0 < a.gameLog.length && b.push({
                label: "Game History...".localize("menu item"),
                icon: "./images/context menu icons/icon_game_history.svg",
                action: function () {
                    Sound.click();
                    UI.showGameHistory()
                }
            }));
        c && (c.state != CharacterState.Researching && c.state != CharacterState.Training && c.state != CharacterState.Vacation && (a.flags.patchData && a.flags.patchData.patchAvailableUntil > GameManager.gameTime && b.push({
            label: "Develop patch ({0})".localize("menu item").format(UI.getShortNumberString(a.flags.patchData.patchCost)),
            icon: "./images/context menu icons/icon_patch.svg",
            action: function () {
                GameManager.uiSettings.selectedChar = c.id;
                Sound.click();
                var b = Training.patchGame;
                b.cost = a.flags.patchData.patchCost;
                a.flags.patchData.patchAvailableUntil = 0;
                GameManager.research(b, "training");
                GameManager.resume(!0)
            }
        }), a.researchEnabled && c.canStartResearch() && b.push({
            label: "Research...".localize("menu item"),
            iconStyleClass: "research",
            icon: "./images/context menu icons/icon_search.svg",
            action: function () {
                Sound.click();
                Tutorial.researchMenu();
                GameManager.uiSettings.selectedChar = c.id;
                GameManager.company.notifications.push(new Notification("{Research}"));
                GameManager.showPendingNotifications()
            }
        }), 0 < a.gameLog.length && a.gameLog.some(function (a) {
            return a.canDoPostMortem()
        }) && b.push({
            label: "Generate game report...".localize("menu item"),
            icon: "./images/context menu icons/icon_game_report.svg",
            action: function () {
                Sound.click();
                GameManager.flags.selectGameActive = !0;
                GameManager.flags.createPack = !1;
                var a = GameManager.gameId;
                UI.showGameHistory(function () {
                    if (a ==
                        GameManager.gameId) {
                        GameManager.flags.selectGameActive = !1;
                        var b = GameManager.flags.selectedGameId;
                        if (b) {
                            var d = GameManager.company.getGameById(b);
                            d && (GameManager.uiSettings.selectedChar = c.id, c.flags.postMortemGameId = b, b = Training.postMortem, b.duration = b.baseDuration * General.getGameSizeDurationFactor(d.gameSize), GameManager.research(b, "training"), GameManager.resume(!0))
                        }
                    }
                }, !1, !0)
            }
        }), 1 < a.currentLevel && (b.push({
            label: "Train...".localize("menu item"),
            icon: "./images/context menu icons/icon_train.svg",
            action: function () {
                Sound.click();
                GameManager.uiSettings.selectedChar = c.id;
                (0 != c.id || 1 < GameManager.company.maxStaff) && (0 === c.id || c.flags.didWelcomeTraining) && Tutorial.training();
                GameManager.company.notifications.push(new Notification("{Training}"));
                GameManager.showPendingNotifications()
            }
        }), c.flags.needsVacation && b.push({
            label: "Send on Vacation".localize("menu item"),
            icon: "./images/context menu icons/icon_vacation.svg",
            action: function () {
                Sound.click();
                c.goOnVacation();
                GameManager.resume(!0)
            }
        }))), 0 != c.id && b.push({
            label: "Fire...".localize("menu item"),
            icon: "./images/context menu icons/icon_staff_fire.svg",
            action: function () {
                Sound.click();
                UI.showFireStaffPrompt(c);
                GameManager.resume(!0)
            }
        }))
    },
        c = function (a, b) {
            var c = a.flags.currentZone,
                f = 0 === c ? GameManager.currentHwProject : GameManager.currentRnDProject;
            null != f ? b.push({
                label: "Cancel Project...".localize("menu item"),
                action: function () {
                    Sound.click();
                    var a = $("#cancelProjectDialog");
                    a.find(".confirmActionButton").clickExclOnce(function () {
                        Sound.click();
                        GameManager.cancelProject(f);
                        a.dialog("close")
                    });
                    a.find(".cancelActionButton").clickExclOnce(function () {
                        Sound.click();
                        a.dialog("close")
                    });
                    a.gdDialog({
                        close: !0,
                        popout: !0,
                        onClose: function () {
                            GameManager.resume(!0)
                        }
                    })
                }
            }) : (0 < General.getAvailableProjects(a, c).length && b.push({
                label: "Start Project...".localize("menu item"),
                action: function () {
                    Sound.click();
                    UI.showGenericProjectWindow(c)
                }
            }), 0 === c && GameManager.canDevelopConsole() && b.push({
                label: "Develop Console...".localize("menu item"),
                action: function () {
                    Sound.click();
                    Tutorial.devConsole();
                    a.notifications.push(new Notification("{DevelopConsole}", "", "", 0));
                    GameManager.showPendingNotifications()
                }
            }))
        };
    UI.setVisible = function (a) {
        a = $(a);
        a.get(0) && (a.removeClass("collapsed"), a.addClass("visible"))
    };
    UI.setInVisible = function (a) {
        a = $(a);
        a.get(0) && (a.removeClass("visible"), a.addClass("collapsed"))
    };
    UI.showSnappedView = function () {
        this.setVisible("#snappedScreen")
    };
    UI.hideSnappedView = function () {
        this.setInVisible("#snappedScreen")
    };
    UI.toggleHelpPanel = function () {
        var a = $("#helpPanel");
        UI.populateHelpPage(a);
        GameManager.pause(!0, !0);
        a.gdDialog({
            popout: !0,
            zIndex: 8E3,
            close: !0,
            onClose: function () {
                GameManager.resume(!0,
                    !0)
            }
        })
    };
    $.fn.gdSlider = function (a) {
        var b = {
            autoHeight: !1,
            autoWidth: !1,
            arrowsNav: !0,
            fadeinLoadedSlide: !1,
            controlNavigationSpacing: 5,
            controlNavigation: "thumbnails",
            imageScaleMode: "none",
            imageAlignCenter: !1,
            loop: !1,
            loopRewind: !1,
            keyboardNavEnabled: !0,
            navigateByClick: !1,
            addActiveClass: !0
        };
        $.extend(b, a);
        this.royalSlider(b)
    };
    UI.populateHelpPage = function (a) {
        $(a).find("#devStages").accordion({
            icons: !1,
            autoHeight: !1,
            active: !1,
            collapsible: !0
        });
        a = $(a).find("#helpMessagesContainer");
        a.empty();
        var b = "Previously shown tutorial messages for the active game are shown here. To see tutorial messages here, please continue an existing game or start a new one. You can start a new game via the app bar.".localize();
        if (GameManager.company) {
            var c = $("<div></div>"),
                f = Tutorial.getAllShownMessages(GameManager.company);
            if (0 == f.length) a.append(b);
            else {
                f = f.reverse();
                for (b = 0; b < f.length; b++) {
                    var g = f[b];
                    c.append($("<h3></h3>").text(g.heading));
                    c.append($("<p></p>").html(g.msg.replaceAll("{n}", "<br/>")))
                }
                a.append(c);
                c.accordion({
                    icons: !1,
                    autoHeight: !1,
                    collapsible: !0
                })
            }
        } else a.append($("<span></span>").text(b))
    };
    UI.toggleSettingsPanel = function () {
        var a = $("#settingsPanel");
        UI.populateSettingsPanel(a);
        GameManager.pause(!0, !0);
        a.gdDialog({
            popout: !0,
            zIndex: 8E3,
            close: !0,
            onClose: function () {
                DataStore.commit && DataStore.commit();
                GameManager.resume(!0, !0)
            }
        });
        a = a.find("#toggleFullscreenButton");
        UI.maxFont(void 0, a, 34);
        UI.showLocalizationCredits(GameManager.getPreferredLanguage(), $("#localizationCredits"), $(".localizationDiscussion"))
    };
    UI.toggleModsPanel = function () {
        UI.populateModsPanel();
        GameManager.pause(!0, !0);
        UI._prepareGreenworks && UI._prepareGreenworks();
        $("#modsPanel").dialog({
            width: 800,
            draggable: !1,
            modal: !0,
            resizable: !1,
            show: "fade",
            zIndex: 8E3,
            position: { my: "center", at: "center", of: window, collision: "fit", offset: "0 50" },
            open: function () {
                var a = $(UI.closeButtonTemplate);
                a.zIndex = 8E3;
                a.clickExclOnce(function () {
                    Sound.click();
                    $("#modsPanel").dialog("close");
                    GameManager.resume(!0)
                });
                $(this).parents(".ui-dialog:first").append(a);
                $(this).siblings(".ui-dialog-titlebar").remove();
                $(this).parents(".ui-dialog:first").addClass("tallWindow");
                $(this).parents(".ui-dialog:first").addClass("windowBorder");
                $(this).parents(".ui-dialog:first").removeClass("ui-widget-content");
                UI.maxFont(void 0, $("#modsPanelButtonMods"), 18);
                UI.maxFont(void 0, $("#modsPanelButtonWorkshop"), 18);
                UI.maxFont(void 0, $("#modsPanelButtonUpload"), 18);
                UI.maxFont(void 0, $("#modsPanelButtonUpdate"), 18)
            },
            close: function () {
                $(this).dialog("destroy");
                this.style.cssText = "display:none;";
                DataStore.commit && DataStore.commit();
                GameManager.resume(!0, !0)
            }
        })
    };
    UI._getElementForMod = function (a) {
        var b = $("#modsButtonTemplate").clone();
        b.find(".modName").text(a.name);

        // Cắt ngắn tên tác giả nếu quá dài
        var authorText = a.author;
        if (authorText && authorText.length > 35) {
            authorText = authorText.substring(0, 32) + "...";
        }
        b.find(".author").text(authorText);

        b.find(".description").addClass("modDescription").text(a.description);

        a.url ? (b.find(".website").append('<a href="{0}">{1}</a>'.format(a.url, "Mod Website".localize())), b.find(".website").clickExcl(function (b) {
            PlatformShim.openUrlExternal(a.url)
        })) : b.find(".website").append("No Website".localize());
        a.active && b.addClass("activeMod");
        b.find(".modVersion").text("v" + a.version);
        "" !== a.image && b.find(".modImage").css({
            backgroundImage: "url('" + a.image + "')"
        });
        if (!0 === a.isWorkshop) {
            var c = $(document.createElement("img")).addClass("unsubscribe-" +
                a.id).attr({
                    src: "./images/greenworks/steam-16x64.png"
                });
            b.find(".modopts").append(c)
        }
        b.enableActiveClassOnClick();
        return b
    };
    UI.populateModsPanel = function () {
        var a = $("#modsPanelContent");
        a.empty();
        ModSupport.sortMods();

        // Cập nhật số lượng mod
        var totalMods = ModSupport.availableMods.length;
        var activeMods = ModSupport.availableMods.filter(function (mod) { return mod.active; }).length;
        var inactiveMods = totalMods - activeMods;

        $("#modsTotalCount").text(totalMods);
        $("#modsActiveCount").text(activeMods);
        $("#modsInactiveCount").text(inactiveMods);

        // Các mod sắp xếp và hiển thị
        var showMods = function (filterText, statusFilter) {
            a.empty();

            var filteredMods = ModSupport.availableMods;

            // Lọc theo trạng thái
            if (statusFilter && statusFilter !== 'all') {
                filteredMods = filteredMods.filter(function (mod) {
                    if (statusFilter === 'active') return mod.active;
                    if (statusFilter === 'inactive') return !mod.active;
                    return true;
                });
            }

            // Lọc theo từ khóa
            if (filterText && filterText.trim() !== '') {
                filterText = filterText.toLowerCase();
                filteredMods = filteredMods.filter(function (mod) {
                    return mod.name.toLowerCase().includes(filterText) ||
                        mod.author.toLowerCase().includes(filterText) ||
                        mod.description.toLowerCase().includes(filterText);
                });
            }

            // Hiển thị thông báo nếu không tìm thấy kết quả
            if (filteredMods.length === 0) {
                var statusText = "";
                if (statusFilter === 'active') statusText = " đã kích hoạt";
                if (statusFilter === 'inactive') statusText = " chưa kích hoạt";

                var message = 'Không tìm thấy mod' + statusText;
                if (filterText && filterText.trim() !== '') {
                    message += ' phù hợp với từ khóa "' + filterText + '"';
                }

                a.append('<div style="padding: 20px; text-align: center; font-size: 16px;">' + message + '</div>');
                return;
            }

            for (var b = 0; b < filteredMods.length; b++) {
                var c = filteredMods[b],
                    f = UI._getElementForMod(c);
                a.append(f);
                f = f.get(0);
                f.mod = c;
                f.onclick = function () {
                    Sound.click();
                    this.mod.active ? ModSupport.disableMod(this.mod) : this.mod.unresolvedDependency || ModSupport.enableMod(this.mod);
                    UI.populateModsPanel();
                };
            }
        };

        // Khởi tạo chức năng tìm kiếm
        var searchInput = $("#modsSearchInput");
        var searchButton = $("#modsSearchButton");
        var resetButton = $("#modsResetButton");
        var statusFilter = $("#modStatusFilter");

        // Gỡ bỏ các event listener cũ để tránh duplicate
        searchButton.off("click");
        resetButton.off("click");
        searchInput.off("keypress");
        statusFilter.off("change");

        // Xử lý sự kiện nút tìm kiếm
        searchButton.on("click", function () {
            Sound.click();
            showMods(searchInput.val(), statusFilter.val());
        });

        // Xử lý sự kiện nút đặt lại
        resetButton.on("click", function () {
            Sound.click();
            searchInput.val("");
            statusFilter.val("all");
            showMods("", "all");
        });

        // Tìm kiếm khi nhấn Enter
        searchInput.on("keypress", function (e) {
            if (e.which === 13) { // Enter key
                Sound.click();
                showMods(searchInput.val(), statusFilter.val());
            }
        });

        // Xử lý sự kiện khi thay đổi bộ lọc trạng thái
        statusFilter.on("change", function () {
            Sound.click();
            showMods(searchInput.val(), statusFilter.val());
        });

        // Hiển thị tất cả mod ban đầu
        showMods("", "all");
    };
    UI.populateSettingsPanel = function (a) {
        SettingsGameplay.updateValuesOnPanel(a);
        a.find(".languageSelection").val(GameManager.getPreferredLanguage()).change(function (a, b) {
            var c = $(this).val();
            GameManager.setPreferredLanguage(c)
        });
        a.find(".hintsToggle").val(GameManager.areHintsEnabled() ? "on" : "off").change(function (a, b) {
            var c = $(this).val();
            GameManager.setHintsEnabled("on" === c)
        });
        a.find(".musicToggle").val(Sound.getMusicAllowed() ? "on" : "off").change(function (a, b) {
            var c = $(this).val();
            Sound.allowMusic("on" === c)
        });
        a.find(".fxToggle").val(Sound.getFxAllowed() ? "on" : "off").change(function (a, b) {
            var c = $(this).val();
            Sound.allowFx("on" === c)
        });
        a.find(".volumeSlider").slider({
            min: 0,
            max: 100,
            range: "min",
            value: Sound.getMasterVolume(),
            animate: !1,
            slide: function (a, b) {
                var c = b.value;
                isNaN(c) || Sound.setMasterVolume(c)
            }
        });
        var b = a.find("#toggleFullscreenButton");
        PlatformShim.ISWIN8 ? a.find("#windowSettings").hide() : b.clickExclOnce(function () {
            var b = PlatformShim.toggleFullscreen();
            DataStore.setValue("windowed",
                !b);
            a.dialog("close")
        });

        // Xử lý sự kiện nút reset data
        var resetButton = a.find("#resetAllDataButton");
        resetButton.off("click").on("click", function () {
            Sound.click();
            UI.confirm("Xóa dữ liệu",
                "Bạn có chắc chắn muốn xóa toàn bộ dữ liệu trò chơi không? Hành động này sẽ xóa tất cả các bản lưu và cài đặt, đồng thời làm mới trang web. Hành động này không thể hoàn tác!",
                function () {
                    // Xóa toàn bộ localStorage
                    window.localStorage.clear();
                    // Đợi 2 giây rồi tải lại trang
                    setTimeout(function () {
                        window.location.reload();
                    }, 2000);
                }
            );
        });

        UI._populateMessagesGrid(a);
        a.find("#tabs").tabs();
        UI.createDraggable(a)
    };
    UI._populateMessagesGrid = function (a) {
        var b = a.find(".messagesGrid");
        b.empty();
        Draggable.get(b) && Draggable.get(b).kill();
        var c = 515,
            c = c / 2;
        h = 46;
        var f = 0,
            g = [],
            n = [],
            r;
        for (r in NotificationType)
            if (NotificationType.hasOwnProperty(r)) {
                var p = NotificationType[r];
                if (p != NotificationType.AutoPopup && p != NotificationType.Default) {
                    n.push(NotificationTypeDisplayString[r]);
                    var s = $(PlatformShim.toStaticHtml('<div class="messagesConfigButton orangeButton">{0}</div>'.format(NotificationTypeDisplayString[r]))).attr("gdt-type",
                        r).appendTo(b);
                    Notification.shouldShowInSideBar(p) && TweenMax.set(s, {
                        x: c
                    });
                    f++;
                    g.push(r)
                }
            } $(".messagesConfigButton").css("font-size", UI._getMaxFontSize("{0}pt {1}", UI.IS_SEGOE_UI_INSTALLED ? "Segoe UI" : "Open Sans", 16, 2, c + 60, h, n));
        var u = function (a, b) {
            if (!(0 >= a.length)) {
                var c = a.attr("gdt-type");
                Notification.setShouldShowInSideBar(c, b)
            }
        };
        for (i = 0; i < 2 * f; i++) n = Math.floor(i / 2), y = n * h, x = i * c % (2 * c),
            function (a) {
                var d = {
                    position: "absolute",
                    width: c - 1,
                    height: h - 1,
                    top: y,
                    left: x
                },
                    d = $("<div/>").css(d);
                d.addClass("cell").addClass(a %
                    2 ? "odd" : "even");
                d.prependTo(b).clickExcl(function () {
                    Sound.click();
                    v(b.find('.messagesConfigButton[gdt-type="{0}"]'.format(g[a])))
                })
            }(n);
        TweenMax.set(b, {
            height: f * h + 1,
            width: 2 * c + 1
        });
        var t = function (a) {
            a = a.parent();
            if (!a) return null;
            var b = Draggable.get(a);
            return b ? b : t(a)
        },
            q = function (a) {
                var c = t(b.parent());
                c && (a ? c.enable() : c.disable())
            },
            v = function (a) {
                if (!(0 >= a.length)) {
                    var b = 0 < a[0]._gsTransform.x ? 0 : c;
                    TweenMax.to(a, 0.4, {
                        x: b,
                        ease: Power2.easeOut
                    });
                    u(a, 0 < b)
                }
            };
        Draggable.create(a.find(".messagesConfigButton"), {
            bounds: b,
            edgeResistance: 0.65,
            type: "x",
            cursor: "pointer",
            throwProps: !0,
            autoScroll: !0,
            liveSnap: !1,
            snap: {
                x: function (a) {
                    return Math.round(a / c) * c
                },
                y: function (a) {
                    return Math.round(a / h) * h
                }
            },
            onDragStart: function () {
                q(!1)
            },
            onDragEnd: function () {
                q(!0)
            },
            onClick: function () {
                Sound.click();
                v($(this.target))
            },
            onThrowComplete: function () {
                u($(this.target), 0 < this.target._gsTransform.x)
            }
        })
    };
    UI.showAboutBadge = function () {
        var a = $("#aboutBadge");
        0 < a.length && (a.css("opacity", 0).show(), a.transit({
            opacity: 1
        }, 400))
    };
    UI.hideAboutBadge =
        function () {
            var a = $("#aboutBadge");
            0 < a.length && a.transit({
                opacity: 0
            }, 400, null, function () {
                a.hide()
            })
        };
    UI.showLocalizationCredits = function (a, b, c) {
        if (b && 1 != !b.length && (c && 1 == c.length && c.empty(), b.empty(), "en" != a)) {
            var f = !1;
            Languages[a + "_moderators"] && (b.append($("<h3></h3>").text("Moderators".localize("localization"))), b.append($("<small></small>").text(Languages[a + "_moderators"])), f = !0);
            Languages[a + "_topContributors"] && (b.append($("<h3></h3>").text("Top Contributors".localize("localization"))), b.append($("<small></small>").text(Languages[a +
                "_topContributors"])), f = !0);
            Languages[a + "_qualityAssurance"] && (b.append($("<h3></h3>").text("Quality Assurance".localize("localization"))), b.append($("<small></small>").text(Languages[a + "_qualityAssurance"])));
            Languages[a + "_html"] && b.append($(Languages[a + "_html"]));
            c && 1 == c.length && Languages[a + "_discussionLink"] && (c.append($('<a href="{0}"></a>'.format(Languages[a + "_discussionLink"])).text("Discuss translation".localize())), f = !0);
            f && (b.append($("<br />")), b.append($("<small></small>").text("Thanks to the many unnamed contributors who greatly helped translating the game!".localize())),
                b.append($("<br />")))
        }
    };
    UI.Font = {
        isInstalled: function (a) {
            a = a.replace(/['"<>]/g, "");
            var b = document.body,
                c = document.createElement("div"),
                f = !1;
            a && (c.innerHTML = "<b style=\"display:inline !important; width:auto !important; font:normal 10px/1 'X',sans-serif !important\">mmmmmmmmwwwwwwww</b><b style=\"display:inline !important; width:auto !important; font:normal 10px/1 'X',monospace !important\">mmmmmmmmwwwwwwww</b>".replace(/X/g, a), c.style.cssText = "position: absolute; visibility: hidden; display: block !important",
                b.insertBefore(c, b.firstChild), a = c.getElementsByTagName("b"), f = a[0].offsetWidth === a[1].offsetWidth, b.removeChild(c));
            return f
        }
    };
    $(document).ready(function () {
        UI.IS_SEGOE_UI_INSTALLED = UI.Font.isInstalled("Segoe UI")
    });
    var f = jQuery.fn.empty;
    jQuery.fn.empty = function () {
        var a = Draggable.get(this);
        null != a && a.kill();
        return f.apply(this, arguments)
    };
    UI.createDraggable = function (a) {
        var b = Draggable.get(a);
        null != b && b.kill();
        a.find(".ui-slider").attr("data-clickable", !0);
        Draggable.create(a, {
            type: "scrollTop",
            onPress: function (a) {
                $(a.target).closest(".selectorButton").addClass("active")
            },
            onRelease: function (a) {
                $(a.target).closest(".selectorButton").removeClass("active")
            },
            edgeResistance: 0.75,
            throwProps: !0,
            cursor: "auto"
        })
    }
})();

UI.confirm = function (title, message, confirmCallback) {
    Sound.click();
    var confirmDialog = $(
        '<div class="windowBorder smallWindow">' +
        '<div class="windowTitle smallerWindowTitle text-center py-3">' + title + '</div>' +
        '<div class="px-5 py-4 text-center text-base leading-relaxed">' + message + '</div>' +
        '<div class="centeredButtonWrapper my-4">' +
        '<div class="confirmActionButton deleteButton selectorButton w-32 mx-2 font-bold">Có</div>' +
        '<div class="cancelActionButton selectorButton orangeButton w-32 mx-2 font-bold">Không</div>' +
        '</div>' +
        '</div>'
    );

    confirmDialog.find(".cancelActionButton").off("click").on("click", function () {
        Sound.click();
        confirmDialog.dialog("close");
    });

    confirmDialog.find(".confirmActionButton").off("click").on("click", function () {
        Sound.click();
        confirmDialog.dialog("close");
        if (confirmCallback) confirmCallback();
    });

    // Thêm dialog vào body để đảm bảo nó tồn tại trong DOM
    confirmDialog.appendTo('body');

    confirmDialog.dialog({
        draggable: false,
        modal: true,
        resizable: false,
        show: "fade",
        zIndex: 8000,
        width: 500,
        height: "auto",
        open: function () {
            $(this).siblings(".ui-dialog-titlebar").remove();
            $(this).parents(".ui-dialog:first").addClass("smallWindow windowBorder rounded-lg shadow-lg");
            $(this).parents(".ui-dialog:first").removeClass("ui-widget-content");
            UI.maxFont("bolder", $(this).find(".windowTitle"), 34);
        },
        close: function () {
            $(this).dialog("destroy");
            $(this).remove();
        }
    });
};