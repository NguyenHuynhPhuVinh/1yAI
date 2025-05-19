"use strict";

/**
 * Khởi tạo một đối tượng Genre (Thể loại game).
 * @param {string} genreName Tên của thể loại game.
 */
var Genre = function (genreName) {
    // Thuộc tính 'name' lưu trữ tên của thể loại.
    this.name = genreName;
};

(function () {
    /**
     * Tải (khôi phục) một đối tượng Genre từ dữ liệu đã lưu.
     * Hàm này là một phương thức tĩnh của constructor Genre.
     * @param {object} savedData Đối tượng chứa dữ liệu đã lưu của Genre (thường chỉ có thuộc tính 'name').
     * @returns {Genre} Một instance mới của Genre được tạo từ dữ liệu đã lưu.
     */
    Genre.load = function (savedData) {
        // Tạo một đối tượng Genre mới với tên được lấy từ dữ liệu đã lưu.
        return new Genre(savedData.name);
    };

    /**
     * Tạo một đối tượng đơn giản để lưu trữ thông tin của Genre.
     * Hàm này là một phương thức của prototype Genre.
     * @returns {object} Một đối tượng chứa dữ liệu cần thiết để lưu trữ Genre (chỉ có thuộc tính 'name').
     */
    Genre.prototype.save = function () {
        // Tạo một đối tượng rỗng để lưu trữ dữ liệu.
        var dataToSave = {};
        // Gán tên của thể loại hiện tại vào thuộc tính 'name' của đối tượng lưu trữ.
        dataToSave.name = this.name;
        // Trả về đối tượng chứa dữ liệu đã được chuẩn bị để lưu.
        return dataToSave;
    }
})();