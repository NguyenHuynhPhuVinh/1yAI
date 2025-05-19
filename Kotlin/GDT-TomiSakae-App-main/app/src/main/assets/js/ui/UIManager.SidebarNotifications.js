(function () {
    UI.sideBarNotificationLifeTimeInSeconds = 30;
    UI._scheduleDismissAnimation = function (a) {
        GameManager.company.sidebarNotifications.indexOf(a);
        if (a.dismissTime) {
            var b = a.dismissTime - GameManager.gameTime;
            0 > b && UI.dismissSideNotification(a).totalTime(-1 * b / 1E3)
        } else a.dismissTime = GameManager.gameTime + 1E3 * UI.sideBarNotificationLifeTimeInSeconds
    };
    GameManager.addTickListener(function (a) {
        if (GameManager.company)
            for (a = 0; a < GameManager.company.sidebarNotifications.length; a++) {
                var b = GameManager.company.sidebarNotifications[a];
                b.dismissTime ? GameManager.gameTime >= b.dismissTime ? UI.dismissSideNotification(b) : 5 < GameManager.company.sidebarNotifications.length && a < GameManager.company.sidebarNotifications.length - 5 && (b.dismissTime = GameManager.gameTime) : UI._scheduleDismissAnimation(b)
            }
    }, !0);
    var a = [];
    UI.dismissSideNotification = function (b) {
        if (-1 == a.indexOf(b)) return a.push(b), UI.startDismissAnimation(b)
    };
    UI.startDismissAnimation = function (a) {
        var b = $('.sidebarNotificationItem[gdt-notification-id="{0}"]'.format(a.id)),
            c = new TimelineMax;
        c.add(TweenMax.to(b, 3, {
            opacity: 0,
            ease: CustomEase.create("custom", "M0,0 C0,0 0.1,0.9 0.1,0.9 0.1,0.9 0.2,0 0.2,0 0.2,0 0.3,0.9 0.3,0.9 0.3,0.9 0.4,0 0.4,0 0.4,0 0.5,0.9 0.5,0.9 0.5,0.9 0.538,0 0.538,0 0.538,0 0.644,0.898 0.644,0.898 0.644,0.898 0.666,0 0.666,0 0.666,0 0.736,0.898 0.736,0.898 0.736,0.898 0.78,0 0.78,0 0.78,0 0.836,0.896 0.836,0.896 0.836,0.896 0.858,0 0.858,0 0.858,0 0.9,0.9 0.9,0.9 0.9,0.9 0.916,0 0.916,0 0.916,0 0.953,0.902 0.953,0.902 0.953,0.902 0.966,0 0.966,0 0.966,0 1,1 1,1")
        }));
        c.addCallback(function () {
            -1 != GameManager.company.sidebarNotifications.indexOf(a) && a.applyActions(GameManager.company);
            f(b, a)
        });
        GameManager.addGsapAnimationToGameTime(c);
        return c
    };
    UI.showNotificationViaSidebar = function (a) {
        if (!a.shouldShowInSidebar()) return !1;
        UI._addSidebarNotification(a);
        return !0
    };
    UI._addSidebarNotification = function (a) {
        GameManager.company.sidebarNotifications.push(a);
        GameManager.removeFromActiveNotifications(a);
        b(a, !0)
    };
    UI._resetSidebarNotificationUI = function () {
        $("#notificationSidebar").empty();
        a = [];
        for (var c = 0; c < GameManager.company.sidebarNotifications.length; c++) b(GameManager.company.sidebarNotifications[c], !1)
    };
    UI._resetCallbacks.push(UI._resetSidebarNotificationUI);
    var b = function (a, b) {
        var m = $("#sidebarNotificationItemTemplate").clone();
        m.removeAttr("id");
        m.attr("gdt-notification-id", a.id);
        m.find(".icon").attr("src", a.getNotificationPreviewImage());
        m.find(".title").text(a.header).css("font-size", UI._getMaxFontSizeSimple(a.header, 18, 190, 35));
        m.clickExclOnce(function () {
            GameManager.company.sidebarNotifications.remove(a);
            GameManager.company.activeNotifications.addRangeAt(0, a.split());
            Sound.click();
            f(m, a)
        });
        m.contextMenuExclOnce(function () {
            -1 != GameManager.company.sidebarNotifications.indexOf(a) && a.applyActions(GameManager.company);
            f(m, a)
        });
        var l = a.text;
        30 < l.length && (l = a.text.substr(0, 30) + "...");
        m.find(".previewText").text(l);
        $("#notificationSidebar").append(m);
        b && c(m, a);
        UI._scheduleDismissAnimation(a)
    },
        c = function (a, b) {
            var c = new TimelineMax;
            c.add(TweenMax.set(a, {
                y: -700,
                opacity: 0
            }));
            c.add(TweenMax.to(a, 0.4, {
                y: -50,
                opacity: 1,
                ease: Power2.easeOut
            }));
            c.addCallback(function () {
                Sound.playSoundOnce("newNotification", 0.7)
            });
            c.add(TweenMax.to(a, 0.3, {
                y: -0,
                ease: Bounce.easeOut
            }));
            GameManager.addGsapAnimationToGameTime(c)
        },
        f = function (a, b) {
            GameManager.company.sidebarNotifications.remove(b);
            (new TimelineMax).add(TweenMax.to(a, 0.4, {
                opacity: 0,
                height: 0,
                borderColor: "transparent",
                margin: 0,
                ease: Power2.easeIn,
                onComplete: function () {
                    a.remove()
                }
            }))
        }
})();