var DESIGN_POINTS_COLOR = "orange",
    TECHNOLOGY_POINTS_COLOR = "#00BFFF",
    RESEARCH_POINTS_COLOR = "#006AFF",
    BUGS_COLOR = "#FF6A00",
    VisualsManager = {};
(function () {
    var visualsModule = VisualsManager, // a -> visualsModule
        canvasModule = CanvasManager; // b -> canvasModule
    visualsModule.Divisor = 1;
    visualsModule.globalOffsetX = 0;
    PlatformShim.ISLOWRES && (visualsModule.Divisor = 1.874084919472914);
    visualsModule.toScreenCoordinates = function (value, scale) { // b -> value, c -> scale
        var effectiveScale = isNaN(scale) ? 1 : scale; // d -> effectiveScale
        return Math.round(value / visualsModule.Divisor * effectiveScale)
    };
    var originalCreatejsTweenGet = createjs.Tween.get; // c -> originalCreatejsTweenGet
    createjs.Tween.get = function () {
        var tweenInstance = originalCreatejsTweenGet.apply(this, arguments); // a -> tweenInstance
        tweenInstance && (tweenInstance.gameId = GameManager.gameId);
        return tweenInstance
    };
    visualsModule.stopOldTweens = function () {
        for (var oldTweens = createjs.Tween._tweens.filter(function (tween) { // a -> tween, then oldTweens
            return tween.gameId && tween.gameId != GameManager.gameId
        }).slice(), i = 0; i < oldTweens.length; i++) oldTweens[i].setPaused(!0) // b -> i
    };
    visualsModule.gameStatusBar = void 0;
    visualsModule.researchPoints = void 0;
    visualsModule.reset = function () {
        Sound.pauseAllLoopingFx();
        this.stopOldTweens();
        if (GameManager.company.hwCrew)
            for (var staffIndex = 0; staffIndex < GameManager.company.hwCrew.length; staffIndex++) GameManager.company.hwCrew[staffIndex].load(); // c -> staffIndex
        if (GameManager.company.rndCrew)
            for (var staffIndex = 0; staffIndex < GameManager.company.rndCrew.length; staffIndex++) GameManager.company.rndCrew[staffIndex].load(); // c -> staffIndex
        visualsModule.computerImages = [void 0, void 0, void 0, void 0, void 0];
        visualsModule.loadStage(!0);
        visualsModule.gameStatusBar || (visualsModule.gameStatusBar = new GameStatusBar, canvasModule.foregroundStage.addChild(visualsModule.gameStatusBar));
        visualsModule.gameStatusBar.x = canvasModule.foregroundStage.canvas.width / 2 - visualsModule.gameStatusBar.width / 2;
        visualsModule.gameStatusBar.y = 15;
        visualsModule.gameStatusBar.reset();
        visualsModule.researchPoints || (visualsModule.researchPoints = new PointsDisplayVisual(RESEARCH_POINTS_COLOR, "white", "Research".localize()), canvasModule.foregroundStage.addChild(visualsModule.researchPoints));
        visualsModule.researchPoints.y = 15;
        visualsModule.researchPoints.size = 100;
        visualsModule.researchPoints.x = visualsModule.gameStatusBar.x + visualsModule.gameStatusBar.width + 70;
        visualsModule.resetAllCharacters();
        visualsModule.refreshLabCrew();
        visualsModule.updatePoints();
        visualsModule.gameStatusBar.updateGameName();
        UI.clearSalesCards();
        UI.clearMaintenanceCards();
        GameManager.company.licencedPlatforms.forEach(function (platform) { // a -> platform
            !0 === platform.isCustom && (0 < platform.nextSalesCash || 0 === platform.currentSalesCash) && (UI.addSalesCard(platform.id, platform.name, platform.currentSalesCash, platform.unitsSold, platform.currentUnitsSold, -1, platform.salesCashLog, platform.nextSalesCash, Sales.consoleUnitPrice), 0 < platform.currentSalesCash && UI.updateMaintenanceCard(platform))
        });
        GameManager.company.gameLog.forEach(function (game) { // a -> game
            game.currentSalesCash < game.totalSalesCash && UI.addSalesCard(game.id, game.title, game.currentSalesCash, game.totalSalesCash, game.unitsSold, game.currentSalesRank,
                game.salesCashLog, game.nextSalesCash, game.unitPrice, game.nextMaintenance, game.maintenanceLog)
        });
        CanvasManager.update(!0, !0);
        visualsModule.updateReleaseReadyButton();
        UI.reset()
    };
    visualsModule.resetAllCharacters = function () {
        for (var characterChildren = canvasModule.characterStage.children.slice(), i = 0; i < characterChildren.length; i++) canvasModule.characterStage.children.remove(characterChildren[i]); // c -> characterChildren, d -> i
        visualsModule.characterOverlays = [];
        visualsModule.reloadAllCharacters();
        visualsModule.refreshTrainingOverlays();
        visualsModule.refreshHiringButtons()
    };
    visualsModule.removeStaff = function (characterToRemove) { // c -> characterToRemove
        var characterOverlay = visualsModule.characterOverlays.first(function (overlay) { // a -> overlay, d -> characterOverlay
            return overlay.character === characterToRemove
        });
        visualsModule.characterOverlays.remove(characterOverlay);
        canvasModule.characterStage.removeChild(characterOverlay);
        visualsModule.removeComputer(characterToRemove);
        visualsModule.refreshTrainingOverlays();
        visualsModule.refreshHiringButtons();
        UI._resetBoostUI()
    };
    visualsModule.backgroundImage = void 0;
    visualsModule.computerImages = [void 0, void 0, void 0, void 0, void 0];
    visualsModule.nextLevel = function () {
        var currentLevel = GameManager.company.currentLevel; // b -> currentLevel
        GameManager.pause(!0);
        var resourcesToUnload = ResourceKeys.getLevelResources.apply(ResourceKeys, [1, 2, 3, 4].except([currentLevel])); // c -> resourcesToUnload
        GameDev.ResourceManager.removeResources(resourcesToUnload);
        UI.fadeInTransitionOverlay();
        var startTime = Date.now(), // d -> startTime
            loadNewLevelAssets = function () { // f -> loadNewLevelAssets
                visualsModule.loadStage(!0);
                for (var overlayIndex = 0; overlayIndex < visualsModule.characterOverlays.length; overlayIndex++) { // b -> overlayIndex
                    var characterOverlay =
                        visualsModule.characterOverlays[overlayIndex]; // c -> characterOverlay
                    characterOverlay.character.visualData = characterOverlay.saveState();
                    characterOverlay.parent.removeChild(characterOverlay)
                }
                visualsModule.characterOverlays = [];
                visualsModule.reloadAllCharacters();
                visualsModule.refreshTrainingOverlays();
                visualsModule.refreshHiringButtons();
                if (0 < GameManager.currentResearches.length)
                    for (overlayIndex = 0; overlayIndex < GameManager.company.staff.length; overlayIndex++) GameManager.company.staff[overlayIndex].state === CharacterState.Researching && VisualsManager.getCharacterOverlay(GameManager.company.staff[overlayIndex]).startResearching();
                UI._resetBoostUI();
                CanvasManager.update();
                UI.fadeOutTransitionOverlay();
                GameManager.resume(!0)
            };
        FlippingCounter.init();
        GameDev.ResourceManager.ensureResources(ResourceKeys.getLevelResources(currentLevel), function () {
            var elapsedTime = Date.now() - startTime; // a -> elapsedTime
            2E3 > elapsedTime ? setTimeout(function () {
                loadNewLevelAssets()
            }, 2E3 - elapsedTime) : loadNewLevelAssets()
        })
    };
    visualsModule.addComputer = function (staffMember) { // b -> staffMember
        if (0 < staffMember.slot) {
            var slotIndex = staffMember.slot; // b -> slotIndex
            var computerImageResource = void 0, // c -> computerImageResource
                addChildIndex = 1, // d -> addChildIndex
                currentLevel = GameManager.company.currentLevel, // f -> currentLevel
                coordX = 0, // k -> coordX
                coordY = 0, // m -> coordY
                globalCanvasScale = CanvasManager.globalScale; // u -> globalCanvasScale
            2 === currentLevel ? 1 === slotIndex ? (computerImageResource = GameDev.ResourceManager.resources[ResourceKeys.Level2C1], coordX = 1005, coordY = 707, addChildIndex = 4) : 2 === slotIndex ? (computerImageResource = GameDev.ResourceManager.resources[ResourceKeys.Level2C2], coordX = 880, coordY = 698) : 3 === slotIndex ? (computerImageResource = GameDev.ResourceManager.resources[ResourceKeys.Level2C3],
                coordX = 1164, coordY = 576) : 4 === slotIndex && (computerImageResource = GameDev.ResourceManager.resources[ResourceKeys.Level2C4], coordX = 1114, coordY = 511) : 3 === currentLevel ? 1 === slotIndex ? (computerImageResource = GameDev.ResourceManager.resources[ResourceKeys.Level3C1], coordX = 1005, coordY = 723, addChildIndex = 4) : 2 === slotIndex ? (computerImageResource = GameDev.ResourceManager.resources[ResourceKeys.Level3C2], coordX = 878, coordY = 703) : 3 === slotIndex ? (computerImageResource = GameDev.ResourceManager.resources[ResourceKeys.Level3C3], coordX = 1159, coordY = 593) : 4 === slotIndex && (computerImageResource = GameDev.ResourceManager.resources[ResourceKeys.Level3C4], coordX = 1109, coordY = 511) : 4 === currentLevel && (1 === slotIndex ? (computerImageResource = GameDev.ResourceManager.resources[ResourceKeys.Level4C1], coordX =
                    463, coordY = 978, addChildIndex = 4) : 2 === slotIndex ? (computerImageResource = GameDev.ResourceManager.resources[ResourceKeys.Level4C2], coordX = 428, coordY = 756) : 3 === slotIndex ? (computerImageResource = GameDev.ResourceManager.resources[ResourceKeys.Level4C1], coordX = 745, coordY = 812) : 4 === slotIndex ? (computerImageResource = GameDev.ResourceManager.resources[ResourceKeys.Level4C2], coordX = 711, coordY = 591) : 5 === slotIndex ? (computerImageResource = GameDev.ResourceManager.resources[ResourceKeys.Level4C1], coordX = 1014, coordY = 649) : 6 === slotIndex && (computerImageResource = GameDev.ResourceManager.resources[ResourceKeys.Level4C2], coordX = 981, coordY = 426));
            coordX = visualsModule.toScreenCoordinates(coordX, globalCanvasScale);
            coordY = visualsModule.toScreenCoordinates(coordY, globalCanvasScale);
            if (computerImageResource) {
                var backgroundStage = CanvasManager.backgroundStage, // f -> backgroundStage
                    stageWidth = backgroundStage.canvas.width, // t -> stageWidth
                    stageHeight = backgroundStage.canvas.height, // q -> stageHeight
                    targetAspectRatio = 1366 / 768, // v -> targetAspectRatio
                    offsetX = 0; // A -> offsetX
                0.1 < Math.abs(stageWidth / stageHeight - targetAspectRatio) && (targetAspectRatio *= stageHeight, offsetX = -(targetAspectRatio - stageWidth) / 2, stageWidth = targetAspectRatio);
                visualsModule.currentXOffset = offsetX;
                var tempCanvas = document.createElement("canvas"); // v -> tempCanvas
                tempCanvas.width = stageWidth;
                tempCanvas.height = stageHeight;
                tempCanvas.getContext("2d").drawImage(computerImageResource, 0, 0, computerImageResource.width, computerImageResource.height, offsetX + coordX, coordY, Math.floor(computerImageResource.width * globalCanvasScale), Math.floor(computerImageResource.height * globalCanvasScale));
                computerImageResource = new createjs.Bitmap(tempCanvas);
                computerImageResource.width = stageWidth;
                computerImageResource.height = stageHeight;
                visualsModule.computerImages[slotIndex] = computerImageResource;
                backgroundStage.children.length >= addChildIndex - 1 ? backgroundStage.addChildAt(computerImageResource, addChildIndex) : backgroundStage.addChild(computerImageResource);
                CanvasManager.invalidateBackground()
            }
        }
    };
    visualsModule.removeComputer = function (staffMember) { // b -> staffMember
        var backgroundStage = CanvasManager.backgroundStage; // c -> backgroundStage
        visualsModule.computerImages[staffMember.slot] &&
            (backgroundStage.removeChild(visualsModule.computerImages[staffMember.slot]), visualsModule.computerImages[staffMember.slot] = void 0, CanvasManager.invalidateBackground())
    };
    visualsModule.getLabSign = function (labelText, maxWidth, maxHeight, posX, posY) { // a -> labelText, b -> maxWidth, c -> maxHeight, d -> posX, f -> posY
        var signContainer = new createjs.Container; // k -> signContainer
        signContainer.x = posX;
        signContainer.y = posY;
        posX = UI.IS_SEGOE_UI_INSTALLED ? "Segoe UI" : "Open Sans";
        posY = 32;
        do {
            var textObj = "bold {0}pt {1}".format(posY, posX), // m -> textObj
                textObj = new createjs.Text(labelText, textObj, "black");
            posY -= 1
        } while ((textObj.getMeasuredWidth() > maxWidth || textObj.getMeasuredLineHeight() > maxHeight) && 1 < posY);
        maxWidth = posY / 32;
        maxHeight = createjs.Graphics.getHSL(0, 0, 24);
        textObj = new createjs.Text(labelText, "bold 32pt {0}".format(posX), maxHeight);
        textObj.textAlign = "center";
        textObj.textBaseline =
            "middle";
        signContainer.scaleX = maxWidth;
        signContainer.scaleY = maxWidth;
        signContainer.addChild(textObj);
        return signContainer
    };
    visualsModule.loadStage = function (forceReload) { // b -> forceReload
        var companyData = GameManager.company, // c -> companyData
            backgroundStage = CanvasManager.backgroundStage, // f -> backgroundStage
            backgroundOverlayStage = CanvasManager.backgroundOverlayStage, // m -> backgroundOverlayStage
            globalScale = CanvasManager.globalScale, // p -> globalScale
            canvasWidth = backgroundStage.canvas.width, // s -> canvasWidth
            canvasHeight = backgroundStage.canvas.height, // u -> canvasHeight
            targetAspectRatio = 1366 / 768, // t -> targetAspectRatio
            currentOffsetX = 0; // q -> currentOffsetX
        0.1 < Math.abs(canvasWidth / canvasHeight - targetAspectRatio) && (targetAspectRatio *= canvasHeight, currentOffsetX = -(targetAspectRatio - canvasWidth) / 2, canvasWidth = targetAspectRatio);
        var currentLevel = companyData.currentLevel, // v -> currentLevel
            level4LockedLeftImage, // A -> level4LockedLeftImage
            level4YCoord = visualsModule.toScreenCoordinates(39), // z -> level4YCoord
            level4LockedRightImage, // B -> level4LockedRightImage
            level4XCoord = visualsModule.toScreenCoordinates(47), // t -> level4XCoord (reused, but context is different)
            levelImageResource = GameDev.ResourceManager.resources[ResourceKeys.Level1], // D -> levelImageResource
            levelImageX =
                visualsModule.toScreenCoordinates(563), // E -> levelImageX
            levelImageY = visualsModule.toScreenCoordinates(217); // w -> levelImageY
        2 === currentLevel ? (levelImageResource = GameDev.ResourceManager.resources[ResourceKeys.Level2], levelImageX = visualsModule.toScreenCoordinates(83), levelImageY = visualsModule.toScreenCoordinates(54)) : 3 === currentLevel ? (levelImageResource = GameDev.ResourceManager.resources[ResourceKeys.Level3], levelImageX = visualsModule.toScreenCoordinates(83), levelImageY = visualsModule.toScreenCoordinates(54)) : 4 === currentLevel && (levelImageResource = GameDev.ResourceManager.resources[ResourceKeys.Level4], levelImageX = visualsModule.toScreenCoordinates(367), levelImageY = visualsModule.toScreenCoordinates(39), GameManager.company.flags.rndLabUnlocked || (level4LockedRightImage = GameDev.ResourceManager.resources[ResourceKeys.Level4LockedRight]),
            GameManager.company.flags.hwLabUnlocked || (level4LockedLeftImage = GameDev.ResourceManager.resources[ResourceKeys.Level4LockedLeft]));
        if (!visualsModule.backgroundImage || visualsModule.backgroundImage.width != canvasWidth || visualsModule.backgroundImage.height != canvasHeight || visualsModule.currentXOffset != currentOffsetX || forceReload) {
            backgroundStage.removeAllChildren();
            backgroundOverlayStage.removeAllChildren();
            companyNameVisual = void 0; // k -> companyNameVisual (reassigned later)
            visualsModule.currentXOffset = currentOffsetX;
            var tempCanvas = document.createElement("canvas"); // b -> tempCanvas (reused)
            tempCanvas.width = canvasWidth;
            tempCanvas.height = canvasHeight;
            var tempContext = tempCanvas.getContext("2d"); // F -> tempContext
            4 === currentLevel ? tempContext.drawImage(levelImageResource, visualsModule.toScreenCoordinates(2193), 0, visualsModule.toScreenCoordinates(2560), visualsModule.toScreenCoordinates(1384),
                0, Math.floor(levelImageY * globalScale), Math.floor(visualsModule.toScreenCoordinates(2560) * globalScale), Math.floor(visualsModule.toScreenCoordinates(1384) * globalScale)) : tempContext.drawImage(levelImageResource, 0, 0, levelImageResource.width, levelImageResource.height, Math.floor(levelImageX * globalScale), Math.floor(levelImageY * globalScale), Math.floor(levelImageResource.width * globalScale), Math.floor(levelImageResource.height * globalScale));
            level4LockedLeftImage && (tempContext.clearRect(currentOffsetX, level4YCoord * globalScale, (level4LockedLeftImage.width - 5) * globalScale, level4LockedLeftImage.height * globalScale), tempContext.drawImage(level4LockedLeftImage, 0, 0, level4LockedLeftImage.width, level4LockedLeftImage.height, currentOffsetX, level4YCoord * globalScale, (level4LockedLeftImage.width - 4) * globalScale, level4LockedLeftImage.height * globalScale));
            level4LockedRightImage && (tempContext.clearRect(Math.floor((visualsModule.toScreenCoordinates(2590) - level4LockedRightImage.width) * globalScale), Math.floor((level4XCoord - 1) * globalScale), Math.floor(level4LockedRightImage.width * globalScale), Math.floor(level4LockedRightImage.height * globalScale)), tempContext.drawImage(level4LockedRightImage, 0, 0, level4LockedRightImage.width, level4LockedRightImage.height,
                Math.floor((visualsModule.toScreenCoordinates(2588) - level4LockedRightImage.width) * globalScale), Math.floor(level4XCoord * globalScale), Math.floor(level4LockedRightImage.width * globalScale), Math.floor(level4LockedRightImage.height * globalScale)));
            currentOffsetX = new createjs.Bitmap(tempCanvas); // q -> currentOffsetX (reassigned)
            currentOffsetX.width = canvasWidth;
            currentOffsetX.height = canvasHeight;
            visualsModule.backgroundImage = currentOffsetX;
            backgroundStage.addChildAt(currentOffsetX, 0);
            visualsModule.updateComputers();
            CanvasManager.leftScreen.backgroundStage.removeAllChildren();
            CanvasManager.leftScreen.backgroundOverlayStage.removeAllChildren();
            CanvasManager.leftScreen.invalidateBackground();
            CanvasManager.rightScreen.backgroundStage.removeAllChildren();
            CanvasManager.rightScreen.backgroundOverlayStage.removeAllChildren();
            CanvasManager.rightScreen.invalidateBackground();
            visualsModule.levelOverlay = new LevelOverlay(companyData);
            if (4 === currentLevel) {
                companyData = document.createElement("canvas"); // c -> companyData (reused)
                companyData.width = canvasWidth;
                companyData.height = canvasHeight;
                var leftScreenContext = companyData.getContext("2d"), // f -> leftScreenContext (reused)
                    hwLabSign; // C -> hwLabSign
                level4LockedLeftImage || (leftScreenContext.drawImage(levelImageResource, 0, 0, 2560 / visualsModule.Divisor - levelImageX, 1384 / visualsModule.Divisor, levelImageX * globalScale, levelImageY * globalScale, (2560 / visualsModule.Divisor - levelImageX) * globalScale, 1384 / visualsModule.Divisor * globalScale), hwLabSign = visualsModule.getLabSign("Hardware lab".localize(), visualsModule.toScreenCoordinates(264, globalScale), visualsModule.toScreenCoordinates(54, globalScale), visualsModule.toScreenCoordinates(1878, globalScale), visualsModule.toScreenCoordinates(145, globalScale)));
                level4LockedLeftImage = new createjs.Bitmap(companyData); // A -> level4LockedLeftImage (reassigned)
                level4LockedLeftImage.width = canvasWidth;
                level4LockedLeftImage.heigth = canvasHeight;
                CanvasManager.leftScreen.backgroundStage.addChildAt(level4LockedLeftImage,
                    0);
                CanvasManager.leftScreen.backgroundOverlayStage.addChild(visualsModule.levelOverlay.leftOverlay);
                hwLabSign && CanvasManager.leftScreen.backgroundOverlayStage.addChild(hwLabSign);
                hwLabSign = document.createElement("canvas"); // C -> hwLabSign (reassigned)
                hwLabSign.width = canvasWidth;
                hwLabSign.height = canvasHeight;
                level4LockedLeftImage = hwLabSign.getContext("2d"); // A -> level4LockedLeftImage (reassigned)
                var rndLabSign; // J -> rndLabSign
                level4LockedRightImage ? level4LockedLeftImage.drawImage(level4LockedRightImage, visualsModule.toScreenCoordinates(596), 0, visualsModule.toScreenCoordinates(29), level4LockedRightImage.height, 0, level4XCoord * globalScale, visualsModule.toScreenCoordinates(29, globalScale), level4LockedRightImage.height * globalScale) : (level4LockedLeftImage.drawImage(levelImageResource, visualsModule.toScreenCoordinates(2560, 2) - levelImageX, 0, levelImageResource.width - (visualsModule.toScreenCoordinates(2560, 2) - levelImageX), levelImageResource.height, 0, levelImageY * globalScale, (levelImageResource.width - (2560 / visualsModule.Divisor * 2 - levelImageX)) * globalScale, levelImageResource.height *
                    globalScale), rndLabSign = visualsModule.getLabSign("R&D lab".localize(), visualsModule.toScreenCoordinates(264, globalScale), visualsModule.toScreenCoordinates(54, globalScale), visualsModule.toScreenCoordinates(690, globalScale), visualsModule.toScreenCoordinates(138, globalScale)));
                globalScale = new createjs.Bitmap(hwLabSign); // p -> globalScale (reassigned)
                globalScale.width = canvasWidth;
                globalScale.heigth = canvasHeight;
                CanvasManager.rightScreen.backgroundStage.addChildAt(globalScale, 0);
                CanvasManager.rightScreen.backgroundOverlayStage.addChild(visualsModule.levelOverlay.rightOverlay);
                rndLabSign && CanvasManager.rightScreen.backgroundOverlayStage.addChild(rndLabSign)
            }
            backgroundOverlayStage.addChild(visualsModule.levelOverlay.centerOverlay)
        }
        visualsModule.updateCompanyNameInOffice();
        CanvasManager.invalidateBackground();
        visualsModule.scrollToZone(GameManager.company.flags.currentZone);
        initializeWipeTouch() // d -> initializeWipeTouch
    };
    visualsModule.installAirCon = function () {
        visualsModule.levelOverlay.startAirCon1();
        visualsModule.levelOverlay.startAirCon2()
    };
    var isWipeTouchInitialized = !1, // f -> isWipeTouchInitialized
        initializeWipeTouch = function () { // d -> initializeWipeTouch
            isWipeTouchInitialized || (isWipeTouchInitialized = !0, $("#gameContainerWrapper").wipetouch({
                tapToClick: !1,
                wipeLeft: function (eventArgs) { // a -> eventArgs
                    VisualsManager.scrollToNextZone(1)
                },
                wipeRight: function (eventArgs) { // a -> eventArgs
                    VisualsManager.scrollToNextZone(-1)
                },
                wipeMove: function (moveData) { // b -> moveData
                    if ((!document.activeElement || !$(document.activeElement).hasClass("ui-slider-handle")) && moveData.dX) {
                        visualsModule.lastMove = Date.now();
                        var scrollContainerWidth = $("#canvasScrollContainer").width(), // c -> scrollContainerWidth
                            backgroundCanvasWidth = CanvasManager.backgroundStage.canvas.width, // d -> backgroundCanvasWidth
                            companyData = GameManager.company; // f -> companyData
                        if (companyData && 4 == companyData.currentLevel || scrollContainerWidth < backgroundCanvasWidth) diff = scrollContainerWidth - backgroundCanvasWidth, scrollContainerWidth = $("#innerCanvasContainer").offset().left - visualsModule.globalOffsetX, scrollContainerWidth += moveData.dX, CanvasManager.zone0Activ = scrollContainerWidth > -backgroundCanvasWidth, CanvasManager.zone1Activ = scrollContainerWidth > -2 * backgroundCanvasWidth && scrollContainerWidth <= diff, CanvasManager.zone2Activ = scrollContainerWidth > -3 * backgroundCanvasWidth && scrollContainerWidth <= diff - backgroundCanvasWidth, $("#innerCanvasContainer").css("left", scrollContainerWidth + "px")
                    }
                }
            }), $("a").live("touchend", function (eventArgs) { // a -> eventArgs
                location.href = $(this).attr("href")
            }))
        };
    visualsModule.scrollToNextZone = function (direction) { // b -> direction
        if (GameManager.company) {
            var currentZone = GameManager.company.flags.currentZone; // c -> currentZone
            void 0 === currentZone && (currentZone = 1);
            currentZone = (currentZone + direction).clamp(0, 2);
            4 != GameManager.company.currentLevel ? currentZone = 1 : (GameManager.company.flags.hwLabUnlocked || (currentZone = currentZone.clamp(1, 2)), GameManager.company.flags.rndLabUnlocked || (currentZone = currentZone.clamp(0, 1)));
            visualsModule.scrollToZone(currentZone, !0)
        }
    };
    visualsModule.scrollToZone = function (zoneIndex, animate) { // b -> zoneIndex, c -> animate
        var backgroundCanvasWidth = CanvasManager.backgroundStage.canvas.width; // d -> backgroundCanvasWidth
        void 0 === zoneIndex && (zoneIndex = 1);
        var targetX = 0 == zoneIndex ? visualsModule.toScreenCoordinates(270) : 1 == zoneIndex ? visualsModule.toScreenCoordinates(2560) : visualsModule.toScreenCoordinates(4760), // f -> targetX
            targetX = targetX * CanvasManager.globalScale,
            scrollContainerWidth = $("#canvasScrollContainer").width(), // k -> scrollContainerWidth
            backgroundCanvasWidth = Math.abs(scrollContainerWidth - backgroundCanvasWidth) / 2, // d -> backgroundCanvasWidth (reused)
            backgroundCanvasWidth =
                targetX + backgroundCanvasWidth * zoneIndex;
        $("#innerCanvasContainer").offset().left != backgroundCanvasWidth && (targetX = animate ? visualsModule.toScreenCoordinates(600) : 0, visualsModule.isAnimatingScroll = !0, $("#innerCanvasContainer").transition({ // f -> targetX (reused)
            left: -backgroundCanvasWidth
        }, targetX), setTimeout(function () {
            visualsModule.isAnimatingScroll = !1
        }, targetX));
        visualsModule._zoneChanged(zoneIndex, animate);
        GameManager.company.flags.currentZone = zoneIndex
    };
    visualsModule.updateComputers = function () {
        GameManager.company.staff.slice().sort(function (staffA, staffB) { // a -> staffA, b -> staffB
            return staffA.slot - staffB.slot
        }).forEach(function (staffMember) { // b -> staffMember
            visualsModule.addComputer(staffMember)
        })
    };
    var companyNameVisual; // k -> companyNameVisual
    visualsModule.updateCompanyNameInOffice = function () {
        var currentLevel = GameManager.company.currentLevel; // b -> currentLevel
        1 !=
            currentLevel && (companyNameVisual || (companyNameVisual = new IsometricCompanyNameVisual, CanvasManager.backgroundStage.addChild(companyNameVisual)), companyNameVisual.updateVisual(2 == currentLevel), 2 === currentLevel || 3 == currentLevel ? (companyNameVisual.x = visualsModule.toScreenCoordinates(690, CanvasManager.globalScale), companyNameVisual.y = visualsModule.toScreenCoordinates(1100, CanvasManager.globalScale)) : 4 == currentLevel && (companyNameVisual.x = visualsModule.toScreenCoordinates(1410, CanvasManager.globalScale), companyNameVisual.y = visualsModule.toScreenCoordinates(300, CanvasManager.globalScale), companyNameVisual.scaleX *= 0.8, companyNameVisual.scaleY *= 0.8), companyNameVisual.x += visualsModule.currentXOffset)
    };
    visualsModule.startCreateEngine = function () {
        visualsModule.gameStatusBar.startEngine();
        visualsModule.updatePoints()
    };
    visualsModule.startContract =
        function () {
            visualsModule.gameStatusBar.startContract();
            visualsModule.updatePoints()
        };
    visualsModule.updateEngineStatus = function () {
        var currentEngineDev = GameManager.currentEngineDev; // b -> currentEngineDev
        visualsModule.gameStatusBar.updateProgress(currentEngineDev.progress, !0, 100);
        visualsModule.gameStatusBar.updateStatusMessage(currentEngineDev.currentPart.name)
    };
    visualsModule.finishEngine = function () {
        visualsModule.gameStatusBar.finishEngine();
        GameManager.spawnedPoints = 0
    };
    visualsModule.updatePoints = function () {
        visualsModule.gameStatusBar.updatePoints();
        visualsModule.researchPoints.updatePoints(GameManager.company.researchPoints)
    };
    visualsModule.pulsePointsDisplay = function (pointType, callback) { // b -> pointType, c -> callback
        "r" === pointType ? visualsModule.researchPoints.pulse(callback) :
            visualsModule.gameStatusBar.pulsePointsDisplay(pointType, callback)
    };
    visualsModule.getGlobalLocationOfPointsDisplay = function (pointType) { // b -> pointType
        return "r" === pointType ? {
            x: visualsModule.researchPoints.x + visualsModule.researchPoints.size / 2,
            y: visualsModule.researchPoints.y + visualsModule.researchPoints.size / 2
        } : visualsModule.gameStatusBar.getGlobalLocationOfPointsDisplay(pointType)
    };
    visualsModule.reloadAllCharacters = function () {
        if (GameManager.company && GameManager.company.staff)
            for (var staffList = GameManager.company.staff, i = 0; i < staffList.length; i++) { // b -> staffList, c -> i
                var character = staffList[i]; // d -> character
                visualsModule.getCharacterOverlay(character);
                character.refreshPoints()
            }
    };
    visualsModule.characterOverlays = [];
    visualsModule.getCharacterOverlay = function (character, noCreate) { // b -> character, c -> noCreate
        var existingOverlay =
            visualsModule.characterOverlays.first(function (overlay) { // a -> overlay, d -> existingOverlay
                return overlay.character === character
            });
        return existingOverlay || noCreate ? existingOverlay : visualsModule.createCharacterOverlay(character)
    };
    visualsModule.getCurrentPosition = function (level, slot) { // b -> level, c -> slot
        var position = {}; // d -> position
        1 === level && (position.x = 998 * CanvasManager.globalScale, position.y = 599 * CanvasManager.globalScale);
        2 === level || 3 === level ? 0 === slot ? (position.x = 1515 * CanvasManager.globalScale, position.y = 995 * CanvasManager.globalScale) : 1 === slot ? (position.x = 1055 * CanvasManager.globalScale, position.y = 790 * CanvasManager.globalScale) : 2 === slot ? (position.x = 803 * CanvasManager.globalScale, position.y = 589 * CanvasManager.globalScale) : 3 === slot ? (position.x = 1283 * CanvasManager.globalScale,
            position.y = 658 * CanvasManager.globalScale) : 4 === slot && (position.x = 1036 * CanvasManager.globalScale, position.y = 451 * CanvasManager.globalScale) : 4 === level && (0 === slot ? (position.x = 1565 * CanvasManager.globalScale, position.y = 915 * CanvasManager.globalScale) : 1 === slot ? (position.x = 516 * CanvasManager.globalScale, position.y = 1023 * CanvasManager.globalScale) : 2 === slot ? (position.x = 436 * CanvasManager.globalScale, position.y = 711 * CanvasManager.globalScale) : 3 === slot ? (position.x = 798 * CanvasManager.globalScale, position.y = 857 * CanvasManager.globalScale) : 4 === slot ? (position.x = 719 * CanvasManager.globalScale, position.y = 547 * CanvasManager.globalScale) :
                5 === slot ? (position.x = 1067 * CanvasManager.globalScale, position.y = 694 * CanvasManager.globalScale) : 6 === slot && (position.x = 989 * CanvasManager.globalScale, position.y = 382 * CanvasManager.globalScale));
        position.x = visualsModule.toScreenCoordinates(position.x);
        position.y = visualsModule.toScreenCoordinates(position.y);
        position.x += visualsModule.currentXOffset;
        return position
    };
    visualsModule.positionCharacterOverlay = function (characterOverlay, level, slot) { // b -> characterOverlay, c -> level, d -> slot
        var position = visualsModule.getCurrentPosition(level, slot); // f -> position
        characterOverlay.x = position.x;
        characterOverlay.y = position.y;
        visualsModule.updateImages(characterOverlay, level, slot)
    };
    visualsModule.updateImages = function (characterOverlay, level, slot) { // b -> characterOverlay, c -> level, d -> slot
        var imageSize = 200; // f -> imageSize
        PlatformShim.ISLOWRES && (imageSize = 107);
        var globalCanvasScale = CanvasManager.globalScale; // k -> globalCanvasScale
        if (2 === slot || 4 === slot || 6 == slot) 2 === level ? (characterOverlay.deskImage =
            visualsModule.getSubImage(characterOverlay.x - 807 / visualsModule.Divisor * globalCanvasScale, characterOverlay.y - 527 / visualsModule.Divisor * globalCanvasScale, imageSize, imageSize, ResourceKeys.Level2Desk), 2 === slot ? (characterOverlay.keyBoardImage = visualsModule.getSubImage(characterOverlay.x - 889 / visualsModule.Divisor * globalCanvasScale, characterOverlay.y - 716 / visualsModule.Divisor * globalCanvasScale, imageSize, imageSize, ResourceKeys.Level2C2Keyboard), characterOverlay.pcImage = visualsModule.getSubImage(characterOverlay.x - 880 / visualsModule.Divisor * globalCanvasScale, characterOverlay.y - 698 / visualsModule.Divisor * globalCanvasScale, imageSize, imageSize, ResourceKeys.Level2C2)) : (characterOverlay.keyBoardImage = visualsModule.getSubImage(characterOverlay.x - 1117 / visualsModule.Divisor * globalCanvasScale, characterOverlay.y - 582 / visualsModule.Divisor * globalCanvasScale, imageSize, imageSize, ResourceKeys.Level2C2Keyboard), characterOverlay.pcImage = visualsModule.getSubImage(characterOverlay.x - 1114 / visualsModule.Divisor * globalCanvasScale, characterOverlay.y - 511 / visualsModule.Divisor * globalCanvasScale, imageSize, imageSize, ResourceKeys.Level2C4))) : 3 === level ? (characterOverlay.deskImage =
                visualsModule.getSubImage(characterOverlay.x - 807 / visualsModule.Divisor * globalCanvasScale, characterOverlay.y - 527 / visualsModule.Divisor * globalCanvasScale, imageSize, imageSize, ResourceKeys.Level3Desk), 2 === slot ? (characterOverlay.keyBoardImage = visualsModule.getSubImage(characterOverlay.x - 893 / visualsModule.Divisor * globalCanvasScale, characterOverlay.y - 713 / visualsModule.Divisor * globalCanvasScale, imageSize, imageSize, ResourceKeys.Level3C2Keyboard), characterOverlay.pcImage = visualsModule.getSubImage(characterOverlay.x - 878 / visualsModule.Divisor * globalCanvasScale, characterOverlay.y - 703 / visualsModule.Divisor * globalCanvasScale, imageSize, imageSize, ResourceKeys.Level3C2)) : (characterOverlay.keyBoardImage = visualsModule.getSubImage(characterOverlay.x - 1130 / visualsModule.Divisor * globalCanvasScale, characterOverlay.y - 578 / visualsModule.Divisor * globalCanvasScale, imageSize, imageSize, ResourceKeys.Level3C2Keyboard), characterOverlay.pcImage = visualsModule.getSubImage(characterOverlay.x - 1109 / visualsModule.Divisor * globalCanvasScale, characterOverlay.y - 511 / visualsModule.Divisor * globalCanvasScale, imageSize, imageSize, ResourceKeys.Level3C4))) : 4 === level && (characterOverlay.deskImage =
                    visualsModule.getSubImage(characterOverlay.x - 427 / visualsModule.Divisor * globalCanvasScale, characterOverlay.y - 460 / visualsModule.Divisor * globalCanvasScale, imageSize, imageSize, ResourceKeys.Level4Desk), 2 === slot ? (characterOverlay.keyBoardImage = visualsModule.getSubImage(characterOverlay.x - 541 / visualsModule.Divisor * globalCanvasScale, characterOverlay.y - 840 / visualsModule.Divisor * globalCanvasScale, imageSize, imageSize, ResourceKeys.Level4C2Keyboard), characterOverlay.pcImage = visualsModule.getSubImage(characterOverlay.x - 428 / visualsModule.Divisor * globalCanvasScale, characterOverlay.y - 756 / visualsModule.Divisor * globalCanvasScale, imageSize, imageSize, ResourceKeys.Level4C2)) : 4 === slot ? (characterOverlay.keyBoardImage = visualsModule.getSubImage(characterOverlay.x - 824 / visualsModule.Divisor * globalCanvasScale, characterOverlay.y - 676 / visualsModule.Divisor * globalCanvasScale, imageSize, imageSize, ResourceKeys.Level4C2Keyboard), characterOverlay.pcImage = visualsModule.getSubImage(characterOverlay.x - 711 / visualsModule.Divisor * globalCanvasScale, characterOverlay.y - 591 / visualsModule.Divisor * globalCanvasScale, imageSize, imageSize, ResourceKeys.Level4C2)) : 6 === slot && (characterOverlay.keyBoardImage =
                        visualsModule.getSubImage(characterOverlay.x - 1094 / visualsModule.Divisor * globalCanvasScale, characterOverlay.y - 511 / visualsModule.Divisor * globalCanvasScale, imageSize, imageSize, ResourceKeys.Level4C2Keyboard), characterOverlay.pcImage = visualsModule.getSubImage(characterOverlay.x - 981 / visualsModule.Divisor * globalCanvasScale, characterOverlay.y - 426 / visualsModule.Divisor * globalCanvasScale, imageSize, imageSize, ResourceKeys.Level4C2)))
    };
    visualsModule.getSubImage = function (screenX, screenY, width, height, resourceKey) { // b -> screenX, c -> screenY, d -> width, f -> height, k -> resourceKey
        var tempCanvas = document.createElement("canvas"); // m -> tempCanvas
        tempCanvas.width = width;
        tempCanvas.height = height;
        tempCanvas.getContext("2d").drawImage(GameDev.ResourceManager.resources[resourceKey], -((screenX - visualsModule.currentXOffset) / CanvasManager.globalScale), -screenY / CanvasManager.globalScale);
        screenX = new Image;
        screenX.src = tempCanvas.toDataURL("image/png");
        return screenX
    };
    visualsModule.refreshHiringButtons = function () {
        var canvasContainer =
            $("#canvasContainer"); // b -> canvasContainer
        canvasContainer.find(".hireStaffButtonBase").remove();
        var currentLevel = GameManager.company.currentLevel, // c -> currentLevel
            staffList = GameManager.company.staff; // d -> staffList
        if (1 < currentLevel && (2 != currentLevel && 3 != currentLevel || 5 != staffList.length) && !(3 < currentLevel && 7 == staffList.length)) {
            var availableSlot = [1, 2, 3, 4, 5, 6].first(function (slot) { // a -> slot, f -> availableSlot
                return !staffList.some(function (staffMember) { // b -> staffMember
                    return staffMember.slot == slot
                })
            }),
                hireButton = visualsModule.createHireButton(currentLevel, availableSlot); // c -> hireButton (reused)
            canvasContainer.append(hireButton);
            UI.maxFont("bold", canvasContainer.find(".hireButtonLabel"), 12)
        }
    };
    var releaseButtonElement; // m -> releaseButtonElement
    visualsModule.updateReleaseReadyButton = function () {
        releaseButtonElement || (releaseButtonElement = $('<div id="releaseButton" class="selectorButton greenButton windowStyleHideState" style="position:absolute; opacity=0;">' +
            "Finish".localize("button") + "</div>"), releaseButtonElement.gdIsActive = !1, $("#canvasContainer").append(releaseButtonElement));
        var parentWidth = releaseButtonElement.parent().width(); // a -> parentWidth
        releaseButtonElement.css({
            left: parentWidth / 2 - releaseButtonElement.width() / 2 + "px"
        });
        parentWidth = GameManager.company && GameManager.company.currentGame && !GameManager.company.currentGame.flags.devCompleted && GameManager.company.currentGame.flags.releaseReady;
        if (parentWidth != releaseButtonElement.gdIsActive) {
            releaseButtonElement.gdIsActive = parentWidth;
            var hideReleaseButton = function () { // b -> hideReleaseButton
                releaseButtonElement.transition({
                    opacity: 0
                }, 200);
                releaseButtonElement.removeClass("windowStyleShowState").addClass("windowStyleHideState");
                releaseButtonElement.gdIsActive = !1
            };
            parentWidth ? (releaseButtonElement.transition({
                opacity: 1
            },
                200), releaseButtonElement.removeClass("windowStyleHideState"), Sound.playSoundOnce("gameReady", 0.2), releaseButtonElement.clickExclOnce(function (eventArgs) { // a -> eventArgs
                    Sound.click();
                    hideReleaseButton();
                    GameManager.currentFeature && (GameManager.currentFeature.progress = 1);
                    GameManager.company.currentGame && (GameManager.company.currentGame.flags.finished = !0);
                    return !1
                })) : hideReleaseButton()
        }
    };
    visualsModule.createHireButton = function (level, slot) { // b -> level, c -> slot
        var hireButtonDiv = $(PlatformShim.toStaticHtml('<div class="hireStaffButtonBase hireStaffButton"><div class="hireButtonLabel">' + "Fill Position".localize() + '</div><div class="hireStaffProgress"></div></div>')), // d -> hireButtonDiv
            coordX = 0, // f -> coordX
            coordY = 0; // k -> coordY
        if (2 === level || 3 === level) switch (slot) {
            case 1:
                coordX = 1060;
                coordY = 840;
                break;
            case 2:
                coordX = 880;
                coordY = 720;
                break;
            case 3:
                coordX = 1290;
                coordY = 720;
                break;
            case 4:
                coordX = 1130, coordY = 580
        }
        if (4 === level) switch (slot) {
            case 1:
                coordX = 480;
                coordY = 1040;
                break;
            case 2:
                coordX = 480;
                coordY = 850;
                break;
            case 3:
                coordX = 750;
                coordY = 920;
                break;
            case 4:
                coordX = 780;
                coordY = 680;
                break;
            case 5:
                coordX = 1050;
                coordY = 730;
                break;
            case 6:
                coordX = 1E3, coordY = 500
        }
        coordX = visualsModule.toScreenCoordinates(coordX, CanvasManager.globalScale);
        coordY = visualsModule.toScreenCoordinates(coordY, CanvasManager.globalScale);
        coordX += visualsModule.currentXOffset;
        hireButtonDiv.css({
            position: "absolute",
            top: coordY + "px",
            left: coordX + "px"
        });
        hireButtonDiv.clickExcl(function () {
            Sound.click();
            1 == GameManager.company.maxStaff ? (GameManager.company.activeNotifications.insertAt(0, new Notification("Hint".localize(), "You have to complete the Staff Management training before you can hire someone. Simply {0} on your player character to access the training menu.".localize().format(Tutorial.getClickVerb()))), GameManager.showPendingNotifications()) : UI.isStaffSearchInProgress() || (1 < GameManager.company.staff.length ? Tutorial.hireMoreStaff() : Tutorial.findStaff(), UI.showFindStaffWindow(slot));
            window.event.cancelBubble = !0
        });
        return hireButtonDiv
    };
    visualsModule.createCharacterOverlay = function (character) { // c -> character
        var characterStage = canvasModule.characterStage, // d -> characterStage
            newOverlay = new CharacterOverlay(character); // f -> newOverlay
        visualsModule.positionCharacterOverlay(newOverlay, GameManager.company.currentLevel, character.slot);
        visualsModule.characterOverlays.push(newOverlay);
        visualsModule.addCharacterOverlayToStage(characterStage, newOverlay);
        return newOverlay
    };
    visualsModule.addCharacterOverlayToStage = function (stage, overlayToAdd) { // a -> stage, b -> overlayToAdd
        var slot = overlayToAdd.character.slot; // c -> slot
        if (0 === slot) stage.addChild(overlayToAdd);
        else
            for (var i = 0; i < stage.children.length; i++) // d -> i
                if (stage.children[i].character)
                    if (4 === slot || 6 === slot || 3 === slot || 5 === slot) {
                        stage.addChildAt(overlayToAdd, 0);
                        break
                    } else if (1 === slot && 1 > stage.children[i].character.slot ||
                        2 === slot && 4 > stage.children[i].character.slot || 3 === slot && 2 > stage.children[i].character.slot) {
                        stage.addChildAt(overlayToAdd, i);
                        break
                    } else if (4 < slot) {
                        stage.addChild(overlayToAdd);
                        break
                    }
    };
    visualsModule.refreshTrainingOverlays = function () {
        var canvasContainer = $("#canvasContainer"); // b -> canvasContainer
        canvasContainer.find(".trainingOverlayTemplate").remove();
        for (var i = 0; i < visualsModule.characterOverlays.length; i++) { // c -> i
            var characterOverlay = visualsModule.characterOverlays[i], // d -> characterOverlay
                trainingOverlayElement = $("#trainingOverlayTemplate").clone(); // f -> trainingOverlayElement
            trainingOverlayElement.removeAttr("id");
            var offsetLowRes = GameFlags.IS_LOW_RES ? -30 : 0; // k -> offsetLowRes
            trainingOverlayElement.css({
                position: "absolute",
                top: characterOverlay.y - VisualsManager.toScreenCoordinates(120, CanvasManager.globalScale) +
                    "px",
                left: characterOverlay.x - VisualsManager.toScreenCoordinates(60, CanvasManager.globalScale) + offsetLowRes + "px",
                transform: "scale({0},{0})".format(CanvasManager.globalScaleIgnoringLowResBackground)
            });
            characterOverlay.trainingOverlay = trainingOverlayElement;
            canvasContainer.append(trainingOverlayElement);
            trainingOverlayElement.hide();
            characterOverlay.resumeTraining()
        }
    };
    visualsModule.handleUltraWideMonitors = function (screenWidth, screenHeight) { // b -> screenWidth, c -> screenHeight
        if (screenWidth / screenHeight > 16 / 9) {
            var extraWidth = screenWidth / (screenWidth / screenHeight) * (screenWidth / screenHeight - 16 / 9); // d -> extraWidth
            $("#gameContainerWrapper").css({
                left: extraWidth / 2 + "px",
                width: screenWidth - extraWidth + "px"
            });
            visualsModule.globalOffsetX = extraWidth / 2
        } else $("#gameContainerWrapper").css({
            left: "0px",
            width: "100%"
        }), visualsModule.globalOffsetX = 0
    }
})();
(function () {
    var visualsManager = VisualsManager, // a -> visualsManager
        labCrews = []; // b -> labCrews
    visualsManager.refreshLabCrew = function () {
        labCrews && (labCrews.forEach(function (crewMember) { // a -> crewMember
            crewMember.parent.removeChild(crewMember)
        }), labCrews = []);
        initializeHwLabCrew(); // d -> initializeHwLabCrew
        initializeRndLabCrew(); // l -> initializeRndLabCrew
        4 == GameManager.company.currentLevel && visualsManager._zoneChanged(GameManager.company.flags.currentZone, !1)
    };
    var createProjectStatusCard = function (initialBudget) { // a -> initialBudget, c -> createProjectStatusCard
        var cardElement = $("#projectStatusCardTemplate").clone(); // b -> cardElement
        cardElement[0].id = void 0;
        cardElement.find(".projectBudgetSlider").slider({
            orientation: "horizontal",
            range: "min",
            min: 0,
            max: 100,
            value: initialBudget,
            animate: "fast",
            slide: function (event, ui) { // a -> event, c -> ui
                var sliderElement = $(ui.handle).closest(".projectBudgetSlider"); // d -> sliderElement
                if (!sliderElement.hasClass("projectBudgetSlider")) throw "couldn't find target slider";
                cardElement._gd_sliderValue = ui.value;
                sliderElement.slider("value", ui.value);
                var budgetPercentage = ui.value; // d -> budgetPercentage (reused)
                cardElement.hasClass("rndCard") ? GameManager.company.flags.rndBudget = budgetPercentage / 100 : GameManager.company.flags.hwBudget = budgetPercentage / 100;
                updateCardDisplay(cardElement) // n -> updateCardDisplay
            }
        });
        return cardElement
    },
        hwLabCard, // f -> hwLabCard
        initializeHwLabCrew = function () { // d -> initializeHwLabCrew
            var companyData = GameManager.company; // d -> companyData (reused)
            if (!hwLabCard) {
                var initialHwBudget = companyData.flags.hwBudget; // g -> initialHwBudget
                void 0 == initialHwBudget && (initialHwBudget = 0);
                hwLabCard = createProjectStatusCard(100 * initialHwBudget);
                hwLabCard.addClass("projectCardLeft").addClass("hwCard");
                hwLabCard.find(".projectCardLabel").text("Hardware lab".localize());
                hwLabCard.clickExcl(function () {
                    visualsManager.scrollToZone(0, !0)
                });
                hwLabCard.insertBefore("#consoleMaintenanceContainer");
                hwLabCard._gd_projectVisible = !0
            }
            if (4 > companyData.currentLevel || !companyData.flags.hwLabUnlocked) hwLabCard.hide();
            else {
                hwLabCard.show();
                updateCardDisplay(hwLabCard, GameManager.currentHwProject); // n -> updateCardDisplay
                companyData.hwCrew || (companyData.hwCrew = []);
                for (var hwCrewList = companyData.hwCrew, // l -> hwCrewList
                    maxHwBudget = GameManager.getMaxHwBudget(), // m -> maxHwBudget (reused)
                    leftScreenCharStage = CanvasManager.leftScreen.characterStage, // g -> leftScreenCharStage (reused)
                    frontRowCrew = [], // t -> frontRowCrew
                    crewIndex = 0; 12 >= crewIndex; crewIndex++) { // q -> crewIndex
                    hwCrewList.length < crewIndex + 1 && (hwCrewList.push(new ProjectWorkerVisual), hwCrewList[crewIndex].zone = 0, hwCrewList[crewIndex].setPosition(crewIndex), hwCrewList[crewIndex].loadAnimations());
                    var crewMember = hwCrewList[crewIndex]; // v -> crewMember
                    crewMember.getCurrentProject = function () {
                        return GameManager.currentHwProject
                    };
                    (function (worker, budget) { // a -> worker, b -> budget
                        worker.getAffordanceFactor = function () {
                            return calculateAffordanceFactor(maxHwBudget * companyData.flags.hwBudget, budget) // k -> calculateAffordanceFactor
                        }
                    })(crewMember,
                        maxHwBudget / 12 * (crewIndex + 1));
                    3 == crewIndex || 7 == crewIndex ? frontRowCrew.push(crewMember) : (leftScreenCharStage.addChild(crewMember), labCrews.push(crewMember))
                }
                crewIndex = 0;
                for (hwCrewList = frontRowCrew.length; crewIndex < hwCrewList; crewIndex++) leftScreenCharStage.addChild(frontRowCrew[crewIndex]), labCrews.push(frontRowCrew[crewIndex]);
                visualsManager.putConsoleToPedestal()
            }
        };
    visualsManager.putConsoleToPedestal = function () {
        var companyData = GameManager.company; // b -> companyData
        if (4 === companyData.currentLevel && companyData.flags.hwLabUnlocked) {
            visualsManager.consoleContainer && CanvasManager.leftScreen.backgroundOverlayStage.contains(visualsManager.consoleContainer) && CanvasManager.leftScreen.backgroundOverlayStage.removeChild(visualsManager.consoleContainer);
            var consoleToShow = void 0, // c -> consoleToShow
                platformList = void 0; // d -> platformList
            if (GameManager.currentHwProject && "custom console" ===
                GameManager.currentHwProject.id) consoleToShow = {
                    iconUri: GameManager.currentHwProject.iconUri
                };
            else if (platformList = companyData.licencedPlatforms.filter(function (platform) { // a -> platform
                return platform.isCustom
            }), platformList.length) consoleToShow = platformList.last();
            else if ((platformList = companyData.currentGame) && 0 < platformList.platforms.length && "PC" != platformList.platforms[0].id && "G64" != platformList.platforms[0].id && "Gameling" != platformList.platforms[0].id && "Vena Gear" != platformList.platforms[0].id && "PPS" != platformList.platforms[0].id && "GS" != platformList.platforms[0].id && "grPhone" != platformList.platforms[0].id) consoleToShow = companyData.currentGame.platforms[0];
            else
                for (platformList = companyData.gameLog.length - 1; 0 < platformList; platformList--) {
                    var gamePlatforms = companyData.gameLog[platformList].platforms; // f -> gamePlatforms
                    if ("PC" != gamePlatforms[0].id && "G64" != gamePlatforms[0].id && "Gameling" != gamePlatforms[0].id && "Vena Gear" != gamePlatforms[0].id && "PPS" != gamePlatforms[0].id && "GS" != gamePlatforms[0].id && "grPhone" != gamePlatforms[0].id) {
                        consoleToShow = gamePlatforms[0];
                        break
                    }
                }
            consoleToShow && (platformList = Platforms.getPlatformImage(consoleToShow, companyData.currentWeek), companyData = new createjs.Bitmap(platformList), consoleToShow = new createjs.Container, platformList = CanvasManager.globalScale, consoleToShow.scaleX = 0.45 * platformList, consoleToShow.scaleY = 0.45 * platformList, consoleToShow.x = 2230 * platformList, consoleToShow.y = 1104 * platformList, consoleToShow.addChild(companyData), visualsManager.consoleContainer = consoleToShow, CanvasManager.leftScreen.backgroundOverlayStage.addChild(visualsManager.consoleContainer))
        }
    };
    var calculateAffordanceFactor = function (totalBudget, budgetThreshold) { // a -> totalBudget, b -> budgetThreshold, k -> calculateAffordanceFactor
        if (0 === totalBudget) return -4;
        var affordance = totalBudget / budgetThreshold; // c -> affordance
        1 > affordance && (affordance = -1 + affordance);
        return affordance
    },
        rndLabCard, // m -> rndLabCard
        initializeRndLabCrew = function () { // l -> initializeRndLabCrew
            var companyData = GameManager.company; // d -> companyData (reused)
            if (!rndLabCard) {
                var initialRndBudget = companyData.flags.rndBudget; // f -> initialRndBudget
                void 0 == initialRndBudget && (initialRndBudget = 0);
                rndLabCard = createProjectStatusCard(100 * initialRndBudget);
                rndLabCard.addClass("projectCardRight").addClass("rndCard");
                rndLabCard.find(".projectCardLabel").text("R&D lab".localize());
                rndLabCard.clickExcl(function () {
                    visualsManager.scrollToZone(2, !0)
                });
                $("#gameUIContainer").append(rndLabCard);
                rndLabCard._gd_projectVisible = !0
            }
            if (4 > GameManager.company.currentLevel || !companyData.flags.rndLabUnlocked) rndLabCard.hide();
            else {
                rndLabCard.show();
                updateCardDisplay(rndLabCard, GameManager.currentRnDProject); // n -> updateCardDisplay
                companyData.rndCrew || (companyData.rndCrew = []);
                for (var rndCrewList = companyData.rndCrew, // g -> rndCrewList
                    maxRndBudget = GameManager.getMaxRndBudget(), // l -> maxRndBudget (reused)
                    rightScreenCharStage = CanvasManager.rightScreen.characterStage, // f -> rightScreenCharStage (reused)
                    frontRowCrew = [], // t -> frontRowCrew
                    crewIndex = 0; 12 >= crewIndex; crewIndex++) { // q -> crewIndex
                    rndCrewList.length < crewIndex + 1 && (rndCrewList.push(new ProjectWorkerVisual), rndCrewList[crewIndex].zone = 2, rndCrewList[crewIndex].setPosition(crewIndex), rndCrewList[crewIndex].loadAnimations());
                    var crewMember = rndCrewList[crewIndex]; // v -> crewMember
                    crewMember.getCurrentProject = function () {
                        return GameManager.currentRnDProject
                    };
                    (function (worker, budget) { // a -> worker, b -> budget
                        worker.getAffordanceFactor = function () {
                            return calculateAffordanceFactor(maxRndBudget * companyData.flags.rndBudget, budget) // k -> calculateAffordanceFactor
                        }
                    })(crewMember, maxRndBudget / 12 * (crewIndex + 1));
                    5 === crewIndex || 7 === crewIndex ? frontRowCrew.push(crewMember) : (rightScreenCharStage.addChild(crewMember), labCrews.push(crewMember))
                }
                crewIndex = 0;
                for (rndCrewList = frontRowCrew.length; crewIndex < rndCrewList; crewIndex++) rightScreenCharStage.addChild(frontRowCrew[crewIndex]), labCrews.push(frontRowCrew[crewIndex])
            }
        };
    visualsManager._zoneChanged = function (currentZone, animate) { // a -> currentZone, b -> animate
        var transitionSpeed = animate ? "normal" : 0; // c -> transitionSpeed
        CanvasManager.zone0Activ =
            0 === currentZone;
        CanvasManager.zone1Activ = 1 === currentZone;
        CanvasManager.zone2Activ = 2 === currentZone;
        2 != currentZone && rndLabCard && (rndLabCard.find(".projectBudgetSlider").slideUp(transitionSpeed), rndLabCard.find(".projectCardLabel").slideDown(transitionSpeed));
        2 == currentZone && rndLabCard && (rndLabCard.find(".projectBudgetSlider").slideDown(transitionSpeed), rndLabCard.find(".projectCardLabel").slideUp(transitionSpeed));
        0 != currentZone && hwLabCard && (hwLabCard.find(".projectBudgetSlider").slideUp(transitionSpeed), hwLabCard.find(".projectCardLabel").slideDown(transitionSpeed));
        0 == currentZone && hwLabCard && (hwLabCard.find(".projectBudgetSlider").slideDown(transitionSpeed), hwLabCard.find(".projectCardLabel").slideUp(transitionSpeed));
        updateCardLayoutForScreenSize(); // g -> updateCardLayoutForScreenSize
        2 == currentZone ? Media.enterRndLab(GameManager.company) : 0 == currentZone && Media.enterHwLab(GameManager.company)
    };
    var updateCardLayoutForScreenSize = function () { // g -> updateCardLayoutForScreenSize
        var isSmallScreen = CanvasManager.isSmallScreen; // a -> isSmallScreen
        if (rndLabCard) {
            var isRndProjectActive = isSmallScreen && GameManager.currentRnDProject; // b -> isRndProjectActive
            isRndProjectActive && !rndLabCard.hasClass("small") ? rndLabCard.addClass("small") : !isRndProjectActive && rndLabCard.hasClass("small") && rndLabCard.removeClass("small")
        }
        hwLabCard && ((isRndProjectActive = isSmallScreen && GameManager.currentHwProject) && !hwLabCard.hasClass("small") ? hwLabCard.addClass("small") : !isRndProjectActive && hwLabCard.hasClass("small") && hwLabCard.removeClass("small"))
    },
        updateCardDisplay = function (cardElement, project) { // a -> cardElement, n -> updateCardDisplay (takes project as second arg now)
            if (cardElement) {
                var companyData = GameManager.company; // b -> companyData (reused)
                if (companyData) {
                    var currentBudgetPercentage = 100 * companyData.flags.hwBudget, // c -> currentBudgetPercentage
                        monthlyCost = GameManager.getLabCostPerMonth(0); // d -> monthlyCost
                    // project variable already exists
                    cardElement.hasClass("rndCard") && (project = GameManager.currentRnDProject, // f -> project (reused)
                        monthlyCost = GameManager.getLabCostPerMonth(2), currentBudgetPercentage = 100 * companyData.flags.rndBudget);
                    !project && cardElement._gd_projectVisible ? (cardElement.find(".projectStatusContainer").slideUp(), cardElement._gd_projectVisible = !1) : project && (cardElement._gd_projectVisible || (cardElement.find(".projectStatusContainer").slideDown(), cardElement._gd_projectVisible = !0), cardElement._gd_iconUrl != project.iconUri && (cardElement.find(".projectIcon").attr("src", project.iconUri), cardElement._gd_iconUrl = project.iconUri), cardElement._gd_title != project.name && (companyData = cardElement.find(".projectTitle"), UI.maxFont("bold", companyData, 20, project.name), cardElement._gd_title = project.name), cardElement._gd_progress != project.progress && (cardElement.find(".projectProgress").stop().transit({
                        width: 100 *
                            project.progress + "%"
                    }), cardElement._gd_progress = project.progress), cardElement._gd_pointsRemaining != project.remainingPoints && (cardElement.find(".projectPointsRemaining").text(project.startPoints - project.remainingPoints), cardElement._gd_pointsRemaining = project.remainingPoints));
                    cardElement._gd_budget !== monthlyCost && (cardElement.find(".projectBudgetValue").text("{0} per month".localize().format(UI.getShortNumberString(monthlyCost))), cardElement._gd_budget = monthlyCost);
                    Math.round(cardElement._gd_sliderValue) != Math.round(currentBudgetPercentage) && (cardElement.find(".projectBudgetSlider").slider({
                        value: currentBudgetPercentage
                    }), cardElement._gd_sliderValue = currentBudgetPercentage);
                    updateCardLayoutForScreenSize() // g -> updateCardLayoutForScreenSize
                }
            }
        };
    visualsManager.updateProjectStatusCards = function () {
        GameManager.company.flags.hwLabUnlocked &&
            updateCardDisplay(hwLabCard); // n -> updateCardDisplay
        GameManager.company.flags.rndLabUnlocked && updateCardDisplay(rndLabCard) // n -> updateCardDisplay
    }
})();