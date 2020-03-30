'use strict';

module.exports = {
  vendor: {
    css: [
      'normalize.css/normalize.css',
      'bulma/css/bulma.min.css',
      'components-font-awesome/css/all.min.css',
      'bulma-pageloader/dist/css/bulma-pageloader.min.css'
    ],
    js: [
      'angular/angular.min.js',
      'angular-ui-router/release/angular-ui-router.min.js',
      'validator/validator.min.js',
      'lodash/lodash.min.js',
      'bulma-toast/dist/bulma-toast.min.js',
      'moment/min/moment.min.js'
    ],
    fonts: [
      'components-font-awesome/webfonts/*.*'
    ]
  },
  // less: ['/assets/styles/**/*.less'],
  css: ['assets/css/app.css'],
  // Order doesn't matter as long as init is first
  js: [
    'app/config/init.js',
    'app/config/routes.js',
    'app/!(config)/**/*.js'
  ],
  views: [
    'index.html',
    'app/**/views/**/*.html'
  ]
};
