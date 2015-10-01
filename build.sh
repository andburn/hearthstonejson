#!/bin/bash

echo "Getting submodules MPQExtractor and disunity..."
git submodule init
git submodule update

echo "Building MPQExtractor..."
cd MPQExtractor
git submodule init
git submodule update
mkdir build
cd build
cmake ..
make
cd ..
cd ..

echo "Building disunity..."
cd disunity
mvn compile
mvn package
cd ..

echo "Installing NPM modules..."
npm install

echo "Linking C.js..."
cd node_modules
ln -s ../shared/C.js
cd ..

