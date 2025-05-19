$(function () {
    $("#mainMenu").appendTo("#splashScreen"), $("#mainMenu").removeClass("windowBorder tallWindow").show(), $("#isAGameTycoonLabel, #gameReadyLabel").remove(), $("#aboutBadge a").attr("target", "_blank"), $("#newsletterSignup .orangeButton").addClass("btn-tm-action btn-tm-action-success"), $("#newsletterSignup .hideNewsletterWidgetButton").addClass("btn-tm-action btn-tm-action-danger");
    for (var e = [{
        cls: "continueButton",
        img: "chevron.png"
    }, {
        cls: "newButton",
        img: "plus.png"
    }, {
        cls: "saveButton",
        img: "save.png"
    }, {
        cls: "loadButton",
        img: "load.png"
    }, {
        cls: "settingsButton",
        img: "gear.png"
    }, {
        cls: "modsButton",
        img: "mods.png"
    }, {
        cls: "highscoreButton",
        img: "star.png"
    }, {
        cls: "achievementsButton",
        img: "badge.png"
    }, {
        cls: "helpButton",
        img: "questionmark.png"
    }, {
        cls: "exitButton",
        img: "x.png"
    }], n = 0; n < e.length; n++) {
        var a = e[n];
        $("#mainMenu ." + a.cls).prepend('<div class="iconContainer"><img src="' + MOD_DIR + "Img/MainMenuIcons/" + a.img + '"></div>')
    }
    document.getElementById("splashScreen").addEventListener("click", function (e) {
        var n = $(e.target);
        if (0 == n.closest(".btn-tm-icon").length) {
            e.stopImmediatePropagation(), e.stopPropagation();
            var a = n.closest("a.btn-tm-discord");
            "_blank" == a.attr("target") && (require("nw.gui").Shell.openExternal(a.attr("href")), e.preventDefault())
        }
    }, !0), $("#splashScreen").on("click", ".btn-tm-icon", function (e) {
        e.stopPropagation()
    });
    var t = "";
    try {
        t = JSON.parse(fs.readFileSync(mod.folder + "/package.json", {
            encoding: "UTF-8"
        })).version
    } catch (e) { }
    $("#gameContainerWrapper").append('<div id="tagModVersion"><span class="tm-version-muted">TomiSakae betaV0.3' + '</span> <a href="https://github.com/NguyenHuynhPhuVinh-TomiSakae/GDT-TomiSakae-Web" target="_blank" class="tm-version-link">Mã Nguồn</a></a>');
    var i = !1;
    UI.toggleMainMenu = function () {
        if (!UI.isMainMenuDisabled())
            if (c()) GameManager.company && (o(), GameManager.resume(!0, !0));
            else {
                UI.closePanels();
                var e = $("#mainMenu"),
                    n = e.find(".continueButton");
                GameManager.company || SplashScreen.isVisible() && GameManager.getGameToContinue() ? (n.removeClass("disabled"), n.clickExclOnce(function () {
                    Sound.click(), o(), GameManager.company ? GameManager.resume(!0, !0) : GameManager.continueGame()
                })) : (n.addClass("disabled"), n.clickExclOnce()), e.find(".newButton").clickExclOnce(function () {
                    Sound.click(), GameManager.resume(!0, !0), SplashScreen.isVisible() || UI.hideAboutBadge(), UI.closeNewsletterWidget(), o(), GameManager.startNewGame()
                });
                var a = e.find(".saveButton");
                GameManager.company ? (a.removeClass("disabled"), a.clickExclOnce(function () {
                    Sound.click(), o(), GameManager.saveActualGame(), GameManager.resume(!0, !0)
                })) : (a.addClass("disabled"), a.clickExclOnce()), e.find(".loadButton").click(function () {
                    Sound.click(), GameManager.openLoadView(), $("#loadViewContent").on("click", ".loadSaveButton", function (e) {
                        o()
                    })
                }), e.find(".highscoreButton").clickExclOnce(function () {
                    Sound.click(), UI.toggleHighScorePanel()
                }), e.find(".achievementsButton").clickExclOnce(function () {
                    Sound.click(), UI.toggleAchievementPanel()
                }), e.find(".settingsButton").click(function () {
                    Sound.click(), UI.toggleSettingsPanel()
                }), PlatformShim.ISWIN8 || e.find(".modsButton").click(function () {
                    Sound.click(), UI.toggleModsPanel()
                }), e.find(".helpButton").click(function () {
                    Sound.click(), UI.toggleHelpPanel()
                }), e.find(".version").text((GameFlags.G782 ? "V" : "v") + PlatformShim.getVersion());
                var t = e.find(".exitButton");
                PlatformShim.ISWIN8 ? t.hide() : t.clickExclOnce(function () {
                    Sound.click(), window.close()
                }),
                    function () {
                        var e = $("#splashScreen");
                        0 == e.length && $("body").append('<div id="splashScreen" style="position: absolute; top: 5000px;"></div>');
                        $("#splashScreenTM").fadeIn("slow"), e.show(), $("body").removeClass("splash-screen-closed")
                    }(), GameManager.pause(!0, !0), i = !0
            }
    };
    var c = function () {
        return i
    },
        o = function () {
            $("#splashScreenTM").fadeOut("slow"), $("#splashScreen").hide(), $("body").addClass("splash-screen-closed"), i = !1
        };
    UI.toggleMainMenu(), $("#splashScreen").attr("id", "splashScreenTM"), $("body").append('<div id="splashScreen" style="position: absolute; top: 5000px;"></div>'), $("#achievementsPanel, #highScorePanel").click(function () {
        var e = $("#mainMenu");
        UI._isAchievementsPanelVisible && (UI.toggleAchievementPanel(), GameManager.company ? o() : e.find(".achievementsButton").clickExclOnce(function () {
            Sound.click(), UI.toggleAchievementPanel()
        })), UI._isHighScorePanelVisible && (UI.toggleHighScorePanel(), GameManager.company ? o() : e.find(".highscoreButton").clickExclOnce(function () {
            Sound.click(), UI.toggleHighScorePanel()
        }))
    })
});