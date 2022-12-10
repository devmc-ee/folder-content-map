# folder-content-map
Scans folder recursivly and generates a map of the inner items. 

Install

```
npm i @devmcee/folder-content-map
```

Usage example:
```javascript
const { folderStructureMap } = require('@devmcee/folder-content-map');

const structure = await folderStructureMap('src', ['.js', '.scss']);

console.log(structure)

```

Example data output:
```
[
  {
    type: 'directory',
    parent: './src',
    itemPath: '/home/devmcee/dev/folder-content-map/src/components',
    name: 'components',
    innerItems: [
      {
        type: 'file',
        parent: '/home/devmcee/dev/folder-content-map/src/components',
        itemPath: '/home/devmcee/dev/folder-content-map/src/components/index.js',
        name: 'index.js',
        innerItems: []
      }
    ]
  }
]
```

There is an executable script that can be called with npx:

```bash
npx folder-content-map --dir src 
```

```bash
Options:
      --help     Show help                                             [boolean]
      --version  Show version number                                   [boolean]
  -d, --dir      directory name, relative path, default is current (./)
  -e, --ext      extensions separated by coma to be included into the output map

Examples:
  generate.js --dir src/components --ext .js,.css,.scss
```
