// --- START OF FILE ProjectWorkerVisual.js ---

// Định nghĩa constructor cho ProjectWorkerVisual
// Đối tượng này đại diện cho hình ảnh và hành vi của một công nhân trong các dự án R&D hoặc phần cứng.
var ProjectWorkerVisual = function (initialVisualData) {
    // Trạng thái của công nhân, bao gồm tiến độ công việc hiện tại (progressF - fractional progress)
    this.state = {
        progressF: 0
    };
    // Hiệu suất làm việc hiện tại của công nhân (0 đến 1)
    this.efficiency = 0;
    // Gọi constructor của lớp cha (createjs.Container)
    createjs.Container.apply(this, arguments);
    // Khởi tạo các thành phần trực quan
    this.init();
    // Dữ liệu trực quan ban đầu được truyền vào (thường là khi tải game)
    this.visualData = initialVisualData;
};

(function () {
    // Tạo alias cho ProjectWorkerVisual để dễ sử dụng
    var workerVisual = ProjectWorkerVisual;
    // Thiết lập kế thừa từ createjs.Container
    workerVisual.prototype = new createjs.Container;
    // Gán lại prototype cho workerVisualPrototype để thêm các phương thức
    var workerVisualPrototype = workerVisual.prototype; // Đổi tên 'a' thành 'workerVisualPrototype'

    // Phương thức khởi tạo các thành phần trực quan của công nhân
    workerVisualPrototype.init = function () {
        this.alpha = 0; // Độ mờ ban đầu là 0 (ẩn)
        // Thanh hiển thị hiệu suất
        this.efficiencyBar = new ProgressBarVisual;
        this.efficiencyBar.alpha = 1 > this.efficiency ? 1 : 0; // Hiển thị nếu hiệu suất < 1
        this.efficiencyBar.progress = 0.3; // Giá trị tiến độ mặc định (có thể không dùng)
        this.efficiencyBar.width = 12;
        this.efficiencyBar.height = 70;
        this.efficiencyBar.isHorizontal = !1; // Thanh dọc
        this.efficiencyBar.x -= 30 / VisualsManager.Divisor; // Điều chỉnh vị trí theo tỷ lệ
        // Thiết lập tỷ lệ chung cho công nhân dựa trên tỷ lệ toàn cục của canvas
        this.scaleY = this.scaleX = CanvasManager.globalScale;
        // Thêm thanh hiệu suất vào container
        this.addChild(this.efficiencyBar);
    };

    // Phương thức lưu trạng thái của công nhân
    workerVisualPrototype.save = function () {
        var saveData = {}; // Đổi tên 'a' thành 'saveData'
        saveData.id = this.id;
        saveData.alpha = this.alpha;
        saveData.progress = this.efficiencyBar.progress;
        saveData.efficiencyBarAlpha = this.efficiencyBar.alpha;
        saveData.state = this.state;
        saveData.efficiency = this.efficiency;
        saveData.zone = this.zone; // Khu vực làm việc (R&D hoặc Hardware)
        // Lưu trạng thái của animation
        saveData.visualData = this.animation.saveState();
        return saveData;
    };

    // Phương thức tải trạng thái của công nhân từ dữ liệu đã lưu
    workerVisualPrototype.load = function () {
        if (this.visualData) {
            this.zone = this.visualData.zone;
            this.setPosition(this.visualData.id); // Thiết lập lại vị trí dựa trên ID
            this.alpha = this.visualData.alpha;
            if (void 0 != this.visualData.efficiencyBarAlpha) {
                this.efficiencyBar.alpha = this.visualData.efficiencyBarAlpha;
            }
            this.efficiencyBar.progress = this.visualData.progress;
            this.state = this.visualData.state;
            this.efficiency = this.visualData.efficiency;
            this.loadAnimations(); // Tải lại các animation
            this.animation.loadState(this.visualData.visualData); // Tải lại trạng thái của animation
        }
    };

    // Phương thức tải các animation cho công nhân dựa trên ID và khu vực
    workerVisualPrototype.loadAnimations = function () {
        var lowResImageWidth = 200, // Đổi tên 'a' thành 'lowResImageWidth'
            lowResImageHeight = 150, // Đổi tên 'b' thành 'lowResImageHeight'
            lowResImageSmallHeight = 250; // Đổi tên 'd' thành 'lowResImageSmallHeight'

        // Điều chỉnh kích thước ảnh nếu là phiên bản độ phân giải thấp
        if (PlatformShim.ISLOWRES) {
            lowResImageWidth = 107;
            lowResImageHeight = 80;
            lowResImageSmallHeight = 133;
        }

        var currentGlobalScale = CanvasManager.globalScale; // Đổi tên 'k' thành 'currentGlobalScale'

        // Logic phức tạp để chọn animation dựa trên ID của công nhân và khu vực (zone)
        // Mỗi công nhân (this.id) sẽ có hình ảnh khác nhau ở khu vực R&D (zone != 0) và Hardware (zone == 0)
        if (this.id === 0) {
            this.animation = (this.zone === 0)
                ? new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets.hwFrontFemale1), 1)
                : new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets.rndFemaleTypingBack1), 1);
        } else if (this.id === 1) {
            this.animation = (this.zone === 0)
                ? new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets.hwBackMale2), 1)
                : new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets.rndMaleTypingBack1), 1);
        } else if (this.id === 2) {
            this.animation = (this.zone === 0)
                ? new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets.hwBackFemale2), 1)
                : new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets.rndOperator1), 1);
        } else if (this.id === 3) {
            this.animation = (this.zone === 0)
                ? new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets.hwBackMale1), 1)
                : new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets.rndActor1), 1);
        } else if (this.id === 4) {
            if (this.zone === 0) {
                this.animation = new CompositeBitmapAnimation;
                this.animation.addAnimation(new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets.hwFrontMale2), 1));
                // Overlay ảnh bàn làm việc cho công nhân ở khu vực Hardware
                this.animation.overlay = {
                    deskImage: this.getSubImage(this.x - 552 / VisualsManager.Divisor * currentGlobalScale, this.y - 746 / VisualsManager.Divisor * currentGlobalScale, lowResImageHeight, lowResImageSmallHeight, ResourceKeys.hwDesk2)
                };
            } else {
                this.animation = new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets.rndFemaleBoardBack1), 1);
            }
        } else if (this.id === 5) {
            if (this.zone === 0) {
                this.animation = new CompositeBitmapAnimation;
                this.animation.addAnimation(new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets.hwFrontMale3), 1));
                this.animation.overlay = {
                    deskImage: this.getSubImage(this.x - 998 / VisualsManager.Divisor * currentGlobalScale, this.y - 486 / VisualsManager.Divisor * currentGlobalScale, lowResImageHeight, lowResImageSmallHeight, ResourceKeys.hwDesk1)
                };
            } else {
                this.animation = new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets.rndFemaleTableBack1), 1);
            }
        } else if (this.id === 6) {
            if (this.zone === 0) {
                this.animation = new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets.hwBackFemale3), 1);
            } else {
                this.animation = new CompositeBitmapAnimation;
                this.animation.addAnimation(new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets.rndMaleFrontTable1_pants), 1));
                this.animation.addAnimation(new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets.rndMaleFrontTable1_body), 1));
                this.animation.overlay = {
                    deskImage: this.getSubImage(this.x - 735 / VisualsManager.Divisor * currentGlobalScale, this.y - 600 / VisualsManager.Divisor * currentGlobalScale, lowResImageWidth, lowResImageWidth, ResourceKeys.rndDesk1)
                };
            }
        } else if (this.id === 7) {
            this.animation = (this.zone === 0)
                ? new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets.hwBackFemale4), 1)
                : new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets.rndMaleTableBack1), 1);
        } else if (this.id === 8) {
            if (this.zone === 0) {
                this.animation = new CompositeBitmapAnimation;
                this.animation.addAnimation(new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets.hwFrontFemale2), 1));
                this.animation.overlay = {
                    deskImage: this.getSubImage(this.x - 552 / VisualsManager.Divisor * currentGlobalScale, this.y - 746 / VisualsManager.Divisor * currentGlobalScale, lowResImageHeight, lowResImageSmallHeight, ResourceKeys.hwDesk2)
                };
            } else {
                this.animation = new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets.rndMaleTableBack2), 1);
            }
        } else if (this.id === 9) {
            if (this.zone === 0) {
                this.animation = new CompositeBitmapAnimation;
                this.animation.addAnimation(new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets.hwFrontMale4), 1));
                this.animation.overlay = {
                    deskImage: this.getSubImage(this.x - 552 / VisualsManager.Divisor * currentGlobalScale, this.y - 746 / VisualsManager.Divisor * currentGlobalScale, lowResImageHeight, lowResImageSmallHeight, ResourceKeys.hwDesk2)
                };
            } else {
                this.animation = new CompositeBitmapAnimation;
                this.animation.addAnimation(new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets.rndFemaleTableFront1_pants), 1));
                this.animation.addAnimation(new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets.rndFemaleTableFront1_body), 1));
                this.animation.overlay = {
                    deskImage: this.getSubImage(this.x - 1043 / VisualsManager.Divisor * currentGlobalScale, this.y - 765 / VisualsManager.Divisor * currentGlobalScale, lowResImageWidth, lowResImageWidth, ResourceKeys.rndDesk2)
                };
            }
        } else if (this.id === 10) {
            if (this.zone === 0) {
                this.animation = new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets.hwFrontFemale4), 1);
            } else {
                this.animation = new CompositeBitmapAnimation;
                this.animation.addAnimation(new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets.rndMaleFrontTable2_pants), 1));
                this.animation.addAnimation(new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets.rndMaleFrontTable2_body), 1));
                this.animation.overlay = {
                    deskImage: this.getSubImage(this.x - 1043 / VisualsManager.Divisor * currentGlobalScale, this.y - 765 / VisualsManager.Divisor * currentGlobalScale, lowResImageWidth, lowResImageWidth, ResourceKeys.rndDesk2)
                };
            }
        } else { // Mặc định cho các ID khác
            this.animation = (this.zone === 0)
                ? new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets.hwBackFemale1), 1)
                : new BitmapAnimationX(new SpriteSheetX(AnimationSpriteSheets.rndMaleBoardFront1), 1);
        }
        // Bắt đầu animation ở vòng lặp "loop" và đặt độ mờ là 1 (hiển thị)
        this.animation.gotoAndPlay("loop");
        this.animation.setAlpha(1);
        // Thêm animation vào container
        this.addChild(this.animation);
    };

    // Phương thức tạo một ảnh con từ một ảnh lớn (sprite sheet)
    // offsetX, offsetY: tọa độ của ảnh con trong ảnh lớn
    // targetWidth, targetHeight: kích thước mong muốn của ảnh con
    // resourceKey: khóa để lấy ảnh lớn từ ResourceManager
    workerVisualPrototype.getSubImage = function (offsetX, offsetY, targetWidth, targetHeight, resourceKey) {
        var canvas = document.createElement("canvas"); // Đổi tên 'l' thành 'canvas'
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        // Vẽ phần mong muốn của ảnh lớn lên canvas tạm
        canvas.getContext("2d").drawImage(GameDev.ResourceManager.resources[resourceKey], -offsetX / CanvasManager.globalScale, -offsetY / CanvasManager.globalScale);
        // Tạo một đối tượng Image từ dữ liệu của canvas
        var image = new Image; // Đổi tên 'a' thành 'image'
        image.src = canvas.toDataURL("image/png");
        return image;
    };

    // Thiết lập vị trí của công nhân dựa trên ID và khu vực (zone)
    workerVisualPrototype.setPosition = function (workerId) { // Đổi tên 'a' thành 'workerId'
        this.id = workerId;
        if (this.zone === 0) {
            this.setHwLabPosition(); // Thiết lập vị trí trong phòng Hardware
        } else {
            this.setRndLabPosition(); // Thiết lập vị trí trong phòng R&D
        }
    };

    // Thiết lập tọa độ X, Y cho công nhân trong phòng Hardware
    workerVisualPrototype.setHwLabPosition = function () {
        var currentGlobalScale = CanvasManager.globalScale; // Đổi tên 'a' thành 'currentGlobalScale'
        // Logic phức tạp để đặt vị trí dựa trên ID của công nhân
        if (this.id === 0) { this.x = 1860 * currentGlobalScale; this.y = 920 * currentGlobalScale; }
        else if (this.id === 1) { this.x = 1720 * currentGlobalScale; this.y = 940 * currentGlobalScale; }
        else if (this.id === 2) { this.x = 1400 * currentGlobalScale; this.y = 820 * currentGlobalScale; }
        else if (this.id === 3) { this.x = 770 * currentGlobalScale; this.y = 850 * currentGlobalScale; }
        else if (this.id === 4) { this.x = 1300 * currentGlobalScale; this.y = 980 * currentGlobalScale; }
        else if (this.id === 5) { this.x = 1240 * currentGlobalScale; this.y = 530 * currentGlobalScale; }
        else if (this.id === 6) { this.x = 1100 * currentGlobalScale; this.y = 640 * currentGlobalScale; }
        else if (this.id === 7) { this.x = 1100 * currentGlobalScale; this.y = 1040 * currentGlobalScale; }
        else if (this.id === 8) { this.x = 800 * currentGlobalScale; this.y = 670 * currentGlobalScale; }
        else if (this.id === 9) { this.x = 1100 * currentGlobalScale; this.y = 850 * currentGlobalScale; }
        else if (this.id === 10) { this.x = 1788 * currentGlobalScale; this.y = 850 * currentGlobalScale; }
        else { this.x = 2100 * currentGlobalScale; this.y = 1102 * currentGlobalScale; }
        // Điều chỉnh tọa độ dựa trên Divisor của VisualsManager (có thể liên quan đến tỷ lệ hiển thị)
        this.x /= VisualsManager.Divisor;
        this.y /= VisualsManager.Divisor;
    };

    // Thiết lập tọa độ X, Y cho công nhân trong phòng R&D
    workerVisualPrototype.setRndLabPosition = function () {
        var currentGlobalScale = CanvasManager.globalScale; // Đổi tên 'a' thành 'currentGlobalScale'
        // Logic phức tạp để đặt vị trí dựa trên ID của công nhân
        if (this.id === 0) { this.x = 820 * currentGlobalScale; this.y = 420 * currentGlobalScale; }
        else if (this.id === 1) { this.x = 420 * currentGlobalScale; this.y = 420 * currentGlobalScale; }
        else if (this.id === 2) { this.x = 1620 * currentGlobalScale; this.y = 900 * currentGlobalScale; }
        else if (this.id === 3) { this.x = 1830 * currentGlobalScale; this.y = 770 * currentGlobalScale; }
        else if (this.id === 4) { this.x = 1520 * currentGlobalScale; this.y = 510 * currentGlobalScale; }
        else if (this.id === 5) { this.x = 1080 * currentGlobalScale; this.y = 955 * currentGlobalScale; }
        else if (this.id === 11) { this.x = 1250 * currentGlobalScale; this.y = 470 * currentGlobalScale; } // ID 11 có vẻ là một trường hợp đặc biệt
        else if (this.id === 6) { this.x = 960 * currentGlobalScale; this.y = 560 * currentGlobalScale; }
        else if (this.id === 7) { this.x = 1370 * currentGlobalScale; this.y = 790 * currentGlobalScale; }
        else if (this.id === 8) { this.x = 810 * currentGlobalScale; this.y = 800 * currentGlobalScale; }
        else if (this.id === 9) { this.x = 1100 * currentGlobalScale; this.y = 790 * currentGlobalScale; }
        else if (this.id === 10) { this.x = 1258 * currentGlobalScale; this.y = 700 * currentGlobalScale; }
        // Điều chỉnh tọa độ dựa trên Divisor của VisualsManager
        this.x /= VisualsManager.Divisor;
        this.y /= VisualsManager.Divisor;
    };

    // Phương thức được gọi mỗi frame để cập nhật trạng thái và hình ảnh của công nhân
    workerVisualPrototype.tick = function () {
        // Nếu chưa có lastUpdate, gán bằng thời gian game hiện tại
        if (!this.lastUpdate) {
            this.lastUpdate = GameManager.gameTime;
        }
        var deltaTime = GameManager.gameTime - this.lastUpdate; // Đổi tên 'a' thành 'deltaTime'
        if (deltaTime <= 0) {
            return; // Không làm gì nếu không có thời gian trôi qua
        }

        var affordanceFactor = this.getAffordanceFactor(); // Đổi tên 'b' thành 'affordanceFactor'
        // affordanceFactor có thể liên quan đến việc có đủ ngân sách cho công nhân làm việc không
        if (affordanceFactor < 1) {
            affordanceFactor *= 2; // Tăng gấp đôi nếu < 1 (có thể là cơ chế bù đắp)
        }
        var efficiencyGain = affordanceFactor * deltaTime / 22000; // Đổi tên 'b' thành 'efficiencyGain'
        this.efficiency = (this.efficiency + efficiencyGain).clamp(0, 1); // Tăng hiệu suất và giới hạn trong khoảng 0-1

        // Đồng bộ hiệu suất của animation với hiệu suất của công nhân
        if (this.animation.speedFactor != this.efficiency) {
            this.animation.speedFactor = this.efficiency;
        }

        // Xử lý hiển thị/ẩn công nhân và các hiệu ứng liên quan đến hiệu suất
        if (this.efficiency > 0 && this.alpha < 1) { // Nếu có hiệu suất và đang ẩn
            this.alpha += 0.02; // Tăng dần độ mờ
            if (this.alpha > 0.9) { // Khi gần như hiện hoàn toàn
                // Bật các animation phụ thuộc vào khu vực và ID của công nhân
                if (this.zone === 2) { // Khu vực R&D
                    if (this.id === 0) VisualsManager.levelOverlay.startRndPrinterRightScreen();
                    else if (this.id === 1) VisualsManager.levelOverlay.startRndPrinterLeftScreen();
                    else if (this.id === 2) VisualsManager.levelOverlay.startPrinter();
                } else if (this.zone === 0) { // Khu vực Hardware
                    if (this.id === 0) VisualsManager.levelOverlay.starthwLabTV();
                    else if (this.id === 2) VisualsManager.levelOverlay.startHwLabScreenWall();
                }
            }
        } else if (this.efficiency === 0 && this.alpha > 0) { // Nếu không có hiệu suất và đang hiện
            this.alpha -= 0.02; // Giảm dần độ mờ
            if (this.alpha < 0.9) { // Khi gần như ẩn hoàn toàn
                // Tắt các animation phụ
                if (this.zone === 2) {
                    if (this.id === 0) VisualsManager.levelOverlay.stopRndPrinterRightScreen();
                    else if (this.id === 1) VisualsManager.levelOverlay.stopRndPrinterLeftScreen();
                    else if (this.id === 2) VisualsManager.levelOverlay.stopPrinter();
                } else if (this.zone === 0) {
                    if (this.id === 0) VisualsManager.levelOverlay.stophwLabTV();
                    else if (this.id === 2) VisualsManager.levelOverlay.stopHwLabScreenWall();
                }
            }
        }

        // Cập nhật thanh hiệu suất
        if (this.efficiency != 1) {
            this.efficiencyBar.progress = this.efficiency;
            // Màu sắc thay đổi dựa trên hiệu suất
            this.efficiencyBar.color = createjs.Graphics.getHSL(80 * this.efficiency, 100, 50);
            this.efficiencyBar.alpha = (this.efficiencyBar.alpha + 0.01).clamp(0, 0.8);
        } else if (this.efficiencyBar.alpha != 0) {
            this.efficiencyBar.alpha = (this.efficiencyBar.alpha - 0.01).clamp(0, 1);
        }

        // Thực hiện công việc
        this._doWork(deltaTime);
        // Cập nhật thời gian lần cuối
        this.lastUpdate = GameManager.gameTime;
    };

    // Phương thức thực hiện công việc của công nhân
    workerVisualPrototype._doWork = function (deltaTime) { // Đổi tên 'a' thành 'deltaTime'
        var pointsGenerated; // Đổi tên 'b' thành 'pointsGenerated'
        // Tính toán số điểm/tiến độ công việc được tạo ra dựa trên deltaTime và hiệu suất
        pointsGenerated = deltaTime / 1000 * 1 * this.efficiency;

        var currentProject = this.getCurrentProject(); // Đổi tên 'a' thành 'currentProject'
        // Lấy danh sách các máy console tùy chỉnh đang được bảo trì
        var consolesUnderMaintenance = GameManager.company.licencedPlatforms.filter(function (platform) { // Đổi tên 'a' thành 'platform'
            return platform.isCustom === true && platform.maintenancePoints > 0 && (1E6 * platform.unitsSold * Sales.consoleUnitPrice) > platform.currentSalesCash;
        });

        // Nếu không có dự án hiện tại VÀ (không có console nào cần bảo trì HOẶC công nhân không ở khu vực R&D)
        // thì giảm số điểm/tiến độ công việc được tạo ra (có thể là công nhân làm việc ít hiệu quả hơn)
        if (!currentProject && (consolesUnderMaintenance.length === 0 || this.zone !== 2)) {
            pointsGenerated /= 7;
        }

        this.state.progressF += pointsGenerated; // Cộng dồn tiến độ
        var wholePoints = Math.floor(this.state.progressF); // Đổi tên 'b' thành 'wholePoints'
        // Nếu có điểm nguyên được tạo ra
        if (wholePoints > 0) {
            this.state.progressF -= wholePoints; // Trừ đi phần điểm nguyên đã xử lý

            // Lặp qua số điểm nguyên được tạo
            for (var i = 0; i < wholePoints; i++) { // Đổi tên 'k' thành 'i'
                var projectHasPointsRemaining = currentProject && currentProject.remainingPoints > 0; // Đổi tên 'm' thành 'projectHasPointsRemaining'

                // Ưu tiên xử lý bảo trì console nếu công nhân ở khu vực Hardware và có console cần bảo trì
                if (this.zone === 0 && consolesUnderMaintenance.length > 0) {
                    for (var j = consolesUnderMaintenance.length - 1; j >= 0; j--) { // Đổi tên 'l' thành 'j'
                        if (consolesUnderMaintenance[j].maintenancePoints > 0) {
                            consolesUnderMaintenance[j].maintenancePoints--;
                            consolesUnderMaintenance[j].repairPoints++;
                            // Nếu không còn điểm bảo trì VÀ console đã bán hết, xóa card bảo trì
                            if (consolesUnderMaintenance[j].maintenancePoints === 0 && consolesUnderMaintenance[j].unitsSold === Math.floor(consolesUnderMaintenance[j].currentSalesCash / Sales.consoleUnitPrice)) {
                                UI.removeMaintenanceCard(consolesUnderMaintenance[j]);
                            } else {
                                // Cập nhật card bảo trì
                                UI.updateRepairPoints(consolesUnderMaintenance[j]);
                                UI.updateMaintenanceCard(consolesUnderMaintenance[j]);
                            }
                            this._spawnPoint("t"); // Tạo hiệu ứng điểm công nghệ
                            return; // Xử lý một điểm bảo trì mỗi lần
                        }
                    }
                }

                // Nếu dự án hiện tại còn điểm cần làm
                if (projectHasPointsRemaining) {
                    currentProject.remainingPoints--;
                    var progressRatio = (currentProject.startPoints - currentProject.remainingPoints); // Đổi tên 'm' thành 'progressRatio'
                    currentProject.progress = (progressRatio === 0) ? 0 : progressRatio / currentProject.startPoints;
                    // Nếu dự án hoàn thành
                    if (currentProject.remainingPoints <= 0) {
                        GameManager.finishProject(currentProject);
                    }
                }

                var pointType; // Đổi tên 'g' thành 'pointType'
                // Xác định loại điểm được tạo dựa trên khu vực và dự án
                if (this.zone == 2) { // Khu vực R&D
                    pointType = currentProject ? "d" : "r"; // Nếu có dự án R&D, tạo điểm Design, nếu không thì tạo điểm Research
                    if (pointType === "r") {
                        GameManager.company.researchPoints++;
                        VisualsManager.pulsePointsDisplay(pointType);
                        VisualsManager.updatePoints();
                    }
                    // Xử lý đặc biệt cho dự án Marketing AAA
                    if (currentProject && currentProject.id === Research.AAAMarketingCampaign.id) {
                        if (GameManager.company.currentGame) {
                            GameManager.company.currentGame.hypePoints += 100 / currentProject.startPoints;
                        } else {
                            GameManager.finishProject(currentProject); // Nếu game không còn, hoàn thành dự án
                        }
                    }
                } else if (this.zone === 0) { // Khu vực Hardware
                    pointType = "t"; // Tạo điểm Technology
                    // Xử lý đặc biệt cho dự án Hardware AAA
                    if (currentProject && currentProject.id === Research.AAACustomHardware.id) {
                        if (GameManager.company.currentGame) {
                            GameManager.company.currentGame.hypePoints += 50 / currentProject.startPoints;
                        } else {
                            GameManager.finishProject(currentProject);
                        }
                    }
                }
                this._spawnPoint(pointType); // Tạo hiệu ứng điểm
            }
        }
    };

    // Bộ sinh số ngẫu nhiên riêng cho việc tạo điểm (để đảm bảo tính nhất quán nếu cần)
    var randomPointGenerator = new MersenneTwister(0); // Đổi tên 'b' thành 'randomPointGenerator'

    // Phương thức tạo hiệu ứng điểm bay ra từ công nhân
    workerVisualPrototype._spawnPoint = function (pointType) { // Đổi tên 'a' thành 'pointType'
        var pointShape = new createjs.Shape; // Đổi tên 'f' thành 'pointShape'
        pointShape.alpha = 0;
        // Lấy tọa độ gốc để tạo điểm (có thể là vị trí của công nhân)
        pointShape.x = 20 * randomPointGenerator.random() * randomPointGenerator.randomSign();
        pointShape.y = -20 * randomPointGenerator.random();
        pointShape.regX = 5; // Tâm xoay X
        pointShape.regY = 5; // Tâm xoay Y
        pointShape.scaleX = 0;
        pointShape.scaleY = 0;

        // Xác định màu của điểm dựa trên loại điểm
        var pointColor = (pointType === "t" || pointType === "e") ? TECHNOLOGY_POINTS_COLOR :
            (pointType === "d") ? DESIGN_POINTS_COLOR :
                (pointType === "b") ? BUGS_COLOR : RESEARCH_POINTS_COLOR; // Đổi tên 'd' thành 'pointColor'

        // Phát âm thanh nếu công nhân đang ở khu vực hiển thị hiện tại
        if (this.zone == GameManager.company.flags.currentZone) {
            Sound.playSpawnSound(pointType);
        }

        var graphics = pointShape.graphics; // Đổi tên 'a' thành 'graphics'
        graphics.beginFill(pointColor);
        graphics.beginStroke("black");
        graphics.setStrokeStyle(0.5);
        graphics.drawCircle(5, 5, 10); // Vẽ hình tròn làm điểm
        graphics.closePath();

        this.addChild(pointShape); // Thêm điểm vào container của công nhân

        var self = this; // Đổi tên 'k' thành 'self'
        var tweens = []; // Đổi tên 'd' thành 'tweens' (mảng chứa các tween animation)

        // Animation điểm bay lên
        tweens.push(createjs.Tween.get(pointShape).to({ y: -80 - 60 * randomPointGenerator.random() }, 600, createjs.Ease.backIn));
        // Animation mờ dần và xóa điểm
        tweens.push(createjs.Tween.get(pointShape)
            .to({ alpha: 1 }, 150) // Hiện ra
            .wait(300) // Chờ
            .to({ alpha: 0 }, 150) // Mờ đi
            .call(function () { // Sau khi hoàn thành
                self.removeChild(pointShape); // Xóa điểm khỏi container
            })
        );
        // Animation phóng to điểm
        tweens.push(createjs.Tween.get(pointShape).to({ scaleX: 1, scaleY: 1 }, 300, createjs.Ease.backOut));
    };
})();

// --- END OF FILE ProjectWorkerVisual.js ---