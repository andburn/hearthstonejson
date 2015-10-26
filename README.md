Intro
-----

This project extracts card data from Hearthstone into JSON files.

This is then used to generate the website: [http://hearthstonejson.com](http://hearthstonejson.com)

It is meant to run in Linux. To run you need:
* nodejs
* git

Build
-----

    git clone https://github.com/Sembiance/hearthstonejson.git
    cd hearthstonejson
    ./build.sh

Run
---
    node generate.js
    node generateCardBacks.js


Results
-------

In the 'out' directory will be a JSON file per set.
