var gameText = {
	"placeNames": {
		"list": ["Athens","Knossos","Rhōmanía","Abydos","Agathḗ Týkhē","Áŋkyra","Adrianoúpolis","Athḗnai","Aigaíon Pélagos","Aígyptos","Aithiopía","Aiolís","Aítna","Aitōlía","Akarnanía","Akrágas","Albanía","Aleksándreia","Aleksandrétta","Halikarnassós","Amphípolis","Anatolḗ","Antarktikḗ","Antiókheia","Antípolis","Apoulía","Arabía","Argolís","Árgos","Arkadía","Armenía","Asía","Attikḗ","Australía","Aphrikḗ","Akhaḯa","Babylōn","Babylōnía","Baktrίa","Benetía","Bēthleém","Bērytós","Bithynía","Blakhía","Boiōtía","Boulgaría","Bretanía","Bysdántion","Galatía","Galilaía","Gallía","Germanía","Geōrgía","Dakía","Damaskós","Delphoí","Dyrrhákhion","Dōdekánēsa","Elaía","Helbetía","Helíkē","Hellás","Empórion","Erétria","Erythraía","Eúboia","Eurṓpē","Éphesos","Ḗpeiros","Hērákleia","Theodosía","Thessalía","Thessaloníkē","Thḗbai","Thḗra","Thoúrioi","Thrákē","Ialyssós","Ibería","Ierichṓ","Hierousalḗm","Ithákē","Ikónion","Illyría","Indíai","Indonēsía","Ióppē","Ioudaía","Hispanía","Israḗl","Italía","Iōnía","Kaisareia","Kalabría","Kámeiros","Kampánia","Kappadokía","Karía","Karpáthia","Kárpathos","Karkhēdṓn","Kaspía","Katánē","Kérkyra","Kilikía","Knidos","Knōssόs","Kolophṓn","Kόrinthos","Krḗtē","Krótōn","Kýsdikos","Kykládes","Kýmē","Kýpros","Kyrēnaïkḗ","Kyrḗnē","Kōnstantinoúpolis","Kōs","Lakōnía","Lamía","Lámpsakos","Laodikeia","Lésbos","Leukōsía","Líbanos","Libýē","Líndos","Lokrís","Lokroí","Lydía","Lykía","Magnēsía","Makedonía","Makedṓn","Massalía","Maurētanía","Mauroboúnion","Mégara","Megarís","Melanēsía","Melítē","Mesopotamía","Messḗnē","Messēnía","Mēdía","Mḗlos","Mikronēsía","Mílētos","Moisía","Mykḗnai","Mýkonos","Mysía","Mōréas","Názara","Náksos","Naúplion","Neápolis","Níkaia","Nikopolis","Nísyros","Noumidía","Paionía","Palaistínē","Pamphylía","Pánormos","Pantikapaion","Parthía","Parísioi","Pátmos","Pátrai","Paphlagonía","Pelopónnēsos","Persía","Pisidia","Polynēsía","Póntos","Proúsa","Rhḗgion","Rhódos","Rhṓmē","Samareia","Sámos","Sampsoúnta","Santorínē","Seleukeia","Serbía","Sidṓn","Sikelía","Sinṓpē","Skythía","Smýrnē","Sóphia","Spártē","Sýmē","Syrakoúsai","Syría","Táras","Tarsόs","Tḗlos","Tiberiás","Tourkía","Trapesdoúnta","Trípolis","Troía","Trṓas","Týros","Phthiṓtis","Philadélpheia","Philippínai","Phoiníkē","Phrygía","Phōkaia","Phōkís","Khalkēdōn","Khersónēsos","Khíos","Ōkeanía"]
	},

	"places": ["Olokenion", "Colchinium", "Epidamnos", "Dyrrachion", "Apollonia", "Avlona", "Orikon", "Nymphaeon", "Lyssos", "Kordion", "Dimale", "Antipatrea", "Boullis", "Nikala", "Amantia", "Chimaira", "Hadrianopolis", "Phoenice", "Buthroton", "Cassiope", "Onehesmos", "Sidari", "Corcyra", "Grava", "Lefkimi", "Torone", "Syvota", "Ellina", "Cichyrus", "Antigonea", "Ephyra", "Elaea", "Kassopi", "Nikopolis", "Aktium", "Anaktorion", "Naricum", "Thyrium", "Sollium", "Ambracia", "Kokinopolis", "Orraon", "Asprochaliko", "Argithea", "Assos", "Dodona", "Omphatium", "Passaron", "Tekmon", "Pelion", "Lychnidos", "Pelagonia", "Herakleia Lynkestis", "Selectum", "Dasaki", "Asprokampos", "Potamia", "Oxynia", "Aiginion", "Phuloria", "Theudoria", "Tetraphylia", "Medion", "Stratos", "Amphilochion Argos", "Hepate", "Cynoscephalae", "Kierion", "Ithome", "Gomphoi", "Tricca", "Theopetra", "Cyretiae", "Azoros", "Doliche", "Aiane", "Elimia", "Naoussa", "Edessa", "Antigoneia", "Idomene", "Gortynia", "Tauriana", "Europos", "Pelle", "Phakos", "Veria", "Aegae", "Vergina", "Phylace", "Pythion", "Eritium", "Soufli", "Larissa", "Pharsalus", "Thavmakos", "Xyniae", "Narthakion", "Lamia", "Trachis", "Opus", "Dium", "Echinus", "Kerynthos", "Artemisio", "Peleos", "Alos", "Pyrassos", "Pagasae", "Iolkos", "Peparethos", "Pherae", "Dimini", "Meliboea", "Gonnus", "Herakleum", "Pidna", "Dion", "Methone", "Chalastra", "Allante", "Thessaloniki", "Ichnai", "Allante", "Lete", "Morylos", "Palatianon", "Skotoussa", "Parthikopolis", "Pistiros", "Philippoupolis", "Herakleia Sintike", "Sirra", "Berge", "Tragilos", "Kerdylion", "Bormiskos", "Thermes", "Strepsa", "Aineia", "Aisa", "Tinde", "Poteidea", "Mende", "Skione", "Therambos", "Aige", "Neapolis", "Aphytis", "Sane", "Galepsos", "Singos", "Parthenopolis", "Torone", "Olynthos", "Petralona", "Assera", "Piloros", "Thyssus", "Kleonai", "Akrothooi", "Charadrise", "Olophyxos", "Ouranopolis", "Acanthos", "Arnai", "Stagira", "Arethusa", "Argilos", "Antisara", "Krenides", "Philippi", "Pistyros", "Thassos", "Abdera", "Bergepolis", "Dikaia", "Linos", "Maroneia", "Mesembria", "Stryme", "Aenos", "Doriskos", "Traianopolis", "Myrina", "Hephaistia", "Tyrodiza", "Lysimachia", "Aigospotamoi", "Alopeconnesus", "Coela", "Madytos", "Cynossema", "Elaeus", "Sigeion", "Alexandria Troas", "Neandreia", "Lamponeia", "Hamaxitus", "Polymedeion", "Mitymna", "Antissa", "Eresos", "Pyrra", "Pitone", "Cone", "Kisthene", "Gargara", "Pionia", "Kebrene", "Skepsis", "Gergis", "Troy", "Rhoeteum", "Ophrynium", "Dardanos", "Abydos", "Percote", "Thynias", "Salmydessos", "Philia", "Delkos", "Athyras", "Byzantium", "Vryleion", "Kios", "Prusias", "Prousa", "Apollonia At Rhyndacon", "Dascylion", "Cyzirus", "Synaos", "Stratonicaea", "Thyateira", "Magnesia ad Sipylum", "Aiolia", "Smyma", "Klazomenai", "Cardamyle", "Chios", "Phocaea", "Kyme", "Myrina", "Gryneion", "Elaea", "Pergamon", "Attaleia", "Atarneus", "Adramyttion", "Lyrnessos", "Thebe", "Astyra", "Antandros", "Didymateiche", "Erythrea", "Phenicus", "Teos", "Kolophon", "Paleopolis", "Tripolis ad Meandrum", "Pythopolis", "Aphrodisias", "Pinara", "Telmessos", "Krya", "Pyrnos", "Kallipolis", "Kylandos", "Idynia", "Kedrai", "Keramos", "Physkos", "Kasara", "Thysanous", "Loryma", "Ialysos", "Rhodes", "Lindos", "Kameiros", "Symi", "Stadia", "Knidos", "Triopion", "Amynanda", "Halicarnassus", "Myndos", "Asklepieion", "Agios Stefanos", "Halisarna", "Bargylia", "Iasos", "Teichiussa", "Miletos", "Heraion", "Lebedos", "Priene", "Tralles", "Pleistarkheia", "Euromos", "Minoa", "Arkessine", "Akrotiri", "Thera", "Zakros", "Palekastro", "Itanos", "Mochlos", "Gournia", "Lato", "Malia", "Chersonissos", "Oaxos", "Arkades", "Koumasa", "Phaistos", "Gortyn", "Knossos", "Amnysos", "Axos", "Eleftherna", "Agia Triada", "Matala", "Komos", "Armeni", "Rithymna", "Aptera", "Elyros", "Kydonia", "Tarra", "Lissos", "Doulopolis", "Polyrinia", "Kissamos", "Phalasarna", "Agneio", "Phylakopi", "Scandeia", "Cythera", "Kastri", "Cape Maleas", "Boeae", "Epitrilium", "Epidaurus Limera", "Zarax", "Kypantha", "Prasiae", "Amykles", "Kardamyli", "Gythio", "Asopos", "Oitylo", "Teuthrone", "Casenopolis", "Cape Taenaron", "Leuktro", "Sparta", "Pherae", "Corone", "Asine", "Sphacteria", "Pylos", "Amphigeneia", "Adania", "Thyrea", "Tegea", "Bassae", "Philgalia", "Lepreo", "Sarni", "Pisa", "Hypsus", "Mantinea", "Tyrins", "Mycenae", "Kleones", "Nemea", "Corinth", "Ismthmia", "Sykyon", "Pellene", "Aegira", "Aegion", "Panormos", "Patrae", "Dyme", "Olenos", "Tritea", "Psophis", "Elis", "Cyllene", "Zakynthos", "Krani", "Pronoi", "Leontion", "Stymphalia", "Therme", "Pagae", "Megara", "Troizena", "Methana", "Eleusis", "Platea", "Thespiae", "Thebes", "Leuctra", "Chaeronea", "Orchomenos", "Cynus", "Oropos", "Ramnous", "Marathon", "Pireas", "Thorikos", "Lavrion", "Sounio", "Thermopylae", "Amfissa", "Delphi", "Kirra", "Potidania", "Trachis", "Lamia", "Narthakion", "Xyniae", "Phylace", "Agrinion", "Pleuron", "Calydon", "Oenidae", "Astakos", "Phara"],

	"mensNames": ["Kostas", "Odysseus", "Christos", "Giorgos", "Giannis", "Pavlos", "Petros", "Telemachus", "Achilles", "Heracles", "Panos", "Alexis", "Vasos", "Hector", "Archimedes", "Socrates", "Pelleas", "Jason", "Psyrias"],

	"shipTypes": ["Bireme", "Trireme", "Pentekontor", "Lembos", "Hemiolia"],

	"shipNames": ["Argo", "Paralus", "Salaminia", "Delias", "Danais", "Syracusia", "Phaeaco", "Pandora", "Phosphoros", "Kytheria", "Seiren", "Triainia", "Nereis", "Tritogenes", "Pandia", "Melitta", "Delphis", "Panthera", "Lykaina", "Salpinx", "Sphendone", "Synoris", "Peristera", "Okeia"],

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
			"desc": "In Greek mythology, Cerberus (Greek: Κέρβερος, Kerberos), often called the 'hound of Hades', is the monstrous multi-headed dog that guards the gates of the Underworld to prevent the dead from leaving. Cerberus was the offspring of the monsters Echidna and Typhon, and usually is described as having three heads, a serpent for a tail, and snakes protruding from parts of his body.",
			"img": "",
			"attack": 7,
			"health": 6,
			"bravery": 6,
			"strength": "Triple jaws",
			"weakness": "Slithery tail"
		},
		{
			"name": "Harpies",
			"desc": "In Greek mythology and Roman mythology, harpies (Greek: ἅρπυια, harpyia) were half-human and half-bird personifications of storm winds. Their name means 'snatchers' or 'swift robbers' and they steal food from their victims while they are eating and carry evildoers (especially those who have killed their family) to the Erinyes.",
			"img": "",
			"attack": 7,
			"health": 5,
			"bravery": 7,
			"strength": "Speed; talons",
			"weakness": "Few defensive manoeuvres"
		},
		{
			"name": "Gorgons",
			"desc": "A Gorgon (Ancient Greek: Γοργώ) is a female creature. The name derives from the ancient Greek word gorgós, which means 'dreadful'. The term refers to any of three sisters who had hair made of living, venomous snakes, as well as a horrifying visage that turned those who beheld her to stone. Traditionally, while two of the Gorgons were immortal, Stheno and Euryale, their sister Medusa was not.",
			"img": "",
			"attack": 10,
			"health": 2,
			"bravery": 6,
			"strength": "Petrifying gaze",
			"weakness": "Soft fleshy necks"
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
			"desc": "A cyclops (Ancient Greek: Κύκλωψ, Kyklōps), in Greek mythology and later Roman mythology, is a member of a primordial race of giants, each with a single eye in the center of his forehead.",
			"img": "",
			"attack": 10,
			"health": 8,
			"bravery": 4,
			"strength": "Giant power",
			"weakness": "Peripheral vision"
		},
		{
			"name": "Minotaur",
			"desc": "The Minotaur (Ancient Greek: Μῑνώταυρος) is a mythical creature with the head of a bull and the body of a man. The Minotaur dwelt at the center of the Labyrinth, which was an elaborate maze-like construction designed by the architect Daedalus and his son Icarus, on the command of King Minos of Crete.",
			"img": "",
			"attack": 12,
			"health": 10,
			"bravery": 5,
			"strength": "Brute power; horns",
			"weakness": "Sense of direction"
		},
		{
			"name": "Centaurs",
			"desc": "A centaur (Greek: Κένταυρος, Kéntauros), or occasionally hippocentaur, is a mythological creature with the upper body of a human and the lower body of a horse. The Centaurs are best known for their fight with the Lapiths. A Lapith hero, Caeneus, who was invulnerable to weapons, was beaten into the earth by Centaurs wielding rocks and the branches of trees.",
			"img": "",
			"attack": 8,
			"health": 11,
			"bravery": 5,
			"strength": "Animal violence",
			"weakness": "Compassion"
		},
		{
			"name": "Circe",
			"desc": "Circe (Greek: Κίρκη) is a goddess of magic or sometimes a nymph, witch, enchantress or sorceress. By most accounts, she was the daughter of the sun god Helios, and Perse, an Oceanid nymph. Circe was renowned for her vast knowledge of potions and herbs. Through the use of these and a magic wand or staff, she transformed her enemies, or those who offended her, into wild beasts.",
			"img": "",
			"attack": 9,
			"health": 8,
			"bravery": 7,
			"strength": "Cunning; poisons",
			"weakness": "Unknown"
		},
		{
			"name": "Arachne",
			"desc": "In Greek (and later Roman) mythology, Arachne (Greek: ἀράχνη 'spider') was a talented mortal weaver who challenged Athena, goddess of wisdom and crafts, to a weaving contest; this hubris resulted in her being transformed into a spider.",
			"img": "",
			"attack": 4,
			"health": 7,
			"bravery": 9,
			"strength": "Weaving",
			"weakness": "Overconfidence"
		},
		{
			"name": "Chimera",
			"desc": "The Chimera (Greek: Χίμαιρα, Chímaira 'she-goat') was a monstrous fire-breathing hybrid creature of Lycia in Asia Minor, composed of the parts of more than one animal. It is usually a lion, with the head of a goat arising from its back, and a tail that ends with a snake's head. The seeing of a Chimera was an omen for disaster.",
			"img": "",
			"attack": 6,
			"health": 6,
			"bravery": 6,
			"strength": "Fiery breath",
			"weakness": "Goaty intelligence"
		},
		{
			"name": "Crocotta",
			"desc": "The crocotta is a mythical dog-wolf of India or Ethiopia, linked to the hyena and said to be a deadly enemy of men and dogs.",
			"img": "",
			"attack": 10,
			"health": 5,
			"bravery": 8,
			"strength": "Speed, vicious bite",
			"weakness": "Stupidity"
		},
		{
			"name": "Empusa",
			"desc": "Empusa (Ancient Greek: Ἔμπουσα, Empousa) is a demigoddess of Greek mythology. In later incarnations, she appeared as a species of monsters commanded by Hecate. Empusa was the beautiful daughter of the goddess Hecate and the spirit Mormo. She feasted on blood by seducing young men as they slept, before drinking their blood and eating their flesh.",
			"img": "",
			"attack": 9,
			"health": 3,
			"bravery": 4,
			"strength": "Seduction",
			"weakness": "Fighting"
		},
		{
			"name": "Furies",
			"desc": "In Greek mythology the Erinyes (Greek: Ἐρῑνύες [ῠ], pl. of Ἐρῑνύς [ῡ], Erinys), also known as the Furies, were female chthonic deities of vengeance; they were sometimes referred to as 'infernal goddesses' (χθόνιαι θεαί). A formulaic oath in the Iliad invokes them as 'the Erinyes, that under earth take vengeance on men, whosoever hath sworn a false oath'.",
			"img": "",
			"attack": 7,
			"health": 4,
			"bravery": 4,
			"strength": "Cunning, malice",
			"weakness": "Stamina"
		},
		{
			"name": "Gegenees",
			"desc": "The Gegenees (Gr. Γηγενεης Gêgeneês - meaning 'earth-born') were a race of six-armed giants who inhabited the same island as the Doliones in the ancient Greek epic Argonautica.",
			"img": "",
			"attack": 10,
			"health": 10,
			"bravery": 5,
			"strength": "Powerful; many arms",
			"weakness": "Top-heavy"
		},
		{
			"name": "Gryphon",
			"desc": "The gryphon (Greek: γρύφων, grýphōn) is a legendary creature with the body, tail, and back legs of a lion; the head and wings of an eagle; and an eagle's talons as its front feet. Because the lion was traditionally considered the king of the beasts and the eagle the king of birds, the griffin was thought to be an especially powerful and majestic creature. Griffins are known for guarding treasure and priceless possessions.",
			"img": "",
			"attack": 8,
			"health": 7,
			"bravery": 10,
			"strength": "Bravery",
			"weakness": "Lack of coordination"
		},
		{
			"name": "Hydra",
			"desc": "The Lernaean Hydra (Greek: Λερναῖα Ὕδρα) was a serpentine water monster. Its lair was the lake of Lerna in the Argolid, which reputed to be an entrance to the Underworld. The Hydra was the offspring of Typhon and Echidna. It possessed many heads, for every head chopped off, the Hydra would regrow a couple of heads. The Hydra had poisonous breath and blood so virulent that even its scent was deadly.",
			"img": "",
			"attack": 10,
			"health": 10,
			"bravery": 5,
			"strength": "Regeneration",
			"weakness": "Easily chopped"
		},
		{
			"name": "Manticore",
			"desc": "The manticore is a Persian legendary creature similar to the Egyptian sphinx. It has the head of a human, body of a lion and a tail of poisonous spines similar to porcupine quills. There are some accounts that the spines can be shot like arrows, thus making the manticore a lethal predator. It eats its victims whole, using its triple rows of teeth, and leaves no bones behind.",
			"img": "",
			"attack": 11,
			"health": 8,
			"bravery": 3,
			"strength": "Poisonous spines; many teeth",
			"weakness": "Easily rattled"
		},
		{
			"name": "Lamia",
			"desc": "In ancient Greek mythology, Lamia (Greek: Λάμια) was a beautiful queen of Libya who became a child-eating daemon. The myth has Hera stealing all of Lamia's children and Lamia, who loses her mind from grief and despair, starts stealing and devouring others' children out of envy, the repeated monstrosity of which transforms her into a monster. Some accounts say she has a serpent's tail below the waist. ",
			"img": "",
			"attack": 7,
			"health": 7,
			"bravery": 2,
			"strength": "Shape-shifting",
			"weakness": "Internal conflict; cowardice"
		},
		{
			"name": "Phoenix",
			"desc": "In Greek mythology, a phoenix (Ancient Greek: φοῖνιξ phoînix) is a long-lived bird that is cyclically regenerated or born again. Associated with the Sun, a phoenix obtains new life by arising from the ashes of its predecessor. According to some sources, the phoenix dies in a show of flames and combustion.",
			"img": "",
			"attack": 4,
			"health": 4,
			"bravery": 8,
			"strength": "Heated aggression",
			"weakness": "Water baths"
		},
		{
			"name": "Stymphalian Birds",
			"desc": "The Stymphalian birds (Greek: Στυμφαλίδες ὄρνιθες, Stymphalídes órnithes) are a group of voracious, man-eating birds with beaks of bronze, sharp metallic feathers they could launch at their victims, and poisonous dung. These birds were pets of Artemis, the goddess of the hunt or have been brought up by Ares. They migrated to a marsh in Arcadia to escape a pack of wolves. There they bred quickly and swarmed over the countryside, destroying crops, fruit trees, and townspeople.",
			"img": "",
			"attack": 10,
			"health": 7,
			"bravery": 4,
			"strength": "Aerial bombardment",
			"weakness": "Counter-projectiles"
		},
		{
			"name": "Lycanthropes",
			"desc": "A lycanthrope (Greek: λυκάνθρωπος lukánthrōpos, 'wolf-person') is a mythological or folkloric human with the ability to shapeshift into a wolf, either purposely or after being placed under a curse or affliction (often a bite or scratch from another werewolf).",
			"img": "",
			"attack": 10,
			"health": 8,
			"bravery": 6,
			"strength": "Stealth; savagery",
			"weakness": "Daylight"
		},
		{
			"name": "Automaton",
			"desc": "THE AUTOMATONES were animate, metal statues of animal, men and monsters crafted by the divine smith Hephaestus and the Athenian craftsman Daedalus. The best of them could think and feel like men.",
			"img": "",
			"url": "",
			"attack": 8,
			"health": 10,
			"bravery": 10,
			"strength": "Size; impervious to most weapons",
			"weakness": "Technical malfunctions"
		},
		{
			"name": "Calydonian Boar",
			"desc": "THE HUS KALYDONIOS (Calydonian Boar) was a gigantic boar sent by Artemis to ravage the countryside of Kalydon (Calydon) to punish King Oineus (Oeneus) for neglecting her in the offerings of the first fruits to the gods.",
			"img": "",
			"url": "",
			"attack": 8,
			"health": 6,
			"bravery": 8,
			"strength": "Ravaging",
			"weakness": "Low intelligence"
		},
		{
			"name": "Echidna",
			"desc": "EKHIDNA (Echidna) was a monstrous she-dragon (drakaina) with the head and breast of a woman and the tail of a coiling serpent. She probably represented the corruptions of the earth--rot, slime, fetid waters, illness and disease.",
			"img": "",
			"url": "",
			"attack": 6,
			"health": 5,
			"bravery": 3,
			"strength": "Fetid, infectious talons",
			"weakness": "Personal hygiene"
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
			"className": "golden-fleece",
			"img": "",
			"desc": ""
		},
		{
			"name": "Ring of Gyges",
			"className": "ring-of-gyges",
			"img": "",
			"desc": ""
		},
		{
			"name": "Wing of Icarus",
			"className": "wing-of-icarus",
			"img": "",
			"desc": ""
		},
		{
			"name": "Dragon's Teeth",
			"className": "dragons-teeth",
			"img": "",
			"desc": ""
		},
		{
			"name": "Rod of Asclepius",
			"className": "asclepius-rod",
			"img": "",
			"desc": ""
		},
		{
			"name": "Philosopher's Stone",
			"className": "philosophers-stone",
			"img": "",
			"desc": ""
		},
		{
			"name": "Winnowing Oar",
			"className": "chicken",
			"img": "",
			"desc": ""
		},
		{
			"name": "Sword of Damocles",
			"className": "damocles-sword",
			"img": "",
			"desc": ""
		},
		{
			"name": "Petasos",
			"className": "petasos",
			"img": "",
			"desc": ""
		},
		{
			"name": "Shield of Achilles",
			"className": "achilles-shield",
			"img": "",
			"desc": ""
		},
		{
			"name": "Gorgoneion",
			"className": "gorgoneion",
			"img": "",
			"desc": ""
		},
		{
			"name": "Thyrsus",
			"className": "thyrsus",
			"img": "",
			"desc": ""
		},
		{
			"name": "Lotus Fruit",
			"className": "lotus-fruit",
			"img": "",
			"desc": ""
		},
		{
			"name": "Baetylus",
			"className": "baetylus",
			"img": "",
			"desc": ""
		},
		{
			"name": "Harpe",
			"className": "harpe",
			"img": "",
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
	],

	"produce": [
		{
			"name": "bread",
			"unit": ["loaf","loaves"],
			"basePrice": 1
		},
		{
			"name": "fish",
			"unit": ["crate","crates"],
			"basePrice": 2
		},
		{
			"name": "chickens",
			"unit": ["box","boxes"],
			"basePrice": 3
		},
		{
			"name": "wine",
			"unit": ["amphora","amphorae"],
			"basePrice": 5
		}
	],

	"upgrades": [
		{
			"name": "Salt Boxes",
			"className": "salt-box",
			"desc": "Salt boxes increase your ship's capacity for fresh food storage, for those long voyages."
		},
		{
			"name": "Pro Steering",
			"className": "ships-wheel",
			"desc": "An advanced rudder-wheel invention which will get you to your destination faster."
		},
		{
			"name": "Navigation",
			"className": "compass",
			"desc": "The compass will keep you from getting lost at sea, speeding up your journeys."
		},
		{
			"name": "Silk Sails",
			"className": "silk-sails",
			"desc": "Light, strong, fast. The best sails money can buy."
		},
		{
			"name": "Cotton Sails",
			"className": "cotton-sails",
			"desc": "Cotton sails are lighter than hemp, making you faster."
		},
		{
			"name": "Fishing Nets",
			"className": "fishing-net",
			"desc": "The best nets available, they will double your fish hauls."
		},
		{
			"name": "Extra Oars",
			"className": "oars",
			"desc": "More oars = more speed. Cut those travel times down and save on fuel."
		},
		{
			"name": "Armour Plating",
			"className": "ship-armour",
			"desc": "Bronze hull plates turn your ship into a fearsome ram-raider."
		},
	]
};
