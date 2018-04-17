/// <binding Clean='clean' ProjectOpened='watch' />
var gulp = require('gulp'),
    rimraf = require("rimraf"),
    rename = require('gulp-rename'),
    sass = require('gulp-ruby-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    prefix = require('gulp-autoprefixer'),
    nano = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    bump = require('gulp-bump'),
	sassdoc = require('sassdoc'),
    fs = require("fs");

eval("var hosting = " + fs.readFileSync("./hosting.json"));

var paths = {

	lib:           hosting.webroot + "/lib/",

    css:           hosting.webroot + "/styles/css/",
	sass:          hosting.webroot + "/styles/sass/",
	lib_sass:      hosting.webroot + "/styles/lib/",

    scripts:       hosting.webroot + "/scripts/",
	lib_scripts:   hosting.webroot + "/scripts/lib/"

};

var options = {

    sass: {
        parameters: {
            sourcemap: true,
            style: "expanded",
            loadPath: [
                paths.lib_sass,
                paths.sass
            ]
        },
        error: function (err) {
            console.error('Error!', err.message);
        }
    }

};

//
// Generate Sass Documentation
//

gulp.task('sassdoc', function () {

  return gulp.src(paths.sass + "**/*.scss")
    .pipe(sassdoc());

});

//
// Clean Sass Library
//

gulp.task("clean-sass", function (cb) {

    rimraf(paths.lib_sass, cb);

});

//
// Clean Script Library
//

gulp.task("clean-scripts", function (cb) {

    rimraf(paths.lib_scripts, cb);

});

//
// Copy Bower Components to Sass Library
//

gulp.task("copy-sass", ['clean-sass'], function () {

    var bower_sass = {
        "prism": "prism/**/prism.css",
	    "watercolor": "watercolor/sass/**"
    }

    for (var destinationDir in bower_sass) {

        gulp.src(paths.lib + bower_sass[destinationDir])
            .pipe(gulp.dest(paths.lib_sass + destinationDir));

    }

});

//
// Copy Bower Components to Script Library
//

gulp.task("copy-scripts", ['clean-scripts'], function () {

    var bower_scripts = {
		"prism": "prism/**/prism.js",
        "jquery": "jquery/dist/jquery*.{js,map}"
    }

    for (var destinationDir in bower_scripts) {

        gulp.src(paths.lib + bower_scripts[destinationDir])
            .pipe(gulp.dest(paths.lib_scripts + destinationDir));

    }

});

//
// Stylesheet Generation
//

gulp.task('sass', ['copy-sass'], function () {

    return sass(paths.sass, options.sass.parameters)
        .on('error', options.sass.error)
        .pipe(prefix())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.css))

});

//
// Stylesheet Generation (Minify)
//

gulp.task('sass-minify', ['copy-sass'], function () {

    return sass(paths.sass, options.sass.parameters)
        .on('error', options.sass.error)
        .pipe(prefix())
		.pipe(nano())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.css))

});

//
// Bump Version
//

gulp.task('bump-patch', function () {

    gulp.task('bump-patch', function(){
		gulp.src(['./bower.json', './package.json', './project.json'])
			.pipe(bump({type: 'patch'}))
			.pipe(gulp.dest('./'));
    });

});

//
// Bump Version Minor
//

gulp.task('bump-minor', function () {

    gulp.task('bump-minor', function(){
		gulp.src(['./bower.json', './package.json', './project.json'])
			.pipe(bump({type: 'minor'}))
			.pipe(gulp.dest('./'));
    });

});

//
// Bump Version Major
//

gulp.task('bump-major', function () {

    gulp.task('bump-major', function(){
		gulp.src(['./bower.json', './package.json', './project.json'])
			.pipe(bump({type: 'major'}))
			.pipe(gulp.dest('./'));
    });

});

//
// File Watcher
//

gulp.task('watch', ['copy-sass', 'copy-scripts'], function () {

	gulp.watch(paths.lib + "**/*.scss", ['sass']);
    gulp.watch(paths.sass + "**/*.scss", ['sass']);

});

//
// Release - Patch
//

gulp.task('release-patch', ['sass-minify', 'bump-patch'], function () {});

//
// Release - Minor
//

gulp.task('release-minor', ['sass-minify', 'bump-minor'], function () {});

//
// Release - Major
//

gulp.task('release-major', ['sass-minify', 'bump-major'], function () {});

//
// Prepare
//

gulp.task('prepare', ['sass-minify'], function () {});

//
// Default
//

gulp.task('default', ['watch'], function () {});

