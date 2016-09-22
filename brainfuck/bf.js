var mem = [0];
var ptr = 0;
var interpreters = [];
var output = "";

function Interpreter(str) {
  this.string = str;

  output = "";

  this.i = 0;
  while ( this.i < this.string.length) {
    console.log("doing '"+ this.string[this.i] +"'.");

    switch ( this.string[this.i] ) {
      case ">":
        if ( mem[++ptr] === undefined )
          mem[ptr] = 0;
        break;
      case "<":
        if (ptr > 0)
          ptr--;
        break;
      case "+":
        mem[ptr] += 1;
        break;
      case "-":
        mem[ptr] -= 1;
        break;
      case ".":
        console.log(String.fromCharCode(mem[ptr]));
        output += String.fromCharCode(mem[ptr]);
        break;
      case ",":
        mem[ptr] = prompt("").charCodeAt(0);
        break;
      case "[":
        this.endOfLoop = this.i+1;

        // console.log("checking "+this.string.slice(this.i+1));
        for (this.j=0, this.d=0; this.j < this.string.slice(this.i+1).length; this.j++) {
          this.d += this.string.slice(this.i+1)[this.j]==="["?1:this.string.slice(this.i+1)[this.j]==="]"?-1:0;
          if (this.d<0) break;
        }
        this.endOfLoop += this.j;
        // console.log(this.endOfLoop);
        //
        console.log("repeating '"+this.string.slice( this.i+1, this.endOfLoop)+"'");

        while (mem[ptr] > 0) {
          interpreters.push( new Interpreter(this.string.slice( this.i+1, this.endOfLoop )) ); // only works for one loop
        }

        this.i = this.endOfLoop;
        break;
      default:
        break;
    }
    this.i++;

  }
  interpreters.splice(interpreters.indexOf(this));

  console.log(mem.join(", ")+"\n"+
    Array( mem.slice(0, ptr+1).join("  ").length ).join(" ") +"^");
}

function interpret(str) {
  mem = [0];
  ptr = 0;
  interpreters = [];
  str = str.replace(/[^><\+-\[\]\.,]/g, "");
  console.log("Interpreting",str);

  // check for bracket balance
  for (this.i=0, this.d=0; this.i < str.length; this.i++) {
    this.d += str[this.i]==="["?1:str[this.i]==="]"?-1:0;
    if (this.d<0) break;
  }

  if (this.d===0)
  interpreters.push(new Interpreter(str));

  document.getElementById("output").innerHTML = output;
}
