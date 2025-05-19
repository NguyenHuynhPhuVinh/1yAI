// Định nghĩa constructor cho IsometricCompanyNameVisual
// Đây là một đối tượng hiển thị tên công ty theo kiểu isometric (phối cảnh)
IsometricCompanyNameVisual = function () {
    // Gọi constructor của lớp cha (createjs.Container)
    // để thiết lập đối tượng này như một container có thể chứa các đối tượng hiển thị khác.
    createjs.Container.apply(this, arguments);
};

(function () {
    // Thiết lập kế thừa: IsometricCompanyNameVisual.prototype sẽ kế thừa từ createjs.Container.prototype
    IsometricCompanyNameVisual.prototype = new createjs.Container;

    // Phương thức updateVisual dùng để cập nhật/vẽ lại tên công ty
    // Tham số 'isSimplifiedStyle' (trước đây là 'a'): boolean, nếu true thì sẽ vẽ theo kiểu đơn giản hơn (ít lớp hơn)
    IsometricCompanyNameVisual.prototype.updateVisual = function (isSimplifiedStyle) {
        // Xóa tất cả các đối tượng con hiện có để vẽ lại từ đầu
        this.removeAllChildren();

        // Lấy tên công ty từ GameManager
        var companyName = GameManager.company.name;

        // Tính toán chiều rộng tối đa cho phép của text dựa trên tọa độ màn hình
        // 600 là một giá trị cơ sở, được điều chỉnh theo tỷ lệ globalScaleIgnoringLowResBackground
        var maxWidth = VisualsManager.toScreenCoordinates(600, CanvasManager.globalScaleIgnoringLowResBackground);

        // Kích thước font ban đầu (sẽ được điều chỉnh để vừa với maxWidth)
        var fontSize = 54; // Trước đây là 'f'

        // Biến tạm để chứa đối tượng Text và font string
        var textObject; // Trước đây là 'd' trong vòng lặp do...while và sau đó là textInstance
        var fontString; // Trước đây là 'd' trong khai báo fontString

        // Vòng lặp do...while để tìm kích thước font phù hợp nhất
        // Giảm kích thước font cho đến khi chiều rộng của text nhỏ hơn hoặc bằng maxWidth
        // hoặc kích thước font giảm xuống dưới 10pt.
        do {
            fontString = "{0}pt {1}".format(fontSize, "Calibri"); // Tạo chuỗi định dạng font
            textObject = new createjs.Text(companyName, fontString, "black"); // Tạo đối tượng Text
            fontSize = fontSize - 2; // Giảm kích thước font cho lần lặp tiếp theo
        } while (textObject.getMeasuredWidth() > maxWidth && 10 < fontSize); // Điều kiện dừng vòng lặp

        // Tính toán tỷ lệ scale cho text dựa trên kích thước font cuối cùng
        var textScale = fontSize / 32; // Trước đây là 'c'

        // Xác định số lớp text sẽ vẽ (cho hiệu ứng đổ bóng/3D nhẹ)
        // Nếu isSimplifiedStyle là true, chỉ vẽ 1 lớp, ngược lại vẽ 5 lớp.
        var numberOfLayers = isSimplifiedStyle ? 1 : 5; // Trước đây là 'f' trong vòng lặp for

        // Vòng lặp để tạo và thêm các lớp text
        for (var layerIndex = 0; layerIndex < numberOfLayers; layerIndex++) { // 'layerIndex' trước đây là 'k'
            // Xác định màu sắc cho lớp text hiện tại
            // Lớp đầu tiên (layerIndex == 0) có độ sáng 70, các lớp sau giảm dần độ sáng
            // Nếu isSimplifiedStyle là true, tất cả các lớp đều có độ sáng 41.
            var textColor = createjs.Graphics.getHSL(0, 0, 0 == layerIndex ? 70 : 60 / layerIndex);
            if (isSimplifiedStyle) {
                textColor = createjs.Graphics.getHSL(0, 0, 41);
            }

            // Tạo đối tượng Text cho lớp hiện tại với font Calibri, 32pt và màu đã xác định
            var textInstance = new createjs.Text(companyName, "32pt {0}".format("Calibri"), textColor); // 'textInstance' trước đây là 'd'
            textInstance.textAlign = "center";         // Căn giữa text theo chiều ngang
            textInstance.textBaseline = "alphabetical"; // Đặt baseline của text

            // Điều chỉnh vị trí x, y của mỗi lớp để tạo hiệu ứng nổi khối nhẹ
            textInstance.x += 1 * layerIndex;
            textInstance.y -= 1 * layerIndex;

            // Thêm lớp text này vào container, các lớp sau sẽ được vẽ bên dưới lớp trước
            this.addChildAt(textInstance, 0);
        }

        // Thiết lập độ nghiêng (skew) theo trục Y để tạo hiệu ứng isometric
        this.skewY = 30;

        // Thiết lập tỷ lệ (scale) cho toàn bộ container chứa tên công ty
        // Dựa trên textScale (tính từ font size) và globalScale của CanvasManager
        this.scaleX = textScale * CanvasManager.globalScale;
        this.scaleY = textScale * CanvasManager.globalScale;

        // Thiết lập độ trong suốt (alpha)
        // Nếu isSimplifiedStyle là true, alpha là 0.8, ngược lại là 1 (hoàn toàn rõ nét)
        this.alpha = isSimplifiedStyle ? 0.8 : 1;
    }
})();