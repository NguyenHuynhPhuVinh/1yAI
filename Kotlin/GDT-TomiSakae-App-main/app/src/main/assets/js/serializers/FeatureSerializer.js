// FeatureSerializer: Chịu trách nhiệm chuyển đổi dữ liệu của các "tính năng game" (Game Features)
// giữa dạng đối tượng trong game và dạng có thể lưu trữ (JSON).
// Các tính năng game này có thể là các mục nghiên cứu đã hoàn thành hoặc các item đặc biệt.
var FeatureSerializer = {};
(function () {
    // Hàm load: Tìm và trả về đối tượng Feature đầy đủ từ danh sách tất cả các mục nghiên cứu
    // dựa trên ID được cung cấp trong dữ liệu thô, đồng thời cập nhật kinh nghiệm (experience) nếu có.
    FeatureSerializer.load = function (rawData) {
        // Tìm đối tượng Feature gốc trong danh sách tất cả các item nghiên cứu.
        var researchItemObject = Research.getAllItems().first(function (item) {
            return item.id === rawData.id;
        });

        // Nếu tìm thấy đối tượng Feature gốc:
        if (researchItemObject) {
            // Kiểm tra xem dữ liệu thô có thông tin kinh nghiệm không.
            // void 0 != rawData.experience là một cách kiểm tra an toàn hơn là chỉ !rawData.experience
            // vì rawData.experience có thể là 0.
            if (void 0 != rawData.experience) {
                // Nếu có, cập nhật kinh nghiệm của đối tượng Feature gốc.
                researchItemObject.experience = rawData.experience;
            }
            return researchItemObject; // Trả về đối tượng Feature gốc đã được cập nhật (hoặc không).
        }
        // Nếu không tìm thấy (ví dụ: mod bị thiếu), hàm sẽ ngầm trả về undefined.
    };

    // Hàm save: Chuyển đổi một đối tượng Feature trong game thành dạng dữ liệu có thể lưu trữ.
    // Chủ yếu lưu ID và kinh nghiệm (nếu có).
    FeatureSerializer.save = function (objectToSave) {
        var serializedObject = {}; // Đối tượng JSON sẽ được trả về để lưu
        serializedObject.id = objectToSave.id; // Lưu ID của Feature.

        // Nếu đối tượng Feature có thuộc tính kinh nghiệm (và nó khác undefined), lưu nó lại.
        if (void 0 != objectToSave.experience) {
            serializedObject.experience = objectToSave.experience;
        }
        return serializedObject;
    }
})();