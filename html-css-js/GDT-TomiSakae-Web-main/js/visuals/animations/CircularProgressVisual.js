// Định nghĩa constructor cho CircularProgressVisual
// Đây là một đối tượng hình ảnh dùng để hiển thị một vòng tròn tiến trình (progress bar dạng tròn)
var CircularProgressVisual = function () {
    // Giá trị tối đa và góc tối đa của cung tròn (360 độ)
    this.maxValue = this.angleArc = 360;
    // Giá trị tối thiểu của tiến trình
    this.minValue = 0;
    // Màu nền của vòng tròn (phần chưa hoàn thành)
    this.bgColor = "red"; // Ví dụ: màu đỏ cho nền
    // Màu của phần tiến trình đã hoàn thành
    this.fgColor = "blue"; // Ví dụ: màu xanh cho tiến trình
    // Bán kính của vòng tròn tiến trình
    this.radius = 20;
    // Độ dày của đường vẽ vòng tròn
    this.lineWidth = 10;
    // Khởi tạo giá trị tiến trình ban đầu là 0
    this.updateValue(0);
    // Góc bắt đầu vẽ cung tròn tiến trình (1.5 * PI tương đương với vị trí 12 giờ trên đồng hồ)
    this.startAngle = 1.5 * Math.PI;
    // Gọi constructor của lớp cha (createjs.Shape)
    createjs.Shape.apply(this, arguments);
};

// Sử dụng IIFE để tạo scope riêng và mở rộng prototype
(function () {
    // Thiết lập kế thừa từ createjs.Shape
    CircularProgressVisual.prototype = new createjs.Shape();
    // Gán prototype vào một biến ngắn gọn hơn để dễ sử dụng
    var shapePrototype = CircularProgressVisual.prototype; // Đổi tên 'a' thành 'shapePrototype'

    // Hàm được gọi mỗi tick của game loop (nếu đối tượng này được thêm vào stage và stage được cập nhật)
    // Mục đích: Vẽ lại hình nếu trạng thái 'invalid' là true
    shapePrototype.onTick = function () {
        if (this.invalid) { // Kiểm tra nếu cần vẽ lại
            this._redraw(); // Gọi hàm vẽ lại
            this.invalid = false; // Đặt lại trạng thái, không cần vẽ lại cho đến khi có thay đổi
        }
    };

    // Hàm để đánh dấu rằng hình ảnh cần được vẽ lại trong lần tick tiếp theo
    shapePrototype.invalidate = function () {
        this.invalid = true;
    };

    // Hàm cập nhật giá trị tiến trình hiện tại và tính toán góc kết thúc của cung tròn
    // value: giá trị tiến trình mới (từ 0 đến 360)
    shapePrototype.updateValue = function (currentValue) { // Đổi tên 'a' thành 'currentValue'
        this.value = currentValue;
        // Tính toán góc kết thúc (endAngle) dựa trên giá trị hiện tại.
        // Nếu giá trị là 0 hoặc 360 (vòng tròn đầy đủ), góc kết thúc sẽ giống góc bắt đầu (để createjs xử lý đúng).
        // Ngược lại, chuyển đổi giá trị (0-360) thành radian.
        // (this.value - 90) để điều chỉnh điểm bắt đầu vẽ từ vị trí 12 giờ.
        // / 180 * Math.PI để chuyển đổi từ độ sang radian.
        this.endAngle = (currentValue === 0 || currentValue === 360) ? this.startAngle : (this.value - 90) / 180 * Math.PI;
    };

    // Hằng số đại diện cho một vòng tròn đầy đủ (2 * PI radian = 360 độ)
    var FULL_CIRCLE_RADIANS = 2 * Math.PI; // Đổi tên 'b' thành 'FULL_CIRCLE_RADIANS'

    // Hàm vẽ lại hình ảnh của vòng tròn tiến trình
    shapePrototype._redraw = function () {
        var graphicsContext = this.graphics; // Đổi tên 'a' thành 'graphicsContext' (hoặc 'gfx')
        // Xóa các hình vẽ cũ
        graphicsContext.clear();
        // Thiết lập độ dày của đường vẽ
        graphicsContext.setStrokeStyle(this.lineWidth);

        // Vẽ phần nền của vòng tròn (nếu có màu nền được định nghĩa)
        if (this.bgColor) {
            graphicsContext.beginStroke(this.bgColor); // Bắt đầu vẽ với màu nền
            // Vẽ một cung tròn đầy đủ cho nền
            graphicsContext.arc(this.radius, this.radius, this.radius, 0, FULL_CIRCLE_RADIANS);
        }

        // Vẽ phần tiến trình đã hoàn thành
        graphicsContext.beginStroke(this.fgColor); // Bắt đầu vẽ với màu tiến trình
        // Vẽ cung tròn thể hiện tiến trình, từ startAngle đến endAngle
        graphicsContext.arc(this.radius, this.radius, this.radius, this.startAngle, this.endAngle);
    };
})();