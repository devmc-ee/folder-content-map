'use strict';

const { folderStructureMap } = require('./index');

const argv = require('yargs/yargs')(process.argv.slice(2)).demandOption(['path','ext']).argv;

const {path, ext} = argv;
console.log(argv);

(async () => {
   const structure = await folderStructureMap(path || './', ext ? ext.split(','): []);
   console.dir(structure, { depth: null });
   return structure;
})();