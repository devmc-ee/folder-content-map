#!/usr/bin/env node
'use strict';

const { folderStructure } = require('./index');

const argv = require('yargs/yargs')(process.argv.slice(2))
   .options({
      'dir': {
      alias: 'd',
      describe: 'a relative path to the target folder, default is current ./'
      },
      'ext': {
      alias: 'e',
      describe: 'allowed file extension, that should be included into the output.No limit by default'
      }
   })
   .example('$0 --dir src/components --ext .js,.css,.scss', '')
   .argv;

const {dir, ext} = argv;

(async () => {
   console.log({ dir, ext })
   const structure = await folderStructure(dir || '.', ext && typeof ext === 'string' ? ext.split(','): []);
   
   console.dir(structure, {depth: null});
   
   return structure;
})();