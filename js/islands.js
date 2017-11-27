/* global d3, $, Snap, view, generateGoodPoints, makeMesh, pointDistance, ShortestPathCalculator, visualizePoints, svgShip, seaLevel */

var sPath, shipNode, path, nodes;

// Prepare nav nodes for Dijkstra pathfinding:
function prepareNavNodes(h) {
	return h.mesh.triCentres.map(function(value, index) {
		//if (value === null) return null;
		return {
			index: index,
			value: value,			// coords, ignored
			r: h[index] || null		// size, ignored
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
	//console.log('temp', paths);
	// Format as object and append distances:
	return paths.map(function(str) {
		var arr = str.split("_");
		//console.log(arr);
		arr = arr.map(x => parseInt(x,10));
		//console.log(arr);
		return {
			source: arr[0],
			target: arr[1],
			distance: 1000 * triCentreDistance(h.mesh, arr[0], arr[1])	// penalizes longer routes
		};
	});
}

// Make navigation structures and wire up the map:
function addNaviLayer(target, render) {
	// Build navigation system from triangle centres:
	nodes = prepareNavNodes(render.h);
	paths = prepareNavPaths(render.h);
	console.log('nodes', nodes);
	console.log('paths', paths);
	sPath = new ShortestPathCalculator(nodes, paths);

	// Make map triangles clickable:
	view.selectAll('path.field').on("click", function(d, clickedIndex) {
		console.log(shipNode, nodes[shipNode]);	// from
		console.log(clickedIndex, d);					// to
		console.log(nodes[clickedIndex]);
		svgShip.raise();
		routeShip(clickedIndex);
	});
}

// Create ship element and place on map:
function addShipSvg(target) {
	// Choose initial placement for ship (sea middle?):
	var initNode = nodes.filter(n => n.r && n.r < seaLevel).random().index;
	var initCoords = nodes[initNode].value;
	console.log('initNode', initNode, initCoords);

	// Add centred SVG ship to main SVG:
	var svgShip = target.append("svg:image")
	.attr("id", "shipSVG")
	.attr("xlink:href", "img/boatR.png")
	.attr("width", 50)
	.attr("x", 1000 * initCoords[0])
	.attr("y", 1000 * initCoords[1])
	.raise();

	shipNode = initNode;
	return svgShip;
}

// Enable Snap movement:
var s = Snap("#fifth svg");

// Ship methods:
function routeShip(dest) {
	var route = sPath.findRoute(shipNode, dest);
	var hopped = 0;
	console.log('route', route);
	if (!route.path) return;
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
	var distance = 25000 * triCentreDistance(Stage5Render.h.mesh, shipNode, destNode),
		duration = distance / ship1.speed;
	//console.log('distance', distance, 'duration', duration);

	// TODO: Use native D3 animation - if practical?
	var destCoords = Stage5Render.h.mesh.triCentres[destNode];
	s.select("#shipSVG").animate({
		x: destCoords[0] * 1000 - 25,	// ship sprite offset
		y: destCoords[1] * 1000 - 35
	}, duration);
	setTimeout(function() {
		if (callback !== undefined) callback();
	}, duration);
}

function linkCities(svg) {
	// Link cities in to nav network:
	svg.selectAll("circle.city")	// only 10 => not ok
	.on('click', function() {
		console.log(this);
		// Pass click through, get underlying tri:
		var cityNode = $(this).data("triangle");
		var seaNode = $(this).data("nearsea");
		routeShip(seaNode);
		return;
	});
}

function downToTheSea(tri, render) {
	console.log('dtts', tri);
	while (render.h[tri] >= seaLevel) {
		// Move to downhill neighbour if possible:
		if (render.h.downhill[tri] === -1) break;
		tri = render.h.downhill[tri];
		console.log('dtts ->', tri);
	}
	return tri;
}
