# API v1

Hearthstone JSON files are automatically converted from the game files, found
in the [hs-data repository](https://github.com/HearthSim/hs-data/).

The API is available at [api.hearthstonejson.com/v1/](https://api.hearthstonejson.com/v1/)

The files are all in JSON format, encoded in UTF-8 and categorized by build,
then by locale.

The `/v1/latest/` endpoint redirects (302) to whichever build is the latest one.

See the `cards.md` and `cardbacks.md` files for further documentation.
