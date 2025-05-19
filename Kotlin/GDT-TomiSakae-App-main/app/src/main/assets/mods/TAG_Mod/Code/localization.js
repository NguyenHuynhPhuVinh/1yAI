$(function () {
    window.TM_LANGS_LOADED = new Promise(function (n, e) {
        // Sử dụng jQuery AJAX thay vì require("fs")
        $.ajax({
            url: mod.folder + "/translations/tagmod-translations.json",
            dataType: "json",
            success: function (data) {
                try {
                    for (var a in data) {
                        if (null != Languages[a]) {
                            for (var t = 0; t < data[a].values.length; t++) {
                                Languages[a].values.push(data[a].values[t]);
                            }
                            a == LanguageMgr.gameLanguage && Localization.invalidateLanguage(a);
                        }
                    }
                    n();
                } catch (err) {
                    console.error("Error processing TAG Mod translation file:", err);
                    n(); // Vẫn resolve promise để không làm gián đoạn luồng
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Failed to load TAG Mod translation file. Error = " + textStatus);
                n(); // Vẫn resolve promise để không làm gián đoạn luồng
            }
        });
    });
});