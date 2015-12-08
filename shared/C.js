"use strict";

(function(exports)
{
	exports.LANGUAGES = ["enUS", "frFR", "zhTW", "zhCN", "ruRU", "ptBR", "plPL", "koKR", "itIT", "esMX", "esES", "deDE", "enGB", "jaJP"];
	exports.LANGUAGES_FULL =
	[
		{
			code : "enUS",
			country : "United States",
			language : "English"
		},
		{
			code : "enGB",
			country : "Great Britain",
			language : "English"
		},
		{
			code : "frFR",
			country : "France",
			language : "French"
		},
		{
			code : "zhTW",
			country : "Taiwan",
			language : "Chinese"
		},
		{
			code : "zhCN",
			country : "China",
			language : "Chinese"
		},
		{
			code : "ruRU",
			country : "Russia",
			language : "Russian"
		},
		{
			code : "ptBR",
			country : "Brazil",
			language : "Portuguese"
		},
		{
			code : "plPL",
			country : "Poland",
			language : "Polish"
		},
		{
			code : "koKR",
			country : "South Korea",
			language : "Korean"
		},
		{
			code : "itIT",
			country : "Italy",
			language : "Italian"
		},
		{
			code : "esMX",
			country : "Mexico",
			language : "Spanish"
		},
		{
			code : "esES",
			country : "Spain",
			language : "Spanish"
		},
		{
			code : "deDE",
			country : "Germany",
			language : "German"
		},
		{
			code : "jaJP",
			country : "Japan",
			language : "Japanese"
		}
	];

	exports.TAG_VALUE_MAPS =
	{
		"CardSet" :
		{
			 0 : undefined,
			 1 : "Test Temporary",
			 2 : "Basic",
			 3 : "Classic",
			 4 : "Reward",
			 5 : "Missions",
			 6 : "Demo",
			 7 : "System",
			 8 : "Debug",
			11 : "Promotion",
			12 : "Curse of Naxxramas",
			13 : "Goblins vs Gnomes",
			14 : "Blackrock Mountain",
			15 : "The Grand Tournament",
			16 : "Credits",
			17 : "Hero Skins",
			18 : "Tavern Brawl",
			20 : "League of Explorers"
		},
		"CardType" :
		{
			 0 : undefined,
			 1 : "Game",
			 2 : "Player",
			 3 : "Hero",
			 4 : "Minion",
			 5 : "Spell",
			 6 : "Enchantment",
			 7 : "Weapon",
			 8 : "Item",
			 9 : "Totem",
			10 : "Hero Power"
		},
		"Faction" :
		{
			0 : undefined,
			1 : "Horde",
			2 : "Alliance",
			3 : "Neutral"
		},
		"Rarity" :
		{
			0 : undefined,
			1 : "Common",
			2 : "Free",
			3 : "Rare",
			4 : "Epic",
			5 : "Legendary",
			6 : "Unknown_6"
		},
		"Race" :
		{
			 1 : "Blood Elf",
			 2 : "Draenei",
			 3 : "Dwarf",
			 4 : "Gnome",
			 5 : "Goblin",
			 6 : "Human",
			 7 : "Night Elf",
			 8 : "Orc",
			 9 : "Tauren",
			10 : "Troll",
			11 : "Undead",
			12 : "Worgen",
			13 : "Goblin2",
			14 : "Murloc",
			15 : "Demon",
			16 : "Scourge",
			17 : "Mech",
			18 : "Elemental",
			19 : "Ogre",
			20 : "Beast",
			21 : "Totem",
			22 : "Nerubian",
			23 : "Pirate",
			24 : "Dragon",
		},
		"Class" :
		{
			 0 : undefined,
			 1 : "Death Knight",
			 2 : "Druid",
			 3 : "Hunter",
			 4 : "Mage",
			 5 : "Paladin",
			 6 : "Priest",
			 7 : "Rogue",
			 8 : "Shaman",
			 9 : "Warlock",
			10 : "Warrior",
			11 : "Dream"
		}
	};

	exports.ENUMID_TO_NAME =
	{
		185 : "CardName",
		183 : "CardSet",
		202 : "CardType",
		201 : "Faction",
		199 : "Class",
		203 : "Rarity",
		 48 : "Cost",
		251 : "AttackVisualType",
		184 : "CardTextInHand",
		 47 : "Atk",
		 45 : "Health",
		321 : "Collectible",
		342 : "ArtistName",
		351 : "FlavorText",
		 32 : "TriggerVisual",
		330 : "EnchantmentBirthVisual",
		331 : "EnchantmentIdleVisual",
		268 : "DevState",
		365 : "HowToGetThisGoldCard",
		190 : "Taunt",
		364 : "HowToGetThisCard",
		338 : "OneTurnEffect",
		293 : "Morph",
		208 : "Freeze",
		252 : "CardTextInPlay",
		325 : "TargetingArrowText",
		189 : "Windfury",
		218 : "Battlecry",
		200 : "Race",
		192 : "Spellpower",
		187 : "Durability",
		197 : "Charge",
		362 : "Aura",
		361 : "HealTarget",
		349 : "ImmuneToSpellpower",
		194 : "Divine Shield",
		350 : "AdjacentBuff",
		217 : "Deathrattle",
		191 : "Stealth",
		220 : "Combo",
		339 : "Silence",
		212 : "Enrage",
		370 : "AffectedBySpellPower",
		240 : "Cant Be Damaged",
		114 : "Elite",
		219 : "Secret",
		363 : "Poisonous",
		215 : "Overload",
		340 : "Counter",
		205 : "Summoned",
		367 : "AIMustPlay",
		335 : "InvisibleDeathrattle",
		344 : "LocalizationNotes",
		377 : "UKNOWN_HasOnDrawEffect",
		388 : "SparePart",
		389 : "Forgetful",
		380 : "ShownHeroPower",
		396 : "HeroPowerDamage",
		401 : "EvilGlow",
		402 : "HideCost",
		403 : "Inspire",
		404 : "ReceivesDoubleSpellDamageBonus",
		415 : "Discover"
	};

	exports.NAME_TO_ENUMID = Object.swapKeyValues(exports.ENUMID_TO_NAME);

	exports.IGNORED_TAG_NAMES = ["text", "MasterPower", "Power", "TriggeredPowerHistoryInfo", "EntourageCard"];

	exports.BOOLEAN_TYPES = ["Collectible", "Elite"];

	exports.MECHANIC_TAGS = ["Windfury", "Combo", "Secret", "Battlecry", "Deathrattle", "Taunt", "Stealth", "Spellpower", "Enrage", "Freeze", "Charge", "Overload", "Divine Shield", "Silence", "Morph", "OneTurnEffect", "Poisonous", "Aura", "AdjacentBuff",
							 "HealTarget", "GrantCharge", "ImmuneToSpellpower", "AffectedBySpellPower", "Summoned", "Inspire"];
})(typeof exports==="undefined" ? window.C={} : exports);
