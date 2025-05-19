import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";

const MODEL_NAME = "gemini-1.5-flash";
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string || "AIzaSyCBJlfHz5S-Ny47JQO5djOBOk9VoppIoV8"; // Update with your API key

export async function generateChatResponse(prompt: string): Promise<string> {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const safetySettings = [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
    ];
    const model = genAI.getGenerativeModel({ model: MODEL_NAME, safetySettings });

    const generationConfig = {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
        responseMimeType: "application/json",
    };
    // Assume the chat history is stored in localStorage

    // Kiểm tra nếu chatHistory vượt quá 100 phần tử
    const chat = model.startChat({
        generationConfig,

        history: [
            {
                role: "user",
                parts: [
                    { text: "Khi Gemini nhận vào 1 chuỗi JSON tên anime bất kỳ thì sẽ tạo ra các tiêu đề video youtube thích hợp cho anime đó. Xuất ra với định dạng theo id" },
                ],
            },
            {
                role: "model",
                parts: [
                    { text: "{\"anime_titles\": [{\"id\": 1, \"title\": \"Top 10 Moments That Prove [Anime Name] Is The Best Anime\"}, {\"id\": 2, \"title\": \"[Anime Name] - The Ultimate Fan Guide\"}, {\"id\": 3, \"title\": \"[Anime Name] - Every Character Ranked From Worst To Best\"}, {\"id\": 4, \"title\": \"[Anime Name] - The Saddest Anime Moments That Will Make You Cry\"}, {\"id\": 5, \"title\": \"[Anime Name] - The Funniest Moments You'll Ever See\"}, {\"id\": 6, \"title\": \"[Anime Name] -  The Most Epic Battles\"}, {\"id\": 7, \"title\": \"Why You Should Watch [Anime Name]\"}, {\"id\": 8, \"title\": \"[Anime Name] - The Hidden Details You Missed\"}, {\"id\": 9, \"title\": \"[Anime Name] - The Ultimate Theory Explained\"}, {\"id\": 10, \"title\": \"[Anime Name] - All The Times The Anime Made You Feel [Emotion]\"}], \"other_titles\": [{\"id\": 1, \"title\": \"[Anime Name] - Opening Theme Song\"}, {\"id\": 2, \"title\": \"[Anime Name] - Ending Theme Song\"}, {\"id\": 3, \"title\": \"[Anime Name] -  [Character Name] Fan Animation\"}, {\"id\": 4, \"title\": \"[Anime Name] -  [Character Name]  Amv\"}, {\"id\": 5, \"title\": \"[Anime Name] -  [Character Name]  Montage\"}]}\n" },
                ],
            },
            {
                role: "user",
                parts: [
                    { text: "Tiêu đề tiếng việt nhe" },
                ],
            },
            {
                role: "model",
                parts: [
                    { text: "{\"anime_titles\": [{\"id\": 1, \"title\": \"Top 10 Khoảnh Khắc Chứng Minh [Tên Anime] Là Anime Hay Nhất\"}, {\"id\": 2, \"title\": \"[Tên Anime] -  Hướng Dẫn Hoàn Chỉnh Cho Fan\"}, {\"id\": 3, \"title\": \"[Tên Anime] - Xếp Hạng Tất Cả Nhân Vật Từ Tệ Nhất Đến Hay Nhất\"}, {\"id\": 4, \"title\": \"[Tên Anime] - Những Khoảnh Khắc Buồn Nhất Sẽ Khiến Bạn Khóc\"}, {\"id\": 5, \"title\": \"[Tên Anime] -  Những Khoảnh Khắc Hài Hước Nhất Mà Bạn Từng Thấy\"}, {\"id\": 6, \"title\": \"[Tên Anime] -  Những Trận Chiến Huyền Thoại Nhất\"}, {\"id\": 7, \"title\": \"Tại Sao Bạn Nên Xem [Tên Anime]\"}, {\"id\": 8, \"title\": \"[Tên Anime] - Những Chi Tiết Bí Mật Mà Bạn Bỏ Lỡ\"}, {\"id\": 9, \"title\": \"[Tên Anime] -  Lý Thuyết Hoàn Chỉnh Được Giải Thích\"}, {\"id\": 10, \"title\": \"[Tên Anime] - Tất Cả Những Lần Anime Khiến Bạn Cảm Thấy [Cảm Xúc]\"}], \"other_titles\": [{\"id\": 1, \"title\": \"[Tên Anime] - Bài Hát Mở Đầu\"}, {\"id\": 2, \"title\": \"[Tên Anime] - Bài Hát Kết Thúc\"}, {\"id\": 3, \"title\": \"[Tên Anime] -  [Tên Nhân Vật]  Hoạt Hình Fan\"}, {\"id\": 4, \"title\": \"[Tên Anime] -  [Tên Nhân Vật]  Amv\"}, {\"id\": 5, \"title\": \"[Tên Anime] -  [Tên Nhân Vật]  Montage\"}]}\n\n" },
                ],
            },
            {
                role: "user",
                parts: [
                    { text: "Mỗi 1 anime chỉ tạo 1 tiêu đề thôi nhe" },
                ],
            },
            {
                role: "model",
                parts: [
                    { text: "{\"anime_titles\": [{\"id\": 1, \"title\": \"Top 10 Khoảnh Khắc Chứng Minh [Tên Anime] Là Anime Hay Nhất\"}], \"other_titles\": [{\"id\": 1, \"title\": \"[Tên Anime] -  [Tên Nhân Vật]  Amv\"}]}\n\n" },
                ],
            },
            {
                role: "user",
                parts: [
                    { text: "[\"Ore dake Level Up na Ken\",\"Youkoso Jitsuryoku Shijou Shugi no Kyoushitsu e 3rd Season\",\"Mashle: Shinkakusha Kouho Senbatsu Shiken-hen\",\"Dungeon Meshi\",\"Tsuki ga Michibiku Isekai Douchuu 2nd Season\",\"Yubisaki to Renren\",\"Chiyu Mahou no Machigatta Tsukaikata\",\"Boku no Kokoro no Yabai Yatsu 2nd Season\",\"Mato Seihei no Slave\",\"Dosanko Gal wa Namara Menkoi\"]" },
                ],
            },
            {
                role: "model",
                parts: [
                    { text: "{\"anime_titles\": [{\"id\": 1, \"title\": \"Top 10 Khoảnh Khắc Chứng Minh Ore dake Level Up na Ken Là Anime Hay Nhất\"}, {\"id\": 2, \"title\": \"Top 10 Khoảnh Khắc Chứng Minh Youkoso Jitsuryoku Shijou Shugi no Kyoushitsu e 3rd Season Là Anime Hay Nhất\"}, {\"id\": 3, \"title\": \"Top 10 Khoảnh Khắc Chứng Minh Mashle: Shinkakusha Kouho Senbatsu Shiken-hen Là Anime Hay Nhất\"}, {\"id\": 4, \"title\": \"Top 10 Khoảnh Khắc Chứng Minh Dungeon Meshi Là Anime Hay Nhất\"}, {\"id\": 5, \"title\": \"Top 10 Khoảnh Khắc Chứng Minh Tsuki ga Michibiku Isekai Douchuu 2nd Season Là Anime Hay Nhất\"}, {\"id\": 6, \"title\": \"Top 10 Khoảnh Khắc Chứng Minh Yubisaki to Renren Là Anime Hay Nhất\"}, {\"id\": 7, \"title\": \"Top 10 Khoảnh Khắc Chứng Minh Chiyu Mahou no Machigatta Tsukaikata Là Anime Hay Nhất\"}, {\"id\": 8, \"title\": \"Top 10 Khoảnh Khắc Chứng Minh Boku no Kokoro no Yabai Yatsu 2nd Season Là Anime Hay Nhất\"}, {\"id\": 9, \"title\": \"Top 10 Khoảnh Khắc Chứng Minh Mato Seihei no Slave Là Anime Hay Nhất\"}, {\"id\": 10, \"title\": \"Top 10 Khoảnh Khắc Chứng Minh Dosanko Gal wa Namara Menkoi Là Anime Hay Nhất\"}], \"other_titles\": [{\"id\": 1, \"title\": \"Ore dake Level Up na Ken - [Tên Nhân Vật] Amv\"}, {\"id\": 2, \"title\": \"Youkoso Jitsuryoku Shijou Shugi no Kyoushitsu e 3rd Season - [Tên Nhân Vật] Amv\"}, {\"id\": 3, \"title\": \"Mashle: Shinkakusha Kouho Senbatsu Shiken-hen - [Tên Nhân Vật] Amv\"}, {\"id\": 4, \"title\": \"Dungeon Meshi - [Tên Nhân Vật] Amv\"}, {\"id\": 5, \"title\": \"Tsuki ga Michibiku Isekai Douchuu 2nd Season - [Tên Nhân Vật] Amv\"}, {\"id\": 6, \"title\": \"Yubisaki to Renren - [Tên Nhân Vật] Amv\"}, {\"id\": 7, \"title\": \"Chiyu Mahou no Machigatta Tsukaikata - [Tên Nhân Vật] Amv\"}, {\"id\": 8, \"title\": \"Boku no Kokoro no Yabai Yatsu 2nd Season - [Tên Nhân Vật] Amv\"}, {\"id\": 9, \"title\": \"Mato Seihei no Slave - [Tên Nhân Vật] Amv\"}, {\"id\": 10, \"title\": \"Dosanko Gal wa Namara Menkoi - [Tên Nhân Vật] Amv\"}]}\n" },
                ],
            },
            {
                role: "user",
                parts: [
                    { text: "tiêu đề phải đa dạng phong cách, viết theo nhiều kiểu khác và không trùng nhau" },
                ],
            },
            {
                role: "model",
                parts: [
                    { text: "{\"anime_titles\": [{\"id\": 1, \"title\": \"Level Up Siêu Phàm:  Ore dake Level Up na Ken -  Review & Phân Tích\"}, {\"id\": 2, \"title\": \"Bạn Muốn Thử Thách? Youkoso Jitsuryoku Shijou Shugi no Kyoushitsu e 3rd Season -  Phân Tích & Cảm Nhận\"}, {\"id\": 3, \"title\": \"Mashle: Shinkakusha Kouho Senbatsu Shiken-hen - Ma Thuật VS Sức Mạnh - Ai Sẽ Chiến Thắng?\"}, {\"id\": 4, \"title\": \"Dungeon Meshi -  Hành Trình Lạ Lùng Trong Thế Giới Ngầm\"}, {\"id\": 5, \"title\": \"Tsuki ga Michibiku Isekai Douchuu 2nd Season - Hành Trình Tìm Kiếm Ánh Sáng\"}, {\"id\": 6, \"title\": \"Yubisaki to Renren:  Sự Thật Về Tình Yêu - Phân Tích & Bàn Luận\"}, {\"id\": 7, \"title\": \"Chiyu Mahou no Machigatta Tsukaikata - Ma Pháp Hồi Phục Lạ Lùng - Phân Tích & Cảm Nhận\"}, {\"id\": 8, \"title\": \"Boku no Kokoro no Yabai Yatsu 2nd Season - Bí Mật Của Trái Tim - Phân Tích & Cảm Nhận\"}, {\"id\": 9, \"title\": \"Mato Seihei no Slave -  Hành Trình Của Nô Lệ - Phân Tích & Bàn Luận\"}, {\"id\": 10, \"title\": \"Dosanko Gal wa Namara Menkoi -  Sự Hấp Dẫn Của Cô Gái Miền Bắc - Phân Tích & Cảm Nhận\"}], \"other_titles\": [{\"id\": 1, \"title\": \"Ore dake Level Up na Ken -  [Tên Nhân Vật] -  AMV Epic\"}, {\"id\": 2, \"title\": \"Youkoso Jitsuryoku Shijou Shugi no Kyoushitsu e 3rd Season -  [Tên Nhân Vật] -  Hành Trình Vượt Qua Giới Hạn\"}, {\"id\": 3, \"title\": \"Mashle: Shinkakusha Kouho Senbatsu Shiken-hen - [Tên Nhân Vật] -  Sức Mạnh Bí Ẩn\"}, {\"id\": 4, \"title\": \"Dungeon Meshi - [Tên Nhân Vật] -  Phiêu Lưu Trong Thế Giới Ngầm\"}, {\"id\": 5, \"title\": \"Tsuki ga Michibiku Isekai Douchuu 2nd Season - [Tên Nhân Vật] -  Hành Trình Tìm Kiếm\"}, {\"id\": 6, \"title\": \"Yubisaki to Renren -  [Tên Nhân Vật] -  Tình Yêu Diệu Kỳ\"}, {\"id\": 7, \"title\": \"Chiyu Mahou no Machigatta Tsukaikata - [Tên Nhân Vật] -  Ma Pháp Hồi Phục Kỳ Diệu\"}, {\"id\": 8, \"title\": \"Boku no Kokoro no Yabai Yatsu 2nd Season - [Tên Nhân Vật] -  Bí Mật Của Trái Tim\"}, {\"id\": 9, \"title\": \"Mato Seihei no Slave -  [Tên Nhân Vật] -  Hành Trình Nô Lệ\"}, {\"id\": 10, \"title\": \"Dosanko Gal wa Namara Menkoi - [Tên Nhân Vật] -  Sự Hấp Dẫn Của Cô Gái Miền Bắc\"}]}\n" },
                ],
            },
            {
                role: "user",
                parts: [
                    { text: "bỏ mấy cái như [Tên nhân vật] hay bất kỳ những gì tương tự" },
                ],
            },
            {
                role: "model",
                parts: [
                    { text: "{\"anime_titles\": [{\"id\": 1, \"title\": \"Level Up Siêu Phàm:  Ore dake Level Up na Ken -  Review & Phân Tích\"}, {\"id\": 2, \"title\": \"Bạn Muốn Thử Thách? Youkoso Jitsuryoku Shijou Shugi no Kyoushitsu e 3rd Season -  Phân Tích & Cảm Nhận\"}, {\"id\": 3, \"title\": \"Mashle: Shinkakusha Kouho Senbatsu Shiken-hen - Ma Thuật VS Sức Mạnh - Ai Sẽ Chiến Thắng?\"}, {\"id\": 4, \"title\": \"Dungeon Meshi -  Hành Trình Lạ Lùng Trong Thế Giới Ngầm\"}, {\"id\": 5, \"title\": \"Tsuki ga Michibiku Isekai Douchuu 2nd Season - Hành Trình Tìm Kiếm Ánh Sáng\"}, {\"id\": 6, \"title\": \"Yubisaki to Renren:  Sự Thật Về Tình Yêu - Phân Tích & Bàn Luận\"}, {\"id\": 7, \"title\": \"Chiyu Mahou no Machigatta Tsukaikata - Ma Pháp Hồi Phục Lạ Lùng - Phân Tích & Cảm Nhận\"}, {\"id\": 8, \"title\": \"Boku no Kokoro no Yabai Yatsu 2nd Season - Bí Mật Của Trái Tim - Phân Tích & Cảm Nhận\"}, {\"id\": 9, \"title\": \"Mato Seihei no Slave -  Hành Trình Của Nô Lệ - Phân Tích & Bàn Luận\"}, {\"id\": 10, \"title\": \"Dosanko Gal wa Namara Menkoi -  Sự Hấp Dẫn Của Cô Gái Miền Bắc - Phân Tích & Cảm Nhận\"}], \"other_titles\": [{\"id\": 1, \"title\": \"Ore dake Level Up na Ken -  AMV Epic\"}, {\"id\": 2, \"title\": \"Youkoso Jitsuryoku Shijou Shugi no Kyoushitsu e 3rd Season -  Hành Trình Vượt Qua Giới Hạn\"}, {\"id\": 3, \"title\": \"Mashle: Shinkakusha Kouho Senbatsu Shiken-hen -  Sức Mạnh Bí Ẩn\"}, {\"id\": 4, \"title\": \"Dungeon Meshi -  Phiêu Lưu Trong Thế Giới Ngầm\"}, {\"id\": 5, \"title\": \"Tsuki ga Michibiku Isekai Douchuu 2nd Season -  Hành Trình Tìm Kiếm\"}, {\"id\": 6, \"title\": \"Yubisaki to Renren -  Tình Yêu Diệu Kỳ\"}, {\"id\": 7, \"title\": \"Chiyu Mahou no Machigatta Tsukaikata -  Ma Pháp Hồi Phục Kỳ Diệu\"}, {\"id\": 8, \"title\": \"Boku no Kokoro no Yabai Yatsu 2nd Season -  Bí Mật Của Trái Tim\"}, {\"id\": 9, \"title\": \"Mato Seihei no Slave -  Hành Trình Nô Lệ\"}, {\"id\": 10, \"title\": \"Dosanko Gal wa Namara Menkoi -  Sự Hấp Dẫn Của Cô Gái Miền Bắc\"}]}\n\n" },
                ],
            },
            {
                role: "user",
                parts: [
                    { text: "1 anime chỉ 1 tiêu đề" },
                ],
            },
            {
                role: "model",
                parts: [
                    { text: "{\"anime_titles\": [{\"id\": 1, \"title\": \"Level Up Siêu Phàm:  Ore dake Level Up na Ken -  Review & Phân Tích\"}, {\"id\": 2, \"title\": \"Bạn Muốn Thử Thách? Youkoso Jitsuryoku Shijou Shugi no Kyoushitsu e 3rd Season -  Phân Tích & Cảm Nhận\"}, {\"id\": 3, \"title\": \"Mashle: Shinkakusha Kouho Senbatsu Shiken-hen - Ma Thuật VS Sức Mạnh - Ai Sẽ Chiến Thắng?\"}, {\"id\": 4, \"title\": \"Dungeon Meshi -  Hành Trình Lạ Lùng Trong Thế Giới Ngầm\"}, {\"id\": 5, \"title\": \"Tsuki ga Michibiku Isekai Douchuu 2nd Season - Hành Trình Tìm Kiếm Ánh Sáng\"}, {\"id\": 6, \"title\": \"Yubisaki to Renren:  Sự Thật Về Tình Yêu - Phân Tích & Bàn Luận\"}, {\"id\": 7, \"title\": \"Chiyu Mahou no Machigatta Tsukaikata - Ma Pháp Hồi Phục Lạ Lùng - Phân Tích & Cảm Nhận\"}, {\"id\": 8, \"title\": \"Boku no Kokoro no Yabai Yatsu 2nd Season - Bí Mật Của Trái Tim - Phân Tích & Cảm Nhận\"}, {\"id\": 9, \"title\": \"Mato Seihei no Slave -  Hành Trình Của Nô Lệ - Phân Tích & Bàn Luận\"}, {\"id\": 10, \"title\": \"Dosanko Gal wa Namara Menkoi -  Sự Hấp Dẫn Của Cô Gái Miền Bắc - Phân Tích & Cảm Nhận\"}], \"other_titles\": [{\"id\": 1, \"title\": \"Ore dake Level Up na Ken -  AMV Epic\"}]}\n" },
                ],
            },
            {
                role: "user",
                parts: [
                    { text: "bỏ other_title đi" },
                ],
            },
            {
                role: "model",
                parts: [
                    { text: "{\"anime_titles\": [{\"id\": 1, \"title\": \"Level Up Siêu Phàm:  Ore dake Level Up na Ken -  Review & Phân Tích\"}, {\"id\": 2, \"title\": \"Bạn Muốn Thử Thách? Youkoso Jitsuryoku Shijou Shugi no Kyoushitsu e 3rd Season -  Phân Tích & Cảm Nhận\"}, {\"id\": 3, \"title\": \"Mashle: Shinkakusha Kouho Senbatsu Shiken-hen - Ma Thuật VS Sức Mạnh - Ai Sẽ Chiến Thắng?\"}, {\"id\": 4, \"title\": \"Dungeon Meshi -  Hành Trình Lạ Lùng Trong Thế Giới Ngầm\"}, {\"id\": 5, \"title\": \"Tsuki ga Michibiku Isekai Douchuu 2nd Season - Hành Trình Tìm Kiếm Ánh Sáng\"}, {\"id\": 6, \"title\": \"Yubisaki to Renren:  Sự Thật Về Tình Yêu - Phân Tích & Bàn Luận\"}, {\"id\": 7, \"title\": \"Chiyu Mahou no Machigatta Tsukaikata - Ma Pháp Hồi Phục Lạ Lùng - Phân Tích & Cảm Nhận\"}, {\"id\": 8, \"title\": \"Boku no Kokoro no Yabai Yatsu 2nd Season - Bí Mật Của Trái Tim - Phân Tích & Cảm Nhận\"}, {\"id\": 9, \"title\": \"Mato Seihei no Slave -  Hành Trình Của Nô Lệ - Phân Tích & Bàn Luận\"}, {\"id\": 10, \"title\": \"Dosanko Gal wa Namara Menkoi -  Sự Hấp Dẫn Của Cô Gái Miền Bắc - Phân Tích & Cảm Nhận\"}]}\n\n" },
                ],
            },
        ], // Load chat history from localStorage
    });

    const result = await chat.sendMessage(prompt);
    const response = result.response;

    return response.text();
}
