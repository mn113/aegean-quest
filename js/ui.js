/* global player, $, gameText */

function capitalise(word) {
	return word[0].toUpperCase() + word.substr(1);
}

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

	// Render the gods faces display in right sidebar
	renderGods: function() {
		var godsHtml = "";
		for (var godName of Object.keys(player.godFavours)) {
			var score = player.godFavours[godName],
				scoreClass = "score"+Math.floor(score);
			godsHtml += `<div class="god ${godName} ${scoreClass}"
							data-title="${capitalise(godName)}"
							data-score="${score}">
							</div>`;
		}
		$("#gods-ui").html(godsHtml);
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
			params.buttons = {yes: "OK"};
			ui.renderModalCard(params);
		},

		// Further info popup
		godInfoCard: function(god) {
			var params = gameText.gods.filter(g => g.name === god)[0];
			params.buttons = {yes: "OK"};
			ui.renderModalCard(params);
		}

	},

	popups: {
		// Brief message popup, 2 buttons
		godReactionPopup: function(god, delta) {
			ui.renderPopup({
				heading: "The Oracle says...",
				content: (delta > 0) ? god + " liked this! 👌" : god + " didn't like that! 😡",
				buttons: {yes: "OK", no: "more..."}
			});
			// Also update data:
			player.godFavours[god.name] += delta;
		},

		// Received gift popup, 1 button
		giftPopup: function(gift, quantity, from) {
			ui.renderPopup({
				heading: "You received a gift from " + from,
				content: `${from} gave you ${quantity} ${gift}!`,	// TODO plurals
				buttons: {yes: "OK"}
			});
			// Also update data:
			if (gift === "gold") player.gold += quantity;
			else player.supplies[gift] += quantity;
		},

		// Game over info, win/loss
		gameOverPopup: function(type) {
			var params = {
				heading: "Game Over!",
				content: "You won!",
				buttons: {yes: "Play again"}
			};
			if (type === 'loss') params.content = "You lost.";
			// TODO: rating widget? ajax metrics message?

			ui.renderPopup(params);
		}
	},

	sailorPicker: function() {

	}

};
