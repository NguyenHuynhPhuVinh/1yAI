// --- START OF FILE Character.js ---

// Hằng số định nghĩa thời gian và các yếu tố liên quan đến hiệu ứng trong game
var SPAWN_POINTS_DURATION = 1200; // Thời gian tồn tại của điểm được tạo ra (ms)
var ON_FIRE_DURATION = 5000; // Thời gian hiệu ứng "on fire" (boost mạnh) (ms)
var BOOST_RECHARGE_DURATION = 45000; // Thời gian hồi chiêu của boost (ms)
var EFFICIENCY_RECHARGE_DURATION = 90000; // Thời gian để hồi phục hiệu suất làm việc (ms)

// Enum định nghĩa các trạng thái của nhân vật
var CharacterState = {
    Idle: "Idle", // Rảnh rỗi
    Working: "Working", // Đang làm việc (phát triển game)
    Researching: "Researching", // Đang nghiên cứu
    CreateEngine: "CreateEngine", // Đang tạo game engine
    WorkOnContract: "WorkOnContract", // Đang làm hợp đồng
    Training: "Training", // Đang đào tạo
    Vacation: "Vacation" // Đang nghỉ phép
};

// Enum định nghĩa hướng nhìn/vị trí của nhân vật
var CharacterOrientation = {
    NW: "NW", // Tây Bắc
    NE: "NE", // Đông Bắc
    SW: "SW", // Tây Nam
    SE: "SE"  // Đông Nam
};

// Hàm khởi tạo (constructor) cho đối tượng Character (Nhân vật)
// 'initialParams' là một đối tượng chứa các thông số khởi tạo cho nhân vật
var Character = function (initialParams) {
    // Trạng thái ban đầu của nhân vật, mặc định là Idle
    this.state = initialParams.state ? initialParams.state : CharacterState.Idle;
    this.id = initialParams.id; // ID duy nhất của nhân vật
    this.slot = initialParams.slot; // Vị trí (slot) của nhân vật trong văn phòng
    this.slot || (this.slot = 0); // Nếu slot không được định nghĩa, mặc định là 0
    this.name = initialParams.name; // Tên nhân vật
    this.designFactor = initialParams.dF; // Hệ số kỹ năng thiết kế (Design Factor)
    this.technologyFactor = initialParams.tF; // Hệ số kỹ năng công nghệ (Technology Factor)
    this.workAnimations = ["typing", "thinking", "drawNotepad"]; // Danh sách các animation khi làm việc
    this.idleAnimations = ["sitBack"]; // Danh sách các animation khi rảnh rỗi
    this.working = initialParams.working; // Cờ xác định nhân vật có đang làm việc hay không
    void 0 === this.working && (this.working = !1); // Nếu không xác định, mặc định là không làm việc
    this.speedFactor = initialParams.speedF; // Hệ số tốc độ làm việc
    this.qualityFactor = initialParams.qualityF; // Hệ số chất lượng công việc (ảnh hưởng đến kinh nghiệm ban đầu)
    this.researchFactor = initialParams.researchF; // Hệ số kỹ năng nghiên cứu
    this.salary = initialParams.salary; // Lương của nhân vật
    this.engineProgress = initialParams.engineProgress; // Tiến độ khi đang tạo game engine
    this.contractProgress = initialParams.contractProgress; // Tiến độ khi đang làm hợp đồng
    this.bugFixingDelta = initialParams.bugFixingDelta; // Biến tạm dùng trong quá trình sửa lỗi
    this.relaxDelta = 0; // Biến tạm dùng cho việc nghỉ ngơi
    initialParams.relaxDelta && (this.relaxDelta = initialParams.relaxDelta);
    this.currentFeature = null; // Tính năng game hiện tại đang làm
    this.currentResearch = null; // Nghiên cứu hiện tại đang thực hiện
    // Kinh nghiệm của nhân vật, nếu không có thì tính dựa trên qualityFactor
    this.experience = initialParams.experience ? initialParams.experience : LevelCalculator.getXpForLevel(5 * this.qualityFactor);
    this.onFire = !1; // Cờ xác định nhân vật có đang trong trạng thái "on fire" (boost)
    this.boostRechargeProgress = 0; // Tiến độ hồi chiêu boost
    this.maxBoostLevel = 0; // Cấp độ boost tối đa có thể đạt được
    void 0 != initialParams.onFire && (this.onFire = initialParams.onFire);
    void 0 != initialParams.maxBoostLevel && (this.maxBoostLevel = initialParams.maxBoostLevel);
    initialParams.boostRechargeProgress && (this.boostRechargeProgress = initialParams.boostRechargeProgress);
    void 0 != initialParams.boostLevel && (this.boostLevel = initialParams.boostLevel);
    this.efficiency = 1; // Hiệu suất làm việc hiện tại (tối đa là 1)
    void 0 != initialParams.efficiency && (this.efficiency = initialParams.efficiency);
    this.flags = {}; // Các cờ trạng thái khác của nhân vật
    initialParams.flags && (this.flags = initialParams.flags);
    this.currentAnimation = initialParams.currentAnimation ? initialParams.currentAnimation : null; // Animation hiện tại đang phát
    this.nextAnimation = initialParams.nextAnimation ? initialParams.nextAnimation : null; // Animation sẽ phát tiếp theo
    initialParams.currentFeature && (this.currentFeature = initialParams.currentFeature);
    this.spawnedPoints = []; // Danh sách các điểm (design, tech, bug) đã được tạo ra
    // Nếu có spawnedPoints từ dữ liệu lưu, tải chúng
    initialParams.spawnedPoints && (this.spawnedPoints = initialParams.spawnedPoints.map(function (pointData) {
        return SpawnedPointsSerializer.load(pointData);
    }));
    this.visualData = initialParams.visual; // Dữ liệu hình ảnh của nhân vật (có thể là trạng thái của CharacterOverlay)
    this.sex = initialParams.sex; // Giới tính của nhân vật
    // Các điểm design/tech/research còn sót lại từ công việc trước để cộng dồn vào công việc sau
    this.dLeft = initialParams.dLeft ? initialParams.dLeft : 0; // Design points left over
    this.tLeft = initialParams.tLeft ? initialParams.tLeft : 0; // Technology points left over
    this.rLeft = initialParams.rLeft ? initialParams.rLeft : 0; // Research points left over
};

(function () {
    Character.BASE_SALARY_PER_LEVEL = 10000; // Lương cơ bản tăng thêm cho mỗi cấp độ

    // Phương thức tĩnh để tải dữ liệu nhân vật từ đối tượng đã lưu
    Character.load = function (characterData) {
        return new Character(characterData);
    };

    var characterProto = Character.prototype; // Lấy prototype của Character để thêm phương thức

    // Lấy cấp độ hiện tại của nhân vật (bao gồm cả phần trăm lên cấp tiếp theo)
    characterProto.getLevelF = function () {
        return LevelCalculator.getLevelFractional(this.experience);
    };

    // Lấy cấp độ hiện tại của nhân vật (số nguyên)
    characterProto.getLevel = function () {
        return LevelCalculator.getLevel(this.experience);
    };

    // Lấy điểm kỹ năng nghiên cứu
    characterProto.getResearchSkillPoints = function () {
        return Math.floor(500 * this.researchFactor);
    };

    // Lấy điểm kỹ năng thiết kế
    characterProto.getDesignSkillPoints = function () {
        return Math.floor(500 * this.designFactor);
    };

    // Lấy điểm kỹ năng công nghệ
    characterProto.getTechnologySkillPoints = function () {
        return Math.floor(500 * this.technologyFactor);
    };

    // Lấy điểm kỹ năng tốc độ
    characterProto.getSpeedSkillPoints = function () {
        return Math.floor(500 * this.speedFactor);
    };

    // Lấy hướng của nhân vật dựa trên level hiện tại của công ty và slot của nhân vật
    characterProto.getOrientation = function () {
        var currentCompanyLevel = GameManager.company.currentLevel;
        if (1 === currentCompanyLevel) return CharacterOrientation.NW;
        if (2 === currentCompanyLevel || 3 === currentCompanyLevel || 4 == currentCompanyLevel) {
            // Quy tắc phức tạp hơn để xác định hướng dựa trên slot
            return 0 === this.slot || 1 === this.slot || 3 === this.slot || 5 === this.slot ?
                CharacterOrientation.NW : CharacterOrientation.SE;
        }
        // Mặc định hoặc các trường hợp khác (nếu có)
    };

    // Làm mới (hiển thị lại) các điểm đã được tạo ra cho nhân vật này
    characterProto.refreshPoints = function () {
        var characterOverlay = VisualsManager.getCharacterOverlay(this);
        for (var i = 0; i < this.spawnedPoints.length; i++) {
            var spawnedPointData = this.spawnedPoints[i];
            var animationInstance; // Biến lưu trữ instance của animation điểm
            // Tạo animation cho điểm tùy theo loại
            if (animationInstance = "br" === spawnedPointData.type ? // "br" là bug removed
                characterOverlay.spawnBugRemovePoint(spawnedPointData.id, spawnedPointData.type, spawnedPointData.duration) :
                characterOverlay.spawnPoint(spawnedPointData.id, spawnedPointData.type, spawnedPointData.duration)) {
                // Đặt vị trí animation dựa trên thời gian đã trôi qua
                for (var j = 0; j < animationInstance.length; j++) {
                    animationInstance[j].setPosition(GameManager.gameTime - spawnedPointData.gameTime);
                }
            }
        }
    };

    // Kiểm tra xem nhân vật có đang rảnh rỗi không
    characterProto.isIdle = function () {
        return this.state === CharacterState.Idle;
    };

    // Kiểm tra xem nhân vật có thể bắt đầu nghiên cứu không
    characterProto.canStartResearch = function () {
        return this.isIdle();
    };

    // Lưu trạng thái hiện tại của nhân vật thành một đối tượng
    characterProto.save = function () {
        var saveData = {};
        saveData.id = this.id;
        saveData.state = this.state;
        saveData.name = this.name;
        saveData.dF = this.designFactor;
        saveData.tF = this.technologyFactor;
        saveData.speedF = this.speedFactor;
        saveData.qualityF = this.qualityFactor;
        saveData.experience = this.experience;
        saveData.researchF = this.researchFactor;
        saveData.salary = this.salary;
        saveData.engineProgress = this.engineProgress;
        saveData.contractProgress = this.contractProgress;
        saveData.bugFixingDelta = this.bugFixingDelta;
        saveData.relaxDelta = this.relaxDelta;
        saveData.slot = this.slot;
        saveData.working = this.working;
        saveData.currentAnimation = this.currentAnimation;
        saveData.nextAnimation = this.nextAnimation;
        saveData.onFire = this.onFire;
        saveData.maxBoostLevel = this.maxBoostLevel;
        saveData.boostRechargeProgress = this.boostRechargeProgress;
        saveData.boostLevel = this.boostLevel;
        saveData.efficiency = this.efficiency;
        saveData.flags = this.flags;
        this.currentFeature && (saveData.currentFeature = this.currentFeature);
        // Lưu danh sách các điểm đã tạo
        this.spawnedPoints && (saveData.spawnedPoints = this.spawnedPoints.map(function (pointData) {
            return SpawnedPointsSerializer.save(pointData);
        }));
        saveData.visual = VisualsManager.getCharacterOverlay(this).saveState(); // Lưu trạng thái visual
        saveData.sex = this.sex;
        saveData.dLeft = this.dLeft;
        saveData.tLeft = this.tLeft;
        saveData.rLeft = this.rLeft;
        return saveData;
    };

    // Điều chỉnh tiến độ hồi chiêu boost
    characterProto.adjustBoostRechargeProgress = function (amount) {
        this.boostRechargeProgress = (this.boostRechargeProgress + amount).clamp(0, 1);
    };

    // Lấy hiệu suất làm việc tối đa (luôn là 1)
    characterProto.getMaxEfficiency = function () {
        return 1;
    };

    // Điều chỉnh hiệu suất làm việc hiện tại
    characterProto.adjustEfficiency = function (amount) {
        this.efficiency = (this.efficiency + amount).clamp(0.001, this.getMaxEfficiency());
    };

    // Hàm tick, được gọi mỗi frame để cập nhật trạng thái nhân vật
    characterProto.tick = function () {
        // Khởi tạo lastUpdate nếu chưa có
        this.lastUpdate || (this.lastUpdate = GameManager.gameTime);
        var deltaTime = GameManager.gameTime - this.lastUpdate; // Thời gian trôi qua từ lần cập nhật trước
        var canRegenerateEfficiency = !0;

        // Xử lý việc nhân viên cần nghỉ phép (nếu không phải nhân vật chính và không đang "on fire")
        if (0 != this.id && !this.onFire && this.flags.nextVacation < GameManager.gameTime) {
            this.flags.needsVacation = !0;
            this.adjustEfficiency(-deltaTime / EFFICIENCY_RECHARGE_DURATION); // Giảm hiệu suất
            Tutorial.needsAHoliday(); // Hiển thị hướng dẫn cần nghỉ phép
            canRegenerateEfficiency = !1; // Không cho hồi hiệu suất tự nhiên nữa
        }

        // Nếu hiệu suất chưa tối đa và có thể hồi, thì hồi hiệu suất
        if (1 != this.efficiency && canRegenerateEfficiency) {
            this.adjustEfficiency(deltaTime / EFFICIENCY_RECHARGE_DURATION);
        }

        // Nếu nhân vật đang rảnh
        if (this.isIdle()) {
            // Và có game đang được phát triển, chưa hoàn thành, và nhân vật chưa làm tính năng nào
            if (GameManager.currentFeature && 1 > GameManager.currentFeature.progress && null === this.currentFeature) {
                this._resetBugFixingWork(); // Reset biến tạm sửa lỗi
                this._calcFeature(); // Tính toán công việc cho tính năng hiện tại
                this.state = CharacterState.Working;
                this.working = !0;
            }
            // Hoặc có game đang phát triển, chưa hoàn thành (nhưng nhân vật có thể đã có currentFeature từ trước)
            else if (GameManager.currentFeature && 1 > GameManager.currentFeature.progress) {
                this.state = CharacterState.Working;
                this.working = !0;
            }
            // Hoặc đang tạo game engine
            else if (GameManager.currentEngineDev) {
                this._resetEngineWork(); // Reset biến tạm tạo engine
                this.state = CharacterState.CreateEngine;
                this.working = !0;
            }
            // Hoặc đang làm hợp đồng loại generic
            else if (GameManager.currentContract && GameManager.currentContract.isGenericContract) {
                this._resetContractWork(); // Reset biến tạm làm hợp đồng
                this.state = CharacterState.WorkOnContract;
                this.working = !0;
            }
        }

        // Thực hiện công việc dựa trên trạng thái hiện tại
        if (this.state === CharacterState.Working) {
            this._doWork(deltaTime);
        } else if (this.state === CharacterState.Researching) {
            this._doResearch(deltaTime);
        } else if (this.state === CharacterState.CreateEngine) {
            this._doEngineWork(deltaTime);
        } else if (this.state === CharacterState.WorkOnContract) {
            this._doContractWork(deltaTime);
        } else if (this.state === CharacterState.Vacation) {
            this._doRelax(deltaTime);
            // Nếu đang nghỉ và animation là "sitBack", giảm độ mờ của animation ngồi xuống mức tối thiểu
            if ("sitBack" === this.currentAnimation) {
                var characterOverlay = VisualsManager.getCharacterOverlay(this);
                if (0.5 < characterOverlay.sitBackAnimation.alpha) {
                    characterOverlay.sitBackAnimation.alpha = Math.max(characterOverlay.sitBackAnimation.alpha - deltaTime / 3000, 0.5);
                }
            }
        }

        // Xử lý trạng thái "onFire" (boost)
        if (this.onFire && "thinking" != this.currentAnimation) {
            var boostRemainingProgress = this.boostRechargeProgress - deltaTime / ON_FIRE_DURATION;
            if (0 >= boostRemainingProgress) { // Hết thời gian "on fire" cho cấp độ hiện tại
                if (void 0 != this.boostLevel && 0 < this.boostLevel) { // Nếu còn cấp độ boost
                    this.boostLevel--;
                    this.boostRechargeProgress = 1 - boostRemainingProgress; // Bắt đầu hồi chiêu lại
                } else { // Hết sạch boost
                    VisualsManager.getCharacterOverlay(this).setOnFire(!1); // Tắt hiệu ứng hình ảnh
                    this.boostLevel = 0;
                    this.onFire = !1;
                }
            } else {
                this.boostRechargeProgress = boostRemainingProgress;
            }
        }
        // Nếu không "onFire" và có thể tăng cấp boost và chưa hồi chiêu đầy đủ
        else if (this.maxBoostLevel > this.boostLevel && 1 > this.boostRechargeProgress) {
            var rechargeAmount = deltaTime / BOOST_RECHARGE_DURATION;
            if (this.state === CharacterState.Idle) { // Hồi chiêu chậm hơn khi rảnh
                rechargeAmount *= 0.5;
            }
            var newBoostRechargeProgress = this.boostRechargeProgress + rechargeAmount;
            if (1 != this.boostRechargeProgress && 1 <= newBoostRechargeProgress) { // Đã hồi chiêu đủ 1 cấp
                this.boostLevel ? this.boostLevel++ : this.boostLevel = 1;
                newBoostRechargeProgress = 0; // Reset tiến độ hồi chiêu cho cấp tiếp theo
            }
            this.boostRechargeProgress = newBoostRechargeProgress.clamp(0, 1);
        }

        // Nếu không nghỉ phép và animation là "sitBack", tăng độ mờ của animation ngồi
        if (this.state != CharacterState.Vacation && "sitBack" === this.currentAnimation) {
            var characterOverlay = VisualsManager.getCharacterOverlay(this);
            if (1 > characterOverlay.sitBackAnimation.alpha) {
                characterOverlay.sitBackAnimation.alpha = Math.min(characterOverlay.sitBackAnimation.alpha + deltaTime / 3000, 1);
            }
        }

        this.lastUpdate = GameManager.gameTime; // Cập nhật thời gian cuối cùng
    };

    // Lấy hệ số boost hiện tại
    characterProto.getBoostFactor = function () {
        if (!this.onFire) return 1;
        var currentBoostLevel = this.boostLevel;
        currentBoostLevel || (currentBoostLevel = 1); // Nếu boostLevel không xác định, coi như là 1
        return 1 + 0.25 * (currentBoostLevel + 1);
    };

    // Bắt đầu các animation ban đầu của nhân vật
    characterProto.startAnimations = function () {
        var characterOverlay = VisualsManager.getCharacterOverlay(this, !0); // Lấy overlay, không tạo mới nếu không có
        if (characterOverlay) {
            this.currentAnimation = "sitBack";
            this.loopCount = 1; // Số lần lặp animation (có thể không dùng đến)
            characterOverlay.startSitBackLoop();
        }
    };

    // Đánh dấu nhân vật bắt đầu làm việc (ảnh hưởng đến animation)
    characterProto.startWorking = function () {
        this.working = !0;
    };

    // Đánh dấu nhân vật kết thúc làm việc
    characterProto.endWorking = function () {
        this.working = !1;
    };

    // Chuyển sang animation tiếp theo
    characterProto.playNextAnimation = function () {
        this.currentAnimation = this.nextAnimation;
        this.nextAnimation = void 0;
        var characterOverlay = VisualsManager.getCharacterOverlay(this, !0);
        if (characterOverlay) {
            if ("typing" === this.currentAnimation) characterOverlay.startTyping();
            else if ("thinking" === this.currentAnimation) characterOverlay.startThinking();
            else if ("drawNotepad" === this.currentAnimation) characterOverlay.startDrawNotepad();
        }
    };

    // Phát một animation rảnh rỗi ngẫu nhiên
    characterProto.playRandomIdleAnimation = function () {
        var characterOverlay = VisualsManager.getCharacterOverlay(this, !0);
        if (characterOverlay) {
            this.currentAnimation = "sitBack"; // Hiện tại chỉ có sitBack
            characterOverlay.startSitBack();
        }
    };

    // Kích hoạt boost
    characterProto.activateBoost = function () {
        this.onFire = !0;
        VisualsManager.getCharacterOverlay(this).setOnFire(!0);
    };

    // Được gọi khi một vòng lặp animation kết thúc
    characterProto.loopEnded = function () {
        if (0 < VisualsManager.characterOverlays.length) {
            var characterOverlay = VisualsManager.getCharacterOverlay(this, !0);
            if (characterOverlay) {
                if ("typing" === this.currentAnimation) {
                    if (!1 === this.working) { // Nếu không còn làm việc nữa
                        GameManager.workEnded(this); // Thông báo cho GameManager
                        characterOverlay.endTyping(); // Kết thúc animation gõ phím
                    } else if (GameManager.IsAnimationSwitchAllowed(this)) { // Nếu được phép chuyển animation
                        for (; ;) { // Vòng lặp để chọn animation làm việc tiếp theo ngẫu nhiên
                            this.nextAnimation = this.workAnimations.pickRandom();
                            if ("thinking" === this.nextAnimation && !this.onFire) {
                                // Tỷ lệ chuyển sang "thinking" phụ thuộc vào speedFactor
                                var thinkingChance = 0.3 - (0.25 * this.speedFactor).clamp(0, 0.25);
                                if (GameManager.company.getRandom() < thinkingChance) break;
                            } else if ("drawNotepad" === this.nextAnimation && 0.5 < GameManager.company.getRandom()) {
                                break;
                            } else if ("typing" === this.nextAnimation) { // Nếu vẫn là typing thì tiếp tục
                                this.nextAnimation = void 0;
                                characterOverlay.continueTyping();
                                return;
                            }
                        }
                        characterOverlay.endTyping(); // Kết thúc animation hiện tại để chuyển sang nextAnimation
                    } else {
                        characterOverlay.continueTyping(); // Nếu không được chuyển, tiếp tục typing
                    }
                } else if ("thinking" === this.currentAnimation) {
                    this.nextAnimation = "typing";
                    characterOverlay.endThinking();
                } else if ("sitBack" === this.currentAnimation) {
                    if (!0 === this.working) { // Nếu đang làm việc thì chuyển sang typing
                        this.nextAnimation = "typing";
                        characterOverlay.endSitBack();
                    } else { // Nếu không làm việc nữa
                        GameManager.workEnded(this);
                        characterOverlay.continueSitBack(); // Tiếp tục ngồi
                    }
                } else if ("drawNotepad" === this.currentAnimation) {
                    this.nextAnimation = "typing";
                    characterOverlay.endDrawNotepad();
                }
            }
        }
    };

    // Được gọi khi một animation (không phải lặp) kết thúc hoàn toàn
    characterProto.animationEnded = function (animationType) {
        if (this.currentAnimation === animationType) {
            if (this.working) { // Nếu vẫn đang làm việc
                this.nextAnimation || (this.nextAnimation = "typing"); // Mặc định chuyển sang typing
                this.playNextAnimation();
            } else { // Nếu không làm việc nữa
                this.playRandomIdleAnimation(); // Chuyển sang idle
                GameManager.workEnded(this);
            }
        }
    };

    // Thực hiện công việc nghiên cứu
    characterProto._doResearch = function (deltaTime) {
        // Không làm gì nếu đang "thinking", thời gian trôi qua là 0, hoặc không được đánh dấu là đang làm việc
        if ("thinking" != this.currentAnimation && !(0 >= deltaTime || !1 === this.working)) { // Sửa: this.isWorking() -> this.working
            deltaTime -= deltaTime / 2 * (1 - this.efficiency); // Giảm thời gian hiệu quả dựa trên hiệu suất
            var currentResearchProgress = this.currentResearch;
            var progressAmount = deltaTime / currentResearchProgress.duration; // Lượng tiến độ dựa trên thời gian và tổng thời gian nghiên cứu
            progressAmount = progressAmount * this.getBoostFactor(); // Nhân với hệ số boost

            if (currentResearchProgress.isTraining) {
                this._doTraining(currentResearchProgress, deltaTime); // Nếu là đào tạo, thực hiện logic đào tạo
            }

            GameManager.increaseResearchProgress(this, progressAmount); // Tăng tiến độ nghiên cứu chung
        }
    };

    // Hoàn thành một khóa đào tạo
    characterProto.finishTraining = function (trainingData) {
        this.flags.lastTrainingTimestamp = GameManager.gameTime;
        this.flags.secondLastTrainingId = this.flags.lastTrainingId;
        this.flags.lastTrainingId = trainingData.id;
    };

    // Thực hiện công việc đào tạo
    characterProto._doTraining = function (currentResearchData, deltaTime) {
        var company = GameManager.company;
        var trainingDetails = Training.getAllTrainings().first(function (training) {
            return training.id === currentResearchData.id;
        });

        if (trainingDetails) {
            if (trainingDetails.tick) { // Nếu khóa đào tạo có hàm tick riêng
                trainingDetails.tick(this, deltaTime);
            } else { // Logic đào tạo mặc định
                var skillPointsGenerated = [];
                if (void 0 === this.currentResearch.lastSpawnTick) {
                    this.currentResearch.lastSpawnTick = 0;
                } else {
                    var currentTimeInResearch = currentResearchData.duration * currentResearchData.progress;
                    if (2000 <= currentTimeInResearch - currentResearchData.lastSpawnTick) { // Tạo điểm kỹ năng sau mỗi 2 giây (trong thời gian nghiên cứu)
                        currentResearchData.lastSpawnTick = currentTimeInResearch;
                        var currentEfficiency = this.efficiency * this.getBoostFactor();

                        // Giảm hiệu quả đào tạo nếu đang "on fire" hoặc đào tạo liên tục, hoặc đã lâu không ra game
                        if (!this.onFire) {
                            if (this.flags.lastTrainingTimestamp && this.flags.lastTrainingTimestamp > GameManager.gameTime - 10000 * GameManager.SECONDS_PER_WEEK) {
                                currentEfficiency -= 0.2;
                            } else {
                                this.flags.lastTrainingId = null;
                                this.flags.secondLastTrainingId = null;
                            }
                            if (this.flags.secondLastTrainingId === trainingDetails.id) currentEfficiency -= 0.1;
                            if (this.flags.lastTrainingId === trainingDetails.id) currentEfficiency -= 0.3;

                            var lastGame = company.gameLog.last();
                            if (company.currentWeek > lastGame.releaseWeek + 22) currentEfficiency -= 0.2;
                        }

                        currentEfficiency = Math.max(0.3, currentEfficiency); // Hiệu quả tối thiểu là 0.3
                        var basePointsGain = trainingDetails.basePoints * currentEfficiency;

                        // Tính toán điểm cho từng kỹ năng dựa trên hệ số của khóa đào tạo và ngẫu nhiên
                        var techPoints = Math.floor(trainingDetails.tF * basePointsGain * company.getRandom());
                        var designPoints = Math.floor(trainingDetails.dF * basePointsGain * company.getRandom());
                        var researchPoints = Math.floor(trainingDetails.rF * basePointsGain * company.getRandom());
                        var speedPoints = Math.floor(trainingDetails.sF * basePointsGain * company.getRandom());
                        company.getRandom(); // Gọi để đảm bảo tính nhất quán của random (nếu cần)

                        var maxSkillPointsFactor = trainingDetails.maxP / 500;
                        var randomChance = company.getRandom();

                        // Thêm điểm nếu chưa đạt max hoặc có một chút may mắn
                        if (techPoints && (this.technologyFactor + techPoints / 500 <= maxSkillPointsFactor || 0.1 > randomChance)) {
                            skillPointsGenerated.push({ p: techPoints, t: "t" });
                        }
                        if (designPoints && (this.designFactor + designPoints / 500 <= maxSkillPointsFactor || 0.1 > randomChance)) {
                            skillPointsGenerated.push({ p: designPoints, t: "d" });
                        }
                        if (researchPoints && (this.researchFactor + researchPoints / 500 < maxSkillPointsFactor || 0.1 > randomChance)) {
                            skillPointsGenerated.push({ p: researchPoints, t: "r" });
                            // Nếu là specialTraining, tạo thêm điểm research visual
                            if ("specialTraining" === currentResearchData.type) this.spawnPoints(researchPoints, "r");
                        }
                        if (speedPoints && (this.speedFactor + speedPoints / 500 < maxSkillPointsFactor || 0.1 > randomChance)) {
                            skillPointsGenerated.push({ p: speedPoints, t: "s" });
                        }
                        VisualsManager.getCharacterOverlay(this, !0).animateTrainingProgress(skillPointsGenerated);
                    }
                }
            }
        }
    };

    // Áp dụng điểm kỹ năng nhận được từ đào tạo
    characterProto.applyTrainingUpdate = function (skillUpdate) {
        var pointsToAdd = skillUpdate.p / 500;
        switch (skillUpdate.t) {
            case "t": this.technologyFactor += pointsToAdd; break;
            case "d": this.designFactor += pointsToAdd; break;
            case "s": this.speedFactor += pointsToAdd; break;
            case "r": this.researchFactor += pointsToAdd; break;
        }
    };

    // Reset tiến độ tạo engine
    characterProto._resetEngineWork = function () {
        this.engineProgress = { points: 0, research: 0 };
    };

    // Reset tiến độ làm hợp đồng
    characterProto._resetContractWork = function () {
        this.contractProgress = { d: 0, t: 0, r: 0 };
    };

    // Reset biến tạm sửa lỗi
    characterProto._resetBugFixingWork = function () {
        this.bugFixingDelta = 0;
    };

    // Lấy hệ số chất lượng hiện tại (dựa trên kinh nghiệm và qualityFactor gốc)
    characterProto.getCurrentQualityFactor = function () {
        var baseQuality = 0.3;
        if (0 === this.id) { // Nhân vật chính có bonus dựa trên level
            var currentLevel = LevelCalculator.getLevel(this.experience);
            if (1 == currentLevel) baseQuality += 0.3;
            else if (2 == currentLevel) baseQuality += 0.2;
            else if (3 == currentLevel) baseQuality += 0.1;
        }
        baseQuality += this.qualityFactor;
        // Nếu vượt quá 1, thì giảm dần ảnh hưởng của phần vượt
        return 1 < baseQuality ? 1 + 0.5 * (baseQuality - 1) : baseQuality;
    };

    // Thực hiện công việc tạo game engine
    characterProto._doEngineWork = function (deltaTime) {
        if ("thinking" != this.currentAnimation && !(0 >= deltaTime || !1 === this.working)) {
            deltaTime /= Missions.BASE_ENGINE_DURATION; // Chuẩn hóa thời gian
            var pointsGenerated = Missions.BASE_POINTS * this.getCurrentQualityFactor() * deltaTime * this.efficiency;
            pointsGenerated = pointsGenerated * this.getBoostFactor();

            var previousEnginePoints = this.engineProgress.points;
            this.engineProgress.points += pointsGenerated;
            // Nếu số điểm nguyên thay đổi, tạo điểm visual
            if (Math.floor(this.engineProgress.points) > Math.floor(previousEnginePoints)) {
                var pointsToSpawn = Math.floor(this.engineProgress.points) - Math.floor(previousEnginePoints);
                // Giới hạn điểm tạo ra bằng số điểm còn lại của engine
                if (GameManager.currentEngineDev.remainingPoints < pointsToSpawn) {
                    pointsToSpawn = GameManager.currentEngineDev.remainingPoints;
                }
                if (0 != pointsToSpawn) {
                    this.spawnPoints(pointsToSpawn, "e"); // "e" for engine points
                } else if (0 === GameManager.currentEngineDev.remainingPoints && 0 >= GameManager.currentEngineDev.remainingPointsDisplay) {
                    this.endWorking(); // Hoàn thành nếu không còn điểm nào
                }
            }

            var previousResearchPoints = this.engineProgress.research;
            this.engineProgress.research += Missions.BASE_RESEARCH_POINTS / 2 * this.researchFactor * deltaTime * this.efficiency;
            if (Math.floor(this.engineProgress.research) > Math.floor(previousResearchPoints)) {
                var researchToSpawn = Math.floor(this.engineProgress.research) - Math.floor(previousResearchPoints);
                if (0 != researchToSpawn) {
                    this.spawnPoints(researchToSpawn, "r");
                }
            }
        }
    };

    // Thực hiện công việc làm hợp đồng
    characterProto._doContractWork = function (deltaTime) {
        if ("thinking" != this.currentAnimation && this.working) { // Sửa: isWorking -> working
            var currentContract = GameManager.currentContract;
            var company = GameManager.company;
            if (currentContract && company) {
                deltaTime /= Missions.BASE_ENGINE_DURATION; // Chuẩn hóa thời gian
                var basePointsGenerated = Missions.BASE_POINTS * this.getCurrentQualityFactor() * deltaTime * this.efficiency;
                basePointsGenerated /= 2; // Chia đều cho design và tech (hoặc chỉ 1 nếu chỉ cần 1 loại)

                var needsDesign = 0 < currentContract.requiredD - currentContract.spawnedD;
                var needsTech = 0 < currentContract.requiredT - currentContract.spawnedT;

                if (needsDesign || needsTech) {
                    if (!needsDesign || !needsTech) { // Nếu chỉ cần 1 loại, tăng điểm cho loại đó
                        basePointsGenerated += 0.4 * basePointsGenerated;
                    }
                    if (needsDesign) {
                        var designGain = basePointsGenerated * this.designFactor;
                        designGain = designGain + 0.2 * designGain * company.getRandom(); // Thêm chút ngẫu nhiên
                        var previousDesignProgress = this.contractProgress.d;
                        this.contractProgress.d += designGain;
                        if (Math.floor(this.contractProgress.d) > Math.floor(previousDesignProgress)) {
                            var pointsToSpawn = Math.floor(this.contractProgress.d) - Math.floor(previousDesignProgress);
                            if (currentContract.remainingD < pointsToSpawn) pointsToSpawn = currentContract.remainingD;
                            if (0 != pointsToSpawn) {
                                this.spawnPoints(pointsToSpawn, "d");
                                currentContract.remainingD -= pointsToSpawn;
                                currentContract.spawnedD += pointsToSpawn;
                            }
                        }
                    }
                    if (needsTech) {
                        var techGain = basePointsGenerated * this.technologyFactor;
                        techGain += 0.2 * techGain * company.getRandom();
                        var previousTechProgress = this.contractProgress.t;
                        this.contractProgress.t += techGain;
                        if (Math.floor(this.contractProgress.t) > Math.floor(previousTechProgress)) {
                            var pointsToSpawn = Math.floor(this.contractProgress.t) - Math.floor(previousTechProgress);
                            if (currentContract.remainingT < pointsToSpawn) pointsToSpawn = currentContract.remainingT;
                            if (0 != pointsToSpawn) {
                                this.spawnPoints(pointsToSpawn, "t");
                                currentContract.remainingT -= pointsToSpawn;
                                currentContract.spawnedT += pointsToSpawn;
                            }
                        }
                    }
                    // Tạo điểm research phụ trợ
                    var researchGain = basePointsGenerated * this.researchFactor / 6;
                    if (currentContract.rF) researchGain *= currentContract.rF; // Nếu hợp đồng có hệ số research
                    var previousResearchProgress = this.contractProgress.r;
                    this.contractProgress.r += researchGain;
                    if (Math.floor(this.contractProgress.r) > Math.floor(previousResearchProgress)) {
                        var pointsToSpawn = Math.floor(this.contractProgress.r) - Math.floor(previousResearchProgress);
                        if (0 != pointsToSpawn) this.spawnPoints(pointsToSpawn, "r");
                    }
                } else {
                    this.endWorking(); // Hoàn thành nếu không cần điểm nào nữa
                }
            } else {
                this.endWorking(); // Kết thúc nếu không có hợp đồng hoặc công ty
            }
        }
    };

    // Kiểm tra xem nhân vật có đang thực sự làm việc (animation phù hợp)
    characterProto.isWorking = function () { // Sửa: Thêm dấu ()
        if ("typing" === this.currentAnimation || "drawNotepad" === this.currentAnimation) return !0;
        // Nếu được đánh dấu là working và đang ngồi, thì tiếp tục ngồi
        if (this.working && "sitBack" === this.currentAnimation) {
            var characterOverlay = VisualsManager.getCharacterOverlay(this, !0);
            characterOverlay && characterOverlay.continueSitBack();
        }
        return !1;
    };

    // Thực hiện việc nghỉ ngơi
    characterProto._doRelax = function (deltaTime) {
        if ("sitBack" === this.currentAnimation) {
            this.relaxDelta += deltaTime;
            if (10 < this.relaxDelta * this.speedFactor) { // Sau một khoảng thời gian nhất định
                this.relaxDelta = 0;
                this.flags.relaxGained += 0.001; // Tăng điểm nghỉ ngơi đã đạt được
                this.adjustEfficiency(0.001); // Hồi phục một chút hiệu suất
                // Nếu hiệu suất đã tối đa và đã nghỉ đủ, quay lại Idle
                if (this.efficiency === this.getMaxEfficiency() && 0.3 <= this.flags.relaxGained) {
                    this.state = CharacterState.Idle;
                }
            }
        }
    };

    // Thực hiện công việc phát triển game
    characterProto._doWork = function (deltaTime) {
        if (GameManager.currentFeature) {
            var currentFeatureData = this.currentFeature;
            // Khởi tạo thời gian bắt đầu và tiến độ nếu chưa có
            if (void 0 === currentFeatureData.startTime) {
                currentFeatureData.startTime = GameManager.gameTime;
                currentFeatureData.progress = 0;
            }

            var company = GameManager.company;
            // Nếu đang "thinking" (và chỉ có 1 người làm tính năng này) hoặc đang "sitBack", chỉ tăng thời gian bắt đầu (không tạo điểm)
            if (("thinking" === this.currentAnimation && 1 === GameManager.staffCountWorkingOnFeature(this.currentFeature)) || "sitBack" === this.currentAnimation) {
                currentFeatureData.startTime += deltaTime;
            }
            // Nếu đang sửa lỗi
            else if ("BugFixing" === currentFeatureData.id) {
                this._doFinishingWork(company, deltaTime);
            }
            // Phát triển tính năng bình thường
            else {
                var boostFactor = this.getBoostFactor();
                var onFireBonus = this.onFire ? (boostFactor - 1) / 2 : 0; // Bonus thêm khi "on fire"
                var qualityMultiplier = 0.44 + 0.5 * this.getCurrentQualityFactor().clamp(0, 1);
                var timeElapsedOnFeature = GameManager.gameTime - currentFeatureData.startTime;

                if (!(0 >= timeElapsedOnFeature)) { // Chỉ xử lý nếu đã có thời gian trôi qua
                    var progressRatio = timeElapsedOnFeature / currentFeatureData.duration; // Tỷ lệ tiến độ dựa trên thời gian
                    if (0 != progressRatio && 1 != this.currentFeature.progress) {
                        // Nếu vượt quá 100%, giảm deltaTime để không tính dư
                        if (1 < progressRatio) {
                            deltaTime -= currentFeatureData.duration * (progressRatio - 1);
                        }
                        progressRatio = Math.min(progressRatio, 1); // Giới hạn tiến độ ở 100%
                        currentFeatureData.progress = progressRatio;

                        if (1 >= progressRatio) { // Chỉ tạo điểm khi chưa hoàn thành 100%
                            var currentEfficiency = this.efficiency;
                            var staffCountOnFeature = GameManager.staffCountWorkingOnFeature(currentFeatureData);
                            var optimalTeamSize = General.getOptimalTeamSize(GameManager.company.currentGame);
                            // Hệ số hiệu quả dựa trên số lượng người làm và kích thước đội tối ưu
                            var teamEfficiencyFactor = (optimalTeamSize / staffCountOnFeature).clamp(0, 1);
                            var effectiveDeltaTime = deltaTime * currentEfficiency * (1 === optimalTeamSize ? teamEfficiencyFactor : 0.5 + 0.5 * teamEfficiencyFactor);

                            // Tăng tiến độ tích lũy cho các loại điểm
                            currentFeatureData.currentDf += currentFeatureData.d / currentFeatureData.duration * effectiveDeltaTime;
                            currentFeatureData.currentTf += currentFeatureData.t / currentFeatureData.duration * effectiveDeltaTime;
                            currentFeatureData.currentRf += currentFeatureData.r / currentFeatureData.duration * effectiveDeltaTime;

                            var designPointsToSpawn = Math.floor(currentFeatureData.currentDf);
                            var techPointsToSpawn = Math.floor(currentFeatureData.currentTf);
                            var researchPointsToSpawn = Math.floor(currentFeatureData.currentRf);

                            // Tạo điểm design
                            if (designPointsToSpawn > currentFeatureData.currentD && ("thinking" != this.currentAnimation && 1 > progressRatio || 1 === progressRatio)) {
                                for (var i = 0; i < designPointsToSpawn - currentFeatureData.currentD; i++) {
                                    if (company.getRandom() > qualityMultiplier) { // Có khả năng tạo bug
                                        this.spawnPoints(1, "b", 200 * i);
                                    } else {
                                        this.spawnPoints(1, "d", 200 * i);
                                        this._chanceToSpawnRandombug(company, 200 * (i + 1)); // Thêm cơ hội tạo bug ngẫu nhiên
                                    }
                                    // Nếu "on fire", tạo thêm điểm design
                                    if (company.getRandom() < onFireBonus) this.spawnPoints(1, "d", 250 * i);
                                }
                                this.dLeft -= designPointsToSpawn - currentFeatureData.currentD; // Trừ vào số điểm còn dư
                                currentFeatureData.currentD = designPointsToSpawn;
                            }
                            // Tạo điểm tech
                            if (techPointsToSpawn > currentFeatureData.currentT && ("thinking" != this.currentAnimation && 1 > progressRatio || 1 === progressRatio)) {
                                for (var i = 0; i < techPointsToSpawn - currentFeatureData.currentT; i++) {
                                    if (company.getRandom() > qualityMultiplier) {
                                        this.spawnPoints(1, "b", 180 * (i + 1));
                                    } else {
                                        this.spawnPoints(1, "t", 180 * (i + 1));
                                        this._chanceToSpawnRandombug(company, 180 * (i + 1));
                                    }
                                    if (company.getRandom() < onFireBonus) this.spawnPoints(1, "t", 220 * (i + 1));
                                }
                                this.tLeft -= techPointsToSpawn - currentFeatureData.currentT;
                                currentFeatureData.currentT = techPointsToSpawn;
                            }
                            // Tạo điểm research
                            if (researchPointsToSpawn > currentFeatureData.currentR && ("thinking" != this.currentAnimation && 1 > progressRatio || 1 === progressRatio)) {
                                for (var i = 0; i < researchPointsToSpawn - currentFeatureData.currentR; i++) {
                                    this.spawnPoints(1, "r", 160 * i);
                                    if (company.getRandom() < onFireBonus) this.spawnPoints(1, "r", 190 * i);
                                }
                                this.rLeft -= researchPointsToSpawn - currentFeatureData.currentR;
                                currentFeatureData.currentR = researchPointsToSpawn;
                            }
                        }
                    }
                }
            }
        }
    };

    // Thực hiện công việc hoàn thiện game (sửa lỗi, tạo điểm tech/design phụ)
    characterProto._doFinishingWork = function (company, deltaTime) {
        var currentGame = company.currentGame;
        // Tỷ lệ tạo điểm design/tech (dựa trên kỹ năng của nhân vật)
        var designTechRatio = 1 / (this.technologyFactor + this.designFactor) * this.designFactor;

        if (!(0 >= deltaTime || !1 === this.working)) { // Sửa: this.isWorking()
            if (company.currentGame.flags.finished) { // Nếu game đã được đánh dấu hoàn thành (do người chơi nhấn nút)
                if (0 >= GameManager.spawnedPoints) GameManager.finishCurrentMission(); // Hoàn thành mission nếu không còn điểm nào trên màn hình
            } else {
                this.bugFixingDelta += deltaTime; // Tích lũy thời gian cho việc sửa lỗi
                if (!(500 > this.bugFixingDelta * this.speedFactor)) { // Sau một khoảng thời gian nhất định
                    this.bugFixingDelta = 0;
                    var efficiencyFactor = 1 * this.efficiency;
                    // Nếu chưa có bug nào được sửa, đánh dấu thời điểm bắt đầu sửa lỗi
                    if (0 !== currentGame.bugs || currentGame.flags.bugsFixedTimestamp) { /* do nothing */ }
                    else { currentGame.flags.bugsFixedTimestamp = GameManager.gameTime; }


                    if (0 < currentGame.bugs && 0.9 > company.getRandom()) { // Nếu còn bug và có tỷ lệ sửa lỗi
                        // Số bug tối đa có thể sửa trong lần này
                        var bugsToFix = efficiencyFactor;
                        if (company.currentGame.bugs - GameManager.spawnedPoints <= bugsToFix) {
                            bugsToFix = company.currentGame.bugs - GameManager.spawnedPoints;
                        }
                        if (0 < bugsToFix) {
                            for (var i = 0; i < bugsToFix; i++) {
                                this.spawnPoints(1, "br"); // "br" = bug removed
                                var bugsRemainingAfterFree = currentGame.bugs - currentGame.freeBugCount;
                                // Có cơ hội không tốn điểm tech/design nếu còn freeBugCount hoặc ngẫu nhiên
                                if (0 < currentGame.freeBugCount && (0 >= bugsRemainingAfterFree || 0.5 < company.getRandom())) {
                                    currentGame.freeBugCount--;
                                } else {
                                    // Nếu không, có cơ hội tạo điểm tech/design phụ
                                    if ((0.3 > company.getRandom() || this.onFire) && company.getRandom() < this.getCurrentQualityFactor().clamp(0, 1)) {
                                        company.getRandom() < designTechRatio ? this.spawnPoints(1, "d") : this.spawnPoints(1, "t");
                                    }
                                }
                            }
                        }
                    }
                    // Nếu không sửa bug (hoặc sửa không thành công), có cơ hội tạo điểm tech/design hoặc bug mới
                    else {
                        var qualityCheck = 0.44 + 0.5 * this.getCurrentQualityFactor().clamp(0, 1);
                        var pointSpawnChance = (0.5 * this.getCurrentQualityFactor() * this.getBoostFactor()).clamp(0, 1) / 2;
                        if (company.getRandom() < pointSpawnChance) {
                            if (company.getRandom() > qualityCheck) { // Tạo bug mới
                                this.spawnPoints(1, "b");
                                currentGame.freeBugCount++;
                            } else {
                                // Tính toán tỷ lệ tạo điểm tech/design dựa trên thời gian đã sửa lỗi
                                var timeFactor;
                                if (currentGame.flags.bugsFixedTimestamp) {
                                    var timeSinceBugsFixed = GameManager.gameTime - currentGame.flags.bugsFixedTimestamp;
                                    var baseTimeForPoints = 10000 * General.getGameSizePointsFactor(currentGame);
                                    timeFactor = timeSinceBugsFixed < baseTimeForPoints / 2 ? 1 : Math.max(0, baseTimeForPoints - timeSinceBugsFixed) / (baseTimeForPoints / 2);
                                } else {
                                    timeFactor = pointSpawnChance / 8; // Giảm tỷ lệ nếu chưa sửa hết bug
                                }

                                if (0 === timeFactor) { // Nếu hết thời gian bonus, giảm hype
                                    if (0 < currentGame.hypePoints) currentGame.hypePoints--;
                                } else if (1 === timeFactor || company.getRandom() < timeFactor) { // Tạo điểm tech/design
                                    company.getRandom() < designTechRatio ? this.spawnPoints(1, "d") : this.spawnPoints(1, "t");
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    // Tạo bug ngẫu nhiên dựa trên workload
    characterProto._chanceToSpawnRandombug = function (company, delay) {
        var bugChance = 0.05 + 0.6 * Math.max(0, (General.getEffectiveWorkload(this, company.currentGame) - 100) / 100);
        if (company.getRandom() < bugChance) {
            this.spawnPoints(1, "b", delay);
            company.currentGame.freeBugCount++;
        }
    };

    // Tạo điểm visual bay lên từ nhân vật
    characterProto.spawnPoints = function (count, type, delay) {
        var characterOverlay = VisualsManager.getCharacterOverlay(this);
        for (var i = 0; i < count; i++) {
            if ("e" === type) GameManager.increaseEnginePoints(); // Nếu là điểm engine, tăng điểm engine
            var pointData = {
                gameTime: GameManager.gameTime,
                type: type,
                duration: SPAWN_POINTS_DURATION,
                delay: delay
            };
            pointData.id = Math.floor(65535 * Math.random()); // ID ngẫu nhiên cho điểm

            // Dọn dẹp các điểm đã hết hạn
            var expiredPoints = [];
            for (var j = 0; j < this.spawnedPoints.length; j++) {
                if (this.spawnedPoints[j].gameTime + this.spawnedPoints[j].duration <= GameManager.gameTime) {
                    expiredPoints.push(this.spawnedPoints[j]);
                }
            }
            for (var j = 0; j < expiredPoints.length; j++) {
                this.spawnedPoints.remove(expiredPoints[j]);
            }

            this.spawnedPoints.push(pointData); // Thêm điểm mới vào danh sách
            // Tạo animation cho điểm
            "br" === pointData.type ?
                characterOverlay.spawnBugRemovePoint(pointData.id, pointData.type, pointData.duration, delay) :
                characterOverlay.spawnPoint(pointData.id, pointData.type, pointData.duration, delay);
        }
    };

    // Xóa một điểm đã spawn khỏi danh sách của nhân vật
    characterProto.removeSpawnedPoint = function (pointId) {
        var pointToRemove = this.spawnedPoints.first(function (pData) {
            return pData.id === pointId;
        });
        pointToRemove && this.spawnedPoints.remove(pointToRemove);
    };

    // Reset các điểm còn sót lại (dLeft, tLeft, rLeft)
    characterProto.resetLeftOverPoints = function () {
        this.dLeft = 0;
        this.tLeft = 0;
        this.rLeft = 0;
    };

    // Tính toán số điểm design/tech/research cần tạo cho một tính năng
    characterProto._calcFeature = function () {
        var gameManager = GameManager;
        var currentFeature = gameManager.currentFeature; // Tính năng tổng của game

        // Tính điểm design
        var designPointsNeeded = General.getD(gameManager.company.currentGame, currentFeature) * this.designFactor * this.getCurrentQualityFactor();
        designPointsNeeded = designPointsNeeded + this.dLeft; // Cộng dồn điểm còn sót
        // Nếu không phải nhân vật chính và điểm gần đạt 1, làm tròn lên 1
        if (0 !== this.id && 1 > designPointsNeeded && 0.6 < designPointsNeeded) designPointsNeeded = 1;

        // Tính điểm tech
        var techPointsNeeded = General.getT(gameManager.company.currentGame, currentFeature) * this.technologyFactor * this.getCurrentQualityFactor();
        techPointsNeeded = techPointsNeeded + this.tLeft;
        if (0 !== this.id && 1 > techPointsNeeded && 0.6 < techPointsNeeded) techPointsNeeded = 1;

        // Tính điểm research
        var researchPointsNeeded = General.getR(gameManager.company.currentGame, currentFeature) * this.researchFactor;
        researchPointsNeeded += this.rLeft;

        console.log("feature:{0}, d:{1} t:{2}".format(currentFeature.id, designPointsNeeded, techPointsNeeded)); // Log để debug

        // Tính toán số điểm còn sót lại sau khi đã trừ đi phần đã hoàn thành của tính năng
        this.dLeft = designPointsNeeded - Math.floor(designPointsNeeded * currentFeature.progress);
        this.tLeft = techPointsNeeded - Math.floor(techPointsNeeded * currentFeature.progress);
        this.rLeft = researchPointsNeeded - Math.floor(researchPointsNeeded * currentFeature.progress);

        // Lưu trữ thông tin về tính năng mà nhân vật này đang làm
        this.currentFeature = {
            id: currentFeature.id,
            type: currentFeature.type,
            d: designPointsNeeded,        // Tổng điểm design cần cho tính năng này bởi nhân vật này
            t: techPointsNeeded,        // Tổng điểm tech
            r: researchPointsNeeded,        // Tổng điểm research
            currentD: Math.floor(designPointsNeeded * currentFeature.progress), // Số điểm design đã tạo
            currentT: Math.floor(techPointsNeeded * currentFeature.progress), // Số điểm tech đã tạo
            currentR: Math.floor(researchPointsNeeded * currentFeature.progress), // Số điểm research đã tạo
            currentDf: 0, // Biến tạm để tích lũy điểm design trong 1 tick
            currentTf: 0, // Biến tạm tech
            currentRf: 0, // Biến tạm research
            duration: currentFeature.duration, // Tổng thời gian của tính năng
            progress: currentFeature.progress  // Tiến độ hiện tại của tính năng (0-1)
        };
    };

    // Gửi nhân vật đi nghỉ phép
    characterProto.goOnVacation = function () {
        this.relaxDelta = 0; // Reset biến tạm nghỉ ngơi
        this.state = CharacterState.Vacation;
        this.working = !1;
        this.currentFeature = null;
        this.currentResearch = null;
        this.resetLeftOverPoints(); // Xóa điểm còn sót

        var vacationDurationWeeks = 54; // Thời gian nghỉ mặc định
        // Nếu cờ G782 được bật và năm hiện tại >= 15, giảm thời gian nghỉ
        if (GameFlags.G782 && 15 <= GameManager.company.getCurrentDate().year) {
            vacationDurationWeeks = 20;
        }
        // Đặt thời điểm kết thúc kỳ nghỉ tiếp theo
        this.flags.nextVacation = GameManager.gameTime + vacationDurationWeeks * GameManager.SECONDS_PER_WEEK * 1000;
        this.flags.relaxGained = 0; // Reset điểm nghỉ ngơi đã đạt được
        this.flags.needsVacation = !1; // Đặt lại cờ cần nghỉ phép
    };

    // Sa thải nhân viên
    characterProto.fire = function () {
        var company = GameManager.company;
        company.staff.remove(this); // Xóa khỏi danh sách nhân viên
        company.flags.usedNames || (company.flags.usedNames = []); // Nếu chưa có danh sách tên đã dùng, tạo mới
        company.flags.usedNames.push(this.name); // Thêm tên nhân viên bị sa thải vào danh sách đã dùng
        VisualsManager.removeStaff(this); // Xóa hình ảnh nhân viên khỏi màn hình
    };
})();
// --- END OF FILE Character.js ---