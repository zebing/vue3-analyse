module.exports = {
  plugins: [
    require('../../plugins'),
  ],
  base: '/vue3-analyse/',
  dest: 'dist',
  title: 'vue3 技术原理',
  description: 'Analysis vue.js deeply',
  head: [
    ['link', { rel: 'icon', href: `/logo.png` }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
  ],
  serviceWorker: false,
  themeConfig: {
    repo: 'zebing/vue3-analyse',
    "repoLabel": "去 github 给个⭐",
    editLinks: true,
    docsDir: 'docs',
    editLinkText: '在 GitHub 上编辑此页',
    lastUpdated: '上次更新',
    nav: [],
    sidebar: {}
  }
}
