/*global ui, gameText, salt */

Array.prototype.random = function() {
	return this[Math.floor(Math.random() * this.length)];
};

Array.prototype.shuffle = function() {
	for (let i = this.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[this[i], this[j]] = [this[j], this[i]];
	}
	return this;
};

String.prototype.hashCode = function(){
	var hash = 0;
	if (this.length === 0) return hash;
	for (var i = 0; i < this.length; i++) {
		var char = this.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
};

class Ship {
	constructor() {
		this.name = "My Ship";
		this.type = "Trireme";
		this.speed = 10;	// kmh
		this.defence = 10;
		this.upgrades = [];	// TODO
		this.max_crew = 20;
		this.max_food = 1000;
		this.max_wine = 250;
		this.bread = 65;
		this.chicken = 35;
		this.fish = 0;
		this.wine = 25;
		this.health = 100;
		this.captain = null;
		this.crew = [];
		this.morale = Math.ceil(70 + (30 * Math.random()));	// TODO: average crewmen
	}

	// Add single or multiple crew members:
	addCrew(newCrew) {
		if (typeof newCrew === 'object') {
			this.crew = this.crew.concat(newCrew);
		}
		else {
			this.crew.push(newCrew);
		}
		// Captainify someone:
		if (this.captain === null) this.captain = this.crew.random();
	}

	getSpeed() {
		// Test for Upgrades & Crew skills
		var s = this.speed;
		if (this.upgrades.includes("fastness")) s += 2;
		return s;
	}

	getDefence() {
		// Test for Upgrades & Crew skills
		var s = this.speed;
		if (this.upgrades.includes("fastness")) s += 2;
		return s;
	}

	getFood() {
		return this.chicken + this.fish + this.bread;
	}

	sail(distance) {
		// Reduce food & morale
	}

	fish() {
		var fishCaught = 5 * Math.ceil(10 * Math.random());
		this.fish += fishCaught;
		console.log("Caught", fishCaught, "kilos of fish");
	}

	buy(product, amount, cost) {
		this.sell(product, -amount, -cost);	// FIXME
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
		this.name = gameText.mensNames.random();
		this.origin = gameText.placeNames.list.random();
		this.avatarSeed = this.pickAvatarSeed();
		this.skills = this.pickSkills();
		this.age = 18 + Math.floor(30 * Math.random());
		this.xp = Math.floor(this.age / 10) + Math.floor(5 * Math.random());
		this.morale = Math.ceil(7 + 3 * Math.random());
		this.salary = this.xp;
		return this;
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

	renderAvatar(className = "") {
		// Includes tooltip text
		return `<img class="ui avatar image ${className}"
		data-title="${this.name} of ${this.origin}"
		data-content="${this.skills.join(", ")}"
		src="https://avatars.dicebear.com/v1/male/${this.avatarSeed}\/50.png">`;
	}
}

class Town {
	constructor(ptIndex, x,y) {
		this.name = gameText.places.random();
		this.ptIndex = ptIndex;
		this.location = {x: x, y: y};	// TODO lookup x & y
		this.size = 5;
		this.sailors = 2;	// available on demand or quota'd?
		this.buying = [];
		this.selling = [];
		this.status = "atWar";
		this.peaceEvent = null;
		this.warEvent = null;
		this.visited = false;
		return this;
	}

	peaceTimeEvent() {
		if (!this.peaceEvent) {
			// Choose an event based on city name + salt:
			var seed = (this.name + salt) & gameText.peaceTimeEvents.length;
			var event = gameText.peaceTimeEvents[seed];
			event.title = "You have been invited to a "+event.title;
			event.buttons = {
				yes: "Accept",
				no: "Decline"
			};
		}
		else {
			event = this.peaceEvent;
		}
		ui.renderModalCard(event);
	}

	underAttack() {
		if (!this.warEvent) {
			// Choose an event based on city name + salt:
			var seed = (this.name + salt) & gameText.monsterEvents.length;
			var event = gameText.monsterEvents[seed];
			console.log(event);
			event.title = this.name+" is under attack by a/an/the "+event.title;
			event.buttons = {
				yes: "Fight",
				no: "Flee"
			};
		}
		else {
			event = this.warEvent;
		}
		ui.renderModalCard(event);
	}

	inventTrades() {
		// Buying?
		var b = [0,1,2].random();
		var items = gameText.produce.shuffle();
		while (b > 0) {
			var item = items.pop();
			this.buying.push({
				"name": item.name,
				"unit": item.unit,
				"quantity": 5 * Math.ceil(10 * Math.random()),	// 5-50
				"price": item.basePrice
			});
		}
		// Selling?
		b = [0,1,2].random();
		items = gameText.produce.shuffle();
		while (b > 0) {
			item = items.pop();
			this.selling.push({
				"name": item.name,
				"unit": item.unit,
				"quantity": 5 * Math.ceil(10 * Math.random()),	// 5-50
				"price": item.basePrice
			});
		}
		return;
	}

	tradeWith() {
		this.inventTrades();	// populates this.buying, this.selling
		// Pop up trading interface:
		ui.modals.traderCard(this.buying, this.selling);
	}

	offerRecruits(num) {
		var recruits = [];
		while (num > 0) {
			recruits.push(new Sailor());
		}
		// Pop up recruitment interface:
		ui.modals.recruitmentCard(recruits);
	}

	visit() {
		this.visited = true;
		if (this.status === 'atWar') this.underAttack();
		else if (this.status === 'atPeace') this.peaceTimeEvent();
		else if (player.ships[0].crew.length < 5) this.offerRecruits(3);
		else if (Math.random() > 0.5) this.tradeWith();
		else {
			// Do nothing
		}
	}
}

class Enemy {
	constructor(params) {
		this.name = params.name;
		this.desc = params.desc;
		this.img = params.img;
		this.attack = params.attack;
		this.health = params.health;
		this.bravery = params.bravery;
		this.strength = params.strength;
		this.weakness = params.weakness;
		console.log(this);
		return this;
	}

	renderCard() {

	}

	die() {

	}
}
