/* global d3 */

function addSVG(div) {
	return div.insert("svg", ":first-child")
	.attr("height", 600)
	.attr("width", 800)
	.attr("viewBox", "-400 -400 800 800");
}
/*
var meshDiv = d3.select("div#mesh");
var meshSVG = addSVG(meshDiv);

var meshPts = null;
var meshVxs = null;
var meshDual = false;

function meshDraw() {
	if (meshDual && !meshVxs) {
		meshVxs = makeMesh(meshPts).vxs;
	}
	visualizePoints(meshSVG, meshDual ? meshVxs : meshPts);
}

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
*/
/*
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
});*/

// PRIMITIVES
var primDiv = d3.select("div#prim");
var primSVG = addSVG(primDiv);

var primH = zero(generateGoodMesh(4096));

function primDraw() {
	visualizeVoronoi(primSVG, primH, -1, 1);
	drawPaths(primSVG, 'coast', contour(primH, 0));
}
primDraw();

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
	primH = add(primH, edgeLand(primH.mesh, 'top'));
	primDraw();
});

primDiv.append("button")
.text("Add land @ bottom")
.on("click", function () {
	primH = add(primH, edgeLand(primH.mesh, 'bottom'));
	primDraw();
});

primDiv.append("button")
.text("Add land @ right")
.on("click", function () {
	primH = add(primH, edgeLand(primH.mesh, 'right'));
	primDraw();
});

primDiv.append("button")
.text("Add land @ left")
.on("click", function () {
	primH = add(primH, edgeLand(primH.mesh, 'left'));
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

var seaLevel = 0.5;

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

// EROSION
var erodeDiv = d3.select("div#erode");
var erodeSVG = addSVG(erodeDiv);

function generateUneroded() {
	var mesh = generateGoodMesh(4096);
	var h = add(slope(mesh, randomVector(4)),
	cone(mesh, runif(-1, 1)),
	mountains(mesh, 50));
	h = peaky(h);
	h = fillSinks(h);
	h = setSeaLevel(h, 0.5);
	return h;
}

// ERODE
var erodeH = primH;
var erodeViewErosion = false;

function erodeDraw() {
	if (erodeViewErosion) {
		visualizeVoronoi(erodeSVG, erosionRate(erodeH));
	} else {
		visualizeVoronoi(erodeSVG, erodeH, 0, 1);
	}
	drawPaths(erodeSVG, "coast", contour(erodeH, 0));
}

erodeDiv.append("button")
.text("Generate random heightmap")
.on("click", function () {
	erodeH = generateUneroded();
	erodeDraw();
});

erodeDiv.append("button")
.text("Copy heightmap from above")
.on("click", function () {
	erodeH = primH;
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
	erodeH = setSeaLevel(erodeH, 0.5);
	erodeDraw();
});


erodeDiv.append("button")
.text("Clean coastlines")
.on("click", function () {
	erodeH = cleanCoast(erodeH, 1);
	erodeH = fillSinks(erodeH);
	erodeDraw();
});
/*
var erodeBut = erodeDiv.append("button")
.text("Show erosion rate")
.on("click", function () {
	erodeViewErosion = !erodeViewErosion;
	if (erodeViewErosion) {
		erodeBut.text("Show heightmap");
	} else {
		erodeBut.text("Show erosion rate");
	}
	erodeDraw();
});
*/

// PHYSICAL
var physDiv = d3.select("div#phys");
var physSVG = addSVG(physDiv);
var physH = erodeH;

var physViewCoast = false;
var physViewRivers = false;
var physViewSlope = false;
var physViewHeight = true;

function physDraw() {
	if (physViewHeight) {
		visualizeVoronoi(physSVG, physH, 0);
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
physDiv.append("button")
.text("Generate random heightmap")
.on("click", function () {
	physH = generateCoast({npts:4096, extent:defaultExtent});
	physDraw();
});

physDiv.append("button")
.text("Copy heightmap from above")
.on("click", function () {
	physH = erodeH;
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
*/
var physRiverBut = physDiv.append("button")
.text("Show rivers")
.on("click", function () {
	physViewRivers = !physViewRivers;
	physRiverBut.text(physViewRivers ? "Hide rivers" : "Show rivers");
	physDraw();
});

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
*/

// CITIES
var cityDiv = d3.select("div#city");
var citySVG = addSVG(cityDiv);

// Pan & soom:
citySVG.call(d3.zoom().scaleExtent([1, 1.75]).on("zoom", function() {
	citySVG.attr("transform", d3.event.transform);
}));

var cityViewScore = true;

function newCityRender(h) {
	h = h || generateCoast({npts:4096, extent: defaultExtent});
	return {
		params: defaultParams,
		h: h,
		cities: []
	};
}
var cityRender = newCityRender(physH);
console.log('coastalSites', coastalSites(physH));

function cityDraw() {
	//cityRender.terr = getTerritories(cityRender);
	/*
	if (cityViewScore) {
		var scores = cityScores(cityRender.h, cityRender.cities);
		visualizeVoronoi(citySVG, scores, d3.max(scores) - 0.5);
	} else {
		visualizeVoronoi(citySVG, cityRender.terr);
	}
	*/
	var scores = cityScores(cityRender.h, cityRender.cities);
	visualizeVoronoi(citySVG, scores);//, d3.max(scores) - 0.5);

	drawPaths(citySVG, 'coast', contour(cityRender.h, 0));
	drawPaths(citySVG, 'river', getRivers(cityRender.h, 0.01));
	//drawPaths(citySVG, 'border', getBorders(cityRender));

	visualizeSlopes(citySVG, cityRender);
	visualizeCities(citySVG, cityRender);
}

d3.select("#cityBtn1")
.text("Generate random heightmap")
.on("click", function () {
	cityRender = newCityRender();
	cityDraw();
});

d3.select("#cityBtn2")
.text("Copy heightmap from above")
.on("click", function () {
	cityRender = newCityRender(physH);
	cityDraw();
});

d3.select("#cityBtn3")
.text("Add new city")
.on("click", function () {
	placeCity(cityRender);
	cityDraw();
});

d3.select("#cityBtn4")
.text("Sea higher")
.on("click", function () {
	seaLevel += 0.1;
	cityRender.h = setSeaLevel(cityRender.h, seaLevel);
	cityDraw();
});

d3.select("#cityBtn5")
.text("Sea lower")
.on("click", function () {
	seaLevel -= 0.1;
	cityRender.h = setSeaLevel(cityRender.h, seaLevel);
	cityDraw();
});

d3.select("#cityBtn6")
.text("Normalize heightmap")
.on("click", function () {
	cityRender.h = normalize(cityRender.h);
	cityDraw();
});

/*
var cityViewBut = cityDiv.append("button")
.text("Show territories")
.on("click", function () {
	cityViewScore = !cityViewScore;
	cityViewBut.text(cityViewScore ? "Show territories" : "Show city location scores");
	cityDraw();
});
*/

// FINAL
/*
var finalDiv = d3.select("div#final");
var finalSVG = addSVG(finalDiv);
finalDiv.append("button")
.text("Copy map from above")
.on("click", function () {
	drawMap(finalSVG, cityRender);
});

finalDiv.append("button")
.text("Generate high resolution map")
.on("click", function () {
	doMap(finalSVG, defaultParams);
});
*/
