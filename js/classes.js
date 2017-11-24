Array.prototype.random = function() {
	return this[Math.floor(Math.random() * this.length)];
};

class Ship {
	constructor() {
		this.name = "My Ship";
		this.speed = 10;	// kmh
		this.defence = 10;
		this.upgrades = [];
		this.max_crew = 20;
		this.max_gold = 500;
		this.max_food = 1000;
		this.max_wine = 250;
		this.gold = 25;
		this.bread = 65;
		this.chicken = 35;
		this.fish = 0;
		this.wine = 25;
		this.health = 100;
		this.captain = null;
		this.crew = [];
		this.morale = Math.ceil(70 + (30 * Math.random()));
	}

	// Add single or multiple crew members:
	addCrew(newCrew) {
		if (typeof newCrew === 'object') {
			this.crew = this.crew.concat(newCrew);
		}
		else {
			this.crew.push(newCrew);
		}
	}

	getSpeed() {
		// Test for Upgrades & Crew skills
		var s = this.speed;
		if (this.upgrades.includes("fastness")) s += 2;
		return s;
	}

	getDefence() {
		// Test for Upgrades & Crew skills
	}

	getFood() {
		return this.chicken + this.fish + this.bread;
	}

	sail(distance) {

	}

	fish() {
		var fishCaught = 5 * Math.ceil(10 * Math.random());
		this.fish += fishCaught;
		console.log("Caught", fishCaught, "kilos of fish");
	}

	buy(product, amount, cost) {

	}

	sell(product, amount, cost) {
		// TODO: needs checks for max/min of each thing
		this.gold += cost;
		switch(product) {
			case 'chicken':
				this.chicken -= amount;
				break;
			case 'bread':
				this.bread -= amount;
				break;
			case 'fish':
				this.fish -= amount;
				break;
			case 'wine':
				this.wine -= amount;
				break;
		}
	}
}

class Sailor {
	constructor() {
		this.name = this.pickName();
		this.origin = this.pickOrigin();
		this.avatarSeed = this.pickAvatarSeed();
		this.skills = this.pickSkills();
		this.age = 18 + Math.floor(30 * Math.random());
		this.xp = Math.floor(this.age / 10) + Math.floor(5 * Math.random());
		this.salary = this.xp;
		return this;
	}

	pickName() {
		const maleNames = "Kostas Odysseus Christos Giorgos Giannis Pavlos Petros Telemachus Achilles Heracles Panos Alexis".split(" ");
		return maleNames.random();
	}

	pickOrigin() {
		const places = "Rhōmanía, Abydos, Agathḗ Týkhē, Áŋkyra, Adrianoúpolis, Athḗnai, Aigaíon Pélagos, Aígyptos, Aithiopía, Aiolís, Aítna, Aitōlía, Akarnanía, Akrágas, Albanía, Aleksándreia, Aleksandrétta, Halikarnassós, Amphípolis, Anatolḗ, Antarktikḗ, Antiókheia, Antípolis, Apoulía, Arabía, Argolís, Árgos, Arkadía, Armenía, Asía, Attikḗ, Australía, Aphrikḗ, Akhaḯa, Babylōn, Babylōnía, Baktrίa, Benetía, Bēthleém, Bērytós, Bithynía, Blakhía, Boiōtía, Boulgaría, Bretanía, Bysdántion, Galatía, Galilaía, Gallía, Germanía, Geōrgía, Dakía, Damaskós, Delphoí, Dyrrhákhion, Dōdekánēsa, Elaía, Helbetía, Helíkē, Hellás, Empórion, Erétria, Erythraía, Eúboia, Eurṓpē, Éphesos, Ḗpeiros, Hērákleia, Theodosía, Thessalía, Thessaloníkē, Thḗbai, Thḗra, Thoúrioi, Thrákē, Ialyssós, Ibería, Ierichṓ, Hierousalḗm, Ithákē, Ikónion, Illyría, Indíai, Indonēsía, Ióppē, Ioudaía, Hispanía, Israḗl, Italía, Iōnía, Kaisareia, Kalabría, Kámeiros, Kampánia, Kappadokía, Karía, Karpáthia, Kárpathos, Karkhēdṓn, Kaspía, Katánē, Kérkyra, Kilikía, Knidos, Knōssόs, Kolophṓn, Kόrinthos, Krḗtē, Krótōn, Kýsdikos, Kykládes, Kýmē, Kýpros, Kyrēnaïkḗ, Kyrḗnē, Kōnstantinoúpolis, Kōs, Lakōnía, Lamía, Lámpsakos, Laodikeia, Lésbos, Leukōsía, Líbanos, Libýē, Líndos, Lokrís, Lokroí, Lydía, Lykía, Magnēsía, Makedonía, Makedṓn, Massalía, Maurētanía, Mauroboúnion, Mégara, Megarís, Melanēsía, Melítē, Mesopotamía, Messḗnē, Messēnía, Mēdía, Mḗlos, Mikronēsía, Mílētos, Moisía, Mykḗnai, Mýkonos, Mysía, Mōréas, Názara, Náksos, Naúplion, Neápolis, Níkaia, Nikopolis, Nísyros, Noumidía, Paionía, Palaistínē, Pamphylía, Pánormos, Pantikapaion, Parthía, Parísioi, Pátmos, Pátrai, Paphlagonía, Pelopónnēsos, Persía, Pisidia, Polynēsía, Póntos, Proúsa, Rhḗgion, Rhódos, Rhṓmē, Samareia, Sámos, Sampsoúnta, Santorínē, Seleukeia, Serbía, Sidṓn, Sikelía, Sinṓpē, Skythía, Smýrnē, Sóphia, Spártē, Sýmē, Syrakoúsai, Syría, Táras, Tarsόs, Tḗlos, Tiberiás, Tourkía, Trapesdoúnta, Trípolis, Troía, Trṓas, Týros, Phthiṓtis, Philadélpheia, Philippínai, Phoiníkē, Phrygía, Phōkaia, Phōkís, Khalkēdōn, Khersónēsos, Khíos, Ōkeanía".split(", ");
		return places.random();
	}

	pickAvatarSeed() {
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
		// Includes tooltip text
		return `<img class="ui avatar image"
		data-title="${this.name} of ${this.origin}"
		data-content="${this.skills.join(", ")}"
		src="https://avatars.dicebear.com/v1/male/${this.avatarSeed}\/50.png">`;
	}
}

class Town {
	constructor(x,y) {
		this.name = this.pickName();
		this.location = {x: x, y: y};
		this.sailors = 2;
		this.buying = [];
		this.selling = [];
		this.status = "free";
		this.size = 5;
		this.visited = false;
		// Register in global array:
		//towns.push[this];
		return this;
	}

	pickName() {
		return gameText.placeNames.list.random();
	}

	inventTrades() {
		// Buying?
		var items = ["bread", "fish", "chicken", "wine"];
		//items.shuffle();
		var b = [0,1,2].random();
		while (b > 0) {
			this.buying.push({
				"item": items.pop(),
				"quantity": 5 * Math.ceil(10 * Math.random()),	// 5-50
				"price": 1 // TODO
			});
		}
		// Selling?
		items = ["bread", "fish", "chicken", "wine"];
		//items.shuffle();
		b = [0,1,2].random();
		while (b > 0) {
			this.selling.push({
				"item": items.pop(),
				"quantity": 5 * Math.ceil(10 * Math.random()),	// 5-50
				"price": 1 // TODO
			});
		}
	}

	peaceTimeEvent() {
		var params = gameText.peaceTimeEvents.random();
		params.title = "You have been invited to a "+params.title;
		params.buttons = {
			yes: "Accept",
			no: "Decline"
		};
		ui.renderModalCard(params);
		return this;
	}

	underAttack() {
		var params = gameText.peaceTimeEvents.random();
		console.log(params);
		params.title = this.name+" is under attack by a/an/the "+params.title;
		params.buttons = {
			yes: "Fight",
			no: "Flee"
		};
		ui.renderModalCard(params);
		return this;
	}
}
