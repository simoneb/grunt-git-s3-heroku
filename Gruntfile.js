/*
 * grunt-git-s3-heroku
 * https://github.com/simone/grunt-git-s3-heroku
 *
 * Copyright (c) 2014 Simone Busoli
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  var credentials;

  try {
    credentials = require('grunt-awsebtdeploy-credentials');
  } catch (err) {
    credentials = {};
  }

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    git_s3_heroku: {
     test: {
       options: {
         accessKeyId: credentials.accessKeyId,
         secretAccessKey: credentials.secretAccessKey,
         s3Bucket: 'grunt-git-s3-heroku',
         herokuApiToken: 'c5a12c5b-0a56-423a-af73-c50a102d06c7',
         herokuAppName: 'grunt-git-s3-heroku'
       }
     }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'git_s3_heroku', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
