// Định nghĩa một đối tượng toàn cục để quản lý ngôn ngữ
var LanguageMgr = {};

// Sử dụng IIFE (Immediately Invoked Function Expression) để tạo một scope riêng,
// tránh làm ô nhiễm global scope và cho phép sử dụng biến cục bộ `languageManagerInstance`.
(function () {
    // Tạo một alias (tham chiếu ngắn gọn) đến đối tượng LanguageMgr
    // để code bên trong IIFE dễ đọc và viết hơn.
    var languageManagerInstance = LanguageMgr;

    // languageManagerInstance.map: Một đối tượng ánh xạ tên ngôn ngữ đầy đủ (thường từ Steam)
    // sang mã ngôn ngữ được sử dụng trong game (ví dụ: 'brazilian' -> 'ptbr').
    // Điều này giúp chuẩn hóa mã ngôn ngữ.
    languageManagerInstance.map = {
        brazilian: "ptbr",
        bulgarian: "en", // Mặc định về tiếng Anh nếu không có bản dịch tiếng Bulgaria
        czech: "cs",
        danish: "en",   // Mặc định về tiếng Anh
        dutch: "nl",
        english: "en",
        finnish: "en",  // Mặc định về tiếng Anh
        french: "fr",
        german: "de",
        greek: "el",
        hungarian: "hu",
        italian: "it",
        japanese: "en", // Mặc định về tiếng Anh
        koreana: "en",  // Mặc định về tiếng Anh (có thể là 'korean')
        norwegian: "en",// Mặc định về tiếng Anh
        polish: "pl",
        portuguese: "en",// Mặc định về tiếng Anh (khác với 'brazilian' là 'ptbr')
        romanian: "en", // Mặc định về tiếng Anh
        russian: "ru",
        schinese: "zhcn", // Tiếng Trung giản thể
        spanish: "es",
        swedish: "sv",
        tchinese: "zhcn", // Tiếng Trung phồn thể cũng được map về giản thể (có thể cần xem xét lại)
        thai: "en",     // Mặc định về tiếng Anh
        turkish: "tr",
        ukrainian: "uk",
        vietnamese: "vi"
    };

    // languageManagerInstance.gameLanguage: Lưu trữ ngôn ngữ hiện tại của game.
    // Được lấy từ cài đặt ưu tiên của người chơi thông qua GameManager.
    languageManagerInstance.gameLanguage = GameManager.getPreferredLanguage();

    // languageManagerInstance.steamGameLanguage: Ngôn ngữ mặc định trên Steam (nếu có).
    languageManagerInstance.steamGameLanguage = "english";

    // languageManagerInstance.storedSteamGameLanguage: Ngôn ngữ Steam đã được lưu trữ trước đó.
    // Dùng để so sánh và cập nhật nếu ngôn ngữ Steam thay đổi.
    languageManagerInstance.storedSteamGameLanguage = DataStore.getValue("steamlanguage");

    // languageManagerInstance.init: Hàm khởi tạo, thiết lập ngôn ngữ cho game.
    languageManagerInstance.init = function () {
        // Kiểm tra xem game có đang chạy trên Steam không (thông qua cờ GameFlags.IS_STEAM)
        if (GameFlags.IS_STEAM) {
            // Nếu Steam API khả dụng
            if (Steam.isAvailable()) {
                // Lấy ngôn ngữ hiện tại của Steam
                languageManagerInstance.steamGameLanguage = Steam.getCurrentGameLanguage();

                // Nếu ngôn ngữ Steam hiện tại khác với ngôn ngữ Steam đã lưu trữ
                if (languageManagerInstance.steamGameLanguage != languageManagerInstance.storedSteamGameLanguage) {
                    // Cập nhật ngôn ngữ Steam đã lưu trữ
                    languageManagerInstance.storedSteamGameLanguage = languageManagerInstance.steamGameLanguage;
                    // Lưu lại vào DataStore
                    DataStore.setValue("steamlanguage", languageManagerInstance.storedSteamGameLanguage);

                    // Nếu ngôn ngữ game hiện tại không khớp với ngôn ngữ Steam được map
                    // (ví dụ: game đang là 'fr' nhưng Steam là 'german' -> map thành 'de')
                    // thì cập nhật ngôn ngữ game theo ngôn ngữ Steam.
                    if (languageManagerInstance.gameLanguage != languageManagerInstance.map[languageManagerInstance.storedSteamGameLanguage]) {
                        languageManagerInstance.gameLanguage = languageManagerInstance.map[languageManagerInstance.storedSteamGameLanguage];
                    }
                }
            }
            // Thiết lập ngôn ngữ ưu tiên trong GameManager dựa trên ngôn ngữ đã xác định (có thể từ Steam hoặc từ cài đặt trước đó)
            GameManager.setPreferredLanguage(languageManagerInstance.gameLanguage);
        }
        // Cuối cùng, áp dụng ngôn ngữ đã chọn cho hệ thống Localization của game.
        Localization.setLanguage(GameManager.getPreferredLanguage());
    }
})(); // Kết thúc IIFE

// Gọi hàm init của LanguageMgr để thực hiện việc thiết lập ngôn ngữ ngay khi file này được tải.
LanguageMgr.init();