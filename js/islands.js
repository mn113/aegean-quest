/* global d3 */
/* node-env browser */

var ship = d3.select("#ship");
d3.select("#city").on("click", function() {
	var coords = d3.mouse(this);
	//console.log('clicked', coords);
	// Move ship to click
	//ship.style("left", coords[0]);	// DOES NOTHING
	//ship.style("top", coords[1]);
});

// Add centred SVG ship to main SVG:
var svgShip = citySVG.append("svg:image")
.attr("xlink:href", "img/drakkar.svg")
.attr("width", 50)
.attr("height", 50)
.attr("x", 0)
.attr("y", 0);

// NAVIGATION GRID
//var naviSVG = addSVG(cityDiv);
var naviPoints = generateGoodPoints(256);
//var navPoints =

var naviGroup = citySVG.append("svg:g")
.attr("width", 200)
.attr("height", 200)
.attr("stroke", "white")
.attr("stroke-width", 3)
.attr("fill", "orange");

visualizePoints(naviGroup, naviPoints);
// Find nearest map point to each naviPoint. Is it on land or sea?
// Delete any naviPoint over land
