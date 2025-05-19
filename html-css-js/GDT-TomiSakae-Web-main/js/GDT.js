var GDT = {};
(function () {
	//var fs = typeof require != 'undefined' ? require('fs') : null;

	//dont' go more than one level deep.
	GDT.eventKeys = {
		gameplay: {
			afterGameReview: 'gameplay.afterGameReview', //{ company, game, reviews}
			beforeGameReview: 'gameplay.beforeGameReview', //{ company, game}
			afterReleaseGame: 'gameplay.afterReleaseGame', //{company, game}
			beforeReleaseGame: 'gameplay.beforeReleaseGame', //{company, game}
			contractFinished: 'gameplay.contractFinished',//{company, contract}
			contractStarted: 'gameplay.contractStarted',//{company, contract}
			engineFinished: 'gameplay.engineFinished',//{company, engine}
			engineStarted: 'gameplay.engineStarted',//{company}
			featureFinished: 'gameplay.featureFinished',//{company, feature}
			gameDefinitionCanceled: 'gameplay.gameDefinitionCanceled',//{company}
			researchCompleted: 'gameplay.researchCompleted',//{company, researchItem}
			researchStarted: 'gameplay.researchStarted',//{company, researchItem}
			salesCalculated: 'gameplay.salesCalculated',//{company, game}
			trainingFinished: 'gameplay.trainingFinished',//{staff, training}
			weekProceeded: 'gameplay.weekProceeded',//{company}
			staffApplicantsGenerated: 'gameplay.staffApplicantsGenerated',//{applicants, settings, rng}
			staffHired: 'gameplay.staffHired',//{character, applicant}
			staffFired: 'gameplay.staffFired'//{character}
		},
		ui: {
			dialogOpen: 'ui.dialogOpen',
			dialogClose: 'ui.dialogClose',
			contextMenuShowing: 'ui.contextMenuShowing',
			beforeShowingNotification: 'ui.beforeShowingNotification'
		},
		saves: {
			saving: 'saves.saving',
			loading: 'saves.loading',
			loaded: 'saves.loaded',
			newGame: 'saves.newGame'
		},
		mod: {
			loaded: 'mod.loaded',
			loadError: 'mod.loadError',
			allLoaded: 'mod.allLoaded'
		}
	};
	var _subscribers = {};

	var getSubscribers = function (key) {
		if (!_subscribers.hasOwnProperty(key)) {
			_subscribers[key] = [];
		}
		return _subscribers[key];
	};

	GDT.on = function (key, handler) {
		getSubscribers(key).push(handler);
	};

	GDT.off = function (key, handler) {
		getSubscribers(key).remove(handler);
	};

	GDT.fire = function (obj, key, data) {
		var subs = getSubscribers(key).slice();
		for (var i = 0; i < subs.length; i++) {
			if (subs[i] != null) {
				try {
					subs[i].call(obj, data);
				} catch (e) {
					Logger.LogWarning('GDT event handler error', e);
				}
			}
		}
	};

	var _scriptsCurrentlyLoading = 0; // Theo dõi số lượng script đang tải

	GDT.loadJs = function (scriptFiles, ready, error) {
		// if (PlatformShim.ISWIN8) // Có thể không cần kiểm tra này nữa nếu chỉ chạy web
		//     return;

		if (!Array.isArray(scriptFiles)) {
			scriptFiles = [scriptFiles];
		}

		var scriptsToLoadCount = scriptFiles.length;
		if (scriptsToLoadCount === 0) {
			if (ready) ready();
			return;
		}

		_scriptsCurrentlyLoading += scriptsToLoadCount;

		var loadedCount = 0;
		var errorOccurred = false;

		function onScriptLoadOrError(isSuccess, scriptUrl) {
			loadedCount++;
			_scriptsCurrentlyLoading--;

			if (!isSuccess && !errorOccurred) {
				errorOccurred = true; // Chỉ gọi hàm error một lần
				var errorMessage = 'Không thể tải script {0}'.format(scriptUrl);
				Logger.LogModError(errorMessage, null, errorMessage); // Sử dụng Logger
				if (error) error({ message: "Lỗi tải script", script: scriptUrl });
			}

			if (loadedCount === scriptsToLoadCount) { // Tất cả script trong batch này đã được xử lý
				if (!errorOccurred && ready) {
					ready();
				}
				// Kiểm tra xem tất cả các batch script đã tải xong chưa
				if (_scriptsCurrentlyLoading === 0) {
					// Chỉ fire sự kiện khi tất cả các lệnh gọi GDT.loadJs đồng thời đã hoàn tất
					GDT.fire(this, errorOccurred ? GDT.eventKeys.mod.loadError : GDT.eventKeys.mod.loaded);
				}
			}
		}

		scriptFiles.forEach(function (scriptUrl) {
			// Đường dẫn scriptUrl đã được chuẩn bị trong modSupport.js
			// ví dụ: "mods/CheatModKristof1104/source.js"
			console.log("GDT.loadJs: Đang yêu cầu tải " + scriptUrl);
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.async = true; // Tải bất đồng bộ
			script.src = scriptUrl;

			script.onload = function () {
				console.log("GDT.loadJs: Đã tải thành công " + scriptUrl);
				onScriptLoadOrError(true, scriptUrl);
			};
			script.onerror = function (err) {
				console.error("GDT.loadJs: Lỗi khi tải " + scriptUrl, err);
				onScriptLoadOrError(false, scriptUrl);
			};
			document.head.appendChild(script);
		});
	};

	// GDT.getRelativePath và GDT.addSettingsTab giữ nguyên nếu bạn vẫn cần chúng
	// Nhưng getRelativePath có thể không còn hoạt động như mong đợi trên web tĩnh.
	GDT.getRelativePath = function () {
		// Trên web tĩnh, việc xác định "relative path" theo cách cũ có thể không chính xác.
		// Bạn có thể trả về một đường dẫn gốc hoặc rỗng.
		// Hoặc dựa vào location.pathname nếu cần.
		console.warn("GDT.getRelativePath có thể không hoạt động như mong đợi trên web tĩnh.");
		return "./"; // Hoặc một giá trị phù hợp khác
	};

	GDT.addSettingsTab = function (text, content) {
		var id = GameManager.getGUID();
		var panel = $(document.createElement('div'));
		panel.attr({ id: id });
		panel.css({ width: '100%', height: 'auto', display: 'block' });
		panel.append(content);

		var tabs = $('#tabs').tabs();
		tabs.tabs("add", "#" + id, text);
		tabs.tabs("refresh");
		tabs.tabs('select', 0);

		$("#" + id).append(panel);

		return panel;
	};

	//UltimateLib introduced tabs in the settings menu but since v1.6 we have our own tabs.
	//for mod compatibility we rewire the ultimate lib tabs (if installed) to use ours instead.
	var ultimateLibFix = function () {
		if (typeof UltimateLib != 'undefined' && UltimateLib.Configuration) {
			//ultimatelib is already initialized but just in case nuke the init function
			UltimateLib.Configuration.init = function () { };

			//we need to 'un-nest' the settings panel from the ultimate lib modifications.
			var ultimateLibTabs = $('#UltimateLibConfigurationTabsList');
			var mainContent = $('#UltimateLibConfigurationDefaultTabPanel');
			var children = mainContent.children();
			ultimateLibTabs.remove();

			var tabs = $('#tabs');
			children.appendTo($('#settingsPanel'));
			$('#UltimateLibConfigurationTabs').remove();

			tabs.tabs('refresh');
			tabs.tabs('select', 0);
			//by now, we restored the original game content to our main settingsPanel and removed the ultimate lib custom tabs.
			//now we hook the addTab feature to add any modded content to the vanilla games panels.
			UltimateLib.Configuration.addTab = function (name, text, content) { GDT.addSettingsTab(text, content); };
			GDT.off(GDT.eventKeys.mod.loaded, ultimateLibFix);
		};
	};

	GDT.on(GDT.eventKeys.mod.loaded, ultimateLibFix);
})();