#!/ust/bin/env node

'use strict';

const path = require('path');
const { readdir, stat } = require('fs/promises');

const ITEM_TYPE = {
    file: 'file',
    directory: 'directory',
  };

/**
 *
 * @param {string} folderPath - folder to be analysed, default is current
 * @param {srting[]} extensions - allowed file extensions, default any
 * @returns
 */
async function folderStructureMap(folderPath = './', extensions = []) {
  const filesPathMap = [];
  if (typeof folderPath !== 'string' || !folderPath) {
    console.error('Invalid path');
    return filesPathMap;
  }

  let extensionsString = '\w'; //

  if (extensions.length) {
    extensionsString = extensions
      .map((extension) => {
        return extension.startsWith('.') ? `${extension}` : `.${extension}`;
      })
      .join('|');
  }

  const alloweExtenstionsRegex = new RegExp(extensionsString, 'ig');

  try {
    const content = await readdir(folderPath);

    for (const item of content) {
      const itemPath = path.resolve(folderPath, item);
      const itemStats = await stat(itemPath);

      const itemMap = {
        type: ITEM_TYPE.file,
        parent: folderPath,
        itemPath,
        name: item,
        innerItems: [],
      };

      if (itemStats.isDirectory()) {
        const innerFilesMap = await folderStructureMap(itemPath);

        itemMap.innerItems = innerFilesMap;
        itemMap.type = ITEM_TYPE.directory;

        filesPathMap.push(itemMap);
      }

      if (
        itemStats.isFile() &&
        alloweExtenstionsRegex.test(path.extname(item))
      ) {
        filesPathMap.push(itemMap);
      }
    }
  } catch (err) {
    console.log(err);
  }

  return filesPathMap;
}

module.exports = { folderStructureMap };
