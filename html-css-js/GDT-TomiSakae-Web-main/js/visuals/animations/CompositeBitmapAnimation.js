// Định nghĩa một lớp CompositeBitmapAnimation, được sử dụng để quản lý và vẽ một tập hợp các animation bitmap.
// Tham số 'initialSpeedFactor' (được đổi tên từ 'a') có thể là một yếu tố tốc độ ban đầu,
// nhưng trong code hiện tại nó không được sử dụng trực tiếp trong constructor.
var CompositeBitmapAnimation = function (initialSpeedFactor) {
    // Mảng chứa các đối tượng BitmapAnimationX nội bộ.
    // Mỗi BitmapAnimationX đại diện cho một layer hoặc một phần của animation tổng hợp.
    this._internalAnimations = [];
};

(function () {
    // Kế thừa từ createjs.DisplayObject để CompositeBitmapAnimation có thể được thêm vào EaselJS stage.
    CompositeBitmapAnimation.prototype = new createjs.DisplayObject();

    // Gán prototype vào một biến ngắn hơn để dễ sử dụng.
    var proto = CompositeBitmapAnimation.prototype; // Đổi tên 'a' thành 'proto'

    // Kiểm tra xem animation có hiển thị hay không.
    // Điều này được xác định bởi alpha của animation nội bộ đầu tiên.
    proto.isVisible = function () {
        return 0 < this._internalAnimations[0].alpha;
    };

    // Thêm một BitmapAnimationX vào tập hợp các animation nội bộ.
    // 'animationInstance' (đổi tên từ 'a') là một đối tượng BitmapAnimationX.
    proto.addAnimation = function (animationInstance) {
        // Nếu đã có animation nội bộ, kiểm tra xem speedFactor có khớp không.
        // Điều này đảm bảo tất cả các layer của animation tổng hợp chạy cùng tốc độ.
        if (0 < this._internalAnimations.length) {
            if (this._internalAnimations[0].speedFactor != animationInstance.speedFactor) {
                throw "invalid speedFactor for CompositeBitmapAnimation";
            }
        } else {
            // Nếu đây là animation đầu tiên được thêm vào, gán callback onAnimationEnded.
            // 'self' (đổi tên từ 'c') tham chiếu đến đối tượng CompositeBitmapAnimation hiện tại.
            var self = this;
            animationInstance.onAnimationEnded = function (anim, nextAnimation) { // Đổi tên 'a', 'b' thành 'anim', 'nextAnimation'
                self.onAnimationEnd(anim, nextAnimation);
            };
        }
        // Thêm animationInstance vào mảng _internalAnimations.
        this._internalAnimations.push(animationInstance);
    };

    // Thiết lập giá trị alpha (độ trong suốt) cho tất cả các animation nội bộ.
    // 'alphaValue' (đổi tên từ 'a') là giá trị alpha từ 0 (trong suốt) đến 1 (không trong suốt).
    proto.setAlpha = function (alphaValue) {
        for (var i = 0; i < this._internalAnimations.length; i++) { // Đổi tên 'c' thành 'i'
            this._internalAnimations[i].setAlpha(alphaValue);
        }
    };

    // Kiểm tra xem tất cả hình ảnh (baseImage và spriteSheet) của các animation nội bộ đã được tải xong chưa.
    // Cũng kiểm tra các hình ảnh overlay nếu có.
    proto.isAllLoaded = function () {
        for (var i = 0, len = this._internalAnimations.length; i < len; i++) { // Đổi tên 'a', 'c' thành 'i', 'len'
            var currentAnim = this._internalAnimations[i]; // Biến tạm để code dễ đọc hơn
            if ((currentAnim.baseImage && !currentAnim.baseImage.complete) ||
                !currentAnim.spriteSheet.complete) {
                return false;
            }
        }
        // Kiểm tra thêm các hình ảnh trong đối tượng overlay nếu có
        return !(this.overlay &&
            ((this.overlay.deskImage && !this.overlay.deskImage.complete) ||
                (this.overlay.keyBoardImage && !this.overlay.keyBoardImage.complete) ||
                (this.overlay.pcImage && !this.overlay.pcImage.complete))
        );
    };

    // Thiết lập trạng thái tạm dừng (paused) cho animation tổng hợp và tất cả các animation nội bộ.
    // 'pauseState' (đổi tên từ 'a') là true để tạm dừng, false để tiếp tục.
    proto.setPaused = function (pauseState) {
        this.paused = pauseState;
        for (var i = 0; i < this._internalAnimations.length; i++) { // Đổi tên 'c' thành 'i'
            this._internalAnimations[i].setPaused(pauseState);
        }
    };

    // Lưu trạng thái hiện tại của animation (frame, animation đang chạy, storyboard, paused, alpha).
    // Trạng thái này được lấy từ animation nội bộ đầu tiên.
    proto.saveState = function () {
        var state = {}; // Đổi tên 'a' thành 'state'
        var firstAnim = this._internalAnimations[0]; // Biến tạm để code dễ đọc hơn
        state.currentFrame = firstAnim.currentAnimationFrame;
        state.currentAnimation = firstAnim.currentAnimation;
        state.storyBoard = firstAnim.currentStoryBoard;
        state.paused = firstAnim.paused;
        state.alpha = firstAnim.alpha;
        return state;
    };

    // Tải (khôi phục) trạng thái của animation từ một đối tượng trạng thái đã lưu.
    // 'savedState' (đổi tên từ 'a') là đối tượng trạng thái.
    proto.loadState = function (savedState) {
        if (savedState) {
            for (var i = 0; i < this._internalAnimations.length; i++) { // Đổi tên 'c' thành 'i'
                var currentInternalAnim = this._internalAnimations[i]; // Biến tạm
                currentInternalAnim.currentStoryBoard = savedState.storyBoard;
                currentInternalAnim.currentAnimationFrame = savedState.currentFrame;

                var animationData = currentInternalAnim.spriteSheet.getAnimation(savedState.currentAnimation); // Đổi tên 'f' thành 'animationData'
                currentInternalAnim._animation = animationData;
                currentInternalAnim.currentAnimation = savedState.currentAnimation;

                // Nếu có storyboard, kiểm tra và đảm bảo các animation trong storyboard tồn tại trong spritesheet.
                // Nếu không, mặc định là "loop".
                if (currentInternalAnim.currentStoryBoard) {
                    var storyBoardAnimations = currentInternalAnim.currentStoryBoard; // Đổi tên 'd' thành 'storyBoardAnimations'
                    for (var j = 0; j < storyBoardAnimations.length; j++) { // Đổi tên 'k' thành 'j'
                        animationData = currentInternalAnim.spriteSheet._animations.first(function (anim) { // Đổi tên 'a' thành 'anim' (trong callback)
                            return anim === storyBoardAnimations[j];
                        });
                        if (!animationData) {
                            storyBoardAnimations[j] = "loop";
                        }
                    }
                }

                // Nếu animation hiện tại không tồn tại trong spritesheet, mặc định là "loop" và frame 0.
                if (currentInternalAnim.currentAnimation) {
                    var currentAnimationName = currentInternalAnim.currentAnimation; // Đổi tên 'm' thành 'currentAnimationName'
                    animationData = currentInternalAnim.spriteSheet._animations.first(function (anim) { // Đổi tên 'a' thành 'anim' (trong callback)
                        return anim === currentAnimationName;
                    });
                    if (!animationData) {
                        currentInternalAnim.currentAnimation = "loop";
                        currentInternalAnim._animation = currentInternalAnim.spriteSheet.getAnimation(currentInternalAnim.currentAnimation);
                        currentInternalAnim.currentAnimationFrame = 0;
                    }
                }

                currentInternalAnim._normalizeFrame();
                currentInternalAnim.paused = savedState.paused;
                currentInternalAnim.alpha = savedState.alpha;
            }
        }
    };

    // Dừng tất cả các animation nội bộ.
    proto.stop = function () {
        for (var i = 0; i < this._internalAnimations.length; i++) { // Đổi tên 'a' thành 'i'
            this._internalAnimations[i].stop();
        }
    };

    // Chuyển đến một frame cụ thể và bắt đầu phát tất cả các animation nội bộ.
    // 'animationNameOrFrame' (đổi tên từ 'a') có thể là tên animation hoặc số frame.
    proto.gotoAndPlay = function (animationNameOrFrame) {
        for (var i = 0; i < this._internalAnimations.length; i++) { // Đổi tên 'c' thành 'i'
            this._internalAnimations[i].gotoAndPlay(animationNameOrFrame);
        }
    };

    // Chuyển đến một frame cụ thể và dừng tất cả các animation nội bộ.
    // 'animationNameOrFrame' (đổi tên từ 'a') có thể là tên animation hoặc số frame.
    proto.gotoAndStop = function (animationNameOrFrame) {
        for (var i = 0; i < this._internalAnimations.length; i++) { // Đổi tên 'c' thành 'i'
            this._internalAnimations[i].gotoAndStop(animationNameOrFrame);
        }
    };

    // Phát một storyboard (chuỗi các animation) cho tất cả các animation nội bộ.
    // 'storyBoardArray' (đổi tên từ 'a') là mảng chứa tên các animation hoặc "#stop".
    proto.playStoryBoard = function (storyBoardArray) {
        for (var i = 0; i < this._internalAnimations.length; i++) { // Đổi tên 'c' thành 'i'
            var currentInternalAnim = this._internalAnimations[i]; // Biến tạm
            currentInternalAnim.currentStoryBoard = storyBoardArray;
            if (storyBoardArray && storyBoardArray.length) {
                var nextAnimationInBoard = storyBoardArray[0]; // Đổi tên 'f' thành 'nextAnimationInBoard'
                if ("#stop" == nextAnimationInBoard) {
                    currentInternalAnim._stopAnimation();
                } else {
                    currentInternalAnim.gotoAndPlay(nextAnimationInBoard);
                }
            } else {
                currentInternalAnim.stop();
            }
        }
    };

    // Dừng tất cả các animation nội bộ tại frame cuối cùng của animation hiện tại.
    proto._stopAnimation = function () {
        for (var i = 0; i < this._internalAnimations.length; i++) { // Đổi tên 'a' thành 'i'
            var currentInternalAnim = this._internalAnimations[i]; // Biến tạm
            var lastFrame = currentInternalAnim._animation.frames.last(); // Đổi tên 'c' thành 'lastFrame'
            currentInternalAnim.gotoAndStop(lastFrame);
        }
    };

    // Callback được gọi khi một animation kết thúc.
    // Nó sẽ kích hoạt callback `onAnimationEnded` của CompositeBitmapAnimation nếu storyboard đã hoàn thành.
    // 'animationSource' (đổi tên từ 'a') là BitmapAnimationX đã kết thúc.
    // 'nextAnimation' (đổi tên từ 'c') là animation tiếp theo trong storyboard (nếu có).
    proto.onAnimationEnd = function (animationSource, nextAnimation) {
        if (this.onAnimationEnded &&
            (0 == animationSource.currentStoryBoard.length ||
                (1 == animationSource.currentStoryBoard.length && "#stop" === animationSource.currentStoryBoard[0])
            )
        ) {
            this.onAnimationEnded(animationSource, nextAnimation);
        }
    };

    // Hàm tick, được gọi mỗi frame để cập nhật tất cả các animation nội bộ.
    proto._tick = function () {
        for (var i = 0; i < this._internalAnimations.length; i++) { // Đổi tên 'a' thành 'i'
            this._internalAnimations[i]._tick();
        }
    };

    // Hàm vẽ animation tổng hợp lên canvas.
    // 'ctx' (đổi tên từ 'a') là context 2D của canvas.
    // 'ignoreCache' (đổi tên từ 'c') là cờ bỏ qua cache (không được sử dụng trong logic này).
    proto.draw = function (ctx, ignoreCache) {
        var firstAnimCurrentFrame = this._internalAnimations[0].currentFrame; // Đổi tên 'f' thành 'firstAnimCurrentFrame'

        // Nếu chưa tải xong hoặc không có baseImage ở animation đầu tiên, chưa vẽ gì.
        if (!this.isAllLoaded() || typeof this._internalAnimations[0].baseImage === 'undefined') {
            return true; // Hoặc false tùy theo ý định của DisplayObject_draw
        }

        // Tạo canvas đệm (cachedFrame) nếu chưa có.
        if (!this.cachedFrame) {
            this.cachedFrame = document.createElement("canvas");
            this.cachedFrame.width = this._internalAnimations[0].baseImage.naturalWidth;
            this.cachedFrame.height = this._internalAnimations[0].baseImage.naturalHeight;
        }

        // Nếu frame hiện tại khác với frame đã cache, vẽ lại vào canvas đệm.
        if (this.cachedFrame.frameNr !== firstAnimCurrentFrame) {
            var cacheCtx = this.cachedFrame.getContext("2d"); // Đổi tên 'd' thành 'cacheCtx'
            cacheCtx.clearRect(0, 0, this.cachedFrame.width, this.cachedFrame.height);

            // Vẽ lần lượt các animation nội bộ lên canvas đệm.
            for (var i = 0, len = this._internalAnimations.length; i < len; i++) { // Đổi tên 'k', 'm' thành 'i', 'len'
                // Đồng bộ frame hiện tại của các animation nội bộ với animation đầu tiên.
                this._internalAnimations[i].currentFrame = this._internalAnimations[0].currentFrame;
                this._internalAnimations[i].currentAnimationFrame = this._internalAnimations[0].currentAnimationFrame;
                this._internalAnimations[i]._animation = this._internalAnimations[0]._animation;

                // Vẽ animation nội bộ hiện tại lên canvas đệm.
                this._internalAnimations[i].draw(cacheCtx, ignoreCache, undefined); // Truyền undefined cho 'ignoreCache' của lớp con

                // Vẽ các thành phần overlay (desk, keyboard) tại các layer cụ thể.
                // Logic này hơi phức tạp và phụ thuộc vào cấu trúc của animation.
                if ((i === 1 && len > 2) || // Nếu là layer thứ 2 và có hơn 2 layers
                    (i === 1 && len === 1) || // Hoặc nếu chỉ có 1 layer (và đây là layer đó sau baseImage)
                    (i === 0 && len === 2)    // Hoặc nếu là layer đầu tiên và có tổng 2 layers
                ) {
                    if (this.overlay) {
                        if (this.overlay.deskImage && this.overlay.deskImage.complete) {
                            cacheCtx.drawImage(this.overlay.deskImage, 0, 0);
                        }
                        if (this.overlay.keyBoardImage && this.overlay.keyBoardImage.complete) {
                            cacheCtx.drawImage(this.overlay.keyBoardImage, 0, 0);
                        }
                    }
                }
            }
            // Vẽ pcImage (nếu có) lên trên cùng.
            if (this.overlay && this.overlay.pcImage && this.overlay.pcImage.complete) {
                cacheCtx.drawImage(this.overlay.pcImage, 0, 0);
            }
            // Lưu frame đã vẽ vào cache.
            this.cachedFrame.frameNr = firstAnimCurrentFrame;
        }

        // Vẽ canvas đệm (đã chứa animation tổng hợp) lên canvas chính.
        if (this.cachedFrame && this.cachedFrame.width > 0 && this.cachedFrame.height > 0) {
            ctx.drawImage(this.cachedFrame, this.x, this.y);
        }
        return true;
    };
})();