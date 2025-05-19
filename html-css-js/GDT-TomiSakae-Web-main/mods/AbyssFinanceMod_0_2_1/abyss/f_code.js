(function () {
	var numberFormat = function (n) {
		return n.toFixed().replace(/(\d)(?=(\d{3})+(,|$))/g, '$1 ');
	}

	UI.BankAction = function (a) {
		Sound.click();
		switch (a.id) {
			case "bankDeposit": bankDeposit(); break;
			case "bankWithdraw": bankWithdraw(); break;
			case "bankWithdrawAll": bankWithdrawAll(); break;
			case "bankAD": bankRateTarget(0); break;
			case "bankAW": bankRateTarget(1); break;
			case "bankTakeLoan1": bankTakeLoan(1); break;
			case "bankTakeLoan2": bankTakeLoan(2); break;
			case "bankTakeLoan3": bankTakeLoan(3); break;
			case "ABYSS_FM_tabs1":
				$('#ABYSS_FM_tabc1').show();
				$('#ABYSS_FM_tabc2').hide();
				$('#ABYSS_FM_tabc3').hide();
				$('#ABYSS_FM_tabs1').addClass('orangeButton').removeClass('whiteButton');
				$('#ABYSS_FM_tabs2').addClass('whiteButton').removeClass('orangeButton');
				$('#ABYSS_FM_tabs3').addClass('whiteButton').removeClass('orangeButton');
				break;
			case "ABYSS_FM_tabs2":
				$('#ABYSS_FM_tabc1').hide();
				$('#ABYSS_FM_tabc2').show();
				$('#ABYSS_FM_tabc3').hide();
				$('#ABYSS_FM_tabs1').addClass('whiteButton').removeClass('orangeButton');
				$('#ABYSS_FM_tabs2').addClass('orangeButton').removeClass('whiteButton');
				$('#ABYSS_FM_tabs3').addClass('whiteButton').removeClass('orangeButton');
				break;
			case "ABYSS_FM_tabs3":
				$('#ABYSS_FM_tabc1').hide();
				$('#ABYSS_FM_tabc2').hide();
				$('#ABYSS_FM_tabc3').show();
				$('#ABYSS_FM_tabs1').addClass('whiteButton').removeClass('orangeButton');
				$('#ABYSS_FM_tabs2').addClass('whiteButton').removeClass('orangeButton');
				$('#ABYSS_FM_tabs3').addClass('orangeButton').removeClass('whiteButton');
				break;
			default:
				return;
		}
	};

	//START: Window text	
	//INFO TAB
	var ABYSS_infoTab = '<div style="text-align:center;width:600px;"><strong>CẢNH BÁO - ĐANG TRONG QUÁ TRÌNH PHÁT TRIỂN</strong><br/>Đây là phiên bản BETA của mod, có thể chưa cân bằng, lỗi là điều dự kiến, bạn đã được cảnh báo ;)</div>';

	//ACCOUNT TAB
	var ABYSS_bankTab = '<div id="BA" class="windowTitle smallerWindowTitle">Số Dư Tài Khoản</div>';
	ABYSS_bankTab += '<div class="green" style="text-align:center;width:600px; font-size: 200%"><strong id="CB"></strong></div>';
	ABYSS_bankTab += '<div id="CIR" style="text-align:center;width:600px">Lãi Suất Hiện Tại: <strong>...đang tính toán lại...</strong> (đợi 1 tuần)</div>';

	ABYSS_bankTab += '<div id="BA" class="windowTitle smallerWindowTitle">Thao Tác Tài Khoản</div>';

	ABYSS_bankTab += '<div style="text-align:center;width:600px">Nhập số tiền để rút / gửi: <input id="EA" type="number" style="display:inline-block;margin: 0 auto;width:200px"/></div>';

	ABYSS_bankTab += '<div style="text-align:center;"><div id="bankDeposit" class="selectorButton whiteButton" onclick="UI.BankAction(this)" style="display:inline-block;width: 125px">Gửi Tiền</div>';
	ABYSS_bankTab += '<div id="bankWithdraw" class="selectorButton whiteButton" onclick="UI.BankAction(this)" style="display:inline-block;width: 125px">Rút Tiền</div>';
	ABYSS_bankTab += '<div id="bankWithdrawAll" class="selectorButton whiteButton" onclick="UI.BankAction(this)" style="display:inline-block;width: 125px">Rút Tất Cả</div></div>';

	ABYSS_bankTab += '<div id="BA" class="windowTitle smallerWindowTitle">Tùy Chọn Tài Khoản</div>';
	ABYSS_bankTab += '<div style="text-align:center;width:600px">Chọn nếu tiền lãi nên được gửi vào tài khoản ngân hàng hoặc trực tiếp thành tiền mặt</div>';

	ABYSS_bankTab += '<div style="text-align:center;"><div id="bankAD" class="selectorButton greenButton w-32 md:w-40 lg:w-48" onclick="UI.BankAction(this)" style="display:inline-block;">Tài Khoản</div><div id="bankAW" class="selectorButton whiteButton w-32 md:w-40 lg:w-48" onclick="UI.BankAction(this)" style="display:inline-block;">Tiền Mặt</div></div>';

	//LOAN TAB
	var ABYSS_loanTab = '';

	var div = $("body");
	div.append('<div id="ABYSS_FMW" class="windowBorder" style="z-index:7000;overflow:auto;display:none;">');

	div = $("#ABYSS_FMW");

	div.append('<div id="ABYSS_FM_tabs1" class="selectorButton orangeButton" onclick="UI.BankAction(this)" style="display:inline-block;">Tài Khoản</div>');
	div.append('<div id="ABYSS_FM_tabs2" class="selectorButton whiteButton" onclick="UI.BankAction(this)" style="display:inline-block;">Khoản Vay</div>');
	div.append('<div id="ABYSS_FM_tabs3" class="selectorButton whiteButton" onclick="UI.BankAction(this)" style="display:inline-block;">Thông Tin</div>');

	//TAB bank
	div.append('<div id="ABYSS_FM_tabc1">' + ABYSS_bankTab + '</div>');

	div.append('<div id="ABYSS_FM_tabc2">' + ABYSS_loanTab + '</div>');
	div.append('<div id="ABYSS_FM_tabc3">' + ABYSS_infoTab + '</div>');

	//Ignore, just some debug shit that i used, and mb will need in future
	//div.append(JSON.stringify(Training));

	var addLoanOption = function (arr, loanID) {
		return '<div id="bankTakeLoan' + loanID + '" class="whiteButton" onclick="UI.BankAction(this)" style="width:600px; border: 1px solid black; padding: 10px; margin: 10px 0;"><div style="text-align:center"><strong>' + arr[0] + '</strong></div>Đề nghị: &nbsp;<strong class="green">' + numberFormat(arr[1]) + '</strong><br/>Trả lại: <strong class="red">' + numberFormat((arr[2] / arr[3])) + '</strong> / tháng trong <strong>' + arr[3] + '</strong> tháng ( <strong class="red">' + numberFormat(arr[2]) + '</strong> tổng cộng)</div>';
	}

	//END: Window text	
	var createLoanOptions = function () {
		calcInterestRate();

		switch (GameManager.company.currentLevel) {
			case 1: var baseLoanAmount = 20000;
				break;
			case 2: var baseLoanAmount = 500000;
				break;
			case 3: var baseLoanAmount = 5000000;
				break;
			default:
			case 4: var baseLoanAmount = 2000000;
				break;
		}


		var possibleMonths = [12, 24, 36, 48, 60];

		var loanA = baseLoanAmount * (1.25 - 0.5 * Math.random()) * (1 + 2 * Math.random());
		loanA = parseFloat(Math.ceil(loanA).toPrecision(2));
		var loanD = possibleMonths[Math.floor(Math.random() * possibleMonths.length)];
		var loanP = (1.05 + (0.1 * Math.random())) * (1 + 0.005 * loanD);
		GDT.getDataStore("ABYSS_bank").data.loanOption1 = ['Ngân Hàng Green Thumb', loanA, (loanP * loanA), loanD];

		var loanA = baseLoanAmount * (1.25 - 0.5 * Math.random()) * (5 + 5 * Math.random());
		loanA = parseFloat(Math.ceil(loanA).toPrecision(2));
		var loanD = possibleMonths[Math.floor(Math.random() * possibleMonths.length)];
		var loanP = (1.05 + (0.1 * Math.random())) * (1 + 0.005 * loanD);
		GDT.getDataStore("ABYSS_bank").data.loanOption2 = ['Ngân Hàng Đầu Tư DeepWeb', loanA, (loanP * loanA), loanD];

		var loanA = baseLoanAmount * (1.25 - 0.5 * Math.random()) * (10 + 10 * Math.random());
		loanA = parseFloat(Math.ceil(loanA).toPrecision(2));
		var loanD = possibleMonths[Math.floor(Math.random() * possibleMonths.length)];
		var loanP = (1.05 + (0.1 * Math.random())) * (1 + 0.005 * loanD);
		GDT.getDataStore("ABYSS_bank").data.loanOption3 = ['Ngân Hàng Toàn Cầu Abyss', loanA, (loanP * loanA), loanD];
	}

	var bankTakeLoan = function (loanID) {
		switch (loanID) {
			case 1:
				GDT.getDataStore("ABYSS_bank").data.bankLoanMoneyBorrowed = GDT.getDataStore("ABYSS_bank").data.loanOption1[2];
				GDT.getDataStore("ABYSS_bank").data.bankLoanMonthsRemaining = GDT.getDataStore("ABYSS_bank").data.loanOption1[3];
				GameManager.company.adjustCash(GDT.getDataStore("ABYSS_bank").data.loanOption1[1], "Khoản Vay");
				break;
			case 2:
				GDT.getDataStore("ABYSS_bank").data.bankLoanMoneyBorrowed = GDT.getDataStore("ABYSS_bank").data.loanOption2[2];
				GDT.getDataStore("ABYSS_bank").data.bankLoanMonthsRemaining = GDT.getDataStore("ABYSS_bank").data.loanOption2[3];
				GameManager.company.adjustCash(GDT.getDataStore("ABYSS_bank").data.loanOption2[1], "Khoản Vay");
				break;
			case 3:
				GDT.getDataStore("ABYSS_bank").data.bankLoanMoneyBorrowed = GDT.getDataStore("ABYSS_bank").data.loanOption3[2];
				GDT.getDataStore("ABYSS_bank").data.bankLoanMonthsRemaining = GDT.getDataStore("ABYSS_bank").data.loanOption3[3];
				GameManager.company.adjustCash(GDT.getDataStore("ABYSS_bank").data.loanOption3[1], "Khoản Vay");
				break;
		}
		div.dialog("close");
	}

	function calcInterestRate() {
		var currWeek = parseInt(GameManager.company.currentWeek);
		var currDate = GameManager.company.getDate(GameManager.company.currentWeek);

		if (GDT.getDataStore("ABYSS_bank").data.fluidRate == undefined)
			GDT.getDataStore("ABYSS_bank").data.fluidRate = 1;
		if (GDT.getDataStore("ABYSS_bank").data.bankBallance == undefined)
			GDT.getDataStore("ABYSS_bank").data.bankBallance = 0;

		//START: Base interest rate over years
		if (currDate.year >= 30)
			var interestRateBase = 1;
		else if (currDate.year >= 28)
			var interestRateBase = 1.5;
		else if (currDate.year >= 26)
			var interestRateBase = 2;
		else if (currDate.year >= 24)
			var interestRateBase = 2.5;
		else if (currDate.year >= 22)
			var interestRateBase = 3.5;
		else if (currDate.year >= 20)
			var interestRateBase = 4.5;
		else if (currDate.year >= 18)
			var interestRateBase = 5;
		else if (currDate.year >= 16)
			var interestRateBase = 6.5;
		else if (currDate.year >= 14)
			var interestRateBase = 7.5;
		else if (currDate.year >= 12)
			var interestRateBase = 9;
		else if (currDate.year >= 10)
			var interestRateBase = 10;
		else if (currDate.year >= 7)
			var interestRateBase = 11;
		else if (currDate.year >= 5)
			var interestRateBase = 12;
		else if (currDate.year >= 3)
			var interestRateBase = 14;
		else
			var interestRateBase = 15;
		//END: Base interest rate over years

		if (GDT.getDataStore("ABYSS_bank").data.fluidRate == undefined)
			var fluidRate = 1;
		else
			var fluidRate = GDT.getDataStore("ABYSS_bank").data.fluidRate;

		//START: Training and R&D mods
		if (GDT.getDataStore("ABYSS_bank").data.negotiationTraining == undefined)
			var trainedLevel = 0;
		else
			var trainedLevel = GDT.getDataStore("ABYSS_bank").data.negotiationTraining;

		switch (trainedLevel) {
			case 1: var trainedMod = 1.05; break;
			case 2: var trainedMod = 1.1; break;
			case 3: var trainedMod = 1.2; break;
			default: var trainedMod = 1;
		}
		//END: Training and R&D mods

		return Math.round(100 * (interestRateBase * fluidRate * trainedMod)) / 100;
	}

	function bankProcessWeek() {
		var currWeek = parseInt(GameManager.company.currentWeek);
		var currDate = GameManager.company.getDate(GameManager.company.currentWeek);

		//START: Interest rate fluctuation
		if (currDate.week == 1 && (currDate.month == 1 || currDate.month == 4 || currDate.month == 7 || currDate.month == 10)) {
			if (currDate.year > 15)
				var fluidRate = Math.round(100 * (1.1 - 0.2 * Math.random())) / 100;
			else
				var fluidRate = Math.round(100 * (1.2 - 0.4 * Math.random())) / 100;

			GDT.getDataStore("ABYSS_bank").data.fluidRate = fluidRate;
		}
		//END: Interest rate fluctuation

		var interestRate = calcInterestRate();
		var interestRateMonthly = interestRate / 12;

		//Update interest rate display on window
		div.find("#CIR").html("Lãi Suất Hiện Tại: <strong>" + interestRate + "%</strong>");

		//New loans options
		if (currDate.week == 1 && (currDate.month == 1 || currDate.month == 4 || currDate.month == 7 || currDate.month == 10)) {
			createLoanOptions();
		}

		//START: Account interest rate
		if (GDT.getDataStore("ABYSS_bank").data.bankBallance != undefined && GDT.getDataStore("ABYSS_bank").data.bankBallance > 0 && currDate.week == 1) {
			gcgd = GameManager.company.getDate(GameManager.company.currentWeek);

			var change = GDT.getDataStore("ABYSS_bank").data.bankBallance * (interestRateMonthly / 100);

			if (GDT.getDataStore("ABYSS_bank").data.bankInterestTarget == undefined || GDT.getDataStore("ABYSS_bank").data.bankInterestTarget == 0)
				GDT.getDataStore("ABYSS_bank").data.bankBallance += change;
			else
				GameManager.company.adjustCash(change, "lãi ngân hàng");
		}
		//END: Account interest rate

		//START: Loan Repay
		if (GDT.getDataStore("ABYSS_bank").data.bankLoanMoneyBorrowed != undefined && GDT.getDataStore("ABYSS_bank").data.bankLoanMoneyBorrowed > 0 && GDT.getDataStore("ABYSS_bank").data.bankLoanMonthsRemaining > 0 && currDate.week == 1) {

			if (GDT.getDataStore("ABYSS_bank").data.bankLoanMonthsRemaining > 1) {
				var loanChange = Math.round(GDT.getDataStore("ABYSS_bank").data.bankLoanMoneyBorrowed / GDT.getDataStore("ABYSS_bank").data.bankLoanMonthsRemaining);
				GDT.getDataStore("ABYSS_bank").data.bankLoanMoneyBorrowed -= loanChange;
				GDT.getDataStore("ABYSS_bank").data.bankLoanMonthsRemaining -= 1;
			} else {
				var loanChange = Math.round(GDT.getDataStore("ABYSS_bank").data.bankLoanMoneyBorrowed);
				GDT.getDataStore("ABYSS_bank").data.bankLoanMoneyBorrowed = 0;
				GDT.getDataStore("ABYSS_bank").data.bankLoanMonthsRemaining = 0;
			}

			GameManager.company.adjustCash(-loanChange, "trả khoản vay");

			if (GDT.getDataStore("ABYSS_bank").data.bankLoanMonthsRemaining == 0) {
				var n = new Notification({
					header: "Đã Trả Hết Khoản Vay",
					text: "Bạn đã trả kỳ cuối cùng của khoản vay. Xếp hạng tín dụng và độ tin cậy của bạn đã tăng. Bạn có thể vay khoản mới nếu muốn.",
					buttonText: "Tuyệt vời",
					previewImage: "./images/notificationIcons/icon_notification_new_money_penalty.png"
				});
				GameManager.company.notifications.push(n)
			}
		}
		//END: Loan Repay

		/* 
		d=new Notification("Bank".localize("heading"){
			previewImage:"./images/notificationIcons/icon_notification_new_money_penalty.png"}
		); */
	}


	GDT.on(GDT.eventKeys.gameplay.weekProceeded, bankProcessWeek);

	function displayBalance() {
		if (GDT.getDataStore("ABYSS_bank").data.bankBallance == undefined)
			GDT.getDataStore("ABYSS_bank").data.bankBallance = 0;

		var CB = parseInt(GDT.getDataStore("ABYSS_bank").data.bankBallance);

		if (isNaN(CB) || CB == 0) {
			div.find("#CB").html("0");
		}
		else {
			div.find("#CB").html(numberFormat(CB));
		}

		var ABYSS_loanTab = '';
		if (GDT.getDataStore("ABYSS_bank").data.bankLoanMoneyBorrowed != undefined && GDT.getDataStore("ABYSS_bank").data.bankLoanMoneyBorrowed > 0) {
			ABYSS_loanTab += 'Tiền đã vay: <strong class="red">' + numberFormat(GDT.getDataStore("ABYSS_bank").data.bankLoanMoneyBorrowed) + '</strong><br/>';
			ABYSS_loanTab += 'Chi phí hàng tháng: <strong class="red">' + numberFormat(GDT.getDataStore("ABYSS_bank").data.bankLoanMoneyBorrowed / GDT.getDataStore("ABYSS_bank").data.bankLoanMonthsRemaining) + '</strong><br/>';
			ABYSS_loanTab += 'Tháng còn lại để trả: <strong>' + numberFormat(GDT.getDataStore("ABYSS_bank").data.bankLoanMonthsRemaining) + '</strong>';
		} else if (GDT.getDataStore("ABYSS_bank").data.loanOption1 != undefined) {
			ABYSS_loanTab += addLoanOption(GDT.getDataStore("ABYSS_bank").data.loanOption1, 1);
			ABYSS_loanTab += addLoanOption(GDT.getDataStore("ABYSS_bank").data.loanOption2, 2);
			ABYSS_loanTab += addLoanOption(GDT.getDataStore("ABYSS_bank").data.loanOption3, 3);
		} else {
			ABYSS_loanTab = 'Không có đề nghị vào lúc này - kiểm tra lại sau 3 tháng.';
		}
		div.find("#ABYSS_FM_tabc2").html(ABYSS_loanTab);
	}

	function bankRateTarget(vTarget) {
		if (vTarget === 0) {
			GDT.getDataStore("ABYSS_bank").data.bankInterestTarget = 0;
			$("#bankAD").addClass("greenButton").removeClass("whiteButton");
			$("#bankAW").addClass("whiteButton").removeClass("greenButton");
		} else {
			GDT.getDataStore("ABYSS_bank").data.bankInterestTarget = 1;
			$("#bankAW").addClass("greenButton").removeClass("whiteButton");
			$("#bankAD").addClass("whiteButton").removeClass("greenButton");
		}
	}

	function bankDeposit() {
		var amount = parseInt($("#EA").val());
		if (isNaN(amount) || amount <= 0) {
			div.dialog("close")
			var n = new Notification({
				header: "Lỗi".localize(),
				text: "Bạn phải nhập một số (lớn hơn 0).".localize(),
				buttonText: "OK"
			});
			GameManager.company.notifications.push(n)
			div.dialog("open")

		} else if (amount > GameManager.company.cash) {
			div.dialog("close")
			var n = new Notification({
				header: "Lỗi".localize(),
				text: "Bạn không có đủ tiền để gửi.".localize(),
				buttonText: "OK"
			});
			GameManager.company.notifications.push(n)
			div.dialog("open")

		} else {
			div.dialog("close");
			Sound.playSoundOnce("cash", 0.2);
			GDT.getDataStore("ABYSS_bank").data.bankBallance += amount;
			GameManager.company.adjustCash(-amount, "Gửi Tiền Vào Ngân Hàng");
		}
	};

	function bankWithdraw() {
		var amount = parseInt(div.find("#EA").val());
		if (isNaN(amount) || amount <= 0) {
			div.dialog("close")
			var n = new Notification({
				header: "Lỗi".localize(),
				text: "Bạn phải nhập một số (lớn hơn 0).".localize(),
				buttonText: "OK",
				onClose: function () {
					div.dialog("open");
				}

			});
			GameManager.company.notifications.push(n)
		}
		else if (amount > GDT.getDataStore("ABYSS_bank").data.bankBallance || isNaN(GDT.getDataStore("ABYSS_bank").data.bankBallance) || GDT.getDataStore("ABYSS_bank").data.bankBallance == 0) {
			div.dialog("close")
			var n = new Notification({
				header: "Lỗi".localize(),
				text: "Bạn không có đủ tiền để rút. Bạn đã cố gắng rút {0} nhưng chỉ có thể rút {1}".localize().format(amount, GDT.getDataStore("ABYSS_bank").data.bankBallance),
				buttonText: "OK"
			});
			GameManager.company.notifications.push(n)
			div.dialog("open")
		}
		else {
			GDT.getDataStore("ABYSS_bank").data.bankBallance = GDT.getDataStore("ABYSS_bank").data.bankBallance - amount;
			GameManager.company.adjustCash(amount, "Rút Tiền Từ Ngân Hàng");
			div.dialog("close")
		}
	};

	function bankWithdrawAll() {
		if (GDT.getDataStore("ABYSS_bank").data.bankBallance > 0) {
			GameManager.company.adjustCash(GDT.getDataStore("ABYSS_bank").data.bankBallance, "Rút Tất Cả Từ Ngân Hàng");
			GDT.getDataStore("ABYSS_bank").data.bankBallance = 0;
			div.dialog("close");
			Sound.playSoundOnce("cash", 0.2);
		}
	};

	var OriginalContextMenu = UI.showContextMenu;
	var NewContextMenu = function (items, mouseloc) {
		items.push({
			label: "Ngân Hàng...",
			action: function () {
				Sound.click();
				GameManager.resume(true);
				var div = $("#ABYSS_FMW");
				div.scrollTop();
				div.css("z-index", "7000");
				div.gdDialog({
					popout: !0,
					close: !0,
					icon: GDT.getRelativePath() + "menuIcon.svg",
					onClose: function () {
						GameManager.togglePause();
						GameManager.resume(true);
					},
					onOpen: function () {
						GameManager.togglePause();

						$('#ABYSS_FM_tabc1').show();
						$('#ABYSS_FM_tabc2').hide();
						$('#ABYSS_FM_tabc3').hide();
						$('#ABYSS_FM_tabs1').addClass('orangeButton').removeClass('whiteButton');
						$('#ABYSS_FM_tabs2').addClass('whiteButton').removeClass('orangeButton');
						$('#ABYSS_FM_tabs3').addClass('whiteButton').removeClass('orangeButton');
					}
				})
			}
		});
		div.find("#EA").val(0);
		div.find("#EAL").val(0);
		displayBalance();
		OriginalContextMenu(items, mouseloc);
	};
	UI.showContextMenu = NewContextMenu;
})();