(function () {
    UI.showGameEnd = function (c, d) {
        var g = $("#gameEndDialog");
        f = 1;
        g.find(".next").hide().clickExclOnce(function () {
            g.dialog("close")
        });
        g.find(".companyName").text(GameManager.company.name).hide();
        $("#gameEndDialog").gdDialog({
            popout: !0,
            onOpen: function () {
                u(g);
                l(g)
            },
            onClose: function () {
                a = [];
                b = [];
                GameManager.removeFromActiveNotifications(c);
                Media.createEndOfGameStories();
                GameManager.resume(!0);
                d && d()
            }
        })
    };
    var a = [],
        b = [],
        c, f = 1,
        d = function () {
            f += 0.4
        },
        k, m = function (d) {
            if (0 !== a.length || c) {
                d *= f;
                for (var g = 0; g <
                    a.length; g++) a[g].tick(d, !1);
                for (g = 0; g < b.length; g++) d = b[g], d.int_value != d._currentValue && (0 != d.int_value && d.text(UI.getLongNumberString(Math.floor(d.int_value))), d._currentValue = d.int_value), d._scale != d._currentScale && (d.transition({
                    scale: d._scale
                }, 0), d._currentScale = d._scale), d._opacity != d._currentOpacity && (d.css("opacity", d._opacity), d._currentOpacity = d._opacity), d._top != d._currentTop && (d.css("top", d._top), d._currentTop = d._top), d._left != d._currentLeft && (d.css("left", d._left), d._currentLeft = d._left);
                c && c.update()
            }
        },
        l = function (f) {
            a = [];
            b = [];
            var g = GameManager.company,
                l = f.find(".counterContainer");
            l.empty();
            var p = document.createElement("canvas");
            p.width = 700;
            p.height = 150;
            var s = new FlippingCounter.FlippingBox(8, 6);
            s.init();
            s.fill(0);
            s.container.x = 41;
            s.container.y = 41;
            FlippingCounter._activeUITweens = a;
            var u = new createjs.Container;
            u.addChild(FlippingCounter.panel);
            u.addChild(s.container);
            u.x = 160;
            u.scaleX = 0.5;
            u.scaleY = 0.5;
            c = new createjs.Stage(p);
            c.addChild(u);
            l.append($(p));
            p = r(g);
            l = f.find(".animationItemsContainer");
            l.empty();
            for (var u = $("#gameEndAnimationItem"), D = 0, E = 0, w = createjs.Tween.get(l), F = 0; F < p.length; F++) {
                var C = u.clone().removeAttr("id");
                C.label = C.find(".label");
                C.value = C.find(".value");
                C.value.text("0").css("opacity", 0);
                C.value._opacity = 0;
                (function (c, d, f) {
                    c.value.int_value = 0;
                    var g = createjs.Tween.get(c.value).wait(D).call(function () {
                        n(c, f)
                    });
                    1 <= d.value && g.wait(1700).set({
                        _opacity: 1
                    }).to({
                        int_value: d.value
                    }, 700).call(function () {
                        E += d.value;
                        s.fill(Math.floor(E))
                    });
                    var k = c.label.text(d.label).typewrite({
                        wait: D +
                            650,
                        delay: 20,
                        soundLoop: "notificationTyping",
                        volume: 0.12,
                        type: "return-tween"
                    });
                    b.push(c.value);
                    c.hide();
                    l.append(c);
                    D += 3700;
                    a.addRange([g, k])
                })(C, p[F], F)
            }
            w.wait(D).call(function () {
                var a = f.find(".companyName").remove();
                l.append(a);
                a.fadeIn();
                f.find(".next").slideDown();
                g.flags.finalScore = E;
                DataStore.setScore(g.uid, g.name, E)
            }).wait(700).call(function () {
                Achievements.activate(Achievements.finishedGame);
                g.flags.pirateMode && Achievements.activate(Achievements.againstAllOdds);
                GameManager.checkAchievements()
            });
            a.push(w);
            $(window).on("click", d);
            w.wait(D).call(function () {
                $(window).off("click", d)
            });
            k || (GameManager.addTickListener(m, !1), k = !0)
        },
        g = [],
        n = function (c, d) {
            0 === d && (g = []);
            var f = createjs.Tween.get(c);
            c.css({
                position: "absolute",
                opacity: 0
            }).show();
            var k = c.width();
            c.height();
            c.css({
                left: 390 - k / 2,
                top: 20
            });
            c._opacity = 0;
            c._scale = 0;
            c._top = 20;
            c._left = 390 - k / 2;
            var l = g.slice();
            f.to({
                _opacity: 1,
                _scale: 1.6
            }, 1500).wait(2500).to({
                _scale: 1,
                _left: 20,
                _top: 130
            }, 400);
            k = createjs.Tween.get(l);
            k.wait(4E3).call(function () {
                c.value.transition({
                    opacity: 0
                })
            }).call(function () {
                for (var b =
                    0; b < l.length; b++) {
                    var c = g[b],
                        d = createjs.Tween.get(c);
                    c.tween && -1 != a.indexOf(c.tween) && a.remove(c.tween);
                    c.tween = d;
                    c.tween.to({
                        _top: c._top + 30
                    }, 400, createjs.Ease.sineIn);
                    a.push(c.tween)
                }
            });
            b.push(c);
            a.push(f);
            a.push(k);
            g.push(c)
        },
        r = function (a) {
            var b = [],
                c = a.gameLog.filter(function (a) {
                    return "small" === a.gameSize
                }),
                d = a.gameLog.filter(function (a) {
                    return "medium" === a.gameSize
                }),
                f = a.gameLog.filter(function (a) {
                    return "large" === a.gameSize
                }),
                g = a.gameLog.filter(function (a) {
                    return "aaa" === a.gameSize
                }),
                k = c.concat(d).concat(f).concat(g),
                l = a.gameLog.slice().sort(function (a, b) {
                    return b.costs - a.costs
                });
            0 < l && (l = l.first(), b.push({
                label: "Most expensive ({0}): {1}".localize().format(l.title, UI.getShortNumberString(l.costs))
            }));
            l = a.gameLog.slice().sort(function (a, b) {
                return b.totalSalesCash - b.costs - (a.totalSalesCash - a.costs)
            });
            if (0 < l) {
                var m = l.first();
                b.push({
                    label: "Most profitable ({0}): {1}".localize().format(m.title, UI.getShortNumberString(m.totalSalesCash - m.costs))
                })
            }
            1 < l.length && (l = l.last(), b.push({
                label: "Least profitable ({0}): {1}".localize().format(l.title,
                    UI.getShortNumberString(l.totalSalesCash - l.costs))
            }));
            l = a.gameLog.map(function (a) {
                return a.topic.name
            });
            if (m = s(l)) {
                var n = m[0],
                    m = m.join(", ");
                b.push({
                    label: "Most used topic ({0}): {1}".localize().format(m, l.count(function (a) {
                        return a == n
                    }))
                })
            }
            l = a.gameLog.map(function (a) {
                return a.genre.name
            });
            if (m = s(l)) {
                var p = m[0],
                    m = m.join(" ,");
                b.push({
                    label: "Most used genre ({0}): {1}".localize().format(m, l.count(function (a) {
                        return a == p
                    }))
                })
            }
            b.push({
                label: "Researched topics: {0}".localize().format(a.topics.length),
                value: 100 * a.topics.length
            });
            l = a.researchCompleted.count();
            b.push({
                label: "Total research completed: {0}".localize().format(l),
                value: 100 * l
            });
            l = k.sum(function (a) {
                return a.designPoints
            });
            b.push({
                label: "Design points generated: {0}".localize().format(l),
                value: 10 * l
            });
            l = k.sum(function (a) {
                return a.technologyPoints
            });
            b.push({
                label: "Technology points generated: {0}".localize().format(l),
                value: 10 * l
            });
            l = c.sum(function (a) {
                return a.score / 10 * 1E3 * GameGenre.getGenreWeighting(a.topic.genreWeightings, a.genre, a.secondGenre)
            });
            b.push({
                label: "Small games: {0}".localize().format(c.count()),
                value: l
            });
            l = d.sum(function (a) {
                return 5E3 * a.score * GameGenre.getGenreWeighting(a.topic.genreWeightings, a.genre, a.secondGenre)
            });
            b.push({
                label: "Medium games: {0}".localize().format(d.count()),
                value: l
            });
            l = f.sum(function (a) {
                return 1E4 * a.score * GameGenre.getGenreWeighting(a.topic.genreWeightings, a.genre, a.secondGenre)
            });
            b.push({
                label: "Large games: {0}".localize().format(f.count()),
                value: l
            });
            l = g.sum(function (a) {
                return 5E4 * a.score * GameGenre.getGenreWeighting(a.topic.genreWeightings,
                    a.genre, a.secondGenre)
            });
            b.push({
                label: "AAA games: {0}".localize().format(g.count()),
                value: l
            });
            l = k.count(function (a) {
                return 7.6 < a.score && 9 > a.score
            });
            b.push({
                label: "Good games: {0}".localize().format(l),
                value: 1E5 * l
            });
            l = k.count(function (a) {
                return 9 <= a.score
            });
            b.push({
                label: "Top hits: {0}".localize().format(l),
                value: 2E6 * l
            });
            l = k.count(function (a) {
                return a.flags.royaltyRate
            });
            b.push({
                label: "Publishers used: {0}".localize().format(l),
                value: 1E3 * l
            });
            l = k.length - l;
            b.push({
                label: "Self-published games: {0}".localize().format(l),
                value: 5E3 * l
            });
            if (c = a.getBestSeller()) l = 1E6 * c.score, b.push({
                label: "Best seller: {0} ({1} units)".localize().format(c.title, UI.getShortNumberString(c.unitsSold)),
                value: l
            });
            b.push({
                label: "Fans: {0}".localize().format(UI.getShortNumberString(a.fans)),
                value: 4 * a.fans
            });
            b.push({
                label: "Cash: {0}".localize().format(UI.getShortNumberString(a.cash)),
                value: (0.01 * a.cash).clamp(0, 5555555)
            });
            a = a.licencedPlatforms.filter(function (a) {
                return a.isCustom
            });
            l = a.sum(function (a) {
                return 1E6 * a.successFactor
            });
            b.push({
                label: "Custom consoles: {0}".localize().format(a.length),
                value: l
            });
            return b
        };
    UI.getThanksForPurchasingNotification = function (a) {
        (a = a ? a : PlatformShim.getUserName()) && 0 != a.length && a != "Player".localize() || (a = "you".localize());
        a = "To: {0}\nFrom: Patrick & Daniel Klug (Greenheart Games).\nHi {0}, we are the creators of Game Dev Tycoon and would like to thank you very much for purchasing the game and supporting us.{n}Game Dev Tycoon is our very first game and it means a lot to us that you are enjoying it. With your purchase you support our little start-up and this will hopefully make sure that we can bring you more games in the future.{n}Seriously, you rock! Thank you very much and have fun with Game Dev Tycoon.".localize().format(a) +
            "\n\nPatrick & Daniel Klug\nGreenheart Games\nwww.greenheartgames.com";
        a = new Notification({
            header: "Thank you".localize("heading"),
            text: a,
            image: "./images/greenheart.png",
            weeksUntilFired: 1,
            previewImage: "./images/notificationIcons/icon_notification_thank_you.png",
            type: NotificationType.CompanyMilestones
        });
        a.adjustFans(2);
        return a
    };
    purchaseGame = function (a, b) {
        ghg4.ghg5("purchased-clicked");
        GameManager.ghg3().requestAppPurchaseAsync(!0).done(function (a) {
            a ? GameManager.ghg2() ? (PlatformShim.alert("It seems that something went wrong when purchasing the app.\nPlease close the app and try again later.\n If the issue persists please contact\n\n{0}".localize().format("support@greenheartgames.com"),
                "Store Confirmation Error".localize("heading")), ghg4.ghg5("purchased but still trial")) : GameManager.ghg2() || (ghg4.ghg5("purchased"), Achievements.activate(Achievements.supporter), GameManager.checkAchievements(), GameManager.company.notifications.push(UI.getThanksForPurchasingNotification()), DataStore.setValue("thankYouMessageShown", !0), b && b()) : ghg4.ghg5("purchase cancelled")
        }, function (a) {
            ghg4.ghg5("purchase unsuccessful", {
                error: a.message,
                "error-number": a.number
            });
            PlatformShim.alert("It seems that something went wrong when trying to purchase the app.\nThis usually indicates a problem with the Store. Please try again later and if the issue persists please contact\n\n{0}".localize().format("support@greenheartgames.com"),
                "Store Error".localize("heading"))
        })
    };
    var p = function (a, b) {
        Sound.click();
        if (GameManager.ghg0()) {
            var c = DataStore.getValue("full-game-uri");
            if (PlatformShim.ISWIN8) {
                c || (c = "http://www.greenheartgames.com/game-dev-tycoon-status");
                var d = new Windows.Foundation.Uri(c);
                Windows.System.Launcher.launchUriAsync(d).then(function (a) {
                    a ? ghg4.ghg5("navigate-to-full-game", {
                        url: c,
                        success: !0
                    }) : (ghg4.ghg5("navigate-to-full-game", {
                        url: c,
                        success: !1
                    }), Windows.UI.Popups.MessageDialog("It seems that something went wrong when trying to go to the Store page for the full app.\nPlease try again and if the issue persists please contact {0} or search for Game Dev Tycoon manually on the Windows Store.".localize().format("support@greenheartgames.com"),
                        "Store Error".localize("heading")).showAsync())
                })
            } else c || (c = "http://www.greenheartgames.com/game-dev-tycoon-downloads"), PlatformShim.openUrlExternal(c)
        } else purchaseGame(b, function () {
            GameManager.ghg2() || a.dialog("close")
        })
    };
    UI.showTrialEnd = function (a, b) {
        if (GameManager.ghg2()) {
            var c = $("#gameEndTrialDialog"),
                d = GameManager.ghg0() ? "lite".localize("as in lite edition of the game") : "trial".localize(),
                f = "You have reached the end of the {0} version.\nIf you like what you've seen so far then you should definitely check out the full game. You can find a brief description of what awaits you below.".localize();
            GameManager.ghg0() || (f += "\n\n<strong>If you unlock the full game you can continue playing the game you've already started.</strong>".localize());
            c.find(".endOfGameBlurb").html(f.replaceAll("\n", "<br/>").format(d));
            d = $("#fullGameFeatureTeaser").clone();
            d.removeAttr("id");
            c.find(".featureTeaserContainer").empty().append(d);
            var g = c.find(".purchaseButton");
            g.text(GameManager.ghg0() ? "Go to full game ...".localize() : " Unlock full game ...".localize()).clickExcl(function () {
                p(c, a)
            });
            c.gdDialog({
                popout: !0,
                close: !1,
                onOpen: function () {
                    u(c);
                    UI.maxFont(void 0, g, 18)
                },
                onClose: function () {
                    GameManager.ghg2() || (GameManager.removeFromActiveNotifications(a), GameManager.resume(!0), b && b())
                }
            })
        } else GameManager.removeFromActiveNotifications(a), GameManager.resume(!0), b && b()
    };
    var s = function (a) {
        for (var b = [], c = 0; c < a.length; c++) - 1 == b.indexOf(a[c]) && b.push(a[c]);
        for (var d = {}, f = 0, c = 0; c < b.length; c++) {
            var g = a.count(function (a) {
                return a == b[c]
            });
            d[c] = g;
            g > f && (f = g)
        }
        return 1 >= f ? null : b.filter(function (a) {
            return d[b.indexOf(a)] ==
                f
        })
    },
        u = function (a) {
            a = a.find(".gameEndStatisticsContainer");
            var b = GameManager.company,
                c = [];
            c.push({
                name: "Cash".localize(),
                value: UI.getShortNumberString(b.cash)
            });
            c.push({
                name: "Total fans".localize(),
                value: b.fans
            });
            c.push({
                name: "Total game releases".localize(),
                value: UI.getShortNumberString(b.gameLog.length)
            });
            if (0 < b.gameLog.length) {
                c.push({
                    name: "Total unit sales".localize(),
                    value: UI.getShortNumberString(b.gameLog.sum(function (a) {
                        return a.unitsSold
                    }))
                });
                c.push({
                    name: "Total design points generated".localize(),
                    value: UI.getShortNumberString(b.gameLog.sum(function (a) {
                        return a.designPoints
                    }))
                });
                c.push({
                    name: "Total technology points generated".localize(),
                    value: UI.getShortNumberString(b.gameLog.sum(function (a) {
                        return a.technologyPoints
                    }))
                });
                c.push({
                    name: "Total research completed".localize(),
                    value: b.researchCompleted.length
                });
                var d = b.gameLog.slice().sort(function (a, b) {
                    return b.unitsSold - a.unitsSold
                }).first();
                c.push({
                    name: "Most sales ({0})".localize().format(d.title),
                    value: UI.getShortNumberString(d.unitsSold)
                });
                d = b.gameLog.slice().sort(function (a, b) {
                    return b.fansChanged - a.fansChanged
                }).first();
                c.push({
                    name: "Most fans ({0})".localize().format(d.title),
                    value: UI.getShortNumberString(d.fansChanged)
                });
                d = b.gameLog.slice().sort(function (a, b) {
                    return b.costs - a.costs
                }).first();
                c.push({
                    name: "Most expensive ({0})".localize().format(d.title),
                    value: UI.getShortNumberString(d.costs)
                });
                var d = b.gameLog.slice().sort(function (a, b) {
                    return b.totalSalesCash - b.costs - (a.totalSalesCash - a.costs)
                }),
                    f = d.first();
                c.push({
                    name: "Most profitable ({0})".localize().format(f.title),
                    value: UI.getShortNumberString(f.totalSalesCash - f.costs)
                });
                1 < d.length && (d = d.last(), c.push({
                    name: "Least profitable ({0})".localize().format(d.title),
                    value: UI.getShortNumberString(d.totalSalesCash - d.costs)
                }));
                d = b.gameLog.map(function (a) {
                    return a.topic.name
                });
                if (f = s(d)) {
                    var g = f[0],
                        f = f.join(", ");
                    c.push({
                        name: "Most used topic ({0})".localize().format(f),
                        value: d.count(function (a) {
                            return a == g
                        })
                    })
                }
                b = b.gameLog.map(function (a) {
                    return a.genre.name
                });
                if (d = s(b)) {
                    var k = d[0],
                        f = d.join(" ,");
                    c.push({
                        name: "Most used genre ({0})".localize().format(f),
                        value: b.count(function (a) {
                            return a == k
                        })
                    })
                }
            }
            a.empty();
            b = $("#gameEndStatisticItem");
            for (d = 0; d < c.length; d++) {
                var f = c[d],
                    l = b.clone();
                l.removeAttr("id");
                l.text("{0}: {1}".format(f.name, f.value));
                a.append(l)
            }
        };
    UI.showgameTrialDialog = function () {
        GameManager.pause(!0);
        Sound.click();
        var a = $("#gameTrialDialog"),
            b = GameManager.ghg0() ? "lite" : "trial",
            c = "Thank you for playing the {0} version.\nIf you like what you've seen so far then you should definitely check out the full game.".localize();
        GameManager.ghg0() ||
            (c += "\n\n<strong>" + "If you unlock the full game you can continue playing the game you've already started.".localize() + "</strong>");
        a.find(".gameTrialBlurb").html(PlatformShim.toStaticHtml(c.replaceAll("\n", "<br/>").format(b)));
        b = $("#fullGameFeatureTeaser").clone();
        b.removeAttr("id");
        a.find(".featureTeaserContainer").empty().append(b);
        a.find(".purchaseButton").text(GameManager.ghg0() ? "Go to full game ...".localize() : " Unlock full game ...".localize()).clickExcl(function () {
            p(a)
        });
        $("#gameTrialDialog").gdDialog({
            popout: !0,
            close: !0,
            onClose: function () {
                GameManager.resume(!0)
            }
        })
    }
})();