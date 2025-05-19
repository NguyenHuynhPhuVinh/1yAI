/**
 * SpriteSheetX là một lớp mở rộng từ createjs.SpriteSheet.
 * Lớp này được tạo ra để có thể lưu trữ thêm thông tin về targetFPS (khung hình/giây mục tiêu)
 * và baseImage (hình ảnh nền cơ sở) cho một sprite sheet.
 *
 * @constructor
 * @param {object} spriteSheetData - Dữ liệu cấu hình cho sprite sheet, tương tự như tham số
 *                                   được truyền vào constructor của createjs.SpriteSheet.
 *                                   Dự kiến đối tượng này sẽ có thuộc tính `targetFPS` và `baseImage`.
 */
var SpriteSheetX = function (spriteSheetData) {
    // Gọi constructor của lớp cha (createjs.SpriteSheet) với các tham số được truyền vào.
    // 'this' trong ngữ cảnh này tham chiếu đến instance của SpriteSheetX.
    // 'arguments' là một đối tượng giống mảng chứa tất cả các tham số được truyền cho hàm SpriteSheetX.
    // Bằng cách sử dụng apply, chúng ta gọi SpriteSheet constructor với 'this' của SpriteSheetX
    // và truyền tất cả các tham số ban đầu.
    createjs.SpriteSheet.apply(this, arguments);

    // Gán thuộc tính targetFPS từ dữ liệu được cung cấp.
    // targetFPS có thể được sử dụng để điều chỉnh tốc độ animation cho phù hợp.
    // Ví dụ: nếu animation được tạo với 30 FPS nhưng game chạy ở 60 FPS,
    // targetFPS có thể giúp tính toán lại tốc độ phát animation.
    this.targetFPS = spriteSheetData.targetFPS;

    // Gán thuộc tính baseImage từ dữ liệu được cung cấp.
    // baseImage có thể là một hình ảnh nền được sử dụng chung cho nhiều frame
    // của sprite sheet, giúp tối ưu hóa bộ nhớ hoặc tạo hiệu ứng đặc biệt.
    this.baseImage = spriteSheetData.baseImage;
};

// Thiết lập kế thừa prototype.
// Đoạn code này đảm bảo rằng SpriteSheetX sẽ kế thừa tất cả các phương thức và thuộc tính
// từ prototype của createjs.SpriteSheet.
(function () {
    // Tạo một đối tượng mới từ prototype của createjs.SpriteSheet.
    // Điều này thường được thực hiện bằng Object.create(createjs.SpriteSheet.prototype) trong JavaScript hiện đại hơn,
    // nhưng cách này cũng hoạt động để thiết lập chuỗi prototype.
    SpriteSheetX.prototype = new createjs.SpriteSheet();

    // (Tùy chọn, nhưng là thực hành tốt) Sửa lại con trỏ constructor để trỏ đúng về SpriteSheetX.
    // Khi bạn ghi đè prototype bằng `new createjs.SpriteSheet()`, constructor của SpriteSheetX.prototype
    // sẽ là `createjs.SpriteSheet`. Việc đặt lại này giúp việc kiểm tra `instanceof` và
    // các cơ chế nội bộ khác hoạt động chính xác hơn.
    // SpriteSheetX.prototype.constructor = SpriteSheetX;
})();