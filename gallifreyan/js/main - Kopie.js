"use strict";

var c, ctx, pi = Math.PI,
	a = 800, borderPadding = 40, wordPadding = 76,
	debugMode = false, wordsTilted = false, lettersTilted = false,
	wordCount, wordCenter = [0,0], wordRadius, wordTilt,
	letterCenter = [0,0], letterRadius = 32, letterTilt, /* Die mach ich ganz sicher nicht dynamisch */
	vowelCenter = [0,0], vowelRadius = 8, /* Sag ich mal so... */
	dotRadius = 4;

class Letter {
	constructor(pair) {
		this.c = "";
		this.v = "";
		this.cCenter = [0, 0];
		this.vCenter = [0, 0];
		this.cType = "";
		this.vType = "";
		this.angle = 0;
		this.normal = [0, 1];
		this.dots = 0;
		this.lines = 0;
		this.linesLeft = 0;
		this.vowelLineLeft = false;

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

		if (this.c == "") {
			this.cType = "none";
		} else if (this.c.replace(/b|ch|d|f|g|h/, "") == "") {
			this.cType = "b";
		} else if (this.c.replace(/j|k|l|c|m|n|p/, "") == "") {
			this.cType = "j";
		} else if (this.c.replace(/t|sh|r|s|v|w/, "") == "") {
			this.cType = "t";
		} else if (this.c.replace(/th|y|z|ng|qu|q|x/, "") == "") {
			this.cType = "th";
		} else {
			this.cType = "b";
		}

		// set vType
		if (this.v == "") {
			this.vType = "none";
		} else if (this.v == "a") {
			this.vType = "a";
		} else if (this.v.replace(/e|i|u/, "") == "") {
			this.vType = "e";
			if (this.v != "e") {
				this.vowelLineLeft = true;
			}
		} else if (this.v == "o") {
			this.vType = "o";
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

function getConsonantCenter(thisLetter) {
	// console.log(thisLetter, wordCenter, wordRadius, letterRadius);
	switch (thisLetter.cType) {
		case "none":
			return [
				wordCenter[0] - wordRadius * thisLetter.normal[0],
				wordCenter[1] - wordRadius * thisLetter.normal[1]
			];
			break;
		case "b":
			return [
				wordCenter[0] - (wordRadius - letterRadius+8) * thisLetter.normal[0],
				wordCenter[1] - (wordRadius - letterRadius+8) * thisLetter.normal[1]
			];
			break;
		case "j":
			return [
				wordCenter[0] - (wordRadius - letterRadius-8) * thisLetter.normal[0],
				wordCenter[1] - (wordRadius - letterRadius-8) * thisLetter.normal[1]
			];
			break;
		case "t":
		case "th":
			return [
				wordCenter[0] - wordRadius * thisLetter.normal[0],
				wordCenter[1] - wordRadius * thisLetter.normal[1]
			];

			if (thisLetter.cType == "th") {
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
}

function getVowelCenter(thisLetter) {
	switch (thisLetter.vType) {
		case "e":
			return thisLetter.cCenter;
			break;
		case "a":
			return [
				wordCenter[0] - (wordRadius + 16)*thisLetter.normal[0],
				wordCenter[1] - (wordRadius + 16)*thisLetter.normal[1]
			];
			break;
		case "o":
			return [
				thisLetter.cCenter[0] + (thisLetter.cType=="none" ? 16 : letterRadius)*thisLetter.normal[0],
				thisLetter.cCenter[1] + (thisLetter.cType=="none" ? 16 : letterRadius)*thisLetter.normal[1]
			];
		break;
		default:
	}
}

function drawConsonant(l) {
	ctx.lineWidth = 4;

	switch (l.cType) {
		case "b":
			var d = Math.sqrt( Math.pow(l.cCenter[0]-wordCenter[0], 2) + Math.pow(l.cCenter[1]-wordCenter[1], 2) ),
				cutOff = Math.acos(
					(Math.pow(wordRadius, 2)-Math.pow(letterRadius, 2)-Math.pow(d, 2)) /
					(-2 * letterRadius * d) ) - pi/2;

			ctx.beginPath();
			ctx.arc(l.cCenter[0], l.cCenter[1], letterRadius,
			l.angle + cutOff,
			l.angle - pi - cutOff, true);
			ctx.stroke();

			ctx.globalCompositeOperation = "destination-out";
			ctx.beginPath();
			ctx.arc(l.cCenter[0], l.cCenter[1], letterRadius-2, 0, 2*pi, true);
			ctx.fill();
			ctx.globalCompositeOperation = "source-over";
			break;
		case "j":
			ctx.beginPath();
			ctx.arc(l.cCenter[0], l.cCenter[1], letterRadius, 0, 2*pi, true);
			ctx.stroke();
			break;
		case "t":
			var cutOff = Math.asin(letterRadius / (2*wordRadius));

			ctx.beginPath();
			ctx.arc(l.cCenter[0], l.cCenter[1], letterRadius,
			l.angle - pi + cutOff,
			l.angle - cutOff, false);
			ctx.stroke();

			ctx.globalCompositeOperation = "destination-out";
			ctx.beginPath();
			ctx.arc(l.cCenter[0], l.cCenter[1], letterRadius-2, 0, 2*pi, true);
			ctx.fill();
			ctx.globalCompositeOperation = "source-over";
			break;
		case "th":
			ctx.beginPath();
			ctx.arc(l.cCenter[0], l.cCenter[1], letterRadius, 0, 2*pi, true);
			ctx.stroke();
	}
}

function drawVowel(l) {
	if (l.vCenter) {
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.arc(l.vCenter[0], l.vCenter[1], vowelRadius, 0, 2*pi, true);
		ctx.stroke();
		ctx.lineWidth = 4;
	}
}

function drawDots(array) {
	for (var i = 0; i < array.length; i++) {
		for (var j = 0; j < array[i].length; j++) {
			var l = array[i][j];

			for (var n = 0; n < l.dots; n++) {
				var dotCenter = [
					l.cCenter[0] + letterRadius/1.5*Math.cos(n*pi/4 + l.angle - 7/8*pi),
					l.cCenter[1] + letterRadius/1.5*Math.sin(n*pi/4 + l.angle - 7/8*pi)
				];

				ctx.beginPath();
				ctx.arc(dotCenter[0], dotCenter[1], dotRadius, 0, 2*pi, true);
				ctx.fill();
			}
		}
	}
}

function drawLines(array) {
	for (var i1 = 0; i1 < array.length; i1++) {
		for (var j1 = 0; j1 < array[i1].length; j1++) {

			if (array[i1][j1].linesLeft > 0) {

				for (var i2 = 0; i2 < array.length; i2++) {
					for (var j2 = 0; j2 < array[i2].length; j2++) {

						if ((i2 == i1 && j2 > j1) || (i2 > i1)) {
							if (array[i2][j2].linesLeft > 0) {
								connectCToC(array[i1][j1], array[i2][j2]);
								array[i2][j2].linesLeft--;
							} else if (array[i2][j2].vowelLineLeft) {
								connectCToV(array[i1][j1], array[i2][j2]);
								array[i2][j2].vowelLineLeft == false;
							}
						}
						if (array[i1][j1].linesLeft == 0) {
							break;
						}
					}
					if (array[i1][j1].linesLeft == 0) {
						break;
					}
				}
			}
			if (array[i1][j1].vowelLineLeft) {

				for (var i2 = 0; i2 < array.length; i2++) {
					for (var j2 = 0; j2 < array[i2].length; j2++) {

						if ((i2 == i1 && j2 > j1) || (i2 > i1)) {
							if (array[i2][j2].linesLeft > 0) {
								connectCToV(array[i2][j2], array[i1][j1]);
								array[i1][j1].vowelLineLeft = false;
								array[i2][j2].linesLeft--;
							} else if (array[i2][j2].vowelLineLeft) {
								connectVToV(array[i1][j1], array[i2][j2]);
								array[i1][j1].vowelLineLeft = false;
								array[i2][j2].vowelLineLeft = false;
							}
						}
						if (! array[i1][j1].vowelLineLeft) {
							break;
						}
					}
					if (! array[i1][j1].vowelLineLeft) {
						break;
					}
				}
			}
		}
	}
}

function getVector(l1, l2) {
	var vec = [
		l2.cCenter[0]-l1.cCenter[0],
		l2.cCenter[1]-l1.cCenter[1]
	],
	vecLen = Math.sqrt( Math.pow(vec[0], 2) + Math.pow(vec[1], 2) );
	vec[0] = vec[0]/vecLen;
	vec[1] = vec[1]/vecLen;
	return vec;
}

function connectCToC(l1, l2) {
	var vec = getVector(l1, l2);


}

function draw(wordArray) {
	wordCount = wordArray.length;
	wordRadius = determineWordRadius(wordCount);
	wordTilt = wordsTilted ? Math.random()*pi/wordCount : 0;

	for (var i = 0; i < wordCount; i++) {
		letterTilt = lettersTilted ? Math.random()*pi/wordArray[i].length : 0;

		wordCenter = [
			a/2 - (a/2-18-borderPadding-wordRadius)*Math.cos(i*2*pi/wordCount + pi/2 + wordTilt),
			a/2 + (a/2-18-borderPadding-wordRadius)*Math.sin(i*2*pi/wordCount + pi/2 + wordTilt)
		];

		ctx.lineWidth = 4;
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

			thisLetter.cCenter = getConsonantCenter(thisLetter);
			thisLetter.vCenter = getVowelCenter(thisLetter);

			drawConsonant(thisLetter);
			drawVowel(thisLetter);

			if (debugMode) {
				ctx.lineWidth = 2;
				ctx.beginPath();
				ctx.moveTo(thisLetter.cCenter[0], thisLetter.cCenter[1]);
				ctx.lineTo(
					thisLetter.cCenter[0] + 45*thisLetter.normal[0],
					thisLetter.cCenter[1] + 45*thisLetter.normal[1]
				);
				ctx.stroke();
			}
			ctx.lineWidth = 4;
		}
	}

	drawDots(wordArray);
	drawLines(wordArray);

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
