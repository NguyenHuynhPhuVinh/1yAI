"use strict";
/**
 * Hàm khởi tạo (constructor) cho đối tượng Booth (Gian hàng).
 * Mỗi gian hàng tại một sự kiện (ví dụ: hội chợ game G3) sẽ có các thuộc tính này.
 *
 * @param {number} id Mã định danh duy nhất của gian hàng.
 * @param {string} name Tên của gian hàng (ví dụ: "Small Booth", "Medium Booth").
 * @param {number} standFactor Hệ số ảnh hưởng của gian hàng (có thể liên quan đến độ thu hút, kích thước).
 * @param {string} description Mô tả chi tiết về gian hàng.
 * @param {number} cost Chi phí để thuê hoặc sở hữu gian hàng này.
 * @param {string} floorImage Đường dẫn đến hình ảnh sàn của gian hàng.
 * @param {string} bgImage Đường dẫn đến hình ảnh nền (background) của gian hàng.
 * @param {string} fgImage Đường dẫn đến hình ảnh tiền cảnh (foreground) của gian hàng (có thể là các vật phẩm trang trí phía trước).
 */
var Booth = function (id, name, standFactor, description, cost, floorImage, bgImage, fgImage) {
    // Gán giá trị của tham số 'id' cho thuộc tính 'id' của đối tượng Booth đang được tạo.
    this.id = id;

    // Gán giá trị của tham số 'name' cho thuộc tính 'name' của đối tượng Booth.
    this.name = name;

    // Gán giá trị của tham số 'standFactor' cho thuộc tính 'standFactor' của đối tượng Booth.
    // Hệ số này có thể ảnh hưởng đến mức độ nổi bật hoặc hiệu quả của gian hàng.
    this.standFactor = standFactor;

    // Gán giá trị của tham số 'description' cho thuộc tính 'description' của đối tượng Booth.
    // Cung cấp thông tin mô tả về gian hàng.
    this.description = description;

    // Gán giá trị của tham số 'cost' cho thuộc tính 'cost' của đối tượng Booth.
    // Đây là chi phí liên quan đến việc sử dụng gian hàng này.
    this.cost = cost;

    // Gán giá trị của tham số 'floorImage' cho thuộc tính 'floorImage' của đối tượng Booth.
    // Đường dẫn tới tệp hình ảnh sử dụng cho sàn của gian hàng.
    this.floorImage = floorImage;

    // Gán giá trị của tham số 'bgImage' cho thuộc tính 'bgImage' của đối tượng Booth.
    // Đường dẫn tới tệp hình ảnh sử dụng cho phần nền của gian hàng.
    this.bgImage = bgImage;

    // Gán giá trị của tham số 'fgImage' cho thuộc tính 'fgImage' của đối tượng Booth.
    // Đường dẫn tới tệp hình ảnh sử dụng cho phần tiền cảnh (có thể là các vật thể ở phía trước) của gian hàng.
    // Thuộc tính này có thể là tùy chọn (không phải gian hàng nào cũng có).
    this.fgImage = fgImage;
};