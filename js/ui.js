/* global player, $, gameText, combat, currentCity, myship */

function capitalise(word) {
	return word[0].toUpperCase() + word.substr(1);
}

var recruits = [];

var ui = {

	sidebars: {
		// Full re-render of all sidebar panels
		updateAll: function() {
			ui.sidebars.renderShipInfo(0);
			ui.sidebars.renderYear();
			ui.sidebars.renderGold();
			ui.sidebars.renderTrophies();
			ui.sidebars.renderGods();
		},

		// Render a ship's stats in left sidebar
		renderShipInfo: function(sid = 0) {
			var s = player.ships[sid];
			var l = s.name.length;
			var fontsize = l <= 7 ? 'large' : l <= 10 ? 'medium' : 'small';
			var html = `
			<div class="ship_stats" id="ship${sid}">
				<h2 class="shipname-${fontsize}">“${s.name}”</h2>
				<h3>${s.type} class</h3>
				<p>Speed: <data>${s.speed}</data></p>
				<div class="upgrades">
					${ui.sidebars._renderShipUpgrades(s.upgrades)}
				</div>
				<div class="supplies">
					${ui.sidebars._renderShipSupplies(s.supplies)}
				</div>
				<h4>Crew (<data>${s.crew.length} / ${s.max_crew}</data>)</h4>
				<ul class="crew">
					${ui.sidebars._renderCrew(s.crew)}
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
				<p><i class="gameitem bread"></i>Bread: <data>${supplies.bread}</data></p>
				<p><i class="gameitem wine"></i>Wine: <data>${supplies.wine}</data></p>
				<p><i class="gameitem chicken"></i>Chickens: <data>${supplies.chicken}</data></p>
				<p><i class="gameitem fish"></i>Fish: <data>${supplies.fish}</data></p>
			`;
		},

		// Render a list of avatars
		_renderCrew: function(sailors) {
			var html = "";
			for (var i = 0; i < sailors.length; i++) {
				var s = sailors[i];
				var captaincy = s.captain ? "gold" : '';
				html += `<li class='avatar ${captaincy}'
						onclick="ui.modals.sailorInfoCard(${i})">
							${s.renderAvatar()}
						</li>`;
			}
			return html;
		},

		renderYear: function() {
			$("#year-ui").html(`<data>${player.year}</data> BC`);
		},

		// Render the player's gold amount in right sidebar
		renderGold: function() {
			var iconClass = (player.gold > 200) ? "gold-high" : (player.gold > 50) ? "gold-med" : "gold-low";
			var html = `
			<div class="yellow inverted statistic">
				<i class="gameitem ${iconClass}"></i>
				<span><data>${player.gold}</data> Gold</span
			</div>`;
			$("#gold-ui").html(html);
		},

		// Render the player's trophy icons in right sidebar
		renderTrophies: function() {
			var trophies = "";
			for (var t of player.trophies) {
				trophies += `<a class="gameitem ${t.className}"
			 					data-title="${t.name}"
								onclick="ui.modals.trophyInfoCard(${t.className})">&nbsp;</a>`;
			}
			var html = `<h5>Trophies (<data>${player.trophies.length} / ${gameText.trophies.length}</data>)</h5>
						<div>${trophies}</div>`;
			$("#trophies-ui").html(html);
			ui.makePopups();
		},

		// Render the gods faces display in right sidebar
		renderGods: function() {
			var heading = "<h5>Gods</h5>";
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
			$("#gods-ui").html(`${heading}<div>${godsHtml}</div>`);
			ui.makePopups();
		}
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
				<p class="extra">${params.extra}</p>
			</div>
			<div class="actions">
				${ui.renderButtons(params.buttons)}
			</div>
		</div>
		`;
		$("#modal .modal").remove();
		$("#modal").append(cardHtml);
		$('#modal .small.modal')
		.modal({
			closable: false,
			context: "#gamearea",
			transition:	"scale",
			duration: 300,
			queue: true,
			// Wiring up of buttons to passed callback functions:
			onApprove : function() {
				params.callback1();
			},
			onDeny: function() {
				params.callback2();
			}
		})
		.modal('show');
	},

	renderButtons: function(buttons) {
		var html = `<div class="ui buttons large">`;
		if (buttons.yes) html += `<button class="ui approve button huge orange">${buttons.yes}</button>`;
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
		$('#modal .tiny.modal')
		.modal({
			closable: true,
			context: "#gamearea",
			transition:	"scale",
			duration: 300,
			queue: true,
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
		// Modal container for choosing combatants:
		preCombatCard: function(monster) {
			var sailors = myship.crew.filter(s => s !== myship.captain);
			var sailorInputs = sailors.map(s => {
				return `<span class="sailor-checkbox-wrap"><input type="checkbox" value="${s.name} of ${s.origin}" checked>${s.renderAvatar()}</span>`;
			});
			var params = {
				heading: `How many will fight ${monster.article} ${monster.name}?`,
				img: "",
				desc: "",
				content: "Choose the men you will send into combat. The more warriors, the better their chances of victory - but the higher the risk.",
				extra: sailorInputs.join("") + `<p><data id="checkedCount">${sailorInputs.length}</data> men selected</p>`,
				buttons: {yes: "Fight!"}
			};
			params.callback1 = function() {
				// Send the selected men to the fight:
				var checked = $(".sailor-checkbox-wrap :checkbox:checked")
					.map(function() {
						return this.value;
					}).get();
				var chosenSailors = sailors.filter(s => checked.includes(`${s.name} of ${s.origin}`));
				console.log(chosenSailors);
				var outcome = combat(chosenSailors, monster);
				setTimeout(function() {
					ui.modals.postCombatCard(monster, outcome);
				}, 750);
			};
			ui.renderModalCard(params);
			$(".sailor-checkbox-wrap .avatar").popup();
		},

		// Results of combat info
		postCombatCard: function(monster, result) {
			var params = {};

			if (result.code > 0) {
				params.heading = "Victory!";
				params.desc = (result.code > 1) ?
					`Your men proved valiant enough to slay the ${monster.name}.` :
					`The ${monster.name} ran away when the going got tough.`;	// FIXME plurals
				params.img = monster.img;
				params.content = "";
				params.buttons = {yes: "Continue"};
				// Wire up button:
				params.callback1 = function() {
					setTimeout(function() {
						gainTrophy();
					}, 750);
					return false;
				};
				currentCity.status = 'atPeace';
			}
			else if (result.code === 0) {
				params.heading = "Defeated.";
				params.desc = `The ${monster.name} was too strong. Your men were unable to hold it off.`;
				params.img = monster.img;
				params.content = "";
				params.extra = `
					<h4>The following men were lost in the battle:</h4>
					${result.losses.map(s => s.renderAvatar('dead') + `<span>${s.name} of ${s.origin}</span>`).join("")}
				`;	// FIXME
				params.buttons = {no: "Continue"};
				params.callback2 = () => false; // Simply dismiss
			}

			ui.renderModalCard(params);
		},

		// Modal for viewing Sailor's stats, promotion or dismissal
		sailorInfoCard: function(index) {
			// Retrieve Sailor object from crew by index:
			var sailor = myship.crew[index];
			var params = {
				heading: `${sailor.name} of ${sailor.origin}`,
				content: sailor.showStats(),
				buttons: {
					yes: "OK",
					no: "Fire him"
				},
				callback1: () => false,
				callback2: () => myship.fireMan(index)
			};

			ui.renderPopup(params);
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
			params.extras = ui.modals._renderTradeMenu('buy', buying) + ui.modals._renderTradeMenu('sell', selling);

			ui.renderModalCard(params);
		},

		// Renders a button with a multi-level dropdown inside it
		_renderTradeMenu(type, data) {
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
				desc: `For your recent accomplishment, you were awarded the <b>${trophy.name}</b>.`,
				content: trophy.text + "<br><br>" + link,
				buttons: {yes: "OK"}
			};
			params.callback1 = function() {
				// Revisit city once the trophy is dismissed:
				currentCity.visit();
				return false;
			};
			ui.renderModalCard(params);
			ui.sidebars.renderTrophies();
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
			ui.sidebars.renderGods();
		},

		// Received gift popup, 1 button
		giftPopup: function(gift, quantity, from) {
			ui.renderPopup({
				heading: "You received a gift!",
				content: `${from} gave you <data>${quantity}</data> ${gift}!
				<i class="gameitem ${gift}"></i>`,	// TODO plurals
				buttons: {yes: "OK"},
				callback1: () => false	// Simply dismiss
			});
			// Also update data:
			if (gift === "gold") player.gold += quantity;
			else myship.supplies[gift] += quantity;
			ui.sidebars.renderShipInfo();
			ui.sidebars.renderGold();
		},

		// Fishing haul popup, 1 button
		fishPopup: function(quantity) {
			ui.renderPopup({
				heading: "A helping hand from Poseidon",
				content: `You caught <data>${quantity}</data> crates of fish <i class="gameitem fish"></i>`,
				buttons: {yes: "OK"},
				callback1: () => false	// Simply dismiss
			});
		},

		// Fishing haul popup, 1 button
		insufficient: function(type) {
			ui.renderPopup({
				heading: "Insufficient " + type,
				content: `It will take more ${type} to be able to do that.`,
				buttons: {yes: "OK"},
				callback1: () => false	// Simply dismiss
			});
		},

		// Game over info, win/loss, 1 button
		gameOverPopup: function(type) {
			var params = {
				heading: "Game Over!",
				content: "You won!",	// TODO: win/loss images
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
			html += `
				<div class="card" data-rid=${i}>
			    	<div class="content">
			      		<div class="header">
							${s.name} of ${s.origin}
						</div>
			      		<div class="description">
							${s.showStats()}
			      		</div>
			    	</div>
			    	<div class="ui bottom attached button" onclick="myship.hireMan(${i})">
			      		<i class="add icon"></i>
			      		Hire him
			    	</div>
			  	</div>`;
		}
		html += `</div>`;
		return html;
		// Remove card: FIXME
		// $(`.modal .card[data-rid="${i}"]`).remove();
	},

	// Enable Semantic UI tooltips:
	makePopups: function() {
		$('#gamearea .ui .crew img').popup({position: "top left"});
		$('.upgrades i').popup({position: "top left"});
		$('#trophies-ui a').popup({position: "top right"});
		$('#gods-ui div').popup({position: "top right"});

	}

};

function gainTrophy() {
	// Select one randomly which we don't yet have:
	var newTrophy = gameText.trophies.filter(t => !player.trophies.includes(t)).random();
	console.log(newTrophy);
	player.trophies.push(newTrophy);
	ui.modals.trophyInfoCard(newTrophy);
}
