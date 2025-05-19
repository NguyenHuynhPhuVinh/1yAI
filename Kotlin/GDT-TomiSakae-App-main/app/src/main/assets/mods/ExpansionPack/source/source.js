var ExpPack = {};
(function () {
	/* Compatibility check */
	var compatibilityCheck = function (data) {
		for (var i = 0; i < ModSupport.availableMods.length; i++) {
			var mod = ModSupport.availableMods[i];
			if (mod.url == "https://github.com/Turntablelover/Game-Dev-Tycoon-Mod" && mod.active) {
				var div = $("body");
				div.append('<div id="ErrorContainer" class="windowBorder smallWindow" style="overflow:auto;display:none;"> <div id="cheatmodtop" class="windowTitle smallerWindowTitle">Compatibility Problem</div>');
				div = $("#ErrorContainer");
				div.append('<div id="error" style="margin-left:50px;width: 400px;" >Expansion Pack Mod is <span style="color:red;">NOT</span> compatible with VENOMOUS mod.</br></br> To continue using Expansion Pack Mod Please disable VENOMOUS mod in the mods menu and restart your Game Dev Tycoon</div>');
				div.append('<div id="mainmenubutton" class="selectorButton whiteButton" onclick="UI.toggleMainMenu()" style="display:inline-block;position: relative;margin-left:50px;width: 350px;" >Main Menu</div>');
				div.gdDialog({ popout: !0, close: 0 });
			}
		}
	};

	ExpPack.initCompatibilityChecks = function () {
		if (GDT.compatibilityCheckActive == 'undefined' || GDT.compatibilityCheckActive == null) {
			GDT.on(GDT.eventKeys.saves.loading, compatibilityCheck);
			GDT.on(GDT.eventKeys.saves.saving, compatibilityCheck);
			GDT.compatibilityCheckActive = true;
		}
	};
	/*  */

	/* Chủ đề */
	ExpPack.addTopic = function () {
		GDT.addTopics([
			{
				id: "Alternate World",
				name: "Thế giới song song".localize("game topic"),
				genreWeightings: [0.7, 1, 0.9, 1, 0.8, 0.8],
				audienceWeightings: [0.7, 0.9, 1]
			}, {
				id: "Archery",
				name: "Bắn cung".localize("game topic"),
				genreWeightings: [1, 0.6, 0.9, 1, 1, 0.7],
				audienceWeightings: [0.8, 0.8, 1]
			}, {
				id: "Assassin",
				name: "Sát thủ".localize("game topic"),
				genreWeightings: [1, 0.9, 0.8, 1, 1, 0.6],
				audienceWeightings: [0.6, 0.7, 1]
			}, {
				id: "Astronaut",
				name: "Phi hành gia".localize("game topic"),
				genreWeightings: [0.8, 1, 0.6, 1, 1, 0.8],
				audienceWeightings: [0.8, 1, 0.8]
			}, {
				id: "Athletics",
				name: "Điền kinh".localize("game topic"),
				genreWeightings: [0.8, 0.6, 1, 0.8, 1, 0.9],
				audienceWeightings: [0.8, 1, 0.8]
			}, /* B */ {
				id: "Baking",
				name: "Làm bánh".localize("game topic"),
				genreWeightings: [0.6, 0.6, 0.6, 1, 0.9, 1],
				audienceWeightings: [1, 0.9, 0.7]
			}, {
				id: "Biathlon",
				name: "Hai môn phối hợp".localize("game topic"),
				genreWeightings: [0.8, 1, 0.6, 1, 0.9, 1],
				audienceWeightings: [0.8, 1, 0.9]
			}, {
				id: "Beat-em-up",
				name: "Đối kháng".localize("game topic"),
				genreWeightings: [1, 0.6, 0.9, 0.6, 0.8, 0.9],
				audienceWeightings: [0.6, 0.8, 1]
			}, {
				id: "Board Game",
				name: "Cờ bàn".localize("game topic"),
				genreWeightings: [0.8, 0.6, 0.7, 0.6, 0.9, 1],
				audienceWeightings: [1, 1, 0.8]
			}, {
				id: "Bobsleigh",
				name: "Trượt băng xe".localize("game topic"),
				genreWeightings: [1, 0.6, 0.9, 0.8, 0.9, 0.7],
				audienceWeightings: [0.6, 0.8, 1]
			}, /* C */ {
				id: "Canoeing",
				name: "Chèo thuyền Ca-nô".localize("game topic"),
				genreWeightings: [0.8, 0.9, 1, 0.7, 1, 0.8],
				audienceWeightings: [0.8, 1, 0.9]
			}, {
				id: "Card Game",
				name: "Trò chơi thẻ bài".localize("game topic"),
				genreWeightings: [0.6, 0.6, 1, 0.8, 0.9, 1],
				audienceWeightings: [1, 1, 0.9]
			}, {
				id: "Cavemen",
				name: "Người thượng cổ".localize("game topic"),
				genreWeightings: [0.9, 1, 1, 0.6, 0.6, 0.9],
				audienceWeightings: [1, 1, 0.9]
			}, {
				id: "Chess",
				name: "Cờ vua".localize("game topic"),
				genreWeightings: [0.6, 0.6, 0.6, 1, 1, 1],
				audienceWeightings: [0.6, 1, 0.9]
			}, {
				id: "Construction",
				name: "Xây dựng".localize("game topic"),
				genreWeightings: [0.6, 0.6, 0.7, 1, 0.9, 1],
				audienceWeightings: [1, 0.8, 0.7]
			}, {
				id: "Crime",
				name: "Tội phạm".localize("game topic"),
				genreWeightings: [1, 0.8, 0.7, 1, 0.7, 0.9],
				audienceWeightings: [0.6, 0.8, 1]
			}, {
				id: "Cycling",
				name: "Đua xe đạp".localize("game topic"),
				genreWeightings: [0.9, 1, 0.8, 0.8, 1, 0.9],
				audienceWeightings: [0.8, 1, 0.9]
			},  /* D */ {
				id: "Dark Fantasy",
				name: "Giả tưởng đen tối".localize("game topic"),
				genreWeightings: [1, 0.8, 1, 0.6, 1, 0.6],
				audienceWeightings: [0.6, 0.6, 1]
			}, {
				id: "Demons",
				name: "Quỷ dữ".localize("game topic"),
				genreWeightings: [1, 0.8, 1, 0.6, 0.6, 0.6],
				audienceWeightings: [0.6, 0.7, 1]
			}, {
				id: "Dinosaurs",
				name: "Khủng long".localize("game topic"),
				genreWeightings: [1, 0.9, 0.6, 0.9, 0.7, 0.6],
				audienceWeightings: [1, 0.9, 0.7]
			}, {
				id: "Doctor",
				name: "Bác sĩ".localize("game topic"),
				genreWeightings: [0.6, 0.6, 0.9, 1, 1, 0.7],
				audienceWeightings: [0.6, 0.8, 1]
			}, {
				id: "Doomsday",
				name: "Ngày tận thế".localize("game topic"),
				genreWeightings: [1, 1, 0.8, 0.6, 0.7, 0.6],
				audienceWeightings: [0.6, 0.7, 1]
			}, /* E */ {
				id: "E-Sports",
				name: "Thể thao điện tử".localize("game topic"),
				genreWeightings: [1, 0.6, 1, 1, 1, 0.6],
				audienceWeightings: [1, 1, 1]
			}, {
				id: "Educational",
				name: "Giáo dục".localize("game topic"),
				genreWeightings: [0.6, 0.6, 0.6, 1, 0.8, 1],
				audienceWeightings: [1, 0.8, 0.6]
			}, /* F */ {
				id: "Fairy Tale",
				name: "Truyện cổ tích".localize("game topic"),
				genreWeightings: [0.8, 1, 0.8, 0.8, 0.6, 1],
				audienceWeightings: [1, 0.8, 0.6]
			}, {
				id: "Fishing",
				name: "Câu cá".localize("game topic"),
				genreWeightings: [0.6, 0.7, 0.9, 1, 1, 0.8],
				audienceWeightings: [0.7, 1, 0.9]
			}, {
				id: "Football",
				name: "Bóng đá".localize("game topic"),
				genreWeightings: [1, 0.7, 1, 0.8, 1, 0.9],
				audienceWeightings: [0.9, 1, 0.9]
			}, {
				id: "Formula 1",
				name: "Công thức 1".localize("game topic"),
				genreWeightings: [1, 0.8, 0.8, 0.8, 1, 1],
				audienceWeightings: [0.7, 1, 1]
			}, /* G */ {
				id: "Game Pack",
				name: "Gói trò chơi".localize("game topic"),
				genreWeightings: [0.8, 0.8, 0.8, 0.8, 0.8, 1],
				audienceWeightings: [0.8, 1, 0.7]
			}, {
				id: "Ghosts",
				name: "Ma".localize("game topic"),
				genreWeightings: [0.8, 1, 0.9, 0.6, 0.6, 0.8],
				audienceWeightings: [1, 0.8, 0.9]
			}, {
				id: "Goblin",
				name: "Yêu tinh".localize("game topic"),
				genreWeightings: [0.9, 1, 1, 0.8, 0.6, 1],
				audienceWeightings: [0.9, 1, 0.9]
			}, {
				id: "Gods",
				name: "Thần thánh".localize("game topic"),
				genreWeightings: [1, 1, 1, 0.7, 0.8, 0.6],
				audienceWeightings: [0.7, 1, 0.9]
			}, /* H */ {
				id: "Hide and Seek",
				name: "Trốn tìm".localize("game topic"),
				genreWeightings: [0.6, 1, 0.7, 0.8, 0.7, 1],
				audienceWeightings: [1, 0.9, 0.6]
			}, {
				id: "Hockey",
				name: "Khúc côn cầu".localize("game topic"),
				genreWeightings: [0.8, 0.6, 0.7, 1, 1, 0.7],
				audienceWeightings: [0.9, 1, 0.9]
			}, {
				id: "Horse Racing",
				name: "Đua ngựa".localize("game topic"),
				genreWeightings: [1, 0.7, 0.9, 0.8, 1, 0.7],
				audienceWeightings: [0.7, 0.8, 1]
			}, /* I */ {
				id: "Ice Hockey",
				name: "Khúc côn cầu trên băng".localize("game topic"),
				genreWeightings: [1, 0.6, 0.9, 0.8, 1, 0.7],
				audienceWeightings: [0.8, 0.9, 1]
			}, /* J */ {
				id: "Judo",
				name: "Võ Judo".localize("game topic"),
				genreWeightings: [1, 0.6, 0.8, 1, 1, 0.7],
				audienceWeightings: [0.7, 1, 1]
			}, /* K */ {
				id: "Karate",
				name: "Võ Karate".localize("game topic"),
				genreWeightings: [1, 0.7, 1, 0.7, 1, 0.7],
				audienceWeightings: [0.7, 0.9, 1]
			}, /* M */ {
				id: "Maze",
				name: "Mê cung".localize("game topic"),
				genreWeightings: [0.8, 0.8, 0.9, 1, 0.9, 1],
				audienceWeightings: [0.8, 1, 0.9]
			}, {
				id: "Mining",
				name: "Khai mỏ".localize("game topic"),
				genreWeightings: [0.8, 1, 0.9, 0.8, 0.7, 1],
				audienceWeightings: [1, 0.9, 0.7]
			}, {
				id: "Motorcross",
				name: "Đua xe địa hình".localize("game topic"),
				genreWeightings: [1, 1, 0.8, 0.6, 0.9, 0.7],
				audienceWeightings: [0.8, 0.9, 1]
			}, {
				id: "Modern",
				name: "Hiện đại".localize("game topic"),
				genreWeightings: [1, 0.8, 0.6, 0.6, 0.8, 0.6],
				audienceWeightings: [0.7, 0.9, 1]
			}, {
				id: "Mummies",
				name: "Xác ướp".localize("game topic"),
				genreWeightings: [1, 1, 0.7, 0.7, 0.7, 1],
				audienceWeightings: [0.7, 1, 0.8]
			}, /* P */ {
				id: "Parkour",
				name: "Parkour".localize("game topic"),
				genreWeightings: [1, 1, 0.7, 1, 0.9, 0.6],
				audienceWeightings: [0.7, 0.9, 1]
			}, {
				id: "Point & Click",
				name: "Trỏ và nhấp".localize("game topic"),
				genreWeightings: [0.7, 1, 0.7, 1, 0.9, 1],
				audienceWeightings: [0.9, 1, 0.7]
			}, {
				id: "Police",
				name: "Cảnh sát".localize("game topic"),
				genreWeightings: [1, 0.9, 0.7, 0.9, 0.7, 0.6],
				audienceWeightings: [0.9, 1, 0.7]
			}, {
				id: "Politics",
				name: "Chính trị".localize("game topic"),
				genreWeightings: [0.6, 0.6, 0.8, 1, 1, 0.7],
				audienceWeightings: [0.6, 0.8, 1],
				missionOverrides: [
					[0, 0, 0, 1, 0.8, 0.9, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0.8, 0.9, 1, 1, 0.8, 0.9, 1, 0.9, 0.8],
					[0, 0, 0, 0, 0, 0, 0, 0, 0],
					[0, 0, 0, 1, 0.9, 0, 0, 0, 0]
				]
			}, {
				id: "Puzzle",
				name: "Giải đố".localize("game topic"),
				genreWeightings: [0.8, 1, 0.6, 0.7, 1, 1],
				audienceWeightings: [1, 1, 0.9]
			}, /* R */ {
				id: "Rage",
				name: "Giận dữ".localize("game topic"),
				genreWeightings: [1, 0.6, 0.6, 0.6, 0.9, 1],
				audienceWeightings: [0.6, 0.9, 1]
			}, {
				id: "Robot",
				name: "Người máy".localize("game topic"),
				genreWeightings: [1, 0.8, 0.8, 0.7, 1, 0.9],
				audienceWeightings: [1, 0.9, 0.8]
			}, {
				id: "Rugby",
				name: "Bóng bầu dục".localize("game topic"),
				genreWeightings: [1, 0.7, 1, 0.7, 1, 0.7],
				audienceWeightings: [0.7, 0.9, 1]
			}, /* S */ {
				id: "Sailing",
				name: "Đi thuyền buồm".localize("game topic"),
				genreWeightings: [0.8, 1, 0.9, 0.9, 1, 0.8],
				audienceWeightings: [0.7, 1, 0.8]
			}, {
				id: "Samurais",
				name: "Samurai".localize("game topic"),
				genreWeightings: [1, 0.7, 0.9, 0.7, 0.9, 0.6],
				audienceWeightings: [0.7, 0.9, 1]
			}, {
				id: "Science",
				name: "Khoa học".localize("game topic"),
				genreWeightings: [0.6, 0.6, 0.7, 1, 1, 0.8],
				audienceWeightings: [0.8, 1, 0.9]
			}, {
				id: "Steampunk",
				name: "Steampunk".localize("game topic"),
				genreWeightings: [1, 0.9, 1, 1, 0.7, 0.9],
				audienceWeightings: [0.7, 1, 0.9]
			}, {
				id: "Skiing",
				name: "Trượt tuyết".localize("game topic"),
				genreWeightings: [1, 0.9, 0.9, 1, 0.8, 0.7],
				audienceWeightings: [0.8, 1, 0.8]
			}, {
				id: "Super Villain",
				name: "Siêu ác nhân".localize("game topic"),
				genreWeightings: [1, 0.7, 0.9, 0.7, 1, 0.8],
				audienceWeightings: [1, 0.8, 0.7]
			}, {
				id: "Surfing",
				name: "Lướt sóng".localize("game topic"),
				genreWeightings: [1, 0.9, 0.9, 0.8, 1, 0.8],
				audienceWeightings: [0.8, 1, 0.7]
			}, {
				id: "Survival",
				name: "Sinh tồn".localize("game topic"),
				genreWeightings: [0.9, 1, 1, 0.8, 1, 0.6],
				audienceWeightings: [0.8, 1, 0.9]
			}, {
				id: "Swimming",
				name: "Bơi lội".localize("game topic"),
				genreWeightings: [0.8, 0.9, 1, 0.7, 1, 1],
				audienceWeightings: [0.8, 1, 0.9]
			}, /* T */ {
				id: "Table Tennis",
				name: "Bóng bàn".localize("game topic"),
				genreWeightings: [0.8, 0.9, 0.8, 1, 1, 0.8],
				audienceWeightings: [0.8, 1, 0.9]
			}, {
				id: "Tennis",
				name: "Quần vợt".localize("game topic"),
				genreWeightings: [1, 0.9, 0.8, 0.8, 1, 0.9],
				audienceWeightings: [0.8, 1, 0.9]
			}, {
				id: "Tower Defense",
				name: "Thủ thành".localize("game topic"),
				genreWeightings: [1, 0.7, 0.6, 0.9, 1, 0.7],
				audienceWeightings: [0.6, 1, 0.8]

			}, /* V */ {
				id: "Vikings",
				name: "Người Viking".localize("game topic"),
				genreWeightings: [1, 0.8, 1, 0.7, 0.8, 0.6],
				audienceWeightings: [0.7, 0.9, 1]
			}, /* W */ {
				id: "War",
				name: "Chiến tranh".localize("game topic"),
				genreWeightings: [1, 0.8, 0.9, 0.8, 0.6, 0.6],
				audienceWeightings: [0.6, 0.9, 1]
			}, {
				id: "Warlocks",
				name: "Pháp sư Hắc ám".localize("game topic"), // Or simply "Pháp sư"
				genreWeightings: [1, 0.8, 0.8, 1, 0.7, 0.6],
				audienceWeightings: [0.8, 0.9, 1]
			}, {
				id: "Witches",
				name: "Phù thủy".localize("game topic"),
				genreWeightings: [0.7, 1, 0.9, 0.6, 0.9, 1],
				audienceWeightings: [1, 0.9, 0.7]
			}, {
				id: "Wizzards", // Assuming typo for Wizards
				name: "Pháp sư".localize("game topic"),
				genreWeightings: [1, 1, 0.9, 0.7, 0.8, 0.9],
				audienceWeightings: [0.7, 1, 0.9]
			}, {
				id: "Wrestling",
				name: "Đấu vật".localize("game topic"),
				genreWeightings: [1, 0.6, 0.9, 0.8, 1, 0.7],
				audienceWeightings: [0.6, 0.9, 1]
			}]);
	};
	/*  */

	/* Platforms */

	/* Grapple */
	ExpPack.addPlatformGrapintosh = function () {
		var icon = './mods/ExpansionPack/source/img/Grapple.png';
		GDT.addPlatform(
			{
				id: 'Grapintosh',
				name: 'Grapintosh',
				company: 'Grapple',
				startAmount: 0.351,
				unitsSold: 0.534,
				marketKeyPoints: [{ date: "2/3/2", amount: 0.215 }, { date: "5/7/4", amount: 0.478 }, { date: "11/9/3", amount: 0.738 }],
				licencePrize: 20000,
				published: '1/7/4',
				platformRetireDate: '4/6/2',
				developmentCosts: 25000,
				genreWeightings: [1, 0.8, 0.9, 1, 1, 0.7],
				audienceWeightings: [0.8, 0.9, 1],
				techLevel: 1,
				iconUri: icon,
				events: [
					{
						id: '12111996-0000-0000-0000-DZJENGISKHAN',
						date: '1/5/1',
						getNotification: function (company) {
							return new Notification({
								header: "Tin tức ngành".localize(),
								text: "Hôm nay, Grapple, một nhà sản xuất phần cứng mới, đã công bố một máy tính hoàn toàn mới - Grapintosh. Grapintosh đi kèm với hệ điều hành tiên tiến mới có tên Grap OS. Mặc dù nền tảng mới này khá đắt tiền, nhưng bạn sẽ nhận được giá trị xứng đáng với số tiền bỏ ra. Grapple cho biết Grapintosh sẽ có mặt trên thị trường {0}".localize().format(General.getETADescription('1/5/1', '1/7/4')),
								image: icon
							});
						}
					}
				]
			});
	};

	ExpPack.addPlatformGrMac = function () {
		var icon = './mods/ExpansionPack/source/img/grMac.png';
		GDT.addPlatform(
			{
				id: '12111996-0000-0000-0001-DZJENGISKHAN',
				name: 'grMac',
				company: 'Grapple',
				startAmount: 2.6,
				unitsSold: 5.434,
				licencePrize: 40000,
				published: '16/8/1',
				platformRetireDate: '260/12/4',
				developmentCosts: 25000,
				genreWeightings: [1, 0.9, 1, 1, 1, 0.8],
				audienceWeightings: [0.8, 0.9, 1],
				techLevel: 6,
				iconUri: icon,
				events: [
					{
						id: '12111996-1111-0000-0001-DZJENGISKHAN',
						date: '16/5/4',
						getNotification: function (company) {
							return new Notification({
								header: "Tin tức ngành".localize(),
								text: "Grapple, nhà phát triển của Grapintosh rất thành công, đã công bố một nền tảng mới có tên là grMac. Grapple đã thành công trong việc tích hợp tất cả phần cứng vào màn hình và đặt tên là máy tính 'Tất cả trong một'.{n} Mặc dù phần cứng nhỏ gọn, nó vẫn có tất cả sức mạnh mà người dùng mong đợi từ Grapple. Máy grMac sẽ được phát hành {0}".localize().format(General.getETADescription('16/5/4', '16/8/1')),
								image: icon
							});
						}
					}
				]
			});
	};
	/*  */

	/* Itara */
	ExpPack.addPlatformItaraBackflash = function () {
		var icon = './mods/ExpansionPack/source/img/Itara.png';
		GDT.addPlatform(
			{
				id: '31102000-2-1-4-1-LINELIAR',
				name: 'Itara Backflash',
				company: 'Itara',
				startAmount: 1.3,
				unitsSold: 4.2,
				licencePrize: 150000,
				published: '12/11/3',
				platformRetireDate: '16/1/2',
				developmentCosts: 125000,
				genreWeightings: [0.8, 1, 0.6, 0.7, 1, 0.6],
				audienceWeightings: [0.8, 1, 0.7],
				techLevel: 2,
				iconUri: icon,
				events: [
					{
						id: '31102000-2-1-4-1-1-LINELIAR',
						date: '12/7/3',
						getNotification: function (company) {
							return new Notification({
								header: "Tin tức ngành".localize(),
								text: "Hôm nay Itara, một công ty nổi tiếng với các máy console trong thị trường console đời đầu, đã thông báo rằng họ sẽ phát hành một máy console mới - Itara Backflash.{n} Mặc dù phải đối mặt với sự cạnh tranh không thể tránh khỏi từ TES 64, Itara đã tuyên bố rằng họ dự đoán console này sẽ rất thành công.{n} Itara Backflash sẽ được phát hành vào {0}.".localize().format(General.getETADescription('12/7/3', '12/11/3')),
								image: icon
							});
						}
					}
				]
			});
	};

	ExpPack.addPlatformItara5200 = function () {
		var icon = './mods/ExpansionPack/source/img/itara5200.png';
		GDT.addPlatform(
			{
				id: '12111996-0000-0100-0001-DZJENGISKHAN',
				name: 'Itara 5200',
				company: 'Itara',
				startAmount: 0.4,
				unitsSold: 0.462,
				licencePrize: 45000,
				published: '2/11/2',
				platformRetireDate: '6/4/2',
				developmentCosts: 25000,
				genreWeightings: [0.8, 1, 1, 0.9, 0.7, 1],
				audienceWeightings: [0.8, 1, 0.7],
				techLevel: 1,
				iconUri: icon,
				events: [
					{
						id: '31102000-2-1-4-1-2-LINELIAR',
						date: '2/9/1',
						getNotification: function (company) {
							return new Notification({
								header: "Tin tức ngành".localize(),
								text: "Hôm nay, Itara đã công bố nền tảng đầu tiên của họ, Itara 5200.{n} Máy console này sử dụng cần điều khiển analog và phải cạnh tranh với TES phổ biến từ Ninvento.\nItara 5200 sẽ được phát hành trong {0}.".localize().format(General.getETADescription('2/9/1', '2/11/2')),
								image: icon
							});
						}
					}
				]
			});
	};
	/*  */

	/* Ninvento */
	ExpPack.addPlatform3GS = function () {
		var icon = './mods/ExpansionPack/source/img/3GS.png';
		GDT.addPlatform(
			{
				id: '12111996-0000-0001-0000-DZJENGISKHAN',
				name: '3GS',
				company: 'Ninvento',
				startAmount: 1.5,
				unitsSold: 3.582,
				licencePrize: 100000,
				published: '21/9/3',
				platformRetireDate: '24/5/1',
				developmentCosts: 80000,
				genreWeightings: [0.7, 1, 0.8, 1, 0.6, 1],
				audienceWeightings: [0.9, 1, 0.6],
				techLevel: 4,
				iconUri: icon,
				events: [
					{
						id: '12111996-1111-0001-0000-DZJENGISKHAN',
						date: '21/5/1',
						getNotification: function (company) {
							return new Notification({
								header: "Tin tức ngành".localize(),
								text: "Hôm nay Ninvento, nổi tiếng với GS, đã thông báo rằng họ sẽ phát hành người kế nhiệm, 3GS. Máy console cầm tay này sẽ có hoạt ảnh 3D - đầu tiên trong thị trường máy cầm tay.{n} Ninvento tuyên bố rằng 3GS sẽ được phát hành {0}.".localize().format(General.getETADescription('21/5/1', '21/9/3')),
								image: icon
							});
						}
					}
				]
			});
	};

	ExpPack.addPlatform2GS = function () {
		var icon = './mods/ExpansionPack/source/img/2GS.png';
		GDT.addPlatform(
			{
				id: '12111996-0000-0001-0001-DZJENGISKHAN',
				name: '2GS',
				company: 'Ninvento',
				startAmount: 2.125,
				unitsSold: 3.634,
				licencePrize: 250000,
				published: '23/4/2',
				platformRetireDate: '29/2/1',
				developmentCosts: 150000,
				genreWeightings: [0.7, 0.8, 0.9, 1, 0.6, 1],
				audienceWeightings: [1, 0.8, 0.6],
				techLevel: 5,
				iconUri: icon,
				events: [
					{
						id: '12111996-1111-0001-0001-DZJENGISKHAN',
						date: '21/1/4',
						getNotification: function (company) {
							return new Notification({
								header: "Tin tức ngành".localize(),
								text: "Hôm nay là ngày Ninvento thông báo sẽ làm một máy console cầm tay khác tiếp nối 3GS, đó là 2GS. Mặc dù 2GS có cùng cơ chế như 3GS, nó có đồ họa tốt hơn và, do đó, gameplay tốt hơn. 2GS sẽ được phát hành {0}.".localize().format(General.getETADescription('21/1/4', '21/4/2')),
								image: icon
							});
						}
					}
				]
			});
	};

	ExpPack.addPlatformGamelingColor = function () {
		var gameling = Platforms.allPlatforms.first(function (p) { return p.id == 'Gameling'; });
		if (gameling) {
			gameling.platformRetireDate = '10/4/2';
		}

		var icon = './mods/ExpansionPack/source/img/gamelingColor.png';
		GDT.addPlatform(
			{
				id: '12111996-0000-0001-0010-DZJENGISKHAN',
				name: 'Gameling Color',
				company: 'Ninvento',
				startAmount: 0.7,
				unitsSold: 0.854,
				licencePrize: 15000,
				published: '9/11/2',
				platformRetireDate: '15/2/1',
				developmentCosts: 80000,
				genreWeightings: [0.7, 0.9, 1, 0.9, 0.6, 1],
				audienceWeightings: [1, 0.8, 0.6],
				techLevel: 3,
				iconUri: icon,
				events: [
					{
						id: '12111996-1111-0001-0010-DZJENGISKHAN',
						date: '9/8/4',
						getNotification: function (company) {
							return new Notification({
								header: "Tin tức ngành".localize(),
								text: "Ninvento vừa công bố nền tảng tiếp theo của họ! Gameling Color, như tên gọi của nó, là một máy console cầm tay khác, có độ phân giải 160x144 với hơn 30 nghìn màu.{n} Chúng tôi không chắc liệu nó có vượt qua thành công của Gameling gốc hay không nhưng chúng tôi không thể chờ đợi! Ninvento cho biết Gameling Color sẽ được phát hành {0}".localize().format(General.getETADescription('9/8/4', '9/11/2')),
								image: icon
							});
						}
					}
				]
			});
	};
	/*  */

	/* Vonny */
	ExpPack.addPlatformViva = function () {
		var icon = './mods/ExpansionPack/source/img/vivaPlaysystem.png';
		GDT.addPlatform(
			{
				id: '12111996-0000-0010-0000-DZJENGISKHAN',
				name: 'Viva Playsystem',
				company: 'Vonny',
				startAmount: 4.635,
				unitsSold: 5.430,
				licencePrize: 750000,
				published: '22/6/2',
				platformRetireDate: '29/2/1',
				developmentCosts: 300000,
				genreWeightings: [0.7, 0.8, 0.9, 1, 0.6, 1],
				audienceWeightings: [1, 0.8, 0.6],
				techLevel: 6,
				iconUri: icon,
				events: [
					{
						id: '12111996-1111-0010-0001-DZJENGISKHAN',
						date: '22/3/4',
						getNotification: function (company) {
							return new Notification({
								header: "Tin tức ngành".localize(),
								text: "Vonny, nhà phát triển của nền tảng PPS, đã lan truyền tin đồn rằng họ đang làm việc trên một nền tảng mới có tên 'Viva Playsystem' hay viết tắt là 'VPS'.{n} Họ chưa công bố nhiều thông tin về VPS nhưng họ tuyên bố rằng máy console cầm tay mới sẽ được phát hành {0}".localize().format(General.getETADescription('22/3/4', '22/6/2')),
								image: icon
							});
						}
					}
				]
			});
	};

	ExpPack.addPlatformPS2S = function () {
		var icon = './mods/ExpansionPack/source/img/playSystem2Slim.png';
		GDT.addPlatform(
			{
				id: '12111996-0000-0010-0001-DZJENGISKHAN',
				name: 'Playsystem 2 Slim',
				company: 'Vonny',
				startAmount: 1.4,
				unitsSold: 2.7,
				licencePrize: 350000,
				published: '12/2/2',
				platformRetireDate: '19/1/3',
				developmentCosts: 70000,
				genreWeightings: [1, 0.8, 1, 0.9, 0.7, 0.9],
				audienceWeightings: [0.9, 1, 0.8],
				techLevel: 5,
				iconUri: icon,
				events: [
					{
						id: '12111996-1111-0010-0010-DZJENGISKHAN',
						date: '11/11/2',
						getNotification: function (company) {
							return new Notification({
								header: "Tin tức ngành".localize(),
								text: "Vonny vừa công bố thông tin về phiên bản cải tiến của Playsystem 2 thành công của họ. Vonny gọi nền tảng mới là 'Playsystem 2 Slim'.{n} Mặc dù không phải cái tên sáng tạo nhất, họ tuyên bố rằng Playsystem 2 Slim có phần cứng tốt hơn so với Playsystem 2 gốc.\nVonny không rõ ràng về ngày phát hành nhưng chúng tôi dự kiến nó {0}".localize().format(General.getETADescription('11/11/4', '12/2/2')),
								image: icon
							});
						}
					}
				]
			});
	};
	/*  */

	/* Holo Corp */
	ExpPack.addPlatformHoloBox = function () {
		var icon = './mods/ExpansionPack/source/img/HoloBox.png';
		GDT.addPlatform(
			{
				id: '12111996-0000-0011-0000-DZJENGISKHAN',
				name: 'Holo Box',
				company: 'Holo Corp',
				startAmount: 1.7,
				unitsSold: 5.3,
				licencePrize: 250000,
				published: '20/1/1',
				platformRetireDate: '260/12/4',
				developmentCosts: 150000,
				genreWeightings: [0.9, 0.8, 0.7, 1, 0.7, 0.6],
				audienceWeightings: [0.7, 0.8, 1],
				techLevel: 7,
				iconUri: icon,
				events: [
					{
						id: '12111996-1111-0011-0001-DZJENGISKHAN',
						date: '19/9/3',
						getNotification: function (company) {
							return new Notification({
								header: "Tin tức ngành".localize(),
								text: "Hôm nay Holo Corp, một công ty game mới, đã thông báo rằng họ sẽ phát hành console đầu tiên của mình, Holo Box. Nó hiển thị game bằng công nghệ holographic và loại bỏ nhu cầu về đĩa game bằng cách tải game vào ổ đĩa flash được cắm vào console, giảm chi phí game. Họ dự đoán rằng Holo Box sẽ là một thành công lớn. Nó sẽ được phát hành {0}".localize().format(General.getETADescription('19/9/3', '20/1/1')),
								image: icon
							});
						}
					}
				]
			});
	};
	/*  */

	/* Mirconoft */
	ExpPack.addPlatformMBox360S = function () {
		var icon = './mods/ExpansionPack/source/img/mBox360Slim.png';
		GDT.addPlatform(
			{
				id: '12111996-1111-0100-0000-DZJENGISKHAN',
				name: 'mBox 360 Slim',
				company: 'Mirconoft',
				startAmount: 2,
				unitsSold: 3.2,
				licencePrize: 500000,
				published: '17/4/4',
				platformRetireDate: '24/9/3',
				developmentCosts: 80000,
				genreWeightings: [1, 0.9, 1, 0.9, 0.7, 0.9],
				audienceWeightings: [0.8, 0.9, 1],
				techLevel: 5,
				iconUri: icon,
				events: [
					{
						id: '12111996-1111-0100-0001-DZJENGISKHAN',
						date: '17/1/1',
						getNotification: function (company) {
							return new Notification({
								header: "Tin tức ngành".localize(),
								text: "Mirconoft đã công bố cải tiến cho mBox 360 của họ, có tên là mBox 360 Slim.\nTheo các nhà phê bình, Mirconoft không thực hiện những cải tiến lớn và do đó họ tò mò xem thị trường sẽ phản ứng như thế nào. {n} mBox 360 Slim sẽ được phát hành {0}".localize().format(General.getETADescription('17/1/1', '17/4/4')),
								image: icon
							});
						}
					}
				]
			});
	};
	/*  */

	/* Events */
	ExpPack.addEventCelebration = function () {
		var eventId = "12111996-0001-0000-0000-DZJENGISKHAN";

		var Celebration = {
			id: eventId,
			isRandom: true,
			maxTriggers: 1,
			trigger: function (company) {

				return company.currentLevel == 1 && company.isGameProgressBetween(0.8, 0.9);
			},
			getNotification: function (company) {
				var game = company.currentGame;

				var msg = "Bạn đã gần hoàn thành {0}! Bạn có thể tổ chức một bữa tiệc cho khu phố để ăn mừng, nhưng tất nhiên sẽ tốn một chút tiền...".localize().format(game.title);
				return new Notification({
					sourceId: eventId,
					header: "Tiệc ăn mừng?".localize(),
					text: msg,
					options: ["Đến giờ tiệc!", "Không tiệc tùng"]
				});
			},
			complete: function (decision) {
				var company = GameManager.company;

				if (decision === 0) {
					var n = new Notification({
						header: "Đến giờ tiệc!!".localize(),
						text: "Bữa tiệc đã thành công rực rỡ. Mọi người đều rất ấn tượng với công việc của bạn."
					});
					n.adjustCash(-500, "Tiệc");
					n.adjustHype(5 + 10 * company.getRandom());

					company.activeNotifications.addRange(n.split());
					return;
				}
				if (decision === 1) {
					var n = new Notification({
						header: "Không tiệc tùng".localize(),
						text: "Có vẻ như mọi thứ sẽ yên tĩnh tối nay."
					});
					return;
				}
			}
		};
		GDT.addEvent(Celebration);
	};

	ExpPack.addEventCuriosity = function () {
		var eventId = "12111996-0001-0000-0001-DZJENGISKHAN";

		var fanCuriosity = {
			id: eventId,
			isRandom: true,
			maxTriggers: 1,
			trigger: function (company) {

				return company.currentLevel == 3 && company.isGameProgressBetween(0.2, 0.9);
			},
			getNotification: function (company) {
				var game = company.currentGame;

				var msg = "Sếp, người hâm mộ của chúng ta đã phát hiện ra rằng chúng ta đang phát triển {0} và họ đang tự hỏi nó là về cái gì. Chúng ta có ba lựa chọn: có thể nói với họ mọi thứ, nói với họ một chút, hoặc chúng ta có thể bỏ qua họ, hy vọng điều này không làm tổn thương họ quá nhiều. Có một số sự chú ý có giá trị, nhưng liệu nó có đáng không?".localize().format(game.title);
				return new Notification({
					sourceId: eventId,
					header: "Cung cấp thông tin?".localize(),
					text: msg,
					options: ["Cho họ những gì họ muốn!", "Nói với họ một chút", "Đừng nói với họ!"]
				});
			},
			complete: function (decision) {
				var company = GameManager.company;

				if (decision === 0) {
					var n = new Notification({
						header: "Cho họ những gì họ muốn!".localize(),
						text: "Người hâm mộ của bạn rất phấn khích về những gì bạn đã nói với họ và họ đang lan truyền thông tin của bạn khắp thế giới!"
					});
					n.adjustHype(5 + 6 * company.getRandom());
					company.activeNotifications.addRange(n.split());
					return;
				}
				if (decision === 1) {
					var n = new Notification({
						header: "Nói với họ một chút".localize(),
						text: "Người hâm mộ của bạn rất phấn khích về thông tin của bạn, nhưng họ cũng nghĩ rằng bạn có thể đã nói nhiều hơn một chút."
					});
					n.adjustHype(5 + 3 * company.getRandom());
					return;
				}
				if (decision === 2) {
					var n = new Notification({
						header: "Đừng nói với họ!".localize(),
						text: "Người hâm mộ của bạn hơi thất vọng về bạn."
					});
					return;
				}
			}
		};
		GDT.addEvent(fanCuriosity);
	};

	ExpPack.addEventVac = function () {
		var eventId = "12111996-0001-0000-0010-DZJENGISKHAN";

		var vacuumCleaner = {
			id: eventId,
			isRandom: true,
			maxTriggers: 1,
			trigger: function (company) {

				return company.currentLevel == 1 && company.isGameProgressBetween(0.6, 0.9) && company.gameLog.length > 4;
			},
			getNotification: function (company) {
				var game = company.currentGame;

				var msg = "Trong khi bạn đang làm việc trên trò chơi của mình, ai đó gõ cửa nhà để xe - một người đàn ông muốn bán cho bạn một chiếc máy hút bụi. Bạn có muốn mua máy hút bụi với giá 4K không?".localize().format(game.title);
				return new Notification({
					sourceId: eventId,
					header: "Máy Hút Bụi".localize(),
					text: msg,
					options: ["Mua nó!", "Yêu cầu rời đi", "Tố cáo anh ta"]
				});
			},
			complete: function (decision) {
				var company = GameManager.company;

				if (decision === 0) {
					var n = new Notification({
						header: "Máy Hút Bụi".localize(),
						text: "Bạn mua máy hút bụi. Sau khi dọn dẹp nhà để xe, bạn giành được giải thưởng cho nhà để xe sạch nhất trong ngành công nghiệp game! Giờ đây mọi người đều biết về trò chơi bạn đang làm!"
					});
					n.adjustHype(5 + 10 * company.getRandom());
					n.adjustCash(-4000, "Máy Hút Bụi");

					company.activeNotifications.addRange(n.split());
					return;
				}
				if (decision === 1) {
					var n = new Notification({
						header: "Lại là tôi!".localize(),
						text: "Anh ta rời đi... nhưng ngay sau đó, anh ta quay lại. Tuy nhiên, lần này anh ta thuyết phục bạn mua chiếc máy hút bụi đó. Tạm biệt, 4K."
					});
					n.adjustCash(-4000, "Máy Hút Bụi");
					company.notifications.push(n);
					return;
				}
				if (decision === 2) {
					var n = new Notification({
						header: "Máy Hút Bụi".localize(),
						text: "'Sau khi bạn tố cáo tôi, tôi nghĩ đó là một ý tưởng hay để làm hỏng danh tiếng của bạn với truyền thông! Nhưng điều đó không hiệu quả, bạn chỉ làm cho trò chơi của mình được chú ý hơn!' là điều cuối cùng anh ta nói trước khi bỏ đi trong tâm trạng tức giận."
					});
					n.adjustHype(15 + 25 * company.getRandom());
					company.activeNotifications.addRange(n.split());
					return;
				}
			}
		};
		GDT.addEvent(vacuumCleaner);
	};

	ExpPack.addEventBilly = function () {
		var eventId = "12111996-0001-0000-0011-DZJENGISKHAN";

		var billyBrakeIn = {
			id: eventId,
			isRandom: true,
			maxTriggers: 1,
			trigger: function (company) {
				return company.currentLevel == 2 && company.isGameProgressBetween(0.2, 0.9);
			},
			getNotification: function (company) {
				var game = company.currentGame;

				var msg = "Có vẻ như trẻ em trong khu phố đã bắt đầu trò chuyện về trò chơi sắp ra mắt của bạn {0}. Tin đồn là Billy, con của hàng xóm, đã lẻn vào nhà để xe và do thám một số giấy tờ thiết kế.{n}Làm thế nào cậu ta làm được điều này là một bí ẩn. Bạn có thể thề rằng bạn đã ngồi trong nhà để xe suốt thời gian đó!\nBạn muốn phản ứng thế nào?\n\nBạn có thể nói chuyện với cha mẹ để phạt cậu ta, bỏ qua sự cố hoặc có thể mời một số hàng xóm đến để cho họ xem thêm về trò chơi."
					.localize().format(game.title);

				company.adjustHype(5 + 10 * company.getRandom());

				return new Notification({
					sourceId: eventId,
					header: "Billy, đứa trẻ".localize(),
					text: msg,
					options: ["Nói chuyện với cha mẹ", "Bỏ qua sự cố", "Mời họ đến"]
				});
			},
			complete: function (decision) {
				var company = GameManager.company;

				if (decision === 0) {
					var n = new Notification({
						header: "Billy, đứa trẻ".localize(),
						text: "Bạn nói chuyện với cha mẹ về hành động của Billy và họ hứa rằng điều đó sẽ không xảy ra nữa."
					});
					n.adjustHype(5 + 10 * company.getRandom());

					company.activeNotifications.addRange(n.split());
					return;
				}
				if (decision === 1) {
					var n = new Notification({
						header: "Tài liệu biến mất".localize(),
						text: "Hôm khác, bạn đang làm việc trên một số tài liệu thiết kế phức tạp - tuy nhiên, bây giờ chúng đã biến mất. Dấu chân nhỏ trên sàn nhà gợi ý rằng ai đó có thể đã lấy chúng.\nThật không may, bạn phải tạo lại các tài liệu - đây có lẽ là công việc của Billy",
						weeksUntilFired: 1 + 2 * company.getRandom()
					});
					n.adjustCash(-500, "Khôi phục tài liệu");
					company.notifications.push(n);
					return;
				}
				if (decision === 2) {
					var n = new Notification({
						header: "Billy, đứa trẻ".localize(),
						text: "Bạn mời Billy, cha mẹ cậu ấy và một vài hàng xóm quan tâm khác đến và cho họ xem trò chơi đang trong quá trình phát triển. Bọn trẻ rất phấn khích và bạn nghe chúng nói về nó trong nhiều tuần sau đó."
					});
					n.adjustHype(15 + 25 * company.getRandom());
					company.activeNotifications.addRange(n.split());
					return;
				}
			}
		};

		GDT.addEvent(billyBrakeIn);
	};

	ExpPack.addEventMovieGame = function () {
		var eventId = "12111996-0001-0000-0100-DZJENGISKHAN";

		var movieGame = {
			id: eventId,
			isRandom: true,
			maxTriggers: 1,
			trigger: function (company) {
				return company.currentLevel == 3 && company.isGameProgressBetween(0.5, 0.9);
			},
			getNotification: function (company) {
				var game = company.currentGame;

				var msg = "Sếp, một đạo diễn phim đã tiếp cận chúng ta với lựa chọn làm một bộ phim từ {0}! Nếu chúng ta đồng ý với điều này, chúng ta sẽ nhận được rất nhiều sự chú ý có giá trị, nhưng nó sẽ không miễn phí".localize().format(game.title);

				return new Notification({
					sourceId: eventId,
					header: "Làm một bộ phim".localize(),
					text: msg,
					options: ["Ký hợp đồng", "Không làm phim"]
				});
			},
			complete: function (decision) {
				var company = GameManager.company;

				if (decision === 0) {
					var n = new Notification({
						header: "Sẽ có một bộ phim!".localize(),
						text: "Bộ phim nhận được phản hồi tuyệt vời - chúng ta thậm chí còn có thêm một số người hâm mộ!"
					});
					n.adjustHype(10 + 15 * company.getRandom());
					n.adjustFans(250);

					company.activeNotifications.addRange(n.split());
					return;
				}
				if (decision === 1) {
					var n = new Notification({
						header: "Không có phim".localize(),
						text: "Bạn từ chối lời đề nghị và mọi thứ vẫn diễn ra bình thường."
					});
					return;
				}
			}
		};

		GDT.addEvent(movieGame);
	};

	ExpPack.addEventFire = function () {
		var eventId = "12111996-0001-0000-0101-DZJENGISKHAN";

		var fire = {
			id: eventId,
			isRandom: true,
			maxTriggers: 1,
			trigger: function (company) {
				return company.currentLevel == 4 && company.isGameProgressBetween(0.5, 0.9);
			},
			getNotification: function (company) {
				var game = company.currentGame;

				var msg = "Ôi trời ơi! Hỏa hoạn đã xảy ra! Tất cả chúng ta cần phải rời đi! Ngay bây giờ!{n} .... Sau khi đám cháy đã được dập tắt, bạn nhìn vào bên trong - như dự kiến, có rất nhiều thiệt hại.".localize().format(game.title);

				return new Notification({
					sourceId: eventId,
					header: "Hỏa hoạn trong văn phòng!!".localize(),
					text: msg,
					options: ["Sửa chữa mọi thứ"]
				});
			},
			complete: function (decision) {
				var company = GameManager.company;

				if (decision === 0) {
					var n = new Notification({
						header: "Sửa chữa".localize(),
						text: "Bạn đã có thể cứu dự án hiện tại của mình nhưng việc sửa chữa rất tốn kém. Trò chơi này tốt hơn hết là nên đáng giá."
					});
					n.adjustCash(-15000, "Thiệt hại do hỏa hoạn");

					company.activeNotifications.addRange(n.split());
					return;
				}
			}
		};

		GDT.addEvent(fire);
	};

	ExpPack.addEventFirstMagazine = function () {
		var eventId = "12111996-0001-0000-0110-DZJENGISKHAN";

		var WelcomeToIndustry = {
			id: eventId,
			isRandom: false,
			date: '4/8/3',
			ignoreGameLengthModifier: false,
			getNotification: function (company) {
				var msg = "Tạp chí Gamer Pride muốn bạn cho một cuộc phỏng vấn như một phần của hoạt động 'Ngôi sao mới trong ngành công nghiệp game' của họ để quảng bá ngành công nghiệp game và các nhà phát triển game sắp ra mắt - đây là một phần lớn trong dự án của họ.\n\n Bạn muốn thảo luận về điều gì?".localize();
				return new Notification({
					sourceId: eventId,
					header: "Phỏng vấn tạp chí".localize(),
					text: msg,
					options: ["Không, cảm ơn.", "Ngành công nghiệp game hiện tại", "Ước mơ của tôi"]
				});
			},

			complete: function (decision) {

				var company = GameManager.company;

				if (decision === 0) {
					var n = new Notification({
						header: "Phỏng vấn tạp chí".localize(),
						text: "Bạn từ chối - Tạp chí Gamer Pride thất vọng nhưng không có điều gì tồi tệ xảy ra."
					});
					company.activeNotifications.addRange(n.split());
					return;
				}
				if (decision === 1) {
					var n = new Notification({
						header: "Phỏng vấn tạp chí".localize(),
						text: "Bạn nói với tạp chí rằng ngày nay ngành công nghiệp game tương đối nhỏ và là một cơ hội tuyệt vời cho những người như bạn để tìm vị trí của mình và phát triển.{n} Người phỏng vấn hỏi bạn dự đoán tương lai của ngành công nghiệp game sẽ như thế nào.\n\n Bạn trả lời rằng tiến bộ trong ngành công nghiệp điện tử sẽ có nghĩa là sẽ có nhiều nền tảng hơn, cũng như mang lại cơ hội tuyệt vời cho sự đổi mới trong ngành công nghiệp game."
					});
					n.adjustFans(200);
					company.notifications.push(n);

					var m = new Notification({
						header: "Tài trợ".localize(),
						text: "Một số công ty điện tử đánh giá cao việc bạn đề cập đến họ trong cuộc phỏng vấn gần đây của bạn. Một công ty có tên RBM đã liên hệ với bạn và tặng bạn một số tiền như một món quà cho dự án hiện tại của bạn. Họ hy vọng rằng sự hợp tác giữa họ và các nhà phát triển game sẽ thúc đẩy cả hai ngành công nghiệp."
					});
					if (company.isGameProgressBetween(0.2, 0.9)) {
						m.adjustCash(40000, "Tài trợ RBM");
						m.adjustHype(5 + 15 * company.getRandom());
						company.notifications.push(m);
					}
					return;
				}
				if (decision === 2) {
					var n = new Notification({
						header: "Phỏng vấn tạp chí".localize(),
						text: "Ước mơ của bạn là tìm ra một 'giải pháp vàng' sẽ đưa công ty của bạn và toàn bộ ngành công nghiệp game lên một tầm cao mới. \nBạn nói rằng bây giờ là thời điểm tuyệt vời để phát triển vì kinh doanh game tương đối mới. Bạn hy vọng rằng trong 4 hoặc 5 năm, công ty sẽ phát triển và bạn sẽ có thể làm việc trên các dự án tham vọng hơn.{n} Người phỏng vấn hỏi liệu bạn có thể dự đoán tương lai của ngành công nghiệp game không.\n\n Bạn trả lời rằng chỉ có Chúa mới biết tương lai có thể mang lại điều gì."
					});
					n.adjustFans(100);
					if (company.isGameProgressBetween(0.2, 0.9)) {
						n.adjustHype(5 + 15 * company.getRandom());
					}
					company.notifications.push(n);
					return;
				}
			}
		};

		GDT.addEvent(WelcomeToIndustry);
	};

	ExpPack.addEventSecMagazine = function () {
		var eventId = "12111996-0001-0000-0111-DZJENGISKHAN";

		var LateThoughts = {
			id: eventId,
			isRandom: false,
			maxTriggers: 1,
			trigger: function (company) {
				return company.fans >= 1500000;
			},
			getNotification: function (company) {
				var msg = "Tạp chí Gamer Pride đã liên hệ với bạn để phỏng vấn. Gần đây bạn đã đạt 1,5 triệu người hâm mộ và họ muốn biết bí quyết đằng sau thành công này.".localize();
				return new Notification({
					sourceId: eventId,
					header: "Phỏng vấn tạp chí".localize(),
					text: msg,
					options: ["Cung cấp những trò chơi tốt nhất", "Người hâm mộ", "Là 'chuyên nghiệp'"]
				});
			},
			complete: function (decision) {
				var company = GameManager.company;
				if (decision === 0) {
					var n = new Notification({
						header: "Phỏng vấn tạp chí".localize(),
						text: "Bạn nói rằng chỉ bằng cách cung cấp những trò chơi tốt nhất có thể, bạn mới có thể xây dựng một lượng người hâm mộ lớn như vậy. Theo thời gian, bạn đã học được rằng game thủ chỉ tìm kiếm những trò chơi tuyệt vời và bất kỳ nhà phát triển nào không thể cung cấp điều đó sẽ không có được lượng người hâm mộ họ cần và có thể phá sản."
					});
					n.adjustFans(5000);
					if (company.isGameProgressBetween(0.2, 0.9)) {
						n.adjustHype(20 + 40 * company.getRandom());
					}
					company.notifications.push(n);
					return;
				}
				if (decision === 1) {
					var n = new Notification({
						header: "Phỏng vấn tạp chí".localize(),
						text: "Theo ý kiến của bạn, dựa trên nhiều năm kinh nghiệm, công thức thành công của bạn là xây dựng mối quan hệ tốt giữa nhà phát triển và khách hàng. Game thủ cần thấy rằng đầu tư tiền vào sản phẩm của bạn là một ý tưởng tốt. \n Họ có thể thấy điều đó khi một công ty cung cấp giá trị tốt cho số tiền mà game thủ đã chi cho trò chơi.{n} Bạn nói rằng khách hàng cần được đối xử đúng cách. Ví dụ, họ không thể bị trừng phạt bằng DRM, vì điều đó không công bằng. \nNhững kẻ cướp biển không gặp vấn đề gì khi phá vỡ DRM, ngay cả ngày sau khi phát hành.\n Theo cách này, những kẻ cướp biển tận hưởng trò chơi như nó vốn có trong khi chỉ có những khách hàng trung thực phải đối mặt với những rắc rối của DRM.{n}Thay vì trừng phạt khách hàng, các công ty nên thưởng cho họ với nội dung bổ sung miễn phí, dịch vụ khách hàng tuyệt vời và v.v.\n Quan trọng nhất, hãy đối xử với game thủ như bạn muốn được đối xử: cuối cùng, tất cả chúng ta đều là game thủ!"
					});
					company.notifications.push(n);
					var m = new Notification({
						header: "Phỏng vấn tạp chí".localize(),
						text: "Lời nói của bạn đã làm ấm lòng mọi người. Email của công ty đã tràn ngập hàng tấn tin nhắn ủng hộ từ người hâm mộ của bạn! Đó không phải là một cảm giác tuyệt vời sao?"
					});
					m.adjustFans(20000);
					if (company.isGameProgressBetween(0.2, 0.9)) {
						m.adjustHype(50 + 60 * company.getRandom());
					}
					company.notifications.push(m);
					return;
				}
				if (decision === 2) {
					var n = new Notification({
						header: "Phỏng vấn tạp chí".localize(),
						text: "Bạn có thể nói gì? Bạn và công ty của bạn chỉ là những nhà phát triển chuyên nghiệp và game thủ yêu thích sự chuyên nghiệp!"
					});
					n.adjustFans(1000);
					if (company.isGameProgressBetween(0.2, 0.9)) {
						n.adjustHype(10 + 20 * company.getRandom());
					}
					company.notifications.push(n);

				}
			}
		};

		GDT.addEvent(LateThoughts);
	};
	/*  */

	/* Nghiên cứu */
	ExpPack.addResearch = function () {
		/* Mục đồ họa */
		GDT.addResearchItem(
			{
				id: "Realistic Particles",
				name: "Hạt thực tế".localize(),
				v: 6,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Graphic') > 7;
				},
				category: "Graphic",
				categoryDisplayName: "Graphic"
			});
		GDT.addResearchItem(
			{
				id: "Advanced Shaders",
				name: "Shader nâng cao".localize(),
				v: 6,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Graphic') > 5;
				},
				category: "Graphic",
				categoryDisplayName: "Graphic"
			});
		GDT.addResearchItem(
			{
				id: "Animated Textures",
				name: "Kết cấu động".localize(),
				v: 2,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Graphic') > 3;
				},
				category: "Graphic",
				categoryDisplayName: "Graphic"
			});
		GDT.addResearchItem(
			{
				id: "Basic Holograms",
				name: "Hình ảnh 3D cơ bản".localize(),
				v: 4,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Graphic') > 4;
				},
				category: "Graphic",
				categoryDisplayName: "Graphic"
			});
		GDT.addResearchItem(
			{
				id: "Advanced Holograms",
				name: "Hình ảnh 3D nâng cao".localize(),
				v: 8,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Graphic') > 6;
				},
				category: "Graphic",
				categoryDisplayName: "Graphic"
			});
		GDT.addResearchItem(
			{
				id: "Interactive Holograms",
				name: "Hình ảnh 3D tương tác".localize(),
				v: 10,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Graphic') > 8;
				},
				category: "Graphic",
				categoryDisplayName: "Graphic"
			});
		/*  */

		/* Mục âm thanh */
		GDT.addResearchItem(
			{
				id: "Realistic Sound",
				name: "Âm thanh thực tế".localize(),
				v: 6,
				canResearch: function () {
					return LevelCalculator.getMissionLevel('Sound') > 6;
				},
				category: "Sound",
				categoryDisplayName: "Sound"
			});
		GDT.addResearchItem(
			{
				id: "Copywritten Music",
				name: "Âm thanh có bản quyền".localize(),
				v: 8,
				canResearch: function () {
					return LevelCalculator.getMissionLevel('Sound') > 7;
				},
				category: "Sound",
				categoryDisplayName: "Sound"
			});
		/*  */

		/* Mục trí tuệ nhân tạo */
		GDT.addResearchItem(
			{
				id: "Superior AI",
				name: "Trí tuệ nhân tạo vượt trội".localize(),
				v: 8,
				canResearch: function () {
					return LevelCalculator.getMissionLevel('AI') > 7;
				},
				category: "AI",
				categoryDisplayName: "A.I."
			});
		GDT.addResearchItem(
			{
				id: "AI Difficulty",
				name: "Độ khó trí tuệ nhân tạo".localize(),
				v: 4,
				canResearch: function () {
					return LevelCalculator.getMissionLevel('AI') > 4;
				},
				category: "AI",
				categoryDisplayName: "A.I."
			});
		/*  */

		/* Lối chơi */
		GDT.addResearchItem(
			{
				id: "Cheat Codes",
				name: "Mã gian lận".localize(),
				v: 4,
				canResearch: function () {
					return LevelCalculator.getMissionLevel('Gameplay') > 3;
				},
				category: "Gameplay",
				categoryDisplayName: "Gameplay"
			});
		GDT.addResearchItem(
			{
				id: "Premium Content",
				name: "Nội dung cao cấp".localize(),
				v: 8,
				canResearch: function () {
					return LevelCalculator.getMissionLevel('Gameplay') > 6;
				},
				category: "Gameplay",
				categoryDisplayName: "Gameplay"
			});
		/*  */

		/* Mục động cơ */
		GDT.addResearchItem(
			{
				id: "Quick Saving",
				name: "Lưu nhanh".localize(),
				v: 2,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Engine') > 3;
				},
				category: "Engine",
				categoryDisplayName: "Engine".localize()
			});
		GDT.addResearchItem(
			{
				id: "Seasons",
				name: "Mùa".localize(),
				v: 6,
				canResearch: function (e) {
					return LevelCalculator.getMissionLevel('Engine') > 6;
				},
				category: "Engine",
				categoryDisplayName: "Engine"
			});
		/*  */

		/* Cốt truyện/Nhiệm vụ */
		GDT.addResearchItem(
			{
				id: "Collectables",
				name: "Vật phẩm sưu tầm".localize(),
				v: 2,
				canResearch: function () {
					return LevelCalculator.getMissionLevel('Story/Quests') > 2;
				},
				category: "Story/Quests",
				categoryDisplayName: "Story/Quests"
			});
		GDT.addResearchItem(
			{
				id: "Simple quests",
				name: "Nhiệm vụ đơn giản".localize(),
				v: 2,
				canResearch: function () {
					return LevelCalculator.getMissionLevel('Story/Quests') > 3;
				},
				category: "Story/Quests",
				categoryDisplayName: "Story/Quests"
			});
		GDT.addResearchItem(
			{
				id: "Advanced quests",
				name: "Nhiệm vụ nâng cao".localize(),
				v: 6,
				canResearch: function () {
					return LevelCalculator.getMissionLevel('Story/Quests') > 6;
				},
				category: "Story/Quests",
				categoryDisplayName: "Story/Quests"
			});
		/*  */

		/* Mục hội thoại */
		GDT.addResearchItem(
			{
				id: "Language Settings",
				name: "Cài đặt ngôn ngữ".localize(),
				v: 4,
				canResearch: function () {
					return LevelCalculator.getMissionLevel('Dialogs') > 4;
				},
				category: "Dialogs",
				categoryDisplayName: "Dialogues"
			});
		/*  */

		/* Mục thiết kế thế giới */
		GDT.addResearchItem(
			{
				id: "Realistic Water",
				name: "Nước thực tế".localize(),
				v: 4,
				canResearch: function () {
					return LevelCalculator.getMissionLevel('World Design') > 3;
				},
				category: "World Design",
				categoryDisplayName: "World Design"
			});
		GDT.addResearchItem(
			{
				id: "Realistic Plant Life",
				name: "Thực vật thực tế".localize(),
				v: 6,
				canResearch: function () {
					return LevelCalculator.getMissionLevel('World Design') > 6;
				},
				category: "World Design",
				categoryDisplayName: "World Design"
			});
		/*  */

		/* Mục thiết kế cấp độ */
		GDT.addResearchItem(
			{
				id: "Bosses",
				name: "Trùm cuối".localize(),
				v: 2,
				canResearch: function () {
					return LevelCalculator.getMissionLevel('Level Design') > 2;
				},
				category: "Level Design",
				categoryDisplayName: "Level Design"
			});
		GDT.addResearchItem(
			{
				id: "Swift Loading",
				name: "Tải nhanh".localize(),
				v: 4,
				canResearch: function () {
					return LevelCalculator.getMissionLevel('Level Design') > 5;
				},
				category: "Level Design",
				categoryDisplayName: "Level Design"
			});
		/*  */
	};
	/*  */

	/* Giá tùy chỉnh cho trò chơi */
	ExpPack.addCustomPrice = function () {
		var company = GameManager.company;
		var gamePrice;
		var newPrice;
		var dataStore = GDT.getDataStore("ExpPackMod");

		UI.selectPriceClick = function (a) {
			Sound.click();
			switch (a.id) {
				case "applyPrice":
					applyPrice();
					break;
				default:
					return;
			}
		};

		var div = $("body");
		div.append('<div id="PriceContainer" class="windowBorder tallWindow" style="overflow:auto;display:none;"> <div id="priceSelector" class="windowTitle smallerWindowTitle">Giá tùy chỉnh</div>');
		div = $("#PriceContainer");

		div.append('<div id="exppack_price" style="text-align:center;margin-left:50px;width: 450px"></div>');
		div.append('<div id="exppack_current_price" style="text-align:center;margin-left:50px;width: 450px"></div>');
		div.append('<div id="exppack_select_price" style="text-align:center;margin-left:50px;width: 450px"></div>');
		div.append('<div class="priceSlider"></div>');
		div.append('<div id="applyPrice" class="selectorButton whiteButton" onclick="UI.selectPriceClick(this)" style="margin-left:50px;width: 450px">Đặt giá</div>');

		function applyPrice() {
			if (GameManager.company.isCurrentlyDevelopingGame()) {
				game = GameManager.company.currentGame;

				if (game.gameSize === "medium") {
					Sales.mediumUnitPrice = newPrice;
				}
				else if (game.gameSize === "large") {
					Sales.largeUnitPrice = newPrice;
				}
				else if (game.gameSize === "aaa") {
					Sales.aaaUnitPrice = newPrice;
				}
				else {
					Sales.smallUnitPrice = newPrice;
				}

				gamePrice = newPrice;
				div.find("#exppack_current_price").html("Giá hiện tại: " + gamePrice);
			}
			dataStore.data.gamePrice = gamePrice;
		};

		function setPrice(e) {
			if (GameManager.company.isCurrentlyDevelopingGame()) {
				var game = GameManager.company.currentGame;
				newPrice = e;

				var div = $("#PriceContainer");

				if (newPrice == 7 && game.gameSize === "small")
					div.find("#exppack_price").html(newPrice + " Cr. (Mặc định)");
				else if (newPrice == 11 && game.gameSize === "medium")
					div.find("#exppack_price").html(newPrice + " Cr. (Mặc định)");
				else if (newPrice == 14 && game.gameSize === "large")
					div.find("#exppack_price").html(newPrice + " Cr. (Mặc định)");
				else if (newPrice == 18 && game.gameSize === "aaa")
					div.find("#exppack_price").html(newPrice + " Cr. (Mặc định)");
				else
					div.find("#exppack_price").html(newPrice + " Cr.");
			}
		};

		/* Thuật toán tính doanh số */
		var salesCalculated = function (company, game) {
			var price = dataStore.data.gamePrice;
			var currentGame = company.game;
			if (price < 1) {
				if (currentGame.gameSize == "small")
					price = Sales.smallUnitPrice;
				else if (currentGame.gameSize == "medium")
					price = Sales.mediumUnitPrice;
				else if (currentGame.gameSize == "large")
					price = Sales.largeUnitPrice;
				else if (currentGame.gameSize == "aaa")
					price = Sales.aaaUnitPrice;
			}
			var priceRatio = function (price, game) {
				var a;
				if (game.gameSize === "small")
					a = 2 - (price / 10);
				else if (game.gameSize === "medium")
					a = 2 - (price / 20);
				else if (game.gameSize === "large")
					a = 2 - (price / 40);
				else if (game.gameSize === "aaa")
					a = 2 - (price / 60);
				return a;
			};
			var score = game.score.clamp(1, 10);
			var scoreRatio = function (score) {
				var b;

				if (score >= 9)
					b = 1.3;
				else if (score >= 7)
					b = 1.1;
				else if (score >= 5)
					b = 0.8;
				else if (score >= 3)
					b = 0.5;
				else
					b = 0.1;

				return b;
			};
			game.totalSalesCash *= 1 * priceRatio(price, game) * scoreRatio(score);
		};
		GDT.fire(GDT.eventKeys.gameplay.salesCalculated, salesCalculated);
		/*  */

		var original_showContextMenu = UI._showContextMenu;
		var new_showContextMenu = function (b, c, d, h) {
			GameManager.company.isCurrentlyDevelopingGame() && c.push({
				label: "Giá trò chơi...",
				action: function () {
					Sound.click();
					GameManager.resume(true);

					var div = $("#PriceContainer");

					div.scrollTop();

					div.gdDialog({
						popout: !0,
						close: !0
					});
				}
			});

			var game = GameManager.company.currentGame;
			var max_price;

			if (GameManager.company.isCurrentlyDevelopingGame() && game.gameSize === "medium") {
				max_price = 20;
				gamePrice = Sales.mediumUnitPrice;
			}
			else if (GameManager.company.isCurrentlyDevelopingGame() && game.gameSize === "large") {
				max_price = 40;
				gamePrice = Sales.largeUnitPrice;
			}
			else if (GameManager.company.isCurrentlyDevelopingGame() && game.gameSize === "aaa") {
				max_price = 60;
				gamePrice = Sales.aaaUnitPrice;
			}
			else if (GameManager.company.isCurrentlyDevelopingGame()) {
				max_price = 10;
				gamePrice = Sales.smallUnitPrice;
			}

			div.find(".priceSlider").slider({
				min: 1,
				max: max_price,
				range: "min",
				value: Math.floor(gamePrice),
				animate: !1,
				slide: function (a, b) {
					var c = b.value;
					setPrice(c);
				}
			});
			setPrice(gamePrice);

			original_showContextMenu(b, c, d, h);
		};
		UI._showContextMenu = new_showContextMenu;
	};
	/*  */

	/* Black Bull */
	ExpPack.addBlackBull = function () {
		var menuItems = [];
		var div = $("body");
		div = $("#BlackBull");

		var original_PopupMenu = UI._showContextMenu;
		var new_initPopupMenu = function (type, menuItems, x, y) {
			var company = GameManager.company;
			var targetChar = company.currentLevel > 1 ? UI.getCharUnderCursor() : company.staff[0];

			if (targetChar) {
				if (targetChar.state != CharacterState.Researching &&
					(targetChar.state != CharacterState.Training && targetChar.state != CharacterState.Vacation)) {
					if (company.currentLevel > 1 && targetChar.flags.needsVacation) {
						menuItems.push({
							label: "Mua Black Bull".localize("menu item"),
							action: function () {
								Sound.click();
								GameManager.resume(true);
								var div = $("#BlackBull");
								company.adjustCash(-500, "Black Bull");

								targetChar.relaxDelta = 0;
								var vacationInterval;
								var canRecharge;
								var timeLastUsed = GameManager.gameTime * GameManager.SECONDS_PER_WEEK * 1E3;
								if (timeLastUsed < timeLastUsed + 8)
									vacationInterval = 2;
								if (timeLastUsed >= timeLastUsed + 8)
									vacationInterval = 4;
								targetChar.flags.nextVacation = GameManager.gameTime + vacationInterval * GameManager.SECONDS_PER_WEEK * 1E3;
								targetChar.flags.relaxGained = 0;
								targetChar.flags.needsVacation = false;
								canRecharge = true;

							}
						});
					}
				}
			}
			original_PopupMenu(type, menuItems, x, y);
		};

		UI._showContextMenu = new_initPopupMenu;
	};
	/*  */


	/*
	 * Custom Price Bug Fix ~Everard
	 */
	ExpPack.checkCustomPrice = function () {
		GDT.off(GDT.eventKeys.gameplay.beforeReleaseGame, ExpPack.checkCustomPrice);
		if (GDT.getDataStore("ExpPackMod").data.gamePrice >= 1) {
			return;
		} else {
			GDT.getDataStore("ExpPackMod").data.gamePrice = 7;
		}
	}; GDT.on(GDT.eventKeys.gameplay.beforeReleaseGame, ExpPack.checkCustomPrice);


})();
