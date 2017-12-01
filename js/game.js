/* global gameText, Ship, Sailor, ui */

var player = {
	ships: [new Ship()],
	gametime: 0,	// TODO: timer
	year: makeYear(),
	// 12 turns = 1 year
	turns: 0,		// change game salt every 15 minutes or every 10 turns?
	gold: 100,
	trophies: gameText.trophies,
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
console.log(man1);
player.ships[0].addCrew([man1, man2, man3, man4, man5, man6]);

function combat(sailors, enemy) {
	var att1 = sailors.map(s => s.xp - s.age / 15).reduce((a,b) => a+b) / (sailors.length / 2);
	var def1 = sailors.map(s => s.morale + s.age / 12).reduce((a,b) => a+b) / (sailors.length / 2);
	var att2 = enemy.attack;
	var def2 = enemy.health;
	var brav2 = enemy.bravery;
	console.log('Combat stats:', 'att1', att1, 'def1', def1, 'att2', att2, 'def2', def2, 'brav2', brav2);

	// TODO: account for weapon skills & weaknesses

	while (def1 > 0 && def2 > 0) {
		// We attack:
		var a = (att1 / 3) * (4 * Math.random() + 4) / 8;
		console.log('a', a);
		def2 -= a;
		brav2 -= a / 3;
		// He ded?
		if (def2 <= 0) return {
			code: 2,
			status: "Victory!",
			desc: "The enemy was vanquished!"
		};
		// He chicken out?
		if (brav2 < a) return {
			code: 1,
			status: "Victory!",
			desc: "The enemy ran away."
		};
		// Enemy attacks:
		def1 -= att2 / 3 * (4 * Math.random() + 4) / 8;
		// We ded?
		if (def1 <= 0) {
			var lossQuota = Math.floor(Math.sqrt(sailors.length * Math.random()));
			var lost = sailors.shuffle().slice(0,lossQuota);
			return {
				code: 0,
				status: "Defeat.",
				desc: "The enemy was too strong.",
				losses: lost
			};
		}
		// Repeat
	}
	// Both combatants cannot be dead
}

function endTurn() {
	player.turns += 1;
	if (player.turns % 12 === 0) {
		player.year--;
		ui.popups.salary();
	}
	ui.updateSidebars();
}

function makeYear() {
	// Choose a year from 800-600 BC:
	return 700 + Math.floor(100 * Math.random());
}

ui.updateSidebars();
