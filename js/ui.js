/* global player, $, gameText */

function capitalise(word) {
	return word[0].toUpperCase() + word.substr(1);
}

var recruits = [];

var ui = {
	// Full re-render of all sidebar panels
	updateSidebars: function() {
		ui.renderShipInfo(0);
		ui.renderYear();
		ui.renderGold();
		ui.renderTrophies();
		ui.renderGods();
	},

	// Render a ship's stats in left sidebar
	renderShipInfo: function(sid = 0) {
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
		ui.makePopups();
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
		ui.makePopups();
	},

	// Render the gods faces display in right sidebar
	renderGods: function() {
		var godsHtml = "";
		for (var god of gameText.gods) {
			var score = player.godFavours[god.name.toLowerCase()],
				scoreClass = "score"+Math.floor(score);

			godsHtml += `<div class="god ${god.name.toLowerCase()} ${scoreClass}"
							data-title="${god.name}"
							data-content="${god.desc}"
							data-score="${score}">
							</div>`;
		}
		$("#gods-ui").html(godsHtml);
		ui.makePopups();
	},

	// The main 2-button modal card, used for most events
	renderModalCard: function(params) {
		params.extra = params.extra || "";
		var cardHtml = `
		<div class="ui small modal">
			<div class="header">
				${params.heading}
			</div>
			<div class="image content">
				<img class="image" src="${params.img}">
				<div class="description">
					<p>${params.desc}</p>
				</div>
			</div>
			<div class="content">
				<p>${params.content}</p>
				<p>${params.extra}</p>
			</div>
			<div class="actions">
				${ui.renderButtons(params.buttons)}
			</div>
		</div>
		`;
		$("#modal .modal").remove();
		$("#modal").append(cardHtml);
		//$(".small.modal").modal('show');
		$('#modal .small.modal')
		.modal({
			closable: false,
			// Wiring up of buttons to passed callback functions:
			onApprove : function() {
				params.callback1();
			},
			onDeny: function() {
				params.callback2();
			}
		})
		.modal('show');	// Moves div outside of game area BUG?
	},

	renderButtons: function(buttons) {
		var html = `<div class="ui buttons large">`;
		if (buttons.yes) html += `<button class="ui approve button huge blue">${buttons.yes}</button>`;
		if (buttons.yes && buttons.no) html += `<div class="or"></div>`;
		if (buttons.no) html += `<button class="ui cancel button huge grey">${buttons.no}</button>`;
		html += "</div>";
		return html;
	},

	// A generic smaller modal with text and 1 dismissal button
	renderPopup: function(params) {
		var cardHtml = `
		<div class="ui tiny modal">
			<div class="header">${params.heading}</div>
			<div class="content">
				<p>${params.content}</p>
			</div>
			<div class="actions">
				${ui.renderButtons(params.buttons)}
			</div>
		</div>
		`;
		$("#modal .modal").remove();
		$("#modal").append(cardHtml);
		//$("#modal .tiny.modal").modal('show');
		$('#modal .tiny.modal')
		.modal({
			closable: true,
			// Wiring up of buttons to passed callback functions:
			onApprove : function() {
				params.callback1();
			},
			onDeny: function() {
				params.callback2();
			}
		})
		.modal('show');	// Moves div outside of game area BUG?
	},

	clearModals: function() {
		$(".modal").remove();
	},

	modals: {
		// Modal container for choosing combatants	//TODO
		preCombatCard: function(monster) {
			var ship = player.ships[0];
			var sailors = ship.crew.filter(s => s !== ship.captain);
			var sailorInputs = sailors.map(s => {
				return `<span><input type="checkbox" value="" checked>${s.renderAvatar()}</span>`;
			});
			console.log(sailorInputs);
			var params = {
				heading: `How many will fight ${monster.article} ${monster.name}?`,
				content: "Choose the men you will send into combat. The more warriors, the better their chances of victory - but the higher the risk.",
				extras: sailorInputs.join("") + "<p><span>0</span> men selected</p>",
				buttons: {yes: "Fight!"}
			};
			ui.renderModalCard(params);
		},

		// Results of combat info
		postCombatCard: function(monster, result) {
			var params = {};

			if (result.code > 0) {
				params.title = "Victory!";
				params.content = (result.code > 1) ?
					`Your men proved valiant enough to slay the ${monster.name}.` :
					`The ${monster.name} ran away when the going got tough.`;	// FIXME plurals
				params.buttons = {yes: "Continue"};
				// Wire up button:
				params.callback1 = function() {
					setTimeout(function() {
						gainTrophy();
					}, 750);
					return false;
				};
			}
			else if (result.code === 0) {
				params.title = "Defeated.";
				params.content = `The ${monster.name} was too strong. Your men were unable to hold it off.`;
				params.extras = `
					<h4>The following men were lost in the battle:</h4>
					${result.losses.map(s => s.renderAvatar('dead')).join("")}
				`;	// FIXME
				params.buttons = {no: "Continue"};
				params.callback2 = () => false; // Simply dismiss
			}

			ui.renderModalCard(params);
		},

		// Modal for viewing Sailor's stats, promotion or dismissal
		sailorInfoCard: function(sailor) {		// TODO
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

			var items = data.map(i => {		// TODO: wire up buy buttons
				return `
				<div class="ui pointing item">
					<i class="${i.name} icon"></i>
					${i.name} @ ${i.price}/${i.unit}
					<div class="menu">
						<div class="item" onclick="doTrade(${i.name,i.price,1})">Buy 1</div>
						<div class="item" onclick="doTrade(${i.name,i.price,5})">Buy 5</div>
						<div class="item" onclick="doTrade(${i.name,i.price,10})">Buy 10</div>
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
				heading: "Recruitment",
				desc: "Some local talent is available for hire.",
				content: ui.sailorPicker(sailors),
				buttons: {no: "Done"},
				callback2: () => false	// Simply dismiss
			};

			ui.renderModalCard(params);
		},

		// Further info popup
		trophyInfoCard: function(trophy) {
			var link = `<a href="${trophy.url}" target="_blank">Learn more...</a>`;
			var params = {
				heading: "Trophy Achieved!",
				img: trophy.img,
				desc: `For your recent accomplishment, you were awarded the ${trophy.name}.`,
				content: trophy.text + "<br><br>" + link,
				buttons: {yes: "OK"},
				callback1: () => false	// Simply dismiss
			};
			ui.renderModalCard(params);
			ui.renderTrophies();
		},

		// Further info popup
		godInfoCard: function(god) {
			var params = gameText.gods.filter(g => g.name === god)[0];
			params.buttons = {yes: "OK"};
			ui.renderModalCard(params);
		}

	},

	popups: {
		// Brief message popup, 1 button
		godReactionPopup: function(god, delta) {
			ui.renderPopup({
				heading: "The Oracle says...",
				content: (delta > 0) ? capitalise(god) + " liked this! 👌"
									: capitalise(god) + " didn't like that! 😡",
				buttons: {yes: "OK"},
				callback1: () => false	// Simply dismiss
			});
			// Also update data:
			player.godFavours[god] += delta;
			ui.renderGods();
		},

		// Received gift popup, 1 button
		giftPopup: function(gift, quantity, from) {
			ui.renderPopup({
				heading: "You received a gift from " + from,
				content: `${from} gave you ${quantity} ${gift}! <i class="gameitem ${gift}"></i>`,	// TODO plurals
				buttons: {yes: "OK"},
				callback1: () => false	// Simply dismiss
			});
			// Also update data:
			if (gift === "gold") player.gold += quantity;
			else player.ships[0].supplies[gift] += quantity;
			ui.renderShipInfo();
		},

		// Fishing haul popup, 1 button
		fishPopup: function(quantity) {
			ui.renderPopup({
				heading: "A helping hand from Poseidon",
				content: `You caught ${quantity} crates of fish <i class="gameitem fish"></i>`,
				buttons: {yes: "OK"},
				callback1: () => false	// Simply dismiss
			});
			// Also update data:
			player.ships[0].supplies.fish += quantity;
			ui.renderShipInfo();
		},

		// Game over info, win/loss, 1 button
		gameOverPopup: function(type) {
			var params = {
				heading: "Game Over!",
				content: "You won!",
				buttons: {yes: "Play again"},
				callback1: () => { window.location.reload(); }
			};
			if (type === 'loss') params.content = "You lost.";
			// TODO: rating widget? ajax metrics message?
			ui.renderPopup(params);
		}
	},

	// Sailor recruitment interface
	sailorPicker: function(sailors) {
		// Store them outside, so buttons can see who to hire:
		recruits = sailors;
		// Present grid of 2-4 sailor info cards:
		var html = `<div class="ui two cards">`;
		for (var i = 0; i < recruits.length; i++) {
			var s = recruits[i];
			//html += s.showStats();
			html += `
				<div class="card" data-rid=${i}>
			    	<div class="content">
			      		<div class="header">
							${s.renderAvatar()}
							${s.name} of ${s.origin}
						</div>
			      		<div class="description">
							<p><b>Age:</b> ${s.age} | <b>XP:</b> ${s.xp}</p>
							<p><b>Skills:</b> ${s.skills.join(", ")}</p>
			      		</div>
			    	</div>
			    	<div class="ui bottom attached button" onclick="hire(${i})">
			      		<i class="add icon"></i>
			      		Hire (${s.salary} gold)
			    	</div>
			  	</div>`;
		}
		html += `</div>`;
		return html;
	},

	// Enable Semantic UI tooltips:
	makePopups: function() {
		$('#gamearea .ui .crew img').popup({position: "top left"});
		$('.upgrades i').popup({position: "top left"});
		$('#trophies-ui a').popup({position: "top right"});
		$('#gods-ui div').popup({position: "top right"});

	}

};

function hire(i) {
	player.ships[0].addCrew(recruits[i]);
	ui.renderShipInfo();
	// Remove card:
	$(`.modal .card[data-rid="${i}"]`).remove();
}

function gainTrophy() {
	// Select one randomly which we don't yet have:
	var newTrophy = gameText.trophies.filter(t => !player.trophies.includes(t)).random();
	console.log(newTrophy);
	player.trophies.push(newTrophy);
	ui.modals.trophyInfoCard(newTrophy);
}
