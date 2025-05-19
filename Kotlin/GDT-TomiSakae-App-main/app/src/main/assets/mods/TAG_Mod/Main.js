// Khởi tạo biến MOD_DIR toàn cục
window.MOD_DIR = "";

for (var tagMod = {}, i = 0; i < ModSupport.availableMods.length; i++) {
    var mod = ModSupport.availableMods[i];
    if ("TAGMod" == mod.id) {
        window.MOD_DIR = mod.folder + "/";
        break
    }
}

// Kiểm tra nếu MOD_DIR vẫn rỗng sau vòng lặp
if (!window.MOD_DIR) {
    //console.error("TAG Mod: Không thể tìm thấy thư mục mod");
    // Thử sử dụng một giá trị mặc định nếu không tìm thấy mod
    window.MOD_DIR = "mods/TAG_Mod/";
}

! function () {
    function e(t) {
        return new Promise(function (e, s) {
            GDT.loadJs(["{0}/{1}".format(mod.folder, t)], function () {
                e()
            }, function () {
                alert("TAG Mod: Failed to load '" + t + "'"), console.log("TAG Mod: '" + t + "' has failed to load"), s()
            })
        })
    }
    $("head").append('<link rel="stylesheet" href="' + MOD_DIR + 'css/open-sans.css" rel="stylesheet" type="text/css"><link rel="stylesheet" href="' + MOD_DIR + 'css/roboto.css" rel="stylesheet" type="text/css"><link rel="stylesheet" type="text/css" href="' + MOD_DIR + 'css/buttons.css"><link rel="stylesheet" type="text/css" href="' + MOD_DIR + 'css/general.css"><link rel="stylesheet" type="text/css" href="' + MOD_DIR + 'css/mainmenu.css"><link rel="stylesheet" type="text/css" href="' + MOD_DIR + 'css/scrollbar.css"><link rel="stylesheet" type="text/css" href="' + MOD_DIR + 'css/forms.css"><link rel="stylesheet" type="text/css" href="' + MOD_DIR + 'css/list.css"><link rel="stylesheet" type="text/css" href="' + MOD_DIR + 'css/contextmenu.css"><link rel="stylesheet" type="text/css" href="' + MOD_DIR + 'css/points.css"><link rel="stylesheet" type="text/css" href="' + MOD_DIR + 'css/modals.css"><link rel="stylesheet" type="text/css" href="' + MOD_DIR + 'css/icons.css"><link rel="stylesheet" type="text/css" href="' + MOD_DIR + 'css/hud.css"><link rel="stylesheet" type="text/css" href="' + MOD_DIR + 'css/staff.css"><link rel="stylesheet" type="text/css" href="' + MOD_DIR + 'css/newgame.css"><link rel="stylesheet" type="text/css" href="' + MOD_DIR + 'css/gamedevelopment.css"><link rel="stylesheet" type="text/css" href="' + MOD_DIR + 'css/gamerelease.css"><link rel="stylesheet" type="text/css" href="' + MOD_DIR + 'css/gamereviews.css"><link rel="stylesheet" type="text/css" href="' + MOD_DIR + 'css/notifications.css"><link rel="stylesheet" type="text/css" href="' + MOD_DIR + 'css/research.css"><link rel="stylesheet" type="text/css" href="' + MOD_DIR + 'css/gamehistory.css"><link rel="stylesheet" type="text/css" href="' + MOD_DIR + 'css/infostats.css"><link rel="stylesheet" type="text/css" href="' + MOD_DIR + 'css/createengine.css"><link rel="stylesheet" type="text/css" href="' + MOD_DIR + 'css/training.css"><link rel="stylesheet" type="text/css" href="' + MOD_DIR + 'css/marketing.css"><link rel="stylesheet" type="text/css" href="' + MOD_DIR + 'css/contracts.css"><link rel="stylesheet" type="text/css" href="' + MOD_DIR + 'css/companysetup.css"><link rel="stylesheet" type="text/css" href="' + MOD_DIR + 'css/saveload.css"><link rel="stylesheet" type="text/css" href="' + MOD_DIR + 'css/hardware.css">'), $("#notificationContentTemplate").find(".notificationOption3").hide(), $("#resources").append('<div id="tagGenWindowTemplate"><div class="featureWindowTitle windowTitle"></div><div class="featureSelectionPanel featureSelectionPanelHiddenState"> <div class="windowTitle smallerWindowTitle">ll:{Selected Features}</div> <div class="cost"></div> <div class="featureSelectionContainer featurePanel"></div> </div> <div class="featureStaffAsignPanel hidden"> <div class="windowTitle smallerWindowTitle">ll:{Staff}</div> <div class="staffListContainer"></div> </div> </div>'), GDT.loadJs(["{0}/{1}".format(mod.folder, "libs/promise.js")], function () {
        Promise.all([e("libs/circle-progress.js"), e("libs/Chart.min.js"), e("Code/polyfills.js")]).then(function () {
            return Promise.all([e("Code/util.js"), e("Code/localization.js").then(function () {
                return window.TM_LANGS_LOADED
            })])
        }).then(function () {
            e("Code/overrides.js"), e("Code/settings.js"), e("Code/mainmenu.js"), e("Code/resources-transform.js"), e("Code/gameloop.js"), e("Code/contextmenu.js"), e("Code/modals.js"), e("Code/hud.js"), e("Code/notifications.js"), e("Code/newgame.js"), e("Code/gamedevelopment.js"), e("Code/gamereviews.js"), e("Code/gamehistory.js"), e("Code/createengine.js"), e("Code/infostats.js"), e("Code/staff.js"), e("Code/training.js"), e("Code/marketing.js"), e("Code/convention.js"), e("Code/contracts.js"), e("Code/rnd.js"), e("Code/hardware.js"), GDT.getDataStore("TAGMod").settings["dark-mode"] && $("body").addClass("dark-mode")
        })
    }, function () {
        alert("TAG Mod: Failed to load 'libs/promise.js'"), console.log("TAG Mod: 'libs/promise.js' has failed to load")
    }), $("body").on("click", "a[target=_blank]", function (e) {
        e.preventDefault();
        window.open(e.currentTarget.href, '_blank');
    })
}();