(function () {
    UI.showGenericProjectWindow = function (a) {
        var b = General.getAvailableProjects(GameManager.company, a);
        if (b && b.length) {
            a = $("#genericProjectMenu");
            var c = {
                close: !0
            },
                f = a.find(".genericProjectSliderContainer");
            f.empty();
            var d = $('<div class="projectSlider royalSlider rsDefaultInv"></div>');
            f.append(d);
            for (var f = $("#genericProjectTemplate"), k = 0; k < b.length; k++) {
                var m = b[k],
                    l = f.clone();
                l[0].id = void 0;
                l.find(".projectTitle").text(m.name);
                l.find(".projectIcon").attr("src", m.iconUri);
                l.find(".projectDescription").text(m.description);
                l.find(".projectPointCost").text("Project Size: ".localize() + m.pointsCost);
                d.append(l)
            }
            PlatformShim.ISWIN8 ? d.gdSlider() : c.onOpen = function () {
                d.gdSlider()
            };
            a.find(".okButton").clickExcl(function () {
                Sound.click();
                var a = $(".simplemodal-data").find(".projectSlider").find(".rsActiveSlide").find(".projectTitle").text(),
                    c = b.first(function (b) {
                        return b.name == a
                    });
                c && (GameManager.startProject(c), UI.closeModal())
            });
            UI.showModalContent("#genericProjectMenu", c)
        }
    }
})();