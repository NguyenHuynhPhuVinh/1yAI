(function () {
    var a;
    UI.isMenuOpen = function () {
        return void 0 != a
    };
    UI.showContextMenu = function (c, k, m) {
        if (c && 0 != c.length) {
            a && UI.closeContextMenu(a);
            var l = $("<div id='contextMenu'></div>");
            b(l, c);
            c = $("body");
            l.hide();
            c.append(l);
            var g = l.width(),
                n = l.height(),
                r = k.x - g / 4,
                p = k.y - n - 5;
            m && "rightStack" == m.position && (r = k.x + 25, p = k.y - 10);
            r = r.clamp(0, c.width() - g);
            p = p.clamp(0, c.height() - n);
            l.css({
                position: "absolute",
                left: r,
                top: p
            });
            l.show();
            f(l, !0)
        }
    };
    var b = function (a, b) {
        for (var f = $("#contextMenuItemTemplate"), l = 0; l < b.length; l++) {
            var g =
                b[l],
                n = f.clone();
            n.removeAttr("id");
            n.find(".label").text(g.label);
            g.icon ? (n.find(".icon").attr("src", g.icon), g.iconStyleClass && n.find(".icon").addClass(g.iconStyleClass), g.icon.startsWith("./images/context menu icons") && c(n.find(".icon"))) : n.find(".icon").attr("display", "hidden");
            (function (b) {
                n.clickExclOnce(function () {
                    UI.closeContextMenu(a);
                    b.action()
                })
            })(g);
            a.append(n)
        }
    },
        c = function (a, b) {
            var c = a.attr("id"),
                f = a.attr("class"),
                g = a.attr("src");
            jQuery.get(g, function (b) {
                b = jQuery(b).find("svg");
                "undefined" !==
                    typeof c && (b = b.attr("id", c));
                "undefined" !== typeof f && (b = b.attr("class", f + " replaced-svg"));
                b = b.removeAttr("xmlns:a");
                a.replaceWith(b)
            }, "xml")
        },
        f = function (b, c, f) {
            var l = $.makeArray(b.children());
            c || l.reverse();
            for (var g = 0; g < l.length; g++)(function (a) {
                b.delay(100).queue(function () {
                    c ? a.removeClass("hideState").addClass("showState") : a.removeClass("showState").addClass("hideState");
                    $(this).dequeue()
                })
            })($(l[g]));
            f && b.delay(600).queue(function () {
                f();
                $(this).dequeue()
            });
            c && (a = b)
        };
    UI.closeContextMenu = function (b,
        c) {
        b || (b = a);
        a === b && (a = null);
        b && f(b, !1, function () {
            b.remove()
        })
    }
})();