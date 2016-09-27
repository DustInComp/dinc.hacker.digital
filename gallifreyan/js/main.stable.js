"use strict";

var c, ctx, pi = Math.PI,
	a = 800, borderPadding = 40, wordPadding = 76,
	debugMode = false, wordsTilted = false, lettersTilted = false,
	wordCount, wordCenter = [0,0], wordRadius, wordTilt,
	letterCenter = [0,0], letterRadius = 32, /* Den Scheiß mach ich ganz sicher nicht dynamisch */
	vowelCenter = [0,0], vowelRadius = 8; /* Sag ich mal so... */

class Letter {
	constructor(pair) {
		this.cCenter = [0, 0]; // coordinates
		this.angle = 0;
		this.normal = [0, 1]; // normal vector
		this.dots = 0;
		this.lines = 0;
		this.linesLeft = 0;

		// set c and v
		if ( isVowel(pair[pair.length-1]) ) {
			this.c = pair.substring(0, pair.length-1);
			this.v = pair[pair.length-1];
		} else if ( isVowel(pair[0]) ) {
			this.c = "";
			this.v = pair[0];
		} else {
			this.c = pair;
			this.v = "";
		}

		// set consonantType
		if (this.c == "") {
			this.consonantType = "none";
		} else if (this.c.replace(/b|ch|d|f|g|h/, "") == "") {
			this.consonantType = "b";
		} else if (this.c.replace(/j|k|l|c|m|n|p/, "") == "") {
			this.consonantType = "j";
		} else if (this.c.replace(/t|sh|r|s|v|w/, "") == "") {
			this.consonantType = "t";
		} else if (this.c.replace(/th|y|z|ng|qu|q|x/, "") == "") {
			this.consonantType = "th";
		} else {
			this.consonantType = "b";
		}

		// set vowelType
		if (this.v == "") {
			this.vowelType = "none";
		} else if (this.v == "a") {
			this.vowelType = "a";
		} else if (this.v.replace(/e|i|u/, "") == "") {
			this.vowelType = "e";
		} else if (this.v == "o") {
			this.vowelType = "o";
		}

		if (this.c != "") {
			if (this.c.replace(/b|j|th|t/, "") == "") {
				this.dots = 0;
			} else if (this.c.replace(/ch|k|sh|y/, "") == "") {
				this.dots = 2;
			} else if (this.c.replace(/d|l|r|z/, "") == "") {
				this.dots = 3;
			} else if (this.c.replace(/c|q/, "") == "") {
				this.dots = 4;
			} else if (this.c.replace(/f|m|s|ng/, "") ==  "") {
				this.lines = this.linesLeft = 3;
			} else if (this.c.replace(/g|n|v|qu/, "") == "") {
				this.lines = this.linesLeft = 1;
			} else if (this.c.replace(/h|p|w|x/, "") == "") {
				this.lines = this.linesLeft = 2;
			} else {
				this.dots = 1;
			}
		}

	}
}

function isVowel(char) {
	if (char != "" && char.replace(/a|e|i|o|u/, "") == "") {
		return true;
	} else {
		return false;
	}
}

function determineWordRadius(wordCount) {
	var radius = a/2-(18+borderPadding),
		dToMid = 0;

	if (wordCount <= 1) {
		return radius;
	} else {
		var center1 = [a/2, a/2 + dToMid],
			center2 = [
				a/2 + dToMid*Math.cos(2*pi/wordCount-0.5*pi),
				a/2 - dToMid*Math.sin(2*pi/wordCount-0.5*pi)
			];

		while (Math.sqrt(
		Math.pow(center2[0] - center1[0], 2) +
		Math.pow(center2[1] - center1[1], 2)) < 2*radius + wordPadding) {
			radius--;
			dToMid++;

			if (radius <= 1) {break;};

			center1 = [a/2, a/2 + dToMid];
			center2 = [
				a/2 + dToMid*Math.cos(2*pi/wordCount-0.5*pi),
				a/2 - dToMid*Math.sin(2*pi/wordCount-0.5*pi)
			];
		}
		console.log(center1[1]-a/2);

		if (debugMode) {
			ctx.lineWidth = 2;
			ctx.beginPath();
			ctx.moveTo(center1[0], center1[1]);
			ctx.lineTo(center2[0], center2[1]);
			ctx.stroke();
		}

		return radius;
	}
}

function readInput() {
	var inputText = document.getElementById("text").value.toLowerCase(),
		outputArray = [];

	while (inputText[0] == " ") {
		inputText = inputText.substring(1);
	}

	while (inputText[inputText.length-1] == " ") {
		inputText = inputText.substring(0, inputText.length-1);
	}

	for (var i = 0; i < inputText.length; i++) {
		if (inputText.substring(i, i+2) == "  ") {
			inputText = inputText.substring(0, i) + inputText.substring(i+1);
			i--;
		}
	}

	for (var i = 0; i < inputText.length; i++) {
		var char = inputText[i],
			nextChar = inputText[i+1],
			pair = char + nextChar;

		if (pair != "" && pair.replace(/ch|sh|th|ng|qu/, "") == "") {
			outputArray.push(pair);
			i++;
		} else {
			outputArray.push(char);
		}
	}

	console.log("Letters:", outputArray);
	return outputArray;
}

function createPairs(letterArray) {
	var outputArray = [];

	for (var i = 0; i < letterArray.length; i++) {
		var letterOne = letterArray[i],
			letterTwo = letterArray[i+1];
		if (!isVowel(letterOne) && isVowel(letterTwo||"") && letterOne != " ") {
			outputArray.push(letterOne + letterTwo);
			i++;
		} else {
			outputArray.push(letterOne);
		}
	}

	console.log("Pairs:", outputArray);
	return outputArray;
}

function createWords(letterPairs) {
	var words = [[]],
		wordNum = 0;

	for (var i = 0; i < letterPairs.length; i++) {
		if (letterPairs[i] != " ") {
			words[wordNum].push(letterPairs[i]);
		} else {
			words.push([]);
			wordNum++;
		}
	}

	console.log("Words:", words);
	return words;
}

function createInstances(wordArray) {
	var instanceArray = [];

	for (var i = 0; i < wordArray.length; i++) {
		instanceArray.push([]);
		for (var j = 0; j < wordArray[i].length; j++) {
			instanceArray[i].push(new Letter(wordArray[i][j]));
		}
	}
	console.log("Letter Instances:", instanceArray);
	return instanceArray;
}

function drawDots(thisLetter) {
	var dotRadius = 4,
		normal = thisLetter.normal;

	for (var i = 0; i < thisLetter.dots; i++) {
		var dotCenter = [
			// thisLetter.cCenter[0] + letterRadius/1.5 * Math.cos(pi/-2 + Math.acos(normal[0]) - i*pi/4 ),
			// thisLetter.cCenter[1] + letterRadius/1.5 * Math.sin(pi/-2 + Math.asin(normal[1]) - i*pi/4 )
			thisLetter.cCenter[0] + letterRadius/1.5*Math.cos(i*pi/4 + thisLetter.angle - 7/8*pi),
			thisLetter.cCenter[1] + letterRadius/1.5*Math.sin(i*pi/4 + thisLetter.angle - 7/8*pi)
		];

		ctx.beginPath();
		ctx.arc(dotCenter[0], dotCenter[1], dotRadius, 0, 2*pi, true);
		ctx.fill();
	}
}

function draw(wordArray) {
	wordCount = wordArray.length;
	wordRadius = determineWordRadius(wordCount);
	wordTilt = wordsTilted ? Math.random()*pi/wordCount : 0;

	ctx.lineWidth = 4;

	for (var i = 0; i < wordCount; i++) {
		var letterTilt = lettersTilted ? Math.random()*pi/wordArray[i].length : 0;
		wordCenter = [
			a/2 + (a/2-18-borderPadding-wordRadius)*Math.cos(i*2*pi/wordCount + pi/2 - wordTilt),
			a/2 + (a/2-18-borderPadding-wordRadius)*Math.sin(i*2*pi/wordCount + pi/2 - wordTilt)
		];

		ctx.beginPath();
		ctx.arc(wordCenter[0], wordCenter[1], wordRadius, 0, 2*pi, true);
		ctx.stroke();

		for (var j = 0; j < wordArray[i].length; j++) {
			var thisLetter = wordArray[i][j];

			thisLetter.angle = -1*(j*2*pi/wordArray[i].length + letterTilt);

			thisLetter.normal = [
				Math.cos(thisLetter.angle - 0.5*pi),
				Math.sin(thisLetter.angle - 0.5*pi)
			];

			switch (thisLetter.consonantType) {
				case "none":
					letterCenter = [
						wordCenter[0] - wordRadius * thisLetter.normal[0], // +/- ???
						wordCenter[1] - wordRadius * thisLetter.normal[1]
					];
					break;
				case "b":
					letterCenter = [
						wordCenter[0] - (wordRadius - letterRadius+8) * thisLetter.normal[0], // +/- ???
						wordCenter[1] - (wordRadius - letterRadius+8) * thisLetter.normal[1]
					];

					var d = Math.sqrt( Math.pow(letterCenter[0]-wordCenter[0], 2) + Math.pow(letterCenter[1]-wordCenter[1], 2) ),
						cutOff = Math.acos(
							(Math.pow(wordRadius, 2)-Math.pow(letterRadius, 2)-Math.pow(d, 2)) /
							(-2 * letterRadius * d) ) - pi/2;

					ctx.beginPath();
					ctx.arc(letterCenter[0], letterCenter[1], letterRadius,
					thisLetter.angle + cutOff,
					thisLetter.angle - pi - cutOff, true);
					ctx.stroke();

					ctx.globalCompositeOperation = "destination-out";
					ctx.beginPath();
					ctx.arc(letterCenter[0], letterCenter[1], letterRadius-2, 0, 2*pi, true);
					ctx.fill();
					ctx.globalCompositeOperation = "source-over";
					break;
				case "j":
					letterCenter = [
						wordCenter[0] - (wordRadius - letterRadius-8) * thisLetter.normal[0], // +/- ???
						wordCenter[1] - (wordRadius - letterRadius-8) * thisLetter.normal[1]
					];

					ctx.beginPath();
					ctx.arc(letterCenter[0], letterCenter[1], letterRadius, 0, 2*pi, true);
					ctx.stroke();
					break;
				case "t":
				case "th":
					letterCenter = [
						wordCenter[0] - wordRadius * thisLetter.normal[0], // +/- ???
						wordCenter[1] - wordRadius * thisLetter.normal[1]
					];

					if (thisLetter.consonantType == "th") {
						ctx.beginPath();
						ctx.arc(letterCenter[0], letterCenter[1], letterRadius, 0, 2*pi, true);
						ctx.stroke();
					} else {
						var cutOff = Math.asin(letterRadius / (2*wordRadius));

						ctx.beginPath();
						ctx.arc(letterCenter[0], letterCenter[1], letterRadius,
						thisLetter.angle - pi + cutOff,
						thisLetter.angle - cutOff,
						false);
						ctx.stroke();

						ctx.globalCompositeOperation = "destination-out";
						ctx.beginPath();
						ctx.arc(letterCenter[0], letterCenter[1], letterRadius-2, 0, 2*pi, true);
						ctx.fill();
						ctx.globalCompositeOperation = "source-over";
					}
					break;
				default:
			}

			switch (thisLetter.vowelType) {
				case "a":
					vowelCenter = [
						wordCenter[0] - (wordRadius + 16)*thisLetter.normal[0],
						wordCenter[1] - (wordRadius + 16)*thisLetter.normal[1]
					];
					break;
				case "e":
					vowelCenter = letterCenter;
					break;
				case "o":
					vowelCenter = [
						letterCenter[0] + (thisLetter.consonantType=="none" ? 16 : letterRadius)*thisLetter.normal[0],
						letterCenter[1] + (thisLetter.consonantType=="none" ? 16 : letterRadius)*thisLetter.normal[1]
					];
				break;
				default:
			}

			thisLetter.cCenter = letterCenter;
			thisLetter.vCenter = vowelCenter;

			console.log(thisLetter);
			drawDots(thisLetter);

			ctx.lineWidth = 3;
			ctx.beginPath();
			ctx.arc(vowelCenter[0], vowelCenter[1], vowelRadius, 0.5*pi, -1.5*pi, true);
			ctx.stroke();
			ctx.lineWidth = 4;

			if (debugMode) {
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.moveTo(letterCenter[0], letterCenter[1]);
				ctx.lineTo(
					letterCenter[0] + 45*thisLetter.normal[0],
					letterCenter[1] + 45*thisLetter.normal[1]
				);
				ctx.stroke();
				ctx.lineWidth = 4;
			}
		}
	}

	ctx.beginPath();
	ctx.arc(a/2, a/2, a/2-14, 0.5*pi, -1.5*pi, true);
	ctx.stroke();

	ctx.lineWidth = 8;
	ctx.beginPath();
	ctx.arc(a/2, a/2, a/2-4, 0.5*pi, -1.5*pi, true);
	ctx.stroke();
}

function init() {
	c = document.getElementById("canvas");
	ctx = c.getContext("2d");
	run();
}

function run() {
	debugMode = document.getElementById("debug-mode").checked;
	a = parseInt(document.getElementById("size").value) || 800;
	ctx.canvas.height = ctx.canvas.width = c.height = c.width = a;
	wordsTilted = document.getElementById("wordsTilted").checked;
	lettersTilted = document.getElementById("lettersTilted").checked;
	ctx.clearRect(0, 0, c.width, c.height);

	draw( createInstances( createWords( createPairs( readInput()))));
}

function optionsChanged() {
	run();
}
