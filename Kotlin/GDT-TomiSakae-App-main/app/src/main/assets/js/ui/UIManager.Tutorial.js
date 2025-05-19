var Tutorial = {};
(function () {
    var a = function (a) {
        return GameFlags.TUTORIAL_DISABLED ? !1 : SettingsGameplay.isTutorialOff() || !SettingsGameplay.alwaysShowTutorials() && -1 != DataStore.getTutorialSettings()["tutorials-shown"].indexOf(a) ? (b(a), !1) : -1 == GameManager.company.tutorialMessagesShown.indexOf(a)
    },
        b = function (a) {
            var b = DataStore.getTutorialSettings(); - 1 == GameManager.company.tutorialMessagesShown.indexOf(a) && GameManager.company.tutorialMessagesShown.push(a); - 1 == b["tutorials-shown"].indexOf(a) && (b["tutorials-shown"].push(a),
                DataStore.saveSettings())
        },
        c = function (c, d, f) {
            var k = c.id;
            c = c.msg;
            a(k) && (d || (d = 0), d = new Notification("Tutorial".localize(), c, "OK".localize(), d, {
                type: NotificationType.AutoPopup
            }), f && (d.image = f), GameManager.company.notifications.push(d), b(k))
        },
        f = WindowsIntegration.isTouchCapable ? "tap".localize("verb") : "click".localize("verb");
    Tutorial.getClickVerb = function () {
        return f
    };
    Tutorial.messages = {};
    var d = Tutorial.messages,
        k = function (a, b, c) {
            this.id = a;
            this.heading = b;
            this.msg = c
        };
    Tutorial.getAllShownMessages = function (a) {
        for (var b = [], c = 0; c < a.tutorialMessagesShown.length; c++) {
            var f = a.tutorialMessagesShown[c];
            d.hasOwnProperty(f) && b.push(d[f])
        }
        return b
    };
    d.createdCompany = new k("createdCompany", "Create a company".localize("heading"), "Congratulations!\nYou've just started your very own game development company!\nAt the moment your office is in a garage and you are the only employee but don't worry, many successful businesses have started out this way!{n}Let's start developing your first game.\nClose this message and then {0} anywhere on the screen to bring up the action menu.".localize("{0} click/touch verb").format(Tutorial.getClickVerb()));
    Tutorial.createdCompany = function () {
        c(d.createdCompany)
    };
    d.createGame = new k("createGame", "Create a game".localize("heading"), "Before development can begin you have to decide what kind of game you want to create and give your game a name.\nYou can also select which graphic technology your game should use.{n}Your options are initially limited but once you have a bit of experience you will be able to unlock new options.".localize());
    Tutorial.createGame = function () {
        c(d.createGame)
    };
    Tutorial.createSequel =
        function () { };
    d.gamePoints = new k("gamePoints", "Game points".localize("heading"), "Game development has now started.{n}While developing your game you will generate game points which you can see bubbling up.\nGame points are divided into design points and technology points. The more points you generate the better the game will be.{n}From time to time there will also be bug points generated. These points become less likely once you gain experience. Bugs should be fixed before the game is released and increase development time and cost.".localize());
    Tutorial.gamePoints = function () {
        c(d.gamePoints)
    };
    d.firstGameFinished = new k("firstGameFinished", "First game finished".localize("heading"), "After publishing a game you can invest a little bit of time to analyze your creation and generate a game report. Game reports are a great way to gain research points as well as valuable insights into what works and what doesn't work when developing a game.{n}To generate a game report close this message and then {0} anywhere on the screen to bring up the action menu.".localize("{0} click/touch verb").format(Tutorial.getClickVerb()));
    Tutorial.firstGameFinished = function (a) {
        c(d.firstGameFinished, a);
        GameManager.company.flags.pirateMode && c(d.pirateMode, a + 1)
    };
    var m = WindowsIntegration.isTouchCapable ? "swipe from the edge of the screen to bring up the app bar".localize("appbar fragment") : "right click to bring up the app bar".localize("appbar fragment"),
        l = WindowsIntegration.isTouchCapable ? "swipe from the right edge of the screen".localize("charmsbar fragment") : "bring your cursor to the top right corner of the screen and then move down.".localize("charmsbar fragment");
    d.appbarAndHelpWin8 = new k("appbarAndHelp", "Appbar and help menu".localize("heading"), "If you ever want to review the tutorial messages then you can do so in the Help menu. To access the Help menu and other features such as saving, loading and creating a game simply {0}.{n}You can also change game settings by using the Settings charm. To show the charms bar simply {1} You can then {2} on Settings.".localize("{0} is appbar fragment, {1} is charmsbar fragment, {2} is click/tap verb").format(m, l, Tutorial.getClickVerb()));
    d.mainMenu = new k("mainMenu", "Main Menu".localize("heading"), "If you ever want to review the tutorial messages then you can do so in the Help menu. To access the Help menu and other features such as saving, loading and creating a game simply press ESC to access the main menu.".localize());
    Tutorial.AppbarAndHelp = function () {
        PlatformShim.ISWIN8 ? c(d.appbarAndHelpWin8) : c(d.mainMenu)
    };
    d.contractsUnlocked = new k("contractsUnlocked", "Contracts unlocked".localize("heading"), "Contracts have now been unlocked.\nTo see available contracts close this message and then {0} anywhere on the screen to bring up the action menu.".localize("{0} click/touch verb").format(Tutorial.getClickVerb()));
    Tutorial.contractsUnlocked = function (a) {
        c(d.contractsUnlocked, a)
    };
    d.contracts = new k("contracts", "Contracts".localize(), "Contracts are a useful tool to earn some extra cash when your balance is low and can also be useful to generate a small number of research points.\nContracts require you to generate a certain amount of design and technology points before the time runs out.{n}Decide carefully what contract you accept. If you miss the deadline for a contract you will have to pay a penalty so it's better to start out with smaller contracts and see how much you can handle.".localize());
    Tutorial.contracts = function () {
        c(d.contracts)
    };
    d.gameReleased = new k("gameReleased", "Game released".localize("heading"), "Your game is now complete and will be handed off to publishing.\nWe should see reviews and sales coming in for the game soon!".localize());
    Tutorial.gameReleased = function () {
        c(d.gameReleased)
    };
    d.gameDevCompleted = new k("gameDevCompleted", "Game development completed".localize("heading"), "The development of your game has now finished. While developing games you gain experience and improve your skills.\nWhen development is completed you will be presented with a summary of the experience gained.".localize());
    Tutorial.gameDevCompleted = function (a) {
        c(d.gameDevCompleted, a)
    };
    d.firstSales = new k("firstSales", "First sales".localize("heading"), "Now that your game is on sale you will receive the income from the game every week.\nYou can see how well your game is doing by looking at the sales graph in the top right of the screen.".localize());
    Tutorial.firstSales = function () {
        c(d.firstSales, 0.1)
    };
    d.researchMenu = new k("researchMenu", "Research".localize("heading"), "Research is important to unlock new options and make better games.\nYou should try to save enough research points to be able to create your own game engine.\nThis will greatly improve your games.{n}Hint: Try to develop games with different topic and genre combinations for a slight research boost.".localize());
    Tutorial.researchMenu = function () {
        c(d.researchMenu)
    };
    d.devPhases = new k("devPhases", "Development phases".localize("heading"), "Game development runs through three stages. At the beginning of each stage you can decide what areas of the game you want to focus on.\nPicking the right focus for your game greatly increases the points you generate.{n}Think about what areas are important for your game and decrease the focus on areas you think are less important. If you want to read a brief description of the different areas please refer to the Help menu.".localize());
    Tutorial.devPhases = function (a) {
        c(d.devPhases, a)
    };
    d.researchedCustomEngine = new k("researchedCustomEngine", "Research custom engine".localize("heading"), "Now you can create your own game engines.\nTo get started close this message and {0} anywhere to bring up the action menu.".localize("{0} click/touch verb").format(Tutorial.getClickVerb()));
    Tutorial.researchedCustomEngine = function () {
        c(d.researchedCustomEngine)
    };
    d.researchedEnginePart = new k("researchedEnginePart", "Research engine part".localize("heading"),
        "You have just researched your first engine part.\nTo be able to use this in your games you need to create a new engine which includes this part.".localize());
    Tutorial.researchedEnginePart = function () {
        c(d.researchedEnginePart)
    };
    d.creatingEngine = new k("creatingEngine", "Creating engine".localize("heading"), "You are now creating your own custom game engine.\n\nOnce the engine is finished you will be able to use it when creating new games.".localize());
    Tutorial.creatingEngine = function () {
        c(d.creatingEngine,
            0.5)
    };
    d.targetAudience = new k("targetAudience", "Target audience".localize("heading"), "You can now specify what your main target audience is for your game. Games can be targeted at young people, at everyone or at more mature audiences.{n}Picking the right target audience for your game is important. Your target platform can also play a role. Some platforms are especially popular with a specific audience.".localize());
    Tutorial.targetAudience = function () {
        c(d.targetAudience)
    };
    d.marketingUnlocked = new k("marketingUnlocked",
        "Marketing Unlocked".localize("heading"), "You've successfully unlocked marketing. You can access marketing options in the action menu but only while a game is in development.".localize());
    Tutorial.marketingUnlocked = function () {
        c(d.marketingUnlocked)
    };
    d.marketing = new k("marketing", "Marketing".localize(), "Marketing can be very effective to reach more potential customers but it can be very expensive too. It is best to experiment carefully with marketing to get a feel for what works best. Don't invest too much and remember that timing is important. Don't invest in your marketing efforts too early in development or too late.{n}It is also important to know that no matter how much money you pump into marketing, it will not make a bad game successful. To the contrary, it can even hurt to market bad games too much as it can upset your existing fans.".localize());
    Tutorial.marketing = function (a) {
        c(d.marketing, a)
    };
    d.hypePoints = new k("hypePoints", "Hype points".localize("heading"), "Developing a great game is not the only recipe for success. It is essential to build hype to ensure that players are excited about your game.{n}In the beginning of your career, hype is mostly generated through random events but once you gain more experience you can use marketing and other strategies to generate hype.".localize());
    Tutorial.hypePoints = function () {
        c(d.hypePoints)
    };
    d.level2 =
        new k("level2", "Level 2".localize("heading"), "You now may also train yourself and your staff to improve skills.\nLet's try this by completing a management course which is required before you can hire your first employee.{n}To get started close this message and then {0} on your character to bring up the training menu.".localize("{0} click/touch verb").format(Tutorial.getClickVerb()));
    Tutorial.level2 = function () {
        c(d.level2, 0.3)
    };
    d.firstEngine = new k("firstEngine", "First engine".localize("heading"), "Congratulations! Your first custom game engine is now ready.\nYou should try using it in your next game.".localize());
    Tutorial.firstEngine = function () {
        c(d.firstEngine)
    };
    d.findStaff = new k("findStaff", "Finding staff".localize("heading"), "Before you can hire someone you have to advertise the open position, set an advertising budget and decide how you want to test your applicants.{n}A high budget will increase the number of applicants and the different tests will help find people with the right balance of design and technology skills.".localize());
    Tutorial.findStaff = function () {
        c(d.findStaff)
    };
    d.needsAHoliday = new k("needsAHoliday",
        "Staff vacation".localize("heading"), "From time to time your employees need to recharge their batteries and go on vacation. You can tell that an employee is in need of rest when their efficiency steadily decreases.{n}To give them a holiday just {0} on them and select Send on Vacation".localize("{0} click/touch verb").format(Tutorial.getClickVerb()));
    Tutorial.needsAHoliday = function () {
        c(d.needsAHoliday, 0.3)
    };
    d.hireStaff = new k("hireStaff", "Hiring staff".localize("heading"), "The search for the open position is complete!\nYou can now review the list of applicants and hire someone for this position.{n}Don't forget that you can always train your employees to improve their skills.".localize());
    Tutorial.hiringStaff = function (b) {
        a("hireStaff") && (c(d.hireStaff, b), Media.createLevel2OfficeStory())
    };
    d.staffHired = new k("staffHired", "Staff hired".localize("heading"), "Congratulations on your first hire!\nNew employees have to settle in before they become fully effective.\nWhen a character is not fully efficient you can see an efficiency bar next to them. This bar will fill up slowly over time.{n}It is usually a good idea to give your new staff a Welcome training to get them up to speed quickly.\nThis will maximize their efficiency way faster than normally.\nTo do this close this message and then {0} on the character to bring up the action menu.".localize("{0} click/touch verb").format(Tutorial.getClickVerb()));
    Tutorial.staffHired = function () {
        a("staffHired") && c(d.staffHired)
    };
    d.hireMoreStaff = new k("hireMoreStaff", "Hiring more staff".localize("heading"), "You can hire up to four employees in this office. Don't try to hire everyone at once as staff are expensive.\nMany rookies hire too early and go bankrupt.\nIt is best to take it slow.".localize());
    Tutorial.hireMoreStaff = function () {
        c(d.hireMoreStaff)
    };
    d.boosts = new k("boosts", "Boosts".localize("heading"), "Boosts are a powerful tool that allow you to temporarily increase the output of your staff.\nThey are most effective when timed strategically during the development of a game or during training.{n}Boosts need to recharge before you can use them. You can activate a boost as soon as the recharge progress is complete but you can also wait a little longer to further increase the effectiveness of the boost.".localize());
    Tutorial.boosts = function () {
        c(d.boosts, 0.3, "./images/misc/boost.png")
    };
    d.additionalFeatures = new k("additionalFeatures", "Additional game features".localize("heading"), "During development you can also select additional features for your game. Right now you can only pick 'Basic Sounds' but your options will increase quickly. Selecting additional features makes the game generally better but also increases its cost.{n}You will also see the graphic type you selected when you defined the game. This is just to remind you of your choice. You cannot change the type of graphics mid-game.".localize());
    Tutorial.additionalFeatures = function (a) {
        c(d.additionalFeatures, a)
    };
    d.finishingPhase = new k("finishingPhase", "Finishing phase".localize("heading"), "The development of your first game is now complete. You can press the 'Finish' button to publish your game but you should only do that once you fix the majority of bugs.{n}Releasing a game without fixing bugs can severely affect your ratings so you should only ever consider that if you need the cash and you can't afford to wait.".localize());
    Tutorial.finishingPhase =
        function (a) {
            c(d.finishingPhase, a)
        };
    d.training = new k("training", "Training".localize("heading"), "If you want to create hit-games and have a world class team then training is important.\n For best results train your staff regularly but don't overwhelm them with too many sessions at once.{n}There are different training options available.\nSome options are better to increase certain skills than others. Experimenting is the best way to figure out which training options fit your plans.\nIt is useful to have a mix of 'specialists' and allrounders in your team but aim to have at least one design specialist and technology specialist.".localize());
    Tutorial.training = function () {
        c(d.training)
    };
    d.staffReachedLvl5 = new k("staffReachedLvl5", "Level 5 unlocks".localize("heading"), "Someone on your team has reached experience level 5! This unlocks a special training item called Boost. The training for it is expensive and you can only do it once the character has at least 500 design or technology points but the investment is well worth it.{n}Once trained, the boost allows you to temporarily increase the output of your staff and can really help you to make a hit-game.".localize());
    Tutorial.staffReachedLvl5 = function () {
        c(d.staffReachedLvl5)
    };
    d.publishers = new k("publishers", "Publishers".localize("heading"), "Using a publisher is a great way to get your games in front of a large audience which in turns helps to grow your fan base.\nOnce your fan base is big enough you can self-publish your larger games without the need for a publisher.\nFor medium games you should aim to have at least 100K fans before you publish them yourself.{n}To use a publisher you need to sign a contract. The contract will dictate what game you need to create. Pay attention to all the details, most importantly the minimum score that the contract dictates. If the game you release does not meet the minimum score you will have to pay a penalty, which can be costly.{n}It is also important to pay attention to the royalty rate. The higher the rate the more money you will make from the contract.".localize());
    Tutorial.publishers = function () {
        c(d.publishers)
    };
    d.staffResponsibility = new k("staffResponsibility", "Staff responsibilities".localize("heading"), "Creating larger games is a significant task and, unlike in small games, one person cannot effectively be responsible for every aspect of a game.\nTo create a good game and to make best use of your team you will have to assign which of your team is responsible for which areas.{n}Pick team members whose skills match the area to get the best result.\nWhen you assign a team member responsibilities you will see their workload. Try not to overload them too much.".localize());
    Tutorial.staffResponsibility = function (a) {
        c(d.staffResponsibility, a)
    };
    d.designSpecialist = new k("designSpecialist", "Design specialist".localize("heading"), "You need a design specialist to open a research and development lab. You can train someone to become a specialist via the training menu but the option is only available once they have a certain design skill level.{n}You can also train technology specialists which come in handy for later options.".localize());
    Tutorial.designSpecialist = function (a) {
        c(d.designSpecialist,
            a)
    };
    d.rndLabReady = new k("rndLabReady", "R&D lab is ready".localize("heading"), "To visit the lab simply {0} the screen and drag to the left or use the arrow keys on the keyboard. Alternatively, you can also click on the little R&D Lab information card in the bottom right of the screen.".localize("{0} click/touch verb").format(Tutorial.getClickVerb()));
    Tutorial.rndLabReady = function () {
        c(d.rndLabReady)
    };
    d.rndLab = new k("rndLab", "R&D lab".localize(), "To start a project simply {0} the screen to bring up the research menu.\nOnce you start a project you can also cancel it using the same menu.".localize("{0} click/touch verb").format(Tutorial.getClickVerb()));
    Tutorial.rndLab = function (a) {
        c(d.rndLab, a)
    };
    d.hwLabReady = new k("hwLabReady", "Hardware lab is ready".localize("heading"), "To visit the hardware lab simply {0} the screen and drag to the right or use the arrow keys on the keyboard. Alternatively, you can also click on the little Hardware Lab information card in the top left of the screen.".localize("{0} click/touch verb").format(Tutorial.getClickVerb()));
    Tutorial.hwLabReady = function () {
        c(d.hwLabReady)
    };
    d.rndProjectStarted = new k("rndProjectStarted", "R&D project started".localize("heading"),
        "The project is now started and as your researchers work on it you will see the progress in the status card. Don't forget to adjust the budget! If the budget is 0 the project will never progress.".localize());
    Tutorial.rndProjectStarted = function () {
        c(d.rndProjectStarted)
    };
    d.consoleDev = new k("consoleDev", "Console Development".localize(), "Developing your own console is a very costly undertaking. Not only do you have to pay a big chunk of money up front for the project but you will also have to pay your hardware lab crew. Only attempt to create a console if you are confident that you have enough capital.{n}When developing a console you can decide on how your console will look like and decide on the technical features as well as the quality assurance budget. The more sophisticated your technology is the better the console will fare against competing products. The more budget you reserve for QA the better the quality of your console will be.".localize());
    Tutorial.devConsole = function () {
        c(d.consoleDev)
    };
    d.consoleReleased = new k("consoleReleased", "Console released".localize("heading"), "Your very own game console is now on the market. Game consoles are complex machines and when you sell a lot of them it is only natural that some of them need to be repaired.{n}While your console is on sale your hardware team will have to work off maintenance points. Depending on the quality of the console and how many you sell these points vary from week to week.{n}Try to give your hardware lab enough budget so that they stay on top of the maintenance, otherwise customers will become unhappy when they have to wait too long for their consoles to be repaired. You can see how well your team is doing in the console information card in the top left of the screen.".localize());
    Tutorial.consoleReleased = function (a) {
        c(d.consoleReleased, a)
    };
    d.mmoOnSale = new k("mmoOnSale", "MMO on sale".localize("heading"), "Your MMO is on sale now. MMOs work slightly different than normal games. MMOs not only generate income but also cause maintenance costs as we need to run game servers and provide customer services. You will see the amount of maintenance paid in the sales card.{n}Unlike other games which have a limited sales duration MMOs sell indefinitely. You will have to decide yourself when you want to take an MMO off the market. To take an MMO off the market simply {0} on the sales card to bring up a menu.{n}Since MMOs are so expensive to create you might want to try to expand your current MMO rather than create a new one. To do this you will need to create a expansion pack, which you can start to research now.".localize().format(Tutorial.getClickVerb()));
    Tutorial.mmoOnSale = function (a) {
        c(d.mmoOnSale, a)
    };
    d.additionalSpecialists = new k("additionalSpecialists", "Additional Specialists".localize("heading"), "While you only need one specialist to start running a lab you can train more than one. Additional specialists decrease the overall running cost of your lab.".localize());
    Tutorial.additionalSpecialists = function (a) {
        c(d.additionalSpecialists, a)
    };
    d.missionHints = new k("missionHints", "Hints".localize("heading"), "While generating game reports you start to gain insights into the development process and learn about what works well and what doesn't work so well.\nThese insights are shown as hints on the development screen (unless you have turned this option off in the settings).{n}The hints range from '+++' to '--' and indicate how important an area is for this type of game. When hints have a question mark at the end (e.g. '+++?') it means that you have insights from a game in the same genre but that you are not yet sure whether this holds true for this particular genre/topic combination.".localize());
    Tutorial.missionHints = function (a) {
        c(d.missionHints, a)
    };
    d.gameReportComplete = new k("gameReportComplete", "Game Reports".localize("heading"), "Game reports are a great way to gain more research points and new insights. It pays off to generate a report for each game you release.\nNow that you've completed your first game report it's a good idea to look at the research menu.\nTo open the research menu close this message and then {0} anywhere on the screen to bring up the action menu.".localize("{0} click/touch verb").format(Tutorial.getClickVerb()));
    Tutorial.gameReportComplete = function (a) {
        c(d.gameReportComplete, a)
    };
    d.pirateMode = new k("pirateMode", "Pirate Mode".localize(), "Your game sales are severely reduced in pirate mode and survival is unlikely. Once you are able to create your own engines you can counteract the effects of piracy by researching copy protection and integrating it in your games.{n}While copy protection decreases the effect of piracy on sales, it will also upset some of your fans. Making matters worse, copy protection is fast moving technology and if you don't stay up to date with new innovations, it will become less effective over time.{n}You can see the effects of piracy and the state of your copy protection through your game reports.".localize());
    Tutorial.pirateShareOffers = function (a) {
        c(d.pirateShareOffers, a)
    };
    d.pirateShareOffers = new k("pirateShareOffers", "Share Offers".localize("heading"), "To stay afloat in pirate mode you can sell part of your company to a third party to receive a much needed cash boost. Be mindful, however, that shareholders will automatically receive small dividend payments any time you make a profit from game sales.{n}These dividends grow larger the more shares you have sold and while they may seem insignificant, they can add up to a lot of lost profit over time.{n}You will be given the option to buy back shares regularly but share holders only offer buy-back options for a hefty profit.".localize())
})();