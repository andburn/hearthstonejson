#!/usr/bin/env python

import os
import json
from enum import IntEnum
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
	GameTag.TREASURE,
	GameTag.WINDFURY,
	GameTag.ImmuneToSpellpower,
	GameTag.InvisibleDeathrattle,
]


def show_field(card, k, v):
	if k == "cost" and card.type != CardType.ENCHANTMENT:
		return True
	if k == "faction" and v == Faction.NEUTRAL:
		return False
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

	if card.choose_cards:
		ret["chooseCards"] = card.choose_cards

	return ret


def export_to_file(cards, filename):
	print("Writing to %r" % (filename))
	ret = []
	for card in cards:
		ret.append(serialize_card(card))

	with open(filename, "w") as f:
		json.dump(ret, f, sort_keys=True, indent=4, separators=(",", ": "), ensure_ascii=False)


def main():
	for locale in Locale:
		if locale.unused:
			continue

		db, xml = load("hs-data/CardDefs.xml", locale=locale.name)

		basedir = os.path.join("out", "latest", locale.name)

		if not os.path.exists(basedir):
			os.makedirs(basedir)

		filename = os.path.join(basedir, "collectible.json")
		export_to_file([card for card in db.values() if card.collectible], filename)

		filename = os.path.join(basedir, "all.json")
		export_to_file(db.values(), filename)


if __name__ == "__main__":
	main()
