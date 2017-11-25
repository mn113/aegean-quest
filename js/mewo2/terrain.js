/* global d3, makeRandomLanguage, makeName, PriorityQueue */

"use strict";

// Random number function?
var rnorm = (function () {
	var z2 = null;
	function rnorm() {
		if (z2 !== null) {
			var tmp = z2;
			z2 = null;
			return tmp;
		}
		var x1 = 0;
		var x2 = 0;
		var w = 2.0;
		while (w >= 1) {
			x1 = randomFrom(-1, 1);
			x2 = randomFrom(-1, 1);
			w = x1 * x1 + x2 * x2;
		}
		w = Math.sqrt(-2 * Math.log(w) / w);
		z2 = x2 * w;
		return x1 * w;
	}
	return rnorm;
})();
//console.log('rNorm', rnorm());	// WHAT IS THIS?

function randomFrom(lo, hi) {
	return lo + Math.random() * (hi - lo);
}

function randomVector(scale) {
	return [scale * rnorm(), scale * rnorm()];
}

// Defines aspect ratio of final render:
var defaultExtent = {
	width: 1,
	height: 0.75
};

class Points {
	constructor(extent) {
		this.points = [];
		this.extent = extent || defaultExtent;
		return this;
	}

	// Create a load of random points within a rectangular area:
	generate(n) {
		for (var i = 0; i < n; i++) {
			// Randomise x & y:
			this.points.push([
				(Math.random() - 0.5) * this.extent.width,
				(Math.random() - 0.5) * this.extent.height
			]);
		}
		return this;
	}

	// Move each point closer to its cell's centroid, n times:
	// ( https://en.wikipedia.org/wiki/Lloyd%27s_algorithm )
	improve(times) {
		times = times || 1;
		for (var i = 0; i < times; i++) {
			var d3polys = Points.voronoi(this.points).polygons(this.points);
			this.points = d3polys.map(Points.centroid);
		}
		return this;
	}

	// Generate points and separate them nicely:
	static generateGood(n) {
		var pts = new Points().generate(n);
		pts = pts.sort(function (a, b) {
			return a[0] - b[0];
		});
		return pts.improve(1);
	}

	// Find the average point of several:
	static centroid(pts) {
		var points = pts || this.points;
		var numPoints = points.length;
		var sum = {
			x: 0,
			y: 0
		};
		for (var i = 0; i < numPoints; i++) {
			sum.x += points[i][0];
			sum.y += points[i][1];
		}
		return [sum.x/numPoints, sum.y/numPoints];
	}

	// Create a D3 Voronoi set from the set of points:
	static voronoi(pts, extent) {
		extent = extent || this.extent;
		var w = extent.width/2;
		var h = extent.height/2;
		return d3.voronoi().extent([[-w, -h], [w, h]])(pts);
	}

}

// Create a load of random points within a rectangular area:
function generatePoints(n, extent) {
	extent = extent || defaultExtent;
	var pts = [];
	for (var i = 0; i < n; i++) {
		// Randomise x & y:
		pts.push([
			(Math.random() - 0.5) * extent.width,
			(Math.random() - 0.5) * extent.height
		]);
	}
	return pts;
}

// Find the average point of several:
function centroid(pts) {
	var numPoints = pts.length;
	var sum = {
		x: 0,
		y: 0
	};
	for (var i = 0; i < numPoints; i++) {
		sum.x += pts[i][0];
		sum.y += pts[i][1];
	}
	return [sum.x/numPoints, sum.y/numPoints];
}

// Move each point closer to its cell's centroid, n times:
// ( https://en.wikipedia.org/wiki/Lloyd%27s_algorithm )
function improvePoints(pts, n, extent) {
	n = n || 1;
	extent = extent || defaultExtent;
	for (var i = 0; i < n; i++) {
		pts = voronoi(pts, extent)
		.polygons(pts)
		.map(centroid);
	}
	return pts;
}

// Generate points and separate them nicely:
function generateGoodPoints(n, extent) {
	extent = extent || defaultExtent;
	var pts = generatePoints(n, extent);
	pts = pts.sort(function (a, b) {
		return a[0] - b[0];
	});
	return improvePoints(pts, 1, extent);
}

// Create a D3 Voronoi set from the set of points:
function voronoi(pts, extent) {
	extent = extent || defaultExtent;
	var w = extent.width/2;
	var h = extent.height/2;
	return d3.voronoi().extent([[-w, -h], [w, h]])(pts);
}

// Make the Voronoi set into a mesh:
function makeMesh(pts, extent) {
	extent = extent || defaultExtent;
	var vor = voronoi(pts, extent);
	var vxs = [];
	var vxids = {};
	var adj = [];
	var edges = [];
	var tris = [];
	for (var i = 0; i < vor.edges.length; i++) {
		var e = vor.edges[i];
		if (e === undefined) continue;
		var e0 = vxids[e[0]];
		var e1 = vxids[e[1]];
		if (e0 === undefined) {
			e0 = vxs.length;
			vxids[e[0]] = e0;
			vxs.push(e[0]);
		}
		if (e1 === undefined) {
			e1 = vxs.length;
			vxids[e[1]] = e1;
			vxs.push(e[1]);
		}
		adj[e0] = adj[e0] || [];
		adj[e0].push(e1);
		adj[e1] = adj[e1] || [];
		adj[e1].push(e0);
		edges.push([e0, e1, e.left, e.right]);
		tris[e0] = tris[e0] || [];
		if (!tris[e0].includes(e.left)) tris[e0].push(e.left);
		if (e.right && !tris[e0].includes(e.right)) tris[e0].push(e.right);
		tris[e1] = tris[e1] || [];
		if (!tris[e1].includes(e.left)) tris[e1].push(e.left);
		if (e.right && !tris[e1].includes(e.right)) tris[e1].push(e.right);
	}

	var mesh = {
		pts: pts,	// simple list of [x,y] points
		vor: vor,	// Voronoi cells & edges
		vxs: vxs,	// vertices
		adj: adj,	// adjacent triangles
		tris: tris,	// Delaunay triangles
		edges: edges,	// point-point edges
		extent: extent	// aspect ratio of mesh
	};
	// BUG: HOW DOES h END UP WITH SO MANY LOOSE POINTS?
	mesh.map = function (f) {
		var mapped = vxs.map(f);	// LOOSE POINTS CREATED HERE
		mapped.mesh = mesh;
		return mapped;
	};
	return mesh;
}

// Generate points, improve them, make a mesh:
function generateGoodMesh(n, extent) {
	extent = extent || defaultExtent;
	var pts = generateGoodPoints(n, extent);
	return makeMesh(pts, extent);
}

// Fewer than 3 adjacent triangles -> must be on edge of bounding area
function isedge(mesh, i) {
	return (mesh.adj[i].length < 3);
}

// Proximity test whether a polygon is near map edge:
function isnearedge(mesh, i) {
	var x = mesh.vxs[i][0];
	var y = mesh.vxs[i][1];
	var w = mesh.extent.width;
	var h = mesh.extent.height;
	const ET = 0.497;	// Edge Threshold, must not exceed 0.5
	return x < -ET * w || x > ET * w || y < -ET * h || y > ET * h;
}

// Get 3 neighbouring triangles of a triangle:
function neighbours(mesh, i) {
	var onbs = mesh.adj[i];		// ?
	var nbs = [];				// neighbours
	for (var i = 0; i < onbs.length; i++) {
		nbs.push(onbs[i]);
	}
	return nbs;	// why not just return onbs?
}

// Get Pythagorean distance between vertices:
function distance(mesh, i, j) {
	var p = mesh.vxs[i];
	var q = mesh.vxs[j];
	var dx = p[0] - q[0];
	var dy = p[1] - q[1];
	//var dist = Math.sqrt((p[0] - q[0]) * (p[0] - q[0]) + (p[1] - q[1]) * (p[1] - q[1]));
	var dist = Math.sqrt(dx*dx + dy*dy);
	return dist;
}

// Get Pythagorean distance between points:
function pointDistance(mesh, i, j) {
	var p = mesh.pts[i];
	var q = mesh.pts[j];
	var dx = p[0] - q[0];
	var dy = p[1] - q[1];
	var dist = Math.sqrt(dx*dx + dy*dy);
	return dist;
}

// Make some sort of quantile scale of sorted heights?
function quantile(h, q) {
	var sortedh = [];
	// Clone:
	for (var i = 0; i < h.length; i++) {
		sortedh[i] = h[i];
	}
	sortedh.sort(d3.ascending);
	return d3.quantile(sortedh, q);
}

// Reset mesh to flat plane:
function zero(mesh) {
	var z = [];
	for (var i = 0; i < mesh.vxs.length; i++) {
		z[i] = 0;
	}
	z.mesh = mesh;
	return z;
}

// Add a random slope to the mesh:
function slope(mesh, direction) {
	return mesh.map(function (x) {
		return x[0] * direction[0] + x[1] * direction[1];
	});
}

var meshTransforms = {
	// Add some land on one side only:
	edgeLand: function(mesh, side) {
		return mesh.map(function (pt) {
			switch(side) {
				// dealing with an [x,y] point in a [-0.5,0.5] extent for each axis
				case 'left':   return pt[0] < (0.1 * Math.random() - 0.25);
				case 'right':  return pt[0] > (0.1 * Math.random() + 0.25);
				case 'top':    return pt[1] < (0.1 * Math.random() - 0.25);
				case 'bottom': return pt[1] > (0.1 * Math.random() + 0.25);
			}
		});
	},
	// Add some land to one corner of the map:
	cornerLand: function(mesh, corner) {
		return mesh.map(function (pt) {
			var r1 = (0.1 * Math.random()) - 0.25,
				r2 = (0.1 * Math.random()) + 0.25;
			switch(corner) {
				// dealing with an [x,y] point in a [-0.5,0.5] extent for each axis
				case 'topLeft':     return pt[0] < r1 && pt[1] < r1;
				case 'topRight':    return pt[0] > r2 && pt[1] < r1;
				case 'bottomLeft':  return pt[0] < r1 && pt[1] > r2;
				case 'bottomRight': return pt[0] > r2 && pt[1] > r2;
			}
		});
	}
};

// Add a cone to the mesh (higher in centre):
function cone(mesh, slope) {
	return mesh.map(function (x) {
		return Math.pow(x[0] * x[0] + x[1] * x[1], 0.5) * slope;
	});
}

// Transform mesh h with function f:
function map(h, f) {
	var newh = h.map(f);
	newh.mesh = h.mesh;
	return newh;
}

// Maps all mesh heights back onto a 0-1 scale:
function normalize(h) {
	var lo = d3.min(h);
	var hi = d3.max(h);
	return map(h, function (x) {
		return (x - lo) / (hi - lo);
	});
}

// Normalize & square-root the mesh's heights (makes hills smoother):
function peaky(h) {
	return map(normalize(h), Math.sqrt);
}

// Add different meshes into one:
function add() {
	var n = arguments[0].length;
	var newvals = zero(arguments[0].mesh);
	for (var i = 0; i < n; i++) {
		for (var j = 0; j < arguments.length; j++) {
			newvals[i] += arguments[j][i];
		}
	}
	return newvals;
}

// Add n mountains of radius rad to the mesh:
function mountains(mesh, n, rad) {
	rad = rad || 0.05;
	var mountains = [];
	for (var i = 0; i < n; i++) {
		mountains.push([mesh.extent.width * (Math.random() - 0.5), mesh.extent.height * (Math.random() - 0.5)]);
	}
	var newvals = zero(mesh);
	for (var i = 0; i < mesh.vxs.length; i++) {
		var p = mesh.vxs[i];
		for (var j = 0; j < n; j++) {
			var m = mountains[j];
			var r = rad + 0.015 * (0.5 + Math.random() - 1);	// keep varying radius
			newvals[i] += Math.pow(Math.exp(-((p[0] - m[0]) * (p[0] - m[0]) + (p[1] - m[1]) * (p[1] - m[1])) / (2 * r * r)), 2);
		}
	}
	return newvals;
}

// Smooth the heightmap by averaging neighbours:
function relax(h) {
	var newh = zero(h.mesh);
	for (var i = 0; i < h.length; i++) {
		var nbs = neighbours(h.mesh, i);
		if (nbs.length < 3) {
			newh[i] = 0;
			continue;
		}
		newh[i] = d3.mean(nbs.map(function (j) {return h[j];}));
	}
	return newh;
}

// Add a downhill property to the heightmap, indicating which cells are down from others:
function downhill(h) {
	if (h.downhill) return h.downhill;

	function downfrom(i) {
		if (isedge(h.mesh, i)) return -2;
		var best = -1;
		var besth = h[i];
		var nbs = neighbours(h.mesh, i);
		for (var j = 0; j < nbs.length; j++) {
			if (h[nbs[j]] < besth) {
				besth = h[nbs[j]];
				best = nbs[j];
			}
		}
		return best;
	}

	var downs = [];
	for (var i = 0; i < h.length; i++) {
		downs[i] = downfrom(i);
	}
	h.downhill = downs;
	return downs;
}
/*
function findSinks(h) {
	var dh = downhill(h);
	var sinks = [];
	for (var i = 0; i < dh.length; i++) {
		var node = i;
		while (true) {
			if (isedge(h.mesh, node)) {
				sinks[i] = -2;
				break;
			}
			if (dh[node] == -1) {
				sinks[i] = node;
				break;
			}
			node = dh[node];
		}
	}
}
*/
// Fill in land depressions in the heightmap, so lakes are not formed:
function fillSinks(h, epsilon) {
	epsilon = epsilon || 1e-5;
	var infinity = 999999;
	var newh = zero(h.mesh);
	for (var i = 0; i < h.length; i++) {
		if (isnearedge(h.mesh, i)) {
			newh[i] = h[i];
		} else {
			newh[i] = infinity;
		}
	}
	while (true) {
		var changed = false;
		for (var i = 0; i < h.length; i++) {
			if (newh[i] === h[i]) continue;
			var nbs = neighbours(h.mesh, i);
			for (var j = 0; j < nbs.length; j++) {
				if (h[i] >= newh[nbs[j]] + epsilon) {
					newh[i] = h[i];
					changed = true;
					break;
				}
				var oh = newh[nbs[j]] + epsilon;
				if ((newh[i] > oh) && (oh > h[i])) {
					newh[i] = oh;
					changed = true;
				}
			}
		}
		if (!changed) return newh;
	}
}

function getFlux(h) {
	var dh = downhill(h);
	var idxs = [];
	var flux = zero(h.mesh);
	for (var i = 0; i < h.length; i++) {
		idxs[i] = i;
		flux[i] = 1/h.length;
	}
	idxs.sort(function (a, b) {
		return h[b] - h[a];
	});
	for (var i = 0; i < h.length; i++) {
		var j = idxs[i];
		if (dh[j] >= 0) {
			flux[dh[j]] += flux[j];
		}
	}
	return flux;
}

function getSlope(h) {
	var dh = downhill(h);
	// Clone mesh:
	var slope = zero(h.mesh);
	for (var i = 0; i < h.length; i++) {
		var s = trislope(h, i);
		slope[i] = Math.sqrt(s[0] * s[0] + s[1] * s[1]);
		continue;
		if (dh[i] < 0) {
			slope[i] = 0;
		} else {
			slope[i] = (h[i] - h[dh[i]]) / distance(h.mesh, i, dh[i]);
		}
	}
	return slope;
}

function erosionRate(h) {
	var flux = getFlux(h);
	var slope = getSlope(h);
	var newh = zero(h.mesh);
	for (var i = 0; i < h.length; i++) {
		var river = Math.sqrt(flux[i]) * slope[i];
		var creep = slope[i] * slope[i];
		var total = 1000 * river + creep;
		total = total > 200 ? 200 : total;
		newh[i] = total;
	}
	return newh;
}

function erode(h, amount) {
	var er = erosionRate(h);
	var newh = zero(h.mesh);
	var maxr = d3.max(er);
	for (var i = 0; i < h.length; i++) {
		newh[i] = h[i] - amount * (er[i] / maxr);
	}
	return newh;
}

// Model the effect of water erosion on the land and coast:
function doErosion(h, amount, n) {
	n = n || 1;
	h = fillSinks(h);
	for (var i = 0; i < n; i++) {
		h = erode(h, amount);
		h = fillSinks(h);
	}
	return h;
}

// Set the map's sea level to a specific quantile:
function setSeaLevel(h, q) {
	var newh = zero(h.mesh);
	var delta = quantile(h, q);
	for (var i = 0; i < h.length; i++) {
		newh[i] = h[i] - delta;
	}
	return newh;
}

// Smooth cell height along the coastline. Looks neater:
function cleanCoast(h, iters) {
	for (var iter = 0; iter < iters; iter++) {
		var changed = 0;
		var newh = zero(h.mesh);
		for (var i = 0; i < h.length; i++) {
			newh[i] = h[i];
			var nbs = neighbours(h.mesh, i);
			if (h[i] <= 0 || nbs.length !== 3) continue;
			var count = 0;
			var best = -999999;
			for (var j = 0; j < nbs.length; j++) {
				if (h[nbs[j]] > 0) {
					count++;
				} else if (h[nbs[j]] > best) {
					best = h[nbs[j]];
				}
			}
			if (count > 1) continue;
			newh[i] = best / 2;
			changed++;
		}
		h = newh;
		newh = zero(h.mesh);
		for (var i = 0; i < h.length; i++) {
			newh[i] = h[i];
			var nbs = neighbours(h.mesh, i);
			if (h[i] > 0 || nbs.length !== 3) continue;
			var count = 0;
			var best = 999999;
			for (var j = 0; j < nbs.length; j++) {
				if (h[nbs[j]] <= 0) {
					count++;
				} else if (h[nbs[j]] < best) {
					best = h[nbs[j]];
				}
			}
			if (count > 1) continue;
			newh[i] = best / 2;
			changed++;
		}
		h = newh;
	}
	return h;
}

function trislope(h, i) {
	var nbs = neighbours(h.mesh, i);
	if (nbs.length !== 3) return [0,0];
	var p0 = h.mesh.vxs[nbs[0]];
	var p1 = h.mesh.vxs[nbs[1]];
	var p2 = h.mesh.vxs[nbs[2]];

	var x1 = p1[0] - p0[0];
	var x2 = p2[0] - p0[0];
	var y1 = p1[1] - p0[1];
	var y2 = p2[1] - p0[1];

	var det = x1 * y2 - x2 * y1;
	var h1 = h[nbs[1]] - h[nbs[0]];
	var h2 = h[nbs[2]] - h[nbs[0]];

	return [
		(y2 * h1 - y1 * h2) / det,
		(-x2 * h1 + x1 * h2) / det
	];
}

// Get all coastal edges:
function coastEdges(h, seaLevel) {
	seaLevel = seaLevel || 0;
	var edges = [];
	for (var i = 0; i < h.mesh.edges.length; i++) {
		var e = h.mesh.edges[i];
		if (e[3] === undefined) continue;
		//if (isnearedge(h.mesh, e[0]) || isnearedge(h.mesh, e[1])) continue;
		// Check seaLevel crossings:
		var p1Above = h[e[0]] > seaLevel,
			p2Below = h[e[1]] <= seaLevel,
			p2Above = h[e[1]] > seaLevel,
			p1Below = h[e[0]] <= seaLevel;
		if ((p1Above && p2Below) || (p1Below && p2Above)) {
			edges.push([e[2], e[3]]);
		}
	}
	return edges;
}

// Get all coastal points:
function coastPoints(h, seaLevel) {
	// Just use first point of every edge (hopefully no dupes?)
	// TODO: take all the points and make a set
	return coastEdges(h, seaLevel).map(e => e[0]);
}

// Merge all edges which cross the sea level line:
function contour(h, seaLevel) {
	return mergeSegments(coastEdges(h, seaLevel));
}

// Return ratio of land to sea (0.5 is ideal):
function landSeaRatio(h, seaLevel) {
	seaLevel = seaLevel || 0.5;
	var landTris = h.filter(t => t > seaLevel),
		seaTris = h.filter(t => t < seaLevel);
	return landTris.length / seaTris.length;
}

// Calculate rivers for the heightmap:
function getRivers(h, limit) {
	var dh = downhill(h);
	var flux = getFlux(h);
	var links = [];
	var above = 0;
	for (var i = 0; i < h.length; i++) {
		if (h[i] > 0) above++;
	}
	limit *= above / h.length;
	for (var i = 0; i < dh.length; i++) {
		if (isnearedge(h.mesh, i)) continue;
		if (flux[i] > limit && h[i] > 0 && dh[i] >= 0) {
			var up = h.mesh.vxs[i];
			var down = h.mesh.vxs[dh[i]];
			if (h[dh[i]] > 0) {
				links.push([up, down]);
			} else {
				links.push([up, [(up[0] + down[0])/2, (up[1] + down[1])/2]]);
			}
		}
	}
	return mergeSegments(links).map(relaxPath);
}

/*
function getTerritories(render) {
	var h = render.h;
	var cities = render.cities;
	var n = render.params.nterrs;
	if (n > render.cities.length) n = render.cities.length;
	var flux = getFlux(h);
	var terr = [];
	var queue = new PriorityQueue({comparator: function (a, b) {return a.score - b.score}});
	function weight(u, v) {
		var horiz = distance(h.mesh, u, v);
		var vert = h[v] - h[u];
		if (vert > 0) vert /= 10;
		var diff = 1 + 0.25 * Math.pow(vert/horiz, 2);
		diff += 100 * Math.sqrt(flux[u]);
		if (h[u] <= 0) diff = 100;
		if ((h[u] > 0) !== (h[v] > 0)) return 1000;
		return horiz * diff;
	}
	for (var i = 0; i < n; i++) {
		terr[cities[i]] = cities[i];
		var nbs = neighbours(h.mesh, cities[i]);
		for (var j = 0; j < nbs.length; j++) {
			queue.queue({
				score: weight(cities[i], nbs[j]),
				city: cities[i],
				vx: nbs[j]
			});
		}
	}
	while (queue.length) {
		var u = queue.dequeue();
		if (terr[u.vx] !== undefined) continue;
		terr[u.vx] = u.city;
		var nbs = neighbours(h.mesh, u.vx);
		for (var i = 0; i < nbs.length; i++) {
			var v = nbs[i];
			if (terr[v] !== undefined) continue;
			var newdist = weight(u.vx, v);
			queue.queue({
				score: u.score + newdist,
				city: u.city,
				vx: v
			});
		}
	}
	terr.mesh = h.mesh;
	return terr;
}
*/

/*
function getBorders(render) {
	var terr = render.terr;
	var h = render.h;
	var edges = [];
	for (var i = 0; i < terr.mesh.edges.length; i++) {
		var e = terr.mesh.edges[i];
		if (e[3] === undefined) continue;
		if (isnearedge(terr.mesh, e[0]) || isnearedge(terr.mesh, e[1])) continue;
		if (h[e[0]] < 0 || h[e[1]] < 0) continue;
		if (terr[e[0]] !== terr[e[1]]) {
			edges.push([e[2], e[3]]);
		}
	}
	return mergeSegments(edges).map(relaxPath);
}
*/

function mergeSegments(segs) {
	var adj = {};
	for (var i = 0; i < segs.length; i++) {
		var seg = segs[i];
		var a0 = adj[seg[0]] || [];
		var a1 = adj[seg[1]] || [];
		a0.push(seg[1]);
		a1.push(seg[0]);
		adj[seg[0]] = a0;
		adj[seg[1]] = a1;
	}
	var done = [];
	var paths = [];
	var path = null;
	while (true) {
		if (path === null) {
			for (var i = 0; i < segs.length; i++) {
				if (done[i]) continue;
				done[i] = true;
				path = [segs[i][0], segs[i][1]];
				break;
			}
			if (path === null) break;
		}
		var changed = false;
		for (var i = 0; i < segs.length; i++) {
			if (done[i]) continue;
			if (adj[path[0]].length === 2 && segs[i][0] === path[0]) {
				path.unshift(segs[i][1]);
			} else if (adj[path[0]].length === 2 && segs[i][1] === path[0]) {
				path.unshift(segs[i][0]);
			} else if (adj[path[path.length - 1]].length === 2 && segs[i][0] === path[path.length - 1]) {
				path.push(segs[i][1]);
			} else if (adj[path[path.length - 1]].length === 2 && segs[i][1] === path[path.length - 1]) {
				path.push(segs[i][0]);
			} else {
				continue;
			}
			done[i] = true;
			changed = true;
			break;
		}
		if (!changed) {
			paths.push(path);
			path = null;
		}
	}
	return paths;
}

// Smooth a path by averaging points:
function relaxPath(path) {
	var newpath = [path[0]];
	for (var i = 1; i < path.length - 1; i++) {
		// Calculate new x & y as a weighted average:
		var newpt = [
			0.25 * path[i-1][0] + 0.5 * path[i][0] + 0.25 * path[i+1][0],
			0.25 * path[i-1][1] + 0.5 * path[i][1] + 0.25 * path[i+1][1]
		];
		newpath.push(newpt);
	}
	newpath.push(path[path.length - 1]);
	return newpath;
}

// Plot circles on the svg:
function visualizePoints(svg, points, showDebugText = false) {
	// Remove group if present:
	svg.select("g#visualizedPoints").remove();
	var outerG = svg.append('g').attr('id', "visualizedPoints");
	// Bind pts data:
	var bound = outerG.selectAll('circle').data(points);

	// For each data point make a group containing circle and (optionally) text
	var groups = bound.enter();
	var innerG = groups.append('g')
		.attr("transform", function (d) {return "translate("+ 1000*d[0]+","+ 1000*d[1]+")"; })
		.attr('title', function (d,i) { return i; })
		;
	var ptRadius = 100 / Math.sqrt(points.length);
	innerG.append('circle')
		.attr('r', ptRadius)
		.attr('id', function(d,i) { return 'pt_'+i; })
		.classed('clickable', true)
		.style('fill', 'yellow')
		//.style('stroke', 'blue')
		.on('click', function(d,i) {
			console.log('index', i, 'height', d[i]);
		})
		;
	if (showDebugText) {
		innerG.append('text')
			.style('color', 'black')
			.style('pointerEvents', 'none')
			.text(function(d,i) { return i; });
	}
	// Cleanup:
	groups.exit().remove();
}

// Colour the svg circles according to height:
function colorizePoints(svg, h) {
	svg.selectAll('circle')
	.data(h)
	.style('fill', function(d) {
		return d3.interpolateViridis(d);
	});
}

// Add classes to svg nodes: sea, coast or land:
function classifyPoints(svg, h) {
	svg.selectAll("circle")
		.classed('land', function(d,i) {
			return h[i];// difficult to do...
		});
}

function visualizeCentroids(svg, h, lo, hi) {
	if (hi === undefined) hi = d3.max(h) + 1e-9;
	if (lo === undefined) lo = d3.min(h) - 1e-9;

	var mappedvals = h.map(function (x) {
		return x > hi ? 1 : x < lo ? 0 : (x - lo) / (hi - lo);
	});

	// Remove group if present:
	svg.select("g#visualizedCentroids").remove();
	var outerG = svg.append('g').attr('id', "visualizedCentroids");
	// Bind pts data:
	var bound = outerG.selectAll('circle').data(h.mesh.vor.cells);

	var ptRadius = 100 / Math.sqrt(h.mesh.vor.cells.length);
	// For each data point make a group containing circle and (optionally) text
	var groups = bound.enter();
	groups.append('circle')
		.attr("transform", function (d) {return "translate("+ 1000*d.site[0]+","+ 1000*d.site[1]+")"; })
		.attr('r', ptRadius)
		.attr('id', function(d,i) { return 'cent_'+i; })
		.classed('clickable', true)
		// A Voronoi polygon can only be land or sea. Points can also be coast or city.
		.classed('land', function(d,i) {
			return (mappedvals[i] > 0.5);
		})
		.classed('sea', function(d,i) {
			return (mappedvals[i] < 0.5);
		})
		.style('fill', 'lawngreen')
		.on('click', function(d,i) {
			console.log('index', i, 'height', mappedvals[i]);	// not the right data!
		})
		;
	// Cleanup:
	groups.exit().remove();
}

// Convert a path (array of points) to svg string format:
function makeD3Path(path) {
	var p = d3.path();
	p.moveTo(1000*path[0][0], 1000*path[0][1]);
	for (var i = 1; i < path.length; i++) {
		p.lineTo(1000*path[i][0], 1000*path[i][1]);
	}
	return p.toString();
}

// Add triangles to the SVG representing Voronoi cells:
function visualizeVoronoi(svg, field, lo, hi) {
	if (hi === undefined) hi = d3.max(field) + 1e-9;
	if (lo === undefined) lo = d3.min(field) - 1e-9;

	var mappedvals = field.map(function (x) {
		return x > hi ? 1 : x < lo ? 0 : (x - lo) / (hi - lo);
	});

	// Remove group if present:
	svg.select("g#visualizedVoronoi").remove();
	var g = svg.append('g').attr('id', "visualizedVoronoi");
	var tris = g.selectAll('path.field')
		.data(field.mesh.tris);

	tris.enter()
		.append('path')
		.classed('field', true)
		// A Voronoi polygon can only be land or sea. Points can also be coast or city.
		.classed('land', function(d,i) {
			return (mappedvals[i] > 0.5);
		})
		.classed('sea', function(d,i) {
			return (mappedvals[i] < 0.5);
		});

	tris.exit()
		.remove();

	console.log(d3.max(mappedvals), d3.min(mappedvals), mappedvals.length);

	svg.selectAll('path.field')
		.attr('d', makeD3Path)
		.style('fill', function (d, i) {
			//return d3.interpolateViridis(mappedvals[i]);
			var colorScale = d3.scaleLinear()
				.domain([1, 0.5, 0])	// max, pivot, min
				.range(["goldenrod", "lemonchiffon", "dodgerblue"]);

			var colorScale2 = d3.scaleLinear()
				.domain([0,1])
				.interpolate(d3.interpolateHcl)
				.range([d3.rgb("#007AFF"), d3.rgb('#FFF500')]);

			return colorScale(mappedvals[i]);	// defines colour scale of entire map
		})
		.on('click', function(d, i) {
			console.log('index', i, 'height', mappedvals[i]);
		});
}

function visualizeDownhill(h) {
	var links = getRivers(h, 0.01);
	drawPaths('river', links);
}

// Add path elements to the svg:
function drawPaths(svg, className, paths) {
	// Remove group if present:
	svg.select("g#"+className+"Paths").remove();
	var outerG = svg.append('g').attr('id', className+'Paths');
	var $bound = outerG.selectAll('path.' + className).data(paths);
	$bound.enter()
		.append('path')
		.classed(className, true);
	$bound.exit()
		.remove();
	outerG.selectAll('path.' + className)
		.attr('d', makeD3Path);
}

// Draw little slope lines on the hills:
function visualizeSlopes(svg, render) {
	var h = render.h;
	var strokes = [];
	var r = 0.25 / Math.sqrt(h.length);
	for (var i = 0; i < h.length; i++) {
		if (h[i] <= 0 || isnearedge(h.mesh, i)) continue;
		var nbs = neighbours(h.mesh, i);
		nbs.push(i);
		var s = 0;
		var s2 = 0;
		for (var j = 0; j < nbs.length; j++) {
			var slopes = trislope(h, nbs[j]);
			s += slopes[0] / 10;
			s2 += slopes[1];
		}
		s /= nbs.length;
		s2 /= nbs.length;
		if (Math.abs(s) < randomFrom(0.1, 0.4)) continue;
		var l = r * randomFrom(1, 2) * (1 - 0.2 * Math.pow(Math.atan(s), 2)) * Math.exp(s2/100);
		var x = h.mesh.vxs[i][0];
		var y = h.mesh.vxs[i][1];
		if (Math.abs(l*s) > 2 * r) {
			var n = Math.floor(Math.abs(l*s/r));
			l /= n;
			if (n > 4) n = 4;
			for (var j = 0; j < n; j++) {
				var u = rnorm() * r;
				var v = rnorm() * r;
				strokes.push([[x+u-l, y+v+l*s], [x+u+l, y+v-l*s]]);
			}
		} else {
			strokes.push([[x-l, y+l*s], [x+l, y-l*s]]);
		}
	}

	// Remove group if present:
	svg.select("g#slopes").remove();
	var outerG = svg.append('g').attr('id', 'slopes');
	var lines = outerG.selectAll('line.slope').data(strokes);
	lines.enter()
	.append('line')
	.classed('slope', true);
	lines.exit()
	.remove();
	outerG.selectAll('line.slope')
	.attr('x1', function (d) {return 1000*d[0][0];})
	.attr('y1', function (d) {return 1000*d[0][1];})
	.attr('x2', function (d) {return 1000*d[1][0];})
	.attr('y2', function (d) {return 1000*d[1][1];});
}

// Draw the coastline on paths with height 0:
function visualizeContour(h, level) {
	level = level || 0;
	var links = contour(h, level);
	drawPaths('coast', links);
}

/*
function visualizeBorders(h, cities, n) {
	var links = getBorders(h, getTerritories(h, cities, n));
	drawPaths('border', links);
}
*/

// Calculate city viability score for each point in the mesh:
function cityScores(h, cities) {
	var scores = map(getFlux(h), Math.sqrt);
	// Discard names:
	cities = cities.map(c => c.ptIndex);
	// TODO: simply place cities on coasts
	for (var i = 0; i < h.length; i++) {
		// No cities near edges:
		if (h[i] <= 0 || isnearedge(h.mesh, i)) {
			scores[i] = -999999;
			continue;
		}
		else {
			scores[i] += 0.01 / (1e-9 + Math.abs(h.mesh.vxs[i][0]) - h.mesh.extent.width/2);
			scores[i] += 0.01 / (1e-9 + Math.abs(h.mesh.vxs[i][1]) - h.mesh.extent.height/2);
			// Make a "well" around the city to avoid close cities:
			for (var j = 0; j < cities.length; j++) {
				scores[i] -= 0.02 / (distance(h.mesh, cities[j], i) + 1e-9);
			}
		}
	}
	//console.log('cityScores', scores);
	return scores;
}

// Find the best location for the next city to be added:
// Pass in Town object so as to attach name to be rendered
function placeCity(render, t) {
	render.cities = render.cities || [];
	// Recalculate city scores:
	var scores = cityScores(render.h, render.cities);
	// Get highest score:
	var newcityIndex = d3.scan(scores, d3.descending);
	console.log('topCity', newcityIndex);

	render.cities.push({
		ptIndex: newcityIndex,
		name: t.name
	});
}

// Find locations for all desired cities:
function placeCities(render) {
	var params = render.params;
	var h = render.h;	// UNUSED h
	var n = params.ncities;
	for (var i = 0; i < n; i++) {
		placeCity(render);
	}
}

// Draw a dot for each placed city, attach behaviours:
function visualizeCities(svg, render) {
	var cities = render.cities;
	var h = render.h;
	var n = render.params.nterrs;

	// Remove group if present:
	svg.select("g#cities").remove();
	var outerG = svg.append('g').attr('id', "cities");
	// Bind pts data:
	var circs = outerG.selectAll('circle.city').data(cities);
	circs.enter()
		.append('circle')
		.classed('city', true);
	circs.exit()
		.remove();
	svg.selectAll('circle.city')
		.attr('cx', function (d) {return 1000*h.mesh.vxs[d.ptIndex][0];})
		.attr('cy', function (d) {return 1000*h.mesh.vxs[d.ptIndex][1];})
		.attr('r', function (d, i) {return i >= n ? 5 : 8;})	// allow n capitals and then minor towns
		.attr('data-name', function (d) {return d.name;})
		.style('fill', 'red')
		.style('stroke-width', 5)
		.style('stroke-linecap', 'round')
		.style('stroke', 'black')
		.raise()
		.on('click', function(d) {
			console.log(d.ptIndex, d.name);	// city clicked, logs html / id
		})
		.on('mouseover', function(d) {
			d3.select(this).style('fill', 'yellow');
		})
		.on('mouseout', function(d) {
			d3.select(this).style('fill', 'red');
		});
}

/*
function dropEdge(h, p) {
	p = p || 4;
	var newh = zero(h.mesh);
	for (var i = 0; i < h.length; i++) {
		var v = h.mesh.vxs[i];
		var x = 2.4*v[0] / h.mesh.extent.width;
		var y = 2.4*v[1] / h.mesh.extent.height;
		newh[i] = h[i] - Math.exp(10*(Math.pow(Math.pow(x, p) + Math.pow(y, p), 1/p) - 1));
	}
	return newh;
}
*/

// Main map generator used for final maps:
function generateCoast(params) {
	var mesh = generateGoodMesh(params.npts, params.extent);
	// Make two opposite slopes:
	var rVec1 = randomVector(3);
		//rVec2 = [-rVec1[0], -rVec1[1]];

	var h = add(
		slope(mesh, rVec1),
		//slope(mesh, rVec2),
		cone(mesh, randomFrom(-1, -1)),	// random slope
		// Multiple sets of mountains so they can superimpose:
		//mountains(mesh, 20),
		//mountains(mesh, 20),
		//mountains(mesh, 20),
		mountains(mesh, 20)
	);
	// Average heightmap several times:
	for (var i = 0; i < 10; i++) {
		h = relax(h);
	}
	h = peaky(h);
	// Erode terrain:
	h = doErosion(h, randomFrom(0, 0.1), 2);	//5
	h = setSeaLevel(h, randomFrom(0.2, 0.6));
	h = fillSinks(h);

	//h = normalize(h);
	// Smooth coast:
	h = cleanCoast(h, 3);

	return h;
}

// Average all city sites?
function terrCenter(h, terr, city, landOnly) {
	var xsum = 0;
	var ysum = 0;
	var n = 0;
	for (var i = 0; i < terr.length; i++) {
		if (terr[i] !== city) continue;
		if (landOnly && h[i] <= 0) continue;
		xsum += terr.mesh.vxs[i][0];
		ysum += terr.mesh.vxs[i][1];
		n++;
	}
	return [xsum/n, ysum/n];
}

// Apply text labels to the render:
function drawLabels(svg, render) {
	var params = render.params;
	var h = render.h;
	var terr = render.terr;
	var cities = render.cities;
	var nterrs = render.params.nterrs;
	var avoids = [render.rivers, render.coasts];//, render.borders];

	var lang = makeRandomLanguage();	// TODO: replace with static list
	console.log('lang', lang);
	var citylabels = [];

	// Penalise non-optimal label placements:
	function penalty(label) {
		var pen = 0;
		// Penalise close to edges:
		if (label.x0 < -0.45 * h.mesh.extent.width) pen += 100;
		if (label.x1 > 0.45 * h.mesh.extent.width) pen += 100;
		if (label.y0 < -0.45 * h.mesh.extent.height) pen += 100;
		if (label.y1 > 0.45 * h.mesh.extent.height) pen += 100;
		// Penalise touching other labels:
		for (var i = 0; i < citylabels.length; i++) {
			var olabel = citylabels[i];
			if (label.x0 < olabel.x1 && label.x1 > olabel.x0 &&
			label.y0 < olabel.y1 && label.y1 > olabel.y0) {
				pen += 100;
			}
		}

		for (var i = 0; i < cities.length; i++) {
			var c = h.mesh.vxs[cities[i].ptIndex];
			if (label.x0 < c[0] && label.x1 > c[0] && label.y0 < c[1] && label.y1 > c[1]) {
				pen += 100;
			}
		}
		for (var i = 0; i < avoids.length; i++) {
			var avoid = avoids[i];
			for (var j = 0; j < avoid.length; j++) {
				var avpath = avoid[j];
				for (var k = 0; k < avpath.length; k++) {
					var pt = avpath[k];
					if (pt[0] > label.x0 && pt[0] < label.x1 && pt[1] > label.y0 && pt[1] < label.y1) {
						pen++;
					}
				}
			}
		}
		return pen;
	}

	function drawCityLabels() {
		for (var i = 0; i < cities.length; i++) {
			var cityIndex = cities[i].ptIndex;
			var x = h.mesh.vxs[cityIndex][0];
			var y = h.mesh.vxs[cityIndex][1];
			//var text = makeName(lang, 'city');	// TODO: replace with city name
			var text = cities[i].name;
			var size = i < nterrs ? params.fontsizes.city : params.fontsizes.town;
			var sx = 0.65 * (size/1000) * text.length;
			var sy = size/1000;
			var possLabels = [
				{
					x: x + 0.8 * sy,
					y: y + 0.3 * sy,
					align: 'start',
					x0: x + 0.7 * sy,
					y0: y - 0.6 * sy,
					x1: x + 0.7 * sy + sx,
					y1: y + 0.6 * sy
				},
				{
					x: x - 0.8 * sy,
					y: y + 0.3 * sy,
					align: 'end',
					x0: x - 0.9 * sy - sx,
					y0: y - 0.7 * sy,
					x1: x - 0.9 * sy,
					y1: y + 0.7 * sy
				},
				{
					x: x,
					y: y - 0.8 * sy,
					align: 'middle',
					x0: x - sx/2,
					y0: y - 1.9*sy,
					x1: x + sx/2,
					y1: y - 0.7 * sy
				},
				{
					x: x,
					y: y + 1.2 * sy,
					align: 'middle',
					x0: x - sx/2,
					y0: y + 0.1*sy,
					x1: x + sx/2,
					y1: y + 1.3*sy
				}
			];
			// Select optimal label site:
			var topSiteId = d3.scan(possLabels, function (a, b) {
				return penalty(a) - penalty(b);
			});
			var label = possLabels[topSiteId];
			label.text = text;
			label.size = size;
			citylabels.push(label);
		}
		var texts = svg.selectAll('text.city').data(citylabels);
		texts.enter()
		.append('text')
		.classed('city', true);
		texts.exit()
		.remove();
		svg.selectAll('text.city')
		.attr('x', function (d) {return 1000*d.x;})
		.attr('y', function (d) {return 1000*d.y;})
		.style('font-size', function (d) {return d.size;})
		.style('text-anchor', function (d) {return d.align;})
		.text(function (d) {return d.text;})
		.raise();
	}

	function drawRegionLabels() {
		var regionLabels = [];
		for (var i = 0; i < nterrs; i++) {
			var city = cities[i];
			var text = makeName(lang, 'region');
			var sy = params.fontsizes.region / 1000;
			var sx = 0.6 * text.length * sy;
			var lc = terrCenter(h, terr, city, true);
			var oc = terrCenter(h, terr, city, false);
			var best = 0;
			var bestscore = -999999;
			for (var j = 0; j < h.length; j++) {
				var score = 0;
				var v = h.mesh.vxs[j];
				score -= 3000 * Math.sqrt((v[0] - lc[0]) * (v[0] - lc[0]) + (v[1] - lc[1]) * (v[1] - lc[1]));
				score -= 1000 * Math.sqrt((v[0] - oc[0]) * (v[0] - oc[0]) + (v[1] - oc[1]) * (v[1] - oc[1]));
				if (terr[j] !== city) score -= 3000;
				for (var k = 0; k < cities.length; k++) {
					var u = h.mesh.vxs[cities[k]];
					if (Math.abs(v[0] - u[0]) < sx &&
					Math.abs(v[1] - sy/2 - u[1]) < sy) {
						score -= k < nterrs ? 4000 : 500;
					}
					if (v[0] - sx/2 < citylabels[k].x1 &&
						v[0] + sx/2 > citylabels[k].x0 &&
						v[1] - sy < citylabels[k].y1 &&
						v[1] > citylabels[k].y0) {
						score -= 5000;
					}
				}
				for (var k = 0; k < regionLabels.length; k++) {
					var label = regionLabels[k];
					if (v[0] - sx/2 < label.x + label.width/2 &&
						v[0] + sx/2 > label.x - label.width/2 &&
						v[1] - sy < label.y &&
						v[1] > label.y - label.size) {
						score -= 20000;
					}
				}
				if (h[j] <= 0) score -= 500;
				if (v[0] + sx/2 > 0.5 * h.mesh.extent.width) score -= 50000;
				if (v[0] - sx/2 < -0.5 * h.mesh.extent.width) score -= 50000;
				if (v[1] > 0.5 * h.mesh.extent.height) score -= 50000;
				if (v[1] - sy < -0.5 * h.mesh.extent.height) score -= 50000;
				if (score > bestscore) {
					bestscore = score;
					best = j;
				}
			}
			regionLabels.push({
				text: text,
				x: h.mesh.vxs[best][0],
				y: h.mesh.vxs[best][1],
				size:sy,
				width:sx
			});
		}
		var texts = svg.selectAll('text.region').data(regionLabels);
		texts.enter()
		.append('text')
		.classed('region', true);
		texts.exit()
		.remove();
		svg.selectAll('text.region')
		.attr('x', function (d) {return 1000*d.x;})
		.attr('y', function (d) {return 1000*d.y;})
		.style('font-size', function (d) {return 1000*d.size;})
		.style('text-anchor', 'middle')
		.text(function (d) {return d.text;})
		.raise();
	}

	drawCityLabels();
	//drawRegionLabels();
}

// Render the map:
function drawMap(svg, render) {
	render.rivers = getRivers(render.h, 0.01);
	render.coasts = contour(render.h, 0);
	//render.terr = getTerritories(render);
	//render.borders = getBorders(render);
	drawPaths(svg, 'river', render.rivers);
	drawPaths(svg, 'coast', render.coasts);
	//drawPaths(svg, 'border', render.borders);
	visualizeSlopes(svg, render);
	visualizeCities(svg, render);
	drawLabels(svg, render);
}

// Put a map in an existing svg element:
function doMap(svg, params) {
	var render = {
		params: params
	};
	var width = svg.attr('width');
	svg.attr('height', width * params.extent.height / params.extent.width);
	svg.attr('viewBox', -1000 * params.extent.width/2 + ' ' +
						-1000 * params.extent.height/2 + ' ' +
						1000 * params.extent.width + ' ' +
						1000 * params.extent.height);
	svg.selectAll().remove();
	render.h = params.generator(params);
	placeCities(render);
	drawMap(svg, render);
}

var defaultParams = {
	extent: defaultExtent,
	generator: generateCoast,
	npts: 16384,
	ncities: 15,
	nterrs: 5,
	fontsizes: {
		region: 40,
		city: 25,
		town: 20
	},
	colours: []	// specify my own here?
};
