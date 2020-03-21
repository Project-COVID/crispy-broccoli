'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash');
var devAssets = require('./config/assets/development');
var prodAssets = require('./config/assets/production')
var defaultAssets = require('./config/assets/default');
var configUtils = require('./config/config.utils');
var defaultConfig = require('./config/env/default');
var devConfig = require('./config/env/development');
var prodConfig = require('./config/env/production');
var fs = require('fs');
var path = require('path');
var pkg = require('./package.json');

// Helpers for build tasks that require array of static routes
devAssets.client.concat = {
  js: {
    site: configUtils.getGlobbedPaths(_.concat(devAssets.client.lib.js.site, devAssets.client.js.site), 'src/'),
    app: configUtils.getGlobbedPaths(_.concat(devAssets.client.lib.js.app, devAssets.client.js.app), 'src/')
  },
  css: {
    site: configUtils.getGlobbedPaths(_.concat(devAssets.client.lib.css.site, devAssets.client.css.site), 'src/'),
    app: configUtils.getGlobbedPaths(_.concat(devAssets.client.lib.css.app, devAssets.client.css.app), 'src/')
  }
};

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt); // Automatically load tasks
  require('time-grunt')(grunt); // Time task durations

  // Project Configuration
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    env: {
      dev: {
        NODE_ENV: 'development'
      },
      prod: {
        NODE_ENV: 'production'
      }
    },

    /* Security tasks */

    retire: {
      js: ['src/assets/lib/**/*.js'],
      options: {
        verbose: false
      }
    },

    /* Release tasks */

    // Usage:
    // grunt bump
    // grunt bump:patch [default]
    // grunt bump:minor
    // grunt bump:major
    bump: {
      options: {
        files: ['package.json', 'src/assets/data/appVersion.json', 'npm-shrinkwrap.json'],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['-a'],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Release v%VERSION%',
        push: true,
        pushTo: 'origin',
        gitDescribeOptions: '--tags'
      }
    },

    /* Watching task */

    watch: {
      serverViews: {
        files: devAssets.server.views,
        options: {
          livereload: true
        }
      },
      serverJS: {
        files: _.union(defaultAssets.server.gruntConfig, defaultAssets.server.allJS),
        options: {
          livereload: true
        }
      },
      clientViews: {
        files: _.union(devAssets.client.views.site, devAssets.client.views.app, devAssets.client.views.admin),
        tasks: ['ngtemplates'],
        options: {
          livereload: true
        }
      },
      clientJS: {
        files: _.union(devAssets.client.js.site, devAssets.client.js.app, devAssets.client.js.admin),
        options: {
          livereload: true
        }
      },
      clientLESS: {
        files: devAssets.client.less,
        tasks: ['compileCSS'],
        options: {
          livereload: true
        }
      }
    },

    /* Compilation tasks */

    less: {
      default: {
        files: [{
          expand: true,
          cwd: 'src/assets/styles',
          src: ['app.less', 'site.less', 'admin.less'],
          ext: '.css',
          dest: 'src/assets/styles'
        }]
      }
    },

    postcss: {
      options: {
        map: true,
        processors: [
          // Add vendor prefixed styles
          require('autoprefixer')({
            browsers: ['> 1%', 'last 4 versions']
          })
        ]
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'src/assets/styles',
          src: ['app.css', 'site.css', 'admin.css'],
          dest: 'src/assets/styles'
        }]
      }
    },

    ngtemplates: {
      siteDev: {
        src: devAssets.client.views.site,
        dest: 'src/app/site/config/templates.js',
        options: {
          module: 'app',
          url: stripCwdPrefix
        }
      },
      siteDist: {
        src: prodAssets.client.views.site,
        dest: 'src/app/site/config/templates.js',
        options: {
          module: 'app',
          url: stripCwdPrefix
        }
      }
    },

    ngAnnotate: {
      options: {
        singleQuotes: true
      },
      app: {
        files: {
          'dist/assets/scripts/site.js': devAssets.client.js.site,
          'dist/assets/scripts/app.js': devAssets.client.js.app,
          'dist/assets/scripts/admin.js': devAssets.client.js.admin
        }
      }
    },

    /* Linting tasks */

    eslint: {
      allJS: {
        options: {},
        src: _.without(devAssets.client.js, 'web/app/config/templates.js')
      }
    },

    /* Build tasks */

    // Empties folders to start fresh
    clean: {
      assets: {
        files: [{
          dot: true,
          src: 'dist/*'
        }]
      }
    },

    // Copies remaining files to places other tasks can use
    // TODO: Temporarily copying all images until we fix imagemin speed
    copy: {
      assets: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'src',
          dest: 'dist',
          src: [
            '*.*', // All files and icons at root
            'assets/images/**/*.*',
            'assets/fonts/**/*.*',
            'assets/mediakit/**/*.*',
            'assets/data/**/*.*',
            'server-views/**/*.html',
            'app/**/*.{html,json}'
          ]
        }]
      },
      cachedJS: {
        files: [{
          expand: true,
          dot: true,
          cwd: '.cache',
          dest: 'dist/assets',
          src: [
            'scripts/**/*.*'
          ]
        }]
      },
      awsDist: {
        files: [{
          expand: true,
          dot: true,
          dest: 'aws-dist',
          src: [
            '.ebextensions/**/*',
            'config/**/*',
            'custom_modules/**/*',
            'server/**/*',
            'dist/**/*',
            'package.json',
            'npm-shrinkwrap.json',
            'server.js'
          ]
        }]
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      assetsDist: {
        src: [
          'dist/assets/**/*.*',
          '!dist/assets/scripts/**/*.*', // Separate filerev
          '!dist/assets/fonts/**/*.*', // Fonts don't change
          '!dist/assets/mediakit/**/*.*', // Mediakit
          '!dist/assets/data/**/*.*',
          '!dist/assets/images/app/graph/{basal,bolus,carbs,exercise,note,sleep}-icon.png',
          '!dist/assets/images/app/feeling/*.svg',
          '!dist/assets/images/emoji/*.*',
          '!dist/assets/images/social/share-widget-card*.png' // For sharing to social media
        ]
      },
      jsDist: {
        src: [
          'dist/assets/scripts/**/*.*'
        ]
      },
      cssDist: {
        src: [
          'dist/assets/styles/**/*.*'
        ]
      }
    },

    /* Minification tasks */

    uglify: {
      vendor: {
        files: {
          'web/dist/assets/scripts/vendor.js': devAssets.client.lib.js
        }
      },
      app: {
        files: { // Update in place - files have already been concatenated and moved by ngAnnotate task
          'web/dist/assets/scripts/app.js': 'web/dist/assets/scripts/app.js',
        }
      }
    },

    cssmin: {
      vendor: {
        files: {
          'web/dist/assets/styles/vendor.css': devAssets.client.lib.css
        }
      },
      app: {
        files: {
          'web/dist/assets/styles/site.css': devAssets.client.css,
        }
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'web/dist/assets/images',
          src: '**/*.{gif,jpeg,jpg,png}',
          dest: 'web/dist/assets/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'web/dist/assets/images',
          src: '**/*.svg',
          dest: 'web/dist/assets/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeComments: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true,
          removeRedundantAttributes: false, // true would impact styles with attribute selectors
          useShortDoctype: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          ignoreCustomFragments: [/{%[\s\S]*?%}/] // Nunjucks
        },
        files: [{
          expand: true,
          cwd: 'web/dist',
          src: ['*.html', 'app/**/views/**/*.html'],
          dest: 'web/dist'
        }]
      }
    },

    // Performs rewrites based on rev
    usemin: {
      options: {
        assetsDirs: [
          'web/dist', 'web/dist/assets/images'
        ]
      },
      html: ['web/dist/index.html', 'web/dist/app/**/views/**/*.html'],
      css: ['web/dist/assets/styles/**/*.css']
    },

    /* Server tasks */

    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          nodeArgs: ['--debug'],
          ext: 'js, html',
          watch: _.union(defaultAssets.server.gruntConfig, devAssets.server.views, defaultAssets.server.allJS)
        }
      }
    },

    concurrent: {
      default: ['nodemon', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    }

  });

  // Compile & prefix CSS
  grunt.registerTask('compileCSS', ['less', 'postcss']);

  // Lint CSS and JavaScript files. eslint
  grunt.registerTask('lint', ['newer:eslint']);

  // Security-related checks
  grunt.registerTask('security', ['retire']); // 'exec:audit'

  // Build production files
  grunt.registerTask('build', [
    'env:dev',
    'lint',
    'security',
    'clean:assets',
    'compileCSS',
    'cssmin',
    'copy:assets',
    'svgmin',
    'filerev:assetsDist',
    'usemin',
    'htmlmin:dist',
    'ngtemplates:appDist',
    'ngAnnotate',
    'changed:uglify:vendor',
    'uglify:app',
    'copy:cachedJS',
    'filerev:jsDist'
  ]);

  // Run the project in development mode
  grunt.registerTask('default', ['serve']); // 'lint',
  grunt.registerTask('serve', [
    'env:dev',
    'compileCSS',
    'ngtemplates',
    'concurrent'
  ]);
  
  // Run the project in production mode
  grunt.registerTask('serve:prod', [
    'build',
    'env:prod',
    'concurrent'
  ]);

};
