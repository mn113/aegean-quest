/* global $, gameText, Ship, Sailor */

// Seeding
var salt = new Date().getHours() % 4;	// changes every 15 minutes
console.log('salt', salt);

var player = {
	ships: [new Ship()],
	gametime: 0,	// TODO: timer
	year: makeYear(),
	// 12 turns = 1 year
	turns: 0,		// change game salt every 15 minutes or every 10 turns?
	gold: 100,
	trophies: [],
	godFavours: {
		"Poseidon": 0,
		"Uranus": 0,
		"Demeter": 0,
		"Hephaestus": 0,
		"Artemis": 0,
		"Ares": 0
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

var ui = {
	// Render a ship's stats in left sidebar
	renderShipInfo: function(sid) {
		var s = player.ships[sid];
		var l = player.ships.length;
		console.log(s);
		var prev = player.ships[sid-1] % l;
		var next = player.ships[sid+1] % l;
		var html = `
		<div class="ship_stats" id="ship${sid}">
			<!--div>
				<i class="angle double left icon" onclick="ui.renderShip(${prev})"></i>
				<i class="angle double right icon" onclick="ui.renderShip(${next})"></i>
			</div-->
			<h2>“${s.name}”</h2>
			<h3>${s.type} class</h3>
			<p>Speed: ${s.speed}</p>
			<div class="upgrades">
				${ui._renderShipUpgrades(s.upgrades)}
			</div>
			<div class="supplies">
				${ui._renderShipSupplies(s.supplies)}
			</div>
			<h4>Crew</h4>
			<ul class="crew">
				${ui._renderCrew(s.captain, s.crew)}
			</ul>
		</div>`;
		// Render
		$("#ship-ui").html(html);
	},

	_renderShipUpgrades: function(upgrades) {
		var html = "";
		for (var u of upgrades) {
			html += `<i class="gameitem ${u.className}"
					data-title="${u.name}"
					data-content="${u.desc}"
					></i>`;
		}
		return html;
	},

	_renderShipSupplies: function(supplies) {
		return `
			<p><i class="gameitem bread"></i>Bread: ${supplies.bread}</p>
			<p><i class="gameitem wine"></i>Wine: ${supplies.wine}</p>
			<p><i class="gameitem chicken"></i>Chickens: ${supplies.chicken}</p>
			<p><i class="gameitem fish"></i>Fish: ${supplies.fish}</p>
		`;
	},

	// Render a list of avatars
	_renderCrew: function(captain, sailors) {
		var html = "<li class='avatar gold'>" + captain.renderAvatar() + "</li>";
		sailors.filter(s => s !== captain)
		.forEach(function(s) {
			html += "<li class='avatar'>" + s.renderAvatar(); + "</li>";
		});
		return html;
	},

	renderYear: function() {
		$("#year-ui").html(player.year + " BC");
	},

	// Render the player's gold amount in right sidebar
	renderGold: function() {
		var iconClass = (player.gold > 200) ? "gold-high" : (player.gold > 50) ? "gold-med" : "gold-low";
		$("#gold-icon").removeClass("gold-high gold-med gold-low").addClass(iconClass);
		$("#gold-ui").html(player.gold);
	},

	// Render the player's trophy icons in right sidebar
	renderTrophies: function() {
		var trophies = "";
		for (var t of player.trophies) {
			trophies += `<a class="gameitem ${t.className}"
		 					data-title="${t.name}"
							data-content="${t.desc}"
							onclick="ui.modals.trophyInfoCard(${t.className})">&nbsp;</a>`;
		}
		$("#trophies-ui").html(trophies);
	},

	renderGods: function() {

	},

	// The main 2-button modal card, used for most events
	renderModalCard: function(params) {
		params.extra = params.extra || "";
		var cardHtml = `
		<div class="ui small modal">
			<div class="header">${params.title}</div>
			<div class="image content">
				<img class="image" src="${params.img}">
				<div class="description">
					<p>${params.desc}</p>
				</div>
			</div>
			<div class="content">
				<p>${params.content}</p>
				<div>${params.extra}</div>
			</div>
			<div class="actions">
				${ui.renderButtons(params.buttons)}
			</div>
		</div>
		`;
		$(".modal").remove();
		$("#game-centre").append(cardHtml);
		$(".small.modal").modal('show');
	},

	renderButtons: function(buttons) {
		var html = `<div class="large buttons">`;
		if (buttons.yes) html += `<div class="ui approve button">${buttons.yes}</div>`;
		if (buttons.no) html += `<div class="ui cancel button">${buttons.no}</div>`;
		html += "</div>";
		return html;
	},

	// A generic smaller modal with text and 1 dismissal button
	renderPopup: function(params) {
		var cardHtml = `
		<div class="ui tiny modal">
			<div class="header">${params.title}</div>
			<div class="content">
				<p>${params.content}</p>
			</div>
			<div class="actions">
				${ui.renderButtons(params.buttons)}
			</div>
		</div>
		`;
		$(".modal").remove();
		$("#game-center").append(cardHtml);
		$(".tiny.modal").modal('show');
	},

	clearModals: function() {
		$(".modal").remove();
	},

	modals: {
		// Modal container for choosing combatants
		preCombatCard: function(monster) {
			var ship = player.ships[0];
			var sailors = ship.crew.filter(s => s !== ship.captain);
			var sailorInputs = sailors.map(s => {
				return `<span><input type="checkbox" value="" checked>${s.renderAvatar()}</span>`;
			});
			var params = {
				title: "How many will fight?",
				content: "Choose the men you will send into combat. The more warriors, the better their chances of victory - but the higher the risk.",
				extras: sailorInputs.join("") + "<p><span>0</span> men selected</p>",
				buttons: {yes: "Fight!"}
			};
			ui.renderModalCard(params);
		},

		// Results of combat info
		postCombatCard: function(monster, result) {
			var params = {};
			if (result.code === 2) {
				params.title = "Victory!";
				params.content = `Your men proved valiant enough to slay the ${monster.name}.`;		// FIXME plurals
			}
			else if (result.code === 1) {
				params.title = "Victory!";
				params.content = `The ${monster.name} ran away when the going got tough.`;
			}
			else if (result.code === 0) {
				params.title = "Defeated.";
				params.content = `The ${monster.name} was too strong. Your men were unable to hold it off.`;
				params.extras = `
					<h4>The following men were lost in the battle:</h4>
					${result.losses.map(s => s.renderAvatar('dead')).join("")}
				`;	// FIXME
			}

			params.buttons = {no: "Continue"};
			ui.renderModalCard(params);
		},

		// Modal for viewing Sailor's stats, promotion or dismissal
		sailorInfoCard: function(sailor) {
			var card = $("<div>")
				.addClass("sailor modal")
				.append(sailor.showStats());
			$("#ui").append(card);
		},

		// Modal container for the buy/sell interface
		traderCard: function(buying, selling) {
			var params = {
				title: "The local market",
				buttons: {
					yes: "Done trading",
					no: "No thanks"
				}
			};
			params.extras = ui.renderTradeMenu('buy', buying) + ui.renderTradeMenu('sell', selling);

			ui.renderModalCard(params);
		},

		// Renders a button with a multi-level dropdown inside it
		renderTradeMenu(type, data) {
			// Wire up player's trading functions to buttons:
			var doTrade = {
				buy: player.buy,
				sell: player.sell
			}[type];
			var buttonLabel = type.toUpperCase();

			var items = data.map(i => {
				return `
				<div class="ui pointing item">
					<i class="${i.name} icon"></i>
					${i.name} @ ${i.price}/${i.unit}
					<div class="menu">
						<div class="item">Buy 1</div>
						<div class="item">Buy 5</div>
						<div class="item">Buy 10</div>
					</div>
				</div>
				`;
			});

			var html = `
			<div class="ui floating labeled pointing icon dropdown button">
				<span class="text">${buttonLabel}...</span>
				<div class="menu">
					<div class="header">
						<i class="tags icon"></i>
						${buttonLabel}
					</div>
					<div class="divider"></div>
					${items.join("")}
				</div>
			</div>`;

			return html;
		},

		// Modal container for the recruitment interface
		recruitmentCard: function(sailors) {
			var params = {
				title: "Some local talent is available for hire:",
				buttons: {
					yes: "Hire selected",
					no: "No thanks"
				}
			};
			params.extras = ui.sailorPicker(sailors);	// TODO

			ui.renderModalCard(params);
		},

		// Further info popup
		trophyInfoCard: function(trophyClassName) {
			var params = gameText.trophies.filter(t => t.className === trophyClassName)[0];
			params.buttons = {yes: "OK", no: "more..."};
			ui.renderModalCard(params);
		},

		// Further info popup
		godInfoCard: function(god) {
			var params = gameText.gods.filter(g => g.name === god)[0];
			params.buttons = {yes: "OK", no: "OK"};
			ui.renderModalCard(params);
		},

	},

	popups: {
		// Brief message popup, 2 buttons
		godReactionPopup: function(god, delta) {
			// TODO: random gods
			ui.renderPopup({
				title: "The Oracle says...",
				content: (delta > 0) ? god + " liked this! 👌" : god + " didn't like that! 😡",
				buttons: {yes: "OK", no: "more..."}
			});
			// TODO: add delta to God's counter
		},

		// Received gift popup, 1 button
		giftPopup: function(gift, quantity, from) {
			ui.renderPopup({
				title: "You received a gift from " + from,
				content: `${from} gave you ${quantity} ${gift}!`,	// TODO language
				buttons: {yes: "OK"}
			});
			// TODO: add gift to player
		},

		// Game over info, win/loss
		gameOverPopup: function(type) {
			var params = {
				title: "Game Over!",
				buttons: {
					no: "No thanks"
				}
			};
			if (type === 'win') params.content = "You won!";
			else if (type === 'loss') params.content = "You lost.";
			// TODO: rating widget? ajax message?

			ui.renderPopup(params);
		}
	},

	sailorPicker: function() {

	}

};

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

// Test combat:
var mEvent = gameText.monsterEvents.random();
var m = new Enemy(mEvent);
var res = combat(player.ships[0].crew, m);	// ok

function endTurn() {
	player.turns += 1;
	if (player.turns % 12 === 0) {
		player.year--;
		ui.popups.salary();
	}
	updateSidebars();
}

player.trophies = gameText.trophies;

function updateSidebars() {
	ui.renderShipInfo(0);
	ui.renderYear();
	ui.renderGold();
	ui.renderTrophies();
	//ui.renderGods();
}
updateSidebars();

// Choose a year from 800-600 BC:
function makeYear() {
	return 700 + Math.floor(100 * Math.random());
}
