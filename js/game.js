/* global $, Ship, Sailor, ui */

var player = {
	ships: [new Ship()],
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
player.ships[0].addCrew([man1, man2, man3, man4, man5, man6]);

function combat(sailors, enemy) {
	console.log("Combat:", sailors, enemy);

	// To account for weapon skills & weaknesses:
	var aptitudes = {
		"Combat": 12,
		"Weaponry": 10,
		"Rowing": 6,
		"Carpentry": 5,
		"Fishing": 4,
		"Navigation": 0,
		"Seafaring": 0,
		"Cartography": 0,
		"Philosophy": -2,
		"Music": -4
	};

	var def1 = sailors.map(s => s.morale + s.age / 12).reduce((a,b) => a+b) / (sailors.length);
	var att1 = sailors.map(s => s.xp - s.age / 15).reduce((a,b) => a+b);
	var skill = sailors.map(s => s.skills.map(sk => aptitudes[sk]).reduce((a,b) => a+b)).reduce((a,b) => a+b) / 3;
	att1 += skill;
	att1 /= (sailors.length / 2);
	console.log('def1', def1, 'att1', att1, 'skill', skill);

	var def2 = enemy.health;
	var att2 = enemy.attack;
	var brav2 = enemy.bravery;
	console.log('att2', att2, 'def2', def2, 'brav2', brav2);

	while (def1 > 0 && def2 > 0) {
		// We attack:
		var a = (att1 / 3) * (4 * Math.random() + 4) / 60;
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
			// Remove from crew:
			for (var s of lost) {
				player.ships[0].fireMan(s);
			}
			return {
				code: 0,
				status: "Defeat.",
				desc: "The enemy was too strong.",
				losses: lost
			};
		}
		// Repeat
	}
	// Both combatants cannot simultaneously die
}

function endTurn() {
	player.turns += 1;
	if (player.turns % 12 === 0) {
		player.year--;
		ui.popups.salary();
	}
	ui.sidebars.updateAll();
}

function makeYear() {
	// Choose a year from 800-600 BC:
	return 600 + Math.floor(200 * Math.random());
}

ui.sidebars.updateAll();

// FIXME
// Make the total reflect the checked checkboxes in pre-combat card:
$(".sailor-checkbox-wrap :checkbox").on("click", function() {
	$("#checkedCount").html($(".sailor-checkbox-wrap :checkbox:checked").length);
});
