/* global $, Sailor, ui, myship */

var player = {			// eslint-disable-line
	ships: [myship],
	gametime: 0,	// TODO: timer
	year: makeYear(),
	// 12 turns = 1 year
	turns: 0,		// change game salt every 15 minutes or every 10 turns?
	gold: 100,
	trophies: [],
	godFavours: {
		poseidon: 0,
		uranus: 0,
		demeter: 0,
		hephaestus: 0,
		artemis: 0,
		ares: 0
	}
};

var man1 = new Sailor();
var man2 = new Sailor();
var man3 = new Sailor();
var man4 = new Sailor();
var man5 = new Sailor();
var man6 = new Sailor();
myship.addCrew([man1, man2, man3, man4, man5, man6]);

function makeYear() {
	// Choose a year from 800-600 BC:
	return 600 + Math.floor(200 * Math.random());
}

ui.sidebars.updateAll();
