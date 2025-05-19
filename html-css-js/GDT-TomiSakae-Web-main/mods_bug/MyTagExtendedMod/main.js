(function () {
    var MyTagExtendedMod = MyTagExtendedMod || {};

    MyTagExtendedMod.modPath = "./mods/MyTagExtendedMod"

    // Adjust button position
    MyTagExtendedMod.buttonLeft = "1200px";
    MyTagExtendedMod.buttonBottom = "10px";

    //------------------------------
    // Initialize Mod
    //------------------------------
    MyTagExtendedMod.initialized = false;
    MyTagExtendedMod.dynamicObserverStarted = false;

    GDT.on(GDT.eventKeys.mod.allLoaded, function () {
        console.log("MyTagExtendedMod: allLoaded event triggered at", new Date());
        if (MyTagExtendedMod.initialized) {
            console.log("MyTagExtendedMod is already initialized. Skipping...");
            return;
        }
        MyTagExtendedMod.initialized = true;
        try {
            console.log("MyTagExtendedMod: All mods loaded. Starting setup...");
            MyTagExtendedMod.init();
        } catch (e) {
            console.error("MyTagExtendedMod: Error during initialization:", e);
        }
    });



    //------------------------------
    // Initialize Features
    //------------------------------
    MyTagExtendedMod.init = function () {
        try {
            MyTagExtendedMod.overrideSetGameSpeed();
            MyTagExtendedMod.addSpeedButtonsUI();
            MyTagExtendedMod.monitorMainMenu();
            MyTagExtendedMod.startYearOffsetLoop();
            MyTagExtendedMod.addCustomTopics();
            MyTagExtendedMod.addCustomGenres();
            MyTagExtendedMod.updateDevMissionWeightings();
            MyTagExtendedMod.updateGenreUI();
            MyTagExtendedMod.addGenresToTopics();
            MyTagExtendedMod.addGenresToPlatforms();
            MyTagExtendedMod.overridePlatformWeightings();
            MyTagExtendedMod.reapplyImages();
            MyTagExtendedMod.startDynamicObserver();
            MyTagExtendedMod.addCustomResearchItems();
            // Extend getGenreWeighting directly
            (function () {
                var originalGetGenreWeighting = GameGenre.getGenreWeighting;

                GameGenre.getGenreWeighting = function (a, b, c) {
                    if (typeof a === "undefined") return 1;

                    if (c) {
                        return (
                            (originalGetGenreWeighting(a, c) +
                                2 * originalGetGenreWeighting(a, b)) /
                            3
                        );
                    }

                    if (b === GameGenre.Action) return a[0];
                    if (b === GameGenre.Adventure) return a[1];
                    if (b === GameGenre.RPG) return a[2];
                    if (b === GameGenre.Simulation) return a[3];
                    if (b === GameGenre.Strategy) return a[4];
                    if (b === GameGenre.Casual) return a[5];
                    if (b === GameGenre.sandbox) return a[6];
                    if (b === GameGenre.moba) return a[7];
                    if (b === GameGenre.battleroyale) return a[8];
                    if (b === GameGenre.racing) return a[9];

                    throw "Unknown genre: " + b;
                };

                console.log("MyTagExtendedMod: getGenreWeighting extended successfully.");
            })();

            MyTagExtendedMod.startDynamicObserver();
        } catch (e) {
            console.error("MyTagExtendedMod: Error during initialization:", e);
        }
    };

    //------------------------------
    // Add Custom Research Items
    //------------------------------
    MyTagExtendedMod.addCustomResearchItems = function () {
        try {
            console.log("MyTagExtendedMod: Đang thêm các mục nghiên cứu tùy chỉnh...");

            // Thêm từng mục nghiên cứu riêng lẻ
            GDT.addResearchItem({
                id: "BasicCharacterModels",
                name: "Mô Hình Nhân Vật Cơ Bản".localize(),
                v: 2,
                category: "Graphic",
                categoryDisplayName: "Graphic".localize(),
                canResearch: function (company) {
                    return LevelCalculator.getMissionLevel("Graphic") > 1;
                },
                complete: function (company) {
                    console.log("Nghiên cứu Mô Hình Nhân Vật Cơ Bản đã hoàn thành!");
                }
            });

            GDT.addResearchItem({
                id: "BetterCharacterModels",
                name: "Mô Hình Nhân Vật Tốt Hơn".localize(),
                v: 4,
                category: "Graphic",
                categoryDisplayName: "Graphic".localize(),
                canResearch: function (company) {
                    return LevelCalculator.getMissionLevel("Graphic") > 3;
                },
                complete: function (company) {
                    console.log("Nghiên cứu Mô Hình Nhân Vật Tốt Hơn đã hoàn thành!");
                }
            });

            GDT.addResearchItem({
                id: "AdvancedCharacterModels",
                name: "Mô Hình Nhân Vật Tiên Tiến".localize(),
                v: 6,
                category: "Graphic",
                categoryDisplayName: "Graphic".localize(),
                canResearch: function (company) {
                    return LevelCalculator.getMissionLevel("Graphic") > 5;
                },
                complete: function (company) {
                    console.log("Nghiên cứu Mô Hình Nhân Vật Tiên Tiến đã hoàn thành!");
                }
            });

            GDT.addResearchItem({
                id: "RealisticCharacterModels",
                name: "Mô Hình Nhân Vật Chân Thực".localize(),
                v: 8,
                category: "Graphic",
                categoryDisplayName: "Graphic".localize(),
                canResearch: function (company) {
                    return LevelCalculator.getMissionLevel("Graphic") > 7;
                },
                complete: function (company) {
                    console.log("Nghiên cứu Mô Hình Nhân Vật Chân Thực đã hoàn thành!");
                }
            });

            GDT.addResearchItem({
                id: "3DGraphicsV8",
                name: "Đồ Họa 3D V8".localize(),
                v: 12,
                category: "Graphic",
                categoryDisplayName: "Graphic".localize(),
                canResearch: function (company) {
                    return LevelCalculator.getMissionLevel("Graphic") > 8;
                },
                complete: function (company) {
                    console.log("Nghiên cứu Đồ Họa 3D V8 đã hoàn thành!");
                }
            });

            GDT.addResearchItem({
                id: "RagdollPhysics",
                name: "Vật Lý Ragdoll".localize(),
                v: 8,
                category: "Gameplay",
                categoryDisplayName: "Gameplay".localize(),
                canResearch: function (company) {
                    return LevelCalculator.getMissionLevel("Gameplay") > 5;
                },
                complete: function (company) {
                    console.log("Nghiên cứu Vật Lý Ragdoll đã hoàn thành!");
                }
            });

            GDT.addResearchItem({
                id: "TailoredSoundtrack",
                name: "Nhạc Nền Tùy Chỉnh".localize(),
                v: 6,
                category: "Sound",
                categoryDisplayName: "Sound".localize(),
                canResearch: function (company) {
                    return LevelCalculator.getMissionLevel("Sound") > 5;
                },
                complete: function (company) {
                    console.log("Nghiên cứu Nhạc Nền Tùy Chỉnh đã hoàn thành!");
                }
            });

            GDT.addResearchItem({
                id: "RandomlyGeneratedOpenWorld",
                name: "Thế Giới Mở Ngẫu Nhiên".localize(),
                v: 6,
                category: "World Design",
                categoryDisplayName: "World Design".localize(),
                canResearch: function (company) {
                    return LevelCalculator.getMissionLevel("World Design") > 6;
                },
                complete: function (company) {
                    console.log("Nghiên cứu Thế Giới Mở Ngẫu Nhiên đã hoàn thành!");
                }
            });

            GDT.addResearchItem({
                id: "OperableVehicles",
                name: "Phương Tiện Điều Khiển Được".localize(),
                v: 4,
                category: "Gameplay",
                categoryDisplayName: "Gameplay".localize(),
                canResearch: function (company) {
                    return LevelCalculator.getMissionLevel("Gameplay") > 5;
                },
                complete: function (company) {
                    console.log("Nghiên cứu Phương Tiện Điều Khiển Được đã hoàn thành!");
                }
            });

            GDT.addResearchItem({
                id: "CharacterCustomization",
                name: "Tùy Biến Nhân Vật".localize(),
                v: 6,
                category: "Gameplay",
                categoryDisplayName: "Gameplay".localize(),
                canResearch: function (company) {
                    return LevelCalculator.getMissionLevel("Gameplay") > 4;
                },
                complete: function (company) {
                    console.log("Nghiên cứu Tùy Biến Nhân Vật đã hoàn thành!");
                }
            });

            GDT.addResearchItem({
                id: "BossBattles",
                name: "Trận Đấu Boss".localize(),
                v: 4,
                category: "Gameplay",
                categoryDisplayName: "Gameplay".localize(),
                canResearch: function (company) {
                    return LevelCalculator.getMissionLevel("Gameplay") > 4;
                },
                complete: function (company) {
                    console.log("Nghiên cứu Trận Đấu Boss đã hoàn thành!");
                }
            });

            GDT.addResearchItem({
                id: "CharacterClasses",
                name: "Hệ Thống Lớp Nhân Vật".localize(),
                v: 4,
                category: "Gameplay",
                categoryDisplayName: "Gameplay".localize(),
                canResearch: function (company) {
                    return LevelCalculator.getMissionLevel("Gameplay") > 3;
                },
                complete: function (company) {
                    console.log("Nghiên cứu Hệ Thống Lớp Nhân Vật đã hoàn thành!");
                }
            });

            GDT.addResearchItem({
                id: "Seasons",
                name: "Hệ Thống Mùa".localize(),
                v: 8,
                category: "World Design",
                categoryDisplayName: "World Design".localize(),
                canResearch: function (company) {
                    return LevelCalculator.getMissionLevel("World Design") > 6;
                },
                complete: function (company) {
                    console.log("Nghiên cứu Hệ Thống Mùa đã hoàn thành!");
                }
            });

            GDT.addResearchItem({
                id: "RayTracing",
                name: "Ray Tracing".localize(),
                v: 12,
                category: "Graphic",
                categoryDisplayName: "Graphic".localize(),
                canResearch: function (company) {
                    return LevelCalculator.getMissionLevel("Graphic") > 9;
                },
                complete: function (company) {
                    console.log("Nghiên cứu Dò Tia đã hoàn thành!");
                }
            });


            GDT.addResearchItem({
                id: "procedurally generated open world",
                name: "Thế Giới Mở Tạo Theo Quy Trình".localize(),
                v: 6,
                category: "Level Design",
                categoryDisplayName: "Level Design".localize(),
                canResearch: function (company) {
                    return LevelCalculator.getMissionLevel("Level Design") > 5;
                },
                complete: function (company) {
                    console.log("Nghiên cứu Thế Giới Mở Tạo Theo Quy Trình đã hoàn thành!");
                }
            });


            console.log("MyTagExtendedMod: Các mục nghiên cứu tùy chỉnh đã được thêm thành công.");
        } catch (e) {
            console.error("MyTagExtendedMod: Lỗi khi thêm các mục nghiên cứu tùy chỉnh:", e);
        }
    };

    //------------------------------
    // Dynamic Observer
    //------------------------------
    MyTagExtendedMod.startDynamicObserver = function () {
        if (MyTagExtendedMod.dynamicObserverStarted) return;

        MyTagExtendedMod.dynamicObserverStarted = true;
        console.log("MyTagExtendedMod: Initializing dynamic observer...");

        const observer = new MutationObserver(function (mutationsList) {
            mutationsList.forEach(function (mutation) {
                if (mutation.type === "childList") {
                    // Check for and remove "Last Genre Used" text
                    MyTagExtendedMod.removeLastGenreUsedText();

                    // Reapply images if necessary
                    if (document.querySelector(".pickTopicListButton") || document.querySelector(".pickGenreButton")) {
                        console.log("MyTagExtendedMod: Topic or Genre buttons detected. Reapplying images...");
                        MyTagExtendedMod.reapplyImages();
                    }
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    };

    MyTagExtendedMod.removeLastGenreUsedText = function () {
        try {
            // Select the element by class name
            var lastGenreElement = document.querySelector(".tm-genre-last-used");
            if (lastGenreElement) {
                console.log("MyTagExtendedMod: Removing 'Last Genre Used' element.");
                lastGenreElement.parentNode.removeChild(lastGenreElement); // Remove the element
            } else {
                console.log("MyTagExtendedMod: 'Last Genre Used' element not found.");
            }
        } catch (e) {
            console.error("MyTagExtendedMod: Error removing 'Last Genre Used' text element:", e);
        }
    };

    //------------------------------
    // Override Set Game Speed
    //------------------------------
    MyTagExtendedMod.overrideSetGameSpeed = function () {
        try {
            if (!window.GameManager || !GameManager.setGameSpeed) {
                console.warn("MyTagExtendedMod: setGameSpeed not found—buttons will not function.");
                return;
            }

            if (MyTagExtendedMod._speedsOverridden) return;

            MyTagExtendedMod._speedsOverridden = true;

            var oldFn = GameManager.setGameSpeed;
            GameManager.setGameSpeed = function (param) {
                if (param === "0.5x") return oldFn.call(this, "slow");
                if (param === "1.0x") return oldFn.call(this, "normal");
                if (param === "2.0x") return oldFn.call(this, "fast");
                return oldFn.call(this, param);
            };
        } catch (e) {
            console.error("MyTagExtendedMod: Error overriding setGameSpeed:", e);
        }
    };

    //------------------------------
    // Add Speed Buttons UI
    //------------------------------
    MyTagExtendedMod.addSpeedButtonsUI = function () {
        try {
            if (document.getElementById("myTagSpeedUI")) return;

            var div = document.createElement("div");
            div.id = "myTagSpeedUI";
            div.style.position = "absolute";
            div.style.left = MyTagExtendedMod.buttonLeft;
            div.style.bottom = MyTagExtendedMod.buttonBottom;
            div.style.zIndex = "999999";
            div.style.backgroundColor = "#f4f4f4";
            div.style.padding = "6px";
            div.style.borderRadius = "6px";
            div.style.border = "1px solid #ddd";
            div.style.boxShadow = "0px 1px 3px rgba(0, 0, 0, 0.1)";
            div.style.fontFamily = "sans-serif";
            div.style.color = "#000";
            div.style.fontSize = "12px";
            div.style.textAlign = "center";

            var title = document.createElement("div");
            title.textContent = "Tốc Độ Trò Chơi:";
            title.style.fontWeight = "bold";
            title.style.marginBottom = "4px";
            div.appendChild(title);

            var currentSpeed = "normal"; // Giá trị mặc định

            function makeBtn(label, speedParam) {
                var btn = document.createElement("button");
                btn.textContent = label;
                btn.id = "speedBtn_" + speedParam.replace(".", "_");
                btn.style.margin = "0 4px";
                btn.style.padding = "4px 8px";
                btn.style.border = "1px solid #ccc";
                btn.style.backgroundColor = "#e8e8e8";
                btn.style.color = "#000";
                btn.style.fontSize = "12px";
                btn.style.borderRadius = "4px";
                btn.style.cursor = "pointer";
                btn.style.boxShadow = "0px 1px 2px rgba(0, 0, 0, 0.1)";
                btn.style.transition = "all 0.2s ease";

                // Kiểm tra nếu là tốc độ mặc định (1.0x = normal)
                if ((speedParam === "1.0x" && currentSpeed === "normal") ||
                    (speedParam === "0.5x" && currentSpeed === "slow") ||
                    (speedParam === "2.0x" && currentSpeed === "fast")) {
                    btn.style.backgroundColor = "#4a90e2";
                    btn.style.color = "#fff";
                    btn.style.border = "1px solid #3a80d2";
                }

                btn.onclick = function () {
                    if (GameManager && GameManager.setGameSpeed) {
                        GameManager.setGameSpeed(speedParam);

                        // Cập nhật giao diện nút
                        document.querySelectorAll("#myTagSpeedUI button").forEach(function (button) {
                            button.style.backgroundColor = "#e8e8e8";
                            button.style.color = "#000";
                            button.style.border = "1px solid #ccc";
                        });

                        // Đánh dấu nút đang được chọn
                        this.style.backgroundColor = "#4a90e2";
                        this.style.color = "#fff";
                        this.style.border = "1px solid #3a80d2";

                        // Cập nhật trạng thái tốc độ hiện tại
                        if (speedParam === "0.5x") currentSpeed = "slow";
                        else if (speedParam === "1.0x") currentSpeed = "normal";
                        else if (speedParam === "2.0x") currentSpeed = "fast";
                    }
                };
                return btn;
            }

            var btn05x = makeBtn("0.5x", "0.5x");
            var btn10x = makeBtn("1.0x", "1.0x");
            var btn20x = makeBtn("2.0x", "2.0x");

            div.appendChild(btn05x);
            div.appendChild(btn10x);
            div.appendChild(btn20x);

            document.body.appendChild(div);

            // Kiểm tra tốc độ hiện tại của trò chơi nếu có thể
            if (GameManager && GameManager.gameSpeed) {
                currentSpeed = GameManager.gameSpeed;
                // Cập nhật giao diện nút dựa trên tốc độ hiện tại
                if (currentSpeed === "slow") {
                    btn05x.style.backgroundColor = "#4a90e2";
                    btn05x.style.color = "#fff";
                    btn05x.style.border = "1px solid #3a80d2";
                } else if (currentSpeed === "normal") {
                    btn10x.style.backgroundColor = "#4a90e2";
                    btn10x.style.color = "#fff";
                    btn10x.style.border = "1px solid #3a80d2";
                } else if (currentSpeed === "fast") {
                    btn20x.style.backgroundColor = "#4a90e2";
                    btn20x.style.color = "#fff";
                    btn20x.style.border = "1px solid #3a80d2";
                }
            }
        } catch (e) {
            console.error("MyTagExtendedMod: Error adding speed buttons UI:", e);
        }
    };

    //------------------------------
    // Monitor Main Menu State
    //------------------------------
    MyTagExtendedMod.monitorMainMenu = function () {
        try {
            var speedUI = document.getElementById("myTagSpeedUI");
            var mainMenu = document.getElementById("mainMenu");

            if (!speedUI || !mainMenu) {
                console.warn("MyTagExtendedMod: Main menu or Speed UI not found.");
                return;
            }

            function updateSpeedButtonsVisibility() {
                speedUI.style.display = mainMenu.offsetParent === null ? "block" : "none";
            }

            setInterval(updateSpeedButtonsVisibility, 200);
        } catch (e) {
            console.error("MyTagExtendedMod: Error monitoring main menu:", e);
        }
    };

    //------------------------------
    // Offset Year Logic
    //------------------------------
    MyTagExtendedMod.startYearOffsetLoop = function () {
        try {
            if (MyTagExtendedMod._offsetLoopStarted) return;

            MyTagExtendedMod._offsetLoopStarted = true;

            setInterval(function () {
                var dateEl = document.getElementById("tagDate");
                if (!dateEl) return;

                var txt = dateEl.textContent;
                if (!txt) return;

                var match = txt.match(/^Y(\d+)\sM(\d+)\sW(\d+)/);
                if (match) {
                    var oldYear = parseInt(match[1], 10);
                    if (oldYear < 200) {
                        var newYear = oldYear + 1979;
                        var newText = "Y" + newYear + " M" + match[2] + " W" + match[3];
                        dateEl.textContent = newText;
                    }
                }
            }, 500);
        } catch (e) {
            console.error("MyTagExtendedMod: Error offsetting year:", e);
        }
    };

    //------------------------------
    // Add Custom Topics
    //------------------------------
    MyTagExtendedMod.addCustomTopics = function () {
        try {
            GDT.addTopics([
                {
                    id: "espionage",
                    name: "Gián Điệp".localize("game topic"),
                    genreWeightings: [1.0, 0.9, 0.8, 1.0, 0.9, 0.6, 0.8, 0.8, 0.8, 0.6],
                    audienceWeightings: [0.8, 1.0, 0.7],
                    iconUrl: MyTagExtendedMod.modPath + "/img/topic icons/icon_topic_espionage.png"
                },
            ]);
        } catch (e) {
            console.error("MyTagExtendedMod: Lỗi khi thêm chủ đề:", e);
        }
    };



    //------------------------------
    // Update UI to Show New Genres
    //------------------------------
    MyTagExtendedMod.updateGenreUI = function () {
        try {
            var originalGetAll = GameGenre.getAll;
            GameGenre.getAll = function () {
                var genres = originalGetAll.call(this);

                customGenres.forEach(function (genre) {
                    if (!genres.some(function (g) {
                        return g.id === genre.id;
                    })) {
                        genres.push(GameGenre[genre.id]);
                    }
                });

                return genres;
            };

            console.log("MyTagExtendedMod: Genre UI updated.");
        } catch (e) {
            console.error("MyTagExtendedMod: Error updating genre UI:", e);
        }
    };

    //------------------------------
    // Genres to Add
    //------------------------------
    var customGenres = [
        { id: "sandbox", name: "Sandbox".localize() },
        { id: "moba", name: "MOBA".localize() },
        { id: "battleroyale", name: "Battle Royale".localize() },
        { id: "racing", name: "Đua Xe".localize() }
    ];

    //------------------------------
    // Custom Weightings
    //------------------------------
    var platformGenreWeightings = {
        "PC": [1.0, 1.0, 1.0, 1.0, 1.0, 0.7, 1.0, 1.0, 1.0, 0.8], // PC is versatile, strong across all genres.
        "G64": [0.9, 0.9, 0.8, 0.8, 0.7, 0.6, 0.8, 0.7, 0.6, 0.6], // G64 good for early action/adventure, weak in modern genres.
        "TES": [0.8, 0.9, 0.7, 0.6, 0.6, 1.0, 0.7, 0.6, 0.5, 0.6], // TES excels in casual/adventure genres.
        "Master V": [0.9, 0.8, 0.8, 0.6, 0.6, 1.0, 0.7, 0.7, 0.6, 0.6], // Similar to TES with slight action focus.
        "Gameling": [0.7, 0.6, 0.7, 0.6, 0.5, 1.0, 0.6, 0.5, 0.4, 0.6], // Gameling shines in casual genres.
        "Vena Gear": [0.8, 0.7, 0.6, 0.7, 0.6, 1.0, 0.6, 0.6, 0.5, 0.6], // Portable-friendly genres like casual.
        "Vena Oasis": [0.9, 0.7, 0.6, 0.7, 0.6, 0.8, 0.7, 0.7, 0.6, 0.7], // Action-heavy focus for older consoles.
        "Super TES": [0.9, 1.0, 0.8, 0.7, 0.7, 1.0, 0.7, 0.7, 0.6, 0.7], // Excellent for action and casual.
        "Playsystem": [1.0, 0.9, 1.0, 0.8, 0.7, 0.8, 0.9, 0.8, 0.8, 0.8], // Strong across RPGs and action genres.
        "TES 64": [0.8, 0.9, 0.8, 0.7, 0.6, 0.9, 0.8, 0.7, 0.6, 0.7], // Great for action and adventure.
        "DreamVast": [0.8, 0.8, 0.8, 0.9, 0.7, 0.7, 0.9, 0.8, 0.7, 0.7], // Balanced, but weaker casual appeal.
        "Playsystem 2": [1.0, 0.9, 1.0, 0.8, 0.8, 0.9, 0.9, 0.8, 0.8, 0.9], // Excellent for RPGs and action.
        "mBox": [1.0, 0.8, 0.9, 0.7, 0.8, 0.7, 0.9, 0.8, 0.8, 1.0], // Best for action and competitive genres.
        "gameSphere": [0.8, 0.9, 0.8, 0.6, 0.6, 1.0, 0.7, 0.6, 0.5, 0.7], // Family/casual-centric with adventure appeal.
        "GS": [0.9, 0.7, 0.8, 0.6, 0.5, 1.0, 0.6, 0.6, 0.6, 0.7], // Strong casual and portable titles.
        "PPS": [1.0, 0.8, 1.0, 0.8, 0.7, 0.8, 0.8, 0.7, 0.6, 0.7], // Focused on RPGs and action genres.
        "mBox 360": [1.0, 0.9, 1.0, 0.8, 0.8, 0.8, 0.9, 0.8, 0.9, 1.0], // Balanced across all competitive and immersive genres.
        "Nuu": [0.8, 0.6, 0.7, 1.0, 0.7, 1.0, 0.6, 0.5, 0.4, 0.7], // Casual games are its forte.
        "Playsystem 3": [1.0, 0.9, 1.0, 0.9, 0.8, 0.8, 0.9, 0.8, 0.8, 0.9], // High-quality RPGs and strategy.
        "grPhone": [0.7, 0.7, 0.6, 0.8, 0.6, 1.0, 0.6, 0.6, 0.6, 0.6], // Casual/portable-centric.
        "grPad": [0.8, 0.8, 0.7, 0.9, 0.7, 1.0, 0.6, 0.6, 0.6, 0.6], // More casual with a slight adventure focus.
        "mPad": [0.7, 0.8, 0.8, 0.9, 0.7, 0.9, 0.6, 0.6, 0.6, 0.7], // Balanced with a focus on simulation.
        "Wuu": [0.9, 0.8, 0.8, 1.0, 0.8, 1.0, 0.7, 0.6, 0.6, 0.7], // Casual-heavy with sandbox lean.
        "OYA": [0.8, 0.7, 0.7, 0.7, 0.7, 1.0, 0.7, 0.6, 0.6, 0.6], // Weaker on heavy genres, strong in casual/indie.
        "mBox One": [1.0, 0.8, 1.0, 0.8, 0.8, 0.8, 0.9, 0.8, 0.8, 1.0], // Competitive action genres dominate.
        "Playsystem 4": [1.0, 0.9, 1.0, 0.9, 0.8, 0.9, 0.9, 0.8, 0.9, 0.9], // Extremely strong for RPGs and action.
        "Swap": [0.9, 0.8, 0.9, 1.0, 0.8, 1.0, 0.8, 0.8, 0.7, 0.8], // Casual/portable with modern appeal.
        "mBox Next": [1.0, 0.9, 1.0, 0.8, 0.8, 0.8, 0.9, 0.9, 0.8, 1.0], // Successor to mBox with similar focus.
        "Playsystem 5": [1.0, 0.9, 1.0, 1.0, 0.9, 0.9, 0.9, 0.9, 0.8, 0.9] // Top-of-the-line performance in all genres.
    };


    var topicGenreWeightings = {
        "sports": [1.0, 0.6, 0.6, 1.0, 0.7, 1.0, 0.7, 0.6, 0.8, 1.0],
        "military": [1.0, 0.8, 0.8, 0.9, 1.0, 0.6, 0.9, 0.8, 1.0, 0.7],
        "medieval": [0.9, 1.0, 1.0, 0.8, 1.0, 0.6, 0.9, 0.8, 0.8, 0.7],
        "space": [1.0, 0.9, 0.9, 1.0, 0.9, 0.7, 1.0, 0.7, 0.7, 0.8],
        "racing": [0.9, 0.6, 0.8, 1.0, 0.7, 1.0, 0.6, 0.6, 0.7, 1.0],
        "fantasy": [1.0, 1.0, 1.0, 0.7, 1.0, 0.6, 0.9, 1.0, 0.7, 0.7],
        "pirate": [0.9, 1.0, 0.9, 0.9, 0.7, 0.8, 0.7, 0.6, 0.7, 0.9],
        "sci-fi": [1.0, 1.0, 1.0, 0.9, 0.9, 0.8, 0.9, 0.9, 1.0, 0.7],
        "airplane": [0.9, 0.9, 0.7, 1.0, 0.9, 0.8, 0.7, 0.6, 0.6, 1.0],
        "dungeon": [1.0, 0.8, 1.0, 1.0, 1.0, 0.6, 0.9, 0.7, 0.9, 0.7],
        "mystery": [0.6, 1.0, 1.0, 0.9, 0.6, 0.8, 0.7, 0.6, 0.6, 0.6],
        "martial arts": [1.0, 0.8, 1.0, 1.0, 0.7, 0.6, 0.7, 0.8, 0.8, 0.6],
        "history": [0.8, 0.9, 0.7, 1.0, 1.0, 0.9, 0.9, 0.8, 1.0, 0.6],
        "horror": [1.0, 1.0, 0.8, 0.6, 0.7, 0.7, 0.8, 0.7, 1.0, 0.6],
        "business": [0.6, 0.8, 0.8, 1.0, 1.0, 0.7, 0.9, 0.6, 0.6, 0.6],
        "transport": [0.6, 0.6, 0.6, 1.0, 1.0, 0.7, 0.8, 0.7, 0.7, 1.0],
        "comedy": [0.6, 1.0, 0.8, 0.6, 0.6, 0.9, 0.7, 0.6, 0.6, 0.8],
        "ninja": [1.0, 0.8, 0.8, 0.7, 0.8, 0.8, 0.7, 0.8, 0.9, 0.9],
        "romance": [0.7, 1.0, 0.9, 0.9, 0.6, 0.9, 0.8, 0.6, 0.6, 0.6],
        "movies": [0.8, 0.8, 0.6, 1.0, 0.6, 1.0, 0.7, 0.6, 0.6, 0.9],
        "spy": [1.0, 1.0, 1.0, 0.8, 0.7, 0.8, 1.0, 0.7, 0.8, 0.8],
        "detective": [0.6, 1.0, 1.0, 0.8, 0.6, 0.9, 0.8, 0.6, 0.6, 0.6],
        "cyberpunk": [1.0, 0.9, 1.0, 0.8, 0.7, 0.6, 1.0, 0.8, 0.8, 0.8],
        "ufo": [1.0, 0.8, 0.6, 0.8, 1.0, 0.8, 0.8, 0.7, 0.9, 0.9],
        "hospital": [0.6, 0.6, 0.8, 1.0, 0.8, 0.7, 0.7, 0.6, 0.7, 0.6],
        "evolution": [0.7, 0.6, 0.6, 1.0, 1.0, 0.6, 1.0, 0.7, 0.8, 0.6],
        "time travel": [0.9, 1.0, 1.0, 0.7, 0.6, 0.6, 0.9, 0.6, 0.6, 0.7],
        "life": [0.6, 1.0, 0.9, 1.0, 0.6, 0.8, 0.8, 0.6, 0.6, 0.6],
        "virtual pet": [0.6, 0.8, 0.9, 1.0, 0.9, 1.0, 0.8, 0.7, 1.0, 0.6],
        "vocabulary": [0.6, 0.6, 0.6, 1.0, 1.0, 1.0, 0.6, 0.6, 0.6, 0.6],
        "hunting": [1.0, 0.9, 0.9, 1.0, 0.7, 0.9, 0.9, 1.0, 0.9, 0.6],
        "law": [0.6, 1.0, 0.9, 0.9, 0.9, 0.6, 0.7, 0.6, 0.6, 0.6],
        "game dev": [0.6, 0.7, 0.6, 1.0, 0.6, 0.8, 0.8, 0.6, 0.6, 0.6],
        "city": [0.6, 0.6, 0.7, 1.0, 1.0, 0.7, 0.8, 0.7, 0.7, 0.7],
        "school": [0.8, 1.0, 1.0, 1.0, 1.0, 0.8, 1.0, 0.6, 0.6, 0.6],
        "fashion": [0.6, 0.8, 1.0, 1.0, 0.6, 1.0, 0.9, 0.6, 0.6, 0.6],
        "zombies": [1.0, 0.8, 0.9, 0.6, 0.9, 1.0, 0.9, 0.7, 1.0, 0.7],
        "hacking": [0.7, 0.8, 0.7, 1.0, 1.0, 0.6, 1.0, 0.8, 0.8, 0.7],
        "government": [0.6, 0.6, 0.6, 1.0, 1.0, 0.9, 1.0, 0.6, 0.6, 0.6],
        "prison": [1.0, 1.0, 0.8, 1.0, 0.8, 0.6, 0.8, 0.6, 0.6, 0.6],
        "surgery": [0.8, 0.7, 0.6, 1.0, 0.7, 0.6, 0.9, 0.6, 0.6, 0.6],
        "music": [1.0, 0.9, 0.6, 1.0, 0.6, 1.0, 0.7, 0.6, 0.6, 0.9],
        "rythm": [1.0, 0.7, 0.7, 1.0, 0.6, 1.0, 0.7, 0.6, 0.6, 0.9],
        "superheroes": [1.0, 0.6, 0.9, 0.6, 0.6, 0.7, 1.0, 1.0, 0.8, 0.7],
        "post apocalyptic": [1.0, 0.8, 1.0, 0.6, 0.9, 0.6, 1.0, 0.8, 0.9, 0.7],
        "alternate history": [1.0, 0.8, 1.0, 0.8, 0.9, 0.6, 0.9, 0.7, 0.9, 0.9],
        "vampire": [1.0, 0.8, 1.0, 0.6, 0.6, 0.7, 1.0, 0.8, 0.9, 0.6],
        "werewolf": [1.0, 0.8, 1.0, 0.6, 0.6, 0.7, 0.8, 0.9, 1.0, 0.7],
        "aliens": [1.0, 0.8, 1.0, 0.6, 0.9, 0.7, 0.9, 0.8, 0.8, 0.7],
        "wild west": [0.9, 0.7, 1.0, 0.6, 0.6, 0.7, 1.0, 0.8, 0.9, 0.8],
        "dance": [0.7, 0.6, 0.6, 1.0, 0.6, 1.0, 0.9, 0.6, 0.6, 0.6],
        "cooking": [0.9, 0.7, 0.8, 1.0, 0.7, 1.0, 0.8, 0.6, 0.8, 0.8],
        "farming": [0.6, 0.7, 0.6, 1.0, 0.6, 1.0, 0.9, 0.6, 0.6, 0.6],
        "crime": [1.0, 0.6, 0.8, 0.9, 0.7, 0.6, 1.0, 0.7, 1.0, 0.7],
        "disasters": [0.9, 0.8, 0.6, 1.0, 1.0, 0.7, 0.8, 0.7, 0.8, 0.7],
        "assassin": [1.0, 0.7, 1.0, 0.8, 0.6, 0.6, 1.0, 0.9, 0.8, 0.7],
        "thief": [0.9, 0.8, 1.0, 0.9, 0.6, 0.9, 1.0, 0.7, 0.7, 0.7],
        "colonization": [0.7, 0.6, 0.6, 1.0, 1.0, 0.7, 1.0, 0.7, 0.7, 0.7],
        "construction": [0.7, 0.6, 0.6, 1.0, 0.9, 0.8, 1.0, 0.6, 0.6, 0.6],
        "mythology": [1.0, 0.8, 0.9, 0.9, 0.8, 0.6, 1.0, 0.9, 0.8, 0.7],
        "abstract": [1.0, 0.9, 0.6, 0.6, 0.8, 0.6, 1.0, 0.8, 0.7, 0.7],
        "mad science": [0.9, 1.0, 0.7, 0.9, 0.6, 0.6, 1.0, 0.8, 0.8, 0.7],
        "extreme sports": [1.0, 0.6, 0.6, 1.0, 0.7, 0.9, 1.0, 0.6, 0.6, 1.0],
        "dystopian": [0.8, 0.9, 0.8, 1.0, 0.9, 0.6, 1.0, 0.8, 0.9, 0.7],
        "expedition": [0.7, 0.9, 0.6, 0.9, 1.0, 0.6, 1.0, 0.7, 0.8, 0.8],
        "technology": [0.6, 0.7, 0.6, 1.0, 0.9, 0.6, 1.0, 0.8, 0.8, 0.7],
        "espionage": [1.0, 0.9, 0.8, 1.0, 0.9, 0.6, 0.8, 0.8, 0.8, 0.6]
    };



    //------------------------------
    // Add Custom Genres
    //------------------------------
    MyTagExtendedMod.addCustomGenres = function () {
        try {
            if (typeof GameGenre === "object") {
                var customGenres = [
                    { id: "sandbox", name: "Sandbox" },
                    { id: "moba", name: "MOBA" },
                    { id: "battleroyale", name: "Battle Royale" },
                    { id: "racing", name: "Đua Xe" }
                ];

                for (var i = 0; i < customGenres.length; i++) {
                    var genre = customGenres[i];
                    if (!GameGenre[genre.id]) {
                        GameGenre[genre.id] = genre;
                        console.log("MyTagExtendedMod: Added custom genre:", genre.name, "with ID:", genre.id);
                    }
                }
            }
        } catch (e) {
            console.error("MyTagExtendedMod: Error adding custom genres:", e);
        }
    };



    //------------------------------
    // Update Dev Mission Weightings
    //------------------------------
    MyTagExtendedMod.updateDevMissionWeightings = function () {
        try {
            if (typeof Missions === "object" && Missions.DevMissions) {
                console.log("Updating DevMissions with custom genre weightings...");

                // Retrieve all valid genres dynamically
                var allGenres = [];
                for (var key in GameGenre) {
                    if (GameGenre.hasOwnProperty(key) && typeof GameGenre[key] === "object") {
                        allGenres.push(key);
                    }
                }
                console.log("Total valid genres:", allGenres);

                // Define custom weightings for each dev mission
                var customGenreWeightingsPerMission = {
                    "engine": [1.0, 0.9, 1.0, 1.0],
                    "gameplay": [1.0, 1.0, 0.9, 1.0],
                    "story/quests": [0.8, 0.6, 0.6, 0.7],
                    "dialogs": [0.8, 0.6, 0.6, 0.6],
                    "level design": [1.0, 0.8, 1.0, 0.9],
                    "ai": [0.8, 0.9, 0.6, 0.9],
                    "world design": [1.0, 0.8, 1.0, 0.8],
                    "graphic": [0.8, 0.8, 0.9, 1.0],
                    "sound": [0.8, 0.8, 0.8, 0.9]
                };

                // Iterate over all DevMissions
                for (var i = 0; i < Missions.DevMissions.length; i++) {
                    var mission = Missions.DevMissions[i];
                    var missionId = mission.id.toLowerCase();

                    // If no custom weighting exists for this mission, skip
                    if (!customGenreWeightingsPerMission.hasOwnProperty(missionId)) {
                        console.warn("No custom weightings defined for mission: " + mission.name + ", skipping.");
                        continue;
                    }

                    // Ensure genreWeightings array exists and matches total genres
                    if (!mission.genreWeightings) {
                        mission.genreWeightings = new Array(allGenres.length).fill(0.6); // Default value
                    } else {
                        // Extend or trim genreWeightings to match the number of genres
                        while (mission.genreWeightings.length < allGenres.length) {
                            mission.genreWeightings.push(0.6); // Default value for new genres
                        }
                        while (mission.genreWeightings.length > allGenres.length) {
                            mission.genreWeightings.pop(); // Remove extra values
                        }
                    }

                    // Apply custom weightings for the last 4 genres (sandbox, moba, battleroyale, racing)
                    var customWeights = customGenreWeightingsPerMission[missionId];
                    for (var j = 0; j < customWeights.length; j++) {
                        mission.genreWeightings[allGenres.length - customWeights.length + j] = customWeights[j];
                    }

                    console.log(
                        "Updated genre weightings for mission: " + mission.name,
                        mission.genreWeightings
                    );
                }

                console.log("All DevMissions updated successfully.");
            } else {
                console.warn("Missions.DevMissions not found.");
            }
        } catch (e) {
            console.error("Error updating dev mission weightings:", e);
        }
    };

    MyTagExtendedMod.overridePlatformWeightings = function () {
        try {
            // Save original methods for fallback
            var originalGetNormalizedGenreWeighting = Platforms.getNormalizedGenreWeighting;
            var originalGetNormGenreWeighting = Platforms.getNormGenreWeighting;

            // Override getNormalizedGenreWeighting to include new genres
            Platforms.getNormalizedGenreWeighting = function (value) {
                if (value === 1) return 1.1;
                if (value === 0.9) return 1.05;
                if (value === 0.8) return 1.0;
                if (value === 0.7) return 0.95;
                if (value === 0.6) return 0.9;

                // Default fallback for unknown values
                return 1.0;
            };

            // Override getNormGenreWeighting to include additional genres
            Platforms.getNormGenreWeighting = function (weightArray, genre, fallback) {
                if (typeof weightArray === "undefined") return 1;

                // If there's a fallback, calculate the average of the current genre and fallback genres
                if (fallback) {
                    return (
                        (originalGetNormGenreWeighting(weightArray, fallback) +
                            2 * originalGetNormGenreWeighting(weightArray, genre)) /
                        3
                    );
                }

                // Map genres to their weight indices
                if (genre === GameGenre.Action) return Platforms.getNormalizedGenreWeighting(weightArray[0]);
                if (genre === GameGenre.Adventure) return Platforms.getNormalizedGenreWeighting(weightArray[1]);
                if (genre === GameGenre.RPG) return Platforms.getNormalizedGenreWeighting(weightArray[2]);
                if (genre === GameGenre.Simulation) return Platforms.getNormalizedGenreWeighting(weightArray[3]);
                if (genre === GameGenre.Strategy) return Platforms.getNormalizedGenreWeighting(weightArray[4]);
                if (genre === GameGenre.Casual) return Platforms.getNormalizedGenreWeighting(weightArray[5]);

                // New genres
                if (genre === GameGenre.sandbox) return Platforms.getNormalizedGenreWeighting(weightArray[6]);
                if (genre === GameGenre.moba) return Platforms.getNormalizedGenreWeighting(weightArray[7]);
                if (genre === GameGenre.battleroyale) return Platforms.getNormalizedGenreWeighting(weightArray[8]);
                if (genre === GameGenre.racing) return Platforms.getNormalizedGenreWeighting(weightArray[9]);

                throw "Unknown genre: " + genre;
            };

            console.log("MyTagExtendedMod: Platform weighting methods overridden successfully.");
        } catch (e) {
            console.error("MyTagExtendedMod: Error overriding platform weightings:", e);
        }
    };

    //------------------------------
    // Add Genres to Topics
    //------------------------------
    MyTagExtendedMod.addGenresToTopics = function () {
        try {
            var genres = GameGenre.getAll(); // Get all available genres

            for (var i = 0; i < Topics.topics.length; i++) {
                var topic = Topics.topics[i];

                // Log the current topic for debugging
                console.log("Processing topic:", topic.id);

                // Normalize the topic ID for matching (trim and lowercase)
                var normalizedTopicId = topic.id.trim().toLowerCase();

                // Check if topicGenreWeightings has weightings for this topic
                if (topicGenreWeightings.hasOwnProperty(normalizedTopicId)) {
                    // Assign the specific weightings from topicGenreWeightings
                    var customWeightings = topicGenreWeightings[normalizedTopicId];

                    // Ensure the custom weightings match the number of genres
                    if (customWeightings.length === genres.length) {
                        topic.genreWeightings = customWeightings.slice(); // Clone the array
                        console.log("Updated genre weightings for topic:", normalizedTopicId, topic.genreWeightings);
                    } else {
                        console.warn(
                            "Mismatched genre weightings length for topic:",
                            normalizedTopicId,
                            "Expected:",
                            genres.length,
                            "Got:",
                            customWeightings.length
                        );

                        // Pad or truncate custom weightings to match genre length
                        topic.genreWeightings = customWeightings.slice(0, genres.length);
                        while (topic.genreWeightings.length < genres.length) {
                            topic.genreWeightings.push(0.6); // Default to 0.6
                        }
                    }
                } else {
                    // Default to 0.6 if no weightings are found
                    topic.genreWeightings = [];
                    for (var j = 0; j < genres.length; j++) {
                        topic.genreWeightings.push(0.6);
                    }
                    console.warn("No weightings found for topic:", normalizedTopicId, ". Defaulting to 0.6.");
                }
            }

            console.log("MyTagExtendedMod: Genres successfully added to topics.");
        } catch (e) {
            console.error("MyTagExtendedMod: Error adding genres to topics:", e);
        }
    };


    //------------------------------
    // Add Genres to Platforms
    //------------------------------
    MyTagExtendedMod.addGenresToPlatforms = function () {
        try {
            if (typeof Platforms !== "object" || !Platforms.allPlatforms) {
                console.warn("MyTagExtendedMod: Platforms object or allPlatforms not found.");
                return;
            }

            var genres = GameGenre.getAll();

            Platforms.allPlatforms.forEach(function (platform) {
                if (!platform.genreWeightings) {
                    platform.genreWeightings = [];
                }

                // Extend genreWeightings to match the number of genres
                while (platform.genreWeightings.length < genres.length) {
                    platform.genreWeightings.push(0.6); // Default weighting
                }

                // Update genre weightings for platforms
                genres.forEach(function (genre, index) {
                    if (platformGenreWeightings[platform.id] && platformGenreWeightings[platform.id][index] !== undefined) {
                        platform.genreWeightings[index] = platformGenreWeightings[platform.id][index];
                    }
                });
            });

            console.log("MyTagExtendedMod: Genres added to platforms.");
        } catch (e) {
            console.error("MyTagExtendedMod: Error adding genres to platforms:", e);
        }
    };

    //------------------------------
    // Reapply Images
    //------------------------------
    MyTagExtendedMod.reapplyImages = function () {
        try {
            console.log("Reapplying custom images...");

            var customGenres = {
                "sandbox": MyTagExtendedMod.modPath + "/Img/Genres/genre_icon_sandbox.png",
                "moba": MyTagExtendedMod.modPath + "/Img/Genres/genre_icon_moba.png",
                "battle royale": MyTagExtendedMod.modPath + "/Img/Genres/genre_icon_battleroyale.png",
                "racing": MyTagExtendedMod.modPath + "/Img/Genres/genre_icon_racing.png"
            };

            function handleImageError(imageElement, fallbackPath) {
                if (!imageElement.hasAttribute("data-error-handled")) {
                    imageElement.setAttribute("data-error-handled", "true");
                    imageElement.setAttribute("src", fallbackPath);
                    console.error("Failed to load image, using fallback:", fallbackPath);
                }
            }

            var buttons = document.querySelectorAll(".pickTopicListButton");
            console.log("Found buttons (topics and genres):", buttons.length);

            for (var i = 0; i < buttons.length; i++) {
                var button = buttons[i];
                var buttonTextElement = button.querySelector(".topicButtonText");

                if (!buttonTextElement) {
                    console.warn("No text found for a button. Skipping...");
                    continue;
                }

                var buttonText = buttonTextElement.textContent.trim().toLowerCase();
                console.log("Button text detected:", buttonText);

                if (customGenres.hasOwnProperty(buttonText)) {
                    console.log("Custom genre found:", buttonText);
                    var customGenreImagePath = customGenres[buttonText];
                    console.log("Custom genre image path:", customGenreImagePath);

                    var genreIcon = button.querySelector(".topicIcon");
                    if (genreIcon) {
                        genreIcon.setAttribute("src", customGenreImagePath);
                        console.log("Set genre icon src to:", customGenreImagePath);
                        genreIcon.onerror = function () {
                            handleImageError(this, "./mods/MyTagExtendedMod/Img/Genres/default.png");
                        };
                    }
                }
            }

            console.log("Reapply images completed successfully.");
        } catch (e) {
            console.error("MyTagExtendedMod: Error reapplying images:", e);
        }
    };




    //------------------------------
    // Final Log
    //------------------------------
    console.log("MyTagExtendedMod: Script loaded successfully.");
})();