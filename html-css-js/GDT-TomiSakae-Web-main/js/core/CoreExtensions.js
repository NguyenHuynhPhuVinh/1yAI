// --- START OF FILE CoreExtensions.js ---

(function () {
    // ----- Number Prototype Extensions -----

    // IIFE để tùy chỉnh Number.prototype.toLocaleString
    (function (originalToLocaleString) { // originalToLocaleString được truyền vào nhưng không sử dụng trực tiếp
        var decimalSeparator = (0.12).toLocaleString().charAt(1); // Lấy ký tự phân cách thập phân từ hệ thống
        var thousandSeparator = "." === decimalSeparator ? "," : "."; // Xác định ký tự phân cách hàng nghìn dựa trên ký tự thập phân

        // Ghi đè phương thức toLocaleString nếu định dạng mặc định không phải là "1,000.00"
        if ("1,000.00" !== (1000).toLocaleString()) {
            Number.prototype.toLocaleString = function () {
                var absoluteValue = Math.abs(this);
                var fractionPart = absoluteValue.toFixed(2).slice(-2); // Lấy 2 chữ số thập phân
                // Lấy phần nguyên, thêm dấu phân cách hàng nghìn, sau đó ghép với phần thập phân
                var integerPartWithSeparators = absoluteValue.toFixed(2).slice(0, -3).replace(/(?=(?!^)(?:\d{3})+(?!\d))/g, thousandSeparator) + decimalSeparator + fractionPart;
                return 0 > this ? "-" + integerPartWithSeparators : integerPartWithSeparators; // Thêm dấu âm nếu cần
            };
        }
    })(Number.prototype.toLocaleString); // Truyền vào phương thức gốc, mặc dù không được sử dụng trong IIFE này

    Number.prototype.clamp = function (min, max) {
        // Giới hạn một số trong khoảng [min, max]
        return Math.min(Math.max(this, min), max);
    };

    // ----- String Prototype Extensions -----

    String.prototype.format = function () {
        // Cho phép định dạng chuỗi tương tự C# String.Format, ví dụ: "Hello {0}".format("World")
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] !== 'undefined' ? args[number] : match;
        });
    };

    String.prototype.log = function () {
        // Ghi log chuỗi ra console nếu cờ debug GameFlags.ghg6 được bật
        if (GameFlags && GameFlags.ghg6) { // Kiểm tra GameFlags tồn tại trước khi truy cập
            console.log(this.toString()); // Đảm bảo this là một chuỗi
        }
    };

    String.prototype.replaceAll = function (search, replacement) {
        // Thay thế tất cả các lần xuất hiện của một chuỗi con bằng một chuỗi khác
        return this.split(search).join(replacement);
    };

    // Polyfill cho String.prototype.startsWith nếu trình duyệt chưa hỗ trợ
    if (typeof String.prototype.startsWith !== 'function') {
        String.prototype.startsWith = function (prefix) {
            return this.slice(0, prefix.length) === prefix;
        };
    }

    String.prototype.replaceAt = function (index, replacement) {
        // Thay thế ký tự tại một vị trí cụ thể trong chuỗi
        return this.substr(0, index) + replacement + this.substr(index + replacement.length);
    };


    // ----- Array Prototype Extensions -----

    Array.prototype.weakIndexOf = function (searchElement) {
        // Tìm kiếm phần tử trong mảng sử dụng so sánh lỏng (==)
        for (var i = 0; i < this.length; i++) {
            if (this[i] == searchElement) return i;
        }
        return -1;
    };

    Array.prototype.pickRandom = function (rngSource) {
        // Chọn một phần tử ngẫu nhiên từ mảng
        // rngSource có thể là một đối tượng cung cấp hàm random() (ví dụ: MersenneTwister)
        // hoặc sử dụng GameManager.company.getRandom() hoặc Math.random()
        var randomNumberGenerator = (!rngSource && typeof GameManager !== 'undefined' && GameManager.company)
            ? GameManager.company.getRandom()
            : (rngSource && typeof rngSource.random === 'function')
                ? rngSource.random()
                : Math.random();
        return this[Math.min(this.length - 1, Math.floor(randomNumberGenerator * this.length))];
    };

    Array.prototype.shuffle = function (rngSource) {
        // Xáo trộn các phần tử của mảng (Fisher-Yates shuffle) và trả về một mảng mới
        if (this.length <= 1) return this.slice(); // Không cần xáo trộn mảng có 0 hoặc 1 phần tử

        var indices = [];
        for (var i = 0; i < this.length; i++) indices.push(i);

        var shuffledArray = [];
        for (var j = 0; j < this.length; j++) {
            var randomIndexInIndices = indices.pickRandom(rngSource); // Chọn ngẫu nhiên một index từ mảng indices
            indices.remove(randomIndexInIndices); // Xóa index đã chọn khỏi mảng indices để không chọn lại
            shuffledArray.push(this[randomIndexInIndices]); // Thêm phần tử tương ứng vào mảng đã xáo trộn
        }
        return shuffledArray;
    };

    Array.prototype.insertAt = function (index, item) {
        // Chèn một phần tử vào vị trí cụ thể trong mảng
        this.splice(index, 0, item);
    };

    Array.prototype.getPrevious = function (currentIndex) {
        // Lấy phần tử đứng trước phần tử tại currentIndex
        var previousIndex = currentIndex - 1;
        return (previousIndex < 0 || previousIndex >= this.length) ? null : this[previousIndex];
    };

    Array.prototype.first = function (predicate) {
        // Trả về phần tử đầu tiên thỏa mãn điều kiện (predicate)
        // Nếu không có predicate, trả về phần tử đầu tiên của mảng (nếu có)
        if (!predicate) return this.length > 0 ? this[0] : null;

        for (var i = 0; i < this.length; i++) {
            var currentItem = this[i];
            if (predicate(currentItem)) return currentItem;
        }
        return null;
    };

    Array.prototype.last = function (predicate) {
        // Trả về phần tử cuối cùng thỏa mãn điều kiện (predicate)
        // Nếu không có predicate, trả về phần tử cuối cùng của mảng (nếu có)
        if (!predicate) return this.length > 0 ? this[this.length - 1] : null;

        for (var i = this.length - 1; i >= 0; i--) {
            var currentItem = this[i];
            if (predicate(currentItem)) return currentItem;
        }
        return null;
    };

    Array.prototype.count = function (predicate) {
        // Đếm số phần tử thỏa mãn điều kiện (predicate)
        // Nếu không có predicate, trả về tổng số phần tử
        return predicate ? this.filter(predicate).length : this.length;
    };

    Array.prototype.average = function (selectorFunction) {
        // Tính trung bình của các phần tử trong mảng
        // selectorFunction (tùy chọn) dùng để chọn giá trị từ mỗi phần tử để tính tổng
        return this.length <= 0 ? 0 : this.sum(selectorFunction) / this.length;
    };

    Array.prototype.max = function (selectorFunction) {
        // Tìm giá trị lớn nhất trong mảng
        // selectorFunction (tùy chọn) dùng để chọn giá trị từ mỗi phần tử để so sánh
        var maxValue = NaN;
        for (var i = 0; i < this.length; i++) {
            var currentValue = selectorFunction ? selectorFunction(this[i]) : this[i];
            if (isNaN(maxValue) || currentValue > maxValue) maxValue = currentValue;
        }
        return maxValue;
    };

    Array.prototype.min = function (selectorFunction) {
        // Tìm giá trị nhỏ nhất trong mảng
        // selectorFunction (tùy chọn) dùng để chọn giá trị từ mỗi phần tử để so sánh
        var minValue = NaN;
        for (var i = 0; i < this.length; i++) {
            var currentValue = selectorFunction ? selectorFunction(this[i]) : this[i];
            if (isNaN(minValue) || currentValue < minValue) minValue = currentValue;
        }
        return minValue;
    };

    Array.prototype.sum = function (selectorFunction) {
        // Tính tổng các phần tử trong mảng
        // selectorFunction (tùy chọn) dùng để chọn giá trị từ mỗi phần tử để tính tổng
        var totalSum = 0;
        for (var i = 0; i < this.length; i++) {
            var currentValue = selectorFunction ? selectorFunction(this[i]) : this[i];
            totalSum = totalSum + currentValue;
        }
        return totalSum;
    };

    Array.prototype.except = function (itemsToExclude) {
        // Trả về một mảng mới không chứa các phần tử có trong mảng itemsToExclude
        return this.filter(function (item) {
            return itemsToExclude.indexOf(item) === -1;
        });
    };

    Array.prototype.skip = function (count) {
        // Bỏ qua 'count' phần tử đầu tiên và trả về phần còn lại của mảng
        return this.length < count ? [] : this.slice(count, this.length);
    };

    Array.prototype.addRange = function (itemsToAdd) {
        // Thêm các phần tử từ mảng itemsToAdd vào cuối mảng hiện tại
        this.addRangeAt(this.length, itemsToAdd);
    };

    Array.prototype.addRangeAt = function (index, itemsToAdd) {
        // Thêm các phần tử từ mảng itemsToAdd vào mảng hiện tại tại vị trí index
        if (itemsToAdd && itemsToAdd.length !== 0) {
            if (typeof index === 'undefined') index = this.length;
            // Chèn ngược để giữ đúng thứ tự của itemsToAdd
            for (var i = itemsToAdd.length - 1; i >= 0; i--) {
                this.splice(index, 0, itemsToAdd[i]);
            }
        }
    };

    Array.prototype.remove = function (itemToRemove) {
        // Xóa lần xuất hiện đầu tiên của itemToRemove khỏi mảng
        var index = this.indexOf(itemToRemove);
        if (index < 0) return this; // Trả về mảng gốc nếu không tìm thấy
        this.splice(index, 1);
        // Không trả về gì (hoặc trả về this nếu muốn chain) vì splice đã thay đổi mảng gốc
    };

    Array.prototype.groupBy = function (keySelectorFunction) {
        // Nhóm các phần tử của mảng dựa trên giá trị trả về từ keySelectorFunction
        // Lưu ý: Cách triển khai này sắp xếp lại mảng theo nhóm, không trả về đối tượng nhóm.
        if (!keySelectorFunction) return this;

        var uniqueKeys = [];
        var groups = {}; // Sử dụng object để lưu các nhóm, key là index của uniqueKey trong uniqueKeys
        for (var i = 0; i < this.length; i++) {
            var currentItem = this[i];
            var key = keySelectorFunction(currentItem);
            var keyIndex = uniqueKeys.indexOf(key);
            if (keyIndex === -1) {
                uniqueKeys.push(key);
                keyIndex = uniqueKeys.length - 1;
                groups[keyIndex] = [];
            }
            groups[keyIndex].push(currentItem);
        }

        var groupedArray = [];
        for (var j = 0; j < uniqueKeys.length; j++) {
            groupedArray.addRange(groups[j]); // Sử dụng addRange đã định nghĩa ở trên
        }
        return groupedArray;
    };

    // ----- Math Object Extensions -----

    Math.randomSign = function () {
        // Trả về -1 hoặc 1 một cách ngẫu nhiên
        // Sử dụng nguồn ngẫu nhiên từ GameManager nếu có, ngược lại dùng Math.random()
        var randomNumberGenerator = (typeof GameManager !== 'undefined' && GameManager.company)
            ? GameManager.company.getRandom()
            : Math.random();
        return (Math.floor(2 * randomNumberGenerator) === 0) ? -1 : 1;
    };

    Math.roundToDecimals = function (number, decimalPlaces) {
        // Làm tròn một số đến số chữ số thập phân nhất định
        var factor = Math.pow(10, decimalPlaces);
        return Math.round(number * factor) / factor;
    };


    // ----- MersenneTwister Prototype Extension -----
    // Giả sử MersenneTwister là một đối tượng/constructor đã được định nghĩa ở đâu đó
    if (typeof MersenneTwister !== 'undefined') {
        MersenneTwister.prototype.randomSign = function () {
            // Trả về -1 hoặc 1 sử dụng hàm random của đối tượng MersenneTwister
            return (Math.floor(2 * this.random()) === 0) ? -1 : 1;
        };
    }


    // ----- jQuery Extensions -----
    // Kiểm tra jQuery tồn tại trước khi mở rộng
    if (typeof jQuery !== 'undefined') {
        jQuery.fn.extend({
            enableActiveClassOnClick: function () {
                // Thêm/xóa class "active" khi nhấn chuột xuống/thả ra/rời khỏi
                return $(this).on("mousedown mouseup mouseleave", function (event) {
                    $(this).toggleClass("active", event.type === "mousedown");
                });
            }
        });

        jQuery.fn.extend({
            disableDrag: function () {
                // Ngăn chặn hành vi kéo (drag) mặc định của trình duyệt
                return $(this).on("dragstart", function (event) {
                    event.preventDefault();
                });
            }
        });

        jQuery.fn.extend({
            clickExcl: function (handler) {
                // Gắn sự kiện click, trước đó kích hoạt active class và gỡ bỏ các handler click cũ
                return $(this).enableActiveClassOnClick().unbind("click").click(handler);
            }
        });

        jQuery.fn.extend({
            clickExclOnce: function (handler) {
                // Tương tự clickExcl, nhưng chỉ thực thi handler một lần
                return $(this).enableActiveClassOnClick().unbind("click").one("click", handler);
            }
        });

        jQuery.fn.extend({
            contextMenuExclOnce: function (handler) {
                // Gắn sự kiện contextmenu (chuột phải) một lần, gỡ bỏ các handler cũ
                return $(this).unbind("contextmenu").one("contextmenu", handler);
            }
        });
    }

    // ----- Date Prototype Extension -----

    // Polyfill cho Date.prototype.toISOString nếu trình duyệt chưa hỗ trợ
    if (!Date.prototype.toISOString) {
        (Date.prototype.toISOString = function () {
            function pad(number) { // Hàm tiện ích để thêm số 0 vào trước nếu số nhỏ hơn 10
                return number < 10 ? "0" + number : number;
            }
            return this.getUTCFullYear() +
                "-" + pad(this.getUTCMonth() + 1) +
                "-" + pad(this.getUTCDate()) +
                "T" + pad(this.getUTCHours()) +
                ":" + pad(this.getUTCMinutes()) +
                ":" + pad(this.getUTCSeconds()) +
                "Z"; // Định dạng ISO 8601
        });
    }
})();