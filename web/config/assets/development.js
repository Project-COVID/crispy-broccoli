'use strict';

module.exports = {
  client: {
    lib: {
      css: [
        'web/src/assets/lib/normalize.css/normalize.css',
        'web/src/assets/lib/bulma/css/bulma.min.css'
      ],
      js: [
        'web/src/assets/lib/angular/angular.min.js',
        'web/src/assets/lib/angular-ui-router/release/angular-ui-router.min.js',
        'web/src/assets/lib/validator-js/validator.min.js',
        'web/src/assets/lib/lodash/dist/lodash.min.js'
      ]
    },
    less: ['web/src/assets/styles/**/*.less'],
    css: ['web/src/assets/styles/app.css'],
    // Order doesn't matter as long as config & init are first
    js: [
      'web/src/app/config/{config,init}.js',
      'web/src/app/config/templates.js',
      'web/src/app/!(config)/**/*.js'
    ],
    views: [
      'web/src/app/**/views/**/*.html'
    ]
  }
};
