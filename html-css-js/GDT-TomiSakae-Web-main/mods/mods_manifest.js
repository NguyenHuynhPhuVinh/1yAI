// mods_manifest.js
var GDT_MOD_MANIFEST = [
    {
        "id": "gdt-modAPI",
        "name": "Game Dev Tycoon Mod API",
        "version": "0.1.2",
        "author": "support@greenheartgames.com",
        "description": "API Mod chính thức của Game Dev Tycoon được sử dụng phổ biến bởi các mod khác.",
        "main": "modAPI.js",
        "folder": "./mods/gdt-modAPI",
        "image": "image.png",
        "url": "https://github.com/greenheartgames/gdt-modAPI"
    },
    {
        "id": "UltimateLib",
        "name": "UltimateLib",
        "version": "1.4.0",
        "author": "Francesco Abbattista và Chad Keating",
        "url": "http://forum.greenheartgames.com/t/wip-tools-ultimatesuite-ultimatelib-1-2-0-and-ume-0-2-4-24/9855/",
        "description": "Thư viện cốt lõi của UltimateSuite, một bộ công cụ giúp việc phát triển mod trở nên dễ dàng. \nBạn sẽ cần thư viện này nếu các mod khác phụ thuộc vào nó. \n\nUltimateLib Phiên bản 1.4.0 \nUltimateModEditor Phiên bản 0.4.5 \n\nĐược viết và phát triển bởi \nFrancesco Abbattista (alphabit) \nChad Keating (Sir Everard)",
        "main": "UltimateLib.js",
        "image": "UltimateLib-Thumbnail.png",
        "folder": "./mods/UltimateLib",
        "dependencies": {
            "gdt-modAPI": "0.1.x"
        }
    },
    {
        "id": "CheatMod-kristof1104",
        "name": "CheatMod",
        "version": "1.0.6",
        "author": "kristof1104",
        "url": "https://github.com/kristof1104/CheatMod",
        "description": "Phiên bản 1.0.5c\n\nCheatMod bởi Kristof1104\t\n\nĐây là một mod cho Game Dev Tycoon, cho phép người dùng sử dụng các cheat thông qua menu trong game.\nSử dụng mod này là phương pháp an toàn hơn so với việc thay đổi trực tiếp file lưu bằng trình chỉnh sửa.",
        "main": "CheatMod.js",
        "image": "cheatmod_pic-Thumbnail.png",
        "folder": "./mods/CheatMod"
    },
    {
        "id": "ExpansionPack",
        "name": "Expansion Pack Mod",
        "version": "1.2.0",
        "author": "DzjengisKhan (Người sáng lập & Lãnh đạo) & LineLiar (Đồng lãnh đạo)",
        "url": "https://github.com/DzjengisKhan/GDT-Expansion-Pack",
        "description": "Mod 'Expansion Pack' độc nhất vô nhị cho Game Dev Tycoon.",
        "main": "ExpansionPack.js",
        "image": "mod-image-Thumbnail.png",
        "folder": "./mods/ExpansionPack",
        "dependencies": { "UltimateLib": "1.x.x" }
    },
    {
        "id": "Story_Expansion_Mod_2",
        "name": "Story Expansion Mod 2",
        "version": "27.6.24",
        "author": "TheOnlyGaming",
        "url": "",
        "description": "Phần tiếp theo của Story Expansion Mod, với các hội thoại và nền tảng mới! Phiên bản này được viết lại hoàn toàn từ đầu và không có lỗi của mod gốc. Mod này mở rộng cốt truyện của Game Dev Tycoon thông qua nhiều hội thoại mới.",
        "main": "main.js",
        "folder": "./mods/Story_Expansion_Mod_2",
        "image": "Story_Expansion_Mod_2_Logo_2-Thumbnail.png",
        "dependencies": {
            "gdt-modAPI": "0.1.x",
            "UltimateLib": "1.x.x"
        }
    },
    {
        "id": "Half-Dragon",
        "name": "Mod Thêm Rất Nhiều Nghiên Cứu",
        "version": "0.1.0",
        "author": "Half Dragon",
        "url": "https://discord.gg/dd4fMpY",
        "description": "Mod Half Dragon chính thức. v0.1.0\nMod này thêm rất nhiều tùy chọn nghiên cứu.\n\n\nEngine:\n\n>Hỗ trợ 8bit\n>Hỗ trợ 16bit\n>Hỗ trợ 32bit\n>Hỗ trợ 64bit\n>Độ phân giải 720p\n>Độ phân giải 1080p\n>Độ phân giải 2K\n>Độ phân giải 4K\n>Lượt-Chiến\n>FOV Điều chỉnh được\n>Menu Tạm dừng\n>Hỗ trợ Màn hình chia đôi\n>Lựa chọn Lớp nhân vật\n>Lựa chọn Chủng tộc\n>Đầu vào Tùy chỉnh\n>Ragdoll Cơ bản\n>Ragdoll Nâng cao\n>Hợp tác\n>Lưu Tự động\n>Occlusion Culling\n>Ánh sáng Baked\n>Skybox\n>Xử lý Hậu kỳ\n>Hệ thống Hạt\n>Hiệu ứng Ánh sáng\n>Shader PBR\n>Console\n>Nhóm LOD\n>Vật lý Vải\n>Ray Tracing Baked Cơ bản\n>Ray Tracing Baked Nâng cao\n>Ambient Occlusion\n\nGameplay:\n\n>Kho đồ\n>Cây Năng lực\n>Cơ chế Né\n>Cơ chế Sóng\n>Quản lý Quân đội\n>Quản lý Thành phố\n>Cơ chế Khối\n>Hướng dẫn Tương tác\n\nHội thoại:\n\n>Hội thoại Nhập vai\n>Hội thoại Tính cách\n>Hội thoại Hài hước\n\nAI:\n\n>PathFinding Cơ bản\n>PathFinding Nâng cao\n>AI Học mềm\n>AI Điều khiển Hàng loạt\n>AI Hợp tác\n\nThiết kế Thế giới:\n\n>Thế giới Có thể phá hủy\n>Đối tượng Thu thập\n>Thế giới Sống động\n>Nhiều Thế giới\n>Thế giới Thủ tục\n\nÂm thanh:\n\n>Hiệu ứng Âm thanh\n>Trộn Âm thanh",
        "main": "modAPI.js",
        "folder": "./mods/More Research Mod. Alot More",
        "image": "icon-full-Thumbnail.png"
    },
    {
        "id": "ABYSSFINANCE",
        "name": "ABYSS Finances (ngân hàng, khoản vay, đầu tư và nhiều hơn nữa)",
        "version": "0.2.1",
        "author": "Acuru",
        "url": "",
        "description": "[h1]Mod này làm gì?[/h1]\nHầu hết các tùy chọn mod có sẵn thông qua menu \"click\" -> Ngân hàng.\n\n[b]Tài khoản Ngân hàng[/b]\nBạn có thể gửi tiền và nhận lãi hàng tháng.\n\nLãi suất sẽ giảm dần theo thời gian - bắt đầu khoảng 15% (hàng năm), và giảm xuống khoảng",
        "main": "main.js",
        "folder": "./mods/AbyssFinanceMod_0_2_1",
        "image": "aflogo-Thumbnail.png",
        "dependencies": {
            "gdt-modAPI": "0.1.x"
        }
    },
    {
        "id": "allconsoles935_UMEtesttesttesttesttesttest",
        "name": "All The Consoles Mod! (Phần 1) CẬP NHẬT 2025!",
        "version": "1.8.8",
        "author": "UME",
        "url": "",
        "description": "[h1][img]https://i.imgur.com/JNDFKWd.png[/img][/h1]\n[i]Hình ảnh All The Consoles gốc[/i]\n\n\n[b]Thêm 100+ Máy Console vào Game Dev Tycoon![/b]\n\nMuốn thêm đa dạng trong trò chơi của bạn? Mod này mở rộng trải nghiệm của bạn bằng cách thêm 100 máy console (thậm chí còn nhiều hơn với Phần 2 của mod!).\n\n[h2]Yêu cầu, Khuyến nghị & Tương thích:[/h2]\n\n[list]\n[*] Yêu cầu UltimateLib  \n[*] Do giới hạn của GDT, mod này được chia thành hai phần. Đăng ký Phần 2 để mở khóa thêm 75 máy console!  \n[*] TAG mod cải tiến toàn bộ giao diện và làm cho trò chơi trông hiện đại hơn! Hãy thử nó!  \n[*] Nó tương thích với hầu hết mọi mod, nhưng tôi không khuyên bạn thêm một mod khác cũng thêm nhiều máy console... hoặc sử dụng một mod 10 năm tuổi.  \n[/list]\n\n[h2]📜 Nhật ký Cập nhật:[/h2]\n(2025-03-15)  \n- Làm lại Đơn vị bán ra (Lần nữa) tăng thị phần của hầu hết các máy console\n- Đã xóa DS lite\n- Đã thêm Dendy \n- Sửa hình ảnh tốt hơn cho một số máy console\n- Các sửa lỗi nhỏ khác\n\n(2025-03-13) \n- Cơ bản làm lại toàn bộ mod và trang mod.\n- Điều chỉnh kích thước tất cả hình ảnh để vừa vặn.  \n- Sửa số lượng đơn vị bán ra để phù hợp với logic của GDT (không hợp lý).  \n- Sửa tên của Virtual boy.\n\n(2025-03-12)  \n- Cập nhật tất cả ngày phát hành & ngừng sản xuất máy console để phù hợp với định dạng không quy ước của GDT.  \n\n👉 Lịch sử cập nhật đầy đủ trong Changelog tích hợp của Steam!\n\n[h2]📜 Danh sách Console đầy đủ:[/h2]  \nMuốn xem tất cả 100+ máy console có trong cả hai mod? Xem danh sách đầy đủ tại đây:  \n👉 [url=https://docs.google.com/document/d/11zj14A9beMTxvGt5jojbzfZ2XIVKVrXMj981eDLM0eQ/edit?usp=sharing]Danh sách[/url]\n\n[h2]🛠️ Cách cài đặt:[/h2]\n1️⃣ Đăng ký mod này.  \n2️⃣ Đăng ký All The Consoles Mod [Phần 2].  \n3️⃣ Đăng ký UltimateLib.  \n4️⃣ Bật tất cả các mod trong menu mod bằng cách nhấp vào chúng (Cả mod API tích hợp).\n5️⃣ Khởi động lại trò chơi để kích hoạt các mod và tận hưởng!  \n\n[h2]📊 Những gì cần thiết để tạo Mod này[/h2]\nBiểu đồ này thể hiện [b]sự điên rồ thuần túy[/b] mà tôi đã trải qua để đảm bảo mọi máy console đều có [b]ngày phát hành chính xác và số lượng bán ra để phù hợp với các máy console gốc[/b].\n\nTôi có cần làm điều này không? Có lẽ không.  \nTôi có làm điều đó không? Tất nhiên... Bây giờ tôi có thể ngủ Zzzz\n\n[i]Hình đầu tiên: Tính toán doanh số thực tế để phù hợp với doanh số trong trò chơi. Hình thứ hai: Tính toán cách ngày thực tế so với ngày trong trò chơi.[/i]\n[img]https://i.imgur.com/17HT3aF.png[/img]\n[img]https://i.imgur.com/pliXyFc.png[/img]\n\n[h2]💬 Hỗ trợ & Phản hồi:[/h2]  \nTìm thấy lỗi hoặc biết một máy console khác nên được thêm vào? Để lại bình luận bên dưới!  \n\n[h2]⭐ Thích Mod? Hãy Ủng hộ! ⭐[/h2]  \nHãy cho nó một cái thích & yêu thích!\nTôi đã dành hơn 100 giờ làm việc trên mod này, vì vậy tôi sẽ rất cảm kích!  \nNó cũng giúp nhiều người tìm thấy nó và tiếp tục có các bản cập nhật! 🚀  \n\n\n[quote=Yoda]Làm hoặc không làm, không có thử[/quote]",
        "main": "main.js",
        "folder": "./mods/allconsoles935",
        "image": "allconsoles2025 kvadrat-Thumbnail.png",
        "dependencies": {
            "gdt-modAPI": "0.1.x",
            "UltimateLib": "1.x.x"
        }
    },
    {
        "id": "AllconsolesII65_UME",
        "name": "All The Consoles Mod! (Phần 2) CẬP NHẬT 2025!",
        "version": "0.6.5",
        "author": "UME",
        "url": "",
        "description": "Phần 2 của All The Consoles Mod! Thêm 75+ máy console vào Game Dev Tycoon!",
        "main": "main.js",
        "folder": "./mods/AllconsolesII65",
        "image": "allconsoles2025 part 2 kvadrat-Thumbnail.png",
        "dependencies": {
            "gdt-modAPI": "0.1.x",
            "UltimateLib": "1.x.x"
        }
    },
    {
        "id": "TAG_Mod",
        "name": "TAG Mod",
        "version": "1.2.7",
        "author": "Bellwood Studios",
        "url": "https://www.bellwoodstudios.com/",
        "description": "PHIÊN BẢN HIỆN TẠI CỦA TAG MOD: V1.2.5\n\nTrải nghiệm GDT như chưa từng có với bản nâng cấp toàn diện về giao diện người dùng. TAG Mod cũng bổ sung các tính năng và thông tin chi tiết để cung cấp cho bạn bức tranh đầy đủ hơn về hoạt động của công ty.",
        "main": "Main.js",
        "folder": "./mods/TAG_Mod",
        "image": "TM-Square-Logo-DM-Thumbnail.png"
    }
    // Thêm các mod khác vào đây
];