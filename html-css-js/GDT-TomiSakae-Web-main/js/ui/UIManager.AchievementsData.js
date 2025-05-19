var Achievements = {};
(function () {
    var a = Achievements,
        b = [];
    a.resetAchievements = function () {
        var c = a.hasAchieved(a.supporter);
        DataStore.getAchievements().achieved = [];
        c && a.activate(a.supporter);
        b = []
    };
    a.complete = function (b) {
        a.areAchievementsDisabled() || (DataStore.getAchievements().achieved.push({
            id: b.id,
            time: Date.now()
        }), b.completed && b.completed(), Steam && Steam.activateAchievement(b.id, function () {
            Achievements.achievedOnSteam(b.id)
        }), DataStore.saveSettings())
    };
    a.activate = function (c) {
        if (!a.areAchievementsDisabled() && -1 == b.indexOf(c.id)) {
            try {
                ghg4.ghg5("achievement activated", {
                    id: c.id
                })
            } catch (f) {
                Logger.LogInfo("tagEvent failed", f)
            }
            b.push(c.id)
        }
    };
    a.hasAchieved = function (a) {
        return void 0 != DataStore.getAchievements().achieved.first(function (b) {
            return b.id === a.id
        })
    };
    a.achievedOnSteam = function (a) {
        var b = DataStore.getAchievements().achieved.first(function (b) {
            return b.id == a
        });
        void 0 != b && (b.s = !0);
        DataStore.saveSettings()
    };
    a.areAchievementsDisabled = function () {
        return GameManager.flags.achievementsDisabled
    };
    a.checkForAchievmentsNotCompletedOnSteam = function (b) {
        if (!a.areAchievementsDisabled()) try {
            if (GameFlags.IS_STEAM &&
                Steam && Steam.isAvailable()) {
                var c = !DataStore.getValue("steamAchievementResent");
                c && DataStore.setValue("steamAchievementResent", !0);
                var f = a.getAllItems(),
                    l = DataStore.getAchievements().achieved.map(function (a) {
                        return a.id
                    });
                for (b = 0; b < f.length; b++) {
                    var g = f[b];
                    if (-1 != l.indexOf(g.id)) {
                        var n = DataStore.getAchievements().achieved.map(function (a) {
                            return a
                        })[l.indexOf(g.id)];
                        n.s && !c || Steam.activateAchievement(n.id, function () {
                            Achievements.achievedOnSteam(n.id)
                        })
                    }
                }
                return []
            }
        } catch (r) { }
    };
    a.checkForNew = function (c) {
        if (a.areAchievementsDisabled() ||
            !c) return [];
        for (var f = [], m = a.getAllItems(), l = DataStore.getAchievements().achieved.map(function (a) {
            return a.id
        }), g = 0; g < m.length; g++) {
            var n = m[g]; - 1 == l.indexOf(n.id) && (n.isAchieved && n.isAchieved(c) ? f.push(n) : -1 != b.indexOf(n.id) && f.push(n))
        }
        return f
    };
    a.getAllItems = function () {
        var b = [],
            c;
        for (c in a)
            if (a.hasOwnProperty(c)) {
                var f = a[c];
                void 0 != f.id && b.push(f)
            } return b
    };
    a.getWidthId = function (b) {
        return a.getAllItems().first(function (a) {
            return a.id === b
        })
    };
    var c = "#78BA00",
        f = 10;
    a.goodCombo = {
        id: "goodCombo",
        title: "Good Judgement".localize("achievement title"),
        description: "Create a game with a good topic/genre combination.".localize("achievement"),
        isAchieved: function (a) {
            return (a = a.gameLog.last()) ? 1 === GameGenre.getGenreWeighting(a.topic.genreWeightings, a.genre, a.secondGenre) : !1
        },
        tint: c,
        value: f
    };
    a.cult = {
        id: "cult",
        title: "Cult Status".localize("achievement title"),
        description: "Set a new standard for the early gaming industry.".localize("achievement"),
        isAchieved: function (a) {
            var b = a.gameLog.last();
            return b && 3 === a.topScoreAchievements && b.flags.topScore && b.isOnSale() ?
                !0 : !1
        },
        tint: c,
        value: f
    };
    a.engine100K = {
        id: "engine100K",
        title: "100K Engine".localize("achievement title"),
        description: "Invest over 100K in a new game engine.".localize("achievement"),
        isAchieved: function (a) {
            return a.engines.some(function (a) {
                return 1E5 < a.costs
            })
        },
        tint: c,
        value: f
    };
    a.engine500K = {
        id: "engine500K",
        title: "500K Engine".localize("achievement title"),
        description: "Invest over 500K in a new game engine.".localize("achievement"),
        isAchieved: function (a) {
            return a.engines.some(function (a) {
                return 5E5 < a.costs
            })
        },
        tint: c,
        value: f
    };
    a.engine1M = {
        id: "engine1M",
        title: "1M Engine".localize("achievement title"),
        description: "Invest over one million in a new game engine.".localize("achievement"),
        isAchieved: function (a) {
            return a.engines.some(function (a) {
                return 1E6 < a.costs
            })
        },
        tint: c,
        value: f
    };
    c = "#FDD017";
    f = 50;
    a.gold = {
        id: "gold",
        title: "Gold".localize("achievement title"),
        description: "Sell half a million copies of a game without the help of a publisher.".localize("achievement"),
        isAchieved: function (a) {
            return a.gameLog.some(function (a) {
                return !a.flags.royaltyRate &&
                    5E5 <= a.unitsSold
            }) ? !0 : !1
        },
        tint: c,
        value: f
    };
    a.platinum = {
        id: "platinum",
        title: "Platinum".localize("achievement title"),
        description: "Sell one million copies of a game without the help of a publisher.".localize("achievement"),
        isAchieved: function (a) {
            return a.gameLog.some(function (a) {
                return !a.flags.royaltyRate && 1E6 <= a.unitsSold
            }) ? !0 : !1
        },
        tint: "#E5E4E2",
        value: 80
    };
    a.diamond = {
        id: "diamond",
        title: "Diamond".localize("achievement title"),
        description: "Sell ten million copies of a game without the help of a publisher.".localize("achievement"),
        isAchieved: function (a) {
            return a.gameLog.some(function (a) {
                return !a.flags.royaltyRate && 1E7 <= a.unitsSold
            }) ? !0 : !1
        },
        tint: "white",
        value: 100
    };
    a.unobtainium = {
        id: "unobtainium",
        title: "Unobtainium (seriously?)".localize("achievement title, refers to unobtanium, mocks the name of the rare mineral in the movie Avatar"),
        description: "Sell one hundred million copies of a game without the help of a publisher.".localize("achievement"),
        isAchieved: function (a) {
            return a.gameLog.some(function (a) {
                return !a.flags.royaltyRate &&
                    1E8 <= a.unitsSold
            }) ? !0 : !1
        },
        tint: "#F4F4F4",
        value: 250,
        hidden: !0
    };
    a.professional = {
        id: "professional",
        title: "Professional".localize("achievement title"),
        description: "Reach level 5 with a character.".localize("achievement"),
        isAchieved: function (a) {
            return a.staff.some(function (a) {
                return 1 == a.qualityFactor
            })
        },
        tint: c,
        value: f
    };
    a.legend = {
        id: "legend",
        title: "Legend".localize("achievement title"),
        description: "Reach level 10 with a character.".localize("achievement"),
        isAchieved: function (a) {
            return a.staff.some(function (a) {
                return 2 ==
                    a.qualityFactor
            })
        },
        tint: c,
        value: 100
    };
    a.diversity = {
        id: "diversity",
        title: "Diversity".localize("achievement title"),
        description: "Have male and female staff.".localize("achievement"),
        isAchieved: function (a) {
            for (var b, c = 1; c < a.staff.length; c++) {
                var f = a.staff[c].sex;
                void 0 === b && (b = f);
                if (f != b) return !0
            }
            return !1
        },
        tint: c,
        value: f
    };
    a.hireSomeoneFamous = {
        id: "hireSomeoneFamous",
        title: "Famous".localize("achievement title"),
        description: "Hire someone famous.".localize("achievement"),
        tint: c,
        value: f
    };
    a.fullHouse = {
        id: "fullHouse",
        title: "Full House".localize("achievement title"),
        description: "Have the maximum number of employees.".localize("achievement"),
        isAchieved: function (a) {
            return 7 === a.staff.length
        },
        tint: c,
        value: f
    };
    a.finishedGame = {
        id: "finishedGame",
        title: "Game Dev Tycoon".localize(),
        description: "Finish Game Dev Tycoon.".localize("achievement"),
        tint: c,
        value: 200
    };
    a.piracyLevel2 = {
        id: "piracyLevel2",
        title: "Statistical Anomaly".localize(),
        description: "Reach level 2 in pirate mode.".localize("achievement"),
        tint: c,
        value: 100,
        isAchieved: function (a) {
            return a.flags.pirateMode &&
                2 == a.currentLevel
        }
    };
    c = "#4E0000";
    a.perfectGame = {
        id: "perfectGame",
        title: "Perfect Game".localize("achievement title"),
        description: "Release a game with a clean score of 10.".localize("achievement"),
        isAchieved: function (a) {
            return (a = a.gameLog.last()) && 10 === a.reviews.average(function (a) {
                return a.score
            }) && a.isOnSale() && !a.flags.pGAEarned ? a.flags.pGAEarned = !0 : !1
        },
        tint: c,
        value: 100,
        canEarnMultiple: !0
    };
    a.perfectGame11 = {
        id: "perfectGame11",
        title: "Turn it up to 11".localize("achievement title"),
        description: "Get a reviewer to give you a 11/10 rating.".localize("achievement"),
        isAchieved: function (a) {
            return (a = a.gameLog.last()) && 10 < a.reviews.average(function (a) {
                return a.score
            }) && (a.isOnSale() || a.soldOut) && !a.flags.pGAEarned ? a.flags.pGAEarned = !0 : !1
        },
        tint: c,
        value: 100,
        canEarnMultiple: !0
    };
    a.againstAllOdds = {
        id: "againstAllOdds",
        title: "Against all odds".localize("achievement title"),
        description: "Beat all odds and finish the game in pirate mode.".localize("achievement"),
        tint: c,
        value: 100,
        canEarnMultiple: !0
    };
    c = "#F4B300";
    f = 150;
    a.easterEggs = {
        id: "easterEggs",
        title: "Detective".localize("achievement title"),
        description: "Find at least one of the easter eggs in the game.".localize("achievement"),
        isAchieved: function (a) {
            return !1
        },
        tint: c,
        value: f
    };
    a.lvl1EasterEgg = {
        id: "lvl1EasterEgg",
        title: "Treasure Hunter".localize("achievement title"),
        description: "Activate the hidden treasure in the garage.".localize("achievement"),
        isAchieved: function (a) {
            return !1
        },
        tint: c,
        value: f,
        hidden: !0,
        completed: function () {
            a.activate(a.easterEggs)
        }
    };
    a.lvl2Poster1 = {
        id: "lvl2Poster1",
        title: "Bluehair reporting for space duty".localize("achievement refers to Wing Commander, leave 'Bluehair'"),
        description: "Little known fact: Cats go all aggro in space.".localize("achievement refers to Wing Commander"),
        isAchieved: function (a) {
            return 2 != a.currentLevel ? !1 : (a = a.gameLog.last()) && ("Wing Commander" === a.title || "wing commander" === a.title)
        },
        tint: c,
        value: f,
        hidden: !0,
        completed: function () {
            a.activate(a.easterEggs)
        }
    };
    a.lvl2Poster2 = {
        id: "lvl2Poster2",
        title: "Welcome to Mars".localize("achievement title, refers to Doom"),
        description: "How did I get here? Why is there a chainsaw? Who cares!".localize("achievement refers to Doom"),
        isAchieved: function (a) {
            return 2 != a.currentLevel ? !1 : (a = a.gameLog.last()) && ("doom" === a.title || "DOOM" === a.title || "Doom" === a.title)
        },
        tint: c,
        value: f,
        hidden: !0,
        completed: function () {
            a.activate(a.easterEggs)
        }
    };
    a.lvl3Poster1 = {
        id: "lvl3Poster1",
        title: "Best ride to work ever".localize("achievement title, referes to half life"),
        description: "Workplace safety anyone?".localize("achievement referes to half life"),
        isAchieved: function (a) {
            return 3 != a.currentLevel ? !1 : (a = a.gameLog.last()) ? (a = a.title.toLowerCase(), "half life" ===
                a || "half-life" === a) : !1
        },
        tint: c,
        value: f,
        hidden: !0,
        completed: function () {
            a.activate(a.easterEggs)
        }
    };
    a.lvl3Poster2 = {
        id: "lvl3Poster2",
        title: "Welcome to your hospital".localize("achievement title, refers to Theme Hospital"),
        description: "Patients are reminded not to die in the corridors.".localize("achievement refers to Theme Hospital, use official translation for this."),
        isAchieved: function (a) {
            return 3 != a.currentLevel ? !1 : (a = a.gameLog.last()) && "Theme Hospital" === a.title || "theme hospital" === a.title
        },
        tint: c,
        value: f,
        hidden: !0,
        completed: function () {
            a.activate(a.easterEggs)
        }
    };
    a.lvl4Poster1 = {
        id: "lvl4Poster1",
        title: "Welcome Chief".localize("achievement title, refers to Halo"),
        description: "This world is round but different.".localize("achievement refers to Halo"),
        isAchieved: function (a) {
            return 4 == a.currentLevel && a.flags.rndLabUnlocked ? (a = a.gameLog.last()) && 0 === a.title.toLowerCase().indexOf("halo") : !1
        },
        tint: c,
        value: f,
        hidden: !0,
        completed: function () {
            a.activate(a.easterEggs)
        }
    };
    a.lvl4Poster2 = {
        id: "lvl4Poster2",
        title: "The sky is not the limit.".localize("achievement title, refers to Star Citizen"),
        description: "Welcome back Chris. We've missed you.".localize("achievement refers to Chris Roberts"),
        isAchieved: function (a) {
            return 4 == a.currentLevel && a.flags.rndLabUnlocked ? (a = a.gameLog.last()) && "star citizen" === a.title.toLowerCase() : !1
        },
        tint: c,
        value: f,
        hidden: !0,
        completed: function () {
            a.activate(a.easterEggs)
        }
    };
    a.lvl4Poster3 = {
        id: "lvl4Poster3",
        title: "Painting with nature.".localize("achievement title, refers to Okami"),
        description: "Pay homage to a specific Japanese video game.".localize("achievement refers to Okami"),
        isAchieved: function (a) {
            return 4 == a.currentLevel && a.flags.rndLabUnlocked ? (a = a.gameLog.last()) && "okami" === a.title.toLowerCase() || "\u014ckami" === a.title || "\u5927\u795e" === a.title : !1
        },
        tint: c,
        value: f,
        hidden: !0,
        completed: function () {
            a.activate(a.easterEggs)
        }
    };
    a.inception = {
        id: "inception",
        title: "Inception".localize("achievement title"),
        description: "Develop the game within the game.".localize("achievement, inception"),
        isAchieved: function (a) {
            return (a = a.gameLog.last()) && a.isOnSale() && a.genre.id === GameGenre.Simulation.id &&
                "Game Dev" === a.topic.id && "Game Dev Tycoon" === a.title ? !0 : !1
        },
        tint: c,
        value: f
    };
    a.fanBoy = {
        id: "fanboy",
        title: "Fan".localize(),
        description: "Pick an inspired company name.".localize("achievement"),
        tint: c,
        value: 50
    };
    f = 70;
    c = "#00AAAA";
    a.versatile = {
        id: "versatile",
        title: "Versatile".localize("achievement title"),
        description: "Release a successful game in each of the five main genres.".localize("achievement"),
        isAchieved: function (a) {
            for (var b = GameGenre.getAll().slice(0, 5), c = 0; c < a.gameLog.length; c++) {
                if (0 == b.length) return !0;
                var f = a.gameLog[c];
                7 <= f.score && -1 != b.indexOf(f.genre) && b.remove(f.genre)
            }
            return !1
        },
        tint: c,
        value: f
    };
    a.cake = {
        id: "cake",
        title: "Eat Cake".localize("achievement title"),
        description: "Show them red barrels some action.".localize("achievement"),
        tint: c,
        value: 100
    };
    a.supporter = {
        id: "supporter",
        title: "Supporter".localize("achievement title"),
        description: "Support a young start-up. Buy the game.".localize("achievement"),
        tint: "green",
        value: 1E3,
        isAchieved: function () {
            return !GameManager.ghg2()
        }
    };
    a.supporter2 = {
        id: "supporter2",
        title: "Greenheart",
        description: "Support Greenheart Games by buying an optional supporter pack.".localize("achievement"),
        tint: "green",
        value: 1E3,
        hidden: !0,
        canEarnMultiple: !0
    };
    c = "#FF981D";
    f = 100;
    a.admirer = {
        id: "admirer",
        title: "Admirer".localize("achievement title"),
        description: "Fun fact: We almost named our company Megaflop Productions!".localize("achievement, leave 'Megaflop Productions'"),
        tint: "green",
        hidden: !0,
        value: f
    };
    a.writersBlock = {
        id: "writersBlock",
        title: "Writer's Block".localize("achievement title"),
        description: "Naming games is sometimes difficult.".localize("achievement"),
        isAchieved: function (a) {
            return !1
        },
        tint: c,
        value: 20,
        hidden: !0
    }
})();