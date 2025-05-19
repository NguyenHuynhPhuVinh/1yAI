(function () {
    Media.TriggerNotifications = [{
        id: "mediumFansTargetReached",
        trigger: function (a) {
            return a.canDevelopMediumGames() && a.fans > Sales.MediumTargetFans
        },
        notification: new Notification("Goal reached".localize("heading"), "You now have more than {0} fans! With such a big fan base you should now be able to self-publish medium games.".localize().format(UI.getLongNumberString(Sales.MediumTargetFans)), {
            type: NotificationType.CompanyMilestones
        })
    }, {
        id: "largeFansTargetReached",
        trigger: function (a) {
            return a.canDevelopLargeGames() &&
                a.fans > Sales.LargeTargetFans
        },
        notification: new Notification("Goal reached".localize("heading"), "You now have more than {0} fans! With such a big fan base you should now be able to self-publish large games.".localize().format(UI.getLongNumberString(Sales.LargeTargetFans)), {
            type: NotificationType.CompanyMilestones
        })
    }, {
        id: "gameConvention",
        trigger: function (a) {
            return 1 < a.currentLevel && a.isLaterOrEqualThan(8, 2, 1)
        },
        getNotification: function (a) {
            return new Notification("Game Convention".localize(), "Dear {0},\nWe have followed your progress in recent years and would like to extend this formal invitation to participate in the biggest game convention on the planet 'Games, Games, Games' also known as G3.{n}By having your own company booth at G3 you can gain a lot of fans and hype for your games and we think our audience would love to see you there.\nWe will contact you yearly with booth options. Hope to see you at G3.\nThe G3 committee.".localize().format(a.name), {
                previewImage: "./images/notificationIcons/icon_notification_convention.png",
                type: NotificationType.CompanyMilestones
            })
        }
    }, {
        id: "level2Guide",
        notification: new Notification("Goal Hint".localize("heading"), "If you have more than 1M in cash you will be able to move to the next level. This might sound a lot but don't worry. Once you release a hit game you will get to this amount easily.".localize(), {
            type: NotificationType.AutoPopup
        }),
        trigger: function (a) {
            return 1 === a.currentLevel && 1E6 > a.cash && a.isLaterOrEqualThan(4,
                7, 2)
        }
    }, {
        id: "engineHint",
        trigger: function (a) {
            return a.isLaterOrEqualThan(3, 1, 2) && 0 === a.engines.length
        },
        notification: new Notification("Engine Reminder".localize("heading"), "Don't forget creating custom game engines. This will improve your games a lot! You can create your custom engine through the action menu once you have researched the Custom Engine.".localize(), {
            type: NotificationType.AutoPopup
        })
    }, {
        id: "thankYou",
        trigger: function (a) {
            return !PlatformShim.ISWIN8 && !GameManager.ghg2() && a.isLaterOrEqualThan(1,
                12, 3) && !DataStore.getValue("thankYouMessageShown")
        },
        getNotification: function (a) {
            DataStore.setValue("thankYouMessageShown", !0);
            return UI.getThanksForPurchasingNotification(a.staff[0].name)
        }
    }, {
        id: "publisherUnlock",
        trigger: function (a) {
            return a.canDevelopMediumGames()
        },
        getNotification: function (a) {
            a = "Hi {0},\nI have followed the progress of {1} for a while and it seems that with your recent expansion you have started developing larger games.\nLarger games deserve to be seen by more people and this is where a publisher can come in handy.{n}A publisher will market and publish your game around the world. They will also help fund development. In return they keep most of the profits but since the game will sell a lot more it is usually still worth it.{n}I can put you in touch with some publishers so you can look at some of the available contracts. Just let me know.\nJasmine Droke{n}Find Publishing Contract has been unlocked. It is accessible in the action menu.".localize().format(a.staff[0].name,
                a.name);
            a = new Notification({
                header: "Publishing Contracts".localize("heading"),
                text: a,
                type: NotificationType.CompanyMilestones
            });
            a.setFlag("publishersEnabled", !0);
            return a
        }
    }, {
        id: "multiplatformOptimizationUnlock",
        trigger: function (a) {
            return a.canDevelopMultiPlatform() && 1 < a.gameLog.count(function (b) {
                return 1 < b.platforms.length && (b.flags.postMortemCompleted || a.isLaterOrEqualThan(24, 2))
            })
        },
        getNotification: function (a) {
            a = "Looking at our past multi-platform games it becomes clear that we should be able to drastically reduce the cost of developing a single game for multiple platforms if we could better optimize our game engines for multi-platform development.".localize();
            a = new Notification({
                header: "New Insight".localize("heading"),
                text: a,
                weeksUntilFired: 2,
                type: NotificationType.CompanyMilestones
            });
            a.setFlag("multiPlatformOptimizeResearchAvailable", !0);
            return a
        }
    }]
})();