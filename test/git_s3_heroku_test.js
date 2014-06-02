'use strict';

var grunt = require('grunt'),
    request = require('superagent'),
    version = require('../package.json').version;

/*
 ======== A Handy Little Nodeunit Reference ========
 https://github.com/caolan/nodeunit

 Test methods:
 test.expect(numAssertions)
 test.done()
 Test assertions:
 test.ok(value, [message])
 test.equal(actual, expected, [message])
 test.notEqual(actual, expected, [message])
 test.deepEqual(actual, expected, [message])
 test.notDeepEqual(actual, expected, [message])
 test.strictEqual(actual, expected, [message])
 test.notStrictEqual(actual, expected, [message])
 test.throws(block, [error], [message])
 test.doesNotThrow(block, [error], [message])
 test.ifError(value)
 */

exports.git_s3_heroku = {
  setUp: function (done) {
    // setup here if necessary
    done();
  },

  test: function (test) {
    test.expect(2);

    request
        .get('http://grunt-git-s3-heroku.herokuapp.com/')
        .end(function (res) {
          test.equal(res.status, 200, 'status');
          test.equal(res.text, version, 'text');
          test.done();
        });
  }
};
