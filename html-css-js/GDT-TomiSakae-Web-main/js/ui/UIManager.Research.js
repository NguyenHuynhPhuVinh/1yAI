var Research = {};
(function () {
    var a = Research;
    a.FACTOR_FOR_NEW_COMBINATIONS = 2;
    a.TOPICS_VISIBLE = 4;
    var b = "General",
        c = "General".localize(),
        f = "general";
    a.ResearchTopicItem = {
        id: "New Topic",
        name: "New Topic".localize(),
        pointsCost: 10,
        duration: 1E4,
        category: b,
        categoryDisplayName: c
    };
    a.CustomEngine = {
        id: "Custom Engine",
        name: "Custom Game Engine".localize(),
        pointsCost: 50,
        duration: 15E3,
        category: b,
        categoryDisplayName: c
    };
    a.BasicItems = [a.ResearchTopicItem, a.CustomEngine];
    a.checkForNewResearch = function () {
        for (var b = [], c = GameManager.company,
            d = this.getAllItems().except(Research.StartEngineParts.concat(c.researchCompleted.concat(c.availableResearch).concat(General.getAvailableEngineParts(c)))), f = 0; f < d.length; f++) {
            var n = d[f];
            void 0 != n.canResearch && n.canResearch(c) && (n.v && c.canDevelopEngine() || !n.v) && -1 == b.indexOf(n) && b.push(n)
        }
        if (0 < b.length) {
            d = "New research available:".localize();
            for (f = 0; f < b.length; f++) n = b[f], c.availableResearch.push(n), d += "\n" + n.name;
            b = new Notification("New Research!".localize("heading"), d);
            b.sound = "research";
            b.type = NotificationType.NewResearchAvailable;
            c.notifications.push(b)
        }
        a._checkForNewLabResearch && a._checkForNewLabResearch(c)
    };
    b = "Graphic";
    c = "Graphic".localize();
    f = "graphic-type";
    a.textGraphics = {
        id: "Text Based",
        name: "Text based".localize(),
        devCost: 2E3,
        v: 1,
        techLevel: 0,
        category: b,
        categoryDisplayName: c,
        group: f
    };
    var d = "2D Graphics V{0}".localize();
    a.TwoDGraphicsV1 = {
        id: "2D Graphics V1",
        name: d.format(1),
        engineCost: 1E4,
        devCost: 15E3,
        v: 2,
        canResearch: function (a) {
            return !1
        },
        category: b,
        categoryDisplayName: c,
        group: f,
        consolePart: !0,
        techLevel: 1
    };
    a.TwoDGraphicsV2 = {
        id: "2D Graphics V2",
        name: d.format(2),
        v: 4,
        canResearch: function (a) {
            return !1
        },
        category: b,
        categoryDisplayName: c,
        group: f,
        consolePart: !0,
        techLevel: 2,
        showXPGain: !0
    };
    a.TwoDGraphicsV3 = {
        id: "2D Graphics V3",
        name: d.format(3),
        v: 6,
        canResearch: function (a) {
            return 2 < LevelCalculator.getFeatureLevel(a, "2D Graphics V2")
        },
        category: b,
        categoryDisplayName: c,
        group: f,
        consolePart: !0,
        techLevel: 2,
        showXPGain: !0
    };
    a.TwoDGraphicsV4 = {
        id: "2D Graphics V4",
        name: d.format(4),
        v: 8,
        canResearch: function (a) {
            return 2 < LevelCalculator.getFeatureLevel(a,
                "2D Graphics V3")
        },
        category: b,
        categoryDisplayName: c,
        group: f,
        consolePart: !0,
        techLevel: 3,
        showXPGain: !0
    };
    a.TwoDGraphicsV5 = {
        id: "2D Graphics V5",
        name: d.format(5),
        v: 10,
        canResearch: function (a) {
            return 2 < LevelCalculator.getFeatureLevel(a, "2D Graphics V4")
        },
        category: b,
        categoryDisplayName: c,
        group: f,
        consolePart: !0,
        techLevel: 3,
        showXPGain: !0
    };
    d = "3D Graphics V{0}".localize();
    a.ThreeDGraphicsV1 = {
        id: "3D Graphics V1",
        name: d.format(1),
        v: 2,
        canResearch: function (a) {
            return 2 < LevelCalculator.getFeatureLevel(a, "2D Graphics V2")
        },
        category: b,
        categoryDisplayName: c,
        group: f,
        consolePart: !0,
        techLevel: 1,
        showXPGain: !0
    };
    a.ThreeDGraphicsV2 = {
        id: "3D Graphics V2",
        name: d.format(2),
        v: 4,
        canResearch: function (a) {
            return 2 < LevelCalculator.getFeatureLevel(a, "3D Graphics V1")
        },
        category: b,
        categoryDisplayName: c,
        group: f,
        consolePart: !0,
        techLevel: 2,
        showXPGain: !0
    };
    a.ThreeDGraphicsV3 = {
        id: "3D Graphics V3",
        name: d.format(3),
        v: 6,
        canResearch: function (a) {
            return 2 < LevelCalculator.getFeatureLevel(a, "3D Graphics V2")
        },
        category: b,
        categoryDisplayName: c,
        group: f,
        consolePart: !0,
        techLevel: 3,
        showXPGain: !0
    };
    a.ThreeDGraphicsV4 = {
        id: "3D Graphics V4",
        name: d.format(4),
        v: 8,
        canResearch: function (a) {
            return 2 < LevelCalculator.getFeatureLevel(a, "3D Graphics V3")
        },
        category: b,
        categoryDisplayName: c,
        group: f,
        consolePart: !0,
        techLevel: 4,
        showXPGain: !0
    };
    a.ThreeDGraphicsV5 = {
        id: "3D Graphics V5",
        name: d.format(5),
        v: 10,
        canResearch: function (a) {
            return 2 < LevelCalculator.getFeatureLevel(a, "3D Graphics V4")
        },
        category: b,
        categoryDisplayName: c,
        group: f,
        consolePart: !0,
        techLevel: 5,
        showXPGain: !0
    };
    a.ThreeDGraphicsV6 = {
        id: "3D Graphics V6",
        name: d.format(6),
        v: 12,
        canResearch: function (a) {
            return !1
        },
        category: b,
        categoryDisplayName: c,
        group: f,
        consolePart: !0,
        techLevel: 6,
        showXPGain: !0
    };
    a.ThreeDGraphicsV7 = {
        id: "3D Graphics V7",
        name: d.format(7),
        v: 14,
        canResearch: function (a) {
            return !1
        },
        category: b,
        categoryDisplayName: c,
        group: f,
        consolePart: !0,
        techLevel: 7,
        showXPGain: !0
    };
    a.stereoScopic3D = {
        id: "Stereoscopic 3D",
        name: "Advanced Stereoscopic 3D".localize(),
        v: 4,
        canResearch: function (a) {
            return 6 < LevelCalculator.getMissionLevel("Graphic")
        },
        canUse: function (a) {
            if (!a || !a.features) return !1;
            var b = "3D Graphics V3;3D Graphics V4;3D Graphics V4;3D Graphics V5;3D Graphics V6;3D Graphics V7".split(";");
            return a.features.some(function (a) {
                return -1 != b.indexOf(a.id)
            })
        },
        category: b,
        categoryDisplayName: c,
        consolePart: !0
    };
    a.graphicItems = [a.textGraphics, a.TwoDGraphicsV1, a.TwoDGraphicsV2, a.TwoDGraphicsV3, a.TwoDGraphicsV4, a.TwoDGraphicsV5, a.ThreeDGraphicsV1, a.ThreeDGraphicsV2, a.ThreeDGraphicsV3, a.ThreeDGraphicsV4, a.ThreeDGraphicsV5, a.ThreeDGraphicsV6, a.ThreeDGraphicsV7,
    a.stereoScopic3D
    ];
    b = "Sound";
    c = "Sound".localize();
    f = "Sound";
    a.simpleSounds = {
        id: "Basic Sound",
        name: "Basic sounds".localize(),
        devCost: 1E3,
        v: 1,
        category: b,
        categoryDisplayName: c,
        group: f
    };
    a.mono = {
        id: "Mono sound",
        name: "Mono sound".localize(),
        v: 2,
        canResearch: function (a) {
            return a.canDevelopEngine() && 1 < LevelCalculator.getMissionLevel("Sound")
        },
        category: b,
        categoryDisplayName: c,
        group: f
    };
    a.stereo = {
        id: "Stereo sound",
        name: "Stereo sound".localize(),
        v: 4,
        canResearch: function (a) {
            return 3 < LevelCalculator.getMissionLevel("Sound")
        },
        category: b,
        categoryDisplayName: c,
        group: f,
        consolePart: !0
    };
    a.soundTrack = {
        id: "Soundtrack",
        name: "Soundtrack".localize(),
        v: 4,
        canResearch: function (a) {
            return 4 < LevelCalculator.getMissionLevel("Sound")
        },
        category: b,
        categoryDisplayName: c,
        group: "soundtrack",
        consolePart: !0
    };
    a.surround = {
        id: "Surround sound",
        name: "Surround sound".localize(),
        v: 6,
        canResearch: function (a) {
            return 5 < LevelCalculator.getMissionLevel("Sound")
        },
        category: b,
        categoryDisplayName: c,
        group: f,
        consolePart: !0
    };
    a.orchestralSoundtrack = {
        id: "Orchestral Soundtrack",
        name: "Orchestral soundtrack".localize(),
        v: 8,
        canResearch: function (a) {
            return 6 < LevelCalculator.getMissionLevel("Sound")
        },
        category: b,
        categoryDisplayName: c,
        group: "soundtrack"
    };
    a.soundItems = [a.simpleSounds, a.mono, a.stereo, a.soundTrack, a.surround, a.orchestralSoundtrack];
    b = "AI";
    c = "A.I.".localize();
    a.simpleAI = {
        id: "simpleAI",
        name: "Simple A.I.".localize(),
        v: 2,
        canResearch: function (a) {
            return a.canDevelopEngine() && 1 < LevelCalculator.getMissionLevel("AI")
        },
        category: b,
        categoryDisplayName: c,
        group: "ai"
    };
    a.AI = {
        id: "AI",
        name: "Better A.I.".localize(),
        v: 4,
        canResearch: function (a) {
            return a.canDevelopEngine() && 3 < LevelCalculator.getMissionLevel("AI")
        },
        category: b,
        categoryDisplayName: c,
        group: "ai"
    };
    a.AICompanions = {
        id: "AI Companions",
        name: "A.I. Companions".localize(),
        v: 4,
        canResearch: function (a) {
            return 4 < LevelCalculator.getMissionLevel("AI")
        },
        category: b,
        categoryDisplayName: c
    };
    a.SelfLearningAI = {
        id: "Self learning AI",
        name: "Self-learning A.I.".localize(),
        v: 10,
        canResearch: function (a) {
            return 8 < LevelCalculator.getMissionLevel("AI")
        },
        category: b,
        categoryDisplayName: c
    };
    a.aiItems = [a.AI, a.AICompanions, a.SelfLearningAI];
    b = "Gameplay";
    c = "Gameplay".localize();
    a.GameTutorials = {
        id: "Game Tutorials",
        name: "Game tutorials".localize(),
        v: 2,
        canResearch: function (a) {
            return a.canDevelopEngine() && 1 < LevelCalculator.getMissionLevel("Gameplay")
        },
        category: b,
        categoryDisplayName: c
    };
    a.BetterUI = {
        id: "BetterUI",
        name: "Better user experience".localize(),
        v: 2,
        canResearch: function (a) {
            return a.canDevelopEngine() && 2 < LevelCalculator.getMissionLevel("Gameplay")
        },
        category: b,
        categoryDisplayName: c
    };
    a.characterProgression = {
        id: "Character progression",
        name: "Character progression".localize(),
        v: 4,
        canResearch: function (a) {
            return a.canDevelopEngine() && 3 < LevelCalculator.getMissionLevel("Gameplay")
        },
        category: b,
        categoryDisplayName: c
    };
    a.Achievements = {
        id: "Achievements",
        name: "Achievements".localize(),
        v: 2,
        canResearch: function (a) {
            return 5 < LevelCalculator.getMissionLevel("Gameplay") && a.isLaterOrEqualThan(13)
        },
        category: b,
        categoryDisplayName: c,
        consolePart: !0
    };
    a.SkillTrees = {
        id: "Skill trees",
        name: "Skill trees".localize(),
        v: 6,
        canResearch: function (a) {
            return 6 < LevelCalculator.getMissionLevel("Gameplay")
        },
        category: b,
        categoryDisplayName: c
    };
    a.CoOp = {
        id: "CoOp",
        name: "Cooperative play".localize(),
        v: 8,
        canResearch: function (a) {
            return 7 < LevelCalculator.getMissionLevel("Gameplay")
        },
        category: b,
        categoryDisplayName: c
    };
    a.vrHeadset = {
        id: "vrHeadset",
        name: "Visorius Support".localize(),
        v: 8,
        canResearch: function (a) {
            return a.flags.visoriusAnnounced
        },
        category: b,
        categoryDisplayName: c,
        consolePart: !0
    };
    a.gameplayItems = [a.GameTutorials, a.BetterUI, a.Achievements, a.characterProgression, a.SkillTrees, a.CoOp, a.vrHeadset];
    b = "Engine";
    c = "Engine".localize();
    a.saveGame = {
        id: "Savegame",
        name: "Savegame".localize(),
        v: 1,
        canResearch: function (a) {
            return !1
        },
        category: b,
        categoryDisplayName: c,
        group: "savegame"
    };
    a.Multiplayer = {
        id: "Multiplayer",
        name: "Multiplayer".localize(),
        v: 2,
        canResearch: function (a) {
            return a.canDevelopEngine() && 3 < LevelCalculator.getMissionLevel("Engine")
        },
        category: b,
        categoryDisplayName: c,
        group: "multiplayer",
        consolePart: !0
    };
    a.VideoPlayback = {
        id: "Video playback",
        name: "Video playback".localize(),
        v: 4,
        canResearch: function (a) {
            return a.canDevelopEngine() && 4 < LevelCalculator.getMissionLevel("Engine")
        },
        category: b,
        categoryDisplayName: c,
        consolePart: !0
    };
    a.BasicPhysics = {
        id: "Basic physics",
        name: "Basic physics".localize(),
        v: 4,
        canResearch: function (a) {
            return a.canDevelopEngine() && 5 < LevelCalculator.getMissionLevel("Engine")
        },
        category: b,
        categoryDisplayName: c,
        consolePart: !0
    };
    a.ModSupport = {
        id: "Mod support",
        name: "Mod support".localize(),
        v: 2,
        canResearch: function (a) {
            return a.canDevelopEngine() && 5 < LevelCalculator.getMissionLevel("Engine")
        },
        category: b,
        categoryDisplayName: c
    };
    a.OnlinePlay = {
        id: "Online play",
        name: "Online play".localize(),
        v: 6,
        canResearch: function (a) {
            return a.canDevelopEngine() && 6 < LevelCalculator.getMissionLevel("Engine")
        },
        category: b,
        categoryDisplayName: c,
        group: "multiplayer",
        consolePart: !0
    };
    a.AdvancedPhysics = {
        id: "Advanced Physics",
        name: "Advanced physics".localize(),
        v: 8,
        canResearch: function (a) {
            return a.canDevelopEngine() && 8 < LevelCalculator.getMissionLevel("Engine")
        },
        category: b,
        categoryDisplayName: c,
        consolePart: !0
    };
    a.saveToCloud = {
        id: "Save to cloud",
        name: "Save to cloud".localize(),
        v: 2,
        canResearch: function (a) {
            return 5 < LevelCalculator.getMissionLevel("Engine") && a.isLaterOrEqualThan(13)
        },
        category: b,
        categoryDisplayName: c,
        consolePart: !0
    };
    a.MMOSupport = {
        id: "mmoSupport",
        name: "MMO Support".localize(),
        v: 10,
        canResearch: function (a) {
            return a.canDevelopMMOGames()
        },
        category: b,
        categoryDisplayName: c,
        group: "multiplayer",
        consolePart: !1,
        canUse: function (a) {
            return !1
        }
    };
    a.sdk = {
        id: "SDK",
        name: "Software Development Kit".localize(),
        pointsCost: 100,
        duration: 1E4,
        enginePoints: 40,
        engineCost: 1E5,
        canResearch: function (b) {
            return -1 != b.researchCompleted.indexOf(a.sublicenseEngines)
        },
        category: b,
        categoryDisplayName: c,
        canUse: function (a) {
            return !1
        }
    };
    a.MultiPlatformOptimized = {
        id: "MultiPlatformOptimized",
        name: "Multi-Platform optimized".localize(),
        pointsCost: 100,
        duration: 1E4,
        enginePoints: 50,
        engineCost: 2E6,
        canResearch: function (a) {
            return a.flags.multiPlatformOptimizeResearchAvailable
        },
        category: b,
        categoryDisplayName: c,
        canUse: function (a) {
            return !1
        }
    };
    a.engineItems = [a.saveGame, a.Multiplayer, a.VideoPlayback, a.BasicPhysics, a.OnlinePlay, a.AdvancedPhysics, a.MMOSupport, a.saveToCloud, a.ModSupport, a.sdk, a.MultiPlatformOptimized];
    b = "Story/Quests";
    c = "Story/Quests".localize();
    a.linearStory = {
        id: "Linear story",
        name: "Linear story".localize(),
        v: 2,
        canResearch: function (a) {
            return !1
        },
        category: b,
        categoryDisplayName: c,
        group: "story"
    };
    a.simpleCutScenes = {
        id: "Simple cutscenes",
        name: "Simple cutscenes".localize(),
        v: 2,
        canResearch: function (a) {
            return 2 <
                LevelCalculator.getMissionLevel("Story/Quests")
        },
        category: b,
        categoryDisplayName: c,
        group: "cutscenes"
    };
    a.branchedStory = {
        id: "Branching story",
        name: "Branching story".localize(),
        v: 4,
        canResearch: function (a) {
            return 3 < LevelCalculator.getMissionLevel("Story/Quests")
        },
        category: b,
        categoryDisplayName: c,
        group: "story"
    };
    a.advancedCutScenes = {
        id: "Advanced cutscenes",
        name: "Advanced cutscenes".localize(),
        v: 4,
        canResearch: function (a) {
            return 4 < LevelCalculator.getMissionLevel("Story/Quests")
        },
        category: b,
        categoryDisplayName: c,
        group: "cutscenes"
    };
    a.fullMotionVideo = {
        id: "fmv",
        name: "Full motion video".localize(),
        v: 6,
        canResearch: function (a) {
            return 5 < LevelCalculator.getMissionLevel("Story/Quests")
        },
        category: b,
        categoryDisplayName: c
    };
    a.interactiveStory = {
        id: "Interactive story",
        name: "Interactive story".localize(),
        v: 6,
        canResearch: function (a) {
            return 6 < LevelCalculator.getMissionLevel("Story/Quests")
        },
        category: b,
        categoryDisplayName: c,
        group: "story"
    };
    a.moralChoices = {
        id: "Moral choices",
        name: "Moral choices".localize(),
        v: 6,
        canResearch: function (a) {
            return 6 <
                LevelCalculator.getMissionLevel("Story/Quests")
        },
        category: b,
        categoryDisplayName: c
    };
    a.immersiveStoryTelling = {
        id: "Immersive story telling",
        name: "Immersive story telling".localize(),
        v: 8,
        canResearch: function (a) {
            return 7 < LevelCalculator.getMissionLevel("Story/Quests")
        },
        category: b,
        categoryDisplayName: c,
        group: "story"
    };
    a.reactiveQuests = {
        id: "Reactive quests",
        name: "Reactive quests".localize(),
        v: 10,
        canResearch: function (a) {
            return 8 < LevelCalculator.getMissionLevel("Story/Quests")
        },
        category: b,
        categoryDisplayName: c
    };
    a.storyItems = [a.linearStory, a.branchedStory, a.simpleCutScenes, a.advancedCutScenes, a.fullMotionVideo, a.interactiveStory, a.moralChoices, a.immersiveStoryTelling, a.reactiveQuests];
    b = "Dialogs";
    c = "Dialogues".localize();
    a.betterDialogs = {
        id: "Better dialogues",
        name: "Better dialogues".localize(),
        v: 1,
        canResearch: function (a) {
            return 2 < LevelCalculator.getMissionLevel("Dialogs")
        },
        category: b,
        categoryDisplayName: c
    };
    a.dialogueTree = {
        id: "Dialogue tree",
        name: "Dialogue tree".localize(),
        v: 4,
        canResearch: function (a) {
            return 3 <
                LevelCalculator.getMissionLevel("Dialogs")
        },
        category: b,
        categoryDisplayName: c
    };
    a.voiceOver = {
        id: "Voice over",
        name: "Voice over".localize(),
        v: 6,
        canResearch: function (a) {
            return 5 < LevelCalculator.getMissionLevel("Dialogs")
        },
        category: b,
        categoryDisplayName: c,
        group: "Voice acting"
    };
    a.simpleBodyLanguage = {
        id: "Simple body language",
        name: "Simple body language".localize(),
        v: 6,
        canResearch: function (a) {
            return 5 < LevelCalculator.getMissionLevel("Dialogs")
        },
        category: b,
        categoryDisplayName: c,
        group: "Body language"
    };
    a.advancedBodyLanguage = {
        id: "Advanced body language",
        name: "Advanced body language".localize(),
        v: 8,
        canResearch: function (a) {
            return 6 < LevelCalculator.getMissionLevel("Dialogs")
        },
        category: b,
        categoryDisplayName: c,
        group: "Body language"
    };
    a.celebrityVoiceActing = {
        id: "Celebrity voice acting",
        name: "Celebrity voice acting".localize(),
        v: 6,
        canResearch: function (a) {
            return 7 < LevelCalculator.getMissionLevel("Dialogs")
        },
        category: b,
        categoryDisplayName: c,
        group: "Voice acting"
    };
    a.realisticBodyLanguage = {
        id: "Realistic body language",
        name: "Realistic body language".localize(),
        v: 10,
        canResearch: function (a) {
            return 8 < LevelCalculator.getMissionLevel("Dialogs")
        },
        category: b,
        categoryDisplayName: c,
        group: "Body language"
    };
    a.dialogItems = [a.betterDialogs, a.dialogueTree, a.voiceOver, a.simpleBodyLanguage, a.advancedBodyLanguage, a.celebrityVoiceActing, a.realisticBodyLanguage];
    b = "World Design";
    c = "World Design".localize();
    a.openWorld = {
        id: "Open world",
        name: "Open world".localize(),
        v: 2,
        canResearch: function (a) {
            return 2 < LevelCalculator.getMissionLevel("World Design")
        },
        category: b,
        categoryDisplayName: c
    };
    a.dayNightCycle = {
        id: "Day/Night Cycle",
        name: "Day & night cycle".localize(),
        v: 2,
        canResearch: function (a) {
            return 3 < LevelCalculator.getMissionLevel("World Design")
        },
        category: b,
        categoryDisplayName: c
    };
    a.richBackStory = {
        id: "Rich Backstory",
        name: "Rich backstory".localize(),
        v: 2,
        enginePoints: 0,
        canResearch: function (a) {
            return 4 < LevelCalculator.getMissionLevel("World Design")
        },
        category: b,
        categoryDisplayName: c
    };
    a.virtualEconomy = {
        id: "Virtual economy",
        name: "Virtual economy".localize(),
        v: 4,
        canResearch: function (a) {
            return 5 <
                LevelCalculator.getMissionLevel("World Design")
        },
        category: b,
        categoryDisplayName: c
    };
    a.realisticWeather = {
        id: "Realistic Weather",
        name: "Realistic weather".localize(),
        v: 6,
        canResearch: function (a) {
            return 6 < LevelCalculator.getMissionLevel("World Design")
        },
        category: b,
        categoryDisplayName: c
    };
    a.dynamicWorld = {
        id: "Dynamic World",
        name: "Dynamic world".localize(),
        v: 8,
        canResearch: function (a) {
            return 7 < LevelCalculator.getMissionLevel("World Design")
        },
        category: b,
        categoryDisplayName: c
    };
    a.worldDesignItems = [a.openWorld,
    a.dayNightCycle, a.richBackStory, a.virtualEconomy, a.realisticWeather, a.dynamicWorld
    ];
    b = "Level Design";
    c = "Level Design".localize();
    a.levelEditor = {
        id: "Level editor",
        name: "Level editor".localize(),
        v: 1,
        canResearch: function (a) {
            return 2 < LevelCalculator.getMissionLevel("Level Design")
        },
        category: b,
        categoryDisplayName: c
    };
    a.easterEggs = {
        id: "Easter Eggs",
        name: "Easter eggs".localize(),
        v: 2,
        canResearch: function (a) {
            return 4 < LevelCalculator.getMissionLevel("Level Design")
        },
        category: b,
        categoryDisplayName: c
    };
    a.miniGames = {
        id: "Mini Games",
        name: "Mini games".localize(),
        v: 4,
        canResearch: function (a) {
            return 5 < LevelCalculator.getMissionLevel("Level Design")
        },
        category: b,
        categoryDisplayName: c
    };
    a.dynamicEnvironment = {
        id: "Dynamic Environment",
        name: "Dynamic environment".localize(),
        v: 6,
        canResearch: function (a) {
            return 6 < LevelCalculator.getMissionLevel("Level Design")
        },
        category: b,
        categoryDisplayName: c
    };
    a.noLoadingScreens = {
        id: "No loading screens",
        name: "No loading screens".localize(),
        v: 8,
        canResearch: function (a) {
            return 7 < LevelCalculator.getMissionLevel("Level Design")
        },
        category: b,
        categoryDisplayName: c
    };
    a.levelDesignItems = [a.levelEditor, a.easterEggs, a.miniGames, a.dynamicEnvironment, a.noLoadingScreens];
    a.StartEngineParts = [a.textGraphics, a.TwoDGraphicsV1, a.simpleSounds];
    a.MediumSizeGames = {
        id: "MediumSizeGames",
        name: "Medium Games".localize(),
        pointsCost: 10,
        duration: 1E4,
        cost: 15E4,
        canResearch: function (a) {
            return 1 < a.staff.length
        },
        category: "Project Management",
        categoryDisplayName: "Project Management".localize()
    };
    a.LargeSizeGames = {
        id: "LargeGames",
        name: "Large Games".localize(),
        pointsCost: 40,
        duration: 15E3,
        cost: 3E5,
        canResearch: function (a) {
            return 14E4 < a.fans && 4 < a.staff.length
        },
        category: "Project Management",
        categoryDisplayName: "Project Management".localize()
    };
    b = "Game Design";
    c = "Game Design".localize();
    a.TargetAudience = {
        id: "TargetAudience",
        name: "Target Audience".localize(),
        pointsCost: 15,
        duration: 1E4,
        cost: 3E4,
        canResearch: function (a) {
            return -1 != a.scheduledStoriesShown.indexOf("TargetAudiences")
        },
        category: b,
        categoryDisplayName: c
    };
    a.Sequels = {
        id: "Sequels",
        name: "Sequels".localize(),
        pointsCost: 20,
        duration: 13E3,
        cost: 8E4,
        devCost: 2E4,
        canResearch: function (a) {
            return a.isLaterOrEqualThan(8, 6)
        },
        category: b,
        categoryDisplayName: c
    };
    a.CasualGames = {
        id: "CasualGames",
        name: "Casual games".localize(),
        category: b,
        categoryDisplayName: c,
        pointsCost: 20,
        duration: 1E4,
        cost: 25E3,
        canResearch: function (a) {
            return a.isLaterOrEqualThan(3, 10)
        }
    };
    a.Marketing = {
        id: "Marketing",
        name: "Marketing".localize(),
        category: "Publishing",
        categoryDisplayName: "Publishing".localize(),
        pointsCost: 40,
        duration: 1E4,
        cost: 5E4,
        canResearch: function (a) {
            return -1 !=
                a.scheduledStoriesShown.indexOf("MarketingStory")
        },
        complete: function () {
            Tutorial.marketingUnlocked()
        }
    };
    a.MultiGenre = {
        id: "MultiGenre",
        name: "Multi genre".localize(),
        category: b,
        categoryDisplayName: c,
        pointsCost: 80,
        duration: 1E4,
        cost: 35E3,
        canResearch: function (a) {
            return a.isLaterOrEqualThan(12, 8)
        }
    };
    a.expansionPack = {
        id: "expansionPack",
        name: "Expansion pack".localize(),
        category: b,
        categoryDisplayName: c,
        pointsCost: 150,
        duration: 1E4,
        cost: 1E5,
        canResearch: function (a) {
            return a.canDevelopMMOGames() && a.isMMOInSale()
        }
    };
    a.MultiPlatform = {
        id: "MultiPlatform",
        name: "Multi-Platform".localize(),
        category: "Technology",
        categoryDisplayName: "Technology".localize(),
        pointsCost: 100,
        duration: 15E3,
        cost: 5E5,
        canResearch: function (a) {
            return a.isLaterOrEqualThan(17, 2)
        }
    };
    a.SpecialItems = [a.TargetAudience, a.MediumSizeGames, a.LargeSizeGames, a.Sequels, a.CasualGames, a.Marketing, a.MultiGenre, a.expansionPack, a.MultiPlatform];
    b = "DRM";
    f = "drm";
    c = "DRM".localize();
    d = "Copy Protection V{0}".localize();
    a.DRMV1 = {
        id: "DRMV1",
        name: d.format(1),
        v: 2,
        canResearch: function (a) {
            return a.flags.pirateMode
        },
        category: b,
        categoryDisplayName: c,
        group: f,
        showXPGain: !0
    };
    a.DRMV2 = {
        id: "DRMV2",
        name: d.format(2),
        v: 4,
        canResearch: function (a) {
            return a.flags.pirateMode && 2 < LevelCalculator.getFeatureLevel(a, "DRMV1")
        },
        category: b,
        categoryDisplayName: c,
        group: f,
        showXPGain: !0
    };
    a.DRMV3 = {
        id: "DRMV3",
        name: d.format(3),
        v: 6,
        canResearch: function (a) {
            return a.flags.pirateMode && 2 < LevelCalculator.getFeatureLevel(a, "DRMV2")
        },
        category: b,
        categoryDisplayName: c,
        group: f,
        showXPGain: !0
    };
    a.DRMV4 = {
        id: "DRMV4",
        name: d.format(4),
        v: 8,
        canResearch: function (a) {
            return a.flags.pirateMode &&
                2 < LevelCalculator.getFeatureLevel(a, "DRMV3")
        },
        category: b,
        categoryDisplayName: c,
        group: f,
        showXPGain: !0
    };
    a.DRMV5 = {
        id: "DRMV5",
        name: d.format(5),
        v: 10,
        canResearch: function (a) {
            return a.flags.pirateMode && 2 < LevelCalculator.getFeatureLevel(a, "DRMV4")
        },
        category: b,
        categoryDisplayName: c,
        group: f,
        showXPGain: !0
    };
    a.DRMV6 = {
        id: "DRMV6",
        name: d.format(6),
        v: 12,
        canResearch: function (a) {
            return a.flags.pirateMode && 2 < LevelCalculator.getFeatureLevel(a, "DRMV5")
        },
        category: b,
        categoryDisplayName: c,
        group: f,
        showXPGain: !0
    };
    a.DRMItems = [a.DRMV1, a.DRMV2, a.DRMV3, a.DRMV4, a.DRMV5, a.DRMV6];
    a.getAllItems = function () {
        return a.BasicItems.concat(a.engineItems).concat(a.gameplayItems).concat(a.storyItems).concat(a.dialogItems).concat(a.levelDesignItems).concat(a.aiItems).concat(a.worldDesignItems).concat(a.graphicItems).concat(a.soundItems).concat(a.SpecialItems).concat(a.ProductPlacement1).concat(a.DRMItems)
    };
    a.getUsableFeatureList = function (a, b) {
        for (var c = [], d = 0; d < b.length; d++) {
            var f = b[d];
            (void 0 === f.canUse || f.canUse(a)) && c.push(f)
        }
        return c
    };
    a.ProductPlacement1 = {
        id: "ProductPlacement1",
        name: "Red Exploding Barrels".localize(),
        cost: 5E3,
        d: 0,
        t: 0,
        category: "Special Items",
        categoryDisplayName: "Special Items".localize()
    };
    a.OneTimeItems = [a.ProductPlacement1];
    Research.getPointsCost = function (a) {
        if (!a.v) return a.pointsCost;
        var b = [1, 2, 4, 6, 8, 10, 12, 14].indexOf(a.v);
        if (-1 == b) throw "invalid v";
        b = [10, 15, 40, 80, 100, 150, 250, 300][b];
        a.pointsCostAdjustment && (b += a.pointsCostAdjustment);
        return b
    };
    Research.getDuration = function (a) {
        if (!a.v) return a.duration;
        a = [1,
            2, 4, 6, 8, 10, 12, 14
        ].indexOf(a.v);
        if (-1 == a) throw "invalid v";
        return 1E3 * [8, 10, 12, 14, 16, 20, 25, 30][a]
    };
    Research.getDevCost = function (a, b) {
        if (!a.v) return a.cost;
        var c = [1, 2, 4, 6, 8, 10, 12, 14].indexOf(a.v);
        if (-1 == c) throw "invalid v";
        c = 1E3 * [5, 10, 30, 60, 100, 150, 300, 400][c];
        b && (c = c * General.getGameSizeDurationFactor(b.gameSize) * General.getMultiPlatformCostFactor(b), c = 1E3 * Math.floor(c / 1E3));
        return c
    };
    Research.getResearchCost = function (a) {
        return a.cost ? a.cost : 4 * Research.getDevCost(a)
    };
    Research.getEnginePoints = function (a) {
        if (a.enginePoints) return a.enginePoints;
        if (!a.v) return 0;
        a = [1, 2, 4, 6, 8, 10, 12, 14].indexOf(a.v);
        if (-1 == a) throw "invalid v";
        return [10, 15, 30, 40, 80, 120, 200, 300][a]
    };
    Research.getEngineCost = function (a) {
        if (0 === a.enginePoints) return 0;
        if (a.engineCost) return a.engineCost;
        if (!a.v) return 0;
        a = [1, 2, 4, 6, 8, 10, 12, 14].indexOf(a.v);
        if (-1 == a) throw "invalid v";
        return 1E3 * [10, 30, 50, 100, 140, 180, 350, 500][a]
    }
})();
