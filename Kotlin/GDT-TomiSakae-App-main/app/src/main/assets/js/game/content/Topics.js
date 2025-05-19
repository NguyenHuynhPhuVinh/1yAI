"use strict";

// Đối tượng Topics chứa danh sách các chủ đề (topics) có thể có trong game.
// Mỗi chủ đề định nghĩa sự phù hợp của nó với các thể loại game, đối tượng người chơi,
// và có thể ghi đè các hệ số cho từng nhiệm vụ phát triển cụ thể.
var Topics = {};

// Mảng chứa tất cả các đối tượng chủ đề game.
Topics.topics = [
    {
        id: "Sports", // ID duy nhất của chủ đề
        name: "Sports".localize("game topic"), // Tên hiển thị của chủ đề, có hỗ trợ đa ngôn ngữ
        // genreWeightings: Mảng 11 số, thể hiện mức độ phù hợp của chủ đề này với 11 thể loại game chính 
        // (theo thứ tự: Action, Adventure, RPG, Simulation, Strategy, Casual, VisualNovel, Sandbox, MOBA, BattleRoyale, Racing).
        // Giá trị càng gần 1 thì càng phù hợp.
        genreWeightings: [1, 0.6, 0.6, 1, 0.7, 1, 0.5, 0.8, 0.9, 0.8, 1.0],
        // audienceWeightings: Mảng 3 số, thể hiện mức độ phù hợp với 3 nhóm đối tượng (theo thứ tự: Young, Everyone, Mature).
        audienceWeightings: [1, 1, 0.8],
        // missionOverrides: Ghi đè hệ số phù hợp thể loại cho từng nhiệm vụ (mission) cụ thể.
        // Mảng ngoài tương ứng với 11 thể loại. Mảng trong tương ứng với 9 missions.
        // Giá trị 0 nghĩa là không ghi đè, sử dụng giá trị từ genreWeightings chung của topic hoặc mission.
        missionOverrides: [
            // Ví dụ cho thể loại Action khi kết hợp với topic Sports:
            // [Engine, Gameplay, Story/Quests, Dialogs, Level Design, AI, World Design, Graphic, Sound]
            [0.9, 1, 0, 0.7, 0.8, 1, 0.6, 0, 0], // Ghi đè cho thể loại 1 (Action)
            [0, 0.9, 0, 0, 0.9, 0, 0, 0, 0],     // Ghi đè cho thể loại 2 (Adventure)
            [0, 1, 0.9, 0, 0, 0, 0.7, 1, 0.9],     // RPG
            [0, 0, 0, 0.8, 0, 0, 0.7, 0, 0],       // Simulation
            [0.8, 1, 0.9, 0, 0, 0, 0.8, 1, 0.9],   // Strategy
            [0, 0, 0, 0, 0, 0, 0, 0, 0],           // Casual
            [0, 0.6, 0.8, 0.8, 0, 0, 0.5, 0.6, 0.7], // Visual Novel
            [0, 0.8, 0.7, 0, 0.9, 0, 0.8, 0, 0],     // Sandbox
            [0, 1, 0.7, 0.7, 0, 0.9, 0, 0, 0],       // MOBA
            [0, 0.9, 0.6, 0, 0, 0.9, 0, 0, 0],       // Battle Royale
            [0, 0, 0, 0, 0.9, 0, 0, 0.9, 0.9]         // Racing
        ]
    },
    {
        id: "Military",
        name: "Military".localize("game topic"),
        genreWeightings: [1, 0.6, 0.8, 1, 1, 0.6, 0.6, 0.8, 0.9, 1.0, 0.7],
        audienceWeightings: [0.7, 0.9, 1]
    },
    {
        id: "Medieval",
        name: "Medieval".localize("game topic"),
        genreWeightings: [1, 1, 1, 0.8, 1, 0.7, 0.8, 0.9, 0.8, 0.7, 0.6],
        audienceWeightings: [1, 1, 0.9]
    },
    // ... (các chủ đề khác tương tự) ...
    {
        id: "Space",
        name: "Space".localize("game topic"),
        genreWeightings: [1, 0.8, 0.6, 1, 1, 0.7, 0.7, 0.9, 0.8, 0.8, 0.9],
        audienceWeightings: [0.8, 1, 1]
    },
    {
        id: "Racing",
        name: "Racing".localize("game topic"),
        genreWeightings: [0.9, 0.6, 0.8, 1, 0.7, 1, 0.6, 0.7, 0.6, 0.7, 1.0],
        audienceWeightings: [1, 1, 0.9],
        missionOverrides: [
            [0, 0, 0, 0, 0, 0, 0.7, 0.9, 1],
            [0, 0.9, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0.7, 0.9, 1],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0.6, 0.7, 0.6, 0, 0, 0.6, 0.8, 0.7],  // Visual Novel
            [0, 0.7, 0, 0, 0.8, 0, 0.7, 0, 0],        // Sandbox
            [0, 0.7, 0, 0, 0, 0, 0, 0, 0],            // MOBA
            [0, 0.7, 0, 0, 0, 0, 0, 0, 0],            // Battle Royale
            [0, 0, 0, 0, 0.9, 0, 0.8, 1.0, 1.0]        // Racing (phù hợp cao với Graphics và Sound)
        ]
    },
    {
        id: "Fantasy",
        name: "Fantasy".localize("game topic"),
        genreWeightings: [1, 1, 1, 0.8, 1, 0.6, 1.0, 0.9, 0.9, 0.8, 0.6],
        audienceWeightings: [1, 1, 1]
    },
    {
        id: "Pirate",
        name: "Pirate".localize("game topic"),
        genreWeightings: [0.8, 1, 0.9, 0.9, 0.7, 0.8, 0.8, 0.9, 0.7, 0.8, 0.7],
        audienceWeightings: [1, 1, 0.8]
    },
    {
        id: "Sci-Fi",
        name: "Sci-Fi".localize("game topic"),
        genreWeightings: [1, 1, 1, 1, 1, 0.8, 0.9, 1.0, 0.9, 0.9, 0.8],
        audienceWeightings: [0.8, 1, 1]
    },
    {
        id: "Airplane",
        name: "Airplane".localize("game topic"),
        genreWeightings: [1, 0.6, 0.8, 1, 1, 1, 0.5, 0.8, 0.6, 0.7, 1.0],
        audienceWeightings: [1, 1, 0.9]
    },
    {
        id: "Dungeon",
        name: "Dungeon".localize("game topic"),
        genreWeightings: [1, 0.8, 1, 1, 1, 0.6, 0.7, 1.0, 0.8, 0.9, 0.6],
        audienceWeightings: [0.8, 1, 1]
    },
    {
        id: "Mystery",
        name: "Mystery".localize("game topic"),
        genreWeightings: [0.6, 1, 1, 0.8, 0.6, 0.8, 1.0, 0.7, 0.6, 0.7, 0.6],
        audienceWeightings: [0.8, 0.9, 1],
        missionOverrides: [
            [0.9, 0.8, 1, 0.9, 1, 0.8, 1, 0.8, 0.9],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0.8, 1, 0.9, 0.8, 1, 0.9, 1, 0.8, 0.9],
            [0.8, 1, 0.9, 0.8, 1, 0.9, 1, 0.8, 0.9],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0.7, 0.8, 1.0, 1.0, 0, 0, 0.9, 0.9, 1.0],  // Visual Novel
            [0.7, 0.7, 0.9, 0.9, 0.8, 0, 0.9, 0, 0],         // Sandbox
            [0, 0, 0, 0, 0, 0, 0, 0, 0],                     // MOBA
            [0, 0, 0, 0, 0, 0, 0, 0, 0],                     // Battle Royale
            [0, 0, 0, 0, 0, 0, 0, 0, 0]                      // Racing
        ]
    },
    {
        id: "Martial Arts",
        name: "Martial Arts".localize("game topic"),
        genreWeightings: [1, 0.8, 1, 1, 0.7, 1, 0.7, 0.8, 0.9, 0.8, 0.7],
        audienceWeightings: [0.7, 0.9, 1]
    },
    {
        id: "History",
        name: "History".localize("game topic"),
        genreWeightings: [0.8, 0.8, 0.8, 1, 1, 0.9, 0.8, 0.9, 0.7, 0.7, 0.8],
        audienceWeightings: [0.8, 1, 0.9]
    },
    {
        id: "Horror",
        name: "Horror".localize("game topic"),
        genreWeightings: [1, 1, 0.8, 0.6, 0.7, 0.8, 0.9, 0.9, 0.7, 0.9, 0.6],
        audienceWeightings: [0.6, 0.9, 1],
        missionOverrides: [
            [0, 0, 0, 0.7, 1, 0.9, 0.9, 0.8, 1],
            [0, 0, 0, 0, 0, 0, 0.7, 0.9, 1],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0.7, 1.0, 1.0, 0, 0, 0.9, 0.9, 1.0],  // Visual Novel
            [0, 0.8, 0.9, 0, 0.9, 0, 0.9, 0, 0],       // Sandbox
            [0, 0, 0, 0, 0, 0, 0, 0, 0],               // MOBA
            [0, 0, 0, 0, 0, 0, 0.9, 0.9, 0.9],         // Battle Royale
            [0, 0, 0, 0, 0, 0, 0, 0, 0]                // Racing
        ]
    },
    {
        id: "Business",
        name: "Business".localize("game topic"),
        genreWeightings: [0.6, 0.8, 0.8, 1, 1, 0.6, 0.7, 0.8, 0.6, 0.6, 0.7],
        audienceWeightings: [0.9, 1, 0.7]
    },
    {
        id: "Transport",
        name: "Transport".localize("game topic"),
        genreWeightings: [0.6, 0.6, 0.6, 1, 1, 0.6, 0.5, 0.9, 0.6, 0.6, 0.9],
        audienceWeightings: [0.9, 1, 0.7]
    },
    {
        id: "Comedy",
        name: "Comedy".localize("game topic"),
        genreWeightings: [0.6, 1, 0.8, 0.6, 0.6, 1, 0.9, 0.8, 0.7, 0.8, 0.8],
        audienceWeightings: [0.8, 0.9, 1]
    },
    {
        id: "Ninja",
        name: "Ninja".localize("game topic"),
        genreWeightings: [1, 0.8, 0.8, 0.6, 0.8, 0.9, 0.7, 0.8, 0.9, 0.9, 0.7],
        audienceWeightings: [1, 0.9, 0.9]
    },
    {
        id: "Romance",
        name: "Romance".localize("game topic"),
        genreWeightings: [0.6, 1, 0.8, 0.9, 0.6, 0.9, 1.0, 0.7, 0.6, 0.6, 0.7],
        audienceWeightings: [0.8, 1, 1]
    },
    {
        id: "Movies",
        name: "Movies".localize("game topic"),
        genreWeightings: [0.8, 0.8, 0.6, 1, 0.6, 1, 0.8, 0.8, 0.7, 0.7, 0.8],
        audienceWeightings: [0.9, 1, 0.9]
    },
    {
        id: "Spy",
        name: "Spy".localize("game topic"),
        genreWeightings: [1, 1, 1, 0.8, 0.7, 0.8, 0.8, 0.8, 0.7, 0.9, 0.8],
        audienceWeightings: [0.8, 0.9, 1]
    },
    {
        id: "Detective",
        name: "Detective".localize("game topic"),
        genreWeightings: [0.6, 1, 1, 0.8, 0.6, 0.9, 1.0, 0.7, 0.6, 0.7, 0.7],
        audienceWeightings: [0.9, 1, 0.8],
        missionOverrides: [
            [0.9, 0.8, 1, 0.9, 1, 0.8, 1, 0.8, 0.9],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0.8, 1, 0.9, 0.8, 1, 0.9, 1, 0.8, 0.9],
            [0.8, 1, 0.9, 0.8, 1, 0.9, 1, 0.8, 0.9],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0.7, 0.8, 1.0, 1.0, 0.9, 0.7, 0.9, 0.8, 0.9],  // Visual Novel
            [0.7, 0.7, 0.9, 0.9, 0.8, 0, 0.9, 0, 0],         // Sandbox
            [0, 0, 0, 0, 0, 0, 0, 0, 0],                     // MOBA
            [0, 0, 0, 0, 0, 0, 0, 0, 0],                     // Battle Royale
            [0, 0, 0, 0, 0, 0, 0, 0, 0]                      // Racing
        ]
    },
    {
        id: "Cyberpunk",
        name: "Cyberpunk".localize("game topic"),
        genreWeightings: [1, 0.8, 1, 0.8, 0.7, 0.6, 0.9, 0.9, 0.8, 0.9, 0.8],
        audienceWeightings: [0.7, 0.9, 1],
        missionOverrides: [
            [1, 0.8, 0.9, 0.8, 1, 0.9, 1, 0.9, 0.8],     // Action
            [0, 0, 0, 0, 0, 0, 1, 0.9, 0.8],              // Adventure
            [0, 0, 0, 0, 0, 0, 0, 0, 0],                  // RPG
            [0, 0, 0, 0, 0, 0, 1, 0, 0],                  // Simulation
            [0, 0, 0, 0, 0, 0, 1, 0, 0],                  // Strategy
            [0, 0, 0, 0, 0, 0, 1, 0, 0],                  // Casual
            [0.8, 0.7, 1.0, 0.9, 0, 0, 1.0, 0.9, 0.8],    // Visual Novel
            [0.9, 0.8, 0.9, 0.8, 0.7, 0.6, 0.9, 0.8, 0.9], // Sandbox
            [0.7, 0.8, 0.9, 0.7, 0.8, 0.6, 0.8, 0.7, 0.8], // MOBA
            [0.9, 0.8, 0.9, 0.7, 0.8, 0.6, 0.9, 0.8, 0.7], // Battle Royale
            [0.8, 0.7, 0.8, 0.6, 0.7, 0.5, 0.8, 0.7, 0.6]  // Racing
        ]
    },
    {
        id: "UFO",
        name: "UFO".localize("game topic"),
        genreWeightings: [1, 0.8, 0.6, 0.8, 1, 0.8, 0.7, 0.9, 0.8, 0.8, 0.7],
        audienceWeightings: [0.8, 1, 0.9]
    },
    {
        id: "Hospital",
        name: "Hospital".localize("game topic"),
        genreWeightings: [0.6, 0.6, 0.8, 1, 0.8, 0.7, 0.8, 0.7, 0.6, 0.7, 0.8],
        audienceWeightings: [0.7, 1, 0.8]
    },
    {
        id: "Evolution",
        name: "Evolution".localize("game topic"),
        genreWeightings: [0.7, 0.6, 0.6, 1, 1, 0.6, 0.6, 0.8, 0.7, 0.7, 0.7],
        audienceWeightings: [0.8, 1, 0.7]
    },
    {
        id: "Time Travel",
        name: "Time Travel".localize("game topic"),
        genreWeightings: [0.9, 1, 1, 0.7, 0.6, 0.7, 0.9, 0.8, 0.7, 0.8, 0.7],
        audienceWeightings: [0.9, 1, 0.8]
    },
    {
        id: "Life",
        name: "Life".localize("game topic"),
        genreWeightings: [0.6, 1, 0.9, 1, 0.6, 0.8, 0.9, 0.9, 0.7, 0.7, 0.8],
        audienceWeightings: [1, 1, 0.8]
    },
    {
        id: "Virtual Pet",
        name: "Virtual Pet".localize("game topic"),
        genreWeightings: [0.6, 0.8, 0.9, 1, 0.9, 1, 0.8, 0.8, 0.7, 0.7, 0.8],
        audienceWeightings: [1, 0.8, 0.7]
    },
    {
        id: "Vocabulary",
        name: "Vocabulary".localize("game topic"),
        genreWeightings: [0.6, 0.6, 0.6, 1, 1, 1, 0.7, 0.7, 0.6, 0.6, 0.7],
        audienceWeightings: [0.9, 1, 0.6]
    },
    {
        id: "Hunting",
        name: "Hunting".localize("game topic"),
        genreWeightings: [1, 0.9, 0.9, 1, 0.7, 0.9, 0.6, 0.9, 0.7, 0.8, 0.8],
        audienceWeightings: [0.8, 0.9, 1]
    },
    {
        id: "Law",
        name: "Law".localize("game topic"),
        genreWeightings: [0.6, 1, 0.9, 0.9, 0.9, 0.6, 0.7, 0.8, 0.7, 0.7, 0.7],
        audienceWeightings: [0.8, 1, 0.7],
        missionOverrides: [
            [0, 0, 0, 1, 0.8, 0.9, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0.8, 0.9, 1, 1, 0.8, 0.9, 1, 0.8, 0.9],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 0.9, 0, 0, 0, 0],
            [0.7, 0.8, 1.0, 1.0, 0.9, 0.7, 0.9, 0.8, 0.9],  // Visual Novel
            [0.7, 0.7, 0.9, 0.9, 0.8, 0, 0.9, 0, 0],         // Sandbox
            [0, 0, 0, 0, 0, 0, 0, 0, 0],                     // MOBA
            [0, 0, 0, 0, 0, 0, 0, 0, 0],                     // Battle Royale
            [0, 0, 0, 0, 0, 0, 0, 0, 0]                      // Racing
        ]
    },
    {
        id: "Game Dev",
        name: "Game Dev".localize("game topic"),
        genreWeightings: [0.6, 0.7, 0.6, 1, 0.6, 0.8, 0.7, 0.9, 0.7, 0.7, 0.8],
        audienceWeightings: [0.9, 1, 0.7]
    },
    {
        id: "City",
        name: "City".localize("game topic"),
        genreWeightings: [0.7, 0.6, 0.7, 1, 1, 0.7, 0.8, 1.0, 0.6, 0.7, 0.8],
        audienceWeightings: [0.9, 1, 0.8]
    },
    {
        id: "School",
        name: "School".localize("game topic"),
        genreWeightings: [0.8, 1, 1, 1, 1, 0.8, 0.9, 0.8, 0.8, 0.7, 0.7],
        audienceWeightings: [1, 0.9, 0.7]
    },
    {
        id: "Fashion",
        name: "Fashion".localize("game topic"),
        genreWeightings: [0.6, 0.8, 1, 1, 0.6, 1, 0.8, 0.7, 0.6, 0.6, 0.7],
        audienceWeightings: [1, 0.8, 0.6]
    },
    {
        id: "Zombies",
        name: "Zombies".localize("game topic"),
        genreWeightings: [1, 0.7, 0.9, 0.7, 0.9, 1, 0.8, 0.9, 0.7, 1.0, 0.7],
        audienceWeightings: [0.9, 0.8, 1]
    },
    {
        id: "Hacking",
        name: "Hacking".localize("game topic"),
        genreWeightings: [0.7, 0.8, 0.7, 1, 1, 0.6, 0.9, 0.8, 0.8, 0.8, 0.7],
        audienceWeightings: [0.7, 0.9, 1]
    },
    {
        id: "Government",
        name: "Government".localize("game topic"),
        genreWeightings: [0.6, 0.6, 0.6, 1, 1, 0.7, 0.8, 0.8, 0.7, 0.7, 0.7],
        audienceWeightings: [0.6, 1, 0.8]
    },
    {
        id: "Prison",
        name: "Prison".localize("game topic"),
        genreWeightings: [1, 1, 0.8, 1, 0.8, 0.6, 0.9, 0.9, 0.7, 0.8, 0.7],
        audienceWeightings: [0.7, 0.9, 1]
    },
    {
        id: "Surgery",
        name: "Surgery".localize("game topic"),
        genreWeightings: [0.8, 0.7, 0.6, 1, 0.7, 0.6, 0.8, 0.7, 0.6, 0.7, 0.7],
        audienceWeightings: [0.8, 1, 0.9]
    },
    {
        id: "Music",
        name: "Music".localize("game topic"),
        genreWeightings: [1, 0.9, 0.6, 1, 0.6, 1, 0.9, 0.8, 0.8, 0.7, 0.9],
        audienceWeightings: [1, 0.9, 0.8],
        missionOverrides: [
            [0, 0, 0, 0, 0, 0, 0.8, 0.9, 1],
            [0, 0, 0, 0, 0, 0, 0.9, 0.8, 1],
            [0, 0, 0, 0, 0, 0, 0.9, 0.8, 1],
            [0, 0, 0, 0, 0, 0, 0.8, 0.9, 1],
            [0, 0, 0, 0, 0, 0, 0.9, 0.8, 1],
            [0, 0, 0, 0, 0, 0, 0.7, 0.9, 1],
            [0.8, 0.9, 1.0, 1.0, 0.9, 0.7, 0.9, 0.8, 0.9],  // Thêm ghi đè cho Visual Novel (phù hợp cao với dialogs và story)
            [0.7, 0.7, 0, 0, 0, 0, 0.8, 0.9, 1.0],           // Sandbox
            [0, 0, 0, 0, 0, 0, 0, 0.8, 1.0],                 // MOBA
            [0, 0, 0, 0, 0, 0, 0, 0.7, 1.0],                 // Battle Royale
            [0, 0, 0, 0, 0, 0, 0, 0.9, 1.0]                  // Racing
        ]
    },
    {
        id: "Rythm", // Lưu ý: có thể là lỗi chính tả, nên là "Rhythm"
        name: "Rhythm".localize("game topic"),
        genreWeightings: [1, 0.7, 0.7, 1, 0.6, 1, 0.8, 0.7, 0.8, 0.7, 1.0],
        audienceWeightings: [1, 0.9, 0.8],
        missionOverrides: [
            [0, 0, 0, 0, 0, 0, 0.8, 0.9, 1],
            [0, 0, 0, 0, 0, 0, 0.9, 0.8, 1],
            [0, 0, 0, 0, 0, 0, 0.9, 0.8, 1],
            [0, 0, 0, 0, 0, 0, 0.8, 0.9, 1],
            [0, 0, 0, 0, 0, 0, 0.9, 0.8, 1],
            [0, 0, 0, 0, 0, 0, 0.7, 0.9, 1],
            [0.8, 0.9, 1.0, 1.0, 0.9, 0.7, 0.9, 0.8, 0.9],  // Thêm ghi đè cho Visual Novel (phù hợp cao với dialogs và story)
            [0.7, 0.7, 0, 0, 0, 0, 0.8, 0.9, 1.0],           // Sandbox
            [0, 0, 0, 0, 0, 0, 0, 0.8, 1.0],                 // MOBA
            [0, 0, 0, 0, 0, 0, 0, 0.7, 1.0],                 // Battle Royale
            [0, 0, 0, 0, 0, 0, 0, 1.0, 1.0]                  // Racing (phù hợp cao với sound)
        ],
        iconUrl: "./images/topic icons/icon_topic_rhythm.png" // Đường dẫn đến icon của chủ đề
    },
    {
        id: "Superheroes",
        name: "Superheroes".localize("game topic"),
        genreWeightings: [1, 0.6, 0.9, 0.6, 0.6, 0.7, 0.8, 0.8, 0.9, 0.9, 0.7],
        audienceWeightings: [1, 1, 1]
    },
    {
        id: "Post Apocalyptic",
        name: "Post Apocalyptic".localize("game topic"),
        genreWeightings: [1, 0.8, 1, 0.6, 0.9, 0.6, 0.9, 1.0, 0.8, 0.9, 0.7],
        audienceWeightings: [0.6, 0.9, 1]
    },
    {
        id: "Alternate History",
        name: "Alternate History".localize("game topic"),
        genreWeightings: [1, 0.8, 1, 0.8, 0.9, 0.6, 0.8, 0.9, 0.7, 0.7, 0.7],
        audienceWeightings: [0.6, 1, 1]
    },
    {
        id: "Vampire",
        name: "Vampire".localize("game topic"),
        genreWeightings: [1, 0.8, 1, 0.6, 0.6, 0.7, 0.9, 0.8, 0.7, 0.8, 0.6],
        audienceWeightings: [0.7, 1, 1]
    },
    {
        id: "Werewolf",
        name: "Werewolf".localize("game topic"),
        genreWeightings: [1, 0.8, 1, 0.6, 0.6, 0.7, 0.8, 0.8, 0.7, 0.8, 0.6],
        audienceWeightings: [0.7, 0.9, 1]
    },
    {
        id: "Aliens",
        name: "Aliens".localize("game topic"),
        genreWeightings: [1, 0.8, 1, 0.6, 0.9, 0.7, 0.8, 0.9, 0.8, 0.9, 0.7],
        audienceWeightings: [0.9, 1, 1]
    },
    {
        id: "Wild West",
        name: "Wild West".localize("game topic"),
        genreWeightings: [0.9, 0.7, 1, 0.6, 0.6, 0.7, 0.9, 0.8, 0.7, 0.8, 0.8],
        audienceWeightings: [1, 0.9, 1]
    },
    {
        id: "Dance",
        name: "Dance".localize("game topic"),
        genreWeightings: [0.9, 0.6, 0.6, 1, 0.6, 1, 0.8, 0.7, 0.8, 0.7, 0.9],
        audienceWeightings: [1, 0.9, 0.8]
    },
    {
        id: "Cooking",
        name: "Cooking".localize("game topic"),
        genreWeightings: [0.9, 0.7, 0.8, 1, 0.7, 1, 0.9, 0.8, 0.7, 0.7, 0.8],
        audienceWeightings: [0.8, 1, 0.6]
    },
    {
        id: "Farming",
        name: "Farming".localize("game topic"),
        genreWeightings: [0.6, 0.7, 1, 1, 0.8, 0.9, 0.8, 1.0, 0.6, 0.6, 0.8],
        audienceWeightings: [0.9, 1, 0.8]
    },
    {
        id: "Crime",
        name: "Crime".localize("game topic"),
        genreWeightings: [1, 0.7, 0.8, 0.9, 0.7, 0.6, 0.9, 0.8, 0.7, 0.8, 0.7],
        audienceWeightings: [0.6, 0.8, 1]
    },
    {
        id: "Disasters",
        name: "Disasters".localize("game topic"),
        genreWeightings: [0.9, 0.8, 0.7, 1, 1, 0.7, 0.8, 0.9, 0.7, 0.8, 0.7],
        audienceWeightings: [0.7, 0.9, 1]
    },
    {
        id: "Assassin",
        name: "Assassin".localize("game topic"),
        genreWeightings: [1, 0.7, 1, 0.8, 0.6, 0.6, 0.9, 0.8, 0.8, 0.9, 0.7],
        audienceWeightings: [0.6, 0.8, 1]
    },
    {
        id: "Thief",
        name: "Thief".localize("game topic"),
        genreWeightings: [0.9, 0.8, 1, 0.8, 0.9, 0.7, 0.8, 0.9, 0.7, 0.8, 0.7],
        audienceWeightings: [0.7, 1, 1]
    },
    {
        id: "Colonization",
        name: "Colonization".localize("game topic"),
        genreWeightings: [0.7, 0.6, 0.6, 1, 1, 0.7, 0.9, 1.0, 0.7, 0.7, 0.6],
        audienceWeightings: [0.7, 1, 0.8]
    },
    {
        id: "Construction",
        name: "Construction".localize("game topic"),
        genreWeightings: [0.7, 0.6, 0.6, 1, 0.9, 0.8, 0.9, 1.0, 0.6, 0.6, 0.7],
        audienceWeightings: [0.8, 1, 0.9]
    },
    {
        id: "Mythology",
        name: "Mythology".localize("game topic"),
        genreWeightings: [1, 0.8, 0.9, 0.9, 0.8, 0.7, 0.8, 0.9, 0.8, 0.8, 0.7],
        audienceWeightings: [0.7, 1, 1]
    },
    {
        id: "Abstract",
        name: "Abstract".localize("game topic"),
        genreWeightings: [0.9, 1, 0.6, 0.6, 0.8, 0.6, 0.9, 0.8, 0.8, 0.7, 0.7],
        audienceWeightings: [0.8, 0.9, 1]
    },
    {
        id: "Mad Science",
        name: "Mad Science".localize("game topic"),
        genreWeightings: [0.9, 1, 0.7, 0.9, 0.6, 0.6, 0.8, 0.9, 0.7, 0.8, 0.7],
        audienceWeightings: [0.8, 0.9, 1]
    },
    {
        id: "Extreme Sports",
        name: "Extreme Sports".localize("game topic"),
        genreWeightings: [1, 0.6, 0.6, 1, 0.7, 0.9, 0.7, 0.9, 0.8, 0.9, 1.0],
        audienceWeightings: [1, 0.7, 1]
    },
    {
        id: "Dystopian",
        name: "Dystopian".localize("game topic"),
        genreWeightings: [0.8, 0.9, 0.8, 1, 0.9, 0.6, 0.9, 0.9, 0.7, 0.8, 0.7],
        audienceWeightings: [0.6, 0.8, 1]
    },
    {
        id: "Expedition",
        name: "Expedition".localize("game topic"),
        genreWeightings: [0.7, 0.9, 0.6, 0.9, 1, 0.6, 0.8, 0.9, 0.7, 0.8, 0.8],
        audienceWeightings: [0.8, 1, 0.9]
    },
    {
        id: "Technology",
        name: "Technology".localize("game topic"),
        genreWeightings: [0.6, 0.7, 0.6, 1, 0.9, 0.6, 0.9, 0.9, 0.8, 0.7, 0.8],
        audienceWeightings: [0.8, 1, 0.9]
    }
];

// Kiểm tra tính hợp lệ của dữ liệu chủ đề khi ở chế độ debug.
// Đảm bảo mỗi chủ đề có đúng 7 giá trị genreWeightings và các giá trị này nằm trong khoảng [0.6, 1].
if (GameFlags.ghg6 && Topics.topics.some(function (topicEntry) { // topicEntry: đối tượng chủ đề hiện tại đang được kiểm tra
    return 7 != topicEntry.genreWeightings.length || topicEntry.genreWeightings.some(function (weightValue) { // weightValue: giá trị weighting của thể loại hiện tại
        return 0.6 > weightValue || 1 < weightValue;
    });
})) {
    throw "invalid topic data"; // Ném lỗi nếu dữ liệu không hợp lệ.
}