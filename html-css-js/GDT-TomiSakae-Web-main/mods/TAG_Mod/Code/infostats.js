$(function () {
    $("#resources").append(('<div id="tagInfoStatsWindowTemplate" class="tagInfoStatsWindow"> <div class="tagInfStHeader"><img class="tagInfStIcon" src="' + MOD_DIR + 'Img/SVG/tag-infoStatsIcon.svg"></img>{0}</div> <hr> <div class="tagInfStNav"> <div class="tagInfStMoneyTab tagInfStTab" onclick="tagMod.infStMoneyTab();">{1}</div> <div class="tagInfStPayrollTab tagInfStTab" onclick="tagMod.infStPayrollTab();">{2}</div> <div class="tagInfStGamesTab tagInfStTab" onclick="tagMod.infStGamesTab();">{3}</div> <div class="tagInfStConsoleTab tagInfStTab" onclick="tagMod.infStConsoleTab();">{4}</div> </div> <hr> <div class="tagInfStStatContainer"> <div class="tagInfStChartContainer"></div><div class="tagInfStChartOptsIcon icon-reorder" onclick="tagMod.showInfoStatsChartOptions();"></div><div class="tagChartOptionsSlide"><div class="tagInfStSlideOpt" onclick="tagMod.makeInfoChartWeekly();">{5}</div> <hr> <div class="tagInfStSlideOpt" onclick="tagMod.makeInfoChartMonthly();">{6}</div> <hr> <div class="tagInfStSlideOpt" onclick="tagMod.makeInfoChartAnnually();">{7}</div></div><div class="tagVR"></div> </div></div>').format("Thông tin & Thống kê".localize(), "Tiền".localize(), "Lương".localize(), "Trò chơi".localize(), "Bảng điều khiển".localize(), "Hàng tuần".localize(), "Hàng tháng".localize(), "Hàng năm".localize()));
    var S = null,
        c = "weekly",
        I = null;

    function a() {
        $("#tagInfoStatsWindow").find(".tagInfStChartContainer").empty(), $("#tagInfoStatsWindow").find(".tagInfStChartContainer").html('<canvas class="tagInfStChart"></canvas><div class="tm-info-stats-no-data" style="display: none">{0}</div>'.format("Không có dữ liệu".localize()));
        var i = $("#tagInfoStatsWindow").find(".tagInfStChart").get(0).getContext("2d"),
            t = {
                scaleLineColor: "rgba(20,20,20,.7)",
                scaleLabel: function (t) {
                    return UI.getShortNumberString(t.value)
                },
                tooltipTemplate: "<%=UI.getShortNumberString(value)%>",
                multiTooltipTemplate: "<%=UI.getShortNumberString(value)%>",
                scaleLineWidth: 1,
                scaleShowGridLines: !1,
                scaleFontFamily: "'Roboto', sans-serif",
                scaleFontSize: 12,
                scaleFontStyle: "normal",
                scaleFontColor: GDT.getDataStore("TAGMod").settings["dark-mode"] ? "#c1cedf" : "#666",
                pointDotRadius: 4,
                datasetStrokeWidth: 2,
                bezierCurve: !1
            };
        if (null == I) {
            function a(t, a, n, o) {
                var e = i.createLinearGradient(0, 0, 0, 350);
                e.addColorStop(0, t), e.addColorStop(1, a), I.push({
                    strokeColor: n,
                    pointColor: o,
                    gradient: e
                })
            }
            I = [], a("rgba(57, 181, 74, 0.5)", "rgba(250,250,250,0)", "#39b54a", "#39b54a"), a("rgba(224, 47, 37, 0.5)", "rgba(250,250,250,0)", "#e02f25", "#e02f25")
        }
        var n = 24;
        switch (c) {
            case "monthly":
                n *= 4;
                break;
            case "yearly":
                n *= 24
        }
        for (var o = tagMod.intToDate(GameManager.company.currentWeek - n), e = [], l = [], s = 0; s < S.length; s++) {
            for (var d = tagMod.queryStat(S[s], {
                granularity: c,
                start: o
            }), f = [], g = 0; g < d.length; g++) f.push(d[g].value), 0 == s && l.push(tagMod.dateToString(d[g].date, c));
            e.push({
                fillColor: I[s].gradient,
                strokeColor: I[s].strokeColor,
                pointColor: I[s].pointColor,
                pointStrokeColor: "#fff",
                data: f
            })
        }
        var r = {
            labels: l,
            datasets: e
        };
        0 < r.labels.length ? new Chart(i).Line(r, t) : $("#tagInfoStatsWindow .tagInfStChartContainer .tm-info-stats-no-data").show()
    }
    tagMod.showInfoStatsChartOptions = function () {
        $("#tagInfoStatsWindow").find(".tagChartOptionsSlide").slideToggle(200)
    }, tagMod.makeInfoChartWeekly = function () {
        $("#tagInfoStatsWindow").find(".tagChartOptionsSlide").hide(), $("#tagInfoStatsWindow").find(".tagInfStSlideOpt").removeClass("tagBoldFont"), $("#tagInfoStatsWindow").find(".tagInfStSlideOpt").eq(0).addClass("tagBoldFont"), c = "weekly", a()
    }, tagMod.makeInfoChartMonthly = function () {
        $("#tagInfoStatsWindow").find(".tagChartOptionsSlide").hide(), $("#tagInfoStatsWindow").find(".tagInfStSlideOpt").removeClass("tagBoldFont"), $("#tagInfoStatsWindow").find(".tagInfStSlideOpt").eq(1).addClass("tagBoldFont"), c = "monthly", a()
    }, tagMod.makeInfoChartAnnually = function () {
        $("#tagInfoStatsWindow").find(".tagChartOptionsSlide").hide(), $("#tagInfoStatsWindow").find(".tagInfStSlideOpt").removeClass("tagBoldFont"), $("#tagInfoStatsWindow").find(".tagInfStSlideOpt").eq(2).addClass("tagBoldFont"), c = "yearly", a()
    }, tagMod.infStMoneyTab = function () {
        var t = $("#tagInfoStatsWindow").find(".tagInfStMoneyTab");
        t.siblings(".tagInfStTab").removeClass("tagInfStTabSelected"), t.addClass("tagInfStTabSelected"), S = ["revenue", "cost"], a()
    }, tagMod.infStGamesTab = function () {
        var t = $("#tagInfoStatsWindow").find(".tagInfStGamesTab");
        t.siblings(".tagInfStTab").removeClass("tagInfStTabSelected"), t.addClass("tagInfStTabSelected"), S = ["game.sales"], a()
    }, tagMod.infStConsoleTab = function () {
        var t = $("#tagInfoStatsWindow").find(".tagInfStConsoleTab");
        t.siblings(".tagInfStTab").removeClass("tagInfStTabSelected"), t.addClass("tagInfStTabSelected"), S = ["console.sales"], a()
    }, tagMod.infStPayrollTab = function () {
        var t = $("#tagInfoStatsWindow").find(".tagInfStPayrollTab");
        t.siblings(".tagInfStTab").removeClass("tagInfStTabSelected"), t.addClass("tagInfStTabSelected"), S = ["staff.salary"], a()
    }, tagMod.showInfoStats = function () {
        var t = $("#tagInfoStatsWindowTemplate").clone(),
            a = {
                close: !0,
                disableCheckForNotifications: !0,
                onOpen: function () {
                    UI.closeContextMenu(), t.attr("id", "tagInfoStatsWindow"), $("#tagInfoStatsWindow").find(".tagChartOptionsSlide").hide(), $("#tagInfoStatsWindow").find(".tagInfStSlideOpt").removeClass("tagBoldFont"), $("#tagInfoStatsWindow").find(".tagInfStSlideOpt").eq(0).addClass("tagBoldFont"), tagMod.infStMoneyTab()
                },
                onClose: function () {
                    GameManager.resume(!0)
                }
            };
        UI.showModalContent(t, a)
    }
});