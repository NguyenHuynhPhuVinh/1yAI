// EnginePartsSerializer: Chịu trách nhiệm chuyển đổi dữ liệu của các "bộ phận engine" (Engine Parts)
// giữa dạng đối tượng trong game và dạng có thể lưu trữ (JSON).
// Các bộ phận engine là các công nghệ hoặc tính năng có thể được thêm vào một game engine tùy chỉnh.
var EnginePartsSerializer = {};
(function () {
    // Hàm load: Tìm và trả về đối tượng Engine Part đầy đủ từ danh sách tất cả các mục nghiên cứu
    // dựa trên ID được cung cấp trong dữ liệu thô.
    EnginePartsSerializer.load = function (rawData) {
        // Research.getAllItems() trả về một mảng tất cả các mục nghiên cứu có sẵn trong game.
        // .first() là một phương thức tùy chỉnh (được thêm vào Array.prototype) để tìm phần tử đầu tiên thỏa mãn điều kiện.
        return Research.getAllItems().first(function (researchItem) {
            // So sánh ID của mục nghiên cứu với ID trong dữ liệu thô.
            return researchItem.id === rawData.id;
        });
    };

    // Hàm save: Chuyển đổi một đối tượng Engine Part trong game thành dạng dữ liệu chỉ chứa ID để lưu trữ.
    EnginePartsSerializer.save = function (objectToSave) {
        var serializedObject = {}; // Đối tượng JSON sẽ được trả về để lưu
        // Chỉ lưu ID của bộ phận engine, vì thông tin chi tiết có thể được tra cứu lại khi load.
        serializedObject.id = objectToSave.id;
        return serializedObject;
    }
})();