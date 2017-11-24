/* global d3, $, Snap, view, generateGoodPoints, makeMesh, normalize, relax, cone, pointDistance, ShortestPathCalculator, visualizePoints, colorizePoints, svgShip */

var sPath, naviPoints, naviMesh;

function addNaviLayer(target) {
	var naviGroup = target.append("svg:g").attr("id", "naviGroup");

	// NAVIGATION GRID:
	naviPoints = generateGoodPoints(256);
	// TODO: Find nearest map point to each naviPoint. Is it on land or sea?
	// Delete any naviPoint over land
	naviMesh = makeMesh(naviPoints);
	//naviMesh = normalize(relax(cone(naviMesh, -0.75)));
	console.log('naviMesh', naviMesh);
	console.log('maxH', d3.max(naviMesh), 'minH', d3.min(naviMesh));

	// TODO: remove navi points which are above land, using x & y:
	

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
		// Use strings to avoid key problems: //FIXME
		var a = ""+edge[2].index,
			b = ""+edge[3].index;
		return {
			source: a,
			target: b,
			distance: 1000 * pointDistance(naviMesh.mesh, a, b)
		};
	}).filter(p => p);	// no nulls por favor
	console.log('nodes', nodes);
	console.log('paths', paths);

	sPath = new ShortestPathCalculator(nodes, paths);

	visualizePoints(naviGroup, naviPoints, true);
	colorizePoints(naviGroup, naviMesh);

	// Make circles clickable:
	view.selectAll('circle').on("click", function(d, clickedIndex) {
		var coords = d3.mouse(this);
		//svgShip.attr("x", coords[0]).attr("y", coords[1]);
		// TODO: pass click through nav layer and return polygon height -> land or sea?
		console.log(shipNode, naviPoints[shipNode]);	// from
		console.log(clickedIndex, d);					// to
		console.log(naviMesh[clickedIndex]);
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
	var distance = 2500 * pointDistance(naviMesh.mesh, shipNode, destNode),
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

// Use class 'passThru' to allow clicks to pass to layer below
function passThruEvents(g) {
	g.on('mousedown.passThru', passThru);
	//.on('mousemove.passThru', passThru)

	function passThru(d) {
		var e = d3.event;

		var prev = this.style.pointerEvents;
		this.style.pointerEvents = 'none';

		var el = document.elementFromPoint(d3.event.x, d3.event.y);

		var e2 = document.createEvent('MouseEvent');
		e2.initMouseEvent(e.type,e.bubbles,e.cancelable,e.view, e.detail,e.screenX,e.screenY,e.clientX,e.clientY,e.ctrlKey,e.altKey,e.shiftKey,e.metaKey,e.button,e.relatedTarget);

		el.dispatchEvent(e2);

		this.style.pointerEvents = prev;
	}
}
