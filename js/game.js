var ship1 = new Ship();
var man1 = new Sailor();
var man2 = new Sailor();
var man3 = new Sailor();
console.log(man1);
console.log(man2);
console.log(man3.showStats());

var player = {
	ships: [ship1],
	gametime: 0,
	godFavours: {
		"Poseidon": 0,
		"Uranus": 0,
		"Demeter": 0,
		"Hephaestus": 0,
		"Artemis": 0,
		"Ares": 0
	},
	trophies: []
};
ship1.addCrew([man1, man2, man3]);
