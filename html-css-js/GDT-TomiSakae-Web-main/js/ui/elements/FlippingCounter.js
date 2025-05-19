var FlippingCounter = {};
(function () {
    // Đặt alias cho FlippingCounter để code ngắn gọn hơn trong scope này
    var counterModule = FlippingCounter;

    // Biến lưu trữ panel (khung) của bộ đếm
    counterModule.panel;
    // Các đối tượng Image để tải hình ảnh cho từng chữ số từ 0 đến 9
    counterModule.img0 = new Image;
    counterModule.img1 = new Image;
    counterModule.img2 = new Image;
    counterModule.img3 = new Image;
    counterModule.img4 = new Image;
    counterModule.img5 = new Image;
    counterModule.img6 = new Image;
    counterModule.img7 = new Image;
    counterModule.img8 = new Image;
    counterModule.img9 = new Image;
    // Đối tượng Image cho panel/khung của bộ đếm
    counterModule.img10 = new Image;

    // Mảng lưu trữ các tween (hiệu ứng chuyển động) đang hoạt động của UI
    counterModule._activeUITweens;
    // Số lượng hình ảnh cần tải (10 chữ số + 1 panel)
    counterModule.loaderImageAmount = 11; // Sửa lỗi: trước đây là 10, nhưng có 11 ảnh (0-9 và panel)
    // Mảng lưu trữ các bitmap của từng chữ số sau khi tải xong
    counterModule.numberBitmapsArr = [];
    // Hình chữ nhật xác định phần trên của một chữ số trong spritesheet
    counterModule.rectUp = new createjs.Rectangle(0, 0, 104, 91);
    // Hình chữ nhật xác định phần dưới của một chữ số trong spritesheet
    counterModule.rectDown = new createjs.Rectangle(0, 91, 104, 91);

    // Hàm trả về danh sách đường dẫn của tất cả hình ảnh cần tải
    counterModule.getAllImages = function () {
        return "./images/superb/counter/0.png ./images/superb/counter/1.png ./images/superb/counter/2.png ./images/superb/counter/3.png ./images/superb/counter/4.png ./images/superb/counter/5.png ./images/superb/counter/6.png ./images/superb/counter/7.png ./images/superb/counter/8.png ./images/superb/counter/9.png ./images/superb/counter/panel.png".split(" ")
    };

    // Biến cờ để đảm bảo hàm init chỉ chạy một lần
    var isInitialized = false;

    // Hàm khởi tạo, tải tất cả hình ảnh cần thiết
    counterModule.init = function () {
        if (!isInitialized) {
            isInitialized = true;
            // Gán sự kiện onload và onerror cho từng Image object
            this.img0.onload = this.handleImageLoad; this.img1.onload = this.handleImageLoad;
            this.img2.onload = this.handleImageLoad; this.img3.onload = this.handleImageLoad;
            this.img4.onload = this.handleImageLoad; this.img5.onload = this.handleImageLoad;
            this.img6.onload = this.handleImageLoad; this.img7.onload = this.handleImageLoad;
            this.img8.onload = this.handleImageLoad; this.img9.onload = this.handleImageLoad;
            this.img10.onload = this.handleImageLoad;

            this.img0.onerror = handleErrorImageLoad; this.img1.onerror = handleErrorImageLoad;
            this.img2.onerror = handleErrorImageLoad; this.img3.onerror = handleErrorImageLoad;
            this.img4.onerror = handleErrorImageLoad; this.img5.onerror = handleErrorImageLoad;
            this.img6.onerror = handleErrorImageLoad; this.img7.onerror = handleErrorImageLoad;
            this.img8.onerror = handleErrorImageLoad; this.img9.onerror = handleErrorImageLoad;
            this.img10.onerror = handleErrorImageLoad;

            // Bắt đầu tải hình ảnh
            this.img0.src = "./images/superb/counter/0.png";
            this.img1.src = "./images/superb/counter/1.png";
            this.img2.src = "./images/superb/counter/2.png";
            this.img3.src = "./images/superb/counter/3.png";
            this.img4.src = "./images/superb/counter/4.png";
            this.img5.src = "./images/superb/counter/5.png";
            this.img6.src = "./images/superb/counter/6.png";
            this.img7.src = "./images/superb/counter/7.png";
            this.img8.src = "./images/superb/counter/8.png";
            this.img9.src = "./images/superb/counter/9.png";
            this.img10.src = "./images/superb/counter/panel.png";
        }
    };

    // Biến cờ để đảm bảo lỗi chỉ được log một lần
    var errorLogged = false;
    // Hàm xử lý khi có lỗi tải hình ảnh
    var handleErrorImageLoad = function (event) {
        if (!errorLogged) {
            Logger.LogError("Một hình ảnh của 'Flipping Counter' đã tải không chính xác, vui lòng khởi động lại hoặc cài đặt lại trò chơi.");
            errorLogged = true;
        }
    };

    // Hàm xử lý khi một hình ảnh được tải thành công
    counterModule.handleImageLoad = function (event) {
        counterModule.loaderImageAmount--;
        // Khi tất cả hình ảnh đã được tải
        if (0 == counterModule.loaderImageAmount) {
            // Tạo các đối tượng Bitmap cho từng chữ số (cả phần trên và dưới)
            for (var digit = 0; 10 > digit; digit++) {
                counterModule.numberBitmapsArr[digit] = [];
                counterModule.numberBitmapsArr[digit].up = new createjs.Bitmap(counterModule["img" + digit]);
                counterModule.numberBitmapsArr[digit].down = new createjs.Bitmap(counterModule["img" + digit]);
            }
            // Tạo Bitmap cho panel
            counterModule.panel = new createjs.Bitmap(counterModule.img10);
        }
    };

    /**
     * Hàm khởi tạo một FlippingBox, chứa nhiều FlippingNumber.
     * @param {number} numberOfDigits Số lượng chữ số trong bộ đếm.
     * @param {number} spacing Khoảng cách giữa các chữ số.
     */
    counterModule.FlippingBox = function (numberOfDigits, spacing) {
        this.container = new createjs.Container;
        var flippingNumbers = []; // Mảng lưu trữ các đối tượng FlippingNumber

        // Hàm khởi tạo các FlippingNumber và thêm vào container
        this.init = function () {
            for (var i = 0; i < numberOfDigits; i++) {
                var flippingNumberInstance = new counterModule.FlippingNumber(0); // Khởi tạo mỗi số với giá trị 0
                flippingNumberInstance.init();
                flippingNumberInstance.container.x = i * (counterModule.rectUp.width + spacing); // Đặt vị trí cho từng chữ số
                this.container.addChild(flippingNumberInstance.container);
                flippingNumbers.push(flippingNumberInstance);
            }
        };

        // Hàm để điền giá trị vào bộ đếm
        this.fill = function (valueToDisplay) {
            // Chuyển giá trị thành chuỗi, cắt theo số lượng chữ số và tách thành mảng các ký tự
            valueToDisplay = String(valueToDisplay).split("").splice(0, numberOfDigits);
            var leadingZerosNeeded = numberOfDigits - valueToDisplay.length;

            // Thêm các số 0 vào đầu nếu cần
            if (0 < leadingZerosNeeded) {
                for (var i = 0; i < leadingZerosNeeded; i++) {
                    valueToDisplay.splice(0, 0, "0");
                }
            }
            // Đặt giá trị cho từng FlippingNumber
            for (var i = 0; i < flippingNumbers.length; i++) {
                flippingNumbers[i].setNumber(!1 == counterModule.is_int(valueToDisplay[i]) ? 0 : valueToDisplay[i]);
            }
        }
    };

    // Hàm kiểm tra một giá trị có phải là số nguyên hợp lệ không
    counterModule.is_int = function (value) {
        return parseFloat(value) != parseInt(value, 10) || isNaN(value) ? false : true;
    };

    /**
     * Hàm khởi tạo một FlippingNumber, đại diện cho một chữ số có thể lật.
     * @param {number} initialDigit Chữ số ban đầu.
     */
    counterModule.FlippingNumber = function (initialDigit) {
        // Hàm xử lý khi hiệu ứng lật xuống hoàn tất (phần trên đã lật xong)
        function animateLowerHalfDown() {
            // Tạo bitmap cho phần dưới của chữ số mới
            lowerHalfNextBitmap = counterModule.numberBitmapsArr[nextDigitToDisplay].down.clone();
            lowerHalfNextBitmap.sourceRect = counterModule.rectDown; // Chỉ lấy phần dưới
            lowerHalfNextBitmap.scaleY = 0; // Bắt đầu với scaleY = 0 để tạo hiệu ứng lật
            lowerHalfNextBitmap.y = 91; // Vị trí y của phần dưới
            this.container.addChild(lowerHalfNextBitmap);

            Sound.playSoundOnce("flipflap", 0.5); // Phát âm thanh lật

            // Nếu không còn số nào trong hàng đợi, sử dụng tốc độ lật "cuối cùng" (chậm hơn, có hiệu ứng ease)
            // Ngược lại, sử dụng tốc độ lật bình thường
            if (0 == digitQueue.length && 0 == pendingDigits.length) {
                counterModule._activeUITweens.push(createjs.Tween.get(lowerHalfNextBitmap).to({
                    scaleX: 1,
                    scaleY: 1 // Lật phần dưới xuống
                }, this.speedUltimateDown, createjs.Ease.backOut).call(onFlipComplete, null, this));
            } else {
                counterModule._activeUITweens.push(createjs.Tween.get(lowerHalfNextBitmap).to({
                    scaleX: 1,
                    scaleY: 1
                }, this.speedDown, createjs.Ease.linear).call(onFlipComplete, null, this));
            }
        }

        // Hàm xử lý sau khi một chữ số đã lật hoàn toàn
        function onFlipComplete() {
            // Loại bỏ các bitmap cũ
            this.container.removeChild(upperHalfCurrentBitmap);
            this.container.removeChild(lowerHalfCurrentBitmap);

            // Gán các bitmap mới thành bitmap hiện tại
            upperHalfCurrentBitmap = upperHalfNextBitmap;
            lowerHalfCurrentBitmap = lowerHalfNextBitmap;
            this.currentDigit = nextDigitToDisplay; // Cập nhật chữ số hiện tại

            // Nếu vẫn còn chữ số trong hàng đợi, tiếp tục lật
            if (0 < digitQueue.length) {
                this.shiftToDigit(digitQueue[0]);
                digitQueue.splice(0, 1);
            } else {
                isFlipping = false; // Đánh dấu đã lật xong
                // Nếu có chữ số đang chờ (do setNumber được gọi khi đang lật), thì lật đến số đó
                if (0 < pendingDigits.length) {
                    console.log(pendingDigits[pendingDigits.length - 1], pendingDigits); // Log gỡ lỗi
                    this.setNumber(pendingDigits[pendingDigits.length - 1]); // Lấy số cuối cùng trong hàng đợi chờ
                    pendingDigits = []; // Xóa hàng đợi chờ
                }
            }
        }

        this.container = new createjs.Container; // Container cho các phần của chữ số
        this.currentDigit = initialDigit; // Chữ số hiện tại đang hiển thị

        // Tốc độ cho hiệu ứng lật
        this.speedDown = this.speedUp = 100;         // Tốc độ lật bình thường
        this.speedUltimateUp = 250;    // Tốc độ lật lên cho chữ số cuối cùng
        this.speedUltimateDown = 500;  // Tốc độ lật xuống cho chữ số cuối cùng

        // Bitmap cho phần trên và dưới của chữ số hiện tại
        var upperHalfCurrentBitmap = counterModule.numberBitmapsArr[this.currentDigit].up.clone();
        var lowerHalfCurrentBitmap = counterModule.numberBitmapsArr[this.currentDigit].down.clone();

        // Bitmap cho phần trên và dưới của chữ số kế tiếp (trong quá trình lật)
        var upperHalfNextBitmap, lowerHalfNextBitmap;
        var nextDigitToDisplay; // Chữ số kế tiếp sẽ hiển thị
        var isFlipping = false; // Cờ cho biết chữ số có đang trong quá trình lật hay không

        var digitQueue = []; // Hàng đợi các chữ số cần lật tuần tự
        var pendingDigits = []; // Hàng đợi các chữ số được gọi setNumber trong khi đang lật

        // Hàm khởi tạo, thiết lập các thuộc tính cho bitmap phần trên và dưới
        this.init = function () {
            upperHalfCurrentBitmap.sourceRect = counterModule.rectUp; // Chỉ lấy phần trên của ảnh
            upperHalfCurrentBitmap.regY = upperHalfCurrentBitmap.y = 91; // Đặt điểm neo và vị trí y để lật quanh trục giữa
            lowerHalfCurrentBitmap.sourceRect = counterModule.rectDown; // Chỉ lấy phần dưới của ảnh
            lowerHalfCurrentBitmap.y = 91; // Vị trí y của phần dưới

            this.container.addChild(upperHalfCurrentBitmap);
            this.container.addChild(lowerHalfCurrentBitmap);
        };

        // Hàm đặt giá trị mới cho chữ số
        this.setNumber = function (newDigit) {
            if (isFlipping == false) { // Nếu không đang lật
                if (newDigit != this.currentDigit) { // Nếu chữ số mới khác chữ số hiện tại
                    isFlipping = true; // Đánh dấu bắt đầu lật
                    var nextSequentialDigit;
                    if (newDigit > this.currentDigit) { // Lật tăng
                        nextSequentialDigit = this.currentDigit + 1;
                    } else { // Lật giảm (hoặc lật vòng từ 9 về 0)
                        // Thêm các số từ hiện tại + 1 đến 9 vào hàng đợi
                        for (nextSequentialDigit = this.currentDigit + 1; 9 >= nextSequentialDigit; nextSequentialDigit++) {
                            digitQueue.push(nextSequentialDigit);
                        }
                        nextSequentialDigit = 0; // Bắt đầu từ 0
                    }
                    // Thêm các số từ nextSequentialDigit đến newDigit vào hàng đợi
                    for (; nextSequentialDigit <= newDigit; nextSequentialDigit++) {
                        digitQueue.push(nextSequentialDigit);
                    }

                    // Bắt đầu lật chữ số đầu tiên trong hàng đợi
                    this.shiftToDigit(digitQueue[0]);
                    digitQueue.splice(0, 1); // Xóa chữ số đã bắt đầu lật khỏi hàng đợi
                }
            } else { // Nếu đang lật, thêm chữ số mới vào hàng đợi chờ
                pendingDigits.push(newDigit);
            }
        };

        // Hàm bắt đầu lật đến một chữ số cụ thể (chỉ lật phần trên)
        this.shiftToDigit = function (targetDigit) {
            nextDigitToDisplay = targetDigit; // Lưu chữ số sẽ hiển thị sau khi lật

            // Tạo bitmap cho phần trên của chữ số mới
            upperHalfNextBitmap = counterModule.numberBitmapsArr[nextDigitToDisplay].up.clone();
            upperHalfNextBitmap.sourceRect = counterModule.rectUp;
            upperHalfNextBitmap.regY = upperHalfNextBitmap.y = 91;
            this.container.addChild(upperHalfNextBitmap); // Thêm vào container
            // Đảm bảo phần trên của chữ số mới được vẽ trên phần trên của chữ số cũ
            this.container.swapChildren(upperHalfNextBitmap, upperHalfCurrentBitmap);

            // Xác định tốc độ lật
            var flipSpeed = (0 == digitQueue.length) ? this.speedUltimateUp : this.speedUp;

            // Tạo hiệu ứng lật phần trên của chữ số hiện tại lên (scaleY về 0)
            // Khi hoàn tất, gọi hàm animateLowerHalfDown để lật phần dưới xuống
            counterModule._activeUITweens.push(createjs.Tween.get(upperHalfCurrentBitmap).to({
                scaleX: 1, // Giữ nguyên scaleX
                scaleY: 0  // Thu nhỏ scaleY về 0
            }, flipSpeed, createjs.Ease.linear).call(animateLowerHalfDown, null, this));
        }
    }
})();