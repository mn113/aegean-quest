Array.prototype.random = function() {
	return this[Math.floor(Math.random() * this.length)];
}

class Ship {
	constructor() {
		this.name = "My Ship";
		this.speed = 10;	// kmh
		this.upgrades = [];
		this.max_crew = 20;
		this.max_gold = 500;
		this.max_food = 1000;
		this.max_wine = 250;
		this.gold = 25;
		this.food = 75;
		this.wine = 25;
		this.health = 100;
		this.captain = null;
		this.crew = [];
		this.morale = Math.ceil(70 + (30 * Math.random()));
	}
}

class Sailor {
	constructor() {
		this.name = this.pickName();
		this.origin = this.pickOrigin();
		this.avatarSeed = "a";
		this.skills = this.pickSkills();
		this.age = 18 + Math.floor(30 * Math.random());
		this.xp = Math.floor(this.age / 10) + Math.floor(5 * Math.random());
		this.salary = this.xp;
	}

	pickName() {
		const maleNames = "Kostas Odysseus Christos Giorgos Giannis Pavlos Petros Telemachus Achilles Heracles Panos Alexis".split(" ");
		return maleNames.random();
	}

	pickOrigin() {
		const places = "Rhōmanía, Abydos, Agathḗ Týkhē, Áŋkyra, Adrianoúpolis, Athḗnai, Aigaíon Pélagos, Aígyptos, Aithiopía, Aiolís, Aítna, Aitōlía, Akarnanía, Akrágas, Albanía, Aleksándreia, Aleksandrétta, Halikarnassós, Amphípolis, Anatolḗ, Antarktikḗ, Antiókheia, Antípolis, Apoulía, Arabía, Argolís, Árgos, Arkadía, Armenía, Asía, Attikḗ, Australía, Aphrikḗ, Akhaḯa, Babylōn, Babylōnía, Baktrίa, Benetía, Bēthleém, Bērytós, Bithynía, Blakhía, Boiōtía, Boulgaría, Bretanía, Bysdántion, Galatía, Galilaía, Gallía, Germanía, Geōrgía, Dakía, Damaskós, Delphoí, Dyrrhákhion, Dōdekánēsa, Elaía, Helbetía, Helíkē, Hellás, Empórion, Erétria, Erythraía, Eúboia, Eurṓpē, Éphesos, Ḗpeiros, Hērákleia, Theodosía, Thessalía, Thessaloníkē, Thḗbai, Thḗra, Thoúrioi, Thrákē, Ialyssós, Ibería, Ierichṓ, Hierousalḗm, Ithákē, Ikónion, Illyría, Indíai, Indonēsía, Ióppē, Ioudaía, Hispanía, Israḗl, Italía, Iōnía, Kaisareia, Kalabría, Kámeiros, Kampánia, Kappadokía, Karía, Karpáthia, Kárpathos, Karkhēdṓn, Kaspía, Katánē, Kérkyra, Kilikía, Knidos, Knōssόs, Kolophṓn, Kόrinthos, Krḗtē, Krótōn, Kýsdikos, Kykládes, Kýmē, Kýpros, Kyrēnaïkḗ, Kyrḗnē, Kōnstantinoúpolis, Kōs, Lakōnía, Lamía, Lámpsakos, Laodikeia, Lésbos, Leukōsía, Líbanos, Libýē, Líndos, Lokrís, Lokroí, Lydía, Lykía, Magnēsía, Makedonía, Makedṓn, Massalía, Maurētanía, Mauroboúnion, Mégara, Megarís, Melanēsía, Melítē, Mesopotamía, Messḗnē, Messēnía, Mēdía, Mḗlos, Mikronēsía, Mílētos, Moisía, Mykḗnai, Mýkonos, Mysía, Mōréas, Názara, Náksos, Naúplion, Neápolis, Níkaia, Nikopolis, Nísyros, Noumidía, Paionía, Palaistínē, Pamphylía, Pánormos, Pantikapaion, Parthía, Parísioi, Pátmos, Pátrai, Paphlagonía, Pelopónnēsos, Persía, Pisidia, Polynēsía, Póntos, Proúsa, Rhḗgion, Rhódos, Rhṓmē, Samareia, Sámos, Sampsoúnta, Santorínē, Seleukeia, Serbía, Sidṓn, Sikelía, Sinṓpē, Skythía, Smýrnē, Sóphia, Spártē, Sýmē, Syrakoúsai, Syría, Táras, Tarsόs, Tḗlos, Tiberiás, Tourkía, Trapesdoúnta, Trípolis, Troía, Trṓas, Týros, Phthiṓtis, Philadélpheia, Philippínai, Phoiníkē, Phrygía, Phōkaia, Phōkís, Khalkēdōn, Khersónēsos, Khíos, Ōkeanía".split(", ");
		return places.random();
	}

	makeAvatar() {

	}

	pickSkills() {
		const skillList = "Combat, Navigation, Seafaring, Fishing, Cartography, Carpentry, Weaponry, Rowing, Music".split(", ");
		// Give the sailor 1 or 2 skills:
		var skills = [skillList.random()];
		if (Math.random() > 0.5) {
			var skill2 = skillList.random();
			if (!skills.includes(skill2)) skills.push(skill2);
		}
		return skills;
	}

	showStats() {
		return `<h3>${this.name}</h3>
		<span>of ${this.origin}</span>
		<dl>
			<dt>Age</dt><dd>${this.age}</dd>
			<dt>Skills</dt><dd>${this.skills.join(", ")}</dd>
			<dt>Salary</dt><dd>${this.salary}gpy</dd>
		</dl>`;
	}

	renderAvatar() {
		return '<img src="avatar.png">';
	}
}

var ship = new Ship();
var man1 = new Sailor();
var man2 = new Sailor();
var man3 = new Sailor();
console.log(man1);
console.log(man2);
console.log(man3.showStats());

class Town {
	constructor(x,y) {
		this.name = "";
		this.location = {x: x, y: y};
		this.buying = {};
		this.selling = {};
		this.sailors = 2;
		this.demon = null;
		this.size = 5;
		this.event = this.pickEvent();
	}

	pickEvent() {
		const events = "Party, Harvest, Building work, Mining work, Religious festival, Fishing".split(", ");
		return events.random();
	}
}
