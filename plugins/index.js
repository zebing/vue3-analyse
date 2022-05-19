const glob = require('glob');
const path = require('path');

module.exports = (options, ctx) => {
  const paths = glob.sync('**/*.md', {
    cwd: path.resolve(process.cwd(), 'docs'),
  });
  const mdPaths = paths.filter((path) => /(?<!index)(?<!README)\.md$/.test(path));
  const slideConfig = mdPaths.reduce((obj, path) => {
    let [folder] = path.split('/');
    folder = folder.replace(/^[0-9]+/gi, '');

    if (!obj[folder]) {
      obj[folder] = [];
    }

    obj[folder].push(path);
    return obj;
  }, {});
  const sidebar = ctx.themeConfig.sidebar['/'] = [''];

  for (let prop in slideConfig) {
    let item = slideConfig[prop];
    
    if (item.length !== 1) {
      item[0] = {
        title: prop,
        collapsable: true,
        children: [...item]
      }
    }

    sidebar.push(item[0]);
  }
}
