// ******************************************************************************************
// Tên Mod: Story_Expansion_Mod_2
// ID Mod: Story_Expansion_Mod_2_TheOnlyGaming
// Phiên bản Mod: 27.6.24
// Tệp Mod: code.js
// ******************************************************************************************
// Tác giả: TheOnlyGaming
// Chỉnh sửa lần cuối: 27/06/2024 18:08
// ******************************************************************************************
// Ghi chú: Tệp này được tải từ main.js
// ******************************************************************************************

// Tạo đối tượng mod chính (gói của chúng ta)
var Story_Expansion_Mod_2 = {};

(function () {

	// ******************************************************************************************
	// Nền tảng
	// ******************************************************************************************

	// Thêm Itari 2600
	// -----------------------------------------------------------
	GDT.addPlatform({
		id: "963b6d52-4a3f-4576-ada9-d9ea5c2675b8",
		name: "Itari 2600",
		company: "Itari Inc",
		startAmount: 0.3,
		unitsSold: 0.45,
		licencePrize: 0,
		published: "1/1/1",
		platformRetireDate: "2/5/4",
		developmentCosts: 5E3,
		genreWeightings: [1, 0.8, 0.7, 0.9, 0.8, 0.9],
		audienceWeightings: [0.8, 1, 0.7],
		techLevel: 2,
		iconUri: Story_Expansion_Mod_2_TheOnlyGaming.modPath + "/images/platforms/Atari2600_GDT3.png",
		events: null
	});

	// Thêm Itari 5200
	// -----------------------------------------------------------
	GDT.addPlatform({
		id: "d617974b-b86a-442b-aaf6-1743eef22141",
		name: "Itari 5200",
		company: "Itari Inc",
		startAmount: 0.175,
		unitsSold: 0.3,
		licencePrize: 4E4,
		published: "2/1/1",
		platformRetireDate: "4/4/3",
		developmentCosts: 1E4,
		genreWeightings: [1, 0.8, 0.8, 0.8, 0.7, 0.9],
		audienceWeightings: [0.9, 1, 0.6],
		techLevel: 2,
		iconUri: Story_Expansion_Mod_2_TheOnlyGaming.modPath + "/images/platforms/Atari5200_GDT_3.png",
		events: null
	});

	// Thêm Lynks
	// -----------------------------------------------------------
	GDT.addPlatform({
		id: "7daba0b0-4970-47d3-b405-6787ef332c3d",
		name: "Lynks",
		company: "Itari Inc",
		startAmount: 0.115,
		unitsSold: 0.175,
		licencePrize: 2E4,
		published: "3/10/4",
		platformRetireDate: "7/5/1",
		developmentCosts: 1E4,
		genreWeightings: [1, 0.9, 1, 0.9, 0.9, 1],
		audienceWeightings: [1, 1, 0.9],
		techLevel: 3,
		iconUri: Story_Expansion_Mod_2_TheOnlyGaming.modPath + "/images/platforms/Atari_LYNX.png",
		events: null
	});

	// Thêm Itari 7800
	// -----------------------------------------------------------
	GDT.addPlatform({
		id: "ff5f5302-0f0c-43f4-a015-6664a4446655",
		name: "Itari 7800",
		company: "Itari Inc",
		startAmount: 0.052,
		unitsSold: 0.12,
		licencePrize: 7E4,
		published: "4/1/1",
		platformRetireDate: "10/3/1",
		developmentCosts: 2E4,
		genreWeightings: [1, 0.9, 1, 0.8, 0.8, 0.8],
		audienceWeightings: [0.7, 1, 1],
		techLevel: 3,
		iconUri: Story_Expansion_Mod_2_TheOnlyGaming.modPath + "/images/platforms/Atari5200_GDT_3.png",
		events: null
	});

	// Thêm Gearbox
	// -----------------------------------------------------------
	GDT.addPlatform({
		id: "1fc4665e-dbec-4219-95f6-f62ac5ff98e6",
		name: "Gearbox",
		company: "Gearworks",
		startAmount: 0.07,
		unitsSold: 0.18,
		licencePrize: 1E5,
		published: "25/11/1",
		platformRetireDate: "29/3/2",
		developmentCosts: 7E4,
		genreWeightings: [1, 1, 1, 1, 1, 1],
		audienceWeightings: [1, 1, 1],
		techLevel: 5,
		iconUri: Story_Expansion_Mod_2_TheOnlyGaming.modPath + "/images/platforms/alienware_steam_machine.0.png",
		events: null
	});

	// Thêm Stradio
	// -----------------------------------------------------------
	GDT.addPlatform({
		id: "23d95f32-46fa-4d8a-9831-977b483c6f48",
		name: "Stradio",
		company: "Groople",
		startAmount: 0.125,
		unitsSold: 0.2,
		licencePrize: 7E4,
		published: "29/2/1",
		platformRetireDate: "35/1/1",
		developmentCosts: 1E5,
		genreWeightings: [0.9, 1, 0.9, 0.8, 0.8, 1],
		audienceWeightings: [1, 1, 1],
		techLevel: 5,
		iconUri: Story_Expansion_Mod_2_TheOnlyGaming.modPath + "/images/platforms/Stadia_GDT_2.png",
		events: null
	});

	// Thêm Gear Deck
	// -----------------------------------------------------------
	GDT.addPlatform({
		id: "9ee29daa-cbb7-485c-b162-a9ac12452764",
		name: "Gear Deck",
		company: "Gearworks",
		startAmount: 7.5,
		unitsSold: 1E1,
		licencePrize: 0,
		published: "29/4/2",
		platformRetireDate: "1000/1/1",
		developmentCosts: 5E4,
		genreWeightings: [1, 1, 1, 1, 1, 1],
		audienceWeightings: [1, 1, 1],
		techLevel: 6,
		iconUri: Story_Expansion_Mod_2_TheOnlyGaming.modPath + "/images/platforms/Steam-Deck.png",
		events: null
	});

	// Thêm Playsystem 6
	// -----------------------------------------------------------
	GDT.addPlatform({
		id: "16b034cd-4d5c-4deb-bfc5-d0d972c88184",
		name: "Playsystem 6",
		company: "Vonny",
		startAmount: 1E1,
		unitsSold: 2E1,
		licencePrize: 2E6,
		published: "32/8/2",
		platformRetireDate: "1000/8/2",
		developmentCosts: 2E5,
		genreWeightings: [0.9, 1, 1, 0.8, 0.8, 0.8],
		audienceWeightings: [0.9, 1, 1],
		techLevel: 7,
		iconUri: Story_Expansion_Mod_2_TheOnlyGaming.modPath + "/images/platforms/PLATFORMps6v2.png",
		events: null
	});

	// Thêm mBox Series X
	// -----------------------------------------------------------
	GDT.addPlatform({
		id: "6251e2cc-84cb-4061-9c47-18dd34f50bc6",
		name: "mBox Series X",
		company: "Micronoft",
		startAmount: 8.5,
		unitsSold: 2E1,
		licencePrize: 2E6,
		published: "38/8/2",
		platformRetireDate: "1000/1/1",
		developmentCosts: 2E5,
		genreWeightings: [1, 1, 0.9, 0.9, 0.9, 0.9],
		audienceWeightings: [1, 1, 0.8],
		techLevel: 7,
		iconUri: Story_Expansion_Mod_2_TheOnlyGaming.modPath + "/images/platforms/PLATFORMseriesx.png",
		events: null
	});

	// Thêm mBox Series S
	// -----------------------------------------------------------
	GDT.addPlatform({
		id: "e6eb02b2-5bb2-4483-aa51-251bbb4cd9fc",
		name: "mBox Series S",
		company: "Micronoft",
		startAmount: 4,
		unitsSold: 1E1,
		licencePrize: 7E5,
		published: "38/8/2",
		platformRetireDate: "1000/1/1",
		developmentCosts: 1E5,
		genreWeightings: [1, 1, 0.9, 0.9, 0.9, 0.9],
		audienceWeightings: [1, 0.9, 0.8],
		techLevel: 7,
		iconUri: Story_Expansion_Mod_2_TheOnlyGaming.modPath + "/images/platforms/mBox_Series_S.png",
		events: null
	});


	// ******************************************************************************************
	// Sự kiện
	// ******************************************************************************************

	GDT.addEvent({
		id: "8a199856-d481-441f-b77f-6aff2e0ded21",
		date: "1/10/1",
		isRandom: false,
		ignoreGameLengthModifier: false,
		maxTriggers: 1,
		getNotification: function (company) {
			return new Notification({
				header: "Tin tức nền tảng",
				text: "Itari gần đây đã tiết lộ bảng điều khiển mới nhất của họ, Itari 5200, giữ nguyên cách đặt tên truyền thống của dòng sản phẩm. Bảng điều khiển dường như không có phần cứng tốt. Chúng ta sẽ xem bảng điều khiển này hoạt động như thế nào trong thị trường bảng điều khiển trò chơi điện tử đang mở rộng. Nó sẽ có sẵn trong những tháng tới.",
				image: Story_Expansion_Mod_2_TheOnlyGaming.modPath + "/images/notifications/Atari5200_GDT_3.png",
				buttonText: "OK",
				weeksUntilFired: 0
			});
		}
	});

	GDT.addEvent({
		id: "ad5683a3-ad6b-499c-908e-257db694b3fa",
		date: "2/2/1",
		isRandom: false,
		ignoreGameLengthModifier: false,
		maxTriggers: 1,
		getNotification: function (company) {
			return new Notification({
				header: "Tin tức nền tảng",
				text: "Người dùng của Itari 5200 mới phát hành đang bối rối về lựa chọn Joystick cho thiết bị. Có vẻ như trong hầu hết các trường hợp, trò chơi không phản hồi với bộ điều khiển. Đây dường như là một lỗi gây hại cho bảng điều khiển và có thể sẽ ảnh hưởng đến doanh số bán hàng.",
				image: Story_Expansion_Mod_2_TheOnlyGaming.modPath + "/images/notifications/Atari5200_GDT_3.png",
				buttonText: "OK",
				weeksUntilFired: 0
			});
		}
	});

	GDT.addEvent({
		id: "27a5db6e-9f7e-4ca6-a7c4-e2fbc28bfad0",
		date: "2/4/1",
		isRandom: false,
		ignoreGameLengthModifier: false,
		maxTriggers: 1,
		getNotification: function (company) {
			return new Notification({
				header: "Tin tức nền tảng",
				text: "Itari, Inc. gần đây đã báo cáo rằng doanh số bán hàng của bảng điều khiển Itari 5200 mới chỉ ở mức trung bình. Điều này có thể phần lớn là do những vấn đề tai tiếng với joystick của thiết bị và sự thiếu hụt các trò chơi cho hệ thống.",
				image: Story_Expansion_Mod_2_TheOnlyGaming.modPath + "",
				buttonText: "OK",
				weeksUntilFired: 0
			});
		}
	});

	GDT.addEvent({
		id: "adf50ac7-4f78-453c-853f-3d71ea1ebf75",
		date: "3/8/4",
		isRandom: false,
		ignoreGameLengthModifier: false,
		maxTriggers: 1,
		getNotification: function (company) {
			return new Notification({
				header: "Tin tức nền tảng",
				text: "Itari đã tiết lộ đối thủ cạnh tranh với Gameling của Ninvento, 'Lynks', nó mạnh mẽ hơn nhiều. Nó có màn hình màu đèn nền và đơn vị xử lý 16-bit. Các chuyên gia cho rằng điều này có thể tiêu tốn nhiều pin.",
				image: Story_Expansion_Mod_2_TheOnlyGaming.modPath + "/images/notifications/Atari_LYNX.png",
				buttonText: "OK",
				weeksUntilFired: 0
			});
		}
	});

	GDT.addEvent({
		id: "74b57809-94f9-4bf8-a714-512b8a8c679d",
		date: "3/8/4",
		isRandom: false,
		ignoreGameLengthModifier: false,
		maxTriggers: 1,
		getNotification: function (company) {
			return new Notification({
				header: "Tin tức nền tảng",
				text: "Các chuyên gia hoài nghi liệu nó có thể sánh ngang với doanh số bán hàng của Gameling của Ninvento cực kỳ thành công, đặc biệt là sau bảng điều khiển Itari 5200 đáng thất vọng. Thiết bị được cho là sẽ lên kệ trong những tháng tới. Hy vọng nó có thể có thiết bị đầu vào chất lượng cao.",
				image: Story_Expansion_Mod_2_TheOnlyGaming.modPath + "/images/notifications/Atari_LYNX.png",
				buttonText: "OK",
				weeksUntilFired: 0
			});
		}
	});

	GDT.addEvent({
		id: "28c3add1-85b9-479b-9d30-f0a074b9cca5",
		date: "3/8/1",
		isRandom: false,
		ignoreGameLengthModifier: false,
		maxTriggers: 1,
		getNotification: function (company) {
			return new Notification({
				header: "Tin tức nền tảng",
				text: "Itari đã công bố bảng điều khiển mới nhất của họ hôm nay - Itari 7800. Nó trông gần như giống hệt với mẫu trước đó. Bảng điều khiển có vẻ khá mạnh mẽ, nhiều người không kỳ vọng bảng điều khiển sẽ hoạt động tốt sau Itari 5200 rất đáng thất vọng, không thu hút được nhiều nhà phát triển.",
				image: Story_Expansion_Mod_2_TheOnlyGaming.modPath + "/images/notifications/Atari5200_GDT_3.png",
				buttonText: "OK",
				weeksUntilFired: 0
			});
		}
	});

	GDT.addEvent({
		id: "41574fdf-52f4-4909-a94d-cfc8787eacb0",
		date: "3/8/1",
		isRandom: false,
		ignoreGameLengthModifier: false,
		maxTriggers: 1,
		getNotification: function (company) {
			return new Notification({
				header: "Tin tức nền tảng",
				text: "Có vẻ như thành công lớn cuối cùng của Itari là với bảng điều khiển đầu tiên của họ, Itari 2600. Bảng điều khiển sẽ có sẵn trong những tháng tới.",
				image: Story_Expansion_Mod_2_TheOnlyGaming.modPath + "/images/notifications/Atari5200_GDT_3.png",
				buttonText: "OK",
				weeksUntilFired: 0
			});
		}
	});

	GDT.addEvent({
		id: "eb843798-ff01-46b5-931f-9714afb9be33",
		date: "4/12/1",
		isRandom: false,
		ignoreGameLengthModifier: false,
		maxTriggers: 1,
		getNotification: function (company) {
			return new Notification({
				header: "Tin tức nền tảng",
				text: "Itari Inc. gần đây đã công bố số liệu bán hàng cho bảng điều khiển Itari 7800 của họ, hệ thống dường như không bán chạy do thiếu các trò chơi độc quyền. Nhiều đối thủ cạnh tranh như Ninvento và Vena gần đây đã có doanh số bán hàng hài lòng hơn nhiều.",
				image: Story_Expansion_Mod_2_TheOnlyGaming.modPath + "/images/notifications/Atari5200_GDT_3.png",
				buttonText: "OK",
				weeksUntilFired: 0
			});
		}
	});

	GDT.addEvent({
		id: "5ef68cf2-a2c4-4e6c-be0e-43a0a10d2bec",
		date: "4/12/1",
		isRandom: false,
		ignoreGameLengthModifier: false,
		maxTriggers: 1,
		getNotification: function (company) {
			return new Notification({
				header: "Tin tức nền tảng",
				text: "Nhiều chuyên gia cho rằng Itari Inc. có thể gặp rắc rối, đặc biệt là sau nỗ lực thất bại trước đó của họ để tham gia vào thị trường cầm tay. Itari Inc là một phần được yêu thích của lịch sử trò chơi và một trong những người tiên phong sớm nhất, nhiều người hâm mộ hy vọng rằng họ có điều gì đó trong tay áo.",
				image: Story_Expansion_Mod_2_TheOnlyGaming.modPath + "/images/notifications/Atari5200_GDT_3.png",
				buttonText: "OK",
				weeksUntilFired: 0
			});
		}
	});

	GDT.addEvent({
		id: "e9aa7896-4781-42c5-9646-7ba0fd9c8625",
		date: "25/4/4",
		isRandom: false,
		ignoreGameLengthModifier: false,
		maxTriggers: 1,
		getNotification: function (company) {
			return new Notification({
				header: "Tin tức nền tảng",
				text: "Gearworks, nổi tiếng với nền tảng phân phối trực tuyến của họ, Gears, gần đây đã thông báo họ đang cố gắng chiếm lĩnh thị trường bảng điều khiển với một máy mới.",
				image: Story_Expansion_Mod_2_TheOnlyGaming.modPath + "/images/notifications/alienware_steam_machine.0.png",
				buttonText: "OK",
				weeksUntilFired: 0
			});
		}
	});

	GDT.addEvent({
		id: "7400cfae-697b-42f9-b69d-49f0aec8c0c4",
		date: "25/4/4",
		isRandom: false,
		ignoreGameLengthModifier: false,
		maxTriggers: 1,
		getNotification: function (company) {
			return new Notification({
				header: "Tin tức nền tảng",
				text: "Gearbox dường như là một PC dưới dạng bảng điều khiển, rất giống với mBox ban đầu, nhìn vào thông số kỹ thuật, nhiều chuyên gia trong ngành tự hỏi mục đích của máy này là gì khi xét đến giá cao của nó.",
				image: Story_Expansion_Mod_2_TheOnlyGaming.modPath + "/images/notifications/alienware_steam_machine.0.png",
				buttonText: "OK",
				weeksUntilFired: 0
			});
		}
	});

	GDT.addEvent({
		id: "78356c43-6dd6-47c6-9141-f19e0a65978a",
		date: "25/4/4",
		isRandom: false,
		ignoreGameLengthModifier: false,
		maxTriggers: 1,
		getNotification: function (company) {
			return new Notification({
				header: "Tin tức nền tảng",
				text: "Bảng điều khiển có một bộ điều khiển hình dạng kỳ lạ, với các nút lạ. Nhiều người nói rằng nó trông không giống như những gì họ đã thấy trong một nền tảng trò chơi trước đây. Chúng tôi tò mò muốn xem bộ điều khiển hoạt động như thế nào. Tất cả chúng tôi đều háo hức muốn xem Gearworks có gì để cung cấp với máy mới của họ.",
				image: Story_Expansion_Mod_2_TheOnlyGaming.modPath + "/images/notifications/alienware_steam_machine.0.png",
				buttonText: "OK",
				weeksUntilFired: 0
			});
		}
	});

	GDT.addEvent({
		id: "722c3650-c4bb-4a3f-964e-f3eeed5a3b8b",
		date: "28/8/2",
		isRandom: false,
		ignoreGameLengthModifier: false,
		maxTriggers: 1,
		getNotification: function (company) {
			return new Notification({
				header: "Tin tức nền tảng",
				text: "Groople đã thông báo rằng họ đang tham gia vào trò chơi đám mây. Đã có nhiều nỗ lực trước đây trong ngành, nhưng dường như không có công nghệ có khả năng làm cho trò chơi đám mây phổ biến. Groople tuyên bố rằng ngay cả người dùng có internet kém cũng có thể chơi trò chơi mượt mà.",
				image: Story_Expansion_Mod_2_TheOnlyGaming.modPath + "/images/notifications/Stadia_GDT_2.png",
				buttonText: "OK",
				weeksUntilFired: 0
			});
		}
	});

	GDT.addEvent({
		id: "b393ec57-29a7-44ba-8489-78faadb48ab3",
		date: "28/8/2",
		isRandom: false,
		ignoreGameLengthModifier: false,
		maxTriggers: 1,
		getNotification: function (company) {
			return new Notification({
				header: "Tin tức nền tảng",
				text: "Nhiều chuyên gia nghi ngờ rằng trò chơi đám mây sẽ thành công, ngay cả với những lời hứa của Groople. Nền tảng, có tên là 'Stradio', sẽ ra mắt trong những tháng tới.",
				image: Story_Expansion_Mod_2_TheOnlyGaming.modPath + "/images/notifications/Stadia_GDT_2.png",
				buttonText: "OK",
				weeksUntilFired: 0
			});
		}
	});

	GDT.addEvent({
		id: "e9ad3f9d-e888-454c-b8a8-8238c16bf093",
		date: "28/6/3",
		isRandom: false,
		ignoreGameLengthModifier: false,
		maxTriggers: 1,
		getNotification: function (company) {
			return new Notification({
				header: "Tin tức nền tảng",
				text: "Tin đồn đang đồn đoán rằng Gearworks đang lên kế hoạch phát hành một bảng điều khiển cầm tay để cạnh tranh với hệ thống Swap của Ninvento. Điều này sẽ là một bất ngờ vì Gearworks trước đây đã không thành công trong thị trường bảng điều khiển.",
				image: Story_Expansion_Mod_2_TheOnlyGaming.modPath + "/images/notifications/Steam-Deck.png",
				buttonText: "OK",
				weeksUntilFired: 0
			});
		}
	});

	GDT.addEvent({
		id: "edb88fa5-d637-4ee2-aea1-8c14e47476ee",
		date: "28/12/1",
		isRandom: false,
		ignoreGameLengthModifier: false,
		maxTriggers: 1,
		getNotification: function (company) {
			return new Notification({
				header: "Tin tức nền tảng",
				text: "Có vẻ như tin đồn là đúng, vì hôm nay, Gearworks đã công bố bảng điều khiển cầm tay của riêng họ. Thiết bị dường như nhắm đến trải nghiệm cấp pc, nhưng chạy trên hệ điều hành tùy chỉnh.",
				image: Story_Expansion_Mod_2_TheOnlyGaming.modPath + "/images/notifications/Steam-Deck.png",
				buttonText: "OK",
				weeksUntilFired: 0
			});
		}
	});

	GDT.addEvent({
		id: "871adf8d-9bd5-432a-a0ff-3b1ccecdd8ea",
		date: "28/12/1",
		isRandom: false,
		ignoreGameLengthModifier: false,
		maxTriggers: 1,
		getNotification: function (company) {
			return new Notification({
				header: "Tin tức nền tảng",
				text: "Thiết bị có thông số kỹ thuật rất cao, chúng dường như cao hơn nỗ lực trước đây của Gearwork với một bảng điều khiển, nhưng ở dạng cầm tay. Đây dường như là thiết bị cầm tay mạnh mẽ nhất từng ra mắt. Chúng tôi đơn giản là không thể chờ đợi.",
				image: Story_Expansion_Mod_2_TheOnlyGaming.modPath + "/images/notifications/Steam-Deck.png",
				buttonText: "OK",
				weeksUntilFired: 0
			});
		}
	});

	GDT.addEvent({
		id: "07abfe4b-1841-4710-888d-6863b7b68ff0",
		date: "32/1/1",
		isRandom: false,
		ignoreGameLengthModifier: false,
		maxTriggers: 1,
		getNotification: function (company) {
			return new Notification({
				header: "Tin tức nền tảng",
				text: "Vonny đã công bố nền tảng thế hệ tiếp theo của họ. Playsystem 6 hôm nay, đánh bại Micronoft trong cuộc đua. Hệ thống đi kèm với bộ xử lý cực nhanh và được cho là có thể chạy và tải trò chơi rất nhanh.",
				image: Story_Expansion_Mod_2_TheOnlyGaming.modPath + "/images/notifications/PLATFORMps6v2.png",
				buttonText: "OK",
				weeksUntilFired: 0
			});
		}
	});

	GDT.addEvent({
		id: "016497b8-689c-4a38-b200-ae0bd3a6da85",
		date: "32/1/1",
		isRandom: false,
		ignoreGameLengthModifier: false,
		maxTriggers: 1,
		getNotification: function (company) {
			return new Notification({
				header: "Tin tức nền tảng",
				text: "Thiết kế của máy console trông rất hiện đại, với tông màu đen trắng, hệ thống dường như rất nổi bật trong phòng ngủ của bất kỳ khách hàng nào.",
				image: Story_Expansion_Mod_2_TheOnlyGaming.modPath + "/images/notifications/PLATFORMps6v2.png",
				buttonText: "OK",
				weeksUntilFired: 0
			});
		}
	});

	GDT.addEvent({
		id: "31fdc080-e76e-457c-9675-6fc48d771564",
		date: "32/1/1",
		isRandom: false,
		ignoreGameLengthModifier: false,
		maxTriggers: 1,
		getNotification: function (company) {
			return new Notification({
				header: "Tin tức nền tảng",
				text: "Nhiều chuyên gia tự hỏi liệu máy console này có bán chạy không, xét đến sự bùng nổ gần đây về độ phổ biến của trò chơi đám mây. Chúng tôi rất háo hức để xem máy console này sẽ hoạt động như thế nào trên thị trường.",
				image: Story_Expansion_Mod_2_TheOnlyGaming.modPath + "/images/notifications/PLATFORMps6v2.png",
				buttonText: "OK",
				weeksUntilFired: 0
			});
		}
	});

	GDT.addEvent({
		id: "52ffcf17-e7fd-4c3c-9850-be7005761d79",
		date: "31/11/1",
		isRandom: false,
		ignoreGameLengthModifier: false,
		maxTriggers: 1,
		getNotification: function (company) {
			return new Notification({
				header: "Tin tức nền tảng",
				text: "Một hình ảnh rò rỉ của bộ phát triển cho máy console tiếp theo của Micronoft dường như đã xuất hiện trực tuyến. Nó rất giống với mBox ban đầu, người hâm mộ khắp nơi đều rất phấn khích.",
				image: Story_Expansion_Mod_2_TheOnlyGaming.modPath + "",
				buttonText: "OK",
				weeksUntilFired: 0
			});
		}
	});

	GDT.addEvent({
		id: "cf7fe2bd-8672-4365-8d5d-3cd703191b41",
		date: "32/4/3",
		isRandom: false,
		ignoreGameLengthModifier: false,
		maxTriggers: 1,
		getNotification: function (company) {
			return new Notification({
				header: "Tin tức nền tảng",
				text: "Người hâm mộ của mBox Next đã kiên nhẫn chờ đợi máy console tiếp theo từ Micronoft sau khi hình ảnh của bộ phát triển cho hệ thống mới bị rò rỉ trực tuyến, và có vẻ như nó đã được xác nhận chính thức hôm nay.",
				image: Story_Expansion_Mod_2_TheOnlyGaming.modPath + "/images/notifications/PLATFORMseriesx.png",
				buttonText: "OK",
				weeksUntilFired: 0
			});
		}
	});

	GDT.addEvent({
		id: "600eeb10-7cff-4c7f-bc38-d871528ef858",
		date: "32/4/3",
		isRandom: false,
		ignoreGameLengthModifier: false,
		maxTriggers: 1,
		getNotification: function (company) {
			return new Notification({
				header: "Tin tức nền tảng",
				text: "Máy console mới, có tên là mBox Series X, dự kiến sẽ ra mắt vào cùng tuần với Playsystem 6 của Vonny, và dường như là mBox mạnh mẽ nhất từ trước đến nay. Có vẻ như mBox có cơ hội thực sự để cạnh tranh với Playsystem 6 sau thành công của họ với mBox Next.",
				image: Story_Expansion_Mod_2_TheOnlyGaming.modPath + "/images/notifications/PLATFORMseriesx.png",
				buttonText: "OK",
				weeksUntilFired: 0
			});
		}
	});

	GDT.addEvent({
		id: "1b518e6d-5cfe-4e61-8454-25869cc041b9",
		date: "32/6/1",
		isRandom: false,
		ignoreGameLengthModifier: false,
		maxTriggers: 1,
		getNotification: function (company) {
			return new Notification({
				header: "Tin tức nền tảng",
				text: "Trong một thông báo bất ngờ, chúng ta hiện biết rằng Micronoft sẽ phát hành không chỉ 1 mà là 2 máy console trong năm nay.",
				image: Story_Expansion_Mod_2_TheOnlyGaming.modPath + "/images/notifications/mBox_Series_S.png",
				buttonText: "OK",
				weeksUntilFired: 0
			});
		}
	});

	GDT.addEvent({
		id: "272f96f8-4121-4eb7-a0c3-72f0ddc0b283",
		date: "32/6/1",
		isRandom: false,
		ignoreGameLengthModifier: false,
		maxTriggers: 1,
		getNotification: function (company) {
			return new Notification({
				header: "Tin tức nền tảng",
				text: "Hệ thống này được gọi là mBox Series S, và sẽ là phiên bản rẻ hơn, ít mạnh mẽ hơn của mẫu Series X cùng tên của Micronoft.",
				image: Story_Expansion_Mod_2_TheOnlyGaming.modPath + "/images/notifications/mBox_Series_S.png",
				buttonText: "OK",
				weeksUntilFired: 0
			});
		}
	});

	GDT.addEvent({
		id: "c85a3863-9447-4586-bbd9-2f42f6830c50",
		date: "32/6/1",
		isRandom: false,
		ignoreGameLengthModifier: false,
		maxTriggers: 1,
		getNotification: function (company) {
			return new Notification({
				header: "Tin tức nền tảng",
				text: "Các nhà phát triển trò chơi lo ngại rằng việc chia sẻ sự tập trung giữa một máy console mạnh mẽ và một máy ít mạnh hơn sẽ làm cho quá trình phát triển kéo dài hơn và khó khăn hơn đáng kể. Tuy nhiên, chúng ta sẽ chờ xem điều này ảnh hưởng chính xác như thế nào đến các trò chơi. Máy console ra mắt cùng tuần với Playsystem 6 của Vonny và mBox Series X của Micronoft.",
				image: Story_Expansion_Mod_2_TheOnlyGaming.modPath + "/images/notifications/mBox_Series_S.png",
				buttonText: "OK",
				weeksUntilFired: 0
			});
		}
	});



})();
