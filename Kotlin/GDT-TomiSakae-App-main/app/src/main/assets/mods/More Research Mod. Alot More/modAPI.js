var modAPI_GreenheartGames = {};
(function () {
	modAPI_GreenheartGames.path = './mods/More Research Mod. Alot More';
	//this is the default modding API module that is loaded as the first mod and provides convenience methods for other mods.
	//generally methods are added to the global object GDT.
	var ready = function () {


		// Engine //


		GDT.addResearchItem(
			{
				id: "turnbased",
				name: "Chiến Đấu Theo Lượt".localize(),
				v: 4,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Engine') > 3
				},
				category: "Engine",
				categoryDisplayName: "Engine".localize()
			});

		GDT.addResearchItem(
			{
				id: "adjustablefov",
				name: "Điều Chỉnh Góc Nhìn".localize(),
				v: 4,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Engine') > 3
				},
				category: "Engine",
				categoryDisplayName: "Engine".localize()
			});

		GDT.addResearchItem(
			{
				id: "pause-menu",
				name: "Menu Tạm Dừng".localize(),
				v: 2,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Engine') > 1
				},
				category: "Engine",
				categoryDisplayName: "Engine".localize()
			});

		GDT.addResearchItem(
			{
				id: "split-screen",
				name: "Hỗ Trợ Màn Hình Chia Đôi".localize(),
				v: 4,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Engine') > 2
				},
				category: "Engine",
				categoryDisplayName: "Engine".localize()
			});

		GDT.addResearchItem(
			{
				id: "class-menu",
				name: "Lựa Chọn Lớp Nhân Vật".localize(),
				v: 4,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Engine') > 3
				},
				category: "Engine",
				categoryDisplayName: "Engine".localize()
			});

		GDT.addResearchItem(
			{
				id: "race-menu",
				name: "Lựa Chọn Chủng Tộc".localize(),
				v: 4,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Engine') > 3
				},
				category: "Engine",
				categoryDisplayName: "Engine".localize()
			});

		GDT.addResearchItem(
			{
				id: "custom-input",
				name: "Tùy Chỉnh Đầu Vào".localize(),
				v: 6,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Engine') > 4
				},
				category: "Engine",
				categoryDisplayName: "Engine".localize()
			});

		GDT.addResearchItem(
			{
				id: "basic-ragdoll",
				name: "Ragdoll Cơ Bản".localize(),
				v: 4,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Engine') > 3
				},
				category: "Engine",
				categoryDisplayName: "Engine".localize()
			});

		GDT.addResearchItem(
			{
				id: "advanced-ragdoll",
				name: "Ragdoll Nâng Cao".localize(),
				v: 6,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Engine') > 4
				},
				category: "Engine",
				categoryDisplayName: "Engine".localize()
			});

		GDT.addResearchItem(
			{
				id: "co-op",
				name: "Chơi Hợp Tác".localize(),
				v: 2,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Engine') > 3
				},
				category: "Engine",
				categoryDisplayName: "Engine".localize()
			});

		GDT.addResearchItem(
			{
				id: "advanced-save",
				name: "Lưu Tự Động".localize(),
				v: 2,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Engine') > 2
				},
				category: "Engine",
				categoryDisplayName: "Engine".localize()
			});

		GDT.addResearchItem(
			{
				id: "occlusion-culling",
				name: "Occlusion Culling".localize(),
				v: 8,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Engine') > 4
				},
				category: "Engine",
				categoryDisplayName: "Engine".localize()
			});

		GDT.addResearchItem(
			{
				id: "baked-lighting",
				name: "Ánh Sáng Nướng Sẵn".localize(),
				v: 6,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Engine') > 5
				},
				category: "Engine",
				categoryDisplayName: "Engine".localize()
			});

		GDT.addResearchItem(
			{
				id: "skybox",
				name: "Hộp Bầu Trời".localize(),
				v: 1,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Engine') > 2
				},
				category: "Engine",
				categoryDisplayName: "Engine".localize()
			});

		GDT.addResearchItem(
			{
				id: "pp",
				name: "Xử Lý Hậu Kỳ".localize(),
				v: 6,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Engine') > 4
				},
				category: "Engine",
				categoryDisplayName: "Engine".localize()
			});

		GDT.addResearchItem(
			{
				id: "ps",
				name: "Hệ Thống Hạt".localize(),
				v: 4,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Engine') > 2
				},
				category: "Engine",
				categoryDisplayName: "Engine".localize()
			});

		GDT.addResearchItem(
			{
				id: "lens-flare",
				name: "Hiệu Ứng Ánh Sáng Ống Kính".localize(),
				v: 2,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Engine') > 3
				},
				category: "Engine",
				categoryDisplayName: "Engine".localize()
			});

		GDT.addResearchItem(
			{
				id: "pbr-shader",
				name: "Shader PBR".localize(),
				v: 10,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Engine') > 5
				},
				category: "Engine",
				categoryDisplayName: "Engine".localize()
			});

		GDT.addResearchItem(
			{
				id: "console-rsh",
				name: "Bảng Điều Khiển".localize(),
				v: 1,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Engine') > 1
				},
				category: "Engine",
				categoryDisplayName: "Engine".localize()
			});

		GDT.addResearchItem(
			{
				id: "lod-group",
				name: "Nhóm LOD".localize(),
				v: 8,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Engine') > 5
				},
				category: "Engine",
				categoryDisplayName: "Engine".localize()
			});

		GDT.addResearchItem(
			{
				id: "cloth-physic",
				name: "Vật Lý Vải".localize(),
				v: 8,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Engine') > 6
				},
				category: "Engine",
				categoryDisplayName: "Engine".localize()
			});

		GDT.addResearchItem(
			{
				id: "basic-baked-RayTracing",
				name: "Ray Tracing Nướng Sẵn Cơ Bản".localize(),
				v: 4,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Engine') > 3
				},
				category: "Engine",
				categoryDisplayName: "Engine".localize()
			});

		GDT.addResearchItem(
			{
				id: "advanced-baked-raytracking",
				name: "Ray Tracing Nướng Sẵn Nâng Cao".localize(),
				v: 8,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Engine') > 6
				},
				category: "Engine",
				categoryDisplayName: "Engine".localize()
			});

		GDT.addResearchItem(
			{
				id: "realtime-raytracking",
				name: "Ray Tracing Thời Gian Thực".localize(),
				v: 12,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Engine') > 8
				},
				category: "Engine",
				categoryDisplayName: "Engine".localize()
			});

		GDT.addResearchItem(
			{
				id: "ambient-occlusion",
				name: "Che Khuất Môi Trường".localize(),
				v: 8,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Engine') > 8
				},
				category: "Engine",
				categoryDisplayName: "Engine".localize()
			});

		GDT.addResearchItem(
			{
				id: "8bit-support",
				name: "Hỗ Trợ 8bit".localize(),
				v: 1,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Engine') > 0
				},
				category: "Engine",
				categoryDisplayName: "Engine".localize()
			});

		GDT.addResearchItem(
			{
				id: "16bit-support",
				name: "Hỗ Trợ 16bit".localize(),
				v: 2,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Engine') > 1
				},
				category: "Engine",
				categoryDisplayName: "Engine".localize()
			});

		GDT.addResearchItem(
			{
				id: "32bit-support",
				name: "Hỗ Trợ 32bit".localize(),
				v: 4,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Engine') > 3
				},
				category: "Engine",
				categoryDisplayName: "Engine".localize()
			});

		GDT.addResearchItem(
			{
				id: "64bit-support",
				name: "Hỗ Trợ 64bit".localize(),
				v: 6,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Engine') > 4
				},
				category: "Engine",
				categoryDisplayName: "Engine".localize()
			});

		GDT.addResearchItem(
			{
				id: "720p-res",
				name: "Độ Phân Giải 720p".localize(),
				v: 4,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Engine') > 4
				},
				category: "Engine",
				categoryDisplayName: "Engine".localize()
			});

		GDT.addResearchItem(
			{
				id: "1080p-res",
				name: "Độ Phân Giải 1080p".localize(),
				v: 6,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Engine') > 5
				},
				category: "Engine",
				categoryDisplayName: "Engine".localize()
			});

		GDT.addResearchItem(
			{
				id: "2K-res",
				name: "Độ Phân Giải 2K".localize(),
				v: 8,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Engine') > 5
				},
				category: "Engine",
				categoryDisplayName: "Engine".localize()
			});

		GDT.addResearchItem(
			{
				id: "4K-res",
				name: "Độ Phân Giải 4K".localize(),
				v: 10,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Engine') > 7
				},
				category: "Engine",
				categoryDisplayName: "Engine".localize()
			});


		// Gameplay //

		GDT.addResearchItem(
			{
				id: "inventory-gam",
				name: "Hệ Thống Túi Đồ".localize(),
				v: 4,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Gameplay') > 2
				},
				category: "Gameplay",
				categoryDisplayName: "Gameplay".localize()
			});

		GDT.addResearchItem(
			{
				id: "competence-gam",
				name: "Cây Kỹ Năng".localize(),
				v: 6,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Gameplay') > 4
				},
				category: "Gameplay",
				categoryDisplayName: "Gameplay".localize()
			});

		GDT.addResearchItem(
			{
				id: "dodge-gam",
				name: "Cơ Chế Né Tránh".localize(),
				v: 2,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Gameplay') > 2
				},
				category: "Gameplay",
				categoryDisplayName: "Gameplay".localize()
			});

		GDT.addResearchItem(
			{
				id: "waves-gam",
				name: "Cơ Chế Theo Đợt".localize(),
				v: 4,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Gameplay') > 3
				},
				category: "Gameplay",
				categoryDisplayName: "Gameplay".localize()
			});

		GDT.addResearchItem(
			{
				id: "army-gam",
				name: "Quản Lý Quân Đội".localize(),
				v: 6,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Gameplay') > 4
				},
				category: "Gameplay",
				categoryDisplayName: "Gameplay".localize()
			});

		GDT.addResearchItem(
			{
				id: "city-gam",
				name: "Quản Lý Thành Phố".localize(),
				v: 6,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Gameplay') > 4
				},
				category: "Gameplay",
				categoryDisplayName: "Gameplay".localize()
			});

		GDT.addResearchItem(
			{
				id: "block-gam",
				name: "Cơ Chế Chặn Đòn".localize(),
				v: 2,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Gameplay') > 3
				},
				category: "Gameplay",
				categoryDisplayName: "Gameplay".localize()
			});

		GDT.addResearchItem(
			{
				id: "tutorial-gam",
				name: "Hướng Dẫn Tương Tác".localize(),
				v: 6,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Gameplay') > 4
				},
				category: "Gameplay",
				categoryDisplayName: "Gameplay".localize()
			});



		// Story/Quest //



		// Dialogs //

		GDT.addResearchItem(
			{
				id: "roleplay-dia",
				name: "Đối Thoại Nhập Vai".localize(),
				v: 6,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Dialogs') > 3
				},
				category: "Dialogs",
				categoryDisplayName: "Dialogs".localize()
			});


		GDT.addResearchItem(
			{
				id: "personality-dia",
				name: "Đối Thoại Tính Cách".localize(),
				v: 4,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Dialogs') > 2
				},
				category: "Dialogs",
				categoryDisplayName: "Dialogs".localize()
			});

		GDT.addResearchItem(
			{
				id: "funny-dia",
				name: "Đối Thoại Hài Hước".localize(),
				v: 6,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Dialogs') > 3
				},
				category: "Dialogs",
				categoryDisplayName: "Dialogs".localize()
			});

		// Level Design //



		// AI //

		GDT.addResearchItem(
			{
				id: "basic-pathfinding",
				name: "Tìm Đường Cơ Bản".localize(),
				v: 4,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('AI') > 2
				},
				category: "AI",
				categoryDisplayName: "AI".localize()
			});

		GDT.addResearchItem(
			{
				id: "advanced-pathfinding",
				name: "Tìm Đường Nâng Cao".localize(),
				v: 8,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('AI') > 5
				},
				category: "AI",
				categoryDisplayName: "AI".localize()
			});

		GDT.addResearchItem(
			{
				id: "ai-boss",
				name: "AI Trùm Cuối".localize(),
				v: 4,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('AI') > 3
				},
				category: "AI",
				categoryDisplayName: "AI".localize()
			});

		GDT.addResearchItem(
			{
				id: "ai-learning",
				name: "AI Học Mềm".localize(),
				v: 6,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('AI') > 4
				},
				category: "AI",
				categoryDisplayName: "AI".localize()
			});

		GDT.addResearchItem(
			{
				id: "ai-mass",
				name: "AI Điều Khiển Đám Đông".localize(),
				v: 8,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('AI') > 5
				},
				category: "AI",
				categoryDisplayName: "AI".localize()
			});

		GDT.addResearchItem(
			{
				id: "ai-coop",
				name: "AI Hợp Tác".localize(),
				v: 4,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('AI') > 2
				},
				category: "AI",
				categoryDisplayName: "AI".localize()
			});


		// World Design //

		GDT.addResearchItem(
			{
				id: "destructible-world",
				name: "Thế Giới Có Thể Phá Hủy".localize(),
				v: 6,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('World Design') > 4
				},
				category: "World Design",
				categoryDisplayName: "World Design".localize()
			});

		GDT.addResearchItem(
			{
				id: "collectable-objects",
				name: "Vật Phẩm Thu Thập".localize(),
				v: 4,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('World Design') > 2
				},
				category: "World Design",
				categoryDisplayName: "World Design".localize()
			});

		GDT.addResearchItem(
			{
				id: "lifeful-world",
				name: "Thế Giới Sống Động".localize(),
				v: 6,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('World Design') > 5
				},
				category: "World Design",
				categoryDisplayName: "World Design".localize()
			});

		GDT.addResearchItem(
			{
				id: "multiple-world",
				name: "Đa Thế Giới".localize(),
				v: 8,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('World Design') > 6
				},
				category: "World Design",
				categoryDisplayName: "World Design".localize()
			});

		GDT.addResearchItem(
			{
				id: "procedural-world",
				name: "Thế Giới Sinh Tự Động".localize(),
				v: 12,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('World Design') > 8
				},
				category: "World Design",
				categoryDisplayName: "World Design".localize()
			});

		// Graphics //



		// Sound //

		GDT.addResearchItem(
			{
				id: "sound-eff",
				name: "Hiệu Ứng Âm Thanh".localize(),
				v: 4,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Sound') > 4
				},
				category: "Sound",
				categoryDisplayName: "Sound".localize()
			});

		GDT.addResearchItem(
			{
				id: "sound-mix",
				name: "Trộn Âm Thanh".localize(),
				v: 1,
				canResearch: function (company) {
					return LevelCalculator.getMissionLevel('Sound') > 0
				},
				category: "Sound",
				categoryDisplayName: "Sound".localize()
			});


		// R&D //




	};

	var error = function () {
	};

	GDT.loadJs([modAPI_GreenheartGames.path + '/helpers/checks.js',
	modAPI_GreenheartGames.path + '/api/persistence.js',
	modAPI_GreenheartGames.path + '/api/events.js',
	modAPI_GreenheartGames.path + '/api/platforms.js',
	modAPI_GreenheartGames.path + '/api/topics.js',
	modAPI_GreenheartGames.path + '/api/research.js',

	], ready, error);
})();