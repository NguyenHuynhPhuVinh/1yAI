"use strict";
var Platforms = {}; // Khởi tạo namespace Platforms

(function () {
    // Hàm tính toán trọng số chuẩn hóa cho đối tượng khán giả
    // Trọng số cao hơn sẽ được tăng nhiều hơn.
    Platforms.getNormalizedAudienceWeighting = function (audienceWeightingValue) {
        // Nếu giá trị trọng số >= 0.8, cộng thêm 0.2
        // Nếu giá trị trọng số >= 0.7 (nhưng < 0.8), cộng thêm 0.1
        // Ngược lại, cộng thêm 0.05
        return 0.8 <= audienceWeightingValue ? audienceWeightingValue + 0.2 : 0.7 <= audienceWeightingValue ? audienceWeightingValue + 0.1 : audienceWeightingValue + 0.05;
    };

    // Hàm tính toán trọng số chuẩn hóa cho thể loại game
    // Các giá trị trọng số khác nhau sẽ được điều chỉnh theo các mức khác nhau.
    Platforms.getNormalizedGenreWeighting = function (genreWeightingValue) {
        // Ánh xạ các giá trị trọng số gốc sang giá trị chuẩn hóa mới
        // Ví dụ: trọng số 1.0 sẽ thành 1.1, 0.9 thành 1.05, ...
        return 1 == genreWeightingValue ? 1.1 : 0.9 == genreWeightingValue ? 1.05 : 0.8 == genreWeightingValue ? 1 : 0.7 == genreWeightingValue ? 0.95 : 0.6 == genreWeightingValue ? 0.9 : 1;
    };

    // Hàm tính toán trọng số thể loại chuẩn hóa cho một nền tảng, có thể xét một hoặc hai thể loại.
    // Nếu có thể loại phụ, trọng số cuối cùng là trung bình có trọng số (2:1 cho thể loại chính).
    Platforms.getNormGenreWeighting = function (weightArray, genre, fallback) {
        if (typeof weightArray === "undefined") return 1;

        if (fallback) {
            // Tính trung bình có trọng số giữa thể loại chính và thể loại phụ
            return (Platforms.getNormGenreWeighting(weightArray, fallback) + 2 * Platforms.getNormGenreWeighting(weightArray, genre)) / 3;
        }

        if (genre === GameGenre.Action) return Platforms.getNormalizedGenreWeighting(weightArray[0]);
        if (genre === GameGenre.Adventure) return Platforms.getNormalizedGenreWeighting(weightArray[1]);
        if (genre === GameGenre.RPG) return Platforms.getNormalizedGenreWeighting(weightArray[2]);
        if (genre === GameGenre.Simulation) return Platforms.getNormalizedGenreWeighting(weightArray[3]);
        if (genre === GameGenre.Strategy) return Platforms.getNormalizedGenreWeighting(weightArray[4]);
        if (genre === GameGenre.Casual) return Platforms.getNormalizedGenreWeighting(weightArray[5]);
        if (genre === GameGenre.VisualNovel) return Platforms.getNormalizedGenreWeighting(weightArray[6]); // Visual Novel
        if (genre === GameGenre.Sandbox) return Platforms.getNormalizedGenreWeighting(weightArray[7]); // Sandbox
        if (genre === GameGenre.MOBA) return Platforms.getNormalizedGenreWeighting(weightArray[8]); // MOBA
        if (genre === GameGenre.BattleRoyale) return Platforms.getNormalizedGenreWeighting(weightArray[9]); // Battle Royale
        if (genre === GameGenre.Racing) return Platforms.getNormalizedGenreWeighting(weightArray[10]); // Racing

        throw "unknown genre: " + genre;
    };

    // Mảng chứa dữ liệu ban đầu của các nền tảng được định nghĩa trước
    var initialPlatformData = [{
        id: "PC",
        name: "PC",
        imageDates: ["1/1/1", "4/9/1", "16/3/1", "23/4/5"], // Ngày thay đổi hình ảnh (Năm/Tháng/Tuần)
        startAmount: 0.22, // Thị phần ban đầu (nhân với 5E6 để ra số đơn vị)
        marketKeyPoints: [{
            date: "2/1/1",
            amount: 0.24
        }, {
            date: "4/1/1",
            amount: 0.41
        }, {
            date: "4/10/2",
            amount: 0.48
        }, {
            date: "11/5/2",
            amount: 1.1
        }, {
            date: "16/12/1",
            amount: 2.1
        }, {
            date: "20/7/1",
            amount: 2.4
        }, {
            date: "22/9/2",
            amount: 2.6
        }, {
            date: "23/4/1",
            amount: 4
        }, {
            date: "26/12/4",
            amount: 5.7
        }],
        unitsSold: 5.7, // Tổng đơn vị bán ra dự kiến ở đỉnh hoặc cuối vòng đời (nhân với 5E6)
        licencePrize: 0, // Phí bản quyền
        published: "1/1/1", // Ngày phát hành
        platformRetireDate: "260/12/4", // Ngày ngừng hỗ trợ (260 là một số rất lớn, nghĩa là "không bao giờ")
        developmentCosts: 5E3, // Chi phí phát triển cơ bản
        genreWeightings: [0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9], // Trọng số cho 11 thể loại
        audienceWeightings: [0.8, 0.9, 1], // Trọng số cho đối tượng (Young, Everyone, Mature)
        // techLevel không được định nghĩa cho PC, có thể được xác định động hoặc là một giá trị cơ sở.
    }, {
        id: "G64",
        name: "G64",
        company: "Govodore",
        startAmount: 0.28,
        marketKeyPoints: [
            { date: "2/5/1", amount: 0.36 },
            { date: "3/1/1", amount: 0.38 },
            { date: "4/1/1", amount: 0.386 }
        ],
        unitsSold: 0.388,
        licencePrize: 0,
        published: "1/1/1",
        platformRetireDate: "4/6/2",
        developmentCosts: 2E4,
        genreWeightings: [1, 0.8, 0.8, 1, 0.8, 0.8, 0.6, 0.8, 0.7, 0.7, 0.8], // Trọng số cho 11 thể loại
        audienceWeightings: [0.8, 0.9, 1],
        techLevel: 1 // Cấp độ công nghệ của nền tảng
    },
    {
        id: "TES",
        name: "TES",
        company: "Ninvento",
        startAmount: 0.356,
        marketKeyPoints: [{
            date: "2/5/1",
            amount: 0.41
        }, {
            date: "3/1/1",
            amount: 0.444
        }, {
            date: "4/1/1",
            amount: 0.46
        }],
        unitsSold: 0.42,
        licencePrize: 8E4,
        published: "2/1/2",
        platformRetireDate: "6/6/2",
        developmentCosts: 3E4,
        genreWeightings: [1, 0.8, 0.8, 0.9, 0.8, 0.7, 0.6, 0.7, 0.7, 0.8, 0.9], // Trọng số cho 11 thể loại
        audienceWeightings: [1, 0.9, 0.6],
        techLevel: 2
    },
    {
        id: "Master V",
        name: "Master V",
        company: "Vena",
        startAmount: 0.43,
        marketKeyPoints: [{
            date: "4/1/1",
            amount: 0.456
        }, {
            date: "6/6/2",
            amount: 0.466
        }],
        unitsSold: 0.7,
        licencePrize: 8E4,
        published: "3/2/3",
        platformRetireDate: "11/3/4",
        developmentCosts: 3E4,
        genreWeightings: [1, 0.8, 0.8, 0.9, 0.7, 0.7, 0.6, 0.8, 0.7, 0.8, 0.9], // Trọng số cho 11 thể loại
        audienceWeightings: [0.9, 1, 0.7],
        techLevel: 2
    },
    {
        id: "Gameling",
        name: "Gameling",
        company: "Ninvento",
        startAmount: 0.8,
        unitsSold: 1, // Đây là thị phần đỉnh, không phải số lượng bán ra thực tế cuối cùng
        licencePrize: 5E4,
        published: "3/9/2",
        platformRetireDate: "14/4/2",
        developmentCosts: 3E4,
        genreWeightings: [0.9, 0.9, 0.9, 0.9, 0.8, 1, 0.6, 0.7, 0.7, 0.7, 0.9], // Trọng số cho 11 thể loại
        audienceWeightings: [1, 0.9, 0.6],
        techLevel: 2
    }
    ];

    Platforms.allPlatforms = []; // Mảng chứa tất cả các nền tảng (bao gồm cả định nghĩa sẵn và tùy chỉnh)
    Platforms.allPlatforms.addRange(initialPlatformData); // Thêm dữ liệu ban đầu của các nền tảng
    // Thêm dữ liệu cho các nền tảng khác bằng phương thức addRange (đã được định nghĩa ở file gốc)
    Platforms.allPlatforms.addRange([
        {
            id: "Vena Gear",
            name: "Vena Gear",
            company: "Vena",
            startAmount: 0.6,
            unitsSold: 0.84,
            licencePrize: 5E4,
            published: "4/2/4",
            platformRetireDate: "8/4/1",
            developmentCosts: 3E4,
            genreWeightings: [1, 0.9, 0.9, 0.9, 0.8, 1, 0.7, 0.8, 0.7, 0.7, 0.9], // Thêm trọng số đầy đủ
            audienceWeightings: [0.9, 1, 0.8],
            techLevel: 3
        },
        {
            id: "Vena Oasis",
            name: "Vena Oasis",
            company: "Vena",
            startAmount: 0.62,
            unitsSold: 0.65,
            licencePrize: 1E5,
            published: "5/2/4",
            platformRetireDate: "10/11/1",
            developmentCosts: 5E4,
            genreWeightings: [1, 0.9, 0.9, 0.9, 0.8, 0.9, 0.8, 0.9, 0.8, 0.8, 0.9], // Thêm trọng số đầy đủ
            audienceWeightings: [0.8, 1, 0.9],
            techLevel: 3
        }, {
            id: "Super TES",
            name: "Super TES",
            company: "Ninvento",
            startAmount: 0.65,
            marketKeyPoints: [{
                date: "6/6/1",
                amount: 0.7
            }, {
                date: "8/10/1",
                amount: 0.73
            }],
            unitsSold: 0.8,
            licencePrize: 5E4,
            published: "5/12/4",
            platformRetireDate: "9/8/1",
            developmentCosts: 6E4,
            genreWeightings: [1, 0.8, 0.8, 0.9, 0.8, 0.8, 0.7, 0.8, 0.7, 0.8, 0.9], // Thêm thể loại mới
            audienceWeightings: [1, 0.9, 0.7],
            techLevel: 3
        }, {
            id: "Playsystem",
            name: "Playsystem",
            company: "Vonny",
            startAmount: 0.85,
            unitsSold: 1.22,
            licencePrize: 2E5,
            published: "7/7/1",
            platformRetireDate: "12/11/3",
            developmentCosts: 6E4,
            genreWeightings: [1, 0.9, 0.8, 0.9, 0.8, 0.9, 0.7, 0.8, 0.8, 0.9, 0.8], // Thêm thể loại mới
            audienceWeightings: [0.8, 1, 0.9],
            techLevel: 3
        }, {
            id: "TES 64",
            name: "TES 64",
            company: "Ninvento",
            startAmount: 0.7,
            marketKeyPoints: [{
                date: "9/7/1",
                amount: 0.85
            }],
            unitsSold: 1.25,
            licencePrize: 2E5,
            published: "9/2/1",
            platformRetireDate: "13/5/4",
            developmentCosts: 6E4,
            genreWeightings: [1, 0.8, 0.8, 0.9, 0.8, 0.8, 0.7, 0.8, 0.8, 0.9, 0.9], // Thêm thể loại mới
            audienceWeightings: [1, 0.9, 0.9],
            techLevel: 3
        },
        {
            id: "DreamVast",
            name: "DreamVast",
            company: "Vena",
            startAmount: 1.1,
            marketKeyPoints: [{
                date: "11/4/2",
                amount: 1.2
            }],
            unitsSold: 0.9,
            licencePrize: 25E4,
            published: "10/8/3",
            platformRetireDate: "14/1/4",
            developmentCosts: 6E4,
            genreWeightings: [1, 0.9, 0.9, 0.9, 0.9, 0.9, 0.8, 0.9, 0.8, 0.9, 0.8], // Thêm thể loại mới
            audienceWeightings: [0.7, 1, 1],
            techLevel: 4
        }, {
            id: "Playsystem 2",
            name: "Playsystem 2",
            company: "Vonny",
            startAmount: 1.3,
            unitsSold: 2.4,
            licencePrize: 35E4,
            published: "11/5/2",
            platformRetireDate: "18/6/3",
            developmentCosts: 7E4,
            genreWeightings: [1, 0.9, 0.9, 0.9, 0.8, 0.9, 0.7, 0.8, 0.8, 0.9, 0.9], // Thêm thể loại mới
            audienceWeightings: [0.9,
                1, 0.8
            ],
            techLevel: 4
        }, {
            id: "mBox",
            name: "mBox",
            company: "Mirconoft",
            startAmount: 1.35,
            marketKeyPoints: [{
                date: "12/10/1",
                amount: 1.6
            }, {
                date: "14/4/1",
                amount: 1.7
            }],
            unitsSold: 2.1,
            licencePrize: 35E4,
            published: "11/12/4",
            platformRetireDate: "17/2/3",
            developmentCosts: 7E4,
            genreWeightings: [1, 0.9, 0.9, 0.9, 0.9, 0.9, 0.8, 0.9, 0.9, 1.0, 0.9], // Thêm thể loại mới
            audienceWeightings: [0.8, 1, 0.9],
            techLevel: 4
        }, {
            id: "gameSphere",
            name: "Game Sphere",
            iconUri: "./images/platforms/superb/GameSphere.png",
            company: "Ninvento",
            startAmount: 1,
            unitsSold: 1.7,
            licencePrize: 45E4,
            published: "12/12/1",
            platformRetireDate: "17/2/3",
            developmentCosts: 9E4,
            genreWeightings: [0.8, 0.8, 0.7, 0.8, 0.7, 1, 0.7, 0.8, 0.7, 0.8, 0.9], // Thêm thể loại mới
            audienceWeightings: [0.9, 0.9, 0.8],
            techLevel: 3
        }, {
            id: "GS",
            name: "GS",
            company: "Ninvento",
            startAmount: 1.5,
            unitsSold: 3.8,
            licencePrize: 35E4,
            published: "13/8/4",
            marketKeyPoints: [{
                date: "26/12/4",
                amount: 3.8
            }],
            platformRetireDate: "260/12/4",
            developmentCosts: 5E4,
            genreWeightings: [1, 0.8, 0.8, 0.9, 0.9, 0.9, 0.8, 0.7, 0.7, 0.8, 0.8], // Thêm thể loại mới
            audienceWeightings: [1, 0.9, 0.8],
            techLevel: 3
        }, {
            id: "PPS",
            name: "PPS",
            company: "Vonny",
            startAmount: 1.44,
            unitsSold: 3.1,
            licencePrize: 35E4,
            published: "14/3/4",
            marketKeyPoints: [{
                date: "26/12/4",
                amount: 3.1
            }],
            platformRetireDate: "260/12/4",
            developmentCosts: 5E4,
            genreWeightings: [1, 0.7, 1, 0.8, 0.8, 0.8, 0.7, 0.8, 0.9, 0.9, 0.8], // Thêm thể loại mới
            audienceWeightings: [0.8, 0.9, 1],
            techLevel: 4
        }, {
            id: "mBox 360",
            name: "mBox 360",
            company: "Mirconoft",
            startAmount: 2.4,
            unitsSold: 3.7,
            licencePrize: 5E5,
            published: "16/8/4",
            platformRetireDate: "24/2/3",
            developmentCosts: 8E4,
            genreWeightings: [1, 0.9, 1, 0.9, 0.9, 0.9, 0.8, 0.9, 0.9, 1.0, 0.9], // Thêm thể loại mới
            audienceWeightings: [0.8, 0.9, 1],
            techLevel: 5
        }, {
            id: "Nuu",
            name: "Nuu",
            company: "Ninvento",
            startAmount: 2,
            unitsSold: 2.8,
            licencePrize: 5E5,
            published: "17/4/4",
            platformRetireDate: "21/6/3",
            developmentCosts: 8E4,
            genreWeightings: [0.8, 0.6, 0.7, 1, 0.7, 1, 0.7, 0.9, 0.7, 0.7, 0.8], // Thêm thể loại mới
            audienceWeightings: [1, 1, 0.7],
            techLevel: 4
        }, {
            id: "Playsystem 3",
            name: "Playsystem 3",
            company: "Vonny",
            startAmount: 2.5,
            unitsSold: 3.7,
            licencePrize: 5E5,
            published: "17/12/4",
            platformRetireDate: "24/9/3",
            developmentCosts: 8E4,
            genreWeightings: [1, 0.9, 0.9, 1, 0.7, 0.8, 0.8, 0.8, 0.9, 0.9, 0.9], // Thêm thể loại mới
            audienceWeightings: [0.8, 1, 0.9],
            techLevel: 5
        }, {
            id: "grPhone",
            name: "grPhone",
            company: "Grapple",
            startAmount: 2.3,
            unitsSold: 3.7,
            licencePrize: 5E5,
            published: "18/9/1",
            marketKeyPoints: [{
                date: "26/12/4",
                amount: 3.7
            }],
            platformRetireDate: "260/12/4",
            developmentCosts: 8E4,
            genreWeightings: [0.8, 0.8, 0.7, 0.9, 0.7, 1, 0.8, 0.9, 0.8, 0.9, 0.9], // Thêm thể loại mới
            audienceWeightings: [0.9, 1, 0.6],
            techLevel: 4
        }, {
            id: "grPad",
            name: "grPad",
            company: "Grapple",
            startAmount: 2.3,
            unitsSold: 3.8,
            licencePrize: 5E5,
            published: "19/7/4",
            marketKeyPoints: [{
                date: "26/12/4",
                amount: 3.8
            }],
            platformRetireDate: "260/12/4",
            developmentCosts: 8E4,
            genreWeightings: [0.8, 0.9, 0.7, 0.9, 0.9, 1, 0.9, 0.9, 0.9, 1.0, 0.9], // Thêm thể loại mới
            audienceWeightings: [0.9, 1, 0.6],
            techLevel: 4
        }, {
            id: "mPad",
            name: "mPad",
            company: "Mirconoft",
            startAmount: 2.2,
            unitsSold: 3.4,
            licencePrize: 5E5,
            published: "20/10/4",
            marketKeyPoints: [{
                date: "26/12/4",
                amount: 3.4
            }],
            platformRetireDate: "260/12/4",
            developmentCosts: 8E4,
            genreWeightings: [0.7, 0.9, 0.8, 0.9, 0.7, 0.9, 0.9, 0.9, 0.8, 0.9, 0.9], // Thêm thể loại mới
            audienceWeightings: [0.7, 0.9, 0.8],
            techLevel: 4
        }, {
            id: "Wuu",
            name: "Wuu",
            company: "Ninvento",
            startAmount: 3,
            unitsSold: 5,
            licencePrize: 1E6,
            published: "20/12/4",
            marketKeyPoints: [{
                date: "29/12/4",
                amount: 5
            }],
            platformRetireDate: "26/5/2",
            developmentCosts: 8E4,
            genreWeightings: [0.9, 0.7, 0.8, 1, 0.7, 1, 0.8, 0.9, 0.8, 0.9, 0.9], // Thêm thể loại mới
            audienceWeightings: [0.9, 1, 0.7],
            techLevel: 5
        }, {
            id: "OYA",
            name: "OYA",
            company: "KickIT",
            startAmount: 2.5,
            unitsSold: 4,
            licencePrize: 1E4,
            published: "22/10/4",
            marketKeyPoints: [{
                date: "29/12/4",
                amount: 4
            }],
            platformRetireDate: "260/12/4",
            developmentCosts: 4E4,
            genreWeightings: [0.9, 0.7, 0.8, 0.9, 0.8, 1, 0.8, 0.9, 0.9, 0.9, 0.9], // Thêm thể loại mới
            audienceWeightings: [0.8, 1, 0.9],
            techLevel: 4
        }, {
            id: "mBox One",
            name: "mBox One",
            company: "Mirconoft",
            startAmount: 3.6,
            marketKeyPoints: [{
                date: "23/9/1",
                amount: 4.1
            }, {
                date: "28/12/4",
                amount: 5.5
            }],
            unitsSold: 5.5,
            licencePrize: 1E6,
            published: "23/8/4",
            platformRetireDate: "29/12/4",
            developmentCosts: 1E5,
            genreWeightings: [1, 0.8, 0.9, 0.9, 0.7, 0.9, 0.8, 0.9, 0.8, 0.9, 0.9], // Thêm thể loại mới
            audienceWeightings: [0.7, 1, 0.8],
            techLevel: 6
        }, {
            id: "Playsystem 4",
            name: "Playsystem 4",
            company: "Vonny",
            startAmount: 3.7,
            unitsSold: 6,
            licencePrize: 1E6,
            published: "23/10/4",
            marketKeyPoints: [{
                date: "28/4/4",
                amount: 6
            }],
            platformRetireDate: "29/4/4",
            developmentCosts: 1E5,
            genreWeightings: [1, 0.8, 1, 0.9, 0.7, 0.9, 0.8, 0.9, 0.9, 0.9, 0.9], // Thêm thể loại mới
            audienceWeightings: [0.8, 1, 0.9],
            techLevel: 6
        }, {
            id: "Swap",
            name: "Swap",
            company: "Ninvento",
            startAmount: 4.5,
            unitsSold: 6,
            licencePrize: 125E4,
            published: "25/3/1",
            marketKeyPoints: [{
                date: "29/12/4",
                amount: 6
            }],
            platformRetireDate: "260/12/4",
            developmentCosts: 8E4,
            genreWeightings: [0.9, 0.8, 1, 0.8, 0.7, 1, 0.9, 0.9, 0.9, 0.9, 0.9], // Thêm thể loại mới
            audienceWeightings: [0.9, 1, 0.8],
            techLevel: 6
        }, {
            id: "mBox Next",
            name: "mBox Next",
            company: "Mirconoft",
            startAmount: 5.6,
            marketKeyPoints: [{
                date: "28/9/1",
                amount: 5.8
            }, {
                date: "29/12/4",
                amount: 6.6
            }],
            unitsSold: 6.6,
            licencePrize: 15E5,
            published: "27/8/4",
            platformRetireDate: "260/12/4",
            developmentCosts: 2E5,
            genreWeightings: [0.9, 0.9, 0.9, 0.8, 0.7, 1, 0.9, 0.9, 0.9, 0.9, 0.9], // Thêm thể loại mới
            audienceWeightings: [0.9, 1, 0.8],
            techLevel: 7
        },
        {
            id: "Playsystem 5",
            name: "Playsystem 5",
            company: "Vonny",
            startAmount: 5.2,
            unitsSold: 6.4,
            licencePrize: 15E5,
            published: "27/10/4",
            marketKeyPoints: [{ date: "29/12/4", amount: 6.4 }],
            platformRetireDate: "260/12/4",
            developmentCosts: 2E5,
            genreWeightings: [1, 0.7, 0.9, 1, 0.7, 0.9, 0.9, 0.9, 0.9, 0.9, 0.9], // Thêm thể loại mới
            audienceWeightings: [0.8, 1, 0.9],
            techLevel: 7
        }
    ]);

    // Lấy đường dẫn hình ảnh cho một nền tảng tại một thời điểm (tuần) cụ thể.
    // Hình ảnh có thể thay đổi theo thời gian dựa trên `imageDates` của nền tảng.
    Platforms.getPlatformImage = function (platform, currentWeek) {
        if (platform.iconUri) return platform.iconUri; // Ưu tiên iconUri nếu có (thường cho nền tảng tùy chỉnh)

        // Xác định thư mục chứa hình ảnh dựa trên nền tảng là cơ bản hay "superb" (có thể là thế hệ sau)
        var imagePathPrefix = -1 != initialPlatformData.indexOf(platform) ? "./images/platforms" : "./images/platforms/superb";
        var selectedImagePath = null;

        // Nếu có `imageDates` trong định nghĩa nền tảng, duyệt qua để tìm hình ảnh phù hợp với `currentWeek`
        if (currentWeek && platform.imageDates) {
            for (var dateIndex = 0; dateIndex < platform.imageDates.length; dateIndex++) {
                // Nếu tuần hiện tại lớn hơn hoặc bằng tuần trong `imageDates`
                if (General.getWeekFromDateString(platform.imageDates[dateIndex]) <= currentWeek) {
                    if (0 === dateIndex) { // Hình ảnh đầu tiên (mặc định)
                        selectedImagePath = "{0}/{1}.png".format(imagePathPrefix, platform.id);
                    } else {
                        // PC có thể có đường dẫn đặc biệt cho các hình ảnh sau này
                        if ("PC" === platform.id) {
                            imagePathPrefix = "./images/platforms/superb";
                        }
                        // Các hình ảnh tiếp theo có hậu tố dạng "-<số thứ tự>"
                        selectedImagePath = "{0}/{1}{2}.png".format(imagePathPrefix, platform.id, "-" + (dateIndex + 1));
                    }
                }
            }
        }
        // Nếu không tìm thấy hình ảnh theo ngày, sử dụng hình ảnh mặc định (không có hậu tố số)
        return null === selectedImagePath ? "{0}/{1}.png".format(imagePathPrefix, platform.id) : selectedImagePath;
    };

    // Hàm này có vẻ dùng để xuất dữ liệu thị phần cho việc vẽ biểu đồ (ví dụ trong Excel) - thường dùng cho mục đích debug.
    Platforms._getMarketShareDataForExelGraph = function () {
        var outputString = "";
        for (var platformIndex = 0; platformIndex < Platforms.allPlatforms.length; platformIndex++) {
            var platform = Platforms.allPlatforms[platformIndex];
            outputString = outputString + (platform.id + ",");
            // Lặp qua các tuần (tối đa 2000 tuần, bước nhảy 4 tuần)
            for (var week = 0; 2E3 > week; week += 4) {
                // Nếu nền tảng còn hoạt động trong tuần này
                if (Platforms.getRetireDate(platform) > week) {
                    // Nếu đã phát hành, tính thị phần, ngược lại để trống
                    outputString = Platforms.getPublishDate(platform) <= week ? outputString + (Math.floor(Platforms.getMarketSizeForWeek(platform, week) / 5) + ",") : outputString + ",";
                }
            }
            outputString += "\n";
        }
        // console.log(outputString); // (Đã comment out trong code gốc)
    };

    // Hàm này có vẻ dùng để xuất dữ liệu doanh số cho việc vẽ biểu đồ - thường dùng cho mục đích debug.
    Platforms._getSalesGraph = function () {
        for (var score = 1; 11 > score; score++) { // Lặp qua các mức điểm của game
            for (var week = 0; 144 > week; week += 1) { // Lặp qua các tuần (có vẻ là một khoảng thời gian cố định để test)
                var tempCompany = new Company("SalesLogCompany"); // Tạo công ty tạm
                tempCompany.currentWeek = week;
                var tempGame = new Game(tempCompany); // Tạo game tạm
                tempGame.topic = Topics.topics[0];
                tempGame.genre = GameGenre.Action;
                // Tìm một nền tảng hợp lệ cho game tạm tại tuần hiện tại
                for (var platformIndex = 0; platformIndex < Platforms.allPlatforms.length; platformIndex++) {
                    var currentPlatform = Platforms.allPlatforms[platformIndex];
                    if (Platforms.getRetireDate(currentPlatform) > week && Platforms.getPublishDate(currentPlatform) <= week && 0 < Platforms.getMarketSizeForWeek(currentPlatform, week, tempCompany)) {
                        tempGame.platform = currentPlatform; // Gán nền tảng tìm được
                    }
                }
                tempGame.score = score;
                Sales.calculateSales(tempCompany, tempGame); // Tính toán doanh số
                // console.log(game.score, game.unitsSold); // (Đã comment out trong code gốc)
            }
        }
    };

    // Lấy tuần ngừng hỗ trợ của nền tảng.
    // Nền tảng tùy chỉnh (do người chơi tạo) có vòng đời cố định (GameFlags.CONSOLE_SALES_LENGTH).
    // Nền tảng định nghĩa sẵn dựa trên giá trị `platformRetireDate`.
    // Giá trị "260/12/4" được coi là "không bao giờ" ngừng hỗ trợ trong thực tế game.
    Platforms.getRetireDate = function (platform) {
        return platform.isCustom ? GameManager.company.currentWeek + GameFlags.CONSOLE_SALES_LENGTH :
            "260/12/4" === platform.platformRetireDate ? GameManager.company.currentWeek + 1E3 : // Giá trị lớn để biểu thị "không bao giờ"
                General.getWeekFromDateString(platform.platformRetireDate);
    };

    // Lấy tuần phát hành của nền tảng.
    Platforms.getPublishDate = function (platform) {
        return General.getWeekFromDateString(platform.published);
    };

    // Lấy kích thước thị trường của nền tảng cho tuần hiện tại của công ty.
    Platforms.getMarketSize = function (platform, company) {
        return Platforms.getMarketSizeForWeek(platform, company.currentWeek, company);
    };

    // Kiểm tra xem một nền tảng có phải là mạnh nhất trên thị trường không (dựa trên kích thước thị trường).
    // Được sử dụng để tính bonus "Grid" cho PC hoặc nền tảng tùy chỉnh mạnh nhất.
    Platforms.isStrongestPlatform = function (platformToCheck, currentWeek, company) {
        var platformsOnMarket = Platforms.getPlatformsOnMarket(company);
        // Lấy PC làm cơ sở ban đầu cho thị trường lớn nhất
        var maxMarketSize = Platforms.getMarketSizeForWeek(platformsOnMarket.first(function (platform) { return "PC" === platform.id; }), currentWeek, company, true); // true để tránh đệ quy
        var customPlatformsOnMarket = platformsOnMarket.filter(function (platform) { return platform.isCustom; });

        // So sánh với các nền tảng tùy chỉnh khác
        for (var i = 0; i < customPlatformsOnMarket.length; i++) {
            maxMarketSize = Math.max(maxMarketSize, Platforms.getMarketSizeForWeek(customPlatformsOnMarket[i], currentWeek, company, true));
        }
        // Nếu thị trường của nền tảng đang kiểm tra bằng với thị trường lớn nhất, nó là mạnh nhất
        return Platforms.getMarketSizeForWeek(platformToCheck, currentWeek, company, true) === maxMarketSize ? true : false;
    };

    // Tính toán kích thước thị trường của một nền tảng cho một tuần cụ thể.
    // `isInternalCall` được sử dụng để tránh đệ quy vô hạn khi tính bonus "grid".
    Platforms.getMarketSizeForWeek = function (platform, currentWeek, company, isInternalCall) {
        // Xử lý cho nền tảng tùy chỉnh (do người chơi tạo)
        if (platform.isCustom) {
            if (platform.currentSalesCash) { // Nếu đã có doanh thu
                var marketValueFactor = 1;
                // Nếu công ty có "Grid" (nền tảng phân phối game trực tuyến) và đây là nền tảng mạnh nhất (PC hoặc console tùy chỉnh mạnh nhất),
                // thì tăng một chút thị phần (bonus "grid").
                if (company.flags.grid && !isInternalCall && Platforms.isStrongestPlatform(platform, currentWeek, company)) {
                    marketValueFactor = 1.05;
                }
                // Kích thước thị trường được tính dựa trên doanh thu hiện tại quy đổi ra đơn vị, hoặc lượng khởi điểm nếu cao hơn.
                return Math.max(5 * Math.floor(platform.currentSalesCash / Sales.consoleUnitPrice * marketValueFactor), 5E6 * platform.startAmount);
            }
            return 5E6 * platform.startAmount; // Nếu chưa có doanh thu, dựa vào lượng khởi điểm
        }

        // Xử lý cho nền tảng được định nghĩa trước
        var weeksSincePublish = currentWeek - Platforms.getPublishDate(platform);
        if (0 > weeksSincePublish) return 0; // Nền tảng chưa được phát hành

        var startMarketAmount = platform.startAmount; // Thị phần khởi điểm
        var peakMarketAmount = platform.unitsSold; // `unitsSold` ở đây thực ra là lượng bán tối đa hoặc thị phần đỉnh của nền tảng đó
        var platformSalesDuration = Platforms.getRetireDate(platform) - Platforms.getPublishDate(platform); // Tổng thời gian nền tảng tồn tại trên thị trường

        // Nếu có `marketKeyPoints` (các điểm mốc thay đổi thị phần),
        // điều chỉnh `startMarketAmount`, `peakMarketAmount` và `platformSalesDuration`
        // dựa trên điểm mốc gần nhất mà game đã vượt qua.
        if (platform.marketKeyPoints) {
            var currentSegmentStartWeek = Platforms.getPublishDate(platform); // Tuần bắt đầu của đoạn thị trường hiện tại
            var currentSegmentEndWeek = Platforms.getRetireDate(platform); // Tuần kết thúc mặc định của đoạn thị trường hiện tại là ngày retire

            // Tìm điểm mốc BẮT ĐẦU cho đoạn thị trường hiện tại
            for (var keyPointIndex = 0; keyPointIndex < platform.marketKeyPoints.length; keyPointIndex++) {
                var keyPointWeek = General.getWeekFromDateString(platform.marketKeyPoints[keyPointIndex].date);
                if (currentWeek >= keyPointWeek) { // Nếu đã qua điểm mốc này
                    weeksSincePublish = currentWeek - keyPointWeek; // Tính lại số tuần kể từ điểm mốc này
                    startMarketAmount = platform.marketKeyPoints[keyPointIndex].amount; // Cập nhật thị phần bắt đầu
                    currentSegmentStartWeek = keyPointWeek; // Cập nhật "ngày bắt đầu" cho khoảng hiện tại
                }
            }
            // Tìm điểm mốc KẾT THÚC (hoặc đỉnh) cho đoạn thị trường hiện tại
            for (var keyPointIndex = platform.marketKeyPoints.length - 1; 0 <= keyPointIndex; keyPointIndex--) {
                var keyPointWeek = General.getWeekFromDateString(platform.marketKeyPoints[keyPointIndex].date);
                if (currentWeek <= keyPointWeek) { // Nếu chưa đến điểm mốc này (hoặc đang ở điểm mốc này)
                    currentSegmentEndWeek = keyPointWeek; // Đây là điểm kết thúc của đoạn thị trường hiện tại
                    peakMarketAmount = platform.marketKeyPoints[keyPointIndex].amount; // Thị phần tại điểm đó
                }
            }
            platformSalesDuration = currentSegmentEndWeek - currentSegmentStartWeek; // Thời gian của đoạn thị trường hiện tại
        }

        var marketValueFactor = 1;
        // Tương tự như trên, nếu là PC và là nền tảng mạnh nhất (và có grid), tăng thị phần
        if (company.flags.grid && !isInternalCall && "PC" === platform.id && Platforms.isStrongestPlatform(platform, currentWeek, company)) {
            marketValueFactor = 1.05;
        }

        if (0 === platformSalesDuration) return 5E6 * startMarketAmount; // Tránh chia cho 0 nếu thời gian tồn tại là 0
        weeksSincePublish > platformSalesDuration && (weeksSincePublish = platformSalesDuration); // Giới hạn số tuần trong vòng đời của đoạn thị trường

        // Nội suy tuyến tính để tính thị phần tại `currentWeek` dựa trên `weeksSincePublish` trong đoạn thị trường hiện tại.
        // Kết quả nhân với 5E6 để ra số lượng đơn vị tiềm năng.
        return 5E6 * (weeksSincePublish / platformSalesDuration * (peakMarketAmount - startMarketAmount) + startMarketAmount) * marketValueFactor;
    };

    // Tính tỷ lệ phần trăm thị phần của một nền tảng so với tổng thị trường của tất cả các nền tảng đang hoạt động.
    Platforms.getTotalMarketSizePercent = function (platform, company) {
        var totalMarketSize = 0;
        var platformsOnMarket = Platforms.getPlatformsOnMarket(GameManager.company); // Lấy tất cả nền tảng đang có trên thị trường
        for (var i = 0; i < platformsOnMarket.length; i++) {
            totalMarketSize += Platforms.getMarketSize(platformsOnMarket[i], company); // Cộng dồn thị phần
        }
        if (totalMarketSize === 0) return 0; // Tránh chia cho 0
        return 100 / totalMarketSize * Platforms.getMarketSize(platform, company); // Tính tỷ lệ %
    };

    // Tính trọng số thể loại kết hợp cho một game phát triển trên nhiều nền tảng.
    // Áp dụng hệ số giảm (MULTIPLATFORM_WEIGHTING) cho mỗi nền tảng thêm vào sau nền tảng đầu tiên.
    // Nền tảng cuối cùng sẽ nhận phần trọng số còn lại để đảm bảo tổng là 1 (nếu MULTIPLATFORM_WEIGHTING < 1).
    Platforms.getGenreWeighting = function (platformsArray, primaryGenre, secondaryGenre) {
        var currentMultiplatformFactor = 1; // Hệ số ban đầu cho nền tảng đầu tiên
        var remainingWeightToDistribute = 1;   // Phần trọng số còn lại để phân bổ (ban đầu là 100%)
        var accumulatedWeightedScore = 0;  // Điểm trọng số đã được nhân với hệ số và tích lũy

        for (var i = 0; i < platformsArray.length; i++) {
            var currentPlatformNormGenreWeighting = Platforms.getNormGenreWeighting(platformsArray[i].genreWeightings, primaryGenre, secondaryGenre);
            if (i < platformsArray.length - 1) { // Nếu không phải nền tảng cuối cùng trong mảng
                // Áp dụng hệ số giảm cho nền tảng này và các nền tảng tiếp theo
                currentMultiplatformFactor *= GameFlags.MULTIPLATFORM_WEIGHTING;
                accumulatedWeightedScore += currentPlatformNormGenreWeighting * currentMultiplatformFactor;
                remainingWeightToDistribute -= currentMultiplatformFactor; // Giảm phần trọng số còn lại
            } else { // Nền tảng cuối cùng nhận phần trọng số còn lại
                accumulatedWeightedScore += currentPlatformNormGenreWeighting * remainingWeightToDistribute;
            }
        }
        return accumulatedWeightedScore;
    };

    // Tính trọng số đối tượng khán giả kết hợp, logic tương tự như `getGenreWeighting`.
    Platforms.getAudienceWeighting = function (platformsArray, audienceCategory, useRawWeighting) {
        if (void 0 === audienceCategory) return 1; // Nếu không có đối tượng khán giả, trả về 1
        var currentMultiplatformFactor = 1;
        var remainingWeightToDistribute = 1;
        var accumulatedWeightedScore = 0;
        for (var i = 0; i < platformsArray.length; i++) {
            var currentPlatformAudienceWeighting = Platforms.getPlatformsAudienceWeighting(platformsArray[i].audienceWeightings, audienceCategory, useRawWeighting);
            if (i < platformsArray.length - 1) {
                currentMultiplatformFactor *= GameFlags.MULTIPLATFORM_WEIGHTING;
                accumulatedWeightedScore += currentPlatformAudienceWeighting * currentMultiplatformFactor;
                remainingWeightToDistribute -= currentMultiplatformFactor;
            } else {
                accumulatedWeightedScore += currentPlatformAudienceWeighting * remainingWeightToDistribute;
            }
        }
        return accumulatedWeightedScore;
    };

    // Lấy trọng số đối tượng khán giả (thô hoặc đã chuẩn hóa) cho một nền tảng cụ thể.
    Platforms.getPlatformsAudienceWeighting = function (platformAudienceWeightings, targetAudienceCategory, useRawWeighting) {
        // Nếu không có đối tượng khán giả hoặc trọng số nền tảng, trả về giá trị mặc định
        // (0.8 nếu là thô, 1 nếu đã chuẩn hóa - logic này có vẻ hơi lạ, cần xem xét lại)
        if (void 0 === targetAudienceCategory || void 0 === platformAudienceWeightings) return useRawWeighting ? 0.8 : 1;

        // Trả về trọng số dựa trên đối tượng khán giả
        if ("young" === targetAudienceCategory) return useRawWeighting ? platformAudienceWeightings[0] : Platforms.getNormalizedAudienceWeighting(platformAudienceWeightings[0]);
        if ("everyone" === targetAudienceCategory) return useRawWeighting ? platformAudienceWeightings[1] : Platforms.getNormalizedAudienceWeighting(platformAudienceWeightings[1]);
        if ("mature" === targetAudienceCategory) return useRawWeighting ? platformAudienceWeightings[2] : Platforms.getNormalizedAudienceWeighting(platformAudienceWeightings[2]);
        throw "unknown audience: " + targetAudienceCategory; // Ném lỗi nếu đối tượng không xác định
    };

    // Kiểm tra xem một nền tảng có hỗ trợ kích thước game nhất định không.
    // Ví dụ: Các nền tảng cầm tay thường không hỗ trợ game AAA.
    Platforms.doesPlatformSupportGameSize = function (platform, gameSize) {
        // Nếu kích thước game không phải là 'small' hoặc 'medium' (tức là 'large' hoặc 'aaa')
        return "small" != gameSize && "medium" != gameSize ?
            // Kiểm tra xem nền tảng có phải là một trong các nền tảng cầm tay bị giới hạn không
            "Gameling" != platform.id && "Vena Gear" != platform.id && "grPhone" != platform.id && "PPS" != platform.id && "GS" != platform.id :
            true; // Mặc định là true cho game 'small' và 'medium'
    };

    // Lấy danh sách các nền tảng hiện đang có trên thị trường (chưa bị ngừng hỗ trợ và đã phát hành).
    Platforms.getPlatformsOnMarket = function (company) {
        return Platforms.getPlatforms(company).filter(function (platform) {
            // Điều kiện cho nền tảng định nghĩa sẵn: chưa bị ngừng hỗ trợ
            var isPredefinedPlatformActive = Platforms.getRetireDate(platform) > Math.floor(GameManager.company.currentWeek) && !platform.isCustom;
            // Điều kiện cho nền tảng tùy chỉnh: đã phát hành và chưa bán hết (soldOut)
            var isCustomPlatformActive = true === platform.isCustom && GameManager.company.currentWeek > General.getWeekFromDateString(platform.published) && !platform.soldOut;
            return isPredefinedPlatformActive || isCustomPlatformActive;
        });
    };

    // Lấy danh sách các nền tảng.
    // `includeAllPredefined`:
    //    - Nếu true: trả về TẤT CẢ nền tảng định nghĩa sẵn (Platforms.allPlatforms) CỘNG với các nền tảng công ty đã cấp phép (bao gồm cả tùy chỉnh).
    //    - Nếu false (hoặc không truyền): trả về các nền tảng công ty có thể sử dụng (availablePlatforms) CỘNG với các nền tảng đã cấp phép.
    Platforms.getPlatforms = function (company, includeAllPredefined) {
        return includeAllPredefined ? Platforms.allPlatforms.concat(company.licencedPlatforms) :
            company.availablePlatforms.concat(company.licencedPlatforms);
    };
})();