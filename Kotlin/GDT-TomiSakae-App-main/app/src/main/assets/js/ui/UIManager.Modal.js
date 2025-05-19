(function () {
    UI._isModalContentOpen = !1;
    UI.isModalContentOpen = function () {
        return b.some(function (a) {
            return !0 === a.dialog("isOpen")
        }) || UI._isModalContentOpen || !0 === $("#newGameView").dialog("isOpen") || !0 === $("#createShareCodeWindow").dialog("isOpen") || !0 === $("#loadView").dialog("isOpen") || !0 === $("#saveView").dialog("isOpen") || !0 === $("#overwriteGameDialog").dialog("isOpen") || !0 === $("#useKnowledgeFromPreviousGameDialog").dialog("isOpen") || !0 === $("#gameHistoryDialog").dialog("isOpen") || !0 === $("#platformReleaseNewsContent").dialog("isOpen")
    };
    UI.realignOpenDialogs = function () {
        var a = $(document).find(".ui-dialog"),
            b = $(document.body);
        0 < a.length && a.position({
            of: b,
            my: "center center",
            at: "center center",
            offset: "0 0"
        })
    };
    UI._supressModalAnimations = !1;
    UI.showModalContent = function (a, b) {
        b || (b = {});
        if (b.disableCheckForNotifications || "#notificationContent" == a) {
            GameManager.pause(!0);
            var d = !0 === b.close;
            $(a).modal({
                close: d,
                onOpen: function (a) {
                    b.sound ? Sound.playSoundOnce(b.sound, b.volume) : UI._supressModalAnimations || Sound.playSoundOnce("popupOpen", 0.35);
                    if (d) {
                        var c =
                            $(UI.closeButtonTemplate);
                        c.css("z-index", 5E3);
                        c.clickExcl(function () {
                            Sound.click();
                            var a = $(".simplemodal-data").find(".selectionOverlayContainer");
                            0 < a.length && a.is(":visible") ? a.fadeOut("fast") : UI.closeModal()
                        });
                        $(".simplemodal-container").append(c);
                        GDT.fire(a, GDT.eventKeys.ui.dialogOpen)
                    }
                    UI._isModalContentOpen = !0;
                    UI._supressModalAnimations || a.container.addClass("windowStyleStartState");
                    a.overlay.show();
                    a.container.show();
                    a.data.show();
                    a.overlay.transit({
                        opacity: 0.2
                    }, UI._supressModalAnimations ? 0 :
                        200);
                    a.container.removeClass("windowStyleStartState");
                    a.container.addClass("windowStyleShowState");
                    $(".simplemodal-data").find(".windowTitle:first:visible");
                    UI.maxFont("bolder", $(".simplemodal-data").find(".windowTitle:first:visible"), 34);
                    if (b && b.onOpen) b.onOpen()
                },
                onClose: function (a) {
                    a.container.removeClass("windowStyleShowState");
                    UI._supressModalAnimations || (a.container.addClass("windowStyleHideState"), a.overlay.transit({
                        opacity: 0
                    }, 100));
                    var c = function () {
                        UI.closeModal();
                        a.container.removeClass("windowStyleHideState");
                        UI._isModalContentOpen = !1;
                        if (b && b.onClose) b.onClose();
                        UI.currentCloseCallback && (UI.currentCloseCallback(), UI.currentCloseCallback = null);
                        GameManager.resume(!0)
                    };
                    UI._supressModalAnimations ? c() : setTimeout(c, 100);
                    GDT.fire(a, GDT.eventKeys.ui.dialogClose)
                },
                escClose: d,
                zIndex: 4500
            })
        } else GameManager.showPendingNotifications(function () {
            PlatformShim.execUnsafeLocalFunction(function () {
                b.disableCheckForNotifications = !0;
                UI.showModalContent(a, b)
            })
        })
    };
    UI.currentCloseCallback = null;
    UI.closeModal = function (a) {
        UI._supressModalAnimations =
            0 < GameManager.company.activeNotifications.length;
        if (null != UI.currentCloseCallback && a) throw "attempting to override existing callback";
        a && (UI.currentCloseCallback = a);
        PlatformShim.execUnsafeLocalFunction(function () {
            $.modal.close()
        })
    };
    var a = !1;
    UI.closeAllDialogs = function () {
        $("#newGameView").dialog("close");
        $("#loadView").dialog("close");
        $("#saveView").dialog("close");
        $("#createShareCodeWindow").dialog("close");
        $("#overwriteGameDialog").dialog("close");
        $("#gameHistoryDialog").dialog("close");
        $("#platformReleaseNewsContent").dialog("close");
        $("#purchasePlatformDialog").dialog("close");
        $("#useKnowledgeFromPreviousGameDialog").dialog("close");
        $(document).find("#gamePausedOverlay").hide();
        UI.enableMainMenu();
        for (var c = 0; c < b.length; c++) a = !0, b[c].dialog("close");
        a = !1;
        $.modal.impl.o && ($.modal.impl.o.onClose = null);
        PlatformShim.execUnsafeLocalFunction(function () {
            $.modal.close()
        });
        UI._isModalContentOpen = !1;
        UI.closeContextMenu()
    };
    (function (a) {
        var b = a.noop;
        a.browser.msie && (b = function (b) {
            b = a(b).parent(".ui-dialog");
            var d = b.innerWidth();
            d && b.css("width",
                d)
        });
        var d = a.ui.dialog.prototype._init;
        a.ui.dialog.prototype._init = function () {
            if ("auto" == this.options.width) {
                var k = this.options.open;
                this.options.open = function () {
                    b(this);
                    k && k.apply(this)
                }
            }
            a.browser.msie && "drop" == this.options.hide && (this.options.hide = "fold");
            return d.apply(this)
        }
    })(jQuery);
    var b = [];
    $.fn.gdDialog = function (c) {
        c || (c = {});
        void 0 == c.zIndex && (c.zIndex = 5E3);
        var f, d, k;
        this.hasClass("tallWindow") ? (f = 600, d = 650, k = "tallWindow") : this.hasClass("smallWindow") ? (f = 500, d = 350, k = "smallWindow") : this.hasClass("wideWindow") &&
            (f = 800, d = 650, k = "wideWindow");
        this.hasClass("windowBorder") && (k += " windowBorder");
        var m = this;
        b.push(m);
        m.dialog({
            close: !1,
            closeOnEscape: c.close,
            draggable: !1,
            width: f ? f : "auto",
            height: d ? d : "auto",
            modal: !0,
            resizable: !1,
            show: "fade",
            zIndex: c.zIndex,
            open: function () {
                var a = $(this);
                if (c.close) {
                    var b = $(UI.closeButtonTemplate);
                    b.css("z-index", c.zIndex + 500);
                    b.clickExclOnce(function () {
                        Sound.click();
                        m.dialog("close")
                    });
                    a.parents(".ui-dialog:first").append(b)
                }
                c.popout && $("#gameContainerWrapper").addClass("popout-active");
                a.siblings(".ui-dialog-titlebar").remove();
                k && $(a).parents(".ui-dialog:first").addClass(k);
                a.parents(".ui-dialog:first").removeClass("ui-widget-content");
                if (c && c.onOpen) c.onOpen();
                c.disableOverlayFix || ($(".ui-widget-overlay:last").css("z-index", c.zIndex - 50), a.parents(".ui-dialog:first").css("z-index", c.zIndex));
                GDT.fire(a, GDT.eventKeys.ui.dialogOpen)
            },
            close: function () {
                c.popout && $("#gameContainerWrapper").removeClass("popout-active").addClass("popout-inactive");
                $(this).dialog("destroy");
                this.style.cssText =
                    "display:none;"; - 1 != b.indexOf(m) && b.remove(m);
                if (c.onClose && !a) c.onClose();
                GDT.fire($(this), GDT.eventKeys.ui.dialogClose)
            }
        })
    }
})();