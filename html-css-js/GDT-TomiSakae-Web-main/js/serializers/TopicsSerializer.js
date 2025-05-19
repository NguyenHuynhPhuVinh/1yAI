// TopicsSerializer: Chịu trách nhiệm chuyển đổi dữ liệu của các "chủ đề game" (Topics)
// giữa dạng đối tượng trong game và dạng có thể lưu trữ (JSON).
// Ví dụ: Fantasy, Sci-Fi, Sports.
var TopicsSerializer = {};
(function () {
    // Hàm load: Tìm và trả về đối tượng Topic đầy đủ từ danh sách tất cả các chủ đề được định nghĩa sẵn
    // dựa trên ID được cung cấp trong dữ liệu thô.
    TopicsSerializer.load = function (rawData) {
        // Topics.topics là một mảng chứa tất cả các đối tượng chủ đề game.
        return Topics.topics.first(function (topicItem) {
            // So sánh ID của chủ đề với ID trong dữ liệu thô.
            return topicItem.id === rawData.id;
        });
    };

    // Hàm save: Chuyển đổi một đối tượng Topic trong game thành dạng dữ liệu chỉ chứa ID để lưu trữ.
    TopicsSerializer.save = function (objectToSave) {
        var serializedObject = {};
        // Chỉ lưu ID của chủ đề, vì thông tin chi tiết (tên, sự phù hợp thể loại, etc.)
        // đã được định nghĩa sẵn và có thể tra cứu lại khi load.
        serializedObject.id = objectToSave.id;
        return serializedObject;
    }
})();