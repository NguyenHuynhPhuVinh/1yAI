// Khởi tạo namespace GameDev và đối tượng ResourceManager bên trong nó.
// ResourceManager sẽ chịu trách nhiệm quản lý việc tải và loại bỏ tài nguyên của game.
var GameDev = {
    ResourceManager: {}
};

(function () {
    // Tạo một alias (bí danh) ngắn hơn cho GameDev.ResourceManager để dễ sử dụng trong scope của IIFE này.
    // 'rm' giờ đây sẽ tham chiếu đến GameDev.ResourceManager.
    var resourceManager = GameDev.ResourceManager; // Đổi tên 'rm' thành 'resourceManager' cho rõ nghĩa

    // Một đối tượng để lưu trữ các tài nguyên đã được tải.
    // Khóa (key) là đường dẫn/ID của tài nguyên, giá trị (value) là đối tượng tài nguyên đã tải (ví dụ: đối tượng Image).
    resourceManager.resources = {};

    /**
     * Đảm bảo rằng một danh sách các tài nguyên đã được tải.
     * Nếu tài nguyên chưa được tải, nó sẽ được thêm vào hàng đợi tải.
     * Sau khi tất cả tài nguyên cần thiết đã được tải (hoặc nếu chúng đã có sẵn), hàm callback sẽ được gọi.
     * @param {string[]} resourcePaths - Mảng các đường dẫn hoặc ID của tài nguyên cần tải.
     * @param {function} onCompleteCallback - Hàm callback sẽ được gọi khi tất cả tài nguyên đã sẵn sàng.
     */
    resourceManager.ensureResources = function (resourcePaths, onCompleteCallback) { // Đổi tên 'a' thành 'resourcePaths', 'b' thành 'onCompleteCallback'
        // Nếu không có tài nguyên nào cần tải, gọi ngay callback và thoát.
        if (0 == resourcePaths.length) {
            onCompleteCallback();
            return; // Thêm return để thoát sớm
        }

        // Tạo một instance của html5Preloader để quản lý việc tải.
        var preloader = new html5Preloader(); // Đổi tên 'c' thành 'preloader'
        var hasNewResourcesToLoad = false; // Đổi tên 'f' thành 'hasNewResourcesToLoad', khởi tạo rõ ràng

        // Biến 'i' và 'length' được sử dụng trong vòng lặp for bên dưới.
        // Khai báo chúng bằng 'let' để giới hạn scope trong vòng lặp (thực tế với 'var' thì không, nhưng đây là thói quen tốt).
        // Tuy nhiên, code gốc dùng 'var' và gán lại ở nhiều nơi, nên giữ nguyên 'var' để tránh lỗi không mong muốn khi refactor.
        var resourceIndex = 0; // Đổi tên 'i' thành 'resourceIndex'
        var pathCount = resourcePaths.length; // Đổi tên 'length' thành 'pathCount'

        // Lặp qua danh sách các đường dẫn tài nguyên.
        for (resourceIndex = 0; resourceIndex < pathCount; resourceIndex++) {
            var currentPath = resourcePaths[resourceIndex]; // Đổi tên 'd' thành 'currentPath'
            // Nếu đường dẫn hợp lệ và tài nguyên chưa có trong cache (resourceManager.resources).
            if (currentPath && !resourceManager.resources[currentPath]) {
                preloader.addFiles(currentPath); // Thêm tài nguyên vào hàng đợi tải của preloader.
                hasNewResourcesToLoad = true;    // Đánh dấu rằng có ít nhất một tài nguyên mới cần tải.
            }
        }

        // Nếu có tài nguyên mới cần tải.
        if (hasNewResourcesToLoad) {
            // Xử lý lỗi khi tải.
            preloader.onerror = function (errorDetails) { // Đổi tên 'a' thành 'errorDetails'
                // Hiển thị lỗi cho người dùng.
                // LƯU Ý: alert() có thể không phải là cách tốt nhất để xử lý lỗi trong game.
                alert(errorDetails);
            };
            // Khi tất cả tài nguyên trong preloader đã được tải xong.
            preloader.onfinish = function () {
                // Reset lại biến lặp và độ dài mảng (có thể không cần thiết nếu khai báo 'let' trong for).
                resourceIndex = 0;
                // pathCount đã được khai báo ở trên
                // Lặp lại qua danh sách tài nguyên để lưu trữ chúng vào cache nếu chưa có.
                for (resourceIndex = 0; resourceIndex < pathCount; resourceIndex++) {
                    var pathBeingProcessed = resourcePaths[resourceIndex]; // Đổi tên 'd' thành 'pathBeingProcessed'
                    // Nếu tài nguyên chưa có trong cache, lấy nó từ preloader và lưu vào cache.
                    if (!resourceManager.resources[pathBeingProcessed]) {
                        resourceManager.resources[pathBeingProcessed] = preloader.getFile(pathBeingProcessed);
                    }
                }
                // Gọi hàm callback báo hiệu đã hoàn tất.
                onCompleteCallback();
            };
            // preloader.start(); // Giả định rằng preloader có phương thức start() hoặc tự động bắt đầu tải.
            // Code gốc không có lệnh start, có thể html5Preloader tự động bắt đầu.
        } else {
            // Nếu không có tài nguyên mới nào cần tải (tất cả đã có trong cache), gọi ngay callback.
            onCompleteCallback();
        }
    };

    /**
     * Loại bỏ một danh sách các tài nguyên khỏi cache.
     * Điều này giúp giải phóng bộ nhớ khi tài nguyên không còn cần thiết.
     * @param {string[]} resourcePathsToRemove - Mảng các đường dẫn hoặc ID của tài nguyên cần loại bỏ.
     */
    resourceManager.removeResources = function (resourcePathsToRemove) { // Đổi tên 'a' thành 'resourcePathsToRemove'
        // Lặp qua danh sách tài nguyên cần loại bỏ.
        for (var i = 0; i < resourcePathsToRemove.length; i++) { // Giữ 'i' vì nó phổ biến cho index, hoặc đổi thành 'resourceIdx'
            var pathToRemove = resourcePathsToRemove[i]; // Đổi tên 'c' thành 'pathToRemove'
            // Kiểm tra xem tài nguyên có tồn tại trong cache không.
            // hasOwnProperty() được dùng để đảm bảo chỉ xóa thuộc tính của chính đối tượng, không phải từ prototype.
            if (resourceManager.resources.hasOwnProperty(pathToRemove)) {
                // Gán undefined để đánh dấu là đã loại bỏ (hoặc có thể dùng delete resourceManager.resources[pathToRemove]).
                resourceManager.resources[pathToRemove] = undefined;
            }
        }
    };
})();