'use strict';

const path = require('path');
const { readdir, stat } = require('fs/promises');

const ITEM_TYPE = {
  file: 'file',
  directory: 'directory',
};

/**
 *
 * @param {string} dir - folder to be analysed, default .
 * @param {srting[]} extensions - allowed file extensions to be included into the map, default []
 * @returns
 */
async function folderStructure(dir = '.', extensions = []) {
  if (typeof dir !== 'string' || !dir) {
    console.error('Invalid path');
    return filesPathMap;
  }

  return parseFolder(dir, extensions.map((ext) => ext.trim().startsWith('.') ? ext.trim(): `.${ext.trim()}`));
}

/**
 *
 * @param {string} dir - folder to be analysed, default .
 * @param {srting[]} extensions - file extensions to be included into the map, default all
 * @returns
 */
async function parseFolder(dir = '.', allowedExtensions = []) {
  const filesPathMap = [];

  try {
    const content = await readdir(dir);

    for (const item of content) {
      const itemPath = path.resolve(dir, item);
      const itemStats = await stat(itemPath);
      const isFile = itemStats.isFile();
      const isDirectory = itemStats.isDirectory();

      const itemMap = {
        type: ITEM_TYPE.file,
        parent: dir,
        path: itemPath,
        name: item,
        innerItems: [],
      };

      if (isDirectory) {
        let innerFilesMap = {};

        try {
          innerFilesMap = await parseFolder(itemPath, allowedExtensions);
        } catch (error) {
          console.log(error);
        }

        itemMap.innerItems = innerFilesMap;
        itemMap.type = ITEM_TYPE.directory;

        filesPathMap.push(itemMap);
      }

      const extension = path.extname(item);
      
      if ( isFile && (!allowedExtensions.length || allowedExtensions.includes(extension))) {
        filesPathMap.push(itemMap);
      }
    }
  } catch (err) {
    console.log(err);
  }

  return filesPathMap;
}

module.exports = { folderStructure };
