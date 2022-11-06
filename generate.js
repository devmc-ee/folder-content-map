#!/usr/bin/env node
'use strict';

const { folderStructureMap } = require('./index');

const argv = require('yargs/yargs')(process.argv.slice(2))
   .describe('dir', 'directory name, relative path, default is current (./)')
   .alias('d', 'dir')
   .describe('ext', 'file extenstion to be included into the map')
   .alias('e', 'ext')
   .example('$0 --dir src/components --ext .js,.css,.scss', '')
   .argv;

const {dir, ext} = argv;


(async () => {
   const structure = await folderStructureMap(dir || './', ext && typeof ext === 'string' ? ext.split(','): []);
   console.dir(structure, {depth: null});
   
   return structure;
})();