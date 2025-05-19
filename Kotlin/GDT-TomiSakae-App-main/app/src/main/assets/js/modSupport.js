// modSupport.js

var ModSupport = {};

ModSupport.availableMods = [];
ModSupport.currentMods = []; // Sẽ chứa ID của các mod được kích hoạt

// Hàm khởi tạo DataStore cho mod nếu chưa có
ModSupport.initModStore = function () {
	// Chỉ lưu trạng thái của CheatMod
	if (!window.localStorage.getItem('enabledCheatMod')) {
		window.localStorage.setItem('enabledCheatMod', 'false');
	}

	// Lấy danh sách tất cả mod ngoại trừ CheatMod
	var allModsExceptCheat = ModSupport.availableMods
		.filter(function (mod) {
			return mod.id !== "CheatMod-kristof1104";
		})
		.map(function (mod) {
			return mod.id;
		});

	// Kiểm tra xem CheatMod có được bật không
	var isCheatModEnabled = window.localStorage.getItem('enabledCheatMod') === 'true';

	// Nếu CheatMod được bật, thêm vào danh sách
	if (isCheatModEnabled) {
		var cheatMod = ModSupport.availableMods.find(function (mod) {
			return mod.id === "CheatMod-kristof1104";
		});

		if (cheatMod) {
			allModsExceptCheat.push("CheatMod-kristof1104");
		}
	}

	return allModsExceptCheat;
};

// Hàm lưu trạng thái của CheatMod vào localStorage
ModSupport.saveCheatModState = function (isEnabled) {
	window.localStorage.setItem('enabledCheatMod', isEnabled.toString());
};

// Cập nhật danh sách mod hiện tại
ModSupport.updateCurrentMods = function () {
	// Tất cả mod ngoại trừ CheatMod luôn được bật
	var enabledMods = ModSupport.availableMods
		.filter(function (mod) {
			return mod.id !== "CheatMod-kristof1104";
		})
		.map(function (mod) {
			return mod.id;
		});

	// Kiểm tra xem CheatMod có được bật không
	var isCheatModEnabled = window.localStorage.getItem('enabledCheatMod') === 'true';

	// Nếu CheatMod được bật, thêm vào danh sách
	if (isCheatModEnabled) {
		var cheatMod = ModSupport.availableMods.find(function (mod) {
			return mod.id === "CheatMod-kristof1104";
		});

		if (cheatMod) {
			enabledMods.push("CheatMod-kristof1104");
		}
	}

	ModSupport.currentMods = enabledMods;
	return enabledMods;
};

ModSupport.loadMods = function () {
	// Lấy danh sách mod được kích hoạt
	var enabledMods = ModSupport.initModStore();
	ModSupport.currentMods = enabledMods;

	// Tất cả mod ngoại trừ CheatMod sẽ luôn được đánh dấu là active
	ModSupport.availableMods.forEach(function (mod) {
		if (mod.id !== "CheatMod-kristof1104") {
			mod.active = true;
		} else {
			mod.active = enabledMods.includes(mod.id);
		}
	});

	// Chỉ tải những mod đã được kích hoạt
	var modsToLoad = ModSupport.availableMods.filter(function (mod) {
		return enabledMods.includes(mod.id);
	}).map(function (mod) {
		return mod.id;
	});

	var i = 0;
	GDT.off(GDT.eventKeys.mod.loaded); // Xóa listener cũ nếu có
	GDT.off(GDT.eventKeys.mod.loadError); // Xóa listener cũ nếu có

	GDT.on(GDT.eventKeys.mod.loaded, function (e) {
		ModSupport.loadMod(modsToLoad, ++i);
	});
	GDT.on(GDT.eventKeys.mod.loadError, function (e) {
		console.error("Lỗi khi tải mod:", e);
		ModSupport.loadMod(modsToLoad, ++i); // Vẫn cố gắng tải mod tiếp theo
	});

	if (modsToLoad.length > 0) {
		ModSupport.loadMod(modsToLoad, i);
	} else {
		// Không có mod nào được kích hoạt
		console.log("Không có mod nào được kích hoạt.");
		GDT.fire({}, GDT.eventKeys.mod.allLoaded);
	}
};

ModSupport.loadMod = function (modsToLoadIDs, i) {
	try {
		if (modsToLoadIDs.length > i) {
			var modId = modsToLoadIDs[i];
			var mod = ModSupport.availableMods.find(function (f) {
				return f.id == modId;
			});

			if (!mod) {
				console.error("Không tìm thấy thông tin mod cho ID: " + modId);
				ModSupport.loadMod(modsToLoadIDs, ++i); // Bỏ qua và tải mod tiếp theo
				return;
			}

			// Đường dẫn tới file main của mod sẽ là mod.folder + '/' + mod.main
			var scriptPath = mod.folder + '/' + mod.main;
			// Loại bỏ dấu ./ nếu có để đường dẫn tương đối chính xác từ thư mục gốc của index.html
			if (scriptPath.startsWith('./')) {
				scriptPath = scriptPath.substring(2);
			}

			console.log("Đang tải mod: " + mod.name + " từ " + scriptPath);
			GDT.loadJs([scriptPath], function (util) {
				// Mod đã tải thành công
				return;
			}, function (util) {
				var text = 'Không thể tải mod';
				Logger.LogModError(text, util, text + ": " + mod.name);
			});
		} else {
			// Tất cả các mod đã được xử lý (tải hoặc lỗi)
			console.log("Đã tải xong tất cả các mod.");
			GDT.fire({}, GDT.eventKeys.mod.allLoaded);
		}
	} catch (e) {
		Logger.LogModError('Lỗi nghiêm trọng khi tải mod: {0}.'.format(modsToLoadIDs[i]), e, "Lỗi nghiêm trọng khi tải mod: {0}.".format(modsToLoadIDs[i]));
		ModSupport.loadMod(modsToLoadIDs, ++i); // Cố gắng tải mod tiếp theo dù có lỗi
	}
};

// Đơn giản hóa, bỏ qua sắp xếp phức tạp dựa trên dependencies
ModSupport.sortMods = function () {
	// Đơn giản hóa, không cần sắp xếp phức tạp dựa trên dependencies
	ModSupport.availableMods.forEach(function (mod) {
		if (mod.id !== "CheatMod-kristof1104") {
			mod.active = true;
		} else {
			mod.active = window.localStorage.getItem('enabledCheatMod') === 'true';
		}
		mod.unresolvedDependency = false; // Không quan tâm đến ràng buộc
	});
};

// Chỉ cho phép vô hiệu hóa CheatMod
ModSupport.disableMod = function (mod) {
	if (!mod) return false;

	// Nếu không phải CheatMod, không cho phép vô hiệu hóa
	if (mod.id !== "CheatMod-kristof1104") {
		console.log("Chỉ có thể vô hiệu hóa CheatMod!");
		return false;
	}

	// Vô hiệu hóa CheatMod
	mod.active = false;
	ModSupport.saveCheatModState(false);
	ModSupport.updateCurrentMods();

	// Cập nhật số lượng mod trong UI nếu cần
	if (typeof UI !== 'undefined' && UI.populateModsPanel) {
		var totalMods = ModSupport.availableMods.length;
		var activeMods = ModSupport.availableMods.filter(function (mod) { return mod.active; }).length;
		var inactiveMods = totalMods - activeMods;

		$("#modsTotalCount").text(totalMods);
		$("#modsActiveCount").text(activeMods);
		$("#modsInactiveCount").text(inactiveMods);
	}

	return true;
};

// Chỉ cho phép kích hoạt CheatMod
ModSupport.enableMod = function (mod) {
	if (!mod) return false;

	// Nếu không phải CheatMod, không cần kích hoạt (vì đã luôn được kích hoạt)
	if (mod.id !== "CheatMod-kristof1104") {
		console.log("Không cần kích hoạt " + mod.name + ", nó luôn được bật!");
		return false;
	}

	// Kích hoạt CheatMod
	mod.active = true;
	ModSupport.saveCheatModState(true);
	ModSupport.updateCurrentMods();

	// Cập nhật số lượng mod trong UI nếu cần
	if (typeof UI !== 'undefined' && UI.populateModsPanel) {
		var totalMods = ModSupport.availableMods.length;
		var activeMods = ModSupport.availableMods.filter(function (mod) { return mod.active; }).length;
		var inactiveMods = totalMods - activeMods;

		$("#modsTotalCount").text(totalMods);
		$("#modsActiveCount").text(activeMods);
		$("#modsInactiveCount").text(inactiveMods);
	}

	return true;
};

ModSupport.checkAdditionalMods = function (companyMods, activeMods) {
	var additionalMods = [];

	if (!activeMods || activeMods.length === 0) return additionalMods;
	if (activeMods.length === 1 && activeMods[0] === "gdt-modAPI") return additionalMods;

	var companyModIds = companyMods.map(function (mod) { return mod.id; });

	additionalMods = activeMods.filter(function (modId) {
		return !companyModIds.includes(modId) && modId !== "gdt-modAPI";
	}).map(function (modId) {
		return ModSupport.availableMods.find(function (mod) { return mod.id === modId; });
	}).filter(function (mod) { return mod !== undefined; });

	return additionalMods;
};

ModSupport.init = function (callback) {
	// Đọc manifest
	if (typeof GDT_MOD_MANIFEST !== 'undefined') {
		ModSupport.availableMods = GDT_MOD_MANIFEST.map(function (modData) {
			// Xử lý đường dẫn hình ảnh đúng cách
			var imagePath = modData.image;
			if (imagePath && !imagePath.startsWith('http')) {
				// Nếu đường dẫn hình ảnh không phải URL tuyệt đối và không bắt đầu với folder của mod
				if (!imagePath.startsWith(modData.folder)) {
					// Ghép đường dẫn đến thư mục của mod với tên file hình ảnh
					imagePath = modData.folder + "/" + imagePath.replace(/^\.\//, '');
				}
			}

			// Tạo đối tượng mod chuẩn từ manifest
			return {
				id: modData.id,
				name: modData.name,
				version: modData.version,
				author: modData.author,
				description: modData.description,
				main: modData.main,
				folder: modData.folder,
				image: imagePath, // Đường dẫn hình ảnh đã được xử lý
				dependencies: modData.dependencies || {},
				active: modData.id !== "CheatMod-kristof1104", // Tất cả mod trừ CheatMod luôn active
				unresolvedDependency: false // Không quan tâm đến ràng buộc
			};
		});

		// Khởi tạo trạng thái CheatMod nếu chưa có
		if (!window.localStorage.getItem('enabledCheatMod')) {
			window.localStorage.setItem('enabledCheatMod', 'false');
		}

		// Kiểm tra CheatMod và cập nhật trạng thái active
		var cheatMod = ModSupport.availableMods.find(function (mod) {
			return mod.id === "CheatMod-kristof1104";
		});

		if (cheatMod) {
			cheatMod.active = window.localStorage.getItem('enabledCheatMod') === 'true';
		}

		// Cập nhật danh sách mod hiện tại
		ModSupport.updateCurrentMods();
	} else {
		console.error("Không tìm thấy GDT_MOD_MANIFEST. Hãy đảm bảo file mods_manifest.js đã được tải.");
		ModSupport.availableMods = [];
		ModSupport.currentMods = [];
	}

	// Tải các mod được kích hoạt
	ModSupport.loadMods();

	// Lưu thông tin mod vào company khi save game
	var setActiveModsInfo = function (s) {
		GameManager.company.mods = [];
		ModSupport.availableMods.forEach(function (mod) {
			if (mod.active) {
				GameManager.company.mods.push({
					id: mod.id,
					name: mod.name,
					author: mod.author,
					version: mod.version
				});
			}
		});
	};
	GDT.on(GDT.eventKeys.saves.saving, setActiveModsInfo);

	// Gọi callback nếu có, sau khi tất cả mod đã được tải
	if (callback) {
		GDT.on(GDT.eventKeys.mod.allLoaded, function () {
			console.log("ModSupport init: Gọi callback sau khi tất cả mod đã tải.");
			callback();
		});
	}
};