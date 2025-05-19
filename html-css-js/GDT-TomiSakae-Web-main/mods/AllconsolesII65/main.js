// ******************************************************************************************
// Mod Name: AllconsolesII65
// Mod Id: AllconsolesII65_UME
// Mod Version: 0.6.5
// Mod File: main.js
// ******************************************************************************************
// Author: UME
// Last modified: 2025-03-21
// ******************************************************************************************
// Notes: This file is defined in package.json and loaded as the first file from GDT
// ******************************************************************************************

// Setup a global mod object
var AllconsolesII65_UME = { modPath: '', data: {} };

(function () {
	// Acquire relative path to the mod
	AllconsolesII65_UME.modPath = "mods/AllconsolesII65"

	// Callback executed after succesful load
	var ready = function () {
	};

	// Callack executed if error(s) occured during load
	var error = function () {
	};

	// Load relevant files
	GDT.loadJs(['mods/AllconsolesII65/main/code.js'], ready, error);

})();
