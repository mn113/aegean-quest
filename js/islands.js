/* global d3, $, Snap, view, generateGoodPoints, makeMesh, pointDistance, ShortestPathCalculator, visualizePoints, svgShip, seaLevel */

var sPath, naviPoints, naviMesh;

// Prepare nav nodes for Dijkstra pathfinding:
function prepareNavNodes(h) {
	return h.mesh.triCentres.map(function(value, index) {
		if (value === null) return null;
		return {
			index: index,
			value: value,	// coords, ignored
			r: h[index]		// size, ignored
		};
	}).filter(t => t);	// no nulls por favor
}

// Prepare nav paths for Dijkstra pathfinding:
function prepareNavPaths(h) {
	var paths = [];
	// Transform the adj data into another format:
	for (var a = 0; a < h.mesh.adj.length; a++) {
		for (var b of h.mesh.adj[a]) {
			// Don't add landy paths or null points:
			if (h[a] > seaLevel || h[b] > seaLevel
			|| !h.mesh.triCentres[a] || !h.mesh.triCentres[b])
				continue;

			var c = Math.min(a,b),	// always add lo->hi
				d = Math.max(a,b);
			// Avoid dupes:
			if (paths.includes(c+"_"+d)) continue;
			paths.push(c+"_"+d);
		}
	}
	console.log('temp', paths);
	// Format as object and append distances:
	return paths.map(function(str) {
		var arr = str.split("_");
		console.log(arr);
		arr = arr.map(x => parseInt(x,10));
		console.log(arr);
		return {
			source: arr[0],
			target: arr[1],
			distance: 1000 * triCentreDistance(h.mesh, arr[0], arr[1])	// penalizes longer routes
		};
	});
}


function addNaviLayer(target, render) {
	// Build navigation system from triangle centres:
	var nodes = prepareNavNodes(render.h);
	var paths = prepareNavPaths(render.h);
	console.log('nodes', nodes);
	console.log('paths', paths);
	sPath = new ShortestPathCalculator(nodes, paths);

	// Make triangles clickable:
	view.selectAll('path.field').on("click", function(d, clickedIndex) {
		console.log(shipNode, nodes[shipNode]);	// from
		console.log(clickedIndex, d);					// to
		console.log(nodes[clickedIndex]);
		svgShip.raise();
		routeShip(clickedIndex);
	});
}

// Enable Snap movement:
var s = Snap("#fifth svg");

function addShipSvg(target) {
	// Add centred SVG ship to main SVG:
	var svgShip = target.append("svg:image")
	.attr("id", "shipSVG")
	.attr("xlink:href", "img/boatR.png")//"img/drakkar.svg")
	.attr("width", 50)
	.attr("x", 0)
	.attr("y", 0)
	.raise();

	return svgShip;
}

var shipNode = 0;
// Ship methods:
function routeShip(dest) {
	var route = sPath.findRoute(shipNode, dest);
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
function moveShip(destNode, callback) {
	// Get Pythagorean distance and use with ship's speed for animation duration:
	var distance = 25000 * pointDistance(naviMesh, shipNode, destNode),
		duration = distance / ship1.speed;
	console.log('distance', distance, 'duration', duration);

	// TODO: Use native D3 animation - if practical?
	s.select("#shipSVG").animate({
		x: naviPoints[destNode][0] * 1000 - 25,
		y: naviPoints[destNode][1] * 1000 - 35
	}, duration);
	setTimeout(function() {
		if (callback !== undefined) callback();
	}, duration);
}
