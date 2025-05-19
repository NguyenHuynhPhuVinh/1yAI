// Định nghĩa lớp CharacterOverlay, kế thừa từ createjs.Container (một thư viện đồ họa)
// Lớp này chịu trách nhiệm hiển thị các yếu tố trực quan phủ lên trên một nhân vật trong game
// như thanh tiến trình, hiệu ứng, thông báo nổi,...
var CharacterOverlay = function (characterData) { // characterData: Dữ liệu của nhân vật mà overlay này đại diện
    this.initialize(); // Gọi hàm khởi tạo của lớp cha (createjs.Container)
    this.character = characterData; // Lưu trữ tham chiếu đến đối tượng nhân vật
    this.speedFactor = 0.8 + 0.2 * this.character.speedFactor; // Tính toán speedFactor dựa trên chỉ số của nhân vật
    this.initAnimations(); // Khởi tạo các animation cho nhân vật

    // Thanh tiến trình chung (ví dụ: cho nghiên cứu, đào tạo)
    this.progressBar = new ProgressBarVisual();
    this.progressBar.alpha = 0; // Ban đầu ẩn đi
    this.progressBar.y = VisualsManager.toScreenCoordinates(-30); // Đặt vị trí theo trục Y
    this.addChild(this.progressBar); // Thêm vào container của overlay

    // Thanh hiển thị hiệu suất làm việc của nhân vật
    this.efficiencyBar = new ProgressBarVisual();
    this.efficiencyBar.alpha = 1 > characterData.efficiency ? 1 : 0; // Hiển thị nếu hiệu suất < 1
    this.efficiencyBar.progress = 0.3; // Giá trị tiến trình ban đầu (có thể là để trực quan hóa)
    this.efficiencyBar.width = 12;
    this.efficiencyBar.height = 70;
    this.efficiencyBar.isHorizontal = false; // Thanh dọc
    this.efficiencyBar.x -= VisualsManager.toScreenCoordinates(30); // Đặt vị trí theo trục X
    this.addChild(this.efficiencyBar);

    // Hình ảnh hiển thị trạng thái "boost" của nhân vật (dạng tròn)
    this.boostVisual = new CircularProgressVisual();
    this.boostVisual.radius = 20;
    this.boostVisual.x = VisualsManager.toScreenCoordinates(166, CanvasManager.globalScale);
    this.boostVisual.y = VisualsManager.toScreenCoordinates(5, CanvasManager.globalScale);
    this.boostVisual.alpha = 0.8;
    this.addChild(this.boostVisual);

    // Nếu có dữ liệu hình ảnh được lưu trước đó, tải lại trạng thái
    if (characterData.visualData) {
        this.loadState(characterData.visualData);
    }
    // Nếu nhân vật đang trong trạng thái "onFire" (boost mạnh), kích hoạt hiệu ứng tương ứng
    if (characterData.onFire) {
        this.setOnFire(true);
    }
};

(function () {
    // Kế thừa prototype từ createjs.Container
    CharacterOverlay.prototype = new createjs.Container();
    var characterOverlayPrototype = CharacterOverlay.prototype; // Gán prototype vào một biến ngắn gọn hơn

    // Hàm cho phép nhân vật "nói" một điều gì đó, hiển thị dưới dạng bong bóng chat
    characterOverlayPrototype.saySomething = function (message, duration, yOffset, textColor) {
        if (yOffset === void 0) { yOffset = 0; } // Mặc định yOffset là 0
        if (!textColor) { textColor = "black"; } // Mặc định màu chữ là đen
        if (!duration) { duration = 800; } // Mặc định thời gian hiển thị là 800ms

        var textContainer = new createjs.Container();
        textContainer.x = 25;
        textContainer.y = -25 + yOffset;

        var textObject = new createjs.Text(message, "18pt Arial", textColor);
        textObject.textBaseline = "top";

        var textWidth = textObject.getMeasuredWidth();
        var textHeight = textObject.getMeasuredLineHeight();

        var backgroundShape = new createjs.Shape();
        var graphics = backgroundShape.graphics;
        graphics.beginFill(createjs.Graphics.getRGB(255, 255, 255, 0.8)); // Nền trắng mờ
        graphics.beginStroke("black"); // Viền đen
        graphics.setStrokeStyle(1);
        graphics.drawRoundRect(-4, -4, textWidth + 8, textHeight + 8, 5); // Vẽ hình chữ nhật bo góc
        graphics.closePath();

        textContainer.addChild(backgroundShape);
        textContainer.addChild(textObject);
        textContainer.alpha = 0; // Ban đầu ẩn đi
        this.addChild(textContainer); // Thêm vào overlay

        var self = this;
        var fadeInOutDuration = duration / 6; // Thời gian cho hiệu ứng xuất hiện và biến mất

        // Animation di chuyển và thay đổi độ mờ của bong bóng chat
        createjs.Tween.get(textContainer).to({
            y: -60 + yOffset // Di chuyển lên trên
        }, duration);
        createjs.Tween.get(textContainer).to({
            alpha: 1 // Hiện ra
        }, fadeInOutDuration).wait(duration - 2 * fadeInOutDuration).to({
            alpha: 0, // Mờ dần
            x: 35 // Di chuyển sang phải một chút khi biến mất
        }, fadeInOutDuration).call(function () {
            self.removeChild(textContainer); // Xóa bong bóng chat sau khi animation kết thúc
        });
    };

    // Lấy tọa độ gốc để tạo hiệu ứng "điểm" (ví dụ: điểm design, tech)
    characterOverlayPrototype._getSpawnPointOrigin = function () {
        return this.character.getOrientation() === CharacterOrientation.NW ? {
            x: 25,
            y: -10
        } : {
            x: 130,
            y: 90
        };
    };

    // Tạo hiệu ứng xóa điểm bug
    characterOverlayPrototype.spawnBugRemovePoint = function (pointId, pointType, duration, delay) {
        if (!delay) { delay = 0; }
        var randomizer = new MersenneTwister(pointId); // Sử dụng ID để tạo số ngẫu nhiên có thể lặp lại

        var bugPointShape = new createjs.Shape();
        bugPointShape.alpha = 0;
        var spawnOrigin = this._getSpawnPointOrigin();
        bugPointShape.x = spawnOrigin.x + 10 * randomizer.random() * randomizer.randomSign(); // Tọa độ X ngẫu nhiên
        bugPointShape.y = spawnOrigin.y - 40 + -20 * randomizer.random(); // Tọa độ Y ngẫu nhiên
        bugPointShape.regX = 5; // Tâm xoay X
        bugPointShape.regY = 5; // Tâm xoay Y
        bugPointShape.scaleX = 0; // Ban đầu co lại
        bugPointShape.scaleY = 0;

        var graphics = bugPointShape.graphics;
        graphics.beginFill(BUGS_COLOR); // Màu của điểm bug
        graphics.beginStroke("black");
        graphics.setStrokeStyle(0.5);
        graphics.drawCircle(5, 5, 10); // Vẽ hình tròn
        graphics.closePath();
        this.addChild(bugPointShape);

        var self = this;
        var fadeInOutDuration = duration / 8;
        var moveDuration = duration / 2;
        var currentGameId = GameManager.gameId; // Lưu gameId hiện tại để kiểm tra trong callback của Tween

        GameManager.increaseSpawnedPoints(); // Tăng số lượng điểm đang hiển thị

        var tweens = [];
        var characterContext = this; // 'this' ở đây là CharacterOverlay instance

        // Animation di chuyển điểm bug lên trên và biến mất, đồng thời giảm số bug
        tweens.push(createjs.Tween.get(bugPointShape).wait(delay).to({
            y: spawnOrigin.y - 80 - 60 * randomizer.random() // Di chuyển lên cao hơn
        }, moveDuration, createjs.Ease.backIn).call(function () {
            if (currentGameId == GameManager.gameId) { // Chỉ thực hiện nếu vẫn đang ở game hiện tại
                GameManager.decreaseBugs(1); // Giảm số bug
                VisualsManager.updatePoints(); // Cập nhật hiển thị điểm
                if (GameManager.company.flags.currentZone == 1) { // Phát âm thanh nếu ở zone 1
                    Sound.playSoundOnce("bugDecrease", 0.2);
                }
                characterContext.character.removeSpawnedPoint(pointId); // Xóa điểm khỏi danh sách của nhân vật
                GameManager.decreaseSpawnedPoints(); // Giảm số lượng điểm đang hiển thị
                VisualsManager.pulsePointsDisplay("br"); // Tạo hiệu ứng "pulse" ở nơi hiển thị điểm bug
            }
        }));

        // Animation thay đổi độ mờ và kích thước của điểm bug
        tweens.push(createjs.Tween.get(bugPointShape).wait(delay).to({
            alpha: 1 // Hiện ra
        }, fadeInOutDuration).wait(moveDuration - 2 * fadeInOutDuration).to({
            alpha: 0 // Mờ dần
        }, fadeInOutDuration).call(function () {
            self.removeChild(bugPointShape); // Xóa điểm khỏi overlay
        }));
        tweens.push(createjs.Tween.get(bugPointShape).wait(delay).to({
            scaleX: 1, // Phóng to ra
            scaleY: 1
        }, 2 * fadeInOutDuration, createjs.Ease.backOut));

        return tweens; // Trả về mảng các tween để có thể quản lý
    };

    // Tạo hiệu ứng sinh điểm (design, tech, research, bug)
    characterOverlayPrototype.spawnPoint = function (pointId, pointType, duration, delay) {
        if (!delay) { delay = 0; }

        // Quản lý các điểm đang hiển thị để nhóm các điểm cùng loại lại (nếu GameFlags.GROUP_POINTS bật)
        if (!this.spawnPointVisuals || this.spawnPointVisuals.gameId != GameManager.gameId) {
            this.spawnPointVisuals = { gameId: GameManager.gameId };
        } else if (GameFlags.GROUP_POINTS && pointType in this.spawnPointVisuals) {
            var existingPointVisual = this.spawnPointVisuals[pointType];
            if (existingPointVisual) {
                existingPointVisual.weight++; // Tăng trọng số (số lượng điểm được nhóm)
                var currentScaleX = existingPointVisual.targetScaleX;
                var currentScaleY = existingPointVisual.targetScaleY;
                existingPointVisual.targetScaleX = Math.min(2, currentScaleX + 0.2); // Phóng to thêm một chút
                existingPointVisual.targetScaleY = Math.min(2, currentScaleY + 0.2);

                var scaleTween = createjs.Tween.get(existingPointVisual);
                scaleTween.isScaleTween = true; // Đánh dấu đây là tween cho scale
                scaleTween.set({ scaleX: currentScaleX, scaleY: currentScaleY })
                    .to({ scaleX: existingPointVisual.targetScaleX, scaleY: existingPointVisual.targetScaleY }, 100);

                existingPointVisual.ids.push(pointId); // Thêm ID của điểm này vào nhóm

                // Hiển thị số lượng điểm được nhóm
                if (!existingPointVisual.textShape) {
                    existingPointVisual.textShape = new createjs.Text(existingPointVisual.weight, "10pt {0}".format(UI.IS_SEGOE_UI_INSTALLED ? "Segoe UI" : "Open Sans"), "black");
                    existingPointVisual.textShape.textAlign = "center";
                    existingPointVisual.textShape.textBaseline = "middle";
                    existingPointVisual.textShape.x = 5;
                    existingPointVisual.textShape.y = 4;
                    existingPointVisual.addChild(existingPointVisual.textShape);
                }
                existingPointVisual.textShape.text = existingPointVisual.weight;
                GameManager.increaseSpawnedPoints();
                return [scaleTween];
            }
        }

        var randomizer = new MersenneTwister(pointId);
        var pointContainer = new createjs.Container();
        pointContainer.alpha = 0;
        var spawnOrigin = this._getSpawnPointOrigin();
        // Cộng thêm tọa độ của CharacterOverlay để điểm xuất hiện đúng vị trí tương đối với nhân vật trên màn hình
        spawnOrigin.x += this.x;
        spawnOrigin.y += this.y;

        pointContainer.x = spawnOrigin.x + 10 * randomizer.random() * randomizer.randomSign();
        pointContainer.y = spawnOrigin.y + -20 * randomizer.random();
        pointContainer.regX = 5;
        pointContainer.regY = 5;
        pointContainer.scaleX = 0;
        pointContainer.scaleY = 0;
        pointContainer.targetScaleX = 1;
        pointContainer.targetScaleY = 1;

        // Xác định màu của điểm dựa trên loại điểm
        var pointColor = "t" === pointType || "e" === pointType ? TECHNOLOGY_POINTS_COLOR :
            "d" === pointType ? DESIGN_POINTS_COLOR :
                "b" === pointType ? BUGS_COLOR :
                    RESEARCH_POINTS_COLOR;

        if (GameManager.company.flags.currentZone == 1) { // Phát âm thanh nếu ở zone 1
            Sound.playSpawnSound(pointType);
        }

        var pointShape = new createjs.Shape();
        pointContainer.addChild(pointShape);
        var graphics = pointShape.graphics;
        graphics.beginFill(pointColor);
        graphics.beginStroke("black");
        graphics.setStrokeStyle(0.5);
        graphics.drawCircle(5, 5, 10);
        graphics.closePath();

        CanvasManager.characterStage.addChild(pointContainer); // Thêm điểm vào stage nhân vật (để nó nổi trên nhân vật)
        pointContainer.weight = 1;
        pointContainer.ids = [pointId];
        this.spawnPointVisuals[pointType] = pointContainer; // Lưu lại visual của điểm này

        var characterStageContext = CanvasManager.characterStage;
        var targetPointDisplayLocation = VisualsManager.getGlobalLocationOfPointsDisplay(pointType); // Lấy tọa độ của nơi hiển thị tổng điểm
        var fadeInOutDuration = duration / 8;
        var firstMoveDuration = duration / 2;
        var currentGameId = GameManager.gameId;

        GameManager.increaseSpawnedPoints();
        var tweens = [];
        var self = this; // 'this' là CharacterOverlay instance

        // Animation di chuyển điểm lên trên, sau đó bay về phía nơi hiển thị tổng điểm
        tweens.push(createjs.Tween.get(pointContainer).wait(delay).to({
            y: spawnOrigin.y - 80 - 20 * randomizer.random() // Di chuyển lên
        }, firstMoveDuration, createjs.Ease.backOut).call(function () {
            delete self.spawnPointVisuals[pointType]; // Xóa khỏi danh sách visual đang quản lý
        }).to({
            x: targetPointDisplayLocation.x, // Di chuyển đến nơi hiển thị tổng
            y: targetPointDisplayLocation.y
        }, duration - firstMoveDuration, createjs.Ease.quadIn).call(function () {
            if (currentGameId == GameManager.gameId) {
                var pointsToAdd = pointContainer.weight;
                VisualsManager.pulsePointsDisplay(pointType); // Tạo hiệu ứng pulse
                // Cộng điểm vào tổng
                if (pointType === "t") {
                    if (GameManager.company.currentGame) {
                        GameManager.company.currentGame.technologyPoints += pointsToAdd;
                    } else if (GameManager.currentContract) {
                        GameManager.currentContract.visualTRemaining -= pointsToAdd;
                    }
                } else if (pointType === "d") {
                    if (GameManager.company.currentGame) {
                        GameManager.company.currentGame.designPoints += pointsToAdd;
                    } else if (GameManager.currentContract) {
                        GameManager.currentContract.visualDRemaining -= pointsToAdd;
                    }
                } else if (pointType === "r") {
                    GameManager.company.researchPoints += pointsToAdd;
                } else if (pointType === "e") {
                    GameManager.increaseDisplayEnginePoints(self.character, pointsToAdd);
                } else if (pointType === "b" && GameManager.company.currentGame) {
                    GameManager.company.currentGame.bugs += pointsToAdd;
                }

                if (GameManager.company.flags.currentZone == 1) {
                    Sound.playSpawnSound(pointType, true); // Phát âm thanh kết thúc
                }
                VisualsManager.updatePoints(); // Cập nhật hiển thị tổng điểm
                for (var i = 0; i < pointContainer.ids.length; i++) {
                    self.character.removeSpawnedPoint(pointContainer.ids[i]); // Xóa điểm khỏi danh sách của nhân vật
                    GameManager.decreaseSpawnedPoints();
                }
                if (pointType !== "r" && GameManager.currentFeature && GameManager.currentFeature.id !== "preparation") {
                    Tutorial.gamePoints(); // Hiển thị tutorial nếu cần
                }
            }
        }));

        // Animation thay đổi độ mờ và kích thước
        tweens.push(createjs.Tween.get(pointContainer).wait(delay).to({
            alpha: 1
        }, fadeInOutDuration).wait(duration - 2 * fadeInOutDuration).to({
            alpha: 0
        }, fadeInOutDuration).call(function () {
            characterStageContext.removeChild(pointContainer); // Xóa khỏi stage
        }));
        tweens.push(createjs.Tween.get(pointContainer).wait(delay).to({
            scaleX: 1,
            scaleY: 1
        }, 2 * fadeInOutDuration, createjs.Ease.backOut));

        return tweens;
    };

    // Bắt đầu hiển thị tiến trình nghiên cứu/đào tạo
    characterOverlayPrototype.startResearching = function () {
        if (this.progressBar.alpha != 1) {
            createjs.Tween.get(this.progressBar).to({ alpha: 1 }, 400);
            if (this.character.currentResearch.isTraining) {
                var currentResearchItem = this.character.currentResearch;
                var trainingItem = Training.getAllTrainings().first(function (item) {
                    return item.id === currentResearchItem.id;
                });
                currentResearchItem.isSkillTraining = trainingItem && trainingItem.isSkillTraining;
                if (currentResearchItem.isSkillTraining) {
                    this.animateTrainingProgress(); // Bắt đầu animation cho các điểm kỹ năng tăng lên
                    this.trainingOverlay.fadeIn(1200); // Hiển thị overlay đào tạo
                }
            }
        }
    };

    // Kết thúc hiển thị tiến trình nghiên cứu/đào tạo
    characterOverlayPrototype.finishResearching = function () {
        createjs.Tween.get(this.progressBar).to({ alpha: 0 }, 400);
        this.trainingOverlay.fadeOut(1200);
    };

    // Được gọi mỗi tick của game loop để cập nhật trạng thái của overlay
    characterOverlayPrototype.onTick = function () {
        // Cập nhật thanh tiến trình nếu nhân vật đang nghiên cứu/đào tạo
        if (this.character.state === CharacterState.Researching) {
            this.progressBar.progress = this.character.currentResearch.progress;
            this.progressBar.color = this.character.currentResearch.progressColor ?
                this.character.currentResearch.progressColor :
                (this.character.currentResearch.type == "research" ? "darkblue" : "lightgreen");
        }

        // Cập nhật thanh hiệu suất
        var currentEfficiency = this.character.efficiency;
        if (currentEfficiency != 1) {
            this.efficiencyBar.progress = currentEfficiency;
            this.efficiencyBar.color = createjs.Graphics.getHSL(80 * currentEfficiency, 100, 50); // Màu thay đổi từ đỏ sang xanh lá
            this.efficiencyBar.alpha = (this.efficiencyBar.alpha + 0.01).clamp(0, 0.8); // Tăng dần độ mờ
        } else if (this.efficiencyBar.alpha != 0) {
            this.efficiencyBar.alpha = (this.efficiencyBar.alpha - 0.01).clamp(0, 1); // Giảm dần độ mờ nếu hiệu suất đã tối đa
        }
    };

    // Khởi tạo các đối tượng animation (SpriteSheetX)
    characterOverlayPrototype.initAnimations = function () {
        var globalScale = CanvasManager.globalScale;
        // Tạo animation cho màn hình máy tính (nếu nhân vật quay mặt về hướng NW)
        if (this.character.getOrientation() === CharacterOrientation.NW) {
            var screenAnim = BitmapAnimationFactory.createAnimation("screen", this.speedFactor, this.character.getOrientation(), this.character.flags.body, this.character.flags.head);
            if (screenAnim) {
                this.addChild(screenAnim);
            }
            this.screenAnimation = screenAnim;
        }

        // Tạo các animation khác nhau: typing, thinking, sitBack, drawNotepad
        var typingAnim = BitmapAnimationFactory.createAnimation("typing", this.speedFactor, this.character.getOrientation(), this.character.flags.body, this.character.flags.head);
        typingAnim.overlay = this; // Tham chiếu ngược lại CharacterOverlay
        this.addChild(typingAnim);
        this.typingAnimation = typingAnim;

        var thinkingAnim = BitmapAnimationFactory.createAnimation("thinking", this.speedFactor, this.character.getOrientation(), this.character.flags.body, this.character.flags.head);
        thinkingAnim.overlay = this;
        this.addChild(thinkingAnim);
        this.thinkingAnimation = thinkingAnim;

        var sitBackAnim = BitmapAnimationFactory.createAnimation("sitBack", this.speedFactor, this.character.getOrientation(), this.character.flags.body, this.character.flags.head);
        sitBackAnim.overlay = this;
        this.addChild(sitBackAnim);
        this.sitBackAnimation = sitBackAnim;

        var drawNotepadAnim = BitmapAnimationFactory.createAnimation("drawNotepad", this.speedFactor, this.character.getOrientation(), this.character.flags.body, this.character.flags.head);
        drawNotepadAnim.overlay = this;
        this.addChild(drawNotepadAnim);
        this.drawNotepadAnimation = drawNotepadAnim;

        // Tạo animation cho notepad hoặc tách trà tùy theo hướng nhân vật
        var accessoryAnim = "";
        accessoryAnim = this.character.getOrientation() == CharacterOrientation.NW ?
            new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets.notepadImage), this.speedFactor) :
            BitmapAnimationFactory.createTeaCupAnimation(this.speedFactor);
        accessoryAnim.overlay = this;
        accessoryAnim.scaleX = globalScale;
        accessoryAnim.scaleY = globalScale;
        this.addChild(accessoryAnim);
        this.notepadImage = accessoryAnim; // Dù là notepad hay tách trà, đều gán vào notepadImage

        var self = this;
        // Gán callback khi animation kết thúc
        this.typingAnimation.onAnimationEnded = function (animation, frame) { self.endedAnimation.call(self, animation, frame, "typing"); };
        this.thinkingAnimation.onAnimationEnded = function (animation, frame) { self.endedAnimation.call(self, animation, frame, "thinking"); };
        this.sitBackAnimation.onAnimationEnded = function (animation, frame) { self.endedAnimation.call(self, animation, frame, "sitBack"); };
        this.drawNotepadAnimation.onAnimationEnded = function (animation, frame) { self.endedAnimation.call(self, animation, frame, "drawNotepad"); };

        // Nếu là level 1, tạo animation chơi game Pong
        if (GameManager.company.currentLevel === 1) {
            var pongAnim = new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets.pong));
            pongAnim.x = VisualsManager.toScreenCoordinates(1321, globalScale) - VisualsManager.toScreenCoordinates(1039, globalScale);
            pongAnim.y = VisualsManager.toScreenCoordinates(261, globalScale) - VisualsManager.toScreenCoordinates(539, globalScale);
            pongAnim.scaleX = globalScale;
            pongAnim.scaleY = globalScale;
            this.addChild(pongAnim);
            this.pongAnimation = pongAnim;
        }

        // Đặt trạng thái ban đầu cho các animation
        this.notepadImage.gotoAndStop("all");
        this.sitBackAnimation.gotoAndStop("loop");
        if (this.screenAnimation) {
            this.screenAnimation.gotoAndStop("loop");
        }
        if (this.pongAnimation) {
            this.pongAnimation.gotoAndStop("all");
        }
        this.typingAnimation.setAlpha(0);
        this.thinkingAnimation.setAlpha(0);
        this.sitBackAnimation.setAlpha(1); // Mặc định là ngồi nghỉ
        this.drawNotepadAnimation.setAlpha(0);

        this.refreshName(); // Hiển thị tên nhân vật
    };

    // Cập nhật/làm mới hiển thị tên nhân vật
    characterOverlayPrototype.refreshName = function () {
        var nameVisual = new CharacterNameVisual(this.character);
        nameVisual.alpha = 0.7;
        if (this.characterNameVisual) { // Nếu đã có tên cũ, xóa đi
            this.removeChild(this.characterNameVisual);
        }
        this.characterNameVisual = nameVisual;
        this.addChildAt(this.characterNameVisual, 0); // Thêm tên vào layer dưới cùng của overlay
    };

    // Xử lý khi một animation kết thúc một vòng lặp hoặc một sequence
    characterOverlayPrototype.endedAnimation = function (animation, frame, animationName) {
        if (animation.currentAnimation === "loop") {
            this.character.loopEnded(); // Gọi hàm xử lý khi vòng lặp kết thúc của đối tượng Character
        } else if (animation.currentAnimation === null && animation.paused || animation.currentAnimation === "end") {
            this.character.animationEnded(animationName); // Gọi hàm xử lý khi animation kết thúc của Character
        } else if (animation.paused === true) {
            this.character.loopEnded();
        } else if (animationName === "sitBack" && frame === "start" && animation.currentStoryBoard != null && animation.currentStoryBoard.length === 0) {
            this.sitBackAnimation.playStoryBoard(["loop"]); // Nếu là animation ngồi nghỉ và không có storyboard, quay lại loop
        }
    };

    // Ẩn tất cả các animation, dừng chúng và hiển thị notepad/tách trà
    characterOverlayPrototype.removeAllAnimation = function () {
        this.typingAnimation.setAlpha(0);
        this.thinkingAnimation.setAlpha(0);
        this.sitBackAnimation.setAlpha(0);
        this.drawNotepadAnimation.setAlpha(0);
        this.notepadImage.setAlpha(1); // Hiển thị notepad/tách trà
        if (this.screenAnimation) {
            this.screenAnimation.setPaused(true);
        }
        this.typingAnimation.stop();
        this.thinkingAnimation.stop();
        this.sitBackAnimation.stop();
        this.drawNotepadAnimation.stop();
    };

    // Các hàm để bắt đầu, tiếp tục, kết thúc từng loại animation cụ thể
    characterOverlayPrototype.startThinking = function () {
        this.removeAllAnimation();
        this.thinkingAnimation.setAlpha(1);
        this.thinkingAnimation.playStoryBoard(["start", "loop"]);
    };
    characterOverlayPrototype.continueThinking = function () {
        this.thinkingAnimation.setPaused(false);
    };
    characterOverlayPrototype.endThinking = function () {
        this.thinkingAnimation.playStoryBoard(["end", "#stop"]);
    };

    characterOverlayPrototype.startDrawNotepad = function () {
        this.removeAllAnimation();
        this.notepadImage.setAlpha(0); // Ẩn notepad/tách trà đi
        this.drawNotepadAnimation.setAlpha(1);
        this.drawNotepadAnimation.playStoryBoard(["start", "loop"]);
    };
    characterOverlayPrototype.continueDrawNotepad = function () {
        this.drawNotepadAnimation.setPaused(false);
    };
    characterOverlayPrototype.endDrawNotepad = function () {
        this.drawNotepadAnimation.playStoryBoard(["end", "#stop"]);
    };

    characterOverlayPrototype.startSitBack = function () {
        this.removeAllAnimation();
        this.sitBackAnimation.setAlpha(1);
        this.sitBackAnimation.playStoryBoard(["start", "loop"]);
    };
    characterOverlayPrototype.startSitBackLoop = function () {
        this.removeAllAnimation();
        this.sitBackAnimation.setAlpha(1);
        this.sitBackAnimation.playStoryBoard(["loop"]);
    };
    characterOverlayPrototype.continueSitBack = function () {
        this.sitBackAnimation.setPaused(false);
    };
    characterOverlayPrototype.endSitBack = function () {
        this.sitBackAnimation.playStoryBoard(["end", "#stop"]);
    };

    characterOverlayPrototype.startTyping = function () {
        this.removeAllAnimation();
        if (this.screenAnimation) {
            this.screenAnimation.setPaused(false); // Kích hoạt animation màn hình
        }
        this.typingAnimation.setAlpha(1);
        this.typingAnimation.playStoryBoard(["start", "loop"]);
    };
    characterOverlayPrototype.continueTyping = function () {
        if (this.screenAnimation) {
            this.screenAnimation.setPaused(false);
        }
        this.typingAnimation.setPaused(false);
    };
    characterOverlayPrototype.endTyping = function () {
        if (this.screenAnimation) {
            this.screenAnimation.stop();
        }
        this.typingAnimation.playStoryBoard(["end", "#stop"]);
    };

    // Phát animation chơi game Pong (easter egg)
    characterOverlayPrototype.playPong = function () {
        if (this.pongAnimation && this.pongAnimation.paused) {
            this.pongAnimation.playStoryBoard(["all", "#stop"]);
            var currentGameId = GameManager.gameId;
            var playPingSound = function () {
                if (currentGameId == GameManager.gameId && GameManager.company.flags.currentZone == 1) {
                    Sound.playSoundOnce("ping", 0.5);
                }
            };
            var playPongSound = function () {
                if (currentGameId == GameManager.gameId && GameManager.company.flags.currentZone == 1) {
                    Sound.playSoundOnce("pong", 0.5);
                }
            };
            // Lên lịch các âm thanh ping/pong tương ứng với animation
            createjs.Tween.get(this).wait(500).call(playPingSound)
                .wait(720).call(playPongSound)
                .wait(650).call(playPingSound)
                .wait(1100).call(playPongSound)
                .wait(300).call(playPingSound)
                .wait(850).call(playPingSound)
                .wait(500).call(playPongSound)
                .wait(650).call(playPingSound)
                .wait(1100).call(playPongSound)
                .wait(200).call(playPingSound)
                .wait(2000).call(function () {
                    Achievements.activate(Achievements.lvl1EasterEgg); // Kích hoạt achievement
                    GameManager.checkAchievements();
                });
            ghg4.ghg5("pong played"); // Gửi sự kiện analytics
        }
    };

    // Lưu trạng thái hiện tại của các animation và thông tin liên quan
    characterOverlayPrototype.saveState = function () {
        var state = {};
        state.typingAnimation = this.typingAnimation.saveState();
        if (this.screenAnimation) {
            state.screenAnimation = this.screenAnimation.saveState();
        }
        state.thinkingAnimation = this.thinkingAnimation.saveState();
        state.sitBackAnimation = this.sitBackAnimation.saveState();
        state.drawNotepadAnimation = this.drawNotepadAnimation.saveState();
        state.notepadImage = this.notepadImage.saveState();
        if (this.pongAnimation) {
            state.pong = this.pongAnimation.saveState();
        }
        if (this.character.state === CharacterState.Researching) { // Nếu đang đào tạo, lưu trạng thái đào tạo
            state.currentTraining = this.currentTrainingState;
        }
        return state;
    };

    // Tải lại trạng thái từ dữ liệu đã lưu
    characterOverlayPrototype.loadState = function (state) {
        if (state) {
            this.typingAnimation.loadState(state.typingAnimation);
            if (this.screenAnimation) {
                this.screenAnimation.loadState(state.screenAnimation);
            }
            this.thinkingAnimation.loadState(state.thinkingAnimation);
            this.sitBackAnimation.loadState(state.sitBackAnimation);
            this.drawNotepadAnimation.loadState(state.drawNotepadAnimation);
            this.notepadImage.loadState(state.notepadImage);
            if (this.pongAnimation) {
                this.pongAnimation.loadState(state.pong);
            }
            if (state.currentTraining) { // Nếu có trạng thái đào tạo, tải lại
                this.currentTrainingState = state.currentTraining;
            }
        }
    };

    // Tiếp tục hiển thị animation đào tạo (nếu có)
    characterOverlayPrototype.resumeTraining = function () {
        if (this.currentTrainingState === void 0) { // Nếu chưa có trạng thái đào tạo
            if (this.character.currentResearch && this.character.currentResearch.isSkillTraining) {
                this.trainingOverlay.show(); // Chỉ hiện overlay
            }
        } else if (this.character.currentResearch && this.character.currentResearch.isSkillTraining) { // Nếu có trạng thái và đang đào tạo kỹ năng
            var trainingState = this.currentTrainingState;
            this.animateTrainingProgress(trainingState.updates); // Chạy lại animation tăng điểm
            var elapsedTime = GameManager.gameTime - trainingState.start;
            // Đặt lại vị trí của các tween đào tạo dựa trên thời gian đã trôi qua
            this.trainingTweens.forEach(function (tween) {
                tween.setPosition(elapsedTime);
            });
            this.trainingOverlay.show();
        }
    };

    // Kích hoạt/tắt hiệu ứng "onFire" (boost mạnh)
    characterOverlayPrototype.setOnFire = function (isOnFire) {
        if (isOnFire) {
            this.typingAnimation.onFire = true;
            if (this.screenAnimation) this.screenAnimation.onFire = true;
            this.thinkingAnimation.onFire = true;
            this.sitBackAnimation.onFire = true;
            this.drawNotepadAnimation.onFire = true;
            this.notepadImage.onFire = true;
            if (this.pongAnimation) this.pongAnimation.onFire = true;
        } else {
            this.typingAnimation.onFire = undefined;
            if (this.screenAnimation) this.screenAnimation.onFire = undefined;
            this.thinkingAnimation.onFire = undefined;
            this.sitBackAnimation.onFire = undefined;
            this.drawNotepadAnimation.onFire = undefined;
            this.notepadImage.onFire = undefined;
            if (this.pongAnimation) this.pongAnimation.onFire = undefined;
        }
    };

    // Thêm listener để cập nhật các text hiển thị số trong animation đào tạo
    GameManager.addTickListener(function (gameTimeDelta) {
        VisualsManager.characterOverlays.forEach(function (overlay) {
            if (overlay.character.state == CharacterState.Researching && overlay.trainingOverlay && overlay.trainingTweens) {
                overlay.trainingTweens.forEach(function (tween) {
                    var target = tween._target; // Đối tượng jQuery mà tween đang tác động
                    if (target.gamedev_text_int !== void 0) { // Nếu có thuộc tính này (dùng để lưu giá trị số)
                        target.text(Math.floor(target.gamedev_text_int)); // Cập nhật text
                    }
                    if (target.gamedev_yTilt !== void 0) { // Nếu có thuộc tính này (dùng cho hiệu ứng xoay)
                        target.css("transform", "rotateY({0}deg)".format(target.gamedev_yTilt)); // Cập nhật xoay
                    }
                });
            }
        });
    }, true); // true: listener này liên quan đến thời gian game

    // Tạo animation cho việc tăng điểm kỹ năng khi đào tạo
    characterOverlayPrototype.animateTrainingProgress = function (skillUpdates) { // skillUpdates: mảng các đối tượng {t: 'type', p: points, o: originalPoints}
        if (this.trainingOverlay) {
            var trainingOverlayElement = this.trainingOverlay;
            var currentTweens = [];
            // Mảng thông tin các kỹ năng và element hiển thị tương ứng
            var skillInfo = [
                { p: this.character.designFactor, t: "d" }, // p: giá trị hiện tại của kỹ năng
                { p: this.character.technologyFactor, t: "t" },
                { p: this.character.speedFactor, t: "s" },
                { p: this.character.researchFactor, t: "r" }
            ];

            // Cập nhật giá trị ban đầu cho các cột kỹ năng nếu chưa có
            for (var i = 0; i < skillInfo.length; i++) {
                var skill = skillInfo[i];
                var skillValueElement = trainingOverlayElement.find(".training{0}.trainingColumnRight".format(skill.t.toUpperCase()));
                if (skillValueElement.gamedev_text_int === void 0) { // Nếu chưa có giá trị số được lưu
                    var initialSkillPoints = Math.floor(500 * skill.p);
                    skillValueElement.text(initialSkillPoints);
                    if (skillUpdates) { // Nếu có thông tin cập nhật, lưu lại giá trị gốc
                        var updateForThisSkill = skillUpdates.first(function (update) { return update.t === skill.t; });
                        if (updateForThisSkill) {
                            updateForThisSkill.o = initialSkillPoints; // o: originalPoints
                        }
                    }
                }
            }

            if (skillUpdates) { // Nếu có thông tin cập nhật kỹ năng
                if (skillUpdates.length > 0) {
                    if (GameManager.company.flags.currentZone == 1) {
                        Sound.playSoundOnce("trainingProgress", 0.1); // Phát âm thanh
                    }
                    var self = this;
                    // Tạo animation cho từng kỹ năng được cập nhật
                    for (var j = 0; j < skillUpdates.length; j++) {
                        var currentGameId = GameManager.gameId; // Lưu gameId để kiểm tra trong callback
                        (function (update) { // Sử dụng closure để bắt giá trị `update`
                            var gainElement = trainingOverlayElement.find(".trainingGain.training{0}".format(update.t.toUpperCase()));
                            gainElement.text("+" + update.p); // Hiển thị số điểm được cộng
                            if (gainElement.gamedev_yTilt === void 0) { gainElement.gamedev_yTilt = 90; } // Nếu chưa có, đặt góc xoay ban đầu

                            // Animation xoay để hiển thị số điểm cộng
                            currentTweens.push(createjs.Tween.get(gainElement).to({ gamedev_yTilt: 0 }, 400, createjs.Ease.bounceOut)
                                .wait(800).to({ gamedev_yTilt: 90 }, 400));

                            var valueElement = trainingOverlayElement.find(".training{0}.trainingColumnRight".format(update.t.toUpperCase()));
                            if (valueElement.gamedev_text_int === void 0) { valueElement.gamedev_text_int = update.o; } // Nếu chưa có, đặt giá trị gốc

                            // Animation tăng dần giá trị kỹ năng
                            var valueTween = createjs.Tween.get(valueElement).wait(200).to({ gamedev_text_int: update.o + update.p }, 500);
                            valueTween.call(function () {
                                if (currentGameId == GameManager.gameId) { // Chỉ thực hiện nếu vẫn ở game hiện tại
                                    self.character.applyTrainingUpdate(update); // Áp dụng thay đổi kỹ năng thực sự
                                    if (self.trainingTweens.indexOf(valueTween) != -1) {
                                        self.trainingTweens.remove(valueTween); // Xóa tween sau khi hoàn thành
                                    }
                                }
                            });
                            currentTweens.push(valueTween);
                        })(skillUpdates[j]);
                    }
                }
                // Lưu lại trạng thái của animation đào tạo hiện tại
                this.currentTrainingState = { updates: skillUpdates, start: GameManager.gameTime };
            }
            this.trainingTweens = currentTweens; // Lưu lại các tween đang chạy
        }
    };
})();