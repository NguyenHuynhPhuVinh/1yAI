(function () {
    UI.showCreateEngineMenu = function (a, b) {
        UI.selectedEngineParts = [];
        var f = $("#createEngineMenu");
        f.find(".selectionOverlayContainer").hide();
        d();
        $(".engineTitleInput")[0].value = "Game Engine #{0}".localize("{0} is number").format(GameManager.company.engines.length + 1);
        UI.showModalContent("#createEngineMenu", {
            disableCheckForNotifications: !0,
            close: !0,
            onOpen: function () {
                c();
                UI.maxFont("bolder", f.find(".windowTitle"), 34)
            },
            onClose: function () {
                GameManager.removeFromActiveNotifications(a);
                GameManager.resume(!0);
                b && b()
            }
        })
    };
    var a = function () {
        GameManager.uiSettings.selectedEngineParts = f.map(function (a) {
            return a.id
        })
    },
        b = function (a) {
            var b = $(".simplemodal-data").find("#createEngineButton");
            a ? b.hasClass("orangeButton") || (b.removeClass("disabledButton").addClass("orangeButton"), b.clickExcl(function () {
                UI.createEngineClick()
            })) : b.hasClass("disabledButton") || b.removeClass("orangeButton").addClass("disabledButton").unbind("click")
        },
        c = function () {
            var a = f.sum(function (a) {
                return Research.getEngineCost(a)
            }),
                c = $(".simplemodal-data").find(".engineCost");
            c.text("Cost: {0}".localize().format(UI.getShortNumberString(a)));
            a > GameManager.company.cash ? (c.addClass("red"), b(!1)) : (c.removeClass("red"), b(0 < f.length))
        },
        f = [],
        d = function () {
            var a = $(".enginePartsContainer"),
                b = General.getAvailableEngineParts(GameManager.company).groupBy(function (a) {
                    return a.category
                });
            a.empty();
            var d = null;
            f = [];
            for (var g = function (a, b) {
                a.hasClass("selectedFeature") ? (a.removeClass("selectedFeature"), f.remove(b)) : ($(".simplemodal-data").find(".enginePartsContainer"), a.addClass("selectedFeature"),
                    f.push(b))
            }, n = 0; n < b.length; n++) {
                var r = b[n];
                r.category != d && (a.append($('<div class="featureSelectionCategoryHeading">{0}</div>'.format(r.categoryDisplayName))), d = r.category);
                var p = UI.generateFeatureElement(r);
                p.find(".featureContent").text("{0} ({1})".format(r.name, UI.getShortNumberString(Research.getEngineCost(r))));
                p.addClass("radioButton");
                (function (a, b) {
                    a.clickExcl(function () {
                        g(a, b);
                        c()
                    })
                })(p, r);
                GameManager.uiSettings.selectedEngineParts && -1 != GameManager.uiSettings.selectedEngineParts.indexOf(r.id) &&
                    g(p, r);
                a.append(p)
            }
            UI.createDraggable(a)
        };
    UI.createEngineClick = function () {
        UI.selectedEngineParts = f;
        a();
        if (0 !== UI.selectedEngineParts.length) {
            var b = UI.selectedEngineParts.sum(function (a) {
                return Research.getEngineCost(a)
            });
            if (!(GameManager.company.cash < b)) {
                var c = $(".simplemodal-data").find(".engineTitleInput")[0].value;
                UI.closeModal(function () {
                    GameManager.createEngine(c, UI.selectedEngineParts)
                })
            }
        }
    }
})();