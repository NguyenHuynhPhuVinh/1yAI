// --- START OF FILE PointsDisplayVisual.js ---

/**
 * Hàm khởi tạo (constructor) cho đối tượng PointsDisplayVisual.
 * Đây là một thành phần UI (có thể là một hình tròn với số điểm ở giữa và tiêu đề bên dưới)
 * được sử dụng để hiển thị một loại điểm nào đó (ví dụ: Design, Technology, Research).
 * Nó kế thừa từ createjs.Container.
 *
 * @param {string} color - Màu sắc chính của hình tròn hiển thị điểm.
 * @param {string} textColor - Màu sắc của văn bản (số điểm và tiêu đề).
 * @param {string} caption - Văn bản tiêu đề hiển thị bên dưới hình tròn điểm.
 */
var PointsDisplayVisual = function (color, textColor, caption) {
    this.initialize(); // Gọi hàm initialize của lớp cha (createjs.Container)

    // Container bên trong để nhóm các thành phần đồ họa và văn bản
    this.innerContainer = new createjs.Container();
    // Shape chính, có thể là hình tròn hiển thị điểm
    this.mainShape = new createjs.Shape();
    this.innerContainer.addChild(this.mainShape);

    // Xác định font chữ dựa trên việc có cài đặt Segoe UI hay không
    var fontFamily = UI.IS_SEGOE_UI_INSTALLED ? "Segoe UI" : "Open Sans";

    // Văn bản hiển thị số điểm
    this.text = new createjs.Text("0", "14pt {0}".format(fontFamily), textColor);
    this.text.textAlign = "center"; // Căn giữa theo chiều ngang
    this.text.textBaseline = "middle"; // Căn giữa theo chiều dọc
    this.text.lineHeight = this.text.getMeasuredLineHeight(); // Lấy chiều cao dòng cho việc căn chỉnh

    // Tối ưu hóa việc render văn bản bằng cách cache nó nếu được bật trong settings
    if (SettingsGameplay.isTextCacheEnabled()) {
        this.text.cache(-50, -50, 100, 100); // Định nghĩa vùng cache
        this.textIsCached = true;
    } else {
        this.text.uncache();
        this.textIsCached = false;
    }
    this.innerContainer.addChild(this.text);

    this.points = 0; // Giá trị điểm hiện tại
    this.size = 120; // Kích thước của hình tròn hiển thị điểm (đường kính)
    this.addChild(this.innerContainer); // Thêm innerContainer vào đối tượng PointsDisplayVisual

    this.color = color; // Lưu trữ màu sắc chính

    // Shape cho đường viền của tiêu đề
    this.captionBorder = new createjs.Shape();
    this.innerContainer.addChild(this.captionBorder);

    // Văn bản tiêu đề
    this.captionText = new createjs.Text(caption, "10pt {0}".format(fontFamily), textColor);
    this.captionText.textBaseline = "alphabetic"; // Căn chỉnh baseline
    this.captionText.direction = "rtl"; // Hỗ trợ văn bản từ phải sang trái (có thể không cần thiết nếu game chỉ có LTR)
    this.captionText.lineHeight = this.captionText.getMeasuredLineHeight();
    this.captionText.lineWidth = this.captionText.getMeasuredWidth(); // Lưu trữ chiều rộng để tính toán vị trí
    this.innerContainer.addChild(this.captionText);

    this.isInvalid = true; // Cờ để đánh dấu cần vẽ lại
};

(function () {
    // Kế thừa từ createjs.Container
    PointsDisplayVisual.prototype = new createjs.Container();
    // Tạo một alias cho prototype để code ngắn gọn hơn
    var pointsDisplayProto = PointsDisplayVisual.prototype;

    /**
     * Cập nhật giá trị điểm.
     * @param {number} newPoints - Giá trị điểm mới.
     */
    pointsDisplayProto.updatePoints = function (newPoints) {
        this.points = newPoints;
    };

    /**
     * Tạo hiệu ứng "pulse" (nhấp nháy/phình to rồi thu nhỏ) cho hình tròn điểm.
     * Thường được gọi khi có điểm được thêm vào.
     * @param {function} [onCompleteCallback] - Hàm callback sẽ được gọi sau khi hiệu ứng kết thúc.
     */
    pointsDisplayProto.pulse = function (onCompleteCallback) {
        var pulseShape = new createjs.Shape(); // Tạo một shape mới cho hiệu ứng pulse
        pulseShape.alpha = 0; // Ban đầu ẩn

        var pulseGraphics = pulseShape.graphics;
        pulseGraphics.clear(); // Xóa các lệnh vẽ cũ

        var gradientRadius = this.size / 4; // Bán kính cho gradient
        // Tạo gradient tròn từ màu chính ra trong suốt
        pulseGraphics.beginRadialGradientFill(
            [this.color, this.color, this.color, "white", this.color, "transparent"], // Mảng màu
            [0, 0.8, 0.85, 0.86, 0.9, 1], // Vị trí dừng của các màu trong gradient
            gradientRadius, gradientRadius, 0, // Tọa độ và bán kính bắt đầu của gradient
            gradientRadius, gradientRadius, gradientRadius // Tọa độ và bán kính kết thúc của gradient
        );
        pulseGraphics.drawEllipse(0, 0, this.size / 2, this.size / 2); // Vẽ hình tròn
        pulseGraphics.closePath();

        this.addChildAt(pulseShape, 0); // Thêm shape pulse vào dưới cùng (để không che các text)

        var offset = 0.4 * this.size / 4; // Tính toán độ lệch cho hiệu ứng phình to
        pulseShape.scaleX = 1.4; // Phình to ban đầu
        pulseShape.scaleY = 1.4;
        pulseShape.x = -offset; // Điều chỉnh vị trí để tâm không đổi khi scale
        pulseShape.y = -offset;

        // Animation mờ dần rồi hiện ra
        createjs.Tween.get(pulseShape)
            .to({ alpha: 0.8 }, 100) // Hiện ra
            .wait(200) // Đợi
            .to({ alpha: 0 }, 100); // Mờ dần

        // Animation scale về kích thước ban đầu
        createjs.Tween.get(pulseShape)
            .to({ scaleX: 1, scaleY: 1, x: 0, y: 0 }, 400)
            .call(function () {
                pulseShape.parent.removeChild(pulseShape); // Xóa shape pulse sau khi hiệu ứng kết thúc
                if (onCompleteCallback) {
                    onCompleteCallback(); // Gọi callback nếu có
                }
            });
    };

    /**
     * Hàm được gọi mỗi tick của game loop (nếu đối tượng được thêm vào stage).
     * Dùng để cập nhật hiển thị.
     */
    pointsDisplayProto.onTick = function () {
        // Nếu isInvalid là true, vẽ lại các thành phần chính
        if (this.isInvalid) {
            this.drawMainShape();
            // Căn chỉnh vị trí văn bản số điểm
            this.text.y = this.size / 4;
            this.text.x = this.size / 4;
        }

        // Chỉ cập nhật text nếu giá trị điểm thay đổi (để tối ưu hiệu suất)
        if (this.text.text != Math.floor(this.points)) {
            this.text.text = Math.floor(this.points); // Cập nhật văn bản số điểm
            // Nếu cache được bật, cập nhật cache của text
            if (SettingsGameplay.isTextCacheEnabled()) {
                if (!this.textIsCached) {
                    this.text.cache(-50, -50, 100, 100);
                    this.textIsCached = true;
                }
                this.text.updateCache();
            } else {
                this.text.uncache(); // Xóa cache nếu không dùng
            }
        }
        this.isInvalid = false; // Đánh dấu đã vẽ xong
    };

    /**
     * Vẽ lại hình tròn chính và viền của tiêu đề.
     */
    pointsDisplayProto.drawMainShape = function () {
        var mainGraphics = this.mainShape.graphics;
        mainGraphics.clear(); // Xóa hình vẽ cũ
        mainGraphics.beginFill(this.color); // Bắt đầu tô màu
        mainGraphics.setStrokeStyle(2); // Độ dày đường viền
        mainGraphics.beginStroke("black"); // Màu đường viền
        mainGraphics.drawEllipse(0, 0, this.size / 2, this.size / 2); // Vẽ hình elip (tròn nếu width = height)
        mainGraphics.closePath(); // Kết thúc đường vẽ

        var captionWidth = this.captionText.lineWidth || this.captionText.getMeasuredWidth(); // Lấy chiều rộng của tiêu đề
        var captionHeight = this.captionText.lineHeight || this.captionText.getMeasuredLineHeight(); // Lấy chiều cao của tiêu đề

        var captionBorderGraphics = this.captionBorder.graphics;
        captionBorderGraphics.clear();
        captionBorderGraphics.beginFill(this.color);
        captionBorderGraphics.setStrokeStyle(1);
        captionBorderGraphics.beginStroke("black");

        // Tính toán vị trí cho tiêu đề và viền của nó
        var captionX = this.size / 4 - captionWidth / 2; // Căn giữa tiêu đề
        var captionY = this.size / 2 + 5; // Vị trí Y của tiêu đề (bên dưới hình tròn)
        captionBorderGraphics.drawRoundRect(captionX - 5, captionY, captionWidth + 10, captionHeight + 10, 2); // Vẽ hình chữ nhật bo góc cho viền
        captionBorderGraphics.closePath();

        // Chỉ cập nhật vị trí captionText nếu nó chưa được cache (hoặc cacheID là 0)
        // Điều này tránh việc tính toán lại vị trí không cần thiết nếu text không đổi.
        if (this.captionText.cacheID === 0) {
            this.captionText.x = captionX;
            this.captionText.y = captionY + 10 + captionHeight / 2; // Căn giữa tiêu đề trong viền của nó
            if (SettingsGameplay.isTextCacheEnabled()) {
                this.captionText.cache(0, -15, 100, 25); // Cache tiêu đề
            } else {
                this.captionText.uncache();
            }
        }
    };
})();
// --- END OF FILE PointsDisplayVisual.js ---