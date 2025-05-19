var Sound = {},          // Đối tượng Sound chính, chứa các phương thức và thuộc tính quản lý âm thanh.
    SOUND_DISABLED = !1; // Cờ toàn cục để bật/tắt hoàn toàn hệ thống âm thanh.
(function () {
    // Khởi tạo hệ thống âm thanh
    Sound.init = function () {
        if (!SOUND_DISABLED) { // Chỉ khởi tạo nếu âm thanh không bị tắt
            // Khởi tạo hoặc lấy các cài đặt âm thanh từ DataStore
            // Nếu chưa có giá trị, gán giá trị mặc định
            void 0 == DataStore.getValue("masterVolume") && DataStore.setValue("masterVolume", 50);
            void 0 == DataStore.getValue("muted") && DataStore.setValue("muted", !1);
            void 0 == DataStore.getValue("allowBackgroundMusic") && DataStore.setValue("allowBackgroundMusic", !0);
            void 0 == DataStore.getValue("fxAllowed") && DataStore.setValue("fxAllowed", !0);

            // Đăng ký plugin HTMLAudio cho CreateJS Sound
            createjs.Sound.registerPlugins([createjs.HTMLAudioPlugin]);
            // Tạo một hàng đợi tải tài nguyên
            var preloadQueue = new createjs.LoadQueue; // Đổi tên 'preload' thành 'preloadQueue'
            preloadQueue.installPlugin(createjs.Sound); // Cài đặt plugin Sound cho hàng đợi
            preloadQueue.onComplete = this.playJingle; // Gọi hàm playJingle khi tải xong

            var soundFileExtension = ".mp3", // Đuôi file âm thanh mặc định
                audioFolderPath = "./audio";  // Đường dẫn thư mục âm thanh mặc định

            // Kiểm tra cờ ARM_VERSION để thay đổi đường dẫn thư mục âm thanh
            GameFlags.ARM_VERSION && (audioFolderPath = "./audio/arm");
            // Nếu không phải là Windows 8 (ví dụ: môi trường desktop/web), sử dụng định dạng .ogg
            PlatformShim.ISWIN8 || (audioFolderPath = "./audio/ogg", soundFileExtension = ".ogg");

            // Tải danh sách các file âm thanh (manifest)
            preloadQueue.loadManifest([
                // Nhạc nền
                {
                    id: "doing-my-best",
                    src: audioFolderPath + "/doing-my-best" + soundFileExtension,
                    type: "sound"
                }, {
                    id: "miss-management",
                    src: audioFolderPath + "/miss-management" + soundFileExtension,
                    type: "sound"
                }, {
                    id: "new-adventure",
                    src: audioFolderPath + "/new-adventure" + soundFileExtension,
                    type: "sound"
                }, {
                    id: "the-winning-strategy",
                    src: audioFolderPath + "/the-winning-strategy" + soundFileExtension,
                    type: "sound"
                }, {
                    id: "getting-to-success",
                    src: audioFolderPath + "/getting-to-success" + soundFileExtension,
                    type: "sound"
                }, {
                    id: "fly-like-a-butterfly",
                    src: audioFolderPath + "/fly-like-a-butterfly" + soundFileExtension,
                    type: "sound"
                }, {
                    id: "startup",
                    src: audioFolderPath + "/startup" + soundFileExtension,
                    type: "sound"
                }, {
                    id: "GameDevTycoonTitle", // Nhạc hiệu Game Dev Tycoon
                    src: audioFolderPath + "/GameDevTycoonTitle" + soundFileExtension,
                    type: "sound"
                },
                // Hiệu ứng âm thanh (SFX)
                {
                    id: "clickSound",
                    src: audioFolderPath + "/button-50" + soundFileExtension,
                    type: "sound"
                }, {
                    id: "designSpawn", // Âm thanh khi điểm design xuất hiện
                    src: audioFolderPath + "/designSpawn" + soundFileExtension,
                    type: "sound",
                    data: GameFlags.LIMIT_SOUND_INSTANCE ? 2 : 4 // Giới hạn số lần phát đồng thời
                }, {
                    id: "researchSpawn",// Âm thanh khi điểm research xuất hiện
                    src: audioFolderPath + "/researchSpawn" + soundFileExtension,
                    type: "sound",
                    data: GameFlags.LIMIT_SOUND_INSTANCE ? 2 : 4
                }, {
                    id: "techSpawn", // Âm thanh khi điểm tech xuất hiện
                    src: audioFolderPath + "/techSpawn" + soundFileExtension,
                    type: "sound",
                    data: GameFlags.LIMIT_SOUND_INSTANCE ? 2 : 4
                }, {
                    id: "bugSpawn", // Âm thanh khi bug xuất hiện
                    src: audioFolderPath + "/bugSpawn" + soundFileExtension,
                    type: "sound",
                    data: GameFlags.LIMIT_SOUND_INSTANCE ? 2 : 4
                }, {
                    id: "designSpawnEnd", // Âm thanh kết thúc hiệu ứng điểm design
                    src: audioFolderPath + "/designSpawnEnd" + soundFileExtension,
                    type: "sound",
                    data: GameFlags.LIMIT_SOUND_INSTANCE ? 2 : 4
                }, {
                    id: "researchSpawnEnd", // Âm thanh kết thúc hiệu ứng điểm research
                    src: audioFolderPath + "/researchSpawnEnd" + soundFileExtension,
                    type: "sound",
                    data: GameFlags.LIMIT_SOUND_INSTANCE ? 2 : 4
                }, {
                    id: "techSpawnEnd", // Âm thanh kết thúc hiệu ứng điểm tech
                    src: audioFolderPath + "/techSpawnEnd" + soundFileExtension,
                    type: "sound",
                    data: GameFlags.LIMIT_SOUND_INSTANCE ? 2 : 4
                }, {
                    id: "bugSpawnEnd", // Âm thanh kết thúc hiệu ứng bug
                    src: audioFolderPath + "/bugSpawnEnd" + soundFileExtension,
                    type: "sound",
                    data: GameFlags.LIMIT_SOUND_INSTANCE ? 2 : 4
                }, {
                    id: "popupOpen", // Âm thanh khi mở popup
                    src: audioFolderPath + "/popupOpen" + soundFileExtension,
                    type: "sound"
                }, {
                    id: "levelUp", // Âm thanh khi lên cấp
                    src: audioFolderPath + "/levelUp" + soundFileExtension,
                    type: "sound",
                    data: GameFlags.LIMIT_SOUND_INSTANCE ? 1 : 3
                }, {
                    id: "newRecord", // Âm thanh khi đạt kỷ lục mới
                    src: audioFolderPath + "/newRecord" + soundFileExtension,
                    type: "sound"
                }, {
                    id: "research", // Âm thanh khi hoàn thành nghiên cứu
                    src: audioFolderPath + "/research" + soundFileExtension,
                    type: "sound"
                }, {
                    id: "notificationTyping", // Âm thanh gõ chữ cho thông báo
                    src: audioFolderPath + "/notificationTyping" + soundFileExtension,
                    type: "sound"
                }, {
                    id: "pointCount", // Âm thanh đếm điểm
                    src: audioFolderPath + "/pointCount" + soundFileExtension,
                    type: "sound"
                }, {
                    id: "tack", // Âm thanh "tack" chung
                    src: audioFolderPath + "/tack" + soundFileExtension,
                    type: "sound",
                    data: GameFlags.LIMIT_SOUND_INSTANCE ? 2 : 3
                }, {
                    id: "cash", // Âm thanh tiền
                    src: audioFolderPath + "/cash" + soundFileExtension,
                    type: "sound",
                    data: 1
                }, {
                    id: "ping", // Âm thanh "ping"
                    src: audioFolderPath + "/ping" + soundFileExtension,
                    type: "sound",
                    data: 1
                },
                {
                    id: "pong", // Âm thanh game Pong (easter egg)
                    src: audioFolderPath + "/pong" + soundFileExtension,
                    type: "sound",
                    data: 1
                }, {
                    id: "bugDecrease", // Âm thanh khi giảm bug
                    src: audioFolderPath + "/bugDecrease" + soundFileExtension,
                    type: "sound",
                    data: GameFlags.LIMIT_SOUND_INSTANCE ? 1 : 8
                }, {
                    id: "trainingProgress", // Âm thanh tiến trình đào tạo
                    src: audioFolderPath + "/trainingProgress" + soundFileExtension,
                    type: "sound",
                    data: GameFlags.LIMIT_SOUND_INSTANCE ? 1 : 6
                }, {
                    id: "flipflap", // Âm thanh lật số (cho counter)
                    src: audioFolderPath + "/flipflap" + soundFileExtension,
                    type: "sound",
                    data: GameFlags.LIMIT_SOUND_INSTANCE ? 4 : 20
                }, {
                    id: "gameReady", // Âm thanh khi game sẵn sàng
                    src: audioFolderPath + "/game-ready" + soundFileExtension,
                    type: "sound"
                }, {
                    id: "achievement1", // Âm thanh khi đạt thành tựu
                    src: audioFolderPath + "/achievement-1" + soundFileExtension,
                    type: "sound"
                }, {
                    id: "reviewTack", // Âm thanh "tack" cho màn hình review
                    src: audioFolderPath + "/reviewTack" + soundFileExtension,
                    type: "sound",
                    data: GameFlags.LIMIT_SOUND_INSTANCE ? 3 : 15
                }, {
                    id: "boost", // Âm thanh khi kích hoạt boost
                    src: audioFolderPath + "/boost" + soundFileExtension,
                    type: "sound",
                    data: GameFlags.LIMIT_SOUND_INSTANCE ? 1 : 7
                }, {
                    id: "newNotification", // Âm thanh khi có thông báo mới
                    src: audioFolderPath + "/newNotification" + soundFileExtension,
                    type: "sound",
                    data: GameFlags.LIMIT_SOUND_INSTANCE ? 1 : 6
                }, {
                    id: "star", // Âm thanh ngôi sao (có thể cho review)
                    src: audioFolderPath + "/star" + soundFileExtension,
                    type: "sound",
                    data: GameFlags.LIMIT_SOUND_INSTANCE ? 2 : 5
                }, {
                    id: "star-m2", // Biến thể âm thanh ngôi sao
                    src: audioFolderPath + "/star-m2" + soundFileExtension,
                    type: "sound",
                    data: GameFlags.LIMIT_SOUND_INSTANCE ? 2 : 5
                }, {
                    id: "star-m3", // Biến thể âm thanh ngôi sao
                    src: audioFolderPath + "/star-m3" + soundFileExtension,
                    type: "sound",
                    data: GameFlags.LIMIT_SOUND_INSTANCE ? 2 : 5
                }, {
                    id: "star-p2", // Biến thể âm thanh ngôi sao
                    src: audioFolderPath + "/star-p2" + soundFileExtension,
                    type: "sound",
                    data: GameFlags.LIMIT_SOUND_INSTANCE ? 2 : 5
                }, {
                    id: "star-p3", // Biến thể âm thanh ngôi sao
                    src: audioFolderPath + "/star-p3" + soundFileExtension,
                    type: "sound",
                    data: GameFlags.LIMIT_SOUND_INSTANCE ? 2 : 5
                }
            ]);
            // Lưu trữ danh sách ID nhạc nền cho các level khác nhau
            Sound._backgroundMusic = ["doing-my-best", "miss-management", "new-adventure", "the-winning-strategy"];
            Sound._backgroundMusic2 = ["getting-to-success"];
            Sound._backgroundMusic3 = ["startup"];
            Sound._backgroundMusic4 = ["fly-like-a-butterfly"];
            // Lưu trữ danh sách ID các hiệu ứng âm thanh
            Sound._fxTracks = "clickSound designSpawn researchSpawn techSpawn bugSpawn designSpawnEnd researchSpawnEnd techSpawnEnd bugSpawnEnd popupOpen levelUp newRecord research notificationTyping pointCount tack cash ping pong bugDecrease trainingProgress flipflap reviewTack boost".split(" ")
        }
    };

    // Phát một âm thanh lặp lại
    Sound.playSoundLoop = function (soundId, volume) { // Đổi tên 'a' thành 'soundId', 'b' thành 'volume'
        if (!SOUND_DISABLED) {
            var actualVolume = volume; // Đổi tên 'c' thành 'actualVolume'
            actualVolume || (actualVolume = 1); // Nếu volume không được cung cấp, mặc định là 1
            // Nếu hiệu ứng âm thanh được cho phép
            Sound.getFxAllowed() && (
                Sound[soundId] && Sound[soundId].stop(), // Dừng âm thanh nếu đang phát
                // Phát âm thanh mới, lặp lại 100 lần (coi như vô hạn), INTERRUPT_LATE nghĩa là nếu có yêu cầu phát âm thanh cùng ID, âm thanh hiện tại sẽ phát xong rồi mới phát âm thanh mới.
                Sound[soundId] = createjs.Sound.play(soundId, createjs.Sound.INTERRUPT_LATE, 0, 0, 100, actualVolume, 0)
            )
        }
    };

    // Tạm dừng tất cả các hiệu ứng âm thanh đang lặp
    Sound.pauseAllLoopingFx = function () {
        SOUND_DISABLED || (
            Sound.notificationTyping && Sound.notificationTyping.pause(),
            Sound.pointCount && Sound.pointCount.pause()
        )
    };

    // Tiếp tục tất cả các hiệu ứng âm thanh đang lặp
    Sound.resumeAllLoopingFx = function () {
        SOUND_DISABLED || (
            Sound.notificationTyping && Sound.notificationTyping.resume(),
            Sound.pointCount && Sound.pointCount.resume()
        )
    };

    // Dừng một âm thanh cụ thể
    Sound.stopSound = function (soundId) { // Đổi tên 'a' thành 'soundId'
        SOUND_DISABLED || Sound[soundId] && Sound[soundId].stop()
    };

    // Phát một âm thanh một lần
    Sound.playSoundOnce = function (soundId, volume, delay) { // Đổi tên 'a' thành 'soundId', 'b' thành 'volume', 'c' thành 'delay'
        SOUND_DISABLED || (
            volume || (volume = 1), // Nếu volume không được cung cấp, mặc định là 1
            Sound.getFxAllowed() && (
                // Phát âm thanh, không lặp, INTERRUPT_LATE
                Sound[soundId] = delay ? createjs.Sound.play(soundId, createjs.Sound.INTERRUPT_LATE, delay, 0, !1, volume, 0)
                    : createjs.Sound.play(soundId, createjs.Sound.INTERRUPT_LATE, 0, 0, !1, volume, 0)
            )
        )
    };

    var lastSpawnSoundTime; // Đổi tên 'a' thành 'lastSpawnSoundTime' - lưu thời điểm phát âm thanh spawn cuối cùng
    // Phát âm thanh khi một điểm (design, tech, research, bug) xuất hiện hoặc kết thúc animation
    Sound.playSpawnSound = function (pointType, isEndOfAnimation) { // Đổi tên 'b' thành 'pointType', 'c' thành 'isEndOfAnimation'
        if (!SOUND_DISABLED) {
            // Giới hạn tần suất phát âm thanh spawn nếu cờ được bật
            if (GameFlags.LIMIT_SPAWN_SOUNDS) {
                if (lastSpawnSoundTime && 30 > Date.now() - lastSpawnSoundTime) return; // Nếu âm thanh vừa phát <30ms trước, không phát nữa
                lastSpawnSoundTime = Date.now();
            }
            // Phát âm thanh tại thời điểm spawn HOẶC tại thời điểm kết thúc animation, tùy theo cờ cấu hình
            if (isEndOfAnimation || GameFlags.BUBBLE_SOUND_AT_SPAWN_TIME)
                if (!isEndOfAnimation || GameFlags.BUBBLE_SOUND_AT_END_OF_ANIMATION) "t" === // Điểm Technology
                    pointType ? isEndOfAnimation ? Sound.playSoundOnce("techSpawnEnd", 0.5) : Sound.playSoundOnce("techSpawn", 0.2)
                    : "d" === pointType ? isEndOfAnimation ? Sound.playSoundOnce("designSpawnEnd", 0.5) : Sound.playSoundOnce("designSpawn", 0.2) // Điểm Design
                        : "r" === pointType ? isEndOfAnimation ? Sound.playSoundOnce("researchSpawnEnd", 0.5) : Sound.playSoundOnce("researchSpawn", 0.2) // Điểm Research
                            : "e" === pointType ? isEndOfAnimation ? Sound.playSoundOnce("techSpawnEnd", 0.5) : Sound.playSoundOnce("techSpawn", 0.2) // Có vẻ là một loại điểm tech khác (engine?)
                                : "b" === pointType && (isEndOfAnimation ? Sound.playSoundOnce("bugSpawnEnd", 0.12) : Sound.playSoundOnce("bugSpawn", 0.6)) // Điểm Bug
        }
    };

    // Phát âm thanh click
    Sound.click = function () {
        SOUND_DISABLED || Sound.getFxAllowed() &&
            (Sound.clickSound = createjs.Sound.play("clickSound", createjs.Sound.INTERRUPT_LATE, 0, 0, !1, 0.5, 0))
    };

    var audioLoaded = !1; // Đổi tên 'b' thành 'audioLoaded' - Cờ đánh dấu âm thanh đã tải xong chưa
    // Hàm được gọi sau khi tất cả âm thanh đã được tải
    Sound.playJingle = function () {
        audioLoaded = !0;
        SOUND_DISABLED || Sound._backgroundMusicIsPlaying || ( // Nếu âm thanh chưa tải xong hoặc nhạc nền đang phát thì không làm gì
            Sound.setMasterVolume(Sound.getMasterVolume()), // Đặt âm lượng tổng
            $("#splashScreen").is(":visible") ? // Nếu đang ở màn hình splash
                (Sound.GameDevTycoonTitle = createjs.Sound.play("GameDevTycoonTitle", null, 0, 0, !1, 0.5, 0), // Phát nhạc hiệu
                    Sound.getMusicAllowed() || Sound.GameDevTycoonTitle.setMute(!0)) // Tắt tiếng nếu nhạc không được cho phép
                : Sound.playBackgroundMusic() // Nếu không ở màn hình splash, phát nhạc nền
        )
    };

    // Phát nhạc nền
    Sound.playBackgroundMusic = function () {
        !SOUND_DISABLED &&
            audioLoaded && ( // Chỉ phát nếu âm thanh không bị tắt và đã tải xong
                Sound._backgroundMusicIsPlaying = !0,
                Sound.setMasterVolume(Sound.getMasterVolume()),
                Sound.playBackgroundMusicIsCalled || ( // Nếu chưa từng gọi hàm này
                    Sound.GameDevTycoonTitle && Sound.GameDevTycoonTitle.stop(), // Dừng nhạc hiệu nếu đang phát
                    Sound.changeBackgroundMusic(!0) // Đổi và phát nhạc nền ngay lập tức
                ),
                Sound.playBackgroundMusicIsCalled = !0 // Đánh dấu đã gọi hàm này
            )
    };

    // Bắt đầu phát một bản nhạc nền cụ thể
    Sound.startBackgroundMusic = function (musicId, delay) { // Đổi tên 'a' thành 'musicId', 'b' thành 'delay'
        SOUND_DISABLED || (
            Sound[Sound._currentBackgroundMusic] && Sound[Sound._currentBackgroundMusic].stop(), // Dừng nhạc nền hiện tại nếu có
            Sound._currentBackgroundMusic = musicId, // Cập nhật nhạc nền hiện tại
            // Phát nhạc nền mới, không lặp, âm lượng 0.15
            Sound[Sound._currentBackgroundMusic] = createjs.Sound.play(musicId, null, delay, 0, !1, 0.15, 0),
            // Khi nhạc kết thúc, tự động đổi sang bài khác
            Sound[Sound._currentBackgroundMusic].onComplete = function () {
                Sound.changeBackgroundMusic()
            },
            // Khi nhạc bị gián đoạn, cũng đổi sang bài khác
            Sound[Sound._currentBackgroundMusic].onPlayInterrupted = function () {
                Sound.changeBackgroundMusic()
            },
            // Tắt tiếng nếu nhạc không được cho phép
            Sound.getMusicAllowed() || Sound[Sound._currentBackgroundMusic].setMute(!0)
        )
    };

    // Thay đổi nhạc nền ngẫu nhiên
    Sound.changeBackgroundMusic = function (playImmediately) { // Đổi tên 'a' thành 'playImmediately'
        if (!SOUND_DISABLED) {
            for (var nextMusicId = null; !nextMusicId;) { // Đổi tên 'b' thành 'nextMusicId'
                var currentLevelMusicList; // Đổi tên 'c' thành 'currentLevelMusicList' - danh sách nhạc cho level hiện tại
                GameManager.company ? (
                    currentLevelMusicList = GameManager.company.currentLevel,
                    // Chọn danh sách nhạc dựa trên level của công ty
                    currentLevelMusicList = 1 == currentLevelMusicList ? Sound._backgroundMusic.pickRandom() :
                        2 == currentLevelMusicList ? Sound._backgroundMusic.concat(Sound._backgroundMusic2).pickRandom() :
                            3 == currentLevelMusicList ? Sound._backgroundMusic.concat(Sound._backgroundMusic2.concat(Sound._backgroundMusic3)).pickRandom() :
                                Sound._backgroundMusic.concat(Sound._backgroundMusic2.concat(Sound._backgroundMusic3.concat(Sound._backgroundMusic4))).pickRandom()
                ) : currentLevelMusicList = Sound._backgroundMusic.pickRandom(); // Nếu chưa có công ty (ví dụ màn hình menu), chọn từ danh sách mặc định
                // Đảm bảo nhạc mới khác nhạc hiện tại
                currentLevelMusicList != Sound._currentBackgroundMusic && (nextMusicId = currentLevelMusicList)
            }
            // Phát nhạc mới ngay hoặc sau một khoảng trễ ngẫu nhiên
            playImmediately ? Sound.startBackgroundMusic(nextMusicId) : Sound.startBackgroundMusic(nextMusicId, 9E3 * Math.random())
        }
    };

    // Đặt âm lượng tổng
    Sound.setMasterVolume = function (volume, skipSave) { // Đổi tên 'a' thành 'volume', 'b' thành 'skipSave'
        SOUND_DISABLED || (
            createjs.Sound.setVolume(volume / 100), // Đặt âm lượng cho CreateJS Sound (từ 0 đến 1)
            skipSave || DataStore.setValue("masterVolume", volume) // Lưu cài đặt nếu không yêu cầu bỏ qua
        )
    };

    // Lấy âm lượng tổng
    Sound.getMasterVolume = function () {
        return DataStore.getValue("masterVolume")
    };

    var fxAllowedSetting; // Đổi tên 'c' thành 'fxAllowedSetting' - lưu trữ cài đặt cho phép hiệu ứng âm thanh
    // Kiểm tra xem hiệu ứng âm thanh có được cho phép không
    Sound.getFxAllowed = function () {
        if (void 0 === fxAllowedSetting) { // Nếu chưa có giá trị trong bộ nhớ cache
            var storedFxAllowed = DataStore.getValue("fxAllowed"); // Đổi tên 'a' thành 'storedFxAllowed'
            // Trả về true nếu giá trị lưu trữ là true hoặc chuỗi "true"
            return !0 == storedFxAllowed || "true" == storedFxAllowed
        }
        return fxAllowedSetting; // Trả về giá trị từ bộ nhớ cache
    };

    var musicAllowedSetting; // Đổi tên 'f' thành 'musicAllowedSetting' - lưu trữ cài đặt cho phép nhạc nền
    // Kiểm tra xem nhạc nền có được cho phép không
    Sound.getMusicAllowed = function () {
        if (void 0 === musicAllowedSetting) { // Nếu chưa có giá trị trong bộ nhớ cache
            var storedMusicAllowed = DataStore.getValue("allowBackgroundMusic"); // Đổi tên 'a' thành 'storedMusicAllowed'
            return !0 == storedMusicAllowed || "true" == storedMusicAllowed
        }
        return musicAllowedSetting; // Trả về giá trị từ bộ nhớ cache
    };

    // Cho phép hoặc không cho phép hiệu ứng âm thanh
    Sound.allowFx = function (allow) { // Đổi tên 'a' thành 'allow'
        if (!SOUND_DISABLED) {
            DataStore.setValue("fxAllowed", allow); // Lưu cài đặt
            fxAllowedSetting = allow; // Cập nhật bộ nhớ cache
            // Tắt hoặc bật tiếng cho tất cả các hiệu ứng âm thanh đang phát
            for (var trackIndex = 0; trackIndex < Sound._fxTracks.length; trackIndex++) { // Đổi tên 'b' thành 'trackIndex'
                Sound[Sound._fxTracks[trackIndex]] && Sound[Sound._fxTracks[trackIndex]].setMute(!allow);
            }
            // Ghi log sự kiện thay đổi cài đặt (nếu có)
            ghg4.ghg5("change soundfx settings", {
                setting: allow ? "on" : "off"
            })
        }
    };

    // Cho phép hoặc không cho phép nhạc nền
    Sound.allowMusic = function (allow) { // Đổi tên 'a' thành 'allow'
        SOUND_DISABLED || (
            DataStore.setValue("allowBackgroundMusic", allow), // Lưu cài đặt
            musicAllowedSetting = allow, // Cập nhật bộ nhớ cache
            // Tắt hoặc bật tiếng cho nhạc nền/nhạc hiệu hiện tại
            Sound._currentBackgroundMusic ? Sound[Sound._currentBackgroundMusic] && Sound[Sound._currentBackgroundMusic].setMute(!allow)
                : Sound.GameDevTycoonTitle.setMute(!allow),
            // Ghi log sự kiện thay đổi cài đặt (nếu có)
            ghg4.ghg5("change music settings", {
                setting: allow ? "on" : "off"
            })
        )
    }
})();