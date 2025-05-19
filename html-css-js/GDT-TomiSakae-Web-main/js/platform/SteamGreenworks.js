// --- START OF FILE SteamGreenworks.js ---

// Kiểm tra xem game có đang chạy trên Steam và Steam API có sẵn không
if (GameFlags.IS_STEAM && Steam && Steam.isAvailable()) {
    // Khai báo đối tượng Greenworks để quản lý tích hợp Steam Workshop
    var Greenworks = {};
    (function () {
        /**
         * Hiển thị tiến trình tải trên UI.
         * @param {string} message - Thông điệp tiến trình.
         * @param {number} [delay=0] - Thời gian trễ trước khi hiển thị (ms).
         */
        function displayLoadingProgress(message, delay) {
            delay ? setTimeout(function () {
                $("#greenworksLoadingProgress").html(message);
            }, delay) : $("#greenworksLoadingProgress").html(message);
        }

        /**
         * Ghi log và có thể kết thúc quá trình nếu có lỗi nghiêm trọng.
         * @param {string|Error} error - Thông điệp lỗi hoặc đối tượng lỗi.
         * @param {boolean} isFatal - Nếu true, gọi hàm kết thúc quá trình.
         */
        function logErrorAndPotentiallyQuit(error, isFatal) {
            displayLoadingProgress(error); // Hiển thị lỗi cho người dùng trên UI
            console.log(error); // Ghi lỗi vào console
            if (isFatal === true) {
                finishSynchronization(); // Gọi hàm kết thúc nếu lỗi nghiêm trọng
            }
        }

        /**
         * Lấy danh sách các thư mục con trong một thư mục.
         * @param {string} directoryPath - Đường dẫn đến thư mục.
         * @returns {string[]} - Mảng các đường dẫn thư mục con.
         */
        function getSubdirectories(directoryPath) {
            var subdirectories = [];
            if (typeof fileSystemModule === "undefined") return subdirectories; // Kiểm tra module 'fs' có tồn tại không
            try {
                var items = fileSystemModule.readdirSync(directoryPath); // Đọc nội dung thư mục
                for (var i = 0; i < items.length; i++) {
                    var itemName = items[i];
                    // Bỏ qua tên file ẩn hoặc các file đặc biệt
                    // (Phần này có thể cần điều chỉnh logic để chỉ lấy thư mục)
                    var fullItemPath = pathModule ? pathModule.resolve(directoryPath + "/" + itemName) : directoryPath + "/" + itemName;
                    if (fileSystemModule.statSync(fullItemPath).isDirectory()) {
                        subdirectories.push(fullItemPath);
                    }
                }
            } catch (error) {
                logErrorAndPotentiallyQuit(error, false); // Ghi log lỗi nếu không đọc được thư mục
            }
            return subdirectories;
        }

        /**
         * Ghi đối tượng JSON vào file package.json trong một thư mục.
         * @param {string} directoryPath - Đường dẫn đến thư mục chứa mod.
         * @param {object} packageJsonData - Dữ liệu JSON để ghi.
         * @returns {void|boolean} - True nếu thành công, undefined nếu thất bại.
         */
        function writePackageJson(directoryPath, packageJsonData) {
            if (packageJsonData) {
                try {
                    var packageJsonPath = pathModule ? pathModule.resolve(directoryPath + "/package.json") : directoryPath + "/package.json";
                    return fileSystemModule.writeFileSync(packageJsonPath, JSON.stringify(packageJsonData, null, 4));
                } catch (error) {
                    logErrorAndPotentiallyQuit("Error writing package.json: " + error, false);
                }
            }
        }

        /**
         * Trích xuất tên file từ một đường dẫn đầy đủ.
         * @param {string} filePath - Đường dẫn đầy đủ đến file.
         * @returns {string} - Tên file.
         */
        function extractFileName(filePath) {
            filePath = filePath.replaceAll("\\", "/"); // Chuẩn hóa dấu phân cách thư mục
            return filePath.substr(filePath.lastIndexOf("/") + 1);
        }

        /**
         * Trích xuất tên file không bao gồm phần mở rộng.
         * @param {string} filePath - Đường dẫn đầy đủ đến file.
         * @returns {string} - Tên file không có phần mở rộng.
         */
        function extractFileNameWithoutExtension(filePath) {
            var fileName = extractFileName(filePath);
            return fileName.lastIndexOf(".") >= 0 ? fileName.substr(0, fileName.lastIndexOf(".")) : fileName;
        }

        /**
         * Trích xuất tên của thư mục hoặc file cuối cùng từ một đường dẫn.
         * @param {string} path - Đường dẫn.
         * @returns {string} - Tên thư mục hoặc file cuối cùng.
         */
        function extractLastPathComponent(path) {
            var resolvedPath = pathModule ? pathModule.resolve(path) : path;
            return resolvedPath.lastIndexOf("/") >= 0 ? path.substr(resolvedPath.lastIndexOf("/") + 1) : path.substr(resolvedPath.lastIndexOf("\\") + 1);
        }

        /**
         * Chuẩn hóa đường dẫn file để sử dụng trong ngữ cảnh web (thêm "file:///").
         * @param {string} filePath - Đường dẫn file.
         * @returns {string} - Đường dẫn đã chuẩn hóa.
         */
        function normalizeFilePathForWeb(filePath) {
            if (filePath.substring(0, 8) !== "file:///") {
                filePath = "file:///" + filePath;
            }
            return filePath;
        }

        /**
         * Xóa một thư mục và tất cả nội dung bên trong nó (đệ quy).
         * @param {string} directoryPath - Đường dẫn đến thư mục cần xóa.
         */
        function deleteDirectoryRecursive(directoryPath) {
            greenworksHelper.isOperationOngoing = true;
            if (fileSystemModule.existsSync(directoryPath)) {
                fileSystemModule.readdirSync(directoryPath).forEach(function (itemName, index) {
                    greenworksHelper.isOperationOngoing = true;
                    var itemPath = directoryPath + "/" + itemName;
                    if (fileSystemModule.lstatSync(itemPath).isDirectory()) {
                        deleteDirectoryRecursive(itemPath); // Đệ quy xóa thư mục con
                    } else {
                        try {
                            fileSystemModule.unlinkSync(itemPath); // Xóa file
                        } catch (error) {
                            if (error) logErrorAndPotentiallyQuit(error, false);
                        }
                    }
                });

                var attempts = 0;
                /**
                 * Hàm nội bộ để thử xóa thư mục, có cơ chế thử lại.
                 * @param {string} dirToRemove - Đường dẫn thư mục cần xóa.
                 */
                var attemptRemoveDir = function (dirToRemove) {
                    try {
                        greenworksHelper.isOperationOngoing = true;
                        fileSystemModule.rmdirSync(dirToRemove);
                    } catch (error) {
                        greenworksHelper.isOperationOngoing = true;
                        // Thử lại nếu lỗi do thư mục bận hoặc không rỗng
                        if (("EBUSY" === error.code || "ENOTEMPTY" === error.code) && attempts < MAX_RETRY_ATTEMPTS) {
                            attempts++;
                            setTimeout(function () {
                                attemptRemoveDir(directoryPath); // Thử lại sau 1 giây
                            }, 1000);
                            return;
                        }
                        // Ghi log cho các lỗi khác hoặc khi đã hết số lần thử
                        if ("EBUSY" === error.code || "ENOTEMPTY" === error.code) {
                            console.log("Warning: Could not remove the folder " + dirToRemove + ", because it is currently locked by GDT. Don't worry, this folder will be deleted on the next start. You can ignore this warning.");
                        } else {
                            logErrorAndPotentiallyQuit(error, false);
                        }
                    }
                };

                if (directoryPath !== tempExtractionPath) { // Không xóa thư mục temp chính
                    attemptRemoveDir(directoryPath);
                }
            }
        }

        /**
         * Xóa một file.
         * @param {string} filePath - Đường dẫn đến file cần xóa.
         */
        function deleteFile(filePath) {
            if (fileSystemModule.existsSync(filePath)) {
                fileSystemModule.unlink(filePath, function (error) {
                    if (error) logErrorAndPotentiallyQuit(error, false);
                });
            }
        }

        /**
         * Xử lý việc giải nén và di chuyển các mod từ Steam Workshop (đệ quy).
         * @param {Array<object>} workshopItems - Danh sách các item từ Workshop.
         * @param {number} currentIndex - Chỉ số của item hiện tại đang xử lý.
         */
        function processWorkshopItems(workshopItems, currentIndex) {
            if (currentIndex >= workshopItems.length) {
                finishSynchronization(); // Hoàn tất nếu đã xử lý hết các item
                return;
            }

            greenworksHelper.isOperationOngoing = true;
            var currentItem = workshopItems[currentIndex];
            var zipFilePath = userGeneratedContentPath + "/" + extractFileName(currentItem.fileName);

            // Nếu file zip không tồn tại (ví dụ: người dùng đã hủy đăng ký và xóa thủ công)
            if (!fileSystemModule.existsSync(zipFilePath)) {
                failedDownloads.push(currentItem);
                processWorkshopItems(workshopItems, currentIndex + 1); // Chuyển sang item tiếp theo
                return;
            }

            var extractedFolderName = extractFileNameWithoutExtension(zipFilePath);
            var extractionDestPath = pathModule ? pathModule.join(tempExtractionPath, extractedFolderName) : tempExtractionPath + "/" + extractedFolderName;

            if (!fileSystemModule.existsSync(extractionDestPath)) {
                try {
                    mkdirP.sync(extractionDestPath);
                } catch (error) {
                    logErrorAndPotentiallyQuit("Error creating directory " + extractionDestPath + ": " + error, false);
                    failedDownloads.push(currentItem);
                    processWorkshopItems(workshopItems, currentIndex + 1);
                    return;
                }
            }

            displayLoadingProgress("Preparing " + currentItem.title + " " + Math.round((currentIndex + 1) / workshopItems.length / 2 * 100 + 50) + "%");

            steamworksApi.Utils.extractArchive(zipFilePath, extractionDestPath, "",
                function () { // onSucceed
                    greenworksHelper.isOperationOngoing = true;
                    moveAndFinalizeMod(zipFilePath, workshopModsPath, extractionDestPath, workshopItems, currentIndex);
                },
                function (error) { // onError
                    greenworksHelper.isOperationOngoing = true;
                    logErrorAndPotentiallyQuit("Error extracting " + zipFilePath + ": " + error, false);
                    failedDownloads.push(currentItem);
                    processWorkshopItems(workshopItems, currentIndex + 1); // Chuyển sang item tiếp theo dù lỗi
                }
            );
        }


        /**
         * Di chuyển mod đã giải nén vào thư mục mod cuối cùng và xử lý item tiếp theo.
         * @param {string} zipFileName - Tên file zip gốc (để lấy ID).
         * @param {string} finalModsDir - Đường dẫn đến thư mục mod cuối cùng.
         * @param {string} tempExtractedModDir - Đường dẫn đến thư mục mod đã giải nén tạm thời.
         * @param {Array<object>} workshopItems - Danh sách các item từ Workshop.
         * @param {number} currentIndex - Chỉ số của item hiện tại đang xử lý.
         */
        function moveAndFinalizeMod(zipFileName, finalModsDir, tempExtractedModDir, workshopItems, currentIndex) {
            greenworksHelper.isOperationOngoing = true;
            var subDirs = getSubdirectories(tempExtractedModDir); // Lấy thư mục con (thường là thư mục mod chính)
            if (subDirs.length === 0) {
                logErrorAndPotentiallyQuit("No subdirectories found in " + tempExtractedModDir + " for mod " + zipFileName, false);
                failedDownloads.push(workshopItems[currentIndex]);
                processWorkshopItems(workshopItems, currentIndex + 1);
                return;
            }
            var actualModFolderName = extractLastPathComponent(subDirs[0]); // Lấy tên thư mục mod thực tế
            var sourceModPath = pathModule ? pathModule.join(tempExtractedModDir, actualModFolderName) : tempExtractedModDir + "/" + actualModFolderName;

            var workshopItemId = extractFileNameWithoutExtension(zipFileName);
            workshopItemId = workshopItemId.substr(0, workshopItemId.indexOf("_")); // Lấy ID của Workshop Item

            // Tạo tên thư mục đích, có thể thêm prefix ID của Workshop Item
            var destinationModFolderName = actualModFolderName;
            if (actualModFolderName.substr(0, workshopItemId.length + 1) !== workshopItemId + "_") {
                destinationModFolderName = workshopItemId + "_" + actualModFolderName;
            }
            var destinationModPath = pathModule ? pathModule.join(finalModsDir, destinationModFolderName) : finalModsDir + "/" + destinationModFolderName;


            // Nếu mod đã thay đổi hoặc là mod mới, xóa thư mục cũ (nếu có)
            if (workshopItems[currentIndex].hasChanged || workshopItems[currentIndex].isNew) {
                deleteDirectoryRecursive(destinationModPath);
            }

            // Ghi đè hàm move nếu chưa có (cho một số phiên bản Greenworks/NW.js cũ)
            if (steamworksApi.Utils.move == null) {
                steamworksApi.Utils.move = function (source, dest, callback, errorCallback) {
                    fileSystemModule.rename(source, dest, function (err) {
                        err ? errorCallback && errorCallback(err) : callback && callback();
                    });
                };
            }

            steamworksApi.Utils.move(sourceModPath, destinationModPath); // Di chuyển thư mục mod
            processWorkshopItems(workshopItems, currentIndex + 1); // Xử lý item tiếp theo
        }


        /**
         * Xử lý đồng bộ hóa các mod đã tải về và xóa các mod không còn đăng ký.
         * @param {object} subscribedItemsInfo - Thông tin về các item đã đăng ký.
         */
        function synchronizeSubscribedItems(subscribedItemsInfo) {
            var workshopItemsToProcess = [];
            if (subscribedItemsInfo && subscribedItemsInfo.items) {
                workshopItemsToProcess = subscribedItemsInfo.items;
            } else if (subscribedItemsInfo) { // Xử lý trường hợp subscribedItemsInfo là mảng
                workshopItemsToProcess = subscribedItemsInfo;
            }

            var localWorkshopModFolders;
            try {
                localWorkshopModFolders = getSubdirectories(workshopModsPath + "/"); // Lấy danh sách các thư mục mod cục bộ
            } catch (error) {
                logErrorAndPotentiallyQuit("Error reading local workshop mods directory: " + error, true);
                return;
            }

            var foldersToDelete = [];
            var currentLocalFolderName = "";

            // Xác định các thư mục mod cục bộ cần xóa (không còn đăng ký trên Workshop)
            for (var i = 0; i < localWorkshopModFolders.length; i++) {
                currentLocalFolderName = extractLastPathComponent(localWorkshopModFolders[i]);
                var foundInSubscribed = false;
                if (workshopItemsToProcess.length > 0) {
                    for (var j = 0; j < workshopItemsToProcess.length; j++) {
                        // So sánh tên file (đã loại bỏ phần mở rộng) để khớp
                        if (extractFileNameWithoutExtension(workshopItemsToProcess[j].fileName).toLowerCase() === currentLocalFolderName.toLowerCase()) {
                            foundInSubscribed = true;
                            break;
                        }
                    }
                }
                if (!foundInSubscribed) {
                    foldersToDelete.push(extractFileName(currentLocalFolderName));
                }
            }


            // Xóa các thư mục mod không còn đăng ký
            if (foldersToDelete.length > 0) {
                var zipFilePathToDelete = "";
                for (var i = 0; i < foldersToDelete.length; i++) {
                    greenworksHelper.isOperationOngoing = true;
                    zipFilePathToDelete = userGeneratedContentPath + "/" + foldersToDelete[i] + ".zip";
                    deleteFile(zipFilePathToDelete); // Xóa file zip tương ứng

                    // Vô hiệu hóa mod trong game nếu nó đang được kích hoạt
                    var packageJsonData = greenworksHelper.readPackageJsonAsObject(workshopModsPath + "/" + foldersToDelete[i]);
                    if (packageJsonData) {
                        ModSupport.disableMod({ id: packageJsonData.id, active: true });
                        if (DataStore.commit) DataStore.commit();
                    }

                    var fullPathToDelete = pathModule ? pathModule.resolve(workshopModsPath + "/" + foldersToDelete[i]) : workshopModsPath + "/" + foldersToDelete[i];
                    deleteDirectoryRecursive(fullPathToDelete); // Xóa thư mục mod
                }
            }

            // Xử lý các mod đã đăng ký (tải, giải nén, di chuyển)
            if (workshopItemsToProcess.length > 0) {
                processWorkshopItems(workshopItemsToProcess, 0);
            } else {
                finishSynchronization(); // Nếu không có mod nào để xử lý
            }
        }

        /**
         * Callback khi có lỗi trong quá trình đồng bộ UGC.
         * @param {string|Error} error - Thông điệp lỗi hoặc đối tượng lỗi.
         */
        function onUgcSynchronizationError(error) {
            logErrorAndPotentiallyQuit(error, true); // Ghi log lỗi và kết thúc
        }

        /**
         * Callback khi cập nhật tiến trình tải UGC.
         * @param {object} progress - Đối tượng chứa thông tin tiến trình.
         */
        function onUgcSynchronizationProgress(progress) {
            var progressMessage = "";
            if (progress) {
                if (progress.reason) progressMessage += "(" + progress.reason + ") ";
                progressMessage += (progress.value && typeof progress.value !== "undefined") ? Math.round(progress.value / 2) + "%" : "0%";
            }
            displayLoadingProgress(progressMessage);
            greenworksHelper.isOperationOngoing = true;
        }

        /**
         * Hàm hoàn tất quá trình đồng bộ hóa.
         */
        function finishSynchronization() {
            if (!greenworksHelper.skippedSynchronization && !greenworksHelper.isSynchronizationFinished) {
                ModSupport.init(); // Khởi tạo lại ModSupport sau khi đồng bộ
                greenworksHelper.isOperationOngoing = true;

                // Hiển thị cảnh báo nếu có lỗi tải/giải nén mod
                if (failedDownloads.length > 0) {
                    var warningMessage = "The following workshop mods could not be found, extracted or loaded:".localize() + "<br><br>";
                    for (var i = 0; i < failedDownloads.length; i++) {
                        warningMessage += failedDownloads[i].title + "<br>" + failedDownloads[i].fileName + "<br><br>";
                    }
                    CustomAlert.warn(warningMessage);
                }

                greenworksHelper.isSynchronizationFinished = true;
                $("#greenworksLoading").remove(); // Xóa UI tải
                deleteDirectoryRecursive(tempExtractionPath); // Xóa thư mục tạm
            }
        }

        /**
         * Tạo các thư mục cần thiết cho UGC và mods.
         */
        function ensureRequiredDirectoriesExist() {
            try {
                greenworksHelper.isOperationOngoing = true;
                if (!fileSystemModule.existsSync(userGeneratedContentPath)) mkdirP.sync(userGeneratedContentPath);
                if (!fileSystemModule.existsSync(workshopModsPath)) mkdirP.sync(workshopModsPath);
                if (!fileSystemModule.existsSync(tempExtractionPath)) mkdirP.sync(tempExtractionPath);
            } catch (error) {
                logErrorAndPotentiallyQuit(error, false); // Ghi log nếu không tạo được thư mục
            }
        }

        /**
         * Tạo ảnh thumbnail cho mod từ một ảnh nguồn.
         * @param {string} sourceImagePath - Đường dẫn đến ảnh nguồn.
         * @param {string} outputDirectory - Thư mục để lưu ảnh thumbnail.
         * @param {function(string)} successCallback - Callback khi thành công, trả về đường dẫn ảnh thumbnail.
         * @param {function(Error)} errorCallback - Callback khi có lỗi.
         */
        function createModThumbnail(sourceImagePath, outputDirectory, successCallback, errorCallback) {
            var webSourcePath = normalizeFilePathForWeb(sourceImagePath);
            var baseFileName = extractFileNameWithoutExtension(sourceImagePath);
            var imageElement = new Image();

            imageElement.onload = function () {
                var canvas = document.createElement("canvas");
                var context = canvas.getContext("2d");
                canvas.width = 120; // Kích thước thumbnail cố định
                canvas.height = 120;

                // Xóa canvas và đặt nền trong suốt (nếu cần)
                context.fillStyle = "#000000"; // Hoặc màu nền mong muốn
                context.globalAlpha = 0; // Hoặc 1 nếu muốn nền có màu
                context.fillRect(0, 0, 120, 120);
                context.globalAlpha = 1;

                // Tạo canvas tạm để resize ảnh gốc
                var tempCanvas = document.createElement("canvas");
                var tempContext = tempCanvas.getContext("2d");
                tempCanvas.width = this.width;
                tempCanvas.height = this.height;
                var newHeight = this.height / this.width * 120; // Giữ tỷ lệ khung hình
                tempContext.drawImage(imageElement, 0, 0);

                // Resize ảnh gốc xuống kích thước thumbnail (sử dụng thuật toán downscale)
                downscaleImage(tempCanvas, this.width, this.height, 120, newHeight);

                // Vẽ ảnh đã resize vào canvas thumbnail chính giữa
                context.drawImage(tempCanvas, (canvas.width - tempCanvas.width) / 2, (canvas.height - tempCanvas.height) / 2);

                var imageDataUrl = canvas.toDataURL("image/png");
                var base64Data = imageDataUrl.replace("data:image/png;base64,", "");
                var imageBuffer = new Buffer(base64Data, "base64");
                var thumbnailPath = outputDirectory + "/" + baseFileName + "-Thumbnail.png";

                fileSystemModule.writeFile(thumbnailPath, imageBuffer, function (error) {
                    if (error) {
                        if (errorCallback) errorCallback(error);
                    } else {
                        if (successCallback) successCallback(thumbnailPath);
                    }
                });
            };
            imageElement.onerror = function (error) {
                if (errorCallback) errorCallback(new Error("Failed to load image: " + webSourcePath));
            };
            imageElement.src = webSourcePath; // Load ảnh
        }


        /**
         * Thuật toán downscale ảnh (lanczos hoặc bilinear đơn giản).
         * Đây là một phiên bản rất đơn giản, có thể cần một thư viện chuyên dụng cho kết quả tốt hơn.
         * @param {HTMLCanvasElement} sourceCanvas - Canvas chứa ảnh gốc.
         * @param {number} sourceWidth - Chiều rộng ảnh gốc.
         * @param {number} sourceHeight - Chiều cao ảnh gốc.
         * @param {number} targetWidth - Chiều rộng ảnh đích.
         * @param {number} targetHeight - Chiều cao ảnh đích.
         */
        function downscaleImage(sourceCanvas, sourceWidth, sourceHeight, targetWidth, targetHeight) {
            // Lấy imageData của ảnh gốc
            var sourceImageData = sourceCanvas.getContext("2d").getImageData(0, 0, sourceWidth, sourceHeight);
            // Tạo imageData mới cho ảnh đích
            var targetImageData = sourceCanvas.getContext("2d").getImageData(0, 0, targetWidth, targetHeight);

            var sourceData = sourceImageData.data;
            var targetData = targetImageData.data;

            var xRatio = sourceWidth / targetWidth;
            var yRatio = sourceHeight / targetHeight;

            var xOffset, yOffset, sourceIndex, targetIndex;

            // Duyệt qua từng pixel của ảnh đích
            for (var y = 0; y < targetHeight; y++) {
                for (var x = 0; x < targetWidth; x++) {
                    // Tính toán vị trí tương ứng trên ảnh gốc (lấy điểm giữa của vùng lấy mẫu)
                    xOffset = Math.floor(x * xRatio);
                    yOffset = Math.floor(y * yRatio);
                    sourceIndex = (yOffset * sourceWidth + xOffset) * 4; // Mỗi pixel có 4 giá trị (R,G,B,A)
                    targetIndex = (y * targetWidth + x) * 4;

                    // Sao chép giá trị pixel (Nearest neighbor - cách đơn giản nhất)
                    // Để có chất lượng tốt hơn, cần dùng bilinear hoặc bicubic interpolation
                    targetData[targetIndex] = sourceData[sourceIndex];         // Red
                    targetData[targetIndex + 1] = sourceData[sourceIndex + 1]; // Green
                    targetData[targetIndex + 2] = sourceData[sourceIndex + 2]; // Blue
                    targetData[targetIndex + 3] = sourceData[sourceIndex + 3]; // Alpha
                }
            }
            // Xóa canvas gốc và đặt lại kích thước
            sourceCanvas.getContext("2d").clearRect(0, 0, Math.max(sourceWidth, targetWidth), Math.max(sourceHeight, targetHeight));
            sourceCanvas.width = targetWidth;
            sourceCanvas.height = targetHeight;
            // Vẽ imageData đã thu nhỏ lên canvas
            sourceCanvas.getContext("2d").putImageData(targetImageData, 0, 0);
        }

        /**
         * Tạo file nén và publish mod lên Steam Workshop.
         * @param {object} options - Các tùy chọn cho việc publish.
         * @param {function(string)} [statusCallback] - Callback cập nhật trạng thái.
         * @param {function(object)} [successCallback] - Callback khi thành công.
         */
        function createArchiveAndPublishMod(options, statusCallback, successCallback) {
            options = $.extend({
                outputFile: "", // Đường dẫn file zip sẽ tạo
                folder: "",     // Thư mục chứa mod
                name: "",       // Tên mod
                image: "",      // Đường dẫn ảnh thumbnail
                desc: ""        // Mô tả mod
            }, options);

            steamworksApi.Utils.createArchive(options.outputFile, options.folder, "", 9, // Mức nén
                function () { // onSucceed (createArchive)
                    steamworksApi.ugcPublish(options.outputFile, options.name, options.desc, options.image,
                        function (publishResult) { // onSucceed (ugcPublish)
                            if (successCallback) successCallback(publishResult);
                        },
                        function (error) { // onError (ugcPublish)
                            if (statusCallback) statusCallback(error); // Hiển thị lỗi
                            logErrorAndPotentiallyQuit(error, false);
                        },
                        function (progress) { // onProgress (ugcPublish)
                            if (statusCallback) statusCallback("Please wait...".localize()); // Cập nhật trạng thái chung
                        }
                    );
                },
                function (error) { // onError (createArchive)
                    if (statusCallback) statusCallback(GENERIC_ERROR_MESSAGE); // Hiển thị lỗi chung
                    logErrorAndPotentiallyQuit(error, false);
                }
            );
        }

        /**
         * Tạo file nén và cập nhật mod đã có trên Steam Workshop.
         * @param {object} options - Các tùy chọn cho việc cập nhật.
         * @param {function(string)} [statusCallback] - Callback cập nhật trạng thái.
         * @param {function()} [successCallback] - Callback khi thành công.
         */
        function createArchiveAndPublishUpdateMod(options, statusCallback, successCallback) {
            options = $.extend({
                name: "",
                desc: "",
                image: "",
                folder: "",             // Thư mục chứa mod (có thể trống nếu không thay đổi file)
                publishedFileId: 0,   // ID của item trên Workshop
                outputFile: ""          // Đường dẫn file zip (nếu có cập nhật file)
            }, options);

            var publishUpdate = function (archivePath) {
                steamworksApi.ugcPublishUpdate(options.publishedFileId, archivePath, options.name, options.desc, options.image,
                    function () { // onSucceed
                        if (successCallback) successCallback();
                    },
                    function (error) { // onError
                        if (statusCallback) statusCallback(error);
                        logErrorAndPotentiallyQuit(error, false);
                    },
                    function (progress) { // onProgress
                        if (statusCallback) statusCallback("Please wait...".localize());
                    }
                );
            };

            // Nếu có cập nhật nội dung file mod
            if (options.folder.trim() !== "") {
                steamworksApi.Utils.createArchive(options.outputFile, options.folder, "", 9,
                    function () { // onSucceed (createArchive)
                        publishUpdate(options.outputFile);
                    },
                    function (error) { // onError (createArchive)
                        if (statusCallback) statusCallback(error);
                        logErrorAndPotentiallyQuit(error, false);
                    }
                );
            } else {
                publishUpdate(""); // Chỉ cập nhật metadata nếu không có thay đổi file
            }
        }

        // --- Khai báo biến và hằng số ---
        var MAX_RETRY_ATTEMPTS = 10; // Số lần thử lại tối đa khi xóa thư mục
        var greenworksHelper = Greenworks; // Tham chiếu đến đối tượng Greenworks chính
        var pathModule = require("path"); // Module 'path' của Node.js
        var executablePath = pathModule ? pathModule.dirname(process.execPath) : ""; // Đường dẫn đến thư mục chứa file thực thi

        // Xử lý đường dẫn cho macOS app bundle
        var nwjsFrameworkPathPart1 = "/Contents/Frameworks/node-webkit";
        if (executablePath.lastIndexOf(nwjsFrameworkPathPart1) > -1) {
            executablePath = executablePath.substr(0, executablePath.lastIndexOf(nwjsFrameworkPathPart1)) + "/Contents/Resources/app.nw";
        } else {
            var nwjsFrameworkPathPart2 = "/Contents/Frameworks/nwjs Framework.framework";
            if (executablePath.lastIndexOf(nwjsFrameworkPathPart2) > -1) {
                executablePath = executablePath.substr(0, executablePath.lastIndexOf(nwjsFrameworkPathPart2)) + "/Contents/Resources/app.nw";
            }
        }

        // Đường dẫn đến các thư mục UGC và mod
        var userGeneratedContentPath = pathModule ? pathModule.resolve(executablePath + "/ugc/") : "./ugc/";
        var workshopModsPath = pathModule ? pathModule.resolve(executablePath + "/mods_ws/") : "./mods_ws/";
        var tempExtractionPath = pathModule ? pathModule.resolve(executablePath + "/temp/") : "./temp/";

        var fileSystemModule = require("fs"); // Module 'fs' của Node.js
        var steamworksApi = Steam.api; // API của Steamworks (greenworks)
        var failedDownloads = []; // Mảng lưu các mod tải/giải nén thất bại
        var GENERIC_ERROR_MESSAGE = "An error occurred.".localize(); // Thông báo lỗi chung


        // --- Các phương thức public của Greenworks ---
        /**
         * Trích xuất tên file từ đường dẫn.
         * @param {string} filePath - Đường dẫn file.
         * @param {boolean} withoutExtension - True để loại bỏ phần mở rộng.
         * @returns {string} - Tên file.
         */
        greenworksHelper.extractFilename = function (filePath, withoutExtension) {
            return withoutExtension ? extractFileNameWithoutExtension(filePath) : extractFileName(filePath);
        };

        /**
         * Hiển thị Steam Overlay (trang Workshop chung hoặc trang của một item cụ thể).
         * @param {string} [itemId] - ID của item trên Workshop (tùy chọn).
         */
        greenworksHelper.showOverlay = function (itemId) {
            if (greenworksHelper.isSteamworksAvailable) {
                arguments.length > 0 ? steamworksApi.ugcShowOverlay(itemId) : steamworksApi.ugcShowOverlay();
            }
        };

        /**
         * Tạo file nén và publish một mod mới lên Steam Workshop.
         * @param {object} options - Tùy chọn publish.
         * @param {function(string)} statusCallback - Callback cập nhật trạng thái.
         * @param {function(object)} successCallback - Callback khi thành công.
         */
        greenworksHelper.createArchiveAndPublish = function (options, statusCallback, successCallback) {
            if (greenworksHelper.isSteamworksAvailable) {
                options = $.extend({
                    name: "",
                    desc: "",
                    image: "",
                    folder: "",
                    createImage: true, // Mặc định tạo thumbnail
                    updateJson: true   // Mặc định cập nhật package.json
                }, options);

                var steamId = steamworksApi.getSteamId();
                var modFolderName = extractLastPathComponent(options.folder);
                var userAccountId = "" + steamId.accountId;

                // Tạo tên file zip, có thể bao gồm Account ID của người dùng để tránh trùng lặp
                var zipFileName = steamId.isValid ?
                    (modFolderName.substr(0, userAccountId.length + 1) !== userAccountId + "_" ?
                        pathModule.join(tempExtractionPath, (steamId.isValid ? userAccountId + "_" : "") + extractLastPathComponent(options.folder) + ".zip") :
                        pathModule.join(tempExtractionPath, extractLastPathComponent(options.folder) + ".zip")) :
                    pathModule.join(tempExtractionPath, +extractLastPathComponent(options.folder) + ".zip");

                var outputZipPath = pathModule ? pathModule.resolve(zipFileName) : zipFileName;
                var sourceModFolder = pathModule ? pathModule.resolve(options.folder) : options.folder;

                var packageJsonData = typeof greenworksHelper.readPackageJsonAsObject(sourceModFolder) !== "undefined" ?
                    greenworksHelper.readPackageJsonAsObject(sourceModFolder) : undefined;

                options.updateJson = options.updateJson && typeof packageJsonData !== "undefined";

                if (options.updateJson === true) {
                    packageJsonData.name = options.name;
                    packageJsonData.description = options.desc;
                }

                ensureRequiredDirectoriesExist(); // Đảm bảo các thư mục cần thiết tồn tại

                // Nếu cần tạo ảnh thumbnail và có đường dẫn ảnh
                if (options.createImage === true && options.image && options.image.trim() !== "") {
                    createModThumbnail(options.image, sourceModFolder,
                        function (thumbnailPath) { // successCallback for thumbnail creation
                            if (options.updateJson === true) {
                                packageJsonData.image = extractFileName(thumbnailPath); // Lưu tên file thumbnail vào package.json
                                writePackageJson(sourceModFolder, packageJsonData);
                            }
                            createArchiveAndPublishMod({
                                outputFile: outputZipPath,
                                folder: sourceModFolder,
                                name: options.name,
                                desc: options.desc,
                                image: options.image // Đường dẫn ảnh gốc, không phải thumbnail
                            }, statusCallback, successCallback);
                        },
                        function (error) { // errorCallback for thumbnail creation
                            if (statusCallback) statusCallback(GENERIC_ERROR_MESSAGE);
                            logErrorAndPotentiallyQuit(error, false);
                        }
                    );
                } else { // Nếu không tạo thumbnail
                    if (options.updateJson === true) {
                        writePackageJson(sourceModFolder, packageJsonData);
                    }
                    createArchiveAndPublishMod({
                        outputFile: outputZipPath,
                        folder: sourceModFolder,
                        name: options.name,
                        desc: options.desc,
                        image: options.image
                    }, statusCallback, successCallback);
                }
            }
        };

        /**
         * Tạo file nén và cập nhật một mod đã có trên Steam Workshop.
         * @param {object} options - Tùy chọn cập nhật.
         * @param {function(string)} statusCallback - Callback cập nhật trạng thái.
         * @param {function()} successCallback - Callback khi thành công.
         */
        greenworksHelper.createArchiveAndPublishUpdate = function (options, statusCallback, successCallback) {
            if (greenworksHelper.isSteamworksAvailable) {
                options = $.extend({
                    name: "",
                    desc: "",
                    image: "",
                    pid: "",            // Published File ID
                    folder: "",
                    createImage: true,
                    updateJson: true
                }, options);

                var steamId = steamworksApi.getSteamId();
                var userAccountId = "" + steamId.accountId;
                var modFolderName = "";
                var outputZipPath = "";
                var sourceModFolder = "";

                // Nếu có cập nhật thư mục mod
                if (options.folder.trim() !== "") {
                    modFolderName = extractLastPathComponent(options.folder);
                    var zipFileName = steamId.isValid ?
                        (modFolderName.substr(0, userAccountId.length + 1) !== userAccountId + "_" ?
                            pathModule.join(tempExtractionPath, (steamId.isValid ? userAccountId + "_" : "") + extractLastPathComponent(options.folder) + ".zip") :
                            pathModule.join(tempExtractionPath, extractLastPathComponent(options.folder) + ".zip")) :
                        pathModule.join(tempExtractionPath, +extractLastPathComponent(options.folder) + ".zip");
                    outputZipPath = pathModule ? pathModule.resolve(zipFileName) : zipFileName;
                    sourceModFolder = pathModule ? pathModule.resolve(options.folder) : options.folder;
                }


                var packageJsonData = typeof greenworksHelper.readPackageJsonAsObject(sourceModFolder) !== "undefined" ?
                    greenworksHelper.readPackageJsonAsObject(sourceModFolder) : undefined;

                options.updateJson = options.updateJson && typeof packageJsonData !== "undefined";

                if (options.updateJson === true) {
                    packageJsonData.name = options.name;
                    packageJsonData.description = options.desc;
                }

                ensureRequiredDirectoriesExist();

                if (options.createImage === true && options.image.trim() !== "" && options.folder.trim() !== "") {
                    createModThumbnail(options.image, sourceModFolder,
                        function (thumbnailPath) {
                            if (options.updateJson === true) {
                                packageJsonData.image = extractFileName(thumbnailPath);
                                writePackageJson(sourceModFolder, packageJsonData);
                            }
                            createArchiveAndPublishUpdateMod({
                                name: options.name,
                                desc: options.desc,
                                image: options.image,
                                folder: sourceModFolder,
                                publishedFileId: options.pid,
                                outputFile: outputZipPath
                            }, statusCallback, successCallback);
                        },
                        function (error) {
                            if (statusCallback) statusCallback(GENERIC_ERROR_MESSAGE);
                            logErrorAndPotentiallyQuit(error, false);
                        }
                    );
                } else {
                    if (options.updateJson === true) {
                        writePackageJson(sourceModFolder, packageJsonData);
                    }
                    createArchiveAndPublishUpdateMod({
                        name: options.name,
                        desc: options.desc,
                        image: options.image,
                        folder: sourceModFolder, // Có thể trống nếu không cập nhật file
                        publishedFileId: options.pid,
                        outputFile: outputZipPath // Có thể trống nếu không cập nhật file
                    }, statusCallback, successCallback);
                }
            }
        };

        /**
         * Lấy danh sách các item đã được publish bởi người dùng hiện tại.
         * @param {function(Array<object>)} callback - Callback trả về danh sách item.
         */
        greenworksHelper.getPublishedItems = function (callback) {
            if (greenworksHelper.isSteamworksAvailable) {
                steamworksApi.ugcGetUserItems(0, 0, 3, // Sắp xếp theo thời gian cập nhật
                    function (result) { // onSuccess
                        if (callback) callback(result.items);
                    },
                    function (error) { // onError
                        logErrorAndPotentiallyQuit("Error getting published items: " + error, false);
                    },
                    function (progress) { // onProgress
                        // Có thể cập nhật UI nếu cần
                    }
                );
            }
        };

        // Trạng thái của quá trình đồng bộ
        greenworksHelper.isOperationOngoing = false; // Cờ báo hiệu có thao tác đang diễn ra
        greenworksHelper.isSynchronizationFinished = false; // Cờ báo hiệu đã hoàn tất đồng bộ
        greenworksHelper.skippedSynchronization = false; // Cờ báo hiệu người dùng đã bỏ qua đồng bộ
        greenworksHelper.isSkipButtonVisible = false; // Cờ báo hiệu nút bỏ qua có hiển thị không

        /**
         * Bỏ qua quá trình đồng bộ hóa.
         */
        greenworksHelper.skipSync = function () {
            finishSynchronization();
            greenworksHelper.skippedSynchronization = true;
        };

        /**
         * Kiểm tra định kỳ xem có thao tác nào đang diễn ra không, nếu không thì hiển thị nút bỏ qua.
         */
        greenworksHelper.checkIfOngoing = function () {
            if (!greenworksHelper.isSynchronizationFinished) { // Chỉ chạy nếu chưa hoàn tất
                if (greenworksHelper.isOperationOngoing) {
                    greenworksHelper.isOperationOngoing = false; // Reset cờ, chờ tick tiếp theo
                } else if (!greenworksHelper.isSkipButtonVisible) {
                    var skipButton = $("#skipSyncButton");
                    if (skipButton) {
                        skipButton.show().removeClass("hidden").addClass("show");
                        greenworksHelper.isSkipButtonVisible = true;
                    }
                }
                setTimeout(greenworksHelper.checkIfOngoing, 2000); // Lặp lại sau 2 giây
            }
        };

        /**
         * Bắt đầu quá trình đồng bộ hóa các mod từ Steam Workshop.
         */
        greenworksHelper.synchronize = function () {
            try {
                setTimeout(greenworksHelper.checkIfOngoing, 2000); // Bắt đầu kiểm tra định kỳ
                failedDownloads = []; // Reset danh sách lỗi
                deleteDirectoryRecursive(tempExtractionPath); // Xóa thư mục tạm trước khi bắt đầu
                ensureRequiredDirectoriesExist(); // Đảm bảo các thư mục cần thiết

                if (greenworksHelper.isSteamworksAvailable) {
                    steamworksApi.ugcSynchronizeItems(userGeneratedContentPath, synchronizeSubscribedItems, onUgcSynchronizationError, onUgcSynchronizationProgress);
                } else {
                    finishSynchronization(); // Nếu Steam không có, kết thúc ngay
                }
            } catch (error) {
                logErrorAndPotentiallyQuit(error, true); // Xử lý lỗi nghiêm trọng
            }
        };

        /**
         * Hủy đăng ký một item trên Steam Workshop.
         * @param {string} publishedFileId - ID của item.
         * @param {function(object)} successCallback - Callback khi thành công.
         * @param {function(string)} errorCallback - Callback khi có lỗi.
         */
        greenworksHelper.unsubscribe = function (publishedFileId, successCallback, errorCallback) {
            if (greenworksHelper.isSteamworksAvailable) {
                steamworksApi.ugcUnsubscribe(publishedFileId,
                    function (result) { // onSuccess
                        successCallback(result);
                    },
                    function (error) { // onError
                        errorCallback(error);
                        logErrorAndPotentiallyQuit("Error unsubscribing: " + error, false);
                    }
                );
            }
        };

        /**
         * Đọc và parse file package.json của một mod.
         * @param {string} modDirectoryPath - Đường dẫn đến thư mục mod.
         * @returns {object|undefined} - Đối tượng JSON hoặc undefined nếu lỗi.
         */
        greenworksHelper.readPackageJsonAsObject = function (modDirectoryPath) {
            var packageJsonPath = pathModule ? pathModule.resolve(modDirectoryPath + "/package.json") : modDirectoryPath + "/package.json";
            if (fileSystemModule.existsSync(packageJsonPath)) {
                var fileContent = "";
                // Thử đọc với các encoding khác nhau
                try { // UTF-8 (phổ biến nhất)
                    fileContent = fileSystemModule.readFileSync(packageJsonPath, "utf8");
                    fileContent = fileContent.replace(/^\uFEFF/, ""); // Xóa BOM (Byte Order Mark) nếu có
                    return JSON.parse(fileContent);
                } catch (e1) {
                    try { // UTF-16LE (Windows)
                        fileContent = fileSystemModule.readFileSync(packageJsonPath, "utf16le");
                        fileContent = fileContent.replace(/^\uFEFF/, "");
                        return JSON.parse(fileContent);
                    } catch (e2) {
                        try { // ASCII
                            fileContent = fileSystemModule.readFileSync(packageJsonPath, "ascii");
                            return JSON.parse(fileContent);
                        } catch (e3) {
                            console.log("Could not parse JSON at " + packageJsonPath + ". The system reported: " + e3);
                            // Có thể thử thêm các encoding khác hoặc báo lỗi chi tiết hơn
                        }
                    }
                }
            }
            return undefined; // Trả về undefined nếu file không tồn tại hoặc không parse được
        };

        // Kiểm tra và khởi tạo API Steamworks
        greenworksHelper.isSteamworksAvailable = false;
        if (pathModule && fileSystemModule && typeof mkdirP !== 'undefined' && steamworksApi) { // mkdirP là một thư viện để tạo thư mục đệ quy
            greenworksHelper.isSteamworksAvailable = steamworksApi.initAPI();
        } else {
            logErrorAndPotentiallyQuit("Greenworks requirements missing!".localize(), true);
        }
    })(); // Kết thúc IIFE cho Greenworks
}
// --- END OF FILE SteamGreenworks.js ---