"use strict";
var Media = {};
(function () {
    // Đặt bí danh cho Media để dễ sử dụng trong scope của IIFE
    var mediaModule = Media;

    /**
     * Lấy các thông báo mới (bao gồm trigger notifications và scheduled notifications).
     * @param {Company} companyInstance - Instance của công ty hiện tại.
     * @returns {Array<Notification>} Mảng các đối tượng Notification mới.
     */
    mediaModule.getNewNotifications = function (companyInstance) {
        var newNotifications = [];
        // Lọc ra các TriggerNotifications chưa được hiển thị và thỏa mãn điều kiện trigger
        var triggerableNotifications = Media.TriggerNotifications.filter(function (notificationDefinition) {
            return -1 === companyInstance.triggerNotificationsShown.indexOf(notificationDefinition.id) && notificationDefinition.trigger(companyInstance);
        });

        // Thêm các triggerableNotifications vào danh sách newNotifications
        for (var i = 0; i < triggerableNotifications.length; i++) {
            var currentNotificationDef = triggerableNotifications[i];
            companyInstance.triggerNotificationsShown.push(currentNotificationDef.id);
            // Nếu có hàm getNotification thì gọi, không thì lấy trực tiếp notification
            currentNotificationDef.getNotification ? newNotifications.push(currentNotificationDef.getNotification(companyInstance)) : newNotifications.push(currentNotificationDef.notification);
        }

        // Đánh dấu các notification vừa được lấy đã được hiển thị
        companyInstance.triggerNotificationsShown.addRange(newNotifications.map(function (notification) {
            return notification.id;
        }));

        // Thêm các scheduled notifications vào danh sách
        newNotifications.addRange(Media.getScheduledNotifications(companyInstance));
        return newNotifications;
    };

    /**
     * Lấy các thông báo được lên lịch (scheduled notifications) dựa trên tuần hiện tại của game.
     * @param {Company} companyInstance - Instance của công ty hiện tại.
     * @returns {Array<Notification>} Mảng các đối tượng Notification được lên lịch.
     */
    mediaModule.getScheduledNotifications = function (companyInstance) {
        var scheduledNotificationsToShow = [];
        var currentGameWeek = Math.floor(companyInstance.currentWeek);

        // Lọc ra các allScheduledStories chưa được hiển thị
        var unscheduledStories = Media.allScheduledStories.filter(function (storyDefinition) {
            return -1 === companyInstance.scheduledStoriesShown.indexOf(storyDefinition.id);
        });

        // Kiểm tra xem có story nào đến hạn hiển thị không
        for (var i = 0; i < unscheduledStories.length; i++) {
            var currentStoryDef = unscheduledStories[i];
            // So sánh tuần hiện tại với tuần được định nghĩa trong story
            if (currentGameWeek == General.getWeekFromDateString(currentStoryDef.date, currentStoryDef.ignoreGameLengthModifier)) {
                scheduledNotificationsToShow.push(currentStoryDef);
            }
        }

        // Đánh dấu các story vừa được lấy đã được hiển thị
        companyInstance.scheduledStoriesShown.addRange(scheduledNotificationsToShow.map(function (story) {
            return story.id;
        }));

        // Trả về mảng các đối tượng Notification (hoặc gọi getNotification nếu có)
        return scheduledNotificationsToShow.map(function (storyDefinition) {
            return storyDefinition.notification ? storyDefinition.notification : storyDefinition.getNotification(companyInstance);
        });
    };

    /**
     * Tạo mô tả về thời gian ước tính còn lại cho một sự kiện (ETA).
     * @param {string} startDateString - Chuỗi ngày bắt đầu (ví dụ: "1/6/3").
     * @param {string} endDateString - Chuỗi ngày kết thúc (ví dụ: "2/1/2").
     * @returns {string} Chuỗi mô tả ETA.
     */
    var getETADescriptionInternal = function (startDateString, endDateString) {
        var startDate = GameManager.company.getDate(General.getWeekFromDateString(startDateString));
        var endDate = GameManager.company.getDate(General.getWeekFromDateString(endDateString));

        if (startDate.year != endDate.year) {
            // Nếu khác năm
            if (1 < Math.abs(endDate.year - startDate.year)) {
                return "in the coming years".localize("date referral sentence fragment");
            } else if (3 >= endDate.month) {
                return "early next year".localize("date referral sentence fragment");
            } else if (8 <= endDate.month) {
                return "late next year".localize("date referral sentence fragment");
            } else {
                return "later next year".localize("date referral sentence fragment");
            }
        }

        // Nếu cùng năm
        var monthDifference = endDate.month - startDate.month;
        if (0 === monthDifference) {
            return "later this month".localize("date referral sentence fragment");
        } else if (1 === monthDifference) {
            return "next month".localize("date referral sentence fragment");
        } else if (2 === monthDifference) {
            return "in two months".localize("date referral sentence fragment");
        } else if (4 >= monthDifference) {
            return "in the coming months".localize("date referral sentence fragment");
        } else if (12 == endDate.month) {
            return "at the end of this year".localize("date referral sentence fragment");
        } else {
            return "later this year".localize("date referral sentence fragment");
        }
    };
    // Gán hàm nội bộ ra ngoài để module General có thể sử dụng
    General.getETADescription = getETADescriptionInternal;

    // Tiêu đề mặc định cho các loại tin tức
    mediaModule.industryNewsHeadline = "Industry News".localize("heading");
    mediaModule.platformNewsHeadline = "Platform News".localize("heading");

    // Định nghĩa các câu chuyện/thông báo cố định trong game
    // (Lưu ý: Tên biến 'c', 'f', 'd', ... ở đây là tên của các đối tượng story cụ thể,
    // việc đổi tên chúng thành tên có ý nghĩa hơn sẽ làm tăng độ dài code đáng kể
    // nhưng cũng làm code dễ hiểu hơn khi bảo trì. Ví dụ: 'storyRiseOf64', 'storyPCTakesOver')
    var storyRiseOf64 = { // Trước đây là 'c'
        id: "riseOf64",
        date: "1/6/3",
        notification: new Notification({
            header: Media.platformNewsHeadline,
            text: "Recent market studies suggest that the Govodore G64 is steadily outselling competitors in the PC sector. Consumers prefer the lower price, greater availability and the flexible hardware configuration over other home computers.{n}Experts say that this might spell the end of competing hardware manufacturers.".localize(),
            image: "./images/platforms/G64.png"
        })
    };
    var storyPCTakesOver = { // Trước đây là 'f'
        id: "PCTakesOver",
        date: "3/6/2",
        notification: new Notification({
            header: Media.platformNewsHeadline,
            text: "Recent market data shows that the Govodore G64 seems to be slowly losing market share against other PC manufacturers.{n}In an unofficial statement a G64 employee said that the company has been unsuccessful in introducing higher priced computers to compete against newer and more advanced PCs.".localize(),
            image: "./images/platforms/G64.png"
        })
    };
    var storyTESRumour = { // Trước đây là 'd'
        id: "TESRumour",
        date: "1/8/2",
        notification: new Notification({
            header: Media.platformNewsHeadline,
            text: "According to rumours the Japanese company Ninvento is planning to launch its very own home gaming console. Ninvento is known for the widely successful arcade game 'Dinkey King'.{n}Many industry experts doubt that home gaming consoles will take off but we are eager to see what Ninvento will deliver.".localize()
        })
    };
    var storyTargetAudiences = { // Trước đây là 'k'
        id: "TargetAudiences",
        date: "2/9/3",
        notification: new Notification({
            header: "Industry Report".localize(),
            text: "Recent studies suggest that the increasing variety of gaming devices also creates a market for more specialized games.\nSome platforms become more popular with younger gamers while others cater for the more mature age groups.{n}As more and more developers enter the market we expect developers to focus their games on specific age groups to really make an impact.".localize(),
            type: NotificationType.IndustryNews
        })
    };
    var storyTESSuccess = { // Trước đây là 'm'
        id: "TESSuccess",
        date: "2/6/4",
        notification: new Notification({
            header: Media.platformNewsHeadline,
            text: "The recently released TES home console by Ninvento has proven to be a massive success. Sales numbers have exceeded expectations by far.{n}As one customer says: 'I love the games that come with the TES and playing with a controller is so much more fun than on a keyboard.'".localize(),
            image: "./images/platforms/TES.png"
        })
    };
    var storyMasterVRumour = { // Trước đây là 'l'
        id: "MasterVRumour",
        date: "2/10/3",
        notification: new Notification({
            header: Media.platformNewsHeadline,
            text: "Following the massive success of the TES console there are now rumours circulating that Vena, another Japanese company, is planning to release a home gaming console on their own.".localize()
        })
    };
    var storyMasterVSuccess = { // Trước đây là 'g'
        id: "MasterVSuccess",
        date: "3/3/2",
        notification: new Notification({
            header: Media.platformNewsHeadline,
            text: "The recently released gaming console, Master V by Vena, has stirred up the market worldwide.\nIndustry experts say that the console is not very well marketed in North America but that it will flourish in other parts of the world.".localize(),
            image: "./images/platforms/Master V.png"
        })
    };
    var storyMarketingStory = { // Trước đây là 'n'
        id: "MarketingStory",
        date: "4/5/2",
        ignoreGameLengthModifier: !0,
        notification: new Notification("Industry Report".localize(),
            "With the growing interest in video games there is also a growing audience for video game magazines. These magazines offer a great new way for game developers to market their upcoming games.".localize(), {
            type: NotificationType.IndustryNews
        })
    };
    var storySuperTES = { // Trước đây là 'r'
        id: "SuperTES",
        date: "5/10/4",
        notification: new Notification(Media.platformNewsHeadline, "Today, Ninvento announced the much anticipated successor to the popular TES console. 'This is the greatest console we have ever built. It comes with state of the art 16-bit graphics and sound. It is simply super and that's why we decided to call it the Super TES!'.{n}Fans around the world have been waiting for this moment and it seems that they will not be disappointed.".localize())
    };
    storySuperTES.notification.image = "./images/platforms/superb/Super TES.png";

    var storyVonnyNinventoAnnouncement1 = { // Trước đây là 'p'
        id: "VonnyNinventoAnnouncement1",
        date: "6/3/4",
        notification: new Notification(Media.platformNewsHeadline, "The media is abuzz with the latest news from this year's Entertainment Conference. In a surprise announcement Vonny, a company known for general electronics has presented a prototype console called the Play System.{n}Apparently Vonny has collaborated with Ninvento, creators of the beloved and successful TES and Super TES consoles to develop what is basically a Super TES with a CD drive.{n}This would be the world's first console using a CD drive.".localize())
    };
    storyVonnyNinventoAnnouncement1.notification.image = "./images/platforms/superb/PlaysystemA.png";

    var storyVonnyNinventoAnnouncement2 = { // Trước đây là 's'
        id: "VonnyNinventoAnnouncement2",
        date: "6/3/4",
        notification: new Notification(Media.platformNewsHeadline, "Journalists around the world are baffled as only one day after Vonny and Ninvento jointly announced the Play System at the Entertainment Conference things have turned sour.{n}Ninvento announced today that they will cancel the project and instead seek to develop a new console with a different partner.{n}Rumour has it that the distribution deal the companies had worked out was unfavorable to Ninvento handing over much of the control to Vonny.{n}This seems to be the end of the Play System.".localize(),
            "OK".localize(), 0.1)
    };
    storyVonnyNinventoAnnouncement2.notification.image = "./images/platforms/superb/PlaysystemA.png";

    var storyPlaySystem2Announcement = { // Trước đây là 'u'
        id: "PlaySystem2Announcement",
        date: "11/3/2",
        notification: new Notification(Media.platformNewsHeadline, "Today, Vonny has announced the much anticipated successor to their popular Playsystem console. The Playsystem 2 will have upgraded hardware to compete with newer generation consoles such as the DreamVast.{n}Unlike the DreamVast the Playsystem 2 does not focus much on online play but instead seems to focus on the strengths of the previous Playsystem. A solid upgraded controller including vibration function, upgraded graphics, support for DVD titles and even backwards compatibility with Playsystem 1 games.".localize())
    };
    storyPlaySystem2Announcement.notification.image = "./images/platforms/superb/Playsystem 2.png";

    var storyDreamVastSlowing = { // Trước đây là 't'
        id: "DreamVastSlowing",
        date: "11/4/2",
        notification: new Notification(Media.platformNewsHeadline, "Since release, the DreamVast from Vena has been one of the fastest selling consoles in history but lately it seems that the anticipation of the upcoming Playsystem 2 release is slowing down sales.{n}If the Playsystem 2 can hold up to the hype when it is released then Vena could be in deep trouble.".localize())
    };
    storyDreamVastSlowing.notification.image = "./images/platforms/superb/DreamVast.png";

    var storyPlaysystem2Launch = { // Trước đây là 'q'
        id: "Playsystem2Launch",
        date: "11/6/1",
        notification: new Notification(Media.platformNewsHeadline, "The launch of the Playsystem 2 has been a phenomenal success. Stores everywhere are out of stock as manufacturing can barely keep up. Fans have resorted to buying the console on internet auction sites for as much as five times the normal price.{n}While Vonny has managed to have the most successful launch in history, sales of Vena's DreamVast have plummeted.".localize())
    };
    storyPlaysystem2Launch.notification.image = "./images/platforms/superb/Playsystem 2.png";

    var storyDreamVastDiscontinued = { // Trước đây là 'v'
        id: "DreamVastDiscontinued",
        date: "12/7/3",
        notification: new Notification(Media.platformNewsHeadline, "In a sobering announcement, Vena has today confirmed the discontinuation of the DreamVast. Vena's president said that while many companies will still deliver games for the platform, the company will no longer produce new units in the future.{n}Vena fans worldwide are disappointed, as a beloved part of gaming console history is coming to an end.".localize())
    };
    storyDreamVastDiscontinued.notification.image = "./images/platforms/superb/DreamVast.png";

    var storyGSRumour = { // Trước đây là 'A'
        id: "GSRumour",
        date: "13/2/1",
        notification: new Notification(Media.platformNewsHeadline, "Rumours are spreading that Ninvento is working on a new game console. Most of the rumours state that it is not a successor to the somewhat disappointing Game Sphere but instead a new console in the mobile market.{n}Ninvento's Gameling has been leading the mobile market thanks to numerous updates and a large list of very popular games available on the platform, but the hardware is aging quickly and many players wonder what will be next.".localize())
    };
    var storyGen7Rumours = { // Trước đây là 'z'
        id: "Gen7Rumours",
        date: "15/10/3",
        notification: new Notification(Media.industryNewsHeadline, "Industry experts predict that we will see the next generation of video game consoles as early as next year. 'The hardware advancements in the PC industry have not been reflected in gaming consoles yet and we can expect the next generation to be a truly exciting leap forward.'{n}According to rumours, both Mirconoft and Vonny are in a race to introduce the next-generation console, with Mirconoft apparently already collaborating with partners to prepare titles for what is called the 'mBox 360.'".localize())
    };
    var storyMBox360 = { // Trước đây là 'B'
        id: "mBox360",
        date: "16/5/3",
        notification: new Notification(Media.platformNewsHeadline, "Today, Mirconoft presented their new console called the mBox 360. It is the first in the next generation of expected consoles, and features hardware rivaling mid-end PC counterparts. With a relatively cheap purchase price, Mirconoft will be selling the device at a loss as part of a long-term strategy to gain market share.{n}Gamers around the world are excited by the new console and it is predicted that the mBox 360 will have a massive impact on the console market.".localize())
    };
    storyMBox360.notification.image = "./images/platforms/superb/mBox 360.png";

    var storyNuu = { // Trước đây là 'D'
        id: "Nuu",
        date: "16/12/4",
        notification: new Notification(Media.platformNewsHeadline, "Today, Ninvento has announced their bid in the next-generation console market by announcing the Nuu. Instead of trying to compete with Mirconoft and Vonny on hardware strength and graphical power, Ninvento has decided to deliver a truly unique gaming experience.{n}The Nuu features a controller with a built-in motion sensor, which allows players to stand front of their TV and use the controller as a counterpart to virtual objects such as a tennis racquet.{n}First playtesters were seen with huge grins on their faces. It seems to be a lot of fun.".localize())
    };
    storyNuu.notification.image = "./images/platforms/superb/Nuu.png";

    var storyGrPad = { // Trước đây là 'E'
        id: "grPad",
        date: "19/6/2",
        notification: new Notification(Media.platformNewsHeadline, "Today, Grapple, the company responsible for the massively successful grPhone has announced their plans to release a tablet device called the grPad. Tablet devices are not a new idea in the computing industry but earlier attempts never seemed to take off. Many expect the grPad to do very well.".localize())
    };
    storyGrPad.notification.image = "./images/platforms/superb/grPad.png";

    var storyMPadReport = { // Trước đây là 'w'
        id: "mPadReport",
        date: "20/11/2",
        notification: new Notification(Media.platformNewsHeadline, "The mPad has received mixed reviews at launch, with many of them highlighting the fact that the mPad is indeed not the same as the grPad from Grapple. We will see what the future holds for this platform.".localize())
    };
    storyMPadReport.notification.image = "./images/platforms/superb/mPad.png";

    // Mảng chứa tất cả các câu chuyện/thông báo được lên lịch
    mediaModule.allScheduledStories = [storyRiseOf64, storyPCTakesOver, {
        id: "EndOFG64",
        date: "4/5/4",
        getNotification: function () {
            return new Notification({
                header: Media.platformNewsHeadline,
                text: "Hardware manufacturers around the world were surprised today as Govodore, the creator of the popular G64, has filed for bankruptcy.{n}Govodore failed to introduce a higher priced alternative and was forced to shut down production of the G64. The platform will retire from the market {0}.".localize("{0} is date referral sentence fragment").format(getETADescriptionInternal("4/5/4", "4/6/2")),
                image: "./images/platforms/G64.png"
            });
        }
    }, storyTESRumour, {
            id: "TESRumour2",
            date: "1/10/2",
            getNotification: function () {
                return new Notification({
                    header: Media.platformNewsHeadline,
                    text: "Today, Ninvento has confirmed recent rumours and announced their plans to release a new home gaming console called 'TES' {0}.\nThe console features cartridge based games and a uniquely designed controller.".localize("{0} is date referral sentence fragment").format(getETADescriptionInternal("1/10/2", "2/1/2")),
                    image: "./images/platforms/TES.png"
                });
            }
        }, storyTESSuccess, storyMasterVRumour, {
            id: "MasterVPreAnnouncement",
            date: "2/12/1",
            getNotification: function () {
                return new Notification({
                    header: Media.platformNewsHeadline,
                    text: "Today, Vena has confirmed recent rumours about a new gaming console and announced the Master V.\nThe company claims that the Master V is technically superior to the massively successful TES by Ninvento and plans to release it {0}.".localize("{0} is date referral sentence fragment").format(getETADescriptionInternal("2/12/1", "3/2/3")),
                    image: "./images/platforms/Master V.png"
                });
            }
        }, storyMasterVSuccess, storyTargetAudiences, storyMarketingStory, {
            id: "Gameling",
            date: "3/7/4",
            getNotification: function () {
                return new Notification({
                    header: Media.platformNewsHeadline,
                    text: "Today, Ninvento has announced that they will introduce a portable gaming device called Gameling. The device comes with changeable game cartridges, a monochrome screen on a green background, built-in speakers and even multiplayer support via a connection cable.{n}Compared to PCs and other gaming consoles the Gameling is underpowered but given the lower cost and excellent portability it might find a huge following.{n}The Gameling is said to hit shelves {0}.".localize("{0} is date referral sentence fragment").format(getETADescriptionInternal("3/7/4", "3/9/2")),
                    image: "./images/platforms/Gameling.png"
                });
            }
        }];
    mediaModule.allScheduledStories.addRange([{
        id: "VenaGear",
        date: "4/1/2",
        getNotification: function () {
            return new Notification({
                header: Media.platformNewsHeadline,
                text: "Vena, creator of the Master V console, has announced the Vena Gear, a portable console to directly compete against the Gameling from Ninvento.{n}A spokesperson for the company said, 'Unlike similar devices on the market which don't come close to gaming consoles the Vena Gear has basically the full power of the Master V, except that you can take it with you. The Vena Gear also has a full color screen'.{n}Will this device topple the Gameling? We will see. The Vena Gear will debut {0}.".localize("{0} is date referral sentence fragment").format(getETADescriptionInternal("4/1/2", "4/2/4")),
                image: "./images/platforms/superb/Vena Gear.png"
            });
        }
    }, {
        id: "Oasis",
        date: "5/1/1",
        getNotification: function () {
            return new Notification({
                header: Media.platformNewsHeadline,
                text: "Vena has announced that they will release a new gaming console {0}. The Vena Oasis comes with 16-bit graphics and sound which promises a new kind of gaming experience.{n}Vena said at the announcement, 'The Oasis is a new start, it will be the genesis of a new generation of gaming consoles and we believe it will do very well in the market'. Some of the games already announced for the console suggest that it will appeal to more mature audiences.".localize("{0} is date referral sentence fragment").format(getETADescriptionInternal("5/1/1", "5/2/4")),
                image: "./images/platforms/superb/Vena Oasis.png"
            });
        }
    }, storySuperTES, storyVonnyNinventoAnnouncement1, storyVonnyNinventoAnnouncement2, {
        id: "PlaySystemAnnouncement",
        date: "7/6/1",
        getNotification: function () {
            return new Notification({
                header: Media.platformNewsHeadline,
                text: "Today, Vonny has announced their very own console called the Playsystem. Apparently the company has completely reworked their earlier Play System prototype after Ninvento cancelled the project.{n}The new Playsystem comes with a CD-ROM drive and 32-bit processors and is wholly owned by Vonny. Industry professionals say that this might be the beginning of a new generation of consoles. Ninvento declined to comment. The Playsystem will enter the market {0}.".localize("{0} is date referral sentence fragment").format(getETADescriptionInternal("7/6/1", "7/7/1")),
                image: "./images/platforms/superb/Playsystem.png"
            });
        }
    }, {
        id: "TES64Announcement",
        date: "8/12/1",
        getNotification: function () {
            return new Notification({
                header: Media.platformNewsHeadline,
                text: "Ninvento announced their next generation console called TES 64 today. Expected {0} it is the world's first gaming console to sport 64-bit processors for graphics and audio. Ninvento said this will allow never-before-seen 3D realism.{n}In recent years the Super TES has lost a lot of market share to more modern consoles. Market experts said that the hardware of the TES 64 is surely impressive, but expressed their surprise that it still uses ROM cartridges instead of the much cheaper and higher capacity CD-ROM format.{n}Nevertheless, the TES 64 seems like an impressive console and Ninvento has said that it plans to aggressively price it against Vonny's Playsystem.".localize("{0} is date referral sentence fragment").format(getETADescriptionInternal("8/12/1", "9/2/1")),
                image: "./images/platforms/superb/TES 64.png"
            });
        }
    }, {
        id: "DreamVast",
        date: "10/1/2",
        getNotification: function () {
            return new Notification({
                header: Media.platformNewsHeadline,
                text: "The day Vena fans have waited a long time for has arrived, as Vena has announced their next generation console, the DreamVast. A company spokesperson said, 'The DreamVast is a dream come true. This console is the most advanced gaming console in history!'.{n}The new console sports powerful graphics hardware promising graphic quality rivaling those on high-end PCs. The DreamVast is also the first console to ship with a modem out-of-the-box, making it ready for online play. The console will be available {0}.".localize("{0} is date referral sentence fragment").format(getETADescriptionInternal("10/1/2", "10/8/3")),
                image: "./images/platforms/superb/DreamVast.png"
            });
        }
    }, storyPlaySystem2Announcement, storyDreamVastSlowing, {
        id: "mBoxAnnouncement",
        date: "11/5/1",
        getNotification: function () {
            return new Notification({
                header: Media.platformNewsHeadline,
                text: "PC software juggernaut Mirconoft has announced today that they will enter the game console market with their very own gaming console called the mBox.{n}First demonstrations have been impressive, but we will have to wait and see how it fares against the popular DreamVast, as well as against the recently announced and much anticipated Playsystem 2. The new console is said to debut {0}.".localize("{0} is date referral sentence fragment").format(getETADescriptionInternal("11/5/1", "11/7/1")),
                image: "./images/platforms/superb/mBox.png"
            });
        }
    }, {
        id: "mBoxDelayed",
        date: "11/6/2",
        getNotification: function () {
            return new Notification({
                header: Media.platformNewsHeadline,
                text: "Mirconoft has announced the delay of their new gaming console, mBox. The new release date is '{0}'. Rumour has it that the incredible success of the Playsystem 2 launch has prompted Mirconoft to delay their own debut.".localize("{0} is date referral sentence fragment").format(getETADescriptionInternal("11/6/2", "11/12/4")),
                image: "./images/platforms/superb/mBox.png"
            });
        }
    },
        storyPlaysystem2Launch, storyDreamVastDiscontinued, {
        id: "gameSphere",
        date: "12/10/4",
        getNotification: function () {
            return new Notification({
                header: Media.platformNewsHeadline,
                text: "Today, Ninvento announced the new Ninvento Game Sphere, with which it will try to compete with Vonny's market leading Playsystem 2 and Mirconoft's strong alternative, the mBox. The curiously shaped console has similar hardware specifications as other consoles.{n}The Game Sphere is Ninvento's first console to have an optical disc drive instead of cartridges. However, instead of using full sized CD and DVDs, like its competitors, the console features a mini-DVD drive. Game Spheres will start rolling into stores {0}.".localize("{0} is date referral sentence fragment").format(getETADescriptionInternal("12/10/4", "12/12/1")),
                image: "./images/platforms/superb/GameSphere.png"
            });
        }
    },
        storyGSRumour, {
        id: "NinventoGS",
        date: "13/8/1",
        getNotification: function () {
            return new Notification({
                header: Media.platformNewsHeadline,
                text: "Today, Ninvento has announced a new mobile console called the Ninvento GS. It features two screens, one of them touch sensitive, and promises unique gameplay. While Ninvento has been struggling to regain their market lead ever since the TES 64 they still have a very strong position on the mobile market.{n}The Ninvento GS promises to strengthen this position and aims to breath life into a stagnating mobile market. The console will be in stores {0}.".localize("{0} is date referral sentence fragment").format(getETADescriptionInternal("13/8/1", "13/8/4")),
                image: "./images/platforms/superb/GS.png"
            });
        }
    }, {
        id: "PPSAnnouncement",
        date: "13/8/2",
        getNotification: function () {
            return new Notification({
                header: Media.platformNewsHeadline,
                text: "Today, Vonny announced that they are launching a new mobile gaming console called Portable Playsystem, or PPS for short, {0}. Media analysts speculate that this announcement is meant to distract users from Ninvento's launch of the Ninvento GS.{n}While the Ninvento GS utilizes an innovative dual screen, the PPS instead makes use of a single screen and will focus on giving developers access to much more powerful hardware.".localize("{0} is date referral sentence fragment").format(getETADescriptionInternal("13/8/2", "14/3/4")),
                image: "./images/platforms/superb/PPS.png"
            });
        }
    },
        storyGen7Rumours, storyMBox360, {
        id: "mPad",
        date: "20/6/4",
        getNotification: function () {
            return new Notification({
                header: Media.platformNewsHeadline,
                text: "Today, Mirconoft has announced their very own tablet device to combat the massive marketshare of Grapple's grPad device. The mPad features a sophisticated cover that comes with a integrated, ultra-thin keyboard. The tablet itself has a widescreen display and a integrated stand.{n}The mPad seems to be a combination of a traditional notebook and a tablet, and promises to shake up the market. The new product will be on the market {0}.".localize("{0} is date referral sentence fragment").format(getETADescriptionInternal("20/6/4", "20/10/4")),
                image: "./images/platforms/superb/mPad.png"
            });
        }
    },
        storyMPadReport, storyNuu, {
        id: "PS3",
        date: "17/8/4",
        getNotification: function () {
            return new Notification({
                header: Media.platformNewsHeadline,
                text: "Today, Vonny has announced the successor to the massively successful Playsystem 2. The new console is predictably called 'Playsystem 3' and comes with an impressive hardware configuration, making it the most powerful console in gaming history.{n}The console also doubles as a player for BlueRay, which Vonny hopes will be the successor to the DVD format. All this power comes with a hefty price tag, also making the Playsystem 3 the most expensive console ever.{n}We will see how consumers will react to this given the lower-cost alternatives; however, considering the massive success of the Playsystem 2, Vonny can be hopeful.\nThe console is expected to ship {0}.".localize("{0} is date referral sentence fragment").format(getETADescriptionInternal("17/8/4", "17/12/4")),
                image: "./images/platforms/superb/Playsystem 3.png"
            });
        }
    }, {
        id: "grPhone",
        date: "18/6/1",
        getNotification: function () {
            return new Notification({
                header: Media.platformNewsHeadline,
                text: "Today, Grapple, a company well known for their role in the early PC industry and, more recently, for their portable music player, grPod, have announced that they will soon release a powerful new mobile phone. The phone has a touch screen and sports a surprisingly powerful CPU.{n}The integrated graphics chipset should also allow the phone to run games and, since the phone comes with its own application delivery platform, it could become a great device for mobile games. The grPhone will be available {0}.".localize("{0} is date referral sentence fragment").format(getETADescriptionInternal("18/6/1", "18/9/1")),
                image: "./images/platforms/superb/grPhone.png"
            });
        }
    },
        storyGrPad, {
        id: "PS3Hype",
        date: "17/12/2",
        getNotification: function () {
            return new Notification({
                header: Media.platformNewsHeadline,
                text: "In what some call a bizarre show of arrogance Vonny representatives have been trash-talking Mirconoft's successful mBox 360 while praising their own upcoming Playsystem 3 in the lead-up to their launch {0}.{n}Asked about the unusually high price of the Playsystem 3, a high-ranking company official replied, 'People will work more hours to buy one. We want people to feel that they want it more than anything else.'.{n}We are not sure that players will really want it so badly, as, so far, no major game titles have been announced for the Playsystem 3. It might be a while before developers are able to take full advantage of the powerful new console.".localize("{0} is date referral sentence fragment").format(getETADescriptionInternal("17/12/2", "17/12/4")),
                image: "./images/platforms/superb/Playsystem 3.png"
            });
        }
    }, {
        id: "wuu",
        date: "20/8/4",
        getNotification: function (companyInstance) {
            var text = "Ninvento has revealed that their bid in the next generation of consoles will be called the Wuu. The new console features a controller with a integrated display.{n}This is said to make local multiplayer games much more interesting by giving each player a unique screen. Ninvento has always been at the forefront of innovation and this console seems, once again, to be a brave move.\nThe Wuu is said to be available {0}.".localize("{0} is date referral sentence fragment").format(getETADescriptionInternal("20/8/4", "20/12/4"));
            return new Notification({
                header: Media.platformNewsHeadline,
                text: text,
                image: "./images/platforms/superb/Wuu.png"
            });
        }
    }, {
        id: "mboxOne",
        date: "23/4/4",
        getNotification: function (companyInstance) {
            var latestCustomConsole = companyInstance.getLatestCustomConsole();
            var text = "For fans of the mBox, the long wait for an update to the console will soon be over as Mirconoft has announced that the mBox One will be available {0}.".localize("{0} is date referral sentence fragment").format(getETADescriptionInternal("23/4/4", "23/8/4"));
            if (latestCustomConsole) {
                text += " Mirconoft has lost a substantial share of the market since {0} released their {1} console.{n}".localize().format(companyInstance.name, latestCustomConsole.name);
            }
            text += " " + "The new console is marketed as a unified entertainment platform and comes with voice control and a camera which is always watching to enable gesture control. A camera which is always on is not the only controversial feature as the new console also seems to require internet access at least once a day to function properly, does not support previous mBox games and seems to place restrictions on how games can be shared or resold.{n}Clearly, Mirconoft wants to push the current status quo and deliver a console for a new future of gaming but we are not sure if players will share Micronoft's vision.".localize();
            return new Notification({
                header: Media.platformNewsHeadline,
                text: text,
                image: "./images/platforms/superb/mBox One.png"
            });
        }
    }, {
        id: "ps4",
        date: "23/5/1",
        getNotification: function (companyInstance) {
            var latestCustomConsole = companyInstance.getLatestCustomConsole();
            var text = "Just after Mirconoft have announced their new bet in the upcoming console generation, Vonny has announced that they will release their new, long-awaited console, the Playsystem 4, {0}. The console seems to do everything that the Playsystem 3 did, only better.{n}Unlike the mBox One, the Playsystem 4 doesn't have an always-online requirement and seems much more player friendly. We think that there is hardly a risk of Vonny fans being disappointed".localize("{0} is date referral sentence fragment, sentence itself is a fragment and continues with 'but ...'").format(getETADescriptionInternal("23/5/1", "23/10/4"));
            text = latestCustomConsole ? text + " but we will see how well the new console competes with the popular {0} console.".localize().format(latestCustomConsole.name) : text + " but we will see how the new console will fare against its competitors.".localize();
            return new Notification({
                header: Media.platformNewsHeadline,
                text: text,
                image: "./images/platforms/superb/Playsystem 4.png"
            });
        }
    }, {
        id: "mboxOnePs4",
        date: "23/6/2",
        getNotification: function (companyInstance) {
            var competitorName = companyInstance.getLatestCustomConsole() ? "Vonny and {0}".localize().format(companyInstance.name) : "Vonny";
            var text = "After a massive public backlash to the controversial features announced for the upcoming mBox One, Mirconoft has today published a letter outlining their change of plans. The mBox One will no longer require a constant internet connection and will not place restrictions on how games are sold or shared.{n}Clearly the different and much more popular strategies of companies like {0}, as well as vocal players themselves, have forced this change of direction.".localize().format(competitorName);
            return new Notification({
                header: Media.platformNewsHeadline,
                text: text,
                image: "./images/platforms/superb/mBox One.png"
            });
        }
    }, {
        id: "gameEndNotification",
        date: "30/5/4",
        getNotification: function (companyInstance) {
            var text = "Dear {0}, we, the worldwide game developers guild, would like to invite you to a special award ceremony at our main meeting at the end of the year. Please come.\n\n(Hint: The game will end at the end of this year.)".localize().format(companyInstance.staff[0].name);
            return new Notification("Invitation".localize("heading"), text);
        }
    },
    {
        id: "swap",
        date: "24/10/4",
        getNotification: function (companyInstance) {
            var text = "Ninvento has today revealed their upcoming game console: The Ninvento Swap. The device seems to function both as a portable console and as a home console. When the Swap is removed from its docking station, unique controller pads called 'Fun-Pads' are attached to the side of the screen and turn the console into a handheld device.{n}The reaction to the announcement was mixed as many voiced concerns that the device might not have a clear audience and might fail to appeal to both casual and core gamers. Others praised the unique nature of the device and pointed out that Ninvento has frequently managed to land successes with odd devices in the past. The Swap is said to hit markets {0}.".localize("{0} is date referral sentence fragment").format(getETADescriptionInternal("24/10/4", "25/3/1"));
            return new Notification({
                header: Media.platformNewsHeadline,
                text: text,
                image: "./images/platforms/superb/Swap.png"
            });
        }
    }, {
        id: "swapBitter",
        date: "25/4/1",
        getNotification: function (companyInstance) {
            var text = "The recently released Ninvento Swap console has caused an unusual social media storm. It all started when a consumer licked one of the game cartridges and reported that it tasted extremely bad. Thousands of consumers then repeated the experiment, tasting their cartridges and reporting the result on social media, further encouraging others to do the same.{n}Ninvento has now published an official statement to confirm that game cartridges for the Swap are coated with denatonium benzoate, a non-toxic bittering agent. This was apparently done to discourage children from biting on and swallowing the fairly small cartridges.{n}Initial reactions to the console itself have been more positive than to the taste of its cartridges as the Swap is turning out to be quite popular with gamers around the globe.".localize();
            return new Notification({
                header: Media.industryNewsHeadline,
                text: text,
                image: "./images/platforms/superb/Swap.png"
            });
        }
    }, {
        id: "visorius",
        date: "25/9/2",
        getNotification: function (companyInstance) {
            var text = "A company by the name of RiseVR has developed a virtual reality headset which promises to finally start the path towards true 3D immersion. The new headset called Visorius looks like a pair of giant ski-goggles and provides a large field of vision as well as near-perfect motion tracking.".localize();
            text += "{n}" + "A first test left some players feeling a little motion-sick but with the right game this technology can surely deliver a new level of immersion.".localize();
            var notification = new Notification({
                header: Media.platformNewsHeadline,
                text: text,
                image: ["./images/platforms/superb/visorius.png"]
            });
            notification.setFlag("visoriusAnnounced", !0);
            return notification;
        }
    }, {
        id: "growingPC",
        date: "22/10/2",
        getNotification: function (companyInstance) {
            var text = "Just as the industry seems to have silently accepted the slow demise of PC gaming as more and more games are primarily developed for consoles, there seems to be a resurgence of the PC market.{n}New powerful and affordable hardware, a growing indie-developer scene and the rise of crowd-funded financing has meant a slew of new exciting projects hitting the PC market.\nIt seems that the PC market will only grow stronger in the coming years.{n}For console lovers, this isn't bad news either as many PC games are also ported to the most successful consoles.".localize();
            return new Notification({
                header: Media.industryNewsHeadline,
                text: text,
                image: ["./images/platforms/superb/PC-3.png"]
            });
        }
    }, {
        id: "oya",
        date: "22/1/4",
        getNotification: function (companyInstance) {
            var text = "Out of nowhere, a new company called KickIT has kicked up a media storm by successfully crowd-funding the development of a new gaming console in just under eight hours.{n}The console, dubbed 'OYA', uses similar technology as modern phones and tablets and delivers games exclusively via its own online store.\nThe OYA is a cubed-shape console and much smaller than most gamepads but the shape isn't the only thing that is small as the developer states that the price tag of the OYA will be under 100cr.{n} KickIT also stated that every game on the OYA will offer a free DEMO. The OYA will be available {0}.".localize().format(getETADescriptionInternal("22/1/4", "22/10/4"));
            return new Notification({
                header: Media.platformNewsHeadline,
                text: text,
                image: "./images/platforms/superb/OYA.png"
            });
        }
    }, {
        id: "mboxNext",
        date: "27/3/4",
        getNotification: function (companyInstance) {
            var latestCustomConsole = companyInstance.getLatestCustomConsole();
            var text = "Mirconoft has announced their plans to release a completely revamped version of the mBox {0} called mBox Next. The new console seems to cleverly integrate Mirconoft's own motion sensor add-on for the mBox One into one small package.{n}Visually, the mBox Next is reminiscent of the earlier mBox 360 with a much lighter tone marking a departure from the bulky and dark style of the mBox One. The technology of the mBox Next seems promising  ".localize("{0} is date referral sentence fragment, sentence itself is a fragment and continues with 'but ...'").format(getETADescriptionInternal("27/3/4", "27/8/4"));
            text = latestCustomConsole ? text + " but we will see how well the new console competes with the popular {0} console.".localize().format(latestCustomConsole.name) : text + " but we will see how the new console will fare against its competitors.".localize();
            return new Notification({
                header: Media.platformNewsHeadline,
                text: text,
                image: "./images/platforms/superb/mBox Next.png"
            });
        }
    }, {
        id: "ps5",
        date: "27/6/4",
        getNotification: function (companyInstance) {
            var latestCustomConsole = companyInstance.getLatestCustomConsole();
            var text = "Many have expected that Vonny will announce a new platform before Mirconoft's mBox Next will hit the market and, today, Vonny did just that. Keeping with company tradition, and in contrast to competitor Mirconoft's naming practices, the newly announced console is aptly named Playsystem 5.{n}The Playsystem 5 seems an incremental update, coming out {0} with a form-factor that reminds of the early Playsystem 3. The new system promises to be a solid update".localize("{0} is date referral sentence fragment, sentence itself is a fragment and continues with 'but ...'").format(getETADescriptionInternal("27/6/4", "27/10/4"));
            text = latestCustomConsole ? text + " but we will see how well the new console competes with the popular {0} console.".localize().format(latestCustomConsole.name) : text + " but we will see how the new console will fare against its competitors.".localize();
            return new Notification({
                header: Media.platformNewsHeadline,
                text: text,
                image: "./images/platforms/superb/Playsystem 5.png"
            });
        }
    }
    ]);

    /**
     * Tạo câu chuyện về game đầu tiên của công ty.
     * @param {Company} companyInstance - Instance của công ty.
     * @returns {string} Chuỗi câu chuyện.
     */
    mediaModule.createFirstGameStory = function (companyInstance) {
        var currentGame = companyInstance.currentGame;
        var storyText = "{0}, a newcomer in the game industry, has just released their first game '{1}'.\nThe game ".localize("fragment, continue with firstGameStoryRatingFragments").format(companyInstance.name, currentGame.title);
        // Tạo câu chuyện dựa trên điểm số của game
        if (3 >= currentGame.score) {
            storyText += "got generally low scores from reviewers but with a bit of experience we are sure that we will see better games from {0} in the future.".localize("firstGameStoryRatingFragments").format(companyInstance.name);
        } else if (5.6 >= currentGame.score) {
            storyText += "had a moderate response from reviewers. We are curious what {0} will deliver in the future.".localize("firstGameStoryRatingFragments").format(companyInstance.name);
        } else {
            storyText += "received favorable reviews. \nWith such a good start {0} are sure to gain fans quickly.".localize("firstGameStoryRatingFragments").format(companyInstance.name);
        }
        return storyText;
    };

    /**
     * Tạo câu chuyện khi phát hành một game sequel.
     * @param {Company} companyInstance - Instance của công ty.
     * @param {Game} sequelGame - Đối tượng game sequel vừa phát hành.
     */
    mediaModule.createSequelStory = function (companyInstance, sequelGame) {
        var originalGame = companyInstance.getGameById(sequelGame.sequelTo);
        var reviewAdjective = 9 < sequelGame.score ? "outstanding".localize() : 7 < sequelGame.score ? "great".localize() : 5 < sequelGame.score ? "moderate".localize() : 3 < sequelGame.score ? "below average".localize() : "pretty bad".localize();
        var storyText = "{0} has recently released a sequel to their game {1}. The newest game in the series titled {2} was met with {3} responses.".localize().format(companyInstance.name, originalGame.title, sequelGame.title, reviewAdjective);

        if (6 < sequelGame.score && sequelGame.flags.hasBetterEngineThanSequel) {
            storyText += " " + "Critics praised that {0} had a newer engine than the original, really driving technical innovation.".localize().format(sequelGame.title);
        }
        if (sequelGame.flags.sequelsTooClose) {
            var weeksDifference = Math.floor(sequelGame.releaseWeek - originalGame.releaseWeek);
            storyText += "{n}" + "A major negative reaction came from fans who felt that with the original coming out just {0} weeks before, the company is trying to milk the franchise for more money without delivering much new for players to enjoy.".localize().format(weeksDifference);
        }
        companyInstance.notifications.push(new Notification("Sequel".localize(), storyText, "OK".localize(), 2 + 2 * companyInstance.getRandom(), {
            type: NotificationType.SalesReports
        }));
    };

    /**
     * Tạo câu chuyện khi phát hành một gói mở rộng.
     * @param {Company} companyInstance - Instance của công ty.
     * @param {Game} expansionPackGame - Đối tượng gói mở rộng vừa phát hành.
     */
    mediaModule.createExtensionPackStory = function (companyInstance, expansionPackGame) {
        var originalGame = companyInstance.getGameById(expansionPackGame.sequelTo);
        var reviewAdjective = 9 < expansionPackGame.score ? "outstanding".localize() : 7 < expansionPackGame.score ? "great".localize() : 5 < expansionPackGame.score ? "moderate".localize() : 3 < expansionPackGame.score ? "below average".localize() : "pretty bad".localize();
        var storyText = "{0} has recently released an expansion pack to their game {1}. The expansion pack titled {2} was met with {3} responses.".localize().format(companyInstance.name, originalGame.title, expansionPackGame.title, reviewAdjective);

        if (expansionPackGame.flags.sequelsTooClose) {
            var weeksDifference = Math.floor(expansionPackGame.releaseWeek - originalGame.releaseWeek);
            storyText += "{n}A major negative reaction came from fans who felt that with the main game coming out just {0} weeks before, the company is trying to milk the franchise for more money without delivering much new for players to enjoy.".localize().format(weeksDifference);
        }
        companyInstance.notifications.push(new Notification("Expansion Pack".localize(), storyText, "OK".localize(), 2 + 2 * companyInstance.getRandom(), {
            type: NotificationType.SalesReports
        }));
    };

    /**
     * Tạo các thông báo chào mừng khi bắt đầu game mới.
     */
    mediaModule.createWelcomeNotifications = function () {
        var companyInstance = GameManager.company;
        if (GameManager.ghg2()) { // Kiểm tra xem có phải bản trial/lite không
            var versionType = GameManager.ghg0() ? "lite".localize("as in lite edition of the game") : "trial".localize();
            companyInstance.notifications.push(new Notification({
                header: "{0} version".localize("could either be lite version or trial version").format(versionType),
                text: "This is the {0} version of Game Dev Tycoon in which you can play until year five.".localize("{0} is either lite or trial").format(versionType),
                type: NotificationType.AutoPopup
            }));
        }
        var welcomeText = "Welcome to Game Dev Tycoon!\nIn this business simulation you have been transported back in time to start your very own game development company right at the beginning of the PC revolution. In the next {0} years you can build your dream company, create best selling games, gain fans and become the leader of the market.{n}Before you can start your adventure you have to give your upcoming company a name.".localize().format(35);
        companyInstance.notifications.push(new Notification("Welcome".localize("heading to greet the player"),
            welcomeText, {
            type: NotificationType.AutoPopup
        }));
        // Thông báo yêu cầu nhập tên công ty
        companyInstance.notifications.push(new Notification("{enterCompanyName}"));
    };

    /**
     * Tạo câu chuyện khi có sự không phù hợp giữa đối tượng mục tiêu và nền tảng.
     * @param {Company} companyInstance - Instance của công ty.
     * @param {Game} gameInstance - Đối tượng game đang được đánh giá.
     */
    mediaModule.generateAudienceMismatchStory = function (companyInstance, gameInstance) {
        var reviewAdjective = 8 < gameInstance.score ? "outstanding".localize() : 6 < gameInstance.score ? "good".localize() : "moderate".localize();
        var storyText = "It seems that the initial sales for {0} have fallen way below expected numbers. The game received {1} reviews but it seems that the chosen platform isn't very popular with the target audience.".localize("{1} is adjective like good, moderate, outstanding");
        companyInstance.notifications.push(new Notification("Sales Report".localize(),
            storyText.format(gameInstance.title, reviewAdjective), {
            type: NotificationType.SalesReports
        }));
    };

    /**
     * Tạo câu chuyện khi công ty phát hành game cùng thể loại/chủ đề quá gần nhau.
     * @param {Company} companyInstance - Instance của công ty.
     * @param {Game} gameInstance - Đối tượng game đang được đánh giá.
     * @returns {Notification|undefined} Đối tượng Notification hoặc undefined nếu không tạo.
     */
    mediaModule.createSameGenreTopicStory = function (companyInstance, gameInstance) {
        if (7 > gameInstance.score) {
            var storyText = "The latest game by {0} has had reviewers scratching their heads. Rather than bringing a new and innovative game to market the company delivered another {1}/{2} game which is more or less the same setting as their previous game.{n}One reviewer commented:'I think {3} was simply developed too soon after the previous game with not enough innovations in technology and design.'".localize();
            return new Notification("Media Report".localize(), storyText.format(companyInstance.name, gameInstance.topic.name, gameInstance.genre.name, gameInstance.title), {
                type: NotificationType.SalesReports
            });
        }
    };

    /**
     * Tạo các thông báo khi công ty chuyển lên văn phòng level 2.
     */
    mediaModule.createLevel2Notifications = function () {
        var companyInstance = GameManager.company;
        var text = "Welcome to your new office!\nNow that you have a bigger office you can also hire staff and forge a world-class development team to make even better games.".localize();
        companyInstance.notifications.push(new Notification("New Office".localize(), text, "OK".localize(), 0.3, {
            type: NotificationType.CompanyMilestones,
            previewImage: "./images/notificationIcons/icon_notification_new_office.png"
        }));
    };

    /**
     * Tạo câu chuyện trên báo khi công ty chuyển lên văn phòng level 2.
     */
    mediaModule.createLevel2OfficeStory = function () {
        var randomDelay = 0.5 + 1.5 * Math.random();
        var companyInstance = GameManager.company;
        var storyText = "It seems that {0} has recently moved into an office in a well known technology park and is now searching for employees.{n}The company, which is known for games such as {1}, has reportedly operated out of a garage until now.{n}One of the many fans of {2} commented: 'I can't believe that they didn't even have a proper office until now and that those games were created by only one person!\nI am really looking forward to their future games!".localize();

        // Lấy ra các game có lượng fan thay đổi nhiều nhất
        var sortedGamesByFans = companyInstance.gameLog.slice().sort(function (gameA, gameB) {
            return gameB.fansChanged - gameA.fansChanged;
        });
        var bestGameTitle = sortedGamesByFans[0].title;
        var famousGameTitles = bestGameTitle;
        if (2 <= sortedGamesByFans.length) {
            famousGameTitles = famousGameTitles + " " + "and".localize() + " " + sortedGamesByFans[1].title;
        }
        storyText = storyText.format(companyInstance.name, famousGameTitles, bestGameTitle);
        companyInstance.notifications.push(new Notification("News".localize("heading"), storyText, "OK".localize(), randomDelay, {
            type: NotificationType.IndustryNews,
            previewImage: "./images/notificationIcons/icon_notification_local_news_and_media.png"
        }));
    };

    /**
     * Tạo các thông báo khi công ty chuyển lên văn phòng level 4.
     */
    mediaModule.createLevel4Notifications = function () {
        var companyInstance = GameManager.company;
        var newOfficeText = "Welcome to the new headquarters of {0}!\nWe now have more space so you can increase the team further. The new office is also close to some renowned universities which gives us great access to new talent.".localize().format(companyInstance.name);
        companyInstance.notifications.push(new Notification("New Office".localize(), newOfficeText, {
            type: NotificationType.CompanyMilestones,
            previewImage: "./images/notificationIcons/icon_notification_new_office.png"
        }));

        var rndLabDelay = 2;
        // Chọn một nhân viên (không phải người chơi) có designFactor cao nhất để đề xuất R&D lab
        var designStaff = companyInstance.staff.slice(1).sort(function (staffA, staffB) {
            return staffB.designFactor - staffA.designFactor;
        })[0];
        var rndLabProposalText = "Wow, this new office is amazing and the location is perfect too. I took a walk around the building earlier and had this radical idea.\nWhy don't we open up our own research and development department?{n}This could really speed up our research and would allow us to attack bigger projects and innovations.\nIt wouldn't be cheap but I think it would allow us to be the leading innovator in the gaming industry.{n}Anyway, I have done some research and I think we should open a lab and hire a whole team of researchers. Before we can do this however, we should have at least one design specialist in our team.".localize();
        var rndLabNotification = new Notification(designStaff.name, rndLabProposalText, "OK".localize(), rndLabDelay, {
            type: NotificationType.CompanyMilestones,
            previewImage: "./images/notificationIcons/icon_notification_new_office.png"
        });
        rndLabNotification.setFlag("dTSpecialistTrainingEnabled", !0); // dTSpecialist có thể là Design/Technology Specialist
        companyInstance.notifications.push(rndLabNotification);
        Tutorial.designSpecialist(rndLabDelay);

        // Đề xuất khóa đào tạo từ trường đại học
        var universityName = "Greenheart" == companyInstance.name ? "Lone Tree" : "Greenheart"; // Tên trường đại học
        var trainingOfferText = "Hello {0},\nWe have just learned that you have opened your new headquarters not too far away from our university! We are just about to start a special course about game development and could really use your help.{n}Unfortunately we cannot offer any pay but I think you will find that teaching students about game development will be a great exercise to refine your own skills.\n{1} University{n}New training options available.".localize().format(companyInstance.name, universityName);
        var trainingNotification = new Notification("Training".localize("heading"), trainingOfferText);
        trainingNotification.weeksUntilFired = 0.5;
        trainingNotification.setFlag("trainingV3Enabled", !0); // Mở khóa các tùy chọn đào tạo cấp 3
        companyInstance.notifications.push(trainingNotification);

        // Mở khóa hợp đồng lớn
        var largeContractDelay = 4 + 3 * companyInstance.getRandom();
        GameManager.enableLargeContracts(largeContractDelay);
    };

    /**
     * Tạo thông báo khi người chơi lần đầu vào R&D lab.
     * @param {Company} companyInstance - Instance của công ty.
     */
    mediaModule.enterRndLab = function (companyInstance) {
        if (!companyInstance.flags.enterRndLab) {
            companyInstance.flags.enterRndLab = !0;
            var text = "Welcome to our very own research and development lab! At the moment it is empty but we have a number of skilled people eager to start working.{n}You don't have to hire them individually, instead you can simply decide on the budget for the R&D lab. The higher the budget, the more researchers will work and the higher the research progress will be.{n}Running your own R&D lab can be very expensive so be careful that you don't overspend. I suggest you start with smaller projects and don't be afraid to cut down the budget if necessary.{n}If there is no active project researchers will generate research points slowly, which you can use to train your main staff and unlock more game options.".localize();
            companyInstance.notifications.push(new Notification("R&D lab".localize(), text, "OK".localize(), 0.35, {
                type: NotificationType.AutoPopup
            }));
            Tutorial.rndLab(0.35);
        }
    };

    /**
     * Tạo thông báo khi người chơi lần đầu vào Hardware lab.
     * @param {Company} companyInstance - Instance của công ty.
     */
    mediaModule.enterHwLab = function (companyInstance) {
        if (!companyInstance.flags.enterHwLab) {
            companyInstance.flags.enterHwLab = !0;
            var text = "Welcome to our very own hardware lab! This is the place where we will create our own game console. Before you start, make sure you have a lot of cash saved up. Building a console isn't cheap. When you are ready to start simply {0} on the screen to access the action menu.".localize().format(Tutorial.getClickVerb());
            companyInstance.notifications.push(new Notification("Hardware lab".localize(), text, "OK".localize(), 0.35, {
                type: NotificationType.AutoPopup
            }));
        }
    };

    /**
     * Tạo câu chuyện khi một game MMO ngừng hoạt động.
     * @param {Game} mmoGame - Đối tượng game MMO.
     */
    mediaModule.createMMOEndStory = function (mmoGame) {
        var monthsOnMarket = Math.roundToDecimals((GameManager.company.currentWeek - mmoGame.releaseWeek) / 4, 1);
        var companyInstance = GameManager.company;
        var storyText = "We just got word that {0} is retiring its MMO game {1} from the market. The game has been on the market for {2} months and racked up over {3} in sales.".localize();
        storyText = mmoGame.flags.isProfitable ?
            storyText + (" " + "We are not quite sure why {0} has decided to take {1} off the market as the game likely still generated income for the company.".localize()) :
            storyText + (" " + "{1} was likely not profitable anymore as the maintenance costs were likely larger than the income.".localize());

        var fansLost = 0;
        // Tìm xem có MMO nào khác của công ty đang hoạt động không
        var otherActiveMMO = GameManager.company.gameLog.first(function (game) {
            return game.id != mmoGame.id && game.flags.mmo && game.isOnSale();
        });

        if (otherActiveMMO) {
            storyText += "{n}" + "While fans of {0} weren't happy about the news many of them also play {1} which is still on the market.".localize().format(companyInstance.name, otherActiveMMO.title);
        } else {
            storyText += "{n}" + "Fans of {1} have voiced complaints with one fan saying: 'I love {0} and played {1} a lot but now that they took it off the market I don't know what MMO I should play. If only {0} had released a new MMO I wouldn't be so upset.'".localize();
            fansLost = Math.floor(0.1 * mmoGame.fansChanged * companyInstance.getRandom());
        }

        var notification = new Notification("Industry News".localize("heading"), storyText.format(companyInstance.name, mmoGame.title, monthsOnMarket, UI.getLongNumberString(mmoGame.unitsSold)), {
            type: NotificationType.SalesReports
        });
        notification.weeksUntilFired = 0.7;
        if (fansLost) {
            notification.adjustFans(-fansLost);
        }
        companyInstance.notifications.push(notification);
    };

    /**
     * Tạo câu chuyện khi công ty phát hành console tùy chỉnh.
     * @param {Platform} customConsole - Đối tượng console tùy chỉnh.
     */
    mediaModule.createConsoleStartStory = function (customConsole) {
        var companyInstance = GameManager.company;
        var isGoodTech = customConsole.isGoodTech;
        var featureFactor = customConsole.featureFactor;
        var successFactor = customConsole.successFactor;
        var qualityFactor = customConsole.qF;

        var storyText = "{0} has released their game console {1} today.".localize().format(companyInstance.name, customConsole.name);
        storyText = isGoodTech ?
            storyText + (" " + "The console seems to really push the limits of technology and is the most modern console ever to hit shelves.".localize()) :
            storyText + (" " + "The console does not seem quite on par with the high tech competitors but we will see what players think.".localize());
        storyText = storyText + " Looking at the features of {0}, it seems that the ".localize().format(customConsole.name);
        storyText = 0.8 <= featureFactor ?
            storyText + "list is extensive which is a good sign and could lead to a wide variety of games becoming available.".localize() :
            storyText + (" " + "list is a bit slim. Don't expect too many gadgets and controllers to be available for this console.".localize());
        storyText = storyText + ("{n}" + "First tests indicate that {0}".localize().format(customConsole.name));
        storyText = 0.8 <= qualityFactor ?
            storyText + "'s build quality is excellent and will likely run for decades without issues.".localize() :
            0.5 <= qualityFactor ?
                storyText + (" " + "is of average build quality. Don't expect it to last forever but in general you should not see many issues.".localize()) :
                storyText + (" " + "is a bit fragile. We wouldn't be surprised if you need to make use of the warranty sooner or later.".localize());
        storyText = storyText + ("\n" + "All in all ".localize("fragment continues with 'we think that the console...'"));
        storyText = 1 <= successFactor ?
            storyText + (" " + "we think that the console will stir up the market and prove to be very successful.".localize("fragment, started with 'All in all'").format(customConsole.name)) :
            0.8 <= successFactor ?
                storyText + (" " + "we think that the console will do reasonably well in the market and it is a welcome addition.".localize("fragment, started with 'All in all'").format(customConsole.name)) :
                storyText + (" " + "it's hard to say whether the console will do well as there are so many other good products on the market.".localize("fragment, started with 'All in all'").format(customConsole.name));

        companyInstance.notifications.push(new Notification({
            header: Media.industryNewsHeadline,
            text: storyText,
            weeksUntilFired: 0.4,
            image: customConsole.iconUri
        }));
    };

    /**
     * Tạo câu chuyện khi console tùy chỉnh ngừng bán.
     * @param {Platform} customConsole - Đối tượng console tùy chỉnh.
     */
    mediaModule.createConsoleEndStory = function (customConsole) {
        var companyInstance = GameManager.company;
        var consoleVersionNumber = 1 === customConsole.version ? "first".localize() : 2 === customConsole.version ? "second".localize() : 3 === customConsole.version ? "third".localize() : customConsole.version;
        var storyText = "{0} has taken their game console {1} off the market.\n{1} was the {2} console created by the company.".localize().format(companyInstance.name, customConsole.name, consoleVersionNumber);
        companyInstance.notifications.push(new Notification({
            header: Media.industryNewsHeadline,
            text: storyText,
            weeksUntilFired: 0.4,
            image: customConsole.iconUri
        }));
    };

    /**
     * Tạo các câu chuyện kết thúc game.
     */
    mediaModule.createFinishGameStories = function () {
        var companyInstance = GameManager.company;
        var bestSeller = companyInstance.getBestSeller() ? companyInstance.getBestSeller() : { title: "nothing" }; // Mặc định nếu không có best seller
        var storyText = "The worldwide game developers guild has awarded {0}, CEO of {1} the lifetime achievement award for contributions to the game industry. {0} has, during a stunning {3} year career at {1} delivered many ground breaking games.{n}The company is most recently known for {2}.".localize().format(companyInstance.staff[0].name, companyInstance.name, bestSeller.title, Math.floor(30 * GameManager.flags.gameLengthModifier));

        var latestCustomConsole = companyInstance.getLatestCustomConsole();
        if (latestCustomConsole) {
            storyText += " They are also known for their console {0} which has done very well on the market.".localize().format(latestCustomConsole.name);
        }

        companyInstance.notifications.push(new Notification(Media.industryNewsHeadline, storyText, {
            type: NotificationType.AutoPopup
        }));
        companyInstance.notifications.push(new Notification("Game finished".localize(), "Congratulations. You have finished Game Dev Tycoon. We will now calculate your final score and show you some statistics. You may continue playing after that.".localize(), {
            type: NotificationType.AutoPopup
        }));
        companyInstance.notifications.push(new Notification("{GameEnd}")); // Placeholder cho dialog kết thúc game
    };

    /**
     * Tạo thông báo cuối game (ví dụ: cảm ơn người chơi).
     */
    mediaModule.createEndOfGameStories = function () {
        PlatformShim.ISWIN8 ? // Kiểm tra xem có phải phiên bản Windows Store không
            GameManager.company.notifications.push(DecisionNotifications.endOfGame1.getNotification(GameManager.company)) :
            GameManager.company.notifications.push(DecisionNotifications.endOfGameNative.getNotification(GameManager.company));
    };
})();