'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');
var devAssets = require('./config/assets');
// var configUtils = require('./config/config.utils');
var CONSTANTS = require('../server/models/constants');

var fs = require('fs');
var path = require('path');

// Helpers for build tasks that require array of static routes
// devAssets.concat = {
//   js: {
//     site: configUtils.getGlobbedPaths(_.concat(devAssets.lib.js.site, devAssets.js.site), 'src/'),
//     app: configUtils.getGlobbedPaths(_.concat(devAssets.lib.js.app, devAssets.js.app), 'src/')
//   },
//   css: {
//     site: configUtils.getGlobbedPaths(_.concat(devAssets.lib.css.site, devAssets.css.site), 'src/'),
//     app: configUtils.getGlobbedPaths(_.concat(devAssets.lib.css.app, devAssets.css.app), 'src/')
//   }
// };

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt); // Automatically load tasks
  require('time-grunt')(grunt); // Time task durations

  // Project Configuration
  grunt.initConfig({

    // env: {
    //   dev: {
    //     NODE_ENV: 'development'
    //   },
    //   prod: {
    //     NODE_ENV: 'production'
    //   }
    // },

    /* Security tasks */

    // retire: {
    //   js: ['src/assets/lib/**/*.js'],
    //   options: {
    //     verbose: false
    //   }
    // },
    
    /* Linting tasks */

    eslint: {
      options: {},
      target: devAssets.js
    },

    /* Build tasks */

    // Empties folders to start fresh
    clean: {
      dist: ['dist/']
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'src',
          src: '**/*.{gif,jpeg,jpg,png}',
          dest: 'dist'
        }]
      }
    },

    concat: {
      vendorCSS: {
        files: [{
          src: _.map(devAssets.vendor.css, function (d) {
            return 'node_modules/' + d;
          }),
          dest: 'dist/assets/css/vendor.css'
        }]
      },
      vendorJS: {
        files: [{
          src: _.map(devAssets.vendor.js, function (d) {
            return 'node_modules/' + d;
          }),
          dest: 'dist/assets/js/vendor.js'
        }]
      },
      appJS: {
        files: [{
          src: _.map(devAssets.js, function (d) {
            return 'src/' + d;
          }),
          dest: 'dist/assets/js/app.js'
        }]
      },
    },

    postcss: {
      options: {
        processors: [
          require('pixrem')(), // add fallbacks for rem units
          require('autoprefixer')(), // Vendor prefixes
          require('cssnano')() // Minify
        ]
      },
      vendor: {
        // options: {
        //   map: false
        // },
        src: 'dist/assets/css/vendor.css'
      },
      dist: {
        // options: {
        //   map: true // Create source map
        // },
        files: [{
          expand: true,
          cwd: 'src',
          src: devAssets.css,
          dest: 'dist'
        }]
      },
    },

    // ngtemplates: {
    //   app: {
    //     src: devAssets.views,
    //     dest: '.tmp/templates.js'
    //   }
    // },

    ngAnnotate: {
      options: {
        singleQuotes: true
      },
      dist: {
        files: {
          'dist/assets/js/app.js': ['dist/assets/js/app.js']
        }
      }
    },

    // Copy root files not covered by other tasks
    copy: {
      vendor: {
        files: [{
          expand: true,
          flatten: true,
          src: _.map(devAssets.vendor.fonts, function (d) {
            return 'node_modules/' + d;
          }),
          dest: 'dist/assets/webfonts'
        }]
      },
      dist: {
        files: [{
          cwd: 'src',
          dest: 'dist',
          expand: true,
          src: [ // Txt and manifest files at root
            '*.txt',
            '*.webmanifest'
          ]
        }]
      }
    },

    replace: {
      dist: {
        options: {
          patterns: [{
            match: 'CONSTANTS',
            replacement: CONSTANTS
          }]
        },
        files: {
          'dist/assets/js/app.js': 'dist/assets/js/app.js'
        }
      }
    },

    // Renames files for browser caching purposes
    // filerev: {
    //   assetsDist: {
    //     src: [
    //       'dist/assets/**/*.*',
    //       '!dist/assets/scripts/**/*.*', // Separate filerev
    //       '!dist/assets/fonts/**/*.*', // Fonts don't change
    //       '!dist/assets/mediakit/**/*.*', // Mediakit
    //       '!dist/assets/data/**/*.*',
    //       '!dist/assets/images/app/graph/{basal,bolus,carbs,exercise,note,sleep}-icon.png',
    //       '!dist/assets/images/app/feeling/*.svg',
    //       '!dist/assets/images/emoji/*.*',
    //       '!dist/assets/images/social/share-widget-card*.png' // For sharing to social media
    //     ]
    //   },
    //   jsDist: {
    //     src: [
    //       'dist/assets/scripts/**/*.*'
    //     ]
    //   },
    //   cssDist: {
    //     src: [
    //       'dist/assets/styles/**/*.*'
    //     ]
    //   }
    // },

    uglify: {
      dist: {
        files: [{
          expand: true,
          cwd: 'dist/assets/js',
          src: '**/*.js',
          dest: 'dist/assets/js'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
          // collapseBooleanAttributes: true,
          // removeAttributeQuotes: true,
          // removeEmptyAttributes: true,
          // removeOptionalTags: true,
          // removeRedundantAttributes: true,
          // useShortDoctype: true,
          // removeScriptTypeAttributes: true,
          // removeStyleLinkTypeAttributes: true
        },
        files: [{
          expand: true,
          cwd: 'src',
          src: devAssets.views,
          dest: 'dist'
        }]
      }
    },

    // Performs rewrites based on rev
    // usemin: {
    //   options: {
    //     assetsDirs: [
    //       'web/dist', 'web/dist/assets/images'
    //     ]
    //   },
    //   html: ['web/dist/index.html', 'web/dist/app/**/views/**/*.html'],
    //   css: ['web/dist/assets/styles/**/*.css']
    // },

  });

  // Compile & prefix CSS
  // grunt.registerTask('compileCSS', ['less', 'postcss']);

  // Lint CSS and JavaScript files. eslint
  grunt.registerTask('lint', ['newer:eslint']);

  // Security-related checks
  // grunt.registerTask('security', ['retire']); // 'exec:audit'

  // Build dev files
  grunt.registerTask('build', [ // 'ngtemplates',
    'lint',
    'clean',
    'imagemin',
    'htmlmin',
    'copy',
    'concat',
    'postcss',
    'ngAnnotate',
    'replace',
    'uglify'
  ]);

  // Build production files
  // grunt.registerTask('build', [
  //   'env:dev',
  //   'lint',
  //   'security',
  //   'clean:assets',
  //   'compileCSS',
  //   'cssmin',
  //   'copy:assets',
  //   'svgmin',
  //   'filerev:assetsDist',
  //   'usemin',
  //   'htmlmin:dist',
  //   'ngtemplates:appDist',
  //   'ngAnnotate',
  //   'changed:uglify:vendor',
  //   'uglify:app',
  //   'copy:cachedJS',
  //   'filerev:jsDist'
  // ]);

  grunt.registerTask('default', ['lint']);

};
