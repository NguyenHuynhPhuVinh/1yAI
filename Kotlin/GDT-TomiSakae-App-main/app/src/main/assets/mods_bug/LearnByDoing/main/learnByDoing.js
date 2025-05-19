// Create the Test Mod Object
var LearnByDoingMod = {
    id: "LearnByDoing",
    name: "Learn By Doing",
    version: 0.1,
    author: "Boom Blockhead",
	description: "Gain Skill Points from producing Bubbles.",
    url: "",
    main: "./main.js",
    image: "thumbnail.png",

	/**
	 * Displays the Message for Skill Increases.
	 *
	 * @param {CharacterOverlay} 	overlay  : The Character Overlay of the Character receiving the Skill Increase.
	 * @param {String} 				text 	 : The Text to Display (i.e. "Research Skill + 1").
	 * @param {Integer} 			speed 	 : The Speed at which to Animate the Message.
	 * @param {Integer} 			distance : The Distance from the Player to Display the Message.
	 * @param {String} 				color 	 : The Color of the Text within the Message.
	 */
	saySkillIncrease: function(overlay, text, speed, distance, color)
	{
		// Provide Default Values for Arguments if Non-Specified
		void 0 === distance && (distance = 0);
		color || (color = "black");
		speed || (speed = 800);

		// Create the Container for the Text
		var container = new createjs.Container;
		container.x = 25;
		container.y = -25 + distance;

		// Convert the Text from a String to a displayable Font
		text = new createjs.Text(text, "8pt Arial", color);
		text.textBaseline = "top";

		// Determine the Size of the Text
		var width = text.getMeasuredWidth();
		var height = text.getMeasuredLineHeight();

		// Construct a Rounded Rectangle around the Text
		var shape = new createjs.Shape;
		var graphics = shape.graphics;

		// Draw the Rounded Rectangle around the Text
		graphics.beginFill(createjs.Graphics.getRGB(255, 255, 255, 0.8));
		graphics.beginStroke("black");
		graphics.setStrokeStyle(1);
		graphics.drawRoundRect(-4, -4, width + 8, height + 12, 5);
		graphics.closePath();

		// Add the Shape and Text to the Container
		container.addChild(shape);
		container.addChild(text);

		container.alpha = 0;

		// Add the Text Bubble Container to the Character Overlay
		overlay.addChild(container);

		// Create the Tween Animation for the Text Bubble
		var rate = speed / 6;

		createjs.Tween.get(container).to({y: -60 + distance}, speed);
		createjs.Tween.get(container).to({alpha: 1}, rate).wait(speed - 2 * rate).to({alpha: 0, x: 35}, rate).call(function()
		{
			overlay.removeChild(container);
		});

		// Play the Training Progress Sound
		Sound.playSoundOnce("trainingProgress", 0.1, rate);
	}
};

/**
 * Override the Spawn Points Function.
 *
 * This will have a Random Chance of Increasing the Character's Skill Points.
 */
Character.prototype.spawnPoints = (function(amount, type, delay)
{
	// Cache the Original Function
	var original = Character.prototype.spawnPoints;

	// Override the Function
	return function(amount, type, delay)
	{
		// Call the Original Function
		var result = original.apply(this, arguments);

		// Determine the Gain Amount
		var gainAmount = Math.round(GameManager.company.getRandom() * amount);

		// Stop if Gain Amount is Zero
		if(gainAmount == 0)
			return result;

		// Determine the Character Overlay
		var overlay = VisualsManager.getCharacterOverlay(this);
		var speed = 800;
		var distance = 0;
		var text = " + " + gainAmount;
		var color = "black";

		// Initialize the Skill Factors
		var designFactor = 0.5;
		var technologyFactor = 0.5;

		/**
		 * Determine Skill Factors based on Feature.
		 *
		 * If a Player is working on a Game Design Feature,
		 * then the Skill Factors for a potential Skill Increase
		 * will be determined on the Design/Technology Ratio of
		 * that Feature.
		 */
		// Determine the Current Feature
		var feature = this.currentFeature;
		var mission = void 0;

		// Make sure the Feature Exists
		if(feature != null && feature != void 0 && feature.id != "BugFixing" && feature.id != "preparation")
		{
			// Determine the Mission from the Feature
			mission = Missions.getMissionWithId(feature.id);

			// Make sure a Mission was Found
			if(mission != null && mission != void 0)
			{
				// Determine the Design and Technology Factors
				designFactor = mission.designFactor;
				technologyFactor = mission.technologyFactor;
			}
		}

		/**
		 * Determine Skill Factors based on Contract.
		 *
		 * If a Player is working on a Contract, then the Skill
		 * Factors for a potential Skill Increase will be determined
		 * on the Design/Technology Ratio of the Contract.
		 *
		 * Contracts also influence the Speed Chance.
		 */
		// Determine the Current Contract
		var contract = GameManager.currentContract;

		// Determine whether or not the Company is doing a Contract
		hasContract = contract != null && contract != void 0;

		if(hasContract)
		{
			designFactor = contract.requiredD / (contract.requiredD + contract.requiredT);
			technologyFactorFactor = contract.requiredT / (contract.requiredD + contract.requiredT);
		}

		/**
		 * Determine Skill Factors based on Engine.
		 *
		 * If a Player is working on an Engine, then the Skill Factors
		 * for a potential Skill Increase will be determined by the
		 * current Feature being developed for that Engine.
		 */
		// Determine the Current Engine
		var engine = GameManager.currentEngineDev;

		// Make sure the Engine Exists
		if(engine != null && engine != void 0)
		{
			// Determine the Current Engine Part being Developed
			var part = engine.currentPart;

			// Make sure the Part Exists
			if(part != null && part != void 0)
			{
				// Determine the Part Category
				var category = part.category;

				// Attempt to find a Mission that matches the Category
				var mission = Missions.getMissionWithId(category);

				// Make sure a Mission was Found
				if(mission != null)
				{
					designFactor = mission.designFactor;
					technologyFactor = mission.technologyFactor;
				}
				else
				{
					// Determine Factors Manually
					switch(category)
					{
						case "Technology":
							designFactor = 0.2;
							technologyFactor = 0.8;
							break;

						case "Publishing":
							designFactor = 0.8;
							technologyFactor = 0.2;
							break;

						case "Project Management":
							designFactor = 0.6;
							technologyFactor = 0.4;
							break;

						case "Special Items":
							designFactor = 0.5;
							technologyFactor = 0.5;
							break;
					}
				}
			}
		}

		// Determine the Initial Chances
		designChance = designFactor / (1 + hasContract) / (1 + (type !== "d"));
		technologyChance = technologyFactor / (1 + hasContract) / (1 + (type !== "t"));
		speedChance = hasContract / 2 / (1 + (type === "r"));

		// Adjust the Chances based on Point Type
		designChance += type === "d" ? technologyChance : 0;
		technologyChance += type === "t" ? designChance : 0;
		speedChance += (type === "br" || type === "b") ? designChance + technologyChance : 0;
		researchChance = type === "r" ? designChance + technologyChance + speedChance : 0;

		// Determine the Focus on the current Feature
		var focus = 1;
	
		// Determine the Maximum and Minimum Level
		var max = 15;
		var min = 1 / max;

		// Adjust the Focus based on the Mission Percentage and Level
		if(mission != null && mission != void 0)
		{
			focus *= Math.sqrt(Math.max(mission.percentage / 100, 0.1));
			focus *= Math.sqrt(Math.max((max - LevelCalculator.getMissionLevel(mission.id)) / max, min));
		}

		// Adjust the Focus based on the Staff Level
		focus *= Math.sqrt(Math.max((max - LevelCalculator.getLevel(this.experience)) / max, min));

		// Adjust the Focus based on the Point Amount
		focus *= Math.sqrt(Math.max((max - amount) / max, min));

		// Determine the Maximum and Minimum Factor
		max = 900 / 500; // 1.8
		min = 0;

		// Adjust the Focus based on the Speed Factor
		focus *= Math.sqrt(Math.max((max - this.speedFactor) / max, min));

		// Adjust the Chances based on the Focus
		designChance *= focus;
		technologyChance *= focus;
		speedChance *= focus;
		researchChance *= focus;

		// Adjust each Chance based on its own Factor
		designChance *= 	Math.sqrt(Math.max((max - this.designFactor) 	 / max, min));
		technologyChance *= Math.sqrt(Math.max((max - this.technologyFactor) / max, min));
		speedChance *= 		Math.sqrt(Math.max((max - this.speedFactor) 	 / max, min));
		researchChance *= 	Math.sqrt(Math.max((max - this.researchFactor) 	 / max, min));

		// Shift the Chances to stacked on a Scale of 0 to 1
		technologyChance += designChance;
		speedChance += technologyChance;
		researchChance += speedChance;

		// Determine the Skill Type Gained (if any)
		var gainType = void 0;

		var random = GameManager.company.getRandom();

		if(random < designChance)
			gainType = "d";
		else if(random < technologyChance)
			gainType = "t";
		else if(random < speedChance)
			gainType = "s";
		else if(random < researchChance)
			gainType = "r";
		else
			return result; // No Gain

		// Determine the Text Attributes based on the Gain Type
		switch(gainType)
		{
			// Design Gain
			case "d":
				text = "Design" + text;
				color = DESIGN_POINTS_COLOR;
				this.designFactor += gainAmount / 500;
				break;

			// Technology Gain
			case "t":
				text = "Technology" + text;
				color = TECHNOLOGY_POINTS_COLOR;
				this.technologyFactor += gainAmount / 500;
				break;

			// Speed Gain
			case "s":
				text = "Speed" + text;
				color = BUGS_COLOR;
				this.speedFactor += gainAmount / 500;
				break;

			// Research Gain
			case "r":
				text = "Research" + text;
				color = RESEARCH_POINTS_COLOR;
				this.researchFactor += gainAmount / 500;
				break;
		}

		// Show the Skill Increase
		LearnByDoingMod.saySkillIncrease(overlay, text, speed, distance, color);

		// Return the Result from the Original Function
		return result;
	};
}());

/**
 * Intercept the Week Proceeded GDT Event.
 *
 * This will have a Random Chance on Increasing a Character's Research Points.
 */
(function()
{
	// Create the Event Handler
	var handler = function(data)
	{
		// Iterate through each Staff Member
		for(var i = 0; i < data.company.staff.count(); i++)
		{
			// Determine the Current Staff Member
			var staff = data.company.staff[i];

			// Make sure the Staff Member is Researching
			if(staff.currentResearch != null)
			{
				// Determine the Research
				var research = staff.currentResearch;

				// Make sure the Research is not Training
				if(research.isTraining || research.isSkillTraining || research.type === "training")
					continue;

				// Determine the Research Chance
				var chance = (1.8 - staff.researchFactor) / 1.8;

				// Adjust the Chance by the Staff's Level
				chance *= (15 - LevelCalculator.getLevel(staff.experience)) / 15;

				// Reduce Chance
				chance /= 4;

				// Test for the Random Chance
				if(data.company.getRandom() < chance)
				{
					staff.researchFactor += 0.002; // 1 / 500
					LearnByDoingMod.saySkillIncrease(VisualsManager.getCharacterOverlay(staff), "Research + 1", 600, 0, RESEARCH_POINTS_COLOR);
				}
			}
		}
	};

	// Register the Event Handler
	GDT.on(GDT.eventKeys.gameplay.weekProceeded, handler);
})();