var x, y, xm, ym, r, imax,
	mouse = { x: 0, y: 0 };

function resize() {
	$("#canvas").height($(document).height());
	$("#canvas").width($(document).width());
}

function updateVar() {
	x = $(document).width() / 2;
	y = $(document).height() / 3;
	xm = x;
	ym = y-r;
}

function draw() {
	var c = document.getElementById("canvas");
	ctx = c.getContext("2d");

	resize();
	ctx.canvas.height = $("#canvas").height();
	ctx.canvas.width = $("#canvas").width();
	ctx.globalCompositeOperation = 'xor';

	for (var i = 0; i < imax; i++) {

		var x1 = x - ( Math.cos(2*Math.PI/imax * i +.5*Math.PI)*r ),
			y1 = y - ( Math.sin(2*Math.PI/imax * i +.5*Math.PI)*r ),
			r1 = Math.sqrt( Math.pow(x1-xm, 2) + Math.pow(y1-ym, 2) );
		ctx.beginPath();
		ctx.arc( x1, y1, r1, 0, 2*Math.PI);
		ctx.fill();
	}
}

document.addEventListener( "mousemove", function(e) {
	mouse.x = e.clientX || e.pageX;
	mouse.y = e.clientY || e.pageY;
}, false);

$(document).on( "click", "#canvas", function() {
	x = mouse.x;
	y = mouse.y;

	draw();
});

$(document).on( "ready", function() {
	setTimeout( function() {
		r = Math.ceil( prompt("Scale", 100) ) || 100;
		imax = Math.ceil( prompt("Complexity", 50) ) || 50;

		resize();
		updateVar();
		draw();
	}, 0 );
});

$(window).on( "resize", function() {
	resize();
	updateVar();
	draw();
});
