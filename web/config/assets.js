'use strict';

module.exports = {
  vendor: {
    css: [
      'node_modules/normalize.css/normalize.css',
      'node_modules/bulma/css/bulma.min.css',
      'node_modules/components-font-awesome/css/all.min.css',
      'node_modules/bulma-pageloader/dist/css/bulma-pageloader.min.css'
    ],
    js: [
      'src/assets/lib/heap.min.js',
      'node_modules/angular/angular.min.js',
      'node_modules/angular-ui-router/release/angular-ui-router.min.js',
      'node_modules/validator/validator.min.js',
      'node_modules/lodash/lodash.min.js',
      'node_modules/bulma-toast/dist/bulma-toast.min.js',
      'node_modules/moment/min/moment.min.js'
    ],
    fonts: [
      'node_modules/components-font-awesome/webfonts/*.*'
    ]
  },
  // less: ['/assets/styles/**/*.less'],
  css: ['assets/css/app.css'],
  // Order doesn't matter as long as init is first
  js: [
    'src/app/config/init.js',
    'src/app/config/routes.js',
    'src/app/!(config)/**/*.js'
  ],
  views: [
    'index.html',
    'app/**/views/**/*.html'
  ]
};
