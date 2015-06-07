/// <binding Clean='clean' ProjectOpened='watch' />
var gulp = require('gulp'),
    rimraf = require("rimraf"),
    rename = require('gulp-rename'),
    sass = require('gulp-ruby-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    prefix = require('gulp-autoprefixer'),
    minify = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    jshint = require('gulp-jshint'),
    bump = require('gulp-bump'),
    fs = require("fs");

eval("var project = " + fs.readFileSync("./project.json"));

var paths = {

    bower:   "./bower_components/",
 
    lib:     project.webroot + "/lib/",   
    scripts: project.webroot + "/scripts/",
    styles:  project.webroot + "/styles/"

};

var sassOpts = {

    parameters: {
        sourcemap: true,
        style: "expanded",
        loadPath: [
            paths.lib,
            paths.styles
        ]
    },
    error: function (err) {
        console.error('Error!', err.message);
    }

};

//
// Stylesheet Optimization
//

gulp.task('styles', function () {

    return sass(paths.styles, sassOpts.parameters)
        .on('error', sassOpts.error)
        .pipe(prefix())
        //.pipe(minify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.styles))

});

//
// Clean Script Library
//

gulp.task("clean", function (cb) {

    rimraf(paths.lib, cb);

});

//
// Copy Bower Components to Script Library
//

gulp.task("copy", ["clean"], function () {

    var bower = {
        "jquery": "jquery/jquery*.{js,map}",
        "prism": "prism/prism.js",
        "normalize.css": "normalize.css/normalize.css"
    }

    for (var destinationDir in bower) {

        gulp.src(paths.bower + bower[destinationDir])
            .pipe(gulp.dest(paths.lib + destinationDir));

    }

});

//
// File Watcher
//

gulp.task('watch', function () {

    return gulp.watch(paths.styles + "**/*.scss", ['styles']);

});

//
// Bump Version
//

gulp.task('bump', function () {

    gulp.task('bump', function(){
      gulp.src(['./bower.json', './package.json'])
      .pipe(bump())
      .pipe(gulp.dest('./'));
    });

});

//
// Bump Version Minor
//

gulp.task('bump-minor', function () {

    gulp.task('bump', function(){
      gulp.src(['./bower.json', './package.json'])
      .pipe(bump({type: 'minor'}))
      .pipe(gulp.dest('./'));
    });

});

//
// Bump Version Major
//

gulp.task('bump-major', function () {

    gulp.task('bump', function(){
      gulp.src(['./bower.json', './package.json'])
      .pipe(bump({type: 'major'}))
      .pipe(gulp.dest('./'));
    });

});

//
// Build
//

gulp.task('build', ['styles', 'bump'], function () {});

//
// Release
//

gulp.task('release', ['styles', 'bump-minor'], function () {});

//
// Default
//

gulp.task('default', ['styles', 'watch'], function () {});

