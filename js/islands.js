/* global meshTransforms, generateGoodMesh, visualizeTriangles, drawPaths, contour, add, slope, randomVector, cone, mountains, normalize, peaky, relax, setSeaLevel, randomFrom, fillSinks, doErosion, cleanCoast, getRivers, visualizeSlopes, defaultExtent, defaultParams, placeCity, cityScores, visualizeCities, landSeaRatio, drawLabels, addCentresToTriangles, triCentreDistance */
/* global $, d3, ShortestPathCalculator, simplify */
/* global Town, player, svgShip,  */

// A few globals
var seaLevel = 0.5;
var towns = [];
var mapRender, ShortPathCalc, svgShip, shipNode, paths, nodes;

// Set up map with D3:
var citySVG = d3.select("div#fifth svg");
var view = citySVG.append('g').attr('id', 'view');

// Prepare nav nodes for A* pathfinding:
function prepareNavNodes(h) {
	return h.mesh.triCentres.map(function(value, index) {
		//if (value === null) return null;
		return {
			index: index,
			coords: value,
			value: null,			// name, ignored
			r: h[index] || null		// size, ignored
		};
	}).filter(t => t);	// no nulls por favor
}

// Prepare nav paths for A* pathfinding:
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
	console.log('Calculated', nodes.length, 'navNodes');
	console.log('Calculated', paths.length, 'navPaths');
	ShortPathCalc = new ShortestPathCalculator(nodes, paths);
	ShortPathCalc.init();

	// Make map triangles clickable:
	view.selectAll('path.field').on("click", function(d, clickedIndex) {
		console.log(shipNode, nodes[shipNode]);		// from
		console.log(clickedIndex, d);				// to
		console.log(nodes[clickedIndex]);
		svgShip.raise();
		routeShip(clickedIndex);
	});
}

// Create ship element and place on map:
function addShipSvg(target) {
	// Choose initial placement for ship (sea middle?):
	var initNode = nodes.filter(n => n.coords && n.r && n.r < seaLevel).random().index;
	var initCoords = nodes[initNode].coords;
	//console.log('initNode', initNode, initCoords);
	var x = 1000 * initCoords[0],
		y = 1000 * initCoords[1];

	// Add SVG ship to main SVG at initial node position:
	svgShip = target.append("g")	//eslint-disable-line no-global-assign
		.attr("id", "shipSVG")
		.attr("transform", "translate("+x+","+y+")")
		.raise();
	// Image inside g has the permanent sprite offset:
	svgShip.append("svg:image")
		.attr("xlink:href", "img/boatR.png")
		.attr("transform", "translate(-25,-40)")
		.attr("width", 50);

	shipNode = initNode;
}

// Make route for ship and set it moving:
function routeShip(dest, callback) {
	var route = ShortPathCalc.findRoute(shipNode, dest);
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
			else if (shipNode === dest) {
				callback();
			}
		});
	}
	// Init loop:
	doHop();
}

// Use Simplify.js to smooth the path:
function simplifyRoute(route) {
	var points = route.map(p => {
		return {x: nodes[p.target].coords[0], y: nodes[p.target].coords[1]};
	});
	//var tolerance = 5;
	return simplify(points);	// TODO
}

// Animate ship to a new node:
function moveShip(destNode, callback) {
	// Get Pythagorean distance and use with ship's speed for animation duration:
	var distance = 25000 * triCentreDistance(mapRender.h.mesh, shipNode, destNode),
		duration = distance / player.ships[0].speed;
	//console.log('distance', distance, 'duration', duration);

	var destCoords = mapRender.h.mesh.triCentres[destNode];
	var x = 1000 * destCoords[0],
		y = 1000 * destCoords[1];
	//console.log(destNode, destCoords);

	// Animate ship:
	d3.select("#shipSVG")
		.transition()
		.duration(duration)
		.attr("transform", "translate("+x+","+y+")");// scaleX(-1)");	// flippit

	// Call callback when done animating:
	setTimeout(function() {
		if (callback !== undefined) callback();
	}, duration);
}

// Wire up cities so clicking them brings the ship to their water:
function linkCities(svg) {
	// Link cities in to nav network:
	svg.selectAll("circle.city")
	.on('click', function() {
		console.log(this);
		// Pass click through, get underlying tri:
		//var cityNode = $(this).data("triangle");
		var seaNode = $(this).data("nearsea");
		//var ptIndex = $(this).data("ptIndex");
		var name = $(this).data("name");
		// Set sail, and visit city on arrival:
		routeShip(seaNode, function() {
			// Retrieve city from registry:
			var city = towns.filter(t => t.name === name)[0];	// BUG cannot find it
			console.log(city);
			city.visit();
		});
		return;
	});
}

// Just wraps the heightmap in preparation for cities data:
function newRender(type, h) {
	type = type || 1;
	h = h || generateBaseMap(type, {npts:2048, extent: defaultExtent});
	addCentresToTriangles(h);
	var render = {
		params: defaultParams,
		h: h,
		cities: []
	};
	render.rivers = getRivers(h, 0.01);
	render.coasts = contour(h, 0);
	return render;
}

// Triggered by buttons:
function drawMap(render) {
	$("#game-loader").addClass("active dimmer");
	cityScores(render.h, render.cities);
	visualizeTriangles(view, render.h, undefined, undefined, false);//, d3.max(scores) - seaLevel);//0.5);
	//visualizeCentroids(view, Stage5Render.h);
	//visualizePoints(view, Stage5Render.h.mesh.pts, true);
	//colorizePoints(view, Stage5Render.h);

	drawPaths(view, 'coast', contour(render.h, 0.5));
	drawPaths(view, 'river', getRivers(render.h, 0.01));
	visualizeSlopes(view, render);
	$("#game-loader").removeClass("active dimmer");
}

// Make map zoomable:
function enableZoom() {
	// Pan & zoom:
	var zoom = d3.zoom()
		.scaleExtent([.75, 3])
		.translateExtent([[0,0],[800,600]])	// trap to bounds (x=20, y=50)
		.on("zoom", function() {
			//console.log(d3.event.transform);
			var t = d3.event.transform,
				x = t.x + 400 * t.k,
				y = t.y + 300 * t.k;
			view.attr("transform", "translate(" + x + "," + y + ") scale(" + t.k + ")");
			// Keep ship sprite constant size across zoom levels:
			d3.select("#shipSVG image").attr("transform", "translate(-25,-40) scale("+ 1.2 / t.k +")");
		});
	citySVG.call(zoom);
	zoom.scaleTo(citySVG, .75);
}

// The first step in generating a map from primitives:
function generateBaseMap(type, params) {
	var mesh = generateGoodMesh(params.npts, params.extent);
	var h = mesh;

	if (type === 1) {	// Inverted cone + 25
		h = add(
			cone(mesh, -3),
			mountains(mesh, 10, 0.04),
			mountains(mesh, 15, 0.06)
		);
	}
	else if (type === 2) {	// Top-bottom + 25
		h = add(
			meshTransforms.edgeLand(mesh, 'top'),
			meshTransforms.edgeLand(mesh, 'bottom'),
			mountains(mesh, 10, 0.04),
			mountains(mesh, 15, 0.06)
		);
	}
	else if (type === 3) {	// Right-left + 25
		h = add(
			meshTransforms.edgeLand(mesh, 'left'),
			meshTransforms.cornerLand(mesh, 'topRight'),
			meshTransforms.cornerLand(mesh, 'bottomRight'),
			mountains(mesh, 10, 0.04),
			mountains(mesh, 15, 0.06)
		);
	}
	else if (type === 4) {	// Opposite corners + 35
		h = add(
			meshTransforms.cornerLand(mesh, 'topRight'),
			meshTransforms.cornerLand(mesh, 'bottomLeft'),
			mountains(mesh, 10, 0.04),
			mountains(mesh, 15, 0.06),
			mountains(mesh, 10, 0.08)
		);
	}
	else if (type === 5) {	// 3 corners + 40
		h = add(
			//meshTransforms.cornerLand(mesh, 'topRight'),
			mountains(mesh, 3, 0.06),
			mountains(mesh, 3, 0.05),
			mountains(mesh, 3, 0.04),
			mountains(mesh, 3, 0.03)
		);
	}
	else {
		h = add(
			slope(mesh, randomVector(4)),
			cone(mesh, randomFrom(-1, -1)),	// random slope
			mountains(mesh, 20)
		);
	}
	// Average heightmap several times:
	for (var i = 0; i < 10; i++) {
		h = relax(h);
	}
	h = peaky(h);
	// Erode terrain:
	h = doErosion(h, randomFrom(0, 0.1), 2);	// 5 times
	h = fillSinks(h);
	h = normalize(h);

	seaLevel = 0.5;//randomFrom(0.2, 0.6);		// why random?
	h = setSeaLevel(h, seaLevel);
	console.log('land:sea', landSeaRatio(h, seaLevel));

	// Smooth coast:
	h = cleanCoast(h, 6);	// FIXME smoother!

	return normalize(h);
}

// The whole map layer setup sequence:
function buildGameWorld() {
	mapRender = newRender(5);	// TODO: randomise between 3 decent generators
	drawMap(mapRender);

	// Add cities:
	for (var c = 15; c > 0; c--) {
		var t = new Town();
		towns.push(t);
		t.ptIndex = placeCity(mapRender, t, c === 1);	// log last one
	}
	console.log('mapRender', mapRender);
	visualizeCities(view, mapRender);
	drawLabels(view, mapRender);
	linkCities(view);

	// Finalise:
	addNaviLayer(view, mapRender);
	addShipSvg(view);
	enableZoom();

	return mapRender;
}
buildGameWorld();
