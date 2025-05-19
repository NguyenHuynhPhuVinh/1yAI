// ******************************************************************************************
// Mod Name: AllconsolesII65
// Mod Id: AllconsolesII65_UME
// Mod Version: 0.6.5
// Mod File: code.js
// ******************************************************************************************
// Author: UME
// Last modified: 2025-03-21
// ******************************************************************************************
// Notes: This file is loaded from main.js
// ******************************************************************************************

// Create the main mod object (our package)
var AllconsolesII65 = {};

(function(){

// ******************************************************************************************
// Platforms
// ******************************************************************************************

// Adding Satellaview 
// -----------------------------------------------------------
GDT.addPlatform({
	id:"db27f8a1-120a-4d5d-9ae5-8db16ab99261",
	name:"Satellaview",
	company:"Nintendo",
	startAmount:0.005,
	unitsSold:0.006,
	licencePrize:2E4,
	published:"8/4/4",
	platformRetireDate:"11/6/3",
	developmentCosts:1E4,
	genreWeightings:[  0.8, 1, 0.9, 0.8, 1, 0.8 ],
	audienceWeightings:[  0.8, 0.9, 1 ],
	techLevel:2,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/220px-Satellaview_with_Super_Famicom.png",
	events:null
	});

// Adding 32X
// -----------------------------------------------------------
GDT.addPlatform({
	id:"b7d078e3-d11e-4730-801d-a31266ff1782",
	name:"32X",
	company:"Sega",
	startAmount:0.019,
	unitsSold:0.022,
	licencePrize:2E4,
	published:"7/6/2",
	platformRetireDate:"9/3/4",
	developmentCosts:1E4,
	genreWeightings:[  1, 0.7, 0.7, 0.9, 1, 0.8 ],
	audienceWeightings:[  0.7, 0.9, 1 ],
	techLevel:3,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/Sega-Genesis-Model2-32X.png",
	events:null
	});

// Adding Neo Geo CD
// -----------------------------------------------------------
GDT.addPlatform({
	id:"52a3583a-2daa-4018-8ce2-4cff72094846",
	name:"Neo Geo CD",
	company:"SNK",
	startAmount:0.015,
	unitsSold:0.0162,
	licencePrize:2E4,
	published:"7/5/3",
	platformRetireDate:"9/12/3",
	developmentCosts:1E4,
	genreWeightings:[  0.7, 0.9, 1, 1, 0.7, 1 ],
	audienceWeightings:[  1, 0.8, 0.7 ],
	techLevel:3,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/640px-Neo-Geo-CD-TopLoader-wController-FL.png",
	events:null
	});

// Adding Picno
// -----------------------------------------------------------
GDT.addPlatform({
	id:"a1afb7cd-e11f-4d88-9bd5-652f7e77ac14",
	name:"Picno",
	company:"Konami",
	startAmount:0.004,
	unitsSold:0.005,
	licencePrize:2E4,
	published:"6/5/2",
	platformRetireDate:"7/12/4",
	developmentCosts:1E4,
	genreWeightings:[  0.6, 0.7, 0.8, 0.7, 0.8, 1 ],
	audienceWeightings:[  1, 0.7, 0.6 ],
	techLevel:2,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/th5SK9ELHC.png",
	events:null
	});

// Adding Video Information System
// -----------------------------------------------------------
GDT.addPlatform({
	id:"ad56b057-3bf7-45e0-ae95-4934e76cbdad",
	name:"Video Information System",
	company:"Radio Shack",
	startAmount:0.00027,
	unitsSold:0.0003,
	licencePrize:2E4,
	published:"6/6/1",
	platformRetireDate:"7/7/3",
	developmentCosts:1E4,
	genreWeightings:[  0.7, 0.9, 0.8, 0.9, 0.9, 0.9 ],
	audienceWeightings:[  1, 0.8, 0.7 ],
	techLevel:2,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/thY2G2DTV0.png",
	events:null
	});

// Adding Sega CD
// -----------------------------------------------------------
GDT.addPlatform({
	id:"9305bdff-e043-4469-aea9-b69af8e263b2",
	name:"Sega CD",
	company:"Sega",
	startAmount:0.05,
	unitsSold:0.0589,
	licencePrize:2E4,
	published:"5/11/4",
	platformRetireDate:"8/9/3",
	developmentCosts:1E4,
	genreWeightings:[  1, 0.8, 0.9, 0.9, 0.8, 0.7 ],
	audienceWeightings:[  0.7, 0.9, 1 ],
	techLevel:3,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/634px-Sega-CD-Model1-Set-removebg-preview.png",
	events:null
	});

// Adding Nuon 
// -----------------------------------------------------------
GDT.addPlatform({
	id:"e30dce0f-80c1-4730-95d7-c92b2a55df9c",
	name:"Nuon",
	company:"VM Labs",
	startAmount:0.00022,
	unitsSold:0.0012,
	licencePrize:1E5,
	published:"11/7/2",
	platformRetireDate:"13/4/1",
	developmentCosts:5E4,
	genreWeightings:[  0.6, 0.6, 0.7, 1, 0.8, 0.9 ],
	audienceWeightings:[  0.7, 0.8, 1 ],
	techLevel:4,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/640px-Nuon-N2000-wController-L.png",
	events:null
	});

// Adding Casio Loppy
// -----------------------------------------------------------
GDT.addPlatform({
	id:"e8e9d16f-69fc-4f4a-8a7f-4bbd24a66fc4",
	name:"Casio Loppy",
	company:"Casio",
	startAmount:0.00025,
	unitsSold:0.00028,
	licencePrize:2E4,
	published:"8/6/3",
	platformRetireDate:"10/9/4",
	developmentCosts:1E4,
	genreWeightings:[  0.6, 0.8, 0.9, 0.7, 0.8, 1 ],
	audienceWeightings:[  1, 0.8, 0.9 ],
	techLevel:3,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/640px-Casio-Loopy-Console-Set.png",
	events:null
	});

// Adding Playdia
// -----------------------------------------------------------
GDT.addPlatform({
	id:"ad1979a8-a6e0-441a-9140-f9e0917071c1",
	name:"Playdia",
	company:"Bandai",
	startAmount:0.008,
	unitsSold:0.0085,
	licencePrize:2E4,
	published:"7/5/1",
	platformRetireDate:"8/12/4",
	developmentCosts:1E4,
	genreWeightings:[  0.8, 0.9, 0.8, 0.6, 1, 0.8 ],
	audienceWeightings:[  1, 0.8, 0.6 ],
	techLevel:1,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/Bandai-Playdia-Set-R.png",
	events:null
	});

// Adding Sega Saturn 
// -----------------------------------------------------------
GDT.addPlatform({
	id:"566cf7dd-4ed4-4831-9733-b7e78e1276ab",
	name:"Sega Saturn",
	company:"Sega",
	startAmount:0.25,
	unitsSold:0.264,
	licencePrize:2E4,
	published:"7/5/4",
	platformRetireDate:"11/4/4",
	developmentCosts:1E4,
	genreWeightings:[  1, 0.8, 1, 0.9, 0.8, 0.7 ],
	audienceWeightings:[  0.8, 0.9, 1 ],
	techLevel:3,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/640px-Sega-Saturn-Console-Set-Mk1.png",
	events:null
	});

// Adding CPS Changer
// -----------------------------------------------------------
GDT.addPlatform({
	id:"3c64ca3c-d725-4a39-97b8-16bb56b3e7fb",
	name:"CPS Changer",
	company:"Capcom",
	startAmount:0.000025,
	unitsSold:0.000029,
	licencePrize:2E4,
	published:"7/7/3",
	platformRetireDate:"8/12/4",
	developmentCosts:1E4,
	genreWeightings:[  0.6, 0.8, 0.6, 0.9, 1, 0.7 ],
	audienceWeightings:[  0.6, 0.7, 0.9 ],
	techLevel:2,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/Changer1.png",
	events:null
	});

// Adding Commodore CDTV
// -----------------------------------------------------------
GDT.addPlatform({
	id:"69752691-d34d-47a7-a9b6-865370151809",
	name:"Commodore CDTV",
	company:"Commodore",
	startAmount:0.0012,
	unitsSold:0.0015,
	licencePrize:2E4,
	published:"5/4/2",
	platformRetireDate:"7/7/4",
	developmentCosts:1E4,
	genreWeightings:[  0.6, 0.7, 0.6, 0.9, 1, 0.8 ],
	audienceWeightings:[  0.6, 0.8, 1 ],
	techLevel:2,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/CDTV.png",
	events:null
	});

// Adding PC Engine SuperGrafx
// -----------------------------------------------------------
GDT.addPlatform({
	id:"82b9a26f-729e-40b2-b709-e824a495b2e3",
	name:"PC Engine SuperGrafx",
	company:"NEC Home Electronics",
	startAmount:0.0014,
	unitsSold:0.0017,
	licencePrize:1E4,
	published:"4/5/2",
	platformRetireDate:"6/8/4",
	developmentCosts:5E3,
	genreWeightings:[  1, 0.7, 0.6, 0.9, 0.7, 1 ],
	audienceWeightings:[  0.7, 0.8, 1 ],
	techLevel:2,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/640px-SuperGrafx-Console-Set.png",
	events:null
	});

// Adding TurboGrafx-CD
// -----------------------------------------------------------
GDT.addPlatform({
	id:"b78117e6-e6b7-4976-a513-8411c09fa0a9",
	name:"TurboGrafx-CD",
	company:"NEC Home Electronics",
	startAmount:0.02,
	unitsSold:0.026,
	licencePrize:1E4,
	published:"5/5/3",
	platformRetireDate:"6/9/4",
	developmentCosts:5E3,
	genreWeightings:[  0.9, 0.7, 0.6, 1, 0.8, 0.8 ],
	audienceWeightings:[  0.7, 0.8, 1 ],
	techLevel:2,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/NEC-TurboGrafx-16-CD-FL.png",
	events:null
	});

// Adding CD-ROM² System
// -----------------------------------------------------------
GDT.addPlatform({
	id:"4d3850e9-f961-4d4b-87b5-b2c48368d9b7",
	name:"CD-ROM\u00B2 System",
	company:"NEC Home Electronics",
	startAmount:0.0015,
	unitsSold:0.002,
	licencePrize:1E4,
	published:"3/8/4",
	platformRetireDate:"5/2/3",
	developmentCosts:5E3,
	genreWeightings:[  1, 0.7, 0.9, 1, 0.9, 0.8 ],
	audienceWeightings:[  0.6, 0.8, 1 ],
	techLevel:2,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/220px-PC_Engine_CD-ROM2_Interface_Unit.png",
	events:null
	});

// Adding Commodore 64GS
// -----------------------------------------------------------
GDT.addPlatform({
	id:"9ee98cb8-e688-4937-972a-4a2c166327a4",
	name:"Commodore 64GS",
	company:"Commodore",
	startAmount:0.0004,
	unitsSold:0.00048,
	licencePrize:1E4,
	published:"5/3/2",
	platformRetireDate:"7/5/3",
	developmentCosts:5E3,
	genreWeightings:[  0.9, 0.8, 0.7, 0.9, 0.9, 0.6 ],
	audienceWeightings:[  0.7, 0.8, 1 ],
	techLevel:1,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/640px-C64GS-Console-Set.png",
	events:null
	});

// Adding GX4000
// -----------------------------------------------------------
GDT.addPlatform({
	id:"161a715c-41c5-4a50-aa04-438c4244e825",
	name:"GX4000",
	company:"Amstrad",
	startAmount:0.0003,
	unitsSold:0.00038,
	licencePrize:1E4,
	published:"5/4/4",
	platformRetireDate:"6/5/4",
	developmentCosts:5E3,
	genreWeightings:[  1, 0.6, 0.7, 0.9, 1, 0.7 ],
	audienceWeightings:[  1, 0.8, 0.7 ],
	techLevel:1,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/640px-Amstrad-GX4000-Console-Set.png",
	events:null
	});

// Adding Video Driver
// -----------------------------------------------------------
GDT.addPlatform({
	id:"fb9d8d59-a1e2-4f16-ad59-7f6cdde3687c",
	name:"Video Driver",
	company:"Sega",
	startAmount:0.00075,
	unitsSold:0.0009,
	licencePrize:1E4,
	published:"3/8/3",
	platformRetireDate:"4/12/3",
	developmentCosts:5E3,
	genreWeightings:[  1, 0.6, 0.7, 1, 0.8, 0.8 ],
	audienceWeightings:[  1, 0.9, 0.8 ],
	techLevel:2,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/Tyco-video-driver-game-from-SEGA-1988.png",
	events:null
	});

// Adding VTech Socrates
// -----------------------------------------------------------
GDT.addPlatform({
	id:"ef5f5797-39d3-4046-a6b6-dc63950fe5e1",
	name:"VTech Socrates",
	company:"VTech",
	startAmount:0.00052,
	unitsSold:0.0025,
	licencePrize:1E4,
	published:"3/9/4",
	platformRetireDate:"7/6/1",
	developmentCosts:5E3,
	genreWeightings:[  0.7, 0.8, 0.9, 0.9, 0.7, 1 ],
	audienceWeightings:[  1, 0.7, 0.6 ],
	techLevel:1,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/640px-VTech-Socrates-Set-FL.png",
	events:null
	});

// Adding Terebikko
// -----------------------------------------------------------
GDT.addPlatform({
	id:"b81f18b8-6591-46c3-91b1-d39e6925ed44",
	name:"Terebikko",
	company:"Bandai",
	startAmount:0.0002,
	unitsSold:0.0003,
	licencePrize:1E4,
	published:"3/10/2",
	platformRetireDate:"7/5/4",
	developmentCosts:5E3,
	genreWeightings:[  0.6, 0.6, 0.8, 0.6, 0.7, 1 ],
	audienceWeightings:[  1, 0.7, 0.6 ],
	techLevel:1,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/Terebikko_system.png",
	events:null
	});

// Adding View-Master Interactive Vision
// -----------------------------------------------------------
GDT.addPlatform({
	id:"101bab0e-5c1f-4986-8762-ac7947dce00b",
	name:"View-Master Interactive Vision",
	company:"View-Master Ideal Group Inc",
	startAmount:0.00052,
	unitsSold:0.0035,
	licencePrize:1E4,
	published:"3/12/1",
	platformRetireDate:"5/3/2",
	developmentCosts:5E3,
	genreWeightings:[  0.7, 0.9, 1, 0.7, 0.6, 0.9 ],
	audienceWeightings:[  1, 0.7, 0.6 ],
	techLevel:2,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/ViewMaster-Interactive-Vision-wController-L.png",
	events:null
	});

// Adding Action Max
// -----------------------------------------------------------
GDT.addPlatform({
	id:"635ce5b8-bfee-4819-9412-f41493df3a72",
	name:"Action Max",
	company:"Worlds of Wonder",
	startAmount:0.0006,
	unitsSold:0.0008,
	licencePrize:1E4,
	published:"3/6/1",
	platformRetireDate:"5/4/2",
	developmentCosts:5E3,
	genreWeightings:[  1, 0.7, 0.6, 0.8, 0.9, 0.6 ],
	audienceWeightings:[  0.9, 0.8, 0.7 ],
	techLevel:2,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/640px-Action-Max-Set-FL.png",
	events:null
	});

// Adding Video Challenger
// -----------------------------------------------------------
GDT.addPlatform({
	id:"54f9f46a-9dd9-48db-a3bd-dd40626b9c94",
	name:"Video Challenger",
	company:"Takara",
	startAmount:0.00015,
	unitsSold:0.001,
	licencePrize:1E4,
	published:"3/5/2",
	platformRetireDate:"5/2/1",
	developmentCosts:5E3,
	genreWeightings:[  1, 0.7, 0.6, 0.9, 1, 0.6 ],
	audienceWeightings:[  0.7, 0.8, 1 ],
	techLevel:2,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/vid-chal-gig-01_small.png",
	events:null
	});

// Adding Videosmarts
// -----------------------------------------------------------
GDT.addPlatform({
	id:"db81e25c-046b-4290-b1de-f41ffb10bae0",
	name:"Videosmarts",
	company:"VTech",
	startAmount:0.00037,
	unitsSold:0.0025,
	licencePrize:1E4,
	published:"3/3/3",
	platformRetireDate:"4/5/1",
	developmentCosts:5E3,
	genreWeightings:[  0.6, 0.9, 0.8, 1, 0.8, 0.9 ],
	audienceWeightings:[  1, 0.8, 0.7 ],
	techLevel:2,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/s-l1600-removebg-preview.png",
	events:null
	});

// Adding Family Computer Disk System
// -----------------------------------------------------------
GDT.addPlatform({
	id:"dfc98d36-eb42-45d6-a1b1-eb7f958d6c3e",
	name:"Family Computer Disk System",
	company:"Nintendo",
	startAmount:0.085,
	unitsSold:0.091,
	licencePrize:1E4,
	published:"3/2/4",
	platformRetireDate:"5/1/2",
	developmentCosts:5E3,
	genreWeightings:[  0.7, 1, 0.7, 0.9, 0.9, 0.7 ],
	audienceWeightings:[  1, 0.9, 0.9 ],
	techLevel:2,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/146px-Nintendo-Famicom-Disk-System.png",
	events:null
	});

// Adding Sega mark III
// -----------------------------------------------------------
GDT.addPlatform({
	id:"68008baf-32c5-4195-9910-28e7c874b33c",
	name:"Sega mark III",
	company:"Sega",
	startAmount:0.03,
	unitsSold:0.034,
	licencePrize:1E4,
	published:"3/1/4",
	platformRetireDate:"4/2/1",
	developmentCosts:5E3,
	genreWeightings:[  1, 0.7, 0.9, 0.8, 0.9, 0.8 ],
	audienceWeightings:[  0.8, 0.8, 0.9 ],
	techLevel:1,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/Sega-Sg-1000-MkIII-Console-FL.png",
	events:null
	});

// Adding LJN Video Art
// -----------------------------------------------------------
GDT.addPlatform({
	id:"778cc446-35f7-4dd3-a2b8-c1551cc06b44",
	name:"LJN Video Art",
	company:"LJN",
	startAmount:0.00037,
	unitsSold:0.0025,
	licencePrize:1E4,
	published:"3/6/3",
	platformRetireDate:"4/7/3",
	developmentCosts:5E3,
	genreWeightings:[  0.6, 0.7, 0.7, 0.9, 0.7, 1 ],
	audienceWeightings:[  1, 0.7, 0.6 ],
	techLevel:1,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/s-l300.png",
	events:null
	});

// Adding BBC Bridge Companion
// -----------------------------------------------------------
GDT.addPlatform({
	id:"04359ea3-291a-4fa2-8d9c-d53c93e144dc",
	name:"BBC Bridge Companion",
	company:"Heber",
	startAmount:0.00045,
	unitsSold:0.003,
	licencePrize:1E4,
	published:"3/1/2",
	platformRetireDate:"4/6/3",
	developmentCosts:5E3,
	genreWeightings:[  0.7, 0.7, 0.7, 0.7, 0.9, 0.8 ],
	audienceWeightings:[  0.9, 0.9, 0.9 ],
	techLevel:1,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/BBC-bridge-companion.png",
	events:null
	});

// Adding Super Cassette Vision
// -----------------------------------------------------------
GDT.addPlatform({
	id:"9cc7947d-97d6-4894-a6c3-2fc3bba64a39",
	name:"Super Cassette Vision",
	company:"Epoch",
	startAmount:0.006,
	unitsSold:0.0061,
	licencePrize:1E3,
	published:"2/7/3",
	platformRetireDate:"3/6/4",
	developmentCosts:5E2,
	genreWeightings:[  0.9, 0.7, 0.9, 0.7, 0.9, 0.7 ],
	audienceWeightings:[  1, 0.8, 0.7 ],
	techLevel:1,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/Super-Cassette-Vision-Console-L.png",
	events:null
	});

// Adding ColecoVision
// -----------------------------------------------------------
GDT.addPlatform({
	id:"3a3574ee-7486-4a7d-bf6a-d8ed29667e67",
	name:"ColecoVision",
	company:"Coleco Industries Inc",
	startAmount:0.1,
	unitsSold:0.115,
	licencePrize:1E3,
	published:"1/10/2",
	platformRetireDate:"3/1/4",
	developmentCosts:5E2,
	genreWeightings:[  1, 0.6, 0.7, 0.9, 0.9, 0.6 ],
	audienceWeightings:[  1, 0.9, 0.8 ],
	techLevel:1,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/640px-ColecoVision-wController-L.png",
	events:null
	});

// Adding CreatiVision
// -----------------------------------------------------------
GDT.addPlatform({
	id:"103e5024-6b46-4b7f-a557-cd0e0fa1825c",
	name:"CreatiVision",
	company:"VTech",
	startAmount:0.003,
	unitsSold:0.004,
	licencePrize:1E3,
	published:"1/9/3",
	platformRetireDate:"3/3/2",
	developmentCosts:5E2,
	genreWeightings:[  1, 0.6, 0.8, 0.9, 0.9, 0.6 ],
	audienceWeightings:[  1, 0.9, 0.9 ],
	techLevel:1,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/640px-CreatiVision-Console-Set-removebg-preview.png",
	events:null
	});

// Adding Interton VC 4000
// -----------------------------------------------------------
GDT.addPlatform({
	id:"7da144c5-614d-4b30-a196-8f3b83aa70e4",
	name:"Interton VC 4000",
	company:"Interton",
	startAmount:0.032,
	unitsSold:0.037,
	licencePrize:1E3,
	published:"1/1/1",
	platformRetireDate:"2/1/2",
	developmentCosts:5E2,
	genreWeightings:[  0.6, 0.7, 0.8, 0.8, 0.9, 1 ],
	audienceWeightings:[  0.8, 0.9, 1 ],
	techLevel:1,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/640px-VC-4000-Console-Set.png",
	events:null
	});

// Adding Bally Astrocade
// -----------------------------------------------------------
GDT.addPlatform({
	id:"9dadad48-357d-4a88-8063-316be7522f73",
	name:"Bally Astrocade",
	company:"Bally Manufacturing",
	startAmount:0.0020,
	unitsSold:0.0022,
	licencePrize:1E3,
	published:"1/1/1",
	platformRetireDate:"2/1/1",
	developmentCosts:5E2,
	genreWeightings:[  0.6, 0.6, 0.7, 0.7, 0.9, 1 ],
	audienceWeightings:[  0.7, 0.8, 1 ],
	techLevel:1,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/640px-Bally-Arcade-Console-removebg-preview.png",
	events:null
	});

// Adding Fairchild Channel F
// -----------------------------------------------------------
GDT.addPlatform({
	id:"207d4834-0f21-41a6-aa9d-eb96eadeff79",
	name:"Fairchild Channel F",
	company:"Fairchild Semiconductor",
	startAmount:0.006,
	unitsSold:0.0066,
	licencePrize:1E3,
	published:"1/1/1",
	platformRetireDate:"1/12/4",
	developmentCosts:5E2,
	genreWeightings:[  0.6, 1, 0.7, 0.8, 1, 0.9 ],
	audienceWeightings:[  0.7, 0.8, 0.9 ],
	techLevel:1,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/640px-Fairchild-Channel-F-removebg-preview.png",
	events:null
	});

// Adding TV Vader
// -----------------------------------------------------------
GDT.addPlatform({
	id:"3eb4fd9d-5a00-49cc-9411-e8640664cf67",
	name:"TV Vader",
	company:"Epoch",
	startAmount:0.009,
	unitsSold:0.011,
	licencePrize:1E3,
	published:"1/1/1",
	platformRetireDate:"1/4/4",
	developmentCosts:5E2,
	genreWeightings:[  1, 0.7, 0.6, 1, 0.9, 0.6 ],
	audienceWeightings:[  0.8, 0.9, 1 ],
	techLevel:1,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/epoch_tv-vader_1s.png",
	events:null
	});

// Adding BSS 01
// -----------------------------------------------------------
GDT.addPlatform({
	id:"e5b0a414-6347-4998-8c53-abafe1dccf77",
	name:"BSS 01",
	company:"VEB",
	startAmount:0.00001,
	unitsSold:0.000018,
	licencePrize:1E3,
	published:"1/1/1",
	platformRetireDate:"1/7/4",
	developmentCosts:5E2,
	genreWeightings:[  0.6, 0.6, 0.9, 0.7, 0.9, 1 ],
	audienceWeightings:[  1, 0.8, 0.7 ],
	techLevel:1,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/rft_bss01_1s.png",
	events:null
	});

// Adding Arduboy 
// -----------------------------------------------------------
GDT.addPlatform({
	id:"a208c708-1fdc-4450-ac97-71aca34cd00f",
	name:"Arduboy",
	company:"Kevin Bates",
	startAmount:0.002,
	unitsSold:0.0022,
	licencePrize:2E5,
	published:"24/12/1",
	platformRetireDate:"26/12/2",
	developmentCosts:1E5,
	genreWeightings:[  0.6, 0.8, 0.9, 0.6, 0.7, 0.8 ],
	audienceWeightings:[  0.6, 0.7, 0.8 ],
	techLevel:3,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/thX1VDYY17.png",
	events:null
	});

// Adding GCW Zero 
// -----------------------------------------------------------
GDT.addPlatform({
	id:"6e28c3d0-f8ae-412e-acc7-2562fbdba4b5",
	name:"GCW Zero",
	company:"Game Consoles Worldwide",
	startAmount:0.0004,
	unitsSold:0.0005,
	licencePrize:2E5,
	published:"23/1/3",
	platformRetireDate:"25/7/3",
	developmentCosts:1E5,
	genreWeightings:[  0.7, 0.6, 0.7, 0.8, 1, 0.7 ],
	audienceWeightings:[  0.6, 0.8, 1 ],
	techLevel:1,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/gcw-zero.png",
	events:null
	});

// Adding Monon Color 
// -----------------------------------------------------------
GDT.addPlatform({
	id:"f440bcb9-6830-42b6-b9de-4eb03dfa4dfb",
	name:"Monon Color",
	company:"M&D",
	startAmount:0.017,
	unitsSold:0.025,
	licencePrize:2E5,
	published:"24/3/4",
	platformRetireDate:"25/8/4",
	developmentCosts:1E5,
	genreWeightings:[  1, 0.8, 0.7, 0.9, 0.7, 0.6 ],
	audienceWeightings:[  0.6, 0.8, 1 ],
	techLevel:4,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/thA7OE6TH1.png",
	events:null
	});

// Adding Variety
// -----------------------------------------------------------
GDT.addPlatform({
	id:"d418bece-1045-4b2d-8ef6-730dacc5f3ce",
	name:"Variety",
	company:"VTech",
	startAmount:0.001,
	unitsSold:0.0015,
	licencePrize:1E3,
	published:"1/1/1",
	platformRetireDate:"2/10/3",
	developmentCosts:5E2,
	genreWeightings:[  0.7, 0.6, 0.9, 0.9, 1, 0.8 ],
	audienceWeightings:[  0.9, 0.8, 0.7 ],
	techLevel:1,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/vtech-variety-removebg-preview.png",
	events:null
	});

// Adding Palmtex PVS
// -----------------------------------------------------------
GDT.addPlatform({
	id:"584d92f2-572a-485d-8e02-7e1a2ad03153",
	name:"Palmtex PVS",
	company:"Palmtex",
	startAmount:0.0009,
	unitsSold:0.001,
	licencePrize:1E3,
	published:"2/6/2",
	platformRetireDate:"2/12/4",
	developmentCosts:5E2,
	genreWeightings:[  0.6, 0.7, 0.6, 0.8, 0.8, 0.6 ],
	audienceWeightings:[  0.6, 0.7, 0.7 ],
	techLevel:2,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/250px-Palmtex-SuperMicro.png",
	events:null
	});

// Adding Digi Casse
// -----------------------------------------------------------
GDT.addPlatform({
	id:"12ca2066-cde5-4bf2-9c41-4eb5f7fcddb7",
	name:"Digi Casse",
	company:"Bandai",
	startAmount:0.0008,
	unitsSold:0.00175,
	licencePrize:1E3,
	published:"2/7/1",
	platformRetireDate:"4/4/4",
	developmentCosts:5E2,
	genreWeightings:[  0.9, 0.7, 0.8, 0.9, 1, 0.6 ],
	audienceWeightings:[  0.9, 0.7, 0.7 ],
	techLevel:2,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/digi case.png",
	events:null
	});

// Adding Epoch Game Pocket Computer
// -----------------------------------------------------------
GDT.addPlatform({
	id:"1e228c8f-50fc-4492-b62a-f8c2c1bbca51",
	name:"Epoch Game Pocket Computer",
	company:"Epoch",
	startAmount:0.0009,
	unitsSold:0.006,
	licencePrize:1E3,
	published:"2/9/2",
	platformRetireDate:"4/12/1",
	developmentCosts:5E2,
	genreWeightings:[  0.9, 0.8, 0.7, 0.6, 0.8, 0.6 ],
	audienceWeightings:[  1, 0.9, 0.9 ],
	techLevel:1,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/613px-Epoch-Game-Pocket-Computer-FL.png",
	events:null
	});

// Adding IM-26 
// -----------------------------------------------------------
GDT.addPlatform({
	id:"93b4ee98-3887-4bb8-a909-2670f5ae1744",
	name:"IM-26",
	company:"Electronika",
	startAmount:0.00037,
	unitsSold:0.0025,
	licencePrize:1E4,
	published:"3/8/2",
	platformRetireDate:"7/6/2",
	developmentCosts:5E3,
	genreWeightings:[  1, 0.6, 0.9, 0.7, 0.7, 0.8 ],
	audienceWeightings:[  0.8, 0.9, 1 ],
	techLevel:2,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/IM-26.png",
	events:null
	});

// Adding Light Games
// -----------------------------------------------------------
GDT.addPlatform({
	id:"d9c975cd-0ce9-4831-8354-21c3ac961d0b",
	name:"Light Games",
	company:"Grandstand",
	startAmount:0.002,
	unitsSold:0.003,
	licencePrize:1E4,
	published:"4/8/4",
	platformRetireDate:"6/12/4",
	developmentCosts:5E3,
	genreWeightings:[  0.7, 0.8, 0.9, 1, 0.8, 0.9 ],
	audienceWeightings:[  1, 0.8, 0.7 ],
	techLevel:1,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/th8X7RH234.png",
	events:null
	});

// Adding PreComputer 1000 
// -----------------------------------------------------------
GDT.addPlatform({
	id:"f3140c0f-ea5b-4a26-a215-ee38d2b833bf",
	name:"PreComputer 1000",
	company:"VTech",
	startAmount:0.00052,
	unitsSold:0.0035,
	licencePrize:1E4,
	published:"3/9/3",
	platformRetireDate:"5/5/4",
	developmentCosts:5E3,
	genreWeightings:[  0.6, 0.8, 0.9, 0.8, 0.7, 0.9 ],
	audienceWeightings:[  1, 0.7, 0.6 ],
	techLevel:1,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/51t28GWOb2L._SY300_QL70_.png",
	events:null
	});

// Adding Videopac+ G7400
// -----------------------------------------------------------
GDT.addPlatform({
	id:"d9f4ae4a-020c-4070-9442-dc33c68255c2",
	name:"Videopac+ G7400",
	company:"Philips",
	startAmount:0.0001,
	unitsSold:0.00013,
	licencePrize:1E3,
	published:"2/1/1",
	platformRetireDate:"3/12/4",
	developmentCosts:5E2,
	genreWeightings:[  0.9, 0.7, 0.8, 0.7, 1, 0.8 ],
	audienceWeightings:[  0.7, 0.8, 1 ],
	techLevel:1,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/120px-Philips_Videopac_G7400.png",
	events:null
	});

// Adding My Vision
// -----------------------------------------------------------
GDT.addPlatform({
	id:"6d8c7407-575d-4fe2-83ca-0b45c17df65c",
	name:"My Vision",
	company:"Nichibutsu",
	startAmount:0.0004,
	unitsSold:0.0006,
	licencePrize:1E3,
	published:"1/11/2",
	platformRetireDate:"2/12/1",
	developmentCosts:5E2,
	genreWeightings:[  1, 0.8, 0.7, 0.6, 0.9, 0.7 ],
	audienceWeightings:[  0.9, 0.8, 0.8 ],
	techLevel:1,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/120px-Nichibutsu_My_Vision.png",
	events:null
	});

// Adding PV-1000
// -----------------------------------------------------------
GDT.addPlatform({
	id:"08416102-6e65-432e-bd29-d14d3a5b14a8",
	name:"PV-1000",
	company:"Casio",
	startAmount:0.00015,
	unitsSold:0.00017,
	licencePrize:1E3,
	published:"2/2/4",
	platformRetireDate:"2/8/3",
	developmentCosts:5E2,
	genreWeightings:[  0.8, 0.8, 0.9, 0.7, 1, 0.8 ],
	audienceWeightings:[  1, 0.9, 0.7 ],
	techLevel:1,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/640px-Casio-PV1000-Console-Set.png",
	events:null
	});

// Adding Neo Geo Pocket 
// -----------------------------------------------------------
GDT.addPlatform({
	id:"9e7d8b38-73de-46d0-abbe-9ace0a2ac507",
	name:"Neo Geo Pocket",
	company:"SNK",
	startAmount:0.065,
	unitsSold:0.071,
	licencePrize:2E4,
	published:"10/6/3",
	platformRetireDate:"11/3/1",
	developmentCosts:1E4,
	genreWeightings:[  1, 0.7, 0.8, 0.7, 0.8, 0.9 ],
	audienceWeightings:[  0.8, 0.9, 0.9 ],
	techLevel:3,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/190px-Neo-Geo-Pocket-Anthra-Left.png",
	events:null
	});

// Adding Cybiko 
// -----------------------------------------------------------
GDT.addPlatform({
	id:"cef12428-aff7-4a32-8880-8066c93f22ed",
	name:"Cybiko",
	company:"Cybiko Inc",
	startAmount:0.018,
	unitsSold:0.02,
	licencePrize:1E5,
	published:"11/6/2",
	platformRetireDate:"13/3/2",
	developmentCosts:5E4,
	genreWeightings:[  0.6, 0.6, 1, 0.8, 0.8, 1 ],
	audienceWeightings:[  0.9, 0.7, 0.6 ],
	techLevel:2,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/Cybiko.png",
	events:null
	});

// Adding APF-MP1000
// -----------------------------------------------------------
GDT.addPlatform({
	id:"951914f7-c9a0-4324-ab69-fa70e1420c58",
	name:"APF-MP1000",
	company:"APF Electronics Inc",
	startAmount:0.0008,
	unitsSold:0.0009,
	licencePrize:1E3,
	published:"1/1/1",
	platformRetireDate:"2/1/2",
	developmentCosts:5E2,
	genreWeightings:[  0.8, 0.9, 0.7, 0.7, 0.9, 0.7 ],
	audienceWeightings:[  0.8, 0.8, 0.9 ],
	techLevel:1,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/640px-APF-MP1000-FL.png",
	events:null
	});

// Adding 1292 Advanced Programmable Video System
// -----------------------------------------------------------
GDT.addPlatform({
	id:"6ed000d9-61c3-42b6-bf15-a627d019b16a",
	name:"1292 Advanced Programmable Video System",
	company:"Audiosonic",
	startAmount:0.002,
	unitsSold:0.0025,
	licencePrize:1E3,
	published:"1/1/1",
	platformRetireDate:"2/2/2",
	developmentCosts:5E2,
	genreWeightings:[  0.6, 0.8, 0.9, 0.9, 1, 0.7 ],
	audienceWeightings:[  0.7, 0.8, 0.9 ],
	techLevel:1,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/640px-Acetronic-MPU-1000.png",
	events:null
	});

// Adding Cassette Vision
// -----------------------------------------------------------
GDT.addPlatform({
	id:"faf704cc-75f2-4017-9bb8-2b6d6a8f483b",
	name:"Cassette Vision",
	company:"Epoch",
	startAmount:0.007,
	unitsSold:0.0075,
	licencePrize:1E3,
	published:"1/6/2",
	platformRetireDate:"2/8/1",
	developmentCosts:5E2,
	genreWeightings:[  1, 0.8, 0.7, 0.6, 0.8, 1 ],
	audienceWeightings:[  0.9, 0.8, 0.9 ],
	techLevel:1,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/640px-Epoch-Cassette-Vision-Console.png",
	events:null
	});

// Adding PocketStation
// -----------------------------------------------------------
GDT.addPlatform({
	id:"bf70381c-2709-4256-8af1-60824a38d922",
	name:"PocketStation",
	company:"Sony",
	startAmount:0.17,
	unitsSold:0.192,
	licencePrize:1E5,
	published:"10/11/1",
	platformRetireDate:"13/2/2",
	developmentCosts:5E4,
	genreWeightings:[  1, 0.7, 0.8, 0.9, 1, 0.6 ],
	audienceWeightings:[  1, 0.8, 0.9 ],
	techLevel:3,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/324px-Sony-PocketStation.png",
	events:null
	});

// Adding Net Jet
// -----------------------------------------------------------
GDT.addPlatform({
	id:"3bd4abf1-ab07-43b5-b485-7ccec2fdbeaf",
	name:"Net Jet",
	company:"Hasbro",
	startAmount:0.00037,
	unitsSold:0.0022,
	licencePrize:2E5,
	published:"18/5/4",
	platformRetireDate:"19/2/4",
	developmentCosts:1E5,
	genreWeightings:[  0.9, 1, 0.8, 0.7, 0.8, 0.8 ],
	audienceWeightings:[  0.9, 0.8, 0.7 ],
	techLevel:3,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/Net_Jet_Controller.png",
	events:null
	});

// Adding Steam Machine
// -----------------------------------------------------------
GDT.addPlatform({
	id:"a2b76823-7b51-4a1c-bb88-a4f8df7094e3",
	name:"Steam Machine",
	company:"Valve",
	startAmount:0.045,
	unitsSold:0.055,
	licencePrize:4E5,
	published:"24/9/1",
	platformRetireDate:"26/2/4",
	developmentCosts:2E5,
	genreWeightings:[  0.9, 0.9, 0.9, 0.9, 0.9, 0.9 ],
	audienceWeightings:[  0.9, 0.9, 0.9 ],
	techLevel:4,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/640px-Steam_Machine_from_Gigabyte_and_Steam_Controller.png",
	events:null
	});

// Adding Retro Duo
// -----------------------------------------------------------
GDT.addPlatform({
	id:"c60c80bf-4f92-4937-815c-5606a561b34b",
	name:"Retro Duo",
	company:"Retro-Bit",
	startAmount:0.00037,
	unitsSold:0.0015,
	licencePrize:2E5,
	published:"19/2/1",
	platformRetireDate:"20/5/4",
	developmentCosts:1E5,
	genreWeightings:[  0.8, 1, 0.9, 0.9, 0.7, 0.8 ],
	audienceWeightings:[  0.8, 0.8, 0.9 ],
	techLevel:2,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/640px-Retro-Bit-Retro-Duo-Portable.png",
	events:null
	});

// Adding Etch A Sketch Animator 2000
// -----------------------------------------------------------
GDT.addPlatform({
	id:"6dbeff44-c833-417f-97b2-eaba81dffa79",
	name:"Etch A Sketch Animator 2000",
	company:"Andr\u00E9 Cassagnes",
	startAmount:0.00037,
	unitsSold:0.0025,
	licencePrize:1E4,
	published:"3/8/1",
	platformRetireDate:"7/12/4",
	developmentCosts:5E3,
	genreWeightings:[  0.7, 0.8, 0.9, 1, 0.7, 0.9 ],
	audienceWeightings:[  1, 0.8, 0.7 ],
	techLevel:1,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/Oaetch2000.png",
	events:null
	});

// Adding Colorvision
// -----------------------------------------------------------
GDT.addPlatform({
	id:"eae88c06-097e-4afa-82ab-2e3ea4a89ec2",
	name:"Colorvision",
	company:"Romtec",
	startAmount:0.0002,
	unitsSold:0.0003,
	licencePrize:1E3,
	published:"2/6/4",
	platformRetireDate:"3/9/2",
	developmentCosts:5E2,
	genreWeightings:[  0.8, 0.9, 0.9, 0.8, 0.8, 1 ],
	audienceWeightings:[  1, 0.8, 0.8 ],
	techLevel:1,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/84_Romtek_ColorVision.png",
	events:null
	});

// Adding TurboExpress 
// -----------------------------------------------------------
GDT.addPlatform({
	id:"f6399a17-e5e3-4740-af1c-0a0e96399816",
	name:"TurboExpress",
	company:"NEC Home Electronics",
	startAmount:0.03,
	unitsSold:0.034,
	licencePrize:1E4,
	published:"5/2/3",
	platformRetireDate:"7/5/3",
	developmentCosts:5E3,
	genreWeightings:[  0.7, 0.9, 0.7, 0.9, 1, 0.8 ],
	audienceWeightings:[  0.9, 0.8, 0.7 ],
	techLevel:2,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/375px-NEC-TurboExpress-Upright-FL.png",
	events:null
	});

// Adding Pro Screen
// -----------------------------------------------------------
GDT.addPlatform({
	id:"37c85d9a-5cd7-41ea-a8c1-13ddac957651",
	name:"Pro Screen",
	company:"VTech",
	startAmount:0.00037,
	unitsSold:0.0025,
	licencePrize:1E3,
	published:"2/6/1",
	platformRetireDate:"3/12/4",
	developmentCosts:5E2,
	genreWeightings:[  0.8, 0.9, 0.7, 1, 0.9, 0.7 ],
	audienceWeightings:[  0.9, 0.8, 0.8 ],
	techLevel:1,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/84_Ludotronic_Pro_Screen.png",
	events:null
	});

// Adding Playdate
// -----------------------------------------------------------
GDT.addPlatform({
	id:"a0e6b7ff-ba11-4d2d-afe5-545a59e477e7",
	name:"Playdate",
	company:"Panic inc",
	startAmount:0.08,
	unitsSold:0.09,
	licencePrize:1E5,
	published:"28/9/1",
	platformRetireDate:"260/12/4",
	developmentCosts:1E5,
	genreWeightings:[  0.8, 1, 0.9, 0.7, 0.8, 0.9 ],
	audienceWeightings:[  1, 0.9, 0.8 ],
	techLevel:3,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/566px-Playdate_front-view.png",
	events:null
	});

// Adding Steamdeck
// -----------------------------------------------------------
GDT.addPlatform({
	id:"d5dc3347-e2f0-4c2f-8729-6ba6dbe40d46",
	name:"Steam Deck",
	company:"Valve",
	startAmount:6,
	unitsSold:6.1,
	licencePrize:3E5,
	published:"28/8/1",
	platformRetireDate:"260/12/4",
	developmentCosts:1E5,
	genreWeightings:[  0.9, 1, 0.9, 0.6, 0.7, 1 ],
	audienceWeightings:[  0.7, 0.8, 1 ],
	techLevel:6,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/e54b85b6e75bc7ec589372474ef1705b3471bb66.png",
	events:null
	});

// Adding Neo Geo Pocket Color
// -----------------------------------------------------------
GDT.addPlatform({
	id:"4a339950-5615-4046-ac20-a583d16dcf83",
	name:"Neo Geo Pocket Color",
	company:"SNK",
	startAmount:0.0009,
	unitsSold:0.001,
	licencePrize:2E4,
	published:"10/11/4",
	platformRetireDate:"11/12/4",
	developmentCosts:1E4,
	genreWeightings:[  1, 0.8, 0.7, 0.7, 0.9, 0.9 ],
	audienceWeightings:[  0.8, 0.9, 1 ],
	techLevel:3,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/640px-Neo-Geo-Pocket-Color-Blue-Left__1_-removebg-preview.png",
	events:null
	});

	// Adding Tomy Tutor
// -----------------------------------------------------------
GDT.addPlatform({
	id:"dcb10cbf-4852-488e-9f87-46f1cabfdc8b",
	name:"Tomy Tutor",
	company:"Tomy",
	startAmount:0.002,
	unitsSold:0.0023,
	licencePrize:1E3,
	published:"1/9/4",
	platformRetireDate:"3/1/2",
	developmentCosts:5E2,
	genreWeightings:[  0.8, 0.6, 0.7, 0.9, 0.6, 0.7 ],
	audienceWeightings:[  0.8, 0.9, 1 ],
	techLevel:1,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/640px-Tomy-Tutor-wControllers-removebg-preview.png",
	events:null
	});

// Adding Watara Supervision
// -----------------------------------------------------------
GDT.addPlatform({
	id:"780adb1b-4de5-4bc8-9bc5-64a423e2083f",
	name:"Watara Supervision",
	company:"Watara",
	startAmount:0.002,
	unitsSold:0.0035,
	licencePrize:2E4,
	published:"6/5/3",
	platformRetireDate:"7/12/1",
	developmentCosts:1E4,
	genreWeightings:[  0.6, 0.7, 1, 0.8, 0.6, 1 ],
	audienceWeightings:[  1, 0.8, 0.7 ],
	techLevel:2,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/497px-Watara-Supervision-Tilted-removebg.png",
	events:null
	});

// Adding Amiga 500
// -----------------------------------------------------------
GDT.addPlatform({
	id:"f088d1eb-c2d6-410c-b348-7ed9bf958c8f",
	name:"Amiga 500",
	company: "Commodore",
	startAmount:0.09,
	unitsSold:0.104,
	licencePrize:1E4,
	published:"3/5/1",
	platformRetireDate:"6/2/2",
	developmentCosts:5E3,
	genreWeightings:[  0.9, 0.6, 0.8, 1, 0.8, 0.8 ],
	audienceWeightings:[  0.9, 0.8, 0.7 ],
	techLevel:2,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/618px-Amiga500_system-removebg-preview.png",
	events:null
	});

// Adding Oculus Quest 2
// -----------------------------------------------------------
GDT.addPlatform({
	id:"3f28ff32-3e95-4e20-a343-5be31f5bb552",
	name:"Oculus Quest 2",
	company: "Reality Labs",
	startAmount:4.7,
	unitsSold:5,
	licencePrize:3E5,
	published:"27/8/1",
	platformRetireDate:"260/12/4",
	developmentCosts:1E5,
	genreWeightings:[  0.8, 0.6, 1, 1, 0.7, 0.9 ],
	audienceWeightings:[  0.9, 0.9, 1 ],
	techLevel:6,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/Quest2.png",
	events:null
	});

// Adding Switch 2
// -----------------------------------------------------------
GDT.addPlatform({
	id:"c69c1fc9-0373-4744-8419-d9d68994dbdc",
	name:"Switch 2",
	company: "Nintendo",
	startAmount:6.9,
	unitsSold:7,
	licencePrize:3E5,
	published:"30/7/2",
	platformRetireDate:"260/12/4",
	developmentCosts:1E5,
	genreWeightings:[  0.9, 0.7, 1, 0.8, 0.7, 1 ],
	audienceWeightings:[  0.9, 1, 0.9 ],
	techLevel:7,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/NintendoSwitch2_Render.png",
	events:null
	});

// Adding VIC-20
// -----------------------------------------------------------
GDT.addPlatform({
	id:"8a5eed14-7441-4a75-9fa7-bb247218e627",
	name:"VIC-20",
	company:"Commodore",
	startAmount:0.04,
	unitsSold:0.047,
	licencePrize:1E3,
	published:"1/1/1",
	platformRetireDate:"3/3/1",
	developmentCosts:5E2,
	genreWeightings:[  0.6, 0.7, 0.6, 1, 0.9, 0.8 ],
	audienceWeightings:[  1, 0.8, 0.7 ],
	techLevel:1,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/640px-Commodore-VIC-20-FL-removebg-preview.png",
	events:null
	});

// Adding Wondermega
// -----------------------------------------------------------
GDT.addPlatform({
	id:"2aea63ad-c6b2-4ff5-a1c5-d5dbab38148a",
	name:"Wondermega",
	company:"Sega",
	startAmount:0.006,
	unitsSold:0.008,
	licencePrize:2E4,
	published:"6/2/3",
	platformRetireDate:"7/9/3",
	developmentCosts:1E4,
	genreWeightings:[  0.9, 0.6, 0.6, 0.7, 0.9, 1 ],
	audienceWeightings:[  0.7, 0.8, 1 ],
	techLevel:3,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/Console-wondermega-removebg-preview.png",
	events:null
	});

// Adding Logitech G Cloud
// -----------------------------------------------------------
GDT.addPlatform({
	id:"df9fb15c-e782-4f8f-ab6e-347441d44ab0",
	name:"Logitech G Cloud",
	company:"Logitech",
	startAmount:0.9,
	unitsSold:1,
	licencePrize:3E5,
	published:"28/10/1",
	platformRetireDate:"260/12/4",
	developmentCosts:1E5,
	genreWeightings:[  1, 0.6, 0.7, 0.9, 0.8, 0.6 ],
	audienceWeightings:[  1, 0.8, 0.7 ],
	techLevel:6,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/g-cloud-gallery-1-new.png",
	events:null
	});

// Adding Evercade Series
// -----------------------------------------------------------
GDT.addPlatform({
	id:"615c65ca-403f-4359-84bf-dfe5175ccf54",
	name:"Evercade Series",
	company:"Blaze Entertainment",
	startAmount:0.12,
	unitsSold:0.15,
	licencePrize:3E5,
	published:"27/5/1",
	platformRetireDate:"260/12/4",
	developmentCosts:1E5,
	genreWeightings:[  0.6, 0.8, 0.9, 0.6, 0.8, 1 ],
	audienceWeightings:[  1, 0.8, 0.7 ],
	techLevel:4,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/640px-Evercade_Original_Handheld_Console_SwitchedOff.png",
	events:null
	});

// Adding Color TV-Game
// -----------------------------------------------------------
GDT.addPlatform({
	id:"6c255f7c-3d30-4985-b5fd-a2263fa33464",
	name:"Color TV-Game",
	company:"Nintendo",
	startAmount:0.05,
	unitsSold:0.056,
	licencePrize:1E3,
	published:"1/1/1",
	platformRetireDate:"2/2/2",
	developmentCosts:5E2,
	genreWeightings:[  0.6, 0.9, 0.7, 0.8, 1, 0.9 ],
	audienceWeightings:[  0.7, 0.8, 0.9 ],
	techLevel:1,
	iconUri: AllconsolesII65_UME.modPath + "/images/platforms/640px-Color_TV-Game_15__Cut_out.png",
	events:null
	});



})();
