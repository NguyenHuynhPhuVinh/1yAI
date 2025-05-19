var ResourceKeys = {};
(function () {
    // Gán ResourceKeys cho một biến cục bộ để dễ truy cập và có thể giúp tối ưu một chút (mặc dù không đáng kể trong trường hợp này)
    var resourceKeysGlobal = ResourceKeys;

    // Khởi tạo một đối tượng để chứa các khóa tài nguyên cho level 1 và các preview
    var level1AndPreviewResources = {};

    // Đường dẫn cơ sở cho hình ảnh
    var baseImagePath = "./images/";

    // Nếu game đang chạy ở độ phân giải thấp (ISLOWRES), sử dụng thư mục hình ảnh khác
    if (PlatformShim.ISLOWRES) {
        baseImagePath = "./images1366/";
    }

    // Định nghĩa các khóa tài nguyên cho Level 1 và các hình ảnh preview
    level1AndPreviewResources.Level1 = baseImagePath + "level1.png"; // Hình nền cho Level 1
    level1AndPreviewResources.PreviewChair = "./images/player/chair.png"; // Hình ảnh preview ghế
    level1AndPreviewResources.PreviewPants1 = "./images/player/pants.png"; // Hình ảnh preview quần (loại 1)
    level1AndPreviewResources.PreviewPants9 = "./images/player/pants9.png"; // Hình ảnh preview quần (loại 9)
    level1AndPreviewResources.PreviewHands1 = "./images/player/hands1.png"; // Hình ảnh preview tay (loại 1)
    level1AndPreviewResources.PreviewHands4 = "./images/player/hands4.png"; // ...
    level1AndPreviewResources.PreviewHands5 = "./images/player/hands5.png";
    level1AndPreviewResources.PreviewHands9 = "./images/player/hands9.png";
    level1AndPreviewResources.PreviewHands10 = "./images/player/hands10.png";
    level1AndPreviewResources.PreviewHands12 = "./images/player/hands12.png";
    level1AndPreviewResources.PreviewBody1 = "./images/player/body1.png"; // Hình ảnh preview thân (loại 1)
    level1AndPreviewResources.PreviewBody2 = "./images/player/body2.png"; // ...
    level1AndPreviewResources.PreviewBody3 = "./images/player/body3.png";
    level1AndPreviewResources.PreviewBody4 = "./images/player/body4.png";
    level1AndPreviewResources.PreviewBody5 = "./images/player/body5.png";
    level1AndPreviewResources.PreviewBody6 = "./images/player/body6.png";
    level1AndPreviewResources.PreviewBody7 = "./images/player/body7.png";
    level1AndPreviewResources.PreviewBody8 = "./images/player/body8.png";
    level1AndPreviewResources.PreviewBody9 = "./images/player/body9.png";
    level1AndPreviewResources.PreviewBody10 = "./images/player/body10.png";
    level1AndPreviewResources.PreviewBody11 = "./images/player/body11.png";
    level1AndPreviewResources.PreviewBody12 = "./images/player/body12.png";
    level1AndPreviewResources.PreviewHead1 = "./images/player/head1.png"; // Hình ảnh preview đầu (loại 1)
    level1AndPreviewResources.PreviewHead2 = "./images/player/head2.png"; // ...
    level1AndPreviewResources.PreviewHead3 = "./images/player/head3.png";
    level1AndPreviewResources.PreviewHead4 = "./images/player/head4.png";
    level1AndPreviewResources.PreviewHead5 = "./images/player/head5.png";
    level1AndPreviewResources.PreviewHead6 = "./images/player/head6.png";
    level1AndPreviewResources.PreviewHead7 = "./images/player/head7.png";
    level1AndPreviewResources.PreviewHead8 = "./images/player/head8.png";
    level1AndPreviewResources.PreviewHead9 = "./images/player/head9.png";
    level1AndPreviewResources.PreviewHead10 = "./images/player/head10.png";
    level1AndPreviewResources.PreviewHead11 = "./images/player/head11.png";
    level1AndPreviewResources.PreviewHead12 = "./images/player/head12.png";
    level1AndPreviewResources.PreviewDesk = "./images/player/desk.png"; // Hình ảnh preview bàn làm việc

    // Gộp các khóa tài nguyên của level 1 và preview vào đối tượng ResourceKeys toàn cục
    $.extend(resourceKeysGlobal, level1AndPreviewResources);

    // Hàm lấy danh sách tất cả các đường dẫn tài nguyên cho một hoặc nhiều level cụ thể
    // Ví dụ: resourceKeysGlobal.getLevelResources(1, 3) sẽ trả về tài nguyên của level 1 và level 3
    resourceKeysGlobal.getLevelResources = function () {
        // Mảng chứa các đối tượng tài nguyên của từng level
        // level1AndPreviewResources chứa tài nguyên level 1
        // level2Resources, level3Resources, level4Resources sẽ được định nghĩa ở dưới
        var allLevelResourceObjects = [level1AndPreviewResources, level2Resources, level3Resources, level4Resources];
        var resultResourcePaths = []; // Mảng chứa kết quả các đường dẫn tài nguyên

        // Duyệt qua các đối số (là các số thứ tự của level)
        for (var i = 0; i < arguments.length; i++) {
            var levelNumber = arguments[i]; // Lấy số thứ tự level
            // Kiểm tra nếu số thứ tự level không hợp lệ (ví dụ: yêu cầu level 5 trong khi chỉ có 4 level)
            if (allLevelResourceObjects.length < levelNumber) {
                throw new Error("invalid level: " + levelNumber); // Ném lỗi
            }
            // Lấy đối tượng tài nguyên của level tương ứng (levelNumber - 1 vì mảng bắt đầu từ 0)
            // Sau đó, gọi hàm getAllResourcePathsFromObject để lấy tất cả đường dẫn từ đối tượng đó
            // và thêm vào mảng kết quả
            resultResourcePaths.addRange(getAllResourcePathsFromObject(allLevelResourceObjects[levelNumber - 1]));
        }
        return resultResourcePaths; // Trả về mảng các đường dẫn tài nguyên
    };

    // Hàm tiện ích để lấy tất cả các giá trị (đường dẫn tài nguyên) từ một đối tượng
    var getAllResourcePathsFromObject = function (resourceObject) {
        var paths = []; // Mảng chứa các đường dẫn
        var key;
        // Duyệt qua tất cả các thuộc tính của đối tượng
        for (key in resourceObject) {
            // Kiểm tra xem thuộc tính đó có phải là của chính đối tượng không (không phải từ prototype)
            if (resourceObject.hasOwnProperty(key)) {
                paths.push(resourceObject[key]); // Thêm giá trị (đường dẫn) vào mảng
            }
        }
        return paths; // Trả về mảng các đường dẫn
    };

    // Khởi tạo các đối tượng để chứa tài nguyên cho các level khác
    var level2Resources = {};
    var level3Resources = {};
    var level4Resources = {};

    // Định nghĩa các khóa tài nguyên cho Level 2
    level2Resources.Level2 = baseImagePath + "superb/level2.png";
    level2Resources.Level2Desk = baseImagePath + "superb/level2Desk.png";
    level2Resources.Level2C1 = baseImagePath + "superb/level2C1.png"; // Có thể là Character 1 hoặc Computer 1 ở Level 2
    level2Resources.Level2C2 = baseImagePath + "superb/level2C2.png";
    level2Resources.Level2C2Keyboard = baseImagePath + "superb/level2C2Keyboard.png";
    level2Resources.Level2C3 = baseImagePath + "superb/level2C3.png";
    level2Resources.Level2C4 = baseImagePath + "superb/level2C4.png";
    // Gộp các khóa tài nguyên của level 2 vào đối tượng ResourceKeys toàn cục
    $.extend(resourceKeysGlobal, level2Resources);

    // Định nghĩa các khóa tài nguyên cho Level 3
    level3Resources.Level3 = baseImagePath + "superb/level3.png";
    level3Resources.Level3Desk = baseImagePath + "superb/level3Desk.png";
    level3Resources.Level3C1 = baseImagePath + "superb/level3C1.png";
    level3Resources.Level3C2 = baseImagePath + "superb/level3C2.png";
    level3Resources.Level3C2Keyboard = baseImagePath + "superb/level3C2Keyboard.png";
    level3Resources.Level3C3 = baseImagePath + "superb/level3C3.png";
    level3Resources.Level3C4 = baseImagePath + "superb/level3C4.png";
    // Gộp các khóa tài nguyên của level 3 vào đối tượng ResourceKeys toàn cục
    $.extend(resourceKeysGlobal, level3Resources);

    // Định nghĩa các khóa tài nguyên cho Level 4
    level4Resources.Level4 = baseImagePath + "superb/level4.png";
    level4Resources.Level4LockedLeft = baseImagePath + "superb/level4LockedLeft.png"; // Hình ảnh khu vực bên trái bị khóa ở Level 4
    level4Resources.Level4LockedRight = baseImagePath + "superb/level4LockedRight.png"; // Hình ảnh khu vực bên phải bị khóa ở Level 4
    level4Resources.Level4Desk = baseImagePath + "superb/level4Desk.png";
    level4Resources.Level4C1 = baseImagePath + "superb/level4C1.png";
    level4Resources.Level4C2 = baseImagePath + "superb/level4C2.png";
    level4Resources.Level4C2Keyboard = baseImagePath + "superb/level4C2Keyboard.png";
    level4Resources.hwDesk1 = baseImagePath + "superb/hwDesk1.png"; // Bàn làm việc cho phòng Hardware
    level4Resources.hwDesk2 = baseImagePath + "superb/hwDesk2.png";
    level4Resources.rndDesk1 = baseImagePath + "superb/rndDesk1.png"; // Bàn làm việc cho phòng R&D
    level4Resources.rndDesk2 = baseImagePath + "superb/rndDesk2.png";
    // Gộp các khóa tài nguyên của level 4 vào đối tượng ResourceKeys toàn cục
    $.extend(resourceKeysGlobal, level4Resources);
})();