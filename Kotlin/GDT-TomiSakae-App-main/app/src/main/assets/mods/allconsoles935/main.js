// ******************************************************************************************
// Mod Name: allconsoles935
// Mod Id: allconsoles935_UME
// Mod Version: 1.7.6
// Mod File: main.js
// ******************************************************************************************
// Author: UME
// Last modified: 2025-03-21
// ******************************************************************************************
// Notes: This file is defined in package.json and loaded as the first file from GDT
// ******************************************************************************************

// Setup a global mod object
var allconsoles935_UME = { modPath: '', data: {} };

(function () {
	// Acquire relative path to the mod
	allconsoles935_UME.modPath = "mods/allconsoles935"

	// Callback executed after succesful load
	var ready = function () {
	};

	// Callack executed if error(s) occured during load
	var error = function () {
	};

	// Load relevant files
	GDT.loadJs(['mods/allconsoles935/main/code.js'], ready, error);

})();
