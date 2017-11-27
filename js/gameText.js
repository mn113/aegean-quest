var gameText = {
	"placeNames": {
		"list": ["Athens","Knossos","Rhōmanía","Abydos","Agathḗ Týkhē","Áŋkyra","Adrianoúpolis","Athḗnai","Aigaíon Pélagos","Aígyptos","Aithiopía","Aiolís","Aítna","Aitōlía","Akarnanía","Akrágas","Albanía","Aleksándreia","Aleksandrétta","Halikarnassós","Amphípolis","Anatolḗ","Antarktikḗ","Antiókheia","Antípolis","Apoulía","Arabía","Argolís","Árgos","Arkadía","Armenía","Asía","Attikḗ","Australía","Aphrikḗ","Akhaḯa","Babylōn","Babylōnía","Baktrίa","Benetía","Bēthleém","Bērytós","Bithynía","Blakhía","Boiōtía","Boulgaría","Bretanía","Bysdántion","Galatía","Galilaía","Gallía","Germanía","Geōrgía","Dakía","Damaskós","Delphoí","Dyrrhákhion","Dōdekánēsa","Elaía","Helbetía","Helíkē","Hellás","Empórion","Erétria","Erythraía","Eúboia","Eurṓpē","Éphesos","Ḗpeiros","Hērákleia","Theodosía","Thessalía","Thessaloníkē","Thḗbai","Thḗra","Thoúrioi","Thrákē","Ialyssós","Ibería","Ierichṓ","Hierousalḗm","Ithákē","Ikónion","Illyría","Indíai","Indonēsía","Ióppē","Ioudaía","Hispanía","Israḗl","Italía","Iōnía","Kaisareia","Kalabría","Kámeiros","Kampánia","Kappadokía","Karía","Karpáthia","Kárpathos","Karkhēdṓn","Kaspía","Katánē","Kérkyra","Kilikía","Knidos","Knōssόs","Kolophṓn","Kόrinthos","Krḗtē","Krótōn","Kýsdikos","Kykládes","Kýmē","Kýpros","Kyrēnaïkḗ","Kyrḗnē","Kōnstantinoúpolis","Kōs","Lakōnía","Lamía","Lámpsakos","Laodikeia","Lésbos","Leukōsía","Líbanos","Libýē","Líndos","Lokrís","Lokroí","Lydía","Lykía","Magnēsía","Makedonía","Makedṓn","Massalía","Maurētanía","Mauroboúnion","Mégara","Megarís","Melanēsía","Melítē","Mesopotamía","Messḗnē","Messēnía","Mēdía","Mḗlos","Mikronēsía","Mílētos","Moisía","Mykḗnai","Mýkonos","Mysía","Mōréas","Názara","Náksos","Naúplion","Neápolis","Níkaia","Nikopolis","Nísyros","Noumidía","Paionía","Palaistínē","Pamphylía","Pánormos","Pantikapaion","Parthía","Parísioi","Pátmos","Pátrai","Paphlagonía","Pelopónnēsos","Persía","Pisidia","Polynēsía","Póntos","Proúsa","Rhḗgion","Rhódos","Rhṓmē","Samareia","Sámos","Sampsoúnta","Santorínē","Seleukeia","Serbía","Sidṓn","Sikelía","Sinṓpē","Skythía","Smýrnē","Sóphia","Spártē","Sýmē","Syrakoúsai","Syría","Táras","Tarsόs","Tḗlos","Tiberiás","Tourkía","Trapesdoúnta","Trípolis","Troía","Trṓas","Týros","Phthiṓtis","Philadélpheia","Philippínai","Phoiníkē","Phrygía","Phōkaia","Phōkís","Khalkēdōn","Khersónēsos","Khíos","Ōkeanía"]
	},

	"places": ["Olokenion", "Colchinium", "Epidamnos", "Dyrrachion", "Apollonia", "Avlona", "Orikon", "Nymphaeon", "Lyssos", "Kordion", "Dimale", "Antipatrea", "Boullis", "Nikala", "Amantia", "Chimaira", "Hadrianopolis", "Phoenice", "Buthroton", "Cassiope", "Onehesmos", "Sidari", "Corcyra", "Grava", "Lefkimi", "Torone", "Syvota", "Ellina", "Cichyrus", "Antigonea", "Ephyra", "Elaea", "Kassopi", "Nikopolis", "Aktium", "Anaktorion", "Naricum", "Thyrium", "Sollium", "Ambracia", "Kokinopolis", "Orraon", "Asprochaliko", "Argithea", "Assos", "Dodona", "Omphatium", "Passaron", "Tekmon", "Pelion", "Lychnidos", "Pelagonia", "Herakleia Lynkestis", "Selectum", "Dasaki", "Asprokampos", "Potamia", "Oxynia", "Aiginion", "Phuloria", "Theudoria", "Tetraphylia", "Medion", "Stratos", "Amphilochion Argos", "Hepate", "Cynoscephalae", "Kierion", "Ithome", "Gomphoi", "Tricca", "Theopetra", "Cyretiae", "Azoros", "Doliche", "Aiane", "Elimia", "Naoussa", "Edessa", "Antigoneia", "Idomene", "Gortynia", "Tauriana", "Europos", "Pelle", "Phakos", "Veria", "Aegae", "Vergina", "Phylace", "Pythion", "Eritium", "Soufli", "Larissa", "Pharsalus", "Thavmakos", "Xyniae", "Narthakion", "Lamia", "Trachis", "Opus", "Dium", "Echinus", "Kerynthos", "Artemisio", "Peleos", "Alos", "Pyrassos", "Pagasae", "Iolkos", "Peparethos", "Pherae", "Dimini", "Meliboea", "Gonnus", "Herakleum", "Pidna", "Dion", "Methone", "Chalastra", "Allante", "Thessaloniki", "Ichnai", "Allante", "Lete", "Morylos", "Palatianon", "Skotoussa", "Parthikopolis", "Pistiros", "Philippoupolis", "Herakleia Sintike", "Sirra", "Berge", "Tragilos", "Kerdylion", "Bormiskos", "Thermes", "Strepsa", "Aineia", "Aisa", "Tinde", "Poteidea", "Mende", "Skione", "Therambos", "Aige", "Neapolis", "Aphytis", "Sane", "Galepsos", "Singos", "Parthenopolis", "Torone", "Olynthos", "Petralona", "Assera", "Piloros", "Thyssus", "Kleonai", "Akrothooi", "Charadrise", "Olophyxos", "Ouranopolis", "Acanthos", "Arnai", "Stagira", "Arethusa", "Argilos", "Antisara", "Krenides", "Philippi", "Pistyros", "Thassos", "Abdera", "Bergepolis", "Dikaia", "Linos", "Maroneia", "Mesembria", "Stryme", "Aenos", "Doriskos", "Traianopolis", "Myrina", "Hephaistia", "Tyrodiza", "Lysimachia", "Aigospotamoi", "Alopeconnesus", "Coela", "Madytos", "Cynossema", "Elaeus", "Sigeion", "Alexandria Troas", "Neandreia", "Lamponeia", "Hamaxitus", "Polymedeion", "Mitymna", "Antissa", "Eresos", "Pyrra", "Pitone", "Cone", "Kisthene", "Gargara", "Pionia", "Kebrene", "Skepsis", "Gergis", "Troy", "Rhoeteum", "Ophrynium", "Dardanos", "Abydos", "Percote", "Thynias", "Salmydessos", "Philia", "Delkos", "Athyras", "Byzantium", "Vryleion", "Kios", "Prusias", "Prousa", "Apollonia At Rhyndacon", "Dascylion", "Cyzirus", "Synaos", "Stratonicaea", "Thyateira", "Magnesia ad Sipylum", "Aiolia", "Smyma", "Klazomenai", "Cardamyle", "Chios", "Phocaea", "Kyme", "Myrina", "Gryneion", "Elaea", "Pergamon", "Attaleia", "Atarneus", "Adramyttion", "Lyrnessos", "Thebe", "Astyra", "Antandros", "Didymateiche", "Erythrea", "Phenicus", "Teos", "Kolophon", "Paleopolis", "Tripolis ad Meandrum", "Pythopolis", "Aphrodisias", "Pinara", "Telmessos", "Krya", "Pyrnos", "Kallipolis", "Kylandos", "Idynia", "Kedrai", "Keramos", "Physkos", "Kasara", "Thysanous", "Loryma", "Ialysos", "Rhodes", "Lindos", "Kameiros", "Symi", "Stadia", "Knidos", "Triopion", "Amynanda", "Halicarnassus", "Myndos", "Asklepieion", "Agios Stefanos", "Halisarna", "Bargylia", "Iasos", "Teichiussa", "Miletos", "Heraion", "Lebedos", "Priene", "Tralles", "Pleistarkheia", "Euromos", "Minoa", "Arkessine", "Akrotiri", "Thera", "Zakros", "Palekastro", "Itanos", "Mochlos", "Gournia", "Lato", "Malia", "Chersonissos", "Oaxos", "Arkades", "Koumasa", "Phaistos", "Gortyn", "Knossos", "Amnysos", "Axos", "Eleftherna", "Agia Triada", "Matala", "Komos", "Armeni", "Rithymna", "Aptera", "Elyros", "Kydonia", "Tarra", "Lissos", "Doulopolis", "Polyrinia", "Kissamos", "Phalasarna", "Agneio", "Phylakopi", "Scandeia", "Cythera", "Kastri", "Cape Maleas", "Boeae", "Epitrilium", "Epidaurus Limera", "Zarax", "Kypantha", "Prasiae", "Amykles", "Kardamyli", "Gythio", "Asopos", "Oitylo", "Teuthrone", "Casenopolis", "Cape Taenaron", "Leuktro", "Sparta", "Pherae", "Corone", "Asine", "Sphacteria", "Pylos", "Amphigeneia", "Adania", "Thyrea", "Tegea", "Bassae", "Philgalia", "Lepreo", "Sarni", "Pisa", "Hypsus", "Mantinea", "Tyrins", "Mycenae", "Kleones", "Nemea", "Corinth", "Ismthmia", "Sykyon", "Pellene", "Aegira", "Aegion", "Panormos", "Patrae", "Dyme", "Olenos", "Tritea", "Psophis", "Elis", "Cyllene", "Zakynthos", "Krani", "Pronoi", "Leontion", "Stymphalia", "Therme", "Pagae", "Megara", "Troizena", "Methana", "Eleusis", "Platea", "Thespiae", "Thebes", "Leuctra", "Chaeronea", "Orchomenos", "Cynus", "Oropos", "Ramnous", "Marathon", "Pireas", "Thorikos", "Lavrion", "Sounio", "Thermopylae", "Amfissa", "Delphi", "Kirra", "Potidania", "Trachis", "Lamia", "Narthakion", "Xyniae", "Phylace", "Agrinion", "Pleuron", "Calydon", "Oenidae", "Astakos", "Phara"],

	"mensNames": ["Kostas", "Odysseus", "Christos", "Giorgos", "Giannis", "Pavlos", "Petros", "Telemachus", "Achilles", "Heracles", "Panos", "Alexis", "Vasos", "Hector", "Archimedes", "Socrates", "Pelleas", "Jason", "Psyrias"],

	"shipNames": {
		"list": []
	},

	"peaceTimeEvents": [
		{
			"name": "Grape Harvest",
			"img": "",
			"desc": "",
			"reward": {
				"types": ["wine"],
				"min": 20,
				"max": 50
			}
		},
		{
			"name": "Party",
			"img": "",
			"desc": "",
			"reward": {
				"types": ["bread", "chicken"],
				"min": 10,
				"max": 25
			}
		},
		{
			"name": "Building Work",
			"img": "",
			"desc": "",
			"reward": {
				"types": ["gold", "wine"],
				"min": 40,
				"max": 70
			}
		},
		{
			"name": "Mining",
			"img": "",
			"desc": "",
			"reward": {
				"types": ["gold"],
				"min": 20,
				"max": 90
			}
		},
		{
			"name": "Fishing lesson",
			"img": "",
			"desc": "",
			"reward": {
				"types": ["fish"],
				"min": 15,
				"max": 35
			}
		},
		{
			"name": "Religious festival",
			"img": "",
			"desc": "",
			"reward": {
				"types": ["bread", "wine"],
				"min": 20,
				"max": 50
			}
		},
		{
			"name": "Athletic Games",
			"img": "",
			"desc": "",
			"reward": {
				"types": ["gold", "wine"],
				"min": 10,
				"max": 20
			}
		}
	],

	"monsterEvents": [
		{
			"name": "Kerberos",
			"desc": "",
			"img": "",
			"attack": 10,
			"health": 10,
			"bravery": 5,
			"strength": "",
			"weakness": ""
		},
		{
			"name": "Harpies",
			"desc": "",
			"img": "",
			"attack": 10,
			"health": 10,
			"bravery": 5,
			"strength": "",
			"weakness": ""
		},
		{
			"name": "Gorgons",
			"desc": "",
			"img": "",
			"attack": 10,
			"health": 10,
			"bravery": 5,
			"strength": "",
			"weakness": ""
		},
		{
			"name": "Spartae",
			"desc": "",
			"img": "",
			"attack": 10,
			"health": 10,
			"bravery": 5,
			"strength": "",
			"weakness": ""
		},
		{
			"name": "Cyclops",
			"desc": "",
			"img": "",
			"attack": 10,
			"health": 10,
			"bravery": 5,
			"strength": "",
			"weakness": ""
		},
		{
			"name": "Minotaur",
			"desc": "",
			"img": "",
			"attack": 10,
			"health": 10,
			"bravery": 5,
			"strength": "",
			"weakness": ""
		},
		{
			"name": "Centaurs",
			"desc": "",
			"img": "",
			"attack": 10,
			"health": 10,
			"bravery": 5,
			"strength": "",
			"weakness": ""
		},
		{
			"name": "Circe",
			"desc": "",
			"img": "",
			"attack": 10,
			"health": 10,
			"bravery": 5,
			"strength": "",
			"weakness": ""
		},
		{
			"name": "Arachne",
			"desc": "",
			"img": "",
			"attack": 10,
			"health": 10,
			"bravery": 5,
			"strength": "",
			"weakness": ""
		},
		{
			"name": "Chimera",
			"desc": "",
			"img": "",
			"attack": 10,
			"health": 10,
			"bravery": 5,
			"strength": "",
			"weakness": ""
		},
		{
			"name": "Crocotta",
			"desc": "",
			"img": "",
			"attack": 10,
			"health": 10,
			"bravery": 5,
			"strength": "",
			"weakness": ""
		},
		{
			"name": "Dryads",
			"desc": "",
			"img": "",
			"attack": 10,
			"health": 10,
			"bravery": 5,
			"strength": "",
			"weakness": ""
		},
		{
			"name": "Empusa",
			"desc": "",
			"img": "",
			"attack": 10,
			"health": 10,
			"bravery": 5,
			"strength": "",
			"weakness": ""
		},
		{
			"name": "Furies",
			"desc": "",
			"img": "",
			"attack": 10,
			"health": 10,
			"bravery": 5,
			"strength": "",
			"weakness": ""
		},
		{
			"name": "Gegenees",
			"desc": "",
			"img": "",
			"attack": 10,
			"health": 10,
			"bravery": 5,
			"strength": "",
			"weakness": ""
		},
		{
			"name": "Gryphon",
			"desc": "",
			"img": "",
			"attack": 10,
			"health": 10,
			"bravery": 5,
			"strength": "",
			"weakness": ""
		},
		{
			"name": "Hydra",
			"desc": "",
			"img": "",
			"attack": 10,
			"health": 10,
			"bravery": 5,
			"strength": "",
			"weakness": ""
		},
		{
			"name": "Manticore",
			"desc": "",
			"img": "",
			"attack": 10,
			"health": 10,
			"bravery": 5,
			"strength": "",
			"weakness": ""
		},
		{
			"name": "Philinnion",
			"desc": "",
			"img": "",
			"attack": 10,
			"health": 10,
			"bravery": 5,
			"strength": "",
			"weakness": ""
		},
		{
			"name": "Phoenix",
			"desc": "",
			"img": "",
			"attack": 10,
			"health": 10,
			"bravery": 5,
			"strength": "",
			"weakness": ""
		},
		{
			"name": "Stymphalian Birds",
			"desc": "",
			"img": "",
			"attack": 10,
			"health": 10,
			"bravery": 5,
			"strength": "",
			"weakness": ""
		},
		{
			"name": "Lycanthropes",
			"desc": "",
			"img": "",
			"attack": 10,
			"health": 10,
			"bravery": 5,
			"strength": "",
			"weakness": ""
		},
		{
			"name": "Laconian Drakon",
			"desc": "",
			"img": "",
			"attack": 10,
			"health": 10,
			"bravery": 5,
			"strength": "",
			"weakness": ""
		},
		{
			"name": "Automaton",
			"desc": "",
			"img": "",
			"attack": 10,
			"health": 10,
			"bravery": 5,
			"strength": "",
			"weakness": ""
		}
	],

	"seaBattles": [
		{
			"name": "Kraken",
			"img": "",
			"desc": ""
		}
	],

	"seaGifts": [
		{
			"name": "Phoenician Traders",
			"img": "",
			"desc": "",
			"reward": {
				"types": ["wine"],
				"min": 20,
				"max": 50
			}
		},
	],

	"trophies": [
		{
			"name": "Golden Fleece",
			"img": "",
			"icon": "",
			"desc": ""
		},
		{
			"name": "Ring of Gyges",
			"img": "",
			"icon": "",
			"desc": ""
		},
		{
			"name": "Winged Sandals",
			"img": "",
			"icon": "",
			"desc": ""
		},
		{
			"name": "Dragon's Teeth",
			"img": "",
			"icon": "",
			"desc": ""
		},
		{
			"name": "Rod of Asclepius",
			"img": "",
			"icon": "",
			"desc": ""
		},
		{
			"name": "Philosopher's Stone",
			"img": "",
			"icon": "",
			"desc": ""
		},
		{
			"name": "Winnowing Oar",
			"img": "",
			"icon": "",
			"desc": ""
		},
		{
			"name": "Sword of Damocles",
			"img": "",
			"icon": "",
			"desc": ""
		},
		{
			"name": "Petasos",
			"img": "",
			"icon": "",
			"desc": ""
		},
		{
			"name": "Shield of Achilles",
			"img": "",
			"icon": "",
			"desc": ""
		},
		{
			"name": "Xoanon",
			"img": "",
			"icon": "",
			"desc": ""
		},
		{
			"name": "Gorgoneion",
			"img": "",
			"icon": "",
			"desc": ""
		},
		{
			"name": "Thyrsus",
			"img": "",
			"icon": "",
			"desc": ""
		},
		{
			"name": "Lotus tree",
			"img": "",
			"icon": "",
			"desc": ""
		},
		{
			"name": "Baetylus",
			"img": "",
			"icon": "",
			"desc": ""
		},
		{
			"name": "Harpe",
			"img": "",
			"icon": "",
			"desc": ""
		}
	],

	"gods": [
		{
			"name": "Poseidon",
			"desc": "God of the sea",
			"content": "",
			"img": ""
		},
		{
			"name": "Demeter",
			"desc": "God of the harvest",
			"content": "",
			"img": ""
		},
		{
			"name": "Hephaestus",
			"desc": "God of fire",
			"content": "",
			"img": ""
		},
		{
			"name": "Artemis",
			"desc": "Goddess of hunting",
			"content": "",
			"img": ""
		},
		{
			"name": "Ares",
			"desc": "God of war",
			"content": "",
			"img": ""
		},
		{
			"name": "Uranus",
			"desc": "God of the winds",
			"content": "",
			"img": ""
		}
	],

	"benefactors": [
		"Passing traders", "A nobleman", "Hades", "Phoenicians", "The great hero Achilles", "The great hero Odysseus", "A kindly philospher", "A local farmer"
	]
};
