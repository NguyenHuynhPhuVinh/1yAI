var GameManager = {
    VERSION: 8, // Phiên bản của cấu trúc save game, dùng để migrate khi tải save game cũ
    gameSpeed: "normal" // Giá trị mặc định cho tốc độ game
};
(function () {
    // Hàm này xử lý việc tải dữ liệu game từ một đối tượng save game
    // savedGameData: Dữ liệu save game đã được parse từ JSON
    // onSuccessCallback: Callback được gọi khi tải thành công
    // onErrorCallback: Callback được gọi khi có lỗi xảy ra trong quá trình tải
    function loadGameData(savedGameData, onSuccessCallback, onErrorCallback) {
        try {
            $("#splashScreen").remove(); // Xóa màn hình chờ (nếu có)
            UpdateNotifications.checkAndShowNotifications(); // Kiểm tra và hiển thị thông báo cập nhật (nếu có)
            GDT.fire(gameManagerInstance, GDT.eventKeys.saves.loading, { // Kích hoạt sự kiện đang tải save game
                data: savedGameData
            });
            // Reset kinh nghiệm của tất cả các mission và research item về 0 trước khi tải
            Missions.getAllMissions().forEach(function (mission) {
                mission.experience = 0;
            });
            Research.getAllItems().forEach(function (researchItem) {
                researchItem.experience = 0;
            });

            // Nếu phiên bản save game khác phiên bản hiện tại, thực hiện migrate
            if (savedGameData.version != gameManagerInstance.VERSION) {
                savedGameData = SavegameMigrator.migrate(savedGameData);
            }

            gameManagerInstance.loadInProgress = true; // Đánh dấu đang trong quá trình tải
            gameManagerInstance.gameTime = savedGameData.gameTime; // Tải thời gian game
            gameManagerInstance.playerPause = savedGameData.playerPause; // Tải trạng thái tạm dừng của người chơi
            gameManagerInstance.systemPause = false; // Reset trạng thái tạm dừng hệ thống
            gameManagerInstance._timeModifier = savedGameData.timeModifier; // Tải hệ số tốc độ game
            gameManagerInstance._oldTimeModifier = savedGameData.oldTimeModifier; // Tải hệ số tốc độ game cũ (khi bị tạm dừng)
            gameManagerInstance.company = Company.load(savedGameData.company); // Tải dữ liệu công ty

            // Hiển thị hoặc ẩn background chính dựa trên slot của công ty (có lẽ liên quan đến việc game đã bắt đầu hay chưa)
            gameManagerInstance.company.slot ? $("#mainBackground").fadeIn() : $("#mainBackground").fadeOut();

            gameManagerInstance.state = savedGameData.state; // Tải trạng thái game (ví dụ: Idle, CreateGame)
            gameManagerInstance.currentMission = savedGameData.currentMission; // Tải mission hiện tại
            gameManagerInstance.currentResearches = savedGameData.currentResearches; // Tải các nghiên cứu đang thực hiện
            if (!gameManagerInstance.currentResearches) {
                gameManagerInstance.currentResearches = [];
            }
            // Gán lại nghiên cứu hiện tại cho từng nhân viên
            for (var researchIndex = 0; researchIndex < gameManagerInstance.currentResearches.length; researchIndex++) {
                var currentResearchItem = gameManagerInstance.currentResearches[researchIndex];
                gameManagerInstance.company.staff.filter(function (staffMember) {
                    return staffMember.id === currentResearchItem.staffId;
                }).forEach(function (staffMember) {
                    staffMember.currentResearch = currentResearchItem;
                });
            }
            gameManagerInstance.currentEngineDev = savedGameData.currentEngineDev; // Tải thông tin phát triển engine hiện tại
            gameManagerInstance.currentHwProject = savedGameData.currentHwProject; // Tải thông tin dự án phần cứng hiện tại
            gameManagerInstance.currentRnDProject = savedGameData.currentRnDProject; // Tải thông tin dự án R&D hiện tại
            gameManagerInstance.currentContract = savedGameData.currentContract; // Tải thông tin hợp đồng hiện tại
            gameManagerInstance.uiSettings = savedGameData.uiSettings; // Tải cài đặt UI
            gameManagerInstance.flags = savedGameData.flags; // Tải các cờ trạng thái của game
            if (!gameManagerInstance.flags) {
                gameManagerInstance.flags = {};
            }
            gameManagerInstance.spawnedPoints = savedGameData.spawnedPoints; // Tải số điểm đã được tạo ra (ví dụ: điểm design, tech)

            var missionXPData = savedGameData.missionXP; // Lấy dữ liệu kinh nghiệm của các mission
            if (missionXPData) {
                var allMissions = Missions.getAllMissions();
                for (researchIndex = 0; researchIndex < missionXPData.length; researchIndex++) { // `d` đã được khai báo ở trên, tái sử dụng là `researchIndex`
                    var missionXPItem = missionXPData[researchIndex];
                    var missionInstance = allMissions.first(function (mission) {
                        return mission.id === missionXPItem.id;
                    });
                    if (missionInstance) {
                        missionInstance.experience = missionXPItem.xp;
                        missionInstance.percentage = missionXPItem.percentage;
                    }
                }
            }

            var featureXPData = savedGameData.featureXP; // Lấy dữ liệu kinh nghiệm của các feature
            if (featureXPData) {
                featureXPData.forEach(function (featureData) {
                    FeatureSerializer.load(featureData);
                });
            }

            gameManagerInstance.currentFeature = savedGameData.currentFeature; // Tải feature hiện tại đang phát triển
            gameManagerInstance.plannedFeatures = null; // Reset danh sách feature đã lên kế hoạch
            if (savedGameData.plannedFeatures) {
                gameManagerInstance.plannedFeatures = savedGameData.plannedFeatures.map(function (featureData) {
                    return CompanyFeatureSerializer.load(featureData);
                });
            }
            gameManagerInstance.gameId = Math.random(); // Tạo ID mới cho session game này (để tránh lỗi từ các tween cũ)
            // Nếu đang chạy trên Steam, kiểm tra các achievement chưa hoàn thành trên Steam
            if (GameFlags.IS_STEAM) {
                Achievements.checkForAchievmentsNotCompletedOnSteam();
            }
            GDT.fire(gameManagerInstance, GDT.eventKeys.saves.loaded); // Kích hoạt sự kiện tải save game hoàn tất
            if (onSuccessCallback) {
                onSuccessCallback(); // Gọi callback thành công
            }
        } catch (error) {
            Logger.LogError("Could not initialize loaded game! ", error, "Could not initialize loaded game".localize());
            if (onErrorCallback) {
                onErrorCallback(error); // Gọi callback lỗi
            }
        }
    }

    var gameManagerInstance = GameManager; // Gán GameManager vào biến cục bộ để dễ truy cập
    gameManagerInstance.gameId = Math.random(); // ID ngẫu nhiên cho session game, có thể để phân biệt các instance
    gameManagerInstance.company = void 0; // Thông tin công ty của người chơi, sẽ được khởi tạo sau

    // Khởi tạo GameManager
    gameManagerInstance.init = function () {
        gameManagerInstance._initKeyboardShortcuts(); // Khởi tạo các phím tắt

        // Thêm nút điều khiển tốc độ vào UI
        gameManagerInstance.addSpeedControlButton();
    };

    // Các hàm có tên ghgX có thể là các hàm debug hoặc liên quan đến phiên bản game (ví dụ: bản full, lite, trial)
    gameManagerInstance.ghg3 = function () { // Có thể là hàm lấy đối tượng Store của Windows
        return GameFlags.ghg6 ? Windows.ApplicationModel.Store.CurrentAppSimulator : Windows.ApplicationModel.Store.CurrentApp;
    };
    gameManagerInstance.ghg0 = function () { // Có thể là cờ kiểm tra một phiên bản game đặc biệt (ví dụ: lite)
        return GameFlags.ghg7;
    };
    gameManagerInstance.ghg1 = function () { // Có thể là hàm kiểm tra phiên bản game mới hoặc thông báo về bản full
        if (!gameManagerInstance.ghg0()) return false;
        if (PlatformShim.ISWIN8) {
            WinJS.xhr({
                url: "http://www.greenheartgames.com/utils/gamedevtycoonappuri"
            }).done(function (response) {
                if (response && response.responseText) {
                    var appUri = response.responseText;
                    try {
                        new Windows.Foundation.Uri(appUri); // Kiểm tra xem URI có hợp lệ không
                    } catch (error) {
                        Logger.LogInfo("Could not check latest game version", error);
                    }
                    var isFirstTimeChecking = false;
                    if (!DataStore.getValue("full-game-uri")) {
                        isFirstTimeChecking = true;
                    }
                    DataStore.setValue("full-game-uri", appUri);
                    if (isFirstTimeChecking) {
                        UpdateNotifications.showFullGameIsAvailable();
                    }
                }
            }, function (error) { /* Xử lý lỗi xhr */ });
        } else {
            $.get("http://www.greenheartgames.com/utils/gamedevtycoonwinnativeeappuri",
                function (appUri) {
                    if (appUri && appUri.startsWith("http")) {
                        var isFirstTimeChecking = false;
                        if (!DataStore.getValue("full-game-uri")) {
                            isFirstTimeChecking = true;
                        }
                        DataStore.setValue("full-game-uri", appUri);
                        if (isFirstTimeChecking) {
                            UpdateNotifications.showFullGameIsAvailable();
                        }
                    }
                });
        }
    };

    // Kiểm tra xem người chơi có phải là "supporter" không (có thể liên quan đến việc mua game hoặc DLC)
    gameManagerInstance.isSupporter = function () {
        return !gameManagerInstance.ghg2();
    };

    // Kiểm tra xem game có phải là phiên bản trial/lite không
    gameManagerInstance.ghg2 = function () {
        if (!PlatformShim.ISWIN8) return gameManagerInstance.ghg0(); // Nếu không phải Windows 8, dựa vào cờ ghg0
        if (GameFlags.ghg6 === true) return false; // Nếu là bản debug, không phải trial
        try {
            if (gameManagerInstance.ghg0()) return true; // Nếu cờ ghg0 bật, là trial
            var currentApp = gameManagerInstance.ghg3();
            return currentApp && currentApp.licenseInformation.isActive ? currentApp.licenseInformation.isTrial : true; // Mặc định là trial nếu không lấy được thông tin
        } catch (error) {
            ghg4.ghg5("isTrial error"); // Ghi log lỗi
            Logger.LogInfo("isTrial failed", error);
            return true;
        }
    };

    // Khởi tạo các phím tắt cho game
    gameManagerInstance._initKeyboardShortcuts = function () {
        window.onkeyup = function (keyboardEvent) {
            // Bỏ qua nếu người dùng đang nhập liệu vào ô input
            if (!keyboardEvent.srcElement || keyboardEvent.srcElement.nodeName !== "INPUT") {
                // Các phím tắt không yêu cầu mở modal
                if (!UI.isModalContentOpen()) {
                    switch (keyboardEvent.which) {
                        case 37: // Mũi tên trái
                            VisualsManager.scrollToNextZone(-1);
                            break;
                        case 39: // Mũi tên phải
                            VisualsManager.scrollToNextZone(1);
                            break;
                    }
                }
                // Các phím tắt có thể yêu cầu quyền debug hoặc một flag đặc biệt
                var isDebugMode = GameFlags.ghg6;
                var canUseDevShortcuts = isDebugMode || (GameManager.company && GameManager.company.flags.ghg141);
                switch (keyboardEvent.which) {
                    case 192: // Dấu ` (tilde)
                        if (canUseDevShortcuts) GameManager.togglePause(true);
                        break;
                    case 49: // Số 1
                        if (canUseDevShortcuts) GameManager.setGameSpeed("slow");
                        break;
                    case 50: // Số 2
                        if (canUseDevShortcuts) GameManager.setGameSpeed("normal");
                        break;
                    case 51: // Số 3
                        if (canUseDevShortcuts) GameManager.setGameSpeed("fast");
                        break;
                    case 52: // Số 4 (chỉ debug)
                        if (isDebugMode) GameManager.setGameSpeed("super-fast");
                        break;
                    case 53: // Số 5 (chỉ debug)
                        if (isDebugMode) GameManager.setGameSpeed("extra-fast");
                        break;
                    case 82: // Phím R (chỉ debug) - Test save/load
                        if (isDebugMode) GameManager.testSaveLoad();
                        break;
                    case 83: // Phím S (chỉ debug) - Save auto
                        if (isDebugMode) gameManagerInstance.save("auto");
                        break;
                    case 76: // Phím L (chỉ debug) - Load auto
                        if (isDebugMode) gameManagerInstance.reload("auto");
                        break;
                }
            }
        };
    };

    // Hàm test nhanh việc lưu và tải game
    gameManagerInstance.testSaveLoad = function () {
        gameManagerInstance.save("auto");
        gameManagerInstance.reload("auto");
    };

    // Tải lại game từ một slot
    // slot: Tên slot save game (ví dụ "auto", "1", "2")
    // onSuccessCallback: Callback khi tải thành công
    // onErrorCallback: Callback khi có lỗi
    // instantLoad: Tải ngay lập tức hay có hiệu ứng chuyển cảnh
    gameManagerInstance.reload = function (slot, onSuccessCallback, onErrorCallback, instantLoad) {
        if (!instantLoad) UI.fadeInTransitionOverlay(); // Hiển thị hiệu ứng chuyển cảnh nếu không phải tải ngay
        UI.closeAllDialogs(); // Đóng tất cả các dialog đang mở
        UI.currentCloseCallback = null; // Reset callback đóng dialog hiện tại
        gameManagerInstance.pause(true, false); // Tạm dừng game (system pause)

        var loadFunction = function () {
            gameManagerInstance.load(slot, function () { // Gọi hàm load game
                var currentLevel = gameManagerInstance.company.currentLevel;
                // Xác định các tài nguyên không cần thiết cho level hiện tại và xóa chúng
                var resourcesToRemove = ResourceKeys.getLevelResources.apply(ResourceKeys, [1, 2, 3, 4].except([currentLevel]));
                FlippingCounter.init(); // Khởi tạo lại bộ đếm lật số (nếu có)
                GameDev.ResourceManager.removeResources(resourcesToRemove); // Xóa tài nguyên không cần
                // Đảm bảo tài nguyên cho level hiện tại đã được tải
                GameDev.ResourceManager.ensureResources(ResourceKeys.getLevelResources(currentLevel), function () {
                    if (SplashScreen.removeSplashScreen()) { // Xóa màn hình chờ
                        Sound.playBackgroundMusic(); // Bắt đầu nhạc nền
                    }
                    VisualsManager.reset(); // Reset lại các thành phần đồ họa

                    // Khôi phục trạng thái UI dựa trên trạng thái game đã tải
                    if (gameManagerInstance.state === State.ExecuteWorkItems || gameManagerInstance.state === State.PickWorkItems || gameManagerInstance.state === State.ReleaseGame || gameManagerInstance.spawnedPoints > 0) {
                        if (gameManagerInstance.state != State.ReleaseGame) {
                            VisualsManager.gameStatusBar.startDevelopment();
                            gameManagerInstance.updateCurrentHypePoints();
                        }
                        if (gameManagerInstance.currentFeature) {
                            if (gameManagerInstance.currentFeature.missionType === "preparation") {
                                VisualsManager.gameStatusBar.updateStatusMessage("Starting ...".localize());
                            } else if (gameManagerInstance.currentFeature.missionType === "BugFixing") {
                                VisualsManager.gameStatusBar.updateStatusMessage("Finishing ...".localize());
                            } else {
                                VisualsManager.gameStatusBar.updateStatusMessage(gameManagerInstance.currentFeature.id);
                            }
                        }
                    }
                    // Khôi phục trạng thái nghiên cứu của nhân viên
                    if (gameManagerInstance.currentResearches.length > 0) {
                        for (var staffIndex = 0; staffIndex < gameManagerInstance.company.staff.length; staffIndex++) {
                            if (gameManagerInstance.company.staff[staffIndex].state === CharacterState.Researching) {
                                VisualsManager.getCharacterOverlay(gameManagerInstance.company.staff[staffIndex]).startResearching();
                            }
                        }
                    }
                    // Khôi phục trạng thái phát triển engine và hợp đồng
                    if (gameManagerInstance.currentEngineDev) VisualsManager.startCreateEngine();
                    if (gameManagerInstance.currentContract && gameManagerInstance.currentContract.type != "gameContract") VisualsManager.startContract();

                    // Hàm thực hiện sau khi tất cả tài nguyên đã sẵn sàng
                    var afterResourceLoad = function () {
                        // Khôi phục trạng thái tạm dừng
                        if (gameManagerInstance.systemPause) gameManagerInstance.pause(true);
                        else gameManagerInstance.resume(true);
                        if (gameManagerInstance.playerPause) gameManagerInstance.pause(false);
                        else gameManagerInstance.resume(false);

                        // Xử lý thông báo và chuyển trạng thái game
                        if (gameManagerInstance.state == State.ReleaseGame && gameManagerInstance.company && gameManagerInstance.company.notifications.count(function (notification) { return "{ReleaseGame}" === notification.header; }) == 0) {
                            gameManagerInstance.notifyIdleState();
                        }
                        if (gameManagerInstance.state == State.ReleaseGame || (gameManagerInstance.state == State.PickWorkItems && gameManagerInstance.company && gameManagerInstance.company.activeNotifications && gameManagerInstance.company.activeNotifications.first(function (notification) { return "{FeatureList}" === notification.header; }))) {
                            gameManagerInstance.showPendingNotifications();
                        } else {
                            gameManagerInstance.transitionToState(gameManagerInstance.state);
                        }
                        if (onSuccessCallback) onSuccessCallback();
                        gameManagerInstance.loadInProgress = false; // Đánh dấu đã tải xong
                    };
                    // Ẩn hiệu ứng chuyển cảnh (nếu có) trước khi thực hiện
                    if (UI.isTransitionVisible) UI.fadeOutTransitionOverlay(function () { afterResourceLoad(); });
                    else afterResourceLoad();
                });
            }, onErrorCallback);
        };
        // Thực hiện tải ngay hoặc sau một khoảng trễ (cho hiệu ứng)
        if (instantLoad) loadFunction();
        else setTimeout(loadFunction, 800);
    };

    // Lấy save game gần nhất để tiếp tục
    gameManagerInstance.getGameToContinue = function () {
        var saveGames = GameManager.getSaveGames();
        var latestSave = null;
        for (var i = 0; i < saveGames.length; i++) {
            if (saveGames[i] && (!latestSave || latestSave.saveTime < saveGames[i].saveTime)) {
                latestSave = saveGames[i];
            }
        }
        return latestSave;
    };

    // Tiếp tục game từ save gần nhất
    gameManagerInstance.continueGame = function () {
        var gameToContinue = GameManager.getGameToContinue();
        if (gameToContinue) {
            UI.fadeInTransitionOverlay(function () {
                SplashScreen.removeSplashScreen();
                GameManager.reload(gameToContinue.slot,
                    function () { // onSuccess
                        Sound.playBackgroundMusic();
                        GameManager.resume(true);
                    },
                    function () { // onError
                        GameManager.startNewGame(); // Nếu không tải được, bắt đầu game mới
                    }, true); // instantLoad = true
            });
        }
    };

    // Bắt đầu một game mới
    gameManagerInstance.startNewGame = function () {
        // Xóa tài nguyên của các level không phải level 1
        GameDev.ResourceManager.removeResources(ResourceKeys.getLevelResources(2, 3, 4));
        // Tải tài nguyên cho level 1
        GameDev.ResourceManager.ensureResources(ResourceKeys.getLevelResources(1), function () {
            SplashScreen.removeSplashScreen();
            Sound.playBackgroundMusic();
            setupNewGameInternal(); // Gọi hàm nội bộ để thiết lập game mới
        });
    };

    // Hàm nội bộ để thiết lập các thông số cho game mới
    var setupNewGameInternal = function () {
        UI.closeAllDialogs();
        UI.currentCloseCallback = null;
        gameManagerInstance.useKnowledgeAnswered = void 0; // Reset cờ sử dụng kiến thức từ game trước
        $("#mainBackground").fadeOut();
        $("foregroundCanvas").hide();
        gameManagerInstance._setupNewGame(); // Thiết lập dữ liệu game mới
        Media.createWelcomeNotifications(); // Tạo các thông báo chào mừng
        // Hiển thị chuỗi các thông báo tutorial
        gameManagerInstance.showPendingNotifications(function () {
            Tutorial.AppbarAndHelp();
            gameManagerInstance.showPendingNotifications(function () {
                Tutorial.createdCompany();
                gameManagerInstance.showPendingNotifications(function () {
                    // Kích hoạt achievement dựa trên tên công ty
                    if (gameManagerInstance.company.name == "Greenheart Games") Achievements.activate(Achievements.admirer);
                    else if (!Achievements.hasAchieved(Achievements.fanBoy) && RealCompanyNames.indexOf(gameManagerInstance.company.name) != -1) Achievements.activate(Achievements.fanBoy);
                });
            });
        });
    };

    // Thiết lập chi tiết dữ liệu cho một game mới
    gameManagerInstance._setupNewGame = function () {
        var newCompany = new Company(gameManagerInstance.companyName);
        newCompany.uid = gameManagerInstance.getGUID(); // Tạo UID duy nhất cho công ty
        newCompany.seed = Math.floor(65535 * Math.random()); // Tạo seed ngẫu nhiên
        newCompany._mersenneTwister = new MersenneTwister(newCompany.seed); // Khởi tạo bộ sinh số ngẫu nhiên
        newCompany.slot = gameManagerInstance.slot;
        newCompany.cash = 7E4; // Số tiền khởi đầu
        newCompany.topics = General.getTopicOrder(newCompany).slice(0, 4); // Lấy 4 topic đầu tiên
        // Thêm các feature ban đầu (những feature không có thời gian nghiên cứu)
        var allResearchItems = Research.getAllItems();
        for (var i = 0; i < allResearchItems.length; i++) {
            if (!allResearchItems[i].duration) { // Nếu research item không có duration (tức là có sẵn)
                newCompany.features.push(allResearchItems[i]);
            }
        }
        // Reset các trạng thái phát triển
        gameManagerInstance.currentEngineDev = null;
        gameManagerInstance.currentHwProject = null;
        gameManagerInstance.currentRnDProject = null;
        gameManagerInstance.currentContract = null;
        gameManagerInstance.currentFeature = null;
        gameManagerInstance.currentResearches = [];
        gameManagerInstance.plannedFeatures = null;
        gameManagerInstance.company = newCompany; // Gán công ty mới tạo
        gameManagerInstance.gameTime = 0;
        gameManagerInstance.playerPause = false;
        gameManagerInstance.systemPause = false;
        gameManagerInstance._timeModifier = 1;
        gameManagerInstance.uiSettings = UI.createDefaultUISettings(); // Tạo cài đặt UI mặc định
        gameManagerInstance.flags = { gameLengthModifier: 1.16667 }; // Cờ mặc định
        // Reset kinh nghiệm của các mission và research item
        Missions.getAllMissions().forEach(function (mission) { mission.experience = 0; });
        Research.getAllItems().forEach(function (researchItem) { researchItem.experience = 0; });
        gameManagerInstance.spawnedPoints = 0;
        General.proceedOneWeek(gameManagerInstance.company); // Tiến một tuần để khởi tạo một số thứ
        gameManagerInstance.gameId = gameManagerInstance.company.getRandom(); // Tạo ID game mới
        VisualsManager.reset(); // Reset hiển thị đồ họa
        GameManager.state = State.GameStarting; // Đặt trạng thái game là GameStarting
        GDT.fire(gameManagerInstance, GDT.eventKeys.saves.newGame); // Kích hoạt sự kiện tạo game mới
    };

    // Giảm số lượng điểm đang hiển thị (ví dụ khi điểm được thu thập)
    gameManagerInstance.decreaseSpawnedPoints = function () {
        if (gameManagerInstance.spawnedPoints > 0) gameManagerInstance.spawnedPoints--;
    };

    // Tăng số lượng điểm đang hiển thị
    gameManagerInstance.increaseSpawnedPoints = function () {
        gameManagerInstance.spawnedPoints++;
    };

    // Thông báo rằng game đang ở trạng thái rảnh (idle) và cần chuyển sang trạng thái tiếp theo
    gameManagerInstance.notifyIdleState = function () {
        switch (gameManagerInstance.state) {
            case State.CreateGame:
            case State.GameDefinition:
                gameManagerInstance.transitionToState(State.PickWorkItems);
                break;
            case State.PickWorkItems:
                gameManagerInstance.transitionToState(State.ExecuteWorkItems);
                break;
            case State.ExecuteWorkItems:
                gameManagerInstance.transitionToState(State.PickWorkItems);
                break;
            case State.ReleaseGame:
                gameManagerInstance.transitionToState(State.Idle);
                break;
            case State.Idle:
                // Không làm gì nếu đã ở trạng thái Idle
                break;
            default:
                throw "unexpected state: " + gameManagerInstance.state;
        }
    };

    gameManagerInstance.state = void 0; // Trạng thái hiện tại của game, sẽ được gán sau

    // Kiểm tra xem game có đang ở trạng thái rảnh không
    gameManagerInstance.isIdle = function () {
        return gameManagerInstance.state === State.Idle;
    };

    // Chuyển đổi sang một trạng thái game mới
    // newState: Trạng thái mới cần chuyển đến
    gameManagerInstance.transitionToState = function (newState) {
        // Nếu có thông báo đang chờ và không phải đang ở trạng thái ReleaseGame, hiển thị thông báo trước
        if (GameManager.state != State.ReleaseGame) {
            gameManagerInstance.company.calculateCurrentNofitications();
            if (gameManagerInstance.company.activeNotifications.length > 0) {
                gameManagerInstance.showPendingNotifications(function () {
                    gameManagerInstance.transitionToState(newState); // Gọi lại hàm này sau khi thông báo được xử lý
                });
                return;
            }
        }

        // Xử lý chuyển trạng thái
        if (newState === State.CreateGame) {
            gameManagerInstance.state = newState;
            // Hiển thị tutorial tương ứng
            if (gameManagerInstance.flags.sequel) Tutorial.createSequel();
            else Tutorial.createGame();
            if (gameManagerInstance.company.researchCompleted.indexOf(Research.TargetAudience) != -1) Tutorial.targetAudience();

            gameManagerInstance.company.createNewGame(); // Tạo đối tượng game mới
            // Nếu có hợp đồng, áp dụng các yêu cầu của hợp đồng vào game
            if (gameManagerInstance.currentContract) gameManagerInstance._setContractRequirements(gameManagerInstance.company.currentGame);
            gameManagerInstance.state = State.GameDefinition; // Chuyển ngay sang trạng thái định nghĩa game
            gameManagerInstance.transitionToState(State.GameDefinition); // Gọi lại để xử lý trạng thái GameDefinition
        }

        if (newState === State.GameDefinition) {
            // Thêm thông báo yêu cầu người chơi định nghĩa game
            gameManagerInstance.company.activeNotifications.push(new Notification("{GameDefinition}", "", "", 0));
            gameManagerInstance.showPendingNotifications();
        } else {
            if (newState === State.PickWorkItems) {
                // Nếu chuyển từ GameDefinition sang PickWorkItems, trừ tiền phát triển game
                if (gameManagerInstance.state === State.GameDefinition) {
                    var gameCost = gameManagerInstance.company.currentGame.costs;
                    gameManagerInstance.company.cash -= gameCost;
                    gameManagerInstance.company.cashLog.push({ amount: -gameCost, label: gameManagerInstance.company.currentGame.title });
                    // Cho các nhân viên rảnh bắt đầu làm việc
                    var idleStaff = gameManagerInstance.company.staff.filter(function (staff) { return staff.state === CharacterState.Idle; });
                    for (var i = 0; i < idleStaff.length; i++) {
                        idleStaff[i].startWorking();
                    }
                }
                gameManagerInstance.state = newState;
                var devFeatureLogCount = gameManagerInstance.getDevFeatureLogCount();
                // Dựa trên số lượng feature đã hoàn thành, quyết định hành động tiếp theo
                if (devFeatureLogCount == 0) { // Bắt đầu phát triển (stage 1)
                    VisualsManager.gameStatusBar.updateStatusMessage("");
                    VisualsManager.gameStatusBar.startDevelopment();
                    VisualsManager.putConsoleToPedestal(); // Nếu có dự án console, đặt nó lên bệ
                    gameManagerInstance.executeFeatures([], Missions.PreparationMission); // Bắt đầu với mission chuẩn bị
                } else if (devFeatureLogCount >= 9 && devFeatureLogCount < 11) { // Giai đoạn hoàn thiện (bug fixing)
                    gameManagerInstance.executeFeatures([], Missions.BugFixingMission);
                    gameManagerInstance.company.currentGame.flags.releaseReady = true;
                    Tutorial.finishingPhase(0.2);
                    VisualsManager.updateReleaseReadyButton();
                } else if (devFeatureLogCount >= 11) { // Hoàn thành phát triển
                    gameManagerInstance.company.currentGame.flags.devCompleted = true;
                    gameManagerInstance.transitionToState(State.ReleaseGame);
                } else { // Các stage phát triển khác
                    gameManagerInstance.showFeatureList();
                }
            }
            if (newState === State.ExecuteWorkItems) {
                gameManagerInstance.state = newState;
                gameManagerInstance.executeWorkItems(); // Bắt đầu thực hiện các công việc đã lên kế hoạch
            }
            if (newState === State.ReleaseGame) {
                // Cho các nhân viên đang làm việc hoặc rảnh ngừng làm việc
                var staffToStop = gameManagerInstance.company.staff.filter(function (staff) { return staff.state === CharacterState.Idle || staff.state === CharacterState.Working; });
                for (var i = 0; i < staffToStop.length; i++) {
                    staffToStop[i].endWorking();
                }
                gameManagerInstance.state = State.ReleaseGame;
            }
            if (newState === State.Idle) {
                gameManagerInstance.state = State.Idle;
            }
        }
    };

    // Hủy bỏ việc định nghĩa game
    gameManagerInstance.gameDefinitionCancelled = function () {
        GDT.fire(gameManagerInstance, GDT.eventKeys.gameplay.gameDefinitionCanceled, { company: gameManagerInstance.company });
        gameManagerInstance.company.currentGame = null; // Xóa game đang tạo
        if (gameManagerInstance.currentContract) gameManagerInstance.contractCancelled(); // Hủy hợp đồng nếu có
        gameManagerInstance.transitionToState(State.Idle); // Quay về trạng thái rảnh
    };

    // Khi một nhân viên hoàn thành công việc
    // staffMember: Nhân viên đã hoàn thành
    gameManagerInstance.workEnded = function (staffMember) {
        // Nếu không còn nhân viên nào đang làm việc (không tính nghiên cứu)
        if (gameManagerInstance.company.staff.filter(function (staff) { return staff.working === true && !staff.currentResearch; }).length === 0) {
            if (gameManagerInstance.state === State.ReleaseGame) {
                // Nếu game đã sẵn sàng để phát hành và chưa có thông báo phát hành
                if (gameManagerInstance.company.currentGame && gameManagerInstance.company.notifications.count(function (n) { return "{ReleaseGame}" === n.header; }) === 0) {
                    gameManagerInstance.releaseGame(); // Phát hành game
                    gameManagerInstance.company.calculateCurrentNofitications();
                    if (gameManagerInstance.company.activeNotifications.length > 0) {
                        gameManagerInstance.showPendingNotifications(function () {
                            gameManagerInstance.transitionToState(State.ReleaseGame);
                        });
                        return;
                    }
                }
            } else if (gameManagerInstance.currentEngineDev) { // Nếu đang phát triển engine
                gameManagerInstance.finishEngine();
            }
        }
        // Nếu nhân viên hoàn thành một nghiên cứu
        if (staffMember.currentResearch) {
            staffMember.currentResearch = null;
            gameManagerInstance.finishResearch(staffMember);
        }
    };

    // Thực hiện các công việc (features) đã được lên kế hoạch
    gameManagerInstance.executeWorkItems = function () {
        if (gameManagerInstance.plannedFeatures && gameManagerInstance.plannedFeatures.length > 0) {
            // Reset progress và tính toán thời gian cho từng feature
            gameManagerInstance.plannedFeatures.forEach(function (feature) {
                feature.progress = 0;
                feature.duration = General.getDuration(gameManagerInstance.company.currentGame, feature);
            });
            var currentGame = gameManagerInstance.company.currentGame;
            if (!currentGame.featureLog) currentGame.featureLog = []; // Khởi tạo log feature nếu chưa có
            // Nếu feature hiện tại đã hoàn thành hoặc chưa có, lấy feature tiếp theo từ danh sách đã lên kế hoạch
            if (gameManagerInstance.currentFeature && gameManagerInstance.currentFeature.progress < 1) {
                // Feature hiện tại chưa xong, không làm gì cả
            } else {
                gameManagerInstance.currentFeature = gameManagerInstance.plannedFeatures.shift();
                gameManagerInstance.currentFeature.startTime = gameManagerInstance.gameTime;
            }
        } else if (!gameManagerInstance.currentFeature) { // Nếu không có feature nào trong kế hoạch và không có feature hiện tại
            gameManagerInstance.notifyIdleState(State.PickWorkItems); // Chuyển sang trạng thái chọn công việc
        }
    };

    gameManagerInstance.currentFeature = null; // Feature đang được phát triển
    gameManagerInstance.plannedFeatures = null; // Danh sách các feature đã được lên kế hoạch

    // Lấy giai đoạn phát triển hiện tại của game (1, 2, hoặc 3)
    gameManagerInstance.getCurrentDevStage = function () {
        var devFeatureLogCount = gameManagerInstance.getDevFeatureLogCount();
        if (devFeatureLogCount < 3) return 1;
        if (devFeatureLogCount < 6) return 2;
        if (devFeatureLogCount < 9) return 3;
        // Mặc định hoặc các trường hợp khác có thể cần xử lý thêm
    };

    // Thực thi một danh sách các feature (mission)
    // selectedMissions: Mảng các mission đã chọn
    // nextPhaseMission: Mission cho giai đoạn tiếp theo (ví dụ: BugFixing)
    gameManagerInstance.executeFeatures = function (selectedMissions, nextPhaseMission) {
        // Cho các nhân viên đang làm việc ở giai đoạn trước ngừng lại
        var workingStaff = gameManagerInstance.company.staff.filter(function (staff) { return staff.state === CharacterState.Working; });
        for (var i = 0; i < workingStaff.length; i++) {
            workingStaff[i].state = CharacterState.Idle;
            workingStaff[i].currentFeature = null;
        }

        var missionsForCurrentStage = [];
        gameManagerInstance.plannedFeatures = []; // Reset danh sách feature đã lên kế hoạch

        // Xác định các mission cho giai đoạn hiện tại
        if (gameManagerInstance.company.currentGame.featureLog) {
            var currentDevStage = gameManagerInstance.getCurrentDevStage();
            if (currentDevStage == 1) missionsForCurrentStage = Missions.Stage1Missions;
            else if (currentDevStage == 2) missionsForCurrentStage = Missions.Stage2Missions;
            else if (currentDevStage == 3) missionsForCurrentStage = Missions.Stage3Missions;
        }

        // Thêm các mission đã chọn vào danh sách plannedFeatures
        if (selectedMissions.length != 0) {
            for (var i = 0; i < missionsForCurrentStage.length; i++) {
                missionsForCurrentStage[i].percentage = selectedMissions[i].percentage; // Gán tỷ lệ focus
                gameManagerInstance.plannedFeatures.push({ type: "focus", id: missionsForCurrentStage[i].id, missionType: "mission" });
            }
        }
        // Thêm mission cho giai đoạn tiếp theo (nếu có)
        if (nextPhaseMission) {
            gameManagerInstance.plannedFeatures.push({ type: "focus", id: nextPhaseMission.id, missionType: nextPhaseMission.missionType });
        }
        gameManagerInstance.transitionToState(State.ExecuteWorkItems); // Chuyển sang trạng thái thực thi công việc
    };

    // Bắt đầu một cuộc thi coding (tương tự như training)
    gameManagerInstance.codingContest = function (contestItem, type, staffMember) { // staffMember không được dùng, nhưng giữ lại để tương thích
        var contestData = {
            id: contestItem.id,
            type: type,
            progress: 0,
            duration: contestItem.duration,
            isTraining: contestItem.isTraining // Đánh dấu đây là một dạng training
        };
        gameManagerInstance.currentResearches.push(contestData);
        gameManagerInstance.startResearch(contestData); // Sử dụng hàm startResearch cho cả coding contest
    };

    // Bắt đầu một nghiên cứu mới
    // researchItemData: Thông tin về mục nghiên cứu
    // type: Loại nghiên cứu (ví dụ: "research", "training")
    gameManagerInstance.research = function (researchItemData, type) {
        payForResearch(researchItemData); // Trừ chi phí nghiên cứu
        var researchInstance = {
            id: researchItemData.id,
            type: type,
            progress: 0,
            duration: Research.getDuration(researchItemData),
            isTraining: researchItemData.isTraining,
            progressColor: researchItemData.progressColor // Màu cho thanh progress (nếu có)
        };
        gameManagerInstance.currentResearches.push(researchInstance);
        gameManagerInstance.startResearch(researchInstance);
        GDT.fire(gameManagerInstance, GDT.eventKeys.gameplay.researchStarted, { company: gameManagerInstance.company, researchItem: researchInstance });
    };

    var preferredLanguage; // Biến lưu trữ ngôn ngữ ưa thích của người chơi
    // Lấy ngôn ngữ ưa thích
    gameManagerInstance.getPreferredLanguage = function () {
        if (preferredLanguage == void 0) { // Nếu chưa có, đọc từ DataStore
            preferredLanguage = DataStore.getValue("language");
            if (preferredLanguage == void 0) gameManagerInstance.setPreferredLanguage("vi"); // Mặc định là tiếng Anh
        }
        return preferredLanguage;
    };
    // Đặt ngôn ngữ ưa thích
    gameManagerInstance.setPreferredLanguage = function (languageCode) {
        DataStore.setValue("language", languageCode); // Lưu vào DataStore
        try {
            // Cập nhật hiển thị credit cho người dịch (nếu có)
            if (UI) {
                UI.showLocalizationCredits(languageCode, $("#localizationCredits"), $(".localizationDiscussion"));
                UI.showLocalizationCredits(languageCode, $("#localizationCreditsAudioHtml"), $(".localizationDiscussionAudioHtml"));
            }
        } catch (error) { /* Xử lý lỗi (nếu có) */ }
        preferredLanguage = languageCode;
    };

    var hintsEnabled; // Biến lưu trữ trạng thái bật/tắt gợi ý
    // Kiểm tra xem gợi ý có được bật không
    gameManagerInstance.areHintsEnabled = function () {
        if (hintsEnabled == void 0) {
            hintsEnabled = DataStore.getValue("hintsEnabled");
            if (hintsEnabled == void 0) { // Nếu chưa có, mặc định là bật
                gameManagerInstance.setHintsEnabled(true);
                hintsEnabled = true;
            } else {
                hintsEnabled = (hintsEnabled == true || hintsEnabled == "true"); // Chuyển đổi sang boolean
            }
        }
        return hintsEnabled;
    };
    // Đặt trạng thái bật/tắt gợi ý
    gameManagerInstance.setHintsEnabled = function (enable) {
        DataStore.setValue("hintsEnabled", enable);
        hintsEnabled = enable;
    };

    // Bắt đầu nghiên cứu một topic mới
    // topicToResearch: Topic cần nghiên cứu
    gameManagerInstance.researchTopic = function (topicToResearch) {
        var researchTopicItem = Research.ResearchTopicItem;
        payForResearch(researchTopicItem); // Trừ chi phí
        var researchInstance = {
            id: researchTopicItem.id,
            type: "research",
            topicId: topicToResearch.id,
            progress: 0,
            duration: Research.ResearchTopicItem.duration
        };
        gameManagerInstance.currentResearches.push(researchInstance);
        gameManagerInstance.startResearch(researchInstance);
        GDT.fire(gameManagerInstance, GDT.eventKeys.gameplay.researchStarted, { company: gameManagerInstance.company, researchItem: researchInstance });
    };

    // Hàm nội bộ để trừ chi phí cho một nghiên cứu
    // researchItem: Mục nghiên cứu
    var payForResearch = function (researchItem) {
        gameManagerInstance.company.researchPoints -= Research.getPointsCost(researchItem); // Trừ điểm nghiên cứu
        VisualsManager.updatePoints(); // Cập nhật hiển thị điểm
        var researchCost = Research.getResearchCost(researchItem); // Lấy chi phí tiền
        if (researchCost) gameManagerInstance.company.adjustCash(-researchCost, researchItem.name); // Trừ tiền
    };

    // Bắt đầu một nghiên cứu (gán cho nhân viên)
    // researchData: Dữ liệu nghiên cứu
    gameManagerInstance.startResearch = function (researchData) {
        // Tìm nhân viên được chọn để thực hiện nghiên cứu
        var selectedStaff = gameManagerInstance.company.staff.first(function (staff) { return staff.id === GameManager.uiSettings.selectedChar; });
        if (!selectedStaff) throw "no worker selected for research"; // Lỗi nếu không có nhân viên nào được chọn
        selectedStaff.startWorking(); // Cho nhân viên bắt đầu làm việc
        selectedStaff.state = CharacterState.Researching; // Đặt trạng thái nhân viên là đang nghiên cứu
        researchData.staffId = selectedStaff.id; // Gán ID nhân viên cho nghiên cứu
        selectedStaff.currentResearch = researchData; // Gán nghiên cứu cho nhân viên
        selectedStaff.currentFeature = null; // Reset feature hiện tại của nhân viên
        selectedStaff.resetLeftOverPoints(); // Reset điểm còn dư của nhân viên
        VisualsManager.getCharacterOverlay(selectedStaff).startResearching(); // Hiển thị animation nghiên cứu
    };

    // Giảm số lượng bug trong game hiện tại
    gameManagerInstance.decreaseBugs = function (amount) {
        if (gameManagerInstance.company.currentGame) {
            gameManagerInstance.company.currentGame.bugs -= amount;
            VisualsManager.gameStatusBar.updatePoints(); // Cập nhật UI
        }
    };

    // Tăng tiến độ nghiên cứu
    // staffMember: Nhân viên thực hiện nghiên cứu
    // progressAmount: Lượng tiến độ tăng thêm
    gameManagerInstance.increaseResearchProgress = function (staffMember, progressAmount) {
        // Tìm nghiên cứu mà nhân viên đang thực hiện
        var currentResearch = GameManager.currentResearches.first(function (research) { return research.staffId === staffMember.id; });
        currentResearch.progress = (currentResearch.progress + progressAmount).clamp(0, 1); // Tăng tiến độ và giới hạn trong khoảng 0-1
        // Nếu nghiên cứu hoàn thành
        if (currentResearch.progress === 1) {
            // Nếu đang phát triển feature hoặc engine, hoặc nhân viên tự kết thúc công việc
            if (gameManagerInstance.currentFeature || gameManagerInstance.currentEngineDev) gameManagerInstance.finishResearch(staffMember, currentResearch); // Gọi hàm hoàn thành nghiên cứu
            else staffMember.endWorking(); // Cho nhân viên ngừng làm việc
        }
    };

    // Xử lý khi một nghiên cứu hoàn thành
    // staffMember: Nhân viên hoàn thành
    gameManagerInstance.finishResearch = function (staffMember) { // researchInstance không được dùng, nhưng giữ lại
        VisualsManager.levelOverlay.startWaterCooler(); // Kích hoạt animation máy lọc nước (có thể là hiệu ứng khi hoàn thành)
        // Tìm nghiên cứu mà nhân viên đã hoàn thành
        var completedResearch = gameManagerInstance.currentResearches.first(function (research) { return research.staffId === staffMember.id; });
        VisualsManager.getCharacterOverlay(staffMember).finishResearching(); // Dừng animation nghiên cứu
        staffMember.state = CharacterState.Idle; // Đặt trạng thái nhân viên về rảnh
        gameManagerInstance.currentResearches.remove(completedResearch); // Xóa nghiên cứu khỏi danh sách đang thực hiện
        staffMember.currentResearch = null; // Xóa nghiên cứu khỏi nhân viên

        // Nếu là training
        if (completedResearch.type === "training" || completedResearch.type === "specialTraining") {
            processTrainingCompletion(staffMember, completedResearch); // Xử lý hoàn thành training
        } else { // Nếu là nghiên cứu thông thường
            if (completedResearch.id === "New Topic") { // Nếu là nghiên cứu topic mới
                var newTopic = Topics.topics.first(function (topic) { return topic.id === completedResearch.topicId; });
                if (gameManagerInstance.company.currentLevel > 1) { // Nếu công ty ở level cao
                    VisualsManager.getCharacterOverlay(staffMember).saySomething("Completed: ".localize("research is completed, research name is added") + newTopic.name);
                    if (GameManager.company.flags.currentZone == 1) Sound.playSoundOnce("research", 0.3);
                } else { // Nếu công ty ở level thấp, hiển thị thông báo chi tiết hơn
                    var topicIconUrl = newTopic.iconUrl ? newTopic.iconUrl : "./images/topic icons/icon_topic_{0}.png".format(newTopic.id.toLowerCase());
                    var notification = new Notification("Research complete".localize("heading"), "You have successfully researched a new topic: '{0}'.".localize().format(newTopic.name));
                    notification.sound = "research";
                    notification.volume = 0.3;
                    notification.previewImage = topicIconUrl;
                    notification.type = NotificationType.Others;
                    gameManagerInstance.company.notifications.push(notification);
                }
                gameManagerInstance.company.topics.push(newTopic); // Thêm topic mới vào danh sách của công ty
            } else { // Nếu là nghiên cứu một item cụ thể
                var researchItemInstance = gameManagerInstance.company.availableResearch.first(function (item) { return item.id === completedResearch.id; });
                gameManagerInstance.company.availableResearch.remove(researchItemInstance); // Xóa khỏi danh sách có thể nghiên cứu
                gameManagerInstance.company.researchCompleted.push(researchItemInstance); // Thêm vào danh sách đã hoàn thành
                if (gameManagerInstance.company.researchCompleted.length == 1) ghg4.ghg5("first research", { id: researchItemInstance.id }); // Ghi log nếu là nghiên cứu đầu tiên

                if (gameManagerInstance.company.currentLevel > 1) {
                    VisualsManager.getCharacterOverlay(staffMember).saySomething("Completed: ".localize("research is completed, research name is added") + researchItemInstance.name);
                    if (GameManager.company.flags.currentZone == 1) Sound.playSoundOnce("research", 0.3);
                } else {
                    var notification = new Notification("Research complete".localize("heading"), "You have successfully researched '{0}'.".localize().format(researchItemInstance.name));
                    notification.sound = "research";
                    notification.volume = 0.3;
                    notification.type = NotificationType.Others;
                    notification.previewImage = "./images/notificationIcons/icon_notification_research.png";
                    gameManagerInstance.company.notifications.push(notification);
                }
                // Hiển thị tutorial tương ứng
                if (researchItemInstance === Research.CustomEngine) Tutorial.researchedCustomEngine();
                else if (Research.getEnginePoints(researchItemInstance) != 0) Tutorial.researchedEnginePart();
                if (researchItemInstance.complete) researchItemInstance.complete(); // Gọi hàm complete của research item (nếu có)
            }
            GDT.fire(gameManagerInstance, GDT.eventKeys.gameplay.researchCompleted, { company: gameManagerInstance.company, researchItem: completedResearch });
            Research.checkForNewResearch(); // Kiểm tra xem có nghiên cứu mới nào được mở khóa không
            gameManagerInstance.autoSave(); // Tự động lưu game
        }
    };

    // Xử lý khi một training hoàn thành
    // staffMember: Nhân viên hoàn thành
    // trainingData: Dữ liệu training
    var processTrainingCompletion = function (staffMember, trainingData) {
        var trainingInstance = Training.getAllTrainings().first(function (training) { return training.id === trainingData.id; });
        staffMember.finishTraining(trainingInstance); // Đánh dấu hoàn thành training cho nhân viên
        if (trainingInstance && trainingInstance.complete) trainingInstance.complete(staffMember); // Gọi hàm complete của training (nếu có)
        if (trainingInstance.isSkillTraining) Knowledge.setTrainingKnowledge(trainingInstance); // Lưu kiến thức về training này
        GDT.fire(gameManagerInstance, GDT.eventKeys.gameplay.trainingFinished, { staff: staffMember, training: trainingInstance });
        Research.checkForNewResearch();
        gameManagerInstance.autoSave();
        gameManagerInstance.showPendingNotifications(); // Hiển thị các thông báo đang chờ
    };

    gameManagerInstance.currentEngineDev = null; // Thông tin về engine đang được phát triển

    // Bắt đầu phát triển một engine mới
    // engineName: Tên engine
    // selectedParts: Mảng các bộ phận được chọn cho engine
    gameManagerInstance.createEngine = function (engineName, selectedParts) {
        if (!gameManagerInstance.currentEngineDev) { // Chỉ tạo nếu chưa có engine nào đang phát triển
            // Tính toán chi phí và điểm công nghệ
            var totalCost = selectedParts.sum(function (part) { return Research.getEngineCost(part); });
            var totalTechPoints = selectedParts.sum(function (part) { return Research.getEnginePoints(part); });
            Tutorial.creatingEngine(); // Hiển thị tutorial
            gameManagerInstance.company.adjustCash(-totalCost, engineName); // Trừ tiền
            gameManagerInstance.currentEngineDev = {
                name: engineName,
                progress: 0,
                cost: totalCost,
                technologyPoints: totalTechPoints,
                remainingPoints: totalTechPoints, // Điểm công nghệ cần để hoàn thành
                remainingPointsDisplay: totalTechPoints, // Điểm hiển thị (có thể khác remainingPoints do hiệu ứng)
                parts: selectedParts,
                currentPart: selectedParts[0] // Bộ phận đang được tập trung phát triển
            };
            VisualsManager.startCreateEngine(); // Bắt đầu hiển thị animation phát triển engine
            // Cho các nhân viên rảnh bắt đầu làm việc trên engine
            var idleStaff = gameManagerInstance.company.staff.filter(function (staff) { return staff.state === CharacterState.Idle; });
            for (var i = 0; i < idleStaff.length; i++) {
                idleStaff[i].startWorking();
            }
            GDT.fire(gameManagerInstance, GDT.eventKeys.gameplay.engineStarted, { company: gameManagerInstance.company });
        }
    };

    // Tăng điểm công nghệ đã hoàn thành cho engine (khi nhân viên tạo ra điểm)
    gameManagerInstance.increaseEnginePoints = function () {
        if (gameManagerInstance.currentEngineDev) gameManagerInstance.currentEngineDev.remainingPoints--;
    };

    // Cập nhật hiển thị điểm công nghệ và tiến độ của engine
    // staffMember: Nhân viên tạo ra điểm (để tính hiệu quả)
    // pointsAmount: Số điểm được tạo ra
    gameManagerInstance.increaseDisplayEnginePoints = function (staffMember, pointsAmount) {
        if (gameManagerInstance.currentEngineDev) {
            gameManagerInstance.currentEngineDev.remainingPointsDisplay -= pointsAmount;
            if (gameManagerInstance.currentEngineDev.remainingPointsDisplay < 0) gameManagerInstance.currentEngineDev.remainingPointsDisplay = 0;

            var totalTechPoints = gameManagerInstance.currentEngineDev.technologyPoints;
            var pointsDone = Math.abs(gameManagerInstance.currentEngineDev.remainingPointsDisplay - totalTechPoints);
            gameManagerInstance.currentEngineDev.progress = pointsDone / totalTechPoints; // Tính toán tiến độ

            // Xác định bộ phận hiện tại đang được tập trung phát triển
            var accumulatedPointsForPart = 0;
            var currentFocusedPart = null;
            for (var i = 0; i < gameManagerInstance.currentEngineDev.parts.length; i++) {
                currentFocusedPart = gameManagerInstance.currentEngineDev.parts[i];
                accumulatedPointsForPart += Research.getEnginePoints(currentFocusedPart);
                if (pointsDone <= accumulatedPointsForPart) break;
            }

            // Nếu bộ phận có techLevel và nhân viên được cung cấp, tính toán điểm hiệu quả
            if (currentFocusedPart.techLevel && staffMember) {
                if (!currentFocusedPart.efficiencyPoints) currentFocusedPart.efficiencyPoints = [];
                var efficiencyScore = staffMember.getLevelF() / currentFocusedPart.techLevel;
                efficiencyScore *= (staffMember.efficiency + 0.2).clamp(0.5, 1);
                if (staffMember.onFire) efficiencyScore += 0.1 + 0.2 * gameManagerInstance.company.getRandom(); // Thưởng thêm nếu nhân viên "on fire"
                currentFocusedPart.efficiencyPoints.push(efficiencyScore);
            }
            gameManagerInstance.currentEngineDev.currentPart = currentFocusedPart; // Cập nhật bộ phận hiện tại
            VisualsManager.updateEngineStatus(); // Cập nhật UI

            // Nếu đã hoàn thành tất cả điểm
            if (gameManagerInstance.currentEngineDev.remainingPointsDisplay <= 0) {
                if (gameManagerInstance.currentFeature) gameManagerInstance.finishEngine(); // Nếu đang phát triển game, hoàn thành engine ngay
                else { // Ngược lại, cho các nhân viên ngừng làm engine
                    var workingStaff = GameManager.company.staff.filter(function (staff) { return staff.state === CharacterState.CreateEngine; });
                    for (var i = 0; i < workingStaff.length; i++) {
                        workingStaff[i].endWorking();
                    }
                }
            }
        }
    };

    // Hoàn thành việc phát triển engine
    gameManagerInstance.finishEngine = function () {
        var engineData = gameManagerInstance.currentEngineDev;
        if (engineData.progress < 1) return; // Chưa đủ tiến độ, không hoàn thành

        // Tính toán hiệu quả trung bình cho từng bộ phận
        for (var i = 0; i < engineData.parts.length; i++) {
            var part = engineData.parts[i];
            if (part.efficiencyPoints) {
                part.efficiency = part.efficiencyPoints.average(); // Tính trung bình
                part.efficiencyPoints = void 0; // Xóa mảng điểm tạm
            }
        }
        // Tạo đối tượng engine mới
        var newEngine = {
            id: gameManagerInstance.company.engines.length + 1,
            name: engineData.name,
            parts: engineData.parts,
            techLevel: engineData.parts.filter(function (part) { return part.techLevel != void 0; }).average(function (part) { return part.techLevel; }),
            costs: gameManagerInstance.currentEngineDev.cost,
            releaseWeek: gameManagerInstance.company.currentWeek
        };
        gameManagerInstance.currentEngineDev = null; // Reset engine đang phát triển
        // Cho các nhân viên đang làm engine ngừng lại
        var workingStaff = gameManagerInstance.company.staff.filter(function (staff) { return staff.state === CharacterState.CreateEngine; });
        for (var i = 0; i < workingStaff.length; i++) {
            workingStaff[i].state = CharacterState.Idle;
        }
        gameManagerInstance.company.engines.push(newEngine); // Thêm engine mới vào danh sách của công ty
        // Thêm các bộ phận engine mới vào danh sách của công ty (nếu chưa có)
        for (var i = 0; i < newEngine.parts.length; i++) {
            var partExists = false;
            for (var j = 0; j < gameManagerInstance.company.engineParts.length; j++) {
                if (newEngine.parts[i].id === gameManagerInstance.company.engineParts[j].id) {
                    partExists = true;
                    break;
                }
            }
            if (!partExists) {
                var newPart = newEngine.parts[i];
                if (!newPart.experience) newPart.experience = 0;
                gameManagerInstance.company.engineParts.push(newPart);
            }
        }
        // Hiển thị thông báo và tutorial
        gameManagerInstance.company.notifications.push(new Notification("Engine complete!".localize("heading"), "Your new game engine '{0}' is now complete!".localize().format(newEngine.name), { type: NotificationType.AutoPopup }));
        Tutorial.firstEngine();
        VisualsManager.finishEngine(); // Cập nhật UI
        GDT.fire(gameManagerInstance, GDT.eventKeys.gameplay.engineFinished, { company: gameManagerInstance.company, engine: newEngine });
        gameManagerInstance.autoSave();
    };

    // Lấy danh sách các feature có thể sử dụng cho game (dựa trên engine và nghiên cứu)
    // engine: Engine đang được sử dụng (nếu có)
    gameManagerInstance.getAvailableGameFeatures = function (engine) {
        var availableFeatures = [];
        availableFeatures.addRange(Research.StartEngineParts); // Thêm các bộ phận engine cơ bản
        if (engine) { // Nếu có engine, thêm các bộ phận của engine đó (trừ những cái đã có)
            availableFeatures.addRange(engine.parts.map(function (part) { return General.getFeature(part.id); }).except(availableFeatures));
        }
        // Thêm các research item đã hoàn thành và không phải là bộ phận engine
        var completedResearchFeatures = Research.getAllItems().filter(function (item) { return item.enginePoints === 0 && GameManager.company.researchCompleted.indexOf(item) != -1; });
        availableFeatures.addRange(completedResearchFeatures);
        availableFeatures.addRange(GameManager.company.specialItems); // Thêm các item đặc biệt
        return availableFeatures;
    };

    // Hoàn thành mission hiện tại
    gameManagerInstance.finishCurrentMission = function () {
        var currentGame = gameManagerInstance.company.currentGame;
        var currentFeatureInstance = gameManagerInstance.currentFeature;
        // Điều kiện để hoàn thành: progress = 1 HOẶC game đã đánh dấu hoàn thành, VÀ feature chưa đánh dấu hoàn thành,
        // VÀ là BugFixing HOẶC không còn spawnedPoints HOẶC còn feature trong plannedFeatures
        if ((currentFeatureInstance.progress === 1 || currentGame.flags.finished) &&
            !currentFeatureInstance.finished &&
            (currentFeatureInstance.missionType === "BugFixing" || gameManagerInstance.spawnedPoints === 0 || gameManagerInstance.plannedFeatures.length > 0)) {
            // Reset feature hiện tại của các nhân viên đang làm việc trên feature này
            for (var i = 0; i < gameManagerInstance.company.staff.length; i++) {
                if (gameManagerInstance.company.staff[i].currentFeature && currentFeatureInstance.id === gameManagerInstance.company.staff[i].currentFeature.id) {
                    gameManagerInstance.company.staff[i].currentFeature = null;
                    gameManagerInstance.company.staff[i].state = CharacterState.Idle;
                }
            }
            currentFeatureInstance.finished = true; // Đánh dấu feature đã hoàn thành
            currentGame.featureLog.push(currentFeatureInstance); // Thêm vào log feature của game
            // Nếu không phải là một "feature" (mà là một "mission"), thêm vào log mission
            if (currentFeatureInstance.type !== "feature") {
                var missionInstance = General.getMission(currentFeatureInstance.id);
                currentGame.missionLog.push(missionInstance);
            }
            // Chuyển sang feature tiếp theo hoặc thông báo rảnh
            if (gameManagerInstance.plannedFeatures.length > 0) {
                gameManagerInstance.currentFeature = gameManagerInstance.plannedFeatures.shift();
            } else {
                gameManagerInstance.currentFeature = null;
                gameManagerInstance.notifyIdleState();
            }
        }
        GDT.fire(gameManagerInstance, GDT.eventKeys.gameplay.featureFinished, { company: gameManagerInstance.company, feature: currentFeatureInstance });
    };

    // Hiển thị các thông báo đang chờ
    // onNotificationsShownCallback: Callback được gọi sau khi tất cả thông báo đã hiển thị
    gameManagerInstance.showPendingNotifications = function (onNotificationsShownCallback) {
        var currentCompany = gameManagerInstance.company;
        if (currentCompany) {
            var currentGameId = gameManagerInstance.gameId; // Lưu ID game hiện tại để kiểm tra nếu có reload
            if (onNotificationsShownCallback) { // Bọc callback để đảm bảo nó chỉ chạy cho game hiện tại
                var originalCallback = onNotificationsShownCallback;
                onNotificationsShownCallback = function () {
                    if (currentGameId == gameManagerInstance.gameId && originalCallback) originalCallback();
                };
            }
            currentCompany.calculateCurrentNofitications(); // Tính toán lại các thông báo cần hiển thị
            if (currentCompany.activeNotifications.length === 0) { // Nếu không có thông báo nào
                if (onNotificationsShownCallback) onNotificationsShownCallback();
            } else {
                UI.showNotifications(onNotificationsShownCallback); // Hiển thị thông báo
            }
        }
    };

    // Xóa một thông báo khỏi danh sách đang hoạt động
    gameManagerInstance.removeFromActiveNotifications = function (notification) {
        if (gameManagerInstance.company && gameManagerInstance.company.activeNotifications.length > 0) {
            gameManagerInstance.company.activeNotifications.remove(notification);
        }
    };

    // Hiển thị danh sách gian hàng (cho hội chợ)
    gameManagerInstance.showBoothList = function (notification, callback) {
        UI.showConferenceBoothList(notification, callback);
    };

    // Chuẩn bị phát hành game (thêm thông báo chờ)
    gameManagerInstance.releaseGame = function () {
        if (gameManagerInstance.company.notifications.count(function (n) { return "{ReleaseGame}" === n.header; }) === 0) {
            var delayWeeks = (0.5 + 0.3 * GameManager.company.getRandom()) / GameManager.SECONDS_PER_WEEK;
            Tutorial.gameDevCompleted(delayWeeks);
            gameManagerInstance.company.notifications.push(new Notification("{ReleaseGame}", "", "", delayWeeks));
        }
    };

    // Hiển thị danh sách feature cho giai đoạn phát triển tiếp theo
    gameManagerInstance.showFeatureList = function () {
        gameManagerInstance.company.currentGame.state = GameState.development;
        if (gameManagerInstance.company.notifications.count(function (n) { return "{FeatureList}" === n.header; }) === 0) {
            var delayWeeks = (0.5 + 0.3 * GameManager.company.getRandom()) / GameManager.SECONDS_PER_WEEK;
            Tutorial.devPhases(delayWeeks); // Hiển thị tutorial về các giai đoạn phát triển
            if (gameManagerInstance.company.currentGame.isStaffResponsibilityEnabled()) Tutorial.staffResponsibility(delayWeeks); // Tutorial về phân công nhân viên

            var missionsForStage;
            // Xác định mission cho giai đoạn hiện tại
            if (gameManagerInstance.getDevFeatureLogCount() < 3) missionsForStage = Missions.Stage1Missions;
            else if (gameManagerInstance.getDevFeatureLogCount() < 6) missionsForStage = Missions.Stage2Missions;
            else {
                missionsForStage = Missions.Stage3Missions;
                Tutorial.additionalFeatures(delayWeeks); // Tutorial về các feature bổ sung
            }
            // Hiển thị tutorial về gợi ý mission nếu cần
            if (!gameManagerInstance.company.flags.missionHintsShown && missionsForStage.some(function (mission) { return Knowledge.getMissionWeightingHint(Missions.getMissionWithId(mission.id), gameManagerInstance.company.currentGame); })) {
                gameManagerInstance.company.flags.missionHintsShown = true;
                Tutorial.missionHints(delayWeeks);
            }
            // Tạo thông báo yêu cầu chọn feature
            var notification = new Notification("{FeatureList}", "", "", delayWeeks);
            notification.features = missionsForStage;
            gameManagerInstance.company.notifications.push(notification);
            gameManagerInstance.showPendingNotifications();
        }
    };

    // Lấy số lượng feature (mission chính) đã hoàn thành trong game hiện tại
    gameManagerInstance.getDevFeatureLogCount = function () {
        if (!gameManagerInstance.company.currentGame.featureLog) return 0;
        return gameManagerInstance.company.currentGame.featureLog.count(function (logEntry) {
            return logEntry.missionType === "mission" || logEntry.missionType === "preparation" || logEntry.missionType === "BugFixing";
        });
    };

    // Kiểm tra xem game có đang tạm dừng không
    // isSystemPause: true nếu kiểm tra system pause, false (hoặc undefined) nếu kiểm tra player pause
    gameManagerInstance.isPaused = function (isSystemPause) {
        return isSystemPause ? gameManagerInstance.systemPause : gameManagerInstance.playerPause;
    };

    // Kiểm tra xem game có thực sự đang dừng (timeModifier = 0)
    gameManagerInstance.isGamePaused = function () {
        return gameManagerInstance._timeModifier === 0;
    };

    // Chuyển đổi trạng thái tạm dừng/tiếp tục
    // isSystemToggle: true nếu là system toggle, false (hoặc undefined) nếu là player toggle
    gameManagerInstance.togglePause = function (isSystemToggle) {
        // Nếu đang mở modal và là system toggle, không làm gì cả
        if (UI.isModalContentOpen() && isSystemToggle) return;
        if (gameManagerInstance.isPaused(isSystemToggle)) gameManagerInstance.resume(isSystemToggle);
        else gameManagerInstance.pause(isSystemToggle);
    };

    // Đặt tốc độ game
    // speedMode: "slow", "normal", "fast", "super-fast", "extra-fast"
    gameManagerInstance.setGameSpeed = function (speedMode) {
        var newTimeModifier;
        if (speedMode === "slow") {
            newTimeModifier = 0.5;
            GameManager.gameSpeed = "slow";
        }
        else if (speedMode === "normal") {
            newTimeModifier = 1;
            GameManager.gameSpeed = "normal";
        }
        else if (speedMode === "fast") {
            newTimeModifier = 2.5;
            GameManager.gameSpeed = "fast";
        }
        else if (speedMode === "super-fast") {
            newTimeModifier = 10;
            GameManager.gameSpeed = "super-fast";
        }
        else if (speedMode === "extra-fast") {
            if (!GameFlags.ghg6) return; // Chỉ cho debug
            newTimeModifier = 100;
            GameManager.gameSpeed = "extra-fast";
        }
        // Cập nhật biểu tượng nút tốc độ nếu có
        gameManagerInstance.updateSpeedButtonContent(document.getElementById("speedControlButton"));

        // Nếu game đang tạm dừng bởi hệ thống và có modal đang mở, lưu tốc độ mới để áp dụng sau
        if (gameManagerInstance.isPaused(true)) {
            if (UI.isModalContentOpen()) {
                gameManagerInstance._oldTimeModifier = newTimeModifier;
                return;
            }
            gameManagerInstance.resume(true); // Tiếp tục game (system) trước khi đổi tốc độ
        }
        gameManagerInstance._timeModifier = newTimeModifier;
    };

    // Mới: Hàm chuyển đổi tốc độ game với một nút duy nhất
    gameManagerInstance.cycleThroughSpeeds = function () {
        // Dựa trên tốc độ hiện tại để xác định tốc độ tiếp theo
        var currentSpeed = GameManager.gameSpeed || "normal";
        var nextSpeed;

        if (currentSpeed === "normal") {
            nextSpeed = "fast";
        } else if (currentSpeed === "fast") {
            nextSpeed = "super-fast";
        } else {
            nextSpeed = "normal"; // Quay về tốc độ bình thường nếu đang ở super-fast
        }

        // Áp dụng tốc độ mới
        gameManagerInstance.setGameSpeed(nextSpeed);

        return nextSpeed; // Trả về tốc độ mới để UI có thể cập nhật nếu cần
    };

    // Cập nhật biểu tượng tốc độ nếu có
    gameManagerInstance.updateSpeedButton = function () {
        var speedButton = document.getElementById("speedControlButton");
        if (speedButton) {
            // Cập nhật biểu tượng dựa trên tốc độ hiện tại
            var currentSpeed = GameManager.gameSpeed || "normal";
            var speedIcon = ">";

            if (currentSpeed === "fast") {
                speedIcon = ">>";
            } else if (currentSpeed === "super-fast") {
                speedIcon = ">>>";
            }

            speedButton.textContent = speedIcon;
        }
    };

    // Mới: Thêm nút điều khiển tốc độ vào UI
    gameManagerInstance.addSpeedControlButton = function () {
        // Kiểm tra xem nút đã tồn tại chưa
        if (document.getElementById("speedControlButton")) {
            return;
        }

        // Tạo nút tốc độ
        var button = document.createElement("div");
        button.id = "speedControlButton";
        button.className = "fixed right-5 bottom-5 w-10 h-10 rounded-full bg-blue-500 text-white text-base font-bold flex justify-center items-center cursor-pointer z-[9999] shadow-md transition-all duration-200 ease-in-out";

        // Đặt nội dung ban đầu dựa vào tốc độ hiện tại
        gameManagerInstance.updateSpeedButtonContent(button);

        // Thêm sự kiện click
        button.addEventListener("click", function () {
            gameManagerInstance.cycleThroughSpeeds();
            // Hiệu ứng khi nhấn
            this.style.transform = "scale(1.1)";
            setTimeout(function () {
                button.style.transform = "scale(1)";
            }, 150);
        });

        // Thêm vào body
        document.body.appendChild(button);

        // Giám sát trạng thái main menu để ẩn/hiện nút
        gameManagerInstance.monitorMainMenuForSpeedButton();
    };

    // Mới: Cập nhật biểu tượng nút tốc độ
    gameManagerInstance.updateSpeedButton = function () {
        var button = document.getElementById("speedControlButton");
        if (button) {
            gameManagerInstance.updateSpeedButtonContent(button);
        }
    };

    // Mới: Cập nhật nội dung nút tốc độ
    gameManagerInstance.updateSpeedButtonContent = function (button) {
        if (!button) return;

        var currentSpeed = GameManager.gameSpeed || "normal";

        // Đặt biểu tượng dựa vào tốc độ hiện tại
        if (currentSpeed === "normal") {
            button.textContent = ">";
        } else if (currentSpeed === "fast") {
            button.textContent = ">>";
        } else if (currentSpeed === "super-fast") {
            button.textContent = ">>>";
        } else if (currentSpeed === "slow") {
            button.textContent = "½";
        } else if (currentSpeed === "extra-fast") {
            button.textContent = ">>>>";
        }
    };

    // Mới: Giám sát menu chính để hiển thị/ẩn nút tốc độ
    gameManagerInstance.monitorMainMenuForSpeedButton = function () {
        setInterval(function () {
            var button = document.getElementById("speedControlButton");
            var mainMenu = document.getElementById("mainMenu");

            if (button && mainMenu) {
                // Hiển thị nút khi không ở main menu (trong game), ẩn khi ở main menu
                button.style.display = mainMenu.offsetParent === null ? "flex" : "none";
            }
        }, 200);
    };

    // Tạm dừng game
    // isSystemPause: true nếu là system pause
    // showOverlay: true nếu muốn hiển thị overlay "Game Paused"
    gameManagerInstance.pause = function (isSystemPause, showOverlay) {
        if (isSystemPause && showOverlay) { // Hiển thị overlay nếu cần
            $(document).find("#gamePausedOverlay").css("top", CanvasManager.backgroundCanvas.height / 2 - 150);
            $(document).find("#gamePausedOverlay").css("opacity", 0).show().transit({ opacity: 1 });
        }
        // Đặt cờ tạm dừng tương ứng
        if (isSystemPause) gameManagerInstance.systemPause = true;
        else gameManagerInstance.playerPause = true;
        // Nếu game đang chạy, lưu tốc độ hiện tại và đặt tốc độ về 0
        if (gameManagerInstance._timeModifier > 0) {
            gameManagerInstance._oldTimeModifier = gameManagerInstance._timeModifier;
            gameManagerInstance._timeModifier = 0;
        }
        // Nếu là player pause và chạy trên Windows 8, gọi hàm onPause của WindowsIntegration
        if (!isSystemPause && PlatformShim.ISWIN8) WindowsIntegration.onPause();
    };

    // Tiếp tục game
    // isSystemResume: true nếu là system resume
    // hideOverlay: true nếu muốn ẩn overlay "Game Paused"
    gameManagerInstance.resume = function (isSystemResume, hideOverlay) {
        var isPanelCurrentlyOpen = UI.isPanelOpen();
        // Ẩn overlay nếu cần
        if (!gameManagerInstance.playerPause && isSystemResume && hideOverlay && !isPanelCurrentlyOpen) {
            $(document).find("#gamePausedOverlay").transit({ opacity: 0 }, function () { $("#gamePausedOverlay").hide(); });
        }
        // Bỏ cờ tạm dừng tương ứng
        if (isSystemResume && !isPanelCurrentlyOpen) gameManagerInstance.systemPause = false;
        else gameManagerInstance.playerPause = false;
        // Nếu không có modal nào đang mở và không có trạng thái tạm dừng nào khác, khôi phục tốc độ game
        if (!UI.isModalContentOpen() && !gameManagerInstance.systemPause && !gameManagerInstance.playerPause) {
            gameManagerInstance._timeModifier = gameManagerInstance._oldTimeModifier;
        }
        // Nếu là player resume và chạy trên Windows 8, gọi hàm onResume của WindowsIntegration
        if (!gameManagerInstance.playerPause && !isSystemResume && PlatformShim.ISWIN8) WindowsIntegration.onResume();
    };

    // Lưu game hiện tại vào slot của công ty
    gameManagerInstance.saveActualGame = function () {
        if (gameManagerInstance.company) {
            // Hiển thị overlay "Game Saved"
            $("#gameSavedOverlay").css("top", CanvasManager.backgroundCanvas.height / 2 - 50);
            $("#gameSavedOverlay").css("opacity", 0).show().transit({ opacity: 1 });
            gameManagerInstance.save(gameManagerInstance.company.slot, function () { // Gọi hàm save với slot hiện tại
                $("#gameSavedOverlay").transit({ opacity: 0 }, 600, function () { $("#gameSavedOverlay").hide(); }); // Ẩn overlay sau khi lưu xong
            });
        }
    };

    // Hàm lưu game chính
    // slotToSave: Tên slot cần lưu
    // onSuccessCallback: Callback khi lưu thành công
    // onErrorCallback: Callback khi có lỗi
    gameManagerInstance.save = function (slotToSave, onSuccessCallback, onErrorCallback) {
        var currentCompany = GameManager.company;
        // Không lưu nếu không có công ty hoặc đang ở màn hình chờ
        if (!currentCompany || $("#splashScreen").is(":visible")) {
            if (onSuccessCallback) onSuccessCallback();
            return;
        }

        var saveData = {}; // Tạo đối tượng để chứa dữ liệu save
        saveData.version = gameManagerInstance.VERSION;
        saveData.slot = currentCompany.slot;
        saveData.gameTime = gameManagerInstance.gameTime;
        saveData.playerPause = gameManagerInstance.playerPause;
        saveData.systemPause = gameManagerInstance.systemPause;
        saveData.timeModifier = gameManagerInstance._timeModifier;
        saveData.oldTimeModifier = gameManagerInstance._oldTimeModifier;
        saveData.state = gameManagerInstance.state;
        saveData.currentMission = gameManagerInstance.currentMission;
        saveData.currentResearches = gameManagerInstance.currentResearches;
        saveData.currentEngineDev = gameManagerInstance.currentEngineDev;
        saveData.currentHwProject = gameManagerInstance.currentHwProject;
        saveData.currentRnDProject = gameManagerInstance.currentRnDProject;
        saveData.currentContract = gameManagerInstance.currentContract;
        saveData.uiSettings = gameManagerInstance.uiSettings;
        saveData.flags = gameManagerInstance.flags;
        saveData.spawnedPoints = gameManagerInstance.spawnedPoints;
        saveData.company = currentCompany.save(); // Gọi hàm save của đối tượng Company

        // Lưu kinh nghiệm của các mission
        var missionXPArray = [];
        var allMissions = Missions.getAllMissions();
        for (var i = 0; i < allMissions.length; i++) {
            var mission = allMissions[i];
            missionXPArray.push({ id: mission.id, xp: mission.experience, percentage: mission.percentage });
        }
        saveData.missionXP = missionXPArray;

        // Lưu kinh nghiệm của các feature
        var featureXPArray = Research.getAllItems().filter(function (item) { return item.experience > 0; })
            .map(function (item) { return FeatureSerializer.save(item); });
        saveData.featureXP = featureXPArray;

        // Lưu feature hiện tại và planned features
        if (gameManagerInstance.currentFeature) saveData.currentFeature = gameManagerInstance.currentFeature;
        if (gameManagerInstance.plannedFeatures) {
            saveData.plannedFeatures = gameManagerInstance.plannedFeatures.map(function (feature) { return CompanyFeatureSerializer.save(feature); });
        }

        Knowledge.savePlayerKnowledge(); // Lưu kiến thức của người chơi
        GDT.fire(gameManagerInstance, GDT.eventKeys.saves.saving, { company: gameManagerInstance.company, data: saveData }); // Kích hoạt sự kiện đang lưu

        var jsonSaveData = JSON.stringify(saveData); // Chuyển dữ liệu save thành chuỗi JSON
        // Lưu vào DataStore
        DataStore.saveToSlotAsync(slotToSave, jsonSaveData, function () {
            // Lưu thông tin header của save game (để hiển thị trong danh sách load/save)
            var saveHeader = {};
            saveHeader.name = currentCompany.name;
            saveHeader.cash = currentCompany.cash;
            saveHeader.fans = currentCompany.fans;
            saveHeader.currentWeek = currentCompany.currentWeek;
            saveHeader.mods = currentCompany.mods; // Lưu thông tin mod (nếu có)
            saveHeader.date = new Date;
            saveHeader.pirateMode = currentCompany.flags.pirateMode;
            DataStore.setValue(slotToSave, JSON.stringify(saveHeader)); // Lưu header
            if (DataStore.commit) DataStore.commit(); // Commit thay đổi (nếu DataStore hỗ trợ)

            // Cập nhật tile của game trên Windows 8 (nếu có)
            if (PlatformShim.ISWIN8) {
                try {
                    WindowsIntegration.updateImageTile();
                } catch (error) {
                    Logger.LogInfo("game tile update failed", error);
                }
            }
            if (onSuccessCallback) onSuccessCallback();
        },
            function (error) { // Xử lý lỗi khi lưu
                if (onErrorCallback) onErrorCallback();
                else {
                    Logger.LogError("Could not save game", error, "Could not save game".localize());
                    if (onSuccessCallback) onSuccessCallback(); // Vẫn gọi onSuccess nếu không có onError để tránh kẹt game
                }
            });
    };

    // Hàm tải game chính
    // slotToLoad: Tên slot cần tải
    // onSuccessCallback: Callback khi tải thành công
    // onErrorCallback: Callback khi có lỗi
    gameManagerInstance.load = function (slotToLoad, onSuccessCallback, onErrorCallback) {
        DataStore.loadSlotAsync(slotToLoad, function (jsonSaveData) { // Tải dữ liệu từ DataStore
            try {
                var parsedSaveData = JSON.parse(jsonSaveData); // Parse chuỗi JSON
            } catch (error) { // Xử lý lỗi nếu file save bị hỏng
                if (Steam && Steam.isAvailable && Steam.isAvailable()) Logger.LogError("This save slot is corrupt, this could be due to a failed cloud sync. Please resync your game with the Steam cloud and try again.", error, "This save slot is corrupt, this could be due to a failed cloud sync. Please resync your game with the Steam cloud and try again.".localize());
                else if (PlatformShim.ISWIN8) Logger.LogError("This save slot is corrupt, this could be due to a failed cloud sync. Please report this issue to Microsoft Support.", error, "This save slot is corrupt, this could be due to a failed cloud sync. Please report this issue to Microsoft Support this issue.".localize());
                else Logger.LogError("This save slot is corrupt, please try restarting your game.", error, "This save slot is corrupt, please try restarting your game.".localize());
                SplashScreen.reshow(); // Hiển thị lại màn hình chờ
                return;
            }
            // Nếu là Windows 8, tải trực tiếp
            if (PlatformShim.ISWIN8) loadGameData(parsedSaveData, onSuccessCallback, onErrorCallback);
            else { // Nếu không phải Windows 8 (ví dụ: desktop/Steam)
                // Bỏ qua việc kiểm tra mod mismatch và luôn tải game trực tiếp
                loadGameData(parsedSaveData, onSuccessCallback, onErrorCallback);
            }
        }, function (error) { // Xử lý lỗi khi tải từ DataStore
            Logger.LogError("Could not load game", error, "Could not load game".localize());
            if (onErrorCallback) onErrorCallback(error);
        });
    };

    // Đếm số lượng nhân viên đang làm việc trên một feature cụ thể
    gameManagerInstance.staffCountWorkingOnFeature = function (feature) {
        var count = 0;
        for (var i = 0; i < gameManagerInstance.company.staff.length; i++) {
            if (gameManagerInstance.company.staff[i].currentFeature && gameManagerInstance.company.staff[i].currentFeature.id === feature.id) {
                count++;
            }
        }
        return count;
    };

    // Kiểm tra xem có được phép chuyển đổi animation không (dựa trên tiến độ các công việc)
    gameManagerInstance.IsAnimationSwitchAllowed = function (staffMember) {
        if (gameManagerInstance.company) {
            var progressValues = [];
            if (gameManagerInstance.currentEngineDev) progressValues.push(gameManagerInstance.currentEngineDev.progress);
            if (staffMember.currentResearch) progressValues.push(staffMember.currentResearch.progress);
            if (gameManagerInstance.currentFeature) progressValues.push(gameManagerInstance.getCurrentGameProgress());

            var numProgressValues = progressValues.length;
            if (numProgressValues === 0) return true; // Nếu không có công việc nào, cho phép chuyển

            var sumProgress = 0;
            for (var i = 0; i < numProgressValues; i++) {
                sumProgress += progressValues[i];
            }
            // Nếu tiến độ trung bình quá cao (gần hoàn thành), không cho phép chuyển animation (để tránh lỗi)
            if (sumProgress / numProgressValues > 0.8) return false;
        }
        return true;
    };

    // Tự động lưu game
    // callback: Callback được gọi sau khi lưu xong
    gameManagerInstance.autoSave = function (callback) {
        // Cờ G782 và năm > 11 có thể là điều kiện đặc biệt để không auto save (ví dụ: gần cuối game)
        if (GameFlags.G782 && (gameManagerInstance.company == void 0 ? 0 : gameManagerInstance.company.getCurrentDate().year) >= 11) {
            if (callback) callback();
        } else {
            gameManagerInstance.save("auto", callback, function (error) { // Lưu vào slot "auto"
                ghg4.ghg5("auto-save failed"); // Ghi log lỗi nếu không lưu được
            });
        }
    };

    // Lấy danh sách các save game đã lưu
    gameManagerInstance.getSaveGames = function () {
        var saveGamesArray = [];
        var autoSaveData = DataStore.getValue("auto"); // Lấy save game tự động
        if (autoSaveData) {
            var autoSaveHeader = SaveGameData.parseFromHeaderData("auto", autoSaveData);
            saveGamesArray.push(autoSaveHeader);
        }
        // Lấy các save game từ slot 1 đến 5
        for (var slotNumber = 1; slotNumber <= 5; slotNumber++) {
            var slotData = DataStore.getValue(slotNumber.toString());
            if (slotData) {
                var slotHeader = SaveGameData.parseFromHeaderData(slotNumber.toString(), slotData);
                saveGamesArray.push(slotHeader);
            } else {
                saveGamesArray.push(null); // Nếu slot trống
            }
        }
        // Loại bỏ các slot null thừa (chỉ giữ lại tối đa 1 slot null)
        while (saveGamesArray.count(function (item) { return item == null; }) > 1) {
            var lastNull = saveGamesArray.last(function (item) { return item == null; });
            saveGamesArray.remove(lastNull);
        }
        return saveGamesArray;
    };

    // Mở giao diện lưu game
    gameManagerInstance.openSaveView = function () {
        gameManagerInstance.pause(true); // Tạm dừng game
        UI.showSaveView(gameManagerInstance.getSaveGames()); // Hiển thị UI lưu game
    };

    // Mở giao diện tải game
    gameManagerInstance.openLoadView = function () {
        gameManagerInstance.pause(true); // Tạm dừng game
        UI.showLoadView(gameManagerInstance.getSaveGames()); // Hiển thị UI tải game
    };

    // Kiểm tra xem game có bị "Game Over" do hết tiền không
    gameManagerInstance.checkGameOver = function () {
        if (gameManagerInstance.company.cash > -5E3) return; // Nếu tiền vẫn còn dương (hoặc âm ít), không sao

        var bankruptWarningMessage = "Your bank account is in the red.\nThankfully your bank has enabled you to overdraw your account up to {0} but be careful, if your account balance is below -{0} you will go bankrupt.".localize();
        // Các ngưỡng cảnh báo và phá sản khác nhau tùy theo level của công ty
        if (gameManagerInstance.company.currentLevel === 1 && gameManagerInstance.company.cash <= -5E3) { // Level 1
            if (gameManagerInstance.company.flags.lvl1BankruptWarning == void 0) { // Cảnh báo lần đầu
                gameManagerInstance.company.notifications.push(new Notification("Warning".localize("heading"), bankruptWarningMessage.format("{0}K".localize().format(50)), { type: NotificationType.AutoPopup }));
                gameManagerInstance.company.flags.lvl1BankruptWarning = 1;
            } else if (gameManagerInstance.company.cash < -5E4) { // Phá sản thực sự
                triggerGameOver();
            }
        } else if (gameManagerInstance.company.currentLevel <= 3 && gameManagerInstance.company.cash <= 4E4) { // Level 2-3
            if (gameManagerInstance.company.flags.lvl2BankruptWarning == void 0) {
                gameManagerInstance.company.notifications.push(new Notification("Warning".localize("heading"), bankruptWarningMessage.format("{0}K".localize().format(200)), { type: NotificationType.AutoPopup }));
                gameManagerInstance.company.flags.lvl2BankruptWarning = 1;
            } else if (gameManagerInstance.company.cash < -2E5) {
                triggerGameOver();
            }
        } else if (gameManagerInstance.company.cash <= 15E4) { // Level cao hơn
            if (gameManagerInstance.company.flags.lvl3BankruptWarning == void 0) {
                gameManagerInstance.company.notifications.push(new Notification("Warning".localize("heading"), bankruptWarningMessage.format("{0}M".localize().format(2)), { type: NotificationType.AutoPopup }));
                gameManagerInstance.company.flags.lvl3BankruptWarning = 1;
            } else if (gameManagerInstance.company.cash < -2E6) {
                triggerGameOver();
            }
        }
    };

    // Hàm nội bộ để kích hoạt "Game Over"
    var triggerGameOver = function () {
        if (GameFlags.GAME_OVER_DISABLED) return; // Bỏ qua nếu Game Over bị tắt (ví dụ: debug)

        var currentCompany = gameManagerInstance.company;
        if (currentCompany.flags.ghgnogfc) return; // Một cờ đặc biệt khác để bỏ qua Game Over

        // Các trường hợp có thể được "cứu trợ"
        if (currentCompany.gameLog.length > 0 && currentCompany.gameLog.last().releaseWeek > currentCompany.currentWeek - 2 && DecisionNotifications.miniBailout.canUse(currentCompany)) {
            var bailoutNotification = DecisionNotifications.miniBailout.getNotification(currentCompany);
            currentCompany.notifications.push(bailoutNotification);
        } else if (DecisionNotifications.bailout.canUse(currentCompany)) {
            var bailoutNotification = DecisionNotifications.bailout.getNotification(currentCompany);
            currentCompany.notifications.push(bailoutNotification);
        } else {
            // Nếu đang phát triển game và gần xong, có thể có cứu trợ đặc biệt
            if (currentCompany.currentGame && gameManagerInstance.getCurrentGameProgress() > 0.6 && DecisionNotifications.inDevBailout.canUse(currentCompany)) {
                var bailoutNotification = DecisionNotifications.inDevBailout.getNotification(currentCompany);
                currentCompany.notifications.push(bailoutNotification);
                gameManagerInstance.showPendingNotifications();
                return;
            }
            // Nếu không có cứu trợ nào, thực sự Game Over
            var currentDate = gameManagerInstance.company.getCurrentDate();
            ghg4.ghg5("game over (bankrupt)", { year: currentDate.year }); // Ghi log
            gameManagerInstance.company.notifications.push(new Notification("Game Over".localize("heading"), "Unfortunately you are bankrupt.".localize(), ":-(", { type: NotificationType.AutoPopup }));
            // Tạo tin tức về việc công ty phá sản
            var buyerCompany = currentDate.year < 15 ? "Electronic Mass Productions" : "Stynga";
            var newsText = "We have just got confirmation that {0}, which has been in financial trouble lately, has gone bankrupt.\nIt appears that {1}, a behemoth in the gaming industry, has purchased the remains of the company.".localize().format(gameManagerInstance.company.name, buyerCompany);
            if (gameManagerInstance.company.gameLog.length > 0) {
                newsText += "{n}" + "A spokesperson of {0} said, 'We are very excited to have acquired the rights to all of {1} previously released titles.'\n\nHearing this news, many fans of {1} have expressed their disappointment.".localize().format(buyerCompany, gameManagerInstance.company.name);
            }
            gameManagerInstance.company.notifications.push(new Notification("Breaking News".localize("heading"), newsText, { type: NotificationType.AutoPopup }));
            gameManagerInstance.company.notifications.push(DecisionNotifications.gameOver.getNotification(gameManagerInstance.company)); // Thông báo quyết định Game Over
        }
        gameManagerInstance.showPendingNotifications();
    };

    // Polyfill cho requestAnimationFrame (để tối ưu animation)
    if (!window.requestAnimFrame) {
        window.requestAnimFrame = (function () {
            return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
                window.setTimeout(callback, 1000 / 60); // Mặc định 60 FPS
            };
        })();
    }
    createjs.Ticker.setPaused(true); // Tạm dừng Ticker của createjs ban đầu
    gameManagerInstance._timeModifier = 1; // Hệ số tốc độ game
    gameManagerInstance.gameTime = 0; // Thời gian trong game (tính bằng ms)
    gameManagerInstance.SECONDS_PER_WEEK = 4; // Số giây thực tế cho mỗi tuần trong game

    // Lấy tuần hiện tại (có thể là số lẻ)
    gameManagerInstance.getCurrentWeekFractional = function () {
        return gameManagerInstance.gameTime / (1000 * gameManagerInstance.SECONDS_PER_WEEK);
    };

    // Cập nhật trạng thái các feature đang phát triển
    gameManagerInstance.updateFeatures = function () {
        if (gameManagerInstance.currentFeature) {
            // Tính toán thời gian trôi qua kể từ lần cập nhật trước
            if (!gameManagerInstance.currentFeature.lastUpdate) gameManagerInstance.currentFeature.lastUpdate = gameManagerInstance.gameTime;
            if (!gameManagerInstance.company.currentGame.flags.staffContribution) gameManagerInstance.company.currentGame.flags.staffContribution = {};
            var staffContribution = gameManagerInstance.company.currentGame.flags.staffContribution;
            if (!gameManagerInstance.company.currentGame.flags.devTime) gameManagerInstance.company.currentGame.flags.devTime = 0;

            var deltaTime = gameManagerInstance.gameTime - gameManagerInstance.currentFeature.lastUpdate;
            gameManagerInstance.currentFeature.lastUpdate = gameManagerInstance.gameTime;

            if (deltaTime <= 0) return; // Bỏ qua nếu không có thời gian trôi qua

            var totalProgressFromStaff = 0;
            var workingStaffCount = 0;
            var anyStaffWorking = false;
            // Tính toán đóng góp của từng nhân viên vào feature
            for (var i = 0; i < gameManagerInstance.company.staff.length; i++) {
                var staff = gameManagerInstance.company.staff[i];
                if (staff.isWorking()) anyStaffWorking = true;
                if (staff.currentFeature && gameManagerInstance.currentFeature.id === staff.currentFeature.id) {
                    workingStaffCount++;
                    if (!staffContribution[staff.id]) staffContribution[staff.id] = 0;
                    staffContribution[staff.id] += deltaTime * staff.efficiency; // Đóng góp dựa trên hiệu quả
                    totalProgressFromStaff += staff.currentFeature.progress;
                }
            }

            if (anyStaffWorking) {
                gameManagerInstance.company.currentGame.flags.devTime += deltaTime; // Tăng tổng thời gian phát triển
                if (workingStaffCount > 0) { // Cập nhật tiến độ feature dựa trên tiến độ trung bình của nhân viên
                    totalProgressFromStaff /= workingStaffCount;
                }
                // Cập nhật status message nếu feature vừa bắt đầu
                if (gameManagerInstance.currentFeature.progress === 0) {
                    if (gameManagerInstance.currentFeature.type === "focus") {
                        var mission = General.getMission(gameManagerInstance.currentFeature.id);
                        if (mission.missionType === "preparation") VisualsManager.gameStatusBar.updateStatusMessage("Starting ...".localize());
                        else if (mission.missionType === "BugFixing") {
                            if (gameManagerInstance.company.currentGame.bugs > 0) VisualsManager.gameStatusBar.updateStatusMessage("Finishing ...".localize());
                        } else VisualsManager.gameStatusBar.updateStatusMessage(mission.name);
                    } else {
                        VisualsManager.gameStatusBar.updateStatusMessage(gameManagerInstance.currentFeature.name);
                    }
                }
                // Trường hợp đặc biệt: animation Pong cho level 1
                if (gameManagerInstance.currentFeature.id == "Graphic" && gameManagerInstance.company.currentLevel === 1 && gameManagerInstance.company.currentGame.title.toLocaleLowerCase() == "pong".toLocaleLowerCase()) {
                    VisualsManager.getCharacterOverlay(gameManagerInstance.company.staff.first()).playPong();
                }
                gameManagerInstance.currentFeature.progress = totalProgressFromStaff; // Cập nhật tiến độ feature
                // Nếu feature hoàn thành
                if (gameManagerInstance.currentFeature.progress == 1) {
                    if (gameManagerInstance.currentFeature.id == "Bugfixing") { // Nếu là bug fixing, chỉ hoàn thành khi không còn spawned points
                        if (gameManagerInstance.spawnedPoints <= 0) gameManagerInstance.finishCurrentMission();
                    } else {
                        gameManagerInstance.finishCurrentMission();
                    }
                }
                // Cập nhật progress bar của game (nếu feature vẫn còn)
                if (gameManagerInstance.currentFeature) gameManagerInstance.updateGameProgress();
            }
        }
    };

    // Cập nhật progress bar của game
    gameManagerInstance.updateGameProgress = function () {
        var missionLogLength = gameManagerInstance.company.currentGame.missionLog.length;
        // Chỉ hiển thị progress bar nếu game đã qua giai đoạn chuẩn bị và chưa hoàn thành tất cả mission chính
        if (missionLogLength < 1 || missionLogLength / 3 > GameFlags.MAIN_MISSIONS_PER_GAME) {
            VisualsManager.gameStatusBar.updateProgress(false);
        } else {
            VisualsManager.gameStatusBar.updateProgress(gameManagerInstance.getCurrentGameProgress());
            gameManagerInstance.updateCurrentHypePoints(); // Cập nhật điểm hype
        }
    };

    // Lấy tiến độ hiện tại của game (tỷ lệ 0-1)
    gameManagerInstance.getCurrentGameProgress = function () {
        var progress = 0;
        var currentGame = gameManagerInstance.company.currentGame;
        if (currentGame.featureLog) {
            // Tính tổng thời gian cần thiết để hoàn thành game
            var totalDuration = Missions.BASE_DURATION * GameFlags.MAIN_MISSIONS_PER_GAME *
                General.getGameSizeDurationFactor(currentGame.gameSize) *
                General.getMultiPlatformDurationFactor(currentGame);
            var accumulatedDuration = 0;
            // Cộng dồn thời gian của các feature đã hoàn thành
            for (var i = 1; i < currentGame.featureLog.length; i++) { // Bắt đầu từ 1 để bỏ qua mission "preparation"
                if (currentGame.featureLog[i].duration) {
                    accumulatedDuration += currentGame.featureLog[i].duration * currentGame.featureLog[i].progress;
                }
            }
            // Cộng thêm thời gian của feature hiện tại
            if (gameManagerInstance.currentFeature) {
                accumulatedDuration += gameManagerInstance.currentFeature.duration * gameManagerInstance.currentFeature.progress;
            }
            progress = accumulatedDuration / totalDuration;
        }
        return progress;
    };

    // Cập nhật hiển thị điểm hype
    gameManagerInstance.updateCurrentHypePoints = function () {
        if (!gameManagerInstance.company.currentGame || !gameManagerInstance.company.currentGame.hypePoints) return 0;
        var hypeToShow = Math.floor(gameManagerInstance.company.currentGame.hypePoints * gameManagerInstance.getCurrentGameProgress());
        if (hypeToShow >= 1) {
            Tutorial.hypePoints(); // Hiển thị tutorial về hype (nếu cần)
            VisualsManager.gameStatusBar.updateHypePoints(hypeToShow);
        }
    };

    // Cập nhật trạng thái của các nhân vật
    gameManagerInstance.updateCharacters = function () {
        if (gameManagerInstance.company && gameManagerInstance.company.staff) {
            for (var i = 0; i < gameManagerInstance.company.staff.length; i++) {
                gameManagerInstance.company.staff[i].tick(); // Gọi hàm tick của từng nhân viên
            }
            // Tương tự cho hwCrew và rndCrew (nếu có)
            if (gameManagerInstance.company.hwCrew) {
                for (var i = 0, len = gameManagerInstance.company.hwCrew.length; i < len; i++) {
                    gameManagerInstance.company.hwCrew[i].tick();
                }
            }
            if (gameManagerInstance.company.rndCrew) {
                for (var i = 0, len = gameManagerInstance.company.rndCrew.length; i < len; i++) {
                    gameManagerInstance.company.rndCrew[i].tick();
                }
            }
        }
    };

    // Mua bản quyền một nền tảng
    // platform: Nền tảng cần mua
    gameManagerInstance.buyPlatform = function (platform) {
        gameManagerInstance.company.adjustCash(-platform.licencePrize, platform.name + " " + "dev. license".localize(" used as {platformname} dev. license"));
        gameManagerInstance.company.licencedPlatforms.push(platform);
        gameManagerInstance.company.availablePlatforms.remove(platform);
        UI.updateStatusBar(gameManagerInstance.company); // Cập nhật UI
    };

    // Lấy ID ngẫu nhiên cho body của nhân vật (đảm bảo không trùng với nhân viên hiện có cùng hướng)
    gameManagerInstance.getNewBody = function (sex, orientation) {
        var bodyIdOptions = [1, 2, 3, 4, 5, 6, 7, 8];
        if (sex === "female") bodyIdOptions = [9, 10, 11, 12];
        var newBodyId;
        do {
            newBodyId = bodyIdOptions.pickRandom();
            var isDuplicate = false;
            for (var i = 0; i < gameManagerInstance.company.staff.length; i++) {
                if (gameManagerInstance.company.staff[i].flags.body === newBodyId && gameManagerInstance.company.staff[i].getOrientation() === orientation) {
                    isDuplicate = true;
                    break;
                }
            }
        } while (isDuplicate && bodyIdOptions.length > gameManagerInstance.company.staff.length); // Tránh vòng lặp vô hạn nếu hết lựa chọn
        return newBodyId;
    };
    // Tương tự cho head
    gameManagerInstance.getNewHead = function (sex, orientation) {
        var headIdOptions = [1, 2, 3, 4, 5, 6, 7, 8];
        if (sex === "female") headIdOptions = [9, 10, 11, 12];
        var newHeadId;
        do {
            newHeadId = headIdOptions.pickRandom();
            var isDuplicate = false;
            for (var i = 0; i < gameManagerInstance.company.staff.length; i++) {
                if (gameManagerInstance.company.staff[i].flags.head === newHeadId && gameManagerInstance.company.staff[i].getOrientation() === orientation) {
                    isDuplicate = true;
                    break;
                }
            }
        } while (isDuplicate && headIdOptions.length > gameManagerInstance.company.staff.length);
        return newHeadId;
    };
    // Đặt body và head cho nhân vật
    gameManagerInstance.setBodyAndHead = function (character) {
        character.flags.body = gameManagerInstance.getNewBody(character.sex, character.getOrientation());
        character.flags.head = gameManagerInstance.getNewHead(character.sex, character.getOrientation());
    };

    // Lấy thứ hạng bán hàng duy nhất (tránh trùng lặp trên biểu đồ)
    // rank: Thứ hạng ban đầu
    // game: Game đang xét
    gameManagerInstance.getUniqueSalesRank = function (rank, game) {
        if (rank > 100) return rank; // Nếu quá 100, không cần duy nhất
        // Lấy danh sách các game đang bán
        var gamesOnSale = gameManagerInstance.company.gameLog.filter(function (g) { return g.currentSalesCash != g.totalSalesCash; });
        var existingRankedGame;
        do {
            existingRankedGame = gamesOnSale.first(function (g) { return g.nextSalesRank == rank && g.id != game.id; });
            if (existingRankedGame) rank++; // Nếu trùng, tăng rank lên
        } while (existingRankedGame);
        return rank;
    };

    // Tính toán ngân sách tối đa cho R&D lab dựa trên số lượng chuyên gia design
    gameManagerInstance.getMaxRndBudget = function () {
        var designSpecialistCount = gameManagerInstance.company.staff.filter(function (staff) { return staff.flags.designSpecialist; }).count();
        return Math.max(5E5, gameManagerInstance.MAX_RND_COST - (designSpecialistCount - 1).clamp(0, 7) * gameManagerInstance.RND_DECREASE_PER_SPECIALIST);
    };
    // Tương tự cho Hardware lab
    gameManagerInstance.getMaxHwBudget = function () {
        var techSpecialistCount = gameManagerInstance.company.staff.filter(function (staff) { return staff.flags.technologySpecialist; }).count();
        return Math.max(5E5, gameManagerInstance.MAX_HW_COST - (techSpecialistCount - 1).clamp(0, 7) * gameManagerInstance.HW_DECREASE_PER_SPECIALIST);
    };

    // Kiểm tra và hiển thị các achievement mới đạt được
    gameManagerInstance.checkAchievements = function () {
        var newAchievements = Achievements.checkForNew(gameManagerInstance.company);
        if (newAchievements.length > 0) UI.showAchievements(newAchievements);
    };

    // Xử lý khi app bar (hoặc menu tương tự) được hiển thị
    gameManagerInstance.pauseAppBarShown = function (areaName) {
        if (typeof areaName === "string" || areaName instanceof String) ghg4.ghg5("fragment activated", { area: areaName });
        gameManagerInstance.pause(true, true); // System pause, có hiển thị overlay
    };
    // Xử lý khi app bar được đóng
    gameManagerInstance.resumeAppBarShown = function () {
        if (GameManager.loadScreenOpened) { // Nếu màn hình load game vừa được mở
            GameManager.loadScreenOpened = false;
            gameManagerInstance.resume(false, true); // Player resume, ẩn overlay
        } else {
            gameManagerInstance.resume(true, true); // System resume, ẩn overlay
        }
    };

    var tickListeners = []; // Mảng lưu trữ các hàm sẽ được gọi trong mỗi tick của game loop
    // Thêm một listener vào game loop
    // listenerFunction: Hàm sẽ được gọi
    // isGameTimeDependent: true nếu hàm này phụ thuộc vào thời gian game (bị ảnh hưởng bởi tốc độ game)
    gameManagerInstance.addTickListener = function (listenerFunction, isGameTimeDependent) {
        tickListeners.push({ f: listenerFunction, isGameTime: isGameTimeDependent });
    };

    // Listener mặc định: cập nhật thời gian game, xử lý sự kiện hàng tuần, cập nhật features, characters, contracts
    gameManagerInstance.addTickListener(function (elapsedTime) { // elapsedTime là thời gian trôi qua (đã nhân với timeModifier)
        if (gameManagerInstance.company && gameManagerInstance.loadInProgress !== true) {
            gameManagerInstance.gameTime += elapsedTime; // Tăng thời gian game
            var currentFractionalWeek = gameManagerInstance.getCurrentWeekFractional();
            var previousFullWeek = Math.floor(gameManagerInstance.company.currentWeek);
            gameManagerInstance.company.currentWeek = currentFractionalWeek; // Cập nhật tuần hiện tại của công ty

            // Nếu đã qua một hoặc nhiều tuần mới
            if (Math.floor(currentFractionalWeek) > previousFullWeek) {
                var weeksPassed = Math.floor(currentFractionalWeek) - previousFullWeek;
                for (var i = 1; i <= weeksPassed; i++) {
                    General.proceedOneWeek(gameManagerInstance.company, previousFullWeek + i); // Xử lý sự kiện cho mỗi tuần đã qua
                }
                if (gameManagerInstance.company.cash < 0) gameManagerInstance.checkGameOver(); // Kiểm tra Game Over nếu tiền âm
            }
            // Cập nhật UI và các logic khác mỗi 0.1 tuần
            if (Math.floor(10 * currentFractionalWeek) > Math.floor(10 * previousFullWeek)) {
                UI.updateStatusBar(gameManagerInstance.company);
                Research.checkForNewResearch();
                gameManagerInstance.checkAchievements();
                if (gameManagerInstance._timeModifier != 0) { // Chỉ xử lý thông báo nếu game không bị tạm dừng hoàn toàn
                    General.updateNotifications(gameManagerInstance.company);
                    gameManagerInstance.showPendingNotifications();
                }
            }
            // Cập nhật các thành phần khác
            gameManagerInstance.updateFeatures();
            gameManagerInstance.updateCharacters();
            if (gameManagerInstance.currentContract) gameManagerInstance.updateContractProgress();
        }
    }, true); // isGameTimeDependent = true

    gameManagerInstance._gsapAnimations = []; // Mảng lưu trữ các animation của GSAP (GreenSock Animation Platform)
    // Thêm một animation GSAP vào quản lý của game loop
    gameManagerInstance.addGsapAnimationToGameTime = function (animationInstance) {
        gameManagerInstance._gsapAnimations.push(animationInstance);
    };
    // Cập nhật tất cả các animation GSAP
    gameManagerInstance._updateAllGsapAnimations = function (realElapsedTime) { // realElapsedTime là thời gian thực tế trôi qua
        var gameTimeElapsedTime = realElapsedTime * gameManagerInstance._timeModifier; // Thời gian game trôi qua (đã nhân timeModifier)
        // Xóa các animation đã hoàn thành
        var completedAnimations = gameManagerInstance._gsapAnimations.filter(function (anim) { return anim._gc; }); // _gc là cờ của GSAP cho biết animation đã hoàn thành
        for (var i = 0; i < completedAnimations.length; i++) {
            gameManagerInstance._gsapAnimations.remove(completedAnimations[i]);
        }
        // Cập nhật các animation còn lại
        for (var i = 0; i < gameManagerInstance._gsapAnimations.length; i++) {
            var animation = gameManagerInstance._gsapAnimations[i];
            if (gameTimeElapsedTime == 0) animation.pause(); // Tạm dừng nếu game dừng
            else {
                animation.timeScale(gameManagerInstance._timeModifier); // Đặt tốc độ animation theo tốc độ game
                if (animation.paused()) animation.resume(); // Tiếp tục nếu đang tạm dừng
            }
        }
    };
    gameManagerInstance.addTickListener(gameManagerInstance._updateAllGsapAnimations, false); // isGameTimeDependent = false (vì nó dùng realElapsedTime)

    var lastTickTime; // Thời điểm của tick trước đó
    // Hàm update chính của game loop
    gameManagerInstance.update = function () {
        if (lastTickTime) { // Nếu đã có tick trước đó
            var currentTime = Date.now();
            var realElapsedTime = (currentTime - lastTickTime).clamp(0, 500); // Thời gian thực tế trôi qua, giới hạn tối đa 500ms để tránh lag
            lastTickTime = currentTime;
            // Nếu UI đang hiển thị achievement, có thể giảm tốc độ game
            if (UI && UI._achievementsActiveTimeModifier != 1) {
                realElapsedTime *= UI._achievementsActiveTimeModifier;
            }
            // Bỏ qua nếu UI đang chuyển cảnh hoặc không có thời gian trôi qua
            if (UI && UI.isTransitionVisible || realElapsedTime === 0) return;

            if (gameManagerInstance.company) gameManagerInstance.company.timePlayed += realElapsedTime; // Tăng tổng thời gian chơi
            var gameTimeElapsedTime = realElapsedTime * gameManagerInstance._timeModifier;
            // Gọi tất cả các listener
            for (var i = 0; i < tickListeners.length; i++) {
                var listener = tickListeners[i];
                if (listener.isGameTime) { // Nếu listener phụ thuộc vào thời gian game
                    if (gameTimeElapsedTime != 0) listener.f(gameTimeElapsedTime);
                } else { // Nếu listener phụ thuộc vào thời gian thực
                    listener.f(realElapsedTime);
                }
            }
        } else {
            lastTickTime = Date.now(); // Ghi lại thời điểm tick đầu tiên
        }
    };

    // Các biến cho việc tính FPS và bỏ qua frame
    var fpsDisplayValue = 0;
    var lastFpsTime = new Date() * 1 - 1; // *1 để ép kiểu sang number
    gameManagerInstance._skipFrameCount = 0;
    var lastDrawLoopTime;

    // Vòng lặp vẽ chính (sử dụng requestAnimFrame)
    var drawLoop = function () {
        if (lastDrawLoopTime) {
            var currentTime = Date.now();
            var realElapsedTime = (currentTime - lastDrawLoopTime).clamp(0, 500);
            lastDrawLoopTime = currentTime;

            if (realElapsedTime <= 0) { // Bỏ qua nếu không có thời gian trôi qua
                requestAnimFrame(drawLoop);
                return;
            }

            var gameTimeElapsedTime = realElapsedTime * gameManagerInstance._timeModifier;
            createjs.Tween.tick(gameTimeElapsedTime, false); // Tick cho các tween của createjs

            gameManagerInstance._skipFrameCount++;
            // Logic bỏ qua frame: chỉ update game nếu không bỏ qua frame hoặc game đang chạy
            if (gameManagerInstance._timeModifier != 0 && SettingsGameplay.isFrameSkipEnabled() && gameManagerInstance._skipFrameCount != 1) {
                // Bỏ qua update
            } else {
                gameManagerInstance.update(); // Gọi hàm update game
            }

            // Vẽ lên canvas
            if (gameManagerInstance._timeModifier !== 0 && CanvasManager) {
                CanvasManager.update();
            } else if (GameFlags.IS_STEAM && Steam && CanvasManager && CanvasManager.backgroundStage && Steam.isAvailable() && gameManagerInstance._skipFrameCount == 2) {
                // Trường hợp đặc biệt cho Steam khi game dừng nhưng vẫn cần update background stage ở frame thứ 2
                CanvasManager.backgroundStage.update();
            }

            if (gameManagerInstance._skipFrameCount == 2) gameManagerInstance._skipFrameCount = 0; // Reset bộ đếm bỏ qua frame

            // Tính toán và hiển thị FPS (nếu bật)
            if (GameFlags.SHOW_FPS) {
                var now = new Date();
                var currentFps = 1000 / (now - lastFpsTime);
                if (isNaN(fpsDisplayValue)) fpsDisplayValue = 0;
                fpsDisplayValue += (currentFps - fpsDisplayValue) / 1; // Làm mượt giá trị FPS
                lastFpsTime = now;
            }
        } else {
            lastDrawLoopTime = Date.now(); // Ghi lại thời điểm bắt đầu vòng lặp
        }
        requestAnimFrame(drawLoop); // Lặp lại
    };

    // Hiển thị FPS (nếu bật)
    if (GameFlags.SHOW_FPS) {
        var fpsElement = null;
        setInterval(function () {
            if (fpsElement) fpsElement.innerHTML = fpsDisplayValue.toFixed(1) + "fps";
            else if (fpsElement = document.getElementById("fps")) fpsElement.style.display = ""; // Tìm và hiển thị element FPS
        }, 1000);
    }

    // Bắt đầu vòng lặp vẽ
    gameManagerInstance.startDrawLoop = function () {
        drawLoop();
    };

    // Tạo một GUID (Globally Unique Identifier)
    gameManagerInstance.getGUID = function () {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,
            function (char) {
                var randomNumber = Math.random() * 16 | 0; // Số ngẫu nhiên từ 0-15
                var value = (char == 'x' ? randomNumber : (randomNumber & 0x3 | 0x8)); // Logic tạo GUID
                return value.toString(16); // Chuyển sang hệ 16
            });
    };

    // Kiểm tra xem mod có đang được bật không
    gameManagerInstance.areModsEnabled = function () {
        return typeof ModSupport !== "undefined" ? ModSupport.currentMods && ModSupport.currentMods.length > 0 : false;
    };
})();