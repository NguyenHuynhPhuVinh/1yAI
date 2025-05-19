var SavegameConverter = {};
(function () {
    // Chuyển đổi save game từ định dạng chuẩn (desktop) sang định dạng mobile.
    SavegameConverter.toMobileFormat = function (saveGameObject) {
        // Nếu phiên bản save game không khớp với phiên bản game hiện tại, thực hiện migrate trước.
        if (saveGameObject.version != GameManager.VERSION) {
            saveGameObject = SavegameMigrator.migrate(saveGameObject);
        }
        return convertToMobile(saveGameObject);
    };

    // Hàm nội bộ thực hiện việc chuyển đổi sang định dạng mobile.
    var convertToMobile = function (saveGameObject) {
        if (!saveGameObject) return saveGameObject;

        var companyData = saveGameObject.company;
        if (companyData) {
            // Chuyển đổi 'parts' của engines thành 'partsIds'
            var enginesArray = companyData.engines;
            if (enginesArray) {
                enginesArray.forEach(function (engineObject, index, array) {
                    if (engineObject.parts) {
                        engineObject.partsIds = convertEnginePartsToIds(engineObject.parts);
                        delete engineObject.parts;
                    }
                });
            }

            // Chuyển đổi 'platforms' trong các đối tượng game thành mảng các 'id'
            convertGamePlatformsToIds(companyData.currentGame);
            var gameLogArray = companyData.gameLog;
            if (gameLogArray) {
                gameLogArray.forEach(function (gameObject, index, array) {
                    convertGamePlatformsToIds(gameObject);
                });
            }
            var trashedGamesArray = companyData.trashedGames;
            if (trashedGamesArray) {
                trashedGamesArray.forEach(function (gameObject, index, array) {
                    convertGamePlatformsToIds(gameObject);
                });
            }

            // Chuyển đổi 'engineParts' thành mảng các 'id'
            if (companyData.engineParts) {
                companyData.engineParts = convertEnginePartsToIds(companyData.engineParts);
            }

            // Chuyển đổi định dạng knowledge (combos, missionWeightings, etc.)
            if (companyData.knowledge) {
                convertKnowledgeArrayToMobileFormat(companyData.knowledge.combos);
                convertKnowledgeArrayToMobileFormat(companyData.knowledge.missionWeightings);
                convertKnowledgeArrayToMobileFormat(companyData.knowledge.platformKnowledge);
                convertKnowledgeArrayToMobileFormat(companyData.knowledge.topicKnowledge);
                convertKnowledgeArrayToMobileFormat(companyData.knowledge.trainingKnowledge);
            }

            // Chuẩn hóa 'buttonText' trong notifications thành mảng
            if (companyData.notifications) {
                companyData.notifications.forEach(function (notificationObject, index, array) {
                    normalizeNotificationButtonText(notificationObject);
                });
            }
            if (companyData.activeNotifications) {
                companyData.activeNotifications.forEach(function (notificationObject, index, array) {
                    normalizeNotificationButtonText(notificationObject);
                });
            }

            // Chuyển đổi sidebarNotifications sang định dạng mobile (sideNotifications)
            if (companyData.sidebarNotifications) {
                var sideNotificationLifetimeMs = 1000 * UI.sideBarNotificationLifeTimeInSeconds;
                companyData.sideNotifications = {};
                companyData.sideNotifications.delayedNotifications = [];
                companyData.sideNotifications.spawnedNotifications = [];
                companyData.sidebarNotifications.forEach(function (notificationObject, index, array) {
                    normalizeNotificationButtonText(notificationObject);
                    var mobileNotificationWrapper = {};
                    mobileNotificationWrapper.notification = notificationObject;
                    mobileNotificationWrapper.timeGameAtFadeInFinish = notificationObject.dismissTime - sideNotificationLifetimeMs;
                    companyData.sideNotifications.spawnedNotifications.push(mobileNotificationWrapper);
                });
                delete companyData.sidebarNotifications;
            }

            // Chuyển đổi định dạng platform (ngày tháng, icon, weightings)
            convertPlatformsToMobileFormat(companyData.licencedPlatforms);
            convertPlatformsToMobileFormat(companyData.availablePlatforms);

            // Chuyển đổi iconUri cho custom console
            if (saveGameObject.currentHwProject && saveGameObject.currentHwProject.Id === "custom console") {
                saveGameObject.currentHwProject.iconUri = "custom" + saveGameObject.currentHwProject.iconUri[38] + "v" + saveGameObject.currentHwProject.iconUri[40] + ".png";
            }

            // Chuyển đổi cấu trúc projectContractSettings
            var companyFlags = companyData.flags;
            if (companyFlags) {
                companyFlags.projectContractSettings = {};
                toMobileProjectContractSettings(companyFlags, "publisher");
                toMobileProjectContractSettings(companyFlags, "small");
                toMobileProjectContractSettings(companyFlags, "medium");
                toMobileProjectContractSettings(companyFlags, "large");
            }
        }

        // Chuyển đổi 'tests' trong findStaffData
        if (saveGameObject.uiSettings) {
            var findStaffData = saveGameObject.uiSettings.findStaffData;
            if (findStaffData && findStaffData.tests) {
                findStaffData.tests = findStaffData.tests.first(); // Chỉ lấy phần tử đầu tiên
            }
        }
        return saveGameObject;
    };

    // Hàm chuyển đổi cấu trúc projectContractSettings từ desktop sang mobile
    toMobileProjectContractSettings = function (companyFlags, contractType) {
        var contractKey = "contracts" + contractType;
        var contractData = companyFlags[contractKey];
        if (contractData) {
            companyFlags.projectContractSettings[contractKey] = contractData;
            delete companyFlags[contractKey];
        }
    };

    // Chuyển đổi chuỗi ngày "year/month/week" thành object {year, month, week}.
    var convertDateStringToDateObject = function (dateString) {
        var dateObject = {};
        if (dateString && dateString.split) {
            var dateParts = dateString.split("/");
            if (dateParts.length === 3) {
                dateObject.year = dateParts[0];
                dateObject.month = dateParts[1];
                dateObject.week = dateParts[2];
            }
        }
        return dateObject;
    };

    // Chuyển đổi định dạng các platform trong một mảng.
    var convertPlatformsToMobileFormat = function (platformsArray) {
        if (platformsArray) {
            platformsArray.forEach(function (platformObject, index, array) {
                if (platformObject.published) {
                    platformObject.published = convertDateStringToDateObject(platformObject.published);
                }
                if (platformObject.platformRetireDate) {
                    platformObject.platformRetireDate = convertDateStringToDateObject(platformObject.platformRetireDate);
                }
                if (platformObject.marketKeyPoints) {
                    convertMarketKeyPointsToMobileFormat(platformObject.marketKeyPoints);
                }
                if (platformObject.isCustom) {
                    // Chuyển đổi iconUri cho custom platform
                    platformObject.iconUri = "custom" + platformObject.iconUri[38] + "v" + platformObject.iconUri[40] + ".png";
                }
                if (platformObject.genreWeightings) {
                    platformObject.genreWeightings = convertWeightingsToMobileFormat(platformObject.genreWeightings);
                }
                if (platformObject.audienceWeightings) {
                    platformObject.audienceWeightings = convertWeightingsToMobileFormat(platformObject.audienceWeightings);
                }
            });
        }
    };

    // Chuyển đổi định dạng marketKeyPoints (ngày tháng).
    var convertMarketKeyPointsToMobileFormat = function (marketKeyPointsArray) {
        marketKeyPointsArray.forEach(function (keyPointObject, index, array) {
            if (keyPointObject && keyPointObject.date) {
                keyPointObject.date = convertDateStringToDateObject(keyPointObject.date);
            }
        });
    };

    // Chuẩn hóa buttonText của notification thành một mảng (nếu nó là string).
    var normalizeNotificationButtonText = function (notificationObject) {
        if (notificationObject && notificationObject.buttonText && typeof notificationObject.buttonText === 'string') {
            var originalButtonText = notificationObject.buttonText;
            notificationObject.buttonText = [];
            notificationObject.buttonText.push(originalButtonText);
        }
        return notificationObject;
    };

    // Chuyển đổi một mảng các engine parts thành một mảng các ID của chúng.
    var convertEnginePartsToIds = function (enginePartsArray) {
        var idsArray = [];
        enginePartsArray.forEach(function (partObject, index, array) {
            idsArray.push(partObject.id);
        });
        return idsArray;
    };

    // Chuyển đổi 'platforms' trong một đối tượng game thành mảng các 'id'.
    var convertGamePlatformsToIds = function (gameObject) {
        if (gameObject && gameObject.platforms) {
            gameObject.platforms = convertEnginePartsToIds(gameObject.platforms); // Tái sử dụng hàm vì logic tương tự
        }
        return gameObject;
    };

    // Chuyển đổi các mảng knowledge (combos, missionWeightings, etc.) sang định dạng mobile.
    var convertKnowledgeArrayToMobileFormat = function (knowledgeArray) {
        if (knowledgeArray) {
            knowledgeArray.forEach(function (knowledgeItem, index, array) {
                if (knowledgeItem.genreWeightings) {
                    knowledgeItem.genreWeightings = convertWeightingsToMobileFormat(knowledgeItem.genreWeightings);
                }
                if (knowledgeItem.audienceWeightings) {
                    knowledgeItem.audienceWeightings = convertWeightingsToMobileFormat(knowledgeItem.audienceWeightings);
                }
            });
        }
        return knowledgeArray;
    };

    // Chuyển đổi mảng weightings (ví dụ: [0.8, 0.9]) thành object {weights: [], isInit: []}.
    var convertWeightingsToMobileFormat = function (weightingsArray) {
        var mobileWeightingsObject = {};
        if (weightingsArray) {
            // Khởi tạo mảng weights và isInit
            mobileWeightingsObject.weights = [];
            mobileWeightingsObject.isInit = [];
            // Số thể loại mặc định (Action, Adventure, RPG, Simulation, Strategy, Casual, Visual Novel, Sandbox, MOBA, Battle Royale, Racing)
            var expectedGenreCount = 11;
            // Copy các giá trị từ mảng gốc
            weightingsArray.forEach(function (weightValue, index, array) {
                mobileWeightingsObject.weights.push(weightValue);
                mobileWeightingsObject.isInit.push(true); // Mặc định là đã khởi tạo
            });
            // Đảm bảo mảng có đủ 11 phần tử cho tất cả các thể loại
            while (mobileWeightingsObject.weights.length < expectedGenreCount) {
                mobileWeightingsObject.weights.push(0.7); // Giá trị mặc định cho các thể loại mới
                mobileWeightingsObject.isInit.push(true);
            }
        }
        return mobileWeightingsObject;
    };

    // Chuyển đổi save game từ định dạng mobile sang định dạng chuẩn (desktop).
    SavegameConverter.fromMobileFormat = function (saveGameObject) {
        if (!saveGameObject) return saveGameObject;

        var companyData = saveGameObject.company;
        if (companyData) {
            // Chuyển đổi 'partsIds' của engines thành 'parts'
            var enginesArray = companyData.engines;
            if (enginesArray) {
                enginesArray.forEach(function (engineObject, index, array) {
                    if (engineObject.partsIds) {
                        engineObject.parts = convertIdsToEngineParts(engineObject.partsIds);
                        delete engineObject.partsIds;
                    }
                });
            }

            // Chuyển đổi mảng 'id' của platforms trong game thành mảng các đối tượng platform đầy đủ
            convertGamePlatformIdsToObjects(companyData.currentGame);
            var gameLogArray = companyData.gameLog;
            if (gameLogArray) {
                gameLogArray.forEach(function (gameObject, index, array) {
                    convertGamePlatformIdsToObjects(gameObject);
                });
            }
            var trashedGamesArray = companyData.trashedGames;
            if (trashedGamesArray) {
                trashedGamesArray.forEach(function (gameObject, index, array) {
                    convertGamePlatformIdsToObjects(gameObject);
                });
            }

            // Chuyển đổi mảng 'id' của engineParts thành mảng đối tượng engine part đầy đủ
            if (companyData.engineParts) {
                companyData.engineParts = convertIdsToEngineParts(companyData.engineParts);
            }

            // Chuyển đổi định dạng knowledge trở lại
            if (companyData.knowledge) {
                convertMobileKnowledgeArrayToDesktopFormat(companyData.knowledge.combos);
                convertMobileKnowledgeArrayToDesktopFormat(companyData.knowledge.missionWeightings);
                convertMobileKnowledgeArrayToDesktopFormat(companyData.knowledge.platformKnowledge);
                convertMobileKnowledgeArrayToDesktopFormat(companyData.knowledge.topicKnowledge);
                convertMobileKnowledgeArrayToDesktopFormat(companyData.knowledge.trainingKnowledge);
            }

            // Chuẩn hóa 'buttonText' trong notifications (nếu chỉ có 1 phần tử thì lấy string)
            if (companyData.notifications) {
                companyData.notifications.forEach(function (notificationObject, index, array) {
                    standardizeNotificationButtonText(notificationObject);
                });
            }
            if (companyData.activeNotifications) {
                companyData.activeNotifications.forEach(function (notificationObject, index, array) {
                    standardizeNotificationButtonText(notificationObject);
                });
            }

            // Chuyển đổi sideNotifications (mobile) thành sidebarNotifications (desktop)
            var sideNotificationLifetimeMs = 1000 * UI.sideBarNotificationLifeTimeInSeconds;
            companyData.sidebarNotifications = [];
            var sideNotificationsData = companyData.sideNotifications;
            if (sideNotificationsData && sideNotificationsData.spawnedNotifications) {
                sideNotificationsData.spawnedNotifications.forEach(function (mobileNotificationWrapper, index, array) {
                    var desktopNotification = standardizeNotificationButtonText(mobileNotificationWrapper.notification);
                    if (desktopNotification.isMandatory) { // Giả sử có trường này để quyết định
                        companyData.activeNotifications.push(desktopNotification);
                    } else {
                        companyData.sidebarNotifications.push(desktopNotification);
                        mobileNotificationWrapper.notification.dismissTime = mobileNotificationWrapper.timeGameAtFadeInFinish + sideNotificationLifetimeMs;
                    }
                });
            }
            if (sideNotificationsData && sideNotificationsData.delayedNotifications) {
                sideNotificationsData.delayedNotifications.forEach(function (mobileNotification, index, array) {
                    companyData.sidebarNotifications.push(standardizeNotificationButtonText(mobileNotification));
                    mobileNotification.dismissTime = saveGameObject.gameTime + sideNotificationLifetimeMs; // Giả sử gameTime có sẵn
                });
            }
            delete companyData.sideNotifications;

            // Chuyển đổi sex và state của staff từ số sang chuỗi
            var staffArray = companyData.staff;
            if (staffArray) {
                staffArray.forEach(function (staffMember, index, array) {
                    if (isNumeric(staffMember.sex)) {
                        staffMember.sex = characterSexMap[staffMember.sex];
                    }
                    if (isNumeric(staffMember.state)) {
                        staffMember.state = characterStateMap[staffMember.state];
                    }
                });
            }
            // Đảm bảo alpha của visualData cho hwCrew và rndCrew là 1
            if (companyData.hwCrew) {
                companyData.hwCrew.forEach(function (crewMember) {
                    if (crewMember.visualData) crewMember.visualData.alpha = 1;
                });
            }
            if (companyData.rndCrew) {
                companyData.rndCrew.forEach(function (crewMember) {
                    if (crewMember.visualData) crewMember.visualData.alpha = 1;
                });
            }


            // Chuyển đổi định dạng platform (ngày tháng, icon, weightings) trở lại
            convertMobilePlatformsToDesktopFormat(companyData.licencedPlatforms);
            convertMobilePlatformsToDesktopFormat(companyData.availablePlatforms);

            // Chuyển đổi iconUri cho custom console trở lại
            if (saveGameObject.currentHwProject && saveGameObject.currentHwProject.Id === "custom console") {
                saveGameObject.currentHwProject.iconUri = convertMobileIconUriToDesktop(saveGameObject.currentHwProject.iconUri);
            }

            // Chuyển đổi cấu trúc projectContractSettings trở lại
            var companyFlags = companyData.flags;
            if (companyFlags) {
                fromMobileProjectContractSettings(companyFlags, "publisher");
                fromMobileProjectContractSettings(companyFlags, "small");
                fromMobileProjectContractSettings(companyFlags, "medium");
                fromMobileProjectContractSettings(companyFlags, "large");
                if (companyFlags.projectContractSettings) {
                    delete companyFlags.projectContractSettings;
                }
            }
        }

        // Chuyển đổi state của save game từ số sang chuỗi
        if (isNumeric(saveGameObject.state)) {
            saveGameObject.state = gameStateMap[saveGameObject.state];
        }

        // Chuyển đổi 'tests' trong findStaffData thành mảng (nếu nó là string)
        if (saveGameObject.uiSettings) {
            var findStaffData = saveGameObject.uiSettings.findStaffData;
            if (findStaffData && findStaffData.tests && typeof findStaffData.tests === 'string') {
                var testsArray = [];
                testsArray.push(findStaffData.tests);
                findStaffData.tests = testsArray;
            }
        }
        return saveGameObject;
    };

    // Hàm chuyển đổi cấu trúc projectContractSettings từ mobile sang desktop
    fromMobileProjectContractSettings = function (companyFlags, contractType) {
        var contractKey = "contracts" + contractType;
        var projectSettings = companyFlags.projectContractSettings;
        if (projectSettings) {
            var contractData = projectSettings[contractKey];
            if (contractData) {
                companyFlags[contractKey] = contractData;
            }
        }
    };

    // Chuyển đổi định dạng các platform trong một mảng từ mobile sang desktop.
    var convertMobilePlatformsToDesktopFormat = function (platformsArray) {
        if (platformsArray) {
            platformsArray.forEach(function (platformObject, index, array) {
                if (platformObject) {
                    if (platformObject.published) {
                        platformObject.published = convertDateObjectToDateString(platformObject.published);
                    }
                    if (platformObject.platformRetireDate) {
                        platformObject.platformRetireDate = convertDateObjectToDateString(platformObject.platformRetireDate);
                    }
                    if (platformObject.marketKeyPoints) {
                        convertMobileMarketKeyPointsToDesktopFormat(platformObject.marketKeyPoints);
                    }
                    if (platformObject.isCustom) {
                        platformObject.iconUri = convertMobileIconUriToDesktop(platformObject.iconUri);
                    }
                    if (platformObject.genreWeightings) {
                        platformObject.genreWeightings = convertMobileWeightingsToDesktopFormat(platformObject.genreWeightings);
                    }
                    if (platformObject.audienceWeightings) {
                        platformObject.audienceWeightings = convertMobileWeightingsToDesktopFormat(platformObject.audienceWeightings);
                    }
                }
            });
        }
    };

    // Chuyển đổi iconUri từ định dạng mobile ("custom<số>v<số>.png") sang desktop.
    var convertMobileIconUriToDesktop = function (mobileIconUri) {
        // Ví dụ: "custom1v2.png" -> "images/platforms/superb/CustomPlatform1V2.png"
        return "images/platforms/superb/CustomPlatform" + mobileIconUri[6] + "V" + mobileIconUri[8] + ".png";
    };

    // Chuyển đổi định dạng marketKeyPoints (ngày tháng) từ mobile sang desktop.
    var convertMobileMarketKeyPointsToDesktopFormat = function (marketKeyPointsArray) {
        marketKeyPointsArray.forEach(function (keyPointObject, index, array) {
            if (keyPointObject && keyPointObject.date) {
                keyPointObject.date = convertDateObjectToDateString(keyPointObject.date);
            }
        });
    };

    // Chuyển đổi object ngày {year, month, week} thành chuỗi "year/month/week".
    var convertDateObjectToDateString = function (dateObject) {
        return dateObject.year + "/" + dateObject.month + "/" + dateObject.week;
    };

    // Kiểm tra một giá trị có phải là số và có thể là index của enum không.
    var isNumeric = function (value) {
        return value != null && typeof value !== 'undefined' && !isNaN(parseFloat(value)) && isFinite(value);
    };

    // Maps để chuyển đổi giá trị enum từ số sang chuỗi.
    var characterStateMap = {
        0: "Idle",
        1: "Working",
        2: "Researching",
        3: "CreateEngine",
        4: "WorkOnContract",
        5: "Training",
        6: "Vacation"
    };
    var characterSexMap = {
        0: "male",
        1: "female"
    };
    var gameStateMap = {
        0: "GameStarting",
        1: "Idle",
        2: "CreateGame",
        3: "GameDefinition",
        4: "PickWorkItems",
        5: "ExecuteWorkItems",
        6: "ReleaseGame"
    };

    // Chuyển đổi một mảng các ID thành một mảng các đối tượng engine part (chỉ chứa ID).
    var convertIdsToEngineParts = function (idsArray) {
        var enginePartsArray = [];
        idsArray.forEach(function (partId, index, array) {
            var partObject = {};
            partObject.id = partId;
            enginePartsArray.push(partObject);
        });
        return enginePartsArray;
    };

    // Chuyển đổi mảng 'id' của platforms trong game thành mảng đối tượng platform (chỉ chứa ID).
    var convertGamePlatformIdsToObjects = function (gameObject) {
        if (gameObject && gameObject.platforms) {
            gameObject.platforms = convertIdsToEngineParts(gameObject.platforms); // Tái sử dụng
        }
        return gameObject;
    };

    // Chuyển đổi các mảng knowledge từ định dạng mobile sang desktop.
    var convertMobileKnowledgeArrayToDesktopFormat = function (knowledgeArray) {
        if (knowledgeArray) {
            knowledgeArray.forEach(function (knowledgeItem, index, array) {
                if (knowledgeItem.genreWeightings) {
                    knowledgeItem.genreWeightings = convertMobileWeightingsToDesktopFormat(knowledgeItem.genreWeightings);
                }
                if (knowledgeItem.audienceWeightings) {
                    knowledgeItem.audienceWeightings = convertMobileWeightingsToDesktopFormat(knowledgeItem.audienceWeightings);
                }
            });
        }
        return knowledgeArray;
    };

    // Chuyển đổi object weightings từ mobile ({weights: [], isInit: []}) thành mảng weightings desktop.
    var convertMobileWeightingsToDesktopFormat = function (mobileWeightingsObject) {
        var desktopWeightingsArray = [];
        if (mobileWeightingsObject && mobileWeightingsObject.weights && mobileWeightingsObject.isInit) {
            // Số thể loại mặc định (Action, Adventure, RPG, Simulation, Strategy, Casual, Visual Novel, Sandbox, MOBA, Battle Royale, Racing)
            var expectedGenreCount = 11;
            // Copy các giá trị từ mảng gốc nếu isInit là true
            mobileWeightingsObject.weights.forEach(function (weightValue, index, array) {
                if (index < mobileWeightingsObject.isInit.length && mobileWeightingsObject.isInit[index]) {
                    desktopWeightingsArray.push(weightValue);
                }
            });
            // Đảm bảo mảng có đủ 11 phần tử cho tất cả các thể loại
            while (desktopWeightingsArray.length < expectedGenreCount) {
                desktopWeightingsArray.push(0.7); // Giá trị mặc định cho các thể loại mới
            }
        }
        return desktopWeightingsArray;
    };

    // Chuẩn hóa buttonText của notification: nếu là mảng 1 phần tử thì lấy string, nếu không có ID thì tạo GUID.
    var standardizeNotificationButtonText = function (notificationObject) {
        if (notificationObject) {
            if (notificationObject.buttonText && notificationObject.buttonText.length <= 1) {
                notificationObject.buttonText = notificationObject.buttonText[0];
            }
            if (!notificationObject.id) {
                notificationObject.id = GameManager.getGUID(); // Giả sử có hàm này
            }
        }
        return notificationObject;
    };
})();