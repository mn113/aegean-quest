/* global d3 */
/* node-env browser */

//console.log(generatePoints(250));

citySVG.select("field").on('hover', function() {
	console.log(this);
});

var ship = d3.select("#ship");
d3.select("#city").on("click", function() {
	var coords = d3.mouse(this);
	console.log('clicked', coords);
	// Move ship to click
	ship.style("left", coords[0]);	// DOES NOTHING
	ship.style("top", coords[1]);
});
