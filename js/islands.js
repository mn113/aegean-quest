/* global d3, $, Snap */

// Enable Snap movement:
var s = Snap("#fifth svg");

// Add centred SVG ship to main SVG:
var svgShip = view.append("svg:image")
.attr("id", "shipSVG")
.attr("xlink:href", "img/boatR.png")//"img/drakkar.svg")
.attr("width", 50)
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
naviMesh = normalize(relax(cone(naviMesh, -0.75)));
console.log('naviMesh', naviMesh);
console.log('maxH', d3.max(naviMesh), 'minH', d3.min(naviMesh));

// Build data structures for Dijkstra's algorithm:
var nodes = naviPoints.map(function(p,i) {
	return {
		index: i,
		value: 'sea',
		r: 10
	};
});
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
console.log('nodes', nodes);
console.log('paths', paths);

var sp1 = new ShortestPathCalculator(nodes, paths);

visualizePoints(naviGroup, naviPoints, true);
colorizePoints(naviGroup, naviMesh);

// Make circles clickable:
view.selectAll('circle').on("click", function(d, clickedIndex) {
	//var coords = d3.mouse(this);
	//svgShip.attr("x", coords[0]).attr("y", coords[1]);
	// TODO: pass click through nav layer and return polygon height -> land or sea?
	console.log(shipNode, naviPoints[shipNode]);	// from
	console.log(clickedIndex, d);					// to
	console.log(naviMesh[clickedIndex]);
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
	// TODO: gauge Pythagorean distance and use with ship's speed for durations
	// TODO: Use native D3 animation
	s.select("#shipSVG").animate({
		x: naviPoints[dest][0] * 1000 - 25,
		y: naviPoints[dest][1] * 1000 - 35
	}, 500);
	setTimeout(function() {
		if (callback !== undefined) callback();
	}, 500);
}
