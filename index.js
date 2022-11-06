'use strict';

const path = require('path');
const { readdir, stat } = require('fs/promises');

const ITEM_TYPE = {
    file: 'file',
    directory: 'directory',
  };

/**
 *
 * @param {string} dir - folder to be analysed, default is the current ./
 * @param {srting[]} ext - file extensions to be included into the map, default all 
 * @returns
 */
async function folderStructureMap(dir = './', ext = []) {
  const filesPathMap = [];
  if (typeof dir !== 'string' || !dir) {
    console.error('Invalid path');
    return filesPathMap;
  }

  let extensionsString = '.\\w+'; //

  if (ext.length) {
    extensionsString = ext
      .map((extension) => {
        const ext = extension.trim();

        return ext.startsWith('.') ? `${ext}` : `.${ext}`;
      })
      .join('|');
  }

  const alloweExtenstionsRegex = new RegExp(extensionsString, 'ig');

  try {
    const content = await readdir(dir);

    for (const item of content) {
      const itemPath = path.resolve(dir, item);
      const itemStats = await stat(itemPath);

      const itemMap = {
        type: ITEM_TYPE.file,
        parent: dir,
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
