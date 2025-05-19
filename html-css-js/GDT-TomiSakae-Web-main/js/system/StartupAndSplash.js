// StartupAndSplash.js

// Đối tượng SplashScreen quản lý màn hình chờ và các chức năng liên quan.
var SplashScreen = {};
// Đối tượng Startup quản lý quá trình khởi tạo ban đầu của game.
var Startup = {};

(function () {
    // Hàm kiểm tra và hiển thị EULA (Thỏa thuận người dùng cuối) nếu cần.
    // onSuccessCallback: Hàm sẽ được gọi sau khi EULA được chấp nhận hoặc không cần hiển thị.
    function handleEulaCheck(onSuccessCallback) {
        // Nếu là phiên bản Windows 8 (Store App), bỏ qua kiểm tra EULA.
        if (PlatformShim.ISWIN8) {
            onSuccessCallback();
        } else {
            try {
                // Sử dụng module 'fs' (file system) của Node.js/NW.js để đọc file.
                var fsModule = require("fs");
                if (fsModule) {
                    var eulaTextContent = fsModule.readFileSync("./eula.txt", "utf8");
                    if (eulaTextContent) {
                        // Kiểm tra xem người dùng đã chấp nhận EULA trước đó chưa (lưu trong DataStore).
                        if (DataStore.getValue("eula-accepted")) {
                            onSuccessCallback();
                        } else {
                            // Nếu chưa chấp nhận, hiển thị dialog EULA.
                            var eulaWindowElement = $("#eulaWindow");
                            // Nút từ chối EULA (đóng game).
                            eulaWindowElement.find(".deleteButton").clickExclOnce(function () {
                                window.close();
                            });
                            // Nút chấp nhận EULA.
                            eulaWindowElement.find(".okButton").clickExclOnce(function () {
                                eulaWindowElement.dialog("close");
                                DataStore.setValue("eula-accepted", !0); // Lưu trạng thái đã chấp nhận.
                                onSuccessCallback();
                            });
                            // Xử lý nội dung EULA để hiển thị đúng trên HTML.
                            var sanitizedEulaHtml = eulaTextContent;
                            sanitizedEulaHtml = sanitizedEulaHtml.replace(/&/g, "&").replace(/>/g, ">").replace(/</g, "<").replace(/\n/g, "<br>");
                            eulaWindowElement.find(".eulaContainer").html(PlatformShim.toStaticHtml(sanitizedEulaHtml));
                            // Hiển thị dialog bằng gdDialog (một plugin jQuery tùy chỉnh).
                            eulaWindowElement.gdDialog({
                                popout: !0,
                                close: !1, // Không cho phép đóng dialog bằng nút X mặc định.
                                zIndex: 2E4, // 20000
                                onClose: function () {
                                    // Dọn dẹp container khi dialog đóng.
                                    eulaWindowElement.find(".eulaContainer").empty();
                                }
                            });
                        }
                    }
                }
            } catch (error) {
                // Nếu có lỗi (ví dụ: không tìm thấy file EULA), vẫn tiếp tục gọi callback.
                onSuccessCallback && onSuccessCallback();
            }
        }
    }

    // Hàm thiết lập hành động cho nút "Start New Game" trên màn hình chờ.
    // splashScreenElement: jQuery object của màn hình chờ.
    function setupNewGameButton(splashScreenElement) {
        var labelText = "Tap to start game ...".localize();
        // Kiểm tra thiết bị có hỗ trợ cảm ứng không để thay đổi văn bản.
        if (!WindowsIntegration.isTouchCapable) {
            labelText = "Click to start game ...".localize();
        }
        // Gán sự kiện click cho màn hình chờ.
        splashScreenElement.clickExcl(function (event) {
            // Nếu có panel nào đang mở, đóng nó lại trước.
            if (UI.isPanelOpen()) {
                UI.closePanels();
                return !1; // Ngăn chặn hành động tiếp theo.
            }
            UI.hideAboutBadge(); // Ẩn badge "About".
            splashScreenElement.off("click"); // Gỡ bỏ sự kiện click để tránh click nhiều lần.
            setGameReadyLabelText("Starting game...".localize()); // Cập nhật label trạng thái.
            GameManager.startNewGame(); // Bắt đầu game mới.
        });
        setGameReadyLabelText(labelText); // Hiển thị label ban đầu.
    }

    // Hàm thiết lập hành động cho nút "Continue Game" trên màn hình chờ.
    // splashScreenElement: jQuery object của màn hình chờ.
    // saveGameToContinue: Dữ liệu save game để tiếp tục.
    function setupContinueGameButton(splashScreenElement, saveGameToContinue) {
        splashScreenElement.clickExcl(function () {
            if (UI.isPanelOpen()) {
                UI.closePanels();
                return !1;
            }
            splashScreenElement.off("click");
            UI.hideAboutBadge();
            // Hiệu ứng chuyển cảnh mờ dần.
            UI.fadeInTransitionOverlay(function () {
                SplashScreen.removeSplashScreen(); // Xóa màn hình chờ.
                // Tải lại game từ save slot.
                GameManager.reload(
                    saveGameToContinue.slot,
                    function () { // Callback khi tải thành công.
                        Sound.playBackgroundMusic();
                        GameManager.resume(!0); // Tiếp tục game (system pause).
                    },
                    function () { // Callback khi tải thất bại (ví dụ: save file hỏng).
                        setupNewGameButton(splashScreenElement); // Chuyển sang cho phép tạo game mới.
                    },
                    !0 // forceReloadUI
                );
            });
        });
    }

    // Hàm được gọi khi tất cả tài nguyên ban đầu đã tải xong và game sẵn sàng.
    function finalizeStartup() {
        try {
            // Đối với phiên bản NW.js, lấy cửa sổ hiện tại.
            var nwWindow = require("nw.gui").Window.get();
            var isWindowedStoredValue = DataStore.getValue("windowed");
            try {
                // Nếu không có cài đặt windowed hoặc cài đặt là false, bật fullscreen.
                if (isWindowedStoredValue !== !0 && isWindowedStoredValue !== "true") {
                    // (Chỗ này code gốc là !0 != g && "true" != g || PlatformShim.toggleFullscreen()
                    //  logic này có vẻ hơi lạ, nếu g là true thì cũng toggleFullscreen.
                    //  Đã sửa lại cho hợp lý hơn: nếu KHÔNG PHẢI là true thì KHÔNG toggle)
                } else {
                    PlatformShim.toggleFullscreen(); // Bật/tắt fullscreen
                }
            } catch (error) { /* Bỏ qua lỗi nếu không toggle được */ }
            nwWindow.focus(); // Đưa cửa sổ game lên trên cùng.
        } catch (error) { /* Bỏ qua nếu không phải NW.js hoặc có lỗi */ }

        $("#commandsAppBar")[0].disabled = !1; // Kích hoạt app bar (nếu có).
        var splashScreenElement = $("#splashScreen");
        $("#splashProgress").fadeOut(400); // Ẩn thanh tiến trình tải.

        var gameReadyLabelElement = $("#gameReadyLabel");
        var savedGamesList = GameManager.getSaveGames(); // Lấy danh sách các game đã lưu.
        UI.showNewsletterWidget(); // Hiển thị widget đăng ký newsletter.

        // Kiểm tra xem có save game nào không để quyết định hiển thị "Continue" hay "New Game".
        if (savedGamesList.length !== 0 && savedGamesList.some(function (game) { return game != null; })) {
            var continueLabelText = "Tap to continue ...";
            if (!WindowsIntegration.isTouchCapable) {
                continueLabelText = "Click to continue ...".localize();
            }
            var gameToContinue = GameManager.getGameToContinue(); // Lấy save game gần nhất.
            // Hiển thị tên công ty của save game gần nhất.
            if (gameToContinue && gameToContinue.companyName) {
                $("#isAGameTycoonLabel").text("{0}".format(gameToContinue.companyName)).fadeIn(600).arctext({ radius: 350 });
            }
            GameManager.pause(!0); // Tạm dừng game (system pause).
            setupContinueGameButton(splashScreenElement, gameToContinue);
            setGameReadyLabelText(continueLabelText, gameReadyLabelElement);
        } else {
            // Nếu không có save game, cho phép bắt đầu game mới.
            setupNewGameButton(splashScreenElement);
        }
        GameManager.startDrawLoop(); // Bắt đầu vòng lặp vẽ của game.
    }

    CustomAlert.init(); // Khởi tạo hệ thống alert tùy chỉnh.

    // Biến lưu trữ hàm cập nhật vị trí của splash screen (sẽ được định nghĩa trong initializeGame).
    var updateSplashPositionStyleFunction;

    // Hàm khởi tạo chính của game, được gọi khi DOM sẵn sàng (cho bản non-Win8).
    var initializeGame = function () {
        var splashProgressElement = $("#splashProgress");
        splashProgressElement.hide();
        $("#gameReadyLabel").hide();
        splashProgressElement.fadeIn("fast");

        // Hàm này được dùng để cập nhật vị trí các element trên splash screen khi resize.
        updateSplashPositionStyleFunction = function () {
            var splashInnerWidth = (window.innerWidth - 2990) / 2 - 10;
            var splashInnerHeight = (window.innerHeight - 2990) / 2 - 70;
            // Tạo style CSS động để căn chỉnh.
            $("#splashPositionStyle").html(".splashDynamicClass:before { top:{0}px; left:{1}px; }".format(splashInnerHeight, splashInnerWidth));
        };

        Localization.processHtml(document.body); // Xử lý các chuỗi cần dịch trong HTML.

        // Khởi tạo các canvas quản lý bởi CanvasManager.
        CanvasManager.init(document.getElementById("canvasContainer"));
        CanvasManager.initLeftScreen(document.getElementById("canvasContainerLeft"));
        CanvasManager.initRightScreen(document.getElementById("canvasContainerRight"));

        updateSplashPositionStyleFunction(); // Cập nhật vị trí splash screen lần đầu.

        // Kiểm tra và hiển thị thông báo nếu là bản Lite/Demo.
        if (GameManager.ghg0()) { // ghg0() có thể là hàm kiểm tra bản Lite/Demo.
            $("#gamePreviewLabel").text(">> Lite Version <<".localize());
            GameManager.ghg1(); // ghg1() có thể là hàm xử lý riêng cho bản Lite/Demo.
        } else {
            $("#gamePreviewLabel").hide();
        }

        // Ẩn các overlay thông báo ban đầu.
        $("#gameSavedOverlay").css({ opacity: 0 });
        $("#gamePausedOverlay").css({ opacity: 0 });
        $("#gameErrorOverlay").css({ opacity: 0 });

        updateCanvasRender(); // Cập nhật kích thước và vẽ lại canvas.
        Logger.load(); // Tải log lỗi đã lưu.
        Knowledge.loadPlayerKnowledge(); // Tải "kiến thức" của người chơi.
        Sound.init(); // Khởi tạo hệ thống âm thanh.
        GameManager.init(); // Khởi tạo GameManager.

        // Tải hình ảnh nền cho splash screen và sau đó thực hiện các bước tiếp theo.
        $("<img/>").attr("src", "./images/sunrays.png").load(function () {
            $("#splashStaticBackdrop").transition({ opacity: 0 }, 2E3); // 2000ms
            // Kiểm tra EULA trước khi hoàn tất khởi động.
            handleEulaCheck(function () {
                // Nếu DataStore có hàm init riêng (ví dụ: cho Steam Cloud), gọi nó.
                if (DataStore.init) {
                    DataStore.init(finalizeStartup);
                } else {
                    finalizeStartup();
                }
            });
        });

        // Lưu lại kích thước cửa sổ hiện tại để theo dõi thay đổi.
        lastWindowWidth = $(window).width();
        lastWindowHeight = $(window).height();
        ghg4.init(); // Khởi tạo module analytics (nếu có).
    };

    // Hàm cập nhật nội dung cho label #gameReadyLabel và tạo hiệu ứng pulsate.
    // textToShow: Nội dung cần hiển thị.
    // labelElement: (Tùy chọn) jQuery object của label, mặc định là #gameReadyLabel.
    var setGameReadyLabelText = function (textToShow, labelElement) {
        if (!labelElement) {
            labelElement = $("#gameReadyLabel");
        }
        if (labelElement) {
            labelElement.text(textToShow);
            labelElement.delay(400).effect("pulsate", { times: 50 }, 2E3); // 2000ms
        }
    };

    // Hàm hiển thị lại màn hình chờ (ví dụ: khi load game thất bại).
    // gameToContinueOnError (parameter `a`): Dữ liệu game để tiếp tục nếu có lỗi.
    SplashScreen.reshow = function (gameToContinueOnError) {
        var gameManagerRef = GameManager; // Tham chiếu tới GameManager để tránh lỗi scope.
        var splashScreenElement = $("#splashScreen");
        splashScreenElement.fadeIn();

        // Nếu không truyền gameToContinueOnError, thử lấy save game gần nhất.
        var gameToContinue = gameToContinueOnError || GameManager.getGameToContinue();
        setupContinueGameButton(splashScreenElement, gameToContinue);

        setTimeout(function () {
            // Nếu có hiệu ứng chuyển cảnh đang chạy, đợi nó xong.
            if (UI.isTransitionVisible) {
                UI.fadeOutTransitionOverlay(function () {
                    // Khôi phục trạng thái pause của game.
                    if (gameManagerRef.systemPause) gameManagerRef.pause(!0); else gameManagerRef.resume(!0);
                    if (gameManagerRef.playerPause) gameManagerRef.pause(!1); else gameManagerRef.resume(!1);
                    gameManagerRef.loadInProgress = !1;
                });
            }
            UI.showAboutBadge();
            UI.showNewsletterWidget();
        }, 300);
    };

    // Hàm xóa màn hình chờ.
    SplashScreen.removeSplashScreen = function () {
        var splashScreenElement = $("#splashScreen");
        if (splashScreenElement.is(":visible")) {
            splashScreenElement.fadeOut("slow");
            UI.hideAboutBadge();
            return !0; // Trả về true nếu màn hình chờ được xóa.
        }
        return !1; // Trả về false nếu không có gì để xóa.
    };

    // Kiểm tra xem màn hình chờ có đang hiển thị không.
    SplashScreen.isVisible = function () {
        return $("#splashScreen").is(":visible");
    };

    // Biến lưu kích thước cửa sổ trước đó để phát hiện resize.
    var lastWindowWidth, lastWindowHeight;

    // Hàm kiểm tra xem có dialog hoặc popup nào đang mở không
    var isAnyDialogOpen = function () {
        return UI && typeof UI.isModalContentOpen === 'function' && UI.isModalContentOpen();
    };

    // Hàm xử lý sự kiện resize cửa sổ.
    var handleWindowResize = function () {
        var currentWindowWidth = $(window).width();
        var currentWindowHeight = $(window).height();

        // Nếu kích thước cửa sổ thay đổi.
        if (currentWindowWidth != lastWindowWidth || currentWindowHeight != lastWindowHeight) {
            lastWindowWidth = currentWindowWidth;
            lastWindowHeight = currentWindowHeight;

            // Nếu màn hình chờ đang hiển thị, cập nhật lại vị trí của nó.
            if ($("#splashScreen").is(":visible")) {
                updateSplashPositionStyleFunction && updateSplashPositionStyleFunction();
            } else {
                // Kiểm tra xem có dialog nào đang mở không
                if (isAnyDialogOpen()) {
                    // Nếu có dialog đang mở, chỉ cần cập nhật kích thước canvas và cân chỉnh lại dialog
                    // mà không cần reload game
                    updateCanvasRender();

                    // Căn chỉnh lại vị trí các dialog đang mở
                    if (UI && typeof UI.realignOpenDialogs === 'function') {
                        UI.realignOpenDialogs();
                    }

                    console.log("Đã cập nhật vị trí dialog khi resize cửa sổ");
                } else {
                    // Nếu không có dialog nào đang mở, tạm dừng game, tự động lưu và tải lại game.
                    if (GameManager && typeof GameManager.pause === 'function') {
                        GameManager.pause(!0);

                        // Kiểm tra xem GameManager.autoSave có tồn tại không
                        if (typeof GameManager.autoSave === 'function') {
                            GameManager.autoSave(function () {
                                // Kiểm tra xem GameManager.reload có tồn tại không
                                if (typeof GameManager.reload === 'function') {
                                    GameManager.reload("auto", void 0, void 0, !0);
                                }
                            });
                        }
                    }
                }
            }
        }
    };

    // Hàm fallback xử lý canvas cho thiết bị di động khi CanvasManager không có sẵn
    var mobileCanvasFallback = function (width, height) {
        try {
            // Đặt kích thước các container canvas nếu chúng tồn tại
            $("#canvasContainer").width(width).height(height);
            $("#canvasContainerLeft").width(width).height(height);
            $("#canvasContainerRight").width(width).height(height);

            // Tìm tất cả các canvas trong các container và đặt kích thước cho chúng
            $(".canvasContainer canvas").each(function () {
                $(this).attr('width', width);
                $(this).attr('height', height);
            });

            // Thông báo đã xử lý
            console.log("Thiết bị di động: Đã điều chỉnh canvas theo kích thước màn hình", width, height);
        } catch (error) {
            console.error("Lỗi khi xử lý canvas trên thiết bị di động:", error);
        }
    };

    // Hàm cập nhật kích thước body và canvas, sau đó vẽ lại canvas.
    var updateCanvasRender = function () {
        var currentWindowWidth = $(window).width();
        var currentWindowHeight = $(window).height();
        $(document.body).width(currentWindowWidth).height(currentWindowHeight);

        // Kiểm tra xem CanvasManager có hàm updateCanvasSizes không trước khi gọi
        if (CanvasManager && typeof CanvasManager.updateCanvasSizes === 'function') {
            CanvasManager.updateCanvasSizes(currentWindowWidth, currentWindowHeight);
        } else {
            // Fallback cho thiết bị di động hoặc trường hợp hàm không tồn tại
            console.log("Warning: CanvasManager.updateCanvasSizes không khả dụng.");
            // Gọi hàm fallback cho thiết bị di động
            mobileCanvasFallback(currentWindowWidth, currentWindowHeight);
        }

        // Cập nhật canvas chỉ khi hàm update tồn tại
        if (CanvasManager && typeof CanvasManager.update === 'function') {
            CanvasManager.update();
        }
    };

    // Biến lưu ID của timeout cho sự kiện resize (để debounce).
    var resizeTimeoutId;

    // Gán sự kiện resize cho cửa sổ.
    $(window).resize(function () {
        updateCanvasRender(); // Cập nhật ngay lập tức.
        clearTimeout(resizeTimeoutId); // Xóa timeout cũ.
        // Đặt timeout mới để tránh xử lý resize quá nhiều lần liên tiếp.
        resizeTimeoutId = setTimeout(handleWindowResize, 100);
    });

    // Đối với các phiên bản không phải Windows 8 (ví dụ: NW.js), gọi initializeGame khi DOM sẵn sàng.
    if (!PlatformShim.ISWIN8) {
        $(document).ready(function () {
            initializeGame();
            // Nếu có Greenworks (tích hợp Steam), đồng bộ hóa.
            if (typeof Greenworks !== 'undefined' && Greenworks) {
                Greenworks.synchronize();
            } else {
                $("#greenworksLoading").remove(); // Xóa thông báo tải Greenworks.
                ModSupport.init(); // Khởi tạo hỗ trợ mod.
            }
        });
    }

    // Ghi đè plugin jQuery UI Slider để tùy chỉnh.
    $.prototype.slider_old = $.prototype.slider; // Lưu lại hàm slider gốc.
    $.prototype.slider = function () {
        var sliderInstance = $.prototype.slider_old.apply(this, arguments);
        // Nếu slider là .projectBudgetSlider hoặc .budgetSlider trong simplemodal, gỡ bỏ sự kiện keydown.
        // Điều này có thể để tránh xung đột phím tắt hoặc hành vi không mong muốn.
        if (this.selector != ".projectBudgetSlider" && this.selector != ".simplemodal-data .budgetSlider") {
            // Do nothing
        } else {
            this.find(".ui-slider-handle").unbind("keydown");
        }
        return sliderInstance;
    };

    // Xử lý sự kiện đóng cửa sổ cho NW.js.
    //var nwAppWindow = require("nw.gui").Window.get();
    //nwAppWindow.on("close", function () {
    //    GameManager.autoSave(); // Tự động lưu game trước khi đóng.
    //    nwAppWindow.close(!0); // Đóng cửa sổ thực sự.
    //});

    // Ngăn chặn hành vi cuộn ngang mặc định bằng chuột.
    document.addEventListener("DOMMouseScroll", function (event) {
        if (event.axis == event.HORIZONTAL_AXIS) {
            event.stopPropagation();
            event.preventDefault();
            event.cancelBubble = !1;
        }
        return !1;
    }, !1);

    // Ngăn chặn menu chuột phải mặc định khi click chuột giữa.
    document.onmousedown = function (event) {
        if (event.which == 2) { // 2 là chuột giữa.
            event.preventDefault();
        }
    };
})();