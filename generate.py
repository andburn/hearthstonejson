#!/usr/bin/env python

import os
import json
from enum import IntEnum
from hearthstone.dbf import Dbf
from hearthstone.cardxml import load
from hearthstone.enums import CardType, Faction, GameTag, Locale


MECHANICS_TAGS = [
	GameTag.ADJACENT_BUFF,
	GameTag.AURA,
	GameTag.BATTLECRY,
	GameTag.CHARGE,
	GameTag.COMBO,
	GameTag.DEATHRATTLE,
	GameTag.DIVINE_SHIELD,
	GameTag.ENRAGED,
	GameTag.FORGETFUL,
	GameTag.FREEZE,
	GameTag.INSPIRE,
	GameTag.MORPH,
	GameTag.OVERLOAD,
	GameTag.POISONOUS,
	GameTag.SECRET,
	GameTag.SILENCE,
	GameTag.STEALTH,
	GameTag.SPELLPOWER,
	GameTag.TAG_ONE_TURN_EFFECT,
	GameTag.TAUNT,
	GameTag.TREASURE,
	GameTag.WINDFURY,
	GameTag.ImmuneToSpellpower,
	GameTag.InvisibleDeathrattle,
]


def json_dump(obj, filename, pretty=False):
	print("Writing to %r" % (filename))
	if pretty:
		kwargs = {"sort_keys": True, "indent": "\t", "separators": (",", ": ")}
	else:
		kwargs = {"separators": (",", ":")}
	with open(filename, "w", encoding="utf8") as f:
		json.dump(obj, f, ensure_ascii=False, **kwargs)


def show_field(card, k, v):
	if k == "cost" and card.type not in (CardType.ENCHANTMENT, CardType.HERO):
		return True
	if k == "faction" and v == Faction.NEUTRAL:
		return False
	if k == "attack" and card.type in (CardType.MINION, CardType.WEAPON):
		return True
	if k == "health" and card.type in (CardType.MINION, CardType.HERO):
		return True
	if k == "durability" and card.type == CardType.WEAPON:
		return True
	return bool(v)


def get_mechanics(card):
	ret = []
	for tag in MECHANICS_TAGS:
		value = card.tags.get(tag, 0)
		if value:
			ret.append(tag.name)
	return ret


def serialize_card(card):
	ret = {
		"id": card.id,
		"name": card.name,
		"flavor": card.flavortext,
		"textInPlay": card.playtext,
		"text": card.description,
		"faction": card.faction,
		"playerClass": card.card_class,
		"race": card.race,
		"rarity": card.rarity,
		"set": card.card_set,
		"type": card.type,
		"collectible": card.collectible,
		"attack": card.atk,
		"cost": card.cost,
		"durability": card.durability,
		"health": card.health,
	}
	ret = {k: v for k, v in ret.items() if show_field(card, k, v)}

	for k, v in ret.items():
		if isinstance(v, IntEnum):
			ret[k] = v.name

	mechanics = get_mechanics(card)
	if mechanics:
		ret["mechanics"] = mechanics

	if card.entourage:
		ret["entourage"] = card.entourage

	if card.requirements:
		ret["playRequirements"] = {k.name: v for k, v in card.requirements.items()}

	# if card.choose_cards:
		# ret["chooseCards"] = card.choose_cards

	return ret


def export_cards_to_file(cards, filename):
	ret = []
	for card in cards:
		ret.append(serialize_card(card))

	json_dump(ret, filename)


def write_cardbacks(dbf, filename, locale):
	ret = []

	for record in dbf.records:
		ret.append({
			"id": record["ID"],
			"note_desc": record["NOTE_DESC"],
			"source": record["SOURCE"],
			"enabled": record["ENABLED"],
			"name": record["NAME"][locale.name],
			"prefab_name": record["PREFAB_NAME"],
			"description": record["DESCRIPTION"][locale.name],
			"source_description": record["SOURCE_DESCRIPTION"].get(locale.name, ""),
		})

	json_dump(ret, filename)


def main():
	for locale in Locale:
		if locale.unused:
			continue

		db, xml = load("hs-data/CardDefs.xml", locale=locale.name)

		basedir = os.path.join("out", "latest", locale.name)
		if not os.path.exists(basedir):
			os.makedirs(basedir)

		filename = os.path.join(basedir, "cards.json")
		export_cards_to_file(db.values(), filename)

		filename = os.path.join(basedir, "cards.collectible.json")
		export_cards_to_file([card for card in db.values() if card.collectible], filename)

		filename = os.path.join(basedir, "cardbacks.json")
		dbf = Dbf.load("hs-data/DBF/CARD_BACK.xml")
		write_cardbacks(dbf, filename, locale)


if __name__ == "__main__":
	main()
