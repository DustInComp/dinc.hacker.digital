var feld, hSummen, vSummen, gamemode, gamemodes = {
	"block" : [
		"1111111",
		"1111111",
		"1111111",
		"1111111",
		"1111111"
	],
	"pyramid" : [
		"0001000",
		"0011100",
		"0111110",
		"1111111"
	],
	"mario" : [
		"00111110000",
		"01111111110",
		"00001101000",
		"01011101110",
		"01001110111",
		"00111100000",
		"00111111100"
	],
	"illuminati" : [
		"000010000",
		"000111000",
		"001010100",
		"010000010",
		"111111111"
	]
};

// Spielfeld ohne nervige Querverweise über Objekte im Hyperraum generieren und in neue Variable [...]
function clone(gmArray) {
	var arr = [];

	for (var i = 0; i < gmArray.length; i++) {
		arr.push( [] );
		arr[i] = gmArray[i].split("");
	};

	return ( arr );
}

// Binärzahlen zu Dezimalzahlen umrechnen
function binToInt(bin) {
	var dec = 0,
		bin = String(bin);

	for (var i = bin.length-1; i >=0; i--) {
		dec += bin[i] == 1 ? Math.pow(2, bin.length-1 - i) : 0;
	};

	return ( dec );
}

// Dezimalzahlen zu Binärzahlen umrechnen
function intToBin(dec) {
	var bin = dec.toString(2); // ;)

	return ( bin );
}

// Größe der Elemente neu einstellen
function skalieren() {
	$("img").css({ "width": $("body").width() > 720 ? 64 : 32 });
	$("#gamemode-buttons div").css({ "border-radius": $("body").width() > 720 ? "8px" : "4px" });
}

// Feld neu zeichnen
function zeichnen() {
	feld = clone(gamemodes[gamemode]);
	$("#game-wrapper").html("");

	for (var i = 0; i < gamemodes[gamemode].length; i++) {

		$("#game-wrapper").append("<center id='r"+i+"'></center>");

		for (var j = 0; j < gamemodes[gamemode][i].length; j++) {
			$("#r"+i).append('<div id="'+ String(i) +"-"+ String(j) +'"><img src="img/button_'+ (gamemodes[gamemode][i][j]==1 ? "on" : "off") +'.png"></div>');
		};
	};

	infoBerechnen();
	skalieren();
	$("#status").html("Sie sind dran.");
}

function hSummenBerechnen(spielfeld) {
	var temp, verticalBinarySums = [];

	for (var x = 0; x < spielfeld.length; x++) {

		verticalBinarySums[x] = ["0","0","0","0"];
		temp = spielfeld[x].join("").replace(/0/g,"").length.toString(2);

		for (var i = temp.length-1; i >= 0; i--) {
			verticalBinarySums[x][4 - temp.length + i] = temp[i]; // [3 - (temp.length - 1) + i]
		};
	}

	return ( verticalBinarySums );
}

function vSummenBerechnen(hSums) {
	var vSums = [0,0,0,0];

	for (var i = 0; i < hSums.length; i++) {

		for (var j = 0; j < hSums[i].length; j++) {
			vSums[j] += parseInt( hSums[i][j] );
		}
	}

	return ( vSums );
}

function infoBerechnen() {
	var hSums = hSummenBerechnen(feld);
	var vSums = vSummenBerechnen(hSums);

	for (var i = 0; i < hSums.length; i++) {
		hSums[i] = hSums[i].join(" ");
	}

	$("#info-box").html(hSums.join("<br>")+"<hr>"+vSums.join(" "));
}

// Computer ist am Zug
function computerTurn() {
	var meisteLampen = [0 , null],
		differenz = 0,
		refArray = [], startBit = 0,
		zielArray = [],
		ende = feld[0].length;

	for (var i = 0; i < vSummen.length; i++) {
		if (vSummen[i] % 2 == 0) {
			startBit++;
		} else { break; }
	}

	if (startBit == 4) {

		for (var i = 0; i < hSummen.length; i++) {
			if ( binToInt(hSummen[i].join("")) > 0 ) {
				for (var j = 0; j < feld[i].length; j++) {
					$("#"+ String(i) +"-"+ String(j) +" img").attr("src", "img/button_off.png");
					feld[i][j] = 0;
				}
				break;
			}
		}
	} else {

		for (var i = 0; i < hSummen.length; i++) {
			if ( binToInt(hSummen[i].slice(startBit).join("")) > meisteLampen[0] ) {
				meisteLampen = [binToInt(hSummen[i].slice(startBit).join("")) , i]; // oberste Reihe mit den meisten leuchtenden Lampen
			}
		}

		refArray = hSummen[meisteLampen[1]]; // Array, auf den sich schließlich die Berechnungen beziehen

		for (var i = startBit; i < refArray.length; i++) {
			if ( vSummen[i] % 2 == 1 ) {
				differenz += refArray[i] == 1 ? Math.pow( 2, 3-i ) : -Math.pow( 2, 3-i ); // Anzahl der Lampen, die ausgeschaltet werden müssen
			}
		}

		for (var i = ende-1; i >= 0; i--) {
			if (feld[meisteLampen[1]][i] == 1) {

				$("#"+ String(meisteLampen[1]) +"-"+ String(i) +" img").attr("src", "img/button_off.png");
				feld[meisteLampen[1]][i] = 0;
				differenz--;
			}

			if (differenz == 0) { break; }
		}
	}

	hSummen = hSummenBerechnen(feld);
	vSummen = vSummenBerechnen(hSummen);
	infoBerechnen();
}

$(document).on("click", "#gamemode-buttons div", function(){
	gamemode = $(this).attr("name");
	zeichnen();
});

$(document).on("click", "#game-wrapper div", function(){
	var pos = [ parseInt( this.id.split("-")[0] ), parseInt( this.id.split("-")[1] ) ];
	if (feld[pos[0]][pos[1]] == 1) {
		for (var i = parseInt(pos[1]); i < gamemodes[gamemode][pos[0]].length; i++) {
			$("#"+String(pos[0])+"-"+i+" img").attr("src", "img/button_off.png");
			feld[pos[0]][i] = 0;
		}

		hSummen = hSummenBerechnen(feld);
		vSummen = vSummenBerechnen(hSummen);
		infoBerechnen();

		if (vSummen.join("")=="0000") {
			$("#status").html("Sie haben gewonnen!");

		} else {
			$("#game-wrapper div").addClass("disabled");
			$("#resetButton").attr("disabled", true);
			$("#status").html("Computer ist dran.");

			setTimeout(function(){
				computerTurn();
				$("#game-wrapper div").removeClass("disabled");
				$("#resetButton").attr("disabled", false);
				$("#status").html(
					vSummen.join("")=="0000"
					? "Der Computer hat gewonnen!"
					: "Sie sind dran."
				);
			}, 400 + Math.floor(Math.random()*600));
		}
	}
});

window.addEventListener('resize', skalieren);

$(document).on("click", "#debug", function(){
	$("#info-box").toggle();
});

/*if (window.addEventListener) {
	var kkeys = [], konami = "38,38,40,40,37,39,37,39,66,65";
	window.addEventListener("keydown", function(e){
		kkeys.push(e.keyCode);
		if (kkeys.toString().indexOf(konami) >= 0) {
			var secretGamemodes = [
				"illuminati"
			];
			gamemode = secretGamemodes[parseInt( Math.floor( Math.random() * secretGamemodes.length ) )];
			zeichnen();
			kkeys = [];
		}
	}, true);
}*/

$(function(){
	gamemode = "pyramid";
	zeichnen();
});
