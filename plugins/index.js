const glob = require('glob');

module.exports = (options, ctx) => {
  const paths = glob.sync('docs/**/*');
  const mdPaths = paths.filter((path) => /(?<!index)(?<!docs\/README)\.md$/.test(path));
  const slideConfig = mdPaths.reduce((obj, path) => {
    const pathArr = path.replace(/README.md/gi, '').split('/');
    pathArr[0] = `/${pathArr[0]}/`;

    if (!obj[pathArr[0]]) {
      obj[pathArr[0]] = [];
    }

    let item = obj[pathArr[0]].filter((item) => item.key === pathArr[1])[0];

    if (!item) {
      item = {
        title: pathArr[1].replace(/^[0-9]+/gi, ''),
        collapsable: true,
        key: pathArr[1],
        children: []
      }
      obj[pathArr[0]].push(item);
    }

    item.children.push(pathArr.slice(1).join('/'));
    return obj;
  }, {})
  const sidebar = [];
  Object.keys(slideConfig).forEach((key) => {
    slideConfig[key].map((item) => {
      sidebar.push(item.children.length === 1 ? item.children[0] : item)
    })
  });
  ctx.themeConfig.sidebar['/'] = ['', ...sidebar];
}
