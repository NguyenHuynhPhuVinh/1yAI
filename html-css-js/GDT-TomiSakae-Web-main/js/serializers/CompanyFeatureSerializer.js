// CompanyFeatureSerializer: Chịu trách nhiệm chuyển đổi dữ liệu của một "tính năng công ty" (Company Feature)
// giữa dạng đối tượng trong game và dạng có thể lưu trữ (JSON).
// "Company Feature" ở đây có thể là một phần của quá trình phát triển game hiện tại của công ty,
// ví dụ như một giai đoạn phát triển (Engine, Gameplay) hoặc một nhiệm vụ cụ thể (BugFixing).
var CompanyFeatureSerializer = {};
(function () {
    // Hàm load: Chuyển đổi dữ liệu thô (thường từ save game) thành một đối tượng Company Feature.
    CompanyFeatureSerializer.load = function (rawData) {
        var resultObject = {}; // Đối tượng kết quả sẽ được trả về
        resultObject.id = rawData.id; // ID của tính năng
        resultObject.lastUpdate = rawData.lastUpdate; // Thời điểm cập nhật cuối cùng (có thể là gameTime)
        resultObject.progress = rawData.progress; // Tiến độ hoàn thành của tính năng (0.0 đến 1.0)
        resultObject.type = rawData.type; // Loại tính năng (ví dụ: "focus", "feature")

        // Nếu dữ liệu thô có missionType, gán nó vào đối tượng kết quả
        // missionType có thể chỉ định rõ hơn loại nhiệm vụ (ví dụ: "mission", "preparation", "BugFixing")
        rawData.missionType && (resultObject.missionType = rawData.missionType);

        // Nếu dữ liệu thô có duration, gán nó vào đối tượng kết quả
        // duration là thời gian ước tính để hoàn thành tính năng này
        rawData.duration && (resultObject.duration = rawData.duration);

        return resultObject; // Trả về đối tượng Company Feature đã được xử lý
    };

    // Hàm save: Chuyển đổi một đối tượng Company Feature trong game thành dạng dữ liệu có thể lưu trữ.
    CompanyFeatureSerializer.save = function (objectToSave) {
        var serializedObject = {}; // Đối tượng JSON sẽ được trả về để lưu
        serializedObject.id = objectToSave.id;
        serializedObject.lastUpdate = objectToSave.lastUpdate;
        serializedObject.progress = objectToSave.progress;
        serializedObject.type = objectToSave.type;

        // Nếu đối tượng game có missionType, lưu nó lại
        objectToSave.missionType && (serializedObject.missionType = objectToSave.missionType);

        // Nếu đối tượng game có duration, lưu nó lại
        objectToSave.duration && (serializedObject.duration = objectToSave.duration);

        return serializedObject; // Trả về đối tượng JSON đã được chuẩn bị để lưu
    }
})();