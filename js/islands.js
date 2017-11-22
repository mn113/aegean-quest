/* global d3, $, Snap */

// Add centred SVG ship to main SVG:
var svgShip = citySVG.append("svg:image")
.attr("id", "shipSVG")
.attr("xlink:href", "img/drakkar.svg")
.attr("width", 50)
.attr("height", 50)
.attr("x", 0)
.attr("y", 0)
.raise();

// NAVIGATION GRID:
var naviPoints = generateGoodPoints(16);

// Enable Snap movement:
var s = Snap("#city svg");
s.select("#shipSVG").animate({
	x: naviPoints[0][0] * 1000,
	y: naviPoints[0][1] * 1000
}, 1000);
var shipIndex = 0;

var naviGroup = citySVG.append("svg:g")
.attr("width", 200)
.attr("height", 200)
.attr("stroke", "white")
.attr("stroke-width", 3)
.attr("fill", "orange")
.on("click", function() {
	//var coords = d3.mouse(this);
	//svgShip.attr("x", coords[0]).attr("y", coords[1]);
	shipIndex++;
	console.log(shipIndex, naviPoints[shipIndex]);
	s.select("#shipSVG").animate({
		x: naviPoints[shipIndex][0] * 1000,//coords[0],
		y: naviPoints[shipIndex][1] * 1000//coords[1]
	}, 1000);
});

// Find nearest map point to each naviPoint. Is it on land or sea?
// Delete any naviPoint over land
var naviMesh = makeMesh(naviPoints);	// plenty of info, but cannot do voronoi
naviMesh = relax(cone(naviMesh, -0.75));
console.log('naviMesh', naviMesh);
for (var j = 0; j < naviPoints.length; j++) {
	console.log(j, neighbours(naviMesh.mesh, j));
}
// Build point neighbours lookup table for pathfinding:
var naviPointNeighbours = {};
for (var edge of naviMesh.mesh.edges) {
	if (edge[3] === undefined) continue;
	var keys = Object.keys(naviPointNeighbours);
	// Use strings to avoid key problems:
	var a = ""+edge[2].index,
		b = ""+edge[3].index;
	console.log(`Point ${a} connects to point ${b}`);
	// Store b on a:
	if (keys.includes(a)) naviPointNeighbours[a].push(b);
	else naviPointNeighbours[a] = [b];
	// Store a on b:
	if (keys.includes(b)) naviPointNeighbours[b].push(a);
	else naviPointNeighbours[b] = [a];
}
console.log('nPn', naviPointNeighbours);

var minimalRender = {
	params: defaultParams,
	h: naviMesh,
	cities: []
};
visualizeVoronoi(naviGroup, naviMesh, -1, 1);
visualizePoints(naviGroup, naviPoints);
drawPaths(naviGroup, 'coast', contour(naviMesh, 0));
//var naviVoronoi =

//var scores = cityScores(minimalRender.h, minimalRender.cities);
//visualizeVoronoi(citySVG, scores);//, d3.max(scores) - 0.5);
