/* global $, gameText */

var ship1 = new Ship();
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

var man1 = new Sailor();
var man2 = new Sailor();
var man3 = new Sailor();
var man4 = new Sailor();
var man5 = new Sailor();
var man6 = new Sailor();
console.log(man1);

player.ships[0].addCrew([man1, man2, man3, man4, man5, man6]);

var ui = {
	shipDiv: $(".ui .item:last-child"),

	renderShip: function(sid) {
		console.log(s);
		var s = player.ships[sid];
		var l = player.ships.length;
		var prev = player.ships[sid-1] % l;
		var next = player.ships[sid+1] % l;
		var html = `
		<div class="ship_stats" id="ship${sid}">
			<div>
				<i class="angle double left icon" onclick="ui.renderShip(${prev})"></i>
				<i class="angle double right icon" onclick="ui.renderShip(${next})"></i>
			</div>
			<h2>${s.name}</h2>
			<h3>${s.type}</h3>
			<p>Speed: ${s.speed}</p>
			<dl>
				<dt>Gold</dt><dd>${s.gold}</dd>
				<dt>Food</dt><dd>${s.food}</dd>
				<dt>Wine</dt><dd>${s.wine}</dd>
			</dl>
			<h4>Crew</h4>
			<ul class="crew">
				${ui.renderCrew(s.crew)}
			</ul>
		</div>`;
		// Render
		ui.shipDiv.html(html);
	},

	renderCrew: function(sailors) {
		var html = "";
		sailors.forEach(function(s) {
			html += "<li class='avatar'>" + s.renderAvatar(); + "</li>";
		});
		return html;
	},

	renderSailorCard: function(sailor) {
		var card = $("<div>")
			.addClass("sailor modal")
			.append(sailor.showStats());
		$("#ui").append(card);
	},

	renderModalCard: function(params) {
		var cardHtml = `
		<div class="ui small modal">
			<div class="header">${params.title}</div>
			<div class="image content">
				<img class="image" src="http://lorempixel.com/200/200/animals">
				<div class="description">
					<p>${params.desc}</p>
				</div>
			</div>
			<div class="content">
				<p>${params.content}</p>
			</div>
			<div class="actions">
				<div class="ui approve button">${params.buttons.yes}</div>
				<div class="ui cancel button">${params.buttons.no}</div>
			</div>
		</div>
		`;
		$(".modal").remove();
		$(".pushable").append(cardHtml);
		$(".small.modal").modal('show');
	},

	// A smaller modal with text and a dismissal button
	renderPopup: function(params) {
		var cardHtml = `
		<div class="ui tiny modal">
			<div class="header">${params.title}</div>
			<div class="content">
				<p>${params.content}</p>
			</div>
			<div class="actions">
				<div class="ui cancel button">${params.buttons.no}</div>
			</div>
		</div>
		`;
		// TODO: allow different number of buttons
		$(".modal").remove();
		$(".pushable").append(cardHtml);
		$(".tiny.modal").modal('show');
	},

	godReaction: function(god, delta) {
		// TODO: random gods
		ui.renderPopup({
			title: "The Oracle says...",
			content: (delta > 0) ? god + " liked this! 👌" : god + " didn't like that! 😡",
			buttons: {yes: "OK", no: "more..."}
		});
		// TODO: add delta to God's counter
	},

	godInfo: function(god) {
		var params = gameText.gods.filter(g => g.name === god)[0];
		params.buttons = {yes: "OK", no: "OK"};
		ui.renderModalCard(params);
	},

	trophyInfo: function(trophy) {
		var params = gameText.trophies.filter(t => t.name === trophy)[0];
		params.buttons = {yes: "OK", no: "OK"};
		ui.renderModalCard(params);
	},

	gift: function(gift, quantity, from) {
		ui.renderPopup({
			title: "You received a gift from " + from,
			content: `${from} gave you ${quantity} ${gift}!`,
			buttons: {yes: "OK", no: "OK"}
		});
		// TODO: add gift to player
	}

};

ui.renderShip(0);	// ok

// Test combat:
var mEvent = gameText.monsterEvents.random();
var m = new Enemy(mEvent);
var res = combat(ship1.crew, m);
console.log(res);
