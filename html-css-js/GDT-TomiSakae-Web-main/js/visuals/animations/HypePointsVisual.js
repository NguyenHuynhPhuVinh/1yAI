// Định nghĩa constructor cho HypePointsVisual
var HypePointsVisual = function () {
    // Gọi hàm khởi tạo của lớp cha (createjs.Container)
    this.initialize();

    // Thiết lập chiều rộng mặc định cho visual component
    this.width = 150;
    // Thiết lập chiều cao mặc định cho visual component
    this.height = 30;

    // Tạo một đối tượng Shape để vẽ đường viền
    this.border = new createjs.Shape();
    // Thêm đường viền vào container
    this.addChild(this.border);

    // Xác định font chữ dựa trên việc Segoe UI có được cài đặt hay không
    var fontName = UI.IS_SEGOE_UI_INSTALLED ? "Segoe UI" : "Open Sans";
    // Tạo đối tượng Text để hiển thị điểm hype, với giá trị ban đầu và font chữ đã xác định
    this.text = new createjs.Text("Hype 400", "14pt {0}".format(fontName), "white");
    // Căn giữa chữ theo chiều ngang
    this.text.textAlign = "center";
    // Căn giữa chữ theo chiều dọc
    this.text.textBaseline = "middle";
    // Thiết lập vị trí x của text ở giữa chiều rộng của component
    this.text.x = this.width / 2;
    // Thiết lập vị trí y của text ở giữa chiều cao của component (có điều chỉnh nhỏ)
    this.text.y = this.height / 2 - 2;
    // Thiết lập chiều rộng tối đa cho text (để tránh tràn ra ngoài)
    this.text.maxWidth = this.width - 10;
    // Thêm text vào container
    this.addChild(this.text);

    // Gọi hàm để vẽ lại component lần đầu
    this._redraw();
};

// Sử dụng IIFE (Immediately Invoked Function Expression) để tạo scope riêng và mở rộng prototype
(function () {
    // Tạo một alias cho HypePointsVisual để dễ sử dụng bên trong IIFE
    var HypePointsVisualConstructor = HypePointsVisual;

    // Thiết lập prototype của HypePointsVisual kế thừa từ createjs.Container
    // Điều này cho phép HypePointsVisual sử dụng các phương thức và thuộc tính của Container
    HypePointsVisualConstructor.prototype = new createjs.Container();

    // Tạo một alias cho prototype của HypePointsVisualConstructor để code ngắn gọn hơn
    var hypePointsVisualPrototype = HypePointsVisualConstructor.prototype;

    /**
     * Cập nhật nội dung text của visual component.
     * @param {string} newText - Nội dung text mới cần hiển thị.
     */
    hypePointsVisualPrototype.updateText = function (newText) {
        this.text.text = newText;
    };

    /**
     * Vẽ lại hình dạng (đường viền và nền) của visual component.
     * Hàm này được gọi khi component cần được cập nhật hình ảnh.
     * @private
     */
    hypePointsVisualPrototype._redraw = function () {
        // Lấy chiều rộng và chiều cao hiện tại của component
        var currentWidth = this.width;
        var currentHeight = this.height;
        // Lấy đối tượng graphics của đường viền để vẽ
        var borderGraphics = this.border.graphics;

        // Xóa các hình vẽ cũ trên graphics object
        borderGraphics.clear();

        // Xác định màu nền (màu đỏ với độ trong suốt 0.7)
        var backgroundColor = createjs.Graphics.getRGB(204, 0, 51, 0.7);
        // Bắt đầu tô màu nền
        borderGraphics.beginFill(backgroundColor);
        // Thiết lập độ dày của đường viền là 2 pixel
        borderGraphics.setStrokeStyle(2);
        // Thiết lập màu của đường viền là màu đen
        borderGraphics.beginStroke("black");
        // Vẽ một hình chữ nhật bo góc với chiều rộng, chiều cao và bán kính bo góc là 2
        borderGraphics.drawRoundRect(0, 0, currentWidth, currentHeight, 2);
        // Kết thúc đường vẽ
        borderGraphics.closePath();
    };
})();