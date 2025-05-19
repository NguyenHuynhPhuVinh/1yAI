// ******************************************************************************************
// Mod Name: Story_Expansion_Mod_2
// Mod Id: Story_Expansion_Mod_2_TheOnlyGaming
// Mod Version: 27.6.24
// Mod File: main.js
// ******************************************************************************************
// Author: TheOnlyGaming
// Last modified: 27/06/2024 18:08
// ******************************************************************************************
// Notes: This file is defined in package.json and loaded as the first file from GDT
// ******************************************************************************************

// Setup a global mod object
var Story_Expansion_Mod_2_TheOnlyGaming = { modPath: '', data: {} };

(function () {
	// Acquire relative path to the mod
	Story_Expansion_Mod_2_TheOnlyGaming.modPath = "mods/Story_Expansion_Mod_2";

	// Callback executed after succesful load
	var ready = function () {
	};

	// Callack executed if error(s) occured during load
	var error = function () {
	};

	// Load relevant files
	GDT.loadJs(['mods/Story_Expansion_Mod_2/main/code.js'], ready, error);

})();
