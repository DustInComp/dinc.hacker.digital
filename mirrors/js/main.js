var animationId;

function cloneMatrix(arr) {
  return arr.map(function(i){return i.map(function(j){return j;});});
}

function Beam(initialX, initialY, initialDirection) {
  this.xPos = initialX;
  this.yPos = initialY;
  this.d    = initialDirection;

  this.step = function() {
    // Move the beam
    this.d === "r" ? this.xPos++ :
    this.d === "d" ? this.yPos++ :
    this.d === "l" ? this.xPos-- :
    this.d === "u" ? this.yPos-- :
    null;

    /**
     * Check the tile, the beam landed on when it's still on the board
     *   Otherwise, remove it.
     */
    if (this.xPos >= 0 && this.xPos < matrix[0].length &&
        this.yPos >= 0 && this.yPos < matrix.length) {

      // There shouldn't be beam characters in the original board.
      if (origMatrix[this.yPos][this.xPos].search(/[v\^<>]/) !== -1) {
        alert("Aw shit! Something bad happened.");
        return;
      }

      /**
       * When hitting a '/', directions 'u' and 'r', and 'd' and 'l' are swapped.
       *
       * When hitting a '\', directions 'u' and 'l', and 'd' and 'r' are swapped.
       *
       * When hitting a ' ', keep direction.
       */

      this.d = [
          "uldr" [ "rdlu".indexOf(this.d) ],  // using a character as index
          "drul" [ "rdlu".indexOf(this.d) ],  //
          this.d
      ] [ "/\\ ".indexOf(origMatrix[this.yPos][this.xPos]) ];

      matrix[this.yPos][this.xPos] =
        "<span class='red-beam'>" + ">v<^"["rdlu".indexOf(this.d)] + '</span>';
      origMatrix[this.yPos][this.xPos] = "\\/ "[ "/\\ ".indexOf(origMatrix[this.yPos][this.xPos]) ];
    } else
      activeBeams.splice( activeBeams.indexOf(this), 1 );
  }
}

function generateMatrix() {
  var arr = [],
      str = "",
      char = "";

  for (var i = 0; i < 32; i++) {
    str = "";
    arr.push([]);

    for (var j = 0; j < 48; j++) {
      char = "      /\\"[Math.floor(Math.random()*8)];
      arr[i].push(char, " ");
    }
  }
  return arr;
}

function pasteMatrix() {
  var htmlStr = matrix.map( function(i) {
      return i.map( function(j) {
        return j===" "?"&nbsp;":j;
      }).join("");
    }).join("<br>");

  textspace.innerHTML = htmlStr;

  // textspace.innerHTML = "";
  // for (var i = 0; i < matrix.length; i++) {
  //   textspace.innerHTML += matrix[i].join("&nbsp;")+"<br>";
  // }
}

function animationStep() {
  matrix = cloneMatrix( origMatrix );

  if ( (Date.now()-animStartTime) > 1000*beamCount ) {
    activeBeams.push( new Beam(-1, 15, "r") );
    beamCount++;
  }

  for (var i = 0; i < activeBeams.length; i++) {
    activeBeams[i].step();
  }

  pasteMatrix();
}

function resetAnimation() {
  if (animationId) clearInterval(animationId);
  animStartTime = Date.now(),
  beamCount = 0;
  activeBeams = [];
  matrix = cloneMatrix( origMatrix );

  if (!animationId)
    animationId = setInterval( animationStep, 100 );
}

function initialize() {
  textspace = document.getElementById("textspace");
  origMatrix = generateMatrix();
  matrix = cloneMatrix( origMatrix );

  pasteMatrix();

  resetAnimation();
}
