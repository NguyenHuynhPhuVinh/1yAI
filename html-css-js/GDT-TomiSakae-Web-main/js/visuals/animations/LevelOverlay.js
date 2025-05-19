// --- START OF FILE LevelOverlay.js ---

/**
 * Hàm khởi tạo cho LevelOverlay.
 * Quản lý các đối tượng đồ họa (lớp phủ) cho các level khác nhau trong game.
 * Bao gồm các animation cho máy lạnh, máy nước uống, và các thiết bị trong phòng lab.
 * @param {Company} companyObject - Đối tượng công ty hiện tại của người chơi.
 */
var LevelOverlay = function (companyObject) {
    // Tạo các container cho các lớp phủ đồ họa của các khu vực khác nhau (trung tâm, trái, phải)
    this.centerOverlay = new createjs.Container;
    this.leftOverlay = new createjs.Container;
    this.rightOverlay = new createjs.Container;
    // Lưu trữ đối tượng công ty để truy cập thông tin level và flags
    this.company = companyObject;
    // Khởi tạo các animation cần thiết cho level hiện tại
    this.initAnimations();
    // Nếu có trạng thái lớp phủ đã lưu từ trước (ví dụ khi load game), thì tải lại trạng thái đó
    companyObject.levelOverlay && this.loadState(companyObject.levelOverlay);
};

(function () {
    var levelOverlayPrototype = LevelOverlay.prototype; // Đặt tên rõ ràng cho prototype

    /**
     * Khởi tạo các đối tượng animation dựa trên level hiện tại của công ty và các cờ (flags) đã mở khóa.
     */
    levelOverlayPrototype.initAnimations = function () {
        var currentLevel = GameManager.company.currentLevel;
        var globalScale = CanvasManager.globalScale;

        // Khởi tạo animation máy lạnh nếu ở level 2 hoặc 3
        if (2 === currentLevel || 3 === currentLevel) {
            this.airConAnimation1 = new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets.airCon));
            this.airConAnimation1.scaleX = globalScale;
            this.airConAnimation1.scaleY = globalScale;
            this.airConAnimation1.x = VisualsManager.toScreenCoordinates(84, globalScale);
            this.airConAnimation1.y = VisualsManager.toScreenCoordinates(-2, globalScale);

            this.airConAnimation2 = new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets.airCon));
            this.airConAnimation2.scaleX = globalScale;
            this.airConAnimation2.scaleY = globalScale;
            this.airConAnimation2.x = VisualsManager.toScreenCoordinates(406, globalScale);
            this.airConAnimation2.y = VisualsManager.toScreenCoordinates(-188, globalScale);
        }

        // Khởi tạo animation máy nước uống nếu level lớn hơn 1
        if (1 < currentLevel) {
            this.waterCoolerAnimation = new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets.waterCooler));
            this.waterCoolerAnimation.scaleX = globalScale;
            this.waterCoolerAnimation.scaleY = globalScale;
        }

        // Khởi tạo animation cho phòng lab ở level 4
        if (4 === currentLevel) {
            // Nếu phòng lab phần cứng (Hardware Lab) đã mở khóa
            if (GameManager.company.flags.hwLabUnlocked) {
                this.hwLabScreenWallAnimation = new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets.hwLabScreenWall));
                this.hwLabScreenWallAnimation.scaleX = globalScale;
                this.hwLabScreenWallAnimation.scaleY = globalScale;
                this.hwLabScreenWallAnimation.x = VisualsManager.toScreenCoordinates(503, globalScale);
                this.hwLabScreenWallAnimation.y = VisualsManager.toScreenCoordinates(182, globalScale);

                this.hwLabTVAnimation = new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets.hwTV));
                this.hwLabTVAnimation.scaleX = globalScale;
                this.hwLabTVAnimation.scaleY = globalScale;
                this.hwLabTVAnimation.x = VisualsManager.toScreenCoordinates(2298, globalScale);
                this.hwLabTVAnimation.y = VisualsManager.toScreenCoordinates(788, globalScale);

                this.hwLabTVAnimationCenter = new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets.hwTV)); // Dùng chung spritesheet với TV ở khu vực trái
                this.hwLabTVAnimationCenter.scaleX = globalScale;
                this.hwLabTVAnimationCenter.scaleY = globalScale;
                this.hwLabTVAnimationCenter.x = VisualsManager.toScreenCoordinates(-262, globalScale); // Vị trí khác
                this.hwLabTVAnimationCenter.y = VisualsManager.toScreenCoordinates(788, globalScale);
            }
            // Nếu phòng lab nghiên cứu & phát triển (R&D Lab) đã mở khóa
            if (GameManager.company.flags.rndLabUnlocked) {
                this.printerAnimation = new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets.printer));
                this.printerAnimation.scaleX = globalScale;
                this.printerAnimation.scaleY = globalScale;
                this.printerAnimation.x = VisualsManager.toScreenCoordinates(608, globalScale);
                this.printerAnimation.y = VisualsManager.toScreenCoordinates(435, globalScale);

                this.rndPrinterLeftScreen = new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets.rndPrinterLeftScreen));
                this.rndPrinterLeftScreen.scaleX = globalScale;
                this.rndPrinterLeftScreen.scaleY = globalScale;
                this.rndPrinterLeftScreen.x = VisualsManager.toScreenCoordinates(395, globalScale);
                this.rndPrinterLeftScreen.y = VisualsManager.toScreenCoordinates(311, globalScale);

                this.rndPrinterRightScreen = new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets.rndPrinterRightScreen));
                this.rndPrinterRightScreen.scaleX = globalScale;
                this.rndPrinterRightScreen.scaleY = globalScale;
                this.rndPrinterRightScreen.x = VisualsManager.toScreenCoordinates(747, globalScale);
                this.rndPrinterRightScreen.y = VisualsManager.toScreenCoordinates(311, globalScale);
            }
        }

        var self = this; // Lưu 'this' để sử dụng trong callback
        var companyCurrentLevel = GameManager.company.currentLevel; // Lưu lại để tránh truy cập lặp lại

        // Thêm các animation vào các lớp phủ tương ứng
        if (4 === companyCurrentLevel) {
            if (GameManager.company.flags.hwLabUnlocked) {
                this.leftOverlay.addChild(this.hwLabScreenWallAnimation);
                this.leftOverlay.addChild(this.hwLabTVAnimation);
                this.centerOverlay.addChild(this.hwLabTVAnimationCenter);
            }
            if (GameManager.company.flags.rndLabUnlocked) {
                this.rightOverlay.addChild(this.rndPrinterLeftScreen);
                this.rightOverlay.addChild(this.rndPrinterRightScreen);
                this.rightOverlay.addChild(this.printerAnimation);
            }
        }

        if (2 === companyCurrentLevel || 3 === companyCurrentLevel) {
            this.centerOverlay.addChild(this.airConAnimation1);
            this.centerOverlay.addChild(this.airConAnimation2);
            // Thiết lập callback khi animation máy lạnh kết thúc
            this.airConAnimation1.onAnimationEnded = function (animation, nextAnimationName) {
                self.endedAnimation.call(self, animation, nextAnimationName, "airConAnimation1");
            };
            this.airConAnimation2.onAnimationEnded = function (animation, nextAnimationName) {
                self.endedAnimation.call(self, animation, nextAnimationName, "airConAnimation2");
            };
        }

        if (1 < companyCurrentLevel) {
            // Điều chỉnh vị trí máy nước uống dựa trên level
            if (4 === companyCurrentLevel) {
                this.waterCoolerAnimation.x = 1541 / VisualsManager.Divisor * globalScale;
                this.waterCoolerAnimation.y = 440 / VisualsManager.Divisor * globalScale;
            } else {
                this.waterCoolerAnimation.x = 1501 / VisualsManager.Divisor * globalScale;
                this.waterCoolerAnimation.y = 211 / VisualsManager.Divisor * globalScale;
            }
            this.centerOverlay.addChild(this.waterCoolerAnimation);
            // Thiết lập callback khi animation máy nước uống kết thúc
            this.waterCoolerAnimation.onAnimationEnded = function (animation, nextAnimationName) {
                self.endedAnimation.call(self, animation, nextAnimationName, "waterCoolerAnimation");
            };
        }

        // Thiết lập trạng thái ban đầu cho các animation (dừng ở frame "loop", ẩn đi)
        if (this.airConAnimation1) { // Kiểm tra sự tồn tại trước khi truy cập
            this.airConAnimation1.gotoAndStop("loop");
            this.airConAnimation2.gotoAndStop("loop");
            this.airConAnimation1.setAlpha(0);
            this.airConAnimation2.setAlpha(0);
        }
        if (this.waterCoolerAnimation) {
            this.waterCoolerAnimation.gotoAndStop("loop");
            this.waterCoolerAnimation.setAlpha(1); // Máy nước uống luôn hiển thị
        }
        if (this.hwLabScreenWallAnimation) {
            this.hwLabScreenWallAnimation.gotoAndStop("loop");
            this.hwLabScreenWallAnimation.setAlpha(0);
            this.hwLabTVAnimation.gotoAndStop("loop");
            this.hwLabTVAnimation.setAlpha(0);
            this.hwLabTVAnimationCenter.gotoAndStop("loop");
            this.hwLabTVAnimationCenter.setAlpha(0);
        }
        if (this.printerAnimation) {
            this.printerAnimation.gotoAndStop("loop");
            this.printerAnimation.setAlpha(0);
            this.rndPrinterLeftScreen.gotoAndStop("loop");
            this.rndPrinterLeftScreen.setAlpha(0);
            this.rndPrinterRightScreen.gotoAndStop("loop");
            this.rndPrinterRightScreen.setAlpha(0);
        }
    };

    /** Bắt đầu animation cho máy lạnh thứ nhất. */
    levelOverlayPrototype.startAirCon1 = function () {
        if (this.airConAnimation1) { // Kiểm tra null/undefined
            this.airConAnimation1.setAlpha(1);
            this.airConAnimation1.playStoryBoard(["loop"]);
        }
    };

    /** Bắt đầu animation màn hình tường trong phòng lab phần cứng. */
    levelOverlayPrototype.startHwLabScreenWall = function () {
        if (this.hwLabScreenWallAnimation && this.hwLabScreenWallAnimation.paused) {
            this.hwLabScreenWallAnimation.setAlpha(1);
            this.hwLabScreenWallAnimation.playStoryBoard(["loop"]);
        }
    };

    /** Dừng animation màn hình tường trong phòng lab phần cứng. */
    levelOverlayPrototype.stopHwLabScreenWall = function () {
        if (this.hwLabScreenWallAnimation && !this.hwLabScreenWallAnimation.paused) {
            this.hwLabScreenWallAnimation.setAlpha(0);
            this.hwLabScreenWallAnimation.paused = true;
        }
    };

    /** Bắt đầu animation TV trong phòng lab phần cứng. */
    levelOverlayPrototype.starthwLabTV = function () {
        if (this.hwLabTVAnimation && this.hwLabTVAnimation.paused) { // Kiểm tra cả hwLabTVAnimationCenter
            this.hwLabTVAnimation.setAlpha(1);
            this.hwLabTVAnimation.playStoryBoard(["loop"]);
            this.hwLabTVAnimationCenter.setAlpha(1);
            this.hwLabTVAnimationCenter.playStoryBoard(["loop"]);
        }
    };

    /** Dừng animation TV trong phòng lab phần cứng. */
    levelOverlayPrototype.stophwLabTV = function () {
        if (this.hwLabTVAnimation && !this.hwLabTVAnimation.paused) { // Kiểm tra cả hwLabTVAnimationCenter
            this.hwLabTVAnimation.setAlpha(0);
            this.hwLabTVAnimation.paused = true;
            this.hwLabTVAnimationCenter.setAlpha(0);
            this.hwLabTVAnimationCenter.paused = true;
        }
    };

    /** Bắt đầu animation máy in. */
    levelOverlayPrototype.startPrinter = function () {
        if (this.printerAnimation && this.printerAnimation.paused) {
            this.printerAnimation.setAlpha(1);
            this.printerAnimation.playStoryBoard(["loop"]);
        }
    };

    /** Dừng animation máy in. */
    levelOverlayPrototype.stopPrinter = function () {
        if (this.printerAnimation && !this.printerAnimation.paused) {
            this.printerAnimation.setAlpha(0);
            this.printerAnimation.paused = true;
        }
    };

    /** Bắt đầu animation màn hình máy in bên trái trong phòng R&D. */
    levelOverlayPrototype.startRndPrinterLeftScreen = function () {
        if (this.rndPrinterLeftScreen && this.rndPrinterLeftScreen.paused) {
            this.rndPrinterLeftScreen.setAlpha(1);
            this.rndPrinterLeftScreen.playStoryBoard(["loop"]);
        }
    };

    /** Dừng animation màn hình máy in bên trái trong phòng R&D. */
    levelOverlayPrototype.stopRndPrinterLeftScreen = function () {
        if (this.rndPrinterLeftScreen && !this.rndPrinterLeftScreen.paused) {
            this.rndPrinterLeftScreen.setAlpha(0);
            this.rndPrinterLeftScreen.paused = true;
        }
    };

    /** Bắt đầu animation màn hình máy in bên phải trong phòng R&D. */
    levelOverlayPrototype.startRndPrinterRightScreen = function () {
        if (this.rndPrinterRightScreen && this.rndPrinterRightScreen.paused) {
            this.rndPrinterRightScreen.setAlpha(1);
            this.rndPrinterRightScreen.playStoryBoard(["loop"]);
        }
    };

    /** Dừng animation màn hình máy in bên phải trong phòng R&D. */
    levelOverlayPrototype.stopRndPrinterRightScreen = function () {
        if (this.rndPrinterRightScreen && !this.rndPrinterRightScreen.paused) {
            this.rndPrinterRightScreen.setAlpha(0);
            this.rndPrinterRightScreen.paused = true;
        }
    };

    /** Bắt đầu animation cho máy lạnh thứ hai. */
    levelOverlayPrototype.startAirCon2 = function () {
        if (this.airConAnimation2) { // Kiểm tra null/undefined
            this.airConAnimation2.setAlpha(1);
            this.airConAnimation2.playStoryBoard(["loop"]);
        }
    };

    /** Bắt đầu animation cho máy nước uống. */
    levelOverlayPrototype.startWaterCooler = function () {
        if (this.waterCoolerAnimation && true === this.waterCoolerAnimation.paused) {
            this.waterCoolerAnimation.playStoryBoard(["loop"]);
        }
    };

    /**
     * Xử lý khi một animation kết thúc.
     * Chủ yếu để dừng animation máy nước uống sau khi nó chạy một vòng.
     * @param {BitmapAnimationX} animationInstance - Đối tượng animation vừa kết thúc.
     * @param {string} nextAnimationName - Tên của animation tiếp theo (nếu có).
     * @param {string} animationIdentifier - Một chuỗi để xác định animation nào đã kết thúc.
     */
    levelOverlayPrototype.endedAnimation = function (animationInstance, nextAnimationName, animationIdentifier) {
        if ("loop" === animationInstance.currentAnimation) {
            if ("airConAnimation1" !== animationIdentifier && "airConAnimation2" !== animationIdentifier) {
                if ("waterCoolerAnimation" === animationIdentifier && this.waterCoolerAnimation) { // Kiểm tra null/undefined
                    this.waterCoolerAnimation.gotoAndStop("loop");
                }
                // Có thể thêm các xử lý khác cho các animation khác ở đây nếu cần
            }
        }
    };

    /**
     * Lưu trạng thái hiện tại của các animation vào một đối tượng.
     * @returns {object} Đối tượng chứa trạng thái của các animation.
     */
    levelOverlayPrototype.saveState = function () {
        var state = {};
        if (this.airConAnimation1) state.airConAnimation1 = this.airConAnimation1.saveState();
        if (this.airConAnimation2) state.airConAnimation2 = this.airConAnimation2.saveState();
        if (this.waterCoolerAnimation) state.waterCoolerAnimation = this.waterCoolerAnimation.saveState();
        if (this.hwLabScreenWallAnimation) state.hwLabScreenWallAnimation = this.hwLabScreenWallAnimation.saveState();
        if (this.hwLabTVAnimation) state.hwLabTVnimation = this.hwLabTVAnimation.saveState(); // Lưu ý: có lỗi typo ở đây trong code gốc "hwLabTVnimation"
        if (this.printerAnimation) state.printerAnimation = this.printerAnimation.saveState();
        if (this.rndPrinterLeftScreen) state.rndPrinterLeftScreen = this.rndPrinterLeftScreen.saveState();
        if (this.rndPrinterRightScreen) state.rndPrinterRightScreen = this.rndPrinterRightScreen.saveState();
        return state;
    };

    /**
     * Tải và áp dụng trạng thái đã lưu cho các animation.
     * @param {object} savedState - Đối tượng trạng thái đã lưu.
     */
    levelOverlayPrototype.loadState = function (savedState) {
        if (savedState) {
            var companyCurrentLevel = GameManager.company.currentLevel;
            if (2 === companyCurrentLevel || 3 === companyCurrentLevel) {
                if (this.airConAnimation1) this.airConAnimation1.loadState(savedState.airConAnimation1);
                if (this.airConAnimation2) this.airConAnimation2.loadState(savedState.airConAnimation2);
            }
            if (1 < companyCurrentLevel && this.waterCoolerAnimation) {
                this.waterCoolerAnimation.loadState(savedState.waterCoolerAnimation);
            }
            if (4 === companyCurrentLevel && GameManager.company.flags.hwLabUnlocked) {
                if (this.hwLabScreenWallAnimation) this.hwLabScreenWallAnimation.loadState(savedState.hwLabScreenWallAnimation);
                if (this.hwLabTVAnimation) this.hwLabTVAnimation.loadState(savedState.hwLabTVnimation); // Lưu ý: lỗi typo
                if (this.hwLabTVAnimationCenter) this.hwLabTVAnimationCenter.loadState(savedState.hwLabTVnimation); // Dùng chung trạng thái với hwLabTVAnimation
            }
            if (4 === companyCurrentLevel && GameManager.company.flags.rndLabUnlocked) {
                if (this.printerAnimation) this.printerAnimation.loadState(savedState.printerAnimation);
                if (this.rndPrinterLeftScreen) this.rndPrinterLeftScreen.loadState(savedState.rndPrinterLeftScreen);
                if (this.rndPrinterRightScreen) this.rndPrinterRightScreen.loadState(savedState.rndPrinterRightScreen);
            }
        }
    };
})();
// --- END OF FILE LevelOverlay.js ---