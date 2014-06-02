# grunt-git-s3-heroku

> Deploy a git-versioned application to Heroku via AWS S3

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-git-s3-heroku --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-git-s3-heroku');
```

## The "git_s3_heroku" task

### Overview
In your project's Gruntfile, add a section named `git_s3_heroku` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  git_s3_heroku: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### How it works

This plugin deploys a git-versioned application to Heroku via S3. Here's how it does it:

1. run `git describe` to create a name for the package
2. run `git archive` to create the package
3. upload the package to AWS S3
4. deploy the package to Heroku using the Heroku Platform API

### Options

#### options.gitDescribeArgs
Type: `Array`, `Function`
Default value: `[]`

Command line args to supply to `git describe`. Common options are `--always` and `--dirty`.  
When a function is supplied it should return a string containing all args.

#### options.packageDir
Type: `String`
Default value: `os.tmpdir()`

The folder in which the temporary package is saved before being uploaded to S3.

#### options.accessKeyId
Type: `String`
Default value: `process.env.AWS_ACCESS_KEY_ID`

The AWS access key id.

#### options.secretAccessKey
Type: `String`
Default value: `process.env.AWS_SECRET_ACCESS_KEY`

The AWS secret access key.

#### options.s3Bucket
Type: `String`

The name of the AWS S3 bucket where to upload the packaged application.

#### options.s3Acl
Type: `String`
Default value: `public-read`

The AWS S3 ACL to apply to the uploaded object.

#### options.herokuAppName
Type: `String`

The name of the heroku application.

#### options.herokuApiToken
Type: `String`
Default value: `process.env.HEROKU_API_TOKEN`

The API token to use to authenticate to the heroku platform API.

### Usage Examples

```js
grunt.initConfig({
  git_s3_heroku: {
    myApp: {
      gitDescribeArgs: ['--always'],
      s3Bucket: 'my-bucket',
      herokuAppName: 'my-app'
    }
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
03/06/2014    v0.1.0    Initial release
