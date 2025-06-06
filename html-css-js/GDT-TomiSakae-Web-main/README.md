# Game Dev Tycoon - Phân Tích Mã Nguồn (Phiên bản TomiSakae)

Tài liệu này cung cấp một cái nhìn tổng quan về cấu trúc mã nguồn của trò chơi Game Dev Tycoon, dựa trên phiên bản đã được TomiSakae tùy chỉnh và các file JavaScript được tách nhỏ từ mã nguồn gốc.

## Giới Thiệu Chung

Game Dev Tycoon là một trò chơi mô phỏng kinh doanh, nơi người chơi thành lập và điều hành một công ty phát triển game. Trò chơi bao gồm các yếu tố quản lý tài chính, nhân sự, nghiên cứu công nghệ, phát triển sản phẩm, và tương tác với thị trường game ảo.

Mã nguồn được viết bằng JavaScript, sử dụng các thư viện như jQuery, EaselJS (cho đồ họa 2D), GreenSock (cho animation), và có khả năng tích hợp với Steam API thông qua Greenworks. Phiên bản này đã được TomiSakae điều chỉnh và các file JavaScript được tổ chức lại để dễ quản lý hơn.

## Cấu Trúc Dự Án

Dưới đây là cấu trúc thư mục chính của dự án:

- **`index.html`**: File HTML trung tâm, khởi chạy ứng dụng, tải các tài nguyên CSS, JavaScript và định nghĩa cấu trúc DOM cho UI.
- **`css/`**: Chứa các file CSS cho giao diện người dùng, bao gồm:
  - `font-awesome.css`: Bộ icon.
  - `jquery.ui.all.css` & `jquery-ui.css`: Style cho jQuery UI.
  - `simplemodal.css`: Style cho dialog modal.
  - `default.css`, `layout.css`, `achievements.css`, `popoutDialog.css`, `greenworks.css`: Các style tùy chỉnh của game.
  - `tailwindcss/output.css`: Style từ Tailwind CSS.
- **`libs/`**: Chứa các thư viện JavaScript của bên thứ ba (jQuery, EaselJS, TweenJS, SoundJS, PreloadJS, Mersenne Twister, GreenSock, JSZip, RequireJS, mkdirp, RoyalSlider).
- **`i18n/`**: Chứa các file liên quan đến đa ngôn ngữ.
  - `languages.js`: Định nghĩa các ngôn ngữ được hỗ trợ và có thể chứa các chuỗi dịch hoặc cấu hình.
- **`js/`**: Chứa mã nguồn JavaScript chính của game, được chia thành các thư mục con theo chức năng:
  - `core/`: Các thành phần cốt lõi, tiện ích cơ bản của game.
  - `reporting/`: Module xử lý báo cáo lỗi.
  - `localization/`: Hệ thống đa ngôn ngữ.
  - `game/`: Logic chính của trò chơi, bao gồm:
    - `classes/`: Định nghĩa các lớp đối tượng cơ bản (Company, Game, Character, v.v.).
    - `content/`: Dữ liệu nội dung game (Media, Missions, Platforms, Topics).
    - `logic/`: Các module xử lý logic game cụ thể (GameTrends, Notification, Character logic).
    - `mechanics/`: Các cơ chế gameplay (Reviews, Sales, Contracts).
    - `utils/`: Các hàm tiện ích cho game (LevelCalculator, SavegameMigrator).
  - `platform/`: Các module tương tác với nền tảng (Steam API).
  - `system/`: Các module hệ thống (DataStore, LanguageManager, SoundManager, Startup).
  - `ui/`: Quản lý giao diện người dùng, bao gồm:
    - `elements/`: Các thành phần UI tái sử dụng (SettingsGameplay, FlippingCounter, Knowledge).
    - Các file `UIManager.*.js`: Quản lý các phần cụ thể của UI.
  - `visuals/`: Quản lý đồ họa, animation và hiển thị trên canvas.
    - `animations/`: Các lớp và dữ liệu liên quan đến animation.
  - `serializers/`: Xử lý việc chuyển đổi đối tượng game sang/từ định dạng lưu trữ.
- **`mods/`**: Hỗ trợ modding.
  - `mods_manifest.js`: Khai báo các mod.
- **`GDT.js`**: Có thể là một file chứa các hàm khởi tạo chính hoặc đối tượng global của game.
- **`modSupport.js`**: Module quản lý và tích hợp mod.

## Mô Tả Chi Tiết Các Module/File JavaScript

Các module được liệt kê theo thứ tự tải trong `index.html` và được nhóm theo chức năng logic.

---

### 1. Khởi tạo và Cấu hình Cơ bản

- **`i18n/languages.js`**:
  - **Chức năng**: Định nghĩa các ngôn ngữ được hỗ trợ (`Languages` object) và có thể chứa các chuỗi dịch cơ bản hoặc cấu hình cho hệ thống đa ngôn ngữ.
  - **Phụ thuộc**: Không có.
  - **Được sử dụng bởi**: `Localization.js`, `LanguageManager.js`.

#### `js/core/`

- **`GameFlags.js`**:
  - **Chức năng**: Định nghĩa đối tượng `GameFlags` chứa các cờ (boolean) và hằng số (number) cấu hình toàn cục. Các cờ này điều khiển các tính năng gameplay (ví dụ: `TUTORIAL_DISABLED`, `CONFERENCE_DISABLED`), các yếu tố cân bằng game (ví dụ: `SMALL_GAME_DURATION_FACTOR`), và các tùy chọn debug (`SHOW_FPS`).
  - **Phụ thuộc**: Không có.
  - **Được sử dụng bởi**: Hầu hết các module khác để kiểm tra trạng thái hoặc lấy giá trị cấu hình.
- **`CoreExtensions.js`**:
  - **Chức năng**: Mở rộng các đối tượng JavaScript gốc (`String`, `Number`, `Array`) và `jQuery.fn` bằng cách thêm các phương thức tiện ích. Ví dụ: `String.prototype.format`, `String.prototype.localize`, `Array.prototype.pickRandom`, `Number.prototype.clamp`.
  - **Phụ thuộc**: jQuery (cho `jQuery.fn`).
  - **Được sử dụng bởi**: Toàn bộ mã nguồn của game.
- **`Logger.js`**:
  - **Chức năng**: Cung cấp một hệ thống ghi log (`Logger` object) cho việc gỡ lỗi, ghi nhận lỗi (Error, Warning, Info) và thông tin mod. Có khả năng lưu log lỗi vào `DataStore`.
  - **Phụ thuộc**: `DataStore.js`, `PlatformShim.js` (để hiển thị alert), `GameManager.js` (để kiểm tra mod).
  - **Được sử dụng bởi**: Nhiều module khi cần ghi nhận sự kiện, lỗi hoặc cảnh báo.
- **`PlatformShim.js`**:
  - **Chức năng**: Tạo lớp trừu tượng (`PlatformShim` object) để xử lý các chức năng đặc thù của nền tảng (ví dụ: Windows 8 Store App, NW.js). Cung cấp API nhất quán cho việc truy cập tên người dùng, mở URL, hiển thị alert, quản lý fullscreen, lấy phiên bản ứng dụng, v.v.
  - **Phụ thuộc**: `GameFlags.js`, `Logger.js`, `ErrorReporting.js`.
  - **Được sử dụng bởi**: Hầu hết các module cần tương tác với hệ điều hành hoặc các API nền tảng.

#### `js/reporting/`

- **`ErrorReporting.js`**:
  - **Chức năng**: Module (`ErrorReporting` object) xử lý việc gửi báo cáo lỗi. Hiện tại, hàm `report` là một placeholder.
  - **Phụ thuộc**: Không có.
  - **Được sử dụng bởi**: `PlatformShim.js` (khi có lỗi không mong muốn trên WinJS).

#### `js/localization/`

- **`Localization.js`**:
  - **Chức năng**: Chịu trách nhiệm chính cho việc đa ngôn ngữ (`Localization` object). Quản lý từ điển các chuỗi dịch, cung cấp hàm `localize` để lấy chuỗi đã dịch, và xử lý việc áp dụng bản dịch cho các element HTML.
  - **Phụ thuộc**: `CoreExtensions.js` (cho `String.prototype.localize`), `i18n/languages.js`, `PlatformShim.js`, `GameManager.js` (để lấy ngôn ngữ ưu tiên).
  - **Được sử dụng bởi**: `LanguageManager.js`, hầu hết các module `UI` để hiển thị văn bản.

---

### 2. Quản Lý Game và Hệ Thống Cơ Bản

#### `js/game/`

- **`GameManagerStates.js`**:
  - **Chức năng**: Định nghĩa đối tượng `State` chứa các hằng số chuỗi đại diện cho các trạng thái chính của vòng lặp game (ví dụ: `Idle`, `CreateGame`, `ExecuteWorkItems`).
  - **Phụ thuộc**: Không có.
  - **Được sử dụng bởi**: `GameManager.js`.
- **`GameManager.js`**:
  - **Chức năng**: Module trung tâm (`GameManager` object) điều khiển luồng chính của game. Quản lý trạng thái game, vòng lặp cập nhật game (game tick), xử lý việc bắt đầu game mới, lưu/tải game, quản lý công ty người chơi, các dự án đang phát triển (game, engine, contract, R&D, hardware).
  - **Phụ thuộc**: `GameManagerStates.js` (`State`), `GameFlags.js`, `CoreExtensions.js`, `Logger.js`, `PlatformShim.js`, `SteamAPI.js`, `DataStore.js`, `LanguageManager.js`, `SoundManager.js`, `Company.js`, `Game.js`, `Character.js`, `Notification.js`, `General.js`, `Missions.js`, `Research.js`, `Sales.js`, `Reviews.js`, `ProjectContracts.js`, `UI` (các module con), `VisualsManager.js`.
  - **Được sử dụng bởi**: `StartupAndSplash.js` (để khởi tạo), các module `UI` (để kích hoạt hành động game).

#### `js/platform/`

- **`SteamAPI.js`**:
  - **Chức năng**: Đóng gói các tương tác với Steamworks API (`Steam` object), sử dụng thư viện Greenworks (nếu có). Bao gồm các chức năng như lưu/đọc file trên Steam Cloud, kích hoạt achievement, lấy ngôn ngữ game hiện tại trên Steam.
  - **Phụ thuộc**: `PlatformShim.js` (kiểm tra không phải Win8), `GameFlags.js`, `Logger.js`.
  - **Được sử dụng bởi**: `DataStore.js` (cho Steam Cloud), `LanguageManager.js`, `AchievementsData.js`, `SteamGreenworks.js`.

#### `js/system/`

- **`DataStore.js`**:
  - **Chức năng**: Quản lý việc lưu và tải dữ liệu game (`DataStore` object). Hỗ trợ nhiều phương thức lưu trữ: localStorage (cho web/NW.js), Windows Roaming Settings (cho Win8), và Steam Cloud (nếu có). Lưu cài đặt game, achievement, và các slot save game.
  - **Phụ thuộc**: `PlatformShim.js`, `SteamAPI.js`, `Logger.js`, `Knowledge.js` (để merge knowledge).
  - **Được sử dụng bởi**: `GameManager.js` (save/load game), `Logger.js` (lưu log lỗi), `Knowledge.js` (lưu kiến thức người chơi), `SettingsGameplay.js` (lưu cài đặt).
- **`LanguageManager.js`**:
  - **Chức năng**: Quản lý việc chọn và áp dụng ngôn ngữ cho game (`LanguageMgr` object). Có thể tự động chọn ngôn ngữ dựa trên cài đặt Steam hoặc cho phép người chơi chọn.
  - **Phụ thuộc**: `GameManager.js` (để get/set ngôn ngữ ưu tiên), `SteamAPI.js`, `Localization.js`, `DataStore.js` (lưu ngôn ngữ đã chọn).
  - **Được sử dụng bởi**: `StartupAndSplash.js` (khi khởi động).
- **`ResourceKeys.js`**:
  - **Chức năng**: Định nghĩa một đối tượng `ResourceKeys` chứa các key và đường dẫn tới các file tài nguyên đồ họa của game (chủ yếu là ảnh PNG cho các level văn phòng, nhân vật).
  - **Phụ thuộc**: `PlatformShim.js` (để chọn ảnh low-res nếu cần).
  - **Được sử dụng bởi**: `GameResourceManager.js`, `VisualsManager.js`, `UIManager.NewGameAndLoadSave.js` (cho preview nhân vật).

#### `js/ui/`

- **`CustomAlert.js`**:
  - **Chức năng**: Tạo ra các hộp thoại thông báo (`CustomAlert` object) tùy chỉnh với nhiều kiểu (INFO, WARN, ERR, SUCC, TUT, HINT), thay thế cho `alert` mặc định của trình duyệt.
  - **Phụ thuộc**: jQuery.
  - **Được sử dụng bởi**: `StartupAndSplash.js` (ghi đè `window.alert`), `Logger.js`.

#### `js/system/` (tiếp theo)

- **`StartupAndSplash.js`**:
  - **Chức năng**: Xử lý quá trình khởi động game (`Startup` và `SplashScreen` objects). Hiển thị màn hình chờ (splash screen), kiểm tra EULA, tải các tài nguyên cơ bản, khởi tạo các module chính, và quyết định bắt đầu game mới hoặc tiếp tục game đã lưu.
  - **Phụ thuộc**: `PlatformShim.js`, `GameManager.js`, `UI` (các module con), `DataStore.js`, `SoundManager.js`, `GameResourceManager.js`, `LanguageManager.js`, `Logger.js`, `CustomAlert.js`, `GameFlags.js`.
  - **Được sử dụng bởi**: `index.html` (là điểm khởi đầu của logic game sau khi các thư viện được tải).
- **`SoundManager.js`**:
  - **Chức năng**: Quản lý việc tải và phát các hiệu ứng âm thanh, nhạc nền (`Sound` object) sử dụng thư viện SoundJS. Cho phép người chơi tùy chỉnh âm lượng, bật/tắt âm thanh, nhạc.
  - **Phụ thuộc**: SoundJS, `DataStore.js` (để lưu cài đặt âm thanh), `GameFlags.js`, `GameManager.js` (để lấy level công ty cho nhạc nền).
  - **Được sử dụng bởi**: Hầu hết các module khác khi cần phát âm thanh.

---

### 3. Đồ Họa và Tài Nguyên Game

#### `js/visuals/`

- **`CanvasManager.js`**:
  - **Chức năng**: Khởi tạo và quản lý các đối tượng canvas HTML5 (`CanvasManager` object) dùng để vẽ đồ họa cho game, bao gồm canvas cho nền (background), lớp phủ nền, nhân vật, và lớp tiền cảnh (foreground). Hỗ trợ việc thay đổi kích thước canvas và quản lý các màn hình phụ (trái/phải cho lab).
  - **Phụ thuộc**: `PlatformShim.js`, `GameManager.js` (để kiểm tra frame skip).
  - **Được sử dụng bởi**: `StartupAndSplash.js` (khởi tạo), `VisualsManager.js`.
- **`GameResourceManager.js`**:
  - **Chức năng**: Quản lý việc tải và truy cập các tài nguyên đồ họa (chủ yếu là hình ảnh) cho game (`GameDev.ResourceManager` object), sử dụng thư viện `html5Preloader.js`.
  - **Phụ thuộc**: `html5Preloader.js`, `ResourceKeys.js`.
  - **Được sử dụng bởi**: `StartupAndSplash.js`, `VisualsManager.js`, `UIManager.NewGameAndLoadSave.js` (cho preview nhân vật).

---

### 4. Các Lớp Đối Tượng Game và Logic Cốt Lõi

#### `js/game/classes/`

- **`Booth.js`**:
  - **Chức năng**: Định nghĩa lớp `Booth`, đại diện cho một gian hàng tại hội chợ game (G3). Chứa thông tin về ID, tên, hệ số gian hàng, mô tả, chi phí, và các hình ảnh liên quan.
  - **Phụ thuộc**: `CoreExtensions.js` (cho `localize`).
  - **Được sử dụng bởi**: `Company.js` (mỗi công ty có danh sách các booth).
- **`Company.js`**:
  - **Chức năng**: Định nghĩa lớp `Company`, là đối tượng trung tâm lưu trữ toàn bộ thông tin về công ty của người chơi: tên, tiền, fan, lịch sử game, nhân viên, các nghiên cứu đã hoàn thành, các engine đã tạo, v.v. Chứa các hàm tiện ích để quản lý tài sản và trạng thái công ty.
  - **Phụ thuộc**: `Game.js`, `Character.js`, `Booth.js`, `PlatformShim.js`, `GameManager.js` (để lấy GUID, hằng số), `TopicsSerializer.js`, `PlatformsSerializer.js`, `EngineSerializer.js`, `FeatureSerializer.js`, `Character.js` (cho save/load), `Notification.js`, `Research.js`, `Media.js`, `DecisionNotifications.js`, `MersenneTwister.js`, `LevelCalculator.js`.
  - **Được sử dụng bởi**: `GameManager.js` (là đối tượng chính mà `GameManager` quản lý).
- **`Game.js`**:
  - **Chức năng**: Định nghĩa lớp `Game`, chứa thông tin về một tựa game đang phát triển hoặc đã phát hành (ID, tên, chủ đề, thể loại, nền tảng, engine, điểm số, doanh thu, chi phí, lỗi, hype, v.v.).
  - **Phụ thuộc**: `GameManager.js` (GUID), `GameState.js`, `Topics.js`, `GameGenre.js`, `Missions.js`, `CompanyFeatureSerializer.js`, `FeatureSerializer.js`, `Platforms.js`, `Sales.js`, `SalesEvents.js`.
  - **Được sử dụng bởi**: `Company.js` (trong `gameLog`, `currentGame`), `GameManager.js`.
- **`GameState.js`**:
  - **Chức năng**: Định nghĩa đối tượng `GameState` chứa các hằng số đại diện cho các trạng thái của một tựa game trong quá trình phát triển và sau phát hành (ví dụ: `notStarted`, `concept`, `development`, `released`).
  - **Phụ thuộc**: Không có.
  - **Được sử dụng bởi**: `Game.js`.
- **`GameGenre.js`**:
  - **Chức năng**: Định nghĩa đối tượng `GameGenre` chứa các thể loại game (`Action`, `RPG`, `Simulation`, v.v.) và các hàm để lấy hệ số tương thích (golden ratio, weighting) giữa thể loại và các yếu tố khác như chủ đề, nền tảng.
  - **Phụ thuộc**: `Genre.js`, `CoreExtensions.js` (cho `localize`).
  - **Được sử dụng bởi**: `Game.js`, `Topics.js`, `Platforms.js`, `Knowledge.js`, `Missions.js`.
- **`Genre.js`**:
  - **Chức năng**: Lớp cơ bản cho `GameGenre`, chủ yếu chứa tên của thể loại và các hàm save/load (dù không phức tạp).
  - **Phụ thuộc**: Không có.
  - **Được sử dụng bởi**: `GameGenre.js`.

#### `js/game/logic/`

- **`GameTrends.js`**:
  - **Chức năng**: Xử lý logic về các xu hướng thị trường game (`GameTrends` object). Các xu hướng có thể là về thể loại, chủ đề mới, đối tượng người chơi, hoặc các tổ hợp lạ. Ảnh hưởng đến điểm số hoặc doanh thu của game.
  - **Phụ thuộc**: `GameManager.js` (để lấy tuần hiện tại, RNG), `General.js` (để lấy danh sách genre khả dụng), `Notification.js`, `Media.js`.
  - **Được sử dụng bởi**: `GameManager.js` (trong vòng lặp tuần), `UIManager.StatusBar.js`.
- **`Notification.js`**:
  - **Chức năng**: Định nghĩa lớp `Notification` và các loại thông báo (`NotificationType`). Các thông báo có thể tự động bật lên, hiển thị ở sidebar, hoặc yêu cầu quyết định từ người chơi. Có thể chứa các hành động (actions) được áp dụng khi thông báo được xử lý.
  - **Phụ thuộc**: `GameManager.js` (GUID), `DataStore.js` (lưu cài đặt hiển thị), `AchievementsData.js`.
  - **Được sử dụng bởi**: Hầu hết các module khi cần thông báo cho người chơi.
- **`SaveGameData.js`**:
  - **Chức năng**: Định nghĩa lớp `SaveGameData` và hàm `parseFromHeaderData` để tạo thông tin tóm tắt (header) của một file save. Thông tin này dùng để hiển thị trong danh sách load/save game (tên công ty, tiền, fan, tuần, ngày lưu).
  - **Phụ thuộc**: `Company.js` (cho hàm `getDate`).
  - **Được sử dụng bởi**: `DataStore.js`, `UIManager.NewGameAndLoadSave.js`.
- **`Character.js`**:
  - **Chức năng**: Định nghĩa lớp `Character` (nhân vật/nhân viên), các trạng thái của nhân vật (`CharacterState`), và hướng nhân vật (`CharacterOrientation`). Quản lý các thuộc tính như kỹ năng (design, tech, speed, research), kinh nghiệm, lương, hiệu suất, boost, và các hành động như làm việc, nghiên cứu, huấn luyện, đi nghỉ.
  - **Phụ thuộc**: `GameFlags.js`, `LevelCalculator.js`, `VisualsManager.js`, `GameManager.js` (để lấy thông tin game/project hiện tại), `Training.js`, `Missions.js`, `General.js`, `SoundManager.js`, `SpawnedPointsSerializer.js`.
  - **Được sử dụng bởi**: `Company.js`, `GameManager.js`, `VisualsManager.js`.
- **`General.js`**:
  - **Chức năng**: Chứa các hàm tiện ích chung (`General` object) cho logic game, ví dụ: xử lý sự kiện hàng tuần (`proceedOneWeek`), tính toán chi phí hàng tháng, phát hành game (`releaseGame`), quản lý các dự án đặc biệt (R&D, Hardware), lấy danh sách các mục có sẵn (topic, genre, feature). Tính toán điểm/thời gian cho các nhiệm vụ phát triển game.
  - **Phụ thuộc**: `Company.js`, `Game.js`, `Platforms.js`, `Topics.js`, `GameGenre.js`, `Research.js`, `Missions.js`, `GameManager.js`, `Sales.js`, `Reviews.js`, `Media.js`, `DecisionNotifications.js`, `Tutorial.js`, `Knowledge.js`, `LevelCalculator.js`.
  - **Được sử dụng bởi**: `GameManager.js` và nhiều module logic/UI khác.

#### `js/game/content/`

- **`Media.js`**:
  - **Chức năng**: Chứa dữ liệu (`Media.allScheduledStories`, `Media.TriggerNotifications`) và logic (`Media` object) để tạo ra các thông báo, tin tức dựa trên sự kiện trong game. Ví dụ: tin phát hành nền tảng mới, tin tức ngành, thành tựu công ty, câu chuyện khi kết thúc game.
  - **Phụ thuộc**: `Notification.js`, `Company.js`, `Game.js`, `Platforms.js`, `GameManager.js`, `Tutorial.js`, `DecisionNotifications.js`.
  - **Được sử dụng bởi**: `GameManager.js` (trong `proceedOneWeek` và các hàm khác để kích hoạt story).
- **`Missions.js`**:
  - **Chức năng**: Định nghĩa các "nhiệm vụ" (`Missions` object) trong quá trình phát triển game (ví dụ: Engine, Gameplay, Story/Quests, Graphics), các giai đoạn phát triển (`Stage1Missions`, `Stage2Missions`, `Stage3Missions`), và các yếu tố liên quan như điểm tập trung (designFactor, technologyFactor), thời gian cơ bản (`BASE_DURATION`), và chi phí. Cũng bao gồm các nhiệm vụ marketing (`MarketingMissions`).
  - **Phụ thuộc**: `GameGenre.js`, `LevelCalculator.js`, `Research.js`.
  - **Được sử dụng bởi**: `Game.js`, `GameManager.js`, `General.js`, `UIManager.FeatureSelection.js`.
- **`Platforms.js`**:
  - **Chức năng**: Chứa dữ liệu về các nền tảng game (`Platforms.allPlatforms`) như PC, G64, TES, v.v. Bao gồm thông tin ngày phát hành, ngày ngừng hỗ trợ, thị phần ban đầu, các điểm thay đổi thị phần, chi phí phát triển, chi phí bản quyền, sự phù hợp với các thể loại và đối tượng người chơi.
  - **Phụ thuộc**: `GameGenre.js`, `GameFlags.js`, `General.js`, `GameManager.js` (để lấy tuần hiện tại).
  - **Được sử dụng bởi**: `Game.js`, `Company.js`, `GameManager.js`, `Sales.js`, `Reviews.js`, `UIManager.Pickers.js`, `Knowledge.js`.
- **`Topics.js`**:
  - **Chức năng**: Định nghĩa các chủ đề game (`Topics.topics`) như Sports, Military, Fantasy, v.v. Bao gồm sự phù hợp của chúng với các thể loại game khác nhau (`genreWeightings`) và đối tượng người chơi (`audienceWeightings`).
  - **Phụ thuộc**: `GameGenre.js`, `GameFlags.js`.
  - **Được sử dụng bởi**: `Game.js`, `Company.js`, `GameManager.js`, `Reviews.js`, `UIManager.Pickers.js`, `Knowledge.js`, `Research.js`.

#### `js/game/mechanics/`

- **`Reviews.js`**:
  - **Chức năng**: Xử lý logic tạo đánh giá (review) cho game sau khi phát hành (`Reviews` object). Tính điểm review dựa trên nhiều yếu tố: điểm thiết kế, công nghệ, số lỗi, sự phù hợp chủ đề/thể loại, hype, marketing, xu hướng thị trường, và các yếu tố đặc biệt khác (ví dụ: sequel, engine mới).
  - **Phụ thuộc**: `Game.js`, `Company.js`, `Topics.js`, `GameGenre.js`, `Platforms.js`, `GameFlags.js`, `Missions.js`, `General.js`, `MersenneTwister.js`, `GameTrends.js`, `LevelCalculator.js`.
  - **Được sử dụng bởi**: `GameManager.js` (sau khi phát hành game).
- **`Sales.js`**:
  - **Chức năng**: Xử lý logic bán game (`Sales` object). Tính toán doanh thu, số lượng bản bán được hàng tuần, và sự thay đổi lượng fan. Doanh số bị ảnh hưởng bởi điểm review, hype, thị phần nền tảng, giá game, xu hướng, piracy (nếu có). Cũng xử lý doanh thu từ SDK và Grid.
  - **Phụ thuộc**: `Game.js`, `Company.js`, `Platforms.js`, `GameFlags.js`, `GameManager.js`, `General.js`, `UI` (để cập nhật card bán hàng), `SalesEvents.js`, `Media.js` (cho thông báo về MMO), `Tutorial.js`.
  - **Được sử dụng bởi**: `GameManager.js` (trong vòng lặp tuần).
- **`SalesEvents.js`**:
  - **Chức năng**: Quản lý các sự kiện đặc biệt liên quan đến doanh số bán game (`SalesEvents` object), ví dụ: đạt kỷ lục doanh số, game được hype nhờ phỏng vấn. Các sự kiện này có thể ảnh hưởng đến doanh số hoặc tạo thông báo.
  - **Phụ thuộc**: `Game.js`, `Company.js`, `GameManager.js`, `Notification.js`, `Media.js` (để lấy nguồn tin).
  - **Được sử dụng bởi**: `Game.js` (trong `getSalesAnomaly`), `Sales.js`.
- **`DecisionNotifications.js`**:
  - **Chức năng**: Tạo và quản lý các thông báo yêu cầu người chơi đưa ra quyết định (`DecisionNotifications` object). Ví dụ: đề nghị cứu trợ tài chính (bailout), đối phó với vi phạm bản quyền, nâng cấp văn phòng, đầu tư vào các dự án lớn.
  - **Phụ thuộc**: `Notification.js`, `Company.js`, `Game.js`, `GameManager.js`, `General.js`, `Tutorial.js`, `Research.js`, `Media.js`, `SoundManager.js`.
  - **Được sử dụng bởi**: `Media.js`, `GameManager.js`.
- **`ProjectContracts.js`**:
  - **Chức năng**: Quản lý logic cho các hợp đồng gia công phần mềm hoặc hợp đồng phát hành game (`ProjectContracts` object). Bao gồm việc tạo ra các hợp đồng có sẵn với các điều kiện cụ thể (chủ đề, nền tảng, điểm tối thiểu, tiền thưởng, phạt) và xử lý khi hợp đồng hoàn thành/thất bại.
  - **Phụ thuộc**: `Topics.js`, `Platforms.js`, `GameGenre.js`, `GameManager.js`, `Notification.js`, `MersenneTwister.js`, `General.js`.
  - **Được sử dụng bởi**: `GameManager.js` (khi người chơi tìm và chấp nhận hợp đồng).

---

### 5. Giao Diện Người Dùng (UI) và Các Thành Phần Visual

#### `js/ui/elements/`

- **`SettingsGameplay.js`**:
  - **Chức năng**: Quản lý các cài đặt gameplay (`SettingsGameplay` object) mà người chơi có thể thay đổi (ví dụ: bật/tắt tutorial, chế độ animation, bật/tắt gợi ý). Lưu trữ và đọc các cài đặt này từ `DataStore`.
  - **Phụ thuộc**: `DataStore.js`, `GameFlags.js`.
  - **Được sử dụng bởi**: `UIManager.Main.js` (panel settings), `GameManager.js` (đọc cài đặt).
- **`FlippingCounter.js`**:
  - **Chức năng**: Module tạo hiệu ứng số đếm lật (`FlippingCounter` object), thường dùng trong các animation tổng kết điểm số hoặc tiền.
  - **Phụ thuộc**: EaselJS, TweenJS, `SoundManager.js`, `Logger.js`.
  - **Được sử dụng bởi**: `UIManager.GameEnd.js`, `UIManager.Conference.js`.
- **`Knowledge.js`**:
  - **Chức năng**: Quản lý "kiến thức" (`Knowledge` object) mà người chơi thu thập được qua các lần chơi (ví dụ: sự kết hợp tốt/xấu giữa chủ đề và thể loại, sự phù hợp của nền tảng với đối tượng/thể loại, hiệu quả của các khóa training). Hiển thị các gợi ý dựa trên kiến thức này trong UI.
  - **Phụ thuộc**: `Topics.js`, `GameGenre.js`, `Platforms.js`, `Missions.js`, `DataStore.js`, `Company.js`, `Game.js`, `General.js`, `Logger.js`, `Training.js`.
  - **Được sử dụng bởi**: `UIManager.Pickers.js`, `UIManager.FeatureSelection.js`, `UIManager.GameDefinition.js`, `UIManager.ResearchTraining.js`.

#### `js/visuals/animations/` và các file visuals khác

- **`SpriteSheetX.js`, `AnimationSpriteSheets.js`, `BitmapAnimationFactory.js`, `CharacterNameVisual.js`, `CompositeBitmapAnimation.js`, `GameStatusBar.js`, `LevelOverlay.js`, `PointsDisplayVisual.js`, `ProgressBarVisual.js`, `HypePointsVisual.js`, `CircularProgressVisual.js`, `CharacterOverlay.js`**:
  - **Chức năng**: Nhóm các file này định nghĩa và quản lý các sprite sheet, animation của nhân vật (đi, ngồi, gõ phím, suy nghĩ), các hiệu ứng hình ảnh như thanh tiến trình, điểm số bay lên, tên nhân vật/công ty, và các đối tượng trang trí trong văn phòng (máy lạnh, máy in). `CharacterOverlay.js` là lớp chính quản lý việc hiển thị một nhân vật trên màn hình, bao gồm các animation và hiệu ứng liên quan.
  - **Phụ thuộc**: EaselJS, TweenJS, `GameResourceManager.js`, `ResourceKeys.js`, `CanvasManager.js`, `GameManager.js` (cho trạng thái game), `GameFlags.js`, `SoundManager.js`, `UI` (cho font).
  - **Được sử dụng bởi**: `VisualsManager.js`, `Character.js`.
- **`ProjectWorkerVisual.js`**:
  - **Chức năng**: Lớp trực quan hóa nhân viên làm việc trong các lab R&D hoặc Hardware. Có thể là một dạng đặc biệt của `CharacterOverlay` hoặc sử dụng các animation tương tự, quản lý hiệu suất và tiến trình làm việc.
  - **Phụ thuộc**: `CharacterOverlay.js`, `VisualsManager.js`, `GameManager.js` (để lấy thông tin project).
  - **Được sử dụng bởi**: `VisualsManager.js`.
- **`IsometricCompanyNameVisual.js`**:
  - **Chức năng**: Lớp hiển thị tên công ty theo phong cách isometric trên các đối tượng trong văn phòng (ví dụ: bảng hiệu ở các level cao hơn).
  - **Phụ thuộc**: EaselJS, `VisualsManager.js`, `GameManager.js` (tên công ty).
  - **Được sử dụng bởi**: `VisualsManager.js`.
- **`VisualsManager.js`**:
  - **Chức năng**: Module quản lý tổng thể việc hiển thị đồ họa và animation trong game (`VisualsManager` object). Điều phối việc vẽ lên canvas, tạo/xóa `CharacterOverlay` và các đối tượng visual khác, quản lý vị trí nhân vật, hiệu ứng, di chuyển camera (scroll giữa các zone).
  - **Phụ thuộc**: `CanvasManager.js`, `GameResourceManager.js`, `Character.js`, các lớp animation (`CharacterOverlay.js`, `BitmapAnimationFactory.js`, `LevelOverlay.js`, `GameStatusBar.js`), `GameFlags.js`, `Company.js`, `Game.js`, `SoundManager.js`, `UI`.
  - **Được sử dụng bởi**: `GameManager.js` (để cập nhật hiển thị), `StartupAndSplash.js`.

#### `js/ui/UIManager.*.js` (Các module UI được tách)

- **`UIManager.Main.js`**:
  - **Chức năng**: Khởi tạo đối tượng `UI` toàn cục. Cung cấp các hàm tiện ích chung cho UI như đóng/mở dialog, quản lý trạng thái focus, xử lý click, hiển thị/ẩn các panel chính (Help, Settings, Mods, HighScore, Achievements), và quản lý newsletter widget.
  - **Phụ thuộc**: jQuery, jQuery UI, SimpleModal, `PlatformShim.js`, `GameManager.js`, `SoundManager.js`, `DataStore.js`, `SettingsGameplay.js`, `FlippingCounter.js`.
  - **Được sử dụng bởi**: Hầu hết các file `UIManager.*.js` khác.
- **`UIManager.MainMenu.js`**:
  - **Chức năng**: Quản lý logic và hiển thị của menu chính (New Game, Continue, Load, Save, Settings, Mods, Help, Exit). Kích hoạt các hành động tương ứng trong `GameManager` hoặc các module UI khác.
  - **Phụ thuộc**: `UIManager.Main.js`, `GameManager.js`, `PlatformShim.js`, `SoundManager.js`, `SplashScreen.js`.
- **`UIManager.StatusBar.js`**:
  - **Chức năng**: Cập nhật và hiển thị thông tin trên thanh trạng thái (tiền, fan, ngày tháng, tuần, xu hướng thị trường). Bao gồm cả việc hiển thị các thông báo thay đổi tiền/fan dưới dạng hiệu ứng động.
  - **Phụ thuộc**: `UIManager.Main.js`, `GameManager.js`, `Company.js`, `GameTrends.js`, TweenJS.
- **`UIManager.Conference.js`**:
  - **Chức năng**: Quản lý UI cho việc tham gia hội chợ game G3. Hiển thị dialog lựa chọn gian hàng (`conferenceBoothPicker`) sử dụng RoyalSlider và chạy animation tổng kết kết quả hội chợ (`gameConferenceAnimationDialog`) với hiệu ứng `FlippingCounter`.
  - **Phụ thuộc**: `UIManager.Modal.js`, `GameManager.js`, `Company.js`, `Booth.js`, `FlippingCounter.js`, RoyalSlider, EaselJS, TweenJS, `AnimationSpriteSheets.js` (cho animation hội chợ).
- **`UIManager.DevelopConsole.js`**:
  - **Chức năng**: Quản lý dialog (`createConsoleMenu`) cho việc phát triển console tùy chỉnh. Bao gồm đặt tên console, chọn thiết kế (variation), chọn các tính năng phần cứng, và điều chỉnh ngân sách QA.
  - **Phụ thuộc**: `UIManager.Modal.js`, `GameManager.js`, `Research.js` (để lấy danh sách và chi phí feature), `General.js` (lấy feature console), RoyalSlider.
- **`UIManager.ConsoleMaintenance.js`**:
  - **Chức năng**: Hiển thị các card thông tin (`consoleMaintenanceContainer`) về tình trạng bảo trì của các console do người chơi phát hành. Hiển thị backlog điểm bảo trì và tiến trình sửa chữa dưới dạng biểu đồ cột.
  - **Phụ thuộc**: `UIManager.Main.js`, `GameManager.js`, `Company.js`, `Platforms.js`, `Sales.js` (cho đơn giá console), `ProgressBarVisual.js`, EaselJS, TweenJS.
- **`UIManager.Modal.js`**:
  - **Chức năng**: Cung cấp các hàm để hiển thị và quản lý các dialog modal chung (sử dụng thư viện SimpleModal hoặc jQuery UI Dialog được tùy biến thành `gdDialog`). Xử lý việc đóng/mở, animation, và các callback liên quan đến vòng đời của dialog.
  - **Phụ thuộc**: jQuery, SimpleModal/jQuery UI, `SoundManager.js`, `UIManager.Main.js`, `GameManager.js`.
- **`UIManager.Notifications.js`**:
  - **Chức năng**: Hiển thị các thông báo pop-up chuẩn trong game (ví dụ: tutorial, tin tức, kết quả nghiên cứu) thông qua `notificationContent`. Hỗ trợ hiển thị hình ảnh, các nút lựa chọn, và hiệu ứng gõ chữ.
  - **Phụ thuộc**: `UIManager.Modal.js`, `Notification.js`, `GameManager.js`, `PlatformShim.js`, `SoundManager.js`, `General.js`, `Media.js`, `Platforms.js`, jQuery.typewrite plugin (từ `UIManager.SupportAndNewsletter.js`).
- **`UIManager.SidebarNotifications.js`**:
  - **Chức năng**: Quản lý việc hiển thị và tương tác với các thông báo ở thanh bên (`notificationSidebar`). Các thông báo này có thể được click để mở ra xem chi tiết hoặc tự động biến mất sau một khoảng thời gian.
  - **Phụ thuộc**: `UIManager.Main.js`, `Notification.js`, `GameManager.js`, GSAP (TweenMax).
- **`UIManager.Pickers.js`**:
  - **Chức năng**: Quản lý các dialog lựa chọn (picker) cho Chủ đề (`pickTopicClick`), Nền tảng (`pickPlatformClick`), Thể loại (`pickGenreClick`, `pickSecondGenreClick`), và Game Engine (`pickEngineClick`) khi người chơi đang trong quá trình định nghĩa game.
  - **Phụ thuộc**: `UIManager.Modal.js` (gián tiếp qua `showModalContent`), `GameManager.js`, `Topics.js`, `Platforms.js`, `GameGenre.js`, `Research.js` (cho engine), `Knowledge.js` (để hiển thị gợi ý).
- **`UIManager.GameDefinition.js`**:
  - **Chức năng**: Quản lý dialog chính (`gameDefinition`) cho việc định nghĩa một game mới hoặc sequel. Cho phép người chơi đặt tên game, chọn chủ đề, thể loại (chính và phụ), nền tảng (có thể nhiều), engine, đối tượng người chơi, và kích thước game. Cập nhật chi phí dự kiến và kiểm tra tính hợp lệ của lựa chọn.
  - **Phụ thuộc**: `UIManager.Modal.js`, `UIManager.Pickers.js`, `UIManager.FeatureSelection.js`, `GameManager.js`, `Company.js`, `Game.js`, `Research.js`, `Platforms.js`, `GameGenre.js`, `Topics.js`, `Knowledge.js`, `General.js`.
- **`UIManager.FeatureSelection.js`**:
  - **Chức năng**: Quản lý dialog (`selectFeatureMenu`) lựa chọn các tính năng (features) cho game trong các giai đoạn phát triển. Cho phép điều chỉnh sự tập trung (focus slider) cho từng nhóm nhiệm vụ chính và chọn các feature phụ. Hiển thị gợi ý, chi phí, và dự kiến thời gian. Hỗ trợ gán nhân viên cho các nhiệm vụ nếu game đủ lớn.
  - **Phụ thuộc**: `UIManager.Modal.js`, `GameManager.js`, `Missions.js`, `Research.js`, `Knowledge.js`, `LevelCalculator.js`, `General.js`.
- **`UIManager.ReleaseGame.js`**:
  - **Chức năng**: Quản lý dialog (`releaseGameDialog`) hiển thị khi game hoàn thành phát triển. Hiển thị điểm design/tech, số lỗi, và chạy animation tính điểm kinh nghiệm nhận được cho các feature, mission và nhân viên. Cho phép người chơi đặt lại tên game trước khi phát hành hoặc hủy game.
  - **Phụ thuộc**: `UIManager.Modal.js`, `GameManager.js`, `Game.js`, `LevelCalculator.js`, `General.js`, `Missions.js`, `Research.js`, `SoundManager.js`, EaselJS, TweenJS.
- **`UIManager.SaveSlotContextMenu.js`**:
  - **Chức năng**: Hiển thị menu ngữ cảnh (context menu) cho các slot lưu game. Cung cấp các tùy chọn như "Upload to Cloud" (để chia sẻ save code) và "Download from Cloud" (nhập save code).
  - **Phụ thuộc**: `UIManager.ContextMenuDisplay.js`, `UIManager.NewGameAndLoadSave.js` (sử dụng `_getElementForSaveGame`), `DataStore.js`, `GameManager.js`, JSZip, `PlatformShim.js`, `SavegameConverter.js`.
- **`UIManager.NewGameAndLoadSave.js`**:
  - **Chức năng**: Quản lý dialog tạo game mới (`newGameView`), cho phép nhập tên công ty, tên người chơi, chọn giới tính và tùy chỉnh ngoại hình nhân vật. Quản lý các dialog tải (`loadView`) và lưu (`saveView`) game, bao gồm cả dialog xác nhận ghi đè (`overwriteGameDialog`) và xóa save (`deleteGameDialog`). Xử lý việc sử dụng kiến thức từ game trước.
  - **Phụ thuộc**: `UIManager.Modal.js`, `GameManager.js`, `DataStore.js`, `PlatformShim.js`, `SaveGameData.js`, `Knowledge.js`, `Company.js`, `ResourceKeys.js` (cho preview).
- **`UIManager.SalesCards.js`**:
  - **Chức năng**: Hiển thị các card thông tin (`gameSalesContainer`) về doanh số bán của các game đang trên thị trường. Mỗi card hiển thị tên game, thứ hạng, số bản bán được, và biểu đồ bán hàng theo tuần.
  - **Phụ thuộc**: `UIManager.Main.js`, `GameManager.js`, `Sales.js`, `Game.js`, EaselJS, TweenJS.
- **`UIManager.Marketing.js`**:
  - **Chức năng**: Quản lý dialog (`marketingPicker`) lựa chọn các chiến dịch marketing cho game đang phát triển, sử dụng RoyalSlider để duyệt các tùy chọn.
  - **Phụ thuộc**: `UIManager.Modal.js`, `GameManager.js`, `Missions.js` (MarketingMissions), RoyalSlider.
- **`UIManager.CreateEngine.js`**:
  - **Chức năng**: Quản lý dialog (`createEngineMenu`) tạo Game Engine tùy chỉnh. Cho phép đặt tên engine và chọn các bộ phận (engine parts) từ danh sách các research đã hoàn thành. Tính toán và hiển thị chi phí.
  - **Phụ thuộc**: `UIManager.Modal.js`, `GameManager.js`, `Research.js`, `General.js` (lấy engine parts khả dụng).
- **`UIManager.ResearchTraining.js`**:
  - **Chức năng**: Quản lý dialog (`researchMenu`) chung cho việc chọn một mục để Nghiên cứu (Research) hoặc Huấn luyện (Training) cho nhân viên. Hiển thị danh sách các mục khả dụng, chi phí (điểm research, tiền), và thông tin nhân viên (nếu là training).
  - **Phụ thuộc**: `UIManager.Modal.js`, `GameManager.js`, `Research.js`, `Training.js`, `Topics.js` (cho research topic).
- **`UIManager.GameHistory.js`**:
  - **Chức năng**: Hiển thị lịch sử các game đã phát hành (`gameHistoryDialog`) dưới dạng một slider (RoyalSlider). Mỗi slide hiển thị thông tin chi tiết về một game: tên, hình ảnh, chủ đề/thể loại, nền tảng, chi phí, doanh thu, lợi nhuận, fan, điểm review trung bình, thứ hạng cao nhất.
  - **Phụ thuộc**: `UIManager.Modal.js`, `GameManager.js`, `Company.js`, `Game.js`, `Platforms.js`, `General.js`, RoyalSlider.
- **`UIManager.GameEnd.js`**:
  - **Chức năng**: Quản lý các dialog hiển thị khi kết thúc game: `gameEndDialog` (tổng kết điểm), `gameEndTrialDialog` (khi hết bản thử nghiệm/lite). Hiển thị điểm số cuối cùng với hiệu ứng `FlippingCounter`, thống kê game, và các tùy chọn mua/nâng cấp game.
  - **Phụ thuộc**: `UIManager.Modal.js`, `GameManager.js`, `Company.js`, `FlippingCounter.js`, `AchievementsData.js`, `PlatformShim.js`, `DataStore.js`, `Sales.js`, `Topics.js`, `GameGenre.js`.
- **`UIManager.Staff.js`**:
  - **Chức năng**: Quản lý các dialog liên quan đến nhân viên: `findStaffDialog` (tìm kiếm nhân viên mới, đặt ngân sách, chọn bài test), `hireStaffDialog` (xem danh sách ứng viên và thuê), `staffListDialog` (xem danh sách nhân viên hiện tại).
  - **Phụ thuộc**: `UIManager.Modal.js`, `GameManager.js`, `Character.js`, `LevelCalculator.js`, `Training.js` (cho bài test), RoyalSlider, `Tutorial.js`, `DecisionNotifications.js` (cho sa thải).
- **`UIManager.Boost.js`**:
  - **Chức năng**: Quản lý UI cho tính năng "boost" của nhân viên. Hiển thị nút boost (`boostButtonTemplate`) bên cạnh nhân vật, đồng hồ sạc boost (`CircularProgressVisual`), và mức độ boost.
  - **Phụ thuộc**: `UIManager.Main.js`, `VisualsManager.js`, `Character.js`, `GameManager.js`, `CircularProgressVisual.js`, `GameFlags.js`.
- **`UIManager.GenericProject.js`**:
  - **Chức năng**: Quản lý dialog (`genericProjectMenu`) cho việc bắt đầu các dự án đặc biệt (generic projects) trong R&D Lab hoặc Hardware Lab, sử dụng RoyalSlider để duyệt các dự án.
  - **Phụ thuộc**: `UIManager.Modal.js`, `GameManager.js`, `General.js` (để lấy danh sách project), `Research.js` (BigProjects).
- **`UIManager.Contracts.js`**:
  - **Chức năng**: Quản lý dialog (`findContractWorkWindow`) tìm kiếm và chấp nhận các hợp đồng gia công hoặc hợp đồng phát hành game, sử dụng RoyalSlider. Hiển thị thông tin chi tiết của hợp đồng.
  - **Phụ thuộc**: `UIManager.Modal.js`, `GameManager.js`, `ProjectContracts.js`, `Topics.js`, `Platforms.js`, RoyalSlider.
- **`UIManager.Achievements.js`**:
  - **Chức năng**: Hiển thị các thông báo pop-up (`achievementTemplate`) khi người chơi đạt được thành tựu (achievement). Quản lý panel (`achievementsPanel`) hiển thị danh sách tất cả các thành tựu đã đạt được và chưa đạt được (nếu không ẩn).
  - **Phụ thuộc**: `UIManager.Main.js`, `GameManager.js`, `AchievementsData.js`, `SoundManager.js`, GSAP (TweenMax), `DataStore.js`.
- **`UIManager.HighScore.js`**:
  - **Chức năng**: Quản lý panel (`highScorePanel`) hiển thị danh sách điểm cao của người chơi.
  - **Phụ thuộc**: `UIManager.Main.js`, `GameManager.js`, `DataStore.js`.
- **`UIManager.ReviewWindow.js`**:
  - **Chức năng**: Hiển thị cửa sổ đánh giá game (`reviewWindow`) sau khi phát hành. Bao gồm animation của các reviewer đưa ra điểm số và bình luận, sử dụng hiệu ứng gõ chữ và các hiệu ứng sao.
  - **Phụ thuộc**: `UIManager.Modal.js`, `GameManager.js`, `Reviews.js`, `SoundManager.js`, jQuery.typewrite plugin, EaselJS, TweenJS.
- **`UIManager.ContextMenuDisplay.js`**:
  - **Chức năng**: Module cơ sở để hiển thị menu ngữ cảnh (context menu) tùy chỉnh (`contextMenu`) khi người dùng click chuột phải hoặc thực hiện hành động tương tự. Quản lý việc tạo, hiển thị và đóng menu.
  - **Phụ thuộc**: `UIManager.Main.js`, jQuery, `SoundManager.js`.
- **`UIManager.SupportAndNewsletter.js`**:
  - **Chức năng**: Quản lý dialog hỗ trợ nhà phát triển (`supporterDialog`) với các tùy chọn như rate game, gửi feedback, mua supporter pack. Quản lý widget đăng ký nhận newsletter (`newsletterSignup`). Bao gồm plugin jQuery `typewrite` cho hiệu ứng gõ chữ.
  - **Phụ thuộc**: `UIManager.Modal.js`, `GameManager.js`, `PlatformShim.js`, `SupportPacks.js`, `DataStore.js`, jQuery.
- **`UIManager.Modding.js`**:
  - **Chức năng**: Hiển thị dialog cảnh báo (`modMismatchDialog`) khi có sự không khớp về mod giữa save game đang tải và các mod đang được kích hoạt trong game.
  - **Phụ thuộc**: `UIManager.Modal.js`, `ModSupport.js`, `SplashScreen.js`.
- **`UIManager.MediaTriggers.js`**:
  - **Chức năng**: Không phải là một module UI trực tiếp, mà là nơi định nghĩa các "trigger" (`Media.TriggerNotifications`) - các điều kiện để kích hoạt các thông báo, tin tức từ `Media.js` dựa trên trạng thái và tiến trình của game.
  - **Phụ thuộc**: `Media.js`, `GameManager.js`, `Company.js`, `Sales.js`, `Tutorial.js`.
- **`UIManager.WindowsIntegration.js`**:
  - **Chức năng**: Xử lý các tương tác đặc thù với Windows 8 Store API (`WindowsIntegration` object) như lấy tên người dùng, mở trang review trên Store, cập nhật Live Tile, hiển thị/ẩn các nút trên AppBar.
  - **Phụ thuộc**: `PlatformShim.js`, `GameManager.js`, `DataStore.js`, `AchievementsData.js`, `Logger.js`.
- **`UIManager.Tutorial.js`**:
  - **Chức năng**: Quản lý hệ thống hướng dẫn (tutorial) trong game (`Tutorial` object). Định nghĩa các thông điệp tutorial (`Tutorial.messages`) và logic hiển thị chúng thông qua `Notification.js` dựa trên các sự kiện hoặc trạng thái game.
  - **Phụ thuộc**: `UIManager.Notifications.js`, `GameManager.js`, `DataStore.js`, `SettingsGameplay.js`, `PlatformShim.js`, `GameFlags.js`.
- **`UIManager.Research.js`**:
  - **Chức năng**: Định nghĩa các mục nghiên cứu (research items) chính của game (`Research` object), bao gồm các chủ đề mới, engine tùy chỉnh, các tính năng gameplay, đồ họa, âm thanh, AI, v.v. Quản lý chi phí (điểm research, tiền), thời gian nghiên cứu, và điều kiện để mở khóa.
  - **Phụ thuộc**: `LevelCalculator.js`, `Missions.js`, `GameFlags.js`, `General.js`, `Notification.js`, `GameManager.js`.
  - **Được sử dụng bởi**: `GameManager.js`, `UIManager.ResearchTraining.js` (cho UI picker).
- **`UIManager.Research.Console.js`**:
  - **Chức năng**: Mở rộng `Research` object, có thể chứa các mục nghiên cứu cụ thể liên quan đến việc phát triển console (ví dụ: các bộ phận phần cứng, tính năng console). _Lưu ý: Trong file `codeNw.js` gốc, phần này có vẻ trống, có thể đã được gộp vào `Research.js` hoặc là placeholder._
  - **Phụ thuộc**: `Research.js`.
- **`UIManager.Research.Lab.js`**:
  - **Chức năng**: Mở rộng `Research` object, định nghĩa các dự án nghiên cứu lớn (`Research.bigProjects`) có thể thực hiện trong R&D Lab hoặc Hardware Lab (ví dụ: MMO, Grid, AAA Games, Custom Hardware).
  - **Phụ thuộc**: `Research.js`, `Notification.js`, `GameManager.js`.
- **`UIManager.Training.js`**:
  - **Chức năng**: Định nghĩa các khóa huấn luyện (training) cho nhân viên (`Training` object) để cải thiện kỹ năng. Bao gồm các khóa training cơ bản, nâng cao, và các khóa chuyên môn hóa.
  - **Phụ thuộc**: `Missions.js`, `Character.js`, `LevelCalculator.js`, `GameManager.js`, `DecisionNotifications.js`, `VisualsManager.js`.
  - **Được sử dụng bởi**: `GameManager.js`, `UIManager.ResearchTraining.js` (cho UI picker).
- **`UIManager.AchievementsData.js`**:
  - **Chức năng**: Định nghĩa tất cả các thành tựu (achievements) trong game (`Achievements` object). Mỗi achievement có ID, tên, mô tả, điều kiện để đạt được, điểm giá trị, và có thể là ẩn.
  - **Phụ thuộc**: `GameManager.js`, `Company.js`, `Game.js`, `GameGenre.js`, `Topics.js`, `DataStore.js`, `SteamAPI.js`, `GameFlags.js`.
  - **Được sử dụng bởi**: `UIManager.Achievements.js`, `GameManager.js`.

---

### 6. Các Tiện Ích Game và Hệ Thống Cuối Cùng

#### `js/game/utils/`

- **`LevelCalculator.js`**:
  - **Chức năng**: Tính toán điểm kinh nghiệm (XP) cần thiết cho mỗi cấp độ (`LevelCalculator` object), cấp độ hiện tại dựa trên XP, và tiến trình đến cấp độ tiếp theo cho nhân viên và các tính năng/mission của game.
  - **Phụ thuộc**: Không có.
  - **Được sử dụng bởi**: `Character.js`, `Research.js`, `Training.js`, `Missions.js`, `UIManager.ReleaseGame.js`.
- **`SavegameMigrator.js`**:
  - **Chức năng**: Xử lý việc nâng cấp (migrate) dữ liệu từ các phiên bản file save cũ hơn lên định dạng của phiên bản hiện tại (`SavegameMigrator` object), đảm bảo tính tương thích ngược bằng cách thêm/sửa đổi các trường dữ liệu.
  - **Phụ thuộc**: `Company.js`, `Game.js`, `GameManager.js` (phiên bản hiện tại), `UI.js` (các cài đặt UI mặc định), `PlatformShim.js`, `Research.js`, `General.js`, `Topics.js`.
  - **Được sử dụng bởi**: `GameManager.js` (khi tải game).
- **`SavegameConverter.js`**:
  - **Chức năng**: Chuyển đổi định dạng file save (`SavegameConverter` object), có thể là giữa phiên bản PC và mobile hoặc để tối ưu hóa dữ liệu cho việc chia sẻ save code.
  - **Phụ thuộc**: Cấu trúc của các đối tượng game, `GameManager.VERSION`, `SavegameMigrator.js`, `UI.js`.
  - **Được sử dụng bởi**: `UIManager.SaveSlotContextMenu.js` (khi upload/download save từ server tùy chỉnh).

#### `js/system/` (tiếp theo)

- **`UpdateNotifications.js`**:
  - **Chức năng**: Kiểm tra và hiển thị các thông báo (`UpdateNotifications` object) liên quan đến cập nhật game hoặc thông báo về phiên bản đầy đủ (nếu đang chơi bản lite/trial).
  - **Phụ thuộc**: `UIManager.Modal.js`, `PlatformShim.js`, `DataStore.js`, `GameManager.js`, `ghg4.js`.
  - **Được sử dụng bởi**: `StartupAndSplash.js`.
- **`SupportPacks.js`**:
  - **Chức năng**: Xử lý các gói hỗ trợ (supporter packs) (`SupportPacks` object), có thể là các Giao dịch Mua trong Ứng dụng (IAP) trên Windows Store.
  - **Phụ thuộc**: `PlatformShim.js`, `GameManager.js`, `AchievementsData.js`, `ghg4.js`.
  - **Được sử dụng bởi**: `UIManager.SupportAndNewsletter.js`.
- **`ghg4.js`**:
  - **Chức năng**: Module phân tích (analytics) (`ghg4` object), sử dụng Localytics hoặc một hệ thống tương tự, để thu thập dữ liệu sử dụng game ẩn danh.
  - **Phụ thuộc**: `GameFlags.js`, `PlatformShim.js`, `GameManager.js`.
  - **Được sử dụng bởi**: Nhiều module để gửi sự kiện.
- **`UpdateChecker.js`**:
  - **Chức năng**: Kiểm tra phiên bản cập nhật mới của game (`UpdateChecker` object) từ một server từ xa (thường cho các bản phân phối không qua Steam).
  - **Phụ thuộc**: `PlatformShim.js`, `GameFlags.js`, `UI.js` (modal), `SoundManager.js`, `ghg4.js`.
  - **Được sử dụng bởi**: `StartupAndSplash.js`.

#### `js/platform/` (tiếp theo)

- **`SteamGreenworks.js`**:
  - **Chức năng**: Cung cấp các hàm cụ thể (`Greenworks` object) để tương tác với Steam Workshop (upload, download, quản lý mod) thông qua thư viện Greenworks. Đồng bộ hóa các mod đã đăng ký từ Workshop khi khởi động game.
  - **Phụ thuộc**: `SteamAPI.js` (Steam.api), `GameFlags.js`, `PlatformShim.js`, `Logger.js`, `ModSupport.js`, `UIManager.CustomAlert.js`, `mkdirp.js`, `path.js` (Node.js modules).
  - **Được sử dụng bởi**: `UIManager.Main.js` (trong `_prepareGreenworks` và các UI liên quan đến Workshop).

---

### 7. Serializers và Mod Support

#### `js/serializers/`

- **`TopicsSerializer.js`, `EnginePartsSerializer.js`, `EngineSerializer.js`, `FeatureSerializer.js`, `PlatformsSerializer.js`, `CompanyFeatureSerializer.js`, `SpawnedPointsSerializer.js`**:

  - **Chức năng**: Mỗi file chứa một đối tượng (ví dụ: `TopicsSerializer`) với các hàm `load` và `save`. Các hàm này chịu trách nhiệm chuyển đổi các đối tượng game phức tạp (ví dụ: một `Topic` object đầy đủ) thành một dạng đơn giản hơn (thường là chỉ lấy ID hoặc một vài thuộc tính cần thiết) để lưu trữ trong file save, và ngược lại, khôi phục lại đối tượng đầy đủ từ dữ liệu đã lưu.
  - **Phụ thuộc**: Các lớp đối tượng game tương ứng (ví dụ: `Topics.js`, `Research.js`, `Platforms.js`).
  - **Được sử dụng bởi**: `GameManager.js` và `DataStore.js` trong quá trình lưu và tải game.

- **`js/GDT.js`**:

  - **Chức năng**: Định nghĩa một đối tượng `GDT` với các hàm để đăng ký và kích hoạt (fire) các sự kiện tùy chỉnh trong game (`GDT.eventKeys`). Đây là một hệ thống event bus đơn giản.
  - **Phụ thuộc**: Không có.
  - **Được sử dụng bởi**: Nhiều module để thông báo về các sự kiện quan trọng (ví dụ: `GameManager.js` khi lưu/tải game, hoàn thành research, `UI.js` khi mở/đóng dialog).

- **`mods/mods_manifest.js`**:
  - **Chức năng**: File này định nghĩa một mảng `Mods.available` chứa thông tin về các mod có sẵn hoặc được cài đặt. Mỗi phần tử trong mảng là một đối tượng mô tả mod (ID, tên, tác giả, mô tả, phiên bản, đường dẫn đến file chính của mod, v.v.).
  - **Phụ thuộc**: Không có.
  - **Được sử dụng bởi**: `ModSupport.js`.
- **`js/modSupport.js`**:
  - **Chức năng**: Quản lý việc tải, kích hoạt, và vô hiệu hóa mod (`ModSupport` object). Xử lý sự phụ thuộc giữa các mod, kiểm tra tính tương thích, và tương tác với Steam Workshop (thông qua `SteamGreenworks.js`) để quản lý mod từ Workshop.
  - **Phụ thuộc**: `mods_manifest.js`, `SteamGreenworks.js`, `PlatformShim.js`, `Logger.js`, `GameManager.js` (để reload game sau khi thay đổi mod), `UIManager.Modding.js`, `DataStore.js`.
  - **Được sử dụng bởi**: `StartupAndSplash.js` (khởi tạo), `GameManager.js` (khi tải game), `UIManager.Main.js` (cho panel mods).

---

## Luồng Dữ Liệu và Kiến Trúc Tổng Thể

1.  **Khởi tạo Game (`index.html` -> `StartupAndSplash.js`)**:

    - `index.html` là điểm vào, tải tất cả các file CSS, thư viện bên thứ ba, và các module JavaScript theo thứ tự đã định nghĩa.
    - `StartupAndSplash.js` được thực thi. Nó sẽ:
      - Hiển thị màn hình chờ (splash screen).
      - Khởi tạo `CustomAlert` để ghi đè `window.alert`.
      - Tải các tài nguyên đồ họa cơ bản thông qua `GameResourceManager.js`.
      - Khởi tạo `LanguageManager.js` để thiết lập ngôn ngữ.
      - Khởi tạo `SoundManager.js` để chuẩn bị âm thanh.
      - Khởi tạo `CanvasManager.js` để thiết lập các canvas vẽ.
      - Kiểm tra EULA (nếu cần, trên NW.js).
      - Tải kiến thức người chơi (`Knowledge.loadPlayerKnowledge`).
      - Khởi tạo `GameManager.js`.
      - Sau khi các tài nguyên cần thiết được tải, `StartupAndSplash.js` sẽ quyết định hiển thị tùy chọn "New Game" hoặc "Continue Game" dựa trên `GameManager.getSaveGames()`.
    - `GameManager.startDrawLoop()` được gọi để bắt đầu vòng lặp render.

2.  **Bắt đầu Game Mới hoặc Tiếp Tục (`GameManager.js`)**:

    - Khi người dùng chọn "New Game" hoặc "Continue" (thông qua `UIManager.MainMenu.js` hoặc `UIManager.NewGameAndLoadSave.js`):
      - **New Game**: `GameManager._setupNewGame()` tạo một `Company` mới, thiết lập các giá trị ban đầu (tiền, chủ đề, nhân viên).
      - **Continue/Load Game**: `GameManager.reload()` được gọi. Nó sử dụng `DataStore.loadSlotAsync()` để lấy dữ liệu save. `SavegameMigrator.migrate()` được gọi nếu phiên bản save cũ hơn. Dữ liệu được parse và các đối tượng game (`Company`, `Game`, `Character`, v.v.) được tái tạo thông qua các hàm `load` của chúng (sử dụng các `Serializer`).
    - `VisualsManager.reset()` được gọi để thiết lập lại hoặc vẽ lại trạng thái game lên canvas (văn phòng, nhân vật).
    - `UIManager.resetStatusBar()` cập nhật thanh trạng thái.
    - Các thông báo ban đầu hoặc đang chờ được hiển thị (`GameManager.showPendingNotifications`).

3.  **Vòng Lặp Game Chính (`GameManager.update` và các hàm `addTickListener`)**:

    - `GameManager.update()` được gọi liên tục bởi `requestAnimFrame`.
    - Nó tính toán thời gian delta và gọi các hàm đã đăng ký qua `GameManager.addTickListener()`:
      - Cập nhật thời gian game (`gameTime`).
      - Nếu một tuần mới trôi qua (`General.proceedOneWeek`): trả lương, xử lý doanh số (`Sales.processSales`), cập nhật xu hướng (`GameTrends.updateTrends`), kiểm tra sự kiện nền tảng.
      - Cập nhật tiến trình phát triển game/engine/project (`GameManager.updateFeatures`, `GameManager.updateContractProgress`, `GameManager.updateHwProject`, `GameManager.updateRndProject`).
      - Cập nhật trạng thái và hành động của nhân viên (`Character.tick`).
      - Cập nhật các animation đang chạy (GSAP, CreateJS Tweens).
    - `CanvasManager.update()` được gọi để vẽ lại các thay đổi lên canvas, thông qua `VisualsManager.js`.
    - `UI.updateStatusBar()` được gọi để cập nhật thông tin trên thanh trạng thái.

4.  **Tương Tác Người Dùng (Các module `UIManager.*.js`)**:

    - Người dùng tương tác với các nút, menu, dialog trên giao diện.
    - Các sự kiện click/thay đổi được bắt bởi các module `UIManager` tương ứng.
    - Các module `UIManager` này sau đó sẽ:
      - Hiển thị/ẩn các dialog hoặc panel khác.
      - Gọi các hàm trong `GameManager.js` để thực hiện các hành động logic của game (ví dụ: `GameManager.createNewGame()`, `GameManager.research()`, `GameManager.startContract()`).
      - Cập nhật trạng thái của `GameManager.uiSettings` (ví dụ: nhân viên được chọn, giá trị slider).

5.  **Lưu Game (`GameManager.save`)**:

    - Khi người dùng chọn lưu game hoặc game tự động lưu:
    - `GameManager.save()` được gọi. Nó thu thập trạng thái hiện tại của `GameManager`, `Company`, và các đối tượng liên quan.
    - Các hàm `save()` của `Company`, `Game`, `Character` được gọi. Các hàm này sử dụng các `Serializer` (ví dụ: `TopicsSerializer.save()`, `PlatformsSerializer.save()`) để chuyển đổi các tham chiếu đối tượng thành ID hoặc cấu trúc dữ liệu đơn giản.
    - Dữ liệu cuối cùng được `JSON.stringify()`.
    - `DataStore.saveToSlotAsync()` được gọi để lưu chuỗi JSON vào nơi lưu trữ đã chọn (localStorage, Steam Cloud, v.v.).
    - Một file header tóm tắt cũng được lưu (sử dụng `SaveGameData`).

6.  **Tải Game (Xem lại mục "Bắt đầu Game Mới hoặc Tiếp Tục")**.

## Thư Viện Bên Thứ Ba Chính

- **jQuery & jQuery UI**: Sử dụng rộng rãi để thao tác DOM, xử lý sự kiện, tạo hiệu ứng UI, và các widget như dialog, slider, accordion, tabs.
- **EaselJS, TweenJS, SoundJS, PreloadJS (CreateJS Suite)**:
  - `EaselJS`: Thư viện chính cho việc vẽ và quản lý các đối tượng đồ họa 2D trên HTML5 Canvas (Stage, Container, Bitmap, Shape, Text).
  - `TweenJS`: Tạo các animation dựa trên tween cho các thuộc tính của đối tượng EaselJS hoặc các đối tượng JavaScript khác.
  - `SoundJS`: Quản lý việc tải và phát âm thanh, nhạc nền.
  - `PreloadJS`: Hỗ trợ tải trước các tài nguyên (âm thanh, hình ảnh).
- **GreenSock Animation Platform (GSAP)**: (TweenMax, Draggable, CustomEase, ThrowPropsPlugin)
  - Thư viện animation mạnh mẽ, được sử dụng cho các hiệu ứng UI phức tạp hơn, các animation trong game, và tạo các element có thể kéo thả (Draggable).
- **SimpleModal**: Thư viện để tạo các dialog modal.
  _Lưu ý: Mã nguồn cũng sử dụng jQuery UI Dialog, có thể có sự chồng chéo hoặc tùy biến._
- **RoyalSlider**: Thư viện để tạo các slider/carousel, được sử dụng trong các UI lựa chọn (ví dụ: chọn gian hàng hội chợ, chọn ứng viên, chọn hợp đồng).
- **html5Preloader**: Thư viện hỗ trợ tải trước tài nguyên.
- **Mersenne Twister**: Bộ sinh số ngẫu nhiên (RNG) chất lượng cao.
- **JSZip**: Thư viện để tạo và đọc các file nén ZIP, được sử dụng trong tính năng chia sẻ save code (upload/download).
- **RequireJS**: Mặc dù được liệt kê, nhưng trong `index.html` hiện tại, các file được tải tuần tự bằng thẻ `<script>`. Có thể RequireJS được sử dụng trong một số bối cảnh cụ thể (ví dụ: tải file locale cho jQuery Timeago) hoặc là một tàn dư từ quá trình phát triển.
- **mkdirp.js**: Thư viện Node.js để tạo thư mục (sử dụng trong môi trường NW.js, cụ thể là `SteamGreenworks.js`).
- **FontAwesome**: Bộ icon font, được sử dụng cho các icon trên UI.
- **Tailwind CSS**: Framework CSS tiện ích, được sử dụng để tạo style cho các thành phần UI.
- **jQuery Timeago**: Plugin jQuery để hiển thị thời gian tương đối (ví dụ: "2 minutes ago").
- **jQuery ArcsText**: Plugin jQuery để hiển thị văn bản theo đường cong.
- **jQuery Touch Punch**: Thêm hỗ trợ cảm ứng cho các widget jQuery UI.
