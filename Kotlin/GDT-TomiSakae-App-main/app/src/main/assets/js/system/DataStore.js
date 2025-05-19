// --- START OF FILE DataStore.js ---

var DataStore = {}; // Đối tượng toàn cục để quản lý lưu trữ dữ liệu
SaveMismatchStrategy = { // Enum định nghĩa các chiến lược xử lý khi dữ liệu local và cloud không khớp
    AskPlayer: "AskPlayer",
    UseLocal: "UseLocal",
    UseCloud: "UseCloud"
};

(function () {
    // ------------------- Default/Fallback DataStore Implementation -------------------
    // Đây là một triển khai mặc định, không thực hiện hành động lưu trữ nào.
    // Nó sẽ được ghi đè bởi các triển khai cụ thể cho từng nền tảng.
    var fallbackDataStore = {};
    (function () {
        fallbackDataStore.setValue = function (key, value) { /* no-op */ };
        fallbackDataStore.getValue = function (key) {
            return null;
        };
        fallbackDataStore.saveToSlotAsync = function (slotName, data, successCallback, errorCallback) {
            if (successCallback) successCallback(); // Gọi callback thành công ngay lập tức
        };
        fallbackDataStore.loadSlotAsync = function (slotName, successCallback, errorCallback) {
            if (errorCallback) errorCallback("Fallback DataStore has no data."); // Gọi callback lỗi nếu có
        };
        fallbackDataStore.saveCanvasToFile = function (canvasElement, fileName, successCallback, errorCallback) {
            if (errorCallback) errorCallback("Canvas saving not supported by Fallback DataStore.");
        };
    })();

    // ------------------- Windows Store DataStore Implementation -------------------
    if (PlatformShim.ISWIN8) {
        var winStoreDataStore = {};
        (function () {
            var appDataRoamingSettings = Windows.Storage.ApplicationData.current.roamingSettings;
            var appDataRoamingFolder = Windows.Storage.ApplicationData.current.roamingFolder;

            winStoreDataStore.setValue = function (key, value) {
                appDataRoamingSettings.values[key] = value;
            };

            winStoreDataStore.getValue = function (key) {
                return appDataRoamingSettings.values[key];
            };

            // Hàm băm dữ liệu để kiểm tra tính toàn vẹn
            var generateHash = function (dataString) {
                var hashAlgorithmProvider = Windows.Security.Cryptography.Core.HashAlgorithmProvider.openAlgorithm("SHA256");
                var binaryData = Windows.Security.Cryptography.CryptographicBuffer.convertStringToBinary(dataString, Windows.Security.Cryptography.BinaryStringEncoding.utf8);
                var hashedBuffer = hashAlgorithmProvider.hashData(binaryData);
                return Windows.Security.Cryptography.CryptographicBuffer.encodeToHexString(hashedBuffer);
            };

            winStoreDataStore.saveToSlotAsync = function (slotName, dataString, successCallback, errorCallback) {
                appDataRoamingFolder.createFileAsync(slotName, Windows.Storage.CreationCollisionOption.replaceExisting)
                    .then(function (file) {
                        Windows.Storage.FileIO.writeTextAsync(file, dataString)
                            .then(function () {
                                try {
                                    var fileHash = generateHash(dataString);
                                    DataStore.setValue("hash" + slotName, fileHash); // Lưu hash để kiểm tra khi load
                                } catch (hashError) {
                                    Logger.LogInfo("hash save failed", hashError);
                                }
                                DataStore.saveSettings(); // Có thể đây là hàm lưu các cài đặt chung của DataStore
                                if (successCallback) successCallback();
                            }, function (writeError) {
                                ghg4.ghg5("save-error", { // ghg4 có vẻ là một module analytics
                                    method: "writeTextAsync",
                                    "error-nr": writeError ? writeError.number : null
                                });
                                if (errorCallback) errorCallback(writeError);
                            });
                    }, function (createFileError) {
                        ghg4.ghg5("save-error", {
                            method: "createFileAsync",
                            "error-nr": createFileError ? createFileError.number : null
                        });
                        if (errorCallback) errorCallback(createFileError);
                    });
            };

            winStoreDataStore.loadSlotAsync = function (slotName, successCallback, errorCallback) {
                appDataRoamingFolder.getFileAsync(slotName)
                    .then(function (file) {
                        if (!file && errorCallback) {
                            errorCallback("File not found for slot: " + slotName);
                            return; // Thoát sớm nếu không tìm thấy file
                        }
                        Windows.Storage.FileIO.readTextAsync(file)
                            .then(function (dataString) {
                                var storedHash, currentHash;
                                try {
                                    storedHash = DataStore.getValue("hash" + slotName);
                                    if (storedHash) { // Chỉ băm nếu có hash đã lưu
                                        currentHash = generateHash(dataString);
                                    }
                                } catch (hashLoadError) {
                                    Logger.LogInfo("hash load failed", hashLoadError);
                                }

                                if (!storedHash || storedHash === currentHash || DataStore.remoteSettings.ignoreHashMismatch) {
                                    if (successCallback) successCallback(dataString);
                                } else {
                                    ghg4.ghg5("load game error", {
                                        reason: "hash mismatch"
                                    });
                                    if (errorCallback) errorCallback("save file corrupt");
                                }
                            }, errorCallback);
                    }, errorCallback);
            };

            // Hàm lưu canvas thành file (chỉ cho Windows Store)
            var saveCanvasToFileWinStore = function (canvasElement, file, successCallback, errorCallback) {
                var blob = canvasElement.msToBlob();
                var inputStream = blob.msDetachStream().getInputStreamAt(0);
                file.openAsync(Windows.Storage.FileAccessMode.readWrite)
                    .then(function (outputStream) {
                        return Windows.Storage.Streams.RandomAccessStream.copyAsync(inputStream, outputStream)
                            .then(function () {
                                return outputStream.flushAsync().then(function () {
                                    outputStream.close();
                                    inputStream.close();
                                    blob.msClose();
                                    if (successCallback) successCallback();
                                }, errorCallback);
                            }, errorCallback);
                    }, errorCallback);
            };

            winStoreDataStore.saveCanvasToFile = function (canvasElement, fileName, successCallback, errorCallback) {
                Windows.Storage.ApplicationData.current.localFolder.createFileAsync(fileName, Windows.Storage.CreationCollisionOption.replaceExisting)
                    .then(function (file) {
                        saveCanvasToFileWinStore(canvasElement, file, successCallback, errorCallback);
                    }, errorCallback);
            };
        })();
        DataStore = winStoreDataStore; // Ghi đè DataStore mặc định bằng triển khai cho Windows Store
    } else { // Nếu không phải Windows Store, sử dụng LocalStorage
        var localStorageAvailable;
        try {
            localStorageAvailable = "localStorage" in window && window.localStorage !== null;
        } catch (checkLocalStorageError) {
            Logger.LogInfo("local storage check failed", checkLocalStorageError);
            localStorageAvailable = false;
        }

        if (localStorageAvailable) {
            var localStorageDataStore = {};
            (function () {
                localStorageDataStore.setValue = function (key, value) {
                    window.localStorage.setItem(key, value);
                };
                localStorageDataStore.getValue = function (key) {
                    return window.localStorage.getItem(key);
                };
                localStorageDataStore.saveToSlotAsync = function (slotName, dataString, successCallback, errorCallback) {
                    try {
                        localStorageDataStore.setValue("slot_" + slotName, dataString);
                    } catch (saveError) {
                        Logger.LogWarning("Save failed", saveError, "Save failed".localize());
                        if (errorCallback) errorCallback(saveError);
                        return;
                    }
                    if (successCallback) successCallback();
                };
                localStorageDataStore.loadSlotAsync = function (slotName, successCallback, errorCallback) {
                    try {
                        if (successCallback) successCallback(localStorageDataStore.getValue("slot_" + slotName));
                    } catch (loadError) {
                        Logger.LogWarning("Load failed", loadError, "Load failed".localize());
                        if (errorCallback) errorCallback(loadError);
                    }
                };
                localStorageDataStore.saveCanvasToFile = function (canvasElement, fileName, successCallback, errorCallback) {
                    // LocalStorage không hỗ trợ lưu file canvas trực tiếp như Windows Store
                    if (errorCallback) errorCallback("Canvas saving to file not supported by LocalStorage DataStore.");
                };
            })();
            DataStore = localStorageDataStore; // Ghi đè DataStore bằng triển khai LocalStorage

            // ------------------- Steam Cloud DataStore Implementation (nếu có) -------------------
            // Ghi đè DataStore của LocalStorage nếu Steam API khả dụng
            if (Steam && Steam.isAvailable && Steam.isAvailable()) {
                var steamCloudDataStore = {};
                (function () {
                    // Hàm trợ giúp để load knowledge, kết hợp local và cloud
                    function loadKnowledgeAndMerge(slotName, steamFileName, successCallback, errorCallback) {
                        localStorageDataStore.loadSlotAsync(slotName, function (localData) {
                            Steam.readTextFromFile(steamFileName, function (cloudData) {
                                if (successCallback) successCallback(Knowledge.merge(localData, cloudData)); // Giả sử có hàm Knowledge.merge
                            }, function (steamReadError) { // Lỗi đọc từ Steam, chỉ dùng local
                                if (successCallback) successCallback(localData);
                            });
                        }, function (localReadError) { // Lỗi đọc từ local, thử đọc từ Steam
                            Steam.readTextFromFile(steamFileName, successCallback, errorCallback);
                        });
                    }

                    var generalSettingsLocal = localStorageDataStore.getValue("general");
                    generalSettingsLocal = generalSettingsLocal ? JSON.parse(generalSettingsLocal) : { version: 1 };
                    localStorageDataStore.setValue("general", JSON.stringify(generalSettingsLocal));

                    var generalSettingsChanged = false;
                    var generalSettingsCloud; // Dữ liệu general từ Steam Cloud

                    steamCloudDataStore.setValue = function (key, value) {
                        generalSettingsLocal[key] = value;
                        generalSettingsLocal.version++;
                        if (generalSettingsCloud) {
                            generalSettingsCloud[key] = value;
                            generalSettingsCloud.version++;
                        }
                        if (localStorageDataStore) localStorageDataStore.setValue(key, value); // Vẫn lưu vào localStorage
                        generalSettingsChanged = true;
                    };

                    steamCloudDataStore.getValue = function (key, defaultValue) {
                        // Ưu tiên cloud nếu version cao hơn
                        if (generalSettingsCloud && generalSettingsCloud.version && generalSettingsCloud.version > generalSettingsLocal.version && generalSettingsCloud[key]) {
                            return generalSettingsCloud[key];
                        }
                        if (generalSettingsLocal[key]) {
                            return generalSettingsLocal[key];
                        }
                        return localStorageDataStore.getValue(key); // Fallback về localStorage trực tiếp
                    };

                    // Hàm đồng bộ dữ liệu header của save slot (auto, 1, 2, 3, 4, 5)
                    var syncSaveSlotHeader = function (slotPrefix) {
                        if (!generalSettingsLocal[slotPrefix] && generalSettingsCloud && generalSettingsCloud[slotPrefix]) {
                            generalSettingsLocal[slotPrefix] = generalSettingsCloud[slotPrefix];
                        }
                        // Đồng bộ cho các level con (L1, L2, ...) nếu có
                        for (var i = 1; i <= 5; i++) {
                            var levelSlotKey = slotPrefix + "L" + i;
                            if (!generalSettingsLocal[levelSlotKey] && generalSettingsCloud && generalSettingsCloud[levelSlotKey]) {
                                generalSettingsLocal[levelSlotKey] = generalSettingsCloud[levelSlotKey];
                            }
                        }
                    };

                    steamCloudDataStore.init = function (callback) {
                        Steam.readTextFromFile("general", function (cloudDataString) {
                            try {
                                generalSettingsCloud = JSON.parse(cloudDataString);
                                if (generalSettingsCloud && generalSettingsCloud.version && generalSettingsCloud.version !== generalSettingsLocal.version) {
                                    // Nếu version cloud khác local, có thể cần đồng bộ hoặc hỏi người dùng
                                    // Ở đây có vẻ như nó đang khởi tạo lại settings nếu version cloud khác
                                    DataStore.initSettings();       // Hàm này sẽ đọc từ generalSettingsLocal/generalSettingsCloud
                                    DataStore.initRemoteSettings(); // Tương tự
                                    generalSettingsChanged = false; // Reset cờ thay đổi
                                }
                                if (generalSettingsCloud) { // Đồng bộ các header của save slot
                                    syncSaveSlotHeader("auto");
                                    syncSaveSlotHeader("1");
                                    syncSaveSlotHeader("2");
                                    syncSaveSlotHeader("3");
                                    syncSaveSlotHeader("4");
                                    syncSaveSlotHeader("5");
                                }
                            } catch (parseError) {
                                Logger.LogWarning("Could not load settings from steam cloud", parseError, "Could not load settings from steam cloud".localize());
                            }
                            if (callback) callback();
                        }, function (steamReadError) {
                            if (callback) callback();
                            Logger.LogWarning("Could not load settings from steam cloud", steamReadError, "Could not load settings from steam cloud".localize());
                        });
                    };

                    steamCloudDataStore.commit = function (successCallback, errorCallback) {
                        if (generalSettingsChanged) {
                            try {
                                var generalSettingsString = JSON.stringify(generalSettingsLocal);
                                localStorageDataStore.setValue("general", generalSettingsString); // Lưu lại vào localStorage
                                Steam.saveTextToFile("general", generalSettingsString, function () {
                                    generalSettingsChanged = false;
                                    if (successCallback) successCallback();
                                }, function (steamSaveError) {
                                    Logger.LogWarning("Could not save settings to steam cloud", steamSaveError, "Could not save settings to steam cloud".localize());
                                    // Có thể vẫn gọi successCallback vì đã lưu local thành công
                                    if (errorCallback) errorCallback(steamSaveError); else if (successCallback) successCallback();
                                });
                            } catch (commitError) {
                                Logger.LogWarning("Could not save settings to steam cloud", commitError, "Could not save settings to steam cloud".localize());
                                if (errorCallback) errorCallback(commitError);
                            }
                        } else {
                            if (successCallback) successCallback();
                        }
                    };

                    steamCloudDataStore.saveToSlotAsync = function (slotName, dataString, successCallback, errorCallback) {
                        var steamFileName = "slot_" + slotName;
                        localStorageDataStore.saveToSlotAsync(slotName, dataString); // Luôn lưu vào local trước
                        if (dataString === "") { // Nếu là xóa slot
                            if (successCallback) successCallback();
                        } else {
                            Steam.saveTextToFile(steamFileName, dataString, successCallback, function (steamSaveError) {
                                Logger.LogWarning("Could not save to steam cloud", steamSaveError, "Could not save to steam cloud".localize());
                                // Có thể vẫn gọi successCallback vì đã lưu local thành công
                                if (errorCallback) errorCallback(steamSaveError); else if (successCallback) successCallback();
                            });
                        }
                    };

                    // Hàm hiển thị dialog khi có sự khác biệt giữa save local và cloud
                    var showCloudConflictDialog = function (slotName, successCallback, errorCallback, steamFileName, cloudSaveHeader, localSaveHeader, loadOptions) {
                        var conflictDialogContent = $("#loadViewContent"); // Giả sử đây là container cho dialog
                        conflictDialogContent.empty();
                        conflictDialogContent.append($("<small></small>").text("Your local save game seems to be different from the one stored in the Steam Cloud. Which one would you like to load?".localize()));

                        var dummyCompany = new Company("x"); // Dùng để render UI save game

                        // Render save game từ Cloud
                        if (cloudSaveHeader.date) cloudSaveHeader.saveTime = cloudSaveHeader.date;
                        if (cloudSaveHeader.name) cloudSaveHeader.companyName = cloudSaveHeader.name;
                        cloudSaveHeader.slot = slotName;
                        var cloudSaveElement = UI._getElementForSaveGame(cloudSaveHeader, dummyCompany); // Giả sử có hàm UI._getElementForSaveGame
                        cloudSaveElement.find(".saveGameLocation").text("Cloud".localize("savegame"));
                        cloudSaveElement.find(".saveSlotOptions").remove();
                        conflictDialogContent.append(cloudSaveElement);
                        cloudSaveElement.get(0).onclick = function () {
                            Sound.click();
                            if (loadOptions) loadOptions.chosenMismatchStrategy = SaveMismatchStrategy.UseCloud;
                            Steam.readTextFromFile(steamFileName, successCallback, function (steamLoadError) {
                                Logger.LogWarning("Could not load from steam cloud", steamLoadError, "Could not load from steam cloud".localize());
                                // Thất bại load từ cloud, thử lại từ local
                                localStorageDataStore.loadSlotAsync(slotName, successCallback, errorCallback);
                            });
                            UI.closeAllLoadSaveViews(); // Giả sử có hàm này
                        };

                        // Render save game từ Local
                        if (localSaveHeader.date) localSaveHeader.saveTime = localSaveHeader.date;
                        if (localSaveHeader.name) localSaveHeader.companyName = localSaveHeader.name;
                        localSaveHeader.slot = slotName;
                        var localSaveElement = UI._getElementForSaveGame(localSaveHeader, dummyCompany);
                        localSaveElement.find(".saveGameLocation").text("Local".localize("savegame"));
                        localSaveElement.find(".saveSlotOptions").remove();
                        conflictDialogContent.append(localSaveElement);
                        localSaveElement.get(0).onclick = function () {
                            Sound.click();
                            if (loadOptions) loadOptions.chosenMismatchStrategy = SaveMismatchStrategy.UseLocal;
                            localStorageDataStore.loadSlotAsync(slotName, successCallback, errorCallback);
                            UI.closeAllLoadSaveViews();
                        };

                        conflictDialogContent.append($("<small></small>").text("Note: Once you save the game, the new save file will be stored both locally and on the Cloud unless you disable the Steam Cloud through Steam.".localize()));

                        UI.closeAllLoadSaveViews();
                        GameManager.pause(true); // Tạm dừng game
                        GameManager.loadScreenOpened = true; // Đánh dấu màn hình load đang mở
                        $("#loadView").dialog({ // Hiển thị dialog (jQuery UI Dialog)
                            width: 630,
                            draggable: false,
                            modal: true,
                            resizable: false,
                            show: "fade",
                            zIndex: 6800,
                            open: function () {
                                var closeButton = $(UI.closeButtonTemplate);
                                closeButton.zIndex = 6900;
                                closeButton.clickExclOnce(function () {
                                    Sound.click();
                                    $("#loadView").dialog("close");
                                    GameManager.resume(true);
                                });
                                $(this).siblings(".ui-dialog-titlebar").remove();
                                $(this).parents(".ui-dialog:first").addClass("tallWindow windowBorder").removeClass("ui-widget-content");
                            },
                            close: function () {
                                $(this).dialog("destroy");
                                this.style.cssText = "display:none;";
                                GameManager.resume(true);
                            }
                        });
                    };

                    steamCloudDataStore.loadSlotAsync = function (slotName, successCallback, errorCallback, loadOptions) {
                        var steamFileName = "slot_" + slotName;
                        try {
                            if (slotName === "knowledge") { // Trường hợp đặc biệt cho "knowledge"
                                loadKnowledgeAndMerge(slotName, steamFileName, successCallback, errorCallback);
                            } else if (generalSettingsLocal[slotName] || (generalSettingsCloud && generalSettingsCloud[slotName])) {
                                // Kiểm tra sự khác biệt giữa local và cloud nếu cả hai đều tồn tại
                                var localHeaderString = generalSettingsLocal[slotName];
                                var cloudHeaderString = generalSettingsCloud ? generalSettingsCloud[slotName] : null;

                                if (localHeaderString && cloudHeaderString &&
                                    Date.parse(JSON.parse(localHeaderString).date) !== Date.parse(JSON.parse(cloudHeaderString).date)) {
                                    var strategy = SaveMismatchStrategy.AskPlayer;
                                    if (loadOptions && loadOptions.mismatchStrategy) {
                                        strategy = loadOptions.mismatchStrategy;
                                    }

                                    if (strategy === SaveMismatchStrategy.UseLocal) {
                                        localStorageDataStore.loadSlotAsync(slotName, successCallback, errorCallback);
                                    } else if (strategy === SaveMismatchStrategy.UseCloud) {
                                        Steam.readTextFromFile(steamFileName, successCallback, function (steamLoadError) {
                                            Logger.LogWarning("Could not load from steam cloud", steamLoadError, "Could not load from steam cloud".localize());
                                            localStorageDataStore.loadSlotAsync(slotName, successCallback, errorCallback); // Fallback to local
                                        });
                                    } else { // AskPlayer
                                        var cloudSaveHeader = JSON.parse(cloudHeaderString);
                                        var localSaveHeader = JSON.parse(localHeaderString);
                                        showCloudConflictDialog(slotName, successCallback, errorCallback, steamFileName, cloudSaveHeader, localSaveHeader, loadOptions);
                                    }
                                } else { // Không có xung đột hoặc chỉ có 1 bản
                                    Steam.readTextFromFile(steamFileName, successCallback, function (steamLoadError) {
                                        Logger.LogWarning("Could not load from steam cloud", steamLoadError, "Could not load from steam cloud".localize());
                                        localStorageDataStore.loadSlotAsync(slotName, successCallback, errorCallback); // Fallback to local
                                    });
                                }
                            } else { // Chỉ có bản local hoặc không có bản nào
                                localStorageDataStore.loadSlotAsync(slotName, successCallback, errorCallback);
                            }
                        } catch (outerError) { // Lỗi không mong muốn, thử load từ Steam Cloud
                            Steam.readTextFromFile(steamFileName, successCallback, function (steamLoadErrorFallback) {
                                Logger.LogWarning("Could not load from steam cloud", steamLoadErrorFallback, "Could not load from steam cloud".localize());
                                localStorageDataStore.loadSlotAsync(slotName, successCallback, errorCallback); // Fallback to local
                            });
                        }
                    };

                    steamCloudDataStore.saveCanvasToFile = function (canvasElement, fileName, successCallback, errorCallback) {
                        // Steam Cloud không hỗ trợ lưu file canvas trực tiếp như Windows Store
                        if (errorCallback) errorCallback("Canvas saving to file not supported by SteamCloud DataStore.");
                    };
                })();
                DataStore = steamCloudDataStore; // Ghi đè DataStore bằng triển khai Steam Cloud
            }
        } else { // Không có LocalStorage, sử dụng fallback
            DataStore = fallbackDataStore;
        }
    }

    // ------------------- Các Hàm Khởi Tạo và Quản Lý Settings Chung -------------------
    DataStore.initSettings = function () {
        var settingsString = DataStore.getValue("settings");
        var parsedSettings = settingsString ? JSON.parse(settingsString) : {};
        DataStore.settings = parsedSettings;
    };
    DataStore.initSettings(); // Gọi ngay khi DataStore được định nghĩa

    DataStore.getAchievements = function () {
        if (!DataStore.settings.achievements) {
            DataStore.settings.achievements = {};
        }
        var achievementsData = DataStore.settings.achievements;
        if (!achievementsData.achieved) {
            achievementsData.achieved = [];
        }
        return achievementsData;
    };

    DataStore.getTutorialSettings = function () {
        var tutorialSettings = DataStore.settings.tutorialSettings;
        if (!tutorialSettings) {
            tutorialSettings = { "tutorials-shown": [] };
            DataStore.settings.tutorialSettings = tutorialSettings;
        }
        return tutorialSettings;
    };

    DataStore.getMessageSettings = function () {
        var messageSettings = DataStore.settings.messageSettings;
        if (!messageSettings) {
            messageSettings = {};
            DataStore.settings.messageSettings = messageSettings;
        }
        return messageSettings;
    };

    DataStore.saveSettings = function () {
        try {
            DataStore.setValue("settings", JSON.stringify(DataStore.settings));
        } catch (saveError) {
            Logger.LogWarning("Could not save settings", saveError, "Could not save settings".localize());
        }
    };

    // Khởi tạo remote settings (có thể dùng để bật/tắt feature từ xa)
    DataStore.initRemoteSettings = function () {
        var remoteSettingsString = DataStore.getValue("remote-settings");
        var parsedRemoteSettings;
        if (remoteSettingsString) {
            try {
                parsedRemoteSettings = JSON.parse(remoteSettingsString);
            } catch (parseError) {
                parsedRemoteSettings = null;
            }
        }
        if (!parsedRemoteSettings) { // Giá trị mặc định nếu không load được
            parsedRemoteSettings = {
                id: 3,
                supporterPacksEnabled: false,
                ignoreHashMismatch: true, // Bỏ qua kiểm tra hash khi load game (quan trọng cho Windows Store)
                enableSteamKey: true
            };
        }
        if (typeof parsedRemoteSettings.enableSteamKey === 'undefined') { // Thêm cờ mới nếu chưa có
            parsedRemoteSettings.enableSteamKey = true;
        }
        DataStore.remoteSettings = parsedRemoteSettings;
    };
    DataStore.initRemoteSettings(); // Gọi ngay

    // Tải remote settings từ server (nếu có)
    (function () {
        try {
            PlatformShim.xhr({ url: "http://www.greenheartgames.com/utils/remoteSettingsId" },
                function (response) { // successCallback
                    if (response && response.responseText) {
                        var remoteIdString = response.responseText;
                        try {
                            if (parseInt(remoteIdString) > DataStore.remoteSettings.id) { // Nếu ID từ server mới hơn
                                PlatformShim.xhr({ url: "http://www.greenheartgames.com/utils/remoteSettings" },
                                    function (settingsResponse) { // successCallback
                                        if (settingsResponse && settingsResponse.responseText) {
                                            var newSettingsString = settingsResponse.responseText;
                                            try {
                                                var newRemoteSettings = JSON.parse(newSettingsString);
                                                DataStore.setValue("remote-settings", newSettingsString);
                                                DataStore.remoteSettings = newRemoteSettings;
                                            } catch (parseNewSettingsError) {
                                                Logger.LogWarning("Could not load remote settings", parseNewSettingsError, "Could not load remote settings".localize());
                                            }
                                        }
                                    }
                                    // errorCallback cho xhr load settings không được xử lý ở đây
                                );
                            }
                        } catch (parseRemoteIdError) {
                            Logger.LogWarning("Could not load remote settings", parseRemoteIdError, "Could not load remote settings".localize());
                        }
                    }
                }
                // errorCallback cho xhr load remoteSettingsId không được xử lý ở đây
            );
        } catch (xhrError) {
            Logger.LogWarning("Could not load remote settings", xhrError, "Could not load remote settings".localize());
        }
    })();

    DataStore.setScore = function (slotId, playerName, scoreValue) {
        var settings = DataStore.settings;
        if (!settings.highScore) {
            settings.highScore = {};
        }
        // Chỉ lưu nếu điểm mới cao hơn hoặc chưa có điểm cho slot đó
        if (!(settings.highScore.hasOwnProperty(slotId) && settings.highScore[slotId].score > scoreValue)) {
            settings.highScore[slotId] = { name: playerName, score: scoreValue };
            DataStore.saveSettings();
            try {
                // Có thể là lưu lại game có điểm cao này
                GameManager.save(slotId, null);
            } catch (saveGameError) {
                Logger.LogWarning("Could not save game", saveGameError, "Could not save game".localize());
            }
        }
    };

    DataStore.getHighScoreList = function () {
        var settings = DataStore.settings;
        var highScoreList = [];
        var slotId;
        for (slotId in settings.highScore) {
            if (settings.highScore.hasOwnProperty(slotId)) {
                highScoreList.push(settings.highScore[slotId]);
            }
        }
        return highScoreList;
    };
})();