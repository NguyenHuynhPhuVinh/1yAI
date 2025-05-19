(function () {
	//START: New Trainings
	Training.bankNegotiationL1 = {
		id: "bankNegotiationL1",
		name: "Kỹ Thuật Đàm Phán",
		cost: 100E3,
		pointsCost: 25,
		duration: 12E3,
		canUse: function (a, b) { return 0 === a.id && (GDT.getDataStore("ABYSS_bank").data.negotiationTraining == undefined || GDT.getDataStore("ABYSS_bank").data.negotiationTraining === 0) },
		complete: function (a) {
			a = "Tuyệt vời! Bây giờ bạn biết cách thương lượng để có lãi suất cao hơn từ ngân hàng! (lãi suất của bạn tăng vĩnh viễn).";
			a = a.format(Tutorial.getClickVerb());
			GameManager.company.notifications.push(new Notification("Hoàn Thành Đào Tạo".localize(), a, "OK".localize()));

			GDT.getDataStore("ABYSS_bank").data.negotiationTraining = 1;
		},

		category: "Business",
		categoryDisplayName: "Kinh Doanh"
	};

	Training.bankNegotiationL2 = {
		id: "bankNegotiationL2",
		name: "Kỹ Thuật Đàm Phán Nâng Cao (Yêu cầu NC:500)",
		cost: 750E3,
		pointsCost: 50,
		duration: 20E3,
		canSee: function (a) { return 0 === a.id && (GDT.getDataStore("ABYSS_bank").data.negotiationTraining != undefined && GDT.getDataStore("ABYSS_bank").data.negotiationTraining === 1) },
		canUse: function (a, b) { return 500 <= a.getResearchSkillPoints() },
		complete: function (a) {
			a = "Bây giờ bạn có thể thuyết phục ngân hàng để có lãi suất tốt hơn.";
			a = a.format(Tutorial.getClickVerb());
			GameManager.company.notifications.push(new Notification("Hoàn Thành Đào Tạo".localize(), a, "OK".localize()));

			GDT.getDataStore("ABYSS_bank").data.negotiationTraining = 2;
		},

		category: "Business",
		categoryDisplayName: "Kinh Doanh"
	};

	Training.bankNegotiationL3 = {
		id: "bankNegotiationL3",
		name: "Lưỡi Bạc (Yêu cầu NC:700)",
		cost: 3E6,
		pointsCost: 200,
		duration: 30E3,
		canSee: function (a) { return 0 === a.id && (GDT.getDataStore("ABYSS_bank").data.negotiationTraining != undefined && GDT.getDataStore("ABYSS_bank").data.negotiationTraining === 2) },
		canUse: function (a, b) { return 700 <= a.getResearchSkillPoints() },
		complete: function (a) {
			a = "Bạn giờ đây đã có khả năng ăn nói khéo léo và sẽ nhận được lãi suất tốt nhất có thể.";
			a = a.format(Tutorial.getClickVerb());
			GameManager.company.notifications.push(new Notification("Hoàn Thành Đào Tạo".localize(), a, "OK".localize()));

			GDT.getDataStore("ABYSS_bank").data.negotiationTraining = 3;
		},

		category: "Business",
		categoryDisplayName: "Kinh Doanh"
	};
	//END: New Trainings
})();