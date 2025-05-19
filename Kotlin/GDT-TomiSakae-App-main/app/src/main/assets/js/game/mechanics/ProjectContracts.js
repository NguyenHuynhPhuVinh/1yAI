// --- START OF FILE ProjectContracts.js --- //
// Module ProjectContracts chịu trách nhiệm quản lý và tạo ra các hợp đồng trong game,
// bao gồm cả hợp đồng chung (generic) và hợp đồng với nhà phát hành (publisher).
var ProjectContracts = {};
(function () {
    // 'projectContractsModuleScope' là một tham chiếu đến 'ProjectContracts' để dễ dàng truy cập trong scope của IIFE này.
    var projectContractsModuleScope = ProjectContracts;

    // Hàm getAvailable: Lấy danh sách các hợp đồng khả dụng cho công ty dựa trên loại hợp đồng.
    // Tham số:
    // - company: Đối tượng công ty của người chơi.
    // - contractTypeFilter: Loại hợp đồng cần lọc (ví dụ: "generic", "gameContract").
    // Trả về: Mảng các đối tượng hợp đồng khả dụng.
    projectContractsModuleScope.getAvailable = function (company, contractTypeFilter) {
        var availableContractsList = []; // Danh sách các hợp đồng khả dụng sẽ được trả về.
        // Lọc tất cả các hợp đồng để chỉ lấy những hợp đồng phù hợp với loại và điều kiện của công ty.
        var allFilteredContracts = projectContractsModuleScope.getAllContracts().filter(function (contractDefinition) {
            return (!contractDefinition.type || contractDefinition.type == contractTypeFilter) && // Kiểm tra loại hợp đồng.
                contractDefinition.isAvailable && contractDefinition.isAvailable(company); // Kiểm tra xem hợp đồng có khả dụng với công ty hiện tại không.
        });

        // Duyệt qua các định nghĩa hợp đồng đã lọc để tạo ra các instance hợp đồng cụ thể.
        for (var i = 0; i < allFilteredContracts.length; i++) {
            var contractInstance = allFilteredContracts[i].getContract(company); // Gọi hàm getContract của mỗi định nghĩa để lấy instance.
            // Nếu getContract trả về một mảng (ví dụ: nhiều hợp đồng được tạo từ một định nghĩa), thêm tất cả vào danh sách.
            // Nếu không, thêm instance đơn lẻ vào danh sách.
            contractInstance instanceof Array ? availableContractsList.addRange(contractInstance) : availableContractsList.push(contractInstance);
        }
        return availableContractsList;
    };

    // Hàm getAllContracts: Lấy tất cả các định nghĩa hợp đồng được lưu trong module ProjectContracts.
    // Trả về: Mảng các đối tượng định nghĩa hợp đồng.
    projectContractsModuleScope.getAllContracts = function () {
        var allContractsArray = [];
        var propertyName;
        // Duyệt qua tất cả các thuộc tính của projectContractsModuleScope.
        for (propertyName in projectContractsModuleScope)
            if (projectContractsModuleScope.hasOwnProperty(propertyName)) {
                var propertyValue = projectContractsModuleScope[propertyName];
                // Nếu thuộc tính có 'id' (đây là một quy ước để xác định một định nghĩa hợp đồng), thêm nó vào mảng.
                void 0 != propertyValue.id && allContractsArray.push(propertyValue);
            }
        return allContractsArray;
    };

    // Mảng các mẫu hợp đồng nhỏ (small contracts).
    // Mỗi đối tượng chứa thông tin như tên, mô tả, và các hệ số (factor) cho Design (dF), Tech (tF), Research (rF).
    var smallContractTemplates = [{
        name: "Logo Animation".localize("heading"),
        description: "Create an animation for an existing logo.".localize(),
        tF: 1,    // Tech Factor
        dF: 2.5,  // Design Factor
        rF: 1.5   // Research Factor
    }, {
        name: "Character Design".localize("heading"),
        description: "Design some game characters.".localize(),
        tF: 1,
        dF: 4.5,
        rF: 1.5
    }, {
        name: "Playtest".localize("heading"),
        description: "Help to playtest a game.".localize(),
        tF: 1,
        dF: 1,
        rF: 1.5
    }, {
        name: "Game Backdrops".localize("heading"),
        description: "Design some simple background graphics for a game.".localize(),
        tF: 1,
        dF: 2,
        rF: 1.5
    }, {
        name: "Setup Computers".localize("heading"),
        description: "Install Mirconoft BOSS on computers".localize(),
        tF: 2,
        dF: 0.4
    }, {
        name: "Debug program".localize("heading"),
        description: "Help debugging a convoluted BASE program.".localize(),
        tF: 2,
        dF: 0.2
    }, {
        name: "Spritesheet Software".localize("heading"),
        description: "Our staff needs to be taught how to use these modern technologies.".localize(),
        tF: 3,
        dF: 2
    }, {
        name: "Library Software".localize("heading"),
        description: "Develop a simple library management system".localize(),
        tF: 5,
        dF: 1
    }];

    // Mảng các mẫu hợp đồng vừa (medium contracts).
    var mediumContractTemplates = [{
        name: "Usability Study".localize("heading"),
        description: "Perform a detailed usability study.".localize(),
        tF: 5,
        dF: 6.5
    }, {
        name: "Review Game Concept".localize("heading"),
        description: "Review a game concept using your expertise.".localize(),
        tF: 3,
        dF: 8,
        rF: 1.5
    }, {
        name: "Game Art".localize("heading"),
        description: "Help out on a project with some game art".localize(),
        tF: 5,
        dF: 6,
        rF: 1.5
    }, {
        name: "Clean up database".localize("heading"),
        description: "Should one table really have 200 columns? Probably not.".localize(),
        tF: 5,
        dF: 1
    }, {
        name: "Accounting Software".localize("heading"),
        description: "Develop a simple accounting software. Are those ever simple?".localize(),
        tF: 5,
        dF: 1
    }, {
        name: "Time Tracking".localize("heading"),
        description: "Design and develop a time tracking system.".localize(),
        tF: 3,
        dF: 1
    }, {
        name: "Design a board game".localize("heading"),
        description: "Let's see how your skills translate to traditional games.".localize(),
        dF: 5,
        tF: 0.2,
        rF: 2
    }, {
        name: "Horoscope Generator".localize("heading"),
        description: "Making up horoscopes is hard work. We want it automated.".localize(),
        dF: 5,
        tF: 1
    }, {
        name: "Character Dialogues".localize("heading"),
        description: "Improve our character dialogues.".localize(),
        dF: 5,
        tF: 1,
        rF: 1.4
    }, {
        name: "Futuristic Application".localize("heading"),
        description: "We need an application that looks futuristic for a movie.".localize(),
        dF: 3,
        tF: 2,
        rF: 1.5
    }, {
        name: "Vacuum Robot".localize("heading"),
        description: "Create a revolutionary AI for a vacuum robot".localize(),
        tF: 2,
        dF: 1.4
    }, {
        name: "Website".localize("heading"),
        description: "We just heard of this thing called internet. We want to have one.".localize(),
        tF: 2,
        dF: 1.3
    }];

    // Mảng các mẫu hợp đồng lớn (large contracts).
    var largeContractTemplates = [{
        name: "Game Port".localize("heading"),
        description: "Port a game to a different platform.".localize(),
        tF: 3.2,
        dF: 1.7,
        rF: 1.2
    }, {
        name: "Cut Scenes".localize("heading"),
        description: "Deliver professional cut scenes for a game.".localize(),
        tF: 1,
        dF: 1,
        rF: 1.5
    }, {
        name: "Space Shuttle".localize("heading"),
        description: "Deliver part of the space shuttle control software.".localize(),
        tF: 3,
        dF: 2
    }, {
        name: "Alien Search".localize("heading"),
        description: "Optimize our search for alien life forms using advanced AI techniques.".localize(),
        tF: 3,
        dF: 1.8,
        rF: 1.3
    }, {
        name: "Movies".localize("heading"),
        description: "We need your skills in our latest blockbuster production.".localize(),
        tF: 1,
        dF: 1,
        rF: 1.5
    }];

    // Định nghĩa cho loại hợp đồng chung (generic contracts).
    projectContractsModuleScope.genericContracts = {
        id: "genericContracts",
        type: "generic", // Loại hợp đồng.
        isAvailable: function (company) { // Hàm kiểm tra xem loại hợp đồng này có khả dụng không.
            return true; // Hợp đồng chung luôn khả dụng.
        },
        // Hàm tạo ra danh sách các hợp đồng chung cụ thể.
        getContract: function (company) {
            var smallContractSettings = getContractSettingsForSize(company, "small");
            var rngSeed = getOrUpdateSeed(smallContractSettings); // Lấy hoặc cập nhật seed cho việc tạo ngẫu nhiên.
            var mersenneTwisterInstance = new MersenneTwister(rngSeed); // Khởi tạo bộ tạo số ngẫu nhiên.

            // Tạo danh sách hợp đồng nhỏ.
            var finalContractList = generateRandomContracts(smallContractSettings, smallContractTemplates, "small", 4);
            // Nếu cờ mediumContractsEnabled được bật, thêm các hợp đồng vừa.
            if (company.flags.mediumContractsEnabled) {
                var mediumContractSettings = getContractSettingsForSize(company, "medium");
                finalContractList.addRange(generateRandomContracts(mediumContractSettings, mediumContractTemplates, "medium", 3));
            }
            // Nếu cờ largeContractsEnabled được bật, thêm các hợp đồng lớn.
            if (company.flags.largeContractsEnabled) {
                var largeContractSettings = getContractSettingsForSize(company, "large");
                finalContractList.addRange(generateRandomContracts(largeContractSettings, largeContractTemplates, "large", 2));
            }
            // Xáo trộn danh sách hợp đồng và lọc bỏ những hợp đồng có cờ 'skip'.
            return finalContractList.shuffle(mersenneTwisterInstance).filter(function (contract) {
                return !contract.skip;
            });
        },
        // Hàm được gọi khi một hợp đồng chung hoàn thành.
        // Tham số:
        // - company: Đối tượng công ty.
        // - isSuccessful: Boolean, true nếu hợp đồng thành công, false nếu thất bại.
        // - completedContract: Đối tượng hợp đồng đã hoàn thành.
        complete: function (company, isSuccessful, completedContract) {
            // Ghi lại index của hợp đồng đã hoàn thành vào cài đặt của kích thước hợp đồng tương ứng.
            getContractSettingsForSize(company, completedContract.size).contractsDone.push(completedContract.index);
            // Tạo và thêm thông báo thành công hoặc thất bại.
            isSuccessful ? company.notifications.push(createSuccessNotification(completedContract)) : company.notifications.push(createFailureNotification(completedContract));
            // Thông báo cho GameManager rằng hợp đồng đã kết thúc.
            GameManager.contractFinished(isSuccessful);
        }
    };

    // Hàm initializeContractSettings: Khởi tạo hoặc đặt lại cài đặt cho một nhóm hợp đồng.
    // Các cài đặt bao gồm seed ngẫu nhiên, thời gian hết hạn, và danh sách các hợp đồng đã hoàn thành.
    var initializeContractSettings = function (contractSettings) {
        contractSettings.seed = Math.floor(65535 * Math.random()); // Tạo seed ngẫu nhiên mới.
        contractSettings.expireBy = GameManager.gameTime + 24E3 * GameManager.SECONDS_PER_WEEK; // Đặt thời gian hết hạn.
        contractSettings.contractsDone = []; // Đặt lại danh sách hợp đồng đã hoàn thành.
    };

    // Hàm getOrUpdateSeed: Lấy seed hiện tại hoặc tạo mới nếu đã hết hạn hoặc chưa có.
    // Tham số:
    // - contractSettings: Đối tượng cài đặt hợp đồng.
    // Trả về: Seed ngẫu nhiên.
    var getOrUpdateSeed = function (contractSettings) {
        // Nếu đã có seed và chưa hết hạn, hoặc chưa có seed thì khởi tạo mới.
        if (contractSettings.seed) {
            if (contractSettings.expireBy <= GameManager.gameTime) {
                initializeContractSettings(contractSettings);
                contractSettings.initialSettings = false; // Đánh dấu là không phải cài đặt ban đầu nữa.
            }
        } else {
            initializeContractSettings(contractSettings);
            contractSettings.initialSettings = true; // Đánh dấu là cài đặt ban đầu.
        }
        return contractSettings.seed;
    };

    // Hàm generateRandomContracts: Tạo ra một số lượng hợp đồng ngẫu nhiên từ các mẫu cho trước.
    // Tham số:
    // - contractSettings: Đối tượng cài đặt hợp đồng.
    // - contractTemplatesArray: Mảng các mẫu hợp đồng.
    // - contractSizeName: Tên kích thước hợp đồng ("small", "medium", "large").
    // - numberOfContractsToGenerate: Số lượng hợp đồng tối đa cần tạo.
    // Trả về: Mảng các đối tượng hợp đồng được tạo.
    var generateRandomContracts = function (contractSettings, contractTemplatesArray, contractSizeName, maxContractsToGenerate) {
        var rngSeed = getOrUpdateSeed(contractSettings);
        var mersenneTwisterInstance = new MersenneTwister(rngSeed);
        var generatedContractsList = [];
        var templatesCopy = contractTemplatesArray.slice(); // Tạo bản sao của mảng mẫu để không làm thay đổi mảng gốc.
        // Lấy một số lượng ngẫu nhiên các hợp đồng cần tạo, không vượt quá maxContractsToGenerate.
        var actualContractsToGenerate = getRandomCount(mersenneTwisterInstance, maxContractsToGenerate);
        // Nếu là lần cài đặt ban đầu, đảm bảo tạo ít nhất 1 hợp đồng.
        if (contractSettings.initialSettings) {
            actualContractsToGenerate = Math.max(1, actualContractsToGenerate);
        }

        for (var i = 0; i < actualContractsToGenerate && templatesCopy.length > 0; i++) {
            var pickedTemplate = templatesCopy.pickRandom(mersenneTwisterInstance); // Chọn ngẫu nhiên một mẫu.
            templatesCopy.remove(pickedTemplate); // Xóa mẫu đã chọn để không bị lặp lại.

            var currentContractSizeName = contractSizeName;
            var randomNumberGenerator = mersenneTwisterInstance; // Sử dụng lại instance của MersenneTwister.
            var randomFactor1 = randomNumberGenerator.random();
            // Thêm một yếu tố ngẫu nhiên nữa nếu số ngẫu nhiên ban đầu lớn.
            if (randomNumberGenerator.random() > 0.8) {
                randomFactor1 += randomNumberGenerator.random();
            }

            var basePointValue = 11; // Giá trị điểm cơ bản cho hợp đồng.
            if (currentContractSizeName == "medium") basePointValue = 30;
            else if (currentContractSizeName == "large") basePointValue = 100;
            // Tăng giá trị điểm cơ bản nếu công ty có hơn 2 nhân viên (chỉ áp dụng cho hợp đồng vừa).
            if (basePointValue == 12 && GameManager.company.staff.length > 2) { // Lưu ý: có vẻ logic này nên là basePointValue == 30 (medium)
                basePointValue += 6;
            }
            // Điều chỉnh giá trị điểm dựa trên năm hiện tại của game.
            var yearFactor = GameManager.company.getCurrentDate().year / 25;
            basePointValue = basePointValue + basePointValue * yearFactor;

            var adjustedBasePoints = basePointValue + basePointValue * randomFactor1; // Tổng điểm yêu cầu sau khi điều chỉnh.
            // Phân chia tổng điểm yêu cầu cho Design và Tech dựa trên hệ số của mẫu.
            var totalFactor = pickedTemplate.dF + pickedTemplate.tF;
            var requiredDesignPoints = adjustedBasePoints / totalFactor * pickedTemplate.dF;
            var requiredTechPoints = adjustedBasePoints / totalFactor * pickedTemplate.tF;

            // Thêm yếu tố ngẫu nhiên cho điểm Design và Tech.
            requiredDesignPoints = requiredDesignPoints + requiredDesignPoints * 0.2 * randomNumberGenerator.random() * randomNumberGenerator.randomSign();
            requiredTechPoints = requiredTechPoints + requiredTechPoints * 0.2 * randomNumberGenerator.random() * randomNumberGenerator.randomSign();

            requiredDesignPoints = Math.floor(requiredDesignPoints);
            requiredTechPoints = Math.floor(requiredTechPoints);

            // Tính toán tiền thưởng và phạt.
            var paymentAmount = adjustedBasePoints * 1000;
            paymentAmount = paymentAmount / 1000; // Làm tròn đến hàng nghìn.
            paymentAmount = Math.floor(paymentAmount) * 1000;

            var weeksToFinish = Math.floor(3 + randomNumberGenerator.random() * 7);
            if (currentContractSizeName === "small") { // Hợp đồng nhỏ có thời gian hoàn thành ngắn hơn.
                weeksToFinish = Math.floor(3 + randomNumberGenerator.random() * 3);
            }

            var penaltyAmount = paymentAmount * 0.2 + paymentAmount * 0.3 * randomNumberGenerator.random();
            penaltyAmount /= 1000; // Làm tròn đến hàng nghìn.
            penaltyAmount = Math.floor(penaltyAmount) * 1000;

            // Tạo đối tượng hợp đồng.
            var contractInstance = {
                name: pickedTemplate.name,
                description: pickedTemplate.description,
                requiredD: requiredDesignPoints,
                requiredT: requiredTechPoints,
                spawnedD: 0, // Số điểm design đã tạo.
                spawnedT: 0, // Số điểm tech đã tạo.
                payment: paymentAmount,
                penalty: -penaltyAmount, // Phạt là số âm.
                weeksToFinish: weeksToFinish,
                rF: pickedTemplate.rF, // Research factor (nếu có).
                isGeneric: true, // Đánh dấu là hợp đồng chung.
                size: currentContractSizeName
            };
            contractInstance.id = "genericContracts"; // ID chung cho loại hợp đồng này.
            contractInstance.index = i; // Index của hợp đồng trong danh sách được tạo ra lần này.
            // Nếu hợp đồng này đã từng được hoàn thành (lưu trong contractSettings), đánh dấu để bỏ qua.
            if (contractSettings.contractsDone && contractSettings.contractsDone.indexOf(i) != -1) {
                contractInstance.skip = true;
            }
            generatedContractsList.push(contractInstance);
        }
        return generatedContractsList;
    };

    // Hàm createSuccessNotification: Tạo thông báo khi hợp đồng hoàn thành thành công.
    var createSuccessNotification = function (contractInfo) {
        var successMessages = ["Thank you for taking care of this for us.".localize(), "Well done.".localize(), "Just what we wanted.".localize(), "Excellent work.".localize(), "Thank you for the quick work.".localize(), "Would hire again.".localize(),
        "Nice job.".localize(), "Success!".localize()
        ];
        var notificationObject = new Notification({
            header: "Contract Successful".localize("heading"),
            text: successMessages.pickRandom() + "\n" + "We will transfer {0} to your account.".localize().format(UI.getShortNumberString(contractInfo.payment)),
            weeksUntilFired: 0.2, // Thông báo sẽ xuất hiện sau 0.2 tuần.
            previewImage: "./images/notificationIcons/icon_notification_new_money.png"
        });
        // Thêm hành động điều chỉnh tiền mặt vào thông báo.
        notificationObject.adjustCash(contractInfo.payment, "contract payment".localize("heading"));
        return notificationObject;
    };

    // Hàm createFailureNotification: Tạo thông báo khi hợp đồng thất bại.
    var createFailureNotification = function (contractInfo) {
        var failureMessages = ["This is very disappointing.".localize(), "You didn't complete the contract on time".localize(),
        "Hope you can make it next time.".localize(), "Seems like this was too big of a job for you.".localize(), "Unfortunately the deadline is here.".localize()
        ];
        var penaltyAmount = contractInfo.penalty; // Lấy số tiền phạt.
        var notificationObject = new Notification({
            header: "Contract Failed".localize("heading"),
            text: failureMessages.pickRandom() + "\n" + "A penalty of {0} will be applied to your account.".localize().format(UI.getShortNumberString(penaltyAmount)),
            weeksUntilFired: 0.2,
            previewImage: "./images/notificationIcons/icon_notification_new_money_penalty.png",
            type: NotificationType.AutoPopup // Thông báo tự động hiện ra.
        });
        // Thêm hành động điều chỉnh tiền mặt (trừ tiền phạt) vào thông báo.
        notificationObject.adjustCash(penaltyAmount, "contract penalty".localize("heading"));
        return notificationObject;
    };

    // Hàm getContractSettingsForSize: Lấy hoặc tạo đối tượng cài đặt cho một kích thước hợp đồng cụ thể.
    // Các cài đặt này được lưu trong cờ (flags) của công ty.
    var getContractSettingsForSize = function (company, sizeName) {
        var settingsKey = "contracts" + sizeName; // Tạo khóa để lưu cài đặt, ví dụ: "contractssmall".
        var contractSettingsObject = company.flags[settingsKey];
        // Nếu chưa có đối tượng cài đặt, tạo mới.
        if (!contractSettingsObject) {
            contractSettingsObject = { id: settingsKey };
            company.flags[settingsKey] = contractSettingsObject;
        }
        return contractSettingsObject;
    };

    // Định nghĩa cho loại hợp đồng với nhà phát hành (publisher contracts).
    projectContractsModuleScope.publisherContracts = {
        id: "publisherContracts",
        type: "gameContract", // Loại hợp đồng.
        isAvailable: function (company) {
            return true; // Luôn khả dụng (điều kiện cụ thể hơn có thể được kiểm tra ở nơi khác).
        },
        // Hàm tạo ra danh sách các hợp đồng với nhà phát hành cụ thể.
        getContract: function (company) {
            var publisherContractSettings = getContractSettingsForSize(company, "publisher");
            // Tạo danh sách hợp đồng, tối đa 5 hợp đồng.
            return generatePublisherContracts(company, publisherContractSettings, 5).filter(function (contract) {
                return !contract.skip; // Lọc bỏ những hợp đồng có cờ 'skip'.
            });
        },
        // Hàm được gọi khi một hợp đồng với nhà phát hành hoàn thành.
        // Tham số:
        // - company: Đối tượng công ty.
        // - meetsRating: Boolean, true nếu game đạt điểm yêu cầu, false nếu không.
        // - completedGameContract: Đối tượng hợp đồng đã hoàn thành.
        complete: function (company, meetsRating, completedGameContract) {
            var messageText;
            // Chọn thông điệp dựa trên việc game có đạt điểm yêu cầu không.
            meetsRating ? messageText = ["The game meets the required ratings. We are looking forward to future business.".localize()].pickRandom()
                : messageText = ["The game doesn't live up to expectations.\nAs per contract a penalty will be applied to your account.".localize()].pickRandom();

            var notificationObject = new Notification({
                header: "Publisher".localize("heading"),
                text: completedGameContract.publisher + ": " + messageText,
                weeksUntilFired: 2 + company.getRandom() * 2, // Thời gian xuất hiện thông báo ngẫu nhiên.
                previewImage: "./images/notificationIcons/icon_notification_new_money.png"
            });
            // Nếu không đạt điểm, thêm hành động trừ tiền phạt.
            if (!meetsRating) {
                notificationObject.adjustCash(-completedGameContract.penalty, "contract penalty".localize("heading"));
                notificationObject.previewImage = "./images/notificationIcons/icon_notification_new_money_penalty.png";
                notificationObject.type = NotificationType.AutoPopup;
            }
            company.notifications.push(notificationObject);
        }
    };

    // Hàm getRandomCount: Trả về một số lượng ngẫu nhiên, không vượt quá maxCount và ít nhất là maxCount-1.
    var getRandomCount = function (mersenneTwisterInstance, maxCount) {
        var randomNumber = mersenneTwisterInstance.random();
        return Math.max(maxCount - 1, Math.floor(randomNumber * maxCount));
    };

    // Mảng các tên nhà phát hành mẫu.
    var publisherNameTemplates = [{
        id: "ActiveVisionaries",
        name: "Active Visionaries"
    }, {
        id: "ea",
        name: "Electronic Mass Productions"
    }, {
        id: "RockvilleSoftworks",
        name: "Rockville Softworks"
    }, {
        id: "BlueBitGames",
        name: "Blue Bit Games"
    }, {
        id: "CapeCom",
        name: "CapeCom"
    }, {
        id: "Codemeisters",
        name: "Codemeisters"
    }, {
        id: "DeepPlatinum",
        name: "Deep Platinum"
    }, {
        id: "InfroGames",
        name: "InfroGames"
    }, {
        id: "LoWoodProductions",
        name: "LoWood Productions"
    }, {
        id: "TGQ",
        name: "TGQ"
    }, {
        id: "\u00dcberSoft", // Chú ý ký tự đặc biệt.
        name: "\u00dcberSoft"
    }];

    // Hàm generatePublisherContracts: Tạo ra danh sách các hợp đồng với nhà phát hành.
    // Tham số:
    // - company: Đối tượng công ty.
    // - publisherSettings: Đối tượng cài đặt cho hợp đồng nhà phát hành.
    // - numberOfContractsToGenerate: Số lượng hợp đồng cần tạo.
    // Trả về: Mảng các đối tượng hợp đồng nhà phát hành.
    var generatePublisherContracts = function (company, publisherSettings, numberOfContractsToGenerate) {
        var generatedContractsList = [];
        var originalSeed = publisherSettings.seed; // Lưu lại seed ban đầu.
        var mersenneTwisterInstance = new MersenneTwister(getOrUpdateSeed(publisherSettings)); // Lấy hoặc tạo seed mới.
        // Nếu seed đã thay đổi (do hết hạn), làm mới danh sách topic, platform đã lưu.
        if (publisherSettings.seed != originalSeed) {
            publisherSettings.topics = undefined;
            publisherSettings.researchedTopics = undefined;
            publisherSettings.excludes = undefined;
            publisherSettings.platforms = undefined;
        }

        var availableTopicsForResearch, researchedTopics, allPlatforms, availablePlatformsForContracts;
        // Nếu chưa có danh sách topic, platform đã lưu, tạo mới.
        if (publisherSettings.topics && publisherSettings.researchedTopics && publisherSettings.platforms) {
            // Tải lại danh sách từ ID đã lưu.
            availableTopicsForResearch = publisherSettings.topics.map(function (topicId) {
                return Topics.topics.first(function (topic) { return topic.id === topicId; });
            });
            researchedTopics = publisherSettings.researchedTopics.map(function (topicId) {
                return Topics.topics.first(function (topic) { return topic.id === topicId; });
            });
            allPlatforms = Platforms.getPlatforms(company, true);
            availablePlatformsForContracts = publisherSettings.platforms.map(function (platformId) {
                return allPlatforms.first(function (platform) { return platform.id === platformId; });
            });
        } else {
            // Tạo mới danh sách topic, platform.
            availableTopicsForResearch = company.topics.slice();
            availableTopicsForResearch.addRange(General.getTopicsAvailableForResearch(company));
            publisherSettings.topics = availableTopicsForResearch.map(function (topic) { return topic.id; });

            researchedTopics = company.topics.map(function (topic) { return topic.id; }); // Chỉ các topic đã nghiên cứu.
            publisherSettings.researchedTopics = researchedTopics;

            availablePlatformsForContracts = Platforms.getPlatformsOnMarket(company).filter(function (platform) {
                // Lọc bỏ các platform tùy chỉnh và những platform không hỗ trợ game cỡ vừa trở lên.
                return !platform.isCustom && Platforms.doesPlatformSupportGameSize(platform, "medium");
            });
            publisherSettings.platforms = availablePlatformsForContracts.map(function (platform) { return platform.id; });

            // Tạo danh sách loại trừ (để tránh lặp lại hợp đồng quá giống game vừa phát hành).
            publisherSettings.excludes = [];
            var lastReleasedGame = company.gameLog.last();
            if (lastReleasedGame) {
                publisherSettings.excludes.push({
                    genre: lastReleasedGame.genre.id,
                    topic: lastReleasedGame.topic.id
                });
            }
        }

        var exclusionListCopy = publisherSettings.excludes.slice(); // Tạo bản sao danh sách loại trừ.
        // Lấy số lượng hợp đồng ngẫu nhiên cần tạo.
        numberOfContractsToGenerate = getRandomCount(mersenneTwisterInstance, numberOfContractsToGenerate);
        if (publisherSettings.initialSettings) { // Nếu là lần cài đặt đầu, tạo ít nhất 1.
            numberOfContractsToGenerate = Math.max(1, numberOfContractsToGenerate);
        }

        var gameSizeOptions = ["medium"];
        if (company.canDevelopLargeGames()) {
            gameSizeOptions.addRange(["large", "large", "large"]); // Thêm tùy chọn game lớn nếu công ty có khả năng.
        }
        var targetAudienceOptions = ["young", "everyone", "mature"];
        var basePaymentByGameSize = { medium: 15E4, large: 75E4 }; // Tiền trả trước cơ bản theo kích thước game.

        for (var i = 0; i < numberOfContractsToGenerate; i++) {
            var randomScoreFactor = 0; // Hệ số điểm ngẫu nhiên.
            var pickedGenre = undefined, pickedTopic = undefined;

            // Chọn thể loại ngẫu nhiên (70% khả năng).
            if (mersenneTwisterInstance.random() >= 0.7) {
                pickedGenre = General.getAvailableGenres(company).pickRandom(mersenneTwisterInstance);
                randomScoreFactor += 0.1;
            }
            // Chọn topic ngẫu nhiên (70% khả năng).
            if (mersenneTwisterInstance.random() >= 0.7) {
                // Vòng lặp để đảm bảo không chọn topic/genre đã có trong danh sách loại trừ.
                do {
                    // Ưu tiên chọn topic chưa nghiên cứu (70%), còn lại chọn topic bất kỳ.
                    if (mersenneTwisterInstance.random() >= 0.7) {
                        pickedTopic = availableTopicsForResearch.except(researchedTopics).pickRandom(mersenneTwisterInstance);
                    } else {
                        pickedTopic = availableTopicsForResearch.pickRandom(mersenneTwisterInstance);
                    }
                    if (pickedTopic === undefined) break; // Nếu không còn topic nào để chọn.
                } while (exclusionListCopy.some(function (item) {
                    return (pickedGenre === undefined || item.genre === pickedGenre.id) && item.topic === pickedTopic.id;
                }));
                if (pickedTopic !== undefined) {
                    randomScoreFactor += 0.1;
                }
            }
            // Nếu đã chọn topic hoặc genre, thêm vào danh sách loại trừ để tránh lặp lại.
            if (pickedGenre || pickedTopic) {
                exclusionListCopy.push({
                    genre: pickedGenre ? pickedGenre.id : undefined,
                    topic: pickedTopic ? pickedTopic.id : undefined
                });
            }

            var pickedPlatform = undefined;
            // Chọn platform ngẫu nhiên (70% khả năng).
            if (mersenneTwisterInstance.random() >= 0.7) {
                pickedPlatform = availablePlatformsForContracts.pickRandom(mersenneTwisterInstance);
            }
            var pickedAudience = undefined;
            // Nếu công ty có thể đặt đối tượng mục tiêu, chọn ngẫu nhiên (20% khả năng).
            if (company.canSetTargetAudience() && mersenneTwisterInstance.random() >= 0.2) {
                pickedAudience = targetAudienceOptions.pickRandom(mersenneTwisterInstance);
            }

            randomScoreFactor = randomScoreFactor + mersenneTwisterInstance.random() * 0.8; // Thêm yếu tố ngẫu nhiên vào hệ số điểm.
            var minScoreRequired = 4 + Math.floor(5 * randomScoreFactor); // Tính điểm tối thiểu yêu cầu.
            var pickedGameSize;
            // Chọn kích thước game, đảm bảo platform (nếu có) hỗ trợ kích thước đó.
            do {
                pickedGameSize = gameSizeOptions.pickRandom(mersenneTwisterInstance);
            } while (pickedPlatform !== undefined && !Platforms.doesPlatformSupportGameSize(pickedPlatform, pickedGameSize));

            // Tính toán tiền trả trước và tiền phạt.
            var upfrontPayment = minScoreRequired / 10 * basePaymentByGameSize[pickedGameSize];
            upfrontPayment = upfrontPayment / 5000; // Làm tròn đến 5000.
            upfrontPayment = Math.max(1, Math.floor(upfrontPayment)) * 5000;

            var penaltyAmount = upfrontPayment * 1.2 + upfrontPayment * 1.8 * mersenneTwisterInstance.random();
            penaltyAmount = penaltyAmount / 5000; // Làm tròn đến 5000.
            penaltyAmount = Math.floor(penaltyAmount) * 5000;

            var publisherName;
            // Chọn tên nhà phát hành ngẫu nhiên (20% khả năng chọn từ platform, còn lại từ danh sách mẫu).
            if (pickedPlatform && pickedPlatform.company && mersenneTwisterInstance.random() >= 0.2) {
                publisherName = pickedPlatform.company;
            } else {
                publisherName = publisherNameTemplates.pickRandom(mersenneTwisterInstance).name;
            }

            var royaltyRate = Math.floor(7 + 8 * randomScoreFactor) / 100; // Tính tỷ lệ hoa hồng.
            // Tạo tên hợp đồng dựa trên topic và genre (nếu có).
            var contractName = (pickedTopic ? pickedTopic.name : "Any Topic".localize());
            contractName += " / " + (pickedGenre ? pickedGenre.name : "Any Genre".localize());

            // Nếu platform không tồn tại (ví dụ: đã bị gỡ khỏi thị trường), tăng số lượng hợp đồng cần tạo để bù lại.
            if (!pickedPlatform || !Platforms.getPlatformsOnMarket(company).first(function (platform) { return platform.id === pickedPlatform.id; })) {
                numberOfContractsToGenerate++;
            } else {
                // Tạo đối tượng hợp đồng nhà phát hành.
                generatedContractsList.push({
                    id: "publisherContracts", // ID chung cho loại hợp đồng này.
                    refNumber: Math.floor(65535 * Math.random()), // Số tham chiếu ngẫu nhiên.
                    type: "gameContract", // Loại hợp đồng.
                    name: contractName,
                    description: "Publisher: {0}".localize().format(publisherName),
                    publisher: publisherName,
                    topic: pickedTopic ? pickedTopic.id : pickedTopic,
                    genre: pickedGenre ? pickedGenre.id : pickedGenre,
                    platform: pickedPlatform ? pickedPlatform.id : undefined,
                    gameSize: pickedGameSize,
                    gameAudience: pickedAudience,
                    minScore: minScoreRequired,
                    payment: upfrontPayment,
                    penalty: penaltyAmount,
                    royaltyRate: royaltyRate
                });
            }
        }
        return generatedContractsList;
    };
})();
// --- END OF FILE ProjectContracts.js --- //