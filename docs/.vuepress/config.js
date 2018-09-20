const pkg = require('../../package.json');

module.exports = {
  base:'/vue-i18next/',
  title: pkg.name,
  description: pkg.description,

  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
  ],
  serviceWorker: false,
  themeConfig: {
    repo: 'panter/vue-i18next',
    editLinks: true,
    docsDir: 'docs',
    locales: {
      '/': {
        label: 'English',
        selectText: 'Languages',
        editLinkText: 'Edit this page on GitHub',
        lastUpdated: 'Last Updated',
        nav: [
          {
            text: 'Guide',
            link: '/guide/started.md',
          },
          {
            text: 'Release Notes',
            link: 'https://github.com/panter/vue-i18next/releases'
          }
        ],
        sidebar: [
          '/installation.md',
          '/introduction.md',
          {
            title: 'Guide',
            collapsable: false,
            children: [
              '/guide/started.md',
              '/guide/component.md',
              '/guide/component-interpolation.md',
              '/guide/directive.md',
              '/guide/i18n-options.md',
              '/guide/i18n.md',
              '/guide/single-file-component.md',
              '/guide/miscellaneous.md',
            ]
          }
        ]
      }
    }
  }
}
