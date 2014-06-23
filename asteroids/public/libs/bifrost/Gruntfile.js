module.exports = function(grunt) {

	grunt.initConfig({

		jshint: {
			all: [
				'Gruntfile.js',
				'source/**/*.js',
				'!source/libs/**/*.js'
			],
			options: {
				globals: {
					// document: true
				}
			}
		},

		requirejs: {
			compile: {
				options: {
					baseUrl: 'source',
					name: 'Bifrost',
					preserveLicenseComments: false,
					out: 'dist/Bifrost.min.js'
				}
			}
		},

		copy: {
			main: {
				files: [{
					expand: true,
					flatten: true,
					src: [
						'source/utils/hb.js',
						'source/libs/handlebars/handlebars.runtime.js'
					],
					dest: 'dist/'
				}]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('default', ['jshint', 'requirejs', 'copy']);

};
