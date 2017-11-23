/* global d3, $, Snap */

// Enable Snap movement:
var s = Snap("#city svg");

// Add centred SVG ship to main SVG:
var svgShip = view.append("svg:image")
.attr("id", "shipSVG")
.attr("xlink:href", "img/drakkar.svg")
.attr("width", 50)
.attr("height", 50)
.attr("x", 0)
.attr("y", 0)
.raise();

var naviGroup = view.append("svg:g")
.attr("id", "naviGroup");

// NAVIGATION GRID:
var naviPoints = generateGoodPoints(256);
// TODO: Find nearest map point to each naviPoint. Is it on land or sea?
// Delete any naviPoint over land
var naviMesh = makeMesh(naviPoints);	// plenty of info, but cannot do voronoi
naviMesh = relax(cone(naviMesh, -0.75));
console.log('naviMesh', naviMesh);

// Build data structures for Dijkstra's algorithm:
var nodes = naviPoints.map(function(p,i) {
	return {
		index: i,
		value: 'sea',
		r: 10
	};
});
//var paths = [];
var paths = naviMesh.mesh.edges.map(function(edge) {
	if (edge[3] === undefined) return null;
	// Use strings to avoid key problems:
	var a = ""+edge[2].index,
		b = ""+edge[3].index;
	return {
		source: a,
		target: b,
		distance: 1000 * pointDistance(naviMesh.mesh, a, b)
	};
}).filter(p => p);	// no nulls
/*
for (var edge of naviMesh.mesh.edges) {
	if (edge[3] === undefined) continue;
	// Use strings to avoid key problems:
	var a = ""+edge[2].index,
		b = ""+edge[3].index;

	paths.push({
		source: a,
		target: b,
		distance: 1000 * pointDistance(naviMesh.mesh, a, b)
	});
}
*/
console.log('nodes', nodes);
console.log('paths', paths);

var sp1 = new ShortestPathCalculator(nodes, paths);

//visualizeVoronoi(naviGroup, naviMesh, -1, 1);
visualizePoints(naviGroup, naviPoints, true);

// Make circles clickable:
view.selectAll('circle').on("click", function(d, clickedIndex) {
	//var coords = d3.mouse(this);
	//svgShip.attr("x", coords[0]).attr("y", coords[1]);
	console.log(shipNode, naviPoints[shipNode]);	// from
	console.log(clickedIndex, d);					// to
	svgShip.raise();
	routeShip(clickedIndex);
});

var shipNode = 0;
// Ship methods:
function routeShip(dest) {
	var route = sp1.findRoute(shipNode, dest);
	var hopped = 0;
	console.log('route', route);
	// Infinite loop:
	function doHop() {
		var hop = route.path[hopped];
		moveShip(hop.target, function() {
			// Update location:
			shipNode = hop.target;
			hopped++;
			// Continue infinite loop:
			if (hopped < route.path.length) doHop();
		});
	}
	// Init loop:
	doHop();
}
function moveShip(dest, callback) {
	// TODO: Use native D3 animation
	s.select("#shipSVG").animate({
		x: naviPoints[dest][0] * 1000,
		y: naviPoints[dest][1] * 1000
	}, 500);
	setTimeout(function() {
		if (callback !== undefined) callback();
	}, 500);
}
