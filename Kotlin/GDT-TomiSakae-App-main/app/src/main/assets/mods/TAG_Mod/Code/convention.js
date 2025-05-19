$(function () {
    tagMod.patch(UI, "showConferenceBoothList", function () {
        $("#conferenceBoothPicker .okButton").replaceWith('<div class="okButton selectorButton windowMainActionButton windowLargeOkButton btn-tm-action">Chọn</div>'), $("#conferenceBoothPicker .okButton").clickExcl(function () {
            Sound.click();
            var e = $("#conferenceBoothPicker .boothTitle").text().trim(),
                t = GameManager.company.booths.first(function (t) {
                    return t.name == e
                });
            GameManager.company.cash >= t.cost ? (GameManager.company.conferenceStandFactor = t.standFactor, GameManager.company.adjustCash(-t.cost, t.name), UI.closeModal()) : $("#conferenceBoothPicker .okButton").effect("shake", {
                times: 2,
                distance: 5
            }, 50)
        }), tagMod.setupSingleContainerListDisplay($("#conferenceBoothPicker .dialogScreen1ContentContainer"), GameManager.company.booths, function (t) {
            var e = $('<div class="tm-list-content"><img class="tm-convention-select-img" /><div class="tm-marketing-select-title boothTitle"></div><div class="tm-marketing-select-desc"></div><div class="tm-marketing-select-cost"></div></div>'),
                n = e.find(".tm-convention-select-img"),
                o = e.find(".tm-marketing-select-title"),
                c = e.find(".tm-marketing-select-desc"),
                i = e.find(".tm-marketing-select-cost"),
                a = "";
            switch (t.name) {
                case "Small Booth".localize():
                case "Medium Booth".localize():
                case "Large Booth".localize():
                case "Custom".localize():
                    a = "big"
            }
            return n.attr("src", MOD_DIR + "Img/Badges/" + a + "-convention-static.png"), o.text(t.name), c.text(t.description), i.text("Costs: {0}".localize().format(UI.getShortNumberString(t.cost))), e
        }, function (t) {
            return "" !== t.description
        })
    }), tagMod.patch(UI, "_startGameConferenceAnimations", function () {
        if (GDT.getDataStore("TAGMod").settings["insta-convention"])
            for (var t = FlippingCounter._activeUITweens, e = 0; e < t.length; e++) t[e].tick(1e9)
    })
});