// SpawnedPointsSerializer: Chịu trách nhiệm chuyển đổi dữ liệu của các "điểm được tạo ra" (Spawned Points)
// trong quá trình phát triển game (ví dụ: điểm design, tech, bug).
// Việc này đảm bảo trạng thái của các điểm đang "bay" trên màn hình được lưu lại khi save game.
var SpawnedPointsSerializer = {};
(function () {
    // Hàm load: Chuyển đổi dữ liệu thô của một spawned point thành đối tượng spawned point.
    // Trong trường hợp này, các thuộc tính được sao chép trực tiếp vì không có xử lý phức tạp.
    SpawnedPointsSerializer.load = function (rawData) {
        var resultObject = {};
        resultObject.duration = rawData.duration;   // Thời gian tồn tại của animation điểm
        resultObject.id = rawData.id;           // ID duy nhất của điểm (có thể để quản lý animation)
        resultObject.type = rawData.type;         // Loại điểm (ví dụ: 'd' cho design, 't' cho tech, 'b' cho bug, 'r' cho research)
        resultObject.gameTime = rawData.gameTime;   // Thời điểm trong game mà điểm này được tạo ra
        resultObject.delay = rawData.delay;       // Thời gian trì hoãn trước khi animation bắt đầu (nếu có)
        return resultObject;
    };

    // Hàm save: Chuyển đổi một đối tượng Spawned Point trong game thành dạng dữ liệu có thể lưu trữ.
    // Các thuộc tính cũng được sao chép trực tiếp.
    SpawnedPointsSerializer.save = function (objectToSave) {
        var serializedObject = {};
        serializedObject.duration = objectToSave.duration;
        serializedObject.id = objectToSave.id;
        serializedObject.type = objectToSave.type;
        serializedObject.gameTime = objectToSave.gameTime;
        serializedObject.delay = objectToSave.delay;
        return serializedObject;
    }
})();