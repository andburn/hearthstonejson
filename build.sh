#!/bin/bash

echo "Installing NPM modules..."
npm install

echo "Linking C.js..."
cd node_modules
ln -s ../shared/C.js
cd ..

