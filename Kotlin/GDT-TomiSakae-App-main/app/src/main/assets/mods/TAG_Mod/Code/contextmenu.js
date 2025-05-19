$(function () {
    var o = UI.showContextMenu.bind(UI);
    UI.showContextMenu = function (l, e) {
        for (var n = 0; n < l.length; n++) "./images/context menu icons/icon_game_report.svg" != l[n].icon && "./images/context menu icons/icon_staff.svg" != l[n].icon || (l.splice(n, 1), n--);
        o(l, e);
        var t = UI.getCharUnderCursor(),
            r = !1,
            u = !0;
        t ? (1 < GameManager.company.currentLevel ? ($("#contextMenu").addClass("tm-staff-menu"), r = !0) : $("#contextMenu").addClass("tm-general-menu"), $("#contextMenu").prepend(tagMod.buildStaffItem(t))) : $("#contextMenu").addClass("tm-general-menu"), $("#contextMenu .contextMenuItem").removeClass("contextMenuItem contextMenuButton showState").addClass("btn-tm-icon" + (r ? " btn-tm-icon-only" : "")), $("#contextMenu .btn-tm-icon").each(function (e) {
            if (!(e >= l.length)) {
                var n = $(this),
                    t = l[e],
                    o = t.icon || t.label,
                    a = t.label,
                    c = "",
                    s = "",
                    i = !1;
                switch (o) {
                    case "./images/context menu icons/icon_new_game.svg":
                        c = "plus", a = "Trò Chơi Mới".localize(), s = "newGameButton btn-moss-green";
                        break;
                    case "./images/context menu icons/icon_sequel.svg":
                        c = "plusPlus", a = "Phần Tiếp Theo".localize(), s = "sequelButton btn-moss-green";
                        break;
                    case "./images/context menu icons/icon_contract.svg":
                        c = "triBars", a = "Hợp Đồng".localize(), s = "contractButton btn-intense-orange";
                        break;
                    case "./images/context menu icons/icon_game_history.svg":
                        c = "hourglass", a = "Lịch Sử Game".localize(), s = "gameHistoryButton btn-purple-blue";
                        break;
                    case "./images/context menu icons/icon_search.svg":
                        c = "rndBottleWhite", a = "Bắt Đầu Nghiên Cứu".localize(), s = "researchButton btn-research-blue";
                        break;
                    case "./images/context menu icons/icon_customengine.svg":
                        c = "gearWheel", a = "Phát Triển Engine".localize(), s = "ctxEngineButton btn-hot-pink";
                        break;
                    case "./images/context menu icons/icon_train.svg":
                        c = "ribbon", a = "Đào Tạo".localize(), s = "trainButton btn-ice-teal";
                        break;
                    case "./images/context menu icons/icon_staff_fire.svg":
                        c = "flame", a = "Sa Thải".localize(), s = "fireButton btn-deep-red";
                        break;
                    case "./images/context menu icons/icon_vacation.svg":
                        c = "beachBall", a = "Gửi Đi Nghỉ Mát".localize(), s = "vacationButton btn-pumpkin-yellow";
                        break;
                    case "./images/context menu icons/icon_marketing.svg":
                        c = "star", a = "Tiếp Thị".localize(), s = "marketingButton btn-gold";
                        break;
                    case "./images/context menu icons/icon_publishingdeal.svg":
                        c = "doubleMoneySign", a = "Thỏa Thuận Nhà Phát Hành".localize(), s = "publishingButton btn-velvet-red";
                        break;
                    case "./images/context menu icons/icon_patch.svg":
                        c = "chip", a = "Phát Triển Bản Vá".localize(), s = "patchButton btn-light-purple-blue";
                        break;
                    case "./images/context menu icons/icon_cloud_up.svg":
                        c = "chevron", a = "Tải Lên".localize(), s = "uploadButton btn-ice-teal";
                        break;
                    case "./images/context menu icons/icon_cloud_down.svg":
                        c = "chevron", a = "Tải Xuống".localize(), s = "downloadButton btn-moss-green";
                        break;
                    case "./images/context menu icons/icon_save_delete.svg":
                        c = "x", a = "Xóa".localize(), s = "deleteButton btn-velvet-red";
                        break;
                    case "Start Project...".localize():
                        c = "rndBottleWhite", a = "Bắt Đầu Nghiên Cứu".localize(), s = "rndResearchButton btn-research-blue";
                        break;
                    case "Cancel Project...".localize():
                        c = "x", a = "Hủy Dự Án".localize(), s = "rndCancelButton btn-velvet-red";
                        break;
                    case "Develop Console...".localize():
                        c = "console", a = "Phát Triển Console".localize(), s = "developConsoleButton btn-ice-teal";
                        break;
                    case "Take off market".localize():
                        c = "x", a = "Rút Khỏi Thị Trường".localize(), s = "takeOffMarketButton btn-velvet-red";
                        break;
                    case "./images/context menu icons/icon_expansion_pack.svg":
                        c = "expansion", a = "Phát Triển Gói Mở Rộng".localize(), s = "expansionPackButton btn-feature-blue";
                        break;
                    default:
                        i = !0
                }
                n.find(".iconContainer").html('<img src="' + MOD_DIR + "Img/SVG/tag-" + c + '.svg" />'), n.find(".label").text(a), n.addClass(s), i && (n.removeClass("btn-tm-icon-only").addClass("btn-tm-context-unknown"), u && (r && n.css("margin-top", "60px"), u = !1))
            }
        })
    };
    var t = UI.closeContextMenu.bind(UI);
    UI.closeContextMenu = function (e, n) {
        t(), e || (e = $("#contextMenu")), e && e.remove()
    }
});