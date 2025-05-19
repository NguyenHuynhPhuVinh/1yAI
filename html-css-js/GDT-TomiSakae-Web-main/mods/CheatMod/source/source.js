var CheatModKristof1104 = {}; // Khai báo namespace cho mod
(function () {
	var new_date = 0; // Biến lưu trữ ngày tháng cho chức năng di chuyển thời gian
	var perfectScores = false; // Cờ bật/tắt chế độ luôn đạt điểm tuyệt đối
	var noBugsMode = false; // Cờ bật/tắt chế độ không có lỗi
	var fastResearch = false; // Cờ bật/tắt chế độ nghiên cứu nhanh
	var showAllHints = false; // Cờ bật/tắt chế độ hiển thị tất cả gợi ý

	// Ghi đè hàm _setupNewGame gốc để thêm một số nghiên cứu mặc định khi bắt đầu game mới
	var oldSetupNewGame = GameManager._setupNewGame;
	var newSetupNewGame = function () {
		oldSetupNewGame(); // Gọi hàm gốc
		// Tự động mở khóa nghiên cứu Sequels và Casual Games
		GameManager.company.researchCompleted.push(Research.Sequels);
		GameManager.company.researchCompleted.push(Research.CasualGames);
	}
	GameManager._setupNewGame = newSetupNewGame;

	// Hàm loại bỏ nhu cầu nghỉ phép của nhân viên
	function removeNeedForVacationForStaff() {
		for (var i = 0; i < GameManager.company.staff.length; i++) {
			var character = GameManager.company.staff[i];
			// Đặt thời gian nghỉ phép tiếp theo rất xa trong tương lai (hơn 40 năm)
			character.flags.nextVacation = 2700 * (GameManager.SECONDS_PER_WEEK * 1E3);;
			character.flags.needsVacation = false; // Đặt lại cờ cần nghỉ phép
		}
	}

	// Hàm thêm một "dream team" (đội hình trong mơ) với chỉ số cao
	function addDreamTeam() {
		if (GameManager.company.currentLevel == 4) // Nếu ở level 4
			GameManager.company.maxStaff = 7; // Tăng số lượng nhân viên tối đa lên 7

		for (var i = 1; i < GameManager.company.maxStaff; i++) { // Lặp qua các slot nhân viên (bỏ qua slot 0 của người chơi chính)
			var skipCharacter = false;
			// Kiểm tra xem slot đã có nhân viên chưa
			for (var j = 0; j < GameManager.company.staff.length; j++) {
				if (GameManager.company.staff[j].slot == i) {
					skipCharacter = true;
					break;
				}
			}

			if (skipCharacter) {
				continue; // Bỏ qua nếu slot đã có người
			}

			// Tạo nhân vật mới với chỉ số cao
			var character = new Character({
				id: GameManager.getGUID(),
				name: "Cheater" + i, // Tên gian lận
				dF: 2, // Design Factor (Yếu tố thiết kế)
				tF: 2, // Technology Factor (Yếu tố công nghệ)
				speedF: 2, // Speed Factor (Yếu tố tốc độ)
				qualityF: 1, // Quality Factor (Yếu tố chất lượng - có thể là hệ số nhân cho kinh nghiệm)
				experience: LevelCalculator.getXpForLevel(10), // Kinh nghiệm tương đương level 10
				researchF: 2, // Research Factor (Yếu tố nghiên cứu)
				salary: 1, // Lương (rất thấp)
				efficiency: 1, // Hiệu suất
				slot: i, // Vị trí
				sex: ["male", "female"].pickRandom() // Giới tính ngẫu nhiên
			});

			GameManager.setBodyAndHead(character); // Thiết lập ngoại hình
			character.flags.hiredTimestamp = GameManager.gameTime; // Thời điểm thuê
			character.flags.nextVacation = GameManager.gameTime + 48E3 * GameManager.SECONDS_PER_WEEK; // Thời gian nghỉ phép
			character.flags.workload = 0; // Khối lượng công việc
			character.maxBoostLevel = 3; // Mức boost tối đa
			character.boostLevel = 0; // Mức boost hiện tại
			character.boostRechargeProgress = 1; // Tiến độ hồi boost (đầy)
			UI._resetBoostUI(); // Cập nhật UI boost
			GameManager.company.staff.push(character); // Thêm nhân vật vào công ty
			GameManager.uiSettings.findStaffData = null; // Reset dữ liệu tìm nhân viên
			// Cập nhật giao diện
			VisualsManager.reloadAllCharacters();
			GameManager.company.staff[GameManager.company.staff.length - 1].startAnimations();
			VisualsManager.addComputer(character);
			VisualsManager.refreshHiringButtons();
			VisualsManager.refreshTrainingOverlays();
		}

		// Mở khóa hợp đồng vừa nếu có hơn 2 nhân viên
		2 < GameManager.company.staff.length && GameManager.enableMediumContracts();
		UI.reset(); // Reset UI chung

	}

	// Hàm thêm một "B-team" (đội hình hạng B) với chỉ số khá
	function addBTeam() {
		if (GameManager.company.currentLevel == 4)
			GameManager.company.maxStaff = 7;

		for (var i = 1; i < GameManager.company.maxStaff; i++) {
			var skipCharacter = false;
			for (var j = 0; j < GameManager.company.staff.length; j++) {
				if (GameManager.company.staff[j].slot == i) {
					skipCharacter = true;
					break;
				}
			}

			if (skipCharacter) {
				continue;
			}

			// Tạo nhân vật với chỉ số khá
			var character = new Character({
				id: GameManager.getGUID(),
				name: "B Cheater" + i,
				dF: 1.4,
				tF: 1.4,
				speedF: 1.4,
				qualityF: 1.4,
				experience: 700, // Kinh nghiệm ở mức khá
				researchF: 1.4,
				salary: 1,
				efficiency: 1,
				slot: i,
				sex: ["male", "female"].pickRandom()
			});

			GameManager.setBodyAndHead(character);
			character.flags.hiredTimestamp = GameManager.gameTime;
			character.flags.nextVacation = GameManager.gameTime + 48E3 * GameManager.SECONDS_PER_WEEK;
			character.flags.workload = 0;
			GameManager.company.staff.push(character);
			GameManager.uiSettings.findStaffData = null;
			VisualsManager.reloadAllCharacters();
			GameManager.company.staff[GameManager.company.staff.length - 1].startAnimations();
			VisualsManager.addComputer(character);
			VisualsManager.refreshHiringButtons();
			VisualsManager.refreshTrainingOverlays();
		}

		2 < GameManager.company.staff.length && GameManager.enableMediumContracts();
		UI.reset();

	}

	// Hàm biến người chơi chính thành một lập trình viên siêu cấp
	function createProDeveloper() {
		var character = GameManager.company.staff[0]; // Lấy người chơi chính
		character.designFactor = 2;
		character.technologyFactor = 2;
		character.speedFactor = 2;
		character.qualityFactor = 1;
		character.experience = 10000; // Rất nhiều kinh nghiệm
		character.researchFactor = 2;
		character.efficiency = 1;
	}

	// Hàm chuyển công ty lên văn phòng level 4 (level cuối)
	function moveToLevel4() {

		if (GameManager.company.gameLog.length == 0) { // Kiểm tra đã phát hành game nào chưa
			GameManager.company.notifications.push(new Notification("Mod Gian Lận", "Để tiếp tục đến màn cuối, bạn cần phát hành ít nhất 1 game"));
			return
		}

		if (GameManager.company.currentLevel != 4) { // Nếu chưa ở level 4

			// Thêm nhân viên nếu chưa đủ
			if (GameManager.company.staff.length < 2) {
				GameManager.company.maxStaff = 7; // Đặt số lượng nhân viên tối đa

				var character = new Character({ // Tạo nhân viên cheat
					id: GameManager.getGUID(), name: "Cheater1", dF: 2,
					tF: 2, speedF: 2, qualityF: 1, experience: 10000,
					researchF: 2, salary: 1, efficiency: 1,
					slot: 2, sex: 1
				}); // sex: 1 có thể là nữ (cần kiểm tra logic game gốc)

				GameManager.setBodyAndHead(character);
				character.flags.hiredTimestamp = GameManager.gameTime;
				character.flags.nextVacation = GameManager.gameTime + 48E3 * GameManager.SECONDS_PER_WEEK;
				character.flags.workload = 0;
				GameManager.company.staff.push(character);
				GameManager.uiSettings.findStaffData = null;
				VisualsManager.reloadAllCharacters();
				GameManager.company.staff[GameManager.company.staff.length - 1].startAnimations();
				VisualsManager.addComputer(character);
				VisualsManager.refreshHiringButtons();
				VisualsManager.refreshTrainingOverlays();
			}
			GameManager.company.currentLevel = 4, // Đặt level hiện tại là 4
				VisualsManager.nextLevel(); // Gọi hàm chuyển level của game
			Media.createLevel4Notifications(); // Tạo các thông báo cho level 4
			GameManager.save(GameManager.company.slot + "L4"); // Lưu game ở slot level 4
			GameManager.resume(true); // Tiếp tục game
		}
		// Mở khóa phòng R&D và Hardware
		unlockRnDLab();
		unlockHwLab();
	}

	// Hàm mở khóa phòng thí nghiệm phần cứng
	function unlockHwLab() {
		if (!GameManager.company.flags.hwLabUnlocked) { // Nếu chưa mở khóa
			GameManager.company.flags.hwLabUnlocked = !0; // Đặt cờ đã mở khóa
			GameManager.company.flags.hwBudget = 0; // Đặt ngân sách ban đầu
			GameManager.company.flags.fractionalHwLabCosts = 0; // Chi phí nhỏ
			GameManager.company.notifications.push(new Notification("Phòng thí nghiệm Phần cứng".localize(), "Phòng thí nghiệm Phần cứng của chúng ta đã sẵn sàng.".localize()));
			Tutorial.hwLabReady();
			GameManager.pause(!0);

			// Hiệu ứng chuyển cảnh và cập nhật UI
			UI.fadeInTransitionOverlay(function () {
				VisualsManager.loadStage(!0);
				VisualsManager.refreshLabCrew();
				VisualsManager.updateProjectStatusCards();
				UI.fadeOutTransitionOverlay(function () {
					GameManager.resume(true)
				})
			});
			GameManager.resume(true);
		}
	}

	// Hàm mở khóa phòng Nghiên cứu & Phát triển
	function unlockRnDLab() {
		if (!GameManager.company.flags.rndLabUnlocked) { // Nếu chưa mở khóa
			GameManager.company.flags.rndLabUnlocked = !0; // Đặt cờ đã mở khóa
			GameManager.company.flags.rndBudget = 0; // Đặt ngân sách ban đầu
			GameManager.company.flags.fractionalRndLabCosts = 0; // Chi phí nhỏ
			GameManager.company.notifications.push(new Notification("Phòng R&D".localize(), "Phòng Nghiên cứu & Phát triển của chúng ta đã sẵn sàng.".localize()))
			Tutorial.rndLabReady();
			GameManager.pause(!0);
			// Hiệu ứng chuyển cảnh và cập nhật UI
			UI.fadeInTransitionOverlay(function () {
				VisualsManager.loadStage(!0);
				VisualsManager.refreshLabCrew();
				VisualsManager.updateProjectStatusCards();
				UI.fadeOutTransitionOverlay(function () {
					GameManager.resume(true)
				})
			});
			GameManager.resume(true);
		}
	}
	// Hàm thêm tiền
	function addMoney(money) {
		GameManager.company.adjustCash(money, "chế độ gian lận " + money / 1000000 + "Tr");
	}

	// Hàm đặt số tiền cụ thể
	function setMoney() {
		var money = $("#moneyField").val(); // Lấy giá trị từ input
		money = money.replace(/\./g, ""); // Loại bỏ dấu chấm (cho định dạng số lớn)

		if (isNaN(money)) // Kiểm tra nếu không phải là số
			return;

		GameManager.company.cash = parseInt(money); // Đặt tiền
	}

	// Hàm đặt số lượng fan cụ thể
	function setFans() {
		var fans = $("#fansField").val(); // Lấy giá trị từ input
		fans = fans.replace(/\./g, "");

		if (isNaN(fans))
			return;

		GameManager.company.fans = parseInt(fans); // Đặt fan
	}

	// Hàm thêm điểm nghiên cứu
	function addResearchPoints() {
		GameManager.company.researchPoints += 100;
		VisualsManager.researchPoints.updatePoints(GameManager.company.researchPoints);
	}

	// Hàm thêm fan
	function addFans(fans) {
		GameManager.company.fans += fans;
	}

	// Hàm thêm hype
	function addHype(hype) {
		GameManager.company.adjustHype(hype);
	}

	// Hàm thêm nghiên cứu game AAA
	function addAAAResearch() {
		// Kiểm tra điều kiện cần là đã nghiên cứu game vừa
		if (GameManager.company.researchCompleted.indexOf(Research.MediumSizeGames) == -1) {
			GameManager.company.notifications.push(new Notification("Mod Gian Lận", "Để thêm game AAA, bạn cần nghiên cứu game vừa"));
			return;
		}

		// Thêm nghiên cứu AAA nếu chưa có
		if (-1 == GameManager.company.researchCompleted.indexOf(Research.AAA)) {
			GameManager.company.researchCompleted.push(Research.AAA);
		}
	}

	// Hàm thêm tất cả các chủ đề game
	function addAllTopics() {
		GameManager.company.topics = []; // Xóa các chủ đề hiện có
		GameManager.company.topics = GameManager.company.topics.concat([], Topics.topics); // Thêm tất cả chủ đề từ danh sách gốc
	}

	// Tạo giao diện cho CheatMod
	var div = $("body");
	div.append('<div id="CheatContainer" class="windowBorder tallWindow" style="z-index: 5400;overflow:auto;display:none;"> <div id="cheatmodtop" class="windowTitle smallerWindowTitle">Mod Gian Lận</div>');
	div = $("#CheatContainer");
	div.append('<div id="moneylbl" style="margin-left:50px;width: 450px;" >Thêm Tiền</div>');
	div.append('<div id="money1M" class="selectorButton whiteButton" onclick="UI.pickCheatClick(this)" style="display:inline-block;position: relative;margin-left:50px;width: 104px;" >Thêm 1Tr</div>');
	div.append('<div id="money10M" class="selectorButton whiteButton" onclick="UI.pickCheatClick(this)" style="display:inline-block;position: relative;margin-left:0px;width: 103px;" >Thêm 10Tr</div>');
	div.append('<div id="money100M" class="selectorButton whiteButton" onclick="UI.pickCheatClick(this)" style="display:inline-block;position: relative;margin-left:0px;width: 103px; font-size:18px;" >Thêm 100Tr</div>');
	div.append('<div id="money1B" class="selectorButton whiteButton" onclick="UI.pickCheatClick(this)" style="display:inline-block;position: relative;margin-left:0px;width: 104px;" >Thêm 1Tỷ</div>');

	div.append('<div id="fanslbl" style="margin-left:50px;width: 450px;" >Thêm Fan</div>');
	div.append('<div id="fans1M" class="selectorButton whiteButton" onclick="UI.pickCheatClick(this)" style="display:inline-block;position: relative;margin-left:50px;width: 142px;" >Thêm 1Tr</div>');
	div.append('<div id="fans10M" class="selectorButton whiteButton" onclick="UI.pickCheatClick(this)" style="display:inline-block;position: relative;margin-left:0px;width: 142px;" >Thêm 10Tr</div>');
	div.append('<div id="fans100M" class="selectorButton whiteButton" onclick="UI.pickCheatClick(this)" style="display:inline-block;position: relative;margin-left:0px;width: 142px;" >Thêm 100Tr</div>');

	div.append('<div id="hypelbl" style="margin-left:50px;width: 450px;" >Thêm Hype</div>');
	div.append('<div id="hype10" class="selectorButton whiteButton" onclick="UI.pickCheatClick(this)" style="display:inline-block;position: relative;margin-left:50px;width: 142px;" >Thêm 10</div>');
	div.append('<div id="hype50" class="selectorButton whiteButton" onclick="UI.pickCheatClick(this)" style="display:inline-block;position: relative;margin-left:0px;width: 142px;" >Thêm 50</div>');
	div.append('<div id="hype100" class="selectorButton whiteButton" onclick="UI.pickCheatClick(this)" style="display:inline-block;position: relative;margin-left:0px;width: 142px;" >Thêm 100</div>');

	div.append('<div id="research" class="selectorButton whiteButton" onclick="UI.pickCheatClick(this)" style="margin-left:50px;width: 450px;">Thêm Điểm Nghiên Cứu (100đ)</div>');
	div.append('<div id="dreamteam" class="selectorButton whiteButton" onclick="UI.pickCheatClick(this)" style="margin-left:50px;width: 450px">Lấp đầy vị trí trống bằng Đồng đội Siêu Cấp</div>');
	div.append('<div id="bteam" class="selectorButton whiteButton" onclick="UI.pickCheatClick(this)" style="margin-left:50px;width: 450px">Lấp đầy vị trí trống bằng Đồng đội Hạng B</div>');
	div.append('<div id="proDeveloper" class="selectorButton whiteButton" onclick="UI.pickCheatClick(this)" style="margin-left:50px;width: 450px">Biến người chơi thành Lập trình viên Siêu Cấp</div>');
	div.append('<div id="generateNewTrend" class="selectorButton whiteButton" onclick="UI.pickCheatClick(this)" style="margin-left:50px;width: 450px">Tạo xu hướng ngẫu nhiên</div>');
	div.append('<div id="moveToLvl4" class="selectorButton whiteButton" onclick="UI.pickCheatClick(this)" style="margin-left:50px;width: 450px">Chuyển đến Màn Cuối</div>');
	div.append('<div id="AAAResearch" class="selectorButton whiteButton" onclick="UI.pickCheatClick(this)" style="display:inline-block;position: relative;margin-left:50px;width: 219px">Thêm game AAA</div>');
	div.append('<div id="addAllTopics" class="selectorButton whiteButton" onclick="UI.pickCheatClick(this)" style="margin-left:50px;width: 450px">Thêm Tất Cả Chủ Đề</div>');
	div.append('<div id="removeNeedForVacationForStaff" class="selectorButton whiteButton" onclick="UI.pickCheatClick(this)" style="margin-left:50px;width: 450px">Loại bỏ nhu cầu nghỉ phép của nhân viên</div>');
	div.append('<div id="setPerfectScoreEnabled" class="selectorButton whiteButton" onclick="UI.pickCheatClick(this)" style="margin-left:50px;width: 450px">Kích hoạt Luôn Đạt Điểm Tuyệt Đối</div>');
	div.append('<div id="setNoBugsModeEnabled" class="selectorButton whiteButton" onclick="UI.pickCheatClick(this)" style="margin-left:50px;width: 450px">Kích hoạt Chế Độ Không Lỗi</div>');
	div.append('<div id="setFastResearchModeEnabled" class="selectorButton whiteButton" onclick="UI.pickCheatClick(this)" style="margin-left:50px;width: 450px">Kích hoạt Chế Độ Nghiên Cứu Nhanh</div>');
	div.append('<div id="showAllHintsEnabled" class="selectorButton whiteButton" onclick="UI.pickCheatClick(this)" style="margin-left:50px;width: 450px">Kích hoạt Chế Độ Hiển Thị Tất Cả Gợi Ý</div>');

	div.append('<div id="cheatmodLbl" class="windowTitle smallerWindowTitle">Cấp Độ Công Nghệ</div>');
	div.append('<div id="cheatmodTechLevels"></div>');

	div.append('<div id="cheatmodLbl" class="windowTitle smallerWindowTitle">Modding</div><br>');
	div.append('đặt giá trị tiền thành: <input id="moneyField" type="text" maxlength="35" style="width:170px;font-size: 22pt"/> ');
	div.append('<div id="setMoney" class="selectorButton whiteButton" onclick="UI.pickCheatClick(this)" style="display:inline-block;position: relative;margin-left:50px;width: 104px;" >ĐẶT</div>');
	div.append('<br>');
	div.append('đặt giá trị fan thành: <input id="fansField" type="text" maxlength="35" style="width:170px;font-size: 22pt"/> ');
	div.append('<div id="setFans" class="selectorButton whiteButton" onclick="UI.pickCheatClick(this)" style="display:inline-block;position: relative;margin-left:50px;width: 104px;" >ĐẶT</div>');
	div.append('<br>');

	div.append('<div id="cheatmodLbl" class="windowTitle smallerWindowTitle">Thử nghiệm!</div><br>');
	div.append('<div style="margin-left:50px;width: 450px">Di chuyển qua thời gian, chỉ dùng cho phát triển/thử nghiệm mod! (Lùi thời gian có thể tạo ra nền tảng kép, tiến tới tương lai thì ổn!)</div>');
	div.append('<div id="cheatmod_date" style="text-align:center;margin-left:50px;width: 450px"></div>');
	div.append('<div class="volumeSlider"></div>'); // Thanh trượt để chọn ngày
	div.append('<div id="moveToDate" class="selectorButton whiteButton" onclick="UI.pickCheatClick(this)" style="margin-left:50px;width: 450px">Chuyển Đến Ngày</div>');

	// Hàm xử lý click cho các nút cheat
	UI.pickCheatClick = function (a) {
		Sound.click(); // Phát âm thanh click
		switch (a.id) { // Dựa vào ID của nút được click
			case "money1M":
				addMoney(1000000);
				break;
			case "money10M":
				addMoney(10000000);
				break;
			case "money100M":
				addMoney(100000000);
				break;
			case "money1B":
				addMoney(1000000000);
				break;
			case "research":
				addResearchPoints();
				break;
			case "fans1M":
				addFans(1000000);
				break;
			case "fans10M":
				addFans(10000000);
				break;
			case "fans100M":
				addFans(100000000);
				break;
			case "dreamteam":
				addDreamTeam();
				break;
			case "bteam":
				addBTeam();
				break;
			case "proDeveloper":
				createProDeveloper();
				break;
			case "moveToLvl4":
				moveToLevel4();
				break;
			case "AAAResearch":
				addAAAResearch();
				break;
			// case "SequelResearch": // Hàm này không được định nghĩa trong code bạn cung cấp
			//     addSequelResearch();
			// 	break;
			case "moveToDate":
				moveToDate();
				break;
			case "removeNeedForVacationForStaff":
				removeNeedForVacationForStaff();
				break;
			case "hype10":
				addHype(10);
				break;
			case "hype50":
				addHype(50);
				break;
			case "hype100":
				addHype(100);
				break;
			case "setPerfectScoreEnabled":
				setPerfectScoreEnabled();
				break;
			case "setNoBugsModeEnabled":
				setNoBugsModeEnabled();
				break;
			case "addAllTopics":
				addAllTopics();
				break;
			case "setFastResearchModeEnabled":
				setFastResearchEnabled();
				break;
			case "showAllHintsEnabled":
				setShowAllHintsEnabled();
				break;
			case "generateNewTrend":
				generateNewTrend();
				break;
			case "setMoney":
				setMoney();
				break;
			case "setFans":
				setFans();
				break;
			default:
				return;
		}
	}

	// Hàm di chuyển đến ngày đã chọn bằng thanh trượt
	function moveToDate() {
		GameManager.gameTime = new_date * (GameManager.SECONDS_PER_WEEK * 1E3);
		General.proceedOneWeek(GameManager.company, new_date); // Gọi hàm xử lý qua tuần của game
	}

	// Hàm cập nhật hiển thị ngày tháng khi thanh trượt thay đổi
	function setDate(d) {
		new_date = d

		var a = Math.floor(d) % 4 + 1; // Tuần
		var c = Math.floor(d) / 4; // Tổng số tháng (chia 4)
		var b = c / 12 + 1; // Năm
		var year = Math.floor(b);
		var month = Math.floor(c % 12 + 1); // Tháng trong năm
		var week = Math.floor(a);

		var div = $("#CheatContainer");
		div.find("#cheatmod_date").html("N" + year + " T" + month + " Tuần " + week); // Hiển thị Năm, Tháng, Tuần
	}

	// Ghi đè hàm _showContextMenu gốc để thêm tùy chọn "CheatMode..."
	var original_showContextMenu = UI._showContextMenu;
	var new_showContextMenu = function (b, c, d, h) { // b: type, c: items, d: x, h: y

		if (b == "competitorMod") { // Bỏ qua nếu là context menu của mod đối thủ (nếu có)
		} else {
			// Thêm mục "CheatMode..." vào menu ngữ cảnh
			c.push({
				label: "Chế Độ Gian Lận...",
				action: function () {
					Sound.click();
					GameManager.resume(true);

					generateTechLevelScreen(); // Tạo màn hình cấp độ công nghệ cho mod
					var div = $("#CheatContainer");
					div.scrollTop() // Cuộn lên đầu
					$("#CheatContainer").css("z-index", "5400"); // Đặt z-index
					// Hiển thị dialog CheatMod
					div.gdDialog({
						popout: !0,
						close: !0,
						onClose: function () {
							var div = $("#cheatmodTechLevels");
							div.empty(); // Xóa nội dung khi đóng
						}
					})
				}
			})

			// Cuộn đến phần tử #cheatmodtop
			div.animate({
				scrollTop: $("#cheatmodtop").offset().top
			}, 2000);

			// Đặt giá trị hiện tại cho các ô nhập tiền và fan
			div.find("#moneyField").val(UI.getLongNumberString(GameManager.company.cash));
			div.find("#fansField").val(UI.getLongNumberString(GameManager.company.fans));

			// Thiết lập thanh trượt ngày tháng
			div.find(".volumeSlider").slider({
				min: 0,
				max: 2160, // Giới hạn tối đa (khoảng 45 năm)
				range: "min",
				value: Math.floor(GameManager.company.currentWeek), // Giá trị hiện tại
				animate: !1,
				slide: function (a, b) {
					var c = b.value;
					setDate(c); // Cập nhật hiển thị ngày khi trượt
				}


			});
			setDate(GameManager.company.currentWeek); // Đặt ngày ban đầu cho thanh trượt
		}
		original_showContextMenu(b, c, d, h); // Gọi hàm _showContextMenu gốc
	};
	UI._showContextMenu = new_showContextMenu


	// Chức năng luôn đạt điểm tuyệt đối
	var getPerfectScoreComment = function (hasPerfectScore) {
		if (hasPerfectScore == false) { // Nhận xét cho điểm 10
			return ["Một tuyệt tác.".localize(), "Tuyệt nhất trong thể loại.".localize(), "Thực sự tuyệt vời.".localize(), "Ai cũng thích!".localize(), "Phải có!".localize(), "Thành tựu xuất sắc.".localize(), "Tuyệt vời!".localize(), "Món yêu thích mới của tôi!".localize()].pickRandom();
		} else { // Nhận xét cho điểm 11
			return ["11/10. Game của năm, bất kể năm nào!".localize(), "11/10. Không cần nói nhiều.".localize(), "11/10. Một điểm số phi thường cho một trò chơi phi thường.".localize(), "11/10. Luật lệ không áp dụng cho trò chơi xuất sắc này.".localize()].pickRandom();
		}
	}

	// Hàm được gọi sau khi game được đánh giá (nếu perfectScores được bật)
	var setPerfectScores = function (e) { // e là event data từ GDT.eventKeys.gameplay.afterGameReview
		e.reviews[0].score = 10;
		e.reviews[0].message = getPerfectScoreComment(false);
		e.reviews[1].score = 10;
		e.reviews[1].message = getPerfectScoreComment(false);
		e.reviews[2].score = 10;
		e.reviews[2].message = getPerfectScoreComment(false);

		var r = GameManager.company.getRandom();
		if (r >= 0.7) { // 30% cơ hội được 11 điểm
			e.reviews[3].score = 11;
			e.reviews[3].message = getPerfectScoreComment(true);
		} else {
			e.reviews[3].score = 10;
			e.reviews[3].message = getPerfectScoreComment(false);
		}

		e.game.score = 10; // Đặt điểm tổng của game là 10
	};

	// Bật/tắt chế độ điểm tuyệt đối
	var setPerfectScoreEnabled = function () {
		if (perfectScores) {
			GDT.off(GDT.eventKeys.gameplay.afterGameReview, setPerfectScores); // Tắt lắng nghe sự kiện
			var div = $("#CheatContainer");
			div.find("#setPerfectScoreEnabled").html("Kích hoạt Luôn Đạt Điểm Tuyệt Đối");
			perfectScores = false;
		} else {
			GDT.on(GDT.eventKeys.gameplay.afterGameReview, setPerfectScores); // Bật lắng nghe sự kiện
			var div = $("#CheatContainer");
			div.find("#setPerfectScoreEnabled").html("Vô hiệu hóa Luôn Đạt Điểm Tuyệt Đối");
			perfectScores = true;
		}
	}

	// Chế độ không có lỗi
	var old_updateCharacters = GameManager.updateCharacters;
	var new_updateCharacters = function () { // Ghi đè hàm cập nhật nhân vật
		if (noBugsMode && typeof GameManager.company.currentGame != 'undefined' && GameManager.company.currentGame != null) {
			GameManager.company.currentGame.bugs = 0; // Đặt số lỗi về 0
		}
		old_updateCharacters(); // Gọi hàm gốc
		if (noBugsMode && typeof GameManager.company.currentGame != 'undefined' && GameManager.company.currentGame != null) {
			GameManager.company.currentGame.bugs = 0; // Đảm bảo lỗi vẫn là 0 sau khi hàm gốc chạy
		}
	}
	GameManager.updateCharacters = new_updateCharacters

	// Bật/tắt chế độ không lỗi
	var setNoBugsModeEnabled = function () {
		if (noBugsMode) {
			var div = $("#CheatContainer");
			div.find("#setNoBugsModeEnabled").html("Kích hoạt Chế Độ Không Lỗi");
			noBugsMode = false;
		} else {
			var div = $("#CheatContainer");
			div.find("#setNoBugsModeEnabled").html("Vô hiệu hóa Chế Độ Không Lỗi");
			noBugsMode = true;
		}
	}

	// Chế độ nghiên cứu nhanh
	var old_increaseResearchProgress = GameManager.increaseResearchProgress;
	var new_increaseResearchProgress = function (researcher, progress) { // Ghi đè hàm tăng tiến độ nghiên cứu
		// Không áp dụng cho training
		if (typeof researcher.currentResearch != 'undefined' && researcher.currentResearch != null && researcher.currentResearch.type == "training") {
			old_increaseResearchProgress(researcher, progress);
		} else {
			if (fastResearch) { // Nếu chế độ nghiên cứu nhanh được bật
				var researchTemp = GameManager.currentResearches.first(function (c) {
					return c.staffId === researcher.id
				});
				// Hoàn thành nghiên cứu ngay lập tức
				if (GameManager.currentFeature || GameManager.currentEngineDev)
					GameManager.finishResearch(researcher, researchTemp);
				else
					researcher.endWorking();
			} else {
				old_increaseResearchProgress(researcher, progress); // Gọi hàm gốc
			}
		}
	}
	GameManager.increaseResearchProgress = new_increaseResearchProgress

	// Bật/tắt chế độ nghiên cứu nhanh
	var setFastResearchEnabled = function () {
		if (fastResearch) {
			var div = $("#CheatContainer");
			div.find("#setFastResearchModeEnabled").html("Kích hoạt Chế Độ Nghiên Cứu Nhanh");
			fastResearch = false;
		} else {
			var div = $("#CheatContainer");
			div.find("#setFastResearchModeEnabled").html("Vô hiệu hóa Chế Độ Nghiên Cứu Nhanh");
			fastResearch = true;
		}
	}

	// Tạo xu hướng thị trường mới
	var generateNewTrend = function () {
		if (GameManager.company.currentLevel == 1) { // Không hoạt động ở level 1
			GameManager.company.notifications.push(new Notification("Mod Gian Lận", "Không thể tạo xu hướng ở màn đầu (garage). Vui lòng chuyển sang màn tiếp theo."));
			return;
		}

		// Reset xu hướng hiện tại và buộc game tạo xu hướng mới
		if (typeof GameManager.company.flags.trends != 'undefined' && GameManager.company.flags.trends != null) {
			GameManager.company.flags.trends = {};
		}
		GameManager.company.flags.trends.currentTrend = null;

		do {
			GameManager.company.flags.trends.expireBy = GameManager.gameTime - 1; // Đặt thời gian hết hạn của xu hướng cũ là quá khứ
			GameTrends.updateTrends(GameManager.company); // Gọi hàm cập nhật xu hướng của game
		}
		while (GameManager.company.flags.trends.currentTrend == null); // Lặp lại cho đến khi có xu hướng mới
	}

	// Chức năng hiển thị và thay đổi cấp độ công nghệ
	var xpItems = []; // Mảng lưu trữ các mục công nghệ
	var generateTechLevelScreen = function () {
		xpItems = []; // Reset mảng
		var game = GameManager.company.gameLog.last(); // Lấy game cuối cùng đã phát hành

		if (typeof game == 'undefined' || game == null) { // Nếu chưa có game nào
			var div = $("#cheatmodTechLevels");
			div.append('Yêu cầu: Cần ít nhất 1 game đã phát hành');
			return;
		}

		// Lấy các công đoạn phát triển từ game cuối cùng
		for (var i = 0; i < game.featureLog.length; i++) {
			var mission = game.featureLog[i];
			if (mission.missionType != "mission") // Chỉ lấy các "mission" (công đoạn chính)
				continue;

			var feature = General.getMission(mission.id); // Lấy thông tin công đoạn

			var gain = 0; // XP nhận được (mặc định là 0 trong UI này)
			var item = {
				originalItem: feature,
				name: feature.name,
				level: LevelCalculator.getLevel(feature.experience), // Cấp độ hiện tại
				progress: LevelCalculator.getProgressToNextLevel(feature.experience), // Tiến độ lên cấp tiếp theo
				xpGain: gain,
				progressColor: "orange",
				progressGainColor: "#FFC456"
			};
			xpItems.push(item);
		}

		// Lấy các tính năng đã nghiên cứu của công ty
		var allFeatures = GameManager.company.features;
		for (var i = 0; i < allFeatures.length; i++) {
			var feature = allFeatures[i];
			if (!feature.showXPGain) // Chỉ lấy các tính năng có hiển thị XP
				continue;

			var gain = 0;
			var item = {
				originalItem: feature,
				name: feature.name,
				level: LevelCalculator.getLevel(feature.experience),
				progress: LevelCalculator.getProgressToNextLevel(feature.experience),
				xpGain: gain,
				progressColor: "orange",
				progressGainColor: "#FFC456"
			};
			xpItems.push(item);
		}

		// Tạo UI hiển thị danh sách công nghệ
		var div = $("#cheatmodTechLevels");
		div.empty()
		var featureElementTemplate = $(".releaseGameFeatureTemplate"); // Lấy mẫu từ UI gốc của game
		for (var i = 0; i < xpItems.length; i++) {
			var element = featureElementTemplate.clone();

			div.append(element);
			// Thêm nút "+" để tăng cấp độ
			element.append('<div id="featureTechLvl" class="selectorButton whiteButton" onclick="CheatModKristof1104.addTechLevel({0})" style="display:inline-block;position: relative;margin: 0px;top:3px;line-height: 20px;height:22px;width: 22px;" >+</div>'.format(i));

			element.css("font-size", 12 + "pt");

			var item = xpItems[i];
			(function (element, item) { // Closure để giữ đúng giá trị của item
				element.find(".featureName").text(item.name);
				element.find(".featureLevel").text("Cấp. ".localize() + item.level); // Lvl. -> Cấp.
				var featureLevelUp = element.find(".featureLevelUp");
				featureLevelUp.hide(); // Ẩn thông báo lên cấp (nếu có)
				// Hiển thị thanh tiến độ
				element.find(".featureProgress").css({
					width: item.progress - 1 + "%"
				}).css({
					"background-color": item.progressColor
				});
				var featureGain =
					element.find(".featureProgressGain").css({
						"background-color": item.progressGainColor
					});
				featureGain["css_width_percent"] = 0; // Đặt chiều rộng ban đầu của thanh tăng tiến độ
				var featureGainCaption = element.find(".featureGainCaption");
				featureGainCaption["klug_number_int_text"] = 0; // Đặt giá trị số ban đầu

			})(element, item)
		}
	}

	// Hàm tăng cấp độ công nghệ khi click nút "+"
	CheatModKristof1104.addTechLevel = function (i) {
		var feature = xpItems[i];
		var xpNeeded = LevelCalculator.getXpToNextLevel(feature.originalItem.experience); // XP cần để lên cấp
		var lvl = LevelCalculator.getLevel(feature.originalItem.experience);
		var baseXp = LevelCalculator.getXpForLevel(lvl); // XP cơ bản của cấp hiện tại
		xpNeeded -= baseXp; // XP còn thiếu
		feature.originalItem.experience += xpNeeded; // Cộng XP
		generateTechLevelScreen(); // Vẽ lại màn hình cấp độ công nghệ
	}

	// Thêm các nút "+" để tăng điểm Design/Tech khi đang phát triển game
	CheatModKristof1104.addTechAndDesignPointsButtons = function () {
		var div = $("#canvasContainer");
		// Tạo các nút
		var designButton = $('<div id="cheatModDesignPoints" class="selectorButton " style="background-color: orange;position:absolute;line-height: 25px;height:30px;width: 30px; opacity=0;-webkit-border-radius: 999px;-moz-border-radius: 999px;border-radius: 999px;behavior: url(PIE.htc);">' + "+" + "</div>");
		var techButton = $('<div id="cheatModTechPoints" class="selectorButton " style="background-color: deepskyblue;position:absolute;line-height: 25px;height:30px;width: 30px; opacity=0;-webkit-border-radius: 999px;-moz-border-radius: 999px;border-radius: 999px;behavior: url(PIE.htc);">' + "+" + "</div>");
		var designButton100 = $('<div id="cheatModDesignPoints100" class="selectorButton " style="background-color: orange;position:absolute;line-height: 35px;height:40px;width: 40px; opacity=0;-webkit-border-radius: 999px;-moz-border-radius: 999px;border-radius: 999px;behavior: url(PIE.htc);">' + "+" + "</div>");
		var techButton100 = $('<div id="cheatModTechPoints100" class="selectorButton " style="background-color: deepskyblue;position:absolute;line-height: 35px;height:40px;width: 40px; opacity=0;-webkit-border-radius: 999px;-moz-border-radius: 999px;border-radius: 999px;behavior: url(PIE.htc);">' + "+" + "</div>");
		var research = $('<div id="cheatModAddResearch" class="selectorButton " style="background-color: #006AFF;color:white;position:absolute;line-height: 25px;height:30px;width: 30px; opacity=0;-webkit-border-radius: 999px;-moz-border-radius: 999px;border-radius: 999px;behavior: url(PIE.htc);">' + "+" + "</div>");
		div.append(designButton);
		div.append(techButton);
		div.append(designButton100);
		div.append(techButton100);
		div.append(research);
		// Định vị các nút dựa trên vị trí của các thanh điểm gốc
		$("#cheatModDesignPoints").css("left", VisualsManager.gameStatusBar.x + VisualsManager.gameStatusBar.designPoints.x - 14);
		$("#cheatModDesignPoints").css("top", VisualsManager.gameStatusBar.y + VisualsManager.gameStatusBar.designPoints.y + 82);
		$("#cheatModDesignPoints").click(function () {
			CheatModKristof1104.addTechAndDesignPoints(true); // Thêm 10 điểm Design
			return false;
		});
		$("#cheatModTechPoints").css("left", VisualsManager.gameStatusBar.x + VisualsManager.gameStatusBar.technologyPoints.x - 14);
		$("#cheatModTechPoints").css("top", VisualsManager.gameStatusBar.y + VisualsManager.gameStatusBar.technologyPoints.y + 82);
		$("#cheatModTechPoints").click(function () {
			CheatModKristof1104.addTechAndDesignPoints(false); // Thêm 10 điểm Tech
			return false;
		});
		$("#cheatModDesignPoints100").css("left", VisualsManager.gameStatusBar.x + VisualsManager.gameStatusBar.designPoints.x + 16);
		$("#cheatModDesignPoints100").css("top", VisualsManager.gameStatusBar.y + VisualsManager.gameStatusBar.designPoints.y + 82);
		$("#cheatModDesignPoints100").click(function () {
			CheatModKristof1104.addTechAndDesignPoints(true, true); // Thêm 100 điểm Design
			return false;
		});
		$("#cheatModTechPoints100").css("left", VisualsManager.gameStatusBar.x + VisualsManager.gameStatusBar.technologyPoints.x + 16);
		$("#cheatModTechPoints100").css("top", VisualsManager.gameStatusBar.y + VisualsManager.gameStatusBar.technologyPoints.y + 82);
		$("#cheatModTechPoints100").click(function () {
			CheatModKristof1104.addTechAndDesignPoints(false, true); // Thêm 100 điểm Tech
			return false;
		});
		$("#cheatModAddResearch").css("left", VisualsManager.researchPoints.x);
		$("#cheatModAddResearch").css("top", VisualsManager.researchPoints.y + 72);
		$("#cheatModAddResearch").click(function () {
			addResearchPoints(); // Thêm điểm nghiên cứu
			return false;
		});
	}

	// Hàm thực hiện việc thêm điểm Design/Tech
	CheatModKristof1104.addTechAndDesignPoints = function (design, addBy100) {
		if (!GameManager.company.isCurrentlyDevelopingGame()) // Chỉ hoạt động khi đang phát triển game
			return;

		var game = GameManager.company.currentGame;

		if (typeof addBy100 != 'undefined' && addBy100 != null) { // Nếu có tham số addBy100 (thêm 100)
			if (design) {
				game.designPoints += 100;
			} else {
				game.technologyPoints += 100;
			}
		} else { // Mặc định thêm 10
			if (design) {
				game.designPoints += 10;
			} else {
				game.technologyPoints += 10;
			}
		}
		VisualsManager.updatePoints(); // Cập nhật hiển thị điểm
	}

	var designAndTechAdded = false; // Cờ kiểm tra xem nút đã được thêm chưa
	// Hàm khởi tạo các nút thêm điểm, được gọi mỗi khi qua tuần
	var initTechAndDesignButtons = function (data) {
		if (designAndTechAdded == false) {
			CheatModKristof1104.addTechAndDesignPointsButtons();
			designAndTechAdded = true;
		}
	}
	GDT.on(GDT.eventKeys.gameplay.weekProceeded, initTechAndDesignButtons); // Lắng nghe sự kiện qua tuần


	// Chức năng hiển thị tất cả gợi ý
	// Ghi đè các hàm kiểm tra kiến thức gốc của game
	var old_hasComboKnowledge = Knowledge.hasComboKnowledge;
	var new_hasComboKnowledge = function (company, game, source) {
		if (showAllHints) { // Nếu chế độ hiển thị tất cả gợi ý được bật
			return true; // Luôn trả về true (coi như đã có kiến thức)
		} else {
			return old_hasComboKnowledge(company, game, source); // Gọi hàm gốc
		}
	}
	Knowledge.hasComboKnowledge = new_hasComboKnowledge;

	var old_hasTrainingKnowledge = Knowledge.hasTrainingKnowledge;
	var new_hasTrainingKnowledge = function (training) {
		if (showAllHints) {
			return true;
		} else {
			return old_hasTrainingKnowledge(training);
		}
	}
	Knowledge.hasTrainingKnowledge = new_hasTrainingKnowledge;

	var old_hasMissionWeightingKnowledge = Knowledge.hasMissionWeightingKnowledge;
	var new_hasMissionWeightingKnowledge = function (company, mission, game, ignoreTopic, source) {
		if (showAllHints) {
			return true;
		} else {
			return old_hasMissionWeightingKnowledge(company, mission, game, ignoreTopic, source);
		}
	}
	Knowledge.hasMissionWeightingKnowledge = new_hasMissionWeightingKnowledge;

	var old_getPlatformGenreWeightingKnowledge = Knowledge.getPlatformGenreWeightingKnowledge;
	var new_getPlatformGenreWeightingKnowledge = function (company, platform) {
		if (showAllHints) {
			// Trả về trọng số thực tế thay vì dựa vào kiến thức đã mở khóa
			var match = { id: platform.id };
			match["genreWeightings"] = [0, 0, 0, 0, 0, 0];
			match["genreWeightings"] = platform.genreWeightings
			return match["genreWeightings"];
		} else {
			return old_getPlatformGenreWeightingKnowledge(company, platform);
		}
	}
	Knowledge.getPlatformGenreWeightingKnowledge = new_getPlatformGenreWeightingKnowledge;

	var old_getPlatformAudienceWeightingKnowledge = Knowledge.getPlatformAudienceWeightingKnowledge;
	var new_getPlatformAudienceWeightingKnowledge = function (company, platform) {
		if (showAllHints) {
			// Trả về trọng số thực tế
			var match = { id: platform.id };
			match["audienceWeightings"] = [0, 0, 0];
			var weighting1 = Platforms.getAudienceWeighting([platform], "young", true);
			var weighting2 = Platforms.getAudienceWeighting([platform], "everyone", true);
			var weighting3 = Platforms.getAudienceWeighting([platform], "mature", true);

			match["audienceWeightings"][0] = weighting1;
			match["audienceWeightings"][1] = weighting2;
			match["audienceWeightings"][2] = weighting3;

			return match["audienceWeightings"];
		} else {
			return old_getPlatformAudienceWeightingKnowledge(company, platform);
		}
	}
	Knowledge.getPlatformAudienceWeightingKnowledge = new_getPlatformAudienceWeightingKnowledge;

	var old_getTopicAudienceWeightingKnowledge = Knowledge.getTopicAudienceWeightingKnowledge;
	var new_getTopicAudienceWeightingKnowledge = function (company, topic, audience, target) {
		if (showAllHints) {
			// Trả về trọng số thực tế
			var match = { id: topic.id };
			match["audienceWeightings"] = [0, 0, 0];
			var weighting1 = General.getAudienceWeighting(topic.audienceWeightings, "young");
			var weighting2 = General.getAudienceWeighting(topic.audienceWeightings, "everyone");
			var weighting3 = General.getAudienceWeighting(topic.audienceWeightings, "mature");

			match["audienceWeightings"][0] = weighting1;
			match["audienceWeightings"][1] = weighting2;
			match["audienceWeightings"][2] = weighting3;

			return match["audienceWeightings"];
		} else {
			return old_getTopicAudienceWeightingKnowledge(company, topic, audience, target);
		}
	}
	Knowledge.getTopicAudienceWeightingKnowledge = new_getTopicAudienceWeightingKnowledge;

	// Bật/tắt chế độ hiển thị tất cả gợi ý
	var setShowAllHintsEnabled = function () {
		if (showAllHints) {
			var div = $("#CheatContainer");
			div.find("#showAllHintsEnabled").html("Kích hoạt Chế Độ Hiển Thị Tất Cả Gợi Ý");
			showAllHints = false;
		} else {
			var div = $("#CheatContainer");
			div.find("#showAllHintsEnabled").html("Vô hiệu hóa Chế Độ Hiển Thị Tất Cả Gợi Ý");
			showAllHints = true;
		}
	}

})();