"use strict";
var BitmapAnimationFactory = {
    /**
     * Tạo một đối tượng animation dựa trên loại, hướng, và các thông số khác.
     * @param {string} animationType Loại animation (ví dụ: "thinking", "typing").
     * @param {number} speedFactor Hệ số tốc độ của animation.
     * @param {CharacterOrientation} orientation Hướng của nhân vật (víg dụ: NW, SE).
     * @param {number} bodyVariation Biến thể của thân nhân vật.
     * @param {number} headVariation Biến thể của đầu nhân vật.
     * @returns {createjs.DisplayObject | null} Đối tượng animation đã tạo hoặc null.
     */
    createAnimation: function (animationType, speedFactor, orientation, bodyVariation, headVariation) {
        var animationObject, // Biến tạm để lưu đối tượng animation
            globalScale = CanvasManager.globalScale; // Lấy tỷ lệ global từ CanvasManager

        switch (animationType) {
            case "thinking":
                animationObject = BitmapAnimationFactory.createThinkingAnimation(speedFactor, orientation, bodyVariation, headVariation);
                animationObject.scaleX = globalScale;
                animationObject.scaleY = globalScale;
                break;
            case "typing":
                animationObject = BitmapAnimationFactory.createTypingAnimation(speedFactor, orientation, bodyVariation, headVariation);
                animationObject.scaleX = globalScale;
                animationObject.scaleY = globalScale;
                break;
            case "sitBack":
                animationObject = BitmapAnimationFactory.createIdleAnimation(speedFactor, orientation, bodyVariation, headVariation);
                animationObject.scaleX = globalScale;
                animationObject.scaleY = globalScale;
                break;
            case "drawNotepad":
                animationObject = BitmapAnimationFactory.createNotepadAnimation(speedFactor, orientation, bodyVariation, headVariation);
                animationObject.scaleX = globalScale;
                animationObject.scaleY = globalScale;
                break;
            case "screen":
                animationObject = BitmapAnimationFactory.createScreenAnimation(speedFactor, orientation);
                // Animation màn hình có thể không cần scale theo cách tương tự
                break;
        }
        return animationObject;
    },

    /**
     * Tạo animation cho tách trà.
     * @param {number} speedFactor Hệ số tốc độ.
     * @returns {BitmapAnimationX}
     */
    createTeaCupAnimation: function (speedFactor) {
        // Chọn spritesheet tách trà dựa trên level hiện tại của công ty
        return 2 === GameManager.company.currentLevel ?
            new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets.teaCupImageLevel2), speedFactor) :
            new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets.teaCupImage), speedFactor);
    },

    /**
     * Tạo animation cho màn hình máy tính khi nhân vật gõ phím.
     * @param {number} speedFactor Hệ số tốc độ.
     * @param {CharacterOrientation} orientation Hướng của nhân vật.
     * @returns {BitmapAnimationX | undefined}
     */
    createScreenAnimation: function (speedFactor, orientation) {
        var globalScale = CanvasManager.globalScale;
        var screenAnimation;

        if (orientation === CharacterOrientation.NW) { // Chỉ tạo nếu hướng là Tây-Bắc
            if (1 === GameManager.company.currentLevel) {
                screenAnimation = new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets.typingScreenL1), speedFactor);
                screenAnimation.x = VisualsManager.toScreenCoordinates(12, globalScale);
                screenAnimation.scaleX = globalScale;
                screenAnimation.scaleY = globalScale;
                return screenAnimation;
            }
            if (2 === GameManager.company.currentLevel) {
                screenAnimation = new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets.typingScreenL2), speedFactor);
                screenAnimation.x = VisualsManager.toScreenCoordinates(-1, globalScale);
                screenAnimation.y = VisualsManager.toScreenCoordinates(-17, globalScale);
                screenAnimation.scaleX = globalScale;
                screenAnimation.scaleY = globalScale;
                return screenAnimation;
            }
            if (3 === GameManager.company.currentLevel) {
                screenAnimation = new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets.typingScreenL3), speedFactor);
                screenAnimation.x = VisualsManager.toScreenCoordinates(-16, globalScale);
                screenAnimation.y = VisualsManager.toScreenCoordinates(-35, globalScale);
                screenAnimation.scaleX = globalScale;
                screenAnimation.scaleY = globalScale;
                return screenAnimation;
            }
            if (4 === GameManager.company.currentLevel) {
                screenAnimation = new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets.typingScreenL4), speedFactor);
                screenAnimation.x = VisualsManager.toScreenCoordinates(-4, globalScale);
                screenAnimation.y = VisualsManager.toScreenCoordinates(-39, globalScale);
                screenAnimation.scaleX = globalScale;
                screenAnimation.scaleY = globalScale;
                return screenAnimation;
            }
        }
        // Không trả về gì nếu không phải hướng NW hoặc không có level phù hợp
    },

    // Các hàm tạo animation cụ thể, gọi hàm _createAnimation
    createThinkingAnimation: function (speedFactor, orientation, bodyVariation, headVariation) {
        return this._createAnimation(speedFactor, orientation, bodyVariation, headVariation, "thinking");
    },
    createNotepadAnimation: function (speedFactor, orientation, bodyVariation, headVariation) {
        return this._createAnimation(speedFactor, orientation, bodyVariation, headVariation, "notepad");
    },
    createIdleAnimation: function (speedFactor, orientation, bodyVariation, headVariation) {
        return this._createAnimation(speedFactor, orientation, bodyVariation, headVariation, "idle");
    },
    createTypingAnimation: function (speedFactor, orientation, bodyVariation, headVariation) {
        return this._createAnimation(speedFactor, orientation, bodyVariation, headVariation, "typing");
    },

    /**
     * Hàm nội bộ để tạo một composite animation cho nhân vật.
     * Bao gồm ghế, quần, tay, thân, và đầu.
     * @param {number} speedFactor Hệ số tốc độ.
     * @param {CharacterOrientation} orientation Hướng của nhân vật.
     * @param {number} bodyId ID/biến thể của thân.
     * @param {number} headId ID/biến thể của đầu.
     * @param {string} animationNamePrefix Tiền tố tên animation (ví dụ: "idle", "typing").
     * @returns {CompositeBitmapAnimation}
     */
    _createAnimation: function (speedFactor, orientation, bodyId, headId, animationNamePrefix) {
        var compositeAnimation; // Biến lưu trữ composite animation
        // Mặc định headId và bodyId là 1 nếu không được cung cấp
        if (typeof bodyId === 'undefined') { bodyId = 1; }
        if (typeof headId === 'undefined') { headId = 1; }

        if (orientation === CharacterOrientation.NW) { // Hướng Tây-Bắc (nhìn từ sau)
            compositeAnimation = new CompositeBitmapAnimation();
            // Thêm các lớp animation theo thứ tự vẽ (từ sau ra trước)
            compositeAnimation.addAnimation(new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets[animationNamePrefix + "BackC1_chair"]), speedFactor));
            // Chọn quần dựa trên headId (có vẻ headId > 8 là cho nữ?)
            if (headId > 8) {
                compositeAnimation.addAnimation(new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets[animationNamePrefix + "BackC9_pants"]), speedFactor));
            } else {
                compositeAnimation.addAnimation(new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets[animationNamePrefix + "BackC1_pants"]), speedFactor));
            }
            // Chọn tay dựa trên headId
            if (headId === 4 || headId === 7) {
                compositeAnimation.addAnimation(new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets[animationNamePrefix + "BackC4_hand"]), speedFactor));
            } else if (headId === 5 || headId === 8) {
                compositeAnimation.addAnimation(new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets[animationNamePrefix + "BackC5_hand"]), speedFactor));
            } else if (headId === 9 || headId === 11) {
                compositeAnimation.addAnimation(new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets[animationNamePrefix + "BackC9_hand"]), speedFactor));
            } else if (headId === 10) {
                compositeAnimation.addAnimation(new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets[animationNamePrefix + "BackC10_hand"]), speedFactor));
            } else if (headId === 12) {
                compositeAnimation.addAnimation(new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets[animationNamePrefix + "BackC12_hand"]), speedFactor));
            } else {
                compositeAnimation.addAnimation(new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets[animationNamePrefix + "BackC1_hand"]), speedFactor));
            }
            compositeAnimation.addAnimation(new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets[animationNamePrefix + "BackC" + bodyId + "_body"]), speedFactor));
            compositeAnimation.addAnimation(new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets[animationNamePrefix + "BackC" + headId + "_head"]), speedFactor));
        } else { // Hướng Đông-Nam (nhìn từ trước)
            compositeAnimation = new CompositeBitmapAnimation();
            compositeAnimation.addAnimation(new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets[animationNamePrefix + "FrontC1_chair"]), speedFactor));
            if (headId > 8) {
                compositeAnimation.addAnimation(new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets[animationNamePrefix + "FrontC9_pants"]), speedFactor));
            } else {
                compositeAnimation.addAnimation(new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets[animationNamePrefix + "FrontC1_pants"]), speedFactor));
            }
            if (headId === 4 || headId === 7) {
                compositeAnimation.addAnimation(new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets[animationNamePrefix + "FrontC4_hand"]), speedFactor));
            } else if (headId === 5 || headId === 8) {
                compositeAnimation.addAnimation(new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets[animationNamePrefix + "FrontC5_hand"]), speedFactor));
            } else if (headId === 9 || headId === 11) {
                compositeAnimation.addAnimation(new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets[animationNamePrefix + "FrontC9_hand"]), speedFactor));
            } else if (headId === 10) {
                compositeAnimation.addAnimation(new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets[animationNamePrefix + "FrontC10_hand"]), speedFactor));
            } else if (headId === 12) {
                compositeAnimation.addAnimation(new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets[animationNamePrefix + "FrontC12_hand"]), speedFactor));
            } else {
                compositeAnimation.addAnimation(new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets[animationNamePrefix + "FrontC1_hand"]), speedFactor));
            }
            compositeAnimation.addAnimation(new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets[animationNamePrefix + "FrontC" + bodyId + "_body"]), speedFactor));
            compositeAnimation.addAnimation(new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets[animationNamePrefix + "FrontC" + headId + "_head"]), speedFactor));
        }
        return compositeAnimation;
    }
};

/**
 * Lớp kế thừa từ createjs.BitmapAnimation, thêm một số logic tùy chỉnh.
 * @param {SpriteSheetX} spriteSheetData Dữ liệu spritesheet.
 * @param {number} [initialSpeedFactor=1] Hệ số tốc độ ban đầu.
 */
var BitmapAnimationX = function (spriteSheetData, initialSpeedFactor) {
    this.speedFactor = 1;
    if (initialSpeedFactor) {
        this.speedFactor = initialSpeedFactor;
    }
    createjs.BitmapAnimation.apply(this, arguments); // Gọi constructor của lớp cha
    this.targetFPS = spriteSheetData.targetFPS; // FPS mục tiêu cho từng animation
    if (spriteSheetData.baseImage) { // Nếu có ảnh nền tĩnh cho animation
        if (GameFlags.SLOWDOWN_BASEIMAGE === true) { // Tùy chọn debug: tải ảnh nền chậm
            window.setTimeout(function (selfInstance) {
                selfInstance.baseImage = new Image();
                selfInstance.baseImage.src = spriteSheetData.baseImage;
            }, 1, this);
        } else {
            this.baseImage = new Image();
            this.baseImage.src = spriteSheetData.baseImage;
        }
    }
};

(function () {
    BitmapAnimationX.prototype = new createjs.BitmapAnimation(); // Thiết lập kế thừa
    var _super = createjs.BitmapAnimation.prototype; // Lưu trữ prototype của lớp cha để có thể gọi
    var proto = BitmapAnimationX.prototype; // Viết tắt cho prototype của lớp hiện tại

    /** Đặt độ mờ cho animation. */
    proto.setAlpha = function (alphaValue) {
        this.alpha = alphaValue;
    };

    /** Đặt trạng thái tạm dừng cho animation. */
    proto.setPaused = function (isPaused) {
        this.paused = isPaused;
    };

    /** Lưu trạng thái hiện tại của animation. */
    proto.saveState = function () {
        var state = {};
        state.currentFrame = this.currentAnimationFrame;
        state.currentAnimation = this.currentAnimation;
        state.storyBoard = this.currentStoryBoard;
        state.paused = this.paused;
        state.alpha = this.alpha;
        return state;
    };

    /** Tải trạng thái đã lưu của animation. */
    proto.loadState = function (savedState) {
        if (savedState) {
            this.currentStoryBoard = savedState.storyBoard;
            this.currentAnimationFrame = savedState.currentFrame;
            this._animation = this.spriteSheet.getAnimation(savedState.currentAnimation);
            this.currentAnimation = savedState.currentAnimation;
            this._normalizeFrame(); // Chuẩn hóa frame để đảm bảo nằm trong giới hạn
            this.paused = savedState.paused;
            this.alpha = savedState.alpha;
        }
    };

    /**
     * Chạy một "storyboard" (chuỗi các animation).
     * @param {string[]} storyboardArray Mảng tên các animation.
     */
    proto.playStoryBoard = function (storyboardArray) {
        this.currentStoryBoard = storyboardArray;
        if (storyboardArray && storyboardArray.length) {
            var nextAnimationName = storyboardArray[0];
            if (nextAnimationName == "#stop") { // Lệnh đặc biệt để dừng
                this._stopAnimation();
            } else {
                this.gotoAndPlay(nextAnimationName);
            }
        } else {
            this.stop(); // Nếu storyboard rỗng, dừng animation
        }
    };

    /** Dừng animation ở frame cuối cùng. */
    proto._stopAnimation = function () {
        var lastFrameIndex = this._animation.frames.last(); // last() là hàm tự định nghĩa
        this.gotoAndStop(lastFrameIndex);
    };

    /**
     * Được gọi khi một animation trong storyboard kết thúc.
     * Chuyển sang animation tiếp theo trong storyboard.
     */
    proto.onAnimationEnd = function (endedAnimationName, nextAnimationName) {
        if (this.currentStoryBoard && this.currentStoryBoard.length > 0) {
            this.currentStoryBoard.splice(0, 1); // Xóa animation vừa kết thúc khỏi storyboard
            if (this.currentStoryBoard.length > 0) {
                var nextAnim = this.currentStoryBoard[0];
                if (nextAnim == "#stop") {
                    this._stopAnimation();
                } else {
                    this.gotoAndPlay(nextAnim);
                }
            }
        }
        // Gọi callback onAnimationEnded nếu có và storyboard đã hoàn thành
        if (this.onAnimationEnded && this.currentStoryBoard &&
            (this.currentStoryBoard.length == 0 || (this.currentStoryBoard.length == 1 && this.currentStoryBoard[0] === "#stop"))) {
            this.onAnimationEnded(endedAnimationName, nextAnimationName);
        }
    };

    /**
     * Hàm tick, cập nhật frame của animation.
     * Được gọi mỗi frame của game loop.
     */
    proto._tick = function () {
        if (!this.paused && this._lastFrameTime && this._animation) {
            var deltaTime = GameManager.gameTime - this._lastFrameTime;
            if (this.onFire) { // Tăng tốc nếu nhân vật "onFire"
                deltaTime *= 2;
            }
            // Tính số frame cần bỏ qua dựa trên deltaTime và targetFPS
            var framesToAdvance = Math.floor(deltaTime * this.speedFactor / (1000 / this.targetFPS[this._animation.name]));

            if (framesToAdvance > 0) {
                for (var i = 0; i < framesToAdvance; i++) {
                    this._advanceCount++;
                    this.advance(); // Hàm của createjs.BitmapAnimation
                }
                this._lastFrameTime = GameManager.gameTime;
            }
        } else {
            this._lastFrameTime = GameManager.gameTime; // Cập nhật thời gian lần cuối cho lần tick sau
        }
    };

    /**
     * Vẽ animation lên canvas.
     * Tùy chỉnh để sử dụng ảnh nền (baseImage) và cache frame nếu có.
     */
    proto.draw = function (canvasContext, ignoreCache, currentDepth, maxDepth) {
        // Gọi hàm draw gốc của DisplayObject, nếu nó xử lý thì thôi
        if (this.DisplayObject_draw(canvasContext, ignoreCache)) { return true; }

        this._normalizeFrame(); // Đảm bảo frame hiện tại hợp lệ
        var frame = this.spriteSheet.getFrame(this.currentFrame);

        if (frame == null) {
            // Nếu frame không tồnTAIN, thử tính toán lại frame của spritesheet
            // (có thể spritesheet chưa được load hoàn toàn)
            if (maxDepth < 10) { // Giới hạn số lần đệ quy
                this.spriteSheet._calculateFrames(); // Hàm này có vẻ là tùy chỉnh
                return this.draw(canvasContext, ignoreCache, currentDepth, maxDepth ? (++maxDepth) : 1);
            }
            return; // Không vẽ gì nếu không tìm thấy frame
        }

        var rect = frame.rect;
        if (this.baseImage) { // Nếu có ảnh nền tĩnh
            if (this.baseImage.complete && frame.image.complete) {
                // Tạo canvas đệm nếu chưa có
                if (!this.cachedFrame) {
                    this.cachedFrame = document.createElement("canvas");
                    this.cachedFrame.width = this.baseImage.naturalWidth;
                    this.cachedFrame.height = this.baseImage.naturalHeight;
                }
                // Chỉ vẽ lại canvas đệm nếu frame thay đổi
                if (this.cachedFrame.frameNr !== this.currentFrame) {
                    var cacheContext = this.cachedFrame.getContext("2d");
                    cacheContext.clearRect(0, 0, this.cachedFrame.width, this.cachedFrame.height);
                    cacheContext.drawImage(this.baseImage, 0, 0); // Vẽ ảnh nền
                    // Vẽ frame hiện tại lên trên ảnh nền
                    cacheContext.drawImage(frame.image, rect.x, rect.y, rect.width, rect.height, -frame.regX, -frame.regY, rect.width, rect.height);
                    this.cachedFrame.frameNr = this.currentFrame;
                }
                // Vẽ canvas đệm lên canvas chính
                if (this.cachedFrame && this.cachedFrame.width > 0 && this.cachedFrame.height > 0) {
                    canvasContext.drawImage(this.cachedFrame, 0, 0);
                }
            }
            return true;
        }

        // Nếu không có baseImage, vẽ frame trực tiếp
        if (frame.image.complete) {
            canvasContext.drawImage(frame.image, rect.x, rect.y, rect.width, rect.height, -frame.regX, -frame.regY, rect.width, rect.height);
        }
        return true;
    };
})();