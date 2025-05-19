(function () {
    var a = Research;
    a._checkForNewLabResearch = function (b) {
        if (b.flags.rndLabUnlocked) {
            var c = "";
            b.flags.bigProjectsResearchActiveShown || (b.flags.bigProjectsResearchActiveShown = []);
            for (var k = 0; k < a.bigProjects.length; k++) {
                var m = a.bigProjects[k];
                m.canResearch(b) && -1 == b.flags.bigProjectsResearchActiveShown.indexOf(m.id) && (b.flags.bigProjectsResearchActiveShown.push(m.id), c += "\n" + m.name)
            }
            0 < c.length && (c = new Notification("R&D lab".localize(), "New research available:".localize() + " \n" + c, {
                type: NotificationType.NewResearchAvailable
            }),
                b.notifications.push(c))
        }
    };
    var b = 2,
        c = "Lab report".localize();
    a.opportunityInternet = {
        id: "opportunityInternet",
        name: "Internet Opportunities".localize(),
        pointsCost: 500,
        canResearch: function (b) {
            return -1 == b.researchCompleted.indexOf(a.opportunityInternet)
        },
        iconUri: "./images/projectIcons/superb/internet.png",
        description: "The internet will change our lives forever. This project will investigate how we can use the internet to make better games and deliver better experiences. Completing this project should unlock new options for research.".localize(),
        targetZone: b,
        complete: function (b) {
            b.researchCompleted.push(a.opportunityInternet);
            var d = "After careful examination we come to the conclusion that the internet is a huge opportunity in the gaming industry. We already see some small signs how successful multiplayer games can be but multiplayer is usually an additional feature to a game and not the main focus.{n}We think we could develop technologies to create a massively multiplayer online game (short MMO), a game where tens of thousands of players can play together. To create such an MMO more research is necessary.{n}The second discovery is that we could start developing an online distribution platform. Instead of players buying games in local stores they could download games directly from our servers. This would cut out the middle man and we could gain a large share of the market and additional income to fund our developments.".localize(),
                d = new Notification(c, d, {
                    type: NotificationType.Others,
                    image: a.opportunityInternet.iconUri
                });
            b.notifications.push(d)
        }
    };
    a.grid = {
        id: "Grid",
        name: "Codename: Grid".localize(),
        pointsCost: 1200,
        canResearch: function (b) {
            return !b.flags.grid && -1 != b.researchCompleted.indexOf(a.opportunityInternet) && b.researchCompleted.indexOf(a.grid)
        },
        iconUri: "./images/projectIcons/superb/grid.png",
        description: "A bold plan to develop an internet-based distribution platform for games. Rather than buying games through retailers players worldwide can simply download them. The platform features digital rights management to combat piracy and also enables a new market for smaller developers to show off their products.".localize(),
        targetZone: b,
        complete: function (b) {
            b.researchCompleted.push(a.grid);
            var d = b.licencedPlatforms.some(function (a) {
                return a.isCustom
            }),
                k = "Boss, it is done and it is live! Grid is the name of our very own internet-based distribution platform.".localize() + " ",
                k = d ? k + "Since we already have our own console we have integrated this service into our console. This should boost our market share considerably.".localize() : k + "This system should boost the market share of the PC considerably and if we ever have our own console it will also be of great benefit.".localize(),
                k = k + ("{n}" + "Grid will generate income every month which should boost our ability to create new games and develop new projects.".localize());
            b.flags.grid = !0;
            b.notifications.push(new Notification(c, k, {
                type: NotificationType.Others,
                image: a.grid.iconUri
            }))
        }
    };
    a.ownConvention = {
        id: "ownConvention",
        name: "Own Convention".localize(),
        pointsCost: 500,
        canResearch: function (a) {
            return 1E6 <= a.fans && !a.flags.customConference || a.isLaterOrEqualThan(23)
        },
        iconUri: "./images/projectIcons/superb/convention.png",
        description: "It's all well and good to have a booth at the yearly game convention and show off our products but with our large fan base we should consider staging our very own convention instead!".localize(),
        targetZone: b,
        complete: function (b) {
            b.flags.customConference = !0;
            var d = "Boss, we have completed the organization of our own convention.".localize(),
                d = new Notification(c, d, {
                    type: NotificationType.Others,
                    image: a.ownConvention.iconUri
                });
            b.notifications.push(d)
        }
    };
    a.ThreeDGraphicsV6Project = {
        id: "3D Graphics V6 Project",
        name: "3D Graphics V6".localize(),
        pointsCost: 1200,
        canResearch: function (a) {
            return !a.flags.graphicsV6 && 3 < LevelCalculator.getEnginePartLevel(a, "3D Graphics V5")
        },
        iconUri: "./images/projectIcons/superb/graphics-v6.png",
        description: "Pushing the boundaries of photorealism this revolutionary graphics engine will blow away everything that has come before. Near infinite draw distance, ultra-high polygon counts and realistic particle and volumetric effects.".localize(),
        targetZone: b,
        complete: function (b) {
            b.flags.graphicsV6 = !0;
            b.researchCompleted.push(a.ThreeDGraphicsV6);
            b.notifications.push(new Notification({
                header: c,
                text: "We have successfully completed the research on our next generation graphics technology and we can now start building a game engine to make use of this research.".localize(),
                image: "./images/projectIcons/superb/graphics-v6.png"
            }))
        }
    };
    a.ThreeDGraphicsV7PRoject = {
        id: "3D Graphics V7 Project",
        name: "3D Graphics V7".localize(),
        pointsCost: 1600,
        canResearch: function (a) {
            return !a.flags.graphicsV7 && 3 < LevelCalculator.getEnginePartLevel(a, "3D Graphics V6")
        },
        iconUri: "./images/projectIcons/superb/graphics-v7.png",
        description: "The ultimate in graphics technology. This will look better than reality. If anyone ever builds a holodeck then this is the graphics engine it would run on.".localize(),
        targetZone: b,
        complete: function (b) {
            b.flags.graphicsV7 = !0;
            b.researchCompleted.push(a.ThreeDGraphicsV7);
            b.notifications.push(new Notification({
                header: c,
                text: "We have done it! Our research was successful and we should be able to support our concepts for the ultimate graphics technology in our next game engine. This will be a revolution for the gaming industry!".localize(),
                image: "./images/projectIcons/superb/graphics-v7.png"
            }))
        }
    };
    a.sublicenseEngines = {
        id: "sublicenseEngines",
        name: "License Game Engines".localize(),
        pointsCost: 1500,
        canResearch: function (b) {
            return 10 <= b.engines.length && -1 == b.researchCompleted.indexOf(a.sublicenseEngines)
        },
        iconUri: "./images/projectIcons/superb/license-engine.png",
        description: "We have a lot of experience in creating custom game engines. Why not sub-license our engines to other developers? Not only will this cement our market position as a technology leader but it will also help offset the growing costs of developing engines.".localize(),
        targetZone: b,
        complete: function (b) {
            b.researchCompleted.push(a.sublicenseEngines)
        }
    };
    a.hardware = {
        id: "hardware",
        name: "Hardware".localize(),
        pointsCost: 800,
        canResearch: function (a) {
            return !a.flags.customHardwareResearched
        },
        iconUri: "./images/projectIcons/superb/hw-lab.png",
        description: "Software doesn't run without hardware. We are experts in creating software but why not also investigate whether we can create our own hardware?".localize(),
        targetZone: b,
        complete: function (b) {
            b.flags.customHardwareResearched = !0;
            var d = b.staff.some(function (a) {
                return a.flags.technologySpecialist
            }),
                k = "Our research is complete. There is definitely a big opportunity ahead of us. If we create our own hardware lab and have the appropriate technology specialists to run it then we could even create our very own gaming console!{n}It would not be cheap and it will probably take us a few years but maybe we could even trump the likes of an mBox or the Playsystem!".localize();
            d || (k += "{n}" + "Before we can think about creating this lab we need at least one technology specialist on our team so this should be our priority.".localize());
            d = new Notification(c, k, {
                image: a.hardware.iconUri
            });
            b.notifications.push(d)
        }
    };
    a.MMO = {
        id: "MMO",
        name: "MMO".localize(),
        pointsCost: 1700,
        canResearch: function (b) {
            return -1 == b.researchCompleted.indexOf(a.MMO) && -1 != b.researchCompleted.indexOf(a.opportunityInternet)
        },
        iconUri: "./images/projectIcons/superb/mmo.png",
        description: "Massively Multiplayer Online games! We know how much fun it is to play multiplayer games but imagine that instead of playing with a handful of players you could play with thousands! This project will unlock a brand new genre to allow you to create MMO games.".localize(),
        targetZone: b,
        complete: function (b) {
            b.researchCompleted.push(a.MMO);
            var d = "Boss, our research into massively multiplayer online (MMO) games is complete. The possibilities of MMOs are big but they are also risky. In our research we realized that before we can begin to develop an MMO we will need to create a special game engine for it.{n}You will need to complete the research for the MMO support feature with one of your staff. Once it is integrated into a game engine you can start building an MMO but be careful. It seems that MMOs only work with the best theme/genre combinations and you will also need to have specialists on your team to make an MMO successful.".localize(),
                d = new Notification(c, d, {
                    image: a.MMO.iconUri
                });
            b.notifications.push(d)
        }
    };
    a.AAA = {
        id: "AAA",
        name: "AAA Games".localize(),
        pointsCost: 2E3,
        canResearch: function (b) {
            return -1 == b.researchCompleted.indexOf(a.AAA) && b.gameLog.some(function (a) {
                return 10 === a.score && "large" === a.gameSize
            })
        },
        iconUri: "./images/projectIcons/superb/aaa.png",
        description: "We have proven that we can make large games work. How about we see how we can make games that are so massive in scope and of such high quality that they will create an entire new label. To borrow a term from the finance sector they will be triple A rated games or to borrow from the movie industry, true blockbusters.".localize(),
        targetZone: b,
        complete: function (b) {
            b.researchCompleted.push(a.AAA);
            var d = "Boss, our research into AAA games is complete and we can now begin to create AAA games. A triple A game requires well-trained staff and it is best to have specialists in the different areas to make sure the team does their best work.{n}When creating a AAA game we can also use the R&D lab to develop a special marketing campaign which greatly enhances the hype around the game.".localize();
            b.flags.hwLabUnlocked && (d += "\n" + "The hardware lab can also be used to develop special hardware products such as keyboard, mice and headsets that are sold with the game.".localize());
            d = new Notification(c, d, {
                image: a.AAA.iconUri
            });
            b.notifications.push(d)
        }
    };
    a.AAAMarketingCampaign = {
        id: "AAAMarketingCampaign",
        name: "Marketing Campaign".localize(),
        pointsCost: 1E3,
        canResearch: function (a) {
            return a.currentGame && "aaa" == a.currentGame.gameSize && !a.currentGame.flags.AAAMarketingCompleted
        },
        iconUri: "./images/projectIcons/superb/aaa-marketing.png",
        description: "Let's use our in-house skills to design a special marketing campaign for our AAA title.".localize(),
        targetZone: b,
        complete: function (a) {
            a.currentGame &&
                (a.currentGame.flags.AAAMarketingCompleted = !0)
        },
        cancel: function (a) {
            a.currentGame && (a.currentGame.flags.AAAMarketingCompleted = !0)
        },
        isRepeatable: !0
    };
    b = 0;
    a.AAACustomHardware = {
        id: "AAACustomHardware",
        name: "Custom Hardware".localize(),
        pointsCost: 1E3,
        canResearch: function (a) {
            return a.flags.hwLabUnlocked && a.currentGame && "aaa" == a.currentGame.gameSize && !a.currentGame.flags.AAACustomHardwareCompleted
        },
        iconUri: "./images/projectIcons/superb/aaa-hardware.png",
        description: "Let's use our in-house hardware lab to design and develop special hardware products to coincide with the release of our AAA title.".localize(),
        targetZone: b,
        complete: function (a) {
            a.currentGame && (a.currentGame.flags.AAACustomHardwareCompleted = !0)
        },
        cancel: function (a) {
            a.currentGame && (a.currentGame.flags.AAACustomHardwareCompleted = !0)
        },
        isRepeatable: !0
    };
    a.bigProjects = [a.AAAMarketingCampaign, a.AAACustomHardware, a.ownConvention, a.opportunityInternet, a.grid, a.ThreeDGraphicsV6Project, a.ThreeDGraphicsV7PRoject, a.sublicenseEngines, a.hardware, a.MMO, a.AAA]
})();