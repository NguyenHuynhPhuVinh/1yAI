var Training = {};
(function () {
    var a = Training;
    a.getAvailableTraining = function (b) {
        for (var f = [], d = a.getAllTrainings(), k = 0; k < d.length; k++) {
            var m = d[k];
            m.canSee && m.canSee(b, GameManager.company) || void 0 === m.canUse ? f.push(m) : !m.canSee && m.canUse(b, GameManager.company) && f.push(m)
        }
        return f
    };
    a.getAllTrainings = function () {
        var c = [];
        c.addRange(b());
        for (var f in a)
            if (a.hasOwnProperty(f)) {
                var d = a[f];
                void 0 != d.id && void 0 != d.pointsCost && void 0 != d.duration && (d.isTraining = !0, c.push(d))
            } return c
    };
    category = "Management";
    categoryDisplayName =
        "Management".localize();
    a.managementL1 = {
        id: "Management1",
        name: "Staff Management".localize(),
        cost: 25E3,
        pointsCost: 0,
        duration: 12E3,
        canUse: function (a, b) {
            return 0 == a.id && 2 <= b.currentLevel && 1 === b.maxStaff
        },
        complete: function (a) {
            a = "Well done!\nYou've successfully completed your management course and you are now able to hire your very first employee!\n To get started close this message and then {0} the 'Fill Position...' button which is visible near the big desk.".localize();
            a = a.format(Tutorial.getClickVerb());
            GameManager.company.maxStaff = 5;
            GameManager.company.notifications.push(new Notification("Training Complete".localize(), a, "OK".localize()));
            VisualsManager.refreshHiringButtons()
        },
        category: category,
        categoryDisplayName: categoryDisplayName
    };
    a.WelcomeTraining = {
        id: "WelcomeTraining",
        name: "Staff Welcome Training".localize(),
        pointsCost: 0,
        cost: 1E4,
        duration: 5E3,
        canUse: function (a, b) {
            return !a.flags.didWelcomeTraining && a.flags.hiredTimestamp && a.flags.hiredTimestamp > GameManager.gameTime - 3E4
        },
        tick: function (a, b) {
            a.adjustEfficiency(b /
                5E3 * 0.2)
        },
        complete: function (a) {
            a.flags.didWelcomeTraining = !0
        },
        category: "Special",
        categoryDisplayName: "Special".localize()
    };
    a.patchGame = {
        id: "PatchGame",
        name: "Develop patch".localize(),
        duration: 8E3,
        pointsCost: 0,
        isTraining: !0,
        canUse: function () {
            return !1
        },
        complete: function (a) {
            VisualsManager.getCharacterOverlay(a).saySomething("patch complete".localize(), 1500);
            a = GameManager.company;
            var b = a.flags.patchData.fansChange,
                d = a.flags.patchData.gameName,
                k = a.notifications.first(function (a) {
                    return a.flags && a.flags.isPatchNotification
                });
            k ? (k.text = "{0} has recently released a much needed patch for {1}.\nOne fan said: 'I love companies like {0}. They don't just milk their customers for more money but also understand our concerns and make sure that we can enjoy our games!'.".localize().format(a.name, d), k.adjustFans(b)) : (a.notifications.push(new Notification("News".localize(), "It seems that {0} has finally released their patch for {1}. One fan said: 'I can't believe it took them so long to release a patch! I surely hope that they are more efficient next time!'".localize().format(a.name,
                d), "OK".localize())), a.adjustFans(Math.floor(b / 2)))
        }
    };
    a.postMortem = {
        id: "postMortem",
        name: void 0,
        baseDuration: 7E3,
        duration: 7E3,
        pointsCost: 0,
        isTraining: !0,
        progressColor: "purple",
        canUse: function () {
            return !1
        },
        tick: function (b, f) {
            var d = b.currentResearch;
            if (void 0 === d.lastSpawnTick) d.lastSpawnTick = 0, d.targetRPoints = d.duration / a.postMortem.baseDuration * b.researchFactor * 10, d.targetRPoints += 0.25 * d.targetRPoints * GameManager.company.getRandom(), d.currentRPoints = 0, d.nextCheck = 200 + 250 * GameManager.company.getRandom();
            else {
                var k = d.duration * d.progress;
                if (k - d.lastSpawnTick >= d.nextCheck) {
                    d.lastSpawnTick = k;
                    var m = d.targetRPoints * d.progress;
                    if (Math.floor(m) > Math.floor(d.currentRPoints)) {
                        for (var m = Math.floor(m - d.currentRPoints), l = 0; l < m; l++) b.spawnPoints(1, "r", 50 * l);
                        d.currentRPoints += m
                    }
                    d.nextCheck = Math.min(d.duration - k - 50, 350 + 3E3 * GameManager.company.getRandom())
                }
            }
        },
        complete: function (a) {
            var b = a.flags.postMortemGameId,
                d = GameManager.company.getGameById(b);
            d && (d.flags.postMortemCompleted = !0, b = new Notification("{PostMortemComplete}",
                b), a.flags.postMortemGameId = null, GameManager.company.notifications.push(b), Tutorial.gameReportComplete(0.3))
        }
    };
    category = "Specialists";
    categoryDisplayName = "Specialists".localize();
    a.designSpecialist = {
        id: "designSpecialist",
        name: "Design Specialist (Req. 700 D)".localize(),
        category: category,
        categoryDisplayName: categoryDisplayName,
        cost: 5E6,
        pointsCost: 100,
        duration: 2E4,
        canSee: function (a, b) {
            return 4 == b.currentLevel && b.flags.dTSpecialistTrainingEnabled && !a.flags.designSpecialist && !a.flags.technologySpecialist
        },
        canUse: function (a, b) {
            return 700 <= a.getDesignSkillPoints()
        },
        complete: function (a) {
            a.flags.designSpecialist = !0;
            Tutorial.additionalSpecialists(10)
        },
        style: "trainingItemSmall"
    };
    a.techSpecialist = {
        id: "techSpecialist",
        name: "Technology Specialist (Req. 700 T)".localize(),
        category: category,
        categoryDisplayName: categoryDisplayName,
        cost: 5E6,
        pointsCost: 100,
        duration: 2E4,
        canSee: function (a, b) {
            return 4 == b.currentLevel && b.flags.dTSpecialistTrainingEnabled && !a.flags.designSpecialist && !a.flags.technologySpecialist
        },
        canUse: function (a,
            b) {
            return 700 <= a.getTechnologySkillPoints()
        },
        complete: function (a) {
            a.flags.technologySpecialist = !0
        },
        style: "trainingItemSmall"
    };
    a.boostL1 = {
        id: "BoostL1",
        name: "Boost (Req. D:500 or T:500)".localize(),
        cost: 1E6,
        pointsCost: 20,
        duration: 15E3,
        canSee: function (a) {
            return 0 == a.maxBoostLevel && 5 <= a.getLevel()
        },
        canUse: function (a, b) {
            return 500 <= a.getDesignSkillPoints() || 500 <= a.getTechnologySkillPoints()
        },
        complete: function (a) {
            a.maxBoostLevel = 2;
            a.boostLevel = 0;
            a.boostRechargeProgress = 0;
            UI._resetBoostUI();
            Tutorial.boosts()
        },
        category: "Special",
        categoryDisplayName: "Special".localize()
    };
    a.boostL2 = {
        id: "BoostL2",
        name: "Boost Max. Level 3 (Req. D:700 or T:700)".localize(),
        cost: 2E6,
        pointsCost: 50,
        duration: 15E3,
        canSee: function (a) {
            return 2 == a.maxBoostLevel && 6 <= a.getLevel()
        },
        canUse: function (a, b) {
            return 700 <= a.getDesignSkillPoints() || 700 <= a.getTechnologySkillPoints()
        },
        complete: function (a) {
            a.maxBoostLevel = 3
        },
        category: "Special",
        categoryDisplayName: "Special".localize(),
        style: "trainingItemSmall"
    };
    var b = function () {
        for (var a = [], b = Missions.getAllMissions().filter(function (a) {
            return "dev" ===
                a.missionType
        }), d = 0; d < b.length; d++) {
            var k = b[d],
                m = Math.round(900 * k.designFactor),
                l = Math.round(900 * k.technologyFactor);
            (function (b, d, f) {
                var k = {
                    id: "specialization_" + f.id,
                    category: "Specialization",
                    categoryDisplayName: "Specialization".localize(),
                    name: "{0} [Req. {1}D/{2}T]".localize().format(f.name, b, d),
                    cost: 5E6,
                    pointsCost: 200,
                    duration: 2E4,
                    canSee: function (a) {
                        return 7 <= a.getLevel() && !a.flags.expert
                    },
                    canUse: function (a) {
                        return 500 * a.technologyFactor > d && 500 * a.designFactor > b
                    },
                    complete: function (a) {
                        a.flags.expert =
                            f.id;
                        VisualsManager.getCharacterOverlay(a).refreshName()
                    },
                    isTraining: !0,
                    style: "trainingItemSmall"
                };
                a.push(k)
            })(m, l, k)
        }
        return a
    };
    a.codingContest = {
        id: "codingContest",
        name: "Coding contest".localize(),
        duration: 3E4,
        pointsCost: 0,
        basePoints: 12,
        isTraining: !0,
        isSkillTraining: !0,
        tF: 0.2,
        dF: 0.2,
        rF: 1,
        sF: 0.3,
        qF: 0,
        maxP: 900,
        canUse: function () {
            return !1
        },
        complete: function (a) {
            VisualsManager.getCharacterOverlay(a).saySomething("done".localize("word appears on top of staff when they finish a coding contest"), 1500);
            a.flags.codingContestDone =
                GameManager.gameTime;
            DecisionNotifications.codingContestParticipationFinished()
        },
        category: "Skills"
    };
    category = "Teach and learn";
    categoryDisplayName = "Teach and learn".localize();
    a.designTraining3 = {
        id: "designTraining3",
        name: "Game Design Course".localize(),
        cost: 14E4,
        pointsCost: 30,
        duration: 2E4,
        basePoints: 13,
        tF: 0.2,
        dF: 1,
        rF: 0.1,
        sF: 0,
        qF: 0,
        maxP: 900,
        canUse: function (a, b) {
            return b.flags.trainingV3Enabled
        },
        category: category,
        categoryDisplayName: categoryDisplayName,
        isSkillTraining: !0
    };
    a.techTraining3 = {
        id: "techTraining3",
        name: "Programming Course".localize(),
        cost: 14E4,
        pointsCost: 30,
        duration: 2E4,
        basePoints: 13,
        tF: 1,
        dF: 0.2,
        rF: 0.1,
        sF: 0,
        qF: 0,
        maxP: 900,
        canUse: function (a, b) {
            return b.flags.trainingV3Enabled
        },
        category: category,
        categoryDisplayName: categoryDisplayName,
        isSkillTraining: !0
    };
    a.speedTraining3 = {
        id: "speedTraining3",
        name: "Product Management Course".localize(),
        cost: 14E4,
        pointsCost: 30,
        duration: 2E4,
        basePoints: 13,
        tF: 0.1,
        dF: 0.1,
        rF: 0.2,
        sF: 1,
        qF: 0,
        maxP: 900,
        canUse: function (a, b) {
            return b.flags.trainingV3Enabled
        },
        category: category,
        categoryDisplayName: categoryDisplayName,
        isSkillTraining: !0
    };
    a.researchTraining3 = {
        id: "researchTraining3",
        name: "R&D Course".localize(),
        cost: 14E4,
        pointsCost: 30,
        duration: 2E4,
        basePoints: 13,
        tF: 0.1,
        dF: 0.1,
        rF: 1,
        sF: 0.1,
        qF: 0,
        maxP: 900,
        canUse: function (a, b) {
            return b.flags.trainingV3Enabled
        },
        category: category,
        categoryDisplayName: categoryDisplayName,
        isSkillTraining: !0
    };
    category = "Practice, Practice, Practice";
    categoryDisplayName = "Practice, Practice, Practice".localize();
    a.designTraining2 = {
        id: "designTraining2",
        name: "G3 Pixel Cup".localize(),
        cost: 7E4,
        pointsCost: 10,
        duration: 2E4,
        basePoints: 12,
        tF: 0.2,
        dF: 1,
        rF: 0.1,
        sF: 0,
        qF: 0,
        maxP: 700,
        canUse: function (a, b) {
            return b.flags.trainingV2Enabled
        },
        category: category,
        categoryDisplayName: categoryDisplayName,
        isSkillTraining: !0
    };
    a.techTraining2 = {
        id: "techTraining2",
        name: "G3 Code Jam".localize(),
        cost: 7E4,
        pointsCost: 10,
        duration: 2E4,
        basePoints: 12,
        tF: 1,
        dF: 0.2,
        rF: 0.1,
        sF: 0,
        qF: 0,
        maxP: 700,
        canUse: function (a, b) {
            return b.flags.trainingV2Enabled
        },
        category: category,
        categoryDisplayName: categoryDisplayName,
        isSkillTraining: !0
    };
    a.holisticTraining2 = {
        id: "holisticTraining2",
        name: "G3 Game Jam".localize(),
        cost: 7E4,
        pointsCost: 10,
        duration: 2E4,
        basePoints: 12,
        tF: 0.5,
        dF: 0.5,
        rF: 0.1,
        sF: 0,
        qF: 0,
        maxP: 700,
        canUse: function (a, b) {
            return b.flags.trainingV2Enabled
        },
        category: category,
        categoryDisplayName: categoryDisplayName,
        isSkillTraining: !0
    };
    a.speedTraining2 = {
        id: "speedTraining2",
        name: "G3 Time Trials".localize(),
        cost: 7E4,
        pointsCost: 10,
        duration: 2E4,
        basePoints: 12,
        tF: 0.1,
        dF: 0.1,
        rF: 0.2,
        sF: 1,
        qF: 0,
        maxP: 700,
        canUse: function (a, b) {
            return b.flags.trainingV2Enabled
        },
        category: category,
        categoryDisplayName: categoryDisplayName,
        isSkillTraining: !0
    };
    a.researchTraining2 = {
        id: "researchTraining2",
        name: "G3 Innovation Challenge".localize(),
        cost: 7E4,
        pointsCost: 10,
        duration: 2E4,
        basePoints: 12,
        tF: 0.1,
        dF: 0.1,
        rF: 1,
        sF: 0.1,
        qF: 0,
        maxP: 700,
        canUse: function (a, b) {
            return b.flags.trainingV2Enabled
        },
        category: category,
        categoryDisplayName: categoryDisplayName,
        isSkillTraining: !0
    };
    category = "Book studies";
    categoryDisplayName = "Book studies".localize();
    a.holisticTraining = {
        id: "holisticTraining",
        name: "Game dev gems".localize(),
        cost: 15E3,
        pointsCost: 5,
        duration: 2E4,
        basePoints: 8,
        tF: 0.5,
        dF: 0.5,
        rF: 0.1,
        sF: 0.1,
        qF: 0,
        maxP: 500,
        canUse: function (a, b) {
            return !0
        },
        category: category,
        categoryDisplayName: categoryDisplayName,
        isSkillTraining: !0
    };
    a.researchTraining = {
        id: "researchTraining",
        name: "Make me think!".localize(),
        cost: 15E3,
        pointsCost: 5,
        duration: 2E4,
        basePoints: 8,
        tF: 0.1,
        dF: 0.1,
        rF: 1,
        sF: 0.1,
        qF: 0,
        maxP: 500,
        canUse: function (a, b) {
            return !0
        },
        category: category,
        categoryDisplayName: categoryDisplayName,
        isSkillTraining: !0
    };
    a.designTraining = {
        id: "designTraining",
        name: "Game design for pirates".localize(),
        cost: 15E3,
        pointsCost: 5,
        duration: 2E4,
        basePoints: 8,
        tF: 0.2,
        dF: 1,
        rF: 0.1,
        sF: 0,
        qF: 0,
        maxP: 500,
        canUse: function (a, b) {
            return !0
        },
        category: category,
        categoryDisplayName: categoryDisplayName,
        isSkillTraining: !0
    };
    a.speedTraining = {
        id: "speedTraining",
        name: "Don't repeat yourself".localize(),
        cost: 15E3,
        pointsCost: 5,
        duration: 2E4,
        basePoints: 8,
        tF: 0.1,
        dF: 0.1,
        rF: 0.2,
        sF: 1,
        qF: 0,
        maxP: 500,
        canUse: function (a, b) {
            return !0
        },
        category: category,
        categoryDisplayName: categoryDisplayName,
        isSkillTraining: !0
    };
    a.techTraining = {
        id: "techTraining",
        name: "Code incomplete".localize(),
        cost: 15E3,
        pointsCost: 5,
        duration: 2E4,
        basePoints: 8,
        tF: 1,
        dF: 0.2,
        rF: 0.1,
        sF: 0,
        qF: 0,
        maxP: 500,
        canUse: function (a, b) {
            return !0
        },
        category: category,
        categoryDisplayName: categoryDisplayName,
        isSkillTraining: !0
    }
})();