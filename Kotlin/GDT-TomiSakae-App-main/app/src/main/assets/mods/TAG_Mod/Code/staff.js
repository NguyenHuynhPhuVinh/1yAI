$(function () {
    function l(e, i, t, f) {
        e.find(".staffWinTitle").text((f.title ? f.title : "Nhân Viên".localize()) + " (" + t.length + ")"), i.empty();
        for (var a = 0; a < t.length; a++) {
            var l = t[a],
                d = tagMod.buildStaffItem(l, f);
            ! function (a) {
                d.click(function (t) {
                    i.find(".tm-staff-item").removeClass("tm-staff-item-selected"), $(t.currentTarget).addClass("tm-staff-item-selected"), tagMod.showStaffSideMenu(e, a, f)
                })
            }(l), i.append(d)
        }
    }
    $("#resources").append('<div id="tagStaffModuleInfo" class="tagStaffModuleInfo"> <div class="tagStaffModuleInfoTitle tm-staff-name">Chizbe Joe</div> <hr> <div class="tagStaffModuleInfoSkills"> <div class="tagStaffModuleInfoSkillItem"> <div class="tagStaffModuleInfoSkillItemStat tagDesign"> <div class="tagStaffModuleInfoSkillItemHeader">{0}:</div> <div class="tagStaffModuleInfoSkillItemNum">0</div> <div class="tagStaffModuleInfoSkillItemHint">++</div> </div> </div> <div class="tagStaffModuleInfoSkillItem"> <div class="tagStaffModuleInfoSkillItemStat tagTech"> <div class="tagStaffModuleInfoSkillItemHeader">{1}:</div> <div class="tagStaffModuleInfoSkillItemNum">0</div> <div class="tagStaffModuleInfoSkillItemHint">++</div> </div> </div> <div class="tagStaffModuleInfoSkillItem"> <div class="tagStaffModuleInfoSkillItemStat tagSpeed"> <div class="tagStaffModuleInfoSkillItemHeader">{2}:</div> <div class="tagStaffModuleInfoSkillItemNum">0</div> <div class="tagStaffModuleInfoSkillItemHint">++</div> </div> </div> <div class="tagStaffModuleInfoSkillItem"> <div class="tagStaffModuleInfoSkillItemStat tagResearch"> <div class="tagStaffModuleInfoSkillItemHeader">{3}:</div> <div class="tagStaffModuleInfoSkillItemNum">0</div> <div class="tagStaffModuleInfoSkillItemHint">++</div> </div> </div> </div> <hr> <div class="tagStaffModuleInfoTitle">{4}</div> <hr> <div class="tagStaffModuleInfoSpec"> <div class="tagStaffModuleInfoSpecLeft"> <img class="tagStaffModuleInfoSpecIcon"></img> <div class="tagStaffModuleInfoSpecName">Engines</div> </div> <div class="tagStaffModuleInfoSpecButt" style="float: right !important;"> <img class="tagStaffModuleInfoSpecButtInner tagArrowLoop"  src="{5}Img/SVG/tag-arrowLoop.svg"></img> </div> </div> <hr> <div class="tagStaffModuleInfoPay"> <div class="tagStaffModuleInfoPayBox"> <div class="tagStaffModuleInfoPayTitle">{6}:</div> <div class="tagStaffModuleInfoPayNum">84,000</div> </div> </div> <hr> <div class="tagStaffModuleInfoActions"><div class="tagStaffModuleInfoSpecButt"> <img class="tagStaffModuleInfoSpecButtInner tagRndBottle" src="{5}Img/SVG/tag-rndBottleWhite.svg"></img> </div><div class="tagStaffModuleInfoSpecButt" onclick="tagMod.goOnVacationButt()"> <img class="tagStaffModuleInfoSpecButtInner tagBeachBall" src="{5}Img/SVG/tag-beachBall.svg"> </img> </div><div class="tagStaffModuleInfoSpecButt" onclick="tagMod.fireStaffButt()"> <img class="tagStaffModuleInfoSpecButtInner tagFlame" src="{5}Img/SVG/tag-flame.svg"> </img> </div> </div> </div>'.format("Thiết Kế".localize(), "Công Nghệ".localize(), "Tốc Độ".localize(), "Nghiên Cứu".localize(), "Chuyên Môn".localize(), MOD_DIR, "Lương".localize())), $("#resources").append('<div id="tagStaffModuleTemplate"> <div class="tagStaffModuleList"> <div class="tagStaffWindowTitle"><img class="tagStaffModuleIcon" src="' + MOD_DIR + 'Img/SVG/tag-staffTrans.svg"></img><div class="staffWinTitle">Nhân Viên (25)</div></div> <hr> <div class="tagStaffStaffList"> </div> </div> </div>'), tagMod.showStaffSideMenu = function (t, a, e) {
        null == e && (e = {}), t.find(".tagStaffModuleInfo").remove();
        var i = $("#tagStaffModuleInfo").clone(),
            f = i.find(".tagStaffModuleInfoSpecLeft");
        f.empty(), e.noSpecialization || f.append(tagMod.buildSpecialization(a)), i.find(".tagStaffModuleInfoTitle").eq(0).text(a.name);
        var l = i.find(".tagStaffModuleInfoSkills"),
            d = l.find(".tagDesign");
        d.find(".tagStaffModuleInfoSkillItemNum").text(Math.floor(500 * a.designFactor).toString()), d.find(".tagStaffModuleInfoSkillItemHint").empty();
        var o = l.find(".tagTech");
        o.find(".tagStaffModuleInfoSkillItemNum").text(Math.floor(500 * a.technologyFactor).toString()), o.find(".tagStaffModuleInfoSkillItemHint").empty();
        var n = l.find(".tagSpeed");
        n.find(".tagStaffModuleInfoSkillItemNum").text(Math.floor(500 * a.speedFactor).toString()), n.find(".tagStaffModuleInfoSkillItemHint").empty();
        var s = l.find(".tagResearch");
        s.find(".tagStaffModuleInfoSkillItemNum").text(Math.floor(500 * a.researchFactor).toString()), s.find(".tagStaffModuleInfoSkillItemHint").empty(), i.find(".tagStaffModuleInfoPayNum").text(UI.getShortNumberString(a.salary)), i.find(".tagStaffModuleInfoSpecButt").hide(), null != e.acceptLabel && (i.find(".tagStaffModuleInfoActions").append('<div class="btn-tm-action btn-tm-accept">' + e.acceptLabel + "</div>"), null == e.staffAvailable || e.staffAvailable(a) || i.find(".btn-tm-accept").addClass("disabledButton")), t.append(i), i.find(".btn-tm-accept").click(function (t) {
            $(t.currentTarget).hasClass("disabledButton") || (e.acceptCallback && e.acceptCallback(a), UI.closeModal())
        })
    }, tagMod.buildStaffItem = function (t, a) {
        null == a && (a = {});
        var e = null != t.efficiency,
            i = $('<div class="tm-staff-item"><div class="tm-staff-item-top"></div><div class="tm-staff-item-middle"></div><div class="tm-staff-item-bottom"></div></div>'),
            f = i.find(".tm-staff-item-top"),
            l = i.find(".tm-staff-item-middle"),
            d = i.find(".tm-staff-item-bottom");
        f.append('<div class="tm-staff-item-name"></div>'), f.find(".tm-staff-item-name").text(t.name), f.append(tagMod.buildSpecialization(t)), l.append('<div class="tm-staff-item-design"></div><div class="tm-staff-item-level"></div><div class="tm-staff-item-tech"></div>');
        var o = l.find(".tm-staff-item-design"),
            n = l.find(".tm-staff-item-level"),
            s = l.find(".tm-staff-item-tech");
        o.text("{0}: {1}".format("Thiết Kế".localize(), tagMod.getFriendlyStat(t.designFactor))), e && n.text("{0} {1}".format("Cấp Độ".localize(), LevelCalculator.getLevel(t.experience))), s.text("{0}: {1}".format("Công Nghệ".localize(), tagMod.getFriendlyStat(t.technologyFactor))), d.append('<div class="tm-staff-item-bar"></div>');
        var c = d.find(".tm-staff-item-bar");
        if (e) {
            var g = tagMod.getFriendlyEfficiency(t.efficiency),
                m = "";
            m += g < .25 ? "tm-staff-item-bar-energy-bad" : g < .5 ? "tm-staff-item-bar-energy-warn" : "tm-staff-item-bar-energy-good", c.append('<div class="tm-staff-item-bar-inner tm-staff-item-bar-energy ' + m + '" style="width: ' + g + '%;">' + "Năng Lượng".localize() + ": " + g + "%</div>")
        } else {
            var S = t.designFactor + t.technologyFactor;
            c.append('<div class="tm-staff-item-bar-inner tm-staff-item-bar-design" style="width: ' + 100 * t.designFactor / S + '%;"></div>'), c.append('<div class="tm-staff-item-bar-inner tm-staff-item-bar-tech" style="width: ' + 100 * t.technologyFactor / S + '%;"></div>')
        }
        return null == a.staffAvailable || a.staffAvailable(t) || i.addClass("tm-staff-item-unavailable"), i
    }, tagMod.buildSpecialization = function (t) {
        var a = "",
            e = "";
        if (t.flags && null !== Missions.getMissionWithId(t.flags.expert)) {
            var i = Missions.getMissionWithId(t.flags.expert);
            a = "specialization-" + i.name.toLowerCase().replace(/[ \/]/g, ""), e = i.name
        } else a = "specialization-none", e = "Không Chuyên Môn".localize();
        return $('<div class="specialization tm-staff-item-specialization ' + a + '">' + e + "</div>")
    }, UI.showStaffList = function (t, a) {
        null == t && (t = {});
        var e = $("#tagStaffModuleTemplate");
        l(e, e.find(".tagStaffStaffList"), GameManager.company.staff, t);
        var i = {
            disableCheckForNotifications: !1,
            close: !0,
            onClose: function () {
                a && a()
            }
        };
        UI.showModalContent("#tagStaffModuleTemplate", i)
    }, UI.showHireStaff = function (t, a) {
        var e = $("#tagStaffModuleTemplate"),
            i = UI._generateJobApplicants();
        l(e, e.find(".tagStaffStaffList"), i, {
            title: "Thuê Nhân Viên".localize(),
            acceptCallback: function (t) {
                UI._hireStaff(t)
            },
            acceptLabel: "Thuê".localize()
        });
        var f = {
            disableCheckForNotifications: !0,
            close: !0,
            onClose: function () {
                GameManager.uiSettings.findStaffData = void 0, VisualsManager.refreshHiringButtons(), GameManager.company.activeNotifications.remove(t), GameManager.resume(!0), a && a()
            }
        };
        UI.showModalContent("#tagStaffModuleTemplate", f)
    }, tagMod.patch(UI, "showFindStaffWindow", function () {
        var t = $("#findStaffDialog .findStaffFilters .selectableGameFeatureItem");
        t.slice(0, 1).addClass("tm-icon tm-icon-lg tm-icon-gear-tech"), t.slice(1, 2).addClass("tm-icon tm-icon-lg tm-icon-game-controller-purple"), t.slice(2, 3).addClass("tm-icon tm-icon-lg tm-icon-pencil")
    })
});