// ******************************************************************************************
// Mod Name: allconsoles935
// Mod Id: allconsoles935_UME
// Mod Version: 1.7.6
// Mod File: code.js
// ******************************************************************************************
// Author: UME
// Last modified: 2025-03-21
// ******************************************************************************************
// Notes: This file is loaded from main.js
// ******************************************************************************************

// Create the main mod object (our package)
var allconsoles935 = {};

(function(){

// ******************************************************************************************
// Platforms
// ******************************************************************************************

// Adding Amiga CD32
// -----------------------------------------------------------
GDT.addPlatform({
	id:"726c186a-6db7-40b4-bf3c-922ba76b03ce",
	name:"Amiga CD32",
	company:"Commodore",
	startAmount:0.003,
	unitsSold:0.0035,
	licencePrize:2E4,
	published:"6/11/2",
	platformRetireDate:"7/6/4",
	developmentCosts:1E4,
	genreWeightings:[  0.8, 0.9, 0.6, 1, 1, 0.7 ],
	audienceWeightings:[  0.7, 0.7, 0.6 ],
	techLevel:2,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/640px-Amiga-CD32-wController-L.png",
	events:null
	});

// Adding Atari XEGS
// -----------------------------------------------------------
GDT.addPlatform({
	id:"37dac48a-3821-4d28-a3c4-0e2752056322",
	name:"Atari XEGS",
	company:"Atari",
	startAmount:0.0015,
	unitsSold:0.002,
	licencePrize:1E4,
	published:"3/5/4",
	platformRetireDate:"6/5/1",
	developmentCosts:5E3,
	genreWeightings:[  0.7, 0.9, 1, 0.9, 1, 0.9 ],
	audienceWeightings:[  1, 0.9, 0.8 ],
	techLevel:1,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/640px-Atari_XEGS.png",
	events:null
	});

// Adding PC-FX
// -----------------------------------------------------------
GDT.addPlatform({
	id:"d3bffcb9-a01e-4f04-88f8-5685f0cfa955",
	name:"PC-FX",
	company:"NEC Home Electronics",
	startAmount:0.0025,
	unitsSold:0.0029,
	licencePrize:2E4,
	published:"7/7/2",
	platformRetireDate:"10/3/2",
	developmentCosts:1E4,
	genreWeightings:[  1, 0.7, 0.7, 1, 0.9, 0.7 ],
	audienceWeightings:[  0.7, 0.7, 1 ],
	techLevel:3,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/607px-NEC-PC-FX-wController-R.png",
	events:null
	});

// Adding Vectrex
// -----------------------------------------------------------
GDT.addPlatform({
	id:"4966b6e5-3696-4b58-8de1-e007a176a5a6",
	name:"Vectrex",
	company:"General Consumer Electric",
	startAmount:0.015,
	unitsSold:0.019,
	licencePrize:1E3,
	published:"1/9/1",
	platformRetireDate:"2/5/4",
	developmentCosts:5E2,
	genreWeightings:[  1, 0.7, 0.6, 0.9, 0.9, 0.6 ],
	audienceWeightings:[  0.7, 0.9, 1 ],
	techLevel:1,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/384px-Vectrex-Console-Set.png",
	events:null
	});

// Adding LaserActive
// -----------------------------------------------------------
GDT.addPlatform({
	id:"0b84979b-a896-449b-8136-5ac823b1226b",
	name:"LaserActive",
	company:"Pioneer Corporation",
	startAmount:0.00025,
	unitsSold:0.00028,
	licencePrize:2E4,
	published:"6/11/3",
	platformRetireDate:"9/2/1",
	developmentCosts:1E4,
	genreWeightings:[  0.7, 1, 0.8, 0.8, 0.9, 0.7 ],
	audienceWeightings:[  0.7, 0.8, 1 ],
	techLevel:2,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/617px-Pioneer-LaserActive-Set-FL.png",
	events:null
	});

// Adding Arcadia 2001
// -----------------------------------------------------------
GDT.addPlatform({
	id:"b3502e67-c7dd-4768-85a8-536d531d8a6b",
	name:"Arcadia 2001",
	company:"Emerson Radio",
	startAmount:0.016,
	unitsSold:0.019,
	licencePrize:1E3,
	published:"1/8/4",
	platformRetireDate:"2/8/3",
	developmentCosts:5E2,
	genreWeightings:[  0.6, 0.8, 0.6, 0.8, 1, 0.7 ],
	audienceWeightings:[  0.7, 0.8, 0.9 ],
	techLevel:1,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/640px-Emerson-Arcadia-2001.png",
	events:null
	});

// Adding Gizmondo
// -----------------------------------------------------------
GDT.addPlatform({
	id:"42168c06-ec97-45cb-8641-e1faac5cce60",
	name:"Gizmondo",
	company:"Tiger Telematics",
	startAmount:0.0012,
	unitsSold:0.0014,
	licencePrize:1E5,
	published:"15/1/1",
	platformRetireDate:"16/12/1",
	developmentCosts:7E4,
	genreWeightings:[  0.7, 0.7, 0.9, 0.9, 1, 0.9 ],
	audienceWeightings:[  0.6, 0.7, 1 ],
	techLevel:3,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/640px-Gizmondo.png",
	events:null
	});

// Adding Pippin
// -----------------------------------------------------------
GDT.addPlatform({
	id:"842b27d7-85e7-4ff1-919f-7a07da707f80",
	name:"Pippin",
	company:"Apple",
	startAmount:0.0012,
	unitsSold:0.0014,
	licencePrize:2E4,
	published:"9/2/4",
	platformRetireDate:"10/7/1",
	developmentCosts:1E4,
	genreWeightings:[  0.8, 0.9, 0.8, 0.9, 1, 0.8 ],
	audienceWeightings:[  0.8, 0.9, 1 ],
	techLevel:3,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/640px-Pippin-Atmark-Console-Set.png",
	events:null
	});

// Adding Atari 2600
// -----------------------------------------------------------
GDT.addPlatform({
	id:"04e40841-063b-439f-8bbc-9b0f997331f2",
	name:"Atari 2600",
	company:"Atari",
	startAmount:0.3,
	unitsSold:0.483,
	licencePrize:1E3,
	published:"1/1/1",
	platformRetireDate:"2/4/3",
	developmentCosts:5E2,
	genreWeightings:[  0.9, 0.7, 0.6, 0.7, 1, 0.7 ],
	audienceWeightings:[  1, 0.8, 0.8 ],
	techLevel:1,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/640px-Atari-2600-Wood-4Sw-Set.png",
	events:null
	});

// Adding Atari 5200
// -----------------------------------------------------------
GDT.addPlatform({
	id:"c0f169c0-bf5f-4149-bc72-3ed6b39a15b8",
	name:"Atari 5200",
	company:"Atari",
	startAmount:0.025,
	unitsSold:0.03,
	licencePrize:1E3,
	published:"1/8/1",
	platformRetireDate:"2/8/2",
	developmentCosts:5E2,
	genreWeightings:[  0.9, 0.8, 0.6, 0.8, 1, 0.7 ],
	audienceWeightings:[  1, 0.9, 0.8 ],
	techLevel:2,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/640px-Atari-5200-4-Port-wController-L.png",
	events:null
	});

// Adding Atari 7800
// -----------------------------------------------------------
GDT.addPlatform({
	id:"5fbf8204-1a88-4c8d-a4dd-6aa95c004dcb",
	name:"Atari 7800",
	company:"Atari",
	startAmount:0.07,
	unitsSold:0.078,
	licencePrize:1E4,
	published:"3/3/1",
	platformRetireDate:"6/2/1",
	developmentCosts:5E3,
	genreWeightings:[  0.9, 0.8, 0.6, 0.8, 1, 0.6 ],
	audienceWeightings:[  1, 0.9, 1 ],
	techLevel:2,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/640px-Atari-7800-wControl-Pad-L.png",
	events:null
	});

// Adding Lynx
// -----------------------------------------------------------
GDT.addPlatform({
	id:"5a72e526-edaa-4b66-a046-d00906d8c99f",
	name:"Lynx",
	company:"Atari",
	startAmount:0.04,
	unitsSold:0.044,
	licencePrize:1E4,
	published:"4/1/3",
	platformRetireDate:"8/6/1",
	developmentCosts:5E3,
	genreWeightings:[  0.8, 0.9, 0.6, 0.9, 1, 0.6 ],
	audienceWeightings:[  1, 0.8, 0.7 ],
	techLevel:3,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/640px-Atari-Lynx-I-Handheld.png",
	events:null
	});

// Adding Virtual boy
// -----------------------------------------------------------
GDT.addPlatform({
	id:"5af9fda5-a110-4516-9968-a7825750a887",
	name:"Virtual boy",
	company:"Nintendo",
	startAmount:0.02,
	unitsSold:0.024,
	licencePrize:2E4,
	published:"8/4/3",
	platformRetireDate:"9/4/1",
	developmentCosts:1E4,
	genreWeightings:[  0.7, 0.6, 0.6, 1, 0.8, 0.8 ],
	audienceWeightings:[  0.8, 0.6, 0.6 ],
	techLevel:2,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/378px-Virtual-Boy-Set.png",
	events:null
	});

// Adding Game & Watch(Wide Screen model)
// -----------------------------------------------------------
GDT.addPlatform({
	id:"987206ce-953f-4ac8-b67c-3788c5ede5a0",
	name:"Game & Watch(Wide Screen model)",
	company:"Nintendo",
	startAmount:0.17,
	unitsSold:0.193,
	licencePrize:1E3,
	published:"1/1/1",
	platformRetireDate:"4/5/2",
	developmentCosts:5E2,
	genreWeightings:[  1, 0.8, 0.6, 0.9, 1, 0.6 ],
	audienceWeightings:[  1, 0.9, 0.8 ],
	techLevel:1,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/Game_&_Watch.png",
	events:null
	});

// Adding Nintendo 3DS XL
// -----------------------------------------------------------
GDT.addPlatform({
	id:"c9a04f6f-9c0c-4e44-9eac-c7c91200999a",
	name:"Nintendo 3DS XL",
	company:"Nintendo",
	startAmount:1.8,
	unitsSold:1.96,
	licencePrize:2E5,
	published:"20/9/3",
	platformRetireDate:"27/8/1",
	developmentCosts:1E5,
	genreWeightings:[  0.8, 1, 0.9, 1, 1, 1 ],
	audienceWeightings:[  1, 0.9, 0.8 ],
	techLevel:4,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/602px-Nintendo-3DS-XL-angled.png",
	events:null
	});

// Adding Panasonic Q
// -----------------------------------------------------------
GDT.addPlatform({
	id:"044fe821-643b-466a-b1ef-7b150e6ee8b6",
	name:"Panasonic Q",
	company:"Nintendo",
	startAmount:0.004,
	unitsSold:0.005,
	licencePrize:1E5,
	published:"12/8/3",
	platformRetireDate:"13/5/4",
	developmentCosts:5E4,
	genreWeightings:[  1, 0.8, 0.8, 0.9, 1, 0.6 ],
	audienceWeightings:[  0.7, 0.8, 1 ],
	techLevel:4,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/640px-Panasonic-Q-Console-Set.png",
	events:null
	});

// Adding Wii Mini
// -----------------------------------------------------------
GDT.addPlatform({
	id:"f49df3e6-3d46-49b8-a050-b171bc6502fc",
	name:"Wii Mini",
	company:"Nintendo",
	startAmount:0.08,
	unitsSold:0.1,
	licencePrize:1E5,
	published:"19/1/2",
	platformRetireDate:"21/3/2",
	developmentCosts:7E4,
	genreWeightings:[  0.7, 1, 0.9, 1, 0.9, 1 ],
	audienceWeightings:[  1, 0.8, 0.7 ],
	techLevel:5,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/640px-Wii-Mini-Console-Set-H.png",
	events:null
	});

// Adding Game Boy Light
// -----------------------------------------------------------
GDT.addPlatform({
	id:"f771a5aa-1f40-4a6f-bfa2-a790a64a82ae",
	name:"Game Boy Light",
	company:"Nintendo",
	startAmount:0.06,
	unitsSold:0.068,
	licencePrize:2E4,
	published:"10/6/1",
	platformRetireDate:"13/3/1",
	developmentCosts:1E4,
	genreWeightings:[  0.7, 1, 0.9, 0.6, 1, 0.6 ],
	audienceWeightings:[  1, 0.9, 0.8 ],
	techLevel:2,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/293px-Game_Boy_Light.png",
	events:null
	});

// Adding Game Boy Advance
// -----------------------------------------------------------
GDT.addPlatform({
	id:"81eda46b-d3e7-47e3-a9e3-b733d5af1213",
	name:"Game Boy Advance",
	company:"Nintendo",
	startAmount:1.4,
	unitsSold:3.7,
	licencePrize:1E5,
	published:"11/9/4",
	platformRetireDate:"15/7/3",
	developmentCosts:5E4,
	genreWeightings:[  0.8, 1, 0.9, 0.7, 0.9, 0.8 ],
	audienceWeightings:[  1, 0.7, 0.8 ],
	techLevel:2,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/640px-Nintendo-Game-Boy-Advance-Purple-FL.png",
	events:null
	});

// Adding Game Boy Advance SP
// -----------------------------------------------------------
GDT.addPlatform({
	id:"6333f408-0727-4a26-928d-c5fe9c1b4e53",
	name:"Game Boy Advance SP",
	company:"Nintendo",
	startAmount:1.8,
	unitsSold:2.29,
	licencePrize:1E5,
	published:"13/6/1",
	platformRetireDate:"19/7/1",
	developmentCosts:5E4,
	genreWeightings:[  0.7, 0.8, 0.7, 0.9, 1, 0.8 ],
	audienceWeightings:[  1, 0.9, 0.9 ],
	techLevel:3,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/593px-Gameboy-Advance-SP-Mk2.png",
	events:null
	});

// Adding Game Boy Pocket
// -----------------------------------------------------------
GDT.addPlatform({
	id:"b3c32d77-3fc1-4175-86f7-637b90b06d14",
	name:"Game Boy Pocket",
	company:"Nintendo",
	startAmount:0.15,
	unitsSold:0.161,
	licencePrize:2E4,
	published:"9/2/3",
	platformRetireDate:"13/5/4",
	developmentCosts:1E4,
	genreWeightings:[  0.7, 0.9, 0.7, 0.9, 0.8, 0.6 ],
	audienceWeightings:[  1, 0.9, 0.8 ],
	techLevel:2,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/403px-Game-Boy-Pocket-FL.png",
	events:null
	});

// Adding Game Boy Micro
// -----------------------------------------------------------
GDT.addPlatform({
	id:"ddf90323-d673-4a13-a2de-c0349b8a76dd",
	name:"Game Boy Micro",
	company:"Nintendo",
	startAmount:0.12,
	unitsSold:0.142,
	licencePrize:1E5,
	published:"15/12/2",
	platformRetireDate:"19/1/2",
	developmentCosts:7E4,
	genreWeightings:[  0.9, 1, 0.8, 0.9, 1, 0.8 ],
	audienceWeightings:[  1, 0.9, 0.9 ],
	techLevel:3,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/640px-Game-Boy-Micro.png",
	events:null
	});

// Adding Atari Jaguar
// -----------------------------------------------------------
GDT.addPlatform({
	id:"92f49251-1e54-4b89-b593-16e9686ea96a",
	name:"Atari Jaguar",
	company:"Atari",
	startAmount:0.0065,
	unitsSold:0.0071,
	licencePrize:2E4,
	published:"6/12/3",
	platformRetireDate:"9/3/2",
	developmentCosts:1E4,
	genreWeightings:[  0.9, 0.8, 0.7, 0.9, 1, 0.8 ],
	audienceWeightings:[  0.8, 0.9, 1 ],
	techLevel:2,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/640px-Atari-Jaguar-Console-Set.png",
	events:null
	});

// Adding Nintendo DSi
// -----------------------------------------------------------
GDT.addPlatform({
	id:"ff29fd81-e1f2-4eca-a27f-7eaa804c8600",
	name:"Nintendo DSi",
	company:"Nintendo",
	startAmount:1.4,
	unitsSold:1.58,
	licencePrize:1E5,
	published:"14/1/1",
	platformRetireDate:"19/9/2",
	developmentCosts:7E4,
	genreWeightings:[  0.8, 0.9, 0.9, 1, 0.9, 1 ],
	audienceWeightings:[  1, 0.9, 0.8 ],
	techLevel:4,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/582px-Nintendo-DSi-Bl-Open.png",
	events:null
	});

// Adding New Nintendo 3DS
// -----------------------------------------------------------
GDT.addPlatform({
	id:"c03f2896-d150-4a52-9b57-80103d62a4b3",
	name:"New Nintendo 3DS",
	company:"Nintendo",
	startAmount:0.23,
	unitsSold:0.249,
	licencePrize:2E5,
	published:"20/8/1",
	platformRetireDate:"25/4/2",
	developmentCosts:1E5,
	genreWeightings:[  0.9, 0.8, 0.9, 0.9, 0.8, 0.9 ],
	audienceWeightings:[  1, 0.9, 0.8 ],
	techLevel:5,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/508px-New_Nintendo_3DS.png",
	events:null
	});

// Adding Nintendo NEW 2DS
// -----------------------------------------------------------
GDT.addPlatform({
	id:"f4d4bf06-996d-41c8-acae-adb8c4d5319e",
	name:"Nintendo NEW 2DS",
	company:"Nintendo",
	startAmount:0.5,
	unitsSold:0.551,
	licencePrize:2E5,
	published:"25/6/2",
	platformRetireDate:"27/8/4",
	developmentCosts:1E5,
	genreWeightings:[  0.8, 0.9, 1, 0.9, 0.9, 1 ],
	audienceWeightings:[  1, 0.8, 0.7 ],
	techLevel:4,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/623px-Nintendo-2DS-angle.png",
	events:null
	});

// Adding MYLO
// -----------------------------------------------------------
GDT.addPlatform({
	id:"22e9834c-72d5-461c-952d-8bbbe059a527",
	name:"MYLO",
	company:"Sony",
	startAmount:0.00075,
	unitsSold:0.003,
	licencePrize:1E5,
	published:"18/12/4",
	platformRetireDate:"19/9/4",
	developmentCosts:7E4,
	genreWeightings:[  0.7, 0.8, 0.7, 0.8, 0.9, 0.6 ],
	audienceWeightings:[  0.7, 0.8, 0.9 ],
	techLevel:3,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/Sony_Mylo_2_2.png",
	events:null
	});

// Adding Atari Flashback
// -----------------------------------------------------------
GDT.addPlatform({
	id:"7a49dcbd-1097-4ec2-bf8f-b76ab5084ea0",
	name:"Atari Flashback",
	company:"Atari",
	startAmount:0.085,
	unitsSold:0.097,
	licencePrize:1E5,
	published:"14/1/2",
	platformRetireDate:"260/1/1",
	developmentCosts:5E4,
	genreWeightings:[  0.8, 0.8, 0.6, 0.7, 1, 0.6 ],
	audienceWeightings:[  0.7, 0.8, 1 ],
	techLevel:2,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/112599-atari-flashback-2.png",
	events:null
	});

// Adding SG-1000 II
// -----------------------------------------------------------
GDT.addPlatform({
	id:"0d38c788-fb5e-4f4f-a162-bee577f71933",
	name:"SG-1000 II",
	company:"Sega",
	startAmount:0.029,
	unitsSold:0.034,
	licencePrize:1E3,
	published:"2/7/4",
	platformRetireDate:"3/10/4",
	developmentCosts:5E2,
	genreWeightings:[  0.6, 0.7, 0.6, 0.7, 0.9, 0.6 ],
	audienceWeightings:[  0.7, 0.7, 0.7 ],
	techLevel:1,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/SG-1000 II.png",
	events:null
	});

// Adding Atari ST
// -----------------------------------------------------------
GDT.addPlatform({
	id:"c5cefdd1-fe98-4114-8e28-82029e6daa33",
	name:"Atari ST",
	company:"Atari",
	startAmount:0.038,
	unitsSold:0.042,
	licencePrize:1E4,
	published:"2/12/4",
	platformRetireDate:"6/11/1",
	developmentCosts:5E3,
	genreWeightings:[  0.7, 0.8, 0.6, 0.8, 0.8, 0.6 ],
	audienceWeightings:[  0.6, 0.7, 0.9 ],
	techLevel:1,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/wfwfwfwfw.png",
	events:null
	});

// Adding WonderSwan
// -----------------------------------------------------------
GDT.addPlatform({
	id:"a9baef50-b0e5-47ad-a909-4bc6a1d9d9cb",
	name:"WonderSwan",
	company:"Bandai",
	startAmount:0.058,
	unitsSold:0.062,
	licencePrize:1E5,
	published:"10/11/2",
	platformRetireDate:"11/12/4",
	developmentCosts:5E4,
	genreWeightings:[  0.7, 0.9, 0.8, 0.8, 0.9, 0.7 ],
	audienceWeightings:[  0.8, 0.9, 1 ],
	techLevel:3,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/175px-WonderSwan-Black-Left.png",
	events:null
	});

// Adding WonderSwan Color
// -----------------------------------------------------------
GDT.addPlatform({
	id:"c02403fb-3adf-479d-ac75-96f90bbf7d78",
	name:"WonderSwan Color",
	company:"Bandai",
	startAmount:0.045,
	unitsSold:0.05,
	licencePrize:1E5,
	published:"11/9/3",
	platformRetireDate:"13/2/4",
	developmentCosts:5E4,
	genreWeightings:[  0.7, 0.9, 0.7, 0.8, 0.9, 0.8 ],
	audienceWeightings:[  0.8, 0.8, 0.8 ],
	techLevel:3,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/WonderSwan-Color-Blue-Left.png",
	events:null
	});

// Adding SwanCrystal
// -----------------------------------------------------------
GDT.addPlatform({
	id:"e2429a6b-bb46-4785-8c0a-f39283ecef7d",
	name:"SwanCrystal",
	company:"Bandai",
	startAmount:0.068,
	unitsSold:0.073,
	licencePrize:1E5,
	published:"13/2/3",
	platformRetireDate:"13/9/4",
	developmentCosts:5E4,
	genreWeightings:[  0.7, 1, 0.7, 0.9, 0.9, 0.7 ],
	audienceWeightings:[  0.7, 0.8, 0.7 ],
	techLevel:3,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/SwanCrystal-Wine-Left.png",
	events:null
	});

// Adding TurboGrafx-16
// -----------------------------------------------------------
GDT.addPlatform({
	id:"5f7782d7-65bc-4231-b5d7-824a3b88b4d9",
	name:"TurboGrafx-16",
	company:"NEC Home Electronics",
	startAmount:0.13,
	unitsSold:0.144,
	licencePrize:1E4,
	published:"4/1/2",
	platformRetireDate:"7/6/1",
	developmentCosts:5E3,
	genreWeightings:[  0.6, 0.8, 0.6, 0.8, 0.9, 0.7 ],
	audienceWeightings:[  0.8, 0.8, 1 ],
	techLevel:2,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/240px-TurboGrafx16-Console-Set.png",
	events:null
	});

// Adding Genesis Nomad
// -----------------------------------------------------------
GDT.addPlatform({
	id:"8b71665b-8135-4056-a2e7-0e09a2eadc39",
	name:"Genesis Nomad",
	company:"Sega",
	startAmount:0.028,
	unitsSold:0.031,
	licencePrize:2E4,
	published:"8/6/2",
	platformRetireDate:"11/1/2",
	developmentCosts:1E4,
	genreWeightings:[  0.7, 0.8, 0.7, 0.9, 0.9, 0.8 ],
	audienceWeightings:[  0.8, 0.8, 0.9 ],
	techLevel:2,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/250px-Sega-Nomad-Front.png",
	events:null
	});

// Adding Super A'Can
// -----------------------------------------------------------
GDT.addPlatform({
	id:"3eef780a-3f3a-4ef5-9a53-7c008c6d99dd",
	name:"Super A'Can",
	company:"Funtech",
	startAmount:0.0003,
	unitsSold:0.00037,
	licencePrize:2E4,
	published:"8/6/1",
	platformRetireDate:"9/3/4",
	developmentCosts:1E4,
	genreWeightings:[  1, 1, 1, 1, 1, 1 ],
	audienceWeightings:[  0.8, 0.8, 0.8 ],
	techLevel:3,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/Super-ACan-Console-set-h.png",
	events:null
	});

// Adding iQue Player
// -----------------------------------------------------------
GDT.addPlatform({
	id:"1d8ddbab-1b2c-47c8-9042-bce2cbf18a8a",
	name:"iQue Player",
	company:"Nintendo",
	startAmount:0.0006,
	unitsSold:0.00063,
	licencePrize:1E5,
	published:"13/5/2",
	platformRetireDate:"15/12/3",
	developmentCosts:5E4,
	genreWeightings:[  0.8, 0.9, 0.8, 0.8, 1, 0.7 ],
	audienceWeightings:[  0.8, 0.8, 0.8 ],
	techLevel:3,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/300px-Nintendo-N64-iQue-Player-FL.png",
	events:null
	});

// Adding XavixPORT
// -----------------------------------------------------------
GDT.addPlatform({
	id:"86623154-bb64-4ece-b3f6-a0678efacb9a",
	name:"XavixPORT",
	company:"SSD COMPANY LIMITED",
	startAmount:0.0005,
	unitsSold:0.00061,
	licencePrize:1E5,
	published:"14/1/3",
	platformRetireDate:"16/12/4",
	developmentCosts:5E4,
	genreWeightings:[  0.7, 0.6, 0.6, 0.9, 1, 0.7 ],
	audienceWeightings:[  1, 0.8, 0.7 ],
	techLevel:3,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/XaviX-XaviXPORT-Console-FL.png",
	events:null
	});

// Adding Zemmix
// -----------------------------------------------------------
GDT.addPlatform({
	id:"b660bfa9-1c99-4580-b340-bef061f2c41b",
	name:"Zemmix",
	company:"Daewoo Electronics",
	startAmount:0.0001,
	unitsSold:0.0005,
	licencePrize:1E4,
	published:"3/3/2",
	platformRetireDate:"7/7/4",
	developmentCosts:5E3,
	genreWeightings:[  0.8, 0.9, 0.6, 0.8, 1, 0.6 ],
	audienceWeightings:[  1, 0.7, 0.6 ],
	techLevel:1,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/untitled.png",
	events:null
	});

// Adding N-Gage
// -----------------------------------------------------------
GDT.addPlatform({
	id:"9ca1a66c-17db-4084-bf4e-01ca75884f20",
	name:"N-Gage",
	company:"Nokia",
	startAmount:0.1,
	unitsSold:0.105,
	licencePrize:1E5,
	published:"13/5/1",
	platformRetireDate:"17/2/1",
	developmentCosts:5E4,
	genreWeightings:[  0.6, 0.7, 0.7, 0.9, 0.9, 0.7 ],
	audienceWeightings:[  0.7, 0.8, 0.9 ],
	techLevel:4,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/Nokia-NGage-LL.png",
	events:null
	});

// Adding Game & watch (Micro VS. Model)
// -----------------------------------------------------------
GDT.addPlatform({
	id:"4bc4337f-1669-47ed-a148-f5cade6939c1",
	name:"Game & watch (Micro VS. Model)",
	company:"Nintendo",
	startAmount:0.012,
	unitsSold:0.015,
	licencePrize:1E4,
	published:"2/5/4",
	platformRetireDate:"3/12/4",
	developmentCosts:5E3,
	genreWeightings:[  0.7, 0.7, 0.6, 0.8, 1, 0.6 ],
	audienceWeightings:[  1, 1, 0.9 ],
	techLevel:1,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/200px-DKHockey.png",
	events:null
	});

// Adding Magnavox Odyssey 2
// -----------------------------------------------------------
GDT.addPlatform({
	id:"eb0c9e3d-e6e1-4a9b-ba63-92de907a5d8e",
	name:"Magnavox Odyssey 2",
	company:"Magnavox",
	startAmount:0.035,
	unitsSold:0.0377,
	licencePrize:1E3,
	published:"1/1/1",
	platformRetireDate:"2/8/1",
	developmentCosts:5E2,
	genreWeightings:[  0.9, 0.8, 0.6, 0.8, 0.9, 0.9 ],
	audienceWeightings:[  1, 0.9, 0.7 ],
	techLevel:1,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/300px-Magnavox-Odyssey-2-Console-Set.png",
	events:null
	});

// Adding CD-i
// -----------------------------------------------------------
GDT.addPlatform({
	id:"85bf4613-3a49-4959-91f2-6c3d7adfceff",
	name:"CD-i",
	company:"Philips",
	startAmount:0.022,
	unitsSold:0.027,
	licencePrize:2E4,
	published:"6/1/2",
	platformRetireDate:"10/5/4",
	developmentCosts:1E4,
	genreWeightings:[  0.8, 1, 0.9, 1, 0.7, 0.7 ],
	audienceWeightings:[  0.7, 0.8, 1 ],
	techLevel:3,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/640px-Philips-CDi-220-wController-FL.png",
	events:null
	});

// Adding 3DO Interactive Multiplayer
// -----------------------------------------------------------
GDT.addPlatform({
	id:"b5eab1b8-711b-4085-b1ed-387b5cf85ced",
	name:"3DO Interactive Multiplayer",
	company:"The 3DO Company",
	startAmount:0.05,
	unitsSold:0.057,
	licencePrize:2E4,
	published:"6/11/1",
	platformRetireDate:"9/2/1",
	developmentCosts:1E4,
	genreWeightings:[  0.6, 0.8, 0.9, 0.9, 0.7, 1 ],
	audienceWeightings:[  0.8, 0.9, 1 ],
	techLevel:4,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/640px-3DO-FZ1-Console-Set.png",
	events:null
	});

// Adding Neo-Geo AES
// -----------------------------------------------------------
GDT.addPlatform({
	id:"3124c6fe-4c68-458a-bebc-96ef367bce2e",
	name:"Neo-Geo AES",
	company:"SNK",
	startAmount:0.022,
	unitsSold:0.028,
	licencePrize:1E4,
	published:"5/3/1",
	platformRetireDate:"9/9/1",
	developmentCosts:5E3,
	genreWeightings:[  1, 0.6, 0.6, 0.9, 1, 0.6 ],
	audienceWeightings:[  0.8, 0.7, 0.9 ],
	techLevel:3,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/640px-Neo-Geo-AES-Console-Set.png",
	events:null
	});

// Adding HyperScan
// -----------------------------------------------------------
GDT.addPlatform({
	id:"e9e0a46c-7c18-4a29-adf7-869c3971fea3",
	name:"HyperScan",
	company:"Mattel",
	startAmount:0.0007,
	unitsSold:0.00076,
	licencePrize:1E5,
	published:"17/6/1",
	platformRetireDate:"18/8/4",
	developmentCosts:7E4,
	genreWeightings:[  0.9, 0.9, 0.6, 0.8, 0.7, 0.8 ],
	audienceWeightings:[  1, 0.7, 0.6 ],
	techLevel:4,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/640px-Mattel-HyperScan-wController-FL.png",
	events:null
	});

// Adding Zeebo
// -----------------------------------------------------------
GDT.addPlatform({
	id:"ef826ca2-17b2-4590-b71d-f75fe4e786f1",
	name:"Zeebo",
	company:"Zeebo Inc",
	startAmount:0.0023,
	unitsSold:0.0027,
	licencePrize:1E5,
	published:"19/3/1",
	platformRetireDate:"20/3/1",
	developmentCosts:7E4,
	genreWeightings:[  0.7, 0.9, 0.6, 0.8, 1, 0.9 ],
	audienceWeightings:[  1, 0.7, 0.6 ],
	techLevel:3,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/zeebo.png",
	events:null
	});

// Adding Advanced Pico Beena
// -----------------------------------------------------------
GDT.addPlatform({
	id:"06309cc0-0295-4c4d-956a-30ea917111ab",
	name:"Advanced Pico Beena",
	company:"Sega",
	startAmount:0.23,
	unitsSold:0.256,
	licencePrize:1E5,
	published:"16/5/4",
	platformRetireDate:"17/12/4",
	developmentCosts:7E4,
	genreWeightings:[  0.7, 0.9, 0.7, 0.7, 1, 1 ],
	audienceWeightings:[  1, 0.7, 0.6 ],
	techLevel:2,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/thUQL5S1W4.png",
	events:null
	});

// Adding V.Flash
// -----------------------------------------------------------
GDT.addPlatform({
	id:"173b2d90-b8f0-40c0-9b29-3417933e7485",
	name:"V.Flash",
	company:"VTech",
	startAmount:0.001,
	unitsSold:0.0015,
	licencePrize:1E5,
	published:"17/6/2",
	platformRetireDate:"18/9/1",
	developmentCosts:7E4,
	genreWeightings:[  0.7, 0.8, 0.6, 0.9, 1, 0.9 ],
	audienceWeightings:[  1, 0.7, 0.6 ],
	techLevel:3,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/v flash.png",
	events:null
	});

// Adding Game Wave Family Entertainment System
// -----------------------------------------------------------
GDT.addPlatform({
	id:"8a3e1c13-9d18-4cdf-bb8d-eb1101efd115",
	name:"Game Wave Family Entertainment System",
	company:"ZAPiT Games",
	startAmount:0.004,
	unitsSold:0.0043,
	licencePrize:1E5,
	published:"16/7/2",
	platformRetireDate:"19/6/1",
	developmentCosts:7E4,
	genreWeightings:[  0.8, 0.7, 0.9, 0.9, 1, 0.9 ],
	audienceWeightings:[  0.9, 0.8, 0.8 ],
	techLevel:4,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/300px-Game-Wave-Console-Set-FL.png",
	events:null
	});

// Adding Intellivision
// -----------------------------------------------------------
GDT.addPlatform({
	id:"b46a8924-4bb3-4ba2-b865-0fdfc1640847",
	name:"Intellivision",
	company:"Mattel",
	startAmount:0.06,
	unitsSold:0.07,
	licencePrize:1E3,
	published:"1/1/1",
	platformRetireDate:"2/7/4",
	developmentCosts:5E2,
	genreWeightings:[  0.6, 0.9, 0.6, 0.8, 1, 0.6 ],
	audienceWeightings:[  1, 0.9, 0.8 ],
	techLevel:1,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/640px-Intellivision-Console-Set.png",
	events:null
	});

// Adding V.Smile
// -----------------------------------------------------------
GDT.addPlatform({
	id:"577f84dc-c961-4a94-9b93-afc912056975",
	name:"V.Smile",
	company:"VTech",
	startAmount:0.58,
	unitsSold:0.611,
	licencePrize:1E5,
	published:"13/11/2",
	platformRetireDate:"17/8/1",
	developmentCosts:5E4,
	genreWeightings:[  0.7, 0.8, 0.6, 0.8, 1, 0.9 ],
	audienceWeightings:[  1, 0.7, 0.6 ],
	techLevel:3,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/215px-Vtech_Vsmile_French_version.png",
	events:null
	});

// Adding PC Engine
// -----------------------------------------------------------
GDT.addPlatform({
	id:"3a6f3f42-2d16-41fb-9854-28f1d883be89",
	name:"PC Engine",
	company:"NEC Home Electronics",
	startAmount:0.09,
	unitsSold:0.104,
	licencePrize:1E4,
	published:"3/5/3",
	platformRetireDate:"7/4/3",
	developmentCosts:5E3,
	genreWeightings:[  0.9, 0.9, 0.7, 0.9, 0.7, 0.7 ],
	audienceWeightings:[  0.7, 0.9, 1 ],
	techLevel:2,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/640px-PC-Engine-Console-Set.png",
	events:null
	});

// Adding Nvidia Shield Portable
// -----------------------------------------------------------
GDT.addPlatform({
	id:"2b6a3581-28c0-48cb-8716-da47e36d9874",
	name:"Nvidia Shield Portable",
	company:"Nvidia",
	startAmount:0.25,
	unitsSold:0.3,
	licencePrize:2E5,
	published:"23/1/1",
	platformRetireDate:"25/10/1",
	developmentCosts:1E5,
	genreWeightings:[  0.9, 0.7, 0.8, 1, 0.7, 0.9 ],
	audienceWeightings:[  0.7, 0.8, 1 ],
	techLevel:4,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/479px-NvidiaShieldPortable.png",
	events:null
	});

// Adding Nvidia Shield
// -----------------------------------------------------------
GDT.addPlatform({
	id:"d5c53f11-930f-48ce-8117-b1f600f2a962",
	name:"Nvidia Shield",
	company:"Nvidia",
	startAmount:0.08,
	unitsSold:0.1,
	licencePrize:2E5,
	published:"24/5/3",
	platformRetireDate:"26/3/1",
	developmentCosts:1E8,
	genreWeightings:[  1, 0.7, 0.9, 0.9, 1, 0.6 ],
	audienceWeightings:[  0.7, 0.9, 1 ],
	techLevel:5,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/OIPJRL8NLWK.png",
	events:null
	});

// Adding FM Towns Marty
// -----------------------------------------------------------
GDT.addPlatform({
	id:"043b9bb9-66c7-4437-adaa-b4325ca4a500",
	name:"FM Towns Marty",
	company:"Fujitsu",
	startAmount:0.0001,
	unitsSold:0.0012,
	licencePrize:2E4,
	published:"6/8/4",
	platformRetireDate:"8/1/1",
	developmentCosts:1E4,
	genreWeightings:[  0.6, 0.9, 0.6, 0.9, 0.7, 1 ],
	audienceWeightings:[  0.8, 0.9, 0.9 ],
	techLevel:3,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/640px-FM-Towns-Marty-Console-Set.png",
	events:null
	});

// Adding OnLive
// -----------------------------------------------------------
GDT.addPlatform({
	id:"9b7f4ccb-fdbb-403a-9935-14bf780fff32",
	name:"OnLive",
	company:"Cloud gaming",
	startAmount:0.016,
	unitsSold:0.02,
	licencePrize:1E5,
	published:"19/9/3",
	platformRetireDate:"22/4/4",
	developmentCosts:7E4,
	genreWeightings:[  1, 0.7, 0.6, 0.9, 0.8, 0.7 ],
	audienceWeightings:[  0.7, 0.8, 1 ],
	techLevel:4,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/360px-OnLive_MicroConsole_TV_Adapter_top.png",
	events:null
	});

// Adding Game & watch (Vertical Multi Screen Model)
// -----------------------------------------------------------
GDT.addPlatform({
	id:"0eb251b9-86d5-4068-9c61-c3b86f4b2333",
	name:"Game & watch (Vertical Multi Screen Model)",
	company:"Nintendo",
	startAmount:0.21,
	unitsSold:0.24,
	licencePrize:1E3,
	published:"1/8/3",
	platformRetireDate:"4/8/4",
	developmentCosts:5E2,
	genreWeightings:[  0.7, 0.7, 0.6, 0.8, 1, 0.8 ],
	audienceWeightings:[  1, 0.9, 0.8 ],
	techLevel:1,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/150px-Black_Jack_-_Game&Watch_-_Nintendo.png",
	events:null
	});

// Adding Game & watch (Horizontal Multi Screen Model)
// -----------------------------------------------------------
GDT.addPlatform({
	id:"48c48a2d-4a06-4176-894e-6062a2ce85b0",
	name:"Game & watch (Horizontal Multi Screen Model)",
	company:"Nintendo",
	startAmount:0.03,
	unitsSold:0.034,
	licencePrize:1E3,
	published:"2/2/3",
	platformRetireDate:"3/5/4",
	developmentCosts:5E2,
	genreWeightings:[  0.8, 1, 0.6, 0.6, 0.9, 0.7 ],
	audienceWeightings:[  1, 0.9, 0.9 ],
	techLevel:1,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/thPX4LK0RZ.png",
	events:null
	});

// Adding Game & watch (Table Top Model)
// -----------------------------------------------------------
GDT.addPlatform({
	id:"80ed75b4-1bfb-4e72-8853-3f480b8877de",
	name:"Game & watch (Table Top Model)",
	company:"Nintendo",
	startAmount:0.04,
	unitsSold:0.047,
	licencePrize:1E3,
	published:"1/5/1",
	platformRetireDate:"2/10/4",
	developmentCosts:5E2,
	genreWeightings:[  0.8, 0.9, 0.6, 0.8, 0.9, 0.6 ],
	audienceWeightings:[  1, 0.9, 0.8 ],
	techLevel:1,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/t8ugmztd7t791-removebg-preview.png",
	events:null
	});

// Adding Entex Adventure Vision
// -----------------------------------------------------------
GDT.addPlatform({
	id:"879f8f2e-d5aa-4db2-9f4b-87ecce0aa9c8",
	name:"Entex Adventure Vision",
	company:"Entex Industries",
	startAmount:0.0009,
	unitsSold:0.00097,
	licencePrize:1E3,
	published:"1/9/2",
	platformRetireDate:"2/5/1",
	developmentCosts:5E2,
	genreWeightings:[  0.7, 0.6, 0.6, 0.7, 1, 0.8 ],
	audienceWeightings:[  1, 0.8, 0.7 ],
	techLevel:1,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/848790Entex-AdventureVision.png",
	events:null
	});

// Adding Macintosh 128K
// -----------------------------------------------------------
GDT.addPlatform({
	id:"08abc0f2-54f5-4c51-9c0a-f1134c8226db",
	name:"Macintosh 128K",
	company:"Apple",
	startAmount:0.004,
	unitsSold:0.0051,
	licencePrize:1E3,
	published:"2/6/3",
	platformRetireDate:"3/10/1",
	developmentCosts:5E2,
	genreWeightings:[  0.6, 0.7, 0.6, 0.8, 1, 0.7 ],
	audienceWeightings:[  0.6, 0.8, 0.9 ],
	techLevel:1,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/102px-Macintosh_128k_transparency.png",
	events:null
	});

// Adding Macintosh 512K
// -----------------------------------------------------------
GDT.addPlatform({
	id:"897b7ac7-dd79-4097-b3da-b2c1bbc91386",
	name:"Macintosh 512K",
	company:"Apple",
	startAmount:0.018,
	unitsSold:0.0204,
	licencePrize:1E4,
	published:"2/7/2",
	platformRetireDate:"3/5/4",
	developmentCosts:5E3,
	genreWeightings:[  0.7, 0.6, 0.6, 0.9, 1, 0.6 ],
	audienceWeightings:[  0.6, 0.8, 0.9 ],
	techLevel:2,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/370px-Mac512k-front.png",
	events:null
	});

// Adding Nintendo Switch Lite
// -----------------------------------------------------------
GDT.addPlatform({
	id:"2accb39b-b5a1-4bb0-9380-b7b0f1bb6ca1",
	name:"Nintendo Switch Lite",
	company:"Nintendo",
	startAmount:2.3,
	unitsSold:2.5,
	licencePrize:3E5,
	published:"26/11/4",
	platformRetireDate:"260/12/4",
	developmentCosts:1E5,
	genreWeightings:[  0.9, 0.7, 1, 0.8, 0.7, 1 ],
	audienceWeightings:[  1, 0.9, 0.8 ],
	techLevel:5,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/first-look-at-nintendo-switch-lite-new-addition-to-the-ninte_aybr.png",
	events:null
	});

// Adding Neo Geo X
// -----------------------------------------------------------
GDT.addPlatform({
	id:"ac9af83d-6420-43a7-b8e3-b00e7f0584c4",
	name:"Neo Geo X",
	company:"Tommo - Blaze",
	startAmount:0.004,
	unitsSold:0.006,
	licencePrize:1E5,
	published:"21/7/2",
	platformRetireDate:"24/1/1",
	developmentCosts:7E4,
	genreWeightings:[  1, 0.7, 0.8, 0.9, 1, 0.7 ],
	audienceWeightings:[  0.7, 0.8, 1 ],
	techLevel:4,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/neo-geo-X_184x138.png",
	events:null
	});

// Adding Kids Pad 
// -----------------------------------------------------------
GDT.addPlatform({
	id:"89ee8dc7-d630-431a-ba02-ebb65d88dcb6",
	name:"Kids Pad",
	company:"LG Corporation",
	startAmount:0.003,
	unitsSold:0.005,
	licencePrize:1E5,
	published:"22/11/3",
	platformRetireDate:"23/10/4",
	developmentCosts:7E4,
	genreWeightings:[  0.6, 0.8, 0.9, 0.7, 0.8, 1 ],
	audienceWeightings:[  1, 0.7, 0.6 ],
	techLevel:3,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/496694.png",
	events:null
	});

// Adding PlayStation Vita 
// -----------------------------------------------------------
GDT.addPlatform({
	id:"dea4579f-0126-4d1c-98cd-89192497785c",
	name:"PlayStation Vita",
	company:"Sony",
	startAmount:1.4,
	unitsSold:1.5,
	licencePrize:1E5,
	published:"20/5/4",
	platformRetireDate:"26/9/1",
	developmentCosts:7E4,
	genreWeightings:[  1, 0.8, 0.9, 0.9, 0.7, 0.8 ],
	audienceWeightings:[  0.7, 0.8, 0.9 ],
	techLevel:4,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/640px-PlayStation-Vita-1101-FL.png",
	events:null
	});

// Adding K-Magic 
// -----------------------------------------------------------
GDT.addPlatform({
	id:"fc2e8f26-04a9-493d-8d48-d72896285447",
	name:"K-Magic",
	company:"K's Kids",
	startAmount:0.00037,
	unitsSold:0.0025,
	licencePrize:1E5,
	published:"19/9/4",
	platformRetireDate:"21/3/4",
	developmentCosts:7E4,
	genreWeightings:[  0.6, 0.7, 0.8, 0.6, 0.7, 0.9 ],
	audienceWeightings:[  1, 0.7, 0.6 ],
	techLevel:3,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/Screen-shot-2011-08-22-at-11.31.00-AM-e1314037898779.png",
	events:null
	});

// Adding InnoTab 
// -----------------------------------------------------------
GDT.addPlatform({
	id:"6bdee508-e6eb-4f2a-9182-487738545521",
	name:"InnoTab",
	company:"VTech",
	startAmount:0.04,
	unitsSold:0.05,
	licencePrize:1E5,
	published:"19/10/1",
	platformRetireDate:"24/9/3",
	developmentCosts:7E4,
	genreWeightings:[  0.6, 0.7, 0.8, 0.7, 0.9, 1 ],
	audienceWeightings:[  1, 0.7, 0.6 ],
	techLevel:2,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/81ac4388-482e-4444-b3b7-e8f9c4bde28e_1.253c562ad3c4db0e497e4e864bdae6b6.png",
	events:null
	});

// Adding iXL 
// -----------------------------------------------------------
GDT.addPlatform({
	id:"70cf14ec-40e7-4828-93de-9a779e6f0bb1",
	name:"iXL",
	company:"Mattel",
	startAmount:0.0037,
	unitsSold:0.012,
	licencePrize:1E5,
	published:"19/8/3",
	platformRetireDate:"21/1/2",
	developmentCosts:7E4,
	genreWeightings:[  0.6, 0.7, 1, 0.8, 0.8, 0.9 ],
	audienceWeightings:[  1, 0.7, 0.6 ],
	techLevel:3,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/t30600.png",
	events:null
	});

// Adding Google TV
// -----------------------------------------------------------
GDT.addPlatform({
	id:"97287db1-5909-43f3-b8d5-ee17ed45dfb9",
	name:"Google TV",
	company:"Google",
	startAmount:4.2,
	unitsSold:5.2,
	licencePrize:1E5,
	published:"19/11/4",
	platformRetireDate:"260/12/4",
	developmentCosts:7E4,
	genreWeightings:[  0.7, 0.7, 0.6, 0.8, 0.6, 0.7 ],
	audienceWeightings:[  0.8, 0.9, 0.8 ],
	techLevel:4,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/Google-TV-Box.png",
	events:null
	});

// Adding GameStick
// -----------------------------------------------------------
GDT.addPlatform({
	id:"2475e978-e666-4708-b921-5d6240ab34fa",
	name:"GameStick",
	company:"PlayJam",
	startAmount:0.0015,
	unitsSold:0.002,
	licencePrize:2E5,
	published:"23/8/2",
	platformRetireDate:"25/12/3",
	developmentCosts:1E5,
	genreWeightings:[  0.7, 1, 0.9, 0.7, 0.9, 0.7 ],
	audienceWeightings:[  0.8, 0.9, 1 ],
	techLevel:4,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/gamestick-1_2723037k.png",
	events:null
	});

// Adding Caanoo
// -----------------------------------------------------------
GDT.addPlatform({
	id:"282a8ca1-5d86-40c1-99ca-ab2030dac1f7",
	name:"Caanoo",
	company:"GamePark",
	startAmount:0.00022,
	unitsSold:0.0012,
	licencePrize:1E5,
	published:"19/9/2",
	platformRetireDate:"20/6/4",
	developmentCosts:7E4,
	genreWeightings:[  0.9, 0.9, 0.7, 0.7, 1, 0.8 ],
	audienceWeightings:[  0.8, 0.9, 0.9 ],
	techLevel:4,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/640px-CAANOO.png",
	events:null
	});

// Adding Leapster Explorer
// -----------------------------------------------------------
GDT.addPlatform({
	id:"6c968af2-d547-41e9-ab6e-fa5e06f8ecc0",
	name:"Leapster Explorer",
	company:"LeapFrog Enterprises",
	startAmount:0.28,
	unitsSold:0.333,
	licencePrize:1E5,
	published:"19/9/1",
	platformRetireDate:"20/12/4",
	developmentCosts:7E4,
	genreWeightings:[  0.6, 0.9, 1, 0.6, 0.7, 1 ],
	audienceWeightings:[  1, 0.7, 0.6 ],
	techLevel:4,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/leapfrog-console-leapster-explorer-rose-1047050642_L.png",
	events:null
	});

// Adding Mojo
// -----------------------------------------------------------
GDT.addPlatform({
	id:"92a6e88b-ea10-4f5a-9210-437d7a6c9977",
	name:"Mojo",
	company:"Mad Catz",
	startAmount:0.0006,
	unitsSold:0.00075,
	licencePrize:2E2,
	published:"23/10/1",
	platformRetireDate:"25/2/4",
	developmentCosts:1E2,
	genreWeightings:[  1, 0.8, 0.7, 0.9, 0.7, 0.6 ],
	audienceWeightings:[  0.8, 0.9, 1 ],
	techLevel:4,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/Mad_Catz_M.O.J.O.png",
	events:null
	});

// Adding PlayStation TV
// -----------------------------------------------------------
GDT.addPlatform({
	id:"f2cef3d7-a446-4bc3-b279-992e3c6c6a3a",
	name:"PlayStation TV",
	company:"Sony",
	startAmount:0.09,
	unitsSold:0.11,
	licencePrize:2E5,
	published:"23/8/1",
	platformRetireDate:"24/10/4",
	developmentCosts:1E5,
	genreWeightings:[  0.9, 0.7, 0.8, 0.9, 0.7, 0.7 ],
	audienceWeightings:[  0.7, 0.8, 1 ],
	techLevel:4,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/640px-PlayStation-TV-FL.png",
	events:null
	});

// Adding Fire TV
// -----------------------------------------------------------
GDT.addPlatform({
	id:"5c55dbb4-34ac-43b7-861b-2d20ccaf6219",
	name:"Fire TV",
	company:"Amazon",
	startAmount:1,
	unitsSold:1.1,
	licencePrize:2E5,
	published:"24/1/2",
	platformRetireDate:"25/1/4",
	developmentCosts:1E5,
	genreWeightings:[  0.8, 0.7, 0.9, 1, 0.6, 0.8 ],
	audienceWeightings:[  0.7, 0.8, 0.9 ],
	techLevel:4,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/640px-Amazon_Fire_TV_with_remote.png",
	events:null
	});

// Adding Nexus Player
// -----------------------------------------------------------
GDT.addPlatform({
	id:"06ab0a31-456b-46fc-84b7-e23df07a613b",
	name:"Nexus Player",
	company:"Asus",
	startAmount:0.018,
	unitsSold:0.025,
	licencePrize:2E5,
	published:"24/3/1",
	platformRetireDate:"24/11/4",
	developmentCosts:1E5,
	genreWeightings:[  0.9, 0.7, 0.8, 1, 0.7, 0.8 ],
	audienceWeightings:[  0.7, 0.8, 0.9 ],
	techLevel:4,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/Nexus-Player.png",
	events:null
	});

// Adding Fire-TV Stick Series
// -----------------------------------------------------------
GDT.addPlatform({
	id:"8c8beca8-83c6-4695-8619-c2ed788446f7",
	name:"Fire-TV Stick Series",
	company:"Amazon",
	startAmount:3.8,
	unitsSold:4.2,
	licencePrize:2E5,
	published:"25/1/1",
	platformRetireDate:"260/12/4",
	developmentCosts:1E5,
	genreWeightings:[  0.7, 0.8, 0.9, 1, 0.6, 0.8 ],
	audienceWeightings:[  0.7, 0.8, 0.9 ],
	techLevel:4,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/31gFK-y4+ZL._SY300_QL70_.png",
	events:null
	});

// Adding Apple TV (fourth generation and later)
// -----------------------------------------------------------
GDT.addPlatform({
	id:"c6c85256-604b-482d-b9ae-486fb01c0950",
	name:"Apple TV",
	company:"Apple",
	startAmount:4.1,
	unitsSold:4.8,
	licencePrize:2E5,
	published:"24/8/4",
	platformRetireDate:"260/12/4",
	developmentCosts:1E5,
	genreWeightings:[  0.9, 0.6, 0.6, 1, 0.7, 0.9 ],
	audienceWeightings:[  0.9, 0.8, 0.7 ],
	techLevel:5,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/s0998864_sc7.png",
	events:null
	});

// Adding Atari VCS
// -----------------------------------------------------------
GDT.addPlatform({
	id:"0f6b3344-203b-442b-93fc-11755d94bea0",
	name:"Atari VCS",
	company:"Atari",
	startAmount:0.0025,
	unitsSold:0.003,
	licencePrize:3E5,
	published:"28/4/4",
	platformRetireDate:"260/12/4",
	developmentCosts:1E5,
	genreWeightings:[  1, 1, 1, 1, 1, 1 ],
	audienceWeightings:[  1, 1, 1 ],
	techLevel:4,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/atari-vcs-pre-order-01-480x320.png",
	events:null
	});

// Adding MobiGo 
// -----------------------------------------------------------
GDT.addPlatform({
	id:"455c2061-51e0-4a59-86f2-8aa2d4d5bf40",
	name:"MobiGo",
	company:"VTech",
	startAmount:0.0075,
	unitsSold:0.02,
	licencePrize:1E5,
	published:"19/10/2",
	platformRetireDate:"21/10/4",
	developmentCosts:7E4,
	genreWeightings:[  0.7, 0.9, 1, 0.6, 0.9, 1 ],
	audienceWeightings:[  1, 0.7, 0.6 ],
	techLevel:3,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/e8cac82d-c5b9-43a7-ae1a-402632b88a6b_1.df17daeadb6f18a1d41dd065fb555736.png",
	events:null
	});

// Adding Pandora 
// -----------------------------------------------------------
GDT.addPlatform({
	id:"de902143-84dd-4ca6-9e7b-86635f99749f",
	name:"Pandora",
	company:"OpenPandora",
	startAmount:0.0004,
	unitsSold:0.00045,
	licencePrize:1E5,
	published:"19/5/4",
	platformRetireDate:"20/8/4",
	developmentCosts:7E4,
	genreWeightings:[  0.6, 0.8, 0.8, 0.7, 0.9, 0.8 ],
	audienceWeightings:[  0.7, 0.8, 0.9 ],
	techLevel:3,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/250px-Pandora-latest-080508.png",
	events:null
	});

// Adding GP2X Wiz
// -----------------------------------------------------------
GDT.addPlatform({
	id:"13de6e39-394e-4d45-95f5-62a4dfd001d8",
	name:"GP2X Wiz",
	company:"GamePark",
	startAmount:0.001,
	unitsSold:0.00175,
	licencePrize:1E5,
	published:"19/5/3",
	platformRetireDate:"20/7/4",
	developmentCosts:7E4,
	genreWeightings:[  0.7, 0.8, 0.7, 0.9, 0.9, 0.8 ],
	audienceWeightings:[  0.7, 0.8, 0.9 ],
	techLevel:3,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/Gp2xwiz.png",
	events:null
	});

// Adding Dingoo A320
// -----------------------------------------------------------
GDT.addPlatform({
	id:"409204a2-1c10-46b4-a859-eb95db9c81a7",
	name:"Dingoo A320",
	company:"Dingoo Digital Technology",
	startAmount:0.06,
	unitsSold:0.076,
	licencePrize:1E5,
	published:"19/3/2",
	platformRetireDate:"20/12/4",
	developmentCosts:7E4,
	genreWeightings:[  0.9, 0.8, 0.8, 1, 1, 0.7 ],
	audienceWeightings:[  0.8, 0.9, 1 ],
	techLevel:3,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/640px-Dingoo_A320_White.png",
	events:null
	});

// Adding Neo Geo Mini
// -----------------------------------------------------------
GDT.addPlatform({
	id:"1caa60db-bd67-492e-a355-bbb67be35c2b",
	name:"Neo Geo Mini",
	company:"SNK",
	startAmount:0.07,
	unitsSold:0.1,
	licencePrize:2E5,
	published:"26/5/1",
	platformRetireDate:"260/12/4",
	developmentCosts:1E5,
	genreWeightings:[  1, 0.8, 0.8, 0.9, 0.8, 0.6 ],
	audienceWeightings:[  0.7, 0.8, 0.9 ],
	techLevel:3,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/514m_2BwbNfyL_large.png",
	events:null
	});

// Adding V.Smile Baby Infant Development System
// -----------------------------------------------------------
GDT.addPlatform({
	id:"020efeeb-5f19-4a38-8a94-d530062508db",
	name:"V.Smile Baby Infant Development System",
	company:"VTech",
	startAmount:0.008,
	unitsSold:0.01,
	licencePrize:1E5,
	published:"17/3/4",
	platformRetireDate:"18/12/4",
	developmentCosts:7E4,
	genreWeightings:[  0.7, 0.9, 1, 0.9, 0.7, 1 ],
	audienceWeightings:[  1, 0.7, 0.6 ],
	techLevel:2,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/595px-VTech-V.Smile-Baby-Console.png",
	events:null
	});

// Adding Zodiac
// -----------------------------------------------------------
GDT.addPlatform({
	id:"118bd76d-507c-44d0-8633-22ef826a9ad4",
	name:"Zodiac",
	company:"Tapwave",
	startAmount:0.01,
	unitsSold:0.0105,
	licencePrize:1E5,
	published:"13/2/4",
	platformRetireDate:"15/12/2",
	developmentCosts:5E4,
	genreWeightings:[  0.9, 0.8, 0.7, 0.9, 0.8, 0.7 ],
	audienceWeightings:[  0.7, 0.8, 0.9 ],
	techLevel:3,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/628px-Tapwave-Zodiac2-FL.png",
	events:null
	});

// Adding R-Zone
// -----------------------------------------------------------
GDT.addPlatform({
	id:"c27b154b-9a56-4528-bec5-340d9208036a",
	name:"R-Zone",
	company:"Tiger Electronics",
	startAmount:0.007,
	unitsSold:0.009,
	licencePrize:2E4,
	published:"8/4/2",
	platformRetireDate:"9/10/1",
	developmentCosts:1E4,
	genreWeightings:[  1, 0.7, 0.9, 0.9, 0.6, 0.7 ],
	audienceWeightings:[  0.9, 0.8, 0.9 ],
	techLevel:3,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/640px-Tiger-RZone-Headset.png",
	events:null
	});

// Adding Game.com
// -----------------------------------------------------------
GDT.addPlatform({
	id:"f6560638-bc90-4ce0-9fe4-3896b0709e15",
	name:"Game.com",
	company:"Tiger Electronics",
	startAmount:0.012,
	unitsSold:0.015,
	licencePrize:2E4,
	published:"13/7/2",
	platformRetireDate:"15/6/3",
	developmentCosts:1E4,
	genreWeightings:[  1, 0.8, 0.9, 0.8, 0.8, 0.8 ],
	audienceWeightings:[  0.8, 0.9, 0.9 ],
	techLevel:3,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/634px-Tiger-Game-Com-FL.png",
	events:null
	});

// Adding Visual Memory Unit
// -----------------------------------------------------------
GDT.addPlatform({
	id:"e13ce6d0-600e-43c1-b2af-f477982e2cbc",
	name:"Visual Memory Unit",
	company:"Sega",
	startAmount:0.3,
	unitsSold:0.333,
	licencePrize:2E4,
	published:"10/8/4",
	platformRetireDate:"11/11/4",
	developmentCosts:1E4,
	genreWeightings:[  0.8, 0.9, 0.6, 0.7, 1, 0.9 ],
	audienceWeightings:[  0.8, 0.8, 0.9 ],
	techLevel:2,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/366px-Sega-Dreamcast-VMU.png",
	events:null
	});

// Adding Children's Discovery System 
// -----------------------------------------------------------
GDT.addPlatform({
	id:"a7a48a71-ed4f-47c2-bd2e-c5966b1e6ce9",
	name:"Children's Discovery System",
	company:"Mattel",
	startAmount:0.0009,
	unitsSold:0.001,
	licencePrize:1E3,
	published:"1/3/4",
	platformRetireDate:"2/8/1",
	developmentCosts:5E2,
	genreWeightings:[  0.7, 0.9, 1, 0.9, 0.7, 1 ],
	audienceWeightings:[  1, 0.7, 0.6 ],
	techLevel:1,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/563px-Childrens_Discovery_System_-_Image_-_1981.png",
	events:null
	});

// Adding 3D Gamate
// -----------------------------------------------------------
GDT.addPlatform({
	id:"b2e70a4a-bea7-46e5-ba7a-ec594ed12695",
	name:"3D Gamate",
	company:"VTech",
	startAmount:0.001,
	unitsSold:0.0025,
	licencePrize:1E3,
	published:"2/2/1",
	platformRetireDate:"3/6/4",
	developmentCosts:5E2,
	genreWeightings:[  0.9, 0.7, 0.7, 1, 0.8, 0.8 ],
	audienceWeightings:[  0.8, 0.8, 0.9 ],
	techLevel:2,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/83_VTech_Gamate-300.png",
	events:null
	});

// Adding Xbox One X
// -----------------------------------------------------------
GDT.addPlatform({
	id:"a6b004eb-e71a-4149-af2a-4b0231f3e7c4",
	name:"Xbox One X",
	company:"Xbox",
	startAmount:5,
	unitsSold:5.2,
	licencePrize:2E5,
	published:"25/8/3",
	platformRetireDate:"260/1/1",
	developmentCosts:1E5,
	genreWeightings:[  0.8, 0.9, 0.7, 1, 0.8, 0.8 ],
	audienceWeightings:[  1, 0.9, 0.8 ],
	techLevel:6,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/960px-Microsoft-Xbox-One-X-Console-Set-removebg-preview.png",
	events:null
	});

// Adding ROG Ally
// -----------------------------------------------------------
GDT.addPlatform({
	id:"2da56a73-603d-4c86-a599-513beddb9303",
	name:"ROG Ally",
	company: "Asus",
	startAmount:0.8,
	unitsSold:0.9,
	licencePrize:3E5,
	published:"29/5/3",
	platformRetireDate:"260/12/4",
	developmentCosts:1E5,
	genreWeightings:[  1, 0.6, 0.7, 0.8, 0.9, 0.7 ],
	audienceWeightings:[  0.7, 0.8, 1 ],
	techLevel:6,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/w250.png",
	events:null
	});

// Adding Thumby
// -----------------------------------------------------------
GDT.addPlatform({
	id:"86ae97a0-58aa-4ad4-b24e-7da4766a2772",
	name:"Thumby",
	company: "TinyCircuits",
	startAmount:0.009,
	unitsSold:0.01,
	licencePrize:1E5,
	published:"28/8/3",
	platformRetireDate:"30/4/2",
	developmentCosts:1E5,
	genreWeightings:[  0.6, 0.8, 1, 0.7, 0.8, 1 ],
	audienceWeightings:[  1, 0.7, 0.6 ],
	techLevel:2,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/worlds-smallest-gameboy-frame.png",
	events:null
	});

// Adding GP32
// -----------------------------------------------------------
GDT.addPlatform({
	id:"ed492b80-97c4-4d3b-9bc1-2e515c21dd79",
	name:"GP32",
	company: "Game Park",
	startAmount:0.0012,
	unitsSold:0.0016,
	licencePrize:1E5,
	published:"12/7/2",
	platformRetireDate:"16/2/1",
	developmentCosts:5E4,
	genreWeightings:[  0.6, 0.8, 1, 0.7, 0.9, 1 ],
	audienceWeightings:[  1, 0.8, 0.7 ],
	techLevel:4,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/Gp32.png",
	events:null
	});

// Adding Pegasus
// -----------------------------------------------------------
GDT.addPlatform({
	id:"2182eb90-9922-4085-af97-d246874ef572",
	name:"Pegasus",
	company: "BobMark International",
	startAmount:0.022,
	unitsSold:0.027,
	licencePrize:2E4,
	published:"6/8/1",
	platformRetireDate:"7/4/4",
	developmentCosts:1E4,
	genreWeightings:[  0.8, 1, 0.8, 0.6, 0.8, 0.8 ],
	audienceWeightings:[  1, 0.8, 0.8 ],
	techLevel:2,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/Pegasus_console+pad+game-removebg-preview.png",
	events:null
	});

// Adding Electronika BK
// -----------------------------------------------------------
GDT.addPlatform({
	id:"8ba10fd2-15c2-4685-ac89-1071c05cbb95",
	name:"Electronika BK",
	company: "Electronika",
	startAmount:0.01,
	unitsSold:0.02,
	licencePrize:1E3,
	published:"2/11/1",
	platformRetireDate:"6/8/1",
	developmentCosts:5E2,
	genreWeightings:[  1, 0.6, 0.7, 0.9, 0.6, 0.7 ],
	audienceWeightings:[  0.9, 0.8, 1 ],
	techLevel:2,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/Bk0010-01-sideview.png",
	events:null
	});

// Adding Dendy
// -----------------------------------------------------------
GDT.addPlatform({
	id:"b1edd5a3-0d05-41be-b004-10f0c5b1a3a5",
	name:"Dendy",
	company: "TXC Corporation",
	startAmount:0.15,
	unitsSold:0.166,
	licencePrize:2E4,
	published:"6/6/2",
	platformRetireDate:"10/2/1",
	developmentCosts:1E4,
	genreWeightings:[  0.9, 1, 0.6, 0.7, 0.8, 0.9 ],
	audienceWeightings:[  1, 0.9, 0.8 ],
	techLevel:2,
	iconUri: allconsoles935_UME.modPath + "/images/platforms/640px-Dendy_Junior_with_cart_and_joypads-removebg-preview.png",
	events:null
	});



})();
