module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			scripts: {
				files: 'static/css/main.css',
				tasks: ['cssmin'],
				options: {
					interrupt: true,
				},
			},
		},
		'dart-sass': {
			target: {
				options: {
					outputStyle: 'compressed',
					sourceMap: false,
				},
				files: {
					'static/css/main.css': 'assets/sass/main.scss',
				},
			},
		},
		cssmin: {
			options: {
				mergeIntoShorthands: false,
				roundingPrecision: -1,
			},
			target: {
				files: {
					'static/css/styles.css': ['node_modules/normalize.css/normalize.css', 'static/css/main.css'],
				},
			},
		},
	});
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-dart-sass');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.registerTask('default', 'Executed default task', ['watch']);
};
