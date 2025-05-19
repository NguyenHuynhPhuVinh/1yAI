// --- START OF FILE GameStatusBar.js ---

/**
 * Hàm khởi tạo (constructor) cho GameStatusBar.
 * Đây là một đối tượng hiển thị trực quan trên canvas, thể hiện trạng thái hiện tại của dự án game
 * (tên game, điểm thiết kế, điểm công nghệ, lỗi, tiến độ, v.v.).
 * Nó kế thừa từ createjs.Container để có thể chứa các đối tượng hiển thị khác.
 */
var GameStatusBar = function () {
    // Gọi hàm khởi tạo của lớp cha (createjs.Container)
    this.initialize();

    // Thiết lập kích thước mặc định của thanh trạng thái
    this.width = 300;
    this.textContainerHeight = this.height = 80; // Chiều cao cho phần chứa chữ và chiều cao tổng thể

    // Tạo một đối tượng Shape để vẽ nền của thanh trạng thái
    this.mainShape = new createjs.Shape;
    this.addChild(this.mainShape); // Thêm nền vào GameStatusBar

    // Tạo đối tượng Text để hiển thị tên game
    this.gameName = new createjs.Text;
    this.gameName.textBaseline = "middle"; // Canh giữa theo chiều dọc
    this.addChild(this.gameName); // Thêm tên game vào GameStatusBar

    // Xác định font chữ dựa trên việc font Segoe UI có được cài đặt hay không
    var fontName = UI.IS_SEGOE_UI_INSTALLED ? "Segoe UI" : "Open Sans";

    // Tạo đối tượng Text để hiển thị chi tiết game (ví dụ: Topic/Genre)
    this.gameDetailText = new createjs.Text("", "12pt {0}".format(fontName), "black");
    this.gameDetailText.textAlign = "center"; // Canh giữa theo chiều ngang
    this.gameDetailText.textBaseline = "alphabetic";
    this.gameDetailText.text = "No Project".localize(); // Văn bản mặc định khi không có dự án
    this.gameDetailText.x = this.width / 2;
    this.gameDetailText.y = this.textContainerHeight / 2 + 10;
    this.gameDetailText.lineHeight = this.gameDetailText.getMeasuredLineHeight();
    this.addChild(this.gameDetailText);

    // Tạo thanh tiến trình (progress bar)
    this.progressBar = new ProgressBarVisual;
    this.progressBar.height = 20;
    this.progressBar.width = this.width - 60; // Chiều rộng thanh tiến trình (trừ padding)
    this.progressBar.x = 30; // Vị trí x của thanh tiến trình
    this.progressBar.y = this.textContainerHeight - 25; // Vị trí y của thanh tiến trình
    this.progressBar.alpha = 0; // Ban đầu ẩn đi
    this.addChild(this.progressBar);

    // Tạo đối tượng Text để hiển thị trạng thái hiện tại (ví dụ: "Developing", "Bug Fixing")
    this.stateText = new createjs.Text("", "10pt {0}".format(fontName), "DimGray");
    this.stateText.x = this.width / 2;
    this.stateText.y = this.textContainerHeight - 11;
    this.stateText.textAlign = "center";
    this.stateText.textBaseline = "alphabetic";
    this.addChild(this.stateText);

    // Tính toán vị trí y cho các điểm hiển thị (design, technology)
    var pointsYPosition = this.textContainerHeight / 2 - 30;

    // Tạo đối tượng hiển thị điểm thiết kế
    this.designPoints = new PointsDisplayVisual(DESIGN_POINTS_COLOR, "black", "Design".localize());
    this.designPoints.x = -30; // Vị trí x (có thể lệch ra ngoài bên trái)
    this.designPoints.y = pointsYPosition;
    this.addChild(this.designPoints);

    // Tạo đối tượng hiển thị điểm công nghệ
    this.technologyPoints = new PointsDisplayVisual(TECHNOLOGY_POINTS_COLOR, "black", "Technology".localize());
    this.technologyPoints.x = this.width - 30; // Vị trí x (có thể lệch ra ngoài bên phải)
    this.technologyPoints.y = pointsYPosition;
    this.addChild(this.technologyPoints);

    // Tạo đối tượng hiển thị số lượng lỗi
    this.bugs = new PointsDisplayVisual(BUGS_COLOR, "black", "Bugs".localize());
    this.bugs.x = this.x - 120; // Vị trí x (có thể lệch ra ngoài bên trái, xa hơn designPoints)
    this.bugs.y = 0;
    this.bugs.size = 100;
    this.addChild(this.bugs);

    // Tạo đối tượng hiển thị điểm còn lại cho việc phát triển engine
    this.enginePoints = new PointsDisplayVisual(TECHNOLOGY_POINTS_COLOR, "black", "Remaining".localize("label for visual which shows 'points remaining'"));
    this.enginePoints.x = this.width / 2 - this.enginePoints.size / 4;
    this.enginePoints.y = this.textContainerHeight + 5; // Nằm dưới thanh trạng thái chính
    this.enginePoints.alpha = 0; // Ban đầu ẩn đi
    this.addChild(this.enginePoints);

    // Tạo đối tượng hiển thị điểm hype
    this.hypePoints = new HypePointsVisual;
    this.hypePoints.x = this.width / 2 - this.hypePoints.width / 2; // Canh giữa
    this.hypePoints.y = this.textContainerHeight; // Nằm dưới thanh trạng thái chính
    this.hypePoints.alpha = 0; // Ban đầu ẩn đi
    this.addChildAt(this.hypePoints, 0); // Thêm vào dưới cùng để không che các element khác

    // Cờ đánh dấu cần vẽ lại
    this.isInvalid = true;
};

// Mở rộng GameStatusBar từ createjs.Container
(function () {
    GameStatusBar.prototype = new createjs.Container;
    var statusBarProto = GameStatusBar.prototype; // Tạo một alias cho prototype để dễ sử dụng

    /**
     * Đặt lại thanh trạng thái về trạng thái ban đầu, thường là khi kết thúc một dự án.
     */
    statusBarProto.reset = function () {
        this.finishEngine(); // Gọi hàm kết thúc engine (có thể làm các việc dọn dẹp khác)
    };

    /**
     * Bắt đầu hiển thị các thành phần liên quan đến phát triển game (điểm design, tech, bugs).
     */
    statusBarProto.startDevelopment = function () {
        createjs.Tween.get(this.designPoints).to({ alpha: 1 }, 400);
        createjs.Tween.get(this.technologyPoints).to({ alpha: 1 }, 400);
        createjs.Tween.get(this.bugs).to({ alpha: 1 }, 400);
        createjs.Tween.get(this.gameName).to({ alpha: 1 }, 400);
        this.stateText.shadow = null; // Xóa shadow của stateText
        this.stateText.color = "DimGray"; // Đặt màu cho stateText
        createjs.Tween.get(this.stateText).to({ alpha: 1 }, 400);
    };

    /**
     * Bắt đầu hiển thị các thành phần liên quan đến phát triển engine.
     * Ẩn các điểm design, tech, bugs thông thường và hiện điểm engine.
     */
    statusBarProto.startEngine = function () {
        createjs.Tween.get(this.designPoints).to({ alpha: 0 }, 400);
        createjs.Tween.get(this.technologyPoints).to({ alpha: 0 }, 400);
        createjs.Tween.get(this.bugs).to({ alpha: 0 }, 400);
        createjs.Tween.get(this.enginePoints).to({ alpha: 1 }, 400);
        this.updateGameNameText(GameManager.currentEngineDev.name); // Cập nhật tên engine
        this.gameDetailText.text = "Custom Game Engine".localize(); // Đặt chi tiết là "Custom Game Engine"
        createjs.Tween.get(this.gameName).to({ alpha: 1 }, 400);
    };

    /**
     * Bắt đầu hiển thị các thành phần liên quan đến làm hợp đồng.
     * Hiện design, tech points, ẩn bugs.
     */
    statusBarProto.startContract = function () {
        var currentContract = GameManager.currentContract;
        createjs.Tween.get(this.designPoints).to({ alpha: 1 }, 400);
        createjs.Tween.get(this.technologyPoints).to({ alpha: 1 }, 400);
        createjs.Tween.get(this.bugs).to({ alpha: 0 }, 400); // Ẩn điểm bugs
        this.updateGameNameText(currentContract.name); // Cập nhật tên hợp đồng
        this.gameDetailText.text = "Contract".localize(); // Đặt chi tiết là "Contract"
        this.stateText.text = "Time Left".localize("label for progressbar"); // Hiển thị thời gian còn lại
        this.stateText.shadow = null;
        this.stateText.color = "DimGray";
        createjs.Tween.get(this.stateText).to({ alpha: 1 }, 400);
        createjs.Tween.get(this.gameName).to({ alpha: 1 }, 400);
    };

    /**
     * Kết thúc hiển thị hợp đồng, gọi endDevelopment.
     */
    statusBarProto.finishContract = function () {
        this.endDevelopment();
    };

    /**
     * Kết thúc hiển thị phát triển engine.
     */
    statusBarProto.finishEngine = function () {
        this.enginePoints.alpha = 0; // Ẩn điểm engine
        this.endDevelopment();
    };

    /**
     * Kết thúc giai đoạn phát triển (game, engine, hoặc contract).
     * Đưa các thành phần về trạng thái ẩn hoặc mờ đi.
     */
    statusBarProto.endDevelopment = function () {
        this.designPoints.alpha = 0.2; // Làm mờ design points
        this.technologyPoints.alpha = 0.2; // Làm mờ technology points
        this.bugs.alpha = 0.2; // Làm mờ bugs
        this.gameName.alpha = 0; // Ẩn tên game
        this.stateText.alpha = 0; // Ẩn state text
        this.progressBar.alpha = 0; // Ẩn progress bar
        this.hypePoints.alpha = 0; // Ẩn hype points
        this.gameDetailText.text = "No Project".localize(); // Đặt lại chi tiết là "No Project"
        // Reset điểm về 0
        this.designPoints.updatePoints(0);
        this.technologyPoints.updatePoints(0);
        this.bugs.updatePoints(0);
        this.updateProgress(false); // Ẩn progress bar
        GameManager.spawnedPoints = 0; // Reset số điểm đang hiển thị (bubbling)
    };

    /**
     * Hàm được gọi mỗi tick của game loop để vẽ lại nếu cần.
     */
    statusBarProto.onTick = function () {
        if (this.isInvalid) {
            this.redraw(); // Vẽ lại nền
            this.isInvalid = false;
        }
    };

    /**
     * Cập nhật thanh tiến trình.
     * @param {number|boolean} progressValue - Giá trị tiến trình (0-1) hoặc false để ẩn.
     * @param {boolean} [animate=false] - Có sử dụng animation không.
     * @param {number} [duration=400] - Thời gian animation.
     */
    statusBarProto.updateProgress = function (progressValue, animate, duration) {
        duration = duration || 400; // Thời gian mặc định cho animation
        if (!progressValue || isNaN(progressValue)) { // Nếu không có giá trị tiến trình hoặc không phải số
            if (this.progressBar.alpha === 1) { // Nếu thanh tiến trình đang hiện
                createjs.Tween.get(this.progressBar).to({ alpha: 0 }, duration); // Ẩn đi
                this.stateText.shadow = null;
                this.stateText.color = "DimGray";
            }
        } else { // Nếu có giá trị tiến trình
            if (animate && progressValue > 0) {
                createjs.Tween.get(this.progressBar).to({ progress: progressValue }, duration);
            } else {
                this.progressBar.progress = progressValue;
            }
            if (this.progressBar.alpha === 0) { // Nếu thanh tiến trình đang ẩn
                createjs.Tween.get(this.progressBar).to({ alpha: 1 }, duration); // Hiện ra
                this.stateText.color = "white";
                this.stateText.shadow = new createjs.Shadow("black", 0, 0, 2); // Thêm shadow cho stateText khi progress bar hiện
            }
        }
    };

    /**
     * Cập nhật thông điệp trạng thái (ví dụ: tên của feature đang phát triển).
     * @param {string} message - Thông điệp cần hiển thị.
     */
    statusBarProto.updateStatusMessage = function (message) {
        this.stateText.text = message;
        if (!this.stateText.lineHeight) { // Nếu chiều cao dòng chưa được tính
            this.stateText.lineHeight = this.stateText.getMeasuredLineHeight();
        }
        if (this.stateText.alpha === 0) { // Nếu stateText đang ẩn
            createjs.Tween.get(this.stateText).to({ alpha: 1 }, 400); // Hiện ra
        }
    };

    /**
     * Cập nhật điểm hype.
     * @param {number} points - Số điểm hype mới.
     */
    statusBarProto.updateHypePoints = function (points) {
        if (this.hypePoints.points != points) { // Chỉ cập nhật nếu giá trị thay đổi
            this.hypePoints.points = points;
            this.hypePoints.updateText("Hype {0}".localize("hype {0} points").format(points));
        }
        if (this.hypePoints.alpha === 0) { // Nếu hypePoints đang ẩn
            createjs.Tween.get(this.hypePoints).to({ alpha: 1 }, 400); // Hiện ra
        }
    };

    /**
     * Lấy vị trí toàn cục (global position) của một loại điểm hiển thị.
     * @param {string} pointType - Loại điểm ('t' cho tech, 'e' cho engine, 'b' cho bug, còn lại là design).
     * @returns {object} - Đối tượng chứa tọa độ x, y.
     */
    statusBarProto.getGlobalLocationOfPointsDisplay = function (pointType) {
        var displayVisual = (pointType === 't') ? this.technologyPoints :
            (pointType === 'e') ? this.enginePoints :
                (pointType === 'b') ? this.bugs :
                    this.designPoints;
        return this.localToGlobal(displayVisual.x + displayVisual.size / 4, displayVisual.y + displayVisual.size / 4);
    };

    /**
     * Tạo hiệu ứng "pulse" cho một loại điểm hiển thị.
     * @param {string} pointType - Loại điểm.
     * @param {function} [callback] - Hàm callback sau khi hiệu ứng kết thúc.
     */
    statusBarProto.pulsePointsDisplay = function (pointType, callback) {
        (
            (pointType === 't') ? this.technologyPoints :
                (pointType === 'e') ? this.enginePoints :
                    (pointType === 'b' || pointType === 'br') ? this.bugs :
                        this.designPoints
        ).pulse(callback);
    };

    /**
     * Cập nhật văn bản hiển thị tên game, tự động điều chỉnh kích thước font.
     * @param {string} gameTitle - Tên game.
     */
    statusBarProto.updateGameNameText = function (gameTitle) {
        var originalIndex = this.children.indexOf(this.gameName);
        this.removeChild(this.gameName); // Xóa đối tượng tên game cũ

        var fontSize = 24;
        var fontName = UI.IS_SEGOE_UI_INSTALLED ? "Segoe UI" : "Open Sans";
        var newGameNameText;

        // Vòng lặp để tìm kích thước font phù hợp
        do {
            var fontStyle = "{0}pt {1}".format(fontSize, fontName);
            newGameNameText = new createjs.Text(gameTitle, fontStyle, "black");
            fontSize = fontSize - 2;
        } while (newGameNameText.getMeasuredWidth() * 1.1 > this.width && fontSize > 10);

        newGameNameText.textAlign = "center";
        newGameNameText.textBaseline = "middle";
        newGameNameText.lineHeight = newGameNameText.getMeasuredLineHeight();
        newGameNameText.y = this.textContainerHeight / 4;
        newGameNameText.x = 30 + (this.width - 60) / 2; // Canh giữa trong vùng cho phép
        newGameNameText.maxWidth = this.width - 60; // Giới hạn chiều rộng tối đa

        this.gameName = newGameNameText; // Gán đối tượng Text mới
        this.addChildAt(this.gameName, originalIndex); // Thêm lại vào vị trí cũ
    };

    /**
     * Cập nhật tên game và chi tiết game (topic/genre) trên thanh trạng thái.
     */
    statusBarProto.updateGameName = function () {
        var currentGame = GameManager.company.currentGame;
        if (currentGame && currentGame.topic && currentGame.genre) {
            this.updateGameNameText(currentGame.title);
            this.gameDetailText.text = currentGame.topic.name + " / " + currentGame.genre.name;
            if (currentGame.secondGenre) {
                this.gameDetailText.text += "-" + currentGame.secondGenre.name;
            }
        }
    };

    /**
     * Cập nhật tất cả các loại điểm hiển thị (design, tech, bugs, engine).
     */
    statusBarProto.updatePoints = function () {
        var currentGame = GameManager.company.currentGame;
        if (currentGame) {
            this.designPoints.updatePoints(currentGame.designPoints);
            this.technologyPoints.updatePoints(currentGame.technologyPoints);
            this.bugs.updatePoints(currentGame.bugs);
        } else if (GameManager.currentEngineDev) {
            this.enginePoints.updatePoints(GameManager.currentEngineDev.remainingPointsDisplay);
        } else if (GameManager.currentContract) {
            var currentContract = GameManager.currentContract;
            this.designPoints.updatePoints(currentContract.visualDRemaining);
            this.technologyPoints.updatePoints(currentContract.visualTRemaining);
        }
    };

    /**
     * Vẽ lại nền của thanh trạng thái.
     */
    statusBarProto.redraw = function () {
        var graphics = this.mainShape.graphics;
        graphics.beginFill(createjs.Graphics.getRGB(255, 255, 255, 0.8)); // Màu nền trắng với độ trong suốt
        graphics.beginStroke("black"); // Viền đen
        graphics.setStrokeStyle(1); // Độ dày viền
        graphics.drawRoundRect(0, 0, this.width, this.textContainerHeight, 14.3); // Vẽ hình chữ nhật bo góc
        graphics.closePath();
    };
})();