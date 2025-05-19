var AnimationSpriteSheets = {};

(function () {
	var a = AnimationSpriteSheets;

	a.getAllImages = function () {
		var images = [];
		return images;
	};

	if (PlatformShim.ISLOWRES) {
		a.typingScreenL1 = {
			'images': ['./animations1366/typingScreenL1.png'],
			'frames': { 'regY': 0, 'height': 32, 'regX': 0, 'width': 23.4782, 'count': 46 },
			'animations': { 'loop': [0, 45] },
			'targetFPS': { 'loop': 7 }
		};

		//superb start
		a.typingScreenL2 = {
			'images': ['./animations1366/superb/typingScreenL2.png'],
			'frames': { 'regY': -14, 'height': 25, 'regX': -9, 'width': 22, 'count': 18 },
			'animations': { 'loop': [0, 17] },
			'targetFPS': { 'loop': 10 },
			'baseImage': './animations1366/superb/typingScreenL2_base.png'
		};

		a.typingScreenL3 = {
			'images': ['./animations1366/superb/typingScreenL3.png'],
			'frames': { 'regY': -10, 'height': 34, 'regX': -18, 'width': 28, 'count': 19 },
			'animations': { 'loop': [0, 18] },
			'targetFPS': { 'loop': 5 },
			'baseImage': './animations1366/superb/typingScreenL3_base.png'
		};

		a.typingScreenL4 = {
			'images': ['./animations1366/superb/typingScreenL4.png'],
			'frames': { 'height': 48, 'width': 39, 'count': 84, 'regX': 0, 'regY': 0},
			'animations': { 'loop': [0, 83] },
			'targetFPS': { 'loop': 5 },
			'baseImage': './animations1366/superb/typingScreenL4_base.png'
		};

		a.hwLabScreenWall = {
			'images': ['./animations1366/superb/hwLabScreenWall.png'],
			'frames': { 'height': 217, 'width': 292, 'count': 30, 'regX': -11, 'regY': -66 },
			'animations': { 'loop': [0, 29] },
			'targetFPS': { 'loop': 10 },
			'baseImage': './animations1366/superb/hwLabScreenWall_base.png'
		};

		a.hwTV = {
			'images': ['./animations1366/superb/hwTV.png'],
			'frames': { 'height': 184, 'width': 155, 'count': 61, 'regX': -10, 'regY': -18 },
			'animations': { 'loop': [0, 60] },
			'targetFPS': { 'loop': 10 },
			'baseImage': './animations1366/superb/hwTV_base.png'
		};

		a.hwFrontFemale1 = {
			'images': ['./animations1366/superb/hwFrontFemale1.png'],
			'frames': { 'height': 61, 'width': 40, 'count': 31, 'regX': -24, 'regY': -7 },
			'animations': { 'loop': [0, 30] },
			'targetFPS': { 'loop': 10 },
			'baseImage': './animations1366/superb/hwFrontFemale1_base.png'
		};

		a.hwFrontFemale2 = {
			'images': ['./animations1366/superb/hwFrontFemale2.png'],
			'frames': { 'height': 98, 'width': 40, 'count': 31, 'regX': -24, 'regY': -10 },
			'animations': { 'loop': [0, 30] },
			'targetFPS': { 'loop': 10 },
			'baseImage': './animations1366/superb/hwFrontFemale2_base.png'
		};

		a.hwFrontFemale4 = {
			'images': ['./animations1366/superb/hwFrontFemale4.png'],
			'frames': { 'height': 64, 'width': 45, 'count': 11, 'regX': -18, 'regY': -42 },
			'animations': { 'loop': [0, 10] },
			'targetFPS': { 'loop': 10 },
			'baseImage': './animations1366/superb/hwFrontFemale4_base.png'
		};

		a.hwBackFemale1 = {
			'images': ['./animations1366/superb/hwBackFemale1.png'],
			'frames': { 'height': 59, 'width': 36, 'count': 11, 'regX': -22, 'regY': -10 },
			'animations': { 'loop': [0, 10] },
			'targetFPS': { 'loop': 10 },
			'baseImage': './animations1366/superb/hwBackFemale1_base.png'
		};

		a.hwBackFemale2 = {
			'images': ['./animations1366/superb/hwBackFemale2.png'],
			'frames': { 'height': 57, 'width': 36, 'count': 11, 'regX': -22, 'regY': -11 },
			'animations': { 'loop': [0, 10] },
			'targetFPS': { 'loop': 10 },
			'baseImage': './animations1366/superb/hwBackFemale2_base.png'
		};

		a.hwBackFemale3 = {
			'images': ['./animations1366/superb/hwBackFemale3.png'],
			'frames': { 'height': 59, 'width': 48, 'count': 11, 'regX': -22, 'regY': -10 },
			'animations': { 'loop': [0, 10] },
			'targetFPS': { 'loop': 10 },
			'baseImage': './animations1366/superb/hwBackFemale3_base.png'
		};

		a.hwBackFemale4 = {
			'images': ['./animations1366/superb/hwBackFemale4.png'],
			'frames': { 'height': 57, 'width': 48, 'count': 11, 'regX': -22, 'regY': -11 },
			'animations': { 'loop': [0, 10] },
			'targetFPS': { 'loop': 10 },
			'baseImage': './animations1366/superb/hwBackFemale4_base.png'
		};

		a.hwFrontMale2 = {
			'images': ['./animations1366/superb/hwFrontMale2.png'],
			'frames': { 'height': 58, 'width': 43, 'count': 31, 'regX': -24, 'regY': -10 },
			'animations': { 'loop': [0, 30] },
			'targetFPS': { 'loop': 10 },
			'baseImage': './animations1366/superb/hwFrontMale2_base.png'
		};

		a.hwFrontMale3 = {
			'images': ['./animations1366/superb/hwFrontMale3.png'],
			'frames': { 'height': 65, 'width': 50, 'count': 11, 'regX': -15, 'regY': -41 },
			'animations': { 'loop': [0, 10] },
			'targetFPS': { 'loop': 10 },
			'baseImage': './animations1366/superb/hwFrontMale3_base.png'
		};

		a.hwFrontMale4 = {
			'images': ['./animations1366/superb/hwFrontMale4.png'],
			'frames': { 'height': 66, 'width': 50, 'count': 11, 'regX': -15, 'regY': -41 },
			'animations': { 'loop': [0, 10] },
			'targetFPS': { 'loop': 10 },
			'baseImage': './animations1366/superb/hwFrontMale4_base.png'
		};

		a.hwBackMale1 = {
			'images': ['./animations1366/superb/hwBackMale1.png'],
			'frames': { 'height': 58, 'width': 42, 'count': 11, 'regX': -20, 'regY': -11 },
			'animations': { 'loop': [0, 10] },
			'targetFPS': { 'loop': 10 },
			'baseImage': './animations1366/superb/hwBackMale1_base.png'
		};

		a.hwBackMale2 = {
			'images': ['./animations1366/superb/hwBackMale2.png'],
			'frames': { 'height': 58, 'width': 53, 'count': 11, 'regX': -20, 'regY': -11 },
			'animations': { 'loop': [0, 10] },
			'targetFPS': { 'loop': 10 },
			'baseImage': './animations1366/superb/hwBackMale2_base.png'
		};

		a.rndActor1 = {
			'images': ['./animations1366/superb/rndActor1.png'],
			'frames': { 'height': 68, 'width': 69, 'count': 11, 'regX': -6, 'regY': -13 },
			'animations': { 'loop': [0, 10] },
			'targetFPS': { 'loop': 10 },
			'baseImage': './animations1366/superb/rndActor1_base.png'
		};

		a.rndFemaleBoardBack1 = {
			'images': ['./animations1366/superb/rndFemaleBoardBack1.png'],
			'frames': { 'height': 62, 'width': 48, 'count': 11, 'regX': -22, 'regY': -11 },
			'animations': { 'loop': [0, 10] },
			'targetFPS': { 'loop': 10 },
			'baseImage': './animations1366/superb/rndFemaleBoardBack1_base.png'
		};

		a.rndMaleBoardFront1 = {
			'images': ['./animations1366/superb/rndMaleBoardFront1.png'],
			'frames': { 'height': 86, 'width': 67, 'count': 16, 'regX': -10, 'regY': -7 },
			'animations': { 'loop': [0, 15] },
			'targetFPS': { 'loop': 10 },
			'baseImage': './animations1366/superb/rndMaleBoardFront1_base.png'
		};

		a.rndFemaleTypingBack1 = {
			'images': ['./animations1366/superb/rndFemaleTypingBack1.png'],
			'frames': { 'height': 57, 'width': 51, 'count': 18, 'regX': -17, 'regY': -14 },
			'animations': { 'loop': [0, 17] },
			'targetFPS': { 'loop': 10 },
			'baseImage': './animations1366/superb/rndFemaleTypingBack1_base.png'
		};

		a.rndMaleTypingBack1 = {
			'images': ['./animations1366/superb/rndMaleTypingBack1.png'],
			'frames': { 'height': 63, 'width': 52, 'count': 18, 'regX': -13, 'regY': -9 },
			'animations': { 'loop': [0, 17] },
			'targetFPS': { 'loop': 10 },
			'baseImage': './animations1366/superb/rndMaleTypingBack1_base.png'
		};

		a.rndOperator1 = {
			'images': ['./animations1366/superb/rndOperator1.png'],
			'frames': { 'height': 116, 'width': 53, 'count': 11, 'regX': -13, 'regY': -14 },
			'animations': { 'loop': [0, 10] },
			'targetFPS': { 'loop': 10 },
			'baseImage': './animations1366/superb/rndOperator1_base.png'
		};

		a.rndFemaleTableBack1 = {
			'images': ['./animations1366/superb/rndFemaleTableBack1.png'],
			'frames': { 'height': 63, 'width': 54, 'count': 16, 'regX': -38, 'regY': -4 },
			'animations': { 'loop': [0, 15] },
			'targetFPS': { 'loop': 10 },
			'baseImage': './animations1366/superb/rndFemaleTableBack1_base.png'
		};

		a.rndFemaleTableFront1_body = {
			'images': ['./animations1366/superb/rndFemaleTableFront1_body.png'],
			'frames': { 'height': 77, 'width': 52, 'count': 16, 'regX': -27, 'regY': -17 },
			'animations': { 'loop': [0, 15] },
			'targetFPS': { 'loop': 10 },
			'baseImage': './animations1366/superb/rndFemaleTableFront1_body_base.png'
		};

		a.rndFemaleTableFront1_pants = {
			'images': ['./animations1366/empty_sheet.png'],
			'frames': { 'height': 1, 'width': 1, 'count': 16, 'regX': 0, 'regY': 0 },
			'animations': { 'loop': [0, 15] },
			'targetFPS': { 'loop': 10 },
			'baseImage': './animations1366/superb/rndFemaleTableFront1_pants_base.png'
		};

		a.rndMaleFrontTable1_body = {
			'images': ['./animations1366/superb/rndMaleFrontTable1_body.png'],
			'frames': { 'height': 79, 'width': 48, 'count': 16, 'regX': -28, 'regY': -11 },
			'animations': { 'loop': [0, 15] },
			'targetFPS': { 'loop': 10 },
			'baseImage': './animations1366/superb/rndMaleFrontTable1_body_base.png'
		};

		a.rndMaleFrontTable1_pants = {
			'images': ['./animations1366/empty_sheet.png'],
			'frames': { 'height': 1, 'width': 1, 'count': 16, 'regX': 0, 'regY': 0 },
			'animations': { 'loop': [0, 15] },
			'targetFPS': { 'loop': 10 },
			'baseImage': './animations1366/superb/rndMaleFrontTable1_pants_base.png'
		};

		a.rndMaleFrontTable2_body = {
			'images': ['./animations1366/superb/rndMaleFrontTable2_body.png'],
			'frames': { 'height': 62, 'width': 55, 'count': 16, 'regX': -28, 'regY': -14 },
			'animations': { 'loop': [0, 15] },
			'targetFPS': { 'loop': 10 },
			'baseImage': './animations1366/superb/rndMaleFrontTable2_body_base.png'
		};

		a.rndMaleFrontTable2_pants = {
			'images': ['./animations1366/empty_sheet.png'],
			'frames': { 'height': 1, 'width': 1, 'count': 16, 'regX': 0, 'regY': 0 },
			'animations': { 'loop': [0, 15] },
			'targetFPS': { 'loop': 10 },
			'baseImage': './animations1366/superb/rndMaleFrontTable2_pants_base.png'
		};

		a.rndMaleTableBack1 = {
			'images': ['./animations1366/superb/rndMaleTableBack1.png'],
			'frames': { 'height': 67, 'width': 52, 'count': 16, 'regX': -37, 'regY': -5 },
			'animations': { 'loop': [0, 15] },
			'targetFPS': { 'loop': 10 },
			'baseImage': './animations1366/superb/rndMaleTableBack1_base.png'
		};

		a.rndMaleTableBack2 = {
			'images': ['./animations1366/superb/rndMaleTableBack2.png'],
			'frames': { 'height': 73, 'width': 53, 'count': 16, 'regX': -37, 'regY': 0 },
			'animations': { 'loop': [0, 15] },
			'targetFPS': { 'loop': 10 },
			'baseImage': './animations1366/superb/rndMaleTableBack2_base.png'
		};

		//superb end

		a.notepadBackC1_body = {
			'images': ['./animations1366/notepadBackC1_body.png'],
			'frames': { 'height': 41, 'width': 59, 'count': 38, 'regX': -21, 'regY': -28 },
			'animations': { 'start': [0, 0], 'loop': [0, 37], 'end': [37, 37] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/notepadBackC1_body_base.png'
		};

		a.notepadBackC2_body = {
			'images': ['./animations1366/notepadBackC2_body.png'],
			'frames': { 'height': 41, 'width': 59, 'count': 38, 'regX': -21, 'regY': -28 },
			'animations': { 'start': [0, 0], 'loop': [0, 37], 'end': [37, 37] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/notepadBackC2_body_base.png'
		};

		a.notepadBackC3_body = {
			'images': ['./animations1366/notepadBackC3_body.png'],
			'frames': { 'height': 41, 'width': 59, 'count': 38, 'regX': -21, 'regY': -28 },
			'animations': { 'start': [0, 0], 'loop': [0, 37], 'end': [37, 37] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/notepadBackC3_body_base.png'
		};

		a.notepadBackC4_body = {
			'images': ['./animations1366/notepadBackC4_body.png'],
			'frames': { 'height': 41, 'width': 59, 'count': 38, 'regX': -21, 'regY': -28 },
			'animations': { 'start': [0, 0], 'loop': [0, 37], 'end': [37, 37] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/notepadBackC4_body_base.png'
		};

		a.notepadBackC5_body = {
			'images': ['./animations1366/notepadBackC5_body.png'],
			'frames': { 'height': 41, 'width': 59, 'count': 38, 'regX': -21, 'regY': -28 },
			'animations': { 'start': [0, 0], 'loop': [0, 37], 'end': [37, 37] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/notepadBackC5_body_base.png'
		};

		a.notepadBackC6_body = {
			'images': ['./animations1366/notepadBackC6_body.png'],
			'frames': { 'height': 41, 'width': 59, 'count': 38, 'regX': -21, 'regY': -28 },
			'animations': { 'start': [0, 0], 'loop': [0, 37], 'end': [37, 37] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/notepadBackC6_body_base.png'
		};

		a.notepadBackC7_body = {
			'images': ['./animations1366/notepadBackC7_body.png'],
			'frames': { 'height': 41, 'width': 59, 'count': 38, 'regX': -21, 'regY': -28 },
			'animations': { 'start': [0, 0], 'loop': [0, 37], 'end': [37, 37] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/notepadBackC7_body_base.png'
		};

		a.notepadBackC8_body = {
			'images': ['./animations1366/notepadBackC8_body.png'],
			'frames': { 'height': 41, 'width': 59, 'count': 38, 'regX': -21, 'regY': -28 },
			'animations': { 'start': [0, 0], 'loop': [0, 37], 'end': [37, 37] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/notepadBackC8_body_base.png'
		};

		a.notepadBackC9_body = {
			'images': ['./animations1366/notepadBackC9_body.png'],
			'frames': { 'height': 38, 'width': 36, 'count': 38, 'regX': -42, 'regY': -31 },
			'animations': { 'start': [0, 0], 'loop': [0, 37], 'end': [37, 37] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/notepadBackC9_body_base.png'
		};

		a.notepadBackC10_body = {
			'images': ['./animations1366/notepadBackC10_body.png'],
			'frames': { 'height': 38, 'width': 37, 'count': 38, 'regX': -41, 'regY': -31 },
			'animations': { 'start': [0, 0], 'loop': [0, 37], 'end': [37, 37] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/notepadBackC10_body_base.png'
		};

		a.notepadBackC11_body = {
			'images': ['./animations1366/notepadBackC11_body.png'],
			'frames': { 'height': 38, 'width': 36, 'count': 38, 'regX': -41, 'regY': -31 },
			'animations': { 'start': [0, 0], 'loop': [0, 37], 'end': [37, 37] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/notepadBackC11_body_base.png'
		};

		a.notepadBackC12_body = {
			'images': ['./animations1366/notepadBackC12_body.png'],
			'frames': { 'height': 41, 'width': 59, 'count': 38, 'regX': -19, 'regY': -28 },
			'animations': { 'start': [0, 0], 'loop': [0, 37], 'end': [37, 37] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/notepadBackC12_body_base.png'
		};

		a.notepadBackC1_chair = {
			'images': ['./animations1366/empty_sheet.png'],
			'frames': { 'height': 1, 'width': 1, 'count': 38, 'regX': 0, 'regY': 0 },
			'animations': { 'start': [0, 0], 'loop': [0, 37], 'end': [37, 37] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/notepadBackC1_chair_base.png'
		};

		a.notepadBackC1_hand = {
			'images': ['./animations1366/notepadBackC1_hands.png'],
			'frames': { 'height': 44, 'width': 56, 'count': 38, 'regX': -6, 'regY': -22 },
			'animations': { 'start': [0, 0], 'loop': [0, 37], 'end': [37, 37] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 }
		};

		a.notepadBackC4_hand = {
			'images': ['./animations1366/notepadBackC4_hands.png'],
			'frames': { 'height': 44, 'width': 56, 'count': 38, 'regX': -6, 'regY': -22 },
			'animations': { 'start': [0, 0], 'loop': [0, 37], 'end': [37, 37] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 }
		};

		a.notepadBackC5_hand = {
			'images': ['./animations1366/notepadBackC5_hands.png'],
			'frames': { 'height': 44, 'width': 56, 'count': 38, 'regX': -6, 'regY': -22 },
			'animations': { 'start': [0, 0], 'loop': [0, 37], 'end': [37, 37] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 }
		};

		a.notepadBackC9_hand = {
			'images': ['./animations1366/notepadBackC9_hands.png'],
			'frames': { 'height': 48, 'width': 63, 'count': 38, 'regX': -5, 'regY': -22 },
			'animations': { 'start': [0, 0], 'loop': [0, 37], 'end': [37, 37] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/notepadBackC9_hands_base.png'
		};

		a.notepadBackC10_hand = {
			'images': ['./animations1366/notepadBackC10_hands.png'],
			'frames': { 'height': 48, 'width': 63, 'count': 38, 'regX': -5, 'regY': -22 },
			'animations': { 'start': [0, 0], 'loop': [0, 37], 'end': [37, 37] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/notepadBackC10_hands_base.png'
		};

		a.notepadBackC12_hand = {
			'images': ['./animations1366/notepadBackC12_hands.png'],
			'frames': { 'height': 48, 'width': 63, 'count': 38, 'regX': -5, 'regY': -22 },
			'animations': { 'start': [0, 0], 'loop': [0, 37], 'end': [37, 37] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/notepadBackC12_hands_base.png'
		};

		a.notepadBackC1_head = {
			'images': ['./animations1366/notepadBackC1_head.png'],
			'frames': { 'height': 43, 'width': 46, 'count': 38, 'regX': -32, 'regY': -5 },
			'animations': { 'start': [0, 0], 'loop': [0, 37], 'end': [37, 37] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/notepadBackC1_head_base.png'
		};

		a.notepadBackC2_head = {
			'images': ['./animations1366/notepadBackC2_head.png'],
			'frames': { 'height': 46, 'width': 45, 'count': 38, 'regX': -33, 'regY': 0 },
			'animations': { 'start': [0, 0], 'loop': [0, 37], 'end': [37, 37] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/notepadBackC2_head_base.png'
		};

		a.notepadBackC3_head = {
			'images': ['./animations1366/notepadBackC3_head.png'],
			'frames': { 'height': 45, 'width': 47, 'count': 38, 'regX': -31, 'regY': -2 },
			'animations': { 'start': [0, 0], 'loop': [0, 37], 'end': [37, 37] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/notepadBackC3_head_base.png'
		};

		a.notepadBackC4_head = {
			'images': ['./animations1366/notepadBackC4_head.png'],
			'frames': { 'height': 45, 'width': 48, 'count': 38, 'regX': -31, 'regY': 0 },
			'animations': { 'start': [0, 0], 'loop': [0, 37], 'end': [37, 37] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/notepadBackC4_head_base.png'
		};

		a.notepadBackC5_head = {
			'images': ['./animations1366/notepadBackC5_head.png'],
			'frames': { 'height': 44, 'width': 45, 'count': 38, 'regX': -33, 'regY': -5 },
			'animations': { 'start': [0, 0], 'loop': [0, 37], 'end': [37, 37] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/notepadBackC5_head_base.png'
		};

		a.notepadBackC6_head = {
			'images': ['./animations1366/notepadBackC6_head.png'],
			'frames': { 'height': 43, 'width': 48, 'count': 38, 'regX': -32, 'regY': -3 },
			'animations': { 'start': [0, 0], 'loop': [0, 37], 'end': [37, 37] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/notepadBackC6_head_base.png'
		};

		a.notepadBackC7_head = {
			'images': ['./animations1366/notepadBackC7_head.png'],
			'frames': { 'height': 45, 'width': 48, 'count': 38, 'regX': -31, 'regY': 0 },
			'animations': { 'start': [0, 0], 'loop': [0, 37], 'end': [37, 37] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/notepadBackC7_head_base.png'
		};

		a.notepadBackC8_head = {
			'images': ['./animations1366/notepadBackC8_head.png'],
			'frames': { 'height': 40, 'width': 47, 'count': 38, 'regX': -31, 'regY': -5 },
			'animations': { 'start': [0, 0], 'loop': [0, 37], 'end': [37, 37] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/notepadBackC8_head_base.png'
		};

		a.notepadBackC9_head = {
			'images': ['./animations1366/notepadBackC9_head.png'],
			'frames': { 'height': 51, 'width': 52, 'count': 38, 'regX': -33, 'regY': -5 },
			'animations': { 'start': [0, 0], 'loop': [0, 37], 'end': [37, 37] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/notepadBackC9_head_base.png'
		};

		a.notepadBackC10_head = {
			'images': ['./animations1366/notepadBackC10_head.png'],
			'frames': { 'height': 51, 'width': 52, 'count': 38, 'regX': -33, 'regY': -5 },
			'animations': { 'start': [0, 0], 'loop': [0, 37], 'end': [37, 37] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/notepadBackC10_head_base.png'
		};

		a.notepadBackC11_head = {
			'images': ['./animations1366/notepadBackC11_head.png'],
			'frames': { 'height': 51, 'width': 48, 'count': 38, 'regX': -33, 'regY': -5 },
			'animations': { 'start': [0, 0], 'loop': [0, 37], 'end': [37, 37] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/notepadBackC11_head_base.png'
		};

		a.notepadBackC12_head = {
			'images': ['./animations1366/notepadBackC12_head.png'],
			'frames': { 'height': 51, 'width': 50, 'count': 38, 'regX': -31, 'regY': -5 },
			'animations': { 'start': [0, 0], 'loop': [0, 37], 'end': [37, 37] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/notepadBackC12_head_base.png'
		};

		a.notepadBackC1_pants = {
			'images': ['./animations1366/empty_sheet.png'],
			'frames': { 'height': 1, 'width': 1, 'count': 38, 'regX': 0, 'regY': 0 },
			'animations': { 'start': [0, 0], 'loop': [0, 37], 'end': [37, 37] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/notepadBackC1_pants_base.png'
		};

		a.notepadBackC9_pants = {
			'images': ['./animations1366/empty_sheet.png'],
			'frames': { 'height': 1, 'width': 1, 'count': 38, 'regX': 0, 'regY': 0 },
			'animations': { 'start': [0, 0], 'loop': [0, 37], 'end': [37, 37] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/notepadBackC9_pants_base.png'
		};

		a.notepadImage = {
			'images': ['./animations1366/notepadImage.png'],
			'frames': { 'regY': 0, 'height': 107, 'regX': 0, 'width': 107, 'count': 1 },
			'animations': { 'all': [0, 0] },
			'targetFPS': { 'all': 7 }
		};

		//superb start
		a.notepadFrontC1_body = {
			'images': ['./animations1366/superb/notepadFrontC1_body.png'],
			'frames': { 'height': 48, 'width': 60, 'count': 39, 'regX': -29, 'regY': -38 },
			'animations': { 'start': [0, 0], 'loop': [0, 38], 'end': [38, 38] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/notepadFrontC1_body_base.png'
		};

		a.notepadFrontC2_body = {
			'images': ['./animations1366/superb/notepadFrontC2_body.png'],
			'frames': { 'height': 48, 'width': 60, 'count': 39, 'regX': -29, 'regY': -38 },
			'animations': { 'start': [0, 0], 'loop': [0, 38], 'end': [38, 38] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/notepadFrontC2_body_base.png'
		};

		a.notepadFrontC3_body = {
			'images': ['./animations1366/superb/notepadFrontC3_body.png'],
			'frames': { 'height': 48, 'width': 60, 'count': 39, 'regX': -29, 'regY': -38 },
			'animations': { 'start': [0, 0], 'loop': [0, 38], 'end': [38, 38] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/notepadFrontC3_body_base.png'
		};

		a.notepadFrontC4_body = {
			'images': ['./animations1366/superb/notepadFrontC4_body.png'],
			'frames': { 'height': 48, 'width': 60, 'count': 39, 'regX': -29, 'regY': -38 },
			'animations': { 'start': [0, 0], 'loop': [0, 38], 'end': [38, 38] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/notepadFrontC4_body_base.png'
		};

		a.notepadFrontC5_body = {
			'images': ['./animations1366/superb/notepadFrontC5_body.png'],
			'frames': { 'height': 48, 'width': 62, 'count': 39, 'regX': -29, 'regY': -38 },
			'animations': { 'start': [0, 0], 'loop': [0, 38], 'end': [38, 38] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/notepadFrontC5_body_base.png'
		};

		a.notepadFrontC6_body = {
			'images': ['./animations1366/superb/notepadFrontC6_body.png'],
			'frames': { 'height': 48, 'width': 62, 'count': 39, 'regX': -29, 'regY': -38 },
			'animations': { 'start': [0, 0], 'loop': [0, 38], 'end': [38, 38] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/notepadFrontC6_body_base.png'
		};

		a.notepadFrontC7_body = {
			'images': ['./animations1366/superb/notepadFrontC7_body.png'],
			'frames': { 'height': 48, 'width': 62, 'count': 39, 'regX': -29, 'regY': -38 },
			'animations': { 'start': [0, 0], 'loop': [0, 38], 'end': [38, 38] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/notepadFrontC7_body_base.png'
		};

		a.notepadFrontC8_body = {
			'images': ['./animations1366/superb/notepadFrontC8_body.png'],
			'frames': { 'height': 48, 'width': 62, 'count': 39, 'regX': -29, 'regY': -38 },
			'animations': { 'start': [0, 0], 'loop': [0, 38], 'end': [38, 38] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/notepadFrontC8_body_base.png'
		};

		a.notepadFrontC9_body = {
			'images': ['./animations1366/superb/notepadFrontC9_body.png'],
			'frames': { 'height': 48, 'width': 60, 'count': 39, 'regX': -29, 'regY': -38 },
			'animations': { 'start': [0, 0], 'loop': [0, 38], 'end': [38, 38] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/notepadFrontC9_body_base.png'
		};

		a.notepadFrontC10_body = {
			'images': ['./animations1366/superb/notepadFrontC10_body.png'],
			'frames': { 'height': 48, 'width': 60, 'count': 39, 'regX': -29, 'regY': -38 },
			'animations': { 'start': [0, 0], 'loop': [0, 38], 'end': [38, 38] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/notepadFrontC10_body_base.png'
		};

		a.notepadFrontC11_body = {
			'images': ['./animations1366/superb/notepadFrontC11_body.png'],
			'frames': { 'height': 44, 'width': 45, 'count': 39, 'regX': -28, 'regY': -38 },
			'animations': { 'start': [0, 0], 'loop': [0, 38], 'end': [38, 38] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/notepadFrontC11_body_base.png'
		};

		a.notepadFrontC12_body = {
			'images': ['./animations1366/superb/notepadFrontC12_body.png'],
			'frames': { 'height': 44, 'width': 44, 'count': 39, 'regX': -29, 'regY': -38 },
			'animations': { 'start': [0, 0], 'loop': [0, 38], 'end': [38, 38] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/notepadFrontC12_body_base.png'
		};

		a.notepadFrontC1_chair = {
			'images': ['./animations1366/superb/notepadFrontC1_chair.png'],
			'frames': { 'height': 55, 'width': 67, 'count': 39, 'regX': -11, 'regY': -47 },
			'animations': { 'start': [0, 0], 'loop': [0, 38], 'end': [38, 38] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/notepadFrontC1_chair_base.png'
		};

		a.notepadFrontC1_hand = {
			'images': ['./animations1366/superb/notepadFrontC1_hands.png'],
			'frames': { 'height': 57, 'width': 66, 'count': 39, 'regX': -41, 'regY': -37 },
			'animations': { 'start': [0, 0], 'loop': [0, 38], 'end': [38, 38] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/notepadFrontC1_hands_base.png'
		};

		a.notepadFrontC4_hand = {
			'images': ['./animations1366/superb/notepadFrontC4_hands.png'],
			'frames': { 'height': 57, 'width': 66, 'count': 39, 'regX': -41, 'regY': -37 },
			'animations': { 'start': [0, 0], 'loop': [0, 38], 'end': [38, 38] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/notepadFrontC4_hands_base.png'
		};

		a.notepadFrontC5_hand = {
			'images': ['./animations1366/superb/notepadFrontC5_hands.png'],
			'frames': { 'height': 57, 'width': 66, 'count': 39, 'regX': -41, 'regY': -37 },
			'animations': { 'start': [0, 0], 'loop': [0, 38], 'end': [38, 38] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/notepadFrontC5_hands_base.png'
		};

		a.notepadFrontC9_hand = {
			'images': ['./animations1366/superb/notepadFrontC9_hands.png'],
			'frames': { 'height': 55, 'width': 76, 'count': 39, 'regX': -31, 'regY': -37 },
			'animations': { 'start': [0, 0], 'loop': [0, 38], 'end': [38, 38] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/notepadFrontC9_hands_base.png'
		};

		a.notepadFrontC10_hand = {
			'images': ['./animations1366/superb/notepadFrontC10_hands.png'],
			'frames': { 'height': 55, 'width': 76, 'count': 39, 'regX': -31, 'regY': -37 },
			'animations': { 'start': [0, 0], 'loop': [0, 38], 'end': [38, 38] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/notepadFrontC10_hands_base.png'
		};

		a.notepadFrontC12_hand = {
			'images': ['./animations1366/superb/notepadFrontC12_hands.png'],
			'frames': { 'height': 55, 'width': 76, 'count': 39, 'regX': -31, 'regY': -37 },
			'animations': { 'start': [0, 0], 'loop': [0, 38], 'end': [38, 38] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/notepadFrontC12_hands_base.png'
		};

		a.notepadFrontC1_head = {
			'images': ['./animations1366/superb/notepadFrontC1_head.png'],
			'frames': { 'height': 42, 'width': 45, 'count': 39, 'regX': -29, 'regY': -8 },
			'animations': { 'start': [0, 0], 'loop': [0, 38], 'end': [38, 38] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/notepadFrontC1_head_base.png'
		};

		a.notepadFrontC2_head = {
			'images': ['./animations1366/superb/notepadFrontC2_head.png'],
			'frames': { 'height': 43, 'width': 47, 'count': 39, 'regX': -28, 'regY': -7 },
			'animations': { 'start': [0, 0], 'loop': [0, 38], 'end': [38, 38] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/notepadFrontC2_head_base.png'
		};

		a.notepadFrontC3_head = {
			'images': ['./animations1366/superb/notepadFrontC3_head.png'],
			'frames': { 'height': 41, 'width': 43, 'count': 39, 'regX': -29, 'regY': -9 },
			'animations': { 'start': [0, 0], 'loop': [0, 38], 'end': [38, 38] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/notepadFrontC3_head_base.png'
		};

		a.notepadFrontC5_head = {
			'images': ['./animations1366/superb/notepadFrontC4_head.png'],
			'frames': { 'height': 42, 'width': 44, 'count': 39, 'regX': -29, 'regY': -8 },
			'animations': { 'start': [0, 0], 'loop': [0, 38], 'end': [38, 38] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/notepadFrontC4_head_base.png'
		};

		a.notepadFrontC4_head = {
			'images': ['./animations1366/superb/notepadFrontC5_head.png'],
			'frames': { 'height': 41, 'width': 45, 'count': 39, 'regX': -31, 'regY': -9 },
			'animations': { 'start': [0, 0], 'loop': [0, 38], 'end': [38, 38] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/notepadFrontC5_head_base.png'
		};

		a.notepadFrontC6_head = {
			'images': ['./animations1366/superb/notepadFrontC6_head.png'],
			'frames': { 'height': 45, 'width': 43, 'count': 39, 'regX': -31, 'regY': -4 },
			'animations': { 'start': [0, 0], 'loop': [0, 38], 'end': [38, 38] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/notepadFrontC6_head_base.png'
		};

		a.notepadFrontC8_head = {
			'images': ['./animations1366/superb/notepadFrontC7_head.png'],
			'frames': { 'height': 42, 'width': 45, 'count': 39, 'regX': -29, 'regY': -8 },
			'animations': { 'start': [0, 0], 'loop': [0, 38], 'end': [38, 38] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/notepadFrontC7_head_base.png'
		};

		a.notepadFrontC7_head = {
			'images': ['./animations1366/superb/notepadFrontC8_head.png'],
			'frames': { 'height': 43, 'width': 47, 'count': 39, 'regX': -30, 'regY': -7 },
			'animations': { 'start': [0, 0], 'loop': [0, 38], 'end': [38, 38] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/notepadFrontC8_head_base.png'
		};

		a.notepadFrontC9_head = {
			'images': ['./animations1366/superb/notepadFrontC9_head.png'],
			'frames': { 'height': 46, 'width': 47, 'count': 39, 'regX': -25, 'regY': -7 },
			'animations': { 'start': [0, 0], 'loop': [0, 38], 'end': [38, 38] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/notepadFrontC9_head_base.png'
		};

		a.notepadFrontC10_head = {
			'images': ['./animations1366/superb/notepadFrontC10_head.png'],
			'frames': { 'height': 44, 'width': 43, 'count': 39, 'regX': -31, 'regY': -8 },
			'animations': { 'start': [0, 0], 'loop': [0, 38], 'end': [38, 38] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/notepadFrontC10_head_base.png'
		};

		a.notepadFrontC11_head = {
			'images': ['./animations1366/superb/notepadFrontC11_head.png'],
			'frames': { 'height': 42, 'width': 41, 'count': 39, 'regX': -31, 'regY': -10 },
			'animations': { 'start': [0, 0], 'loop': [0, 38], 'end': [38, 38] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/notepadFrontC11_head_base.png'
		};

		a.notepadFrontC12_head = {
			'images': ['./animations1366/superb/notepadFrontC12_head.png'],
			'frames': { 'height': 43, 'width': 43, 'count': 39, 'regX': -30, 'regY': -10 },
			'animations': { 'start': [0, 0], 'loop': [0, 38], 'end': [38, 38] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/notepadFrontC12_head_base.png'
		};

		a.notepadFrontC1_pants = {
			'images': ['./animations1366/superb/notepadFrontC1_pants.png'],
			'frames': { 'height': 31, 'width': 46, 'count': 39, 'regX': -31, 'regY': -71 },
			'animations': { 'start': [0, 0], 'loop': [0, 38], 'end': [38, 38] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/notepadFrontC1_pants_base.png'
		};

		a.notepadFrontC9_pants = {
			'images': ['./animations1366/superb/notepadFrontC9_pants.png'],
			'frames': { 'height': 27, 'width': 39, 'count': 39, 'regX': -31, 'regY': -74 },
			'animations': { 'start': [0, 0], 'loop': [0, 38], 'end': [38, 38] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/notepadFrontC9_pants_base.png'
		};

		a.teaCupImage = {
			'images': ['./animations1366/empty_sheet.png'],
			'frames': { 'height': 1, 'width': 1, 'count': 1, 'regX': 0, 'regY': 0 },
			'animations': { 'all': [0, 0] },
			'targetFPS': { 'all': 7 },
			'baseImage': './animations1366/superb/teacup.png'
		};

		a.teaCupImageLevel2 = {
			'images': ['./animations1366/empty_sheet.png'],
			'frames': { 'height': 1, 'width': 1, 'count': 1, 'regX': 0, 'regY': 0 },
			'animations': { 'all': [0, 0] },
			'targetFPS': { 'all': 7 },
			'baseImage': './animations1366/superb/teacupLevel2.png'
		};

		//superb end

		a.pong = {
			'images': ['./animations1366/pong.png'],
			'frames': { 'height': 77, 'regX': -16, 'count': 60, 'regY': -14, 'width': 77 },
			'animations': { 'all': [0, 59] },
			'targetFPS': { 'all': 10 }, //slower looks more like original pong
			'baseImage': './animations1366/pong_base.png'
		};

		a.idleBackC1_body = {
			'images': ['./animations1366/idleBackC1_body.png'],
			'frames': { 'height': 37, 'width': 53, 'count': 11, 'regX': -32, 'regY': -33 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/idleBackC1_body_base.png'
		};

		a.idleBackC2_body = {
			'images': ['./animations1366/idleBackC2_body.png'],
			'frames': { 'height': 37, 'width': 53, 'count': 11, 'regX': -32, 'regY': -33 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/idleBackC2_body_base.png'
		};

		a.idleBackC3_body = {
			'images': ['./animations1366/idleBackC3_body.png'],
			'frames': { 'height': 37, 'width': 53, 'count': 11, 'regX': -32, 'regY': -33 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/idleBackC3_body_base.png'
		};

		a.idleBackC4_body = {
			'images': ['./animations1366/idleBackC4_body.png'],
			'frames': { 'height': 37, 'width': 53, 'count': 11, 'regX': -32, 'regY': -33 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/idleBackC4_body_base.png'
		};

		a.idleBackC5_body = {
			'images': ['./animations1366/idleBackC5_body.png'],
			'frames': { 'height': 37, 'width': 53, 'count': 11, 'regX': -32, 'regY': -33 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/idleBackC5_body_base.png'
		};

		a.idleBackC6_body = {
			'images': ['./animations1366/idleBackC6_body.png'],
			'frames': { 'height': 37, 'width': 53, 'count': 11, 'regX': -32, 'regY': -33 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/idleBackC6_body_base.png'
		};

		a.idleBackC7_body = {
			'images': ['./animations1366/idleBackC7_body.png'],
			'frames': { 'height': 37, 'width': 53, 'count': 11, 'regX': -32, 'regY': -33 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/idleBackC7_body_base.png'
		};

		a.idleBackC8_body = {
			'images': ['./animations1366/idleBackC8_body.png'],
			'frames': { 'height': 37, 'width': 53, 'count': 11, 'regX': -32, 'regY': -33 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/idleBackC8_body_base.png'
		};

		a.idleBackC9_body = {
			'images': ['./animations1366/idleBackC9_body.png'],
			'frames': { 'height': 39, 'width': 36, 'count': 11, 'regX': -47, 'regY': -31 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/idleBackC9_body_base.png'
		};

		a.idleBackC10_body = {
			'images': ['./animations1366/idleBackC10_body.png'],
			'frames': { 'height': 39, 'width': 36, 'count': 11, 'regX': -47, 'regY': -31 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/idleBackC10_body_base.png'
		};

		a.idleBackC11_body = {
			'images': ['./animations1366/idleBackC11_body.png'],
			'frames': { 'height': 39, 'width': 36, 'count': 11, 'regX': -47, 'regY': -31 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/idleBackC11_body_base.png'
		};

		a.idleBackC12_body = {
			'images': ['./animations1366/idleBackC12_body.png'],
			'frames': { 'height': 39, 'width': 50, 'count': 11, 'regX': -33, 'regY': -31 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/idleBackC12_body_base.png'
		};

		a.idleBackC1_chair = {
			'images': ['./animations1366/idleBackC1_chair.png'],
			'frames': { 'height': 44, 'width': 59, 'count': 11, 'regX': -35, 'regY': -44 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/idleBackC1_chair_base.png'
		};

		a.idleBackC1_hand = {
			'images': ['./animations1366/idleBackC1_hands.png'],
			'frames': { 'height': 25, 'width': 36, 'count': 11, 'regX': -26, 'regY': -33 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/empty_base.png'
		};

		a.idleBackC4_hand = {
			'images': ['./animations1366/idleBackC4_hands.png'],
			'frames': { 'height': 25, 'width': 36, 'count': 11, 'regX': -26, 'regY': -33 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/empty_base.png'
		};

		a.idleBackC5_hand = {
			'images': ['./animations1366/idleBackC5_hands.png'],
			'frames': { 'height': 25, 'width': 36, 'count': 11, 'regX': -26, 'regY': -33 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/idleBackC5_hands_base.png'
		};

		a.idleBackC9_hand = {
			'images': ['./animations1366/idleBackC9_hands.png'],
			'frames': { 'height': 33, 'width': 43, 'count': 11, 'regX': -28, 'regY': -33 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/empty_base.png'
		};

		a.idleBackC10_hand = {
			'images': ['./animations1366/idleBackC10_hands.png'],
			'frames': { 'height': 33, 'width': 43, 'count': 11, 'regX': -28, 'regY': -33 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/empty_base.png'
		};

		a.idleBackC12_hand = {
			'images': ['./animations1366/idleBackC12_hands.png'],
			'frames': { 'height': 33, 'width': 43, 'count': 11, 'regX': -28, 'regY': -33 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/empty_base.png'
		};

		a.idleBackC1_head = {
			'images': ['./animations1366/idleBackC1_head.png'],
			'frames': { 'height': 41, 'width': 44, 'count': 11, 'regX': -44, 'regY': -5 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/idleBackC1_head_base.png'
		};

		a.idleBackC2_head = {
			'images': ['./animations1366/idleBackC2_head.png'],
			'frames': { 'height': 46, 'width': 44, 'count': 11, 'regX': -44, 'regY': 0 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/idleBackC2_head_base.png'
		};

		a.idleBackC3_head = {
			'images': ['./animations1366/idleBackC3_head.png'],
			'frames': { 'height': 44, 'width': 45, 'count': 11, 'regX': -44, 'regY': -2 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/idleBackC3_head_base.png'
		};

		a.idleBackC4_head = {
			'images': ['./animations1366/idleBackC4_head.png'],
			'frames': { 'height': 44, 'width': 47, 'count': 11, 'regX': -44, 'regY': 0 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/idleBackC4_head_base.png'
		};

		a.idleBackC5_head = {
			'images': ['./animations1366/idleBackC5_head.png'],
			'frames': { 'height': 44, 'width': 44, 'count': 11, 'regX': -44, 'regY': -4 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/idleBackC5_head_base.png'
		};

		a.idleBackC6_head = {
			'images': ['./animations1366/idleBackC6_head.png'],
			'frames': { 'height': 43, 'width': 47, 'count': 11, 'regX': -44, 'regY': -2 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/idleBackC6_head_base.png'
		};

		a.idleBackC7_head = {
			'images': ['./animations1366/idleBackC7_head.png'],
			'frames': { 'height': 44, 'width': 48, 'count': 11, 'regX': -44, 'regY': 0 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/idleBackC7_head_base.png'
		};

		a.idleBackC8_head = {
			'images': ['./animations1366/idleBackC8_head.png'],
			'frames': { 'height': 41, 'width': 45, 'count': 11, 'regX': -43, 'regY': -4 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/idleBackC8_head_base.png'
		};

		a.idleBackC9_head = {
			'images': ['./animations1366/idleBackC9_head.png'],
			'frames': { 'height': 52, 'width': 49, 'count': 11, 'regX': -43, 'regY': -5 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/idleBackC9_head_base.png'
		};

		a.idleBackC10_head = {
			'images': ['./animations1366/idleBackC10_head.png'],
			'frames': { 'height': 53, 'width': 49, 'count': 11, 'regX': -43, 'regY': -5 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/idleBackC10_head_base.png'
		};

		a.idleBackC11_head = {
			'images': ['./animations1366/idleBackC11_head.png'],
			'frames': { 'height': 53, 'width': 47, 'count': 11, 'regX': -43, 'regY': -5 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/idleBackC11_head_base.png'
		};

		a.idleBackC12_head = {
			'images': ['./animations1366/idleBackC12_head.png'],
			'frames': { 'height': 53, 'width': 48, 'count': 11, 'regX': -42, 'regY': -4 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/idleBackC12_head_base.png'
		};

		a.idleBackC1_pants = {
			'images': ['./animations1366/idleBackC1_pants.png'],
			'frames': { 'height': 34, 'width': 43, 'count': 11, 'regX': -23, 'regY': -58 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/idleBackC1_pants_base.png'
		};

		a.idleBackC9_pants = {
			'images': ['./animations1366/idleBackC9_pants.png'],
			'frames': { 'height': 32, 'width': 45, 'count': 11, 'regX': -21, 'regY': -64 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/idleBackC9_pants_base.png'
		};

		//superb start
		a.idleFrontC1_body = {
			'images': ['./animations1366/superb/idleFrontC1_body.png'],
			'frames': { 'height': 48, 'width': 51, 'count': 11, 'regX': -25, 'regY': -38 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/superb/idleFrontC1_body_base.png'
		};

		a.idleFrontC2_body = {
			'images': ['./animations1366/superb/idleFrontC2_body.png'],
			'frames': { 'height': 49, 'width': 52, 'count': 11, 'regX': -25, 'regY': -38 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/superb/idleFrontC2_body_base.png'
		};

		a.idleFrontC3_body = {
			'images': ['./animations1366/superb/idleFrontC3_body.png'],
			'frames': { 'height': 48, 'width': 52, 'count': 11, 'regX': -25, 'regY': -38 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/superb/idleFrontC3_body_base.png'
		};

		a.idleFrontC4_body = {
			'images': ['./animations1366/superb/idleFrontC4_body.png'],
			'frames': { 'height': 49, 'width': 51, 'count': 11, 'regX': -25, 'regY': -38 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/superb/idleFrontC4_body_base.png'
		};

		a.idleFrontC5_body = {
			'images': ['./animations1366/superb/idleFrontC5_body.png'],
			'frames': { 'height': 48, 'width': 50, 'count': 11, 'regX': -26, 'regY': -39 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/superb/idleFrontC5_body_base.png'
		};

		a.idleFrontC6_body = {
			'images': ['./animations1366/superb/idleFrontC6_body.png'],
			'frames': { 'height': 48, 'width': 50, 'count': 11, 'regX': -26, 'regY': -39 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/superb/idleFrontC6_body_base.png'
		};

		a.idleFrontC7_body = {
			'images': ['./animations1366/superb/idleFrontC7_body.png'],
			'frames': { 'height': 48, 'width': 50, 'count': 11, 'regX': -26, 'regY': -39 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/superb/idleFrontC7_body_base.png'
		};

		a.idleFrontC8_body = {
			'images': ['./animations1366/superb/idleFrontC8_body.png'],
			'frames': { 'height': 49, 'width': 50, 'count': 11, 'regX': -26, 'regY': -38 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/superb/idleFrontC8_body_base.png'
		};

		a.idleFrontC9_body = {
			'images': ['./animations1366/superb/idleFrontC9_body.png'],
			'frames': { 'height': 46, 'width': 48, 'count': 11, 'regX': -26, 'regY': -40 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/superb/idleFrontC9_body_base.png'
		};

		a.idleFrontC10_body = {
			'images': ['./animations1366/superb/idleFrontC10_body.png'],
			'frames': { 'height': 46, 'width': 48, 'count': 11, 'regX': -26, 'regY': -40 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/superb/idleFrontC10_body_base.png'
		};

		a.idleFrontC11_body = {
			'images': ['./animations1366/superb/idleFrontC11_body.png'],
			'frames': { 'height': 42, 'width': 39, 'count': 11, 'regX': -24, 'regY': -40 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/superb/idleFrontC11_body_base.png'
		};

		a.idleFrontC12_body = {
			'images': ['./animations1366/superb/idleFrontC12_body.png'],
			'frames': { 'height': 42, 'width': 38, 'count': 11, 'regX': -26, 'regY': -40 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/superb/idleFrontC12_body_base.png'
		};

		a.idleFrontC1_chair = {
			'images': ['./animations1366/superb/idleFrontC1_chair.png'],
			'frames': { 'height': 42, 'width': 40, 'count': 11, 'regX': -24, 'regY': -48 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/superb/idleFrontC1_chair_base.png'
		};

		a.idleFrontC1_hand = {
			'images': ['./animations1366/superb/idleFrontC1_hands.png'],
			'frames': { 'height': 29, 'width': 38, 'count': 11, 'regX': -46, 'regY': -63 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/empty_base.png'
		};

		a.idleFrontC4_hand = {
			'images': ['./animations1366/superb/idleFrontC4_hands.png'],
			'frames': { 'height': 29, 'width': 38, 'count': 11, 'regX': -46, 'regY': -63 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/empty_base.png'
		};

		a.idleFrontC5_hand = {
			'images': ['./animations1366/superb/idleFrontC5_hands.png'],
			'frames': { 'height': 29, 'width': 38, 'count': 11, 'regX': -46, 'regY': -63 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/empty_base.png'
		};

		a.idleFrontC9_hand = {
			'images': ['./animations1366/superb/idleFrontC9_hands.png'],
			'frames': { 'height': 38, 'width': 54, 'count': 11, 'regX': -28, 'regY': -52 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/empty_base.png'
		};

		a.idleFrontC10_hand = {
			'images': ['./animations1366/superb/idleFrontC10_hands.png'],
			'frames': { 'height': 38, 'width': 54, 'count': 11, 'regX': -28, 'regY': -52 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/empty_base.png'
		};

		a.idleFrontC12_hand = {
			'images': ['./animations1366/superb/idleFrontC12_hands.png'],
			'frames': { 'height': 38, 'width': 54, 'count': 11, 'regX': -28, 'regY': -52 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/empty_base.png'
		};

		a.idleFrontC1_head = {
			'images': ['./animations1366/superb/idleFrontC1_head.png'],
			'frames': { 'height': 40, 'width': 42, 'count': 11, 'regX': -21, 'regY': -9 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/superb/idleFrontC1_head_base.png'
		};

		a.idleFrontC2_head = {
			'images': ['./animations1366/superb/idleFrontC2_head.png'],
			'frames': { 'height': 41, 'width': 43, 'count': 11, 'regX': -21, 'regY': -8 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/superb/idleFrontC2_head_base.png'
		};

		a.idleFrontC3_head = {
			'images': ['./animations1366/superb/idleFrontC3_head.png'],
			'frames': { 'height': 39, 'width': 40, 'count': 11, 'regX': -22, 'regY': -10 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/superb/idleFrontC3_head_base.png'
		};

		a.idleFrontC5_head = {
			'images': ['./animations1366/superb/idleFrontC4_head.png'],
			'frames': { 'height': 40, 'width': 41, 'count': 11, 'regX': -22, 'regY': -9 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/superb/idleFrontC4_head_base.png'
		};

		a.idleFrontC4_head = {
			'images': ['./animations1366/superb/idleFrontC5_head.png'],
			'frames': { 'height': 40, 'width': 41, 'count': 11, 'regX': -24, 'regY': -9 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/superb/idleFrontC5_head_base.png'
		};

		a.idleFrontC6_head = {
			'images': ['./animations1366/superb/idleFrontC6_head.png'],
			'frames': { 'height': 45, 'width': 41, 'count': 11, 'regX': -23, 'regY': -4 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/superb/idleFrontC6_head_base.png'
		};

		a.idleFrontC8_head = {
			'images': ['./animations1366/superb/idleFrontC7_head.png'],
			'frames': { 'height': 40, 'width': 42, 'count': 11, 'regX': -22, 'regY': -9 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/superb/idleFrontC7_head_base.png'
		};

		a.idleFrontC7_head = {
			'images': ['./animations1366/superb/idleFrontC8_head.png'],
			'frames': { 'height': 43, 'width': 44, 'count': 11, 'regX': -22, 'regY': -6 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/superb/idleFrontC8_head_base.png'
		};

		a.idleFrontC9_head = {
			'images': ['./animations1366/superb/idleFrontC9_head.png'],
			'frames': { 'height': 45, 'width': 42, 'count': 11, 'regX': -20, 'regY': -9 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/superb/idleFrontC9_head_base.png'
		};

		a.idleFrontC11_head = {
			'images': ['./animations1366/superb/idleFrontC10_head.png'],
			'frames': { 'height': 42, 'width': 38, 'count': 11, 'regX': -24, 'regY': -10 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/superb/idleFrontC10_head_base.png'
		};

		a.idleFrontC10_head = {
			'images': ['./animations1366/superb/idleFrontC11_head.png'],
			'frames': { 'height': 43, 'width': 40, 'count': 11, 'regX': -24, 'regY': -9 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/superb/idleFrontC11_head_base.png'
		};

		a.idleFrontC12_head = {
			'images': ['./animations1366/superb/idleFrontC12_head.png'],
			'frames': { 'height': 44, 'width': 40, 'count': 11, 'regX': -23, 'regY': -10 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/superb/idleFrontC12_head_base.png'
		};

		a.idleFrontC1_pants = {
			'images': ['./animations1366/empty_sheet.png'],
			'frames': { 'height': 1, 'width': 1, 'count': 11, 'regX': 0, 'regY': 0 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/superb/idleFrontC1_pants_base.png'
		};

		a.idleFrontC9_pants = {
			'images': ['./animations1366/superb/idleFrontC9_pants.png'],
			'frames': { 'height': 25, 'width': 35, 'count': 11, 'regX': -32, 'regY': -76 },
			'animations': { 'start': [0, 9], 'loop': [10, 10], 'end': [9, 0] },
			'targetFPS': { 'start': 20, 'loop': 5, 'end': 20 },
			'baseImage': './animations1366/superb/idleFrontC9_pants_base.png'
		};

		//superb end

		a.typingBackC1_body = {
			'images': ['./animations1366/typingBackC1_body.png'],
			'frames': { 'height': 34, 'width': 46, 'count': 17, 'regX': -32, 'regY': -33 },
			'animations': { 'start': [0, 0], 'loop': [0, 16], 'end': [16, 16] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/typingBackC1_body_base.png'
		};

		a.typingBackC2_body = {
			'images': ['./animations1366/typingBackC2_body.png'],
			'frames': { 'height': 34, 'width': 48, 'count': 17, 'regX': -32, 'regY': -33 },
			'animations': { 'start': [0, 0], 'loop': [0, 16], 'end': [16, 16] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/typingBackC2_body_base.png'
		};

		a.typingBackC3_body = {
			'images': ['./animations1366/typingBackC3_body.png'],
			'frames': { 'height': 34, 'width': 46, 'count': 17, 'regX': -32, 'regY': -33 },
			'animations': { 'start': [0, 0], 'loop': [0, 16], 'end': [16, 16] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/typingBackC3_body_base.png'
		};

		a.typingBackC4_body = {
			'images': ['./animations1366/typingBackC4_body.png'],
			'frames': { 'height': 34, 'width': 48, 'count': 17, 'regX': -32, 'regY': -33 },
			'animations': { 'start': [0, 0], 'loop': [0, 16], 'end': [16, 16] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/typingBackC4_body_base.png'
		};

		a.typingBackC5_body = {
			'images': ['./animations1366/typingBackC5_body.png'],
			'frames': { 'height': 34, 'width': 48, 'count': 17, 'regX': -32, 'regY': -33 },
			'animations': { 'start': [0, 0], 'loop': [0, 16], 'end': [16, 16] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/typingBackC5_body_base.png'
		};

		a.typingBackC6_body = {
			'images': ['./animations1366/typingBackC6_body.png'],
			'frames': { 'height': 34, 'width': 46, 'count': 17, 'regX': -32, 'regY': -33 },
			'animations': { 'start': [0, 0], 'loop': [0, 16], 'end': [16, 16] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/typingBackC6_body_base.png'
		};

		a.typingBackC7_body = {
			'images': ['./animations1366/typingBackC7_body.png'],
			'frames': { 'height': 34, 'width': 48, 'count': 17, 'regX': -32, 'regY': -33 },
			'animations': { 'start': [0, 0], 'loop': [0, 16], 'end': [16, 16] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/typingBackC7_body_base.png'
		};

		a.typingBackC8_body = {
			'images': ['./animations1366/typingBackC8_body.png'],
			'frames': { 'height': 34, 'width': 48, 'count': 17, 'regX': -32, 'regY': -33 },
			'animations': { 'start': [0, 0], 'loop': [0, 16], 'end': [16, 16] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/typingBackC8_body_base.png'
		};

		a.typingBackC9_body = {
			'images': ['./animations1366/typingBackC9_body.png'],
			'frames': { 'height': 17, 'width': 31, 'count': 17, 'regX': -47, 'regY': -40 },
			'animations': { 'start': [0, 0], 'loop': [0, 16], 'end': [16, 16] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/typingBackC9_body_base.png'
		};

		a.typingBackC10_body = {
			'images': ['./animations1366/typingBackC10_body.png'],
			'frames': { 'height': 19, 'width': 31, 'count': 17, 'regX': -47, 'regY': -39 },
			'animations': { 'start': [0, 0], 'loop': [0, 16], 'end': [16, 16] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/typingBackC10_body_base.png'
		};

		a.typingBackC11_body = {
			'images': ['./animations1366/typingBackC11_body.png'],
			'frames': { 'height': 18, 'width': 31, 'count': 17, 'regX': -47, 'regY': -39 },
			'animations': { 'start': [0, 0], 'loop': [0, 16], 'end': [16, 16] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/typingBackC11_body_base.png'
		};

		a.typingBackC12_body = {
			'images': ['./animations1366/typingBackC12_body.png'],
			'frames': { 'height': 34, 'width': 46, 'count': 17, 'regX': -32, 'regY': -32 },
			'animations': { 'start': [0, 0], 'loop': [0, 16], 'end': [16, 16] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/typingBackC12_body_base.png'
		};

		a.typingBackC1_chair = {
			'images': ['./animations1366/empty_sheet.png'],
			'frames': { 'height': 1, 'width': 1, 'count': 17, 'regX': 0, 'regY': 0 },
			'animations': { 'start': [0, 0], 'loop': [0, 16], 'end': [16, 16] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/typingBackC1_chair_base.png'
		};

		a.typingBackC1_hand = {
			'images': ['./animations1366/typingBackC1_hands.png'],
			'frames': { 'height': 26, 'width': 29, 'count': 17, 'regX': -25, 'regY': -32 },
			'animations': { 'start': [0, 0], 'loop': [0, 16], 'end': [16, 16] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/typingBackC1_hands_base.png'
		};

		a.typingBackC4_hand = {
			'images': ['./animations1366/typingBackC4_hands.png'],
			'frames': { 'height': 26, 'width': 29, 'count': 17, 'regX': -25, 'regY': -32 },
			'animations': { 'start': [0, 0], 'loop': [0, 16], 'end': [16, 16] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/typingBackC4_hands_base.png'
		};

		a.typingBackC5_hand = {
			'images': ['./animations1366/typingBackC5_hands.png'],
			'frames': { 'height': 26, 'width': 29, 'count': 17, 'regX': -25, 'regY': -32 },
			'animations': { 'start': [0, 0], 'loop': [0, 16], 'end': [16, 16] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/typingBackC5_hands_base.png'
		};

		a.typingBackC9_hand = {
			'images': ['./animations1366/typingBackC9_hands.png'],
			'frames': { 'height': 33, 'width': 40, 'count': 17, 'regX': -26, 'regY': -33 },
			'animations': { 'start': [0, 0], 'loop': [0, 16], 'end': [16, 16] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/typingBackC9_hands_base.png'
		};

		a.typingBackC10_hand = {
			'images': ['./animations1366/typingBackC10_hands.png'],
			'frames': { 'height': 33, 'width': 40, 'count': 17, 'regX': -26, 'regY': -33 },
			'animations': { 'start': [0, 0], 'loop': [0, 16], 'end': [16, 16] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/typingBackC10_hands_base.png'
		};

		a.typingBackC12_hand = {
			'images': ['./animations1366/typingBackC12_hands.png'],
			'frames': { 'height': 33, 'width': 40, 'count': 17, 'regX': -26, 'regY': -33 },
			'animations': { 'start': [0, 0], 'loop': [0, 16], 'end': [16, 16] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/typingBackC12_hands_base.png'
		};

		a.typingBackC1_head = {
			'images': ['./animations1366/typingBackC1_head.png'],
			'frames': { 'height': 40, 'width': 35, 'count': 17, 'regX': -43, 'regY': -5 },
			'animations': { 'start': [0, 0], 'loop': [0, 16], 'end': [16, 16] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/typingBackC1_head_base.png'
		};

		a.typingBackC2_head = {
			'images': ['./animations1366/typingBackC2_head.png'],
			'frames': { 'height': 45, 'width': 34, 'count': 17, 'regX': -44, 'regY': 0 },
			'animations': { 'start': [0, 0], 'loop': [0, 16], 'end': [16, 16] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/typingBackC2_head_base.png'
		};

		a.typingBackC3_head = {
			'images': ['./animations1366/typingBackC3_head.png'],
			'frames': { 'height': 43, 'width': 34, 'count': 17, 'regX': -44, 'regY': -2 },
			'animations': { 'start': [0, 0], 'loop': [0, 16], 'end': [16, 16] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/typingBackC3_head_base.png'
		};

		a.typingBackC4_head = {
			'images': ['./animations1366/typingBackC4_head.png'],
			'frames': { 'height': 43, 'width': 36, 'count': 17, 'regX': -43, 'regY': 0 },
			'animations': { 'start': [0, 0], 'loop': [0, 16], 'end': [16, 16] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/typingBackC4_head_base.png'
		};

		a.typingBackC5_head = {
			'images': ['./animations1366/typingBackC5_head.png'],
			'frames': { 'height': 43, 'width': 35, 'count': 17, 'regX': -43, 'regY': -5 },
			'animations': { 'start': [0, 0], 'loop': [0, 16], 'end': [16, 16] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/typingBackC5_head_base.png'
		};

		a.typingBackC6_head = {
			'images': ['./animations1366/typingBackC6_head.png'],
			'frames': { 'height': 41, 'width': 36, 'count': 17, 'regX': -44, 'regY': -3 },
			'animations': { 'start': [0, 0], 'loop': [0, 16], 'end': [16, 16] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/typingBackC6_head_base.png'
		};

		a.typingBackC7_head = {
			'images': ['./animations1366/typingBackC7_head.png'],
			'frames': { 'height': 43, 'width': 37, 'count': 17, 'regX': -43, 'regY': 0 },
			'animations': { 'start': [0, 0], 'loop': [0, 16], 'end': [16, 16] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/typingBackC7_head_base.png'
		};

		a.typingBackC8_head = {
			'images': ['./animations1366/typingBackC8_head.png'],
			'frames': { 'height': 39, 'width': 36, 'count': 17, 'regX': -42, 'regY': -5 },
			'animations': { 'start': [0, 0], 'loop': [0, 16], 'end': [16, 16] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/typingBackC8_head_base.png'
		};

		a.typingBackC9_head = {
			'images': ['./animations1366/typingBackC9_head.png'],
			'frames': { 'height': 50, 'width': 41, 'count': 17, 'regX': -43, 'regY': -5 },
			'animations': { 'start': [0, 0], 'loop': [0, 16], 'end': [16, 16] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/typingBackC9_head_base.png'
		};

		a.typingBackC10_head = {
			'images': ['./animations1366/typingBackC10_head.png'],
			'frames': { 'height': 50, 'width': 41, 'count': 17, 'regX': -43, 'regY': -5 },
			'animations': { 'start': [0, 0], 'loop': [0, 16], 'end': [16, 16] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/typingBackC10_head_base.png'
		};

		a.typingBackC11_head = {
			'images': ['./animations1366/typingBackC11_head.png'],
			'frames': { 'height': 51, 'width': 38, 'count': 17, 'regX': -43, 'regY': -5 },
			'animations': { 'start': [0, 0], 'loop': [0, 16], 'end': [16, 16] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/typingBackC11_head_base.png'
		};

		a.typingBackC12_head = {
			'images': ['./animations1366/typingBackC12_head.png'],
			'frames': { 'height': 51, 'width': 39, 'count': 17, 'regX': -42, 'regY': -4 },
			'animations': { 'start': [0, 0], 'loop': [0, 16], 'end': [16, 16] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/typingBackC12_head_base.png'
		};

		a.typingBackC1_pants = {
			'images': ['./animations1366/empty_sheet.png'],
			'frames': { 'height': 1, 'width': 1, 'count': 17, 'regX': 0, 'regY': 0 },
			'animations': { 'start': [0, 0], 'loop': [0, 16], 'end': [16, 16] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/typingBackC1_pants_base.png'
		};

		a.typingBackC9_pants = {
			'images': ['./animations1366/empty_sheet.png'],
			'frames': { 'height': 1, 'width': 1, 'count': 17, 'regX': 0, 'regY': 0 },
			'animations': { 'start': [0, 0], 'loop': [0, 16], 'end': [16, 16] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/typingBackC9_pants_base.png'
		};

		//superb start
		a.typingFrontC1_body = {
			'images': ['./animations1366/superb/typingFrontC1_body.png'],
			'frames': { 'height': 44, 'width': 48, 'count': 10, 'regX': -29, 'regY': -41 },
			'animations': { 'start': [0, 0], 'loop': [0, 9], 'end': [9, 9] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/typingFrontC1_body_base.png'
		};

		a.typingFrontC2_body = {
			'images': ['./animations1366/superb/typingFrontC2_body.png'],
			'frames': { 'height': 43, 'width': 48, 'count': 10, 'regX': -29, 'regY': -42 },
			'animations': { 'start': [0, 0], 'loop': [0, 9], 'end': [9, 9] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/typingFrontC2_body_base.png'
		};

		a.typingFrontC3_body = {
			'images': ['./animations1366/superb/typingFrontC3_body.png'],
			'frames': { 'height': 43, 'width': 48, 'count': 10, 'regX': -29, 'regY': -42 },
			'animations': { 'start': [0, 0], 'loop': [0, 9], 'end': [9, 9] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/typingFrontC3_body_base.png'
		};

		a.typingFrontC4_body = {
			'images': ['./animations1366/superb/typingFrontC4_body.png'],
			'frames': { 'height': 44, 'width': 48, 'count': 10, 'regX': -29, 'regY': -41 },
			'animations': { 'start': [0, 0], 'loop': [0, 9], 'end': [9, 9] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/typingFrontC4_body_base.png'
		};

		a.typingFrontC5_body = {
			'images': ['./animations1366/superb/typingFrontC5_body.png'],
			'frames': { 'height': 44, 'width': 47, 'count': 10, 'regX': -29, 'regY': -41 },
			'animations': { 'start': [0, 0], 'loop': [0, 9], 'end': [9, 9] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/typingFrontC5_body_base.png'
		};

		a.typingFrontC6_body = {
			'images': ['./animations1366/superb/typingFrontC6_body.png'],
			'frames': { 'height': 43, 'width': 47, 'count': 10, 'regX': -29, 'regY': -42 },
			'animations': { 'start': [0, 0], 'loop': [0, 9], 'end': [9, 9] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/typingFrontC6_body_base.png'
		};

		a.typingFrontC7_body = {
			'images': ['./animations1366/superb/typingFrontC7_body.png'],
			'frames': { 'height': 44, 'width': 47, 'count': 10, 'regX': -29, 'regY': -41 },
			'animations': { 'start': [0, 0], 'loop': [0, 9], 'end': [9, 9] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/typingFrontC7_body_base.png'
		};

		a.typingFrontC8_body = {
			'images': ['./animations1366/superb/typingFrontC8_body.png'],
			'frames': { 'height': 43, 'width': 47, 'count': 10, 'regX': -29, 'regY': -42 },
			'animations': { 'start': [0, 0], 'loop': [0, 9], 'end': [9, 9] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/typingFrontC8_body_base.png'
		};

		a.typingFrontC9_body = {
			'images': ['./animations1366/superb/typingFrontC9_body.png'],
			'frames': { 'height': 42, 'width': 46, 'count': 10, 'regX': -29, 'regY': -43 },
			'animations': { 'start': [0, 0], 'loop': [0, 9], 'end': [9, 9] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/typingFrontC9_body_base.png'
		};

		a.typingFrontC10_body = {
			'images': ['./animations1366/superb/typingFrontC10_body.png'],
			'frames': { 'height': 41, 'width': 46, 'count': 10, 'regX': -29, 'regY': -44 },
			'animations': { 'start': [0, 0], 'loop': [0, 9], 'end': [9, 9] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/typingFrontC10_body_base.png'
		};

		a.typingFrontC11_body = {
			'images': ['./animations1366/superb/typingFrontC11_body.png'],
			'frames': { 'height': 38, 'width': 35, 'count': 10, 'regX': -28, 'regY': -44 },
			'animations': { 'start': [0, 0], 'loop': [0, 9], 'end': [9, 9] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/typingFrontC11_body_base.png'
		};

		a.typingFrontC12_body = {
			'images': ['./animations1366/superb/typingFrontC12_body.png'],
			'frames': { 'height': 38, 'width': 35, 'count': 10, 'regX': -29, 'regY': -44 },
			'animations': { 'start': [0, 0], 'loop': [0, 9], 'end': [9, 9] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/typingFrontC12_body_base.png'
		};

		a.typingFrontC1_chair = {
			'images': ['./animations1366/empty_sheet.png'],
			'frames': { 'height': 1, 'width': 1, 'count': 10, 'regX': 0, 'regY': 0 },
			'animations': { 'start': [0, 0], 'loop': [0, 9], 'end': [9, 9] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/typingFrontC1_chair_base.png'
		};

		a.typingFrontC1_hand = {
			'images': ['./animations1366/superb/typingFrontC1_hands.png'],
			'frames': { 'height': 28, 'width': 36, 'count': 10, 'regX': -49, 'regY': -64 },
			'animations': { 'start': [0, 0], 'loop': [0, 9], 'end': [9, 9] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/empty_base.png'
		};

		a.typingFrontC4_hand = {
			'images': ['./animations1366/superb/typingFrontC4_hands.png'],
			'frames': { 'height': 28, 'width': 36, 'count': 10, 'regX': -49, 'regY': -64 },
			'animations': { 'start': [0, 0], 'loop': [0, 9], 'end': [9, 9] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/empty_base.png'
		};

		a.typingFrontC5_hand = {
			'images': ['./animations1366/superb/typingFrontC5_hands.png'],
			'frames': { 'height': 28, 'width': 36, 'count': 10, 'regX': -49, 'regY': -64 },
			'animations': { 'start': [0, 0], 'loop': [0, 9], 'end': [9, 9] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/empty_base.png'
		};

		a.typingFrontC9_hand = {
			'images': ['./animations1366/superb/typingFrontC9_hands.png'],
			'frames': { 'height': 37, 'width': 52, 'count': 10, 'regX': -31, 'regY': -53 },
			'animations': { 'start': [0, 0], 'loop': [0, 9], 'end': [9, 9] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/typingFrontC9_hands_base.png'
		};

		a.typingFrontC10_hand = {
			'images': ['./animations1366/superb/typingFrontC10_hands.png'],
			'frames': { 'height': 37, 'width': 52, 'count': 10, 'regX': -31, 'regY': -53 },
			'animations': { 'start': [0, 0], 'loop': [0, 9], 'end': [9, 9] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/typingFrontC10_hands_base.png'
		};

		a.typingFrontC12_hand = {
			'images': ['./animations1366/superb/typingFrontC12_hands.png'],
			'frames': { 'height': 37, 'width': 52, 'count': 10, 'regX': -31, 'regY': -53 },
			'animations': { 'start': [0, 0], 'loop': [0, 9], 'end': [9, 9] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/typingFrontC12_hands_base.png'
		};

		a.typingFrontC1_head = {
			'images': ['./animations1366/superb/typingFrontC1_head.png'],
			'frames': { 'height': 40, 'width': 35, 'count': 10, 'regX': -29, 'regY': -9 },
			'animations': { 'start': [0, 0], 'loop': [0, 9], 'end': [9, 9] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/typingFrontC1_head_base.png'
		};

		a.typingFrontC2_head = {
			'images': ['./animations1366/superb/typingFrontC2_head.png'],
			'frames': { 'height': 41, 'width': 36, 'count': 10, 'regX': -29, 'regY': -8 },
			'animations': { 'start': [0, 0], 'loop': [0, 9], 'end': [9, 9] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/typingFrontC2_head_base.png'
		};

		a.typingFrontC3_head = {
			'images': ['./animations1366/superb/typingFrontC3_head.png'],
			'frames': { 'height': 39, 'width': 32, 'count': 10, 'regX': -30, 'regY': -10 },
			'animations': { 'start': [0, 0], 'loop': [0, 9], 'end': [9, 9] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/typingFrontC3_head_base.png'
		};

		a.typingFrontC5_head = {
			'images': ['./animations1366/superb/typingFrontC4_head.png'],
			'frames': { 'height': 40, 'width': 33, 'count': 10, 'regX': -30, 'regY': -9 },
			'animations': { 'start': [0, 0], 'loop': [0, 9], 'end': [9, 9] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/typingFrontC4_head_base.png'
		};

		a.typingFrontC4_head = {
			'images': ['./animations1366/superb/typingFrontC5_head.png'],
			'frames': { 'height': 39, 'width': 34, 'count': 10, 'regX': -31, 'regY': -10 },
			'animations': { 'start': [0, 0], 'loop': [0, 9], 'end': [9, 9] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/typingFrontC5_head_base.png'
		};

		a.typingFrontC6_head = {
			'images': ['./animations1366/superb/typingFrontC6_head.png'],
			'frames': { 'height': 45, 'width': 33, 'count': 10, 'regX': -31, 'regY': -4 },
			'animations': { 'start': [0, 0], 'loop': [0, 9], 'end': [9, 9] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/typingFrontC6_head_base.png'
		};

		a.typingFrontC8_head = {
			'images': ['./animations1366/superb/typingFrontC7_head.png'],
			'frames': { 'height': 40, 'width': 34, 'count': 10, 'regX': -30, 'regY': -9 },
			'animations': { 'start': [0, 0], 'loop': [0, 9], 'end': [9, 9] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/typingFrontC7_head_base.png'
		};

		a.typingFrontC7_head = {
			'images': ['./animations1366/superb/typingFrontC8_head.png'],
			'frames': { 'height': 42, 'width': 36, 'count': 10, 'regX': -30, 'regY': -7 },
			'animations': { 'start': [0, 0], 'loop': [0, 9], 'end': [9, 9] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/typingFrontC8_head_base.png'
		};

		a.typingFrontC9_head = {
			'images': ['./animations1366/superb/typingFrontC9_head.png'],
			'frames': { 'height': 44, 'width': 36, 'count': 10, 'regX': -26, 'regY': -9 },
			'animations': { 'start': [0, 0], 'loop': [0, 9], 'end': [9, 9] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/typingFrontC9_head_base.png'
		};

		a.typingFrontC10_head = {
			'images': ['./animations1366/superb/typingFrontC10_head.png'],
			'frames': { 'height': 43, 'width': 33, 'count': 10, 'regX': -31, 'regY': -9 },
			'animations': { 'start': [0, 0], 'loop': [0, 9], 'end': [9, 9] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/typingFrontC10_head_base.png'
		};

		a.typingFrontC11_head = {
			'images': ['./animations1366/superb/typingFrontC11_head.png'],
			'frames': { 'height': 42, 'width': 32, 'count': 10, 'regX': -31, 'regY': -10 },
			'animations': { 'start': [0, 0], 'loop': [0, 9], 'end': [9, 9] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/typingFrontC11_head_base.png'
		};

		a.typingFrontC12_head = {
			'images': ['./animations1366/superb/typingFrontC12_head.png'],
			'frames': { 'height': 42, 'width': 33, 'count': 10, 'regX': -30, 'regY': -11 },
			'animations': { 'start': [0, 0], 'loop': [0, 9], 'end': [9, 9] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/typingFrontC12_head_base.png'
		};

		a.typingFrontC1_pants = {
			'images': ['./animations1366/empty_sheet.png'],
			'frames': { 'height': 1, 'width': 1, 'count': 10, 'regX': 0, 'regY': 0 },
			'animations': { 'start': [0, 0], 'loop': [0, 9], 'end': [9, 9] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/typingFrontC1_pants_base.png'
		};

		a.typingFrontC9_pants = {
			'images': ['./animations1366/superb/typingFrontC9_pants.png'],
			'frames': { 'height': 5, 'width': 27, 'count': 10, 'regX': -33, 'regY': -77 },
			'animations': { 'start': [0, 0], 'loop': [0, 9], 'end': [9, 9] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/typingFrontC9_pants_base.png'
		};

		a.thinkingFrontC1_body = {
			'images': ['./animations1366/superb/thinkingFrontC1_body.png'],
			'frames': { 'height': 58, 'width': 54, 'count': 34, 'regX': -29, 'regY': -28 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/thinkingFrontC1_body_base.png'
		};

		a.thinkingFrontC2_body = {
			'images': ['./animations1366/superb/thinkingFrontC2_body.png'],
			'frames': { 'height': 59, 'width': 53, 'count': 34, 'regX': -29, 'regY': -27 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/thinkingFrontC2_body_base.png'
		};

		a.thinkingFrontC3_body = {
			'images': ['./animations1366/superb/thinkingFrontC3_body.png'],
			'frames': { 'height': 58, 'width': 53, 'count': 34, 'regX': -29, 'regY': -28 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/thinkingFrontC3_body_base.png'
		};

		a.thinkingFrontC4_body = {
			'images': ['./animations1366/superb/thinkingFrontC4_body.png'],
			'frames': { 'height': 59, 'width': 53, 'count': 34, 'regX': -29, 'regY': -27 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/thinkingFrontC4_body_base.png'
		};

		a.thinkingFrontC5_body = {
			'images': ['./animations1366/superb/thinkingFrontC5_body.png'],
			'frames': { 'height': 58, 'width': 53, 'count': 34, 'regX': -29, 'regY': -28 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/thinkingFrontC5_body_base.png'
		};

		a.thinkingFrontC6_body = {
			'images': ['./animations1366/superb/thinkingFrontC6_body.png'],
			'frames': { 'height': 59, 'width': 53, 'count': 34, 'regX': -29, 'regY': -27 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/thinkingFrontC6_body_base.png'
		};

		a.thinkingFrontC7_body = {
			'images': ['./animations1366/superb/thinkingFrontC7_body.png'],
			'frames': { 'height': 58, 'width': 53, 'count': 34, 'regX': -29, 'regY': -28 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/thinkingFrontC7_body_base.png'
		};

		a.thinkingFrontC8_body = {
			'images': ['./animations1366/superb/thinkingFrontC8_body.png'],
			'frames': { 'height': 58, 'width': 53, 'count': 34, 'regX': -29, 'regY': -28 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/thinkingFrontC8_body_base.png'
		};

		a.thinkingFrontC9_body = {
			'images': ['./animations1366/superb/thinkingFrontC9_body.png'],
			'frames': { 'height': 56, 'width': 52, 'count': 34, 'regX': -29, 'regY': -29 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/thinkingFrontC9_body_base.png'
		};

		a.thinkingFrontC10_body = {
			'images': ['./animations1366/superb/thinkingFrontC10_body.png'],
			'frames': { 'height': 56, 'width': 50, 'count': 34, 'regX': -31, 'regY': -29 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/thinkingFrontC10_body_base.png'
		};

		a.thinkingFrontC11_body = {
			'images': ['./animations1366/superb/thinkingFrontC11_body.png'],
			'frames': { 'height': 41, 'width': 40, 'count': 34, 'regX': -28, 'regY': -39 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/thinkingFrontC11_body_base.png'
		};

		a.thinkingFrontC12_body = {
			'images': ['./animations1366/superb/thinkingFrontC12_body.png'],
			'frames': { 'height': 42, 'width': 39, 'count': 34, 'regX': -31, 'regY': -38 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/thinkingFrontC12_body_base.png'
		};

		a.thinkingFrontC1_chair = {
			'images': ['./animations1366/empty_sheet.png'],
			'frames': { 'height': 1, 'width': 1, 'count': 34, 'regX': 0, 'regY': 0 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/thinkingFrontC1_chair_base.png'
		};

		a.thinkingFrontC1_hand = {
			'images': ['./animations1366/superb/thinkingFrontC1_hands.png'],
			'frames': { 'height': 75, 'width': 51, 'count': 34, 'regX': -41, 'regY': -18 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/thinkingFrontC1_hands_base.png'
		};

		a.thinkingFrontC4_hand = {
			'images': ['./animations1366/superb/thinkingFrontC4_hands.png'],
			'frames': { 'height': 75, 'width': 51, 'count': 34, 'regX': -41, 'regY': -18 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/thinkingFrontC4_hands_base.png'
		};

		a.thinkingFrontC5_hand = {
			'images': ['./animations1366/superb/thinkingFrontC5_hands.png'],
			'frames': { 'height': 75, 'width': 51, 'count': 34, 'regX': -41, 'regY': -18 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/thinkingFrontC5_hands_base.png'
		};

		a.thinkingFrontC9_hand = {
			'images': ['./animations1366/superb/thinkingFrontC9_hands.png'],
			'frames': { 'height': 70, 'width': 59, 'count': 34, 'regX': -31, 'regY': -21 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/thinkingFrontC9_hands_base.png'
		};

		a.thinkingFrontC10_hand = {
			'images': ['./animations1366/superb/thinkingFrontC10_hands.png'],
			'frames': { 'height': 70, 'width': 59, 'count': 34, 'regX': -31, 'regY': -21 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/thinkingFrontC10_hands_base.png'
		};

		a.thinkingFrontC12_hand = {
			'images': ['./animations1366/superb/thinkingFrontC12_hands.png'],
			'frames': { 'height': 70, 'width': 59, 'count': 34, 'regX': -31, 'regY': -21 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/thinkingFrontC12_hands_base.png'
		};

		a.thinkingFrontC1_head = {
			'images': ['./animations1366/superb/thinkingFrontC1_head.png'],
			'frames': { 'height': 40, 'width': 37, 'count': 34, 'regX': -26, 'regY': -9 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/thinkingFrontC1_head_base.png'
		};

		a.thinkingFrontC2_head = {
			'images': ['./animations1366/superb/thinkingFrontC2_head.png'],
			'frames': { 'height': 41, 'width': 38, 'count': 34, 'regX': -26, 'regY': -8 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/thinkingFrontC2_head_base.png'
		};

		a.thinkingFrontC3_head = {
			'images': ['./animations1366/superb/thinkingFrontC3_head.png'],
			'frames': { 'height': 39, 'width': 35, 'count': 34, 'regX': -27, 'regY': -10 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/thinkingFrontC3_head_base.png'
		};

		a.thinkingFrontC5_head = {
			'images': ['./animations1366/superb/thinkingFrontC4_head.png'],
			'frames': { 'height': 40, 'width': 36, 'count': 34, 'regX': -27, 'regY': -9 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/thinkingFrontC4_head_base.png'
		};

		a.thinkingFrontC4_head = {
			'images': ['./animations1366/superb/thinkingFrontC5_head.png'],
			'frames': { 'height': 40, 'width': 36, 'count': 34, 'regX': -29, 'regY': -9 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/thinkingFrontC5_head_base.png'
		};

		a.thinkingFrontC6_head = {
			'images': ['./animations1366/superb/thinkingFrontC6_head.png'],
			'frames': { 'height': 45, 'width': 36, 'count': 34, 'regX': -28, 'regY': -4 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/thinkingFrontC6_head_base.png'
		};

		a.thinkingFrontC8_head = {
			'images': ['./animations1366/superb/thinkingFrontC7_head.png'],
			'frames': { 'height': 40, 'width': 37, 'count': 34, 'regX': -27, 'regY': -9 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/thinkingFrontC7_head_base.png'
		};

		a.thinkingFrontC7_head = {
			'images': ['./animations1366/superb/thinkingFrontC8_head.png'],
			'frames': { 'height': 43, 'width': 39, 'count': 34, 'regX': -27, 'regY': -6 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/thinkingFrontC8_head_base.png'
		};

		a.thinkingFrontC9_head = {
			'images': ['./animations1366/superb/thinkingFrontC9_head.png'],
			'frames': { 'height': 45, 'width': 38, 'count': 34, 'regX': -25, 'regY': -8 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/thinkingFrontC9_head_base.png'
		};

		a.thinkingFrontC10_head = {
			'images': ['./animations1366/superb/thinkingFrontC10_head.png'],
			'frames': { 'height': 43, 'width': 33, 'count': 34, 'regX': -31, 'regY': -9 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/thinkingFrontC10_head_base.png'
		};

		a.thinkingFrontC11_head = {
			'images': ['./animations1366/superb/thinkingFrontC11_head.png'],
			'frames': { 'height': 42, 'width': 32, 'count': 34, 'regX': -31, 'regY': -10 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/thinkingFrontC11_head_base.png'
		};

		a.thinkingFrontC12_head = {
			'images': ['./animations1366/superb/thinkingFrontC12_head.png'],
			'frames': { 'height': 42, 'width': 34, 'count': 34, 'regX': -30, 'regY': -11 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/thinkingFrontC12_head_base.png'
		};

		a.thinkingFrontC1_pants = {
			'images': ['./animations1366/empty_sheet.png'],
			'frames': { 'height': 1, 'width': 1, 'count': 34, 'regX': 0, 'regY': 0 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/thinkingFrontC1_pants_base.png'
		};

		a.thinkingFrontC9_pants = {
			'images': ['./animations1366/empty_sheet.png'],
			'frames': { 'height': 1, 'width': 1, 'count': 34, 'regX': 0, 'regY': 0 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/superb/thinkingFrontC9_pants_base.png'
		};
		//superb end

		a.thinkingBackC1_body = {
			'images': ['./animations1366/thinkingBackC1_body.png'],
			'frames': { 'height': 49, 'width': 49, 'count': 34, 'regX': -31, 'regY': -17 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/thinkingBackC1_body_base.png'
		};

		a.thinkingBackC2_body = {
			'images': ['./animations1366/thinkingBackC2_body.png'],
			'frames': { 'height': 50, 'width': 49, 'count': 34, 'regX': -31, 'regY': -17 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/thinkingBackC2_body_base.png'
		};

		a.thinkingBackC3_body = {
			'images': ['./animations1366/thinkingBackC3_body.png'],
			'frames': { 'height': 50, 'width': 49, 'count': 34, 'regX': -31, 'regY': -17 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/thinkingBackC3_body_base.png'
		};

		a.thinkingBackC4_body = {
			'images': ['./animations1366/thinkingBackC4_body.png'],
			'frames': { 'height': 50, 'width': 49, 'count': 34, 'regX': -31, 'regY': -17 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/thinkingBackC4_body_base.png'
		};

		a.thinkingBackC5_body = {
			'images': ['./animations1366/thinkingBackC5_body.png'],
			'frames': { 'height': 48, 'width': 49, 'count': 34, 'regX': -31, 'regY': -18 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/thinkingBackC5_body_base.png'
		};

		a.thinkingBackC6_body = {
			'images': ['./animations1366/thinkingBackC6_body.png'],
			'frames': { 'height': 48, 'width': 49, 'count': 34, 'regX': -31, 'regY': -18 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/thinkingBackC6_body_base.png'
		};

		a.thinkingBackC7_body = {
			'images': ['./animations1366/thinkingBackC7_body.png'],
			'frames': { 'height': 50, 'width': 49, 'count': 34, 'regX': -31, 'regY': -17 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/thinkingBackC7_body_base.png'
		};

		a.thinkingBackC8_body = {
			'images': ['./animations1366/thinkingBackC8_body.png'],
			'frames': { 'height': 48, 'width': 49, 'count': 34, 'regX': -31, 'regY': -18 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/thinkingBackC8_body_base.png'
		};

		a.thinkingBackC9_body = {
			'images': ['./animations1366/thinkingBackC9_body.png'],
			'frames': { 'height': 27, 'width': 32, 'count': 34, 'regX': -46, 'regY': -35 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/thinkingBackC9_body_base.png'
		};

		a.thinkingBackC10_body = {
			'images': ['./animations1366/thinkingBackC10_body.png'],
			'frames': { 'height': 22, 'width': 32, 'count': 34, 'regX': -46, 'regY': -35 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/thinkingBackC10_body_base.png'
		};

		a.thinkingBackC11_body = {
			'images': ['./animations1366/thinkingBackC11_body.png'],
			'frames': { 'height': 22, 'width': 32, 'count': 34, 'regX': -46, 'regY': -35 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/thinkingBackC11_body_base.png'
		};

		a.thinkingBackC12_body = {
			'images': ['./animations1366/thinkingBackC12_body.png'],
			'frames': { 'height': 48, 'width': 46, 'count': 34, 'regX': -32, 'regY': -18 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/thinkingBackC12_body_base.png'
		};

		a.thinkingBackC1_chair = {
			'images': ['./animations1366/empty_sheet.png'],
			'frames': { 'height': 1, 'width': 1, 'count': 34, 'regX': 0, 'regY': 0 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/thinkingBackC1_chair_base.png'
		};

		a.thinkingBackC1_hand = {
			'images': ['./animations1366/thinkingBackC1_hands.png'],
			'frames': { 'height': 46, 'width': 45, 'count': 34, 'regX': -26, 'regY': -11 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/thinkingBackC1_hands_base.png'
		};

		a.thinkingBackC4_hand = {
			'images': ['./animations1366/thinkingBackC4_hands.png'],
			'frames': { 'height': 46, 'width': 45, 'count': 34, 'regX': -26, 'regY': -11 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/thinkingBackC4_hands_base.png'
		};

		a.thinkingBackC5_hand = {
			'images': ['./animations1366/thinkingBackC5_hands.png'],
			'frames': { 'height': 46, 'width': 45, 'count': 34, 'regX': -26, 'regY': -11 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/thinkingBackC5_hands_base.png'
		};

		a.thinkingBackC9_hand = {
			'images': ['./animations1366/thinkingBackC9_hands.png'],
			'frames': { 'height': 54, 'width': 41, 'count': 34, 'regX': -27, 'regY': -12 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/thinkingBackC9_hands_base.png'
		};

		a.thinkingBackC10_hand = {
			'images': ['./animations1366/thinkingBackC10_hands.png'],
			'frames': { 'height': 54, 'width': 41, 'count': 34, 'regX': -27, 'regY': -12 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/thinkingBackC10_hands_base.png'
		};

		a.thinkingBackC12_hand = {
			'images': ['./animations1366/thinkingBackC12_hands.png'],
			'frames': { 'height': 54, 'width': 41, 'count': 34, 'regX': -27, 'regY': -12 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/thinkingBackC12_hands_base.png'
		};

		a.thinkingBackC1_head = {
			'images': ['./animations1366/thinkingBackC1_head.png'],
			'frames': { 'height': 40, 'width': 35, 'count': 34, 'regX': -44, 'regY': -5 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/thinkingBackC1_head_base.png'
		};

		a.thinkingBackC2_head = {
			'images': ['./animations1366/thinkingBackC2_head.png'],
			'frames': { 'height': 46, 'width': 35, 'count': 34, 'regX': -44, 'regY': 0 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/thinkingBackC2_head_base.png'
		};

		a.thinkingBackC3_head = {
			'images': ['./animations1366/thinkingBackC3_head.png'],
			'frames': { 'height': 44, 'width': 37, 'count': 34, 'regX': -44, 'regY': -2 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/thinkingBackC3_head_base.png'
		};

		a.thinkingBackC4_head = {
			'images': ['./animations1366/thinkingBackC4_head.png'],
			'frames': { 'height': 43, 'width': 37, 'count': 34, 'regX': -44, 'regY': 0 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/thinkingBackC4_head_base.png'
		};

		a.thinkingBackC5_head = {
			'images': ['./animations1366/thinkingBackC5_head.png'],
			'frames': { 'height': 44, 'width': 35, 'count': 34, 'regX': -44, 'regY': -4 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/thinkingBackC5_head_base.png'
		};

		a.thinkingBackC6_head = {
			'images': ['./animations1366/thinkingBackC6_head.png'],
			'frames': { 'height': 41, 'width': 37, 'count': 34, 'regX': -44, 'regY': -3 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/thinkingBackC6_head_base.png'
		};

		a.thinkingBackC7_head = {
			'images': ['./animations1366/thinkingBackC7_head.png'],
			'frames': { 'height': 44, 'width': 38, 'count': 34, 'regX': -44, 'regY': 0 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/thinkingBackC7_head_base.png'
		};

		a.thinkingBackC8_head = {
			'images': ['./animations1366/thinkingBackC8_head.png'],
			'frames': { 'height': 40, 'width': 36, 'count': 34, 'regX': -43, 'regY': -4 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/thinkingBackC8_head_base.png'
		};

		a.thinkingBackC9_head = {
			'images': ['./animations1366/thinkingBackC9_head.png'],
			'frames': { 'height': 52, 'width': 42, 'count': 34, 'regX': -43, 'regY': -5 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/thinkingBackC9_head_base.png'
		};

		a.thinkingBackC10_head = {
			'images': ['./animations1366/thinkingBackC10_head.png'],
			'frames': { 'height': 53, 'width': 42, 'count': 34, 'regX': -43, 'regY': -5 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/thinkingBackC10_head_base.png'
		};

		a.thinkingBackC11_head = {
			'images': ['./animations1366/thinkingBackC11_head.png'],
			'frames': { 'height': 53, 'width': 40, 'count': 34, 'regX': -43, 'regY': -5 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/thinkingBackC11_head_base.png'
		};

		a.thinkingBackC12_head = {
			'images': ['./animations1366/thinkingBackC12_head.png'],
			'frames': { 'height': 53, 'width': 41, 'count': 34, 'regX': -42, 'regY': -4 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/thinkingBackC12_head_base.png'
		};

		a.thinkingBackC1_pants = {
			'images': ['./animations1366/empty_sheet.png'],
			'frames': { 'height': 1, 'width': 1, 'count': 34, 'regX': 0, 'regY': 0 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/thinkingBackC1_pants_base.png'
		};

		a.thinkingBackC9_pants = {
			'images': ['./animations1366/empty_sheet.png'],
			'frames': { 'height': 1, 'width': 1, 'count': 34, 'regX': 0, 'regY': 0 },
			'animations': { 'start': [0, 0], 'loop': [0, 33], 'end': [33, 33] },
			'targetFPS': { 'start': 10, 'loop': 10, 'end': 10 },
			'baseImage': './animations1366/thinkingBackC9_pants_base.png'
		};

		//superb start
		a.airCon = {
			'images': ['./animations1366/superb/airCon.png'],
			'frames': { 'height': 37, 'width': 55, 'count': 21, 'regX': -210, 'regY': -218 },
			'animations': { 'loop': [0, 20] },
			'targetFPS': { 'loop': 10 },
			'baseImage': './animations1366/superb/airCon_base.png'
		};

		a.waterCooler = {
			'images': ['./animations1366/superb/waterCooler.png'],
			'frames': { 'height': 20, 'width': 8, 'count': 16, 'regX': -20, 'regY': -32 },
			'animations': { 'loop': [0, 15] },
			'targetFPS': { 'loop': 10 },
			'baseImage': './animations1366/superb/waterCooler_base.png'
		};

		a.printer = {
			'images': ['./animations1366/superb/printer.png'],
			'frames': { 'height': 24, 'width': 29, 'count': 41, 'regX': -32, 'regY': -48 },
			'animations': { 'loop': [0, 40] },
			'targetFPS': { 'loop': 10 },
			'baseImage': './animations1366/superb/printer_base.png'
		};

		a.rndPrinterLeftScreen = {
			'images': ['./animations1366/superb/rndPrinterLeftScreen.png'],
			'frames': { 'height': 72, 'width': 101, 'count': 30, 'regX': -10, 'regY': -36 },
			'animations': { 'loop': [0, 29] },
			'targetFPS': { 'loop': 10 },
			'baseImage': './animations1366/superb/rndPrinterLeftScreen_base.png'
		};

		a.rndPrinterRightScreen = {
			'images': ['./animations1366/superb/rndPrinterRightScreen.png'],
			'frames': { 'height': 97, 'width': 100, 'count': 30, 'regX': -22, 'regY': -9 },
			'animations': { 'loop': [0, 29] },
			'targetFPS': { 'loop': 10 },
			'baseImage': './animations1366/superb/rndPrinterRightScreen_base.png'
		};

		//superb end
	} else {
		a.typingScreenL1 = {
			'images': ['./animations/typingScreenL1.png'],
			'frames': { 'regY': 0, 'height': 60, 'regX': 0, 'width': 44, 'count': 46 },
			'animations': { 'loop': [0, 45] },
			'targetFPS': { 'loop': 7 }
		};

		//superb start
		a.typingScreenL2 = {
			'images': ['./animations/superb/typingScreenL2.png'],
			'frames': { 'regY': -6, 'height': 74, 'regX': -18, 'width': 51, 'count': 54 },
			'animations': { 'loop': [0, 53] },
			'targetFPS': { 'loop': 30 },
			'baseImage': './animations/superb/typingScreenL2_base.png'
		};

		a.typingScreenL3 = {
			'images': ['./animations/superb/typingScreenL3.png'],
			'frames': { 'regY': -24, 'height': 55, 'regX': -39, 'width': 44, 'count': 56 },
			'animations': { 'loop': [0, 55] },
			'targetFPS': { 'loop': 15 },
			'baseImage': './animations/superb/typingScreenL3_base.png'
		};

		a.typingScreenL4 = {
			'images': ['./animations/superb/typingScreenL4.png'],
			'frames': { 'height': 92, 'width': 74, 'count': 250, 'regX': -0, 'regY': -0 },
			'animations': { 'loop': [0, 249] },
			'targetFPS': { 'loop': 15 },
			'baseImage': './animations/superb/typingScreenL4_base.png'
		};

		a.hwLabScreenWall = {
			'images': ['./animations/superb/hwLabScreenWall_0.png', './animations/superb/hwLabScreenWall_1.png', './animations/superb/hwLabScreenWall_2.png', './animations/superb/hwLabScreenWall_3.png', './animations/superb/hwLabScreenWall_4.png', './animations/superb/hwLabScreenWall_5.png'],
			'frames': { 'height': 407, 'width': 546, 'count': 90, 'regX': -22, 'regY': -123 },
			'animations': { 'loop': [0, 89] },
			'targetFPS': { 'loop': 30 },
			'baseImage': './animations/superb/hwLabScreenWall_base.png'
		};

		a.hwTV = {
			'images': ['./animations/superb/hwTV_0.png', './animations/superb/hwTV_1.png', './animations/superb/hwTV_2.png', './animations/superb/hwTV_3.png', './animations/superb/hwTV_4.png', './animations/superb/hwTV_5.png'],
			'frames': { 'height': 343, 'width': 289, 'count': 182, 'regX': -20, 'regY': -35 },
			'animations': { 'loop': [0, 181] },
			'targetFPS': { 'loop': 30 },
			'baseImage': './animations/superb/hwTV_base.png'
		};

		a.hwFrontFemale1 = {
			'images': ['./animations/superb/hwFrontFemale1.png'],
			'frames': { 'height': 232, 'width': 75, 'count': 90, 'regX': -45, 'regY': -13 },
			'animations': { 'loop': [0, 89] },
			'targetFPS': { 'loop': 30 },
			'baseImage': './animations/superb/hwFrontFemale1_base.png'
		};

		a.hwFrontFemale2 = {
			'images': ['./animations/superb/hwFrontFemale2.png'],
			'frames': { 'height': 226, 'width': 75, 'count': 90, 'regX': -45, 'regY': -19 },
			'animations': { 'loop': [0, 89] },
			'targetFPS': { 'loop': 30 },
			'baseImage': './animations/superb/hwFrontFemale2_base.png'
		};

		a.hwFrontFemale4 = {
			'images': ['./animations/superb/hwFrontFemale4.png'],
			'frames': { 'height': 226, 'width': 85, 'count': 31, 'regX': -34, 'regY': -19 },
			'animations': { 'loop': [0, 30] },
			'targetFPS': { 'loop': 30 },
			'baseImage': './animations/superb/hwFrontFemale4_base.png'
		};

		a.hwBackFemale1 = {
			'images': ['./animations/superb/hwBackFemale1.png'],
			'frames': { 'height': 225, 'width': 68, 'count': 31, 'regX': -40, 'regY': -19 },
			'animations': { 'loop': [0, 30] },
			'targetFPS': { 'loop': 30 },
			'baseImage': './animations/superb/hwBackFemale1_base.png'
		};

		a.hwBackFemale2 = {
			'images': ['./animations/superb/hwBackFemale2.png'],
			'frames': { 'height': 224, 'width': 68, 'count': 31, 'regX': -40, 'regY': -20 },
			'animations': { 'loop': [0, 30] },
			'targetFPS': { 'loop': 30 },
			'baseImage': './animations/superb/hwBackFemale2_base.png'
		};

		a.hwBackFemale3 = {
			'images': ['./animations/superb/hwBackFemale3.png'],
			'frames': { 'height': 110, 'width': 90, 'count': 31, 'regX': -41, 'regY': -18 },
			'animations': { 'loop': [0, 30] },
			'targetFPS': { 'loop': 30 },
			'baseImage': './animations/superb/hwBackFemale3_base.png'
		};

		a.hwBackFemale4 = {
			'images': ['./animations/superb/hwBackFemale4.png'],
			'frames': { 'height': 108, 'width': 92, 'count': 31, 'regX': -40, 'regY': -20 },
			'animations': { 'loop': [0, 30] },
			'targetFPS': { 'loop': 30 },
			'baseImage': './animations/superb/hwBackFemale4_base.png'
		};

		a.hwFrontMale2 = {
			'images': ['./animations/superb/hwFrontMale2.png'],
			'frames': { 'height': 227, 'width': 81, 'count': 90, 'regX': -46, 'regY': -19 },
			'animations': { 'loop': [0, 89] },
			'targetFPS': { 'loop': 30 },
			'baseImage': './animations/superb/hwFrontMale2_base.png'
		};

		a.hwFrontMale3 = {
			'images': ['./animations/superb/hwFrontMale3.png'],
			'frames': { 'height': 220, 'width': 93, 'count': 31, 'regX': -28, 'regY': -26 },
			'animations': { 'loop': [0, 30] },
			'targetFPS': { 'loop': 30 },
			'baseImage': './animations/superb/hwFrontMale3_base.png'
		};

		a.hwFrontMale4 = {
			'images': ['./animations/superb/hwFrontMale4.png'],
			'frames': { 'height': 227, 'width': 93, 'count': 31, 'regX': -28, 'regY': -19 },
			'animations': { 'loop': [0, 30] },
			'targetFPS': { 'loop': 30 },
			'baseImage': './animations/superb/hwFrontMale4_base.png'
		};

		a.hwBackMale1 = {
			'images': ['./animations/superb/hwBackMale1.png'],
			'frames': { 'height': 226, 'width': 79, 'count': 31, 'regX': -37, 'regY': -21 },
			'animations': { 'loop': [0, 30] },
			'targetFPS': { 'loop': 30 },
			'baseImage': './animations/superb/hwBackMale1_base.png'
		};

		a.hwBackMale2 = {
			'images': ['./animations/superb/hwBackMale2.png'],
			'frames': { 'height': 113, 'width': 101, 'count': 31, 'regX': -37, 'regY': -21 },
			'animations': { 'loop': [0, 30] },
			'targetFPS': { 'loop': 30 },
			'baseImage': './animations/superb/hwBackMale2_base.png'
		};

		a.rndActor1 = {
			'images': ['./animations/superb/rndActor1.png'],
			'frames': { 'height': 227, 'width': 133, 'count': 31, 'regX': -9, 'regY': -23 },
			'animations': { 'loop': [0, 30] },
			'targetFPS': { 'loop': 30 },
			'baseImage': './animations/superb/rndActor1_base.png'
		};

		a.rndFemaleBoardBack1 = {
			'images': ['./animations/superb/rndFemaleBoardBack1.png'],
			'frames': { 'height': 227, 'width': 89, 'count': 31, 'regX': -41, 'regY': -20 },
			'animations': { 'loop': [0, 30] },
			'targetFPS': { 'loop': 30 },
			'baseImage': './animations/superb/rndFemaleBoardBack1_base.png'
		};

		a.rndMaleBoardFront1 = {
			'images': ['./animations/superb/rndMaleBoardFront1.png'],
			'frames': { 'height': 235, 'width': 125, 'count': 46, 'regX': -19, 'regY': -12 },
			'animations': { 'loop': [0, 45] },
			'targetFPS': { 'loop': 30 },
			'baseImage': './animations/superb/rndMaleBoardFront1_base.png'
		};

		a.rndFemaleTypingBack1 = {
			'images': ['./animations/superb/rndFemaleTypingBack1.png'],
			'frames': { 'height': 224, 'width': 96, 'count': 51, 'regX': -31, 'regY': -26 },
			'animations': { 'loop': [0, 50] },
			'targetFPS': { 'loop': 30 },
			'baseImage': './animations/superb/rndFemaleTypingBack1_base.png'
		};

		a.rndMaleTypingBack1 = {
			'images': ['./animations/superb/rndMaleTypingBack1.png'],
			'frames': { 'height': 233, 'width': 99, 'count': 51, 'regX': -23, 'regY': -17 },
			'animations': { 'loop': [0, 50] },
			'targetFPS': { 'loop': 30 },
			'baseImage': './animations/superb/rndMaleTypingBack1_base.png'
		};

		a.rndOperator1 = {
			'images': ['./animations/superb/rndOperator1.png'],
			'frames': { 'height': 218, 'width': 100, 'count': 31, 'regX': -24, 'regY': -27 },
			'animations': { 'loop': [0, 30] },
			'targetFPS': { 'loop': 30 },
			'baseImage': './animations/superb/rndOperator1_base.png'
		};

		a.rndFemaleTableBack1 = {
			'images': ['./animations/superb/rndFemaleTableBack1.png'],
			'frames': { 'height': 121, 'width': 101, 'count': 46, 'regX': -70, 'regY': -6 },
			'animations': { 'loop': [0, 45] },
			'targetFPS': { 'loop': 30 },
			'baseImage': './animations/superb/rndFemaleTableBack1_base.png'
		};

		a.rndFemaleTableFront1_body = {
			'images': ['./animations/superb/rndFemaleTableFront1_body.png'],
			'frames': { 'height': 143, 'width': 98, 'count': 46, 'regX': -49, 'regY': -32 },
			'animations': { 'loop': [0, 45] },
			'targetFPS': { 'loop': 30 },
			'baseImage': './animations/superb/rndFemaleTableFront1_body_base.png'
		};

		a.rndFemaleTableFront1_pants = {
			'images': ['./animations/empty_sheet.png'],
			'frames': { 'height': 1, 'width': 1, 'count': 46, 'regX': 0, 'regY': 0 },
			'animations': { 'loop': [0, 45] },
			'targetFPS': { 'loop': 30 },
			'baseImage': './animations/superb/rndFemaleTableFront1_pants_base.png'
		};

		a.rndMaleFrontTable1_body = {
			'images': ['./animations/superb/rndMaleFrontTable1_body.png'],
			'frames': { 'height': 148, 'width': 90, 'count': 46, 'regX': -51, 'regY': -21 },
			'animations': { 'loop': [0, 45] },
			'targetFPS': { 'loop': 30 },
			'baseImage': './animations/superb/rndMaleFrontTable1_body_base.png'
		};

		a.rndMaleFrontTable1_pants = {
			'images': ['./animations/empty_sheet.png'],
			'frames': { 'height': 1, 'width': 1, 'count': 46, 'regX': 0, 'regY': 0 },
			'animations': { 'loop': [0, 45] },
			'targetFPS': { 'loop': 30 },
			'baseImage': './animations/superb/rndMaleFrontTable1_pants_base.png'
		};

		a.rndMaleFrontTable2_body = {
			'images': ['./animations/superb/rndMaleFrontTable2_body.png'],
			'frames': { 'height': 117, 'width': 105, 'count': 92, 'regX': -51, 'regY': -25 },
			'animations': { 'loop': [0, 91] },
			'targetFPS': { 'loop': 30 },
			'baseImage': './animations/superb/rndMaleFrontTable2_body_base.png'
		};

		a.rndMaleFrontTable2_pants = {
			'images': ['./animations/empty_sheet.png'],
			'frames': { 'height': 1, 'width': 1, 'count': 92, 'regX': 0, 'regY': 0 },
			'animations': { 'loop': [0, 91] },
			'targetFPS': { 'loop': 30 },
			'baseImage': './animations/superb/rndMaleFrontTable2_pants_base.png'
		};

		a.rndMaleTableBack1 = {
			'images': ['./animations/superb/rndMaleTableBack1.png'],
			'frames': { 'height': 125, 'width': 96, 'count': 92, 'regX': -69, 'regY': -9 },
			'animations': { 'loop': [0, 45] },
			'targetFPS': { 'loop': 30 },
			'baseImage': './animations/superb/rndMaleTableBack1_base.png'
		};

		a.rndMaleTableBack2 = {
			'images': ['./animations/superb/rndMaleTableBack2.png'],
			'frames': { 'height': 136, 'width': 101, 'count': 46, 'regX': -68, 'regY': 0 },
			'animations': { 'loop': [0, 45] },
			'targetFPS': { 'loop': 30 },
			'baseImage': './animations/superb/rndMaleTableBack2_base.png'
		};

		//superb end

		a.notepadBackC1_body = {
			'images': ['./animations/notepadBackC1_body.png'],
			'frames': { 'height': 70, 'width': 106, 'count': 113, 'regX': -41, 'regY': -56 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/notepadBackC1_body_base.png'
		};

		a.notepadBackC2_body = {
			'images': ['./animations/notepadBackC2_body.png'],
			'frames': { 'height': 70, 'width': 106, 'count': 113, 'regX': -41, 'regY': -56 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/notepadBackC2_body_base.png'
		};

		a.notepadBackC3_body = {
			'images': ['./animations/notepadBackC3_body.png'],
			'frames': { 'height': 70, 'width': 106, 'count': 113, 'regX': -41, 'regY': -56 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/notepadBackC3_body_base.png'
		};

		a.notepadBackC4_body = {
			'images': ['./animations/notepadBackC4_body.png'],
			'frames': { 'height': 70, 'width': 106, 'count': 113, 'regX': -41, 'regY': -56 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/notepadBackC4_body_base.png'
		};

		a.notepadBackC5_body = {
			'images': ['./animations/notepadBackC5_body.png'],
			'frames': { 'height': 71, 'width': 105, 'count': 113, 'regX': -42, 'regY': -55 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/notepadBackC5_body_base.png'
		};

		a.notepadBackC6_body = {
			'images': ['./animations/notepadBackC6_body.png'],
			'frames': { 'height': 71, 'width': 105, 'count': 113, 'regX': -42, 'regY': -55 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/notepadBackC6_body_base.png'
		};

		a.notepadBackC7_body = {
			'images': ['./animations/notepadBackC7_body.png'],
			'frames': { 'height': 70, 'width': 106, 'count': 113, 'regX': -41, 'regY': -56 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/notepadBackC7_body_base.png'
		};

		a.notepadBackC8_body = {
			'images': ['./animations/notepadBackC8_body.png'],
			'frames': { 'height': 70, 'width': 105, 'count': 113, 'regX': -42, 'regY': -56 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/notepadBackC8_body_base.png'
		};

		a.notepadBackC9_body = {
			'images': ['./animations/notepadBackC9_body.png'],
			'frames': { 'height': 67, 'width': 61, 'count': 113, 'regX': -81, 'regY': -61 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/notepadBackC9_body_base.png'
		};

		a.notepadBackC10_body = {
			'images': ['./animations/notepadBackC10_body.png'],
			'frames': { 'height': 67, 'width': 61, 'count': 113, 'regX': -81, 'regY': -61 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/notepadBackC10_body_base.png'
		};

		a.notepadBackC11_body = {
			'images': ['./animations/notepadBackC11_body.png'],
			'frames': { 'height': 67, 'width': 60, 'count': 113, 'regX': -81, 'regY': -61 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/notepadBackC11_body_base.png'
		};

		a.notepadBackC12_body = {
			'images': ['./animations/notepadBackC12_body.png'],
			'frames': { 'height': 72, 'width': 105, 'count': 113, 'regX': -37, 'regY': -56 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/notepadBackC12_body_base.png'
		};

		a.notepadBackC1_chair = {
			'images': ['./animations/empty_sheet.png'],
			'frames': { 'height': 1, 'width': 1, 'count': 113, 'regX': 0, 'regY': 0 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/notepadBackC1_chair_base.png'
		};

		a.notepadBackC1_hand = {
			'images': ['./animations/notepadBackC1_hands.png'],
			'frames': { 'height': 77, 'width': 100, 'count': 113, 'regX': -14, 'regY': -44 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 }
		};

		a.notepadBackC4_hand = {
			'images': ['./animations/notepadBackC4_hands.png'],
			'frames': { 'height': 77, 'width': 100, 'count': 113, 'regX': -14, 'regY': -44 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 }
		};

		a.notepadBackC5_hand = {
			'images': ['./animations/notepadBackC5_hands.png'],
			'frames': { 'height': 77, 'width': 100, 'count': 113, 'regX': -14, 'regY': -44 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 }
		};

		a.notepadBackC9_hand = {
			'images': ['./animations/notepadBackC9_hands.png'],
			'frames': { 'height': 84, 'width': 114, 'count': 113, 'regX': -11, 'regY': -44 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/notepadBackC9_hands_base.png'
		};

		a.notepadBackC10_hand = {
			'images': ['./animations/notepadBackC10_hands.png'],
			'frames': { 'height': 84, 'width': 115, 'count': 113, 'regX': -10, 'regY': -44 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/notepadBackC10_hands_base.png'
		};

		a.notepadBackC12_hand = {
			'images': ['./animations/notepadBackC12_hands.png'],
			'frames': { 'height': 84, 'width': 114, 'count': 113, 'regX': -11, 'regY': -44 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/notepadBackC12_hands_base.png'
		};

		a.notepadBackC1_head = {
			'images': ['./animations/notepadBackC1_head.png'],
			'frames': { 'height': 76, 'width': 80, 'count': 113, 'regX': -63, 'regY': -11 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/notepadBackC1_head_base.png'
		};

		a.notepadBackC2_head = {
			'images': ['./animations/notepadBackC2_head.png'],
			'frames': { 'height': 81, 'width': 78, 'count': 113, 'regX': -64, 'regY': -2 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/notepadBackC2_head_base.png'
		};

		a.notepadBackC3_head = {
			'images': ['./animations/notepadBackC3_head.png'],
			'frames': { 'height': 78, 'width': 81, 'count': 113, 'regX': -62, 'regY': -7 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/notepadBackC3_head_base.png'
		};

		a.notepadBackC4_head = {
			'images': ['./animations/notepadBackC4_head.png'],
			'frames': { 'height': 78, 'width': 83, 'count': 113, 'regX': -62, 'regY': -3 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/notepadBackC4_head_base.png'
		};

		a.notepadBackC5_head = {
			'images': ['./animations/notepadBackC5_head.png'],
			'frames': { 'height': 76, 'width': 78, 'count': 113, 'regX': -64, 'regY': -12 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/notepadBackC5_head_base.png'
		};

		a.notepadBackC6_head = {
			'images': ['./animations/notepadBackC6_head.png'],
			'frames': { 'height': 75, 'width': 82, 'count': 113, 'regX': -63, 'regY': -8 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/notepadBackC6_head_base.png'
		};

		a.notepadBackC7_head = {
			'images': ['./animations/notepadBackC7_head.png'],
			'frames': { 'height': 78, 'width': 84, 'count': 113, 'regX': -62, 'regY': -3 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/notepadBackC7_head_base.png'
		};

		a.notepadBackC8_head = {
			'images': ['./animations/notepadBackC8_head.png'],
			'frames': { 'height': 75, 'width': 81, 'count': 113, 'regX': -62, 'regY': -12 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/notepadBackC8_head_base.png'
		};

		a.notepadBackC9_head = {
			'images': ['./animations/notepadBackC9_head.png'],
			'frames': { 'height': 92, 'width': 91, 'count': 113, 'regX': -65, 'regY': -12 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/notepadBackC9_head_base.png'
		};

		a.notepadBackC10_head = {
			'images': ['./animations/notepadBackC10_head.png'],
			'frames': { 'height': 91, 'width': 91, 'count': 113, 'regX': -65, 'regY': -13 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/notepadBackC10_head_base.png'
		};

		a.notepadBackC11_head = {
			'images': ['./animations/notepadBackC11_head.png'],
			'frames': { 'height': 91, 'width': 84, 'count': 113, 'regX': -64, 'regY': -13 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/notepadBackC11_head_base.png'
		};

		a.notepadBackC12_head = {
			'images': ['./animations/notepadBackC12_head.png'],
			'frames': { 'height': 91, 'width': 87, 'count': 113, 'regX': -61, 'regY': -12 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/notepadBackC12_head_base.png'
		};

		a.notepadBackC1_pants = {
			'images': ['./animations/empty_sheet.png'],
			'frames': { 'height': 1, 'width': 1, 'count': 113, 'regX': 0, 'regY': 0 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/notepadBackC1_pants_base.png'
		};

		a.notepadBackC9_pants = {
			'images': ['./animations/empty_sheet.png'],
			'frames': { 'height': 1, 'width': 1, 'count': 113, 'regX': 0, 'regY': 0 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/notepadBackC9_pants_base.png'
		};

		a.notepadImage = {
			'images': ['./animations/notepadImage.png'],
			'frames': { 'regY': 0, 'height': 200, 'regX': 0, 'width': 200, 'count': 1 },
			'animations': { 'all': [0, 0] },
			'targetFPS': { 'all': 7 }
		};

		//superb start
		a.notepadFrontC1_body = {
			'images': ['./animations/superb/notepadFrontC1_body.png'],
			'frames': { 'height': 84, 'width': 109, 'count': 113, 'regX': -57, 'regY': -74 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/notepadFrontC1_body_base.png'
		};

		a.notepadFrontC2_body = {
			'images': ['./animations/superb/notepadFrontC2_body.png'],
			'frames': { 'height': 85, 'width': 110, 'count': 113, 'regX': -57, 'regY': -74 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/notepadFrontC2_body_base.png'
		};

		a.notepadFrontC3_body = {
			'images': ['./animations/superb/notepadFrontC3_body.png'],
			'frames': { 'height': 84, 'width': 110, 'count': 113, 'regX': -57, 'regY': -74 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/notepadFrontC3_body_base.png'
		};

		a.notepadFrontC4_body = {
			'images': ['./animations/superb/notepadFrontC4_body.png'],
			'frames': { 'height': 85, 'width': 110, 'count': 113, 'regX': -57, 'regY': -74 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/notepadFrontC4_body_base.png'
		};

		a.notepadFrontC5_body = {
			'images': ['./animations/superb/notepadFrontC5_body.png'],
			'frames': { 'height': 84, 'width': 110, 'count': 113, 'regX': -57, 'regY': -75 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/notepadFrontC5_body_base.png'
		};

		a.notepadFrontC6_body = {
			'images': ['./animations/superb/notepadFrontC6_body.png'],
			'frames': { 'height': 84, 'width': 110, 'count': 113, 'regX': -57, 'regY': -75 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/notepadFrontC6_body_base.png'
		};

		a.notepadFrontC7_body = {
			'images': ['./animations/superb/notepadFrontC7_body.png'],
			'frames': { 'height': 84, 'width': 110, 'count': 113, 'regX': -57, 'regY': -75 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/notepadFrontC7_body_base.png'
		};

		a.notepadFrontC8_body = {
			'images': ['./animations/superb/notepadFrontC8_body.png'],
			'frames': { 'height': 85, 'width': 110, 'count': 113, 'regX': -57, 'regY': -74 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/notepadFrontC8_body_base.png'
		};

		a.notepadFrontC9_body = {
			'images': ['./animations/superb/notepadFrontC9_body.png'],
			'frames': { 'height': 84, 'width': 107, 'count': 113, 'regX': -57, 'regY': -74 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/notepadFrontC9_body_base.png'
		};

		a.notepadFrontC10_body = {
			'images': ['./animations/superb/notepadFrontC10_body.png'],
			'frames': { 'height': 84, 'width': 107, 'count': 113, 'regX': -57, 'regY': -74 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/notepadFrontC10_body_base.png'
		};

		a.notepadFrontC11_body = {
			'images': ['./animations/superb/notepadFrontC11_body.png'],
			'frames': { 'height': 77, 'width': 79, 'count': 113, 'regX': -55, 'regY': -74 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/notepadFrontC11_body_base.png'
		};

		a.notepadFrontC12_body = {
			'images': ['./animations/superb/notepadFrontC12_body.png'],
			'frames': { 'height': 76, 'width': 77, 'count': 113, 'regX': -58, 'regY': -74 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/notepadFrontC12_body_base.png'
		};

		a.notepadFrontC1_chair = {
			'images': ['./animations/superb/notepadFrontC1_chair.png'],
			'frames': { 'height': 96, 'width': 121, 'count': 113, 'regX': -21, 'regY': -91 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/notepadFrontC1_chair_base.png'
		};

		a.notepadFrontC1_hand = {
			'images': ['./animations/superb/notepadFrontC1_hands.png'],
			'frames': { 'height': 100, 'width': 118, 'count': 113, 'regX': -81, 'regY': -72 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 }
		};

		a.notepadFrontC4_hand = {
			'images': ['./animations/superb/notepadFrontC4_hands.png'],
			'frames': { 'height': 100, 'width': 118, 'count': 113, 'regX': -81, 'regY': -72 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 }
		};

		a.notepadFrontC5_hand = {
			'images': ['./animations/superb/notepadFrontC5_hands.png'],
			'frames': { 'height': 100, 'width': 118, 'count': 113, 'regX': -81, 'regY': -72 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 }
		};

		a.notepadFrontC9_hand = {
			'images': ['./animations/superb/notepadFrontC9_hands.png'],
			'frames': { 'height': 97, 'width': 139, 'count': 113, 'regX': -60, 'regY': -72 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/notepadFrontC9_hands_base.png'
		};

		a.notepadFrontC10_hand = {
			'images': ['./animations/superb/notepadFrontC10_hands.png'],
			'frames': { 'height': 97, 'width': 139, 'count': 113, 'regX': -60, 'regY': -72 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/notepadFrontC10_hands_base.png'
		};

		a.notepadFrontC12_hand = {
			'images': ['./animations/superb/notepadFrontC12_hands.png'],
			'frames': { 'height': 97, 'width': 139, 'count': 113, 'regX': -60, 'regY': -72 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/notepadFrontC12_hands_base.png'
		};

		a.notepadFrontC1_head = {
			'images': ['./animations/superb/notepadFrontC1_head.png'],
			'frames': { 'height': 71, 'width': 79, 'count': 113, 'regX': -56, 'regY': -18 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/notepadFrontC1_head_base.png'
		};

		a.notepadFrontC2_head = {
			'images': ['./animations/superb/notepadFrontC2_head.png'],
			'frames': { 'height': 73, 'width': 83, 'count': 113, 'regX': -55, 'regY': -16 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/notepadFrontC2_head_base.png'
		};

		a.notepadFrontC3_head = {
			'images': ['./animations/superb/notepadFrontC3_head.png'],
			'frames': { 'height': 68, 'width': 74, 'count': 113, 'regX': -58, 'regY': -21 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/notepadFrontC3_head_base.png'
		};

		a.notepadFrontC4_head = {
			'images': ['./animations/superb/notepadFrontC4_head.png'],
			'frames': { 'height': 70, 'width': 77, 'count': 113, 'regX': -61, 'regY': -20 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/notepadFrontC4_head_base.png'
		};

		a.notepadFrontC5_head = {
			'images': ['./animations/superb/notepadFrontC5_head.png'],
			'frames': { 'height': 72, 'width': 75, 'count': 113, 'regX': -58, 'regY': -18 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/notepadFrontC5_head_base.png'
		};

		a.notepadFrontC6_head = {
			'images': ['./animations/superb/notepadFrontC6_head.png'],
			'frames': { 'height': 78, 'width': 76, 'count': 113, 'regX': -60, 'regY': -11 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/notepadFrontC6_head_base.png'
		};

		a.notepadFrontC7_head = {
			'images': ['./animations/superb/notepadFrontC7_head.png'],
			'frames': { 'height': 73, 'width': 81, 'count': 113, 'regX': -59, 'regY': -16 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/notepadFrontC7_head_base.png'
		};

		a.notepadFrontC8_head = {
			'images': ['./animations/superb/notepadFrontC8_head.png'],
			'frames': { 'height': 72, 'width': 77, 'count': 113, 'regX': -58, 'regY': -18 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/notepadFrontC8_head_base.png'
		};

		a.notepadFrontC9_head = {
			'images': ['./animations/superb/notepadFrontC9_head.png'],
			'frames': { 'height': 78, 'width': 83, 'count': 113, 'regX': -49, 'regY': -17 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/notepadFrontC9_head_base.png'
		};

		a.notepadFrontC10_head = {
			'images': ['./animations/superb/notepadFrontC10_head.png'],
			'frames': { 'height': 77, 'width': 74, 'count': 113, 'regX': -61, 'regY': -18 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/notepadFrontC10_head_base.png'
		};

		a.notepadFrontC11_head = {
			'images': ['./animations/superb/notepadFrontC11_head.png'],
			'frames': { 'height': 74, 'width': 72, 'count': 113, 'regX': -60, 'regY': -21 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/notepadFrontC11_head_base.png'
		};

		a.notepadFrontC12_head = {
			'images': ['./animations/superb/notepadFrontC12_head.png'],
			'frames': { 'height': 74, 'width': 74, 'count': 113, 'regX': -58, 'regY': -21 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/notepadFrontC12_head_base.png'
		};

		a.notepadFrontC1_pants = {
			'images': ['./animations/superb/notepadFrontC1_pants.png'],
			'frames': { 'height': 51, 'width': 79, 'count': 113, 'regX': -62, 'regY': -136 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/notepadFrontC1_pants_base.png'
		};

		a.notepadFrontC9_pants = {
			'images': ['./animations/superb/notepadFrontC9_pants.png'],
			'frames': { 'height': 44, 'width': 66, 'count': 113, 'regX': -62, 'regY': -142 },
			'animations': { 'start': [0, 0], 'loop': [0, 112], 'end': [112, 112] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/notepadFrontC9_pants_base.png'
		};

		a.teaCupImage = {
			'images': ['./animations/empty_sheet.png'],
			'frames': { 'height': 1, 'width': 1, 'count': 1, 'regX': 0, 'regY': 0 },
			'animations': { 'all': [0, 0] },
			'targetFPS': { 'all': 7 },
			'baseImage': './animations/superb/teacup.png'
		};

		a.teaCupImageLevel2 = {
			'images': ['./animations/empty_sheet.png'],
			'frames': { 'height': 1, 'width': 1, 'count': 1, 'regX': 0, 'regY': 0 },
			'animations': { 'all': [0, 0] },
			'targetFPS': { 'all': 7 },
			'baseImage': './animations/superb/teacupLevel2.png'
		};

		//superb end

		a.pong = {
			'images': ['./animations/pong.png'],
			'frames': { 'height': 146, 'regX': -29, 'count': 120, 'regY': -26, 'width': 147 },
			'animations': { 'all': [0, 119] },
			'targetFPS': { 'all': 20 }, //slower looks more like original pong
			'baseImage': './animations/pong_base.png'
		};

		a.idleBackC1_body = {
			'images': ['./animations/idleBackC1_body.png'],
			'frames': { 'height': 61, 'width': 94, 'count': 30, 'regX': -63, 'regY': -65 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/idleBackC1_body_base.png'
		};

		a.idleBackC2_body = {
			'images': ['./animations/idleBackC2_body.png'],
			'frames': { 'height': 61, 'width': 94, 'count': 30, 'regX': -63, 'regY': -65 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/idleBackC2_body_base.png'
		};

		a.idleBackC3_body = {
			'images': ['./animations/idleBackC3_body.png'],
			'frames': { 'height': 61, 'width': 94, 'count': 30, 'regX': -63, 'regY': -65 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/idleBackC3_body_base.png'
		};

		a.idleBackC4_body = {
			'images': ['./animations/idleBackC4_body.png'],
			'frames': { 'height': 61, 'width': 94, 'count': 30, 'regX': -63, 'regY': -65 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/idleBackC4_body_base.png'
		};

		a.idleBackC5_body = {
			'images': ['./animations/idleBackC5_body.png'],
			'frames': { 'height': 61, 'width': 93, 'count': 30, 'regX': -64, 'regY': -65 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/idleBackC5_body_base.png'
		};

		a.idleBackC6_body = {
			'images': ['./animations/idleBackC6_body.png'],
			'frames': { 'height': 61, 'width': 93, 'count': 30, 'regX': -64, 'regY': -65 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/idleBackC6_body_base.png'
		};

		a.idleBackC7_body = {
			'images': ['./animations/idleBackC7_body.png'],
			'frames': { 'height': 61, 'width': 94, 'count': 30, 'regX': -63, 'regY': -65 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/idleBackC7_body_base.png'
		};

		a.idleBackC8_body = {
			'images': ['./animations/idleBackC8_body.png'],
			'frames': { 'height': 61, 'width': 93, 'count': 30, 'regX': -64, 'regY': -65 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/idleBackC8_body_base.png'
		};

		a.idleBackC9_body = {
			'images': ['./animations/idleBackC9_body.png'],
			'frames': { 'height': 65, 'width': 61, 'count': 30, 'regX': -91, 'regY': -62 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/idleBackC9_body_base.png'
		};

		a.idleBackC10_body = {
			'images': ['./animations/idleBackC10_body.png'],
			'frames': { 'height': 65, 'width': 61, 'count': 30, 'regX': -90, 'regY': -62 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/idleBackC10_body_base.png'
		};

		a.idleBackC11_body = {
			'images': ['./animations/idleBackC11_body.png'],
			'frames': { 'height': 65, 'width': 61, 'count': 30, 'regX': -91, 'regY': -62 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/idleBackC11_body_base.png'
		};

		a.idleBackC12_body = {
			'images': ['./animations/idleBackC12_body.png'],
			'frames': { 'height': 65, 'width': 87, 'count': 30, 'regX': -64, 'regY': -62 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/idleBackC12_body_base.png'
		};

		a.idleBackC1_chair = {
			'images': ['./animations/idleBackC1_chair.png'],
			'frames': { 'height': 74, 'width': 104, 'count': 30, 'regX': -68, 'regY': -86 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/idleBackC1_chair_base.png'
		};

		a.idleBackC1_hand = {
			'images': ['./animations/idleBackC1_hands.png'],
			'frames': { 'height': 39, 'width': 61, 'count': 30, 'regX': -52, 'regY': -65 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/idleBackC1_hands_base.png'
		};

		a.idleBackC4_hand = {
			'images': ['./animations/idleBackC4_hands.png'],
			'frames': { 'height': 39, 'width': 60, 'count': 30, 'regX': -52, 'regY': -65 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/idleBackC4_hands_base.png'
		};

		a.idleBackC5_hand = {
			'images': ['./animations/idleBackC5_hands.png'],
			'frames': { 'height': 39, 'width': 60, 'count': 30, 'regX': -52, 'regY': -65 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/idleBackC5_hands_base.png'
		};

		a.idleBackC9_hand = {
			'images': ['./animations/idleBackC9_hands.png'],
			'frames': { 'height': 55, 'width': 75, 'count': 30, 'regX': -54, 'regY': -64 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/idleBackC9_hands_base.png'
		};

		a.idleBackC10_hand = {
			'images': ['./animations/idleBackC10_hands.png'],
			'frames': { 'height': 55, 'width': 75, 'count': 30, 'regX': -54, 'regY': -64 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/idleBackC10_hands_base.png'
		};

		a.idleBackC12_hand = {
			'images': ['./animations/idleBackC12_hands.png'],
			'frames': { 'height': 55, 'width': 75, 'count': 30, 'regX': -54, 'regY': -64 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/idleBackC12_hands_base.png'
		};

		a.idleBackC1_head = {
			'images': ['./animations/idleBackC1_head.png'],
			'frames': { 'height': 72, 'width': 77, 'count': 30, 'regX': -85, 'regY': -12 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/idleBackC1_head_base.png'
		};

		a.idleBackC2_head = {
			'images': ['./animations/idleBackC2_head.png'],
			'frames': { 'height': 84, 'width': 77, 'count': 30, 'regX': -85, 'regY': -1 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/idleBackC2_head_base.png'
		};

		a.idleBackC3_head = {
			'images': ['./animations/idleBackC3_head.png'],
			'frames': { 'height': 78, 'width': 81, 'count': 30, 'regX': -85, 'regY': -7 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/idleBackC3_head_base.png'
		};

		a.idleBackC4_head = {
			'images': ['./animations/idleBackC4_head.png'],
			'frames': { 'height': 76, 'width': 83, 'count': 30, 'regX': -85, 'regY': -3 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/idleBackC4_head_base.png'
		};

		a.idleBackC5_head = {
			'images': ['./animations/idleBackC5_head.png'],
			'frames': { 'height': 76, 'width': 77, 'count': 30, 'regX': -85, 'regY': -11 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/idleBackC5_head_base.png'
		};

		a.idleBackC6_head = {
			'images': ['./animations/idleBackC6_head.png'],
			'frames': { 'height': 74, 'width': 81, 'count': 30, 'regX': -85, 'regY': -8 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/idleBackC6_head_base.png'
		};

		a.idleBackC7_head = {
			'images': ['./animations/idleBackC7_head.png'],
			'frames': { 'height': 77, 'width': 84, 'count': 30, 'regX': -85, 'regY': -3 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/idleBackC7_head_base.png'
		};

		a.idleBackC8_head = {
			'images': ['./animations/idleBackC8_head.png'],
			'frames': { 'height': 75, 'width': 79, 'count': 30, 'regX': -83, 'regY': -11 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/idleBackC8_head_base.png'
		};

		a.idleBackC9_head = {
			'images': ['./animations/idleBackC9_head.png'],
			'frames': { 'height': 91, 'width': 84, 'count': 30, 'regX': -85, 'regY': -12 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/idleBackC9_head_base.png'
		};

		a.idleBackC10_head = {
			'images': ['./animations/idleBackC10_head.png'],
			'frames': { 'height': 92, 'width': 84, 'count': 30, 'regX': -85, 'regY': -12 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/idleBackC10_head_base.png'
		};

		a.idleBackC11_head = {
			'images': ['./animations/idleBackC11_head.png'],
			'frames': { 'height': 92, 'width': 80, 'count': 30, 'regX': -85, 'regY': -12 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/idleBackC11_head_base.png'
		};

		a.idleBackC12_head = {
			'images': ['./animations/idleBackC12_head.png'],
			'frames': { 'height': 92, 'width': 83, 'count': 30, 'regX': -82, 'regY': -10 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/idleBackC12_head_base.png'
		};

		a.idleBackC1_pants = {
			'images': ['./animations/idleBackC1_pants.png'],
			'frames': { 'height': 59, 'width': 82, 'count': 30, 'regX': -40, 'regY': -111 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/idleBackC1_pants_base.png'
		};

		a.idleBackC9_pants = {
			'images': ['./animations/idleBackC9_pants.png'],
			'frames': { 'height': 56, 'width': 79, 'count': 30, 'regX': -42, 'regY': -121 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/idleBackC9_pants_base.png'
		};

		//superb start
		a.idleFrontC1_body = {
			'images': ['./animations/superb/idleFrontC1_body.png'],
			'frames': { 'height': 83, 'width': 90, 'count': 30, 'regX': -50, 'regY': -75 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/superb/idleFrontC1_body_base.png'
		};

		a.idleFrontC2_body = {
			'images': ['./animations/superb/idleFrontC2_body.png'],
			'frames': { 'height': 85, 'width': 91, 'count': 30, 'regX': -50, 'regY': -75 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/superb/idleFrontC2_body_base.png'
		};

		a.idleFrontC3_body = {
			'images': ['./animations/superb/idleFrontC3_body.png'],
			'frames': { 'height': 84, 'width': 90, 'count': 30, 'regX': -50, 'regY': -75 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/superb/idleFrontC3_body_base.png'
		};

		a.idleFrontC4_body = {
			'images': ['./animations/superb/idleFrontC4_body.png'],
			'frames': { 'height': 85, 'width': 91, 'count': 30, 'regX': -50, 'regY': -75 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/superb/idleFrontC4_body_base.png'
		};

		a.idleFrontC5_body = {
			'images': ['./animations/superb/idleFrontC5_body.png'],
			'frames': { 'height': 84, 'width': 91, 'count': 30, 'regX': -50, 'regY': -76 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/superb/idleFrontC5_body_base.png'
		};

		a.idleFrontC6_body = {
			'images': ['./animations/superb/idleFrontC6_body.png'],
			'frames': { 'height': 84, 'width': 90, 'count': 30, 'regX': -51, 'regY': -76 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/superb/idleFrontC6_body_base.png'
		};

		a.idleFrontC7_body = {
			'images': ['./animations/superb/idleFrontC7_body.png'],
			'frames': { 'height': 84, 'width': 91, 'count': 30, 'regX': -50, 'regY': -76 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/superb/idleFrontC7_body_base.png'
		};

		a.idleFrontC8_body = {
			'images': ['./animations/superb/idleFrontC8_body.png'],
			'frames': { 'height': 85, 'width': 91, 'count': 30, 'regX': -50, 'regY': -75 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/superb/idleFrontC8_body_base.png'
		};

		a.idleFrontC9_body = {
			'images': ['./animations/superb/idleFrontC9_body.png'],
			'frames': { 'height': 80, 'width': 85, 'count': 30, 'regX': -51, 'regY': -78 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/superb/idleFrontC9_body_base.png'
		};

		a.idleFrontC10_body = {
			'images': ['./animations/superb/idleFrontC10_body.png'],
			'frames': { 'height': 81, 'width': 85, 'count': 30, 'regX': -51, 'regY': -77 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/superb/idleFrontC10_body_base.png'
		};

		a.idleFrontC11_body = {
			'images': ['./animations/superb/idleFrontC11_body.png'],
			'frames': { 'height': 73, 'width': 67, 'count': 30, 'regX': -48, 'regY': -78 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/superb/idleFrontC11_body_base.png'
		};

		a.idleFrontC12_body = {
			'images': ['./animations/superb/idleFrontC12_body.png'],
			'frames': { 'height': 73, 'width': 65, 'count': 30, 'regX': -51, 'regY': -78 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/superb/idleFrontC12_body_base.png'
		};

		a.idleFrontC1_chair = {
			'images': ['./animations/superb/idleFrontC1_chair.png'],
			'frames': { 'height': 71, 'width': 67, 'count': 30, 'regX': -48, 'regY': -92 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/superb/idleFrontC1_chair_base.png'
		};

		a.idleFrontC1_hand = {
			'images': ['./animations/superb/idleFrontC1_hands.png'],
			'frames': { 'height': 46, 'width': 64, 'count': 30, 'regX': -89, 'regY': -122 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/superb/idleFrontC1_hands_base.png'
		};

		a.idleFrontC4_hand = {
			'images': ['./animations/superb/idleFrontC4_hands.png'],
			'frames': { 'height': 46, 'width': 64, 'count': 30, 'regX': -89, 'regY': -122 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/superb/idleFrontC4_hands_base.png'
		};

		a.idleFrontC5_hand = {
			'images': ['./animations/superb/idleFrontC5_hands.png'],
			'frames': { 'height': 46, 'width': 64, 'count': 30, 'regX': -89, 'regY': -122 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/superb/idleFrontC5_hands_base.png'
		};

		a.idleFrontC9_hand = {
			'images': ['./animations/superb/idleFrontC9_hands.png'],
			'frames': { 'height': 66, 'width': 96, 'count': 30, 'regX': -54, 'regY': -100 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/superb/idleFrontC9_hands_base.png'
		};

		a.idleFrontC10_hand = {
			'images': ['./animations/superb/idleFrontC10_hands.png'],
			'frames': { 'height': 66, 'width': 96, 'count': 30, 'regX': -54, 'regY': -100 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/superb/idleFrontC10_hands_base.png'
		};

		a.idleFrontC12_hand = {
			'images': ['./animations/superb/idleFrontC12_hands.png'],
			'frames': { 'height': 66, 'width': 96, 'count': 30, 'regX': -54, 'regY': -100 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/superb/idleFrontC12_hands_base.png'
		};

		a.idleFrontC1_head = {
			'images': ['./animations/superb/idleFrontC1_head.png'],
			'frames': { 'height': 69, 'width': 73, 'count': 30, 'regX': -42, 'regY': -19 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/superb/idleFrontC1_head_base.png'
		};

		a.idleFrontC2_head = {
			'images': ['./animations/superb/idleFrontC2_head.png'],
			'frames': { 'height': 70, 'width': 76, 'count': 30, 'regX': -41, 'regY': -18 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/superb/idleFrontC2_head_base.png'
		};

		a.idleFrontC3_head = {
			'images': ['./animations/superb/idleFrontC3_head.png'],
			'frames': { 'height': 66, 'width': 68, 'count': 30, 'regX': -44, 'regY': -22 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/superb/idleFrontC3_head_base.png'
		};

		a.idleFrontC4_head = {
			'images': ['./animations/superb/idleFrontC4_head.png'],
			'frames': { 'height': 69, 'width': 71, 'count': 30, 'regX': -47, 'regY': -20 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/superb/idleFrontC4_head_base.png'
		};

		a.idleFrontC5_head = {
			'images': ['./animations/superb/idleFrontC5_head.png'],
			'frames': { 'height': 69, 'width': 69, 'count': 30, 'regX': -45, 'regY': -20 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/superb/idleFrontC5_head_base.png'
		};

		a.idleFrontC6_head = {
			'images': ['./animations/superb/idleFrontC6_head.png'],
			'frames': { 'height': 78, 'width': 69, 'count': 30, 'regX': -46, 'regY': -10 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/superb/idleFrontC6_head_base.png'
		};

		a.idleFrontC7_head = {
			'images': ['./animations/superb/idleFrontC7_head.png'],
			'frames': { 'height': 73, 'width': 75, 'count': 30, 'regX': -44, 'regY': -15 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/superb/idleFrontC7_head_base.png'
		};

		a.idleFrontC8_head = {
			'images': ['./animations/superb/idleFrontC8_head.png'],
			'frames': { 'height': 70, 'width': 72, 'count': 30, 'regX': -44, 'regY': -19 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/superb/idleFrontC8_head_base.png'
		};

		a.idleFrontC9_head = {
			'images': ['./animations/superb/idleFrontC9_head.png'],
			'frames': { 'height': 79, 'width': 73, 'count': 30, 'regX': -40, 'regY': -20 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/superb/idleFrontC9_head_base.png'
		};

		a.idleFrontC10_head = {
			'images': ['./animations/superb/idleFrontC10_head.png'],
			'frames': { 'height': 74, 'width': 69, 'count': 30, 'regX': -47, 'regY': -20 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/superb/idleFrontC10_head_base.png'
		};

		a.idleFrontC11_head = {
			'images': ['./animations/superb/idleFrontC11_head.png'],
			'frames': { 'height': 72, 'width': 66, 'count': 30, 'regX': -47, 'regY': -22 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/superb/idleFrontC11_head_base.png'
		};

		a.idleFrontC12_head = {
			'images': ['./animations/superb/idleFrontC12_head.png'],
			'frames': { 'height': 77, 'width': 69, 'count': 30, 'regX': -46, 'regY': -22 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/superb/idleFrontC12_head_base.png'
		};

		a.idleFrontC1_pants = {
			'images': ['./animations/empty_sheet.png'],
			'frames': { 'height': 1, 'width': 1, 'count': 30, 'regX': 0, 'regY': 0 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/superb/idleFrontC1_pants_base.png'
		};

		a.idleFrontC9_pants = {
			'images': ['./animations/superb/idleFrontC9_pants.png'],
			'frames': { 'height': 41, 'width': 63, 'count': 30, 'regX': -62, 'regY': -154 },
			'animations': { 'start': [0, 28], 'loop': [29, 29], 'end': [28, 0] },
			'targetFPS': { 'start': 60, 'loop': 15, 'end': 60 },
			'baseImage': './animations/superb/idleFrontC9_pants_base.png'
		};

		//superb end

		a.typingBackC1_body = {
			'images': ['./animations/typingBackC1_body.png'],
			'frames': { 'height': 56, 'width': 84, 'count': 51, 'regX': -63, 'regY': -65 },
			'animations': { 'start': [0, 0], 'loop': [0, 50], 'end': [50, 50] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/typingBackC1_body_base.png'
		};

		a.typingBackC2_body = {
			'images': ['./animations/typingBackC2_body.png'],
			'frames': { 'height': 56, 'width': 85, 'count': 51, 'regX': -62, 'regY': -65 },
			'animations': { 'start': [0, 0], 'loop': [0, 50], 'end': [50, 50] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/typingBackC2_body_base.png'
		};

		a.typingBackC3_body = {
			'images': ['./animations/typingBackC3_body.png'],
			'frames': { 'height': 56, 'width': 85, 'count': 51, 'regX': -62, 'regY': -65 },
			'animations': { 'start': [0, 0], 'loop': [0, 50], 'end': [50, 50] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/typingBackC3_body_base.png'
		};

		a.typingBackC4_body = {
			'images': ['./animations/typingBackC4_body.png'],
			'frames': { 'height': 56, 'width': 85, 'count': 51, 'regX': -62, 'regY': -65 },
			'animations': { 'start': [0, 0], 'loop': [0, 50], 'end': [50, 50] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/typingBackC4_body_base.png'
		};

		a.typingBackC5_body = {
			'images': ['./animations/typingBackC5_body.png'],
			'frames': { 'height': 56, 'width': 84, 'count': 51, 'regX': -63, 'regY': -65 },
			'animations': { 'start': [0, 0], 'loop': [0, 50], 'end': [50, 50] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/typingBackC5_body_base.png'
		};

		a.typingBackC6_body = {
			'images': ['./animations/typingBackC6_body.png'],
			'frames': { 'height': 56, 'width': 84, 'count': 51, 'regX': -63, 'regY': -65 },
			'animations': { 'start': [0, 0], 'loop': [0, 50], 'end': [50, 50] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/typingBackC6_body_base.png'
		};

		a.typingBackC7_body = {
			'images': ['./animations/typingBackC7_body.png'],
			'frames': { 'height': 56, 'width': 85, 'count': 51, 'regX': -62, 'regY': -65 },
			'animations': { 'start': [0, 0], 'loop': [0, 50], 'end': [50, 50] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/typingBackC7_body_base.png'
		};

		a.typingBackC8_body = {
			'images': ['./animations/typingBackC8_body.png'],
			'frames': { 'height': 56, 'width': 84, 'count': 51, 'regX': -63, 'regY': -65 },
			'animations': { 'start': [0, 0], 'loop': [0, 50], 'end': [50, 50] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/typingBackC8_body_base.png'
		};

		a.typingBackC9_body = {
			'images': ['./animations/typingBackC9_body.png'],
			'frames': { 'height': 26, 'width': 51, 'count': 51, 'regX': -91, 'regY': -77 },
			'animations': { 'start': [0, 0], 'loop': [0, 50], 'end': [50, 50] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/typingBackC9_body_base.png'
		};

		a.typingBackC10_body = {
			'images': ['./animations/typingBackC10_body.png'],
			'frames': { 'height': 26, 'width': 52, 'count': 51, 'regX': -90, 'regY': -77 },
			'animations': { 'start': [0, 0], 'loop': [0, 50], 'end': [50, 50] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/typingBackC10_body_base.png'
		};

		a.typingBackC11_body = {
			'images': ['./animations/typingBackC11_body.png'],
			'frames': { 'height': 27, 'width': 52, 'count': 51, 'regX': -90, 'regY': -77 },
			'animations': { 'start': [0, 0], 'loop': [0, 50], 'end': [50, 50] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/typingBackC11_body_base.png'
		};

		a.typingBackC12_body = {
			'images': ['./animations/typingBackC12_body.png'],
			'frames': { 'height': 56, 'width': 79, 'count': 51, 'regX': -63, 'regY': -64 },
			'animations': { 'start': [0, 0], 'loop': [0, 50], 'end': [50, 50] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/typingBackC12_body_base.png'
		};

		a.typingBackC1_chair = {
			'images': ['./animations/empty_sheet.png'],
			'frames': { 'height': 1, 'width': 1, 'count': 51, 'regX': 0, 'regY': 0 },
			'animations': { 'start': [0, 0], 'loop': [0, 50], 'end': [50, 50] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/typingBackC1_chair_base.png'
		};

		a.typingBackC1_hand = {
			'images': ['./animations/typingBackC1_hands.png'],
			'frames': { 'height': 41, 'width': 50, 'count': 51, 'regX': -49, 'regY': -63 },
			'animations': { 'start': [0, 0], 'loop': [0, 50], 'end': [50, 50] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/typingBackC1_hands_base.png'
		};

		a.typingBackC4_hand = {
			'images': ['./animations/typingBackC4_hands.png'],
			'frames': { 'height': 41, 'width': 50, 'count': 51, 'regX': -49, 'regY': -63 },
			'animations': { 'start': [0, 0], 'loop': [0, 50], 'end': [50, 50] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/typingBackC4_hands_base.png'
		};

		a.typingBackC5_hand = {
			'images': ['./animations/typingBackC5_hands.png'],
			'frames': { 'height': 41, 'width': 50, 'count': 51, 'regX': -49, 'regY': -63 },
			'animations': { 'start': [0, 0], 'loop': [0, 50], 'end': [50, 50] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/typingBackC5_hands_base.png'
		};

		a.typingBackC9_hand = {
			'images': ['./animations/typingBackC9_hands.png'],
			'frames': { 'height': 54, 'width': 68, 'count': 51, 'regX': -52, 'regY': -65 },
			'animations': { 'start': [0, 0], 'loop': [0, 50], 'end': [50, 50] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/typingBackC9_hands_base.png'
		};

		a.typingBackC10_hand = {
			'images': ['./animations/typingBackC10_hands.png'],
			'frames': { 'height': 54, 'width': 68, 'count': 51, 'regX': -52, 'regY': -65 },
			'animations': { 'start': [0, 0], 'loop': [0, 50], 'end': [50, 50] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/typingBackC10_hands_base.png'
		};

		a.typingBackC12_hand = {
			'images': ['./animations/typingBackC12_hands.png'],
			'frames': { 'height': 54, 'width': 68, 'count': 51, 'regX': -52, 'regY': -65 },
			'animations': { 'start': [0, 0], 'loop': [0, 50], 'end': [50, 50] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/typingBackC12_hands_base.png'
		};

		a.typingBackC1_head = {
			'images': ['./animations/typingBackC1_head.png'],
			'frames': { 'height': 70, 'width': 58, 'count': 51, 'regX': -85, 'regY': -13 },
			'animations': { 'start': [0, 0], 'loop': [0, 50], 'end': [50, 50] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/typingBackC1_head_base.png'
		};

		a.typingBackC2_head = {
			'images': ['./animations/typingBackC2_head.png'],
			'frames': { 'height': 80, 'width': 58, 'count': 51, 'regX': -85, 'regY': -2 },
			'animations': { 'start': [0, 0], 'loop': [0, 50], 'end': [50, 50] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/typingBackC2_head_base.png'
		};

		a.typingBackC3_head = {
			'images': ['./animations/typingBackC3_head.png'],
			'frames': { 'height': 75, 'width': 59, 'count': 51, 'regX': -85, 'regY': -7 },
			'animations': { 'start': [0, 0], 'loop': [0, 50], 'end': [50, 50] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/typingBackC3_head_base.png'
		};

		a.typingBackC4_head = {
			'images': ['./animations/typingBackC4_head.png'],
			'frames': { 'height': 75, 'width': 61, 'count': 51, 'regX': -85, 'regY': -3 },
			'animations': { 'start': [0, 0], 'loop': [0, 50], 'end': [50, 50] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/typingBackC4_head_base.png'
		};

		a.typingBackC5_head = {
			'images': ['./animations/typingBackC5_head.png'],
			'frames': { 'height': 74, 'width': 58, 'count': 51, 'regX': -85, 'regY': -12 },
			'animations': { 'start': [0, 0], 'loop': [0, 50], 'end': [50, 50] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/typingBackC5_head_base.png'
		};

		a.typingBackC6_head = {
			'images': ['./animations/typingBackC6_head.png'],
			'frames': { 'height': 71, 'width': 61, 'count': 51, 'regX': -85, 'regY': -8 },
			'animations': { 'start': [0, 0], 'loop': [0, 50], 'end': [50, 50] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/typingBackC6_head_base.png'
		};

		a.typingBackC7_head = {
			'images': ['./animations/typingBackC7_head.png'],
			'frames': { 'height': 75, 'width': 61, 'count': 51, 'regX': -85, 'regY': -3 },
			'animations': { 'start': [0, 0], 'loop': [0, 50], 'end': [50, 50] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/typingBackC7_head_base.png'
		};

		a.typingBackC8_head = {
			'images': ['./animations/typingBackC8_head.png'],
			'frames': { 'height': 74, 'width': 62, 'count': 51, 'regX': -82, 'regY': -11 },
			'animations': { 'start': [0, 0], 'loop': [0, 50], 'end': [50, 50] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/typingBackC8_head_base.png'
		};

		a.typingBackC9_head = {
			'images': ['./animations/typingBackC9_head.png'],
			'frames': { 'height': 90, 'width': 70, 'count': 51, 'regX': -84, 'regY': -12 },
			'animations': { 'start': [0, 0], 'loop': [0, 50], 'end': [50, 50] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/typingBackC9_head_base.png'
		};

		a.typingBackC10_head = {
			'images': ['./animations/typingBackC10_head.png'],
			'frames': { 'height': 90, 'width': 70, 'count': 51, 'regX': -84, 'regY': -12 },
			'animations': { 'start': [0, 0], 'loop': [0, 50], 'end': [50, 50] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/typingBackC10_head_base.png'
		};

		a.typingBackC11_head = {
			'images': ['./animations/typingBackC11_head.png'],
			'frames': { 'height': 88, 'width': 65, 'count': 51, 'regX': -84, 'regY': -13 },
			'animations': { 'start': [0, 0], 'loop': [0, 50], 'end': [50, 50] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/typingBackC11_head_base.png'
		};

		a.typingBackC12_head = {
			'images': ['./animations/typingBackC12_head.png'],
			'frames': { 'height': 89, 'width': 66, 'count': 51, 'regX': -82, 'regY': -11 },
			'animations': { 'start': [0, 0], 'loop': [0, 50], 'end': [50, 50] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/typingBackC12_head_base.png'
		};

		a.typingBackC1_pants = {
			'images': ['./animations/empty_sheet.png'],
			'frames': { 'height': 1, 'width': 1, 'count': 51, 'regX': 0, 'regY': 0 },
			'animations': { 'start': [0, 0], 'loop': [0, 50], 'end': [50, 50] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/typingBackC1_pants_base.png'
		};

		a.typingBackC9_pants = {
			'images': ['./animations/empty_sheet.png'],
			'frames': { 'height': 1, 'width': 1, 'count': 51, 'regX': 0, 'regY': 0 },
			'animations': { 'start': [0, 0], 'loop': [0, 50], 'end': [50, 50] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/typingBackC9_pants_base.png'
		};

		//superb start
		a.typingFrontC1_body = {
			'images': ['./animations/superb/typingFrontC1_body.png'],
			'frames': { 'height': 75, 'width': 84, 'count': 30, 'regX': -57, 'regY': -80 },
			'animations': { 'start': [0, 0], 'loop': [0, 29], 'end': [29, 29] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/typingFrontC1_body_base.png'
		};

		a.typingFrontC2_body = {
			'images': ['./animations/superb/typingFrontC2_body.png'],
			'frames': { 'height': 75, 'width': 85, 'count': 30, 'regX': -56, 'regY': -82 },
			'animations': { 'start': [0, 0], 'loop': [0, 29], 'end': [29, 29] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/typingFrontC2_body_base.png'
		};

		a.typingFrontC3_body = {
			'images': ['./animations/superb/typingFrontC3_body.png'],
			'frames': { 'height': 75, 'width': 85, 'count': 30, 'regX': -57, 'regY': -81 },
			'animations': { 'start': [0, 0], 'loop': [0, 29], 'end': [29, 29] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/typingFrontC3_body_base.png'
		};

		a.typingFrontC4_body = {
			'images': ['./animations/superb/typingFrontC4_body.png'],
			'frames': { 'height': 76, 'width': 86, 'count': 30, 'regX': -56, 'regY': -81 },
			'animations': { 'start': [0, 0], 'loop': [0, 29], 'end': [29, 29] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/typingFrontC4_body_base.png'
		};

		a.typingFrontC5_body = {
			'images': ['./animations/superb/typingFrontC5_body.png'],
			'frames': { 'height': 76, 'width': 85, 'count': 30, 'regX': -57, 'regY': -81 },
			'animations': { 'start': [0, 0], 'loop': [0, 29], 'end': [29, 29] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/typingFrontC5_body_base.png'
		};

		a.typingFrontC6_body = {
			'images': ['./animations/superb/typingFrontC6_body.png'],
			'frames': { 'height': 76, 'width': 85, 'count': 30, 'regX': -57, 'regY': -81 },
			'animations': { 'start': [0, 0], 'loop': [0, 29], 'end': [29, 29] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/typingFrontC6_body_base.png'
		};

		a.typingFrontC7_body = {
			'images': ['./animations/superb/typingFrontC7_body.png'],
			'frames': { 'height': 76, 'width': 85, 'count': 30, 'regX': -57, 'regY': -81 },
			'animations': { 'start': [0, 0], 'loop': [0, 29], 'end': [29, 29] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/typingFrontC7_body_base.png'
		};

		a.typingFrontC8_body = {
			'images': ['./animations/superb/typingFrontC8_body.png'],
			'frames': { 'height': 76, 'width': 85, 'count': 30, 'regX': -57, 'regY': -81 },
			'animations': { 'start': [0, 0], 'loop': [0, 29], 'end': [29, 29] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/typingFrontC8_body_base.png'
		};

		a.typingFrontC9_body = {
			'images': ['./animations/superb/typingFrontC9_body.png'],
			'frames': { 'height': 70, 'width': 80, 'count': 30, 'regX': -57, 'regY': -85 },
			'animations': { 'start': [0, 0], 'loop': [0, 29], 'end': [29, 29] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/typingFrontC9_body_base.png'
		};

		a.typingFrontC10_body = {
			'images': ['./animations/superb/typingFrontC10_body.png'],
			'frames': { 'height': 69, 'width': 80, 'count': 30, 'regX': -57, 'regY': -86 },
			'animations': { 'start': [0, 0], 'loop': [0, 29], 'end': [29, 29] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/typingFrontC10_body_base.png'
		};

		a.typingFrontC11_body = {
			'images': ['./animations/superb/typingFrontC11_body.png'],
			'frames': { 'height': 62, 'width': 62, 'count': 30, 'regX': -54, 'regY': -87 },
			'animations': { 'start': [0, 0], 'loop': [0, 29], 'end': [29, 29] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/typingFrontC11_body_base.png'
		};

		a.typingFrontC12_body = {
			'images': ['./animations/superb/typingFrontC12_body.png'],
			'frames': { 'height': 65, 'width': 58, 'count': 30, 'regX': -58, 'regY': -84 },
			'animations': { 'start': [0, 0], 'loop': [0, 29], 'end': [29, 29] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/typingFrontC12_body_base.png'
		};

		a.typingFrontC1_chair = {
			'images': ['./animations/empty_sheet.png'],
			'frames': { 'height': 1, 'width': 1, 'count': 30, 'regX': 0, 'regY': 0 },
			'animations': { 'start': [0, 0], 'loop': [0, 29], 'end': [29, 29] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/typingFrontC1_chair_base.png'
		};

		a.typingFrontC1_hand = {
			'images': ['./animations/superb/typingFrontC1_hands.png'],
			'frames': { 'height': 46, 'width': 62, 'count': 30, 'regX': -94, 'regY': -122 },
			'animations': { 'start': [0, 0], 'loop': [0, 29], 'end': [29, 29] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/typingFrontC1_hands_base.png'
		};

		a.typingFrontC4_hand = {
			'images': ['./animations/superb/typingFrontC4_hands.png'],
			'frames': { 'height': 46, 'width': 62, 'count': 30, 'regX': -94, 'regY': -122 },
			'animations': { 'start': [0, 0], 'loop': [0, 29], 'end': [29, 29] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/typingFrontC4_hands_base.png'
		};

		a.typingFrontC5_hand = {
			'images': ['./animations/superb/typingFrontC5_hands.png'],
			'frames': { 'height': 46, 'width': 62, 'count': 30, 'regX': -94, 'regY': -122 },
			'animations': { 'start': [0, 0], 'loop': [0, 29], 'end': [29, 29] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/typingFrontC5_hands_base.png'
		};

		a.typingFrontC9_hand = {
			'images': ['./animations/superb/typingFrontC9_hands.png'],
			'frames': { 'height': 62, 'width': 92, 'count': 30, 'regX': -60, 'regY': -103 },
			'animations': { 'start': [0, 0], 'loop': [0, 29], 'end': [29, 29] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/typingFrontC9_hands_base.png'
		};

		a.typingFrontC10_hand = {
			'images': ['./animations/superb/typingFrontC10_hands.png'],
			'frames': { 'height': 62, 'width': 92, 'count': 30, 'regX': -60, 'regY': -103 },
			'animations': { 'start': [0, 0], 'loop': [0, 29], 'end': [29, 29] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/typingFrontC10_hands_base.png'
		};

		a.typingFrontC12_hand = {
			'images': ['./animations/superb/typingFrontC12_hands.png'],
			'frames': { 'height': 62, 'width': 92, 'count': 30, 'regX': -60, 'regY': -103 },
			'animations': { 'start': [0, 0], 'loop': [0, 29], 'end': [29, 29] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/typingFrontC12_hands_base.png'
		};

		a.typingFrontC1_head = {
			'images': ['./animations/superb/typingFrontC1_head.png'],
			'frames': { 'height': 69, 'width': 58, 'count': 30, 'regX': -57, 'regY': -19 },
			'animations': { 'start': [0, 0], 'loop': [0, 29], 'end': [29, 29] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/typingFrontC1_head_base.png'
		};

		a.typingFrontC2_head = {
			'images': ['./animations/superb/typingFrontC2_head.png'],
			'frames': { 'height': 70, 'width': 61, 'count': 30, 'regX': -57, 'regY': -18 },
			'animations': { 'start': [0, 0], 'loop': [0, 29], 'end': [29, 29] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/typingFrontC2_head_base.png'
		};

		a.typingFrontC3_head = {
			'images': ['./animations/superb/typingFrontC3_head.png'],
			'frames': { 'height': 66, 'width': 53, 'count': 30, 'regX': -59, 'regY': -22 },
			'animations': { 'start': [0, 0], 'loop': [0, 29], 'end': [29, 29] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/typingFrontC3_head_base.png'
		};

		a.typingFrontC4_head = {
			'images': ['./animations/superb/typingFrontC4_head.png'],
			'frames': { 'height': 68, 'width': 57, 'count': 30, 'regX': -62, 'regY': -21 },
			'animations': { 'start': [0, 0], 'loop': [0, 29], 'end': [29, 29] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/typingFrontC4_head_base.png'
		};

		a.typingFrontC5_head = {
			'images': ['./animations/superb/typingFrontC5_head.png'],
			'frames': { 'height': 69, 'width': 56, 'count': 30, 'regX': -59, 'regY': -20 },
			'animations': { 'start': [0, 0], 'loop': [0, 29], 'end': [29, 29] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/typingFrontC5_head_base.png'
		};

		a.typingFrontC6_head = {
			'images': ['./animations/superb/typingFrontC6_head.png'],
			'frames': { 'height': 77, 'width': 55, 'count': 30, 'regX': -61, 'regY': -11 },
			'animations': { 'start': [0, 0], 'loop': [0, 29], 'end': [29, 29] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/typingFrontC6_head_base.png'
		};

		a.typingFrontC7_head = {
			'images': ['./animations/superb/typingFrontC7_head.png'],
			'frames': { 'height': 72, 'width': 60, 'count': 30, 'regX': -60, 'regY': -16 },
			'animations': { 'start': [0, 0], 'loop': [0, 29], 'end': [29, 29] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/typingFrontC7_head_base.png'
		};

		a.typingFrontC8_head = {
			'images': ['./animations/superb/typingFrontC8_head.png'],
			'frames': { 'height': 69, 'width': 58, 'count': 30, 'regX': -59, 'regY': -20 },
			'animations': { 'start': [0, 0], 'loop': [0, 29], 'end': [29, 29] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/typingFrontC8_head_base.png'
		};

		a.typingFrontC9_head = {
			'images': ['./animations/superb/typingFrontC9_head.png'],
			'frames': { 'height': 76, 'width': 65, 'count': 30, 'regX': -49, 'regY': -19 },
			'animations': { 'start': [0, 0], 'loop': [0, 29], 'end': [29, 29] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/typingFrontC9_head_base.png'
		};

		a.typingFrontC10_head = {
			'images': ['./animations/superb/typingFrontC10_head.png'],
			'frames': { 'height': 74, 'width': 54, 'count': 30, 'regX': -62, 'regY': -20 },
			'animations': { 'start': [0, 0], 'loop': [0, 29], 'end': [29, 29] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/typingFrontC10_head_base.png'
		};

		a.typingFrontC11_head = {
			'images': ['./animations/superb/typingFrontC11_head.png'],
			'frames': { 'height': 71, 'width': 53, 'count': 30, 'regX': -61, 'regY': -23 },
			'animations': { 'start': [0, 0], 'loop': [0, 29], 'end': [29, 29] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/typingFrontC11_head_base.png'
		};

		a.typingFrontC12_head = {
			'images': ['./animations/superb/typingFrontC12_head.png'],
			'frames': { 'height': 73, 'width': 58, 'count': 30, 'regX': -58, 'regY': -22 },
			'animations': { 'start': [0, 0], 'loop': [0, 29], 'end': [29, 29] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/typingFrontC12_head_base.png'
		};

		a.typingFrontC1_pants = {
			'images': ['./animations/empty_sheet.png'],
			'frames': { 'height': 1, 'width': 1, 'count': 30, 'regX': 0, 'regY': 0 },
			'animations': { 'start': [0, 0], 'loop': [0, 29], 'end': [29, 29] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/typingFrontC1_pants_base.png'
		};

		a.typingFrontC9_pants = {
			'images': ['./animations/empty_sheet.png'],
			'frames': { 'height': 1, 'width': 1, 'count': 30, 'regX': 0, 'regY': 0 },
			'animations': { 'start': [0, 0], 'loop': [0, 29], 'end': [29, 29] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/typingFrontC9_pants_base.png'
		};

		a.thinkingFrontC1_body = {
			'images': ['./animations/superb/thinkingFrontC1_body.png'],
			'frames': { 'height': 103, 'width': 97, 'count': 100, 'regX': -57, 'regY': -54 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/thinkingFrontC1_body_base.png'
		};

		a.thinkingFrontC2_body = {
			'images': ['./animations/superb/thinkingFrontC2_body.png'],
			'frames': { 'height': 105, 'width': 98, 'count': 100, 'regX': -57, 'regY': -53 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/thinkingFrontC2_body_base.png'
		};

		a.thinkingFrontC3_body = {
			'images': ['./animations/superb/thinkingFrontC3_body.png'],
			'frames': { 'height': 105, 'width': 97, 'count': 100, 'regX': -57, 'regY': -53 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/thinkingFrontC3_body_base.png'
		};

		a.thinkingFrontC4_body = {
			'images': ['./animations/superb/thinkingFrontC4_body.png'],
			'frames': { 'height': 105, 'width': 97, 'count': 100, 'regX': -57, 'regY': -53 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/thinkingFrontC4_body_base.png'
		};

		a.thinkingFrontC5_body = {
			'images': ['./animations/superb/thinkingFrontC5_body.png'],
			'frames': { 'height': 106, 'width': 98, 'count': 100, 'regX': -57, 'regY': -53 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/thinkingFrontC5_body_base.png'
		};

		a.thinkingFrontC6_body = {
			'images': ['./animations/superb/thinkingFrontC6_body.png'],
			'frames': { 'height': 106, 'width': 98, 'count': 100, 'regX': -57, 'regY': -53 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/thinkingFrontC6_body_base.png'
		};

		a.thinkingFrontC7_body = {
			'images': ['./animations/superb/thinkingFrontC7_body.png'],
			'frames': { 'height': 105, 'width': 97, 'count': 100, 'regX': -57, 'regY': -53 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/thinkingFrontC7_body_base.png'
		};

		a.thinkingFrontC8_body = {
			'images': ['./animations/superb/thinkingFrontC8_body.png'],
			'frames': { 'height': 105, 'width': 98, 'count': 100, 'regX': -57, 'regY': -53 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/thinkingFrontC8_body_base.png'
		};

		a.thinkingFrontC9_body = {
			'images': ['./animations/superb/thinkingFrontC9_body.png'],
			'frames': { 'height': 101, 'width': 94, 'count': 100, 'regX': -58, 'regY': -56 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/thinkingFrontC9_body_base.png'
		};

		a.thinkingFrontC10_body = {
			'images': ['./animations/superb/thinkingFrontC10_body.png'],
			'frames': { 'height': 101, 'width': 94, 'count': 100, 'regX': -58, 'regY': -56 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/thinkingFrontC10_body_base.png'
		};

		a.thinkingFrontC11_body = {
			'images': ['./animations/superb/thinkingFrontC11_body.png'],
			'frames': { 'height': 73, 'width': 70, 'count': 100, 'regX': -55, 'regY': -76 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/thinkingFrontC11_body_base.png'
		};

		a.thinkingFrontC12_body = {
			'images': ['./animations/superb/thinkingFrontC12_body.png'],
			'frames': { 'height': 73, 'width': 70, 'count': 100, 'regX': -58, 'regY': -75 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/thinkingFrontC12_body_base.png'
		};

		a.thinkingFrontC1_chair = {
			'images': ['./animations/empty_sheet.png'],
			'frames': { 'height': 1, 'width': 1, 'count': 100, 'regX': 0, 'regY': 0 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/thinkingFrontC1_chair_base.png'
		};

		a.thinkingFrontC1_hand = {
			'images': ['./animations/superb/thinkingFrontC1_hands.png'],
			'frames': { 'height': 136, 'width': 90, 'count': 100, 'regX': -80, 'regY': -34 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/thinkingFrontC1_hands_base.png'
		};

		a.thinkingFrontC4_hand = {
			'images': ['./animations/superb/thinkingFrontC4_hands.png'],
			'frames': { 'height': 136, 'width': 90, 'count': 100, 'regX': -80, 'regY': -34 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/thinkingFrontC4_hands_base.png'
		};

		a.thinkingFrontC5_hand = {
			'images': ['./animations/superb/thinkingFrontC5_hands.png'],
			'frames': { 'height': 136, 'width': 90, 'count': 100, 'regX': -80, 'regY': -34 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/thinkingFrontC5_hands_base.png'
		};

		a.thinkingFrontC9_hand = {
			'images': ['./animations/superb/thinkingFrontC9_hands.png'],
			'frames': { 'height': 129, 'width': 107, 'count': 100, 'regX': -60, 'regY': -38 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/thinkingFrontC9_hands_base.png'
		};

		a.thinkingFrontC10_hand = {
			'images': ['./animations/superb/thinkingFrontC10_hands.png'],
			'frames': { 'height': 129, 'width': 107, 'count': 100, 'regX': -60, 'regY': -38 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/thinkingFrontC10_hands_base.png'
		};

		a.thinkingFrontC12_hand = {
			'images': ['./animations/superb/thinkingFrontC12_hands.png'],
			'frames': { 'height': 129, 'width': 106, 'count': 100, 'regX': -61, 'regY': -38 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/thinkingFrontC12_hands_base.png'
		};

		a.thinkingFrontC1_head = {
			'images': ['./animations/superb/thinkingFrontC1_head.png'],
			'frames': { 'height': 68, 'width': 63, 'count': 100, 'regX': -52, 'regY': -20 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/thinkingFrontC1_head_base.png'
		};

		a.thinkingFrontC2_head = {
			'images': ['./animations/superb/thinkingFrontC2_head.png'],
			'frames': { 'height': 70, 'width': 67, 'count': 100, 'regX': -50, 'regY': -18 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/thinkingFrontC2_head_base.png'
		};

		a.thinkingFrontC3_head = {
			'images': ['./animations/superb/thinkingFrontC3_head.png'],
			'frames': { 'height': 66, 'width': 59, 'count': 100, 'regX': -53, 'regY': -22 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/thinkingFrontC3_head_base.png'
		};

		a.thinkingFrontC4_head = {
			'images': ['./animations/superb/thinkingFrontC4_head.png'],
			'frames': { 'height': 69, 'width': 61, 'count': 100, 'regX': -57, 'regY': -20 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/thinkingFrontC4_head_base.png'
		};

		a.thinkingFrontC5_head = {
			'images': ['./animations/superb/thinkingFrontC5_head.png'],
			'frames': { 'height': 69, 'width': 60, 'count': 100, 'regX': -54, 'regY': -20 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/thinkingFrontC5_head_base.png'
		};

		a.thinkingFrontC6_head = {
			'images': ['./animations/superb/thinkingFrontC6_head.png'],
			'frames': { 'height': 78, 'width': 60, 'count': 100, 'regX': -55, 'regY': -10 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/thinkingFrontC6_head_base.png'
		};

		a.thinkingFrontC7_head = {
			'images': ['./animations/superb/thinkingFrontC7_head.png'],
			'frames': { 'height': 73, 'width': 66, 'count': 100, 'regX': -53, 'regY': -15 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/thinkingFrontC7_head_base.png'
		};

		a.thinkingFrontC8_head = {
			'images': ['./animations/superb/thinkingFrontC8_head.png'],
			'frames': { 'height': 69, 'width': 63, 'count': 100, 'regX': -53, 'regY': -20 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/thinkingFrontC8_head_base.png'
		};

		a.thinkingFrontC9_head = {
			'images': ['./animations/superb/thinkingFrontC9_head.png'],
			'frames': { 'height': 76, 'width': 66, 'count': 100, 'regX': -49, 'regY': -19 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/thinkingFrontC9_head_base.png'
		};

		a.thinkingFrontC10_head = {
			'images': ['./animations/superb/thinkingFrontC10_head.png'],
			'frames': { 'height': 74, 'width': 56, 'count': 100, 'regX': -61, 'regY': -20 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/thinkingFrontC10_head_base.png'
		};

		a.thinkingFrontC11_head = {
			'images': ['./animations/superb/thinkingFrontC11_head.png'],
			'frames': { 'height': 72, 'width': 55, 'count': 100, 'regX': -60, 'regY': -22 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/thinkingFrontC11_head_base.png'
		};

		a.thinkingFrontC12_head = {
			'images': ['./animations/superb/thinkingFrontC12_head.png'],
			'frames': { 'height': 73, 'width': 58, 'count': 100, 'regX': -58, 'regY': -22 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/thinkingFrontC12_head_base.png'
		};

		a.thinkingFrontC1_pants = {
			'images': ['./animations/empty_sheet.png'],
			'frames': { 'height': 1, 'width': 1, 'count': 100, 'regX': 0, 'regY': 0 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/thinkingFrontC1_pants_base.png'
		};

		a.thinkingFrontC9_pants = {
			'images': ['./animations/empty_sheet.png'],
			'frames': { 'height': 1, 'width': 1, 'count': 100, 'regX': 0, 'regY': 0 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/superb/thinkingFrontC9_pants_base.png'
		};
		//superb end

		a.thinkingBackC1_body = {
			'images': ['./animations/thinkingBackC1_body.png'],
			'frames': { 'height': 86, 'width': 87, 'count': 100, 'regX': -60, 'regY': -35 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/thinkingBackC1_body_base.png'
		};

		a.thinkingBackC2_body = {
			'images': ['./animations/thinkingBackC2_body.png'],
			'frames': { 'height': 86, 'width': 89, 'count': 100, 'regX': -58, 'regY': -35 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/thinkingBackC2_body_base.png'
		};

		a.thinkingBackC3_body = {
			'images': ['./animations/thinkingBackC3_body.png'],
			'frames': { 'height': 86, 'width': 88, 'count': 100, 'regX': -59, 'regY': -35 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/thinkingBackC3_body_base.png'
		};

		a.thinkingBackC4_body = {
			'images': ['./animations/thinkingBackC4_body.png'],
			'frames': { 'height': 86, 'width': 88, 'count': 100, 'regX': -59, 'regY': -35 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/thinkingBackC4_body_base.png'
		};

		a.thinkingBackC5_body = {
			'images': ['./animations/thinkingBackC5_body.png'],
			'frames': { 'height': 86, 'width': 87, 'count': 100, 'regX': -60, 'regY': -35 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/thinkingBackC5_body_base.png'
		};

		a.thinkingBackC6_body = {
			'images': ['./animations/thinkingBackC6_body.png'],
			'frames': { 'height': 86, 'width': 87, 'count': 100, 'regX': -60, 'regY': -35 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/thinkingBackC6_body_base.png'
		};

		a.thinkingBackC7_body = {
			'images': ['./animations/thinkingBackC7_body.png'],
			'frames': { 'height': 86, 'width': 87, 'count': 100, 'regX': -59, 'regY': -35 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/thinkingBackC7_body_base.png'
		};

		a.thinkingBackC8_body = {
			'images': ['./animations/thinkingBackC8_body.png'],
			'frames': { 'height': 86, 'width': 87, 'count': 100, 'regX': -60, 'regY': -35 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/thinkingBackC8_body_base.png'
		};

		a.thinkingBackC9_body = {
			'images': ['./animations/thinkingBackC9_body.png'],
			'frames': { 'height': 74, 'width': 90, 'count': 100, 'regX': -52, 'regY': -69 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/thinkingBackC9_body_base.png'
		};

		a.thinkingBackC10_body = {
			'images': ['./animations/thinkingBackC10_body.png'],
			'frames': { 'height': 35, 'width': 52, 'count': 100, 'regX': -90, 'regY': -69 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/thinkingBackC10_body_base.png'
		};

		a.thinkingBackC11_body = {
			'images': ['./animations/thinkingBackC11_body.png'],
			'frames': { 'height': 35, 'width': 52, 'count': 100, 'regX': -90, 'regY': -69 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/thinkingBackC11_body_base.png'
		};

		a.thinkingBackC12_body = {
			'images': ['./animations/thinkingBackC12_body.png'],
			'frames': { 'height': 83, 'width': 80, 'count': 100, 'regX': -62, 'regY': -36 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/thinkingBackC12_body_base.png'
		};

		a.thinkingBackC1_chair = {
			'images': ['./animations/empty_sheet.png'],
			'frames': { 'height': 1, 'width': 1, 'count': 100, 'regX': 0, 'regY': 0 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/thinkingBackC1_chair_base.png'
		};

		a.thinkingBackC1_hand = {
			'images': ['./animations/thinkingBackC1_hands.png'],
			'frames': { 'height': 80, 'width': 77, 'count': 100, 'regX': -52, 'regY': -22 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/thinkingBackC1_hands_base.png'
		};

		a.thinkingBackC4_hand = {
			'images': ['./animations/thinkingBackC4_hands.png'],
			'frames': { 'height': 80, 'width': 77, 'count': 100, 'regX': -52, 'regY': -22 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/thinkingBackC4_hands_base.png'
		};

		a.thinkingBackC5_hand = {
			'images': ['./animations/thinkingBackC5_hands.png'],
			'frames': { 'height': 80, 'width': 77, 'count': 100, 'regX': -52, 'regY': -22 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/thinkingBackC5_hands_base.png'
		};

		a.thinkingBackC9_hand = {
			'images': ['./animations/thinkingBackC9_hands.png'],
			'frames': { 'height': 95, 'width': 72, 'count': 100, 'regX': -54, 'regY': -24 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/thinkingBackC9_hands_base.png'
		};

		a.thinkingBackC10_hand = {
			'images': ['./animations/thinkingBackC10_hands.png'],
			'frames': { 'height': 95, 'width': 72, 'count': 100, 'regX': -54, 'regY': -24 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/thinkingBackC10_hands_base.png'
		};

		a.thinkingBackC12_hand = {
			'images': ['./animations/thinkingBackC12_hands.png'],
			'frames': { 'height': 95, 'width': 72, 'count': 100, 'regX': -54, 'regY': -24 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/thinkingBackC12_hands_base.png'
		};

		a.thinkingBackC1_head = {
			'images': ['./animations/thinkingBackC1_head.png'],
			'frames': { 'height': 71, 'width': 60, 'count': 100, 'regX': -85, 'regY': -13 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/thinkingBackC1_head_base.png'
		};

		a.thinkingBackC2_head = {
			'images': ['./animations/thinkingBackC2_head.png'],
			'frames': { 'height': 82, 'width': 60, 'count': 100, 'regX': -85, 'regY': -1 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/thinkingBackC2_head_base.png'
		};

		a.thinkingBackC3_head = {
			'images': ['./animations/thinkingBackC3_head.png'],
			'frames': { 'height': 76, 'width': 63, 'count': 100, 'regX': -85, 'regY': -7 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/thinkingBackC3_head_base.png'
		};

		a.thinkingBackC4_head = {
			'images': ['./animations/thinkingBackC4_head.png'],
			'frames': { 'height': 75, 'width': 65, 'count': 100, 'regX': -85, 'regY': -3 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/thinkingBackC4_head_base.png'
		};

		a.thinkingBackC5_head = {
			'images': ['./animations/thinkingBackC5_head.png'],
			'frames': { 'height': 75, 'width': 60, 'count': 100, 'regX': -85, 'regY': -11 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/thinkingBackC5_head_base.png'
		};

		a.thinkingBackC6_head = {
			'images': ['./animations/thinkingBackC6_head.png'],
			'frames': { 'height': 72, 'width': 64, 'count': 100, 'regX': -85, 'regY': -8 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/thinkingBackC6_head_base.png'
		};

		a.thinkingBackC7_head = {
			'images': ['./animations/thinkingBackC7_head.png'],
			'frames': { 'height': 76, 'width': 66, 'count': 100, 'regX': -85, 'regY': -3 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/thinkingBackC7_head_base.png'
		};

		a.thinkingBackC8_head = {
			'images': ['./animations/thinkingBackC8_head.png'],
			'frames': { 'height': 74, 'width': 62, 'count': 100, 'regX': -83, 'regY': -11 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/thinkingBackC8_head_base.png'
		};

		a.thinkingBackC9_head = {
			'images': ['./animations/thinkingBackC9_head.png'],
			'frames': { 'height': 95, 'width': 71, 'count': 100, 'regX': -85, 'regY': -11 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/thinkingBackC9_head_base.png'
		};

		a.thinkingBackC10_head = {
			'images': ['./animations/thinkingBackC10_head.png'],
			'frames': { 'height': 95, 'width': 71, 'count': 100, 'regX': -85, 'regY': -12 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/thinkingBackC10_head_base.png'
		};

		a.thinkingBackC11_head = {
			'images': ['./animations/thinkingBackC11_head.png'],
			'frames': { 'height': 93, 'width': 67, 'count': 100, 'regX': -85, 'regY': -12 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/thinkingBackC11_head_base.png'
		};

		a.thinkingBackC12_head = {
			'images': ['./animations/thinkingBackC12_head.png'],
			'frames': { 'height': 94, 'width': 70, 'count': 100, 'regX': -82, 'regY': -10 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/thinkingBackC12_head_base.png'
		};

		a.thinkingBackC1_pants = {
			'images': ['./animations/empty_sheet.png'],
			'frames': { 'height': 1, 'width': 1, 'count': 100, 'regX': 0, 'regY': 0 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/thinkingBackC1_pants_base.png'
		};

		a.thinkingBackC9_pants = {
			'images': ['./animations/empty_sheet.png'],
			'frames': { 'height': 1, 'width': 1, 'count': 100, 'regX': 0, 'regY': 0 },
			'animations': { 'start': [0, 0], 'loop': [0, 99], 'end': [99, 99] },
			'targetFPS': { 'start': 30, 'loop': 30, 'end': 30 },
			'baseImage': './animations/thinkingBackC9_pants_base.png'
		};

		//superb start
		a.airCon = {
			'images': ['./animations/superb/airCon.png'],
			'frames': { 'height': 68, 'width': 105, 'count': 62, 'regX': -392, 'regY': -410 },
			'animations': { 'loop': [0, 61] },
			'targetFPS': { 'loop': 30 },
			'baseImage': './animations/superb/airCon_base.png'
		};

		a.waterCooler = {
			'images': ['./animations/superb/waterCooler.png'],
			'frames': { 'height': 37, 'width': 16, 'count': 46, 'regX': -40, 'regY': -65 },
			'animations': { 'loop': [0, 45] },
			'targetFPS': { 'loop': 30 },
			'baseImage': './animations/superb/waterCooler_base.png'
		};

		a.printer = {
			'images': ['./animations/superb/printer.png'],
			'frames': { 'height': 50, 'width': 58, 'count': 121, 'regX': -58, 'regY': -86 },
			'animations': { 'loop': [0, 120] },
			'targetFPS': { 'loop': 30 },
			'baseImage': './animations/superb/printer_base.png'
		};

		a.rndPrinterLeftScreen = {
			'images': ['./animations/superb/rndPrinterLeftScreen.png'],
			'frames': { 'height': 133, 'width': 187, 'count': 90, 'regX': -19, 'regY': -68 },
			'animations': { 'loop': [0, 89] },
			'targetFPS': { 'loop': 30 },
			'baseImage': './animations/superb/rndPrinterLeftScreen_base.png'
		};

		a.rndPrinterRightScreen = {
			'images': ['./animations/superb/rndPrinterRightScreen.png'],
			'frames': { 'height': 181, 'width': 186, 'count': 90, 'regX': -42, 'regY': -16 },
			'animations': { 'loop': [0, 89] },
			'targetFPS': { 'loop': 30 },
			'baseImage': './animations/superb/rndPrinterRightScreen_base.png'
		};

		//superb end
	}
})();