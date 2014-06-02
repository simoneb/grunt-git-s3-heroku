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
    git_s3_heroku: {
     test: {
       options: {
         gitDescribeArgs: ['--always'],
         accessKeyId: credentials.accessKeyId,
         secretAccessKey: credentials.secretAccessKey,
         s3Bucket: 'grunt-git-s3-heroku',
         herokuApiToken: credentials.herokuApiToken,
         herokuAppName: 'grunt-git-s3-heroku'
       }
     }
    },
    nodeunit: {
      tests: ['test/*_test.js']
    }
  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  grunt.registerTask('test', ['git_s3_heroku', 'nodeunit']);
  grunt.registerTask('default', ['jshint', 'test']);
};
