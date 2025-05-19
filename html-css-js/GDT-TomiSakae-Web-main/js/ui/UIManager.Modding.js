(function () {
    function a(a) {
        var b = $("<div>"),
            d = a.length - 1;
        a.filter(function (a, c) {
            var l = "{0} - {1}({2}) - {3}".format(a.name, a.author, a.id, "Version: {0}".localize().format(a.version)),
                g = $(".modMismatchModItem").clone();
            g.text(a.name);
            g.attr("title", l);
            d != c ? g.append(", ") : g.append(" ");
            b.append(g)
        });
        return b
    }

    function b(b, f) {
        var d = $("#modMismatchDialog").clone();
        if (0 < b.length) {
            var k = $("#modMismatchTextMissingMods").clone();
            k.append(a(b));
            k.appendTo(d.find("#modMismatchModPrintout"))
        }
        0 < f.length && (k = $("#modMismatchTextAdditionalMods").clone(),
            k.append(a(f)), k.appendTo(d.find("#modMismatchModPrintout")));
        0 < f.length && 0 < b.length && d.find("#modMismatchTextMissingMods").after("<br/>");
        return d
    }
})();
(function () {
    UI._prepareGreenworks = function () {
        if (GameFlags.IS_STEAM && Greenworks && Greenworks.available) {
            var a = $("#modsPanel");
            a.find("#modsPanelActions").show();
            var b = a.find("#modsPanelButtonMods"),
                c = a.find("#modsPanelButtonWorkshop"),
                f = a.find("#modsPanelButtonUpload"),
                d = a.find("#modsPanelButtonPublishNow"),
                k = a.find("#modsPanelButtonUpdate"),
                m = a.find("#modsPanelButtonUpdateNow"),
                l = a.find("#ugcModFolder"),
                g = a.find("#ugcModFolderName"),
                n = a.find("#ugcModTitle"),
                r = a.find("#ugcModDesc"),
                p = a.find("#ugcModImageName"),
                s = a.find("#ugcModImage"),
                u = a.find("#ugcModImagePreview"),
                t = a.find("#ugcModFolderUpd"),
                q = a.find("#ugcModFolderNameUpd"),
                v = a.find("#ugcModTitleUpd"),
                A = a.find("#ugcModDescUpd"),
                z = a.find("#ugcModImageNameUpd"),
                B = a.find("#ugcModImageUpd"),
                D = a.find("#ugcModImagePreviewUpd"),
                E = a.find("#modsPanelWorkshopUpdateInputFields"),
                w = a.find("#ugcMods"),
                F = a.find("#browseForButtonUpload"),
                C = a.find("#browseForImageButtonUpload"),
                J = a.find("#browseForButtonUpdate"),
                K = a.find("#browseForImageButtonUpdate"),
                L = a.find(".ugcModUploadInputFieldR"),
                H = a.find(".ugcModUpdateInputFieldR"),
                G = a.find("#modsPanelUploadStatus"),
                I = a.find("#modsPanelUploadStatusUpd"),
                N = a.find(".modsPanelItem"),
                O = a.find("#modsPanelMods"),
                M = a.find("#modsPanelUpload"),
                R = a.find("#modsPanelUpdate"),
                S = a.find(".workshoplegalagreement"),
                a = a.find(".moddinglegalagreement"),
                Q = !1,
                P = !1;
            b.clickExcl(function () {
                Sound.click();
                N.hide();
                O.show()
            });
            c.clickExcl(function () {
                Sound.click();
                Greenworks.showOverlay()
            });
            f.clickExcl(function () {
                Sound.click();
                N.hide();
                M.show()
            });
            k.clickExcl(function () {
                Sound.click();
                N.hide();
                R.show();
                W(w);
                V(!1);
                V(!0);
                w.append($(document.createElement("li")).text("Please wait...".localize()));
                ba()
            });
            F.clickExcl(function () {
                Sound.click();
                l.click()
            });
            C.clickExcl(function () {
                Sound.click();
                s.click()
            });
            J.clickExcl(function () {
                Sound.click();
                t.click()
            });
            K.clickExcl(function () {
                Sound.click();
                B.click()
            });
            L.bind("change focus input click", function (a) {
                T(!1)
            });
            H.bind("change focus input click", function (a) {
                T(!0)
            });
            S.clickExcl(function () {
                PlatformShim.openUrlExternal("http://steamcommunity.com/sharedfiles/workshoplegalagreement")
            });
            a.clickExcl(function () {
                PlatformShim.openUrlExternal("http://www.greenheartgames.com/legal/game-dev-tycoon-modding-agreement/")
            });
            l.bind("change focus input click", function (a) {
                var b = $(this).val();
                g.val(b);
                "change" === a.type && (G.text("Reading package.json...".localize()), (a = Greenworks.readPackageJsonAsObject(b)) ? (Q = !0, n.val(a.name), r.val(a.description), G.text("Idle".localize())) : (Q = !1, G.text("Error. Invalid Game Dev Tycoon Mod!".localize())), T(!1))
            });
            t.bind("change input focus click", function (a) {
                var b =
                    $(this).val();
                q.val(b);
                "change" === a.type && (I.text("Reading package.json...".localize()), Greenworks.readPackageJsonAsObject(b) ? (P = !0, I.text("Idle".localize())) : (P = !1, I.text("Error. Invalid Game Dev Tycoon Mod!".localize())), T(!0))
            });
            s.bind("change input focus click", function () {
                p.val($(this).val());
                u.attr("src", $(this).val())
            });
            B.bind("change input focus click", function () {
                z.val($(this).val());
                D.attr("src", $(this).val())
            });
            var W = function (a) {
                a.children().each(function (a) {
                    0 <= a && $(this).remove()
                })
            },
                U = function (a) {
                    a.children().each(function (a) {
                        0 <=
                            a && $(this).removeClass("selected")
                    })
                },
                V = function (a) {
                    a ? (v.val(""), A.val(""), t.val(""), q.val(""), B.val(""), z.val(""), D.attr("src", ""), P = !1, T(!0)) : (n.val(""), r.val(""), l.val(""), g.val(""), s.val(""), p.val(""), u.attr("src", ""), Q = !1, T(!1))
                },
                Z = function (a, b) {
                    a ? !0 === b ? m.hasClass("modsPanelWorkshopButtoDisabled") && m.removeClass("modsPanelWorkshopButtoDisabled").addClass("modsPanelWorkshopButton") : d.hasClass("modsPanelWorkshopButtoDisabled") && d.removeClass("modsPanelWorkshopButtoDisabled").addClass("modsPanelWorkshopButton") :
                        !0 === b ? m.hasClass("modsPanelWorkshopButton") && m.removeClass("modsPanelWorkshopButton").addClass("modsPanelWorkshopButtoDisabled") : d.hasClass("modsPanelWorkshopButton") && d.removeClass("modsPanelWorkshopButton").addClass("modsPanelWorkshopButtoDisabled")
                },
                Y = function (a, b) {
                    b ? a ? (v.is(":disabled") && v.removeAttr("disabled"), A.is(":disabled") && A.removeAttr("disabled"), B.is(":disabled") && B.removeAttr("disabled"), t.is(":disabled") && t.removeAttr("disabled"), w.find("li").each(function () {
                        $(this).text($(this).attr("wstitle"))
                    }),
                        w.find("#wsModPleaseWait").remove()) : (v.attr("disabled", !0), A.attr("disabled", !0), B.attr("disabled", !0), t.attr("disabled", !0), w.find("li").each(function () {
                            $(this).text("")
                        }), w.append($(document.createElement("li")).text("Please wait...".localize()).attr("id", "wsModPleaseWait"))) : a ? (n.is(":disabled") && n.removeAttr("disabled"), r.is(":disabled") && r.removeAttr("disabled"), s.is(":disabled") && s.removeAttr("disabled"), l.is(":disabled") && l.removeAttr("disabled")) : (n.attr("disabled", !0), r.attr("disabled",
                            !0), s.attr("disabled", !0), l.attr("disabled", !0))
                },
                T = function (a) {
                    var b = !1;
                    a ? b = P : (b = "" != n.val().trim() && Q, b &= "" != l.val().trim());
                    Z(b, a)
                };
            W(w);
            V(!1);
            V(!0);
            w.append($(document.createElement("li")).text("Please wait...".localize()));
            E.css("opacity", "0");
            var ba = function () {
                Z(!1, !0);
                Greenworks.getPublishedItems(function (a) {
                    if (a) {
                        W(w);
                        for (var b = 0; b < a.length; b++) {
                            var c = a[b],
                                c = $(document.createElement("li")).text(c.title).attr({
                                    wsTitle: c.title,
                                    wsDesc: c.description,
                                    wsId: c.publishedFileId,
                                    wsFile: Greenworks.extractFilename(c.fileName,
                                        !1)
                                }).addClass("workshopItem active").css({
                                    display: "block"
                                });
                            c.clickExcl(function () {
                                V(!0);
                                var a = $(this).attr("wsId"),
                                    b = $(this).attr("wsTitle"),
                                    c = $(this).attr("wsDesc");
                                $(this).attr("wsFile");
                                U(w);
                                $(this).addClass("selected");
                                v.val(b);
                                A.val(c);
                                E.css("opacity", 0 < a.length ? "1" : "0")
                            });
                            w.append(c)
                        }
                        1 > a.length ? w.append($(document.createElement("li")).text("No Mods found.".localize())) : w.children().first().click()
                    }
                    T(!0)
                })
            },
                aa = function (a, b) {
                    if (!0 !== X) {
                        X = !0;
                        Z(!1, b);
                        Y(!1, b);
                        var c = [],
                            d = "";
                        b || ("" == l.val().trim() &&
                            c.push("Folder".localize()), "" == n.val().trim() && c.push("Title".localize()));
                        var f = b ? I : G;
                        if (0 >= c.length)
                            if (d = b ? "Updating...".localize() : "Publishing...".localize(), f.text(d), b) {
                                var g = w.find("li.selected").attr("wsId");
                                Greenworks.createArchiveAndPublishUpdate({
                                    name: v.val(),
                                    desc: A.val(),
                                    image: B.val(),
                                    folder: t.val(),
                                    pid: g,
                                    createImage: !0,
                                    updateJson: !0
                                }, function (a) {
                                    f.text(a)
                                }, function () {
                                    f.text("Update done".localize());
                                    T(!0);
                                    Y(!0, !0);
                                    X = !1;
                                    setTimeout(function () {
                                        f.text("Idle".localize())
                                    }, 2500);
                                    Greenworks.showOverlay(g)
                                })
                            } else Greenworks.createArchiveAndPublish({
                                name: n.val(),
                                desc: r.val(),
                                image: s.val(),
                                folder: l.val(),
                                createImage: !0,
                                updateJson: !0
                            }, function (a) {
                                f.text(a)
                            }, function (a) {
                                f.text("Publish done".localize());
                                T(!1);
                                Y(!0, !1);
                                X = !1;
                                V(!1);
                                setTimeout(function () {
                                    f.text("Idle".localize())
                                }, 2500);
                                Greenworks.showOverlay(a.id)
                            });
                        else d = "Error. Missing {0}".localize().format(c.join(", ")), f.text(d), T(b), Y(!0, b), X = !1, setTimeout(function () {
                            f.text("Idle".localize())
                        }, 2500)
                    }
                },
                X = !1;
            d.clickExcl(function () {
                $(this).hasClass("modsPanelWorkshopButtoDisabled") || (Sound.click(), aa(this,
                    !1))
            });
            m.clickExcl(function () {
                $(this).hasClass("modsPanelWorkshopButtoDisabled") || (Sound.click(), aa(this, !0))
            });
            N.hide();
            O.show();
            T(!1);
            T(!0)
        }
    }
})();