/* global $, d3, meshTransforms, makeMesh, visualizePoints, generatePoints, improvePoints, zero, generateGoodMesh, visualizeTriangles, drawPaths, contour, add, slope, randomVector, cone, mountains, normalize, peaky, relax, setSeaLevel, randomFrom, fillSinks, erosionRate, doErosion, cleanCoast, getRivers, visualizeSlopes, generateCoast, defaultExtent, defaultParams, placeCity, cityScores, visualizeCities, coastPoints, colorizePoints, visualizeCentroids, addNaviLayer, addShipSvg, landSeaRatio, drawLabels, Town */

function addSVG(div) {
	return div.insert("svg", ":first-child")
	.attr("height", 600)
	.attr("width", 800)
	.attr("viewBox", "-200 -200 400 400");
}

var seaLevel = 0.5;	// global
var towns = [];
var svgShip;

// BASIC POINTS
//var meshDiv = d3.select("div#mesh");
//var meshSVG = addSVG(meshDiv);

var meshPts = null;
var meshVxs = null;
var meshDual = false;
/*
function meshDraw() {
	if (meshDual && !meshVxs) {
		meshVxs = makeMesh(meshPts).vxs;
	}
	visualizePoints(meshSVG, meshDual ? meshVxs : meshPts);
}

(function() {
	meshDiv.append("br");

	meshDiv.append("button")
	.text("Generate random points")
	.on("click", function () {
		meshDual = false;
		meshVxs = null;
		meshPts = generatePoints(256);
		meshDraw();
	});

	meshDiv.append("button")
	.text("Improve points")
	.on("click", function () {
		meshPts = improvePoints(meshPts);
		meshVxs = null;
		meshDraw();
	});

	var vorBut = meshDiv.append("button")
	.text("Show Voronoi corners")
	.on("click", function () {
		meshDual = !meshDual;
		if (meshDual) {
			vorBut.text("Show original points");
		} else {
			vorBut.text("Show Voronoi corners");
		}
		meshDraw();
	});
}());
*/

// PRIMITIVES
var primDiv = d3.select("div#prim");
var primSVG = addSVG(primDiv);

var primH = zero(generateGoodMesh(4096));

function primDraw() {
	visualizeTriangles(primSVG, primH, -1, 1);
	drawPaths(primSVG, 'coast', contour(primH, 0));
}
//primDraw();

(function() {
	primDiv.append("br");

	primDiv.append("button")
	.text("Reset to flat")
	.on("click", function () {
		primH = zero(primH.mesh);
		primDraw();
	});

	primDiv.append("button")
	.text("Add random slope")
	.on("click", function () {
		primH = add(primH, slope(primH.mesh, randomVector(4)));
		primDraw();
	});

	primDiv.append("button")
	.text("Add land @ top")
	.on("click", function () {
		primH = add(primH, meshTransforms.edgeLand(primH.mesh, 'top'));
		primDraw();
	});

	primDiv.append("button")
	.text("Add land @ bottom")
	.on("click", function () {
		primH = add(primH, meshTransforms.edgeLand(primH.mesh, 'bottom'));
		primDraw();
	});

	primDiv.append("button")
	.text("Add land @ right")
	.on("click", function () {
		primH = add(primH, meshTransforms.edgeLand(primH.mesh, 'right'));
		primDraw();
	});

	primDiv.append("button")
	.text("Add land @ left")
	.on("click", function () {
		primH = add(primH, meshTransforms.edgeLand(primH.mesh, 'left'));
		primDraw();
	});

	primDiv.append("button")
	.text("Add cone")
	.on("click", function () {
		primH = add(primH, cone(primH.mesh, -0.5));
		primDraw();
	});

	primDiv.append("button")
	.text("Add inverted cone")
	.on("click", function () {
		primH = add(primH, cone(primH.mesh, 0.5));
		primDraw();
	});

	primDiv.append("button")
	.text("Add 25 blobs")
	.on("click", function () {
		primH = add(primH, mountains(primH.mesh, 25, 0.02));
		primDraw();
	});

	primDiv.append("button")
	.text("Normalize heightmap")
	.on("click", function () {
		primH = normalize(primH);
		primDraw();
	});

	primDiv.append("button")
	.text("Round hills")
	.on("click", function () {
		primH = peaky(primH);
		primDraw();
	});

	primDiv.append("button")
	.text("Relax")
	.on("click", function () {
		primH = relax(primH);
		primDraw();
	});

	primDiv.append("button")
	.text("Set sea level to median")
	.on("click", function () {
		primH = setSeaLevel(primH, 0.5);
		primDraw();
	});

	primDiv.append("button")
	.text("Sea higher")
	.on("click", function () {
		seaLevel += 0.1;
		primH = setSeaLevel(primH, seaLevel);
		primDraw();
	});

	primDiv.append("button")
	.text("Sea lower")
	.on("click", function () {
		seaLevel -= 0.1;
		primH = setSeaLevel(primH, seaLevel);
		primDraw();
	});
}());


// EROSION
/*
var erodeDiv = d3.select("div#erode");
var erodeSVG = addSVG(erodeDiv);

function generateUneroded() {
	var mesh = generateGoodMesh(4096);
	var h = add(slope(mesh, randomVector(4)),
				cone(mesh, randomFrom(-1, 1)),
				mountains(mesh, 50));
	h = peaky(h);
	h = fillSinks(h);
	seaLevel = 0.5;
	h = setSeaLevel(h, seaLevel);
	return h;
}

var erodeH = primH;
var erodeViewErosion = false;

function erodeDraw() {
	if (erodeViewErosion) {
		visualizeTriangles(erodeSVG, erosionRate(erodeH));
	} else {
		visualizeTriangles(erodeSVG, erodeH, 0, 1);
	}
	drawPaths(erodeSVG, "coast", contour(erodeH, 0));
}
*/
/*
(function(){
	erodeDiv.append("br");

	erodeDiv.append("button")
	.text("Generate random heightmap")
	.on("click", function () {
		erodeH = generateUneroded();
		console.log('erodeH', erodeH);
		erodeDraw();
	});

	erodeDiv.append("button")
	.text("Copy from above")
	.on("click", function () {
		erodeH = primH;
		console.log('erodeH', erodeH);
		erodeDraw();
	});

	erodeDiv.append("button")
	.text("Erode")
	.on("click", function () {
		erodeH = doErosion(erodeH, 0.1);
		erodeDraw();
	});

	erodeDiv.append("button")
	.text("Set sea level to median")
	.on("click", function () {
		seaLevel = 0.5;
		erodeH = setSeaLevel(erodeH, seaLevel);
		erodeDraw();
	});

	erodeDiv.append("button")
	.text("Clean coastlines")
	.on("click", function () {
		erodeH = cleanCoast(erodeH, 1);
		erodeH = fillSinks(erodeH);
		erodeDraw();
	});
}());
*/

// PHYSICAL
//var physDiv = d3.select("div#phys");
//var physSVG = addSVG(physDiv);
//var physH = erodeH;

var physViewCoast = false;
var physViewRivers = false;
var physViewSlope = false;
var physViewHeight = true;

/*
function physDraw() {
	if (physViewHeight) {
		visualizeTriangles(physSVG, physH, 0);
	} else {
		physSVG.selectAll("path.field").remove();
	}
	if (physViewCoast) {
		drawPaths(physSVG, "coast", contour(physH, 0));
	} else {
		drawPaths(physSVG, "coast", []);
	}
	if (physViewRivers) {
		drawPaths(physSVG, "river", getRivers(physH, 0.01));
	} else {
		drawPaths(physSVG, "river", []);
	}
	if (physViewSlope) {
		visualizeSlopes(physSVG, {h:physH});
	} else {
		visualizeSlopes(physSVG, {h:zero(physH.mesh)});
	}
}
/*
(function() {
	physDiv.append("br");

	physDiv.append("button")
	.text("Generate random heightmap")
	.on("click", function () {
		physH = generateCoast({npts:4096, extent:defaultExtent});
		console.log('physH', physH);
		physDraw();
	});

	physDiv.append("button")
	.text("Copy from above")
	.on("click", function () {
		physH = erodeH;
		console.log('physH', physH);
		physDraw();
	});
	/*
	var physCoastBut = physDiv.append("button")
	.text("Show coastline")
	.on("click", function () {
		physViewCoast = !physViewCoast;
		physCoastBut.text(physViewCoast ? "Hide coastline" : "Show coastline");
		physDraw();
	});

	var physRiverBut = physDiv.append("button")
	.text("Show rivers")
	.on("click", function () {
		physViewRivers = !physViewRivers;
		physRiverBut.text(physViewRivers ? "Hide rivers" : "Show rivers");
		physDraw();
	});
	*/
	/*
	var physSlopeBut = physDiv.append("button")
	.text("Show slope shading")
	.on("click", function () {
		physViewSlope = !physViewSlope;
		physSlopeBut.text(physViewSlope ? "Hide slope shading" : "Show slope shading");
		physDraw();
	});
	*/
	/*
	var physHeightBut = physDiv.append("button")
	.text("Hide heightmap")
	.on("click", function () {
		physViewHeight = !physViewHeight;
		physHeightBut.text(physViewHeight ? "Hide heightmap" : "Show heightmap");
		physDraw();
	});
}());
*/

// CITIES
var postCityDiv = d3.select("div#post-fifth");
var citySVG = d3.select("div#fifth svg");
var view = citySVG.append('g').attr('id', 'view');

// Just wraps the heightmap in preparation for cities data:
function newStage5Render(type, h) {
	type = type || 1;
	h = h || generateBaseMap(type, {npts:4096, extent: defaultExtent});
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
var Stage5Render = newStage5Render();	// runs on load
var coast;

// Triggered by buttons:
function Stage5Draw() {
	$("#game-loader").addClass("active dimmer");
	var scores = cityScores(Stage5Render.h, Stage5Render.cities);
	visualizeTriangles(view, Stage5Render.h, undefined, undefined, false);//, d3.max(scores) - seaLevel);//0.5);
	//visualizeCentroids(view, Stage5Render.h);
	//visualizePoints(view, Stage5Render.h.mesh.pts, true);
	//colorizePoints(view, Stage5Render.h);

	drawPaths(view, 'coast', contour(Stage5Render.h, 0.5));
	drawPaths(view, 'river', getRivers(Stage5Render.h, 0.01));
	visualizeSlopes(view, Stage5Render);
	$("#game-loader").removeClass("active dimmer");

	// Try to make a town on the coast:
	coast = coastPoints(Stage5Render.h, 0.5);
}

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

function addNavAndShip() {
	addNaviLayer(view, Stage5Render);
	svgShip = addShipSvg(view);
}

// Pan & zoom:
var zoom = d3.zoom()
	.scaleExtent([.75, 3])
	.translateExtent([[0,0],[800,600]])	// trap to bounds (x=20, y=50)
	.on("zoom", function() {
		console.log(d3.event.transform);
		var t = d3.event.transform,
			x = t.x + 400 * t.k,
			y = t.y + 300 * t.k;
		view.attr("transform", "translate(" + x + "," + y + ") scale(" + t.k + ")");
	});
citySVG.call(zoom);
zoom.scaleTo(citySVG, .75);

(function(){
	postCityDiv.append("br");

	postCityDiv.append("button")
	.text("Generate random heightmap")
	.on("click", function () {
		Stage5Render = newStage5Render();
		console.log('cityRender', Stage5Render);
		Stage5Draw();
	});

	postCityDiv.append("button")
	.text("Generate Type 1")
	.on("click", function () {
		Stage5Render = newStage5Render(1);
		console.log('cityRender_type1', Stage5Render);
		Stage5Draw();
	});

	postCityDiv.append("button")
	.text("Generate Type 2")
	.on("click", function () {
		Stage5Render = newStage5Render(2);
		console.log('cityRender_type2', Stage5Render);
		Stage5Draw();
	});

	postCityDiv.append("button")
	.text("Generate Type 3")
	.on("click", function () {
		Stage5Render = newStage5Render(3);
		console.log('cityRender_type3', Stage5Render);
		Stage5Draw();
	});

	postCityDiv.append("button")
	.text("Generate Type 4")
	.on("click", function () {
		Stage5Render = newStage5Render(4);
		console.log('cityRender_type4', Stage5Render);
		Stage5Draw();
	});

	postCityDiv.append("button")
	.text("Generate Type 5")
	.on("click", function () {
		Stage5Render = newStage5Render(5);
		console.log('cityRender_type5', Stage5Render);
		Stage5Draw();
	});

	postCityDiv.append("button")
	.text("Copy from above")
	.on("click", function () {
		Stage5Render = newStage5Render(physH);
		console.log('cityRender', Stage5Render);
		Stage5Draw();
	});

	postCityDiv.append("button")
	.text("Add new city")
	.on("click", function () {
		var t = new Town();
		towns.push(t);
		placeCity(Stage5Render, t);
		console.log('Stage5Render', Stage5Render);
		visualizeCities(view, Stage5Render);
		drawLabels(view, Stage5Render);
		linkCities(view);
	});

	postCityDiv.append("button")
	.text("Add 10 cities")
	.on("click", function () {
		for (var c = 10; c > 0; c--) {
			var t = new Town();
			towns.push(t);
			placeCity(Stage5Render, t);
		}
		console.log('Stage5Render', Stage5Render);
		visualizeCities(view, Stage5Render);
		drawLabels(view, Stage5Render);
		linkCities(view);
	});

	postCityDiv.append("button")
	.text("Sea higher")
	.on("click", function () {
		seaLevel += 0.1;
		Stage5Render.h = setSeaLevel(Stage5Render.h, seaLevel);
		Stage5Draw();
	});

	postCityDiv.append("button")
	.text("Sea lower")
	.on("click", function () {
		seaLevel -= 0.1;
		Stage5Render.h = setSeaLevel(Stage5Render.h, seaLevel);
		Stage5Draw();
	});

	postCityDiv.append("button")
	.text("Normalize heightmap")
	.on("click", function () {
		Stage5Render.h = normalize(Stage5Render.h);
		Stage5Draw();
	});

	postCityDiv.append("button")
	.text("Add nav & ship")
	.on("click", function () {
		addNavAndShip();
	});

	/*
	var cityViewBut = postCityDiv.append("button")
	.text("Show territories")
	.on("click", function () {
		cityViewScore = !cityViewScore;
		cityViewBut.text(cityViewScore ? "Show territories" : "Show city location scores");
		Stage5Draw();
	});
	*/
}());
