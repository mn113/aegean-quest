/*global d3, ui, player, gameText, recruits, ShortPathCalc, triCentreDistance, mapRender, simplify, nodes, endTurn, currentCity */
/* eslint-disable no-global-assign */


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

// Seeding
function reSalt() {
	return new Date().getHours() % 4;
}
var salt = reSalt();	// changes every 15 minutes provided reSalt called regularly

var myship = null;

class Ship {	// eslint-disable-line
	constructor() {
		this.name = gameText.shipNames.random();
		this.type = "Bireme";
		this.node = null;	// set by addShipSvg()
		this.speed = 10;	// kmh
		this.defence = 10;
		this.upgrades = [];
		this.max_crew = 20;
		this.supplies = {
			bread: 65,
			wine: 25,
			chicken: 35,
			fish: 0,
			max_bread: 100,
			max_wine: 75,
			max_chicken: 75,
			max_fish: 100,
		};
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
		if (this.captain === null) {
			var capt = this.crew.random();
			capt.captain = true;
			this.captain = capt;	// FIXME
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
		var s = this.speed;
		if (this.upgrades.includes("fastness")) s += 2;
		return s;
	}

	getFood() {
		return this.chicken + this.fish + this.bread;
	}

	sail(distance) {
		// Reduce food & morale
		var deductions = Math.floor(distance / 40);	// max 12 deductions, initially
		console.log("Deducting", deductions);
		while (deductions > 0) {
			// Prevent negative supplies:
			if (this.supplies.bread > 0)   { this.supplies.bread--; deductions--; }
			if (this.supplies.chicken > 0) { this.supplies.chicken--; deductions--; }
			if (this.supplies.fish > 0)    { this.supplies.fish--; deductions--; }
			if (this.supplies.wine > 0)    { this.supplies.wine--; deductions--; }
		}
		ui.sidebars.renderShipInfo();
	}

	fish(distance) {
		var fishCaught = 5 * Math.ceil(distance/50 * Math.random());	// max 50 fish
		// Gain as many fish as we can before hitting max:
		if (this.supplies.fish === this.supplies.max_fish) {
			return;
		}
		else if (this.supplies.fish + fishCaught <= this.supplies.max_fish) {
			ui.popups.fishPopup(fishCaught);
			this.supplies.fish += fishCaught;
		}
		else if (this.supplies.fish + fishCaught > this.supplies.max_fish) {
			ui.popups.fishPopup(fishCaught);
			this.supplies.fish = this.supplies.max_fish;
		}
		ui.sidebars.renderShipInfo();
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

	hireMan(i) {
		this.addCrew(recruits[i]);
		ui.sidebars.renderShipInfo();
	}

	fireMan(i) {
		if (typeof i === 'object') {
			i = this.crew.indexOf(i);
		}
		if (i > -1) this.crew.splice(i, 1);
		ui.sidebars.renderShipInfo();
	}

	// Make route for ship and set it moving:
	findRoute(dest, callback) {
		var route = ShortPathCalc.findRoute(this.node, dest);
		var hopped = 0;
		console.log('route', route);
		if (!route.path) return;
		// Check voyage not too long:
		if (route.distance > 500) return "too far";
		// Check food supply:
		if (route.distance / 50 > myship.getFood()) {
			ui.popups.insufficient('food');
			return false;
		}

		// Use Simplify.js to smooth the path:
		function simplifyRoute(route) {
			var points = route.map(p => {
				return {x: nodes[p.target].coords[0], y: nodes[p.target].coords[1]};
			});
			//var tolerance = 5;
			return simplify(points);	// TODO
		}

		// Infinite movement loop:
		function doHop() {
			var hop = route.path[hopped];
			myship.move(hop.target, function() {	// NOTE 'this' won't work inside
				// Update location:
				myship.node = hop.target;
				hopped++;
				// Continue infinite loop:
				if (hopped < route.path.length) doHop();
				else if (myship.node === dest) {
					// Make deductions:
					myship.sail(route.distance);
					myship.fish(route.distance);
					// Action:
					if (callback) callback();
				}
			});
		}
		// Init loop:
		doHop();
	}

	// Animate ship to a new node:
	move(destNode, callback) {
		// Get Pythagorean distance and use with ship's speed for animation duration:
		var distance = 25000 * triCentreDistance(mapRender.h.mesh, this.node, destNode),
			duration = distance / myship.speed;
		//console.log('distance', distance, 'duration', duration);

		var destCoords = mapRender.h.mesh.triCentres[destNode];
		var x = 1000 * destCoords[0],
			y = 1000 * destCoords[1];
		//console.log(destNode, destCoords);

		// Animate ship:
		d3.select("#shipSVG")
			.transition()
			.duration(duration)
			.attr("transform", "translate("+x+","+y+")");// scaleX(-1)");	// flippit

		// Call callback when done animating:
		setTimeout(function() {
			if (callback !== undefined) callback();
		}, duration);
	}

}

class Sailor {
	constructor() {
		this.name = gameText.mensNames.random();
		this.origin = gameText.places.list.random();
		this.avatarSeed = this.pickAvatarSeed();
		this.skills = this.pickSkills();
		this.age = 18 + Math.floor(30 * Math.random());
		this.xp = Math.floor(this.age / 10) + Math.floor(5 * Math.random());
		this.morale = Math.ceil(7 + 3 * Math.random());
		this.salary = Math.floor((this.age + this.xp + this.skills.length) / 3);
		this.captain = false;
		return this;
	}

	pickAvatarSeed() {
		const avSeeds = "a,b,d,e,f,g,h,i,m,n,o,p,q,r,s,t,u,v,w,x,y,z,aa,bb,cc,dd,ee,ff,gg,ii,jj,kk,ll,nn,oo,pp,tt,ww,yy,zz,2,3,5,6,7,8,12,14,15,16,17,19,20,22,24,25,27,28,29,31,32,33,34,35,36,37,39,40,42,44,45,46,47,48,49".split(",");
		return avSeeds.random();
	}

	pickSkills() {
		const skillList = "Combat, Navigation, Seafaring, Fishing, Cartography, Carpentry, Weaponry, Rowing, Music, Philosophy".split(", ");
		// Give the sailor 1 or 2 skills:
		var skills = [skillList.random()];
		if (Math.random() > 0.5) {
			var skill2 = skillList.random();
			if (!skills.includes(skill2)) skills.push(skill2);
		}
		return skills;
	}

	renderAvatar(className = "") {
		// Includes tooltip text
		return `<img class="ui avatar image ${className}"
		data-title="${this.name} of ${this.origin}"
		data-content="${this.skills.join(", ")}"
		src="https://avatars.dicebear.com/v1/male/${this.avatarSeed}\/45.png">`;
	}

	showStats() {
		return `${this.renderAvatar()}
				<p><b>Age:</b> <data>${this.age}</data> | <b>XP:</b> <data>${this.xp}</data></p>
				<p><b>Skills:</b> <data>${this.skills.join(", ")}</data></p>
				<p><b>Salary:</b> <data>${this.salary}</data> gold/year</p>`;
	}
}

class Town {	// eslint-disable-line
	constructor(ptIndex, x,y) {
		this.name = gameText.places.list.random();
		this.ptIndex = ptIndex;
		this.location = {x: x, y: y};	// TODO lookup x & y
		this.size = 5;
		this.sailors = 2;	// available on demand or quota'd?
		this.buying = [];
		this.selling = [];
		this.status = "atWar";	// must start atWar
		this.peaceEvent = null;
		this.warEvent = null;
		this.visited = false;
		return this;
	}

	peaceTimeEvent() {
		if (!this.peaceEvent) {
			// Choose an event based on city name + salt:
			var seed = (this.name + salt).hashCode();
			console.log('seed', seed);
			seed = Math.abs(seed) % gameText.peaceTimeEvents.length;
			console.log('seedmod', seed);
			var event = gameText.peaceTimeEvents[seed];
			event.heading = `The townsfolk of <span class="town">${this.name}</span>
			invite you to ${event.article} ${event.title}.`;
			event.link = `<a href="${event.url}" target="_blank">Learn more...</a>`;
			event.desc = event.desc + "<br><br>" + event.link;
			event.content = "";
			event.extra = "";
			event.buttons = {
				yes: "Accept",
				no: "Decline"
			};
			// Specify callbacks for event's action buttons:
			// Accept: reward
			event.callback1 = function() {
				this.status = 'null';
				var gift = event.reward.types.random(),
					range = event.reward.max - event.reward.max,
					quantity = event.reward.min + Math.floor(range * Math.random());
				ui.popups.giftPopup(gift, quantity, `the townspeople of ${this.name}`);
			}.bind(this);	// 2nd param becomes 1st when fn called

			// Decline: godReaction
			event.callback2 = function() {
				this.status = 'null';
				var god = gameText.gods.random(),
					delta = -0.5;
				ui.popups.godReactionPopup(god.name, delta);
			};

			// Store event as property of city:
			this.peaceEvent = event;
		}
		else {
			// Fully-populated event already stored as property:
			event = this.peaceEvent;
		}
		ui.renderModalCard(event);
	}

	underAttack() {
		if (!this.warEvent) {
			// Choose an event based on city name + salt:
			var seed = (this.name + salt).hashCode();
			console.log('seed', seed);
			seed = Math.abs(seed) % gameText.monsterEvents.length;
			console.log('seedmod', seed);
			var event = gameText.monsterEvents[seed];
			console.log(event);
			event.heading = `<h2>Attention all heroes!</h2>
			<span class="town">${this.name}</span> is being terrorised by
			<span class="monster">${event.article} ${event.name}</span>!`;
			event.link = `<a href="${event.url}" target="_blank">Learn more...</a>`;
			event.desc = event.text + "<br><br>" + event.link;
			event.content = "";
			event.extra = `<h3>Will you fight <span class="monster">${event.article} ${event.name}</span>?</h3>`;
			event.buttons = {
				yes: "Fight",
				no: "Flee"
			};
			// Specify callbacks for event's action buttons:
			// Fight: pre-combat
			event.callback1 = function() {
				ui.modals.preCombatCard(event);
			};
			// Flee: godReaction
			event.callback2 = function() {
				var god = gameText.gods.random(),
					delta = -0.5;
				ui.popups.godReactionPopup(god.name, delta);
				ui.renderPopup({
					heading: "Your men fled back to the ship.",
					content: `<span class="monster">${event.name}</span> continues to harrass <span class="monster">${this.name}</span>.`,
					buttons: {yes: "OK"},
					callback1: () => false
				});
			}.bind(this);

			// Store event as property of city:
			this.warEvent = event;
		}
		else {
			// Fully-populated event already stored as property:
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

	offerTrade() {
		this.inventTrades();	// populates this.buying, this.selling
		// Pop up trading interface:
		ui.modals.traderCard(this.buying, this.selling);
	}

	offerRecruits(num) {
		var recruits = [];
		while (num > 0) {
			recruits.push(new Sailor());
			num--;
		}
		// Pop up recruitment interface:
		ui.modals.recruitmentCard(recruits);
	}

	visit() {
		this.visited = true;
		currentCity = this;
		// When you visit, things can happen conditionally in this order:
		if (this.status === 'atWar') this.underAttack();
		else if (this.status === 'atPeace') this.peaceTimeEvent();
		else if (myship.crew.length < 8) this.offerRecruits(2 + Math.floor(3 * Math.random()));
		else if (Math.random() > 0.5) this.offerTrade();
		else {
			endTurn();
		}
	}
}

function endTurn() {
	player.turns += 1;
	if (player.turns % 12 === 0) {
		player.year--;
		ui.popups.salary();
	}
	ui.sidebars.updateAll();
	if (player.trophies.length === 15) ui.popups.gameOverPopup('win');
	reSalt();
}
