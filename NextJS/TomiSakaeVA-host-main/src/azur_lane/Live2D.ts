/* eslint-disable prettier/prettier */
// utils/azur.ts

const modelData = {
    models: [
        {
            model: '/azur/models/abeikelongbi_3_hx/abeikelongbi_3_hx.model3.json',
            modelname: 'Abercrombie',
            modelid: '1',
            name: 'Abercrombie HX',
        },
        {
            model: '/azur/models/abeikelongbi_3/abeikelongbi_3.model3.json',
            modelname: 'Abercrombie',
            modelid: '2',
            name: 'Abercrombie',
            img: '/azur/models_img/AbercrombieBunnyShipyardIcon.png',
        },
        {
            model: '/azur/models/adaerbote_2/adaerbote_2.model3.json',
            modelname: 'Prinz Adalbert',
            modelid: '3',
            name: 'Prinz Adalbert',
            img: '/azur/models_img/Prinz_AdalbertMaidShipyardIcon.png',
        },
        {
            model: '/azur/models/aerbien_3/aerbien_3.model3.json',
            modelname: 'Albion',
            modelid: '4',
            name: 'Albion',
            img: '/azur/models_img/AlbionSpringShipyardIcon.png',
        },
        {
            model: '/azur/models/aersasi_2/aersasi_2.model3.json',
            modelname: 'Alsace',
            modelid: '5',
            name: 'Alsace',
            img: '/azur/models_img/AlsaceSummerShipyardIcon.png',
        },
        {
            model: '/azur/models/aierdeliqi_4/aierdeliqi_4.model3.json',
            modelname: 'Eldridge',
            modelid: '6',
            name: 'Eldridge 1',
            img: '/azur/models_img/EldridgeNew_YearShipyardIcon.png',
        },
        {
            model: '/azur/models/aierdeliqi_5/aierdeliqi_5.model3.json',
            modelname: 'Eldridge',
            modelid: '7',
            name: 'Eldridge 2',
            img: '/azur/models_img/EldridgeIdolShipyardIcon.png',
        },
        {
            model: '/azur/models/aijier_2/aijier_2.model3.json',
            modelname: 'Ägir',
            modelid: '8',
            name: 'Ägir 1',
            img: '/azur/models_img/ÄgirMaidShipyardIcon.png',
        },
        {
            model: '/azur/models/aijier_3/aijier_3.model3.json',
            modelname: 'Ägir',
            modelid: '9',
            name: 'Ägir 2',
            img: '/azur/models_img/ÄgirSpringShipyardIcon.png',
        },
        {
            model: '/azur/models/aijier_3_hx/aijier_3_hx.model3.json',
            modelname: 'Aijier',
            modelid: '10',
            name: 'Aijier 2 HX',
        },
        {
            model: '/azur/models/ailunsamuna_2/ailunsamuna_2.model3.json',
            modelname: 'Allen M. Sumner',
            modelid: '11',
            name: 'Allen M. Sumner',
            img: '/azur/models_img/Allen_M._SumnerBunnyShipyardIcon.png',
        },
        {
            model: '/azur/models/aimierbeierding_2/aimierbeierding_2.model3.json',
            modelname: 'Émile Bertin',
            modelid: '12',
            name: 'Émile Bertin',
            img: '/azur/models_img/Émile_BertinSummerShipyardIcon.png',
        },
        {
            model: '/azur/models/aimudeng_2/aimudeng_2.model3.json',
            modelname: 'Emden',
            modelid: '13',
            name: 'Emden',
            img: '/azur/models_img/EmdenVampireShipyardIcon.png',
        },
        {
            model: '/azur/models/aimudeng_2_hx/aimudeng_2_hx.model3.json',
            modelname: 'Aimudeng',
            modelid: '14',
            name: 'Aimudeng HX',
        },
        {
            model: '/azur/models/aisaikesi_4/aisaikesi_4.model3.json',
            modelname: 'Essex',
            modelid: '15',
            name: 'Essex',
            img: '/azur/models_img/EssexPartyShipyardIcon.png',
        },
        {
            model: '/azur/models/ankeleiqi_2/ankeleiqi_2.model3.json',
            modelname: 'Anchorage',
            modelid: '16',
            name: 'Anchorage 1',
            img: '/azur/models_img/AnchorageSummerShipyardIcon.png',
        },
        {
            model: '/azur/models/ankeleiqi_2_hx/ankeleiqi_2_hx.model3.json',
            modelname: 'Ankeleiqi',
            modelid: '17',
            name: 'Ankeleiqi 1 HX',
        },
        {
            model: '/azur/models/ankeleiqi_3/ankeleiqi_3.model3.json',
            modelname: 'Anchorage',
            modelid: '18',
            name: 'Anchorage 2',
            img: '/azur/models_img/AnchorageSpringShipyardIcon.png',
        },
        {
            model: '/azur/models/baerdimo_5/baerdimo_5.model3.json',
            modelname: 'Baltimore',
            modelid: '19',
            name: 'Baltimore 1',
            img: '/azur/models_img/BaltimorePartyShipyardIcon.png',
        },
        {
            model: '/azur/models/baerdimo_6/baerdimo_6.model3.json',
            modelname: 'Baltimore',
            modelid: '20',
            name: 'Baltimore 2',
            img: '/azur/models_img/BaltimoreRaceQueenShipyardIcon.png',
        },
        {
            model: '/azur/models/bailong_3/bailong_3.model3.json',
            modelname: 'Hakuryuu',
            modelid: '21',
            name: 'Hakuryuu',
            img: '/azur/models_img/HakuryuuPartyShipyardIcon.png',
        },
        {
            model: '/azur/models/banrenma_2/banrenma_2.model3.json',
            modelname: 'Centaur',
            modelid: '22',
            name: 'Centaur',
            img: '/azur/models_img/CentaurSummerShipyardIcon.png',
        },
        {
            model: '/azur/models/beikaluolaina_2/beikaluolaina_2.model3.json',
            modelname: 'North Carolina',
            modelid: '23',
            name: 'North Carolina',
            img: '/azur/models_img/North_CarolinaBunnyShipyardIcon.png',
        },
        {
            model: '/azur/models/biaoqiang_3/biaoqiang_3.model3.json',
            modelname: 'Javelin',
            modelid: '24',
            name: 'Javelin',
            img: '/azur/models_img/JavelinSummerShipyardIcon.png',
        },
        {
            model: '/azur/models/bisimai_2/bisimai_2.model3.json',
            modelname: 'Bismarck',
            modelid: '25',
            name: 'Bismarck',
            img: '/azur/models_img/BismarckPartyShipyardIcon.png',
        },
        {
            model: '/azur/models/bisimai_2_hx/bisimai_2_hx.model3.json',
            modelname: 'Bisimai',
            modelid: '26',
            name: 'Bisimai HX',
        },
        {
            model: '/azur/models/bola_2/bola_2.model3.json',
            modelname: 'Pola',
            modelid: '27',
            name: 'Pola',
            img: '/azur/models_img/PolaSummerShipyardIcon.png',
        },
        {
            model: '/azur/models/boyixi_2/boyixi_2.model3.json',
            modelname: 'Boise',
            modelid: '28',
            name: 'Boise',
            img: '/azur/models_img/BoiseBunnyShipyardIcon.png',
        },
        {
            model: '/azur/models/bulaimodun_2/bulaimodun_2.model3.json',
            modelname: 'Bremerton',
            modelid: '29',
            name: 'Bremerton 1',
            img: '/azur/models_img/BremertonCasualShipyardIcon.png',
        },
        {
            model: '/azur/models/bulaimodun_4/bulaimodun_4.model3.json',
            modelname: 'Bremerton',
            modelid: '30',
            name: 'Bremerton 2',
            img: '/azur/models_img/BremertonSpringShipyardIcon.png',
        },
        {
            model: '/azur/models/bulaimodun_4_hx/bulaimodun_4_hx.model3.json',
            modelname: 'Bulaimodun',
            modelid: '31',
            name: 'Bulaimodun 2 HX',
        },
        {
            model: '/azur/models/bulaimodun_5/bulaimodun_5.model3.json',
            modelname: 'Bremerton',
            modelid: '32',
            name: 'Bremerton 3',
            img: '/azur/models_img/BremertonHome_RelaxationShipyardIcon.png',
        },
        {
            model: '/azur/models/buleisite_2/buleisite_2.model3.json',
            modelname: 'Brest',
            modelid: '33',
            name: 'Brest',
            img: '/azur/models_img/BrestSummerShipyardIcon.png',
        },
        {
            model: '/azur/models/chaijun_3/chaijun_3.model3.json',
            modelname: 'Cheshire',
            modelid: '34',
            name: 'Cheshire 1',
            img: '/azur/models_img/CheshireSpringShipyardIcon.png',
        },
        {
            model: '/azur/models/chaijun_4/chaijun_4.model3.json',
            modelname: 'Cheshire',
            modelid: '35',
            name: 'Cheshire 2',
            img: '/azur/models_img/CheshirePartyShipyardIcon.png',
        },
        {
            model: '/azur/models/chaijun_4_hx/chaijun_4_hx.model3.json',
            modelname: 'Chaijun',
            modelid: '36',
            name: 'Chaijun 2 HX',
        },
        {
            model: '/azur/models/chicheng_5/chicheng_5.model3.json',
            modelname: 'Akagi',
            modelid: '37',
            name: 'Akagi',
            img: '/azur/models_img/AkagiSpringShipyardIcon.png',
        },
        {
            model: '/azur/models/chuixue_3/chuixue_3.model3.json',
            modelname: 'Fubuki',
            modelid: '38',
            name: 'Fubuki',
            img: '/azur/models_img/FubukiPartyShipyardIcon.png',
        },
        {
            model: '/azur/models/chuyue_2/chuyue_2.model3.json',
            modelname: 'Hatsuzuki',
            modelid: '39',
            name: 'Hatsuzuki',
            img: '/azur/models_img/HatsuzukiSummerShipyardIcon.png',
        },
        {
            model: '/azur/models/dafeng_2/dafeng_2.model3.json',
            modelname: 'Taihou',
            modelid: '40',
            name: 'Taihou 1',
            img: '/azur/models_img/TaihouPartyShipyardIcon.png',
        },
        {
            model: '/azur/models/dafeng_2_hx/dafeng_2_hx.model3.json',
            modelname: 'Dafeng',
            modelid: '41',
            name: 'Dafeng 1 HX',
        },
        {
            model: '/azur/models/dafeng_3/dafeng_3.model3.json',
            modelname: 'Taihou',
            modelid: '42',
            name: 'Taihou 2',
            img: '/azur/models_img/TaihouSchoolShipyardIcon.png',
        },
        {
            model: '/azur/models/dafeng_4/dafeng_4.model3.json',
            modelname: 'Taihou',
            modelid: '43',
            name: 'Taihou 3',
            img: '/azur/models_img/TaihouSpringShipyardIcon.png',
        },
        {
            model: '/azur/models/dafeng_6/dafeng_6.model3.json',
            modelname: 'Taihou',
            modelid: '44',
            name: 'Taihou 4',
            img: '/azur/models_img/TaihouSummerShipyardIcon.png',
        },
        {
            model: '/azur/models/daofeng_4/daofeng_4.model3.json',
            modelname: 'Shimakaze',
            modelid: '45',
            name: 'Shimakaze 1',
            img: '/azur/models_img/ShimakazeBunnyShipyardIcon.png',
        },
        {
            model: '/azur/models/daofeng_5/daofeng_5.model3.json',
            modelname: 'Shimakaze',
            modelid: '46',
            name: 'Shimakaze 2',
            img: '/azur/models_img/ShimakazeFairy_TaleShipyardIcon.png',
        },
        {
            model: '/azur/models/daofeng_5_hx/daofeng_5_hx.model3.json',
            modelname: 'Daofeng',
            modelid: '47',
            name: 'Daofeng 2 HX',
        },
        {
            model: '/azur/models/dujiaoshou_4/dujiaoshou_4.model3.json',
            modelname: 'Unicorn',
            modelid: '48',
            name: 'Unicorn 1',
            img: '/azur/models_img/UnicornCasualShipyardIcon.png',
        },
        {
            model: '/azur/models/deyizhi_3/deyizhi_3.model3.json',
            modelname: 'Deutschland',
            modelid: '49',
            name: 'Deutschland',
            img: '/azur/models_img/DeutschlandSummerShipyardIcon.png',
        },
        {
            model: '/azur/models/biaoqiang/biaoqiang.model3.json',
            modelname: 'Javelin',
            modelid: '50',
            name: 'Javelin',
            img: '/azur/models_img/JavelinShipyardIcon.png',
        },
        {
            model: '/azur/models/dujiaoshou_6/dujiaoshou_6.model3.json',
            modelname: 'Unicorn',
            modelid: '51',
            name: 'Unicorn 2',
            img: '/azur/models_img/UnicornIdolShipyardIcon.png',
        },
        {
            model: '/azur/models/dunkeerke_2/dunkeerke_2.model3.json',
            modelname: 'Dunkerque',
            modelid: '52',
            name: 'Dunkerque',
            img: '/azur/models_img/DunkerqueSummerShipyardIcon.png',
        },
        {
            model: '/azur/models/edu_3/edu_3.model3.json',
            modelname: 'Le Malin',
            modelid: '53',
            name: 'Le Malin 1',
            img: '/azur/models_img/Le_MalinSummerShipyardIcon.png',
        },
        {
            model: '/azur/models/edu_3_hx/edu_3_hx.model3.json',
            modelname: 'Edu',
            modelid: '54',
            name: 'Edu 1 HX',
        },
        {
            model: '/azur/models/edu_4/edu_4.model3.json',
            modelname: 'Le Malin',
            modelid: '55',
            name: 'Le Malin 2',
            img: '/azur/models_img/Le_MalinBunnyShipyardIcon.png',
        },
        {
            model: '/azur/models/fengyun_4/fengyun_4.model3.json',
            modelname: 'Kazagumo',
            modelid: '56',
            name: 'Kazagumo',
            img: '/azur/models_img/KazagumoHome_RelaxationShipyardIcon.png',
        },
        {
            model: '/azur/models/geliqiya_2/geliqiya_2.model3.json',
            modelname: 'Gorizia',
            modelid: '57',
            name: 'Gorizia',
            img: '/azur/models_img/GoriziaWorkShipyardIcon.png',
        },
        {
            model: '/azur/models/genaisennao_2/genaisennao_2.model3.json',
            modelname: 'Gneisenau',
            modelid: '58',
            name: 'Gneisenau',
            img: '/azur/models_img/GneisenauHalloweenShipyardIcon.png',
        },
        {
            model: '/azur/models/guandao_2/guandao_2.model3.json',
            modelname: 'Guam',
            modelid: '59',
            name: 'Guam',
            img: '/azur/models_img/GuamBunnyShipyardIcon.png',
        },
        {
            model: '/azur/models/guangrong_3/guangrong_3.model3.json',
            modelname: 'Glorious',
            modelid: '60',
            name: 'Glorious',
            img: '/azur/models_img/GloriousSpringShipyardIcon.png',
        },
        {
            model: '/azur/models/hailunna_4/hailunna_4.model3.json',
            modelname: 'Helena',
            modelid: '61',
            name: 'Helena',
            img: '/azur/models_img/HelenaSummerShipyardIcon.png',
        },
        {
            model: '/azur/models/heitaizi_2/heitaizi_2.model3.json',
            modelname: 'Black Prince',
            modelid: '62',
            name: 'Black Prince',
            img: '/azur/models_img/Black_PrinceSummerShipyardIcon.png',
        },
        {
            model: '/azur/models/hemin_2/hemin_2.model3.json',
            modelname: 'Hermione',
            modelid: '63',
            name: 'Hermione 1',
            img: '/azur/models_img/HermioneSummerShipyardIcon.png',
        },
        {
            model: '/azur/models/hemin_3/hemin_3.model3.json',
            modelname: 'Hermione',
            modelid: '64',
            name: 'Hermione 2',
            img: '/azur/models_img/HermioneHospitalShipyardIcon.png',
        },
        {
            model: '/azur/models/huangjiafangzhou_3/huangjiafangzhou_3.model3.json',
            modelname: 'Ark Royal',
            modelid: '65',
            name: 'Ark Royal',
            img: '/azur/models_img/Ark_RoyalPartyShipyardIcon.png',
        },
        {
            model: '/azur/models/huonululu_3/huonululu_3.model3.json',
            modelname: 'Honolulu',
            modelid: '66',
            name: 'Honolulu 1',
            img: '/azur/models_img/HonoluluSummerShipyardIcon.png',
        },
        {
            model: '/azur/models/huonululu_5/huonululu_5.model3.json',
            modelname: 'Honolulu',
            modelid: '67',
            name: 'Honolulu 2',
            img: '/azur/models_img/HonoluluFestivalShipyardIcon.png',
        },
        {
            model: '/azur/models/jialisuoniye_3/jialisuoniye_3.model3.json',
            modelname: 'La Galissonnière',
            modelid: '68',
            name: 'La Galissonnière 1',
            img: '/azur/models_img/La_GalissonnièreHalloweenShipyardIcon.png',
        },
        {
            model: '/azur/models/jialisuoniye_3_hx/jialisuoniye_3_hx.model3.json',
            modelname: 'Jialisuoniye',
            modelid: '69',
            name: 'Jialisuoniye 1 HX',
        },
        {
            model: '/azur/models/jialisuoniye_4/jialisuoniye_4.model3.json',
            modelname: 'La Galissonnière',
            modelid: '70',
            name: 'La Galissonnière 2',
            img: '/azur/models_img/La_GalissonnièreSpringShipyardIcon.png',
        },
        {
            model: '/azur/models/jianye_2/jianye_2.model3.json',
            modelname: 'Kashino',
            modelid: '71',
            name: 'Kashino 1',
            img: '/azur/models_img/KashinoSummerShipyardIcon.png',
        },
        {
            model: '/azur/models/jianye_2_hx/jianye_2_hx.model3.json',
            modelname: 'Jianye',
            modelid: '72',
            name: 'Jianye 1 HX',
        },
        {
            model: '/azur/models/jianye_3/jianye_3.model3.json',
            modelname: 'Kashino',
            modelid: '73',
            name: 'Kashino 2',
            img: '/azur/models_img/KashinoMaidShipyardIcon.png',
        },
        {
            model: '/azur/models/jianye_4/jianye_4.model3.json',
            modelname: 'Kashino',
            modelid: '74',
            name: 'Kashino 3',
            img: '/azur/models_img/KashinoPartyShipyardIcon.png',
        },
        {
            model: '/azur/models/jiluofu_3/jiluofu_3.model3.json',
            modelname: 'Kirov',
            modelid: '75',
            name: 'Kirov',
            img: '/azur/models_img/KirovSpecial_ExerciseShipyardIcon.png',
        },
        {
            model: '/azur/models/jinluhao_2/jinluhao_2.model3.json',
            modelname: 'Golden Hind',
            modelid: '76',
            name: 'Golden Hind',
            img: '/azur/models_img/Golden_HindHalloweenShipyardIcon.png',
        },
        {
            model: '/azur/models/jiuyun_2/jiuyun_2.model3.json',
            modelname: 'Sakawa',
            modelid: '77',
            name: 'Sakawa',
            img: '/azur/models_img/SakawaMaidShipyardIcon.png',
        },
        {
            model: '/azur/models/junhe_4/junhe_4.model3.json',
            modelname: 'Suruga',
            modelid: '78',
            name: 'Suruga 1',
            img: '/azur/models_img/SurugaChristmasShipyardIcon.png',
        },
        {
            model: '/azur/models/junhe_5/junhe_5.model3.json',
            modelname: 'Suruga',
            modelid: '79',
            name: 'Suruga 2',
            img: '/azur/models_img/SurugaNew_YearShipyardIcon.png',
        },
        {
            model: '/azur/models/kalangshitade_2/kalangshitade_2.model3.json',
            modelname: 'Kronshtadt',
            modelid: '80',
            name: 'Kronshtadt',
            img: '/azur/models_img/KronshtadtSpecial_ExerciseShipyardIcon.png',
        },
        {
            model: '/azur/models/kalvbudisi_2/kalvbudisi_2.model3.json',
            modelname: 'Charybdis',
            modelid: '81',
            name: 'Charybdis',
            img: '/azur/models_img/CharybdisSpringShipyardIcon.png',
        },
        {
            model: '/azur/models/kelaimengsuo_2/kelaimengsuo_2.model3.json',
            modelname: 'Clemenceau',
            modelid: '82',
            name: 'Clemenceau',
            img: '/azur/models_img/ClemenceauSportShipyardIcon.png',
        },
        {
            model: '/azur/models/kelifulan_8/kelifulan_8.model3.json',
            modelname: 'Cleveland',
            modelid: '83',
            name: 'Cleveland',
            img: '/azur/models_img/ClevelandBunnyShipyardIcon.png',
        },
        {
            model: '/azur/models/kubo_2/kubo_2.model3.json',
            modelname: 'Cooper',
            modelid: '84',
            name: 'Cooper',
            img: '/azur/models_img/CooperSportShipyardIcon.png',
        },
        {
            model: '/azur/models/kuersike_2/kuersike_2.model3.json',
            modelname: 'Kursk',
            modelid: '85',
            name: 'Kursk',
            img: '/azur/models_img/KurskHot_SpringsShipyardIcon.png',
        },
        {
            model: '/azur/models/lafei/lafei.model3.json',
            modelname: 'Laffey',
            modelid: '86',
            name: 'Laffey 1',
            img: '/azur/models_img/LaffeyShipyardIcon.png',
        },
        {
            model: '/azur/models/lafei_4/lafei_4.model3.json',
            modelname: 'Laffey',
            modelid: '87',
            name: 'Laffey 2',
            img: '/azur/models_img/LaffeySpringShipyardIcon.png',
        },
        {
            model: '/azur/models/lafeiii_3/lafeiii_3.model3.json',
            modelname: 'Laffey II',
            modelid: '88',
            name: 'Laffey II',
            img: '/azur/models_img/Laffey_IIBunnyShipyardIcon.png',
        },
        {
            model: '/azur/models/lingbo/lingbo.model3.json',
            modelname: 'Ayanami',
            modelid: '89',
            name: 'Ayanami 1',
            img: '/azur/models_img/AyanamiShipyardIcon.png',
        },
        {
            model: '/azur/models/lingbo_10/lingbo_10.model3.json',
            modelname: 'Ayanami',
            modelid: '90',
            name: 'Ayanami 2',
            img: '/azur/models_img/AyanamiPartyShipyardIcon.png',
        },
        {
            model: '/azur/models/linuo_3/linuo_3.model3.json',
            modelname: 'Reno',
            modelid: '91',
            name: 'Reno',
            img: '/azur/models_img/RenoBunnyShipyardIcon.png',
        },
        {
            model: '/azur/models/linuo_3_hx/linuo_3_hx.model3.json',
            modelname: 'Linuo',
            modelid: '92',
            name: 'Linuo HX',
        },
        {
            model: '/azur/models/lisailiu_2/lisailiu_2.model3.json',
            modelname: 'Richelieu',
            modelid: '93',
            name: 'Richelieu 1',
            img: '/azur/models_img/RichelieuSummerShipyardIcon.png',
        },
        {
            model: '/azur/models/lisailiu_3/lisailiu_3.model3.json',
            modelname: 'Richelieu',
            modelid: '94',
            name: 'Richelieu 2',
            img: '/azur/models_img/RichelieuNew_YearShipyardIcon.png',
        },
        {
            model: '/azur/models/longwu_2/longwu_2.model3.json',
            modelname: 'Lung Wu',
            modelid: '95',
            name: 'Lung Wu',
            img: '/azur/models_img/Lung_WuSpringShipyardIcon.png',
        },
        {
            model: '/azur/models/luoen_4/luoen_4.model3.json',
            modelname: 'Roon',
            modelid: '96',
            name: 'Roon',
            img: '/azur/models_img/RoonSpringShipyardIcon.png',
        },
        {
            model: '/azur/models/luoma_2/luoma_2.model3.json',
            modelname: 'Roma',
            modelid: '97',
            name: 'Roma',
            img: '/azur/models_img/RomaDanceShipyardIcon.png',
        },
        {
            model: '/azur/models/lupuleixite_2/lupuleixite_2.model3.json',
            modelname: 'Prinz Rupprecht',
            modelid: '98',
            name: 'Prinz Rupprecht',
            img: '/azur/models_img/Prinz_RupprechtSpringShipyardIcon.png',
        },
        {
            model: '/azur/models/luyijiushi_2/luyijiushi_2.model3.json',
            modelname: 'Saint Louis',
            modelid: '99',
            name: 'Saint Louis',
            img: '/azur/models_img/Saint_LouisPartyShipyardIcon.png',
        },
        {
            model: '/azur/models/lvzuofu_2/lvzuofu_2.model3.json',
            modelname: 'Lützow',
            modelid: '100',
            name: 'Lützow',
            img: '/azur/models_img/LützowVampireShipyardIcon.png',
        },
        {
            model: '/azur/models/maliluosi_3_doa/maliluosi_3_doa.model3.json',
            modelname: 'Marie Rose',
            modelid: '101',
            name: 'Marie Rose',
            img: '/azur/models_img/Marie_RoseHot_SpringsShipyardIcon.png',
        },
        {
            model: '/azur/models/mingshi/mingshi.model3.json',
            modelname: 'Akashi',
            modelid: '102',
            name: 'Akashi',
            img: '/azur/models_img/AkashiShipyardIcon.png',
        },
        {
            model: '/azur/models/mojiaduoer_2/mojiaduoer_2.model3.json',
            modelname: 'Mogador',
            modelid: '103',
            name: 'Mogador',
            img: '/azur/models_img/MogadorSummerShipyardIcon.png',
        },
        {
            model: '/azur/models/nengdai_2/nengdai_2.model3.json',
            modelname: 'Noshiro',
            modelid: '104',
            name: 'Noshiro',
            img: '/azur/models_img/NoshiroNew_YearShipyardIcon.png',
        },
        {
            model: '/azur/models/ninghai_4/ninghai_4.model3.json',
            modelname: 'Ning Hai',
            modelid: '105',
            name: 'Ning Hai',
            img: '/azur/models_img/Ning_HaiIdolShipyardIcon.png',
        },
        {
            model: '/azur/models/ougen_5/ougen_5.model3.json',
            modelname: 'Prinz Eugen',
            modelid: '106',
            name: 'Prinz Eugen 1',
            img: '/azur/models_img/Prinz_EugenRaceQueenShipyardIcon.png',
        },
        {
            model: '/azur/models/ougen_6/ougen_6.model3.json',
            modelname: 'Prinz Eugen',
            modelid: '107',
            name: 'Prinz Eugen 2',
            img: '/azur/models_img/Prinz_EugenMaidShipyardIcon.png',
        },
        {
            model: '/azur/models/ougen_6_hx/ougen_6_hx.model3.json',
            modelname: 'Ougen 6 Hx',
            modelid: '108',
            name: 'Ougen 6 Hx',
        },
        {
            model: '/azur/models/ouruola_4/ouruola_4.model3.json',
            modelname: 'Aurora',
            modelid: '109',
            name: 'Aurora',
            img: '/azur/models_img/AuroraCollabShipyardIcon.png',
        },
        {
            model: '/azur/models/pinghai_4/pinghai_4.model3.json',
            modelname: 'Ping Hai',
            modelid: '110',
            name: 'Ping Hai',
            img: '/azur/models_img/Ping_HaiIdolShipyardIcon.png',
        },
        // {
        //     model: '/azur/models/pinghai_6/pinghai_6.model3.json',
        //     modelname: 'Pinghai 6',
        //     modelid: '111',
        //     name: 'Pinghai 6'
        // },
        {
            model: '/azur/models/qianwei_2/qianwei_2.model3.json',
            modelname: 'Vanguard',
            modelid: '112',
            name: 'Vanguard',
            img: '/azur/models_img/VanguardMaidShipyardIcon.png',
        },
        {
            model: '/azur/models/qibolin_2/qibolin_2.model3.json',
            modelname: 'Graf Zeppelin',
            modelid: '113',
            name: 'Graf Zeppelin',
            img: '/azur/models_img/Graf_ZeppelinSummerShipyardIcon.png',
        },
        {
            model: '/azur/models/qiershazhi_2/qiershazhi_2.model3.json',
            modelname: 'Kearsarge',
            modelid: '114',
            name: 'Kearsarge',
            img: '/azur/models_img/KearsargeBunnyShipyardIcon.png',
        },
        {
            model: '/azur/models/qiye_7/qiye_7.model3.json',
            modelname: 'Enterprise',
            modelid: '115',
            name: 'Enterprise 1',
            img: '/azur/models_img/EnterpriseRaceQueenShipyardIcon.png',
        },
        {
            model: '/azur/models/qiye_7_hx/qiye_7_hx.model3.json',
            modelname: 'Qiye 7 Hx',
            modelid: '116',
            name: 'Qiye 7 Hx',
        },
        {
            model: '/azur/models/qiye_9/qiye_9.model3.json',
            modelname: 'Enterprise',
            modelid: '117',
            name: 'Enterprise 2',
            img: '/azur/models_img/EnterpriseSummerShipyardIcon.png',
        },
        {
            model: '/azur/models/rangbaer_3/rangbaer_3.model3.json',
            modelname: 'Jean Bart',
            modelid: '118',
            name: 'Jean Bart 1',
            img: '/azur/models_img/Jean_BartSummerShipyardIcon.png',
        },
        {
            model: '/azur/models/rangbaer_4/rangbaer_4.model3.json',
            modelname: 'Jean Bart',
            modelid: '119',
            name: 'Jean Bart 2',
            img: '/azur/models_img/Jean_BartNew_YearShipyardIcon.png',
        },
        // {
        //     model: '/azur/models/shengluyisi_2/shengluyisi_2.model3.json',
        //     modelname: 'Shengluyisi 2',
        //     modelid: '120',
        //     name: 'Shengluyisi 2'
        // },
        // {
        //     model: '/azur/models/shengluyisi_2_hx/shengluyisi_2_hx.model3.json',
        //     modelname: 'Shengluyisi 2 Hx',
        //     modelid: '121',
        //     name: 'Shengluyisi 2 Hx'
        // },
        {
            model: '/azur/models/shengluyisi_3/shengluyisi_3.model3.json',
            modelname: 'St. Louis',
            modelid: '122',
            name: 'St. Louis 1',
            img: '/azur/models_img/St._LouisNew_YearShipyardIcon.png',
        },
        {
            model: '/azur/models/shengluyisi_4/shengluyisi_4.model3.json',
            modelname: 'St. Louis',
            modelid: '123',
            name: 'St. Louis 2',
            img: '/azur/models_img/St._LouisPartyShipyardIcon.png',
        },
        {
            model: '/azur/models/shengluyisi_5/shengluyisi_5.model3.json',
            modelname: 'St. Louis',
            modelid: '124',
            name: 'St. Louis 3',
            img: '/azur/models_img/St._LouisSummerShipyardIcon.png',
        },
        {
            model: '/azur/models/shitelasai_2/shitelasai_2.model3.json',
            modelname: 'Peter Strasser',
            modelid: '125',
            name: 'Peter Strasser',
            img: '/azur/models_img/Peter_StrasserNew_YearShipyardIcon.png',
        },
        {
            model: '/azur/models/sipeibojue_5/sipeibojue_5.model3.json',
            modelname: 'Admiral Graf Spee',
            modelid: '126',
            name: 'Admiral Graf Spee',
            img: '/azur/models_img/Admiral_Graf_SpeeIdolShipyardIcon.png',
        },
        {
            model: '/azur/models/suweiaitongmeng_2/suweiaitongmeng_2.model3.json',
            modelname: 'Sovetsky Soyuz',
            modelid: '127',
            name: 'Sovetsky Soyuz',
            img: '/azur/models_img/Sovetsky_SoyuzSpecial_ExerciseShipyardIcon.png',
        },
        {
            model: '/azur/models/taiyuan_2/taiyuan_2.model3.json',
            modelname: 'Tai Yuan',
            modelid: '128',
            name: 'Tai Yuan',
            img: '/azur/models_img/Tai_YuanSpringShipyardIcon.png',
        },
        {
            model: '/azur/models/tiancheng_3/tiancheng_3.model3.json',
            modelname: 'Amagi',
            modelid: '129',
            name: 'Amagi',
            img: '/azur/models_img/AmagiPartyShipyardIcon.png',
        },
        {
            model: '/azur/models/tianlangxing_3/tianlangxing_3.model3.json',
            modelname: 'Sirius',
            modelid: '130',
            name: 'Sirius',
            img: '/azur/models_img/SiriusSummerShipyardIcon.png',
        },
        {
            model: '/azur/models/tierbici_2/tierbici_2.model3.json',
            modelname: 'Tirpitz',
            modelid: '131',
            name: 'Tirpitz',
            img: '/azur/models_img/TirpitzSummerShipyardIcon.png',
        },
        {
            model: '/azur/models/weineituo_2/weineituo_2.model3.json',
            modelname: 'Vittorio Veneto',
            modelid: '132',
            name: 'Vittorio Veneto',
            img: '/azur/models_img/Vittorio_VenetoSummerShipyardIcon.png',
        },
        {
            model: '/azur/models/weixi_2/weixi_2.model3.json',
            modelname: 'Weser',
            modelid: '133',
            name: 'Weser',
            img: '/azur/models_img/WeserPartyShipyardIcon.png',
        },
        {
            model: '/azur/models/weiyan_2/weiyan_2.model3.json',
            modelname: 'Grozny',
            modelid: '134',
            name: 'Grozny 1',
            img: '/azur/models_img/GroznyPrisonShipyardIcon.png',
        },
        {
            model: '/azur/models/weiyan_4_hx/weiyan_4_hx.model3.json',
            modelname: 'Grozny',
            modelid: '135',
            name: 'Grozny 2 Hx',
            img: '/azur/models_img/GroznySpecial_ExerciseShipyardIcon.png',
        },
        {
            model: '/azur/models/weiyan_6/weiyan_6.model3.json',
            modelname: 'Grozny',
            modelid: '136',
            name: 'Grozny 3',
            img: '/azur/models_img/GroznyHot_SpringsShipyardIcon.png',
        },
        {
            model: '/azur/models/wuerlixi_2/wuerlixi_2.model3.json',
            modelname: 'Ulrich von Hutten',
            modelid: '137',
            name: 'Ulrich von Hutten 1',
            img: '/azur/models_img/Ulrich_von_HuttenMaidShipyardIcon.png',
        },
        {
            model: '/azur/models/wuerlixi_3/wuerlixi_3.model3.json',
            modelname: 'Ulrich von Hutten',
            modelid: '138',
            name: 'Ulrich von Hutten 2',
            img: '/azur/models_img/Ulrich_von_HuttenRaceQueenShipyardIcon.png',
        },
        {
            model: '/azur/models/wuqi_2/wuqi_2.model3.json',
            modelname: 'Azuma',
            modelid: '139',
            name: 'Azuma',
            img: '/azur/models_img/AzumaSpringShipyardIcon.png',
        },
        {
            model: '/azur/models/xianghe_2/xianghe_2.model3.json',
            modelname: 'Shoukaku',
            modelid: '140',
            name: 'Shoukaku',
            img: '/azur/models_img/ShoukakuPartyShipyardIcon.png',
        },
        {
            model: '/azur/models/xingdengbao_2/xingdengbao_2.model3.json',
            modelname: 'Hindenburg',
            modelid: '141',
            name: 'Hindenburg',
            img: '/azur/models_img/HindenburgBunnyShipyardIcon.png',
        },
        {
            model: '/azur/models/xinnong_3/xinnong_3.model3.json',
            modelname: 'Shinano',
            modelid: '142',
            name: 'Shinano 1',
            img: '/azur/models_img/ShinanoRaceQueenShipyardIcon.png',
        },
        {
            model: '/azur/models/xinnong_3_hx/xinnong_3_hx.model3.json',
            modelname: 'Xinnong 3 Hx',
            modelid: '143',
            name: 'Xinnong 3 Hx',
        },
        {
            model: '/azur/models/xinnong_4/xinnong_4.model3.json',
            modelname: 'Shinano',
            modelid: '144',
            name: 'Shinano 2',
            img: '/azur/models_img/ShinanoSummerShipyardIcon.png',
        },
        {
            model: '/azur/models/xinzexi_3/xinzexi_3.model3.json',
            modelname: 'New Jersey',
            modelid: '145',
            name: 'New Jersey',
            img: '/azur/models_img/New_JerseySummerShipyardIcon.png',
        },
        {
            model: '/azur/models/xixuegui_4/xixuegui_4.model3.json',
            modelname: 'Vampire',
            modelid: '146',
            name: 'Vampire',
            img: '/azur/models_img/VampireFestivalShipyardIcon.png',
        },
        {
            model: '/azur/models/xuefeng/xuefeng.model3.json',
            modelname: 'Yukikaze',
            modelid: '147',
            name: 'Yukikaze 1',
            img: '/azur/models_img/YukikazeShipyardIcon.png',
        },
        {
            model: '/azur/models/xuefeng_3/xuefeng_3.model3.json',
            modelname: 'Yukikaze',
            modelid: '148',
            name: 'Yukikaze 2',
            img: '/azur/models_img/YukikazeSpringShipyardIcon.png',
        },
        {
            model: '/azur/models/xukufu_2/xukufu_2.model3.json',
            modelname: 'Surcouf',
            modelid: '149',
            name: 'Surcouf 1',
            img: '/azur/models_img/SurcoufCasualShipyardIcon.png',
        },
        {
            model: '/azur/models/xukufu_3/xukufu_3.model3.json',
            modelname: 'Surcouf',
            modelid: '150',
            name: 'Surcouf 2',
            img: '/azur/models_img/SurcoufSummerShipyardIcon.png',
        },
        {
            model: '/azur/models/xukufu_3_hx/xukufu_3_hx.model3.json',
            modelname: 'Xukufu 3 Hx',
            modelid: '151',
            name: 'Xukufu 3 Hx',
        },
        {
            model: '/azur/models/yanusi_3/yanusi_3.model3.json',
            modelname: 'Janus',
            modelid: '152',
            name: 'Janus',
            img: '/azur/models_img/JanusHalloweenShipyardIcon.png',
        },
        {
            model: '/azur/models/yibei_3/yibei_3.model3.json',
            modelname: 'Elbe',
            modelid: '153',
            name: 'Elbe',
            img: '/azur/models_img/ElbeCasualShipyardIcon.png',
        },
        {
            model: '/azur/models/yichui_2/yichui_2.model3.json',
            modelname: 'Ibuki',
            modelid: '154',
            name: 'Ibuki',
            img: '/azur/models_img/IbukiNew_YearShipyardIcon.png',
        },
        {
            model: '/azur/models/yilishabai_6/yilishabai_6.model3.json',
            modelname: 'Queen Elizabeth',
            modelid: '155',
            name: 'Queen Elizabeth',
            img: '/azur/models_img/Queen_ElizabethMaidShipyardIcon.png',
        },
        {
            model: '/azur/models/yingrui_3/yingrui_3.model3.json',
            modelname: 'Ying Swei',
            modelid: '156',
            name: 'Ying Swei',
            img: '/azur/models_img/Ying_SweiSpring2ShipyardIcon.png',
        },
        {
            model: '/azur/models/yingxianzuo_3/yingxianzuo_3.model3.json',
            modelname: 'Perseus',
            modelid: '157',
            name: 'Perseus',
            img: '/azur/models_img/PerseusSpringShipyardIcon.png',
        },
        {
            model: '/azur/models/yunxian_2/yunxian_2.model3.json',
            modelname: 'Unzen',
            modelid: '158',
            name: 'Unzen',
            img: '/azur/models_img/UnzenSummerShipyardIcon.png',
        },
        {
            model: '/azur/models/z23/z23.model3.json',
            modelname: 'Z23',
            modelid: '159',
            name: 'Z23',
            img: '/azur/models_img/Z23ShipyardIcon.png',
        },
        {
            model: '/azur/models/z23_hx/z23_hx.model3.json',
            modelname: 'Z23 Hx',
            modelid: '160',
            name: 'Z23 Hx',
        },
        {
            model: '/azur/models/z46_2/z46_2.model3.json',
            modelname: 'Z46',
            modelid: '161',
            name: 'Z46 1',
            img: '/azur/models_img/Z46SummerShipyardIcon.png',
        },
        {
            model: '/azur/models/z46_3/z46_3.model3.json',
            modelname: 'Z46',
            modelid: '162',
            name: 'Z46 2',
            img: '/azur/models_img/Z46SportShipyardIcon.png',
        },
        {
            model: '/azur/models/z46_4/z46_4.model3.json',
            modelname: 'Z46',
            modelid: '163',
            name: 'Z46 3',
            img: '/azur/models_img/Z46IdolShipyardIcon.png',
        },
        // {
        //     model: '/azur/models/zhala_2/zhala_2.model3.json',
        //     modelname: 'Zhala 2',
        //     modelid: '164',
        //     name: 'Zhala 2'
        // },
        {
            model: '/azur/models/zhaohe_3/zhaohe_3.model3.json',
            modelname: 'Chao Ho',
            modelid: '165',
            name: 'Chao Ho',
            img: '/azur/models_img/Chao_HoSpring2ShipyardIcon.png',
        },
    ],
}

export default modelData

type azurResult = {
    setX: number
    setY: number
    setScale: number
}

export function azur(id: number): azurResult {
    let setY: number
    let setX: number
    let setScale: number

    switch (id) {
        case 1:
            setY = 28
            setX = -125
            setScale = 0.1
            break
        case 2:
            setY = 28
            setX = -125
            setScale = 0.1
            break
        case 3:
            setY = -89
            setX = -200
            setScale = 0.1
            break
        case 4:
            setY = -113
            setX = -233
            setScale = 0.1
            break
        case 5:
            setY = -145
            setX = -264
            setScale = 0.1
            break
        case 6:
            setY = 83
            setX = -90
            setScale = 0.1
            break
        case 7:
            setY = 35
            setX = -170
            setScale = 0.1
            break
        case 8:
            setY = -50
            setX = -162
            setScale = 0.1
            break
        case 9:
            setY = -193
            setX = -293
            setScale = 0.1
            break
        case 10:
            setY = -193
            setX = -293
            setScale = 0.1
            break
        case 11:
            setY = 23
            setX = -177
            setScale = 0.1
            break
        case 12:
            setY = 105
            setX = -9
            setScale = 0.13
            break
        case 13:
            setY = -197
            setX = -275
            setScale = 0.15
            break
        case 14:
            setY = -197
            setX = -275
            setScale = 0.15
            break
        case 15:
            setY = -146
            setX = -236
            setScale = 0.1
            break
        case 16:
            setY = -7
            setX = -288
            setScale = 0.1
            break
        case 17:
            setY = -7
            setX = -288
            setScale = 0.1
            break
        case 18:
            setY = -246
            setX = -295
            setScale = 0.1
            break
        case 19:
            setY = -11
            setX = -155
            setScale = 0.1
            break
        case 20:
            setY = -81
            setX = -239
            setScale = 0.1
            break
        case 21:
            setY = -95
            setX = -179
            setScale = 0.1
            break
        case 22:
            setY = -3
            setX = -124
            setScale = 0.17
            break
        case 23:
            setY = -94
            setX = -273
            setScale = 0.1
            break
        case 24:
            setY = -39
            setX = -181
            setScale = 0.1
            break
        case 25:
            setY = -80
            setX = -209
            setScale = 0.1
            break
        case 26:
            setY = -80
            setX = -209
            setScale = 0.1
            break
        case 27:
            setY = -96
            setX = -268
            setScale = 0.1
            break
        case 28:
            setY = -104
            setX = -220
            setScale = 0.1
            break
        case 29:
            setY = 11
            setX = -203
            setScale = 0.1
            break
        case 30:
            setY = -94
            setX = -154
            setScale = 0.1
            break
        case 31:
            setY = -94
            setX = -154
            setScale = 0.1
            break
        case 32:
            setY = -76
            setX = -150
            setScale = 0.1
            break
        case 33:
            setY = -119
            setX = -225
            setScale = 0.1
            break
        case 34:
            setY = -35
            setX = -225
            setScale = 0.08
            break
        case 35:
            setY = -378
            setX = -540
            setScale = 0.08
            break
        case 36:
            setY = -378
            setX = -540
            setScale = 0.08
            break
        case 37:
            setY = -218
            setX = -237
            setScale = 0.1
            break
        case 38:
            setY = 25
            setX = -38
            setScale = 0.1
            break
        case 39:
            setY = -70
            setX = -164
            setScale = 0.08
            break
        case 40:
            setY = -52
            setX = -152
            setScale = 0.1
            break
        case 41:
            setY = -52
            setX = -152
            setScale = 0.1
            break
        case 42:
            setY = -24
            setX = -98
            setScale = 0.1
            break
        case 43:
            setY = -33
            setX = -145
            setScale = 0.1
            break
        case 44:
            setY = -113
            setX = -144
            setScale = 0.1
            break
        case 45:
            setY = -14
            setX = -230
            setScale = 0.12
            break
        case 46:
            setY = -54
            setX = -185
            setScale = 0.12
            break
        case 47:
            setY = -54
            setX = -185
            setScale = 0.12
            break
        case 48:
            setY = 3
            setX = -146
            setScale = 0.12
            break
        case 49:
            setY = 77
            setX = -45
            setScale = 0.15
            break
        case 50:
            setY = 10
            setX = -117
            setScale = 0.5
            break
        case 51:
            setY = -156
            setX = -269
            setScale = 0.1
            break
        case 52:
            setY = -8
            setX = -154
            setScale = 0.08
            break
        case 53:
            setY = 18
            setX = -206
            setScale = 0.1
            break
        case 54:
            setY = 18
            setX = -206
            setScale = 0.1
            break
        case 55:
            setY = -81
            setX = -308
            setScale = 0.1
            break
        case 56:
            setY = -161
            setX = -336
            setScale = 0.1
            break
        case 57:
            setY = -129
            setX = -277
            setScale = 0.08
            break
        case 58:
            setY = -93
            setX = -212
            setScale = 0.11
            break
        case 59:
            setY = -207
            setX = -380
            setScale = 0.15
            break
        case 60:
            setY = -96
            setX = -213
            setScale = 0.1
            break
        case 61:
            setY = -103
            setX = -124
            setScale = 0.1
            break
        case 62:
            setY = 37
            setX = -72
            setScale = 0.1
            break
        case 63:
            setY = -19
            setX = -96
            setScale = 0.15
            break
        case 64:
            setY = -70
            setX = -166
            setScale = 0.1
            break
        case 65:
            setY = -40
            setX = -165
            setScale = 0.25
            break
        case 66:
            setY = -33
            setX = -162
            setScale = 0.12
            break
        case 67:
            setY = -152
            setX = -282
            setScale = 0.2
            break
        case 68:
            setY = -15
            setX = -305
            setScale = 0.1
            break
        case 69:
            setY = -15
            setX = -305
            setScale = 0.1
            break
        case 70:
            setY = -81
            setX = -237
            setScale = 0.1
            break
        case 71:
            setY = -241
            setX = -241
            setScale = 0.1
            break
        case 72:
            setY = -241
            setX = -241
            setScale = 0.1
            break
        case 73:
            setY = -131
            setX = -218
            setScale = 0.09
            break
        case 74:
            setY = -265
            setX = -435
            setScale = 0.1
            break
        case 75:
            setY = -64
            setX = -227
            setScale = 0.11
            break
        case 76:
            setY = -27
            setX = -236
            setScale = 0.1
            break
        case 77:
            setY = -218
            setX = -185
            setScale = 0.13
            break
        case 78:
            setY = -19
            setX = -184
            setScale = 0.1
            break
        case 79:
            setY = -23
            setX = -199
            setScale = 0.09
            break
        case 80:
            setY = 37
            setX = -199
            setScale = 0.09
            break
        case 81:
            setY = -99
            setX = -130
            setScale = 0.1
            break
        case 82:
            setY = -96
            setX = -174
            setScale = 0.1
            break
        case 83:
            setY = -43
            setX = -138
            setScale = 0.08
            break
        case 84:
            setY = -54
            setX = -181
            setScale = 0.1
            break
        case 85:
            setY = -237
            setX = -198
            setScale = 0.1
            break
        case 86:
            setY = 6
            setX = -116
            setScale = 0.5
            break
        case 87:
            setY = -19
            setX = -214
            setScale = 0.1
            break
        case 88:
            setY = -101
            setX = -215
            setScale = 0.1
            break
        case 89:
            setY = 6
            setX = -113
            setScale = 0.5
            break
        case 90:
            setY = -149
            setX = -309
            setScale = 0.12
            break
        case 91:
            setY = -18
            setX = -59
            setScale = 0.1
            break
        case 92:
            setY = -18
            setX = -59
            setScale = 0.1
            break
        case 93:
            setY = -243
            setX = -315
            setScale = 0.1
            break
        case 94:
            setY = -87
            setX = -70
            setScale = 0.1
            break
        case 95:
            setY = -168
            setX = -178
            setScale = 0.1
            break
        case 96:
            setY = -42
            setX = -213
            setScale = 0.1
            break
        case 97:
            setY = -57
            setX = -154
            setScale = 0.1
            break
        case 98:
            setY = -133
            setX = -230
            setScale = 0.1
            break
        case 99:
            setY = -180
            setX = -116
            setScale = 0.1
            break
        case 100:
            setY = -102
            setX = -135
            setScale = 0.1
            break
        case 101:
            setY = -72
            setX = -121
            setScale = 0.08
            break
        case 102:
            setY = -11
            setX = -119
            setScale = 0.5
            break
        case 103:
            setY = -133
            setX = -191
            setScale = 0.1
            break
        case 104:
            setY = -157
            setX = -127
            setScale = 0.1
            break
        case 105:
            setY = 31
            setX = -134
            setScale = 0.15
            break
        case 106:
            setY = -218
            setX = -240
            setScale = 0.1
            break
        case 107:
            setY = -196
            setX = -236
            setScale = 0.1
            break
        case 108:
            setY = -196
            setX = -236
            setScale = 0.1
            break
        case 109:
            setY = -1
            setX = -108
            setScale = 0.1
            break
        case 110:
            setY = 3
            setX = -344
            setScale = 0.15
            break
        case 111:
            setY = -7
            setX = -109
            setScale = 0.12
            break
        case 112:
            setY = 4
            setX = -68
            setScale = 0.1
            break
        case 113:
            setY = 54
            setX = -61
            setScale = 0.17
            break
        case 114:
            setY = -224
            setX = -346
            setScale = 0.1
            break
        case 115:
            setY = -91
            setX = -356
            setScale = 0.1
            break
        case 116:
            setY = -91
            setX = -356
            setScale = 0.1
            break
        case 117:
            setY = -165
            setX = -242
            setScale = 0.1
            break
        case 118:
            setY = -148
            setX = -375
            setScale = 0.1
            break
        case 119:
            setY = 79
            setX = -73
            setScale = 0.1
            break
        case 120:
            setY = 28
            setX = -120
            setScale = 0.22
            break
        case 121:
            setY = 28
            setX = -120
            setScale = 0.22
            break
        case 122:
            setY = -13
            setX = -138
            setScale = 0.1
            break
        case 123:
            setY = -26
            setX = -12
            setScale = 0.1
            break
        case 124:
            setY = -80
            setX = -171
            setScale = 0.1
            break
        case 125:
            setY = -376
            setX = -299
            setScale = 0.1
            break
        case 126:
            setY = -28
            setX = -158
            setScale = 0.1
            break
        case 127:
            setY = -62
            setX = -184
            setScale = 0.1
            break
        case 128:
            setY = -8
            setX = -205
            setScale = 0.15
            break
        case 129:
            setY = -13
            setX = -224
            setScale = 0.1
            break
        case 130:
            setY = 24
            setX = -141
            setScale = 0.1
            break
        case 131:
            setY = -43
            setX = -248
            setScale = 0.4
            break
        case 132:
            setY = -89
            setX = -150
            setScale = 0.1
            break
        case 133:
            setY = -333
            setX = -366
            setScale = 0.1
            break
        case 134:
            setY = 25
            setX = -136
            setScale = 0.12
            break
        case 135:
            setY = -80
            setX = -219
            setScale = 0.1
            break
        case 136:
            setY = -9
            setX = -211
            setScale = 0.1
            break
        case 137:
            setY = -105
            setX = -110
            setScale = 0.1
            break
        case 138:
            setY = -15
            setX = -189
            setScale = 0.1
            break
        case 139:
            setY = -68
            setX = -289
            setScale = 0.1
            break
        case 140:
            setY = -116
            setX = -183
            setScale = 0.1
            break
        case 141:
            setY = -105
            setX = -221
            setScale = 0.1
            break
        case 142:
            setY = -66
            setX = -184
            setScale = 0.1
            break
        case 143:
            setY = -66
            setX = -184
            setScale = 0.1
            break
        case 144:
            setY = -44
            setX = -127
            setScale = 0.08
            break
        case 145:
            setY = -155
            setX = -191
            setScale = 0.1
            break
        case 146:
            setY = 5
            setX = -57
            setScale = 0.12
            break
        case 147:
            setY = -3
            setX = -120
            setScale = 0.5
            break
        case 148:
            setY = -5
            setX = -140
            setScale = 0.14
            break
        case 149:
            setY = -15
            setX = -189
            setScale = 0.1
            break
        case 150:
            setY = -118
            setX = -128
            setScale = 0.1
            break
        case 151:
            setY = -118
            setX = -128
            setScale = 0.1
            break
        case 152:
            setY = 5
            setX = -104
            setScale = 0.12
            break
        case 153:
            setY = -18
            setX = -173
            setScale = 0.1
            break
        case 154:
            setY = -26
            setX = -176
            setScale = 0.1
            break
        case 155:
            setY = -30
            setX = -80
            setScale = 0.11
            break
        case 156:
            setY = -145
            setX = -175
            setScale = 0.1
            break
        case 157:
            setY = -105
            setX = -277
            setScale = 0.1
            break
        case 158:
            setY = -167
            setX = -205
            setScale = 0.1
            break
        case 159:
            setY = 0
            setX = -112
            setScale = 0.5
            break
        case 160:
            setY = 0
            setX = -112
            setScale = 0.5
            break
        case 161:
            setY = 25
            setX = -76
            setScale = 0.2
            break
        case 162:
            setY = -44
            setX = -145
            setScale = 0.1
            break
        case 163:
            setY = -4
            setX = -180
            setScale = 0.1
            break
        case 164:
            setY = -4
            setX = -180
            setScale = 0.1
            break
        case 165:
            setY = -343
            setX = -202
            setScale = 0.1
            break
        default:
            setY = 0
            setX = 0
            setScale = 0.1
            break
    }

    return { setX, setY, setScale }
}
