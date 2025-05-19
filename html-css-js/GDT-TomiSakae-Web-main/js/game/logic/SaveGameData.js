"use strict";

// Định nghĩa một constructor function (lớp) tên là SaveGameData.
// Lớp này dùng để lưu trữ thông tin tóm tắt (header) của một file save game.
// Thông tin này thường được hiển thị trong danh sách các save game để người chơi chọn.
var SaveGameData = function (slotId, companyName, cashAmount, fanCount, currentWeekNumber, saveTimestamp, activeMods, isPirateMode) {
    // slotId: Mã định danh của ô lưu game (ví dụ: "auto", "1", "2", ...)
    this.slot = slotId;
    // companyName: Tên công ty của người chơi trong save game này.
    this.companyName = companyName;
    // cashAmount: Số tiền mặt hiện tại của công ty.
    this.cash = cashAmount;
    // fanCount: Số lượng người hâm mộ của công ty.
    this.fans = fanCount;
    // currentWeekNumber: Số tuần hiện tại trong game (tính từ đầu game).
    this.currentWeek = currentWeekNumber;
    // saveTimestamp: Dấu thời gian (timestamp) khi game được lưu.
    this.saveTime = saveTimestamp;
    // activeMods: Một mảng hoặc đối tượng chứa thông tin về các mod đang được kích hoạt (nếu có).
    this.mods = activeMods;
    // isPirateMode: Cờ cho biết liệu chế độ "cướp biển" (khó hơn, ít doanh thu hơn) có được bật hay không.
    this.pirateMode = isPirateMode;
};

// Phương thức tĩnh (static method) của SaveGameData để phân tích (parse) dữ liệu header từ một chuỗi JSON hoặc một đối tượng.
// Phương thức này được gọi khi cần đọc thông tin tóm tắt của save game từ nơi lưu trữ.
SaveGameData.parseFromHeaderData = function (slotIdInput, headerDataInput) {
    // Kiểm tra xem headerDataInput có phải là một chuỗi JSON không.
    // Nếu đúng, phân tích nó thành một đối tượng JavaScript.
    if ("string" == typeof headerDataInput || headerDataInput instanceof String) {
        headerDataInput = JSON.parse(headerDataInput);
    }

    // Nếu sau khi phân tích (hoặc ban đầu) headerDataInput không phải là một đối tượng hợp lệ (null hoặc undefined),
    // thì trả về null, nghĩa là không có dữ liệu header hợp lệ.
    if (!headerDataInput) {
        return null;
    }

    // Đảm bảo rằng thuộc tính 'mods' luôn tồn tại trong đối tượng headerDataInput.
    // Nếu không có, gán giá trị mặc định là false.
    // Điều này giúp tránh lỗi nếu save game cũ không có thông tin về mod.
    headerDataInput.mods || (headerDataInput.mods = !1);

    // Tạo một đối tượng SaveGameData mới bằng cách sử dụng constructor function đã định nghĩa ở trên.
    // Các thuộc tính của đối tượng headerDataInput được ánh xạ vào các tham số tương ứng của constructor.
    // Lưu ý: headerDataInput.name được dùng cho companyName, headerDataInput.date được dùng cho saveTimestamp.
    return new SaveGameData(
        slotIdInput, // ID của slot save game
        headerDataInput.name, // Tên công ty
        headerDataInput.cash, // Số tiền mặt
        headerDataInput.fans, // Số lượng fan
        headerDataInput.currentWeek, // Tuần hiện tại
        headerDataInput.date, // Thời gian lưu
        headerDataInput.mods, // Thông tin mod
        headerDataInput.pirateMode // Chế độ cướp biển
    );
};