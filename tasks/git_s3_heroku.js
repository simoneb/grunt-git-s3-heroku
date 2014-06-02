/*
 * grunt-git-s3-heroku
 * https://github.com/simone/grunt-git-s3-heroku
 *
 * Copyright (c) 2014 Simone Busoli
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
  var exec = require('child_process').exec,
      fs = require('fs'),
      path = require('path'),
      AWS = require('aws-sdk'),
      s3 = new AWS.S3(),
      fmt = require('util').format,
      request = require('superagent');

  function validateOptions(options) {
    if (!options.s3Bucket) grunt.warn('Missing "s3Bucket" option');
    if (!options.herokuApiToken) grunt.warn('Missing "herokuApiToken" option or HEROKU_API_TOKEN environment variable');
    if (!options.herokuAppName) grunt.warn('Missing "herokuAppName" option');

    return options;
  }

  grunt.registerMultiTask('git_s3_heroku', 'The best Grunt plugin ever.', function () {
    var done = this.async(),
        options = validateOptions(this.options({
          packageDir: 'dist',
          herokuApiVersion: 3,
          s3Acl: 'public-read',
          herokuApiToken: process.env.HEROKU_API_TOKEN
        })),
        packagePath, packageName;

    grunt.log.write('Defining package name...');

    exec('git describe --always --dirty=-' + new Date().getTime(), function (err, stdo) {
      if (err) return done(err);

      packageName = stdo.toString() + '.tar.gz';
      packagePath = path.join(options.packageDir, packageName);

      grunt.log.write(packageName);
      grunt.log.ok();

      grunt.log.write('Packing application in ' + packagePath + '...');

      grunt.file.mkdir(options.packageDir);

      exec('git archive HEAD --format tar.gz -o ' + packagePath, function (err) {
        if (err) return done(err);
        grunt.log.ok();

        grunt.log.write(fmt('Uploading %s to S3 %s\\%s...',
            packagePath,
            options.s3Bucket,
            packageName));

        s3.putObject({
          Bucket: options.s3Bucket,
          Key: packageName,
          Body: fs.readFileSync(packagePath),
          ACL: options.s3Acl
        }, function (err, data) {
          if (err) return done(err);

          var s3_url = fmt('http://%s.s3.amazonaws.com/%s', options.s3Bucket, packageName),
              heroku_url = fmt('https://api.heroku.com/apps/%s/builds', options.herokuAppName);

          grunt.log.ok();
          grunt.verbose.writeflags(data, 'S3 putObject');

          request(heroku_url)
              .post('/')
              .auth('', options.herokuApiToken)
              .set('Accept', 'application/vnd.heroku+json; version=' + options.herokuApiVersion)
              .send({
                source_blob: {
                  url: s3_url,
                  version: packageName
                }
              })
              .end(function(err, res){
                if(err) return done(err);
                if(res.statusCode !== 201)
                  grunt.warn('Heroku API call returned unexpected status ' + res.statusCode);

                done();
              });
        });
      });
    });
  });

};
