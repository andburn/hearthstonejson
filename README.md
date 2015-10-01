WARNING
=======
This project is broken because hearthstone updated to Unity 5 which is not fully supported yet by [https://github.com/ata4/disunity](https://github.com/ata4/disunity)


Intro
-----

This project extracts card data from Hearthstone's "cardxml0.unity3d" into JSON files.

This is then used to generate the website: [http://hearthstonejson.com](http://hearthstonejson.com)

It is meant to run in Linux. To run you need:
* nodejs
* git
* java
* cmake
* maven

NOTE: It used to extract 'cardxml0.unity3d' directly from base-Win.MPQ but due to changes by Blizzard it no longer does this. Instead, use the 'cardxml0.unity3d' file directly, found in the Data folder of the Hearthstone install location.

Build
-----

    git clone https://github.com/Sembiance/hearthstonejson.git
    cd hearthstonejson
    ./build.sh

Run
---
    node generate.js /path/to/cardxml0.unity3d
    node generateCardBacks.js /path/to/CARD_BACK.xml


Results
-------

In the 'out' directory will be a JSON file per set.
