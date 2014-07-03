#!/usr/bin/env node

var fs = require('fs');

if(!fs.existsSync('./node_modules/istanbul')) {
	fs.symlinkSync('./intern-geezer/node_modules/istanbul', './node_modules/istanbul');
}
if(!fs.existsSync('./node_modules/source-map')) {
	fs.symlinkSync('./intern-geezer/node_modules/source-map', './node_modules/source-map');
}