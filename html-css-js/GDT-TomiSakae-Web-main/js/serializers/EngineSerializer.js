// EngineSerializer: Chịu trách nhiệm chuyển đổi dữ liệu của một "game engine tùy chỉnh" (Custom Game Engine)
// giữa dạng đối tượng trong game và dạng có thể lưu trữ (JSON).
var EngineSerializer = {};
(function () {
    // Hàm load: Chuyển đổi dữ liệu thô của một engine thành đối tượng engine hoàn chỉnh.
    EngineSerializer.load = function (rawData) {
        var resultObject = {}; // Đối tượng engine kết quả
        // Sao chép tất cả các thuộc tính từ rawData sang resultObject.
        // Điều này giả định rằng hầu hết các thuộc tính của engine (như id, name, techLevel, costs, releaseWeek)
        // được lưu trực tiếp và không cần xử lý đặc biệt.
        $.extend(resultObject, rawData);

        // Xử lý đặc biệt cho thuộc tính 'parts' (danh sách các bộ phận của engine).
        // Mỗi phần tử trong rawData.parts là một đối tượng chỉ chứa ID (đã được EnginePartsSerializer.save lưu lại).
        // Cần sử dụng EnginePartsSerializer.load để chuyển đổi từng ID này trở lại thành đối tượng Engine Part đầy đủ.
        resultObject.parts = rawData.parts.map(function (partData) {
            // EnginePartsSerializer.load sẽ tìm đối tượng Engine Part dựa trên partData.id
            return EnginePartsSerializer.load(partData);
        }).filter(function (loadedPart) {
            // Loại bỏ các phần tử null hoặc undefined nếu không tìm thấy bộ phận (có thể do mod bị thiếu).
            return loadedPart; // Trả về true nếu loadedPart có giá trị, false nếu là null/undefined
        });

        return resultObject;
    };

    // Hàm save: Chuyển đổi một đối tượng Engine trong game thành dạng dữ liệu có thể lưu trữ.
    EngineSerializer.save = function (objectToSave) {
        var serializedObject = {}; // Đối tượng JSON sẽ được trả về để lưu
        // Sao chép tất cả các thuộc tính từ objectToSave sang serializedObject.
        $.extend(serializedObject, objectToSave);

        // Xử lý đặc biệt cho thuộc tính 'parts'.
        // Chuyển đổi từng đối tượng Engine Part đầy đủ trong mảng objectToSave.parts
        // thành dạng chỉ chứa ID sử dụng EnginePartsSerializer.save.
        serializedObject.parts = objectToSave.parts.map(function (enginePart) {
            return EnginePartsSerializer.save(enginePart);
        });

        return serializedObject;
    }
})();