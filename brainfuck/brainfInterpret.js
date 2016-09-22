var mem = [0],
  string, pnt;

function doChar(indx) {
  this.i = indx;
console.log(string);
  switch (string[this.i]) {
    case ">":
      if ( mem[++pnt] === undefined ) mem[pnt] = 0;
      break;
    case "<":
      if (pnt > 0) pnt--;
      break;
    case "+":
      mem[pnt] += 1;
      break;
    case "-":
      mem[pnt] -= 1;
      break;
    case ".":
      console.log(String.fromCharCode(mem[pnt]));
      break;
    case ",":
      mem[pnt] = prompt("").charCodeAt(0);
      break;
    case "[":
      this.lval = mem[pnt];
      this.j = this.i;
      while (this.lval > 0) {
        console.log(this.lval);
        for ( this.i = this.i; this.i < string.slice(this.i).search("]"); this.i++) {
          this.j = doChar(this.i+1);
        }
      }
      this.i = this.j;
      break;
    default:
      break;
  }
  document.getElementById("outout").html = (mem.join(", ")+"\n"+ (pnt===0?"":Array( mem.slice(0, pnt+1).join("   ").length-1 ).join(" ")) +"^");
  return this.i;
}

function interpret(string) {
  string = string.replace(/[^><\+-\[\]\.,]/g, "");
  pnt = 0;

  console.log(string);

  // check for bracket balance
  for (i=0, d=0; i < string.length; i++) {
    d += string[i]==="["?1:string[i]==="]"?-1:0;
    if (d<0) break;
  }

  if (d===0) {
    for (this.i = 0; this.i < string.length; this.i++) {
      doChar(this.i);
  	}
  } else {
    console.log("Nice job fucking up those brackets!");
  }
}
