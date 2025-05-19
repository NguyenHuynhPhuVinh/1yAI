var WindowsIntegration = {};
(function () {
    if (PlatformShim.ISWIN8) {
        var a = WindowsIntegration,
            b = Windows.UI.Notifications.BadgeUpdateManager.createBadgeUpdaterForApplication(),
            c = "Player".localize();
        Windows.System.UserProfile.UserInformation.getDisplayNameAsync().then(function (a) {
            c = a
        });
        a.goToReviewPage = function () {
            var a = new Windows.Foundation.Uri("ms-windows-store:REVIEW?PFN={0}".format(Windows.ApplicationModel.Package.current.id.familyName));
            Windows.System.Launcher.launchUriAsync(a).done()
        };
        a.getUserName = function () {
            return c
        };
        $(document).ready(function () {
            $(document).find("#resumeCommandButton").hide();
            $(document).find("#gamePausedOverlay").hide()
        });
        a.onPause = function () {
            b.clear();
            var a = new Windows.Data.Xml.Dom.XmlDocument;
            a.loadXml('<badge version="1" value="paused"/>');
            b.update(new Windows.UI.Notifications.BadgeNotification(a));
            $(document).find("#pauseCommandButton").hide();
            $(document).find("#gamePausedOverlay").css({
                opacity: 0
            }).show().transit({
                opacity: 1
            });
            $(document).find("#resumeCommandButton").show()
        };
        a.onResume = function () {
            var a = new Windows.Data.Xml.Dom.XmlDocument;
            a.loadXml('<badge version="1" value="none"/>');
            b.update(new Windows.UI.Notifications.BadgeNotification(a));
            $(document).find("#pauseCommandButton").show();
            $(document).find("#gamePausedOverlay").transit({
                opacity: 0
            });
            $(document).find("#resumeCommandButton").hide()
        };
        var f = new Windows.Devices.Input.TouchCapabilities;
        a.isTouchCapable = f.touchPresent;
        var d = Windows.UI.Notifications.TileUpdateManager.createTileUpdaterForApplication();
        a.updateTile = function () {
            var a = Windows.UI.Notifications.TileUpdateManager.getTemplateContent(Windows.UI.Notifications.TileTemplateType.tileWideText01);
            if (!GameManager.company || 0 >= GameManager.company.gameLog.length) d.clear();
            else {
                var b = GameManager.company,
                    c = b.getBestSeller();
                c && (c = c.title);
                for (var f = a.getElementsByTagName("text"), b = [b.name, UI.getShortNumberString(b.cash) + " cash", UI.getShortNumberString(b.fans) + " fans", "Bestseller: " + c.title], c = 0; c < f.length; c++) f[c].appendChild(a.createTextNode(b[c]));
                a = new Windows.UI.Notifications.TileNotification(a);
                d.update(a)
            }
        };
        var k = function (a, b, c, d, f) {
            f || (f = 10);
            do {
                var g = b.format(c),
                    g = new createjs.Text(a, g, "black");
                c--
            } while (g.getMeasuredWidth() > d && c > f);
            return c
        },
            m, l, g = function (a) {
                var b = GameManager.company;
                if (b && 0 !== b.gameLog.length) {
                    var c = document.createElement("canvas");
                    c.width = 558;
                    c.height = 270;
                    m || (m = $('<img src="/images/active-tile.png" />'));
                    var d = function () {
                        var d = c.getContext("2d");
                        d.drawImage(m[0], 0, 0);
                        d.textAlign = "center";
                        var f = UI.IS_SEGOE_UI_INSTALLED ? "bold {0}pt Segoe UI" : "bold {0}pt Open Sans",
                            g = k(b.name, f, 40, 300);
                        d.fillStyle = "black";
                        d.font = f.format(g);
                        d.fillText(b.name, 370, 50);
                        var l = b.gameLog.slice().sort(function (a,
                            b) {
                            return b.unitsSold - a.unitsSold
                        }).first().title,
                            g = k(l, f, 22, 250);
                        d.font = f.format(g);
                        d.fillText(l, 370, 90);
                        l = UI.getShortNumberString(b.fans) + " fans";
                        g = k(l, f, 40, 290);
                        d.font = f.format(g);
                        d.fillText(l, 370, 160);
                        l = UI.getShortNumberString(b.cash) + " cash";
                        g = k(l, f, 32, 250);
                        d.font = f.format(g);
                        d.fillText(l, 370, 210);
                        l = "{0} Achievements unlocked!".format(Achievements.getAllItems().count(function (a) {
                            return Achievements.hasAchieved(a)
                        }));
                        g = k(l, f, 17, 250);
                        d.font = f.format(g);
                        d.fillText(l, 370, 250);
                        DataStore.saveCanvasToFile(c,
                            "active-tile.png", a)
                    };
                    m.complete ? d() : m.load(function () {
                        m.complete = !0;
                        d()
                    })
                }
            };
        a.updateImageTile = function () {
            if (!l) {
                l = !0;
                try {
                    g(function () {
                        try {
                            var a = Windows.UI.Notifications.TileUpdateManager.getTemplateContent(Windows.UI.Notifications.TileTemplateType.tileWideImage),
                                b = a.getElementsByTagName("image");
                            b[0].setAttribute("src", "ms-appdata:///images/logo-wide.png");
                            var c = new Windows.UI.Notifications.TileNotification(a);
                            n.update(c);
                            b[0].setAttribute("src", "ms-appdata:///local/active-tile.png");
                            c = new Windows.UI.Notifications.TileNotification(a);
                            n.update(c)
                        } catch (d) {
                            Logger.LogInfo("game tile update failed", d)
                        }
                        l = !1
                    })
                } catch (a) {
                    Logger.LogInfo("game tile update failed", a)
                }
            }
        };
        var n = Windows.UI.Notifications.TileUpdateManager.createTileUpdaterForApplication();
        a.showGetSteamKey = function () {
            var a = document.getElementById("steamkey");
            a.lastElementChild.innerText = "Get Steam Key".localize();
            a.disabled = !1
        };
        a.getSteamkey = function () {
            Windows.ApplicationModel.Store.CurrentApp.getAppReceiptAsync().done(function (a) {
                a = encodeURIComponent(a);
                PlatformShim.xhr({
                    type: "POST",
                    url: "http://customers.greenheartgames.com/winstore",
                    headers: {
                        "Content-type": "application/x-www-form-urlencoded"
                    },
                    data: "data=" + a
                }, function (a) {
                    if (a && a.responseText)
                        if ("INVALID" == a.responseText) WindowsIntegration.showGetSteamKey(), Logger.LogError("Could not verify app receipt", null, "Could not verify app receipt from Windows Store.".localize());
                        else try {
                            try {
                                var b = new Windows.Foundation.Uri(a.responseText)
                            } catch (c) {
                                WindowsIntegration.showGetSteamKey();
                                PlatformShim.alert(a.responseText, "Response");
                                return
                            }
                            Windows.System.Launcher.launchUriAsync(b).done();
                            WindowsIntegration.showGetSteamKey()
                        } catch (d) {
                            WindowsIntegration.showGetSteamKey(), Logger.LogError("Invalid response: " + a.responseText, d, "Could not verify app receipt from Windows Store.".localize())
                        } else WindowsIntegration.showGetSteamKey(), Logger.LogError("No response from server.", null, "No response from server. Please try again later.".localize())
                }, function (a) {
                    WindowsIntegration.showGetSteamKey();
                    Logger.LogError("Could not verify app receipt", null, "Could not verify app receipt from Windows Store.".localize() +
                        "\n" + a.statusText)
                })
            }, function (a) {
                WindowsIntegration.showGetSteamKey();
                Logger.LogError("Could not get app receipt", null, "Could not get app receipt from Windows Store.".localize() + "\n" + a.statusText)
            })
        }
    }
})();