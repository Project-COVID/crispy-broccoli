'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');
var devAssets = require('./config/assets');
var CONSTANTS = require('../server/models/constants');

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt); // Automatically load tasks
  require('time-grunt')(grunt); // Time task durations

  // Project Configuration
  grunt.initConfig({

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
          src: devAssets.vendor.css,
          dest: 'dist/assets/css/vendor.css'
        }]
      },
      vendorJS: {
        files: [{
          src: devAssets.vendor.js,
          dest: 'dist/assets/js/vendor.js'
        }]
      },
      appJS: {
        files: [{
          src: devAssets.js,
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
      appJS: {
        files: {
          'dist/assets/js/app.js': ['dist/assets/js/app.js']
        }
      }
    },

    // Copy root files not covered by other tasks
    copy: {
      vendorFonts: {
        files: [{
          expand: true,
          flatten: true,
          src: devAssets.vendor.fonts,
          dest: 'dist/assets/webfonts'
        }]
      },
      appAssets: {
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
      appJS: {
        options: {
          patterns: [{
            match: 'CONSTANTS',
            replacement: CONSTANTS
          }]
        },
        files: {
          'dist/assets/js/app.js': 'dist/assets/js/app.js'
        }
      },
      heapDev: {
        options: {
          patterns: [{
            match: 'HEAP_APP_ID',
            replacement: '1494439898'
          }]
        },
        files: {
          'dist/assets/js/vendor.js': 'dist/assets/js/vendor.js'
        }
      },
      heapDist: {
        options: {
          patterns: [{
            match: 'HEAP_APP_ID',
            replacement: '2459629627'
          }]
        },
        files: {
          'dist/assets/js/vendor.js': 'dist/assets/js/vendor.js'
        }
      }
    },

    uglify: {
      vendorJS: {
        files: [{
          src: 'dist/assets/js/vendor.js',
          dest: 'dist/assets/js/vendor.js'
        }]
      },
      appJS: {
        files: [{
          src: 'dist/assets/js/app.js',
          dest: 'dist/assets/js/app.js'
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
  grunt.registerTask('build', [
    'lint',
    'clean:dist', // Empty dist
    'concat:vendorCSS', // Concat vendor CSS & copy to dist
    'postcss:vendor', // Autoprefix & minify vendor CSS
    'postcss:dist', // Copy app CSS to dist, autoprefix & minify
    'concat:vendorJS', // Concat vendor JS & copy to dist
    'concat:appJS', // Concat app JS & copy to dist
    'replace:appJS', // Copy server constants to app JS
    'replace:heapDev', // Copy dev Heap app ID
    'htmlmin', // Minify HTML & copy to dist
    'imagemin', // Minify images & copy to dist
    'copy:vendorFonts', // Copy vendor fonts
    'copy:appAssets' // Copy assets not covered by other tasks
  ]);

  // Build prod files
  grunt.registerTask('build:prod', [ // 'ngtemplates'
    'lint',
    'clean:dist', // Empty dist
    'concat:vendorCSS', // Concat vendor CSS & copy to dist
    'postcss:vendor', // Autoprefix & minify vendor CSS
    'postcss:dist', // Copy app CSS to dist, autoprefix & minify
    'concat:vendorJS', // Concat vendor JS & copy to dist
    'uglify:vendorJS', // Minify vendor JS
    'concat:appJS', // Concat app JS & copy to dist
    'ngAnnotate:appJS', // Annotate Angular before minifying app JS
    'replace:appJS', // Copy server constants to app JS
    'replace:heapDist', // Copy production Heap app ID
    'uglify:appJS', // Minify app JS
    'htmlmin', // Minify HTML & copy to dist
    'imagemin', // Minify images & copy to dist
    'copy:vendorFonts', // Copy vendor fonts
    'copy:appAssets' // Copy assets not covered by other tasks
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
