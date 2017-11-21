Array.prototype.random = function() {
	return this[Math.floor(Math.random() * this.length)];
};

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
		this.avatarSeed = this.pickAvatar();
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

	pickAvatar() {
		const avSeeds = "a,b,d,e,f,g,h,i,m,n,o,p,q,r,s,t,u,v,w,x,y,z,aa,bb,cc,dd,ee,ff,gg,ii,jj,kk,ll,nn,oo,pp,tt,ww,yy,zz,2,3,5,6,7,8,12,14,15,16,17,19,20,22,24,25,27,28,29,31,32,33,34,35,36,37,39".split(",");
		return avSeeds.random();
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
		return this.renderAvatar() + `<h3>${this.name}</h3>
		<span>of ${this.origin}</span>
		<dl>
			<dt>Age</dt><dd>${this.age}</dd>
			<dt>Skills</dt><dd>${this.skills.join(", ")}</dd>
			<dt>Salary</dt><dd>${this.salary}gpy</dd>
		</dl>`;
	}

	renderAvatar() {
		return `<img src="https://avatars.dicebear.com/v1/male/${this.avatarSeed}\/100.png">`;
	}
}

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
