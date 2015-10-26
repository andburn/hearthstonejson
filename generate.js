"use strict";
/*global setImmediate: true*/

var base = require("xbase"),
	fs = require("fs"),
	C = require("C"),
	libxmljs = require("libxmljs"),
	path = require("path"),
	rimraf = require("rimraf"),
	tiptoe = require("tiptoe");

var HSDATA_DIR = path.join(__dirname, "hs-data");
var CARDDEFS_PATH = path.join(HSDATA_DIR, "CardDefs.xml");
var CARDBACK_PATH = path.join(HSDATA_DIR, "DBF", "CARD_BACK.xml");

if(!fs.existsSync(HSDATA_DIR) || !fs.existsSync(CARDDEFS_PATH) || !fs.existsSync(CARDDEFS_PATH))
{
	base.error("[%s] or [%s] or [%s] does not exist. Run `updateHSData.sh` first.", HSDATA_DIR, CARDDEFS_PATH, CARDBACK_PATH);
	base.error("Usage: node generate.js");
	process.exit(1);
}

var OUT_PATH = path.join(__dirname, "out");
var CARDBACK_OUT_PATH = path.join(__dirname, "outCardBacks");

tiptoe(
	function clearOut()
	{
		base.info("Clearing 'out' and 'outCardBacks' directory...");
		rimraf(OUT_PATH, this.parallel());
		rimraf(CARDBACK_OUT_PATH, this.parallel());
	},
	function createOut()
	{
		fs.mkdir(OUT_PATH, this.parallel());
		fs.mkdir(CARDBACK_OUT_PATH, this.parallel());
	},
	function processLanguages()
	{
		base.info("Cards: Processing card languages...");
		C.LANGUAGES.serialForEach(function(language, cb)
		{
			base.info("Cards: Processing language: %s", language);
			processCards(CARDDEFS_PATH, language, cb);
		}, this);
	},
	function saveSets(cards)
	{
		base.info("Cards: Saving JSON...");

		C.LANGUAGES.serialForEach(function(language, cb, i)
		{
			saveSet(cards[i], language, cb);
		}, this);
	},
	function processLanguagesCardBacks()
	{
		base.info("Card Backs: Processing card languages...");
		C.LANGUAGES.serialForEach(processCardBacks, this);
	},
	function saveAllCardBacks(allCardBacks)
	{
		base.info("Card Backs: Saving JSON...");

		C.LANGUAGES.serialForEach(function(language, cb, i)
		{
			saveCardBacks(allCardBacks[i], language, cb);
		}, this);
	},
	function finish(err)
	{
		if(err)
		{
			base.error(err);
			process.exit(1);
		}

		process.exit(0);
	}
);

function saveSet(cards, language, cb)
{
	var sets = {};

	base.info("Saving %d cards for language: %s", cards.length, language);

	cards.forEach(function(card)
	{
		var cardSet = card.set;
		if(!sets.hasOwnProperty(cardSet))
			sets[cardSet] = [];

		fixCard(language, card);

		sets[cardSet].push(card);
	});

	tiptoe(
		function saveFiles()
		{
			Object.forEach(sets, function(setName, cards)
			{
				fs.writeFile(path.join(OUT_PATH, setName + "." + language + ".json"), JSON.stringify(cards.sort(function(a, b) { return a.name.localeCompare(b.name); })), {encoding:"utf8"}, this.parallel());
			}.bind(this));
		},
		function finish(err)
		{
			return setImmediate(function() { cb(err); });
		}
	);
}

function fixCard(language, card)
{
	if(["Minion", "Weapon"].contains(card.type) && !card.hasOwnProperty("cost"))
		card.cost = 0;
}

function processCards(cardXMLPath, language, cb)
{
	var cards = [];

	tiptoe(
		function loadFile()
		{
			fs.readFile(cardXMLPath, {encoding:"utf8"}, this);
		},
		function processFile(cardXMLData)
		{
			var xmlDoc = libxmljs.parseXml(cardXMLData);
			var cardDefs = xmlDoc.get("/CardDefs");
			cardDefs.childNodes().forEach(function(childNode)
			{
				if(childNode.name()!=="Entity")
					return;

				cards.push(processEntity(childNode, language));
			});

			this();
		},
		function finish(err)
		{
			if(err)
			{
				base.error("Error for file: " + cardXMLPath);
				base.error(err);
				base.error("If new field, check out card on hearthhead and: http://www.hearthpwn.com/cards?filter-set=18");
			}

			setImmediate(function() { cb(err, cards); });
		}
	);
}

function processEntity(Entity, language)
{
	var card = {};
	Entity.childNodes().forEach(function(childNode)
	{
		var childNodeName = childNode.name();
		if(C.IGNORED_TAG_NAMES.contains(childNodeName))
			return;

		if(childNodeName!=="Tag" && childNodeName!=="ReferencedTag")
		{
			base.info("New XML node name [%s] with XML: %s", childNodeName, childNode.toString());
			process.exit(1);
			return;
		}

		var enumID = +childNode.attr("enumID").value();
		if(!C.ENUMID_TO_NAME.hasOwnProperty(enumID))
		{
			base.info("New enumID [%d] with value [%s] in parent:\n%s", enumID, childNode.toString(), childNode.parent().toString());
			process.exit(1);
			return;
		}
	});

	card.id = Entity.attr("CardID").value();
	card.name = getTagValue(Entity, language, "CardName");
	card.set = getTagValue(Entity, language, "CardSet");
	card.type = getTagValue(Entity, language, "CardType");
	card.faction = getTagValue(Entity, language, "Faction");
	card.rarity = getTagValue(Entity, language, "Rarity");
	card.cost = getTagValue(Entity, language, "Cost");
	card.attack = getTagValue(Entity, language, "Atk");
	card.health = getTagValue(Entity, language, "Health");
	card.durability = getTagValue(Entity, language, "Durability");
	card.text = getTagValue(Entity, language, "CardTextInHand");
	card.inPlayText = getTagValue(Entity, language, "CardTextInPlay");
	card.flavor = getTagValue(Entity, language, "FlavorText");
	card.artist = getTagValue(Entity, language, "ArtistName");
	card.collectible = getTagValue(Entity, language, "Collectible");
	card.elite = getTagValue(Entity, language, "Elite");
	card.race = getTagValue(Entity, language, "Race");
	card.playerClass = getTagValue(Entity, language, "Class");
	card.howToGet = getTagValue(Entity, language, "HowToGetThisCard");
	card.howToGetGold = getTagValue(Entity, language, "HowToGetThisGoldCard");
	card.mechanics = [];

	C.MECHANIC_TAGS.forEach(function(MECHANIC_TAG)
	{
		if(getTagValue(Entity, language, MECHANIC_TAG))
			card.mechanics.push(MECHANIC_TAG);
	});

	if(!card.mechanics.length)
		delete card.mechanics;
	else
		card.mechanics = card.mechanics.sort();

	Object.keys(card).forEach(function(key)
	{
		if(card[key]===undefined)
			delete card[key];
	});

	return card;
}

function getTagValue(Entity, language, tagName)
{
	try
	{
		var value = getTagValue_Actual(Entity, language, tagName);
		if(value && typeof value==="string")
		{
			value = value.replaceAll(" ", " ");
			//value = value.replace(/[#$]([0-9]+)/g, "$1");		// The $ comes before a numerical damage value, the # before a numerical heal value
		}

		return value;
	}
	catch(err)
	{
		base.info(Entity.toString());
		base.info(tagName);
		throw err;
	}
}

function getTagValue_Actual(Entity, language, tagName)
{
	var Tag = Entity.get("Tag[@enumID='" + C.NAME_TO_ENUMID[tagName] + "']");
	if(!Tag)
		return undefined;

	var type = Tag.attr("type").value();
	if(type==="String")
		return Tag.text().trim();

	if(type==="LocString")
		return (Tag.get(language) || Tag.get("enUS")).text().trim();

	var value = Tag.attr("value").value();

	if(!C.TAG_VALUE_MAPS.hasOwnProperty(tagName))
	{
		if(type==="")
		{
			if(C.BOOLEAN_TYPES.contains(tagName))
				type = "Bool";
			else
				type = "Number";
		}

		if(type==="Number" || type==="Int")
			return +value;

		if(type==="Bool")
			return value==="1" ? true : false;

		throw new Error("Unhandled Tag type [" + type + "] for tag: " + Tag.toString());
	}

	var tagMap = C.TAG_VALUE_MAPS[tagName];
	if(!tagMap.hasOwnProperty(value))
		throw new Error("Unknown " + tagName + ": " + value + "\nWith XML: " + Tag.parent().toString());

	return tagMap[value];
}

function saveCardBacks(cardBacks, language, cb)
{
	base.info("Saving %d cardBacks for language: %s", cardBacks.length, language);

	tiptoe(
		function saveFiles()
		{
			fs.writeFile(path.join(CARDBACK_OUT_PATH, "CardBacks." + language + ".json"), JSON.stringify(cardBacks), {encoding:"utf8"}, this);
		},
		cb
	);
}

function processCardBacks(language, cb)
{
	var cardBacks = [];
		
	base.info("Processing cardBacks for language: %s", language);

	tiptoe(
		function loadFile()
		{
			fs.readFile(CARDBACK_PATH, {encoding:"utf8"}, this);
		},
		function processFile(cardXMLData)
		{
			var xmlDoc = libxmljs.parseXml(cardXMLData);
			var backDefs = xmlDoc.get("/Dbf");

			backDefs.childNodes().forEach(function(childNode)
			{
				if(childNode.name()!=="Record")
					return;

				cardBacks.push(processCardBackRecord(childNode, language));
			});

			this();
		},
		function finish(err)
		{
			if(err)
				base.error(err);

			setImmediate(function() { cb(err, cardBacks); });
		}
	);
}

function setFieldValue(cardBack, language, field, targetType, options)
{
	options = options || {};

	var fieldType = field.attr("column").value().toLowerCase();
	if(fieldType!==targetType.toLowerCase())
		return;

	var value = null;
	field.childNodes().forEach(function(languageNode)
	{
		if(value || !languageNode || languageNode.name()!==language)
			return;

		value = languageNode.text();
	});

	if(!value)
		value = field.text();

	if(value)
	{
		if(options)
		{
			if(options.capitalize)
				value = value.toProperCase();

			if(options.boolean)
				value = (value.toLowerCase()==="true");

			if(options.integer)
				value = +value;
		}

		cardBack[(options && options.fieldName) ? options.fieldName : targetType] = value;
	}
}

function processCardBackRecord(Entity, language)
{
	var cardBack = {};
	Entity.childNodes().forEach(function(childNode)
	{
		var childNodeName = childNode.name();
		if(childNodeName!=="Field")
			return;

		setFieldValue(cardBack, language, childNode, "id", {integer:true});
		setFieldValue(cardBack, language, childNode, "name");
		setFieldValue(cardBack, language, childNode, "enabled", {boolean:true});
		setFieldValue(cardBack, language, childNode, "source", {capitalize:true, fieldName : "sourceType"});
		setFieldValue(cardBack, language, childNode, "source_description", {capitalize:true, fieldName : "source"});
		setFieldValue(cardBack, language, childNode, "description");
	});

	if(cardBack.hasOwnProperty("description") && cardBack.description.contains("\\n\\n"))
	{
		cardBack.howToGet = cardBack.description.substring(cardBack.description.indexOf("\\n\\n")+4);
		cardBack.description = cardBack.description.substring(0, cardBack.description.indexOf("\\n\\n"));
	}

	return cardBack;
}
