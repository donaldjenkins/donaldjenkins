module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		critical: {
			test: {
				options: {
					base: './',
					css: ['static/css/main.css'],
					width: 320,
					height: 70,
				},
				src: 'test/fixture/index.html',
				dest: 'test/generated/critical.css',
			},
		},
	});
	grunt.loadNpmTasks('grunt-critical');
};
