(function () {
    UI.showSupportUsOptionsWindow = function (a, b) {
        var c = $("#supporterDialog");
        c.find(".rateAndReview").clickExcl(function () {
            Sound.click();
            ghg4.ghg5("supporter:rate/review clicked");
            PlatformShim.goToReviewPage()
        });
        c.find(".sendFeedback").clickExcl(function () {
            Sound.click();
            ghg4.ghg5("supporter:send feedback clicked");
            Windows.System.Launcher.launchUriAsync(new Windows.Foundation.Uri("mailto:support@greenheartgames.com?Subject=Game%20Dev%20Tycoon")).done()
        });
        c.find(".okButton").clickExclOnce(function () {
            Sound.click();
            c.dialog("close")
        });
        c.find(".packOptions").hide();
        DataStore.remoteSettings.supporterPacksEnabled && SupportPacks.getPacks(function (a) {
            a = a.productListings;
            var b = 0;
            if (a.hasOwnProperty("1")) {
                var k = a["1"];
                (function (a) {
                    var b = c.find(".pack1");
                    b.text(a.name + " ({0})".format(a.formattedPrice)).clickExcl(function () {
                        Sound.click();
                        ghg4.ghg5("supporter:pack 1 clicked");
                        SupportPacks.buy(a.name, function () {
                            b.text(a.name + " ({0}) - purchased!".localize().format(a.formattedPrice)).effect("pulsate", {
                                times: 2
                            })
                        })
                    })
                })(k);
                b++
            }
            a.hasOwnProperty("2") && (k = a["2"], function (a) {
                var b = c.find(".pack2");
                b.text(a.name + " ({0})".format(a.formattedPrice));
                b.clickExcl(function () {
                    Sound.click();
                    ghg4.ghg5("supporter:pack 2 clicked");
                    SupportPacks.buy(a.name, function () {
                        b.text(a.name + " ({0}) - purchased!".localize().format(a.formattedPrice)).effect("pulsate", {
                            times: 2
                        })
                    })
                })
            }(k), b++);
            (2 == b || GameFlags.ghg6) && c.find(".packOptions").fadeIn()
        });
        c.gdDialog({
            popout: !0,
            close: !0,
            onClose: function () {
                a && GameManager.removeFromActiveNotifications(a);
                GameManager.resume(!0);
                b && b()
            }
        })
    }
})();
(function (a) {
    var b = [],
        c;
    GameManager.addTickListener(function (a) {
        if (0 != b.length) {
            if (isNaN(c) || 0 === c) c = 1;
            a *= c;
            if (0 !== a)
                for (var d = 0; d < b.length; d++) b[d].tick(a, !1)
        }
    }, !1);
    a.fn.typewrite = function (f) {
        f || (f = {});
        var d = Localization.isRTLLanguage(),
            k = {
                selector: this,
                delay: 100,
                speedUpOnClick: !1,
                callback: null,
                animateScroll: !0,
                scrollPadding: 25,
                scrollPollIntervalInChars: 50
            };
        f && a.extend(k, f);
        d && (k.delay *= 5, k.scrollPollIntervalInChars /= 5);
        c = 1;
        var m = GameManager.gameId,
            l = function (a) {
                GameManager.gameId == m && (c = (c + 2.5).clamp(1,
                    10))
            };
        if (f.speedUpOnClick) {
            var g = k.callback;
            k.callback = function () {
                a(window).off("click", l);
                g()
            }
        }
        for (var n = a(k.selector), r = n.text().replaceAll("<br />", "\n"), p = a("<span></span>"), s = {}, u = "", t = 0; t < r.length; t++)
            if (u += r[t], "[" == u) {
                var q = r.substr(t);
                q.startsWith("[pause:") ? (u = t + 7, t = r.indexOf("]", u), u = r.substr(u, t - u), s[p.children().length] = {
                    type: "pause",
                    value: parseFloat(u)
                }, u = "") : q.startsWith("[delay:") && (u = t + 7, t = r.indexOf("]", u), u = r.substr(u, t - u), s[p.children().length] = {
                    type: "delay",
                    value: u
                }, u = "")
            } else "\n" ==
                u ? (p.append(a("<br />")), u = "") : d ? " " == r[t] && (p.append(a("<span></span>").text(u)), u = "") : (p.append(a("<span></span>").text(u)), u = "");
        "" != u && p.append(a("<span></span>").text(u));
        var v = [];
        p.children().each(function () {
            a(this).css({
                opacity: 0
            })
        });
        n.empty();
        n.append(p);
        var A = 0,
            z = 0,
            B = 0,
            D = p.children().length,
            E = n.parent();
        p.children().each(function (b) {
            (function (a, b) {
                v.push(function () {
                    b.css({
                        opacity: 1
                    });
                    if (k.animateScroll && (B++ >= k.scrollPollIntervalInChars - 1 || a == D - 1)) {
                        B = 0;
                        0 == z && (z = n.height());
                        var c = k.scrollPadding +
                            b.position().top - n.position().top - z;
                        0 < c && A < c && (E.stop().animate({
                            scrollTop: c
                        }, 600), A = c)
                    }
                })
            })(b, a(this))
        });
        var w = createjs.Tween.get(n);
        f.wait && (w = w.wait(f.wait));
        f.soundLoop && (w = w.call(function () {
            Sound.playSoundLoop(f.soundLoop, f.volume)
        }));
        d = 1;
        for (t = 0; t < v.length; t++) {
            if (s.hasOwnProperty(t))
                if ("pause" == s[t].type) {
                    w = w.call(function () {
                        f.soundLoop && Sound.stopSound(f.soundLoop)
                    }).wait(s[t].value).call(function () {
                        f.soundLoop && Sound.playSoundLoop(f.soundLoop, f.volume)
                    }).call(v[t]);
                    continue
                } else "delay" ==
                    s[t].type && (d = "slow" == s[t].value ? 10 : 1);
            w = w.wait(k.delay * d).call(v[t])
        }
        w.call(function () {
            f.soundLoop && Sound.stopSound(f.soundLoop);
            "return-tween" != f.type && -1 != b.indexOf(w) && b.remove(w);
            k.callback && k.callback()
        });
        if ("return-tween" === f.type) return w;
        setTimeout(function () {
            b.push(w);
            if (k.speedUpOnClick) a(window).on("click", l)
        }, k.delay)
    }
})(jQuery);
(function () {
    UI.showPostMortemComplete = function (b, c) {
        GameManager.company.activeNotifications.remove(b);
        var f = GameManager.company.getGameById(b.text);
        if (f) {
            for (var d = a(f), k, m = "", l = 0, g = 0; g < d.length; g++, l++) {
                var n = d[g];
                k || (k = n.category);
                k != n.category && (m += "{n}" + "We have some additional insights:".localize() + "\n", l = 0, k = n.category);
                0 < g && (m += "[pause:500]");
                m += "\n{0}. {1}".format(l + 1, d[g].msg)
            }
            0 === d.length && (m = "No new insights".localize());
            GameManager.company.notifications.push(new Notification("Game Report".localize(),
                "Our post-release analysis of {0} is complete and we got the following results:".localize().format(f.title) + "\n" + m, {
                type: NotificationType.GameReports
            }))
        }
        GameManager.resume(!0);
        c && c()
    };
    var a = function (a) {
        var c = GameManager.company,
            f = [],
            d = "1";
        if (!Knowledge.hasComboKnowledge(c, a)) {
            var k = Knowledge.getComboHintText(a);
            Knowledge.setComboKnowledge(c, a);
            var m = "{0} and {1} is a {2} combination.".localize().format(a.topic.name, a.getGenreDisplayName(), k),
                m = m.replace("a okay", "an okay");
            f.push({
                category: d,
                msg: m
            })
        }
        m =
            a.featureLog.filter(function (a) {
                return "mission" === a.missionType
            }).filter(function (d) {
                return !Knowledge.hasMissionWeightingKnowledge(c, d, a, !1)
            });
        if (0 < m.length) {
            var l = [m.pickRandom()];
            1 < m.length && 0.9 < c.getRandom() && l.push(m.except(l).pickRandom());
            for (m = 0; m < l.length; m++) {
                var g = l[m];
                General.getGameSizeDurationFactor(a.gameSize);
                var n = Missions.getGenreWeighting(g, a),
                    r = Missions.getMissionWithId(g.id),
                    k = Knowledge.getMissionWeightingDisplayText(n, !0),
                    n = "{0} seems to be {1} for this type of game.".localize().format(r.name,
                        k);
                f.push({
                    category: d,
                    msg: n
                });
                Knowledge.setMissionWeightingKnowledge(c, g, a)
            }
        }
        for (m = 0; m < a.platforms.length; m++) {
            var p = a.platforms[m],
                s = a.genre;
            if (!Knowledge.hasPlatformGenreWeightingKnowledge(c, p, s) && (n = GameGenre.getGenreWeighting(p.genreWeightings, s), l = 0.2, 0.7 >= n ? l = 1 : (g = c.gameLog.count(function (c) {
                return c.platforms.first(function (c) {
                    return c.id == p.id && a.genre.id == s.id
                })
            }) - 1, l += 0.4 * g), c.getRandom() < l)) {
                Knowledge.setPlatformGenreWeightingKnowledge(c, p, s);
                k = Knowledge.getFactorAdj(n, !0);
                f.push({
                    category: d,
                    msg: "Platform genre-match ({0}/{1}): {2}.".localize().format(p.name, s.name, k)
                });
                break
            }
        }
        if (c.canSetTargetAudience()) {
            for (var u = a.targetAudience, m = 0; m < a.platforms.length; m++)
                if (p = a.platforms[m], !Knowledge.hasPlatformAudienceWeightingKnowledge(c, p, u) && (n = Platforms.getAudienceWeighting([p], u, !0), l = 0.2, 0.7 >= n ? l = 1 : (g = c.gameLog.count(function (c) {
                    return c.platforms.first(function (c) {
                        return c.id == p.id && a.targetAudience == u
                    })
                }) - 1, l += 0.4 * g), c.getRandom() < l)) {
                    Knowledge.setPlatformAudienceWeightingKnowledge(c,
                        p, u);
                    k = Knowledge.getFactorAdj(n, !0);
                    f.push({
                        category: d,
                        msg: "Platform audience-match ({0}/{1}): {2}.".localize().format(p.name, General.getAudienceLabel(u), k)
                    });
                    break
                } var t = a.topic;
            Knowledge.hasTopicAudienceWeightingKnowledge(c, t, u) || (n = General.getAudienceWeighting(t.audienceWeightings, u), l = 0.2, 0.7 >= n ? l = 1 : (g = c.gameLog.count(function (a) {
                return a.topic.id == t.id && a.targetAudience == u
            }) - 1, l += 0.4 * g), c.getRandom() < l && (Knowledge.setTopicAudienceWeightingKnowledge(c, t, u), k = Knowledge.getFactorAdj(n, !0), f.push({
                category: d,
                msg: "Topic audience-match ({0}/{1}): {2}.".localize().format(t.name, General.getAudienceLabel(u), k)
            })))
        }
        d = "2";
        a.flags.sameGenreTopic && f.push({
            category: d,
            msg: "The market really doesn't like when we publish very similar games too close to each other.".localize()
        });
        if (a.flags.newStaffIds && (l = a.flags.newStaffIds.map(function (a) {
            return GameManager.company.staff.first(function (b) {
                return b.id == a
            })
        }).filter(function (a) {
            return a
        }), 0 < l.length)) {
            n = l[0].name;
            for (m = 1; m < l.length; m++) n += ", {0}".format(l[m].name);
            m = 1 == l.length ? "{0} is still new to the team.".localize("{0} is a single name").format(n) : "{0} are still new to the team.".localize("{0} is a list of names").format(n);
            m += " " + "A few more games and the team will have higher potential".localize();
            f.push({
                category: d,
                msg: m
            })
        }
        1 < c.staff.length && a.flags.teamContribution && 0.8 >= a.flags.teamContribution && f.push({
            category: d,
            msg: "We should try to focus our entire team on the development of a game.".localize()
        });
        "small" != a.gameSize && (a.flags.royaltyRate && a.flags.fansAtLaunch >
            Sales.getTargetFans(c, a) ? 0.2 > c.getRandom() && f.push({
                category: d,
                msg: "Our fan base is big enough to make self-publishing {0} games viable. Unless a publishing deal gives us a great royalty rate we are likely better off publishing {0} games ourselves".localize().format(General.getGameSizeLabel(a.gameSize))
            }) : !a.flags.royaltyRate && a.flags.fansAtLaunch < Sales.getTargetFans(c, a) && 0.2 > c.getRandom() && f.push({
                category: d,
                msg: "Self-publishing {1} games will be most efficient when we have at least {0} fans. Publishing deals can give us great exposure and help us reach more players.".localize().format(UI.getShortNumberString(Sales.getTargetFans(c,
                    a)), General.getGameSizeLabel(a.gameSize))
            }));
        if (c.flags.pirateMode && (d = "3", f.push({
            category: d,
            msg: "Approximately {0}% of players pirated {1}.".localize("{0} is a number, {1} is game title").format(Math.floor(a.flags.piracyRate), a.title)
        }), 0 != a.flags.drmStrength)) {
            switch (a.flags.drmStrength) {
                case 1:
                    k = "acceptable".localize();
                    break;
                case 2:
                    k = "excellent".localize();
                    break;
                case -1:
                    k = "inadequate".localize()
            }
            k && f.push({
                category: d,
                msg: "The effectiveness of our copy protection technology was {0}.".localize().format(k)
            })
        }
        return f
    }
})();
(function () {
    var a;
    UI.showNewsletterWidget = function () {
        if (!UI.isNewsletterWidgetDisabled()) {
            var a = GameManager.getSaveGames();
            a && a.first(function (a) {
                return a && a.currentWeek && 3 < Company.getDate(a.currentWeek).year
            }) && UI._showNewsletterWidget()
        }
    };
    UI.isNewsletterWidgetDisabled = function () {
        return DataStore.getValue("isNewsletterWidgetDisabled")
    };
    UI.disableNewsletterWidget = function () {
        DataStore.setValue("isNewsletterWidgetDisabled", !0)
    };
    UI._showNewsletterWidget = function () {
        a = $("#newsletterSignup");
        a.clearQueue();
        showing = !0;
        a.find(".newsletterIconText").removeAttr("style").text("Sign up to our newsletter".localize());
        a.find(".deleteButton").clickExcl(function () {
            UI.disableNewsletterWidget();
            a.transit({
                opacity: 0
            }, 400);
            setTimeout(function () {
                a.hide()
            }, 400)
        });
        a.find(".orangeButton").clickExcl(function () {
            b(a)
        });
        a.find("input").on("focus", function (b) {
            $(document).click(function (b) {
                a.removeClass("active");
                b.stopPropagation()
            });
            a.click(function (a) {
                a.stopPropagation()
            })
        });
        a.on("mouseenter mouseleave touchstart", function (a) {
            a =
                $(this).find("input").is(":focus") || "mouseenter" === a.type || "touchstart" === a.type;
            $(this).toggleClass("active", a)
        });
        0 < a.length && (a.css("opacity", 0).show(), a.transit({
            opacity: 1
        }, 400))
    };
    UI.closeNewsletterWidget = function () {
        a && a.hide()
    };
    var b = function (a) {
        a.removeClass("active").off("mouseenter mouseleave touchstart").find(".newsletterIconText").text("Signing up...".localize()).css({
            width: "auto",
            "margin-right": "10px"
        });
        a.children().effect("pulsate", {
            times: 10
        }, 1500);
        var b = a.find("input").val();
        $.ajax({
            type: "GET",
            url: "http://greenback.greenheartgames.com/api/newsletter/subscribe",
            data: {
                list: "bpgZ4tZtAeBVss3M0t0PSA",
                email: b,
                "boolean": "true"
            },
            cache: !1
        }).complete(function (b) {
            b = b.responseText;
            a.children().stop(!0, !0).css("opacity", "");
            "1" == b ? (a.find(".newsletterIconText").text("Signup successful!".localize()).typewrite({
                delay: 20
            }), a.css("color", "darkgreen"), setTimeout(function () {
                a.children().effect("pulsate", {
                    times: 2
                }, 400)
            }, 1500), setTimeout(function () {
                a.transit({
                    opacity: 0
                }, 500).hide();
                UI.disableNewsletterWidget()
            },
                2500)) : (a.find(".newsletterIconText").text(b).typewrite({
                    delay: 20
                }), a.css("color", "red"), setTimeout(function () {
                    a.children().effect("pulsate", {
                        times: 2
                    }, 400)
                }, 1500), setTimeout(function () {
                    a.find(".newsletterIconText").text("");
                    a.removeAttr("style");
                    UI._showNewsletterWidget()
                }, 2500))
        })
    }
})();