// --- START OF FILE ProgressBarVisual.js ---

/**
 * @class ProgressBarVisual
 * @description Một đối tượng đồ họa (kế thừa từ createjs.Shape) để hiển thị một thanh tiến trình.
 * Thanh tiến trình này có thể là ngang hoặc dọc, có màu nền và màu tiến trình tùy chỉnh.
 * Nó được cập nhật thông qua hàm onTick.
 */
var ProgressBarVisual = function () {
    // Gọi hàm khởi tạo của lớp cha (createjs.Shape)
    this.initialize();
};

(function () {
    // Gán prototype của createjs.Shape cho ProgressBarVisual
    ProgressBarVisual.prototype = new createjs.Shape();

    // Tạo một alias cho prototype để dễ sử dụng hơn
    var progressBarPrototype = ProgressBarVisual.prototype;

    // --- Các thuộc tính mặc định của ProgressBarVisual ---

    /**
     * @member {number} width
     * @description Chiều rộng mặc định của thanh tiến trình.
     * @default 100
     */
    progressBarPrototype.width = 100;

    /**
     * @member {number} height
     * @description Chiều cao mặc định của thanh tiến trình.
     * @default 20
     */
    progressBarPrototype.height = 20;

    /**
     * @member {number} progress
     * @description Giá trị tiến trình hiện tại (từ 0 đến 1).
     * @default 0
     */
    progressBarPrototype.progress = 0;

    /**
     * @member {string} color
     * @description Màu của phần tiến trình đã hoàn thành.
     * @default "darkblue"
     */
    progressBarPrototype.color = "darkblue";

    /**
     * @member {boolean} isHorizontal
     * @description Xác định thanh tiến trình là ngang (true) hay dọc (false).
     * @default true
     */
    progressBarPrototype.isHorizontal = true;

    /**
     * @function onTick
     * @description Hàm được gọi trong mỗi frame của game loop để vẽ lại thanh tiến trình.
     *                Chỉ vẽ lại nếu đối tượng không hoàn toàn trong suốt (alpha != 0).
     */
    progressBarPrototype.onTick = function () {
        // Chỉ vẽ lại nếu thanh tiến trình có thể nhìn thấy (alpha khác 0)
        if (0 != this.alpha) {
            // Lấy các thuộc tính của thanh tiến trình
            var currentWidth = this.width;        // Chiều rộng hiện tại của thanh
            var currentHeight = this.height;      // Chiều cao hiện tại của thanh
            var graphicsContext = this.graphics;  // Đối tượng đồ họa để vẽ

            // Xóa hình vẽ cũ để vẽ lại
            graphicsContext.clear();

            // --- Vẽ phần nền của thanh tiến trình ---
            graphicsContext.beginFill("#A0A0A0"); // Màu nền xám nhạt
            // Vẽ một hình chữ nhật bo góc làm nền
            // Tham số: x, y, width, height, cornerRadius
            graphicsContext.drawRoundRect(0, 0, currentWidth, currentHeight, 2);

            // --- Vẽ phần tiến trình (phần đã hoàn thành) ---
            graphicsContext.beginFill(this.color); // Sử dụng màu đã định nghĩa cho phần tiến trình

            // Tính toán kích thước và vị trí của phần tiến trình dựa trên isHorizontal
            var progressFillX = 1;                     // Tọa độ x bắt đầu vẽ của phần fill (có padding 1px)
            var progressFillY = 1;                     // Tọa độ y bắt đầu vẽ của phần fill (có padding 1px)
            var progressFillWidth = currentWidth - 2;  // Chiều rộng của phần fill (trừ padding 2px)
            var progressFillHeight = currentHeight - 2; // Chiều cao của phần fill (trừ padding 2px)

            if (this.isHorizontal) {
                // Nếu là thanh ngang, chiều rộng của phần fill phụ thuộc vào progress
                progressFillWidth *= this.progress.clamp(0, 1); // Giới hạn progress từ 0 đến 1
            } else {
                // Nếu là thanh dọc
                var filledHeight = progressFillHeight * this.progress.clamp(0, 1); // Chiều cao thực tế của phần đã fill
                progressFillY = (currentHeight - 2) - filledHeight + 1; // Tính lại tọa độ y để vẽ từ dưới lên
                progressFillHeight = filledHeight; // Chiều cao của phần fill giờ là filledHeight
            }

            // Vẽ hình chữ nhật bo góc cho phần tiến trình
            graphicsContext.drawRoundRect(progressFillX, progressFillY, progressFillWidth, progressFillHeight, 2);

            // Kết thúc đường vẽ
            graphicsContext.closePath();
        }
    };
})();
// --- END OF FILE ProgressBarVisual.js ---