// --- START OF FILE SettingsGameplay.js ---

// Danh sách tên công ty hư cấu trong game, được tách bằng dấu chấm phẩy.
// Người chơi có thể chọn một trong những tên này hoặc đặt tên riêng.
var CompanyNames = "Original Anvil;Macroprose;Bulldog Entertainment;Red Isles Studios;Obscure Entertainment;Lionfeet Studios;Rockville Softworks;Bungy;Comclap;Epoch Games;Namoni;NGSoftware".split(";");

// Danh sách tên các công ty game có thật, dùng để kiểm tra xem tên người chơi đặt có trùng không (có thể để kích hoạt achievement "Fanboy").
// Danh sách này rất dài và bao gồm nhiều biến thể tên.
var RealCompanyNames = "Origin;Origin Systems;Obsidian;Obsidian Ent.;Blizzard;Valve;Introversion;Cloud Imperium;Broderbund;Bethesda;JoWood;Infrogrames;Black Isle;Sierra;Sierra Entertainment;Sierra On-line;Westwood Studios;MicroProse;0verflow;1st Playable Productions;2K Czech;2XL Games;343 Studios;3DO;38 Studios;3G Studios;42 Entertainment;4A Games;5pb. Inc.;5th Cell;989 Studios;Acclaim Entertainment;Accolade;Access Games;ACE Team;Acheron Design;Acquire;Active Gaming Media;Activision;Activision Blizzard;Adventure Soft;Akella;Aki Corporation;Alfa System;Ancient;Anino Games;Appmania;AQ Interactive;Arc System Works;Arkane Studios;Arkedo Studio;ArenaNet;Arika;Artdink;ArtePiazza;Artificial Mind and Movement;A2M;Artificial Studios;Artoon;Asobo Studio;Ascaron;Aspect;Aspyr Media;Atari;Atlus;Atomic Planet Entertainment;Attic Entertainment Software;Avalanche Studios;Avalanche Software;Aventurine SA;Babaroga;Backbone Entertainment;BattleGoat Studios;Banpresto;Bauhaus Entertainment;Beenox;Behemoth, The;Bethesda Softworks;Big Blue Bubble;Big Huge Games;Binary Hammer;BioWare;Bioware;The Bitmap Brothers;Bizarre Creations;Black Rock Studio;Blitz Games Studios;Blizzard Entertainment;Blue Byte Software;Blue Fang Games;Bohemia Interactive;BreakAway Games;Br\u00f8derbund;Brownie Brown;BSure Interactive;Bullfrog Productions;Bullfrog;Buka Entertainment;Bugbear Entertainment;Bungie Studios;Capcom;Cave;Cavia;Cazap;CCP Games;CD Projekt RED;Centuri;Chunsoft;Cinemaware;Cing;Clap Hanz;Climax Entertainment;Climax Studios;Coded Illusions;Codemasters;Coktel Vision;ColdWood Interactive;Compile Heart;Core Design;Crafts & Meister;Creat Studios;Creative Assembly;Criterion Games;Cryptic Studios;Crystal Dynamics;Crytek;Cyberlore Studios;Cyanide;CyberConnect2;Day 1 Studios;Deadline Games;Deck13;Deep Silver;Demiurge Studios;Digital Illusions;Dimps;Disney Interactive Studios;Double Fine Productions;Double Helix Games;Dynamite Idea;Egosoft;Eidos Interactive;Electronic Arts;EA Games;Engine Software;Epic Games;Epicenter Studios;Epyx;Etranges Libellules;Eugen Systems;Eurocom;Evolution Studios;F4;FarSight Studios;Fatshark;feelplus;Firaxis Games;Firaxis;Firefly Studios;First Star Software;Flagship Games;Flying Lab Software;Foundation 9 Entertainment;Free Radical Design;Frictional Games;From Software;Frozenbyte;Frontier Developments;FUN Labs;Funcom;Futuremark;Game Arts;GameHouse;Gameloft;Games2win;Game Freak;Gearbox Software;Genki;Giants Software;Gogii Games;Good-Feel;Grasshopper Manufacture;Gravity;Griptonite Games;GSC Game World;Guerrilla Games;GungHo Online Entertainment;Gust Corporation;Haemimont Games;HAL Laboratory;Hanaho;Harmonix Music Systems;Hasbro Interactive;HB Studios;HeroCraft;High Moon Studios;High Voltage Software;Hoplon Infotainment;Hothead Games;Housemarque;Hudson Soft;Human Head Studios;Humongous Entertainment;Hyperion Entertainment;id Software;Idea Factory;Ignition Entertainment;IguanaBee;Imageepoch;Infinity Ward;Introversion Software;Incredible Technologies;indieszero;Infogrames;Insomniac Games;Intelligent Systems;Interplay Entertainment;Interplay;IO Interactive;Irem;Irrational Games;Transmission Games;Jadestone Group;Jagex;Jaleco;Javaground;Juice Games;Jupiter;JV Games;Klei Entertainment;Koei;Konami;Krome Studios;Kuju Entertainment;Kush Games;Kuma Reality Games;Ludia;Larian Studios;Legacy Interactive;Legendo Entertainment;Level-5;Lionhead Studios;Llamasoft;Looking Glass Studios;LucasArts;Lucas Arts;Luma Arcade;Luxoflux;Majesco Entertainment;Marvelous Entertainment;Massive Entertainment;Masthead Studios;Mattel;Maxis Software;Mean Hamster Software;Media Molecule;Media.Vision;Mercury Steam;Microsoft Game Studios;Milestone;Milestone S.r.l.;M-Inverse;Mistwalker;Mitchell Corporation;Mojang AB;Monolith Productions;Monolith Soft;Monumental Games;Mythic Entertainment;Namco Bandai;Natsume;Naughty Dog;NCsoft;Ndoors;Neowiz;Nerve Software;NetDevil;Neverland;Neversoft;Nexon;Next Level Games;NGD Studios;Nihon Bussan;Nihon Falcom;Ninjabee;Nintendo;Nippon Ichi Software;Nokia;NHN;Novalogic;Novarama;n-Space;Oddworld Inhabitants;Obsidian Entertainment;Oxygen Studios;Page 44 Studios;Paon;Papaya Studio;Paradox Interactive;Pandemic Studios;Pax Softnica;Pendulo Studios;Penguin Software;People Can Fly;Petroglyph;Phantagram;Piranha Bytes;Pi Studios;Pivotal Games;Playdead;Playdom;Playfish;Playlogic Entertainment;PlayFirst;Platinum Games;Polyphony Digital;PopCap Games;Punch Entertainment;Pyro Studios;Q Entertainment;Q-Games;Quantic Dream;Radical Entertainment;Rainbow Studios;Rare Limited;Raven Software;Reality Pump Studios;Realtime Associates;Realtime Worlds;RedLynx;Red Storm Entertainment;Redtribe;Reflexive Entertainment;Relic Entertainment;Remedy Entertainment;Retro Studios;Revolution Software;Rising Star Games;Rockstar North;Rockstar Games;Rocksteady Studios;Ruffian Games;Runic Games;Running with Scissors;Sarbakan;Sega;SCE Studio Liverpool;Sidhe;Silicon Knights;Silicon Sisters;Silicon Studio;SNK Playmore;Sobee Studios;Snowblind Studios;Software 2000;Sonic Team;Sony Computer Entertainment;Sony Computer Entertainment America;Sony Computer Entertainment Europe;Sora Ltd.;Spectrum HoloByte;Spellborn International;Splash Damage;Square Enix;Starbreeze Studios;Stardock;Star Vault;Strawdog Studios;Sting Entertainment;Straylight Studios;Streamline Studios;Sucker Punch Productions;Sumo Digital;Sunflowers;SuperVillain Studios;Swingin' Ape Studios;Taito Corporation;Tag Games;Take-Two Interactive;Tale of Tales;TaleWorlds;Tamsoft;Tantrumedia;Tantalus Media;Team17;Techland;Tecmo Koei;Telltale Games;Terminal Reality;THQ;Three Rings Design;TimeGate Studios;Torpex Games;Torus Games;Tose;Trapdoor;Traveller's Tales;Treyarch;Tri-Ace;Tripwire Interactive;Triumph Studios;Turn 10 Studios;Two Tribes;Tygron;Ubisoft;Ultimate Play The Game;United Front Games;Universomo;Vivendi Games;Valve Corporation;Vanillaware;Venan Entertainment;Vertigo Games;Vicarious Visions;Viwawa;Virtual Playground;Visceral Games;Volition;W!Games;Wahoo Studios;Wanako Games;Wangame Studios;WB Games;Webfoot Technologies;Wideload Games;Wildfire Studios;Wolfire Games;World Forge;Xseed Games;YoYo Games;Yuke's;ZapSpot;ZeniMax;Zipper Interactive;Zylom;Zynga;2.0 Studios;2D Boy;3G Studios;4D Rulers Software;ACE Team;Aldorlea Games;Alec Holowka;Almost Human;Amanita Design;Amaranth Games;Ambrosia Software;Artix Entertainment;Babaroga;Basilisk Games;The Behemoth;Benjamin Rivers;Big Finish Games;Bit Blot;Blitz Games Studios;Blossomsoft;Blue Fang Games;Bohemia Interactive Studio;Boomzap Entertainment;Bplus;Bubble Gum Interactive;Broken Rules;Capybara Games;Caravel Games;Castle Thorn;Chedburn Networks Limited;Christopher Howard Wolf;Chronic Logic;Cing;Cit\u00e9r\u00e9mis;ClockStone Software;cly5m;Coffee Stain Studios;ColdWood Interactive;Crytek Black Sea;Dark Water Studios;Daniel Benmergui;Dejobaan Games;Derek Yu;Digital Eel;Dovogame;Dreadlocks Ltd;Edmund McMillen;Elite Gudz;Elixir Studios;Erik Sved\u00e4ng;Ethereal Darkness Interactive;Eurocom;Evony;Exotypos;Facepunch Studios;Ferry Halim;Firefly Studios;Flashbang Studios;Flying Lab Software;Freebird Games;Frictional Games;Frogwares;Frontier Developments;GameLab;Gaijin Games;GarageGames;Gogii Games;Grasshopper Manufacture;Grey Alien Games;Guild Software;Haemimont Games;Hanako Games;Hemisphere Games;Himalaya Studios;IguanaBee;Insomniac Games;Introversion Software;InvisibleInkStudios;Iron Tower Studio;Irrgheist;Jagex;Jason Rohrer;Jonas Kyratzes;Jph Wacheski;KatGames;Klei Entertainment;Kloonigames;Krillbite;Laminar Research;Level-5;Lexaloffle;Little Green Men Games;Llamasoft;Longbow Digital Arts;M-Inverse;Mad Genius Software;Mangled Eye Studios;Metanet Software;mif2000;Mind Control Software;Mojang;Moonpod;Mousechief;New Star Games;Nicalis;Nifflas;Nival Interactive;Number None;The Odd Gentlemen;OmniSystems;OTS Software;Paladin Studios;Parallax Studio;Pieces Interactive;PixelJAM Games;Playdead;Playtechtonics;Pocketwatch Games;Positech Games;Private Moon Studios;Pronto Games;Prorattafactor;Provox games;PST Team;Psyonix Studios;Punch Entertainment;Q-Games;Queasy Games;Re-logic;realtech VR;Reflexive Entertainment;Relentless Software;Renegade Kid;Reverge Labs;Ronimo Games;Rovio Entertainment;S2 Games;Saber Interactive;Sandlot Games;Santa Cruz Games;Santa Cruz Games;Scientifically Proven;Secret Exit;Seed Studios;Silver Creek Entertainment;Ska Studios;Snowstep Development;Soldak Entertainment;Source Studio;Spiderweb Software;Stoic Studio;Star Vault;Storm Impact;Studio Pixel;Subatomic Studios;Supergiant Games;SuperVillain Studios;Swedish Game Development;Swing Swing Submarine;Tale of Tales;TaleWorlds;Team Shanghai Alice;TeamTNT;thatgamecompany;TheorySpark;Three Rings Design;Torpex Games;Trade Games International;Trendy Entertainment;Tribetoy;Tyler Glaiel;uCool;Unreal Software;Ville M\u00f6nkk\u00f6nen;Vlambeer;WayForward Technologies;Wolfire Games;XMG Studio;Zachary Barth;Zoetrope Interactive;Zoonami;ZootFly;Tale of Tales;TaleWorlds;Tamsoft;Tantrumedia;Tantalus Media;Team17;Techland;Tecmo Koei;Telltale Games;Terminal Reality;THQ;Three Rings Design;TimeGate Studios;Torpex Games;Torus Games;Tose;Trapdoor;Traveller's Tales;Treyarch;Tri-Ace;Tripwire Interactive;Triumph Studios;Turn 10 Studios;Two Tribes;Tygron;Ubisoft;Ultimate Play The Game;United Front Games;Universomo;Vivendi Games;Valve Corporation;Vanillaware;Venan Entertainment;Vertigo Games;Vicarious Visions;Viwawa;Virtual Heroes;Virtual Playground;Visceral Games;Volition;W!Games;Wahoo Studios;Wanako Games;Wangame Studios;WB Games;Webfoot Technologies;Wideload Games;Wildfire Studios;Wolfire Games;World Forge;Xseed Games;YoYo Games;Yuke's;ZapSpot;Zipper Interactive;Zylom".split(";");

// Đối tượng chứa các cài đặt liên quan đến gameplay
var SettingsGameplay = {};

(function () {
    // Tạo một alias ngắn cho SettingsGameplay để sử dụng bên trong IIFE này
    var gameplaySettingsModule = SettingsGameplay;

    // Lấy chế độ tutorial từ DataStore, nếu không có thì mặc định là "onlyNew"
    // "onlyNew": chỉ hiển thị tutorial cho các tính năng mới
    // "always": luôn hiển thị tất cả tutorial
    // "never": không bao giờ hiển thị tutorial
    gameplaySettingsModule.tutorialMode = DataStore.settings.tutorialMode ? DataStore.settings.tutorialMode : "onlyNew";

    // Lấy chế độ animation từ DataStore, nếu không có thì mặc định là "quality"
    // "quality": ưu tiên chất lượng hình ảnh, animation mượt mà
    // "performance": ưu tiên hiệu năng, có thể bỏ qua một số frame hoặc cache text
    gameplaySettingsModule.animationMode = DataStore.settings.animationMode ? DataStore.settings.animationMode : "quality";

    // Hàm trả về chế độ tutorial hiện tại
    gameplaySettingsModule.getTutorialMode = function () {
        return DataStore.settings.tutorialMode;
    };

    // Hàm kiểm tra xem có nên luôn hiển thị tutorial không
    gameplaySettingsModule.alwaysShowTutorials = function () {
        return "always" == gameplaySettingsModule.getTutorialMode();
    };

    // Hàm kiểm tra xem tutorial có bị tắt không
    gameplaySettingsModule.isTutorialOff = function () {
        return "never" == gameplaySettingsModule.getTutorialMode();
    };

    // Hàm trả về chế độ animation hiện tại
    gameplaySettingsModule.getAnimationMode = function () {
        return DataStore.settings.animationMode;
    };

    // Hàm cập nhật các giá trị trên panel cài đặt (UI)
    gameplaySettingsModule.updateValuesOnPanel = function (settingsPanelElement) {
        // Lấy giá trị hiện tại từ DataStore hoặc giá trị mặc định
        var currentTutorialMode = DataStore.settings.tutorialMode ? DataStore.settings.tutorialMode : "onlyNew";
        var currentAnimationMode = DataStore.settings.animationMode ? DataStore.settings.animationMode : "quality";

        // Tìm phần tử select cho chế độ tutorial và animation trong panel
        var tutorialSelectionElement = $(settingsPanelElement).find(".tutorialSelection");
        var animationSelectionElement = $(settingsPanelElement).find(".animationSelection");

        // Nếu tìm thấy phần tử chọn chế độ tutorial
        if (tutorialSelectionElement.length > 0) {
            // Đặt giá trị hiện tại cho nó
            tutorialSelectionElement.val(currentTutorialMode);
            // Gắn sự kiện 'change' để lưu cài đặt khi người dùng thay đổi
            tutorialSelectionElement.change(function (event, ui) {
                var selectedMode = $(this).val();
                gameplaySettingsModule.tutorialMode = selectedMode; // Cập nhật biến trong module
                DataStore.settings.tutorialMode = selectedMode; // Cập nhật vào đối tượng settings của DataStore
                DataStore.saveSettings(); // Lưu cài đặt
            });
        }

        // Nếu tìm thấy phần tử chọn chế độ animation
        if (animationSelectionElement.length > 0) {
            // Đặt giá trị hiện tại cho nó
            animationSelectionElement.val(currentAnimationMode);
            // Gắn sự kiện 'change' để lưu cài đặt khi người dùng thay đổi
            animationSelectionElement.change(function (event, ui) {
                var selectedMode = $(this).val();
                gameplaySettingsModule.animationMode = selectedMode; // Cập nhật biến trong module
                DataStore.settings.animationMode = selectedMode; // Cập nhật vào đối tượng settings của DataStore
                DataStore.saveSettings(); // Lưu cài đặt
            });
        }
    };

    // Hàm kiểm tra xem có nên bật cache text không
    // Bật nếu cờ TEXT_CACHING trong GameFlags là true HOẶC chế độ animation là "performance"
    gameplaySettingsModule.isTextCacheEnabled = function () {
        return GameFlags.TEXT_CACHING || "performance" == gameplaySettingsModule.getAnimationMode();
    };

    // Hàm kiểm tra xem có nên bỏ qua frame (frame skipping) không
    // Bật nếu cờ SKIP_FRAME trong GameFlags là true HOẶC chế độ animation là "performance"
    gameplaySettingsModule.isFrameSkipEnabled = function () {
        return GameFlags.SKIP_FRAME || "performance" == gameplaySettingsModule.getAnimationMode();
    };
})();
// --- END OF FILE SettingsGameplay.js ---