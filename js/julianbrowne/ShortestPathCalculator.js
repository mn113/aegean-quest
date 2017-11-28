/* global d3, SpUtils, PriorityQueue */
/*
*
* Dijkstra Short Path Calculator and Graph Plotter
* Uses D3 JS (V3)
*
*/

const infinity = 999999;  // larger than largest distance in distances array


var ShortestPathCalculator = function(nodes, paths) {

	this.nodes = nodes; // nodes => [ { index: 0, value: 'a', r: 20, coords: [0,0] }, ... ]
	this.paths = paths; // paths => [ { source: 0, target: 1, distance: 150 }, ... ]
	this.distances = []; // [ [ x, 100, 150 ], [ 100, x, 10] ]
	this.graph = {};

	var maxNodes = 17000;
	var minNodes = 3;

	if (!d3) throw new ShortestPathCalculator.SpcError(10, 'D3 library not found');

	if (!nodes.length || nodes.length < minNodes) {
		throw new ShortestPathCalculator.SpcError(11, 'Insufficient nodes => ' + JSON.stringify(nodes) );
	}
	else if (nodes.length > maxNodes) {
		throw new ShortestPathCalculator.SpcError(11, 'Too many nodes => ' + JSON.stringify(nodes) );
	}
};

ShortestPathCalculator.isInteger = function(i) {
	return /^\d+$/.test(i);
};

ShortestPathCalculator.SpcError = function(code, message) {
	console.log(message);
	//alert(message);
	return { code: code, message: message };
};

ShortestPathCalculator.prototype.init = function() {
	this.makeDistanceArrayFromNodes();
	this.populateDistances();
	this.linkedNodes = this.buildLinksGraph();	// slooow
	return this;
};

ShortestPathCalculator.prototype.findRoute = function(source, target) {
	// Is input valid?
	if (!ShortestPathCalculator.isInteger(source) || !ShortestPathCalculator.isInteger(target))
		throw new ShortestPathCalculator.SpcError(20, "Source and target must be ints");

	if (source > this.nodes.length - 1|| target > this.nodes.length - 1)
		throw new ShortestPathCalculator.SpcError(21, "Source or target put of range");

	//this.result = this.dijkstra(source, target);
	this.result = this.aStarPath(source, target);

	return this.formatPath(this.result);
};

ShortestPathCalculator.prototype.formatPath = function(path) {
	if (!path) return {mesg: "No path found"};

	var totalDistance = 0,
		newPath = [],
		start = path[0],
		end = path[path.length - 1];

	// Convert node array (length N) to sub-path array (length N-1):
	for (var i = path.length - 1; i > 0; i--) {
		newPath.push({source: path[i], target: path[i-1]});
		totalDistance += this.distances[i][i-1];
	}
	return {mesg:'OK', path: newPath, source: start, target: end, distance:totalDistance};
};

ShortestPathCalculator.prototype.makeDistanceArrayFromNodes = function() {

	this.distances = [];

	for(var i=0; i<this.nodes.length; i++) {

		this.distances[i] = [];

		for(var j=0; j<this.nodes.length; j++){
			this.distances[i][j] = 'x';
		}
	}

};

ShortestPathCalculator.prototype.populateDistances = function() {

	for(var i=0; i<this.paths.length; i++) {

		var s = parseInt(this.paths[i].source);
		var t = parseInt(this.paths[i].target);
		var d = parseInt(this.paths[i].distance);

		this.distances[s][t] = d;
		this.distances[t][s] = d;
	}

};

ShortestPathCalculator.prototype.buildLinksGraph = function() {
	var linkedNodes = {};
	for (var node of this.nodes) {
		if (node.coords === null) continue;
		// Initialise empty arrays:
		linkedNodes[node.index] = [];
		// Append all linked nodes:
		for (var path of this.paths) {
			// Forward way:
			if (path.source === node.index)
				linkedNodes[node.index].push(path.target);
			// Backward way:
			if (path.target === node.index)
				linkedNodes[node.index].push(path.source);
		}
	}
	console.log('links', linkedNodes);
	return linkedNodes;
};

ShortestPathCalculator.prototype.clearDiv = function(elementId) {
	var target = document.getElementById(elementId);

	if (!target) return -1;

	while (target.firstChild)
		target.removeChild(target.firstChild);

	return target;
};

ShortestPathCalculator.prototype.makeSVG = function(elementId, width, height) {

	this.graph.width  = width  ? width  : 800;
	this.graph.height = height ? height : 400;

	ShortestPathCalculator.clearDiv(elementId);

	var target = d3.select('#' + elementId);

	this.graph.svg = target.append("svg:svg")
	.attr("width", this.graph.width)
	.attr("height", this.graph.height);

};

ShortestPathCalculator.prototype.drawGraph = function(elementId, width, height) {

	if (!this.graph.svg)
		this.makeSVG(elementId, width, height);

	var that = this;

	this.nodes.forEach(function(d, i) {
		d.x = d.y = that.graph.width / that.nodes.length * i;
	});

	var force = d3.layout.force()
	.nodes(this.nodes)
	.links(this.paths)
	.charge(-500)
	.linkDistance(function(d){ return d.distance; })
	.size([this.graph.width, this.graph.height]);

	force.on("tick", function() {
		that.graph.svg.selectAll("path")
		.attr("transform", function(d) {
			return "translate(" + d.x + "," + d.y + ")";
		});
	});

	var j = this.nodes.length*20;
	force.start();
	for (var i = j * j; i > 0; --i) force.tick();
	force.stop();

	this.graph.svg.selectAll("line")
	.data(this.paths)
	.enter()
	.append("line")
	.attr("class", function(d) {
		if (that.result.path !== null) {
			for (var i = 0; i < that.result.path.length; i++) {
				if ((that.result.path[i].source === d.source.index && that.result.path[i].target === d.target.index)
				|| (that.result.path[i].source === d.target.index && that.result.path[i].target === d.source.index))
					return 'link bold';
			}
		}
		return 'link';
	})
	.attr("x1", function(d) { return d.source.x; })
	.attr("y1", function(d) { return d.source.y; })
	.attr("x2", function(d) { return d.target.x; })
	.attr("y2", function(d) { return d.target.y; });

	this.graph.svg.append("svg:g")
	.selectAll("circle")
	.data(this.nodes)
	.enter()
	.append("svg:circle")
	.attr("class", "node")
	.attr("cx", function(d) { return d.x; })
	.attr("cy", function(d) { return d.y; })
	.attr("r",  function(d) { return 15; });

	this.graph.svg.append("svg:g")
	.selectAll("text")
	.data(this.nodes)
	.enter()
	.append("svg:text")
	.attr("class", "label")
	.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
	.attr("text-anchor", "middle")
	.attr("y", ".3em")
	.text(function(d) { return d.value; });

};

ShortestPathCalculator.prototype.formatResult = function() {

	// result => {mesg:"OK", path:[0, 1, 4], distance:250}

	var res = "";

	res += "<p>Result : " + this.result.mesg + "</p>";

	if (this.result.path === null)
		return "<p>No path found from " + this.result.source + " to " + this.result.target + "</p>";

	if (this.result.path.length === 0)
		return "<p>Path is from " + SpUtils.nodeNames[this.result.source] + " to "
		+ SpUtils.nodeNames[this.result.target] + ". Expect a journey time of approximately zero.</p>";

	res += "<p>Path   : ";

	for(var i=0; i<this.result.path.length; i++) {
		var sourceNodeIndex = this.result.path[i].source;
		var targetNodeIndex = this.result.path[i].target;
		var sourceNode = this.nodes[sourceNodeIndex];
		var targetNode = this.nodes[targetNodeIndex];
		res += ' ' + sourceNode.value + ' -> ' + targetNode.value;
	}
	res += "</p>";
	res += "<p>Distance : " + this.result.distance + "</p>";

	return res;

};

/*
* Calculate shortest path between two nodes in a graph
*
* @param {Integer} start     index of node to start from
* @param {Integer} end       index of node to end at
*/
ShortestPathCalculator.prototype.dijkstra = function(start, end) {

	var nodeCount = this.distances.length,
		shortestPath = new Array(nodeCount),
		nodeChecked  = new Array(nodeCount),
		cameFrom     = new Array(nodeCount);

	// initialise data placeholders
	for(var i=0; i<nodeCount; i++) {
		shortestPath[i] = infinity;
		cameFrom[i]=null;
		nodeChecked[i]=false;
	}

	shortestPath[start]=0;

	for(var i=0; i<nodeCount; i++) {

		var minDist = infinity;
		var closestNode = null;

		// Get shortest known path to every node:
		for (var j=0; j<nodeCount; j++) {
			if (!nodeChecked[j]) {
				if (shortestPath[j] <= minDist) {
					minDist = shortestPath[j];
					closestNode = j;
				}
			}
		}

		// Visit closest node:
		nodeChecked[closestNode] = true;

		// Find next closest node:
		for(var k=0; k<nodeCount; k++) {
			if (!nodeChecked[k]){
				var nextDistance = distanceBetween(closestNode, k, this.distances);

				if ((parseInt(shortestPath[closestNode]) + parseInt(nextDistance)) < parseInt(shortestPath[k])){
					var soFar = parseInt(shortestPath[closestNode]);
					var extra = parseInt(nextDistance);

					shortestPath[k] = soFar + extra;

					cameFrom[k] = closestNode;
				}
			}
		}
	}

	if (shortestPath[end] < infinity) {
		var newPath = [];
		var step    = { target: parseInt(end) };

		var v = parseInt(end);
		//console.log('v');
		//console.log(v);

		// Track back to build up path:
		while (v>=0) {
			v = cameFrom[v];
			//console.log('v');
			//console.log(v);

			if (v!==null && v>=0) {
				step.source = v;
				newPath.unshift(step);
				step = {target: v};
			}
		}

		//console.log('SP', shortestPath);
		var totalDistance = shortestPath[end];

		return {mesg:'OK', path: newPath, source: start, target: end, distance:totalDistance};
	}
	else {
		return {mesg:'No path found', path: null, source: start, target: end, distance: 0 };
	}
};

ShortestPathCalculator.prototype.distanceBetween = function(fromNode, toNode) {
	var dist = this.distances[fromNode][toNode];
	if (dist==='x') dist = infinity;
	return dist;
};

ShortestPathCalculator.prototype.manhattanHeuristic = function(fromNode, toNode) {
	// Manhattan distance:
	var dx = this.nodes[fromNode].coords[0] - this.nodes[toNode].coords[0],
		dy = this.nodes[fromNode].coords[1] - this.nodes[toNode].coords[1];
	return 1000 * (Math.abs(dx) + Math.abs(dy));
};

/*
 * Returns a list representing the optimal path between startNode and endNode or null if such a path does not exist
 * If the path exists, the order is such that elements can be popped off the path
 */
ShortestPathCalculator.prototype.aStarPath = function (startNode, goalNode) {
	// Priority Queue (https://github.com/STRd6/PriorityQueue.js)
	//var frontier = PriorityQueue({low: true});	//  what have we not explored?
	// Priority Queue (https://github.com/adamhooper/js-priority-queue)
	var frontier = new PriorityQueue({ comparator: function(a, b) { return a[1] - b[1]; }});

	var explored = new Set(); // Set (https://github.com/jau/SetJS), what have we explored?

	var pathTo = {}; // A dictionary mapping from nodes to nodes, used to keep track of the path
	var gCost = {}; // A dictionary mapping from nodes to floats, used to keep track of the "G cost" associated with traveling to each node from startNode

	pathTo[startNode] = null;
	gCost[startNode] = 0.0;

	frontier.queue([startNode, 0.0]);

	// While the frontier remains unexplored:
	while (frontier.length > 0) {
		// Visit cheapest frontier node:
		var leafNode = frontier.dequeue()[0];
		console.log('visiting', leafNode);	// RUNS MANY TIMES?
		// Mark as seen:
		explored.add(leafNode);

		// Test for goal:
		if (leafNode === goalNode) {
			// We found the goal! Reconstruct the path:
			console.log('goal found!');
			var path = [];
			var pointer = goalNode;

			while (pointer !== null) {
				path.push(pointer);
				pointer = pathTo[pointer];
			}
			console.log(path);
			return path;
		}

		// Check linked nodes and add them to frontier with sum of cost (past) + heuristic (future):
		for (var nextNode of this.linkedNodes[leafNode]) {
			//var connectedNode = this.linkedNodes[leafNode][i];
			var newCost = gCost[leafNode] + this.distanceBetween(leafNode, nextNode);
			// If the next node is not yet visited, or has been but at a greater travel cost, process it:
			if (!explored.has(nextNode) || newCost < gCost[nextNode]) {
				// Set the new or lowered cost:
				gCost[nextNode] = newCost;

				var costSoFar = gCost[nextNode],
					heuristic = this.manhattanHeuristic(nextNode, goalNode);
				console.log('cost', costSoFar, 'heur', heuristic);
				// Store item as [node, cost] - will be automatically sorted by cost:
				frontier.queue([nextNode, costSoFar + heuristic]);
				// Store new preferred ancestor:
				pathTo[nextNode] = leafNode;
			}
		}
	}

	return null; // No path could be found
};
