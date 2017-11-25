/* global $ */

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
//console.log(man2.showStats());

ship1.addCrew([man1, man2, man3, man4, man5, man6]);

var ui = {
	ships: $(".ui .item:last-child"),

	renderShip: function(s) {
		console.log(s);
		var html = `
		<div class="ship_stats" id="ship1">
			<h2>${s.name}</h2>
			<h3>Trireme</h3>
			<p>Speed: ${s.speed}</p>
			<dl>
				<dt>Gold</dt><dd>${s.gold}</dd>
				<dt>Food</dt><dd>${s.food}</dd>
				<dt>Wine</dt><dd>${s.wine}</dd>
			</dl>
			<h4>Crew</h4>
			<h5>Captain</h5>
			<div>?</div>
			<ul class="crew">
				${ui.renderCrew(s.crew)}
			</ul>
		</div>`;
		// Render
		ui.ships.html(html);
	},

	renderCrew: function(sailors) {
		var html = "";
		sailors.forEach(function(s) {
			html += "<li class='avatar'>" + s.renderAvatar(); + "</li>";
		});
		return html;
	},

	focusShip: function(id) {},

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
		$(".pushable").append(cardHtml);
		$(".small.modal").modal('show');
	}
};

ui.renderShip(ship1);	// ok

// Test combat:
var mEvent = gameText.monsterEvents.random();
var m = new Enemy(mEvent);
var res = combat(ship1.crew, m);
console.log(res);
