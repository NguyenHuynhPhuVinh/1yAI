// PlatformsSerializer: Chịu trách nhiệm chuyển đổi dữ liệu của các "nền tảng game" (Platforms)
// giữa dạng đối tượng trong game và dạng có thể lưu trữ (JSON).
// Ví dụ: PC, G64, TES, hoặc các console tùy chỉnh do người chơi tạo ra.
var PlatformsSerializer = {};
(function () {
    // Hàm load: Chuyển đổi dữ liệu thô của một nền tảng thành đối tượng nền tảng hoàn chỉnh.
    PlatformsSerializer.load = function (rawData) {
        // Nếu nền tảng là "custom" (do người chơi tạo ra), dữ liệu thô đã chứa tất cả thông tin cần thiết.
        if (rawData.isCustom) {
            return rawData; // Trả về trực tiếp đối tượng rawData.
        }

        // Nếu không phải custom, tìm nền tảng gốc trong danh sách tất cả các nền tảng được định nghĩa sẵn.
        var platformObject = Platforms.allPlatforms.first(function (platform) {
            return platform.id === rawData.id;
        });

        // Nếu không tìm thấy nền tảng (có thể do mod bị thiếu hoặc lỗi dữ liệu), ghi log lỗi.
        if (!platformObject) {
            Logger.LogError("Could not load platform with id {0} - perhaps a mod is missing?".format(rawData.id));
        }
        return platformObject; // Trả về đối tượng nền tảng gốc (hoặc null/undefined nếu không tìm thấy).
    };

    // Hàm save: Chuyển đổi một đối tượng Platform trong game thành dạng dữ liệu có thể lưu trữ.
    PlatformsSerializer.save = function (objectToSave) {
        // Nếu nền tảng là "custom", lưu toàn bộ đối tượng vì nó chứa thông tin đặc thù.
        if (objectToSave.isCustom) {
            return objectToSave;
        }

        // Nếu là nền tảng định nghĩa sẵn, chỉ cần lưu ID.
        var serializedObject = {};
        serializedObject.id = objectToSave.id;
        return serializedObject;
    }
})();