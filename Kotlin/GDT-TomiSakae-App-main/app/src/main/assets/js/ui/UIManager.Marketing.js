(function () {
    UI.showMarketingList = function (a, b) {
        var c = Missions.MarketingMissions;
        $(".selectionOverlayContainer").hide();
        var f = $("#marketingPicker"),
            d = {
                disableCheckForNotifications: !0,
                close: !0,
                onClose: function () {
                    GameManager.removeFromActiveNotifications(a);
                    GameManager.resume(!0);
                    b && b()
                }
            },
            k = f.find(".marketingPickerText"),
            m = GameManager.company.currentGame ? GameManager.company.currentGame.title : "";
        k.text("How do you want to market {0}?".localize().format(m));
        k = f.find(".marketingSliderContainer");
        k.empty();
        var l = $('<div class="marketingVariationContainer royalSlider rsDefaultInv"></div>');
        k.append(l);
        k = $("#genericMarketingTemplate");
        for (m = 0; m < c.length; m++) {
            var g = c[m],
                n = k.clone();
            n.find(".marketingTitle").text(g.name);
            n.find(".marketingShortTitle").text(g.shortName);
            n.find(".marketingDescription").text(g.description);
            n.find(".marketingCashCost").text("Costs: {0}".localize().format(UI.getShortNumberString(g.cost)));
            l.append(n)
        }
        PlatformShim.ISWIN8 ? l.gdSlider() : d.onOpen = function () {
            l.gdSlider()
        };
        f.find(".okButton").clickExcl(function () {
            Sound.click();
            var a = f.find(".rsActiveSlide").find(".marketingTitle").text(),
                b = Missions.MarketingMissions.first(function (b) {
                    return b.name == a
                });
            GameManager.company.cash >= b.cost ? (Missions.executePublishingMission(GameManager.company, b), UI.closeModal()) : f.find(".centeredButtonWrapper").effect("shake", {
                times: 2,
                distance: 5
            }, 50)
        });
        UI.showModalContent("#marketingPicker", d)
    }
})();