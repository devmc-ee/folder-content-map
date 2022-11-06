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
 * @param {srting[]} ext - filter file extensions, default any
 * @returns
 */
async function folderStructureMap(folderPath = './', ext = []) {
  const filesPathMap = [];
  if (typeof folderPath !== 'string' || !folderPath) {
    console.error('Invalid path');
    return filesPathMap;
  }

  let extensionsString = '.\\w+'; //

  if (ext.length) {
    extensionsString = ext
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
        itemStats.isFile() && alloweExtenstionsRegex.test(path.extname(item))
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
