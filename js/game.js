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
console.log(man2.showStats());

ship1.addCrew([man1, man2, man3, man4, man5, man6]);

var ui = {
	ships: $("#ui_ships"),

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
			<div class="card modal">
				<h1>Title</h1>
				<p>Text</p>
				<img src="">
				<button value="1">OK</button>
				<button value="2">Cancel</button>
			</div>`;
		$("#ui").append(cardHtml);
	}
};

ui.renderShip(ship1);	// ok
ui.renderSailorCard(man1);
ui.renderModalCard();
