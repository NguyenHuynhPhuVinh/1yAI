// Định nghĩa constructor cho CharacterNameVisual
// Đây là một đối tượng createjs.Container dùng để hiển thị tên và thông tin chuyên môn của nhân vật.
CharacterNameVisual = function (characterData) { // Đổi 'a' thành 'characterData' để rõ ràng hơn là dữ liệu nhân vật được truyền vào
    // Gọi constructor của lớp cha (createjs.Container)
    createjs.Container.apply(this, arguments);
    // Lưu trữ tham chiếu đến đối tượng dữ liệu nhân vật
    this.character = characterData;
    // Gọi phương thức khởi tạo của đối tượng này
    this.init();
};

(function () {
    // Thiết lập kế thừa từ createjs.Container
    CharacterNameVisual.prototype = new createjs.Container;

    // Phương thức khởi tạo cho CharacterNameVisual
    CharacterNameVisual.prototype.init = function () {
        // Xóa tất cả các đối tượng con hiện có (nếu có, ví dụ khi refresh)
        this.removeAllChildren();

        // Lấy tên nhân vật. Nếu id là 0 (thường là nhân vật chính), không hiển thị tên ban đầu.
        var characterName = 0 === this.character.id ? "" : this.character.name;

        // Tính toán chiều rộng tối đa cho tên nhân vật dựa trên kích thước màn hình và tỷ lệ
        var maxNameWidth = VisualsManager.toScreenCoordinates(280, CanvasManager.globalScaleIgnoringLowResBackground);

        // Chọn font chữ: Segoe UI nếu có, ngược lại dùng Open Sans
        var fontFamily = UI.IS_SEGOE_UI_INSTALLED ? "Segoe UI" : "Open Sans";

        // Kích thước font ban đầu để thử
        var fontSize = 24;
        var nameTextObject; // Biến tạm để lưu đối tượng Text

        // Vòng lặp để tìm kích thước font phù hợp sao cho tên không vượt quá chiều rộng tối đa
        do {
            // Tạo chuỗi định dạng font (ví dụ: "bold 24pt Segoe UI")
            var fontStyle = "bold {0}pt {1}".format(fontSize, fontFamily);
            // Tạo đối tượng Text của createjs để đo kích thước
            nameTextObject = new createjs.Text(characterName, fontStyle, "black");
            // Giảm kích thước font nếu tên quá dài
            fontSize = fontSize - 2;
        } while (nameTextObject.getMeasuredWidth() > maxNameWidth && 10 < fontSize); // Dừng lại nếu font quá nhỏ hoặc đã vừa

        // Tính toán tỷ lệ scale cho font dựa trên kích thước font cuối cùng
        // (fontSize + 2 vì vòng lặp do-while sẽ giảm fontSize một lần cuối ngay cả khi điều kiện đã sai)
        var fontScaleRatio = (fontSize + 2) / 32; // 32 là kích thước font cơ sở dùng để vẽ

        // Xác định màu chữ dựa trên một giá trị HSL (ở đây là màu xám đậm)
        var nameTextColor = createjs.Graphics.getHSL(0, 0, 34);

        // Kiểm tra xem nhân vật có chuyên môn (expert) không, nếu có thì thêm vào chuỗi hiển thị
        var expertInfoText = this.character.flags.expert ?
            "{0}({1})".format("" != characterName ? "\n" : "", Missions.getMissionWithId(this.character.flags.expert).name) : "";

        // Tạo đối tượng Text cuối cùng để hiển thị tên và thông tin chuyên môn
        // Sử dụng kích thước font cơ sở (32pt) rồi scale lại sau để đảm bảo chất lượng khi scale
        var displayTextObject = new createjs.Text(characterName + expertInfoText, "bold 32pt {0}".format(fontFamily), nameTextColor);
        displayTextObject.textAlign = "center";       // Căn giữa theo chiều ngang
        displayTextObject.textBaseline = "alphabetical"; // Căn dòng chữ

        // Thêm đối tượng Text vào container này ở vị trí đầu tiên (index 0)
        this.addChildAt(displayTextObject, 0);

        // Áp dụng tỷ lệ scale cho toàn bộ container (bao gồm cả text)
        // fontScaleRatio: để điều chỉnh kích thước font cho vừa maxNameWidth
        // CanvasManager.globalScale: tỷ lệ scale chung của game để phù hợp với các kích thước màn hình khác nhau
        this.scaleX = fontScaleRatio * CanvasManager.globalScale;
        this.scaleY = fontScaleRatio * CanvasManager.globalScale;

        // Điều chỉnh vị trí và độ nghiêng (skew) của tên dựa trên hướng của nhân vật
        // Điều này tạo hiệu ứng perspective hoặc phù hợp với góc nhìn isometric của game
        switch (this.character.getOrientation()) {
            case CharacterOrientation.NW: // Hướng Tây Bắc
                this.skewY = -30;
                this.skewX = -60;
                // Chuyển đổi tọa độ từ không gian game sang không gian màn hình
                this.x = VisualsManager.toScreenCoordinates(170, CanvasManager.globalScale);
                this.y = VisualsManager.toScreenCoordinates(230, CanvasManager.globalScale);
                break;
            case CharacterOrientation.SE: // Hướng Đông Nam
                this.skewY = -30;
                this.skewX = -60;
                this.x = VisualsManager.toScreenCoordinates(-50, CanvasManager.globalScale);
                this.y = VisualsManager.toScreenCoordinates(90, CanvasManager.globalScale);
                break;
            // Có thể có các case khác cho các hướng NE, SW nếu game hỗ trợ
        }
    }
})();