// Định nghĩa đối tượng LevelCalculator để quản lý các tính toán liên quan đến level và kinh nghiệm.
var LevelCalculator = {};

(function () {
    // Gán LevelCalculator cho biến local 'calculatorModule' để dễ truy cập và code ngắn gọn hơn.
    var calculatorModule = LevelCalculator;

    // Mảng 'xpThresholds' lưu trữ các ngưỡng điểm kinh nghiệm (XP) cần thiết để đạt được các level từ 2 trở đi.
    // Ví dụ: Cần 350 XP để đạt level 2, 900 XP để đạt level 3, v.v.
    // Level 1 mặc định là 0 XP.
    var xpThresholds = [350, 900, 1600, 2400, 3400, 4400, 5500, 7E3, 9500, 14E3, 2E4, 36E3, 6E4, 1E5]; // 7E3 = 7000, 1E5 = 100000

    /**
     * Lấy level hiện tại của một bộ phận engine dựa trên kinh nghiệm của nó.
     * @param {object} companyData - Dữ liệu công ty (hoặc đối tượng chứa thông tin kinh nghiệm).
     * @param {string} enginePartId - ID của bộ phận engine.
     * @returns {number} Level của bộ phận engine.
     */
    calculatorModule.getEnginePartLevel = function (companyData, enginePartId) {
        // Gọi getLevel với kinh nghiệm của bộ phận engine cụ thể.
        return this.getLevel(this.getFeatureExperience(companyData, enginePartId));
    };

    /**
     * Lấy điểm kinh nghiệm (XP) của một feature (tính năng/công nghệ) cụ thể.
     * @param {object} companyData - Dữ liệu công ty (tham số này dường như không được sử dụng trực tiếp trong hàm này, có thể là một phần của API chung).
     * @param {string} featureId - ID của feature.
     * @returns {number} Điểm kinh nghiệm của feature.
     */
    calculatorModule.getFeatureExperience = function (companyData, featureId) {
        // Tìm feature trong danh sách tất cả các item nghiên cứu và trả về kinh nghiệm của nó.
        return Research.getAllItems().first(function (researchItem) {
            return researchItem.id === featureId;
        }).experience;
    };

    /**
     * Lấy level hiện tại của một feature (tính năng/công nghệ) dựa trên kinh nghiệm của nó.
     * @param {object} companyData - Dữ liệu công ty.
     * @param {string} featureId - ID của feature.
     * @returns {number} Level của feature, hoặc 0 nếu có lỗi.
     */
    calculatorModule.getFeatureLevel = function (companyData, featureId) {
        var calculatedLevel;
        try {
            // Tính level dựa trên kinh nghiệm của feature.
            calculatedLevel = this.getLevel(this.getFeatureExperience(companyData, featureId));
        } catch (error) {
            // Nếu có lỗi (ví dụ: feature không tìm thấy), trả về level 0.
            calculatedLevel = 0;
        }
        return calculatedLevel;
    };

    /**
     * Lấy level hiện tại của một mission (nhiệm vụ trong game) dựa trên kinh nghiệm của nó.
     * @param {object|string} missionInput - Đối tượng mission hoặc ID của mission.
     * @returns {number} Level của mission.
     */
    calculatorModule.getMissionLevel = function (missionInput) {
        // Nếu missionInput là ID, lấy đối tượng mission từ ID đó.
        var missionObject = missionInput.id ? missionInput : Missions.getMissionWithId(missionInput);
        // Tính level dựa trên kinh nghiệm của mission.
        return this.getLevel(missionObject.experience);
    };

    /**
     * Tính toán hệ số bonus dựa trên level.
     * Level càng cao, bonus càng lớn (tăng 0.05 cho mỗi level sau level 1).
     * @param {number} currentExperience - Điểm kinh nghiệm hiện tại.
     * @returns {number} Hệ số bonus.
     */
    calculatorModule.getLevelBonusFactor = function (currentExperience) {
        var currentLevel = calculatorModule.getLevel(currentExperience);
        // Level 1 không có bonus. Mỗi level tăng thêm 0.05 bonus.
        return 1 === currentLevel ? 1 : 1 + (currentLevel - 1) / 10 * 0.5; // (level - 1) * 0.05
    };

    /**
     * Tính toán số XP cần thiết để đạt một level cụ thể (có thể là số thập phân, dùng để nội suy).
     * @param {number} targetLevelDecimal - Level mục tiêu (có thể là số thập phân, ví dụ 3.5).
     * @returns {number} Số XP cần thiết.
     */
    calculatorModule.getXpForLevel = function (targetLevelDecimal) {
        var targetLevelFloor = Math.floor(targetLevelDecimal); // Level làm tròn xuống
        var levelFraction = targetLevelDecimal - targetLevelFloor; // Phần thập phân của level
        // XP cơ bản cho 'targetLevelFloor'. Nếu level là 1, XP là 0.
        // Nếu targetLevelFloor vượt quá số level định nghĩa trong 'xpThresholds', lấy ngưỡng XP cuối cùng.
        var baseXP = 1 == targetLevelFloor ? 0 : xpThresholds.length < targetLevelDecimal ? xpThresholds.last() : xpThresholds[targetLevelFloor - 2];

        // Nếu level < 5 và có phần thập phân, nội suy XP giữa level hiện tại và level tiếp theo.
        // Điều này có vẻ là một cơ chế đặc biệt cho các level đầu.
        if (5 > targetLevelDecimal && 0 != levelFraction) {
            // XP cho level tiếp theo (targetLevelFloor + 1).
            var nextLevelXP = (1 == targetLevelFloor + 1 ? 0 : xpThresholds.length < targetLevelDecimal ? xpThresholds.last() : xpThresholds[targetLevelFloor - 1]); // Chú ý: index là targetLevelFloor - 1 vì xpThresholds bắt đầu từ level 2
            baseXP += (nextLevelXP - baseXP) * levelFraction; // Nội suy tuyến tính phần XP tăng thêm
        }
        return baseXP;
    };

    /**
     * Xác định level hiện tại dựa trên tổng số XP.
     * @param {number} currentExperience - Tổng số XP hiện tại.
     * @returns {number} Level hiện tại.
     */
    calculatorModule.getLevel = function (currentExperience) {
        // Cờ debug, nếu bật và không có kinh nghiệm được cung cấp, sẽ báo lỗi.
        if (GameFlags.ghg6 && void 0 === currentExperience) throw "no experience provided";

        // Tìm ngưỡng XP cuối cùng trong mảng 'xpThresholds' mà 'currentExperience' lớn hơn hoặc bằng.
        var lastThresholdPassed = xpThresholds.last(function (threshold) {
            return currentExperience >= threshold;
        });
        // Lấy index của ngưỡng đó trong mảng.
        var thresholdIndex = xpThresholds.indexOf(lastThresholdPassed);

        // Nếu không tìm thấy ngưỡng nào (ví dụ: XP < 350), level là 1.
        // Ngược lại, level là index + 2 (vì mảng xpThresholds bắt đầu lưu trữ cho level 2).
        return -1 == thresholdIndex ? 1 : thresholdIndex + 2;
    };

    /**
     * Lấy level hiện tại dưới dạng số thập phân (ví dụ: 3.5 nghĩa là level 3 và 50% tiến trình tới level 4).
     * @param {number} currentExperience - Điểm kinh nghiệm hiện tại.
     * @returns {number} Level dưới dạng số thập phân.
     */
    calculatorModule.getLevelFractional = function (currentExperience) {
        var currentLevelInteger = calculatorModule.getLevel(currentExperience);
        var progressToNext = calculatorModule.getProgressToNextLevel(currentExperience);
        return currentLevelInteger + progressToNext / 100;
    };

    /**
     * Tính toán tiến trình (%) đã đạt được để lên level tiếp theo.
     * @param {number} currentExperience - Điểm kinh nghiệm hiện tại.
     * @returns {number} Phần trăm tiến trình (0-100).
     */
    calculatorModule.getProgressToNextLevel = function (currentExperience) {
        var xpForNextLevel = calculatorModule.getXpToNextLevel(currentExperience); // XP cần cho level tiếp theo
        var currentLevel = calculatorModule.getLevel(currentExperience); // Level hiện tại
        var xpForCurrentLevel = calculatorModule.getXpForLevel(currentLevel); // XP cần để đạt level hiện tại

        // Nếu XP cần cho level tiếp theo bằng XP cần cho level hiện tại (ví dụ: max level), tiến trình là 0.
        // Ngược lại, tính phần trăm.
        return 0 == xpForNextLevel - xpForCurrentLevel ? 0 : (currentExperience - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel) * 100;
    };

    /**
     * Tính toán tiến trình (%) từ level (targetLevel - 1) đến một 'targetLevel' nhất định với 'currentExperience'.
     * @param {number} targetLevel - Level mục tiêu muốn tính tiến trình đến.
     * @param {number} currentExperience - Điểm kinh nghiệm hiện tại.
     * @returns {number} Phần trăm tiến trình (0-100), được giới hạn trong khoảng 0-100.
     */
    calculatorModule.getProgressToLevel = function (targetLevel, currentExperience) {
        var xpForTargetLevel = calculatorModule.getXpForLevel(targetLevel); // XP cần cho level mục tiêu
        var xpForPreviousLevel = 0;
        // Nếu level mục tiêu > 1, lấy XP cần cho level trước đó.
        if (1 < targetLevel) {
            xpForPreviousLevel = calculatorModule.getXpForLevel(targetLevel - 1);
        }
        // Tính phần trăm và giới hạn trong khoảng 0-100.
        return ((currentExperience - xpForPreviousLevel) / (xpForTargetLevel - xpForPreviousLevel) * 100).clamp(0, 100);
    };

    /**
     * Lấy số XP cần thiết để đạt được level tiếp theo từ 'currentExperience'.
     * @param {number} currentExperience - Điểm kinh nghiệm hiện tại.
     * @returns {number} Số XP cần cho level tiếp theo.
     */
    calculatorModule.getXpToNextLevel = function (currentExperience) {
        var currentLevel = calculatorModule.getLevel(currentExperience);
        // Nếu level hiện tại vượt quá số level định nghĩa trong 'xpThresholds', trả về ngưỡng XP cuối cùng (max level).
        // Ngược lại, trả về ngưỡng XP cho level tiếp theo (currentLevel - 1 vì mảng index từ 0).
        return xpThresholds.length <= currentLevel ? xpThresholds.last() : xpThresholds[currentLevel - 1];
    };
})();