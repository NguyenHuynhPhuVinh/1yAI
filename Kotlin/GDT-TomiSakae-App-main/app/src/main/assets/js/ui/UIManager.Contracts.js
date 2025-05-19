(function () {
    var a = function (a) {
        if ("gameContract" === a.type) return b(a);
        var c = $("#contractTemplate").clone();
        c.removeAttr("id");
        c.find(".contract.name").text(a.name);
        var k = UI._getMaxFontSize("bold {0}pt {1}", UI.IS_SEGOE_UI_INSTALLED ? "Segoe UI" : "Open Sans", 26, 7, 460, 60, [a.name]);
        26 > k && c.find(".contract.name").css("font-size", k + "pt");
        c.find(".sliderTabCaption").append($("<span>{0}</span>".format(a.shortName ? a.shortName : a.name)));
        c.find(".contract.description").html(UI.getHtmlText(a.description));
        a.payment &&
            c.find(".contract.payment").text("Pay: {0}".localize().format(UI.getShortNumberString(a.payment)));
        a.penalty && c.find(".contract.penalty").text("Penalty: {0}".localize().format(UI.getShortNumberString(a.penalty)));
        a.requiredD && c.find(".contract.designPoints").text(a.requiredD);
        a.requiredT && c.find(".contract.technologyPoints").text(a.requiredT);
        a.weeksToFinish && c.find(".contract.duration").text("{0} weeks".localize().format(a.weeksToFinish));
        a.size && ("medium" === a.size ? (c.find(".contract.designPoints").addClass("medium"),
            c.find(".contract.technologyPoints").addClass("medium")) : "large" === a.size && (c.find(".contract.designPoints").addClass("large"), c.find(".contract.technologyPoints").addClass("large")));
        return c
    },
        b = function (a) {
            var b = $("#gameContractTemplate").clone();
            b.removeAttr("id");
            b.find(".contract.name").text(a.name);
            if (a.topic) {
                var c = Topics.topics.first(function (b) {
                    return b.id === a.topic
                }); - 1 == GameManager.company.topics.indexOf(c) && (b.find(".contract.topicNotResearched").text("{0} not researched".localize().format(c.name)),
                    a.disabled = !0)
            }
            b.find(".sliderTabCaption").append($("<span>{0}</span>".format(a.shortName ? a.shortName : a.name)));
            b.find(".contract.description").html(UI.getHtmlText(a.description));
            c = "Min Score: {0}".localize().format(a.minScore);
            a.gameSize && (c += "\n" + "Game Size:".localize() + " " + General.getGameSizeLabel(a.gameSize));
            a.gameAudience && (c += "\n" + "Target Audience:".localize() + " " + General.getAudienceLabel(a.gameAudience));
            b.find(".contract.reqs").html(UI.getHtmlText(c));
            b.find(".contract.royaltyRate").text("Royalties: {0}%".localize().format(Math.floor(100 *
                a.royaltyRate)));
            b.find(".contract.payment").text("Up-front Pay: {0}".localize().format(UI.getShortNumberString(a.payment)));
            b.find(".contract.penalty").text("Penalty: {0}".localize().format(UI.getShortNumberString(a.penalty)));
            if (a.platform) {
                var m = Platforms.allPlatforms.first(function (b) {
                    return b.id === a.platform
                });
                if (m) {
                    c = Platforms.getPlatformImage(m, GameManager.company.currentWeek);
                    b.find(".contract.platform").attr("src", c);
                    var c = -1 != GameManager.company.licencedPlatforms.indexOf(m),
                        l = m.name;
                    c ||
                        (l += " (no license)".localize(), a.disabled = !0, a.tryEnable = function (b) {
                            if (a.topic) {
                                var c = Topics.topics.first(function (b) {
                                    return b.id === a.topic
                                });
                                if (-1 == GameManager.company.topics.indexOf(c)) return !1
                            }
                            UI.buyPlatform(m.name, b);
                            return !1
                        });
                    b.find(".contract.platformLabel").text(l);
                    c || b.find(".contract.platformLabel").addClass("red")
                }
            }
            return b
        },
        c;
    UI.showFindContractWorkMenu = function (b, d) {
        var k = GameManager.company;
        c = ProjectContracts.getAvailable(k, GameManager.uiSettings.selectedContractType);
        if (0 == c.length) k.activeNotifications.remove(b),
            k.notifications.push(new Notification("Contracts".localize("heading"), "There are no contracts currently available.".localize(), {
                type: NotificationType.AutoPopup
            })), GameManager.showPendingNotifications(d);
        else {
            var m = $("#findContractWorkWindow"),
                k = m.find("#contractSliderContainer");
            k.empty();
            for (var l = $('<div class="contractSlider royalSlider rsDefaultInv"></div>'), g = 0; g < c.length; g++) {
                var n = a(c[g]);
                n.append('<div class="cardId" style="display:none">{0}</div>'.format(g));
                l.append(n)
            }
            k.append(l);
            m.find(".okButton").clickExcl(function () {
                Sound.click();
                var a = l.find(".rsActiveSlide").find(".cardId").text();
                if (void 0 != a) {
                    var b = c[parseInt(a)];
                    b && (b.disabled ? b.tryEnable ? b.tryEnable(function () {
                        m.dialog("close");
                        GameManager.startContract(b)
                    }) : m.find(".okButton").parent().effect("shake", {
                        times: 2,
                        distance: 5
                    }, 50) : (m.dialog("close"), GameManager.startContract(b)))
                }
            });
            PlatformShim.ISWIN8 && l.gdSlider();
            m.gdDialog({
                close: !0,
                onClose: function () {
                    GameManager.removeFromActiveNotifications(b);
                    GameManager.resume(!0);
                    d && d()
                },
                onOpen: function () {
                    PlatformShim.ISWIN8 || l.gdSlider()
                }
            })
        }
    }
})();