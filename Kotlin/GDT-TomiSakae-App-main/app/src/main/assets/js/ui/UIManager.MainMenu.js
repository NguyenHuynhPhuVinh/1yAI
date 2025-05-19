(function () {
    GameFlags.RCLICK_MENU && document.addEventListener("contextmenu", function (a) {
        a.preventDefault();
        UI.toggleMainMenu();
        return !1
    }, !1);
    GameFlags.ESC_MENU && window.addEventListener("keydown", function (a) {
        if (27 == a.which && !a.defaultPrevented) return UI.toggleMainMenu(), a.preventDefault(), !1
    }, !1);
    var a = !1;
    UI.disableMainMenu = function () {
        a = !0
    };
    UI.enableMainMenu = function () {
        a = !1
    };
    UI.isMainMenuDisabled = function () {
        return a
    };
    UI.toggleMainMenu = function () {
        if (!UI.isMainMenuDisabled())
            if (b) c();
            else {
                UI.closePanels();
                var a = $("#mainMenu"),
                    d = a.find(".continueButton");
                GameManager.company || SplashScreen.isVisible() && GameManager.getGameToContinue() ? (d.removeClass("disabled"), d.clickExclOnce(function () {
                    Sound.click();
                    c();
                    GameManager.company || GameManager.continueGame()
                })) : (d.addClass("disabled"), d.clickExclOnce());
                a.find(".newButton").clickExclOnce(function () {
                    Sound.click();
                    GameManager.resume(!0, !0);
                    SplashScreen.isVisible() || UI.hideAboutBadge();
                    UI.closeNewsletterWidget();
                    GameManager.startNewGame()
                });
                d = a.find(".saveButton");
                GameManager.company ? (d.removeClass("disabled"), d.clickExclOnce(function () {
                    Sound.click();
                    c();
                    GameManager.saveActualGame()
                })) : (d.addClass("disabled"), d.clickExclOnce());
                a.find(".loadButton").clickExclOnce(function () {
                    Sound.click();
                    GameManager.openLoadView();
                    c()
                });
                a.find(".highscoreButton").clickExclOnce(function () {
                    Sound.click();
                    UI.toggleHighScorePanel();
                    c()
                });
                a.find(".achievementsButton").clickExclOnce(function () {
                    Sound.click();
                    UI.toggleAchievementPanel();
                    c()
                });
                a.find(".settingsButton").clickExclOnce(function () {
                    Sound.click();
                    UI.toggleSettingsPanel();
                    c()
                });
                PlatformShim.ISWIN8 || a.find(".modsButton").clickExclOnce(function () {
                    Sound.click();
                    UI.toggleModsPanel();
                    c()
                });
                a.find(".helpButton").clickExclOnce(function () {
                    Sound.click();
                    UI.toggleHelpPanel();
                    c()
                });
                a.find(".version").text((GameFlags.G782 ? "V" : "v") + PlatformShim.getVersion());
                a = a.find(".exitButton");
                PlatformShim.ISWIN8 ? a.hide() : a.clickExclOnce(function () {
                    Sound.click();
                    window.close()
                });
                GameManager.pause(!0, !0);
                $("#mainMenu").gdDialog({
                    popout: !0,
                    close: !0,
                    zIndex: 1E4,
                    onClose: function () {
                        GameManager.resume(!0,
                            !0);
                        SplashScreen.isVisible() || UI.hideAboutBadge();
                        UI.closeNewsletterWidget();
                        b = !1
                    },
                    onOpen: function () {
                        UI.showAboutBadge();
                        UI.showNewsletterWidget()
                    }
                });
                b = !0
            }
    };
    var b = !1,
        c = function () {
            $("#mainMenu").dialog("close");
            b = !1
        }
})();