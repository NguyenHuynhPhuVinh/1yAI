// --- START OF FILE CanvasManager.js ---

var CanvasManager = {};
(function () {
    var canvasManagerModule = CanvasManager; // Tham chiếu nội bộ đến CanvasManager

    // Khởi tạo CanvasManager chính với một element DOM chứa
    canvasManagerModule.init = function (containerElement) {
        initializeCanvases(canvasManagerModule, containerElement);
    };

    // Hàm helper để khởi tạo một bộ các canvas (background, character, foreground)
    // cho một đối tượng canvasSet (có thể là CanvasManager chính, leftScreen, hoặc rightScreen)
    // và gắn chúng vào một parentElement DOM.
    var initializeCanvases = function (canvasSet, parentElement) {
        // Canvas cho lớp nền chính (background)
        canvasSet.backgroundCanvas = document.createElement("canvas");
        canvasSet.backgroundCanvas.id = "backgroundCanvas";
        canvasSet.backgroundCanvas.width = parentElement.clientWidth;
        canvasSet.backgroundCanvas.height = parentElement.clientHeight;
        canvasSet.backgroundCanvas.style.position = "absolute";
        canvasSet.backgroundContext = canvasSet.backgroundCanvas.getContext("2d");
        canvasSet.backgroundStage = new createjs.Stage(canvasSet.backgroundCanvas); // Stage của CreateJS cho background

        // Canvas cho lớp phủ trên background (ví dụ: hiệu ứng thời tiết, overlay bán trong suốt)
        canvasSet.backgroundOverlayCanvas = document.createElement("canvas");
        canvasSet.backgroundOverlayCanvas.id = "backgroundOverlayCanvas";
        canvasSet.backgroundOverlayCanvas.width = parentElement.clientWidth;
        canvasSet.backgroundOverlayCanvas.height = parentElement.clientHeight;
        canvasSet.backgroundOverlayCanvas.style.position = "absolute";
        canvasSet.backgroundOverlayContext = canvasSet.backgroundOverlayCanvas.getContext("2d");
        canvasSet.backgroundOverlayStage = new createjs.Stage(canvasSet.backgroundOverlayCanvas); // Stage cho background overlay

        // Canvas cho các nhân vật và đối tượng động
        canvasSet.characterCanvas = document.createElement("canvas");
        canvasSet.characterCanvas.id = "characterCanvas";
        canvasSet.characterCanvas.width = parentElement.clientWidth;
        canvasSet.characterCanvas.height = parentElement.clientHeight;
        canvasSet.characterCanvas.style.position = "absolute";
        canvasSet.characterContext = canvasSet.characterCanvas.getContext("2d");
        canvasSet.characterStage = new createjs.Stage(canvasSet.characterCanvas); // Stage cho nhân vật

        // Chỉ CanvasManager chính mới có foregroundCanvas (cho UI hoặc hiệu ứng đặc biệt phía trước)
        // leftScreen và rightScreen không có lớp này.
        if (canvasManagerModule.leftScreen != canvasSet && canvasManagerModule.rightScreen != canvasSet) {
            canvasSet.foregroundCanvas = document.createElement("canvas");
            canvasSet.foregroundCanvas.id = "foregroundCanvas";
            canvasSet.foregroundCanvas.width = parentElement.clientWidth;
            canvasSet.foregroundCanvas.height = parentElement.clientHeight;
            canvasSet.foregroundCanvas.style.position = "absolute";
            canvasSet.foregroundContext = canvasSet.foregroundCanvas.getContext("2d");
            canvasSet.foregroundStage = new createjs.Stage(canvasSet.foregroundCanvas); // Stage cho foreground
        }

        canvasSet.backgroundInvalid = !1; // Cờ báo hiệu background cần được vẽ lại
        // Hàm để đánh dấu background cần vẽ lại
        canvasSet.invalidateBackground =
            function () {
                canvasSet.backgroundInvalid = !0;
            };

        // Cập nhật kích thước của tất cả các canvas con dựa trên kích thước cửa sổ mới
        canvasSet.updateCanvasSizes = function (originalWindowWidth, windowHeight) {
            var _originalWindowWidth = originalWindowWidth; // Lưu lại chiều rộng ban đầu của cửa sổ/vùng hiển thị
            var targetMaxRenderWidth = 2560; // Chiều rộng tối đa mà game render nội dung
            var targetMaxRenderHeight = 1440; // Chiều cao tối đa mà game render nội dung

            // Nếu là chế độ độ phân giải thấp, sử dụng kích thước nhỏ hơn
            if (PlatformShim.ISLOWRES) {
                targetMaxRenderWidth = 1366;
                targetMaxRenderHeight = 768;
            }

            // Tính toán chiều rộng canvas mới dựa trên tỷ lệ khung hình mục tiêu và chiều cao cửa sổ hiện tại
            var scaledCanvasWidth = windowHeight / targetMaxRenderHeight * targetMaxRenderWidth;

            // Cập nhật kích thước của parentElement (container của các canvas)
            $(parentElement).width(scaledCanvasWidth + "px").height(windowHeight + "px");

            // Cập nhật kích thước cho từng canvas
            canvasSet.backgroundCanvas.width = scaledCanvasWidth;
            canvasSet.backgroundCanvas.height = windowHeight;
            canvasSet.invalidateBackground(); // Đánh dấu background cần vẽ lại do thay đổi kích thước

            canvasSet.backgroundOverlayCanvas.width = scaledCanvasWidth;
            canvasSet.backgroundOverlayCanvas.height = windowHeight;

            canvasSet.characterCanvas.width = scaledCanvasWidth;
            canvasSet.characterCanvas.height = windowHeight;

            if (canvasSet.foregroundCanvas) {
                canvasSet.foregroundCanvas.width = scaledCanvasWidth;
                canvasSet.foregroundCanvas.height = windowHeight;
            }

            // Tính toán tỷ lệ scale toàn cục
            canvasSet.globalScale = windowHeight / targetMaxRenderHeight;
            // Tỷ lệ scale bỏ qua việc background có thể là low-res (luôn dựa trên 1440p)
            canvasSet.globalScaleIgnoringLowResBackground = windowHeight / 1440;

            // Nếu canvasSet này là CanvasManager chính, cập nhật kích thước cho left/right screen và vị trí của nó
            if (canvasSet === canvasManagerModule) {
                if (canvasManagerModule.leftScreen) {
                    canvasManagerModule.leftScreen.updateCanvasSizes(scaledCanvasWidth, windowHeight);
                }
                if (canvasManagerModule.rightScreen) {
                    canvasManagerModule.rightScreen.updateCanvasSizes(scaledCanvasWidth, windowHeight);
                }
                $(parentElement).css("left", scaledCanvasWidth + "px"); // Dịch chuyển container chính
            } else if (canvasSet == canvasManagerModule.rightScreen) {
                $(parentElement).css("left", 2 * scaledCanvasWidth + "px"); // Dịch chuyển container của rightScreen
            }
            // Cờ báo hiệu màn hình có nhỏ không (dưới 1024px chiều rộng)
            canvasSet.isSmallScreen = 1024 >= scaledCanvasWidth;
            // Xử lý cho màn hình siêu rộng
            VisualsManager.handleUltraWideMonitors(_originalWindowWidth, windowHeight);
        };

        // Gắn các canvas vào parentElement
        parentElement.appendChild(canvasSet.backgroundCanvas);
        parentElement.appendChild(canvasSet.backgroundOverlayCanvas);
        parentElement.appendChild(canvasSet.characterCanvas);
        if (canvasSet.foregroundCanvas) {
            parentElement.appendChild(canvasSet.foregroundCanvas);
        }
    };

    // Khởi tạo màn hình bên trái (nếu có)
    canvasManagerModule.initLeftScreen = function (containerElement) {
        canvasManagerModule.leftScreen = {};
        initializeCanvases(canvasManagerModule.leftScreen, containerElement);
    };

    // Khởi tạo màn hình bên phải (nếu có)
    canvasManagerModule.initRightScreen = function (containerElement) {
        canvasManagerModule.rightScreen = {};
        initializeCanvases(canvasManagerModule.rightScreen, containerElement);
    };

    // Hàm cập nhật (vẽ lại) cho một bộ canvas cụ thể
    var updateSingleCanvasSet = function (canvasSetToUpdate) {
        if (canvasSetToUpdate.backgroundStage) {
            if (canvasSetToUpdate.backgroundInvalid) {
                canvasSetToUpdate.backgroundStage.update(); // Vẽ lại background nếu cần
                canvasSetToUpdate.backgroundInvalid = !1;
            }
            canvasSetToUpdate.backgroundOverlayStage.update(); // Luôn vẽ lại background overlay
            canvasSetToUpdate.characterStage.update();       // Luôn vẽ lại character
            if (canvasSetToUpdate.foregroundStage) {
                canvasSetToUpdate.foregroundStage.update();  // Luôn vẽ lại foreground nếu có
            }
        }
    };

    // Hàm cập nhật chính, được gọi mỗi frame trong game loop
    canvasManagerModule.update = function (isSkippedFrame, forceSideScreenUpdate) {
        // Cập nhật cho CanvasManager chính (màn hình giữa)
        if (canvasManagerModule.backgroundStage) {
            if (canvasManagerModule.backgroundInvalid) {
                canvasManagerModule.backgroundStage.update();
                canvasManagerModule.backgroundInvalid = !1;
            }
            // Chỉ cập nhật nếu zone 1 (màn hình giữa) đang active
            if (CanvasManager.zone1Activ !== !1) {
                // Xử lý frame skip cho backgroundOverlayStage và characterStage
                if (SettingsGameplay.isFrameSkipEnabled() && !isSkippedFrame && GameManager._skipFrameCount != 1) {
                    // Không làm gì nếu là frame bị skip (trong trường hợp isFrameSkipEnabled=true và isSkippedFrame=true)
                    // Hoặc nếu isFrameSkipEnabled=false thì luôn vẽ.
                } else {
                    canvasManagerModule.backgroundOverlayStage.update();
                }

                canvasManagerModule.foregroundStage.update(); // Foreground luôn được update khi zone 1 active

                if (SettingsGameplay.isFrameSkipEnabled() && !isSkippedFrame && GameManager._skipFrameCount != 2) {
                    // Tương tự như trên cho characterStage
                } else {
                    canvasManagerModule.characterStage.update();
                }
            }
        }

        // Cập nhật cho màn hình bên trái nếu nó active hoặc bị buộc cập nhật
        if ((CanvasManager.zone0Activ !== !1 || forceSideScreenUpdate) && canvasManagerModule.leftScreen) {
            updateSingleCanvasSet(canvasManagerModule.leftScreen);
        }
        // Cập nhật cho màn hình bên phải nếu nó active hoặc bị buộc cập nhật
        if ((CanvasManager.zone2Activ !== !1 || forceSideScreenUpdate) && canvasManagerModule.rightScreen) {
            updateSingleCanvasSet(canvasManagerModule.rightScreen);
        }
    };
})();

// IIFE này mở rộng đối tượng GameManager với các chức năng liên quan đến
// quản lý dự án R&D (Nghiên cứu & Phát triển) và dự án phần cứng (Hardware - HW).
(function () {
    var gameManagerInstance = GameManager; // Tham chiếu nội bộ đến GameManager

    // Các hằng số chi phí và giảm chi phí cho R&D và HW
    gameManagerInstance.MAX_RND_COST = 3E6; // 3,000,000
    gameManagerInstance.RND_DECREASE_PER_SPECIALIST = 1E5; // 100,000
    gameManagerInstance.MAX_HW_COST = 3E6; // 3,000,000
    gameManagerInstance.HW_DECREASE_PER_SPECIALIST = 1E5; // 100,000

    // Bắt đầu một dự án mới (R&D hoặc console tùy chỉnh)
    gameManagerInstance.startProject = function (projectData) {
        var targetZone = projectData.targetZone; // Zone mục tiêu của dự án (0: HW, 2: R&D)
        var newProjectObject = {}; // Đối tượng dự án mới sẽ được tạo

        // Nếu là dự án console tùy chỉnh, sao chép toàn bộ projectData
        if (projectData.id === "custom console") {
            $.extend(newProjectObject, projectData);
        }

        // Thiết lập các thuộc tính cơ bản cho dự án mới
        $.extend(newProjectObject, {
            id: projectData.id,
            name: projectData.name,
            progress: 0, // Tiến độ ban đầu là 0%
            startPoints: projectData.pointsCost, // Tổng điểm cần thiết để hoàn thành
            remainingPoints: projectData.pointsCost, // Điểm còn lại để hoàn thành
            iconUri: projectData.iconUri,
            targetZone: targetZone,
            startTime: GameManager.gameTime // Thời điểm bắt đầu dự án
        });

        // Gán dự án mới vào đúng slot (HW hoặc R&D)
        if (targetZone == 0) { // Dự án phần cứng (console)
            gameManagerInstance.currentHwProject = newProjectObject;
            VisualsManager.putConsoleToPedestal(); // Hiển thị console lên bệ (nếu có)
        } else if (targetZone == 2) { // Dự án R&D
            gameManagerInstance.currentRnDProject = newProjectObject;
            Tutorial.rndProjectStarted(); // Kích hoạt tutorial cho dự án R&D
        }
    };

    // Hoàn thành một dự án
    gameManagerInstance.finishProject = function (projectToFinish) {
        // Xóa dự án khỏi slot hiện tại
        if (gameManagerInstance.currentHwProject == projectToFinish) {
            gameManagerInstance.currentHwProject = null;
        } else if (gameManagerInstance.currentRnDProject == projectToFinish) {
            gameManagerInstance.currentRnDProject = null;
        }

        if (projectToFinish.id === "custom console") {
            gameManagerInstance.finishCustomConsole(projectToFinish); // Xử lý logic hoàn thành console tùy chỉnh
            VisualsManager.putConsoleToPedestal();
        } else {
            // Tìm định nghĩa dự án lớn và gọi hàm complete của nó
            Research.bigProjects.first(function (projectDef) {
                return projectDef.id == projectToFinish.id;
            }).complete(GameManager.company);
            ghg4.ghg5("project complete", { id: projectToFinish.id }); // Ghi log analytics
        }
    };

    // Hủy một dự án đang thực hiện
    gameManagerInstance.cancelProject = function (projectToCancel) {
        // Xóa dự án khỏi slot hiện tại
        if (GameManager.currentHwProject == projectToCancel) {
            GameManager.currentHwProject = null;
            VisualsManager.putConsoleToPedestal();
        }
        if (GameManager.currentRnDProject == projectToCancel) {
            GameManager.currentRnDProject = null;
        }
        VisualsManager.updateProjectStatusCards(); // Cập nhật UI thẻ trạng thái dự án

        // Tìm định nghĩa dự án và gọi hàm cancel của nó (nếu có)
        var projectDefinition = Research.bigProjects.first(function (def) {
            return def.id == projectToCancel.id;
        });
        if (projectDefinition && projectDefinition.cancel) {
            projectDefinition.cancel(GameManager.company);
        }
    };

    // Kiểm tra xem có thể phát triển console không
    gameManagerInstance.canDevelopConsole = function () {
        if (gameManagerInstance.currentHwProject) return !1; // Nếu đang có dự án HW thì không thể
        var company = gameManagerInstance.company;
        return company ? company.flags.hwLabUnlocked : !1; // Chỉ có thể nếu lab HW đã được mở khóa
    };

    // Logic khi hoàn thành việc phát triển console tùy chỉnh
    gameManagerInstance.finishCustomConsole = function (consoleProjectData) {
        var company = GameManager.company;
        if (company) {
            company.flags["console" + consoleProjectData.variation + "Used"] = !0; // Đánh dấu biến thể console này đã được sử dụng
            var currentDate = company.getDate(company.currentWeek / GameManager.flags.gameLengthModifier); // Lấy ngày hiện tại (đã điều chỉnh theo độ dài game)

            var baseSuccessFactor = 1.1; // Hệ số thành công cơ bản
            var maxTechLevelOnMarket = company.availablePlatforms.concat(company.licencedPlatforms).max(function (platform) {
                return platform.techLevel;
            }); // Lấy tech level cao nhất trên thị trường
            var isTechLeader = consoleProjectData.techLevel >= maxTechLevelOnMarket; // Console mới có phải là dẫn đầu về công nghệ không?
            var techLevelDifference = consoleProjectData.techLevel - maxTechLevelOnMarket;
            baseSuccessFactor = baseSuccessFactor + techLevelDifference / 5; // Điều chỉnh hệ số thành công dựa trên chênh lệch công nghệ

            var qualityFactor = consoleProjectData.qF; // Chất lượng hoàn thiện của console
            var qualityTechDifference = 10 * qualityFactor - consoleProjectData.techLevel;
            baseSuccessFactor = baseSuccessFactor + (qualityTechDifference / 20).clamp(-0.2, 0.2); // Điều chỉnh dựa trên chất lượng so với công nghệ

            // Tính toán độ phong phú tính năng (trừ đồ họa)
            var featureRichnessFactor = consoleProjectData.features.map(function (featureId) {
                return Research.getAllItems().first(function (item) {
                    return item.id === featureId;
                });
            }).filter(function (featureItem) {
                return featureItem.category != "Graphic".localize();
            }).sum(function (featureItem) {
                return featureItem.v; // 'v' có thể là giá trị/điểm của tính năng
            }) / 22; // 22 có thể là tổng giá trị tối đa của các tính năng này

            baseSuccessFactor = 0.7 * baseSuccessFactor + 0.3 * featureRichnessFactor; // Kết hợp các yếu tố
            if (baseSuccessFactor > 1) { // Giảm bớt nếu quá cao
                baseSuccessFactor = 1 + 0.3 * (baseSuccessFactor - 1);
            }

            // Tính toán số lượng bán ra ban đầu và tổng số lượng bán được
            var maxStartAmountOnMarket = Platforms.allPlatforms.filter(function (platform) {
                return platform.techLevel <= consoleProjectData.techLevel;
            }).max(function (platform) {
                return platform.startAmount;
            });
            var calculatedStartAmount = maxStartAmountOnMarket * baseSuccessFactor;

            var maxUnitsSoldOnMarket = Platforms.allPlatforms.filter(function (platform) {
                return platform.techLevel <= consoleProjectData.techLevel;
            }).max(function (platform) {
                return Platforms.getMarketSizeForWeek(platform, company.currentWeek + 144, company); // 144 tuần = 3 năm
            });
            var calculatedUnitsSold = maxUnitsSoldOnMarket / 5E6 * baseSuccessFactor; // 5E6 có thể là một hằng số thị trường

            // Tạo đối tượng dữ liệu cho platform console mới
            var newPlatformData = {
                id: gameManagerInstance.getGUID(),
                isCustom: !0,
                iconUri: consoleProjectData.iconUri,
                name: consoleProjectData.name,
                company: company.name,
                published: "{0}/{1}/{2}".format(currentDate.year, currentDate.month, currentDate.week),
                developmentCosts: 0, // Chi phí phát triển (có thể được tính riêng)
                genreWeightings: GameManager.getCalculatedPlatformGenreWeightings(), // Trọng số thể loại dựa trên lịch sử game của công ty
                audienceWeightings: GameManager.getCalculatedPlatformAudienceWeightings(), // Trọng số đối tượng
                techLevel: consoleProjectData.techLevel,
                isGoodTech: isTechLeader,
                featureFactor: featureRichnessFactor,
                startAmount: calculatedStartAmount,
                unitsSold: calculatedUnitsSold,
                qF: qualityFactor,
                successFactor: baseSuccessFactor,
                version: consoleProjectData.version
            };

            // Hủy việc bán các console tùy chỉnh cũ của công ty
            var existingCustomConsoles = company.licencedPlatforms.filter(function (platform) {
                return platform.isCustom && !platform.saleCancelled;
            });
            for (var i = 0; i < existingCustomConsoles.length; i++) {
                existingCustomConsoles[i].saleCancelled = !0;
            }

            company.licencedPlatforms.push(newPlatformData); // Thêm console mới vào danh sách platform đã cấp phép
            Media.createConsoleStartStory(newPlatformData); // Tạo tin tức về việc ra mắt console
            Tutorial.consoleReleased(1.4); // Kích hoạt tutorial
        }
    };

    // Hàm helper để cộng trọng số cho thể loại
    var addGenreWeight = function (genreWeightingsArray, genre, weightToAdd) {
        if (genre === GameGenre.Action) genreWeightingsArray[0] += weightToAdd;
        else if (genre === GameGenre.Adventure) genreWeightingsArray[1] += weightToAdd;
        else if (genre === GameGenre.RPG) genreWeightingsArray[2] += weightToAdd;
        else if (genre === GameGenre.Simulation) genreWeightingsArray[3] += weightToAdd;
        else if (genre === GameGenre.Strategy) genreWeightingsArray[4] += weightToAdd;
        else if (genre === GameGenre.Casual) genreWeightingsArray[5] += weightToAdd;
        else if (genre === GameGenre.VisualNovel) genreWeightingsArray[6] += weightToAdd;
        else if (genre === GameGenre.Sandbox) genreWeightingsArray[7] += weightToAdd;
        else if (genre === GameGenre.MOBA) genreWeightingsArray[8] += weightToAdd;
        else if (genre === GameGenre.BattleRoyale) genreWeightingsArray[9] += weightToAdd;
        else if (genre === GameGenre.Racing) genreWeightingsArray[10] += weightToAdd;
    };

    // Tính toán trọng số thể loại cho platform tùy chỉnh, dựa trên lịch sử game của công ty
    gameManagerInstance.getCalculatedPlatformGenreWeightings = function () {
        var targetWeightings = [0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8, 0.8]; // Trọng số mặc định
        var genreCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // Số lần mỗi thể loại được sử dụng
        var gameLog = gameManagerInstance.company.gameLog;

        // Đếm số lần mỗi thể loại xuất hiện trong lịch sử game
        for (var i = 0; i < gameLog.length; i++) {
            addGenreWeight(genreCounts, gameLog[i].genre, 1);
            if (gameLog[i].secondGenre) {
                addGenreWeight(genreCounts, gameLog[i].secondGenre, 0.5); // Thể loại phụ có trọng số thấp hơn
            }
        }

        var sortedGenreCounts = genreCounts.slice().sort(function (a, b) { return b - a; }); // Sắp xếp số lượng từ cao đến thấp
        var assignedWeightings = [1, 1, 0.9, 0.8, 0.8, 0.7]; // Trọng số gán dựa trên thứ hạng phổ biến

        // Gán trọng số dựa trên mức độ phổ biến của thể loại trong lịch sử game của công ty
        for (var i = sortedGenreCounts.length - 1; i >= 0; i--) {
            for (var j = 0; j < genreCounts.length; j++) {
                if (genreCounts[j] == sortedGenreCounts[i]) {
                    targetWeightings[j] = assignedWeightings[i];
                }
            }
        }
        return targetWeightings;
    };

    // Tính toán trọng số đối tượng cho platform tùy chỉnh
    gameManagerInstance.getCalculatedPlatformAudienceWeightings = function () {
        var targetWeightings = [0.8, 0.8, 0.8]; // Mặc định
        var audienceCounts = [0, 0, 0]; // [Young, Everyone, Mature]
        var gameLog = gameManagerInstance.company.gameLog;

        for (var i = 0; i < gameLog.length; i++) {
            if (gameLog[i].targetAudience === "young") audienceCounts[0]++;
            else if (gameLog[i].targetAudience === "mature") audienceCounts[2]++;
            else audienceCounts[1]++;
        }

        var maxCount = audienceCounts.max(function (count) { return count; });
        var minCount = audienceCounts.min(function (count) { return count; });

        for (var i = 0; i < targetWeightings.length; i++) {
            if (audienceCounts[i] === maxCount) targetWeightings[i] = 1;
            else if (audienceCounts[i] === minCount) targetWeightings[i] = 0.8;
            else targetWeightings[i] = 0.9;
        }
        return targetWeightings;
    };

    // Tính chi phí duy trì lab hàng tháng
    gameManagerInstance.getLabCostPerMonth = function (labZone) { // 0 for HW, 2 for R&D
        if (!GameManager.company) return 0;
        var budgetPercentage = 0;
        var maxPossibleBudget = 1; // Giá trị mặc định để tránh chia cho 0

        if (labZone === 0 && GameManager.company.flags.hwLabUnlocked) {
            budgetPercentage = GameManager.company.flags.hwBudget;
            maxPossibleBudget = gameManagerInstance.getMaxHwBudget();
        } else if (labZone == 2 && GameManager.company.flags.rndLabUnlocked) {
            budgetPercentage = GameManager.company.flags.rndBudget;
            maxPossibleBudget = gameManagerInstance.getMaxRndBudget();
        }
        // Chi phí được tính dựa trên % ngân sách của chi phí tối đa, làm tròn xuống 10k gần nhất
        var monthlyCost = 1E4 * Math.floor(maxPossibleBudget * budgetPercentage / 1E4);
        return monthlyCost;
    };

    // Tính toán và cộng dồn chi phí lab phát sinh theo thời gian (delta)
    gameManagerInstance.calculateFractionalLabCosts = function (deltaTimeMs) {
        if (GameManager.company && deltaTimeMs !== 0) {
            if (GameManager.company.flags.hwLabUnlocked) {
                var monthlyCost = gameManagerInstance.getLabCostPerMonth(0);
                if (monthlyCost != 0) {
                    monthlyCost /= (4 * GameManager.SECONDS_PER_WEEK); // Chi phí mỗi giây
                    GameManager.company.flags.fractionalHwLabCosts += monthlyCost / 1E3 * deltaTimeMs; // Cộng dồn theo mili giây
                }
            }
            if (GameManager.company.flags.rndLabUnlocked) {
                var monthlyCost = gameManagerInstance.getLabCostPerMonth(2);
                if (monthlyCost != 0) {
                    monthlyCost /= (4 * GameManager.SECONDS_PER_WEEK);
                    GameManager.company.flags.fractionalRndLabCosts += monthlyCost / 1E3 * deltaTimeMs;
                }
            }
        }
    };

    // Listener được gọi mỗi tick của game
    gameManagerInstance.addTickListener(function (deltaTimeMs) {
        // Nếu công ty ở level 4 và có lab HW hoặc R&D đã mở khóa
        if (GameManager.company && GameManager.company.currentLevel === 4 &&
            (GameManager.company.flags.hwLabUnlocked || GameManager.company.flags.rndLabUnlocked)) {
            gameManagerInstance.calculateFractionalLabCosts(deltaTimeMs); // Tính chi phí lab
            VisualsManager.updateProjectStatusCards(); // Cập nhật UI
        }
        // Nếu đang phát triển console tùy chỉnh, đã đạt 75% tiến độ và chưa thông báo
        if (gameManagerInstance.currentHwProject && gameManagerInstance.currentHwProject.progress >= 0.75 &&
            !gameManagerInstance.currentHwProject.announceQ && gameManagerInstance.currentHwProject.id === "custom console") {
            gameManagerInstance.currentHwProject.announceQ = !0; // Đánh dấu đã thông báo
            var notification = DecisionNotifications.announceConsole.getNotification(gameManagerInstance.company);
            if (notification) {
                gameManagerInstance.company.notifications.push(notification); // Thêm thông báo quyết định
            }
        }
    }, !0); // !0 nghĩa là listener này liên quan đến thời gian trong game
})();

// IIFE này mở rộng GameManager với các chức năng liên quan đến hợp đồng
(function () {
    var gameManagerInstance = GameManager; // Tham chiếu nội bộ

    // Kích hoạt tính năng hợp đồng lần đầu
    gameManagerInstance.enableContracts = function () {
        var company = GameManager.company;
        var weeksUntilFired = 2 + 2 * company.getRandom(); // Thời gian ngẫu nhiên trước khi thông báo này xuất hiện
        var lastGame = company.gameLog.last();
        // Đoạn text mô tả ấn tượng về game cuối cùng của người chơi
        var impressionFragment = lastGame.score >= 8 ? "I love your work".localize("contractDescrFragment") :
            lastGame.score >= 5 ? "I am impressed by your talent".localize("contractDescrFragment") :
                "I think you have potential".localize("contractDescrFragment");

        var notificationObject = new Notification(
            "Contract Work".localize("heading"),
            "Hi there,\nI've just finished {0} and {1}.\nI'm in the contracting business and we could use skills like yours. If you are ever short on cash just let me know and I will see if I have some work for you.\nJason".localize("{1} is contractDescrFragment").format(lastGame.title, impressionFragment)
        );
        notificationObject.type = NotificationType.Others;
        notificationObject.previewImage = "./images/notificationIcons/icon_notification_contract_generic.png";
        notificationObject.weeksUntilFired = weeksUntilFired;
        notificationObject.setFlag("contractsEnabled", !0); // Đặt cờ cho phép hợp đồng
        company.notifications.push(notificationObject);
        Tutorial.contractsUnlocked(weeksUntilFired); // Kích hoạt tutorial
    };

    // Kích hoạt hợp đồng loại trung bình
    gameManagerInstance.enableMediumContracts = function () {
        var company = GameManager.company;
        if (!company.flags.mediumContractsScheduled) { // Chỉ kích hoạt một lần
            company.flags.mediumContractsScheduled = !0;
            var weeksUntilFired = 4 + 3 * company.getRandom();
            var notificationObject = new Notification(
                "Contract Work".localize("heading"),
                "Hi again,\nI heard that you've been very successful in the gaming business and are starting to grow your team.\nI've updated our client list, so if you are looking for some contract work let me know.\nJason{n}Medium sized contracts have been unlocked.".localize()
            );
            notificationObject.type = NotificationType.Others;
            notificationObject.previewImage = "./images/notificationIcons/icon_notification_contract_generic.png";
            notificationObject.weeksUntilFired = weeksUntilFired;
            notificationObject.setFlag("mediumContractsEnabled", !0);
            company.notifications.push(notificationObject);
        }
    };

    // Kích hoạt hợp đồng loại lớn
    gameManagerInstance.enableLargeContracts = function (weeksUntilFired) {
        var company = GameManager.company;
        if (!company.flags.largeContractsScheduled) {
            company.flags.largeContractsScheduled = !0;
            var notificationObject = new Notification(
                "Contract Work".localize("heading"),
                "Wow, I have seen some pictures of your new office! Cutting edge stuff!\nI'm sure you are doing very well but if you need to top up your budget I've a couple of big jobs that need to be taken care of.\nJason{n}Large contracts have been unlocked.".localize()
            );
            notificationObject.type = NotificationType.Others;
            notificationObject.previewImage = "./images/notificationIcons/icon_notification_contract_generic.png";
            notificationObject.weeksUntilFired = weeksUntilFired;
            notificationObject.setFlag("largeContractsEnabled", !0);
            company.notifications.push(notificationObject);
        }
    };

    // Xử lý khi một hợp đồng kết thúc (thành công hoặc thất bại)
    gameManagerInstance.contractFinished = function (wasSuccessful) {
        var company = GameManager.company;
        var staffList = company.staff;
        // Đặt trạng thái nhân viên về Idle nếu họ đang làm hợp đồng
        for (var i = 0; i < staffList.length; i++) {
            if (staffList[i].state == CharacterState.WorkOnContract) {
                staffList[i].state = CharacterState.Idle;
            }
        }
        if (!company.flags.contractFinishedShown) { // Chỉ hiển thị thông báo này một lần
            company.flags.contractFinishedShown = !0;
            var notificationText = wasSuccessful ?
                "Jason here.\nI just got word from the client that the contract was completed successfully. Excellent work!".localize() + "\n" :
                "Jason here.\nI see that the contract was not completed in time. Be careful what contracts you accept otherwise those penalties quickly add up.{n}Don't worry too much though, I don't hold grudges. If you want to try again let me know.".localize() + "\n";
            company.notifications.push(new Notification(
                "Contract Work".localize("heading"),
                notificationText + "Usually I have new contracts every six months so check back some time.".localize(),
                "OK".localize(),
                0.3,
                {
                    type: NotificationType.Others,
                    previewImage: "./images/notificationIcons/icon_notification_contract_generic.png"
                }
            ));
        }
    };

    // Bắt đầu một hợp đồng
    gameManagerInstance.startContract = function (contractData) {
        var contractDefinition = ProjectContracts.getAllContracts().first(function (def) {
            return def.id === contractData.id;
        });
        if (contractDefinition.accept) {
            contractDefinition.accept(gameManagerInstance.company); // Gọi hàm accept của định nghĩa hợp đồng (nếu có)
        }
        var currentContractObject = {};
        $.extend(currentContractObject, contractData);

        // Nếu là hợp đồng chung (generic), thiết lập các thông số điểm và thời gian
        if (contractData.requiredD || contractData.requiredT) {
            currentContractObject.isGenericContract = !0;
            currentContractObject.remainingD = contractData.requiredD;
            currentContractObject.remainingT = contractData.requiredT;
            currentContractObject.visualDRemaining = contractData.requiredD; // Dùng cho UI
            currentContractObject.visualTRemaining = contractData.requiredT; // Dùng cho UI
            currentContractObject.startTime = gameManagerInstance.gameTime;
        }
        gameManagerInstance.currentContract = currentContractObject; // Đặt hợp đồng hiện tại

        if (currentContractObject.type === "gameContract") { // Nếu là hợp đồng phát triển game
            gameManagerInstance.company.adjustCash(currentContractObject.payment, "Up-front payment".localize("heading"));
            UI.updateStatusBar(gameManagerInstance.company);
            gameManagerInstance.transitionToState(State.CreateGame); // Chuyển sang trạng thái tạo game
        } else {
            VisualsManager.startContract(); // Bắt đầu hiển thị UI cho hợp đồng chung
        }
        GDT.fire(gameManagerInstance, GDT.eventKeys.gameplay.contractStarted, {
            company: gameManagerInstance.company,
            contract: gameManagerInstance.currentContract
        });
    };

    // Hủy hợp đồng hiện tại
    gameManagerInstance.contractCancelled = function () {
        var cancelledContract = gameManagerInstance.currentContract;
        gameManagerInstance.currentContract = null;
        // Hoàn tiền nếu là hợp đồng phát triển game
        if (cancelledContract.type === "gameContract") {
            gameManagerInstance.company.adjustCash(-cancelledContract.payment, "Contract Refund".localize("heading"));
        }
    };

    // Thiết lập các yêu cầu của hợp đồng (khóa topic, genre, platform, etc.) cho game đang phát triển
    gameManagerInstance._setContractRequirements = function (gameBeingDeveloped) {
        var currentContract = gameManagerInstance.currentContract;
        gameBeingDeveloped.flags.lockedSettings = {}; // Đối tượng chứa các setting bị khóa

        if (currentContract.topic) {
            gameBeingDeveloped.topic = Topics.topics.first(function (topic) { return topic.id == currentContract.topic; });
            gameBeingDeveloped.flags.lockedSettings.topic = !0;
        }
        if (currentContract.genre) {
            gameBeingDeveloped.genre = GameGenre.getAll().first(function (genre) { return genre.id == currentContract.genre; });
            gameBeingDeveloped.flags.lockedSettings.genre = !0;
        }
        if (currentContract.secondGenre) {
            gameBeingDeveloped.secondGenre = GameGenre.getAll().first(function (genre) { return genre.id == currentContract.secondGenre; });
            gameBeingDeveloped.flags.lockedSettings.secondGenre = !0;
        }
        if (currentContract.platform) {
            gameBeingDeveloped.platforms = [];
            gameBeingDeveloped.platforms.push(GameManager.company.licencedPlatforms.first(function (platform) { return platform.id == currentContract.platform; }));
            gameBeingDeveloped.flags.lockedSettings.platform = !0;
        }
        if (currentContract.gameAudience) {
            gameBeingDeveloped.targetAudience = currentContract.gameAudience;
            gameBeingDeveloped.flags.lockedSettings.targetAudience = !0;
        }
        if (currentContract.gameSize) {
            gameBeingDeveloped.gameSize = currentContract.gameSize;
            gameBeingDeveloped.flags.lockedSettings.gameSize = !0;
        }
        gameBeingDeveloped.flags.contractId = currentContract.refNumber; // Lưu ID tham chiếu của hợp đồng
        gameBeingDeveloped.flags.royaltyRate = currentContract.royaltyRate; // Lưu tỷ lệ hoa hồng
    };

    // Hoàn thành một hợp đồng
    gameManagerInstance.finishContract = function (timedOut) { // timedOut: true nếu hợp đồng hết hạn
        var finishedContract = gameManagerInstance.currentContract;
        gameManagerInstance.currentContract = null;
        if (finishedContract.isGenericContract) {
            VisualsManager.gameStatusBar.finishContract(); // Kết thúc UI hợp đồng chung
        }
        var contractDefinition = ProjectContracts.getAllContracts().first(function (def) {
            return def.id === finishedContract.id;
        });
        if (contractDefinition && contractDefinition.complete) {
            contractDefinition.complete(gameManagerInstance.company, !timedOut, finishedContract); // Gọi hàm complete của định nghĩa hợp đồng
        }
        GDT.fire(gameManagerInstance, GDT.eventKeys.gameplay.contractFinished, {
            company: gameManagerInstance.company,
            contract: finishedContract
        });
    };

    // Cập nhật tiến độ hợp đồng (cho hợp đồng generic có thời hạn)
    gameManagerInstance.updateContractProgress = function () {
        var currentContract = gameManagerInstance.currentContract;
        // Chỉ áp dụng cho hợp đồng có thời hạn và không có game nào đang được phát triển (để không xung đột UI)
        if (currentContract.weeksToFinish && !gameManagerInstance.company.currentGame) {
            if (currentContract.visualDRemaining <= 0 && currentContract.visualTRemaining <= 0) {
                gameManagerInstance.finishContract(); // Hoàn thành nếu đã đủ điểm
            } else {
                // Tính toán % thời gian đã trôi qua
                var progressPercentage = (gameManagerInstance.gameTime - currentContract.startTime) / (currentContract.weeksToFinish * gameManagerInstance.SECONDS_PER_WEEK * 1E3);
                if (progressPercentage >= 1) {
                    gameManagerInstance.finishContract(!0); // Hết thời gian, đánh dấu thất bại
                } else {
                    VisualsManager.gameStatusBar.updateProgress(1 - progressPercentage, !0, 100); // Cập nhật UI thanh tiến độ (thời gian còn lại)
                }
            }
        }
    };
})();