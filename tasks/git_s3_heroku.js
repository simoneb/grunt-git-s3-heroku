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
      fmt = require('util').format,
      request = require('superagent');

  function validateOptions(options) {
    if (!options.s3Bucket) grunt.warn('Missing "s3Bucket" option.');
    if (!options.herokuApiToken) grunt.warn('Missing "herokuApiToken" option or HEROKU_API_TOKEN environment variable.');
    if (!options.herokuAppName) grunt.warn('Missing "herokuAppName" option.');
    if (!options.accessKeyId) grunt.warn('Missing "accessKeyId" option or AWS_ACCESS_KEY_ID environment variable.');
    if (!options.secretAccessKey) grunt.warn('Missing "secretAccessKey" option or AWS_SECRET_ACCESS_KEY environment variable.');

    return options;
  }

  grunt.registerMultiTask('git_s3_heroku', 'Deploy git-controlled app to heroku via S3', function () {
    var done = this.async(),
        options = validateOptions(this.options({
          packageDir: 'tmp',
          herokuApiVersion: 3,
          s3Acl: 'public-read',
          herokuApiToken: process.env.HEROKU_API_TOKEN,
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        })),
        packagePath, packageName;

    grunt.log.write('Defining package name...');

    exec('git describe --always --dirty=-' + new Date().getTime(), function (err, stdo) {
      if (err) return done(err);

      packageName = stdo.toString().trim() + '.tar.gz';
      packagePath = path.join(options.packageDir, packageName);

      grunt.log.write(fmt('%s. ', packageName));
      grunt.log.ok();

      grunt.log.write(fmt('Packing application in %s... ', packagePath));

      grunt.file.mkdir(options.packageDir);

      exec('git archive HEAD --format tar.gz -o ' + packagePath, function (err) {
        if (err) return done(err);
        grunt.log.ok();

        grunt.log.write(fmt('Uploading %s to S3 %s\\%s... ',
            packagePath,
            options.s3Bucket,
            packageName));

        var s3 = new AWS.S3({
          accessKeyId: options.accessKeyId,
          secretAccessKey: options.secretAccessKey
        });

        s3.putObject({
          Bucket: options.s3Bucket,
          Key: packageName,
          Body: fs.readFileSync(packagePath),
          ACL: options.s3Acl
        }, function (err, data) {
          if (err) return done(err);

          grunt.log.ok();
          grunt.verbose.writeflags(data, 'S3 putObject');
          grunt.log.write(fmt('Deploying build to heroku... '));

          request
              .post(fmt('https://api.heroku.com/apps/%s/builds', options.herokuAppName))
              .auth('', options.herokuApiToken)
              .set('Accept', 'application/vnd.heroku+json; version=' + options.herokuApiVersion)
              .send({
                source_blob: {
                  url: fmt('http://%s.s3.amazonaws.com/%s', options.s3Bucket, packageName),
                  version: packageName
                }
              })
              .end(function (err, res) {
                if (err) return done(err);
                grunt.verbose.writeflags(res.body, 'Heroku');

                if (res.status !== 201) {
                  grunt.warn(fmt('Heroku API call failed with status %s: "%s". ', res.status, res.body.message));
                }

                grunt.log.ok();

                done();
              });
        });
      });
    });
  });

};
