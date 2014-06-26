var childProcess = require('child_process');

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      files: [
        'backbone.queryparams.js',
        'test/*.js'
      ]
    },

    connect: {
      options: {
        base: '.',
        hostname: '*',
        port: 9999
      },
      server: {},
      keepalive: {
        options: {
          keepalive: true
        }
      }
    },
    'saucelabs-qunit': {
      all: {
        options: {
          testname: 'backbone-query-parameters',
          build: process.env.TRAVIS_JOB_ID,
          urls: ['http://localhost:9999/test/test.html', 'http://localhost:9999/test/test-1.1.html'],
          detailedError: true,
          concurrency: 2,
          browsers: [
            {browserName: 'chrome'},
            {browserName: 'firefox'},
            {browserName: 'firefox', version: '3.6'},
            {browserName: 'safari', version: 7, platform: 'OS X 10.9'},
            {browserName: 'safari', version: 6, platform: 'OS X 10.8'},
            {browserName: 'safari', version: 5},
            {browserName: 'opera', version: 12},
            {browserName: 'opera', version: 11},
            {browserName: 'internet explorer', version: 11, platform: 'Windows 8.1'},
            {browserName: 'internet explorer', version: 10, platform: 'Windows 8'},
            {browserName: 'internet explorer', version: 9, platform: 'Windows 7'},
            {browserName: 'internet explorer', version: 8, platform: 'XP'},
            {browserName: 'internet explorer', version: 7, platform: 'XP'},
            {browserName: 'internet explorer', version: 6, platform: 'XP'}
          ]
        }
      }
    },
    closureCompiler: {
		options: {
			compilerFile: 'lib/compiler.jar',

			checkModified: true,
			
			compilerOpts: {
				compilation_level: 'SIMPLE_OPTIMIZATIONS',
				language_in: 'ECMASCRIPT5',
				create_source_map: 'backbone.queryparams.min.map'
			}
		},
		
		dist: {
			src: 'backbone.queryparams.js',
			dest: 'backbone.queryparams.min.js'
		}
	}
  });

  // Load tasks from npm
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-saucelabs');
  grunt.loadNpmTasks('grunt-closure-tools');

  grunt.registerTask('sauce', process.env.SAUCE_USERNAME ? ['connect:server', 'saucelabs-qunit'] : []);

  grunt.registerTask('travis', ['sauce']);

  grunt.registerTask('minify', ['closureCompiler']);
  
  grunt.registerTask('dev', ['jshint', 'connect:keepalive']);
  grunt.registerTask('default', ['jshint', 'minify']);
};
